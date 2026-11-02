var W0 = Object.defineProperty;
var X0 = (t, e, n) => e in t ? W0(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var mn = (t, e, n) => X0(t, typeof e != "symbol" ? e + "" : e, n);
function si(t, e) {
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
      const r = Z0(BigInt(`0x${ae(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${ae(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function oi(t, e = 8) {
  return (typeof t == "bigint" ? t : si(t, !1)).toString(16).padStart(e * 2, "0");
}
function Sl(t) {
  return parseInt(t, 16);
}
function El(t, e = 16) {
  const n = oi(t, e);
  return Hn(n);
}
function Y0(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function J0(t, e) {
  return t & BigInt(1) << e;
}
function Z0(t, e) {
  return J0(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Q0 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ae(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Q0[n];
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
function ur(t) {
  return new TextEncoder().encode(t);
}
function Al(t) {
  return new TextDecoder().decode(t);
}
function vl(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function tu(t) {
  return String.fromCharCode.apply(null, t);
}
function eu(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function la(t) {
  if (t.some(eu))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function ii(...t) {
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
  return ii(...t.map((e) => typeof e == "number" ? la([e]) : e instanceof Array ? la(e) : e));
}
function nu(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function ru(t, e) {
  return t[e];
}
function su(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function vs(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var vo;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(vo || (vo = {}));
vo.Mainnet;
const ou = 128, iu = 128, Bl = 16;
var sr;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(sr || (sr = {}));
var fa;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(fa || (fa = {}));
var ha;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(ha || (ha = {}));
var Nt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Nt || (Nt = {}));
const no = ["onChainOnly", "offChainOnly", "any"];
no[0] + "", Nt.OnChainOnly, no[1] + "", Nt.OffChainOnly, no[2] + "", Nt.Any, Nt.OnChainOnly + "", Nt.OnChainOnly, Nt.OffChainOnly + "", Nt.OffChainOnly, Nt.Any + "", Nt.Any;
var Bo;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Bo || (Bo = {}));
Bo.Mainnet;
var ua;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(ua || (ua = {}));
var da;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(da || (da = {}));
var pa;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(pa || (pa = {}));
var ba;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(ba || (ba = {}));
var $o;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})($o || ($o = {}));
var ga;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(ga || (ga = {}));
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
function _o(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function au(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function $l(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function cu(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  _o(t.outputLen), _o(t.blockLen);
}
function lu(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function fu(t, e) {
  $l(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ro = {
  number: _o,
  bool: au,
  bytes: $l,
  hash: cu,
  exists: lu,
  output: fu
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const so = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Rt = (t, e) => t << 32 - e | t >>> e, hu = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!hu)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function uu(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function _l(t) {
  if (typeof t == "string" && (t = uu(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let du = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function cn(t) {
  const e = (r) => t().update(_l(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function pu(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, h = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + h, a, r);
}
let ai = class extends du {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = so(this.buffer);
  }
  update(e) {
    ro.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = _l(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = so(e);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ro.exists(this), ro.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let l = i; l < s; l++)
      n[l] = 0;
    pu(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = so(e), c = this.outputLen;
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
const bu = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Hl = Uint8Array.from({ length: 16 }, (t, e) => e), gu = Hl.map((t) => (9 * t + 5) % 16);
let ci = [Hl], li = [gu];
for (let t = 0; t < 4; t++)
  for (let e of [ci, li])
    e.push(e[t].map((n) => bu[n]));
const Ll = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), xu = ci.map((t, e) => t.map((n) => Ll[e][n])), wu = li.map((t, e) => t.map((n) => Ll[e][n])), yu = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), mu = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Or = (t, e) => t << e | t >>> 32 - e;
function Ea(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const kr = new Uint32Array(16);
let Su = class extends ai {
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
      kr[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, h = this.h3 | 0, f = h, l = this.h4 | 0, b = l;
    for (let d = 0; d < 5; d++) {
      const x = 4 - d, w = yu[d], v = mu[d], H = ci[d], U = li[d], y = xu[d], $ = wu[d];
      for (let A = 0; A < 16; A++) {
        const P = Or(r + Ea(d, o, a, h) + kr[H[A]] + w, y[A]) + l | 0;
        r = l, l = h, h = Or(a, 10) | 0, a = o, o = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = Or(s + Ea(x, i, c, f) + kr[U[A]] + v, $[A]) + b | 0;
        s = b, b = f, f = Or(c, 10) | 0, c = i, i = P;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + h + b | 0, this.h3 + l + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    kr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
cn(() => new Su());
const Eu = (t, e, n) => t & e ^ ~t & n, Au = (t, e, n) => t & e ^ t & n ^ e & n, vu = new Uint32Array([
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
]), ue = new Uint32Array(64);
let Il = class extends ai {
  constructor() {
    super(64, 32, 8, !1), this.A = he[0] | 0, this.B = he[1] | 0, this.C = he[2] | 0, this.D = he[3] | 0, this.E = he[4] | 0, this.F = he[5] | 0, this.G = he[6] | 0, this.H = he[7] | 0;
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
      ue[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = ue[l - 15], d = ue[l - 2], x = Rt(b, 7) ^ Rt(b, 18) ^ b >>> 3, w = Rt(d, 17) ^ Rt(d, 19) ^ d >>> 10;
      ue[l] = w + ue[l - 7] + x + ue[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: h, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const b = Rt(a, 6) ^ Rt(a, 11) ^ Rt(a, 25), d = f + b + Eu(a, c, h) + vu[l] + ue[l] | 0, w = (Rt(r, 2) ^ Rt(r, 13) ^ Rt(r, 22)) + Au(r, s, o) | 0;
      f = h, h = c, c = a, a = i + d | 0, i = o, o = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, h = h + this.G | 0, f = f + this.H | 0, this.set(r, s, o, i, a, c, h, f);
  }
  roundClean() {
    ue.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Bu = class extends Il {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
cn(() => new Il());
cn(() => new Bu());
const Cr = BigInt(2 ** 32 - 1), Ho = BigInt(32);
function Ul(t, e = !1) {
  return e ? { h: Number(t & Cr), l: Number(t >> Ho & Cr) } : { h: Number(t >> Ho & Cr) | 0, l: Number(t & Cr) | 0 };
}
function $u(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = Ul(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const _u = (t, e) => BigInt(t >>> 0) << Ho | BigInt(e >>> 0), Hu = (t, e, n) => t >>> n, Lu = (t, e, n) => t << 32 - n | e >>> n, Iu = (t, e, n) => t >>> n | e << 32 - n, Uu = (t, e, n) => t << 32 - n | e >>> n, Ou = (t, e, n) => t << 64 - n | e >>> n - 32, ku = (t, e, n) => t >>> n - 32 | e << 64 - n, Cu = (t, e) => e, Pu = (t, e) => t, Nu = (t, e, n) => t << n | e >>> 32 - n, Du = (t, e, n) => e << n | t >>> 32 - n, Tu = (t, e, n) => e << n - 32 | t >>> 64 - n, Fu = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Mu(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Ru = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Gu = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Vu = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Ku = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, zu = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), ju = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, G = {
  fromBig: Ul,
  split: $u,
  toBig: _u,
  shrSH: Hu,
  shrSL: Lu,
  rotrSH: Iu,
  rotrSL: Uu,
  rotrBH: Ou,
  rotrBL: ku,
  rotr32H: Cu,
  rotr32L: Pu,
  rotlSH: Nu,
  rotlSL: Du,
  rotlBH: Tu,
  rotlBL: Fu,
  add: Mu,
  add3L: Ru,
  add3H: Gu,
  add4L: Vu,
  add4H: Ku,
  add5H: ju,
  add5L: zu
}, [qu, Wu] = G.split([
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
].map((t) => BigInt(t))), de = new Uint32Array(80), pe = new Uint32Array(80);
let Bs = class extends ai {
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
      de[y] = e.getUint32(n), pe[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const $ = de[y - 15] | 0, A = pe[y - 15] | 0, P = G.rotrSH($, A, 1) ^ G.rotrSH($, A, 8) ^ G.shrSH($, A, 7), F = G.rotrSL($, A, 1) ^ G.rotrSL($, A, 8) ^ G.shrSL($, A, 7), O = de[y - 2] | 0, k = pe[y - 2] | 0, g = G.rotrSH(O, k, 19) ^ G.rotrBH(O, k, 61) ^ G.shrSH(O, k, 6), E = G.rotrSL(O, k, 19) ^ G.rotrBL(O, k, 61) ^ G.shrSL(O, k, 6), L = G.add4L(F, E, pe[y - 7], pe[y - 16]), C = G.add4H(L, P, g, de[y - 7], de[y - 16]);
      de[y] = C | 0, pe[y] = L | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: h, Dl: f, Eh: l, El: b, Fh: d, Fl: x, Gh: w, Gl: v, Hh: H, Hl: U } = this;
    for (let y = 0; y < 80; y++) {
      const $ = G.rotrSH(l, b, 14) ^ G.rotrSH(l, b, 18) ^ G.rotrBH(l, b, 41), A = G.rotrSL(l, b, 14) ^ G.rotrSL(l, b, 18) ^ G.rotrBL(l, b, 41), P = l & d ^ ~l & w, F = b & x ^ ~b & v, O = G.add5L(U, A, F, Wu[y], pe[y]), k = G.add5H(O, H, $, P, qu[y], de[y]), g = O | 0, E = G.rotrSH(r, s, 28) ^ G.rotrBH(r, s, 34) ^ G.rotrBH(r, s, 39), L = G.rotrSL(r, s, 28) ^ G.rotrBL(r, s, 34) ^ G.rotrBL(r, s, 39), C = r & o ^ r & a ^ o & a, M = s & i ^ s & c ^ i & c;
      H = w | 0, U = v | 0, w = d | 0, v = x | 0, d = l | 0, x = b | 0, { h: l, l: b } = G.add(h | 0, f | 0, k | 0, g | 0), h = a | 0, f = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const N = G.add3L(g, L, M);
      r = G.add3H(N, k, E, C), s = N | 0;
    }
    ({ h: r, l: s } = G.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = G.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = G.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h, l: f } = G.add(this.Dh | 0, this.Dl | 0, h | 0, f | 0), { h: l, l: b } = G.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h: d, l: x } = G.add(this.Fh | 0, this.Fl | 0, d | 0, x | 0), { h: w, l: v } = G.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: H, l: U } = G.add(this.Hh | 0, this.Hl | 0, H | 0, U | 0), this.set(r, s, o, i, a, c, h, f, l, b, d, x, w, v, H, U);
  }
  roundClean() {
    de.fill(0), pe.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Xu = class extends Bs {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Yu = class extends Bs {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Ju = class extends Bs {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
cn(() => new Bs());
cn(() => new Xu());
cn(() => new Yu());
cn(() => new Ju());
const Zu = {}, Ol = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Zu
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const J = BigInt(0), ot = BigInt(1), Fe = BigInt(2), tr = BigInt(3), Aa = BigInt(8), nt = Object.freeze({
  a: J,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: ot,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), va = (t, e) => (t + e / Fe) / e, Pr = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = nt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -ot * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), o = n, i = BigInt("0x100000000000000000000000000000000"), a = va(o * t, e), c = va(-r * t, e);
    let h = I(t - a * n - c * s, e), f = I(-a * r - c * o, e);
    const l = h > i, b = f > i;
    if (l && (h = e - h), b && (f = e - f), h > i || f > i)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: h, k2neg: b, k2: f };
  }
}, Mt = 32, en = 32, kl = 32, cs = Mt + 1, ls = 2 * Mt + 1;
function Ba(t) {
  const { a: e, b: n } = nt, r = I(t * t), s = I(r * t);
  return I(s + e * t + n);
}
const Nr = nt.a === J;
class fi extends Error {
  constructor(e) {
    super(e);
  }
}
function $a(t) {
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
    const n = rd(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return tt.toAffineBatch(e).map(tt.fromAffine);
  }
  equals(e) {
    $a(e);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = e, c = I(s * s), h = I(a * a), f = I(n * h), l = I(o * c), b = I(I(r * a) * h), d = I(I(i * s) * c);
    return f === l && b === d;
  }
  negate() {
    return new tt(this.x, I(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = I(e * e), o = I(n * n), i = I(o * o), a = e + o, c = I(Fe * (I(a * a) - s - i)), h = I(tr * s), f = I(h * h), l = I(f - Fe * c), b = I(h * (c - l) - Aa * i), d = I(Fe * n * r);
    return new tt(l, b, d);
  }
  add(e) {
    $a(e);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = e;
    if (o === J || i === J)
      return this;
    if (n === J || r === J)
      return e;
    const c = I(s * s), h = I(a * a), f = I(n * h), l = I(o * c), b = I(I(r * a) * h), d = I(I(i * s) * c), x = I(l - f), w = I(d - b);
    if (x === J)
      return w === J ? this.double() : tt.ZERO;
    const v = I(x * x), H = I(x * v), U = I(f * v), y = I(w * w - H - Fe * U), $ = I(w * (U - y) - b * H), A = I(s * a * x);
    return new tt(y, $, A);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = tt.ZERO;
    if (typeof e == "bigint" && e === J)
      return n;
    let r = La(e);
    if (r === ot)
      return this;
    if (!Nr) {
      let l = n, b = this;
      for (; r > J; )
        r & ot && (l = l.add(b)), b = b.double(), r >>= ot;
      return l;
    }
    let { k1neg: s, k1: o, k2neg: i, k2: a } = Pr.splitScalar(r), c = n, h = n, f = this;
    for (; o > J || a > J; )
      o & ot && (c = c.add(f)), a & ot && (h = h.add(f)), f = f.double(), o >>= ot, a >>= ot;
    return s && (c = c.negate()), i && (h = h.negate()), h = new tt(I(h.x * Pr.beta), h.y, h.z), c.add(h);
  }
  precomputeWindow(e) {
    const n = Nr ? 128 / e + 1 : 256 / e + 1, r = [];
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
    let s = n && Lo.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = tt.normalizeZ(s), Lo.set(n, s)));
    let o = tt.ZERO, i = tt.BASE;
    const a = 1 + (Nr ? 128 / r : 256 / r), c = 2 ** (r - 1), h = BigInt(2 ** r - 1), f = 2 ** r, l = BigInt(r);
    for (let b = 0; b < a; b++) {
      const d = b * c;
      let x = Number(e & h);
      e >>= l, x > c && (x -= f, e += ot);
      const w = d, v = d + Math.abs(x) - 1, H = b % 2 !== 0, U = x < 0;
      x === 0 ? i = i.add(Dr(H, s[w])) : o = o.add(Dr(U, s[v]));
    }
    return { p: o, f: i };
  }
  multiply(e, n) {
    let r = La(e), s, o;
    if (Nr) {
      const { k1neg: i, k1: a, k2neg: c, k2: h } = Pr.splitScalar(r);
      let { p: f, f: l } = this.wNAF(a, n), { p: b, f: d } = this.wNAF(h, n);
      f = Dr(i, f), b = Dr(c, b), b = new tt(I(b.x * Pr.beta), b.y, b.z), s = f.add(b), o = l.add(d);
    } else {
      const { p: i, f: a } = this.wNAF(r, n);
      s = i, o = a;
    }
    return tt.normalizeZ([s, o])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, o = this.equals(tt.ZERO);
    e == null && (e = o ? Aa : Mn(s));
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
function Dr(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Lo = /* @__PURE__ */ new WeakMap();
class Z {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Lo.delete(this);
  }
  hasEvenY() {
    return this.y % Fe === J;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = _t(n ? e : e.subarray(1));
    if (!rs(r))
      throw new Error("Point is not on curve");
    const s = Ba(r);
    let o = nd(s);
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
    const n = Yt(e), r = n.length, s = n[0];
    if (r === Mt)
      return this.fromCompressedHex(n);
    if (r === cs && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === ls && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${cs} compressed bytes or ${ls} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Z.BASE.multiply(nn(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: o } = Nl(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const i = hi(Yt(e)), { n: a } = nt, c = r === 2 || r === 3 ? s + a : s, h = Mn(c, a), f = I(-i * h, a), l = I(o * h, a), b = r & 1 ? "03" : "02", d = Z.fromHex(b + Me(c)), x = Z.BASE.multiplyAndAddUnsafe(d, f, l);
    if (!x)
      throw new Error("Cannot recover signature: point at infinify");
    return x.assertValidity(), x;
  }
  toRawBytes(e = !1) {
    return Re(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Me(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Me(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!rs(n) || !rs(r))
      throw new Error(e);
    const s = I(r * r), o = Ba(n);
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
function _a(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Ha(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Ln(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: _t(n), left: t.subarray(e + 2) };
}
function Qu(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Ln(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Ha(t.subarray(2)), { data: r, left: s } = Ha(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Ln(s)}`);
  return { r: e, s: r };
}
class ie {
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
    return new ie(fs(s.slice(0, 64)), fs(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Qu(n ? e : Re(e));
    return new ie(r, s);
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
    return this.hasHighS() ? new ie(this.r, I(-this.s, nt.n)) : this;
  }
  toDERRawBytes() {
    return Re(this.toDERHex());
  }
  toDERHex() {
    const e = _a(Zn(this.s)), n = _a(Zn(this.r)), r = e.length / 2, s = n.length / 2, o = Zn(r), i = Zn(s);
    return `30${Zn(s + r + 4)}02${i}${n}02${o}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Re(this.toCompactHex());
  }
  toCompactHex() {
    return Me(this.r) + Me(this.s);
  }
}
function De(...t) {
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
const td = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ln(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += td[t[n]];
  return e;
}
const ed = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Me(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(J <= t && t < ed))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function In(t) {
  const e = Re(Me(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Zn(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function fs(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function Re(t) {
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
  return fs(Ln(t));
}
function Yt(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Re(t);
}
function La(t) {
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
function nd(t) {
  const { P: e } = nt, n = BigInt(6), r = BigInt(11), s = BigInt(22), o = BigInt(23), i = BigInt(44), a = BigInt(88), c = t * t * t % e, h = c * c * t % e, f = Lt(h, tr) * h % e, l = Lt(f, tr) * h % e, b = Lt(l, Fe) * c % e, d = Lt(b, r) * b % e, x = Lt(d, s) * d % e, w = Lt(x, i) * x % e, v = Lt(w, a) * w % e, H = Lt(v, i) * x % e, U = Lt(H, tr) * h % e, y = Lt(U, o) * d % e, $ = Lt(y, n) * c % e, A = Lt($, Fe);
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
function rd(t, e = nt.P) {
  const n = new Array(t.length), r = t.reduce((o, i, a) => i === J ? o : (n[a] = o, I(o * i, e)), ot), s = Mn(r, e);
  return t.reduceRight((o, i, a) => i === J ? o : (n[a] = I(o * n[a], e), I(o * i, e)), s), n;
}
function sd(t) {
  const e = t.length * 8 - en * 8, n = _t(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function hi(t, e = !1) {
  const n = sd(t);
  if (e)
    return n;
  const { n: r } = nt;
  return n >= r ? n - r : n;
}
let _n, er;
class Cl {
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
      throw new fi("hmacSha256Sync needs to be set");
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
    return De(...n);
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
    return De(...n);
  }
}
function Un(t) {
  return J < t && t < nt.n;
}
function rs(t) {
  return J < t && t < nt.P;
}
function Pl(t, e, n, r = !0) {
  const { n: s } = nt, o = hi(t, !0);
  if (!Un(o))
    return;
  const i = Mn(o, s), a = Z.BASE.multiply(o), c = I(a.x, s);
  if (c === J)
    return;
  const h = I(i * I(e + n * c, s), s);
  if (h === J)
    return;
  let f = new ie(c, h), l = (a.x === f.r ? 0 : 2) | Number(a.y & ot);
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
    e = fs(t);
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
function ui(t) {
  return t instanceof Z ? (t.assertValidity(), t) : Z.fromHex(t);
}
function Nl(t) {
  if (t instanceof ie)
    return t.assertValidity(), t;
  try {
    return ie.fromDER(t);
  } catch {
    return ie.fromCompact(t);
  }
}
function di(t, e = !1) {
  return Z.fromPrivateKey(t).toRawBytes(e);
}
function od(t, e, n, r = !1) {
  return Z.fromSignature(t, e, n).toRawBytes(r);
}
function Ia(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === cs || r === ls : n ? r === cs * 2 || r === ls * 2 : t instanceof Z;
}
function pi(t, e, n = !1) {
  if (Ia(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Ia(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = ui(e);
  return r.assertValidity(), r.multiply(nn(t)).toRawBytes(n);
}
function Dl(t) {
  const e = t.length > Mt ? t.slice(0, Mt) : t;
  return _t(e);
}
function id(t) {
  const e = Dl(t), n = I(e, nt.n);
  return Tl(n < J ? e : n);
}
function Tl(t) {
  return In(t);
}
function Fl(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Yt(t), s = nn(e), o = [Tl(s), id(r)];
  if (n != null) {
    n === !0 && (n = at.randomBytes(Mt));
    const c = Yt(n);
    if (c.length !== Mt)
      throw new Error(`sign: Expected ${Mt} bytes of extra data`);
    o.push(c);
  }
  const i = De(...o), a = Dl(r);
  return { seed: i, m: a, d: s };
}
function Ml(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: o } = Object.assign({ canonical: !0, der: !0 }, e), i = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return o ? [i, r] : i;
}
async function ad(t, e, n = {}) {
  const { seed: r, m: s, d: o } = Fl(t, e, n.extraEntropy), i = new Cl(kl, en);
  await i.reseed(r);
  let a;
  for (; !(a = Pl(await i.generate(), s, o, n.canonical)); )
    await i.reseed();
  return Ml(a, n);
}
function Rl(t, e, n = {}) {
  const { seed: r, m: s, d: o } = Fl(t, e, n.extraEntropy), i = new Cl(kl, en);
  i.reseedSync(r);
  let a;
  for (; !(a = Pl(i.generateSync(), s, o, n.canonical)); )
    i.reseedSync();
  return Ml(a, n);
}
const cd = { strict: !0 };
function ld(t, e, n, r = cd) {
  let s;
  try {
    s = Nl(t), e = Yt(e);
  } catch {
    return !1;
  }
  const { r: o, s: i } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = hi(e);
  let c;
  try {
    c = ui(n);
  } catch {
    return !1;
  }
  const { n: h } = nt, f = Mn(i, h), l = I(a * f, h), b = I(o * f, h), d = Z.BASE.multiplyAndAddUnsafe(c, l, b);
  return d ? I(d.x, h) === o : !1;
}
function hs(t) {
  return I(_t(t), nt.n);
}
class On {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Yt(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = _t(n.subarray(0, 32)), s = _t(n.subarray(32, 64));
    return new On(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!rs(e) || !Un(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Me(this.r) + Me(this.s);
  }
  toRawBytes() {
    return Re(this.toHex());
  }
}
function fd(t) {
  return Z.fromPrivateKey(t).toRawX();
}
class Gl {
  constructor(e, n, r = at.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Yt(e);
    const { x: s, scalar: o } = this.getScalar(nn(n));
    if (this.px = s, this.d = o, this.rand = Yt(r), this.rand.length !== 32)
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
    const { m: e, d: n, px: r, rand: s } = this, o = at.taggedHash, i = this.initNonce(n, await o(Ne.aux, s)), { R: a, rx: c, k: h } = this.finalizeNonce(await o(Ne.nonce, i, r, e)), f = hs(await o(Ne.challenge, c, r, e)), l = this.finalizeSig(a, h, f, n);
    return await zl(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, o = at.taggedHashSync, i = this.initNonce(n, o(Ne.aux, s)), { R: a, rx: c, k: h } = this.finalizeNonce(o(Ne.nonce, i, r, e)), f = hs(o(Ne.challenge, c, r, e)), l = this.finalizeSig(a, h, f, n);
    return jl(l, e, r) || this.error(), l;
  }
}
async function hd(t, e, n) {
  return new Gl(t, e, n).calc();
}
function ud(t, e, n) {
  return new Gl(t, e, n).calcSync();
}
function Vl(t, e, n) {
  const r = t instanceof On, s = r ? t : On.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Yt(e),
    P: ui(n)
  };
}
function Kl(t, e, n, r) {
  const s = Z.BASE.multiplyAndAddUnsafe(e, nn(n), I(-r, nt.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function zl(t, e, n) {
  try {
    const { r, s, m: o, P: i } = Vl(t, e, n), a = hs(await at.taggedHash(Ne.challenge, In(r), i.toRawX(), o));
    return Kl(r, i, s, a);
  } catch {
    return !1;
  }
}
function jl(t, e, n) {
  try {
    const { r, s, m: o, P: i } = Vl(t, e, n), a = hs(at.taggedHashSync(Ne.challenge, In(r), i.toRawX(), o));
    return Kl(r, i, s, a);
  } catch (r) {
    if (r instanceof fi)
      throw r;
    return !1;
  }
}
const dd = {
  Signature: On,
  getPublicKey: fd,
  sign: hd,
  verify: zl,
  signSync: ud,
  verifySync: jl
};
Z.BASE._setWindowSize(8);
const vt = {
  node: Ol,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Ne = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Tr = {}, at = {
  bytesToHex: Ln,
  hexToBytes: Re,
  concatBytes: De,
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
    t = Yt(t);
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
      const e = await vt.web.subtle.digest("SHA-256", De(...t));
      return new Uint8Array(e);
    } else if (vt.node) {
      const { createHash: e } = vt.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (vt.web) {
      const n = await vt.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = De(...e), s = await vt.web.subtle.sign("HMAC", n, r);
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
    let n = Tr[t];
    if (n === void 0) {
      const r = await at.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = De(r, r), Tr[t] = n;
    }
    return at.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof _n != "function")
      throw new fi("sha256Sync is undefined, you need to set it");
    let n = Tr[t];
    if (n === void 0) {
      const r = _n(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = De(r, r), Tr[t] = n;
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
const pd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: nt,
  Point: Z,
  Signature: ie,
  getPublicKey: di,
  getSharedSecret: pi,
  recoverPublicKey: od,
  schnorr: dd,
  sign: ad,
  signSync: Rl,
  utils: at,
  verify: ld
}, Symbol.toStringTag, { value: "Module" }));
var gt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function bd(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function dr(t) {
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
var Rn = {}, bi = {};
const Sn = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function ql(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Io(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Ve(t, ...e) {
  if (!ql(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function Wl(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Io(t.outputLen), Io(t.blockLen);
}
function or(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Xl(t, e) {
  Ve(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function gd(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function xd(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function ir(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function ss(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Pt(t, e) {
  return t << 32 - e | t >>> e;
}
function wd(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const gi = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function xi(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const Yl = gi ? (t) => t : (t) => xi(t), yd = Yl;
function Jl(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = xi(t[e]);
  return t;
}
const md = gi ? (t) => t : Jl, Zl = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", Sd = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ed(t) {
  if (Ve(t), Zl)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Sd[t[n]];
  return e;
}
const ne = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Ua(t) {
  if (t >= ne._0 && t <= ne._9)
    return t - ne._0;
  if (t >= ne.A && t <= ne.F)
    return t - (ne.A - 10);
  if (t >= ne.a && t <= ne.f)
    return t - (ne.a - 10);
}
function Ad(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (Zl)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, o = 0; s < n; s++, o += 2) {
    const i = Ua(t.charCodeAt(o)), a = Ua(t.charCodeAt(o + 1));
    if (i === void 0 || a === void 0) {
      const c = t[o] + t[o + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + o);
    }
    r[s] = i * 16 + a;
  }
  return r;
}
const Ql = async () => {
};
async function vd(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const o = Date.now() - r;
    o >= 0 && o < e || (await Ql(), r += o);
  }
}
function wi(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function Bd(t) {
  return new TextDecoder().decode(t);
}
function Gn(t) {
  return typeof t == "string" && (t = wi(t)), Ve(t), t;
}
function $d(t) {
  return typeof t == "string" && (t = wi(t)), Ve(t), t;
}
function _d(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    Ve(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const o = t[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function Hd(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let yi = class {
};
function $s(t) {
  const e = (r) => t().update(Gn(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function tf(t) {
  const e = (r, s) => t(s).update(Gn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function ef(t) {
  const e = (r, s) => t(s).update(Gn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const Ld = $s, Id = tf, Ud = ef;
function Od(t = 32) {
  if (Sn && typeof Sn.getRandomValues == "function")
    return Sn.getRandomValues(new Uint8Array(t));
  if (Sn && typeof Sn.randomBytes == "function")
    return Uint8Array.from(Sn.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const kd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: yi,
  abytes: Ve,
  aexists: or,
  ahash: Wl,
  anumber: Io,
  aoutput: Xl,
  asyncLoop: vd,
  byteSwap: xi,
  byteSwap32: Jl,
  byteSwapIfBE: yd,
  bytesToHex: Ed,
  bytesToUtf8: Bd,
  checkOpts: Hd,
  clean: ir,
  concatBytes: _d,
  createHasher: $s,
  createOptHasher: tf,
  createView: ss,
  createXOFer: ef,
  hexToBytes: Ad,
  isBytes: ql,
  isLE: gi,
  kdfInputToBytes: $d,
  nextTick: Ql,
  randomBytes: Od,
  rotl: wd,
  rotr: Pt,
  swap32IfBE: md,
  swap8IfBE: Yl,
  toBytes: Gn,
  u32: xd,
  u8: gd,
  utf8ToBytes: wi,
  wrapConstructor: Ld,
  wrapConstructorWithOpts: Id,
  wrapXOFConstructorWithOpts: Ud
}, Symbol.toStringTag, { value: "Module" })), pr = /* @__PURE__ */ dr(kd);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = pr;
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
})(bi);
var rn = {};
function Cd(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, h = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + h, a, r);
}
function Pd(t, e, n) {
  return t & e ^ ~t & n;
}
function Nd(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class Dd extends yi {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = ss(this.buffer);
  }
  update(e) {
    or(this), e = Gn(e), Ve(e);
    const { view: n, buffer: r, blockLen: s } = this, o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = ss(e);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    or(this), Xl(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, ir(this.buffer.subarray(i)), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let l = i; l < s; l++)
      n[l] = 0;
    Cd(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = ss(e), c = this.outputLen;
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
const be = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ge = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), Td = /* @__PURE__ */ Uint32Array.from([
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
]), xe = /* @__PURE__ */ new Uint32Array(64);
let mi = class extends Dd {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = be[0] | 0, this.B = be[1] | 0, this.C = be[2] | 0, this.D = be[3] | 0, this.E = be[4] | 0, this.F = be[5] | 0, this.G = be[6] | 0, this.H = be[7] | 0;
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
      xe[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = xe[l - 15], d = xe[l - 2], x = Pt(b, 7) ^ Pt(b, 18) ^ b >>> 3, w = Pt(d, 17) ^ Pt(d, 19) ^ d >>> 10;
      xe[l] = w + xe[l - 7] + x + xe[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: h, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const b = Pt(a, 6) ^ Pt(a, 11) ^ Pt(a, 25), d = f + b + Pd(a, c, h) + Td[l] + xe[l] | 0, w = (Pt(r, 2) ^ Pt(r, 13) ^ Pt(r, 22)) + Nd(r, s, o) | 0;
      f = h, h = c, c = a, a = i + d | 0, i = o, o = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, h = h + this.G | 0, f = f + this.H | 0, this.set(r, s, o, i, a, c, h, f);
  }
  roundClean() {
    ir(xe);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), ir(this.buffer);
  }
}, nf = class extends mi {
  constructor() {
    super(28), this.A = ge[0] | 0, this.B = ge[1] | 0, this.C = ge[2] | 0, this.D = ge[3] | 0, this.E = ge[4] | 0, this.F = ge[5] | 0, this.G = ge[6] | 0, this.H = ge[7] | 0;
  }
};
const Fd = /* @__PURE__ */ $s(() => new mi()), Md = /* @__PURE__ */ $s(() => new nf()), Rd = mi, Gd = Fd, Vd = nf, Kd = Md, zd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: Vd,
  SHA256: Rd,
  sha224: Kd,
  sha256: Gd
}, Symbol.toStringTag, { value: "Module" })), _s = /* @__PURE__ */ dr(zd);
Object.defineProperty(rn, "__esModule", { value: !0 });
rn.c32checkDecode = rn.c32checkEncode = void 0;
const Oa = _s, ka = pr, nr = bi;
function rf(t) {
  const e = (0, Oa.sha256)((0, Oa.sha256)((0, ka.hexToBytes)(t)));
  return (0, ka.bytesToHex)(e.slice(0, 4));
}
function jd(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = rf(`${n}${e}`), s = (0, nr.c32encode)(`${e}${r}`);
  return `${nr.c32[t]}${s}`;
}
rn.c32checkEncode = jd;
function qd(t) {
  t = (0, nr.c32normalize)(t);
  const e = (0, nr.c32decode)(t.slice(1)), n = t[0], r = nr.c32.indexOf(n), s = e.slice(-8);
  let o = r.toString(16);
  if (o.length === 1 && (o = `0${o}`), rf(`${o}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
rn.c32checkDecode = qd;
var sf = {}, kn = {};
function Wd(t) {
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
    for (var O = new Uint8Array(w + (H - F)), k = w; F !== H; )
      O[k++] = U[F++];
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
var of = Wd;
Object.defineProperty(kn, "__esModule", { value: !0 });
kn.decode = kn.encode = void 0;
const us = _s, Ca = pr, af = of, cf = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function Xd(t, e = "00") {
  const n = typeof t == "string" ? (0, Ca.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Ca.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, us.sha256)((0, us.sha256)(new Uint8Array([...r, ...n])));
  return af(cf).encode([...r, ...n, ...s.slice(0, 4)]);
}
kn.encode = Xd;
function Yd(t) {
  const e = af(cf).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, us.sha256)((0, us.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((o, i) => {
    if (o !== s[i])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
kn.decode = Yd;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = rn, n = kn, r = pr;
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
})(sf);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = bi;
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
  const r = sf;
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
var ds = { exports: {} };
ds.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, o = "[object Arguments]", i = "[object Array]", a = "[object Boolean]", c = "[object Date]", h = "[object Error]", f = "[object Function]", l = "[object GeneratorFunction]", b = "[object Map]", d = "[object Number]", x = "[object Object]", w = "[object Promise]", v = "[object RegExp]", H = "[object Set]", U = "[object String]", y = "[object Symbol]", $ = "[object WeakMap]", A = "[object ArrayBuffer]", P = "[object DataView]", F = "[object Float32Array]", O = "[object Float64Array]", k = "[object Int8Array]", g = "[object Int16Array]", E = "[object Int32Array]", L = "[object Uint8Array]", C = "[object Uint8ClampedArray]", M = "[object Uint16Array]", N = "[object Uint32Array]", ht = /[\\^$.*+?()[\]{}|]/g, et = /\w*$/, Ke = /^\[object .+?Constructor\]$/, rt = /^(?:0|[1-9]\d*)$/, R = {};
  R[o] = R[i] = R[A] = R[P] = R[a] = R[c] = R[F] = R[O] = R[k] = R[g] = R[E] = R[b] = R[d] = R[x] = R[v] = R[H] = R[U] = R[y] = R[L] = R[C] = R[M] = R[N] = !0, R[h] = R[f] = R[$] = !1;
  var yr = typeof gt == "object" && gt && gt.Object === Object && gt, jn = typeof self == "object" && self && self.Object === Object && self, wt = yr || jn || Function("return this")(), ze = e && !e.nodeType && e, St = ze && !0 && t && !t.nodeType && t, Ht = St && St.exports === ze;
  function Gs(u, m) {
    return u.set(m[0], m[1]), u;
  }
  function Vs(u, m) {
    return u.add(m), u;
  }
  function pn(u, m) {
    for (var B = -1, D = u ? u.length : 0; ++B < D && m(u[B], B, u) !== !1; )
      ;
    return u;
  }
  function Ks(u, m) {
    for (var B = -1, D = m.length, dt = u.length; ++B < D; )
      u[dt + B] = m[B];
    return u;
  }
  function mr(u, m, B, D) {
    for (var dt = -1, yt = u ? u.length : 0; ++dt < yt; )
      B = m(B, u[dt], dt, u);
    return B;
  }
  function Sr(u, m) {
    for (var B = -1, D = Array(u); ++B < u; )
      D[B] = m(B);
    return D;
  }
  function zs(u, m) {
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
  var js = Array.prototype, qs = Function.prototype, Q = Object.prototype, je = wt["__core-js_shared__"], pt = function() {
    var u = /[^.]+$/.exec(je && je.keys && je.keys.IE_PROTO || "");
    return u ? "Symbol(src)_1." + u : "";
  }(), Yn = qs.toString, Ot = Q.hasOwnProperty, qe = Q.toString, Ws = RegExp(
    "^" + Yn.call(Ot).replace(ht, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), We = Ht ? wt.Buffer : void 0, Er = wt.Symbol, Jn = wt.Uint8Array, Xs = Wn(Object.getPrototypeOf, Object), Ar = Object.create, vr = Q.propertyIsEnumerable, Br = js.splice, $r = Object.getOwnPropertySymbols, _r = We ? We.isBuffer : void 0, Ys = Wn(Object.keys, Object), S = wn(wt, "DataView"), T = wn(wt, "Map"), X = wn(wt, "Promise"), W = wn(wt, "Set"), ct = wn(wt, "WeakMap"), ut = wn(Object, "create"), Et = Je(S), At = Je(T), fe = Je(X), kt = Je(W), Xi = Je(ct), Yi = Er ? Er.prototype : void 0, Ji = Yi ? Yi.valueOf : void 0;
  function Xe(u) {
    var m = -1, B = u ? u.length : 0;
    for (this.clear(); ++m < B; ) {
      var D = u[m];
      this.set(D[0], D[1]);
    }
  }
  function Jh() {
    this.__data__ = ut ? ut(null) : {};
  }
  function Zh(u) {
    return this.has(u) && delete this.__data__[u];
  }
  function Qh(u) {
    var m = this.__data__;
    if (ut) {
      var B = m[u];
      return B === r ? void 0 : B;
    }
    return Ot.call(m, u) ? m[u] : void 0;
  }
  function t0(u) {
    var m = this.__data__;
    return ut ? m[u] !== void 0 : Ot.call(m, u);
  }
  function e0(u, m) {
    var B = this.__data__;
    return B[u] = ut && m === void 0 ? r : m, this;
  }
  Xe.prototype.clear = Jh, Xe.prototype.delete = Zh, Xe.prototype.get = Qh, Xe.prototype.has = t0, Xe.prototype.set = e0;
  function te(u) {
    var m = -1, B = u ? u.length : 0;
    for (this.clear(); ++m < B; ) {
      var D = u[m];
      this.set(D[0], D[1]);
    }
  }
  function n0() {
    this.__data__ = [];
  }
  function r0(u) {
    var m = this.__data__, B = Hr(m, u);
    if (B < 0)
      return !1;
    var D = m.length - 1;
    return B == D ? m.pop() : Br.call(m, B, 1), !0;
  }
  function s0(u) {
    var m = this.__data__, B = Hr(m, u);
    return B < 0 ? void 0 : m[B][1];
  }
  function o0(u) {
    return Hr(this.__data__, u) > -1;
  }
  function i0(u, m) {
    var B = this.__data__, D = Hr(B, u);
    return D < 0 ? B.push([u, m]) : B[D][1] = m, this;
  }
  te.prototype.clear = n0, te.prototype.delete = r0, te.prototype.get = s0, te.prototype.has = o0, te.prototype.set = i0;
  function gn(u) {
    var m = -1, B = u ? u.length : 0;
    for (this.clear(); ++m < B; ) {
      var D = u[m];
      this.set(D[0], D[1]);
    }
  }
  function a0() {
    this.__data__ = {
      hash: new Xe(),
      map: new (T || te)(),
      string: new Xe()
    };
  }
  function c0(u) {
    return Lr(this, u).delete(u);
  }
  function l0(u) {
    return Lr(this, u).get(u);
  }
  function f0(u) {
    return Lr(this, u).has(u);
  }
  function h0(u, m) {
    return Lr(this, u).set(u, m), this;
  }
  gn.prototype.clear = a0, gn.prototype.delete = c0, gn.prototype.get = l0, gn.prototype.has = f0, gn.prototype.set = h0;
  function xn(u) {
    this.__data__ = new te(u);
  }
  function u0() {
    this.__data__ = new te();
  }
  function d0(u) {
    return this.__data__.delete(u);
  }
  function p0(u) {
    return this.__data__.get(u);
  }
  function b0(u) {
    return this.__data__.has(u);
  }
  function g0(u, m) {
    var B = this.__data__;
    if (B instanceof te) {
      var D = B.__data__;
      if (!T || D.length < n - 1)
        return D.push([u, m]), this;
      B = this.__data__ = new gn(D);
    }
    return B.set(u, m), this;
  }
  xn.prototype.clear = u0, xn.prototype.delete = d0, xn.prototype.get = p0, xn.prototype.has = b0, xn.prototype.set = g0;
  function x0(u, m) {
    var B = Qs(u) || R0(u) ? Sr(u.length, String) : [], D = B.length, dt = !!D;
    for (var yt in u)
      Ot.call(u, yt) && !(dt && (yt == "length" || D0(yt, D))) && B.push(yt);
    return B;
  }
  function Zi(u, m, B) {
    var D = u[m];
    (!(Ot.call(u, m) && na(D, B)) || B === void 0 && !(m in u)) && (u[m] = B);
  }
  function Hr(u, m) {
    for (var B = u.length; B--; )
      if (na(u[B][0], m))
        return B;
    return -1;
  }
  function w0(u, m) {
    return u && Qi(m, to(m), u);
  }
  function Js(u, m, B, D, dt, yt, ee) {
    var mt;
    if (D && (mt = yt ? D(u, dt, yt, ee) : D(u)), mt !== void 0)
      return mt;
    if (!Ir(u))
      return u;
    var oa = Qs(u);
    if (oa) {
      if (mt = C0(u), !m)
        return U0(u, mt);
    } else {
      var yn = Ye(u), ia = yn == f || yn == l;
      if (V0(u))
        return v0(u, m);
      if (yn == x || yn == o || ia && !yt) {
        if (qn(u))
          return yt ? u : {};
        if (mt = P0(ia ? {} : u), !m)
          return O0(u, w0(mt, u));
      } else {
        if (!R[yn])
          return yt ? u : {};
        mt = N0(u, yn, Js, m);
      }
    }
    ee || (ee = new xn());
    var aa = ee.get(u);
    if (aa)
      return aa;
    if (ee.set(u, mt), !oa)
      var ca = B ? k0(u) : to(u);
    return pn(ca || u, function(eo, Ur) {
      ca && (Ur = eo, eo = u[Ur]), Zi(mt, Ur, Js(eo, m, B, D, Ur, u, ee));
    }), mt;
  }
  function y0(u) {
    return Ir(u) ? Ar(u) : {};
  }
  function m0(u, m, B) {
    var D = m(u);
    return Qs(u) ? D : Ks(D, B(u));
  }
  function S0(u) {
    return qe.call(u);
  }
  function E0(u) {
    if (!Ir(u) || F0(u))
      return !1;
    var m = sa(u) || qn(u) ? Ws : Ke;
    return m.test(Je(u));
  }
  function A0(u) {
    if (!ea(u))
      return Ys(u);
    var m = [];
    for (var B in Object(u))
      Ot.call(u, B) && B != "constructor" && m.push(B);
    return m;
  }
  function v0(u, m) {
    if (m)
      return u.slice();
    var B = new u.constructor(u.length);
    return u.copy(B), B;
  }
  function Zs(u) {
    var m = new u.constructor(u.byteLength);
    return new Jn(m).set(new Jn(u)), m;
  }
  function B0(u, m) {
    var B = m ? Zs(u.buffer) : u.buffer;
    return new u.constructor(B, u.byteOffset, u.byteLength);
  }
  function $0(u, m, B) {
    var D = m ? B(bn(u), !0) : bn(u);
    return mr(D, Gs, new u.constructor());
  }
  function _0(u) {
    var m = new u.constructor(u.source, et.exec(u));
    return m.lastIndex = u.lastIndex, m;
  }
  function H0(u, m, B) {
    var D = m ? B(Xn(u), !0) : Xn(u);
    return mr(D, Vs, new u.constructor());
  }
  function L0(u) {
    return Ji ? Object(Ji.call(u)) : {};
  }
  function I0(u, m) {
    var B = m ? Zs(u.buffer) : u.buffer;
    return new u.constructor(B, u.byteOffset, u.length);
  }
  function U0(u, m) {
    var B = -1, D = u.length;
    for (m || (m = Array(D)); ++B < D; )
      m[B] = u[B];
    return m;
  }
  function Qi(u, m, B, D) {
    B || (B = {});
    for (var dt = -1, yt = m.length; ++dt < yt; ) {
      var ee = m[dt], mt = void 0;
      Zi(B, ee, mt === void 0 ? u[ee] : mt);
    }
    return B;
  }
  function O0(u, m) {
    return Qi(u, ta(u), m);
  }
  function k0(u) {
    return m0(u, to, ta);
  }
  function Lr(u, m) {
    var B = u.__data__;
    return T0(m) ? B[typeof m == "string" ? "string" : "hash"] : B.map;
  }
  function wn(u, m) {
    var B = zs(u, m);
    return E0(B) ? B : void 0;
  }
  var ta = $r ? Wn($r, Object) : j0, Ye = S0;
  (S && Ye(new S(new ArrayBuffer(1))) != P || T && Ye(new T()) != b || X && Ye(X.resolve()) != w || W && Ye(new W()) != H || ct && Ye(new ct()) != $) && (Ye = function(u) {
    var m = qe.call(u), B = m == x ? u.constructor : void 0, D = B ? Je(B) : void 0;
    if (D)
      switch (D) {
        case Et:
          return P;
        case At:
          return b;
        case fe:
          return w;
        case kt:
          return H;
        case Xi:
          return $;
      }
    return m;
  });
  function C0(u) {
    var m = u.length, B = u.constructor(m);
    return m && typeof u[0] == "string" && Ot.call(u, "index") && (B.index = u.index, B.input = u.input), B;
  }
  function P0(u) {
    return typeof u.constructor == "function" && !ea(u) ? y0(Xs(u)) : {};
  }
  function N0(u, m, B, D) {
    var dt = u.constructor;
    switch (m) {
      case A:
        return Zs(u);
      case a:
      case c:
        return new dt(+u);
      case P:
        return B0(u, D);
      case F:
      case O:
      case k:
      case g:
      case E:
      case L:
      case C:
      case M:
      case N:
        return I0(u, D);
      case b:
        return $0(u, D, B);
      case d:
      case U:
        return new dt(u);
      case v:
        return _0(u);
      case H:
        return H0(u, D, B);
      case y:
        return L0(u);
    }
  }
  function D0(u, m) {
    return m = m ?? s, !!m && (typeof u == "number" || rt.test(u)) && u > -1 && u % 1 == 0 && u < m;
  }
  function T0(u) {
    var m = typeof u;
    return m == "string" || m == "number" || m == "symbol" || m == "boolean" ? u !== "__proto__" : u === null;
  }
  function F0(u) {
    return !!pt && pt in u;
  }
  function ea(u) {
    var m = u && u.constructor, B = typeof m == "function" && m.prototype || Q;
    return u === B;
  }
  function Je(u) {
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
  function M0(u) {
    return Js(u, !0, !0);
  }
  function na(u, m) {
    return u === m || u !== u && m !== m;
  }
  function R0(u) {
    return G0(u) && Ot.call(u, "callee") && (!vr.call(u, "callee") || qe.call(u) == o);
  }
  var Qs = Array.isArray;
  function ra(u) {
    return u != null && K0(u.length) && !sa(u);
  }
  function G0(u) {
    return z0(u) && ra(u);
  }
  var V0 = _r || q0;
  function sa(u) {
    var m = Ir(u) ? qe.call(u) : "";
    return m == f || m == l;
  }
  function K0(u) {
    return typeof u == "number" && u > -1 && u % 1 == 0 && u <= s;
  }
  function Ir(u) {
    var m = typeof u;
    return !!u && (m == "object" || m == "function");
  }
  function z0(u) {
    return !!u && typeof u == "object";
  }
  function to(u) {
    return ra(u) ? x0(u) : A0(u);
  }
  function j0() {
    return [];
  }
  function q0() {
    return !1;
  }
  t.exports = M0;
})(ds, ds.exports);
ds.exports;
function Uo(t) {
  return Rn.c32address(t.version, t.hash160);
}
function Si(t, e, n) {
  const r = e || 1, s = n || ou;
  if (_p(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: sr.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Ei(t) {
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
function Jd(t) {
  if (t.type === _.PrincipalStandard)
    return Uo(t.address);
  if (t.type === _.PrincipalContract)
    return `${Uo(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function Zd(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return ep(e, n);
  } else
    return Qd(t);
}
function Qd(t) {
  const e = Ei(t);
  return { type: _.PrincipalStandard, address: e };
}
function tp(t) {
  return { type: _.PrincipalStandard, address: t };
}
function ep(t, e) {
  const n = Ei(t), r = Si(e);
  return lf(n, r);
}
function lf(t, e) {
  if (ur(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: _.PrincipalContract, address: t, contractName: e };
}
function oo(t, e = !1) {
  switch (t.type) {
    case _.BoolTrue:
      return !0;
    case _.BoolFalse:
      return !1;
    case _.Int:
    case _.UInt:
      return e ? t.value.toString() : t.value;
    case _.Buffer:
      return `0x${ae(t.buffer)}`;
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
      return Jd(t);
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
      return { type: Te(t), value: oo(t, !0), success: !1 };
    case _.ResponseOk:
      return { type: Te(t), value: oo(t, !0), success: !0 };
    default:
      return { type: Te(t), value: oo(t, !0) };
  }
}
function Te(t) {
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
      return `(optional ${Te(t.value)})`;
    case _.ResponseErr:
      return `(response UnknownType ${Te(t.value)})`;
    case _.ResponseOk:
      return `(response ${Te(t.value)} UnknownType)`;
    case _.PrincipalStandard:
    case _.PrincipalContract:
      return "principal";
    case _.List:
      return `(list ${t.list.length} ${t.list.length ? Te(t.list[0]) : "UnknownType"})`;
    case _.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${Te(t.data[e])})`).join(" ")})`;
    case _.StringASCII:
      return `(string-ascii ${vl(t.data).length})`;
    case _.StringUTF8:
      return `(string-utf8 ${ur(t.data).length})`;
  }
}
const np = () => ({ type: _.BoolTrue }), rp = () => ({ type: _.BoolFalse }), Pa = BigInt("0xffffffffffffffffffffffffffffffff"), sp = BigInt(0), Na = BigInt("0x7fffffffffffffffffffffffffffffff"), Da = BigInt("-170141183460469231731687303715884105728"), op = (t) => {
  const e = si(t, !0);
  if (e > Na)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Na}`);
  if (e < Da)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Da}`);
  return { type: _.Int, value: e };
}, ff = (t) => {
  const e = si(t, !1);
  if (e < sp)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Pa)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Pa}`);
  return { type: _.UInt, value: e };
}, ip = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: _.Buffer, buffer: t };
};
function ap() {
  return { type: _.OptionalNone };
}
function cp(t) {
  return { type: _.OptionalSome, value: t };
}
function lp(t) {
  return { type: _.ResponseErr, value: t };
}
function fp(t) {
  return { type: _.ResponseOk, value: t };
}
function hp(t) {
  return { type: _.List, list: t };
}
function hf(t) {
  for (const e in t)
    if (!Hp(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: _.Tuple, data: t };
}
const os = (t) => ({ type: _.StringASCII, data: t }), up = (t) => ({ type: _.StringUTF8, data: t });
let uf = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, dp = class extends uf {
  constructor(e) {
    super(e);
  }
};
class io extends uf {
  constructor(e) {
    super(e);
  }
}
function df(t) {
  const e = [];
  return e.push(Hn(oi(t.version, 1))), e.push(Hn(t.hash160)), Fn(e);
}
function Ta(t) {
  const e = Sl(ae(t.readBytes(1))), n = ae(t.readBytes(20));
  return { type: sr.Address, version: e, hash160: n };
}
function pf(t) {
  const e = [], n = ur(t.content), r = n.byteLength;
  return e.push(Hn(oi(r, t.lengthPrefixBytes))), e.push(n), Fn(e);
}
function Fa(t, e, n) {
  e = e || 1;
  const r = Sl(ae(t.readBytes(e))), s = Al(t.readBytes(r));
  return Si(s, e, 128);
}
function Jt(t, e) {
  return Fn([t, e]);
}
function pp(t) {
  return new Uint8Array([t.type]);
}
function bp(t) {
  return t.type === _.OptionalNone ? new Uint8Array([t.type]) : Jt(t.type, br(t.value));
}
function gp(t) {
  const e = new Uint8Array(4);
  return vs(e, t.buffer.length, 0), Jt(t.type, ii(e, t.buffer));
}
function xp(t) {
  const e = El(Y0(t.value, BigInt(iu)), Bl);
  return Jt(t.type, e);
}
function wp(t) {
  const e = El(t.value, Bl);
  return Jt(t.type, e);
}
function yp(t) {
  return Jt(t.type, df(t.address));
}
function mp(t) {
  return Jt(t.type, ii(df(t.address), pf(t.contractName)));
}
function Sp(t) {
  return Jt(t.type, br(t.value));
}
function Ep(t) {
  const e = [], n = new Uint8Array(4);
  vs(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = br(r);
    e.push(s);
  }
  return Jt(t.type, Fn(e));
}
function Ap(t) {
  const e = [], n = new Uint8Array(4);
  vs(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = Si(s);
    e.push(pf(o));
    const i = br(t.data[s]);
    e.push(i);
  }
  return Jt(t.type, Fn(e));
}
function bf(t, e) {
  const n = [], r = e == "ascii" ? vl(t.data) : ur(t.data), s = new Uint8Array(4);
  return vs(s, r.length, 0), n.push(s), n.push(r), Jt(t.type, Fn(n));
}
function vp(t) {
  return bf(t, "ascii");
}
function Bp(t) {
  return bf(t, "utf8");
}
function br(t) {
  switch (t.type) {
    case _.BoolTrue:
    case _.BoolFalse:
      return pp(t);
    case _.OptionalNone:
    case _.OptionalSome:
      return bp(t);
    case _.Buffer:
      return gp(t);
    case _.UInt:
      return wp(t);
    case _.Int:
      return xp(t);
    case _.PrincipalStandard:
      return yp(t);
    case _.PrincipalContract:
      return mp(t);
    case _.ResponseOk:
    case _.ResponseErr:
      return Sp(t);
    case _.List:
      return Ep(t);
    case _.Tuple:
      return Ap(t);
    case _.StringASCII:
      return vp(t);
    case _.StringUTF8:
      return Bp(t);
    default:
      throw new dp("Unable to serialize. Invalid Clarity Value.");
  }
}
function $p(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Ma = /* @__PURE__ */ new Map();
function gf(t, e) {
  const n = Ma.get(t);
  if (n !== void 0)
    return n(e);
  const r = $p(t);
  return Ma.set(t, r), gf(t, e);
}
class Ra {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return su(this.readBytes(4), 0);
  }
  readUInt8() {
    return ru(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return nu(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = ae(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = ae(n);
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
    if (gf(e, r))
      return r;
    throw n(r);
  }
}
function Bn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Ra(Hn(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Ra(t) : e = t;
  switch (e.readUInt8Enum(_, (r) => {
    throw new io(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case _.Int:
      return op(e.readBytes(16));
    case _.UInt:
      return ff(e.readBytes(16));
    case _.Buffer:
      const r = e.readUInt32BE();
      return ip(e.readBytes(r));
    case _.BoolTrue:
      return np();
    case _.BoolFalse:
      return rp();
    case _.PrincipalStandard:
      const s = Ta(e);
      return tp(s);
    case _.PrincipalContract:
      const o = Ta(e), i = Fa(e);
      return lf(o, i);
    case _.ResponseOk:
      return fp(Bn(e));
    case _.ResponseErr:
      return lp(Bn(e));
    case _.OptionalNone:
      return ap();
    case _.OptionalSome:
      return cp(Bn(e));
    case _.List:
      const a = e.readUInt32BE(), c = [];
      for (let w = 0; w < a; w++)
        c.push(Bn(e));
      return hp(c);
    case _.Tuple:
      const h = e.readUInt32BE(), f = {};
      for (let w = 0; w < h; w++) {
        const v = Fa(e).content;
        if (v === void 0)
          throw new io('"content" is undefined');
        f[v] = Bn(e);
      }
      return hf(f);
    case _.StringASCII:
      const l = e.readUInt32BE(), b = tu(e.readBytes(l));
      return os(b);
    case _.StringUTF8:
      const d = e.readUInt32BE(), x = Al(e.readBytes(d));
      return up(x);
    default:
      throw new io("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const _p = (t, e) => t ? ur(t).length > e : !1;
function Hp(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function xf(t) {
  const e = br(t);
  return `0x${ae(e)}`;
}
function Lp(t) {
  return Bn(t);
}
const Ip = (t) => {
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
        var E = new FileReader(), L = b(E), C = /charset=([A-Za-z0-9_-]+)/.exec(g.type), M = C ? C[1] : "utf-8";
        return E.readAsText(g, M), L;
      }
      function w(g) {
        for (var E = new Uint8Array(g), L = new Array(E.length), C = 0; C < E.length; C++)
          L[C] = String.fromCharCode(E[C]);
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
          var C = /([?&])_=[^&]*/;
          if (C.test(this.url))
            this.url = this.url.replace(C, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
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
            var C = L.split("="), M = C.shift().replace(/\+/g, " "), N = C.join("=").replace(/\+/g, " ");
            E.append(decodeURIComponent(M), decodeURIComponent(N));
          }
        }), E;
      }
      function P(g) {
        var E = new f(), L = g.replace(/\r?\n[\t ]+/g, " ");
        return L.split("\r").map(function(C) {
          return C.indexOf(`
`) === 0 ? C.substr(1, C.length) : C;
        }).forEach(function(C) {
          var M = C.split(":"), N = M.shift().trim();
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
          var C = Error(E);
          this.stack = C.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function k(g, E) {
        return new Promise(function(L, C) {
          var M = new $(g, E);
          if (M.signal && M.signal.aborted)
            return C(new e.DOMException("Aborted", "AbortError"));
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
              C(new TypeError("Network request failed"));
            }, 0);
          }, N.ontimeout = function() {
            setTimeout(function() {
              C(new TypeError("Network request timed out"));
            }, 0);
          }, N.onabort = function() {
            setTimeout(function() {
              C(new e.DOMException("Aborted", "AbortError"));
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
            var Ke = [];
            Object.getOwnPropertyNames(E.headers).forEach(function(rt) {
              Ke.push(a(rt)), N.setRequestHeader(rt, c(E.headers[rt]));
            }), M.headers.forEach(function(rt, R) {
              Ke.indexOf(R) === -1 && N.setRequestHeader(R, rt);
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
      return k.polyfill = !0, n.fetch || (n.fetch = k, n.Headers = f, n.Request = $, n.Response = F), e.Headers = f, e.Request = $, e.Response = F, e.fetch = k, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : gt);
})();
const Up = "https://browser.blockstack.org/auth", Op = {
  "@type": "Person",
  "@context": "http://schema.org"
}, wf = ["store_write"], kp = "blockstack-session", Cp = {
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
class Pp extends Vn {
  constructor(e, n = "") {
    super({ code: ln.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Ga extends Vn {
  constructor(e = "") {
    super({ code: ln.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Fr extends Vn {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: ln.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Va extends Vn {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: ln.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Oo extends Vn {
  constructor(e) {
    super({ code: ln.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class yf extends Vn {
  constructor(e) {
    super({ code: ln.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Ka = ["debug", "info", "warn", "error", "none"], ko = {};
for (let t = 0; t < Ka.length; t++) {
  const e = Ka[t];
  ko[e] = t;
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
    return ko[Cp.logLevel] <= ko[e];
  }
}
function Np() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Dp() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function ao(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function Tp() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Fp() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Mp(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function Ai(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Fp(), s) {
      const o = s[t];
      if (o)
        return o;
    }
  } catch (o) {
    $n.error(`Error getting object '${t}' from global scope '${s}': ${o}`);
  }
  if (e) {
    const o = Mp(s, t.toString(), n);
    throw $n.error(o), new Error(o);
  }
  if (r)
    return {};
}
function Rp(t) {
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
  if (qp(t, Uint8Array))
    return BigInt(`0x${Ut(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Gp(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function vi(t, e = 8) {
  return (typeof t == "bigint" ? t : Rp(t)).toString(16).padStart(e * 2, "0");
}
function mf(t, e = 16) {
  const n = vi(t, e);
  return $t(n);
}
function Vp(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const Kp = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ut(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Kp[n];
  return e;
}
function $t(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Gp(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    e[n] = o;
  }
  return e;
}
function gr(t) {
  return new TextEncoder().encode(t);
}
function Sf(t) {
  return new TextDecoder().decode(t);
}
function zp(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function jp(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function za(t) {
  if (t.some(jp))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
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
function Kn(t) {
  return ce(...t.map((e) => typeof e == "number" ? za([e]) : e instanceof Array ? za(e) : e));
}
function qp(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const Wp = "https://api.mainnet.hiro.so", Xp = "https://api.testnet.hiro.so", Yp = "http://localhost:3999", Jp = "https://hub.blockstack.org";
function Zp(t) {
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
const Qp = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function tb(t, e) {
  const n = {};
  return Object.assign(n, Qp, e), await fetch(t, n);
}
function eb(t) {
  let e = tb, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function nb(...t) {
  const { fetchLib: e, middlewares: n } = eb(t);
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
class Ef {
  constructor(e = wf.slice(), n = ((a) => (a = Ai("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", o = void 0, i = Up) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = o, this.authenticatorURL = i;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Co(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function rb(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Af(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function sb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Co(t.outputLen), Co(t.blockLen);
}
function ob(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function ib(t, e) {
  Af(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ze = {
  number: Co,
  bool: rb,
  bytes: Af,
  hash: sb,
  exists: ob,
  output: ib
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const co = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Gt = (t, e) => t << 32 - e | t >>> e, ab = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!ab)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function cb(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Bi(t) {
  if (typeof t == "string" && (t = cb(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let vf = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function fn(t) {
  const e = (r) => t().update(Bi(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Bf = class extends vf {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ze.hash(e);
    const r = Bi(n);
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
const Ls = (t, e, n) => new Bf(t, e).update(n).digest();
Ls.create = (t, e) => new Bf(t, e);
function lb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, h = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + h, a, r);
}
let $i = class extends vf {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = co(this.buffer);
  }
  update(e) {
    Ze.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Bi(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = co(e);
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
    lb(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = co(e), c = this.outputLen;
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
const fb = (t, e, n) => t & e ^ ~t & n, hb = (t, e, n) => t & e ^ t & n ^ e & n, ub = new Uint32Array([
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
]), we = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ye = new Uint32Array(64);
let $f = class extends $i {
  constructor() {
    super(64, 32, 8, !1), this.A = we[0] | 0, this.B = we[1] | 0, this.C = we[2] | 0, this.D = we[3] | 0, this.E = we[4] | 0, this.F = we[5] | 0, this.G = we[6] | 0, this.H = we[7] | 0;
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
      ye[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = ye[l - 15], d = ye[l - 2], x = Gt(b, 7) ^ Gt(b, 18) ^ b >>> 3, w = Gt(d, 17) ^ Gt(d, 19) ^ d >>> 10;
      ye[l] = w + ye[l - 7] + x + ye[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: h, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const b = Gt(a, 6) ^ Gt(a, 11) ^ Gt(a, 25), d = f + b + fb(a, c, h) + ub[l] + ye[l] | 0, w = (Gt(r, 2) ^ Gt(r, 13) ^ Gt(r, 22)) + hb(r, s, o) | 0;
      f = h, h = c, c = a, a = i + d | 0, i = o, o = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, h = h + this.G | 0, f = f + this.H | 0, this.set(r, s, o, i, a, c, h, f);
  }
  roundClean() {
    ye.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, db = class extends $f {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Cn = fn(() => new $f());
fn(() => new db());
var xr = {};
xr.byteLength = wb;
var pb = xr.toByteArray = mb, bb = xr.fromByteArray = Ab, qt = [], It = [], gb = typeof Uint8Array < "u" ? Uint8Array : Array, lo = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var En = 0, xb = lo.length; En < xb; ++En)
  qt[En] = lo[En], It[lo.charCodeAt(En)] = En;
It[45] = 62;
It[95] = 63;
function _f(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function wb(t) {
  var e = _f(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function yb(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function mb(t) {
  var e, n = _f(t), r = n[0], s = n[1], o = new gb(yb(t, r, s)), i = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = It[t.charCodeAt(c)] << 18 | It[t.charCodeAt(c + 1)] << 12 | It[t.charCodeAt(c + 2)] << 6 | It[t.charCodeAt(c + 3)], o[i++] = e >> 16 & 255, o[i++] = e >> 8 & 255, o[i++] = e & 255;
  return s === 2 && (e = It[t.charCodeAt(c)] << 2 | It[t.charCodeAt(c + 1)] >> 4, o[i++] = e & 255), s === 1 && (e = It[t.charCodeAt(c)] << 10 | It[t.charCodeAt(c + 1)] << 4 | It[t.charCodeAt(c + 2)] >> 2, o[i++] = e >> 8 & 255, o[i++] = e & 255), o;
}
function Sb(t) {
  return qt[t >> 18 & 63] + qt[t >> 12 & 63] + qt[t >> 6 & 63] + qt[t & 63];
}
function Eb(t, e, n) {
  for (var r, s = [], o = e; o < n; o += 3)
    r = (t[o] << 16 & 16711680) + (t[o + 1] << 8 & 65280) + (t[o + 2] & 255), s.push(Sb(r));
  return s.join("");
}
function Ab(t) {
  for (var e, n = t.length, r = n % 3, s = [], o = 16383, i = 0, a = n - r; i < a; i += o)
    s.push(Eb(t, i, i + o > a ? a : i + o));
  return r === 1 ? (e = t[n - 1], s.push(
    qt[e >> 2] + qt[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    qt[e >> 10] + qt[e >> 4 & 63] + qt[e << 2 & 63] + "="
  )), s.join("");
}
function vb() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const Bb = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function $b() {
  if (vb())
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
    throw new Error(Bb);
  }
}
class _b {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const o = this.createCipher(e, n, r), i = new Uint8Array(ce(o.update(s), o.final()));
    return Promise.resolve(i);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const o = this.createDecipher(e, n, r), i = new Uint8Array(ce(o.update(s), o.final()));
    return Promise.resolve(i);
  }
}
class Hb {
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
async function Hf() {
  const t = await $b();
  return t.name === "subtleCrypto" ? new Hb(t.lib) : new _b(t.lib.createCipheriv, t.lib.createDecipheriv);
}
const Lb = of, Ib = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Ub = Lb(Ib);
const Ob = /* @__PURE__ */ bd(Ub), kb = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Lf = Uint8Array.from({ length: 16 }, (t, e) => e), Cb = Lf.map((t) => (9 * t + 5) % 16);
let _i = [Lf], Hi = [Cb];
for (let t = 0; t < 4; t++)
  for (let e of [_i, Hi])
    e.push(e[t].map((n) => kb[n]));
const If = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Pb = _i.map((t, e) => t.map((n) => If[e][n])), Nb = Hi.map((t, e) => t.map((n) => If[e][n])), Db = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Tb = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Mr = (t, e) => t << e | t >>> 32 - e;
function ja(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Rr = new Uint32Array(16);
let Fb = class extends $i {
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
      Rr[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, h = this.h3 | 0, f = h, l = this.h4 | 0, b = l;
    for (let d = 0; d < 5; d++) {
      const x = 4 - d, w = Db[d], v = Tb[d], H = _i[d], U = Hi[d], y = Pb[d], $ = Nb[d];
      for (let A = 0; A < 16; A++) {
        const P = Mr(r + ja(d, o, a, h) + Rr[H[A]] + w, y[A]) + l | 0;
        r = l, l = h, h = Mr(a, 10) | 0, a = o, o = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = Mr(s + ja(x, i, c, f) + Rr[U[A]] + v, $[A]) + b | 0;
        s = b, b = f, f = Mr(c, 10) | 0, c = i, i = P;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + h + b | 0, this.h3 + l + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Rr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Mb = fn(() => new Fb());
function Rb(t) {
  return Mb(t);
}
const Gr = BigInt(2 ** 32 - 1), Po = BigInt(32);
function Uf(t, e = !1) {
  return e ? { h: Number(t & Gr), l: Number(t >> Po & Gr) } : { h: Number(t >> Po & Gr) | 0, l: Number(t & Gr) | 0 };
}
function Gb(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = Uf(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const Vb = (t, e) => BigInt(t >>> 0) << Po | BigInt(e >>> 0), Kb = (t, e, n) => t >>> n, zb = (t, e, n) => t << 32 - n | e >>> n, jb = (t, e, n) => t >>> n | e << 32 - n, qb = (t, e, n) => t << 32 - n | e >>> n, Wb = (t, e, n) => t << 64 - n | e >>> n - 32, Xb = (t, e, n) => t >>> n - 32 | e << 64 - n, Yb = (t, e) => e, Jb = (t, e) => t, Zb = (t, e, n) => t << n | e >>> 32 - n, Qb = (t, e, n) => e << n | t >>> 32 - n, t1 = (t, e, n) => e << n - 32 | t >>> 64 - n, e1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function n1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const r1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), s1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, o1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), i1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, a1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), c1 = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, V = {
  fromBig: Uf,
  split: Gb,
  toBig: Vb,
  shrSH: Kb,
  shrSL: zb,
  rotrSH: jb,
  rotrSL: qb,
  rotrBH: Wb,
  rotrBL: Xb,
  rotr32H: Yb,
  rotr32L: Jb,
  rotlSH: Zb,
  rotlSL: Qb,
  rotlBH: t1,
  rotlBL: e1,
  add: n1,
  add3L: r1,
  add3H: s1,
  add4L: o1,
  add4H: i1,
  add5H: c1,
  add5L: a1
}, [l1, f1] = V.split([
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
].map((t) => BigInt(t))), me = new Uint32Array(80), Se = new Uint32Array(80);
let Is = class extends $i {
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
      me[y] = e.getUint32(n), Se[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const $ = me[y - 15] | 0, A = Se[y - 15] | 0, P = V.rotrSH($, A, 1) ^ V.rotrSH($, A, 8) ^ V.shrSH($, A, 7), F = V.rotrSL($, A, 1) ^ V.rotrSL($, A, 8) ^ V.shrSL($, A, 7), O = me[y - 2] | 0, k = Se[y - 2] | 0, g = V.rotrSH(O, k, 19) ^ V.rotrBH(O, k, 61) ^ V.shrSH(O, k, 6), E = V.rotrSL(O, k, 19) ^ V.rotrBL(O, k, 61) ^ V.shrSL(O, k, 6), L = V.add4L(F, E, Se[y - 7], Se[y - 16]), C = V.add4H(L, P, g, me[y - 7], me[y - 16]);
      me[y] = C | 0, Se[y] = L | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: h, Dl: f, Eh: l, El: b, Fh: d, Fl: x, Gh: w, Gl: v, Hh: H, Hl: U } = this;
    for (let y = 0; y < 80; y++) {
      const $ = V.rotrSH(l, b, 14) ^ V.rotrSH(l, b, 18) ^ V.rotrBH(l, b, 41), A = V.rotrSL(l, b, 14) ^ V.rotrSL(l, b, 18) ^ V.rotrBL(l, b, 41), P = l & d ^ ~l & w, F = b & x ^ ~b & v, O = V.add5L(U, A, F, f1[y], Se[y]), k = V.add5H(O, H, $, P, l1[y], me[y]), g = O | 0, E = V.rotrSH(r, s, 28) ^ V.rotrBH(r, s, 34) ^ V.rotrBH(r, s, 39), L = V.rotrSL(r, s, 28) ^ V.rotrBL(r, s, 34) ^ V.rotrBL(r, s, 39), C = r & o ^ r & a ^ o & a, M = s & i ^ s & c ^ i & c;
      H = w | 0, U = v | 0, w = d | 0, v = x | 0, d = l | 0, x = b | 0, { h: l, l: b } = V.add(h | 0, f | 0, k | 0, g | 0), h = a | 0, f = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const N = V.add3L(g, L, M);
      r = V.add3H(N, k, E, C), s = N | 0;
    }
    ({ h: r, l: s } = V.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = V.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = V.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h, l: f } = V.add(this.Dh | 0, this.Dl | 0, h | 0, f | 0), { h: l, l: b } = V.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h: d, l: x } = V.add(this.Fh | 0, this.Fl | 0, d | 0, x | 0), { h: w, l: v } = V.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: H, l: U } = V.add(this.Hh | 0, this.Hl | 0, H | 0, U | 0), this.set(r, s, o, i, a, c, h, f, l, b, d, x, w, v, H, U);
  }
  roundClean() {
    me.fill(0), Se.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, h1 = class extends Is {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, u1 = class extends Is {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, d1 = class extends Is {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const p1 = fn(() => new Is());
fn(() => new h1());
fn(() => new u1());
fn(() => new d1());
function Of(t) {
  return Cn(t);
}
function b1(t) {
  return p1(t);
}
const g1 = 0;
at.hmacSha256Sync = (t, ...e) => {
  const n = Ls.create(Cn, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function x1() {
  return Ut(at.randomPrivateKey());
}
function w1(t) {
  const e = Cn(Cn(t));
  return Ob.encode(ce(t, e).slice(0, t.length + 4));
}
function y1(t, e) {
  return w1(ce(new Uint8Array([t]), e.slice(0, 20)));
}
function kf(t, e = g1) {
  const n = typeof t == "string" ? $t(t) : t, r = Rb(Of(n));
  return y1(e, r);
}
function Cf(t) {
  const e = Zp(t);
  return Ut(di(e.slice(0, 32), !0));
}
at.hmacSha256Sync = (t, ...e) => {
  const n = Ls.create(Cn, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var ps;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(ps || (ps = {}));
async function m1(t, e, n) {
  return await (await Hf()).encrypt("aes-256-cbc", e, t, n);
}
async function S1(t, e, n) {
  return await (await Hf()).decrypt("aes-256-cbc", e, t, n);
}
function Pf(t, e) {
  return Ls(Cn, t, e);
}
function E1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function Nf(t) {
  const e = b1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function A1(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function v1(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: ps.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: ps.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !A1(t))
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
async function B1(t, e, n, r) {
  const s = v1(t);
  if (!s.result)
    throw s;
  const o = at.randomPrivateKey(), i = di(o, !0);
  let a = pi(o, t, !0);
  a = a.slice(1);
  const c = Nf(a), h = at.randomBytes(16), f = await m1(h, c.encryptionKey, e), l = ce(h, i, f), b = Pf(c.hmacKey, l);
  let d;
  if (!r || r === "hex")
    d = Ut(f);
  else if (r === "base64")
    d = bb(f);
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
async function Df(t, e) {
  if (!e.ephemeralPK)
    throw new Va("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = pi(t, n, !0);
  r = r.slice(1);
  const s = Nf(r), o = $t(e.iv);
  let i;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    i = $t(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    i = pb(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = ce(o, $t(n), i), c = Pf(s.hmacKey, a), h = $t(e.mac);
  if (!E1(h, c))
    throw new Va("Decryption failed: failure in MAC check");
  const f = await S1(o, s.encryptionKey, i);
  return e.wasString ? Sf(f) : f;
}
function $1(t, e) {
  const n = typeof e == "string" ? gr(e) : e, r = Cf(t), s = Of(n), o = Rl(s, t);
  return {
    signature: Ut(o),
    publicKey: r
  };
}
async function _1(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = Cf(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", o = typeof t == "string" ? gr(t) : t, i = await B1(n.publicKey, o, s, n.cipherTextEncoding);
  let a = JSON.stringify(i);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = $1(r, a), h = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(h);
  }
  return a;
}
function H1(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return Df(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var xt = {}, Pn = {}, bt = {};
Object.defineProperty(bt, "__esModule", { value: !0 });
bt.decode = bt.encode = bt.unescape = bt.escape = bt.pad = void 0;
const Tf = xr;
function Li(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
bt.pad = Li;
function Ff(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
bt.escape = Ff;
function Mf(t) {
  return Li(t).replace(/-/g, "+").replace(/_/g, "/");
}
bt.unescape = Mf;
function L1(t) {
  return Ff((0, Tf.fromByteArray)(new TextEncoder().encode(t)));
}
bt.encode = L1;
function I1(t) {
  return new TextDecoder().decode((0, Tf.toByteArray)(Li(Mf(t))));
}
bt.decode = I1;
var Us = {}, Os = {};
let Ii = class extends yi {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Wl(e);
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
    or(this), Ve(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Rf = (t, e, n) => new Ii(t, e).update(n).digest();
Rf.create = (t, e) => new Ii(t, e);
const U1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HMAC: Ii,
  hmac: Rf
}, Symbol.toStringTag, { value: "Module" })), O1 = /* @__PURE__ */ dr(U1), k1 = /* @__PURE__ */ dr(pd);
var Nn = {};
Object.defineProperty(Nn, "__esModule", { value: !0 });
Nn.joseToDer = Nn.derToJose = void 0;
const Gf = xr, Vf = bt;
function fo(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const C1 = {
  ES256: fo(256),
  ES384: fo(384),
  ES512: fo(521)
};
function Kf(t) {
  const e = C1[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const bs = 128, zf = 0, P1 = 32, N1 = 16, D1 = 2, jf = N1 | P1 | zf << 6, gs = D1 | zf << 6;
function qf(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, Gf.toByteArray)((0, Vf.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function T1(t, e) {
  const n = qf(t), r = Kf(e), s = r + 1, o = n.length;
  let i = 0;
  if (n[i++] !== jf)
    throw new Error('Could not find expected "seq"');
  let a = n[i++];
  if (a === (bs | 1) && (a = n[i++]), o - i < a)
    throw new Error(`"seq" specified length of "${a}", only "${o - i}" remaining`);
  if (n[i++] !== gs)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[i++];
  if (o - i - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${o - i - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const h = i;
  if (i += c, n[i++] !== gs)
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
  return x.set(n.subarray(l + Math.max(-d, 0), l + f), i), (0, Vf.escape)((0, Gf.fromByteArray)(x));
}
Nn.derToJose = T1;
function qa(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= bs && --r, r;
}
function F1(t, e) {
  t = qf(t);
  const n = Kf(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = qa(t, 0, n), o = qa(t, n, t.length), i = n - s, a = n - o, c = 2 + i + 1 + 1 + a, h = c < bs, f = new Uint8Array((h ? 2 : 3) + c);
  let l = 0;
  return f[l++] = jf, h ? f[l++] = c : (f[l++] = bs | 1, f[l++] = c & 255), f[l++] = gs, f[l++] = i, s < 0 ? (f[l++] = 0, f.set(t.subarray(0, n), l), l += n) : (f.set(t.subarray(s, n), l), l += n - s), f[l++] = gs, f[l++] = a, o < 0 ? (f[l++] = 0, f.set(t.subarray(n), l)) : f.set(t.subarray(n + o), l), f;
}
Nn.joseToDer = F1;
var le = {};
Object.defineProperty(le, "__esModule", { value: !0 });
le.InvalidTokenError = le.MissingParametersError = void 0;
class M1 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
le.MissingParametersError = M1;
class R1 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
le.InvalidTokenError = R1;
Object.defineProperty(Os, "__esModule", { value: !0 });
Os.SECP256K1Client = void 0;
const G1 = O1, V1 = _s, is = k1, Wa = Nn, Xa = le, Ya = pr;
is.utils.hmacSha256Sync = (t, ...e) => {
  const n = G1.hmac.create(V1.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class Wf {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Ya.bytesToHex)(is.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Xa.MissingParametersError("a signing input hash and private key are all required");
    const s = is.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Ya.bytesToHex)(s);
    if (r === "jose")
      return (0, Wa.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Wa.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Xa.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return is.verify(n, e, r, { strict: !1 });
  }
}
Os.SECP256K1Client = Wf;
Wf.algorithmName = "ES256K";
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
const K1 = /* @__PURE__ */ dr(Ol);
var z1 = gt && gt.__awaiter || function(t, e, n, r) {
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
const j1 = _s;
function Xf(t) {
  return (0, j1.sha256)(t);
}
sn.hashSha256 = Xf;
function q1(t) {
  return z1(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = K1;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Xf(t));
    }
  });
}
sn.hashSha256Async = q1;
var W1 = gt && gt.__awaiter || function(t, e, n, r) {
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
const No = bt, Ja = Us, X1 = le, Za = sn;
function Do(t, e) {
  const n = [], r = No.encode(JSON.stringify(e));
  n.push(r);
  const s = No.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function Y1(t) {
  return Do(t, { typ: "JWT", alg: "none" }) + ".";
}
Pn.createUnsecuredToken = Y1;
class J1 {
  constructor(e, n) {
    if (!(e && n))
      throw new X1.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Ja.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Ja.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), o = Do(e, s), i = (0, Za.hashSha256)(o);
    return this.createWithSignedHash(e, n, s, o, i);
  }
  signAsync(e, n = !1, r = {}) {
    return W1(this, void 0, void 0, function* () {
      const s = this.header(r), o = Do(e, s), i = yield (0, Za.hashSha256Async)(o);
      return this.createWithSignedHash(e, n, s, o, i);
    });
  }
  createWithSignedHash(e, n, r, s, o) {
    const i = this.cryptoClient.signHash(o, this.rawPrivateKey);
    return n ? {
      header: [No.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [i]
    } : [s, i].join(".");
  }
}
Pn.TokenSigner = J1;
var ks = {};
Object.defineProperty(ks, "__esModule", { value: !0 });
ks.TokenVerifier = void 0;
const Z1 = bt, Qa = Us, Q1 = le, Vr = sn;
class t2 {
  constructor(e, n) {
    if (!(e && n))
      throw new Q1.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Qa.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Qa.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, Vr.hashSha256Async)(s).then((i) => o(i));
    {
      const i = (0, Vr.hashSha256)(s);
      return o(i);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), Z1.encode(e.payload)].join(".");
    let s = !0;
    const o = (i) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(i, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Vr.hashSha256Async)(r).then((i) => o(i));
    {
      const i = (0, Vr.hashSha256)(r);
      return o(i);
    }
  }
}
ks.TokenVerifier = t2;
var Cs = {};
Object.defineProperty(Cs, "__esModule", { value: !0 });
Cs.decodeToken = void 0;
const Kr = bt;
function e2(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Kr.decode(e[0])), r = JSON.parse(Kr.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Kr.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Kr.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
Cs.decodeToken = e2;
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
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Pn, t), n(ks, t), n(Cs, t), n(le, t), n(Us, t);
})(xt);
function n2(t) {
  return `did:btc-addr:${t}`;
}
function r2(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Ga("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Ga('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function Yf(t) {
  if (t)
    return r2(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const s2 = "1.4.0";
function o2() {
  return x1();
}
function i2(t, e, n, r = wf.slice(), s, o = Np().getTime(), i = {}) {
  const a = (d) => {
    const x = Ai("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${d}=undefined])`
    });
    return x == null ? void 0 : x.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, i, {
    jti: Tp(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(o / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: s2,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), h = xt.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [h];
  const f = kf(h);
  return c.iss = n2(f), new xt.TokenSigner("ES256k", t).sign(c);
}
async function tc(t, e) {
  const n = Sf($t(e)), r = JSON.parse(n), s = await Df(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function a2(t) {
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
function c2(t) {
  const e = xt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = Yf(e.iss);
  if (n.length === 1) {
    if (kf(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function l2(t) {
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
function f2(t) {
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
function h2(t) {
  const e = [
    f2(t),
    l2(t),
    a2(t),
    c2(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const ec = "1.0.0";
class Ge {
  constructor(e) {
    this.version = ec, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== ec)
      throw new Oo(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Ge(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Jf {
  constructor(e) {
    if (e) {
      const n = new Ge(e);
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
class nc extends Jf {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Ge({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new yf("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Ge({})), !0;
  }
}
class rc extends Jf {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = kp, !localStorage.getItem(this.key)) {
      const r = new Ge({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new yf("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Ge.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Ge({})), !0;
  }
}
var ar;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(ar || (ar = {}));
var xs;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(xs || (xs = {}));
ar.Mainnet;
var oe;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(oe || (oe = {}));
var Xt;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Xt || (Xt = {}));
oe.Mainnet;
const Zf = {
  chainId: ar.Mainnet,
  transactionVersion: oe.Mainnet,
  peerNetworkId: xs.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Xt.MainnetSingleSig,
    multiSig: Xt.MainnetMultiSig
  },
  client: { baseUrl: Wp }
}, To = {
  chainId: ar.Testnet,
  transactionVersion: oe.Testnet,
  peerNetworkId: xs.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Xt.TestnetSingleSig,
    multiSig: Xt.TestnetMultiSig
  },
  client: { baseUrl: Xp }
}, as = {
  ...To,
  addressVersion: { ...To.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Yp }
}, u2 = {
  ...as,
  addressVersion: { ...as.addressVersion },
  client: { ...as.client }
};
function d2(t) {
  switch (t) {
    case "mainnet":
      return Zf;
    case "testnet":
      return To;
    case "devnet":
      return as;
    case "mocknet":
      return u2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Qf(t) {
  return typeof t == "string" ? d2(t) : t;
}
var sc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(sc || (sc = {}));
var oc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(oc || (oc = {}));
var Dt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Dt || (Dt = {}));
const ho = ["onChainOnly", "offChainOnly", "any"];
ho[0] + "", Dt.OnChainOnly, ho[1] + "", Dt.OffChainOnly, ho[2] + "", Dt.Any, Dt.OnChainOnly + "", Dt.OnChainOnly, Dt.OffChainOnly + "", Dt.OffChainOnly, Dt.Any + "", Dt.Any;
var ic;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(ic || (ic = {}));
var ac;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(ac || (ac = {}));
var cc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(cc || (cc = {}));
var se;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(se || (se = {}));
var lc;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(lc || (lc = {}));
var fc;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(fc || (fc = {}));
var hc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(hc || (hc = {}));
var uc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(uc || (uc = {}));
var dc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(dc || (dc = {}));
var pc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(pc || (pc = {}));
var bc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(bc || (bc = {}));
var gc;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(gc || (gc = {}));
var xc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(xc || (xc = {}));
function Fo(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function p2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function th(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function b2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Fo(t.outputLen), Fo(t.blockLen);
}
function g2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function x2(t, e) {
  th(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Qe = {
  number: Fo,
  bool: p2,
  bytes: th,
  hash: b2,
  exists: g2,
  output: x2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const uo = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Vt = (t, e) => t << 32 - e | t >>> e, w2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!w2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function y2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Ui(t) {
  if (typeof t == "string" && (t = y2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let eh = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function hn(t) {
  const e = (r) => t().update(Ui(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
class nh extends eh {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Qe.hash(e);
    const r = Ui(n);
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
const rh = (t, e, n) => new nh(t, e).update(n).digest();
rh.create = (t, e) => new nh(t, e);
function m2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, h = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + h, a, r);
}
let Oi = class extends eh {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = uo(this.buffer);
  }
  update(e) {
    Qe.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Ui(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = uo(e);
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
    m2(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = uo(e), c = this.outputLen;
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
const S2 = (t, e, n) => t & e ^ ~t & n, E2 = (t, e, n) => t & e ^ t & n ^ e & n, A2 = new Uint32Array([
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
]), Ee = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ae = new Uint32Array(64);
let sh = class extends Oi {
  constructor() {
    super(64, 32, 8, !1), this.A = Ee[0] | 0, this.B = Ee[1] | 0, this.C = Ee[2] | 0, this.D = Ee[3] | 0, this.E = Ee[4] | 0, this.F = Ee[5] | 0, this.G = Ee[6] | 0, this.H = Ee[7] | 0;
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
      Ae[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = Ae[l - 15], d = Ae[l - 2], x = Vt(b, 7) ^ Vt(b, 18) ^ b >>> 3, w = Vt(d, 17) ^ Vt(d, 19) ^ d >>> 10;
      Ae[l] = w + Ae[l - 7] + x + Ae[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: h, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const b = Vt(a, 6) ^ Vt(a, 11) ^ Vt(a, 25), d = f + b + S2(a, c, h) + A2[l] + Ae[l] | 0, w = (Vt(r, 2) ^ Vt(r, 13) ^ Vt(r, 22)) + E2(r, s, o) | 0;
      f = h, h = c, c = a, a = i + d | 0, i = o, o = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, h = h + this.G | 0, f = f + this.H | 0, this.set(r, s, o, i, a, c, h, f);
  }
  roundClean() {
    Ae.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, v2 = class extends sh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const oh = hn(() => new sh());
hn(() => new v2());
function B2(t, e) {
  switch (e = Qf(e ?? Zf), t) {
    case se.P2PKH:
      switch (e.transactionVersion) {
        case oe.Mainnet:
          return Xt.MainnetSingleSig;
        case oe.Testnet:
          return Xt.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case se.P2SH:
    case se.P2SHNonSequential:
    case se.P2WPKH:
    case se.P2WSH:
    case se.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case oe.Mainnet:
          return Xt.MainnetMultiSig;
        case oe.Testnet:
          return Xt.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const $2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ih = Uint8Array.from({ length: 16 }, (t, e) => e), _2 = ih.map((t) => (9 * t + 5) % 16);
let ki = [ih], Ci = [_2];
for (let t = 0; t < 4; t++)
  for (let e of [ki, Ci])
    e.push(e[t].map((n) => $2[n]));
const ah = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), H2 = ki.map((t, e) => t.map((n) => ah[e][n])), L2 = Ci.map((t, e) => t.map((n) => ah[e][n])), I2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), U2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), zr = (t, e) => t << e | t >>> 32 - e;
function wc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const jr = new Uint32Array(16);
let O2 = class extends Oi {
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
      jr[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, h = this.h3 | 0, f = h, l = this.h4 | 0, b = l;
    for (let d = 0; d < 5; d++) {
      const x = 4 - d, w = I2[d], v = U2[d], H = ki[d], U = Ci[d], y = H2[d], $ = L2[d];
      for (let A = 0; A < 16; A++) {
        const P = zr(r + wc(d, o, a, h) + jr[H[A]] + w, y[A]) + l | 0;
        r = l, l = h, h = zr(a, 10) | 0, a = o, o = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = zr(s + wc(x, i, c, f) + jr[U[A]] + v, $[A]) + b | 0;
        s = b, b = f, f = zr(c, 10) | 0, c = i, i = P;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + h + b | 0, this.h3 + l + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    jr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const k2 = hn(() => new O2()), qr = BigInt(2 ** 32 - 1), Mo = BigInt(32);
function ch(t, e = !1) {
  return e ? { h: Number(t & qr), l: Number(t >> Mo & qr) } : { h: Number(t >> Mo & qr) | 0, l: Number(t & qr) | 0 };
}
function C2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = ch(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const P2 = (t, e) => BigInt(t >>> 0) << Mo | BigInt(e >>> 0), N2 = (t, e, n) => t >>> n, D2 = (t, e, n) => t << 32 - n | e >>> n, T2 = (t, e, n) => t >>> n | e << 32 - n, F2 = (t, e, n) => t << 32 - n | e >>> n, M2 = (t, e, n) => t << 64 - n | e >>> n - 32, R2 = (t, e, n) => t >>> n - 32 | e << 64 - n, G2 = (t, e) => e, V2 = (t, e) => t, K2 = (t, e, n) => t << n | e >>> 32 - n, z2 = (t, e, n) => e << n | t >>> 32 - n, j2 = (t, e, n) => e << n - 32 | t >>> 64 - n, q2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function W2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const X2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Y2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, J2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Z2 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Q2 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), tg = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, K = {
  fromBig: ch,
  split: C2,
  toBig: P2,
  shrSH: N2,
  shrSL: D2,
  rotrSH: T2,
  rotrSL: F2,
  rotrBH: M2,
  rotrBL: R2,
  rotr32H: G2,
  rotr32L: V2,
  rotlSH: K2,
  rotlSL: z2,
  rotlBH: j2,
  rotlBL: q2,
  add: W2,
  add3L: X2,
  add3H: Y2,
  add4L: J2,
  add4H: Z2,
  add5H: tg,
  add5L: Q2
}, [eg, ng] = K.split([
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
].map((t) => BigInt(t))), ve = new Uint32Array(80), Be = new Uint32Array(80);
let Ps = class extends Oi {
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
      ve[y] = e.getUint32(n), Be[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const $ = ve[y - 15] | 0, A = Be[y - 15] | 0, P = K.rotrSH($, A, 1) ^ K.rotrSH($, A, 8) ^ K.shrSH($, A, 7), F = K.rotrSL($, A, 1) ^ K.rotrSL($, A, 8) ^ K.shrSL($, A, 7), O = ve[y - 2] | 0, k = Be[y - 2] | 0, g = K.rotrSH(O, k, 19) ^ K.rotrBH(O, k, 61) ^ K.shrSH(O, k, 6), E = K.rotrSL(O, k, 19) ^ K.rotrBL(O, k, 61) ^ K.shrSL(O, k, 6), L = K.add4L(F, E, Be[y - 7], Be[y - 16]), C = K.add4H(L, P, g, ve[y - 7], ve[y - 16]);
      ve[y] = C | 0, Be[y] = L | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: h, Dl: f, Eh: l, El: b, Fh: d, Fl: x, Gh: w, Gl: v, Hh: H, Hl: U } = this;
    for (let y = 0; y < 80; y++) {
      const $ = K.rotrSH(l, b, 14) ^ K.rotrSH(l, b, 18) ^ K.rotrBH(l, b, 41), A = K.rotrSL(l, b, 14) ^ K.rotrSL(l, b, 18) ^ K.rotrBL(l, b, 41), P = l & d ^ ~l & w, F = b & x ^ ~b & v, O = K.add5L(U, A, F, ng[y], Be[y]), k = K.add5H(O, H, $, P, eg[y], ve[y]), g = O | 0, E = K.rotrSH(r, s, 28) ^ K.rotrBH(r, s, 34) ^ K.rotrBH(r, s, 39), L = K.rotrSL(r, s, 28) ^ K.rotrBL(r, s, 34) ^ K.rotrBL(r, s, 39), C = r & o ^ r & a ^ o & a, M = s & i ^ s & c ^ i & c;
      H = w | 0, U = v | 0, w = d | 0, v = x | 0, d = l | 0, x = b | 0, { h: l, l: b } = K.add(h | 0, f | 0, k | 0, g | 0), h = a | 0, f = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const N = K.add3L(g, L, M);
      r = K.add3H(N, k, E, C), s = N | 0;
    }
    ({ h: r, l: s } = K.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = K.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = K.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h, l: f } = K.add(this.Dh | 0, this.Dl | 0, h | 0, f | 0), { h: l, l: b } = K.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h: d, l: x } = K.add(this.Fh | 0, this.Fl | 0, d | 0, x | 0), { h: w, l: v } = K.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: H, l: U } = K.add(this.Hh | 0, this.Hl | 0, H | 0, U | 0), this.set(r, s, o, i, a, c, h, f, l, b, d, x, w, v, H, U);
  }
  roundClean() {
    ve.fill(0), Be.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, rg = class extends Ps {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, sg = class extends Ps {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, og = class extends Ps {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
hn(() => new Ps());
hn(() => new rg());
hn(() => new sg());
hn(() => new og());
var Ro;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Ro || (Ro = {}));
function ig(t, e) {
  return { type: Ro.Address, version: t, hash160: e };
}
function ag(t) {
  return Rn.c32address(t.version, t.hash160);
}
const cg = (t) => k2(oh(t)), lg = (t) => Ut(cg(t));
at.hmacSha256Sync = (t, ...e) => {
  const n = rh.create(oh, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function fg(t, e = "mainnet") {
  e = Qf(e), t = typeof t == "string" ? $t(t) : t;
  const n = B2(se.P2PKH, e), r = ig(n, lg(t));
  return ag(r);
}
function hg(t, e) {
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
  const s = r.issuer.publicKey, o = fg(s);
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
function ug(t, e = null) {
  let n;
  e ? n = hg(t, e) : n = xt.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const yc = "_blockstackDidCheckEchoReply", dg = "echoReply", pg = "authContinuation";
function bg(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, o] = r.split("=");
    return n[s] = o ? decodeURIComponent(o.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function gg() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[yc];
  if (typeof e == "boolean")
    return e;
  const n = bg(t.location.search), r = n[dg];
  if (r) {
    t[yc] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const o = n[pg];
      t.location.href = o;
    }, 10), !0;
  }
  return !1;
}
class Go {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new Ef();
    else
      throw new Pp("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new rc(e.sessionOptions) : this.store = new rc() : e ? this.store = new nc(e.sessionOptions) : this.store = new nc();
  }
  makeAuthRequestToken(e, n, r, s, o, i = Dp().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new Oo("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, o = o || c.appDomain, i2(e, n, r, s, o, i, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = o2();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = Ai("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (gg())
        return $n.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      $n.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = nb()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Fr("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const o = xt.decodeToken(e).payload;
    if (typeof o == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await h2(e))
      throw new Fr("Invalid authentication response.");
    let a = o.private_key, c = o.core_token;
    if (ao(o.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (o.private_key !== void 0 && o.private_key !== null)
          try {
            a = await tc(s, o.private_key);
          } catch {
            if ($n.warn("Failed decryption of appPrivateKey, will try to use as given"), !at.isValidPrivateKey(o.private_key))
              throw new Fr("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await tc(s, c);
          } catch {
            $n.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Fr("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let h = Jp, f;
    ao(o.version, "1.2.0") && o.hubUrl !== null && o.hubUrl !== void 0 && (h = o.hubUrl), ao(o.version, "1.3.0") && o.associationToken !== null && o.associationToken !== void 0 && (f = o.associationToken);
    const l = {
      profile: o.profile,
      email: o.email,
      decentralizedID: o.iss,
      identityAddress: Yf(o.iss),
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
        l.profile = Object.assign({}, Op);
      else {
        const x = await d.text(), w = JSON.parse(x);
        l.profile = ug(w[0].token);
      }
    } else
      l.profile = o.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new Oo("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), _1(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), H1(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
Go.prototype.makeAuthRequest = Go.prototype.makeAuthRequestToken;
const xg = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), lh = "STX_PROVIDER", fh = () => typeof window > "u" ? null : window.localStorage.getItem(lh), wg = (t) => {
  typeof window < "u" && window.localStorage.setItem(lh, t);
}, yg = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function mg(t, e) {
  const n = {};
  return Object.assign(n, yg, e), await fetch(t, n);
}
function Sg(t) {
  let e = mg, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Eg(...t) {
  const { fetchLib: e, middlewares: n } = Sg(t);
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
var mc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(mc || (mc = {}));
const Ag = "https://api.mainnet.hiro.so", vg = "https://api.testnet.hiro.so", Bg = "http://localhost:3999", $g = ["mainnet", "testnet", "devnet", "mocknet"];
class an {
  constructor(e) {
    this.version = on.Mainnet, this.chainId = Dn.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === on.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Eg();
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
      return new Vo();
    case "testnet":
      return new Ko();
    case "devnet":
      return new _g();
    case "mocknet":
      return new hh();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${$g.join(", ")}`);
  }
};
an.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : an.fromName(t);
class Vo extends an {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ag,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = on.Mainnet, this.chainId = Dn.Mainnet;
  }
}
class Ko extends an {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? vg,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = on.Testnet, this.chainId = Dn.Testnet;
  }
}
class hh extends an {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Bg,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = on.Testnet, this.chainId = Dn.Testnet;
  }
}
const _g = hh;
var zo;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(zo || (zo = {}));
var Sc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Sc || (Sc = {}));
zo.Mainnet;
var ws;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ws || (ws = {}));
var Ec;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ec || (Ec = {}));
ws.Mainnet;
const Hg = 128, Lg = 128, uh = 16;
var Ac;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ac || (Ac = {}));
var vc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(vc || (vc = {}));
var Tt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Tt || (Tt = {}));
const po = ["onChainOnly", "offChainOnly", "any"];
po[0] + "", Tt.OnChainOnly, po[1] + "", Tt.OffChainOnly, po[2] + "", Tt.Any, Tt.OnChainOnly + "", Tt.OnChainOnly, Tt.OffChainOnly + "", Tt.OffChainOnly, Tt.Any + "", Tt.Any;
var Bc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Bc || (Bc = {}));
var $c;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})($c || ($c = {}));
var _c;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(_c || (_c = {}));
var Hc;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Hc || (Hc = {}));
var Lc;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Lc || (Lc = {}));
var Ic;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ic || (Ic = {}));
var Uc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Uc || (Uc = {}));
var Oc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Oc || (Oc = {}));
var kc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(kc || (kc = {}));
var Cc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Cc || (Cc = {}));
var Pc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Pc || (Pc = {}));
var Nc;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Nc || (Nc = {}));
var Dc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Dc || (Dc = {}));
let Ig = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Ug = class extends Ig {
  constructor(e) {
    super(e);
  }
};
function jo(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Og(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function dh(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function kg(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  jo(t.outputLen), jo(t.blockLen);
}
function Cg(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Pg(t, e) {
  dh(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const bo = {
  number: jo,
  bool: Og,
  bytes: dh,
  hash: kg,
  exists: Cg,
  output: Pg
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const go = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Kt = (t, e) => t << 32 - e | t >>> e, Ng = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Ng)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Dg(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function ph(t) {
  if (typeof t == "string" && (t = Dg(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Tg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function un(t) {
  const e = (r) => t().update(ph(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Fg(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, h = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + h, a, r);
}
let Pi = class extends Tg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = go(this.buffer);
  }
  update(e) {
    bo.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = ph(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = go(e);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    bo.exists(this), bo.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let l = i; l < s; l++)
      n[l] = 0;
    Fg(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = go(e), c = this.outputLen;
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
const Mg = (t, e, n) => t & e ^ ~t & n, Rg = (t, e, n) => t & e ^ t & n ^ e & n, Gg = new Uint32Array([
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
]), $e = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), _e = new Uint32Array(64);
let bh = class extends Pi {
  constructor() {
    super(64, 32, 8, !1), this.A = $e[0] | 0, this.B = $e[1] | 0, this.C = $e[2] | 0, this.D = $e[3] | 0, this.E = $e[4] | 0, this.F = $e[5] | 0, this.G = $e[6] | 0, this.H = $e[7] | 0;
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
      _e[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = _e[l - 15], d = _e[l - 2], x = Kt(b, 7) ^ Kt(b, 18) ^ b >>> 3, w = Kt(d, 17) ^ Kt(d, 19) ^ d >>> 10;
      _e[l] = w + _e[l - 7] + x + _e[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: h, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const b = Kt(a, 6) ^ Kt(a, 11) ^ Kt(a, 25), d = f + b + Mg(a, c, h) + Gg[l] + _e[l] | 0, w = (Kt(r, 2) ^ Kt(r, 13) ^ Kt(r, 22)) + Rg(r, s, o) | 0;
      f = h, h = c, c = a, a = i + d | 0, i = o, o = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, h = h + this.G | 0, f = f + this.H | 0, this.set(r, s, o, i, a, c, h, f);
  }
  roundClean() {
    _e.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Vg = class extends bh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
un(() => new bh());
un(() => new Vg());
const Kg = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), gh = Uint8Array.from({ length: 16 }, (t, e) => e), zg = gh.map((t) => (9 * t + 5) % 16);
let Ni = [gh], Di = [zg];
for (let t = 0; t < 4; t++)
  for (let e of [Ni, Di])
    e.push(e[t].map((n) => Kg[n]));
const xh = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), jg = Ni.map((t, e) => t.map((n) => xh[e][n])), qg = Di.map((t, e) => t.map((n) => xh[e][n])), Wg = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Xg = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Wr = (t, e) => t << e | t >>> 32 - e;
function Tc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Xr = new Uint32Array(16);
let Yg = class extends Pi {
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
      Xr[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, h = this.h3 | 0, f = h, l = this.h4 | 0, b = l;
    for (let d = 0; d < 5; d++) {
      const x = 4 - d, w = Wg[d], v = Xg[d], H = Ni[d], U = Di[d], y = jg[d], $ = qg[d];
      for (let A = 0; A < 16; A++) {
        const P = Wr(r + Tc(d, o, a, h) + Xr[H[A]] + w, y[A]) + l | 0;
        r = l, l = h, h = Wr(a, 10) | 0, a = o, o = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = Wr(s + Tc(x, i, c, f) + Xr[U[A]] + v, $[A]) + b | 0;
        s = b, b = f, f = Wr(c, 10) | 0, c = i, i = P;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + h + b | 0, this.h3 + l + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Xr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
un(() => new Yg());
const Yr = BigInt(2 ** 32 - 1), qo = BigInt(32);
function wh(t, e = !1) {
  return e ? { h: Number(t & Yr), l: Number(t >> qo & Yr) } : { h: Number(t >> qo & Yr) | 0, l: Number(t & Yr) | 0 };
}
function Jg(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = wh(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const Zg = (t, e) => BigInt(t >>> 0) << qo | BigInt(e >>> 0), Qg = (t, e, n) => t >>> n, tx = (t, e, n) => t << 32 - n | e >>> n, ex = (t, e, n) => t >>> n | e << 32 - n, nx = (t, e, n) => t << 32 - n | e >>> n, rx = (t, e, n) => t << 64 - n | e >>> n - 32, sx = (t, e, n) => t >>> n - 32 | e << 64 - n, ox = (t, e) => e, ix = (t, e) => t, ax = (t, e, n) => t << n | e >>> 32 - n, cx = (t, e, n) => e << n | t >>> 32 - n, lx = (t, e, n) => e << n - 32 | t >>> 64 - n, fx = (t, e, n) => t << n - 32 | e >>> 64 - n;
function hx(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const ux = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), dx = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, px = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), bx = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, gx = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), xx = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, z = {
  fromBig: wh,
  split: Jg,
  toBig: Zg,
  shrSH: Qg,
  shrSL: tx,
  rotrSH: ex,
  rotrSL: nx,
  rotrBH: rx,
  rotrBL: sx,
  rotr32H: ox,
  rotr32L: ix,
  rotlSH: ax,
  rotlSL: cx,
  rotlBH: lx,
  rotlBL: fx,
  add: hx,
  add3L: ux,
  add3H: dx,
  add4L: px,
  add4H: bx,
  add5H: xx,
  add5L: gx
}, [wx, yx] = z.split([
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
].map((t) => BigInt(t))), He = new Uint32Array(80), Le = new Uint32Array(80);
let Ns = class extends Pi {
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
      He[y] = e.getUint32(n), Le[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const $ = He[y - 15] | 0, A = Le[y - 15] | 0, P = z.rotrSH($, A, 1) ^ z.rotrSH($, A, 8) ^ z.shrSH($, A, 7), F = z.rotrSL($, A, 1) ^ z.rotrSL($, A, 8) ^ z.shrSL($, A, 7), O = He[y - 2] | 0, k = Le[y - 2] | 0, g = z.rotrSH(O, k, 19) ^ z.rotrBH(O, k, 61) ^ z.shrSH(O, k, 6), E = z.rotrSL(O, k, 19) ^ z.rotrBL(O, k, 61) ^ z.shrSL(O, k, 6), L = z.add4L(F, E, Le[y - 7], Le[y - 16]), C = z.add4H(L, P, g, He[y - 7], He[y - 16]);
      He[y] = C | 0, Le[y] = L | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: h, Dl: f, Eh: l, El: b, Fh: d, Fl: x, Gh: w, Gl: v, Hh: H, Hl: U } = this;
    for (let y = 0; y < 80; y++) {
      const $ = z.rotrSH(l, b, 14) ^ z.rotrSH(l, b, 18) ^ z.rotrBH(l, b, 41), A = z.rotrSL(l, b, 14) ^ z.rotrSL(l, b, 18) ^ z.rotrBL(l, b, 41), P = l & d ^ ~l & w, F = b & x ^ ~b & v, O = z.add5L(U, A, F, yx[y], Le[y]), k = z.add5H(O, H, $, P, wx[y], He[y]), g = O | 0, E = z.rotrSH(r, s, 28) ^ z.rotrBH(r, s, 34) ^ z.rotrBH(r, s, 39), L = z.rotrSL(r, s, 28) ^ z.rotrBL(r, s, 34) ^ z.rotrBL(r, s, 39), C = r & o ^ r & a ^ o & a, M = s & i ^ s & c ^ i & c;
      H = w | 0, U = v | 0, w = d | 0, v = x | 0, d = l | 0, x = b | 0, { h: l, l: b } = z.add(h | 0, f | 0, k | 0, g | 0), h = a | 0, f = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const N = z.add3L(g, L, M);
      r = z.add3H(N, k, E, C), s = N | 0;
    }
    ({ h: r, l: s } = z.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = z.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = z.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h, l: f } = z.add(this.Dh | 0, this.Dl | 0, h | 0, f | 0), { h: l, l: b } = z.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h: d, l: x } = z.add(this.Fh | 0, this.Fl | 0, d | 0, x | 0), { h: w, l: v } = z.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: H, l: U } = z.add(this.Hh | 0, this.Hl | 0, H | 0, U | 0), this.set(r, s, o, i, a, c, h, f, l, b, d, x, w, v, H, U);
  }
  roundClean() {
    He.fill(0), Le.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, mx = class extends Ns {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Sx = class extends Ns {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Ex = class extends Ns {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
un(() => new Ns());
un(() => new mx());
un(() => new Sx());
un(() => new Ex());
var lt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(lt || (lt = {}));
var Wo;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Wo || (Wo = {}));
function Ti(t) {
  return Wo[t];
}
var ys;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ys || (ys = {}));
function yh(t, e, n) {
  const s = Hg;
  if (Px(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ys.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
function mh(t) {
  const e = Rn.c32addressDecode(t);
  return {
    type: ys.Address,
    version: e[0],
    hash160: e[1]
  };
}
function Sh(t) {
  const e = [];
  return e.push($t(vi(t.version, 1))), e.push($t(t.hash160)), Kn(e);
}
function Eh(t) {
  const e = [], n = gr(t.content), r = n.byteLength;
  return e.push($t(vi(r, t.lengthPrefixBytes))), e.push(n), Kn(e);
}
function Zt(t, e) {
  return Kn([Ti(t), e]);
}
function Ax(t) {
  return new Uint8Array([Ti(t.type)]);
}
function vx(t) {
  return t.type === lt.OptionalNone ? new Uint8Array([Ti(t.type)]) : Zt(t.type, wr(t.value));
}
function Bx(t) {
  const e = new Uint8Array(4);
  return Hs(e, Math.ceil(t.value.length / 2), 0), Zt(t.type, ce(e, $t(t.value)));
}
function $x(t) {
  const e = mf(Vp(BigInt(t.value), BigInt(Lg)), uh);
  return Zt(t.type, e);
}
function _x(t) {
  const e = mf(BigInt(t.value), uh);
  return Zt(t.type, e);
}
function Hx(t) {
  return Zt(t.type, Sh(mh(t.value)));
}
function Lx(t) {
  const [e, n] = Nx(t.value);
  return Zt(t.type, ce(Sh(mh(e)), Eh(yh(n))));
}
function Ix(t) {
  return Zt(t.type, wr(t.value));
}
function Ux(t) {
  const e = [], n = new Uint8Array(4);
  Hs(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = wr(r);
    e.push(s);
  }
  return Zt(t.type, Kn(e));
}
function Ox(t) {
  const e = [], n = new Uint8Array(4);
  Hs(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = yh(s);
    e.push(Eh(o));
    const i = wr(t.value[s]);
    e.push(i);
  }
  return Zt(t.type, Kn(e));
}
function Ah(t, e) {
  const n = [], r = e == "ascii" ? zp(t.value) : gr(t.value), s = new Uint8Array(4);
  return Hs(s, r.length, 0), n.push(s), n.push(r), Zt(t.type, Kn(n));
}
function kx(t) {
  return Ah(t, "ascii");
}
function Cx(t) {
  return Ah(t, "utf8");
}
function Fc(t) {
  return Ut(wr(t));
}
function wr(t) {
  switch (t.type) {
    case lt.BoolTrue:
    case lt.BoolFalse:
      return Ax(t);
    case lt.OptionalNone:
    case lt.OptionalSome:
      return vx(t);
    case lt.Buffer:
      return Bx(t);
    case lt.UInt:
      return _x(t);
    case lt.Int:
      return $x(t);
    case lt.PrincipalStandard:
      return Hx(t);
    case lt.PrincipalContract:
      return Lx(t);
    case lt.ResponseOk:
    case lt.ResponseErr:
      return Ix(t);
    case lt.List:
      return Ux(t);
    case lt.Tuple:
      return Ox(t);
    case lt.StringASCII:
      return kx(t);
    case lt.StringUTF8:
      return Cx(t);
    default:
      throw new Ug("Unable to serialize. Invalid Clarity Value.");
  }
}
const Px = (t, e) => t ? gr(t).length > e : !1;
function Nx(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
function Dx(t, e) {
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
    return BigInt(`0x${Mx(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Fi(t, e = 8) {
  return (typeof t == "bigint" ? t : Dx(t)).toString(16).padStart(e * 2, "0");
}
function vh(t, e = 16) {
  const n = Fi(t, e);
  return cr(n);
}
function Tx(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const Fx = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Mx(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Fx[n];
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
function Mi(t) {
  return new TextEncoder().encode(t);
}
function Rx(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Gx(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Mc(t) {
  if (t.some(Gx))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Ri(...t) {
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
  return Ri(...t.map((e) => typeof e == "number" ? Mc([e]) : e instanceof Array ? Mc(e) : e));
}
function Ds(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Xo;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Xo || (Xo = {}));
Xo.Mainnet;
const Vx = 128, Kx = 128, Bh = 16;
var Yo;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Yo || (Yo = {}));
var Rc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Rc || (Rc = {}));
var Gc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Gc || (Gc = {}));
var Ft;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ft || (Ft = {}));
const xo = ["onChainOnly", "offChainOnly", "any"];
xo[0] + "", Ft.OnChainOnly, xo[1] + "", Ft.OffChainOnly, xo[2] + "", Ft.Any, Ft.OnChainOnly + "", Ft.OnChainOnly, Ft.OffChainOnly + "", Ft.OffChainOnly, Ft.Any + "", Ft.Any;
var Jo;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Jo || (Jo = {}));
Jo.Mainnet;
var Vc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Vc || (Vc = {}));
var Kc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Kc || (Kc = {}));
var zc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(zc || (zc = {}));
var jc;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(jc || (jc = {}));
var qc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(qc || (qc = {}));
var Wc;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Wc || (Wc = {}));
var Xc;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Xc || (Xc = {}));
var Yc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Yc || (Yc = {}));
var Jc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Jc || (Jc = {}));
var Zc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Zc || (Zc = {}));
var Qc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Qc || (Qc = {}));
function Zo(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function zx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function $h(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function jx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Zo(t.outputLen), Zo(t.blockLen);
}
function qx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Wx(t, e) {
  $h(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const wo = {
  number: Zo,
  bool: zx,
  bytes: $h,
  hash: jx,
  exists: qx,
  output: Wx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const yo = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), zt = (t, e) => t << 32 - e | t >>> e, Xx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Xx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Yx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function _h(t) {
  if (typeof t == "string" && (t = Yx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Jx {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function dn(t) {
  const e = (r) => t().update(_h(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Zx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, h = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + h, a, r);
}
class Gi extends Jx {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = yo(this.buffer);
  }
  update(e) {
    wo.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = _h(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = yo(e);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    wo.exists(this), wo.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let l = i; l < s; l++)
      n[l] = 0;
    Zx(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = yo(e), c = this.outputLen;
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
const Qx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Hh = Uint8Array.from({ length: 16 }, (t, e) => e), tw = Hh.map((t) => (9 * t + 5) % 16);
let Vi = [Hh], Ki = [tw];
for (let t = 0; t < 4; t++)
  for (let e of [Vi, Ki])
    e.push(e[t].map((n) => Qx[n]));
const Lh = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), ew = Vi.map((t, e) => t.map((n) => Lh[e][n])), nw = Ki.map((t, e) => t.map((n) => Lh[e][n])), rw = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), sw = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Jr = (t, e) => t << e | t >>> 32 - e;
function tl(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Zr = new Uint32Array(16);
class ow extends Gi {
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
      Zr[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, h = this.h3 | 0, f = h, l = this.h4 | 0, b = l;
    for (let d = 0; d < 5; d++) {
      const x = 4 - d, w = rw[d], v = sw[d], H = Vi[d], U = Ki[d], y = ew[d], $ = nw[d];
      for (let A = 0; A < 16; A++) {
        const P = Jr(r + tl(d, o, a, h) + Zr[H[A]] + w, y[A]) + l | 0;
        r = l, l = h, h = Jr(a, 10) | 0, a = o, o = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = Jr(s + tl(x, i, c, f) + Zr[U[A]] + v, $[A]) + b | 0;
        s = b, b = f, f = Jr(c, 10) | 0, c = i, i = P;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + h + b | 0, this.h3 + l + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Zr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
dn(() => new ow());
const iw = (t, e, n) => t & e ^ ~t & n, aw = (t, e, n) => t & e ^ t & n ^ e & n, cw = new Uint32Array([
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
]), Ie = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ue = new Uint32Array(64);
class Ih extends Gi {
  constructor() {
    super(64, 32, 8, !1), this.A = Ie[0] | 0, this.B = Ie[1] | 0, this.C = Ie[2] | 0, this.D = Ie[3] | 0, this.E = Ie[4] | 0, this.F = Ie[5] | 0, this.G = Ie[6] | 0, this.H = Ie[7] | 0;
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
      Ue[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = Ue[l - 15], d = Ue[l - 2], x = zt(b, 7) ^ zt(b, 18) ^ b >>> 3, w = zt(d, 17) ^ zt(d, 19) ^ d >>> 10;
      Ue[l] = w + Ue[l - 7] + x + Ue[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: h, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const b = zt(a, 6) ^ zt(a, 11) ^ zt(a, 25), d = f + b + iw(a, c, h) + cw[l] + Ue[l] | 0, w = (zt(r, 2) ^ zt(r, 13) ^ zt(r, 22)) + aw(r, s, o) | 0;
      f = h, h = c, c = a, a = i + d | 0, i = o, o = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, h = h + this.G | 0, f = f + this.H | 0, this.set(r, s, o, i, a, c, h, f);
  }
  roundClean() {
    Ue.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class lw extends Ih {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
dn(() => new Ih());
dn(() => new lw());
const Qr = BigInt(2 ** 32 - 1), Qo = BigInt(32);
function Uh(t, e = !1) {
  return e ? { h: Number(t & Qr), l: Number(t >> Qo & Qr) } : { h: Number(t >> Qo & Qr) | 0, l: Number(t & Qr) | 0 };
}
function fw(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = Uh(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const hw = (t, e) => BigInt(t >>> 0) << Qo | BigInt(e >>> 0), uw = (t, e, n) => t >>> n, dw = (t, e, n) => t << 32 - n | e >>> n, pw = (t, e, n) => t >>> n | e << 32 - n, bw = (t, e, n) => t << 32 - n | e >>> n, gw = (t, e, n) => t << 64 - n | e >>> n - 32, xw = (t, e, n) => t >>> n - 32 | e << 64 - n, ww = (t, e) => e, yw = (t, e) => t, mw = (t, e, n) => t << n | e >>> 32 - n, Sw = (t, e, n) => e << n | t >>> 32 - n, Ew = (t, e, n) => e << n - 32 | t >>> 64 - n, Aw = (t, e, n) => t << n - 32 | e >>> 64 - n;
function vw(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Bw = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), $w = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, _w = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Hw = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Lw = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Iw = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, j = {
  fromBig: Uh,
  split: fw,
  toBig: hw,
  shrSH: uw,
  shrSL: dw,
  rotrSH: pw,
  rotrSL: bw,
  rotrBH: gw,
  rotrBL: xw,
  rotr32H: ww,
  rotr32L: yw,
  rotlSH: mw,
  rotlSL: Sw,
  rotlBH: Ew,
  rotlBL: Aw,
  add: vw,
  add3L: Bw,
  add3H: $w,
  add4L: _w,
  add4H: Hw,
  add5H: Iw,
  add5L: Lw
}, [Uw, Ow] = j.split([
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
].map((t) => BigInt(t))), Oe = new Uint32Array(80), ke = new Uint32Array(80);
class Ts extends Gi {
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
      Oe[y] = e.getUint32(n), ke[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const $ = Oe[y - 15] | 0, A = ke[y - 15] | 0, P = j.rotrSH($, A, 1) ^ j.rotrSH($, A, 8) ^ j.shrSH($, A, 7), F = j.rotrSL($, A, 1) ^ j.rotrSL($, A, 8) ^ j.shrSL($, A, 7), O = Oe[y - 2] | 0, k = ke[y - 2] | 0, g = j.rotrSH(O, k, 19) ^ j.rotrBH(O, k, 61) ^ j.shrSH(O, k, 6), E = j.rotrSL(O, k, 19) ^ j.rotrBL(O, k, 61) ^ j.shrSL(O, k, 6), L = j.add4L(F, E, ke[y - 7], ke[y - 16]), C = j.add4H(L, P, g, Oe[y - 7], Oe[y - 16]);
      Oe[y] = C | 0, ke[y] = L | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: h, Dl: f, Eh: l, El: b, Fh: d, Fl: x, Gh: w, Gl: v, Hh: H, Hl: U } = this;
    for (let y = 0; y < 80; y++) {
      const $ = j.rotrSH(l, b, 14) ^ j.rotrSH(l, b, 18) ^ j.rotrBH(l, b, 41), A = j.rotrSL(l, b, 14) ^ j.rotrSL(l, b, 18) ^ j.rotrBL(l, b, 41), P = l & d ^ ~l & w, F = b & x ^ ~b & v, O = j.add5L(U, A, F, Ow[y], ke[y]), k = j.add5H(O, H, $, P, Uw[y], Oe[y]), g = O | 0, E = j.rotrSH(r, s, 28) ^ j.rotrBH(r, s, 34) ^ j.rotrBH(r, s, 39), L = j.rotrSL(r, s, 28) ^ j.rotrBL(r, s, 34) ^ j.rotrBL(r, s, 39), C = r & o ^ r & a ^ o & a, M = s & i ^ s & c ^ i & c;
      H = w | 0, U = v | 0, w = d | 0, v = x | 0, d = l | 0, x = b | 0, { h: l, l: b } = j.add(h | 0, f | 0, k | 0, g | 0), h = a | 0, f = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const N = j.add3L(g, L, M);
      r = j.add3H(N, k, E, C), s = N | 0;
    }
    ({ h: r, l: s } = j.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = j.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = j.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h, l: f } = j.add(this.Dh | 0, this.Dl | 0, h | 0, f | 0), { h: l, l: b } = j.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h: d, l: x } = j.add(this.Fh | 0, this.Fl | 0, d | 0, x | 0), { h: w, l: v } = j.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: H, l: U } = j.add(this.Hh | 0, this.Hl | 0, H | 0, U | 0), this.set(r, s, o, i, a, c, h, f, l, b, d, x, w, v, H, U);
  }
  roundClean() {
    Oe.fill(0), ke.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class kw extends Ts {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class Cw extends Ts {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class Pw extends Ts {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
dn(() => new Ts());
dn(() => new kw());
dn(() => new Cw());
dn(() => new Pw());
function Nw(t, e, n) {
  const s = Vx;
  if (Jw(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Yo.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var ft;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(ft || (ft = {}));
class Dw extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Tw extends Dw {
  constructor(e) {
    super(e);
  }
}
function Oh(t) {
  const e = [];
  return e.push(cr(Fi(t.version, 1))), e.push(cr(t.hash160)), zn(e);
}
function kh(t) {
  const e = [], n = Mi(t.content), r = n.byteLength;
  return e.push(cr(Fi(r, t.lengthPrefixBytes))), e.push(n), zn(e);
}
function Qt(t, e) {
  return zn([t, e]);
}
function Fw(t) {
  return new Uint8Array([t.type]);
}
function Mw(t) {
  return t.type === ft.OptionalNone ? new Uint8Array([t.type]) : Qt(t.type, Tn(t.value));
}
function Rw(t) {
  const e = new Uint8Array(4);
  return Ds(e, t.buffer.length, 0), Qt(t.type, Ri(e, t.buffer));
}
function Gw(t) {
  const e = vh(Tx(t.value, BigInt(Kx)), Bh);
  return Qt(t.type, e);
}
function Vw(t) {
  const e = vh(t.value, Bh);
  return Qt(t.type, e);
}
function Kw(t) {
  return Qt(t.type, Oh(t.address));
}
function zw(t) {
  return Qt(t.type, Ri(Oh(t.address), kh(t.contractName)));
}
function jw(t) {
  return Qt(t.type, Tn(t.value));
}
function qw(t) {
  const e = [], n = new Uint8Array(4);
  Ds(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Tn(r);
    e.push(s);
  }
  return Qt(t.type, zn(e));
}
function Ww(t) {
  const e = [], n = new Uint8Array(4);
  Ds(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = Nw(s);
    e.push(kh(o));
    const i = Tn(t.data[s]);
    e.push(i);
  }
  return Qt(t.type, zn(e));
}
function Ch(t, e) {
  const n = [], r = e == "ascii" ? Rx(t.data) : Mi(t.data), s = new Uint8Array(4);
  return Ds(s, r.length, 0), n.push(s), n.push(r), Qt(t.type, zn(n));
}
function Xw(t) {
  return Ch(t, "ascii");
}
function Yw(t) {
  return Ch(t, "utf8");
}
function Tn(t) {
  switch (t.type) {
    case ft.BoolTrue:
    case ft.BoolFalse:
      return Fw(t);
    case ft.OptionalNone:
    case ft.OptionalSome:
      return Mw(t);
    case ft.Buffer:
      return Rw(t);
    case ft.UInt:
      return Vw(t);
    case ft.Int:
      return Gw(t);
    case ft.PrincipalStandard:
      return Kw(t);
    case ft.PrincipalContract:
      return zw(t);
    case ft.ResponseOk:
    case ft.ResponseErr:
      return jw(t);
    case ft.List:
      return qw(t);
    case ft.Tuple:
      return Ww(t);
    case ft.StringASCII:
      return Xw(t);
    case ft.StringUTF8:
      return Yw(t);
    default:
      throw new Tw("Unable to serialize. Invalid Clarity Value.");
  }
}
const Jw = (t, e) => t ? Mi(t).length > e : !1;
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var Zw = Object.defineProperty, Qw = Object.defineProperties, ty = Object.getOwnPropertyDescriptors, ms = Object.getOwnPropertySymbols, Ph = Object.prototype.hasOwnProperty, Nh = Object.prototype.propertyIsEnumerable, el = (t, e, n) => e in t ? Zw(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, ti = (t, e) => {
  for (var n in e || (e = {})) Ph.call(e, n) && el(t, n, e[n]);
  if (ms) for (var n of ms(e)) Nh.call(e, n) && el(t, n, e[n]);
  return t;
}, ei = (t, e) => Qw(t, ty(e)), ey = (t, e) => {
  var n = {};
  for (var r in t) Ph.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && ms) for (var r of ms(t)) e.indexOf(r) < 0 && Nh.call(t, r) && (n[r] = t[r]);
  return n;
};
function ny(t) {
  return t ? typeof t == "string" ? an.fromName(t) : "version" in t ? t : "url" in t ? new Vo({ url: t.url }) : t.transactionVersion === ws.Mainnet ? new Vo({ url: t.client.baseUrl }) : new Ko({ url: t.client.baseUrl }) : new Ko();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var ry = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(ry || {}), sy = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(sy || {}), Dh = (t) => {
  let e = t;
  if (!e) {
    let n = new Ef(["store_write"], document.location.href);
    e = new Go({ appConfig: n });
  }
  return e;
};
function oy(t) {
  try {
    return Dh(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var iy = (t) => {
  let e = Dh(t).loadUserData().appPrivateKey, n = xt.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function Th(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? ei(ti({}, t), { message: Fc(e), domain: Fc(n) }) : ei(ti({}, t), { message: Ut(Tn(e)), domain: Ut(Tn(n)) });
}
async function ay(t, e) {
  return new xt.TokenSigner("ES256k", e).signAsync(Th(t));
}
async function cy(t) {
  let e = t, { userSession: n } = e, r = ey(e, ["userSession"]);
  if (oy(n)) {
    let { privateKey: s, publicKey: o } = iy(n), i = ei(ti({}, r), { publicKey: o });
    return ay(i, s);
  }
  return xt.createUnsecuredToken(Th(t));
}
var ly = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(ly || {}), Fh = "asigna-stx", nl = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === Fh && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(hy(t, e), "*");
}), fy = { authenticationRequest: async (t) => nl(t, "authenticationRequest"), transactionRequest: async (t) => nl(t, "transactionRequest") }, hy = (t, e) => ({ source: Fh, [e]: t }), uy = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = fy);
};
uy();
const dy = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], zi = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Fs = () => {
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
}, py = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Mh = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((o) => py(o, r)) === s
  );
}, by = (t) => t ? Mh(Fs()).some(
  (e) => {
    var n;
    return e.id === t && (zi(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, gy = () => {
  if (typeof window > "u")
    return;
  const t = Fs(), e = Mh(t).filter(
    (n) => {
      var r;
      return zi(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = rr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of dy) {
    const r = rr(t, n) ?? (t === window ? void 0 : rr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, xy = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Fs(), n = rr(e, t) ?? (e === window ? void 0 : rr(window, t)) ?? xg(t);
  if (n)
    return n;
  if (zi(t) || by(t))
    return gy();
}, wy = ["blockstack-session", "blockstack"], yy = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of wy) {
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
yy();
const my = () => fh(), Sy = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = fh(), e = t ? xy(t) : void 0;
  if (e)
    return e;
  const n = Fs() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, Ey = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), rl = (t) => xf(t).replace(/^0x/, ""), sl = "This wallet cannot sign messages. Try Xverse or Leather.", ol = (t) => typeof (t == null ? void 0 : t.request) == "function", il = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", Ay = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, vy = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function By(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: rl(e.message),
    domain: rl(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function $y(t, e) {
  const n = await cy({
    domain: e.domain,
    message: e.message,
    network: ny(e.network),
    stxAddress: e.stxAddress,
    appDetails: e.appDetails ?? Ey()
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function _y(t) {
  var s, o;
  const e = my() || "", n = /xverse/i.test(e);
  let r = Sy();
  if (n && !il(r)) {
    const i = window;
    r = ((s = i.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((o = i.xverseProviders) == null ? void 0 : o.StacksProvider);
  }
  if (il(r))
    try {
      return await $y(r, t);
    } catch (i) {
      if (n || !ol(r) || !vy(i)) throw i;
    }
  if (!n && ol(r))
    try {
      return await By(r, t);
    } catch (i) {
      throw Ay(i) ? new Error(sl) : i;
    }
  throw new Error(sl);
}
function Hy(t, e, n = {}) {
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
const Ly = {}, Iy = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, Uy = (t) => {
  const e = Ly;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, Oy = (t) => `/hiro/${t}`, ky = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, Cy = (t) => {
  const e = Uy(t);
  if (e)
    return [ky(e)];
  const n = Iy[t];
  return typeof window < "u" ? [`${window.location.origin}${Oy(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, Py = {}, al = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, Ny = "xtrata.log.enabled", Dy = "xtrata.log.level", Ty = "xtrata.log.tags", Fy = "xtrata.log.dedupe", ts = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, My = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, Ry = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, Gy = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, Vy = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, Ky = () => {
  const t = Py ?? {}, e = ts(Ny) ?? t.VITE_LOG_ENABLED, n = ts(Dy) ?? t.VITE_LOG_LEVEL, r = ts(Ty) ?? t.VITE_LOG_TAGS, s = ts(Fy) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: My(e),
    level: Ry(n) ?? "warn",
    tags: Vy(r),
    dedupe: Gy(s)
  };
}, zy = (t, e, n) => !t.enabled || al[n] < al[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), jy = (t, e, n, r) => {
  const s = Ky();
  if (!zy(s, e, t) || Wy(s.dedupe))
    return;
  const o = `[xtrata:${e}] ${n}`, i = console[t] ?? console.log;
  r !== void 0 ? i(o, r) : i(o);
}, qy = /* @__PURE__ */ new Set();
let cl = null;
const Wy = (t, e, n, r, s) => (cl !== t && (qy.clear(), cl = t), !1), Xy = (t, e, n) => jy("debug", t, e, n), Yy = {}, Jy = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, Zy = (t) => {
  const e = Yy, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : Jy[t];
}, Qy = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, t3 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return Qy.test(n) ? n : null;
}, e3 = (t) => t.replace(/\/+$/, ""), n3 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), ll = (t) => {
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
}, An = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, r3 = (t) => {
  var c, h;
  let e;
  try {
    e = vn(Lp(t));
  } catch {
    return null;
  }
  const n = An(e);
  if (!n || n.success === !1)
    return null;
  const r = An(n.value), s = An(r == null ? void 0 : r.value), o = An(s == null ? void 0 : s.value);
  if (!o)
    return null;
  const i = ll((c = An(o.name)) == null ? void 0 : c.value), a = ll((h = An(o.namespace)) == null ? void 0 : h.value);
  return !i || !a ? null : t3(`${i}.${a}`);
}, s3 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${e3(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [xf(Zd(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const o = await s.json();
  return !(o != null && o.okay) || typeof o.result != "string" ? null : r3(o.result);
}, o3 = async (t) => {
  const e = t.address.trim();
  if (!Ip(e))
    return null;
  const n = Zy(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of Cy(t.network))
    try {
      return await s3({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (o) {
      r = o;
    }
  return Xy("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: n3(r)
  }), null;
}, i3 = "ParallaX Casino", a3 = "ParallaX Casino room sign-in. This is free: it sends no transaction, costs no fees and gives no permission to spend anything.";
new TextEncoder();
new TextDecoder();
const c3 = (t) => t === "mainnet" ? 1 : 2147483648, l3 = (t) => `${a3} Account ${t.address}. Valid until ${new Date(t.expires).toISOString().replace(".000Z", "Z")}. Request code ${t.nonce}.`, f3 = (t) => ({
  domain: hf({
    name: os(i3),
    version: os("1"),
    "chain-id": ff(c3(t.network))
  }),
  message: os(l3(t))
}), es = (t) => !!t && typeof t.request == "function", ji = () => {
  try {
    const t = window.top;
    if (t && t !== window.self && t.location.origin === window.location.origin) return t;
  } catch {
  }
  return window;
}, h3 = () => {
  const t = ji();
  return t === window ? [window] : [t, window];
}, fl = (t) => {
  for (const e of h3()) {
    const n = t(e);
    if (n) return n;
  }
  return null;
}, u3 = (t) => {
  if (t === "leather") {
    const n = fl((r) => es(r.LeatherProvider) ? r.LeatherProvider : null);
    return n ? { rpc: n } : null;
  }
  const e = fl((n) => {
    const r = n.XverseProviders || n.xverseProviders;
    return r && (es(r.BitcoinProvider) || es(r.StacksProvider)) ? r : null;
  });
  return e ? { rpc: es(e.BitcoinProvider) ? e.BitcoinProvider : e.StacksProvider } : null;
}, d3 = (t, e) => new Promise((n) => {
  const r = Date.now();
  (function s() {
    const o = u3(t);
    o || Date.now() - r >= e ? n(o) : window.setTimeout(s, 150);
  })();
}), Ss = (t) => {
  var e;
  return (t == null ? void 0 : t.code) ?? ((e = t == null ? void 0 : t.error) == null ? void 0 : e.code);
}, tn = (t) => {
  var e;
  return String((t == null ? void 0 : t.message) ?? ((e = t == null ? void 0 : t.error) == null ? void 0 : e.message) ?? t ?? "unknown error");
}, p3 = (t) => [4001, -31001].includes(Number(Ss(t))) || /cancel|denied|reject|declin|closed/i.test(tn(t)), hl = (t) => Number(Ss(t)) === -32601 || /not supported|method not found|unsupported|not implemented|legacy method/i.test(tn(t)), mo = async (t, e, n) => {
  const r = n === void 0 ? await t.request(e) : await t.request(e, n);
  if (r && typeof r == "object") {
    if (r.error) throw Object.assign(new Error(tn(r.error)), { code: Ss(r.error) });
    if (r.status === "error") throw Object.assign(new Error(tn(r.error || r)), { code: Ss(r.error || r) });
    if ("result" in r) return r.result;
  }
  return r;
}, b3 = (t) => new Promise((e, n) => {
  const r = window.setTimeout(() => n(new Error("The wallet did not answer. Check its window.")), 9e4);
  t.then((s) => {
    window.clearTimeout(r), e(s);
  }, (s) => {
    window.clearTimeout(r), n(s);
  });
}), g3 = (t) => (JSON.stringify(t) || "").match(/S[PT][0-9A-HJKMNP-TV-Z]{38,39}/g) || [], Ce = [], lr = () => {
  const t = ji().ParallaxCasinoWalletUI ?? window.ParallaxCasinoWalletUI;
  try {
    return t && t.available() ? t : null;
  } catch {
    return null;
  }
}, x3 = (t) => {
  const e = ji().ParallaxPasskeyWallet ?? window.ParallaxPasskeyWallet;
  return e != null && e.signRoomJoin ? e.signRoomJoin(t) : Promise.reject(new Error("The casino wallet is not loaded. Reload the page."));
};
async function w3(t) {
  if (t === "casino") {
    const s = lr();
    if (!s) throw new Error("The casino wallet is not available here yet. Reload the page.");
    const o = await s.open();
    if (!o) throw new Error("The casino wallet did not open.");
    return { kind: t, address: o, network: o.startsWith("SP") ? "mainnet" : "testnet", via: "casino-wallet" };
  }
  const e = await d3(t, 1500);
  if (!e) throw new Error(`${t === "leather" ? "Leather" : "Xverse"} was not found in this browser.`);
  Ce.length = 0;
  let n;
  if (t === "xverse") {
    try {
      await mo(e.rpc, "wallet_disconnect"), Ce.push("wallet_disconnect: ok");
    } catch (s) {
      Ce.push("wallet_disconnect: " + tn(s).slice(0, 80));
    }
    n = ["wallet_connect", "wallet_getAccount"];
  } else
    n = ["getAddresses", "stx_getAccounts", "stx_getAddresses", "stx_requestAccounts"];
  let r = null;
  for (const s of n)
    try {
      const o = await (t === "xverse" ? b3(mo(e.rpc, s)) : mo(e.rpc, s)), i = g3(o);
      if (i.length) {
        const a = i[0];
        return Ce.push(`${s}: ok`), { kind: t, address: a, network: a.startsWith("SP") ? "mainnet" : "testnet", via: s };
      }
      Ce.push(`${s}: answered but no Stacks address in it`);
    } catch (o) {
      if (p3(o))
        throw Ce.push(`${s}: cancelled`), new Error("Connection cancelled.");
      Ce.push(`${s}: ${hl(o) ? "not supported" : tn(o).slice(0, 80)}`), hl(o) || (r = o);
    }
  throw new Error(r ? tn(r) : "The wallet did not share a Stacks address.");
}
const Rh = (t) => {
  t !== "casino" && wg(t === "leather" ? "LeatherProvider" : "XverseProviders.BitcoinProvider");
}, Es = (t) => t instanceof Error ? t.message : String(t), So = 500, Gh = 40, y3 = 2e3, fr = 280, ul = "px_room_blocks_v1", dl = "px_chat_ui_v1", Eo = "px_chat_session_v1:", pl = { hidden: !1, side: "left" }, m3 = [
  { code: "spam", label: "Spam" },
  { code: "abuse", label: "Abuse" },
  { code: "scam", label: "Scam" },
  { code: "other", label: "Something else" }
], S3 = (t) => {
  if (!Array.isArray(t)) return [];
  const e = [];
  for (const n of t)
    if (!(typeof n != "string" || !/^S[A-Z0-9]{19,60}$/.test(n) || e.includes(n)) && (e.push(n), e.length >= Gh))
      break;
  return e;
}, E3 = (t) => {
  if (!t) return [];
  try {
    return S3(JSON.parse(t));
  } catch {
    return [];
  }
}, A3 = (t) => {
  if (!t) return { ...pl };
  try {
    const e = JSON.parse(t);
    return { hidden: (e == null ? void 0 : e.hidden) === !0, side: (e == null ? void 0 : e.side) === "right" ? "right" : "left" };
  } catch {
    return { ...pl };
  }
}, Vh = {
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
}, v3 = (t) => typeof t == "string" && Object.prototype.hasOwnProperty.call(Vh, t), Qn = (t) => Vh[String(t)] ?? "The room could not take that. Try again in a moment.", B3 = (t) => t.replace(/\s+/g, " ").trim(), $3 = (t) => Array.from(t).length, _3 = (t, e) => {
  const n = B3(t);
  return e.signed ? e.connected ? n ? $3(n) > fr ? { ok: !1, code: "too-long" } : e.now - e.lastSentAt < y3 ? { ok: !1, code: "slow-down" } : { ok: !0, text: n } : { ok: !1, code: "empty" } : { ok: !1, code: "offline" } : { ok: !1, code: "sign-in-first" };
};
class H3 {
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
    return o && (a.to = o), i && (a.tb = i), this.lines.push(a), this.lines.length > So && this.lines.splice(0, this.lines.length - So), a;
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
    for (const s of n.slice(-So)) {
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
class L3 {
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
const I3 = `
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
}, Ct = (t, e, n = "sm") => {
  const r = q("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function U3(t) {
  const e = new H3(), n = new L3();
  let r = { hidden: !1, side: "left" }, s = [];
  try {
    r = A3(window.localStorage.getItem(dl)), s = E3(window.localStorage.getItem(ul));
  } catch {
  }
  e.setBlocked(s);
  let o = !1, i = null, a = !1, c = null, h = !1, f = "", l = 0, b = 0, d = 0, x = null, w = 0, v = !0, H = null;
  const U = () => {
    try {
      window.localStorage.setItem(dl, JSON.stringify(r));
    } catch {
    }
  }, y = () => {
    try {
      window.localStorage.setItem(ul, JSON.stringify(s));
    } catch {
    }
  }, $ = (S) => t.labelFor(S), A = () => {
    if (H)
      try {
        window.sessionStorage.setItem(Eo + H, e.dump());
      } catch {
      }
  }, P = (S) => {
    if (S)
      try {
        window.sessionStorage.removeItem(Eo + S);
      } catch {
      }
  }, F = (S) => {
    if (S !== H) {
      if (P(H), e.clear(), Ht.forEach((T) => T.remove()), Ht.clear(), H = S, S)
        try {
          e.load(window.sessionStorage.getItem(Eo + S));
        } catch {
        }
      v = !0;
    }
  }, O = (S) => s.includes(S), k = document.createElement("style");
  k.textContent = I3, document.head.append(k);
  const g = q("div");
  g.id = "pxchat";
  const E = q("div");
  E.id = "pxchat-lines";
  const L = q("button", "New messages ↓", "newer");
  L.type = "button", L.hidden = !0, E.setAttribute("role", "log"), E.setAttribute("aria-live", "polite"), E.setAttribute("aria-label", "Casino chat");
  const C = q("div", void 0, "panel");
  C.id = "pxchat-menu", C.hidden = !0;
  const M = q("div", void 0, "panel");
  M.id = "pxchat-panel", M.hidden = !0;
  const N = q("form");
  N.hidden = !0;
  const ht = q("button", void 0, "to");
  ht.type = "button", ht.hidden = !0;
  const et = q("input");
  et.type = "text", et.autocomplete = "off", et.enterKeyHint = "send", et.maxLength = fr * 2;
  const Ke = q("button", "Send", "sm");
  Ke.type = "submit", N.append(ht, et, Ke);
  const rt = q("div", void 0, "bar");
  rt.hidden = !0;
  const R = Ct("Here now", () => Jn("people")), yr = Ct("Hide chat", () => Ws()), jn = Ct("", () => {
    r.side = r.side === "left" ? "right" : "left", U(), Q();
  }), wt = Ct("Blocked", () => Jn("blocked")), ze = Ct("Table", () => {
    a = !a, i = null, Q(), o && et.focus();
  });
  ze.id = "pxchat-table", R.id = "pxchat-people", yr.id = "pxchat-hide", jn.id = "pxchat-side", wt.id = "pxchat-blocked", rt.append(ze, R, yr, jn, wt), g.append(E, L, C, M, N, rt);
  const St = q("button");
  St.id = "pxchat-btn", St.type = "button", St.setAttribute("aria-controls", "pxchat");
  const Ht = /* @__PURE__ */ new Map(), Gs = () => o || !!c || !!f, Vs = () => {
    var S;
    return (S = window.matchMedia) != null && S.call(window, "(max-width:700px)").matches ? 5 : 8;
  }, pn = (S) => {
    const T = q("button", $(S.a), "nm");
    return T.type = "button", T.dataset.a = S.a, T.setAttribute("aria-label", `Options for ${$(S.a)}`), T.onclick = () => Er(S), T;
  }, Ks = (S) => {
    const T = S.who ? `ln${S.mine ? " mine" : ""}${S.to ? " dm" : ""}${S.tb ? " tb" : ""}` : "ln note", X = q("div", void 0, T);
    if (!S.who)
      return X.append(q("span", S.text, "tx")), X;
    const W = [];
    return S.to ? S.mine ? W.push(q("span", "You", "nm"), q("span", "→", "tag"), pn(S.to)) : W.push(pn(S.who), q("span", "→ you", "tag")) : (S.tb && W.push(q("span", "Table", "tag")), W.push(S.mine ? q("span", "You", "nm") : pn(S.who))), W.push(q("span", S.text, "tx")), W.forEach((ct, ut) => {
      ut && X.append(document.createTextNode(" ")), X.append(ct);
    }), X;
  }, mr = () => E.scrollTop + E.clientHeight >= E.scrollHeight - 8, Sr = () => {
    E.scrollTop = E.scrollHeight, v = !0, L.hidden = !0;
  }, zs = () => {
    const S = Gs(), T = S ? e.all() : e.tail(Vs()), X = E.classList.contains("scroll");
    E.classList.toggle("scroll", S);
    const W = new Set(T.map((Et) => Et.id));
    let ct = !1;
    for (const [Et, At] of Ht) W.has(Et) || (At.remove(), Ht.delete(Et));
    let ut = null;
    for (const Et of T) {
      let At = Ht.get(Et.id);
      At || (At = Ks(Et), Ht.set(Et.id, At), ct = !0);
      const fe = ut ? ut.nextElementSibling : E.firstElementChild;
      fe !== At && E.insertBefore(At, fe), ut = At;
    }
    if (!S) {
      L.hidden = !0, v = !0;
      return;
    }
    !X || v ? Sr() : ct && (L.hidden = !1);
  }, qn = () => {
    St.replaceChildren(q("span", "💬", "ic"), q("span", "Chat", "lbl")), r.hidden && l > 0 && St.append(q("span", l > 9 ? "9+" : String(l), b ? "dot dm" : "dot")), St.setAttribute("aria-expanded", String(o && !r.hidden)), St.setAttribute("aria-label", r.hidden && l ? `Chat: ${l} new${b ? `, ${b} sent to you` : ""}` : "Casino chat: type a message");
  }, bn = () => t.table ? t.table() : null, Wn = { blackjack: "blackjack", baccarat: "baccarat", sicbo: "Sic Bo", holdem: "Hold'em", roulette: "roulette", videopoker: "video poker", pvpholdem: "Salon Hold'em", liars: "Liar's Dice" }, Xn = () => {
    a && !bn() && (a = !1), N.hidden = !o || r.hidden, ht.hidden = !i && !a, ht.classList.toggle("tb", a && !i), i ? (ht.textContent = `To ${$(i.a)} ×`, ht.setAttribute("aria-label", `Writing to ${$(i.a)}. Press to write to the whole room instead.`)) : a && (ht.textContent = "To this table ×", ht.setAttribute("aria-label", "Writing to the people at your table. Press to write to the whole room instead.")), et.classList.toggle("dm", !!i);
    const S = bn();
    ze.hidden = !S, ze.classList.toggle("on", a);
    const T = i ? `Message ${$(i.a)}` : a && S ? `Say something to the ${Wn[S] || S} table` : "Say something to the room";
    et.placeholder = T, et.setAttribute("aria-label", T);
  }, js = () => {
    if (C.replaceChildren(), C.hidden = !c, !c) return;
    const S = c, T = O(S.a);
    C.append(q("p", $(S.a), "who"));
    const X = q("div", void 0, "row");
    if (h) {
      C.append(q("p", "Why? Your report goes to the casino team with the last few things they said to you or the room."));
      for (const W of m3) X.append(Ct(W.label, () => {
        $r(S, W.code), We();
      }));
    } else {
      const W = Ct("Message", () => {
        We(), Xs(S);
      });
      W.disabled = T || !n.has(S.a), T ? C.append(q("p", "You have blocked this person. Unblock them to message them.")) : n.known && !n.has(S.a) && C.append(q("p", "They have left the room.")), X.append(
        W,
        Ct(T ? "Unblock" : "Block", () => {
          Br(S, !T), We();
        }),
        Ct("Report…", () => {
          h = !0, Q();
        }, "sm danger")
      );
    }
    X.append(Ct("Cancel", We)), C.append(X);
  }, qs = () => {
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
        T.append(q("span", $(S)), Ct("Unblock", () => {
          Br({ a: S }, !1), Q();
        })), M.append(T);
      }
    }
  }, Q = () => {
    g.hidden = r.hidden, g.classList.remove("left", "right"), g.classList.add(r.side), rt.hidden = !o || r.hidden;
    const S = n.others(t.me()).length;
    R.textContent = n.known ? `Here now (${S})` : "Here now", R.classList.toggle("on", f === "people"), jn.textContent = r.side === "left" ? "Move right ▸" : "◂ Move left", wt.textContent = s.length ? `Blocked (${s.length})` : "Blocked", wt.classList.toggle("on", f === "blocked"), qn(), Xn(), js(), qs(), zs(), je();
  }, je = () => {
    const S = window.innerWidth, T = window.innerHeight, X = document.getElementById("tools"), W = Math.round(Math.max(70, (X ? X.getBoundingClientRect().bottom : 58) + 12));
    let ct = r.side === "left" ? 14 : null, ut = Math.min(340, S - 28), Et = T - W - 12, At = !1;
    const fe = document.getElementById("intro"), kt = fe && fe.getClientRects().length ? fe.getBoundingClientRect() : null;
    kt && kt.width > 0 && kt.height > 0 && kt.bottom > W && (r.side === "left" ? kt.left < 14 + ut : kt.right > S - 14 - ut) && (r.side === "left" && S - kt.right - 30 >= 260 ? (ct = Math.round(kt.right + 16), ut = Math.min(340, S - ct - 14)) : (At = !0, Et = Math.max(170, Math.round(kt.top - W - 8)))), g.style.top = `${W}px`, g.style.left = ct === null ? "auto" : `${ct}px`, g.style.right = ct === null ? "14px" : "", g.style.width = `${ut}px`, g.style.maxHeight = `${Et}px`, g.classList.toggle("over", At && !g.hidden && (o || Ht.size > 0));
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
  }, qe = () => {
    o = !1, c = null, h = !1, f = "", et.blur(), Q();
  }, Ws = () => {
    r.hidden = !0, U(), o = !1, c = null, h = !1, f = "", l = 0, b = 0, et.blur(), Q();
  }, We = () => {
    c = null, h = !1, Q();
  };
  function Er(S) {
    c = S, h = !1, Yn(), Q();
  }
  function Jn(S) {
    f = f === S ? "" : S, c = null, h = !1, Q();
  }
  function Xs(S) {
    if (O(S.a)) {
      pt(Qn("blocked")), Q();
      return;
    }
    i = { a: S.a }, f = "", Ot();
  }
  const Ar = () => {
    i = null, a = !1, Q(), et.focus();
  }, vr = () => {
    t.me() && t.send({ t: "blocks", list: s }) && (w = Date.now());
  };
  function Br(S, T) {
    const X = $(S.a);
    if (T) {
      if (s.length >= Gh) {
        pt(Qn("too-many-blocks"));
        return;
      }
      s.includes(S.a) || s.push(S.a), e.dropFrom(S.a), A(), (i == null ? void 0 : i.a) === S.a && (i = null), pt(`You blocked ${X}. Neither of you will see the other's messages.`);
    } else
      s = s.filter((W) => W !== S.a), pt(`You unblocked ${X}.`);
    e.setBlocked(s), Ht.forEach((W) => W.remove()), Ht.clear(), y(), vr();
  }
  function $r(S, T) {
    if (!t.me() || !t.connected()) {
      pt("Not connected to the room, so the report was not sent.");
      return;
    }
    t.send({ t: "report", who: S.a, why: T, lines: e.lastFrom(S.a) }) && (w = Date.now()), pt("Sending your report…");
  }
  St.onclick = () => {
    o && !r.hidden ? qe() : Ot();
  }, ht.onclick = Ar, L.onclick = () => Sr(), E.addEventListener("scroll", () => {
    v = mr(), v && (L.hidden = !0);
  }, { passive: !0 }), E.addEventListener("wheel", (S) => {
    E.classList.contains("scroll") && S.stopPropagation();
  }, { passive: !0 }), E.addEventListener("touchmove", (S) => {
    E.classList.contains("scroll") && S.stopPropagation();
  }, { passive: !0 }), N.onsubmit = (S) => {
    S.preventDefault();
    const T = Date.now(), X = _3(et.value, { signed: !!t.me(), connected: t.connected(), now: T, lastSentAt: d }), W = "Not connected to the room yet. Your message is still in the box.";
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
    S.stopPropagation(), S.key === "Escape" && (S.preventDefault(), i && !et.value ? Ar() : qe());
  }), et.addEventListener("keypress", (S) => S.stopPropagation()), document.addEventListener("pointerdown", (S) => {
    if (!c && !f) return;
    const T = S.target;
    T && (g.contains(T) || St.contains(T)) || (c = null, h = !1, f = "", Q());
  }), window.addEventListener("resize", je);
  const _r = document.getElementById("intro");
  _r && "MutationObserver" in window && new MutationObserver(() => je()).observe(_r, { attributes: !0, attributeFilter: ["class", "style", "hidden"] });
  const Ys = {
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
      n.set(S), F(T ? t.me() : null), T ? vr() : (o = !1, i = null, c = null, h = !1, f = "", et.value = "", x = null), i && !n.has(i.a) && (i = null), Q();
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
  return qn(), Ys;
}
const Kh = (t) => {
  if (!/^[0-9a-f]{64}$/.test(t)) throw new Error("A round seed is 64 hex characters.");
  const e = new Uint8Array(new ArrayBuffer(32));
  for (let n = 0; n < 32; n++) e[n] = parseInt(t.slice(n * 2, n * 2 + 2), 16);
  return e;
}, qi = (t) => {
  const e = Kh(t), n = (h) => (e[h] | e[h + 1] << 8 | e[h + 2] << 16 | e[h + 3] << 24) >>> 0;
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
}, O3 = (t) => qi(t).below(37), k3 = ["S", "H", "D", "C"], C3 = (t, e = 6) => {
  const n = qi(t), r = Array.from({ length: 416 }, (o, i) => i), s = [];
  for (let o = 0; o < e; o++) {
    const i = o + n.below(r.length - o), a = r[i];
    r[i] = r[o], r[o] = a;
    const c = a % 52;
    s.push({ r: 2 + c % 13, s: k3[Math.floor(c / 13)] });
  }
  return s;
}, P3 = (t) => {
  const e = qi(t);
  return [e.below(6) + 1, e.below(6) + 1, e.below(6) + 1];
}, N3 = () => {
  const t = globalThis.crypto;
  if (!(t != null && t.subtle)) throw new Error("WebCrypto is not available.");
  return t.subtle;
}, D3 = (t) => [...new Uint8Array(t)].map((e) => e.toString(16).padStart(2, "0")).join(""), T3 = async (t) => D3(await N3().digest("SHA-256", Kh(t))), F3 = async (t, e) => {
  try {
    return await T3(t) === e;
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
const M3 = (t) => t.length <= 12 ? t : `${t.slice(0, 5)}…${t.slice(-4)}`, R3 = (t) => {
  if (t.startsWith("SP")) return t;
  const e = Ei(t);
  return Uo({ ...e, version: $o.MainnetSingleSig });
}, G3 = Hy((t) => o3({ address: R3(t), network: "mainnet" }), () => {
  As(), ni(), Y == null || Y.refreshNames();
}), Ms = (t) => {
  let e = null;
  try {
    e = G3.get(t);
  } catch {
  }
  return e || M3(t);
}, zh = (t, e) => ({ key: t, label: Ms(t), x: e.x, z: e.z, r: e.r, at: e.at }), ni = () => {
  var n, r;
  if (!((n = p.host) != null && n.moves) || p.service !== "ok") return;
  const t = ((r = p.you) == null ? void 0 : r.a) ?? null, e = [...p.walk.entries()].filter(([s]) => s !== t).map(([s, o]) => zh(s, o));
  try {
    p.host.moves(e);
  } catch (s) {
    console.warn("[room] the page could not draw the walkers", s);
  }
}, ns = (t, e) => {
  var n, r;
  if (e ? p.walk.set(t, e) : p.walk.delete(t), !(!((n = p.host) != null && n.move) || t === (((r = p.you) == null ? void 0 : r.a) ?? null)))
    try {
      p.host.move(e ? zh(t, e) : { key: t, off: !0 });
    } catch (s) {
      console.warn("[room] the page could not move a walker", s);
    }
}, jh = () => {
  var t;
  !p.features.includes("move") || p.service !== "ok" || !p.connected || !p.signed || !p.you || p.you.guest || ((t = p.ws) == null ? void 0 : t.readyState) === WebSocket.OPEN && (p.ownMove ? (p.ws.send(JSON.stringify({ t: "move", ...p.ownMove })), p.ownSent = !0) : p.ownSent && (p.ws.send(JSON.stringify({ t: "move", off: !0 })), p.ownSent = !1));
}, jt = (t) => {
  var e, n;
  try {
    (n = (e = p.host) == null ? void 0 : e.on) == null || n.call(e, t);
  } catch (r) {
    console.warn("[room] the page could not take a room message", r);
  }
}, V3 = /^(react|win|daily|round|gift|pvp|table|no-table|log|bal|board|friends|tourney|card|mission)/, As = () => {
  var n;
  if (!p.host || p.service !== "ok") return;
  const t = ((n = p.you) == null ? void 0 : n.a) ?? null, e = Object.entries(p.spots).filter(([, r]) => r.a !== t).map(([r, s]) => ({ key: s.a, spot: r, label: Ms(s.a), since: s.since }));
  try {
    p.host.setPeople(e);
  } catch (r) {
    console.warn("[room] the page could not draw the people", r);
  }
}, hr = async (t, e) => {
  const n = await fetch(t, { credentials: "same-origin", ...e });
  let r = null;
  try {
    r = await n.json();
  } catch {
  }
  return { res: n, body: r };
}, ri = (t) => {
  var e;
  return ((e = p.ws) == null ? void 0 : e.readyState) !== WebSocket.OPEN ? !1 : (p.ws.send(JSON.stringify(t)), p.lastSent = Date.now(), !0);
}, qh = () => {
  var e;
  if (p.service !== "ok" || !p.connected || !p.you || p.you.guest || !p.signed) return;
  const t = ((e = Object.entries(p.spots).find(([, n]) => n.a === p.you.a)) == null ? void 0 : e[0]) ?? null;
  p.want ? t !== p.want && p.want !== p.badSpot && p.want !== p.yielded && !p.spots[p.want] && Date.now() - p.lastSent > 1200 && ri({ t: "sit", spot: p.want }) : t && t !== p.standSent && Date.now() - p.lastSent > 600 && (p.standSent = t, ri({ t: "stand" }));
}, Wi = () => {
  if (p.service !== "ok" || p.ws) return;
  p.attempts += 1;
  let t;
  try {
    t = new WebSocket(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/casino/room/ws`);
  } catch {
    return bl();
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
        ni(), p.ownSent = !1, jh(), p.standSent = null, p.signed && ((r = p.you) != null && r.guest) && (p.signed = null), Y == null || Y.room(n.players, !!(p.you && !p.you.guest)), jt({
          t: "room",
          features: p.features.slice(),
          wins: n.wins || [],
          bets: n.bets || {},
          seekers: n.seekers || [],
          at: n.at,
          you: p.you,
          watch: p.watch,
          // phase 3: levels, the jackpot, the tournament, happy hour, and the visitor's own profile, balance, friends and notices
          levels: n.levels || {},
          jackpot: n.jackpot || null,
          tourney: n.tourney || null,
          hh: n.hh || null,
          me: n.me || null,
          bal: n.bal ?? null,
          friends: n.friends || null,
          notices: n.notices || []
        });
        break;
      case "sat":
        p.spots[n.spot] = n.who, (s = n.who) != null && s.a && p.walk.has(n.who.a) && ns(n.who.a, null);
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
        Y == null || Y.heard(n), n.t === "say" && jt(n);
        return;
      case "join":
        Y == null || Y.joined(n.who), jt(n);
        return;
      case "leave":
        Y == null || Y.left(n.a), p.walk.has(n.a) && ns(n.a, null), jt(n);
        return;
      case "react":
      case "win":
      case "daily":
      case "round":
      case "bet":
      case "gift":
      case "seek":
      case "pvp":
      case "spec":
        jt(n);
        return;
      case "me":
      case "hh":
      case "lvl":
      case "badge":
      case "mission-done":
      case "bal":
      case "board":
      case "friends":
      case "tourney":
      case "tourney-end":
      case "jp":
      case "jackpot":
      case "card":
        jt(n);
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
        typeof n.a == "string" && (n.off ? ns(n.a, null) : [n.x, n.z, n.r, n.at].every((a) => typeof a == "number" && Number.isFinite(a)) && ns(n.a, { x: n.x, z: n.z, r: n.r, at: n.at }));
        return;
      case "err":
        if (typeof n.code == "string" && (n.code.startsWith("play-") || n.code.startsWith("move-")) || typeof n.code == "string" && V3.test(n.code) && (jt({ t: "err", code: n.code }), n.code !== "no-table"))
          return;
        n.code === "no-such-spot" || typeof n.code == "string" && n.code.startsWith("salon-") ? p.badSpot = p.want : v3(n.code) && (Y != null && Y.failed(n.code)) || n.code === "slow-down" && (p.lastSent = Date.now() + 3e3);
        return;
      default:
        return;
    }
    As(), qh(), it();
  }, t.onclose = (e) => {
    if (p.ws === t) {
      if (p.ws = null, p.connected = !1, p.spots = {}, As(), p.walk = /* @__PURE__ */ new Map(), ni(), p.ownSent = !1, Y == null || Y.disconnected(), e.code === 4001) {
        p.replaced = !0, it();
        return;
      }
      it(), bl();
    }
  }, t.onerror = () => {
  };
}, bl = () => {
  window.clearTimeout(p.retryTimer);
  const t = Math.min(15e3, 1e3 * 2 ** Math.min(p.attempts, 4));
  p.retryTimer = window.setTimeout(() => {
    p.ws || Wi();
  }, t);
}, Rs = () => {
  const t = p.ws;
  p.ws = null, p.connected = !1, p.attempts = 0, p.replaced = !1;
  try {
    t == null || t.close(1e3, "client");
  } catch {
  }
  Wi();
};
async function Wh(t) {
  const { res: e, body: n } = await hr(`/casino/room/challenge?address=${encodeURIComponent(t.address)}`);
  if (!e.ok) throw new Error((n == null ? void 0 : n.error) || `The room answered ${e.status}.`);
  const r = n.challenge, { domain: s, message: o } = f3(r);
  p.busy = "sign", it();
  let i;
  try {
    i = t.kind === "casino" ? await x3(r) : await _y({
      domain: s,
      message: o,
      network: r.network,
      stxAddress: t.address,
      appDetails: { name: "ParallaX Casino", icon: `${location.origin}/favicons/xtrata-apple-touch-icon.png` }
    });
  } catch (h) {
    throw new Error("The wallet did not sign: " + Es(h));
  }
  const { res: a, body: c } = await hr("/casino/room/session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ challenge: r, signature: i })
  });
  if (!a.ok) throw new Error((c == null ? void 0 : c.error) || `The room answered ${a.status}.`);
  p.signed = { address: c.address, hash160: c.hash160, expiresAt: c.expiresAt }, Rs();
}
async function K3(t) {
  var n, r;
  if (p.busy) return;
  p.error = "", p.busy = "connect", it();
  const e = t === "casino" && !((n = lr()) != null && n.describe().has);
  try {
    p.wallet = await w3(t), Rh(t), await Wh(p.wallet), p.open = !1, e && ((r = lr()) == null || r.fundNew().catch(() => {
    }));
  } catch (s) {
    p.error = /cancel/i.test(Es(s)) ? "" : Es(s);
  } finally {
    p.busy = "", it();
  }
}
async function z3(t) {
  var r;
  const e = t.detail;
  if (!e || typeof e.address != "string" || p.service !== "ok" || p.busy || ((r = p.signed) == null ? void 0 : r.address) === e.address) return;
  const n = e.kind === "casino" || e.kind === "leather" || e.kind === "xverse" ? e.kind : null;
  if (n) {
    p.error = "", p.busy = "sign", it();
    try {
      p.wallet = { kind: n, address: e.address, network: e.address.startsWith("SP") ? "mainnet" : "testnet", via: "page" }, Rh(n), await Wh(p.wallet), p.open = !1;
    } catch (s) {
      const o = Es(s);
      /cancel/i.test(o) || (p.error = o, p.open = !0);
    } finally {
      p.busy = "", it();
    }
  }
}
const j3 = 2e3, q3 = () => {
  var t;
  p.prompted || p.service !== "ok" || !p.connected || p.signed || p.busy || p.open || !p.arrivedAt || Date.now() - p.arrivedAt < j3 || (t = p.host) != null && t.currentSpot() || (p.prompted = !0, p.open = !0, it());
}, W3 = () => {
  const t = lr();
  let e = null;
  try {
    e = localStorage.getItem("STX_PROVIDER");
  } catch {
  }
  const n = /Xverse/.test(e || "") ? ["xverse", "leather"] : ["leather", "xverse"];
  return t ? t.describe().has || !e ? ["casino", ...n] : [n[0], "casino", n[1]] : n;
};
async function X3() {
  try {
    await hr("/casino/room/session", { method: "DELETE" });
  } catch {
  }
  p.signed = null, p.wallet = null, p.error = "", Y == null || Y.endSession(), Y == null || Y.disconnected(), Rs(), it();
}
const Y3 = `
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
}, re = (t, e) => {
  const n = st("p", void 0, "fact");
  return n.append(st("b", t), document.createTextNode(` ${e}`)), n;
};
let Pe = null, Bt = null, Wt = null;
function J3() {
  var n, r;
  if (Pe || p.service !== "ok") return;
  const t = document.createElement("style");
  t.textContent = Y3, document.head.append(t), Pe = st("span"), Pe.id = "pxroom", Bt = st("button"), Bt.id = "pxroom-btn", Bt.type = "button", Bt.setAttribute("aria-label", "Casino room: see who is here and join"), Bt.onclick = () => {
    p.open = !p.open, it();
  }, Wt = st("div"), Wt.id = "pxroom-panel", Wt.hidden = !0, Y = U3({
    send: ri,
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
  }), Pe.append(Bt, Y.button);
  const e = ((r = (n = p.host) == null ? void 0 : n.mount) == null ? void 0 : r.call(n)) ?? document.querySelector("#tools .rt");
  e ? e.insertBefore(Pe, e.firstChild) : (Pe.style.cssText = "position:fixed;top:10px;right:10px;z-index:30", document.body.append(Pe)), document.body.append(Wt), Y.mount(document.body), document.addEventListener("keydown", (s) => {
    s.key === "Escape" && p.open && (p.open = !1, it());
  }), document.addEventListener("pointerdown", (s) => {
    if (!p.open) return;
    const o = s.target;
    o && (Wt.contains(o) || Bt.contains(o)) || (p.open = !1, it());
  }), window.addEventListener("resize", () => it());
}
function Z3() {
  if (!Bt || !Wt) return;
  const t = Bt.getBoundingClientRect(), e = t.height ? Math.round(t.bottom + 8) : 64;
  Wt.style.top = `${Math.min(e, Math.max(64, window.innerHeight - 220))}px`;
}
let gl;
const Q3 = () => {
  var n, r;
  const t = !!(p.signed && p.you && !p.you.guest), e = t ? p.signed.address : null;
  if (e !== gl) {
    gl = e;
    try {
      (r = (n = p.host) == null ? void 0 : n.self) == null || r.call(n, { signed: t, address: e });
    } catch (s) {
      console.warn("[room] the page could not take the sign-in state", s);
    }
  }
}, Xh = () => {
  const t = p.you, e = t && !t.guest ? t.a : null;
  return p.service === "offline" ? { state: "offline", address: null, name: null } : !p.connected || !t ? { state: "connecting", address: null, name: null } : p.features.includes("salon-bns") ? t.guest || !p.signed ? { state: "guest", address: null, name: null } : t.bnsChecked !== !0 ? { state: "unchecked", address: e, name: null } : t.bns ? { state: "allowed", address: e, name: t.bns } : { state: "no-name", address: e, name: null } : { state: "unenforced", address: e, name: null };
};
let xl = "";
const Yh = () => {
  var n, r;
  const t = Xh(), e = JSON.stringify(t);
  if (e !== xl) {
    xl = e;
    try {
      (r = (n = p.host) == null ? void 0 : n.salon) == null || r.call(n, t);
    } catch (s) {
      console.warn("[room] the page could not take the Salon state", s);
    }
  }
};
let Ao = !1;
const tm = async () => {
  if (!(Ao || p.service !== "ok")) {
    Ao = !0;
    try {
      const { res: t, body: e } = await hr("/casino/room/bns", { method: "POST" });
      jt({ t: "bns-check", ok: t.ok, bns: (e == null ? void 0 : e.bns) ?? null, bnsChecked: (e == null ? void 0 : e.bnsChecked) === !0, failed: !t.ok || (e == null ? void 0 : e.failed) === !0, error: t.ok ? null : (e == null ? void 0 : e.error) || `The room answered ${t.status}.` }), t.ok && Rs();
    } catch {
      jt({ t: "bns-check", ok: !1, bns: null, bnsChecked: !1, failed: !0, error: "Could not reach the room." });
    } finally {
      Ao = !1;
    }
  }
};
function it() {
  var n;
  if (Q3(), Yh(), !Pe || !Bt || !Wt) return;
  const t = !!(p.signed && p.you && !p.you.guest);
  if (Bt.className = p.connected ? "live" : "wait", Bt.replaceChildren(st("i"), st("span", t ? "In the room" : "Room", "lbl"), st("span", p.connected ? (n = window.matchMedia) != null && n.call(window, "(max-width:620px)").matches ? String(p.joined) : ` · ${p.joined}` : "", "n")), Bt.setAttribute("aria-label", `Casino room: ${p.connected ? `${p.joined} signed in, ` : ""}${t ? "you are in" : "see who is here and join"}`), Wt.hidden = !p.open, !p.open) return;
  Z3();
  const e = [];
  if (p.replaced) {
    e.push(st("h3", "Room"), st("p", "Another tab of yours took over the room. You are not connected here."));
    const r = st("button", "Use this tab instead");
    r.onclick = () => {
      Rs(), it();
    }, e.push(r);
  } else if (t) {
    e.push(st("h3", "You are in the room")), e.push(st("p", "Others see you at your seat as"), st("p", Ms(p.signed.address), "who")), e.push(st("p", `${p.joined} signed in, ${p.guests} watching.`)), e.push(re("Be seen", "Sit at a table or connect to a machine and your Adrian and name tag appear there for everyone in the room. Stand up or walk away and they go too.")), e.push(re("Spaces", "Each seat and machine holds one person. If someone already has the seat you choose, you are given a free one at the same table.")), e.push(re("Live chat", "Press Chat to talk to the room and scroll back through this session. Tap a name, or Here now, to send someone a direct message, block or report them. Messages are not secret; this session's chat is kept in this tab only and cleared when you leave the room.")), p.features.includes("rounds") && e.push(re("Play together", "Roulette and baccarat are shared tables: everyone there plays the same spin or hand, dealt by the room on a timer and checked by your own browser. In the Strata Salon you can take on another player instead of the house bot.")), p.features.includes("react") && e.push(re("React", "Press 😊 to react, buy your table a round, send someone a drink or invite a friend. Table chat (the Table button in Chat) reaches only the people at your table. Sign in each day for a free daily drop of LAYR.")), e.push(st("p", "Nothing here moves any money.", "fact"));
    const r = st("button", "Leave the room");
    r.onclick = () => {
      X3();
    }, e.push(r);
  } else {
    e.push(st("h3", "Join the room")), e.push(st("p", p.connected ? p.watch ? `You are watching: ${p.joined} signed in, ${p.guests} watching.` : `${p.joined} ${p.joined === 1 ? "person is" : "people are"} in the room. Sign in to join them.` : "Connecting to the room…")), e.push(re("Be seen", p.watch ? "Join, then sit at a table or connect to a machine. Everyone in the room sees your Adrian there, with a name tag (your BNS name, or a short version of your address). Watching alone shows you to nobody." : "Join, then sit at a table or connect to a machine. Everyone in the room sees your Adrian there, with a name tag (your BNS name, or a short version of your address). Until you join you are invisible, and the room is hidden from you; the casino still plays as normal.")), e.push(re("Spaces", "Each seat and machine holds one person. If someone already has the seat you choose, you are given a free one at the same table.")), e.push(re("Live chat", "Signed-in players can chat with the room and send each other direct messages. Messages are not secret and are not saved.")), e.push(re("Free", "One signature. It sends no transaction, costs no fee and gives no permission to spend anything."));
    const r = st("div", void 0, "row"), s = lr(), o = { leather: "Leather", xverse: "Xverse", casino: s ? s.describe().label : "Casino wallet" };
    for (const i of W3()) {
      const a = st("button", p.busy ? p.busy === "sign" ? "Check your wallet…" : "Connecting…" : o[i]);
      if (a.disabled = !!p.busy || !p.connected, a.onclick = () => {
        K3(i);
      }, i === "casino" && (a.style.flexBasis = "100%"), r.append(a), p.busy) break;
    }
    if (e.push(r), s && !s.describe().has && e.push(st("p", "Casino wallet: use your casino passkey from any of your devices, or make one free with Face ID or your fingerprint (500 free testnet STX and your first 1,000,000 LAYR).", "fact")), p.error && e.push(st("p", p.error, "err")), !p.busy) {
      const i = st("button", "Not now");
      i.onclick = () => {
        p.open = !1, it();
      }, e.push(i);
    }
  }
  Wt.replaceChildren(...e);
}
const em = (t) => {
  var n, r;
  const e = t.detail;
  !e || typeof e.spot != "string" || !Array.isArray(e.s) || typeof e.b != "number" || !p.features.includes("play") || p.service !== "ok" || !p.connected || !p.signed || !p.you || p.you.guest || ((n = p.spots[e.spot]) == null ? void 0 : n.a) === p.you.a && ((r = p.ws) == null ? void 0 : r.readyState) === WebSocket.OPEN && p.ws.send(JSON.stringify({ t: "play", spot: e.spot, s: e.s.slice(0, 8), b: e.b, f: !!e.f }));
}, nm = (t) => {
  const e = t.detail;
  if (e) {
    if (e.off) p.ownMove = null;
    else if ([e.x, e.z, e.r].every((n) => typeof n == "number" && Number.isFinite(n))) p.ownMove = { x: e.x, z: e.z, r: e.r };
    else return;
    jh();
  }
}, wl = {
  react: "react",
  win: "win",
  daily: "daily",
  watch: "table",
  round: "rounds",
  bet: "rounds",
  gift: "gift",
  seek: "pvp",
  pvp: "pvp",
  spec: "spec",
  log: "progress",
  mission: "missions",
  card: "progress",
  board: "boards",
  tjoin: "tourney",
  bal: "bal",
  friends: "friends"
}, rm = (t) => {
  var s;
  const e = t.detail;
  if (!e || typeof e.t != "string" || !wl[e.t]) return;
  const n = e.t === "round" || e.t === "watch" || e.t === "spec" && e.ask === !0;
  if (!(p.service === "ok" && p.connected && p.features.includes(wl[e.t]) && (n || !!(p.signed && p.you && !p.you.guest))) || ((s = p.ws) == null ? void 0 : s.readyState) !== WebSocket.OPEN) {
    jt({ t: "unsent", msg: e });
    return;
  }
  p.ws.send(JSON.stringify(e));
}, sm = () => {
  var e;
  const t = ((e = p.host) == null ? void 0 : e.currentSpot()) ?? null;
  t !== p.want && (p.want = t, p.yielded = null, p.standSent = null, As()), qh();
};
async function om() {
  const t = () => {
    p.service = "offline", Yh();
  };
  try {
    const { res: e, body: n } = await hr("/casino/room/session");
    if (e.status === 503) return t();
    e.ok && (n != null && n.address) && (p.signed = { address: n.address, hash160: n.hash160, expiresAt: n.expiresAt }), p.service = "ok";
  } catch {
    return t();
  }
  J3(), it(), Wi(), window.setInterval(sm, 250), window.setInterval(q3, 500), window.addEventListener("px-wallet-connected", (e) => {
    z3(e);
  }), window.addEventListener("px-casino-wallet-ready", () => it()), window.addEventListener("px-room-play", em), window.addEventListener("px-room-move", nm), window.addEventListener("px-room-send", rm), window.addEventListener("px-room-bns-check", () => {
    tm();
  });
}
window.PXRounds = Object.freeze({ verifySeed: F3, rouletteResult: O3, baccaratCards: C3, sicboDice: P3 });
const yl = (t) => {
  p.host || (p.host = t, om());
}, ml = window.PXRoomHost;
ml ? yl(ml) : window.addEventListener("px-room-host", () => yl(window.PXRoomHost), { once: !0 });
window.__pxRoom = {
  chat: () => (Y == null ? void 0 : Y.debug()) ?? null,
  get state() {
    var t;
    return { service: p.service, signed: ((t = p.signed) == null ? void 0 : t.address) ?? null, connected: p.connected, watch: p.watch, prompted: p.prompted, open: p.open, busy: p.busy, error: p.error, you: p.you, spots: p.spots, joined: p.joined, guests: p.guests, want: p.want, features: p.features.slice(), walkers: [...p.walk.keys()], ownMove: p.ownMove, salon: Xh(), trail: Ce.slice() };
  }
};
