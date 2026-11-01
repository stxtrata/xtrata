var K0 = Object.defineProperty;
var z0 = (t, e, n) => e in t ? K0(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var mn = (t, e, n) => z0(t, typeof e != "symbol" ? e + "" : e, n);
function ni(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Hn(r);
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
      const r = W0(BigInt(`0x${ie(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${ie(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function ri(t, e = 8) {
  return (typeof t == "bigint" ? t : ni(t, !1)).toString(16).padStart(e * 2, "0");
}
function wl(t) {
  return parseInt(t, 16);
}
function yl(t, e = 16) {
  const n = ri(t, e);
  return Hn(n);
}
function j0(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function q0(t, e) {
  return t & BigInt(1) << e;
}
function W0(t, e) {
  return q0(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const X0 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ie(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += X0[n];
  return e;
}
function Hn(t) {
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
function hr(t) {
  return new TextEncoder().encode(t);
}
function ml(t) {
  return new TextDecoder().decode(t);
}
function Sl(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Y0(t) {
  return String.fromCharCode.apply(null, t);
}
function J0(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function aa(t) {
  if (t.some(J0))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function si(...t) {
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
function Fn(t) {
  return si(...t.map((e) => typeof e == "number" ? aa([e]) : e instanceof Array ? aa(e) : e));
}
function Z0(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Q0(t, e) {
  return t[e];
}
function tu(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function vs(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Eo;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Eo || (Eo = {}));
Eo.Mainnet;
const eu = 128, nu = 128, El = 16;
var sr;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(sr || (sr = {}));
var ca;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ca || (ca = {}));
var la;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(la || (la = {}));
var Nt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Nt || (Nt = {}));
const eo = ["onChainOnly", "offChainOnly", "any"];
eo[0] + "", Nt.OnChainOnly, eo[1] + "", Nt.OffChainOnly, eo[2] + "", Nt.Any, Nt.OnChainOnly + "", Nt.OnChainOnly, Nt.OffChainOnly + "", Nt.OffChainOnly, Nt.Any + "", Nt.Any;
var Ao;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ao || (Ao = {}));
Ao.Mainnet;
var fa;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(fa || (fa = {}));
var ha;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(ha || (ha = {}));
var ua;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(ua || (ua = {}));
var da;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(da || (da = {}));
var vo;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(vo || (vo = {}));
var pa;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(pa || (pa = {}));
var ba;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(ba || (ba = {}));
var ga;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(ga || (ga = {}));
var xa;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(xa || (xa = {}));
var wa;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(wa || (wa = {}));
var ya;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(ya || (ya = {}));
function Bo(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function ru(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Al(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function su(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Bo(t.outputLen), Bo(t.blockLen);
}
function ou(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function iu(t, e) {
  Al(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const no = {
  number: Bo,
  bool: ru,
  bytes: Al,
  hash: su,
  exists: ou,
  output: iu
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ro = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Rt = (t, e) => t << 32 - e | t >>> e, au = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!au)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function cu(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function vl(t) {
  if (typeof t == "string" && (t = cu(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let lu = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function cn(t) {
  const e = (r) => t().update(vl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function fu(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, h = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + h, a, r);
}
let oi = class extends lu {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ro(this.buffer);
  }
  update(e) {
    no.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = vl(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = ro(e);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    no.exists(this), no.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let l = i; l < s; l++)
      n[l] = 0;
    fu(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = ro(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const h = c / 4, f = this.get();
    if (h > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < h; l++)
      a.setUint32(4 * l, f[l], o);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return e.length = s, e.pos = a, e.finished = o, e.destroyed = i, s % n && e.buffer.set(r), e;
  }
};
const hu = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Bl = Uint8Array.from({ length: 16 }, (t, e) => e), uu = Bl.map((t) => (9 * t + 5) % 16);
let ii = [Bl], ai = [uu];
for (let t = 0; t < 4; t++)
  for (let e of [ii, ai])
    e.push(e[t].map((n) => hu[n]));
const $l = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), du = ii.map((t, e) => t.map((n) => $l[e][n])), pu = ai.map((t, e) => t.map((n) => $l[e][n])), bu = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), gu = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ur = (t, e) => t << e | t >>> 32 - e;
function ma(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Or = new Uint32Array(16);
let xu = class extends oi {
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
    for (let d = 0; d < 16; d++, n += 4)
      Or[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, h = this.h3 | 0, f = h, l = this.h4 | 0, b = l;
    for (let d = 0; d < 5; d++) {
      const x = 4 - d, w = bu[d], v = gu[d], H = ii[d], U = ai[d], y = du[d], $ = pu[d];
      for (let A = 0; A < 16; A++) {
        const P = Ur(r + ma(d, o, a, h) + Or[H[A]] + w, y[A]) + l | 0;
        r = l, l = h, h = Ur(a, 10) | 0, a = o, o = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = Ur(s + ma(x, i, c, f) + Or[U[A]] + v, $[A]) + b | 0;
        s = b, b = f, f = Ur(c, 10) | 0, c = i, i = P;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + h + b | 0, this.h3 + l + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Or.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
cn(() => new xu());
const wu = (t, e, n) => t & e ^ ~t & n, yu = (t, e, n) => t & e ^ t & n ^ e & n, mu = new Uint32Array([
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
let _l = class extends oi {
  constructor() {
    super(64, 32, 8, !1), this.A = fe[0] | 0, this.B = fe[1] | 0, this.C = fe[2] | 0, this.D = fe[3] | 0, this.E = fe[4] | 0, this.F = fe[5] | 0, this.G = fe[6] | 0, this.H = fe[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [e, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      he[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = he[l - 15], d = he[l - 2], x = Rt(b, 7) ^ Rt(b, 18) ^ b >>> 3, w = Rt(d, 17) ^ Rt(d, 19) ^ d >>> 10;
      he[l] = w + he[l - 7] + x + he[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: h, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const b = Rt(a, 6) ^ Rt(a, 11) ^ Rt(a, 25), d = f + b + wu(a, c, h) + mu[l] + he[l] | 0, w = (Rt(r, 2) ^ Rt(r, 13) ^ Rt(r, 22)) + yu(r, s, o) | 0;
      f = h, h = c, c = a, a = i + d | 0, i = o, o = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, h = h + this.G | 0, f = f + this.H | 0, this.set(r, s, o, i, a, c, h, f);
  }
  roundClean() {
    he.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Su = class extends _l {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
cn(() => new _l());
cn(() => new Su());
const Cr = BigInt(2 ** 32 - 1), $o = BigInt(32);
function Hl(t, e = !1) {
  return e ? { h: Number(t & Cr), l: Number(t >> $o & Cr) } : { h: Number(t >> $o & Cr) | 0, l: Number(t & Cr) | 0 };
}
function Eu(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = Hl(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const Au = (t, e) => BigInt(t >>> 0) << $o | BigInt(e >>> 0), vu = (t, e, n) => t >>> n, Bu = (t, e, n) => t << 32 - n | e >>> n, $u = (t, e, n) => t >>> n | e << 32 - n, _u = (t, e, n) => t << 32 - n | e >>> n, Hu = (t, e, n) => t << 64 - n | e >>> n - 32, Lu = (t, e, n) => t >>> n - 32 | e << 64 - n, Iu = (t, e) => e, Uu = (t, e) => t, Ou = (t, e, n) => t << n | e >>> 32 - n, Cu = (t, e, n) => e << n | t >>> 32 - n, ku = (t, e, n) => e << n - 32 | t >>> 64 - n, Pu = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Nu(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Du = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Tu = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Fu = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Mu = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Ru = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Gu = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, G = {
  fromBig: Hl,
  split: Eu,
  toBig: Au,
  shrSH: vu,
  shrSL: Bu,
  rotrSH: $u,
  rotrSL: _u,
  rotrBH: Hu,
  rotrBL: Lu,
  rotr32H: Iu,
  rotr32L: Uu,
  rotlSH: Ou,
  rotlSL: Cu,
  rotlBH: ku,
  rotlBL: Pu,
  add: Nu,
  add3L: Du,
  add3H: Tu,
  add4L: Fu,
  add4H: Mu,
  add5H: Gu,
  add5L: Ru
}, [Vu, Ku] = G.split([
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
let Bs = class extends oi {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: h, El: f, Fh: l, Fl: b, Gh: d, Gl: x, Hh: w, Hl: v } = this;
    return [e, n, r, s, o, i, a, c, h, f, l, b, d, x, w, v];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, c, h, f, l, b, d, x, w, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = h | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = b | 0, this.Gh = d | 0, this.Gl = x | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let y = 0; y < 16; y++, n += 4)
      ue[y] = e.getUint32(n), de[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const $ = ue[y - 15] | 0, A = de[y - 15] | 0, P = G.rotrSH($, A, 1) ^ G.rotrSH($, A, 8) ^ G.shrSH($, A, 7), F = G.rotrSL($, A, 1) ^ G.rotrSL($, A, 8) ^ G.shrSL($, A, 7), O = ue[y - 2] | 0, C = de[y - 2] | 0, g = G.rotrSH(O, C, 19) ^ G.rotrBH(O, C, 61) ^ G.shrSH(O, C, 6), E = G.rotrSL(O, C, 19) ^ G.rotrBL(O, C, 61) ^ G.shrSL(O, C, 6), L = G.add4L(F, E, de[y - 7], de[y - 16]), k = G.add4H(L, P, g, ue[y - 7], ue[y - 16]);
      ue[y] = k | 0, de[y] = L | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: h, Dl: f, Eh: l, El: b, Fh: d, Fl: x, Gh: w, Gl: v, Hh: H, Hl: U } = this;
    for (let y = 0; y < 80; y++) {
      const $ = G.rotrSH(l, b, 14) ^ G.rotrSH(l, b, 18) ^ G.rotrBH(l, b, 41), A = G.rotrSL(l, b, 14) ^ G.rotrSL(l, b, 18) ^ G.rotrBL(l, b, 41), P = l & d ^ ~l & w, F = b & x ^ ~b & v, O = G.add5L(U, A, F, Ku[y], de[y]), C = G.add5H(O, H, $, P, Vu[y], ue[y]), g = O | 0, E = G.rotrSH(r, s, 28) ^ G.rotrBH(r, s, 34) ^ G.rotrBH(r, s, 39), L = G.rotrSL(r, s, 28) ^ G.rotrBL(r, s, 34) ^ G.rotrBL(r, s, 39), k = r & o ^ r & a ^ o & a, M = s & i ^ s & c ^ i & c;
      H = w | 0, U = v | 0, w = d | 0, v = x | 0, d = l | 0, x = b | 0, { h: l, l: b } = G.add(h | 0, f | 0, C | 0, g | 0), h = a | 0, f = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const N = G.add3L(g, L, M);
      r = G.add3H(N, C, E, k), s = N | 0;
    }
    ({ h: r, l: s } = G.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = G.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = G.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h, l: f } = G.add(this.Dh | 0, this.Dl | 0, h | 0, f | 0), { h: l, l: b } = G.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h: d, l: x } = G.add(this.Fh | 0, this.Fl | 0, d | 0, x | 0), { h: w, l: v } = G.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: H, l: U } = G.add(this.Hh | 0, this.Hl | 0, H | 0, U | 0), this.set(r, s, o, i, a, c, h, f, l, b, d, x, w, v, H, U);
  }
  roundClean() {
    ue.fill(0), de.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, zu = class extends Bs {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, ju = class extends Bs {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, qu = class extends Bs {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
cn(() => new Bs());
cn(() => new zu());
cn(() => new ju());
cn(() => new qu());
const Wu = {}, Ll = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Wu
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const J = BigInt(0), ot = BigInt(1), Te = BigInt(2), tr = BigInt(3), Sa = BigInt(8), nt = Object.freeze({
  a: J,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: ot,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Ea = (t, e) => (t + e / Te) / e, kr = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = nt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -ot * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), o = n, i = BigInt("0x100000000000000000000000000000000"), a = Ea(o * t, e), c = Ea(-r * t, e);
    let h = I(t - a * n - c * s, e), f = I(-a * r - c * o, e);
    const l = h > i, b = f > i;
    if (l && (h = e - h), b && (f = e - f), h > i || f > i)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: h, k2neg: b, k2: f };
  }
}, Mt = 32, en = 32, Il = 32, as = Mt + 1, cs = 2 * Mt + 1;
function Aa(t) {
  const { a: e, b: n } = nt, r = I(t * t), s = I(r * t);
  return I(s + e * t + n);
}
const Pr = nt.a === J;
class ci extends Error {
  constructor(e) {
    super(e);
  }
}
function va(t) {
  if (!(t instanceof tt))
    throw new TypeError("JacobianPoint expected");
}
class tt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof Z))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(Z.ZERO) ? tt.ZERO : new tt(e.x, e.y, ot);
  }
  static toAffineBatch(e) {
    const n = Qu(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return tt.toAffineBatch(e).map(tt.fromAffine);
  }
  equals(e) {
    va(e);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = e, c = I(s * s), h = I(a * a), f = I(n * h), l = I(o * c), b = I(I(r * a) * h), d = I(I(i * s) * c);
    return f === l && b === d;
  }
  negate() {
    return new tt(this.x, I(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = I(e * e), o = I(n * n), i = I(o * o), a = e + o, c = I(Te * (I(a * a) - s - i)), h = I(tr * s), f = I(h * h), l = I(f - Te * c), b = I(h * (c - l) - Sa * i), d = I(Te * n * r);
    return new tt(l, b, d);
  }
  add(e) {
    va(e);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = e;
    if (o === J || i === J)
      return this;
    if (n === J || r === J)
      return e;
    const c = I(s * s), h = I(a * a), f = I(n * h), l = I(o * c), b = I(I(r * a) * h), d = I(I(i * s) * c), x = I(l - f), w = I(d - b);
    if (x === J)
      return w === J ? this.double() : tt.ZERO;
    const v = I(x * x), H = I(x * v), U = I(f * v), y = I(w * w - H - Te * U), $ = I(w * (U - y) - b * H), A = I(s * a * x);
    return new tt(y, $, A);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = tt.ZERO;
    if (typeof e == "bigint" && e === J)
      return n;
    let r = _a(e);
    if (r === ot)
      return this;
    if (!Pr) {
      let l = n, b = this;
      for (; r > J; )
        r & ot && (l = l.add(b)), b = b.double(), r >>= ot;
      return l;
    }
    let { k1neg: s, k1: o, k2neg: i, k2: a } = kr.splitScalar(r), c = n, h = n, f = this;
    for (; o > J || a > J; )
      o & ot && (c = c.add(f)), a & ot && (h = h.add(f)), f = f.double(), o >>= ot, a >>= ot;
    return s && (c = c.negate()), i && (h = h.negate()), h = new tt(I(h.x * kr.beta), h.y, h.z), c.add(h);
  }
  precomputeWindow(e) {
    const n = Pr ? 128 / e + 1 : 256 / e + 1, r = [];
    let s = this, o = s;
    for (let i = 0; i < n; i++) {
      o = s, r.push(o);
      for (let a = 1; a < 2 ** (e - 1); a++)
        o = o.add(s), r.push(o);
      s = o.double();
    }
    return r;
  }
  wNAF(e, n) {
    !n && this.equals(tt.BASE) && (n = Z.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && _o.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = tt.normalizeZ(s), _o.set(n, s)));
    let o = tt.ZERO, i = tt.BASE;
    const a = 1 + (Pr ? 128 / r : 256 / r), c = 2 ** (r - 1), h = BigInt(2 ** r - 1), f = 2 ** r, l = BigInt(r);
    for (let b = 0; b < a; b++) {
      const d = b * c;
      let x = Number(e & h);
      e >>= l, x > c && (x -= f, e += ot);
      const w = d, v = d + Math.abs(x) - 1, H = b % 2 !== 0, U = x < 0;
      x === 0 ? i = i.add(Nr(H, s[w])) : o = o.add(Nr(U, s[v]));
    }
    return { p: o, f: i };
  }
  multiply(e, n) {
    let r = _a(e), s, o;
    if (Pr) {
      const { k1neg: i, k1: a, k2neg: c, k2: h } = kr.splitScalar(r);
      let { p: f, f: l } = this.wNAF(a, n), { p: b, f: d } = this.wNAF(h, n);
      f = Nr(i, f), b = Nr(c, b), b = new tt(I(b.x * kr.beta), b.y, b.z), s = f.add(b), o = l.add(d);
    } else {
      const { p: i, f: a } = this.wNAF(r, n);
      s = i, o = a;
    }
    return tt.normalizeZ([s, o])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, o = this.equals(tt.ZERO);
    e == null && (e = o ? Sa : Mn(s));
    const i = e, a = I(i * i), c = I(a * i), h = I(n * a), f = I(r * c), l = I(s * i);
    if (o)
      return Z.ZERO;
    if (l !== ot)
      throw new Error("invZ was invalid");
    return new Z(h, f);
  }
}
tt.BASE = new tt(nt.Gx, nt.Gy, ot);
tt.ZERO = new tt(J, ot, J);
function Nr(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const _o = /* @__PURE__ */ new WeakMap();
class Z {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, _o.delete(this);
  }
  hasEvenY() {
    return this.y % Te === J;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = _t(n ? e : e.subarray(1));
    if (!ns(r))
      throw new Error("Point is not on curve");
    const s = Aa(r);
    let o = Zu(s);
    const i = (o & ot) === ot;
    n ? i && (o = I(-o)) : (e[0] & 1) === 1 !== i && (o = I(-o));
    const a = new Z(r, o);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = _t(e.subarray(1, Mt + 1)), r = _t(e.subarray(Mt + 1, Mt * 2 + 1)), s = new Z(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Xt(e), r = n.length, s = n[0];
    if (r === Mt)
      return this.fromCompressedHex(n);
    if (r === as && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === cs && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${as} compressed bytes or ${cs} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Z.BASE.multiply(nn(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: o } = Cl(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const i = li(Xt(e)), { n: a } = nt, c = r === 2 || r === 3 ? s + a : s, h = Mn(c, a), f = I(-i * h, a), l = I(o * h, a), b = r & 1 ? "03" : "02", d = Z.fromHex(b + Fe(c)), x = Z.BASE.multiplyAndAddUnsafe(d, f, l);
    if (!x)
      throw new Error("Cannot recover signature: point at infinify");
    return x.assertValidity(), x;
  }
  toRawBytes(e = !1) {
    return Me(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Fe(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Fe(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!ns(n) || !ns(r))
      throw new Error(e);
    const s = I(r * r), o = Aa(n);
    if (I(s - o) !== J)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new Z(this.x, I(-this.y));
  }
  double() {
    return tt.fromAffine(this).double().toAffine();
  }
  add(e) {
    return tt.fromAffine(this).add(tt.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return tt.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = tt.fromAffine(this), o = n === J || n === ot || this !== Z.BASE ? s.multiplyUnsafe(n) : s.multiply(n), i = tt.fromAffine(e).multiplyUnsafe(r), a = o.add(i);
    return a.equals(tt.ZERO) ? void 0 : a.toAffine();
  }
}
Z.BASE = new Z(nt.Gx, nt.Gy);
Z.ZERO = new Z(J, J);
function Ba(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function $a(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Ln(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: _t(n), left: t.subarray(e + 2) };
}
function Xu(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Ln(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = $a(t.subarray(2)), { data: r, left: s } = $a(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Ln(s)}`);
  return { r: e, s: r };
}
class oe {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? Ln(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new oe(ls(s.slice(0, 64)), ls(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Xu(n ? e : Me(e));
    return new oe(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Un(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Un(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = nt.n >> ot;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new oe(this.r, I(-this.s, nt.n)) : this;
  }
  toDERRawBytes() {
    return Me(this.toDERHex());
  }
  toDERHex() {
    const e = Ba(Zn(this.s)), n = Ba(Zn(this.r)), r = e.length / 2, s = n.length / 2, o = Zn(r), i = Zn(s);
    return `30${Zn(s + r + 4)}02${i}${n}02${o}${e}`;
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
    return Fe(this.r) + Fe(this.s);
  }
}
function Ne(...t) {
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
const Yu = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ln(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Yu[t[n]];
  return e;
}
const Ju = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Fe(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(J <= t && t < Ju))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function In(t) {
  const e = Me(Fe(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Zn(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function ls(t) {
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
    const r = n * 2, s = t.slice(r, r + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    e[n] = o;
  }
  return e;
}
function _t(t) {
  return ls(Ln(t));
}
function Xt(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Me(t);
}
function _a(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Un(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function I(t, e = nt.P) {
  const n = t % e;
  return n >= J ? n : e + n;
}
function Lt(t, e) {
  const { P: n } = nt;
  let r = t;
  for (; e-- > J; )
    r *= r, r %= n;
  return r;
}
function Zu(t) {
  const { P: e } = nt, n = BigInt(6), r = BigInt(11), s = BigInt(22), o = BigInt(23), i = BigInt(44), a = BigInt(88), c = t * t * t % e, h = c * c * t % e, f = Lt(h, tr) * h % e, l = Lt(f, tr) * h % e, b = Lt(l, Te) * c % e, d = Lt(b, r) * b % e, x = Lt(d, s) * d % e, w = Lt(x, i) * x % e, v = Lt(w, a) * w % e, H = Lt(v, i) * x % e, U = Lt(H, tr) * h % e, y = Lt(U, o) * d % e, $ = Lt(y, n) * c % e, A = Lt($, Te);
  if (A * A % e !== t)
    throw new Error("Cannot find square root");
  return A;
}
function Mn(t, e = nt.P) {
  if (t === J || e <= J)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = I(t, e), r = e, s = J, o = ot;
  for (; n !== J; ) {
    const a = r / n, c = r % n, h = s - o * a;
    r = n, n = c, s = o, o = h;
  }
  if (r !== ot)
    throw new Error("invert: does not exist");
  return I(s, e);
}
function Qu(t, e = nt.P) {
  const n = new Array(t.length), r = t.reduce((o, i, a) => i === J ? o : (n[a] = o, I(o * i, e)), ot), s = Mn(r, e);
  return t.reduceRight((o, i, a) => i === J ? o : (n[a] = I(o * n[a], e), I(o * i, e)), s), n;
}
function td(t) {
  const e = t.length * 8 - en * 8, n = _t(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function li(t, e = !1) {
  const n = td(t);
  if (e)
    return n;
  const { n: r } = nt;
  return n >= r ? n - r : n;
}
let _n, er;
class Ul {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return at.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return er(this.k, ...e);
  }
  checkSync() {
    if (typeof er != "function")
      throw new ci("hmacSha256Sync needs to be set");
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
    return Ne(...n);
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
    return Ne(...n);
  }
}
function Un(t) {
  return J < t && t < nt.n;
}
function ns(t) {
  return J < t && t < nt.P;
}
function Ol(t, e, n, r = !0) {
  const { n: s } = nt, o = li(t, !0);
  if (!Un(o))
    return;
  const i = Mn(o, s), a = Z.BASE.multiply(o), c = I(a.x, s);
  if (c === J)
    return;
  const h = I(i * I(e + n * c, s), s);
  if (h === J)
    return;
  let f = new oe(c, h), l = (a.x === f.r ? 0 : 2) | Number(a.y & ot);
  return r && f.hasHighS() && (f = f.normalizeS(), l ^= 1), { sig: f, recovery: l };
}
function nn(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * en)
      throw new Error("Expected 32 bytes of private key");
    e = ls(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== en)
      throw new Error("Expected 32 bytes of private key");
    e = _t(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Un(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function fi(t) {
  return t instanceof Z ? (t.assertValidity(), t) : Z.fromHex(t);
}
function Cl(t) {
  if (t instanceof oe)
    return t.assertValidity(), t;
  try {
    return oe.fromDER(t);
  } catch {
    return oe.fromCompact(t);
  }
}
function hi(t, e = !1) {
  return Z.fromPrivateKey(t).toRawBytes(e);
}
function ed(t, e, n, r = !1) {
  return Z.fromSignature(t, e, n).toRawBytes(r);
}
function Ha(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === as || r === cs : n ? r === as * 2 || r === cs * 2 : t instanceof Z;
}
function ui(t, e, n = !1) {
  if (Ha(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Ha(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = fi(e);
  return r.assertValidity(), r.multiply(nn(t)).toRawBytes(n);
}
function kl(t) {
  const e = t.length > Mt ? t.slice(0, Mt) : t;
  return _t(e);
}
function nd(t) {
  const e = kl(t), n = I(e, nt.n);
  return Pl(n < J ? e : n);
}
function Pl(t) {
  return In(t);
}
function Nl(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Xt(t), s = nn(e), o = [Pl(s), nd(r)];
  if (n != null) {
    n === !0 && (n = at.randomBytes(Mt));
    const c = Xt(n);
    if (c.length !== Mt)
      throw new Error(`sign: Expected ${Mt} bytes of extra data`);
    o.push(c);
  }
  const i = Ne(...o), a = kl(r);
  return { seed: i, m: a, d: s };
}
function Dl(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: o } = Object.assign({ canonical: !0, der: !0 }, e), i = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return o ? [i, r] : i;
}
async function rd(t, e, n = {}) {
  const { seed: r, m: s, d: o } = Nl(t, e, n.extraEntropy), i = new Ul(Il, en);
  await i.reseed(r);
  let a;
  for (; !(a = Ol(await i.generate(), s, o, n.canonical)); )
    await i.reseed();
  return Dl(a, n);
}
function Tl(t, e, n = {}) {
  const { seed: r, m: s, d: o } = Nl(t, e, n.extraEntropy), i = new Ul(Il, en);
  i.reseedSync(r);
  let a;
  for (; !(a = Ol(i.generateSync(), s, o, n.canonical)); )
    i.reseedSync();
  return Dl(a, n);
}
const sd = { strict: !0 };
function od(t, e, n, r = sd) {
  let s;
  try {
    s = Cl(t), e = Xt(e);
  } catch {
    return !1;
  }
  const { r: o, s: i } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = li(e);
  let c;
  try {
    c = fi(n);
  } catch {
    return !1;
  }
  const { n: h } = nt, f = Mn(i, h), l = I(a * f, h), b = I(o * f, h), d = Z.BASE.multiplyAndAddUnsafe(c, l, b);
  return d ? I(d.x, h) === o : !1;
}
function fs(t) {
  return I(_t(t), nt.n);
}
class On {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Xt(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = _t(n.subarray(0, 32)), s = _t(n.subarray(32, 64));
    return new On(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!ns(e) || !Un(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Fe(this.r) + Fe(this.s);
  }
  toRawBytes() {
    return Me(this.toHex());
  }
}
function id(t) {
  return Z.fromPrivateKey(t).toRawX();
}
class Fl {
  constructor(e, n, r = at.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Xt(e);
    const { x: s, scalar: o } = this.getScalar(nn(n));
    if (this.px = s, this.d = o, this.rand = Xt(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = Z.fromPrivateKey(e), r = n.hasEvenY() ? e : nt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return In(e ^ _t(n));
  }
  finalizeNonce(e) {
    const n = I(_t(e), nt.n);
    if (n === J)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: o } = this.getScalar(n);
    return { R: r, rx: s, k: o };
  }
  finalizeSig(e, n, r, s) {
    return new On(e.x, I(n + r * s, nt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, o = at.taggedHash, i = this.initNonce(n, await o(Pe.aux, s)), { R: a, rx: c, k: h } = this.finalizeNonce(await o(Pe.nonce, i, r, e)), f = fs(await o(Pe.challenge, c, r, e)), l = this.finalizeSig(a, h, f, n);
    return await Gl(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, o = at.taggedHashSync, i = this.initNonce(n, o(Pe.aux, s)), { R: a, rx: c, k: h } = this.finalizeNonce(o(Pe.nonce, i, r, e)), f = fs(o(Pe.challenge, c, r, e)), l = this.finalizeSig(a, h, f, n);
    return Vl(l, e, r) || this.error(), l;
  }
}
async function ad(t, e, n) {
  return new Fl(t, e, n).calc();
}
function cd(t, e, n) {
  return new Fl(t, e, n).calcSync();
}
function Ml(t, e, n) {
  const r = t instanceof On, s = r ? t : On.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Xt(e),
    P: fi(n)
  };
}
function Rl(t, e, n, r) {
  const s = Z.BASE.multiplyAndAddUnsafe(e, nn(n), I(-r, nt.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Gl(t, e, n) {
  try {
    const { r, s, m: o, P: i } = Ml(t, e, n), a = fs(await at.taggedHash(Pe.challenge, In(r), i.toRawX(), o));
    return Rl(r, i, s, a);
  } catch {
    return !1;
  }
}
function Vl(t, e, n) {
  try {
    const { r, s, m: o, P: i } = Ml(t, e, n), a = fs(at.taggedHashSync(Pe.challenge, In(r), i.toRawX(), o));
    return Rl(r, i, s, a);
  } catch (r) {
    if (r instanceof ci)
      throw r;
    return !1;
  }
}
const ld = {
  Signature: On,
  getPublicKey: id,
  sign: ad,
  verify: Gl,
  signSync: cd,
  verifySync: Vl
};
Z.BASE._setWindowSize(8);
const vt = {
  node: Ll,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Pe = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Dr = {}, at = {
  bytesToHex: Ln,
  hexToBytes: Me,
  concatBytes: Ne,
  mod: I,
  invert: Mn,
  isValidPrivateKey(t) {
    try {
      return nn(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: In,
  _normalizePrivateKey: nn,
  hashToPrivateKey: (t) => {
    t = Xt(t);
    const e = en + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = I(_t(t), nt.n - ot) + ot;
    return In(n);
  },
  randomBytes: (t = 32) => {
    if (vt.web)
      return vt.web.getRandomValues(new Uint8Array(t));
    if (vt.node) {
      const { randomBytes: e } = vt.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => at.hashToPrivateKey(at.randomBytes(en + 8)),
  precompute(t = 8, e = Z.BASE) {
    const n = e === Z.BASE ? e : new Z(e.x, e.y);
    return n._setWindowSize(t), n.multiply(tr), n;
  },
  sha256: async (...t) => {
    if (vt.web) {
      const e = await vt.web.subtle.digest("SHA-256", Ne(...t));
      return new Uint8Array(e);
    } else if (vt.node) {
      const { createHash: e } = vt.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (vt.web) {
      const n = await vt.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Ne(...e), s = await vt.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (vt.node) {
      const { createHmac: n } = vt.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = Dr[t];
    if (n === void 0) {
      const r = await at.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Ne(r, r), Dr[t] = n;
    }
    return at.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof _n != "function")
      throw new ci("sha256Sync is undefined, you need to set it");
    let n = Dr[t];
    if (n === void 0) {
      const r = _n(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Ne(r, r), Dr[t] = n;
    }
    return _n(n, ...e);
  },
  _JacobianPoint: tt
};
Object.defineProperties(at, {
  sha256Sync: {
    configurable: !1,
    get() {
      return _n;
    },
    set(t) {
      _n || (_n = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return er;
    },
    set(t) {
      er || (er = t);
    }
  }
});
const fd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: nt,
  Point: Z,
  Signature: oe,
  getPublicKey: hi,
  getSharedSecret: ui,
  recoverPublicKey: ed,
  schnorr: ld,
  sign: rd,
  signSync: Tl,
  utils: at,
  verify: od
}, Symbol.toStringTag, { value: "Module" }));
var gt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function hd(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function ur(t) {
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
var Rn = {}, di = {};
const Sn = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Kl(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Ho(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Ge(t, ...e) {
  if (!Kl(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function zl(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Ho(t.outputLen), Ho(t.blockLen);
}
function or(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function jl(t, e) {
  Ge(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function ud(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function dd(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function ir(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function rs(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Pt(t, e) {
  return t << 32 - e | t >>> e;
}
function pd(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const pi = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function bi(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const ql = pi ? (t) => t : (t) => bi(t), bd = ql;
function Wl(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = bi(t[e]);
  return t;
}
const gd = pi ? (t) => t : Wl, Xl = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", xd = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function wd(t) {
  if (Ge(t), Xl)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += xd[t[n]];
  return e;
}
const ee = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function La(t) {
  if (t >= ee._0 && t <= ee._9)
    return t - ee._0;
  if (t >= ee.A && t <= ee.F)
    return t - (ee.A - 10);
  if (t >= ee.a && t <= ee.f)
    return t - (ee.a - 10);
}
function yd(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (Xl)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, o = 0; s < n; s++, o += 2) {
    const i = La(t.charCodeAt(o)), a = La(t.charCodeAt(o + 1));
    if (i === void 0 || a === void 0) {
      const c = t[o] + t[o + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + o);
    }
    r[s] = i * 16 + a;
  }
  return r;
}
const Yl = async () => {
};
async function md(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const o = Date.now() - r;
    o >= 0 && o < e || (await Yl(), r += o);
  }
}
function gi(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function Sd(t) {
  return new TextDecoder().decode(t);
}
function Gn(t) {
  return typeof t == "string" && (t = gi(t)), Ge(t), t;
}
function Ed(t) {
  return typeof t == "string" && (t = gi(t)), Ge(t), t;
}
function Ad(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    Ge(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const o = t[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function vd(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let xi = class {
};
function $s(t) {
  const e = (r) => t().update(Gn(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Jl(t) {
  const e = (r, s) => t(s).update(Gn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function Zl(t) {
  const e = (r, s) => t(s).update(Gn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const Bd = $s, $d = Jl, _d = Zl;
function Hd(t = 32) {
  if (Sn && typeof Sn.getRandomValues == "function")
    return Sn.getRandomValues(new Uint8Array(t));
  if (Sn && typeof Sn.randomBytes == "function")
    return Uint8Array.from(Sn.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const Ld = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: xi,
  abytes: Ge,
  aexists: or,
  ahash: zl,
  anumber: Ho,
  aoutput: jl,
  asyncLoop: md,
  byteSwap: bi,
  byteSwap32: Wl,
  byteSwapIfBE: bd,
  bytesToHex: wd,
  bytesToUtf8: Sd,
  checkOpts: vd,
  clean: ir,
  concatBytes: Ad,
  createHasher: $s,
  createOptHasher: Jl,
  createView: rs,
  createXOFer: Zl,
  hexToBytes: yd,
  isBytes: Kl,
  isLE: pi,
  kdfInputToBytes: Ed,
  nextTick: Yl,
  randomBytes: Hd,
  rotl: pd,
  rotr: Pt,
  swap32IfBE: gd,
  swap8IfBE: ql,
  toBytes: Gn,
  u32: dd,
  u8: ud,
  utf8ToBytes: gi,
  wrapConstructor: Bd,
  wrapConstructorWithOpts: $d,
  wrapXOFConstructorWithOpts: _d
}, Symbol.toStringTag, { value: "Module" })), dr = /* @__PURE__ */ ur(Ld);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = dr;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(i, a) {
    if (!i.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    i.length % 2 !== 0 && (i = `0${i}`), i = i.toLowerCase();
    let c = [], h = 0;
    for (let d = i.length - 1; d >= 0; d--)
      if (h < 4) {
        const x = n.indexOf(i[d]) >> h;
        let w = 0;
        d !== 0 && (w = n.indexOf(i[d - 1]));
        const v = 1 + h, H = w % (1 << v) << 5 - v, U = t.c32[x + H];
        h = v, c.unshift(U);
      } else
        h = 0;
    let f = 0;
    for (let d = 0; d < c.length && c[d] === "0"; d++)
      f++;
    c = c.slice(f);
    const l = new TextDecoder().decode((0, e.hexToBytes)(i)).match(/^\u0000*/), b = l ? l[0].length : 0;
    for (let d = 0; d < b; d++)
      c.unshift(t.c32[0]);
    if (a) {
      const d = a - c.length;
      for (let x = 0; x < d; x++)
        c.unshift(t.c32[0]);
    }
    return c.join("");
  }
  t.c32encode = r;
  function s(i) {
    return i.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  t.c32normalize = s;
  function o(i, a) {
    if (i = s(i), !i.match(`^[${t.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const c = i.match(`^${t.c32[0]}*`), h = c ? c[0].length : 0;
    let f = [], l = 0, b = 0;
    for (let w = i.length - 1; w >= 0; w--) {
      b === 4 && (f.unshift(n[l]), b = 0, l = 0);
      const H = (t.c32.indexOf(i[w]) << b) + l, U = n[H % 16];
      if (b += 1, l = H >> 4, l > 1 << b)
        throw new Error("Panic error in decoding.");
      f.unshift(U);
    }
    f.unshift(n[l]), f.length % 2 === 1 && f.unshift("0");
    let d = 0;
    for (let w = 0; w < f.length && f[w] === "0"; w++)
      d++;
    f = f.slice(d - d % 2);
    let x = f.join("");
    for (let w = 0; w < h; w++)
      x = `00${x}`;
    if (a) {
      const w = a * 2 - x.length;
      for (let v = 0; v < w; v += 2)
        x = `00${x}`;
    }
    return x;
  }
  t.c32decode = o;
})(di);
var rn = {};
function Id(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, h = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + h, a, r);
}
function Ud(t, e, n) {
  return t & e ^ ~t & n;
}
function Od(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class Cd extends xi {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = rs(this.buffer);
  }
  update(e) {
    or(this), e = Gn(e), Ge(e);
    const { view: n, buffer: r, blockLen: s } = this, o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = rs(e);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    or(this), jl(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, ir(this.buffer.subarray(i)), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let l = i; l < s; l++)
      n[l] = 0;
    Id(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = rs(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const h = c / 4, f = this.get();
    if (h > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < h; l++)
      a.setUint32(4 * l, f[l], o);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return e.destroyed = i, e.finished = o, e.length = s, e.pos = a, s % n && e.buffer.set(r), e;
  }
  clone() {
    return this._cloneInto();
  }
}
const pe = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), be = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), kd = /* @__PURE__ */ Uint32Array.from([
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
]), ge = /* @__PURE__ */ new Uint32Array(64);
let wi = class extends Cd {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = pe[0] | 0, this.B = pe[1] | 0, this.C = pe[2] | 0, this.D = pe[3] | 0, this.E = pe[4] | 0, this.F = pe[5] | 0, this.G = pe[6] | 0, this.H = pe[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [e, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      ge[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = ge[l - 15], d = ge[l - 2], x = Pt(b, 7) ^ Pt(b, 18) ^ b >>> 3, w = Pt(d, 17) ^ Pt(d, 19) ^ d >>> 10;
      ge[l] = w + ge[l - 7] + x + ge[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: h, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const b = Pt(a, 6) ^ Pt(a, 11) ^ Pt(a, 25), d = f + b + Ud(a, c, h) + kd[l] + ge[l] | 0, w = (Pt(r, 2) ^ Pt(r, 13) ^ Pt(r, 22)) + Od(r, s, o) | 0;
      f = h, h = c, c = a, a = i + d | 0, i = o, o = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, h = h + this.G | 0, f = f + this.H | 0, this.set(r, s, o, i, a, c, h, f);
  }
  roundClean() {
    ir(ge);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), ir(this.buffer);
  }
}, Ql = class extends wi {
  constructor() {
    super(28), this.A = be[0] | 0, this.B = be[1] | 0, this.C = be[2] | 0, this.D = be[3] | 0, this.E = be[4] | 0, this.F = be[5] | 0, this.G = be[6] | 0, this.H = be[7] | 0;
  }
};
const Pd = /* @__PURE__ */ $s(() => new wi()), Nd = /* @__PURE__ */ $s(() => new Ql()), Dd = wi, Td = Pd, Fd = Ql, Md = Nd, Rd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: Fd,
  SHA256: Dd,
  sha224: Md,
  sha256: Td
}, Symbol.toStringTag, { value: "Module" })), _s = /* @__PURE__ */ ur(Rd);
Object.defineProperty(rn, "__esModule", { value: !0 });
rn.c32checkDecode = rn.c32checkEncode = void 0;
const Ia = _s, Ua = dr, nr = di;
function tf(t) {
  const e = (0, Ia.sha256)((0, Ia.sha256)((0, Ua.hexToBytes)(t)));
  return (0, Ua.bytesToHex)(e.slice(0, 4));
}
function Gd(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = tf(`${n}${e}`), s = (0, nr.c32encode)(`${e}${r}`);
  return `${nr.c32[t]}${s}`;
}
rn.c32checkEncode = Gd;
function Vd(t) {
  t = (0, nr.c32normalize)(t);
  const e = (0, nr.c32decode)(t.slice(1)), n = t[0], r = nr.c32.indexOf(n), s = e.slice(-8);
  let o = r.toString(16);
  if (o.length === 1 && (o = `0${o}`), tf(`${o}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
rn.c32checkDecode = Vd;
var ef = {}, Cn = {};
function Kd(t) {
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
  var i = t.length, a = t.charAt(0), c = Math.log(i) / Math.log(256), h = Math.log(256) / Math.log(i);
  function f(d) {
    if (d instanceof Uint8Array || (ArrayBuffer.isView(d) ? d = new Uint8Array(d.buffer, d.byteOffset, d.byteLength) : Array.isArray(d) && (d = Uint8Array.from(d))), !(d instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (d.length === 0)
      return "";
    for (var x = 0, w = 0, v = 0, H = d.length; v !== H && d[v] === 0; )
      v++, x++;
    for (var U = (H - v) * h + 1 >>> 0, y = new Uint8Array(U); v !== H; ) {
      for (var $ = d[v], A = 0, P = U - 1; ($ !== 0 || A < w) && P !== -1; P--, A++)
        $ += 256 * y[P] >>> 0, y[P] = $ % i >>> 0, $ = $ / i >>> 0;
      if ($ !== 0)
        throw new Error("Non-zero carry");
      w = A, v++;
    }
    for (var F = U - w; F !== U && y[F] === 0; )
      F++;
    for (var O = a.repeat(x); F < U; ++F)
      O += t.charAt(y[F]);
    return O;
  }
  function l(d) {
    if (typeof d != "string")
      throw new TypeError("Expected String");
    if (d.length === 0)
      return new Uint8Array();
    for (var x = 0, w = 0, v = 0; d[x] === a; )
      w++, x++;
    for (var H = (d.length - x) * c + 1 >>> 0, U = new Uint8Array(H); d[x]; ) {
      var y = d.charCodeAt(x);
      if (y > 255)
        return;
      var $ = e[y];
      if ($ === 255)
        return;
      for (var A = 0, P = H - 1; ($ !== 0 || A < v) && P !== -1; P--, A++)
        $ += i * U[P] >>> 0, U[P] = $ % 256 >>> 0, $ = $ / 256 >>> 0;
      if ($ !== 0)
        throw new Error("Non-zero carry");
      v = A, x++;
    }
    for (var F = H - v; F !== H && U[F] === 0; )
      F++;
    for (var O = new Uint8Array(w + (H - F)), C = w; F !== H; )
      O[C++] = U[F++];
    return O;
  }
  function b(d) {
    var x = l(d);
    if (x)
      return x;
    throw new Error("Non-base" + i + " character");
  }
  return {
    encode: f,
    decodeUnsafe: l,
    decode: b
  };
}
var nf = Kd;
Object.defineProperty(Cn, "__esModule", { value: !0 });
Cn.decode = Cn.encode = void 0;
const hs = _s, Oa = dr, rf = nf, sf = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function zd(t, e = "00") {
  const n = typeof t == "string" ? (0, Oa.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Oa.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, hs.sha256)((0, hs.sha256)(new Uint8Array([...r, ...n])));
  return rf(sf).encode([...r, ...n, ...s.slice(0, 4)]);
}
Cn.encode = zd;
function jd(t) {
  const e = rf(sf).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, hs.sha256)((0, hs.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((o, i) => {
    if (o !== s[i])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Cn.decode = jd;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = rn, n = Cn, r = dr;
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
  function i(f, l) {
    if (!l.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, e.c32checkEncode)(f, l)}`;
  }
  t.c32address = i;
  function a(f) {
    if (f.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (f[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, e.c32checkDecode)(f.slice(1));
  }
  t.c32addressDecode = a;
  function c(f, l = -1) {
    const b = n.decode(f), d = (0, r.bytesToHex)(b.data), x = parseInt((0, r.bytesToHex)(b.prefix), 16);
    let w;
    return l < 0 ? (w = x, s[x] !== void 0 && (w = s[x])) : w = l, i(w, d);
  }
  t.b58ToC32 = c;
  function h(f, l = -1) {
    const b = a(f), d = b[0], x = b[1];
    let w;
    l < 0 ? (w = d, o[d] !== void 0 && (w = o[d])) : w = l;
    let v = w.toString(16);
    return v.length === 1 && (v = `0${v}`), n.encode(x, v);
  }
  t.c32ToB58 = h;
})(ef);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = di;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = rn;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = ef;
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
})(Rn);
var us = { exports: {} };
us.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, o = "[object Arguments]", i = "[object Array]", a = "[object Boolean]", c = "[object Date]", h = "[object Error]", f = "[object Function]", l = "[object GeneratorFunction]", b = "[object Map]", d = "[object Number]", x = "[object Object]", w = "[object Promise]", v = "[object RegExp]", H = "[object Set]", U = "[object String]", y = "[object Symbol]", $ = "[object WeakMap]", A = "[object ArrayBuffer]", P = "[object DataView]", F = "[object Float32Array]", O = "[object Float64Array]", C = "[object Int8Array]", g = "[object Int16Array]", E = "[object Int32Array]", L = "[object Uint8Array]", k = "[object Uint8ClampedArray]", M = "[object Uint16Array]", N = "[object Uint32Array]", ht = /[\\^$.*+?()[\]{}|]/g, et = /\w*$/, Ve = /^\[object .+?Constructor\]$/, rt = /^(?:0|[1-9]\d*)$/, R = {};
  R[o] = R[i] = R[A] = R[P] = R[a] = R[c] = R[F] = R[O] = R[C] = R[g] = R[E] = R[b] = R[d] = R[x] = R[v] = R[H] = R[U] = R[y] = R[L] = R[k] = R[M] = R[N] = !0, R[h] = R[f] = R[$] = !1;
  var wr = typeof gt == "object" && gt && gt.Object === Object && gt, jn = typeof self == "object" && self && self.Object === Object && self, wt = wr || jn || Function("return this")(), Ke = e && !e.nodeType && e, St = Ke && !0 && t && !t.nodeType && t, Ht = St && St.exports === Ke;
  function Rs(u, m) {
    return u.set(m[0], m[1]), u;
  }
  function Gs(u, m) {
    return u.add(m), u;
  }
  function pn(u, m) {
    for (var B = -1, D = u ? u.length : 0; ++B < D && m(u[B], B, u) !== !1; )
      ;
    return u;
  }
  function Vs(u, m) {
    for (var B = -1, D = m.length, dt = u.length; ++B < D; )
      u[dt + B] = m[B];
    return u;
  }
  function yr(u, m, B, D) {
    for (var dt = -1, yt = u ? u.length : 0; ++dt < yt; )
      B = m(B, u[dt], dt, u);
    return B;
  }
  function mr(u, m) {
    for (var B = -1, D = Array(u); ++B < u; )
      D[B] = m(B);
    return D;
  }
  function Ks(u, m) {
    return u == null ? void 0 : u[m];
  }
  function qn(u) {
    var m = !1;
    if (u != null && typeof u.toString != "function")
      try {
        m = !!(u + "");
      } catch {
      }
    return m;
  }
  function bn(u) {
    var m = -1, B = Array(u.size);
    return u.forEach(function(D, dt) {
      B[++m] = [dt, D];
    }), B;
  }
  function Wn(u, m) {
    return function(B) {
      return u(m(B));
    };
  }
  function Xn(u) {
    var m = -1, B = Array(u.size);
    return u.forEach(function(D) {
      B[++m] = D;
    }), B;
  }
  var zs = Array.prototype, js = Function.prototype, Q = Object.prototype, ze = wt["__core-js_shared__"], pt = function() {
    var u = /[^.]+$/.exec(ze && ze.keys && ze.keys.IE_PROTO || "");
    return u ? "Symbol(src)_1." + u : "";
  }(), Yn = js.toString, Ot = Q.hasOwnProperty, je = Q.toString, qs = RegExp(
    "^" + Yn.call(Ot).replace(ht, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), qe = Ht ? wt.Buffer : void 0, Sr = wt.Symbol, Jn = wt.Uint8Array, Ws = Wn(Object.getPrototypeOf, Object), Er = Object.create, Ar = Q.propertyIsEnumerable, vr = zs.splice, Br = Object.getOwnPropertySymbols, $r = qe ? qe.isBuffer : void 0, Xs = Wn(Object.keys, Object), S = wn(wt, "DataView"), T = wn(wt, "Map"), X = wn(wt, "Promise"), W = wn(wt, "Set"), ct = wn(wt, "WeakMap"), ut = wn(Object, "create"), Et = Ye(S), At = Ye(T), le = Ye(X), Ct = Ye(W), qi = Ye(ct), Wi = Sr ? Sr.prototype : void 0, Xi = Wi ? Wi.valueOf : void 0;
  function We(u) {
    var m = -1, B = u ? u.length : 0;
    for (this.clear(); ++m < B; ) {
      var D = u[m];
      this.set(D[0], D[1]);
    }
  }
  function qh() {
    this.__data__ = ut ? ut(null) : {};
  }
  function Wh(u) {
    return this.has(u) && delete this.__data__[u];
  }
  function Xh(u) {
    var m = this.__data__;
    if (ut) {
      var B = m[u];
      return B === r ? void 0 : B;
    }
    return Ot.call(m, u) ? m[u] : void 0;
  }
  function Yh(u) {
    var m = this.__data__;
    return ut ? m[u] !== void 0 : Ot.call(m, u);
  }
  function Jh(u, m) {
    var B = this.__data__;
    return B[u] = ut && m === void 0 ? r : m, this;
  }
  We.prototype.clear = qh, We.prototype.delete = Wh, We.prototype.get = Xh, We.prototype.has = Yh, We.prototype.set = Jh;
  function Qt(u) {
    var m = -1, B = u ? u.length : 0;
    for (this.clear(); ++m < B; ) {
      var D = u[m];
      this.set(D[0], D[1]);
    }
  }
  function Zh() {
    this.__data__ = [];
  }
  function Qh(u) {
    var m = this.__data__, B = _r(m, u);
    if (B < 0)
      return !1;
    var D = m.length - 1;
    return B == D ? m.pop() : vr.call(m, B, 1), !0;
  }
  function t0(u) {
    var m = this.__data__, B = _r(m, u);
    return B < 0 ? void 0 : m[B][1];
  }
  function e0(u) {
    return _r(this.__data__, u) > -1;
  }
  function n0(u, m) {
    var B = this.__data__, D = _r(B, u);
    return D < 0 ? B.push([u, m]) : B[D][1] = m, this;
  }
  Qt.prototype.clear = Zh, Qt.prototype.delete = Qh, Qt.prototype.get = t0, Qt.prototype.has = e0, Qt.prototype.set = n0;
  function gn(u) {
    var m = -1, B = u ? u.length : 0;
    for (this.clear(); ++m < B; ) {
      var D = u[m];
      this.set(D[0], D[1]);
    }
  }
  function r0() {
    this.__data__ = {
      hash: new We(),
      map: new (T || Qt)(),
      string: new We()
    };
  }
  function s0(u) {
    return Hr(this, u).delete(u);
  }
  function o0(u) {
    return Hr(this, u).get(u);
  }
  function i0(u) {
    return Hr(this, u).has(u);
  }
  function a0(u, m) {
    return Hr(this, u).set(u, m), this;
  }
  gn.prototype.clear = r0, gn.prototype.delete = s0, gn.prototype.get = o0, gn.prototype.has = i0, gn.prototype.set = a0;
  function xn(u) {
    this.__data__ = new Qt(u);
  }
  function c0() {
    this.__data__ = new Qt();
  }
  function l0(u) {
    return this.__data__.delete(u);
  }
  function f0(u) {
    return this.__data__.get(u);
  }
  function h0(u) {
    return this.__data__.has(u);
  }
  function u0(u, m) {
    var B = this.__data__;
    if (B instanceof Qt) {
      var D = B.__data__;
      if (!T || D.length < n - 1)
        return D.push([u, m]), this;
      B = this.__data__ = new gn(D);
    }
    return B.set(u, m), this;
  }
  xn.prototype.clear = c0, xn.prototype.delete = l0, xn.prototype.get = f0, xn.prototype.has = h0, xn.prototype.set = u0;
  function d0(u, m) {
    var B = Zs(u) || D0(u) ? mr(u.length, String) : [], D = B.length, dt = !!D;
    for (var yt in u)
      Ot.call(u, yt) && !(dt && (yt == "length" || C0(yt, D))) && B.push(yt);
    return B;
  }
  function Yi(u, m, B) {
    var D = u[m];
    (!(Ot.call(u, m) && ta(D, B)) || B === void 0 && !(m in u)) && (u[m] = B);
  }
  function _r(u, m) {
    for (var B = u.length; B--; )
      if (ta(u[B][0], m))
        return B;
    return -1;
  }
  function p0(u, m) {
    return u && Ji(m, Qs(m), u);
  }
  function Ys(u, m, B, D, dt, yt, te) {
    var mt;
    if (D && (mt = yt ? D(u, dt, yt, te) : D(u)), mt !== void 0)
      return mt;
    if (!Lr(u))
      return u;
    var ra = Zs(u);
    if (ra) {
      if (mt = I0(u), !m)
        return _0(u, mt);
    } else {
      var yn = Xe(u), sa = yn == f || yn == l;
      if (F0(u))
        return m0(u, m);
      if (yn == x || yn == o || sa && !yt) {
        if (qn(u))
          return yt ? u : {};
        if (mt = U0(sa ? {} : u), !m)
          return H0(u, p0(mt, u));
      } else {
        if (!R[yn])
          return yt ? u : {};
        mt = O0(u, yn, Ys, m);
      }
    }
    te || (te = new xn());
    var oa = te.get(u);
    if (oa)
      return oa;
    if (te.set(u, mt), !ra)
      var ia = B ? L0(u) : Qs(u);
    return pn(ia || u, function(to, Ir) {
      ia && (Ir = to, to = u[Ir]), Yi(mt, Ir, Ys(to, m, B, D, Ir, u, te));
    }), mt;
  }
  function b0(u) {
    return Lr(u) ? Er(u) : {};
  }
  function g0(u, m, B) {
    var D = m(u);
    return Zs(u) ? D : Vs(D, B(u));
  }
  function x0(u) {
    return je.call(u);
  }
  function w0(u) {
    if (!Lr(u) || P0(u))
      return !1;
    var m = na(u) || qn(u) ? qs : Ve;
    return m.test(Ye(u));
  }
  function y0(u) {
    if (!Qi(u))
      return Xs(u);
    var m = [];
    for (var B in Object(u))
      Ot.call(u, B) && B != "constructor" && m.push(B);
    return m;
  }
  function m0(u, m) {
    if (m)
      return u.slice();
    var B = new u.constructor(u.length);
    return u.copy(B), B;
  }
  function Js(u) {
    var m = new u.constructor(u.byteLength);
    return new Jn(m).set(new Jn(u)), m;
  }
  function S0(u, m) {
    var B = m ? Js(u.buffer) : u.buffer;
    return new u.constructor(B, u.byteOffset, u.byteLength);
  }
  function E0(u, m, B) {
    var D = m ? B(bn(u), !0) : bn(u);
    return yr(D, Rs, new u.constructor());
  }
  function A0(u) {
    var m = new u.constructor(u.source, et.exec(u));
    return m.lastIndex = u.lastIndex, m;
  }
  function v0(u, m, B) {
    var D = m ? B(Xn(u), !0) : Xn(u);
    return yr(D, Gs, new u.constructor());
  }
  function B0(u) {
    return Xi ? Object(Xi.call(u)) : {};
  }
  function $0(u, m) {
    var B = m ? Js(u.buffer) : u.buffer;
    return new u.constructor(B, u.byteOffset, u.length);
  }
  function _0(u, m) {
    var B = -1, D = u.length;
    for (m || (m = Array(D)); ++B < D; )
      m[B] = u[B];
    return m;
  }
  function Ji(u, m, B, D) {
    B || (B = {});
    for (var dt = -1, yt = m.length; ++dt < yt; ) {
      var te = m[dt], mt = void 0;
      Yi(B, te, mt === void 0 ? u[te] : mt);
    }
    return B;
  }
  function H0(u, m) {
    return Ji(u, Zi(u), m);
  }
  function L0(u) {
    return g0(u, Qs, Zi);
  }
  function Hr(u, m) {
    var B = u.__data__;
    return k0(m) ? B[typeof m == "string" ? "string" : "hash"] : B.map;
  }
  function wn(u, m) {
    var B = Ks(u, m);
    return w0(B) ? B : void 0;
  }
  var Zi = Br ? Wn(Br, Object) : G0, Xe = x0;
  (S && Xe(new S(new ArrayBuffer(1))) != P || T && Xe(new T()) != b || X && Xe(X.resolve()) != w || W && Xe(new W()) != H || ct && Xe(new ct()) != $) && (Xe = function(u) {
    var m = je.call(u), B = m == x ? u.constructor : void 0, D = B ? Ye(B) : void 0;
    if (D)
      switch (D) {
        case Et:
          return P;
        case At:
          return b;
        case le:
          return w;
        case Ct:
          return H;
        case qi:
          return $;
      }
    return m;
  });
  function I0(u) {
    var m = u.length, B = u.constructor(m);
    return m && typeof u[0] == "string" && Ot.call(u, "index") && (B.index = u.index, B.input = u.input), B;
  }
  function U0(u) {
    return typeof u.constructor == "function" && !Qi(u) ? b0(Ws(u)) : {};
  }
  function O0(u, m, B, D) {
    var dt = u.constructor;
    switch (m) {
      case A:
        return Js(u);
      case a:
      case c:
        return new dt(+u);
      case P:
        return S0(u, D);
      case F:
      case O:
      case C:
      case g:
      case E:
      case L:
      case k:
      case M:
      case N:
        return $0(u, D);
      case b:
        return E0(u, D, B);
      case d:
      case U:
        return new dt(u);
      case v:
        return A0(u);
      case H:
        return v0(u, D, B);
      case y:
        return B0(u);
    }
  }
  function C0(u, m) {
    return m = m ?? s, !!m && (typeof u == "number" || rt.test(u)) && u > -1 && u % 1 == 0 && u < m;
  }
  function k0(u) {
    var m = typeof u;
    return m == "string" || m == "number" || m == "symbol" || m == "boolean" ? u !== "__proto__" : u === null;
  }
  function P0(u) {
    return !!pt && pt in u;
  }
  function Qi(u) {
    var m = u && u.constructor, B = typeof m == "function" && m.prototype || Q;
    return u === B;
  }
  function Ye(u) {
    if (u != null) {
      try {
        return Yn.call(u);
      } catch {
      }
      try {
        return u + "";
      } catch {
      }
    }
    return "";
  }
  function N0(u) {
    return Ys(u, !0, !0);
  }
  function ta(u, m) {
    return u === m || u !== u && m !== m;
  }
  function D0(u) {
    return T0(u) && Ot.call(u, "callee") && (!Ar.call(u, "callee") || je.call(u) == o);
  }
  var Zs = Array.isArray;
  function ea(u) {
    return u != null && M0(u.length) && !na(u);
  }
  function T0(u) {
    return R0(u) && ea(u);
  }
  var F0 = $r || V0;
  function na(u) {
    var m = Lr(u) ? je.call(u) : "";
    return m == f || m == l;
  }
  function M0(u) {
    return typeof u == "number" && u > -1 && u % 1 == 0 && u <= s;
  }
  function Lr(u) {
    var m = typeof u;
    return !!u && (m == "object" || m == "function");
  }
  function R0(u) {
    return !!u && typeof u == "object";
  }
  function Qs(u) {
    return ea(u) ? d0(u) : y0(u);
  }
  function G0() {
    return [];
  }
  function V0() {
    return !1;
  }
  t.exports = N0;
})(us, us.exports);
us.exports;
function Lo(t) {
  return Rn.c32address(t.version, t.hash160);
}
function yi(t, e, n) {
  const r = e || 1, s = n || eu;
  if (Ap(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: sr.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function mi(t) {
  const e = Rn.c32addressDecode(t);
  return {
    type: sr.Address,
    version: e[0],
    hash160: e[1]
  };
}
var _;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(_ || (_ = {}));
function qd(t) {
  if (t.type === _.PrincipalStandard)
    return Lo(t.address);
  if (t.type === _.PrincipalContract)
    return `${Lo(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function Wd(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Jd(e, n);
  } else
    return Xd(t);
}
function Xd(t) {
  const e = mi(t);
  return { type: _.PrincipalStandard, address: e };
}
function Yd(t) {
  return { type: _.PrincipalStandard, address: t };
}
function Jd(t, e) {
  const n = mi(t), r = yi(e);
  return of(n, r);
}
function of(t, e) {
  if (hr(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: _.PrincipalContract, address: t, contractName: e };
}
function so(t, e = !1) {
  switch (t.type) {
    case _.BoolTrue:
      return !0;
    case _.BoolFalse:
      return !1;
    case _.Int:
    case _.UInt:
      return e ? t.value.toString() : t.value;
    case _.Buffer:
      return `0x${ie(t.buffer)}`;
    case _.OptionalNone:
      return null;
    case _.OptionalSome:
      return vn(t.value);
    case _.ResponseErr:
      return vn(t.value);
    case _.ResponseOk:
      return vn(t.value);
    case _.PrincipalStandard:
    case _.PrincipalContract:
      return qd(t);
    case _.List:
      return t.list.map((r) => vn(r));
    case _.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = vn(t.data[r]);
      }), n;
    case _.StringASCII:
      return t.data;
    case _.StringUTF8:
      return t.data;
  }
}
function vn(t) {
  switch (t.type) {
    case _.ResponseErr:
      return { type: De(t), value: so(t, !0), success: !1 };
    case _.ResponseOk:
      return { type: De(t), value: so(t, !0), success: !0 };
    default:
      return { type: De(t), value: so(t, !0) };
  }
}
function De(t) {
  switch (t.type) {
    case _.BoolTrue:
    case _.BoolFalse:
      return "bool";
    case _.Int:
      return "int";
    case _.UInt:
      return "uint";
    case _.Buffer:
      return `(buff ${t.buffer.length})`;
    case _.OptionalNone:
      return "(optional none)";
    case _.OptionalSome:
      return `(optional ${De(t.value)})`;
    case _.ResponseErr:
      return `(response UnknownType ${De(t.value)})`;
    case _.ResponseOk:
      return `(response ${De(t.value)} UnknownType)`;
    case _.PrincipalStandard:
    case _.PrincipalContract:
      return "principal";
    case _.List:
      return `(list ${t.list.length} ${t.list.length ? De(t.list[0]) : "UnknownType"})`;
    case _.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${De(t.data[e])})`).join(" ")})`;
    case _.StringASCII:
      return `(string-ascii ${Sl(t.data).length})`;
    case _.StringUTF8:
      return `(string-utf8 ${hr(t.data).length})`;
  }
}
const Zd = () => ({ type: _.BoolTrue }), Qd = () => ({ type: _.BoolFalse }), Ca = BigInt("0xffffffffffffffffffffffffffffffff"), tp = BigInt(0), ka = BigInt("0x7fffffffffffffffffffffffffffffff"), Pa = BigInt("-170141183460469231731687303715884105728"), ep = (t) => {
  const e = ni(t, !0);
  if (e > ka)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${ka}`);
  if (e < Pa)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Pa}`);
  return { type: _.Int, value: e };
}, af = (t) => {
  const e = ni(t, !1);
  if (e < tp)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Ca)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Ca}`);
  return { type: _.UInt, value: e };
}, np = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: _.Buffer, buffer: t };
};
function rp() {
  return { type: _.OptionalNone };
}
function sp(t) {
  return { type: _.OptionalSome, value: t };
}
function op(t) {
  return { type: _.ResponseErr, value: t };
}
function ip(t) {
  return { type: _.ResponseOk, value: t };
}
function ap(t) {
  return { type: _.List, list: t };
}
function cf(t) {
  for (const e in t)
    if (!vp(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: _.Tuple, data: t };
}
const ss = (t) => ({ type: _.StringASCII, data: t }), cp = (t) => ({ type: _.StringUTF8, data: t });
let lf = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, lp = class extends lf {
  constructor(e) {
    super(e);
  }
};
class oo extends lf {
  constructor(e) {
    super(e);
  }
}
function ff(t) {
  const e = [];
  return e.push(Hn(ri(t.version, 1))), e.push(Hn(t.hash160)), Fn(e);
}
function Na(t) {
  const e = wl(ie(t.readBytes(1))), n = ie(t.readBytes(20));
  return { type: sr.Address, version: e, hash160: n };
}
function hf(t) {
  const e = [], n = hr(t.content), r = n.byteLength;
  return e.push(Hn(ri(r, t.lengthPrefixBytes))), e.push(n), Fn(e);
}
function Da(t, e, n) {
  e = e || 1;
  const r = wl(ie(t.readBytes(e))), s = ml(t.readBytes(r));
  return yi(s, e, 128);
}
function Yt(t, e) {
  return Fn([t, e]);
}
function fp(t) {
  return new Uint8Array([t.type]);
}
function hp(t) {
  return t.type === _.OptionalNone ? new Uint8Array([t.type]) : Yt(t.type, pr(t.value));
}
function up(t) {
  const e = new Uint8Array(4);
  return vs(e, t.buffer.length, 0), Yt(t.type, si(e, t.buffer));
}
function dp(t) {
  const e = yl(j0(t.value, BigInt(nu)), El);
  return Yt(t.type, e);
}
function pp(t) {
  const e = yl(t.value, El);
  return Yt(t.type, e);
}
function bp(t) {
  return Yt(t.type, ff(t.address));
}
function gp(t) {
  return Yt(t.type, si(ff(t.address), hf(t.contractName)));
}
function xp(t) {
  return Yt(t.type, pr(t.value));
}
function wp(t) {
  const e = [], n = new Uint8Array(4);
  vs(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = pr(r);
    e.push(s);
  }
  return Yt(t.type, Fn(e));
}
function yp(t) {
  const e = [], n = new Uint8Array(4);
  vs(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = yi(s);
    e.push(hf(o));
    const i = pr(t.data[s]);
    e.push(i);
  }
  return Yt(t.type, Fn(e));
}
function uf(t, e) {
  const n = [], r = e == "ascii" ? Sl(t.data) : hr(t.data), s = new Uint8Array(4);
  return vs(s, r.length, 0), n.push(s), n.push(r), Yt(t.type, Fn(n));
}
function mp(t) {
  return uf(t, "ascii");
}
function Sp(t) {
  return uf(t, "utf8");
}
function pr(t) {
  switch (t.type) {
    case _.BoolTrue:
    case _.BoolFalse:
      return fp(t);
    case _.OptionalNone:
    case _.OptionalSome:
      return hp(t);
    case _.Buffer:
      return up(t);
    case _.UInt:
      return pp(t);
    case _.Int:
      return dp(t);
    case _.PrincipalStandard:
      return bp(t);
    case _.PrincipalContract:
      return gp(t);
    case _.ResponseOk:
    case _.ResponseErr:
      return xp(t);
    case _.List:
      return wp(t);
    case _.Tuple:
      return yp(t);
    case _.StringASCII:
      return mp(t);
    case _.StringUTF8:
      return Sp(t);
    default:
      throw new lp("Unable to serialize. Invalid Clarity Value.");
  }
}
function Ep(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Ta = /* @__PURE__ */ new Map();
function df(t, e) {
  const n = Ta.get(t);
  if (n !== void 0)
    return n(e);
  const r = Ep(t);
  return Ta.set(t, r), df(t, e);
}
class Fa {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return tu(this.readBytes(4), 0);
  }
  readUInt8() {
    return Q0(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Z0(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = ie(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = ie(n);
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
    if (df(e, r))
      return r;
    throw n(r);
  }
}
function Bn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Fa(Hn(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Fa(t) : e = t;
  switch (e.readUInt8Enum(_, (r) => {
    throw new oo(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case _.Int:
      return ep(e.readBytes(16));
    case _.UInt:
      return af(e.readBytes(16));
    case _.Buffer:
      const r = e.readUInt32BE();
      return np(e.readBytes(r));
    case _.BoolTrue:
      return Zd();
    case _.BoolFalse:
      return Qd();
    case _.PrincipalStandard:
      const s = Na(e);
      return Yd(s);
    case _.PrincipalContract:
      const o = Na(e), i = Da(e);
      return of(o, i);
    case _.ResponseOk:
      return ip(Bn(e));
    case _.ResponseErr:
      return op(Bn(e));
    case _.OptionalNone:
      return rp();
    case _.OptionalSome:
      return sp(Bn(e));
    case _.List:
      const a = e.readUInt32BE(), c = [];
      for (let w = 0; w < a; w++)
        c.push(Bn(e));
      return ap(c);
    case _.Tuple:
      const h = e.readUInt32BE(), f = {};
      for (let w = 0; w < h; w++) {
        const v = Da(e).content;
        if (v === void 0)
          throw new oo('"content" is undefined');
        f[v] = Bn(e);
      }
      return cf(f);
    case _.StringASCII:
      const l = e.readUInt32BE(), b = Y0(e.readBytes(l));
      return ss(b);
    case _.StringUTF8:
      const d = e.readUInt32BE(), x = ml(e.readBytes(d));
      return cp(x);
    default:
      throw new oo("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const Ap = (t, e) => t ? hr(t).length > e : !1;
function vp(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function pf(t) {
  const e = pr(t);
  return `0x${ie(e)}`;
}
function Bp(t) {
  return Bn(t);
}
const $p = (t) => {
  try {
    return Rn.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
(function() {
  (function(t) {
    (function(e) {
      var n = typeof globalThis < "u" && globalThis || typeof t < "u" && t || // eslint-disable-next-line no-undef
      typeof gt < "u" && gt || {}, r = {
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
        ], i = ArrayBuffer.isView || function(g) {
          return g && o.indexOf(Object.prototype.toString.call(g)) > -1;
        };
      function a(g) {
        if (typeof g != "string" && (g = String(g)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(g) || g === "")
          throw new TypeError('Invalid character in header field name: "' + g + '"');
        return g.toLowerCase();
      }
      function c(g) {
        return typeof g != "string" && (g = String(g)), g;
      }
      function h(g) {
        var E = {
          next: function() {
            var L = g.shift();
            return { done: L === void 0, value: L };
          }
        };
        return r.iterable && (E[Symbol.iterator] = function() {
          return E;
        }), E;
      }
      function f(g) {
        this.map = {}, g instanceof f ? g.forEach(function(E, L) {
          this.append(L, E);
        }, this) : Array.isArray(g) ? g.forEach(function(E) {
          if (E.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + E.length);
          this.append(E[0], E[1]);
        }, this) : g && Object.getOwnPropertyNames(g).forEach(function(E) {
          this.append(E, g[E]);
        }, this);
      }
      f.prototype.append = function(g, E) {
        g = a(g), E = c(E);
        var L = this.map[g];
        this.map[g] = L ? L + ", " + E : E;
      }, f.prototype.delete = function(g) {
        delete this.map[a(g)];
      }, f.prototype.get = function(g) {
        return g = a(g), this.has(g) ? this.map[g] : null;
      }, f.prototype.has = function(g) {
        return this.map.hasOwnProperty(a(g));
      }, f.prototype.set = function(g, E) {
        this.map[a(g)] = c(E);
      }, f.prototype.forEach = function(g, E) {
        for (var L in this.map)
          this.map.hasOwnProperty(L) && g.call(E, this.map[L], L, this);
      }, f.prototype.keys = function() {
        var g = [];
        return this.forEach(function(E, L) {
          g.push(L);
        }), h(g);
      }, f.prototype.values = function() {
        var g = [];
        return this.forEach(function(E) {
          g.push(E);
        }), h(g);
      }, f.prototype.entries = function() {
        var g = [];
        return this.forEach(function(E, L) {
          g.push([L, E]);
        }), h(g);
      }, r.iterable && (f.prototype[Symbol.iterator] = f.prototype.entries);
      function l(g) {
        if (!g._noBody) {
          if (g.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          g.bodyUsed = !0;
        }
      }
      function b(g) {
        return new Promise(function(E, L) {
          g.onload = function() {
            E(g.result);
          }, g.onerror = function() {
            L(g.error);
          };
        });
      }
      function d(g) {
        var E = new FileReader(), L = b(E);
        return E.readAsArrayBuffer(g), L;
      }
      function x(g) {
        var E = new FileReader(), L = b(E), k = /charset=([A-Za-z0-9_-]+)/.exec(g.type), M = k ? k[1] : "utf-8";
        return E.readAsText(g, M), L;
      }
      function w(g) {
        for (var E = new Uint8Array(g), L = new Array(E.length), k = 0; k < E.length; k++)
          L[k] = String.fromCharCode(E[k]);
        return L.join("");
      }
      function v(g) {
        if (g.slice)
          return g.slice(0);
        var E = new Uint8Array(g.byteLength);
        return E.set(new Uint8Array(g)), E.buffer;
      }
      function H() {
        return this.bodyUsed = !1, this._initBody = function(g) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = g, g ? typeof g == "string" ? this._bodyText = g : r.blob && Blob.prototype.isPrototypeOf(g) ? this._bodyBlob = g : r.formData && FormData.prototype.isPrototypeOf(g) ? this._bodyFormData = g : r.searchParams && URLSearchParams.prototype.isPrototypeOf(g) ? this._bodyText = g.toString() : r.arrayBuffer && r.blob && s(g) ? (this._bodyArrayBuffer = v(g.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(g) || i(g)) ? this._bodyArrayBuffer = v(g) : this._bodyText = g = Object.prototype.toString.call(g) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof g == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(g) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var g = l(this);
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
            var g = l(this);
            return g || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
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
          var g = l(this);
          if (g)
            return g;
          if (this._bodyBlob)
            return x(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(w(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(A);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var U = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function y(g) {
        var E = g.toUpperCase();
        return U.indexOf(E) > -1 ? E : g;
      }
      function $(g, E) {
        if (!(this instanceof $))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        E = E || {};
        var L = E.body;
        if (g instanceof $) {
          if (g.bodyUsed)
            throw new TypeError("Already read");
          this.url = g.url, this.credentials = g.credentials, E.headers || (this.headers = new f(g.headers)), this.method = g.method, this.mode = g.mode, this.signal = g.signal, !L && g._bodyInit != null && (L = g._bodyInit, g.bodyUsed = !0);
        } else
          this.url = String(g);
        if (this.credentials = E.credentials || this.credentials || "same-origin", (E.headers || !this.headers) && (this.headers = new f(E.headers)), this.method = y(E.method || this.method || "GET"), this.mode = E.mode || this.mode || null, this.signal = E.signal || this.signal || function() {
          if ("AbortController" in n) {
            var N = new AbortController();
            return N.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && L)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(L), (this.method === "GET" || this.method === "HEAD") && (E.cache === "no-store" || E.cache === "no-cache")) {
          var k = /([?&])_=[^&]*/;
          if (k.test(this.url))
            this.url = this.url.replace(k, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var M = /\?/;
            this.url += (M.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      $.prototype.clone = function() {
        return new $(this, { body: this._bodyInit });
      };
      function A(g) {
        var E = new FormData();
        return g.trim().split("&").forEach(function(L) {
          if (L) {
            var k = L.split("="), M = k.shift().replace(/\+/g, " "), N = k.join("=").replace(/\+/g, " ");
            E.append(decodeURIComponent(M), decodeURIComponent(N));
          }
        }), E;
      }
      function P(g) {
        var E = new f(), L = g.replace(/\r?\n[\t ]+/g, " ");
        return L.split("\r").map(function(k) {
          return k.indexOf(`
`) === 0 ? k.substr(1, k.length) : k;
        }).forEach(function(k) {
          var M = k.split(":"), N = M.shift().trim();
          if (N) {
            var ht = M.join(":").trim();
            try {
              E.append(N, ht);
            } catch (et) {
              console.warn("Response " + et.message);
            }
          }
        }), E;
      }
      H.call($.prototype);
      function F(g, E) {
        if (!(this instanceof F))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (E || (E = {}), this.type = "default", this.status = E.status === void 0 ? 200 : E.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = E.statusText === void 0 ? "" : "" + E.statusText, this.headers = new f(E.headers), this.url = E.url || "", this._initBody(g);
      }
      H.call(F.prototype), F.prototype.clone = function() {
        return new F(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new f(this.headers),
          url: this.url
        });
      }, F.error = function() {
        var g = new F(null, { status: 200, statusText: "" });
        return g.ok = !1, g.status = 0, g.type = "error", g;
      };
      var O = [301, 302, 303, 307, 308];
      F.redirect = function(g, E) {
        if (O.indexOf(E) === -1)
          throw new RangeError("Invalid status code");
        return new F(null, { status: E, headers: { location: g } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(E, L) {
          this.message = E, this.name = L;
          var k = Error(E);
          this.stack = k.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function C(g, E) {
        return new Promise(function(L, k) {
          var M = new $(g, E);
          if (M.signal && M.signal.aborted)
            return k(new e.DOMException("Aborted", "AbortError"));
          var N = new XMLHttpRequest();
          function ht() {
            N.abort();
          }
          N.onload = function() {
            var rt = {
              statusText: N.statusText,
              headers: P(N.getAllResponseHeaders() || "")
            };
            M.url.indexOf("file://") === 0 && (N.status < 200 || N.status > 599) ? rt.status = 200 : rt.status = N.status, rt.url = "responseURL" in N ? N.responseURL : rt.headers.get("X-Request-URL");
            var R = "response" in N ? N.response : N.responseText;
            setTimeout(function() {
              L(new F(R, rt));
            }, 0);
          }, N.onerror = function() {
            setTimeout(function() {
              k(new TypeError("Network request failed"));
            }, 0);
          }, N.ontimeout = function() {
            setTimeout(function() {
              k(new TypeError("Network request timed out"));
            }, 0);
          }, N.onabort = function() {
            setTimeout(function() {
              k(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function et(rt) {
            try {
              return rt === "" && n.location.href ? n.location.href : rt;
            } catch {
              return rt;
            }
          }
          if (N.open(M.method, et(M.url), !0), M.credentials === "include" ? N.withCredentials = !0 : M.credentials === "omit" && (N.withCredentials = !1), "responseType" in N && (r.blob ? N.responseType = "blob" : r.arrayBuffer && (N.responseType = "arraybuffer")), E && typeof E.headers == "object" && !(E.headers instanceof f || n.Headers && E.headers instanceof n.Headers)) {
            var Ve = [];
            Object.getOwnPropertyNames(E.headers).forEach(function(rt) {
              Ve.push(a(rt)), N.setRequestHeader(rt, c(E.headers[rt]));
            }), M.headers.forEach(function(rt, R) {
              Ve.indexOf(R) === -1 && N.setRequestHeader(R, rt);
            });
          } else
            M.headers.forEach(function(rt, R) {
              N.setRequestHeader(R, rt);
            });
          M.signal && (M.signal.addEventListener("abort", ht), N.onreadystatechange = function() {
            N.readyState === 4 && M.signal.removeEventListener("abort", ht);
          }), N.send(typeof M._bodyInit > "u" ? null : M._bodyInit);
        });
      }
      return C.polyfill = !0, n.fetch || (n.fetch = C, n.Headers = f, n.Request = $, n.Response = F), e.Headers = f, e.Request = $, e.Response = F, e.fetch = C, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : gt);
})();
const _p = "https://browser.blockstack.org/auth", Hp = {
  "@type": "Person",
  "@context": "http://schema.org"
}, bf = ["store_write"], Lp = "blockstack-session", Ip = {
  logLevel: "debug"
}, ln = {
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
Object.freeze(ln);
class Vn extends Error {
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
class Up extends Vn {
  constructor(e, n = "") {
    super({ code: ln.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Ma extends Vn {
  constructor(e = "") {
    super({ code: ln.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Tr extends Vn {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: ln.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Ra extends Vn {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: ln.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Io extends Vn {
  constructor(e) {
    super({ code: ln.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class gf extends Vn {
  constructor(e) {
    super({ code: ln.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Ga = ["debug", "info", "warn", "error", "none"], Uo = {};
for (let t = 0; t < Ga.length; t++) {
  const e = Ga[t];
  Uo[e] = t;
}
class $n {
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
    return Uo[Ip.logLevel] <= Uo[e];
  }
}
function Op() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Cp() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function io(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function kp() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Pp() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Np(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function Si(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Pp(), s) {
      const o = s[t];
      if (o)
        return o;
    }
  } catch (o) {
    $n.error(`Error getting object '${t}' from global scope '${s}': ${o}`);
  }
  if (e) {
    const o = Np(s, t.toString(), n);
    throw $n.error(o), new Error(o);
  }
  if (r)
    return {};
}
function Dp(t) {
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
  if (Vp(t, Uint8Array))
    return BigInt(`0x${Ut(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Tp(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Ei(t, e = 8) {
  return (typeof t == "bigint" ? t : Dp(t)).toString(16).padStart(e * 2, "0");
}
function xf(t, e = 16) {
  const n = Ei(t, e);
  return $t(n);
}
function Fp(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const Mp = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ut(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Mp[n];
  return e;
}
function $t(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Tp(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    e[n] = o;
  }
  return e;
}
function br(t) {
  return new TextEncoder().encode(t);
}
function wf(t) {
  return new TextDecoder().decode(t);
}
function Rp(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Gp(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Va(t) {
  if (t.some(Gp))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function ae(...t) {
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
function Kn(t) {
  return ae(...t.map((e) => typeof e == "number" ? Va([e]) : e instanceof Array ? Va(e) : e));
}
function Vp(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const Kp = "https://api.mainnet.hiro.so", zp = "https://api.testnet.hiro.so", jp = "http://localhost:3999", qp = "https://hub.blockstack.org";
function Wp(t) {
  const e = typeof t == "string" ? $t(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Hs(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const Xp = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Yp(t, e) {
  const n = {};
  return Object.assign(n, Xp, e), await fetch(t, n);
}
function Jp(t) {
  let e = Yp, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Zp(...t) {
  const { fetchLib: e, middlewares: n } = Jp(t);
  return async (s, o) => {
    let i = { url: s, init: o ?? {} };
    for (const c of n)
      typeof c.pre == "function" && (i = await Promise.resolve(c.pre({
        fetch: e,
        ...i
      })) ?? i);
    let a = await e(i.url, i.init);
    for (const c of n)
      typeof c.post == "function" && (a = await Promise.resolve(c.post({
        fetch: e,
        url: i.url,
        init: i.init,
        response: (a == null ? void 0 : a.clone()) ?? a
      })) ?? a);
    return a;
  };
}
class yf {
  constructor(e = bf.slice(), n = ((a) => (a = Si("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", o = void 0, i = _p) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = o, this.authenticatorURL = i;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Oo(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Qp(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function mf(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function t1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Oo(t.outputLen), Oo(t.blockLen);
}
function e1(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function n1(t, e) {
  mf(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ze = {
  number: Oo,
  bool: Qp,
  bytes: mf,
  hash: t1,
  exists: e1,
  output: n1
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ao = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Gt = (t, e) => t << 32 - e | t >>> e, r1 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!r1)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function s1(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Ai(t) {
  if (typeof t == "string" && (t = s1(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Sf = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function fn(t) {
  const e = (r) => t().update(Ai(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Ef = class extends Sf {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ze.hash(e);
    const r = Ai(n);
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
    return Ze.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Ze.exists(this), Ze.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: a } = this;
    return e = e, e.finished = s, e.destroyed = o, e.blockLen = i, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Ls = (t, e, n) => new Ef(t, e).update(n).digest();
Ls.create = (t, e) => new Ef(t, e);
function o1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, h = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + h, a, r);
}
let vi = class extends Sf {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ao(this.buffer);
  }
  update(e) {
    Ze.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Ai(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = ao(e);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ze.exists(this), Ze.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let l = i; l < s; l++)
      n[l] = 0;
    o1(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = ao(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const h = c / 4, f = this.get();
    if (h > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < h; l++)
      a.setUint32(4 * l, f[l], o);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return e.length = s, e.pos = a, e.finished = o, e.destroyed = i, s % n && e.buffer.set(r), e;
  }
};
const i1 = (t, e, n) => t & e ^ ~t & n, a1 = (t, e, n) => t & e ^ t & n ^ e & n, c1 = new Uint32Array([
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
]), xe = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), we = new Uint32Array(64);
let Af = class extends vi {
  constructor() {
    super(64, 32, 8, !1), this.A = xe[0] | 0, this.B = xe[1] | 0, this.C = xe[2] | 0, this.D = xe[3] | 0, this.E = xe[4] | 0, this.F = xe[5] | 0, this.G = xe[6] | 0, this.H = xe[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [e, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      we[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = we[l - 15], d = we[l - 2], x = Gt(b, 7) ^ Gt(b, 18) ^ b >>> 3, w = Gt(d, 17) ^ Gt(d, 19) ^ d >>> 10;
      we[l] = w + we[l - 7] + x + we[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: h, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const b = Gt(a, 6) ^ Gt(a, 11) ^ Gt(a, 25), d = f + b + i1(a, c, h) + c1[l] + we[l] | 0, w = (Gt(r, 2) ^ Gt(r, 13) ^ Gt(r, 22)) + a1(r, s, o) | 0;
      f = h, h = c, c = a, a = i + d | 0, i = o, o = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, h = h + this.G | 0, f = f + this.H | 0, this.set(r, s, o, i, a, c, h, f);
  }
  roundClean() {
    we.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, l1 = class extends Af {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const kn = fn(() => new Af());
fn(() => new l1());
var gr = {};
gr.byteLength = p1;
var f1 = gr.toByteArray = g1, h1 = gr.fromByteArray = y1, jt = [], It = [], u1 = typeof Uint8Array < "u" ? Uint8Array : Array, co = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var En = 0, d1 = co.length; En < d1; ++En)
  jt[En] = co[En], It[co.charCodeAt(En)] = En;
It[45] = 62;
It[95] = 63;
function vf(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function p1(t) {
  var e = vf(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function b1(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function g1(t) {
  var e, n = vf(t), r = n[0], s = n[1], o = new u1(b1(t, r, s)), i = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = It[t.charCodeAt(c)] << 18 | It[t.charCodeAt(c + 1)] << 12 | It[t.charCodeAt(c + 2)] << 6 | It[t.charCodeAt(c + 3)], o[i++] = e >> 16 & 255, o[i++] = e >> 8 & 255, o[i++] = e & 255;
  return s === 2 && (e = It[t.charCodeAt(c)] << 2 | It[t.charCodeAt(c + 1)] >> 4, o[i++] = e & 255), s === 1 && (e = It[t.charCodeAt(c)] << 10 | It[t.charCodeAt(c + 1)] << 4 | It[t.charCodeAt(c + 2)] >> 2, o[i++] = e >> 8 & 255, o[i++] = e & 255), o;
}
function x1(t) {
  return jt[t >> 18 & 63] + jt[t >> 12 & 63] + jt[t >> 6 & 63] + jt[t & 63];
}
function w1(t, e, n) {
  for (var r, s = [], o = e; o < n; o += 3)
    r = (t[o] << 16 & 16711680) + (t[o + 1] << 8 & 65280) + (t[o + 2] & 255), s.push(x1(r));
  return s.join("");
}
function y1(t) {
  for (var e, n = t.length, r = n % 3, s = [], o = 16383, i = 0, a = n - r; i < a; i += o)
    s.push(w1(t, i, i + o > a ? a : i + o));
  return r === 1 ? (e = t[n - 1], s.push(
    jt[e >> 2] + jt[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    jt[e >> 10] + jt[e >> 4 & 63] + jt[e << 2 & 63] + "="
  )), s.join("");
}
function m1() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const S1 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function E1() {
  if (m1())
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
    throw new Error(S1);
  }
}
class A1 {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const o = this.createCipher(e, n, r), i = new Uint8Array(ae(o.update(s), o.final()));
    return Promise.resolve(i);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const o = this.createDecipher(e, n, r), i = new Uint8Array(ae(o.update(s), o.final()));
    return Promise.resolve(i);
  }
}
class v1 {
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
    const a = await this.subtleCrypto.importKey("raw", n, { name: o, length: i }, !1, ["encrypt"]), c = await this.subtleCrypto.encrypt({ name: o, iv: r }, a, s);
    return new Uint8Array(c);
  }
  async decrypt(e, n, r, s) {
    let o, i;
    if (e === "aes-128-cbc")
      o = "AES-CBC", i = 128;
    else if (e === "aes-256-cbc")
      o = "AES-CBC", i = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: o, length: i }, !1, ["decrypt"]), c = await this.subtleCrypto.decrypt({ name: o, iv: r }, a, s);
    return new Uint8Array(c);
  }
}
async function Bf() {
  const t = await E1();
  return t.name === "subtleCrypto" ? new v1(t.lib) : new A1(t.lib.createCipheriv, t.lib.createDecipheriv);
}
const B1 = nf, $1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var _1 = B1($1);
const H1 = /* @__PURE__ */ hd(_1), L1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), $f = Uint8Array.from({ length: 16 }, (t, e) => e), I1 = $f.map((t) => (9 * t + 5) % 16);
let Bi = [$f], $i = [I1];
for (let t = 0; t < 4; t++)
  for (let e of [Bi, $i])
    e.push(e[t].map((n) => L1[n]));
const _f = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), U1 = Bi.map((t, e) => t.map((n) => _f[e][n])), O1 = $i.map((t, e) => t.map((n) => _f[e][n])), C1 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), k1 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Fr = (t, e) => t << e | t >>> 32 - e;
function Ka(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Mr = new Uint32Array(16);
let P1 = class extends vi {
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
    for (let d = 0; d < 16; d++, n += 4)
      Mr[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, h = this.h3 | 0, f = h, l = this.h4 | 0, b = l;
    for (let d = 0; d < 5; d++) {
      const x = 4 - d, w = C1[d], v = k1[d], H = Bi[d], U = $i[d], y = U1[d], $ = O1[d];
      for (let A = 0; A < 16; A++) {
        const P = Fr(r + Ka(d, o, a, h) + Mr[H[A]] + w, y[A]) + l | 0;
        r = l, l = h, h = Fr(a, 10) | 0, a = o, o = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = Fr(s + Ka(x, i, c, f) + Mr[U[A]] + v, $[A]) + b | 0;
        s = b, b = f, f = Fr(c, 10) | 0, c = i, i = P;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + h + b | 0, this.h3 + l + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Mr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const N1 = fn(() => new P1());
function D1(t) {
  return N1(t);
}
const Rr = BigInt(2 ** 32 - 1), Co = BigInt(32);
function Hf(t, e = !1) {
  return e ? { h: Number(t & Rr), l: Number(t >> Co & Rr) } : { h: Number(t >> Co & Rr) | 0, l: Number(t & Rr) | 0 };
}
function T1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = Hf(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const F1 = (t, e) => BigInt(t >>> 0) << Co | BigInt(e >>> 0), M1 = (t, e, n) => t >>> n, R1 = (t, e, n) => t << 32 - n | e >>> n, G1 = (t, e, n) => t >>> n | e << 32 - n, V1 = (t, e, n) => t << 32 - n | e >>> n, K1 = (t, e, n) => t << 64 - n | e >>> n - 32, z1 = (t, e, n) => t >>> n - 32 | e << 64 - n, j1 = (t, e) => e, q1 = (t, e) => t, W1 = (t, e, n) => t << n | e >>> 32 - n, X1 = (t, e, n) => e << n | t >>> 32 - n, Y1 = (t, e, n) => e << n - 32 | t >>> 64 - n, J1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Z1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Q1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), tb = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, eb = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), nb = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, rb = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), sb = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, V = {
  fromBig: Hf,
  split: T1,
  toBig: F1,
  shrSH: M1,
  shrSL: R1,
  rotrSH: G1,
  rotrSL: V1,
  rotrBH: K1,
  rotrBL: z1,
  rotr32H: j1,
  rotr32L: q1,
  rotlSH: W1,
  rotlSL: X1,
  rotlBH: Y1,
  rotlBL: J1,
  add: Z1,
  add3L: Q1,
  add3H: tb,
  add4L: eb,
  add4H: nb,
  add5H: sb,
  add5L: rb
}, [ob, ib] = V.split([
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
].map((t) => BigInt(t))), ye = new Uint32Array(80), me = new Uint32Array(80);
let Is = class extends vi {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: h, El: f, Fh: l, Fl: b, Gh: d, Gl: x, Hh: w, Hl: v } = this;
    return [e, n, r, s, o, i, a, c, h, f, l, b, d, x, w, v];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, c, h, f, l, b, d, x, w, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = h | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = b | 0, this.Gh = d | 0, this.Gl = x | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let y = 0; y < 16; y++, n += 4)
      ye[y] = e.getUint32(n), me[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const $ = ye[y - 15] | 0, A = me[y - 15] | 0, P = V.rotrSH($, A, 1) ^ V.rotrSH($, A, 8) ^ V.shrSH($, A, 7), F = V.rotrSL($, A, 1) ^ V.rotrSL($, A, 8) ^ V.shrSL($, A, 7), O = ye[y - 2] | 0, C = me[y - 2] | 0, g = V.rotrSH(O, C, 19) ^ V.rotrBH(O, C, 61) ^ V.shrSH(O, C, 6), E = V.rotrSL(O, C, 19) ^ V.rotrBL(O, C, 61) ^ V.shrSL(O, C, 6), L = V.add4L(F, E, me[y - 7], me[y - 16]), k = V.add4H(L, P, g, ye[y - 7], ye[y - 16]);
      ye[y] = k | 0, me[y] = L | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: h, Dl: f, Eh: l, El: b, Fh: d, Fl: x, Gh: w, Gl: v, Hh: H, Hl: U } = this;
    for (let y = 0; y < 80; y++) {
      const $ = V.rotrSH(l, b, 14) ^ V.rotrSH(l, b, 18) ^ V.rotrBH(l, b, 41), A = V.rotrSL(l, b, 14) ^ V.rotrSL(l, b, 18) ^ V.rotrBL(l, b, 41), P = l & d ^ ~l & w, F = b & x ^ ~b & v, O = V.add5L(U, A, F, ib[y], me[y]), C = V.add5H(O, H, $, P, ob[y], ye[y]), g = O | 0, E = V.rotrSH(r, s, 28) ^ V.rotrBH(r, s, 34) ^ V.rotrBH(r, s, 39), L = V.rotrSL(r, s, 28) ^ V.rotrBL(r, s, 34) ^ V.rotrBL(r, s, 39), k = r & o ^ r & a ^ o & a, M = s & i ^ s & c ^ i & c;
      H = w | 0, U = v | 0, w = d | 0, v = x | 0, d = l | 0, x = b | 0, { h: l, l: b } = V.add(h | 0, f | 0, C | 0, g | 0), h = a | 0, f = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const N = V.add3L(g, L, M);
      r = V.add3H(N, C, E, k), s = N | 0;
    }
    ({ h: r, l: s } = V.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = V.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = V.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h, l: f } = V.add(this.Dh | 0, this.Dl | 0, h | 0, f | 0), { h: l, l: b } = V.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h: d, l: x } = V.add(this.Fh | 0, this.Fl | 0, d | 0, x | 0), { h: w, l: v } = V.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: H, l: U } = V.add(this.Hh | 0, this.Hl | 0, H | 0, U | 0), this.set(r, s, o, i, a, c, h, f, l, b, d, x, w, v, H, U);
  }
  roundClean() {
    ye.fill(0), me.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, ab = class extends Is {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, cb = class extends Is {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, lb = class extends Is {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const fb = fn(() => new Is());
fn(() => new ab());
fn(() => new cb());
fn(() => new lb());
function Lf(t) {
  return kn(t);
}
function hb(t) {
  return fb(t);
}
const ub = 0;
at.hmacSha256Sync = (t, ...e) => {
  const n = Ls.create(kn, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function db() {
  return Ut(at.randomPrivateKey());
}
function pb(t) {
  const e = kn(kn(t));
  return H1.encode(ae(t, e).slice(0, t.length + 4));
}
function bb(t, e) {
  return pb(ae(new Uint8Array([t]), e.slice(0, 20)));
}
function If(t, e = ub) {
  const n = typeof t == "string" ? $t(t) : t, r = D1(Lf(n));
  return bb(e, r);
}
function Uf(t) {
  const e = Wp(t);
  return Ut(hi(e.slice(0, 32), !0));
}
at.hmacSha256Sync = (t, ...e) => {
  const n = Ls.create(kn, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var ds;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(ds || (ds = {}));
async function gb(t, e, n) {
  return await (await Bf()).encrypt("aes-256-cbc", e, t, n);
}
async function xb(t, e, n) {
  return await (await Bf()).decrypt("aes-256-cbc", e, t, n);
}
function Of(t, e) {
  return Ls(kn, t, e);
}
function wb(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function Cf(t) {
  const e = hb(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function yb(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function mb(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: ds.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: ds.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !yb(t))
    return e;
  try {
    return Z.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function Sb(t, e, n, r) {
  const s = mb(t);
  if (!s.result)
    throw s;
  const o = at.randomPrivateKey(), i = hi(o, !0);
  let a = ui(o, t, !0);
  a = a.slice(1);
  const c = Cf(a), h = at.randomBytes(16), f = await gb(h, c.encryptionKey, e), l = ae(h, i, f), b = Of(c.hmacKey, l);
  let d;
  if (!r || r === "hex")
    d = Ut(f);
  else if (r === "base64")
    d = h1(f);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const x = {
    iv: Ut(h),
    ephemeralPK: Ut(i),
    cipherText: d,
    mac: Ut(b),
    wasString: n
  };
  return r && r !== "hex" && (x.cipherTextEncoding = r), x;
}
async function kf(t, e) {
  if (!e.ephemeralPK)
    throw new Ra("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = ui(t, n, !0);
  r = r.slice(1);
  const s = Cf(r), o = $t(e.iv);
  let i;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    i = $t(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    i = f1(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = ae(o, $t(n), i), c = Of(s.hmacKey, a), h = $t(e.mac);
  if (!wb(h, c))
    throw new Ra("Decryption failed: failure in MAC check");
  const f = await xb(o, s.encryptionKey, i);
  return e.wasString ? wf(f) : f;
}
function Eb(t, e) {
  const n = typeof e == "string" ? br(e) : e, r = Uf(t), s = Lf(n), o = Tl(s, t);
  return {
    signature: Ut(o),
    publicKey: r
  };
}
async function Ab(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = Uf(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", o = typeof t == "string" ? br(t) : t, i = await Sb(n.publicKey, o, s, n.cipherTextEncoding);
  let a = JSON.stringify(i);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = Eb(r, a), h = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(h);
  }
  return a;
}
function vb(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return kf(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var xt = {}, Pn = {}, bt = {};
Object.defineProperty(bt, "__esModule", { value: !0 });
bt.decode = bt.encode = bt.unescape = bt.escape = bt.pad = void 0;
const Pf = gr;
function _i(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
bt.pad = _i;
function Nf(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
bt.escape = Nf;
function Df(t) {
  return _i(t).replace(/-/g, "+").replace(/_/g, "/");
}
bt.unescape = Df;
function Bb(t) {
  return Nf((0, Pf.fromByteArray)(new TextEncoder().encode(t)));
}
bt.encode = Bb;
function $b(t) {
  return new TextDecoder().decode((0, Pf.toByteArray)(_i(Df(t))));
}
bt.decode = $b;
var Us = {}, Os = {};
let Hi = class extends xi {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, zl(e);
    const r = Gn(n);
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
    this.oHash.update(o), ir(o);
  }
  update(e) {
    return or(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    or(this), Ge(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: a } = this;
    return e = e, e.finished = s, e.destroyed = o, e.blockLen = i, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Tf = (t, e, n) => new Hi(t, e).update(n).digest();
Tf.create = (t, e) => new Hi(t, e);
const _b = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HMAC: Hi,
  hmac: Tf
}, Symbol.toStringTag, { value: "Module" })), Hb = /* @__PURE__ */ ur(_b), Lb = /* @__PURE__ */ ur(fd);
var Nn = {};
Object.defineProperty(Nn, "__esModule", { value: !0 });
Nn.joseToDer = Nn.derToJose = void 0;
const Ff = gr, Mf = bt;
function lo(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const Ib = {
  ES256: lo(256),
  ES384: lo(384),
  ES512: lo(521)
};
function Rf(t) {
  const e = Ib[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const ps = 128, Gf = 0, Ub = 32, Ob = 16, Cb = 2, Vf = Ob | Ub | Gf << 6, bs = Cb | Gf << 6;
function Kf(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, Ff.toByteArray)((0, Mf.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function kb(t, e) {
  const n = Kf(t), r = Rf(e), s = r + 1, o = n.length;
  let i = 0;
  if (n[i++] !== Vf)
    throw new Error('Could not find expected "seq"');
  let a = n[i++];
  if (a === (ps | 1) && (a = n[i++]), o - i < a)
    throw new Error(`"seq" specified length of "${a}", only "${o - i}" remaining`);
  if (n[i++] !== bs)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[i++];
  if (o - i - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${o - i - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const h = i;
  if (i += c, n[i++] !== bs)
    throw new Error('Could not find expected "int" for "s"');
  const f = n[i++];
  if (o - i !== f)
    throw new Error(`"s" specified length of "${f}", expected "${o - i}"`);
  if (s < f)
    throw new Error(`"s" specified length of "${f}", max of "${s}" is acceptable`);
  const l = i;
  if (i += f, i !== o)
    throw new Error(`Expected to consume entire array, but "${o - i}" bytes remain`);
  const b = r - c, d = r - f, x = new Uint8Array(b + c + d + f);
  for (i = 0; i < b; ++i)
    x[i] = 0;
  x.set(n.subarray(h + Math.max(-b, 0), h + c), i), i = r;
  for (const w = i; i < w + d; ++i)
    x[i] = 0;
  return x.set(n.subarray(l + Math.max(-d, 0), l + f), i), (0, Mf.escape)((0, Ff.fromByteArray)(x));
}
Nn.derToJose = kb;
function za(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= ps && --r, r;
}
function Pb(t, e) {
  t = Kf(t);
  const n = Rf(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = za(t, 0, n), o = za(t, n, t.length), i = n - s, a = n - o, c = 2 + i + 1 + 1 + a, h = c < ps, f = new Uint8Array((h ? 2 : 3) + c);
  let l = 0;
  return f[l++] = Vf, h ? f[l++] = c : (f[l++] = ps | 1, f[l++] = c & 255), f[l++] = bs, f[l++] = i, s < 0 ? (f[l++] = 0, f.set(t.subarray(0, n), l), l += n) : (f.set(t.subarray(s, n), l), l += n - s), f[l++] = bs, f[l++] = a, o < 0 ? (f[l++] = 0, f.set(t.subarray(n), l)) : f.set(t.subarray(n + o), l), f;
}
Nn.joseToDer = Pb;
var ce = {};
Object.defineProperty(ce, "__esModule", { value: !0 });
ce.InvalidTokenError = ce.MissingParametersError = void 0;
class Nb extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
ce.MissingParametersError = Nb;
class Db extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
ce.InvalidTokenError = Db;
Object.defineProperty(Os, "__esModule", { value: !0 });
Os.SECP256K1Client = void 0;
const Tb = Hb, Fb = _s, os = Lb, ja = Nn, qa = ce, Wa = dr;
os.utils.hmacSha256Sync = (t, ...e) => {
  const n = Tb.hmac.create(Fb.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class zf {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Wa.bytesToHex)(os.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new qa.MissingParametersError("a signing input hash and private key are all required");
    const s = os.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Wa.bytesToHex)(s);
    if (r === "jose")
      return (0, ja.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, ja.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new qa.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return os.verify(n, e, r, { strict: !1 });
  }
}
Os.SECP256K1Client = zf;
zf.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Os;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(Us);
var sn = {};
const Mb = /* @__PURE__ */ ur(Ll);
var Rb = gt && gt.__awaiter || function(t, e, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
    function a(f) {
      try {
        h(r.next(f));
      } catch (l) {
        i(l);
      }
    }
    function c(f) {
      try {
        h(r.throw(f));
      } catch (l) {
        i(l);
      }
    }
    function h(f) {
      f.done ? o(f.value) : s(f.value).then(a, c);
    }
    h((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(sn, "__esModule", { value: !0 });
sn.hashSha256Async = sn.hashSha256 = void 0;
const Gb = _s;
function jf(t) {
  return (0, Gb.sha256)(t);
}
sn.hashSha256 = jf;
function Vb(t) {
  return Rb(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Mb;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(jf(t));
    }
  });
}
sn.hashSha256Async = Vb;
var Kb = gt && gt.__awaiter || function(t, e, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
    function a(f) {
      try {
        h(r.next(f));
      } catch (l) {
        i(l);
      }
    }
    function c(f) {
      try {
        h(r.throw(f));
      } catch (l) {
        i(l);
      }
    }
    function h(f) {
      f.done ? o(f.value) : s(f.value).then(a, c);
    }
    h((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Pn, "__esModule", { value: !0 });
Pn.TokenSigner = Pn.createUnsecuredToken = void 0;
const ko = bt, Xa = Us, zb = ce, Ya = sn;
function Po(t, e) {
  const n = [], r = ko.encode(JSON.stringify(e));
  n.push(r);
  const s = ko.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function jb(t) {
  return Po(t, { typ: "JWT", alg: "none" }) + ".";
}
Pn.createUnsecuredToken = jb;
class qb {
  constructor(e, n) {
    if (!(e && n))
      throw new zb.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Xa.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Xa.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), o = Po(e, s), i = (0, Ya.hashSha256)(o);
    return this.createWithSignedHash(e, n, s, o, i);
  }
  signAsync(e, n = !1, r = {}) {
    return Kb(this, void 0, void 0, function* () {
      const s = this.header(r), o = Po(e, s), i = yield (0, Ya.hashSha256Async)(o);
      return this.createWithSignedHash(e, n, s, o, i);
    });
  }
  createWithSignedHash(e, n, r, s, o) {
    const i = this.cryptoClient.signHash(o, this.rawPrivateKey);
    return n ? {
      header: [ko.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [i]
    } : [s, i].join(".");
  }
}
Pn.TokenSigner = qb;
var Cs = {};
Object.defineProperty(Cs, "__esModule", { value: !0 });
Cs.TokenVerifier = void 0;
const Wb = bt, Ja = Us, Xb = ce, Gr = sn;
class Yb {
  constructor(e, n) {
    if (!(e && n))
      throw new Xb.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Ja.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Ja.cryptoClients[e], this.rawPublicKey = n;
  }
  verify(e) {
    return typeof e == "string" ? this.verifyCompact(e, !1) : typeof e == "object" ? this.verifyExpanded(e, !1) : !1;
  }
  verifyAsync(e) {
    return typeof e == "string" ? this.verifyCompact(e, !0) : typeof e == "object" ? this.verifyExpanded(e, !0) : Promise.resolve(!1);
  }
  verifyCompact(e, n) {
    const r = e.split("."), s = r[0] + "." + r[1], o = (i) => {
      const a = this.cryptoClient.loadSignature(r[2]);
      return this.cryptoClient.verifyHash(i, a, this.rawPublicKey);
    };
    if (n)
      return (0, Gr.hashSha256Async)(s).then((i) => o(i));
    {
      const i = (0, Gr.hashSha256)(s);
      return o(i);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), Wb.encode(e.payload)].join(".");
    let s = !0;
    const o = (i) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(i, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Gr.hashSha256Async)(r).then((i) => o(i));
    {
      const i = (0, Gr.hashSha256)(r);
      return o(i);
    }
  }
}
Cs.TokenVerifier = Yb;
var ks = {};
Object.defineProperty(ks, "__esModule", { value: !0 });
ks.decodeToken = void 0;
const Vr = bt;
function Jb(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Vr.decode(e[0])), r = JSON.parse(Vr.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Vr.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Vr.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
ks.decodeToken = Jb;
(function(t) {
  var e = gt && gt.__createBinding || (Object.create ? function(r, s, o, i) {
    i === void 0 && (i = o);
    var a = Object.getOwnPropertyDescriptor(s, o);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[o];
    } }), Object.defineProperty(r, i, a);
  } : function(r, s, o, i) {
    i === void 0 && (i = o), r[i] = s[o];
  }), n = gt && gt.__exportStar || function(r, s) {
    for (var o in r) o !== "default" && !Object.prototype.hasOwnProperty.call(s, o) && e(s, r, o);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Pn, t), n(Cs, t), n(ks, t), n(ce, t), n(Us, t);
})(xt);
function Zb(t) {
  return `did:btc-addr:${t}`;
}
function Qb(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Ma("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Ma('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function qf(t) {
  if (t)
    return Qb(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const t2 = "1.4.0";
function e2() {
  return db();
}
function n2(t, e, n, r = bf.slice(), s, o = Op().getTime(), i = {}) {
  const a = (d) => {
    const x = Si("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${d}=undefined])`
    });
    return x == null ? void 0 : x.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, i, {
    jti: kp(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(o / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: t2,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), h = xt.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [h];
  const f = If(h);
  return c.iss = Zb(f), new xt.TokenSigner("ES256k", t).sign(c);
}
async function Za(t, e) {
  const n = wf($t(e)), r = JSON.parse(n), s = await kf(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function r2(t) {
  const e = xt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new xt.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function s2(t) {
  const e = xt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = qf(e.iss);
  if (n.length === 1) {
    if (If(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function o2(t) {
  const e = xt.decodeToken(t).payload;
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
function i2(t) {
  const e = xt.decodeToken(t).payload;
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
function a2(t) {
  const e = [
    i2(t),
    o2(t),
    r2(t),
    s2(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Qa = "1.0.0";
class Re {
  constructor(e) {
    this.version = Qa, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Qa)
      throw new Io(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Re(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Wf {
  constructor(e) {
    if (e) {
      const n = new Re(e);
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
class tc extends Wf {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Re({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new gf("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Re({})), !0;
  }
}
class ec extends Wf {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Lp, !localStorage.getItem(this.key)) {
      const r = new Re({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new gf("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Re.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Re({})), !0;
  }
}
var ar;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(ar || (ar = {}));
var gs;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(gs || (gs = {}));
ar.Mainnet;
var se;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(se || (se = {}));
var Wt;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Wt || (Wt = {}));
se.Mainnet;
const Xf = {
  chainId: ar.Mainnet,
  transactionVersion: se.Mainnet,
  peerNetworkId: gs.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Wt.MainnetSingleSig,
    multiSig: Wt.MainnetMultiSig
  },
  client: { baseUrl: Kp }
}, No = {
  chainId: ar.Testnet,
  transactionVersion: se.Testnet,
  peerNetworkId: gs.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Wt.TestnetSingleSig,
    multiSig: Wt.TestnetMultiSig
  },
  client: { baseUrl: zp }
}, is = {
  ...No,
  addressVersion: { ...No.addressVersion },
  magicBytes: "id",
  client: { baseUrl: jp }
}, c2 = {
  ...is,
  addressVersion: { ...is.addressVersion },
  client: { ...is.client }
};
function l2(t) {
  switch (t) {
    case "mainnet":
      return Xf;
    case "testnet":
      return No;
    case "devnet":
      return is;
    case "mocknet":
      return c2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Yf(t) {
  return typeof t == "string" ? l2(t) : t;
}
var nc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(nc || (nc = {}));
var rc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(rc || (rc = {}));
var Dt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Dt || (Dt = {}));
const fo = ["onChainOnly", "offChainOnly", "any"];
fo[0] + "", Dt.OnChainOnly, fo[1] + "", Dt.OffChainOnly, fo[2] + "", Dt.Any, Dt.OnChainOnly + "", Dt.OnChainOnly, Dt.OffChainOnly + "", Dt.OffChainOnly, Dt.Any + "", Dt.Any;
var sc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(sc || (sc = {}));
var oc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(oc || (oc = {}));
var ic;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(ic || (ic = {}));
var re;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(re || (re = {}));
var ac;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(ac || (ac = {}));
var cc;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(cc || (cc = {}));
var lc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(lc || (lc = {}));
var fc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(fc || (fc = {}));
var hc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(hc || (hc = {}));
var uc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(uc || (uc = {}));
var dc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(dc || (dc = {}));
var pc;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(pc || (pc = {}));
var bc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(bc || (bc = {}));
function Do(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function f2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Jf(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function h2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Do(t.outputLen), Do(t.blockLen);
}
function u2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function d2(t, e) {
  Jf(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Qe = {
  number: Do,
  bool: f2,
  bytes: Jf,
  hash: h2,
  exists: u2,
  output: d2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ho = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Vt = (t, e) => t << 32 - e | t >>> e, p2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!p2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function b2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Li(t) {
  if (typeof t == "string" && (t = b2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Zf = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function hn(t) {
  const e = (r) => t().update(Li(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
class Qf extends Zf {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Qe.hash(e);
    const r = Li(n);
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
    return Qe.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Qe.exists(this), Qe.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: a } = this;
    return e = e, e.finished = s, e.destroyed = o, e.blockLen = i, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const th = (t, e, n) => new Qf(t, e).update(n).digest();
th.create = (t, e) => new Qf(t, e);
function g2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, h = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + h, a, r);
}
let Ii = class extends Zf {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ho(this.buffer);
  }
  update(e) {
    Qe.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Li(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = ho(e);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Qe.exists(this), Qe.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let l = i; l < s; l++)
      n[l] = 0;
    g2(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = ho(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const h = c / 4, f = this.get();
    if (h > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < h; l++)
      a.setUint32(4 * l, f[l], o);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return e.length = s, e.pos = a, e.finished = o, e.destroyed = i, s % n && e.buffer.set(r), e;
  }
};
const x2 = (t, e, n) => t & e ^ ~t & n, w2 = (t, e, n) => t & e ^ t & n ^ e & n, y2 = new Uint32Array([
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
]), Se = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ee = new Uint32Array(64);
let eh = class extends Ii {
  constructor() {
    super(64, 32, 8, !1), this.A = Se[0] | 0, this.B = Se[1] | 0, this.C = Se[2] | 0, this.D = Se[3] | 0, this.E = Se[4] | 0, this.F = Se[5] | 0, this.G = Se[6] | 0, this.H = Se[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [e, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      Ee[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = Ee[l - 15], d = Ee[l - 2], x = Vt(b, 7) ^ Vt(b, 18) ^ b >>> 3, w = Vt(d, 17) ^ Vt(d, 19) ^ d >>> 10;
      Ee[l] = w + Ee[l - 7] + x + Ee[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: h, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const b = Vt(a, 6) ^ Vt(a, 11) ^ Vt(a, 25), d = f + b + x2(a, c, h) + y2[l] + Ee[l] | 0, w = (Vt(r, 2) ^ Vt(r, 13) ^ Vt(r, 22)) + w2(r, s, o) | 0;
      f = h, h = c, c = a, a = i + d | 0, i = o, o = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, h = h + this.G | 0, f = f + this.H | 0, this.set(r, s, o, i, a, c, h, f);
  }
  roundClean() {
    Ee.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, m2 = class extends eh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const nh = hn(() => new eh());
hn(() => new m2());
function S2(t, e) {
  switch (e = Yf(e ?? Xf), t) {
    case re.P2PKH:
      switch (e.transactionVersion) {
        case se.Mainnet:
          return Wt.MainnetSingleSig;
        case se.Testnet:
          return Wt.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case re.P2SH:
    case re.P2SHNonSequential:
    case re.P2WPKH:
    case re.P2WSH:
    case re.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case se.Mainnet:
          return Wt.MainnetMultiSig;
        case se.Testnet:
          return Wt.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const E2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), rh = Uint8Array.from({ length: 16 }, (t, e) => e), A2 = rh.map((t) => (9 * t + 5) % 16);
let Ui = [rh], Oi = [A2];
for (let t = 0; t < 4; t++)
  for (let e of [Ui, Oi])
    e.push(e[t].map((n) => E2[n]));
const sh = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), v2 = Ui.map((t, e) => t.map((n) => sh[e][n])), B2 = Oi.map((t, e) => t.map((n) => sh[e][n])), $2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), _2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Kr = (t, e) => t << e | t >>> 32 - e;
function gc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const zr = new Uint32Array(16);
let H2 = class extends Ii {
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
    for (let d = 0; d < 16; d++, n += 4)
      zr[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, h = this.h3 | 0, f = h, l = this.h4 | 0, b = l;
    for (let d = 0; d < 5; d++) {
      const x = 4 - d, w = $2[d], v = _2[d], H = Ui[d], U = Oi[d], y = v2[d], $ = B2[d];
      for (let A = 0; A < 16; A++) {
        const P = Kr(r + gc(d, o, a, h) + zr[H[A]] + w, y[A]) + l | 0;
        r = l, l = h, h = Kr(a, 10) | 0, a = o, o = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = Kr(s + gc(x, i, c, f) + zr[U[A]] + v, $[A]) + b | 0;
        s = b, b = f, f = Kr(c, 10) | 0, c = i, i = P;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + h + b | 0, this.h3 + l + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    zr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const L2 = hn(() => new H2()), jr = BigInt(2 ** 32 - 1), To = BigInt(32);
function oh(t, e = !1) {
  return e ? { h: Number(t & jr), l: Number(t >> To & jr) } : { h: Number(t >> To & jr) | 0, l: Number(t & jr) | 0 };
}
function I2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = oh(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const U2 = (t, e) => BigInt(t >>> 0) << To | BigInt(e >>> 0), O2 = (t, e, n) => t >>> n, C2 = (t, e, n) => t << 32 - n | e >>> n, k2 = (t, e, n) => t >>> n | e << 32 - n, P2 = (t, e, n) => t << 32 - n | e >>> n, N2 = (t, e, n) => t << 64 - n | e >>> n - 32, D2 = (t, e, n) => t >>> n - 32 | e << 64 - n, T2 = (t, e) => e, F2 = (t, e) => t, M2 = (t, e, n) => t << n | e >>> 32 - n, R2 = (t, e, n) => e << n | t >>> 32 - n, G2 = (t, e, n) => e << n - 32 | t >>> 64 - n, V2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function K2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const z2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), j2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, q2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), W2 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, X2 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Y2 = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, K = {
  fromBig: oh,
  split: I2,
  toBig: U2,
  shrSH: O2,
  shrSL: C2,
  rotrSH: k2,
  rotrSL: P2,
  rotrBH: N2,
  rotrBL: D2,
  rotr32H: T2,
  rotr32L: F2,
  rotlSH: M2,
  rotlSL: R2,
  rotlBH: G2,
  rotlBL: V2,
  add: K2,
  add3L: z2,
  add3H: j2,
  add4L: q2,
  add4H: W2,
  add5H: Y2,
  add5L: X2
}, [J2, Z2] = K.split([
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
].map((t) => BigInt(t))), Ae = new Uint32Array(80), ve = new Uint32Array(80);
let Ps = class extends Ii {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: h, El: f, Fh: l, Fl: b, Gh: d, Gl: x, Hh: w, Hl: v } = this;
    return [e, n, r, s, o, i, a, c, h, f, l, b, d, x, w, v];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, c, h, f, l, b, d, x, w, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = h | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = b | 0, this.Gh = d | 0, this.Gl = x | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let y = 0; y < 16; y++, n += 4)
      Ae[y] = e.getUint32(n), ve[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const $ = Ae[y - 15] | 0, A = ve[y - 15] | 0, P = K.rotrSH($, A, 1) ^ K.rotrSH($, A, 8) ^ K.shrSH($, A, 7), F = K.rotrSL($, A, 1) ^ K.rotrSL($, A, 8) ^ K.shrSL($, A, 7), O = Ae[y - 2] | 0, C = ve[y - 2] | 0, g = K.rotrSH(O, C, 19) ^ K.rotrBH(O, C, 61) ^ K.shrSH(O, C, 6), E = K.rotrSL(O, C, 19) ^ K.rotrBL(O, C, 61) ^ K.shrSL(O, C, 6), L = K.add4L(F, E, ve[y - 7], ve[y - 16]), k = K.add4H(L, P, g, Ae[y - 7], Ae[y - 16]);
      Ae[y] = k | 0, ve[y] = L | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: h, Dl: f, Eh: l, El: b, Fh: d, Fl: x, Gh: w, Gl: v, Hh: H, Hl: U } = this;
    for (let y = 0; y < 80; y++) {
      const $ = K.rotrSH(l, b, 14) ^ K.rotrSH(l, b, 18) ^ K.rotrBH(l, b, 41), A = K.rotrSL(l, b, 14) ^ K.rotrSL(l, b, 18) ^ K.rotrBL(l, b, 41), P = l & d ^ ~l & w, F = b & x ^ ~b & v, O = K.add5L(U, A, F, Z2[y], ve[y]), C = K.add5H(O, H, $, P, J2[y], Ae[y]), g = O | 0, E = K.rotrSH(r, s, 28) ^ K.rotrBH(r, s, 34) ^ K.rotrBH(r, s, 39), L = K.rotrSL(r, s, 28) ^ K.rotrBL(r, s, 34) ^ K.rotrBL(r, s, 39), k = r & o ^ r & a ^ o & a, M = s & i ^ s & c ^ i & c;
      H = w | 0, U = v | 0, w = d | 0, v = x | 0, d = l | 0, x = b | 0, { h: l, l: b } = K.add(h | 0, f | 0, C | 0, g | 0), h = a | 0, f = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const N = K.add3L(g, L, M);
      r = K.add3H(N, C, E, k), s = N | 0;
    }
    ({ h: r, l: s } = K.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = K.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = K.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h, l: f } = K.add(this.Dh | 0, this.Dl | 0, h | 0, f | 0), { h: l, l: b } = K.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h: d, l: x } = K.add(this.Fh | 0, this.Fl | 0, d | 0, x | 0), { h: w, l: v } = K.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: H, l: U } = K.add(this.Hh | 0, this.Hl | 0, H | 0, U | 0), this.set(r, s, o, i, a, c, h, f, l, b, d, x, w, v, H, U);
  }
  roundClean() {
    Ae.fill(0), ve.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Q2 = class extends Ps {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, tg = class extends Ps {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, eg = class extends Ps {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
hn(() => new Ps());
hn(() => new Q2());
hn(() => new tg());
hn(() => new eg());
var Fo;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Fo || (Fo = {}));
function ng(t, e) {
  return { type: Fo.Address, version: t, hash160: e };
}
function rg(t) {
  return Rn.c32address(t.version, t.hash160);
}
const sg = (t) => L2(nh(t)), og = (t) => Ut(sg(t));
at.hmacSha256Sync = (t, ...e) => {
  const n = th.create(nh, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function ig(t, e = "mainnet") {
  e = Yf(e), t = typeof t == "string" ? $t(t) : t;
  const n = S2(re.P2PKH, e), r = ng(n, og(t));
  return rg(r);
}
function ag(t, e) {
  const n = xt.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, o = ig(s);
  if (e !== s) {
    if (e !== o) throw new Error("Token issuer public key does not match the verifying value");
  }
  const i = new xt.TokenVerifier(n.header.alg, s);
  if (!i)
    throw new Error("Invalid token verifier");
  if (!i.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function cg(t, e = null) {
  let n;
  e ? n = ag(t, e) : n = xt.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const xc = "_blockstackDidCheckEchoReply", lg = "echoReply", fg = "authContinuation";
function hg(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, o] = r.split("=");
    return n[s] = o ? decodeURIComponent(o.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function ug() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[xc];
  if (typeof e == "boolean")
    return e;
  const n = hg(t.location.search), r = n[lg];
  if (r) {
    t[xc] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const o = n[fg];
      t.location.href = o;
    }, 10), !0;
  }
  return !1;
}
class Mo {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new yf();
    else
      throw new Up("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new ec(e.sessionOptions) : this.store = new ec() : e ? this.store = new tc(e.sessionOptions) : this.store = new tc();
  }
  makeAuthRequestToken(e, n, r, s, o, i = Cp().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new Io("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, o = o || c.appDomain, n2(e, n, r, s, o, i, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = e2();
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
      if (ug())
        return $n.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      $n.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = Zp()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Tr("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const o = xt.decodeToken(e).payload;
    if (typeof o == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await a2(e))
      throw new Tr("Invalid authentication response.");
    let a = o.private_key, c = o.core_token;
    if (io(o.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (o.private_key !== void 0 && o.private_key !== null)
          try {
            a = await Za(s, o.private_key);
          } catch {
            if ($n.warn("Failed decryption of appPrivateKey, will try to use as given"), !at.isValidPrivateKey(o.private_key))
              throw new Tr("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Za(s, c);
          } catch {
            $n.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Tr("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let h = qp, f;
    io(o.version, "1.2.0") && o.hubUrl !== null && o.hubUrl !== void 0 && (h = o.hubUrl), io(o.version, "1.3.0") && o.associationToken !== null && o.associationToken !== void 0 && (f = o.associationToken);
    const l = {
      profile: o.profile,
      email: o.email,
      decentralizedID: o.iss,
      identityAddress: qf(o.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: h,
      appPrivateKeyFromWalletSalt: o.appPrivateKeyFromWalletSalt,
      coreNode: o.blockstackAPIUrl,
      gaiaAssociationToken: f
    }, b = o.profile_url;
    if (!l.profile && b) {
      const d = await n(b);
      if (!d.ok)
        l.profile = Object.assign({}, Hp);
      else {
        const x = await d.text(), w = JSON.parse(x);
        l.profile = cg(w[0].token);
      }
    } else
      l.profile = o.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new Io("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Ab(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), vb(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
Mo.prototype.makeAuthRequest = Mo.prototype.makeAuthRequestToken;
const dg = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), ih = "STX_PROVIDER", ah = () => typeof window > "u" ? null : window.localStorage.getItem(ih), pg = (t) => {
  typeof window < "u" && window.localStorage.setItem(ih, t);
}, bg = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function gg(t, e) {
  const n = {};
  return Object.assign(n, bg, e), await fetch(t, n);
}
function xg(t) {
  let e = gg, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function wg(...t) {
  const { fetchLib: e, middlewares: n } = xg(t);
  return async (s, o) => {
    let i = { url: s, init: o ?? {} };
    for (const c of n)
      typeof c.pre == "function" && (i = await Promise.resolve(c.pre({
        fetch: e,
        ...i
      })) ?? i);
    let a = await e(i.url, i.init);
    for (const c of n)
      typeof c.post == "function" && (a = await Promise.resolve(c.post({
        fetch: e,
        url: i.url,
        init: i.init,
        response: (a == null ? void 0 : a.clone()) ?? a
      })) ?? a);
    return a;
  };
}
var Dn;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Dn || (Dn = {}));
var on;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(on || (on = {}));
var wc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(wc || (wc = {}));
const yg = "https://api.mainnet.hiro.so", mg = "https://api.testnet.hiro.so", Sg = "http://localhost:3999", Eg = ["mainnet", "testnet", "devnet", "mocknet"];
class an {
  constructor(e) {
    this.version = on.Mainnet, this.chainId = Dn.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === on.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? wg();
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
an.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Ro();
    case "testnet":
      return new Go();
    case "devnet":
      return new Ag();
    case "mocknet":
      return new ch();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Eg.join(", ")}`);
  }
};
an.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : an.fromName(t);
class Ro extends an {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? yg,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = on.Mainnet, this.chainId = Dn.Mainnet;
  }
}
class Go extends an {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? mg,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = on.Testnet, this.chainId = Dn.Testnet;
  }
}
class ch extends an {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Sg,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = on.Testnet, this.chainId = Dn.Testnet;
  }
}
const Ag = ch;
var Vo;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Vo || (Vo = {}));
var yc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(yc || (yc = {}));
Vo.Mainnet;
var xs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(xs || (xs = {}));
var mc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(mc || (mc = {}));
xs.Mainnet;
const vg = 128, Bg = 128, lh = 16;
var Sc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Sc || (Sc = {}));
var Ec;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Ec || (Ec = {}));
var Tt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Tt || (Tt = {}));
const uo = ["onChainOnly", "offChainOnly", "any"];
uo[0] + "", Tt.OnChainOnly, uo[1] + "", Tt.OffChainOnly, uo[2] + "", Tt.Any, Tt.OnChainOnly + "", Tt.OnChainOnly, Tt.OffChainOnly + "", Tt.OffChainOnly, Tt.Any + "", Tt.Any;
var Ac;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Ac || (Ac = {}));
var vc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(vc || (vc = {}));
var Bc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Bc || (Bc = {}));
var $c;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})($c || ($c = {}));
var _c;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(_c || (_c = {}));
var Hc;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Hc || (Hc = {}));
var Lc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Lc || (Lc = {}));
var Ic;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Ic || (Ic = {}));
var Uc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Uc || (Uc = {}));
var Oc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Oc || (Oc = {}));
var Cc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Cc || (Cc = {}));
var kc;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(kc || (kc = {}));
var Pc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Pc || (Pc = {}));
let $g = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, _g = class extends $g {
  constructor(e) {
    super(e);
  }
};
function Ko(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Hg(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function fh(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Lg(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ko(t.outputLen), Ko(t.blockLen);
}
function Ig(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Ug(t, e) {
  fh(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const po = {
  number: Ko,
  bool: Hg,
  bytes: fh,
  hash: Lg,
  exists: Ig,
  output: Ug
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const bo = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Kt = (t, e) => t << 32 - e | t >>> e, Og = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Og)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Cg(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function hh(t) {
  if (typeof t == "string" && (t = Cg(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let kg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function un(t) {
  const e = (r) => t().update(hh(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Pg(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, h = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + h, a, r);
}
let Ci = class extends kg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = bo(this.buffer);
  }
  update(e) {
    po.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = hh(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = bo(e);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    po.exists(this), po.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let l = i; l < s; l++)
      n[l] = 0;
    Pg(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = bo(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const h = c / 4, f = this.get();
    if (h > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < h; l++)
      a.setUint32(4 * l, f[l], o);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return e.length = s, e.pos = a, e.finished = o, e.destroyed = i, s % n && e.buffer.set(r), e;
  }
};
const Ng = (t, e, n) => t & e ^ ~t & n, Dg = (t, e, n) => t & e ^ t & n ^ e & n, Tg = new Uint32Array([
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
]), Be = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), $e = new Uint32Array(64);
let uh = class extends Ci {
  constructor() {
    super(64, 32, 8, !1), this.A = Be[0] | 0, this.B = Be[1] | 0, this.C = Be[2] | 0, this.D = Be[3] | 0, this.E = Be[4] | 0, this.F = Be[5] | 0, this.G = Be[6] | 0, this.H = Be[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [e, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      $e[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = $e[l - 15], d = $e[l - 2], x = Kt(b, 7) ^ Kt(b, 18) ^ b >>> 3, w = Kt(d, 17) ^ Kt(d, 19) ^ d >>> 10;
      $e[l] = w + $e[l - 7] + x + $e[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: h, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const b = Kt(a, 6) ^ Kt(a, 11) ^ Kt(a, 25), d = f + b + Ng(a, c, h) + Tg[l] + $e[l] | 0, w = (Kt(r, 2) ^ Kt(r, 13) ^ Kt(r, 22)) + Dg(r, s, o) | 0;
      f = h, h = c, c = a, a = i + d | 0, i = o, o = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, h = h + this.G | 0, f = f + this.H | 0, this.set(r, s, o, i, a, c, h, f);
  }
  roundClean() {
    $e.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Fg = class extends uh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
un(() => new uh());
un(() => new Fg());
const Mg = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), dh = Uint8Array.from({ length: 16 }, (t, e) => e), Rg = dh.map((t) => (9 * t + 5) % 16);
let ki = [dh], Pi = [Rg];
for (let t = 0; t < 4; t++)
  for (let e of [ki, Pi])
    e.push(e[t].map((n) => Mg[n]));
const ph = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Gg = ki.map((t, e) => t.map((n) => ph[e][n])), Vg = Pi.map((t, e) => t.map((n) => ph[e][n])), Kg = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), zg = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), qr = (t, e) => t << e | t >>> 32 - e;
function Nc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Wr = new Uint32Array(16);
let jg = class extends Ci {
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
    for (let d = 0; d < 16; d++, n += 4)
      Wr[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, h = this.h3 | 0, f = h, l = this.h4 | 0, b = l;
    for (let d = 0; d < 5; d++) {
      const x = 4 - d, w = Kg[d], v = zg[d], H = ki[d], U = Pi[d], y = Gg[d], $ = Vg[d];
      for (let A = 0; A < 16; A++) {
        const P = qr(r + Nc(d, o, a, h) + Wr[H[A]] + w, y[A]) + l | 0;
        r = l, l = h, h = qr(a, 10) | 0, a = o, o = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = qr(s + Nc(x, i, c, f) + Wr[U[A]] + v, $[A]) + b | 0;
        s = b, b = f, f = qr(c, 10) | 0, c = i, i = P;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + h + b | 0, this.h3 + l + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Wr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
un(() => new jg());
const Xr = BigInt(2 ** 32 - 1), zo = BigInt(32);
function bh(t, e = !1) {
  return e ? { h: Number(t & Xr), l: Number(t >> zo & Xr) } : { h: Number(t >> zo & Xr) | 0, l: Number(t & Xr) | 0 };
}
function qg(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = bh(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const Wg = (t, e) => BigInt(t >>> 0) << zo | BigInt(e >>> 0), Xg = (t, e, n) => t >>> n, Yg = (t, e, n) => t << 32 - n | e >>> n, Jg = (t, e, n) => t >>> n | e << 32 - n, Zg = (t, e, n) => t << 32 - n | e >>> n, Qg = (t, e, n) => t << 64 - n | e >>> n - 32, tx = (t, e, n) => t >>> n - 32 | e << 64 - n, ex = (t, e) => e, nx = (t, e) => t, rx = (t, e, n) => t << n | e >>> 32 - n, sx = (t, e, n) => e << n | t >>> 32 - n, ox = (t, e, n) => e << n - 32 | t >>> 64 - n, ix = (t, e, n) => t << n - 32 | e >>> 64 - n;
function ax(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const cx = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), lx = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, fx = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), hx = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, ux = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), dx = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, z = {
  fromBig: bh,
  split: qg,
  toBig: Wg,
  shrSH: Xg,
  shrSL: Yg,
  rotrSH: Jg,
  rotrSL: Zg,
  rotrBH: Qg,
  rotrBL: tx,
  rotr32H: ex,
  rotr32L: nx,
  rotlSH: rx,
  rotlSL: sx,
  rotlBH: ox,
  rotlBL: ix,
  add: ax,
  add3L: cx,
  add3H: lx,
  add4L: fx,
  add4H: hx,
  add5H: dx,
  add5L: ux
}, [px, bx] = z.split([
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
].map((t) => BigInt(t))), _e = new Uint32Array(80), He = new Uint32Array(80);
let Ns = class extends Ci {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: h, El: f, Fh: l, Fl: b, Gh: d, Gl: x, Hh: w, Hl: v } = this;
    return [e, n, r, s, o, i, a, c, h, f, l, b, d, x, w, v];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, c, h, f, l, b, d, x, w, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = h | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = b | 0, this.Gh = d | 0, this.Gl = x | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let y = 0; y < 16; y++, n += 4)
      _e[y] = e.getUint32(n), He[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const $ = _e[y - 15] | 0, A = He[y - 15] | 0, P = z.rotrSH($, A, 1) ^ z.rotrSH($, A, 8) ^ z.shrSH($, A, 7), F = z.rotrSL($, A, 1) ^ z.rotrSL($, A, 8) ^ z.shrSL($, A, 7), O = _e[y - 2] | 0, C = He[y - 2] | 0, g = z.rotrSH(O, C, 19) ^ z.rotrBH(O, C, 61) ^ z.shrSH(O, C, 6), E = z.rotrSL(O, C, 19) ^ z.rotrBL(O, C, 61) ^ z.shrSL(O, C, 6), L = z.add4L(F, E, He[y - 7], He[y - 16]), k = z.add4H(L, P, g, _e[y - 7], _e[y - 16]);
      _e[y] = k | 0, He[y] = L | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: h, Dl: f, Eh: l, El: b, Fh: d, Fl: x, Gh: w, Gl: v, Hh: H, Hl: U } = this;
    for (let y = 0; y < 80; y++) {
      const $ = z.rotrSH(l, b, 14) ^ z.rotrSH(l, b, 18) ^ z.rotrBH(l, b, 41), A = z.rotrSL(l, b, 14) ^ z.rotrSL(l, b, 18) ^ z.rotrBL(l, b, 41), P = l & d ^ ~l & w, F = b & x ^ ~b & v, O = z.add5L(U, A, F, bx[y], He[y]), C = z.add5H(O, H, $, P, px[y], _e[y]), g = O | 0, E = z.rotrSH(r, s, 28) ^ z.rotrBH(r, s, 34) ^ z.rotrBH(r, s, 39), L = z.rotrSL(r, s, 28) ^ z.rotrBL(r, s, 34) ^ z.rotrBL(r, s, 39), k = r & o ^ r & a ^ o & a, M = s & i ^ s & c ^ i & c;
      H = w | 0, U = v | 0, w = d | 0, v = x | 0, d = l | 0, x = b | 0, { h: l, l: b } = z.add(h | 0, f | 0, C | 0, g | 0), h = a | 0, f = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const N = z.add3L(g, L, M);
      r = z.add3H(N, C, E, k), s = N | 0;
    }
    ({ h: r, l: s } = z.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = z.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = z.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h, l: f } = z.add(this.Dh | 0, this.Dl | 0, h | 0, f | 0), { h: l, l: b } = z.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h: d, l: x } = z.add(this.Fh | 0, this.Fl | 0, d | 0, x | 0), { h: w, l: v } = z.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: H, l: U } = z.add(this.Hh | 0, this.Hl | 0, H | 0, U | 0), this.set(r, s, o, i, a, c, h, f, l, b, d, x, w, v, H, U);
  }
  roundClean() {
    _e.fill(0), He.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, gx = class extends Ns {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, xx = class extends Ns {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, wx = class extends Ns {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
un(() => new Ns());
un(() => new gx());
un(() => new xx());
un(() => new wx());
var lt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(lt || (lt = {}));
var jo;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(jo || (jo = {}));
function Ni(t) {
  return jo[t];
}
var ws;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ws || (ws = {}));
function gh(t, e, n) {
  const s = vg;
  if (Ux(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ws.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
function xh(t) {
  const e = Rn.c32addressDecode(t);
  return {
    type: ws.Address,
    version: e[0],
    hash160: e[1]
  };
}
function wh(t) {
  const e = [];
  return e.push($t(Ei(t.version, 1))), e.push($t(t.hash160)), Kn(e);
}
function yh(t) {
  const e = [], n = br(t.content), r = n.byteLength;
  return e.push($t(Ei(r, t.lengthPrefixBytes))), e.push(n), Kn(e);
}
function Jt(t, e) {
  return Kn([Ni(t), e]);
}
function yx(t) {
  return new Uint8Array([Ni(t.type)]);
}
function mx(t) {
  return t.type === lt.OptionalNone ? new Uint8Array([Ni(t.type)]) : Jt(t.type, xr(t.value));
}
function Sx(t) {
  const e = new Uint8Array(4);
  return Hs(e, Math.ceil(t.value.length / 2), 0), Jt(t.type, ae(e, $t(t.value)));
}
function Ex(t) {
  const e = xf(Fp(BigInt(t.value), BigInt(Bg)), lh);
  return Jt(t.type, e);
}
function Ax(t) {
  const e = xf(BigInt(t.value), lh);
  return Jt(t.type, e);
}
function vx(t) {
  return Jt(t.type, wh(xh(t.value)));
}
function Bx(t) {
  const [e, n] = Ox(t.value);
  return Jt(t.type, ae(wh(xh(e)), yh(gh(n))));
}
function $x(t) {
  return Jt(t.type, xr(t.value));
}
function _x(t) {
  const e = [], n = new Uint8Array(4);
  Hs(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = xr(r);
    e.push(s);
  }
  return Jt(t.type, Kn(e));
}
function Hx(t) {
  const e = [], n = new Uint8Array(4);
  Hs(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = gh(s);
    e.push(yh(o));
    const i = xr(t.value[s]);
    e.push(i);
  }
  return Jt(t.type, Kn(e));
}
function mh(t, e) {
  const n = [], r = e == "ascii" ? Rp(t.value) : br(t.value), s = new Uint8Array(4);
  return Hs(s, r.length, 0), n.push(s), n.push(r), Jt(t.type, Kn(n));
}
function Lx(t) {
  return mh(t, "ascii");
}
function Ix(t) {
  return mh(t, "utf8");
}
function Dc(t) {
  return Ut(xr(t));
}
function xr(t) {
  switch (t.type) {
    case lt.BoolTrue:
    case lt.BoolFalse:
      return yx(t);
    case lt.OptionalNone:
    case lt.OptionalSome:
      return mx(t);
    case lt.Buffer:
      return Sx(t);
    case lt.UInt:
      return Ax(t);
    case lt.Int:
      return Ex(t);
    case lt.PrincipalStandard:
      return vx(t);
    case lt.PrincipalContract:
      return Bx(t);
    case lt.ResponseOk:
    case lt.ResponseErr:
      return $x(t);
    case lt.List:
      return _x(t);
    case lt.Tuple:
      return Hx(t);
    case lt.StringASCII:
      return Lx(t);
    case lt.StringUTF8:
      return Ix(t);
    default:
      throw new _g("Unable to serialize. Invalid Clarity Value.");
  }
}
const Ux = (t, e) => t ? br(t).length > e : !1;
function Ox(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
function Cx(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = cr(r);
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
    return BigInt(`0x${Nx(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Di(t, e = 8) {
  return (typeof t == "bigint" ? t : Cx(t)).toString(16).padStart(e * 2, "0");
}
function Sh(t, e = 16) {
  const n = Di(t, e);
  return cr(n);
}
function kx(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const Px = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Nx(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Px[n];
  return e;
}
function cr(t) {
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
function Ti(t) {
  return new TextEncoder().encode(t);
}
function Dx(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Tx(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Tc(t) {
  if (t.some(Tx))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Fi(...t) {
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
function zn(t) {
  return Fi(...t.map((e) => typeof e == "number" ? Tc([e]) : e instanceof Array ? Tc(e) : e));
}
function Ds(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var qo;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(qo || (qo = {}));
qo.Mainnet;
const Fx = 128, Mx = 128, Eh = 16;
var Wo;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Wo || (Wo = {}));
var Fc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Fc || (Fc = {}));
var Mc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Mc || (Mc = {}));
var Ft;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ft || (Ft = {}));
const go = ["onChainOnly", "offChainOnly", "any"];
go[0] + "", Ft.OnChainOnly, go[1] + "", Ft.OffChainOnly, go[2] + "", Ft.Any, Ft.OnChainOnly + "", Ft.OnChainOnly, Ft.OffChainOnly + "", Ft.OffChainOnly, Ft.Any + "", Ft.Any;
var Xo;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Xo || (Xo = {}));
Xo.Mainnet;
var Rc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Rc || (Rc = {}));
var Gc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Gc || (Gc = {}));
var Vc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Vc || (Vc = {}));
var Kc;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Kc || (Kc = {}));
var zc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(zc || (zc = {}));
var jc;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(jc || (jc = {}));
var qc;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(qc || (qc = {}));
var Wc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Wc || (Wc = {}));
var Xc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Xc || (Xc = {}));
var Yc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Yc || (Yc = {}));
var Jc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Jc || (Jc = {}));
function Yo(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Rx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Ah(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Gx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Yo(t.outputLen), Yo(t.blockLen);
}
function Vx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Kx(t, e) {
  Ah(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const xo = {
  number: Yo,
  bool: Rx,
  bytes: Ah,
  hash: Gx,
  exists: Vx,
  output: Kx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const wo = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), zt = (t, e) => t << 32 - e | t >>> e, zx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!zx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function jx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function vh(t) {
  if (typeof t == "string" && (t = jx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class qx {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function dn(t) {
  const e = (r) => t().update(vh(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Wx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, h = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + h, a, r);
}
class Mi extends qx {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = wo(this.buffer);
  }
  update(e) {
    xo.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = vh(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = wo(e);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    xo.exists(this), xo.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let l = i; l < s; l++)
      n[l] = 0;
    Wx(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = wo(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const h = c / 4, f = this.get();
    if (h > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < h; l++)
      a.setUint32(4 * l, f[l], o);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return e.length = s, e.pos = a, e.finished = o, e.destroyed = i, s % n && e.buffer.set(r), e;
  }
}
const Xx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Bh = Uint8Array.from({ length: 16 }, (t, e) => e), Yx = Bh.map((t) => (9 * t + 5) % 16);
let Ri = [Bh], Gi = [Yx];
for (let t = 0; t < 4; t++)
  for (let e of [Ri, Gi])
    e.push(e[t].map((n) => Xx[n]));
const $h = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Jx = Ri.map((t, e) => t.map((n) => $h[e][n])), Zx = Gi.map((t, e) => t.map((n) => $h[e][n])), Qx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), tw = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Yr = (t, e) => t << e | t >>> 32 - e;
function Zc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Jr = new Uint32Array(16);
class ew extends Mi {
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
    for (let d = 0; d < 16; d++, n += 4)
      Jr[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, h = this.h3 | 0, f = h, l = this.h4 | 0, b = l;
    for (let d = 0; d < 5; d++) {
      const x = 4 - d, w = Qx[d], v = tw[d], H = Ri[d], U = Gi[d], y = Jx[d], $ = Zx[d];
      for (let A = 0; A < 16; A++) {
        const P = Yr(r + Zc(d, o, a, h) + Jr[H[A]] + w, y[A]) + l | 0;
        r = l, l = h, h = Yr(a, 10) | 0, a = o, o = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = Yr(s + Zc(x, i, c, f) + Jr[U[A]] + v, $[A]) + b | 0;
        s = b, b = f, f = Yr(c, 10) | 0, c = i, i = P;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + h + b | 0, this.h3 + l + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Jr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
dn(() => new ew());
const nw = (t, e, n) => t & e ^ ~t & n, rw = (t, e, n) => t & e ^ t & n ^ e & n, sw = new Uint32Array([
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
]), Le = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ie = new Uint32Array(64);
class _h extends Mi {
  constructor() {
    super(64, 32, 8, !1), this.A = Le[0] | 0, this.B = Le[1] | 0, this.C = Le[2] | 0, this.D = Le[3] | 0, this.E = Le[4] | 0, this.F = Le[5] | 0, this.G = Le[6] | 0, this.H = Le[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [e, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      Ie[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = Ie[l - 15], d = Ie[l - 2], x = zt(b, 7) ^ zt(b, 18) ^ b >>> 3, w = zt(d, 17) ^ zt(d, 19) ^ d >>> 10;
      Ie[l] = w + Ie[l - 7] + x + Ie[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: h, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const b = zt(a, 6) ^ zt(a, 11) ^ zt(a, 25), d = f + b + nw(a, c, h) + sw[l] + Ie[l] | 0, w = (zt(r, 2) ^ zt(r, 13) ^ zt(r, 22)) + rw(r, s, o) | 0;
      f = h, h = c, c = a, a = i + d | 0, i = o, o = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, h = h + this.G | 0, f = f + this.H | 0, this.set(r, s, o, i, a, c, h, f);
  }
  roundClean() {
    Ie.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class ow extends _h {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
dn(() => new _h());
dn(() => new ow());
const Zr = BigInt(2 ** 32 - 1), Jo = BigInt(32);
function Hh(t, e = !1) {
  return e ? { h: Number(t & Zr), l: Number(t >> Jo & Zr) } : { h: Number(t >> Jo & Zr) | 0, l: Number(t & Zr) | 0 };
}
function iw(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = Hh(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const aw = (t, e) => BigInt(t >>> 0) << Jo | BigInt(e >>> 0), cw = (t, e, n) => t >>> n, lw = (t, e, n) => t << 32 - n | e >>> n, fw = (t, e, n) => t >>> n | e << 32 - n, hw = (t, e, n) => t << 32 - n | e >>> n, uw = (t, e, n) => t << 64 - n | e >>> n - 32, dw = (t, e, n) => t >>> n - 32 | e << 64 - n, pw = (t, e) => e, bw = (t, e) => t, gw = (t, e, n) => t << n | e >>> 32 - n, xw = (t, e, n) => e << n | t >>> 32 - n, ww = (t, e, n) => e << n - 32 | t >>> 64 - n, yw = (t, e, n) => t << n - 32 | e >>> 64 - n;
function mw(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Sw = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Ew = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Aw = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), vw = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Bw = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), $w = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, j = {
  fromBig: Hh,
  split: iw,
  toBig: aw,
  shrSH: cw,
  shrSL: lw,
  rotrSH: fw,
  rotrSL: hw,
  rotrBH: uw,
  rotrBL: dw,
  rotr32H: pw,
  rotr32L: bw,
  rotlSH: gw,
  rotlSL: xw,
  rotlBH: ww,
  rotlBL: yw,
  add: mw,
  add3L: Sw,
  add3H: Ew,
  add4L: Aw,
  add4H: vw,
  add5H: $w,
  add5L: Bw
}, [_w, Hw] = j.split([
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
].map((t) => BigInt(t))), Ue = new Uint32Array(80), Oe = new Uint32Array(80);
class Ts extends Mi {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: h, El: f, Fh: l, Fl: b, Gh: d, Gl: x, Hh: w, Hl: v } = this;
    return [e, n, r, s, o, i, a, c, h, f, l, b, d, x, w, v];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, c, h, f, l, b, d, x, w, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = h | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = b | 0, this.Gh = d | 0, this.Gl = x | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let y = 0; y < 16; y++, n += 4)
      Ue[y] = e.getUint32(n), Oe[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const $ = Ue[y - 15] | 0, A = Oe[y - 15] | 0, P = j.rotrSH($, A, 1) ^ j.rotrSH($, A, 8) ^ j.shrSH($, A, 7), F = j.rotrSL($, A, 1) ^ j.rotrSL($, A, 8) ^ j.shrSL($, A, 7), O = Ue[y - 2] | 0, C = Oe[y - 2] | 0, g = j.rotrSH(O, C, 19) ^ j.rotrBH(O, C, 61) ^ j.shrSH(O, C, 6), E = j.rotrSL(O, C, 19) ^ j.rotrBL(O, C, 61) ^ j.shrSL(O, C, 6), L = j.add4L(F, E, Oe[y - 7], Oe[y - 16]), k = j.add4H(L, P, g, Ue[y - 7], Ue[y - 16]);
      Ue[y] = k | 0, Oe[y] = L | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: h, Dl: f, Eh: l, El: b, Fh: d, Fl: x, Gh: w, Gl: v, Hh: H, Hl: U } = this;
    for (let y = 0; y < 80; y++) {
      const $ = j.rotrSH(l, b, 14) ^ j.rotrSH(l, b, 18) ^ j.rotrBH(l, b, 41), A = j.rotrSL(l, b, 14) ^ j.rotrSL(l, b, 18) ^ j.rotrBL(l, b, 41), P = l & d ^ ~l & w, F = b & x ^ ~b & v, O = j.add5L(U, A, F, Hw[y], Oe[y]), C = j.add5H(O, H, $, P, _w[y], Ue[y]), g = O | 0, E = j.rotrSH(r, s, 28) ^ j.rotrBH(r, s, 34) ^ j.rotrBH(r, s, 39), L = j.rotrSL(r, s, 28) ^ j.rotrBL(r, s, 34) ^ j.rotrBL(r, s, 39), k = r & o ^ r & a ^ o & a, M = s & i ^ s & c ^ i & c;
      H = w | 0, U = v | 0, w = d | 0, v = x | 0, d = l | 0, x = b | 0, { h: l, l: b } = j.add(h | 0, f | 0, C | 0, g | 0), h = a | 0, f = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const N = j.add3L(g, L, M);
      r = j.add3H(N, C, E, k), s = N | 0;
    }
    ({ h: r, l: s } = j.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = j.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = j.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h, l: f } = j.add(this.Dh | 0, this.Dl | 0, h | 0, f | 0), { h: l, l: b } = j.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h: d, l: x } = j.add(this.Fh | 0, this.Fl | 0, d | 0, x | 0), { h: w, l: v } = j.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: H, l: U } = j.add(this.Hh | 0, this.Hl | 0, H | 0, U | 0), this.set(r, s, o, i, a, c, h, f, l, b, d, x, w, v, H, U);
  }
  roundClean() {
    Ue.fill(0), Oe.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class Lw extends Ts {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class Iw extends Ts {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class Uw extends Ts {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
dn(() => new Ts());
dn(() => new Lw());
dn(() => new Iw());
dn(() => new Uw());
function Ow(t, e, n) {
  const s = Fx;
  if (qw(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Wo.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var ft;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(ft || (ft = {}));
class Cw extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class kw extends Cw {
  constructor(e) {
    super(e);
  }
}
function Lh(t) {
  const e = [];
  return e.push(cr(Di(t.version, 1))), e.push(cr(t.hash160)), zn(e);
}
function Ih(t) {
  const e = [], n = Ti(t.content), r = n.byteLength;
  return e.push(cr(Di(r, t.lengthPrefixBytes))), e.push(n), zn(e);
}
function Zt(t, e) {
  return zn([t, e]);
}
function Pw(t) {
  return new Uint8Array([t.type]);
}
function Nw(t) {
  return t.type === ft.OptionalNone ? new Uint8Array([t.type]) : Zt(t.type, Tn(t.value));
}
function Dw(t) {
  const e = new Uint8Array(4);
  return Ds(e, t.buffer.length, 0), Zt(t.type, Fi(e, t.buffer));
}
function Tw(t) {
  const e = Sh(kx(t.value, BigInt(Mx)), Eh);
  return Zt(t.type, e);
}
function Fw(t) {
  const e = Sh(t.value, Eh);
  return Zt(t.type, e);
}
function Mw(t) {
  return Zt(t.type, Lh(t.address));
}
function Rw(t) {
  return Zt(t.type, Fi(Lh(t.address), Ih(t.contractName)));
}
function Gw(t) {
  return Zt(t.type, Tn(t.value));
}
function Vw(t) {
  const e = [], n = new Uint8Array(4);
  Ds(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Tn(r);
    e.push(s);
  }
  return Zt(t.type, zn(e));
}
function Kw(t) {
  const e = [], n = new Uint8Array(4);
  Ds(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = Ow(s);
    e.push(Ih(o));
    const i = Tn(t.data[s]);
    e.push(i);
  }
  return Zt(t.type, zn(e));
}
function Uh(t, e) {
  const n = [], r = e == "ascii" ? Dx(t.data) : Ti(t.data), s = new Uint8Array(4);
  return Ds(s, r.length, 0), n.push(s), n.push(r), Zt(t.type, zn(n));
}
function zw(t) {
  return Uh(t, "ascii");
}
function jw(t) {
  return Uh(t, "utf8");
}
function Tn(t) {
  switch (t.type) {
    case ft.BoolTrue:
    case ft.BoolFalse:
      return Pw(t);
    case ft.OptionalNone:
    case ft.OptionalSome:
      return Nw(t);
    case ft.Buffer:
      return Dw(t);
    case ft.UInt:
      return Fw(t);
    case ft.Int:
      return Tw(t);
    case ft.PrincipalStandard:
      return Mw(t);
    case ft.PrincipalContract:
      return Rw(t);
    case ft.ResponseOk:
    case ft.ResponseErr:
      return Gw(t);
    case ft.List:
      return Vw(t);
    case ft.Tuple:
      return Kw(t);
    case ft.StringASCII:
      return zw(t);
    case ft.StringUTF8:
      return jw(t);
    default:
      throw new kw("Unable to serialize. Invalid Clarity Value.");
  }
}
const qw = (t, e) => t ? Ti(t).length > e : !1;
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var Ww = Object.defineProperty, Xw = Object.defineProperties, Yw = Object.getOwnPropertyDescriptors, ys = Object.getOwnPropertySymbols, Oh = Object.prototype.hasOwnProperty, Ch = Object.prototype.propertyIsEnumerable, Qc = (t, e, n) => e in t ? Ww(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Zo = (t, e) => {
  for (var n in e || (e = {})) Oh.call(e, n) && Qc(t, n, e[n]);
  if (ys) for (var n of ys(e)) Ch.call(e, n) && Qc(t, n, e[n]);
  return t;
}, Qo = (t, e) => Xw(t, Yw(e)), Jw = (t, e) => {
  var n = {};
  for (var r in t) Oh.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && ys) for (var r of ys(t)) e.indexOf(r) < 0 && Ch.call(t, r) && (n[r] = t[r]);
  return n;
};
function Zw(t) {
  return t ? typeof t == "string" ? an.fromName(t) : "version" in t ? t : "url" in t ? new Ro({ url: t.url }) : t.transactionVersion === xs.Mainnet ? new Ro({ url: t.client.baseUrl }) : new Go({ url: t.client.baseUrl }) : new Go();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var Qw = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(Qw || {}), ty = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(ty || {}), kh = (t) => {
  let e = t;
  if (!e) {
    let n = new yf(["store_write"], document.location.href);
    e = new Mo({ appConfig: n });
  }
  return e;
};
function ey(t) {
  try {
    return kh(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var ny = (t) => {
  let e = kh(t).loadUserData().appPrivateKey, n = xt.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function Ph(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? Qo(Zo({}, t), { message: Dc(e), domain: Dc(n) }) : Qo(Zo({}, t), { message: Ut(Tn(e)), domain: Ut(Tn(n)) });
}
async function ry(t, e) {
  return new xt.TokenSigner("ES256k", e).signAsync(Ph(t));
}
async function sy(t) {
  let e = t, { userSession: n } = e, r = Jw(e, ["userSession"]);
  if (ey(n)) {
    let { privateKey: s, publicKey: o } = ny(n), i = Qo(Zo({}, r), { publicKey: o });
    return ry(i, s);
  }
  return xt.createUnsecuredToken(Ph(t));
}
var oy = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(oy || {}), Nh = "asigna-stx", tl = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === Nh && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(ay(t, e), "*");
}), iy = { authenticationRequest: async (t) => tl(t, "authenticationRequest"), transactionRequest: async (t) => tl(t, "transactionRequest") }, ay = (t, e) => ({ source: Nh, [e]: t }), cy = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = iy);
};
cy();
const ly = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], Vi = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Fs = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, rr = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, fy = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Dh = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((o) => fy(o, r)) === s
  );
}, hy = (t) => t ? Dh(Fs()).some(
  (e) => {
    var n;
    return e.id === t && (Vi(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, uy = () => {
  if (typeof window > "u")
    return;
  const t = Fs(), e = Dh(t).filter(
    (n) => {
      var r;
      return Vi(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = rr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of ly) {
    const r = rr(t, n) ?? (t === window ? void 0 : rr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, dy = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Fs(), n = rr(e, t) ?? (e === window ? void 0 : rr(window, t)) ?? dg(t);
  if (n)
    return n;
  if (Vi(t) || hy(t))
    return uy();
}, py = ["blockstack-session", "blockstack"], by = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of py) {
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
by();
const gy = () => ah(), xy = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = ah(), e = t ? dy(t) : void 0;
  if (e)
    return e;
  const n = Fs() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, wy = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), el = (t) => pf(t).replace(/^0x/, ""), nl = "This wallet cannot sign messages. Try Xverse or Leather.", rl = (t) => typeof (t == null ? void 0 : t.request) == "function", sl = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", yy = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, my = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function Sy(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: el(e.message),
    domain: el(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Ey(t, e) {
  const n = await sy({
    domain: e.domain,
    message: e.message,
    network: Zw(e.network),
    stxAddress: e.stxAddress,
    appDetails: e.appDetails ?? wy()
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Ay(t) {
  var s, o;
  const e = gy() || "", n = /xverse/i.test(e);
  let r = xy();
  if (n && !sl(r)) {
    const i = window;
    r = ((s = i.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((o = i.xverseProviders) == null ? void 0 : o.StacksProvider);
  }
  if (sl(r))
    try {
      return await Ey(r, t);
    } catch (i) {
      if (n || !rl(r) || !my(i)) throw i;
    }
  if (!n && rl(r))
    try {
      return await Sy(r, t);
    } catch (i) {
      throw yy(i) ? new Error(nl) : i;
    }
  throw new Error(nl);
}
function vy(t, e, n = {}) {
  const r = n.retryAfterMs ?? 3e4, s = n.now ?? Date.now, o = /* @__PURE__ */ new Map(), i = (a, c) => {
    c.pending = !0, c.failedAt = void 0, Promise.resolve().then(() => t(a)).then((h) => {
      c.pending = !1, h && (c.name = h, e());
    }).catch(() => {
      c.pending = !1, c.failedAt = s();
    });
  };
  return {
    get(a) {
      if (!a) return null;
      let c = o.get(a);
      return c ? !c.pending && c.name === null && c.failedAt !== void 0 && s() - c.failedAt >= r && i(a, c) : (c = { name: null, pending: !1 }, o.set(a, c), i(a, c)), c.name;
    }
  };
}
const By = {}, $y = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, _y = (t) => {
  const e = By;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, Hy = (t) => `/hiro/${t}`, Ly = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, Iy = (t) => {
  const e = _y(t);
  if (e)
    return [Ly(e)];
  const n = $y[t];
  return typeof window < "u" ? [`${window.location.origin}${Hy(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, Uy = {}, ol = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, Oy = "xtrata.log.enabled", Cy = "xtrata.log.level", ky = "xtrata.log.tags", Py = "xtrata.log.dedupe", Qr = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, Ny = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, Dy = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, Ty = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, Fy = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, My = () => {
  const t = Uy ?? {}, e = Qr(Oy) ?? t.VITE_LOG_ENABLED, n = Qr(Cy) ?? t.VITE_LOG_LEVEL, r = Qr(ky) ?? t.VITE_LOG_TAGS, s = Qr(Py) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: Ny(e),
    level: Dy(n) ?? "warn",
    tags: Fy(r),
    dedupe: Ty(s)
  };
}, Ry = (t, e, n) => !t.enabled || ol[n] < ol[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), Gy = (t, e, n, r) => {
  const s = My();
  if (!Ry(s, e, t) || Ky(s.dedupe))
    return;
  const o = `[xtrata:${e}] ${n}`, i = console[t] ?? console.log;
  r !== void 0 ? i(o, r) : i(o);
}, Vy = /* @__PURE__ */ new Set();
let il = null;
const Ky = (t, e, n, r, s) => (il !== t && (Vy.clear(), il = t), !1), zy = (t, e, n) => Gy("debug", t, e, n), jy = {}, qy = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, Wy = (t) => {
  const e = jy, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : qy[t];
}, Xy = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, Yy = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return Xy.test(n) ? n : null;
}, Jy = (t) => t.replace(/\/+$/, ""), Zy = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), al = (t) => {
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
}, An = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, Qy = (t) => {
  var c, h;
  let e;
  try {
    e = vn(Bp(t));
  } catch {
    return null;
  }
  const n = An(e);
  if (!n || n.success === !1)
    return null;
  const r = An(n.value), s = An(r == null ? void 0 : r.value), o = An(s == null ? void 0 : s.value);
  if (!o)
    return null;
  const i = al((c = An(o.name)) == null ? void 0 : c.value), a = al((h = An(o.namespace)) == null ? void 0 : h.value);
  return !i || !a ? null : Yy(`${i}.${a}`);
}, t3 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${Jy(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [pf(Wd(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const o = await s.json();
  return !(o != null && o.okay) || typeof o.result != "string" ? null : Qy(o.result);
}, e3 = async (t) => {
  const e = t.address.trim();
  if (!$p(e))
    return null;
  const n = Wy(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of Iy(t.network))
    try {
      return await t3({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (o) {
      r = o;
    }
  return zy("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: Zy(r)
  }), null;
}, n3 = "ParallaX Casino", r3 = "ParallaX Casino room sign-in. This is free: it sends no transaction, costs no fees and gives no permission to spend anything.";
new TextEncoder();
new TextDecoder();
const s3 = (t) => t === "mainnet" ? 1 : 2147483648, o3 = (t) => `${r3} Account ${t.address}. Valid until ${new Date(t.expires).toISOString().replace(".000Z", "Z")}. Request code ${t.nonce}.`, i3 = (t) => ({
  domain: cf({
    name: ss(n3),
    version: ss("1"),
    "chain-id": af(s3(t.network))
  }),
  message: ss(o3(t))
}), ts = (t) => !!t && typeof t.request == "function", Ki = () => {
  try {
    const t = window.top;
    if (t && t !== window.self && t.location.origin === window.location.origin) return t;
  } catch {
  }
  return window;
}, a3 = () => {
  const t = Ki();
  return t === window ? [window] : [t, window];
}, cl = (t) => {
  for (const e of a3()) {
    const n = t(e);
    if (n) return n;
  }
  return null;
}, c3 = (t) => {
  if (t === "leather") {
    const n = cl((r) => ts(r.LeatherProvider) ? r.LeatherProvider : null);
    return n ? { rpc: n } : null;
  }
  const e = cl((n) => {
    const r = n.XverseProviders || n.xverseProviders;
    return r && (ts(r.BitcoinProvider) || ts(r.StacksProvider)) ? r : null;
  });
  return e ? { rpc: ts(e.BitcoinProvider) ? e.BitcoinProvider : e.StacksProvider } : null;
}, l3 = (t, e) => new Promise((n) => {
  const r = Date.now();
  (function s() {
    const o = c3(t);
    o || Date.now() - r >= e ? n(o) : window.setTimeout(s, 150);
  })();
}), ms = (t) => {
  var e;
  return (t == null ? void 0 : t.code) ?? ((e = t == null ? void 0 : t.error) == null ? void 0 : e.code);
}, tn = (t) => {
  var e;
  return String((t == null ? void 0 : t.message) ?? ((e = t == null ? void 0 : t.error) == null ? void 0 : e.message) ?? t ?? "unknown error");
}, f3 = (t) => [4001, -31001].includes(Number(ms(t))) || /cancel|denied|reject|declin|closed/i.test(tn(t)), ll = (t) => Number(ms(t)) === -32601 || /not supported|method not found|unsupported|not implemented|legacy method/i.test(tn(t)), yo = async (t, e, n) => {
  const r = n === void 0 ? await t.request(e) : await t.request(e, n);
  if (r && typeof r == "object") {
    if (r.error) throw Object.assign(new Error(tn(r.error)), { code: ms(r.error) });
    if (r.status === "error") throw Object.assign(new Error(tn(r.error || r)), { code: ms(r.error || r) });
    if ("result" in r) return r.result;
  }
  return r;
}, h3 = (t) => new Promise((e, n) => {
  const r = window.setTimeout(() => n(new Error("The wallet did not answer. Check its window.")), 9e4);
  t.then((s) => {
    window.clearTimeout(r), e(s);
  }, (s) => {
    window.clearTimeout(r), n(s);
  });
}), u3 = (t) => (JSON.stringify(t) || "").match(/S[PT][0-9A-HJKMNP-TV-Z]{38,39}/g) || [], Ce = [], lr = () => {
  const t = Ki().ParallaxCasinoWalletUI ?? window.ParallaxCasinoWalletUI;
  try {
    return t && t.available() ? t : null;
  } catch {
    return null;
  }
}, d3 = (t) => {
  const e = Ki().ParallaxPasskeyWallet ?? window.ParallaxPasskeyWallet;
  return e != null && e.signRoomJoin ? e.signRoomJoin(t) : Promise.reject(new Error("The casino wallet is not loaded. Reload the page."));
};
async function p3(t) {
  if (t === "casino") {
    const s = lr();
    if (!s) throw new Error("The casino wallet is not available here yet. Reload the page.");
    const o = await s.open();
    if (!o) throw new Error("The casino wallet did not open.");
    return { kind: t, address: o, network: o.startsWith("SP") ? "mainnet" : "testnet", via: "casino-wallet" };
  }
  const e = await l3(t, 1500);
  if (!e) throw new Error(`${t === "leather" ? "Leather" : "Xverse"} was not found in this browser.`);
  Ce.length = 0;
  let n;
  if (t === "xverse") {
    try {
      await yo(e.rpc, "wallet_disconnect"), Ce.push("wallet_disconnect: ok");
    } catch (s) {
      Ce.push("wallet_disconnect: " + tn(s).slice(0, 80));
    }
    n = ["wallet_connect", "wallet_getAccount"];
  } else
    n = ["getAddresses", "stx_getAccounts", "stx_getAddresses", "stx_requestAccounts"];
  let r = null;
  for (const s of n)
    try {
      const o = await (t === "xverse" ? h3(yo(e.rpc, s)) : yo(e.rpc, s)), i = u3(o);
      if (i.length) {
        const a = i[0];
        return Ce.push(`${s}: ok`), { kind: t, address: a, network: a.startsWith("SP") ? "mainnet" : "testnet", via: s };
      }
      Ce.push(`${s}: answered but no Stacks address in it`);
    } catch (o) {
      if (f3(o))
        throw Ce.push(`${s}: cancelled`), new Error("Connection cancelled.");
      Ce.push(`${s}: ${ll(o) ? "not supported" : tn(o).slice(0, 80)}`), ll(o) || (r = o);
    }
  throw new Error(r ? tn(r) : "The wallet did not share a Stacks address.");
}
const Th = (t) => {
  t !== "casino" && pg(t === "leather" ? "LeatherProvider" : "XverseProviders.BitcoinProvider");
}, Ss = (t) => t instanceof Error ? t.message : String(t), mo = 500, Fh = 40, b3 = 2e3, fr = 280, fl = "px_room_blocks_v1", hl = "px_chat_ui_v1", So = "px_chat_session_v1:", ul = { hidden: !1, side: "left" }, g3 = [
  { code: "spam", label: "Spam" },
  { code: "abuse", label: "Abuse" },
  { code: "scam", label: "Scam" },
  { code: "other", label: "Something else" }
], x3 = (t) => {
  if (!Array.isArray(t)) return [];
  const e = [];
  for (const n of t)
    if (!(typeof n != "string" || !/^S[A-Z0-9]{19,60}$/.test(n) || e.includes(n)) && (e.push(n), e.length >= Fh))
      break;
  return e;
}, w3 = (t) => {
  if (!t) return [];
  try {
    return x3(JSON.parse(t));
  } catch {
    return [];
  }
}, y3 = (t) => {
  if (!t) return { ...ul };
  try {
    const e = JSON.parse(t);
    return { hidden: (e == null ? void 0 : e.hidden) === !0, side: (e == null ? void 0 : e.side) === "right" ? "right" : "left" };
  } catch {
    return { ...ul };
  }
}, Mh = {
  "no-links": "Links are not allowed in messages.",
  "too-long": `That message is too long (${fr} characters at most).`,
  empty: "Type something first.",
  "bad-message": "That message could not be sent.",
  "slow-down": "Slow down a little: one message every two seconds.",
  "sign-in-first": "Join the room first to chat.",
  blocked: "You have blocked this person.",
  "not-you": "You cannot do that to yourself.",
  "not-here": "That person has left the room.",
  "no-such-player": "That person is not in the room.",
  gone: "That person has left the room.",
  "too-many-blocks": "Your block list is full (40 people).",
  "rate-limited": "You are sending too much. Wait a moment.",
  "no-table": "Sit at a table (or stand by one) to talk to that table."
}, m3 = (t) => typeof t == "string" && Object.prototype.hasOwnProperty.call(Mh, t), Qn = (t) => Mh[String(t)] ?? "The room could not take that. Try again in a moment.", S3 = (t) => t.replace(/\s+/g, " ").trim(), E3 = (t) => Array.from(t).length, A3 = (t, e) => {
  const n = S3(t);
  return e.signed ? e.connected ? n ? E3(n) > fr ? { ok: !1, code: "too-long" } : e.now - e.lastSentAt < b3 ? { ok: !1, code: "slow-down" } : { ok: !0, text: n } : { ok: !1, code: "empty" } : { ok: !1, code: "offline" } : { ok: !1, code: "sign-in-first" };
};
class v3 {
  constructor() {
    mn(this, "lines", []);
    mn(this, "seq", 0);
    mn(this, "blocked", /* @__PURE__ */ new Set());
  }
  setBlocked(e) {
    this.blocked = new Set(e);
  }
  add(e, n, r, s, o, i) {
    if (e && !r && this.blocked.has(e.a)) return null;
    const a = { id: this.seq += 1, who: e, mine: r, text: n, at: s };
    return o && (a.to = o), i && (a.tb = i), this.lines.push(a), this.lines.length > mo && this.lines.splice(0, this.lines.length - mo), a;
  }
  /** Blocking someone takes what they already said off the screen too, and the direct messages you sent them. */
  dropFrom(e) {
    this.lines = this.lines.filter((n) => {
      var r, s;
      return ((r = n.who) == null ? void 0 : r.a) !== e && ((s = n.to) == null ? void 0 : s.a) !== e;
    });
  }
  /** The last few things somebody said, as this browser received them: what a report can attach (short, so a report stays small). */
  lastFrom(e, n = 5, r = 120) {
    return this.lines.filter((s) => {
      var o;
      return ((o = s.who) == null ? void 0 : o.a) === e;
    }).slice(-n).map((s) => s.text.slice(0, r));
  }
  /** Everything this session, oldest first: what the open chat scrolls through. */
  all() {
    return this.lines.slice();
  }
  /** The newest few: what the closed chat shows. */
  tail(e) {
    return e > 0 ? this.lines.slice(-e) : [];
  }
  /** What is kept in the tab: people's lines only (the page's own notes are not worth keeping), short field names. */
  dump() {
    return JSON.stringify(this.lines.filter((e) => e.who).map((e) => ({ a: e.who.a, m: e.mine ? 1 : 0, t: e.text, at: e.at, ...e.to ? { to: e.to.a } : {} })));
  }
  /** Put back what `dump` kept. Anything malformed is skipped, and anyone now blocked stays out. */
  load(e) {
    if (!e) return 0;
    let n;
    try {
      n = JSON.parse(e);
    } catch {
      return 0;
    }
    if (!Array.isArray(n)) return 0;
    let r = 0;
    for (const s of n.slice(-mo)) {
      if (!s || typeof s.a != "string" || typeof s.t != "string" || typeof s.at != "number") continue;
      const o = typeof s.to == "string" ? { a: s.to } : void 0;
      this.add({ a: s.a }, s.t.slice(0, fr * 2), s.m === 1, s.at, o) && (r += 1);
    }
    return r;
  }
  get size() {
    return this.lines.length;
  }
  clear() {
    this.lines = [];
  }
}
class B3 {
  constructor() {
    mn(this, "people", /* @__PURE__ */ new Map());
    mn(this, "known", !1);
  }
  set(e) {
    if (this.people.clear(), Array.isArray(e))
      for (const n of e) n && typeof n.a == "string" && this.people.set(n.a, { a: n.a, n: typeof n.n == "string" ? n.n : void 0 });
    this.known = !0;
  }
  join(e) {
    const n = e;
    n && typeof n.a == "string" && this.people.set(n.a, { a: n.a, n: n.n });
  }
  leave(e) {
    typeof e == "string" && this.people.delete(e);
  }
  has(e) {
    return this.people.has(e);
  }
  forget() {
    this.people.clear(), this.known = !1;
  }
  /** Everybody but you, in the order they arrived. */
  others(e) {
    return [...this.people.values()].filter((n) => n.a !== e);
  }
}
const $3 = `
#pxchat{position:fixed;z-index:11;top:110px;left:14px;width:min(340px,calc(100vw - 28px));box-sizing:border-box;display:flex;flex-direction:column;gap:6px;pointer-events:none;color:var(--ink,#f6ead0);font-size:13px;line-height:1.35}
#pxchat.left{align-items:flex-start}
#pxchat.right{align-items:flex-end;text-align:right}
#pxchat[hidden]{display:none}
#pxchat.over{padding:8px;border-radius:10px;background:rgba(12,9,14,.94);border:1px solid rgba(227,184,74,.45);box-shadow:0 8px 24px rgba(0,0,0,.6)}
#pxchat-lines{display:flex;flex-direction:column;justify-content:flex-end;gap:3px;max-width:100%;min-height:0;flex:0 1 auto;overflow:hidden}
#pxchat.right #pxchat-lines{align-items:flex-end}
#pxchat-lines.scroll{pointer-events:auto;overflow-y:auto;justify-content:flex-start;max-height:min(46vh,440px);overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:rgba(227,184,74,.5) transparent;padding-right:6px;box-sizing:border-box;width:100%}
#pxchat-lines.scroll::-webkit-scrollbar{width:6px}
#pxchat-lines.scroll::-webkit-scrollbar-thumb{background:rgba(227,184,74,.5);border-radius:3px}
#pxchat .newer{all:unset;cursor:pointer;pointer-events:auto;align-self:center;font-size:12px;padding:4px 10px;border-radius:12px;background:rgba(227,184,74,.92);color:#1a1208;font-weight:700}
#pxchat .newer[hidden]{display:none}
#pxchat .ln{overflow-wrap:anywhere;text-shadow:0 1px 2px #000,0 0 7px rgba(0,0,0,.9),0 0 14px rgba(0,0,0,.6)}
#pxchat .ln .tx{color:#fff}
#pxchat .ln.mine .nm{color:#9fd7b0}
#pxchat .ln.dm .tx{color:#f1d2ff}
#pxchat .ln.tb .tx{color:#bfe6ff}
#pxchat .ln.tb .tag{color:#8fcbf0;font-size:11px;font-weight:700;letter-spacing:.04em;margin-right:2px}
#pxchat .to.tb{background:rgba(30,70,110,.9);color:#d6eeff;border-color:#7fb8e0}
#pxchat .ln.dm .tag{color:#d9a8f5;font-size:11px;font-weight:700;letter-spacing:.04em;margin-right:2px}
#pxchat .ln.note{font-style:italic;color:var(--dim,#c9b894)}
#pxchat .nm{all:unset;cursor:pointer;pointer-events:auto;color:var(--gold,#e3b84a);font-weight:700;margin-right:2px}
#pxchat .nm:hover,#pxchat .nm:focus-visible{text-decoration:underline}
#pxchat span.nm{cursor:default;pointer-events:none}
#pxchat .bar{display:flex;flex-wrap:wrap;gap:6px;pointer-events:auto;max-width:100%}
#pxchat.right .bar{justify-content:flex-end}
#pxchat .bar[hidden],#pxchat form[hidden],#pxchat .panel[hidden],#pxchat .to[hidden]{display:none}
#pxchat button.sm{font:inherit;font-size:12px;cursor:pointer;padding:5px 9px;border-radius:7px;background:rgba(12,9,14,.82);color:var(--ink,#f6ead0);border:1px solid rgba(227,184,74,.55)}
#pxchat button.sm:hover:not(:disabled){background:rgba(227,184,74,.22)}
#pxchat button.sm:disabled{opacity:.5;cursor:default}
#pxchat button.sm.danger{border-color:#ff8a8a;color:#ffb3b3}
#pxchat button.sm.on{background:rgba(227,184,74,.28)}
#pxchat form{display:flex;flex-wrap:wrap;gap:6px;pointer-events:auto;width:100%}
#pxchat .to{all:unset;cursor:pointer;flex:0 0 auto;font-size:12px;padding:6px 9px;border-radius:8px;background:rgba(90,40,110,.9);color:#f1d2ff;border:1px solid #c58ee6}
#pxchat .to:hover{background:rgba(120,55,145,.95)}
#pxchat input{flex:1 1 150px;min-width:0;font:inherit;font-size:16px;padding:7px 10px;border-radius:8px;background:rgba(12,9,14,.88);color:#fff;border:1px solid var(--gold,#e3b84a);outline:none}
#pxchat input.dm{border-color:#c58ee6}
#pxchat input:focus{box-shadow:0 0 0 2px rgba(227,184,74,.35)}
#pxchat .panel{pointer-events:auto;padding:8px 10px;border-radius:10px;background:rgba(12,9,14,.92);border:1px solid rgba(227,184,74,.55);max-width:100%;box-sizing:border-box;text-align:left;max-height:38vh;overflow:auto}
#pxchat .panel p{margin:0 0 6px;color:var(--dim,#c9b894);font-size:12px}
#pxchat .panel p.who{color:var(--ink,#f6ead0);font-weight:700;font-size:13px}
#pxchat .panel .row{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-bottom:6px}
#pxchat .panel .row:last-child{margin-bottom:0}
#pxchat .panel .row > span{flex:1 1 auto;min-width:0;overflow-wrap:anywhere}
#pxchat-btn .dot{display:inline-block;min-width:16px;padding:0 4px;margin-left:6px;border-radius:9px;background:#e3b84a;color:#1a1208;font-size:11px;font-weight:700;text-align:center}
#pxchat-btn .dot.dm{background:#c58ee6}
@media (max-width:700px){#pxchat{font-size:12px}}
`, q = (t, e, n) => {
  const r = document.createElement(t);
  return e !== void 0 && (r.textContent = e), n && (r.className = n), r;
}, kt = (t, e, n = "sm") => {
  const r = q("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function _3(t) {
  const e = new v3(), n = new B3();
  let r = { hidden: !1, side: "left" }, s = [];
  try {
    r = y3(window.localStorage.getItem(hl)), s = w3(window.localStorage.getItem(fl));
  } catch {
  }
  e.setBlocked(s);
  let o = !1, i = null, a = !1, c = null, h = !1, f = "", l = 0, b = 0, d = 0, x = null, w = 0, v = !0, H = null;
  const U = () => {
    try {
      window.localStorage.setItem(hl, JSON.stringify(r));
    } catch {
    }
  }, y = () => {
    try {
      window.localStorage.setItem(fl, JSON.stringify(s));
    } catch {
    }
  }, $ = (S) => t.labelFor(S), A = () => {
    if (H)
      try {
        window.sessionStorage.setItem(So + H, e.dump());
      } catch {
      }
  }, P = (S) => {
    if (S)
      try {
        window.sessionStorage.removeItem(So + S);
      } catch {
      }
  }, F = (S) => {
    if (S !== H) {
      if (P(H), e.clear(), Ht.forEach((T) => T.remove()), Ht.clear(), H = S, S)
        try {
          e.load(window.sessionStorage.getItem(So + S));
        } catch {
        }
      v = !0;
    }
  }, O = (S) => s.includes(S), C = document.createElement("style");
  C.textContent = $3, document.head.append(C);
  const g = q("div");
  g.id = "pxchat";
  const E = q("div");
  E.id = "pxchat-lines";
  const L = q("button", "New messages ↓", "newer");
  L.type = "button", L.hidden = !0, E.setAttribute("role", "log"), E.setAttribute("aria-live", "polite"), E.setAttribute("aria-label", "Casino chat");
  const k = q("div", void 0, "panel");
  k.id = "pxchat-menu", k.hidden = !0;
  const M = q("div", void 0, "panel");
  M.id = "pxchat-panel", M.hidden = !0;
  const N = q("form");
  N.hidden = !0;
  const ht = q("button", void 0, "to");
  ht.type = "button", ht.hidden = !0;
  const et = q("input");
  et.type = "text", et.autocomplete = "off", et.enterKeyHint = "send", et.maxLength = fr * 2;
  const Ve = q("button", "Send", "sm");
  Ve.type = "submit", N.append(ht, et, Ve);
  const rt = q("div", void 0, "bar");
  rt.hidden = !0;
  const R = kt("Here now", () => Jn("people")), wr = kt("Hide chat", () => qs()), jn = kt("", () => {
    r.side = r.side === "left" ? "right" : "left", U(), Q();
  }), wt = kt("Blocked", () => Jn("blocked")), Ke = kt("Table", () => {
    a = !a, i = null, Q(), o && et.focus();
  });
  Ke.id = "pxchat-table", R.id = "pxchat-people", wr.id = "pxchat-hide", jn.id = "pxchat-side", wt.id = "pxchat-blocked", rt.append(Ke, R, wr, jn, wt), g.append(E, L, k, M, N, rt);
  const St = q("button");
  St.id = "pxchat-btn", St.type = "button", St.setAttribute("aria-controls", "pxchat");
  const Ht = /* @__PURE__ */ new Map(), Rs = () => o || !!c || !!f, Gs = () => {
    var S;
    return (S = window.matchMedia) != null && S.call(window, "(max-width:700px)").matches ? 5 : 8;
  }, pn = (S) => {
    const T = q("button", $(S.a), "nm");
    return T.type = "button", T.dataset.a = S.a, T.setAttribute("aria-label", `Options for ${$(S.a)}`), T.onclick = () => Sr(S), T;
  }, Vs = (S) => {
    const T = S.who ? `ln${S.mine ? " mine" : ""}${S.to ? " dm" : ""}${S.tb ? " tb" : ""}` : "ln note", X = q("div", void 0, T);
    if (!S.who)
      return X.append(q("span", S.text, "tx")), X;
    const W = [];
    return S.to ? S.mine ? W.push(q("span", "You", "nm"), q("span", "→", "tag"), pn(S.to)) : W.push(pn(S.who), q("span", "→ you", "tag")) : (S.tb && W.push(q("span", "Table", "tag")), W.push(S.mine ? q("span", "You", "nm") : pn(S.who))), W.push(q("span", S.text, "tx")), W.forEach((ct, ut) => {
      ut && X.append(document.createTextNode(" ")), X.append(ct);
    }), X;
  }, yr = () => E.scrollTop + E.clientHeight >= E.scrollHeight - 8, mr = () => {
    E.scrollTop = E.scrollHeight, v = !0, L.hidden = !0;
  }, Ks = () => {
    const S = Rs(), T = S ? e.all() : e.tail(Gs()), X = E.classList.contains("scroll");
    E.classList.toggle("scroll", S);
    const W = new Set(T.map((Et) => Et.id));
    let ct = !1;
    for (const [Et, At] of Ht) W.has(Et) || (At.remove(), Ht.delete(Et));
    let ut = null;
    for (const Et of T) {
      let At = Ht.get(Et.id);
      At || (At = Vs(Et), Ht.set(Et.id, At), ct = !0);
      const le = ut ? ut.nextElementSibling : E.firstElementChild;
      le !== At && E.insertBefore(At, le), ut = At;
    }
    if (!S) {
      L.hidden = !0, v = !0;
      return;
    }
    !X || v ? mr() : ct && (L.hidden = !1);
  }, qn = () => {
    St.replaceChildren(q("span", "💬", "ic"), q("span", "Chat", "lbl")), r.hidden && l > 0 && St.append(q("span", l > 9 ? "9+" : String(l), b ? "dot dm" : "dot")), St.setAttribute("aria-expanded", String(o && !r.hidden)), St.setAttribute("aria-label", r.hidden && l ? `Chat: ${l} new${b ? `, ${b} sent to you` : ""}` : "Casino chat: type a message");
  }, bn = () => t.table ? t.table() : null, Wn = { blackjack: "blackjack", baccarat: "baccarat", holdem: "Hold'em", roulette: "roulette", videopoker: "video poker", pvpholdem: "Salon Hold'em", liars: "Liar's Dice" }, Xn = () => {
    a && !bn() && (a = !1), N.hidden = !o || r.hidden, ht.hidden = !i && !a, ht.classList.toggle("tb", a && !i), i ? (ht.textContent = `To ${$(i.a)} ×`, ht.setAttribute("aria-label", `Writing to ${$(i.a)}. Press to write to the whole room instead.`)) : a && (ht.textContent = "To this table ×", ht.setAttribute("aria-label", "Writing to the people at your table. Press to write to the whole room instead.")), et.classList.toggle("dm", !!i);
    const S = bn();
    Ke.hidden = !S, Ke.classList.toggle("on", a);
    const T = i ? `Message ${$(i.a)}` : a && S ? `Say something to the ${Wn[S] || S} table` : "Say something to the room";
    et.placeholder = T, et.setAttribute("aria-label", T);
  }, zs = () => {
    if (k.replaceChildren(), k.hidden = !c, !c) return;
    const S = c, T = O(S.a);
    k.append(q("p", $(S.a), "who"));
    const X = q("div", void 0, "row");
    if (h) {
      k.append(q("p", "Why? Your report goes to the casino team with the last few things they said to you or the room."));
      for (const W of g3) X.append(kt(W.label, () => {
        Br(S, W.code), qe();
      }));
    } else {
      const W = kt("Message", () => {
        qe(), Ws(S);
      });
      W.disabled = T || !n.has(S.a), T ? k.append(q("p", "You have blocked this person. Unblock them to message them.")) : n.known && !n.has(S.a) && k.append(q("p", "They have left the room.")), X.append(
        W,
        kt(T ? "Unblock" : "Block", () => {
          vr(S, !T), qe();
        }),
        kt("Report…", () => {
          h = !0, Q();
        }, "sm danger")
      );
    }
    X.append(kt("Cancel", qe)), k.append(X);
  }, js = () => {
    if (M.replaceChildren(), M.hidden = !f, f === "people") {
      const S = n.others(t.me());
      if (!n.known) M.append(q("p", t.connected() ? "Asking the room who is here…" : "Not connected to the room."));
      else if (!S.length) M.append(q("p", "Nobody else is signed in right now."));
      else {
        M.append(q("p", `Signed in now (${S.length}). Tap a name to message, block or report.`));
        for (const T of S) {
          const X = q("div", void 0, "row"), W = q("span");
          W.append(pn(T)), O(T.a) && W.append(document.createTextNode(" (blocked)")), X.append(W), M.append(X);
        }
      }
    } else if (f === "blocked") {
      if (!s.length) {
        M.append(q("p", "You have not blocked anyone."));
        return;
      }
      M.append(q("p", "Blocked people cannot reach you and you cannot reach them."));
      for (const S of s) {
        const T = q("div", void 0, "row");
        T.append(q("span", $(S)), kt("Unblock", () => {
          vr({ a: S }, !1), Q();
        })), M.append(T);
      }
    }
  }, Q = () => {
    g.hidden = r.hidden, g.classList.remove("left", "right"), g.classList.add(r.side), rt.hidden = !o || r.hidden;
    const S = n.others(t.me()).length;
    R.textContent = n.known ? `Here now (${S})` : "Here now", R.classList.toggle("on", f === "people"), jn.textContent = r.side === "left" ? "Move right ▸" : "◂ Move left", wt.textContent = s.length ? `Blocked (${s.length})` : "Blocked", wt.classList.toggle("on", f === "blocked"), qn(), Xn(), zs(), js(), Ks(), ze();
  }, ze = () => {
    const S = window.innerWidth, T = window.innerHeight, X = document.getElementById("tools"), W = Math.round(Math.max(70, (X ? X.getBoundingClientRect().bottom : 58) + 12));
    let ct = r.side === "left" ? 14 : null, ut = Math.min(340, S - 28), Et = T - W - 12, At = !1;
    const le = document.getElementById("intro"), Ct = le && le.getClientRects().length ? le.getBoundingClientRect() : null;
    Ct && Ct.width > 0 && Ct.height > 0 && Ct.bottom > W && (r.side === "left" ? Ct.left < 14 + ut : Ct.right > S - 14 - ut) && (r.side === "left" && S - Ct.right - 30 >= 260 ? (ct = Math.round(Ct.right + 16), ut = Math.min(340, S - ct - 14)) : (At = !0, Et = Math.max(170, Math.round(Ct.top - W - 8)))), g.style.top = `${W}px`, g.style.left = ct === null ? "auto" : `${ct}px`, g.style.right = ct === null ? "14px" : "", g.style.width = `${ut}px`, g.style.maxHeight = `${Et}px`, g.classList.toggle("over", At && !g.hidden && (o || Ht.size > 0));
  }, pt = (S) => {
    e.add(null, S, !1, Date.now());
  }, Yn = () => {
    try {
      document.pointerLockElement && document.exitPointerLock();
    } catch {
    }
  }, Ot = () => {
    if (!t.me()) {
      r.hidden && (r.hidden = !1, U()), o = !1, pt("Join the room to chat. Anyone can watch; you need one free signature to speak."), Q(), t.joinPrompt();
      return;
    }
    r.hidden && (r.hidden = !1, U()), l = 0, b = 0, o = !0, Yn(), Q(), et.focus();
  }, je = () => {
    o = !1, c = null, h = !1, f = "", et.blur(), Q();
  }, qs = () => {
    r.hidden = !0, U(), o = !1, c = null, h = !1, f = "", l = 0, b = 0, et.blur(), Q();
  }, qe = () => {
    c = null, h = !1, Q();
  };
  function Sr(S) {
    c = S, h = !1, Yn(), Q();
  }
  function Jn(S) {
    f = f === S ? "" : S, c = null, h = !1, Q();
  }
  function Ws(S) {
    if (O(S.a)) {
      pt(Qn("blocked")), Q();
      return;
    }
    i = { a: S.a }, f = "", Ot();
  }
  const Er = () => {
    i = null, a = !1, Q(), et.focus();
  }, Ar = () => {
    t.me() && t.send({ t: "blocks", list: s }) && (w = Date.now());
  };
  function vr(S, T) {
    const X = $(S.a);
    if (T) {
      if (s.length >= Fh) {
        pt(Qn("too-many-blocks"));
        return;
      }
      s.includes(S.a) || s.push(S.a), e.dropFrom(S.a), A(), (i == null ? void 0 : i.a) === S.a && (i = null), pt(`You blocked ${X}. Neither of you will see the other's messages.`);
    } else
      s = s.filter((W) => W !== S.a), pt(`You unblocked ${X}.`);
    e.setBlocked(s), Ht.forEach((W) => W.remove()), Ht.clear(), y(), Ar();
  }
  function Br(S, T) {
    if (!t.me() || !t.connected()) {
      pt("Not connected to the room, so the report was not sent.");
      return;
    }
    t.send({ t: "report", who: S.a, why: T, lines: e.lastFrom(S.a) }) && (w = Date.now()), pt("Sending your report…");
  }
  St.onclick = () => {
    o && !r.hidden ? je() : Ot();
  }, ht.onclick = Er, L.onclick = () => mr(), E.addEventListener("scroll", () => {
    v = yr(), v && (L.hidden = !0);
  }, { passive: !0 }), E.addEventListener("wheel", (S) => {
    E.classList.contains("scroll") && S.stopPropagation();
  }, { passive: !0 }), E.addEventListener("touchmove", (S) => {
    E.classList.contains("scroll") && S.stopPropagation();
  }, { passive: !0 }), N.onsubmit = (S) => {
    S.preventDefault();
    const T = Date.now(), X = A3(et.value, { signed: !!t.me(), connected: t.connected(), now: T, lastSentAt: d }), W = "Not connected to the room yet. Your message is still in the box.";
    if (!X.ok) {
      pt(X.code === "offline" ? W : Qn(X.code)), Q();
      return;
    }
    if (i && n.known && !n.has(i.a)) {
      pt(Qn("not-here")), Q();
      return;
    }
    const ct = i ? { t: "dm", to: i.a, text: X.text } : a && bn() ? { t: "say", text: X.text, ch: "table" } : { t: "say", text: X.text };
    if (!t.send(ct)) {
      pt(W), Q();
      return;
    }
    d = T, w = T, x = { text: X.text, to: i }, et.value = "";
  }, et.addEventListener("keydown", (S) => {
    S.stopPropagation(), S.key === "Escape" && (S.preventDefault(), i && !et.value ? Er() : je());
  }), et.addEventListener("keypress", (S) => S.stopPropagation()), document.addEventListener("pointerdown", (S) => {
    if (!c && !f) return;
    const T = S.target;
    T && (g.contains(T) || St.contains(T)) || (c = null, h = !1, f = "", Q());
  }), window.addEventListener("resize", ze);
  const $r = document.getElementById("intro");
  $r && "MutationObserver" in window && new MutationObserver(() => ze()).observe($r, { attributes: !0, attributeFilter: ["class", "style", "hidden"] });
  const Xs = {
    button: St,
    mount(S) {
      S.append(g), Q();
    },
    /**
     * Someone spoke: `say` to the room or `dm` to one person. The room sends our own lines back too (to every tab of ours), so our
     * screen shows exactly what was delivered.
     */
    heard(S) {
      if (!(S != null && S.from) || typeof S.from.a != "string") return;
      const T = t.me(), X = !!T && S.from.a === T, W = S.t === "dm" && S.to && typeof S.to.a == "string" ? { a: S.to.a } : void 0, ct = S.t === "say" && S.ch === "table" && typeof S.tb == "string" ? S.tb : void 0;
      e.add({ a: S.from.a }, String(S.text ?? "").slice(0, fr * 2), X, Date.now(), W, ct) && (A(), X ? (x = null, v = !0) : r.hidden && (l += 1, W && (b += 1)), Q());
    },
    /**
     * The room refused something. Only a refusal of something chat just sent is chat's business: the room also says "slow down" to
     * the page's own seat updates, and those must not show up as chat notes. Returns whether chat took it.
     * A refused message goes back into the box so nothing typed is lost.
     */
    failed(S) {
      return !x && Date.now() - w > 4e3 ? !1 : (x && !et.value && (et.value = x.text, x.to && S !== "not-here" && S !== "no-such-player" && (i = x.to)), (S === "not-here" || S === "no-such-player") && (i = null), x = null, pt(Qn(S)), Q(), !0);
    },
    reported() {
      pt("Report sent. Thank you."), Q();
    },
    /** A fresh connection: the room has forgotten our block list, so hand it over again, and take its list of who is here. */
    room(S, T) {
      n.set(S), F(T ? t.me() : null), T ? Ar() : (o = !1, i = null, c = null, h = !1, f = "", et.value = "", x = null), i && !n.has(i.a) && (i = null), Q();
    },
    joined(S) {
      n.join(S), f === "people" || c ? Q() : R.textContent = `Here now (${n.others(t.me()).length})`;
    },
    left(S) {
      n.leave(S), typeof S == "string" && (i == null ? void 0 : i.a) === S && (pt(`${$(S)} left the room.`), i = null), Q();
    },
    /** The player pressed Leave the room: their session's chat is cleared from this tab now. */
    endSession() {
      F(null), o = !1, i = null, c = null, h = !1, f = "", et.value = "", x = null, Q();
    },
    /** The connection dropped: until the room speaks again we do not know who is here. Their chat stays: a reconnect is the same session. */
    disconnected() {
      n.forget(), Q();
    },
    /** Names learned from BNS arrive late; relabel what is already on screen. */
    refreshNames() {
      g.querySelectorAll("button.nm[data-a]").forEach((S) => {
        S.textContent = $(S.dataset.a);
      }), i && Xn();
    },
    isTyping: () => o,
    debug: () => ({ typing: o, hidden: r.hidden, side: r.side, target: (i == null ? void 0 : i.a) ?? null, blocks: [...s], lines: e.size, shown: Ht.size, session: H, stick: v, people: n.others(t.me()).map((S) => S.a) })
  };
  return qn(), Xs;
}
const Rh = (t) => {
  if (!/^[0-9a-f]{64}$/.test(t)) throw new Error("A round seed is 64 hex characters.");
  const e = new Uint8Array(new ArrayBuffer(32));
  for (let n = 0; n < 32; n++) e[n] = parseInt(t.slice(n * 2, n * 2 + 2), 16);
  return e;
}, Gh = (t) => {
  const e = Rh(t), n = (h) => (e[h] | e[h + 1] << 8 | e[h + 2] << 16 | e[h + 3] << 24) >>> 0;
  let r = n(0) ^ n(16), s = n(4) ^ n(20), o = n(8) ^ n(24), i = n(12) ^ n(28);
  const a = () => {
    r >>>= 0, s >>>= 0, o >>>= 0, i >>>= 0;
    const h = r + s + i >>> 0;
    return i = i + 1 >>> 0, r = s ^ s >>> 9, s = o + (o << 3) >>> 0, o = o << 21 | o >>> 11, o = o + h >>> 0, h;
  };
  for (let h = 0; h < 12; h++) a();
  return { next: a, below: (h) => {
    const f = Math.floor(4294967296 / h) * h;
    for (; ; ) {
      const l = a();
      if (l < f) return l % h;
    }
  } };
}, H3 = (t) => Gh(t).below(37), L3 = ["S", "H", "D", "C"], I3 = (t, e = 6) => {
  const n = Gh(t), r = Array.from({ length: 416 }, (o, i) => i), s = [];
  for (let o = 0; o < e; o++) {
    const i = o + n.below(r.length - o), a = r[i];
    r[i] = r[o], r[o] = a;
    const c = a % 52;
    s.push({ r: 2 + c % 13, s: L3[Math.floor(c / 13)] });
  }
  return s;
}, U3 = () => {
  const t = globalThis.crypto;
  if (!(t != null && t.subtle)) throw new Error("WebCrypto is not available.");
  return t.subtle;
}, O3 = (t) => [...new Uint8Array(t)].map((e) => e.toString(16).padStart(2, "0")).join(""), C3 = async (t) => O3(await U3().digest("SHA-256", Rh(t))), k3 = async (t, e) => {
  try {
    return await C3(t) === e;
  } catch {
    return !1;
  }
}, p = {
  service: "unknown",
  signed: null,
  wallet: null,
  ws: null,
  connected: !1,
  attempts: 0,
  replaced: !1,
  you: null,
  features: [],
  // what the room says it can do ('play': spins, 'move': walking); an older room lists nothing
  walk: /* @__PURE__ */ new Map(),
  // other signed-in players on the floor, by address: their latest position
  ownMove: null,
  // the visitor's own last position on the floor (null: off it)
  ownSent: !1,
  // whether the room currently holds a position for this connection
  spots: {},
  joined: 0,
  guests: 0,
  busy: "",
  watch: !0,
  // false: the room hides itself from visitors who have not signed in (CASINO_ROOM_GUESTS off)
  prompted: !1,
  // the arrival "Join the room" panel has opened once on this page
  arrivedAt: 0,
  // when the first room message came, for the arrival prompt's short wait
  error: "",
  open: !1,
  want: null,
  badSpot: null,
  // a spot the room said it has no such place (an older room Worker): not asked again
  yielded: null,
  // a spot another tab of the same player took from this one: not asked for again until this tab moves
  standSent: null,
  // the spot this tab last asked to stand up from: asked once, not every 0.6 s
  lastSent: 0,
  host: null,
  retryTimer: 0
};
let Y = null;
const P3 = (t) => t.length <= 12 ? t : `${t.slice(0, 5)}…${t.slice(-4)}`, N3 = (t) => {
  if (t.startsWith("SP")) return t;
  const e = mi(t);
  return Lo({ ...e, version: vo.MainnetSingleSig });
}, D3 = vy((t) => e3({ address: N3(t), network: "mainnet" }), () => {
  Es(), ti(), Y == null || Y.refreshNames();
}), Ms = (t) => {
  let e = null;
  try {
    e = D3.get(t);
  } catch {
  }
  return e || P3(t);
}, Vh = (t, e) => ({ key: t, label: Ms(t), x: e.x, z: e.z, r: e.r, at: e.at }), ti = () => {
  var n, r;
  if (!((n = p.host) != null && n.moves) || p.service !== "ok") return;
  const t = ((r = p.you) == null ? void 0 : r.a) ?? null, e = [...p.walk.entries()].filter(([s]) => s !== t).map(([s, o]) => Vh(s, o));
  try {
    p.host.moves(e);
  } catch (s) {
    console.warn("[room] the page could not draw the walkers", s);
  }
}, es = (t, e) => {
  var n, r;
  if (e ? p.walk.set(t, e) : p.walk.delete(t), !(!((n = p.host) != null && n.move) || t === (((r = p.you) == null ? void 0 : r.a) ?? null)))
    try {
      p.host.move(e ? Vh(t, e) : { key: t, off: !0 });
    } catch (s) {
      console.warn("[room] the page could not move a walker", s);
    }
}, Kh = () => {
  var t;
  !p.features.includes("move") || p.service !== "ok" || !p.connected || !p.signed || !p.you || p.you.guest || ((t = p.ws) == null ? void 0 : t.readyState) === WebSocket.OPEN && (p.ownMove ? (p.ws.send(JSON.stringify({ t: "move", ...p.ownMove })), p.ownSent = !0) : p.ownSent && (p.ws.send(JSON.stringify({ t: "move", off: !0 })), p.ownSent = !1));
}, Je = (t) => {
  var e, n;
  try {
    (n = (e = p.host) == null ? void 0 : e.on) == null || n.call(e, t);
  } catch (r) {
    console.warn("[room] the page could not take a room message", r);
  }
}, T3 = /^(react|win|daily|round|gift|pvp|table|no-table)/, Es = () => {
  var n;
  if (!p.host || p.service !== "ok") return;
  const t = ((n = p.you) == null ? void 0 : n.a) ?? null, e = Object.entries(p.spots).filter(([, r]) => r.a !== t).map(([r, s]) => ({ key: s.a, spot: r, label: Ms(s.a), since: s.since }));
  try {
    p.host.setPeople(e);
  } catch (r) {
    console.warn("[room] the page could not draw the people", r);
  }
}, As = async (t, e) => {
  const n = await fetch(t, { credentials: "same-origin", ...e });
  let r = null;
  try {
    r = await n.json();
  } catch {
  }
  return { res: n, body: r };
}, ei = (t) => {
  var e;
  return ((e = p.ws) == null ? void 0 : e.readyState) !== WebSocket.OPEN ? !1 : (p.ws.send(JSON.stringify(t)), p.lastSent = Date.now(), !0);
}, zh = () => {
  var e;
  if (p.service !== "ok" || !p.connected || !p.you || p.you.guest || !p.signed) return;
  const t = ((e = Object.entries(p.spots).find(([, n]) => n.a === p.you.a)) == null ? void 0 : e[0]) ?? null;
  p.want ? t !== p.want && p.want !== p.badSpot && p.want !== p.yielded && !p.spots[p.want] && Date.now() - p.lastSent > 1200 && ei({ t: "sit", spot: p.want }) : t && t !== p.standSent && Date.now() - p.lastSent > 600 && (p.standSent = t, ei({ t: "stand" }));
}, zi = () => {
  if (p.service !== "ok" || p.ws) return;
  p.attempts += 1;
  let t;
  try {
    t = new WebSocket(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/casino/room/ws`);
  } catch {
    return dl();
  }
  p.ws = t, t.onopen = () => {
    p.connected = !0, p.attempts = 0, it();
  }, t.onmessage = (e) => {
    var r, s, o, i;
    let n;
    try {
      n = JSON.parse(String(e.data));
    } catch {
      return;
    }
    switch (n.t) {
      case "room":
        p.you = n.you, p.spots = n.spots || {}, p.joined = n.joined, p.guests = n.guests, p.watch = n.watch !== !1, p.arrivedAt || (p.arrivedAt = Date.now()), p.features = Array.isArray(n.features) ? n.features.filter((a) => typeof a == "string") : [], p.walk = /* @__PURE__ */ new Map();
        for (const a of Array.isArray(n.walkers) ? n.walkers : []) a && typeof a.a == "string" && p.walk.set(a.a, { x: +a.x, z: +a.z, r: +a.r, at: +a.at });
        ti(), p.ownSent = !1, Kh(), p.standSent = null, p.signed && ((r = p.you) != null && r.guest) && (p.signed = null), Y == null || Y.room(n.players, !!(p.you && !p.you.guest)), Je({ t: "room", features: p.features.slice(), wins: n.wins || [], bets: n.bets || {}, seekers: n.seekers || [], at: n.at, you: p.you, watch: p.watch });
        break;
      case "sat":
        p.spots[n.spot] = n.who, (s = n.who) != null && s.a && p.walk.has(n.who.a) && es(n.who.a, null);
        break;
      case "stood":
        delete p.spots[n.spot], p.standSent === n.spot && (p.standSent = null);
        break;
      case "moved":
        p.yielded = n.spot;
        break;
      case "count":
        p.joined = n.joined, p.guests = n.guests;
        break;
      case "say":
      case "dm":
        Y == null || Y.heard(n), n.t === "say" && Je(n);
        return;
      case "join":
        Y == null || Y.joined(n.who), Je(n);
        return;
      case "leave":
        Y == null || Y.left(n.a), p.walk.has(n.a) && es(n.a, null), Je(n);
        return;
      case "react":
      case "win":
      case "daily":
      case "round":
      case "bet":
      case "gift":
      case "seek":
      case "pvp":
        Je(n);
        return;
      case "reported":
        Y == null || Y.reported();
        return;
      case "play":
        if (typeof n.spot == "string" && Array.isArray(n.s) && typeof n.b == "number")
          try {
            (i = (o = p.host) == null ? void 0 : o.play) == null || i.call(o, n.spot, { a: String(n.a || ""), s: n.s, b: n.b, f: !!n.f });
          } catch (a) {
            console.warn("[room] the page could not show a spin", a);
          }
        return;
      case "move":
        typeof n.a == "string" && (n.off ? es(n.a, null) : [n.x, n.z, n.r, n.at].every((a) => typeof a == "number" && Number.isFinite(a)) && es(n.a, { x: n.x, z: n.z, r: n.r, at: n.at }));
        return;
      case "err":
        if (typeof n.code == "string" && (n.code.startsWith("play-") || n.code.startsWith("move-")) || typeof n.code == "string" && T3.test(n.code) && (Je({ t: "err", code: n.code }), n.code !== "no-table"))
          return;
        n.code === "no-such-spot" ? p.badSpot = p.want : m3(n.code) && (Y != null && Y.failed(n.code)) || n.code === "slow-down" && (p.lastSent = Date.now() + 3e3);
        return;
      default:
        return;
    }
    Es(), zh(), it();
  }, t.onclose = (e) => {
    if (p.ws === t) {
      if (p.ws = null, p.connected = !1, p.spots = {}, Es(), p.walk = /* @__PURE__ */ new Map(), ti(), p.ownSent = !1, Y == null || Y.disconnected(), e.code === 4001) {
        p.replaced = !0, it();
        return;
      }
      it(), dl();
    }
  }, t.onerror = () => {
  };
}, dl = () => {
  window.clearTimeout(p.retryTimer);
  const t = Math.min(15e3, 1e3 * 2 ** Math.min(p.attempts, 4));
  p.retryTimer = window.setTimeout(() => {
    p.ws || zi();
  }, t);
}, ji = () => {
  const t = p.ws;
  p.ws = null, p.connected = !1, p.attempts = 0, p.replaced = !1;
  try {
    t == null || t.close(1e3, "client");
  } catch {
  }
  zi();
};
async function jh(t) {
  const { res: e, body: n } = await As(`/casino/room/challenge?address=${encodeURIComponent(t.address)}`);
  if (!e.ok) throw new Error((n == null ? void 0 : n.error) || `The room answered ${e.status}.`);
  const r = n.challenge, { domain: s, message: o } = i3(r);
  p.busy = "sign", it();
  let i;
  try {
    i = t.kind === "casino" ? await d3(r) : await Ay({
      domain: s,
      message: o,
      network: r.network,
      stxAddress: t.address,
      appDetails: { name: "ParallaX Casino", icon: `${location.origin}/favicons/xtrata-apple-touch-icon.png` }
    });
  } catch (h) {
    throw new Error("The wallet did not sign: " + Ss(h));
  }
  const { res: a, body: c } = await As("/casino/room/session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ challenge: r, signature: i })
  });
  if (!a.ok) throw new Error((c == null ? void 0 : c.error) || `The room answered ${a.status}.`);
  p.signed = { address: c.address, hash160: c.hash160, expiresAt: c.expiresAt }, ji();
}
async function F3(t) {
  var n, r;
  if (p.busy) return;
  p.error = "", p.busy = "connect", it();
  const e = t === "casino" && !((n = lr()) != null && n.describe().has);
  try {
    p.wallet = await p3(t), Th(t), await jh(p.wallet), p.open = !1, e && ((r = lr()) == null || r.fundNew().catch(() => {
    }));
  } catch (s) {
    p.error = /cancel/i.test(Ss(s)) ? "" : Ss(s);
  } finally {
    p.busy = "", it();
  }
}
async function M3(t) {
  var r;
  const e = t.detail;
  if (!e || typeof e.address != "string" || p.service !== "ok" || p.busy || ((r = p.signed) == null ? void 0 : r.address) === e.address) return;
  const n = e.kind === "casino" || e.kind === "leather" || e.kind === "xverse" ? e.kind : null;
  if (n) {
    p.error = "", p.busy = "sign", it();
    try {
      p.wallet = { kind: n, address: e.address, network: e.address.startsWith("SP") ? "mainnet" : "testnet", via: "page" }, Th(n), await jh(p.wallet), p.open = !1;
    } catch (s) {
      const o = Ss(s);
      /cancel/i.test(o) || (p.error = o, p.open = !0);
    } finally {
      p.busy = "", it();
    }
  }
}
const R3 = 2e3, G3 = () => {
  var t;
  p.prompted || p.service !== "ok" || !p.connected || p.signed || p.busy || p.open || !p.arrivedAt || Date.now() - p.arrivedAt < R3 || (t = p.host) != null && t.currentSpot() || (p.prompted = !0, p.open = !0, it());
}, V3 = () => {
  const t = lr();
  let e = null;
  try {
    e = localStorage.getItem("STX_PROVIDER");
  } catch {
  }
  const n = /Xverse/.test(e || "") ? ["xverse", "leather"] : ["leather", "xverse"];
  return t ? t.describe().has || !e ? ["casino", ...n] : [n[0], "casino", n[1]] : n;
};
async function K3() {
  try {
    await As("/casino/room/session", { method: "DELETE" });
  } catch {
  }
  p.signed = null, p.wallet = null, p.error = "", Y == null || Y.endSession(), Y == null || Y.disconnected(), ji(), it();
}
const z3 = `
#pxroom{position:relative;display:inline-flex;gap:inherit;align-items:center}
#pxroom-btn .n,#pxchat-btn .n{white-space:nowrap}
#pxchat-btn .ic{display:none}
@media(max-width:620px){
  #pxroom{gap:6px}
  #pxroom-btn .lbl,#pxchat-btn .lbl{display:none}
  #pxroom-btn i{margin:0 2px 0 0}
  #pxchat-btn .ic{display:inline}
  #pxchat-btn .dot{position:absolute;top:-6px;right:-6px;margin:0}
  #pxchat-btn{position:relative;overflow:visible!important}
}
#pxroom-btn{font:inherit;cursor:pointer}
#pxroom-btn i{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px;background:#8a8f98;vertical-align:1px}
#pxroom-btn.live i{background:#2fae66;box-shadow:0 0 6px #2fae66}
#pxroom-btn.wait i{background:#e3b84a}
#pxroom-panel{position:fixed;top:max(64px,calc(env(safe-area-inset-top) + 54px));right:10px;width:min(320px,calc(100vw - 20px));z-index:40;box-sizing:border-box;padding:14px 16px;border-radius:12px;background:rgba(12,9,14,.98);backdrop-filter:blur(6px);color:var(--ink,#f6ead0);border:1px solid var(--gold,#e3b84a);box-shadow:0 10px 40px rgba(0,0,0,.55);font-size:13px;line-height:1.45;pointer-events:auto}
#pxroom-panel[hidden]{display:none}
#pxroom-panel h3{margin:0 0 6px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold,#e3b84a);font-weight:700}
#pxroom-panel p{margin:0 0 10px;color:var(--dim,#b7a587)}
#pxroom-panel .row{display:flex;gap:8px;flex-wrap:wrap}
#pxroom-panel button{font:inherit;cursor:pointer;flex:1 1 120px;padding:9px 12px;border-radius:8px;background:rgba(227,184,74,.12);color:var(--ink,#f6ead0);border:1px solid var(--gold,#e3b84a)}
#pxroom-panel button:hover:not(:disabled){background:rgba(227,184,74,.26)}
#pxroom-panel button:disabled{opacity:.5;cursor:default}
#pxroom-panel .err{color:#ff8a8a;margin:8px 0 0}
#pxroom-panel .who{color:var(--ink,#f6ead0);font-weight:600;word-break:break-all}
#pxroom-panel .fact{font-size:12px;line-height:1.5;margin:0 0 8px}
#pxroom-panel .fact b{color:var(--gold,#e3b84a);font-weight:700;letter-spacing:.06em;text-transform:uppercase;font-size:11px}
`, st = (t, e, n) => {
  const r = document.createElement(t);
  return e !== void 0 && (r.textContent = e), n && (r.className = n), r;
}, ne = (t, e) => {
  const n = st("p", void 0, "fact");
  return n.append(st("b", t), document.createTextNode(` ${e}`)), n;
};
let ke = null, Bt = null, qt = null;
function j3() {
  var n, r;
  if (ke || p.service !== "ok") return;
  const t = document.createElement("style");
  t.textContent = z3, document.head.append(t), ke = st("span"), ke.id = "pxroom", Bt = st("button"), Bt.id = "pxroom-btn", Bt.type = "button", Bt.setAttribute("aria-label", "Casino room: see who is here and join"), Bt.onclick = () => {
    p.open = !p.open, it();
  }, qt = st("div"), qt.id = "pxroom-panel", qt.hidden = !0, Y = _3({
    send: ei,
    me: () => p.you && !p.you.guest ? p.you.a : null,
    connected: () => p.connected,
    labelFor: Ms,
    joinPrompt: () => {
      p.open = !0, it();
    },
    table: () => {
      var s, o;
      return p.features.includes("table") ? ((o = (s = p.host) == null ? void 0 : s.table) == null ? void 0 : o.call(s)) ?? null : null;
    }
  }), ke.append(Bt, Y.button);
  const e = ((r = (n = p.host) == null ? void 0 : n.mount) == null ? void 0 : r.call(n)) ?? document.querySelector("#tools .rt");
  e ? e.insertBefore(ke, e.firstChild) : (ke.style.cssText = "position:fixed;top:10px;right:10px;z-index:30", document.body.append(ke)), document.body.append(qt), Y.mount(document.body), document.addEventListener("keydown", (s) => {
    s.key === "Escape" && p.open && (p.open = !1, it());
  }), document.addEventListener("pointerdown", (s) => {
    if (!p.open) return;
    const o = s.target;
    o && (qt.contains(o) || Bt.contains(o)) || (p.open = !1, it());
  }), window.addEventListener("resize", () => it());
}
function q3() {
  if (!Bt || !qt) return;
  const t = Bt.getBoundingClientRect(), e = t.height ? Math.round(t.bottom + 8) : 64;
  qt.style.top = `${Math.min(e, Math.max(64, window.innerHeight - 220))}px`;
}
let pl;
const W3 = () => {
  var n, r;
  const t = !!(p.signed && p.you && !p.you.guest), e = t ? p.signed.address : null;
  if (e !== pl) {
    pl = e;
    try {
      (r = (n = p.host) == null ? void 0 : n.self) == null || r.call(n, { signed: t, address: e });
    } catch (s) {
      console.warn("[room] the page could not take the sign-in state", s);
    }
  }
};
function it() {
  var n;
  if (W3(), !ke || !Bt || !qt) return;
  const t = !!(p.signed && p.you && !p.you.guest);
  if (Bt.className = p.connected ? "live" : "wait", Bt.replaceChildren(st("i"), st("span", t ? "In the room" : "Room", "lbl"), st("span", p.connected ? (n = window.matchMedia) != null && n.call(window, "(max-width:620px)").matches ? String(p.joined) : ` · ${p.joined}` : "", "n")), Bt.setAttribute("aria-label", `Casino room: ${p.connected ? `${p.joined} signed in, ` : ""}${t ? "you are in" : "see who is here and join"}`), qt.hidden = !p.open, !p.open) return;
  q3();
  const e = [];
  if (p.replaced) {
    e.push(st("h3", "Room"), st("p", "Another tab of yours took over the room. You are not connected here."));
    const r = st("button", "Use this tab instead");
    r.onclick = () => {
      ji(), it();
    }, e.push(r);
  } else if (t) {
    e.push(st("h3", "You are in the room")), e.push(st("p", "Others see you at your seat as"), st("p", Ms(p.signed.address), "who")), e.push(st("p", `${p.joined} signed in, ${p.guests} watching.`)), e.push(ne("Be seen", "Sit at a table or connect to a machine and your Adrian and name tag appear there for everyone in the room. Stand up or walk away and they go too.")), e.push(ne("Spaces", "Each seat and machine holds one person. If someone already has the seat you choose, you are given a free one at the same table.")), e.push(ne("Live chat", "Press Chat to talk to the room and scroll back through this session. Tap a name, or Here now, to send someone a direct message, block or report them. Messages are not secret; this session's chat is kept in this tab only and cleared when you leave the room.")), p.features.includes("rounds") && e.push(ne("Play together", "Roulette and baccarat are shared tables: everyone there plays the same spin or hand, dealt by the room on a timer and checked by your own browser. In the Strata Salon you can take on another player instead of the house bot.")), p.features.includes("react") && e.push(ne("React", "Press 😊 to react, buy your table a round, send someone a drink or invite a friend. Table chat (the Table button in Chat) reaches only the people at your table. Sign in each day for a free daily drop of LAYR.")), e.push(st("p", "Nothing here moves any money.", "fact"));
    const r = st("button", "Leave the room");
    r.onclick = () => {
      K3();
    }, e.push(r);
  } else {
    e.push(st("h3", "Join the room")), e.push(st("p", p.connected ? p.watch ? `You are watching: ${p.joined} signed in, ${p.guests} watching.` : `${p.joined} ${p.joined === 1 ? "person is" : "people are"} in the room. Sign in to join them.` : "Connecting to the room…")), e.push(ne("Be seen", p.watch ? "Join, then sit at a table or connect to a machine. Everyone in the room sees your Adrian there, with a name tag (your BNS name, or a short version of your address). Watching alone shows you to nobody." : "Join, then sit at a table or connect to a machine. Everyone in the room sees your Adrian there, with a name tag (your BNS name, or a short version of your address). Until you join you are invisible, and the room is hidden from you; the casino still plays as normal.")), e.push(ne("Spaces", "Each seat and machine holds one person. If someone already has the seat you choose, you are given a free one at the same table.")), e.push(ne("Live chat", "Signed-in players can chat with the room and send each other direct messages. Messages are not secret and are not saved.")), e.push(ne("Free", "One signature. It sends no transaction, costs no fee and gives no permission to spend anything."));
    const r = st("div", void 0, "row"), s = lr(), o = { leather: "Leather", xverse: "Xverse", casino: s ? s.describe().label : "Casino wallet" };
    for (const i of V3()) {
      const a = st("button", p.busy ? p.busy === "sign" ? "Check your wallet…" : "Connecting…" : o[i]);
      if (a.disabled = !!p.busy || !p.connected, a.onclick = () => {
        F3(i);
      }, i === "casino" && (a.style.flexBasis = "100%"), r.append(a), p.busy) break;
    }
    if (e.push(r), s && !s.describe().has && e.push(st("p", "Casino wallet: use your casino passkey from any of your devices, or make one free with Face ID or your fingerprint (500 free testnet STX and your first 1,000,000 LAYR).", "fact")), p.error && e.push(st("p", p.error, "err")), !p.busy) {
      const i = st("button", "Not now");
      i.onclick = () => {
        p.open = !1, it();
      }, e.push(i);
    }
  }
  qt.replaceChildren(...e);
}
const X3 = (t) => {
  var n, r;
  const e = t.detail;
  !e || typeof e.spot != "string" || !Array.isArray(e.s) || typeof e.b != "number" || !p.features.includes("play") || p.service !== "ok" || !p.connected || !p.signed || !p.you || p.you.guest || ((n = p.spots[e.spot]) == null ? void 0 : n.a) === p.you.a && ((r = p.ws) == null ? void 0 : r.readyState) === WebSocket.OPEN && p.ws.send(JSON.stringify({ t: "play", spot: e.spot, s: e.s.slice(0, 8), b: e.b, f: !!e.f }));
}, Y3 = (t) => {
  const e = t.detail;
  if (e) {
    if (e.off) p.ownMove = null;
    else if ([e.x, e.z, e.r].every((n) => typeof n == "number" && Number.isFinite(n))) p.ownMove = { x: e.x, z: e.z, r: e.r };
    else return;
    Kh();
  }
}, bl = { react: "react", win: "win", daily: "daily", watch: "table", round: "rounds", bet: "rounds", gift: "gift", seek: "pvp", pvp: "pvp" }, J3 = (t) => {
  var s;
  const e = t.detail;
  if (!e || typeof e.t != "string" || !bl[e.t]) return;
  const n = e.t === "round" || e.t === "watch";
  if (!(p.service === "ok" && p.connected && p.features.includes(bl[e.t]) && (n || !!(p.signed && p.you && !p.you.guest))) || ((s = p.ws) == null ? void 0 : s.readyState) !== WebSocket.OPEN) {
    Je({ t: "unsent", msg: e });
    return;
  }
  p.ws.send(JSON.stringify(e));
}, Z3 = () => {
  var e;
  const t = ((e = p.host) == null ? void 0 : e.currentSpot()) ?? null;
  t !== p.want && (p.want = t, p.yielded = null, p.standSent = null, Es()), zh();
};
async function Q3() {
  try {
    const { res: t, body: e } = await As("/casino/room/session");
    if (t.status === 503) return;
    t.ok && (e != null && e.address) && (p.signed = { address: e.address, hash160: e.hash160, expiresAt: e.expiresAt }), p.service = "ok";
  } catch {
    return;
  }
  j3(), it(), zi(), window.setInterval(Z3, 250), window.setInterval(G3, 500), window.addEventListener("px-wallet-connected", (t) => {
    M3(t);
  }), window.addEventListener("px-casino-wallet-ready", () => it()), window.addEventListener("px-room-play", X3), window.addEventListener("px-room-move", Y3), window.addEventListener("px-room-send", J3);
}
window.PXRounds = Object.freeze({ verifySeed: k3, rouletteResult: H3, baccaratCards: I3 });
const gl = (t) => {
  p.host || (p.host = t, Q3());
}, xl = window.PXRoomHost;
xl ? gl(xl) : window.addEventListener("px-room-host", () => gl(window.PXRoomHost), { once: !0 });
window.__pxRoom = {
  chat: () => (Y == null ? void 0 : Y.debug()) ?? null,
  get state() {
    var t;
    return { service: p.service, signed: ((t = p.signed) == null ? void 0 : t.address) ?? null, connected: p.connected, watch: p.watch, prompted: p.prompted, open: p.open, busy: p.busy, error: p.error, you: p.you, spots: p.spots, joined: p.joined, guests: p.guests, want: p.want, features: p.features.slice(), walkers: [...p.walk.keys()], ownMove: p.ownMove, trail: Ce.slice() };
  }
};
