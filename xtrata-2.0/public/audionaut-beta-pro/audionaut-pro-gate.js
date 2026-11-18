var Mh = Object.defineProperty;
var Bh = (t, e, n) => e in t ? Mh(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Ns = (t, e, n) => Bh(t, typeof e != "symbol" ? e + "" : e, n);
const _h = ["SP", "SM"], Nh = ["ST", "SN"], Pi = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return _h.includes(n) ? "mainnet" : Nh.includes(n) ? "testnet" : null;
}, Ch = () => {
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
}, Dh = () => typeof window > "u" || !window.localStorage ? Ch() : window.localStorage, Cs = "xtrata.v15.1.wallet.session", lc = "mainnet", _r = { isConnected: !1 }, Hh = (t) => t.address ? Pi(t.address) ?? t.network : t.network, y0 = (t) => !t.isConnected || !t.address ? { ..._r } : Hh(t) !== lc ? { ..._r } : {
  isConnected: !0,
  address: t.address,
  network: lc,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, Uh = (t) => {
  if (!t)
    return { ..._r };
  try {
    const e = JSON.parse(t);
    return y0(e);
  } catch {
    return { ..._r };
  }
}, Oh = (t) => {
  const e = y0(t);
  return JSON.stringify(e);
}, Th = (t) => {
  const e = Dh();
  return {
    load: () => Uh(e.getItem(Cs)),
    save: (n) => {
      e.setItem(Cs, Oh(n));
    },
    clear: () => {
      e.removeItem(Cs);
    }
  };
};
function kh(t) {
  return (t || "").replace(/0x[0-9a-fA-F]{6,}/g, "0x…").replace(/\bS[PT][0-9A-Z]{20,}\b/g, "<addr>").replace(/\b[0-9a-fA-F]{64}\b/g, "<hash>").replace(/\b\d[\d,]*(\.\d+)?\b/g, "<n>").replace(/\s+/g, " ").trim().slice(0, 200);
}
function Ph(t, e, n, r) {
  const s = `${t}|${e ?? ""}|${n ?? ""}|${kh(r)}`;
  let i = 2166136261, o = 522970236;
  for (let a = 0; a < s.length; a += 1) {
    const f = s.charCodeAt(a);
    i = Math.imul(i ^ f, 16777619), o = Math.imul(o ^ (f << 5 | f >>> 3), 16777619);
  }
  const c = (a) => (a >>> 0).toString(16).padStart(8, "0");
  return (c(i) + c(o)).slice(0, 16);
}
function m0(t) {
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
function jh(t) {
  return t instanceof Error ? t.stack ?? void 0 : void 0;
}
const Ds = (t) => {
  if (typeof t == "number" || typeof t == "boolean") return t;
  if (typeof t == "string" && t.length > 0) return t.slice(0, 300);
};
function Fh(t) {
  if (!t || typeof t != "object") return;
  const e = t, n = {};
  for (const s of ["code", "stage", "method", "providerId", "name"]) {
    const i = Ds(e[s]);
    i !== void 0 && (n[s] = i);
  }
  const r = e.data;
  if (r && typeof r == "object") {
    const s = {};
    for (const i of ["code", "message", "reason"]) {
      const o = Ds(r[i]);
      o !== void 0 && (s[i] = o);
    }
    Object.keys(s).length > 0 && (n.data = s);
  } else {
    const s = Ds(r);
    s !== void 0 && (n.data = s);
  }
  return Object.keys(n).length > 0 ? n : void 0;
}
function zh(t, e) {
  const n = (t == null ? void 0 : t.name) ?? "", r = t == null ? void 0 : t.code, s = m0(t).toLowerCase();
  return r === -32603 || s.trim() === "internal error." ? "WALLET_RPC_INTERNAL" : n === "ReadOnlyBackoffError" || s.includes("read-only") && s.includes("backoff") ? "READ_ONLY_BACKOFF" : typeof navigator < "u" && navigator.onLine === !1 ? "NETWORK_OFFLINE" : s.includes("user rejected") || s.includes("user denied") || s.includes("user canceled") || s.includes("user cancelled") || s.includes("rejected the request") || s.includes("request rejected") ? "WALLET_REJECTED" : s.includes("no wallet") || s.includes("provider not found") || s.includes("not installed") ? "WALLET_NOT_FOUND" : s.includes("locked") ? "WALLET_LOCKED" : s.includes("session") && s.includes("expire") ? "SESSION_EXPIRED" : s.includes("insufficient") && s.includes("fee") ? "INSUFFICIENT_FEE" : s.includes("insufficient") || s.includes("not enough") ? "INSUFFICIENT_FUNDS" : s.includes("nonce") ? "NONCE_MISMATCH" : s.includes("postcondition") || s.includes("post-condition") || s.includes("post condition") ? "POST_CONDITION_FAILED" : s.includes("abort") || s.includes("runtime error") ? "CONTRACT_ABORT" : s.includes("429") || s.includes("rate limit") || s.includes("too many requests") ? "HIRO_RATE_LIMIT" : s.includes("broadcast") ? "BROADCAST_FAILED" : s.includes("timeout") || s.includes("timed out") ? "CONFIRM_TIMEOUT" : s.includes("upload") ? "UPLOAD_FAILED" : "UNCAUGHT";
}
const Rh = typeof __XTRATA_APP_VERSION__ < "u" ? __XTRATA_APP_VERSION__ : "dev", Gh = 20, fc = "xt_tel_sid";
function Nr() {
  try {
    if (typeof crypto < "u" && typeof crypto.randomUUID == "function")
      return crypto.randomUUID();
  } catch {
  }
  return `xt-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}
let Hs = null;
function Kh() {
  try {
    if (typeof sessionStorage < "u") {
      let t = sessionStorage.getItem(fc);
      return t || (t = Nr(), sessionStorage.setItem(fc, t)), t;
    }
  } catch {
  }
  return Hs || (Hs = Nr()), Hs;
}
let tn = {
  address: null,
  kind: null
}, S0 = null;
function ji(t, e) {
  if (!t) {
    tn = { address: null, kind: e ?? tn.kind };
    return;
  }
  tn = { address: t.trim(), kind: e ?? tn.kind };
}
function Fi(t) {
  S0 = typeof t == "string" && t.length > 0 ? t : null;
}
const uc = [];
class Vh {
  constructor(e, n) {
    Ns(this, "id", Nr());
    Ns(this, "n", 0);
    this.flow = e, this.target = n;
  }
  attempt() {
    return this.n += 1, this.n;
  }
}
function qh(t, e) {
  return new Vh(t, e);
}
function Mn(t) {
  try {
    const e = t.journey, n = t.flow ?? (e == null ? void 0 : e.flow) ?? "app", r = t.outcome === "error", s = t.error != null ? m0(t.error) : void 0, i = t.error != null ? jh(t.error) : void 0, o = r ? Ph(n, t.step, t.errorCode, s ?? "") : void 0, c = r ? Fh(t.error) : void 0, a = {
      ...c ? { error: c } : {},
      ...t.context ?? {}
    };
    r && uc.length && (a.breadcrumbs = uc.slice(-Gh));
    const f = {
      eventId: Nr(),
      ts: Date.now(),
      sessionId: Kh(),
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
      appVersion: Rh,
      route: t.route ?? (typeof location < "u" ? location.pathname : ""),
      walletAddress: tn.address,
      walletKind: tn.kind,
      network: S0,
      context: Object.keys(a).length ? a : void 0
    };
  } catch {
  }
}
const Wh = "https://browser.blockstack.org/auth", Yh = {
  "@type": "Person",
  "@context": "http://schema.org"
}, A0 = ["store_write"], Zh = "blockstack-session", Xh = {
  logLevel: "debug"
}, Fe = {
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
Object.freeze(Fe);
class pn extends Error {
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
class Qh extends pn {
  constructor(e, n = "") {
    super({ code: Fe.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class hc extends pn {
  constructor(e = "") {
    super({ code: Fe.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class er extends pn {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Fe.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class dc extends pn {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Fe.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class ti extends pn {
  constructor(e) {
    super({ code: Fe.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class E0 extends pn {
  constructor(e) {
    super({ code: Fe.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const gc = ["debug", "info", "warn", "error", "none"], ei = {};
for (let t = 0; t < gc.length; t++) {
  const e = gc[t];
  ei[e] = t;
}
class en {
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
    return ei[Xh.logLevel] <= ei[e];
  }
}
function Jh() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function td() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Us(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function ed() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function nd() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function rd(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function zi(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = nd(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    en.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = rd(s, t.toString(), n);
    throw en.error(i), new Error(i);
  }
  if (r)
    return {};
}
function sd(t) {
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
  if (fd(t, Uint8Array))
    return BigInt(`0x${yt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function id(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Ri(t, e = 8) {
  return (typeof t == "bigint" ? t : sd(t)).toString(16).padStart(e * 2, "0");
}
function v0(t, e = 16) {
  const n = Ri(t, e);
  return bt(n);
}
function od(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const cd = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function yt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += cd[n];
  return e;
}
function bt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = id(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function jn(t) {
  return new TextEncoder().encode(t);
}
function I0(t) {
  return new TextDecoder().decode(t);
}
function ad(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function ld(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function bc(t) {
  if (t.some(ld))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Zt(...t) {
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
function xn(t) {
  return Zt(...t.map((e) => typeof e == "number" ? bc([e]) : e instanceof Array ? bc(e) : e));
}
function fd(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const ud = "https://api.mainnet.hiro.so", hd = "https://api.testnet.hiro.so", dd = "http://localhost:3999", gd = "https://hub.blockstack.org";
function bd(t) {
  const e = typeof t == "string" ? bt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Xr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const pd = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function xd(t, e) {
  const n = {};
  return Object.assign(n, pd, e), await fetch(t, n);
}
function wd(t) {
  let e = xd, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function yd(...t) {
  const { fetchLib: e, middlewares: n } = wd(t);
  return async (s, i) => {
    let o = { url: s, init: i ?? {} };
    for (const a of n)
      typeof a.pre == "function" && (o = await Promise.resolve(a.pre({
        fetch: e,
        ...o
      })) ?? o);
    let c = await e(o.url, o.init);
    for (const a of n)
      typeof a.post == "function" && (c = await Promise.resolve(a.post({
        fetch: e,
        url: o.url,
        init: o.init,
        response: (c == null ? void 0 : c.clone()) ?? c
      })) ?? c);
    return c;
  };
}
class Qr {
  constructor(e = A0.slice(), n = ((c) => (c = zi("location", { returnEmptyObject: !0 })) == null ? void 0 : c.origin)(), r = "", s = "/manifest.json", i = void 0, o = Wh) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function ni(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function md(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function L0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Sd(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ni(t.outputLen), ni(t.blockLen);
}
function Ad(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Ed(t, e) {
  L0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const De = {
  number: ni,
  bool: md,
  bytes: L0,
  hash: Sd,
  exists: Ad,
  output: Ed
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Os = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), _t = (t, e) => t << 32 - e | t >>> e, vd = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!vd)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Id(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Gi(t) {
  if (typeof t == "string" && (t = Id(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let $0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ze(t) {
  const e = (r) => t().update(Gi(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let M0 = class extends $0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, De.hash(e);
    const r = Gi(n);
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
    return De.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    De.exists(this), De.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: c } = this;
    return e = e, e.finished = s, e.destroyed = i, e.blockLen = o, e.outputLen = c, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Jr = (t, e, n) => new M0(t, e).update(n).digest();
Jr.create = (t, e) => new M0(t, e);
function Ld(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), a = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + a, o, r), t.setUint32(e + f, c, r);
}
let Ki = class extends $0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Os(this.buffer);
  }
  update(e) {
    De.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Gi(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const a = Os(e);
        for (; s <= i - o; o += s)
          this.process(a, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    De.exists(this), De.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Ld(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = Os(e), a = this.outputLen;
    if (a % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = a / 4, u = this.get();
    if (f > u.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      c.setUint32(4 * l, u[l], i);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: c } = this;
    return e.length = s, e.pos = c, e.finished = i, e.destroyed = o, s % n && e.buffer.set(r), e;
  }
};
const $d = (t, e, n) => t & e ^ ~t & n, Md = (t, e, n) => t & e ^ t & n ^ e & n, Bd = new Uint32Array([
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
]), ee = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ne = new Uint32Array(64);
let B0 = class extends Ki {
  constructor() {
    super(64, 32, 8, !1), this.A = ee[0] | 0, this.B = ee[1] | 0, this.C = ee[2] | 0, this.D = ee[3] | 0, this.E = ee[4] | 0, this.F = ee[5] | 0, this.G = ee[6] | 0, this.H = ee[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: o, G: c, H: a } = this;
    return [e, n, r, s, i, o, c, a];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, a) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = c | 0, this.H = a | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      ne[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = ne[l - 15], h = ne[l - 2], x = _t(b, 7) ^ _t(b, 18) ^ b >>> 3, w = _t(h, 17) ^ _t(h, 19) ^ h >>> 10;
      ne[l] = w + ne[l - 7] + x + ne[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: a, G: f, H: u } = this;
    for (let l = 0; l < 64; l++) {
      const b = _t(c, 6) ^ _t(c, 11) ^ _t(c, 25), h = u + b + $d(c, a, f) + Bd[l] + ne[l] | 0, w = (_t(r, 2) ^ _t(r, 13) ^ _t(r, 22)) + Md(r, s, i) | 0;
      u = f, f = a, a = c, c = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, f = f + this.G | 0, u = u + this.H | 0, this.set(r, s, i, o, c, a, f, u);
  }
  roundClean() {
    ne.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, _d = class extends B0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const on = ze(() => new B0());
ze(() => new _d());
const Nd = {}, _0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Nd
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const V = BigInt(0), Q = BigInt(1), Le = BigInt(2), _n = BigInt(3), pc = BigInt(8), X = Object.freeze({
  a: V,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Q,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), xc = (t, e) => (t + e / Le) / e, nr = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = X, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Q * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), c = xc(i * t, e), a = xc(-r * t, e);
    let f = H(t - c * n - a * s, e), u = H(-c * r - a * i, e);
    const l = f > o, b = u > o;
    if (l && (f = e - f), b && (u = e - u), f > o || u > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: f, k2neg: b, k2: u };
  }
}, $t = 32, Ue = 32, N0 = 32, Cr = $t + 1, Dr = 2 * $t + 1;
function wc(t) {
  const { a: e, b: n } = X, r = H(t * t), s = H(r * t);
  return H(s + e * t + n);
}
const rr = X.a === V;
class Vi extends Error {
  constructor(e) {
    super(e);
  }
}
function yc(t) {
  if (!(t instanceof W))
    throw new TypeError("JacobianPoint expected");
}
class W {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof q))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(q.ZERO) ? W.ZERO : new W(e.x, e.y, Q);
  }
  static toAffineBatch(e) {
    const n = Od(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return W.toAffineBatch(e).map(W.fromAffine);
  }
  equals(e) {
    yc(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: c } = e, a = H(s * s), f = H(c * c), u = H(n * f), l = H(i * a), b = H(H(r * c) * f), h = H(H(o * s) * a);
    return u === l && b === h;
  }
  negate() {
    return new W(this.x, H(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = H(e * e), i = H(n * n), o = H(i * i), c = e + i, a = H(Le * (H(c * c) - s - o)), f = H(_n * s), u = H(f * f), l = H(u - Le * a), b = H(f * (a - l) - pc * o), h = H(Le * n * r);
    return new W(l, b, h);
  }
  add(e) {
    yc(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: c } = e;
    if (i === V || o === V)
      return this;
    if (n === V || r === V)
      return e;
    const a = H(s * s), f = H(c * c), u = H(n * f), l = H(i * a), b = H(H(r * c) * f), h = H(H(o * s) * a), x = H(l - u), w = H(h - b);
    if (x === V)
      return w === V ? this.double() : W.ZERO;
    const I = H(x * x), N = H(x * I), C = H(u * I), g = H(w * w - N - Le * C), A = H(w * (C - g) - b * N), y = H(s * c * x);
    return new W(g, A, y);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = W.ZERO;
    if (typeof e == "bigint" && e === V)
      return n;
    let r = Ac(e);
    if (r === Q)
      return this;
    if (!rr) {
      let l = n, b = this;
      for (; r > V; )
        r & Q && (l = l.add(b)), b = b.double(), r >>= Q;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: c } = nr.splitScalar(r), a = n, f = n, u = this;
    for (; i > V || c > V; )
      i & Q && (a = a.add(u)), c & Q && (f = f.add(u)), u = u.double(), i >>= Q, c >>= Q;
    return s && (a = a.negate()), o && (f = f.negate()), f = new W(H(f.x * nr.beta), f.y, f.z), a.add(f);
  }
  precomputeWindow(e) {
    const n = rr ? 128 / e + 1 : 256 / e + 1, r = [];
    let s = this, i = s;
    for (let o = 0; o < n; o++) {
      i = s, r.push(i);
      for (let c = 1; c < 2 ** (e - 1); c++)
        i = i.add(s), r.push(i);
      s = i.double();
    }
    return r;
  }
  wNAF(e, n) {
    !n && this.equals(W.BASE) && (n = q.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && ri.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = W.normalizeZ(s), ri.set(n, s)));
    let i = W.ZERO, o = W.BASE;
    const c = 1 + (rr ? 128 / r : 256 / r), a = 2 ** (r - 1), f = BigInt(2 ** r - 1), u = 2 ** r, l = BigInt(r);
    for (let b = 0; b < c; b++) {
      const h = b * a;
      let x = Number(e & f);
      e >>= l, x > a && (x -= u, e += Q);
      const w = h, I = h + Math.abs(x) - 1, N = b % 2 !== 0, C = x < 0;
      x === 0 ? o = o.add(sr(N, s[w])) : i = i.add(sr(C, s[I]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = Ac(e), s, i;
    if (rr) {
      const { k1neg: o, k1: c, k2neg: a, k2: f } = nr.splitScalar(r);
      let { p: u, f: l } = this.wNAF(c, n), { p: b, f: h } = this.wNAF(f, n);
      u = sr(o, u), b = sr(a, b), b = new W(H(b.x * nr.beta), b.y, b.z), s = u.add(b), i = l.add(h);
    } else {
      const { p: o, f: c } = this.wNAF(r, n);
      s = o, i = c;
    }
    return W.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(W.ZERO);
    e == null && (e = i ? pc : wn(s));
    const o = e, c = H(o * o), a = H(c * o), f = H(n * c), u = H(r * a), l = H(s * o);
    if (i)
      return q.ZERO;
    if (l !== Q)
      throw new Error("invZ was invalid");
    return new q(f, u);
  }
}
W.BASE = new W(X.Gx, X.Gy, Q);
W.ZERO = new W(V, Q, V);
function sr(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const ri = /* @__PURE__ */ new WeakMap();
class q {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, ri.delete(this);
  }
  hasEvenY() {
    return this.y % Le === V;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = pt(n ? e : e.subarray(1));
    if (!Ir(r))
      throw new Error("Point is not on curve");
    const s = wc(r);
    let i = Ud(s);
    const o = (i & Q) === Q;
    n ? o && (i = H(-i)) : (e[0] & 1) === 1 !== o && (i = H(-i));
    const c = new q(r, i);
    return c.assertValidity(), c;
  }
  static fromUncompressedHex(e) {
    const n = pt(e.subarray(1, $t + 1)), r = pt(e.subarray($t + 1, $t * 2 + 1)), s = new q(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = kt(e), r = n.length, s = n[0];
    if (r === $t)
      return this.fromCompressedHex(n);
    if (r === Cr && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === Dr && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Cr} compressed bytes or ${Dr} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return q.BASE.multiply(Oe(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = H0(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = qi(kt(e)), { n: c } = X, a = r === 2 || r === 3 ? s + c : s, f = wn(a, c), u = H(-o * f, c), l = H(i * f, c), b = r & 1 ? "03" : "02", h = q.fromHex(b + $e(a)), x = q.BASE.multiplyAndAddUnsafe(h, u, l);
    if (!x)
      throw new Error("Cannot recover signature: point at infinify");
    return x.assertValidity(), x;
  }
  toRawBytes(e = !1) {
    return Me(this.toHex(e));
  }
  toHex(e = !1) {
    const n = $e(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${$e(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Ir(n) || !Ir(r))
      throw new Error(e);
    const s = H(r * r), i = wc(n);
    if (H(s - i) !== V)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new q(this.x, H(-this.y));
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
    const s = W.fromAffine(this), i = n === V || n === Q || this !== q.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = W.fromAffine(e).multiplyUnsafe(r), c = i.add(o);
    return c.equals(W.ZERO) ? void 0 : c.toAffine();
  }
}
q.BASE = new q(X.Gx, X.Gy);
q.ZERO = new q(V, V);
function mc(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Sc(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${cn(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: pt(n), left: t.subarray(e + 2) };
}
function Cd(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${cn(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Sc(t.subarray(2)), { data: r, left: s } = Sc(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${cn(s)}`);
  return { r: e, s: r };
}
class Yt {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? cn(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Yt(Hr(s.slice(0, 64)), Hr(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Cd(n ? e : Me(e));
    return new Yt(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!ln(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!ln(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = X.n >> Q;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Yt(this.r, H(-this.s, X.n)) : this;
  }
  toDERRawBytes() {
    return Me(this.toDERHex());
  }
  toDERHex() {
    const e = mc(Ln(this.s)), n = mc(Ln(this.r)), r = e.length / 2, s = n.length / 2, i = Ln(r), o = Ln(s);
    return `30${Ln(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Me(this.toCompactHex());
  }
  toCompactHex() {
    return $e(this.r) + $e(this.s);
  }
}
function Ie(...t) {
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
const Dd = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function cn(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Dd[t[n]];
  return e;
}
const Hd = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function $e(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(V <= t && t < Hd))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function an(t) {
  const e = Me($e(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Ln(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Hr(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function Me(t) {
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
function pt(t) {
  return Hr(cn(t));
}
function kt(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Me(t);
}
function Ac(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && ln(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function H(t, e = X.P) {
  const n = t % e;
  return n >= V ? n : e + n;
}
function xt(t, e) {
  const { P: n } = X;
  let r = t;
  for (; e-- > V; )
    r *= r, r %= n;
  return r;
}
function Ud(t) {
  const { P: e } = X, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), c = BigInt(88), a = t * t * t % e, f = a * a * t % e, u = xt(f, _n) * f % e, l = xt(u, _n) * f % e, b = xt(l, Le) * a % e, h = xt(b, r) * b % e, x = xt(h, s) * h % e, w = xt(x, o) * x % e, I = xt(w, c) * w % e, N = xt(I, o) * x % e, C = xt(N, _n) * f % e, g = xt(C, i) * h % e, A = xt(g, n) * a % e, y = xt(A, Le);
  if (y * y % e !== t)
    throw new Error("Cannot find square root");
  return y;
}
function wn(t, e = X.P) {
  if (t === V || e <= V)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = H(t, e), r = e, s = V, i = Q;
  for (; n !== V; ) {
    const c = r / n, a = r % n, f = s - i * c;
    r = n, n = a, s = i, i = f;
  }
  if (r !== Q)
    throw new Error("invert: does not exist");
  return H(s, e);
}
function Od(t, e = X.P) {
  const n = new Array(t.length), r = t.reduce((i, o, c) => o === V ? i : (n[c] = i, H(i * o, e)), Q), s = wn(r, e);
  return t.reduceRight((i, o, c) => o === V ? i : (n[c] = H(i * n[c], e), H(i * o, e)), s), n;
}
function Td(t) {
  const e = t.length * 8 - Ue * 8, n = pt(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function qi(t, e = !1) {
  const n = Td(t);
  if (e)
    return n;
  const { n: r } = X;
  return n >= r ? n - r : n;
}
let rn, Nn;
class C0 {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return et.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return Nn(this.k, ...e);
  }
  checkSync() {
    if (typeof Nn != "function")
      throw new Vi("hmacSha256Sync needs to be set");
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
    return Ie(...n);
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
    return Ie(...n);
  }
}
function ln(t) {
  return V < t && t < X.n;
}
function Ir(t) {
  return V < t && t < X.P;
}
function D0(t, e, n, r = !0) {
  const { n: s } = X, i = qi(t, !0);
  if (!ln(i))
    return;
  const o = wn(i, s), c = q.BASE.multiply(i), a = H(c.x, s);
  if (a === V)
    return;
  const f = H(o * H(e + n * a, s), s);
  if (f === V)
    return;
  let u = new Yt(a, f), l = (c.x === u.r ? 0 : 2) | Number(c.y & Q);
  return r && u.hasHighS() && (u = u.normalizeS(), l ^= 1), { sig: u, recovery: l };
}
function Oe(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Ue)
      throw new Error("Expected 32 bytes of private key");
    e = Hr(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Ue)
      throw new Error("Expected 32 bytes of private key");
    e = pt(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!ln(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Wi(t) {
  return t instanceof q ? (t.assertValidity(), t) : q.fromHex(t);
}
function H0(t) {
  if (t instanceof Yt)
    return t.assertValidity(), t;
  try {
    return Yt.fromDER(t);
  } catch {
    return Yt.fromCompact(t);
  }
}
function Yi(t, e = !1) {
  return q.fromPrivateKey(t).toRawBytes(e);
}
function kd(t, e, n, r = !1) {
  return q.fromSignature(t, e, n).toRawBytes(r);
}
function Ec(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === Cr || r === Dr : n ? r === Cr * 2 || r === Dr * 2 : t instanceof q;
}
function Zi(t, e, n = !1) {
  if (Ec(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Ec(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Wi(e);
  return r.assertValidity(), r.multiply(Oe(t)).toRawBytes(n);
}
function U0(t) {
  const e = t.length > $t ? t.slice(0, $t) : t;
  return pt(e);
}
function Pd(t) {
  const e = U0(t), n = H(e, X.n);
  return O0(n < V ? e : n);
}
function O0(t) {
  return an(t);
}
function T0(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = kt(t), s = Oe(e), i = [O0(s), Pd(r)];
  if (n != null) {
    n === !0 && (n = et.randomBytes($t));
    const a = kt(n);
    if (a.length !== $t)
      throw new Error(`sign: Expected ${$t} bytes of extra data`);
    i.push(a);
  }
  const o = Ie(...i), c = U0(r);
  return { seed: o, m: c, d: s };
}
function k0(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function jd(t, e, n = {}) {
  const { seed: r, m: s, d: i } = T0(t, e, n.extraEntropy), o = new C0(N0, Ue);
  await o.reseed(r);
  let c;
  for (; !(c = D0(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return k0(c, n);
}
function P0(t, e, n = {}) {
  const { seed: r, m: s, d: i } = T0(t, e, n.extraEntropy), o = new C0(N0, Ue);
  o.reseedSync(r);
  let c;
  for (; !(c = D0(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return k0(c, n);
}
const Fd = { strict: !0 };
function zd(t, e, n, r = Fd) {
  let s;
  try {
    s = H0(t), e = kt(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const c = qi(e);
  let a;
  try {
    a = Wi(n);
  } catch {
    return !1;
  }
  const { n: f } = X, u = wn(o, f), l = H(c * u, f), b = H(i * u, f), h = q.BASE.multiplyAndAddUnsafe(a, l, b);
  return h ? H(h.x, f) === i : !1;
}
function Ur(t) {
  return H(pt(t), X.n);
}
class fn {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = kt(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = pt(n.subarray(0, 32)), s = pt(n.subarray(32, 64));
    return new fn(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Ir(e) || !ln(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return $e(this.r) + $e(this.s);
  }
  toRawBytes() {
    return Me(this.toHex());
  }
}
function Rd(t) {
  return q.fromPrivateKey(t).toRawX();
}
class j0 {
  constructor(e, n, r = et.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = kt(e);
    const { x: s, scalar: i } = this.getScalar(Oe(n));
    if (this.px = s, this.d = i, this.rand = kt(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = q.fromPrivateKey(e), r = n.hasEvenY() ? e : X.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return an(e ^ pt(n));
  }
  finalizeNonce(e) {
    const n = H(pt(e), X.n);
    if (n === V)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new fn(e.x, H(n + r * s, X.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = et.taggedHash, o = this.initNonce(n, await i(ve.aux, s)), { R: c, rx: a, k: f } = this.finalizeNonce(await i(ve.nonce, o, r, e)), u = Ur(await i(ve.challenge, a, r, e)), l = this.finalizeSig(c, f, u, n);
    return await R0(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = et.taggedHashSync, o = this.initNonce(n, i(ve.aux, s)), { R: c, rx: a, k: f } = this.finalizeNonce(i(ve.nonce, o, r, e)), u = Ur(i(ve.challenge, a, r, e)), l = this.finalizeSig(c, f, u, n);
    return G0(l, e, r) || this.error(), l;
  }
}
async function Gd(t, e, n) {
  return new j0(t, e, n).calc();
}
function Kd(t, e, n) {
  return new j0(t, e, n).calcSync();
}
function F0(t, e, n) {
  const r = t instanceof fn, s = r ? t : fn.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: kt(e),
    P: Wi(n)
  };
}
function z0(t, e, n, r) {
  const s = q.BASE.multiplyAndAddUnsafe(e, Oe(n), H(-r, X.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function R0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = F0(t, e, n), c = Ur(await et.taggedHash(ve.challenge, an(r), o.toRawX(), i));
    return z0(r, o, s, c);
  } catch {
    return !1;
  }
}
function G0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = F0(t, e, n), c = Ur(et.taggedHashSync(ve.challenge, an(r), o.toRawX(), i));
    return z0(r, o, s, c);
  } catch (r) {
    if (r instanceof Vi)
      throw r;
    return !1;
  }
}
const Vd = {
  Signature: fn,
  getPublicKey: Rd,
  sign: Gd,
  verify: R0,
  signSync: Kd,
  verifySync: G0
};
q.BASE._setWindowSize(8);
const dt = {
  node: _0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, ve = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, ir = {}, et = {
  bytesToHex: cn,
  hexToBytes: Me,
  concatBytes: Ie,
  mod: H,
  invert: wn,
  isValidPrivateKey(t) {
    try {
      return Oe(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: an,
  _normalizePrivateKey: Oe,
  hashToPrivateKey: (t) => {
    t = kt(t);
    const e = Ue + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = H(pt(t), X.n - Q) + Q;
    return an(n);
  },
  randomBytes: (t = 32) => {
    if (dt.web)
      return dt.web.getRandomValues(new Uint8Array(t));
    if (dt.node) {
      const { randomBytes: e } = dt.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => et.hashToPrivateKey(et.randomBytes(Ue + 8)),
  precompute(t = 8, e = q.BASE) {
    const n = e === q.BASE ? e : new q(e.x, e.y);
    return n._setWindowSize(t), n.multiply(_n), n;
  },
  sha256: async (...t) => {
    if (dt.web) {
      const e = await dt.web.subtle.digest("SHA-256", Ie(...t));
      return new Uint8Array(e);
    } else if (dt.node) {
      const { createHash: e } = dt.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (dt.web) {
      const n = await dt.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Ie(...e), s = await dt.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (dt.node) {
      const { createHmac: n } = dt.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = ir[t];
    if (n === void 0) {
      const r = await et.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Ie(r, r), ir[t] = n;
    }
    return et.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof rn != "function")
      throw new Vi("sha256Sync is undefined, you need to set it");
    let n = ir[t];
    if (n === void 0) {
      const r = rn(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Ie(r, r), ir[t] = n;
    }
    return rn(n, ...e);
  },
  _JacobianPoint: W
};
Object.defineProperties(et, {
  sha256Sync: {
    configurable: !1,
    get() {
      return rn;
    },
    set(t) {
      rn || (rn = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Nn;
    },
    set(t) {
      Nn || (Nn = t);
    }
  }
});
const qd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: X,
  Point: q,
  Signature: Yt,
  getPublicKey: Yi,
  getSharedSecret: Zi,
  recoverPublicKey: kd,
  schnorr: Vd,
  sign: jd,
  signSync: P0,
  utils: et,
  verify: zd
}, Symbol.toStringTag, { value: "Module" }));
var ft = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Wd(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function ts(t) {
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
Fn.byteLength = Jd;
var Yd = Fn.toByteArray = e1, Zd = Fn.fromByteArray = s1, Ut = [], wt = [], Xd = typeof Uint8Array < "u" ? Uint8Array : Array, Ts = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Qe = 0, Qd = Ts.length; Qe < Qd; ++Qe)
  Ut[Qe] = Ts[Qe], wt[Ts.charCodeAt(Qe)] = Qe;
wt[45] = 62;
wt[95] = 63;
function K0(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Jd(t) {
  var e = K0(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function t1(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function e1(t) {
  var e, n = K0(t), r = n[0], s = n[1], i = new Xd(t1(t, r, s)), o = 0, c = s > 0 ? r - 4 : r, a;
  for (a = 0; a < c; a += 4)
    e = wt[t.charCodeAt(a)] << 18 | wt[t.charCodeAt(a + 1)] << 12 | wt[t.charCodeAt(a + 2)] << 6 | wt[t.charCodeAt(a + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = wt[t.charCodeAt(a)] << 2 | wt[t.charCodeAt(a + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = wt[t.charCodeAt(a)] << 10 | wt[t.charCodeAt(a + 1)] << 4 | wt[t.charCodeAt(a + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function n1(t) {
  return Ut[t >> 18 & 63] + Ut[t >> 12 & 63] + Ut[t >> 6 & 63] + Ut[t & 63];
}
function r1(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(n1(r));
  return s.join("");
}
function s1(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, c = n - r; o < c; o += i)
    s.push(r1(t, o, o + i > c ? c : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    Ut[e >> 2] + Ut[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    Ut[e >> 10] + Ut[e >> 4 & 63] + Ut[e << 2 & 63] + "="
  )), s.join("");
}
function i1() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const o1 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function c1() {
  if (i1())
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
    throw new Error(o1);
  }
}
class a1 {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(Zt(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(Zt(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class l1 {
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
    const c = await this.subtleCrypto.importKey("raw", n, { name: i, length: o }, !1, ["encrypt"]), a = await this.subtleCrypto.encrypt({ name: i, iv: r }, c, s);
    return new Uint8Array(a);
  }
  async decrypt(e, n, r, s) {
    let i, o;
    if (e === "aes-128-cbc")
      i = "AES-CBC", o = 128;
    else if (e === "aes-256-cbc")
      i = "AES-CBC", o = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const c = await this.subtleCrypto.importKey("raw", n, { name: i, length: o }, !1, ["decrypt"]), a = await this.subtleCrypto.decrypt({ name: i, iv: r }, c, s);
    return new Uint8Array(a);
  }
}
async function V0() {
  const t = await c1();
  return t.name === "subtleCrypto" ? new l1(t.lib) : new a1(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function f1(t) {
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
  var o = t.length, c = t.charAt(0), a = Math.log(o) / Math.log(256), f = Math.log(256) / Math.log(o);
  function u(h) {
    if (h instanceof Uint8Array || (ArrayBuffer.isView(h) ? h = new Uint8Array(h.buffer, h.byteOffset, h.byteLength) : Array.isArray(h) && (h = Uint8Array.from(h))), !(h instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (h.length === 0)
      return "";
    for (var x = 0, w = 0, I = 0, N = h.length; I !== N && h[I] === 0; )
      I++, x++;
    for (var C = (N - I) * f + 1 >>> 0, g = new Uint8Array(C); I !== N; ) {
      for (var A = h[I], y = 0, v = C - 1; (A !== 0 || y < w) && v !== -1; v--, y++)
        A += 256 * g[v] >>> 0, g[v] = A % o >>> 0, A = A / o >>> 0;
      if (A !== 0)
        throw new Error("Non-zero carry");
      w = y, I++;
    }
    for (var D = C - w; D !== C && g[D] === 0; )
      D++;
    for (var B = c.repeat(x); D < C; ++D)
      B += t.charAt(g[D]);
    return B;
  }
  function l(h) {
    if (typeof h != "string")
      throw new TypeError("Expected String");
    if (h.length === 0)
      return new Uint8Array();
    for (var x = 0, w = 0, I = 0; h[x] === c; )
      w++, x++;
    for (var N = (h.length - x) * a + 1 >>> 0, C = new Uint8Array(N); h[x]; ) {
      var g = h.charCodeAt(x);
      if (g > 255)
        return;
      var A = e[g];
      if (A === 255)
        return;
      for (var y = 0, v = N - 1; (A !== 0 || y < I) && v !== -1; v--, y++)
        A += o * C[v] >>> 0, C[v] = A % 256 >>> 0, A = A / 256 >>> 0;
      if (A !== 0)
        throw new Error("Non-zero carry");
      I = y, x++;
    }
    for (var D = N - I; D !== N && C[D] === 0; )
      D++;
    for (var B = new Uint8Array(w + (N - D)), _ = w; D !== N; )
      B[_++] = C[D++];
    return B;
  }
  function b(h) {
    var x = l(h);
    if (x)
      return x;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: u,
    decodeUnsafe: l,
    decode: b
  };
}
var q0 = f1;
const u1 = q0, h1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var d1 = u1(h1);
const g1 = /* @__PURE__ */ Wd(d1), b1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), W0 = Uint8Array.from({ length: 16 }, (t, e) => e), p1 = W0.map((t) => (9 * t + 5) % 16);
let Xi = [W0], Qi = [p1];
for (let t = 0; t < 4; t++)
  for (let e of [Xi, Qi])
    e.push(e[t].map((n) => b1[n]));
const Y0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), x1 = Xi.map((t, e) => t.map((n) => Y0[e][n])), w1 = Qi.map((t, e) => t.map((n) => Y0[e][n])), y1 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), m1 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), or = (t, e) => t << e | t >>> 32 - e;
function vc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const cr = new Uint32Array(16);
let S1 = class extends Ki {
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
      cr[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, a = c, f = this.h3 | 0, u = f, l = this.h4 | 0, b = l;
    for (let h = 0; h < 5; h++) {
      const x = 4 - h, w = y1[h], I = m1[h], N = Xi[h], C = Qi[h], g = x1[h], A = w1[h];
      for (let y = 0; y < 16; y++) {
        const v = or(r + vc(h, i, c, f) + cr[N[y]] + w, g[y]) + l | 0;
        r = l, l = f, f = or(c, 10) | 0, c = i, i = v;
      }
      for (let y = 0; y < 16; y++) {
        const v = or(s + vc(x, o, a, u) + cr[C[y]] + I, A[y]) + b | 0;
        s = b, b = u, u = or(a, 10) | 0, a = o, o = v;
      }
    }
    this.set(this.h1 + c + u | 0, this.h2 + f + b | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + a | 0);
  }
  roundClean() {
    cr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const A1 = ze(() => new S1());
function E1(t) {
  return A1(t);
}
const ar = BigInt(2 ** 32 - 1), si = BigInt(32);
function Z0(t, e = !1) {
  return e ? { h: Number(t & ar), l: Number(t >> si & ar) } : { h: Number(t >> si & ar) | 0, l: Number(t & ar) | 0 };
}
function v1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Z0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const I1 = (t, e) => BigInt(t >>> 0) << si | BigInt(e >>> 0), L1 = (t, e, n) => t >>> n, $1 = (t, e, n) => t << 32 - n | e >>> n, M1 = (t, e, n) => t >>> n | e << 32 - n, B1 = (t, e, n) => t << 32 - n | e >>> n, _1 = (t, e, n) => t << 64 - n | e >>> n - 32, N1 = (t, e, n) => t >>> n - 32 | e << 64 - n, C1 = (t, e) => e, D1 = (t, e) => t, H1 = (t, e, n) => t << n | e >>> 32 - n, U1 = (t, e, n) => e << n | t >>> 32 - n, O1 = (t, e, n) => e << n - 32 | t >>> 64 - n, T1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function k1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const P1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), j1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, F1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), z1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, R1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), G1 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, j = {
  fromBig: Z0,
  split: v1,
  toBig: I1,
  shrSH: L1,
  shrSL: $1,
  rotrSH: M1,
  rotrSL: B1,
  rotrBH: _1,
  rotrBL: N1,
  rotr32H: C1,
  rotr32L: D1,
  rotlSH: H1,
  rotlSL: U1,
  rotlBH: O1,
  rotlBL: T1,
  add: k1,
  add3L: P1,
  add3H: j1,
  add4L: F1,
  add4H: z1,
  add5H: G1,
  add5L: R1
}, [K1, V1] = j.split([
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
].map((t) => BigInt(t))), re = new Uint32Array(80), se = new Uint32Array(80);
let es = class extends Ki {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: a, Eh: f, El: u, Fh: l, Fl: b, Gh: h, Gl: x, Hh: w, Hl: I } = this;
    return [e, n, r, s, i, o, c, a, f, u, l, b, h, x, w, I];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, a, f, u, l, b, h, x, w, I) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = a | 0, this.Eh = f | 0, this.El = u | 0, this.Fh = l | 0, this.Fl = b | 0, this.Gh = h | 0, this.Gl = x | 0, this.Hh = w | 0, this.Hl = I | 0;
  }
  process(e, n) {
    for (let g = 0; g < 16; g++, n += 4)
      re[g] = e.getUint32(n), se[g] = e.getUint32(n += 4);
    for (let g = 16; g < 80; g++) {
      const A = re[g - 15] | 0, y = se[g - 15] | 0, v = j.rotrSH(A, y, 1) ^ j.rotrSH(A, y, 8) ^ j.shrSH(A, y, 7), D = j.rotrSL(A, y, 1) ^ j.rotrSL(A, y, 8) ^ j.shrSL(A, y, 7), B = re[g - 2] | 0, _ = se[g - 2] | 0, p = j.rotrSH(B, _, 19) ^ j.rotrBH(B, _, 61) ^ j.shrSH(B, _, 6), E = j.rotrSL(B, _, 19) ^ j.rotrBL(B, _, 61) ^ j.shrSL(B, _, 6), $ = j.add4L(D, E, se[g - 7], se[g - 16]), O = j.add4H($, v, p, re[g - 7], re[g - 16]);
      re[g] = O | 0, se[g] = $ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: a, Dh: f, Dl: u, Eh: l, El: b, Fh: h, Fl: x, Gh: w, Gl: I, Hh: N, Hl: C } = this;
    for (let g = 0; g < 80; g++) {
      const A = j.rotrSH(l, b, 14) ^ j.rotrSH(l, b, 18) ^ j.rotrBH(l, b, 41), y = j.rotrSL(l, b, 14) ^ j.rotrSL(l, b, 18) ^ j.rotrBL(l, b, 41), v = l & h ^ ~l & w, D = b & x ^ ~b & I, B = j.add5L(C, y, D, V1[g], se[g]), _ = j.add5H(B, N, A, v, K1[g], re[g]), p = B | 0, E = j.rotrSH(r, s, 28) ^ j.rotrBH(r, s, 34) ^ j.rotrBH(r, s, 39), $ = j.rotrSL(r, s, 28) ^ j.rotrBL(r, s, 34) ^ j.rotrBL(r, s, 39), O = r & i ^ r & c ^ i & c, k = s & o ^ s & a ^ o & a;
      N = w | 0, C = I | 0, w = h | 0, I = x | 0, h = l | 0, x = b | 0, { h: l, l: b } = j.add(f | 0, u | 0, _ | 0, p | 0), f = c | 0, u = a | 0, c = i | 0, a = o | 0, i = r | 0, o = s | 0;
      const U = j.add3L(p, $, k);
      r = j.add3H(U, _, E, O), s = U | 0;
    }
    ({ h: r, l: s } = j.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = j.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l: a } = j.add(this.Ch | 0, this.Cl | 0, c | 0, a | 0), { h: f, l: u } = j.add(this.Dh | 0, this.Dl | 0, f | 0, u | 0), { h: l, l: b } = j.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h, l: x } = j.add(this.Fh | 0, this.Fl | 0, h | 0, x | 0), { h: w, l: I } = j.add(this.Gh | 0, this.Gl | 0, w | 0, I | 0), { h: N, l: C } = j.add(this.Hh | 0, this.Hl | 0, N | 0, C | 0), this.set(r, s, i, o, c, a, f, u, l, b, h, x, w, I, N, C);
  }
  roundClean() {
    re.fill(0), se.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, q1 = class extends es {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, W1 = class extends es {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Y1 = class extends es {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const Z1 = ze(() => new es());
ze(() => new q1());
ze(() => new W1());
ze(() => new Y1());
function X0(t) {
  return on(t);
}
function X1(t) {
  return Z1(t);
}
const Q1 = 0;
et.hmacSha256Sync = (t, ...e) => {
  const n = Jr.create(on, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function J1() {
  return yt(et.randomPrivateKey());
}
function t2(t) {
  const e = on(on(t));
  return g1.encode(Zt(t, e).slice(0, t.length + 4));
}
function e2(t, e) {
  return t2(Zt(new Uint8Array([t]), e.slice(0, 20)));
}
function Q0(t, e = Q1) {
  const n = typeof t == "string" ? bt(t) : t, r = E1(X0(n));
  return e2(e, r);
}
function J0(t) {
  const e = bd(t);
  return yt(Yi(e.slice(0, 32), !0));
}
et.hmacSha256Sync = (t, ...e) => {
  const n = Jr.create(on, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Or;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Or || (Or = {}));
async function n2(t, e, n) {
  return await (await V0()).encrypt("aes-256-cbc", e, t, n);
}
async function r2(t, e, n) {
  return await (await V0()).decrypt("aes-256-cbc", e, t, n);
}
function tl(t, e) {
  return Jr(on, t, e);
}
function s2(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function el(t) {
  const e = X1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function i2(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function o2(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Or.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Or.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !i2(t))
    return e;
  try {
    return q.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function c2(t, e, n, r) {
  const s = o2(t);
  if (!s.result)
    throw s;
  const i = et.randomPrivateKey(), o = Yi(i, !0);
  let c = Zi(i, t, !0);
  c = c.slice(1);
  const a = el(c), f = et.randomBytes(16), u = await n2(f, a.encryptionKey, e), l = Zt(f, o, u), b = tl(a.hmacKey, l);
  let h;
  if (!r || r === "hex")
    h = yt(u);
  else if (r === "base64")
    h = Zd(u);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const x = {
    iv: yt(f),
    ephemeralPK: yt(o),
    cipherText: h,
    mac: yt(b),
    wasString: n
  };
  return r && r !== "hex" && (x.cipherTextEncoding = r), x;
}
async function nl(t, e) {
  if (!e.ephemeralPK)
    throw new dc("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = Zi(t, n, !0);
  r = r.slice(1);
  const s = el(r), i = bt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = bt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = Yd(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const c = Zt(i, bt(n), o), a = tl(s.hmacKey, c), f = bt(e.mac);
  if (!s2(f, a))
    throw new dc("Decryption failed: failure in MAC check");
  const u = await r2(i, s.encryptionKey, o);
  return e.wasString ? I0(u) : u;
}
function a2(t, e) {
  const n = typeof e == "string" ? jn(e) : e, r = J0(t), s = X0(n), i = P0(s, t);
  return {
    signature: yt(i),
    publicKey: r
  };
}
async function l2(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = J0(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? jn(t) : t, o = await c2(n.publicKey, i, s, n.cipherTextEncoding);
  let c = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const a = a2(r, c), f = {
      signature: a.signature,
      publicKey: a.publicKey,
      cipherText: c
    };
    c = JSON.stringify(f);
  }
  return c;
}
function f2(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return nl(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var at = {}, un = {}, lt = {};
Object.defineProperty(lt, "__esModule", { value: !0 });
lt.decode = lt.encode = lt.unescape = lt.escape = lt.pad = void 0;
const rl = Fn;
function Ji(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
lt.pad = Ji;
function sl(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
lt.escape = sl;
function il(t) {
  return Ji(t).replace(/-/g, "+").replace(/_/g, "/");
}
lt.unescape = il;
function u2(t) {
  return sl((0, rl.fromByteArray)(new TextEncoder().encode(t)));
}
lt.encode = u2;
function h2(t) {
  return new TextDecoder().decode((0, rl.toByteArray)(Ji(il(t))));
}
lt.decode = h2;
var ns = {}, rs = {}, ol = {}, cl = {}, ss = {};
Object.defineProperty(ss, "__esModule", { value: !0 });
ss.crypto = void 0;
ss.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = c, t.u8 = a, t.u32 = f, t.clean = u, t.createView = l, t.rotr = b, t.rotl = h, t.byteSwap = x, t.byteSwap32 = w, t.bytesToHex = C, t.hexToBytes = y, t.asyncLoop = D, t.utf8ToBytes = B, t.bytesToUtf8 = _, t.toBytes = p, t.kdfInputToBytes = E, t.concatBytes = $, t.checkOpts = O, t.createHasher = U, t.createOptHasher = nt, t.createXOFer = Bt, t.randomBytes = Rt;
  const e = ss;
  function n(m) {
    return m instanceof Uint8Array || ArrayBuffer.isView(m) && m.constructor.name === "Uint8Array";
  }
  function r(m) {
    if (!Number.isSafeInteger(m) || m < 0)
      throw new Error("positive integer expected, got " + m);
  }
  function s(m, ...M) {
    if (!n(m))
      throw new Error("Uint8Array expected");
    if (M.length > 0 && !M.includes(m.length))
      throw new Error("Uint8Array expected of length " + M + ", got length=" + m.length);
  }
  function i(m) {
    if (typeof m != "function" || typeof m.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(m.outputLen), r(m.blockLen);
  }
  function o(m, M = !0) {
    if (m.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (M && m.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function c(m, M) {
    s(m);
    const Y = M.outputLen;
    if (m.length < Y)
      throw new Error("digestInto() expects output buffer of length at least " + Y);
  }
  function a(m) {
    return new Uint8Array(m.buffer, m.byteOffset, m.byteLength);
  }
  function f(m) {
    return new Uint32Array(m.buffer, m.byteOffset, Math.floor(m.byteLength / 4));
  }
  function u(...m) {
    for (let M = 0; M < m.length; M++)
      m[M].fill(0);
  }
  function l(m) {
    return new DataView(m.buffer, m.byteOffset, m.byteLength);
  }
  function b(m, M) {
    return m << 32 - M | m >>> M;
  }
  function h(m, M) {
    return m << M | m >>> 32 - M >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function x(m) {
    return m << 24 & 4278190080 | m << 8 & 16711680 | m >>> 8 & 65280 | m >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (m) => m : (m) => x(m), t.byteSwapIfBE = t.swap8IfBE;
  function w(m) {
    for (let M = 0; M < m.length; M++)
      m[M] = x(m[M]);
    return m;
  }
  t.swap32IfBE = t.isLE ? (m) => m : w;
  const I = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", N = /* @__PURE__ */ Array.from({ length: 256 }, (m, M) => M.toString(16).padStart(2, "0"));
  function C(m) {
    if (s(m), I)
      return m.toHex();
    let M = "";
    for (let Y = 0; Y < m.length; Y++)
      M += N[m[Y]];
    return M;
  }
  const g = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function A(m) {
    if (m >= g._0 && m <= g._9)
      return m - g._0;
    if (m >= g.A && m <= g.F)
      return m - (g.A - 10);
    if (m >= g.a && m <= g.f)
      return m - (g.a - 10);
  }
  function y(m) {
    if (typeof m != "string")
      throw new Error("hex string expected, got " + typeof m);
    if (I)
      return Uint8Array.fromHex(m);
    const M = m.length, Y = M / 2;
    if (M % 2)
      throw new Error("hex string expected, got unpadded hex of length " + M);
    const Z = new Uint8Array(Y);
    for (let K = 0, tt = 0; K < Y; K++, tt += 2) {
      const En = A(m.charCodeAt(tt)), Wn = A(m.charCodeAt(tt + 1));
      if (En === void 0 || Wn === void 0) {
        const ys = m[tt] + m[tt + 1];
        throw new Error('hex string expected, got non-hex character "' + ys + '" at index ' + tt);
      }
      Z[K] = En * 16 + Wn;
    }
    return Z;
  }
  const v = async () => {
  };
  t.nextTick = v;
  async function D(m, M, Y) {
    let Z = Date.now();
    for (let K = 0; K < m; K++) {
      Y(K);
      const tt = Date.now() - Z;
      tt >= 0 && tt < M || (await (0, t.nextTick)(), Z += tt);
    }
  }
  function B(m) {
    if (typeof m != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(m));
  }
  function _(m) {
    return new TextDecoder().decode(m);
  }
  function p(m) {
    return typeof m == "string" && (m = B(m)), s(m), m;
  }
  function E(m) {
    return typeof m == "string" && (m = B(m)), s(m), m;
  }
  function $(...m) {
    let M = 0;
    for (let Z = 0; Z < m.length; Z++) {
      const K = m[Z];
      s(K), M += K.length;
    }
    const Y = new Uint8Array(M);
    for (let Z = 0, K = 0; Z < m.length; Z++) {
      const tt = m[Z];
      Y.set(tt, K), K += tt.length;
    }
    return Y;
  }
  function O(m, M) {
    if (M !== void 0 && {}.toString.call(M) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(m, M);
  }
  class k {
  }
  t.Hash = k;
  function U(m) {
    const M = (Z) => m().update(p(Z)).digest(), Y = m();
    return M.outputLen = Y.outputLen, M.blockLen = Y.blockLen, M.create = () => m(), M;
  }
  function nt(m) {
    const M = (Z, K) => m(K).update(p(Z)).digest(), Y = m({});
    return M.outputLen = Y.outputLen, M.blockLen = Y.blockLen, M.create = (Z) => m(Z), M;
  }
  function Bt(m) {
    const M = (Z, K) => m(K).update(p(Z)).digest(), Y = m({});
    return M.outputLen = Y.outputLen, M.blockLen = Y.blockLen, M.create = (Z) => m(Z), M;
  }
  t.wrapConstructor = U, t.wrapConstructorWithOpts = nt, t.wrapXOFConstructorWithOpts = Bt;
  function Rt(m = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(m));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(m));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(cl);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = cl;
  class n extends e.Hash {
    constructor(i, o) {
      super(), this.finished = !1, this.destroyed = !1, (0, e.ahash)(i);
      const c = (0, e.toBytes)(o);
      if (this.iHash = i.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const a = this.blockLen, f = new Uint8Array(a);
      f.set(c.length > a ? i.create().update(c).digest() : c);
      for (let u = 0; u < f.length; u++)
        f[u] ^= 54;
      this.iHash.update(f), this.oHash = i.create();
      for (let u = 0; u < f.length; u++)
        f[u] ^= 106;
      this.oHash.update(f), (0, e.clean)(f);
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
      const { oHash: o, iHash: c, finished: a, destroyed: f, blockLen: u, outputLen: l } = this;
      return i = i, i.finished = a, i.destroyed = f, i.blockLen = u, i.outputLen = l, i.oHash = o._cloneInto(i.oHash), i.iHash = c._cloneInto(i.iHash), i;
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
})(ol);
const Je = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function al(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function ii(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Re(t, ...e) {
  if (!al(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function d2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  ii(t.outputLen), ii(t.blockLen);
}
function oi(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function ll(t, e) {
  Re(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function g2(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function b2(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Tr(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function Lr(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function St(t, e) {
  return t << 32 - e | t >>> e;
}
function p2(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const to = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function eo(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const fl = to ? (t) => t : (t) => eo(t), x2 = fl;
function ul(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = eo(t[e]);
  return t;
}
const w2 = to ? (t) => t : ul, hl = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", y2 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function m2(t) {
  if (Re(t), hl)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += y2[t[n]];
  return e;
}
const Vt = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Ic(t) {
  if (t >= Vt._0 && t <= Vt._9)
    return t - Vt._0;
  if (t >= Vt.A && t <= Vt.F)
    return t - (Vt.A - 10);
  if (t >= Vt.a && t <= Vt.f)
    return t - (Vt.a - 10);
}
function S2(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (hl)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = Ic(t.charCodeAt(i)), c = Ic(t.charCodeAt(i + 1));
    if (o === void 0 || c === void 0) {
      const a = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + a + '" at index ' + i);
    }
    r[s] = o * 16 + c;
  }
  return r;
}
const dl = async () => {
};
async function A2(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await dl(), r += i);
  }
}
function no(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function E2(t) {
  return new TextDecoder().decode(t);
}
function zn(t) {
  return typeof t == "string" && (t = no(t)), Re(t), t;
}
function v2(t) {
  return typeof t == "string" && (t = no(t)), Re(t), t;
}
function I2(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    Re(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function L2(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let gl = class {
};
function is(t) {
  const e = (r) => t().update(zn(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function bl(t) {
  const e = (r, s) => t(s).update(zn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function pl(t) {
  const e = (r, s) => t(s).update(zn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const $2 = is, M2 = bl, B2 = pl;
function _2(t = 32) {
  if (Je && typeof Je.getRandomValues == "function")
    return Je.getRandomValues(new Uint8Array(t));
  if (Je && typeof Je.randomBytes == "function")
    return Uint8Array.from(Je.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const N2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: gl,
  abytes: Re,
  aexists: oi,
  ahash: d2,
  anumber: ii,
  aoutput: ll,
  asyncLoop: A2,
  byteSwap: eo,
  byteSwap32: ul,
  byteSwapIfBE: x2,
  bytesToHex: m2,
  bytesToUtf8: E2,
  checkOpts: L2,
  clean: Tr,
  concatBytes: I2,
  createHasher: is,
  createOptHasher: bl,
  createView: Lr,
  createXOFer: pl,
  hexToBytes: S2,
  isBytes: al,
  isLE: to,
  kdfInputToBytes: v2,
  nextTick: dl,
  randomBytes: _2,
  rotl: p2,
  rotr: St,
  swap32IfBE: w2,
  swap8IfBE: fl,
  toBytes: zn,
  u32: b2,
  u8: g2,
  utf8ToBytes: no,
  wrapConstructor: $2,
  wrapConstructorWithOpts: M2,
  wrapXOFConstructorWithOpts: B2
}, Symbol.toStringTag, { value: "Module" }));
function C2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), a = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + a, o, r), t.setUint32(e + f, c, r);
}
function D2(t, e, n) {
  return t & e ^ ~t & n;
}
function H2(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class U2 extends gl {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = Lr(this.buffer);
  }
  update(e) {
    oi(this), e = zn(e), Re(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const a = Lr(e);
        for (; s <= i - o; o += s)
          this.process(a, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    oi(this), ll(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, Tr(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    C2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = Lr(e), a = this.outputLen;
    if (a % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = a / 4, u = this.get();
    if (f > u.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      c.setUint32(4 * l, u[l], i);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: c } = this;
    return e.destroyed = o, e.finished = i, e.length = s, e.pos = c, s % n && e.buffer.set(r), e;
  }
  clone() {
    return this._cloneInto();
  }
}
const ie = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), oe = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), O2 = /* @__PURE__ */ Uint32Array.from([
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
]), ce = /* @__PURE__ */ new Uint32Array(64);
let ro = class extends U2 {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = ie[0] | 0, this.B = ie[1] | 0, this.C = ie[2] | 0, this.D = ie[3] | 0, this.E = ie[4] | 0, this.F = ie[5] | 0, this.G = ie[6] | 0, this.H = ie[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: o, G: c, H: a } = this;
    return [e, n, r, s, i, o, c, a];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, a) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = c | 0, this.H = a | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      ce[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = ce[l - 15], h = ce[l - 2], x = St(b, 7) ^ St(b, 18) ^ b >>> 3, w = St(h, 17) ^ St(h, 19) ^ h >>> 10;
      ce[l] = w + ce[l - 7] + x + ce[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: a, G: f, H: u } = this;
    for (let l = 0; l < 64; l++) {
      const b = St(c, 6) ^ St(c, 11) ^ St(c, 25), h = u + b + D2(c, a, f) + O2[l] + ce[l] | 0, w = (St(r, 2) ^ St(r, 13) ^ St(r, 22)) + H2(r, s, i) | 0;
      u = f, f = a, a = c, c = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, f = f + this.G | 0, u = u + this.H | 0, this.set(r, s, i, o, c, a, f, u);
  }
  roundClean() {
    Tr(ce);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Tr(this.buffer);
  }
}, xl = class extends ro {
  constructor() {
    super(28), this.A = oe[0] | 0, this.B = oe[1] | 0, this.C = oe[2] | 0, this.D = oe[3] | 0, this.E = oe[4] | 0, this.F = oe[5] | 0, this.G = oe[6] | 0, this.H = oe[7] | 0;
  }
};
const T2 = /* @__PURE__ */ is(() => new ro()), k2 = /* @__PURE__ */ is(() => new xl()), P2 = ro, j2 = T2, F2 = xl, z2 = k2, R2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: F2,
  SHA256: P2,
  sha224: z2,
  sha256: j2
}, Symbol.toStringTag, { value: "Module" })), os = /* @__PURE__ */ ts(R2), G2 = /* @__PURE__ */ ts(qd);
var hn = {};
Object.defineProperty(hn, "__esModule", { value: !0 });
hn.joseToDer = hn.derToJose = void 0;
const wl = Fn, yl = lt;
function ks(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const K2 = {
  ES256: ks(256),
  ES384: ks(384),
  ES512: ks(521)
};
function ml(t) {
  const e = K2[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const kr = 128, Sl = 0, V2 = 32, q2 = 16, W2 = 2, Al = q2 | V2 | Sl << 6, Pr = W2 | Sl << 6;
function El(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, wl.toByteArray)((0, yl.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function Y2(t, e) {
  const n = El(t), r = ml(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== Al)
    throw new Error('Could not find expected "seq"');
  let c = n[o++];
  if (c === (kr | 1) && (c = n[o++]), i - o < c)
    throw new Error(`"seq" specified length of "${c}", only "${i - o}" remaining`);
  if (n[o++] !== Pr)
    throw new Error('Could not find expected "int" for "r"');
  const a = n[o++];
  if (i - o - 2 < a)
    throw new Error(`"r" specified length of "${a}", only "${i - o - 2}" available`);
  if (s < a)
    throw new Error(`"r" specified length of "${a}", max of "${s}" is acceptable`);
  const f = o;
  if (o += a, n[o++] !== Pr)
    throw new Error('Could not find expected "int" for "s"');
  const u = n[o++];
  if (i - o !== u)
    throw new Error(`"s" specified length of "${u}", expected "${i - o}"`);
  if (s < u)
    throw new Error(`"s" specified length of "${u}", max of "${s}" is acceptable`);
  const l = o;
  if (o += u, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const b = r - a, h = r - u, x = new Uint8Array(b + a + h + u);
  for (o = 0; o < b; ++o)
    x[o] = 0;
  x.set(n.subarray(f + Math.max(-b, 0), f + a), o), o = r;
  for (const w = o; o < w + h; ++o)
    x[o] = 0;
  return x.set(n.subarray(l + Math.max(-h, 0), l + u), o), (0, yl.escape)((0, wl.fromByteArray)(x));
}
hn.derToJose = Y2;
function Lc(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= kr && --r, r;
}
function Z2(t, e) {
  t = El(t);
  const n = ml(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Lc(t, 0, n), i = Lc(t, n, t.length), o = n - s, c = n - i, a = 2 + o + 1 + 1 + c, f = a < kr, u = new Uint8Array((f ? 2 : 3) + a);
  let l = 0;
  return u[l++] = Al, f ? u[l++] = a : (u[l++] = kr | 1, u[l++] = a & 255), u[l++] = Pr, u[l++] = o, s < 0 ? (u[l++] = 0, u.set(t.subarray(0, n), l), l += n) : (u.set(t.subarray(s, n), l), l += n - s), u[l++] = Pr, u[l++] = c, i < 0 ? (u[l++] = 0, u.set(t.subarray(n), l)) : u.set(t.subarray(n + i), l), u;
}
hn.joseToDer = Z2;
var Xt = {};
Object.defineProperty(Xt, "__esModule", { value: !0 });
Xt.InvalidTokenError = Xt.MissingParametersError = void 0;
class X2 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Xt.MissingParametersError = X2;
class Q2 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Xt.InvalidTokenError = Q2;
const Rn = /* @__PURE__ */ ts(N2);
Object.defineProperty(rs, "__esModule", { value: !0 });
rs.SECP256K1Client = void 0;
const J2 = ol, tg = os, $r = G2, $c = hn, Mc = Xt, Bc = Rn;
$r.utils.hmacSha256Sync = (t, ...e) => {
  const n = J2.hmac.create(tg.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class vl {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Bc.bytesToHex)($r.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Mc.MissingParametersError("a signing input hash and private key are all required");
    const s = $r.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Bc.bytesToHex)(s);
    if (r === "jose")
      return (0, $c.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, $c.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Mc.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return $r.verify(n, e, r, { strict: !1 });
  }
}
rs.SECP256K1Client = vl;
vl.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = rs;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(ns);
var Te = {};
const eg = /* @__PURE__ */ ts(_0);
var ng = ft && ft.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function c(u) {
      try {
        f(r.next(u));
      } catch (l) {
        o(l);
      }
    }
    function a(u) {
      try {
        f(r.throw(u));
      } catch (l) {
        o(l);
      }
    }
    function f(u) {
      u.done ? i(u.value) : s(u.value).then(c, a);
    }
    f((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Te, "__esModule", { value: !0 });
Te.hashSha256Async = Te.hashSha256 = void 0;
const rg = os;
function Il(t) {
  return (0, rg.sha256)(t);
}
Te.hashSha256 = Il;
function sg(t) {
  return ng(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = eg;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Il(t));
    }
  });
}
Te.hashSha256Async = sg;
var ig = ft && ft.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function c(u) {
      try {
        f(r.next(u));
      } catch (l) {
        o(l);
      }
    }
    function a(u) {
      try {
        f(r.throw(u));
      } catch (l) {
        o(l);
      }
    }
    function f(u) {
      u.done ? i(u.value) : s(u.value).then(c, a);
    }
    f((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(un, "__esModule", { value: !0 });
un.TokenSigner = un.createUnsecuredToken = void 0;
const ci = lt, _c = ns, og = Xt, Nc = Te;
function ai(t, e) {
  const n = [], r = ci.encode(JSON.stringify(e));
  n.push(r);
  const s = ci.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function cg(t) {
  return ai(t, { typ: "JWT", alg: "none" }) + ".";
}
un.createUnsecuredToken = cg;
class ag {
  constructor(e, n) {
    if (!(e && n))
      throw new og.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !_c.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = _c.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = ai(e, s), o = (0, Nc.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return ig(this, void 0, void 0, function* () {
      const s = this.header(r), i = ai(e, s), o = yield (0, Nc.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [ci.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
un.TokenSigner = ag;
var cs = {};
Object.defineProperty(cs, "__esModule", { value: !0 });
cs.TokenVerifier = void 0;
const lg = lt, Cc = ns, fg = Xt, lr = Te;
class ug {
  constructor(e, n) {
    if (!(e && n))
      throw new fg.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Cc.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Cc.cryptoClients[e], this.rawPublicKey = n;
  }
  verify(e) {
    return typeof e == "string" ? this.verifyCompact(e, !1) : typeof e == "object" ? this.verifyExpanded(e, !1) : !1;
  }
  verifyAsync(e) {
    return typeof e == "string" ? this.verifyCompact(e, !0) : typeof e == "object" ? this.verifyExpanded(e, !0) : Promise.resolve(!1);
  }
  verifyCompact(e, n) {
    const r = e.split("."), s = r[0] + "." + r[1], i = (o) => {
      const c = this.cryptoClient.loadSignature(r[2]);
      return this.cryptoClient.verifyHash(o, c, this.rawPublicKey);
    };
    if (n)
      return (0, lr.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, lr.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), lg.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((c) => {
      const a = this.cryptoClient.loadSignature(c);
      this.cryptoClient.verifyHash(o, a, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, lr.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, lr.hashSha256)(r);
      return i(o);
    }
  }
}
cs.TokenVerifier = ug;
var as = {};
Object.defineProperty(as, "__esModule", { value: !0 });
as.decodeToken = void 0;
const fr = lt;
function hg(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(fr.decode(e[0])), r = JSON.parse(fr.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = fr.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(fr.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
as.decodeToken = hg;
(function(t) {
  var e = ft && ft.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var c = Object.getOwnPropertyDescriptor(s, i);
    (!c || ("get" in c ? !s.__esModule : c.writable || c.configurable)) && (c = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, c);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = ft && ft.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(un, t), n(cs, t), n(as, t), n(Xt, t), n(ns, t);
})(at);
function dg(t) {
  return `did:btc-addr:${t}`;
}
function gg(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new hc("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new hc('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function Ll(t) {
  if (t)
    return gg(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const bg = "1.4.0";
function pg() {
  return J1();
}
function xg(t, e, n, r = A0.slice(), s, i = Jh().getTime(), o = {}) {
  const c = (h) => {
    const x = zi("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${h}=undefined])`
    });
    return x == null ? void 0 : x.origin;
  };
  e || (e = `${c("redirectURI")}/`), n || (n = `${c("manifestURI")}/manifest.json`), s || (s = c("appDomain"));
  const a = Object.assign({}, o, {
    jti: ed(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: bg,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), f = at.SECP256K1Client.derivePublicKey(t);
  a.public_keys = [f];
  const u = Q0(f);
  return a.iss = dg(u), new at.TokenSigner("ES256k", t).sign(a);
}
async function Dc(t, e) {
  const n = I0(bt(e)), r = JSON.parse(n), s = await nl(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function wg(t) {
  const e = at.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new at.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function yg(t) {
  const e = at.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = Ll(e.iss);
  if (n.length === 1) {
    if (Q0(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function mg(t) {
  const e = at.decodeToken(t).payload;
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
function Sg(t) {
  const e = at.decodeToken(t).payload;
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
function Ag(t) {
  const e = [
    Sg(t),
    mg(t),
    wg(t),
    yg(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Hc = "1.0.0";
class Be {
  constructor(e) {
    this.version = Hc, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Hc)
      throw new ti(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Be(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class $l {
  constructor(e) {
    if (e) {
      const n = new Be(e);
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
class Uc extends $l {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Be({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new E0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Be({})), !0;
  }
}
class Oc extends $l {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Zh, !localStorage.getItem(this.key)) {
      const r = new Be({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new E0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Be.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Be({})), !0;
  }
}
var Hn;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Hn || (Hn = {}));
var jr;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(jr || (jr = {}));
Hn.Mainnet;
var Wt;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Wt || (Wt = {}));
var Ot;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ot || (Ot = {}));
Wt.Mainnet;
const Ml = {
  chainId: Hn.Mainnet,
  transactionVersion: Wt.Mainnet,
  peerNetworkId: jr.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Ot.MainnetSingleSig,
    multiSig: Ot.MainnetMultiSig
  },
  client: { baseUrl: ud }
}, li = {
  chainId: Hn.Testnet,
  transactionVersion: Wt.Testnet,
  peerNetworkId: jr.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Ot.TestnetSingleSig,
    multiSig: Ot.TestnetMultiSig
  },
  client: { baseUrl: hd }
}, Mr = {
  ...li,
  addressVersion: { ...li.addressVersion },
  magicBytes: "id",
  client: { baseUrl: dd }
}, Eg = {
  ...Mr,
  addressVersion: { ...Mr.addressVersion },
  client: { ...Mr.client }
};
function vg(t) {
  switch (t) {
    case "mainnet":
      return Ml;
    case "testnet":
      return li;
    case "devnet":
      return Mr;
    case "mocknet":
      return Eg;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Bl(t) {
  return typeof t == "string" ? vg(t) : t;
}
var Tc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Tc || (Tc = {}));
var kc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(kc || (kc = {}));
var At;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(At || (At = {}));
const Ps = ["onChainOnly", "offChainOnly", "any"];
Ps[0] + "", At.OnChainOnly, Ps[1] + "", At.OffChainOnly, Ps[2] + "", At.Any, At.OnChainOnly + "", At.OnChainOnly, At.OffChainOnly + "", At.OffChainOnly, At.Any + "", At.Any;
var Pc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Pc || (Pc = {}));
var jc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(jc || (jc = {}));
var Fc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Fc || (Fc = {}));
var qt;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(qt || (qt = {}));
var zc;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(zc || (zc = {}));
var Rc;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Rc || (Rc = {}));
var Gc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Gc || (Gc = {}));
var Kc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Kc || (Kc = {}));
var Vc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Vc || (Vc = {}));
var qc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(qc || (qc = {}));
var Wc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Wc || (Wc = {}));
var Yc;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Yc || (Yc = {}));
var Zc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Zc || (Zc = {}));
function fi(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Ig(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function _l(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Lg(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  fi(t.outputLen), fi(t.blockLen);
}
function $g(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Mg(t, e) {
  _l(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const He = {
  number: fi,
  bool: Ig,
  bytes: _l,
  hash: Lg,
  exists: $g,
  output: Mg
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const js = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Nt = (t, e) => t << 32 - e | t >>> e, Bg = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Bg)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function _g(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function so(t) {
  if (typeof t == "string" && (t = _g(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Nl = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ge(t) {
  const e = (r) => t().update(so(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
class Cl extends Nl {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, He.hash(e);
    const r = so(n);
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
    return He.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    He.exists(this), He.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: c } = this;
    return e = e, e.finished = s, e.destroyed = i, e.blockLen = o, e.outputLen = c, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const Dl = (t, e, n) => new Cl(t, e).update(n).digest();
Dl.create = (t, e) => new Cl(t, e);
function Ng(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), a = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + a, o, r), t.setUint32(e + f, c, r);
}
let io = class extends Nl {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = js(this.buffer);
  }
  update(e) {
    He.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = so(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const a = js(e);
        for (; s <= i - o; o += s)
          this.process(a, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    He.exists(this), He.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Ng(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = js(e), a = this.outputLen;
    if (a % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = a / 4, u = this.get();
    if (f > u.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      c.setUint32(4 * l, u[l], i);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: c } = this;
    return e.length = s, e.pos = c, e.finished = i, e.destroyed = o, s % n && e.buffer.set(r), e;
  }
};
const Cg = (t, e, n) => t & e ^ ~t & n, Dg = (t, e, n) => t & e ^ t & n ^ e & n, Hg = new Uint32Array([
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
]), ae = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), le = new Uint32Array(64);
let Hl = class extends io {
  constructor() {
    super(64, 32, 8, !1), this.A = ae[0] | 0, this.B = ae[1] | 0, this.C = ae[2] | 0, this.D = ae[3] | 0, this.E = ae[4] | 0, this.F = ae[5] | 0, this.G = ae[6] | 0, this.H = ae[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: o, G: c, H: a } = this;
    return [e, n, r, s, i, o, c, a];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, a) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = c | 0, this.H = a | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      le[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = le[l - 15], h = le[l - 2], x = Nt(b, 7) ^ Nt(b, 18) ^ b >>> 3, w = Nt(h, 17) ^ Nt(h, 19) ^ h >>> 10;
      le[l] = w + le[l - 7] + x + le[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: a, G: f, H: u } = this;
    for (let l = 0; l < 64; l++) {
      const b = Nt(c, 6) ^ Nt(c, 11) ^ Nt(c, 25), h = u + b + Cg(c, a, f) + Hg[l] + le[l] | 0, w = (Nt(r, 2) ^ Nt(r, 13) ^ Nt(r, 22)) + Dg(r, s, i) | 0;
      u = f, f = a, a = c, c = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, f = f + this.G | 0, u = u + this.H | 0, this.set(r, s, i, o, c, a, f, u);
  }
  roundClean() {
    le.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Ug = class extends Hl {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Ul = Ge(() => new Hl());
Ge(() => new Ug());
var ls = {}, oo = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = Rn;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, c) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let a = [], f = 0;
    for (let h = o.length - 1; h >= 0; h--)
      if (f < 4) {
        const x = n.indexOf(o[h]) >> f;
        let w = 0;
        h !== 0 && (w = n.indexOf(o[h - 1]));
        const I = 1 + f, N = w % (1 << I) << 5 - I, C = t.c32[x + N];
        f = I, a.unshift(C);
      } else
        f = 0;
    let u = 0;
    for (let h = 0; h < a.length && a[h] === "0"; h++)
      u++;
    a = a.slice(u);
    const l = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), b = l ? l[0].length : 0;
    for (let h = 0; h < b; h++)
      a.unshift(t.c32[0]);
    if (c) {
      const h = c - a.length;
      for (let x = 0; x < h; x++)
        a.unshift(t.c32[0]);
    }
    return a.join("");
  }
  t.c32encode = r;
  function s(o) {
    return o.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  t.c32normalize = s;
  function i(o, c) {
    if (o = s(o), !o.match(`^[${t.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const a = o.match(`^${t.c32[0]}*`), f = a ? a[0].length : 0;
    let u = [], l = 0, b = 0;
    for (let w = o.length - 1; w >= 0; w--) {
      b === 4 && (u.unshift(n[l]), b = 0, l = 0);
      const N = (t.c32.indexOf(o[w]) << b) + l, C = n[N % 16];
      if (b += 1, l = N >> 4, l > 1 << b)
        throw new Error("Panic error in decoding.");
      u.unshift(C);
    }
    u.unshift(n[l]), u.length % 2 === 1 && u.unshift("0");
    let h = 0;
    for (let w = 0; w < u.length && u[w] === "0"; w++)
      h++;
    u = u.slice(h - h % 2);
    let x = u.join("");
    for (let w = 0; w < f; w++)
      x = `00${x}`;
    if (c) {
      const w = c * 2 - x.length;
      for (let I = 0; I < w; I += 2)
        x = `00${x}`;
    }
    return x;
  }
  t.c32decode = i;
})(oo);
var ke = {};
Object.defineProperty(ke, "__esModule", { value: !0 });
ke.c32checkDecode = ke.c32checkEncode = void 0;
const Xc = os, Qc = Rn, Cn = oo;
function Ol(t) {
  const e = (0, Xc.sha256)((0, Xc.sha256)((0, Qc.hexToBytes)(t)));
  return (0, Qc.bytesToHex)(e.slice(0, 4));
}
function Og(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Ol(`${n}${e}`), s = (0, Cn.c32encode)(`${e}${r}`);
  return `${Cn.c32[t]}${s}`;
}
ke.c32checkEncode = Og;
function Tg(t) {
  t = (0, Cn.c32normalize)(t);
  const e = (0, Cn.c32decode)(t.slice(1)), n = t[0], r = Cn.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), Ol(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
ke.c32checkDecode = Tg;
var Tl = {}, dn = {};
Object.defineProperty(dn, "__esModule", { value: !0 });
dn.decode = dn.encode = void 0;
const Fr = os, Jc = Rn, kl = q0, Pl = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function kg(t, e = "00") {
  const n = typeof t == "string" ? (0, Jc.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Jc.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Fr.sha256)((0, Fr.sha256)(new Uint8Array([...r, ...n])));
  return kl(Pl).encode([...r, ...n, ...s.slice(0, 4)]);
}
dn.encode = kg;
function Pg(t) {
  const e = kl(Pl).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Fr.sha256)((0, Fr.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
dn.decode = Pg;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = ke, n = dn, r = Rn;
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
  function o(u, l) {
    if (!l.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, e.c32checkEncode)(u, l)}`;
  }
  t.c32address = o;
  function c(u) {
    if (u.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (u[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, e.c32checkDecode)(u.slice(1));
  }
  t.c32addressDecode = c;
  function a(u, l = -1) {
    const b = n.decode(u), h = (0, r.bytesToHex)(b.data), x = parseInt((0, r.bytesToHex)(b.prefix), 16);
    let w;
    return l < 0 ? (w = x, s[x] !== void 0 && (w = s[x])) : w = l, o(w, h);
  }
  t.b58ToC32 = a;
  function f(u, l = -1) {
    const b = c(u), h = b[0], x = b[1];
    let w;
    l < 0 ? (w = h, i[h] !== void 0 && (w = i[h])) : w = l;
    let I = w.toString(16);
    return I.length === 1 && (I = `0${I}`), n.encode(x, I);
  }
  t.c32ToB58 = f;
})(Tl);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = oo;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = ke;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Tl;
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
})(ls);
function jg(t, e) {
  switch (e = Bl(e ?? Ml), t) {
    case qt.P2PKH:
      switch (e.transactionVersion) {
        case Wt.Mainnet:
          return Ot.MainnetSingleSig;
        case Wt.Testnet:
          return Ot.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case qt.P2SH:
    case qt.P2SHNonSequential:
    case qt.P2WPKH:
    case qt.P2WSH:
    case qt.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Wt.Mainnet:
          return Ot.MainnetMultiSig;
        case Wt.Testnet:
          return Ot.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const Fg = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), jl = Uint8Array.from({ length: 16 }, (t, e) => e), zg = jl.map((t) => (9 * t + 5) % 16);
let co = [jl], ao = [zg];
for (let t = 0; t < 4; t++)
  for (let e of [co, ao])
    e.push(e[t].map((n) => Fg[n]));
const Fl = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Rg = co.map((t, e) => t.map((n) => Fl[e][n])), Gg = ao.map((t, e) => t.map((n) => Fl[e][n])), Kg = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Vg = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ur = (t, e) => t << e | t >>> 32 - e;
function ta(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const hr = new Uint32Array(16);
let qg = class extends io {
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
      hr[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, a = c, f = this.h3 | 0, u = f, l = this.h4 | 0, b = l;
    for (let h = 0; h < 5; h++) {
      const x = 4 - h, w = Kg[h], I = Vg[h], N = co[h], C = ao[h], g = Rg[h], A = Gg[h];
      for (let y = 0; y < 16; y++) {
        const v = ur(r + ta(h, i, c, f) + hr[N[y]] + w, g[y]) + l | 0;
        r = l, l = f, f = ur(c, 10) | 0, c = i, i = v;
      }
      for (let y = 0; y < 16; y++) {
        const v = ur(s + ta(x, o, a, u) + hr[C[y]] + I, A[y]) + b | 0;
        s = b, b = u, u = ur(a, 10) | 0, a = o, o = v;
      }
    }
    this.set(this.h1 + c + u | 0, this.h2 + f + b | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + a | 0);
  }
  roundClean() {
    hr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Wg = Ge(() => new qg()), dr = BigInt(2 ** 32 - 1), ui = BigInt(32);
function zl(t, e = !1) {
  return e ? { h: Number(t & dr), l: Number(t >> ui & dr) } : { h: Number(t >> ui & dr) | 0, l: Number(t & dr) | 0 };
}
function Yg(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = zl(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Zg = (t, e) => BigInt(t >>> 0) << ui | BigInt(e >>> 0), Xg = (t, e, n) => t >>> n, Qg = (t, e, n) => t << 32 - n | e >>> n, Jg = (t, e, n) => t >>> n | e << 32 - n, tb = (t, e, n) => t << 32 - n | e >>> n, eb = (t, e, n) => t << 64 - n | e >>> n - 32, nb = (t, e, n) => t >>> n - 32 | e << 64 - n, rb = (t, e) => e, sb = (t, e) => t, ib = (t, e, n) => t << n | e >>> 32 - n, ob = (t, e, n) => e << n | t >>> 32 - n, cb = (t, e, n) => e << n - 32 | t >>> 64 - n, ab = (t, e, n) => t << n - 32 | e >>> 64 - n;
function lb(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const fb = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), ub = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, hb = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), db = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, gb = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), bb = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, F = {
  fromBig: zl,
  split: Yg,
  toBig: Zg,
  shrSH: Xg,
  shrSL: Qg,
  rotrSH: Jg,
  rotrSL: tb,
  rotrBH: eb,
  rotrBL: nb,
  rotr32H: rb,
  rotr32L: sb,
  rotlSH: ib,
  rotlSL: ob,
  rotlBH: cb,
  rotlBL: ab,
  add: lb,
  add3L: fb,
  add3H: ub,
  add4L: hb,
  add4H: db,
  add5H: bb,
  add5L: gb
}, [pb, xb] = F.split([
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
].map((t) => BigInt(t))), fe = new Uint32Array(80), ue = new Uint32Array(80);
let fs = class extends io {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: a, Eh: f, El: u, Fh: l, Fl: b, Gh: h, Gl: x, Hh: w, Hl: I } = this;
    return [e, n, r, s, i, o, c, a, f, u, l, b, h, x, w, I];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, a, f, u, l, b, h, x, w, I) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = a | 0, this.Eh = f | 0, this.El = u | 0, this.Fh = l | 0, this.Fl = b | 0, this.Gh = h | 0, this.Gl = x | 0, this.Hh = w | 0, this.Hl = I | 0;
  }
  process(e, n) {
    for (let g = 0; g < 16; g++, n += 4)
      fe[g] = e.getUint32(n), ue[g] = e.getUint32(n += 4);
    for (let g = 16; g < 80; g++) {
      const A = fe[g - 15] | 0, y = ue[g - 15] | 0, v = F.rotrSH(A, y, 1) ^ F.rotrSH(A, y, 8) ^ F.shrSH(A, y, 7), D = F.rotrSL(A, y, 1) ^ F.rotrSL(A, y, 8) ^ F.shrSL(A, y, 7), B = fe[g - 2] | 0, _ = ue[g - 2] | 0, p = F.rotrSH(B, _, 19) ^ F.rotrBH(B, _, 61) ^ F.shrSH(B, _, 6), E = F.rotrSL(B, _, 19) ^ F.rotrBL(B, _, 61) ^ F.shrSL(B, _, 6), $ = F.add4L(D, E, ue[g - 7], ue[g - 16]), O = F.add4H($, v, p, fe[g - 7], fe[g - 16]);
      fe[g] = O | 0, ue[g] = $ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: a, Dh: f, Dl: u, Eh: l, El: b, Fh: h, Fl: x, Gh: w, Gl: I, Hh: N, Hl: C } = this;
    for (let g = 0; g < 80; g++) {
      const A = F.rotrSH(l, b, 14) ^ F.rotrSH(l, b, 18) ^ F.rotrBH(l, b, 41), y = F.rotrSL(l, b, 14) ^ F.rotrSL(l, b, 18) ^ F.rotrBL(l, b, 41), v = l & h ^ ~l & w, D = b & x ^ ~b & I, B = F.add5L(C, y, D, xb[g], ue[g]), _ = F.add5H(B, N, A, v, pb[g], fe[g]), p = B | 0, E = F.rotrSH(r, s, 28) ^ F.rotrBH(r, s, 34) ^ F.rotrBH(r, s, 39), $ = F.rotrSL(r, s, 28) ^ F.rotrBL(r, s, 34) ^ F.rotrBL(r, s, 39), O = r & i ^ r & c ^ i & c, k = s & o ^ s & a ^ o & a;
      N = w | 0, C = I | 0, w = h | 0, I = x | 0, h = l | 0, x = b | 0, { h: l, l: b } = F.add(f | 0, u | 0, _ | 0, p | 0), f = c | 0, u = a | 0, c = i | 0, a = o | 0, i = r | 0, o = s | 0;
      const U = F.add3L(p, $, k);
      r = F.add3H(U, _, E, O), s = U | 0;
    }
    ({ h: r, l: s } = F.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = F.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l: a } = F.add(this.Ch | 0, this.Cl | 0, c | 0, a | 0), { h: f, l: u } = F.add(this.Dh | 0, this.Dl | 0, f | 0, u | 0), { h: l, l: b } = F.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h, l: x } = F.add(this.Fh | 0, this.Fl | 0, h | 0, x | 0), { h: w, l: I } = F.add(this.Gh | 0, this.Gl | 0, w | 0, I | 0), { h: N, l: C } = F.add(this.Hh | 0, this.Hl | 0, N | 0, C | 0), this.set(r, s, i, o, c, a, f, u, l, b, h, x, w, I, N, C);
  }
  roundClean() {
    fe.fill(0), ue.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, wb = class extends fs {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, yb = class extends fs {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, mb = class extends fs {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ge(() => new fs());
Ge(() => new wb());
Ge(() => new yb());
Ge(() => new mb());
var zr = { exports: {} };
zr.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", c = "[object Boolean]", a = "[object Date]", f = "[object Error]", u = "[object Function]", l = "[object GeneratorFunction]", b = "[object Map]", h = "[object Number]", x = "[object Object]", w = "[object Promise]", I = "[object RegExp]", N = "[object Set]", C = "[object String]", g = "[object Symbol]", A = "[object WeakMap]", y = "[object ArrayBuffer]", v = "[object DataView]", D = "[object Float32Array]", B = "[object Float64Array]", _ = "[object Int8Array]", p = "[object Int16Array]", E = "[object Int32Array]", $ = "[object Uint8Array]", O = "[object Uint8ClampedArray]", k = "[object Uint16Array]", U = "[object Uint32Array]", nt = /[\\^$.*+?()[\]{}|]/g, Bt = /\w*$/, Rt = /^\[object .+?Constructor\]$/, m = /^(?:0|[1-9]\d*)$/, M = {};
  M[i] = M[o] = M[y] = M[v] = M[c] = M[a] = M[D] = M[B] = M[_] = M[p] = M[E] = M[b] = M[h] = M[x] = M[I] = M[N] = M[C] = M[g] = M[$] = M[O] = M[k] = M[U] = !0, M[f] = M[u] = M[A] = !1;
  var Y = typeof ft == "object" && ft && ft.Object === Object && ft, Z = typeof self == "object" && self && self.Object === Object && self, K = Y || Z || Function("return this")(), tt = e && !e.nodeType && e, En = tt && !0 && t && !t.nodeType && t, Wn = En && En.exports === tt;
  function ys(d, S) {
    return d.set(S[0], S[1]), d;
  }
  function hu(d, S) {
    return d.add(S), d;
  }
  function du(d, S) {
    for (var L = -1, T = d ? d.length : 0; ++L < T && S(d[L], L, d) !== !1; )
      ;
    return d;
  }
  function gu(d, S) {
    for (var L = -1, T = S.length, ot = d.length; ++L < T; )
      d[ot + L] = S[L];
    return d;
  }
  function jo(d, S, L, T) {
    for (var ot = -1, ut = d ? d.length : 0; ++ot < ut; )
      L = S(L, d[ot], ot, d);
    return L;
  }
  function bu(d, S) {
    for (var L = -1, T = Array(d); ++L < d; )
      T[L] = S(L);
    return T;
  }
  function pu(d, S) {
    return d == null ? void 0 : d[S];
  }
  function Fo(d) {
    var S = !1;
    if (d != null && typeof d.toString != "function")
      try {
        S = !!(d + "");
      } catch {
      }
    return S;
  }
  function zo(d) {
    var S = -1, L = Array(d.size);
    return d.forEach(function(T, ot) {
      L[++S] = [ot, T];
    }), L;
  }
  function ms(d, S) {
    return function(L) {
      return d(S(L));
    };
  }
  function Ro(d) {
    var S = -1, L = Array(d.size);
    return d.forEach(function(T) {
      L[++S] = T;
    }), L;
  }
  var xu = Array.prototype, wu = Function.prototype, Yn = Object.prototype, Ss = K["__core-js_shared__"], Go = function() {
    var d = /[^.]+$/.exec(Ss && Ss.keys && Ss.keys.IE_PROTO || "");
    return d ? "Symbol(src)_1." + d : "";
  }(), Ko = wu.toString, te = Yn.hasOwnProperty, Zn = Yn.toString, yu = RegExp(
    "^" + Ko.call(te).replace(nt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Vo = Wn ? K.Buffer : void 0, qo = K.Symbol, Wo = K.Uint8Array, mu = ms(Object.getPrototypeOf, Object), Su = Object.create, Au = Yn.propertyIsEnumerable, Eu = xu.splice, Yo = Object.getOwnPropertySymbols, vu = Vo ? Vo.isBuffer : void 0, Iu = ms(Object.keys, Object), As = Ze(K, "DataView"), vn = Ze(K, "Map"), Es = Ze(K, "Promise"), vs = Ze(K, "Set"), Is = Ze(K, "WeakMap"), In = Ze(Object, "create"), Lu = Ce(As), $u = Ce(vn), Mu = Ce(Es), Bu = Ce(vs), _u = Ce(Is), Zo = qo ? qo.prototype : void 0, Xo = Zo ? Zo.valueOf : void 0;
  function _e(d) {
    var S = -1, L = d ? d.length : 0;
    for (this.clear(); ++S < L; ) {
      var T = d[S];
      this.set(T[0], T[1]);
    }
  }
  function Nu() {
    this.__data__ = In ? In(null) : {};
  }
  function Cu(d) {
    return this.has(d) && delete this.__data__[d];
  }
  function Du(d) {
    var S = this.__data__;
    if (In) {
      var L = S[d];
      return L === r ? void 0 : L;
    }
    return te.call(S, d) ? S[d] : void 0;
  }
  function Hu(d) {
    var S = this.__data__;
    return In ? S[d] !== void 0 : te.call(S, d);
  }
  function Uu(d, S) {
    var L = this.__data__;
    return L[d] = In && S === void 0 ? r : S, this;
  }
  _e.prototype.clear = Nu, _e.prototype.delete = Cu, _e.prototype.get = Du, _e.prototype.has = Hu, _e.prototype.set = Uu;
  function Gt(d) {
    var S = -1, L = d ? d.length : 0;
    for (this.clear(); ++S < L; ) {
      var T = d[S];
      this.set(T[0], T[1]);
    }
  }
  function Ou() {
    this.__data__ = [];
  }
  function Tu(d) {
    var S = this.__data__, L = Xn(S, d);
    if (L < 0)
      return !1;
    var T = S.length - 1;
    return L == T ? S.pop() : Eu.call(S, L, 1), !0;
  }
  function ku(d) {
    var S = this.__data__, L = Xn(S, d);
    return L < 0 ? void 0 : S[L][1];
  }
  function Pu(d) {
    return Xn(this.__data__, d) > -1;
  }
  function ju(d, S) {
    var L = this.__data__, T = Xn(L, d);
    return T < 0 ? L.push([d, S]) : L[T][1] = S, this;
  }
  Gt.prototype.clear = Ou, Gt.prototype.delete = Tu, Gt.prototype.get = ku, Gt.prototype.has = Pu, Gt.prototype.set = ju;
  function We(d) {
    var S = -1, L = d ? d.length : 0;
    for (this.clear(); ++S < L; ) {
      var T = d[S];
      this.set(T[0], T[1]);
    }
  }
  function Fu() {
    this.__data__ = {
      hash: new _e(),
      map: new (vn || Gt)(),
      string: new _e()
    };
  }
  function zu(d) {
    return Qn(this, d).delete(d);
  }
  function Ru(d) {
    return Qn(this, d).get(d);
  }
  function Gu(d) {
    return Qn(this, d).has(d);
  }
  function Ku(d, S) {
    return Qn(this, d).set(d, S), this;
  }
  We.prototype.clear = Fu, We.prototype.delete = zu, We.prototype.get = Ru, We.prototype.has = Gu, We.prototype.set = Ku;
  function Ye(d) {
    this.__data__ = new Gt(d);
  }
  function Vu() {
    this.__data__ = new Gt();
  }
  function qu(d) {
    return this.__data__.delete(d);
  }
  function Wu(d) {
    return this.__data__.get(d);
  }
  function Yu(d) {
    return this.__data__.has(d);
  }
  function Zu(d, S) {
    var L = this.__data__;
    if (L instanceof Gt) {
      var T = L.__data__;
      if (!vn || T.length < n - 1)
        return T.push([d, S]), this;
      L = this.__data__ = new We(T);
    }
    return L.set(d, S), this;
  }
  Ye.prototype.clear = Vu, Ye.prototype.delete = qu, Ye.prototype.get = Wu, Ye.prototype.has = Yu, Ye.prototype.set = Zu;
  function Xu(d, S) {
    var L = Ms(d) || Sh(d) ? bu(d.length, String) : [], T = L.length, ot = !!T;
    for (var ut in d)
      te.call(d, ut) && !(ot && (ut == "length" || xh(ut, T))) && L.push(ut);
    return L;
  }
  function Qo(d, S, L) {
    var T = d[S];
    (!(te.call(d, S) && nc(T, L)) || L === void 0 && !(S in d)) && (d[S] = L);
  }
  function Xn(d, S) {
    for (var L = d.length; L--; )
      if (nc(d[L][0], S))
        return L;
    return -1;
  }
  function Qu(d, S) {
    return d && Jo(S, Bs(S), d);
  }
  function Ls(d, S, L, T, ot, ut, Kt) {
    var ht;
    if (T && (ht = ut ? T(d, ot, ut, Kt) : T(d)), ht !== void 0)
      return ht;
    if (!Jn(d))
      return d;
    var ic = Ms(d);
    if (ic) {
      if (ht = gh(d), !S)
        return uh(d, ht);
    } else {
      var Xe = Ne(d), oc = Xe == u || Xe == l;
      if (Eh(d))
        return sh(d, S);
      if (Xe == x || Xe == i || oc && !ut) {
        if (Fo(d))
          return ut ? d : {};
        if (ht = bh(oc ? {} : d), !S)
          return hh(d, Qu(ht, d));
      } else {
        if (!M[Xe])
          return ut ? d : {};
        ht = ph(d, Xe, Ls, S);
      }
    }
    Kt || (Kt = new Ye());
    var cc = Kt.get(d);
    if (cc)
      return cc;
    if (Kt.set(d, ht), !ic)
      var ac = L ? dh(d) : Bs(d);
    return du(ac || d, function(_s, tr) {
      ac && (tr = _s, _s = d[tr]), Qo(ht, tr, Ls(_s, S, L, T, tr, d, Kt));
    }), ht;
  }
  function Ju(d) {
    return Jn(d) ? Su(d) : {};
  }
  function th(d, S, L) {
    var T = S(d);
    return Ms(d) ? T : gu(T, L(d));
  }
  function eh(d) {
    return Zn.call(d);
  }
  function nh(d) {
    if (!Jn(d) || yh(d))
      return !1;
    var S = sc(d) || Fo(d) ? yu : Rt;
    return S.test(Ce(d));
  }
  function rh(d) {
    if (!ec(d))
      return Iu(d);
    var S = [];
    for (var L in Object(d))
      te.call(d, L) && L != "constructor" && S.push(L);
    return S;
  }
  function sh(d, S) {
    if (S)
      return d.slice();
    var L = new d.constructor(d.length);
    return d.copy(L), L;
  }
  function $s(d) {
    var S = new d.constructor(d.byteLength);
    return new Wo(S).set(new Wo(d)), S;
  }
  function ih(d, S) {
    var L = S ? $s(d.buffer) : d.buffer;
    return new d.constructor(L, d.byteOffset, d.byteLength);
  }
  function oh(d, S, L) {
    var T = S ? L(zo(d), !0) : zo(d);
    return jo(T, ys, new d.constructor());
  }
  function ch(d) {
    var S = new d.constructor(d.source, Bt.exec(d));
    return S.lastIndex = d.lastIndex, S;
  }
  function ah(d, S, L) {
    var T = S ? L(Ro(d), !0) : Ro(d);
    return jo(T, hu, new d.constructor());
  }
  function lh(d) {
    return Xo ? Object(Xo.call(d)) : {};
  }
  function fh(d, S) {
    var L = S ? $s(d.buffer) : d.buffer;
    return new d.constructor(L, d.byteOffset, d.length);
  }
  function uh(d, S) {
    var L = -1, T = d.length;
    for (S || (S = Array(T)); ++L < T; )
      S[L] = d[L];
    return S;
  }
  function Jo(d, S, L, T) {
    L || (L = {});
    for (var ot = -1, ut = S.length; ++ot < ut; ) {
      var Kt = S[ot], ht = void 0;
      Qo(L, Kt, ht === void 0 ? d[Kt] : ht);
    }
    return L;
  }
  function hh(d, S) {
    return Jo(d, tc(d), S);
  }
  function dh(d) {
    return th(d, Bs, tc);
  }
  function Qn(d, S) {
    var L = d.__data__;
    return wh(S) ? L[typeof S == "string" ? "string" : "hash"] : L.map;
  }
  function Ze(d, S) {
    var L = pu(d, S);
    return nh(L) ? L : void 0;
  }
  var tc = Yo ? ms(Yo, Object) : Lh, Ne = eh;
  (As && Ne(new As(new ArrayBuffer(1))) != v || vn && Ne(new vn()) != b || Es && Ne(Es.resolve()) != w || vs && Ne(new vs()) != N || Is && Ne(new Is()) != A) && (Ne = function(d) {
    var S = Zn.call(d), L = S == x ? d.constructor : void 0, T = L ? Ce(L) : void 0;
    if (T)
      switch (T) {
        case Lu:
          return v;
        case $u:
          return b;
        case Mu:
          return w;
        case Bu:
          return N;
        case _u:
          return A;
      }
    return S;
  });
  function gh(d) {
    var S = d.length, L = d.constructor(S);
    return S && typeof d[0] == "string" && te.call(d, "index") && (L.index = d.index, L.input = d.input), L;
  }
  function bh(d) {
    return typeof d.constructor == "function" && !ec(d) ? Ju(mu(d)) : {};
  }
  function ph(d, S, L, T) {
    var ot = d.constructor;
    switch (S) {
      case y:
        return $s(d);
      case c:
      case a:
        return new ot(+d);
      case v:
        return ih(d, T);
      case D:
      case B:
      case _:
      case p:
      case E:
      case $:
      case O:
      case k:
      case U:
        return fh(d, T);
      case b:
        return oh(d, T, L);
      case h:
      case C:
        return new ot(d);
      case I:
        return ch(d);
      case N:
        return ah(d, T, L);
      case g:
        return lh(d);
    }
  }
  function xh(d, S) {
    return S = S ?? s, !!S && (typeof d == "number" || m.test(d)) && d > -1 && d % 1 == 0 && d < S;
  }
  function wh(d) {
    var S = typeof d;
    return S == "string" || S == "number" || S == "symbol" || S == "boolean" ? d !== "__proto__" : d === null;
  }
  function yh(d) {
    return !!Go && Go in d;
  }
  function ec(d) {
    var S = d && d.constructor, L = typeof S == "function" && S.prototype || Yn;
    return d === L;
  }
  function Ce(d) {
    if (d != null) {
      try {
        return Ko.call(d);
      } catch {
      }
      try {
        return d + "";
      } catch {
      }
    }
    return "";
  }
  function mh(d) {
    return Ls(d, !0, !0);
  }
  function nc(d, S) {
    return d === S || d !== d && S !== S;
  }
  function Sh(d) {
    return Ah(d) && te.call(d, "callee") && (!Au.call(d, "callee") || Zn.call(d) == i);
  }
  var Ms = Array.isArray;
  function rc(d) {
    return d != null && vh(d.length) && !sc(d);
  }
  function Ah(d) {
    return Ih(d) && rc(d);
  }
  var Eh = vu || $h;
  function sc(d) {
    var S = Jn(d) ? Zn.call(d) : "";
    return S == u || S == l;
  }
  function vh(d) {
    return typeof d == "number" && d > -1 && d % 1 == 0 && d <= s;
  }
  function Jn(d) {
    var S = typeof d;
    return !!d && (S == "object" || S == "function");
  }
  function Ih(d) {
    return !!d && typeof d == "object";
  }
  function Bs(d) {
    return rc(d) ? Xu(d) : rh(d);
  }
  function Lh() {
    return [];
  }
  function $h() {
    return !1;
  }
  t.exports = mh;
})(zr, zr.exports);
zr.exports;
var hi;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(hi || (hi = {}));
function Sb(t, e) {
  return { type: hi.Address, version: t, hash160: e };
}
function Ab(t) {
  return ls.c32address(t.version, t.hash160);
}
const Eb = (t) => Wg(Ul(t)), vb = (t) => yt(Eb(t));
et.hmacSha256Sync = (t, ...e) => {
  const n = Dl.create(Ul, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Ib(t, e = "mainnet") {
  e = Bl(e), t = typeof t == "string" ? bt(t) : t;
  const n = jg(qt.P2PKH, e), r = Sb(n, vb(t));
  return Ab(r);
}
function Lb(t, e) {
  const n = at.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = Ib(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new at.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function $b(t, e = null) {
  let n;
  e ? n = Lb(t, e) : n = at.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const ea = "_blockstackDidCheckEchoReply", Mb = "echoReply", Bb = "authContinuation";
function _b(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function Nb() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[ea];
  if (typeof e == "boolean")
    return e;
  const n = _b(t.location.search), r = n[Mb];
  if (r) {
    t[ea] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[Bb];
      t.location.href = i;
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
      this.appConfig = new Qr();
    else
      throw new Qh("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new Oc(e.sessionOptions) : this.store = new Oc() : e ? this.store = new Uc(e.sessionOptions) : this.store = new Uc();
  }
  makeAuthRequestToken(e, n, r, s, i, o = td().getTime(), c = {}) {
    const a = this.appConfig;
    if (!a)
      throw new ti("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || a.redirectURI(), r = r || a.manifestURI(), s = s || a.scopes, i = i || a.appDomain, xg(e, n, r, s, i, o, c);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = pg();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = zi("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (Nb())
        return en.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      en.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = yd()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new er("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = at.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await Ag(e))
      throw new er("Invalid authentication response.");
    let c = i.private_key, a = i.core_token;
    if (Us(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            c = await Dc(s, i.private_key);
          } catch {
            if (en.warn("Failed decryption of appPrivateKey, will try to use as given"), !et.isValidPrivateKey(i.private_key))
              throw new er("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (a != null)
          try {
            a = await Dc(s, a);
          } catch {
            en.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new er("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let f = gd, u;
    Us(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (f = i.hubUrl), Us(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (u = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: Ll(i.iss),
      appPrivateKey: c,
      coreSessionToken: a,
      authResponseToken: e,
      hubUrl: f,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: u
    }, b = i.profile_url;
    if (!l.profile && b) {
      const h = await n(b);
      if (!h.ok)
        l.profile = Object.assign({}, Yh);
      else {
        const x = await h.text(), w = JSON.parse(x);
        l.profile = $b(w[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new ti("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), l2(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), f2(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
Un.prototype.makeAuthRequest = Un.prototype.makeAuthRequestToken;
const Cb = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], Db = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = Cb(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!us(r.id));
  return e.concat(n);
}, us = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), lo = "STX_PROVIDER", Pt = () => typeof window > "u" ? null : window.localStorage.getItem(lo), Rl = (t) => {
  typeof window < "u" && window.localStorage.setItem(lo, t);
}, Gl = () => {
  typeof window < "u" && window.localStorage.removeItem(lo);
};
(function() {
  (function(t) {
    (function(e) {
      var n = typeof globalThis < "u" && globalThis || typeof t < "u" && t || // eslint-disable-next-line no-undef
      typeof ft < "u" && ft || {}, r = {
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
      function s(p) {
        return p && DataView.prototype.isPrototypeOf(p);
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
        ], o = ArrayBuffer.isView || function(p) {
          return p && i.indexOf(Object.prototype.toString.call(p)) > -1;
        };
      function c(p) {
        if (typeof p != "string" && (p = String(p)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(p) || p === "")
          throw new TypeError('Invalid character in header field name: "' + p + '"');
        return p.toLowerCase();
      }
      function a(p) {
        return typeof p != "string" && (p = String(p)), p;
      }
      function f(p) {
        var E = {
          next: function() {
            var $ = p.shift();
            return { done: $ === void 0, value: $ };
          }
        };
        return r.iterable && (E[Symbol.iterator] = function() {
          return E;
        }), E;
      }
      function u(p) {
        this.map = {}, p instanceof u ? p.forEach(function(E, $) {
          this.append($, E);
        }, this) : Array.isArray(p) ? p.forEach(function(E) {
          if (E.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + E.length);
          this.append(E[0], E[1]);
        }, this) : p && Object.getOwnPropertyNames(p).forEach(function(E) {
          this.append(E, p[E]);
        }, this);
      }
      u.prototype.append = function(p, E) {
        p = c(p), E = a(E);
        var $ = this.map[p];
        this.map[p] = $ ? $ + ", " + E : E;
      }, u.prototype.delete = function(p) {
        delete this.map[c(p)];
      }, u.prototype.get = function(p) {
        return p = c(p), this.has(p) ? this.map[p] : null;
      }, u.prototype.has = function(p) {
        return this.map.hasOwnProperty(c(p));
      }, u.prototype.set = function(p, E) {
        this.map[c(p)] = a(E);
      }, u.prototype.forEach = function(p, E) {
        for (var $ in this.map)
          this.map.hasOwnProperty($) && p.call(E, this.map[$], $, this);
      }, u.prototype.keys = function() {
        var p = [];
        return this.forEach(function(E, $) {
          p.push($);
        }), f(p);
      }, u.prototype.values = function() {
        var p = [];
        return this.forEach(function(E) {
          p.push(E);
        }), f(p);
      }, u.prototype.entries = function() {
        var p = [];
        return this.forEach(function(E, $) {
          p.push([$, E]);
        }), f(p);
      }, r.iterable && (u.prototype[Symbol.iterator] = u.prototype.entries);
      function l(p) {
        if (!p._noBody) {
          if (p.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          p.bodyUsed = !0;
        }
      }
      function b(p) {
        return new Promise(function(E, $) {
          p.onload = function() {
            E(p.result);
          }, p.onerror = function() {
            $(p.error);
          };
        });
      }
      function h(p) {
        var E = new FileReader(), $ = b(E);
        return E.readAsArrayBuffer(p), $;
      }
      function x(p) {
        var E = new FileReader(), $ = b(E), O = /charset=([A-Za-z0-9_-]+)/.exec(p.type), k = O ? O[1] : "utf-8";
        return E.readAsText(p, k), $;
      }
      function w(p) {
        for (var E = new Uint8Array(p), $ = new Array(E.length), O = 0; O < E.length; O++)
          $[O] = String.fromCharCode(E[O]);
        return $.join("");
      }
      function I(p) {
        if (p.slice)
          return p.slice(0);
        var E = new Uint8Array(p.byteLength);
        return E.set(new Uint8Array(p)), E.buffer;
      }
      function N() {
        return this.bodyUsed = !1, this._initBody = function(p) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = p, p ? typeof p == "string" ? this._bodyText = p : r.blob && Blob.prototype.isPrototypeOf(p) ? this._bodyBlob = p : r.formData && FormData.prototype.isPrototypeOf(p) ? this._bodyFormData = p : r.searchParams && URLSearchParams.prototype.isPrototypeOf(p) ? this._bodyText = p.toString() : r.arrayBuffer && r.blob && s(p) ? (this._bodyArrayBuffer = I(p.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(p) || o(p)) ? this._bodyArrayBuffer = I(p) : this._bodyText = p = Object.prototype.toString.call(p) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof p == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(p) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var p = l(this);
          if (p)
            return p;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var p = l(this);
            return p || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
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
          var p = l(this);
          if (p)
            return p;
          if (this._bodyBlob)
            return x(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(w(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(y);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var C = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function g(p) {
        var E = p.toUpperCase();
        return C.indexOf(E) > -1 ? E : p;
      }
      function A(p, E) {
        if (!(this instanceof A))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        E = E || {};
        var $ = E.body;
        if (p instanceof A) {
          if (p.bodyUsed)
            throw new TypeError("Already read");
          this.url = p.url, this.credentials = p.credentials, E.headers || (this.headers = new u(p.headers)), this.method = p.method, this.mode = p.mode, this.signal = p.signal, !$ && p._bodyInit != null && ($ = p._bodyInit, p.bodyUsed = !0);
        } else
          this.url = String(p);
        if (this.credentials = E.credentials || this.credentials || "same-origin", (E.headers || !this.headers) && (this.headers = new u(E.headers)), this.method = g(E.method || this.method || "GET"), this.mode = E.mode || this.mode || null, this.signal = E.signal || this.signal || function() {
          if ("AbortController" in n) {
            var U = new AbortController();
            return U.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && $)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody($), (this.method === "GET" || this.method === "HEAD") && (E.cache === "no-store" || E.cache === "no-cache")) {
          var O = /([?&])_=[^&]*/;
          if (O.test(this.url))
            this.url = this.url.replace(O, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var k = /\?/;
            this.url += (k.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      A.prototype.clone = function() {
        return new A(this, { body: this._bodyInit });
      };
      function y(p) {
        var E = new FormData();
        return p.trim().split("&").forEach(function($) {
          if ($) {
            var O = $.split("="), k = O.shift().replace(/\+/g, " "), U = O.join("=").replace(/\+/g, " ");
            E.append(decodeURIComponent(k), decodeURIComponent(U));
          }
        }), E;
      }
      function v(p) {
        var E = new u(), $ = p.replace(/\r?\n[\t ]+/g, " ");
        return $.split("\r").map(function(O) {
          return O.indexOf(`
`) === 0 ? O.substr(1, O.length) : O;
        }).forEach(function(O) {
          var k = O.split(":"), U = k.shift().trim();
          if (U) {
            var nt = k.join(":").trim();
            try {
              E.append(U, nt);
            } catch (Bt) {
              console.warn("Response " + Bt.message);
            }
          }
        }), E;
      }
      N.call(A.prototype);
      function D(p, E) {
        if (!(this instanceof D))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (E || (E = {}), this.type = "default", this.status = E.status === void 0 ? 200 : E.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = E.statusText === void 0 ? "" : "" + E.statusText, this.headers = new u(E.headers), this.url = E.url || "", this._initBody(p);
      }
      N.call(D.prototype), D.prototype.clone = function() {
        return new D(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new u(this.headers),
          url: this.url
        });
      }, D.error = function() {
        var p = new D(null, { status: 200, statusText: "" });
        return p.ok = !1, p.status = 0, p.type = "error", p;
      };
      var B = [301, 302, 303, 307, 308];
      D.redirect = function(p, E) {
        if (B.indexOf(E) === -1)
          throw new RangeError("Invalid status code");
        return new D(null, { status: E, headers: { location: p } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(E, $) {
          this.message = E, this.name = $;
          var O = Error(E);
          this.stack = O.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function _(p, E) {
        return new Promise(function($, O) {
          var k = new A(p, E);
          if (k.signal && k.signal.aborted)
            return O(new e.DOMException("Aborted", "AbortError"));
          var U = new XMLHttpRequest();
          function nt() {
            U.abort();
          }
          U.onload = function() {
            var m = {
              statusText: U.statusText,
              headers: v(U.getAllResponseHeaders() || "")
            };
            k.url.indexOf("file://") === 0 && (U.status < 200 || U.status > 599) ? m.status = 200 : m.status = U.status, m.url = "responseURL" in U ? U.responseURL : m.headers.get("X-Request-URL");
            var M = "response" in U ? U.response : U.responseText;
            setTimeout(function() {
              $(new D(M, m));
            }, 0);
          }, U.onerror = function() {
            setTimeout(function() {
              O(new TypeError("Network request failed"));
            }, 0);
          }, U.ontimeout = function() {
            setTimeout(function() {
              O(new TypeError("Network request timed out"));
            }, 0);
          }, U.onabort = function() {
            setTimeout(function() {
              O(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function Bt(m) {
            try {
              return m === "" && n.location.href ? n.location.href : m;
            } catch {
              return m;
            }
          }
          if (U.open(k.method, Bt(k.url), !0), k.credentials === "include" ? U.withCredentials = !0 : k.credentials === "omit" && (U.withCredentials = !1), "responseType" in U && (r.blob ? U.responseType = "blob" : r.arrayBuffer && (U.responseType = "arraybuffer")), E && typeof E.headers == "object" && !(E.headers instanceof u || n.Headers && E.headers instanceof n.Headers)) {
            var Rt = [];
            Object.getOwnPropertyNames(E.headers).forEach(function(m) {
              Rt.push(c(m)), U.setRequestHeader(m, a(E.headers[m]));
            }), k.headers.forEach(function(m, M) {
              Rt.indexOf(M) === -1 && U.setRequestHeader(M, m);
            });
          } else
            k.headers.forEach(function(m, M) {
              U.setRequestHeader(M, m);
            });
          k.signal && (k.signal.addEventListener("abort", nt), U.onreadystatechange = function() {
            U.readyState === 4 && k.signal.removeEventListener("abort", nt);
          }), U.send(typeof k._bodyInit > "u" ? null : k._bodyInit);
        });
      }
      return _.polyfill = !0, n.fetch || (n.fetch = _, n.Headers = u, n.Request = A, n.Response = D), e.Headers = u, e.Request = A, e.Response = D, e.fetch = _, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : ft);
})();
const Hb = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Ub(t, e) {
  const n = {};
  return Object.assign(n, Hb, e), await fetch(t, n);
}
function Ob(t) {
  let e = Ub, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Tb(...t) {
  const { fetchLib: e, middlewares: n } = Ob(t);
  return async (s, i) => {
    let o = { url: s, init: i ?? {} };
    for (const a of n)
      typeof a.pre == "function" && (o = await Promise.resolve(a.pre({
        fetch: e,
        ...o
      })) ?? o);
    let c = await e(o.url, o.init);
    for (const a of n)
      typeof a.post == "function" && (c = await Promise.resolve(a.post({
        fetch: e,
        url: o.url,
        init: o.init,
        response: (c == null ? void 0 : c.clone()) ?? c
      })) ?? c);
    return c;
  };
}
var gn;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(gn || (gn = {}));
var Pe;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Pe || (Pe = {}));
var na;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(na || (na = {}));
const kb = "https://api.mainnet.hiro.so", Pb = "https://api.testnet.hiro.so", jb = "http://localhost:3999", Fb = ["mainnet", "testnet", "devnet", "mocknet"];
class je {
  constructor(e) {
    this.version = Pe.Mainnet, this.chainId = gn.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Pe.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Tb();
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
je.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new di();
    case "testnet":
      return new gi();
    case "devnet":
      return new zb();
    case "mocknet":
      return new Kl();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Fb.join(", ")}`);
  }
};
je.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : je.fromName(t);
class di extends je {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? kb,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Pe.Mainnet, this.chainId = gn.Mainnet;
  }
}
class gi extends je {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Pb,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Pe.Testnet, this.chainId = gn.Testnet;
  }
}
class Kl extends je {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? jb,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Pe.Testnet, this.chainId = gn.Testnet;
  }
}
const zb = Kl;
var bi;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(bi || (bi = {}));
var ra;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ra || (ra = {}));
bi.Mainnet;
var Rr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Rr || (Rr = {}));
var sa;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(sa || (sa = {}));
Rr.Mainnet;
const Rb = 128, Gb = 128, Vl = 16;
var ia;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ia || (ia = {}));
var oa;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(oa || (oa = {}));
var Et;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Et || (Et = {}));
const Fs = ["onChainOnly", "offChainOnly", "any"];
Fs[0] + "", Et.OnChainOnly, Fs[1] + "", Et.OffChainOnly, Fs[2] + "", Et.Any, Et.OnChainOnly + "", Et.OnChainOnly, Et.OffChainOnly + "", Et.OffChainOnly, Et.Any + "", Et.Any;
var ca;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(ca || (ca = {}));
var aa;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(aa || (aa = {}));
var la;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(la || (la = {}));
var fa;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(fa || (fa = {}));
var ua;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(ua || (ua = {}));
var ha;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(ha || (ha = {}));
var da;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(da || (da = {}));
var ga;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(ga || (ga = {}));
var ba;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ba || (ba = {}));
var pa;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(pa || (pa = {}));
var xa;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(xa || (xa = {}));
var wa;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(wa || (wa = {}));
var ya;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(ya || (ya = {}));
let Kb = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Vb = class extends Kb {
  constructor(e) {
    super(e);
  }
};
function pi(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function qb(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function ql(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Wb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  pi(t.outputLen), pi(t.blockLen);
}
function Yb(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Zb(t, e) {
  ql(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const zs = {
  number: pi,
  bool: qb,
  bytes: ql,
  hash: Wb,
  exists: Yb,
  output: Zb
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Rs = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ct = (t, e) => t << 32 - e | t >>> e, Xb = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Xb)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Qb(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Wl(t) {
  if (typeof t == "string" && (t = Qb(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Jb = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ke(t) {
  const e = (r) => t().update(Wl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function tp(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), a = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + a, o, r), t.setUint32(e + f, c, r);
}
let fo = class extends Jb {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Rs(this.buffer);
  }
  update(e) {
    zs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Wl(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const a = Rs(e);
        for (; s <= i - o; o += s)
          this.process(a, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    zs.exists(this), zs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    tp(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = Rs(e), a = this.outputLen;
    if (a % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = a / 4, u = this.get();
    if (f > u.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      c.setUint32(4 * l, u[l], i);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: c } = this;
    return e.length = s, e.pos = c, e.finished = i, e.destroyed = o, s % n && e.buffer.set(r), e;
  }
};
const ep = (t, e, n) => t & e ^ ~t & n, np = (t, e, n) => t & e ^ t & n ^ e & n, rp = new Uint32Array([
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
]), he = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), de = new Uint32Array(64);
let Yl = class extends fo {
  constructor() {
    super(64, 32, 8, !1), this.A = he[0] | 0, this.B = he[1] | 0, this.C = he[2] | 0, this.D = he[3] | 0, this.E = he[4] | 0, this.F = he[5] | 0, this.G = he[6] | 0, this.H = he[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: o, G: c, H: a } = this;
    return [e, n, r, s, i, o, c, a];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, a) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = c | 0, this.H = a | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      de[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = de[l - 15], h = de[l - 2], x = Ct(b, 7) ^ Ct(b, 18) ^ b >>> 3, w = Ct(h, 17) ^ Ct(h, 19) ^ h >>> 10;
      de[l] = w + de[l - 7] + x + de[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: a, G: f, H: u } = this;
    for (let l = 0; l < 64; l++) {
      const b = Ct(c, 6) ^ Ct(c, 11) ^ Ct(c, 25), h = u + b + ep(c, a, f) + rp[l] + de[l] | 0, w = (Ct(r, 2) ^ Ct(r, 13) ^ Ct(r, 22)) + np(r, s, i) | 0;
      u = f, f = a, a = c, c = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, f = f + this.G | 0, u = u + this.H | 0, this.set(r, s, i, o, c, a, f, u);
  }
  roundClean() {
    de.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, sp = class extends Yl {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Ke(() => new Yl());
Ke(() => new sp());
const ip = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Zl = Uint8Array.from({ length: 16 }, (t, e) => e), op = Zl.map((t) => (9 * t + 5) % 16);
let uo = [Zl], ho = [op];
for (let t = 0; t < 4; t++)
  for (let e of [uo, ho])
    e.push(e[t].map((n) => ip[n]));
const Xl = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), cp = uo.map((t, e) => t.map((n) => Xl[e][n])), ap = ho.map((t, e) => t.map((n) => Xl[e][n])), lp = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), fp = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), gr = (t, e) => t << e | t >>> 32 - e;
function ma(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const br = new Uint32Array(16);
let up = class extends fo {
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
      br[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, a = c, f = this.h3 | 0, u = f, l = this.h4 | 0, b = l;
    for (let h = 0; h < 5; h++) {
      const x = 4 - h, w = lp[h], I = fp[h], N = uo[h], C = ho[h], g = cp[h], A = ap[h];
      for (let y = 0; y < 16; y++) {
        const v = gr(r + ma(h, i, c, f) + br[N[y]] + w, g[y]) + l | 0;
        r = l, l = f, f = gr(c, 10) | 0, c = i, i = v;
      }
      for (let y = 0; y < 16; y++) {
        const v = gr(s + ma(x, o, a, u) + br[C[y]] + I, A[y]) + b | 0;
        s = b, b = u, u = gr(a, 10) | 0, a = o, o = v;
      }
    }
    this.set(this.h1 + c + u | 0, this.h2 + f + b | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + a | 0);
  }
  roundClean() {
    br.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Ke(() => new up());
const pr = BigInt(2 ** 32 - 1), xi = BigInt(32);
function Ql(t, e = !1) {
  return e ? { h: Number(t & pr), l: Number(t >> xi & pr) } : { h: Number(t >> xi & pr) | 0, l: Number(t & pr) | 0 };
}
function hp(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Ql(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const dp = (t, e) => BigInt(t >>> 0) << xi | BigInt(e >>> 0), gp = (t, e, n) => t >>> n, bp = (t, e, n) => t << 32 - n | e >>> n, pp = (t, e, n) => t >>> n | e << 32 - n, xp = (t, e, n) => t << 32 - n | e >>> n, wp = (t, e, n) => t << 64 - n | e >>> n - 32, yp = (t, e, n) => t >>> n - 32 | e << 64 - n, mp = (t, e) => e, Sp = (t, e) => t, Ap = (t, e, n) => t << n | e >>> 32 - n, Ep = (t, e, n) => e << n | t >>> 32 - n, vp = (t, e, n) => e << n - 32 | t >>> 64 - n, Ip = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Lp(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const $p = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Mp = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Bp = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), _p = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Np = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Cp = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, z = {
  fromBig: Ql,
  split: hp,
  toBig: dp,
  shrSH: gp,
  shrSL: bp,
  rotrSH: pp,
  rotrSL: xp,
  rotrBH: wp,
  rotrBL: yp,
  rotr32H: mp,
  rotr32L: Sp,
  rotlSH: Ap,
  rotlSL: Ep,
  rotlBH: vp,
  rotlBL: Ip,
  add: Lp,
  add3L: $p,
  add3H: Mp,
  add4L: Bp,
  add4H: _p,
  add5H: Cp,
  add5L: Np
}, [Dp, Hp] = z.split([
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
].map((t) => BigInt(t))), ge = new Uint32Array(80), be = new Uint32Array(80);
let hs = class extends fo {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: a, Eh: f, El: u, Fh: l, Fl: b, Gh: h, Gl: x, Hh: w, Hl: I } = this;
    return [e, n, r, s, i, o, c, a, f, u, l, b, h, x, w, I];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, a, f, u, l, b, h, x, w, I) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = a | 0, this.Eh = f | 0, this.El = u | 0, this.Fh = l | 0, this.Fl = b | 0, this.Gh = h | 0, this.Gl = x | 0, this.Hh = w | 0, this.Hl = I | 0;
  }
  process(e, n) {
    for (let g = 0; g < 16; g++, n += 4)
      ge[g] = e.getUint32(n), be[g] = e.getUint32(n += 4);
    for (let g = 16; g < 80; g++) {
      const A = ge[g - 15] | 0, y = be[g - 15] | 0, v = z.rotrSH(A, y, 1) ^ z.rotrSH(A, y, 8) ^ z.shrSH(A, y, 7), D = z.rotrSL(A, y, 1) ^ z.rotrSL(A, y, 8) ^ z.shrSL(A, y, 7), B = ge[g - 2] | 0, _ = be[g - 2] | 0, p = z.rotrSH(B, _, 19) ^ z.rotrBH(B, _, 61) ^ z.shrSH(B, _, 6), E = z.rotrSL(B, _, 19) ^ z.rotrBL(B, _, 61) ^ z.shrSL(B, _, 6), $ = z.add4L(D, E, be[g - 7], be[g - 16]), O = z.add4H($, v, p, ge[g - 7], ge[g - 16]);
      ge[g] = O | 0, be[g] = $ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: a, Dh: f, Dl: u, Eh: l, El: b, Fh: h, Fl: x, Gh: w, Gl: I, Hh: N, Hl: C } = this;
    for (let g = 0; g < 80; g++) {
      const A = z.rotrSH(l, b, 14) ^ z.rotrSH(l, b, 18) ^ z.rotrBH(l, b, 41), y = z.rotrSL(l, b, 14) ^ z.rotrSL(l, b, 18) ^ z.rotrBL(l, b, 41), v = l & h ^ ~l & w, D = b & x ^ ~b & I, B = z.add5L(C, y, D, Hp[g], be[g]), _ = z.add5H(B, N, A, v, Dp[g], ge[g]), p = B | 0, E = z.rotrSH(r, s, 28) ^ z.rotrBH(r, s, 34) ^ z.rotrBH(r, s, 39), $ = z.rotrSL(r, s, 28) ^ z.rotrBL(r, s, 34) ^ z.rotrBL(r, s, 39), O = r & i ^ r & c ^ i & c, k = s & o ^ s & a ^ o & a;
      N = w | 0, C = I | 0, w = h | 0, I = x | 0, h = l | 0, x = b | 0, { h: l, l: b } = z.add(f | 0, u | 0, _ | 0, p | 0), f = c | 0, u = a | 0, c = i | 0, a = o | 0, i = r | 0, o = s | 0;
      const U = z.add3L(p, $, k);
      r = z.add3H(U, _, E, O), s = U | 0;
    }
    ({ h: r, l: s } = z.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = z.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l: a } = z.add(this.Ch | 0, this.Cl | 0, c | 0, a | 0), { h: f, l: u } = z.add(this.Dh | 0, this.Dl | 0, f | 0, u | 0), { h: l, l: b } = z.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h, l: x } = z.add(this.Fh | 0, this.Fl | 0, h | 0, x | 0), { h: w, l: I } = z.add(this.Gh | 0, this.Gl | 0, w | 0, I | 0), { h: N, l: C } = z.add(this.Hh | 0, this.Hl | 0, N | 0, C | 0), this.set(r, s, i, o, c, a, f, u, l, b, h, x, w, I, N, C);
  }
  roundClean() {
    ge.fill(0), be.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Up = class extends hs {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Op = class extends hs {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Tp = class extends hs {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ke(() => new hs());
Ke(() => new Up());
Ke(() => new Op());
Ke(() => new Tp());
var rt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(rt || (rt = {}));
var wi;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(wi || (wi = {}));
function go(t) {
  return wi[t];
}
var Gr;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Gr || (Gr = {}));
function Jl(t, e, n) {
  const s = Rb;
  if (Zp(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Gr.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
function tf(t) {
  const e = ls.c32addressDecode(t);
  return {
    type: Gr.Address,
    version: e[0],
    hash160: e[1]
  };
}
function ef(t) {
  const e = [];
  return e.push(bt(Ri(t.version, 1))), e.push(bt(t.hash160)), xn(e);
}
function nf(t) {
  const e = [], n = jn(t.content), r = n.byteLength;
  return e.push(bt(Ri(r, t.lengthPrefixBytes))), e.push(n), xn(e);
}
function jt(t, e) {
  return xn([go(t), e]);
}
function kp(t) {
  return new Uint8Array([go(t.type)]);
}
function Pp(t) {
  return t.type === rt.OptionalNone ? new Uint8Array([go(t.type)]) : jt(t.type, Gn(t.value));
}
function jp(t) {
  const e = new Uint8Array(4);
  return Xr(e, Math.ceil(t.value.length / 2), 0), jt(t.type, Zt(e, bt(t.value)));
}
function Fp(t) {
  const e = v0(od(BigInt(t.value), BigInt(Gb)), Vl);
  return jt(t.type, e);
}
function zp(t) {
  const e = v0(BigInt(t.value), Vl);
  return jt(t.type, e);
}
function Rp(t) {
  return jt(t.type, ef(tf(t.value)));
}
function Gp(t) {
  const [e, n] = Xp(t.value);
  return jt(t.type, Zt(ef(tf(e)), nf(Jl(n))));
}
function Kp(t) {
  return jt(t.type, Gn(t.value));
}
function Vp(t) {
  const e = [], n = new Uint8Array(4);
  Xr(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = Gn(r);
    e.push(s);
  }
  return jt(t.type, xn(e));
}
function qp(t) {
  const e = [], n = new Uint8Array(4);
  Xr(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Jl(s);
    e.push(nf(i));
    const o = Gn(t.value[s]);
    e.push(o);
  }
  return jt(t.type, xn(e));
}
function rf(t, e) {
  const n = [], r = e == "ascii" ? ad(t.value) : jn(t.value), s = new Uint8Array(4);
  return Xr(s, r.length, 0), n.push(s), n.push(r), jt(t.type, xn(n));
}
function Wp(t) {
  return rf(t, "ascii");
}
function Yp(t) {
  return rf(t, "utf8");
}
function Sa(t) {
  return yt(Gn(t));
}
function Gn(t) {
  switch (t.type) {
    case rt.BoolTrue:
    case rt.BoolFalse:
      return kp(t);
    case rt.OptionalNone:
    case rt.OptionalSome:
      return Pp(t);
    case rt.Buffer:
      return jp(t);
    case rt.UInt:
      return zp(t);
    case rt.Int:
      return Fp(t);
    case rt.PrincipalStandard:
      return Rp(t);
    case rt.PrincipalContract:
      return Gp(t);
    case rt.ResponseOk:
    case rt.ResponseErr:
      return Kp(t);
    case rt.List:
      return Vp(t);
    case rt.Tuple:
      return qp(t);
    case rt.StringASCII:
      return Wp(t);
    case rt.StringUTF8:
      return Yp(t);
    default:
      throw new Vb("Unable to serialize. Invalid Clarity Value.");
  }
}
const Zp = (t, e) => t ? jn(t).length > e : !1;
function Xp(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
function Qp(t, e) {
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
    return BigInt(`0x${ex(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function bo(t, e = 8) {
  return (typeof t == "bigint" ? t : Qp(t)).toString(16).padStart(e * 2, "0");
}
function sf(t, e = 16) {
  const n = bo(t, e);
  return On(n);
}
function Jp(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const tx = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ex(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += tx[n];
  return e;
}
function On(t) {
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
function po(t) {
  return new TextEncoder().encode(t);
}
function nx(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function rx(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Aa(t) {
  if (t.some(rx))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function xo(...t) {
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
function yn(t) {
  return xo(...t.map((e) => typeof e == "number" ? Aa([e]) : e instanceof Array ? Aa(e) : e));
}
function ds(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var yi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(yi || (yi = {}));
yi.Mainnet;
const sx = 128, ix = 128, of = 16;
var mi;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(mi || (mi = {}));
var Ea;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ea || (Ea = {}));
var va;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(va || (va = {}));
var vt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(vt || (vt = {}));
const Gs = ["onChainOnly", "offChainOnly", "any"];
Gs[0] + "", vt.OnChainOnly, Gs[1] + "", vt.OffChainOnly, Gs[2] + "", vt.Any, vt.OnChainOnly + "", vt.OnChainOnly, vt.OffChainOnly + "", vt.OffChainOnly, vt.Any + "", vt.Any;
var Si;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Si || (Si = {}));
Si.Mainnet;
var Ia;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Ia || (Ia = {}));
var La;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(La || (La = {}));
var $a;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})($a || ($a = {}));
var Ma;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Ma || (Ma = {}));
var Ba;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ba || (Ba = {}));
var _a;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(_a || (_a = {}));
var Na;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Na || (Na = {}));
var Ca;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Ca || (Ca = {}));
var Da;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Da || (Da = {}));
var Ha;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ha || (Ha = {}));
var Ua;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Ua || (Ua = {}));
function Ai(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function ox(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function cf(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function cx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ai(t.outputLen), Ai(t.blockLen);
}
function ax(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function lx(t, e) {
  cf(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ks = {
  number: Ai,
  bool: ox,
  bytes: cf,
  hash: cx,
  exists: ax,
  output: lx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Vs = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Dt = (t, e) => t << 32 - e | t >>> e, fx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!fx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ux(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function af(t) {
  if (typeof t == "string" && (t = ux(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let hx = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ve(t) {
  const e = (r) => t().update(af(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function dx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), a = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + a, o, r), t.setUint32(e + f, c, r);
}
let wo = class extends hx {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Vs(this.buffer);
  }
  update(e) {
    Ks.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = af(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const a = Vs(e);
        for (; s <= i - o; o += s)
          this.process(a, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ks.exists(this), Ks.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    dx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = Vs(e), a = this.outputLen;
    if (a % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = a / 4, u = this.get();
    if (f > u.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      c.setUint32(4 * l, u[l], i);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: c } = this;
    return e.length = s, e.pos = c, e.finished = i, e.destroyed = o, s % n && e.buffer.set(r), e;
  }
};
const gx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), lf = Uint8Array.from({ length: 16 }, (t, e) => e), bx = lf.map((t) => (9 * t + 5) % 16);
let yo = [lf], mo = [bx];
for (let t = 0; t < 4; t++)
  for (let e of [yo, mo])
    e.push(e[t].map((n) => gx[n]));
const ff = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), px = yo.map((t, e) => t.map((n) => ff[e][n])), xx = mo.map((t, e) => t.map((n) => ff[e][n])), wx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), yx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), xr = (t, e) => t << e | t >>> 32 - e;
function Oa(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const wr = new Uint32Array(16);
let mx = class extends wo {
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
      wr[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, a = c, f = this.h3 | 0, u = f, l = this.h4 | 0, b = l;
    for (let h = 0; h < 5; h++) {
      const x = 4 - h, w = wx[h], I = yx[h], N = yo[h], C = mo[h], g = px[h], A = xx[h];
      for (let y = 0; y < 16; y++) {
        const v = xr(r + Oa(h, i, c, f) + wr[N[y]] + w, g[y]) + l | 0;
        r = l, l = f, f = xr(c, 10) | 0, c = i, i = v;
      }
      for (let y = 0; y < 16; y++) {
        const v = xr(s + Oa(x, o, a, u) + wr[C[y]] + I, A[y]) + b | 0;
        s = b, b = u, u = xr(a, 10) | 0, a = o, o = v;
      }
    }
    this.set(this.h1 + c + u | 0, this.h2 + f + b | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + a | 0);
  }
  roundClean() {
    wr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Ve(() => new mx());
const Sx = (t, e, n) => t & e ^ ~t & n, Ax = (t, e, n) => t & e ^ t & n ^ e & n, Ex = new Uint32Array([
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
]), pe = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), xe = new Uint32Array(64);
let uf = class extends wo {
  constructor() {
    super(64, 32, 8, !1), this.A = pe[0] | 0, this.B = pe[1] | 0, this.C = pe[2] | 0, this.D = pe[3] | 0, this.E = pe[4] | 0, this.F = pe[5] | 0, this.G = pe[6] | 0, this.H = pe[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: o, G: c, H: a } = this;
    return [e, n, r, s, i, o, c, a];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, a) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = c | 0, this.H = a | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      xe[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = xe[l - 15], h = xe[l - 2], x = Dt(b, 7) ^ Dt(b, 18) ^ b >>> 3, w = Dt(h, 17) ^ Dt(h, 19) ^ h >>> 10;
      xe[l] = w + xe[l - 7] + x + xe[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: a, G: f, H: u } = this;
    for (let l = 0; l < 64; l++) {
      const b = Dt(c, 6) ^ Dt(c, 11) ^ Dt(c, 25), h = u + b + Sx(c, a, f) + Ex[l] + xe[l] | 0, w = (Dt(r, 2) ^ Dt(r, 13) ^ Dt(r, 22)) + Ax(r, s, i) | 0;
      u = f, f = a, a = c, c = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, f = f + this.G | 0, u = u + this.H | 0, this.set(r, s, i, o, c, a, f, u);
  }
  roundClean() {
    xe.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, vx = class extends uf {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Ve(() => new uf());
Ve(() => new vx());
const yr = BigInt(2 ** 32 - 1), Ei = BigInt(32);
function hf(t, e = !1) {
  return e ? { h: Number(t & yr), l: Number(t >> Ei & yr) } : { h: Number(t >> Ei & yr) | 0, l: Number(t & yr) | 0 };
}
function Ix(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = hf(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Lx = (t, e) => BigInt(t >>> 0) << Ei | BigInt(e >>> 0), $x = (t, e, n) => t >>> n, Mx = (t, e, n) => t << 32 - n | e >>> n, Bx = (t, e, n) => t >>> n | e << 32 - n, _x = (t, e, n) => t << 32 - n | e >>> n, Nx = (t, e, n) => t << 64 - n | e >>> n - 32, Cx = (t, e, n) => t >>> n - 32 | e << 64 - n, Dx = (t, e) => e, Hx = (t, e) => t, Ux = (t, e, n) => t << n | e >>> 32 - n, Ox = (t, e, n) => e << n | t >>> 32 - n, Tx = (t, e, n) => e << n - 32 | t >>> 64 - n, kx = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Px(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const jx = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Fx = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, zx = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Rx = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Gx = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Kx = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, R = {
  fromBig: hf,
  split: Ix,
  toBig: Lx,
  shrSH: $x,
  shrSL: Mx,
  rotrSH: Bx,
  rotrSL: _x,
  rotrBH: Nx,
  rotrBL: Cx,
  rotr32H: Dx,
  rotr32L: Hx,
  rotlSH: Ux,
  rotlSL: Ox,
  rotlBH: Tx,
  rotlBL: kx,
  add: Px,
  add3L: jx,
  add3H: Fx,
  add4L: zx,
  add4H: Rx,
  add5H: Kx,
  add5L: Gx
}, [Vx, qx] = R.split([
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
].map((t) => BigInt(t))), we = new Uint32Array(80), ye = new Uint32Array(80);
let gs = class extends wo {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: a, Eh: f, El: u, Fh: l, Fl: b, Gh: h, Gl: x, Hh: w, Hl: I } = this;
    return [e, n, r, s, i, o, c, a, f, u, l, b, h, x, w, I];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, a, f, u, l, b, h, x, w, I) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = a | 0, this.Eh = f | 0, this.El = u | 0, this.Fh = l | 0, this.Fl = b | 0, this.Gh = h | 0, this.Gl = x | 0, this.Hh = w | 0, this.Hl = I | 0;
  }
  process(e, n) {
    for (let g = 0; g < 16; g++, n += 4)
      we[g] = e.getUint32(n), ye[g] = e.getUint32(n += 4);
    for (let g = 16; g < 80; g++) {
      const A = we[g - 15] | 0, y = ye[g - 15] | 0, v = R.rotrSH(A, y, 1) ^ R.rotrSH(A, y, 8) ^ R.shrSH(A, y, 7), D = R.rotrSL(A, y, 1) ^ R.rotrSL(A, y, 8) ^ R.shrSL(A, y, 7), B = we[g - 2] | 0, _ = ye[g - 2] | 0, p = R.rotrSH(B, _, 19) ^ R.rotrBH(B, _, 61) ^ R.shrSH(B, _, 6), E = R.rotrSL(B, _, 19) ^ R.rotrBL(B, _, 61) ^ R.shrSL(B, _, 6), $ = R.add4L(D, E, ye[g - 7], ye[g - 16]), O = R.add4H($, v, p, we[g - 7], we[g - 16]);
      we[g] = O | 0, ye[g] = $ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: a, Dh: f, Dl: u, Eh: l, El: b, Fh: h, Fl: x, Gh: w, Gl: I, Hh: N, Hl: C } = this;
    for (let g = 0; g < 80; g++) {
      const A = R.rotrSH(l, b, 14) ^ R.rotrSH(l, b, 18) ^ R.rotrBH(l, b, 41), y = R.rotrSL(l, b, 14) ^ R.rotrSL(l, b, 18) ^ R.rotrBL(l, b, 41), v = l & h ^ ~l & w, D = b & x ^ ~b & I, B = R.add5L(C, y, D, qx[g], ye[g]), _ = R.add5H(B, N, A, v, Vx[g], we[g]), p = B | 0, E = R.rotrSH(r, s, 28) ^ R.rotrBH(r, s, 34) ^ R.rotrBH(r, s, 39), $ = R.rotrSL(r, s, 28) ^ R.rotrBL(r, s, 34) ^ R.rotrBL(r, s, 39), O = r & i ^ r & c ^ i & c, k = s & o ^ s & a ^ o & a;
      N = w | 0, C = I | 0, w = h | 0, I = x | 0, h = l | 0, x = b | 0, { h: l, l: b } = R.add(f | 0, u | 0, _ | 0, p | 0), f = c | 0, u = a | 0, c = i | 0, a = o | 0, i = r | 0, o = s | 0;
      const U = R.add3L(p, $, k);
      r = R.add3H(U, _, E, O), s = U | 0;
    }
    ({ h: r, l: s } = R.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = R.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l: a } = R.add(this.Ch | 0, this.Cl | 0, c | 0, a | 0), { h: f, l: u } = R.add(this.Dh | 0, this.Dl | 0, f | 0, u | 0), { h: l, l: b } = R.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h, l: x } = R.add(this.Fh | 0, this.Fl | 0, h | 0, x | 0), { h: w, l: I } = R.add(this.Gh | 0, this.Gl | 0, w | 0, I | 0), { h: N, l: C } = R.add(this.Hh | 0, this.Hl | 0, N | 0, C | 0), this.set(r, s, i, o, c, a, f, u, l, b, h, x, w, I, N, C);
  }
  roundClean() {
    we.fill(0), ye.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Wx = class extends gs {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Yx = class extends gs {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Zx = class extends gs {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ve(() => new gs());
Ve(() => new Wx());
Ve(() => new Yx());
Ve(() => new Zx());
function Xx(t, e, n) {
  const s = sx;
  if (hw(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: mi.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var st;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(st || (st = {}));
let Qx = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Jx = class extends Qx {
  constructor(e) {
    super(e);
  }
};
function df(t) {
  const e = [];
  return e.push(On(bo(t.version, 1))), e.push(On(t.hash160)), yn(e);
}
function gf(t) {
  const e = [], n = po(t.content), r = n.byteLength;
  return e.push(On(bo(r, t.lengthPrefixBytes))), e.push(n), yn(e);
}
function Ft(t, e) {
  return yn([t, e]);
}
function tw(t) {
  return new Uint8Array([t.type]);
}
function ew(t) {
  return t.type === st.OptionalNone ? new Uint8Array([t.type]) : Ft(t.type, bn(t.value));
}
function nw(t) {
  const e = new Uint8Array(4);
  return ds(e, t.buffer.length, 0), Ft(t.type, xo(e, t.buffer));
}
function rw(t) {
  const e = sf(Jp(t.value, BigInt(ix)), of);
  return Ft(t.type, e);
}
function sw(t) {
  const e = sf(t.value, of);
  return Ft(t.type, e);
}
function iw(t) {
  return Ft(t.type, df(t.address));
}
function ow(t) {
  return Ft(t.type, xo(df(t.address), gf(t.contractName)));
}
function cw(t) {
  return Ft(t.type, bn(t.value));
}
function aw(t) {
  const e = [], n = new Uint8Array(4);
  ds(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = bn(r);
    e.push(s);
  }
  return Ft(t.type, yn(e));
}
function lw(t) {
  const e = [], n = new Uint8Array(4);
  ds(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Xx(s);
    e.push(gf(i));
    const o = bn(t.data[s]);
    e.push(o);
  }
  return Ft(t.type, yn(e));
}
function bf(t, e) {
  const n = [], r = e == "ascii" ? nx(t.data) : po(t.data), s = new Uint8Array(4);
  return ds(s, r.length, 0), n.push(s), n.push(r), Ft(t.type, yn(n));
}
function fw(t) {
  return bf(t, "ascii");
}
function uw(t) {
  return bf(t, "utf8");
}
function bn(t) {
  switch (t.type) {
    case st.BoolTrue:
    case st.BoolFalse:
      return tw(t);
    case st.OptionalNone:
    case st.OptionalSome:
      return ew(t);
    case st.Buffer:
      return nw(t);
    case st.UInt:
      return sw(t);
    case st.Int:
      return rw(t);
    case st.PrincipalStandard:
      return iw(t);
    case st.PrincipalContract:
      return ow(t);
    case st.ResponseOk:
    case st.ResponseErr:
      return cw(t);
    case st.List:
      return aw(t);
    case st.Tuple:
      return lw(t);
    case st.StringASCII:
      return fw(t);
    case st.StringUTF8:
      return uw(t);
    default:
      throw new Jx("Unable to serialize. Invalid Clarity Value.");
  }
}
const hw = (t, e) => t ? po(t).length > e : !1, dw = "connect-ui";
let Br, pf, gt = !1, vi = !1;
const Qt = (t, e = "") => () => {
}, gw = (t, e) => () => {
}, bw = "{visibility:hidden}.hydrated{visibility:inherit}", Ta = {}, pw = "http://www.w3.org/2000/svg", xw = "http://www.w3.org/1999/xhtml", ww = (t) => t != null, So = (t) => (t = typeof t, t === "object" || t === "function");
function xf(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const P = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], c = (f) => {
    for (let u = 0; u < f.length; u++)
      r = f[u], Array.isArray(r) ? c(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !So(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? Ii(null, r) : r), i = s);
  };
  if (c(n), e) {
    const f = e.className || e.class;
    f && (e.class = typeof f != "object" ? f : Object.keys(f).filter((u) => f[u]).join(" "));
  }
  const a = Ii(t, null);
  return a.$attrs$ = e, o.length > 0 && (a.$children$ = o), a;
}, Ii = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, yw = {}, mw = (t) => t && t.$tag$ === yw, Sw = (t, e) => t != null && !So(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, Aw = (t) => mn(t).$hostElement$, Ew = (t, e, n) => {
  const r = ct.ce(e, n);
  return t.dispatchEvent(r), r;
}, ka = /* @__PURE__ */ new WeakMap(), vw = (t, e, n) => {
  let r = Kr.get(t);
  Gw && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Kr.set(t, r);
}, Iw = (t, e, n, r) => {
  var s;
  let i = wf(e);
  const o = Kr.get(i);
  if (t = t.nodeType === 11 ? t : Tt, o)
    if (typeof o == "string") {
      t = t.head || t;
      let c = ka.get(t), a;
      if (c || ka.set(t, c = /* @__PURE__ */ new Set()), !c.has(i)) {
        {
          a = Tt.createElement("style"), a.innerHTML = o;
          const f = (s = ct.$nonce$) !== null && s !== void 0 ? s : xf(Tt);
          f != null && a.setAttribute("nonce", f), t.insertBefore(a, t.querySelector("link"));
        }
        c && c.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, Lw = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Qt("attachStyles", e.$tagName$), i = Iw(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, wf = (t, e) => "sc-" + t.$tagName$, Pa = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = Fa(t, e), c = e.toLowerCase();
    if (e === "class") {
      const a = t.classList, f = ja(n), u = ja(r);
      a.remove(...f.filter((l) => l && !u.includes(l))), a.add(...u.filter((l) => l && !f.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : Fa(bs, c) ? e = c.slice(2) : e = c[2] + e.slice(3), n && ct.rel(t, e, n, !1), r && ct.ael(t, e, r, !1);
    else {
      const a = So(r);
      if ((o || a && r !== null) && !s)
        try {
          if (t.tagName.includes("-"))
            t[e] = r;
          else {
            const f = r ?? "";
            e === "list" ? o = !1 : (n == null || t[e] != f) && (t[e] = f);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || t.getAttribute(e) === "") && t.removeAttribute(e) : (!o || i & 4 || s) && !a && (r = r === !0 ? "" : r, t.setAttribute(e, r));
    }
  }
}, $w = /\s/, ja = (t) => t ? t.split($w) : [], yf = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || Ta, o = e.$attrs$ || Ta;
  for (r in i)
    r in o || Pa(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    Pa(s, r, i[r], o[r], n, e.$flags$);
}, Ao = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, c;
  if (s.$text$ !== null)
    o = s.$elm$ = Tt.createTextNode(s.$text$);
  else {
    if (gt || (gt = s.$tag$ === "svg"), o = s.$elm$ = Tt.createElementNS(gt ? pw : xw, s.$tag$), gt && s.$tag$ === "foreignObject" && (gt = !1), yf(null, s, gt), ww(Br) && o["s-si"] !== Br && o.classList.add(o["s-si"] = Br), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        c = Ao(t, s, i), c && o.appendChild(c);
    s.$tag$ === "svg" ? gt = !1 : o.tagName === "foreignObject" && (gt = !0);
  }
  return o;
}, mf = (t, e, n, r, s, i) => {
  let o = t, c;
  for (o.shadowRoot && o.tagName === pf && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (c = Ao(null, n, s), c && (r[s].$elm$ = c, o.insertBefore(c, e)));
}, Sf = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, Mw = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, c = e[0], a = e[o], f = r.length - 1, u = r[0], l = r[f], b;
  for (; s <= o && i <= f; )
    c == null ? c = e[++s] : a == null ? a = e[--o] : u == null ? u = r[++i] : l == null ? l = r[--f] : mr(c, u) ? (Bn(c, u), c = e[++s], u = r[++i]) : mr(a, l) ? (Bn(a, l), a = e[--o], l = r[--f]) : mr(c, l) ? (Bn(c, l), t.insertBefore(c.$elm$, a.$elm$.nextSibling), c = e[++s], l = r[--f]) : mr(a, u) ? (Bn(a, u), t.insertBefore(a.$elm$, c.$elm$), a = e[--o], u = r[++i]) : (b = Ao(e && e[i], n, i), u = r[++i], b && c.$elm$.parentNode.insertBefore(b, c.$elm$));
  s > o ? mf(t, r[f + 1] == null ? null : r[f + 1].$elm$, n, r, i, f) : i > f && Sf(e, s, o);
}, mr = (t, e) => t.$tag$ === e.$tag$, Bn = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (gt = i === "svg" ? !0 : i === "foreignObject" ? !1 : gt, yf(t, e, gt), r !== null && s !== null ? Mw(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), mf(n, null, e, s, 0, s.length - 1)) : r !== null && Sf(r, 0, r.length - 1), gt && i === "svg" && (gt = !1)) : t.$text$ !== o && (n.data = o);
}, Bw = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || Ii(null, null), s = mw(e) ? e : P(null, null, e);
  pf = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, Br = n["s-sc"], Bn(r, s);
}, Af = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, Eo = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return Af(t, t.$ancestorComponent$), Vw(() => _w(t, e));
}, _w = (t, e) => {
  const n = Qt("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), Hw(s, () => Nw(t, r, e));
}, Nw = async (t, e, n) => {
  const r = t.$hostElement$, s = Qt("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && Lw(t);
  const o = Qt("render", t.$cmpMeta$.$tagName$);
  Cw(t, e), i && (i.map((c) => c()), r["s-rc"] = void 0), o(), s();
  {
    const c = r["s-p"], a = () => Dw(t);
    c.length === 0 ? a() : (Promise.all(c).then(a), t.$flags$ |= 4, c.length = 0);
  }
}, Cw = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, Bw(t, e);
  } catch (r) {
    Tn(r, t.$hostElement$);
  }
  return null;
}, Dw = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Qt("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, vf(n), r(), t.$onReadyResolve$(n), s || Ef()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && Io(() => Eo(t, !1)), t.$flags$ &= -517;
}, Ef = (t) => {
  vf(Tt.documentElement), Io(() => Ew(bs, "appload", { detail: { namespace: dw } }));
}, Hw = (t, e) => t && t.then ? t.then(e) : e(), vf = (t) => t.classList.add("hydrated"), Uw = (t, e) => mn(t).$instanceValues$.get(e), Ow = (t, e, n, r) => {
  const s = mn(t), i = s.$instanceValues$.get(e), o = s.$flags$, c = s.$lazyInstance$;
  n = Sw(n, r.$members$[e][0]);
  const a = Number.isNaN(i) && Number.isNaN(n), f = n !== i && !a;
  (!(o & 8) || i === void 0) && f && (s.$instanceValues$.set(e, n), c && (o & 18) === 2 && Eo(s, !1));
}, If = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return Uw(this, i);
        },
        set(c) {
          Ow(this, i, c, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, c, a) {
        ct.jmp(() => {
          const f = i.get(o);
          if (this.hasOwnProperty(f))
            a = this[f], delete this[f];
          else if (s.hasOwnProperty(f) && typeof this[f] == "number" && this[f] == a)
            return;
          this[f] = a === null && typeof this[f] == "boolean" ? !1 : a;
        });
      }, t.observedAttributes = r.filter(
        ([o, c]) => c[0] & 15
        /* MEMBER_FLAGS.HasAttribute */
      ).map(([o, c]) => {
        const a = c[1] || o;
        return i.set(a, o), a;
      });
    }
  }
  return t;
}, Tw = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = Rw(n), s.then) {
        const a = gw();
        s = await s, a();
      }
      s.isProxied || (If(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const c = Qt("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (a) {
        Tn(a);
      }
      e.$flags$ &= -9, c();
    }
    if (s.style) {
      let c = s.style;
      const a = wf(n);
      if (!Kr.has(a)) {
        const f = Qt("registerStyles", n.$tagName$);
        vw(a, c, !!(n.$flags$ & 1)), f();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => Eo(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, kw = (t) => {
  if (!(ct.$flags$ & 1)) {
    const e = mn(t), n = e.$cmpMeta$, r = Qt("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            Af(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), Tw(t, e, n);
    }
    r();
  }
}, Pw = (t) => {
  ct.$flags$ & 1 || mn(t);
}, jw = (t, e = {}) => {
  var n;
  const r = Qt(), s = [], i = e.exclude || [], o = bs.customElements, c = Tt.head, a = /* @__PURE__ */ c.querySelector("meta[charset]"), f = /* @__PURE__ */ Tt.createElement("style"), u = [];
  let l, b = !0;
  Object.assign(ct, e), ct.$resourcesUrl$ = new URL(e.resourcesUrl || "./", Tt.baseURI).href, t.map((h) => {
    h[1].map((x) => {
      const w = {
        $flags$: x[0],
        $tagName$: x[1],
        $members$: x[2],
        $listeners$: x[3]
      };
      w.$members$ = x[2];
      const I = w.$tagName$, N = class extends HTMLElement {
        // StencilLazyHost
        constructor(C) {
          super(C), C = this, zw(C, w), w.$flags$ & 1 && C.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), b ? u.push(this) : ct.jmp(() => kw(this));
        }
        disconnectedCallback() {
          ct.jmp(() => Pw(this));
        }
        componentOnReady() {
          return mn(this).$onReadyPromise$;
        }
      };
      w.$lazyBundleId$ = h[0], !i.includes(I) && !o.get(I) && (s.push(I), o.define(I, If(
        N,
        w,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    f.innerHTML = s + bw, f.setAttribute("data-styles", "");
    const h = (n = ct.$nonce$) !== null && n !== void 0 ? n : xf(Tt);
    h != null && f.setAttribute("nonce", h), c.insertBefore(f, a ? a.nextSibling : c.firstChild);
  }
  b = !1, u.length ? u.map((h) => h.connectedCallback()) : ct.jmp(() => l = setTimeout(Ef, 30)), r();
}, vo = /* @__PURE__ */ new WeakMap(), mn = (t) => vo.get(t), Fw = (t, e) => vo.set(e.$lazyInstance$ = t, e), zw = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], vo.set(t, n);
}, Fa = (t, e) => e in t, Tn = (t, e) => (0, console.error)(t, e), qs = /* @__PURE__ */ new Map(), Rw = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = qs.get(s);
  if (i)
    return i[r];
  {
    const o = (c) => (qs.set(s, c), c[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => V3).then(o, Tn);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (qs.set(s, o), o[r]), Tn);
}, Kr = /* @__PURE__ */ new Map(), bs = typeof window < "u" ? window : {}, Tt = bs.document || { head: {} }, ct = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, Lf = (t) => Promise.resolve(t), Gw = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), za = [], $f = [], Kw = (t, e) => (n) => {
  t.push(n), vi || (vi = !0, ct.$flags$ & 4 ? Io(Li) : ct.raf(Li));
}, Ra = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      Tn(n);
    }
  t.length = 0;
}, Li = () => {
  Ra(za), Ra($f), (vi = za.length > 0) && ct.raf(Li);
}, Io = (t) => Lf().then(t), Vw = /* @__PURE__ */ Kw($f), qw = () => Lf(), Mf = (t, e) => typeof window > "u" ? Promise.resolve() : qw().then(() => jw([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var Ww = Object.defineProperty, Yw = Object.defineProperties, Zw = Object.getOwnPropertyDescriptors, Vr = Object.getOwnPropertySymbols, Bf = Object.prototype.hasOwnProperty, _f = Object.prototype.propertyIsEnumerable, Ga = (t, e, n) => e in t ? Ww(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, $i = (t, e) => {
  for (var n in e || (e = {})) Bf.call(e, n) && Ga(t, n, e[n]);
  if (Vr) for (var n of Vr(e)) _f.call(e, n) && Ga(t, n, e[n]);
  return t;
}, Mi = (t, e) => Yw(t, Zw(e)), Xw = (t, e) => {
  var n = {};
  for (var r in t) Bf.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Vr) for (var r of Vr(t)) e.indexOf(r) < 0 && _f.call(t, r) && (n[r] = t[r]);
  return n;
};
function Nf() {
  return us(Pt()) || window.StacksProvider || window.BlockstackProvider;
}
function Qw(t) {
  return t ? typeof t == "string" ? je.fromName(t) : "version" in t ? t : "url" in t ? new di({ url: t.url }) : t.transactionVersion === Rr.Mainnet ? new di({ url: t.client.baseUrl }) : new gi({ url: t.client.baseUrl }) : new gi();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var Jw = (t) => {
  if (!t) {
    let e = new Qr(["store_write"], document.location.href);
    t = new Un({ appConfig: e });
  }
  return t;
}, ty = async (t, e = Nf()) => {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  let { redirectTo: n = "/", manifestPath: r, onFinish: s, onCancel: i, sendToSignIn: o = !1, userSession: c, appDetails: a } = t, f = Jw(c);
  f.isUserSignedIn() && f.signUserOut();
  let u = f.generateAndStoreTransitKey(), l = f.makeAuthRequest(u, `${document.location.origin}${n}`, `${document.location.origin}${r}`, f.appConfig.scopes, void 0, void 0, { sendToSignIn: o, appDetails: a, connectVersion: "__VERSION__" });
  try {
    let b = await e.authenticationRequest(l);
    await f.handlePendingSignIn(b);
    let h = at.decodeToken(b), x = h == null ? void 0 : h.payload;
    s == null || s({ authResponse: b, authResponsePayload: x, userSession: f });
  } catch (b) {
    console.error("[Connect] Error during auth request", b), i == null || i();
  }
}, ey = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(ey || {}), ny = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(ny || {}), Cf = (t) => {
  let e = t;
  if (!e) {
    let n = new Qr(["store_write"], document.location.href);
    e = new Un({ appConfig: n });
  }
  return e;
};
function ry(t) {
  try {
    return Cf(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var sy = (t) => {
  let e = Cf(t).loadUserData().appPrivateKey, n = at.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function Df(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? Mi($i({}, t), { message: Sa(e), domain: Sa(n) }) : Mi($i({}, t), { message: yt(bn(e)), domain: yt(bn(n)) });
}
async function iy(t, e) {
  return new at.TokenSigner("ES256k", e).signAsync(Df(t));
}
async function oy(t) {
  let e = t, { userSession: n } = e, r = Xw(e, ["userSession"]);
  if (ry(n)) {
    let { privateKey: s, publicKey: i } = sy(n), o = Mi($i({}, r), { publicKey: i });
    return iy(o, s);
  }
  return at.createUnsecuredToken(Df(t));
}
var cy = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(cy || {}), Hf = "asigna-stx", Ka = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === Hf && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(ly(t, e), "*");
}), ay = { authenticationRequest: async (t) => Ka(t, "authenticationRequest"), transactionRequest: async (t) => Ka(t, "transactionRequest") }, ly = (t, e) => ({ source: Hf, [e]: t }), fy = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = ay);
};
fy();
var Uf = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function uy(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = Pt(), o = Nf();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    Mf();
    let c = (s = n == null ? void 0 : n.defaultProviders) != null ? s : Uf, a = Db(c), f = document.createElement("connect-modal");
    f.defaultProviders = c, f.installedProviders = a, f.persistSelection = e;
    let u = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let l = () => {
      f.remove(), document.body.style.overflow = u;
    };
    f.callback = (h) => {
      l(), t(n, h);
    }, f.cancelCallback = () => {
      var h;
      l(), (h = n.onCancel) == null || h.call(n);
    }, document.body.appendChild(f);
    let b = (h) => {
      h.key === "Escape" && (document.removeEventListener("keydown", b), f.remove());
    };
    document.addEventListener("keydown", b);
  };
}
var hy = uy(ty, !1), dy = Gl;
function Of(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = kn(r);
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
    return BigInt(`0x${kf(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Lo(t, e = 8) {
  return (typeof t == "bigint" ? t : Of(t)).toString(16).padStart(e * 2, "0");
}
function Tf(t, e = 16) {
  const n = Lo(t, e);
  return kn(n);
}
function gy(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const by = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function kf(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += by[n];
  return e;
}
function kn(t) {
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
function $o(t) {
  return new TextEncoder().encode(t);
}
function py(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function xy(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Va(t) {
  if (t.some(xy))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Mo(...t) {
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
function Sn(t) {
  return Mo(...t.map((e) => typeof e == "number" ? Va([e]) : e instanceof Array ? Va(e) : e));
}
function ps(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Bi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Bi || (Bi = {}));
Bi.Mainnet;
const wy = 128, yy = 128, Pf = 16;
var _i;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(_i || (_i = {}));
var qa;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(qa || (qa = {}));
var Wa;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Wa || (Wa = {}));
var It;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(It || (It = {}));
const Ws = ["onChainOnly", "offChainOnly", "any"];
Ws[0] + "", It.OnChainOnly, Ws[1] + "", It.OffChainOnly, Ws[2] + "", It.Any, It.OnChainOnly + "", It.OnChainOnly, It.OffChainOnly + "", It.OffChainOnly, It.Any + "", It.Any;
var Ni;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ni || (Ni = {}));
Ni.Mainnet;
var Ya;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Ya || (Ya = {}));
var Za;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Za || (Za = {}));
var Xa;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Xa || (Xa = {}));
var Qa;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Qa || (Qa = {}));
var Ja;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ja || (Ja = {}));
var t0;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(t0 || (t0 = {}));
var e0;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(e0 || (e0 = {}));
var n0;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(n0 || (n0 = {}));
var r0;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(r0 || (r0 = {}));
var s0;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(s0 || (s0 = {}));
var i0;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(i0 || (i0 = {}));
function Ci(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function my(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function jf(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Sy(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ci(t.outputLen), Ci(t.blockLen);
}
function Ay(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Ey(t, e) {
  jf(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ys = {
  number: Ci,
  bool: my,
  bytes: jf,
  hash: Sy,
  exists: Ay,
  output: Ey
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Zs = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ht = (t, e) => t << 32 - e | t >>> e, vy = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!vy)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Iy(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Ff(t) {
  if (typeof t == "string" && (t = Iy(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Ly {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function qe(t) {
  const e = (r) => t().update(Ff(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function $y(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), a = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + a, o, r), t.setUint32(e + f, c, r);
}
class Bo extends Ly {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Zs(this.buffer);
  }
  update(e) {
    Ys.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Ff(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const a = Zs(e);
        for (; s <= i - o; o += s)
          this.process(a, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ys.exists(this), Ys.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    $y(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = Zs(e), a = this.outputLen;
    if (a % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = a / 4, u = this.get();
    if (f > u.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      c.setUint32(4 * l, u[l], i);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: c } = this;
    return e.length = s, e.pos = c, e.finished = i, e.destroyed = o, s % n && e.buffer.set(r), e;
  }
}
const My = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), zf = Uint8Array.from({ length: 16 }, (t, e) => e), By = zf.map((t) => (9 * t + 5) % 16);
let _o = [zf], No = [By];
for (let t = 0; t < 4; t++)
  for (let e of [_o, No])
    e.push(e[t].map((n) => My[n]));
const Rf = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), _y = _o.map((t, e) => t.map((n) => Rf[e][n])), Ny = No.map((t, e) => t.map((n) => Rf[e][n])), Cy = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Dy = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Sr = (t, e) => t << e | t >>> 32 - e;
function o0(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ar = new Uint32Array(16);
class Hy extends Bo {
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
      Ar[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, a = c, f = this.h3 | 0, u = f, l = this.h4 | 0, b = l;
    for (let h = 0; h < 5; h++) {
      const x = 4 - h, w = Cy[h], I = Dy[h], N = _o[h], C = No[h], g = _y[h], A = Ny[h];
      for (let y = 0; y < 16; y++) {
        const v = Sr(r + o0(h, i, c, f) + Ar[N[y]] + w, g[y]) + l | 0;
        r = l, l = f, f = Sr(c, 10) | 0, c = i, i = v;
      }
      for (let y = 0; y < 16; y++) {
        const v = Sr(s + o0(x, o, a, u) + Ar[C[y]] + I, A[y]) + b | 0;
        s = b, b = u, u = Sr(a, 10) | 0, a = o, o = v;
      }
    }
    this.set(this.h1 + c + u | 0, this.h2 + f + b | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + a | 0);
  }
  roundClean() {
    Ar.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
qe(() => new Hy());
const Uy = (t, e, n) => t & e ^ ~t & n, Oy = (t, e, n) => t & e ^ t & n ^ e & n, Ty = new Uint32Array([
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
]), me = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Se = new Uint32Array(64);
class Gf extends Bo {
  constructor() {
    super(64, 32, 8, !1), this.A = me[0] | 0, this.B = me[1] | 0, this.C = me[2] | 0, this.D = me[3] | 0, this.E = me[4] | 0, this.F = me[5] | 0, this.G = me[6] | 0, this.H = me[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: o, G: c, H: a } = this;
    return [e, n, r, s, i, o, c, a];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, a) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = c | 0, this.H = a | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      Se[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = Se[l - 15], h = Se[l - 2], x = Ht(b, 7) ^ Ht(b, 18) ^ b >>> 3, w = Ht(h, 17) ^ Ht(h, 19) ^ h >>> 10;
      Se[l] = w + Se[l - 7] + x + Se[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: a, G: f, H: u } = this;
    for (let l = 0; l < 64; l++) {
      const b = Ht(c, 6) ^ Ht(c, 11) ^ Ht(c, 25), h = u + b + Uy(c, a, f) + Ty[l] + Se[l] | 0, w = (Ht(r, 2) ^ Ht(r, 13) ^ Ht(r, 22)) + Oy(r, s, i) | 0;
      u = f, f = a, a = c, c = o + h | 0, o = i, i = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, f = f + this.G | 0, u = u + this.H | 0, this.set(r, s, i, o, c, a, f, u);
  }
  roundClean() {
    Se.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class ky extends Gf {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
qe(() => new Gf());
qe(() => new ky());
const Er = BigInt(2 ** 32 - 1), Di = BigInt(32);
function Kf(t, e = !1) {
  return e ? { h: Number(t & Er), l: Number(t >> Di & Er) } : { h: Number(t >> Di & Er) | 0, l: Number(t & Er) | 0 };
}
function Py(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Kf(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const jy = (t, e) => BigInt(t >>> 0) << Di | BigInt(e >>> 0), Fy = (t, e, n) => t >>> n, zy = (t, e, n) => t << 32 - n | e >>> n, Ry = (t, e, n) => t >>> n | e << 32 - n, Gy = (t, e, n) => t << 32 - n | e >>> n, Ky = (t, e, n) => t << 64 - n | e >>> n - 32, Vy = (t, e, n) => t >>> n - 32 | e << 64 - n, qy = (t, e) => e, Wy = (t, e) => t, Yy = (t, e, n) => t << n | e >>> 32 - n, Zy = (t, e, n) => e << n | t >>> 32 - n, Xy = (t, e, n) => e << n - 32 | t >>> 64 - n, Qy = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Jy(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const t4 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), e4 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, n4 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), r4 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, s4 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), i4 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, G = {
  fromBig: Kf,
  split: Py,
  toBig: jy,
  shrSH: Fy,
  shrSL: zy,
  rotrSH: Ry,
  rotrSL: Gy,
  rotrBH: Ky,
  rotrBL: Vy,
  rotr32H: qy,
  rotr32L: Wy,
  rotlSH: Yy,
  rotlSL: Zy,
  rotlBH: Xy,
  rotlBL: Qy,
  add: Jy,
  add3L: t4,
  add3H: e4,
  add4L: n4,
  add4H: r4,
  add5H: i4,
  add5L: s4
}, [o4, c4] = G.split([
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
].map((t) => BigInt(t))), Ae = new Uint32Array(80), Ee = new Uint32Array(80);
class xs extends Bo {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: a, Eh: f, El: u, Fh: l, Fl: b, Gh: h, Gl: x, Hh: w, Hl: I } = this;
    return [e, n, r, s, i, o, c, a, f, u, l, b, h, x, w, I];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, a, f, u, l, b, h, x, w, I) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = a | 0, this.Eh = f | 0, this.El = u | 0, this.Fh = l | 0, this.Fl = b | 0, this.Gh = h | 0, this.Gl = x | 0, this.Hh = w | 0, this.Hl = I | 0;
  }
  process(e, n) {
    for (let g = 0; g < 16; g++, n += 4)
      Ae[g] = e.getUint32(n), Ee[g] = e.getUint32(n += 4);
    for (let g = 16; g < 80; g++) {
      const A = Ae[g - 15] | 0, y = Ee[g - 15] | 0, v = G.rotrSH(A, y, 1) ^ G.rotrSH(A, y, 8) ^ G.shrSH(A, y, 7), D = G.rotrSL(A, y, 1) ^ G.rotrSL(A, y, 8) ^ G.shrSL(A, y, 7), B = Ae[g - 2] | 0, _ = Ee[g - 2] | 0, p = G.rotrSH(B, _, 19) ^ G.rotrBH(B, _, 61) ^ G.shrSH(B, _, 6), E = G.rotrSL(B, _, 19) ^ G.rotrBL(B, _, 61) ^ G.shrSL(B, _, 6), $ = G.add4L(D, E, Ee[g - 7], Ee[g - 16]), O = G.add4H($, v, p, Ae[g - 7], Ae[g - 16]);
      Ae[g] = O | 0, Ee[g] = $ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: a, Dh: f, Dl: u, Eh: l, El: b, Fh: h, Fl: x, Gh: w, Gl: I, Hh: N, Hl: C } = this;
    for (let g = 0; g < 80; g++) {
      const A = G.rotrSH(l, b, 14) ^ G.rotrSH(l, b, 18) ^ G.rotrBH(l, b, 41), y = G.rotrSL(l, b, 14) ^ G.rotrSL(l, b, 18) ^ G.rotrBL(l, b, 41), v = l & h ^ ~l & w, D = b & x ^ ~b & I, B = G.add5L(C, y, D, c4[g], Ee[g]), _ = G.add5H(B, N, A, v, o4[g], Ae[g]), p = B | 0, E = G.rotrSH(r, s, 28) ^ G.rotrBH(r, s, 34) ^ G.rotrBH(r, s, 39), $ = G.rotrSL(r, s, 28) ^ G.rotrBL(r, s, 34) ^ G.rotrBL(r, s, 39), O = r & i ^ r & c ^ i & c, k = s & o ^ s & a ^ o & a;
      N = w | 0, C = I | 0, w = h | 0, I = x | 0, h = l | 0, x = b | 0, { h: l, l: b } = G.add(f | 0, u | 0, _ | 0, p | 0), f = c | 0, u = a | 0, c = i | 0, a = o | 0, i = r | 0, o = s | 0;
      const U = G.add3L(p, $, k);
      r = G.add3H(U, _, E, O), s = U | 0;
    }
    ({ h: r, l: s } = G.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = G.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l: a } = G.add(this.Ch | 0, this.Cl | 0, c | 0, a | 0), { h: f, l: u } = G.add(this.Dh | 0, this.Dl | 0, f | 0, u | 0), { h: l, l: b } = G.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h, l: x } = G.add(this.Fh | 0, this.Fl | 0, h | 0, x | 0), { h: w, l: I } = G.add(this.Gh | 0, this.Gl | 0, w | 0, I | 0), { h: N, l: C } = G.add(this.Hh | 0, this.Hl | 0, N | 0, C | 0), this.set(r, s, i, o, c, a, f, u, l, b, h, x, w, I, N, C);
  }
  roundClean() {
    Ae.fill(0), Ee.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class a4 extends xs {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class l4 extends xs {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class f4 extends xs {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
qe(() => new xs());
qe(() => new a4());
qe(() => new l4());
qe(() => new f4());
function u4(t, e, n) {
  const s = wy;
  if ($4(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: _i.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var J;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(J || (J = {}));
const c0 = BigInt("0xffffffffffffffffffffffffffffffff"), h4 = BigInt(0);
BigInt("0x7fffffffffffffffffffffffffffffff");
BigInt("-170141183460469231731687303715884105728");
const a0 = (t) => {
  const e = Of(t);
  if (e < h4)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > c0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${c0}`);
  return { type: J.UInt, value: e };
};
function l0(t) {
  for (const e in t)
    if (!M4(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: J.Tuple, data: t };
}
const $n = (t) => ({ type: J.StringASCII, data: t });
class d4 extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class g4 extends d4 {
  constructor(e) {
    super(e);
  }
}
function Vf(t) {
  const e = [];
  return e.push(kn(Lo(t.version, 1))), e.push(kn(t.hash160)), Sn(e);
}
function qf(t) {
  const e = [], n = $o(t.content), r = n.byteLength;
  return e.push(kn(Lo(r, t.lengthPrefixBytes))), e.push(n), Sn(e);
}
function zt(t, e) {
  return Sn([t, e]);
}
function b4(t) {
  return new Uint8Array([t.type]);
}
function p4(t) {
  return t.type === J.OptionalNone ? new Uint8Array([t.type]) : zt(t.type, Kn(t.value));
}
function x4(t) {
  const e = new Uint8Array(4);
  return ps(e, t.buffer.length, 0), zt(t.type, Mo(e, t.buffer));
}
function w4(t) {
  const e = Tf(gy(t.value, BigInt(yy)), Pf);
  return zt(t.type, e);
}
function y4(t) {
  const e = Tf(t.value, Pf);
  return zt(t.type, e);
}
function m4(t) {
  return zt(t.type, Vf(t.address));
}
function S4(t) {
  return zt(t.type, Mo(Vf(t.address), qf(t.contractName)));
}
function A4(t) {
  return zt(t.type, Kn(t.value));
}
function E4(t) {
  const e = [], n = new Uint8Array(4);
  ps(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Kn(r);
    e.push(s);
  }
  return zt(t.type, Sn(e));
}
function v4(t) {
  const e = [], n = new Uint8Array(4);
  ps(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = u4(s);
    e.push(qf(i));
    const o = Kn(t.data[s]);
    e.push(o);
  }
  return zt(t.type, Sn(e));
}
function Wf(t, e) {
  const n = [], r = e == "ascii" ? py(t.data) : $o(t.data), s = new Uint8Array(4);
  return ps(s, r.length, 0), n.push(s), n.push(r), zt(t.type, Sn(n));
}
function I4(t) {
  return Wf(t, "ascii");
}
function L4(t) {
  return Wf(t, "utf8");
}
function Kn(t) {
  switch (t.type) {
    case J.BoolTrue:
    case J.BoolFalse:
      return b4(t);
    case J.OptionalNone:
    case J.OptionalSome:
      return p4(t);
    case J.Buffer:
      return x4(t);
    case J.UInt:
      return y4(t);
    case J.Int:
      return w4(t);
    case J.PrincipalStandard:
      return m4(t);
    case J.PrincipalContract:
      return S4(t);
    case J.ResponseOk:
    case J.ResponseErr:
      return A4(t);
    case J.List:
      return E4(t);
    case J.Tuple:
      return v4(t);
    case J.StringASCII:
      return I4(t);
    case J.StringUTF8:
      return L4(t);
    default:
      throw new g4("Unable to serialize. Invalid Clarity Value.");
  }
}
const $4 = (t, e) => t ? $o(t).length > e : !1;
function M4(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function B4(t) {
  const e = Kn(t);
  return `0x${kf(e)}`;
}
const Dn = (t) => {
  try {
    return ls.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
}, _4 = ["store_write"], f0 = "/manifest.json", N4 = /* @__PURE__ */ new Set([4001, -31001]), C4 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], Co = (t) => typeof t == "string" && t.toLowerCase().includes("leather"), Vn = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), An = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, sn = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, Hi = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Do = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => Hi(i, r)) === s
  );
}, Yf = (t) => t ? Do(An()).some(
  (e) => {
    var n;
    return e.id === t && (Vn(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Zf = () => {
  if (typeof window > "u")
    return;
  const t = An(), e = Do(t).filter(
    (n) => {
      var r;
      return Vn(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = sn(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of C4) {
    const r = sn(t, n) ?? (t === window ? void 0 : sn(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, Xf = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = An(), n = sn(e, t) ?? (e === window ? void 0 : sn(window, t)) ?? us(t);
  if (n)
    return n;
  if (Vn(t) || Yf(t))
    return Zf();
}, D4 = (t) => {
  const e = An();
  if (!e)
    return [];
  const n = Do(e), r = t.filter(
    (i) => !n.some((o) => Hi(o, i)) && !!sn(e, i.id)
  );
  return n.map((i) => {
    const o = t.find((c) => Hi(i, c));
    return o != null && o.icon ? { ...i, icon: o.icon } : i;
  }).concat(r);
}, Jt = () => ({ isConnected: !1 }), H4 = ["blockstack-session", "blockstack"], Qf = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of H4) {
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
Qf();
const U4 = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, nn = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, Ui = (t, e = "mainnet") => {
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
      return Ui(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Ui(r, e);
  }
  return e;
}, Oi = (t, e = 0) => {
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
      const i = Oi(s, e + 1);
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
    const i = Oi(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && Dn(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Dn(n.testnet) ? n.testnet.trim() : null;
}, u0 = (t) => {
  const e = nn(t);
  if (!e)
    return null;
  const n = U4(e);
  return /^[0-9a-f]{66}$/i.test(n) ? n : null;
}, Ti = (t, e, n = 0) => {
  if (n > 8 || !t)
    return null;
  if (Array.isArray(t)) {
    for (const o of t) {
      const c = Ti(o, e, n + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return e ? null : u0(t);
  const r = t, s = [r.address, r.stxAddress, r.selectedAddress].map((o) => nn(o)).find((o) => o && Dn(o)), i = [r.publicKey, r.public_key, r.stxPublicKey].map((o) => u0(o)).find(Boolean);
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
    const c = Ti(r[o], e, n + 1);
    if (c)
      return c;
  }
  return null;
}, O4 = (t) => {
  var i;
  const e = t.profile ?? {}, n = typeof e.stxAddress == "string" ? e.stxAddress : typeof ((i = e.stxAddress) == null ? void 0 : i.mainnet) == "string" ? e.stxAddress.mainnet : t.identityAddress, r = typeof n == "string" && Dn(n) ? n.trim() : null;
  if (!r)
    return Jt();
  const s = Pi(r);
  return s !== "mainnet" ? Jt() : {
    isConnected: !0,
    address: r,
    network: s
  };
}, T4 = (t, e = "mainnet") => {
  const n = Oi(t);
  if (!n)
    return Jt();
  const r = Pi(n) ?? Ui(t, e);
  if (r !== "mainnet")
    return Jt();
  const s = Ti(t, n);
  return {
    isConnected: !0,
    address: n,
    network: r,
    ...s ? { publicKey: s } : {}
  };
}, Ho = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Uo = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && N4.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, qr = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = nn(n == null ? void 0 : n.message) ?? nn(e.message) ?? nn(e.error) ?? nn(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, Jf = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw qr(e);
    if (e.status === "error")
      throw qr(e.result ?? e);
  }
  return t;
}, Oo = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return Jf(r);
  } catch (r) {
    throw qr(r);
  }
}, tu = () => Zf(), Wr = (t) => {
  var r, s;
  const e = Pt();
  if (Vn(e) || Yf(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = An() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === tu();
}, h0 = async (t, e, n) => {
  if (!Wr(t))
    return Oo(t, e, n);
  const r = tu();
  if (!r)
    throw Object.assign(new Error("Xverse modern request provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  try {
    return Jf(await r.request(e, n));
  } catch (s) {
    throw qr(s);
  }
}, k4 = (t) => {
}, eu = (t, e = 0) => {
  if (e > 5 || t === null || typeof t > "u")
    return [];
  if (Array.isArray(t))
    return [...new Set(t.filter((r) => typeof r == "string"))];
  if (typeof t != "object")
    return [];
  const n = t;
  for (const r of ["supportedMethods", "methods", "result", "data"])
    if (r in n) {
      const s = eu(n[r], e + 1);
      if (s.length > 0)
        return s;
    }
  return [];
}, P4 = [
  "wallet_connect",
  "stx_requestAccounts",
  "connect",
  "getAddresses",
  "stx_getAddresses",
  "stx_getAccounts",
  "getAccounts",
  "wallet_getAccount",
  "requestAccounts"
], j4 = async (t) => {
  const e = Pt();
  if (Wr(t))
    return ["wallet_connect", "stx_getAccounts", "wallet_getAccount"];
  if (!Co(e))
    return P4;
  const n = [
    "getAddresses",
    "stx_getAccounts",
    "stx_getAddresses",
    "stx_requestAccounts",
    "wallet_connect"
  ];
  try {
    const r = eu(await Oo(t, "supportedMethods"));
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
}, F4 = async (t) => {
  if (Wr(t))
    try {
      await h0(t, "wallet_disconnect");
    } catch {
    }
  const e = await j4(t);
  let n = null;
  for (const r of e)
    try {
      console.info("[wallet:connect]", { stage: "REQUEST", method: r });
      const s = await h0(t, r), i = T4(s);
      if (i.isConnected)
        return console.info("[wallet:connect]", {
          stage: "CONNECTED",
          method: r,
          hasPublicKey: !!i.publicKey
        }), Wr(t) && k4(i.address), i;
      console.info("[wallet:connect]", { stage: "EMPTY_RESPONSE", method: r });
    } catch (s) {
      n = s;
      const i = Ho(s);
      if ((i ? console.info : console.warn)("[wallet:connect]", {
        stage: "REQUEST_ERROR",
        method: r,
        code: s && typeof s == "object" && "code" in s ? s.code : void 0,
        message: s instanceof Error ? s.message : String(s)
      }), Uo(s))
        return Jt();
      if (i)
        continue;
      throw s;
    }
  if (n)
    throw n;
  return Jt();
}, z4 = async (t, e) => {
  const n = new Qr(_4, void 0, "", f0), r = new Un({ appConfig: n });
  return new Promise((s) => {
    hy(
      {
        appDetails: {
          name: t.appName,
          icon: t.appIcon
        },
        manifestPath: f0,
        userSession: r,
        onFinish: (i) => {
          s(O4(i.userSession.loadUserData()));
        },
        onCancel: () => {
          s(Jt());
        }
      },
      e
    );
  });
}, R4 = (t, e = !0) => {
  if (t && typeof t != "string")
    return t;
  const n = typeof t == "string" ? t : Pt(), r = Xf(n);
  return r ? (e && n && Rl(n), r) : null;
}, G4 = (t) => {
  if (typeof window > "u" || typeof document > "u")
    return Promise.resolve(null);
  const e = (t == null ? void 0 : t.persistSelection) ?? !0;
  return Mf(), new Promise((n) => {
    const r = document.createElement("connect-modal"), s = Uf, i = D4(s), o = document.body.style.overflow, c = () => {
      document.body.style.overflow = o, document.removeEventListener("keydown", a), r.remove();
    }, a = (f) => {
      f.key === "Escape" && (c(), n(null));
    };
    r.defaultProviders = s, r.installedProviders = i, r.persistSelection = e, r.callback = (f) => {
      const u = R4(f, e);
      console.info("[wallet:connect]", {
        stage: "PROVIDER_SELECTED",
        providerId: typeof f == "string" ? f : Pt() ?? "provider-object",
        resolved: !!u,
        requestBridge: typeof (u == null ? void 0 : u.request) == "function"
      }), c(), n(u);
    }, r.cancelCallback = () => {
      c(), n(null);
    }, document.body.style.overflow = "hidden", document.addEventListener("keydown", a), document.body.appendChild(r);
  });
}, K4 = () => Pt(), nu = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = Pt(), e = t ? Xf(t) : void 0;
  if (e)
    return e;
  const n = An() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, V4 = async (t) => {
  Qf();
  const e = await G4({});
  if (!e)
    return Jt();
  if (typeof e.request == "function")
    try {
      const n = await F4(e);
      if (n.isConnected)
        return n;
    } catch (n) {
      if (Uo(n))
        return Jt();
      if (!Ho(n))
        throw n;
    }
  return z4(t, e);
}, q4 = () => {
  const t = Pt();
  return Co(t) ? "leather" : Vn(t) ? "xverse" : t ? String(t) : void 0;
}, W4 = async (t) => {
  const e = qh("wallet_connect");
  Mn({ journey: e, step: "open", outcome: "start" });
  try {
    const n = await V4(t);
    return n.isConnected && n.address ? (ji(n.address, q4()), Fi(n.network), Mn({ journey: e, step: "authorize", outcome: "success" })) : Mn({ journey: e, step: "authorize", outcome: "abandon" }), n;
  } catch (n) {
    throw Mn({
      journey: e,
      step: "authorize",
      outcome: "error",
      errorCode: zh(n),
      error: n
    }), n;
  }
}, Y4 = async () => {
  const t = nu();
  if (t && Co(Pt()))
    for (const e of ["stx_disconnect", "wallet_disconnect", "disconnect", "deactivate"])
      try {
        await Oo(t, e);
        break;
      } catch (n) {
        if (Uo(n) || Ho(n))
          continue;
      }
  dy(), Gl(), ji(null), Fi(null), Mn({ flow: "wallet_connect", step: "disconnect", outcome: "info" });
}, Z4 = (t) => {
  const e = Th(), n = () => {
    e.clear();
  }, r = () => {
    const o = e.load();
    return o.isConnected && o.address && (ji(o.address), Fi(o.network)), o;
  };
  return {
    connect: async () => {
      const o = r(), c = await W4({
        appName: t.appName,
        appIcon: t.appIcon
      });
      return c.isConnected ? (e.save(c), c) : o.isConnected ? o : c;
    },
    disconnect: async () => {
      await Y4(), n();
    },
    getSession: r
  };
}, X4 = "xtrata.xyz/manage", Q4 = "Collection studio sign-in; no spending permission", J4 = (t) => t === "mainnet" ? 1 : 2147483648, t3 = (t) => ({
  domain: l0({
    name: $n(X4),
    version: $n("1"),
    "chain-id": a0(J4(t.network))
  }),
  message: l0({
    purpose: $n(Q4),
    address: $n(t.address),
    nonce: $n(t.nonce),
    expires: a0(t.expires)
  })
}), e3 = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), d0 = (t) => B4(t).replace(/^0x/, ""), g0 = "This wallet cannot sign messages. Try Xverse or Leather.", b0 = (t) => typeof (t == null ? void 0 : t.request) == "function", p0 = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", n3 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, r3 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function s3(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: d0(e.message),
    domain: d0(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function i3(t, e) {
  const n = await oy({
    domain: e.domain,
    message: e.message,
    network: Qw(e.network),
    stxAddress: e.stxAddress,
    appDetails: e.appDetails ?? e3()
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function o3(t) {
  var s, i;
  const e = K4() || "", n = /xverse/i.test(e);
  let r = nu();
  if (n && !p0(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (p0(r))
    try {
      return await i3(r, t);
    } catch (o) {
      if (n || !b0(r) || !r3(o)) throw o;
    }
  if (!n && b0(r))
    try {
      return await s3(r, t);
    } catch (o) {
      throw n3(o) ? new Error(g0) : o;
    }
  throw new Error(g0);
}
const To = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3::xtrata-inscription", c3 = "SP3JB6BCKV14CG25NF017CR7KRVSM8RAGHB52DWHX.xtrata-collection-audionauts-1-3c855746", a3 = (t) => "0x01" + BigInt(t).toString(16).padStart(32, "0"), l3 = (t) => {
  if (typeof t != "string") return null;
  const e = /^u(\d+)$/.exec(t.trim());
  if (!e) return null;
  const n = Number(e[1]);
  return Number.isSafeInteger(n) ? n : null;
}, f3 = (t) => typeof t == "string" && t.toLowerCase().startsWith("0x0a"), ru = (t) => t.replace(/\/$/, "");
async function u3(t, e = {}) {
  var f;
  const n = ru(e.hiroBase ?? "/hiro/mainnet"), r = e.fetchImpl ?? fetch, s = e.maxHeld ?? 1e3, i = 50, o = [];
  let c = 0, a = !1;
  for (; o.length < s; ) {
    const u = `${n}/extended/v1/tokens/nft/holdings?principal=${encodeURIComponent(t)}&asset_identifiers=${encodeURIComponent(To)}&limit=${i}&offset=${c}`, l = await r(u, { headers: { Accept: "application/json" }, signal: e.signal });
    if (!l.ok) throw new Error(`Holdings lookup failed (HTTP ${l.status}).`);
    const b = await l.json(), h = b.results ?? [];
    for (const w of h) {
      const I = l3((f = w == null ? void 0 : w.value) == null ? void 0 : f.repr);
      I !== null && o.push(I);
    }
    const x = Number(b.total ?? h.length);
    if (c += i, h.length < i || c >= x) break;
    o.length >= s && (a = !0);
  }
  return { ids: o, truncated: a };
}
async function h3(t, e, n = {}) {
  const r = ru(n.hiroBase ?? "/hiro/mainnet"), s = n.fetchImpl ?? fetch, [i, o] = c3.split("."), c = await s(
    `${r}/v2/contracts/call-read/${i}/${o}/get-token-mint-context`,
    {
      method: "POST",
      headers: { "content-type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ sender: e, arguments: [a3(t)] }),
      signal: n.signal
    }
  );
  if (!c.ok) throw new Error(`Collection lookup failed (HTTP ${c.status}).`);
  const a = await c.json();
  if (a.okay === !1) throw new Error("Collection lookup was rejected.");
  return f3(a.result);
}
const d3 = 111, g3 = To.split("::")[0], b3 = (t) => {
  if (typeof t != "string") return null;
  const e = /data-edition\s*=\s*["'](\d{1,3})["']/i.exec(t) ?? /<title>\s*Audionaut\s+(\d{1,3})\s*<\/title>/i.exec(t);
  if (!e) return null;
  const n = Number(e[1]);
  return Number.isInteger(n) && n >= 1 && n <= d3 ? n : null;
}, x0 = /* @__PURE__ */ new Map();
async function su(t, e = {}) {
  const n = x0.get(t);
  if (n !== void 0) return n;
  try {
    const s = await (e.fetchImpl ?? fetch)(`/i/${t}?contractId=${encodeURIComponent(g3)}&network=mainnet`, {
      headers: { Accept: "text/html" },
      signal: e.signal
    });
    if (!s.ok) return null;
    const i = b3(await s.text());
    return i !== null && x0.set(t, i), i;
  } catch {
    return null;
  }
}
async function p3(t, e = {}) {
  try {
    const { ids: n } = await u3(t, e), r = Math.max(1, e.concurrency ?? 8), s = [];
    for (let o = 0; o < n.length; o += r) {
      const c = n.slice(o, o + r), a = await Promise.all(c.map((f) => h3(f, t, e)));
      c.forEach((f, u) => a[u] && s.push(f));
    }
    if (!s.length) return null;
    const i = await Promise.all(
      s.map(async (o) => ({ tokenId: o, edition: await su(o, e) }))
    );
    return i.sort((o, c) => (o.edition ?? 1 / 0) - (c.edition ?? 1 / 0) || o.tokenId - c.tokenId), i[0];
  } catch {
    return null;
  }
}
const iu = ["ion", "flare", "luna", "genesis", "synthwave", "prism", "neon", "voyager", "ranger", "sentinel"], x3 = { ion: !1, flare: !1, luna: !1, genesis: !0, synthwave: !0, prism: !0, neon: !0, voyager: !1, ranger: !1, sentinel: !1 }, w3 = ["", "sepia(.28) contrast(.95) brightness(.88)", "saturate(.6) brightness(1.22)", "saturate(1.2) contrast(1.1)", "saturate(1.65) contrast(1.15)", "saturate(.65) contrast(.86) brightness(.9)", "saturate(.4) contrast(1.4) brightness(1.18)"], y3 = { voyager: [[0.4825, 84e-4], [0.5367, 0.01], [0.5797, 0.0171], [0.5905, 0.0239], [0.5997, 0.0435], [0.6148, 0.0466], [0.6571, 0.0634], [0.7017, 0.0873], [0.7337, 0.1089], [0.7978, 0.181], [0.825, 0.2201], [0.8417, 0.2512], [0.8573, 0.2548], [0.8704, 0.2647], [0.8824, 0.2855], [0.8888, 0.3102], [0.9131, 0.3146], [0.9282, 0.3218], [0.939, 0.3349], [0.9438, 0.3469], [0.9581, 0.3573], [0.9653, 0.3692], [0.9701, 0.3836], [0.9765, 0.429], [0.9749, 0.4992], [0.9701, 0.5247], [0.9621, 0.5447], [0.9537, 0.5546], [0.943, 0.5606], [0.9342, 0.5782], [0.9242, 0.5873], [0.9091, 0.5929], [0.8884, 0.5953], [0.8724, 0.6017], [0.8561, 0.6395], [0.864, 0.6451], [0.868, 0.6539], [0.8732, 0.6567], [0.8808, 0.6659], [0.8848, 0.6794], [0.8856, 0.6986], [0.8832, 0.7129], [0.8784, 0.7241], [0.8644, 0.7428], [0.8509, 0.75], [0.8274, 0.752], [0.825, 0.7648], [0.8353, 0.7751], [0.8409, 0.7847], [0.8449, 0.8166], [0.8441, 0.8413], [0.8409, 0.8573], [0.8282, 0.8788], [0.8086, 0.8975], [0.7823, 0.9151], [0.7376, 0.9366], [0.6986, 0.9502], [0.6547, 0.9613], [0.6013, 0.9701], [0.5454, 0.9749], [0.5132, 0.9753], [0.4713, 0.9757], [0.4043, 0.9709], [0.3644, 0.9653], [0.3086, 0.9526], [0.2592, 0.9358], [0.2297, 0.9223], [0.1954, 0.9015], [0.1766, 0.886], [0.1655, 0.8732], [0.1583, 0.8605], [0.1551, 0.8493], [0.1535, 0.8325], [0.1551, 0.7943], [0.1607, 0.7783], [0.1726, 0.7648], [0.1711, 0.7528], [0.1459, 0.75], [0.134, 0.7436], [0.1216, 0.7297], [0.1168, 0.7209], [0.112, 0.7049], [0.1112, 0.689], [0.1152, 0.6699], [0.1192, 0.6627], [0.1304, 0.6539], [0.1336, 0.6459], [0.1423, 0.6403], [0.1416, 0.6372], [0.1252, 0.6009], [0.11, 0.5953], [0.0861, 0.5921], [0.0742, 0.5873], [0.061, 0.5742], [0.0554, 0.5606], [0.0462, 0.5554], [0.0387, 0.5478], [0.0323, 0.5367], [0.0283, 0.5247], [0.0219, 0.4825], [0.0211, 0.4569], [0.0235, 0.4123], [0.0275, 0.3876], [0.0371, 0.362], [0.0462, 0.3521], [0.0546, 0.3469], [0.0594, 0.3349], [0.071, 0.321], [0.0853, 0.3146], [0.1096, 0.3102], [0.1144, 0.2895], [0.1272, 0.2656], [0.1364, 0.2572], [0.1567, 0.2496], [0.1726, 0.2185], [0.1886, 0.1946], [0.2548, 0.118], [0.2735, 0.1017], [0.3142, 0.0762], [0.3644, 0.053], [0.3987, 0.0435], [0.4071, 0.0255], [0.4163, 0.0179], [0.449, 0.0116], [0.4825, 84e-4]], ranger: [[0.4864, 0.0108], [0.5136, 0.0108], [0.5375, 0.014], [0.5435, 0.0191], [0.5486, 0.0283], [0.5734, 0.0347], [0.6029, 0.0466], [0.6196, 0.0586], [0.6627, 0.0794], [0.7049, 0.1057], [0.7408, 0.1336], [0.7675, 0.1595], [0.7883, 0.1842], [0.8417, 0.2376], [0.8561, 0.2584], [0.8589, 0.2651], [0.8648, 0.2568], [0.8648, 0.248], [0.868, 0.2368], [0.8624, 0.1547], [0.8553, 0.1459], [0.8521, 0.138], [0.8481, 0.0893], [0.8489, 0.0742], [0.8545, 0.063], [0.862, 0.0562], [0.8724, 0.0522], [0.8828, 0.0522], [0.89, 0.0546], [0.9007, 0.0638], [0.9063, 0.0766], [0.9103, 0.138], [0.9039, 0.1507], [0.9039, 0.1643], [0.9095, 0.236], [0.9127, 0.2416], [0.9135, 0.248], [0.9214, 0.2536], [0.9326, 0.2759], [0.943, 0.3126], [0.9462, 0.3357], [0.9462, 0.3541], [0.9422, 0.3724], [0.9374, 0.382], [0.9238, 0.3923], [0.9238, 0.3963], [0.9246, 0.4027], [0.9462, 0.4195], [0.9534, 0.4354], [0.9573, 0.4506], [0.9621, 0.4928], [0.9621, 0.5287], [0.9581, 0.563], [0.9542, 0.5782], [0.9478, 0.5893], [0.9438, 0.6029], [0.933, 0.616], [0.9191, 0.6268], [0.9159, 0.6427], [0.9031, 0.6675], [0.8848, 0.6914], [0.8648, 0.7113], [0.8624, 0.7321], [0.8553, 0.7504], [0.8381, 0.7699], [0.8266, 0.7783], [0.817, 0.807], [0.8066, 0.8254], [0.7939, 0.8405], [0.7671, 0.8664], [0.736, 0.892], [0.701, 0.9167], [0.6475, 0.9478], [0.5861, 0.9765], [0.5598, 0.9845], [0.5191, 0.99], [0.4705, 0.9892], [0.4266, 0.9813], [0.3979, 0.9701], [0.3485, 0.9462], [0.3118, 0.9254], [0.264, 0.8927], [0.2265, 0.8616], [0.1966, 0.8309], [0.1838, 0.8102], [0.1726, 0.7783], [0.1627, 0.7715], [0.1495, 0.7584], [0.1423, 0.748], [0.1368, 0.7321], [0.1344, 0.7113], [0.1096, 0.6858], [0.0961, 0.6675], [0.0841, 0.6451], [0.0801, 0.6268], [0.0686, 0.6184], [0.0562, 0.6045], [0.0427, 0.5702], [0.0379, 0.5407], [0.0371, 0.4896], [0.0395, 0.4633], [0.0443, 0.4402], [0.053, 0.4195], [0.0746, 0.4027], [0.077, 0.3844], [0.0857, 0.3652], [0.1001, 0.3421], [0.1176, 0.3206], [0.128, 0.2751], [0.1376, 0.2592], [0.1543, 0.2392], [0.2125, 0.1826], [0.2317, 0.1595], [0.2488, 0.1423], [0.2943, 0.1057], [0.3254, 0.0857], [0.3796, 0.0586], [0.3891, 0.0506], [0.4035, 0.0435], [0.4314, 0.0331], [0.4514, 0.0283], [0.4557, 0.0199], [0.4625, 0.014], [0.4864, 0.0108]], sentinel: [[0.4115, 92e-4], [0.5766, 92e-4], [0.6045, 0.0108], [0.6085, 0.0124], [0.6308, 0.0347], [0.6738, 0.0506], [0.7321, 0.0777], [0.8269, 0.1663], [0.8429, 0.1679], [0.8481, 0.1722], [0.8951, 0.2464], [0.9135, 0.2791], [0.9167, 0.319], [0.9386, 0.3337], [0.9454, 0.3477], [0.9589, 0.3604], [0.9629, 0.3692], [0.9781, 0.3916], [0.9829, 0.4107], [0.9868, 0.4458], [0.9876, 0.4904], [0.9852, 0.5207], [0.9805, 0.5494], [0.9749, 0.5654], [0.9661, 0.575], [0.9557, 0.5909], [0.9454, 0.6005], [0.939, 0.626], [0.9206, 0.642], [0.9095, 0.7185], [0.8497, 0.7966], [0.8461, 0.8002], [0.8341, 0.8042], [0.8313, 0.807], [0.8154, 0.8389], [0.8062, 0.8473], [0.685, 0.9382], [0.6818, 0.9398], [0.6691, 0.9382], [0.6085, 0.9741], [0.5869, 0.9757], [0.5, 0.9773], [0.3923, 0.9749], [0.3293, 0.9382], [0.315, 0.939], [0.252, 0.8927], [0.183, 0.8389], [0.1671, 0.8062], [0.1495, 0.7974], [0.0897, 0.7193], [0.0825, 0.6802], [0.0785, 0.642], [0.0594, 0.626], [0.053, 0.5997], [0.0427, 0.5901], [0.0339, 0.5766], [0.0251, 0.567], [0.0179, 0.5471], [0.0116, 0.4952], [0.0116, 0.4466], [0.0155, 0.4123], [0.0211, 0.3907], [0.0299, 0.3788], [0.0403, 0.3597], [0.0478, 0.3513], [0.053, 0.3485], [0.0578, 0.3365], [0.0817, 0.319], [0.0849, 0.2799], [0.1049, 0.244], [0.1511, 0.1714], [0.1579, 0.1671], [0.1714, 0.1663], [0.2687, 0.0762], [0.327, 0.0498], [0.3676, 0.0347], [0.3931, 0.0108], [0.4115, 92e-4]] }, m3 = [
  [0, 0, 0, "Ion"],
  [1, 0, 0, "Ember"],
  [2, 0, 0, "Luna"],
  [3, 0, 0, "Genesis"],
  [4, 0, 0, "Mirage"],
  [5, 0, 0, "Prism"],
  [0, 325, 0, "Echo"],
  [2, 0, 0, "Vesper"],
  [1, 170, 0, "Nova"],
  [6, 215, 0, "Circuit"],
  [0, 205, 0, "Sol"],
  [2, 0, 0, "Drift"],
  [1, 171, 1, "Altair"],
  [7, 46, 2, "Andromeda"],
  [4, 234, 3, "Aphelion"],
  [6, 178, 4, "Apollo"],
  [8, 195, 2, "Aquila"],
  [0, 211, 5, "Arcturus"],
  [5, 183, 3, "Ariel"],
  [3, 52, 2, "Artemis"],
  [2, 195, 3, "Astra"],
  [9, 46, 2, "Atlas"],
  [1, 0, 3, "Aurora"],
  [7, 286, 5, "Axiom"],
  [4, 323, 2, "Beacon"],
  [6, 116, 2, "Bellatrix"],
  [8, 24, 6, "Borealis"],
  [0, 91, 1, "Caelum"],
  [5, 272, 2, "Callisto"],
  [3, 350, 4, "Calypso"],
  [2, 24, 4, "Capella"],
  [9, 286, 4, "Cassiopeia"],
  [1, 195, 3, "Castor"],
  [7, 337, 5, "Celeste"],
  [4, 290, 2, "Ceres"],
  [6, 244, 5, "Charon"],
  [8, 219, 4, "Comet"],
  [0, 142, 6, "Cosmo"],
  [5, 239, 2, "Cygnus"],
  [3, 118, 4, "Delta"],
  [2, 219, 6, "Deneb"],
  [9, 337, 2, "Dione"],
  [1, 22, 4, "Eclipse"],
  [7, 160, 6, "Electra"],
  [4, 172, 1, "Elara"],
  [6, 275, 3, "Enceladus"],
  [8, 46, 4, "Equinox"],
  [0, 325, 3, "Eris"],
  [5, 121, 1, "Europa"],
  [3, 149, 4, "Eventide"],
  [2, 46, 4, "Faraday"],
  [9, 160, 6, "Fathom"],
  [1, 262, 5, "Flux"],
  [7, 249, 6, "Gemini"],
  [4, 110, 2, "Halley"],
  [6, 104, 6, "Helios"],
  [8, 286, 2, "Horizon"],
  [0, 54, 3, "Hyperion"],
  [5, 59, 3, "Iapetus"],
  [3, 338, 4, "Indra"],
  [2, 286, 6, "Io"],
  [9, 249, 1, "Iris"],
  [1, 313, 4, "Juno"],
  [7, 216, 2, "Kepler"],
  [4, 238, 5, "Lyra"],
  [6, 299, 2, "Magnetar"],
  [8, 337, 3, "Maia"],
  [0, 21, 2, "Meridian"],
  [5, 187, 2, "Meteor"],
  [3, 173, 4, "Mira"],
  [2, 337, 1, "Nebula"],
  [9, 216, 1, "Neptune"],
  [1, 136, 6, "Nix"],
  [7, 98, 4, "Oberon"],
  [4, 269, 1, "Odyssey"],
  [6, 126, 5, "Orion"],
  [8, 160, 2, "Osiris"],
  [0, 263, 2, "Parallax"],
  [5, 218, 5, "Pegasus"],
  [3, 0, 2, "Perseus"],
  [2, 160, 5, "Phobos"],
  [9, 98, 4, "Phoenix"],
  [1, 225, 2, "Pioneer"],
  [7, 36, 2, "Polaris"],
  [4, 98, 4, "Pollux"],
  [6, 6, 4, "Proteus"],
  [8, 249, 2, "Pulsar"],
  [0, 201, 4, "Quantum"],
  [5, 47, 1, "Quasar"],
  [3, 240, 6, "Rhea"],
  [2, 249, 3, "Rigel"],
  [9, 36, 5, "Sagan"],
  [1, 192, 5, "Selene"],
  [7, 164, 2, "Sirius"],
  [4, 293, 5, "Solstice"],
  [6, 57, 6, "Sonar"],
  [8, 216, 5, "Sputnik"],
  [0, 329, 4, "Stratos"],
  [5, 242, 2, "Talos"],
  [3, 291, 6, "Tethys"],
  [2, 216, 2, "Titan"],
  [9, 164, 2, "Triton"],
  [1, 74, 3, "Umbra"],
  [7, 195, 3, "Vega"],
  [4, 120, 2, "Vector"],
  [6, 240, 4, "Vega-Prime"],
  [8, 98, 1, "Vela"],
  [0, 0, 6, "Venus"],
  [5, 69, 3, "Vertex"],
  [3, 114, 6, "Zenith"],
  [2, 98, 1, "Zephyr"]
], S3 = To.split("::")[0], A3 = 3059, E3 = `/i/${A3}?contractId=${encodeURIComponent(S3)}&network=mainnet`, Xs = '<script type="application/json" id="audionauts-helmets-v1">', v3 = (t) => {
  if (typeof t != "string") return null;
  const e = t.indexOf(Xs);
  if (e < 0) return null;
  const n = t.indexOf("<\/script>", e + Xs.length);
  if (n < 0) return null;
  try {
    const r = JSON.parse(t.slice(e + Xs.length, n));
    if (r.format !== "audionauts-helmets-v1" || !r.assets) return null;
    const s = {};
    for (const i of iu) {
      const o = r.assets[`${i}.webp`];
      if (!o || o.mime !== "image/webp" || typeof o.base64 != "string") return null;
      s[i] = `data:image/webp;base64,${o.base64}`;
    }
    return s;
  } catch {
    return null;
  }
};
function ou(t) {
  const e = Number.isInteger(t) ? m3[t - 1] : void 0;
  if (!e) return null;
  const [n, r, s, i] = e, o = iu[n], c = w3[s] ?? "", a = y3[o];
  return {
    asset: o,
    name: i,
    filter: `hue-rotate(${r}deg)${c ? ` ${c}` : ""}`,
    clipPath: a ? `polygon(${a.map(([f, u]) => `${+(f * 100).toFixed(2)}% ${+(u * 100).toFixed(2)}%`).join(",")})` : void 0,
    pixel: !!x3[o]
  };
}
let vr;
function I3(t) {
  return vr || (vr = (t.fetchImpl ?? fetch)(E3, { headers: { Accept: "text/html" }, signal: t.signal }).then(async (n) => n.ok ? v3(await n.text()) : null).catch(() => null).then((n) => (n || (vr = void 0), n))), vr;
}
async function L3(t, e = {}) {
  const n = ou(t);
  if (!n) return null;
  const r = await I3(e), s = r == null ? void 0 : r[n.asset];
  if (!s) return null;
  const { asset: i, ...o } = n;
  return { ...o, src: s };
}
function $3({ isEnabled: t, reducedMotion: e }) {
  let n, r, s, i, o, c, a = !1;
  const f = (g) => 440 * Math.pow(2, (g - 69) / 12);
  function u(g, A) {
    const y = n.sampleRate, v = Math.ceil(y * g), D = n.createBuffer(2, v, y);
    for (let B = 0; B < 2; B++) {
      const _ = D.getChannelData(B);
      let p = 0;
      for (let E = 0; E < v; E++)
        p += (Math.random() * 2 - 1 - p) * 0.45, _[E] = p * Math.pow(1 - E / v, A);
    }
    return D;
  }
  function l() {
    if (!t()) return !1;
    try {
      if (!a) {
        const g = window.AudioContext || window.webkitAudioContext;
        if (!g) return !1;
        n = new g(), r = n.createGain(), r.gain.value = 0.8;
        const A = n.createDynamicsCompressor();
        A.threshold.value = -16, A.knee.value = 12, A.ratio.value = 6, A.attack.value = 4e-3, A.release.value = 0.22, r.connect(A), A.connect(n.destination), i = n.createGain(), i.connect(r), o = n.createGain();
        const y = n.createConvolver();
        y.buffer = u(2.6, 2.4);
        const v = n.createGain();
        v.gain.value = 0.6, o.connect(y), y.connect(v), v.connect(r), c = n.createGain();
        const D = n.createDelay(1);
        D.delayTime.value = 0.3;
        const B = n.createGain();
        B.gain.value = 0.42;
        const _ = n.createBiquadFilter();
        _.type = "lowpass", _.frequency.value = 2600;
        const p = n.createGain();
        p.gain.value = 0.5, c.connect(D), D.connect(_), _.connect(B), B.connect(D), _.connect(p), p.connect(r), s = n.createBuffer(1, Math.ceil(n.sampleRate * 2), n.sampleRate);
        const E = s.getChannelData(0);
        for (let $ = 0; $ < E.length; $++) E[$] = Math.random() * 2 - 1;
        a = !0;
      }
      return n.state === "suspended" && n.resume().catch(() => {
      }), !0;
    } catch {
      return !1;
    }
  }
  function b(g, A = 0.2, y = 0) {
    if (g.connect(i), A) {
      const v = n.createGain();
      v.gain.value = A, g.connect(v), v.connect(o);
    }
    if (y) {
      const v = n.createGain();
      v.gain.value = y, g.connect(v), v.connect(c);
    }
  }
  function h(g, ...A) {
    g.onended = () => {
      try {
        g.disconnect();
      } catch {
      }
      for (const y of A)
        try {
          y.disconnect();
        } catch {
        }
    };
  }
  function x(g, A, y, v, D = {}) {
    const { type: B = "sawtooth", voices: _ = 3, spread: p = 12, cut0: E = 600, cut1: $ = 3e3, q: O = 3, attack: k = 0.012, release: U = 0.18, reverb: nt = 0.25, echo: Bt = 0, glide: Rt = 0 } = D, m = n.createBiquadFilter();
    m.type = "lowpass", m.Q.value = O, m.frequency.setValueAtTime(E, g), m.frequency.exponentialRampToValueAtTime(Math.max(40, $), g + y);
    const M = n.createGain();
    M.gain.setValueAtTime(1e-4, g), M.gain.linearRampToValueAtTime(v, g + k), M.gain.setValueAtTime(v, g + Math.max(k, y - 0.02)), M.gain.exponentialRampToValueAtTime(1e-4, g + y + U), m.connect(M), b(M, nt, Bt);
    let Y;
    for (let Z = 0; Z < _; Z++) {
      const K = n.createOscillator();
      K.type = B, K.detune.value = (Z - (_ - 1) / 2) * p, K.frequency.setValueAtTime(A, g), Rt && K.frequency.exponentialRampToValueAtTime(Math.max(20, A * Rt), g + y);
      const tt = n.createGain();
      tt.gain.value = 1 / _, K.connect(tt), tt.connect(m), K.start(g), K.stop(g + y + U + 0.05), Y = K;
    }
    Y && h(Y, m, M);
  }
  function w(g, A, y, v, D, B = {}) {
    const { type: _ = "sawtooth", reverb: p = 0.3, echo: E = 0.25, q: $ = 6, cut: O = 3500 } = B, k = n.createOscillator(), U = n.createBiquadFilter(), nt = n.createGain();
    k.type = _, k.frequency.setValueAtTime(A, g), k.frequency.exponentialRampToValueAtTime(Math.max(20, y), g + v), U.type = "lowpass", U.Q.value = $, U.frequency.setValueAtTime(O, g), U.frequency.exponentialRampToValueAtTime(Math.max(120, O * 0.15), g + v), nt.gain.setValueAtTime(1e-4, g), nt.gain.linearRampToValueAtTime(D, g + 4e-3), nt.gain.exponentialRampToValueAtTime(1e-4, g + v), k.connect(U), U.connect(nt), b(nt, p, E), k.start(g), k.stop(g + v + 0.03), h(k, U, nt);
  }
  function I(g, A, y, v, D) {
    const B = n.createOscillator(), _ = n.createGain();
    B.type = "sine", B.frequency.setValueAtTime(A, g), B.frequency.exponentialRampToValueAtTime(Math.max(18, y), g + v), _.gain.setValueAtTime(1e-4, g), _.gain.linearRampToValueAtTime(D, g + 0.01), _.gain.exponentialRampToValueAtTime(1e-4, g + v), B.connect(_), b(_, 0.04, 0), B.start(g), B.stop(g + v + 0.03), h(B, _);
  }
  function N(g, A, y, v, D, B = "bandpass", _ = 0.9, p = 0.3) {
    const E = n.createBufferSource(), $ = n.createBiquadFilter(), O = n.createGain();
    E.buffer = s, E.loop = !0, $.type = B, $.Q.value = _, $.frequency.setValueAtTime(v, g), $.frequency.exponentialRampToValueAtTime(Math.max(40, D), g + A), O.gain.setValueAtTime(1e-4, g), O.gain.linearRampToValueAtTime(y, g + Math.min(0.12, A * 0.25)), O.gain.exponentialRampToValueAtTime(1e-4, g + A), E.connect($), $.connect(O), b(O, p, 0), E.start(g), E.stop(g + A + 0.03), h(E, $, O);
  }
  function C(g, A, y, v, D = {}) {
    A.forEach(
      (B, _) => x(g + _ * y, f(B), y * 0.9, v, { cut0: 3400, cut1: 600, q: 6, spread: 10, release: 0.1, reverb: 0.3, echo: 0.4, ...D })
    );
  }
  return {
    resume: l,
    mute(g) {
      a && (r.gain.cancelScheduledValues(n.currentTime), r.gain.setTargetAtTime(g ? 0 : 0.8, n.currentTime, 0.025));
    },
    // Sound switched on: a quick power-up arpeggio.
    powerOn() {
      if (!l()) return;
      const g = n.currentTime;
      C(g, [57, 64, 69, 76], 0.07, 0.07, { echo: 0.5 }), w(g + 0.28, 600, 2800, 0.22, 0.05);
    },
    // Light changes colour: one short, distinct voice per colour.
    lamp(g) {
      if (!l()) return;
      const A = n.currentTime;
      g === "red" ? (w(A, 190, 150, 0.09, 0.08, { type: "square", cut: 1400, echo: 0.1 }), w(A + 0.13, 190, 140, 0.1, 0.08, { type: "square", cut: 1400, echo: 0.1 }), I(A, 70, 40, 0.25, 0.3)) : g === "amber" ? w(A, 520, 700, 0.09, 0.28, { type: "triangle", cut: 4200, echo: 0.3 }) : (w(A, 880, 1320, 0.1, 0.2, { type: "triangle", cut: 6e3, echo: 0.4 }), w(A + 0.1, 1320, 1760, 0.14, 0.18, { type: "triangle", cut: 6e3, echo: 0.4 }));
    },
    // Scanner data blip (called once per scan stage).
    beep(g = 880, A = 0.08, y = 0.08) {
      l() && w(n.currentTime, g * 1.3, g * 2.4, A, y * 3.4, { type: "square", cut: 5200, q: 3, echo: 0.35 });
    },
    // Orange: identity check. Pulsing minor arpeggio over a throbbing bass, with a rising shimmer.
    scan() {
      if (!l()) return;
      const g = n.currentTime, A = [57, 60, 64, 69, 64, 60, 57, 64];
      for (let y = 0; y < 16; y++)
        x(g + 0.05 + y * 0.11, f(A[y % 8] + (y >= 8 ? 12 : 0)), 0.1, 0.055 + y * 3e-3, { cut0: 3300, cut1: 500, q: 7, spread: 9, release: 0.1, reverb: 0.3, echo: 0.4 });
      for (let y = 0; y < 4; y++)
        x(g + y * 0.44, f(33), 0.3, 0.14, { voices: 2, spread: 6, cut0: 420, cut1: 130, q: 2, reverb: 0.1, release: 0.12 }), I(g + y * 0.44, 55, 41, 0.3, 0.22);
      N(g, 1.7, 0.05, 700, 6500, "bandpass", 2, 0.3);
    },
    // Green: access granted.
    success() {
      if (!l()) return;
      const g = n.currentTime;
      [60, 64, 67, 71].forEach((A) => x(g, f(A), 0.55, 0.065, { voices: 4, spread: 16, cut0: 900, cut1: 5200, q: 2, attack: 0.015, release: 0.7, reverb: 0.5, echo: 0.3 })), x(g, f(36), 0.6, 0.15, { voices: 2, spread: 5, cut0: 300, cut1: 200, q: 1, reverb: 0.1, release: 0.2 }), I(g, 65, 42, 0.5, 0.28), C(g + 0.1, [72, 76, 79, 84], 0.085, 0.07, { cut0: 4200, cut1: 1200, q: 4, echo: 0.5 }), w(g, 900, 5200, 0.3, 0.035, { cut: 9e3, q: 2 });
    },
    // Red fault.
    deny() {
      if (!l()) return;
      const g = n.currentTime;
      w(g, 520, 90, 0.45, 0.12, { cut: 2600, q: 8, echo: 0.1 }), w(g + 0.14, 400, 70, 0.4, 0.09, { type: "square", cut: 1800, q: 6, echo: 0.1 }), I(g, 72, 34, 0.55, 0.32);
    },
    // Orange: handwheel servo whine + ratchet clicks.
    wheel() {
      if (!l() || e()) return;
      const g = n.currentTime;
      w(g, 110, 520, 1, 0.055, { type: "triangle", cut: 2800, q: 10, reverb: 0.3, echo: 0.2 }), w(g + 0.05, 220, 1040, 0.95, 0.022, { type: "square", cut: 3200, q: 8, reverb: 0.3, echo: 0.3 }), N(g, 1, 0.1, 500, 2400, "bandpass", 1.4, 0.25);
      for (let A = 0; A < 18; A++) {
        const y = A / 18;
        N(g + 0.025 + 0.93 * y * y, 0.04, 0.09, 2300 + A * 40, 2300 + A * 40, "highpass", 0.7, 0.12);
      }
      I(g, 72, 46, 1, 0.18);
    },
    // Steam vent: air + a short falling zap.
    hiss() {
      if (!l() || e()) return;
      const g = n.currentTime;
      N(g, 1.2, 0.2, 1800, 7e3, "bandpass", 0.9, 0.35), w(g, 2600, 320, 0.9, 0.018, { type: "sawtooth", cut: 5e3, q: 2 });
    },
    // Mechanical thunk: sub + noise + relay blip.
    clunk(g = 1) {
      if (!l()) return;
      const A = n.currentTime;
      I(A, 95, 36, 0.35, 0.5 * g), N(A, 0.18, 0.32 * g, 1500, 300, "lowpass", 0.8, 0.25), w(A, 1200, 300, 0.07, 0.08 * g, { type: "square", cut: 4e3, echo: 0.15, reverb: 0.2 });
    },
    // Green: fully unlocked.
    portal() {
      if (!l()) return;
      const g = n.currentTime;
      [53, 57, 60, 64].forEach((A) => x(g, f(A), 1.4, 0.055, { voices: 4, spread: 18, cut0: 500, cut1: 4200, q: 2, attack: 0.05, release: 1.2, reverb: 0.6, echo: 0.25 })), x(g, f(29), 1, 0.18, { voices: 2, spread: 5, cut0: 420, cut1: 140, q: 2, reverb: 0.15, release: 0.3 }), I(g, 43.7, 40, 1, 0.28), C(g + 0.12, [69, 72, 77, 81, 84, 81, 77, 72], 0.08, 0.05, { cut0: 3800, cut1: 900, q: 5, echo: 0.5, reverb: 0.45 }), w(g, 300, 3800, 0.6, 0.028, { cut: 8e3, q: 3 });
    }
  };
}
const M3 = {
  sealed: ["red", "steady", "LOCKED", "A–07 · sealed"],
  scanning: ["amber", "slow", "SCANNING", "A–07 · verifying"],
  granted: ["green", "blink", "GRANTED", "A–07 · cleared"],
  unlocking: ["amber", "fast", "RELEASE", "A–07 · cycling"],
  unlocked: ["green", "steady", "UNLOCKED", "A–07 · open"],
  relocking: ["amber", "slow", "SEALING", "A–07 · cycling"],
  denied: ["red", "flash", "DENIED", "A–07 · fault"]
}, B3 = 45e3, w0 = "CONNECT WALLET", cu = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, Lt = (t) => new Promise((e) => setTimeout(e, cu() ? 15 : t));
function _3() {
  const t = (v) => document.getElementById(v), e = t("stage"), n = [...e.querySelectorAll(".lock")], r = t("action");
  let s = "sealed", i = "red", o = !1, c = !1;
  const a = $3({ isEnabled: () => o, reducedMotion: cu });
  function f(v, D) {
    e.dataset.light = v, e.dataset.pulse = D, v !== i && (i = v, a.lamp(v));
  }
  function u(v, D, B) {
    s = v, e.dataset.state = v;
    const [_, p, E, $] = M3[v];
    f(_, p), t("phase").textContent = E, t("caption").textContent = $, D && (t("statusText").textContent = D), B && (t("actionLabel").textContent = B);
  }
  function l(v, D, B, _, p) {
    t("headline").textContent = v, t("detail").textContent = D, t("meter").style.width = B + "%", _ && (e.dataset.mode = _), p !== void 0 && (t("idText").textContent = p);
  }
  function b(v) {
    r.disabled = v, e.setAttribute("aria-busy", String(v));
  }
  function h(v) {
    c = v, e.dataset.fault = v ? "1" : "0";
  }
  function x() {
    for (const v of n) v.classList.remove("released", "working");
  }
  function w() {
    x(), h(!1), l("Awaiting identity", "Present Audionaut credential", 0, "idle", "ID --"), u("sealed", "SEALED · AWAITING AUDIONAUT", w0);
  }
  function I() {
    x(), h(!1), l("Awaiting identity", "Approve the wallet prompt", 0, "idle", "ID --"), u("sealed", "WAITING FOR WALLET", w0), b(!0);
  }
  function N() {
    w(), b(!1);
  }
  function C(v = "No Audionaut in wallet") {
    x(), h(!1), l("Access denied", v, 100, "denied", "ID NONE"), u("denied", "ACCESS DENIED · NOTHING UNLOCKED", "CHECK AGAIN"), a.deny(), b(!1);
  }
  function g(v) {
    x(), h(!0), l("Signal lost", v, 100, "denied", "ID ERROR"), u("denied", "FAULT · READY TO RETRY", "TRY AGAIN"), a.deny(), b(!1);
  }
  async function A(v, D = {}) {
    var _;
    a.resume(), b(!0);
    let B;
    try {
      x(), h(!1);
      const p = Promise.race([
        v,
        new Promise(($) => {
          B = setTimeout(() => $({ kind: "fault", message: "The registry did not answer. Try again." }), B3);
        })
      ]).catch(($) => ({ kind: "fault", message: ($ == null ? void 0 : $.message) || "Something went wrong." }));
      u("scanning", "CHECKING FOR AUDIONAUTS · HOLD POSITION", "SCANNING"), l("Checking for Audionauts", "Contacting Xtrata registry", 18, "scan", "ID --"), a.clunk(0.12), a.scan(), a.beep(790, 0.07, 0.08), await Lt(460), l("Checking for Audionauts", "Matching wallet signature", 47), a.beep(860, 0.07, 0.08), await Lt(620), l("Checking for Audionauts", "Verifying on-chain profile", 74), a.beep(930, 0.07, 0.08), await Lt(680);
      const E = await p;
      if (E.kind === "denied")
        return C(E.reason), "denied";
      if (E.kind === "fault")
        return g(E.message), "fault";
      l("Audionaut found", "Clearance granted", 100, "found", "ID " + E.idText), u("granted", "AUDIONAUT VERIFIED · CLEARANCE GRANTED", "AUTHORISED"), a.clunk(0.25), a.success(), (_ = D.onGranted) == null || _.call(D, E), await Lt(900), u("unlocking", "RELEASING LOCKS · STAND CLEAR", "UNLOCKING"), l("Releasing locks", "Disengaging seal 0 / 4", 0, "found"), a.wheel();
      for (let $ = 0; $ < n.length; $++)
        n[$].classList.add("working"), await Lt(300), n[$].classList.remove("working"), n[$].classList.add("released"), a.clunk(0.35 + $ * 0.1), l("Releasing locks", `Disengaging seal ${$ + 1} / 4`, ($ + 1) * 25), await Lt(120);
      return a.hiss(), await Lt(420), l("Access granted", "Airlock unlocked · welcome aboard", 100, "found"), u("unlocked", "AUDIONAUT VERIFIED · AIRLOCK UNLOCKED", "ENTERING"), a.portal(), "unlocked";
    } catch (p) {
      return g((p == null ? void 0 : p.message) || "Unlock sequence interrupted."), "fault";
    } finally {
      clearTimeout(B), s !== "unlocked" && b(!1);
    }
  }
  async function y() {
    if (s === "sealed") {
      b(!1);
      return;
    }
    a.resume(), b(!0);
    try {
      if (s === "unlocked") {
        u("relocking", "ENGAGING LOCKS · SEALING", "SEALING"), l("Engaging locks", "Sealing chamber", 100, "scan");
        for (let v = n.length - 1; v >= 0; v--)
          n[v].classList.remove("released"), n[v].classList.add("working"), await Lt(170), n[v].classList.remove("working"), a.clunk(0.3), t("meter").style.width = v * 25 + "%";
        await Lt(200);
      }
      w();
    } finally {
      b(!1);
    }
  }
  return t("sound").addEventListener("click", () => {
    o = !o;
    const v = t("sound");
    v.setAttribute("aria-pressed", String(o)), v.setAttribute("aria-label", o ? "Disable sound effects" : "Enable sound effects"), t("soundLabel").textContent = o ? "SOUND ON" : "SOUND OFF", a.resume(), a.mute(!o), o && a.powerOn();
  }), {
    get state() {
      return s;
    },
    get fault() {
      return c;
    },
    setBusy: b,
    waitingForWallet: I,
    sealed: N,
    scan: A,
    relock: y,
    showDenied: C,
    showFault: g
  };
}
const Qs = (document.body.dataset.dawSrc || "").trim(), N3 = 60 * 1e3, C3 = 1300, qn = Z4({ appName: "Audionaut Sequencer", appIcon: location.origin + "/favicon.ico" }), Mt = _3(), it = (t) => document.getElementById(t);
let mt = !1, Yr, ws = !1;
const Pn = (t) => t.slice(0, 6) + "…" + t.slice(-5);
function D3(t, e, n) {
  if (e === void 0) return Pn(t);
  const r = `Xtrata ID #${e}`;
  return `${Pn(t)} · ${n ? `Audionaut #${n} · ${r}` : r}`;
}
let ko, ki = 0;
function H3() {
  ki++, ko = void 0;
  const t = it("granted-thumb");
  t.replaceChildren(), t.hidden = !0, it("granted-name").textContent = "";
}
async function U3(t, e) {
  var u;
  const n = ++ki;
  ko = t;
  const r = it("granted-who"), s = it("granted-thumb"), i = () => n === ki && ws, o = it("granted-name");
  r.textContent = Pn(t), o.textContent = "", s.replaceChildren(), s.hidden = !0;
  let c = await p3(t);
  if (!c && e !== void 0 && (c = { tokenId: e, edition: await su(e) }), !i() || !c || (r.textContent = D3(t, c.tokenId, c.edition), !c.edition)) return;
  o.textContent = ((u = ou(c.edition)) == null ? void 0 : u.name) ?? "", s.hidden = !1;
  const a = await L3(c.edition);
  if (!i()) return;
  if (!a) {
    s.hidden = !0;
    return;
  }
  const f = document.createElement("img");
  f.src = a.src, f.alt = "", f.draggable = !1, f.style.filter = a.filter, a.clipPath && (f.style.clipPath = a.clipPath), a.pixel && (f.style.imageRendering = "pixelated"), s.replaceChildren(f);
}
function O3(t, e) {
  var s;
  (s = document.getElementById("pro-export-current")) == null || s.remove(), ws = !0, ko !== t && U3(t, e);
  const n = it("daw"), r = it("daw-soon");
  it("state-granted").hidden = !1, Qs ? (n.getAttribute("src") !== Qs && n.setAttribute("src", Qs), n.hidden = !1, r.hidden = !0) : (n.hidden = !0, r.hidden = !1);
}
function au() {
  ws = !1;
  const t = it("daw");
  t.removeAttribute("src"), t.hidden = !0, it("state-granted").hidden = !0, H3();
}
async function Js(t) {
  const e = await fetch("/api/audionaut-beta-pro/session", { method: t ? "POST" : "GET", credentials: "same-origin", cache: "no-store", headers: t ? { "content-type": "application/json" } : {}, ...t ? { body: JSON.stringify(t) } : {} }), n = await e.json();
  if (!e.ok) throw new Error(n.error || "Xtrata sign-in is unavailable.");
  return n;
}
async function lu(t, e = !1) {
  try {
    let n = await Js();
    if (!n.signedIn || n.address !== t) {
      if (!e) return { kind: "fault", message: "Confirm Xtrata sign-in to open AudioNaut Pro. Choose Enter to sign a message; no transaction or spending permission is requested." };
      const { challenge: r } = await Js({ action: "challenge", address: t }), s = await o3({ ...t3(r), network: "mainnet", stxAddress: t, appDetails: { name: "Xtrata sign-in for AudioNaut Pro", icon: location.origin + "/favicon.ico" } });
      n = await Js({ action: "verify", id: r.id, signature: s });
    }
    return n.allowed ? { kind: "found", idText: "XTRATA #" + n.tokenId, tokenId: n.tokenId } : { kind: "denied", reason: n.error || "No Audionaut in wallet" };
  } catch (n) {
    return { kind: "fault", message: n.message || "Could not verify access." };
  }
}
function T3() {
  Yr || (Yr = setInterval(() => void k3(), N3));
}
function fu() {
  clearInterval(Yr), Yr = void 0;
}
async function Po(t, e = !1) {
  if (it("denied-who").textContent = Pn(t), await Mt.scan(lu(t, e), {
    onGranted: (r) => O3(t, r.tokenId)
  }) !== "unlocked") {
    ws || au();
    return;
  }
  Mt.setBusy(!0), await Lt(C3), document.body.dataset.view = "seq", T3();
}
async function k3() {
  var n, r;
  const t = qn.getSession();
  if (!t.isConnected || !t.address || mt || document.body.dataset.view !== "seq") return;
  const e = await lu(t.address);
  if (e.kind !== "found" && ((n = it("daw").contentWindow) == null || n.postMessage({ type: "audionaut-pro-access-expired" }, location.origin), fu(), document.body.dataset.view = "gate", it("denied-who").textContent = Pn(t.address), Mt.showFault(e.kind === "fault" ? e.message : "Audionaut access needs renewal. Your loaded project has been kept in memory."), !document.getElementById("pro-export-current"))) {
    const s = document.createElement("button");
    s.id = "pro-export-current", s.className = "action", s.textContent = "Download open project", s.addEventListener("click", () => {
      var i;
      return (i = it("daw").contentWindow) == null ? void 0 : i.postMessage({ type: "audionaut-pro-export-project" }, location.origin);
    }), (r = document.querySelector(".controls")) == null || r.append(s);
  }
}
async function Zr() {
  if (!mt) {
    mt = !0;
    try {
      Mt.waitingForWallet();
      const t = await qn.connect();
      if (!t.isConnected || !t.address) {
        Mt.sealed();
        return;
      }
      if (t.network && t.network !== "mainnet") {
        Mt.showFault("Switch your wallet to Stacks mainnet and try again.");
        return;
      }
      await Po(t.address, !0);
    } catch (t) {
      Mt.showFault(t.message || "Could not connect the wallet.");
    } finally {
      mt = !1;
    }
  }
}
async function P3() {
  const t = qn.getSession();
  if (!t.isConnected || !t.address) return Zr();
  if (!mt) {
    mt = !0;
    try {
      await Po(t.address, !0);
    } finally {
      mt = !1;
    }
  }
}
async function j3() {
  if (!mt) {
    mt = !0;
    try {
      try {
        await fetch("/api/audionaut-beta-pro/session", { method: "DELETE", credentials: "same-origin" }), await qn.disconnect();
      } catch {
      }
      fu(), document.body.dataset.view = "gate", it("denied-who").textContent = "", await Lt(500), au(), await Mt.relock();
    } finally {
      mt = !1;
    }
  }
}
it("action").addEventListener("click", () => {
  Mt.state === "sealed" ? Zr() : Mt.state === "denied" && (Mt.fault ? Zr() : P3());
});
it("switch").addEventListener("click", () => void Zr());
for (const t of ["leave", "leave-denied"]) it(t).addEventListener("click", () => void j3());
{
  const t = qn.getSession();
  t.isConnected && t.address && (!t.network || t.network === "mainnet") && (mt = !0, Po(t.address).finally(() => {
    mt = !1;
  }));
}
const F3 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", z3 = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, R3 = () => z3() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, G3 = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, K3 = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', uu = class {
  constructor(t) {
    Fw(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && Rl(t), this.callback(us(t));
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
    var r, s, i, o, c, a, f, u, l, b;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (o = (i = t.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (a = (c = t.mozillaAddOnsUrl) !== null && c !== void 0 ? c : this.getMobileUrl(t)) !== null && a !== void 0 ? a : t.webUrl : n === "Android" ? (u = (f = t.googlePlayStoreUrl) !== null && f !== void 0 ? f : this.getBrowserUrl(t)) !== null && u !== void 0 ? u : t.webUrl : (b = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && b !== void 0 ? b : this.getMobileUrl(t);
  }
  render() {
    const t = R3(), e = G3(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return P("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, P("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), P("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, P("div", { class: "flex flex-col space-y-[10px]" }, P("div", { class: "flex items-center" }, P("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), P("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, P("span", { class: "sr-only" }, "Close popup"), P("img", { src: F3 }))), r ? P("p", null, "Select the wallet you want to connect to.") : P("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && P("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && P("div", { class: "mt-6" }, P("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), P("ul", { class: "space-y-3" }, this.installedProviders.map((i) => P("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, P("div", { class: "aspect-square basis-9 overflow-hidden" }, P("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), P("div", { class: "flex-1" }, P("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && P("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), P("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && P("div", { class: "mt-6" }, r ? P("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : P("div", { class: "mb-5 flex justify-between" }, P("p", { class: "text-sm font-medium" }, "Recommended wallets"), P("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, P("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, P("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), P("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), P("p", null, "What is a wallet? ", P("span", { class: "align-text-bottom text-[9px]" }, "↗")))), P("ul", { class: "space-y-3" }, n.map((i) => P("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, P("div", { class: "aspect-square basis-9 overflow-hidden" }, P("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), P("div", { class: "flex-1" }, P("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && P("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && P("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return Aw(this);
  }
};
uu.style = K3;
const V3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: uu
}, Symbol.toStringTag, { value: "Module" }));
