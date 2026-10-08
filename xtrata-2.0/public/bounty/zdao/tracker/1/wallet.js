var ih = Object.defineProperty;
var oh = (t, e, n) => e in t ? ih(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Es = (t, e, n) => oh(t, typeof e != "symbol" ? e + "" : e, n);
const ch = ["SP", "SM"], ah = ["ST", "SN"], Mi = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return ch.includes(n) ? "mainnet" : ah.includes(n) ? "testnet" : null;
}, lh = () => {
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
}, fh = () => typeof window > "u" || !window.localStorage ? lh() : window.localStorage, Is = "xtrata.v15.1.wallet.session", Yo = "mainnet", vr = { isConnected: !1 }, uh = (t) => t.address ? Mi(t.address) ?? t.network : t.network, r0 = (t) => !t.isConnected || !t.address ? { ...vr } : uh(t) !== Yo ? { ...vr } : {
  isConnected: !0,
  address: t.address,
  network: Yo,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, hh = (t) => {
  if (!t)
    return { ...vr };
  try {
    const e = JSON.parse(t);
    return r0(e);
  } catch {
    return { ...vr };
  }
}, dh = (t) => {
  const e = r0(t);
  return JSON.stringify(e);
}, gh = (t) => {
  const e = fh();
  return {
    load: () => hh(e.getItem(Is)),
    save: (n) => {
      e.setItem(Is, dh(n));
    },
    clear: () => {
      e.removeItem(Is);
    }
  };
};
function bh(t) {
  return (t || "").replace(/0x[0-9a-fA-F]{6,}/g, "0x…").replace(/\bS[PT][0-9A-Z]{20,}\b/g, "<addr>").replace(/\b[0-9a-fA-F]{64}\b/g, "<hash>").replace(/\b\d[\d,]*(\.\d+)?\b/g, "<n>").replace(/\s+/g, " ").trim().slice(0, 200);
}
function ph(t, e, n, r) {
  const s = `${t}|${e ?? ""}|${n ?? ""}|${bh(r)}`;
  let i = 2166136261, o = 522970236;
  for (let a = 0; a < s.length; a += 1) {
    const f = s.charCodeAt(a);
    i = Math.imul(i ^ f, 16777619), o = Math.imul(o ^ (f << 5 | f >>> 3), 16777619);
  }
  const c = (a) => (a >>> 0).toString(16).padStart(8, "0");
  return (c(i) + c(o)).slice(0, 16);
}
function s0(t) {
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
function xh(t) {
  return t instanceof Error ? t.stack ?? void 0 : void 0;
}
const vs = (t) => {
  if (typeof t == "number" || typeof t == "boolean") return t;
  if (typeof t == "string" && t.length > 0) return t.slice(0, 300);
};
function wh(t) {
  if (!t || typeof t != "object") return;
  const e = t, n = {};
  for (const s of ["code", "stage", "method", "providerId", "name"]) {
    const i = vs(e[s]);
    i !== void 0 && (n[s] = i);
  }
  const r = e.data;
  if (r && typeof r == "object") {
    const s = {};
    for (const i of ["code", "message", "reason"]) {
      const o = vs(r[i]);
      o !== void 0 && (s[i] = o);
    }
    Object.keys(s).length > 0 && (n.data = s);
  } else {
    const s = vs(r);
    s !== void 0 && (n.data = s);
  }
  return Object.keys(n).length > 0 ? n : void 0;
}
function yh(t, e) {
  const n = (t == null ? void 0 : t.name) ?? "", r = t == null ? void 0 : t.code, s = s0(t).toLowerCase();
  return r === -32603 || s.trim() === "internal error." ? "WALLET_RPC_INTERNAL" : n === "ReadOnlyBackoffError" || s.includes("read-only") && s.includes("backoff") ? "READ_ONLY_BACKOFF" : typeof navigator < "u" && navigator.onLine === !1 ? "NETWORK_OFFLINE" : s.includes("user rejected") || s.includes("user denied") || s.includes("user canceled") || s.includes("user cancelled") || s.includes("rejected the request") || s.includes("request rejected") ? "WALLET_REJECTED" : s.includes("no wallet") || s.includes("provider not found") || s.includes("not installed") ? "WALLET_NOT_FOUND" : s.includes("locked") ? "WALLET_LOCKED" : s.includes("session") && s.includes("expire") ? "SESSION_EXPIRED" : s.includes("insufficient") && s.includes("fee") ? "INSUFFICIENT_FEE" : s.includes("insufficient") || s.includes("not enough") ? "INSUFFICIENT_FUNDS" : s.includes("nonce") ? "NONCE_MISMATCH" : s.includes("postcondition") || s.includes("post-condition") || s.includes("post condition") ? "POST_CONDITION_FAILED" : s.includes("abort") || s.includes("runtime error") ? "CONTRACT_ABORT" : s.includes("429") || s.includes("rate limit") || s.includes("too many requests") ? "HIRO_RATE_LIMIT" : s.includes("broadcast") ? "BROADCAST_FAILED" : s.includes("timeout") || s.includes("timed out") ? "CONFIRM_TIMEOUT" : s.includes("upload") ? "UPLOAD_FAILED" : "UNCAUGHT";
}
const mh = typeof __XTRATA_APP_VERSION__ < "u" ? __XTRATA_APP_VERSION__ : "dev", Sh = 20, Zo = "xt_tel_sid";
function Lr() {
  try {
    if (typeof crypto < "u" && typeof crypto.randomUUID == "function")
      return crypto.randomUUID();
  } catch {
  }
  return `xt-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}
let Ls = null;
function Ah() {
  try {
    if (typeof sessionStorage < "u") {
      let t = sessionStorage.getItem(Zo);
      return t || (t = Lr(), sessionStorage.setItem(Zo, t)), t;
    }
  } catch {
  }
  return Ls || (Ls = Lr()), Ls;
}
let Xe = {
  address: null,
  kind: null
}, i0 = null;
function Bi(t, e) {
  if (!t) {
    Xe = { address: null, kind: e ?? Xe.kind };
    return;
  }
  Xe = { address: t.trim(), kind: e ?? Xe.kind };
}
function _i(t) {
  i0 = typeof t == "string" && t.length > 0 ? t : null;
}
const Xo = [];
class Eh {
  constructor(e, n) {
    Es(this, "id", Lr());
    Es(this, "n", 0);
    this.flow = e, this.target = n;
  }
  attempt() {
    return this.n += 1, this.n;
  }
}
function Ih(t, e) {
  return new Eh(t, e);
}
function vn(t) {
  try {
    const e = t.journey, n = t.flow ?? (e == null ? void 0 : e.flow) ?? "app", r = t.outcome === "error", s = t.error != null ? s0(t.error) : void 0, i = t.error != null ? xh(t.error) : void 0, o = r ? ph(n, t.step, t.errorCode, s ?? "") : void 0, c = r ? wh(t.error) : void 0, a = {
      ...c ? { error: c } : {},
      ...t.context ?? {}
    };
    r && Xo.length && (a.breadcrumbs = Xo.slice(-Sh));
    const f = {
      eventId: Lr(),
      ts: Date.now(),
      sessionId: Ah(),
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
      appVersion: mh,
      route: t.route ?? (typeof location < "u" ? location.pathname : ""),
      walletAddress: Xe.address,
      walletKind: Xe.kind,
      network: i0,
      context: Object.keys(a).length ? a : void 0
    };
  } catch {
  }
}
const vh = "https://browser.blockstack.org/auth", Lh = {
  "@type": "Person",
  "@context": "http://schema.org"
}, o0 = ["store_write"], $h = "blockstack-session", Mh = {
  logLevel: "debug"
}, Oe = {
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
Object.freeze(Oe);
class gn extends Error {
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
class Bh extends gn {
  constructor(e, n = "") {
    super({ code: Oe.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Qo extends gn {
  constructor(e = "") {
    super({ code: Oe.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Xn extends gn {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Oe.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Jo extends gn {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Oe.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Gs extends gn {
  constructor(e) {
    super({ code: Oe.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class c0 extends gn {
  constructor(e) {
    super({ code: Oe.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const tc = ["debug", "info", "warn", "error", "none"], Rs = {};
for (let t = 0; t < tc.length; t++) {
  const e = tc[t];
  Rs[e] = t;
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
    return Rs[Mh.logLevel] <= Rs[e];
  }
}
function _h() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Dh() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function $s(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function Hh() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Nh() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Uh(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function Di(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Nh(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    Qe.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = Uh(s, t.toString(), n);
    throw Qe.error(i), new Error(i);
  }
  if (r)
    return {};
}
function Ch(t) {
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
  if (Fh(t, Uint8Array))
    return BigInt(`0x${xt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Oh(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Hi(t, e = 8) {
  return (typeof t == "bigint" ? t : Ch(t)).toString(16).padStart(e * 2, "0");
}
function a0(t, e = 16) {
  const n = Hi(t, e);
  return dt(n);
}
function Ph(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const kh = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function xt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += kh[n];
  return e;
}
function dt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Oh(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function Pn(t) {
  return new TextEncoder().encode(t);
}
function l0(t) {
  return new TextDecoder().decode(t);
}
function jh(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Th(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function ec(t) {
  if (t.some(Th))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Rt(...t) {
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
function bn(t) {
  return Rt(...t.map((e) => typeof e == "number" ? ec([e]) : e instanceof Array ? ec(e) : e));
}
function Fh(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const zh = "https://api.mainnet.hiro.so", Gh = "https://api.testnet.hiro.so", Rh = "http://localhost:3999", Kh = "https://hub.blockstack.org";
function Vh(t) {
  const e = typeof t == "string" ? dt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Rr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const Wh = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function qh(t, e) {
  const n = {};
  return Object.assign(n, Wh, e), await fetch(t, n);
}
function Yh(t) {
  let e = qh, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Zh(...t) {
  const { fetchLib: e, middlewares: n } = Yh(t);
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
class Kr {
  constructor(e = o0.slice(), n = ((c) => (c = Di("location", { returnEmptyObject: !0 })) == null ? void 0 : c.origin)(), r = "", s = "/manifest.json", i = void 0, o = vh) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Ks(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Xh(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function f0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Qh(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ks(t.outputLen), Ks(t.blockLen);
}
function Jh(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function td(t, e) {
  f0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Me = {
  number: Ks,
  bool: Xh,
  bytes: f0,
  hash: Qh,
  exists: Jh,
  output: td
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ms = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), It = (t, e) => t << 32 - e | t >>> e, ed = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!ed)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function nd(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Ni(t) {
  if (typeof t == "string" && (t = nd(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let u0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Pe(t) {
  const e = (r) => t().update(Ni(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let h0 = class extends u0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Me.hash(e);
    const r = Ni(n);
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
    return Me.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Me.exists(this), Me.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Vr = (t, e, n) => new h0(t, e).update(n).digest();
Vr.create = (t, e) => new h0(t, e);
function rd(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), a = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + a, o, r), t.setUint32(e + f, c, r);
}
let Ui = class extends u0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ms(this.buffer);
  }
  update(e) {
    Me.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Ni(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const a = Ms(e);
        for (; s <= i - o; o += s)
          this.process(a, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Me.exists(this), Me.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    rd(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = Ms(e), a = this.outputLen;
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
const sd = (t, e, n) => t & e ^ ~t & n, id = (t, e, n) => t & e ^ t & n ^ e & n, od = new Uint32Array([
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
]), Xt = new Uint32Array(64);
let d0 = class extends Ui {
  constructor() {
    super(64, 32, 8, !1), this.A = Zt[0] | 0, this.B = Zt[1] | 0, this.C = Zt[2] | 0, this.D = Zt[3] | 0, this.E = Zt[4] | 0, this.F = Zt[5] | 0, this.G = Zt[6] | 0, this.H = Zt[7] | 0;
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
      Xt[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Xt[l - 15], d = Xt[l - 2], p = It(g, 7) ^ It(g, 18) ^ g >>> 3, w = It(d, 17) ^ It(d, 19) ^ d >>> 10;
      Xt[l] = w + Xt[l - 7] + p + Xt[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: a, G: f, H: u } = this;
    for (let l = 0; l < 64; l++) {
      const g = It(c, 6) ^ It(c, 11) ^ It(c, 25), d = u + g + sd(c, a, f) + od[l] + Xt[l] | 0, w = (It(r, 2) ^ It(r, 13) ^ It(r, 22)) + id(r, s, i) | 0;
      u = f, f = a, a = c, c = o + d | 0, o = i, i = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, f = f + this.G | 0, u = u + this.H | 0, this.set(r, s, i, o, c, a, f, u);
  }
  roundClean() {
    Xt.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, cd = class extends d0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const rn = Pe(() => new d0());
Pe(() => new cd());
const ad = {}, g0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ad
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const K = BigInt(0), Q = BigInt(1), Se = BigInt(2), $n = BigInt(3), nc = BigInt(8), q = Object.freeze({
  a: K,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Q,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), rc = (t, e) => (t + e / Se) / e, Qn = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = q, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Q * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), c = rc(i * t, e), a = rc(-r * t, e);
    let f = B(t - c * n - a * s, e), u = B(-c * r - a * i, e);
    const l = f > o, g = u > o;
    if (l && (f = e - f), g && (u = e - u), f > o || u > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: f, k2neg: g, k2: u };
  }
}, Et = 32, _e = 32, b0 = 32, $r = Et + 1, Mr = 2 * Et + 1;
function sc(t) {
  const { a: e, b: n } = q, r = B(t * t), s = B(r * t);
  return B(s + e * t + n);
}
const Jn = q.a === K;
class Ci extends Error {
  constructor(e) {
    super(e);
  }
}
function ic(t) {
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
    return e.equals(V.ZERO) ? W.ZERO : new W(e.x, e.y, Q);
  }
  static toAffineBatch(e) {
    const n = dd(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return W.toAffineBatch(e).map(W.fromAffine);
  }
  equals(e) {
    ic(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: c } = e, a = B(s * s), f = B(c * c), u = B(n * f), l = B(i * a), g = B(B(r * c) * f), d = B(B(o * s) * a);
    return u === l && g === d;
  }
  negate() {
    return new W(this.x, B(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = B(e * e), i = B(n * n), o = B(i * i), c = e + i, a = B(Se * (B(c * c) - s - o)), f = B($n * s), u = B(f * f), l = B(u - Se * a), g = B(f * (a - l) - nc * o), d = B(Se * n * r);
    return new W(l, g, d);
  }
  add(e) {
    ic(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: c } = e;
    if (i === K || o === K)
      return this;
    if (n === K || r === K)
      return e;
    const a = B(s * s), f = B(c * c), u = B(n * f), l = B(i * a), g = B(B(r * c) * f), d = B(B(o * s) * a), p = B(l - u), w = B(d - g);
    if (p === K)
      return w === K ? this.double() : W.ZERO;
    const E = B(p * p), $ = B(p * E), M = B(u * E), x = B(w * w - $ - Se * M), L = B(w * (M - x) - g * $), S = B(s * c * p);
    return new W(x, L, S);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = W.ZERO;
    if (typeof e == "bigint" && e === K)
      return n;
    let r = ac(e);
    if (r === Q)
      return this;
    if (!Jn) {
      let l = n, g = this;
      for (; r > K; )
        r & Q && (l = l.add(g)), g = g.double(), r >>= Q;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: c } = Qn.splitScalar(r), a = n, f = n, u = this;
    for (; i > K || c > K; )
      i & Q && (a = a.add(u)), c & Q && (f = f.add(u)), u = u.double(), i >>= Q, c >>= Q;
    return s && (a = a.negate()), o && (f = f.negate()), f = new W(B(f.x * Qn.beta), f.y, f.z), a.add(f);
  }
  precomputeWindow(e) {
    const n = Jn ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(W.BASE) && (n = V.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Vs.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = W.normalizeZ(s), Vs.set(n, s)));
    let i = W.ZERO, o = W.BASE;
    const c = 1 + (Jn ? 128 / r : 256 / r), a = 2 ** (r - 1), f = BigInt(2 ** r - 1), u = 2 ** r, l = BigInt(r);
    for (let g = 0; g < c; g++) {
      const d = g * a;
      let p = Number(e & f);
      e >>= l, p > a && (p -= u, e += Q);
      const w = d, E = d + Math.abs(p) - 1, $ = g % 2 !== 0, M = p < 0;
      p === 0 ? o = o.add(tr($, s[w])) : i = i.add(tr(M, s[E]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = ac(e), s, i;
    if (Jn) {
      const { k1neg: o, k1: c, k2neg: a, k2: f } = Qn.splitScalar(r);
      let { p: u, f: l } = this.wNAF(c, n), { p: g, f: d } = this.wNAF(f, n);
      u = tr(o, u), g = tr(a, g), g = new W(B(g.x * Qn.beta), g.y, g.z), s = u.add(g), i = l.add(d);
    } else {
      const { p: o, f: c } = this.wNAF(r, n);
      s = o, i = c;
    }
    return W.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(W.ZERO);
    e == null && (e = i ? nc : pn(s));
    const o = e, c = B(o * o), a = B(c * o), f = B(n * c), u = B(r * a), l = B(s * o);
    if (i)
      return V.ZERO;
    if (l !== Q)
      throw new Error("invZ was invalid");
    return new V(f, u);
  }
}
W.BASE = new W(q.Gx, q.Gy, Q);
W.ZERO = new W(K, Q, K);
function tr(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Vs = /* @__PURE__ */ new WeakMap();
class V {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Vs.delete(this);
  }
  hasEvenY() {
    return this.y % Se === K;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = gt(n ? e : e.subarray(1));
    if (!mr(r))
      throw new Error("Point is not on curve");
    const s = sc(r);
    let i = hd(s);
    const o = (i & Q) === Q;
    n ? o && (i = B(-i)) : (e[0] & 1) === 1 !== o && (i = B(-i));
    const c = new V(r, i);
    return c.assertValidity(), c;
  }
  static fromUncompressedHex(e) {
    const n = gt(e.subarray(1, Et + 1)), r = gt(e.subarray(Et + 1, Et * 2 + 1)), s = new V(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Ht(e), r = n.length, s = n[0];
    if (r === Et)
      return this.fromCompressedHex(n);
    if (r === $r && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === Mr && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${$r} compressed bytes or ${Mr} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return V.BASE.multiply(De(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = w0(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Oi(Ht(e)), { n: c } = q, a = r === 2 || r === 3 ? s + c : s, f = pn(a, c), u = B(-o * f, c), l = B(i * f, c), g = r & 1 ? "03" : "02", d = V.fromHex(g + Ae(a)), p = V.BASE.multiplyAndAddUnsafe(d, u, l);
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
    if (!mr(n) || !mr(r))
      throw new Error(e);
    const s = B(r * r), i = sc(n);
    if (B(s - i) !== K)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new V(this.x, B(-this.y));
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
    const s = W.fromAffine(this), i = n === K || n === Q || this !== V.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = W.fromAffine(e).multiplyUnsafe(r), c = i.add(o);
    return c.equals(W.ZERO) ? void 0 : c.toAffine();
  }
}
V.BASE = new V(q.Gx, q.Gy);
V.ZERO = new V(K, K);
function oc(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function cc(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${sn(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: gt(n), left: t.subarray(e + 2) };
}
function ld(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${sn(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = cc(t.subarray(2)), { data: r, left: s } = cc(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${sn(s)}`);
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
    const s = n ? sn(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Gt(Br(s.slice(0, 64)), Br(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = ld(n ? e : Ee(e));
    return new Gt(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!cn(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!cn(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = q.n >> Q;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Gt(this.r, B(-this.s, q.n)) : this;
  }
  toDERRawBytes() {
    return Ee(this.toDERHex());
  }
  toDERHex() {
    const e = oc(In(this.s)), n = oc(In(this.r)), r = e.length / 2, s = n.length / 2, i = In(r), o = In(s);
    return `30${In(s + r + 4)}02${o}${n}02${i}${e}`;
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
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
const fd = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function sn(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += fd[t[n]];
  return e;
}
const ud = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Ae(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(K <= t && t < ud))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function on(t) {
  const e = Ee(Ae(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function In(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Br(t) {
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
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function gt(t) {
  return Br(sn(t));
}
function Ht(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Ee(t);
}
function ac(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && cn(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function B(t, e = q.P) {
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
function hd(t) {
  const { P: e } = q, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), c = BigInt(88), a = t * t * t % e, f = a * a * t % e, u = bt(f, $n) * f % e, l = bt(u, $n) * f % e, g = bt(l, Se) * a % e, d = bt(g, r) * g % e, p = bt(d, s) * d % e, w = bt(p, o) * p % e, E = bt(w, c) * w % e, $ = bt(E, o) * p % e, M = bt($, $n) * f % e, x = bt(M, i) * d % e, L = bt(x, n) * a % e, S = bt(L, Se);
  if (S * S % e !== t)
    throw new Error("Cannot find square root");
  return S;
}
function pn(t, e = q.P) {
  if (t === K || e <= K)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = B(t, e), r = e, s = K, i = Q;
  for (; n !== K; ) {
    const c = r / n, a = r % n, f = s - i * c;
    r = n, n = a, s = i, i = f;
  }
  if (r !== Q)
    throw new Error("invert: does not exist");
  return B(s, e);
}
function dd(t, e = q.P) {
  const n = new Array(t.length), r = t.reduce((i, o, c) => o === K ? i : (n[c] = i, B(i * o, e)), Q), s = pn(r, e);
  return t.reduceRight((i, o, c) => o === K ? i : (n[c] = B(i * n[c], e), B(i * o, e)), s), n;
}
function gd(t) {
  const e = t.length * 8 - _e * 8, n = gt(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Oi(t, e = !1) {
  const n = gd(t);
  if (e)
    return n;
  const { n: r } = q;
  return n >= r ? n - r : n;
}
let tn, Mn;
class p0 {
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
    return Mn(this.k, ...e);
  }
  checkSync() {
    if (typeof Mn != "function")
      throw new Ci("hmacSha256Sync needs to be set");
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
function cn(t) {
  return K < t && t < q.n;
}
function mr(t) {
  return K < t && t < q.P;
}
function x0(t, e, n, r = !0) {
  const { n: s } = q, i = Oi(t, !0);
  if (!cn(i))
    return;
  const o = pn(i, s), c = V.BASE.multiply(i), a = B(c.x, s);
  if (a === K)
    return;
  const f = B(o * B(e + n * a, s), s);
  if (f === K)
    return;
  let u = new Gt(a, f), l = (c.x === u.r ? 0 : 2) | Number(c.y & Q);
  return r && u.hasHighS() && (u = u.normalizeS(), l ^= 1), { sig: u, recovery: l };
}
function De(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * _e)
      throw new Error("Expected 32 bytes of private key");
    e = Br(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== _e)
      throw new Error("Expected 32 bytes of private key");
    e = gt(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!cn(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Pi(t) {
  return t instanceof V ? (t.assertValidity(), t) : V.fromHex(t);
}
function w0(t) {
  if (t instanceof Gt)
    return t.assertValidity(), t;
  try {
    return Gt.fromDER(t);
  } catch {
    return Gt.fromCompact(t);
  }
}
function ki(t, e = !1) {
  return V.fromPrivateKey(t).toRawBytes(e);
}
function bd(t, e, n, r = !1) {
  return V.fromSignature(t, e, n).toRawBytes(r);
}
function lc(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === $r || r === Mr : n ? r === $r * 2 || r === Mr * 2 : t instanceof V;
}
function ji(t, e, n = !1) {
  if (lc(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!lc(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Pi(e);
  return r.assertValidity(), r.multiply(De(t)).toRawBytes(n);
}
function y0(t) {
  const e = t.length > Et ? t.slice(0, Et) : t;
  return gt(e);
}
function pd(t) {
  const e = y0(t), n = B(e, q.n);
  return m0(n < K ? e : n);
}
function m0(t) {
  return on(t);
}
function S0(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Ht(t), s = De(e), i = [m0(s), pd(r)];
  if (n != null) {
    n === !0 && (n = tt.randomBytes(Et));
    const a = Ht(n);
    if (a.length !== Et)
      throw new Error(`sign: Expected ${Et} bytes of extra data`);
    i.push(a);
  }
  const o = me(...i), c = y0(r);
  return { seed: o, m: c, d: s };
}
function A0(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function xd(t, e, n = {}) {
  const { seed: r, m: s, d: i } = S0(t, e, n.extraEntropy), o = new p0(b0, _e);
  await o.reseed(r);
  let c;
  for (; !(c = x0(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return A0(c, n);
}
function E0(t, e, n = {}) {
  const { seed: r, m: s, d: i } = S0(t, e, n.extraEntropy), o = new p0(b0, _e);
  o.reseedSync(r);
  let c;
  for (; !(c = x0(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return A0(c, n);
}
const wd = { strict: !0 };
function yd(t, e, n, r = wd) {
  let s;
  try {
    s = w0(t), e = Ht(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const c = Oi(e);
  let a;
  try {
    a = Pi(n);
  } catch {
    return !1;
  }
  const { n: f } = q, u = pn(o, f), l = B(c * u, f), g = B(i * u, f), d = V.BASE.multiplyAndAddUnsafe(a, l, g);
  return d ? B(d.x, f) === i : !1;
}
function _r(t) {
  return B(gt(t), q.n);
}
class an {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Ht(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = gt(n.subarray(0, 32)), s = gt(n.subarray(32, 64));
    return new an(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!mr(e) || !cn(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Ae(this.r) + Ae(this.s);
  }
  toRawBytes() {
    return Ee(this.toHex());
  }
}
function md(t) {
  return V.fromPrivateKey(t).toRawX();
}
class I0 {
  constructor(e, n, r = tt.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Ht(e);
    const { x: s, scalar: i } = this.getScalar(De(n));
    if (this.px = s, this.d = i, this.rand = Ht(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = V.fromPrivateKey(e), r = n.hasEvenY() ? e : q.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return on(e ^ gt(n));
  }
  finalizeNonce(e) {
    const n = B(gt(e), q.n);
    if (n === K)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new an(e.x, B(n + r * s, q.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = tt.taggedHash, o = this.initNonce(n, await i(ye.aux, s)), { R: c, rx: a, k: f } = this.finalizeNonce(await i(ye.nonce, o, r, e)), u = _r(await i(ye.challenge, a, r, e)), l = this.finalizeSig(c, f, u, n);
    return await $0(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = tt.taggedHashSync, o = this.initNonce(n, i(ye.aux, s)), { R: c, rx: a, k: f } = this.finalizeNonce(i(ye.nonce, o, r, e)), u = _r(i(ye.challenge, a, r, e)), l = this.finalizeSig(c, f, u, n);
    return M0(l, e, r) || this.error(), l;
  }
}
async function Sd(t, e, n) {
  return new I0(t, e, n).calc();
}
function Ad(t, e, n) {
  return new I0(t, e, n).calcSync();
}
function v0(t, e, n) {
  const r = t instanceof an, s = r ? t : an.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Ht(e),
    P: Pi(n)
  };
}
function L0(t, e, n, r) {
  const s = V.BASE.multiplyAndAddUnsafe(e, De(n), B(-r, q.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function $0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = v0(t, e, n), c = _r(await tt.taggedHash(ye.challenge, on(r), o.toRawX(), i));
    return L0(r, o, s, c);
  } catch {
    return !1;
  }
}
function M0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = v0(t, e, n), c = _r(tt.taggedHashSync(ye.challenge, on(r), o.toRawX(), i));
    return L0(r, o, s, c);
  } catch (r) {
    if (r instanceof Ci)
      throw r;
    return !1;
  }
}
const Ed = {
  Signature: an,
  getPublicKey: md,
  sign: Sd,
  verify: $0,
  signSync: Ad,
  verifySync: M0
};
V.BASE._setWindowSize(8);
const ut = {
  node: g0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, ye = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, er = {}, tt = {
  bytesToHex: sn,
  hexToBytes: Ee,
  concatBytes: me,
  mod: B,
  invert: pn,
  isValidPrivateKey(t) {
    try {
      return De(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: on,
  _normalizePrivateKey: De,
  hashToPrivateKey: (t) => {
    t = Ht(t);
    const e = _e + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = B(gt(t), q.n - Q) + Q;
    return on(n);
  },
  randomBytes: (t = 32) => {
    if (ut.web)
      return ut.web.getRandomValues(new Uint8Array(t));
    if (ut.node) {
      const { randomBytes: e } = ut.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => tt.hashToPrivateKey(tt.randomBytes(_e + 8)),
  precompute(t = 8, e = V.BASE) {
    const n = e === V.BASE ? e : new V(e.x, e.y);
    return n._setWindowSize(t), n.multiply($n), n;
  },
  sha256: async (...t) => {
    if (ut.web) {
      const e = await ut.web.subtle.digest("SHA-256", me(...t));
      return new Uint8Array(e);
    } else if (ut.node) {
      const { createHash: e } = ut.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (ut.web) {
      const n = await ut.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = me(...e), s = await ut.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (ut.node) {
      const { createHmac: n } = ut.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = er[t];
    if (n === void 0) {
      const r = await tt.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = me(r, r), er[t] = n;
    }
    return tt.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof tn != "function")
      throw new Ci("sha256Sync is undefined, you need to set it");
    let n = er[t];
    if (n === void 0) {
      const r = tn(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = me(r, r), er[t] = n;
    }
    return tn(n, ...e);
  },
  _JacobianPoint: W
};
Object.defineProperties(tt, {
  sha256Sync: {
    configurable: !1,
    get() {
      return tn;
    },
    set(t) {
      tn || (tn = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Mn;
    },
    set(t) {
      Mn || (Mn = t);
    }
  }
});
const Id = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: q,
  Point: V,
  Signature: Gt,
  getPublicKey: ki,
  getSharedSecret: ji,
  recoverPublicKey: bd,
  schnorr: Ed,
  sign: xd,
  signSync: E0,
  utils: tt,
  verify: yd
}, Symbol.toStringTag, { value: "Module" }));
var at = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function vd(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Wr(t) {
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
var kn = {};
kn.byteLength = _d;
var Ld = kn.toByteArray = Hd, $d = kn.fromByteArray = Cd, Bt = [], pt = [], Md = typeof Uint8Array < "u" ? Uint8Array : Array, Bs = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var qe = 0, Bd = Bs.length; qe < Bd; ++qe)
  Bt[qe] = Bs[qe], pt[Bs.charCodeAt(qe)] = qe;
pt[45] = 62;
pt[95] = 63;
function B0(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function _d(t) {
  var e = B0(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Dd(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Hd(t) {
  var e, n = B0(t), r = n[0], s = n[1], i = new Md(Dd(t, r, s)), o = 0, c = s > 0 ? r - 4 : r, a;
  for (a = 0; a < c; a += 4)
    e = pt[t.charCodeAt(a)] << 18 | pt[t.charCodeAt(a + 1)] << 12 | pt[t.charCodeAt(a + 2)] << 6 | pt[t.charCodeAt(a + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = pt[t.charCodeAt(a)] << 2 | pt[t.charCodeAt(a + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = pt[t.charCodeAt(a)] << 10 | pt[t.charCodeAt(a + 1)] << 4 | pt[t.charCodeAt(a + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function Nd(t) {
  return Bt[t >> 18 & 63] + Bt[t >> 12 & 63] + Bt[t >> 6 & 63] + Bt[t & 63];
}
function Ud(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(Nd(r));
  return s.join("");
}
function Cd(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, c = n - r; o < c; o += i)
    s.push(Ud(t, o, o + i > c ? c : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    Bt[e >> 2] + Bt[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    Bt[e >> 10] + Bt[e >> 4 & 63] + Bt[e << 2 & 63] + "="
  )), s.join("");
}
function Od() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const Pd = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function kd() {
  if (Od())
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
    throw new Error(Pd);
  }
}
class jd {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(Rt(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(Rt(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class Td {
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
async function _0() {
  const t = await kd();
  return t.name === "subtleCrypto" ? new Td(t.lib) : new jd(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function Fd(t) {
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
  function u(d) {
    if (d instanceof Uint8Array || (ArrayBuffer.isView(d) ? d = new Uint8Array(d.buffer, d.byteOffset, d.byteLength) : Array.isArray(d) && (d = Uint8Array.from(d))), !(d instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (d.length === 0)
      return "";
    for (var p = 0, w = 0, E = 0, $ = d.length; E !== $ && d[E] === 0; )
      E++, p++;
    for (var M = ($ - E) * f + 1 >>> 0, x = new Uint8Array(M); E !== $; ) {
      for (var L = d[E], S = 0, N = M - 1; (L !== 0 || S < w) && N !== -1; N--, S++)
        L += 256 * x[N] >>> 0, x[N] = L % o >>> 0, L = L / o >>> 0;
      if (L !== 0)
        throw new Error("Non-zero carry");
      w = S, E++;
    }
    for (var P = M - w; P !== M && x[P] === 0; )
      P++;
    for (var D = c.repeat(p); P < M; ++P)
      D += t.charAt(x[P]);
    return D;
  }
  function l(d) {
    if (typeof d != "string")
      throw new TypeError("Expected String");
    if (d.length === 0)
      return new Uint8Array();
    for (var p = 0, w = 0, E = 0; d[p] === c; )
      w++, p++;
    for (var $ = (d.length - p) * a + 1 >>> 0, M = new Uint8Array($); d[p]; ) {
      var x = d.charCodeAt(p);
      if (x > 255)
        return;
      var L = e[x];
      if (L === 255)
        return;
      for (var S = 0, N = $ - 1; (L !== 0 || S < E) && N !== -1; N--, S++)
        L += o * M[N] >>> 0, M[N] = L % 256 >>> 0, L = L / 256 >>> 0;
      if (L !== 0)
        throw new Error("Non-zero carry");
      E = S, p++;
    }
    for (var P = $ - E; P !== $ && M[P] === 0; )
      P++;
    for (var D = new Uint8Array(w + ($ - P)), H = w; P !== $; )
      D[H++] = M[P++];
    return D;
  }
  function g(d) {
    var p = l(d);
    if (p)
      return p;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: u,
    decodeUnsafe: l,
    decode: g
  };
}
var D0 = Fd;
const zd = D0, Gd = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Rd = zd(Gd);
const Kd = /* @__PURE__ */ vd(Rd), Vd = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), H0 = Uint8Array.from({ length: 16 }, (t, e) => e), Wd = H0.map((t) => (9 * t + 5) % 16);
let Ti = [H0], Fi = [Wd];
for (let t = 0; t < 4; t++)
  for (let e of [Ti, Fi])
    e.push(e[t].map((n) => Vd[n]));
const N0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), qd = Ti.map((t, e) => t.map((n) => N0[e][n])), Yd = Fi.map((t, e) => t.map((n) => N0[e][n])), Zd = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Xd = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), nr = (t, e) => t << e | t >>> 32 - e;
function fc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const rr = new Uint32Array(16);
let Qd = class extends Ui {
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
    for (let d = 0; d < 16; d++, n += 4)
      rr[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, a = c, f = this.h3 | 0, u = f, l = this.h4 | 0, g = l;
    for (let d = 0; d < 5; d++) {
      const p = 4 - d, w = Zd[d], E = Xd[d], $ = Ti[d], M = Fi[d], x = qd[d], L = Yd[d];
      for (let S = 0; S < 16; S++) {
        const N = nr(r + fc(d, i, c, f) + rr[$[S]] + w, x[S]) + l | 0;
        r = l, l = f, f = nr(c, 10) | 0, c = i, i = N;
      }
      for (let S = 0; S < 16; S++) {
        const N = nr(s + fc(p, o, a, u) + rr[M[S]] + E, L[S]) + g | 0;
        s = g, g = u, u = nr(a, 10) | 0, a = o, o = N;
      }
    }
    this.set(this.h1 + c + u | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + a | 0);
  }
  roundClean() {
    rr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Jd = Pe(() => new Qd());
function t1(t) {
  return Jd(t);
}
const sr = BigInt(2 ** 32 - 1), Ws = BigInt(32);
function U0(t, e = !1) {
  return e ? { h: Number(t & sr), l: Number(t >> Ws & sr) } : { h: Number(t >> Ws & sr) | 0, l: Number(t & sr) | 0 };
}
function e1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = U0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const n1 = (t, e) => BigInt(t >>> 0) << Ws | BigInt(e >>> 0), r1 = (t, e, n) => t >>> n, s1 = (t, e, n) => t << 32 - n | e >>> n, i1 = (t, e, n) => t >>> n | e << 32 - n, o1 = (t, e, n) => t << 32 - n | e >>> n, c1 = (t, e, n) => t << 64 - n | e >>> n - 32, a1 = (t, e, n) => t >>> n - 32 | e << 64 - n, l1 = (t, e) => e, f1 = (t, e) => t, u1 = (t, e, n) => t << n | e >>> 32 - n, h1 = (t, e, n) => e << n | t >>> 32 - n, d1 = (t, e, n) => e << n - 32 | t >>> 64 - n, g1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function b1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const p1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), x1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, w1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), y1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, m1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), S1 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, j = {
  fromBig: U0,
  split: e1,
  toBig: n1,
  shrSH: r1,
  shrSL: s1,
  rotrSH: i1,
  rotrSL: o1,
  rotrBH: c1,
  rotrBL: a1,
  rotr32H: l1,
  rotr32L: f1,
  rotlSH: u1,
  rotlSL: h1,
  rotlBH: d1,
  rotlBL: g1,
  add: b1,
  add3L: p1,
  add3H: x1,
  add4L: w1,
  add4H: y1,
  add5H: S1,
  add5L: m1
}, [A1, E1] = j.split([
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
].map((t) => BigInt(t))), Qt = new Uint32Array(80), Jt = new Uint32Array(80);
let qr = class extends Ui {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: a, Eh: f, El: u, Fh: l, Fl: g, Gh: d, Gl: p, Hh: w, Hl: E } = this;
    return [e, n, r, s, i, o, c, a, f, u, l, g, d, p, w, E];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, a, f, u, l, g, d, p, w, E) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = a | 0, this.Eh = f | 0, this.El = u | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = d | 0, this.Gl = p | 0, this.Hh = w | 0, this.Hl = E | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      Qt[x] = e.getUint32(n), Jt[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const L = Qt[x - 15] | 0, S = Jt[x - 15] | 0, N = j.rotrSH(L, S, 1) ^ j.rotrSH(L, S, 8) ^ j.shrSH(L, S, 7), P = j.rotrSL(L, S, 1) ^ j.rotrSL(L, S, 8) ^ j.shrSL(L, S, 7), D = Qt[x - 2] | 0, H = Jt[x - 2] | 0, b = j.rotrSH(D, H, 19) ^ j.rotrBH(D, H, 61) ^ j.shrSH(D, H, 6), A = j.rotrSL(D, H, 19) ^ j.rotrBL(D, H, 61) ^ j.shrSL(D, H, 6), _ = j.add4L(P, A, Jt[x - 7], Jt[x - 16]), O = j.add4H(_, N, b, Qt[x - 7], Qt[x - 16]);
      Qt[x] = O | 0, Jt[x] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: a, Dh: f, Dl: u, Eh: l, El: g, Fh: d, Fl: p, Gh: w, Gl: E, Hh: $, Hl: M } = this;
    for (let x = 0; x < 80; x++) {
      const L = j.rotrSH(l, g, 14) ^ j.rotrSH(l, g, 18) ^ j.rotrBH(l, g, 41), S = j.rotrSL(l, g, 14) ^ j.rotrSL(l, g, 18) ^ j.rotrBL(l, g, 41), N = l & d ^ ~l & w, P = g & p ^ ~g & E, D = j.add5L(M, S, P, E1[x], Jt[x]), H = j.add5H(D, $, L, N, A1[x], Qt[x]), b = D | 0, A = j.rotrSH(r, s, 28) ^ j.rotrBH(r, s, 34) ^ j.rotrBH(r, s, 39), _ = j.rotrSL(r, s, 28) ^ j.rotrBL(r, s, 34) ^ j.rotrBL(r, s, 39), O = r & i ^ r & c ^ i & c, R = s & o ^ s & a ^ o & a;
      $ = w | 0, M = E | 0, w = d | 0, E = p | 0, d = l | 0, p = g | 0, { h: l, l: g } = j.add(f | 0, u | 0, H | 0, b | 0), f = c | 0, u = a | 0, c = i | 0, a = o | 0, i = r | 0, o = s | 0;
      const C = j.add3L(b, _, R);
      r = j.add3H(C, H, A, O), s = C | 0;
    }
    ({ h: r, l: s } = j.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = j.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l: a } = j.add(this.Ch | 0, this.Cl | 0, c | 0, a | 0), { h: f, l: u } = j.add(this.Dh | 0, this.Dl | 0, f | 0, u | 0), { h: l, l: g } = j.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: d, l: p } = j.add(this.Fh | 0, this.Fl | 0, d | 0, p | 0), { h: w, l: E } = j.add(this.Gh | 0, this.Gl | 0, w | 0, E | 0), { h: $, l: M } = j.add(this.Hh | 0, this.Hl | 0, $ | 0, M | 0), this.set(r, s, i, o, c, a, f, u, l, g, d, p, w, E, $, M);
  }
  roundClean() {
    Qt.fill(0), Jt.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, I1 = class extends qr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, v1 = class extends qr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, L1 = class extends qr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const $1 = Pe(() => new qr());
Pe(() => new I1());
Pe(() => new v1());
Pe(() => new L1());
function C0(t) {
  return rn(t);
}
function M1(t) {
  return $1(t);
}
const B1 = 0;
tt.hmacSha256Sync = (t, ...e) => {
  const n = Vr.create(rn, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function _1() {
  return xt(tt.randomPrivateKey());
}
function D1(t) {
  const e = rn(rn(t));
  return Kd.encode(Rt(t, e).slice(0, t.length + 4));
}
function H1(t, e) {
  return D1(Rt(new Uint8Array([t]), e.slice(0, 20)));
}
function O0(t, e = B1) {
  const n = typeof t == "string" ? dt(t) : t, r = t1(C0(n));
  return H1(e, r);
}
function P0(t) {
  const e = Vh(t);
  return xt(ki(e.slice(0, 32), !0));
}
tt.hmacSha256Sync = (t, ...e) => {
  const n = Vr.create(rn, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Dr;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Dr || (Dr = {}));
async function N1(t, e, n) {
  return await (await _0()).encrypt("aes-256-cbc", e, t, n);
}
async function U1(t, e, n) {
  return await (await _0()).decrypt("aes-256-cbc", e, t, n);
}
function k0(t, e) {
  return Vr(rn, t, e);
}
function C1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function j0(t) {
  const e = M1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function O1(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function P1(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Dr.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Dr.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !O1(t))
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
async function k1(t, e, n, r) {
  const s = P1(t);
  if (!s.result)
    throw s;
  const i = tt.randomPrivateKey(), o = ki(i, !0);
  let c = ji(i, t, !0);
  c = c.slice(1);
  const a = j0(c), f = tt.randomBytes(16), u = await N1(f, a.encryptionKey, e), l = Rt(f, o, u), g = k0(a.hmacKey, l);
  let d;
  if (!r || r === "hex")
    d = xt(u);
  else if (r === "base64")
    d = $d(u);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const p = {
    iv: xt(f),
    ephemeralPK: xt(o),
    cipherText: d,
    mac: xt(g),
    wasString: n
  };
  return r && r !== "hex" && (p.cipherTextEncoding = r), p;
}
async function T0(t, e) {
  if (!e.ephemeralPK)
    throw new Jo("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = ji(t, n, !0);
  r = r.slice(1);
  const s = j0(r), i = dt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = dt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = Ld(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const c = Rt(i, dt(n), o), a = k0(s.hmacKey, c), f = dt(e.mac);
  if (!C1(f, a))
    throw new Jo("Decryption failed: failure in MAC check");
  const u = await U1(i, s.encryptionKey, o);
  return e.wasString ? l0(u) : u;
}
function j1(t, e) {
  const n = typeof e == "string" ? Pn(e) : e, r = P0(t), s = C0(n), i = E0(s, t);
  return {
    signature: xt(i),
    publicKey: r
  };
}
async function T1(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = P0(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? Pn(t) : t, o = await k1(n.publicKey, i, s, n.cipherTextEncoding);
  let c = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const a = j1(r, c), f = {
      signature: a.signature,
      publicKey: a.publicKey,
      cipherText: c
    };
    c = JSON.stringify(f);
  }
  return c;
}
function F1(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return T0(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var ot = {}, ln = {}, ct = {};
Object.defineProperty(ct, "__esModule", { value: !0 });
ct.decode = ct.encode = ct.unescape = ct.escape = ct.pad = void 0;
const F0 = kn;
function zi(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
ct.pad = zi;
function z0(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
ct.escape = z0;
function G0(t) {
  return zi(t).replace(/-/g, "+").replace(/_/g, "/");
}
ct.unescape = G0;
function z1(t) {
  return z0((0, F0.fromByteArray)(new TextEncoder().encode(t)));
}
ct.encode = z1;
function G1(t) {
  return new TextDecoder().decode((0, F0.toByteArray)(zi(G0(t))));
}
ct.decode = G1;
var Yr = {}, Zr = {}, R0 = {}, K0 = {}, Xr = {};
Object.defineProperty(Xr, "__esModule", { value: !0 });
Xr.crypto = void 0;
Xr.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = c, t.u8 = a, t.u32 = f, t.clean = u, t.createView = l, t.rotr = g, t.rotl = d, t.byteSwap = p, t.byteSwap32 = w, t.bytesToHex = M, t.hexToBytes = S, t.asyncLoop = P, t.utf8ToBytes = D, t.bytesToUtf8 = H, t.toBytes = b, t.kdfInputToBytes = A, t.concatBytes = _, t.checkOpts = O, t.createHasher = C, t.createOptHasher = Pt, t.createXOFer = qt, t.randomBytes = Ge;
  const e = Xr;
  function n(m) {
    return m instanceof Uint8Array || ArrayBuffer.isView(m) && m.constructor.name === "Uint8Array";
  }
  function r(m) {
    if (!Number.isSafeInteger(m) || m < 0)
      throw new Error("positive integer expected, got " + m);
  }
  function s(m, ...v) {
    if (!n(m))
      throw new Error("Uint8Array expected");
    if (v.length > 0 && !v.includes(m.length))
      throw new Error("Uint8Array expected of length " + v + ", got length=" + m.length);
  }
  function i(m) {
    if (typeof m != "function" || typeof m.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(m.outputLen), r(m.blockLen);
  }
  function o(m, v = !0) {
    if (m.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (v && m.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function c(m, v) {
    s(m);
    const Z = v.outputLen;
    if (m.length < Z)
      throw new Error("digestInto() expects output buffer of length at least " + Z);
  }
  function a(m) {
    return new Uint8Array(m.buffer, m.byteOffset, m.byteLength);
  }
  function f(m) {
    return new Uint32Array(m.buffer, m.byteOffset, Math.floor(m.byteLength / 4));
  }
  function u(...m) {
    for (let v = 0; v < m.length; v++)
      m[v].fill(0);
  }
  function l(m) {
    return new DataView(m.buffer, m.byteOffset, m.byteLength);
  }
  function g(m, v) {
    return m << 32 - v | m >>> v;
  }
  function d(m, v) {
    return m << v | m >>> 32 - v >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function p(m) {
    return m << 24 & 4278190080 | m << 8 & 16711680 | m >>> 8 & 65280 | m >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (m) => m : (m) => p(m), t.byteSwapIfBE = t.swap8IfBE;
  function w(m) {
    for (let v = 0; v < m.length; v++)
      m[v] = p(m[v]);
    return m;
  }
  t.swap32IfBE = t.isLE ? (m) => m : w;
  const E = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", $ = /* @__PURE__ */ Array.from({ length: 256 }, (m, v) => v.toString(16).padStart(2, "0"));
  function M(m) {
    if (s(m), E)
      return m.toHex();
    let v = "";
    for (let Z = 0; Z < m.length; Z++)
      v += $[m[Z]];
    return v;
  }
  const x = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function L(m) {
    if (m >= x._0 && m <= x._9)
      return m - x._0;
    if (m >= x.A && m <= x.F)
      return m - (x.A - 10);
    if (m >= x.a && m <= x.f)
      return m - (x.a - 10);
  }
  function S(m) {
    if (typeof m != "string")
      throw new Error("hex string expected, got " + typeof m);
    if (E)
      return Uint8Array.fromHex(m);
    const v = m.length, Z = v / 2;
    if (v % 2)
      throw new Error("hex string expected, got unpadded hex of length " + v);
    const X = new Uint8Array(Z);
    for (let Y = 0, st = 0; Y < Z; Y++, st += 2) {
      const Sn = L(m.charCodeAt(st)), Rn = L(m.charCodeAt(st + 1));
      if (Sn === void 0 || Rn === void 0) {
        const us = m[st] + m[st + 1];
        throw new Error('hex string expected, got non-hex character "' + us + '" at index ' + st);
      }
      X[Y] = Sn * 16 + Rn;
    }
    return X;
  }
  const N = async () => {
  };
  t.nextTick = N;
  async function P(m, v, Z) {
    let X = Date.now();
    for (let Y = 0; Y < m; Y++) {
      Z(Y);
      const st = Date.now() - X;
      st >= 0 && st < v || (await (0, t.nextTick)(), X += st);
    }
  }
  function D(m) {
    if (typeof m != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(m));
  }
  function H(m) {
    return new TextDecoder().decode(m);
  }
  function b(m) {
    return typeof m == "string" && (m = D(m)), s(m), m;
  }
  function A(m) {
    return typeof m == "string" && (m = D(m)), s(m), m;
  }
  function _(...m) {
    let v = 0;
    for (let X = 0; X < m.length; X++) {
      const Y = m[X];
      s(Y), v += Y.length;
    }
    const Z = new Uint8Array(v);
    for (let X = 0, Y = 0; X < m.length; X++) {
      const st = m[X];
      Z.set(st, Y), Y += st.length;
    }
    return Z;
  }
  function O(m, v) {
    if (v !== void 0 && {}.toString.call(v) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(m, v);
  }
  class R {
  }
  t.Hash = R;
  function C(m) {
    const v = (X) => m().update(b(X)).digest(), Z = m();
    return v.outputLen = Z.outputLen, v.blockLen = Z.blockLen, v.create = () => m(), v;
  }
  function Pt(m) {
    const v = (X, Y) => m(Y).update(b(X)).digest(), Z = m({});
    return v.outputLen = Z.outputLen, v.blockLen = Z.blockLen, v.create = (X) => m(X), v;
  }
  function qt(m) {
    const v = (X, Y) => m(Y).update(b(X)).digest(), Z = m({});
    return v.outputLen = Z.outputLen, v.blockLen = Z.blockLen, v.create = (X) => m(X), v;
  }
  t.wrapConstructor = C, t.wrapConstructorWithOpts = Pt, t.wrapXOFConstructorWithOpts = qt;
  function Ge(m = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(m));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(m));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(K0);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = K0;
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
})(R0);
const Ye = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function V0(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function qs(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function ke(t, ...e) {
  if (!V0(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function R1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  qs(t.outputLen), qs(t.blockLen);
}
function Ys(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function W0(t, e) {
  ke(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function K1(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function V1(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Hr(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function Sr(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function wt(t, e) {
  return t << 32 - e | t >>> e;
}
function W1(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Gi = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Ri(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const q0 = Gi ? (t) => t : (t) => Ri(t), q1 = q0;
function Y0(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Ri(t[e]);
  return t;
}
const Y1 = Gi ? (t) => t : Y0, Z0 = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", Z1 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function X1(t) {
  if (ke(t), Z0)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Z1[t[n]];
  return e;
}
const Tt = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function uc(t) {
  if (t >= Tt._0 && t <= Tt._9)
    return t - Tt._0;
  if (t >= Tt.A && t <= Tt.F)
    return t - (Tt.A - 10);
  if (t >= Tt.a && t <= Tt.f)
    return t - (Tt.a - 10);
}
function Q1(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (Z0)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = uc(t.charCodeAt(i)), c = uc(t.charCodeAt(i + 1));
    if (o === void 0 || c === void 0) {
      const a = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + a + '" at index ' + i);
    }
    r[s] = o * 16 + c;
  }
  return r;
}
const X0 = async () => {
};
async function J1(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await X0(), r += i);
  }
}
function Ki(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function tg(t) {
  return new TextDecoder().decode(t);
}
function jn(t) {
  return typeof t == "string" && (t = Ki(t)), ke(t), t;
}
function eg(t) {
  return typeof t == "string" && (t = Ki(t)), ke(t), t;
}
function ng(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    ke(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function rg(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let Q0 = class {
};
function Qr(t) {
  const e = (r) => t().update(jn(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function J0(t) {
  const e = (r, s) => t(s).update(jn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function tl(t) {
  const e = (r, s) => t(s).update(jn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const sg = Qr, ig = J0, og = tl;
function cg(t = 32) {
  if (Ye && typeof Ye.getRandomValues == "function")
    return Ye.getRandomValues(new Uint8Array(t));
  if (Ye && typeof Ye.randomBytes == "function")
    return Uint8Array.from(Ye.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const ag = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Q0,
  abytes: ke,
  aexists: Ys,
  ahash: R1,
  anumber: qs,
  aoutput: W0,
  asyncLoop: J1,
  byteSwap: Ri,
  byteSwap32: Y0,
  byteSwapIfBE: q1,
  bytesToHex: X1,
  bytesToUtf8: tg,
  checkOpts: rg,
  clean: Hr,
  concatBytes: ng,
  createHasher: Qr,
  createOptHasher: J0,
  createView: Sr,
  createXOFer: tl,
  hexToBytes: Q1,
  isBytes: V0,
  isLE: Gi,
  kdfInputToBytes: eg,
  nextTick: X0,
  randomBytes: cg,
  rotl: W1,
  rotr: wt,
  swap32IfBE: Y1,
  swap8IfBE: q0,
  toBytes: jn,
  u32: V1,
  u8: K1,
  utf8ToBytes: Ki,
  wrapConstructor: sg,
  wrapConstructorWithOpts: ig,
  wrapXOFConstructorWithOpts: og
}, Symbol.toStringTag, { value: "Module" }));
function lg(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), a = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + a, o, r), t.setUint32(e + f, c, r);
}
function fg(t, e, n) {
  return t & e ^ ~t & n;
}
function ug(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class hg extends Q0 {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = Sr(this.buffer);
  }
  update(e) {
    Ys(this), e = jn(e), ke(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const a = Sr(e);
        for (; s <= i - o; o += s)
          this.process(a, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ys(this), W0(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, Hr(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    lg(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = Sr(e), a = this.outputLen;
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
]), dg = /* @__PURE__ */ Uint32Array.from([
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
let Vi = class extends hg {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = te[0] | 0, this.B = te[1] | 0, this.C = te[2] | 0, this.D = te[3] | 0, this.E = te[4] | 0, this.F = te[5] | 0, this.G = te[6] | 0, this.H = te[7] | 0;
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
      const g = ne[l - 15], d = ne[l - 2], p = wt(g, 7) ^ wt(g, 18) ^ g >>> 3, w = wt(d, 17) ^ wt(d, 19) ^ d >>> 10;
      ne[l] = w + ne[l - 7] + p + ne[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: a, G: f, H: u } = this;
    for (let l = 0; l < 64; l++) {
      const g = wt(c, 6) ^ wt(c, 11) ^ wt(c, 25), d = u + g + fg(c, a, f) + dg[l] + ne[l] | 0, w = (wt(r, 2) ^ wt(r, 13) ^ wt(r, 22)) + ug(r, s, i) | 0;
      u = f, f = a, a = c, c = o + d | 0, o = i, i = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, f = f + this.G | 0, u = u + this.H | 0, this.set(r, s, i, o, c, a, f, u);
  }
  roundClean() {
    Hr(ne);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Hr(this.buffer);
  }
}, el = class extends Vi {
  constructor() {
    super(28), this.A = ee[0] | 0, this.B = ee[1] | 0, this.C = ee[2] | 0, this.D = ee[3] | 0, this.E = ee[4] | 0, this.F = ee[5] | 0, this.G = ee[6] | 0, this.H = ee[7] | 0;
  }
};
const gg = /* @__PURE__ */ Qr(() => new Vi()), bg = /* @__PURE__ */ Qr(() => new el()), pg = Vi, xg = gg, wg = el, yg = bg, mg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: wg,
  SHA256: pg,
  sha224: yg,
  sha256: xg
}, Symbol.toStringTag, { value: "Module" })), Jr = /* @__PURE__ */ Wr(mg), Sg = /* @__PURE__ */ Wr(Id);
var fn = {};
Object.defineProperty(fn, "__esModule", { value: !0 });
fn.joseToDer = fn.derToJose = void 0;
const nl = kn, rl = ct;
function _s(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const Ag = {
  ES256: _s(256),
  ES384: _s(384),
  ES512: _s(521)
};
function sl(t) {
  const e = Ag[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Nr = 128, il = 0, Eg = 32, Ig = 16, vg = 2, ol = Ig | Eg | il << 6, Ur = vg | il << 6;
function cl(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, nl.toByteArray)((0, rl.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function Lg(t, e) {
  const n = cl(t), r = sl(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== ol)
    throw new Error('Could not find expected "seq"');
  let c = n[o++];
  if (c === (Nr | 1) && (c = n[o++]), i - o < c)
    throw new Error(`"seq" specified length of "${c}", only "${i - o}" remaining`);
  if (n[o++] !== Ur)
    throw new Error('Could not find expected "int" for "r"');
  const a = n[o++];
  if (i - o - 2 < a)
    throw new Error(`"r" specified length of "${a}", only "${i - o - 2}" available`);
  if (s < a)
    throw new Error(`"r" specified length of "${a}", max of "${s}" is acceptable`);
  const f = o;
  if (o += a, n[o++] !== Ur)
    throw new Error('Could not find expected "int" for "s"');
  const u = n[o++];
  if (i - o !== u)
    throw new Error(`"s" specified length of "${u}", expected "${i - o}"`);
  if (s < u)
    throw new Error(`"s" specified length of "${u}", max of "${s}" is acceptable`);
  const l = o;
  if (o += u, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const g = r - a, d = r - u, p = new Uint8Array(g + a + d + u);
  for (o = 0; o < g; ++o)
    p[o] = 0;
  p.set(n.subarray(f + Math.max(-g, 0), f + a), o), o = r;
  for (const w = o; o < w + d; ++o)
    p[o] = 0;
  return p.set(n.subarray(l + Math.max(-d, 0), l + u), o), (0, rl.escape)((0, nl.fromByteArray)(p));
}
fn.derToJose = Lg;
function hc(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Nr && --r, r;
}
function $g(t, e) {
  t = cl(t);
  const n = sl(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = hc(t, 0, n), i = hc(t, n, t.length), o = n - s, c = n - i, a = 2 + o + 1 + 1 + c, f = a < Nr, u = new Uint8Array((f ? 2 : 3) + a);
  let l = 0;
  return u[l++] = ol, f ? u[l++] = a : (u[l++] = Nr | 1, u[l++] = a & 255), u[l++] = Ur, u[l++] = o, s < 0 ? (u[l++] = 0, u.set(t.subarray(0, n), l), l += n) : (u.set(t.subarray(s, n), l), l += n - s), u[l++] = Ur, u[l++] = c, i < 0 ? (u[l++] = 0, u.set(t.subarray(n), l)) : u.set(t.subarray(n + i), l), u;
}
fn.joseToDer = $g;
var Kt = {};
Object.defineProperty(Kt, "__esModule", { value: !0 });
Kt.InvalidTokenError = Kt.MissingParametersError = void 0;
class Mg extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Kt.MissingParametersError = Mg;
class Bg extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Kt.InvalidTokenError = Bg;
const Tn = /* @__PURE__ */ Wr(ag);
Object.defineProperty(Zr, "__esModule", { value: !0 });
Zr.SECP256K1Client = void 0;
const _g = R0, Dg = Jr, Ar = Sg, dc = fn, gc = Kt, bc = Tn;
Ar.utils.hmacSha256Sync = (t, ...e) => {
  const n = _g.hmac.create(Dg.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class al {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, bc.bytesToHex)(Ar.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new gc.MissingParametersError("a signing input hash and private key are all required");
    const s = Ar.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, bc.bytesToHex)(s);
    if (r === "jose")
      return (0, dc.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, dc.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new gc.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Ar.verify(n, e, r, { strict: !1 });
  }
}
Zr.SECP256K1Client = al;
al.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Zr;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(Yr);
var He = {};
const Hg = /* @__PURE__ */ Wr(g0);
var Ng = at && at.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(He, "__esModule", { value: !0 });
He.hashSha256Async = He.hashSha256 = void 0;
const Ug = Jr;
function ll(t) {
  return (0, Ug.sha256)(t);
}
He.hashSha256 = ll;
function Cg(t) {
  return Ng(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Hg;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(ll(t));
    }
  });
}
He.hashSha256Async = Cg;
var Og = at && at.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(ln, "__esModule", { value: !0 });
ln.TokenSigner = ln.createUnsecuredToken = void 0;
const Zs = ct, pc = Yr, Pg = Kt, xc = He;
function Xs(t, e) {
  const n = [], r = Zs.encode(JSON.stringify(e));
  n.push(r);
  const s = Zs.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function kg(t) {
  return Xs(t, { typ: "JWT", alg: "none" }) + ".";
}
ln.createUnsecuredToken = kg;
class jg {
  constructor(e, n) {
    if (!(e && n))
      throw new Pg.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !pc.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = pc.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = Xs(e, s), o = (0, xc.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return Og(this, void 0, void 0, function* () {
      const s = this.header(r), i = Xs(e, s), o = yield (0, xc.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [Zs.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
ln.TokenSigner = jg;
var ts = {};
Object.defineProperty(ts, "__esModule", { value: !0 });
ts.TokenVerifier = void 0;
const Tg = ct, wc = Yr, Fg = Kt, ir = He;
class zg {
  constructor(e, n) {
    if (!(e && n))
      throw new Fg.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !wc.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = wc.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, ir.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, ir.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), Tg.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((c) => {
      const a = this.cryptoClient.loadSignature(c);
      this.cryptoClient.verifyHash(o, a, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, ir.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, ir.hashSha256)(r);
      return i(o);
    }
  }
}
ts.TokenVerifier = zg;
var es = {};
Object.defineProperty(es, "__esModule", { value: !0 });
es.decodeToken = void 0;
const or = ct;
function Gg(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(or.decode(e[0])), r = JSON.parse(or.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = or.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(or.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
es.decodeToken = Gg;
(function(t) {
  var e = at && at.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var c = Object.getOwnPropertyDescriptor(s, i);
    (!c || ("get" in c ? !s.__esModule : c.writable || c.configurable)) && (c = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, c);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = at && at.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(ln, t), n(ts, t), n(es, t), n(Kt, t), n(Yr, t);
})(ot);
function Rg(t) {
  return `did:btc-addr:${t}`;
}
function Kg(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Qo("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Qo('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function fl(t) {
  if (t)
    return Kg(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const Vg = "1.4.0";
function Wg() {
  return _1();
}
function qg(t, e, n, r = o0.slice(), s, i = _h().getTime(), o = {}) {
  const c = (d) => {
    const p = Di("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${d}=undefined])`
    });
    return p == null ? void 0 : p.origin;
  };
  e || (e = `${c("redirectURI")}/`), n || (n = `${c("manifestURI")}/manifest.json`), s || (s = c("appDomain"));
  const a = Object.assign({}, o, {
    jti: Hh(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: Vg,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), f = ot.SECP256K1Client.derivePublicKey(t);
  a.public_keys = [f];
  const u = O0(f);
  return a.iss = Rg(u), new ot.TokenSigner("ES256k", t).sign(a);
}
async function yc(t, e) {
  const n = l0(dt(e)), r = JSON.parse(n), s = await T0(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function Yg(t) {
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
function Zg(t) {
  const e = ot.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = fl(e.iss);
  if (n.length === 1) {
    if (O0(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function Xg(t) {
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
function Qg(t) {
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
function Jg(t) {
  const e = [
    Qg(t),
    Xg(t),
    Yg(t),
    Zg(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const mc = "1.0.0";
class Ie {
  constructor(e) {
    this.version = mc, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== mc)
      throw new Gs(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Ie(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class ul {
  constructor(e) {
    if (e) {
      const n = new Ie(e);
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
class Sc extends ul {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Ie({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new c0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Ie({})), !0;
  }
}
class Ac extends ul {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = $h, !localStorage.getItem(this.key)) {
      const r = new Ie({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new c0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Ie.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Ie({})), !0;
  }
}
var Dn;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Dn || (Dn = {}));
var Cr;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Cr || (Cr = {}));
Dn.Mainnet;
var zt;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(zt || (zt = {}));
var _t;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(_t || (_t = {}));
zt.Mainnet;
const hl = {
  chainId: Dn.Mainnet,
  transactionVersion: zt.Mainnet,
  peerNetworkId: Cr.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: _t.MainnetSingleSig,
    multiSig: _t.MainnetMultiSig
  },
  client: { baseUrl: zh }
}, Qs = {
  chainId: Dn.Testnet,
  transactionVersion: zt.Testnet,
  peerNetworkId: Cr.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: _t.TestnetSingleSig,
    multiSig: _t.TestnetMultiSig
  },
  client: { baseUrl: Gh }
}, Er = {
  ...Qs,
  addressVersion: { ...Qs.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Rh }
}, t2 = {
  ...Er,
  addressVersion: { ...Er.addressVersion },
  client: { ...Er.client }
};
function e2(t) {
  switch (t) {
    case "mainnet":
      return hl;
    case "testnet":
      return Qs;
    case "devnet":
      return Er;
    case "mocknet":
      return t2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function dl(t) {
  return typeof t == "string" ? e2(t) : t;
}
var Ec;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ec || (Ec = {}));
var Ic;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Ic || (Ic = {}));
var yt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(yt || (yt = {}));
const Ds = ["onChainOnly", "offChainOnly", "any"];
Ds[0] + "", yt.OnChainOnly, Ds[1] + "", yt.OffChainOnly, Ds[2] + "", yt.Any, yt.OnChainOnly + "", yt.OnChainOnly, yt.OffChainOnly + "", yt.OffChainOnly, yt.Any + "", yt.Any;
var vc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(vc || (vc = {}));
var Lc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Lc || (Lc = {}));
var $c;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})($c || ($c = {}));
var Ft;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Ft || (Ft = {}));
var Mc;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Mc || (Mc = {}));
var Bc;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Bc || (Bc = {}));
var _c;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(_c || (_c = {}));
var Dc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Dc || (Dc = {}));
var Hc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Hc || (Hc = {}));
var Nc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Nc || (Nc = {}));
var Uc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Uc || (Uc = {}));
var Cc;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Cc || (Cc = {}));
var Oc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Oc || (Oc = {}));
function Js(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function n2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function gl(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function r2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Js(t.outputLen), Js(t.blockLen);
}
function s2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function i2(t, e) {
  gl(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Be = {
  number: Js,
  bool: n2,
  bytes: gl,
  hash: r2,
  exists: s2,
  output: i2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Hs = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), vt = (t, e) => t << 32 - e | t >>> e, o2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!o2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function c2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Wi(t) {
  if (typeof t == "string" && (t = c2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let bl = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function je(t) {
  const e = (r) => t().update(Wi(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
class pl extends bl {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Be.hash(e);
    const r = Wi(n);
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
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: c } = this;
    return e = e, e.finished = s, e.destroyed = i, e.blockLen = o, e.outputLen = c, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const xl = (t, e, n) => new pl(t, e).update(n).digest();
xl.create = (t, e) => new pl(t, e);
function a2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), a = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + a, o, r), t.setUint32(e + f, c, r);
}
let qi = class extends bl {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Hs(this.buffer);
  }
  update(e) {
    Be.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Wi(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const a = Hs(e);
        for (; s <= i - o; o += s)
          this.process(a, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Be.exists(this), Be.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    a2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = Hs(e), a = this.outputLen;
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
const l2 = (t, e, n) => t & e ^ ~t & n, f2 = (t, e, n) => t & e ^ t & n ^ e & n, u2 = new Uint32Array([
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
let wl = class extends qi {
  constructor() {
    super(64, 32, 8, !1), this.A = re[0] | 0, this.B = re[1] | 0, this.C = re[2] | 0, this.D = re[3] | 0, this.E = re[4] | 0, this.F = re[5] | 0, this.G = re[6] | 0, this.H = re[7] | 0;
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
      se[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = se[l - 15], d = se[l - 2], p = vt(g, 7) ^ vt(g, 18) ^ g >>> 3, w = vt(d, 17) ^ vt(d, 19) ^ d >>> 10;
      se[l] = w + se[l - 7] + p + se[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: a, G: f, H: u } = this;
    for (let l = 0; l < 64; l++) {
      const g = vt(c, 6) ^ vt(c, 11) ^ vt(c, 25), d = u + g + l2(c, a, f) + u2[l] + se[l] | 0, w = (vt(r, 2) ^ vt(r, 13) ^ vt(r, 22)) + f2(r, s, i) | 0;
      u = f, f = a, a = c, c = o + d | 0, o = i, i = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, f = f + this.G | 0, u = u + this.H | 0, this.set(r, s, i, o, c, a, f, u);
  }
  roundClean() {
    se.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, h2 = class extends wl {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const yl = je(() => new wl());
je(() => new h2());
var ns = {}, Yi = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = Tn;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, c) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let a = [], f = 0;
    for (let d = o.length - 1; d >= 0; d--)
      if (f < 4) {
        const p = n.indexOf(o[d]) >> f;
        let w = 0;
        d !== 0 && (w = n.indexOf(o[d - 1]));
        const E = 1 + f, $ = w % (1 << E) << 5 - E, M = t.c32[p + $];
        f = E, a.unshift(M);
      } else
        f = 0;
    let u = 0;
    for (let d = 0; d < a.length && a[d] === "0"; d++)
      u++;
    a = a.slice(u);
    const l = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), g = l ? l[0].length : 0;
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
  function s(o) {
    return o.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  t.c32normalize = s;
  function i(o, c) {
    if (o = s(o), !o.match(`^[${t.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const a = o.match(`^${t.c32[0]}*`), f = a ? a[0].length : 0;
    let u = [], l = 0, g = 0;
    for (let w = o.length - 1; w >= 0; w--) {
      g === 4 && (u.unshift(n[l]), g = 0, l = 0);
      const $ = (t.c32.indexOf(o[w]) << g) + l, M = n[$ % 16];
      if (g += 1, l = $ >> 4, l > 1 << g)
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
  t.c32decode = i;
})(Yi);
var Ne = {};
Object.defineProperty(Ne, "__esModule", { value: !0 });
Ne.c32checkDecode = Ne.c32checkEncode = void 0;
const Pc = Jr, kc = Tn, Bn = Yi;
function ml(t) {
  const e = (0, Pc.sha256)((0, Pc.sha256)((0, kc.hexToBytes)(t)));
  return (0, kc.bytesToHex)(e.slice(0, 4));
}
function d2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = ml(`${n}${e}`), s = (0, Bn.c32encode)(`${e}${r}`);
  return `${Bn.c32[t]}${s}`;
}
Ne.c32checkEncode = d2;
function g2(t) {
  t = (0, Bn.c32normalize)(t);
  const e = (0, Bn.c32decode)(t.slice(1)), n = t[0], r = Bn.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), ml(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Ne.c32checkDecode = g2;
var Sl = {}, un = {};
Object.defineProperty(un, "__esModule", { value: !0 });
un.decode = un.encode = void 0;
const Or = Jr, jc = Tn, Al = D0, El = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function b2(t, e = "00") {
  const n = typeof t == "string" ? (0, jc.hexToBytes)(t) : t, r = typeof e == "string" ? (0, jc.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Or.sha256)((0, Or.sha256)(new Uint8Array([...r, ...n])));
  return Al(El).encode([...r, ...n, ...s.slice(0, 4)]);
}
un.encode = b2;
function p2(t) {
  const e = Al(El).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Or.sha256)((0, Or.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
un.decode = p2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Ne, n = un, r = Tn;
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
    const g = n.decode(u), d = (0, r.bytesToHex)(g.data), p = parseInt((0, r.bytesToHex)(g.prefix), 16);
    let w;
    return l < 0 ? (w = p, s[p] !== void 0 && (w = s[p])) : w = l, o(w, d);
  }
  t.b58ToC32 = a;
  function f(u, l = -1) {
    const g = c(u), d = g[0], p = g[1];
    let w;
    l < 0 ? (w = d, i[d] !== void 0 && (w = i[d])) : w = l;
    let E = w.toString(16);
    return E.length === 1 && (E = `0${E}`), n.encode(p, E);
  }
  t.c32ToB58 = f;
})(Sl);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Yi;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Ne;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Sl;
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
})(ns);
function x2(t, e) {
  switch (e = dl(e ?? hl), t) {
    case Ft.P2PKH:
      switch (e.transactionVersion) {
        case zt.Mainnet:
          return _t.MainnetSingleSig;
        case zt.Testnet:
          return _t.TestnetSingleSig;
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
          return _t.MainnetMultiSig;
        case zt.Testnet:
          return _t.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const w2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Il = Uint8Array.from({ length: 16 }, (t, e) => e), y2 = Il.map((t) => (9 * t + 5) % 16);
let Zi = [Il], Xi = [y2];
for (let t = 0; t < 4; t++)
  for (let e of [Zi, Xi])
    e.push(e[t].map((n) => w2[n]));
const vl = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), m2 = Zi.map((t, e) => t.map((n) => vl[e][n])), S2 = Xi.map((t, e) => t.map((n) => vl[e][n])), A2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), E2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), cr = (t, e) => t << e | t >>> 32 - e;
function Tc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ar = new Uint32Array(16);
let I2 = class extends qi {
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
    for (let d = 0; d < 16; d++, n += 4)
      ar[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, a = c, f = this.h3 | 0, u = f, l = this.h4 | 0, g = l;
    for (let d = 0; d < 5; d++) {
      const p = 4 - d, w = A2[d], E = E2[d], $ = Zi[d], M = Xi[d], x = m2[d], L = S2[d];
      for (let S = 0; S < 16; S++) {
        const N = cr(r + Tc(d, i, c, f) + ar[$[S]] + w, x[S]) + l | 0;
        r = l, l = f, f = cr(c, 10) | 0, c = i, i = N;
      }
      for (let S = 0; S < 16; S++) {
        const N = cr(s + Tc(p, o, a, u) + ar[M[S]] + E, L[S]) + g | 0;
        s = g, g = u, u = cr(a, 10) | 0, a = o, o = N;
      }
    }
    this.set(this.h1 + c + u | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + a | 0);
  }
  roundClean() {
    ar.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const v2 = je(() => new I2()), lr = BigInt(2 ** 32 - 1), ti = BigInt(32);
function Ll(t, e = !1) {
  return e ? { h: Number(t & lr), l: Number(t >> ti & lr) } : { h: Number(t >> ti & lr) | 0, l: Number(t & lr) | 0 };
}
function L2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Ll(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const $2 = (t, e) => BigInt(t >>> 0) << ti | BigInt(e >>> 0), M2 = (t, e, n) => t >>> n, B2 = (t, e, n) => t << 32 - n | e >>> n, _2 = (t, e, n) => t >>> n | e << 32 - n, D2 = (t, e, n) => t << 32 - n | e >>> n, H2 = (t, e, n) => t << 64 - n | e >>> n - 32, N2 = (t, e, n) => t >>> n - 32 | e << 64 - n, U2 = (t, e) => e, C2 = (t, e) => t, O2 = (t, e, n) => t << n | e >>> 32 - n, P2 = (t, e, n) => e << n | t >>> 32 - n, k2 = (t, e, n) => e << n - 32 | t >>> 64 - n, j2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function T2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const F2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), z2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, G2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), R2 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, K2 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), V2 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, T = {
  fromBig: Ll,
  split: L2,
  toBig: $2,
  shrSH: M2,
  shrSL: B2,
  rotrSH: _2,
  rotrSL: D2,
  rotrBH: H2,
  rotrBL: N2,
  rotr32H: U2,
  rotr32L: C2,
  rotlSH: O2,
  rotlSL: P2,
  rotlBH: k2,
  rotlBL: j2,
  add: T2,
  add3L: F2,
  add3H: z2,
  add4L: G2,
  add4H: R2,
  add5H: V2,
  add5L: K2
}, [W2, q2] = T.split([
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
].map((t) => BigInt(t))), ie = new Uint32Array(80), oe = new Uint32Array(80);
let rs = class extends qi {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: a, Eh: f, El: u, Fh: l, Fl: g, Gh: d, Gl: p, Hh: w, Hl: E } = this;
    return [e, n, r, s, i, o, c, a, f, u, l, g, d, p, w, E];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, a, f, u, l, g, d, p, w, E) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = a | 0, this.Eh = f | 0, this.El = u | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = d | 0, this.Gl = p | 0, this.Hh = w | 0, this.Hl = E | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      ie[x] = e.getUint32(n), oe[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const L = ie[x - 15] | 0, S = oe[x - 15] | 0, N = T.rotrSH(L, S, 1) ^ T.rotrSH(L, S, 8) ^ T.shrSH(L, S, 7), P = T.rotrSL(L, S, 1) ^ T.rotrSL(L, S, 8) ^ T.shrSL(L, S, 7), D = ie[x - 2] | 0, H = oe[x - 2] | 0, b = T.rotrSH(D, H, 19) ^ T.rotrBH(D, H, 61) ^ T.shrSH(D, H, 6), A = T.rotrSL(D, H, 19) ^ T.rotrBL(D, H, 61) ^ T.shrSL(D, H, 6), _ = T.add4L(P, A, oe[x - 7], oe[x - 16]), O = T.add4H(_, N, b, ie[x - 7], ie[x - 16]);
      ie[x] = O | 0, oe[x] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: a, Dh: f, Dl: u, Eh: l, El: g, Fh: d, Fl: p, Gh: w, Gl: E, Hh: $, Hl: M } = this;
    for (let x = 0; x < 80; x++) {
      const L = T.rotrSH(l, g, 14) ^ T.rotrSH(l, g, 18) ^ T.rotrBH(l, g, 41), S = T.rotrSL(l, g, 14) ^ T.rotrSL(l, g, 18) ^ T.rotrBL(l, g, 41), N = l & d ^ ~l & w, P = g & p ^ ~g & E, D = T.add5L(M, S, P, q2[x], oe[x]), H = T.add5H(D, $, L, N, W2[x], ie[x]), b = D | 0, A = T.rotrSH(r, s, 28) ^ T.rotrBH(r, s, 34) ^ T.rotrBH(r, s, 39), _ = T.rotrSL(r, s, 28) ^ T.rotrBL(r, s, 34) ^ T.rotrBL(r, s, 39), O = r & i ^ r & c ^ i & c, R = s & o ^ s & a ^ o & a;
      $ = w | 0, M = E | 0, w = d | 0, E = p | 0, d = l | 0, p = g | 0, { h: l, l: g } = T.add(f | 0, u | 0, H | 0, b | 0), f = c | 0, u = a | 0, c = i | 0, a = o | 0, i = r | 0, o = s | 0;
      const C = T.add3L(b, _, R);
      r = T.add3H(C, H, A, O), s = C | 0;
    }
    ({ h: r, l: s } = T.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = T.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l: a } = T.add(this.Ch | 0, this.Cl | 0, c | 0, a | 0), { h: f, l: u } = T.add(this.Dh | 0, this.Dl | 0, f | 0, u | 0), { h: l, l: g } = T.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: d, l: p } = T.add(this.Fh | 0, this.Fl | 0, d | 0, p | 0), { h: w, l: E } = T.add(this.Gh | 0, this.Gl | 0, w | 0, E | 0), { h: $, l: M } = T.add(this.Hh | 0, this.Hl | 0, $ | 0, M | 0), this.set(r, s, i, o, c, a, f, u, l, g, d, p, w, E, $, M);
  }
  roundClean() {
    ie.fill(0), oe.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Y2 = class extends rs {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Z2 = class extends rs {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, X2 = class extends rs {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
je(() => new rs());
je(() => new Y2());
je(() => new Z2());
je(() => new X2());
var Pr = { exports: {} };
Pr.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", c = "[object Boolean]", a = "[object Date]", f = "[object Error]", u = "[object Function]", l = "[object GeneratorFunction]", g = "[object Map]", d = "[object Number]", p = "[object Object]", w = "[object Promise]", E = "[object RegExp]", $ = "[object Set]", M = "[object String]", x = "[object Symbol]", L = "[object WeakMap]", S = "[object ArrayBuffer]", N = "[object DataView]", P = "[object Float32Array]", D = "[object Float64Array]", H = "[object Int8Array]", b = "[object Int16Array]", A = "[object Int32Array]", _ = "[object Uint8Array]", O = "[object Uint8ClampedArray]", R = "[object Uint16Array]", C = "[object Uint32Array]", Pt = /[\\^$.*+?()[\]{}|]/g, qt = /\w*$/, Ge = /^\[object .+?Constructor\]$/, m = /^(?:0|[1-9]\d*)$/, v = {};
  v[i] = v[o] = v[S] = v[N] = v[c] = v[a] = v[P] = v[D] = v[H] = v[b] = v[A] = v[g] = v[d] = v[p] = v[E] = v[$] = v[M] = v[x] = v[_] = v[O] = v[R] = v[C] = !0, v[f] = v[u] = v[L] = !1;
  var Z = typeof at == "object" && at && at.Object === Object && at, X = typeof self == "object" && self && self.Object === Object && self, Y = Z || X || Function("return this")(), st = e && !e.nodeType && e, Sn = st && !0 && t && !t.nodeType && t, Rn = Sn && Sn.exports === st;
  function us(h, y) {
    return h.set(y[0], y[1]), h;
  }
  function Gf(h, y) {
    return h.add(y), h;
  }
  function Rf(h, y) {
    for (var I = -1, U = h ? h.length : 0; ++I < U && y(h[I], I, h) !== !1; )
      ;
    return h;
  }
  function Kf(h, y) {
    for (var I = -1, U = y.length, rt = h.length; ++I < U; )
      h[rt + I] = y[I];
    return h;
  }
  function Lo(h, y, I, U) {
    for (var rt = -1, lt = h ? h.length : 0; ++rt < lt; )
      I = y(I, h[rt], rt, h);
    return I;
  }
  function Vf(h, y) {
    for (var I = -1, U = Array(h); ++I < h; )
      U[I] = y(I);
    return U;
  }
  function Wf(h, y) {
    return h == null ? void 0 : h[y];
  }
  function $o(h) {
    var y = !1;
    if (h != null && typeof h.toString != "function")
      try {
        y = !!(h + "");
      } catch {
      }
    return y;
  }
  function Mo(h) {
    var y = -1, I = Array(h.size);
    return h.forEach(function(U, rt) {
      I[++y] = [rt, U];
    }), I;
  }
  function hs(h, y) {
    return function(I) {
      return h(y(I));
    };
  }
  function Bo(h) {
    var y = -1, I = Array(h.size);
    return h.forEach(function(U) {
      I[++y] = U;
    }), I;
  }
  var qf = Array.prototype, Yf = Function.prototype, Kn = Object.prototype, ds = Y["__core-js_shared__"], _o = function() {
    var h = /[^.]+$/.exec(ds && ds.keys && ds.keys.IE_PROTO || "");
    return h ? "Symbol(src)_1." + h : "";
  }(), Do = Yf.toString, Yt = Kn.hasOwnProperty, Vn = Kn.toString, Zf = RegExp(
    "^" + Do.call(Yt).replace(Pt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Ho = Rn ? Y.Buffer : void 0, No = Y.Symbol, Uo = Y.Uint8Array, Xf = hs(Object.getPrototypeOf, Object), Qf = Object.create, Jf = Kn.propertyIsEnumerable, tu = qf.splice, Co = Object.getOwnPropertySymbols, eu = Ho ? Ho.isBuffer : void 0, nu = hs(Object.keys, Object), gs = Ve(Y, "DataView"), An = Ve(Y, "Map"), bs = Ve(Y, "Promise"), ps = Ve(Y, "Set"), xs = Ve(Y, "WeakMap"), En = Ve(Object, "create"), ru = $e(gs), su = $e(An), iu = $e(bs), ou = $e(ps), cu = $e(xs), Oo = No ? No.prototype : void 0, Po = Oo ? Oo.valueOf : void 0;
  function ve(h) {
    var y = -1, I = h ? h.length : 0;
    for (this.clear(); ++y < I; ) {
      var U = h[y];
      this.set(U[0], U[1]);
    }
  }
  function au() {
    this.__data__ = En ? En(null) : {};
  }
  function lu(h) {
    return this.has(h) && delete this.__data__[h];
  }
  function fu(h) {
    var y = this.__data__;
    if (En) {
      var I = y[h];
      return I === r ? void 0 : I;
    }
    return Yt.call(y, h) ? y[h] : void 0;
  }
  function uu(h) {
    var y = this.__data__;
    return En ? y[h] !== void 0 : Yt.call(y, h);
  }
  function hu(h, y) {
    var I = this.__data__;
    return I[h] = En && y === void 0 ? r : y, this;
  }
  ve.prototype.clear = au, ve.prototype.delete = lu, ve.prototype.get = fu, ve.prototype.has = uu, ve.prototype.set = hu;
  function kt(h) {
    var y = -1, I = h ? h.length : 0;
    for (this.clear(); ++y < I; ) {
      var U = h[y];
      this.set(U[0], U[1]);
    }
  }
  function du() {
    this.__data__ = [];
  }
  function gu(h) {
    var y = this.__data__, I = Wn(y, h);
    if (I < 0)
      return !1;
    var U = y.length - 1;
    return I == U ? y.pop() : tu.call(y, I, 1), !0;
  }
  function bu(h) {
    var y = this.__data__, I = Wn(y, h);
    return I < 0 ? void 0 : y[I][1];
  }
  function pu(h) {
    return Wn(this.__data__, h) > -1;
  }
  function xu(h, y) {
    var I = this.__data__, U = Wn(I, h);
    return U < 0 ? I.push([h, y]) : I[U][1] = y, this;
  }
  kt.prototype.clear = du, kt.prototype.delete = gu, kt.prototype.get = bu, kt.prototype.has = pu, kt.prototype.set = xu;
  function Re(h) {
    var y = -1, I = h ? h.length : 0;
    for (this.clear(); ++y < I; ) {
      var U = h[y];
      this.set(U[0], U[1]);
    }
  }
  function wu() {
    this.__data__ = {
      hash: new ve(),
      map: new (An || kt)(),
      string: new ve()
    };
  }
  function yu(h) {
    return qn(this, h).delete(h);
  }
  function mu(h) {
    return qn(this, h).get(h);
  }
  function Su(h) {
    return qn(this, h).has(h);
  }
  function Au(h, y) {
    return qn(this, h).set(h, y), this;
  }
  Re.prototype.clear = wu, Re.prototype.delete = yu, Re.prototype.get = mu, Re.prototype.has = Su, Re.prototype.set = Au;
  function Ke(h) {
    this.__data__ = new kt(h);
  }
  function Eu() {
    this.__data__ = new kt();
  }
  function Iu(h) {
    return this.__data__.delete(h);
  }
  function vu(h) {
    return this.__data__.get(h);
  }
  function Lu(h) {
    return this.__data__.has(h);
  }
  function $u(h, y) {
    var I = this.__data__;
    if (I instanceof kt) {
      var U = I.__data__;
      if (!An || U.length < n - 1)
        return U.push([h, y]), this;
      I = this.__data__ = new Re(U);
    }
    return I.set(h, y), this;
  }
  Ke.prototype.clear = Eu, Ke.prototype.delete = Iu, Ke.prototype.get = vu, Ke.prototype.has = Lu, Ke.prototype.set = $u;
  function Mu(h, y) {
    var I = ms(h) || Qu(h) ? Vf(h.length, String) : [], U = I.length, rt = !!U;
    for (var lt in h)
      Yt.call(h, lt) && !(rt && (lt == "length" || qu(lt, U))) && I.push(lt);
    return I;
  }
  function ko(h, y, I) {
    var U = h[y];
    (!(Yt.call(h, y) && zo(U, I)) || I === void 0 && !(y in h)) && (h[y] = I);
  }
  function Wn(h, y) {
    for (var I = h.length; I--; )
      if (zo(h[I][0], y))
        return I;
    return -1;
  }
  function Bu(h, y) {
    return h && jo(y, Ss(y), h);
  }
  function ws(h, y, I, U, rt, lt, jt) {
    var ft;
    if (U && (ft = lt ? U(h, rt, lt, jt) : U(h)), ft !== void 0)
      return ft;
    if (!Yn(h))
      return h;
    var Ko = ms(h);
    if (Ko) {
      if (ft = Ku(h), !y)
        return zu(h, ft);
    } else {
      var We = Le(h), Vo = We == u || We == l;
      if (th(h))
        return Cu(h, y);
      if (We == p || We == i || Vo && !lt) {
        if ($o(h))
          return lt ? h : {};
        if (ft = Vu(Vo ? {} : h), !y)
          return Gu(h, Bu(ft, h));
      } else {
        if (!v[We])
          return lt ? h : {};
        ft = Wu(h, We, ws, y);
      }
    }
    jt || (jt = new Ke());
    var Wo = jt.get(h);
    if (Wo)
      return Wo;
    if (jt.set(h, ft), !Ko)
      var qo = I ? Ru(h) : Ss(h);
    return Rf(qo || h, function(As, Zn) {
      qo && (Zn = As, As = h[Zn]), ko(ft, Zn, ws(As, y, I, U, Zn, h, jt));
    }), ft;
  }
  function _u(h) {
    return Yn(h) ? Qf(h) : {};
  }
  function Du(h, y, I) {
    var U = y(h);
    return ms(h) ? U : Kf(U, I(h));
  }
  function Hu(h) {
    return Vn.call(h);
  }
  function Nu(h) {
    if (!Yn(h) || Zu(h))
      return !1;
    var y = Ro(h) || $o(h) ? Zf : Ge;
    return y.test($e(h));
  }
  function Uu(h) {
    if (!Fo(h))
      return nu(h);
    var y = [];
    for (var I in Object(h))
      Yt.call(h, I) && I != "constructor" && y.push(I);
    return y;
  }
  function Cu(h, y) {
    if (y)
      return h.slice();
    var I = new h.constructor(h.length);
    return h.copy(I), I;
  }
  function ys(h) {
    var y = new h.constructor(h.byteLength);
    return new Uo(y).set(new Uo(h)), y;
  }
  function Ou(h, y) {
    var I = y ? ys(h.buffer) : h.buffer;
    return new h.constructor(I, h.byteOffset, h.byteLength);
  }
  function Pu(h, y, I) {
    var U = y ? I(Mo(h), !0) : Mo(h);
    return Lo(U, us, new h.constructor());
  }
  function ku(h) {
    var y = new h.constructor(h.source, qt.exec(h));
    return y.lastIndex = h.lastIndex, y;
  }
  function ju(h, y, I) {
    var U = y ? I(Bo(h), !0) : Bo(h);
    return Lo(U, Gf, new h.constructor());
  }
  function Tu(h) {
    return Po ? Object(Po.call(h)) : {};
  }
  function Fu(h, y) {
    var I = y ? ys(h.buffer) : h.buffer;
    return new h.constructor(I, h.byteOffset, h.length);
  }
  function zu(h, y) {
    var I = -1, U = h.length;
    for (y || (y = Array(U)); ++I < U; )
      y[I] = h[I];
    return y;
  }
  function jo(h, y, I, U) {
    I || (I = {});
    for (var rt = -1, lt = y.length; ++rt < lt; ) {
      var jt = y[rt], ft = void 0;
      ko(I, jt, ft === void 0 ? h[jt] : ft);
    }
    return I;
  }
  function Gu(h, y) {
    return jo(h, To(h), y);
  }
  function Ru(h) {
    return Du(h, Ss, To);
  }
  function qn(h, y) {
    var I = h.__data__;
    return Yu(y) ? I[typeof y == "string" ? "string" : "hash"] : I.map;
  }
  function Ve(h, y) {
    var I = Wf(h, y);
    return Nu(I) ? I : void 0;
  }
  var To = Co ? hs(Co, Object) : rh, Le = Hu;
  (gs && Le(new gs(new ArrayBuffer(1))) != N || An && Le(new An()) != g || bs && Le(bs.resolve()) != w || ps && Le(new ps()) != $ || xs && Le(new xs()) != L) && (Le = function(h) {
    var y = Vn.call(h), I = y == p ? h.constructor : void 0, U = I ? $e(I) : void 0;
    if (U)
      switch (U) {
        case ru:
          return N;
        case su:
          return g;
        case iu:
          return w;
        case ou:
          return $;
        case cu:
          return L;
      }
    return y;
  });
  function Ku(h) {
    var y = h.length, I = h.constructor(y);
    return y && typeof h[0] == "string" && Yt.call(h, "index") && (I.index = h.index, I.input = h.input), I;
  }
  function Vu(h) {
    return typeof h.constructor == "function" && !Fo(h) ? _u(Xf(h)) : {};
  }
  function Wu(h, y, I, U) {
    var rt = h.constructor;
    switch (y) {
      case S:
        return ys(h);
      case c:
      case a:
        return new rt(+h);
      case N:
        return Ou(h, U);
      case P:
      case D:
      case H:
      case b:
      case A:
      case _:
      case O:
      case R:
      case C:
        return Fu(h, U);
      case g:
        return Pu(h, U, I);
      case d:
      case M:
        return new rt(h);
      case E:
        return ku(h);
      case $:
        return ju(h, U, I);
      case x:
        return Tu(h);
    }
  }
  function qu(h, y) {
    return y = y ?? s, !!y && (typeof h == "number" || m.test(h)) && h > -1 && h % 1 == 0 && h < y;
  }
  function Yu(h) {
    var y = typeof h;
    return y == "string" || y == "number" || y == "symbol" || y == "boolean" ? h !== "__proto__" : h === null;
  }
  function Zu(h) {
    return !!_o && _o in h;
  }
  function Fo(h) {
    var y = h && h.constructor, I = typeof y == "function" && y.prototype || Kn;
    return h === I;
  }
  function $e(h) {
    if (h != null) {
      try {
        return Do.call(h);
      } catch {
      }
      try {
        return h + "";
      } catch {
      }
    }
    return "";
  }
  function Xu(h) {
    return ws(h, !0, !0);
  }
  function zo(h, y) {
    return h === y || h !== h && y !== y;
  }
  function Qu(h) {
    return Ju(h) && Yt.call(h, "callee") && (!Jf.call(h, "callee") || Vn.call(h) == i);
  }
  var ms = Array.isArray;
  function Go(h) {
    return h != null && eh(h.length) && !Ro(h);
  }
  function Ju(h) {
    return nh(h) && Go(h);
  }
  var th = eu || sh;
  function Ro(h) {
    var y = Yn(h) ? Vn.call(h) : "";
    return y == u || y == l;
  }
  function eh(h) {
    return typeof h == "number" && h > -1 && h % 1 == 0 && h <= s;
  }
  function Yn(h) {
    var y = typeof h;
    return !!h && (y == "object" || y == "function");
  }
  function nh(h) {
    return !!h && typeof h == "object";
  }
  function Ss(h) {
    return Go(h) ? Mu(h) : Uu(h);
  }
  function rh() {
    return [];
  }
  function sh() {
    return !1;
  }
  t.exports = Xu;
})(Pr, Pr.exports);
Pr.exports;
var ei;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ei || (ei = {}));
function Q2(t, e) {
  return { type: ei.Address, version: t, hash160: e };
}
function J2(t) {
  return ns.c32address(t.version, t.hash160);
}
const tb = (t) => v2(yl(t)), eb = (t) => xt(tb(t));
tt.hmacSha256Sync = (t, ...e) => {
  const n = xl.create(yl, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function nb(t, e = "mainnet") {
  e = dl(e), t = typeof t == "string" ? dt(t) : t;
  const n = x2(Ft.P2PKH, e), r = Q2(n, eb(t));
  return J2(r);
}
function rb(t, e) {
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
  const s = r.issuer.publicKey, i = nb(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new ot.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function sb(t, e = null) {
  let n;
  e ? n = rb(t, e) : n = ot.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const Fc = "_blockstackDidCheckEchoReply", ib = "echoReply", ob = "authContinuation";
function cb(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function ab() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[Fc];
  if (typeof e == "boolean")
    return e;
  const n = cb(t.location.search), r = n[ib];
  if (r) {
    t[Fc] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[ob];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class Hn {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new Kr();
    else
      throw new Bh("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new Ac(e.sessionOptions) : this.store = new Ac() : e ? this.store = new Sc(e.sessionOptions) : this.store = new Sc();
  }
  makeAuthRequestToken(e, n, r, s, i, o = Dh().getTime(), c = {}) {
    const a = this.appConfig;
    if (!a)
      throw new Gs("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || a.redirectURI(), r = r || a.manifestURI(), s = s || a.scopes, i = i || a.appDomain, qg(e, n, r, s, i, o, c);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = Wg();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = Di("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (ab())
        return Qe.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Qe.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = Zh()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Xn("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = ot.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await Jg(e))
      throw new Xn("Invalid authentication response.");
    let c = i.private_key, a = i.core_token;
    if ($s(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            c = await yc(s, i.private_key);
          } catch {
            if (Qe.warn("Failed decryption of appPrivateKey, will try to use as given"), !tt.isValidPrivateKey(i.private_key))
              throw new Xn("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (a != null)
          try {
            a = await yc(s, a);
          } catch {
            Qe.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Xn("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let f = Kh, u;
    $s(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (f = i.hubUrl), $s(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (u = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: fl(i.iss),
      appPrivateKey: c,
      coreSessionToken: a,
      authResponseToken: e,
      hubUrl: f,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: u
    }, g = i.profile_url;
    if (!l.profile && g) {
      const d = await n(g);
      if (!d.ok)
        l.profile = Object.assign({}, Lh);
      else {
        const p = await d.text(), w = JSON.parse(p);
        l.profile = sb(w[0].token);
      }
    } else
      l.profile = i.profile;
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
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), T1(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), F1(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
Hn.prototype.makeAuthRequest = Hn.prototype.makeAuthRequestToken;
const lb = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], fb = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = lb(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!ss(r.id));
  return e.concat(n);
}, ss = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), Qi = "STX_PROVIDER", Nt = () => typeof window > "u" ? null : window.localStorage.getItem(Qi), $l = (t) => {
  typeof window < "u" && window.localStorage.setItem(Qi, t);
}, Ml = () => {
  typeof window < "u" && window.localStorage.removeItem(Qi);
};
(function() {
  (function(t) {
    (function(e) {
      var n = typeof globalThis < "u" && globalThis || typeof t < "u" && t || // eslint-disable-next-line no-undef
      typeof at < "u" && at || {}, r = {
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
        ], o = ArrayBuffer.isView || function(b) {
          return b && i.indexOf(Object.prototype.toString.call(b)) > -1;
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
        var A = {
          next: function() {
            var _ = b.shift();
            return { done: _ === void 0, value: _ };
          }
        };
        return r.iterable && (A[Symbol.iterator] = function() {
          return A;
        }), A;
      }
      function u(b) {
        this.map = {}, b instanceof u ? b.forEach(function(A, _) {
          this.append(_, A);
        }, this) : Array.isArray(b) ? b.forEach(function(A) {
          if (A.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + A.length);
          this.append(A[0], A[1]);
        }, this) : b && Object.getOwnPropertyNames(b).forEach(function(A) {
          this.append(A, b[A]);
        }, this);
      }
      u.prototype.append = function(b, A) {
        b = c(b), A = a(A);
        var _ = this.map[b];
        this.map[b] = _ ? _ + ", " + A : A;
      }, u.prototype.delete = function(b) {
        delete this.map[c(b)];
      }, u.prototype.get = function(b) {
        return b = c(b), this.has(b) ? this.map[b] : null;
      }, u.prototype.has = function(b) {
        return this.map.hasOwnProperty(c(b));
      }, u.prototype.set = function(b, A) {
        this.map[c(b)] = a(A);
      }, u.prototype.forEach = function(b, A) {
        for (var _ in this.map)
          this.map.hasOwnProperty(_) && b.call(A, this.map[_], _, this);
      }, u.prototype.keys = function() {
        var b = [];
        return this.forEach(function(A, _) {
          b.push(_);
        }), f(b);
      }, u.prototype.values = function() {
        var b = [];
        return this.forEach(function(A) {
          b.push(A);
        }), f(b);
      }, u.prototype.entries = function() {
        var b = [];
        return this.forEach(function(A, _) {
          b.push([_, A]);
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
        return new Promise(function(A, _) {
          b.onload = function() {
            A(b.result);
          }, b.onerror = function() {
            _(b.error);
          };
        });
      }
      function d(b) {
        var A = new FileReader(), _ = g(A);
        return A.readAsArrayBuffer(b), _;
      }
      function p(b) {
        var A = new FileReader(), _ = g(A), O = /charset=([A-Za-z0-9_-]+)/.exec(b.type), R = O ? O[1] : "utf-8";
        return A.readAsText(b, R), _;
      }
      function w(b) {
        for (var A = new Uint8Array(b), _ = new Array(A.length), O = 0; O < A.length; O++)
          _[O] = String.fromCharCode(A[O]);
        return _.join("");
      }
      function E(b) {
        if (b.slice)
          return b.slice(0);
        var A = new Uint8Array(b.byteLength);
        return A.set(new Uint8Array(b)), A.buffer;
      }
      function $() {
        return this.bodyUsed = !1, this._initBody = function(b) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = b, b ? typeof b == "string" ? this._bodyText = b : r.blob && Blob.prototype.isPrototypeOf(b) ? this._bodyBlob = b : r.formData && FormData.prototype.isPrototypeOf(b) ? this._bodyFormData = b : r.searchParams && URLSearchParams.prototype.isPrototypeOf(b) ? this._bodyText = b.toString() : r.arrayBuffer && r.blob && s(b) ? (this._bodyArrayBuffer = E(b.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(b) || o(b)) ? this._bodyArrayBuffer = E(b) : this._bodyText = b = Object.prototype.toString.call(b) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof b == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(b) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
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
          return this.text().then(S);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var M = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function x(b) {
        var A = b.toUpperCase();
        return M.indexOf(A) > -1 ? A : b;
      }
      function L(b, A) {
        if (!(this instanceof L))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        A = A || {};
        var _ = A.body;
        if (b instanceof L) {
          if (b.bodyUsed)
            throw new TypeError("Already read");
          this.url = b.url, this.credentials = b.credentials, A.headers || (this.headers = new u(b.headers)), this.method = b.method, this.mode = b.mode, this.signal = b.signal, !_ && b._bodyInit != null && (_ = b._bodyInit, b.bodyUsed = !0);
        } else
          this.url = String(b);
        if (this.credentials = A.credentials || this.credentials || "same-origin", (A.headers || !this.headers) && (this.headers = new u(A.headers)), this.method = x(A.method || this.method || "GET"), this.mode = A.mode || this.mode || null, this.signal = A.signal || this.signal || function() {
          if ("AbortController" in n) {
            var C = new AbortController();
            return C.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && _)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(_), (this.method === "GET" || this.method === "HEAD") && (A.cache === "no-store" || A.cache === "no-cache")) {
          var O = /([?&])_=[^&]*/;
          if (O.test(this.url))
            this.url = this.url.replace(O, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var R = /\?/;
            this.url += (R.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      L.prototype.clone = function() {
        return new L(this, { body: this._bodyInit });
      };
      function S(b) {
        var A = new FormData();
        return b.trim().split("&").forEach(function(_) {
          if (_) {
            var O = _.split("="), R = O.shift().replace(/\+/g, " "), C = O.join("=").replace(/\+/g, " ");
            A.append(decodeURIComponent(R), decodeURIComponent(C));
          }
        }), A;
      }
      function N(b) {
        var A = new u(), _ = b.replace(/\r?\n[\t ]+/g, " ");
        return _.split("\r").map(function(O) {
          return O.indexOf(`
`) === 0 ? O.substr(1, O.length) : O;
        }).forEach(function(O) {
          var R = O.split(":"), C = R.shift().trim();
          if (C) {
            var Pt = R.join(":").trim();
            try {
              A.append(C, Pt);
            } catch (qt) {
              console.warn("Response " + qt.message);
            }
          }
        }), A;
      }
      $.call(L.prototype);
      function P(b, A) {
        if (!(this instanceof P))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (A || (A = {}), this.type = "default", this.status = A.status === void 0 ? 200 : A.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = A.statusText === void 0 ? "" : "" + A.statusText, this.headers = new u(A.headers), this.url = A.url || "", this._initBody(b);
      }
      $.call(P.prototype), P.prototype.clone = function() {
        return new P(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new u(this.headers),
          url: this.url
        });
      }, P.error = function() {
        var b = new P(null, { status: 200, statusText: "" });
        return b.ok = !1, b.status = 0, b.type = "error", b;
      };
      var D = [301, 302, 303, 307, 308];
      P.redirect = function(b, A) {
        if (D.indexOf(A) === -1)
          throw new RangeError("Invalid status code");
        return new P(null, { status: A, headers: { location: b } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(A, _) {
          this.message = A, this.name = _;
          var O = Error(A);
          this.stack = O.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function H(b, A) {
        return new Promise(function(_, O) {
          var R = new L(b, A);
          if (R.signal && R.signal.aborted)
            return O(new e.DOMException("Aborted", "AbortError"));
          var C = new XMLHttpRequest();
          function Pt() {
            C.abort();
          }
          C.onload = function() {
            var m = {
              statusText: C.statusText,
              headers: N(C.getAllResponseHeaders() || "")
            };
            R.url.indexOf("file://") === 0 && (C.status < 200 || C.status > 599) ? m.status = 200 : m.status = C.status, m.url = "responseURL" in C ? C.responseURL : m.headers.get("X-Request-URL");
            var v = "response" in C ? C.response : C.responseText;
            setTimeout(function() {
              _(new P(v, m));
            }, 0);
          }, C.onerror = function() {
            setTimeout(function() {
              O(new TypeError("Network request failed"));
            }, 0);
          }, C.ontimeout = function() {
            setTimeout(function() {
              O(new TypeError("Network request timed out"));
            }, 0);
          }, C.onabort = function() {
            setTimeout(function() {
              O(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function qt(m) {
            try {
              return m === "" && n.location.href ? n.location.href : m;
            } catch {
              return m;
            }
          }
          if (C.open(R.method, qt(R.url), !0), R.credentials === "include" ? C.withCredentials = !0 : R.credentials === "omit" && (C.withCredentials = !1), "responseType" in C && (r.blob ? C.responseType = "blob" : r.arrayBuffer && (C.responseType = "arraybuffer")), A && typeof A.headers == "object" && !(A.headers instanceof u || n.Headers && A.headers instanceof n.Headers)) {
            var Ge = [];
            Object.getOwnPropertyNames(A.headers).forEach(function(m) {
              Ge.push(c(m)), C.setRequestHeader(m, a(A.headers[m]));
            }), R.headers.forEach(function(m, v) {
              Ge.indexOf(v) === -1 && C.setRequestHeader(v, m);
            });
          } else
            R.headers.forEach(function(m, v) {
              C.setRequestHeader(v, m);
            });
          R.signal && (R.signal.addEventListener("abort", Pt), C.onreadystatechange = function() {
            C.readyState === 4 && R.signal.removeEventListener("abort", Pt);
          }), C.send(typeof R._bodyInit > "u" ? null : R._bodyInit);
        });
      }
      return H.polyfill = !0, n.fetch || (n.fetch = H, n.Headers = u, n.Request = L, n.Response = P), e.Headers = u, e.Request = L, e.Response = P, e.fetch = H, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : at);
})();
const ub = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function hb(t, e) {
  const n = {};
  return Object.assign(n, ub, e), await fetch(t, n);
}
function db(t) {
  let e = hb, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function gb(...t) {
  const { fetchLib: e, middlewares: n } = db(t);
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
var hn;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(hn || (hn = {}));
var Ue;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ue || (Ue = {}));
var zc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(zc || (zc = {}));
const bb = "https://api.mainnet.hiro.so", pb = "https://api.testnet.hiro.so", xb = "http://localhost:3999", wb = ["mainnet", "testnet", "devnet", "mocknet"];
class Ce {
  constructor(e) {
    this.version = Ue.Mainnet, this.chainId = hn.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ue.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? gb();
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
Ce.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new ni();
    case "testnet":
      return new ri();
    case "devnet":
      return new yb();
    case "mocknet":
      return new Bl();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${wb.join(", ")}`);
  }
};
Ce.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Ce.fromName(t);
class ni extends Ce {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? bb,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ue.Mainnet, this.chainId = hn.Mainnet;
  }
}
class ri extends Ce {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? pb,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ue.Testnet, this.chainId = hn.Testnet;
  }
}
class Bl extends Ce {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? xb,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ue.Testnet, this.chainId = hn.Testnet;
  }
}
const yb = Bl;
var si;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(si || (si = {}));
var Gc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Gc || (Gc = {}));
si.Mainnet;
var kr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(kr || (kr = {}));
var Rc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Rc || (Rc = {}));
kr.Mainnet;
const mb = 128, Sb = 128, _l = 16;
var Kc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Kc || (Kc = {}));
var Vc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Vc || (Vc = {}));
var mt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(mt || (mt = {}));
const Ns = ["onChainOnly", "offChainOnly", "any"];
Ns[0] + "", mt.OnChainOnly, Ns[1] + "", mt.OffChainOnly, Ns[2] + "", mt.Any, mt.OnChainOnly + "", mt.OnChainOnly, mt.OffChainOnly + "", mt.OffChainOnly, mt.Any + "", mt.Any;
var Wc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Wc || (Wc = {}));
var qc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(qc || (qc = {}));
var Yc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Yc || (Yc = {}));
var Zc;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Zc || (Zc = {}));
var Xc;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Xc || (Xc = {}));
var Qc;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Qc || (Qc = {}));
var Jc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Jc || (Jc = {}));
var ta;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(ta || (ta = {}));
var ea;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ea || (ea = {}));
var na;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(na || (na = {}));
var ra;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(ra || (ra = {}));
var sa;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(sa || (sa = {}));
var ia;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(ia || (ia = {}));
let Ab = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Eb = class extends Ab {
  constructor(e) {
    super(e);
  }
};
function ii(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Ib(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Dl(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function vb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ii(t.outputLen), ii(t.blockLen);
}
function Lb(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function $b(t, e) {
  Dl(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Us = {
  number: ii,
  bool: Ib,
  bytes: Dl,
  hash: vb,
  exists: Lb,
  output: $b
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Cs = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Lt = (t, e) => t << 32 - e | t >>> e, Mb = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Mb)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Bb(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Hl(t) {
  if (typeof t == "string" && (t = Bb(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let _b = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Te(t) {
  const e = (r) => t().update(Hl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Db(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), a = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + a, o, r), t.setUint32(e + f, c, r);
}
let Ji = class extends _b {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Cs(this.buffer);
  }
  update(e) {
    Us.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Hl(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const a = Cs(e);
        for (; s <= i - o; o += s)
          this.process(a, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Us.exists(this), Us.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Db(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = Cs(e), a = this.outputLen;
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
const Hb = (t, e, n) => t & e ^ ~t & n, Nb = (t, e, n) => t & e ^ t & n ^ e & n, Ub = new Uint32Array([
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
let Nl = class extends Ji {
  constructor() {
    super(64, 32, 8, !1), this.A = ce[0] | 0, this.B = ce[1] | 0, this.C = ce[2] | 0, this.D = ce[3] | 0, this.E = ce[4] | 0, this.F = ce[5] | 0, this.G = ce[6] | 0, this.H = ce[7] | 0;
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
      ae[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = ae[l - 15], d = ae[l - 2], p = Lt(g, 7) ^ Lt(g, 18) ^ g >>> 3, w = Lt(d, 17) ^ Lt(d, 19) ^ d >>> 10;
      ae[l] = w + ae[l - 7] + p + ae[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: a, G: f, H: u } = this;
    for (let l = 0; l < 64; l++) {
      const g = Lt(c, 6) ^ Lt(c, 11) ^ Lt(c, 25), d = u + g + Hb(c, a, f) + Ub[l] + ae[l] | 0, w = (Lt(r, 2) ^ Lt(r, 13) ^ Lt(r, 22)) + Nb(r, s, i) | 0;
      u = f, f = a, a = c, c = o + d | 0, o = i, i = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, f = f + this.G | 0, u = u + this.H | 0, this.set(r, s, i, o, c, a, f, u);
  }
  roundClean() {
    ae.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Cb = class extends Nl {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Te(() => new Nl());
Te(() => new Cb());
const Ob = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Ul = Uint8Array.from({ length: 16 }, (t, e) => e), Pb = Ul.map((t) => (9 * t + 5) % 16);
let to = [Ul], eo = [Pb];
for (let t = 0; t < 4; t++)
  for (let e of [to, eo])
    e.push(e[t].map((n) => Ob[n]));
const Cl = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), kb = to.map((t, e) => t.map((n) => Cl[e][n])), jb = eo.map((t, e) => t.map((n) => Cl[e][n])), Tb = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Fb = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), fr = (t, e) => t << e | t >>> 32 - e;
function oa(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ur = new Uint32Array(16);
let zb = class extends Ji {
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
    for (let d = 0; d < 16; d++, n += 4)
      ur[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, a = c, f = this.h3 | 0, u = f, l = this.h4 | 0, g = l;
    for (let d = 0; d < 5; d++) {
      const p = 4 - d, w = Tb[d], E = Fb[d], $ = to[d], M = eo[d], x = kb[d], L = jb[d];
      for (let S = 0; S < 16; S++) {
        const N = fr(r + oa(d, i, c, f) + ur[$[S]] + w, x[S]) + l | 0;
        r = l, l = f, f = fr(c, 10) | 0, c = i, i = N;
      }
      for (let S = 0; S < 16; S++) {
        const N = fr(s + oa(p, o, a, u) + ur[M[S]] + E, L[S]) + g | 0;
        s = g, g = u, u = fr(a, 10) | 0, a = o, o = N;
      }
    }
    this.set(this.h1 + c + u | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + a | 0);
  }
  roundClean() {
    ur.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Te(() => new zb());
const hr = BigInt(2 ** 32 - 1), oi = BigInt(32);
function Ol(t, e = !1) {
  return e ? { h: Number(t & hr), l: Number(t >> oi & hr) } : { h: Number(t >> oi & hr) | 0, l: Number(t & hr) | 0 };
}
function Gb(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Ol(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Rb = (t, e) => BigInt(t >>> 0) << oi | BigInt(e >>> 0), Kb = (t, e, n) => t >>> n, Vb = (t, e, n) => t << 32 - n | e >>> n, Wb = (t, e, n) => t >>> n | e << 32 - n, qb = (t, e, n) => t << 32 - n | e >>> n, Yb = (t, e, n) => t << 64 - n | e >>> n - 32, Zb = (t, e, n) => t >>> n - 32 | e << 64 - n, Xb = (t, e) => e, Qb = (t, e) => t, Jb = (t, e, n) => t << n | e >>> 32 - n, tp = (t, e, n) => e << n | t >>> 32 - n, ep = (t, e, n) => e << n - 32 | t >>> 64 - n, np = (t, e, n) => t << n - 32 | e >>> 64 - n;
function rp(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const sp = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), ip = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, op = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), cp = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, ap = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), lp = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, F = {
  fromBig: Ol,
  split: Gb,
  toBig: Rb,
  shrSH: Kb,
  shrSL: Vb,
  rotrSH: Wb,
  rotrSL: qb,
  rotrBH: Yb,
  rotrBL: Zb,
  rotr32H: Xb,
  rotr32L: Qb,
  rotlSH: Jb,
  rotlSL: tp,
  rotlBH: ep,
  rotlBL: np,
  add: rp,
  add3L: sp,
  add3H: ip,
  add4L: op,
  add4H: cp,
  add5H: lp,
  add5L: ap
}, [fp, up] = F.split([
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
let is = class extends Ji {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: a, Eh: f, El: u, Fh: l, Fl: g, Gh: d, Gl: p, Hh: w, Hl: E } = this;
    return [e, n, r, s, i, o, c, a, f, u, l, g, d, p, w, E];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, a, f, u, l, g, d, p, w, E) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = a | 0, this.Eh = f | 0, this.El = u | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = d | 0, this.Gl = p | 0, this.Hh = w | 0, this.Hl = E | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      le[x] = e.getUint32(n), fe[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const L = le[x - 15] | 0, S = fe[x - 15] | 0, N = F.rotrSH(L, S, 1) ^ F.rotrSH(L, S, 8) ^ F.shrSH(L, S, 7), P = F.rotrSL(L, S, 1) ^ F.rotrSL(L, S, 8) ^ F.shrSL(L, S, 7), D = le[x - 2] | 0, H = fe[x - 2] | 0, b = F.rotrSH(D, H, 19) ^ F.rotrBH(D, H, 61) ^ F.shrSH(D, H, 6), A = F.rotrSL(D, H, 19) ^ F.rotrBL(D, H, 61) ^ F.shrSL(D, H, 6), _ = F.add4L(P, A, fe[x - 7], fe[x - 16]), O = F.add4H(_, N, b, le[x - 7], le[x - 16]);
      le[x] = O | 0, fe[x] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: a, Dh: f, Dl: u, Eh: l, El: g, Fh: d, Fl: p, Gh: w, Gl: E, Hh: $, Hl: M } = this;
    for (let x = 0; x < 80; x++) {
      const L = F.rotrSH(l, g, 14) ^ F.rotrSH(l, g, 18) ^ F.rotrBH(l, g, 41), S = F.rotrSL(l, g, 14) ^ F.rotrSL(l, g, 18) ^ F.rotrBL(l, g, 41), N = l & d ^ ~l & w, P = g & p ^ ~g & E, D = F.add5L(M, S, P, up[x], fe[x]), H = F.add5H(D, $, L, N, fp[x], le[x]), b = D | 0, A = F.rotrSH(r, s, 28) ^ F.rotrBH(r, s, 34) ^ F.rotrBH(r, s, 39), _ = F.rotrSL(r, s, 28) ^ F.rotrBL(r, s, 34) ^ F.rotrBL(r, s, 39), O = r & i ^ r & c ^ i & c, R = s & o ^ s & a ^ o & a;
      $ = w | 0, M = E | 0, w = d | 0, E = p | 0, d = l | 0, p = g | 0, { h: l, l: g } = F.add(f | 0, u | 0, H | 0, b | 0), f = c | 0, u = a | 0, c = i | 0, a = o | 0, i = r | 0, o = s | 0;
      const C = F.add3L(b, _, R);
      r = F.add3H(C, H, A, O), s = C | 0;
    }
    ({ h: r, l: s } = F.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = F.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l: a } = F.add(this.Ch | 0, this.Cl | 0, c | 0, a | 0), { h: f, l: u } = F.add(this.Dh | 0, this.Dl | 0, f | 0, u | 0), { h: l, l: g } = F.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: d, l: p } = F.add(this.Fh | 0, this.Fl | 0, d | 0, p | 0), { h: w, l: E } = F.add(this.Gh | 0, this.Gl | 0, w | 0, E | 0), { h: $, l: M } = F.add(this.Hh | 0, this.Hl | 0, $ | 0, M | 0), this.set(r, s, i, o, c, a, f, u, l, g, d, p, w, E, $, M);
  }
  roundClean() {
    le.fill(0), fe.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, hp = class extends is {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, dp = class extends is {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, gp = class extends is {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Te(() => new is());
Te(() => new hp());
Te(() => new dp());
Te(() => new gp());
var et;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(et || (et = {}));
var ci;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(ci || (ci = {}));
function no(t) {
  return ci[t];
}
var jr;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(jr || (jr = {}));
function Pl(t, e, n) {
  const s = mb;
  if ($p(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: jr.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
function kl(t) {
  const e = ns.c32addressDecode(t);
  return {
    type: jr.Address,
    version: e[0],
    hash160: e[1]
  };
}
function jl(t) {
  const e = [];
  return e.push(dt(Hi(t.version, 1))), e.push(dt(t.hash160)), bn(e);
}
function Tl(t) {
  const e = [], n = Pn(t.content), r = n.byteLength;
  return e.push(dt(Hi(r, t.lengthPrefixBytes))), e.push(n), bn(e);
}
function Ut(t, e) {
  return bn([no(t), e]);
}
function bp(t) {
  return new Uint8Array([no(t.type)]);
}
function pp(t) {
  return t.type === et.OptionalNone ? new Uint8Array([no(t.type)]) : Ut(t.type, Fn(t.value));
}
function xp(t) {
  const e = new Uint8Array(4);
  return Rr(e, Math.ceil(t.value.length / 2), 0), Ut(t.type, Rt(e, dt(t.value)));
}
function wp(t) {
  const e = a0(Ph(BigInt(t.value), BigInt(Sb)), _l);
  return Ut(t.type, e);
}
function yp(t) {
  const e = a0(BigInt(t.value), _l);
  return Ut(t.type, e);
}
function mp(t) {
  return Ut(t.type, jl(kl(t.value)));
}
function Sp(t) {
  const [e, n] = Mp(t.value);
  return Ut(t.type, Rt(jl(kl(e)), Tl(Pl(n))));
}
function Ap(t) {
  return Ut(t.type, Fn(t.value));
}
function Ep(t) {
  const e = [], n = new Uint8Array(4);
  Rr(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = Fn(r);
    e.push(s);
  }
  return Ut(t.type, bn(e));
}
function Ip(t) {
  const e = [], n = new Uint8Array(4);
  Rr(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Pl(s);
    e.push(Tl(i));
    const o = Fn(t.value[s]);
    e.push(o);
  }
  return Ut(t.type, bn(e));
}
function Fl(t, e) {
  const n = [], r = e == "ascii" ? jh(t.value) : Pn(t.value), s = new Uint8Array(4);
  return Rr(s, r.length, 0), n.push(s), n.push(r), Ut(t.type, bn(n));
}
function vp(t) {
  return Fl(t, "ascii");
}
function Lp(t) {
  return Fl(t, "utf8");
}
function ca(t) {
  return xt(Fn(t));
}
function Fn(t) {
  switch (t.type) {
    case et.BoolTrue:
    case et.BoolFalse:
      return bp(t);
    case et.OptionalNone:
    case et.OptionalSome:
      return pp(t);
    case et.Buffer:
      return xp(t);
    case et.UInt:
      return yp(t);
    case et.Int:
      return wp(t);
    case et.PrincipalStandard:
      return mp(t);
    case et.PrincipalContract:
      return Sp(t);
    case et.ResponseOk:
    case et.ResponseErr:
      return Ap(t);
    case et.List:
      return Ep(t);
    case et.Tuple:
      return Ip(t);
    case et.StringASCII:
      return vp(t);
    case et.StringUTF8:
      return Lp(t);
    default:
      throw new Eb("Unable to serialize. Invalid Clarity Value.");
  }
}
const $p = (t, e) => t ? Pn(t).length > e : !1;
function Mp(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
function Bp(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Nn(r);
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
    return BigInt(`0x${Hp(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function ro(t, e = 8) {
  return (typeof t == "bigint" ? t : Bp(t)).toString(16).padStart(e * 2, "0");
}
function zl(t, e = 16) {
  const n = ro(t, e);
  return Nn(n);
}
function _p(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const Dp = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Hp(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Dp[n];
  return e;
}
function Nn(t) {
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
function so(t) {
  return new TextEncoder().encode(t);
}
function Np(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Up(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function aa(t) {
  if (t.some(Up))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function io(...t) {
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
  return io(...t.map((e) => typeof e == "number" ? aa([e]) : e instanceof Array ? aa(e) : e));
}
function os(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var ai;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ai || (ai = {}));
ai.Mainnet;
const Cp = 128, Op = 128, Gl = 16;
var li;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(li || (li = {}));
var la;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(la || (la = {}));
var fa;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(fa || (fa = {}));
var St;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(St || (St = {}));
const Os = ["onChainOnly", "offChainOnly", "any"];
Os[0] + "", St.OnChainOnly, Os[1] + "", St.OffChainOnly, Os[2] + "", St.Any, St.OnChainOnly + "", St.OnChainOnly, St.OffChainOnly + "", St.OffChainOnly, St.Any + "", St.Any;
var fi;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(fi || (fi = {}));
fi.Mainnet;
var ua;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(ua || (ua = {}));
var ha;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(ha || (ha = {}));
var da;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(da || (da = {}));
var ga;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(ga || (ga = {}));
var ba;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ba || (ba = {}));
var pa;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(pa || (pa = {}));
var xa;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(xa || (xa = {}));
var wa;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(wa || (wa = {}));
var ya;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ya || (ya = {}));
var ma;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(ma || (ma = {}));
var Sa;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Sa || (Sa = {}));
function ui(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Pp(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Rl(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function kp(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ui(t.outputLen), ui(t.blockLen);
}
function jp(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Tp(t, e) {
  Rl(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ps = {
  number: ui,
  bool: Pp,
  bytes: Rl,
  hash: kp,
  exists: jp,
  output: Tp
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ks = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), $t = (t, e) => t << 32 - e | t >>> e, Fp = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Fp)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function zp(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Kl(t) {
  if (typeof t == "string" && (t = zp(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Gp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Fe(t) {
  const e = (r) => t().update(Kl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Rp(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), a = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + a, o, r), t.setUint32(e + f, c, r);
}
let oo = class extends Gp {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ks(this.buffer);
  }
  update(e) {
    Ps.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Kl(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const a = ks(e);
        for (; s <= i - o; o += s)
          this.process(a, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ps.exists(this), Ps.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Rp(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = ks(e), a = this.outputLen;
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
const Kp = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Vl = Uint8Array.from({ length: 16 }, (t, e) => e), Vp = Vl.map((t) => (9 * t + 5) % 16);
let co = [Vl], ao = [Vp];
for (let t = 0; t < 4; t++)
  for (let e of [co, ao])
    e.push(e[t].map((n) => Kp[n]));
const Wl = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Wp = co.map((t, e) => t.map((n) => Wl[e][n])), qp = ao.map((t, e) => t.map((n) => Wl[e][n])), Yp = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Zp = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), dr = (t, e) => t << e | t >>> 32 - e;
function Aa(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const gr = new Uint32Array(16);
let Xp = class extends oo {
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
    for (let d = 0; d < 16; d++, n += 4)
      gr[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, a = c, f = this.h3 | 0, u = f, l = this.h4 | 0, g = l;
    for (let d = 0; d < 5; d++) {
      const p = 4 - d, w = Yp[d], E = Zp[d], $ = co[d], M = ao[d], x = Wp[d], L = qp[d];
      for (let S = 0; S < 16; S++) {
        const N = dr(r + Aa(d, i, c, f) + gr[$[S]] + w, x[S]) + l | 0;
        r = l, l = f, f = dr(c, 10) | 0, c = i, i = N;
      }
      for (let S = 0; S < 16; S++) {
        const N = dr(s + Aa(p, o, a, u) + gr[M[S]] + E, L[S]) + g | 0;
        s = g, g = u, u = dr(a, 10) | 0, a = o, o = N;
      }
    }
    this.set(this.h1 + c + u | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + a | 0);
  }
  roundClean() {
    gr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Fe(() => new Xp());
const Qp = (t, e, n) => t & e ^ ~t & n, Jp = (t, e, n) => t & e ^ t & n ^ e & n, tx = new Uint32Array([
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
let ql = class extends oo {
  constructor() {
    super(64, 32, 8, !1), this.A = ue[0] | 0, this.B = ue[1] | 0, this.C = ue[2] | 0, this.D = ue[3] | 0, this.E = ue[4] | 0, this.F = ue[5] | 0, this.G = ue[6] | 0, this.H = ue[7] | 0;
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
      he[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = he[l - 15], d = he[l - 2], p = $t(g, 7) ^ $t(g, 18) ^ g >>> 3, w = $t(d, 17) ^ $t(d, 19) ^ d >>> 10;
      he[l] = w + he[l - 7] + p + he[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: a, G: f, H: u } = this;
    for (let l = 0; l < 64; l++) {
      const g = $t(c, 6) ^ $t(c, 11) ^ $t(c, 25), d = u + g + Qp(c, a, f) + tx[l] + he[l] | 0, w = ($t(r, 2) ^ $t(r, 13) ^ $t(r, 22)) + Jp(r, s, i) | 0;
      u = f, f = a, a = c, c = o + d | 0, o = i, i = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, f = f + this.G | 0, u = u + this.H | 0, this.set(r, s, i, o, c, a, f, u);
  }
  roundClean() {
    he.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, ex = class extends ql {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Fe(() => new ql());
Fe(() => new ex());
const br = BigInt(2 ** 32 - 1), hi = BigInt(32);
function Yl(t, e = !1) {
  return e ? { h: Number(t & br), l: Number(t >> hi & br) } : { h: Number(t >> hi & br) | 0, l: Number(t & br) | 0 };
}
function nx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Yl(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const rx = (t, e) => BigInt(t >>> 0) << hi | BigInt(e >>> 0), sx = (t, e, n) => t >>> n, ix = (t, e, n) => t << 32 - n | e >>> n, ox = (t, e, n) => t >>> n | e << 32 - n, cx = (t, e, n) => t << 32 - n | e >>> n, ax = (t, e, n) => t << 64 - n | e >>> n - 32, lx = (t, e, n) => t >>> n - 32 | e << 64 - n, fx = (t, e) => e, ux = (t, e) => t, hx = (t, e, n) => t << n | e >>> 32 - n, dx = (t, e, n) => e << n | t >>> 32 - n, gx = (t, e, n) => e << n - 32 | t >>> 64 - n, bx = (t, e, n) => t << n - 32 | e >>> 64 - n;
function px(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const xx = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), wx = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, yx = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), mx = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Sx = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Ax = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, z = {
  fromBig: Yl,
  split: nx,
  toBig: rx,
  shrSH: sx,
  shrSL: ix,
  rotrSH: ox,
  rotrSL: cx,
  rotrBH: ax,
  rotrBL: lx,
  rotr32H: fx,
  rotr32L: ux,
  rotlSH: hx,
  rotlSL: dx,
  rotlBH: gx,
  rotlBL: bx,
  add: px,
  add3L: xx,
  add3H: wx,
  add4L: yx,
  add4H: mx,
  add5H: Ax,
  add5L: Sx
}, [Ex, Ix] = z.split([
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
let cs = class extends oo {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: a, Eh: f, El: u, Fh: l, Fl: g, Gh: d, Gl: p, Hh: w, Hl: E } = this;
    return [e, n, r, s, i, o, c, a, f, u, l, g, d, p, w, E];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, a, f, u, l, g, d, p, w, E) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = a | 0, this.Eh = f | 0, this.El = u | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = d | 0, this.Gl = p | 0, this.Hh = w | 0, this.Hl = E | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      de[x] = e.getUint32(n), ge[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const L = de[x - 15] | 0, S = ge[x - 15] | 0, N = z.rotrSH(L, S, 1) ^ z.rotrSH(L, S, 8) ^ z.shrSH(L, S, 7), P = z.rotrSL(L, S, 1) ^ z.rotrSL(L, S, 8) ^ z.shrSL(L, S, 7), D = de[x - 2] | 0, H = ge[x - 2] | 0, b = z.rotrSH(D, H, 19) ^ z.rotrBH(D, H, 61) ^ z.shrSH(D, H, 6), A = z.rotrSL(D, H, 19) ^ z.rotrBL(D, H, 61) ^ z.shrSL(D, H, 6), _ = z.add4L(P, A, ge[x - 7], ge[x - 16]), O = z.add4H(_, N, b, de[x - 7], de[x - 16]);
      de[x] = O | 0, ge[x] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: a, Dh: f, Dl: u, Eh: l, El: g, Fh: d, Fl: p, Gh: w, Gl: E, Hh: $, Hl: M } = this;
    for (let x = 0; x < 80; x++) {
      const L = z.rotrSH(l, g, 14) ^ z.rotrSH(l, g, 18) ^ z.rotrBH(l, g, 41), S = z.rotrSL(l, g, 14) ^ z.rotrSL(l, g, 18) ^ z.rotrBL(l, g, 41), N = l & d ^ ~l & w, P = g & p ^ ~g & E, D = z.add5L(M, S, P, Ix[x], ge[x]), H = z.add5H(D, $, L, N, Ex[x], de[x]), b = D | 0, A = z.rotrSH(r, s, 28) ^ z.rotrBH(r, s, 34) ^ z.rotrBH(r, s, 39), _ = z.rotrSL(r, s, 28) ^ z.rotrBL(r, s, 34) ^ z.rotrBL(r, s, 39), O = r & i ^ r & c ^ i & c, R = s & o ^ s & a ^ o & a;
      $ = w | 0, M = E | 0, w = d | 0, E = p | 0, d = l | 0, p = g | 0, { h: l, l: g } = z.add(f | 0, u | 0, H | 0, b | 0), f = c | 0, u = a | 0, c = i | 0, a = o | 0, i = r | 0, o = s | 0;
      const C = z.add3L(b, _, R);
      r = z.add3H(C, H, A, O), s = C | 0;
    }
    ({ h: r, l: s } = z.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = z.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l: a } = z.add(this.Ch | 0, this.Cl | 0, c | 0, a | 0), { h: f, l: u } = z.add(this.Dh | 0, this.Dl | 0, f | 0, u | 0), { h: l, l: g } = z.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: d, l: p } = z.add(this.Fh | 0, this.Fl | 0, d | 0, p | 0), { h: w, l: E } = z.add(this.Gh | 0, this.Gl | 0, w | 0, E | 0), { h: $, l: M } = z.add(this.Hh | 0, this.Hl | 0, $ | 0, M | 0), this.set(r, s, i, o, c, a, f, u, l, g, d, p, w, E, $, M);
  }
  roundClean() {
    de.fill(0), ge.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, vx = class extends cs {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Lx = class extends cs {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, $x = class extends cs {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Fe(() => new cs());
Fe(() => new vx());
Fe(() => new Lx());
Fe(() => new $x());
function Mx(t, e, n) {
  const s = Cp;
  if (Gx(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: li.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var nt;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(nt || (nt = {}));
let Bx = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, _x = class extends Bx {
  constructor(e) {
    super(e);
  }
};
function Zl(t) {
  const e = [];
  return e.push(Nn(ro(t.version, 1))), e.push(Nn(t.hash160)), xn(e);
}
function Xl(t) {
  const e = [], n = so(t.content), r = n.byteLength;
  return e.push(Nn(ro(r, t.lengthPrefixBytes))), e.push(n), xn(e);
}
function Ct(t, e) {
  return xn([t, e]);
}
function Dx(t) {
  return new Uint8Array([t.type]);
}
function Hx(t) {
  return t.type === nt.OptionalNone ? new Uint8Array([t.type]) : Ct(t.type, dn(t.value));
}
function Nx(t) {
  const e = new Uint8Array(4);
  return os(e, t.buffer.length, 0), Ct(t.type, io(e, t.buffer));
}
function Ux(t) {
  const e = zl(_p(t.value, BigInt(Op)), Gl);
  return Ct(t.type, e);
}
function Cx(t) {
  const e = zl(t.value, Gl);
  return Ct(t.type, e);
}
function Ox(t) {
  return Ct(t.type, Zl(t.address));
}
function Px(t) {
  return Ct(t.type, io(Zl(t.address), Xl(t.contractName)));
}
function kx(t) {
  return Ct(t.type, dn(t.value));
}
function jx(t) {
  const e = [], n = new Uint8Array(4);
  os(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = dn(r);
    e.push(s);
  }
  return Ct(t.type, xn(e));
}
function Tx(t) {
  const e = [], n = new Uint8Array(4);
  os(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Mx(s);
    e.push(Xl(i));
    const o = dn(t.data[s]);
    e.push(o);
  }
  return Ct(t.type, xn(e));
}
function Ql(t, e) {
  const n = [], r = e == "ascii" ? Np(t.data) : so(t.data), s = new Uint8Array(4);
  return os(s, r.length, 0), n.push(s), n.push(r), Ct(t.type, xn(n));
}
function Fx(t) {
  return Ql(t, "ascii");
}
function zx(t) {
  return Ql(t, "utf8");
}
function dn(t) {
  switch (t.type) {
    case nt.BoolTrue:
    case nt.BoolFalse:
      return Dx(t);
    case nt.OptionalNone:
    case nt.OptionalSome:
      return Hx(t);
    case nt.Buffer:
      return Nx(t);
    case nt.UInt:
      return Cx(t);
    case nt.Int:
      return Ux(t);
    case nt.PrincipalStandard:
      return Ox(t);
    case nt.PrincipalContract:
      return Px(t);
    case nt.ResponseOk:
    case nt.ResponseErr:
      return kx(t);
    case nt.List:
      return jx(t);
    case nt.Tuple:
      return Tx(t);
    case nt.StringASCII:
      return Fx(t);
    case nt.StringUTF8:
      return zx(t);
    default:
      throw new _x("Unable to serialize. Invalid Clarity Value.");
  }
}
const Gx = (t, e) => t ? so(t).length > e : !1, Rx = "connect-ui";
let Ir, Jl, ht = !1, di = !1;
const Vt = (t, e = "") => () => {
}, Kx = (t, e) => () => {
}, Vx = "{visibility:hidden}.hydrated{visibility:inherit}", Ea = {}, Wx = "http://www.w3.org/2000/svg", qx = "http://www.w3.org/1999/xhtml", Yx = (t) => t != null, lo = (t) => (t = typeof t, t === "object" || t === "function");
function tf(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const k = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], c = (f) => {
    for (let u = 0; u < f.length; u++)
      r = f[u], Array.isArray(r) ? c(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !lo(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? gi(null, r) : r), i = s);
  };
  if (c(n), e) {
    const f = e.className || e.class;
    f && (e.class = typeof f != "object" ? f : Object.keys(f).filter((u) => f[u]).join(" "));
  }
  const a = gi(t, null);
  return a.$attrs$ = e, o.length > 0 && (a.$children$ = o), a;
}, gi = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, Zx = {}, Xx = (t) => t && t.$tag$ === Zx, Qx = (t, e) => t != null && !lo(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, Jx = (t) => wn(t).$hostElement$, tw = (t, e, n) => {
  const r = it.ce(e, n);
  return t.dispatchEvent(r), r;
}, Ia = /* @__PURE__ */ new WeakMap(), ew = (t, e, n) => {
  let r = Tr.get(t);
  Sw && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Tr.set(t, r);
}, nw = (t, e, n, r) => {
  var s;
  let i = ef(e);
  const o = Tr.get(i);
  if (t = t.nodeType === 11 ? t : Dt, o)
    if (typeof o == "string") {
      t = t.head || t;
      let c = Ia.get(t), a;
      if (c || Ia.set(t, c = /* @__PURE__ */ new Set()), !c.has(i)) {
        {
          a = Dt.createElement("style"), a.innerHTML = o;
          const f = (s = it.$nonce$) !== null && s !== void 0 ? s : tf(Dt);
          f != null && a.setAttribute("nonce", f), t.insertBefore(a, t.querySelector("link"));
        }
        c && c.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, rw = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Vt("attachStyles", e.$tagName$), i = nw(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, ef = (t, e) => "sc-" + t.$tagName$, va = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = $a(t, e), c = e.toLowerCase();
    if (e === "class") {
      const a = t.classList, f = La(n), u = La(r);
      a.remove(...f.filter((l) => l && !u.includes(l))), a.add(...u.filter((l) => l && !f.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : $a(as, c) ? e = c.slice(2) : e = c[2] + e.slice(3), n && it.rel(t, e, n, !1), r && it.ael(t, e, r, !1);
    else {
      const a = lo(r);
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
}, sw = /\s/, La = (t) => t ? t.split(sw) : [], nf = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || Ea, o = e.$attrs$ || Ea;
  for (r in i)
    r in o || va(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    va(s, r, i[r], o[r], n, e.$flags$);
}, fo = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, c;
  if (s.$text$ !== null)
    o = s.$elm$ = Dt.createTextNode(s.$text$);
  else {
    if (ht || (ht = s.$tag$ === "svg"), o = s.$elm$ = Dt.createElementNS(ht ? Wx : qx, s.$tag$), ht && s.$tag$ === "foreignObject" && (ht = !1), nf(null, s, ht), Yx(Ir) && o["s-si"] !== Ir && o.classList.add(o["s-si"] = Ir), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        c = fo(t, s, i), c && o.appendChild(c);
    s.$tag$ === "svg" ? ht = !1 : o.tagName === "foreignObject" && (ht = !0);
  }
  return o;
}, rf = (t, e, n, r, s, i) => {
  let o = t, c;
  for (o.shadowRoot && o.tagName === Jl && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (c = fo(null, n, s), c && (r[s].$elm$ = c, o.insertBefore(c, e)));
}, sf = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, iw = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, c = e[0], a = e[o], f = r.length - 1, u = r[0], l = r[f], g;
  for (; s <= o && i <= f; )
    c == null ? c = e[++s] : a == null ? a = e[--o] : u == null ? u = r[++i] : l == null ? l = r[--f] : pr(c, u) ? (Ln(c, u), c = e[++s], u = r[++i]) : pr(a, l) ? (Ln(a, l), a = e[--o], l = r[--f]) : pr(c, l) ? (Ln(c, l), t.insertBefore(c.$elm$, a.$elm$.nextSibling), c = e[++s], l = r[--f]) : pr(a, u) ? (Ln(a, u), t.insertBefore(a.$elm$, c.$elm$), a = e[--o], u = r[++i]) : (g = fo(e && e[i], n, i), u = r[++i], g && c.$elm$.parentNode.insertBefore(g, c.$elm$));
  s > o ? rf(t, r[f + 1] == null ? null : r[f + 1].$elm$, n, r, i, f) : i > f && sf(e, s, o);
}, pr = (t, e) => t.$tag$ === e.$tag$, Ln = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (ht = i === "svg" ? !0 : i === "foreignObject" ? !1 : ht, nf(t, e, ht), r !== null && s !== null ? iw(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), rf(n, null, e, s, 0, s.length - 1)) : r !== null && sf(r, 0, r.length - 1), ht && i === "svg" && (ht = !1)) : t.$text$ !== o && (n.data = o);
}, ow = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || gi(null, null), s = Xx(e) ? e : k(null, null, e);
  Jl = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, Ir = n["s-sc"], Ln(r, s);
}, of = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, uo = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return of(t, t.$ancestorComponent$), Ew(() => cw(t, e));
}, cw = (t, e) => {
  const n = Vt("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), uw(s, () => aw(t, r, e));
}, aw = async (t, e, n) => {
  const r = t.$hostElement$, s = Vt("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && rw(t);
  const o = Vt("render", t.$cmpMeta$.$tagName$);
  lw(t, e), i && (i.map((c) => c()), r["s-rc"] = void 0), o(), s();
  {
    const c = r["s-p"], a = () => fw(t);
    c.length === 0 ? a() : (Promise.all(c).then(a), t.$flags$ |= 4, c.length = 0);
  }
}, lw = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, ow(t, e);
  } catch (r) {
    Un(r, t.$hostElement$);
  }
  return null;
}, fw = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Vt("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, af(n), r(), t.$onReadyResolve$(n), s || cf()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && go(() => uo(t, !1)), t.$flags$ &= -517;
}, cf = (t) => {
  af(Dt.documentElement), go(() => tw(as, "appload", { detail: { namespace: Rx } }));
}, uw = (t, e) => t && t.then ? t.then(e) : e(), af = (t) => t.classList.add("hydrated"), hw = (t, e) => wn(t).$instanceValues$.get(e), dw = (t, e, n, r) => {
  const s = wn(t), i = s.$instanceValues$.get(e), o = s.$flags$, c = s.$lazyInstance$;
  n = Qx(n, r.$members$[e][0]);
  const a = Number.isNaN(i) && Number.isNaN(n), f = n !== i && !a;
  (!(o & 8) || i === void 0) && f && (s.$instanceValues$.set(e, n), c && (o & 18) === 2 && uo(s, !1));
}, lf = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return hw(this, i);
        },
        set(c) {
          dw(this, i, c, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, c, a) {
        it.jmp(() => {
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
}, gw = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = mw(n), s.then) {
        const a = Kx();
        s = await s, a();
      }
      s.isProxied || (lf(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const c = Vt("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (a) {
        Un(a);
      }
      e.$flags$ &= -9, c();
    }
    if (s.style) {
      let c = s.style;
      const a = ef(n);
      if (!Tr.has(a)) {
        const f = Vt("registerStyles", n.$tagName$);
        ew(a, c, !!(n.$flags$ & 1)), f();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => uo(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, bw = (t) => {
  if (!(it.$flags$ & 1)) {
    const e = wn(t), n = e.$cmpMeta$, r = Vt("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            of(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), gw(t, e, n);
    }
    r();
  }
}, pw = (t) => {
  it.$flags$ & 1 || wn(t);
}, xw = (t, e = {}) => {
  var n;
  const r = Vt(), s = [], i = e.exclude || [], o = as.customElements, c = Dt.head, a = /* @__PURE__ */ c.querySelector("meta[charset]"), f = /* @__PURE__ */ Dt.createElement("style"), u = [];
  let l, g = !0;
  Object.assign(it, e), it.$resourcesUrl$ = new URL(e.resourcesUrl || "./", Dt.baseURI).href, t.map((d) => {
    d[1].map((p) => {
      const w = {
        $flags$: p[0],
        $tagName$: p[1],
        $members$: p[2],
        $listeners$: p[3]
      };
      w.$members$ = p[2];
      const E = w.$tagName$, $ = class extends HTMLElement {
        // StencilLazyHost
        constructor(M) {
          super(M), M = this, yw(M, w), w.$flags$ & 1 && M.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), g ? u.push(this) : it.jmp(() => bw(this));
        }
        disconnectedCallback() {
          it.jmp(() => pw(this));
        }
        componentOnReady() {
          return wn(this).$onReadyPromise$;
        }
      };
      w.$lazyBundleId$ = d[0], !i.includes(E) && !o.get(E) && (s.push(E), o.define(E, lf(
        $,
        w,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    f.innerHTML = s + Vx, f.setAttribute("data-styles", "");
    const d = (n = it.$nonce$) !== null && n !== void 0 ? n : tf(Dt);
    d != null && f.setAttribute("nonce", d), c.insertBefore(f, a ? a.nextSibling : c.firstChild);
  }
  g = !1, u.length ? u.map((d) => d.connectedCallback()) : it.jmp(() => l = setTimeout(cf, 30)), r();
}, ho = /* @__PURE__ */ new WeakMap(), wn = (t) => ho.get(t), ww = (t, e) => ho.set(e.$lazyInstance$ = t, e), yw = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], ho.set(t, n);
}, $a = (t, e) => e in t, Un = (t, e) => (0, console.error)(t, e), js = /* @__PURE__ */ new Map(), mw = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = js.get(s);
  if (i)
    return i[r];
  {
    const o = (c) => (js.set(s, c), c[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => R3).then(o, Un);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (js.set(s, o), o[r]), Un);
}, Tr = /* @__PURE__ */ new Map(), as = typeof window < "u" ? window : {}, Dt = as.document || { head: {} }, it = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, ff = (t) => Promise.resolve(t), Sw = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), Ma = [], uf = [], Aw = (t, e) => (n) => {
  t.push(n), di || (di = !0, it.$flags$ & 4 ? go(bi) : it.raf(bi));
}, Ba = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      Un(n);
    }
  t.length = 0;
}, bi = () => {
  Ba(Ma), Ba(uf), (di = Ma.length > 0) && it.raf(bi);
}, go = (t) => ff().then(t), Ew = /* @__PURE__ */ Aw(uf), Iw = () => ff(), hf = (t, e) => typeof window > "u" ? Promise.resolve() : Iw().then(() => xw([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var vw = Object.defineProperty, Lw = Object.defineProperties, $w = Object.getOwnPropertyDescriptors, Fr = Object.getOwnPropertySymbols, df = Object.prototype.hasOwnProperty, gf = Object.prototype.propertyIsEnumerable, _a = (t, e, n) => e in t ? vw(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, pi = (t, e) => {
  for (var n in e || (e = {})) df.call(e, n) && _a(t, n, e[n]);
  if (Fr) for (var n of Fr(e)) gf.call(e, n) && _a(t, n, e[n]);
  return t;
}, xi = (t, e) => Lw(t, $w(e)), Mw = (t, e) => {
  var n = {};
  for (var r in t) df.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Fr) for (var r of Fr(t)) e.indexOf(r) < 0 && gf.call(t, r) && (n[r] = t[r]);
  return n;
};
function bf() {
  return ss(Nt()) || window.StacksProvider || window.BlockstackProvider;
}
function Bw(t) {
  return t ? typeof t == "string" ? Ce.fromName(t) : "version" in t ? t : "url" in t ? new ni({ url: t.url }) : t.transactionVersion === kr.Mainnet ? new ni({ url: t.client.baseUrl }) : new ri({ url: t.client.baseUrl }) : new ri();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var _w = (t) => {
  if (!t) {
    let e = new Kr(["store_write"], document.location.href);
    t = new Hn({ appConfig: e });
  }
  return t;
}, Dw = async (t, e = bf()) => {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  let { redirectTo: n = "/", manifestPath: r, onFinish: s, onCancel: i, sendToSignIn: o = !1, userSession: c, appDetails: a } = t, f = _w(c);
  f.isUserSignedIn() && f.signUserOut();
  let u = f.generateAndStoreTransitKey(), l = f.makeAuthRequest(u, `${document.location.origin}${n}`, `${document.location.origin}${r}`, f.appConfig.scopes, void 0, void 0, { sendToSignIn: o, appDetails: a, connectVersion: "__VERSION__" });
  try {
    let g = await e.authenticationRequest(l);
    await f.handlePendingSignIn(g);
    let d = ot.decodeToken(g), p = d == null ? void 0 : d.payload;
    s == null || s({ authResponse: g, authResponsePayload: p, userSession: f });
  } catch (g) {
    console.error("[Connect] Error during auth request", g), i == null || i();
  }
}, Hw = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(Hw || {}), Nw = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(Nw || {}), pf = (t) => {
  let e = t;
  if (!e) {
    let n = new Kr(["store_write"], document.location.href);
    e = new Hn({ appConfig: n });
  }
  return e;
};
function Uw(t) {
  try {
    return pf(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Cw = (t) => {
  let e = pf(t).loadUserData().appPrivateKey, n = ot.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function xf(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? xi(pi({}, t), { message: ca(e), domain: ca(n) }) : xi(pi({}, t), { message: xt(dn(e)), domain: xt(dn(n)) });
}
async function Ow(t, e) {
  return new ot.TokenSigner("ES256k", e).signAsync(xf(t));
}
async function Pw(t) {
  let e = t, { userSession: n } = e, r = Mw(e, ["userSession"]);
  if (Uw(n)) {
    let { privateKey: s, publicKey: i } = Cw(n), o = xi(pi({}, r), { publicKey: i });
    return Ow(o, s);
  }
  return ot.createUnsecuredToken(xf(t));
}
var kw = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(kw || {}), wf = "asigna-stx", Da = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === wf && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(Tw(t, e), "*");
}), jw = { authenticationRequest: async (t) => Da(t, "authenticationRequest"), transactionRequest: async (t) => Da(t, "transactionRequest") }, Tw = (t, e) => ({ source: wf, [e]: t }), Fw = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = jw);
};
Fw();
var yf = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function zw(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = Nt(), o = bf();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    hf();
    let c = (s = n == null ? void 0 : n.defaultProviders) != null ? s : yf, a = fb(c), f = document.createElement("connect-modal");
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
var Gw = zw(Dw, !1), Rw = Ml;
function mf(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Cn(r);
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
    return BigInt(`0x${Af(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function bo(t, e = 8) {
  return (typeof t == "bigint" ? t : mf(t)).toString(16).padStart(e * 2, "0");
}
function Sf(t, e = 16) {
  const n = bo(t, e);
  return Cn(n);
}
function Kw(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const Vw = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Af(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Vw[n];
  return e;
}
function Cn(t) {
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
function Ww(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function qw(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Ha(t) {
  if (t.some(qw))
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
  return xo(...t.map((e) => typeof e == "number" ? Ha([e]) : e instanceof Array ? Ha(e) : e));
}
function ls(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var wi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(wi || (wi = {}));
wi.Mainnet;
const Yw = 128, Zw = 128, Ef = 16;
var yi;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(yi || (yi = {}));
var Na;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Na || (Na = {}));
var Ua;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Ua || (Ua = {}));
var At;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(At || (At = {}));
const Ts = ["onChainOnly", "offChainOnly", "any"];
Ts[0] + "", At.OnChainOnly, Ts[1] + "", At.OffChainOnly, Ts[2] + "", At.Any, At.OnChainOnly + "", At.OnChainOnly, At.OffChainOnly + "", At.OffChainOnly, At.Any + "", At.Any;
var mi;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(mi || (mi = {}));
mi.Mainnet;
var Ca;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Ca || (Ca = {}));
var Oa;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Oa || (Oa = {}));
var Pa;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Pa || (Pa = {}));
var ka;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(ka || (ka = {}));
var ja;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ja || (ja = {}));
var Ta;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ta || (Ta = {}));
var Fa;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Fa || (Fa = {}));
var za;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(za || (za = {}));
var Ga;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ga || (Ga = {}));
var Ra;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ra || (Ra = {}));
var Ka;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Ka || (Ka = {}));
function Si(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Xw(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function If(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Qw(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Si(t.outputLen), Si(t.blockLen);
}
function Jw(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function ty(t, e) {
  If(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Fs = {
  number: Si,
  bool: Xw,
  bytes: If,
  hash: Qw,
  exists: Jw,
  output: ty
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const zs = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Mt = (t, e) => t << 32 - e | t >>> e, ey = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!ey)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ny(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function vf(t) {
  if (typeof t == "string" && (t = ny(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class ry {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function ze(t) {
  const e = (r) => t().update(vf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function sy(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), a = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + a, o, r), t.setUint32(e + f, c, r);
}
class wo extends ry {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = zs(this.buffer);
  }
  update(e) {
    Fs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = vf(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const a = zs(e);
        for (; s <= i - o; o += s)
          this.process(a, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Fs.exists(this), Fs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    sy(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = zs(e), a = this.outputLen;
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
const iy = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Lf = Uint8Array.from({ length: 16 }, (t, e) => e), oy = Lf.map((t) => (9 * t + 5) % 16);
let yo = [Lf], mo = [oy];
for (let t = 0; t < 4; t++)
  for (let e of [yo, mo])
    e.push(e[t].map((n) => iy[n]));
const $f = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), cy = yo.map((t, e) => t.map((n) => $f[e][n])), ay = mo.map((t, e) => t.map((n) => $f[e][n])), ly = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), fy = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), xr = (t, e) => t << e | t >>> 32 - e;
function Va(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const wr = new Uint32Array(16);
class uy extends wo {
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
    for (let d = 0; d < 16; d++, n += 4)
      wr[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, a = c, f = this.h3 | 0, u = f, l = this.h4 | 0, g = l;
    for (let d = 0; d < 5; d++) {
      const p = 4 - d, w = ly[d], E = fy[d], $ = yo[d], M = mo[d], x = cy[d], L = ay[d];
      for (let S = 0; S < 16; S++) {
        const N = xr(r + Va(d, i, c, f) + wr[$[S]] + w, x[S]) + l | 0;
        r = l, l = f, f = xr(c, 10) | 0, c = i, i = N;
      }
      for (let S = 0; S < 16; S++) {
        const N = xr(s + Va(p, o, a, u) + wr[M[S]] + E, L[S]) + g | 0;
        s = g, g = u, u = xr(a, 10) | 0, a = o, o = N;
      }
    }
    this.set(this.h1 + c + u | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + a | 0);
  }
  roundClean() {
    wr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
ze(() => new uy());
const hy = (t, e, n) => t & e ^ ~t & n, dy = (t, e, n) => t & e ^ t & n ^ e & n, gy = new Uint32Array([
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
class Mf extends wo {
  constructor() {
    super(64, 32, 8, !1), this.A = be[0] | 0, this.B = be[1] | 0, this.C = be[2] | 0, this.D = be[3] | 0, this.E = be[4] | 0, this.F = be[5] | 0, this.G = be[6] | 0, this.H = be[7] | 0;
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
      pe[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = pe[l - 15], d = pe[l - 2], p = Mt(g, 7) ^ Mt(g, 18) ^ g >>> 3, w = Mt(d, 17) ^ Mt(d, 19) ^ d >>> 10;
      pe[l] = w + pe[l - 7] + p + pe[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: a, G: f, H: u } = this;
    for (let l = 0; l < 64; l++) {
      const g = Mt(c, 6) ^ Mt(c, 11) ^ Mt(c, 25), d = u + g + hy(c, a, f) + gy[l] + pe[l] | 0, w = (Mt(r, 2) ^ Mt(r, 13) ^ Mt(r, 22)) + dy(r, s, i) | 0;
      u = f, f = a, a = c, c = o + d | 0, o = i, i = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, f = f + this.G | 0, u = u + this.H | 0, this.set(r, s, i, o, c, a, f, u);
  }
  roundClean() {
    pe.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class by extends Mf {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
ze(() => new Mf());
ze(() => new by());
const yr = BigInt(2 ** 32 - 1), Ai = BigInt(32);
function Bf(t, e = !1) {
  return e ? { h: Number(t & yr), l: Number(t >> Ai & yr) } : { h: Number(t >> Ai & yr) | 0, l: Number(t & yr) | 0 };
}
function py(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Bf(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const xy = (t, e) => BigInt(t >>> 0) << Ai | BigInt(e >>> 0), wy = (t, e, n) => t >>> n, yy = (t, e, n) => t << 32 - n | e >>> n, my = (t, e, n) => t >>> n | e << 32 - n, Sy = (t, e, n) => t << 32 - n | e >>> n, Ay = (t, e, n) => t << 64 - n | e >>> n - 32, Ey = (t, e, n) => t >>> n - 32 | e << 64 - n, Iy = (t, e) => e, vy = (t, e) => t, Ly = (t, e, n) => t << n | e >>> 32 - n, $y = (t, e, n) => e << n | t >>> 32 - n, My = (t, e, n) => e << n - 32 | t >>> 64 - n, By = (t, e, n) => t << n - 32 | e >>> 64 - n;
function _y(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Dy = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Hy = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Ny = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Uy = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Cy = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Oy = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, G = {
  fromBig: Bf,
  split: py,
  toBig: xy,
  shrSH: wy,
  shrSL: yy,
  rotrSH: my,
  rotrSL: Sy,
  rotrBH: Ay,
  rotrBL: Ey,
  rotr32H: Iy,
  rotr32L: vy,
  rotlSH: Ly,
  rotlSL: $y,
  rotlBH: My,
  rotlBL: By,
  add: _y,
  add3L: Dy,
  add3H: Hy,
  add4L: Ny,
  add4H: Uy,
  add5H: Oy,
  add5L: Cy
}, [Py, ky] = G.split([
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
class fs extends wo {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: a, Eh: f, El: u, Fh: l, Fl: g, Gh: d, Gl: p, Hh: w, Hl: E } = this;
    return [e, n, r, s, i, o, c, a, f, u, l, g, d, p, w, E];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, a, f, u, l, g, d, p, w, E) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = a | 0, this.Eh = f | 0, this.El = u | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = d | 0, this.Gl = p | 0, this.Hh = w | 0, this.Hl = E | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      xe[x] = e.getUint32(n), we[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const L = xe[x - 15] | 0, S = we[x - 15] | 0, N = G.rotrSH(L, S, 1) ^ G.rotrSH(L, S, 8) ^ G.shrSH(L, S, 7), P = G.rotrSL(L, S, 1) ^ G.rotrSL(L, S, 8) ^ G.shrSL(L, S, 7), D = xe[x - 2] | 0, H = we[x - 2] | 0, b = G.rotrSH(D, H, 19) ^ G.rotrBH(D, H, 61) ^ G.shrSH(D, H, 6), A = G.rotrSL(D, H, 19) ^ G.rotrBL(D, H, 61) ^ G.shrSL(D, H, 6), _ = G.add4L(P, A, we[x - 7], we[x - 16]), O = G.add4H(_, N, b, xe[x - 7], xe[x - 16]);
      xe[x] = O | 0, we[x] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: a, Dh: f, Dl: u, Eh: l, El: g, Fh: d, Fl: p, Gh: w, Gl: E, Hh: $, Hl: M } = this;
    for (let x = 0; x < 80; x++) {
      const L = G.rotrSH(l, g, 14) ^ G.rotrSH(l, g, 18) ^ G.rotrBH(l, g, 41), S = G.rotrSL(l, g, 14) ^ G.rotrSL(l, g, 18) ^ G.rotrBL(l, g, 41), N = l & d ^ ~l & w, P = g & p ^ ~g & E, D = G.add5L(M, S, P, ky[x], we[x]), H = G.add5H(D, $, L, N, Py[x], xe[x]), b = D | 0, A = G.rotrSH(r, s, 28) ^ G.rotrBH(r, s, 34) ^ G.rotrBH(r, s, 39), _ = G.rotrSL(r, s, 28) ^ G.rotrBL(r, s, 34) ^ G.rotrBL(r, s, 39), O = r & i ^ r & c ^ i & c, R = s & o ^ s & a ^ o & a;
      $ = w | 0, M = E | 0, w = d | 0, E = p | 0, d = l | 0, p = g | 0, { h: l, l: g } = G.add(f | 0, u | 0, H | 0, b | 0), f = c | 0, u = a | 0, c = i | 0, a = o | 0, i = r | 0, o = s | 0;
      const C = G.add3L(b, _, R);
      r = G.add3H(C, H, A, O), s = C | 0;
    }
    ({ h: r, l: s } = G.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = G.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l: a } = G.add(this.Ch | 0, this.Cl | 0, c | 0, a | 0), { h: f, l: u } = G.add(this.Dh | 0, this.Dl | 0, f | 0, u | 0), { h: l, l: g } = G.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: d, l: p } = G.add(this.Fh | 0, this.Fl | 0, d | 0, p | 0), { h: w, l: E } = G.add(this.Gh | 0, this.Gl | 0, w | 0, E | 0), { h: $, l: M } = G.add(this.Hh | 0, this.Hl | 0, $ | 0, M | 0), this.set(r, s, i, o, c, a, f, u, l, g, d, p, w, E, $, M);
  }
  roundClean() {
    xe.fill(0), we.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class jy extends fs {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class Ty extends fs {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class Fy extends fs {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
ze(() => new fs());
ze(() => new jy());
ze(() => new Ty());
ze(() => new Fy());
function zy(t, e, n) {
  const s = Yw;
  if (s3(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: yi.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var J;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(J || (J = {}));
const Wa = BigInt("0xffffffffffffffffffffffffffffffff"), Gy = BigInt(0);
BigInt("0x7fffffffffffffffffffffffffffffff");
BigInt("-170141183460469231731687303715884105728");
const qa = (t) => {
  const e = mf(t);
  if (e < Gy)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Wa)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Wa}`);
  return { type: J.UInt, value: e };
};
function Ya(t) {
  for (const e in t)
    if (!i3(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: J.Tuple, data: t };
}
const Ze = (t) => ({ type: J.StringASCII, data: t });
class Ry extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Ky extends Ry {
  constructor(e) {
    super(e);
  }
}
function _f(t) {
  const e = [];
  return e.push(Cn(bo(t.version, 1))), e.push(Cn(t.hash160)), yn(e);
}
function Df(t) {
  const e = [], n = po(t.content), r = n.byteLength;
  return e.push(Cn(bo(r, t.lengthPrefixBytes))), e.push(n), yn(e);
}
function Ot(t, e) {
  return yn([t, e]);
}
function Vy(t) {
  return new Uint8Array([t.type]);
}
function Wy(t) {
  return t.type === J.OptionalNone ? new Uint8Array([t.type]) : Ot(t.type, zn(t.value));
}
function qy(t) {
  const e = new Uint8Array(4);
  return ls(e, t.buffer.length, 0), Ot(t.type, xo(e, t.buffer));
}
function Yy(t) {
  const e = Sf(Kw(t.value, BigInt(Zw)), Ef);
  return Ot(t.type, e);
}
function Zy(t) {
  const e = Sf(t.value, Ef);
  return Ot(t.type, e);
}
function Xy(t) {
  return Ot(t.type, _f(t.address));
}
function Qy(t) {
  return Ot(t.type, xo(_f(t.address), Df(t.contractName)));
}
function Jy(t) {
  return Ot(t.type, zn(t.value));
}
function t3(t) {
  const e = [], n = new Uint8Array(4);
  ls(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = zn(r);
    e.push(s);
  }
  return Ot(t.type, yn(e));
}
function e3(t) {
  const e = [], n = new Uint8Array(4);
  ls(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = zy(s);
    e.push(Df(i));
    const o = zn(t.data[s]);
    e.push(o);
  }
  return Ot(t.type, yn(e));
}
function Hf(t, e) {
  const n = [], r = e == "ascii" ? Ww(t.data) : po(t.data), s = new Uint8Array(4);
  return ls(s, r.length, 0), n.push(s), n.push(r), Ot(t.type, yn(n));
}
function n3(t) {
  return Hf(t, "ascii");
}
function r3(t) {
  return Hf(t, "utf8");
}
function zn(t) {
  switch (t.type) {
    case J.BoolTrue:
    case J.BoolFalse:
      return Vy(t);
    case J.OptionalNone:
    case J.OptionalSome:
      return Wy(t);
    case J.Buffer:
      return qy(t);
    case J.UInt:
      return Zy(t);
    case J.Int:
      return Yy(t);
    case J.PrincipalStandard:
      return Xy(t);
    case J.PrincipalContract:
      return Qy(t);
    case J.ResponseOk:
    case J.ResponseErr:
      return Jy(t);
    case J.List:
      return t3(t);
    case J.Tuple:
      return e3(t);
    case J.StringASCII:
      return n3(t);
    case J.StringUTF8:
      return r3(t);
    default:
      throw new Ky("Unable to serialize. Invalid Clarity Value.");
  }
}
const s3 = (t, e) => t ? po(t).length > e : !1;
function i3(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function o3(t) {
  const e = zn(t);
  return `0x${Af(e)}`;
}
const en = (t) => {
  try {
    return ns.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
}, c3 = ["store_write"], Za = "/manifest.json", a3 = /* @__PURE__ */ new Set([4001, -31001]), l3 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], So = (t) => typeof t == "string" && t.toLowerCase().includes("leather"), Gn = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), mn = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, nn = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, Nf = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Ao = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => Nf(i, r)) === s
  );
}, Uf = (t) => t ? Ao(mn()).some(
  (e) => {
    var n;
    return e.id === t && (Gn(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Cf = () => {
  if (typeof window > "u")
    return;
  const t = mn(), e = Ao(t).filter(
    (n) => {
      var r;
      return Gn(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = nn(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of l3) {
    const r = nn(t, n) ?? (t === window ? void 0 : nn(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, Of = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = mn(), n = nn(e, t) ?? (e === window ? void 0 : nn(window, t)) ?? ss(t);
  if (n)
    return n;
  if (Gn(t) || Uf(t))
    return Cf();
}, f3 = (t) => {
  const e = mn();
  if (!e)
    return [];
  const n = Ao(e), r = t.filter(
    (s) => !n.some((i) => Nf(i, s)) && !!nn(e, s.id)
  );
  return n.concat(r);
}, Wt = () => ({ isConnected: !1 }), u3 = ["blockstack-session", "blockstack"], Pf = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of u3) {
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
Pf();
const h3 = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Je = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, Ei = (t, e = "mainnet") => {
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
      return Ei(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Ei(r, e);
  }
  return e;
}, Ii = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return en(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = Ii(s, e + 1);
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
    const i = Ii(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && en(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && en(n.testnet) ? n.testnet.trim() : null;
}, Xa = (t) => {
  const e = Je(t);
  if (!e)
    return null;
  const n = h3(e);
  return /^[0-9a-f]{66}$/i.test(n) ? n : null;
}, vi = (t, e, n = 0) => {
  if (n > 8 || !t)
    return null;
  if (Array.isArray(t)) {
    for (const o of t) {
      const c = vi(o, e, n + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return e ? null : Xa(t);
  const r = t, s = [r.address, r.stxAddress, r.selectedAddress].map((o) => Je(o)).find((o) => o && en(o)), i = [r.publicKey, r.public_key, r.stxPublicKey].map((o) => Xa(o)).find(Boolean);
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
    const c = vi(r[o], e, n + 1);
    if (c)
      return c;
  }
  return null;
}, d3 = (t) => {
  var i;
  const e = t.profile ?? {}, n = typeof e.stxAddress == "string" ? e.stxAddress : typeof ((i = e.stxAddress) == null ? void 0 : i.mainnet) == "string" ? e.stxAddress.mainnet : t.identityAddress, r = typeof n == "string" && en(n) ? n.trim() : null;
  if (!r)
    return Wt();
  const s = Mi(r);
  return s !== "mainnet" ? Wt() : {
    isConnected: !0,
    address: r,
    network: s
  };
}, g3 = (t, e = "mainnet") => {
  const n = Ii(t);
  if (!n)
    return Wt();
  const r = Mi(n) ?? Ei(t, e);
  if (r !== "mainnet")
    return Wt();
  const s = vi(t, n);
  return {
    isConnected: !0,
    address: n,
    network: r,
    ...s ? { publicKey: s } : {}
  };
}, Eo = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Io = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && a3.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, zr = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Je(n == null ? void 0 : n.message) ?? Je(e.message) ?? Je(e.error) ?? Je(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, kf = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw zr(e);
    if (e.status === "error")
      throw zr(e.result ?? e);
  }
  return t;
}, vo = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return kf(r);
  } catch (r) {
    throw zr(r);
  }
}, jf = () => Cf(), Gr = (t) => {
  var r, s;
  const e = Nt();
  if (Gn(e) || Uf(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = mn() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === jf();
}, Qa = async (t, e, n) => {
  if (!Gr(t))
    return vo(t, e, n);
  const r = jf();
  if (!r)
    throw Object.assign(new Error("Xverse modern request provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  try {
    return kf(await r.request(e, n));
  } catch (s) {
    throw zr(s);
  }
}, b3 = (t) => {
}, Tf = (t, e = 0) => {
  if (e > 5 || t === null || typeof t > "u")
    return [];
  if (Array.isArray(t))
    return [...new Set(t.filter((r) => typeof r == "string"))];
  if (typeof t != "object")
    return [];
  const n = t;
  for (const r of ["supportedMethods", "methods", "result", "data"])
    if (r in n) {
      const s = Tf(n[r], e + 1);
      if (s.length > 0)
        return s;
    }
  return [];
}, p3 = [
  "wallet_connect",
  "stx_requestAccounts",
  "connect",
  "getAddresses",
  "stx_getAddresses",
  "stx_getAccounts",
  "getAccounts",
  "wallet_getAccount",
  "requestAccounts"
], x3 = async (t) => {
  const e = Nt();
  if (Gr(t))
    return ["wallet_connect", "stx_getAccounts", "wallet_getAccount"];
  if (!So(e))
    return p3;
  const n = [
    "getAddresses",
    "stx_getAccounts",
    "stx_getAddresses",
    "stx_requestAccounts",
    "wallet_connect"
  ];
  try {
    const r = Tf(await vo(t, "supportedMethods"));
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
}, w3 = async (t) => {
  if (Gr(t))
    try {
      await Qa(t, "wallet_disconnect");
    } catch {
    }
  const e = await x3(t);
  let n = null;
  for (const r of e)
    try {
      console.info("[wallet:connect]", { stage: "REQUEST", method: r });
      const s = await Qa(t, r), i = g3(s);
      if (i.isConnected)
        return console.info("[wallet:connect]", {
          stage: "CONNECTED",
          method: r,
          hasPublicKey: !!i.publicKey
        }), Gr(t) && b3(i.address), i;
      console.info("[wallet:connect]", { stage: "EMPTY_RESPONSE", method: r });
    } catch (s) {
      n = s;
      const i = Eo(s);
      if ((i ? console.info : console.warn)("[wallet:connect]", {
        stage: "REQUEST_ERROR",
        method: r,
        code: s && typeof s == "object" && "code" in s ? s.code : void 0,
        message: s instanceof Error ? s.message : String(s)
      }), Io(s))
        return Wt();
      if (i)
        continue;
      throw s;
    }
  if (n)
    throw n;
  return Wt();
}, y3 = async (t, e) => {
  const n = new Kr(c3, void 0, "", Za), r = new Hn({ appConfig: n });
  return new Promise((s) => {
    Gw(
      {
        appDetails: {
          name: t.appName,
          icon: t.appIcon
        },
        manifestPath: Za,
        userSession: r,
        onFinish: (i) => {
          s(d3(i.userSession.loadUserData()));
        },
        onCancel: () => {
          s(Wt());
        }
      },
      e
    );
  });
}, m3 = (t, e = !0) => {
  if (t && typeof t != "string")
    return t;
  const n = typeof t == "string" ? t : Nt(), r = Of(n);
  return r ? (e && n && $l(n), r) : null;
}, S3 = (t) => {
  if (typeof window > "u" || typeof document > "u")
    return Promise.resolve(null);
  const e = (t == null ? void 0 : t.persistSelection) ?? !0;
  return hf(), new Promise((n) => {
    const r = document.createElement("connect-modal"), s = yf, i = f3(s), o = document.body.style.overflow, c = () => {
      document.body.style.overflow = o, document.removeEventListener("keydown", a), r.remove();
    }, a = (f) => {
      f.key === "Escape" && (c(), n(null));
    };
    r.defaultProviders = s, r.installedProviders = i, r.persistSelection = e, r.callback = (f) => {
      const u = m3(f, e);
      console.info("[wallet:connect]", {
        stage: "PROVIDER_SELECTED",
        providerId: typeof f == "string" ? f : Nt() ?? "provider-object",
        resolved: !!u,
        requestBridge: typeof (u == null ? void 0 : u.request) == "function"
      }), c(), n(u);
    }, r.cancelCallback = () => {
      c(), n(null);
    }, document.body.style.overflow = "hidden", document.addEventListener("keydown", a), document.body.appendChild(r);
  });
}, A3 = () => Nt(), Ff = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = Nt(), e = t ? Of(t) : void 0;
  if (e)
    return e;
  const n = mn() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, E3 = async (t) => {
  Pf();
  const e = await S3({});
  if (!e)
    return Wt();
  if (typeof e.request == "function")
    try {
      const n = await w3(e);
      if (n.isConnected)
        return n;
    } catch (n) {
      if (Io(n))
        return Wt();
      if (!Eo(n))
        throw n;
    }
  return y3(t, e);
}, I3 = () => {
  const t = Nt();
  return So(t) ? "leather" : Gn(t) ? "xverse" : t ? String(t) : void 0;
}, v3 = async (t) => {
  const e = Ih("wallet_connect");
  vn({ journey: e, step: "open", outcome: "start" });
  try {
    const n = await E3(t);
    return n.isConnected && n.address ? (Bi(n.address, I3()), _i(n.network), vn({ journey: e, step: "authorize", outcome: "success" })) : vn({ journey: e, step: "authorize", outcome: "abandon" }), n;
  } catch (n) {
    throw vn({
      journey: e,
      step: "authorize",
      outcome: "error",
      errorCode: yh(n),
      error: n
    }), n;
  }
}, L3 = async () => {
  const t = Ff();
  if (t && So(Nt()))
    for (const e of ["stx_disconnect", "wallet_disconnect", "disconnect", "deactivate"])
      try {
        await vo(t, e);
        break;
      } catch (n) {
        if (Io(n) || Eo(n))
          continue;
      }
  Rw(), Ml(), Bi(null), _i(null), vn({ flow: "wallet_connect", step: "disconnect", outcome: "info" });
}, $3 = (t) => {
  const e = gh(), n = () => {
    e.clear();
  }, r = () => {
    const o = e.load();
    return o.isConnected && o.address && (Bi(o.address), _i(o.network)), o;
  };
  return {
    connect: async () => {
      const o = r(), c = await v3({
        appName: t.appName,
        appIcon: t.appIcon
      });
      return c.isConnected ? (e.save(c), c) : o.isConnected ? o : c;
    },
    disconnect: async () => {
      await L3(), n();
    },
    getSession: r
  };
}, Ja = (t) => o3(t).replace(/^0x/, ""), t0 = "This wallet cannot sign messages. Try Xverse or Leather.", e0 = (t) => typeof (t == null ? void 0 : t.request) == "function", n0 = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", M3 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, B3 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function _3(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: Ja(e.message),
    domain: Ja(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function D3(t, e) {
  const n = await Pw({
    domain: e.domain,
    message: e.message,
    network: Bw(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function H3(t) {
  var s, i;
  const e = A3() || "", n = /xverse/i.test(e);
  let r = Ff();
  if (n && !n0(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (n0(r))
    try {
      return await D3(r, t);
    } catch (o) {
      if (n || !e0(r) || !B3(o)) throw o;
    }
  if (!n && e0(r))
    try {
      return await _3(r, t);
    } catch (o) {
      throw M3(o) ? new Error(t0) : o;
    }
  throw new Error(t0);
}
const N3 = "xtrata.xyz/bounty", U3 = "Link an X handle to a bounty entry; no spending permission", C3 = (t) => {
  if (typeof t != "string") return null;
  const e = t.trim().replace(/^https?:\/\/(?:www\.)?(?:x|twitter)\.com\//i, "").replace(/[/?#].*$/, "");
  if (e === "" || e === "@") return "";
  const n = e.replace(/^@/, "");
  return /^[A-Za-z0-9_]{1,15}$/.test(n) ? "@" + n : null;
}, O3 = (t) => typeof t == "string" && /^SP[0-9A-Z]{30,}$/.test(t) && en(t), P3 = (t) => ({
  domain: Ya({
    name: Ze(N3),
    version: Ze("1"),
    "chain-id": qa(1)
  }),
  message: Ya({
    purpose: Ze(U3),
    campaign: Ze(t.campaign),
    address: Ze(t.address),
    // An empty handle is how a wallet removes its own link.
    handle: Ze(t.handle),
    issued: qa(t.issued)
  })
}), Li = $3({ appName: "Xtrata Bounty Tracker", appIcon: "/favicon.svg" });
let $i;
const _n = () => {
  const t = Li.getSession();
  return t.isConnected && O3(t.address) ? t.address : "";
}, On = () => {
  const t = _n();
  t !== ($i ?? "") && ($i = t, window.dispatchEvent(new CustomEvent("xtrata:wallet-changed", { detail: { address: t } })));
}, k3 = {
  address: _n,
  async connect() {
    await Li.connect(), On();
    const t = _n();
    if (!t) throw new Error("Connect a Stacks mainnet account to continue.");
    return t;
  },
  async disconnect() {
    await Li.disconnect(), On();
  },
  /** Ask the connected wallet to sign "handle is mine" for this campaign. Nothing is sent anywhere. */
  async signHandle(t, e) {
    const n = _n();
    if (!n) throw new Error("Connect your wallet first.");
    const r = C3(e);
    if (r === null) throw new Error("That is not a valid X handle. Use 1 to 15 letters, numbers or underscores.");
    const s = Date.now(), o = await H3({ ...P3({ campaign: t, address: n, handle: r, issued: s }), network: "mainnet", stxAddress: n });
    return { campaign: t, address: n, handle: r, issued: s, signature: o };
  }
};
window.XtrataBountyWallet = k3;
$i = _n();
window.addEventListener("focus", On);
window.addEventListener("storage", (t) => {
  (t.key === null || t.key === "xtrata.v15.1.wallet.session") && On();
});
window.dispatchEvent(new CustomEvent("xtrata:wallet-ready"));
On();
const j3 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", T3 = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, F3 = () => T3() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, z3 = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, G3 = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', zf = class {
  constructor(t) {
    ww(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && $l(t), this.callback(ss(t));
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
    var r, s, i, o, c, a, f, u, l, g;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (o = (i = t.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (a = (c = t.mozillaAddOnsUrl) !== null && c !== void 0 ? c : this.getMobileUrl(t)) !== null && a !== void 0 ? a : t.webUrl : n === "Android" ? (u = (f = t.googlePlayStoreUrl) !== null && f !== void 0 ? f : this.getBrowserUrl(t)) !== null && u !== void 0 ? u : t.webUrl : (g = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && g !== void 0 ? g : this.getMobileUrl(t);
  }
  render() {
    const t = F3(), e = z3(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return k("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, k("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), k("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, k("div", { class: "flex flex-col space-y-[10px]" }, k("div", { class: "flex items-center" }, k("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), k("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, k("span", { class: "sr-only" }, "Close popup"), k("img", { src: j3 }))), r ? k("p", null, "Select the wallet you want to connect to.") : k("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && k("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && k("div", { class: "mt-6" }, k("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), k("ul", { class: "space-y-3" }, this.installedProviders.map((i) => k("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, k("div", { class: "aspect-square basis-9 overflow-hidden" }, k("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), k("div", { class: "flex-1" }, k("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && k("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), k("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && k("div", { class: "mt-6" }, r ? k("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : k("div", { class: "mb-5 flex justify-between" }, k("p", { class: "text-sm font-medium" }, "Recommended wallets"), k("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, k("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, k("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), k("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), k("p", null, "What is a wallet? ", k("span", { class: "align-text-bottom text-[9px]" }, "↗")))), k("ul", { class: "space-y-3" }, n.map((i) => k("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, k("div", { class: "aspect-square basis-9 overflow-hidden" }, k("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), k("div", { class: "flex-1" }, k("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && k("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && k("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return Jx(this);
  }
};
zf.style = G3;
const R3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: zf
}, Symbol.toStringTag, { value: "Module" }));
