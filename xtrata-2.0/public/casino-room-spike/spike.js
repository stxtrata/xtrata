const ol = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), no = "STX_PROVIDER", pa = () => typeof window > "u" ? null : window.localStorage.getItem(no), il = (t) => {
  typeof window < "u" && window.localStorage.setItem(no, t);
}, cl = () => {
  typeof window < "u" && window.localStorage.removeItem(no);
};
const al = "https://browser.blockstack.org/auth", fl = {
  "@type": "Person",
  "@context": "http://schema.org"
}, ga = ["store_write"], hl = "blockstack-session", ll = {
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
class ln extends Error {
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
class ul extends ln {
  constructor(e, n = "") {
    super({ code: Fe.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class yi extends ln {
  constructor(e = "") {
    super({ code: Fe.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class jn extends ln {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Fe.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class mi extends ln {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Fe.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class As extends ln {
  constructor(e) {
    super({ code: Fe.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class xa extends ln {
  constructor(e) {
    super({ code: Fe.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Si = ["debug", "info", "warn", "error", "none"], vs = {};
for (let t = 0; t < Si.length; t++) {
  const e = Si[t];
  vs[e] = t;
}
class Ze {
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
    return vs[ll.logLevel] <= vs[e];
  }
}
function dl() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function bl() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function cs(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function pl() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function gl() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function xl(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function ro(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = gl(), s) {
      const o = s[t];
      if (o)
        return o;
    }
  } catch (o) {
    Ze.error(`Error getting object '${t}' from global scope '${s}': ${o}`);
  }
  if (e) {
    const o = xl(s, t.toString(), n);
    throw Ze.error(o), new Error(o);
  }
  if (r)
    return {};
}
function wl(t) {
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
  if (vl(t, Uint8Array))
    return BigInt(`0x${gt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function yl(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function so(t, e = 8) {
  return (typeof t == "bigint" ? t : wl(t)).toString(16).padStart(e * 2, "0");
}
function wa(t, e = 16) {
  const n = so(t, e);
  return ut(n);
}
function ml(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const Sl = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function gt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Sl[n];
  return e;
}
function ut(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = yl(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    e[n] = o;
  }
  return e;
}
function On(t) {
  return new TextEncoder().encode(t);
}
function ya(t) {
  return new TextDecoder().decode(t);
}
function El(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Al(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Ei(t) {
  if (t.some(Al))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function jt(...t) {
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
function un(t) {
  return jt(...t.map((e) => typeof e == "number" ? Ei([e]) : e instanceof Array ? Ei(e) : e));
}
function vl(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const $l = "https://api.mainnet.hiro.so", Bl = "https://api.testnet.hiro.so", Hl = "http://localhost:3999", _l = "https://hub.blockstack.org";
function Ll(t) {
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
const Il = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Ul(t, e) {
  const n = {};
  return Object.assign(n, Il, e), await fetch(t, n);
}
function Ol(t) {
  let e = Ul, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Cl(...t) {
  const { fetchLib: e, middlewares: n } = Ol(t);
  return async (s, o) => {
    let i = { url: s, init: o ?? {} };
    for (const f of n)
      typeof f.pre == "function" && (i = await Promise.resolve(f.pre({
        fetch: e,
        ...i
      })) ?? i);
    let c = await e(i.url, i.init);
    for (const f of n)
      typeof f.post == "function" && (c = await Promise.resolve(f.post({
        fetch: e,
        url: i.url,
        init: i.init,
        response: (c == null ? void 0 : c.clone()) ?? c
      })) ?? c);
    return c;
  };
}
class ma {
  constructor(e = ga.slice(), n = ((c) => (c = ro("location", { returnEmptyObject: !0 })) == null ? void 0 : c.origin)(), r = "", s = "/manifest.json", o = void 0, i = al) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = o, this.authenticatorURL = i;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function $s(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function kl(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Sa(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Pl(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  $s(t.outputLen), $s(t.blockLen);
}
function Nl(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Dl(t, e) {
  Sa(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Le = {
  number: $s,
  bool: kl,
  bytes: Sa,
  hash: Pl,
  exists: Nl,
  output: Dl
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const as = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), At = (t, e) => t << 32 - e | t >>> e, Fl = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Fl)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Tl(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function oo(t) {
  if (typeof t == "string" && (t = Tl(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Ea = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Te(t) {
  const e = (r) => t().update(oo(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Aa = class extends Ea {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Le.hash(e);
    const r = oo(n);
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
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: c } = this;
    return e = e, e.finished = s, e.destroyed = o, e.blockLen = i, e.outputLen = c, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Pr = (t, e, n) => new Aa(t, e).update(n).digest();
Pr.create = (t, e) => new Aa(t, e);
function Ml(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), f = r ? 4 : 0, d = r ? 0 : 4;
  t.setUint32(e + f, i, r), t.setUint32(e + d, c, r);
}
let io = class extends Ea {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = as(this.buffer);
  }
  update(e) {
    Le.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = oo(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const f = as(e);
        for (; s <= o - i; i += s)
          this.process(f, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Le.exists(this), Le.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let a = i; a < s; a++)
      n[a] = 0;
    Ml(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = as(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = f / 4, l = this.get();
    if (d > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let a = 0; a < d; a++)
      c.setUint32(4 * a, l[a], o);
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
const Gl = (t, e, n) => t & e ^ ~t & n, Rl = (t, e, n) => t & e ^ t & n ^ e & n, Kl = new Uint32Array([
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
]), Yt = new Uint32Array(64);
let va = class extends io {
  constructor() {
    super(64, 32, 8, !1), this.A = Xt[0] | 0, this.B = Xt[1] | 0, this.C = Xt[2] | 0, this.D = Xt[3] | 0, this.E = Xt[4] | 0, this.F = Xt[5] | 0, this.G = Xt[6] | 0, this.H = Xt[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: c, H: f } = this;
    return [e, n, r, s, o, i, c, f];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, f) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = c | 0, this.H = f | 0;
  }
  process(e, n) {
    for (let a = 0; a < 16; a++, n += 4)
      Yt[a] = e.getUint32(n, !1);
    for (let a = 16; a < 64; a++) {
      const b = Yt[a - 15], u = Yt[a - 2], g = At(b, 7) ^ At(b, 18) ^ b >>> 3, y = At(u, 17) ^ At(u, 19) ^ u >>> 10;
      Yt[a] = y + Yt[a - 7] + g + Yt[a - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: f, G: d, H: l } = this;
    for (let a = 0; a < 64; a++) {
      const b = At(c, 6) ^ At(c, 11) ^ At(c, 25), u = l + b + Gl(c, f, d) + Kl[a] + Yt[a] | 0, y = (At(r, 2) ^ At(r, 13) ^ At(r, 22)) + Rl(r, s, o) | 0;
      l = d, d = f, f = c, c = i + u | 0, i = o, o = s, s = r, r = u + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, f = f + this.F | 0, d = d + this.G | 0, l = l + this.H | 0, this.set(r, s, o, i, c, f, d, l);
  }
  roundClean() {
    Yt.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Vl = class extends va {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Qe = Te(() => new va());
Te(() => new Vl());
const zl = {}, $a = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: zl
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const j = BigInt(0), J = BigInt(1), Se = BigInt(2), En = BigInt(3), Ai = BigInt(8), Z = Object.freeze({
  a: j,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: J,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), vi = (t, e) => (t + e / Se) / e, qn = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = Z, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -J * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), o = n, i = BigInt("0x100000000000000000000000000000000"), c = vi(o * t, e), f = vi(-r * t, e);
    let d = H(t - c * n - f * s, e), l = H(-c * r - f * o, e);
    const a = d > i, b = l > i;
    if (a && (d = e - d), b && (l = e - l), d > i || l > i)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: a, k1: d, k2neg: b, k2: l };
  }
}, Et = 32, Oe = 32, Ba = 32, yr = Et + 1, mr = 2 * Et + 1;
function $i(t) {
  const { a: e, b: n } = Z, r = H(t * t), s = H(r * t);
  return H(s + e * t + n);
}
const Wn = Z.a === j;
class co extends Error {
  constructor(e) {
    super(e);
  }
}
function Bi(t) {
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
    return e.equals(q.ZERO) ? W.ZERO : new W(e.x, e.y, J);
  }
  static toAffineBatch(e) {
    const n = Yl(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return W.toAffineBatch(e).map(W.fromAffine);
  }
  equals(e) {
    Bi(e);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: c } = e, f = H(s * s), d = H(c * c), l = H(n * d), a = H(o * f), b = H(H(r * c) * d), u = H(H(i * s) * f);
    return l === a && b === u;
  }
  negate() {
    return new W(this.x, H(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = H(e * e), o = H(n * n), i = H(o * o), c = e + o, f = H(Se * (H(c * c) - s - i)), d = H(En * s), l = H(d * d), a = H(l - Se * f), b = H(d * (f - a) - Ai * i), u = H(Se * n * r);
    return new W(a, b, u);
  }
  add(e) {
    Bi(e);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: c } = e;
    if (o === j || i === j)
      return this;
    if (n === j || r === j)
      return e;
    const f = H(s * s), d = H(c * c), l = H(n * d), a = H(o * f), b = H(H(r * c) * d), u = H(H(i * s) * f), g = H(a - l), y = H(u - b);
    if (g === j)
      return y === j ? this.double() : W.ZERO;
    const A = H(g * g), _ = H(g * A), L = H(l * A), x = H(y * y - _ - Se * L), $ = H(y * (L - x) - b * _), m = H(s * c * g);
    return new W(x, $, m);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = W.ZERO;
    if (typeof e == "bigint" && e === j)
      return n;
    let r = Li(e);
    if (r === J)
      return this;
    if (!Wn) {
      let a = n, b = this;
      for (; r > j; )
        r & J && (a = a.add(b)), b = b.double(), r >>= J;
      return a;
    }
    let { k1neg: s, k1: o, k2neg: i, k2: c } = qn.splitScalar(r), f = n, d = n, l = this;
    for (; o > j || c > j; )
      o & J && (f = f.add(l)), c & J && (d = d.add(l)), l = l.double(), o >>= J, c >>= J;
    return s && (f = f.negate()), i && (d = d.negate()), d = new W(H(d.x * qn.beta), d.y, d.z), f.add(d);
  }
  precomputeWindow(e) {
    const n = Wn ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(W.BASE) && (n = q.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Bs.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = W.normalizeZ(s), Bs.set(n, s)));
    let o = W.ZERO, i = W.BASE;
    const c = 1 + (Wn ? 128 / r : 256 / r), f = 2 ** (r - 1), d = BigInt(2 ** r - 1), l = 2 ** r, a = BigInt(r);
    for (let b = 0; b < c; b++) {
      const u = b * f;
      let g = Number(e & d);
      e >>= a, g > f && (g -= l, e += J);
      const y = u, A = u + Math.abs(g) - 1, _ = b % 2 !== 0, L = g < 0;
      g === 0 ? i = i.add(Xn(_, s[y])) : o = o.add(Xn(L, s[A]));
    }
    return { p: o, f: i };
  }
  multiply(e, n) {
    let r = Li(e), s, o;
    if (Wn) {
      const { k1neg: i, k1: c, k2neg: f, k2: d } = qn.splitScalar(r);
      let { p: l, f: a } = this.wNAF(c, n), { p: b, f: u } = this.wNAF(d, n);
      l = Xn(i, l), b = Xn(f, b), b = new W(H(b.x * qn.beta), b.y, b.z), s = l.add(b), o = a.add(u);
    } else {
      const { p: i, f: c } = this.wNAF(r, n);
      s = i, o = c;
    }
    return W.normalizeZ([s, o])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, o = this.equals(W.ZERO);
    e == null && (e = o ? Ai : dn(s));
    const i = e, c = H(i * i), f = H(c * i), d = H(n * c), l = H(r * f), a = H(s * i);
    if (o)
      return q.ZERO;
    if (a !== J)
      throw new Error("invZ was invalid");
    return new q(d, l);
  }
}
W.BASE = new W(Z.Gx, Z.Gy, J);
W.ZERO = new W(j, J, j);
function Xn(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Bs = /* @__PURE__ */ new WeakMap();
class q {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Bs.delete(this);
  }
  hasEvenY() {
    return this.y % Se === j;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = dt(n ? e : e.subarray(1));
    if (!br(r))
      throw new Error("Point is not on curve");
    const s = $i(r);
    let o = Xl(s);
    const i = (o & J) === J;
    n ? i && (o = H(-o)) : (e[0] & 1) === 1 !== i && (o = H(-o));
    const c = new q(r, o);
    return c.assertValidity(), c;
  }
  static fromUncompressedHex(e) {
    const n = dt(e.subarray(1, Et + 1)), r = dt(e.subarray(Et + 1, Et * 2 + 1)), s = new q(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Ot(e), r = n.length, s = n[0];
    if (r === Et)
      return this.fromCompressedHex(n);
    if (r === yr && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === mr && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${yr} compressed bytes or ${mr} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return q.BASE.multiply(Ce(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: o } = La(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const i = ao(Ot(e)), { n: c } = Z, f = r === 2 || r === 3 ? s + c : s, d = dn(f, c), l = H(-i * d, c), a = H(o * d, c), b = r & 1 ? "03" : "02", u = q.fromHex(b + Ee(f)), g = q.BASE.multiplyAndAddUnsafe(u, l, a);
    if (!g)
      throw new Error("Cannot recover signature: point at infinify");
    return g.assertValidity(), g;
  }
  toRawBytes(e = !1) {
    return Ae(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Ee(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Ee(this.y)}`;
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
    const s = H(r * r), o = $i(n);
    if (H(s - o) !== j)
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
    const s = W.fromAffine(this), o = n === j || n === J || this !== q.BASE ? s.multiplyUnsafe(n) : s.multiply(n), i = W.fromAffine(e).multiplyUnsafe(r), c = o.add(i);
    return c.equals(W.ZERO) ? void 0 : c.toAffine();
  }
}
q.BASE = new q(Z.Gx, Z.Gy);
q.ZERO = new q(j, j);
function Hi(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function _i(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${tn(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: dt(n), left: t.subarray(e + 2) };
}
function jl(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${tn(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = _i(t.subarray(2)), { data: r, left: s } = _i(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${tn(s)}`);
  return { r: e, s: r };
}
class Kt {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? tn(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Kt(Sr(s.slice(0, 64)), Sr(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = jl(n ? e : Ae(e));
    return new Kt(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!nn(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!nn(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = Z.n >> J;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Kt(this.r, H(-this.s, Z.n)) : this;
  }
  toDERRawBytes() {
    return Ae(this.toDERHex());
  }
  toDERHex() {
    const e = Hi(mn(this.s)), n = Hi(mn(this.r)), r = e.length / 2, s = n.length / 2, o = mn(r), i = mn(s);
    return `30${mn(s + r + 4)}02${i}${n}02${o}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Ae(this.toCompactHex());
  }
  toCompactHex() {
    return Ee(this.r) + Ee(this.s);
  }
}
function me(...t) {
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
const ql = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function tn(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += ql[t[n]];
  return e;
}
const Wl = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Ee(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(j <= t && t < Wl))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function en(t) {
  const e = Ae(Ee(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function mn(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Sr(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function Ae(t) {
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
function dt(t) {
  return Sr(tn(t));
}
function Ot(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Ae(t);
}
function Li(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && nn(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function H(t, e = Z.P) {
  const n = t % e;
  return n >= j ? n : e + n;
}
function bt(t, e) {
  const { P: n } = Z;
  let r = t;
  for (; e-- > j; )
    r *= r, r %= n;
  return r;
}
function Xl(t) {
  const { P: e } = Z, n = BigInt(6), r = BigInt(11), s = BigInt(22), o = BigInt(23), i = BigInt(44), c = BigInt(88), f = t * t * t % e, d = f * f * t % e, l = bt(d, En) * d % e, a = bt(l, En) * d % e, b = bt(a, Se) * f % e, u = bt(b, r) * b % e, g = bt(u, s) * u % e, y = bt(g, i) * g % e, A = bt(y, c) * y % e, _ = bt(A, i) * g % e, L = bt(_, En) * d % e, x = bt(L, o) * u % e, $ = bt(x, n) * f % e, m = bt($, Se);
  if (m * m % e !== t)
    throw new Error("Cannot find square root");
  return m;
}
function dn(t, e = Z.P) {
  if (t === j || e <= j)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = H(t, e), r = e, s = j, o = J;
  for (; n !== j; ) {
    const c = r / n, f = r % n, d = s - o * c;
    r = n, n = f, s = o, o = d;
  }
  if (r !== J)
    throw new Error("invert: does not exist");
  return H(s, e);
}
function Yl(t, e = Z.P) {
  const n = new Array(t.length), r = t.reduce((o, i, c) => i === j ? o : (n[c] = o, H(o * i, e)), J), s = dn(r, e);
  return t.reduceRight((o, i, c) => i === j ? o : (n[c] = H(o * n[c], e), H(o * i, e)), s), n;
}
function Zl(t) {
  const e = t.length * 8 - Oe * 8, n = dt(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function ao(t, e = !1) {
  const n = Zl(t);
  if (e)
    return n;
  const { n: r } = Z;
  return n >= r ? n - r : n;
}
let Je, An;
class Ha {
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
    return An(this.k, ...e);
  }
  checkSync() {
    if (typeof An != "function")
      throw new co("hmacSha256Sync needs to be set");
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
function nn(t) {
  return j < t && t < Z.n;
}
function br(t) {
  return j < t && t < Z.P;
}
function _a(t, e, n, r = !0) {
  const { n: s } = Z, o = ao(t, !0);
  if (!nn(o))
    return;
  const i = dn(o, s), c = q.BASE.multiply(o), f = H(c.x, s);
  if (f === j)
    return;
  const d = H(i * H(e + n * f, s), s);
  if (d === j)
    return;
  let l = new Kt(f, d), a = (c.x === l.r ? 0 : 2) | Number(c.y & J);
  return r && l.hasHighS() && (l = l.normalizeS(), a ^= 1), { sig: l, recovery: a };
}
function Ce(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Oe)
      throw new Error("Expected 32 bytes of private key");
    e = Sr(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Oe)
      throw new Error("Expected 32 bytes of private key");
    e = dt(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!nn(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function fo(t) {
  return t instanceof q ? (t.assertValidity(), t) : q.fromHex(t);
}
function La(t) {
  if (t instanceof Kt)
    return t.assertValidity(), t;
  try {
    return Kt.fromDER(t);
  } catch {
    return Kt.fromCompact(t);
  }
}
function ho(t, e = !1) {
  return q.fromPrivateKey(t).toRawBytes(e);
}
function Jl(t, e, n, r = !1) {
  return q.fromSignature(t, e, n).toRawBytes(r);
}
function Ii(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === yr || r === mr : n ? r === yr * 2 || r === mr * 2 : t instanceof q;
}
function lo(t, e, n = !1) {
  if (Ii(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Ii(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = fo(e);
  return r.assertValidity(), r.multiply(Ce(t)).toRawBytes(n);
}
function Ia(t) {
  const e = t.length > Et ? t.slice(0, Et) : t;
  return dt(e);
}
function Ql(t) {
  const e = Ia(t), n = H(e, Z.n);
  return Ua(n < j ? e : n);
}
function Ua(t) {
  return en(t);
}
function Oa(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Ot(t), s = Ce(e), o = [Ua(s), Ql(r)];
  if (n != null) {
    n === !0 && (n = tt.randomBytes(Et));
    const f = Ot(n);
    if (f.length !== Et)
      throw new Error(`sign: Expected ${Et} bytes of extra data`);
    o.push(f);
  }
  const i = me(...o), c = Ia(r);
  return { seed: i, m: c, d: s };
}
function Ca(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: o } = Object.assign({ canonical: !0, der: !0 }, e), i = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return o ? [i, r] : i;
}
async function tu(t, e, n = {}) {
  const { seed: r, m: s, d: o } = Oa(t, e, n.extraEntropy), i = new Ha(Ba, Oe);
  await i.reseed(r);
  let c;
  for (; !(c = _a(await i.generate(), s, o, n.canonical)); )
    await i.reseed();
  return Ca(c, n);
}
function ka(t, e, n = {}) {
  const { seed: r, m: s, d: o } = Oa(t, e, n.extraEntropy), i = new Ha(Ba, Oe);
  i.reseedSync(r);
  let c;
  for (; !(c = _a(i.generateSync(), s, o, n.canonical)); )
    i.reseedSync();
  return Ca(c, n);
}
const eu = { strict: !0 };
function nu(t, e, n, r = eu) {
  let s;
  try {
    s = La(t), e = Ot(e);
  } catch {
    return !1;
  }
  const { r: o, s: i } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const c = ao(e);
  let f;
  try {
    f = fo(n);
  } catch {
    return !1;
  }
  const { n: d } = Z, l = dn(i, d), a = H(c * l, d), b = H(o * l, d), u = q.BASE.multiplyAndAddUnsafe(f, a, b);
  return u ? H(u.x, d) === o : !1;
}
function Er(t) {
  return H(dt(t), Z.n);
}
class rn {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Ot(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = dt(n.subarray(0, 32)), s = dt(n.subarray(32, 64));
    return new rn(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!br(e) || !nn(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Ee(this.r) + Ee(this.s);
  }
  toRawBytes() {
    return Ae(this.toHex());
  }
}
function ru(t) {
  return q.fromPrivateKey(t).toRawX();
}
class Pa {
  constructor(e, n, r = tt.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Ot(e);
    const { x: s, scalar: o } = this.getScalar(Ce(n));
    if (this.px = s, this.d = o, this.rand = Ot(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = q.fromPrivateKey(e), r = n.hasEvenY() ? e : Z.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return en(e ^ dt(n));
  }
  finalizeNonce(e) {
    const n = H(dt(e), Z.n);
    if (n === j)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: o } = this.getScalar(n);
    return { R: r, rx: s, k: o };
  }
  finalizeSig(e, n, r, s) {
    return new rn(e.x, H(n + r * s, Z.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, o = tt.taggedHash, i = this.initNonce(n, await o(ye.aux, s)), { R: c, rx: f, k: d } = this.finalizeNonce(await o(ye.nonce, i, r, e)), l = Er(await o(ye.challenge, f, r, e)), a = this.finalizeSig(c, d, l, n);
    return await Fa(a, e, r) || this.error(), a;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, o = tt.taggedHashSync, i = this.initNonce(n, o(ye.aux, s)), { R: c, rx: f, k: d } = this.finalizeNonce(o(ye.nonce, i, r, e)), l = Er(o(ye.challenge, f, r, e)), a = this.finalizeSig(c, d, l, n);
    return Ta(a, e, r) || this.error(), a;
  }
}
async function su(t, e, n) {
  return new Pa(t, e, n).calc();
}
function ou(t, e, n) {
  return new Pa(t, e, n).calcSync();
}
function Na(t, e, n) {
  const r = t instanceof rn, s = r ? t : rn.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Ot(e),
    P: fo(n)
  };
}
function Da(t, e, n, r) {
  const s = q.BASE.multiplyAndAddUnsafe(e, Ce(n), H(-r, Z.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Fa(t, e, n) {
  try {
    const { r, s, m: o, P: i } = Na(t, e, n), c = Er(await tt.taggedHash(ye.challenge, en(r), i.toRawX(), o));
    return Da(r, i, s, c);
  } catch {
    return !1;
  }
}
function Ta(t, e, n) {
  try {
    const { r, s, m: o, P: i } = Na(t, e, n), c = Er(tt.taggedHashSync(ye.challenge, en(r), i.toRawX(), o));
    return Da(r, i, s, c);
  } catch (r) {
    if (r instanceof co)
      throw r;
    return !1;
  }
}
const iu = {
  Signature: rn,
  getPublicKey: ru,
  sign: su,
  verify: Fa,
  signSync: ou,
  verifySync: Ta
};
q.BASE._setWindowSize(8);
const lt = {
  node: $a,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, ye = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Yn = {}, tt = {
  bytesToHex: tn,
  hexToBytes: Ae,
  concatBytes: me,
  mod: H,
  invert: dn,
  isValidPrivateKey(t) {
    try {
      return Ce(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: en,
  _normalizePrivateKey: Ce,
  hashToPrivateKey: (t) => {
    t = Ot(t);
    const e = Oe + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = H(dt(t), Z.n - J) + J;
    return en(n);
  },
  randomBytes: (t = 32) => {
    if (lt.web)
      return lt.web.getRandomValues(new Uint8Array(t));
    if (lt.node) {
      const { randomBytes: e } = lt.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => tt.hashToPrivateKey(tt.randomBytes(Oe + 8)),
  precompute(t = 8, e = q.BASE) {
    const n = e === q.BASE ? e : new q(e.x, e.y);
    return n._setWindowSize(t), n.multiply(En), n;
  },
  sha256: async (...t) => {
    if (lt.web) {
      const e = await lt.web.subtle.digest("SHA-256", me(...t));
      return new Uint8Array(e);
    } else if (lt.node) {
      const { createHash: e } = lt.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (lt.web) {
      const n = await lt.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = me(...e), s = await lt.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (lt.node) {
      const { createHmac: n } = lt.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = Yn[t];
    if (n === void 0) {
      const r = await tt.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = me(r, r), Yn[t] = n;
    }
    return tt.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Je != "function")
      throw new co("sha256Sync is undefined, you need to set it");
    let n = Yn[t];
    if (n === void 0) {
      const r = Je(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = me(r, r), Yn[t] = n;
    }
    return Je(n, ...e);
  },
  _JacobianPoint: W
};
Object.defineProperties(tt, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Je;
    },
    set(t) {
      Je || (Je = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return An;
    },
    set(t) {
      An || (An = t);
    }
  }
});
const cu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: Z,
  Point: q,
  Signature: Kt,
  getPublicKey: ho,
  getSharedSecret: lo,
  recoverPublicKey: Jl,
  schnorr: iu,
  sign: tu,
  signSync: ka,
  utils: tt,
  verify: nu
}, Symbol.toStringTag, { value: "Module" }));
var ct = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function au(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Cn(t) {
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
kn.byteLength = du;
var fu = kn.toByteArray = pu, hu = kn.fromByteArray = wu, _t = [], pt = [], lu = typeof Uint8Array < "u" ? Uint8Array : Array, fs = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Xe = 0, uu = fs.length; Xe < uu; ++Xe)
  _t[Xe] = fs[Xe], pt[fs.charCodeAt(Xe)] = Xe;
pt[45] = 62;
pt[95] = 63;
function Ma(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function du(t) {
  var e = Ma(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function bu(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function pu(t) {
  var e, n = Ma(t), r = n[0], s = n[1], o = new lu(bu(t, r, s)), i = 0, c = s > 0 ? r - 4 : r, f;
  for (f = 0; f < c; f += 4)
    e = pt[t.charCodeAt(f)] << 18 | pt[t.charCodeAt(f + 1)] << 12 | pt[t.charCodeAt(f + 2)] << 6 | pt[t.charCodeAt(f + 3)], o[i++] = e >> 16 & 255, o[i++] = e >> 8 & 255, o[i++] = e & 255;
  return s === 2 && (e = pt[t.charCodeAt(f)] << 2 | pt[t.charCodeAt(f + 1)] >> 4, o[i++] = e & 255), s === 1 && (e = pt[t.charCodeAt(f)] << 10 | pt[t.charCodeAt(f + 1)] << 4 | pt[t.charCodeAt(f + 2)] >> 2, o[i++] = e >> 8 & 255, o[i++] = e & 255), o;
}
function gu(t) {
  return _t[t >> 18 & 63] + _t[t >> 12 & 63] + _t[t >> 6 & 63] + _t[t & 63];
}
function xu(t, e, n) {
  for (var r, s = [], o = e; o < n; o += 3)
    r = (t[o] << 16 & 16711680) + (t[o + 1] << 8 & 65280) + (t[o + 2] & 255), s.push(gu(r));
  return s.join("");
}
function wu(t) {
  for (var e, n = t.length, r = n % 3, s = [], o = 16383, i = 0, c = n - r; i < c; i += o)
    s.push(xu(t, i, i + o > c ? c : i + o));
  return r === 1 ? (e = t[n - 1], s.push(
    _t[e >> 2] + _t[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    _t[e >> 10] + _t[e >> 4 & 63] + _t[e << 2 & 63] + "="
  )), s.join("");
}
function yu() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const mu = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function Su() {
  if (yu())
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
    throw new Error(mu);
  }
}
class Eu {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const o = this.createCipher(e, n, r), i = new Uint8Array(jt(o.update(s), o.final()));
    return Promise.resolve(i);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const o = this.createDecipher(e, n, r), i = new Uint8Array(jt(o.update(s), o.final()));
    return Promise.resolve(i);
  }
}
class Au {
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
    const c = await this.subtleCrypto.importKey("raw", n, { name: o, length: i }, !1, ["encrypt"]), f = await this.subtleCrypto.encrypt({ name: o, iv: r }, c, s);
    return new Uint8Array(f);
  }
  async decrypt(e, n, r, s) {
    let o, i;
    if (e === "aes-128-cbc")
      o = "AES-CBC", i = 128;
    else if (e === "aes-256-cbc")
      o = "AES-CBC", i = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const c = await this.subtleCrypto.importKey("raw", n, { name: o, length: i }, !1, ["decrypt"]), f = await this.subtleCrypto.decrypt({ name: o, iv: r }, c, s);
    return new Uint8Array(f);
  }
}
async function Ga() {
  const t = await Su();
  return t.name === "subtleCrypto" ? new Au(t.lib) : new Eu(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function vu(t) {
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
  var i = t.length, c = t.charAt(0), f = Math.log(i) / Math.log(256), d = Math.log(256) / Math.log(i);
  function l(u) {
    if (u instanceof Uint8Array || (ArrayBuffer.isView(u) ? u = new Uint8Array(u.buffer, u.byteOffset, u.byteLength) : Array.isArray(u) && (u = Uint8Array.from(u))), !(u instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (u.length === 0)
      return "";
    for (var g = 0, y = 0, A = 0, _ = u.length; A !== _ && u[A] === 0; )
      A++, g++;
    for (var L = (_ - A) * d + 1 >>> 0, x = new Uint8Array(L); A !== _; ) {
      for (var $ = u[A], m = 0, k = L - 1; ($ !== 0 || m < y) && k !== -1; k--, m++)
        $ += 256 * x[k] >>> 0, x[k] = $ % i >>> 0, $ = $ / i >>> 0;
      if ($ !== 0)
        throw new Error("Non-zero carry");
      y = m, A++;
    }
    for (var D = L - y; D !== L && x[D] === 0; )
      D++;
    for (var U = c.repeat(g); D < L; ++D)
      U += t.charAt(x[D]);
    return U;
  }
  function a(u) {
    if (typeof u != "string")
      throw new TypeError("Expected String");
    if (u.length === 0)
      return new Uint8Array();
    for (var g = 0, y = 0, A = 0; u[g] === c; )
      y++, g++;
    for (var _ = (u.length - g) * f + 1 >>> 0, L = new Uint8Array(_); u[g]; ) {
      var x = u.charCodeAt(g);
      if (x > 255)
        return;
      var $ = e[x];
      if ($ === 255)
        return;
      for (var m = 0, k = _ - 1; ($ !== 0 || m < A) && k !== -1; k--, m++)
        $ += i * L[k] >>> 0, L[k] = $ % 256 >>> 0, $ = $ / 256 >>> 0;
      if ($ !== 0)
        throw new Error("Non-zero carry");
      A = m, g++;
    }
    for (var D = _ - A; D !== _ && L[D] === 0; )
      D++;
    for (var U = new Uint8Array(y + (_ - D)), O = y; D !== _; )
      U[O++] = L[D++];
    return U;
  }
  function b(u) {
    var g = a(u);
    if (g)
      return g;
    throw new Error("Non-base" + i + " character");
  }
  return {
    encode: l,
    decodeUnsafe: a,
    decode: b
  };
}
var Ra = vu;
const $u = Ra, Bu = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Hu = $u(Bu);
const _u = /* @__PURE__ */ au(Hu), Lu = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Ka = Uint8Array.from({ length: 16 }, (t, e) => e), Iu = Ka.map((t) => (9 * t + 5) % 16);
let uo = [Ka], bo = [Iu];
for (let t = 0; t < 4; t++)
  for (let e of [uo, bo])
    e.push(e[t].map((n) => Lu[n]));
const Va = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Uu = uo.map((t, e) => t.map((n) => Va[e][n])), Ou = bo.map((t, e) => t.map((n) => Va[e][n])), Cu = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), ku = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Zn = (t, e) => t << e | t >>> 32 - e;
function Ui(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Jn = new Uint32Array(16);
let Pu = class extends io {
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
    for (let u = 0; u < 16; u++, n += 4)
      Jn[u] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, c = this.h2 | 0, f = c, d = this.h3 | 0, l = d, a = this.h4 | 0, b = a;
    for (let u = 0; u < 5; u++) {
      const g = 4 - u, y = Cu[u], A = ku[u], _ = uo[u], L = bo[u], x = Uu[u], $ = Ou[u];
      for (let m = 0; m < 16; m++) {
        const k = Zn(r + Ui(u, o, c, d) + Jn[_[m]] + y, x[m]) + a | 0;
        r = a, a = d, d = Zn(c, 10) | 0, c = o, o = k;
      }
      for (let m = 0; m < 16; m++) {
        const k = Zn(s + Ui(g, i, f, l) + Jn[L[m]] + A, $[m]) + b | 0;
        s = b, b = l, l = Zn(f, 10) | 0, f = i, i = k;
      }
    }
    this.set(this.h1 + c + l | 0, this.h2 + d + b | 0, this.h3 + a + s | 0, this.h4 + r + i | 0, this.h0 + o + f | 0);
  }
  roundClean() {
    Jn.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Nu = Te(() => new Pu());
function Du(t) {
  return Nu(t);
}
const Qn = BigInt(2 ** 32 - 1), Hs = BigInt(32);
function za(t, e = !1) {
  return e ? { h: Number(t & Qn), l: Number(t >> Hs & Qn) } : { h: Number(t >> Hs & Qn) | 0, l: Number(t & Qn) | 0 };
}
function Fu(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = za(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const Tu = (t, e) => BigInt(t >>> 0) << Hs | BigInt(e >>> 0), Mu = (t, e, n) => t >>> n, Gu = (t, e, n) => t << 32 - n | e >>> n, Ru = (t, e, n) => t >>> n | e << 32 - n, Ku = (t, e, n) => t << 32 - n | e >>> n, Vu = (t, e, n) => t << 64 - n | e >>> n - 32, zu = (t, e, n) => t >>> n - 32 | e << 64 - n, ju = (t, e) => e, qu = (t, e) => t, Wu = (t, e, n) => t << n | e >>> 32 - n, Xu = (t, e, n) => e << n | t >>> 32 - n, Yu = (t, e, n) => e << n - 32 | t >>> 64 - n, Zu = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Ju(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Qu = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), td = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, ed = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), nd = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, rd = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), sd = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, F = {
  fromBig: za,
  split: Fu,
  toBig: Tu,
  shrSH: Mu,
  shrSL: Gu,
  rotrSH: Ru,
  rotrSL: Ku,
  rotrBH: Vu,
  rotrBL: zu,
  rotr32H: ju,
  rotr32L: qu,
  rotlSH: Wu,
  rotlSL: Xu,
  rotlBH: Yu,
  rotlBL: Zu,
  add: Ju,
  add3L: Qu,
  add3H: td,
  add4L: ed,
  add4H: nd,
  add5H: sd,
  add5L: rd
}, [od, id] = F.split([
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
].map((t) => BigInt(t))), Zt = new Uint32Array(80), Jt = new Uint32Array(80);
let Nr = class extends io {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: c, Dl: f, Eh: d, El: l, Fh: a, Fl: b, Gh: u, Gl: g, Hh: y, Hl: A } = this;
    return [e, n, r, s, o, i, c, f, d, l, a, b, u, g, y, A];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, f, d, l, a, b, u, g, y, A) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = f | 0, this.Eh = d | 0, this.El = l | 0, this.Fh = a | 0, this.Fl = b | 0, this.Gh = u | 0, this.Gl = g | 0, this.Hh = y | 0, this.Hl = A | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      Zt[x] = e.getUint32(n), Jt[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const $ = Zt[x - 15] | 0, m = Jt[x - 15] | 0, k = F.rotrSH($, m, 1) ^ F.rotrSH($, m, 8) ^ F.shrSH($, m, 7), D = F.rotrSL($, m, 1) ^ F.rotrSL($, m, 8) ^ F.shrSL($, m, 7), U = Zt[x - 2] | 0, O = Jt[x - 2] | 0, p = F.rotrSH(U, O, 19) ^ F.rotrBH(U, O, 61) ^ F.shrSH(U, O, 6), S = F.rotrSL(U, O, 19) ^ F.rotrBL(U, O, 61) ^ F.shrSL(U, O, 6), I = F.add4L(D, S, Jt[x - 7], Jt[x - 16]), N = F.add4H(I, k, p, Zt[x - 7], Zt[x - 16]);
      Zt[x] = N | 0, Jt[x] = I | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: c, Cl: f, Dh: d, Dl: l, Eh: a, El: b, Fh: u, Fl: g, Gh: y, Gl: A, Hh: _, Hl: L } = this;
    for (let x = 0; x < 80; x++) {
      const $ = F.rotrSH(a, b, 14) ^ F.rotrSH(a, b, 18) ^ F.rotrBH(a, b, 41), m = F.rotrSL(a, b, 14) ^ F.rotrSL(a, b, 18) ^ F.rotrBL(a, b, 41), k = a & u ^ ~a & y, D = b & g ^ ~b & A, U = F.add5L(L, m, D, id[x], Jt[x]), O = F.add5H(U, _, $, k, od[x], Zt[x]), p = U | 0, S = F.rotrSH(r, s, 28) ^ F.rotrBH(r, s, 34) ^ F.rotrBH(r, s, 39), I = F.rotrSL(r, s, 28) ^ F.rotrBL(r, s, 34) ^ F.rotrBL(r, s, 39), N = r & o ^ r & c ^ o & c, V = s & i ^ s & f ^ i & f;
      _ = y | 0, L = A | 0, y = u | 0, A = g | 0, u = a | 0, g = b | 0, { h: a, l: b } = F.add(d | 0, l | 0, O | 0, p | 0), d = c | 0, l = f | 0, c = o | 0, f = i | 0, o = r | 0, i = s | 0;
      const P = F.add3L(p, I, V);
      r = F.add3H(P, O, S, N), s = P | 0;
    }
    ({ h: r, l: s } = F.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = F.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: c, l: f } = F.add(this.Ch | 0, this.Cl | 0, c | 0, f | 0), { h: d, l } = F.add(this.Dh | 0, this.Dl | 0, d | 0, l | 0), { h: a, l: b } = F.add(this.Eh | 0, this.El | 0, a | 0, b | 0), { h: u, l: g } = F.add(this.Fh | 0, this.Fl | 0, u | 0, g | 0), { h: y, l: A } = F.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: _, l: L } = F.add(this.Hh | 0, this.Hl | 0, _ | 0, L | 0), this.set(r, s, o, i, c, f, d, l, a, b, u, g, y, A, _, L);
  }
  roundClean() {
    Zt.fill(0), Jt.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, cd = class extends Nr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, ad = class extends Nr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, fd = class extends Nr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const hd = Te(() => new Nr());
Te(() => new cd());
Te(() => new ad());
Te(() => new fd());
function ja(t) {
  return Qe(t);
}
function ld(t) {
  return hd(t);
}
const ud = 0;
tt.hmacSha256Sync = (t, ...e) => {
  const n = Pr.create(Qe, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function dd() {
  return gt(tt.randomPrivateKey());
}
function bd(t) {
  const e = Qe(Qe(t));
  return _u.encode(jt(t, e).slice(0, t.length + 4));
}
function pd(t, e) {
  return bd(jt(new Uint8Array([t]), e.slice(0, 20)));
}
function qa(t, e = ud) {
  const n = typeof t == "string" ? ut(t) : t, r = Du(ja(n));
  return pd(e, r);
}
function Wa(t) {
  const e = Ll(t);
  return gt(ho(e.slice(0, 32), !0));
}
tt.hmacSha256Sync = (t, ...e) => {
  const n = Pr.create(Qe, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Ar;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Ar || (Ar = {}));
async function gd(t, e, n) {
  return await (await Ga()).encrypt("aes-256-cbc", e, t, n);
}
async function xd(t, e, n) {
  return await (await Ga()).decrypt("aes-256-cbc", e, t, n);
}
function Xa(t, e) {
  return Pr(Qe, t, e);
}
function wd(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function Ya(t) {
  const e = ld(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function yd(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function md(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Ar.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Ar.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !yd(t))
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
async function Sd(t, e, n, r) {
  const s = md(t);
  if (!s.result)
    throw s;
  const o = tt.randomPrivateKey(), i = ho(o, !0);
  let c = lo(o, t, !0);
  c = c.slice(1);
  const f = Ya(c), d = tt.randomBytes(16), l = await gd(d, f.encryptionKey, e), a = jt(d, i, l), b = Xa(f.hmacKey, a);
  let u;
  if (!r || r === "hex")
    u = gt(l);
  else if (r === "base64")
    u = hu(l);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const g = {
    iv: gt(d),
    ephemeralPK: gt(i),
    cipherText: u,
    mac: gt(b),
    wasString: n
  };
  return r && r !== "hex" && (g.cipherTextEncoding = r), g;
}
async function Za(t, e) {
  if (!e.ephemeralPK)
    throw new mi("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = lo(t, n, !0);
  r = r.slice(1);
  const s = Ya(r), o = ut(e.iv);
  let i;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    i = ut(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    i = fu(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const c = jt(o, ut(n), i), f = Xa(s.hmacKey, c), d = ut(e.mac);
  if (!wd(d, f))
    throw new mi("Decryption failed: failure in MAC check");
  const l = await xd(o, s.encryptionKey, i);
  return e.wasString ? ya(l) : l;
}
function Ed(t, e) {
  const n = typeof e == "string" ? On(e) : e, r = Wa(t), s = ja(n), o = ka(s, t);
  return {
    signature: gt(o),
    publicKey: r
  };
}
async function Ad(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = Wa(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", o = typeof t == "string" ? On(t) : t, i = await Sd(n.publicKey, o, s, n.cipherTextEncoding);
  let c = JSON.stringify(i);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const f = Ed(r, c), d = {
      signature: f.signature,
      publicKey: f.publicKey,
      cipherText: c
    };
    c = JSON.stringify(d);
  }
  return c;
}
function vd(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return Za(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var at = {}, sn = {}, it = {};
Object.defineProperty(it, "__esModule", { value: !0 });
it.decode = it.encode = it.unescape = it.escape = it.pad = void 0;
const Ja = kn;
function po(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
it.pad = po;
function Qa(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
it.escape = Qa;
function t0(t) {
  return po(t).replace(/-/g, "+").replace(/_/g, "/");
}
it.unescape = t0;
function $d(t) {
  return Qa((0, Ja.fromByteArray)(new TextEncoder().encode(t)));
}
it.encode = $d;
function Bd(t) {
  return new TextDecoder().decode((0, Ja.toByteArray)(po(t0(t))));
}
it.decode = Bd;
var Dr = {}, Fr = {};
const Ye = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function e0(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function _s(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function $e(t, ...e) {
  if (!e0(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function n0(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  _s(t.outputLen), _s(t.blockLen);
}
function Hn(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function r0(t, e) {
  $e(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function Hd(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function _d(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function _n(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function pr(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function xt(t, e) {
  return t << 32 - e | t >>> e;
}
function Ld(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const go = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function xo(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const s0 = go ? (t) => t : (t) => xo(t), Id = s0;
function o0(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = xo(t[e]);
  return t;
}
const Ud = go ? (t) => t : o0, i0 = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", Od = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Cd(t) {
  if ($e(t), i0)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Od[t[n]];
  return e;
}
const Tt = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Oi(t) {
  if (t >= Tt._0 && t <= Tt._9)
    return t - Tt._0;
  if (t >= Tt.A && t <= Tt.F)
    return t - (Tt.A - 10);
  if (t >= Tt.a && t <= Tt.f)
    return t - (Tt.a - 10);
}
function kd(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (i0)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, o = 0; s < n; s++, o += 2) {
    const i = Oi(t.charCodeAt(o)), c = Oi(t.charCodeAt(o + 1));
    if (i === void 0 || c === void 0) {
      const f = t[o] + t[o + 1];
      throw new Error('hex string expected, got non-hex character "' + f + '" at index ' + o);
    }
    r[s] = i * 16 + c;
  }
  return r;
}
const c0 = async () => {
};
async function Pd(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const o = Date.now() - r;
    o >= 0 && o < e || (await c0(), r += o);
  }
}
function wo(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function Nd(t) {
  return new TextDecoder().decode(t);
}
function bn(t) {
  return typeof t == "string" && (t = wo(t)), $e(t), t;
}
function Dd(t) {
  return typeof t == "string" && (t = wo(t)), $e(t), t;
}
function Fd(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    $e(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const o = t[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function Td(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let yo = class {
};
function Tr(t) {
  const e = (r) => t().update(bn(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function a0(t) {
  const e = (r, s) => t(s).update(bn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function f0(t) {
  const e = (r, s) => t(s).update(bn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const Md = Tr, Gd = a0, Rd = f0;
function Kd(t = 32) {
  if (Ye && typeof Ye.getRandomValues == "function")
    return Ye.getRandomValues(new Uint8Array(t));
  if (Ye && typeof Ye.randomBytes == "function")
    return Uint8Array.from(Ye.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const Vd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: yo,
  abytes: $e,
  aexists: Hn,
  ahash: n0,
  anumber: _s,
  aoutput: r0,
  asyncLoop: Pd,
  byteSwap: xo,
  byteSwap32: o0,
  byteSwapIfBE: Id,
  bytesToHex: Cd,
  bytesToUtf8: Nd,
  checkOpts: Td,
  clean: _n,
  concatBytes: Fd,
  createHasher: Tr,
  createOptHasher: a0,
  createView: pr,
  createXOFer: f0,
  hexToBytes: kd,
  isBytes: e0,
  isLE: go,
  kdfInputToBytes: Dd,
  nextTick: c0,
  randomBytes: Kd,
  rotl: Ld,
  rotr: xt,
  swap32IfBE: Ud,
  swap8IfBE: s0,
  toBytes: bn,
  u32: _d,
  u8: Hd,
  utf8ToBytes: wo,
  wrapConstructor: Md,
  wrapConstructorWithOpts: Gd,
  wrapXOFConstructorWithOpts: Rd
}, Symbol.toStringTag, { value: "Module" }));
let mo = class extends yo {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, n0(e);
    const r = bn(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, o = new Uint8Array(s);
    o.set(r.length > s ? e.create().update(r).digest() : r);
    for (let i = 0; i < o.length; i++)
      o[i] ^= 54;
    this.iHash.update(o), this.oHash = e.create();
    for (let i = 0; i < o.length; i++)
      o[i] ^= 106;
    this.oHash.update(o), _n(o);
  }
  update(e) {
    return Hn(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Hn(this), $e(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const h0 = (t, e, n) => new mo(t, e).update(n).digest();
h0.create = (t, e) => new mo(t, e);
const zd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HMAC: mo,
  hmac: h0
}, Symbol.toStringTag, { value: "Module" })), jd = /* @__PURE__ */ Cn(zd);
function qd(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), f = r ? 4 : 0, d = r ? 0 : 4;
  t.setUint32(e + f, i, r), t.setUint32(e + d, c, r);
}
function Wd(t, e, n) {
  return t & e ^ ~t & n;
}
function Xd(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class Yd extends yo {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = pr(this.buffer);
  }
  update(e) {
    Hn(this), e = bn(e), $e(e);
    const { view: n, buffer: r, blockLen: s } = this, o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const f = pr(e);
        for (; s <= o - i; i += s)
          this.process(f, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Hn(this), r0(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, _n(this.buffer.subarray(i)), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let a = i; a < s; a++)
      n[a] = 0;
    qd(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = pr(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = f / 4, l = this.get();
    if (d > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let a = 0; a < d; a++)
      c.setUint32(4 * a, l[a], o);
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
const Qt = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), te = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), Zd = /* @__PURE__ */ Uint32Array.from([
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
]), ee = /* @__PURE__ */ new Uint32Array(64);
let So = class extends Yd {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = Qt[0] | 0, this.B = Qt[1] | 0, this.C = Qt[2] | 0, this.D = Qt[3] | 0, this.E = Qt[4] | 0, this.F = Qt[5] | 0, this.G = Qt[6] | 0, this.H = Qt[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: c, H: f } = this;
    return [e, n, r, s, o, i, c, f];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, f) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = c | 0, this.H = f | 0;
  }
  process(e, n) {
    for (let a = 0; a < 16; a++, n += 4)
      ee[a] = e.getUint32(n, !1);
    for (let a = 16; a < 64; a++) {
      const b = ee[a - 15], u = ee[a - 2], g = xt(b, 7) ^ xt(b, 18) ^ b >>> 3, y = xt(u, 17) ^ xt(u, 19) ^ u >>> 10;
      ee[a] = y + ee[a - 7] + g + ee[a - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: f, G: d, H: l } = this;
    for (let a = 0; a < 64; a++) {
      const b = xt(c, 6) ^ xt(c, 11) ^ xt(c, 25), u = l + b + Wd(c, f, d) + Zd[a] + ee[a] | 0, y = (xt(r, 2) ^ xt(r, 13) ^ xt(r, 22)) + Xd(r, s, o) | 0;
      l = d, d = f, f = c, c = i + u | 0, i = o, o = s, s = r, r = u + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, f = f + this.F | 0, d = d + this.G | 0, l = l + this.H | 0, this.set(r, s, o, i, c, f, d, l);
  }
  roundClean() {
    _n(ee);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), _n(this.buffer);
  }
}, l0 = class extends So {
  constructor() {
    super(28), this.A = te[0] | 0, this.B = te[1] | 0, this.C = te[2] | 0, this.D = te[3] | 0, this.E = te[4] | 0, this.F = te[5] | 0, this.G = te[6] | 0, this.H = te[7] | 0;
  }
};
const Jd = /* @__PURE__ */ Tr(() => new So()), Qd = /* @__PURE__ */ Tr(() => new l0()), t1 = So, e1 = Jd, n1 = l0, r1 = Qd, s1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: n1,
  SHA256: t1,
  sha224: r1,
  sha256: e1
}, Symbol.toStringTag, { value: "Module" })), Mr = /* @__PURE__ */ Cn(s1), o1 = /* @__PURE__ */ Cn(cu);
var on = {};
Object.defineProperty(on, "__esModule", { value: !0 });
on.joseToDer = on.derToJose = void 0;
const u0 = kn, d0 = it;
function hs(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const i1 = {
  ES256: hs(256),
  ES384: hs(384),
  ES512: hs(521)
};
function b0(t) {
  const e = i1[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const vr = 128, p0 = 0, c1 = 32, a1 = 16, f1 = 2, g0 = a1 | c1 | p0 << 6, $r = f1 | p0 << 6;
function x0(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, u0.toByteArray)((0, d0.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function h1(t, e) {
  const n = x0(t), r = b0(e), s = r + 1, o = n.length;
  let i = 0;
  if (n[i++] !== g0)
    throw new Error('Could not find expected "seq"');
  let c = n[i++];
  if (c === (vr | 1) && (c = n[i++]), o - i < c)
    throw new Error(`"seq" specified length of "${c}", only "${o - i}" remaining`);
  if (n[i++] !== $r)
    throw new Error('Could not find expected "int" for "r"');
  const f = n[i++];
  if (o - i - 2 < f)
    throw new Error(`"r" specified length of "${f}", only "${o - i - 2}" available`);
  if (s < f)
    throw new Error(`"r" specified length of "${f}", max of "${s}" is acceptable`);
  const d = i;
  if (i += f, n[i++] !== $r)
    throw new Error('Could not find expected "int" for "s"');
  const l = n[i++];
  if (o - i !== l)
    throw new Error(`"s" specified length of "${l}", expected "${o - i}"`);
  if (s < l)
    throw new Error(`"s" specified length of "${l}", max of "${s}" is acceptable`);
  const a = i;
  if (i += l, i !== o)
    throw new Error(`Expected to consume entire array, but "${o - i}" bytes remain`);
  const b = r - f, u = r - l, g = new Uint8Array(b + f + u + l);
  for (i = 0; i < b; ++i)
    g[i] = 0;
  g.set(n.subarray(d + Math.max(-b, 0), d + f), i), i = r;
  for (const y = i; i < y + u; ++i)
    g[i] = 0;
  return g.set(n.subarray(a + Math.max(-u, 0), a + l), i), (0, d0.escape)((0, u0.fromByteArray)(g));
}
on.derToJose = h1;
function Ci(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= vr && --r, r;
}
function l1(t, e) {
  t = x0(t);
  const n = b0(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Ci(t, 0, n), o = Ci(t, n, t.length), i = n - s, c = n - o, f = 2 + i + 1 + 1 + c, d = f < vr, l = new Uint8Array((d ? 2 : 3) + f);
  let a = 0;
  return l[a++] = g0, d ? l[a++] = f : (l[a++] = vr | 1, l[a++] = f & 255), l[a++] = $r, l[a++] = i, s < 0 ? (l[a++] = 0, l.set(t.subarray(0, n), a), a += n) : (l.set(t.subarray(s, n), a), a += n - s), l[a++] = $r, l[a++] = c, o < 0 ? (l[a++] = 0, l.set(t.subarray(n), a)) : l.set(t.subarray(n + o), a), l;
}
on.joseToDer = l1;
var qt = {};
Object.defineProperty(qt, "__esModule", { value: !0 });
qt.InvalidTokenError = qt.MissingParametersError = void 0;
class u1 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
qt.MissingParametersError = u1;
class d1 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
qt.InvalidTokenError = d1;
const Pn = /* @__PURE__ */ Cn(Vd);
Object.defineProperty(Fr, "__esModule", { value: !0 });
Fr.SECP256K1Client = void 0;
const b1 = jd, p1 = Mr, gr = o1, ki = on, Pi = qt, Ni = Pn;
gr.utils.hmacSha256Sync = (t, ...e) => {
  const n = b1.hmac.create(p1.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class w0 {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Ni.bytesToHex)(gr.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Pi.MissingParametersError("a signing input hash and private key are all required");
    const s = gr.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Ni.bytesToHex)(s);
    if (r === "jose")
      return (0, ki.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, ki.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Pi.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return gr.verify(n, e, r, { strict: !1 });
  }
}
Fr.SECP256K1Client = w0;
w0.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Fr;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(Dr);
var ke = {};
const g1 = /* @__PURE__ */ Cn($a);
var x1 = ct && ct.__awaiter || function(t, e, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
    function c(l) {
      try {
        d(r.next(l));
      } catch (a) {
        i(a);
      }
    }
    function f(l) {
      try {
        d(r.throw(l));
      } catch (a) {
        i(a);
      }
    }
    function d(l) {
      l.done ? o(l.value) : s(l.value).then(c, f);
    }
    d((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(ke, "__esModule", { value: !0 });
ke.hashSha256Async = ke.hashSha256 = void 0;
const w1 = Mr;
function y0(t) {
  return (0, w1.sha256)(t);
}
ke.hashSha256 = y0;
function y1(t) {
  return x1(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = g1;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(y0(t));
    }
  });
}
ke.hashSha256Async = y1;
var m1 = ct && ct.__awaiter || function(t, e, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
    function c(l) {
      try {
        d(r.next(l));
      } catch (a) {
        i(a);
      }
    }
    function f(l) {
      try {
        d(r.throw(l));
      } catch (a) {
        i(a);
      }
    }
    function d(l) {
      l.done ? o(l.value) : s(l.value).then(c, f);
    }
    d((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(sn, "__esModule", { value: !0 });
sn.TokenSigner = sn.createUnsecuredToken = void 0;
const Ls = it, Di = Dr, S1 = qt, Fi = ke;
function Is(t, e) {
  const n = [], r = Ls.encode(JSON.stringify(e));
  n.push(r);
  const s = Ls.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function E1(t) {
  return Is(t, { typ: "JWT", alg: "none" }) + ".";
}
sn.createUnsecuredToken = E1;
class A1 {
  constructor(e, n) {
    if (!(e && n))
      throw new S1.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Di.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Di.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), o = Is(e, s), i = (0, Fi.hashSha256)(o);
    return this.createWithSignedHash(e, n, s, o, i);
  }
  signAsync(e, n = !1, r = {}) {
    return m1(this, void 0, void 0, function* () {
      const s = this.header(r), o = Is(e, s), i = yield (0, Fi.hashSha256Async)(o);
      return this.createWithSignedHash(e, n, s, o, i);
    });
  }
  createWithSignedHash(e, n, r, s, o) {
    const i = this.cryptoClient.signHash(o, this.rawPrivateKey);
    return n ? {
      header: [Ls.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [i]
    } : [s, i].join(".");
  }
}
sn.TokenSigner = A1;
var Gr = {};
Object.defineProperty(Gr, "__esModule", { value: !0 });
Gr.TokenVerifier = void 0;
const v1 = it, Ti = Dr, $1 = qt, tr = ke;
class B1 {
  constructor(e, n) {
    if (!(e && n))
      throw new $1.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Ti.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Ti.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, tr.hashSha256Async)(s).then((i) => o(i));
    {
      const i = (0, tr.hashSha256)(s);
      return o(i);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), v1.encode(e.payload)].join(".");
    let s = !0;
    const o = (i) => (e.signature.map((c) => {
      const f = this.cryptoClient.loadSignature(c);
      this.cryptoClient.verifyHash(i, f, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, tr.hashSha256Async)(r).then((i) => o(i));
    {
      const i = (0, tr.hashSha256)(r);
      return o(i);
    }
  }
}
Gr.TokenVerifier = B1;
var Rr = {};
Object.defineProperty(Rr, "__esModule", { value: !0 });
Rr.decodeToken = void 0;
const er = it;
function H1(t) {
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
Rr.decodeToken = H1;
(function(t) {
  var e = ct && ct.__createBinding || (Object.create ? function(r, s, o, i) {
    i === void 0 && (i = o);
    var c = Object.getOwnPropertyDescriptor(s, o);
    (!c || ("get" in c ? !s.__esModule : c.writable || c.configurable)) && (c = { enumerable: !0, get: function() {
      return s[o];
    } }), Object.defineProperty(r, i, c);
  } : function(r, s, o, i) {
    i === void 0 && (i = o), r[i] = s[o];
  }), n = ct && ct.__exportStar || function(r, s) {
    for (var o in r) o !== "default" && !Object.prototype.hasOwnProperty.call(s, o) && e(s, r, o);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(sn, t), n(Gr, t), n(Rr, t), n(qt, t), n(Dr, t);
})(at);
function _1(t) {
  return `did:btc-addr:${t}`;
}
function L1(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new yi("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new yi('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function m0(t) {
  if (t)
    return L1(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const I1 = "1.4.0";
function U1() {
  return dd();
}
function O1(t, e, n, r = ga.slice(), s, o = dl().getTime(), i = {}) {
  const c = (u) => {
    const g = ro("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${u}=undefined])`
    });
    return g == null ? void 0 : g.origin;
  };
  e || (e = `${c("redirectURI")}/`), n || (n = `${c("manifestURI")}/manifest.json`), s || (s = c("appDomain"));
  const f = Object.assign({}, i, {
    jti: pl(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(o / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: I1,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), d = at.SECP256K1Client.derivePublicKey(t);
  f.public_keys = [d];
  const l = qa(d);
  return f.iss = _1(l), new at.TokenSigner("ES256k", t).sign(f);
}
async function Mi(t, e) {
  const n = ya(ut(e)), r = JSON.parse(n), s = await Za(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function C1(t) {
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
function k1(t) {
  const e = at.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = m0(e.iss);
  if (n.length === 1) {
    if (qa(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function P1(t) {
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
function N1(t) {
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
function D1(t) {
  const e = [
    N1(t),
    P1(t),
    C1(t),
    k1(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Gi = "1.0.0";
class ve {
  constructor(e) {
    this.version = Gi, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Gi)
      throw new As(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new ve(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class S0 {
  constructor(e) {
    if (e) {
      const n = new ve(e);
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
class Ri extends S0 {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new ve({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new xa("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new ve({})), !0;
  }
}
class Ki extends S0 {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = hl, !localStorage.getItem(this.key)) {
      const r = new ve({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new xa("No session data was found in localStorage");
    const n = JSON.parse(e);
    return ve.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new ve({})), !0;
  }
}
var Ln;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Ln || (Ln = {}));
var Br;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Br || (Br = {}));
Ln.Mainnet;
var Gt;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Gt || (Gt = {}));
var Lt;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Lt || (Lt = {}));
Gt.Mainnet;
const E0 = {
  chainId: Ln.Mainnet,
  transactionVersion: Gt.Mainnet,
  peerNetworkId: Br.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Lt.MainnetSingleSig,
    multiSig: Lt.MainnetMultiSig
  },
  client: { baseUrl: $l }
}, Us = {
  chainId: Ln.Testnet,
  transactionVersion: Gt.Testnet,
  peerNetworkId: Br.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Lt.TestnetSingleSig,
    multiSig: Lt.TestnetMultiSig
  },
  client: { baseUrl: Bl }
}, xr = {
  ...Us,
  addressVersion: { ...Us.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Hl }
}, F1 = {
  ...xr,
  addressVersion: { ...xr.addressVersion },
  client: { ...xr.client }
};
function T1(t) {
  switch (t) {
    case "mainnet":
      return E0;
    case "testnet":
      return Us;
    case "devnet":
      return xr;
    case "mocknet":
      return F1;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function A0(t) {
  return typeof t == "string" ? T1(t) : t;
}
var Vi;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Vi || (Vi = {}));
var zi;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(zi || (zi = {}));
var wt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(wt || (wt = {}));
const ls = ["onChainOnly", "offChainOnly", "any"];
ls[0] + "", wt.OnChainOnly, ls[1] + "", wt.OffChainOnly, ls[2] + "", wt.Any, wt.OnChainOnly + "", wt.OnChainOnly, wt.OffChainOnly + "", wt.OffChainOnly, wt.Any + "", wt.Any;
var ji;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(ji || (ji = {}));
var qi;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(qi || (qi = {}));
var Wi;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Wi || (Wi = {}));
var Mt;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Mt || (Mt = {}));
var Xi;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Xi || (Xi = {}));
var Yi;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Yi || (Yi = {}));
var Zi;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Zi || (Zi = {}));
var Ji;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Ji || (Ji = {}));
var Qi;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Qi || (Qi = {}));
var tc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(tc || (tc = {}));
var ec;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(ec || (ec = {}));
var nc;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(nc || (nc = {}));
var rc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(rc || (rc = {}));
function Os(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function M1(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function v0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function G1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Os(t.outputLen), Os(t.blockLen);
}
function R1(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function K1(t, e) {
  v0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ie = {
  number: Os,
  bool: M1,
  bytes: v0,
  hash: G1,
  exists: R1,
  output: K1
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const us = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), vt = (t, e) => t << 32 - e | t >>> e, V1 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!V1)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function z1(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Eo(t) {
  if (typeof t == "string" && (t = z1(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let $0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Me(t) {
  const e = (r) => t().update(Eo(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
class B0 extends $0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ie.hash(e);
    const r = Eo(n);
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
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: c } = this;
    return e = e, e.finished = s, e.destroyed = o, e.blockLen = i, e.outputLen = c, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const H0 = (t, e, n) => new B0(t, e).update(n).digest();
H0.create = (t, e) => new B0(t, e);
function j1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), f = r ? 4 : 0, d = r ? 0 : 4;
  t.setUint32(e + f, i, r), t.setUint32(e + d, c, r);
}
let Ao = class extends $0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = us(this.buffer);
  }
  update(e) {
    Ie.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Eo(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const f = us(e);
        for (; s <= o - i; i += s)
          this.process(f, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ie.exists(this), Ie.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let a = i; a < s; a++)
      n[a] = 0;
    j1(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = us(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = f / 4, l = this.get();
    if (d > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let a = 0; a < d; a++)
      c.setUint32(4 * a, l[a], o);
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
const q1 = (t, e, n) => t & e ^ ~t & n, W1 = (t, e, n) => t & e ^ t & n ^ e & n, X1 = new Uint32Array([
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
let _0 = class extends Ao {
  constructor() {
    super(64, 32, 8, !1), this.A = ne[0] | 0, this.B = ne[1] | 0, this.C = ne[2] | 0, this.D = ne[3] | 0, this.E = ne[4] | 0, this.F = ne[5] | 0, this.G = ne[6] | 0, this.H = ne[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: c, H: f } = this;
    return [e, n, r, s, o, i, c, f];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, f) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = c | 0, this.H = f | 0;
  }
  process(e, n) {
    for (let a = 0; a < 16; a++, n += 4)
      re[a] = e.getUint32(n, !1);
    for (let a = 16; a < 64; a++) {
      const b = re[a - 15], u = re[a - 2], g = vt(b, 7) ^ vt(b, 18) ^ b >>> 3, y = vt(u, 17) ^ vt(u, 19) ^ u >>> 10;
      re[a] = y + re[a - 7] + g + re[a - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: f, G: d, H: l } = this;
    for (let a = 0; a < 64; a++) {
      const b = vt(c, 6) ^ vt(c, 11) ^ vt(c, 25), u = l + b + q1(c, f, d) + X1[a] + re[a] | 0, y = (vt(r, 2) ^ vt(r, 13) ^ vt(r, 22)) + W1(r, s, o) | 0;
      l = d, d = f, f = c, c = i + u | 0, i = o, o = s, s = r, r = u + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, f = f + this.F | 0, d = d + this.G | 0, l = l + this.H | 0, this.set(r, s, o, i, c, f, d, l);
  }
  roundClean() {
    re.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Y1 = class extends _0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const L0 = Me(() => new _0());
Me(() => new Y1());
var vo = {}, $o = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = Pn;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(i, c) {
    if (!i.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    i.length % 2 !== 0 && (i = `0${i}`), i = i.toLowerCase();
    let f = [], d = 0;
    for (let u = i.length - 1; u >= 0; u--)
      if (d < 4) {
        const g = n.indexOf(i[u]) >> d;
        let y = 0;
        u !== 0 && (y = n.indexOf(i[u - 1]));
        const A = 1 + d, _ = y % (1 << A) << 5 - A, L = t.c32[g + _];
        d = A, f.unshift(L);
      } else
        d = 0;
    let l = 0;
    for (let u = 0; u < f.length && f[u] === "0"; u++)
      l++;
    f = f.slice(l);
    const a = new TextDecoder().decode((0, e.hexToBytes)(i)).match(/^\u0000*/), b = a ? a[0].length : 0;
    for (let u = 0; u < b; u++)
      f.unshift(t.c32[0]);
    if (c) {
      const u = c - f.length;
      for (let g = 0; g < u; g++)
        f.unshift(t.c32[0]);
    }
    return f.join("");
  }
  t.c32encode = r;
  function s(i) {
    return i.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  t.c32normalize = s;
  function o(i, c) {
    if (i = s(i), !i.match(`^[${t.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const f = i.match(`^${t.c32[0]}*`), d = f ? f[0].length : 0;
    let l = [], a = 0, b = 0;
    for (let y = i.length - 1; y >= 0; y--) {
      b === 4 && (l.unshift(n[a]), b = 0, a = 0);
      const _ = (t.c32.indexOf(i[y]) << b) + a, L = n[_ % 16];
      if (b += 1, a = _ >> 4, a > 1 << b)
        throw new Error("Panic error in decoding.");
      l.unshift(L);
    }
    l.unshift(n[a]), l.length % 2 === 1 && l.unshift("0");
    let u = 0;
    for (let y = 0; y < l.length && l[y] === "0"; y++)
      u++;
    l = l.slice(u - u % 2);
    let g = l.join("");
    for (let y = 0; y < d; y++)
      g = `00${g}`;
    if (c) {
      const y = c * 2 - g.length;
      for (let A = 0; A < y; A += 2)
        g = `00${g}`;
    }
    return g;
  }
  t.c32decode = o;
})($o);
var Pe = {};
Object.defineProperty(Pe, "__esModule", { value: !0 });
Pe.c32checkDecode = Pe.c32checkEncode = void 0;
const sc = Mr, oc = Pn, vn = $o;
function I0(t) {
  const e = (0, sc.sha256)((0, sc.sha256)((0, oc.hexToBytes)(t)));
  return (0, oc.bytesToHex)(e.slice(0, 4));
}
function Z1(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = I0(`${n}${e}`), s = (0, vn.c32encode)(`${e}${r}`);
  return `${vn.c32[t]}${s}`;
}
Pe.c32checkEncode = Z1;
function J1(t) {
  t = (0, vn.c32normalize)(t);
  const e = (0, vn.c32decode)(t.slice(1)), n = t[0], r = vn.c32.indexOf(n), s = e.slice(-8);
  let o = r.toString(16);
  if (o.length === 1 && (o = `0${o}`), I0(`${o}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Pe.c32checkDecode = J1;
var U0 = {}, cn = {};
Object.defineProperty(cn, "__esModule", { value: !0 });
cn.decode = cn.encode = void 0;
const Hr = Mr, ic = Pn, O0 = Ra, C0 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function Q1(t, e = "00") {
  const n = typeof t == "string" ? (0, ic.hexToBytes)(t) : t, r = typeof e == "string" ? (0, ic.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Hr.sha256)((0, Hr.sha256)(new Uint8Array([...r, ...n])));
  return O0(C0).encode([...r, ...n, ...s.slice(0, 4)]);
}
cn.encode = Q1;
function t2(t) {
  const e = O0(C0).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Hr.sha256)((0, Hr.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((o, i) => {
    if (o !== s[i])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
cn.decode = t2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Pe, n = cn, r = Pn;
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
  function i(l, a) {
    if (!a.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, e.c32checkEncode)(l, a)}`;
  }
  t.c32address = i;
  function c(l) {
    if (l.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (l[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, e.c32checkDecode)(l.slice(1));
  }
  t.c32addressDecode = c;
  function f(l, a = -1) {
    const b = n.decode(l), u = (0, r.bytesToHex)(b.data), g = parseInt((0, r.bytesToHex)(b.prefix), 16);
    let y;
    return a < 0 ? (y = g, s[g] !== void 0 && (y = s[g])) : y = a, i(y, u);
  }
  t.b58ToC32 = f;
  function d(l, a = -1) {
    const b = c(l), u = b[0], g = b[1];
    let y;
    a < 0 ? (y = u, o[u] !== void 0 && (y = o[u])) : y = a;
    let A = y.toString(16);
    return A.length === 1 && (A = `0${A}`), n.encode(g, A);
  }
  t.c32ToB58 = d;
})(U0);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = $o;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Pe;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = U0;
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
})(vo);
function e2(t, e) {
  switch (e = A0(e ?? E0), t) {
    case Mt.P2PKH:
      switch (e.transactionVersion) {
        case Gt.Mainnet:
          return Lt.MainnetSingleSig;
        case Gt.Testnet:
          return Lt.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case Mt.P2SH:
    case Mt.P2SHNonSequential:
    case Mt.P2WPKH:
    case Mt.P2WSH:
    case Mt.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Gt.Mainnet:
          return Lt.MainnetMultiSig;
        case Gt.Testnet:
          return Lt.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const n2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), k0 = Uint8Array.from({ length: 16 }, (t, e) => e), r2 = k0.map((t) => (9 * t + 5) % 16);
let Bo = [k0], Ho = [r2];
for (let t = 0; t < 4; t++)
  for (let e of [Bo, Ho])
    e.push(e[t].map((n) => n2[n]));
const P0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), s2 = Bo.map((t, e) => t.map((n) => P0[e][n])), o2 = Ho.map((t, e) => t.map((n) => P0[e][n])), i2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), c2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), nr = (t, e) => t << e | t >>> 32 - e;
function cc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const rr = new Uint32Array(16);
let a2 = class extends Ao {
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
    for (let u = 0; u < 16; u++, n += 4)
      rr[u] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, c = this.h2 | 0, f = c, d = this.h3 | 0, l = d, a = this.h4 | 0, b = a;
    for (let u = 0; u < 5; u++) {
      const g = 4 - u, y = i2[u], A = c2[u], _ = Bo[u], L = Ho[u], x = s2[u], $ = o2[u];
      for (let m = 0; m < 16; m++) {
        const k = nr(r + cc(u, o, c, d) + rr[_[m]] + y, x[m]) + a | 0;
        r = a, a = d, d = nr(c, 10) | 0, c = o, o = k;
      }
      for (let m = 0; m < 16; m++) {
        const k = nr(s + cc(g, i, f, l) + rr[L[m]] + A, $[m]) + b | 0;
        s = b, b = l, l = nr(f, 10) | 0, f = i, i = k;
      }
    }
    this.set(this.h1 + c + l | 0, this.h2 + d + b | 0, this.h3 + a + s | 0, this.h4 + r + i | 0, this.h0 + o + f | 0);
  }
  roundClean() {
    rr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const f2 = Me(() => new a2()), sr = BigInt(2 ** 32 - 1), Cs = BigInt(32);
function N0(t, e = !1) {
  return e ? { h: Number(t & sr), l: Number(t >> Cs & sr) } : { h: Number(t >> Cs & sr) | 0, l: Number(t & sr) | 0 };
}
function h2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = N0(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const l2 = (t, e) => BigInt(t >>> 0) << Cs | BigInt(e >>> 0), u2 = (t, e, n) => t >>> n, d2 = (t, e, n) => t << 32 - n | e >>> n, b2 = (t, e, n) => t >>> n | e << 32 - n, p2 = (t, e, n) => t << 32 - n | e >>> n, g2 = (t, e, n) => t << 64 - n | e >>> n - 32, x2 = (t, e, n) => t >>> n - 32 | e << 64 - n, w2 = (t, e) => e, y2 = (t, e) => t, m2 = (t, e, n) => t << n | e >>> 32 - n, S2 = (t, e, n) => e << n | t >>> 32 - n, E2 = (t, e, n) => e << n - 32 | t >>> 64 - n, A2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function v2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const $2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), B2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, H2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), _2 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, L2 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), I2 = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, T = {
  fromBig: N0,
  split: h2,
  toBig: l2,
  shrSH: u2,
  shrSL: d2,
  rotrSH: b2,
  rotrSL: p2,
  rotrBH: g2,
  rotrBL: x2,
  rotr32H: w2,
  rotr32L: y2,
  rotlSH: m2,
  rotlSL: S2,
  rotlBH: E2,
  rotlBL: A2,
  add: v2,
  add3L: $2,
  add3H: B2,
  add4L: H2,
  add4H: _2,
  add5H: I2,
  add5L: L2
}, [U2, O2] = T.split([
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
let Kr = class extends Ao {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: c, Dl: f, Eh: d, El: l, Fh: a, Fl: b, Gh: u, Gl: g, Hh: y, Hl: A } = this;
    return [e, n, r, s, o, i, c, f, d, l, a, b, u, g, y, A];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, f, d, l, a, b, u, g, y, A) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = f | 0, this.Eh = d | 0, this.El = l | 0, this.Fh = a | 0, this.Fl = b | 0, this.Gh = u | 0, this.Gl = g | 0, this.Hh = y | 0, this.Hl = A | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      se[x] = e.getUint32(n), oe[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const $ = se[x - 15] | 0, m = oe[x - 15] | 0, k = T.rotrSH($, m, 1) ^ T.rotrSH($, m, 8) ^ T.shrSH($, m, 7), D = T.rotrSL($, m, 1) ^ T.rotrSL($, m, 8) ^ T.shrSL($, m, 7), U = se[x - 2] | 0, O = oe[x - 2] | 0, p = T.rotrSH(U, O, 19) ^ T.rotrBH(U, O, 61) ^ T.shrSH(U, O, 6), S = T.rotrSL(U, O, 19) ^ T.rotrBL(U, O, 61) ^ T.shrSL(U, O, 6), I = T.add4L(D, S, oe[x - 7], oe[x - 16]), N = T.add4H(I, k, p, se[x - 7], se[x - 16]);
      se[x] = N | 0, oe[x] = I | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: c, Cl: f, Dh: d, Dl: l, Eh: a, El: b, Fh: u, Fl: g, Gh: y, Gl: A, Hh: _, Hl: L } = this;
    for (let x = 0; x < 80; x++) {
      const $ = T.rotrSH(a, b, 14) ^ T.rotrSH(a, b, 18) ^ T.rotrBH(a, b, 41), m = T.rotrSL(a, b, 14) ^ T.rotrSL(a, b, 18) ^ T.rotrBL(a, b, 41), k = a & u ^ ~a & y, D = b & g ^ ~b & A, U = T.add5L(L, m, D, O2[x], oe[x]), O = T.add5H(U, _, $, k, U2[x], se[x]), p = U | 0, S = T.rotrSH(r, s, 28) ^ T.rotrBH(r, s, 34) ^ T.rotrBH(r, s, 39), I = T.rotrSL(r, s, 28) ^ T.rotrBL(r, s, 34) ^ T.rotrBL(r, s, 39), N = r & o ^ r & c ^ o & c, V = s & i ^ s & f ^ i & f;
      _ = y | 0, L = A | 0, y = u | 0, A = g | 0, u = a | 0, g = b | 0, { h: a, l: b } = T.add(d | 0, l | 0, O | 0, p | 0), d = c | 0, l = f | 0, c = o | 0, f = i | 0, o = r | 0, i = s | 0;
      const P = T.add3L(p, I, V);
      r = T.add3H(P, O, S, N), s = P | 0;
    }
    ({ h: r, l: s } = T.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = T.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: c, l: f } = T.add(this.Ch | 0, this.Cl | 0, c | 0, f | 0), { h: d, l } = T.add(this.Dh | 0, this.Dl | 0, d | 0, l | 0), { h: a, l: b } = T.add(this.Eh | 0, this.El | 0, a | 0, b | 0), { h: u, l: g } = T.add(this.Fh | 0, this.Fl | 0, u | 0, g | 0), { h: y, l: A } = T.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: _, l: L } = T.add(this.Hh | 0, this.Hl | 0, _ | 0, L | 0), this.set(r, s, o, i, c, f, d, l, a, b, u, g, y, A, _, L);
  }
  roundClean() {
    se.fill(0), oe.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, C2 = class extends Kr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, k2 = class extends Kr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, P2 = class extends Kr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Me(() => new Kr());
Me(() => new C2());
Me(() => new k2());
Me(() => new P2());
var _r = { exports: {} };
_r.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, o = "[object Arguments]", i = "[object Array]", c = "[object Boolean]", f = "[object Date]", d = "[object Error]", l = "[object Function]", a = "[object GeneratorFunction]", b = "[object Map]", u = "[object Number]", g = "[object Object]", y = "[object Promise]", A = "[object RegExp]", _ = "[object Set]", L = "[object String]", x = "[object Symbol]", $ = "[object WeakMap]", m = "[object ArrayBuffer]", k = "[object DataView]", D = "[object Float32Array]", U = "[object Float64Array]", O = "[object Int8Array]", p = "[object Int16Array]", S = "[object Int32Array]", I = "[object Uint8Array]", N = "[object Uint8ClampedArray]", V = "[object Uint16Array]", P = "[object Uint32Array]", Ve = /[\\^$.*+?()[\]{}|]/g, xn = /\w*$/, Tn = /^\[object .+?Constructor\]$/, et = /^(?:0|[1-9]\d*)$/, z = {};
  z[o] = z[i] = z[m] = z[k] = z[c] = z[f] = z[D] = z[U] = z[O] = z[p] = z[S] = z[b] = z[u] = z[g] = z[A] = z[_] = z[L] = z[x] = z[I] = z[N] = z[V] = z[P] = !0, z[d] = z[l] = z[$] = !1;
  var Tf = typeof ct == "object" && ct && ct.Object === Object && ct, Mf = typeof self == "object" && self && self.Object === Object && self, Nt = Tf || Mf || Function("return this")(), Wo = e && !e.nodeType && e, Xo = Wo && !0 && t && !t.nodeType && t, Gf = Xo && Xo.exports === Wo;
  function Rf(h, w) {
    return h.set(w[0], w[1]), h;
  }
  function Kf(h, w) {
    return h.add(w), h;
  }
  function Vf(h, w) {
    for (var E = -1, C = h ? h.length : 0; ++E < C && w(h[E], E, h) !== !1; )
      ;
    return h;
  }
  function zf(h, w) {
    for (var E = -1, C = w.length, ot = h.length; ++E < C; )
      h[ot + E] = w[E];
    return h;
  }
  function Yo(h, w, E, C) {
    for (var ot = -1, ft = h ? h.length : 0; ++ot < ft; )
      E = w(E, h[ot], ot, h);
    return E;
  }
  function jf(h, w) {
    for (var E = -1, C = Array(h); ++E < h; )
      C[E] = w(E);
    return C;
  }
  function qf(h, w) {
    return h == null ? void 0 : h[w];
  }
  function Zo(h) {
    var w = !1;
    if (h != null && typeof h.toString != "function")
      try {
        w = !!(h + "");
      } catch {
      }
    return w;
  }
  function Jo(h) {
    var w = -1, E = Array(h.size);
    return h.forEach(function(C, ot) {
      E[++w] = [ot, C];
    }), E;
  }
  function Yr(h, w) {
    return function(E) {
      return h(w(E));
    };
  }
  function Qo(h) {
    var w = -1, E = Array(h.size);
    return h.forEach(function(C) {
      E[++w] = C;
    }), E;
  }
  var Wf = Array.prototype, Xf = Function.prototype, Mn = Object.prototype, Zr = Nt["__core-js_shared__"], ti = function() {
    var h = /[^.]+$/.exec(Zr && Zr.keys && Zr.keys.IE_PROTO || "");
    return h ? "Symbol(src)_1." + h : "";
  }(), ei = Xf.toString, Wt = Mn.hasOwnProperty, Gn = Mn.toString, Yf = RegExp(
    "^" + ei.call(Wt).replace(Ve, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), ni = Gf ? Nt.Buffer : void 0, ri = Nt.Symbol, si = Nt.Uint8Array, Zf = Yr(Object.getPrototypeOf, Object), Jf = Object.create, Qf = Mn.propertyIsEnumerable, th = Wf.splice, oi = Object.getOwnPropertySymbols, eh = ni ? ni.isBuffer : void 0, nh = Yr(Object.keys, Object), Jr = qe(Nt, "DataView"), wn = qe(Nt, "Map"), Qr = qe(Nt, "Promise"), ts = qe(Nt, "Set"), es = qe(Nt, "WeakMap"), yn = qe(Object, "create"), rh = _e(Jr), sh = _e(wn), oh = _e(Qr), ih = _e(ts), ch = _e(es), ii = ri ? ri.prototype : void 0, ci = ii ? ii.valueOf : void 0;
  function Be(h) {
    var w = -1, E = h ? h.length : 0;
    for (this.clear(); ++w < E; ) {
      var C = h[w];
      this.set(C[0], C[1]);
    }
  }
  function ah() {
    this.__data__ = yn ? yn(null) : {};
  }
  function fh(h) {
    return this.has(h) && delete this.__data__[h];
  }
  function hh(h) {
    var w = this.__data__;
    if (yn) {
      var E = w[h];
      return E === r ? void 0 : E;
    }
    return Wt.call(w, h) ? w[h] : void 0;
  }
  function lh(h) {
    var w = this.__data__;
    return yn ? w[h] !== void 0 : Wt.call(w, h);
  }
  function uh(h, w) {
    var E = this.__data__;
    return E[h] = yn && w === void 0 ? r : w, this;
  }
  Be.prototype.clear = ah, Be.prototype.delete = fh, Be.prototype.get = hh, Be.prototype.has = lh, Be.prototype.set = uh;
  function Dt(h) {
    var w = -1, E = h ? h.length : 0;
    for (this.clear(); ++w < E; ) {
      var C = h[w];
      this.set(C[0], C[1]);
    }
  }
  function dh() {
    this.__data__ = [];
  }
  function bh(h) {
    var w = this.__data__, E = Rn(w, h);
    if (E < 0)
      return !1;
    var C = w.length - 1;
    return E == C ? w.pop() : th.call(w, E, 1), !0;
  }
  function ph(h) {
    var w = this.__data__, E = Rn(w, h);
    return E < 0 ? void 0 : w[E][1];
  }
  function gh(h) {
    return Rn(this.__data__, h) > -1;
  }
  function xh(h, w) {
    var E = this.__data__, C = Rn(E, h);
    return C < 0 ? E.push([h, w]) : E[C][1] = w, this;
  }
  Dt.prototype.clear = dh, Dt.prototype.delete = bh, Dt.prototype.get = ph, Dt.prototype.has = gh, Dt.prototype.set = xh;
  function ze(h) {
    var w = -1, E = h ? h.length : 0;
    for (this.clear(); ++w < E; ) {
      var C = h[w];
      this.set(C[0], C[1]);
    }
  }
  function wh() {
    this.__data__ = {
      hash: new Be(),
      map: new (wn || Dt)(),
      string: new Be()
    };
  }
  function yh(h) {
    return Kn(this, h).delete(h);
  }
  function mh(h) {
    return Kn(this, h).get(h);
  }
  function Sh(h) {
    return Kn(this, h).has(h);
  }
  function Eh(h, w) {
    return Kn(this, h).set(h, w), this;
  }
  ze.prototype.clear = wh, ze.prototype.delete = yh, ze.prototype.get = mh, ze.prototype.has = Sh, ze.prototype.set = Eh;
  function je(h) {
    this.__data__ = new Dt(h);
  }
  function Ah() {
    this.__data__ = new Dt();
  }
  function vh(h) {
    return this.__data__.delete(h);
  }
  function $h(h) {
    return this.__data__.get(h);
  }
  function Bh(h) {
    return this.__data__.has(h);
  }
  function Hh(h, w) {
    var E = this.__data__;
    if (E instanceof Dt) {
      var C = E.__data__;
      if (!wn || C.length < n - 1)
        return C.push([h, w]), this;
      E = this.__data__ = new ze(C);
    }
    return E.set(h, w), this;
  }
  je.prototype.clear = Ah, je.prototype.delete = vh, je.prototype.get = $h, je.prototype.has = Bh, je.prototype.set = Hh;
  function _h(h, w) {
    var E = ss(h) || Jh(h) ? jf(h.length, String) : [], C = E.length, ot = !!C;
    for (var ft in h)
      Wt.call(h, ft) && !(ot && (ft == "length" || Wh(ft, C))) && E.push(ft);
    return E;
  }
  function ai(h, w, E) {
    var C = h[w];
    (!(Wt.call(h, w) && ui(C, E)) || E === void 0 && !(w in h)) && (h[w] = E);
  }
  function Rn(h, w) {
    for (var E = h.length; E--; )
      if (ui(h[E][0], w))
        return E;
    return -1;
  }
  function Lh(h, w) {
    return h && fi(w, os(w), h);
  }
  function ns(h, w, E, C, ot, ft, Ft) {
    var ht;
    if (C && (ht = ft ? C(h, ot, ft, Ft) : C(h)), ht !== void 0)
      return ht;
    if (!Vn(h))
      return h;
    var pi = ss(h);
    if (pi) {
      if (ht = zh(h), !w)
        return Rh(h, ht);
    } else {
      var We = He(h), gi = We == l || We == a;
      if (tl(h))
        return Ph(h, w);
      if (We == g || We == o || gi && !ft) {
        if (Zo(h))
          return ft ? h : {};
        if (ht = jh(gi ? {} : h), !w)
          return Kh(h, Lh(ht, h));
      } else {
        if (!z[We])
          return ft ? h : {};
        ht = qh(h, We, ns, w);
      }
    }
    Ft || (Ft = new je());
    var xi = Ft.get(h);
    if (xi)
      return xi;
    if (Ft.set(h, ht), !pi)
      var wi = E ? Vh(h) : os(h);
    return Vf(wi || h, function(is, zn) {
      wi && (zn = is, is = h[zn]), ai(ht, zn, ns(is, w, E, C, zn, h, Ft));
    }), ht;
  }
  function Ih(h) {
    return Vn(h) ? Jf(h) : {};
  }
  function Uh(h, w, E) {
    var C = w(h);
    return ss(h) ? C : zf(C, E(h));
  }
  function Oh(h) {
    return Gn.call(h);
  }
  function Ch(h) {
    if (!Vn(h) || Yh(h))
      return !1;
    var w = bi(h) || Zo(h) ? Yf : Tn;
    return w.test(_e(h));
  }
  function kh(h) {
    if (!li(h))
      return nh(h);
    var w = [];
    for (var E in Object(h))
      Wt.call(h, E) && E != "constructor" && w.push(E);
    return w;
  }
  function Ph(h, w) {
    if (w)
      return h.slice();
    var E = new h.constructor(h.length);
    return h.copy(E), E;
  }
  function rs(h) {
    var w = new h.constructor(h.byteLength);
    return new si(w).set(new si(h)), w;
  }
  function Nh(h, w) {
    var E = w ? rs(h.buffer) : h.buffer;
    return new h.constructor(E, h.byteOffset, h.byteLength);
  }
  function Dh(h, w, E) {
    var C = w ? E(Jo(h), !0) : Jo(h);
    return Yo(C, Rf, new h.constructor());
  }
  function Fh(h) {
    var w = new h.constructor(h.source, xn.exec(h));
    return w.lastIndex = h.lastIndex, w;
  }
  function Th(h, w, E) {
    var C = w ? E(Qo(h), !0) : Qo(h);
    return Yo(C, Kf, new h.constructor());
  }
  function Mh(h) {
    return ci ? Object(ci.call(h)) : {};
  }
  function Gh(h, w) {
    var E = w ? rs(h.buffer) : h.buffer;
    return new h.constructor(E, h.byteOffset, h.length);
  }
  function Rh(h, w) {
    var E = -1, C = h.length;
    for (w || (w = Array(C)); ++E < C; )
      w[E] = h[E];
    return w;
  }
  function fi(h, w, E, C) {
    E || (E = {});
    for (var ot = -1, ft = w.length; ++ot < ft; ) {
      var Ft = w[ot], ht = void 0;
      ai(E, Ft, ht === void 0 ? h[Ft] : ht);
    }
    return E;
  }
  function Kh(h, w) {
    return fi(h, hi(h), w);
  }
  function Vh(h) {
    return Uh(h, os, hi);
  }
  function Kn(h, w) {
    var E = h.__data__;
    return Xh(w) ? E[typeof w == "string" ? "string" : "hash"] : E.map;
  }
  function qe(h, w) {
    var E = qf(h, w);
    return Ch(E) ? E : void 0;
  }
  var hi = oi ? Yr(oi, Object) : rl, He = Oh;
  (Jr && He(new Jr(new ArrayBuffer(1))) != k || wn && He(new wn()) != b || Qr && He(Qr.resolve()) != y || ts && He(new ts()) != _ || es && He(new es()) != $) && (He = function(h) {
    var w = Gn.call(h), E = w == g ? h.constructor : void 0, C = E ? _e(E) : void 0;
    if (C)
      switch (C) {
        case rh:
          return k;
        case sh:
          return b;
        case oh:
          return y;
        case ih:
          return _;
        case ch:
          return $;
      }
    return w;
  });
  function zh(h) {
    var w = h.length, E = h.constructor(w);
    return w && typeof h[0] == "string" && Wt.call(h, "index") && (E.index = h.index, E.input = h.input), E;
  }
  function jh(h) {
    return typeof h.constructor == "function" && !li(h) ? Ih(Zf(h)) : {};
  }
  function qh(h, w, E, C) {
    var ot = h.constructor;
    switch (w) {
      case m:
        return rs(h);
      case c:
      case f:
        return new ot(+h);
      case k:
        return Nh(h, C);
      case D:
      case U:
      case O:
      case p:
      case S:
      case I:
      case N:
      case V:
      case P:
        return Gh(h, C);
      case b:
        return Dh(h, C, E);
      case u:
      case L:
        return new ot(h);
      case A:
        return Fh(h);
      case _:
        return Th(h, C, E);
      case x:
        return Mh(h);
    }
  }
  function Wh(h, w) {
    return w = w ?? s, !!w && (typeof h == "number" || et.test(h)) && h > -1 && h % 1 == 0 && h < w;
  }
  function Xh(h) {
    var w = typeof h;
    return w == "string" || w == "number" || w == "symbol" || w == "boolean" ? h !== "__proto__" : h === null;
  }
  function Yh(h) {
    return !!ti && ti in h;
  }
  function li(h) {
    var w = h && h.constructor, E = typeof w == "function" && w.prototype || Mn;
    return h === E;
  }
  function _e(h) {
    if (h != null) {
      try {
        return ei.call(h);
      } catch {
      }
      try {
        return h + "";
      } catch {
      }
    }
    return "";
  }
  function Zh(h) {
    return ns(h, !0, !0);
  }
  function ui(h, w) {
    return h === w || h !== h && w !== w;
  }
  function Jh(h) {
    return Qh(h) && Wt.call(h, "callee") && (!Qf.call(h, "callee") || Gn.call(h) == o);
  }
  var ss = Array.isArray;
  function di(h) {
    return h != null && el(h.length) && !bi(h);
  }
  function Qh(h) {
    return nl(h) && di(h);
  }
  var tl = eh || sl;
  function bi(h) {
    var w = Vn(h) ? Gn.call(h) : "";
    return w == l || w == a;
  }
  function el(h) {
    return typeof h == "number" && h > -1 && h % 1 == 0 && h <= s;
  }
  function Vn(h) {
    var w = typeof h;
    return !!h && (w == "object" || w == "function");
  }
  function nl(h) {
    return !!h && typeof h == "object";
  }
  function os(h) {
    return di(h) ? _h(h) : kh(h);
  }
  function rl() {
    return [];
  }
  function sl() {
    return !1;
  }
  t.exports = Zh;
})(_r, _r.exports);
_r.exports;
var ks;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ks || (ks = {}));
function N2(t, e) {
  return { type: ks.Address, version: t, hash160: e };
}
function D2(t) {
  return vo.c32address(t.version, t.hash160);
}
const F2 = (t) => f2(L0(t)), T2 = (t) => gt(F2(t));
tt.hmacSha256Sync = (t, ...e) => {
  const n = H0.create(L0, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function M2(t, e = "mainnet") {
  e = A0(e), t = typeof t == "string" ? ut(t) : t;
  const n = e2(Mt.P2PKH, e), r = N2(n, T2(t));
  return D2(r);
}
function G2(t, e) {
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
  const s = r.issuer.publicKey, o = M2(s);
  if (e !== s) {
    if (e !== o) throw new Error("Token issuer public key does not match the verifying value");
  }
  const i = new at.TokenVerifier(n.header.alg, s);
  if (!i)
    throw new Error("Invalid token verifier");
  if (!i.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function R2(t, e = null) {
  let n;
  e ? n = G2(t, e) : n = at.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const ac = "_blockstackDidCheckEchoReply", K2 = "echoReply", V2 = "authContinuation";
function z2(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, o] = r.split("=");
    return n[s] = o ? decodeURIComponent(o.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function j2() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[ac];
  if (typeof e == "boolean")
    return e;
  const n = z2(t.location.search), r = n[K2];
  if (r) {
    t[ac] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const o = n[V2];
      t.location.href = o;
    }, 10), !0;
  }
  return !1;
}
class Ps {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new ma();
    else
      throw new ul("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new Ki(e.sessionOptions) : this.store = new Ki() : e ? this.store = new Ri(e.sessionOptions) : this.store = new Ri();
  }
  makeAuthRequestToken(e, n, r, s, o, i = bl().getTime(), c = {}) {
    const f = this.appConfig;
    if (!f)
      throw new As("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || f.redirectURI(), r = r || f.manifestURI(), s = s || f.scopes, o = o || f.appDomain, O1(e, n, r, s, o, i, c);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = U1();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = ro("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (j2())
        return Ze.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Ze.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = Cl()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new jn("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const o = at.decodeToken(e).payload;
    if (typeof o == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await D1(e))
      throw new jn("Invalid authentication response.");
    let c = o.private_key, f = o.core_token;
    if (cs(o.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (o.private_key !== void 0 && o.private_key !== null)
          try {
            c = await Mi(s, o.private_key);
          } catch {
            if (Ze.warn("Failed decryption of appPrivateKey, will try to use as given"), !tt.isValidPrivateKey(o.private_key))
              throw new jn("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (f != null)
          try {
            f = await Mi(s, f);
          } catch {
            Ze.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new jn("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let d = _l, l;
    cs(o.version, "1.2.0") && o.hubUrl !== null && o.hubUrl !== void 0 && (d = o.hubUrl), cs(o.version, "1.3.0") && o.associationToken !== null && o.associationToken !== void 0 && (l = o.associationToken);
    const a = {
      profile: o.profile,
      email: o.email,
      decentralizedID: o.iss,
      identityAddress: m0(o.iss),
      appPrivateKey: c,
      coreSessionToken: f,
      authResponseToken: e,
      hubUrl: d,
      appPrivateKeyFromWalletSalt: o.appPrivateKeyFromWalletSalt,
      coreNode: o.blockstackAPIUrl,
      gaiaAssociationToken: l
    }, b = o.profile_url;
    if (!a.profile && b) {
      const u = await n(b);
      if (!u.ok)
        a.profile = Object.assign({}, fl);
      else {
        const g = await u.text(), y = JSON.parse(g);
        a.profile = R2(y[0].token);
      }
    } else
      a.profile = o.profile;
    return r.userData = a, this.store.setSessionData(r), a;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new As("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Ad(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), vd(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
Ps.prototype.makeAuthRequest = Ps.prototype.makeAuthRequestToken;
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
      function s(p) {
        return p && DataView.prototype.isPrototypeOf(p);
      }
      if (r.arrayBuffer)
        var o = [
          "[object Int8Array]",
          "[object Uint8Array]",
          "[object Uint8ClampedArray]",
          "[object Int16Array]",
          "[object Uint16Array]",
          "[object Int32Array]",
          "[object Uint32Array]",
          "[object Float32Array]",
          "[object Float64Array]"
        ], i = ArrayBuffer.isView || function(p) {
          return p && o.indexOf(Object.prototype.toString.call(p)) > -1;
        };
      function c(p) {
        if (typeof p != "string" && (p = String(p)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(p) || p === "")
          throw new TypeError('Invalid character in header field name: "' + p + '"');
        return p.toLowerCase();
      }
      function f(p) {
        return typeof p != "string" && (p = String(p)), p;
      }
      function d(p) {
        var S = {
          next: function() {
            var I = p.shift();
            return { done: I === void 0, value: I };
          }
        };
        return r.iterable && (S[Symbol.iterator] = function() {
          return S;
        }), S;
      }
      function l(p) {
        this.map = {}, p instanceof l ? p.forEach(function(S, I) {
          this.append(I, S);
        }, this) : Array.isArray(p) ? p.forEach(function(S) {
          if (S.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + S.length);
          this.append(S[0], S[1]);
        }, this) : p && Object.getOwnPropertyNames(p).forEach(function(S) {
          this.append(S, p[S]);
        }, this);
      }
      l.prototype.append = function(p, S) {
        p = c(p), S = f(S);
        var I = this.map[p];
        this.map[p] = I ? I + ", " + S : S;
      }, l.prototype.delete = function(p) {
        delete this.map[c(p)];
      }, l.prototype.get = function(p) {
        return p = c(p), this.has(p) ? this.map[p] : null;
      }, l.prototype.has = function(p) {
        return this.map.hasOwnProperty(c(p));
      }, l.prototype.set = function(p, S) {
        this.map[c(p)] = f(S);
      }, l.prototype.forEach = function(p, S) {
        for (var I in this.map)
          this.map.hasOwnProperty(I) && p.call(S, this.map[I], I, this);
      }, l.prototype.keys = function() {
        var p = [];
        return this.forEach(function(S, I) {
          p.push(I);
        }), d(p);
      }, l.prototype.values = function() {
        var p = [];
        return this.forEach(function(S) {
          p.push(S);
        }), d(p);
      }, l.prototype.entries = function() {
        var p = [];
        return this.forEach(function(S, I) {
          p.push([I, S]);
        }), d(p);
      }, r.iterable && (l.prototype[Symbol.iterator] = l.prototype.entries);
      function a(p) {
        if (!p._noBody) {
          if (p.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          p.bodyUsed = !0;
        }
      }
      function b(p) {
        return new Promise(function(S, I) {
          p.onload = function() {
            S(p.result);
          }, p.onerror = function() {
            I(p.error);
          };
        });
      }
      function u(p) {
        var S = new FileReader(), I = b(S);
        return S.readAsArrayBuffer(p), I;
      }
      function g(p) {
        var S = new FileReader(), I = b(S), N = /charset=([A-Za-z0-9_-]+)/.exec(p.type), V = N ? N[1] : "utf-8";
        return S.readAsText(p, V), I;
      }
      function y(p) {
        for (var S = new Uint8Array(p), I = new Array(S.length), N = 0; N < S.length; N++)
          I[N] = String.fromCharCode(S[N]);
        return I.join("");
      }
      function A(p) {
        if (p.slice)
          return p.slice(0);
        var S = new Uint8Array(p.byteLength);
        return S.set(new Uint8Array(p)), S.buffer;
      }
      function _() {
        return this.bodyUsed = !1, this._initBody = function(p) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = p, p ? typeof p == "string" ? this._bodyText = p : r.blob && Blob.prototype.isPrototypeOf(p) ? this._bodyBlob = p : r.formData && FormData.prototype.isPrototypeOf(p) ? this._bodyFormData = p : r.searchParams && URLSearchParams.prototype.isPrototypeOf(p) ? this._bodyText = p.toString() : r.arrayBuffer && r.blob && s(p) ? (this._bodyArrayBuffer = A(p.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(p) || i(p)) ? this._bodyArrayBuffer = A(p) : this._bodyText = p = Object.prototype.toString.call(p) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof p == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(p) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var p = a(this);
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
            var p = a(this);
            return p || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
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
          var p = a(this);
          if (p)
            return p;
          if (this._bodyBlob)
            return g(this._bodyBlob);
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
      var L = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function x(p) {
        var S = p.toUpperCase();
        return L.indexOf(S) > -1 ? S : p;
      }
      function $(p, S) {
        if (!(this instanceof $))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        S = S || {};
        var I = S.body;
        if (p instanceof $) {
          if (p.bodyUsed)
            throw new TypeError("Already read");
          this.url = p.url, this.credentials = p.credentials, S.headers || (this.headers = new l(p.headers)), this.method = p.method, this.mode = p.mode, this.signal = p.signal, !I && p._bodyInit != null && (I = p._bodyInit, p.bodyUsed = !0);
        } else
          this.url = String(p);
        if (this.credentials = S.credentials || this.credentials || "same-origin", (S.headers || !this.headers) && (this.headers = new l(S.headers)), this.method = x(S.method || this.method || "GET"), this.mode = S.mode || this.mode || null, this.signal = S.signal || this.signal || function() {
          if ("AbortController" in n) {
            var P = new AbortController();
            return P.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && I)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(I), (this.method === "GET" || this.method === "HEAD") && (S.cache === "no-store" || S.cache === "no-cache")) {
          var N = /([?&])_=[^&]*/;
          if (N.test(this.url))
            this.url = this.url.replace(N, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var V = /\?/;
            this.url += (V.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      $.prototype.clone = function() {
        return new $(this, { body: this._bodyInit });
      };
      function m(p) {
        var S = new FormData();
        return p.trim().split("&").forEach(function(I) {
          if (I) {
            var N = I.split("="), V = N.shift().replace(/\+/g, " "), P = N.join("=").replace(/\+/g, " ");
            S.append(decodeURIComponent(V), decodeURIComponent(P));
          }
        }), S;
      }
      function k(p) {
        var S = new l(), I = p.replace(/\r?\n[\t ]+/g, " ");
        return I.split("\r").map(function(N) {
          return N.indexOf(`
`) === 0 ? N.substr(1, N.length) : N;
        }).forEach(function(N) {
          var V = N.split(":"), P = V.shift().trim();
          if (P) {
            var Ve = V.join(":").trim();
            try {
              S.append(P, Ve);
            } catch (xn) {
              console.warn("Response " + xn.message);
            }
          }
        }), S;
      }
      _.call($.prototype);
      function D(p, S) {
        if (!(this instanceof D))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (S || (S = {}), this.type = "default", this.status = S.status === void 0 ? 200 : S.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = S.statusText === void 0 ? "" : "" + S.statusText, this.headers = new l(S.headers), this.url = S.url || "", this._initBody(p);
      }
      _.call(D.prototype), D.prototype.clone = function() {
        return new D(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new l(this.headers),
          url: this.url
        });
      }, D.error = function() {
        var p = new D(null, { status: 200, statusText: "" });
        return p.ok = !1, p.status = 0, p.type = "error", p;
      };
      var U = [301, 302, 303, 307, 308];
      D.redirect = function(p, S) {
        if (U.indexOf(S) === -1)
          throw new RangeError("Invalid status code");
        return new D(null, { status: S, headers: { location: p } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(S, I) {
          this.message = S, this.name = I;
          var N = Error(S);
          this.stack = N.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function O(p, S) {
        return new Promise(function(I, N) {
          var V = new $(p, S);
          if (V.signal && V.signal.aborted)
            return N(new e.DOMException("Aborted", "AbortError"));
          var P = new XMLHttpRequest();
          function Ve() {
            P.abort();
          }
          P.onload = function() {
            var et = {
              statusText: P.statusText,
              headers: k(P.getAllResponseHeaders() || "")
            };
            V.url.indexOf("file://") === 0 && (P.status < 200 || P.status > 599) ? et.status = 200 : et.status = P.status, et.url = "responseURL" in P ? P.responseURL : et.headers.get("X-Request-URL");
            var z = "response" in P ? P.response : P.responseText;
            setTimeout(function() {
              I(new D(z, et));
            }, 0);
          }, P.onerror = function() {
            setTimeout(function() {
              N(new TypeError("Network request failed"));
            }, 0);
          }, P.ontimeout = function() {
            setTimeout(function() {
              N(new TypeError("Network request timed out"));
            }, 0);
          }, P.onabort = function() {
            setTimeout(function() {
              N(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function xn(et) {
            try {
              return et === "" && n.location.href ? n.location.href : et;
            } catch {
              return et;
            }
          }
          if (P.open(V.method, xn(V.url), !0), V.credentials === "include" ? P.withCredentials = !0 : V.credentials === "omit" && (P.withCredentials = !1), "responseType" in P && (r.blob ? P.responseType = "blob" : r.arrayBuffer && (P.responseType = "arraybuffer")), S && typeof S.headers == "object" && !(S.headers instanceof l || n.Headers && S.headers instanceof n.Headers)) {
            var Tn = [];
            Object.getOwnPropertyNames(S.headers).forEach(function(et) {
              Tn.push(c(et)), P.setRequestHeader(et, f(S.headers[et]));
            }), V.headers.forEach(function(et, z) {
              Tn.indexOf(z) === -1 && P.setRequestHeader(z, et);
            });
          } else
            V.headers.forEach(function(et, z) {
              P.setRequestHeader(z, et);
            });
          V.signal && (V.signal.addEventListener("abort", Ve), P.onreadystatechange = function() {
            P.readyState === 4 && V.signal.removeEventListener("abort", Ve);
          }), P.send(typeof V._bodyInit > "u" ? null : V._bodyInit);
        });
      }
      return O.polyfill = !0, n.fetch || (n.fetch = O, n.Headers = l, n.Request = $, n.Response = D), e.Headers = l, e.Request = $, e.Response = D, e.fetch = O, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : ct);
})();
const q2 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function W2(t, e) {
  const n = {};
  return Object.assign(n, q2, e), await fetch(t, n);
}
function X2(t) {
  let e = W2, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Y2(...t) {
  const { fetchLib: e, middlewares: n } = X2(t);
  return async (s, o) => {
    let i = { url: s, init: o ?? {} };
    for (const f of n)
      typeof f.pre == "function" && (i = await Promise.resolve(f.pre({
        fetch: e,
        ...i
      })) ?? i);
    let c = await e(i.url, i.init);
    for (const f of n)
      typeof f.post == "function" && (c = await Promise.resolve(f.post({
        fetch: e,
        url: i.url,
        init: i.init,
        response: (c == null ? void 0 : c.clone()) ?? c
      })) ?? c);
    return c;
  };
}
var an;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(an || (an = {}));
var Ne;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ne || (Ne = {}));
var fc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(fc || (fc = {}));
const Z2 = "https://api.mainnet.hiro.so", J2 = "https://api.testnet.hiro.so", Q2 = "http://localhost:3999", tb = ["mainnet", "testnet", "devnet", "mocknet"];
class De {
  constructor(e) {
    this.version = Ne.Mainnet, this.chainId = an.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ne.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Y2();
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
De.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Ns();
    case "testnet":
      return new Ds();
    case "devnet":
      return new eb();
    case "mocknet":
      return new D0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${tb.join(", ")}`);
  }
};
De.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : De.fromName(t);
class Ns extends De {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Z2,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ne.Mainnet, this.chainId = an.Mainnet;
  }
}
class Ds extends De {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? J2,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ne.Testnet, this.chainId = an.Testnet;
  }
}
class D0 extends De {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Q2,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ne.Testnet, this.chainId = an.Testnet;
  }
}
const eb = D0;
var Fs;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Fs || (Fs = {}));
var hc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(hc || (hc = {}));
Fs.Mainnet;
var Lr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Lr || (Lr = {}));
var lc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(lc || (lc = {}));
Lr.Mainnet;
const nb = 128, rb = 128, F0 = 16;
var uc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(uc || (uc = {}));
var dc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(dc || (dc = {}));
var yt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(yt || (yt = {}));
const ds = ["onChainOnly", "offChainOnly", "any"];
ds[0] + "", yt.OnChainOnly, ds[1] + "", yt.OffChainOnly, ds[2] + "", yt.Any, yt.OnChainOnly + "", yt.OnChainOnly, yt.OffChainOnly + "", yt.OffChainOnly, yt.Any + "", yt.Any;
var bc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(bc || (bc = {}));
var pc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(pc || (pc = {}));
var gc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(gc || (gc = {}));
var xc;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(xc || (xc = {}));
var wc;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(wc || (wc = {}));
var yc;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(yc || (yc = {}));
var mc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(mc || (mc = {}));
var Sc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Sc || (Sc = {}));
var Ec;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ec || (Ec = {}));
var Ac;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ac || (Ac = {}));
var vc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(vc || (vc = {}));
var $c;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})($c || ($c = {}));
var Bc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Bc || (Bc = {}));
let sb = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, ob = class extends sb {
  constructor(e) {
    super(e);
  }
};
function Ts(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function ib(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function T0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function cb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ts(t.outputLen), Ts(t.blockLen);
}
function ab(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function fb(t, e) {
  T0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const bs = {
  number: Ts,
  bool: ib,
  bytes: T0,
  hash: cb,
  exists: ab,
  output: fb
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ps = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), $t = (t, e) => t << 32 - e | t >>> e, hb = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!hb)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function lb(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function M0(t) {
  if (typeof t == "string" && (t = lb(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let ub = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ge(t) {
  const e = (r) => t().update(M0(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function db(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), f = r ? 4 : 0, d = r ? 0 : 4;
  t.setUint32(e + f, i, r), t.setUint32(e + d, c, r);
}
let _o = class extends ub {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ps(this.buffer);
  }
  update(e) {
    bs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = M0(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const f = ps(e);
        for (; s <= o - i; i += s)
          this.process(f, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    bs.exists(this), bs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let a = i; a < s; a++)
      n[a] = 0;
    db(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = ps(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = f / 4, l = this.get();
    if (d > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let a = 0; a < d; a++)
      c.setUint32(4 * a, l[a], o);
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
const bb = (t, e, n) => t & e ^ ~t & n, pb = (t, e, n) => t & e ^ t & n ^ e & n, gb = new Uint32Array([
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
]), ce = new Uint32Array(64);
let G0 = class extends _o {
  constructor() {
    super(64, 32, 8, !1), this.A = ie[0] | 0, this.B = ie[1] | 0, this.C = ie[2] | 0, this.D = ie[3] | 0, this.E = ie[4] | 0, this.F = ie[5] | 0, this.G = ie[6] | 0, this.H = ie[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: c, H: f } = this;
    return [e, n, r, s, o, i, c, f];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, f) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = c | 0, this.H = f | 0;
  }
  process(e, n) {
    for (let a = 0; a < 16; a++, n += 4)
      ce[a] = e.getUint32(n, !1);
    for (let a = 16; a < 64; a++) {
      const b = ce[a - 15], u = ce[a - 2], g = $t(b, 7) ^ $t(b, 18) ^ b >>> 3, y = $t(u, 17) ^ $t(u, 19) ^ u >>> 10;
      ce[a] = y + ce[a - 7] + g + ce[a - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: f, G: d, H: l } = this;
    for (let a = 0; a < 64; a++) {
      const b = $t(c, 6) ^ $t(c, 11) ^ $t(c, 25), u = l + b + bb(c, f, d) + gb[a] + ce[a] | 0, y = ($t(r, 2) ^ $t(r, 13) ^ $t(r, 22)) + pb(r, s, o) | 0;
      l = d, d = f, f = c, c = i + u | 0, i = o, o = s, s = r, r = u + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, f = f + this.F | 0, d = d + this.G | 0, l = l + this.H | 0, this.set(r, s, o, i, c, f, d, l);
  }
  roundClean() {
    ce.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, xb = class extends G0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Ge(() => new G0());
Ge(() => new xb());
const wb = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), R0 = Uint8Array.from({ length: 16 }, (t, e) => e), yb = R0.map((t) => (9 * t + 5) % 16);
let Lo = [R0], Io = [yb];
for (let t = 0; t < 4; t++)
  for (let e of [Lo, Io])
    e.push(e[t].map((n) => wb[n]));
const K0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), mb = Lo.map((t, e) => t.map((n) => K0[e][n])), Sb = Io.map((t, e) => t.map((n) => K0[e][n])), Eb = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Ab = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), or = (t, e) => t << e | t >>> 32 - e;
function Hc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ir = new Uint32Array(16);
let vb = class extends _o {
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
    for (let u = 0; u < 16; u++, n += 4)
      ir[u] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, c = this.h2 | 0, f = c, d = this.h3 | 0, l = d, a = this.h4 | 0, b = a;
    for (let u = 0; u < 5; u++) {
      const g = 4 - u, y = Eb[u], A = Ab[u], _ = Lo[u], L = Io[u], x = mb[u], $ = Sb[u];
      for (let m = 0; m < 16; m++) {
        const k = or(r + Hc(u, o, c, d) + ir[_[m]] + y, x[m]) + a | 0;
        r = a, a = d, d = or(c, 10) | 0, c = o, o = k;
      }
      for (let m = 0; m < 16; m++) {
        const k = or(s + Hc(g, i, f, l) + ir[L[m]] + A, $[m]) + b | 0;
        s = b, b = l, l = or(f, 10) | 0, f = i, i = k;
      }
    }
    this.set(this.h1 + c + l | 0, this.h2 + d + b | 0, this.h3 + a + s | 0, this.h4 + r + i | 0, this.h0 + o + f | 0);
  }
  roundClean() {
    ir.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Ge(() => new vb());
const cr = BigInt(2 ** 32 - 1), Ms = BigInt(32);
function V0(t, e = !1) {
  return e ? { h: Number(t & cr), l: Number(t >> Ms & cr) } : { h: Number(t >> Ms & cr) | 0, l: Number(t & cr) | 0 };
}
function $b(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = V0(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const Bb = (t, e) => BigInt(t >>> 0) << Ms | BigInt(e >>> 0), Hb = (t, e, n) => t >>> n, _b = (t, e, n) => t << 32 - n | e >>> n, Lb = (t, e, n) => t >>> n | e << 32 - n, Ib = (t, e, n) => t << 32 - n | e >>> n, Ub = (t, e, n) => t << 64 - n | e >>> n - 32, Ob = (t, e, n) => t >>> n - 32 | e << 64 - n, Cb = (t, e) => e, kb = (t, e) => t, Pb = (t, e, n) => t << n | e >>> 32 - n, Nb = (t, e, n) => e << n | t >>> 32 - n, Db = (t, e, n) => e << n - 32 | t >>> 64 - n, Fb = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Tb(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Mb = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Gb = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Rb = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Kb = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Vb = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), zb = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, M = {
  fromBig: V0,
  split: $b,
  toBig: Bb,
  shrSH: Hb,
  shrSL: _b,
  rotrSH: Lb,
  rotrSL: Ib,
  rotrBH: Ub,
  rotrBL: Ob,
  rotr32H: Cb,
  rotr32L: kb,
  rotlSH: Pb,
  rotlSL: Nb,
  rotlBH: Db,
  rotlBL: Fb,
  add: Tb,
  add3L: Mb,
  add3H: Gb,
  add4L: Rb,
  add4H: Kb,
  add5H: zb,
  add5L: Vb
}, [jb, qb] = M.split([
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
].map((t) => BigInt(t))), ae = new Uint32Array(80), fe = new Uint32Array(80);
let Vr = class extends _o {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: c, Dl: f, Eh: d, El: l, Fh: a, Fl: b, Gh: u, Gl: g, Hh: y, Hl: A } = this;
    return [e, n, r, s, o, i, c, f, d, l, a, b, u, g, y, A];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, f, d, l, a, b, u, g, y, A) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = f | 0, this.Eh = d | 0, this.El = l | 0, this.Fh = a | 0, this.Fl = b | 0, this.Gh = u | 0, this.Gl = g | 0, this.Hh = y | 0, this.Hl = A | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      ae[x] = e.getUint32(n), fe[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const $ = ae[x - 15] | 0, m = fe[x - 15] | 0, k = M.rotrSH($, m, 1) ^ M.rotrSH($, m, 8) ^ M.shrSH($, m, 7), D = M.rotrSL($, m, 1) ^ M.rotrSL($, m, 8) ^ M.shrSL($, m, 7), U = ae[x - 2] | 0, O = fe[x - 2] | 0, p = M.rotrSH(U, O, 19) ^ M.rotrBH(U, O, 61) ^ M.shrSH(U, O, 6), S = M.rotrSL(U, O, 19) ^ M.rotrBL(U, O, 61) ^ M.shrSL(U, O, 6), I = M.add4L(D, S, fe[x - 7], fe[x - 16]), N = M.add4H(I, k, p, ae[x - 7], ae[x - 16]);
      ae[x] = N | 0, fe[x] = I | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: c, Cl: f, Dh: d, Dl: l, Eh: a, El: b, Fh: u, Fl: g, Gh: y, Gl: A, Hh: _, Hl: L } = this;
    for (let x = 0; x < 80; x++) {
      const $ = M.rotrSH(a, b, 14) ^ M.rotrSH(a, b, 18) ^ M.rotrBH(a, b, 41), m = M.rotrSL(a, b, 14) ^ M.rotrSL(a, b, 18) ^ M.rotrBL(a, b, 41), k = a & u ^ ~a & y, D = b & g ^ ~b & A, U = M.add5L(L, m, D, qb[x], fe[x]), O = M.add5H(U, _, $, k, jb[x], ae[x]), p = U | 0, S = M.rotrSH(r, s, 28) ^ M.rotrBH(r, s, 34) ^ M.rotrBH(r, s, 39), I = M.rotrSL(r, s, 28) ^ M.rotrBL(r, s, 34) ^ M.rotrBL(r, s, 39), N = r & o ^ r & c ^ o & c, V = s & i ^ s & f ^ i & f;
      _ = y | 0, L = A | 0, y = u | 0, A = g | 0, u = a | 0, g = b | 0, { h: a, l: b } = M.add(d | 0, l | 0, O | 0, p | 0), d = c | 0, l = f | 0, c = o | 0, f = i | 0, o = r | 0, i = s | 0;
      const P = M.add3L(p, I, V);
      r = M.add3H(P, O, S, N), s = P | 0;
    }
    ({ h: r, l: s } = M.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = M.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: c, l: f } = M.add(this.Ch | 0, this.Cl | 0, c | 0, f | 0), { h: d, l } = M.add(this.Dh | 0, this.Dl | 0, d | 0, l | 0), { h: a, l: b } = M.add(this.Eh | 0, this.El | 0, a | 0, b | 0), { h: u, l: g } = M.add(this.Fh | 0, this.Fl | 0, u | 0, g | 0), { h: y, l: A } = M.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: _, l: L } = M.add(this.Hh | 0, this.Hl | 0, _ | 0, L | 0), this.set(r, s, o, i, c, f, d, l, a, b, u, g, y, A, _, L);
  }
  roundClean() {
    ae.fill(0), fe.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Wb = class extends Vr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Xb = class extends Vr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Yb = class extends Vr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ge(() => new Vr());
Ge(() => new Wb());
Ge(() => new Xb());
Ge(() => new Yb());
var rt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(rt || (rt = {}));
var Gs;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Gs || (Gs = {}));
function Uo(t) {
  return Gs[t];
}
var Ir;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Ir || (Ir = {}));
function z0(t, e, n) {
  const s = nb;
  if (fp(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Ir.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
function j0(t) {
  const e = vo.c32addressDecode(t);
  return {
    type: Ir.Address,
    version: e[0],
    hash160: e[1]
  };
}
function q0(t) {
  const e = [];
  return e.push(ut(so(t.version, 1))), e.push(ut(t.hash160)), un(e);
}
function W0(t) {
  const e = [], n = On(t.content), r = n.byteLength;
  return e.push(ut(so(r, t.lengthPrefixBytes))), e.push(n), un(e);
}
function Ct(t, e) {
  return un([Uo(t), e]);
}
function Zb(t) {
  return new Uint8Array([Uo(t.type)]);
}
function Jb(t) {
  return t.type === rt.OptionalNone ? new Uint8Array([Uo(t.type)]) : Ct(t.type, Nn(t.value));
}
function Qb(t) {
  const e = new Uint8Array(4);
  return kr(e, Math.ceil(t.value.length / 2), 0), Ct(t.type, jt(e, ut(t.value)));
}
function tp(t) {
  const e = wa(ml(BigInt(t.value), BigInt(rb)), F0);
  return Ct(t.type, e);
}
function ep(t) {
  const e = wa(BigInt(t.value), F0);
  return Ct(t.type, e);
}
function np(t) {
  return Ct(t.type, q0(j0(t.value)));
}
function rp(t) {
  const [e, n] = hp(t.value);
  return Ct(t.type, jt(q0(j0(e)), W0(z0(n))));
}
function sp(t) {
  return Ct(t.type, Nn(t.value));
}
function op(t) {
  const e = [], n = new Uint8Array(4);
  kr(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = Nn(r);
    e.push(s);
  }
  return Ct(t.type, un(e));
}
function ip(t) {
  const e = [], n = new Uint8Array(4);
  kr(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = z0(s);
    e.push(W0(o));
    const i = Nn(t.value[s]);
    e.push(i);
  }
  return Ct(t.type, un(e));
}
function X0(t, e) {
  const n = [], r = e == "ascii" ? El(t.value) : On(t.value), s = new Uint8Array(4);
  return kr(s, r.length, 0), n.push(s), n.push(r), Ct(t.type, un(n));
}
function cp(t) {
  return X0(t, "ascii");
}
function ap(t) {
  return X0(t, "utf8");
}
function _c(t) {
  return gt(Nn(t));
}
function Nn(t) {
  switch (t.type) {
    case rt.BoolTrue:
    case rt.BoolFalse:
      return Zb(t);
    case rt.OptionalNone:
    case rt.OptionalSome:
      return Jb(t);
    case rt.Buffer:
      return Qb(t);
    case rt.UInt:
      return ep(t);
    case rt.Int:
      return tp(t);
    case rt.PrincipalStandard:
      return np(t);
    case rt.PrincipalContract:
      return rp(t);
    case rt.ResponseOk:
    case rt.ResponseErr:
      return sp(t);
    case rt.List:
      return op(t);
    case rt.Tuple:
      return ip(t);
    case rt.StringASCII:
      return cp(t);
    case rt.StringUTF8:
      return ap(t);
    default:
      throw new ob("Unable to serialize. Invalid Clarity Value.");
  }
}
const fp = (t, e) => t ? On(t).length > e : !1;
function hp(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
function lp(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = In(r);
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
    return BigInt(`0x${bp(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Oo(t, e = 8) {
  return (typeof t == "bigint" ? t : lp(t)).toString(16).padStart(e * 2, "0");
}
function Y0(t, e = 16) {
  const n = Oo(t, e);
  return In(n);
}
function up(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const dp = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function bp(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += dp[n];
  return e;
}
function In(t) {
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
function Co(t) {
  return new TextEncoder().encode(t);
}
function pp(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function gp(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Lc(t) {
  if (t.some(gp))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function ko(...t) {
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
function pn(t) {
  return ko(...t.map((e) => typeof e == "number" ? Lc([e]) : e instanceof Array ? Lc(e) : e));
}
function zr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Rs;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Rs || (Rs = {}));
Rs.Mainnet;
const xp = 128, wp = 128, Z0 = 16;
var Ks;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Ks || (Ks = {}));
var Ic;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ic || (Ic = {}));
var Uc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Uc || (Uc = {}));
var mt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(mt || (mt = {}));
const gs = ["onChainOnly", "offChainOnly", "any"];
gs[0] + "", mt.OnChainOnly, gs[1] + "", mt.OffChainOnly, gs[2] + "", mt.Any, mt.OnChainOnly + "", mt.OnChainOnly, mt.OffChainOnly + "", mt.OffChainOnly, mt.Any + "", mt.Any;
var Vs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Vs || (Vs = {}));
Vs.Mainnet;
var Oc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Oc || (Oc = {}));
var Cc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Cc || (Cc = {}));
var kc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(kc || (kc = {}));
var Pc;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Pc || (Pc = {}));
var Nc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Nc || (Nc = {}));
var Dc;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Dc || (Dc = {}));
var Fc;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Fc || (Fc = {}));
var Tc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Tc || (Tc = {}));
var Mc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Mc || (Mc = {}));
var Gc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Gc || (Gc = {}));
var Rc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Rc || (Rc = {}));
function zs(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function yp(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function J0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function mp(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  zs(t.outputLen), zs(t.blockLen);
}
function Sp(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Ep(t, e) {
  J0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const xs = {
  number: zs,
  bool: yp,
  bytes: J0,
  hash: mp,
  exists: Sp,
  output: Ep
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ws = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Bt = (t, e) => t << 32 - e | t >>> e, Ap = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Ap)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function vp(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Q0(t) {
  if (typeof t == "string" && (t = vp(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let $p = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Re(t) {
  const e = (r) => t().update(Q0(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Bp(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), f = r ? 4 : 0, d = r ? 0 : 4;
  t.setUint32(e + f, i, r), t.setUint32(e + d, c, r);
}
let Po = class extends $p {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ws(this.buffer);
  }
  update(e) {
    xs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Q0(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const f = ws(e);
        for (; s <= o - i; i += s)
          this.process(f, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    xs.exists(this), xs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let a = i; a < s; a++)
      n[a] = 0;
    Bp(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = ws(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = f / 4, l = this.get();
    if (d > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let a = 0; a < d; a++)
      c.setUint32(4 * a, l[a], o);
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
const Hp = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), tf = Uint8Array.from({ length: 16 }, (t, e) => e), _p = tf.map((t) => (9 * t + 5) % 16);
let No = [tf], Do = [_p];
for (let t = 0; t < 4; t++)
  for (let e of [No, Do])
    e.push(e[t].map((n) => Hp[n]));
const ef = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Lp = No.map((t, e) => t.map((n) => ef[e][n])), Ip = Do.map((t, e) => t.map((n) => ef[e][n])), Up = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Op = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ar = (t, e) => t << e | t >>> 32 - e;
function Kc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const fr = new Uint32Array(16);
let Cp = class extends Po {
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
    for (let u = 0; u < 16; u++, n += 4)
      fr[u] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, c = this.h2 | 0, f = c, d = this.h3 | 0, l = d, a = this.h4 | 0, b = a;
    for (let u = 0; u < 5; u++) {
      const g = 4 - u, y = Up[u], A = Op[u], _ = No[u], L = Do[u], x = Lp[u], $ = Ip[u];
      for (let m = 0; m < 16; m++) {
        const k = ar(r + Kc(u, o, c, d) + fr[_[m]] + y, x[m]) + a | 0;
        r = a, a = d, d = ar(c, 10) | 0, c = o, o = k;
      }
      for (let m = 0; m < 16; m++) {
        const k = ar(s + Kc(g, i, f, l) + fr[L[m]] + A, $[m]) + b | 0;
        s = b, b = l, l = ar(f, 10) | 0, f = i, i = k;
      }
    }
    this.set(this.h1 + c + l | 0, this.h2 + d + b | 0, this.h3 + a + s | 0, this.h4 + r + i | 0, this.h0 + o + f | 0);
  }
  roundClean() {
    fr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Re(() => new Cp());
const kp = (t, e, n) => t & e ^ ~t & n, Pp = (t, e, n) => t & e ^ t & n ^ e & n, Np = new Uint32Array([
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
]), le = new Uint32Array(64);
let nf = class extends Po {
  constructor() {
    super(64, 32, 8, !1), this.A = he[0] | 0, this.B = he[1] | 0, this.C = he[2] | 0, this.D = he[3] | 0, this.E = he[4] | 0, this.F = he[5] | 0, this.G = he[6] | 0, this.H = he[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: c, H: f } = this;
    return [e, n, r, s, o, i, c, f];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, f) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = c | 0, this.H = f | 0;
  }
  process(e, n) {
    for (let a = 0; a < 16; a++, n += 4)
      le[a] = e.getUint32(n, !1);
    for (let a = 16; a < 64; a++) {
      const b = le[a - 15], u = le[a - 2], g = Bt(b, 7) ^ Bt(b, 18) ^ b >>> 3, y = Bt(u, 17) ^ Bt(u, 19) ^ u >>> 10;
      le[a] = y + le[a - 7] + g + le[a - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: f, G: d, H: l } = this;
    for (let a = 0; a < 64; a++) {
      const b = Bt(c, 6) ^ Bt(c, 11) ^ Bt(c, 25), u = l + b + kp(c, f, d) + Np[a] + le[a] | 0, y = (Bt(r, 2) ^ Bt(r, 13) ^ Bt(r, 22)) + Pp(r, s, o) | 0;
      l = d, d = f, f = c, c = i + u | 0, i = o, o = s, s = r, r = u + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, f = f + this.F | 0, d = d + this.G | 0, l = l + this.H | 0, this.set(r, s, o, i, c, f, d, l);
  }
  roundClean() {
    le.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Dp = class extends nf {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Re(() => new nf());
Re(() => new Dp());
const hr = BigInt(2 ** 32 - 1), js = BigInt(32);
function rf(t, e = !1) {
  return e ? { h: Number(t & hr), l: Number(t >> js & hr) } : { h: Number(t >> js & hr) | 0, l: Number(t & hr) | 0 };
}
function Fp(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = rf(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const Tp = (t, e) => BigInt(t >>> 0) << js | BigInt(e >>> 0), Mp = (t, e, n) => t >>> n, Gp = (t, e, n) => t << 32 - n | e >>> n, Rp = (t, e, n) => t >>> n | e << 32 - n, Kp = (t, e, n) => t << 32 - n | e >>> n, Vp = (t, e, n) => t << 64 - n | e >>> n - 32, zp = (t, e, n) => t >>> n - 32 | e << 64 - n, jp = (t, e) => e, qp = (t, e) => t, Wp = (t, e, n) => t << n | e >>> 32 - n, Xp = (t, e, n) => e << n | t >>> 32 - n, Yp = (t, e, n) => e << n - 32 | t >>> 64 - n, Zp = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Jp(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Qp = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), tg = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, eg = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), ng = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, rg = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), sg = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, G = {
  fromBig: rf,
  split: Fp,
  toBig: Tp,
  shrSH: Mp,
  shrSL: Gp,
  rotrSH: Rp,
  rotrSL: Kp,
  rotrBH: Vp,
  rotrBL: zp,
  rotr32H: jp,
  rotr32L: qp,
  rotlSH: Wp,
  rotlSL: Xp,
  rotlBH: Yp,
  rotlBL: Zp,
  add: Jp,
  add3L: Qp,
  add3H: tg,
  add4L: eg,
  add4H: ng,
  add5H: sg,
  add5L: rg
}, [og, ig] = G.split([
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
].map((t) => BigInt(t))), ue = new Uint32Array(80), de = new Uint32Array(80);
let jr = class extends Po {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: c, Dl: f, Eh: d, El: l, Fh: a, Fl: b, Gh: u, Gl: g, Hh: y, Hl: A } = this;
    return [e, n, r, s, o, i, c, f, d, l, a, b, u, g, y, A];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, f, d, l, a, b, u, g, y, A) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = f | 0, this.Eh = d | 0, this.El = l | 0, this.Fh = a | 0, this.Fl = b | 0, this.Gh = u | 0, this.Gl = g | 0, this.Hh = y | 0, this.Hl = A | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      ue[x] = e.getUint32(n), de[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const $ = ue[x - 15] | 0, m = de[x - 15] | 0, k = G.rotrSH($, m, 1) ^ G.rotrSH($, m, 8) ^ G.shrSH($, m, 7), D = G.rotrSL($, m, 1) ^ G.rotrSL($, m, 8) ^ G.shrSL($, m, 7), U = ue[x - 2] | 0, O = de[x - 2] | 0, p = G.rotrSH(U, O, 19) ^ G.rotrBH(U, O, 61) ^ G.shrSH(U, O, 6), S = G.rotrSL(U, O, 19) ^ G.rotrBL(U, O, 61) ^ G.shrSL(U, O, 6), I = G.add4L(D, S, de[x - 7], de[x - 16]), N = G.add4H(I, k, p, ue[x - 7], ue[x - 16]);
      ue[x] = N | 0, de[x] = I | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: c, Cl: f, Dh: d, Dl: l, Eh: a, El: b, Fh: u, Fl: g, Gh: y, Gl: A, Hh: _, Hl: L } = this;
    for (let x = 0; x < 80; x++) {
      const $ = G.rotrSH(a, b, 14) ^ G.rotrSH(a, b, 18) ^ G.rotrBH(a, b, 41), m = G.rotrSL(a, b, 14) ^ G.rotrSL(a, b, 18) ^ G.rotrBL(a, b, 41), k = a & u ^ ~a & y, D = b & g ^ ~b & A, U = G.add5L(L, m, D, ig[x], de[x]), O = G.add5H(U, _, $, k, og[x], ue[x]), p = U | 0, S = G.rotrSH(r, s, 28) ^ G.rotrBH(r, s, 34) ^ G.rotrBH(r, s, 39), I = G.rotrSL(r, s, 28) ^ G.rotrBL(r, s, 34) ^ G.rotrBL(r, s, 39), N = r & o ^ r & c ^ o & c, V = s & i ^ s & f ^ i & f;
      _ = y | 0, L = A | 0, y = u | 0, A = g | 0, u = a | 0, g = b | 0, { h: a, l: b } = G.add(d | 0, l | 0, O | 0, p | 0), d = c | 0, l = f | 0, c = o | 0, f = i | 0, o = r | 0, i = s | 0;
      const P = G.add3L(p, I, V);
      r = G.add3H(P, O, S, N), s = P | 0;
    }
    ({ h: r, l: s } = G.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = G.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: c, l: f } = G.add(this.Ch | 0, this.Cl | 0, c | 0, f | 0), { h: d, l } = G.add(this.Dh | 0, this.Dl | 0, d | 0, l | 0), { h: a, l: b } = G.add(this.Eh | 0, this.El | 0, a | 0, b | 0), { h: u, l: g } = G.add(this.Fh | 0, this.Fl | 0, u | 0, g | 0), { h: y, l: A } = G.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: _, l: L } = G.add(this.Hh | 0, this.Hl | 0, _ | 0, L | 0), this.set(r, s, o, i, c, f, d, l, a, b, u, g, y, A, _, L);
  }
  roundClean() {
    ue.fill(0), de.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, cg = class extends jr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, ag = class extends jr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, fg = class extends jr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Re(() => new jr());
Re(() => new cg());
Re(() => new ag());
Re(() => new fg());
function hg(t, e, n) {
  const s = xp;
  if ($g(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Ks.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var st;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(st || (st = {}));
let lg = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, ug = class extends lg {
  constructor(e) {
    super(e);
  }
};
function sf(t) {
  const e = [];
  return e.push(In(Oo(t.version, 1))), e.push(In(t.hash160)), pn(e);
}
function of(t) {
  const e = [], n = Co(t.content), r = n.byteLength;
  return e.push(In(Oo(r, t.lengthPrefixBytes))), e.push(n), pn(e);
}
function kt(t, e) {
  return pn([t, e]);
}
function dg(t) {
  return new Uint8Array([t.type]);
}
function bg(t) {
  return t.type === st.OptionalNone ? new Uint8Array([t.type]) : kt(t.type, fn(t.value));
}
function pg(t) {
  const e = new Uint8Array(4);
  return zr(e, t.buffer.length, 0), kt(t.type, ko(e, t.buffer));
}
function gg(t) {
  const e = Y0(up(t.value, BigInt(wp)), Z0);
  return kt(t.type, e);
}
function xg(t) {
  const e = Y0(t.value, Z0);
  return kt(t.type, e);
}
function wg(t) {
  return kt(t.type, sf(t.address));
}
function yg(t) {
  return kt(t.type, ko(sf(t.address), of(t.contractName)));
}
function mg(t) {
  return kt(t.type, fn(t.value));
}
function Sg(t) {
  const e = [], n = new Uint8Array(4);
  zr(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = fn(r);
    e.push(s);
  }
  return kt(t.type, pn(e));
}
function Eg(t) {
  const e = [], n = new Uint8Array(4);
  zr(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = hg(s);
    e.push(of(o));
    const i = fn(t.data[s]);
    e.push(i);
  }
  return kt(t.type, pn(e));
}
function cf(t, e) {
  const n = [], r = e == "ascii" ? pp(t.data) : Co(t.data), s = new Uint8Array(4);
  return zr(s, r.length, 0), n.push(s), n.push(r), kt(t.type, pn(n));
}
function Ag(t) {
  return cf(t, "ascii");
}
function vg(t) {
  return cf(t, "utf8");
}
function fn(t) {
  switch (t.type) {
    case st.BoolTrue:
    case st.BoolFalse:
      return dg(t);
    case st.OptionalNone:
    case st.OptionalSome:
      return bg(t);
    case st.Buffer:
      return pg(t);
    case st.UInt:
      return xg(t);
    case st.Int:
      return gg(t);
    case st.PrincipalStandard:
      return wg(t);
    case st.PrincipalContract:
      return yg(t);
    case st.ResponseOk:
    case st.ResponseErr:
      return mg(t);
    case st.List:
      return Sg(t);
    case st.Tuple:
      return Eg(t);
    case st.StringASCII:
      return Ag(t);
    case st.StringUTF8:
      return vg(t);
    default:
      throw new ug("Unable to serialize. Invalid Clarity Value.");
  }
}
const $g = (t, e) => t ? Co(t).length > e : !1;
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var Bg = Object.defineProperty, Hg = Object.defineProperties, _g = Object.getOwnPropertyDescriptors, Ur = Object.getOwnPropertySymbols, af = Object.prototype.hasOwnProperty, ff = Object.prototype.propertyIsEnumerable, Vc = (t, e, n) => e in t ? Bg(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, qs = (t, e) => {
  for (var n in e || (e = {})) af.call(e, n) && Vc(t, n, e[n]);
  if (Ur) for (var n of Ur(e)) ff.call(e, n) && Vc(t, n, e[n]);
  return t;
}, Ws = (t, e) => Hg(t, _g(e)), Lg = (t, e) => {
  var n = {};
  for (var r in t) af.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Ur) for (var r of Ur(t)) e.indexOf(r) < 0 && ff.call(t, r) && (n[r] = t[r]);
  return n;
};
function Ig(t) {
  return t ? typeof t == "string" ? De.fromName(t) : "version" in t ? t : "url" in t ? new Ns({ url: t.url }) : t.transactionVersion === Lr.Mainnet ? new Ns({ url: t.client.baseUrl }) : new Ds({ url: t.client.baseUrl }) : new Ds();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var Ug = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(Ug || {}), Og = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(Og || {}), hf = (t) => {
  let e = t;
  if (!e) {
    let n = new ma(["store_write"], document.location.href);
    e = new Ps({ appConfig: n });
  }
  return e;
};
function Cg(t) {
  try {
    return hf(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var kg = (t) => {
  let e = hf(t).loadUserData().appPrivateKey, n = at.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function lf(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? Ws(qs({}, t), { message: _c(e), domain: _c(n) }) : Ws(qs({}, t), { message: gt(fn(e)), domain: gt(fn(n)) });
}
async function Pg(t, e) {
  return new at.TokenSigner("ES256k", e).signAsync(lf(t));
}
async function Ng(t) {
  let e = t, { userSession: n } = e, r = Lg(e, ["userSession"]);
  if (Cg(n)) {
    let { privateKey: s, publicKey: o } = kg(n), i = Ws(qs({}, r), { publicKey: o });
    return Pg(i, s);
  }
  return at.createUnsecuredToken(lf(t));
}
var Dg = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(Dg || {}), uf = "asigna-stx", zc = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === uf && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(Tg(t, e), "*");
}), Fg = { authenticationRequest: async (t) => zc(t, "authenticationRequest"), transactionRequest: async (t) => zc(t, "transactionRequest") }, Tg = (t, e) => ({ source: uf, [e]: t }), Mg = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = Fg);
};
Mg();
function df(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Un(r);
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
    return BigInt(`0x${pf(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Fo(t, e = 8) {
  return (typeof t == "bigint" ? t : df(t)).toString(16).padStart(e * 2, "0");
}
function bf(t, e = 16) {
  const n = Fo(t, e);
  return Un(n);
}
function Gg(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const Rg = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function pf(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Rg[n];
  return e;
}
function Un(t) {
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
function To(t) {
  return new TextEncoder().encode(t);
}
function Kg(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Vg(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function jc(t) {
  if (t.some(Vg))
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
    const o = t[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function gn(t) {
  return Mo(...t.map((e) => typeof e == "number" ? jc([e]) : e instanceof Array ? jc(e) : e));
}
function qr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Xs;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Xs || (Xs = {}));
Xs.Mainnet;
const zg = 128, jg = 128, gf = 16;
var Ys;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Ys || (Ys = {}));
var qc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(qc || (qc = {}));
var Wc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Wc || (Wc = {}));
var St;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(St || (St = {}));
const ys = ["onChainOnly", "offChainOnly", "any"];
ys[0] + "", St.OnChainOnly, ys[1] + "", St.OffChainOnly, ys[2] + "", St.Any, St.OnChainOnly + "", St.OnChainOnly, St.OffChainOnly + "", St.OffChainOnly, St.Any + "", St.Any;
var Zs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Zs || (Zs = {}));
Zs.Mainnet;
var Xc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Xc || (Xc = {}));
var Yc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Yc || (Yc = {}));
var Zc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Zc || (Zc = {}));
var Jc;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Jc || (Jc = {}));
var Qc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Qc || (Qc = {}));
var ta;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(ta || (ta = {}));
var ea;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(ea || (ea = {}));
var na;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(na || (na = {}));
var ra;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ra || (ra = {}));
var sa;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(sa || (sa = {}));
var oa;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(oa || (oa = {}));
function Js(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function qg(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function xf(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Wg(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Js(t.outputLen), Js(t.blockLen);
}
function Xg(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Yg(t, e) {
  xf(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ms = {
  number: Js,
  bool: qg,
  bytes: xf,
  hash: Wg,
  exists: Xg,
  output: Yg
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ss = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ht = (t, e) => t << 32 - e | t >>> e, Zg = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Zg)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Jg(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function wf(t) {
  if (typeof t == "string" && (t = Jg(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Qg {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Ke(t) {
  const e = (r) => t().update(wf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function tx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), f = r ? 4 : 0, d = r ? 0 : 4;
  t.setUint32(e + f, i, r), t.setUint32(e + d, c, r);
}
class Go extends Qg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ss(this.buffer);
  }
  update(e) {
    ms.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = wf(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const f = Ss(e);
        for (; s <= o - i; i += s)
          this.process(f, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ms.exists(this), ms.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let a = i; a < s; a++)
      n[a] = 0;
    tx(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = Ss(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = f / 4, l = this.get();
    if (d > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let a = 0; a < d; a++)
      c.setUint32(4 * a, l[a], o);
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
const ex = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), yf = Uint8Array.from({ length: 16 }, (t, e) => e), nx = yf.map((t) => (9 * t + 5) % 16);
let Ro = [yf], Ko = [nx];
for (let t = 0; t < 4; t++)
  for (let e of [Ro, Ko])
    e.push(e[t].map((n) => ex[n]));
const mf = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), rx = Ro.map((t, e) => t.map((n) => mf[e][n])), sx = Ko.map((t, e) => t.map((n) => mf[e][n])), ox = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), ix = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), lr = (t, e) => t << e | t >>> 32 - e;
function ia(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ur = new Uint32Array(16);
class cx extends Go {
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
    for (let u = 0; u < 16; u++, n += 4)
      ur[u] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, c = this.h2 | 0, f = c, d = this.h3 | 0, l = d, a = this.h4 | 0, b = a;
    for (let u = 0; u < 5; u++) {
      const g = 4 - u, y = ox[u], A = ix[u], _ = Ro[u], L = Ko[u], x = rx[u], $ = sx[u];
      for (let m = 0; m < 16; m++) {
        const k = lr(r + ia(u, o, c, d) + ur[_[m]] + y, x[m]) + a | 0;
        r = a, a = d, d = lr(c, 10) | 0, c = o, o = k;
      }
      for (let m = 0; m < 16; m++) {
        const k = lr(s + ia(g, i, f, l) + ur[L[m]] + A, $[m]) + b | 0;
        s = b, b = l, l = lr(f, 10) | 0, f = i, i = k;
      }
    }
    this.set(this.h1 + c + l | 0, this.h2 + d + b | 0, this.h3 + a + s | 0, this.h4 + r + i | 0, this.h0 + o + f | 0);
  }
  roundClean() {
    ur.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
Ke(() => new cx());
const ax = (t, e, n) => t & e ^ ~t & n, fx = (t, e, n) => t & e ^ t & n ^ e & n, hx = new Uint32Array([
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
class Sf extends Go {
  constructor() {
    super(64, 32, 8, !1), this.A = be[0] | 0, this.B = be[1] | 0, this.C = be[2] | 0, this.D = be[3] | 0, this.E = be[4] | 0, this.F = be[5] | 0, this.G = be[6] | 0, this.H = be[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: c, H: f } = this;
    return [e, n, r, s, o, i, c, f];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, f) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = c | 0, this.H = f | 0;
  }
  process(e, n) {
    for (let a = 0; a < 16; a++, n += 4)
      pe[a] = e.getUint32(n, !1);
    for (let a = 16; a < 64; a++) {
      const b = pe[a - 15], u = pe[a - 2], g = Ht(b, 7) ^ Ht(b, 18) ^ b >>> 3, y = Ht(u, 17) ^ Ht(u, 19) ^ u >>> 10;
      pe[a] = y + pe[a - 7] + g + pe[a - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: f, G: d, H: l } = this;
    for (let a = 0; a < 64; a++) {
      const b = Ht(c, 6) ^ Ht(c, 11) ^ Ht(c, 25), u = l + b + ax(c, f, d) + hx[a] + pe[a] | 0, y = (Ht(r, 2) ^ Ht(r, 13) ^ Ht(r, 22)) + fx(r, s, o) | 0;
      l = d, d = f, f = c, c = i + u | 0, i = o, o = s, s = r, r = u + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, f = f + this.F | 0, d = d + this.G | 0, l = l + this.H | 0, this.set(r, s, o, i, c, f, d, l);
  }
  roundClean() {
    pe.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class lx extends Sf {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
Ke(() => new Sf());
Ke(() => new lx());
const dr = BigInt(2 ** 32 - 1), Qs = BigInt(32);
function Ef(t, e = !1) {
  return e ? { h: Number(t & dr), l: Number(t >> Qs & dr) } : { h: Number(t >> Qs & dr) | 0, l: Number(t & dr) | 0 };
}
function ux(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = Ef(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const dx = (t, e) => BigInt(t >>> 0) << Qs | BigInt(e >>> 0), bx = (t, e, n) => t >>> n, px = (t, e, n) => t << 32 - n | e >>> n, gx = (t, e, n) => t >>> n | e << 32 - n, xx = (t, e, n) => t << 32 - n | e >>> n, wx = (t, e, n) => t << 64 - n | e >>> n - 32, yx = (t, e, n) => t >>> n - 32 | e << 64 - n, mx = (t, e) => e, Sx = (t, e) => t, Ex = (t, e, n) => t << n | e >>> 32 - n, Ax = (t, e, n) => e << n | t >>> 32 - n, vx = (t, e, n) => e << n - 32 | t >>> 64 - n, $x = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Bx(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Hx = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), _x = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Lx = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Ix = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Ux = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Ox = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, R = {
  fromBig: Ef,
  split: ux,
  toBig: dx,
  shrSH: bx,
  shrSL: px,
  rotrSH: gx,
  rotrSL: xx,
  rotrBH: wx,
  rotrBL: yx,
  rotr32H: mx,
  rotr32L: Sx,
  rotlSH: Ex,
  rotlSL: Ax,
  rotlBH: vx,
  rotlBL: $x,
  add: Bx,
  add3L: Hx,
  add3H: _x,
  add4L: Lx,
  add4H: Ix,
  add5H: Ox,
  add5L: Ux
}, [Cx, kx] = R.split([
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
].map((t) => BigInt(t))), ge = new Uint32Array(80), xe = new Uint32Array(80);
class Wr extends Go {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: c, Dl: f, Eh: d, El: l, Fh: a, Fl: b, Gh: u, Gl: g, Hh: y, Hl: A } = this;
    return [e, n, r, s, o, i, c, f, d, l, a, b, u, g, y, A];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, f, d, l, a, b, u, g, y, A) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = f | 0, this.Eh = d | 0, this.El = l | 0, this.Fh = a | 0, this.Fl = b | 0, this.Gh = u | 0, this.Gl = g | 0, this.Hh = y | 0, this.Hl = A | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      ge[x] = e.getUint32(n), xe[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const $ = ge[x - 15] | 0, m = xe[x - 15] | 0, k = R.rotrSH($, m, 1) ^ R.rotrSH($, m, 8) ^ R.shrSH($, m, 7), D = R.rotrSL($, m, 1) ^ R.rotrSL($, m, 8) ^ R.shrSL($, m, 7), U = ge[x - 2] | 0, O = xe[x - 2] | 0, p = R.rotrSH(U, O, 19) ^ R.rotrBH(U, O, 61) ^ R.shrSH(U, O, 6), S = R.rotrSL(U, O, 19) ^ R.rotrBL(U, O, 61) ^ R.shrSL(U, O, 6), I = R.add4L(D, S, xe[x - 7], xe[x - 16]), N = R.add4H(I, k, p, ge[x - 7], ge[x - 16]);
      ge[x] = N | 0, xe[x] = I | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: c, Cl: f, Dh: d, Dl: l, Eh: a, El: b, Fh: u, Fl: g, Gh: y, Gl: A, Hh: _, Hl: L } = this;
    for (let x = 0; x < 80; x++) {
      const $ = R.rotrSH(a, b, 14) ^ R.rotrSH(a, b, 18) ^ R.rotrBH(a, b, 41), m = R.rotrSL(a, b, 14) ^ R.rotrSL(a, b, 18) ^ R.rotrBL(a, b, 41), k = a & u ^ ~a & y, D = b & g ^ ~b & A, U = R.add5L(L, m, D, kx[x], xe[x]), O = R.add5H(U, _, $, k, Cx[x], ge[x]), p = U | 0, S = R.rotrSH(r, s, 28) ^ R.rotrBH(r, s, 34) ^ R.rotrBH(r, s, 39), I = R.rotrSL(r, s, 28) ^ R.rotrBL(r, s, 34) ^ R.rotrBL(r, s, 39), N = r & o ^ r & c ^ o & c, V = s & i ^ s & f ^ i & f;
      _ = y | 0, L = A | 0, y = u | 0, A = g | 0, u = a | 0, g = b | 0, { h: a, l: b } = R.add(d | 0, l | 0, O | 0, p | 0), d = c | 0, l = f | 0, c = o | 0, f = i | 0, o = r | 0, i = s | 0;
      const P = R.add3L(p, I, V);
      r = R.add3H(P, O, S, N), s = P | 0;
    }
    ({ h: r, l: s } = R.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = R.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: c, l: f } = R.add(this.Ch | 0, this.Cl | 0, c | 0, f | 0), { h: d, l } = R.add(this.Dh | 0, this.Dl | 0, d | 0, l | 0), { h: a, l: b } = R.add(this.Eh | 0, this.El | 0, a | 0, b | 0), { h: u, l: g } = R.add(this.Fh | 0, this.Fl | 0, u | 0, g | 0), { h: y, l: A } = R.add(this.Gh | 0, this.Gl | 0, y | 0, A | 0), { h: _, l: L } = R.add(this.Hh | 0, this.Hl | 0, _ | 0, L | 0), this.set(r, s, o, i, c, f, d, l, a, b, u, g, y, A, _, L);
  }
  roundClean() {
    ge.fill(0), xe.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class Px extends Wr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class Nx extends Wr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class Dx extends Wr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Ke(() => new Wr());
Ke(() => new Px());
Ke(() => new Nx());
Ke(() => new Dx());
function Fx(t, e, n) {
  const s = zg;
  if (n3(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Ys.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Q;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Q || (Q = {}));
const ca = BigInt("0xffffffffffffffffffffffffffffffff"), Tx = BigInt(0);
BigInt("0x7fffffffffffffffffffffffffffffff");
BigInt("-170141183460469231731687303715884105728");
const Mx = (t) => {
  const e = df(t);
  if (e < Tx)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > ca)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${ca}`);
  return { type: Q.UInt, value: e };
};
function Gx(t) {
  for (const e in t)
    if (!r3(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Q.Tuple, data: t };
}
const Es = (t) => ({ type: Q.StringASCII, data: t });
class Rx extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Kx extends Rx {
  constructor(e) {
    super(e);
  }
}
function Af(t) {
  const e = [];
  return e.push(Un(Fo(t.version, 1))), e.push(Un(t.hash160)), gn(e);
}
function vf(t) {
  const e = [], n = To(t.content), r = n.byteLength;
  return e.push(Un(Fo(r, t.lengthPrefixBytes))), e.push(n), gn(e);
}
function Pt(t, e) {
  return gn([t, e]);
}
function Vx(t) {
  return new Uint8Array([t.type]);
}
function zx(t) {
  return t.type === Q.OptionalNone ? new Uint8Array([t.type]) : Pt(t.type, Dn(t.value));
}
function jx(t) {
  const e = new Uint8Array(4);
  return qr(e, t.buffer.length, 0), Pt(t.type, Mo(e, t.buffer));
}
function qx(t) {
  const e = bf(Gg(t.value, BigInt(jg)), gf);
  return Pt(t.type, e);
}
function Wx(t) {
  const e = bf(t.value, gf);
  return Pt(t.type, e);
}
function Xx(t) {
  return Pt(t.type, Af(t.address));
}
function Yx(t) {
  return Pt(t.type, Mo(Af(t.address), vf(t.contractName)));
}
function Zx(t) {
  return Pt(t.type, Dn(t.value));
}
function Jx(t) {
  const e = [], n = new Uint8Array(4);
  qr(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Dn(r);
    e.push(s);
  }
  return Pt(t.type, gn(e));
}
function Qx(t) {
  const e = [], n = new Uint8Array(4);
  qr(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = Fx(s);
    e.push(vf(o));
    const i = Dn(t.data[s]);
    e.push(i);
  }
  return Pt(t.type, gn(e));
}
function $f(t, e) {
  const n = [], r = e == "ascii" ? Kg(t.data) : To(t.data), s = new Uint8Array(4);
  return qr(s, r.length, 0), n.push(s), n.push(r), Pt(t.type, gn(n));
}
function t3(t) {
  return $f(t, "ascii");
}
function e3(t) {
  return $f(t, "utf8");
}
function Dn(t) {
  switch (t.type) {
    case Q.BoolTrue:
    case Q.BoolFalse:
      return Vx(t);
    case Q.OptionalNone:
    case Q.OptionalSome:
      return zx(t);
    case Q.Buffer:
      return jx(t);
    case Q.UInt:
      return Wx(t);
    case Q.Int:
      return qx(t);
    case Q.PrincipalStandard:
      return Xx(t);
    case Q.PrincipalContract:
      return Yx(t);
    case Q.ResponseOk:
    case Q.ResponseErr:
      return Zx(t);
    case Q.List:
      return Jx(t);
    case Q.Tuple:
      return Qx(t);
    case Q.StringASCII:
      return t3(t);
    case Q.StringUTF8:
      return e3(t);
    default:
      throw new Kx("Unable to serialize. Invalid Clarity Value.");
  }
}
const n3 = (t, e) => t ? To(t).length > e : !1;
function r3(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function s3(t) {
  const e = Dn(t);
  return `0x${pf(e)}`;
}
const o3 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], Vo = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Xr = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, $n = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, i3 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Bf = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((o) => i3(o, r)) === s
  );
}, c3 = (t) => t ? Bf(Xr()).some(
  (e) => {
    var n;
    return e.id === t && (Vo(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, a3 = () => {
  if (typeof window > "u")
    return;
  const t = Xr(), e = Bf(t).filter(
    (n) => {
      var r;
      return Vo(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = $n(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of o3) {
    const r = $n(t, n) ?? (t === window ? void 0 : $n(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, f3 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Xr(), n = $n(e, t) ?? (e === window ? void 0 : $n(window, t)) ?? ol(t);
  if (n)
    return n;
  if (Vo(t) || c3(t))
    return a3();
}, h3 = ["blockstack-session", "blockstack"], l3 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of h3) {
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
l3();
const Hf = () => pa(), u3 = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = pa(), e = t ? f3(t) : void 0;
  if (e)
    return e;
  const n = Xr() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, aa = (t) => s3(t).replace(/^0x/, ""), fa = "This wallet cannot sign messages. Try Xverse or Leather.", ha = (t) => typeof (t == null ? void 0 : t.request) == "function", la = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", d3 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, b3 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function p3(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: aa(e.message),
    domain: aa(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function g3(t, e) {
  const n = await Ng({
    domain: e.domain,
    message: e.message,
    network: Ig(e.network),
    stxAddress: e.stxAddress,
    // Xverse on phones reads the app name from appDetails and crashes without it.
    appDetails: { name: "ParallaX Casino", icon: (typeof location < "u" ? location.origin : "") + "/favicons/xtrata-apple-touch-icon.png" }
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function x3(t) {
  var s, o;
  const e = Hf() || "", n = /xverse/i.test(e);
  let r = u3();
  if (n && !la(r)) {
    const i = window;
    r = ((s = i.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((o = i.xverseProviders) == null ? void 0 : o.StacksProvider);
  }
  if (la(r))
    try {
      return await g3(r, t);
    } catch (i) {
      if (n || !ha(r) || !b3(i)) throw i;
    }
  if (!n && ha(r))
    try {
      return await p3(r, t);
    } catch (i) {
      throw d3(i) ? new Error(fa) : i;
    }
  throw new Error(fa);
}
const w3 = "ParallaX Casino", y3 = "ParallaX Casino room sign-in. This is free: it sends no transaction, costs no fees and gives no permission to spend anything.";
new TextEncoder();
new TextDecoder();
const m3 = (t) => t === "mainnet" ? 1 : 2147483648, S3 = (t) => `${y3} Account ${t.address}. Valid until ${new Date(t.expires).toISOString().replace(".000Z", "Z")}. Request code ${t.nonce}.`, E3 = (t) => ({
  domain: Gx({
    name: Es(w3),
    version: Es("1"),
    "chain-id": Mx(m3(t.network))
  }),
  message: Es(S3(t))
}), _f = [
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
  "drop.1",
  "drop.2",
  "twins.1",
  "twins.2",
  "ds.1",
  "ds.2",
  "bf.1",
  "bf.2",
  "nv.1",
  "nv.2",
  "bar.1",
  "bar.2",
  "bar.3",
  "bar.4"
];
new Set(_f);
const K = (t) => document.getElementById(t), v = {
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
}, A3 = performance.now(), Y = (t) => {
  const e = K("log");
  e.textContent += `${((performance.now() - A3) / 1e3).toFixed(1).padStart(6)}s  ${t}
`, e.scrollTop = e.scrollHeight;
}, nt = (t, e, n = "") => {
  const r = K(t);
  r.textContent = e, r.className = "status " + (n || "dim");
}, Lf = (t) => t ? `${t.slice(0, 5)}…${t.slice(-4)}` : "Guest", Rt = (t) => t instanceof Error ? t.message : String(t);
let X = null;
const we = [], Sn = (t) => !!t && typeof t.request == "function", v3 = () => {
  try {
    const t = window.top;
    if (t && t !== window.self && t.location.origin === window.location.origin) return t;
  } catch {
  }
  return window;
}, $3 = () => {
  const t = v3();
  return t === window ? [window] : [t, window];
}, ua = (t) => {
  for (const e of $3()) {
    const n = t(e);
    if (n) return n;
  }
  return null;
}, If = (t) => {
  if (t === "leather") {
    const s = ua((o) => Sn(o.LeatherProvider) ? o.LeatherProvider : null);
    return s ? { rpc: s } : null;
  }
  const e = ua((s) => {
    const o = s.XverseProviders || s.xverseProviders;
    return o && (Sn(o.BitcoinProvider) || Sn(o.StacksProvider)) ? o : null;
  });
  if (!e) return null;
  const n = Sn(e.BitcoinProvider) ? e.BitcoinProvider : null, r = Sn(e.StacksProvider) ? e.StacksProvider : null;
  return { rpc: n || r };
}, B3 = (t, e) => new Promise((n) => {
  const r = Date.now();
  (function s() {
    const o = If(t);
    o || Date.now() - r >= e ? n(o) : window.setTimeout(s, 150);
  })();
}), Or = (t) => {
  var e;
  return (t == null ? void 0 : t.code) ?? ((e = t == null ? void 0 : t.error) == null ? void 0 : e.code);
}, Ue = (t) => {
  var e;
  return String((t == null ? void 0 : t.message) ?? ((e = t == null ? void 0 : t.error) == null ? void 0 : e.message) ?? t ?? "unknown error");
}, H3 = (t) => [4001, -31001].includes(Number(Or(t))) || /cancel|denied|reject|declin|closed/i.test(Ue(t)), to = (t) => Number(Or(t)) === -32601 || /not supported|method not found|unsupported|not implemented|legacy method/i.test(Ue(t)), wr = async (t, e, n) => {
  const r = n === void 0 ? await t.request(e) : await t.request(e, n);
  if (r && typeof r == "object") {
    if (r.error) throw Object.assign(new Error(Ue(r.error)), { code: Or(r.error) });
    if (r.status === "error") throw Object.assign(new Error(Ue(r.error || r)), { code: Or(r.error || r) });
    if ("result" in r) return r.result;
  }
  return r;
}, _3 = (t) => new Promise((e, n) => {
  const r = window.setTimeout(() => n(new Error("The wallet did not answer. Check its window.")), 9e4);
  t.then((s) => {
    window.clearTimeout(r), e(s);
  }, (s) => {
    window.clearTimeout(r), n(s);
  });
}), L3 = (t) => (JSON.stringify(t) || "").match(/S[PT][0-9A-HJKMNP-TV-Z]{38,39}/g) || [];
async function I3(t) {
  const e = await B3(t, 1500);
  if (!e) throw new Error(`${t === "leather" ? "Leather" : "Xverse"} was not found in this browser.`);
  we.length = 0;
  let n;
  if (t === "xverse") {
    try {
      await wr(e.rpc, "wallet_disconnect"), we.push("wallet_disconnect: ok");
    } catch (s) {
      we.push("wallet_disconnect: " + Ue(s).slice(0, 80));
    }
    n = ["wallet_connect", "wallet_getAccount"];
  } else
    n = ["getAddresses", "stx_getAccounts", "stx_getAddresses", "stx_requestAccounts"];
  let r = null;
  for (const s of n)
    try {
      const o = await (t === "xverse" ? _3(wr(e.rpc, s)) : wr(e.rpc, s)), i = L3(o);
      if (i.length) {
        const c = i[0];
        return we.push(`${s}: ok`), { kind: t, address: c, network: c.startsWith("SP") ? "mainnet" : "testnet", via: s };
      }
      we.push(`${s}: answered but no Stacks address in it`);
    } catch (o) {
      if (H3(o))
        throw we.push(`${s}: cancelled`), new Error("Connection cancelled.");
      we.push(`${s}: ${to(o) ? "not supported" : Ue(o).slice(0, 80)}`), to(o) || (r = o);
    }
  throw new Error(r ? Ue(r) : "The wallet did not share a Stacks address.");
}
const zo = () => {
  const t = !!X;
  K("signin").disabled = !t || !!v.signedAs, K("disconnect").disabled = !t, nt("walletStatus", X ? `Connected: ${X.address} (${X.network}, ${X.kind}, via ${X.via})` : "Not connected.", X ? "ok" : "");
}, Uf = async (t) => {
  try {
    Y(`connect: asking ${t}`), X = await I3(t), il(t === "leather" ? "LeatherProvider" : "XverseProviders.BitcoinProvider"), v.results.connect = `ok (${X.kind}, ${X.network}, via ${X.via})`, Y(`connect: ok ${Lf(X.address)} (${X.network}) via ${X.via}`);
  } catch (e) {
    X = null, v.results.connect = "error: " + Rt(e), Y("connect failed: " + Rt(e)), nt("walletStatus", "Could not connect: " + Rt(e), "bad");
    return;
  }
  zo();
};
K("connect-leather").onclick = () => Uf("leather");
K("connect-xverse").onclick = () => Uf("xverse");
K("disconnect").onclick = async () => {
  const t = X;
  X = null;
  try {
    cl();
  } catch {
  }
  if (t) {
    const e = If(t.kind);
    for (const n of t.kind === "xverse" ? ["wallet_disconnect"] : ["stx_disconnect", "wallet_disconnect", "disconnect", "deactivate"])
      try {
        e && await wr(e.rpc, n);
        break;
      } catch (r) {
        if (!to(r)) break;
      }
  }
  Y("wallet disconnected"), zo(), Fn();
};
const Cr = async (t, e) => {
  const n = await fetch(t, { credentials: "same-origin", ...e });
  let r = null;
  try {
    r = await n.json();
  } catch {
  }
  return { res: n, body: r };
};
K("signin").onclick = async () => {
  const t = X;
  if (!t) return;
  const e = K("signin");
  e.disabled = !0;
  try {
    nt("signStatus", "Asking the room for a sign-in request…");
    const n = performance.now(), { res: r, body: s } = await Cr(`/casino/room/challenge?address=${encodeURIComponent(t.address)}`);
    if (v.timers.challengeMs = Math.round(performance.now() - n), !r.ok) throw new Error((s == null ? void 0 : s.error) || `The room answered ${r.status}.`);
    const o = s.challenge;
    Y(`challenge: ok (${v.timers.challengeMs} ms), network ${o.network}`), nt("signStatus", "Your wallet should now ask you to sign. This is free.");
    const { domain: i, message: c } = E3(o), f = performance.now();
    let d;
    try {
      d = await x3({ domain: i, message: c, network: o.network, stxAddress: t.address });
    } catch (u) {
      throw v.results.sign = "wallet error: " + Rt(u), new Error("The wallet did not sign: " + Rt(u));
    }
    v.timers.signMs = Math.round(performance.now() - f), v.results.sign = "ok", Y(`sign: ok (${v.timers.signMs} ms)`);
    const l = performance.now(), { res: a, body: b } = await Cr("/casino/room/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ challenge: o, signature: d })
    });
    if (v.timers.sessionMs = Math.round(performance.now() - l), !a.ok)
      throw v.results.session = `rejected ${a.status}: ${b == null ? void 0 : b.error}`, new Error((b == null ? void 0 : b.error) || `The room answered ${a.status}.`);
    v.results.session = "ok", v.signedAs = { address: b.address, hash160: b.hash160, network: b.network, expiresAt: b.expiresAt }, Y(`session: ok (${v.timers.sessionMs} ms), key hash ${b.hash160}`), Fn(), qo("signed in");
  } catch (n) {
    Y("sign-in failed: " + Rt(n)), nt("signStatus", Rt(n), "bad"), e.disabled = !1;
  }
};
K("signout").onclick = async () => {
  await Cr("/casino/room/session", { method: "DELETE" }), v.signedAs = null, v.wantSpot = null, Y("signed out"), Fn(), qo("signed out");
};
function Fn() {
  const t = v.signedAs;
  K("signin").disabled = !!t || !X, K("signout").disabled = !t, nt("signStatus", t ? `Signed in as ${t.address} (${t.network}). Account key hash ${t.hash160.slice(0, 12)}… Session ends ${new Date(t.expiresAt).toLocaleTimeString()}.` : "Not signed in. You can still watch the room as a guest.", t ? "ok" : ""), zt();
}
const Of = () => {
  var n;
  const t = ((n = v.you) == null ? void 0 : n.a) ?? null, e = K("spots");
  e.textContent = "";
  for (const r of _f) {
    const s = v.spots[r], o = document.createElement("button"), i = document.createElement("span");
    i.textContent = r;
    const c = document.createElement("small");
    c.textContent = s ? s.a === t ? "you" : s.n : "free", o.append(i, c), (s == null ? void 0 : s.a) === t && t ? o.className = "mine" : s && (o.className = "taken"), o.disabled = !t || !!s && s.a !== t, o.onclick = () => hn({ t: "sit", spot: r }), e.append(o);
  }
  K("stand").disabled = !t || !Object.values(v.spots).some((r) => r.a === t), K("counts").textContent = `${v.joined} signed in, ${v.guests} watching. ${v.you ? "You are " + (v.you.guest ? "a guest (watching only)." : v.you.n + ".") : ""}`;
}, hn = (t) => {
  var e;
  ((e = v.ws) == null ? void 0 : e.readyState) === WebSocket.OPEN ? (t.t === "sit" && (v.wantSpot = t.spot), t.t === "stand" && (v.wantSpot = null), v.ws.send(JSON.stringify(t))) : Y("not connected to the room");
};
K("stand").onclick = () => hn({ t: "stand" });
function jo() {
  v.attempts += 1;
  const t = `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/casino/room/ws`, e = performance.now();
  nt("roomStatus", v.attempts > 1 ? "Reconnecting…" : "Connecting…");
  let n;
  try {
    n = new WebSocket(t);
  } catch (r) {
    return Y("websocket could not start: " + Rt(r)), da();
  }
  v.ws = n, n.onopen = () => {
    v.timers.wsOpenMs = Math.round(performance.now() - e), v.results.websocket = "open", v.opened += 1, Y(`room: connected (${v.timers.wsOpenMs} ms)`), nt("roomStatus", "Connected to the room.", "ok"), zt(), v.attempts > 1 && (v.reconnects += 1), v.attempts = 0;
  }, n.onmessage = (r) => {
    let s;
    try {
      s = JSON.parse(String(r.data));
    } catch {
      return;
    }
    switch (s.t) {
      case "room":
        v.you = s.you, v.spots = s.spots || {}, v.joined = s.joined, v.guests = s.guests, B.players = s.players || [], B.known = !0, Df(), v.wantSpot && v.you && !v.you.guest && !Object.values(v.spots).some((o) => o.a === v.you.a) && (Y("re-sitting at " + v.wantSpot), n.send(JSON.stringify({ t: "sit", spot: v.wantSpot }))), v.idleCheck && U3(s);
        break;
      case "sat":
        v.spots[s.spot] = s.who;
        break;
      case "stood":
        delete v.spots[s.spot];
        break;
      case "moved":
        Y(`another tab of yours took ${s.spot}`), v.wantSpot === s.spot && (v.wantSpot = null);
        break;
      case "count":
        v.joined = s.joined, v.guests = s.guests;
        break;
      case "join":
        B.players.some((o) => o.a === s.who.a) || B.players.push({ a: s.who.a, n: s.who.n, spot: null }), Bn(B.room, `${s.who.n} arrived.`);
        break;
      case "leave": {
        const o = B.players.find((i) => i.a === s.a);
        B.players = B.players.filter((i) => i.a !== s.a), o && (Bn(B.room, `${o.n} left.`), B.threads[s.a] && Bn(B.threads[s.a].lines, `${o.n} left the room.`));
        break;
      }
      case "say":
      case "dm":
        K3(s);
        break;
      case "blocks":
        Y(`room keeps ${s.list.length} blocked`);
        break;
      case "reported":
        nt("chatStatus", "Report sent. Thank you.", "ok"), Y("report sent");
        break;
      case "pong":
        v.timers.pingMs = Math.round(performance.now() - v.pingSent), Y(`pong (${v.timers.pingMs} ms)`);
        break;
      case "err":
        Y("room says: " + s.code), R3(s.code);
        break;
    }
    Of(), zt();
  }, n.onclose = (r) => {
    if (v.lastClose = { code: r.code, reason: r.reason }, Y(`room: closed (${r.code}${r.reason ? " " + r.reason : ""})`), v.ws === n) {
      if (v.ws = null, r.code === 4001) {
        v.replaced = !0, nt("roomStatus", "Another tab of yours replaced this one.", "bad");
        return;
      }
      nt("roomStatus", "Disconnected. Reconnecting…", "bad"), zt(), da();
    }
  }, n.onerror = () => {
    v.results.websocket = v.results.websocket === "open" ? "open" : "error";
  };
}
function da() {
  const t = Math.min(15e3, 1e3 * 2 ** Math.min(v.attempts, 4));
  Y(`retrying in ${t / 1e3}s`), window.setTimeout(() => {
    v.ws || jo();
  }, t);
}
function qo(t) {
  Y("reconnecting: " + t);
  const e = v.ws;
  v.ws = null, v.attempts = 0, v.replaced = !1;
  try {
    e == null || e.close(1e3, "client");
  } catch {
  }
  jo();
}
K("reconnect").onclick = () => qo("button");
K("idle").onclick = () => {
  var e;
  if (((e = v.ws) == null ? void 0 : e.readyState) !== WebSocket.OPEN) {
    Y("idle test: connect first");
    return;
  }
  const t = JSON.stringify(Object.keys(v.spots).sort());
  v.idleCheck = { before: t, started: performance.now() }, nt("idleStatus", "Idle test running. Do not touch anything for 30 seconds…"), window.setTimeout(() => {
    v.pingSent = performance.now(), hn({ t: "ping" }), hn({ t: "hello" });
  }, 3e4);
};
function U3(t) {
  const e = v.idleCheck;
  if (!e) return;
  v.idleCheck = null;
  const n = JSON.stringify(Object.keys(t.spots || {}).sort()), r = n === e.before;
  v.results.idle = r ? "ok: room state intact after 30 s idle" : `changed: before ${e.before} after ${n}`, nt("idleStatus", r ? "Idle test passed: the room remembered everyone after 30 seconds." : "Idle test: the room changed while idle (see report).", r ? "ok" : "bad"), Y("idle test: " + v.results.idle);
}
const ba = 200, Cf = 40, kf = "px_room_blocks_v1", O3 = () => {
  try {
    const t = JSON.parse(localStorage.getItem(kf) || "[]");
    return Array.isArray(t) ? t.filter((e) => typeof e == "string").slice(0, Cf) : [];
  } catch {
    return [];
  }
}, B = {
  players: [],
  known: !1,
  // the room has told us who is here at least once; before that, "nobody here" would be a guess
  room: [],
  threads: {},
  open: [],
  // addresses with a tab, in the order they were opened
  active: "room",
  unreadRoom: !1,
  blocks: O3(),
  pending: null,
  // the text just sent, handed back if the room refuses it
  sent: 0,
  received: 0,
  errors: []
}, C3 = () => {
  try {
    localStorage.setItem(kf, JSON.stringify(B.blocks));
  } catch {
  }
}, k3 = {
  "no-links": "Links are not allowed in messages.",
  "too-long": "That message is too long (280 characters at most).",
  empty: "Type something first.",
  "slow-down": "Slow down a little: one message every two seconds.",
  "not-here": "That person has left the room.",
  blocked: "You have blocked this person. Unblock them to message them.",
  "not-you": "You cannot do that to yourself.",
  "sign-in-first": "Sign in (step 2) to chat.",
  "no-such-player": "That person is not in the room."
}, Ut = () => v.you && !v.you.guest ? v.you.a : null, Vt = () => {
  var t;
  return ((t = v.ws) == null ? void 0 : t.readyState) === WebSocket.OPEN;
}, P3 = (t) => {
  var e;
  return ((e = Object.entries(v.spots).find(([, n]) => n.a === t)) == null ? void 0 : e[0]) ?? null;
}, eo = (t, e) => {
  t.push(e), t.length > ba && t.splice(0, t.length - ba);
}, Bn = (t, e) => eo(t, { who: null, mine: !1, text: e, at: Date.now() }), N3 = (t) => new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), It = (t, e, n) => {
  const r = document.createElement(t);
  return e !== void 0 && (r.textContent = e), n && (r.className = n), r;
}, Pf = (t) => {
  const e = B.threads[t.a] ?? (B.threads[t.a] = { name: t.n, lines: [], unread: !1 });
  return B.open.includes(t.a) || B.open.push(t.a), e;
}, Nf = (t) => {
  Pf(t).unread = !1, B.active = t.a, zt(), K("chatInput").focus();
}, D3 = () => {
  const t = K("players");
  if (t.textContent = "", t.classList.toggle("stale", B.known && !Vt()), !B.known || B.players.length === 0) {
    t.append(It("div", B.known ? "Nobody is signed in right now." : Vt() ? "Asking the room who is here…" : "Not connected to the room.", "status dim"));
    return;
  }
  const e = Ut();
  for (const n of B.players) {
    const r = It("button", void 0, n.a === e ? "me" : "");
    r.type = "button", r.setAttribute("role", "listitem"), r.append(It("span", n.a === e ? "You" : n.n), It("small", [P3(n.a) ?? "not seated", B.blocks.includes(n.a) ? "blocked" : ""].filter(Boolean).join(" · "))), r.disabled = !e || n.a === e || !Vt(), r.onclick = () => Nf({ a: n.a, n: n.n }), t.append(r);
  }
}, F3 = () => {
  const t = K("tabs");
  t.textContent = "";
  const e = (n, r, s) => {
    const o = It("button", r, B.active === n ? "on" : "");
    o.type = "button", o.setAttribute("role", "tab"), o.setAttribute("aria-selected", String(B.active === n)), s && o.append(It("span", void 0, "dot")), o.onclick = () => {
      B.active = n, n === "room" ? B.unreadRoom = !1 : B.threads[n].unread = !1, zt();
    }, t.append(o);
  };
  e("room", "Room", B.unreadRoom);
  for (const n of B.open) e(n, B.threads[n].name, B.threads[n].unread);
}, T3 = () => {
  var s;
  const t = K("thread"), e = t.scrollTop + t.clientHeight >= t.scrollHeight - 24;
  t.textContent = "";
  const n = B.active === "room", r = n ? B.room : ((s = B.threads[B.active]) == null ? void 0 : s.lines) ?? [];
  r.length === 0 && t.append(It("p", Ut() ? "No messages yet." : "Guests can see who is here but cannot read or send messages.", "line note"));
  for (const o of r) {
    const i = It("p", void 0, "line" + (o.who ? o.mine ? " mine" : " other" : " note"));
    if (o.who) {
      const c = o.who, f = It("b", o.mine ? "You" : c.n);
      !o.mine && n && (f.title = "Message " + c.n, f.onclick = () => Nf(c)), i.append(f, document.createTextNode(" " + o.text));
    } else i.append(document.createTextNode(o.text));
    i.append(It("time", N3(o.at))), t.append(i);
  }
  e && (t.scrollTop = t.scrollHeight);
}, M3 = () => {
  const t = B.active !== "room";
  K("threadTools").hidden = !t, t && (K("blockBtn").textContent = B.blocks.includes(B.active) ? "Unblock" : "Block", K("reportBtn").disabled = !Ut() || !Vt());
}, G3 = () => {
  var n;
  const t = !!Ut() && Vt(), e = K("chatInput");
  e.disabled = !t, K("chatSend").disabled = !t, e.placeholder = Ut() ? Vt() ? B.active === "room" ? "Say something to the room" : `Message ${((n = B.threads[B.active]) == null ? void 0 : n.name) ?? ""}` : "Reconnecting…" : "Sign in to chat", K("chatGate").textContent = Ut() ? "Messages are not private: they pass through the room service and are not stored. No links. Block hides you and them from each other." : "Guests can see who is here but cannot read or send messages. Sign in (step 2) to chat.";
};
function zt() {
  D3(), F3(), T3(), M3(), G3();
}
const R3 = (t) => {
  const e = k3[t];
  if (!e) return;
  B.errors.push(t), B.errors.length > 10 && B.errors.shift(), nt("chatStatus", e, "bad");
  const n = K("chatInput");
  B.pending && !n.value && (n.value = B.pending), B.pending = null;
}, Df = () => {
  Ut() && Vt() && v.ws.send(JSON.stringify({ t: "blocks", list: B.blocks }));
}, K3 = (t) => {
  const e = Ut(), n = t.from.a === e;
  if (n ? B.pending = null : B.received += 1, t.t === "say") {
    eo(B.room, { who: t.from, mine: n, text: t.text, at: t.at }), B.active !== "room" && !n && (B.unreadRoom = !0);
    return;
  }
  const r = n ? t.to : t.from, s = Pf(r);
  eo(s.lines, { who: t.from, mine: n, text: t.text, at: t.at }), B.active !== r.a && !n && (s.unread = !0);
};
K("composer").onsubmit = (t) => {
  t.preventDefault();
  const e = K("chatInput"), n = e.value.replace(/\s+/g, " ").trim();
  if (n) {
    if (!Ut() || !Vt()) {
      nt("chatStatus", "Not connected to the room.", "bad");
      return;
    }
    B.pending = n, e.value = "", nt("chatStatus", ""), B.sent += 1, hn(B.active === "room" ? { t: "say", text: n } : { t: "dm", to: B.active, text: n });
  }
};
K("blockBtn").onclick = () => {
  const t = B.active;
  if (t === "room") return;
  const e = B.threads[t];
  if (B.blocks.includes(t))
    B.blocks = B.blocks.filter((n) => n !== t), Bn(e.lines, `You unblocked ${e.name}.`);
  else {
    if (B.blocks.length >= Cf) {
      nt("chatStatus", "Your block list is full.", "bad");
      return;
    }
    B.blocks.push(t), Bn(e.lines, `You blocked ${e.name}. Neither of you will see the other's messages.`);
  }
  C3(), Df(), zt();
};
K("reportBtn").onclick = () => {
  var r;
  const t = B.active;
  if (t === "room" || !Ut() || !Vt()) return;
  const e = K("reportWhy").value, n = [...B.room, ...((r = B.threads[t]) == null ? void 0 : r.lines) ?? []].filter((s) => {
    var o;
    return ((o = s.who) == null ? void 0 : o.a) === t;
  }).slice(-5).map((s) => s.text.slice(0, 120));
  nt("chatStatus", "Sending report…"), hn({ t: "report", who: t, why: e, lines: n });
};
K("closeBtn").onclick = () => {
  B.open = B.open.filter((t) => t !== B.active), B.active = "room", zt();
};
const Ff = () => {
  const t = {
    page: "casino-room-spike v2 (people and chat)",
    at: (/* @__PURE__ */ new Date()).toISOString(),
    userAgent: navigator.userAgent,
    wallet: { kind: (X == null ? void 0 : X.kind) ?? null, selectedProviderId: Hf() || null, address: (X == null ? void 0 : X.address) ?? null, network: (X == null ? void 0 : X.network) ?? null, connectedVia: (X == null ? void 0 : X.via) ?? null, connectTrail: we },
    signedAs: v.signedAs && { address: v.signedAs.address, network: v.signedAs.network, hash160: v.signedAs.hash160 },
    results: v.results,
    timersMs: v.timers,
    websocket: { opened: v.opened, reconnects: v.reconnects, lastClose: v.lastClose, replaced: v.replaced },
    room: { you: v.you, joined: v.joined, guests: v.guests, spots: v.spots },
    chat: { players: B.players.length, sent: B.sent, received: B.received, blocked: B.blocks.length, openChats: B.open.length, lastErrors: B.errors }
  };
  return JSON.stringify(t, null, 2);
};
K("report").onclick = () => {
  K("reportText").value = Ff();
};
K("copy").onclick = async () => {
  const t = K("reportText");
  t.value || (t.value = Ff());
  try {
    await navigator.clipboard.writeText(t.value), Y("report copied");
  } catch {
    t.select(), Y("select the text and copy it by hand");
  }
};
zo();
Fn();
Of();
zt();
(async () => {
  try {
    const { res: t, body: e } = await Cr("/casino/room/session");
    if (t.ok && (e != null && e.address))
      v.signedAs = { address: e.address, hash160: e.hash160, network: "unknown", expiresAt: e.expiresAt }, Y("already signed in from earlier: " + Lf(e.address)), Fn();
    else if (t.status === 503) {
      v.results.service = "offline: " + ((e == null ? void 0 : e.reason) || "unknown"), nt("roomStatus", "The room service is not switched on yet (this is expected before it is deployed).", "bad"), Y("room service offline: " + ((e == null ? void 0 : e.reason) || t.status));
      return;
    }
  } catch (t) {
    Y("could not reach the room service: " + Rt(t));
  }
  jo();
})();
