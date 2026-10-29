const jh = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), Xs = "STX_PROVIDER", ca = () => typeof window > "u" ? null : window.localStorage.getItem(Xs), qh = (t) => {
  typeof window < "u" && window.localStorage.setItem(Xs, t);
}, Wh = () => {
  typeof window < "u" && window.localStorage.removeItem(Xs);
};
const Xh = "https://browser.blockstack.org/auth", Zh = {
  "@type": "Person",
  "@context": "http://schema.org"
}, aa = ["store_write"], Yh = "blockstack-session", Jh = {
  logLevel: "debug"
}, Ce = {
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
Object.freeze(Ce);
class sn extends Error {
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
class Qh extends sn {
  constructor(e, n = "") {
    super({ code: Ce.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class lo extends sn {
  constructor(e = "") {
    super({ code: Ce.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Tn extends sn {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Ce.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class uo extends sn {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Ce.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class xs extends sn {
  constructor(e) {
    super({ code: Ce.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class fa extends sn {
  constructor(e) {
    super({ code: Ce.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const bo = ["debug", "info", "warn", "error", "none"], ws = {};
for (let t = 0; t < bo.length; t++) {
  const e = bo[t];
  ws[e] = t;
}
class je {
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
    return ws[Jh.logLevel] <= ws[e];
  }
}
function tl() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function el() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function es(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function nl() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function rl() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function sl(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function Zs(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = rl(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    je.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = sl(s, t.toString(), n);
    throw je.error(i), new Error(i);
  }
  if (r)
    return {};
}
function il(t) {
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
  if (ll(t, Uint8Array))
    return BigInt(`0x${gt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function ol(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Ys(t, e = 8) {
  return (typeof t == "bigint" ? t : il(t)).toString(16).padStart(e * 2, "0");
}
function ha(t, e = 16) {
  const n = Ys(t, e);
  return ht(n);
}
function cl(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const al = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function gt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += al[n];
  return e;
}
function ht(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = ol(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function vn(t) {
  return new TextEncoder().encode(t);
}
function la(t) {
  return new TextDecoder().decode(t);
}
function fl(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function hl(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function go(t) {
  if (t.some(hl))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Gt(...t) {
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
function on(t) {
  return Gt(...t.map((e) => typeof e == "number" ? go([e]) : e instanceof Array ? go(e) : e));
}
function ll(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const ul = "https://api.mainnet.hiro.so", dl = "https://api.testnet.hiro.so", bl = "http://localhost:3999", gl = "https://hub.blockstack.org";
function pl(t) {
  const e = typeof t == "string" ? ht(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function _r(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const xl = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function wl(t, e) {
  const n = {};
  return Object.assign(n, xl, e), await fetch(t, n);
}
function yl(t) {
  let e = wl, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Sl(...t) {
  const { fetchLib: e, middlewares: n } = yl(t);
  return async (s, i) => {
    let o = { url: s, init: i ?? {} };
    for (const f of n)
      typeof f.pre == "function" && (o = await Promise.resolve(f.pre({
        fetch: e,
        ...o
      })) ?? o);
    let c = await e(o.url, o.init);
    for (const f of n)
      typeof f.post == "function" && (c = await Promise.resolve(f.post({
        fetch: e,
        url: o.url,
        init: o.init,
        response: (c == null ? void 0 : c.clone()) ?? c
      })) ?? c);
    return c;
  };
}
class ua {
  constructor(e = aa.slice(), n = ((c) => (c = Zs("location", { returnEmptyObject: !0 })) == null ? void 0 : c.origin)(), r = "", s = "/manifest.json", i = void 0, o = Xh) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function ys(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function ml(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function da(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function El(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ys(t.outputLen), ys(t.blockLen);
}
function Al(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function $l(t, e) {
  da(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const $e = {
  number: ys,
  bool: ml,
  bytes: da,
  hash: El,
  exists: Al,
  output: $l
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ns = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Et = (t, e) => t << 32 - e | t >>> e, vl = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!vl)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Bl(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Js(t) {
  if (typeof t == "string" && (t = Bl(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let ba = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Pe(t) {
  const e = (r) => t().update(Js(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let ga = class extends ba {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, $e.hash(e);
    const r = Js(n);
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
    return $e.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    $e.exists(this), $e.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Lr = (t, e, n) => new ga(t, e).update(n).digest();
Lr.create = (t, e) => new ga(t, e);
function Hl(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), f = r ? 4 : 0, d = r ? 0 : 4;
  t.setUint32(e + f, o, r), t.setUint32(e + d, c, r);
}
let Qs = class extends ba {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ns(this.buffer);
  }
  update(e) {
    $e.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Js(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const f = ns(e);
        for (; s <= i - o; o += s)
          this.process(f, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    $e.exists(this), $e.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let a = o; a < s; a++)
      n[a] = 0;
    Hl(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = ns(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = f / 4, l = this.get();
    if (d > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let a = 0; a < d; a++)
      c.setUint32(4 * a, l[a], i);
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
const _l = (t, e, n) => t & e ^ ~t & n, Ll = (t, e, n) => t & e ^ t & n ^ e & n, Il = new Uint32Array([
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
]), zt = new Uint32Array(64);
let pa = class extends Qs {
  constructor() {
    super(64, 32, 8, !1), this.A = Vt[0] | 0, this.B = Vt[1] | 0, this.C = Vt[2] | 0, this.D = Vt[3] | 0, this.E = Vt[4] | 0, this.F = Vt[5] | 0, this.G = Vt[6] | 0, this.H = Vt[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: o, G: c, H: f } = this;
    return [e, n, r, s, i, o, c, f];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, f) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = c | 0, this.H = f | 0;
  }
  process(e, n) {
    for (let a = 0; a < 16; a++, n += 4)
      zt[a] = e.getUint32(n, !1);
    for (let a = 16; a < 64; a++) {
      const b = zt[a - 15], u = zt[a - 2], p = Et(b, 7) ^ Et(b, 18) ^ b >>> 3, y = Et(u, 17) ^ Et(u, 19) ^ u >>> 10;
      zt[a] = y + zt[a - 7] + p + zt[a - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: f, G: d, H: l } = this;
    for (let a = 0; a < 64; a++) {
      const b = Et(c, 6) ^ Et(c, 11) ^ Et(c, 25), u = l + b + _l(c, f, d) + Il[a] + zt[a] | 0, y = (Et(r, 2) ^ Et(r, 13) ^ Et(r, 22)) + Ll(r, s, i) | 0;
      l = d, d = f, f = c, c = o + u | 0, o = i, i = s, s = r, r = u + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, f = f + this.F | 0, d = d + this.G | 0, l = l + this.H | 0, this.set(r, s, i, o, c, f, d, l);
  }
  roundClean() {
    zt.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Ul = class extends pa {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const We = Pe(() => new pa());
Pe(() => new Ul());
const Ol = {}, xa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ol
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const V = BigInt(0), Z = BigInt(1), pe = BigInt(2), pn = BigInt(3), po = BigInt(8), W = Object.freeze({
  a: V,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Z,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), xo = (t, e) => (t + e / pe) / e, Mn = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = W, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Z * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), c = xo(i * t, e), f = xo(-r * t, e);
    let d = B(t - c * n - f * s, e), l = B(-c * r - f * i, e);
    const a = d > o, b = l > o;
    if (a && (d = e - d), b && (l = e - l), d > o || l > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: a, k1: d, k2neg: b, k2: l };
  }
}, mt = 32, He = 32, wa = 32, ur = mt + 1, dr = 2 * mt + 1;
function wo(t) {
  const { a: e, b: n } = W, r = B(t * t), s = B(r * t);
  return B(s + e * t + n);
}
const Gn = W.a === V;
class ti extends Error {
  constructor(e) {
    super(e);
  }
}
function yo(t) {
  if (!(t instanceof j))
    throw new TypeError("JacobianPoint expected");
}
class j {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof z))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(z.ZERO) ? j.ZERO : new j(e.x, e.y, Z);
  }
  static toAffineBatch(e) {
    const n = kl(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return j.toAffineBatch(e).map(j.fromAffine);
  }
  equals(e) {
    yo(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: c } = e, f = B(s * s), d = B(c * c), l = B(n * d), a = B(i * f), b = B(B(r * c) * d), u = B(B(o * s) * f);
    return l === a && b === u;
  }
  negate() {
    return new j(this.x, B(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = B(e * e), i = B(n * n), o = B(i * i), c = e + i, f = B(pe * (B(c * c) - s - o)), d = B(pn * s), l = B(d * d), a = B(l - pe * f), b = B(d * (f - a) - po * o), u = B(pe * n * r);
    return new j(a, b, u);
  }
  add(e) {
    yo(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: c } = e;
    if (i === V || o === V)
      return this;
    if (n === V || r === V)
      return e;
    const f = B(s * s), d = B(c * c), l = B(n * d), a = B(i * f), b = B(B(r * c) * d), u = B(B(o * s) * f), p = B(a - l), y = B(u - b);
    if (p === V)
      return y === V ? this.double() : j.ZERO;
    const A = B(p * p), H = B(p * A), _ = B(l * A), x = B(y * y - H - pe * _), v = B(y * (_ - x) - b * H), S = B(s * c * p);
    return new j(x, v, S);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = j.ZERO;
    if (typeof e == "bigint" && e === V)
      return n;
    let r = Eo(e);
    if (r === Z)
      return this;
    if (!Gn) {
      let a = n, b = this;
      for (; r > V; )
        r & Z && (a = a.add(b)), b = b.double(), r >>= Z;
      return a;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: c } = Mn.splitScalar(r), f = n, d = n, l = this;
    for (; i > V || c > V; )
      i & Z && (f = f.add(l)), c & Z && (d = d.add(l)), l = l.double(), i >>= Z, c >>= Z;
    return s && (f = f.negate()), o && (d = d.negate()), d = new j(B(d.x * Mn.beta), d.y, d.z), f.add(d);
  }
  precomputeWindow(e) {
    const n = Gn ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(j.BASE) && (n = z.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Ss.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = j.normalizeZ(s), Ss.set(n, s)));
    let i = j.ZERO, o = j.BASE;
    const c = 1 + (Gn ? 128 / r : 256 / r), f = 2 ** (r - 1), d = BigInt(2 ** r - 1), l = 2 ** r, a = BigInt(r);
    for (let b = 0; b < c; b++) {
      const u = b * f;
      let p = Number(e & d);
      e >>= a, p > f && (p -= l, e += Z);
      const y = u, A = u + Math.abs(p) - 1, H = b % 2 !== 0, _ = p < 0;
      p === 0 ? o = o.add(Kn(H, s[y])) : i = i.add(Kn(_, s[A]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = Eo(e), s, i;
    if (Gn) {
      const { k1neg: o, k1: c, k2neg: f, k2: d } = Mn.splitScalar(r);
      let { p: l, f: a } = this.wNAF(c, n), { p: b, f: u } = this.wNAF(d, n);
      l = Kn(o, l), b = Kn(f, b), b = new j(B(b.x * Mn.beta), b.y, b.z), s = l.add(b), i = a.add(u);
    } else {
      const { p: o, f: c } = this.wNAF(r, n);
      s = o, i = c;
    }
    return j.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(j.ZERO);
    e == null && (e = i ? po : cn(s));
    const o = e, c = B(o * o), f = B(c * o), d = B(n * c), l = B(r * f), a = B(s * o);
    if (i)
      return z.ZERO;
    if (a !== Z)
      throw new Error("invZ was invalid");
    return new z(d, l);
  }
}
j.BASE = new j(W.Gx, W.Gy, Z);
j.ZERO = new j(V, Z, V);
function Kn(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Ss = /* @__PURE__ */ new WeakMap();
class z {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Ss.delete(this);
  }
  hasEvenY() {
    return this.y % pe === V;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = ut(n ? e : e.subarray(1));
    if (!cr(r))
      throw new Error("Point is not on curve");
    const s = wo(r);
    let i = Nl(s);
    const o = (i & Z) === Z;
    n ? o && (i = B(-i)) : (e[0] & 1) === 1 !== o && (i = B(-i));
    const c = new z(r, i);
    return c.assertValidity(), c;
  }
  static fromUncompressedHex(e) {
    const n = ut(e.subarray(1, mt + 1)), r = ut(e.subarray(mt + 1, mt * 2 + 1)), s = new z(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Lt(e), r = n.length, s = n[0];
    if (r === mt)
      return this.fromCompressedHex(n);
    if (r === ur && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === dr && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${ur} compressed bytes or ${dr} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return z.BASE.multiply(_e(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = ma(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = ei(Lt(e)), { n: c } = W, f = r === 2 || r === 3 ? s + c : s, d = cn(f, c), l = B(-o * d, c), a = B(i * d, c), b = r & 1 ? "03" : "02", u = z.fromHex(b + xe(f)), p = z.BASE.multiplyAndAddUnsafe(u, l, a);
    if (!p)
      throw new Error("Cannot recover signature: point at infinify");
    return p.assertValidity(), p;
  }
  toRawBytes(e = !1) {
    return we(this.toHex(e));
  }
  toHex(e = !1) {
    const n = xe(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${xe(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!cr(n) || !cr(r))
      throw new Error(e);
    const s = B(r * r), i = wo(n);
    if (B(s - i) !== V)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new z(this.x, B(-this.y));
  }
  double() {
    return j.fromAffine(this).double().toAffine();
  }
  add(e) {
    return j.fromAffine(this).add(j.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return j.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = j.fromAffine(this), i = n === V || n === Z || this !== z.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = j.fromAffine(e).multiplyUnsafe(r), c = i.add(o);
    return c.equals(j.ZERO) ? void 0 : c.toAffine();
  }
}
z.BASE = new z(W.Gx, W.Gy);
z.ZERO = new z(V, V);
function So(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function mo(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Xe(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: ut(n), left: t.subarray(e + 2) };
}
function Cl(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Xe(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = mo(t.subarray(2)), { data: r, left: s } = mo(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Xe(s)}`);
  return { r: e, s: r };
}
class Mt {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? Xe(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Mt(br(s.slice(0, 64)), br(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Cl(n ? e : we(e));
    return new Mt(r, s);
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
    const e = W.n >> Z;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Mt(this.r, B(-this.s, W.n)) : this;
  }
  toDERRawBytes() {
    return we(this.toDERHex());
  }
  toDERHex() {
    const e = So(bn(this.s)), n = So(bn(this.r)), r = e.length / 2, s = n.length / 2, i = bn(r), o = bn(s);
    return `30${bn(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return we(this.toCompactHex());
  }
  toCompactHex() {
    return xe(this.r) + xe(this.s);
  }
}
function ge(...t) {
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
const Pl = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Xe(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Pl[t[n]];
  return e;
}
const Dl = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function xe(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(V <= t && t < Dl))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Ze(t) {
  const e = we(xe(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function bn(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function br(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function we(t) {
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
function ut(t) {
  return br(Xe(t));
}
function Lt(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : we(t);
}
function Eo(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Ye(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function B(t, e = W.P) {
  const n = t % e;
  return n >= V ? n : e + n;
}
function dt(t, e) {
  const { P: n } = W;
  let r = t;
  for (; e-- > V; )
    r *= r, r %= n;
  return r;
}
function Nl(t) {
  const { P: e } = W, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), c = BigInt(88), f = t * t * t % e, d = f * f * t % e, l = dt(d, pn) * d % e, a = dt(l, pn) * d % e, b = dt(a, pe) * f % e, u = dt(b, r) * b % e, p = dt(u, s) * u % e, y = dt(p, o) * p % e, A = dt(y, c) * y % e, H = dt(A, o) * p % e, _ = dt(H, pn) * d % e, x = dt(_, i) * u % e, v = dt(x, n) * f % e, S = dt(v, pe);
  if (S * S % e !== t)
    throw new Error("Cannot find square root");
  return S;
}
function cn(t, e = W.P) {
  if (t === V || e <= V)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = B(t, e), r = e, s = V, i = Z;
  for (; n !== V; ) {
    const c = r / n, f = r % n, d = s - i * c;
    r = n, n = f, s = i, i = d;
  }
  if (r !== Z)
    throw new Error("invert: does not exist");
  return B(s, e);
}
function kl(t, e = W.P) {
  const n = new Array(t.length), r = t.reduce((i, o, c) => o === V ? i : (n[c] = i, B(i * o, e)), Z), s = cn(r, e);
  return t.reduceRight((i, o, c) => o === V ? i : (n[c] = B(i * n[c], e), B(i * o, e)), s), n;
}
function Fl(t) {
  const e = t.length * 8 - He * 8, n = ut(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function ei(t, e = !1) {
  const n = Fl(t);
  if (e)
    return n;
  const { n: r } = W;
  return n >= r ? n - r : n;
}
let qe, xn;
class ya {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return Q.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return xn(this.k, ...e);
  }
  checkSync() {
    if (typeof xn != "function")
      throw new ti("hmacSha256Sync needs to be set");
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
    return ge(...n);
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
    return ge(...n);
  }
}
function Ye(t) {
  return V < t && t < W.n;
}
function cr(t) {
  return V < t && t < W.P;
}
function Sa(t, e, n, r = !0) {
  const { n: s } = W, i = ei(t, !0);
  if (!Ye(i))
    return;
  const o = cn(i, s), c = z.BASE.multiply(i), f = B(c.x, s);
  if (f === V)
    return;
  const d = B(o * B(e + n * f, s), s);
  if (d === V)
    return;
  let l = new Mt(f, d), a = (c.x === l.r ? 0 : 2) | Number(c.y & Z);
  return r && l.hasHighS() && (l = l.normalizeS(), a ^= 1), { sig: l, recovery: a };
}
function _e(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * He)
      throw new Error("Expected 32 bytes of private key");
    e = br(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== He)
      throw new Error("Expected 32 bytes of private key");
    e = ut(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Ye(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function ni(t) {
  return t instanceof z ? (t.assertValidity(), t) : z.fromHex(t);
}
function ma(t) {
  if (t instanceof Mt)
    return t.assertValidity(), t;
  try {
    return Mt.fromDER(t);
  } catch {
    return Mt.fromCompact(t);
  }
}
function ri(t, e = !1) {
  return z.fromPrivateKey(t).toRawBytes(e);
}
function Tl(t, e, n, r = !1) {
  return z.fromSignature(t, e, n).toRawBytes(r);
}
function Ao(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === ur || r === dr : n ? r === ur * 2 || r === dr * 2 : t instanceof z;
}
function si(t, e, n = !1) {
  if (Ao(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Ao(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = ni(e);
  return r.assertValidity(), r.multiply(_e(t)).toRawBytes(n);
}
function Ea(t) {
  const e = t.length > mt ? t.slice(0, mt) : t;
  return ut(e);
}
function Ml(t) {
  const e = Ea(t), n = B(e, W.n);
  return Aa(n < V ? e : n);
}
function Aa(t) {
  return Ze(t);
}
function $a(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Lt(t), s = _e(e), i = [Aa(s), Ml(r)];
  if (n != null) {
    n === !0 && (n = Q.randomBytes(mt));
    const f = Lt(n);
    if (f.length !== mt)
      throw new Error(`sign: Expected ${mt} bytes of extra data`);
    i.push(f);
  }
  const o = ge(...i), c = Ea(r);
  return { seed: o, m: c, d: s };
}
function va(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function Gl(t, e, n = {}) {
  const { seed: r, m: s, d: i } = $a(t, e, n.extraEntropy), o = new ya(wa, He);
  await o.reseed(r);
  let c;
  for (; !(c = Sa(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return va(c, n);
}
function Ba(t, e, n = {}) {
  const { seed: r, m: s, d: i } = $a(t, e, n.extraEntropy), o = new ya(wa, He);
  o.reseedSync(r);
  let c;
  for (; !(c = Sa(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return va(c, n);
}
const Kl = { strict: !0 };
function Rl(t, e, n, r = Kl) {
  let s;
  try {
    s = ma(t), e = Lt(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const c = ei(e);
  let f;
  try {
    f = ni(n);
  } catch {
    return !1;
  }
  const { n: d } = W, l = cn(o, d), a = B(c * l, d), b = B(i * l, d), u = z.BASE.multiplyAndAddUnsafe(f, a, b);
  return u ? B(u.x, d) === i : !1;
}
function gr(t) {
  return B(ut(t), W.n);
}
class Je {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Lt(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = ut(n.subarray(0, 32)), s = ut(n.subarray(32, 64));
    return new Je(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!cr(e) || !Ye(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return xe(this.r) + xe(this.s);
  }
  toRawBytes() {
    return we(this.toHex());
  }
}
function Vl(t) {
  return z.fromPrivateKey(t).toRawX();
}
class Ha {
  constructor(e, n, r = Q.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Lt(e);
    const { x: s, scalar: i } = this.getScalar(_e(n));
    if (this.px = s, this.d = i, this.rand = Lt(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = z.fromPrivateKey(e), r = n.hasEvenY() ? e : W.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Ze(e ^ ut(n));
  }
  finalizeNonce(e) {
    const n = B(ut(e), W.n);
    if (n === V)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new Je(e.x, B(n + r * s, W.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = Q.taggedHash, o = this.initNonce(n, await i(be.aux, s)), { R: c, rx: f, k: d } = this.finalizeNonce(await i(be.nonce, o, r, e)), l = gr(await i(be.challenge, f, r, e)), a = this.finalizeSig(c, d, l, n);
    return await Ia(a, e, r) || this.error(), a;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = Q.taggedHashSync, o = this.initNonce(n, i(be.aux, s)), { R: c, rx: f, k: d } = this.finalizeNonce(i(be.nonce, o, r, e)), l = gr(i(be.challenge, f, r, e)), a = this.finalizeSig(c, d, l, n);
    return Ua(a, e, r) || this.error(), a;
  }
}
async function zl(t, e, n) {
  return new Ha(t, e, n).calc();
}
function jl(t, e, n) {
  return new Ha(t, e, n).calcSync();
}
function _a(t, e, n) {
  const r = t instanceof Je, s = r ? t : Je.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Lt(e),
    P: ni(n)
  };
}
function La(t, e, n, r) {
  const s = z.BASE.multiplyAndAddUnsafe(e, _e(n), B(-r, W.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Ia(t, e, n) {
  try {
    const { r, s, m: i, P: o } = _a(t, e, n), c = gr(await Q.taggedHash(be.challenge, Ze(r), o.toRawX(), i));
    return La(r, o, s, c);
  } catch {
    return !1;
  }
}
function Ua(t, e, n) {
  try {
    const { r, s, m: i, P: o } = _a(t, e, n), c = gr(Q.taggedHashSync(be.challenge, Ze(r), o.toRawX(), i));
    return La(r, o, s, c);
  } catch (r) {
    if (r instanceof ti)
      throw r;
    return !1;
  }
}
const ql = {
  Signature: Je,
  getPublicKey: Vl,
  sign: zl,
  verify: Ia,
  signSync: jl,
  verifySync: Ua
};
z.BASE._setWindowSize(8);
const ft = {
  node: xa,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, be = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Rn = {}, Q = {
  bytesToHex: Xe,
  hexToBytes: we,
  concatBytes: ge,
  mod: B,
  invert: cn,
  isValidPrivateKey(t) {
    try {
      return _e(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Ze,
  _normalizePrivateKey: _e,
  hashToPrivateKey: (t) => {
    t = Lt(t);
    const e = He + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = B(ut(t), W.n - Z) + Z;
    return Ze(n);
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
  randomPrivateKey: () => Q.hashToPrivateKey(Q.randomBytes(He + 8)),
  precompute(t = 8, e = z.BASE) {
    const n = e === z.BASE ? e : new z(e.x, e.y);
    return n._setWindowSize(t), n.multiply(pn), n;
  },
  sha256: async (...t) => {
    if (ft.web) {
      const e = await ft.web.subtle.digest("SHA-256", ge(...t));
      return new Uint8Array(e);
    } else if (ft.node) {
      const { createHash: e } = ft.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (ft.web) {
      const n = await ft.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = ge(...e), s = await ft.web.subtle.sign("HMAC", n, r);
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
    let n = Rn[t];
    if (n === void 0) {
      const r = await Q.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = ge(r, r), Rn[t] = n;
    }
    return Q.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof qe != "function")
      throw new ti("sha256Sync is undefined, you need to set it");
    let n = Rn[t];
    if (n === void 0) {
      const r = qe(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = ge(r, r), Rn[t] = n;
    }
    return qe(n, ...e);
  },
  _JacobianPoint: j
};
Object.defineProperties(Q, {
  sha256Sync: {
    configurable: !1,
    get() {
      return qe;
    },
    set(t) {
      qe || (qe = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return xn;
    },
    set(t) {
      xn || (xn = t);
    }
  }
});
const Wl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: W,
  Point: z,
  Signature: Mt,
  getPublicKey: ri,
  getSharedSecret: si,
  recoverPublicKey: Tl,
  schnorr: ql,
  sign: Gl,
  signSync: Ba,
  utils: Q,
  verify: Rl
}, Symbol.toStringTag, { value: "Module" }));
var it = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Xl(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Bn(t) {
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
var Hn = {};
Hn.byteLength = tu;
var Zl = Hn.toByteArray = nu, Yl = Hn.fromByteArray = iu, Ht = [], bt = [], Jl = typeof Uint8Array < "u" ? Uint8Array : Array, rs = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Ve = 0, Ql = rs.length; Ve < Ql; ++Ve)
  Ht[Ve] = rs[Ve], bt[rs.charCodeAt(Ve)] = Ve;
bt[45] = 62;
bt[95] = 63;
function Oa(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function tu(t) {
  var e = Oa(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function eu(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function nu(t) {
  var e, n = Oa(t), r = n[0], s = n[1], i = new Jl(eu(t, r, s)), o = 0, c = s > 0 ? r - 4 : r, f;
  for (f = 0; f < c; f += 4)
    e = bt[t.charCodeAt(f)] << 18 | bt[t.charCodeAt(f + 1)] << 12 | bt[t.charCodeAt(f + 2)] << 6 | bt[t.charCodeAt(f + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = bt[t.charCodeAt(f)] << 2 | bt[t.charCodeAt(f + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = bt[t.charCodeAt(f)] << 10 | bt[t.charCodeAt(f + 1)] << 4 | bt[t.charCodeAt(f + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function ru(t) {
  return Ht[t >> 18 & 63] + Ht[t >> 12 & 63] + Ht[t >> 6 & 63] + Ht[t & 63];
}
function su(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(ru(r));
  return s.join("");
}
function iu(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, c = n - r; o < c; o += i)
    s.push(su(t, o, o + i > c ? c : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    Ht[e >> 2] + Ht[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    Ht[e >> 10] + Ht[e >> 4 & 63] + Ht[e << 2 & 63] + "="
  )), s.join("");
}
function ou() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const cu = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function au() {
  if (ou())
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
    throw new Error(cu);
  }
}
class fu {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(Gt(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(Gt(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class hu {
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
    const c = await this.subtleCrypto.importKey("raw", n, { name: i, length: o }, !1, ["encrypt"]), f = await this.subtleCrypto.encrypt({ name: i, iv: r }, c, s);
    return new Uint8Array(f);
  }
  async decrypt(e, n, r, s) {
    let i, o;
    if (e === "aes-128-cbc")
      i = "AES-CBC", o = 128;
    else if (e === "aes-256-cbc")
      i = "AES-CBC", o = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const c = await this.subtleCrypto.importKey("raw", n, { name: i, length: o }, !1, ["decrypt"]), f = await this.subtleCrypto.decrypt({ name: i, iv: r }, c, s);
    return new Uint8Array(f);
  }
}
async function Ca() {
  const t = await au();
  return t.name === "subtleCrypto" ? new hu(t.lib) : new fu(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function lu(t) {
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
  var o = t.length, c = t.charAt(0), f = Math.log(o) / Math.log(256), d = Math.log(256) / Math.log(o);
  function l(u) {
    if (u instanceof Uint8Array || (ArrayBuffer.isView(u) ? u = new Uint8Array(u.buffer, u.byteOffset, u.byteLength) : Array.isArray(u) && (u = Uint8Array.from(u))), !(u instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (u.length === 0)
      return "";
    for (var p = 0, y = 0, A = 0, H = u.length; A !== H && u[A] === 0; )
      A++, p++;
    for (var _ = (H - A) * d + 1 >>> 0, x = new Uint8Array(_); A !== H; ) {
      for (var v = u[A], S = 0, C = _ - 1; (v !== 0 || S < y) && C !== -1; C--, S++)
        v += 256 * x[C] >>> 0, x[C] = v % o >>> 0, v = v / o >>> 0;
      if (v !== 0)
        throw new Error("Non-zero carry");
      y = S, A++;
    }
    for (var N = _ - y; N !== _ && x[N] === 0; )
      N++;
    for (var I = c.repeat(p); N < _; ++N)
      I += t.charAt(x[N]);
    return I;
  }
  function a(u) {
    if (typeof u != "string")
      throw new TypeError("Expected String");
    if (u.length === 0)
      return new Uint8Array();
    for (var p = 0, y = 0, A = 0; u[p] === c; )
      y++, p++;
    for (var H = (u.length - p) * f + 1 >>> 0, _ = new Uint8Array(H); u[p]; ) {
      var x = u.charCodeAt(p);
      if (x > 255)
        return;
      var v = e[x];
      if (v === 255)
        return;
      for (var S = 0, C = H - 1; (v !== 0 || S < A) && C !== -1; C--, S++)
        v += o * _[C] >>> 0, _[C] = v % 256 >>> 0, v = v / 256 >>> 0;
      if (v !== 0)
        throw new Error("Non-zero carry");
      A = S, p++;
    }
    for (var N = H - A; N !== H && _[N] === 0; )
      N++;
    for (var I = new Uint8Array(y + (H - N)), U = y; N !== H; )
      I[U++] = _[N++];
    return I;
  }
  function b(u) {
    var p = a(u);
    if (p)
      return p;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: l,
    decodeUnsafe: a,
    decode: b
  };
}
var Pa = lu;
const uu = Pa, du = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var bu = uu(du);
const gu = /* @__PURE__ */ Xl(bu), pu = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Da = Uint8Array.from({ length: 16 }, (t, e) => e), xu = Da.map((t) => (9 * t + 5) % 16);
let ii = [Da], oi = [xu];
for (let t = 0; t < 4; t++)
  for (let e of [ii, oi])
    e.push(e[t].map((n) => pu[n]));
const Na = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), wu = ii.map((t, e) => t.map((n) => Na[e][n])), yu = oi.map((t, e) => t.map((n) => Na[e][n])), Su = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), mu = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Vn = (t, e) => t << e | t >>> 32 - e;
function $o(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const zn = new Uint32Array(16);
let Eu = class extends Qs {
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
    for (let u = 0; u < 16; u++, n += 4)
      zn[u] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, f = c, d = this.h3 | 0, l = d, a = this.h4 | 0, b = a;
    for (let u = 0; u < 5; u++) {
      const p = 4 - u, y = Su[u], A = mu[u], H = ii[u], _ = oi[u], x = wu[u], v = yu[u];
      for (let S = 0; S < 16; S++) {
        const C = Vn(r + $o(u, i, c, d) + zn[H[S]] + y, x[S]) + a | 0;
        r = a, a = d, d = Vn(c, 10) | 0, c = i, i = C;
      }
      for (let S = 0; S < 16; S++) {
        const C = Vn(s + $o(p, o, f, l) + zn[_[S]] + A, v[S]) + b | 0;
        s = b, b = l, l = Vn(f, 10) | 0, f = o, o = C;
      }
    }
    this.set(this.h1 + c + l | 0, this.h2 + d + b | 0, this.h3 + a + s | 0, this.h4 + r + o | 0, this.h0 + i + f | 0);
  }
  roundClean() {
    zn.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Au = Pe(() => new Eu());
function $u(t) {
  return Au(t);
}
const jn = BigInt(2 ** 32 - 1), ms = BigInt(32);
function ka(t, e = !1) {
  return e ? { h: Number(t & jn), l: Number(t >> ms & jn) } : { h: Number(t >> ms & jn) | 0, l: Number(t & jn) | 0 };
}
function vu(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = ka(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Bu = (t, e) => BigInt(t >>> 0) << ms | BigInt(e >>> 0), Hu = (t, e, n) => t >>> n, _u = (t, e, n) => t << 32 - n | e >>> n, Lu = (t, e, n) => t >>> n | e << 32 - n, Iu = (t, e, n) => t << 32 - n | e >>> n, Uu = (t, e, n) => t << 64 - n | e >>> n - 32, Ou = (t, e, n) => t >>> n - 32 | e << 64 - n, Cu = (t, e) => e, Pu = (t, e) => t, Du = (t, e, n) => t << n | e >>> 32 - n, Nu = (t, e, n) => e << n | t >>> 32 - n, ku = (t, e, n) => e << n - 32 | t >>> 64 - n, Fu = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Tu(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Mu = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Gu = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Ku = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Ru = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Vu = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), zu = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, k = {
  fromBig: ka,
  split: vu,
  toBig: Bu,
  shrSH: Hu,
  shrSL: _u,
  rotrSH: Lu,
  rotrSL: Iu,
  rotrBH: Uu,
  rotrBL: Ou,
  rotr32H: Cu,
  rotr32L: Pu,
  rotlSH: Du,
  rotlSL: Nu,
  rotlBH: ku,
  rotlBL: Fu,
  add: Tu,
  add3L: Mu,
  add3H: Gu,
  add4L: Ku,
  add4H: Ru,
  add5H: zu,
  add5L: Vu
}, [ju, qu] = k.split([
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
].map((t) => BigInt(t))), jt = new Uint32Array(80), qt = new Uint32Array(80);
let Ir = class extends Qs {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: f, Eh: d, El: l, Fh: a, Fl: b, Gh: u, Gl: p, Hh: y, Hl: A } = this;
    return [e, n, r, s, i, o, c, f, d, l, a, b, u, p, y, A];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, f, d, l, a, b, u, p, y, A) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = f | 0, this.Eh = d | 0, this.El = l | 0, this.Fh = a | 0, this.Fl = b | 0, this.Gh = u | 0, this.Gl = p | 0, this.Hh = y | 0, this.Hl = A | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      jt[x] = e.getUint32(n), qt[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const v = jt[x - 15] | 0, S = qt[x - 15] | 0, C = k.rotrSH(v, S, 1) ^ k.rotrSH(v, S, 8) ^ k.shrSH(v, S, 7), N = k.rotrSL(v, S, 1) ^ k.rotrSL(v, S, 8) ^ k.shrSL(v, S, 7), I = jt[x - 2] | 0, U = qt[x - 2] | 0, g = k.rotrSH(I, U, 19) ^ k.rotrBH(I, U, 61) ^ k.shrSH(I, U, 6), m = k.rotrSL(I, U, 19) ^ k.rotrBL(I, U, 61) ^ k.shrSL(I, U, 6), L = k.add4L(N, m, qt[x - 7], qt[x - 16]), D = k.add4H(L, C, g, jt[x - 7], jt[x - 16]);
      jt[x] = D | 0, qt[x] = L | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: f, Dh: d, Dl: l, Eh: a, El: b, Fh: u, Fl: p, Gh: y, Gl: A, Hh: H, Hl: _ } = this;
    for (let x = 0; x < 80; x++) {
      const v = k.rotrSH(a, b, 14) ^ k.rotrSH(a, b, 18) ^ k.rotrBH(a, b, 41), S = k.rotrSL(a, b, 14) ^ k.rotrSL(a, b, 18) ^ k.rotrBL(a, b, 41), C = a & u ^ ~a & y, N = b & p ^ ~b & A, I = k.add5L(_, S, N, qu[x], qt[x]), U = k.add5H(I, H, v, C, ju[x], jt[x]), g = I | 0, m = k.rotrSH(r, s, 28) ^ k.rotrBH(r, s, 34) ^ k.rotrBH(r, s, 39), L = k.rotrSL(r, s, 28) ^ k.rotrBL(r, s, 34) ^ k.rotrBL(r, s, 39), D = r & i ^ r & c ^ i & c, K = s & o ^ s & f ^ o & f;
      H = y | 0, _ = A | 0, y = u | 0, A = p | 0, u = a | 0, p = b | 0, { h: a, l: b } = k.add(d | 0, l | 0, U | 0, g | 0), d = c | 0, l = f | 0, c = i | 0, f = o | 0, i = r | 0, o = s | 0;
      const P = k.add3L(g, L, K);
      r = k.add3H(P, U, m, D), s = P | 0;
    }
    ({ h: r, l: s } = k.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = k.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l: f } = k.add(this.Ch | 0, this.Cl | 0, c | 0, f | 0), { h: d, l } = k.add(this.Dh | 0, this.Dl | 0, d | 0, l | 0), { h: a, l: b } = k.add(this.Eh | 0, this.El | 0, a | 0, b | 0), { h: u, l: p } = k.add(this.Fh | 0, this.Fl | 0, u | 0, p | 0), { h: y, l: A } = k.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: H, l: _ } = k.add(this.Hh | 0, this.Hl | 0, H | 0, _ | 0), this.set(r, s, i, o, c, f, d, l, a, b, u, p, y, A, H, _);
  }
  roundClean() {
    jt.fill(0), qt.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Wu = class extends Ir {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Xu = class extends Ir {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Zu = class extends Ir {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const Yu = Pe(() => new Ir());
Pe(() => new Wu());
Pe(() => new Xu());
Pe(() => new Zu());
function Fa(t) {
  return We(t);
}
function Ju(t) {
  return Yu(t);
}
const Qu = 0;
Q.hmacSha256Sync = (t, ...e) => {
  const n = Lr.create(We, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function td() {
  return gt(Q.randomPrivateKey());
}
function ed(t) {
  const e = We(We(t));
  return gu.encode(Gt(t, e).slice(0, t.length + 4));
}
function nd(t, e) {
  return ed(Gt(new Uint8Array([t]), e.slice(0, 20)));
}
function Ta(t, e = Qu) {
  const n = typeof t == "string" ? ht(t) : t, r = $u(Fa(n));
  return nd(e, r);
}
function Ma(t) {
  const e = pl(t);
  return gt(ri(e.slice(0, 32), !0));
}
Q.hmacSha256Sync = (t, ...e) => {
  const n = Lr.create(We, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var pr;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(pr || (pr = {}));
async function rd(t, e, n) {
  return await (await Ca()).encrypt("aes-256-cbc", e, t, n);
}
async function sd(t, e, n) {
  return await (await Ca()).decrypt("aes-256-cbc", e, t, n);
}
function Ga(t, e) {
  return Lr(We, t, e);
}
function id(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function Ka(t) {
  const e = Ju(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function od(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function cd(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: pr.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: pr.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !od(t))
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
async function ad(t, e, n, r) {
  const s = cd(t);
  if (!s.result)
    throw s;
  const i = Q.randomPrivateKey(), o = ri(i, !0);
  let c = si(i, t, !0);
  c = c.slice(1);
  const f = Ka(c), d = Q.randomBytes(16), l = await rd(d, f.encryptionKey, e), a = Gt(d, o, l), b = Ga(f.hmacKey, a);
  let u;
  if (!r || r === "hex")
    u = gt(l);
  else if (r === "base64")
    u = Yl(l);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const p = {
    iv: gt(d),
    ephemeralPK: gt(o),
    cipherText: u,
    mac: gt(b),
    wasString: n
  };
  return r && r !== "hex" && (p.cipherTextEncoding = r), p;
}
async function Ra(t, e) {
  if (!e.ephemeralPK)
    throw new uo("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = si(t, n, !0);
  r = r.slice(1);
  const s = Ka(r), i = ht(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = ht(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = Zl(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const c = Gt(i, ht(n), o), f = Ga(s.hmacKey, c), d = ht(e.mac);
  if (!id(d, f))
    throw new uo("Decryption failed: failure in MAC check");
  const l = await sd(i, s.encryptionKey, o);
  return e.wasString ? la(l) : l;
}
function fd(t, e) {
  const n = typeof e == "string" ? vn(e) : e, r = Ma(t), s = Fa(n), i = Ba(s, t);
  return {
    signature: gt(i),
    publicKey: r
  };
}
async function hd(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = Ma(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? vn(t) : t, o = await ad(n.publicKey, i, s, n.cipherTextEncoding);
  let c = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const f = fd(r, c), d = {
      signature: f.signature,
      publicKey: f.publicKey,
      cipherText: c
    };
    c = JSON.stringify(d);
  }
  return c;
}
function ld(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return Ra(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var ot = {}, Qe = {}, st = {};
Object.defineProperty(st, "__esModule", { value: !0 });
st.decode = st.encode = st.unescape = st.escape = st.pad = void 0;
const Va = Hn;
function ci(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
st.pad = ci;
function za(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
st.escape = za;
function ja(t) {
  return ci(t).replace(/-/g, "+").replace(/_/g, "/");
}
st.unescape = ja;
function ud(t) {
  return za((0, Va.fromByteArray)(new TextEncoder().encode(t)));
}
st.encode = ud;
function dd(t) {
  return new TextDecoder().decode((0, Va.toByteArray)(ci(ja(t))));
}
st.decode = dd;
var Ur = {}, Or = {};
const ze = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function qa(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Es(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Se(t, ...e) {
  if (!qa(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function Wa(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Es(t.outputLen), Es(t.blockLen);
}
function Sn(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Xa(t, e) {
  Se(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function bd(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function gd(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function mn(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function ar(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function pt(t, e) {
  return t << 32 - e | t >>> e;
}
function pd(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const ai = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function fi(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const Za = ai ? (t) => t : (t) => fi(t), xd = Za;
function Ya(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = fi(t[e]);
  return t;
}
const wd = ai ? (t) => t : Ya, Ja = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", yd = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Sd(t) {
  if (Se(t), Ja)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += yd[t[n]];
  return e;
}
const Nt = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function vo(t) {
  if (t >= Nt._0 && t <= Nt._9)
    return t - Nt._0;
  if (t >= Nt.A && t <= Nt.F)
    return t - (Nt.A - 10);
  if (t >= Nt.a && t <= Nt.f)
    return t - (Nt.a - 10);
}
function md(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (Ja)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = vo(t.charCodeAt(i)), c = vo(t.charCodeAt(i + 1));
    if (o === void 0 || c === void 0) {
      const f = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + f + '" at index ' + i);
    }
    r[s] = o * 16 + c;
  }
  return r;
}
const Qa = async () => {
};
async function Ed(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await Qa(), r += i);
  }
}
function hi(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function Ad(t) {
  return new TextDecoder().decode(t);
}
function an(t) {
  return typeof t == "string" && (t = hi(t)), Se(t), t;
}
function $d(t) {
  return typeof t == "string" && (t = hi(t)), Se(t), t;
}
function vd(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    Se(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function Bd(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let li = class {
};
function Cr(t) {
  const e = (r) => t().update(an(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function t0(t) {
  const e = (r, s) => t(s).update(an(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function e0(t) {
  const e = (r, s) => t(s).update(an(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const Hd = Cr, _d = t0, Ld = e0;
function Id(t = 32) {
  if (ze && typeof ze.getRandomValues == "function")
    return ze.getRandomValues(new Uint8Array(t));
  if (ze && typeof ze.randomBytes == "function")
    return Uint8Array.from(ze.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const Ud = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: li,
  abytes: Se,
  aexists: Sn,
  ahash: Wa,
  anumber: Es,
  aoutput: Xa,
  asyncLoop: Ed,
  byteSwap: fi,
  byteSwap32: Ya,
  byteSwapIfBE: xd,
  bytesToHex: Sd,
  bytesToUtf8: Ad,
  checkOpts: Bd,
  clean: mn,
  concatBytes: vd,
  createHasher: Cr,
  createOptHasher: t0,
  createView: ar,
  createXOFer: e0,
  hexToBytes: md,
  isBytes: qa,
  isLE: ai,
  kdfInputToBytes: $d,
  nextTick: Qa,
  randomBytes: Id,
  rotl: pd,
  rotr: pt,
  swap32IfBE: wd,
  swap8IfBE: Za,
  toBytes: an,
  u32: gd,
  u8: bd,
  utf8ToBytes: hi,
  wrapConstructor: Hd,
  wrapConstructorWithOpts: _d,
  wrapXOFConstructorWithOpts: Ld
}, Symbol.toStringTag, { value: "Module" }));
let ui = class extends li {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Wa(e);
    const r = an(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, i = new Uint8Array(s);
    i.set(r.length > s ? e.create().update(r).digest() : r);
    for (let o = 0; o < i.length; o++)
      i[o] ^= 54;
    this.iHash.update(i), this.oHash = e.create();
    for (let o = 0; o < i.length; o++)
      i[o] ^= 106;
    this.oHash.update(i), mn(i);
  }
  update(e) {
    return Sn(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Sn(this), Se(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const n0 = (t, e, n) => new ui(t, e).update(n).digest();
n0.create = (t, e) => new ui(t, e);
const Od = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HMAC: ui,
  hmac: n0
}, Symbol.toStringTag, { value: "Module" })), Cd = /* @__PURE__ */ Bn(Od);
function Pd(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), f = r ? 4 : 0, d = r ? 0 : 4;
  t.setUint32(e + f, o, r), t.setUint32(e + d, c, r);
}
function Dd(t, e, n) {
  return t & e ^ ~t & n;
}
function Nd(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class kd extends li {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = ar(this.buffer);
  }
  update(e) {
    Sn(this), e = an(e), Se(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const f = ar(e);
        for (; s <= i - o; o += s)
          this.process(f, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Sn(this), Xa(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, mn(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let a = o; a < s; a++)
      n[a] = 0;
    Pd(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = ar(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = f / 4, l = this.get();
    if (d > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let a = 0; a < d; a++)
      c.setUint32(4 * a, l[a], i);
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
const Wt = /* @__PURE__ */ Uint32Array.from([
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
]), Fd = /* @__PURE__ */ Uint32Array.from([
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
let di = class extends kd {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = Wt[0] | 0, this.B = Wt[1] | 0, this.C = Wt[2] | 0, this.D = Wt[3] | 0, this.E = Wt[4] | 0, this.F = Wt[5] | 0, this.G = Wt[6] | 0, this.H = Wt[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: o, G: c, H: f } = this;
    return [e, n, r, s, i, o, c, f];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, f) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = c | 0, this.H = f | 0;
  }
  process(e, n) {
    for (let a = 0; a < 16; a++, n += 4)
      Zt[a] = e.getUint32(n, !1);
    for (let a = 16; a < 64; a++) {
      const b = Zt[a - 15], u = Zt[a - 2], p = pt(b, 7) ^ pt(b, 18) ^ b >>> 3, y = pt(u, 17) ^ pt(u, 19) ^ u >>> 10;
      Zt[a] = y + Zt[a - 7] + p + Zt[a - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: f, G: d, H: l } = this;
    for (let a = 0; a < 64; a++) {
      const b = pt(c, 6) ^ pt(c, 11) ^ pt(c, 25), u = l + b + Dd(c, f, d) + Fd[a] + Zt[a] | 0, y = (pt(r, 2) ^ pt(r, 13) ^ pt(r, 22)) + Nd(r, s, i) | 0;
      l = d, d = f, f = c, c = o + u | 0, o = i, i = s, s = r, r = u + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, f = f + this.F | 0, d = d + this.G | 0, l = l + this.H | 0, this.set(r, s, i, o, c, f, d, l);
  }
  roundClean() {
    mn(Zt);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), mn(this.buffer);
  }
}, r0 = class extends di {
  constructor() {
    super(28), this.A = Xt[0] | 0, this.B = Xt[1] | 0, this.C = Xt[2] | 0, this.D = Xt[3] | 0, this.E = Xt[4] | 0, this.F = Xt[5] | 0, this.G = Xt[6] | 0, this.H = Xt[7] | 0;
  }
};
const Td = /* @__PURE__ */ Cr(() => new di()), Md = /* @__PURE__ */ Cr(() => new r0()), Gd = di, Kd = Td, Rd = r0, Vd = Md, zd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: Rd,
  SHA256: Gd,
  sha224: Vd,
  sha256: Kd
}, Symbol.toStringTag, { value: "Module" })), Pr = /* @__PURE__ */ Bn(zd), jd = /* @__PURE__ */ Bn(Wl);
var tn = {};
Object.defineProperty(tn, "__esModule", { value: !0 });
tn.joseToDer = tn.derToJose = void 0;
const s0 = Hn, i0 = st;
function ss(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const qd = {
  ES256: ss(256),
  ES384: ss(384),
  ES512: ss(521)
};
function o0(t) {
  const e = qd[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const xr = 128, c0 = 0, Wd = 32, Xd = 16, Zd = 2, a0 = Xd | Wd | c0 << 6, wr = Zd | c0 << 6;
function f0(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, s0.toByteArray)((0, i0.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function Yd(t, e) {
  const n = f0(t), r = o0(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== a0)
    throw new Error('Could not find expected "seq"');
  let c = n[o++];
  if (c === (xr | 1) && (c = n[o++]), i - o < c)
    throw new Error(`"seq" specified length of "${c}", only "${i - o}" remaining`);
  if (n[o++] !== wr)
    throw new Error('Could not find expected "int" for "r"');
  const f = n[o++];
  if (i - o - 2 < f)
    throw new Error(`"r" specified length of "${f}", only "${i - o - 2}" available`);
  if (s < f)
    throw new Error(`"r" specified length of "${f}", max of "${s}" is acceptable`);
  const d = o;
  if (o += f, n[o++] !== wr)
    throw new Error('Could not find expected "int" for "s"');
  const l = n[o++];
  if (i - o !== l)
    throw new Error(`"s" specified length of "${l}", expected "${i - o}"`);
  if (s < l)
    throw new Error(`"s" specified length of "${l}", max of "${s}" is acceptable`);
  const a = o;
  if (o += l, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const b = r - f, u = r - l, p = new Uint8Array(b + f + u + l);
  for (o = 0; o < b; ++o)
    p[o] = 0;
  p.set(n.subarray(d + Math.max(-b, 0), d + f), o), o = r;
  for (const y = o; o < y + u; ++o)
    p[o] = 0;
  return p.set(n.subarray(a + Math.max(-u, 0), a + l), o), (0, i0.escape)((0, s0.fromByteArray)(p));
}
tn.derToJose = Yd;
function Bo(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= xr && --r, r;
}
function Jd(t, e) {
  t = f0(t);
  const n = o0(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Bo(t, 0, n), i = Bo(t, n, t.length), o = n - s, c = n - i, f = 2 + o + 1 + 1 + c, d = f < xr, l = new Uint8Array((d ? 2 : 3) + f);
  let a = 0;
  return l[a++] = a0, d ? l[a++] = f : (l[a++] = xr | 1, l[a++] = f & 255), l[a++] = wr, l[a++] = o, s < 0 ? (l[a++] = 0, l.set(t.subarray(0, n), a), a += n) : (l.set(t.subarray(s, n), a), a += n - s), l[a++] = wr, l[a++] = c, i < 0 ? (l[a++] = 0, l.set(t.subarray(n), a)) : l.set(t.subarray(n + i), a), l;
}
tn.joseToDer = Jd;
var Kt = {};
Object.defineProperty(Kt, "__esModule", { value: !0 });
Kt.InvalidTokenError = Kt.MissingParametersError = void 0;
class Qd extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Kt.MissingParametersError = Qd;
class t1 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Kt.InvalidTokenError = t1;
const _n = /* @__PURE__ */ Bn(Ud);
Object.defineProperty(Or, "__esModule", { value: !0 });
Or.SECP256K1Client = void 0;
const e1 = Cd, n1 = Pr, fr = jd, Ho = tn, _o = Kt, Lo = _n;
fr.utils.hmacSha256Sync = (t, ...e) => {
  const n = e1.hmac.create(n1.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class h0 {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Lo.bytesToHex)(fr.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new _o.MissingParametersError("a signing input hash and private key are all required");
    const s = fr.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Lo.bytesToHex)(s);
    if (r === "jose")
      return (0, Ho.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Ho.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new _o.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return fr.verify(n, e, r, { strict: !1 });
  }
}
Or.SECP256K1Client = h0;
h0.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Or;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(Ur);
var Le = {};
const r1 = /* @__PURE__ */ Bn(xa);
var s1 = it && it.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function c(l) {
      try {
        d(r.next(l));
      } catch (a) {
        o(a);
      }
    }
    function f(l) {
      try {
        d(r.throw(l));
      } catch (a) {
        o(a);
      }
    }
    function d(l) {
      l.done ? i(l.value) : s(l.value).then(c, f);
    }
    d((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Le, "__esModule", { value: !0 });
Le.hashSha256Async = Le.hashSha256 = void 0;
const i1 = Pr;
function l0(t) {
  return (0, i1.sha256)(t);
}
Le.hashSha256 = l0;
function o1(t) {
  return s1(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = r1;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(l0(t));
    }
  });
}
Le.hashSha256Async = o1;
var c1 = it && it.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function c(l) {
      try {
        d(r.next(l));
      } catch (a) {
        o(a);
      }
    }
    function f(l) {
      try {
        d(r.throw(l));
      } catch (a) {
        o(a);
      }
    }
    function d(l) {
      l.done ? i(l.value) : s(l.value).then(c, f);
    }
    d((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Qe, "__esModule", { value: !0 });
Qe.TokenSigner = Qe.createUnsecuredToken = void 0;
const As = st, Io = Ur, a1 = Kt, Uo = Le;
function $s(t, e) {
  const n = [], r = As.encode(JSON.stringify(e));
  n.push(r);
  const s = As.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function f1(t) {
  return $s(t, { typ: "JWT", alg: "none" }) + ".";
}
Qe.createUnsecuredToken = f1;
class h1 {
  constructor(e, n) {
    if (!(e && n))
      throw new a1.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Io.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Io.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = $s(e, s), o = (0, Uo.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return c1(this, void 0, void 0, function* () {
      const s = this.header(r), i = $s(e, s), o = yield (0, Uo.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [As.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
Qe.TokenSigner = h1;
var Dr = {};
Object.defineProperty(Dr, "__esModule", { value: !0 });
Dr.TokenVerifier = void 0;
const l1 = st, Oo = Ur, u1 = Kt, qn = Le;
class d1 {
  constructor(e, n) {
    if (!(e && n))
      throw new u1.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Oo.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Oo.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, qn.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, qn.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), l1.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((c) => {
      const f = this.cryptoClient.loadSignature(c);
      this.cryptoClient.verifyHash(o, f, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, qn.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, qn.hashSha256)(r);
      return i(o);
    }
  }
}
Dr.TokenVerifier = d1;
var Nr = {};
Object.defineProperty(Nr, "__esModule", { value: !0 });
Nr.decodeToken = void 0;
const Wn = st;
function b1(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Wn.decode(e[0])), r = JSON.parse(Wn.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Wn.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Wn.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
Nr.decodeToken = b1;
(function(t) {
  var e = it && it.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var c = Object.getOwnPropertyDescriptor(s, i);
    (!c || ("get" in c ? !s.__esModule : c.writable || c.configurable)) && (c = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, c);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = it && it.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Qe, t), n(Dr, t), n(Nr, t), n(Kt, t), n(Ur, t);
})(ot);
function g1(t) {
  return `did:btc-addr:${t}`;
}
function p1(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new lo("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new lo('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function u0(t) {
  if (t)
    return p1(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const x1 = "1.4.0";
function w1() {
  return td();
}
function y1(t, e, n, r = aa.slice(), s, i = tl().getTime(), o = {}) {
  const c = (u) => {
    const p = Zs("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${u}=undefined])`
    });
    return p == null ? void 0 : p.origin;
  };
  e || (e = `${c("redirectURI")}/`), n || (n = `${c("manifestURI")}/manifest.json`), s || (s = c("appDomain"));
  const f = Object.assign({}, o, {
    jti: nl(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: x1,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), d = ot.SECP256K1Client.derivePublicKey(t);
  f.public_keys = [d];
  const l = Ta(d);
  return f.iss = g1(l), new ot.TokenSigner("ES256k", t).sign(f);
}
async function Co(t, e) {
  const n = la(ht(e)), r = JSON.parse(n), s = await Ra(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function S1(t) {
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
function m1(t) {
  const e = ot.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = u0(e.iss);
  if (n.length === 1) {
    if (Ta(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function E1(t) {
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
function A1(t) {
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
function $1(t) {
  const e = [
    A1(t),
    E1(t),
    S1(t),
    m1(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Po = "1.0.0";
class ye {
  constructor(e) {
    this.version = Po, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Po)
      throw new xs(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new ye(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class d0 {
  constructor(e) {
    if (e) {
      const n = new ye(e);
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
class Do extends d0 {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new ye({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new fa("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new ye({})), !0;
  }
}
class No extends d0 {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Yh, !localStorage.getItem(this.key)) {
      const r = new ye({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new fa("No session data was found in localStorage");
    const n = JSON.parse(e);
    return ye.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new ye({})), !0;
  }
}
var En;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(En || (En = {}));
var yr;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(yr || (yr = {}));
En.Mainnet;
var Ft;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ft || (Ft = {}));
var _t;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(_t || (_t = {}));
Ft.Mainnet;
const b0 = {
  chainId: En.Mainnet,
  transactionVersion: Ft.Mainnet,
  peerNetworkId: yr.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: _t.MainnetSingleSig,
    multiSig: _t.MainnetMultiSig
  },
  client: { baseUrl: ul }
}, vs = {
  chainId: En.Testnet,
  transactionVersion: Ft.Testnet,
  peerNetworkId: yr.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: _t.TestnetSingleSig,
    multiSig: _t.TestnetMultiSig
  },
  client: { baseUrl: dl }
}, hr = {
  ...vs,
  addressVersion: { ...vs.addressVersion },
  magicBytes: "id",
  client: { baseUrl: bl }
}, v1 = {
  ...hr,
  addressVersion: { ...hr.addressVersion },
  client: { ...hr.client }
};
function B1(t) {
  switch (t) {
    case "mainnet":
      return b0;
    case "testnet":
      return vs;
    case "devnet":
      return hr;
    case "mocknet":
      return v1;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function g0(t) {
  return typeof t == "string" ? B1(t) : t;
}
var ko;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ko || (ko = {}));
var Fo;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Fo || (Fo = {}));
var xt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(xt || (xt = {}));
const is = ["onChainOnly", "offChainOnly", "any"];
is[0] + "", xt.OnChainOnly, is[1] + "", xt.OffChainOnly, is[2] + "", xt.Any, xt.OnChainOnly + "", xt.OnChainOnly, xt.OffChainOnly + "", xt.OffChainOnly, xt.Any + "", xt.Any;
var To;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(To || (To = {}));
var Mo;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Mo || (Mo = {}));
var Go;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Go || (Go = {}));
var kt;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(kt || (kt = {}));
var Ko;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ko || (Ko = {}));
var Ro;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ro || (Ro = {}));
var Vo;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Vo || (Vo = {}));
var zo;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(zo || (zo = {}));
var jo;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(jo || (jo = {}));
var qo;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(qo || (qo = {}));
var Wo;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Wo || (Wo = {}));
var Xo;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Xo || (Xo = {}));
var Zo;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Zo || (Zo = {}));
function Bs(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function H1(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function p0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function _1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Bs(t.outputLen), Bs(t.blockLen);
}
function L1(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function I1(t, e) {
  p0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ve = {
  number: Bs,
  bool: H1,
  bytes: p0,
  hash: _1,
  exists: L1,
  output: I1
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const os = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), At = (t, e) => t << 32 - e | t >>> e, U1 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!U1)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function O1(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function bi(t) {
  if (typeof t == "string" && (t = O1(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let x0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function De(t) {
  const e = (r) => t().update(bi(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
class w0 extends x0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ve.hash(e);
    const r = bi(n);
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
    return ve.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    ve.exists(this), ve.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const y0 = (t, e, n) => new w0(t, e).update(n).digest();
y0.create = (t, e) => new w0(t, e);
function C1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), f = r ? 4 : 0, d = r ? 0 : 4;
  t.setUint32(e + f, o, r), t.setUint32(e + d, c, r);
}
let gi = class extends x0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = os(this.buffer);
  }
  update(e) {
    ve.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = bi(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const f = os(e);
        for (; s <= i - o; o += s)
          this.process(f, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ve.exists(this), ve.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let a = o; a < s; a++)
      n[a] = 0;
    C1(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = os(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = f / 4, l = this.get();
    if (d > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let a = 0; a < d; a++)
      c.setUint32(4 * a, l[a], i);
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
const P1 = (t, e, n) => t & e ^ ~t & n, D1 = (t, e, n) => t & e ^ t & n ^ e & n, N1 = new Uint32Array([
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
]), Yt = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Jt = new Uint32Array(64);
let S0 = class extends gi {
  constructor() {
    super(64, 32, 8, !1), this.A = Yt[0] | 0, this.B = Yt[1] | 0, this.C = Yt[2] | 0, this.D = Yt[3] | 0, this.E = Yt[4] | 0, this.F = Yt[5] | 0, this.G = Yt[6] | 0, this.H = Yt[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: o, G: c, H: f } = this;
    return [e, n, r, s, i, o, c, f];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, f) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = c | 0, this.H = f | 0;
  }
  process(e, n) {
    for (let a = 0; a < 16; a++, n += 4)
      Jt[a] = e.getUint32(n, !1);
    for (let a = 16; a < 64; a++) {
      const b = Jt[a - 15], u = Jt[a - 2], p = At(b, 7) ^ At(b, 18) ^ b >>> 3, y = At(u, 17) ^ At(u, 19) ^ u >>> 10;
      Jt[a] = y + Jt[a - 7] + p + Jt[a - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: f, G: d, H: l } = this;
    for (let a = 0; a < 64; a++) {
      const b = At(c, 6) ^ At(c, 11) ^ At(c, 25), u = l + b + P1(c, f, d) + N1[a] + Jt[a] | 0, y = (At(r, 2) ^ At(r, 13) ^ At(r, 22)) + D1(r, s, i) | 0;
      l = d, d = f, f = c, c = o + u | 0, o = i, i = s, s = r, r = u + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, f = f + this.F | 0, d = d + this.G | 0, l = l + this.H | 0, this.set(r, s, i, o, c, f, d, l);
  }
  roundClean() {
    Jt.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, k1 = class extends S0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const m0 = De(() => new S0());
De(() => new k1());
var pi = {}, xi = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = _n;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, c) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let f = [], d = 0;
    for (let u = o.length - 1; u >= 0; u--)
      if (d < 4) {
        const p = n.indexOf(o[u]) >> d;
        let y = 0;
        u !== 0 && (y = n.indexOf(o[u - 1]));
        const A = 1 + d, H = y % (1 << A) << 5 - A, _ = t.c32[p + H];
        d = A, f.unshift(_);
      } else
        d = 0;
    let l = 0;
    for (let u = 0; u < f.length && f[u] === "0"; u++)
      l++;
    f = f.slice(l);
    const a = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), b = a ? a[0].length : 0;
    for (let u = 0; u < b; u++)
      f.unshift(t.c32[0]);
    if (c) {
      const u = c - f.length;
      for (let p = 0; p < u; p++)
        f.unshift(t.c32[0]);
    }
    return f.join("");
  }
  t.c32encode = r;
  function s(o) {
    return o.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  t.c32normalize = s;
  function i(o, c) {
    if (o = s(o), !o.match(`^[${t.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const f = o.match(`^${t.c32[0]}*`), d = f ? f[0].length : 0;
    let l = [], a = 0, b = 0;
    for (let y = o.length - 1; y >= 0; y--) {
      b === 4 && (l.unshift(n[a]), b = 0, a = 0);
      const H = (t.c32.indexOf(o[y]) << b) + a, _ = n[H % 16];
      if (b += 1, a = H >> 4, a > 1 << b)
        throw new Error("Panic error in decoding.");
      l.unshift(_);
    }
    l.unshift(n[a]), l.length % 2 === 1 && l.unshift("0");
    let u = 0;
    for (let y = 0; y < l.length && l[y] === "0"; y++)
      u++;
    l = l.slice(u - u % 2);
    let p = l.join("");
    for (let y = 0; y < d; y++)
      p = `00${p}`;
    if (c) {
      const y = c * 2 - p.length;
      for (let A = 0; A < y; A += 2)
        p = `00${p}`;
    }
    return p;
  }
  t.c32decode = i;
})(xi);
var Ie = {};
Object.defineProperty(Ie, "__esModule", { value: !0 });
Ie.c32checkDecode = Ie.c32checkEncode = void 0;
const Yo = Pr, Jo = _n, wn = xi;
function E0(t) {
  const e = (0, Yo.sha256)((0, Yo.sha256)((0, Jo.hexToBytes)(t)));
  return (0, Jo.bytesToHex)(e.slice(0, 4));
}
function F1(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = E0(`${n}${e}`), s = (0, wn.c32encode)(`${e}${r}`);
  return `${wn.c32[t]}${s}`;
}
Ie.c32checkEncode = F1;
function T1(t) {
  t = (0, wn.c32normalize)(t);
  const e = (0, wn.c32decode)(t.slice(1)), n = t[0], r = wn.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), E0(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Ie.c32checkDecode = T1;
var A0 = {}, en = {};
Object.defineProperty(en, "__esModule", { value: !0 });
en.decode = en.encode = void 0;
const Sr = Pr, Qo = _n, $0 = Pa, v0 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function M1(t, e = "00") {
  const n = typeof t == "string" ? (0, Qo.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Qo.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Sr.sha256)((0, Sr.sha256)(new Uint8Array([...r, ...n])));
  return $0(v0).encode([...r, ...n, ...s.slice(0, 4)]);
}
en.encode = M1;
function G1(t) {
  const e = $0(v0).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Sr.sha256)((0, Sr.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
en.decode = G1;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Ie, n = en, r = _n;
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
  function o(l, a) {
    if (!a.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, e.c32checkEncode)(l, a)}`;
  }
  t.c32address = o;
  function c(l) {
    if (l.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (l[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, e.c32checkDecode)(l.slice(1));
  }
  t.c32addressDecode = c;
  function f(l, a = -1) {
    const b = n.decode(l), u = (0, r.bytesToHex)(b.data), p = parseInt((0, r.bytesToHex)(b.prefix), 16);
    let y;
    return a < 0 ? (y = p, s[p] !== void 0 && (y = s[p])) : y = a, o(y, u);
  }
  t.b58ToC32 = f;
  function d(l, a = -1) {
    const b = c(l), u = b[0], p = b[1];
    let y;
    a < 0 ? (y = u, i[u] !== void 0 && (y = i[u])) : y = a;
    let A = y.toString(16);
    return A.length === 1 && (A = `0${A}`), n.encode(p, A);
  }
  t.c32ToB58 = d;
})(A0);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = xi;
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
  const r = A0;
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
})(pi);
function K1(t, e) {
  switch (e = g0(e ?? b0), t) {
    case kt.P2PKH:
      switch (e.transactionVersion) {
        case Ft.Mainnet:
          return _t.MainnetSingleSig;
        case Ft.Testnet:
          return _t.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case kt.P2SH:
    case kt.P2SHNonSequential:
    case kt.P2WPKH:
    case kt.P2WSH:
    case kt.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Ft.Mainnet:
          return _t.MainnetMultiSig;
        case Ft.Testnet:
          return _t.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const R1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), B0 = Uint8Array.from({ length: 16 }, (t, e) => e), V1 = B0.map((t) => (9 * t + 5) % 16);
let wi = [B0], yi = [V1];
for (let t = 0; t < 4; t++)
  for (let e of [wi, yi])
    e.push(e[t].map((n) => R1[n]));
const H0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), z1 = wi.map((t, e) => t.map((n) => H0[e][n])), j1 = yi.map((t, e) => t.map((n) => H0[e][n])), q1 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), W1 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Xn = (t, e) => t << e | t >>> 32 - e;
function tc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Zn = new Uint32Array(16);
let X1 = class extends gi {
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
    for (let u = 0; u < 16; u++, n += 4)
      Zn[u] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, f = c, d = this.h3 | 0, l = d, a = this.h4 | 0, b = a;
    for (let u = 0; u < 5; u++) {
      const p = 4 - u, y = q1[u], A = W1[u], H = wi[u], _ = yi[u], x = z1[u], v = j1[u];
      for (let S = 0; S < 16; S++) {
        const C = Xn(r + tc(u, i, c, d) + Zn[H[S]] + y, x[S]) + a | 0;
        r = a, a = d, d = Xn(c, 10) | 0, c = i, i = C;
      }
      for (let S = 0; S < 16; S++) {
        const C = Xn(s + tc(p, o, f, l) + Zn[_[S]] + A, v[S]) + b | 0;
        s = b, b = l, l = Xn(f, 10) | 0, f = o, o = C;
      }
    }
    this.set(this.h1 + c + l | 0, this.h2 + d + b | 0, this.h3 + a + s | 0, this.h4 + r + o | 0, this.h0 + i + f | 0);
  }
  roundClean() {
    Zn.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Z1 = De(() => new X1()), Yn = BigInt(2 ** 32 - 1), Hs = BigInt(32);
function _0(t, e = !1) {
  return e ? { h: Number(t & Yn), l: Number(t >> Hs & Yn) } : { h: Number(t >> Hs & Yn) | 0, l: Number(t & Yn) | 0 };
}
function Y1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = _0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const J1 = (t, e) => BigInt(t >>> 0) << Hs | BigInt(e >>> 0), Q1 = (t, e, n) => t >>> n, t2 = (t, e, n) => t << 32 - n | e >>> n, e2 = (t, e, n) => t >>> n | e << 32 - n, n2 = (t, e, n) => t << 32 - n | e >>> n, r2 = (t, e, n) => t << 64 - n | e >>> n - 32, s2 = (t, e, n) => t >>> n - 32 | e << 64 - n, i2 = (t, e) => e, o2 = (t, e) => t, c2 = (t, e, n) => t << n | e >>> 32 - n, a2 = (t, e, n) => e << n | t >>> 32 - n, f2 = (t, e, n) => e << n - 32 | t >>> 64 - n, h2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function l2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const u2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), d2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, b2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), g2 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, p2 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), x2 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, F = {
  fromBig: _0,
  split: Y1,
  toBig: J1,
  shrSH: Q1,
  shrSL: t2,
  rotrSH: e2,
  rotrSL: n2,
  rotrBH: r2,
  rotrBL: s2,
  rotr32H: i2,
  rotr32L: o2,
  rotlSH: c2,
  rotlSL: a2,
  rotlBH: f2,
  rotlBL: h2,
  add: l2,
  add3L: u2,
  add3H: d2,
  add4L: b2,
  add4H: g2,
  add5H: x2,
  add5L: p2
}, [w2, y2] = F.split([
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
].map((t) => BigInt(t))), Qt = new Uint32Array(80), te = new Uint32Array(80);
let kr = class extends gi {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: f, Eh: d, El: l, Fh: a, Fl: b, Gh: u, Gl: p, Hh: y, Hl: A } = this;
    return [e, n, r, s, i, o, c, f, d, l, a, b, u, p, y, A];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, f, d, l, a, b, u, p, y, A) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = f | 0, this.Eh = d | 0, this.El = l | 0, this.Fh = a | 0, this.Fl = b | 0, this.Gh = u | 0, this.Gl = p | 0, this.Hh = y | 0, this.Hl = A | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      Qt[x] = e.getUint32(n), te[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const v = Qt[x - 15] | 0, S = te[x - 15] | 0, C = F.rotrSH(v, S, 1) ^ F.rotrSH(v, S, 8) ^ F.shrSH(v, S, 7), N = F.rotrSL(v, S, 1) ^ F.rotrSL(v, S, 8) ^ F.shrSL(v, S, 7), I = Qt[x - 2] | 0, U = te[x - 2] | 0, g = F.rotrSH(I, U, 19) ^ F.rotrBH(I, U, 61) ^ F.shrSH(I, U, 6), m = F.rotrSL(I, U, 19) ^ F.rotrBL(I, U, 61) ^ F.shrSL(I, U, 6), L = F.add4L(N, m, te[x - 7], te[x - 16]), D = F.add4H(L, C, g, Qt[x - 7], Qt[x - 16]);
      Qt[x] = D | 0, te[x] = L | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: f, Dh: d, Dl: l, Eh: a, El: b, Fh: u, Fl: p, Gh: y, Gl: A, Hh: H, Hl: _ } = this;
    for (let x = 0; x < 80; x++) {
      const v = F.rotrSH(a, b, 14) ^ F.rotrSH(a, b, 18) ^ F.rotrBH(a, b, 41), S = F.rotrSL(a, b, 14) ^ F.rotrSL(a, b, 18) ^ F.rotrBL(a, b, 41), C = a & u ^ ~a & y, N = b & p ^ ~b & A, I = F.add5L(_, S, N, y2[x], te[x]), U = F.add5H(I, H, v, C, w2[x], Qt[x]), g = I | 0, m = F.rotrSH(r, s, 28) ^ F.rotrBH(r, s, 34) ^ F.rotrBH(r, s, 39), L = F.rotrSL(r, s, 28) ^ F.rotrBL(r, s, 34) ^ F.rotrBL(r, s, 39), D = r & i ^ r & c ^ i & c, K = s & o ^ s & f ^ o & f;
      H = y | 0, _ = A | 0, y = u | 0, A = p | 0, u = a | 0, p = b | 0, { h: a, l: b } = F.add(d | 0, l | 0, U | 0, g | 0), d = c | 0, l = f | 0, c = i | 0, f = o | 0, i = r | 0, o = s | 0;
      const P = F.add3L(g, L, K);
      r = F.add3H(P, U, m, D), s = P | 0;
    }
    ({ h: r, l: s } = F.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = F.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l: f } = F.add(this.Ch | 0, this.Cl | 0, c | 0, f | 0), { h: d, l } = F.add(this.Dh | 0, this.Dl | 0, d | 0, l | 0), { h: a, l: b } = F.add(this.Eh | 0, this.El | 0, a | 0, b | 0), { h: u, l: p } = F.add(this.Fh | 0, this.Fl | 0, u | 0, p | 0), { h: y, l: A } = F.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: H, l: _ } = F.add(this.Hh | 0, this.Hl | 0, H | 0, _ | 0), this.set(r, s, i, o, c, f, d, l, a, b, u, p, y, A, H, _);
  }
  roundClean() {
    Qt.fill(0), te.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, S2 = class extends kr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, m2 = class extends kr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, E2 = class extends kr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
De(() => new kr());
De(() => new S2());
De(() => new m2());
De(() => new E2());
var mr = { exports: {} };
mr.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", c = "[object Boolean]", f = "[object Date]", d = "[object Error]", l = "[object Function]", a = "[object GeneratorFunction]", b = "[object Map]", u = "[object Number]", p = "[object Object]", y = "[object Promise]", A = "[object RegExp]", H = "[object Set]", _ = "[object String]", x = "[object Symbol]", v = "[object WeakMap]", S = "[object ArrayBuffer]", C = "[object DataView]", N = "[object Float32Array]", I = "[object Float64Array]", U = "[object Int8Array]", g = "[object Int16Array]", m = "[object Int32Array]", L = "[object Uint8Array]", D = "[object Uint8ClampedArray]", K = "[object Uint16Array]", P = "[object Uint32Array]", Te = /[\\^$.*+?()[\]{}|]/g, ln = /\w*$/, On = /^\[object .+?Constructor\]$/, tt = /^(?:0|[1-9]\d*)$/, R = {};
  R[i] = R[o] = R[S] = R[C] = R[c] = R[f] = R[N] = R[I] = R[U] = R[g] = R[m] = R[b] = R[u] = R[p] = R[A] = R[H] = R[_] = R[x] = R[L] = R[D] = R[K] = R[P] = !0, R[d] = R[l] = R[v] = !1;
  var Bf = typeof it == "object" && it && it.Object === Object && it, Hf = typeof self == "object" && self && self.Object === Object && self, Ct = Bf || Hf || Function("return this")(), Mi = e && !e.nodeType && e, Gi = Mi && !0 && t && !t.nodeType && t, _f = Gi && Gi.exports === Mi;
  function Lf(h, w) {
    return h.set(w[0], w[1]), h;
  }
  function If(h, w) {
    return h.add(w), h;
  }
  function Uf(h, w) {
    for (var E = -1, O = h ? h.length : 0; ++E < O && w(h[E], E, h) !== !1; )
      ;
    return h;
  }
  function Of(h, w) {
    for (var E = -1, O = w.length, rt = h.length; ++E < O; )
      h[rt + E] = w[E];
    return h;
  }
  function Ki(h, w, E, O) {
    for (var rt = -1, ct = h ? h.length : 0; ++rt < ct; )
      E = w(E, h[rt], rt, h);
    return E;
  }
  function Cf(h, w) {
    for (var E = -1, O = Array(h); ++E < h; )
      O[E] = w(E);
    return O;
  }
  function Pf(h, w) {
    return h == null ? void 0 : h[w];
  }
  function Ri(h) {
    var w = !1;
    if (h != null && typeof h.toString != "function")
      try {
        w = !!(h + "");
      } catch {
      }
    return w;
  }
  function Vi(h) {
    var w = -1, E = Array(h.size);
    return h.forEach(function(O, rt) {
      E[++w] = [rt, O];
    }), E;
  }
  function Vr(h, w) {
    return function(E) {
      return h(w(E));
    };
  }
  function zi(h) {
    var w = -1, E = Array(h.size);
    return h.forEach(function(O) {
      E[++w] = O;
    }), E;
  }
  var Df = Array.prototype, Nf = Function.prototype, Cn = Object.prototype, zr = Ct["__core-js_shared__"], ji = function() {
    var h = /[^.]+$/.exec(zr && zr.keys && zr.keys.IE_PROTO || "");
    return h ? "Symbol(src)_1." + h : "";
  }(), qi = Nf.toString, Rt = Cn.hasOwnProperty, Pn = Cn.toString, kf = RegExp(
    "^" + qi.call(Rt).replace(Te, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Wi = _f ? Ct.Buffer : void 0, Xi = Ct.Symbol, Zi = Ct.Uint8Array, Ff = Vr(Object.getPrototypeOf, Object), Tf = Object.create, Mf = Cn.propertyIsEnumerable, Gf = Df.splice, Yi = Object.getOwnPropertySymbols, Kf = Wi ? Wi.isBuffer : void 0, Rf = Vr(Object.keys, Object), jr = Ke(Ct, "DataView"), un = Ke(Ct, "Map"), qr = Ke(Ct, "Promise"), Wr = Ke(Ct, "Set"), Xr = Ke(Ct, "WeakMap"), dn = Ke(Object, "create"), Vf = Ae(jr), zf = Ae(un), jf = Ae(qr), qf = Ae(Wr), Wf = Ae(Xr), Ji = Xi ? Xi.prototype : void 0, Qi = Ji ? Ji.valueOf : void 0;
  function me(h) {
    var w = -1, E = h ? h.length : 0;
    for (this.clear(); ++w < E; ) {
      var O = h[w];
      this.set(O[0], O[1]);
    }
  }
  function Xf() {
    this.__data__ = dn ? dn(null) : {};
  }
  function Zf(h) {
    return this.has(h) && delete this.__data__[h];
  }
  function Yf(h) {
    var w = this.__data__;
    if (dn) {
      var E = w[h];
      return E === r ? void 0 : E;
    }
    return Rt.call(w, h) ? w[h] : void 0;
  }
  function Jf(h) {
    var w = this.__data__;
    return dn ? w[h] !== void 0 : Rt.call(w, h);
  }
  function Qf(h, w) {
    var E = this.__data__;
    return E[h] = dn && w === void 0 ? r : w, this;
  }
  me.prototype.clear = Xf, me.prototype.delete = Zf, me.prototype.get = Yf, me.prototype.has = Jf, me.prototype.set = Qf;
  function Pt(h) {
    var w = -1, E = h ? h.length : 0;
    for (this.clear(); ++w < E; ) {
      var O = h[w];
      this.set(O[0], O[1]);
    }
  }
  function th() {
    this.__data__ = [];
  }
  function eh(h) {
    var w = this.__data__, E = Dn(w, h);
    if (E < 0)
      return !1;
    var O = w.length - 1;
    return E == O ? w.pop() : Gf.call(w, E, 1), !0;
  }
  function nh(h) {
    var w = this.__data__, E = Dn(w, h);
    return E < 0 ? void 0 : w[E][1];
  }
  function rh(h) {
    return Dn(this.__data__, h) > -1;
  }
  function sh(h, w) {
    var E = this.__data__, O = Dn(E, h);
    return O < 0 ? E.push([h, w]) : E[O][1] = w, this;
  }
  Pt.prototype.clear = th, Pt.prototype.delete = eh, Pt.prototype.get = nh, Pt.prototype.has = rh, Pt.prototype.set = sh;
  function Me(h) {
    var w = -1, E = h ? h.length : 0;
    for (this.clear(); ++w < E; ) {
      var O = h[w];
      this.set(O[0], O[1]);
    }
  }
  function ih() {
    this.__data__ = {
      hash: new me(),
      map: new (un || Pt)(),
      string: new me()
    };
  }
  function oh(h) {
    return Nn(this, h).delete(h);
  }
  function ch(h) {
    return Nn(this, h).get(h);
  }
  function ah(h) {
    return Nn(this, h).has(h);
  }
  function fh(h, w) {
    return Nn(this, h).set(h, w), this;
  }
  Me.prototype.clear = ih, Me.prototype.delete = oh, Me.prototype.get = ch, Me.prototype.has = ah, Me.prototype.set = fh;
  function Ge(h) {
    this.__data__ = new Pt(h);
  }
  function hh() {
    this.__data__ = new Pt();
  }
  function lh(h) {
    return this.__data__.delete(h);
  }
  function uh(h) {
    return this.__data__.get(h);
  }
  function dh(h) {
    return this.__data__.has(h);
  }
  function bh(h, w) {
    var E = this.__data__;
    if (E instanceof Pt) {
      var O = E.__data__;
      if (!un || O.length < n - 1)
        return O.push([h, w]), this;
      E = this.__data__ = new Me(O);
    }
    return E.set(h, w), this;
  }
  Ge.prototype.clear = hh, Ge.prototype.delete = lh, Ge.prototype.get = uh, Ge.prototype.has = dh, Ge.prototype.set = bh;
  function gh(h, w) {
    var E = Jr(h) || Th(h) ? Cf(h.length, String) : [], O = E.length, rt = !!O;
    for (var ct in h)
      Rt.call(h, ct) && !(rt && (ct == "length" || Dh(ct, O))) && E.push(ct);
    return E;
  }
  function to(h, w, E) {
    var O = h[w];
    (!(Rt.call(h, w) && so(O, E)) || E === void 0 && !(w in h)) && (h[w] = E);
  }
  function Dn(h, w) {
    for (var E = h.length; E--; )
      if (so(h[E][0], w))
        return E;
    return -1;
  }
  function ph(h, w) {
    return h && eo(w, Qr(w), h);
  }
  function Zr(h, w, E, O, rt, ct, Dt) {
    var at;
    if (O && (at = ct ? O(h, rt, ct, Dt) : O(h)), at !== void 0)
      return at;
    if (!kn(h))
      return h;
    var co = Jr(h);
    if (co) {
      if (at = Oh(h), !w)
        return Lh(h, at);
    } else {
      var Re = Ee(h), ao = Re == l || Re == a;
      if (Gh(h))
        return Eh(h, w);
      if (Re == p || Re == i || ao && !ct) {
        if (Ri(h))
          return ct ? h : {};
        if (at = Ch(ao ? {} : h), !w)
          return Ih(h, ph(at, h));
      } else {
        if (!R[Re])
          return ct ? h : {};
        at = Ph(h, Re, Zr, w);
      }
    }
    Dt || (Dt = new Ge());
    var fo = Dt.get(h);
    if (fo)
      return fo;
    if (Dt.set(h, at), !co)
      var ho = E ? Uh(h) : Qr(h);
    return Uf(ho || h, function(ts, Fn) {
      ho && (Fn = ts, ts = h[Fn]), to(at, Fn, Zr(ts, w, E, O, Fn, h, Dt));
    }), at;
  }
  function xh(h) {
    return kn(h) ? Tf(h) : {};
  }
  function wh(h, w, E) {
    var O = w(h);
    return Jr(h) ? O : Of(O, E(h));
  }
  function yh(h) {
    return Pn.call(h);
  }
  function Sh(h) {
    if (!kn(h) || kh(h))
      return !1;
    var w = oo(h) || Ri(h) ? kf : On;
    return w.test(Ae(h));
  }
  function mh(h) {
    if (!ro(h))
      return Rf(h);
    var w = [];
    for (var E in Object(h))
      Rt.call(h, E) && E != "constructor" && w.push(E);
    return w;
  }
  function Eh(h, w) {
    if (w)
      return h.slice();
    var E = new h.constructor(h.length);
    return h.copy(E), E;
  }
  function Yr(h) {
    var w = new h.constructor(h.byteLength);
    return new Zi(w).set(new Zi(h)), w;
  }
  function Ah(h, w) {
    var E = w ? Yr(h.buffer) : h.buffer;
    return new h.constructor(E, h.byteOffset, h.byteLength);
  }
  function $h(h, w, E) {
    var O = w ? E(Vi(h), !0) : Vi(h);
    return Ki(O, Lf, new h.constructor());
  }
  function vh(h) {
    var w = new h.constructor(h.source, ln.exec(h));
    return w.lastIndex = h.lastIndex, w;
  }
  function Bh(h, w, E) {
    var O = w ? E(zi(h), !0) : zi(h);
    return Ki(O, If, new h.constructor());
  }
  function Hh(h) {
    return Qi ? Object(Qi.call(h)) : {};
  }
  function _h(h, w) {
    var E = w ? Yr(h.buffer) : h.buffer;
    return new h.constructor(E, h.byteOffset, h.length);
  }
  function Lh(h, w) {
    var E = -1, O = h.length;
    for (w || (w = Array(O)); ++E < O; )
      w[E] = h[E];
    return w;
  }
  function eo(h, w, E, O) {
    E || (E = {});
    for (var rt = -1, ct = w.length; ++rt < ct; ) {
      var Dt = w[rt], at = void 0;
      to(E, Dt, at === void 0 ? h[Dt] : at);
    }
    return E;
  }
  function Ih(h, w) {
    return eo(h, no(h), w);
  }
  function Uh(h) {
    return wh(h, Qr, no);
  }
  function Nn(h, w) {
    var E = h.__data__;
    return Nh(w) ? E[typeof w == "string" ? "string" : "hash"] : E.map;
  }
  function Ke(h, w) {
    var E = Pf(h, w);
    return Sh(E) ? E : void 0;
  }
  var no = Yi ? Vr(Yi, Object) : Vh, Ee = yh;
  (jr && Ee(new jr(new ArrayBuffer(1))) != C || un && Ee(new un()) != b || qr && Ee(qr.resolve()) != y || Wr && Ee(new Wr()) != H || Xr && Ee(new Xr()) != v) && (Ee = function(h) {
    var w = Pn.call(h), E = w == p ? h.constructor : void 0, O = E ? Ae(E) : void 0;
    if (O)
      switch (O) {
        case Vf:
          return C;
        case zf:
          return b;
        case jf:
          return y;
        case qf:
          return H;
        case Wf:
          return v;
      }
    return w;
  });
  function Oh(h) {
    var w = h.length, E = h.constructor(w);
    return w && typeof h[0] == "string" && Rt.call(h, "index") && (E.index = h.index, E.input = h.input), E;
  }
  function Ch(h) {
    return typeof h.constructor == "function" && !ro(h) ? xh(Ff(h)) : {};
  }
  function Ph(h, w, E, O) {
    var rt = h.constructor;
    switch (w) {
      case S:
        return Yr(h);
      case c:
      case f:
        return new rt(+h);
      case C:
        return Ah(h, O);
      case N:
      case I:
      case U:
      case g:
      case m:
      case L:
      case D:
      case K:
      case P:
        return _h(h, O);
      case b:
        return $h(h, O, E);
      case u:
      case _:
        return new rt(h);
      case A:
        return vh(h);
      case H:
        return Bh(h, O, E);
      case x:
        return Hh(h);
    }
  }
  function Dh(h, w) {
    return w = w ?? s, !!w && (typeof h == "number" || tt.test(h)) && h > -1 && h % 1 == 0 && h < w;
  }
  function Nh(h) {
    var w = typeof h;
    return w == "string" || w == "number" || w == "symbol" || w == "boolean" ? h !== "__proto__" : h === null;
  }
  function kh(h) {
    return !!ji && ji in h;
  }
  function ro(h) {
    var w = h && h.constructor, E = typeof w == "function" && w.prototype || Cn;
    return h === E;
  }
  function Ae(h) {
    if (h != null) {
      try {
        return qi.call(h);
      } catch {
      }
      try {
        return h + "";
      } catch {
      }
    }
    return "";
  }
  function Fh(h) {
    return Zr(h, !0, !0);
  }
  function so(h, w) {
    return h === w || h !== h && w !== w;
  }
  function Th(h) {
    return Mh(h) && Rt.call(h, "callee") && (!Mf.call(h, "callee") || Pn.call(h) == i);
  }
  var Jr = Array.isArray;
  function io(h) {
    return h != null && Kh(h.length) && !oo(h);
  }
  function Mh(h) {
    return Rh(h) && io(h);
  }
  var Gh = Kf || zh;
  function oo(h) {
    var w = kn(h) ? Pn.call(h) : "";
    return w == l || w == a;
  }
  function Kh(h) {
    return typeof h == "number" && h > -1 && h % 1 == 0 && h <= s;
  }
  function kn(h) {
    var w = typeof h;
    return !!h && (w == "object" || w == "function");
  }
  function Rh(h) {
    return !!h && typeof h == "object";
  }
  function Qr(h) {
    return io(h) ? gh(h) : mh(h);
  }
  function Vh() {
    return [];
  }
  function zh() {
    return !1;
  }
  t.exports = Fh;
})(mr, mr.exports);
mr.exports;
var _s;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(_s || (_s = {}));
function A2(t, e) {
  return { type: _s.Address, version: t, hash160: e };
}
function $2(t) {
  return pi.c32address(t.version, t.hash160);
}
const v2 = (t) => Z1(m0(t)), B2 = (t) => gt(v2(t));
Q.hmacSha256Sync = (t, ...e) => {
  const n = y0.create(m0, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function H2(t, e = "mainnet") {
  e = g0(e), t = typeof t == "string" ? ht(t) : t;
  const n = K1(kt.P2PKH, e), r = A2(n, B2(t));
  return $2(r);
}
function _2(t, e) {
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
  const s = r.issuer.publicKey, i = H2(s);
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
function L2(t, e = null) {
  let n;
  e ? n = _2(t, e) : n = ot.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const ec = "_blockstackDidCheckEchoReply", I2 = "echoReply", U2 = "authContinuation";
function O2(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function C2() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[ec];
  if (typeof e == "boolean")
    return e;
  const n = O2(t.location.search), r = n[I2];
  if (r) {
    t[ec] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[U2];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class Ls {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new ua();
    else
      throw new Qh("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new No(e.sessionOptions) : this.store = new No() : e ? this.store = new Do(e.sessionOptions) : this.store = new Do();
  }
  makeAuthRequestToken(e, n, r, s, i, o = el().getTime(), c = {}) {
    const f = this.appConfig;
    if (!f)
      throw new xs("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || f.redirectURI(), r = r || f.manifestURI(), s = s || f.scopes, i = i || f.appDomain, y1(e, n, r, s, i, o, c);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = w1();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = Zs("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (C2())
        return je.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      je.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = Sl()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Tn("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = ot.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await $1(e))
      throw new Tn("Invalid authentication response.");
    let c = i.private_key, f = i.core_token;
    if (es(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            c = await Co(s, i.private_key);
          } catch {
            if (je.warn("Failed decryption of appPrivateKey, will try to use as given"), !Q.isValidPrivateKey(i.private_key))
              throw new Tn("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (f != null)
          try {
            f = await Co(s, f);
          } catch {
            je.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Tn("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let d = gl, l;
    es(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (d = i.hubUrl), es(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (l = i.associationToken);
    const a = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: u0(i.iss),
      appPrivateKey: c,
      coreSessionToken: f,
      authResponseToken: e,
      hubUrl: d,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: l
    }, b = i.profile_url;
    if (!a.profile && b) {
      const u = await n(b);
      if (!u.ok)
        a.profile = Object.assign({}, Zh);
      else {
        const p = await u.text(), y = JSON.parse(p);
        a.profile = L2(y[0].token);
      }
    } else
      a.profile = i.profile;
    return r.userData = a, this.store.setSessionData(r), a;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new xs("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), hd(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), ld(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
Ls.prototype.makeAuthRequest = Ls.prototype.makeAuthRequestToken;
(function() {
  (function(t) {
    (function(e) {
      var n = typeof globalThis < "u" && globalThis || typeof t < "u" && t || // eslint-disable-next-line no-undef
      typeof it < "u" && it || {}, r = {
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
      function s(g) {
        return g && DataView.prototype.isPrototypeOf(g);
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
        ], o = ArrayBuffer.isView || function(g) {
          return g && i.indexOf(Object.prototype.toString.call(g)) > -1;
        };
      function c(g) {
        if (typeof g != "string" && (g = String(g)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(g) || g === "")
          throw new TypeError('Invalid character in header field name: "' + g + '"');
        return g.toLowerCase();
      }
      function f(g) {
        return typeof g != "string" && (g = String(g)), g;
      }
      function d(g) {
        var m = {
          next: function() {
            var L = g.shift();
            return { done: L === void 0, value: L };
          }
        };
        return r.iterable && (m[Symbol.iterator] = function() {
          return m;
        }), m;
      }
      function l(g) {
        this.map = {}, g instanceof l ? g.forEach(function(m, L) {
          this.append(L, m);
        }, this) : Array.isArray(g) ? g.forEach(function(m) {
          if (m.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + m.length);
          this.append(m[0], m[1]);
        }, this) : g && Object.getOwnPropertyNames(g).forEach(function(m) {
          this.append(m, g[m]);
        }, this);
      }
      l.prototype.append = function(g, m) {
        g = c(g), m = f(m);
        var L = this.map[g];
        this.map[g] = L ? L + ", " + m : m;
      }, l.prototype.delete = function(g) {
        delete this.map[c(g)];
      }, l.prototype.get = function(g) {
        return g = c(g), this.has(g) ? this.map[g] : null;
      }, l.prototype.has = function(g) {
        return this.map.hasOwnProperty(c(g));
      }, l.prototype.set = function(g, m) {
        this.map[c(g)] = f(m);
      }, l.prototype.forEach = function(g, m) {
        for (var L in this.map)
          this.map.hasOwnProperty(L) && g.call(m, this.map[L], L, this);
      }, l.prototype.keys = function() {
        var g = [];
        return this.forEach(function(m, L) {
          g.push(L);
        }), d(g);
      }, l.prototype.values = function() {
        var g = [];
        return this.forEach(function(m) {
          g.push(m);
        }), d(g);
      }, l.prototype.entries = function() {
        var g = [];
        return this.forEach(function(m, L) {
          g.push([L, m]);
        }), d(g);
      }, r.iterable && (l.prototype[Symbol.iterator] = l.prototype.entries);
      function a(g) {
        if (!g._noBody) {
          if (g.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          g.bodyUsed = !0;
        }
      }
      function b(g) {
        return new Promise(function(m, L) {
          g.onload = function() {
            m(g.result);
          }, g.onerror = function() {
            L(g.error);
          };
        });
      }
      function u(g) {
        var m = new FileReader(), L = b(m);
        return m.readAsArrayBuffer(g), L;
      }
      function p(g) {
        var m = new FileReader(), L = b(m), D = /charset=([A-Za-z0-9_-]+)/.exec(g.type), K = D ? D[1] : "utf-8";
        return m.readAsText(g, K), L;
      }
      function y(g) {
        for (var m = new Uint8Array(g), L = new Array(m.length), D = 0; D < m.length; D++)
          L[D] = String.fromCharCode(m[D]);
        return L.join("");
      }
      function A(g) {
        if (g.slice)
          return g.slice(0);
        var m = new Uint8Array(g.byteLength);
        return m.set(new Uint8Array(g)), m.buffer;
      }
      function H() {
        return this.bodyUsed = !1, this._initBody = function(g) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = g, g ? typeof g == "string" ? this._bodyText = g : r.blob && Blob.prototype.isPrototypeOf(g) ? this._bodyBlob = g : r.formData && FormData.prototype.isPrototypeOf(g) ? this._bodyFormData = g : r.searchParams && URLSearchParams.prototype.isPrototypeOf(g) ? this._bodyText = g.toString() : r.arrayBuffer && r.blob && s(g) ? (this._bodyArrayBuffer = A(g.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(g) || o(g)) ? this._bodyArrayBuffer = A(g) : this._bodyText = g = Object.prototype.toString.call(g) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof g == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(g) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var g = a(this);
          if (g)
            return g;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var g = a(this);
            return g || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
              this._bodyArrayBuffer.buffer.slice(
                this._bodyArrayBuffer.byteOffset,
                this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
              )
            ) : Promise.resolve(this._bodyArrayBuffer));
          } else {
            if (r.blob)
              return this.blob().then(u);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var g = a(this);
          if (g)
            return g;
          if (this._bodyBlob)
            return p(this._bodyBlob);
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
      var _ = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function x(g) {
        var m = g.toUpperCase();
        return _.indexOf(m) > -1 ? m : g;
      }
      function v(g, m) {
        if (!(this instanceof v))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        m = m || {};
        var L = m.body;
        if (g instanceof v) {
          if (g.bodyUsed)
            throw new TypeError("Already read");
          this.url = g.url, this.credentials = g.credentials, m.headers || (this.headers = new l(g.headers)), this.method = g.method, this.mode = g.mode, this.signal = g.signal, !L && g._bodyInit != null && (L = g._bodyInit, g.bodyUsed = !0);
        } else
          this.url = String(g);
        if (this.credentials = m.credentials || this.credentials || "same-origin", (m.headers || !this.headers) && (this.headers = new l(m.headers)), this.method = x(m.method || this.method || "GET"), this.mode = m.mode || this.mode || null, this.signal = m.signal || this.signal || function() {
          if ("AbortController" in n) {
            var P = new AbortController();
            return P.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && L)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(L), (this.method === "GET" || this.method === "HEAD") && (m.cache === "no-store" || m.cache === "no-cache")) {
          var D = /([?&])_=[^&]*/;
          if (D.test(this.url))
            this.url = this.url.replace(D, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var K = /\?/;
            this.url += (K.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      v.prototype.clone = function() {
        return new v(this, { body: this._bodyInit });
      };
      function S(g) {
        var m = new FormData();
        return g.trim().split("&").forEach(function(L) {
          if (L) {
            var D = L.split("="), K = D.shift().replace(/\+/g, " "), P = D.join("=").replace(/\+/g, " ");
            m.append(decodeURIComponent(K), decodeURIComponent(P));
          }
        }), m;
      }
      function C(g) {
        var m = new l(), L = g.replace(/\r?\n[\t ]+/g, " ");
        return L.split("\r").map(function(D) {
          return D.indexOf(`
`) === 0 ? D.substr(1, D.length) : D;
        }).forEach(function(D) {
          var K = D.split(":"), P = K.shift().trim();
          if (P) {
            var Te = K.join(":").trim();
            try {
              m.append(P, Te);
            } catch (ln) {
              console.warn("Response " + ln.message);
            }
          }
        }), m;
      }
      H.call(v.prototype);
      function N(g, m) {
        if (!(this instanceof N))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (m || (m = {}), this.type = "default", this.status = m.status === void 0 ? 200 : m.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = m.statusText === void 0 ? "" : "" + m.statusText, this.headers = new l(m.headers), this.url = m.url || "", this._initBody(g);
      }
      H.call(N.prototype), N.prototype.clone = function() {
        return new N(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new l(this.headers),
          url: this.url
        });
      }, N.error = function() {
        var g = new N(null, { status: 200, statusText: "" });
        return g.ok = !1, g.status = 0, g.type = "error", g;
      };
      var I = [301, 302, 303, 307, 308];
      N.redirect = function(g, m) {
        if (I.indexOf(m) === -1)
          throw new RangeError("Invalid status code");
        return new N(null, { status: m, headers: { location: g } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(m, L) {
          this.message = m, this.name = L;
          var D = Error(m);
          this.stack = D.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function U(g, m) {
        return new Promise(function(L, D) {
          var K = new v(g, m);
          if (K.signal && K.signal.aborted)
            return D(new e.DOMException("Aborted", "AbortError"));
          var P = new XMLHttpRequest();
          function Te() {
            P.abort();
          }
          P.onload = function() {
            var tt = {
              statusText: P.statusText,
              headers: C(P.getAllResponseHeaders() || "")
            };
            K.url.indexOf("file://") === 0 && (P.status < 200 || P.status > 599) ? tt.status = 200 : tt.status = P.status, tt.url = "responseURL" in P ? P.responseURL : tt.headers.get("X-Request-URL");
            var R = "response" in P ? P.response : P.responseText;
            setTimeout(function() {
              L(new N(R, tt));
            }, 0);
          }, P.onerror = function() {
            setTimeout(function() {
              D(new TypeError("Network request failed"));
            }, 0);
          }, P.ontimeout = function() {
            setTimeout(function() {
              D(new TypeError("Network request timed out"));
            }, 0);
          }, P.onabort = function() {
            setTimeout(function() {
              D(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function ln(tt) {
            try {
              return tt === "" && n.location.href ? n.location.href : tt;
            } catch {
              return tt;
            }
          }
          if (P.open(K.method, ln(K.url), !0), K.credentials === "include" ? P.withCredentials = !0 : K.credentials === "omit" && (P.withCredentials = !1), "responseType" in P && (r.blob ? P.responseType = "blob" : r.arrayBuffer && (P.responseType = "arraybuffer")), m && typeof m.headers == "object" && !(m.headers instanceof l || n.Headers && m.headers instanceof n.Headers)) {
            var On = [];
            Object.getOwnPropertyNames(m.headers).forEach(function(tt) {
              On.push(c(tt)), P.setRequestHeader(tt, f(m.headers[tt]));
            }), K.headers.forEach(function(tt, R) {
              On.indexOf(R) === -1 && P.setRequestHeader(R, tt);
            });
          } else
            K.headers.forEach(function(tt, R) {
              P.setRequestHeader(R, tt);
            });
          K.signal && (K.signal.addEventListener("abort", Te), P.onreadystatechange = function() {
            P.readyState === 4 && K.signal.removeEventListener("abort", Te);
          }), P.send(typeof K._bodyInit > "u" ? null : K._bodyInit);
        });
      }
      return U.polyfill = !0, n.fetch || (n.fetch = U, n.Headers = l, n.Request = v, n.Response = N), e.Headers = l, e.Request = v, e.Response = N, e.fetch = U, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : it);
})();
const P2 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function D2(t, e) {
  const n = {};
  return Object.assign(n, P2, e), await fetch(t, n);
}
function N2(t) {
  let e = D2, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function k2(...t) {
  const { fetchLib: e, middlewares: n } = N2(t);
  return async (s, i) => {
    let o = { url: s, init: i ?? {} };
    for (const f of n)
      typeof f.pre == "function" && (o = await Promise.resolve(f.pre({
        fetch: e,
        ...o
      })) ?? o);
    let c = await e(o.url, o.init);
    for (const f of n)
      typeof f.post == "function" && (c = await Promise.resolve(f.post({
        fetch: e,
        url: o.url,
        init: o.init,
        response: (c == null ? void 0 : c.clone()) ?? c
      })) ?? c);
    return c;
  };
}
var nn;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(nn || (nn = {}));
var Ue;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ue || (Ue = {}));
var nc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(nc || (nc = {}));
const F2 = "https://api.mainnet.hiro.so", T2 = "https://api.testnet.hiro.so", M2 = "http://localhost:3999", G2 = ["mainnet", "testnet", "devnet", "mocknet"];
class Oe {
  constructor(e) {
    this.version = Ue.Mainnet, this.chainId = nn.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ue.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? k2();
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
      return new Is();
    case "testnet":
      return new Us();
    case "devnet":
      return new K2();
    case "mocknet":
      return new L0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${G2.join(", ")}`);
  }
};
Oe.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Oe.fromName(t);
class Is extends Oe {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? F2,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ue.Mainnet, this.chainId = nn.Mainnet;
  }
}
class Us extends Oe {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? T2,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ue.Testnet, this.chainId = nn.Testnet;
  }
}
class L0 extends Oe {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? M2,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ue.Testnet, this.chainId = nn.Testnet;
  }
}
const K2 = L0;
var Os;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Os || (Os = {}));
var rc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(rc || (rc = {}));
Os.Mainnet;
var Er;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Er || (Er = {}));
var sc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(sc || (sc = {}));
Er.Mainnet;
const R2 = 128, V2 = 128, I0 = 16;
var ic;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ic || (ic = {}));
var oc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(oc || (oc = {}));
var wt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(wt || (wt = {}));
const cs = ["onChainOnly", "offChainOnly", "any"];
cs[0] + "", wt.OnChainOnly, cs[1] + "", wt.OffChainOnly, cs[2] + "", wt.Any, wt.OnChainOnly + "", wt.OnChainOnly, wt.OffChainOnly + "", wt.OffChainOnly, wt.Any + "", wt.Any;
var cc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(cc || (cc = {}));
var ac;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(ac || (ac = {}));
var fc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(fc || (fc = {}));
var hc;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(hc || (hc = {}));
var lc;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(lc || (lc = {}));
var uc;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(uc || (uc = {}));
var dc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(dc || (dc = {}));
var bc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(bc || (bc = {}));
var gc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(gc || (gc = {}));
var pc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(pc || (pc = {}));
var xc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(xc || (xc = {}));
var wc;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(wc || (wc = {}));
var yc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(yc || (yc = {}));
let z2 = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, j2 = class extends z2 {
  constructor(e) {
    super(e);
  }
};
function Cs(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function q2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function U0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function W2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Cs(t.outputLen), Cs(t.blockLen);
}
function X2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Z2(t, e) {
  U0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const as = {
  number: Cs,
  bool: q2,
  bytes: U0,
  hash: W2,
  exists: X2,
  output: Z2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const fs = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), $t = (t, e) => t << 32 - e | t >>> e, Y2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Y2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function J2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function O0(t) {
  if (typeof t == "string" && (t = J2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Q2 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ne(t) {
  const e = (r) => t().update(O0(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function tb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), f = r ? 4 : 0, d = r ? 0 : 4;
  t.setUint32(e + f, o, r), t.setUint32(e + d, c, r);
}
let Si = class extends Q2 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = fs(this.buffer);
  }
  update(e) {
    as.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = O0(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const f = fs(e);
        for (; s <= i - o; o += s)
          this.process(f, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    as.exists(this), as.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let a = o; a < s; a++)
      n[a] = 0;
    tb(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = fs(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = f / 4, l = this.get();
    if (d > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let a = 0; a < d; a++)
      c.setUint32(4 * a, l[a], i);
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
const eb = (t, e, n) => t & e ^ ~t & n, nb = (t, e, n) => t & e ^ t & n ^ e & n, rb = new Uint32Array([
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
let C0 = class extends Si {
  constructor() {
    super(64, 32, 8, !1), this.A = ee[0] | 0, this.B = ee[1] | 0, this.C = ee[2] | 0, this.D = ee[3] | 0, this.E = ee[4] | 0, this.F = ee[5] | 0, this.G = ee[6] | 0, this.H = ee[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: o, G: c, H: f } = this;
    return [e, n, r, s, i, o, c, f];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, f) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = c | 0, this.H = f | 0;
  }
  process(e, n) {
    for (let a = 0; a < 16; a++, n += 4)
      ne[a] = e.getUint32(n, !1);
    for (let a = 16; a < 64; a++) {
      const b = ne[a - 15], u = ne[a - 2], p = $t(b, 7) ^ $t(b, 18) ^ b >>> 3, y = $t(u, 17) ^ $t(u, 19) ^ u >>> 10;
      ne[a] = y + ne[a - 7] + p + ne[a - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: f, G: d, H: l } = this;
    for (let a = 0; a < 64; a++) {
      const b = $t(c, 6) ^ $t(c, 11) ^ $t(c, 25), u = l + b + eb(c, f, d) + rb[a] + ne[a] | 0, y = ($t(r, 2) ^ $t(r, 13) ^ $t(r, 22)) + nb(r, s, i) | 0;
      l = d, d = f, f = c, c = o + u | 0, o = i, i = s, s = r, r = u + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, f = f + this.F | 0, d = d + this.G | 0, l = l + this.H | 0, this.set(r, s, i, o, c, f, d, l);
  }
  roundClean() {
    ne.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, sb = class extends C0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Ne(() => new C0());
Ne(() => new sb());
const ib = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), P0 = Uint8Array.from({ length: 16 }, (t, e) => e), ob = P0.map((t) => (9 * t + 5) % 16);
let mi = [P0], Ei = [ob];
for (let t = 0; t < 4; t++)
  for (let e of [mi, Ei])
    e.push(e[t].map((n) => ib[n]));
const D0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), cb = mi.map((t, e) => t.map((n) => D0[e][n])), ab = Ei.map((t, e) => t.map((n) => D0[e][n])), fb = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), hb = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Jn = (t, e) => t << e | t >>> 32 - e;
function Sc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Qn = new Uint32Array(16);
let lb = class extends Si {
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
    for (let u = 0; u < 16; u++, n += 4)
      Qn[u] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, f = c, d = this.h3 | 0, l = d, a = this.h4 | 0, b = a;
    for (let u = 0; u < 5; u++) {
      const p = 4 - u, y = fb[u], A = hb[u], H = mi[u], _ = Ei[u], x = cb[u], v = ab[u];
      for (let S = 0; S < 16; S++) {
        const C = Jn(r + Sc(u, i, c, d) + Qn[H[S]] + y, x[S]) + a | 0;
        r = a, a = d, d = Jn(c, 10) | 0, c = i, i = C;
      }
      for (let S = 0; S < 16; S++) {
        const C = Jn(s + Sc(p, o, f, l) + Qn[_[S]] + A, v[S]) + b | 0;
        s = b, b = l, l = Jn(f, 10) | 0, f = o, o = C;
      }
    }
    this.set(this.h1 + c + l | 0, this.h2 + d + b | 0, this.h3 + a + s | 0, this.h4 + r + o | 0, this.h0 + i + f | 0);
  }
  roundClean() {
    Qn.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Ne(() => new lb());
const tr = BigInt(2 ** 32 - 1), Ps = BigInt(32);
function N0(t, e = !1) {
  return e ? { h: Number(t & tr), l: Number(t >> Ps & tr) } : { h: Number(t >> Ps & tr) | 0, l: Number(t & tr) | 0 };
}
function ub(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = N0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const db = (t, e) => BigInt(t >>> 0) << Ps | BigInt(e >>> 0), bb = (t, e, n) => t >>> n, gb = (t, e, n) => t << 32 - n | e >>> n, pb = (t, e, n) => t >>> n | e << 32 - n, xb = (t, e, n) => t << 32 - n | e >>> n, wb = (t, e, n) => t << 64 - n | e >>> n - 32, yb = (t, e, n) => t >>> n - 32 | e << 64 - n, Sb = (t, e) => e, mb = (t, e) => t, Eb = (t, e, n) => t << n | e >>> 32 - n, Ab = (t, e, n) => e << n | t >>> 32 - n, $b = (t, e, n) => e << n - 32 | t >>> 64 - n, vb = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Bb(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Hb = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), _b = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Lb = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Ib = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Ub = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Ob = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, T = {
  fromBig: N0,
  split: ub,
  toBig: db,
  shrSH: bb,
  shrSL: gb,
  rotrSH: pb,
  rotrSL: xb,
  rotrBH: wb,
  rotrBL: yb,
  rotr32H: Sb,
  rotr32L: mb,
  rotlSH: Eb,
  rotlSL: Ab,
  rotlBH: $b,
  rotlBL: vb,
  add: Bb,
  add3L: Hb,
  add3H: _b,
  add4L: Lb,
  add4H: Ib,
  add5H: Ob,
  add5L: Ub
}, [Cb, Pb] = T.split([
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
let Fr = class extends Si {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: f, Eh: d, El: l, Fh: a, Fl: b, Gh: u, Gl: p, Hh: y, Hl: A } = this;
    return [e, n, r, s, i, o, c, f, d, l, a, b, u, p, y, A];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, f, d, l, a, b, u, p, y, A) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = f | 0, this.Eh = d | 0, this.El = l | 0, this.Fh = a | 0, this.Fl = b | 0, this.Gh = u | 0, this.Gl = p | 0, this.Hh = y | 0, this.Hl = A | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      re[x] = e.getUint32(n), se[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const v = re[x - 15] | 0, S = se[x - 15] | 0, C = T.rotrSH(v, S, 1) ^ T.rotrSH(v, S, 8) ^ T.shrSH(v, S, 7), N = T.rotrSL(v, S, 1) ^ T.rotrSL(v, S, 8) ^ T.shrSL(v, S, 7), I = re[x - 2] | 0, U = se[x - 2] | 0, g = T.rotrSH(I, U, 19) ^ T.rotrBH(I, U, 61) ^ T.shrSH(I, U, 6), m = T.rotrSL(I, U, 19) ^ T.rotrBL(I, U, 61) ^ T.shrSL(I, U, 6), L = T.add4L(N, m, se[x - 7], se[x - 16]), D = T.add4H(L, C, g, re[x - 7], re[x - 16]);
      re[x] = D | 0, se[x] = L | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: f, Dh: d, Dl: l, Eh: a, El: b, Fh: u, Fl: p, Gh: y, Gl: A, Hh: H, Hl: _ } = this;
    for (let x = 0; x < 80; x++) {
      const v = T.rotrSH(a, b, 14) ^ T.rotrSH(a, b, 18) ^ T.rotrBH(a, b, 41), S = T.rotrSL(a, b, 14) ^ T.rotrSL(a, b, 18) ^ T.rotrBL(a, b, 41), C = a & u ^ ~a & y, N = b & p ^ ~b & A, I = T.add5L(_, S, N, Pb[x], se[x]), U = T.add5H(I, H, v, C, Cb[x], re[x]), g = I | 0, m = T.rotrSH(r, s, 28) ^ T.rotrBH(r, s, 34) ^ T.rotrBH(r, s, 39), L = T.rotrSL(r, s, 28) ^ T.rotrBL(r, s, 34) ^ T.rotrBL(r, s, 39), D = r & i ^ r & c ^ i & c, K = s & o ^ s & f ^ o & f;
      H = y | 0, _ = A | 0, y = u | 0, A = p | 0, u = a | 0, p = b | 0, { h: a, l: b } = T.add(d | 0, l | 0, U | 0, g | 0), d = c | 0, l = f | 0, c = i | 0, f = o | 0, i = r | 0, o = s | 0;
      const P = T.add3L(g, L, K);
      r = T.add3H(P, U, m, D), s = P | 0;
    }
    ({ h: r, l: s } = T.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = T.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l: f } = T.add(this.Ch | 0, this.Cl | 0, c | 0, f | 0), { h: d, l } = T.add(this.Dh | 0, this.Dl | 0, d | 0, l | 0), { h: a, l: b } = T.add(this.Eh | 0, this.El | 0, a | 0, b | 0), { h: u, l: p } = T.add(this.Fh | 0, this.Fl | 0, u | 0, p | 0), { h: y, l: A } = T.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: H, l: _ } = T.add(this.Hh | 0, this.Hl | 0, H | 0, _ | 0), this.set(r, s, i, o, c, f, d, l, a, b, u, p, y, A, H, _);
  }
  roundClean() {
    re.fill(0), se.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Db = class extends Fr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Nb = class extends Fr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, kb = class extends Fr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ne(() => new Fr());
Ne(() => new Db());
Ne(() => new Nb());
Ne(() => new kb());
var et;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(et || (et = {}));
var Ds;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Ds || (Ds = {}));
function Ai(t) {
  return Ds[t];
}
var Ar;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Ar || (Ar = {}));
function k0(t, e, n) {
  const s = R2;
  if (Zb(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Ar.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
function F0(t) {
  const e = pi.c32addressDecode(t);
  return {
    type: Ar.Address,
    version: e[0],
    hash160: e[1]
  };
}
function T0(t) {
  const e = [];
  return e.push(ht(Ys(t.version, 1))), e.push(ht(t.hash160)), on(e);
}
function M0(t) {
  const e = [], n = vn(t.content), r = n.byteLength;
  return e.push(ht(Ys(r, t.lengthPrefixBytes))), e.push(n), on(e);
}
function It(t, e) {
  return on([Ai(t), e]);
}
function Fb(t) {
  return new Uint8Array([Ai(t.type)]);
}
function Tb(t) {
  return t.type === et.OptionalNone ? new Uint8Array([Ai(t.type)]) : It(t.type, Ln(t.value));
}
function Mb(t) {
  const e = new Uint8Array(4);
  return _r(e, Math.ceil(t.value.length / 2), 0), It(t.type, Gt(e, ht(t.value)));
}
function Gb(t) {
  const e = ha(cl(BigInt(t.value), BigInt(V2)), I0);
  return It(t.type, e);
}
function Kb(t) {
  const e = ha(BigInt(t.value), I0);
  return It(t.type, e);
}
function Rb(t) {
  return It(t.type, T0(F0(t.value)));
}
function Vb(t) {
  const [e, n] = Yb(t.value);
  return It(t.type, Gt(T0(F0(e)), M0(k0(n))));
}
function zb(t) {
  return It(t.type, Ln(t.value));
}
function jb(t) {
  const e = [], n = new Uint8Array(4);
  _r(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = Ln(r);
    e.push(s);
  }
  return It(t.type, on(e));
}
function qb(t) {
  const e = [], n = new Uint8Array(4);
  _r(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = k0(s);
    e.push(M0(i));
    const o = Ln(t.value[s]);
    e.push(o);
  }
  return It(t.type, on(e));
}
function G0(t, e) {
  const n = [], r = e == "ascii" ? fl(t.value) : vn(t.value), s = new Uint8Array(4);
  return _r(s, r.length, 0), n.push(s), n.push(r), It(t.type, on(n));
}
function Wb(t) {
  return G0(t, "ascii");
}
function Xb(t) {
  return G0(t, "utf8");
}
function mc(t) {
  return gt(Ln(t));
}
function Ln(t) {
  switch (t.type) {
    case et.BoolTrue:
    case et.BoolFalse:
      return Fb(t);
    case et.OptionalNone:
    case et.OptionalSome:
      return Tb(t);
    case et.Buffer:
      return Mb(t);
    case et.UInt:
      return Kb(t);
    case et.Int:
      return Gb(t);
    case et.PrincipalStandard:
      return Rb(t);
    case et.PrincipalContract:
      return Vb(t);
    case et.ResponseOk:
    case et.ResponseErr:
      return zb(t);
    case et.List:
      return jb(t);
    case et.Tuple:
      return qb(t);
    case et.StringASCII:
      return Wb(t);
    case et.StringUTF8:
      return Xb(t);
    default:
      throw new j2("Unable to serialize. Invalid Clarity Value.");
  }
}
const Zb = (t, e) => t ? vn(t).length > e : !1;
function Yb(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
function Jb(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = An(r);
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
    return BigInt(`0x${eg(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function $i(t, e = 8) {
  return (typeof t == "bigint" ? t : Jb(t)).toString(16).padStart(e * 2, "0");
}
function K0(t, e = 16) {
  const n = $i(t, e);
  return An(n);
}
function Qb(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const tg = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function eg(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += tg[n];
  return e;
}
function An(t) {
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
function vi(t) {
  return new TextEncoder().encode(t);
}
function ng(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function rg(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Ec(t) {
  if (t.some(rg))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Bi(...t) {
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
function fn(t) {
  return Bi(...t.map((e) => typeof e == "number" ? Ec([e]) : e instanceof Array ? Ec(e) : e));
}
function Tr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Ns;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Ns || (Ns = {}));
Ns.Mainnet;
const sg = 128, ig = 128, R0 = 16;
var ks;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ks || (ks = {}));
var Ac;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ac || (Ac = {}));
var $c;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})($c || ($c = {}));
var yt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(yt || (yt = {}));
const hs = ["onChainOnly", "offChainOnly", "any"];
hs[0] + "", yt.OnChainOnly, hs[1] + "", yt.OffChainOnly, hs[2] + "", yt.Any, yt.OnChainOnly + "", yt.OnChainOnly, yt.OffChainOnly + "", yt.OffChainOnly, yt.Any + "", yt.Any;
var Fs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Fs || (Fs = {}));
Fs.Mainnet;
var vc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(vc || (vc = {}));
var Bc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Bc || (Bc = {}));
var Hc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Hc || (Hc = {}));
var _c;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(_c || (_c = {}));
var Lc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Lc || (Lc = {}));
var Ic;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ic || (Ic = {}));
var Uc;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Uc || (Uc = {}));
var Oc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Oc || (Oc = {}));
var Cc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Cc || (Cc = {}));
var Pc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Pc || (Pc = {}));
var Dc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Dc || (Dc = {}));
function Ts(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function og(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function V0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function cg(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ts(t.outputLen), Ts(t.blockLen);
}
function ag(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function fg(t, e) {
  V0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ls = {
  number: Ts,
  bool: og,
  bytes: V0,
  hash: cg,
  exists: ag,
  output: fg
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const us = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), vt = (t, e) => t << 32 - e | t >>> e, hg = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!hg)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function lg(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function z0(t) {
  if (typeof t == "string" && (t = lg(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let ug = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ke(t) {
  const e = (r) => t().update(z0(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function dg(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), f = r ? 4 : 0, d = r ? 0 : 4;
  t.setUint32(e + f, o, r), t.setUint32(e + d, c, r);
}
let Hi = class extends ug {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = us(this.buffer);
  }
  update(e) {
    ls.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = z0(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const f = us(e);
        for (; s <= i - o; o += s)
          this.process(f, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ls.exists(this), ls.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let a = o; a < s; a++)
      n[a] = 0;
    dg(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = us(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = f / 4, l = this.get();
    if (d > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let a = 0; a < d; a++)
      c.setUint32(4 * a, l[a], i);
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
const bg = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), j0 = Uint8Array.from({ length: 16 }, (t, e) => e), gg = j0.map((t) => (9 * t + 5) % 16);
let _i = [j0], Li = [gg];
for (let t = 0; t < 4; t++)
  for (let e of [_i, Li])
    e.push(e[t].map((n) => bg[n]));
const q0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), pg = _i.map((t, e) => t.map((n) => q0[e][n])), xg = Li.map((t, e) => t.map((n) => q0[e][n])), wg = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), yg = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), er = (t, e) => t << e | t >>> 32 - e;
function Nc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const nr = new Uint32Array(16);
let Sg = class extends Hi {
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
    for (let u = 0; u < 16; u++, n += 4)
      nr[u] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, f = c, d = this.h3 | 0, l = d, a = this.h4 | 0, b = a;
    for (let u = 0; u < 5; u++) {
      const p = 4 - u, y = wg[u], A = yg[u], H = _i[u], _ = Li[u], x = pg[u], v = xg[u];
      for (let S = 0; S < 16; S++) {
        const C = er(r + Nc(u, i, c, d) + nr[H[S]] + y, x[S]) + a | 0;
        r = a, a = d, d = er(c, 10) | 0, c = i, i = C;
      }
      for (let S = 0; S < 16; S++) {
        const C = er(s + Nc(p, o, f, l) + nr[_[S]] + A, v[S]) + b | 0;
        s = b, b = l, l = er(f, 10) | 0, f = o, o = C;
      }
    }
    this.set(this.h1 + c + l | 0, this.h2 + d + b | 0, this.h3 + a + s | 0, this.h4 + r + o | 0, this.h0 + i + f | 0);
  }
  roundClean() {
    nr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
ke(() => new Sg());
const mg = (t, e, n) => t & e ^ ~t & n, Eg = (t, e, n) => t & e ^ t & n ^ e & n, Ag = new Uint32Array([
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
]), ie = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), oe = new Uint32Array(64);
let W0 = class extends Hi {
  constructor() {
    super(64, 32, 8, !1), this.A = ie[0] | 0, this.B = ie[1] | 0, this.C = ie[2] | 0, this.D = ie[3] | 0, this.E = ie[4] | 0, this.F = ie[5] | 0, this.G = ie[6] | 0, this.H = ie[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: o, G: c, H: f } = this;
    return [e, n, r, s, i, o, c, f];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, f) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = c | 0, this.H = f | 0;
  }
  process(e, n) {
    for (let a = 0; a < 16; a++, n += 4)
      oe[a] = e.getUint32(n, !1);
    for (let a = 16; a < 64; a++) {
      const b = oe[a - 15], u = oe[a - 2], p = vt(b, 7) ^ vt(b, 18) ^ b >>> 3, y = vt(u, 17) ^ vt(u, 19) ^ u >>> 10;
      oe[a] = y + oe[a - 7] + p + oe[a - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: f, G: d, H: l } = this;
    for (let a = 0; a < 64; a++) {
      const b = vt(c, 6) ^ vt(c, 11) ^ vt(c, 25), u = l + b + mg(c, f, d) + Ag[a] + oe[a] | 0, y = (vt(r, 2) ^ vt(r, 13) ^ vt(r, 22)) + Eg(r, s, i) | 0;
      l = d, d = f, f = c, c = o + u | 0, o = i, i = s, s = r, r = u + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, f = f + this.F | 0, d = d + this.G | 0, l = l + this.H | 0, this.set(r, s, i, o, c, f, d, l);
  }
  roundClean() {
    oe.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, $g = class extends W0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
ke(() => new W0());
ke(() => new $g());
const rr = BigInt(2 ** 32 - 1), Ms = BigInt(32);
function X0(t, e = !1) {
  return e ? { h: Number(t & rr), l: Number(t >> Ms & rr) } : { h: Number(t >> Ms & rr) | 0, l: Number(t & rr) | 0 };
}
function vg(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = X0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Bg = (t, e) => BigInt(t >>> 0) << Ms | BigInt(e >>> 0), Hg = (t, e, n) => t >>> n, _g = (t, e, n) => t << 32 - n | e >>> n, Lg = (t, e, n) => t >>> n | e << 32 - n, Ig = (t, e, n) => t << 32 - n | e >>> n, Ug = (t, e, n) => t << 64 - n | e >>> n - 32, Og = (t, e, n) => t >>> n - 32 | e << 64 - n, Cg = (t, e) => e, Pg = (t, e) => t, Dg = (t, e, n) => t << n | e >>> 32 - n, Ng = (t, e, n) => e << n | t >>> 32 - n, kg = (t, e, n) => e << n - 32 | t >>> 64 - n, Fg = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Tg(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Mg = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Gg = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Kg = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Rg = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Vg = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), zg = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, M = {
  fromBig: X0,
  split: vg,
  toBig: Bg,
  shrSH: Hg,
  shrSL: _g,
  rotrSH: Lg,
  rotrSL: Ig,
  rotrBH: Ug,
  rotrBL: Og,
  rotr32H: Cg,
  rotr32L: Pg,
  rotlSH: Dg,
  rotlSL: Ng,
  rotlBH: kg,
  rotlBL: Fg,
  add: Tg,
  add3L: Mg,
  add3H: Gg,
  add4L: Kg,
  add4H: Rg,
  add5H: zg,
  add5L: Vg
}, [jg, qg] = M.split([
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
].map((t) => BigInt(t))), ce = new Uint32Array(80), ae = new Uint32Array(80);
let Mr = class extends Hi {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: f, Eh: d, El: l, Fh: a, Fl: b, Gh: u, Gl: p, Hh: y, Hl: A } = this;
    return [e, n, r, s, i, o, c, f, d, l, a, b, u, p, y, A];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, f, d, l, a, b, u, p, y, A) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = f | 0, this.Eh = d | 0, this.El = l | 0, this.Fh = a | 0, this.Fl = b | 0, this.Gh = u | 0, this.Gl = p | 0, this.Hh = y | 0, this.Hl = A | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      ce[x] = e.getUint32(n), ae[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const v = ce[x - 15] | 0, S = ae[x - 15] | 0, C = M.rotrSH(v, S, 1) ^ M.rotrSH(v, S, 8) ^ M.shrSH(v, S, 7), N = M.rotrSL(v, S, 1) ^ M.rotrSL(v, S, 8) ^ M.shrSL(v, S, 7), I = ce[x - 2] | 0, U = ae[x - 2] | 0, g = M.rotrSH(I, U, 19) ^ M.rotrBH(I, U, 61) ^ M.shrSH(I, U, 6), m = M.rotrSL(I, U, 19) ^ M.rotrBL(I, U, 61) ^ M.shrSL(I, U, 6), L = M.add4L(N, m, ae[x - 7], ae[x - 16]), D = M.add4H(L, C, g, ce[x - 7], ce[x - 16]);
      ce[x] = D | 0, ae[x] = L | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: f, Dh: d, Dl: l, Eh: a, El: b, Fh: u, Fl: p, Gh: y, Gl: A, Hh: H, Hl: _ } = this;
    for (let x = 0; x < 80; x++) {
      const v = M.rotrSH(a, b, 14) ^ M.rotrSH(a, b, 18) ^ M.rotrBH(a, b, 41), S = M.rotrSL(a, b, 14) ^ M.rotrSL(a, b, 18) ^ M.rotrBL(a, b, 41), C = a & u ^ ~a & y, N = b & p ^ ~b & A, I = M.add5L(_, S, N, qg[x], ae[x]), U = M.add5H(I, H, v, C, jg[x], ce[x]), g = I | 0, m = M.rotrSH(r, s, 28) ^ M.rotrBH(r, s, 34) ^ M.rotrBH(r, s, 39), L = M.rotrSL(r, s, 28) ^ M.rotrBL(r, s, 34) ^ M.rotrBL(r, s, 39), D = r & i ^ r & c ^ i & c, K = s & o ^ s & f ^ o & f;
      H = y | 0, _ = A | 0, y = u | 0, A = p | 0, u = a | 0, p = b | 0, { h: a, l: b } = M.add(d | 0, l | 0, U | 0, g | 0), d = c | 0, l = f | 0, c = i | 0, f = o | 0, i = r | 0, o = s | 0;
      const P = M.add3L(g, L, K);
      r = M.add3H(P, U, m, D), s = P | 0;
    }
    ({ h: r, l: s } = M.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = M.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l: f } = M.add(this.Ch | 0, this.Cl | 0, c | 0, f | 0), { h: d, l } = M.add(this.Dh | 0, this.Dl | 0, d | 0, l | 0), { h: a, l: b } = M.add(this.Eh | 0, this.El | 0, a | 0, b | 0), { h: u, l: p } = M.add(this.Fh | 0, this.Fl | 0, u | 0, p | 0), { h: y, l: A } = M.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: H, l: _ } = M.add(this.Hh | 0, this.Hl | 0, H | 0, _ | 0), this.set(r, s, i, o, c, f, d, l, a, b, u, p, y, A, H, _);
  }
  roundClean() {
    ce.fill(0), ae.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Wg = class extends Mr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Xg = class extends Mr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Zg = class extends Mr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ke(() => new Mr());
ke(() => new Wg());
ke(() => new Xg());
ke(() => new Zg());
function Yg(t, e, n) {
  const s = sg;
  if (up(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ks.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var nt;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(nt || (nt = {}));
let Jg = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Qg = class extends Jg {
  constructor(e) {
    super(e);
  }
};
function Z0(t) {
  const e = [];
  return e.push(An($i(t.version, 1))), e.push(An(t.hash160)), fn(e);
}
function Y0(t) {
  const e = [], n = vi(t.content), r = n.byteLength;
  return e.push(An($i(r, t.lengthPrefixBytes))), e.push(n), fn(e);
}
function Ut(t, e) {
  return fn([t, e]);
}
function tp(t) {
  return new Uint8Array([t.type]);
}
function ep(t) {
  return t.type === nt.OptionalNone ? new Uint8Array([t.type]) : Ut(t.type, rn(t.value));
}
function np(t) {
  const e = new Uint8Array(4);
  return Tr(e, t.buffer.length, 0), Ut(t.type, Bi(e, t.buffer));
}
function rp(t) {
  const e = K0(Qb(t.value, BigInt(ig)), R0);
  return Ut(t.type, e);
}
function sp(t) {
  const e = K0(t.value, R0);
  return Ut(t.type, e);
}
function ip(t) {
  return Ut(t.type, Z0(t.address));
}
function op(t) {
  return Ut(t.type, Bi(Z0(t.address), Y0(t.contractName)));
}
function cp(t) {
  return Ut(t.type, rn(t.value));
}
function ap(t) {
  const e = [], n = new Uint8Array(4);
  Tr(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = rn(r);
    e.push(s);
  }
  return Ut(t.type, fn(e));
}
function fp(t) {
  const e = [], n = new Uint8Array(4);
  Tr(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Yg(s);
    e.push(Y0(i));
    const o = rn(t.data[s]);
    e.push(o);
  }
  return Ut(t.type, fn(e));
}
function J0(t, e) {
  const n = [], r = e == "ascii" ? ng(t.data) : vi(t.data), s = new Uint8Array(4);
  return Tr(s, r.length, 0), n.push(s), n.push(r), Ut(t.type, fn(n));
}
function hp(t) {
  return J0(t, "ascii");
}
function lp(t) {
  return J0(t, "utf8");
}
function rn(t) {
  switch (t.type) {
    case nt.BoolTrue:
    case nt.BoolFalse:
      return tp(t);
    case nt.OptionalNone:
    case nt.OptionalSome:
      return ep(t);
    case nt.Buffer:
      return np(t);
    case nt.UInt:
      return sp(t);
    case nt.Int:
      return rp(t);
    case nt.PrincipalStandard:
      return ip(t);
    case nt.PrincipalContract:
      return op(t);
    case nt.ResponseOk:
    case nt.ResponseErr:
      return cp(t);
    case nt.List:
      return ap(t);
    case nt.Tuple:
      return fp(t);
    case nt.StringASCII:
      return hp(t);
    case nt.StringUTF8:
      return lp(t);
    default:
      throw new Qg("Unable to serialize. Invalid Clarity Value.");
  }
}
const up = (t, e) => t ? vi(t).length > e : !1;
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var dp = Object.defineProperty, bp = Object.defineProperties, gp = Object.getOwnPropertyDescriptors, $r = Object.getOwnPropertySymbols, Q0 = Object.prototype.hasOwnProperty, tf = Object.prototype.propertyIsEnumerable, kc = (t, e, n) => e in t ? dp(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Gs = (t, e) => {
  for (var n in e || (e = {})) Q0.call(e, n) && kc(t, n, e[n]);
  if ($r) for (var n of $r(e)) tf.call(e, n) && kc(t, n, e[n]);
  return t;
}, Ks = (t, e) => bp(t, gp(e)), pp = (t, e) => {
  var n = {};
  for (var r in t) Q0.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && $r) for (var r of $r(t)) e.indexOf(r) < 0 && tf.call(t, r) && (n[r] = t[r]);
  return n;
};
function xp(t) {
  return t ? typeof t == "string" ? Oe.fromName(t) : "version" in t ? t : "url" in t ? new Is({ url: t.url }) : t.transactionVersion === Er.Mainnet ? new Is({ url: t.client.baseUrl }) : new Us({ url: t.client.baseUrl }) : new Us();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var wp = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(wp || {}), yp = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(yp || {}), ef = (t) => {
  let e = t;
  if (!e) {
    let n = new ua(["store_write"], document.location.href);
    e = new Ls({ appConfig: n });
  }
  return e;
};
function Sp(t) {
  try {
    return ef(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var mp = (t) => {
  let e = ef(t).loadUserData().appPrivateKey, n = ot.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function nf(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? Ks(Gs({}, t), { message: mc(e), domain: mc(n) }) : Ks(Gs({}, t), { message: gt(rn(e)), domain: gt(rn(n)) });
}
async function Ep(t, e) {
  return new ot.TokenSigner("ES256k", e).signAsync(nf(t));
}
async function Ap(t) {
  let e = t, { userSession: n } = e, r = pp(e, ["userSession"]);
  if (Sp(n)) {
    let { privateKey: s, publicKey: i } = mp(n), o = Ks(Gs({}, r), { publicKey: i });
    return Ep(o, s);
  }
  return ot.createUnsecuredToken(nf(t));
}
var $p = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))($p || {}), rf = "asigna-stx", Fc = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === rf && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(Bp(t, e), "*");
}), vp = { authenticationRequest: async (t) => Fc(t, "authenticationRequest"), transactionRequest: async (t) => Fc(t, "transactionRequest") }, Bp = (t, e) => ({ source: rf, [e]: t }), Hp = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = vp);
};
Hp();
function sf(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = $n(r);
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
    return BigInt(`0x${cf(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Ii(t, e = 8) {
  return (typeof t == "bigint" ? t : sf(t)).toString(16).padStart(e * 2, "0");
}
function of(t, e = 16) {
  const n = Ii(t, e);
  return $n(n);
}
function _p(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const Lp = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function cf(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Lp[n];
  return e;
}
function $n(t) {
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
function Ui(t) {
  return new TextEncoder().encode(t);
}
function Ip(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Up(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Tc(t) {
  if (t.some(Up))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Oi(...t) {
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
function hn(t) {
  return Oi(...t.map((e) => typeof e == "number" ? Tc([e]) : e instanceof Array ? Tc(e) : e));
}
function Gr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Rs;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Rs || (Rs = {}));
Rs.Mainnet;
const Op = 128, Cp = 128, af = 16;
var Vs;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Vs || (Vs = {}));
var Mc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Mc || (Mc = {}));
var Gc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Gc || (Gc = {}));
var St;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(St || (St = {}));
const ds = ["onChainOnly", "offChainOnly", "any"];
ds[0] + "", St.OnChainOnly, ds[1] + "", St.OffChainOnly, ds[2] + "", St.Any, St.OnChainOnly + "", St.OnChainOnly, St.OffChainOnly + "", St.OffChainOnly, St.Any + "", St.Any;
var zs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(zs || (zs = {}));
zs.Mainnet;
var Kc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Kc || (Kc = {}));
var Rc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Rc || (Rc = {}));
var Vc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Vc || (Vc = {}));
var zc;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(zc || (zc = {}));
var jc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(jc || (jc = {}));
var qc;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(qc || (qc = {}));
var Wc;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Wc || (Wc = {}));
var Xc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Xc || (Xc = {}));
var Zc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Zc || (Zc = {}));
var Yc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Yc || (Yc = {}));
var Jc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Jc || (Jc = {}));
function js(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Pp(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function ff(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Dp(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  js(t.outputLen), js(t.blockLen);
}
function Np(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function kp(t, e) {
  ff(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const bs = {
  number: js,
  bool: Pp,
  bytes: ff,
  hash: Dp,
  exists: Np,
  output: kp
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const gs = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Bt = (t, e) => t << 32 - e | t >>> e, Fp = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Fp)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Tp(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function hf(t) {
  if (typeof t == "string" && (t = Tp(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Mp {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Fe(t) {
  const e = (r) => t().update(hf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Gp(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), f = r ? 4 : 0, d = r ? 0 : 4;
  t.setUint32(e + f, o, r), t.setUint32(e + d, c, r);
}
class Ci extends Mp {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = gs(this.buffer);
  }
  update(e) {
    bs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = hf(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const f = gs(e);
        for (; s <= i - o; o += s)
          this.process(f, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    bs.exists(this), bs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let a = o; a < s; a++)
      n[a] = 0;
    Gp(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = gs(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = f / 4, l = this.get();
    if (d > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let a = 0; a < d; a++)
      c.setUint32(4 * a, l[a], i);
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
const Kp = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), lf = Uint8Array.from({ length: 16 }, (t, e) => e), Rp = lf.map((t) => (9 * t + 5) % 16);
let Pi = [lf], Di = [Rp];
for (let t = 0; t < 4; t++)
  for (let e of [Pi, Di])
    e.push(e[t].map((n) => Kp[n]));
const uf = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Vp = Pi.map((t, e) => t.map((n) => uf[e][n])), zp = Di.map((t, e) => t.map((n) => uf[e][n])), jp = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), qp = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), sr = (t, e) => t << e | t >>> 32 - e;
function Qc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ir = new Uint32Array(16);
class Wp extends Ci {
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
    for (let u = 0; u < 16; u++, n += 4)
      ir[u] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, f = c, d = this.h3 | 0, l = d, a = this.h4 | 0, b = a;
    for (let u = 0; u < 5; u++) {
      const p = 4 - u, y = jp[u], A = qp[u], H = Pi[u], _ = Di[u], x = Vp[u], v = zp[u];
      for (let S = 0; S < 16; S++) {
        const C = sr(r + Qc(u, i, c, d) + ir[H[S]] + y, x[S]) + a | 0;
        r = a, a = d, d = sr(c, 10) | 0, c = i, i = C;
      }
      for (let S = 0; S < 16; S++) {
        const C = sr(s + Qc(p, o, f, l) + ir[_[S]] + A, v[S]) + b | 0;
        s = b, b = l, l = sr(f, 10) | 0, f = o, o = C;
      }
    }
    this.set(this.h1 + c + l | 0, this.h2 + d + b | 0, this.h3 + a + s | 0, this.h4 + r + o | 0, this.h0 + i + f | 0);
  }
  roundClean() {
    ir.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
Fe(() => new Wp());
const Xp = (t, e, n) => t & e ^ ~t & n, Zp = (t, e, n) => t & e ^ t & n ^ e & n, Yp = new Uint32Array([
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
]), fe = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), he = new Uint32Array(64);
class df extends Ci {
  constructor() {
    super(64, 32, 8, !1), this.A = fe[0] | 0, this.B = fe[1] | 0, this.C = fe[2] | 0, this.D = fe[3] | 0, this.E = fe[4] | 0, this.F = fe[5] | 0, this.G = fe[6] | 0, this.H = fe[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: o, G: c, H: f } = this;
    return [e, n, r, s, i, o, c, f];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, f) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = c | 0, this.H = f | 0;
  }
  process(e, n) {
    for (let a = 0; a < 16; a++, n += 4)
      he[a] = e.getUint32(n, !1);
    for (let a = 16; a < 64; a++) {
      const b = he[a - 15], u = he[a - 2], p = Bt(b, 7) ^ Bt(b, 18) ^ b >>> 3, y = Bt(u, 17) ^ Bt(u, 19) ^ u >>> 10;
      he[a] = y + he[a - 7] + p + he[a - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: f, G: d, H: l } = this;
    for (let a = 0; a < 64; a++) {
      const b = Bt(c, 6) ^ Bt(c, 11) ^ Bt(c, 25), u = l + b + Xp(c, f, d) + Yp[a] + he[a] | 0, y = (Bt(r, 2) ^ Bt(r, 13) ^ Bt(r, 22)) + Zp(r, s, i) | 0;
      l = d, d = f, f = c, c = o + u | 0, o = i, i = s, s = r, r = u + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, f = f + this.F | 0, d = d + this.G | 0, l = l + this.H | 0, this.set(r, s, i, o, c, f, d, l);
  }
  roundClean() {
    he.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class Jp extends df {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
Fe(() => new df());
Fe(() => new Jp());
const or = BigInt(2 ** 32 - 1), qs = BigInt(32);
function bf(t, e = !1) {
  return e ? { h: Number(t & or), l: Number(t >> qs & or) } : { h: Number(t >> qs & or) | 0, l: Number(t & or) | 0 };
}
function Qp(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = bf(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const tx = (t, e) => BigInt(t >>> 0) << qs | BigInt(e >>> 0), ex = (t, e, n) => t >>> n, nx = (t, e, n) => t << 32 - n | e >>> n, rx = (t, e, n) => t >>> n | e << 32 - n, sx = (t, e, n) => t << 32 - n | e >>> n, ix = (t, e, n) => t << 64 - n | e >>> n - 32, ox = (t, e, n) => t >>> n - 32 | e << 64 - n, cx = (t, e) => e, ax = (t, e) => t, fx = (t, e, n) => t << n | e >>> 32 - n, hx = (t, e, n) => e << n | t >>> 32 - n, lx = (t, e, n) => e << n - 32 | t >>> 64 - n, ux = (t, e, n) => t << n - 32 | e >>> 64 - n;
function dx(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const bx = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), gx = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, px = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), xx = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, wx = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), yx = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, G = {
  fromBig: bf,
  split: Qp,
  toBig: tx,
  shrSH: ex,
  shrSL: nx,
  rotrSH: rx,
  rotrSL: sx,
  rotrBH: ix,
  rotrBL: ox,
  rotr32H: cx,
  rotr32L: ax,
  rotlSH: fx,
  rotlSL: hx,
  rotlBH: lx,
  rotlBL: ux,
  add: dx,
  add3L: bx,
  add3H: gx,
  add4L: px,
  add4H: xx,
  add5H: yx,
  add5L: wx
}, [Sx, mx] = G.split([
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
].map((t) => BigInt(t))), le = new Uint32Array(80), ue = new Uint32Array(80);
class Kr extends Ci {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: f, Eh: d, El: l, Fh: a, Fl: b, Gh: u, Gl: p, Hh: y, Hl: A } = this;
    return [e, n, r, s, i, o, c, f, d, l, a, b, u, p, y, A];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, f, d, l, a, b, u, p, y, A) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = f | 0, this.Eh = d | 0, this.El = l | 0, this.Fh = a | 0, this.Fl = b | 0, this.Gh = u | 0, this.Gl = p | 0, this.Hh = y | 0, this.Hl = A | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      le[x] = e.getUint32(n), ue[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const v = le[x - 15] | 0, S = ue[x - 15] | 0, C = G.rotrSH(v, S, 1) ^ G.rotrSH(v, S, 8) ^ G.shrSH(v, S, 7), N = G.rotrSL(v, S, 1) ^ G.rotrSL(v, S, 8) ^ G.shrSL(v, S, 7), I = le[x - 2] | 0, U = ue[x - 2] | 0, g = G.rotrSH(I, U, 19) ^ G.rotrBH(I, U, 61) ^ G.shrSH(I, U, 6), m = G.rotrSL(I, U, 19) ^ G.rotrBL(I, U, 61) ^ G.shrSL(I, U, 6), L = G.add4L(N, m, ue[x - 7], ue[x - 16]), D = G.add4H(L, C, g, le[x - 7], le[x - 16]);
      le[x] = D | 0, ue[x] = L | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: f, Dh: d, Dl: l, Eh: a, El: b, Fh: u, Fl: p, Gh: y, Gl: A, Hh: H, Hl: _ } = this;
    for (let x = 0; x < 80; x++) {
      const v = G.rotrSH(a, b, 14) ^ G.rotrSH(a, b, 18) ^ G.rotrBH(a, b, 41), S = G.rotrSL(a, b, 14) ^ G.rotrSL(a, b, 18) ^ G.rotrBL(a, b, 41), C = a & u ^ ~a & y, N = b & p ^ ~b & A, I = G.add5L(_, S, N, mx[x], ue[x]), U = G.add5H(I, H, v, C, Sx[x], le[x]), g = I | 0, m = G.rotrSH(r, s, 28) ^ G.rotrBH(r, s, 34) ^ G.rotrBH(r, s, 39), L = G.rotrSL(r, s, 28) ^ G.rotrBL(r, s, 34) ^ G.rotrBL(r, s, 39), D = r & i ^ r & c ^ i & c, K = s & o ^ s & f ^ o & f;
      H = y | 0, _ = A | 0, y = u | 0, A = p | 0, u = a | 0, p = b | 0, { h: a, l: b } = G.add(d | 0, l | 0, U | 0, g | 0), d = c | 0, l = f | 0, c = i | 0, f = o | 0, i = r | 0, o = s | 0;
      const P = G.add3L(g, L, K);
      r = G.add3H(P, U, m, D), s = P | 0;
    }
    ({ h: r, l: s } = G.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = G.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l: f } = G.add(this.Ch | 0, this.Cl | 0, c | 0, f | 0), { h: d, l } = G.add(this.Dh | 0, this.Dl | 0, d | 0, l | 0), { h: a, l: b } = G.add(this.Eh | 0, this.El | 0, a | 0, b | 0), { h: u, l: p } = G.add(this.Fh | 0, this.Fl | 0, u | 0, p | 0), { h: y, l: A } = G.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: H, l: _ } = G.add(this.Hh | 0, this.Hl | 0, H | 0, _ | 0), this.set(r, s, i, o, c, f, d, l, a, b, u, p, y, A, H, _);
  }
  roundClean() {
    le.fill(0), ue.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class Ex extends Kr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class Ax extends Kr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class $x extends Kr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Fe(() => new Kr());
Fe(() => new Ex());
Fe(() => new Ax());
Fe(() => new $x());
function vx(t, e, n) {
  const s = Op;
  if (Rx(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Vs.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var J;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(J || (J = {}));
const ta = BigInt("0xffffffffffffffffffffffffffffffff"), Bx = BigInt(0);
BigInt("0x7fffffffffffffffffffffffffffffff");
BigInt("-170141183460469231731687303715884105728");
const Hx = (t) => {
  const e = sf(t);
  if (e < Bx)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > ta)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${ta}`);
  return { type: J.UInt, value: e };
};
function _x(t) {
  for (const e in t)
    if (!Vx(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: J.Tuple, data: t };
}
const ps = (t) => ({ type: J.StringASCII, data: t });
class Lx extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Ix extends Lx {
  constructor(e) {
    super(e);
  }
}
function gf(t) {
  const e = [];
  return e.push($n(Ii(t.version, 1))), e.push($n(t.hash160)), hn(e);
}
function pf(t) {
  const e = [], n = Ui(t.content), r = n.byteLength;
  return e.push($n(Ii(r, t.lengthPrefixBytes))), e.push(n), hn(e);
}
function Ot(t, e) {
  return hn([t, e]);
}
function Ux(t) {
  return new Uint8Array([t.type]);
}
function Ox(t) {
  return t.type === J.OptionalNone ? new Uint8Array([t.type]) : Ot(t.type, In(t.value));
}
function Cx(t) {
  const e = new Uint8Array(4);
  return Gr(e, t.buffer.length, 0), Ot(t.type, Oi(e, t.buffer));
}
function Px(t) {
  const e = of(_p(t.value, BigInt(Cp)), af);
  return Ot(t.type, e);
}
function Dx(t) {
  const e = of(t.value, af);
  return Ot(t.type, e);
}
function Nx(t) {
  return Ot(t.type, gf(t.address));
}
function kx(t) {
  return Ot(t.type, Oi(gf(t.address), pf(t.contractName)));
}
function Fx(t) {
  return Ot(t.type, In(t.value));
}
function Tx(t) {
  const e = [], n = new Uint8Array(4);
  Gr(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = In(r);
    e.push(s);
  }
  return Ot(t.type, hn(e));
}
function Mx(t) {
  const e = [], n = new Uint8Array(4);
  Gr(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = vx(s);
    e.push(pf(i));
    const o = In(t.data[s]);
    e.push(o);
  }
  return Ot(t.type, hn(e));
}
function xf(t, e) {
  const n = [], r = e == "ascii" ? Ip(t.data) : Ui(t.data), s = new Uint8Array(4);
  return Gr(s, r.length, 0), n.push(s), n.push(r), Ot(t.type, hn(n));
}
function Gx(t) {
  return xf(t, "ascii");
}
function Kx(t) {
  return xf(t, "utf8");
}
function In(t) {
  switch (t.type) {
    case J.BoolTrue:
    case J.BoolFalse:
      return Ux(t);
    case J.OptionalNone:
    case J.OptionalSome:
      return Ox(t);
    case J.Buffer:
      return Cx(t);
    case J.UInt:
      return Dx(t);
    case J.Int:
      return Px(t);
    case J.PrincipalStandard:
      return Nx(t);
    case J.PrincipalContract:
      return kx(t);
    case J.ResponseOk:
    case J.ResponseErr:
      return Fx(t);
    case J.List:
      return Tx(t);
    case J.Tuple:
      return Mx(t);
    case J.StringASCII:
      return Gx(t);
    case J.StringUTF8:
      return Kx(t);
    default:
      throw new Ix("Unable to serialize. Invalid Clarity Value.");
  }
}
const Rx = (t, e) => t ? Ui(t).length > e : !1;
function Vx(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function zx(t) {
  const e = In(t);
  return `0x${cf(e)}`;
}
const jx = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], Ni = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Rr = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, yn = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, qx = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), wf = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => qx(i, r)) === s
  );
}, Wx = (t) => t ? wf(Rr()).some(
  (e) => {
    var n;
    return e.id === t && (Ni(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Xx = () => {
  if (typeof window > "u")
    return;
  const t = Rr(), e = wf(t).filter(
    (n) => {
      var r;
      return Ni(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = yn(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of jx) {
    const r = yn(t, n) ?? (t === window ? void 0 : yn(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, Zx = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Rr(), n = yn(e, t) ?? (e === window ? void 0 : yn(window, t)) ?? jh(t);
  if (n)
    return n;
  if (Ni(t) || Wx(t))
    return Xx();
}, Yx = ["blockstack-session", "blockstack"], Jx = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of Yx) {
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
Jx();
const yf = () => ca(), Qx = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = ca(), e = t ? Zx(t) : void 0;
  if (e)
    return e;
  const n = Rr() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, ea = (t) => zx(t).replace(/^0x/, ""), na = "This wallet cannot sign messages. Try Xverse or Leather.", ra = (t) => typeof (t == null ? void 0 : t.request) == "function", sa = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", t3 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, e3 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function n3(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: ea(e.message),
    domain: ea(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function r3(t, e) {
  const n = await Ap({
    domain: e.domain,
    message: e.message,
    network: xp(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function s3(t) {
  var s, i;
  const e = yf() || "", n = /xverse/i.test(e);
  let r = Qx();
  if (n && !sa(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (sa(r))
    try {
      return await r3(r, t);
    } catch (o) {
      if (n || !ra(r) || !e3(o)) throw o;
    }
  if (!n && ra(r))
    try {
      return await n3(r, t);
    } catch (o) {
      throw t3(o) ? new Error(na) : o;
    }
  throw new Error(na);
}
const i3 = "ParallaX Casino", o3 = "ParallaX Casino room sign-in. This is free: it sends no transaction, costs no fees and gives no permission to spend anything.";
new TextEncoder();
new TextDecoder();
const c3 = (t) => t === "mainnet" ? 1 : 2147483648, a3 = (t) => `${o3} Account ${t.address}. Valid until ${new Date(t.expires).toISOString().replace(".000Z", "Z")}. Request code ${t.nonce}.`, f3 = (t) => ({
  domain: _x({
    name: ps(i3),
    version: ps("1"),
    "chain-id": Hx(c3(t.network))
  }),
  message: ps(a3(t))
}), Sf = [
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
new Set(Sf);
const Y = (t) => document.getElementById(t), $ = {
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
}, h3 = performance.now(), X = (t) => {
  const e = Y("log");
  e.textContent += `${((performance.now() - h3) / 1e3).toFixed(1).padStart(6)}s  ${t}
`, e.scrollTop = e.scrollHeight;
}, lt = (t, e, n = "") => {
  const r = Y(t);
  r.textContent = e, r.className = "status " + (n || "dim");
}, mf = (t) => t ? `${t.slice(0, 5)}…${t.slice(-4)}` : "Guest", Tt = (t) => t instanceof Error ? t.message : String(t);
let q = null;
const de = [], gn = (t) => !!t && typeof t.request == "function", l3 = () => {
  try {
    const t = window.top;
    if (t && t !== window.self && t.location.origin === window.location.origin) return t;
  } catch {
  }
  return window;
}, u3 = () => {
  const t = l3();
  return t === window ? [window] : [t, window];
}, ia = (t) => {
  for (const e of u3()) {
    const n = t(e);
    if (n) return n;
  }
  return null;
}, Ef = (t) => {
  if (t === "leather") {
    const s = ia((i) => gn(i.LeatherProvider) ? i.LeatherProvider : null);
    return s ? { rpc: s } : null;
  }
  const e = ia((s) => {
    const i = s.XverseProviders || s.xverseProviders;
    return i && (gn(i.BitcoinProvider) || gn(i.StacksProvider)) ? i : null;
  });
  if (!e) return null;
  const n = gn(e.BitcoinProvider) ? e.BitcoinProvider : null, r = gn(e.StacksProvider) ? e.StacksProvider : null;
  return { rpc: n || r };
}, d3 = (t, e) => new Promise((n) => {
  const r = Date.now();
  (function s() {
    const i = Ef(t);
    i || Date.now() - r >= e ? n(i) : window.setTimeout(s, 150);
  })();
}), vr = (t) => {
  var e;
  return (t == null ? void 0 : t.code) ?? ((e = t == null ? void 0 : t.error) == null ? void 0 : e.code);
}, Be = (t) => {
  var e;
  return String((t == null ? void 0 : t.message) ?? ((e = t == null ? void 0 : t.error) == null ? void 0 : e.message) ?? t ?? "unknown error");
}, b3 = (t) => [4001, -31001].includes(Number(vr(t))) || /cancel|denied|reject|declin|closed/i.test(Be(t)), Ws = (t) => Number(vr(t)) === -32601 || /not supported|method not found|unsupported|not implemented|legacy method/i.test(Be(t)), lr = async (t, e, n) => {
  const r = n === void 0 ? await t.request(e) : await t.request(e, n);
  if (r && typeof r == "object") {
    if (r.error) throw Object.assign(new Error(Be(r.error)), { code: vr(r.error) });
    if (r.status === "error") throw Object.assign(new Error(Be(r.error || r)), { code: vr(r.error || r) });
    if ("result" in r) return r.result;
  }
  return r;
}, g3 = (t) => new Promise((e, n) => {
  const r = window.setTimeout(() => n(new Error("The wallet did not answer. Check its window.")), 9e4);
  t.then((s) => {
    window.clearTimeout(r), e(s);
  }, (s) => {
    window.clearTimeout(r), n(s);
  });
}), p3 = (t) => (JSON.stringify(t) || "").match(/S[PT][0-9A-HJKMNP-TV-Z]{38,39}/g) || [];
async function x3(t) {
  const e = await d3(t, 1500);
  if (!e) throw new Error(`${t === "leather" ? "Leather" : "Xverse"} was not found in this browser.`);
  de.length = 0;
  let n;
  if (t === "xverse") {
    try {
      await lr(e.rpc, "wallet_disconnect"), de.push("wallet_disconnect: ok");
    } catch (s) {
      de.push("wallet_disconnect: " + Be(s).slice(0, 80));
    }
    n = ["wallet_connect", "wallet_getAccount"];
  } else
    n = ["getAddresses", "stx_getAccounts", "stx_getAddresses", "stx_requestAccounts"];
  let r = null;
  for (const s of n)
    try {
      const i = await (t === "xverse" ? g3(lr(e.rpc, s)) : lr(e.rpc, s)), o = p3(i);
      if (o.length) {
        const c = o[0];
        return de.push(`${s}: ok`), { kind: t, address: c, network: c.startsWith("SP") ? "mainnet" : "testnet", via: s };
      }
      de.push(`${s}: answered but no Stacks address in it`);
    } catch (i) {
      if (b3(i))
        throw de.push(`${s}: cancelled`), new Error("Connection cancelled.");
      de.push(`${s}: ${Ws(i) ? "not supported" : Be(i).slice(0, 80)}`), Ws(i) || (r = i);
    }
  throw new Error(r ? Be(r) : "The wallet did not share a Stacks address.");
}
const ki = () => {
  const t = !!q;
  Y("signin").disabled = !t || !!$.signedAs, Y("disconnect").disabled = !t, lt("walletStatus", q ? `Connected: ${q.address} (${q.network}, ${q.kind}, via ${q.via})` : "Not connected.", q ? "ok" : "");
}, Af = async (t) => {
  try {
    X(`connect: asking ${t}`), q = await x3(t), qh(t === "leather" ? "LeatherProvider" : "XverseProviders.BitcoinProvider"), $.results.connect = `ok (${q.kind}, ${q.network}, via ${q.via})`, X(`connect: ok ${mf(q.address)} (${q.network}) via ${q.via}`);
  } catch (e) {
    q = null, $.results.connect = "error: " + Tt(e), X("connect failed: " + Tt(e)), lt("walletStatus", "Could not connect: " + Tt(e), "bad");
    return;
  }
  ki();
};
Y("connect-leather").onclick = () => Af("leather");
Y("connect-xverse").onclick = () => Af("xverse");
Y("disconnect").onclick = async () => {
  const t = q;
  q = null;
  try {
    Wh();
  } catch {
  }
  if (t) {
    const e = Ef(t.kind);
    for (const n of t.kind === "xverse" ? ["wallet_disconnect"] : ["stx_disconnect", "wallet_disconnect", "disconnect", "deactivate"])
      try {
        e && await lr(e.rpc, n);
        break;
      } catch (r) {
        if (!Ws(r)) break;
      }
  }
  X("wallet disconnected"), ki(), Un();
};
const Br = async (t, e) => {
  const n = await fetch(t, { credentials: "same-origin", ...e });
  let r = null;
  try {
    r = await n.json();
  } catch {
  }
  return { res: n, body: r };
};
Y("signin").onclick = async () => {
  const t = q;
  if (!t) return;
  const e = Y("signin");
  e.disabled = !0;
  try {
    lt("signStatus", "Asking the room for a sign-in request…");
    const n = performance.now(), { res: r, body: s } = await Br(`/casino/room/challenge?address=${encodeURIComponent(t.address)}`);
    if ($.timers.challengeMs = Math.round(performance.now() - n), !r.ok) throw new Error((s == null ? void 0 : s.error) || `The room answered ${r.status}.`);
    const i = s.challenge;
    X(`challenge: ok (${$.timers.challengeMs} ms), network ${i.network}`), lt("signStatus", "Your wallet should now ask you to sign. This is free.");
    const { domain: o, message: c } = f3(i), f = performance.now();
    let d;
    try {
      d = await s3({ domain: o, message: c, network: i.network, stxAddress: t.address });
    } catch (u) {
      throw $.results.sign = "wallet error: " + Tt(u), new Error("The wallet did not sign: " + Tt(u));
    }
    $.timers.signMs = Math.round(performance.now() - f), $.results.sign = "ok", X(`sign: ok (${$.timers.signMs} ms)`);
    const l = performance.now(), { res: a, body: b } = await Br("/casino/room/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ challenge: i, signature: d })
    });
    if ($.timers.sessionMs = Math.round(performance.now() - l), !a.ok)
      throw $.results.session = `rejected ${a.status}: ${b == null ? void 0 : b.error}`, new Error((b == null ? void 0 : b.error) || `The room answered ${a.status}.`);
    $.results.session = "ok", $.signedAs = { address: b.address, hash160: b.hash160, network: b.network, expiresAt: b.expiresAt }, X(`session: ok (${$.timers.sessionMs} ms), key hash ${b.hash160}`), Un(), Ti("signed in");
  } catch (n) {
    X("sign-in failed: " + Tt(n)), lt("signStatus", Tt(n), "bad"), e.disabled = !1;
  }
};
Y("signout").onclick = async () => {
  await Br("/casino/room/session", { method: "DELETE" }), $.signedAs = null, $.wantSpot = null, X("signed out"), Un(), Ti("signed out");
};
function Un() {
  const t = $.signedAs;
  Y("signin").disabled = !!t || !q, Y("signout").disabled = !t, lt("signStatus", t ? `Signed in as ${t.address} (${t.network}). Account key hash ${t.hash160.slice(0, 12)}… Session ends ${new Date(t.expiresAt).toLocaleTimeString()}.` : "Not signed in. You can still watch the room as a guest.", t ? "ok" : "");
}
const $f = () => {
  var n;
  const t = ((n = $.you) == null ? void 0 : n.a) ?? null, e = Y("spots");
  e.textContent = "";
  for (const r of Sf) {
    const s = $.spots[r], i = document.createElement("button"), o = document.createElement("span");
    o.textContent = r;
    const c = document.createElement("small");
    c.textContent = s ? s.a === t ? "you" : s.n : "free", i.append(o, c), (s == null ? void 0 : s.a) === t && t ? i.className = "mine" : s && (i.className = "taken"), i.disabled = !t || !!s && s.a !== t, i.onclick = () => Hr({ t: "sit", spot: r }), e.append(i);
  }
  Y("stand").disabled = !t || !Object.values($.spots).some((r) => r.a === t), Y("counts").textContent = `${$.joined} signed in, ${$.guests} watching. ${$.you ? "You are " + ($.you.guest ? "a guest (watching only)." : $.you.n + ".") : ""}`;
}, Hr = (t) => {
  var e;
  ((e = $.ws) == null ? void 0 : e.readyState) === WebSocket.OPEN ? (t.t === "sit" && ($.wantSpot = t.spot), t.t === "stand" && ($.wantSpot = null), $.ws.send(JSON.stringify(t))) : X("not connected to the room");
};
Y("stand").onclick = () => Hr({ t: "stand" });
function Fi() {
  $.attempts += 1;
  const t = `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/casino/room/ws`, e = performance.now();
  lt("roomStatus", $.attempts > 1 ? "Reconnecting…" : "Connecting…");
  let n;
  try {
    n = new WebSocket(t);
  } catch (r) {
    return X("websocket could not start: " + Tt(r)), oa();
  }
  $.ws = n, n.onopen = () => {
    $.timers.wsOpenMs = Math.round(performance.now() - e), $.results.websocket = "open", $.opened += 1, X(`room: connected (${$.timers.wsOpenMs} ms)`), lt("roomStatus", "Connected to the room.", "ok"), $.attempts > 1 && ($.reconnects += 1), $.attempts = 0;
  }, n.onmessage = (r) => {
    let s;
    try {
      s = JSON.parse(String(r.data));
    } catch {
      return;
    }
    switch (s.t) {
      case "room":
        $.you = s.you, $.spots = s.spots || {}, $.joined = s.joined, $.guests = s.guests, $.wantSpot && $.you && !$.you.guest && !Object.values($.spots).some((i) => i.a === $.you.a) && (X("re-sitting at " + $.wantSpot), n.send(JSON.stringify({ t: "sit", spot: $.wantSpot }))), $.idleCheck && w3(s);
        break;
      case "sat":
        $.spots[s.spot] = s.who;
        break;
      case "stood":
        delete $.spots[s.spot];
        break;
      case "moved":
        X(`another tab of yours took ${s.spot}`), $.wantSpot === s.spot && ($.wantSpot = null);
        break;
      case "count":
        $.joined = s.joined, $.guests = s.guests;
        break;
      case "pong":
        $.timers.pingMs = Math.round(performance.now() - $.pingSent), X(`pong (${$.timers.pingMs} ms)`);
        break;
      case "err":
        X("room says: " + s.code);
        break;
    }
    $f();
  }, n.onclose = (r) => {
    if ($.lastClose = { code: r.code, reason: r.reason }, X(`room: closed (${r.code}${r.reason ? " " + r.reason : ""})`), $.ws === n) {
      if ($.ws = null, r.code === 4001) {
        $.replaced = !0, lt("roomStatus", "Another tab of yours replaced this one.", "bad");
        return;
      }
      lt("roomStatus", "Disconnected. Reconnecting…", "bad"), oa();
    }
  }, n.onerror = () => {
    $.results.websocket = $.results.websocket === "open" ? "open" : "error";
  };
}
function oa() {
  const t = Math.min(15e3, 1e3 * 2 ** Math.min($.attempts, 4));
  X(`retrying in ${t / 1e3}s`), window.setTimeout(() => {
    $.ws || Fi();
  }, t);
}
function Ti(t) {
  X("reconnecting: " + t);
  const e = $.ws;
  $.ws = null, $.attempts = 0, $.replaced = !1;
  try {
    e == null || e.close(1e3, "client");
  } catch {
  }
  Fi();
}
Y("reconnect").onclick = () => Ti("button");
Y("idle").onclick = () => {
  var e;
  if (((e = $.ws) == null ? void 0 : e.readyState) !== WebSocket.OPEN) {
    X("idle test: connect first");
    return;
  }
  const t = JSON.stringify(Object.keys($.spots).sort());
  $.idleCheck = { before: t, started: performance.now() }, lt("idleStatus", "Idle test running. Do not touch anything for 30 seconds…"), window.setTimeout(() => {
    $.pingSent = performance.now(), Hr({ t: "ping" }), Hr({ t: "hello" });
  }, 3e4);
};
function w3(t) {
  const e = $.idleCheck;
  if (!e) return;
  $.idleCheck = null;
  const n = JSON.stringify(Object.keys(t.spots || {}).sort()), r = n === e.before;
  $.results.idle = r ? "ok: room state intact after 30 s idle" : `changed: before ${e.before} after ${n}`, lt("idleStatus", r ? "Idle test passed: the room remembered everyone after 30 seconds." : "Idle test: the room changed while idle (see report).", r ? "ok" : "bad"), X("idle test: " + $.results.idle);
}
const vf = () => {
  const t = {
    page: "casino-room-spike v1",
    at: (/* @__PURE__ */ new Date()).toISOString(),
    userAgent: navigator.userAgent,
    wallet: { kind: (q == null ? void 0 : q.kind) ?? null, selectedProviderId: yf() || null, address: (q == null ? void 0 : q.address) ?? null, network: (q == null ? void 0 : q.network) ?? null, connectedVia: (q == null ? void 0 : q.via) ?? null, connectTrail: de },
    signedAs: $.signedAs && { address: $.signedAs.address, network: $.signedAs.network, hash160: $.signedAs.hash160 },
    results: $.results,
    timersMs: $.timers,
    websocket: { opened: $.opened, reconnects: $.reconnects, lastClose: $.lastClose, replaced: $.replaced },
    room: { you: $.you, joined: $.joined, guests: $.guests, spots: $.spots }
  };
  return JSON.stringify(t, null, 2);
};
Y("report").onclick = () => {
  Y("reportText").value = vf();
};
Y("copy").onclick = async () => {
  const t = Y("reportText");
  t.value || (t.value = vf());
  try {
    await navigator.clipboard.writeText(t.value), X("report copied");
  } catch {
    t.select(), X("select the text and copy it by hand");
  }
};
ki();
Un();
$f();
(async () => {
  try {
    const { res: t, body: e } = await Br("/casino/room/session");
    if (t.ok && (e != null && e.address))
      $.signedAs = { address: e.address, hash160: e.hash160, network: "unknown", expiresAt: e.expiresAt }, X("already signed in from earlier: " + mf(e.address)), Un();
    else if (t.status === 503) {
      $.results.service = "offline: " + ((e == null ? void 0 : e.reason) || "unknown"), lt("roomStatus", "The room service is not switched on yet (this is expected before it is deployed).", "bad"), X("room service offline: " + ((e == null ? void 0 : e.reason) || t.status));
      return;
    }
  } catch (t) {
    X("could not reach the room service: " + Tt(t));
  }
  Fi();
})();
