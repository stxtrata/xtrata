var bf = Object.defineProperty;
var wf = (t, e, n) => e in t ? bf(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Vr = (t, e, n) => wf(t, typeof e != "symbol" ? e + "" : e, n);
const xf = ["SP", "SM"], yf = ["ST", "SN"], Ds = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return xf.includes(n) ? "mainnet" : yf.includes(n) ? "testnet" : null;
}, mf = () => {
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
}, Sf = () => typeof window > "u" || !window.localStorage ? mf() : window.localStorage, Kr = "xtrata.v15.1.wallet.session", zo = "mainnet", nr = { isConnected: !1 }, Af = (t) => t.address ? Ds(t.address) ?? t.network : t.network, yc = (t) => !t.isConnected || !t.address ? { ...nr } : Af(t) !== zo ? { ...nr } : {
  isConnected: !0,
  address: t.address,
  network: zo,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, Ef = (t) => {
  if (!t)
    return { ...nr };
  try {
    const e = JSON.parse(t);
    return yc(e);
  } catch {
    return { ...nr };
  }
}, If = (t) => {
  const e = yc(t);
  return JSON.stringify(e);
}, vf = (t) => {
  const e = Sf();
  return {
    load: () => Ef(e.getItem(Kr)),
    save: (n) => {
      e.setItem(Kr, If(n));
    },
    clear: () => {
      e.removeItem(Kr);
    }
  };
};
function Lf(t) {
  return (t || "").replace(/0x[0-9a-fA-F]{6,}/g, "0x…").replace(/\bS[PT][0-9A-Z]{20,}\b/g, "<addr>").replace(/\b[0-9a-fA-F]{64}\b/g, "<hash>").replace(/\b\d[\d,]*(\.\d+)?\b/g, "<n>").replace(/\s+/g, " ").trim().slice(0, 200);
}
function _f(t, e, n, r) {
  const s = `${t}|${e ?? ""}|${n ?? ""}|${Lf(r)}`;
  let o = 2166136261, i = 522970236;
  for (let a = 0; a < s.length; a += 1) {
    const f = s.charCodeAt(a);
    o = Math.imul(o ^ f, 16777619), i = Math.imul(i ^ (f << 5 | f >>> 3), 16777619);
  }
  const c = (a) => (a >>> 0).toString(16).padStart(8, "0");
  return (c(o) + c(i)).slice(0, 16);
}
function mc(t) {
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
function Mf(t) {
  return t instanceof Error ? t.stack ?? void 0 : void 0;
}
const Wr = (t) => {
  if (typeof t == "number" || typeof t == "boolean") return t;
  if (typeof t == "string" && t.length > 0) return t.slice(0, 300);
};
function $f(t) {
  if (!t || typeof t != "object") return;
  const e = t, n = {};
  for (const s of ["code", "stage", "method", "providerId", "name"]) {
    const o = Wr(e[s]);
    o !== void 0 && (n[s] = o);
  }
  const r = e.data;
  if (r && typeof r == "object") {
    const s = {};
    for (const o of ["code", "message", "reason"]) {
      const i = Wr(r[o]);
      i !== void 0 && (s[o] = i);
    }
    Object.keys(s).length > 0 && (n.data = s);
  } else {
    const s = Wr(r);
    s !== void 0 && (n.data = s);
  }
  return Object.keys(n).length > 0 ? n : void 0;
}
function Cf(t, e) {
  const n = (t == null ? void 0 : t.name) ?? "", r = t == null ? void 0 : t.code, s = mc(t).toLowerCase();
  return r === -32603 || s.trim() === "internal error." ? "WALLET_RPC_INTERNAL" : n === "ReadOnlyBackoffError" || s.includes("read-only") && s.includes("backoff") ? "READ_ONLY_BACKOFF" : typeof navigator < "u" && navigator.onLine === !1 ? "NETWORK_OFFLINE" : s.includes("user rejected") || s.includes("user denied") || s.includes("user canceled") || s.includes("user cancelled") || s.includes("rejected the request") || s.includes("request rejected") ? "WALLET_REJECTED" : s.includes("no wallet") || s.includes("provider not found") || s.includes("not installed") ? "WALLET_NOT_FOUND" : s.includes("locked") ? "WALLET_LOCKED" : s.includes("session") && s.includes("expire") ? "SESSION_EXPIRED" : s.includes("insufficient") && s.includes("fee") ? "INSUFFICIENT_FEE" : s.includes("insufficient") || s.includes("not enough") ? "INSUFFICIENT_FUNDS" : s.includes("nonce") ? "NONCE_MISMATCH" : s.includes("postcondition") || s.includes("post-condition") || s.includes("post condition") ? "POST_CONDITION_FAILED" : s.includes("abort") || s.includes("runtime error") ? "CONTRACT_ABORT" : s.includes("429") || s.includes("rate limit") || s.includes("too many requests") ? "HIRO_RATE_LIMIT" : s.includes("broadcast") ? "BROADCAST_FAILED" : s.includes("timeout") || s.includes("timed out") ? "CONFIRM_TIMEOUT" : s.includes("upload") ? "UPLOAD_FAILED" : "UNCAUGHT";
}
const Hf = typeof __XTRATA_APP_VERSION__ < "u" ? __XTRATA_APP_VERSION__ : "dev", Df = 20, Ro = "xt_tel_sid";
function rr() {
  try {
    if (typeof crypto < "u" && typeof crypto.randomUUID == "function")
      return crypto.randomUUID();
  } catch {
  }
  return `xt-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}
let Yr = null;
function Nf() {
  try {
    if (typeof sessionStorage < "u") {
      let t = sessionStorage.getItem(Ro);
      return t || (t = rr(), sessionStorage.setItem(Ro, t)), t;
    }
  } catch {
  }
  return Yr || (Yr = rr()), Yr;
}
let Oe = {
  address: null,
  kind: null
}, Sc = null;
function Ns(t, e) {
  if (!t) {
    Oe = { address: null, kind: e ?? Oe.kind };
    return;
  }
  Oe = { address: t.trim(), kind: e ?? Oe.kind };
}
function Bs(t) {
  Sc = typeof t == "string" && t.length > 0 ? t : null;
}
const Go = [];
class Bf {
  constructor(e, n) {
    Vr(this, "id", rr());
    Vr(this, "n", 0);
    this.flow = e, this.target = n;
  }
  attempt() {
    return this.n += 1, this.n;
  }
}
function Uf(t, e) {
  return new Bf(t, e);
}
function fn(t) {
  try {
    const e = t.journey, n = t.flow ?? (e == null ? void 0 : e.flow) ?? "app", r = t.outcome === "error", s = t.error != null ? mc(t.error) : void 0, o = t.error != null ? Mf(t.error) : void 0, i = r ? _f(n, t.step, t.errorCode, s ?? "") : void 0, c = r ? $f(t.error) : void 0, a = {
      ...c ? { error: c } : {},
      ...t.context ?? {}
    };
    r && Go.length && (a.breadcrumbs = Go.slice(-Df));
    const f = {
      eventId: rr(),
      ts: Date.now(),
      sessionId: Nf(),
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
      appVersion: Hf,
      route: t.route ?? (typeof location < "u" ? location.pathname : ""),
      walletAddress: Oe.address,
      walletKind: Oe.kind,
      network: Sc,
      context: Object.keys(a).length ? a : void 0
    };
  } catch {
  }
}
const Tf = "https://browser.blockstack.org/auth", jf = {
  "@type": "Person",
  "@context": "http://schema.org"
}, Ac = ["store_write"], Of = "blockstack-session", kf = {
  logLevel: "debug"
}, Le = {
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
Object.freeze(Le);
class tn extends Error {
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
class Pf extends tn {
  constructor(e, n = "") {
    super({ code: Le.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Vo extends tn {
  constructor(e = "") {
    super({ code: Le.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Nn extends tn {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Le.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Ko extends tn {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Le.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class cs extends tn {
  constructor(e) {
    super({ code: Le.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class Ec extends tn {
  constructor(e) {
    super({ code: Le.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Wo = ["debug", "info", "warn", "error", "none"], as = {};
for (let t = 0; t < Wo.length; t++) {
  const e = Wo[t];
  as[e] = t;
}
class ke {
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
    return as[kf.logLevel] <= as[e];
  }
}
function Ff() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function zf() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Zr(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function Rf() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Gf() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Vf(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function Us(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Gf(), s) {
      const o = s[t];
      if (o)
        return o;
    }
  } catch (o) {
    ke.error(`Error getting object '${t}' from global scope '${s}': ${o}`);
  }
  if (e) {
    const o = Vf(s, t.toString(), n);
    throw ke.error(o), new Error(o);
  }
  if (r)
    return {};
}
function Kf(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
const Wf = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function le(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Wf[n];
  return e;
}
function fe(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Kf(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    e[n] = o;
  }
  return e;
}
function Ic(t) {
  return new TextEncoder().encode(t);
}
function vc(t) {
  return new TextDecoder().decode(t);
}
function Ge(...t) {
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
const Yf = "https://api.mainnet.hiro.so", Zf = "https://api.testnet.hiro.so", Qf = "http://localhost:3999", qf = "https://hub.blockstack.org";
function Xf(t) {
  const e = typeof t == "string" ? fe(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
const Jf = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function tu(t, e) {
  const n = {};
  return Object.assign(n, Jf, e), await fetch(t, n);
}
function eu(t) {
  let e = tu, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function nu(...t) {
  const { fetchLib: e, middlewares: n } = eu(t);
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
class Ts {
  constructor(e = Ac.slice(), n = ((c) => (c = Us("location", { returnEmptyObject: !0 })) == null ? void 0 : c.origin)(), r = "", s = "/manifest.json", o = void 0, i = Tf) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = o, this.authenticatorURL = i;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function ls(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function ru(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Lc(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function su(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ls(t.outputLen), ls(t.blockLen);
}
function ou(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function iu(t, e) {
  Lc(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const xe = {
  number: ls,
  bool: ru,
  bytes: Lc,
  hash: su,
  exists: ou,
  output: iu
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Qr = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), It = (t, e) => t << 32 - e | t >>> e, cu = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!cu)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function au(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function js(t) {
  if (typeof t == "string" && (t = au(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let _c = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function _e(t) {
  const e = (r) => t().update(js(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Mc = class extends _c {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, xe.hash(e);
    const r = js(n);
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
    return xe.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    xe.exists(this), xe.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const xr = (t, e, n) => new Mc(t, e).update(n).digest();
xr.create = (t, e) => new Mc(t, e);
function lu(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), a = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + a, i, r), t.setUint32(e + f, c, r);
}
let Os = class extends _c {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Qr(this.buffer);
  }
  update(e) {
    xe.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = js(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const a = Qr(e);
        for (; s <= o - i; i += s)
          this.process(a, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    xe.exists(this), xe.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let l = i; l < s; l++)
      n[l] = 0;
    lu(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = Qr(e), a = this.outputLen;
    if (a % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = a / 4, d = this.get();
    if (f > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      c.setUint32(4 * l, d[l], o);
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
const fu = (t, e, n) => t & e ^ ~t & n, uu = (t, e, n) => t & e ^ t & n ^ e & n, du = new Uint32Array([
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
]), Vt = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Kt = new Uint32Array(64);
let $c = class extends Os {
  constructor() {
    super(64, 32, 8, !1), this.A = Vt[0] | 0, this.B = Vt[1] | 0, this.C = Vt[2] | 0, this.D = Vt[3] | 0, this.E = Vt[4] | 0, this.F = Vt[5] | 0, this.G = Vt[6] | 0, this.H = Vt[7] | 0;
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
      Kt[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Kt[l - 15], h = Kt[l - 2], b = It(g, 7) ^ It(g, 18) ^ g >>> 3, w = It(h, 17) ^ It(h, 19) ^ h >>> 10;
      Kt[l] = w + Kt[l - 7] + b + Kt[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: a, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = It(c, 6) ^ It(c, 11) ^ It(c, 25), h = d + g + fu(c, a, f) + du[l] + Kt[l] | 0, w = (It(r, 2) ^ It(r, 13) ^ It(r, 22)) + uu(r, s, o) | 0;
      d = f, f = a, a = c, c = i + h | 0, i = o, o = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, o, i, c, a, f, d);
  }
  roundClean() {
    Kt.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, hu = class extends $c {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Ve = _e(() => new $c());
_e(() => new hu());
const gu = {}, Cc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: gu
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const F = BigInt(0), q = BigInt(1), ue = BigInt(2), dn = BigInt(3), Yo = BigInt(8), G = Object.freeze({
  a: F,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: q,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Zo = (t, e) => (t + e / ue) / e, Bn = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = G, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -q * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), o = n, i = BigInt("0x100000000000000000000000000000000"), c = Zo(o * t, e), a = Zo(-r * t, e);
    let f = v(t - c * n - a * s, e), d = v(-c * r - a * o, e);
    const l = f > i, g = d > i;
    if (l && (f = e - f), g && (d = e - d), f > i || d > i)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: f, k2neg: g, k2: d };
  }
}, Et = 32, Se = 32, Hc = 32, sr = Et + 1, or = 2 * Et + 1;
function Qo(t) {
  const { a: e, b: n } = G, r = v(t * t), s = v(r * t);
  return v(s + e * t + n);
}
const Un = G.a === F;
class ks extends Error {
  constructor(e) {
    super(e);
  }
}
function qo(t) {
  if (!(t instanceof R))
    throw new TypeError("JacobianPoint expected");
}
class R {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof z))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(z.ZERO) ? R.ZERO : new R(e.x, e.y, q);
  }
  static toAffineBatch(e) {
    const n = yu(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return R.toAffineBatch(e).map(R.fromAffine);
  }
  equals(e) {
    qo(e);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: c } = e, a = v(s * s), f = v(c * c), d = v(n * f), l = v(o * a), g = v(v(r * c) * f), h = v(v(i * s) * a);
    return d === l && g === h;
  }
  negate() {
    return new R(this.x, v(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = v(e * e), o = v(n * n), i = v(o * o), c = e + o, a = v(ue * (v(c * c) - s - i)), f = v(dn * s), d = v(f * f), l = v(d - ue * a), g = v(f * (a - l) - Yo * i), h = v(ue * n * r);
    return new R(l, g, h);
  }
  add(e) {
    qo(e);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: c } = e;
    if (o === F || i === F)
      return this;
    if (n === F || r === F)
      return e;
    const a = v(s * s), f = v(c * c), d = v(n * f), l = v(o * a), g = v(v(r * c) * f), h = v(v(i * s) * a), b = v(l - d), w = v(h - g);
    if (b === F)
      return w === F ? this.double() : R.ZERO;
    const S = v(b * b), _ = v(b * S), M = v(d * S), x = v(w * w - _ - ue * M), L = v(w * (M - x) - g * _), A = v(s * c * b);
    return new R(x, L, A);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = R.ZERO;
    if (typeof e == "bigint" && e === F)
      return n;
    let r = ti(e);
    if (r === q)
      return this;
    if (!Un) {
      let l = n, g = this;
      for (; r > F; )
        r & q && (l = l.add(g)), g = g.double(), r >>= q;
      return l;
    }
    let { k1neg: s, k1: o, k2neg: i, k2: c } = Bn.splitScalar(r), a = n, f = n, d = this;
    for (; o > F || c > F; )
      o & q && (a = a.add(d)), c & q && (f = f.add(d)), d = d.double(), o >>= q, c >>= q;
    return s && (a = a.negate()), i && (f = f.negate()), f = new R(v(f.x * Bn.beta), f.y, f.z), a.add(f);
  }
  precomputeWindow(e) {
    const n = Un ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(R.BASE) && (n = z.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && fs.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = R.normalizeZ(s), fs.set(n, s)));
    let o = R.ZERO, i = R.BASE;
    const c = 1 + (Un ? 128 / r : 256 / r), a = 2 ** (r - 1), f = BigInt(2 ** r - 1), d = 2 ** r, l = BigInt(r);
    for (let g = 0; g < c; g++) {
      const h = g * a;
      let b = Number(e & f);
      e >>= l, b > a && (b -= d, e += q);
      const w = h, S = h + Math.abs(b) - 1, _ = g % 2 !== 0, M = b < 0;
      b === 0 ? i = i.add(Tn(_, s[w])) : o = o.add(Tn(M, s[S]));
    }
    return { p: o, f: i };
  }
  multiply(e, n) {
    let r = ti(e), s, o;
    if (Un) {
      const { k1neg: i, k1: c, k2neg: a, k2: f } = Bn.splitScalar(r);
      let { p: d, f: l } = this.wNAF(c, n), { p: g, f: h } = this.wNAF(f, n);
      d = Tn(i, d), g = Tn(a, g), g = new R(v(g.x * Bn.beta), g.y, g.z), s = d.add(g), o = l.add(h);
    } else {
      const { p: i, f: c } = this.wNAF(r, n);
      s = i, o = c;
    }
    return R.normalizeZ([s, o])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, o = this.equals(R.ZERO);
    e == null && (e = o ? Yo : en(s));
    const i = e, c = v(i * i), a = v(c * i), f = v(n * c), d = v(r * a), l = v(s * i);
    if (o)
      return z.ZERO;
    if (l !== q)
      throw new Error("invZ was invalid");
    return new z(f, d);
  }
}
R.BASE = new R(G.Gx, G.Gy, q);
R.ZERO = new R(F, q, F);
function Tn(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const fs = /* @__PURE__ */ new WeakMap();
class z {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, fs.delete(this);
  }
  hasEvenY() {
    return this.y % ue === F;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = pt(n ? e : e.subarray(1));
    if (!Xn(r))
      throw new Error("Point is not on curve");
    const s = Qo(r);
    let o = xu(s);
    const i = (o & q) === q;
    n ? i && (o = v(-o)) : (e[0] & 1) === 1 !== i && (o = v(-o));
    const c = new z(r, o);
    return c.assertValidity(), c;
  }
  static fromUncompressedHex(e) {
    const n = pt(e.subarray(1, Et + 1)), r = pt(e.subarray(Et + 1, Et * 2 + 1)), s = new z(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Ht(e), r = n.length, s = n[0];
    if (r === Et)
      return this.fromCompressedHex(n);
    if (r === sr && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === or && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${sr} compressed bytes or ${or} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return z.BASE.multiply(Ae(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: o } = Bc(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const i = Ps(Ht(e)), { n: c } = G, a = r === 2 || r === 3 ? s + c : s, f = en(a, c), d = v(-i * f, c), l = v(o * f, c), g = r & 1 ? "03" : "02", h = z.fromHex(g + de(a)), b = z.BASE.multiplyAndAddUnsafe(h, d, l);
    if (!b)
      throw new Error("Cannot recover signature: point at infinify");
    return b.assertValidity(), b;
  }
  toRawBytes(e = !1) {
    return he(this.toHex(e));
  }
  toHex(e = !1) {
    const n = de(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${de(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Xn(n) || !Xn(r))
      throw new Error(e);
    const s = v(r * r), o = Qo(n);
    if (v(s - o) !== F)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new z(this.x, v(-this.y));
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
    const s = R.fromAffine(this), o = n === F || n === q || this !== z.BASE ? s.multiplyUnsafe(n) : s.multiply(n), i = R.fromAffine(e).multiplyUnsafe(r), c = o.add(i);
    return c.equals(R.ZERO) ? void 0 : c.toAffine();
  }
}
z.BASE = new z(G.Gx, G.Gy);
z.ZERO = new z(F, F);
function Xo(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Jo(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Ke(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: pt(n), left: t.subarray(e + 2) };
}
function pu(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Ke(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Jo(t.subarray(2)), { data: r, left: s } = Jo(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Ke(s)}`);
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
    const s = n ? Ke(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new jt(ir(s.slice(0, 64)), ir(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = pu(n ? e : he(e));
    return new jt(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Ye(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Ye(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = G.n >> q;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new jt(this.r, v(-this.s, G.n)) : this;
  }
  toDERRawBytes() {
    return he(this.toDERHex());
  }
  toDERHex() {
    const e = Xo(ln(this.s)), n = Xo(ln(this.r)), r = e.length / 2, s = n.length / 2, o = ln(r), i = ln(s);
    return `30${ln(s + r + 4)}02${i}${n}02${o}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return he(this.toCompactHex());
  }
  toCompactHex() {
    return de(this.r) + de(this.s);
  }
}
function ce(...t) {
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
const bu = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ke(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += bu[t[n]];
  return e;
}
const wu = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function de(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(F <= t && t < wu))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function We(t) {
  const e = he(de(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function ln(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function ir(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function he(t) {
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
function pt(t) {
  return ir(Ke(t));
}
function Ht(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : he(t);
}
function ti(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Ye(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function v(t, e = G.P) {
  const n = t % e;
  return n >= F ? n : e + n;
}
function xt(t, e) {
  const { P: n } = G;
  let r = t;
  for (; e-- > F; )
    r *= r, r %= n;
  return r;
}
function xu(t) {
  const { P: e } = G, n = BigInt(6), r = BigInt(11), s = BigInt(22), o = BigInt(23), i = BigInt(44), c = BigInt(88), a = t * t * t % e, f = a * a * t % e, d = xt(f, dn) * f % e, l = xt(d, dn) * f % e, g = xt(l, ue) * a % e, h = xt(g, r) * g % e, b = xt(h, s) * h % e, w = xt(b, i) * b % e, S = xt(w, c) * w % e, _ = xt(S, i) * b % e, M = xt(_, dn) * f % e, x = xt(M, o) * h % e, L = xt(x, n) * a % e, A = xt(L, ue);
  if (A * A % e !== t)
    throw new Error("Cannot find square root");
  return A;
}
function en(t, e = G.P) {
  if (t === F || e <= F)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = v(t, e), r = e, s = F, o = q;
  for (; n !== F; ) {
    const c = r / n, a = r % n, f = s - o * c;
    r = n, n = a, s = o, o = f;
  }
  if (r !== q)
    throw new Error("invert: does not exist");
  return v(s, e);
}
function yu(t, e = G.P) {
  const n = new Array(t.length), r = t.reduce((o, i, c) => i === F ? o : (n[c] = o, v(o * i, e)), q), s = en(r, e);
  return t.reduceRight((o, i, c) => i === F ? o : (n[c] = v(o * n[c], e), v(o * i, e)), s), n;
}
function mu(t) {
  const e = t.length * 8 - Se * 8, n = pt(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Ps(t, e = !1) {
  const n = mu(t);
  if (e)
    return n;
  const { n: r } = G;
  return n >= r ? n - r : n;
}
let Fe, hn;
class Dc {
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
    return hn(this.k, ...e);
  }
  checkSync() {
    if (typeof hn != "function")
      throw new ks("hmacSha256Sync needs to be set");
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
    return ce(...n);
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
    return ce(...n);
  }
}
function Ye(t) {
  return F < t && t < G.n;
}
function Xn(t) {
  return F < t && t < G.P;
}
function Nc(t, e, n, r = !0) {
  const { n: s } = G, o = Ps(t, !0);
  if (!Ye(o))
    return;
  const i = en(o, s), c = z.BASE.multiply(o), a = v(c.x, s);
  if (a === F)
    return;
  const f = v(i * v(e + n * a, s), s);
  if (f === F)
    return;
  let d = new jt(a, f), l = (c.x === d.r ? 0 : 2) | Number(c.y & q);
  return r && d.hasHighS() && (d = d.normalizeS(), l ^= 1), { sig: d, recovery: l };
}
function Ae(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Se)
      throw new Error("Expected 32 bytes of private key");
    e = ir(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Se)
      throw new Error("Expected 32 bytes of private key");
    e = pt(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Ye(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Fs(t) {
  return t instanceof z ? (t.assertValidity(), t) : z.fromHex(t);
}
function Bc(t) {
  if (t instanceof jt)
    return t.assertValidity(), t;
  try {
    return jt.fromDER(t);
  } catch {
    return jt.fromCompact(t);
  }
}
function zs(t, e = !1) {
  return z.fromPrivateKey(t).toRawBytes(e);
}
function Su(t, e, n, r = !1) {
  return z.fromSignature(t, e, n).toRawBytes(r);
}
function ei(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === sr || r === or : n ? r === sr * 2 || r === or * 2 : t instanceof z;
}
function Rs(t, e, n = !1) {
  if (ei(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!ei(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Fs(e);
  return r.assertValidity(), r.multiply(Ae(t)).toRawBytes(n);
}
function Uc(t) {
  const e = t.length > Et ? t.slice(0, Et) : t;
  return pt(e);
}
function Au(t) {
  const e = Uc(t), n = v(e, G.n);
  return Tc(n < F ? e : n);
}
function Tc(t) {
  return We(t);
}
function jc(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Ht(t), s = Ae(e), o = [Tc(s), Au(r)];
  if (n != null) {
    n === !0 && (n = et.randomBytes(Et));
    const a = Ht(n);
    if (a.length !== Et)
      throw new Error(`sign: Expected ${Et} bytes of extra data`);
    o.push(a);
  }
  const i = ce(...o), c = Uc(r);
  return { seed: i, m: c, d: s };
}
function Oc(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: o } = Object.assign({ canonical: !0, der: !0 }, e), i = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return o ? [i, r] : i;
}
async function Eu(t, e, n = {}) {
  const { seed: r, m: s, d: o } = jc(t, e, n.extraEntropy), i = new Dc(Hc, Se);
  await i.reseed(r);
  let c;
  for (; !(c = Nc(await i.generate(), s, o, n.canonical)); )
    await i.reseed();
  return Oc(c, n);
}
function kc(t, e, n = {}) {
  const { seed: r, m: s, d: o } = jc(t, e, n.extraEntropy), i = new Dc(Hc, Se);
  i.reseedSync(r);
  let c;
  for (; !(c = Nc(i.generateSync(), s, o, n.canonical)); )
    i.reseedSync();
  return Oc(c, n);
}
const Iu = { strict: !0 };
function vu(t, e, n, r = Iu) {
  let s;
  try {
    s = Bc(t), e = Ht(e);
  } catch {
    return !1;
  }
  const { r: o, s: i } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const c = Ps(e);
  let a;
  try {
    a = Fs(n);
  } catch {
    return !1;
  }
  const { n: f } = G, d = en(i, f), l = v(c * d, f), g = v(o * d, f), h = z.BASE.multiplyAndAddUnsafe(a, l, g);
  return h ? v(h.x, f) === o : !1;
}
function cr(t) {
  return v(pt(t), G.n);
}
class Ze {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Ht(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = pt(n.subarray(0, 32)), s = pt(n.subarray(32, 64));
    return new Ze(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Xn(e) || !Ye(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return de(this.r) + de(this.s);
  }
  toRawBytes() {
    return he(this.toHex());
  }
}
function Lu(t) {
  return z.fromPrivateKey(t).toRawX();
}
class Pc {
  constructor(e, n, r = et.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Ht(e);
    const { x: s, scalar: o } = this.getScalar(Ae(n));
    if (this.px = s, this.d = o, this.rand = Ht(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = z.fromPrivateKey(e), r = n.hasEvenY() ? e : G.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return We(e ^ pt(n));
  }
  finalizeNonce(e) {
    const n = v(pt(e), G.n);
    if (n === F)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: o } = this.getScalar(n);
    return { R: r, rx: s, k: o };
  }
  finalizeSig(e, n, r, s) {
    return new Ze(e.x, v(n + r * s, G.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, o = et.taggedHash, i = this.initNonce(n, await o(ie.aux, s)), { R: c, rx: a, k: f } = this.finalizeNonce(await o(ie.nonce, i, r, e)), d = cr(await o(ie.challenge, a, r, e)), l = this.finalizeSig(c, f, d, n);
    return await Rc(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, o = et.taggedHashSync, i = this.initNonce(n, o(ie.aux, s)), { R: c, rx: a, k: f } = this.finalizeNonce(o(ie.nonce, i, r, e)), d = cr(o(ie.challenge, a, r, e)), l = this.finalizeSig(c, f, d, n);
    return Gc(l, e, r) || this.error(), l;
  }
}
async function _u(t, e, n) {
  return new Pc(t, e, n).calc();
}
function Mu(t, e, n) {
  return new Pc(t, e, n).calcSync();
}
function Fc(t, e, n) {
  const r = t instanceof Ze, s = r ? t : Ze.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Ht(e),
    P: Fs(n)
  };
}
function zc(t, e, n, r) {
  const s = z.BASE.multiplyAndAddUnsafe(e, Ae(n), v(-r, G.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Rc(t, e, n) {
  try {
    const { r, s, m: o, P: i } = Fc(t, e, n), c = cr(await et.taggedHash(ie.challenge, We(r), i.toRawX(), o));
    return zc(r, i, s, c);
  } catch {
    return !1;
  }
}
function Gc(t, e, n) {
  try {
    const { r, s, m: o, P: i } = Fc(t, e, n), c = cr(et.taggedHashSync(ie.challenge, We(r), i.toRawX(), o));
    return zc(r, i, s, c);
  } catch (r) {
    if (r instanceof ks)
      throw r;
    return !1;
  }
}
const $u = {
  Signature: Ze,
  getPublicKey: Lu,
  sign: _u,
  verify: Rc,
  signSync: Mu,
  verifySync: Gc
};
z.BASE._setWindowSize(8);
const dt = {
  node: Cc,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, ie = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, jn = {}, et = {
  bytesToHex: Ke,
  hexToBytes: he,
  concatBytes: ce,
  mod: v,
  invert: en,
  isValidPrivateKey(t) {
    try {
      return Ae(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: We,
  _normalizePrivateKey: Ae,
  hashToPrivateKey: (t) => {
    t = Ht(t);
    const e = Se + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = v(pt(t), G.n - q) + q;
    return We(n);
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
  randomPrivateKey: () => et.hashToPrivateKey(et.randomBytes(Se + 8)),
  precompute(t = 8, e = z.BASE) {
    const n = e === z.BASE ? e : new z(e.x, e.y);
    return n._setWindowSize(t), n.multiply(dn), n;
  },
  sha256: async (...t) => {
    if (dt.web) {
      const e = await dt.web.subtle.digest("SHA-256", ce(...t));
      return new Uint8Array(e);
    } else if (dt.node) {
      const { createHash: e } = dt.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (dt.web) {
      const n = await dt.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = ce(...e), s = await dt.web.subtle.sign("HMAC", n, r);
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
    let n = jn[t];
    if (n === void 0) {
      const r = await et.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = ce(r, r), jn[t] = n;
    }
    return et.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Fe != "function")
      throw new ks("sha256Sync is undefined, you need to set it");
    let n = jn[t];
    if (n === void 0) {
      const r = Fe(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = ce(r, r), jn[t] = n;
    }
    return Fe(n, ...e);
  },
  _JacobianPoint: R
};
Object.defineProperties(et, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Fe;
    },
    set(t) {
      Fe || (Fe = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return hn;
    },
    set(t) {
      hn || (hn = t);
    }
  }
});
const Cu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: G,
  Point: z,
  Signature: jt,
  getPublicKey: zs,
  getSharedSecret: Rs,
  recoverPublicKey: Su,
  schnorr: $u,
  sign: Eu,
  signSync: kc,
  utils: et,
  verify: vu
}, Symbol.toStringTag, { value: "Module" }));
var mt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Hu(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Vc(t) {
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
var xn = {};
xn.byteLength = Tu;
var Du = xn.toByteArray = Ou, Nu = xn.fromByteArray = Fu, Mt = [], yt = [], Bu = typeof Uint8Array < "u" ? Uint8Array : Array, qr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Be = 0, Uu = qr.length; Be < Uu; ++Be)
  Mt[Be] = qr[Be], yt[qr.charCodeAt(Be)] = Be;
yt[45] = 62;
yt[95] = 63;
function Kc(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Tu(t) {
  var e = Kc(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function ju(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Ou(t) {
  var e, n = Kc(t), r = n[0], s = n[1], o = new Bu(ju(t, r, s)), i = 0, c = s > 0 ? r - 4 : r, a;
  for (a = 0; a < c; a += 4)
    e = yt[t.charCodeAt(a)] << 18 | yt[t.charCodeAt(a + 1)] << 12 | yt[t.charCodeAt(a + 2)] << 6 | yt[t.charCodeAt(a + 3)], o[i++] = e >> 16 & 255, o[i++] = e >> 8 & 255, o[i++] = e & 255;
  return s === 2 && (e = yt[t.charCodeAt(a)] << 2 | yt[t.charCodeAt(a + 1)] >> 4, o[i++] = e & 255), s === 1 && (e = yt[t.charCodeAt(a)] << 10 | yt[t.charCodeAt(a + 1)] << 4 | yt[t.charCodeAt(a + 2)] >> 2, o[i++] = e >> 8 & 255, o[i++] = e & 255), o;
}
function ku(t) {
  return Mt[t >> 18 & 63] + Mt[t >> 12 & 63] + Mt[t >> 6 & 63] + Mt[t & 63];
}
function Pu(t, e, n) {
  for (var r, s = [], o = e; o < n; o += 3)
    r = (t[o] << 16 & 16711680) + (t[o + 1] << 8 & 65280) + (t[o + 2] & 255), s.push(ku(r));
  return s.join("");
}
function Fu(t) {
  for (var e, n = t.length, r = n % 3, s = [], o = 16383, i = 0, c = n - r; i < c; i += o)
    s.push(Pu(t, i, i + o > c ? c : i + o));
  return r === 1 ? (e = t[n - 1], s.push(
    Mt[e >> 2] + Mt[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    Mt[e >> 10] + Mt[e >> 4 & 63] + Mt[e << 2 & 63] + "="
  )), s.join("");
}
function zu() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const Ru = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function Gu() {
  if (zu())
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
    throw new Error(Ru);
  }
}
class Vu {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const o = this.createCipher(e, n, r), i = new Uint8Array(Ge(o.update(s), o.final()));
    return Promise.resolve(i);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const o = this.createDecipher(e, n, r), i = new Uint8Array(Ge(o.update(s), o.final()));
    return Promise.resolve(i);
  }
}
class Ku {
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
async function Wc() {
  const t = await Gu();
  return t.name === "subtleCrypto" ? new Ku(t.lib) : new Vu(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function Wu(t) {
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
  function d(h) {
    if (h instanceof Uint8Array || (ArrayBuffer.isView(h) ? h = new Uint8Array(h.buffer, h.byteOffset, h.byteLength) : Array.isArray(h) && (h = Uint8Array.from(h))), !(h instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (h.length === 0)
      return "";
    for (var b = 0, w = 0, S = 0, _ = h.length; S !== _ && h[S] === 0; )
      S++, b++;
    for (var M = (_ - S) * f + 1 >>> 0, x = new Uint8Array(M); S !== _; ) {
      for (var L = h[S], A = 0, N = M - 1; (L !== 0 || A < w) && N !== -1; N--, A++)
        L += 256 * x[N] >>> 0, x[N] = L % i >>> 0, L = L / i >>> 0;
      if (L !== 0)
        throw new Error("Non-zero carry");
      w = A, S++;
    }
    for (var P = M - w; P !== M && x[P] === 0; )
      P++;
    for (var C = c.repeat(b); P < M; ++P)
      C += t.charAt(x[P]);
    return C;
  }
  function l(h) {
    if (typeof h != "string")
      throw new TypeError("Expected String");
    if (h.length === 0)
      return new Uint8Array();
    for (var b = 0, w = 0, S = 0; h[b] === c; )
      w++, b++;
    for (var _ = (h.length - b) * a + 1 >>> 0, M = new Uint8Array(_); h[b]; ) {
      var x = h.charCodeAt(b);
      if (x > 255)
        return;
      var L = e[x];
      if (L === 255)
        return;
      for (var A = 0, N = _ - 1; (L !== 0 || A < S) && N !== -1; N--, A++)
        L += i * M[N] >>> 0, M[N] = L % 256 >>> 0, L = L / 256 >>> 0;
      if (L !== 0)
        throw new Error("Non-zero carry");
      S = A, b++;
    }
    for (var P = _ - S; P !== _ && M[P] === 0; )
      P++;
    for (var C = new Uint8Array(w + (_ - P)), D = w; P !== _; )
      C[D++] = M[P++];
    return C;
  }
  function g(h) {
    var b = l(h);
    if (b)
      return b;
    throw new Error("Non-base" + i + " character");
  }
  return {
    encode: d,
    decodeUnsafe: l,
    decode: g
  };
}
var Yc = Wu;
const Yu = Yc, Zu = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Qu = Yu(Zu);
const qu = /* @__PURE__ */ Hu(Qu), Xu = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Zc = Uint8Array.from({ length: 16 }, (t, e) => e), Ju = Zc.map((t) => (9 * t + 5) % 16);
let Gs = [Zc], Vs = [Ju];
for (let t = 0; t < 4; t++)
  for (let e of [Gs, Vs])
    e.push(e[t].map((n) => Xu[n]));
const Qc = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), td = Gs.map((t, e) => t.map((n) => Qc[e][n])), ed = Vs.map((t, e) => t.map((n) => Qc[e][n])), nd = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), rd = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), On = (t, e) => t << e | t >>> 32 - e;
function ni(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const kn = new Uint32Array(16);
let sd = class extends Os {
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
    for (let h = 0; h < 16; h++, n += 4)
      kn[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, c = this.h2 | 0, a = c, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, w = nd[h], S = rd[h], _ = Gs[h], M = Vs[h], x = td[h], L = ed[h];
      for (let A = 0; A < 16; A++) {
        const N = On(r + ni(h, o, c, f) + kn[_[A]] + w, x[A]) + l | 0;
        r = l, l = f, f = On(c, 10) | 0, c = o, o = N;
      }
      for (let A = 0; A < 16; A++) {
        const N = On(s + ni(b, i, a, d) + kn[M[A]] + S, L[A]) + g | 0;
        s = g, g = d, d = On(a, 10) | 0, a = i, i = N;
      }
    }
    this.set(this.h1 + c + d | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + i | 0, this.h0 + o + a | 0);
  }
  roundClean() {
    kn.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const od = _e(() => new sd());
function id(t) {
  return od(t);
}
const Pn = BigInt(2 ** 32 - 1), us = BigInt(32);
function qc(t, e = !1) {
  return e ? { h: Number(t & Pn), l: Number(t >> us & Pn) } : { h: Number(t >> us & Pn) | 0, l: Number(t & Pn) | 0 };
}
function cd(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = qc(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const ad = (t, e) => BigInt(t >>> 0) << us | BigInt(e >>> 0), ld = (t, e, n) => t >>> n, fd = (t, e, n) => t << 32 - n | e >>> n, ud = (t, e, n) => t >>> n | e << 32 - n, dd = (t, e, n) => t << 32 - n | e >>> n, hd = (t, e, n) => t << 64 - n | e >>> n - 32, gd = (t, e, n) => t >>> n - 32 | e << 64 - n, pd = (t, e) => e, bd = (t, e) => t, wd = (t, e, n) => t << n | e >>> 32 - n, xd = (t, e, n) => e << n | t >>> 32 - n, yd = (t, e, n) => e << n - 32 | t >>> 64 - n, md = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Sd(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Ad = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Ed = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Id = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), vd = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Ld = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), _d = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, T = {
  fromBig: qc,
  split: cd,
  toBig: ad,
  shrSH: ld,
  shrSL: fd,
  rotrSH: ud,
  rotrSL: dd,
  rotrBH: hd,
  rotrBL: gd,
  rotr32H: pd,
  rotr32L: bd,
  rotlSH: wd,
  rotlSL: xd,
  rotlBH: yd,
  rotlBL: md,
  add: Sd,
  add3L: Ad,
  add3H: Ed,
  add4L: Id,
  add4H: vd,
  add5H: _d,
  add5L: Ld
}, [Md, $d] = T.split([
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
].map((t) => BigInt(t))), Wt = new Uint32Array(80), Yt = new Uint32Array(80);
let yr = class extends Os {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: c, Dl: a, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: b, Hh: w, Hl: S } = this;
    return [e, n, r, s, o, i, c, a, f, d, l, g, h, b, w, S];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, a, f, d, l, g, h, b, w, S) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = a | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = b | 0, this.Hh = w | 0, this.Hl = S | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      Wt[x] = e.getUint32(n), Yt[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const L = Wt[x - 15] | 0, A = Yt[x - 15] | 0, N = T.rotrSH(L, A, 1) ^ T.rotrSH(L, A, 8) ^ T.shrSH(L, A, 7), P = T.rotrSL(L, A, 1) ^ T.rotrSL(L, A, 8) ^ T.shrSL(L, A, 7), C = Wt[x - 2] | 0, D = Yt[x - 2] | 0, V = T.rotrSH(C, D, 19) ^ T.rotrBH(C, D, 61) ^ T.shrSH(C, D, 6), X = T.rotrSL(C, D, 19) ^ T.rotrBL(C, D, 61) ^ T.shrSL(C, D, 6), Q = T.add4L(P, X, Yt[x - 7], Yt[x - 16]), J = T.add4H(Q, N, V, Wt[x - 7], Wt[x - 16]);
      Wt[x] = J | 0, Yt[x] = Q | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: c, Cl: a, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: b, Gh: w, Gl: S, Hh: _, Hl: M } = this;
    for (let x = 0; x < 80; x++) {
      const L = T.rotrSH(l, g, 14) ^ T.rotrSH(l, g, 18) ^ T.rotrBH(l, g, 41), A = T.rotrSL(l, g, 14) ^ T.rotrSL(l, g, 18) ^ T.rotrBL(l, g, 41), N = l & h ^ ~l & w, P = g & b ^ ~g & S, C = T.add5L(M, A, P, $d[x], Yt[x]), D = T.add5H(C, _, L, N, Md[x], Wt[x]), V = C | 0, X = T.rotrSH(r, s, 28) ^ T.rotrBH(r, s, 34) ^ T.rotrBH(r, s, 39), Q = T.rotrSL(r, s, 28) ^ T.rotrBL(r, s, 34) ^ T.rotrBL(r, s, 39), J = r & o ^ r & c ^ o & c, wt = s & i ^ s & a ^ i & a;
      _ = w | 0, M = S | 0, w = h | 0, S = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = T.add(f | 0, d | 0, D | 0, V | 0), f = c | 0, d = a | 0, c = o | 0, a = i | 0, o = r | 0, i = s | 0;
      const nt = T.add3L(V, Q, wt);
      r = T.add3H(nt, D, X, J), s = nt | 0;
    }
    ({ h: r, l: s } = T.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = T.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: c, l: a } = T.add(this.Ch | 0, this.Cl | 0, c | 0, a | 0), { h: f, l: d } = T.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = T.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = T.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: w, l: S } = T.add(this.Gh | 0, this.Gl | 0, w | 0, S | 0), { h: _, l: M } = T.add(this.Hh | 0, this.Hl | 0, _ | 0, M | 0), this.set(r, s, o, i, c, a, f, d, l, g, h, b, w, S, _, M);
  }
  roundClean() {
    Wt.fill(0), Yt.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Cd = class extends yr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Hd = class extends yr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Dd = class extends yr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const Nd = _e(() => new yr());
_e(() => new Cd());
_e(() => new Hd());
_e(() => new Dd());
function Xc(t) {
  return Ve(t);
}
function Bd(t) {
  return Nd(t);
}
const Ud = 0;
et.hmacSha256Sync = (t, ...e) => {
  const n = xr.create(Ve, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Td() {
  return le(et.randomPrivateKey());
}
function jd(t) {
  const e = Ve(Ve(t));
  return qu.encode(Ge(t, e).slice(0, t.length + 4));
}
function Od(t, e) {
  return jd(Ge(new Uint8Array([t]), e.slice(0, 20)));
}
function Jc(t, e = Ud) {
  const n = typeof t == "string" ? fe(t) : t, r = id(Xc(n));
  return Od(e, r);
}
function ta(t) {
  const e = Xf(t);
  return le(zs(e.slice(0, 32), !0));
}
et.hmacSha256Sync = (t, ...e) => {
  const n = xr.create(Ve, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var ar;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(ar || (ar = {}));
async function kd(t, e, n) {
  return await (await Wc()).encrypt("aes-256-cbc", e, t, n);
}
async function Pd(t, e, n) {
  return await (await Wc()).decrypt("aes-256-cbc", e, t, n);
}
function ea(t, e) {
  return xr(Ve, t, e);
}
function Fd(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function na(t) {
  const e = Bd(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function zd(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function Rd(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: ar.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: ar.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !zd(t))
    return e;
  try {
    return z.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function Gd(t, e, n, r) {
  const s = Rd(t);
  if (!s.result)
    throw s;
  const o = et.randomPrivateKey(), i = zs(o, !0);
  let c = Rs(o, t, !0);
  c = c.slice(1);
  const a = na(c), f = et.randomBytes(16), d = await kd(f, a.encryptionKey, e), l = Ge(f, i, d), g = ea(a.hmacKey, l);
  let h;
  if (!r || r === "hex")
    h = le(d);
  else if (r === "base64")
    h = Nu(d);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const b = {
    iv: le(f),
    ephemeralPK: le(i),
    cipherText: h,
    mac: le(g),
    wasString: n
  };
  return r && r !== "hex" && (b.cipherTextEncoding = r), b;
}
async function ra(t, e) {
  if (!e.ephemeralPK)
    throw new Ko("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = Rs(t, n, !0);
  r = r.slice(1);
  const s = na(r), o = fe(e.iv);
  let i;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    i = fe(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    i = Du(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const c = Ge(o, fe(n), i), a = ea(s.hmacKey, c), f = fe(e.mac);
  if (!Fd(f, a))
    throw new Ko("Decryption failed: failure in MAC check");
  const d = await Pd(o, s.encryptionKey, i);
  return e.wasString ? vc(d) : d;
}
function Vd(t, e) {
  const n = typeof e == "string" ? Ic(e) : e, r = ta(t), s = Xc(n), o = kc(s, t);
  return {
    signature: le(o),
    publicKey: r
  };
}
async function Kd(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = ta(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", o = typeof t == "string" ? Ic(t) : t, i = await Gd(n.publicKey, o, s, n.cipherTextEncoding);
  let c = JSON.stringify(i);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const a = Vd(r, c), f = {
      signature: a.signature,
      publicKey: a.publicKey,
      cipherText: c
    };
    c = JSON.stringify(f);
  }
  return c;
}
function Wd(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return ra(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var bt = {}, Qe = {}, at = {};
Object.defineProperty(at, "__esModule", { value: !0 });
at.decode = at.encode = at.unescape = at.escape = at.pad = void 0;
const sa = xn;
function Ks(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
at.pad = Ks;
function oa(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
at.escape = oa;
function ia(t) {
  return Ks(t).replace(/-/g, "+").replace(/_/g, "/");
}
at.unescape = ia;
function Yd(t) {
  return oa((0, sa.fromByteArray)(new TextEncoder().encode(t)));
}
at.encode = Yd;
function Zd(t) {
  return new TextDecoder().decode((0, sa.toByteArray)(Ks(ia(t))));
}
at.decode = Zd;
var mr = {}, Sr = {}, ca = {}, zt = {}, Ar = {};
Object.defineProperty(Ar, "__esModule", { value: !0 });
Ar.crypto = void 0;
Ar.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = o, t.aexists = i, t.aoutput = c, t.u8 = a, t.u32 = f, t.clean = d, t.createView = l, t.rotr = g, t.rotl = h, t.byteSwap = b, t.byteSwap32 = w, t.bytesToHex = M, t.hexToBytes = A, t.asyncLoop = P, t.utf8ToBytes = C, t.bytesToUtf8 = D, t.toBytes = V, t.kdfInputToBytes = X, t.concatBytes = Q, t.checkOpts = J, t.createHasher = nt, t.createOptHasher = In, t.createXOFer = vn, t.randomBytes = Dr;
  const e = Ar;
  function n(y) {
    return y instanceof Uint8Array || ArrayBuffer.isView(y) && y.constructor.name === "Uint8Array";
  }
  function r(y) {
    if (!Number.isSafeInteger(y) || y < 0)
      throw new Error("positive integer expected, got " + y);
  }
  function s(y, ...I) {
    if (!n(y))
      throw new Error("Uint8Array expected");
    if (I.length > 0 && !I.includes(y.length))
      throw new Error("Uint8Array expected of length " + I + ", got length=" + y.length);
  }
  function o(y) {
    if (typeof y != "function" || typeof y.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(y.outputLen), r(y.blockLen);
  }
  function i(y, I = !0) {
    if (y.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (I && y.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function c(y, I) {
    s(y);
    const W = I.outputLen;
    if (y.length < W)
      throw new Error("digestInto() expects output buffer of length at least " + W);
  }
  function a(y) {
    return new Uint8Array(y.buffer, y.byteOffset, y.byteLength);
  }
  function f(y) {
    return new Uint32Array(y.buffer, y.byteOffset, Math.floor(y.byteLength / 4));
  }
  function d(...y) {
    for (let I = 0; I < y.length; I++)
      y[I].fill(0);
  }
  function l(y) {
    return new DataView(y.buffer, y.byteOffset, y.byteLength);
  }
  function g(y, I) {
    return y << 32 - I | y >>> I;
  }
  function h(y, I) {
    return y << I | y >>> 32 - I >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function b(y) {
    return y << 24 & 4278190080 | y << 8 & 16711680 | y >>> 8 & 65280 | y >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (y) => y : (y) => b(y), t.byteSwapIfBE = t.swap8IfBE;
  function w(y) {
    for (let I = 0; I < y.length; I++)
      y[I] = b(y[I]);
    return y;
  }
  t.swap32IfBE = t.isLE ? (y) => y : w;
  const S = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", _ = /* @__PURE__ */ Array.from({ length: 256 }, (y, I) => I.toString(16).padStart(2, "0"));
  function M(y) {
    if (s(y), S)
      return y.toHex();
    let I = "";
    for (let W = 0; W < y.length; W++)
      I += _[y[W]];
    return I;
  }
  const x = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function L(y) {
    if (y >= x._0 && y <= x._9)
      return y - x._0;
    if (y >= x.A && y <= x.F)
      return y - (x.A - 10);
    if (y >= x.a && y <= x.f)
      return y - (x.a - 10);
  }
  function A(y) {
    if (typeof y != "string")
      throw new Error("hex string expected, got " + typeof y);
    if (S)
      return Uint8Array.fromHex(y);
    const I = y.length, W = I / 2;
    if (I % 2)
      throw new Error("hex string expected, got unpadded hex of length " + I);
    const Z = new Uint8Array(W);
    for (let K = 0, st = 0; K < W; K++, st += 2) {
      const on = L(y.charCodeAt(st)), Ln = L(y.charCodeAt(st + 1));
      if (on === void 0 || Ln === void 0) {
        const Nr = y[st] + y[st + 1];
        throw new Error('hex string expected, got non-hex character "' + Nr + '" at index ' + st);
      }
      Z[K] = on * 16 + Ln;
    }
    return Z;
  }
  const N = async () => {
  };
  t.nextTick = N;
  async function P(y, I, W) {
    let Z = Date.now();
    for (let K = 0; K < y; K++) {
      W(K);
      const st = Date.now() - Z;
      st >= 0 && st < I || (await (0, t.nextTick)(), Z += st);
    }
  }
  function C(y) {
    if (typeof y != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(y));
  }
  function D(y) {
    return new TextDecoder().decode(y);
  }
  function V(y) {
    return typeof y == "string" && (y = C(y)), s(y), y;
  }
  function X(y) {
    return typeof y == "string" && (y = C(y)), s(y), y;
  }
  function Q(...y) {
    let I = 0;
    for (let Z = 0; Z < y.length; Z++) {
      const K = y[Z];
      s(K), I += K.length;
    }
    const W = new Uint8Array(I);
    for (let Z = 0, K = 0; Z < y.length; Z++) {
      const st = y[Z];
      W.set(st, K), K += st.length;
    }
    return W;
  }
  function J(y, I) {
    if (I !== void 0 && {}.toString.call(I) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(y, I);
  }
  class wt {
  }
  t.Hash = wt;
  function nt(y) {
    const I = (Z) => y().update(V(Z)).digest(), W = y();
    return I.outputLen = W.outputLen, I.blockLen = W.blockLen, I.create = () => y(), I;
  }
  function In(y) {
    const I = (Z, K) => y(K).update(V(Z)).digest(), W = y({});
    return I.outputLen = W.outputLen, I.blockLen = W.blockLen, I.create = (Z) => y(Z), I;
  }
  function vn(y) {
    const I = (Z, K) => y(K).update(V(Z)).digest(), W = y({});
    return I.outputLen = W.outputLen, I.blockLen = W.blockLen, I.create = (Z) => y(Z), I;
  }
  t.wrapConstructor = nt, t.wrapConstructorWithOpts = In, t.wrapXOFConstructorWithOpts = vn;
  function Dr(y = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(y));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(y));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(zt);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = zt;
  class n extends e.Hash {
    constructor(o, i) {
      super(), this.finished = !1, this.destroyed = !1, (0, e.ahash)(o);
      const c = (0, e.toBytes)(i);
      if (this.iHash = o.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const a = this.blockLen, f = new Uint8Array(a);
      f.set(c.length > a ? o.create().update(c).digest() : c);
      for (let d = 0; d < f.length; d++)
        f[d] ^= 54;
      this.iHash.update(f), this.oHash = o.create();
      for (let d = 0; d < f.length; d++)
        f[d] ^= 106;
      this.oHash.update(f), (0, e.clean)(f);
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
      const { oHash: i, iHash: c, finished: a, destroyed: f, blockLen: d, outputLen: l } = this;
      return o = o, o.finished = a, o.destroyed = f, o.blockLen = d, o.outputLen = l, o.oHash = i._cloneInto(o.oHash), o.iHash = c._cloneInto(o.iHash), o;
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
})(ca);
var gt = {}, Y = {}, lt = {};
Object.defineProperty(lt, "__esModule", { value: !0 });
lt.SHA512_IV = lt.SHA384_IV = lt.SHA224_IV = lt.SHA256_IV = lt.HashMD = void 0;
lt.setBigUint64 = aa;
lt.Chi = Qd;
lt.Maj = qd;
const vt = zt;
function aa(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), a = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + a, i, r), t.setUint32(e + f, c, r);
}
function Qd(t, e, n) {
  return t & e ^ ~t & n;
}
function qd(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class Xd extends vt.Hash {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = (0, vt.createView)(this.buffer);
  }
  update(e) {
    (0, vt.aexists)(this), e = (0, vt.toBytes)(e), (0, vt.abytes)(e);
    const { view: n, buffer: r, blockLen: s } = this, o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const a = (0, vt.createView)(e);
        for (; s <= o - i; i += s)
          this.process(a, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    (0, vt.aexists)(this), (0, vt.aoutput)(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, (0, vt.clean)(this.buffer.subarray(i)), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let l = i; l < s; l++)
      n[l] = 0;
    aa(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = (0, vt.createView)(e), a = this.outputLen;
    if (a % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = a / 4, d = this.get();
    if (f > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      c.setUint32(4 * l, d[l], o);
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
lt.HashMD = Xd;
lt.SHA256_IV = Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
lt.SHA224_IV = Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]);
lt.SHA384_IV = Uint32Array.from([
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
lt.SHA512_IV = Uint32Array.from([
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
var B = {};
Object.defineProperty(B, "__esModule", { value: !0 });
B.toBig = B.shrSL = B.shrSH = B.rotrSL = B.rotrSH = B.rotrBL = B.rotrBH = B.rotr32L = B.rotr32H = B.rotlSL = B.rotlSH = B.rotlBL = B.rotlBH = B.add5L = B.add5H = B.add4L = B.add4H = B.add3L = B.add3H = void 0;
B.add = Ea;
B.fromBig = Ws;
B.split = la;
const Fn = /* @__PURE__ */ BigInt(2 ** 32 - 1), ds = /* @__PURE__ */ BigInt(32);
function Ws(t, e = !1) {
  return e ? { h: Number(t & Fn), l: Number(t >> ds & Fn) } : { h: Number(t >> ds & Fn) | 0, l: Number(t & Fn) | 0 };
}
function la(t, e = !1) {
  const n = t.length;
  let r = new Uint32Array(n), s = new Uint32Array(n);
  for (let o = 0; o < n; o++) {
    const { h: i, l: c } = Ws(t[o], e);
    [r[o], s[o]] = [i, c];
  }
  return [r, s];
}
const fa = (t, e) => BigInt(t >>> 0) << ds | BigInt(e >>> 0);
B.toBig = fa;
const ua = (t, e, n) => t >>> n;
B.shrSH = ua;
const da = (t, e, n) => t << 32 - n | e >>> n;
B.shrSL = da;
const ha = (t, e, n) => t >>> n | e << 32 - n;
B.rotrSH = ha;
const ga = (t, e, n) => t << 32 - n | e >>> n;
B.rotrSL = ga;
const pa = (t, e, n) => t << 64 - n | e >>> n - 32;
B.rotrBH = pa;
const ba = (t, e, n) => t >>> n - 32 | e << 64 - n;
B.rotrBL = ba;
const wa = (t, e) => e;
B.rotr32H = wa;
const xa = (t, e) => t;
B.rotr32L = xa;
const ya = (t, e, n) => t << n | e >>> 32 - n;
B.rotlSH = ya;
const ma = (t, e, n) => e << n | t >>> 32 - n;
B.rotlSL = ma;
const Sa = (t, e, n) => e << n - 32 | t >>> 64 - n;
B.rotlBH = Sa;
const Aa = (t, e, n) => t << n - 32 | e >>> 64 - n;
B.rotlBL = Aa;
function Ea(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Ia = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0);
B.add3L = Ia;
const va = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0;
B.add3H = va;
const La = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0);
B.add4L = La;
const _a = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0;
B.add4H = _a;
const Ma = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0);
B.add5L = Ma;
const $a = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0;
B.add5H = $a;
const Jd = {
  fromBig: Ws,
  split: la,
  toBig: fa,
  shrSH: ua,
  shrSL: da,
  rotrSH: ha,
  rotrSL: ga,
  rotrBH: pa,
  rotrBL: ba,
  rotr32H: wa,
  rotr32L: xa,
  rotlSH: ya,
  rotlSL: ma,
  rotlBH: Sa,
  rotlBL: Aa,
  add: Ea,
  add3L: Ia,
  add3H: va,
  add4L: La,
  add4H: _a,
  add5H: $a,
  add5L: Ma
};
B.default = Jd;
Object.defineProperty(Y, "__esModule", { value: !0 });
Y.sha512_224 = Y.sha512_256 = Y.sha384 = Y.sha512 = Y.sha224 = Y.sha256 = Y.SHA512_256 = Y.SHA512_224 = Y.SHA384 = Y.SHA512 = Y.SHA224 = Y.SHA256 = void 0;
const H = lt, j = B, tt = zt, th = /* @__PURE__ */ Uint32Array.from([
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
]), Zt = /* @__PURE__ */ new Uint32Array(64);
let Ys = class extends H.HashMD {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = H.SHA256_IV[0] | 0, this.B = H.SHA256_IV[1] | 0, this.C = H.SHA256_IV[2] | 0, this.D = H.SHA256_IV[3] | 0, this.E = H.SHA256_IV[4] | 0, this.F = H.SHA256_IV[5] | 0, this.G = H.SHA256_IV[6] | 0, this.H = H.SHA256_IV[7] | 0;
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
      const g = Zt[l - 15], h = Zt[l - 2], b = (0, tt.rotr)(g, 7) ^ (0, tt.rotr)(g, 18) ^ g >>> 3, w = (0, tt.rotr)(h, 17) ^ (0, tt.rotr)(h, 19) ^ h >>> 10;
      Zt[l] = w + Zt[l - 7] + b + Zt[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: a, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = (0, tt.rotr)(c, 6) ^ (0, tt.rotr)(c, 11) ^ (0, tt.rotr)(c, 25), h = d + g + (0, H.Chi)(c, a, f) + th[l] + Zt[l] | 0, w = ((0, tt.rotr)(r, 2) ^ (0, tt.rotr)(r, 13) ^ (0, tt.rotr)(r, 22)) + (0, H.Maj)(r, s, o) | 0;
      d = f, f = a, a = c, c = i + h | 0, i = o, o = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, o, i, c, a, f, d);
  }
  roundClean() {
    (0, tt.clean)(Zt);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), (0, tt.clean)(this.buffer);
  }
};
Y.SHA256 = Ys;
let Ca = class extends Ys {
  constructor() {
    super(28), this.A = H.SHA224_IV[0] | 0, this.B = H.SHA224_IV[1] | 0, this.C = H.SHA224_IV[2] | 0, this.D = H.SHA224_IV[3] | 0, this.E = H.SHA224_IV[4] | 0, this.F = H.SHA224_IV[5] | 0, this.G = H.SHA224_IV[6] | 0, this.H = H.SHA224_IV[7] | 0;
  }
};
Y.SHA224 = Ca;
const Ha = j.split([
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
].map((t) => BigInt(t))), eh = Ha[0], nh = Ha[1], Qt = /* @__PURE__ */ new Uint32Array(80), qt = /* @__PURE__ */ new Uint32Array(80);
let yn = class extends H.HashMD {
  constructor(e = 64) {
    super(128, e, 16, !1), this.Ah = H.SHA512_IV[0] | 0, this.Al = H.SHA512_IV[1] | 0, this.Bh = H.SHA512_IV[2] | 0, this.Bl = H.SHA512_IV[3] | 0, this.Ch = H.SHA512_IV[4] | 0, this.Cl = H.SHA512_IV[5] | 0, this.Dh = H.SHA512_IV[6] | 0, this.Dl = H.SHA512_IV[7] | 0, this.Eh = H.SHA512_IV[8] | 0, this.El = H.SHA512_IV[9] | 0, this.Fh = H.SHA512_IV[10] | 0, this.Fl = H.SHA512_IV[11] | 0, this.Gh = H.SHA512_IV[12] | 0, this.Gl = H.SHA512_IV[13] | 0, this.Hh = H.SHA512_IV[14] | 0, this.Hl = H.SHA512_IV[15] | 0;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: c, Dl: a, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: b, Hh: w, Hl: S } = this;
    return [e, n, r, s, o, i, c, a, f, d, l, g, h, b, w, S];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, a, f, d, l, g, h, b, w, S) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = a | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = b | 0, this.Hh = w | 0, this.Hl = S | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      Qt[x] = e.getUint32(n), qt[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const L = Qt[x - 15] | 0, A = qt[x - 15] | 0, N = j.rotrSH(L, A, 1) ^ j.rotrSH(L, A, 8) ^ j.shrSH(L, A, 7), P = j.rotrSL(L, A, 1) ^ j.rotrSL(L, A, 8) ^ j.shrSL(L, A, 7), C = Qt[x - 2] | 0, D = qt[x - 2] | 0, V = j.rotrSH(C, D, 19) ^ j.rotrBH(C, D, 61) ^ j.shrSH(C, D, 6), X = j.rotrSL(C, D, 19) ^ j.rotrBL(C, D, 61) ^ j.shrSL(C, D, 6), Q = j.add4L(P, X, qt[x - 7], qt[x - 16]), J = j.add4H(Q, N, V, Qt[x - 7], Qt[x - 16]);
      Qt[x] = J | 0, qt[x] = Q | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: c, Cl: a, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: b, Gh: w, Gl: S, Hh: _, Hl: M } = this;
    for (let x = 0; x < 80; x++) {
      const L = j.rotrSH(l, g, 14) ^ j.rotrSH(l, g, 18) ^ j.rotrBH(l, g, 41), A = j.rotrSL(l, g, 14) ^ j.rotrSL(l, g, 18) ^ j.rotrBL(l, g, 41), N = l & h ^ ~l & w, P = g & b ^ ~g & S, C = j.add5L(M, A, P, nh[x], qt[x]), D = j.add5H(C, _, L, N, eh[x], Qt[x]), V = C | 0, X = j.rotrSH(r, s, 28) ^ j.rotrBH(r, s, 34) ^ j.rotrBH(r, s, 39), Q = j.rotrSL(r, s, 28) ^ j.rotrBL(r, s, 34) ^ j.rotrBL(r, s, 39), J = r & o ^ r & c ^ o & c, wt = s & i ^ s & a ^ i & a;
      _ = w | 0, M = S | 0, w = h | 0, S = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = j.add(f | 0, d | 0, D | 0, V | 0), f = c | 0, d = a | 0, c = o | 0, a = i | 0, o = r | 0, i = s | 0;
      const nt = j.add3L(V, Q, wt);
      r = j.add3H(nt, D, X, J), s = nt | 0;
    }
    ({ h: r, l: s } = j.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = j.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: c, l: a } = j.add(this.Ch | 0, this.Cl | 0, c | 0, a | 0), { h: f, l: d } = j.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = j.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = j.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: w, l: S } = j.add(this.Gh | 0, this.Gl | 0, w | 0, S | 0), { h: _, l: M } = j.add(this.Hh | 0, this.Hl | 0, _ | 0, M | 0), this.set(r, s, o, i, c, a, f, d, l, g, h, b, w, S, _, M);
  }
  roundClean() {
    (0, tt.clean)(Qt, qt);
  }
  destroy() {
    (0, tt.clean)(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
Y.SHA512 = yn;
let Da = class extends yn {
  constructor() {
    super(48), this.Ah = H.SHA384_IV[0] | 0, this.Al = H.SHA384_IV[1] | 0, this.Bh = H.SHA384_IV[2] | 0, this.Bl = H.SHA384_IV[3] | 0, this.Ch = H.SHA384_IV[4] | 0, this.Cl = H.SHA384_IV[5] | 0, this.Dh = H.SHA384_IV[6] | 0, this.Dl = H.SHA384_IV[7] | 0, this.Eh = H.SHA384_IV[8] | 0, this.El = H.SHA384_IV[9] | 0, this.Fh = H.SHA384_IV[10] | 0, this.Fl = H.SHA384_IV[11] | 0, this.Gh = H.SHA384_IV[12] | 0, this.Gl = H.SHA384_IV[13] | 0, this.Hh = H.SHA384_IV[14] | 0, this.Hl = H.SHA384_IV[15] | 0;
  }
};
Y.SHA384 = Da;
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
]), it = /* @__PURE__ */ Uint32Array.from([
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
let Na = class extends yn {
  constructor() {
    super(28), this.Ah = ot[0] | 0, this.Al = ot[1] | 0, this.Bh = ot[2] | 0, this.Bl = ot[3] | 0, this.Ch = ot[4] | 0, this.Cl = ot[5] | 0, this.Dh = ot[6] | 0, this.Dl = ot[7] | 0, this.Eh = ot[8] | 0, this.El = ot[9] | 0, this.Fh = ot[10] | 0, this.Fl = ot[11] | 0, this.Gh = ot[12] | 0, this.Gl = ot[13] | 0, this.Hh = ot[14] | 0, this.Hl = ot[15] | 0;
  }
};
Y.SHA512_224 = Na;
let Ba = class extends yn {
  constructor() {
    super(32), this.Ah = it[0] | 0, this.Al = it[1] | 0, this.Bh = it[2] | 0, this.Bl = it[3] | 0, this.Ch = it[4] | 0, this.Cl = it[5] | 0, this.Dh = it[6] | 0, this.Dl = it[7] | 0, this.Eh = it[8] | 0, this.El = it[9] | 0, this.Fh = it[10] | 0, this.Fl = it[11] | 0, this.Gh = it[12] | 0, this.Gl = it[13] | 0, this.Hh = it[14] | 0, this.Hl = it[15] | 0;
  }
};
Y.SHA512_256 = Ba;
Y.sha256 = (0, tt.createHasher)(() => new Ys());
Y.sha224 = (0, tt.createHasher)(() => new Ca());
Y.sha512 = (0, tt.createHasher)(() => new yn());
Y.sha384 = (0, tt.createHasher)(() => new Da());
Y.sha512_256 = (0, tt.createHasher)(() => new Ba());
Y.sha512_224 = (0, tt.createHasher)(() => new Na());
Object.defineProperty(gt, "__esModule", { value: !0 });
gt.sha224 = gt.SHA224 = gt.sha256 = gt.SHA256 = void 0;
const Er = Y;
gt.SHA256 = Er.SHA256;
gt.sha256 = Er.sha256;
gt.SHA224 = Er.SHA224;
gt.sha224 = Er.sha224;
const rh = /* @__PURE__ */ Vc(Cu);
var qe = {};
Object.defineProperty(qe, "__esModule", { value: !0 });
qe.joseToDer = qe.derToJose = void 0;
const Ua = xn, Ta = at;
function Xr(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const sh = {
  ES256: Xr(256),
  ES384: Xr(384),
  ES512: Xr(521)
};
function ja(t) {
  const e = sh[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const lr = 128, Oa = 0, oh = 32, ih = 16, ch = 2, ka = ih | oh | Oa << 6, fr = ch | Oa << 6;
function Pa(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, Ua.toByteArray)((0, Ta.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function ah(t, e) {
  const n = Pa(t), r = ja(e), s = r + 1, o = n.length;
  let i = 0;
  if (n[i++] !== ka)
    throw new Error('Could not find expected "seq"');
  let c = n[i++];
  if (c === (lr | 1) && (c = n[i++]), o - i < c)
    throw new Error(`"seq" specified length of "${c}", only "${o - i}" remaining`);
  if (n[i++] !== fr)
    throw new Error('Could not find expected "int" for "r"');
  const a = n[i++];
  if (o - i - 2 < a)
    throw new Error(`"r" specified length of "${a}", only "${o - i - 2}" available`);
  if (s < a)
    throw new Error(`"r" specified length of "${a}", max of "${s}" is acceptable`);
  const f = i;
  if (i += a, n[i++] !== fr)
    throw new Error('Could not find expected "int" for "s"');
  const d = n[i++];
  if (o - i !== d)
    throw new Error(`"s" specified length of "${d}", expected "${o - i}"`);
  if (s < d)
    throw new Error(`"s" specified length of "${d}", max of "${s}" is acceptable`);
  const l = i;
  if (i += d, i !== o)
    throw new Error(`Expected to consume entire array, but "${o - i}" bytes remain`);
  const g = r - a, h = r - d, b = new Uint8Array(g + a + h + d);
  for (i = 0; i < g; ++i)
    b[i] = 0;
  b.set(n.subarray(f + Math.max(-g, 0), f + a), i), i = r;
  for (const w = i; i < w + h; ++i)
    b[i] = 0;
  return b.set(n.subarray(l + Math.max(-h, 0), l + d), i), (0, Ta.escape)((0, Ua.fromByteArray)(b));
}
qe.derToJose = ah;
function ri(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= lr && --r, r;
}
function lh(t, e) {
  t = Pa(t);
  const n = ja(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = ri(t, 0, n), o = ri(t, n, t.length), i = n - s, c = n - o, a = 2 + i + 1 + 1 + c, f = a < lr, d = new Uint8Array((f ? 2 : 3) + a);
  let l = 0;
  return d[l++] = ka, f ? d[l++] = a : (d[l++] = lr | 1, d[l++] = a & 255), d[l++] = fr, d[l++] = i, s < 0 ? (d[l++] = 0, d.set(t.subarray(0, n), l), l += n) : (d.set(t.subarray(s, n), l), l += n - s), d[l++] = fr, d[l++] = c, o < 0 ? (d[l++] = 0, d.set(t.subarray(n), l)) : d.set(t.subarray(n + o), l), d;
}
qe.joseToDer = lh;
var Ot = {};
Object.defineProperty(Ot, "__esModule", { value: !0 });
Ot.InvalidTokenError = Ot.MissingParametersError = void 0;
class fh extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Ot.MissingParametersError = fh;
class uh extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Ot.InvalidTokenError = uh;
Object.defineProperty(Sr, "__esModule", { value: !0 });
Sr.SECP256K1Client = void 0;
const dh = ca, hh = gt, Jn = rh, si = qe, oi = Ot, ii = zt;
Jn.utils.hmacSha256Sync = (t, ...e) => {
  const n = dh.hmac.create(hh.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class Fa {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, ii.bytesToHex)(Jn.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new oi.MissingParametersError("a signing input hash and private key are all required");
    const s = Jn.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, ii.bytesToHex)(s);
    if (r === "jose")
      return (0, si.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, si.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new oi.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Jn.verify(n, e, r, { strict: !1 });
  }
}
Sr.SECP256K1Client = Fa;
Fa.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Sr;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(mr);
var Ee = {};
const gh = /* @__PURE__ */ Vc(Cc);
var ph = mt && mt.__awaiter || function(t, e, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
    function c(d) {
      try {
        f(r.next(d));
      } catch (l) {
        i(l);
      }
    }
    function a(d) {
      try {
        f(r.throw(d));
      } catch (l) {
        i(l);
      }
    }
    function f(d) {
      d.done ? o(d.value) : s(d.value).then(c, a);
    }
    f((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Ee, "__esModule", { value: !0 });
Ee.hashSha256Async = Ee.hashSha256 = void 0;
const bh = gt;
function za(t) {
  return (0, bh.sha256)(t);
}
Ee.hashSha256 = za;
function wh(t) {
  return ph(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = gh;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(za(t));
    }
  });
}
Ee.hashSha256Async = wh;
var xh = mt && mt.__awaiter || function(t, e, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
    function c(d) {
      try {
        f(r.next(d));
      } catch (l) {
        i(l);
      }
    }
    function a(d) {
      try {
        f(r.throw(d));
      } catch (l) {
        i(l);
      }
    }
    function f(d) {
      d.done ? o(d.value) : s(d.value).then(c, a);
    }
    f((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Qe, "__esModule", { value: !0 });
Qe.TokenSigner = Qe.createUnsecuredToken = void 0;
const hs = at, ci = mr, yh = Ot, ai = Ee;
function gs(t, e) {
  const n = [], r = hs.encode(JSON.stringify(e));
  n.push(r);
  const s = hs.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function mh(t) {
  return gs(t, { typ: "JWT", alg: "none" }) + ".";
}
Qe.createUnsecuredToken = mh;
class Sh {
  constructor(e, n) {
    if (!(e && n))
      throw new yh.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !ci.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = ci.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), o = gs(e, s), i = (0, ai.hashSha256)(o);
    return this.createWithSignedHash(e, n, s, o, i);
  }
  signAsync(e, n = !1, r = {}) {
    return xh(this, void 0, void 0, function* () {
      const s = this.header(r), o = gs(e, s), i = yield (0, ai.hashSha256Async)(o);
      return this.createWithSignedHash(e, n, s, o, i);
    });
  }
  createWithSignedHash(e, n, r, s, o) {
    const i = this.cryptoClient.signHash(o, this.rawPrivateKey);
    return n ? {
      header: [hs.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [i]
    } : [s, i].join(".");
  }
}
Qe.TokenSigner = Sh;
var Ir = {};
Object.defineProperty(Ir, "__esModule", { value: !0 });
Ir.TokenVerifier = void 0;
const Ah = at, li = mr, Eh = Ot, zn = Ee;
class Ih {
  constructor(e, n) {
    if (!(e && n))
      throw new Eh.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !li.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = li.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, zn.hashSha256Async)(s).then((i) => o(i));
    {
      const i = (0, zn.hashSha256)(s);
      return o(i);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), Ah.encode(e.payload)].join(".");
    let s = !0;
    const o = (i) => (e.signature.map((c) => {
      const a = this.cryptoClient.loadSignature(c);
      this.cryptoClient.verifyHash(i, a, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, zn.hashSha256Async)(r).then((i) => o(i));
    {
      const i = (0, zn.hashSha256)(r);
      return o(i);
    }
  }
}
Ir.TokenVerifier = Ih;
var vr = {};
Object.defineProperty(vr, "__esModule", { value: !0 });
vr.decodeToken = void 0;
const Rn = at;
function vh(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Rn.decode(e[0])), r = JSON.parse(Rn.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Rn.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Rn.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
vr.decodeToken = vh;
(function(t) {
  var e = mt && mt.__createBinding || (Object.create ? function(r, s, o, i) {
    i === void 0 && (i = o);
    var c = Object.getOwnPropertyDescriptor(s, o);
    (!c || ("get" in c ? !s.__esModule : c.writable || c.configurable)) && (c = { enumerable: !0, get: function() {
      return s[o];
    } }), Object.defineProperty(r, i, c);
  } : function(r, s, o, i) {
    i === void 0 && (i = o), r[i] = s[o];
  }), n = mt && mt.__exportStar || function(r, s) {
    for (var o in r) o !== "default" && !Object.prototype.hasOwnProperty.call(s, o) && e(s, r, o);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Qe, t), n(Ir, t), n(vr, t), n(Ot, t), n(mr, t);
})(bt);
function Lh(t) {
  return `did:btc-addr:${t}`;
}
function _h(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Vo("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Vo('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function Ra(t) {
  if (t)
    return _h(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const Mh = "1.4.0";
function $h() {
  return Td();
}
function Ch(t, e, n, r = Ac.slice(), s, o = Ff().getTime(), i = {}) {
  const c = (h) => {
    const b = Us("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${h}=undefined])`
    });
    return b == null ? void 0 : b.origin;
  };
  e || (e = `${c("redirectURI")}/`), n || (n = `${c("manifestURI")}/manifest.json`), s || (s = c("appDomain"));
  const a = Object.assign({}, i, {
    jti: Rf(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(o / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: Mh,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), f = bt.SECP256K1Client.derivePublicKey(t);
  a.public_keys = [f];
  const d = Jc(f);
  return a.iss = Lh(d), new bt.TokenSigner("ES256k", t).sign(a);
}
async function fi(t, e) {
  const n = vc(fe(e)), r = JSON.parse(n), s = await ra(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function Hh(t) {
  const e = bt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new bt.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function Dh(t) {
  const e = bt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = Ra(e.iss);
  if (n.length === 1) {
    if (Jc(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function Nh(t) {
  const e = bt.decodeToken(t).payload;
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
function Bh(t) {
  const e = bt.decodeToken(t).payload;
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
function Uh(t) {
  const e = [
    Bh(t),
    Nh(t),
    Hh(t),
    Dh(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const ui = "1.0.0";
class ge {
  constructor(e) {
    this.version = ui, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== ui)
      throw new cs(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new ge(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Ga {
  constructor(e) {
    if (e) {
      const n = new ge(e);
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
class di extends Ga {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new ge({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new Ec("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new ge({})), !0;
  }
}
class hi extends Ga {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Of, !localStorage.getItem(this.key)) {
      const r = new ge({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new Ec("No session data was found in localStorage");
    const n = JSON.parse(e);
    return ge.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new ge({})), !0;
  }
}
var pn;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(pn || (pn = {}));
var ur;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ur || (ur = {}));
pn.Mainnet;
var Tt;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Tt || (Tt = {}));
var $t;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})($t || ($t = {}));
Tt.Mainnet;
const Va = {
  chainId: pn.Mainnet,
  transactionVersion: Tt.Mainnet,
  peerNetworkId: ur.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: $t.MainnetSingleSig,
    multiSig: $t.MainnetMultiSig
  },
  client: { baseUrl: Yf }
}, ps = {
  chainId: pn.Testnet,
  transactionVersion: Tt.Testnet,
  peerNetworkId: ur.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: $t.TestnetSingleSig,
    multiSig: $t.TestnetMultiSig
  },
  client: { baseUrl: Zf }
}, tr = {
  ...ps,
  addressVersion: { ...ps.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Qf }
}, Th = {
  ...tr,
  addressVersion: { ...tr.addressVersion },
  client: { ...tr.client }
};
function jh(t) {
  switch (t) {
    case "mainnet":
      return Va;
    case "testnet":
      return ps;
    case "devnet":
      return tr;
    case "mocknet":
      return Th;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Ka(t) {
  return typeof t == "string" ? jh(t) : t;
}
var gi;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(gi || (gi = {}));
var pi;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(pi || (pi = {}));
var St;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(St || (St = {}));
const Jr = ["onChainOnly", "offChainOnly", "any"];
Jr[0] + "", St.OnChainOnly, Jr[1] + "", St.OffChainOnly, Jr[2] + "", St.Any, St.OnChainOnly + "", St.OnChainOnly, St.OffChainOnly + "", St.OffChainOnly, St.Any + "", St.Any;
var bi;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(bi || (bi = {}));
var wi;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(wi || (wi = {}));
var xi;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(xi || (xi = {}));
var Ut;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Ut || (Ut = {}));
var yi;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(yi || (yi = {}));
var mi;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(mi || (mi = {}));
var Si;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Si || (Si = {}));
var Ai;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Ai || (Ai = {}));
var Ei;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ei || (Ei = {}));
var Ii;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ii || (Ii = {}));
var vi;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(vi || (vi = {}));
var Li;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Li || (Li = {}));
var _i;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(_i || (_i = {}));
function bs(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Oh(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Wa(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function kh(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  bs(t.outputLen), bs(t.blockLen);
}
function Ph(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Fh(t, e) {
  Wa(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ye = {
  number: bs,
  bool: Oh,
  bytes: Wa,
  hash: kh,
  exists: Ph,
  output: Fh
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ts = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Lt = (t, e) => t << 32 - e | t >>> e, zh = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!zh)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Rh(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Zs(t) {
  if (typeof t == "string" && (t = Rh(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Ya = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Me(t) {
  const e = (r) => t().update(Zs(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
class Za extends Ya {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ye.hash(e);
    const r = Zs(n);
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
    return ye.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    ye.exists(this), ye.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Qa = (t, e, n) => new Za(t, e).update(n).digest();
Qa.create = (t, e) => new Za(t, e);
function Gh(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), a = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + a, i, r), t.setUint32(e + f, c, r);
}
let Qs = class extends Ya {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ts(this.buffer);
  }
  update(e) {
    ye.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Zs(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const a = ts(e);
        for (; s <= o - i; i += s)
          this.process(a, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ye.exists(this), ye.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let l = i; l < s; l++)
      n[l] = 0;
    Gh(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = ts(e), a = this.outputLen;
    if (a % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = a / 4, d = this.get();
    if (f > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      c.setUint32(4 * l, d[l], o);
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
const Vh = (t, e, n) => t & e ^ ~t & n, Kh = (t, e, n) => t & e ^ t & n ^ e & n, Wh = new Uint32Array([
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
let qa = class extends Qs {
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
      const g = Jt[l - 15], h = Jt[l - 2], b = Lt(g, 7) ^ Lt(g, 18) ^ g >>> 3, w = Lt(h, 17) ^ Lt(h, 19) ^ h >>> 10;
      Jt[l] = w + Jt[l - 7] + b + Jt[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: a, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Lt(c, 6) ^ Lt(c, 11) ^ Lt(c, 25), h = d + g + Vh(c, a, f) + Wh[l] + Jt[l] | 0, w = (Lt(r, 2) ^ Lt(r, 13) ^ Lt(r, 22)) + Kh(r, s, o) | 0;
      d = f, f = a, a = c, c = i + h | 0, i = o, o = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, o, i, c, a, f, d);
  }
  roundClean() {
    Jt.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Yh = class extends qa {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Xa = Me(() => new qa());
Me(() => new Yh());
var mn = {}, qs = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = zt;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(i, c) {
    if (!i.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    i.length % 2 !== 0 && (i = `0${i}`), i = i.toLowerCase();
    let a = [], f = 0;
    for (let h = i.length - 1; h >= 0; h--)
      if (f < 4) {
        const b = n.indexOf(i[h]) >> f;
        let w = 0;
        h !== 0 && (w = n.indexOf(i[h - 1]));
        const S = 1 + f, _ = w % (1 << S) << 5 - S, M = t.c32[b + _];
        f = S, a.unshift(M);
      } else
        f = 0;
    let d = 0;
    for (let h = 0; h < a.length && a[h] === "0"; h++)
      d++;
    a = a.slice(d);
    const l = new TextDecoder().decode((0, e.hexToBytes)(i)).match(/^\u0000*/), g = l ? l[0].length : 0;
    for (let h = 0; h < g; h++)
      a.unshift(t.c32[0]);
    if (c) {
      const h = c - a.length;
      for (let b = 0; b < h; b++)
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
    let d = [], l = 0, g = 0;
    for (let w = i.length - 1; w >= 0; w--) {
      g === 4 && (d.unshift(n[l]), g = 0, l = 0);
      const _ = (t.c32.indexOf(i[w]) << g) + l, M = n[_ % 16];
      if (g += 1, l = _ >> 4, l > 1 << g)
        throw new Error("Panic error in decoding.");
      d.unshift(M);
    }
    d.unshift(n[l]), d.length % 2 === 1 && d.unshift("0");
    let h = 0;
    for (let w = 0; w < d.length && d[w] === "0"; w++)
      h++;
    d = d.slice(h - h % 2);
    let b = d.join("");
    for (let w = 0; w < f; w++)
      b = `00${b}`;
    if (c) {
      const w = c * 2 - b.length;
      for (let S = 0; S < w; S += 2)
        b = `00${b}`;
    }
    return b;
  }
  t.c32decode = o;
})(qs);
var Ie = {};
Object.defineProperty(Ie, "__esModule", { value: !0 });
Ie.c32checkDecode = Ie.c32checkEncode = void 0;
const Mi = gt, $i = zt, gn = qs;
function Ja(t) {
  const e = (0, Mi.sha256)((0, Mi.sha256)((0, $i.hexToBytes)(t)));
  return (0, $i.bytesToHex)(e.slice(0, 4));
}
function Zh(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Ja(`${n}${e}`), s = (0, gn.c32encode)(`${e}${r}`);
  return `${gn.c32[t]}${s}`;
}
Ie.c32checkEncode = Zh;
function Qh(t) {
  t = (0, gn.c32normalize)(t);
  const e = (0, gn.c32decode)(t.slice(1)), n = t[0], r = gn.c32.indexOf(n), s = e.slice(-8);
  let o = r.toString(16);
  if (o.length === 1 && (o = `0${o}`), Ja(`${o}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Ie.c32checkDecode = Qh;
var tl = {}, Xe = {};
Object.defineProperty(Xe, "__esModule", { value: !0 });
Xe.decode = Xe.encode = void 0;
const dr = gt, Ci = zt, el = Yc, nl = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function qh(t, e = "00") {
  const n = typeof t == "string" ? (0, Ci.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Ci.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, dr.sha256)((0, dr.sha256)(new Uint8Array([...r, ...n])));
  return el(nl).encode([...r, ...n, ...s.slice(0, 4)]);
}
Xe.encode = qh;
function Xh(t) {
  const e = el(nl).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, dr.sha256)((0, dr.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((o, i) => {
    if (o !== s[i])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Xe.decode = Xh;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Ie, n = Xe, r = zt;
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
  function i(d, l) {
    if (!l.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, e.c32checkEncode)(d, l)}`;
  }
  t.c32address = i;
  function c(d) {
    if (d.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (d[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, e.c32checkDecode)(d.slice(1));
  }
  t.c32addressDecode = c;
  function a(d, l = -1) {
    const g = n.decode(d), h = (0, r.bytesToHex)(g.data), b = parseInt((0, r.bytesToHex)(g.prefix), 16);
    let w;
    return l < 0 ? (w = b, s[b] !== void 0 && (w = s[b])) : w = l, i(w, h);
  }
  t.b58ToC32 = a;
  function f(d, l = -1) {
    const g = c(d), h = g[0], b = g[1];
    let w;
    l < 0 ? (w = h, o[h] !== void 0 && (w = o[h])) : w = l;
    let S = w.toString(16);
    return S.length === 1 && (S = `0${S}`), n.encode(b, S);
  }
  t.c32ToB58 = f;
})(tl);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = qs;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Ie;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = tl;
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
})(mn);
function Jh(t, e) {
  switch (e = Ka(e ?? Va), t) {
    case Ut.P2PKH:
      switch (e.transactionVersion) {
        case Tt.Mainnet:
          return $t.MainnetSingleSig;
        case Tt.Testnet:
          return $t.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case Ut.P2SH:
    case Ut.P2SHNonSequential:
    case Ut.P2WPKH:
    case Ut.P2WSH:
    case Ut.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Tt.Mainnet:
          return $t.MainnetMultiSig;
        case Tt.Testnet:
          return $t.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const tg = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), rl = Uint8Array.from({ length: 16 }, (t, e) => e), eg = rl.map((t) => (9 * t + 5) % 16);
let Xs = [rl], Js = [eg];
for (let t = 0; t < 4; t++)
  for (let e of [Xs, Js])
    e.push(e[t].map((n) => tg[n]));
const sl = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), ng = Xs.map((t, e) => t.map((n) => sl[e][n])), rg = Js.map((t, e) => t.map((n) => sl[e][n])), sg = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), og = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Gn = (t, e) => t << e | t >>> 32 - e;
function Hi(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Vn = new Uint32Array(16);
let ig = class extends Qs {
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
    for (let h = 0; h < 16; h++, n += 4)
      Vn[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, c = this.h2 | 0, a = c, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, w = sg[h], S = og[h], _ = Xs[h], M = Js[h], x = ng[h], L = rg[h];
      for (let A = 0; A < 16; A++) {
        const N = Gn(r + Hi(h, o, c, f) + Vn[_[A]] + w, x[A]) + l | 0;
        r = l, l = f, f = Gn(c, 10) | 0, c = o, o = N;
      }
      for (let A = 0; A < 16; A++) {
        const N = Gn(s + Hi(b, i, a, d) + Vn[M[A]] + S, L[A]) + g | 0;
        s = g, g = d, d = Gn(a, 10) | 0, a = i, i = N;
      }
    }
    this.set(this.h1 + c + d | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + i | 0, this.h0 + o + a | 0);
  }
  roundClean() {
    Vn.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const cg = Me(() => new ig()), Kn = BigInt(2 ** 32 - 1), ws = BigInt(32);
function ol(t, e = !1) {
  return e ? { h: Number(t & Kn), l: Number(t >> ws & Kn) } : { h: Number(t >> ws & Kn) | 0, l: Number(t & Kn) | 0 };
}
function ag(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = ol(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const lg = (t, e) => BigInt(t >>> 0) << ws | BigInt(e >>> 0), fg = (t, e, n) => t >>> n, ug = (t, e, n) => t << 32 - n | e >>> n, dg = (t, e, n) => t >>> n | e << 32 - n, hg = (t, e, n) => t << 32 - n | e >>> n, gg = (t, e, n) => t << 64 - n | e >>> n - 32, pg = (t, e, n) => t >>> n - 32 | e << 64 - n, bg = (t, e) => e, wg = (t, e) => t, xg = (t, e, n) => t << n | e >>> 32 - n, yg = (t, e, n) => e << n | t >>> 32 - n, mg = (t, e, n) => e << n - 32 | t >>> 64 - n, Sg = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Ag(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Eg = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Ig = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, vg = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Lg = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, _g = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Mg = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, O = {
  fromBig: ol,
  split: ag,
  toBig: lg,
  shrSH: fg,
  shrSL: ug,
  rotrSH: dg,
  rotrSL: hg,
  rotrBH: gg,
  rotrBL: pg,
  rotr32H: bg,
  rotr32L: wg,
  rotlSH: xg,
  rotlSL: yg,
  rotlBH: mg,
  rotlBL: Sg,
  add: Ag,
  add3L: Eg,
  add3H: Ig,
  add4L: vg,
  add4H: Lg,
  add5H: Mg,
  add5L: _g
}, [$g, Cg] = O.split([
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
let Lr = class extends Qs {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: c, Dl: a, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: b, Hh: w, Hl: S } = this;
    return [e, n, r, s, o, i, c, a, f, d, l, g, h, b, w, S];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, a, f, d, l, g, h, b, w, S) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = a | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = b | 0, this.Hh = w | 0, this.Hl = S | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      te[x] = e.getUint32(n), ee[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const L = te[x - 15] | 0, A = ee[x - 15] | 0, N = O.rotrSH(L, A, 1) ^ O.rotrSH(L, A, 8) ^ O.shrSH(L, A, 7), P = O.rotrSL(L, A, 1) ^ O.rotrSL(L, A, 8) ^ O.shrSL(L, A, 7), C = te[x - 2] | 0, D = ee[x - 2] | 0, V = O.rotrSH(C, D, 19) ^ O.rotrBH(C, D, 61) ^ O.shrSH(C, D, 6), X = O.rotrSL(C, D, 19) ^ O.rotrBL(C, D, 61) ^ O.shrSL(C, D, 6), Q = O.add4L(P, X, ee[x - 7], ee[x - 16]), J = O.add4H(Q, N, V, te[x - 7], te[x - 16]);
      te[x] = J | 0, ee[x] = Q | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: c, Cl: a, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: b, Gh: w, Gl: S, Hh: _, Hl: M } = this;
    for (let x = 0; x < 80; x++) {
      const L = O.rotrSH(l, g, 14) ^ O.rotrSH(l, g, 18) ^ O.rotrBH(l, g, 41), A = O.rotrSL(l, g, 14) ^ O.rotrSL(l, g, 18) ^ O.rotrBL(l, g, 41), N = l & h ^ ~l & w, P = g & b ^ ~g & S, C = O.add5L(M, A, P, Cg[x], ee[x]), D = O.add5H(C, _, L, N, $g[x], te[x]), V = C | 0, X = O.rotrSH(r, s, 28) ^ O.rotrBH(r, s, 34) ^ O.rotrBH(r, s, 39), Q = O.rotrSL(r, s, 28) ^ O.rotrBL(r, s, 34) ^ O.rotrBL(r, s, 39), J = r & o ^ r & c ^ o & c, wt = s & i ^ s & a ^ i & a;
      _ = w | 0, M = S | 0, w = h | 0, S = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = O.add(f | 0, d | 0, D | 0, V | 0), f = c | 0, d = a | 0, c = o | 0, a = i | 0, o = r | 0, i = s | 0;
      const nt = O.add3L(V, Q, wt);
      r = O.add3H(nt, D, X, J), s = nt | 0;
    }
    ({ h: r, l: s } = O.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = O.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: c, l: a } = O.add(this.Ch | 0, this.Cl | 0, c | 0, a | 0), { h: f, l: d } = O.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = O.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = O.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: w, l: S } = O.add(this.Gh | 0, this.Gl | 0, w | 0, S | 0), { h: _, l: M } = O.add(this.Hh | 0, this.Hl | 0, _ | 0, M | 0), this.set(r, s, o, i, c, a, f, d, l, g, h, b, w, S, _, M);
  }
  roundClean() {
    te.fill(0), ee.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Hg = class extends Lr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Dg = class extends Lr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Ng = class extends Lr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Me(() => new Lr());
Me(() => new Hg());
Me(() => new Dg());
Me(() => new Ng());
var hr = { exports: {} };
hr.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, o = "[object Arguments]", i = "[object Array]", c = "[object Boolean]", a = "[object Date]", f = "[object Error]", d = "[object Function]", l = "[object GeneratorFunction]", g = "[object Map]", h = "[object Number]", b = "[object Object]", w = "[object Promise]", S = "[object RegExp]", _ = "[object Set]", M = "[object String]", x = "[object Symbol]", L = "[object WeakMap]", A = "[object ArrayBuffer]", N = "[object DataView]", P = "[object Float32Array]", C = "[object Float64Array]", D = "[object Int8Array]", V = "[object Int16Array]", X = "[object Int32Array]", Q = "[object Uint8Array]", J = "[object Uint8ClampedArray]", wt = "[object Uint16Array]", nt = "[object Uint32Array]", In = /[\\^$.*+?()[\]{}|]/g, vn = /\w*$/, Dr = /^\[object .+?Constructor\]$/, y = /^(?:0|[1-9]\d*)$/, I = {};
  I[o] = I[i] = I[A] = I[N] = I[c] = I[a] = I[P] = I[C] = I[D] = I[V] = I[X] = I[g] = I[h] = I[b] = I[S] = I[_] = I[M] = I[x] = I[Q] = I[J] = I[wt] = I[nt] = !0, I[f] = I[d] = I[L] = !1;
  var W = typeof mt == "object" && mt && mt.Object === Object && mt, Z = typeof self == "object" && self && self.Object === Object && self, K = W || Z || Function("return this")(), st = e && !e.nodeType && e, on = st && !0 && t && !t.nodeType && t, Ln = on && on.exports === st;
  function Nr(u, p) {
    return u.set(p[0], p[1]), u;
  }
  function Jl(u, p) {
    return u.add(p), u;
  }
  function t0(u, p) {
    for (var m = -1, $ = u ? u.length : 0; ++m < $ && p(u[m], m, u) !== !1; )
      ;
    return u;
  }
  function e0(u, p) {
    for (var m = -1, $ = p.length, rt = u.length; ++m < $; )
      u[rt + m] = p[m];
    return u;
  }
  function yo(u, p, m, $) {
    for (var rt = -1, ft = u ? u.length : 0; ++rt < ft; )
      m = p(m, u[rt], rt, u);
    return m;
  }
  function n0(u, p) {
    for (var m = -1, $ = Array(u); ++m < u; )
      $[m] = p(m);
    return $;
  }
  function r0(u, p) {
    return u == null ? void 0 : u[p];
  }
  function mo(u) {
    var p = !1;
    if (u != null && typeof u.toString != "function")
      try {
        p = !!(u + "");
      } catch {
      }
    return p;
  }
  function So(u) {
    var p = -1, m = Array(u.size);
    return u.forEach(function($, rt) {
      m[++p] = [rt, $];
    }), m;
  }
  function Br(u, p) {
    return function(m) {
      return u(p(m));
    };
  }
  function Ao(u) {
    var p = -1, m = Array(u.size);
    return u.forEach(function($) {
      m[++p] = $;
    }), m;
  }
  var s0 = Array.prototype, o0 = Function.prototype, _n = Object.prototype, Ur = K["__core-js_shared__"], Eo = function() {
    var u = /[^.]+$/.exec(Ur && Ur.keys && Ur.keys.IE_PROTO || "");
    return u ? "Symbol(src)_1." + u : "";
  }(), Io = o0.toString, Gt = _n.hasOwnProperty, Mn = _n.toString, i0 = RegExp(
    "^" + Io.call(Gt).replace(In, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), vo = Ln ? K.Buffer : void 0, Lo = K.Symbol, _o = K.Uint8Array, c0 = Br(Object.getPrototypeOf, Object), a0 = Object.create, l0 = _n.propertyIsEnumerable, f0 = s0.splice, Mo = Object.getOwnPropertySymbols, u0 = vo ? vo.isBuffer : void 0, d0 = Br(Object.keys, Object), Tr = De(K, "DataView"), cn = De(K, "Map"), jr = De(K, "Promise"), Or = De(K, "Set"), kr = De(K, "WeakMap"), an = De(Object, "create"), h0 = we(Tr), g0 = we(cn), p0 = we(jr), b0 = we(Or), w0 = we(kr), $o = Lo ? Lo.prototype : void 0, Co = $o ? $o.valueOf : void 0;
  function pe(u) {
    var p = -1, m = u ? u.length : 0;
    for (this.clear(); ++p < m; ) {
      var $ = u[p];
      this.set($[0], $[1]);
    }
  }
  function x0() {
    this.__data__ = an ? an(null) : {};
  }
  function y0(u) {
    return this.has(u) && delete this.__data__[u];
  }
  function m0(u) {
    var p = this.__data__;
    if (an) {
      var m = p[u];
      return m === r ? void 0 : m;
    }
    return Gt.call(p, u) ? p[u] : void 0;
  }
  function S0(u) {
    var p = this.__data__;
    return an ? p[u] !== void 0 : Gt.call(p, u);
  }
  function A0(u, p) {
    var m = this.__data__;
    return m[u] = an && p === void 0 ? r : p, this;
  }
  pe.prototype.clear = x0, pe.prototype.delete = y0, pe.prototype.get = m0, pe.prototype.has = S0, pe.prototype.set = A0;
  function Nt(u) {
    var p = -1, m = u ? u.length : 0;
    for (this.clear(); ++p < m; ) {
      var $ = u[p];
      this.set($[0], $[1]);
    }
  }
  function E0() {
    this.__data__ = [];
  }
  function I0(u) {
    var p = this.__data__, m = $n(p, u);
    if (m < 0)
      return !1;
    var $ = p.length - 1;
    return m == $ ? p.pop() : f0.call(p, m, 1), !0;
  }
  function v0(u) {
    var p = this.__data__, m = $n(p, u);
    return m < 0 ? void 0 : p[m][1];
  }
  function L0(u) {
    return $n(this.__data__, u) > -1;
  }
  function _0(u, p) {
    var m = this.__data__, $ = $n(m, u);
    return $ < 0 ? m.push([u, p]) : m[$][1] = p, this;
  }
  Nt.prototype.clear = E0, Nt.prototype.delete = I0, Nt.prototype.get = v0, Nt.prototype.has = L0, Nt.prototype.set = _0;
  function Ce(u) {
    var p = -1, m = u ? u.length : 0;
    for (this.clear(); ++p < m; ) {
      var $ = u[p];
      this.set($[0], $[1]);
    }
  }
  function M0() {
    this.__data__ = {
      hash: new pe(),
      map: new (cn || Nt)(),
      string: new pe()
    };
  }
  function $0(u) {
    return Cn(this, u).delete(u);
  }
  function C0(u) {
    return Cn(this, u).get(u);
  }
  function H0(u) {
    return Cn(this, u).has(u);
  }
  function D0(u, p) {
    return Cn(this, u).set(u, p), this;
  }
  Ce.prototype.clear = M0, Ce.prototype.delete = $0, Ce.prototype.get = C0, Ce.prototype.has = H0, Ce.prototype.set = D0;
  function He(u) {
    this.__data__ = new Nt(u);
  }
  function N0() {
    this.__data__ = new Nt();
  }
  function B0(u) {
    return this.__data__.delete(u);
  }
  function U0(u) {
    return this.__data__.get(u);
  }
  function T0(u) {
    return this.__data__.has(u);
  }
  function j0(u, p) {
    var m = this.__data__;
    if (m instanceof Nt) {
      var $ = m.__data__;
      if (!cn || $.length < n - 1)
        return $.push([u, p]), this;
      m = this.__data__ = new Ce($);
    }
    return m.set(u, p), this;
  }
  He.prototype.clear = N0, He.prototype.delete = B0, He.prototype.get = U0, He.prototype.has = T0, He.prototype.set = j0;
  function O0(u, p) {
    var m = zr(u) || lf(u) ? n0(u.length, String) : [], $ = m.length, rt = !!$;
    for (var ft in u)
      Gt.call(u, ft) && !(rt && (ft == "length" || sf(ft, $))) && m.push(ft);
    return m;
  }
  function Ho(u, p, m) {
    var $ = u[p];
    (!(Gt.call(u, p) && Uo($, m)) || m === void 0 && !(p in u)) && (u[p] = m);
  }
  function $n(u, p) {
    for (var m = u.length; m--; )
      if (Uo(u[m][0], p))
        return m;
    return -1;
  }
  function k0(u, p) {
    return u && Do(p, Rr(p), u);
  }
  function Pr(u, p, m, $, rt, ft, Bt) {
    var ut;
    if ($ && (ut = ft ? $(u, rt, ft, Bt) : $(u)), ut !== void 0)
      return ut;
    if (!Hn(u))
      return u;
    var Oo = zr(u);
    if (Oo) {
      if (ut = ef(u), !p)
        return X0(u, ut);
    } else {
      var Ne = be(u), ko = Ne == d || Ne == l;
      if (uf(u))
        return V0(u, p);
      if (Ne == b || Ne == o || ko && !ft) {
        if (mo(u))
          return ft ? u : {};
        if (ut = nf(ko ? {} : u), !p)
          return J0(u, k0(ut, u));
      } else {
        if (!I[Ne])
          return ft ? u : {};
        ut = rf(u, Ne, Pr, p);
      }
    }
    Bt || (Bt = new He());
    var Po = Bt.get(u);
    if (Po)
      return Po;
    if (Bt.set(u, ut), !Oo)
      var Fo = m ? tf(u) : Rr(u);
    return t0(Fo || u, function(Gr, Dn) {
      Fo && (Dn = Gr, Gr = u[Dn]), Ho(ut, Dn, Pr(Gr, p, m, $, Dn, u, Bt));
    }), ut;
  }
  function P0(u) {
    return Hn(u) ? a0(u) : {};
  }
  function F0(u, p, m) {
    var $ = p(u);
    return zr(u) ? $ : e0($, m(u));
  }
  function z0(u) {
    return Mn.call(u);
  }
  function R0(u) {
    if (!Hn(u) || cf(u))
      return !1;
    var p = jo(u) || mo(u) ? i0 : Dr;
    return p.test(we(u));
  }
  function G0(u) {
    if (!Bo(u))
      return d0(u);
    var p = [];
    for (var m in Object(u))
      Gt.call(u, m) && m != "constructor" && p.push(m);
    return p;
  }
  function V0(u, p) {
    if (p)
      return u.slice();
    var m = new u.constructor(u.length);
    return u.copy(m), m;
  }
  function Fr(u) {
    var p = new u.constructor(u.byteLength);
    return new _o(p).set(new _o(u)), p;
  }
  function K0(u, p) {
    var m = p ? Fr(u.buffer) : u.buffer;
    return new u.constructor(m, u.byteOffset, u.byteLength);
  }
  function W0(u, p, m) {
    var $ = p ? m(So(u), !0) : So(u);
    return yo($, Nr, new u.constructor());
  }
  function Y0(u) {
    var p = new u.constructor(u.source, vn.exec(u));
    return p.lastIndex = u.lastIndex, p;
  }
  function Z0(u, p, m) {
    var $ = p ? m(Ao(u), !0) : Ao(u);
    return yo($, Jl, new u.constructor());
  }
  function Q0(u) {
    return Co ? Object(Co.call(u)) : {};
  }
  function q0(u, p) {
    var m = p ? Fr(u.buffer) : u.buffer;
    return new u.constructor(m, u.byteOffset, u.length);
  }
  function X0(u, p) {
    var m = -1, $ = u.length;
    for (p || (p = Array($)); ++m < $; )
      p[m] = u[m];
    return p;
  }
  function Do(u, p, m, $) {
    m || (m = {});
    for (var rt = -1, ft = p.length; ++rt < ft; ) {
      var Bt = p[rt], ut = void 0;
      Ho(m, Bt, ut === void 0 ? u[Bt] : ut);
    }
    return m;
  }
  function J0(u, p) {
    return Do(u, No(u), p);
  }
  function tf(u) {
    return F0(u, Rr, No);
  }
  function Cn(u, p) {
    var m = u.__data__;
    return of(p) ? m[typeof p == "string" ? "string" : "hash"] : m.map;
  }
  function De(u, p) {
    var m = r0(u, p);
    return R0(m) ? m : void 0;
  }
  var No = Mo ? Br(Mo, Object) : gf, be = z0;
  (Tr && be(new Tr(new ArrayBuffer(1))) != N || cn && be(new cn()) != g || jr && be(jr.resolve()) != w || Or && be(new Or()) != _ || kr && be(new kr()) != L) && (be = function(u) {
    var p = Mn.call(u), m = p == b ? u.constructor : void 0, $ = m ? we(m) : void 0;
    if ($)
      switch ($) {
        case h0:
          return N;
        case g0:
          return g;
        case p0:
          return w;
        case b0:
          return _;
        case w0:
          return L;
      }
    return p;
  });
  function ef(u) {
    var p = u.length, m = u.constructor(p);
    return p && typeof u[0] == "string" && Gt.call(u, "index") && (m.index = u.index, m.input = u.input), m;
  }
  function nf(u) {
    return typeof u.constructor == "function" && !Bo(u) ? P0(c0(u)) : {};
  }
  function rf(u, p, m, $) {
    var rt = u.constructor;
    switch (p) {
      case A:
        return Fr(u);
      case c:
      case a:
        return new rt(+u);
      case N:
        return K0(u, $);
      case P:
      case C:
      case D:
      case V:
      case X:
      case Q:
      case J:
      case wt:
      case nt:
        return q0(u, $);
      case g:
        return W0(u, $, m);
      case h:
      case M:
        return new rt(u);
      case S:
        return Y0(u);
      case _:
        return Z0(u, $, m);
      case x:
        return Q0(u);
    }
  }
  function sf(u, p) {
    return p = p ?? s, !!p && (typeof u == "number" || y.test(u)) && u > -1 && u % 1 == 0 && u < p;
  }
  function of(u) {
    var p = typeof u;
    return p == "string" || p == "number" || p == "symbol" || p == "boolean" ? u !== "__proto__" : u === null;
  }
  function cf(u) {
    return !!Eo && Eo in u;
  }
  function Bo(u) {
    var p = u && u.constructor, m = typeof p == "function" && p.prototype || _n;
    return u === m;
  }
  function we(u) {
    if (u != null) {
      try {
        return Io.call(u);
      } catch {
      }
      try {
        return u + "";
      } catch {
      }
    }
    return "";
  }
  function af(u) {
    return Pr(u, !0, !0);
  }
  function Uo(u, p) {
    return u === p || u !== u && p !== p;
  }
  function lf(u) {
    return ff(u) && Gt.call(u, "callee") && (!l0.call(u, "callee") || Mn.call(u) == o);
  }
  var zr = Array.isArray;
  function To(u) {
    return u != null && df(u.length) && !jo(u);
  }
  function ff(u) {
    return hf(u) && To(u);
  }
  var uf = u0 || pf;
  function jo(u) {
    var p = Hn(u) ? Mn.call(u) : "";
    return p == d || p == l;
  }
  function df(u) {
    return typeof u == "number" && u > -1 && u % 1 == 0 && u <= s;
  }
  function Hn(u) {
    var p = typeof u;
    return !!u && (p == "object" || p == "function");
  }
  function hf(u) {
    return !!u && typeof u == "object";
  }
  function Rr(u) {
    return To(u) ? O0(u) : G0(u);
  }
  function gf() {
    return [];
  }
  function pf() {
    return !1;
  }
  t.exports = af;
})(hr, hr.exports);
hr.exports;
var xs;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(xs || (xs = {}));
function Bg(t, e) {
  return { type: xs.Address, version: t, hash160: e };
}
function Ug(t) {
  return mn.c32address(t.version, t.hash160);
}
const Tg = (t) => cg(Xa(t)), jg = (t) => le(Tg(t));
et.hmacSha256Sync = (t, ...e) => {
  const n = Qa.create(Xa, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Og(t, e = "mainnet") {
  e = Ka(e), t = typeof t == "string" ? fe(t) : t;
  const n = Jh(Ut.P2PKH, e), r = Bg(n, jg(t));
  return Ug(r);
}
function kg(t, e) {
  const n = bt.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, o = Og(s);
  if (e !== s) {
    if (e !== o) throw new Error("Token issuer public key does not match the verifying value");
  }
  const i = new bt.TokenVerifier(n.header.alg, s);
  if (!i)
    throw new Error("Invalid token verifier");
  if (!i.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function Pg(t, e = null) {
  let n;
  e ? n = kg(t, e) : n = bt.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const Di = "_blockstackDidCheckEchoReply", Fg = "echoReply", zg = "authContinuation";
function Rg(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, o] = r.split("=");
    return n[s] = o ? decodeURIComponent(o.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function Gg() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[Di];
  if (typeof e == "boolean")
    return e;
  const n = Rg(t.location.search), r = n[Fg];
  if (r) {
    t[Di] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const o = n[zg];
      t.location.href = o;
    }, 10), !0;
  }
  return !1;
}
class gr {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new Ts();
    else
      throw new Pf("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new hi(e.sessionOptions) : this.store = new hi() : e ? this.store = new di(e.sessionOptions) : this.store = new di();
  }
  makeAuthRequestToken(e, n, r, s, o, i = zf().getTime(), c = {}) {
    const a = this.appConfig;
    if (!a)
      throw new cs("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || a.redirectURI(), r = r || a.manifestURI(), s = s || a.scopes, o = o || a.appDomain, Ch(e, n, r, s, o, i, c);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = $h();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = Us("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (Gg())
        return ke.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      ke.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = nu()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Nn("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const o = bt.decodeToken(e).payload;
    if (typeof o == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await Uh(e))
      throw new Nn("Invalid authentication response.");
    let c = o.private_key, a = o.core_token;
    if (Zr(o.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (o.private_key !== void 0 && o.private_key !== null)
          try {
            c = await fi(s, o.private_key);
          } catch {
            if (ke.warn("Failed decryption of appPrivateKey, will try to use as given"), !et.isValidPrivateKey(o.private_key))
              throw new Nn("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (a != null)
          try {
            a = await fi(s, a);
          } catch {
            ke.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Nn("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let f = qf, d;
    Zr(o.version, "1.2.0") && o.hubUrl !== null && o.hubUrl !== void 0 && (f = o.hubUrl), Zr(o.version, "1.3.0") && o.associationToken !== null && o.associationToken !== void 0 && (d = o.associationToken);
    const l = {
      profile: o.profile,
      email: o.email,
      decentralizedID: o.iss,
      identityAddress: Ra(o.iss),
      appPrivateKey: c,
      coreSessionToken: a,
      authResponseToken: e,
      hubUrl: f,
      appPrivateKeyFromWalletSalt: o.appPrivateKeyFromWalletSalt,
      coreNode: o.blockstackAPIUrl,
      gaiaAssociationToken: d
    }, g = o.profile_url;
    if (!l.profile && g) {
      const h = await n(g);
      if (!h.ok)
        l.profile = Object.assign({}, jf);
      else {
        const b = await h.text(), w = JSON.parse(b);
        l.profile = Pg(w[0].token);
      }
    } else
      l.profile = o.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new cs("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Kd(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Wd(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
gr.prototype.makeAuthRequest = gr.prototype.makeAuthRequestToken;
const Vg = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], Kg = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = Vg(), n = t.filter((r) => e.find((o) => o.id === r.id) ? !1 : !!_r(r.id));
  return e.concat(n);
}, _r = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), to = "STX_PROVIDER", Rt = () => typeof window > "u" ? null : window.localStorage.getItem(to), il = (t) => {
  typeof window < "u" && window.localStorage.setItem(to, t);
}, cl = () => {
  typeof window < "u" && window.localStorage.removeItem(to);
}, Wg = "connect-ui";
let er, al, ht = !1, ys = !1;
const kt = (t, e = "") => () => {
}, Yg = (t, e) => () => {
}, Zg = "{visibility:hidden}.hydrated{visibility:inherit}", Ni = {}, Qg = "http://www.w3.org/2000/svg", qg = "http://www.w3.org/1999/xhtml", Xg = (t) => t != null, eo = (t) => (t = typeof t, t === "object" || t === "function");
function ll(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const U = (t, e, ...n) => {
  let r = null, s = !1, o = !1;
  const i = [], c = (f) => {
    for (let d = 0; d < f.length; d++)
      r = f[d], Array.isArray(r) ? c(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !eo(r)) && (r = String(r)), s && o ? i[i.length - 1].$text$ += r : i.push(s ? ms(null, r) : r), o = s);
  };
  if (c(n), e) {
    const f = e.className || e.class;
    f && (e.class = typeof f != "object" ? f : Object.keys(f).filter((d) => f[d]).join(" "));
  }
  const a = ms(t, null);
  return a.$attrs$ = e, i.length > 0 && (a.$children$ = i), a;
}, ms = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, Jg = {}, t1 = (t) => t && t.$tag$ === Jg, e1 = (t, e) => t != null && !eo(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, n1 = (t) => nn(t).$hostElement$, r1 = (t, e, n) => {
  const r = ct.ce(e, n);
  return t.dispatchEvent(r), r;
}, Bi = /* @__PURE__ */ new WeakMap(), s1 = (t, e, n) => {
  let r = pr.get(t);
  I1 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, pr.set(t, r);
}, o1 = (t, e, n, r) => {
  var s;
  let o = fl(e);
  const i = pr.get(o);
  if (t = t.nodeType === 11 ? t : Ct, i)
    if (typeof i == "string") {
      t = t.head || t;
      let c = Bi.get(t), a;
      if (c || Bi.set(t, c = /* @__PURE__ */ new Set()), !c.has(o)) {
        {
          a = Ct.createElement("style"), a.innerHTML = i;
          const f = (s = ct.$nonce$) !== null && s !== void 0 ? s : ll(Ct);
          f != null && a.setAttribute("nonce", f), t.insertBefore(a, t.querySelector("link"));
        }
        c && c.add(o);
      }
    } else t.adoptedStyleSheets.includes(i) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, i]);
  return o;
}, i1 = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = kt("attachStyles", e.$tagName$), o = o1(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = o, n.classList.add(o + "-h")), s();
}, fl = (t, e) => "sc-" + t.$tagName$, Ui = (t, e, n, r, s, o) => {
  if (n !== r) {
    let i = ji(t, e), c = e.toLowerCase();
    if (e === "class") {
      const a = t.classList, f = Ti(n), d = Ti(r);
      a.remove(...f.filter((l) => l && !d.includes(l))), a.add(...d.filter((l) => l && !f.includes(l)));
    } else if (!i && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : ji(Mr, c) ? e = c.slice(2) : e = c[2] + e.slice(3), n && ct.rel(t, e, n, !1), r && ct.ael(t, e, r, !1);
    else {
      const a = eo(r);
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
}, c1 = /\s/, Ti = (t) => t ? t.split(c1) : [], ul = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, o = t && t.$attrs$ || Ni, i = e.$attrs$ || Ni;
  for (r in o)
    r in i || Ui(s, r, o[r], void 0, n, e.$flags$);
  for (r in i)
    Ui(s, r, o[r], i[r], n, e.$flags$);
}, no = (t, e, n, r) => {
  const s = e.$children$[n];
  let o = 0, i, c;
  if (s.$text$ !== null)
    i = s.$elm$ = Ct.createTextNode(s.$text$);
  else {
    if (ht || (ht = s.$tag$ === "svg"), i = s.$elm$ = Ct.createElementNS(ht ? Qg : qg, s.$tag$), ht && s.$tag$ === "foreignObject" && (ht = !1), ul(null, s, ht), Xg(er) && i["s-si"] !== er && i.classList.add(i["s-si"] = er), s.$children$)
      for (o = 0; o < s.$children$.length; ++o)
        c = no(t, s, o), c && i.appendChild(c);
    s.$tag$ === "svg" ? ht = !1 : i.tagName === "foreignObject" && (ht = !0);
  }
  return i;
}, dl = (t, e, n, r, s, o) => {
  let i = t, c;
  for (i.shadowRoot && i.tagName === al && (i = i.shadowRoot); s <= o; ++s)
    r[s] && (c = no(null, n, s), c && (r[s].$elm$ = c, i.insertBefore(c, e)));
}, hl = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, a1 = (t, e, n, r) => {
  let s = 0, o = 0, i = e.length - 1, c = e[0], a = e[i], f = r.length - 1, d = r[0], l = r[f], g;
  for (; s <= i && o <= f; )
    c == null ? c = e[++s] : a == null ? a = e[--i] : d == null ? d = r[++o] : l == null ? l = r[--f] : Wn(c, d) ? (un(c, d), c = e[++s], d = r[++o]) : Wn(a, l) ? (un(a, l), a = e[--i], l = r[--f]) : Wn(c, l) ? (un(c, l), t.insertBefore(c.$elm$, a.$elm$.nextSibling), c = e[++s], l = r[--f]) : Wn(a, d) ? (un(a, d), t.insertBefore(a.$elm$, c.$elm$), a = e[--i], d = r[++o]) : (g = no(e && e[o], n, o), d = r[++o], g && c.$elm$.parentNode.insertBefore(g, c.$elm$));
  s > i ? dl(t, r[f + 1] == null ? null : r[f + 1].$elm$, n, r, o, f) : o > f && hl(e, s, i);
}, Wn = (t, e) => t.$tag$ === e.$tag$, un = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, o = e.$tag$, i = e.$text$;
  i === null ? (ht = o === "svg" ? !0 : o === "foreignObject" ? !1 : ht, ul(t, e, ht), r !== null && s !== null ? a1(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), dl(n, null, e, s, 0, s.length - 1)) : r !== null && hl(r, 0, r.length - 1), ht && o === "svg" && (ht = !1)) : t.$text$ !== i && (n.data = i);
}, l1 = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || ms(null, null), s = t1(e) ? e : U(null, null, e);
  al = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, er = n["s-sc"], un(r, s);
}, gl = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, ro = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return gl(t, t.$ancestorComponent$), L1(() => f1(t, e));
}, f1 = (t, e) => {
  const n = kt("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), g1(s, () => u1(t, r, e));
}, u1 = async (t, e, n) => {
  const r = t.$hostElement$, s = kt("update", t.$cmpMeta$.$tagName$), o = r["s-rc"];
  n && i1(t);
  const i = kt("render", t.$cmpMeta$.$tagName$);
  d1(t, e), o && (o.map((c) => c()), r["s-rc"] = void 0), i(), s();
  {
    const c = r["s-p"], a = () => h1(t);
    c.length === 0 ? a() : (Promise.all(c).then(a), t.$flags$ |= 4, c.length = 0);
  }
}, d1 = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, l1(t, e);
  } catch (r) {
    bn(r, t.$hostElement$);
  }
  return null;
}, h1 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = kt("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, bl(n), r(), t.$onReadyResolve$(n), s || pl()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && oo(() => ro(t, !1)), t.$flags$ &= -517;
}, pl = (t) => {
  bl(Ct.documentElement), oo(() => r1(Mr, "appload", { detail: { namespace: Wg } }));
}, g1 = (t, e) => t && t.then ? t.then(e) : e(), bl = (t) => t.classList.add("hydrated"), p1 = (t, e) => nn(t).$instanceValues$.get(e), b1 = (t, e, n, r) => {
  const s = nn(t), o = s.$instanceValues$.get(e), i = s.$flags$, c = s.$lazyInstance$;
  n = e1(n, r.$members$[e][0]);
  const a = Number.isNaN(o) && Number.isNaN(n), f = n !== o && !a;
  (!(i & 8) || o === void 0) && f && (s.$instanceValues$.set(e, n), c && (i & 18) === 2 && ro(s, !1));
}, wl = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([o, [i]]) => {
      (i & 31 || n & 2 && i & 32) && Object.defineProperty(s, o, {
        get() {
          return p1(this, o);
        },
        set(c) {
          b1(this, o, c, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const o = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(i, c, a) {
        ct.jmp(() => {
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
}, w1 = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = E1(n), s.then) {
        const a = Yg();
        s = await s, a();
      }
      s.isProxied || (wl(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const c = kt("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (a) {
        bn(a);
      }
      e.$flags$ &= -9, c();
    }
    if (s.style) {
      let c = s.style;
      const a = fl(n);
      if (!pr.has(a)) {
        const f = kt("registerStyles", n.$tagName$);
        s1(a, c, !!(n.$flags$ & 1)), f();
      }
    }
  }
  const o = e.$ancestorComponent$, i = () => ro(e, !0);
  o && o["s-rc"] ? o["s-rc"].push(i) : i();
}, x1 = (t) => {
  if (!(ct.$flags$ & 1)) {
    const e = nn(t), n = e.$cmpMeta$, r = kt("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            gl(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [o]]) => {
        if (o & 31 && t.hasOwnProperty(s)) {
          const i = t[s];
          delete t[s], t[s] = i;
        }
      }), w1(t, e, n);
    }
    r();
  }
}, y1 = (t) => {
  ct.$flags$ & 1 || nn(t);
}, m1 = (t, e = {}) => {
  var n;
  const r = kt(), s = [], o = e.exclude || [], i = Mr.customElements, c = Ct.head, a = /* @__PURE__ */ c.querySelector("meta[charset]"), f = /* @__PURE__ */ Ct.createElement("style"), d = [];
  let l, g = !0;
  Object.assign(ct, e), ct.$resourcesUrl$ = new URL(e.resourcesUrl || "./", Ct.baseURI).href, t.map((h) => {
    h[1].map((b) => {
      const w = {
        $flags$: b[0],
        $tagName$: b[1],
        $members$: b[2],
        $listeners$: b[3]
      };
      w.$members$ = b[2];
      const S = w.$tagName$, _ = class extends HTMLElement {
        // StencilLazyHost
        constructor(M) {
          super(M), M = this, A1(M, w), w.$flags$ & 1 && M.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), g ? d.push(this) : ct.jmp(() => x1(this));
        }
        disconnectedCallback() {
          ct.jmp(() => y1(this));
        }
        componentOnReady() {
          return nn(this).$onReadyPromise$;
        }
      };
      w.$lazyBundleId$ = h[0], !o.includes(S) && !i.get(S) && (s.push(S), i.define(S, wl(
        _,
        w,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    f.innerHTML = s + Zg, f.setAttribute("data-styles", "");
    const h = (n = ct.$nonce$) !== null && n !== void 0 ? n : ll(Ct);
    h != null && f.setAttribute("nonce", h), c.insertBefore(f, a ? a.nextSibling : c.firstChild);
  }
  g = !1, d.length ? d.map((h) => h.connectedCallback()) : ct.jmp(() => l = setTimeout(pl, 30)), r();
}, so = /* @__PURE__ */ new WeakMap(), nn = (t) => so.get(t), S1 = (t, e) => so.set(e.$lazyInstance$ = t, e), A1 = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], so.set(t, n);
}, ji = (t, e) => e in t, bn = (t, e) => (0, console.error)(t, e), es = /* @__PURE__ */ new Map(), E1 = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, o = es.get(s);
  if (o)
    return o[r];
  {
    const i = (c) => (es.set(s, c), c[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => $b).then(i, bn);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((i) => (es.set(s, i), i[r]), bn);
}, pr = /* @__PURE__ */ new Map(), Mr = typeof window < "u" ? window : {}, Ct = Mr.document || { head: {} }, ct = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, xl = (t) => Promise.resolve(t), I1 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), Oi = [], yl = [], v1 = (t, e) => (n) => {
  t.push(n), ys || (ys = !0, ct.$flags$ & 4 ? oo(Ss) : ct.raf(Ss));
}, ki = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      bn(n);
    }
  t.length = 0;
}, Ss = () => {
  ki(Oi), ki(yl), (ys = Oi.length > 0) && ct.raf(Ss);
}, oo = (t) => xl().then(t), L1 = /* @__PURE__ */ v1(yl), _1 = () => xl(), ml = (t, e) => typeof window > "u" ? Promise.resolve() : _1().then(() => m1([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
function Sl() {
  return _r(Rt()) || window.StacksProvider || window.BlockstackProvider;
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var M1 = (t) => {
  if (!t) {
    let e = new Ts(["store_write"], document.location.href);
    t = new gr({ appConfig: e });
  }
  return t;
}, $1 = async (t, e = Sl()) => {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  let { redirectTo: n = "/", manifestPath: r, onFinish: s, onCancel: o, sendToSignIn: i = !1, userSession: c, appDetails: a } = t, f = M1(c);
  f.isUserSignedIn() && f.signUserOut();
  let d = f.generateAndStoreTransitKey(), l = f.makeAuthRequest(d, `${document.location.origin}${n}`, `${document.location.origin}${r}`, f.appConfig.scopes, void 0, void 0, { sendToSignIn: i, appDetails: a, connectVersion: "__VERSION__" });
  try {
    let g = await e.authenticationRequest(l);
    await f.handlePendingSignIn(g);
    let h = bt.decodeToken(g), b = h == null ? void 0 : h.payload;
    s == null || s({ authResponse: g, authResponsePayload: b, userSession: f });
  } catch (g) {
    console.error("[Connect] Error during auth request", g), o == null || o();
  }
}, C1 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(C1 || {}), H1 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(H1 || {}), D1 = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(D1 || {}), Al = "asigna-stx", Pi = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === Al && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(B1(t, e), "*");
}), N1 = { authenticationRequest: async (t) => Pi(t, "authenticationRequest"), transactionRequest: async (t) => Pi(t, "transactionRequest") }, B1 = (t, e) => ({ source: Al, [e]: t }), U1 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = N1);
};
U1();
var El = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function T1(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let o = Rt(), i = Sl();
    if (o && i) return t(n, i);
    if (typeof window > "u") return;
    ml();
    let c = (s = n == null ? void 0 : n.defaultProviders) != null ? s : El, a = Kg(c), f = document.createElement("connect-modal");
    f.defaultProviders = c, f.installedProviders = a, f.persistSelection = e;
    let d = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let l = () => {
      f.remove(), document.body.style.overflow = d;
    };
    f.callback = (h) => {
      l(), t(n, h);
    }, f.cancelCallback = () => {
      var h;
      l(), (h = n.onCancel) == null || h.call(n);
    }, document.body.appendChild(f);
    let g = (h) => {
      h.key === "Escape" && (document.removeEventListener("keydown", g), f.remove());
    };
    document.addEventListener("keydown", g);
  };
}
var j1 = T1($1, !1), O1 = cl;
function io(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Je(r);
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
      const r = F1(BigInt(`0x${Pt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Pt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function co(t, e = 8) {
  return (typeof t == "bigint" ? t : io(t, !1)).toString(16).padStart(e * 2, "0");
}
function Il(t) {
  return parseInt(t, 16);
}
function vl(t, e = 16) {
  const n = co(t, e);
  return Je(n);
}
function k1(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function P1(t, e) {
  return t & BigInt(1) << e;
}
function F1(t, e) {
  return P1(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const z1 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Pt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += z1[n];
  return e;
}
function Je(t) {
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
function Sn(t) {
  return new TextEncoder().encode(t);
}
function Ll(t) {
  return new TextDecoder().decode(t);
}
function _l(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function R1(t) {
  return String.fromCharCode.apply(null, t);
}
function G1(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Fi(t) {
  if (t.some(G1))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function ao(...t) {
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
function rn(t) {
  return ao(...t.map((e) => typeof e == "number" ? Fi([e]) : e instanceof Array ? Fi(e) : e));
}
function V1(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function K1(t, e) {
  return t[e];
}
function W1(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function $r(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var As;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(As || (As = {}));
As.Mainnet;
const Y1 = 128, Z1 = 128, Ml = 16;
var wn;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(wn || (wn = {}));
var zi;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(zi || (zi = {}));
var Ri;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Ri || (Ri = {}));
var At;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(At || (At = {}));
const ns = ["onChainOnly", "offChainOnly", "any"];
ns[0] + "", At.OnChainOnly, ns[1] + "", At.OffChainOnly, ns[2] + "", At.Any, At.OnChainOnly + "", At.OnChainOnly, At.OffChainOnly + "", At.OffChainOnly, At.Any + "", At.Any;
var Es;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Es || (Es = {}));
Es.Mainnet;
var Gi;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Gi || (Gi = {}));
var Vi;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Vi || (Vi = {}));
var Ki;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ki || (Ki = {}));
var Wi;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Wi || (Wi = {}));
var Yi;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Yi || (Yi = {}));
var Zi;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Zi || (Zi = {}));
var Qi;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Qi || (Qi = {}));
var qi;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(qi || (qi = {}));
var Xi;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Xi || (Xi = {}));
var Ji;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ji || (Ji = {}));
var tc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(tc || (tc = {}));
function Is(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Q1(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function $l(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function q1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Is(t.outputLen), Is(t.blockLen);
}
function X1(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function J1(t, e) {
  $l(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const rs = {
  number: Is,
  bool: Q1,
  bytes: $l,
  hash: q1,
  exists: X1,
  output: J1
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ss = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), _t = (t, e) => t << 32 - e | t >>> e, t2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!t2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function e2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Cl(t) {
  if (typeof t == "string" && (t = e2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class n2 {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function $e(t) {
  const e = (r) => t().update(Cl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function r2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), a = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + a, i, r), t.setUint32(e + f, c, r);
}
class lo extends n2 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ss(this.buffer);
  }
  update(e) {
    rs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Cl(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const a = ss(e);
        for (; s <= o - i; i += s)
          this.process(a, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    rs.exists(this), rs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let l = i; l < s; l++)
      n[l] = 0;
    r2(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = ss(e), a = this.outputLen;
    if (a % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = a / 4, d = this.get();
    if (f > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      c.setUint32(4 * l, d[l], o);
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
const s2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Hl = Uint8Array.from({ length: 16 }, (t, e) => e), o2 = Hl.map((t) => (9 * t + 5) % 16);
let fo = [Hl], uo = [o2];
for (let t = 0; t < 4; t++)
  for (let e of [fo, uo])
    e.push(e[t].map((n) => s2[n]));
const Dl = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), i2 = fo.map((t, e) => t.map((n) => Dl[e][n])), c2 = uo.map((t, e) => t.map((n) => Dl[e][n])), a2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), l2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Yn = (t, e) => t << e | t >>> 32 - e;
function ec(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Zn = new Uint32Array(16);
class f2 extends lo {
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
    for (let h = 0; h < 16; h++, n += 4)
      Zn[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, c = this.h2 | 0, a = c, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, w = a2[h], S = l2[h], _ = fo[h], M = uo[h], x = i2[h], L = c2[h];
      for (let A = 0; A < 16; A++) {
        const N = Yn(r + ec(h, o, c, f) + Zn[_[A]] + w, x[A]) + l | 0;
        r = l, l = f, f = Yn(c, 10) | 0, c = o, o = N;
      }
      for (let A = 0; A < 16; A++) {
        const N = Yn(s + ec(b, i, a, d) + Zn[M[A]] + S, L[A]) + g | 0;
        s = g, g = d, d = Yn(a, 10) | 0, a = i, i = N;
      }
    }
    this.set(this.h1 + c + d | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + i | 0, this.h0 + o + a | 0);
  }
  roundClean() {
    Zn.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
$e(() => new f2());
const u2 = (t, e, n) => t & e ^ ~t & n, d2 = (t, e, n) => t & e ^ t & n ^ e & n, h2 = new Uint32Array([
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
]), ne = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), re = new Uint32Array(64);
class Nl extends lo {
  constructor() {
    super(64, 32, 8, !1), this.A = ne[0] | 0, this.B = ne[1] | 0, this.C = ne[2] | 0, this.D = ne[3] | 0, this.E = ne[4] | 0, this.F = ne[5] | 0, this.G = ne[6] | 0, this.H = ne[7] | 0;
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
      re[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = re[l - 15], h = re[l - 2], b = _t(g, 7) ^ _t(g, 18) ^ g >>> 3, w = _t(h, 17) ^ _t(h, 19) ^ h >>> 10;
      re[l] = w + re[l - 7] + b + re[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: a, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = _t(c, 6) ^ _t(c, 11) ^ _t(c, 25), h = d + g + u2(c, a, f) + h2[l] + re[l] | 0, w = (_t(r, 2) ^ _t(r, 13) ^ _t(r, 22)) + d2(r, s, o) | 0;
      d = f, f = a, a = c, c = i + h | 0, i = o, o = s, s = r, r = h + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, o, i, c, a, f, d);
  }
  roundClean() {
    re.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class g2 extends Nl {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
$e(() => new Nl());
$e(() => new g2());
const Qn = BigInt(2 ** 32 - 1), vs = BigInt(32);
function Bl(t, e = !1) {
  return e ? { h: Number(t & Qn), l: Number(t >> vs & Qn) } : { h: Number(t >> vs & Qn) | 0, l: Number(t & Qn) | 0 };
}
function p2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = Bl(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const b2 = (t, e) => BigInt(t >>> 0) << vs | BigInt(e >>> 0), w2 = (t, e, n) => t >>> n, x2 = (t, e, n) => t << 32 - n | e >>> n, y2 = (t, e, n) => t >>> n | e << 32 - n, m2 = (t, e, n) => t << 32 - n | e >>> n, S2 = (t, e, n) => t << 64 - n | e >>> n - 32, A2 = (t, e, n) => t >>> n - 32 | e << 64 - n, E2 = (t, e) => e, I2 = (t, e) => t, v2 = (t, e, n) => t << n | e >>> 32 - n, L2 = (t, e, n) => e << n | t >>> 32 - n, _2 = (t, e, n) => e << n - 32 | t >>> 64 - n, M2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function $2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const C2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), H2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, D2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), N2 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, B2 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), U2 = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, k = {
  fromBig: Bl,
  split: p2,
  toBig: b2,
  shrSH: w2,
  shrSL: x2,
  rotrSH: y2,
  rotrSL: m2,
  rotrBH: S2,
  rotrBL: A2,
  rotr32H: E2,
  rotr32L: I2,
  rotlSH: v2,
  rotlSL: L2,
  rotlBH: _2,
  rotlBL: M2,
  add: $2,
  add3L: C2,
  add3H: H2,
  add4L: D2,
  add4H: N2,
  add5H: U2,
  add5L: B2
}, [T2, j2] = k.split([
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
].map((t) => BigInt(t))), se = new Uint32Array(80), oe = new Uint32Array(80);
class Cr extends lo {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: c, Dl: a, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: b, Hh: w, Hl: S } = this;
    return [e, n, r, s, o, i, c, a, f, d, l, g, h, b, w, S];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, a, f, d, l, g, h, b, w, S) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = a | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = b | 0, this.Hh = w | 0, this.Hl = S | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      se[x] = e.getUint32(n), oe[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const L = se[x - 15] | 0, A = oe[x - 15] | 0, N = k.rotrSH(L, A, 1) ^ k.rotrSH(L, A, 8) ^ k.shrSH(L, A, 7), P = k.rotrSL(L, A, 1) ^ k.rotrSL(L, A, 8) ^ k.shrSL(L, A, 7), C = se[x - 2] | 0, D = oe[x - 2] | 0, V = k.rotrSH(C, D, 19) ^ k.rotrBH(C, D, 61) ^ k.shrSH(C, D, 6), X = k.rotrSL(C, D, 19) ^ k.rotrBL(C, D, 61) ^ k.shrSL(C, D, 6), Q = k.add4L(P, X, oe[x - 7], oe[x - 16]), J = k.add4H(Q, N, V, se[x - 7], se[x - 16]);
      se[x] = J | 0, oe[x] = Q | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: c, Cl: a, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: b, Gh: w, Gl: S, Hh: _, Hl: M } = this;
    for (let x = 0; x < 80; x++) {
      const L = k.rotrSH(l, g, 14) ^ k.rotrSH(l, g, 18) ^ k.rotrBH(l, g, 41), A = k.rotrSL(l, g, 14) ^ k.rotrSL(l, g, 18) ^ k.rotrBL(l, g, 41), N = l & h ^ ~l & w, P = g & b ^ ~g & S, C = k.add5L(M, A, P, j2[x], oe[x]), D = k.add5H(C, _, L, N, T2[x], se[x]), V = C | 0, X = k.rotrSH(r, s, 28) ^ k.rotrBH(r, s, 34) ^ k.rotrBH(r, s, 39), Q = k.rotrSL(r, s, 28) ^ k.rotrBL(r, s, 34) ^ k.rotrBL(r, s, 39), J = r & o ^ r & c ^ o & c, wt = s & i ^ s & a ^ i & a;
      _ = w | 0, M = S | 0, w = h | 0, S = b | 0, h = l | 0, b = g | 0, { h: l, l: g } = k.add(f | 0, d | 0, D | 0, V | 0), f = c | 0, d = a | 0, c = o | 0, a = i | 0, o = r | 0, i = s | 0;
      const nt = k.add3L(V, Q, wt);
      r = k.add3H(nt, D, X, J), s = nt | 0;
    }
    ({ h: r, l: s } = k.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = k.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: c, l: a } = k.add(this.Ch | 0, this.Cl | 0, c | 0, a | 0), { h: f, l: d } = k.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = k.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: b } = k.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: w, l: S } = k.add(this.Gh | 0, this.Gl | 0, w | 0, S | 0), { h: _, l: M } = k.add(this.Hh | 0, this.Hl | 0, _ | 0, M | 0), this.set(r, s, o, i, c, a, f, d, l, g, h, b, w, S, _, M);
  }
  roundClean() {
    se.fill(0), oe.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class O2 extends Cr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class k2 extends Cr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class P2 extends Cr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
$e(() => new Cr());
$e(() => new O2());
$e(() => new k2());
$e(() => new P2());
function nc(t) {
  return mn.c32address(t.version, t.hash160);
}
function ho(t, e, n) {
  const r = e || 1, s = n || Y1;
  if (mp(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: wn.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Ul(t) {
  const e = mn.c32addressDecode(t);
  return {
    type: wn.Address,
    version: e[0],
    hash160: e[1]
  };
}
var E;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(E || (E = {}));
function F2(t) {
  if (t.type === E.PrincipalStandard)
    return nc(t.address);
  if (t.type === E.PrincipalContract)
    return `${nc(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function z2(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return V2(e, n);
  } else
    return R2(t);
}
function R2(t) {
  const e = Ul(t);
  return { type: E.PrincipalStandard, address: e };
}
function G2(t) {
  return { type: E.PrincipalStandard, address: t };
}
function V2(t, e) {
  const n = Ul(t), r = ho(e);
  return Tl(n, r);
}
function Tl(t, e) {
  if (Sn(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: E.PrincipalContract, address: t, contractName: e };
}
function os(t, e = !1) {
  switch (t.type) {
    case E.BoolTrue:
      return !0;
    case E.BoolFalse:
      return !1;
    case E.Int:
    case E.UInt:
      return e ? t.value.toString() : t.value;
    case E.Buffer:
      return `0x${Pt(t.buffer)}`;
    case E.OptionalNone:
      return null;
    case E.OptionalSome:
      return Te(t.value);
    case E.ResponseErr:
      return Te(t.value);
    case E.ResponseOk:
      return Te(t.value);
    case E.PrincipalStandard:
    case E.PrincipalContract:
      return F2(t);
    case E.List:
      return t.list.map((r) => Te(r));
    case E.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = Te(t.data[r]);
      }), n;
    case E.StringASCII:
      return t.data;
    case E.StringUTF8:
      return t.data;
  }
}
function Te(t) {
  switch (t.type) {
    case E.ResponseErr:
      return { type: ae(t), value: os(t, !0), success: !1 };
    case E.ResponseOk:
      return { type: ae(t), value: os(t, !0), success: !0 };
    default:
      return { type: ae(t), value: os(t, !0) };
  }
}
function ae(t) {
  switch (t.type) {
    case E.BoolTrue:
    case E.BoolFalse:
      return "bool";
    case E.Int:
      return "int";
    case E.UInt:
      return "uint";
    case E.Buffer:
      return `(buff ${t.buffer.length})`;
    case E.OptionalNone:
      return "(optional none)";
    case E.OptionalSome:
      return `(optional ${ae(t.value)})`;
    case E.ResponseErr:
      return `(response UnknownType ${ae(t.value)})`;
    case E.ResponseOk:
      return `(response ${ae(t.value)} UnknownType)`;
    case E.PrincipalStandard:
    case E.PrincipalContract:
      return "principal";
    case E.List:
      return `(list ${t.list.length} ${t.list.length ? ae(t.list[0]) : "UnknownType"})`;
    case E.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${ae(t.data[e])})`).join(" ")})`;
    case E.StringASCII:
      return `(string-ascii ${_l(t.data).length})`;
    case E.StringUTF8:
      return `(string-utf8 ${Sn(t.data).length})`;
  }
}
const K2 = () => ({ type: E.BoolTrue }), W2 = () => ({ type: E.BoolFalse }), rc = BigInt("0xffffffffffffffffffffffffffffffff"), Y2 = BigInt(0), sc = BigInt("0x7fffffffffffffffffffffffffffffff"), oc = BigInt("-170141183460469231731687303715884105728"), Z2 = (t) => {
  const e = io(t, !0);
  if (e > sc)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${sc}`);
  if (e < oc)
    throw new RangeError(`Cannot construct clarity integer form value less than ${oc}`);
  return { type: E.Int, value: e };
}, Q2 = (t) => {
  const e = io(t, !1);
  if (e < Y2)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > rc)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${rc}`);
  return { type: E.UInt, value: e };
}, q2 = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: E.Buffer, buffer: t };
};
function X2() {
  return { type: E.OptionalNone };
}
function J2(t) {
  return { type: E.OptionalSome, value: t };
}
function tp(t) {
  return { type: E.ResponseErr, value: t };
}
function ep(t) {
  return { type: E.ResponseOk, value: t };
}
function np(t) {
  return { type: E.List, list: t };
}
function rp(t) {
  for (const e in t)
    if (!Sp(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: E.Tuple, data: t };
}
const sp = (t) => ({ type: E.StringASCII, data: t }), op = (t) => ({ type: E.StringUTF8, data: t });
class jl extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class ip extends jl {
  constructor(e) {
    super(e);
  }
}
class is extends jl {
  constructor(e) {
    super(e);
  }
}
function Ol(t) {
  const e = [];
  return e.push(Je(co(t.version, 1))), e.push(Je(t.hash160)), rn(e);
}
function ic(t) {
  const e = Il(Pt(t.readBytes(1))), n = Pt(t.readBytes(20));
  return { type: wn.Address, version: e, hash160: n };
}
function kl(t) {
  const e = [], n = Sn(t.content), r = n.byteLength;
  return e.push(Je(co(r, t.lengthPrefixBytes))), e.push(n), rn(e);
}
function cc(t, e, n) {
  e = e || 1;
  const r = Il(Pt(t.readBytes(e))), s = Ll(t.readBytes(r));
  return ho(s, e, 128);
}
function Dt(t, e) {
  return rn([t, e]);
}
function cp(t) {
  return new Uint8Array([t.type]);
}
function ap(t) {
  return t.type === E.OptionalNone ? new Uint8Array([t.type]) : Dt(t.type, An(t.value));
}
function lp(t) {
  const e = new Uint8Array(4);
  return $r(e, t.buffer.length, 0), Dt(t.type, ao(e, t.buffer));
}
function fp(t) {
  const e = vl(k1(t.value, BigInt(Z1)), Ml);
  return Dt(t.type, e);
}
function up(t) {
  const e = vl(t.value, Ml);
  return Dt(t.type, e);
}
function dp(t) {
  return Dt(t.type, Ol(t.address));
}
function hp(t) {
  return Dt(t.type, ao(Ol(t.address), kl(t.contractName)));
}
function gp(t) {
  return Dt(t.type, An(t.value));
}
function pp(t) {
  const e = [], n = new Uint8Array(4);
  $r(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = An(r);
    e.push(s);
  }
  return Dt(t.type, rn(e));
}
function bp(t) {
  const e = [], n = new Uint8Array(4);
  $r(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = ho(s);
    e.push(kl(o));
    const i = An(t.data[s]);
    e.push(i);
  }
  return Dt(t.type, rn(e));
}
function Pl(t, e) {
  const n = [], r = e == "ascii" ? _l(t.data) : Sn(t.data), s = new Uint8Array(4);
  return $r(s, r.length, 0), n.push(s), n.push(r), Dt(t.type, rn(n));
}
function wp(t) {
  return Pl(t, "ascii");
}
function xp(t) {
  return Pl(t, "utf8");
}
function An(t) {
  switch (t.type) {
    case E.BoolTrue:
    case E.BoolFalse:
      return cp(t);
    case E.OptionalNone:
    case E.OptionalSome:
      return ap(t);
    case E.Buffer:
      return lp(t);
    case E.UInt:
      return up(t);
    case E.Int:
      return fp(t);
    case E.PrincipalStandard:
      return dp(t);
    case E.PrincipalContract:
      return hp(t);
    case E.ResponseOk:
    case E.ResponseErr:
      return gp(t);
    case E.List:
      return pp(t);
    case E.Tuple:
      return bp(t);
    case E.StringASCII:
      return wp(t);
    case E.StringUTF8:
      return xp(t);
    default:
      throw new ip("Unable to serialize. Invalid Clarity Value.");
  }
}
function yp(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const ac = /* @__PURE__ */ new Map();
function Fl(t, e) {
  const n = ac.get(t);
  if (n !== void 0)
    return n(e);
  const r = yp(t);
  return ac.set(t, r), Fl(t, e);
}
class lc {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return W1(this.readBytes(4), 0);
  }
  readUInt8() {
    return K1(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return V1(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = Pt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = Pt(n);
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
    if (Fl(e, r))
      return r;
    throw n(r);
  }
}
function je(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new lc(Je(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new lc(t) : e = t;
  switch (e.readUInt8Enum(E, (r) => {
    throw new is(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case E.Int:
      return Z2(e.readBytes(16));
    case E.UInt:
      return Q2(e.readBytes(16));
    case E.Buffer:
      const r = e.readUInt32BE();
      return q2(e.readBytes(r));
    case E.BoolTrue:
      return K2();
    case E.BoolFalse:
      return W2();
    case E.PrincipalStandard:
      const s = ic(e);
      return G2(s);
    case E.PrincipalContract:
      const o = ic(e), i = cc(e);
      return Tl(o, i);
    case E.ResponseOk:
      return ep(je(e));
    case E.ResponseErr:
      return tp(je(e));
    case E.OptionalNone:
      return X2();
    case E.OptionalSome:
      return J2(je(e));
    case E.List:
      const c = e.readUInt32BE(), a = [];
      for (let w = 0; w < c; w++)
        a.push(je(e));
      return np(a);
    case E.Tuple:
      const f = e.readUInt32BE(), d = {};
      for (let w = 0; w < f; w++) {
        const S = cc(e).content;
        if (S === void 0)
          throw new is('"content" is undefined');
        d[S] = je(e);
      }
      return rp(d);
    case E.StringASCII:
      const l = e.readUInt32BE(), g = R1(e.readBytes(l));
      return sp(g);
    case E.StringUTF8:
      const h = e.readUInt32BE(), b = Ll(e.readBytes(h));
      return op(b);
    default:
      throw new is("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const mp = (t, e) => t ? Sn(t).length > e : !1;
function Sp(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function Ap(t) {
  const e = An(t);
  return `0x${Pt(e)}`;
}
function Ep(t) {
  return je(t);
}
const ze = (t) => {
  try {
    return mn.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
}, Ip = ["store_write"], fc = "/manifest.json", vp = /* @__PURE__ */ new Set([4001, -31001]), Lp = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], go = (t) => typeof t == "string" && t.toLowerCase().includes("leather"), En = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), sn = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, Re = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, Ls = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), po = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((o) => Ls(o, r)) === s
  );
}, zl = (t) => t ? po(sn()).some(
  (e) => {
    var n;
    return e.id === t && (En(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Rl = () => {
  if (typeof window > "u")
    return;
  const t = sn(), e = po(t).filter(
    (n) => {
      var r;
      return En(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Re(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of Lp) {
    const r = Re(t, n) ?? (t === window ? void 0 : Re(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, Gl = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = sn(), n = Re(e, t) ?? (e === window ? void 0 : Re(window, t)) ?? _r(t);
  if (n)
    return n;
  if (En(t) || zl(t))
    return Rl();
}, _p = (t) => {
  const e = sn();
  if (!e)
    return [];
  const n = po(e), r = t.filter(
    (o) => !n.some((i) => Ls(i, o)) && !!Re(e, o.id)
  );
  return n.map((o) => {
    const i = t.find((c) => Ls(o, c));
    return i != null && i.icon ? { ...o, icon: i.icon } : o;
  }).concat(r);
}, Ft = () => ({ isConnected: !1 }), Mp = ["blockstack-session", "blockstack"], Vl = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of Mp) {
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
Vl();
const $p = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Pe = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, _s = (t, e = "mainnet") => {
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
      return _s(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return _s(r, e);
  }
  return e;
}, Ms = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return ze(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const o = Ms(s, e + 1);
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
    const o = Ms(n[s], e + 1);
    if (o)
      return o;
  }
  return typeof n.mainnet == "string" && ze(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && ze(n.testnet) ? n.testnet.trim() : null;
}, uc = (t) => {
  const e = Pe(t);
  if (!e)
    return null;
  const n = $p(e);
  return /^[0-9a-f]{66}$/i.test(n) ? n : null;
}, $s = (t, e, n = 0) => {
  if (n > 8 || !t)
    return null;
  if (Array.isArray(t)) {
    for (const i of t) {
      const c = $s(i, e, n + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return e ? null : uc(t);
  const r = t, s = [r.address, r.stxAddress, r.selectedAddress].map((i) => Pe(i)).find((i) => i && ze(i)), o = [r.publicKey, r.public_key, r.stxPublicKey].map((i) => uc(i)).find(Boolean);
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
    const c = $s(r[i], e, n + 1);
    if (c)
      return c;
  }
  return null;
}, Cp = (t) => {
  var o;
  const e = t.profile ?? {}, n = typeof e.stxAddress == "string" ? e.stxAddress : typeof ((o = e.stxAddress) == null ? void 0 : o.mainnet) == "string" ? e.stxAddress.mainnet : t.identityAddress, r = typeof n == "string" && ze(n) ? n.trim() : null;
  if (!r)
    return Ft();
  const s = Ds(r);
  return s !== "mainnet" ? Ft() : {
    isConnected: !0,
    address: r,
    network: s
  };
}, Hp = (t, e = "mainnet") => {
  const n = Ms(t);
  if (!n)
    return Ft();
  const r = Ds(n) ?? _s(t, e);
  if (r !== "mainnet")
    return Ft();
  const s = $s(t, n);
  return {
    isConnected: !0,
    address: n,
    network: r,
    ...s ? { publicKey: s } : {}
  };
}, bo = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, wo = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && vp.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, br = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Pe(n == null ? void 0 : n.message) ?? Pe(e.message) ?? Pe(e.error) ?? Pe(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, Kl = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw br(e);
    if (e.status === "error")
      throw br(e.result ?? e);
  }
  return t;
}, xo = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return Kl(r);
  } catch (r) {
    throw br(r);
  }
}, Wl = () => Rl(), wr = (t) => {
  var r, s;
  const e = Rt();
  if (En(e) || zl(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = sn() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === Wl();
}, dc = async (t, e, n) => {
  if (!wr(t))
    return xo(t, e, n);
  const r = Wl();
  if (!r)
    throw Object.assign(new Error("Xverse modern request provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  try {
    return Kl(await r.request(e, n));
  } catch (s) {
    throw br(s);
  }
}, Dp = (t) => {
}, Yl = (t, e = 0) => {
  if (e > 5 || t === null || typeof t > "u")
    return [];
  if (Array.isArray(t))
    return [...new Set(t.filter((r) => typeof r == "string"))];
  if (typeof t != "object")
    return [];
  const n = t;
  for (const r of ["supportedMethods", "methods", "result", "data"])
    if (r in n) {
      const s = Yl(n[r], e + 1);
      if (s.length > 0)
        return s;
    }
  return [];
}, Np = [
  "wallet_connect",
  "stx_requestAccounts",
  "connect",
  "getAddresses",
  "stx_getAddresses",
  "stx_getAccounts",
  "getAccounts",
  "wallet_getAccount",
  "requestAccounts"
], Bp = async (t) => {
  const e = Rt();
  if (wr(t))
    return ["wallet_connect", "stx_getAccounts", "wallet_getAccount"];
  if (!go(e))
    return Np;
  const n = [
    "getAddresses",
    "stx_getAccounts",
    "stx_getAddresses",
    "stx_requestAccounts",
    "wallet_connect"
  ];
  try {
    const r = Yl(await xo(t, "supportedMethods"));
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
}, Up = async (t) => {
  if (wr(t))
    try {
      await dc(t, "wallet_disconnect");
    } catch {
    }
  const e = await Bp(t);
  let n = null;
  for (const r of e)
    try {
      console.info("[wallet:connect]", { stage: "REQUEST", method: r });
      const s = await dc(t, r), o = Hp(s);
      if (o.isConnected)
        return console.info("[wallet:connect]", {
          stage: "CONNECTED",
          method: r,
          hasPublicKey: !!o.publicKey
        }), wr(t) && Dp(o.address), o;
      console.info("[wallet:connect]", { stage: "EMPTY_RESPONSE", method: r });
    } catch (s) {
      n = s;
      const o = bo(s);
      if ((o ? console.info : console.warn)("[wallet:connect]", {
        stage: "REQUEST_ERROR",
        method: r,
        code: s && typeof s == "object" && "code" in s ? s.code : void 0,
        message: s instanceof Error ? s.message : String(s)
      }), wo(s))
        return Ft();
      if (o)
        continue;
      throw s;
    }
  if (n)
    throw n;
  return Ft();
}, Tp = async (t, e) => {
  const n = new Ts(Ip, void 0, "", fc), r = new gr({ appConfig: n });
  return new Promise((s) => {
    j1(
      {
        appDetails: {
          name: t.appName,
          icon: t.appIcon
        },
        manifestPath: fc,
        userSession: r,
        onFinish: (o) => {
          s(Cp(o.userSession.loadUserData()));
        },
        onCancel: () => {
          s(Ft());
        }
      },
      e
    );
  });
}, jp = (t, e = !0) => {
  if (t && typeof t != "string")
    return t;
  const n = typeof t == "string" ? t : Rt(), r = Gl(n);
  return r ? (e && n && il(n), r) : null;
}, Op = (t) => {
  if (typeof window > "u" || typeof document > "u")
    return Promise.resolve(null);
  const e = (t == null ? void 0 : t.persistSelection) ?? !0;
  return ml(), new Promise((n) => {
    const r = document.createElement("connect-modal"), s = El, o = _p(s), i = document.body.style.overflow, c = () => {
      document.body.style.overflow = i, document.removeEventListener("keydown", a), r.remove();
    }, a = (f) => {
      f.key === "Escape" && (c(), n(null));
    };
    r.defaultProviders = s, r.installedProviders = o, r.persistSelection = e, r.callback = (f) => {
      const d = jp(f, e);
      console.info("[wallet:connect]", {
        stage: "PROVIDER_SELECTED",
        providerId: typeof f == "string" ? f : Rt() ?? "provider-object",
        resolved: !!d,
        requestBridge: typeof (d == null ? void 0 : d.request) == "function"
      }), c(), n(d);
    }, r.cancelCallback = () => {
      c(), n(null);
    }, document.body.style.overflow = "hidden", document.addEventListener("keydown", a), document.body.appendChild(r);
  });
}, kp = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = Rt(), e = t ? Gl(t) : void 0;
  if (e)
    return e;
  const n = sn() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, Pp = async (t) => {
  Vl();
  const e = await Op({});
  if (!e)
    return Ft();
  if (typeof e.request == "function")
    try {
      const n = await Up(e);
      if (n.isConnected)
        return n;
    } catch (n) {
      if (wo(n))
        return Ft();
      if (!bo(n))
        throw n;
    }
  return Tp(t, e);
}, Fp = () => {
  const t = Rt();
  return go(t) ? "leather" : En(t) ? "xverse" : t ? String(t) : void 0;
}, zp = async (t) => {
  const e = Uf("wallet_connect");
  fn({ journey: e, step: "open", outcome: "start" });
  try {
    const n = await Pp(t);
    return n.isConnected && n.address ? (Ns(n.address, Fp()), Bs(n.network), fn({ journey: e, step: "authorize", outcome: "success" })) : fn({ journey: e, step: "authorize", outcome: "abandon" }), n;
  } catch (n) {
    throw fn({
      journey: e,
      step: "authorize",
      outcome: "error",
      errorCode: Cf(n),
      error: n
    }), n;
  }
}, Rp = async () => {
  const t = kp();
  if (t && go(Rt()))
    for (const e of ["stx_disconnect", "wallet_disconnect", "disconnect", "deactivate"])
      try {
        await xo(t, e);
        break;
      } catch (n) {
        if (wo(n) || bo(n))
          continue;
      }
  O1(), cl(), Ns(null), Bs(null), fn({ flow: "wallet_connect", step: "disconnect", outcome: "info" });
}, Gp = (t) => {
  const e = vf(), n = () => {
    e.clear();
  }, r = () => {
    const i = e.load();
    return i.isConnected && i.address && (Ns(i.address), Bs(i.network)), i;
  };
  return {
    connect: async () => {
      const i = r(), c = await zp({
        appName: t.appName,
        appIcon: t.appIcon
      });
      return c.isConnected ? (e.save(c), c) : i.isConnected ? i : c;
    },
    disconnect: async () => {
      await Rp(), n();
    },
    getSession: r
  };
}, Vp = {}, Kp = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, Wp = (t) => {
  const e = Vp;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, Yp = (t) => `/hiro/${t}`, Zp = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, Qp = (t) => {
  const e = Wp(t);
  if (e)
    return [Zp(e)];
  const n = Kp[t];
  return typeof window < "u" ? [`${window.location.origin}${Yp(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, qp = {}, hc = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, Xp = "xtrata.log.enabled", Jp = "xtrata.log.level", tb = "xtrata.log.tags", eb = "xtrata.log.dedupe", qn = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, nb = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, rb = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, sb = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, ob = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, ib = () => {
  const t = qp ?? {}, e = qn(Xp) ?? t.VITE_LOG_ENABLED, n = qn(Jp) ?? t.VITE_LOG_LEVEL, r = qn(tb) ?? t.VITE_LOG_TAGS, s = qn(eb) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: nb(e),
    level: rb(n) ?? "warn",
    tags: ob(r),
    dedupe: sb(s)
  };
}, cb = (t, e, n) => !t.enabled || hc[n] < hc[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), ab = (t, e, n, r) => {
  const s = ib();
  if (!cb(s, e, t) || fb(s.dedupe))
    return;
  const o = `[xtrata:${e}] ${n}`, i = console[t] ?? console.log;
  r !== void 0 ? i(o, r) : i(o);
}, lb = /* @__PURE__ */ new Set();
let gc = null;
const fb = (t, e, n, r, s) => (gc !== t && (lb.clear(), gc = t), !1), ub = (t, e, n) => ab("debug", t, e, n), db = {}, hb = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, gb = (t) => {
  const e = db, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : hb[t];
}, pb = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, bb = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return pb.test(n) ? n : null;
}, wb = (t) => t.replace(/\/+$/, ""), xb = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), pc = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.startsWith("0x") ? t.slice(2) : t;
  if (!e || e.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(e))
    return null;
  let n = "";
  for (let r = 0; r < e.length; r += 2) {
    const s = Number.parseInt(e.slice(r, r + 2), 16);
    if (s < 32 || s > 126)
      return null;
    n += String.fromCharCode(s);
  }
  return n;
}, Ue = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, yb = (t) => {
  var a, f;
  let e;
  try {
    e = Te(Ep(t));
  } catch {
    return null;
  }
  const n = Ue(e);
  if (!n || n.success === !1)
    return null;
  const r = Ue(n.value), s = Ue(r == null ? void 0 : r.value), o = Ue(s == null ? void 0 : s.value);
  if (!o)
    return null;
  const i = pc((a = Ue(o.name)) == null ? void 0 : a.value), c = pc((f = Ue(o.namespace)) == null ? void 0 : f.value);
  return !i || !c ? null : bb(`${i}.${c}`);
}, mb = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${wb(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [Ap(z2(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const o = await s.json();
  return !(o != null && o.okay) || typeof o.result != "string" ? null : yb(o.result);
}, Sb = async (t) => {
  const e = t.address.trim();
  if (!ze(e))
    return null;
  const n = gb(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of Qp(t.network))
    try {
      return await mb({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (o) {
      r = o;
    }
  return ub("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: xb(r)
  }), null;
};
function Ab(t, e, n = {}) {
  const r = n.retryAfterMs ?? 3e4, s = n.now ?? Date.now, o = /* @__PURE__ */ new Map(), i = (c, a) => {
    a.pending = !0, a.failedAt = void 0, Promise.resolve().then(() => t(c)).then((f) => {
      a.pending = !1, f && (a.name = f, e());
    }).catch(() => {
      a.pending = !1, a.failedAt = s();
    });
  };
  return {
    get(c) {
      if (!c) return null;
      let a = o.get(c);
      return a ? !a.pending && a.name === null && a.failedAt !== void 0 && s() - a.failedAt >= r && i(c, a) : (a = { name: null, pending: !1 }, o.set(c, a), i(c, a)), a.name;
    }
  };
}
const Hr = Gp({ appName: "Xtrata Radio", appIcon: "/favicon.svg" }), bc = document.getElementById("radio-wallet-address"), Cs = document.getElementById("radio-wallet-connect"), Hs = document.getElementById("radio-wallet-disconnect"), wc = document.getElementById("radio-wallet-message");
let me = !1, xc;
const Eb = Ab((t) => Sb({ address: t, network: "mainnet" }), () => ve()), Zl = () => document.documentElement.dataset.pppSolo;
function ve() {
  const t = Hr.getSession(), e = t.isConnected && !!t.address, n = e ? void 0 : Zl();
  bc.textContent = e ? Eb.get(t.network === "mainnet" ? t.address : void 0) ?? t.address : n ? n === "new" ? "No wallet needed" : "Listening wallet · " + n : "Wallet not connected", bc.title = e ? "Connected wallet · " + t.network + " · " + t.address : n ? "A passkey listening wallet on this device. A Stacks wallet is optional." : "", xc !== t.address && (xc = t.address, window.dispatchEvent(new Event("xtrata:wallet-changed"))), Cs.textContent = me ? "Please wait…" : e ? "Switch wallet" : n && n !== "new" ? document.documentElement.dataset.pppWalletInstalled === "1" ? "Use a Stacks wallet instead" : "I have a Stacks wallet" : "Connect wallet", Cs.disabled = me, Hs.hidden = !e, Hs.disabled = me;
}
async function Ql(t) {
  if (!me) {
    me = !0, wc.textContent = "", ve();
    try {
      await t();
    } catch (e) {
      wc.textContent = e instanceof Error ? e.message : "Wallet action failed. Please try again.";
    } finally {
      me = !1, ve();
    }
  }
}
const ql = () => void Ql(() => Hr.connect());
Cs.onclick = async () => {
  if (me) return;
  const t = Hr.getSession(), e = t.isConnected && !!t.address, n = Zl(), r = window.XtrataRadioConnectChooser;
  if (!e && (!n || n === "new") && r) {
    let s = "stacks";
    try {
      s = await r();
    } catch {
      s = "stacks";
    }
    if (s !== "stacks") return;
  }
  ql();
};
window.XtrataRadioConnectStacks = ql;
Hs.onclick = () => void Ql(() => Hr.disconnect());
window.addEventListener("focus", ve);
window.addEventListener("xtrata:ppp-header", ve);
window.addEventListener("storage", (t) => {
  (t.key === null || t.key === "xtrata.v15.1.wallet.session") && ve();
});
ve();
const Ib = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", vb = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), o = /CriOS/.exec(e.userAgent), i = e.userAgent.includes("Mobile");
  return o ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && i === !1;
}, Lb = () => vb() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, _b = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, Mb = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Xl = class {
  constructor(t) {
    S1(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && il(t), this.callback(_r(t));
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
    var r, s, o, i, c, a, f, d, l, g;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (i = (o = t.chromeWebStoreUrl) !== null && o !== void 0 ? o : this.getMobileUrl(t)) !== null && i !== void 0 ? i : t.webUrl : e === "Firefox" ? (a = (c = t.mozillaAddOnsUrl) !== null && c !== void 0 ? c : this.getMobileUrl(t)) !== null && a !== void 0 ? a : t.webUrl : n === "Android" ? (d = (f = t.googlePlayStoreUrl) !== null && f !== void 0 ? f : this.getBrowserUrl(t)) !== null && d !== void 0 ? d : t.webUrl : (g = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && g !== void 0 ? g : this.getMobileUrl(t);
  }
  render() {
    const t = Lb(), e = _b(), n = this.defaultProviders.filter(
      (o) => this.installedProviders.findIndex((i) => i.id === o.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return U("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, U("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), U("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, U("div", { class: "flex flex-col space-y-[10px]" }, U("div", { class: "flex items-center" }, U("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), U("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, U("span", { class: "sr-only" }, "Close popup"), U("img", { src: Ib }))), r ? U("p", null, "Select the wallet you want to connect to.") : U("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && U("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && U("div", { class: "mt-6" }, U("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), U("ul", { class: "space-y-3" }, this.installedProviders.map((o) => U("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, U("div", { class: "aspect-square basis-9 overflow-hidden" }, U("img", { src: o.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), U("div", { class: "flex-1" }, U("div", { class: "text-sm font-medium text-[#242629]" }, o.name), o.webUrl && U("a", { href: o.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(o.webUrl).hostname)), U("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(o.id) }, "Connect"))))), s && U("div", { class: "mt-6" }, r ? U("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : U("div", { class: "mb-5 flex justify-between" }, U("p", { class: "text-sm font-medium" }, "Recommended wallets"), U("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, U("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, U("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), U("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), U("p", null, "What is a wallet? ", U("span", { class: "align-text-bottom text-[9px]" }, "↗")))), U("ul", { class: "space-y-3" }, n.map((o) => U("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, U("div", { class: "aspect-square basis-9 overflow-hidden" }, U("img", { src: o.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), U("div", { class: "flex-1" }, U("div", { class: "text-sm font-medium text-[#242629]" }, o.name), o.webUrl && U("a", { href: o.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(o.webUrl).hostname)), this.getInstallUrl(o, t, e) && U("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(o, t, e), rel: "noopener noreferrer", target: "_blank" }, o.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return n1(this);
  }
};
Xl.style = Mb;
const $b = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Xl
}, Symbol.toStringTag, { value: "Module" }));
