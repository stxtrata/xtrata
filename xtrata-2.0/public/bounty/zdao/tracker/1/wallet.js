var Sh = Object.defineProperty;
var Ah = (t, e, n) => e in t ? Sh(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var xs = (t, e, n) => Ah(t, typeof e != "symbol" ? e + "" : e, n);
const Eh = ["SP", "SM"], vh = ["ST", "SN"], wi = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return Eh.includes(n) ? "mainnet" : vh.includes(n) ? "testnet" : null;
}, Ih = () => {
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
}, Lh = () => typeof window > "u" || !window.localStorage ? Ih() : window.localStorage, ws = "xtrata.v15.1.wallet.session", Oo = "mainnet", mr = { isConnected: !1 }, $h = (t) => t.address ? wi(t.address) ?? t.network : t.network, La = (t) => !t.isConnected || !t.address ? { ...mr } : $h(t) !== Oo ? { ...mr } : {
  isConnected: !0,
  address: t.address,
  network: Oo,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, Mh = (t) => {
  if (!t)
    return { ...mr };
  try {
    const e = JSON.parse(t);
    return La(e);
  } catch {
    return { ...mr };
  }
}, _h = (t) => {
  const e = La(t);
  return JSON.stringify(e);
}, Bh = (t) => {
  const e = Lh();
  return {
    load: () => Mh(e.getItem(ws)),
    save: (n) => {
      e.setItem(ws, _h(n));
    },
    clear: () => {
      e.removeItem(ws);
    }
  };
};
function Dh(t) {
  return (t || "").replace(/0x[0-9a-fA-F]{6,}/g, "0x…").replace(/\bS[PT][0-9A-Z]{20,}\b/g, "<addr>").replace(/\b[0-9a-fA-F]{64}\b/g, "<hash>").replace(/\b\d[\d,]*(\.\d+)?\b/g, "<n>").replace(/\s+/g, " ").trim().slice(0, 200);
}
function Hh(t, e, n, r) {
  const s = `${t}|${e ?? ""}|${n ?? ""}|${Dh(r)}`;
  let i = 2166136261, o = 522970236;
  for (let a = 0; a < s.length; a += 1) {
    const f = s.charCodeAt(a);
    i = Math.imul(i ^ f, 16777619), o = Math.imul(o ^ (f << 5 | f >>> 3), 16777619);
  }
  const c = (a) => (a >>> 0).toString(16).padStart(8, "0");
  return (c(i) + c(o)).slice(0, 16);
}
function $a(t) {
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
function Uh(t) {
  return t instanceof Error ? t.stack ?? void 0 : void 0;
}
const ys = (t) => {
  if (typeof t == "number" || typeof t == "boolean") return t;
  if (typeof t == "string" && t.length > 0) return t.slice(0, 300);
};
function Nh(t) {
  if (!t || typeof t != "object") return;
  const e = t, n = {};
  for (const s of ["code", "stage", "method", "providerId", "name"]) {
    const i = ys(e[s]);
    i !== void 0 && (n[s] = i);
  }
  const r = e.data;
  if (r && typeof r == "object") {
    const s = {};
    for (const i of ["code", "message", "reason"]) {
      const o = ys(r[i]);
      o !== void 0 && (s[i] = o);
    }
    Object.keys(s).length > 0 && (n.data = s);
  } else {
    const s = ys(r);
    s !== void 0 && (n.data = s);
  }
  return Object.keys(n).length > 0 ? n : void 0;
}
function Ch(t, e) {
  const n = (t == null ? void 0 : t.name) ?? "", r = t == null ? void 0 : t.code, s = $a(t).toLowerCase();
  return r === -32603 || s.trim() === "internal error." ? "WALLET_RPC_INTERNAL" : n === "ReadOnlyBackoffError" || s.includes("read-only") && s.includes("backoff") ? "READ_ONLY_BACKOFF" : typeof navigator < "u" && navigator.onLine === !1 ? "NETWORK_OFFLINE" : s.includes("user rejected") || s.includes("user denied") || s.includes("user canceled") || s.includes("user cancelled") || s.includes("rejected the request") || s.includes("request rejected") ? "WALLET_REJECTED" : s.includes("no wallet") || s.includes("provider not found") || s.includes("not installed") ? "WALLET_NOT_FOUND" : s.includes("locked") ? "WALLET_LOCKED" : s.includes("session") && s.includes("expire") ? "SESSION_EXPIRED" : s.includes("insufficient") && s.includes("fee") ? "INSUFFICIENT_FEE" : s.includes("insufficient") || s.includes("not enough") ? "INSUFFICIENT_FUNDS" : s.includes("nonce") ? "NONCE_MISMATCH" : s.includes("postcondition") || s.includes("post-condition") || s.includes("post condition") ? "POST_CONDITION_FAILED" : s.includes("abort") || s.includes("runtime error") ? "CONTRACT_ABORT" : s.includes("429") || s.includes("rate limit") || s.includes("too many requests") ? "HIRO_RATE_LIMIT" : s.includes("broadcast") ? "BROADCAST_FAILED" : s.includes("timeout") || s.includes("timed out") ? "CONFIRM_TIMEOUT" : s.includes("upload") ? "UPLOAD_FAILED" : "UNCAUGHT";
}
const Oh = typeof __XTRATA_APP_VERSION__ < "u" ? __XTRATA_APP_VERSION__ : "dev", jh = 20, jo = "xt_tel_sid";
function Sr() {
  try {
    if (typeof crypto < "u" && typeof crypto.randomUUID == "function")
      return crypto.randomUUID();
  } catch {
  }
  return `xt-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}
let ms = null;
function Th() {
  try {
    if (typeof sessionStorage < "u") {
      let t = sessionStorage.getItem(jo);
      return t || (t = Sr(), sessionStorage.setItem(jo, t)), t;
    }
  } catch {
  }
  return ms || (ms = Sr()), ms;
}
let Ye = {
  address: null,
  kind: null
}, Ma = null;
function yi(t, e) {
  if (!t) {
    Ye = { address: null, kind: e ?? Ye.kind };
    return;
  }
  Ye = { address: t.trim(), kind: e ?? Ye.kind };
}
function mi(t) {
  Ma = typeof t == "string" && t.length > 0 ? t : null;
}
const To = [];
class kh {
  constructor(e, n) {
    xs(this, "id", Sr());
    xs(this, "n", 0);
    this.flow = e, this.target = n;
  }
  attempt() {
    return this.n += 1, this.n;
  }
}
function Ph(t, e) {
  return new kh(t, e);
}
function Sn(t) {
  try {
    const e = t.journey, n = t.flow ?? (e == null ? void 0 : e.flow) ?? "app", r = t.outcome === "error", s = t.error != null ? $a(t.error) : void 0, i = t.error != null ? Uh(t.error) : void 0, o = r ? Hh(n, t.step, t.errorCode, s ?? "") : void 0, c = r ? Nh(t.error) : void 0, a = {
      ...c ? { error: c } : {},
      ...t.context ?? {}
    };
    r && To.length && (a.breadcrumbs = To.slice(-jh));
    const f = {
      eventId: Sr(),
      ts: Date.now(),
      sessionId: Th(),
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
      appVersion: Oh,
      route: t.route ?? (typeof location < "u" ? location.pathname : ""),
      walletAddress: Ye.address,
      walletKind: Ye.kind,
      network: Ma,
      context: Object.keys(a).length ? a : void 0
    };
  } catch {
  }
}
const Fh = "https://browser.blockstack.org/auth", zh = {
  "@type": "Person",
  "@context": "http://schema.org"
}, _a = ["store_write"], Rh = "blockstack-session", Gh = {
  logLevel: "debug"
}, Ue = {
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
Object.freeze(Ue);
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
class Kh extends hn {
  constructor(e, n = "") {
    super({ code: Ue.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class ko extends hn {
  constructor(e = "") {
    super({ code: Ue.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Vn extends hn {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Ue.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Po extends hn {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Ue.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Os extends hn {
  constructor(e) {
    super({ code: Ue.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class Ba extends hn {
  constructor(e) {
    super({ code: Ue.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Fo = ["debug", "info", "warn", "error", "none"], js = {};
for (let t = 0; t < Fo.length; t++) {
  const e = Fo[t];
  js[e] = t;
}
class qe {
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
    return js[Gh.logLevel] <= js[e];
  }
}
function Vh() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Wh() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Ss(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function Yh() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function qh() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Zh(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function Si(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = qh(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    qe.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = Zh(s, t.toString(), n);
    throw qe.error(i), new Error(i);
  }
  if (r)
    return {};
}
function Qh(t) {
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
  if (ru(t, Uint8Array))
    return BigInt(`0x${pt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Xh(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Ai(t, e = 8) {
  return (typeof t == "bigint" ? t : Qh(t)).toString(16).padStart(e * 2, "0");
}
function Da(t, e = 16) {
  const n = Ai(t, e);
  return ut(n);
}
function Jh(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const tu = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function pt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += tu[n];
  return e;
}
function ut(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Xh(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function Un(t) {
  return new TextEncoder().encode(t);
}
function Ha(t) {
  return new TextDecoder().decode(t);
}
function eu(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function nu(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function zo(t) {
  if (t.some(nu))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Ft(...t) {
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
function un(t) {
  return Ft(...t.map((e) => typeof e == "number" ? zo([e]) : e instanceof Array ? zo(e) : e));
}
function ru(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const su = "https://api.mainnet.hiro.so", iu = "https://api.testnet.hiro.so", ou = "http://localhost:3999", cu = "https://hub.blockstack.org";
function au(t) {
  const e = typeof t == "string" ? ut(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function kr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const lu = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function fu(t, e) {
  const n = {};
  return Object.assign(n, lu, e), await fetch(t, n);
}
function hu(t) {
  let e = fu, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function uu(...t) {
  const { fetchLib: e, middlewares: n } = hu(t);
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
class Pr {
  constructor(e = _a.slice(), n = ((c) => (c = Si("location", { returnEmptyObject: !0 })) == null ? void 0 : c.origin)(), r = "", s = "/manifest.json", i = void 0, o = Fh) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Ts(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function du(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Ua(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function gu(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ts(t.outputLen), Ts(t.blockLen);
}
function bu(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function pu(t, e) {
  Ua(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ie = {
  number: Ts,
  bool: du,
  bytes: Ua,
  hash: gu,
  exists: bu,
  output: pu
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const As = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), At = (t, e) => t << 32 - e | t >>> e, xu = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!xu)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function wu(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Ei(t) {
  if (typeof t == "string" && (t = wu(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Na = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ne(t) {
  const e = (r) => t().update(Ei(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Ca = class extends Na {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ie.hash(e);
    const r = Ei(n);
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
    return Ie.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Ie.exists(this), Ie.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Fr = (t, e, n) => new Ca(t, e).update(n).digest();
Fr.create = (t, e) => new Ca(t, e);
function yu(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), a = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + a, o, r), t.setUint32(e + f, c, r);
}
let vi = class extends Na {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = As(this.buffer);
  }
  update(e) {
    Ie.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Ei(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const a = As(e);
        for (; s <= i - o; o += s)
          this.process(a, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ie.exists(this), Ie.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    yu(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = As(e), a = this.outputLen;
    if (a % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = a / 4, h = this.get();
    if (f > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      c.setUint32(4 * l, h[l], i);
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
const mu = (t, e, n) => t & e ^ ~t & n, Su = (t, e, n) => t & e ^ t & n ^ e & n, Au = new Uint32Array([
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
]), Wt = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Yt = new Uint32Array(64);
let Oa = class extends vi {
  constructor() {
    super(64, 32, 8, !1), this.A = Wt[0] | 0, this.B = Wt[1] | 0, this.C = Wt[2] | 0, this.D = Wt[3] | 0, this.E = Wt[4] | 0, this.F = Wt[5] | 0, this.G = Wt[6] | 0, this.H = Wt[7] | 0;
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
      Yt[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Yt[l - 15], d = Yt[l - 2], p = At(g, 7) ^ At(g, 18) ^ g >>> 3, w = At(d, 17) ^ At(d, 19) ^ d >>> 10;
      Yt[l] = w + Yt[l - 7] + p + Yt[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: a, G: f, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const g = At(c, 6) ^ At(c, 11) ^ At(c, 25), d = h + g + mu(c, a, f) + Au[l] + Yt[l] | 0, w = (At(r, 2) ^ At(r, 13) ^ At(r, 22)) + Su(r, s, i) | 0;
      h = f, f = a, a = c, c = o + d | 0, o = i, i = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, f = f + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, c, a, f, h);
  }
  roundClean() {
    Yt.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Eu = class extends Oa {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const tn = Ne(() => new Oa());
Ne(() => new Eu());
const vu = {}, ja = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: vu
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const K = BigInt(0), X = BigInt(1), we = BigInt(2), En = BigInt(3), Ro = BigInt(8), Y = Object.freeze({
  a: K,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: X,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Go = (t, e) => (t + e / we) / e, Wn = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = Y, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -X * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), c = Go(i * t, e), a = Go(-r * t, e);
    let f = _(t - c * n - a * s, e), h = _(-c * r - a * i, e);
    const l = f > o, g = h > o;
    if (l && (f = e - f), g && (h = e - h), f > o || h > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: f, k2neg: g, k2: h };
  }
}, St = 32, $e = 32, Ta = 32, Ar = St + 1, Er = 2 * St + 1;
function Ko(t) {
  const { a: e, b: n } = Y, r = _(t * t), s = _(r * t);
  return _(s + e * t + n);
}
const Yn = Y.a === K;
class Ii extends Error {
  constructor(e) {
    super(e);
  }
}
function Vo(t) {
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
    return e.equals(V.ZERO) ? W.ZERO : new W(e.x, e.y, X);
  }
  static toAffineBatch(e) {
    const n = _u(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return W.toAffineBatch(e).map(W.fromAffine);
  }
  equals(e) {
    Vo(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: c } = e, a = _(s * s), f = _(c * c), h = _(n * f), l = _(i * a), g = _(_(r * c) * f), d = _(_(o * s) * a);
    return h === l && g === d;
  }
  negate() {
    return new W(this.x, _(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = _(e * e), i = _(n * n), o = _(i * i), c = e + i, a = _(we * (_(c * c) - s - o)), f = _(En * s), h = _(f * f), l = _(h - we * a), g = _(f * (a - l) - Ro * o), d = _(we * n * r);
    return new W(l, g, d);
  }
  add(e) {
    Vo(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: c } = e;
    if (i === K || o === K)
      return this;
    if (n === K || r === K)
      return e;
    const a = _(s * s), f = _(c * c), h = _(n * f), l = _(i * a), g = _(_(r * c) * f), d = _(_(o * s) * a), p = _(l - h), w = _(d - g);
    if (p === K)
      return w === K ? this.double() : W.ZERO;
    const E = _(p * p), $ = _(p * E), M = _(h * E), x = _(w * w - $ - we * M), L = _(w * (M - x) - g * $), S = _(s * c * p);
    return new W(x, L, S);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = W.ZERO;
    if (typeof e == "bigint" && e === K)
      return n;
    let r = qo(e);
    if (r === X)
      return this;
    if (!Yn) {
      let l = n, g = this;
      for (; r > K; )
        r & X && (l = l.add(g)), g = g.double(), r >>= X;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: c } = Wn.splitScalar(r), a = n, f = n, h = this;
    for (; i > K || c > K; )
      i & X && (a = a.add(h)), c & X && (f = f.add(h)), h = h.double(), i >>= X, c >>= X;
    return s && (a = a.negate()), o && (f = f.negate()), f = new W(_(f.x * Wn.beta), f.y, f.z), a.add(f);
  }
  precomputeWindow(e) {
    const n = Yn ? 128 / e + 1 : 256 / e + 1, r = [];
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
    let s = n && ks.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = W.normalizeZ(s), ks.set(n, s)));
    let i = W.ZERO, o = W.BASE;
    const c = 1 + (Yn ? 128 / r : 256 / r), a = 2 ** (r - 1), f = BigInt(2 ** r - 1), h = 2 ** r, l = BigInt(r);
    for (let g = 0; g < c; g++) {
      const d = g * a;
      let p = Number(e & f);
      e >>= l, p > a && (p -= h, e += X);
      const w = d, E = d + Math.abs(p) - 1, $ = g % 2 !== 0, M = p < 0;
      p === 0 ? o = o.add(qn($, s[w])) : i = i.add(qn(M, s[E]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = qo(e), s, i;
    if (Yn) {
      const { k1neg: o, k1: c, k2neg: a, k2: f } = Wn.splitScalar(r);
      let { p: h, f: l } = this.wNAF(c, n), { p: g, f: d } = this.wNAF(f, n);
      h = qn(o, h), g = qn(a, g), g = new W(_(g.x * Wn.beta), g.y, g.z), s = h.add(g), i = l.add(d);
    } else {
      const { p: o, f: c } = this.wNAF(r, n);
      s = o, i = c;
    }
    return W.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(W.ZERO);
    e == null && (e = i ? Ro : dn(s));
    const o = e, c = _(o * o), a = _(c * o), f = _(n * c), h = _(r * a), l = _(s * o);
    if (i)
      return V.ZERO;
    if (l !== X)
      throw new Error("invZ was invalid");
    return new V(f, h);
  }
}
W.BASE = new W(Y.Gx, Y.Gy, X);
W.ZERO = new W(K, X, K);
function qn(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const ks = /* @__PURE__ */ new WeakMap();
class V {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, ks.delete(this);
  }
  hasEvenY() {
    return this.y % we === K;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = dt(n ? e : e.subarray(1));
    if (!br(r))
      throw new Error("Point is not on curve");
    const s = Ko(r);
    let i = Mu(s);
    const o = (i & X) === X;
    n ? o && (i = _(-i)) : (e[0] & 1) === 1 !== o && (i = _(-i));
    const c = new V(r, i);
    return c.assertValidity(), c;
  }
  static fromUncompressedHex(e) {
    const n = dt(e.subarray(1, St + 1)), r = dt(e.subarray(St + 1, St * 2 + 1)), s = new V(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Bt(e), r = n.length, s = n[0];
    if (r === St)
      return this.fromCompressedHex(n);
    if (r === Ar && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === Er && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Ar} compressed bytes or ${Er} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return V.BASE.multiply(Me(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = Fa(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Li(Bt(e)), { n: c } = Y, a = r === 2 || r === 3 ? s + c : s, f = dn(a, c), h = _(-o * f, c), l = _(i * f, c), g = r & 1 ? "03" : "02", d = V.fromHex(g + ye(a)), p = V.BASE.multiplyAndAddUnsafe(d, h, l);
    if (!p)
      throw new Error("Cannot recover signature: point at infinify");
    return p.assertValidity(), p;
  }
  toRawBytes(e = !1) {
    return me(this.toHex(e));
  }
  toHex(e = !1) {
    const n = ye(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${ye(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!br(n) || !br(r))
      throw new Error(e);
    const s = _(r * r), i = Ko(n);
    if (_(s - i) !== K)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new V(this.x, _(-this.y));
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
    const s = W.fromAffine(this), i = n === K || n === X || this !== V.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = W.fromAffine(e).multiplyUnsafe(r), c = i.add(o);
    return c.equals(W.ZERO) ? void 0 : c.toAffine();
  }
}
V.BASE = new V(Y.Gx, Y.Gy);
V.ZERO = new V(K, K);
function Wo(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Yo(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${en(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: dt(n), left: t.subarray(e + 2) };
}
function Iu(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${en(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Yo(t.subarray(2)), { data: r, left: s } = Yo(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${en(s)}`);
  return { r: e, s: r };
}
class Pt {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? en(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Pt(vr(s.slice(0, 64)), vr(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Iu(n ? e : me(e));
    return new Pt(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!rn(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!rn(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = Y.n >> X;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Pt(this.r, _(-this.s, Y.n)) : this;
  }
  toDERRawBytes() {
    return me(this.toDERHex());
  }
  toDERHex() {
    const e = Wo(mn(this.s)), n = Wo(mn(this.r)), r = e.length / 2, s = n.length / 2, i = mn(r), o = mn(s);
    return `30${mn(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return me(this.toCompactHex());
  }
  toCompactHex() {
    return ye(this.r) + ye(this.s);
  }
}
function xe(...t) {
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
const Lu = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function en(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Lu[t[n]];
  return e;
}
const $u = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function ye(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(K <= t && t < $u))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function nn(t) {
  const e = me(ye(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function mn(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function vr(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function me(t) {
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
function dt(t) {
  return vr(en(t));
}
function Bt(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : me(t);
}
function qo(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && rn(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function _(t, e = Y.P) {
  const n = t % e;
  return n >= K ? n : e + n;
}
function gt(t, e) {
  const { P: n } = Y;
  let r = t;
  for (; e-- > K; )
    r *= r, r %= n;
  return r;
}
function Mu(t) {
  const { P: e } = Y, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), c = BigInt(88), a = t * t * t % e, f = a * a * t % e, h = gt(f, En) * f % e, l = gt(h, En) * f % e, g = gt(l, we) * a % e, d = gt(g, r) * g % e, p = gt(d, s) * d % e, w = gt(p, o) * p % e, E = gt(w, c) * w % e, $ = gt(E, o) * p % e, M = gt($, En) * f % e, x = gt(M, i) * d % e, L = gt(x, n) * a % e, S = gt(L, we);
  if (S * S % e !== t)
    throw new Error("Cannot find square root");
  return S;
}
function dn(t, e = Y.P) {
  if (t === K || e <= K)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = _(t, e), r = e, s = K, i = X;
  for (; n !== K; ) {
    const c = r / n, a = r % n, f = s - i * c;
    r = n, n = a, s = i, i = f;
  }
  if (r !== X)
    throw new Error("invert: does not exist");
  return _(s, e);
}
function _u(t, e = Y.P) {
  const n = new Array(t.length), r = t.reduce((i, o, c) => o === K ? i : (n[c] = i, _(i * o, e)), X), s = dn(r, e);
  return t.reduceRight((i, o, c) => o === K ? i : (n[c] = _(i * n[c], e), _(i * o, e)), s), n;
}
function Bu(t) {
  const e = t.length * 8 - $e * 8, n = dt(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Li(t, e = !1) {
  const n = Bu(t);
  if (e)
    return n;
  const { n: r } = Y;
  return n >= r ? n - r : n;
}
let Qe, vn;
class ka {
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
    return vn(this.k, ...e);
  }
  checkSync() {
    if (typeof vn != "function")
      throw new Ii("hmacSha256Sync needs to be set");
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
    return xe(...n);
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
    return xe(...n);
  }
}
function rn(t) {
  return K < t && t < Y.n;
}
function br(t) {
  return K < t && t < Y.P;
}
function Pa(t, e, n, r = !0) {
  const { n: s } = Y, i = Li(t, !0);
  if (!rn(i))
    return;
  const o = dn(i, s), c = V.BASE.multiply(i), a = _(c.x, s);
  if (a === K)
    return;
  const f = _(o * _(e + n * a, s), s);
  if (f === K)
    return;
  let h = new Pt(a, f), l = (c.x === h.r ? 0 : 2) | Number(c.y & X);
  return r && h.hasHighS() && (h = h.normalizeS(), l ^= 1), { sig: h, recovery: l };
}
function Me(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * $e)
      throw new Error("Expected 32 bytes of private key");
    e = vr(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== $e)
      throw new Error("Expected 32 bytes of private key");
    e = dt(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!rn(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function $i(t) {
  return t instanceof V ? (t.assertValidity(), t) : V.fromHex(t);
}
function Fa(t) {
  if (t instanceof Pt)
    return t.assertValidity(), t;
  try {
    return Pt.fromDER(t);
  } catch {
    return Pt.fromCompact(t);
  }
}
function Mi(t, e = !1) {
  return V.fromPrivateKey(t).toRawBytes(e);
}
function Du(t, e, n, r = !1) {
  return V.fromSignature(t, e, n).toRawBytes(r);
}
function Zo(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === Ar || r === Er : n ? r === Ar * 2 || r === Er * 2 : t instanceof V;
}
function _i(t, e, n = !1) {
  if (Zo(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Zo(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = $i(e);
  return r.assertValidity(), r.multiply(Me(t)).toRawBytes(n);
}
function za(t) {
  const e = t.length > St ? t.slice(0, St) : t;
  return dt(e);
}
function Hu(t) {
  const e = za(t), n = _(e, Y.n);
  return Ra(n < K ? e : n);
}
function Ra(t) {
  return nn(t);
}
function Ga(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Bt(t), s = Me(e), i = [Ra(s), Hu(r)];
  if (n != null) {
    n === !0 && (n = J.randomBytes(St));
    const a = Bt(n);
    if (a.length !== St)
      throw new Error(`sign: Expected ${St} bytes of extra data`);
    i.push(a);
  }
  const o = xe(...i), c = za(r);
  return { seed: o, m: c, d: s };
}
function Ka(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function Uu(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Ga(t, e, n.extraEntropy), o = new ka(Ta, $e);
  await o.reseed(r);
  let c;
  for (; !(c = Pa(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return Ka(c, n);
}
function Va(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Ga(t, e, n.extraEntropy), o = new ka(Ta, $e);
  o.reseedSync(r);
  let c;
  for (; !(c = Pa(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return Ka(c, n);
}
const Nu = { strict: !0 };
function Cu(t, e, n, r = Nu) {
  let s;
  try {
    s = Fa(t), e = Bt(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const c = Li(e);
  let a;
  try {
    a = $i(n);
  } catch {
    return !1;
  }
  const { n: f } = Y, h = dn(o, f), l = _(c * h, f), g = _(i * h, f), d = V.BASE.multiplyAndAddUnsafe(a, l, g);
  return d ? _(d.x, f) === i : !1;
}
function Ir(t) {
  return _(dt(t), Y.n);
}
class sn {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Bt(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = dt(n.subarray(0, 32)), s = dt(n.subarray(32, 64));
    return new sn(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!br(e) || !rn(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return ye(this.r) + ye(this.s);
  }
  toRawBytes() {
    return me(this.toHex());
  }
}
function Ou(t) {
  return V.fromPrivateKey(t).toRawX();
}
class Wa {
  constructor(e, n, r = J.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Bt(e);
    const { x: s, scalar: i } = this.getScalar(Me(n));
    if (this.px = s, this.d = i, this.rand = Bt(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = V.fromPrivateKey(e), r = n.hasEvenY() ? e : Y.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return nn(e ^ dt(n));
  }
  finalizeNonce(e) {
    const n = _(dt(e), Y.n);
    if (n === K)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new sn(e.x, _(n + r * s, Y.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = J.taggedHash, o = this.initNonce(n, await i(pe.aux, s)), { R: c, rx: a, k: f } = this.finalizeNonce(await i(pe.nonce, o, r, e)), h = Ir(await i(pe.challenge, a, r, e)), l = this.finalizeSig(c, f, h, n);
    return await Za(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = J.taggedHashSync, o = this.initNonce(n, i(pe.aux, s)), { R: c, rx: a, k: f } = this.finalizeNonce(i(pe.nonce, o, r, e)), h = Ir(i(pe.challenge, a, r, e)), l = this.finalizeSig(c, f, h, n);
    return Qa(l, e, r) || this.error(), l;
  }
}
async function ju(t, e, n) {
  return new Wa(t, e, n).calc();
}
function Tu(t, e, n) {
  return new Wa(t, e, n).calcSync();
}
function Ya(t, e, n) {
  const r = t instanceof sn, s = r ? t : sn.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Bt(e),
    P: $i(n)
  };
}
function qa(t, e, n, r) {
  const s = V.BASE.multiplyAndAddUnsafe(e, Me(n), _(-r, Y.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Za(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Ya(t, e, n), c = Ir(await J.taggedHash(pe.challenge, nn(r), o.toRawX(), i));
    return qa(r, o, s, c);
  } catch {
    return !1;
  }
}
function Qa(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Ya(t, e, n), c = Ir(J.taggedHashSync(pe.challenge, nn(r), o.toRawX(), i));
    return qa(r, o, s, c);
  } catch (r) {
    if (r instanceof Ii)
      throw r;
    return !1;
  }
}
const ku = {
  Signature: sn,
  getPublicKey: Ou,
  sign: ju,
  verify: Za,
  signSync: Tu,
  verifySync: Qa
};
V.BASE._setWindowSize(8);
const ft = {
  node: ja,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, pe = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Zn = {}, J = {
  bytesToHex: en,
  hexToBytes: me,
  concatBytes: xe,
  mod: _,
  invert: dn,
  isValidPrivateKey(t) {
    try {
      return Me(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: nn,
  _normalizePrivateKey: Me,
  hashToPrivateKey: (t) => {
    t = Bt(t);
    const e = $e + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = _(dt(t), Y.n - X) + X;
    return nn(n);
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
  randomPrivateKey: () => J.hashToPrivateKey(J.randomBytes($e + 8)),
  precompute(t = 8, e = V.BASE) {
    const n = e === V.BASE ? e : new V(e.x, e.y);
    return n._setWindowSize(t), n.multiply(En), n;
  },
  sha256: async (...t) => {
    if (ft.web) {
      const e = await ft.web.subtle.digest("SHA-256", xe(...t));
      return new Uint8Array(e);
    } else if (ft.node) {
      const { createHash: e } = ft.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (ft.web) {
      const n = await ft.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = xe(...e), s = await ft.web.subtle.sign("HMAC", n, r);
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
    let n = Zn[t];
    if (n === void 0) {
      const r = await J.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = xe(r, r), Zn[t] = n;
    }
    return J.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Qe != "function")
      throw new Ii("sha256Sync is undefined, you need to set it");
    let n = Zn[t];
    if (n === void 0) {
      const r = Qe(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = xe(r, r), Zn[t] = n;
    }
    return Qe(n, ...e);
  },
  _JacobianPoint: W
};
Object.defineProperties(J, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Qe;
    },
    set(t) {
      Qe || (Qe = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return vn;
    },
    set(t) {
      vn || (vn = t);
    }
  }
});
const Pu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: Y,
  Point: V,
  Signature: Pt,
  getPublicKey: Mi,
  getSharedSecret: _i,
  recoverPublicKey: Du,
  schnorr: ku,
  sign: Uu,
  signSync: Va,
  utils: J,
  verify: Cu
}, Symbol.toStringTag, { value: "Module" }));
var ct = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Fu(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function zr(t) {
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
var Nn = {};
Nn.byteLength = Vu;
var zu = Nn.toByteArray = Yu, Ru = Nn.fromByteArray = Qu, $t = [], bt = [], Gu = typeof Uint8Array < "u" ? Uint8Array : Array, Es = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Ke = 0, Ku = Es.length; Ke < Ku; ++Ke)
  $t[Ke] = Es[Ke], bt[Es.charCodeAt(Ke)] = Ke;
bt[45] = 62;
bt[95] = 63;
function Xa(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Vu(t) {
  var e = Xa(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Wu(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Yu(t) {
  var e, n = Xa(t), r = n[0], s = n[1], i = new Gu(Wu(t, r, s)), o = 0, c = s > 0 ? r - 4 : r, a;
  for (a = 0; a < c; a += 4)
    e = bt[t.charCodeAt(a)] << 18 | bt[t.charCodeAt(a + 1)] << 12 | bt[t.charCodeAt(a + 2)] << 6 | bt[t.charCodeAt(a + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = bt[t.charCodeAt(a)] << 2 | bt[t.charCodeAt(a + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = bt[t.charCodeAt(a)] << 10 | bt[t.charCodeAt(a + 1)] << 4 | bt[t.charCodeAt(a + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function qu(t) {
  return $t[t >> 18 & 63] + $t[t >> 12 & 63] + $t[t >> 6 & 63] + $t[t & 63];
}
function Zu(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(qu(r));
  return s.join("");
}
function Qu(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, c = n - r; o < c; o += i)
    s.push(Zu(t, o, o + i > c ? c : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    $t[e >> 2] + $t[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    $t[e >> 10] + $t[e >> 4 & 63] + $t[e << 2 & 63] + "="
  )), s.join("");
}
function Xu() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const Ju = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function td() {
  if (Xu())
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
    throw new Error(Ju);
  }
}
class ed {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(Ft(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(Ft(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class nd {
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
async function Ja() {
  const t = await td();
  return t.name === "subtleCrypto" ? new nd(t.lib) : new ed(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function rd(t) {
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
  function h(d) {
    if (d instanceof Uint8Array || (ArrayBuffer.isView(d) ? d = new Uint8Array(d.buffer, d.byteOffset, d.byteLength) : Array.isArray(d) && (d = Uint8Array.from(d))), !(d instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (d.length === 0)
      return "";
    for (var p = 0, w = 0, E = 0, $ = d.length; E !== $ && d[E] === 0; )
      E++, p++;
    for (var M = ($ - E) * f + 1 >>> 0, x = new Uint8Array(M); E !== $; ) {
      for (var L = d[E], S = 0, U = M - 1; (L !== 0 || S < w) && U !== -1; U--, S++)
        L += 256 * x[U] >>> 0, x[U] = L % o >>> 0, L = L / o >>> 0;
      if (L !== 0)
        throw new Error("Non-zero carry");
      w = S, E++;
    }
    for (var j = M - w; j !== M && x[j] === 0; )
      j++;
    for (var D = c.repeat(p); j < M; ++j)
      D += t.charAt(x[j]);
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
      for (var S = 0, U = $ - 1; (L !== 0 || S < E) && U !== -1; U--, S++)
        L += o * M[U] >>> 0, M[U] = L % 256 >>> 0, L = L / 256 >>> 0;
      if (L !== 0)
        throw new Error("Non-zero carry");
      E = S, p++;
    }
    for (var j = $ - E; j !== $ && M[j] === 0; )
      j++;
    for (var D = new Uint8Array(w + ($ - j)), H = w; j !== $; )
      D[H++] = M[j++];
    return D;
  }
  function g(d) {
    var p = l(d);
    if (p)
      return p;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: h,
    decodeUnsafe: l,
    decode: g
  };
}
var t0 = rd;
const sd = t0, id = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var od = sd(id);
const cd = /* @__PURE__ */ Fu(od), ad = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), e0 = Uint8Array.from({ length: 16 }, (t, e) => e), ld = e0.map((t) => (9 * t + 5) % 16);
let Bi = [e0], Di = [ld];
for (let t = 0; t < 4; t++)
  for (let e of [Bi, Di])
    e.push(e[t].map((n) => ad[n]));
const n0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), fd = Bi.map((t, e) => t.map((n) => n0[e][n])), hd = Di.map((t, e) => t.map((n) => n0[e][n])), ud = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), dd = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Qn = (t, e) => t << e | t >>> 32 - e;
function Qo(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Xn = new Uint32Array(16);
let gd = class extends vi {
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
      Xn[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, a = c, f = this.h3 | 0, h = f, l = this.h4 | 0, g = l;
    for (let d = 0; d < 5; d++) {
      const p = 4 - d, w = ud[d], E = dd[d], $ = Bi[d], M = Di[d], x = fd[d], L = hd[d];
      for (let S = 0; S < 16; S++) {
        const U = Qn(r + Qo(d, i, c, f) + Xn[$[S]] + w, x[S]) + l | 0;
        r = l, l = f, f = Qn(c, 10) | 0, c = i, i = U;
      }
      for (let S = 0; S < 16; S++) {
        const U = Qn(s + Qo(p, o, a, h) + Xn[M[S]] + E, L[S]) + g | 0;
        s = g, g = h, h = Qn(a, 10) | 0, a = o, o = U;
      }
    }
    this.set(this.h1 + c + h | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + a | 0);
  }
  roundClean() {
    Xn.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const bd = Ne(() => new gd());
function pd(t) {
  return bd(t);
}
const Jn = BigInt(2 ** 32 - 1), Ps = BigInt(32);
function r0(t, e = !1) {
  return e ? { h: Number(t & Jn), l: Number(t >> Ps & Jn) } : { h: Number(t >> Ps & Jn) | 0, l: Number(t & Jn) | 0 };
}
function xd(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = r0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const wd = (t, e) => BigInt(t >>> 0) << Ps | BigInt(e >>> 0), yd = (t, e, n) => t >>> n, md = (t, e, n) => t << 32 - n | e >>> n, Sd = (t, e, n) => t >>> n | e << 32 - n, Ad = (t, e, n) => t << 32 - n | e >>> n, Ed = (t, e, n) => t << 64 - n | e >>> n - 32, vd = (t, e, n) => t >>> n - 32 | e << 64 - n, Id = (t, e) => e, Ld = (t, e) => t, $d = (t, e, n) => t << n | e >>> 32 - n, Md = (t, e, n) => e << n | t >>> 32 - n, _d = (t, e, n) => e << n - 32 | t >>> 64 - n, Bd = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Dd(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Hd = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Ud = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Nd = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Cd = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Od = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), jd = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, k = {
  fromBig: r0,
  split: xd,
  toBig: wd,
  shrSH: yd,
  shrSL: md,
  rotrSH: Sd,
  rotrSL: Ad,
  rotrBH: Ed,
  rotrBL: vd,
  rotr32H: Id,
  rotr32L: Ld,
  rotlSH: $d,
  rotlSL: Md,
  rotlBH: _d,
  rotlBL: Bd,
  add: Dd,
  add3L: Hd,
  add3H: Ud,
  add4L: Nd,
  add4H: Cd,
  add5H: jd,
  add5L: Od
}, [Td, kd] = k.split([
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
].map((t) => BigInt(t))), qt = new Uint32Array(80), Zt = new Uint32Array(80);
let Rr = class extends vi {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: a, Eh: f, El: h, Fh: l, Fl: g, Gh: d, Gl: p, Hh: w, Hl: E } = this;
    return [e, n, r, s, i, o, c, a, f, h, l, g, d, p, w, E];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, a, f, h, l, g, d, p, w, E) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = a | 0, this.Eh = f | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = d | 0, this.Gl = p | 0, this.Hh = w | 0, this.Hl = E | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      qt[x] = e.getUint32(n), Zt[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const L = qt[x - 15] | 0, S = Zt[x - 15] | 0, U = k.rotrSH(L, S, 1) ^ k.rotrSH(L, S, 8) ^ k.shrSH(L, S, 7), j = k.rotrSL(L, S, 1) ^ k.rotrSL(L, S, 8) ^ k.shrSL(L, S, 7), D = qt[x - 2] | 0, H = Zt[x - 2] | 0, b = k.rotrSH(D, H, 19) ^ k.rotrBH(D, H, 61) ^ k.shrSH(D, H, 6), A = k.rotrSL(D, H, 19) ^ k.rotrBL(D, H, 61) ^ k.shrSL(D, H, 6), B = k.add4L(j, A, Zt[x - 7], Zt[x - 16]), O = k.add4H(B, U, b, qt[x - 7], qt[x - 16]);
      qt[x] = O | 0, Zt[x] = B | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: a, Dh: f, Dl: h, Eh: l, El: g, Fh: d, Fl: p, Gh: w, Gl: E, Hh: $, Hl: M } = this;
    for (let x = 0; x < 80; x++) {
      const L = k.rotrSH(l, g, 14) ^ k.rotrSH(l, g, 18) ^ k.rotrBH(l, g, 41), S = k.rotrSL(l, g, 14) ^ k.rotrSL(l, g, 18) ^ k.rotrBL(l, g, 41), U = l & d ^ ~l & w, j = g & p ^ ~g & E, D = k.add5L(M, S, j, kd[x], Zt[x]), H = k.add5H(D, $, L, U, Td[x], qt[x]), b = D | 0, A = k.rotrSH(r, s, 28) ^ k.rotrBH(r, s, 34) ^ k.rotrBH(r, s, 39), B = k.rotrSL(r, s, 28) ^ k.rotrBL(r, s, 34) ^ k.rotrBL(r, s, 39), O = r & i ^ r & c ^ i & c, G = s & o ^ s & a ^ o & a;
      $ = w | 0, M = E | 0, w = d | 0, E = p | 0, d = l | 0, p = g | 0, { h: l, l: g } = k.add(f | 0, h | 0, H | 0, b | 0), f = c | 0, h = a | 0, c = i | 0, a = o | 0, i = r | 0, o = s | 0;
      const C = k.add3L(b, B, G);
      r = k.add3H(C, H, A, O), s = C | 0;
    }
    ({ h: r, l: s } = k.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = k.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l: a } = k.add(this.Ch | 0, this.Cl | 0, c | 0, a | 0), { h: f, l: h } = k.add(this.Dh | 0, this.Dl | 0, f | 0, h | 0), { h: l, l: g } = k.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: d, l: p } = k.add(this.Fh | 0, this.Fl | 0, d | 0, p | 0), { h: w, l: E } = k.add(this.Gh | 0, this.Gl | 0, w | 0, E | 0), { h: $, l: M } = k.add(this.Hh | 0, this.Hl | 0, $ | 0, M | 0), this.set(r, s, i, o, c, a, f, h, l, g, d, p, w, E, $, M);
  }
  roundClean() {
    qt.fill(0), Zt.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Pd = class extends Rr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Fd = class extends Rr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, zd = class extends Rr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const Rd = Ne(() => new Rr());
Ne(() => new Pd());
Ne(() => new Fd());
Ne(() => new zd());
function s0(t) {
  return tn(t);
}
function Gd(t) {
  return Rd(t);
}
const Kd = 0;
J.hmacSha256Sync = (t, ...e) => {
  const n = Fr.create(tn, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Vd() {
  return pt(J.randomPrivateKey());
}
function Wd(t) {
  const e = tn(tn(t));
  return cd.encode(Ft(t, e).slice(0, t.length + 4));
}
function Yd(t, e) {
  return Wd(Ft(new Uint8Array([t]), e.slice(0, 20)));
}
function i0(t, e = Kd) {
  const n = typeof t == "string" ? ut(t) : t, r = pd(s0(n));
  return Yd(e, r);
}
function o0(t) {
  const e = au(t);
  return pt(Mi(e.slice(0, 32), !0));
}
J.hmacSha256Sync = (t, ...e) => {
  const n = Fr.create(tn, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Lr;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Lr || (Lr = {}));
async function qd(t, e, n) {
  return await (await Ja()).encrypt("aes-256-cbc", e, t, n);
}
async function Zd(t, e, n) {
  return await (await Ja()).decrypt("aes-256-cbc", e, t, n);
}
function c0(t, e) {
  return Fr(tn, t, e);
}
function Qd(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function a0(t) {
  const e = Gd(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function Xd(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function Jd(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Lr.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Lr.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !Xd(t))
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
async function t1(t, e, n, r) {
  const s = Jd(t);
  if (!s.result)
    throw s;
  const i = J.randomPrivateKey(), o = Mi(i, !0);
  let c = _i(i, t, !0);
  c = c.slice(1);
  const a = a0(c), f = J.randomBytes(16), h = await qd(f, a.encryptionKey, e), l = Ft(f, o, h), g = c0(a.hmacKey, l);
  let d;
  if (!r || r === "hex")
    d = pt(h);
  else if (r === "base64")
    d = Ru(h);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const p = {
    iv: pt(f),
    ephemeralPK: pt(o),
    cipherText: d,
    mac: pt(g),
    wasString: n
  };
  return r && r !== "hex" && (p.cipherTextEncoding = r), p;
}
async function l0(t, e) {
  if (!e.ephemeralPK)
    throw new Po("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = _i(t, n, !0);
  r = r.slice(1);
  const s = a0(r), i = ut(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = ut(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = zu(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const c = Ft(i, ut(n), o), a = c0(s.hmacKey, c), f = ut(e.mac);
  if (!Qd(f, a))
    throw new Po("Decryption failed: failure in MAC check");
  const h = await Zd(i, s.encryptionKey, o);
  return e.wasString ? Ha(h) : h;
}
function e1(t, e) {
  const n = typeof e == "string" ? Un(e) : e, r = o0(t), s = s0(n), i = Va(s, t);
  return {
    signature: pt(i),
    publicKey: r
  };
}
async function n1(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = o0(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? Un(t) : t, o = await t1(n.publicKey, i, s, n.cipherTextEncoding);
  let c = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const a = e1(r, c), f = {
      signature: a.signature,
      publicKey: a.publicKey,
      cipherText: c
    };
    c = JSON.stringify(f);
  }
  return c;
}
function r1(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return l0(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var it = {}, on = {}, ot = {};
Object.defineProperty(ot, "__esModule", { value: !0 });
ot.decode = ot.encode = ot.unescape = ot.escape = ot.pad = void 0;
const f0 = Nn;
function Hi(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
ot.pad = Hi;
function h0(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
ot.escape = h0;
function u0(t) {
  return Hi(t).replace(/-/g, "+").replace(/_/g, "/");
}
ot.unescape = u0;
function s1(t) {
  return h0((0, f0.fromByteArray)(new TextEncoder().encode(t)));
}
ot.encode = s1;
function i1(t) {
  return new TextDecoder().decode((0, f0.toByteArray)(Hi(u0(t))));
}
ot.decode = i1;
var Gr = {}, Kr = {}, d0 = {}, g0 = {}, Vr = {};
Object.defineProperty(Vr, "__esModule", { value: !0 });
Vr.crypto = void 0;
Vr.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = c, t.u8 = a, t.u32 = f, t.clean = h, t.createView = l, t.rotr = g, t.rotl = d, t.byteSwap = p, t.byteSwap32 = w, t.bytesToHex = M, t.hexToBytes = S, t.asyncLoop = j, t.utf8ToBytes = D, t.bytesToUtf8 = H, t.toBytes = b, t.kdfInputToBytes = A, t.concatBytes = B, t.checkOpts = O, t.createHasher = C, t.createOptHasher = Nt, t.createXOFer = Kt, t.randomBytes = Pe;
  const e = Vr;
  function n(m) {
    return m instanceof Uint8Array || ArrayBuffer.isView(m) && m.constructor.name === "Uint8Array";
  }
  function r(m) {
    if (!Number.isSafeInteger(m) || m < 0)
      throw new Error("positive integer expected, got " + m);
  }
  function s(m, ...I) {
    if (!n(m))
      throw new Error("Uint8Array expected");
    if (I.length > 0 && !I.includes(m.length))
      throw new Error("Uint8Array expected of length " + I + ", got length=" + m.length);
  }
  function i(m) {
    if (typeof m != "function" || typeof m.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(m.outputLen), r(m.blockLen);
  }
  function o(m, I = !0) {
    if (m.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (I && m.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function c(m, I) {
    s(m);
    const Z = I.outputLen;
    if (m.length < Z)
      throw new Error("digestInto() expects output buffer of length at least " + Z);
  }
  function a(m) {
    return new Uint8Array(m.buffer, m.byteOffset, m.byteLength);
  }
  function f(m) {
    return new Uint32Array(m.buffer, m.byteOffset, Math.floor(m.byteLength / 4));
  }
  function h(...m) {
    for (let I = 0; I < m.length; I++)
      m[I].fill(0);
  }
  function l(m) {
    return new DataView(m.buffer, m.byteOffset, m.byteLength);
  }
  function g(m, I) {
    return m << 32 - I | m >>> I;
  }
  function d(m, I) {
    return m << I | m >>> 32 - I >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function p(m) {
    return m << 24 & 4278190080 | m << 8 & 16711680 | m >>> 8 & 65280 | m >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (m) => m : (m) => p(m), t.byteSwapIfBE = t.swap8IfBE;
  function w(m) {
    for (let I = 0; I < m.length; I++)
      m[I] = p(m[I]);
    return m;
  }
  t.swap32IfBE = t.isLE ? (m) => m : w;
  const E = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", $ = /* @__PURE__ */ Array.from({ length: 256 }, (m, I) => I.toString(16).padStart(2, "0"));
  function M(m) {
    if (s(m), E)
      return m.toHex();
    let I = "";
    for (let Z = 0; Z < m.length; Z++)
      I += $[m[Z]];
    return I;
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
    const I = m.length, Z = I / 2;
    if (I % 2)
      throw new Error("hex string expected, got unpadded hex of length " + I);
    const Q = new Uint8Array(Z);
    for (let q = 0, rt = 0; q < Z; q++, rt += 2) {
      const xn = L(m.charCodeAt(rt)), kn = L(m.charCodeAt(rt + 1));
      if (xn === void 0 || kn === void 0) {
        const is = m[rt] + m[rt + 1];
        throw new Error('hex string expected, got non-hex character "' + is + '" at index ' + rt);
      }
      Q[q] = xn * 16 + kn;
    }
    return Q;
  }
  const U = async () => {
  };
  t.nextTick = U;
  async function j(m, I, Z) {
    let Q = Date.now();
    for (let q = 0; q < m; q++) {
      Z(q);
      const rt = Date.now() - Q;
      rt >= 0 && rt < I || (await (0, t.nextTick)(), Q += rt);
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
  function B(...m) {
    let I = 0;
    for (let Q = 0; Q < m.length; Q++) {
      const q = m[Q];
      s(q), I += q.length;
    }
    const Z = new Uint8Array(I);
    for (let Q = 0, q = 0; Q < m.length; Q++) {
      const rt = m[Q];
      Z.set(rt, q), q += rt.length;
    }
    return Z;
  }
  function O(m, I) {
    if (I !== void 0 && {}.toString.call(I) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(m, I);
  }
  class G {
  }
  t.Hash = G;
  function C(m) {
    const I = (Q) => m().update(b(Q)).digest(), Z = m();
    return I.outputLen = Z.outputLen, I.blockLen = Z.blockLen, I.create = () => m(), I;
  }
  function Nt(m) {
    const I = (Q, q) => m(q).update(b(Q)).digest(), Z = m({});
    return I.outputLen = Z.outputLen, I.blockLen = Z.blockLen, I.create = (Q) => m(Q), I;
  }
  function Kt(m) {
    const I = (Q, q) => m(q).update(b(Q)).digest(), Z = m({});
    return I.outputLen = Z.outputLen, I.blockLen = Z.blockLen, I.create = (Q) => m(Q), I;
  }
  t.wrapConstructor = C, t.wrapConstructorWithOpts = Nt, t.wrapXOFConstructorWithOpts = Kt;
  function Pe(m = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(m));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(m));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(g0);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = g0;
  class n extends e.Hash {
    constructor(i, o) {
      super(), this.finished = !1, this.destroyed = !1, (0, e.ahash)(i);
      const c = (0, e.toBytes)(o);
      if (this.iHash = i.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const a = this.blockLen, f = new Uint8Array(a);
      f.set(c.length > a ? i.create().update(c).digest() : c);
      for (let h = 0; h < f.length; h++)
        f[h] ^= 54;
      this.iHash.update(f), this.oHash = i.create();
      for (let h = 0; h < f.length; h++)
        f[h] ^= 106;
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
      const { oHash: o, iHash: c, finished: a, destroyed: f, blockLen: h, outputLen: l } = this;
      return i = i, i.finished = a, i.destroyed = f, i.blockLen = h, i.outputLen = l, i.oHash = o._cloneInto(i.oHash), i.iHash = c._cloneInto(i.iHash), i;
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
})(d0);
const Ve = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function b0(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Fs(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Ce(t, ...e) {
  if (!b0(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function o1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Fs(t.outputLen), Fs(t.blockLen);
}
function zs(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function p0(t, e) {
  Ce(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function c1(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function a1(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function $r(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function pr(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function xt(t, e) {
  return t << 32 - e | t >>> e;
}
function l1(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Ui = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Ni(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const x0 = Ui ? (t) => t : (t) => Ni(t), f1 = x0;
function w0(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Ni(t[e]);
  return t;
}
const h1 = Ui ? (t) => t : w0, y0 = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", u1 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function d1(t) {
  if (Ce(t), y0)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += u1[t[n]];
  return e;
}
const jt = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Xo(t) {
  if (t >= jt._0 && t <= jt._9)
    return t - jt._0;
  if (t >= jt.A && t <= jt.F)
    return t - (jt.A - 10);
  if (t >= jt.a && t <= jt.f)
    return t - (jt.a - 10);
}
function g1(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (y0)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = Xo(t.charCodeAt(i)), c = Xo(t.charCodeAt(i + 1));
    if (o === void 0 || c === void 0) {
      const a = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + a + '" at index ' + i);
    }
    r[s] = o * 16 + c;
  }
  return r;
}
const m0 = async () => {
};
async function b1(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await m0(), r += i);
  }
}
function Ci(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function p1(t) {
  return new TextDecoder().decode(t);
}
function Cn(t) {
  return typeof t == "string" && (t = Ci(t)), Ce(t), t;
}
function x1(t) {
  return typeof t == "string" && (t = Ci(t)), Ce(t), t;
}
function w1(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    Ce(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function y1(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let S0 = class {
};
function Wr(t) {
  const e = (r) => t().update(Cn(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function A0(t) {
  const e = (r, s) => t(s).update(Cn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function E0(t) {
  const e = (r, s) => t(s).update(Cn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const m1 = Wr, S1 = A0, A1 = E0;
function E1(t = 32) {
  if (Ve && typeof Ve.getRandomValues == "function")
    return Ve.getRandomValues(new Uint8Array(t));
  if (Ve && typeof Ve.randomBytes == "function")
    return Uint8Array.from(Ve.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const v1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: S0,
  abytes: Ce,
  aexists: zs,
  ahash: o1,
  anumber: Fs,
  aoutput: p0,
  asyncLoop: b1,
  byteSwap: Ni,
  byteSwap32: w0,
  byteSwapIfBE: f1,
  bytesToHex: d1,
  bytesToUtf8: p1,
  checkOpts: y1,
  clean: $r,
  concatBytes: w1,
  createHasher: Wr,
  createOptHasher: A0,
  createView: pr,
  createXOFer: E0,
  hexToBytes: g1,
  isBytes: b0,
  isLE: Ui,
  kdfInputToBytes: x1,
  nextTick: m0,
  randomBytes: E1,
  rotl: l1,
  rotr: xt,
  swap32IfBE: h1,
  swap8IfBE: x0,
  toBytes: Cn,
  u32: a1,
  u8: c1,
  utf8ToBytes: Ci,
  wrapConstructor: m1,
  wrapConstructorWithOpts: S1,
  wrapXOFConstructorWithOpts: A1
}, Symbol.toStringTag, { value: "Module" }));
function I1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), a = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + a, o, r), t.setUint32(e + f, c, r);
}
function L1(t, e, n) {
  return t & e ^ ~t & n;
}
function $1(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class M1 extends S0 {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = pr(this.buffer);
  }
  update(e) {
    zs(this), e = Cn(e), Ce(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const a = pr(e);
        for (; s <= i - o; o += s)
          this.process(a, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    zs(this), p0(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, $r(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    I1(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = pr(e), a = this.outputLen;
    if (a % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = a / 4, h = this.get();
    if (f > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      c.setUint32(4 * l, h[l], i);
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
const Qt = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Xt = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), _1 = /* @__PURE__ */ Uint32Array.from([
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
]), Jt = /* @__PURE__ */ new Uint32Array(64);
let Oi = class extends M1 {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = Qt[0] | 0, this.B = Qt[1] | 0, this.C = Qt[2] | 0, this.D = Qt[3] | 0, this.E = Qt[4] | 0, this.F = Qt[5] | 0, this.G = Qt[6] | 0, this.H = Qt[7] | 0;
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
      Jt[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Jt[l - 15], d = Jt[l - 2], p = xt(g, 7) ^ xt(g, 18) ^ g >>> 3, w = xt(d, 17) ^ xt(d, 19) ^ d >>> 10;
      Jt[l] = w + Jt[l - 7] + p + Jt[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: a, G: f, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const g = xt(c, 6) ^ xt(c, 11) ^ xt(c, 25), d = h + g + L1(c, a, f) + _1[l] + Jt[l] | 0, w = (xt(r, 2) ^ xt(r, 13) ^ xt(r, 22)) + $1(r, s, i) | 0;
      h = f, f = a, a = c, c = o + d | 0, o = i, i = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, f = f + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, c, a, f, h);
  }
  roundClean() {
    $r(Jt);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), $r(this.buffer);
  }
}, v0 = class extends Oi {
  constructor() {
    super(28), this.A = Xt[0] | 0, this.B = Xt[1] | 0, this.C = Xt[2] | 0, this.D = Xt[3] | 0, this.E = Xt[4] | 0, this.F = Xt[5] | 0, this.G = Xt[6] | 0, this.H = Xt[7] | 0;
  }
};
const B1 = /* @__PURE__ */ Wr(() => new Oi()), D1 = /* @__PURE__ */ Wr(() => new v0()), H1 = Oi, U1 = B1, N1 = v0, C1 = D1, O1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: N1,
  SHA256: H1,
  sha224: C1,
  sha256: U1
}, Symbol.toStringTag, { value: "Module" })), Yr = /* @__PURE__ */ zr(O1), j1 = /* @__PURE__ */ zr(Pu);
var cn = {};
Object.defineProperty(cn, "__esModule", { value: !0 });
cn.joseToDer = cn.derToJose = void 0;
const I0 = Nn, L0 = ot;
function vs(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const T1 = {
  ES256: vs(256),
  ES384: vs(384),
  ES512: vs(521)
};
function $0(t) {
  const e = T1[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Mr = 128, M0 = 0, k1 = 32, P1 = 16, F1 = 2, _0 = P1 | k1 | M0 << 6, _r = F1 | M0 << 6;
function B0(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, I0.toByteArray)((0, L0.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function z1(t, e) {
  const n = B0(t), r = $0(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== _0)
    throw new Error('Could not find expected "seq"');
  let c = n[o++];
  if (c === (Mr | 1) && (c = n[o++]), i - o < c)
    throw new Error(`"seq" specified length of "${c}", only "${i - o}" remaining`);
  if (n[o++] !== _r)
    throw new Error('Could not find expected "int" for "r"');
  const a = n[o++];
  if (i - o - 2 < a)
    throw new Error(`"r" specified length of "${a}", only "${i - o - 2}" available`);
  if (s < a)
    throw new Error(`"r" specified length of "${a}", max of "${s}" is acceptable`);
  const f = o;
  if (o += a, n[o++] !== _r)
    throw new Error('Could not find expected "int" for "s"');
  const h = n[o++];
  if (i - o !== h)
    throw new Error(`"s" specified length of "${h}", expected "${i - o}"`);
  if (s < h)
    throw new Error(`"s" specified length of "${h}", max of "${s}" is acceptable`);
  const l = o;
  if (o += h, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const g = r - a, d = r - h, p = new Uint8Array(g + a + d + h);
  for (o = 0; o < g; ++o)
    p[o] = 0;
  p.set(n.subarray(f + Math.max(-g, 0), f + a), o), o = r;
  for (const w = o; o < w + d; ++o)
    p[o] = 0;
  return p.set(n.subarray(l + Math.max(-d, 0), l + h), o), (0, L0.escape)((0, I0.fromByteArray)(p));
}
cn.derToJose = z1;
function Jo(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Mr && --r, r;
}
function R1(t, e) {
  t = B0(t);
  const n = $0(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Jo(t, 0, n), i = Jo(t, n, t.length), o = n - s, c = n - i, a = 2 + o + 1 + 1 + c, f = a < Mr, h = new Uint8Array((f ? 2 : 3) + a);
  let l = 0;
  return h[l++] = _0, f ? h[l++] = a : (h[l++] = Mr | 1, h[l++] = a & 255), h[l++] = _r, h[l++] = o, s < 0 ? (h[l++] = 0, h.set(t.subarray(0, n), l), l += n) : (h.set(t.subarray(s, n), l), l += n - s), h[l++] = _r, h[l++] = c, i < 0 ? (h[l++] = 0, h.set(t.subarray(n), l)) : h.set(t.subarray(n + i), l), h;
}
cn.joseToDer = R1;
var zt = {};
Object.defineProperty(zt, "__esModule", { value: !0 });
zt.InvalidTokenError = zt.MissingParametersError = void 0;
class G1 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
zt.MissingParametersError = G1;
class K1 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
zt.InvalidTokenError = K1;
const On = /* @__PURE__ */ zr(v1);
Object.defineProperty(Kr, "__esModule", { value: !0 });
Kr.SECP256K1Client = void 0;
const V1 = d0, W1 = Yr, xr = j1, tc = cn, ec = zt, nc = On;
xr.utils.hmacSha256Sync = (t, ...e) => {
  const n = V1.hmac.create(W1.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class D0 {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, nc.bytesToHex)(xr.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new ec.MissingParametersError("a signing input hash and private key are all required");
    const s = xr.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, nc.bytesToHex)(s);
    if (r === "jose")
      return (0, tc.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, tc.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new ec.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return xr.verify(n, e, r, { strict: !1 });
  }
}
Kr.SECP256K1Client = D0;
D0.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Kr;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(Gr);
var _e = {};
const Y1 = /* @__PURE__ */ zr(ja);
var q1 = ct && ct.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function c(h) {
      try {
        f(r.next(h));
      } catch (l) {
        o(l);
      }
    }
    function a(h) {
      try {
        f(r.throw(h));
      } catch (l) {
        o(l);
      }
    }
    function f(h) {
      h.done ? i(h.value) : s(h.value).then(c, a);
    }
    f((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(_e, "__esModule", { value: !0 });
_e.hashSha256Async = _e.hashSha256 = void 0;
const Z1 = Yr;
function H0(t) {
  return (0, Z1.sha256)(t);
}
_e.hashSha256 = H0;
function Q1(t) {
  return q1(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Y1;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(H0(t));
    }
  });
}
_e.hashSha256Async = Q1;
var X1 = ct && ct.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function c(h) {
      try {
        f(r.next(h));
      } catch (l) {
        o(l);
      }
    }
    function a(h) {
      try {
        f(r.throw(h));
      } catch (l) {
        o(l);
      }
    }
    function f(h) {
      h.done ? i(h.value) : s(h.value).then(c, a);
    }
    f((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(on, "__esModule", { value: !0 });
on.TokenSigner = on.createUnsecuredToken = void 0;
const Rs = ot, rc = Gr, J1 = zt, sc = _e;
function Gs(t, e) {
  const n = [], r = Rs.encode(JSON.stringify(e));
  n.push(r);
  const s = Rs.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function tg(t) {
  return Gs(t, { typ: "JWT", alg: "none" }) + ".";
}
on.createUnsecuredToken = tg;
class eg {
  constructor(e, n) {
    if (!(e && n))
      throw new J1.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !rc.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = rc.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = Gs(e, s), o = (0, sc.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return X1(this, void 0, void 0, function* () {
      const s = this.header(r), i = Gs(e, s), o = yield (0, sc.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [Rs.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
on.TokenSigner = eg;
var qr = {};
Object.defineProperty(qr, "__esModule", { value: !0 });
qr.TokenVerifier = void 0;
const ng = ot, ic = Gr, rg = zt, tr = _e;
class sg {
  constructor(e, n) {
    if (!(e && n))
      throw new rg.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !ic.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = ic.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, tr.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, tr.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), ng.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((c) => {
      const a = this.cryptoClient.loadSignature(c);
      this.cryptoClient.verifyHash(o, a, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, tr.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, tr.hashSha256)(r);
      return i(o);
    }
  }
}
qr.TokenVerifier = sg;
var Zr = {};
Object.defineProperty(Zr, "__esModule", { value: !0 });
Zr.decodeToken = void 0;
const er = ot;
function ig(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(er.decode(e[0])), r = JSON.parse(er.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = er.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(er.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
Zr.decodeToken = ig;
(function(t) {
  var e = ct && ct.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var c = Object.getOwnPropertyDescriptor(s, i);
    (!c || ("get" in c ? !s.__esModule : c.writable || c.configurable)) && (c = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, c);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = ct && ct.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(on, t), n(qr, t), n(Zr, t), n(zt, t), n(Gr, t);
})(it);
function og(t) {
  return `did:btc-addr:${t}`;
}
function cg(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new ko("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new ko('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function U0(t) {
  if (t)
    return cg(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const ag = "1.4.0";
function lg() {
  return Vd();
}
function fg(t, e, n, r = _a.slice(), s, i = Vh().getTime(), o = {}) {
  const c = (d) => {
    const p = Si("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${d}=undefined])`
    });
    return p == null ? void 0 : p.origin;
  };
  e || (e = `${c("redirectURI")}/`), n || (n = `${c("manifestURI")}/manifest.json`), s || (s = c("appDomain"));
  const a = Object.assign({}, o, {
    jti: Yh(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: ag,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), f = it.SECP256K1Client.derivePublicKey(t);
  a.public_keys = [f];
  const h = i0(f);
  return a.iss = og(h), new it.TokenSigner("ES256k", t).sign(a);
}
async function oc(t, e) {
  const n = Ha(ut(e)), r = JSON.parse(n), s = await l0(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function hg(t) {
  const e = it.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new it.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function ug(t) {
  const e = it.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = U0(e.iss);
  if (n.length === 1) {
    if (i0(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function dg(t) {
  const e = it.decodeToken(t).payload;
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
function gg(t) {
  const e = it.decodeToken(t).payload;
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
function bg(t) {
  const e = [
    gg(t),
    dg(t),
    hg(t),
    ug(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const cc = "1.0.0";
class Se {
  constructor(e) {
    this.version = cc, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== cc)
      throw new Os(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Se(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class N0 {
  constructor(e) {
    if (e) {
      const n = new Se(e);
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
class ac extends N0 {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Se({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new Ba("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Se({})), !0;
  }
}
class lc extends N0 {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Rh, !localStorage.getItem(this.key)) {
      const r = new Se({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new Ba("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Se.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Se({})), !0;
  }
}
var $n;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})($n || ($n = {}));
var Br;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Br || (Br = {}));
$n.Mainnet;
var kt;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(kt || (kt = {}));
var Mt;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Mt || (Mt = {}));
kt.Mainnet;
const C0 = {
  chainId: $n.Mainnet,
  transactionVersion: kt.Mainnet,
  peerNetworkId: Br.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Mt.MainnetSingleSig,
    multiSig: Mt.MainnetMultiSig
  },
  client: { baseUrl: su }
}, Ks = {
  chainId: $n.Testnet,
  transactionVersion: kt.Testnet,
  peerNetworkId: Br.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Mt.TestnetSingleSig,
    multiSig: Mt.TestnetMultiSig
  },
  client: { baseUrl: iu }
}, wr = {
  ...Ks,
  addressVersion: { ...Ks.addressVersion },
  magicBytes: "id",
  client: { baseUrl: ou }
}, pg = {
  ...wr,
  addressVersion: { ...wr.addressVersion },
  client: { ...wr.client }
};
function xg(t) {
  switch (t) {
    case "mainnet":
      return C0;
    case "testnet":
      return Ks;
    case "devnet":
      return wr;
    case "mocknet":
      return pg;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function O0(t) {
  return typeof t == "string" ? xg(t) : t;
}
var fc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(fc || (fc = {}));
var hc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(hc || (hc = {}));
var wt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(wt || (wt = {}));
const Is = ["onChainOnly", "offChainOnly", "any"];
Is[0] + "", wt.OnChainOnly, Is[1] + "", wt.OffChainOnly, Is[2] + "", wt.Any, wt.OnChainOnly + "", wt.OnChainOnly, wt.OffChainOnly + "", wt.OffChainOnly, wt.Any + "", wt.Any;
var uc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(uc || (uc = {}));
var dc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(dc || (dc = {}));
var gc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(gc || (gc = {}));
var Tt;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Tt || (Tt = {}));
var bc;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(bc || (bc = {}));
var pc;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(pc || (pc = {}));
var xc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(xc || (xc = {}));
var wc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(wc || (wc = {}));
var yc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(yc || (yc = {}));
var mc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(mc || (mc = {}));
var Sc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Sc || (Sc = {}));
var Ac;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Ac || (Ac = {}));
var Ec;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Ec || (Ec = {}));
function Vs(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function wg(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function j0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function yg(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Vs(t.outputLen), Vs(t.blockLen);
}
function mg(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Sg(t, e) {
  j0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Le = {
  number: Vs,
  bool: wg,
  bytes: j0,
  hash: yg,
  exists: mg,
  output: Sg
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ls = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Et = (t, e) => t << 32 - e | t >>> e, Ag = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Ag)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Eg(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function ji(t) {
  if (typeof t == "string" && (t = Eg(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let T0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Oe(t) {
  const e = (r) => t().update(ji(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
class k0 extends T0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Le.hash(e);
    const r = ji(n);
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
    return Le.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Le.exists(this), Le.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const P0 = (t, e, n) => new k0(t, e).update(n).digest();
P0.create = (t, e) => new k0(t, e);
function vg(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), a = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + a, o, r), t.setUint32(e + f, c, r);
}
let Ti = class extends T0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ls(this.buffer);
  }
  update(e) {
    Le.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = ji(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const a = Ls(e);
        for (; s <= i - o; o += s)
          this.process(a, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Le.exists(this), Le.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    vg(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = Ls(e), a = this.outputLen;
    if (a % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = a / 4, h = this.get();
    if (f > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      c.setUint32(4 * l, h[l], i);
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
const Ig = (t, e, n) => t & e ^ ~t & n, Lg = (t, e, n) => t & e ^ t & n ^ e & n, $g = new Uint32Array([
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
]), te = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ee = new Uint32Array(64);
let F0 = class extends Ti {
  constructor() {
    super(64, 32, 8, !1), this.A = te[0] | 0, this.B = te[1] | 0, this.C = te[2] | 0, this.D = te[3] | 0, this.E = te[4] | 0, this.F = te[5] | 0, this.G = te[6] | 0, this.H = te[7] | 0;
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
      ee[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = ee[l - 15], d = ee[l - 2], p = Et(g, 7) ^ Et(g, 18) ^ g >>> 3, w = Et(d, 17) ^ Et(d, 19) ^ d >>> 10;
      ee[l] = w + ee[l - 7] + p + ee[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: a, G: f, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const g = Et(c, 6) ^ Et(c, 11) ^ Et(c, 25), d = h + g + Ig(c, a, f) + $g[l] + ee[l] | 0, w = (Et(r, 2) ^ Et(r, 13) ^ Et(r, 22)) + Lg(r, s, i) | 0;
      h = f, f = a, a = c, c = o + d | 0, o = i, i = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, f = f + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, c, a, f, h);
  }
  roundClean() {
    ee.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Mg = class extends F0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const z0 = Oe(() => new F0());
Oe(() => new Mg());
var Qr = {}, ki = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = On;
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
    let h = 0;
    for (let d = 0; d < a.length && a[d] === "0"; d++)
      h++;
    a = a.slice(h);
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
    let h = [], l = 0, g = 0;
    for (let w = o.length - 1; w >= 0; w--) {
      g === 4 && (h.unshift(n[l]), g = 0, l = 0);
      const $ = (t.c32.indexOf(o[w]) << g) + l, M = n[$ % 16];
      if (g += 1, l = $ >> 4, l > 1 << g)
        throw new Error("Panic error in decoding.");
      h.unshift(M);
    }
    h.unshift(n[l]), h.length % 2 === 1 && h.unshift("0");
    let d = 0;
    for (let w = 0; w < h.length && h[w] === "0"; w++)
      d++;
    h = h.slice(d - d % 2);
    let p = h.join("");
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
})(ki);
var Be = {};
Object.defineProperty(Be, "__esModule", { value: !0 });
Be.c32checkDecode = Be.c32checkEncode = void 0;
const vc = Yr, Ic = On, In = ki;
function R0(t) {
  const e = (0, vc.sha256)((0, vc.sha256)((0, Ic.hexToBytes)(t)));
  return (0, Ic.bytesToHex)(e.slice(0, 4));
}
function _g(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = R0(`${n}${e}`), s = (0, In.c32encode)(`${e}${r}`);
  return `${In.c32[t]}${s}`;
}
Be.c32checkEncode = _g;
function Bg(t) {
  t = (0, In.c32normalize)(t);
  const e = (0, In.c32decode)(t.slice(1)), n = t[0], r = In.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), R0(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Be.c32checkDecode = Bg;
var G0 = {}, an = {};
Object.defineProperty(an, "__esModule", { value: !0 });
an.decode = an.encode = void 0;
const Dr = Yr, Lc = On, K0 = t0, V0 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function Dg(t, e = "00") {
  const n = typeof t == "string" ? (0, Lc.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Lc.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Dr.sha256)((0, Dr.sha256)(new Uint8Array([...r, ...n])));
  return K0(V0).encode([...r, ...n, ...s.slice(0, 4)]);
}
an.encode = Dg;
function Hg(t) {
  const e = K0(V0).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Dr.sha256)((0, Dr.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
an.decode = Hg;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Be, n = an, r = On;
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
  function o(h, l) {
    if (!l.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, e.c32checkEncode)(h, l)}`;
  }
  t.c32address = o;
  function c(h) {
    if (h.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (h[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, e.c32checkDecode)(h.slice(1));
  }
  t.c32addressDecode = c;
  function a(h, l = -1) {
    const g = n.decode(h), d = (0, r.bytesToHex)(g.data), p = parseInt((0, r.bytesToHex)(g.prefix), 16);
    let w;
    return l < 0 ? (w = p, s[p] !== void 0 && (w = s[p])) : w = l, o(w, d);
  }
  t.b58ToC32 = a;
  function f(h, l = -1) {
    const g = c(h), d = g[0], p = g[1];
    let w;
    l < 0 ? (w = d, i[d] !== void 0 && (w = i[d])) : w = l;
    let E = w.toString(16);
    return E.length === 1 && (E = `0${E}`), n.encode(p, E);
  }
  t.c32ToB58 = f;
})(G0);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = ki;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Be;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = G0;
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
})(Qr);
function Ug(t, e) {
  switch (e = O0(e ?? C0), t) {
    case Tt.P2PKH:
      switch (e.transactionVersion) {
        case kt.Mainnet:
          return Mt.MainnetSingleSig;
        case kt.Testnet:
          return Mt.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case Tt.P2SH:
    case Tt.P2SHNonSequential:
    case Tt.P2WPKH:
    case Tt.P2WSH:
    case Tt.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case kt.Mainnet:
          return Mt.MainnetMultiSig;
        case kt.Testnet:
          return Mt.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const Ng = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), W0 = Uint8Array.from({ length: 16 }, (t, e) => e), Cg = W0.map((t) => (9 * t + 5) % 16);
let Pi = [W0], Fi = [Cg];
for (let t = 0; t < 4; t++)
  for (let e of [Pi, Fi])
    e.push(e[t].map((n) => Ng[n]));
const Y0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Og = Pi.map((t, e) => t.map((n) => Y0[e][n])), jg = Fi.map((t, e) => t.map((n) => Y0[e][n])), Tg = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), kg = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), nr = (t, e) => t << e | t >>> 32 - e;
function $c(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const rr = new Uint32Array(16);
let Pg = class extends Ti {
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
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, a = c, f = this.h3 | 0, h = f, l = this.h4 | 0, g = l;
    for (let d = 0; d < 5; d++) {
      const p = 4 - d, w = Tg[d], E = kg[d], $ = Pi[d], M = Fi[d], x = Og[d], L = jg[d];
      for (let S = 0; S < 16; S++) {
        const U = nr(r + $c(d, i, c, f) + rr[$[S]] + w, x[S]) + l | 0;
        r = l, l = f, f = nr(c, 10) | 0, c = i, i = U;
      }
      for (let S = 0; S < 16; S++) {
        const U = nr(s + $c(p, o, a, h) + rr[M[S]] + E, L[S]) + g | 0;
        s = g, g = h, h = nr(a, 10) | 0, a = o, o = U;
      }
    }
    this.set(this.h1 + c + h | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + a | 0);
  }
  roundClean() {
    rr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Fg = Oe(() => new Pg()), sr = BigInt(2 ** 32 - 1), Ws = BigInt(32);
function q0(t, e = !1) {
  return e ? { h: Number(t & sr), l: Number(t >> Ws & sr) } : { h: Number(t >> Ws & sr) | 0, l: Number(t & sr) | 0 };
}
function zg(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = q0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Rg = (t, e) => BigInt(t >>> 0) << Ws | BigInt(e >>> 0), Gg = (t, e, n) => t >>> n, Kg = (t, e, n) => t << 32 - n | e >>> n, Vg = (t, e, n) => t >>> n | e << 32 - n, Wg = (t, e, n) => t << 32 - n | e >>> n, Yg = (t, e, n) => t << 64 - n | e >>> n - 32, qg = (t, e, n) => t >>> n - 32 | e << 64 - n, Zg = (t, e) => e, Qg = (t, e) => t, Xg = (t, e, n) => t << n | e >>> 32 - n, Jg = (t, e, n) => e << n | t >>> 32 - n, tb = (t, e, n) => e << n - 32 | t >>> 64 - n, eb = (t, e, n) => t << n - 32 | e >>> 64 - n;
function nb(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const rb = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), sb = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, ib = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), ob = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, cb = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), ab = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, P = {
  fromBig: q0,
  split: zg,
  toBig: Rg,
  shrSH: Gg,
  shrSL: Kg,
  rotrSH: Vg,
  rotrSL: Wg,
  rotrBH: Yg,
  rotrBL: qg,
  rotr32H: Zg,
  rotr32L: Qg,
  rotlSH: Xg,
  rotlSL: Jg,
  rotlBH: tb,
  rotlBL: eb,
  add: nb,
  add3L: rb,
  add3H: sb,
  add4L: ib,
  add4H: ob,
  add5H: ab,
  add5L: cb
}, [lb, fb] = P.split([
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
].map((t) => BigInt(t))), ne = new Uint32Array(80), re = new Uint32Array(80);
let Xr = class extends Ti {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: a, Eh: f, El: h, Fh: l, Fl: g, Gh: d, Gl: p, Hh: w, Hl: E } = this;
    return [e, n, r, s, i, o, c, a, f, h, l, g, d, p, w, E];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, a, f, h, l, g, d, p, w, E) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = a | 0, this.Eh = f | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = d | 0, this.Gl = p | 0, this.Hh = w | 0, this.Hl = E | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      ne[x] = e.getUint32(n), re[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const L = ne[x - 15] | 0, S = re[x - 15] | 0, U = P.rotrSH(L, S, 1) ^ P.rotrSH(L, S, 8) ^ P.shrSH(L, S, 7), j = P.rotrSL(L, S, 1) ^ P.rotrSL(L, S, 8) ^ P.shrSL(L, S, 7), D = ne[x - 2] | 0, H = re[x - 2] | 0, b = P.rotrSH(D, H, 19) ^ P.rotrBH(D, H, 61) ^ P.shrSH(D, H, 6), A = P.rotrSL(D, H, 19) ^ P.rotrBL(D, H, 61) ^ P.shrSL(D, H, 6), B = P.add4L(j, A, re[x - 7], re[x - 16]), O = P.add4H(B, U, b, ne[x - 7], ne[x - 16]);
      ne[x] = O | 0, re[x] = B | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: a, Dh: f, Dl: h, Eh: l, El: g, Fh: d, Fl: p, Gh: w, Gl: E, Hh: $, Hl: M } = this;
    for (let x = 0; x < 80; x++) {
      const L = P.rotrSH(l, g, 14) ^ P.rotrSH(l, g, 18) ^ P.rotrBH(l, g, 41), S = P.rotrSL(l, g, 14) ^ P.rotrSL(l, g, 18) ^ P.rotrBL(l, g, 41), U = l & d ^ ~l & w, j = g & p ^ ~g & E, D = P.add5L(M, S, j, fb[x], re[x]), H = P.add5H(D, $, L, U, lb[x], ne[x]), b = D | 0, A = P.rotrSH(r, s, 28) ^ P.rotrBH(r, s, 34) ^ P.rotrBH(r, s, 39), B = P.rotrSL(r, s, 28) ^ P.rotrBL(r, s, 34) ^ P.rotrBL(r, s, 39), O = r & i ^ r & c ^ i & c, G = s & o ^ s & a ^ o & a;
      $ = w | 0, M = E | 0, w = d | 0, E = p | 0, d = l | 0, p = g | 0, { h: l, l: g } = P.add(f | 0, h | 0, H | 0, b | 0), f = c | 0, h = a | 0, c = i | 0, a = o | 0, i = r | 0, o = s | 0;
      const C = P.add3L(b, B, G);
      r = P.add3H(C, H, A, O), s = C | 0;
    }
    ({ h: r, l: s } = P.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = P.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l: a } = P.add(this.Ch | 0, this.Cl | 0, c | 0, a | 0), { h: f, l: h } = P.add(this.Dh | 0, this.Dl | 0, f | 0, h | 0), { h: l, l: g } = P.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: d, l: p } = P.add(this.Fh | 0, this.Fl | 0, d | 0, p | 0), { h: w, l: E } = P.add(this.Gh | 0, this.Gl | 0, w | 0, E | 0), { h: $, l: M } = P.add(this.Hh | 0, this.Hl | 0, $ | 0, M | 0), this.set(r, s, i, o, c, a, f, h, l, g, d, p, w, E, $, M);
  }
  roundClean() {
    ne.fill(0), re.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, hb = class extends Xr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, ub = class extends Xr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, db = class extends Xr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Oe(() => new Xr());
Oe(() => new hb());
Oe(() => new ub());
Oe(() => new db());
var Hr = { exports: {} };
Hr.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", c = "[object Boolean]", a = "[object Date]", f = "[object Error]", h = "[object Function]", l = "[object GeneratorFunction]", g = "[object Map]", d = "[object Number]", p = "[object Object]", w = "[object Promise]", E = "[object RegExp]", $ = "[object Set]", M = "[object String]", x = "[object Symbol]", L = "[object WeakMap]", S = "[object ArrayBuffer]", U = "[object DataView]", j = "[object Float32Array]", D = "[object Float64Array]", H = "[object Int8Array]", b = "[object Int16Array]", A = "[object Int32Array]", B = "[object Uint8Array]", O = "[object Uint8ClampedArray]", G = "[object Uint16Array]", C = "[object Uint32Array]", Nt = /[\\^$.*+?()[\]{}|]/g, Kt = /\w*$/, Pe = /^\[object .+?Constructor\]$/, m = /^(?:0|[1-9]\d*)$/, I = {};
  I[i] = I[o] = I[S] = I[U] = I[c] = I[a] = I[j] = I[D] = I[H] = I[b] = I[A] = I[g] = I[d] = I[p] = I[E] = I[$] = I[M] = I[x] = I[B] = I[O] = I[G] = I[C] = !0, I[f] = I[h] = I[L] = !1;
  var Z = typeof ct == "object" && ct && ct.Object === Object && ct, Q = typeof self == "object" && self && self.Object === Object && self, q = Z || Q || Function("return this")(), rt = e && !e.nodeType && e, xn = rt && !0 && t && !t.nodeType && t, kn = xn && xn.exports === rt;
  function is(u, y) {
    return u.set(y[0], y[1]), u;
  }
  function sf(u, y) {
    return u.add(y), u;
  }
  function of(u, y) {
    for (var v = -1, N = u ? u.length : 0; ++v < N && y(u[v], v, u) !== !1; )
      ;
    return u;
  }
  function cf(u, y) {
    for (var v = -1, N = y.length, nt = u.length; ++v < N; )
      u[nt + v] = y[v];
    return u;
  }
  function uo(u, y, v, N) {
    for (var nt = -1, at = u ? u.length : 0; ++nt < at; )
      v = y(v, u[nt], nt, u);
    return v;
  }
  function af(u, y) {
    for (var v = -1, N = Array(u); ++v < u; )
      N[v] = y(v);
    return N;
  }
  function lf(u, y) {
    return u == null ? void 0 : u[y];
  }
  function go(u) {
    var y = !1;
    if (u != null && typeof u.toString != "function")
      try {
        y = !!(u + "");
      } catch {
      }
    return y;
  }
  function bo(u) {
    var y = -1, v = Array(u.size);
    return u.forEach(function(N, nt) {
      v[++y] = [nt, N];
    }), v;
  }
  function os(u, y) {
    return function(v) {
      return u(y(v));
    };
  }
  function po(u) {
    var y = -1, v = Array(u.size);
    return u.forEach(function(N) {
      v[++y] = N;
    }), v;
  }
  var ff = Array.prototype, hf = Function.prototype, Pn = Object.prototype, cs = q["__core-js_shared__"], xo = function() {
    var u = /[^.]+$/.exec(cs && cs.keys && cs.keys.IE_PROTO || "");
    return u ? "Symbol(src)_1." + u : "";
  }(), wo = hf.toString, Vt = Pn.hasOwnProperty, Fn = Pn.toString, uf = RegExp(
    "^" + wo.call(Vt).replace(Nt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), yo = kn ? q.Buffer : void 0, mo = q.Symbol, So = q.Uint8Array, df = os(Object.getPrototypeOf, Object), gf = Object.create, bf = Pn.propertyIsEnumerable, pf = ff.splice, Ao = Object.getOwnPropertySymbols, xf = yo ? yo.isBuffer : void 0, wf = os(Object.keys, Object), as = Re(q, "DataView"), wn = Re(q, "Map"), ls = Re(q, "Promise"), fs = Re(q, "Set"), hs = Re(q, "WeakMap"), yn = Re(Object, "create"), yf = ve(as), mf = ve(wn), Sf = ve(ls), Af = ve(fs), Ef = ve(hs), Eo = mo ? mo.prototype : void 0, vo = Eo ? Eo.valueOf : void 0;
  function Ae(u) {
    var y = -1, v = u ? u.length : 0;
    for (this.clear(); ++y < v; ) {
      var N = u[y];
      this.set(N[0], N[1]);
    }
  }
  function vf() {
    this.__data__ = yn ? yn(null) : {};
  }
  function If(u) {
    return this.has(u) && delete this.__data__[u];
  }
  function Lf(u) {
    var y = this.__data__;
    if (yn) {
      var v = y[u];
      return v === r ? void 0 : v;
    }
    return Vt.call(y, u) ? y[u] : void 0;
  }
  function $f(u) {
    var y = this.__data__;
    return yn ? y[u] !== void 0 : Vt.call(y, u);
  }
  function Mf(u, y) {
    var v = this.__data__;
    return v[u] = yn && y === void 0 ? r : y, this;
  }
  Ae.prototype.clear = vf, Ae.prototype.delete = If, Ae.prototype.get = Lf, Ae.prototype.has = $f, Ae.prototype.set = Mf;
  function Ct(u) {
    var y = -1, v = u ? u.length : 0;
    for (this.clear(); ++y < v; ) {
      var N = u[y];
      this.set(N[0], N[1]);
    }
  }
  function _f() {
    this.__data__ = [];
  }
  function Bf(u) {
    var y = this.__data__, v = zn(y, u);
    if (v < 0)
      return !1;
    var N = y.length - 1;
    return v == N ? y.pop() : pf.call(y, v, 1), !0;
  }
  function Df(u) {
    var y = this.__data__, v = zn(y, u);
    return v < 0 ? void 0 : y[v][1];
  }
  function Hf(u) {
    return zn(this.__data__, u) > -1;
  }
  function Uf(u, y) {
    var v = this.__data__, N = zn(v, u);
    return N < 0 ? v.push([u, y]) : v[N][1] = y, this;
  }
  Ct.prototype.clear = _f, Ct.prototype.delete = Bf, Ct.prototype.get = Df, Ct.prototype.has = Hf, Ct.prototype.set = Uf;
  function Fe(u) {
    var y = -1, v = u ? u.length : 0;
    for (this.clear(); ++y < v; ) {
      var N = u[y];
      this.set(N[0], N[1]);
    }
  }
  function Nf() {
    this.__data__ = {
      hash: new Ae(),
      map: new (wn || Ct)(),
      string: new Ae()
    };
  }
  function Cf(u) {
    return Rn(this, u).delete(u);
  }
  function Of(u) {
    return Rn(this, u).get(u);
  }
  function jf(u) {
    return Rn(this, u).has(u);
  }
  function Tf(u, y) {
    return Rn(this, u).set(u, y), this;
  }
  Fe.prototype.clear = Nf, Fe.prototype.delete = Cf, Fe.prototype.get = Of, Fe.prototype.has = jf, Fe.prototype.set = Tf;
  function ze(u) {
    this.__data__ = new Ct(u);
  }
  function kf() {
    this.__data__ = new Ct();
  }
  function Pf(u) {
    return this.__data__.delete(u);
  }
  function Ff(u) {
    return this.__data__.get(u);
  }
  function zf(u) {
    return this.__data__.has(u);
  }
  function Rf(u, y) {
    var v = this.__data__;
    if (v instanceof Ct) {
      var N = v.__data__;
      if (!wn || N.length < n - 1)
        return N.push([u, y]), this;
      v = this.__data__ = new Fe(N);
    }
    return v.set(u, y), this;
  }
  ze.prototype.clear = kf, ze.prototype.delete = Pf, ze.prototype.get = Ff, ze.prototype.has = zf, ze.prototype.set = Rf;
  function Gf(u, y) {
    var v = gs(u) || gh(u) ? af(u.length, String) : [], N = v.length, nt = !!N;
    for (var at in u)
      Vt.call(u, at) && !(nt && (at == "length" || fh(at, N))) && v.push(at);
    return v;
  }
  function Io(u, y, v) {
    var N = u[y];
    (!(Vt.call(u, y) && _o(N, v)) || v === void 0 && !(y in u)) && (u[y] = v);
  }
  function zn(u, y) {
    for (var v = u.length; v--; )
      if (_o(u[v][0], y))
        return v;
    return -1;
  }
  function Kf(u, y) {
    return u && Lo(y, bs(y), u);
  }
  function us(u, y, v, N, nt, at, Ot) {
    var lt;
    if (N && (lt = at ? N(u, nt, at, Ot) : N(u)), lt !== void 0)
      return lt;
    if (!Gn(u))
      return u;
    var Ho = gs(u);
    if (Ho) {
      if (lt = ch(u), !y)
        return sh(u, lt);
    } else {
      var Ge = Ee(u), Uo = Ge == h || Ge == l;
      if (ph(u))
        return Qf(u, y);
      if (Ge == p || Ge == i || Uo && !at) {
        if (go(u))
          return at ? u : {};
        if (lt = ah(Uo ? {} : u), !y)
          return ih(u, Kf(lt, u));
      } else {
        if (!I[Ge])
          return at ? u : {};
        lt = lh(u, Ge, us, y);
      }
    }
    Ot || (Ot = new ze());
    var No = Ot.get(u);
    if (No)
      return No;
    if (Ot.set(u, lt), !Ho)
      var Co = v ? oh(u) : bs(u);
    return of(Co || u, function(ps, Kn) {
      Co && (Kn = ps, ps = u[Kn]), Io(lt, Kn, us(ps, y, v, N, Kn, u, Ot));
    }), lt;
  }
  function Vf(u) {
    return Gn(u) ? gf(u) : {};
  }
  function Wf(u, y, v) {
    var N = y(u);
    return gs(u) ? N : cf(N, v(u));
  }
  function Yf(u) {
    return Fn.call(u);
  }
  function qf(u) {
    if (!Gn(u) || uh(u))
      return !1;
    var y = Do(u) || go(u) ? uf : Pe;
    return y.test(ve(u));
  }
  function Zf(u) {
    if (!Mo(u))
      return wf(u);
    var y = [];
    for (var v in Object(u))
      Vt.call(u, v) && v != "constructor" && y.push(v);
    return y;
  }
  function Qf(u, y) {
    if (y)
      return u.slice();
    var v = new u.constructor(u.length);
    return u.copy(v), v;
  }
  function ds(u) {
    var y = new u.constructor(u.byteLength);
    return new So(y).set(new So(u)), y;
  }
  function Xf(u, y) {
    var v = y ? ds(u.buffer) : u.buffer;
    return new u.constructor(v, u.byteOffset, u.byteLength);
  }
  function Jf(u, y, v) {
    var N = y ? v(bo(u), !0) : bo(u);
    return uo(N, is, new u.constructor());
  }
  function th(u) {
    var y = new u.constructor(u.source, Kt.exec(u));
    return y.lastIndex = u.lastIndex, y;
  }
  function eh(u, y, v) {
    var N = y ? v(po(u), !0) : po(u);
    return uo(N, sf, new u.constructor());
  }
  function nh(u) {
    return vo ? Object(vo.call(u)) : {};
  }
  function rh(u, y) {
    var v = y ? ds(u.buffer) : u.buffer;
    return new u.constructor(v, u.byteOffset, u.length);
  }
  function sh(u, y) {
    var v = -1, N = u.length;
    for (y || (y = Array(N)); ++v < N; )
      y[v] = u[v];
    return y;
  }
  function Lo(u, y, v, N) {
    v || (v = {});
    for (var nt = -1, at = y.length; ++nt < at; ) {
      var Ot = y[nt], lt = void 0;
      Io(v, Ot, lt === void 0 ? u[Ot] : lt);
    }
    return v;
  }
  function ih(u, y) {
    return Lo(u, $o(u), y);
  }
  function oh(u) {
    return Wf(u, bs, $o);
  }
  function Rn(u, y) {
    var v = u.__data__;
    return hh(y) ? v[typeof y == "string" ? "string" : "hash"] : v.map;
  }
  function Re(u, y) {
    var v = lf(u, y);
    return qf(v) ? v : void 0;
  }
  var $o = Ao ? os(Ao, Object) : yh, Ee = Yf;
  (as && Ee(new as(new ArrayBuffer(1))) != U || wn && Ee(new wn()) != g || ls && Ee(ls.resolve()) != w || fs && Ee(new fs()) != $ || hs && Ee(new hs()) != L) && (Ee = function(u) {
    var y = Fn.call(u), v = y == p ? u.constructor : void 0, N = v ? ve(v) : void 0;
    if (N)
      switch (N) {
        case yf:
          return U;
        case mf:
          return g;
        case Sf:
          return w;
        case Af:
          return $;
        case Ef:
          return L;
      }
    return y;
  });
  function ch(u) {
    var y = u.length, v = u.constructor(y);
    return y && typeof u[0] == "string" && Vt.call(u, "index") && (v.index = u.index, v.input = u.input), v;
  }
  function ah(u) {
    return typeof u.constructor == "function" && !Mo(u) ? Vf(df(u)) : {};
  }
  function lh(u, y, v, N) {
    var nt = u.constructor;
    switch (y) {
      case S:
        return ds(u);
      case c:
      case a:
        return new nt(+u);
      case U:
        return Xf(u, N);
      case j:
      case D:
      case H:
      case b:
      case A:
      case B:
      case O:
      case G:
      case C:
        return rh(u, N);
      case g:
        return Jf(u, N, v);
      case d:
      case M:
        return new nt(u);
      case E:
        return th(u);
      case $:
        return eh(u, N, v);
      case x:
        return nh(u);
    }
  }
  function fh(u, y) {
    return y = y ?? s, !!y && (typeof u == "number" || m.test(u)) && u > -1 && u % 1 == 0 && u < y;
  }
  function hh(u) {
    var y = typeof u;
    return y == "string" || y == "number" || y == "symbol" || y == "boolean" ? u !== "__proto__" : u === null;
  }
  function uh(u) {
    return !!xo && xo in u;
  }
  function Mo(u) {
    var y = u && u.constructor, v = typeof y == "function" && y.prototype || Pn;
    return u === v;
  }
  function ve(u) {
    if (u != null) {
      try {
        return wo.call(u);
      } catch {
      }
      try {
        return u + "";
      } catch {
      }
    }
    return "";
  }
  function dh(u) {
    return us(u, !0, !0);
  }
  function _o(u, y) {
    return u === y || u !== u && y !== y;
  }
  function gh(u) {
    return bh(u) && Vt.call(u, "callee") && (!bf.call(u, "callee") || Fn.call(u) == i);
  }
  var gs = Array.isArray;
  function Bo(u) {
    return u != null && xh(u.length) && !Do(u);
  }
  function bh(u) {
    return wh(u) && Bo(u);
  }
  var ph = xf || mh;
  function Do(u) {
    var y = Gn(u) ? Fn.call(u) : "";
    return y == h || y == l;
  }
  function xh(u) {
    return typeof u == "number" && u > -1 && u % 1 == 0 && u <= s;
  }
  function Gn(u) {
    var y = typeof u;
    return !!u && (y == "object" || y == "function");
  }
  function wh(u) {
    return !!u && typeof u == "object";
  }
  function bs(u) {
    return Bo(u) ? Gf(u) : Zf(u);
  }
  function yh() {
    return [];
  }
  function mh() {
    return !1;
  }
  t.exports = dh;
})(Hr, Hr.exports);
Hr.exports;
var Ys;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Ys || (Ys = {}));
function gb(t, e) {
  return { type: Ys.Address, version: t, hash160: e };
}
function bb(t) {
  return Qr.c32address(t.version, t.hash160);
}
const pb = (t) => Fg(z0(t)), xb = (t) => pt(pb(t));
J.hmacSha256Sync = (t, ...e) => {
  const n = P0.create(z0, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function wb(t, e = "mainnet") {
  e = O0(e), t = typeof t == "string" ? ut(t) : t;
  const n = Ug(Tt.P2PKH, e), r = gb(n, xb(t));
  return bb(r);
}
function yb(t, e) {
  const n = it.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = wb(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new it.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function mb(t, e = null) {
  let n;
  e ? n = yb(t, e) : n = it.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const Mc = "_blockstackDidCheckEchoReply", Sb = "echoReply", Ab = "authContinuation";
function Eb(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function vb() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[Mc];
  if (typeof e == "boolean")
    return e;
  const n = Eb(t.location.search), r = n[Sb];
  if (r) {
    t[Mc] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[Ab];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class Mn {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new Pr();
    else
      throw new Kh("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new lc(e.sessionOptions) : this.store = new lc() : e ? this.store = new ac(e.sessionOptions) : this.store = new ac();
  }
  makeAuthRequestToken(e, n, r, s, i, o = Wh().getTime(), c = {}) {
    const a = this.appConfig;
    if (!a)
      throw new Os("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || a.redirectURI(), r = r || a.manifestURI(), s = s || a.scopes, i = i || a.appDomain, fg(e, n, r, s, i, o, c);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = lg();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = Si("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (vb())
        return qe.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      qe.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = uu()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Vn("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = it.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await bg(e))
      throw new Vn("Invalid authentication response.");
    let c = i.private_key, a = i.core_token;
    if (Ss(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            c = await oc(s, i.private_key);
          } catch {
            if (qe.warn("Failed decryption of appPrivateKey, will try to use as given"), !J.isValidPrivateKey(i.private_key))
              throw new Vn("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (a != null)
          try {
            a = await oc(s, a);
          } catch {
            qe.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Vn("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let f = cu, h;
    Ss(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (f = i.hubUrl), Ss(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (h = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: U0(i.iss),
      appPrivateKey: c,
      coreSessionToken: a,
      authResponseToken: e,
      hubUrl: f,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: h
    }, g = i.profile_url;
    if (!l.profile && g) {
      const d = await n(g);
      if (!d.ok)
        l.profile = Object.assign({}, zh);
      else {
        const p = await d.text(), w = JSON.parse(p);
        l.profile = mb(w[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new Os("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), n1(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), r1(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
Mn.prototype.makeAuthRequest = Mn.prototype.makeAuthRequestToken;
const Ib = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], Lb = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = Ib(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!Jr(r.id));
  return e.concat(n);
}, Jr = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), zi = "STX_PROVIDER", Dt = () => typeof window > "u" ? null : window.localStorage.getItem(zi), Z0 = (t) => {
  typeof window < "u" && window.localStorage.setItem(zi, t);
}, Q0 = () => {
  typeof window < "u" && window.localStorage.removeItem(zi);
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
            var B = b.shift();
            return { done: B === void 0, value: B };
          }
        };
        return r.iterable && (A[Symbol.iterator] = function() {
          return A;
        }), A;
      }
      function h(b) {
        this.map = {}, b instanceof h ? b.forEach(function(A, B) {
          this.append(B, A);
        }, this) : Array.isArray(b) ? b.forEach(function(A) {
          if (A.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + A.length);
          this.append(A[0], A[1]);
        }, this) : b && Object.getOwnPropertyNames(b).forEach(function(A) {
          this.append(A, b[A]);
        }, this);
      }
      h.prototype.append = function(b, A) {
        b = c(b), A = a(A);
        var B = this.map[b];
        this.map[b] = B ? B + ", " + A : A;
      }, h.prototype.delete = function(b) {
        delete this.map[c(b)];
      }, h.prototype.get = function(b) {
        return b = c(b), this.has(b) ? this.map[b] : null;
      }, h.prototype.has = function(b) {
        return this.map.hasOwnProperty(c(b));
      }, h.prototype.set = function(b, A) {
        this.map[c(b)] = a(A);
      }, h.prototype.forEach = function(b, A) {
        for (var B in this.map)
          this.map.hasOwnProperty(B) && b.call(A, this.map[B], B, this);
      }, h.prototype.keys = function() {
        var b = [];
        return this.forEach(function(A, B) {
          b.push(B);
        }), f(b);
      }, h.prototype.values = function() {
        var b = [];
        return this.forEach(function(A) {
          b.push(A);
        }), f(b);
      }, h.prototype.entries = function() {
        var b = [];
        return this.forEach(function(A, B) {
          b.push([B, A]);
        }), f(b);
      }, r.iterable && (h.prototype[Symbol.iterator] = h.prototype.entries);
      function l(b) {
        if (!b._noBody) {
          if (b.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          b.bodyUsed = !0;
        }
      }
      function g(b) {
        return new Promise(function(A, B) {
          b.onload = function() {
            A(b.result);
          }, b.onerror = function() {
            B(b.error);
          };
        });
      }
      function d(b) {
        var A = new FileReader(), B = g(A);
        return A.readAsArrayBuffer(b), B;
      }
      function p(b) {
        var A = new FileReader(), B = g(A), O = /charset=([A-Za-z0-9_-]+)/.exec(b.type), G = O ? O[1] : "utf-8";
        return A.readAsText(b, G), B;
      }
      function w(b) {
        for (var A = new Uint8Array(b), B = new Array(A.length), O = 0; O < A.length; O++)
          B[O] = String.fromCharCode(A[O]);
        return B.join("");
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
        var B = A.body;
        if (b instanceof L) {
          if (b.bodyUsed)
            throw new TypeError("Already read");
          this.url = b.url, this.credentials = b.credentials, A.headers || (this.headers = new h(b.headers)), this.method = b.method, this.mode = b.mode, this.signal = b.signal, !B && b._bodyInit != null && (B = b._bodyInit, b.bodyUsed = !0);
        } else
          this.url = String(b);
        if (this.credentials = A.credentials || this.credentials || "same-origin", (A.headers || !this.headers) && (this.headers = new h(A.headers)), this.method = x(A.method || this.method || "GET"), this.mode = A.mode || this.mode || null, this.signal = A.signal || this.signal || function() {
          if ("AbortController" in n) {
            var C = new AbortController();
            return C.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && B)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(B), (this.method === "GET" || this.method === "HEAD") && (A.cache === "no-store" || A.cache === "no-cache")) {
          var O = /([?&])_=[^&]*/;
          if (O.test(this.url))
            this.url = this.url.replace(O, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var G = /\?/;
            this.url += (G.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      L.prototype.clone = function() {
        return new L(this, { body: this._bodyInit });
      };
      function S(b) {
        var A = new FormData();
        return b.trim().split("&").forEach(function(B) {
          if (B) {
            var O = B.split("="), G = O.shift().replace(/\+/g, " "), C = O.join("=").replace(/\+/g, " ");
            A.append(decodeURIComponent(G), decodeURIComponent(C));
          }
        }), A;
      }
      function U(b) {
        var A = new h(), B = b.replace(/\r?\n[\t ]+/g, " ");
        return B.split("\r").map(function(O) {
          return O.indexOf(`
`) === 0 ? O.substr(1, O.length) : O;
        }).forEach(function(O) {
          var G = O.split(":"), C = G.shift().trim();
          if (C) {
            var Nt = G.join(":").trim();
            try {
              A.append(C, Nt);
            } catch (Kt) {
              console.warn("Response " + Kt.message);
            }
          }
        }), A;
      }
      $.call(L.prototype);
      function j(b, A) {
        if (!(this instanceof j))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (A || (A = {}), this.type = "default", this.status = A.status === void 0 ? 200 : A.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = A.statusText === void 0 ? "" : "" + A.statusText, this.headers = new h(A.headers), this.url = A.url || "", this._initBody(b);
      }
      $.call(j.prototype), j.prototype.clone = function() {
        return new j(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new h(this.headers),
          url: this.url
        });
      }, j.error = function() {
        var b = new j(null, { status: 200, statusText: "" });
        return b.ok = !1, b.status = 0, b.type = "error", b;
      };
      var D = [301, 302, 303, 307, 308];
      j.redirect = function(b, A) {
        if (D.indexOf(A) === -1)
          throw new RangeError("Invalid status code");
        return new j(null, { status: A, headers: { location: b } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(A, B) {
          this.message = A, this.name = B;
          var O = Error(A);
          this.stack = O.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function H(b, A) {
        return new Promise(function(B, O) {
          var G = new L(b, A);
          if (G.signal && G.signal.aborted)
            return O(new e.DOMException("Aborted", "AbortError"));
          var C = new XMLHttpRequest();
          function Nt() {
            C.abort();
          }
          C.onload = function() {
            var m = {
              statusText: C.statusText,
              headers: U(C.getAllResponseHeaders() || "")
            };
            G.url.indexOf("file://") === 0 && (C.status < 200 || C.status > 599) ? m.status = 200 : m.status = C.status, m.url = "responseURL" in C ? C.responseURL : m.headers.get("X-Request-URL");
            var I = "response" in C ? C.response : C.responseText;
            setTimeout(function() {
              B(new j(I, m));
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
          function Kt(m) {
            try {
              return m === "" && n.location.href ? n.location.href : m;
            } catch {
              return m;
            }
          }
          if (C.open(G.method, Kt(G.url), !0), G.credentials === "include" ? C.withCredentials = !0 : G.credentials === "omit" && (C.withCredentials = !1), "responseType" in C && (r.blob ? C.responseType = "blob" : r.arrayBuffer && (C.responseType = "arraybuffer")), A && typeof A.headers == "object" && !(A.headers instanceof h || n.Headers && A.headers instanceof n.Headers)) {
            var Pe = [];
            Object.getOwnPropertyNames(A.headers).forEach(function(m) {
              Pe.push(c(m)), C.setRequestHeader(m, a(A.headers[m]));
            }), G.headers.forEach(function(m, I) {
              Pe.indexOf(I) === -1 && C.setRequestHeader(I, m);
            });
          } else
            G.headers.forEach(function(m, I) {
              C.setRequestHeader(I, m);
            });
          G.signal && (G.signal.addEventListener("abort", Nt), C.onreadystatechange = function() {
            C.readyState === 4 && G.signal.removeEventListener("abort", Nt);
          }), C.send(typeof G._bodyInit > "u" ? null : G._bodyInit);
        });
      }
      return H.polyfill = !0, n.fetch || (n.fetch = H, n.Headers = h, n.Request = L, n.Response = j), e.Headers = h, e.Request = L, e.Response = j, e.fetch = H, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : ct);
})();
const $b = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Mb(t, e) {
  const n = {};
  return Object.assign(n, $b, e), await fetch(t, n);
}
function _b(t) {
  let e = Mb, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Bb(...t) {
  const { fetchLib: e, middlewares: n } = _b(t);
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
var ln;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ln || (ln = {}));
var De;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(De || (De = {}));
var _c;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(_c || (_c = {}));
const Db = "https://api.mainnet.hiro.so", Hb = "https://api.testnet.hiro.so", Ub = "http://localhost:3999", Nb = ["mainnet", "testnet", "devnet", "mocknet"];
class He {
  constructor(e) {
    this.version = De.Mainnet, this.chainId = ln.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === De.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Bb();
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
He.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new qs();
    case "testnet":
      return new Zs();
    case "devnet":
      return new Cb();
    case "mocknet":
      return new X0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Nb.join(", ")}`);
  }
};
He.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : He.fromName(t);
class qs extends He {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Db,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = De.Mainnet, this.chainId = ln.Mainnet;
  }
}
class Zs extends He {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Hb,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = De.Testnet, this.chainId = ln.Testnet;
  }
}
class X0 extends He {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ub,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = De.Testnet, this.chainId = ln.Testnet;
  }
}
const Cb = X0;
var Qs;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Qs || (Qs = {}));
var Bc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Bc || (Bc = {}));
Qs.Mainnet;
var Ur;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ur || (Ur = {}));
var Dc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Dc || (Dc = {}));
Ur.Mainnet;
const Ob = 128, jb = 128, J0 = 16;
var Hc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Hc || (Hc = {}));
var Uc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Uc || (Uc = {}));
var yt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(yt || (yt = {}));
const $s = ["onChainOnly", "offChainOnly", "any"];
$s[0] + "", yt.OnChainOnly, $s[1] + "", yt.OffChainOnly, $s[2] + "", yt.Any, yt.OnChainOnly + "", yt.OnChainOnly, yt.OffChainOnly + "", yt.OffChainOnly, yt.Any + "", yt.Any;
var Nc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Nc || (Nc = {}));
var Cc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Cc || (Cc = {}));
var Oc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Oc || (Oc = {}));
var jc;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(jc || (jc = {}));
var Tc;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Tc || (Tc = {}));
var kc;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(kc || (kc = {}));
var Pc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Pc || (Pc = {}));
var Fc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Fc || (Fc = {}));
var zc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(zc || (zc = {}));
var Rc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Rc || (Rc = {}));
var Gc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Gc || (Gc = {}));
var Kc;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Kc || (Kc = {}));
var Vc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Vc || (Vc = {}));
let Tb = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, kb = class extends Tb {
  constructor(e) {
    super(e);
  }
};
function Xs(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Pb(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function tl(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Fb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Xs(t.outputLen), Xs(t.blockLen);
}
function zb(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Rb(t, e) {
  tl(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ms = {
  number: Xs,
  bool: Pb,
  bytes: tl,
  hash: Fb,
  exists: zb,
  output: Rb
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _s = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), vt = (t, e) => t << 32 - e | t >>> e, Gb = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Gb)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Kb(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function el(t) {
  if (typeof t == "string" && (t = Kb(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Vb = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function je(t) {
  const e = (r) => t().update(el(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Wb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), a = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + a, o, r), t.setUint32(e + f, c, r);
}
let Ri = class extends Vb {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = _s(this.buffer);
  }
  update(e) {
    Ms.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = el(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const a = _s(e);
        for (; s <= i - o; o += s)
          this.process(a, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ms.exists(this), Ms.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Wb(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = _s(e), a = this.outputLen;
    if (a % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = a / 4, h = this.get();
    if (f > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      c.setUint32(4 * l, h[l], i);
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
const Yb = (t, e, n) => t & e ^ ~t & n, qb = (t, e, n) => t & e ^ t & n ^ e & n, Zb = new Uint32Array([
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
]), se = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ie = new Uint32Array(64);
let nl = class extends Ri {
  constructor() {
    super(64, 32, 8, !1), this.A = se[0] | 0, this.B = se[1] | 0, this.C = se[2] | 0, this.D = se[3] | 0, this.E = se[4] | 0, this.F = se[5] | 0, this.G = se[6] | 0, this.H = se[7] | 0;
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
      ie[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = ie[l - 15], d = ie[l - 2], p = vt(g, 7) ^ vt(g, 18) ^ g >>> 3, w = vt(d, 17) ^ vt(d, 19) ^ d >>> 10;
      ie[l] = w + ie[l - 7] + p + ie[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: a, G: f, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const g = vt(c, 6) ^ vt(c, 11) ^ vt(c, 25), d = h + g + Yb(c, a, f) + Zb[l] + ie[l] | 0, w = (vt(r, 2) ^ vt(r, 13) ^ vt(r, 22)) + qb(r, s, i) | 0;
      h = f, f = a, a = c, c = o + d | 0, o = i, i = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, f = f + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, c, a, f, h);
  }
  roundClean() {
    ie.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Qb = class extends nl {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
je(() => new nl());
je(() => new Qb());
const Xb = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), rl = Uint8Array.from({ length: 16 }, (t, e) => e), Jb = rl.map((t) => (9 * t + 5) % 16);
let Gi = [rl], Ki = [Jb];
for (let t = 0; t < 4; t++)
  for (let e of [Gi, Ki])
    e.push(e[t].map((n) => Xb[n]));
const sl = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), t2 = Gi.map((t, e) => t.map((n) => sl[e][n])), e2 = Ki.map((t, e) => t.map((n) => sl[e][n])), n2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), r2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ir = (t, e) => t << e | t >>> 32 - e;
function Wc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const or = new Uint32Array(16);
let s2 = class extends Ri {
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
      or[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, a = c, f = this.h3 | 0, h = f, l = this.h4 | 0, g = l;
    for (let d = 0; d < 5; d++) {
      const p = 4 - d, w = n2[d], E = r2[d], $ = Gi[d], M = Ki[d], x = t2[d], L = e2[d];
      for (let S = 0; S < 16; S++) {
        const U = ir(r + Wc(d, i, c, f) + or[$[S]] + w, x[S]) + l | 0;
        r = l, l = f, f = ir(c, 10) | 0, c = i, i = U;
      }
      for (let S = 0; S < 16; S++) {
        const U = ir(s + Wc(p, o, a, h) + or[M[S]] + E, L[S]) + g | 0;
        s = g, g = h, h = ir(a, 10) | 0, a = o, o = U;
      }
    }
    this.set(this.h1 + c + h | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + a | 0);
  }
  roundClean() {
    or.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
je(() => new s2());
const cr = BigInt(2 ** 32 - 1), Js = BigInt(32);
function il(t, e = !1) {
  return e ? { h: Number(t & cr), l: Number(t >> Js & cr) } : { h: Number(t >> Js & cr) | 0, l: Number(t & cr) | 0 };
}
function i2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = il(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const o2 = (t, e) => BigInt(t >>> 0) << Js | BigInt(e >>> 0), c2 = (t, e, n) => t >>> n, a2 = (t, e, n) => t << 32 - n | e >>> n, l2 = (t, e, n) => t >>> n | e << 32 - n, f2 = (t, e, n) => t << 32 - n | e >>> n, h2 = (t, e, n) => t << 64 - n | e >>> n - 32, u2 = (t, e, n) => t >>> n - 32 | e << 64 - n, d2 = (t, e) => e, g2 = (t, e) => t, b2 = (t, e, n) => t << n | e >>> 32 - n, p2 = (t, e, n) => e << n | t >>> 32 - n, x2 = (t, e, n) => e << n - 32 | t >>> 64 - n, w2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function y2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const m2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), S2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, A2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), E2 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, v2 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), I2 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, F = {
  fromBig: il,
  split: i2,
  toBig: o2,
  shrSH: c2,
  shrSL: a2,
  rotrSH: l2,
  rotrSL: f2,
  rotrBH: h2,
  rotrBL: u2,
  rotr32H: d2,
  rotr32L: g2,
  rotlSH: b2,
  rotlSL: p2,
  rotlBH: x2,
  rotlBL: w2,
  add: y2,
  add3L: m2,
  add3H: S2,
  add4L: A2,
  add4H: E2,
  add5H: I2,
  add5L: v2
}, [L2, $2] = F.split([
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
].map((t) => BigInt(t))), oe = new Uint32Array(80), ce = new Uint32Array(80);
let ts = class extends Ri {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: a, Eh: f, El: h, Fh: l, Fl: g, Gh: d, Gl: p, Hh: w, Hl: E } = this;
    return [e, n, r, s, i, o, c, a, f, h, l, g, d, p, w, E];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, a, f, h, l, g, d, p, w, E) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = a | 0, this.Eh = f | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = d | 0, this.Gl = p | 0, this.Hh = w | 0, this.Hl = E | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      oe[x] = e.getUint32(n), ce[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const L = oe[x - 15] | 0, S = ce[x - 15] | 0, U = F.rotrSH(L, S, 1) ^ F.rotrSH(L, S, 8) ^ F.shrSH(L, S, 7), j = F.rotrSL(L, S, 1) ^ F.rotrSL(L, S, 8) ^ F.shrSL(L, S, 7), D = oe[x - 2] | 0, H = ce[x - 2] | 0, b = F.rotrSH(D, H, 19) ^ F.rotrBH(D, H, 61) ^ F.shrSH(D, H, 6), A = F.rotrSL(D, H, 19) ^ F.rotrBL(D, H, 61) ^ F.shrSL(D, H, 6), B = F.add4L(j, A, ce[x - 7], ce[x - 16]), O = F.add4H(B, U, b, oe[x - 7], oe[x - 16]);
      oe[x] = O | 0, ce[x] = B | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: a, Dh: f, Dl: h, Eh: l, El: g, Fh: d, Fl: p, Gh: w, Gl: E, Hh: $, Hl: M } = this;
    for (let x = 0; x < 80; x++) {
      const L = F.rotrSH(l, g, 14) ^ F.rotrSH(l, g, 18) ^ F.rotrBH(l, g, 41), S = F.rotrSL(l, g, 14) ^ F.rotrSL(l, g, 18) ^ F.rotrBL(l, g, 41), U = l & d ^ ~l & w, j = g & p ^ ~g & E, D = F.add5L(M, S, j, $2[x], ce[x]), H = F.add5H(D, $, L, U, L2[x], oe[x]), b = D | 0, A = F.rotrSH(r, s, 28) ^ F.rotrBH(r, s, 34) ^ F.rotrBH(r, s, 39), B = F.rotrSL(r, s, 28) ^ F.rotrBL(r, s, 34) ^ F.rotrBL(r, s, 39), O = r & i ^ r & c ^ i & c, G = s & o ^ s & a ^ o & a;
      $ = w | 0, M = E | 0, w = d | 0, E = p | 0, d = l | 0, p = g | 0, { h: l, l: g } = F.add(f | 0, h | 0, H | 0, b | 0), f = c | 0, h = a | 0, c = i | 0, a = o | 0, i = r | 0, o = s | 0;
      const C = F.add3L(b, B, G);
      r = F.add3H(C, H, A, O), s = C | 0;
    }
    ({ h: r, l: s } = F.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = F.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l: a } = F.add(this.Ch | 0, this.Cl | 0, c | 0, a | 0), { h: f, l: h } = F.add(this.Dh | 0, this.Dl | 0, f | 0, h | 0), { h: l, l: g } = F.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: d, l: p } = F.add(this.Fh | 0, this.Fl | 0, d | 0, p | 0), { h: w, l: E } = F.add(this.Gh | 0, this.Gl | 0, w | 0, E | 0), { h: $, l: M } = F.add(this.Hh | 0, this.Hl | 0, $ | 0, M | 0), this.set(r, s, i, o, c, a, f, h, l, g, d, p, w, E, $, M);
  }
  roundClean() {
    oe.fill(0), ce.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, M2 = class extends ts {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, _2 = class extends ts {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, B2 = class extends ts {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
je(() => new ts());
je(() => new M2());
je(() => new _2());
je(() => new B2());
var tt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(tt || (tt = {}));
var ti;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(ti || (ti = {}));
function Vi(t) {
  return ti[t];
}
var Nr;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Nr || (Nr = {}));
function ol(t, e, n) {
  const s = Ob;
  if (R2(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Nr.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
function cl(t) {
  const e = Qr.c32addressDecode(t);
  return {
    type: Nr.Address,
    version: e[0],
    hash160: e[1]
  };
}
function al(t) {
  const e = [];
  return e.push(ut(Ai(t.version, 1))), e.push(ut(t.hash160)), un(e);
}
function ll(t) {
  const e = [], n = Un(t.content), r = n.byteLength;
  return e.push(ut(Ai(r, t.lengthPrefixBytes))), e.push(n), un(e);
}
function Ht(t, e) {
  return un([Vi(t), e]);
}
function D2(t) {
  return new Uint8Array([Vi(t.type)]);
}
function H2(t) {
  return t.type === tt.OptionalNone ? new Uint8Array([Vi(t.type)]) : Ht(t.type, jn(t.value));
}
function U2(t) {
  const e = new Uint8Array(4);
  return kr(e, Math.ceil(t.value.length / 2), 0), Ht(t.type, Ft(e, ut(t.value)));
}
function N2(t) {
  const e = Da(Jh(BigInt(t.value), BigInt(jb)), J0);
  return Ht(t.type, e);
}
function C2(t) {
  const e = Da(BigInt(t.value), J0);
  return Ht(t.type, e);
}
function O2(t) {
  return Ht(t.type, al(cl(t.value)));
}
function j2(t) {
  const [e, n] = G2(t.value);
  return Ht(t.type, Ft(al(cl(e)), ll(ol(n))));
}
function T2(t) {
  return Ht(t.type, jn(t.value));
}
function k2(t) {
  const e = [], n = new Uint8Array(4);
  kr(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = jn(r);
    e.push(s);
  }
  return Ht(t.type, un(e));
}
function P2(t) {
  const e = [], n = new Uint8Array(4);
  kr(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = ol(s);
    e.push(ll(i));
    const o = jn(t.value[s]);
    e.push(o);
  }
  return Ht(t.type, un(e));
}
function fl(t, e) {
  const n = [], r = e == "ascii" ? eu(t.value) : Un(t.value), s = new Uint8Array(4);
  return kr(s, r.length, 0), n.push(s), n.push(r), Ht(t.type, un(n));
}
function F2(t) {
  return fl(t, "ascii");
}
function z2(t) {
  return fl(t, "utf8");
}
function Yc(t) {
  return pt(jn(t));
}
function jn(t) {
  switch (t.type) {
    case tt.BoolTrue:
    case tt.BoolFalse:
      return D2(t);
    case tt.OptionalNone:
    case tt.OptionalSome:
      return H2(t);
    case tt.Buffer:
      return U2(t);
    case tt.UInt:
      return C2(t);
    case tt.Int:
      return N2(t);
    case tt.PrincipalStandard:
      return O2(t);
    case tt.PrincipalContract:
      return j2(t);
    case tt.ResponseOk:
    case tt.ResponseErr:
      return T2(t);
    case tt.List:
      return k2(t);
    case tt.Tuple:
      return P2(t);
    case tt.StringASCII:
      return F2(t);
    case tt.StringUTF8:
      return z2(t);
    default:
      throw new kb("Unable to serialize. Invalid Clarity Value.");
  }
}
const R2 = (t, e) => t ? Un(t).length > e : !1;
function G2(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
function K2(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = _n(r);
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
    return BigInt(`0x${Y2(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Wi(t, e = 8) {
  return (typeof t == "bigint" ? t : K2(t)).toString(16).padStart(e * 2, "0");
}
function hl(t, e = 16) {
  const n = Wi(t, e);
  return _n(n);
}
function V2(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const W2 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Y2(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += W2[n];
  return e;
}
function _n(t) {
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
function Yi(t) {
  return new TextEncoder().encode(t);
}
function q2(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Z2(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function qc(t) {
  if (t.some(Z2))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function qi(...t) {
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
function gn(t) {
  return qi(...t.map((e) => typeof e == "number" ? qc([e]) : e instanceof Array ? qc(e) : e));
}
function es(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var ei;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ei || (ei = {}));
ei.Mainnet;
const Q2 = 128, X2 = 128, ul = 16;
var ni;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ni || (ni = {}));
var Zc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Zc || (Zc = {}));
var Qc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Qc || (Qc = {}));
var mt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(mt || (mt = {}));
const Bs = ["onChainOnly", "offChainOnly", "any"];
Bs[0] + "", mt.OnChainOnly, Bs[1] + "", mt.OffChainOnly, Bs[2] + "", mt.Any, mt.OnChainOnly + "", mt.OnChainOnly, mt.OffChainOnly + "", mt.OffChainOnly, mt.Any + "", mt.Any;
var ri;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ri || (ri = {}));
ri.Mainnet;
var Xc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Xc || (Xc = {}));
var Jc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Jc || (Jc = {}));
var ta;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(ta || (ta = {}));
var ea;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(ea || (ea = {}));
var na;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(na || (na = {}));
var ra;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(ra || (ra = {}));
var sa;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(sa || (sa = {}));
var ia;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(ia || (ia = {}));
var oa;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(oa || (oa = {}));
var ca;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(ca || (ca = {}));
var aa;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(aa || (aa = {}));
function si(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function J2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function dl(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function tp(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  si(t.outputLen), si(t.blockLen);
}
function ep(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function np(t, e) {
  dl(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ds = {
  number: si,
  bool: J2,
  bytes: dl,
  hash: tp,
  exists: ep,
  output: np
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Hs = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), It = (t, e) => t << 32 - e | t >>> e, rp = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!rp)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function sp(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function gl(t) {
  if (typeof t == "string" && (t = sp(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let ip = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Te(t) {
  const e = (r) => t().update(gl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function op(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), a = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + a, o, r), t.setUint32(e + f, c, r);
}
let Zi = class extends ip {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Hs(this.buffer);
  }
  update(e) {
    Ds.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = gl(e);
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
    Ds.exists(this), Ds.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    op(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = Hs(e), a = this.outputLen;
    if (a % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = a / 4, h = this.get();
    if (f > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      c.setUint32(4 * l, h[l], i);
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
const cp = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), bl = Uint8Array.from({ length: 16 }, (t, e) => e), ap = bl.map((t) => (9 * t + 5) % 16);
let Qi = [bl], Xi = [ap];
for (let t = 0; t < 4; t++)
  for (let e of [Qi, Xi])
    e.push(e[t].map((n) => cp[n]));
const pl = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), lp = Qi.map((t, e) => t.map((n) => pl[e][n])), fp = Xi.map((t, e) => t.map((n) => pl[e][n])), hp = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), up = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ar = (t, e) => t << e | t >>> 32 - e;
function la(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const lr = new Uint32Array(16);
let dp = class extends Zi {
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
      lr[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, a = c, f = this.h3 | 0, h = f, l = this.h4 | 0, g = l;
    for (let d = 0; d < 5; d++) {
      const p = 4 - d, w = hp[d], E = up[d], $ = Qi[d], M = Xi[d], x = lp[d], L = fp[d];
      for (let S = 0; S < 16; S++) {
        const U = ar(r + la(d, i, c, f) + lr[$[S]] + w, x[S]) + l | 0;
        r = l, l = f, f = ar(c, 10) | 0, c = i, i = U;
      }
      for (let S = 0; S < 16; S++) {
        const U = ar(s + la(p, o, a, h) + lr[M[S]] + E, L[S]) + g | 0;
        s = g, g = h, h = ar(a, 10) | 0, a = o, o = U;
      }
    }
    this.set(this.h1 + c + h | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + a | 0);
  }
  roundClean() {
    lr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Te(() => new dp());
const gp = (t, e, n) => t & e ^ ~t & n, bp = (t, e, n) => t & e ^ t & n ^ e & n, pp = new Uint32Array([
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
let xl = class extends Zi {
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
      const g = le[l - 15], d = le[l - 2], p = It(g, 7) ^ It(g, 18) ^ g >>> 3, w = It(d, 17) ^ It(d, 19) ^ d >>> 10;
      le[l] = w + le[l - 7] + p + le[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: a, G: f, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const g = It(c, 6) ^ It(c, 11) ^ It(c, 25), d = h + g + gp(c, a, f) + pp[l] + le[l] | 0, w = (It(r, 2) ^ It(r, 13) ^ It(r, 22)) + bp(r, s, i) | 0;
      h = f, f = a, a = c, c = o + d | 0, o = i, i = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, f = f + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, c, a, f, h);
  }
  roundClean() {
    le.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, xp = class extends xl {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Te(() => new xl());
Te(() => new xp());
const fr = BigInt(2 ** 32 - 1), ii = BigInt(32);
function wl(t, e = !1) {
  return e ? { h: Number(t & fr), l: Number(t >> ii & fr) } : { h: Number(t >> ii & fr) | 0, l: Number(t & fr) | 0 };
}
function wp(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = wl(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const yp = (t, e) => BigInt(t >>> 0) << ii | BigInt(e >>> 0), mp = (t, e, n) => t >>> n, Sp = (t, e, n) => t << 32 - n | e >>> n, Ap = (t, e, n) => t >>> n | e << 32 - n, Ep = (t, e, n) => t << 32 - n | e >>> n, vp = (t, e, n) => t << 64 - n | e >>> n - 32, Ip = (t, e, n) => t >>> n - 32 | e << 64 - n, Lp = (t, e) => e, $p = (t, e) => t, Mp = (t, e, n) => t << n | e >>> 32 - n, _p = (t, e, n) => e << n | t >>> 32 - n, Bp = (t, e, n) => e << n - 32 | t >>> 64 - n, Dp = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Hp(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Up = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Np = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Cp = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Op = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, jp = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Tp = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, z = {
  fromBig: wl,
  split: wp,
  toBig: yp,
  shrSH: mp,
  shrSL: Sp,
  rotrSH: Ap,
  rotrSL: Ep,
  rotrBH: vp,
  rotrBL: Ip,
  rotr32H: Lp,
  rotr32L: $p,
  rotlSH: Mp,
  rotlSL: _p,
  rotlBH: Bp,
  rotlBL: Dp,
  add: Hp,
  add3L: Up,
  add3H: Np,
  add4L: Cp,
  add4H: Op,
  add5H: Tp,
  add5L: jp
}, [kp, Pp] = z.split([
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
].map((t) => BigInt(t))), fe = new Uint32Array(80), he = new Uint32Array(80);
let ns = class extends Zi {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: a, Eh: f, El: h, Fh: l, Fl: g, Gh: d, Gl: p, Hh: w, Hl: E } = this;
    return [e, n, r, s, i, o, c, a, f, h, l, g, d, p, w, E];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, a, f, h, l, g, d, p, w, E) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = a | 0, this.Eh = f | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = d | 0, this.Gl = p | 0, this.Hh = w | 0, this.Hl = E | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      fe[x] = e.getUint32(n), he[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const L = fe[x - 15] | 0, S = he[x - 15] | 0, U = z.rotrSH(L, S, 1) ^ z.rotrSH(L, S, 8) ^ z.shrSH(L, S, 7), j = z.rotrSL(L, S, 1) ^ z.rotrSL(L, S, 8) ^ z.shrSL(L, S, 7), D = fe[x - 2] | 0, H = he[x - 2] | 0, b = z.rotrSH(D, H, 19) ^ z.rotrBH(D, H, 61) ^ z.shrSH(D, H, 6), A = z.rotrSL(D, H, 19) ^ z.rotrBL(D, H, 61) ^ z.shrSL(D, H, 6), B = z.add4L(j, A, he[x - 7], he[x - 16]), O = z.add4H(B, U, b, fe[x - 7], fe[x - 16]);
      fe[x] = O | 0, he[x] = B | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: a, Dh: f, Dl: h, Eh: l, El: g, Fh: d, Fl: p, Gh: w, Gl: E, Hh: $, Hl: M } = this;
    for (let x = 0; x < 80; x++) {
      const L = z.rotrSH(l, g, 14) ^ z.rotrSH(l, g, 18) ^ z.rotrBH(l, g, 41), S = z.rotrSL(l, g, 14) ^ z.rotrSL(l, g, 18) ^ z.rotrBL(l, g, 41), U = l & d ^ ~l & w, j = g & p ^ ~g & E, D = z.add5L(M, S, j, Pp[x], he[x]), H = z.add5H(D, $, L, U, kp[x], fe[x]), b = D | 0, A = z.rotrSH(r, s, 28) ^ z.rotrBH(r, s, 34) ^ z.rotrBH(r, s, 39), B = z.rotrSL(r, s, 28) ^ z.rotrBL(r, s, 34) ^ z.rotrBL(r, s, 39), O = r & i ^ r & c ^ i & c, G = s & o ^ s & a ^ o & a;
      $ = w | 0, M = E | 0, w = d | 0, E = p | 0, d = l | 0, p = g | 0, { h: l, l: g } = z.add(f | 0, h | 0, H | 0, b | 0), f = c | 0, h = a | 0, c = i | 0, a = o | 0, i = r | 0, o = s | 0;
      const C = z.add3L(b, B, G);
      r = z.add3H(C, H, A, O), s = C | 0;
    }
    ({ h: r, l: s } = z.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = z.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l: a } = z.add(this.Ch | 0, this.Cl | 0, c | 0, a | 0), { h: f, l: h } = z.add(this.Dh | 0, this.Dl | 0, f | 0, h | 0), { h: l, l: g } = z.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: d, l: p } = z.add(this.Fh | 0, this.Fl | 0, d | 0, p | 0), { h: w, l: E } = z.add(this.Gh | 0, this.Gl | 0, w | 0, E | 0), { h: $, l: M } = z.add(this.Hh | 0, this.Hl | 0, $ | 0, M | 0), this.set(r, s, i, o, c, a, f, h, l, g, d, p, w, E, $, M);
  }
  roundClean() {
    fe.fill(0), he.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Fp = class extends ns {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, zp = class extends ns {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Rp = class extends ns {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Te(() => new ns());
Te(() => new Fp());
Te(() => new zp());
Te(() => new Rp());
function Gp(t, e, n) {
  const s = Q2;
  if (ix(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ni.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var et;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(et || (et = {}));
class Kp extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Vp extends Kp {
  constructor(e) {
    super(e);
  }
}
function yl(t) {
  const e = [];
  return e.push(_n(Wi(t.version, 1))), e.push(_n(t.hash160)), gn(e);
}
function ml(t) {
  const e = [], n = Yi(t.content), r = n.byteLength;
  return e.push(_n(Wi(r, t.lengthPrefixBytes))), e.push(n), gn(e);
}
function Ut(t, e) {
  return gn([t, e]);
}
function Wp(t) {
  return new Uint8Array([t.type]);
}
function Yp(t) {
  return t.type === et.OptionalNone ? new Uint8Array([t.type]) : Ut(t.type, fn(t.value));
}
function qp(t) {
  const e = new Uint8Array(4);
  return es(e, t.buffer.length, 0), Ut(t.type, qi(e, t.buffer));
}
function Zp(t) {
  const e = hl(V2(t.value, BigInt(X2)), ul);
  return Ut(t.type, e);
}
function Qp(t) {
  const e = hl(t.value, ul);
  return Ut(t.type, e);
}
function Xp(t) {
  return Ut(t.type, yl(t.address));
}
function Jp(t) {
  return Ut(t.type, qi(yl(t.address), ml(t.contractName)));
}
function tx(t) {
  return Ut(t.type, fn(t.value));
}
function ex(t) {
  const e = [], n = new Uint8Array(4);
  es(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = fn(r);
    e.push(s);
  }
  return Ut(t.type, gn(e));
}
function nx(t) {
  const e = [], n = new Uint8Array(4);
  es(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Gp(s);
    e.push(ml(i));
    const o = fn(t.data[s]);
    e.push(o);
  }
  return Ut(t.type, gn(e));
}
function Sl(t, e) {
  const n = [], r = e == "ascii" ? q2(t.data) : Yi(t.data), s = new Uint8Array(4);
  return es(s, r.length, 0), n.push(s), n.push(r), Ut(t.type, gn(n));
}
function rx(t) {
  return Sl(t, "ascii");
}
function sx(t) {
  return Sl(t, "utf8");
}
function fn(t) {
  switch (t.type) {
    case et.BoolTrue:
    case et.BoolFalse:
      return Wp(t);
    case et.OptionalNone:
    case et.OptionalSome:
      return Yp(t);
    case et.Buffer:
      return qp(t);
    case et.UInt:
      return Qp(t);
    case et.Int:
      return Zp(t);
    case et.PrincipalStandard:
      return Xp(t);
    case et.PrincipalContract:
      return Jp(t);
    case et.ResponseOk:
    case et.ResponseErr:
      return tx(t);
    case et.List:
      return ex(t);
    case et.Tuple:
      return nx(t);
    case et.StringASCII:
      return rx(t);
    case et.StringUTF8:
      return sx(t);
    default:
      throw new Vp("Unable to serialize. Invalid Clarity Value.");
  }
}
const ix = (t, e) => t ? Yi(t).length > e : !1, ox = "connect-ui";
let yr, Al, ht = !1, oi = !1;
const Rt = (t, e = "") => () => {
}, cx = (t, e) => () => {
}, ax = "{visibility:hidden}.hydrated{visibility:inherit}", fa = {}, lx = "http://www.w3.org/2000/svg", fx = "http://www.w3.org/1999/xhtml", hx = (t) => t != null, Ji = (t) => (t = typeof t, t === "object" || t === "function");
function El(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const T = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], c = (f) => {
    for (let h = 0; h < f.length; h++)
      r = f[h], Array.isArray(r) ? c(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !Ji(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? ci(null, r) : r), i = s);
  };
  if (c(n), e) {
    const f = e.className || e.class;
    f && (e.class = typeof f != "object" ? f : Object.keys(f).filter((h) => f[h]).join(" "));
  }
  const a = ci(t, null);
  return a.$attrs$ = e, o.length > 0 && (a.$children$ = o), a;
}, ci = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, ux = {}, dx = (t) => t && t.$tag$ === ux, gx = (t, e) => t != null && !Ji(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, bx = (t) => bn(t).$hostElement$, px = (t, e, n) => {
  const r = st.ce(e, n);
  return t.dispatchEvent(r), r;
}, ha = /* @__PURE__ */ new WeakMap(), xx = (t, e, n) => {
  let r = Cr.get(t);
  jx && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Cr.set(t, r);
}, wx = (t, e, n, r) => {
  var s;
  let i = vl(e);
  const o = Cr.get(i);
  if (t = t.nodeType === 11 ? t : _t, o)
    if (typeof o == "string") {
      t = t.head || t;
      let c = ha.get(t), a;
      if (c || ha.set(t, c = /* @__PURE__ */ new Set()), !c.has(i)) {
        {
          a = _t.createElement("style"), a.innerHTML = o;
          const f = (s = st.$nonce$) !== null && s !== void 0 ? s : El(_t);
          f != null && a.setAttribute("nonce", f), t.insertBefore(a, t.querySelector("link"));
        }
        c && c.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, yx = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Rt("attachStyles", e.$tagName$), i = wx(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, vl = (t, e) => "sc-" + t.$tagName$, ua = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = ga(t, e), c = e.toLowerCase();
    if (e === "class") {
      const a = t.classList, f = da(n), h = da(r);
      a.remove(...f.filter((l) => l && !h.includes(l))), a.add(...h.filter((l) => l && !f.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : ga(rs, c) ? e = c.slice(2) : e = c[2] + e.slice(3), n && st.rel(t, e, n, !1), r && st.ael(t, e, r, !1);
    else {
      const a = Ji(r);
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
}, mx = /\s/, da = (t) => t ? t.split(mx) : [], Il = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || fa, o = e.$attrs$ || fa;
  for (r in i)
    r in o || ua(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    ua(s, r, i[r], o[r], n, e.$flags$);
}, to = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, c;
  if (s.$text$ !== null)
    o = s.$elm$ = _t.createTextNode(s.$text$);
  else {
    if (ht || (ht = s.$tag$ === "svg"), o = s.$elm$ = _t.createElementNS(ht ? lx : fx, s.$tag$), ht && s.$tag$ === "foreignObject" && (ht = !1), Il(null, s, ht), hx(yr) && o["s-si"] !== yr && o.classList.add(o["s-si"] = yr), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        c = to(t, s, i), c && o.appendChild(c);
    s.$tag$ === "svg" ? ht = !1 : o.tagName === "foreignObject" && (ht = !0);
  }
  return o;
}, Ll = (t, e, n, r, s, i) => {
  let o = t, c;
  for (o.shadowRoot && o.tagName === Al && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (c = to(null, n, s), c && (r[s].$elm$ = c, o.insertBefore(c, e)));
}, $l = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, Sx = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, c = e[0], a = e[o], f = r.length - 1, h = r[0], l = r[f], g;
  for (; s <= o && i <= f; )
    c == null ? c = e[++s] : a == null ? a = e[--o] : h == null ? h = r[++i] : l == null ? l = r[--f] : hr(c, h) ? (An(c, h), c = e[++s], h = r[++i]) : hr(a, l) ? (An(a, l), a = e[--o], l = r[--f]) : hr(c, l) ? (An(c, l), t.insertBefore(c.$elm$, a.$elm$.nextSibling), c = e[++s], l = r[--f]) : hr(a, h) ? (An(a, h), t.insertBefore(a.$elm$, c.$elm$), a = e[--o], h = r[++i]) : (g = to(e && e[i], n, i), h = r[++i], g && c.$elm$.parentNode.insertBefore(g, c.$elm$));
  s > o ? Ll(t, r[f + 1] == null ? null : r[f + 1].$elm$, n, r, i, f) : i > f && $l(e, s, o);
}, hr = (t, e) => t.$tag$ === e.$tag$, An = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (ht = i === "svg" ? !0 : i === "foreignObject" ? !1 : ht, Il(t, e, ht), r !== null && s !== null ? Sx(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), Ll(n, null, e, s, 0, s.length - 1)) : r !== null && $l(r, 0, r.length - 1), ht && i === "svg" && (ht = !1)) : t.$text$ !== o && (n.data = o);
}, Ax = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || ci(null, null), s = dx(e) ? e : T(null, null, e);
  Al = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, yr = n["s-sc"], An(r, s);
}, Ml = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, eo = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return Ml(t, t.$ancestorComponent$), kx(() => Ex(t, e));
}, Ex = (t, e) => {
  const n = Rt("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), $x(s, () => vx(t, r, e));
}, vx = async (t, e, n) => {
  const r = t.$hostElement$, s = Rt("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && yx(t);
  const o = Rt("render", t.$cmpMeta$.$tagName$);
  Ix(t, e), i && (i.map((c) => c()), r["s-rc"] = void 0), o(), s();
  {
    const c = r["s-p"], a = () => Lx(t);
    c.length === 0 ? a() : (Promise.all(c).then(a), t.$flags$ |= 4, c.length = 0);
  }
}, Ix = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, Ax(t, e);
  } catch (r) {
    Bn(r, t.$hostElement$);
  }
  return null;
}, Lx = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Rt("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, Bl(n), r(), t.$onReadyResolve$(n), s || _l()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && ro(() => eo(t, !1)), t.$flags$ &= -517;
}, _l = (t) => {
  Bl(_t.documentElement), ro(() => px(rs, "appload", { detail: { namespace: ox } }));
}, $x = (t, e) => t && t.then ? t.then(e) : e(), Bl = (t) => t.classList.add("hydrated"), Mx = (t, e) => bn(t).$instanceValues$.get(e), _x = (t, e, n, r) => {
  const s = bn(t), i = s.$instanceValues$.get(e), o = s.$flags$, c = s.$lazyInstance$;
  n = gx(n, r.$members$[e][0]);
  const a = Number.isNaN(i) && Number.isNaN(n), f = n !== i && !a;
  (!(o & 8) || i === void 0) && f && (s.$instanceValues$.set(e, n), c && (o & 18) === 2 && eo(s, !1));
}, Dl = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return Mx(this, i);
        },
        set(c) {
          _x(this, i, c, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, c, a) {
        st.jmp(() => {
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
}, Bx = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = Ox(n), s.then) {
        const a = cx();
        s = await s, a();
      }
      s.isProxied || (Dl(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const c = Rt("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (a) {
        Bn(a);
      }
      e.$flags$ &= -9, c();
    }
    if (s.style) {
      let c = s.style;
      const a = vl(n);
      if (!Cr.has(a)) {
        const f = Rt("registerStyles", n.$tagName$);
        xx(a, c, !!(n.$flags$ & 1)), f();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => eo(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, Dx = (t) => {
  if (!(st.$flags$ & 1)) {
    const e = bn(t), n = e.$cmpMeta$, r = Rt("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            Ml(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), Bx(t, e, n);
    }
    r();
  }
}, Hx = (t) => {
  st.$flags$ & 1 || bn(t);
}, Ux = (t, e = {}) => {
  var n;
  const r = Rt(), s = [], i = e.exclude || [], o = rs.customElements, c = _t.head, a = /* @__PURE__ */ c.querySelector("meta[charset]"), f = /* @__PURE__ */ _t.createElement("style"), h = [];
  let l, g = !0;
  Object.assign(st, e), st.$resourcesUrl$ = new URL(e.resourcesUrl || "./", _t.baseURI).href, t.map((d) => {
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
          super(M), M = this, Cx(M, w), w.$flags$ & 1 && M.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), g ? h.push(this) : st.jmp(() => Dx(this));
        }
        disconnectedCallback() {
          st.jmp(() => Hx(this));
        }
        componentOnReady() {
          return bn(this).$onReadyPromise$;
        }
      };
      w.$lazyBundleId$ = d[0], !i.includes(E) && !o.get(E) && (s.push(E), o.define(E, Dl(
        $,
        w,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    f.innerHTML = s + ax, f.setAttribute("data-styles", "");
    const d = (n = st.$nonce$) !== null && n !== void 0 ? n : El(_t);
    d != null && f.setAttribute("nonce", d), c.insertBefore(f, a ? a.nextSibling : c.firstChild);
  }
  g = !1, h.length ? h.map((d) => d.connectedCallback()) : st.jmp(() => l = setTimeout(_l, 30)), r();
}, no = /* @__PURE__ */ new WeakMap(), bn = (t) => no.get(t), Nx = (t, e) => no.set(e.$lazyInstance$ = t, e), Cx = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], no.set(t, n);
}, ga = (t, e) => e in t, Bn = (t, e) => (0, console.error)(t, e), Us = /* @__PURE__ */ new Map(), Ox = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = Us.get(s);
  if (i)
    return i[r];
  {
    const o = (c) => (Us.set(s, c), c[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => jy).then(o, Bn);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (Us.set(s, o), o[r]), Bn);
}, Cr = /* @__PURE__ */ new Map(), rs = typeof window < "u" ? window : {}, _t = rs.document || { head: {} }, st = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, Hl = (t) => Promise.resolve(t), jx = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), ba = [], Ul = [], Tx = (t, e) => (n) => {
  t.push(n), oi || (oi = !0, st.$flags$ & 4 ? ro(ai) : st.raf(ai));
}, pa = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      Bn(n);
    }
  t.length = 0;
}, ai = () => {
  pa(ba), pa(Ul), (oi = ba.length > 0) && st.raf(ai);
}, ro = (t) => Hl().then(t), kx = /* @__PURE__ */ Tx(Ul), Px = () => Hl(), Nl = (t, e) => typeof window > "u" ? Promise.resolve() : Px().then(() => Ux([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var Fx = Object.defineProperty, zx = Object.defineProperties, Rx = Object.getOwnPropertyDescriptors, Or = Object.getOwnPropertySymbols, Cl = Object.prototype.hasOwnProperty, Ol = Object.prototype.propertyIsEnumerable, xa = (t, e, n) => e in t ? Fx(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, li = (t, e) => {
  for (var n in e || (e = {})) Cl.call(e, n) && xa(t, n, e[n]);
  if (Or) for (var n of Or(e)) Ol.call(e, n) && xa(t, n, e[n]);
  return t;
}, fi = (t, e) => zx(t, Rx(e)), Gx = (t, e) => {
  var n = {};
  for (var r in t) Cl.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Or) for (var r of Or(t)) e.indexOf(r) < 0 && Ol.call(t, r) && (n[r] = t[r]);
  return n;
};
function jl() {
  return Jr(Dt()) || window.StacksProvider || window.BlockstackProvider;
}
function Kx(t) {
  return t ? typeof t == "string" ? He.fromName(t) : "version" in t ? t : "url" in t ? new qs({ url: t.url }) : t.transactionVersion === Ur.Mainnet ? new qs({ url: t.client.baseUrl }) : new Zs({ url: t.client.baseUrl }) : new Zs();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var Vx = (t) => {
  if (!t) {
    let e = new Pr(["store_write"], document.location.href);
    t = new Mn({ appConfig: e });
  }
  return t;
}, Wx = async (t, e = jl()) => {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  let { redirectTo: n = "/", manifestPath: r, onFinish: s, onCancel: i, sendToSignIn: o = !1, userSession: c, appDetails: a } = t, f = Vx(c);
  f.isUserSignedIn() && f.signUserOut();
  let h = f.generateAndStoreTransitKey(), l = f.makeAuthRequest(h, `${document.location.origin}${n}`, `${document.location.origin}${r}`, f.appConfig.scopes, void 0, void 0, { sendToSignIn: o, appDetails: a, connectVersion: "__VERSION__" });
  try {
    let g = await e.authenticationRequest(l);
    await f.handlePendingSignIn(g);
    let d = it.decodeToken(g), p = d == null ? void 0 : d.payload;
    s == null || s({ authResponse: g, authResponsePayload: p, userSession: f });
  } catch (g) {
    console.error("[Connect] Error during auth request", g), i == null || i();
  }
}, Yx = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(Yx || {}), qx = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(qx || {}), Tl = (t) => {
  let e = t;
  if (!e) {
    let n = new Pr(["store_write"], document.location.href);
    e = new Mn({ appConfig: n });
  }
  return e;
};
function Zx(t) {
  try {
    return Tl(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Qx = (t) => {
  let e = Tl(t).loadUserData().appPrivateKey, n = it.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function kl(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? fi(li({}, t), { message: Yc(e), domain: Yc(n) }) : fi(li({}, t), { message: pt(fn(e)), domain: pt(fn(n)) });
}
async function Xx(t, e) {
  return new it.TokenSigner("ES256k", e).signAsync(kl(t));
}
async function Jx(t) {
  let e = t, { userSession: n } = e, r = Gx(e, ["userSession"]);
  if (Zx(n)) {
    let { privateKey: s, publicKey: i } = Qx(n), o = fi(li({}, r), { publicKey: i });
    return Xx(o, s);
  }
  return it.createUnsecuredToken(kl(t));
}
var tw = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(tw || {}), Pl = "asigna-stx", wa = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === Pl && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(nw(t, e), "*");
}), ew = { authenticationRequest: async (t) => wa(t, "authenticationRequest"), transactionRequest: async (t) => wa(t, "transactionRequest") }, nw = (t, e) => ({ source: Pl, [e]: t }), rw = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = ew);
};
rw();
var Fl = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function sw(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = Dt(), o = jl();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    Nl();
    let c = (s = n == null ? void 0 : n.defaultProviders) != null ? s : Fl, a = Lb(c), f = document.createElement("connect-modal");
    f.defaultProviders = c, f.installedProviders = a, f.persistSelection = e;
    let h = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let l = () => {
      f.remove(), document.body.style.overflow = h;
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
var iw = sw(Wx, !1), ow = Q0;
function cw(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = fw(r);
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
    return BigInt(`0x${lw(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
const aw = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function lw(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += aw[n];
  return e;
}
function fw(t) {
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
function hi(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function hw(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function zl(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function uw(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  hi(t.outputLen), hi(t.blockLen);
}
function dw(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function gw(t, e) {
  zl(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ns = {
  number: hi,
  bool: hw,
  bytes: zl,
  hash: uw,
  exists: dw,
  output: gw
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Cs = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Lt = (t, e) => t << 32 - e | t >>> e, bw = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!bw)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function pw(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Rl(t) {
  if (typeof t == "string" && (t = pw(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class xw {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function ke(t) {
  const e = (r) => t().update(Rl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function ww(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), a = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + a, o, r), t.setUint32(e + f, c, r);
}
class so extends xw {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Cs(this.buffer);
  }
  update(e) {
    Ns.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Rl(e);
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
    Ns.exists(this), Ns.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    ww(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = Cs(e), a = this.outputLen;
    if (a % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = a / 4, h = this.get();
    if (f > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      c.setUint32(4 * l, h[l], i);
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
const yw = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Gl = Uint8Array.from({ length: 16 }, (t, e) => e), mw = Gl.map((t) => (9 * t + 5) % 16);
let io = [Gl], oo = [mw];
for (let t = 0; t < 4; t++)
  for (let e of [io, oo])
    e.push(e[t].map((n) => yw[n]));
const Kl = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Sw = io.map((t, e) => t.map((n) => Kl[e][n])), Aw = oo.map((t, e) => t.map((n) => Kl[e][n])), Ew = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), vw = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ur = (t, e) => t << e | t >>> 32 - e;
function ya(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const dr = new Uint32Array(16);
class Iw extends so {
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
      dr[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, a = c, f = this.h3 | 0, h = f, l = this.h4 | 0, g = l;
    for (let d = 0; d < 5; d++) {
      const p = 4 - d, w = Ew[d], E = vw[d], $ = io[d], M = oo[d], x = Sw[d], L = Aw[d];
      for (let S = 0; S < 16; S++) {
        const U = ur(r + ya(d, i, c, f) + dr[$[S]] + w, x[S]) + l | 0;
        r = l, l = f, f = ur(c, 10) | 0, c = i, i = U;
      }
      for (let S = 0; S < 16; S++) {
        const U = ur(s + ya(p, o, a, h) + dr[M[S]] + E, L[S]) + g | 0;
        s = g, g = h, h = ur(a, 10) | 0, a = o, o = U;
      }
    }
    this.set(this.h1 + c + h | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + a | 0);
  }
  roundClean() {
    dr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
ke(() => new Iw());
const Lw = (t, e, n) => t & e ^ ~t & n, $w = (t, e, n) => t & e ^ t & n ^ e & n, Mw = new Uint32Array([
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
]), de = new Uint32Array(64);
class Vl extends so {
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
      de[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = de[l - 15], d = de[l - 2], p = Lt(g, 7) ^ Lt(g, 18) ^ g >>> 3, w = Lt(d, 17) ^ Lt(d, 19) ^ d >>> 10;
      de[l] = w + de[l - 7] + p + de[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: a, G: f, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const g = Lt(c, 6) ^ Lt(c, 11) ^ Lt(c, 25), d = h + g + Lw(c, a, f) + Mw[l] + de[l] | 0, w = (Lt(r, 2) ^ Lt(r, 13) ^ Lt(r, 22)) + $w(r, s, i) | 0;
      h = f, f = a, a = c, c = o + d | 0, o = i, i = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, f = f + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, c, a, f, h);
  }
  roundClean() {
    de.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class _w extends Vl {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
ke(() => new Vl());
ke(() => new _w());
const gr = BigInt(2 ** 32 - 1), ui = BigInt(32);
function Wl(t, e = !1) {
  return e ? { h: Number(t & gr), l: Number(t >> ui & gr) } : { h: Number(t >> ui & gr) | 0, l: Number(t & gr) | 0 };
}
function Bw(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Wl(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Dw = (t, e) => BigInt(t >>> 0) << ui | BigInt(e >>> 0), Hw = (t, e, n) => t >>> n, Uw = (t, e, n) => t << 32 - n | e >>> n, Nw = (t, e, n) => t >>> n | e << 32 - n, Cw = (t, e, n) => t << 32 - n | e >>> n, Ow = (t, e, n) => t << 64 - n | e >>> n - 32, jw = (t, e, n) => t >>> n - 32 | e << 64 - n, Tw = (t, e) => e, kw = (t, e) => t, Pw = (t, e, n) => t << n | e >>> 32 - n, Fw = (t, e, n) => e << n | t >>> 32 - n, zw = (t, e, n) => e << n - 32 | t >>> 64 - n, Rw = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Gw(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Kw = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Vw = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Ww = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Yw = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, qw = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Zw = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, R = {
  fromBig: Wl,
  split: Bw,
  toBig: Dw,
  shrSH: Hw,
  shrSL: Uw,
  rotrSH: Nw,
  rotrSL: Cw,
  rotrBH: Ow,
  rotrBL: jw,
  rotr32H: Tw,
  rotr32L: kw,
  rotlSH: Pw,
  rotlSL: Fw,
  rotlBH: zw,
  rotlBL: Rw,
  add: Gw,
  add3L: Kw,
  add3H: Vw,
  add4L: Ww,
  add4H: Yw,
  add5H: Zw,
  add5L: qw
}, [Qw, Xw] = R.split([
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
class ss extends so {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: a, Eh: f, El: h, Fh: l, Fl: g, Gh: d, Gl: p, Hh: w, Hl: E } = this;
    return [e, n, r, s, i, o, c, a, f, h, l, g, d, p, w, E];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, a, f, h, l, g, d, p, w, E) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = a | 0, this.Eh = f | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = d | 0, this.Gl = p | 0, this.Hh = w | 0, this.Hl = E | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      ge[x] = e.getUint32(n), be[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const L = ge[x - 15] | 0, S = be[x - 15] | 0, U = R.rotrSH(L, S, 1) ^ R.rotrSH(L, S, 8) ^ R.shrSH(L, S, 7), j = R.rotrSL(L, S, 1) ^ R.rotrSL(L, S, 8) ^ R.shrSL(L, S, 7), D = ge[x - 2] | 0, H = be[x - 2] | 0, b = R.rotrSH(D, H, 19) ^ R.rotrBH(D, H, 61) ^ R.shrSH(D, H, 6), A = R.rotrSL(D, H, 19) ^ R.rotrBL(D, H, 61) ^ R.shrSL(D, H, 6), B = R.add4L(j, A, be[x - 7], be[x - 16]), O = R.add4H(B, U, b, ge[x - 7], ge[x - 16]);
      ge[x] = O | 0, be[x] = B | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: a, Dh: f, Dl: h, Eh: l, El: g, Fh: d, Fl: p, Gh: w, Gl: E, Hh: $, Hl: M } = this;
    for (let x = 0; x < 80; x++) {
      const L = R.rotrSH(l, g, 14) ^ R.rotrSH(l, g, 18) ^ R.rotrBH(l, g, 41), S = R.rotrSL(l, g, 14) ^ R.rotrSL(l, g, 18) ^ R.rotrBL(l, g, 41), U = l & d ^ ~l & w, j = g & p ^ ~g & E, D = R.add5L(M, S, j, Xw[x], be[x]), H = R.add5H(D, $, L, U, Qw[x], ge[x]), b = D | 0, A = R.rotrSH(r, s, 28) ^ R.rotrBH(r, s, 34) ^ R.rotrBH(r, s, 39), B = R.rotrSL(r, s, 28) ^ R.rotrBL(r, s, 34) ^ R.rotrBL(r, s, 39), O = r & i ^ r & c ^ i & c, G = s & o ^ s & a ^ o & a;
      $ = w | 0, M = E | 0, w = d | 0, E = p | 0, d = l | 0, p = g | 0, { h: l, l: g } = R.add(f | 0, h | 0, H | 0, b | 0), f = c | 0, h = a | 0, c = i | 0, a = o | 0, i = r | 0, o = s | 0;
      const C = R.add3L(b, B, G);
      r = R.add3H(C, H, A, O), s = C | 0;
    }
    ({ h: r, l: s } = R.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = R.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l: a } = R.add(this.Ch | 0, this.Cl | 0, c | 0, a | 0), { h: f, l: h } = R.add(this.Dh | 0, this.Dl | 0, f | 0, h | 0), { h: l, l: g } = R.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: d, l: p } = R.add(this.Fh | 0, this.Fl | 0, d | 0, p | 0), { h: w, l: E } = R.add(this.Gh | 0, this.Gl | 0, w | 0, E | 0), { h: $, l: M } = R.add(this.Hh | 0, this.Hl | 0, $ | 0, M | 0), this.set(r, s, i, o, c, a, f, h, l, g, d, p, w, E, $, M);
  }
  roundClean() {
    ge.fill(0), be.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class Jw extends ss {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class ty extends ss {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class ey extends ss {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
ke(() => new ss());
ke(() => new Jw());
ke(() => new ty());
ke(() => new ey());
var Dn;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Dn || (Dn = {}));
const ma = BigInt("0xffffffffffffffffffffffffffffffff"), ny = BigInt(0);
BigInt("0x7fffffffffffffffffffffffffffffff");
BigInt("-170141183460469231731687303715884105728");
const Sa = (t) => {
  const e = cw(t);
  if (e < ny)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > ma)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${ma}`);
  return { type: Dn.UInt, value: e };
};
function Aa(t) {
  for (const e in t)
    if (!ry(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Dn.Tuple, data: t };
}
const We = (t) => ({ type: Dn.StringASCII, data: t });
function ry(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
const Xe = (t) => {
  try {
    return Qr.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
}, sy = ["store_write"], Ea = "/manifest.json", iy = /* @__PURE__ */ new Set([4001, -31001]), oy = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], co = (t) => typeof t == "string" && t.toLowerCase().includes("leather"), Tn = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), pn = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, Je = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, Yl = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), ao = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => Yl(i, r)) === s
  );
}, ql = (t) => t ? ao(pn()).some(
  (e) => {
    var n;
    return e.id === t && (Tn(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Zl = () => {
  if (typeof window > "u")
    return;
  const t = pn(), e = ao(t).filter(
    (n) => {
      var r;
      return Tn(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Je(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of oy) {
    const r = Je(t, n) ?? (t === window ? void 0 : Je(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, Ql = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = pn(), n = Je(e, t) ?? (e === window ? void 0 : Je(window, t)) ?? Jr(t);
  if (n)
    return n;
  if (Tn(t) || ql(t))
    return Zl();
}, cy = (t) => {
  const e = pn();
  if (!e)
    return [];
  const n = ao(e), r = t.filter(
    (s) => !n.some((i) => Yl(i, s)) && !!Je(e, s.id)
  );
  return n.concat(r);
}, Gt = () => ({ isConnected: !1 }), ay = ["blockstack-session", "blockstack"], Xl = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of ay) {
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
Xl();
const ly = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Ze = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, di = (t, e = "mainnet") => {
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
      return di(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return di(r, e);
  }
  return e;
}, gi = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return Xe(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = gi(s, e + 1);
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
    const i = gi(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && Xe(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Xe(n.testnet) ? n.testnet.trim() : null;
}, va = (t) => {
  const e = Ze(t);
  if (!e)
    return null;
  const n = ly(e);
  return /^[0-9a-f]{66}$/i.test(n) ? n : null;
}, bi = (t, e, n = 0) => {
  if (n > 8 || !t)
    return null;
  if (Array.isArray(t)) {
    for (const o of t) {
      const c = bi(o, e, n + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return e ? null : va(t);
  const r = t, s = [r.address, r.stxAddress, r.selectedAddress].map((o) => Ze(o)).find((o) => o && Xe(o)), i = [r.publicKey, r.public_key, r.stxPublicKey].map((o) => va(o)).find(Boolean);
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
    const c = bi(r[o], e, n + 1);
    if (c)
      return c;
  }
  return null;
}, fy = (t) => {
  var i;
  const e = t.profile ?? {}, n = typeof e.stxAddress == "string" ? e.stxAddress : typeof ((i = e.stxAddress) == null ? void 0 : i.mainnet) == "string" ? e.stxAddress.mainnet : t.identityAddress, r = typeof n == "string" && Xe(n) ? n.trim() : null;
  if (!r)
    return Gt();
  const s = wi(r);
  return s !== "mainnet" ? Gt() : {
    isConnected: !0,
    address: r,
    network: s
  };
}, hy = (t, e = "mainnet") => {
  const n = gi(t);
  if (!n)
    return Gt();
  const r = wi(n) ?? di(t, e);
  if (r !== "mainnet")
    return Gt();
  const s = bi(t, n);
  return {
    isConnected: !0,
    address: n,
    network: r,
    ...s ? { publicKey: s } : {}
  };
}, lo = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, fo = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && iy.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, jr = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Ze(n == null ? void 0 : n.message) ?? Ze(e.message) ?? Ze(e.error) ?? Ze(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, Jl = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw jr(e);
    if (e.status === "error")
      throw jr(e.result ?? e);
  }
  return t;
}, ho = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return Jl(r);
  } catch (r) {
    throw jr(r);
  }
}, tf = () => Zl(), Tr = (t) => {
  var r, s;
  const e = Dt();
  if (Tn(e) || ql(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = pn() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === tf();
}, Ia = async (t, e, n) => {
  if (!Tr(t))
    return ho(t, e, n);
  const r = tf();
  if (!r)
    throw Object.assign(new Error("Xverse modern request provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  try {
    return Jl(await r.request(e, n));
  } catch (s) {
    throw jr(s);
  }
}, uy = (t) => {
}, ef = (t, e = 0) => {
  if (e > 5 || t === null || typeof t > "u")
    return [];
  if (Array.isArray(t))
    return [...new Set(t.filter((r) => typeof r == "string"))];
  if (typeof t != "object")
    return [];
  const n = t;
  for (const r of ["supportedMethods", "methods", "result", "data"])
    if (r in n) {
      const s = ef(n[r], e + 1);
      if (s.length > 0)
        return s;
    }
  return [];
}, dy = [
  "wallet_connect",
  "stx_requestAccounts",
  "connect",
  "getAddresses",
  "stx_getAddresses",
  "stx_getAccounts",
  "getAccounts",
  "wallet_getAccount",
  "requestAccounts"
], gy = async (t) => {
  const e = Dt();
  if (Tr(t))
    return ["wallet_connect", "stx_getAccounts", "wallet_getAccount"];
  if (!co(e))
    return dy;
  const n = [
    "getAddresses",
    "stx_getAccounts",
    "stx_getAddresses",
    "stx_requestAccounts",
    "wallet_connect"
  ];
  try {
    const r = ef(await ho(t, "supportedMethods"));
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
}, by = async (t) => {
  if (Tr(t))
    try {
      await Ia(t, "wallet_disconnect");
    } catch {
    }
  const e = await gy(t);
  let n = null;
  for (const r of e)
    try {
      console.info("[wallet:connect]", { stage: "REQUEST", method: r });
      const s = await Ia(t, r), i = hy(s);
      if (i.isConnected)
        return console.info("[wallet:connect]", {
          stage: "CONNECTED",
          method: r,
          hasPublicKey: !!i.publicKey
        }), Tr(t) && uy(i.address), i;
      console.info("[wallet:connect]", { stage: "EMPTY_RESPONSE", method: r });
    } catch (s) {
      n = s;
      const i = lo(s);
      if ((i ? console.info : console.warn)("[wallet:connect]", {
        stage: "REQUEST_ERROR",
        method: r,
        code: s && typeof s == "object" && "code" in s ? s.code : void 0,
        message: s instanceof Error ? s.message : String(s)
      }), fo(s))
        return Gt();
      if (i)
        continue;
      throw s;
    }
  if (n)
    throw n;
  return Gt();
}, py = async (t, e) => {
  const n = new Pr(sy, void 0, "", Ea), r = new Mn({ appConfig: n });
  return new Promise((s) => {
    iw(
      {
        appDetails: {
          name: t.appName,
          icon: t.appIcon
        },
        manifestPath: Ea,
        userSession: r,
        onFinish: (i) => {
          s(fy(i.userSession.loadUserData()));
        },
        onCancel: () => {
          s(Gt());
        }
      },
      e
    );
  });
}, xy = (t, e = !0) => {
  if (t && typeof t != "string")
    return t;
  const n = typeof t == "string" ? t : Dt(), r = Ql(n);
  return r ? (e && n && Z0(n), r) : null;
}, wy = (t) => {
  if (typeof window > "u" || typeof document > "u")
    return Promise.resolve(null);
  const e = (t == null ? void 0 : t.persistSelection) ?? !0;
  return Nl(), new Promise((n) => {
    const r = document.createElement("connect-modal"), s = Fl, i = cy(s), o = document.body.style.overflow, c = () => {
      document.body.style.overflow = o, document.removeEventListener("keydown", a), r.remove();
    }, a = (f) => {
      f.key === "Escape" && (c(), n(null));
    };
    r.defaultProviders = s, r.installedProviders = i, r.persistSelection = e, r.callback = (f) => {
      const h = xy(f, e);
      console.info("[wallet:connect]", {
        stage: "PROVIDER_SELECTED",
        providerId: typeof f == "string" ? f : Dt() ?? "provider-object",
        resolved: !!h,
        requestBridge: typeof (h == null ? void 0 : h.request) == "function"
      }), c(), n(h);
    }, r.cancelCallback = () => {
      c(), n(null);
    }, document.body.style.overflow = "hidden", document.addEventListener("keydown", a), document.body.appendChild(r);
  });
}, yy = () => Dt(), nf = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = Dt(), e = t ? Ql(t) : void 0;
  if (e)
    return e;
  const n = pn() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, my = async (t) => {
  Xl();
  const e = await wy({});
  if (!e)
    return Gt();
  if (typeof e.request == "function")
    try {
      const n = await by(e);
      if (n.isConnected)
        return n;
    } catch (n) {
      if (fo(n))
        return Gt();
      if (!lo(n))
        throw n;
    }
  return py(t, e);
}, Sy = () => {
  const t = Dt();
  return co(t) ? "leather" : Tn(t) ? "xverse" : t ? String(t) : void 0;
}, Ay = async (t) => {
  const e = Ph("wallet_connect");
  Sn({ journey: e, step: "open", outcome: "start" });
  try {
    const n = await my(t);
    return n.isConnected && n.address ? (yi(n.address, Sy()), mi(n.network), Sn({ journey: e, step: "authorize", outcome: "success" })) : Sn({ journey: e, step: "authorize", outcome: "abandon" }), n;
  } catch (n) {
    throw Sn({
      journey: e,
      step: "authorize",
      outcome: "error",
      errorCode: Ch(n),
      error: n
    }), n;
  }
}, Ey = async () => {
  const t = nf();
  if (t && co(Dt()))
    for (const e of ["stx_disconnect", "wallet_disconnect", "disconnect", "deactivate"])
      try {
        await ho(t, e);
        break;
      } catch (n) {
        if (fo(n) || lo(n))
          continue;
      }
  ow(), Q0(), yi(null), mi(null), Sn({ flow: "wallet_connect", step: "disconnect", outcome: "info" });
}, vy = (t) => {
  const e = Bh(), n = () => {
    e.clear();
  }, r = () => {
    const o = e.load();
    return o.isConnected && o.address && (yi(o.address), mi(o.network)), o;
  };
  return {
    connect: async () => {
      const o = r(), c = await Ay({
        appName: t.appName,
        appIcon: t.appIcon
      });
      return c.isConnected ? (e.save(c), c) : o.isConnected ? o : c;
    },
    disconnect: async () => {
      await Ey(), n();
    },
    getSession: r
  };
};
async function Iy(t) {
  var s, i;
  let e = nf();
  if (/xverse/i.test(yy() || "") && typeof (e == null ? void 0 : e.structuredDataSignatureRequest) != "function") {
    const o = window;
    e = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (typeof (e == null ? void 0 : e.structuredDataSignatureRequest) != "function")
    throw new Error("This wallet cannot sign messages. Try Xverse or Leather.");
  const n = await Jx({
    domain: t.domain,
    message: t.message,
    network: Kx(t.network),
    stxAddress: t.stxAddress
  }), r = await e.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
const Ly = "xtrata.xyz/bounty", $y = "Link an X handle to a bounty entry; no spending permission", My = (t) => {
  if (typeof t != "string") return null;
  const e = t.trim().replace(/^https?:\/\/(?:www\.)?(?:x|twitter)\.com\//i, "").replace(/[/?#].*$/, "");
  if (e === "" || e === "@") return "";
  const n = e.replace(/^@/, "");
  return /^[A-Za-z0-9_]{1,15}$/.test(n) ? "@" + n : null;
}, _y = (t) => typeof t == "string" && /^SP[0-9A-Z]{30,}$/.test(t) && Xe(t), By = (t) => ({
  domain: Aa({
    name: We(Ly),
    version: We("1"),
    "chain-id": Sa(1)
  }),
  message: Aa({
    purpose: We($y),
    campaign: We(t.campaign),
    address: We(t.address),
    // An empty handle is how a wallet removes its own link.
    handle: We(t.handle),
    issued: Sa(t.issued)
  })
}), pi = vy({ appName: "Xtrata Bounty Tracker", appIcon: "/favicon.svg" });
let xi;
const Ln = () => {
  const t = pi.getSession();
  return t.isConnected && _y(t.address) ? t.address : "";
}, Hn = () => {
  const t = Ln();
  t !== (xi ?? "") && (xi = t, window.dispatchEvent(new CustomEvent("xtrata:wallet-changed", { detail: { address: t } })));
}, Dy = {
  address: Ln,
  async connect() {
    await pi.connect(), Hn();
    const t = Ln();
    if (!t) throw new Error("Connect a Stacks mainnet account to continue.");
    return t;
  },
  async disconnect() {
    await pi.disconnect(), Hn();
  },
  /** Ask the connected wallet to sign "handle is mine" for this campaign. Nothing is sent anywhere. */
  async signHandle(t, e) {
    const n = Ln();
    if (!n) throw new Error("Connect your wallet first.");
    const r = My(e);
    if (r === null) throw new Error("That is not a valid X handle. Use 1 to 15 letters, numbers or underscores.");
    const s = Date.now(), o = await Iy({ ...By({ campaign: t, address: n, handle: r, issued: s }), network: "mainnet", stxAddress: n });
    return { campaign: t, address: n, handle: r, issued: s, signature: o };
  }
};
window.XtrataBountyWallet = Dy;
xi = Ln();
window.addEventListener("focus", Hn);
window.addEventListener("storage", (t) => {
  (t.key === null || t.key === "xtrata.v15.1.wallet.session") && Hn();
});
window.dispatchEvent(new CustomEvent("xtrata:wallet-ready"));
Hn();
const Hy = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", Uy = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, Ny = () => Uy() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, Cy = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, Oy = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', rf = class {
  constructor(t) {
    Nx(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && Z0(t), this.callback(Jr(t));
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
    var r, s, i, o, c, a, f, h, l, g;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (o = (i = t.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (a = (c = t.mozillaAddOnsUrl) !== null && c !== void 0 ? c : this.getMobileUrl(t)) !== null && a !== void 0 ? a : t.webUrl : n === "Android" ? (h = (f = t.googlePlayStoreUrl) !== null && f !== void 0 ? f : this.getBrowserUrl(t)) !== null && h !== void 0 ? h : t.webUrl : (g = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && g !== void 0 ? g : this.getMobileUrl(t);
  }
  render() {
    const t = Ny(), e = Cy(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return T("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, T("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), T("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, T("div", { class: "flex flex-col space-y-[10px]" }, T("div", { class: "flex items-center" }, T("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), T("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, T("span", { class: "sr-only" }, "Close popup"), T("img", { src: Hy }))), r ? T("p", null, "Select the wallet you want to connect to.") : T("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && T("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && T("div", { class: "mt-6" }, T("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), T("ul", { class: "space-y-3" }, this.installedProviders.map((i) => T("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, T("div", { class: "aspect-square basis-9 overflow-hidden" }, T("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), T("div", { class: "flex-1" }, T("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && T("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), T("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && T("div", { class: "mt-6" }, r ? T("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : T("div", { class: "mb-5 flex justify-between" }, T("p", { class: "text-sm font-medium" }, "Recommended wallets"), T("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, T("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, T("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), T("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), T("p", null, "What is a wallet? ", T("span", { class: "align-text-bottom text-[9px]" }, "↗")))), T("ul", { class: "space-y-3" }, n.map((i) => T("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, T("div", { class: "aspect-square basis-9 overflow-hidden" }, T("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), T("div", { class: "flex-1" }, T("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && T("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && T("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return bx(this);
  }
};
rf.style = Oy;
const jy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: rf
}, Symbol.toStringTag, { value: "Module" }));
