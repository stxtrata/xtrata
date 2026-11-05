var Au = Object.defineProperty;
var vu = (t, e, n) => e in t ? Au(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var An = (t, e, n) => vu(t, typeof e != "symbol" ? e + "" : e, n);
function bi(t, e) {
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
    if (e) {
      const r = _u(BigInt(`0x${ce(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${ce(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function gi(t, e = 8) {
  return (typeof t == "bigint" ? t : bi(t, !1)).toString(16).padStart(e * 2, "0");
}
function zl(t) {
  return parseInt(t, 16);
}
function Gl(t, e = 16) {
  const n = gi(t, e);
  return In(n);
}
function Bu(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function $u(t, e) {
  return t & BigInt(1) << e;
}
function _u(t, e) {
  return $u(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Lu = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ce(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Lu[n];
  return e;
}
function In(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t;
  const e = t.length % 2 ? `0${t}` : t, n = new Uint8Array(e.length / 2);
  for (let r = 0; r < n.length; r++) {
    const o = r * 2, s = e.slice(o, o + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    n[r] = i;
  }
  return n;
}
function mr(t) {
  return new TextEncoder().encode(t);
}
function Vl(t) {
  return new TextDecoder().decode(t);
}
function Kl(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Hu(t) {
  return String.fromCharCode.apply(null, t);
}
function ku(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Sa(t) {
  if (t.some(ku))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function xi(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, o) => r + o.length, 0), n = new Uint8Array(e);
  for (let r = 0, o = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, o), o += s.length;
  }
  return n;
}
function Gn(t) {
  return xi(...t.map((e) => typeof e == "number" ? Sa([e]) : e instanceof Array ? Sa(e) : e));
}
function Iu(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Uu(t, e) {
  return t[e];
}
function Ou(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Oo(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Ns;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Ns || (Ns = {}));
Ns.Mainnet;
const Cu = 128, Nu = 128, jl = 16;
var ur;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ur || (ur = {}));
var Ea;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ea || (Ea = {}));
var Aa;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Aa || (Aa = {}));
var Dt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Dt || (Dt = {}));
const fs = ["onChainOnly", "offChainOnly", "any"];
fs[0] + "", Dt.OnChainOnly, fs[1] + "", Dt.OffChainOnly, fs[2] + "", Dt.Any, Dt.OnChainOnly + "", Dt.OnChainOnly, Dt.OffChainOnly + "", Dt.OffChainOnly, Dt.Any + "", Dt.Any;
var Ps;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ps || (Ps = {}));
Ps.Mainnet;
var va;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(va || (va = {}));
var Ba;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ba || (Ba = {}));
var $a;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})($a || ($a = {}));
var _a;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(_a || (_a = {}));
var Ds;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ds || (Ds = {}));
var La;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(La || (La = {}));
var Ha;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ha || (Ha = {}));
var ka;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(ka || (ka = {}));
var Ia;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ia || (Ia = {}));
var Ua;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ua || (Ua = {}));
var Oa;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Oa || (Oa = {}));
function Ts(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Pu(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function ql(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Du(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ts(t.outputLen), Ts(t.blockLen);
}
function Tu(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Fu(t, e) {
  ql(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const hs = {
  number: Ts,
  bool: Pu,
  bytes: ql,
  hash: Du,
  exists: Tu,
  output: Fu
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const us = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Vt = (t, e) => t << 32 - e | t >>> e, Mu = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Mu)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ru(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Wl(t) {
  if (typeof t == "string" && (t = Ru(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let zu = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function hn(t) {
  const e = (r) => t().update(Wl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Gu(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, h = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + h, a, r);
}
let wi = class extends zu {
  constructor(e, n, r, o) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = us(this.buffer);
  }
  update(e) {
    hs.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    e = Wl(e);
    const s = e.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(o - this.pos, s - i);
      if (a === o) {
        const c = us(e);
        for (; o <= s - i; i += o)
          this.process(c, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    hs.exists(this), hs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let l = i; l < o; l++)
      n[l] = 0;
    Gu(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = us(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const h = c / 4, u = this.get();
    if (h > u.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < h; l++)
      a.setUint32(4 * l, u[l], s);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: a } = this;
    return e.length = o, e.pos = a, e.finished = s, e.destroyed = i, o % n && e.buffer.set(r), e;
  }
};
const Vu = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Jl = Uint8Array.from({ length: 16 }, (t, e) => e), Ku = Jl.map((t) => (9 * t + 5) % 16);
let yi = [Jl], mi = [Ku];
for (let t = 0; t < 4; t++)
  for (let e of [yi, mi])
    e.push(e[t].map((n) => Vu[n]));
const Xl = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), ju = yi.map((t, e) => t.map((n) => Xl[e][n])), qu = mi.map((t, e) => t.map((n) => Xl[e][n])), Wu = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Ju = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Mr = (t, e) => t << e | t >>> 32 - e;
function Ca(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Rr = new Uint32Array(16);
let Xu = class extends wi {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: o, h4: s } = this;
    return [e, n, r, o, s];
  }
  set(e, n, r, o, s) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = o | 0, this.h4 = s | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Rr[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, o = r, s = this.h1 | 0, i = s, a = this.h2 | 0, c = a, h = this.h3 | 0, u = h, l = this.h4 | 0, b = l;
    for (let p = 0; p < 5; p++) {
      const g = 4 - p, w = Wu[p], E = Ju[p], $ = yi[p], H = mi[p], y = ju[p], _ = qu[p];
      for (let v = 0; v < 16; v++) {
        const P = Mr(r + Ca(p, s, a, h) + Rr[$[v]] + w, y[v]) + l | 0;
        r = l, l = h, h = Mr(a, 10) | 0, a = s, s = P;
      }
      for (let v = 0; v < 16; v++) {
        const P = Mr(o + Ca(g, i, c, u) + Rr[H[v]] + E, _[v]) + b | 0;
        o = b, b = u, u = Mr(c, 10) | 0, c = i, i = P;
      }
    }
    this.set(this.h1 + a + u | 0, this.h2 + h + b | 0, this.h3 + l + o | 0, this.h4 + r + i | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Rr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
hn(() => new Xu());
const Yu = (t, e, n) => t & e ^ ~t & n, Zu = (t, e, n) => t & e ^ t & n ^ e & n, Qu = new Uint32Array([
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
let Yl = class extends wi {
  constructor() {
    super(64, 32, 8, !1), this.A = ue[0] | 0, this.B = ue[1] | 0, this.C = ue[2] | 0, this.D = ue[3] | 0, this.E = ue[4] | 0, this.F = ue[5] | 0, this.G = ue[6] | 0, this.H = ue[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: o, E: s, F: i, G: a, H: c } = this;
    return [e, n, r, o, s, i, a, c];
  }
  // prettier-ignore
  set(e, n, r, o, s, i, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      de[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = de[l - 15], p = de[l - 2], g = Vt(b, 7) ^ Vt(b, 18) ^ b >>> 3, w = Vt(p, 17) ^ Vt(p, 19) ^ p >>> 10;
      de[l] = w + de[l - 7] + g + de[l - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: h, H: u } = this;
    for (let l = 0; l < 64; l++) {
      const b = Vt(a, 6) ^ Vt(a, 11) ^ Vt(a, 25), p = u + b + Yu(a, c, h) + Qu[l] + de[l] | 0, w = (Vt(r, 2) ^ Vt(r, 13) ^ Vt(r, 22)) + Zu(r, o, s) | 0;
      u = h, h = c, c = a, a = i + p | 0, i = s, s = o, o = r, r = p + w | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, h = h + this.G | 0, u = u + this.H | 0, this.set(r, o, s, i, a, c, h, u);
  }
  roundClean() {
    de.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, td = class extends Yl {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
hn(() => new Yl());
hn(() => new td());
const zr = BigInt(2 ** 32 - 1), Fs = BigInt(32);
function Zl(t, e = !1) {
  return e ? { h: Number(t & zr), l: Number(t >> Fs & zr) } : { h: Number(t >> Fs & zr) | 0, l: Number(t & zr) | 0 };
}
function ed(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let o = 0; o < t.length; o++) {
    const { h: s, l: i } = Zl(t[o], e);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const nd = (t, e) => BigInt(t >>> 0) << Fs | BigInt(e >>> 0), rd = (t, e, n) => t >>> n, od = (t, e, n) => t << 32 - n | e >>> n, sd = (t, e, n) => t >>> n | e << 32 - n, id = (t, e, n) => t << 32 - n | e >>> n, ad = (t, e, n) => t << 64 - n | e >>> n - 32, cd = (t, e, n) => t >>> n - 32 | e << 64 - n, ld = (t, e) => e, fd = (t, e) => t, hd = (t, e, n) => t << n | e >>> 32 - n, ud = (t, e, n) => e << n | t >>> 32 - n, dd = (t, e, n) => e << n - 32 | t >>> 64 - n, pd = (t, e, n) => t << n - 32 | e >>> 64 - n;
function bd(t, e, n, r) {
  const o = (e >>> 0) + (r >>> 0);
  return { h: t + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const gd = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), xd = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, wd = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), yd = (t, e, n, r, o) => e + n + r + o + (t / 2 ** 32 | 0) | 0, md = (t, e, n, r, o) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), Sd = (t, e, n, r, o, s) => e + n + r + o + s + (t / 2 ** 32 | 0) | 0, V = {
  fromBig: Zl,
  split: ed,
  toBig: nd,
  shrSH: rd,
  shrSL: od,
  rotrSH: sd,
  rotrSL: id,
  rotrBH: ad,
  rotrBL: cd,
  rotr32H: ld,
  rotr32L: fd,
  rotlSH: hd,
  rotlSL: ud,
  rotlBH: dd,
  rotlBL: pd,
  add: bd,
  add3L: gd,
  add3H: xd,
  add4L: wd,
  add4H: yd,
  add5H: Sd,
  add5L: md
}, [Ed, Ad] = V.split([
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
].map((t) => BigInt(t))), pe = new Uint32Array(80), be = new Uint32Array(80);
let Co = class extends wi {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: a, Dl: c, Eh: h, El: u, Fh: l, Fl: b, Gh: p, Gl: g, Hh: w, Hl: E } = this;
    return [e, n, r, o, s, i, a, c, h, u, l, b, p, g, w, E];
  }
  // prettier-ignore
  set(e, n, r, o, s, i, a, c, h, u, l, b, p, g, w, E) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = h | 0, this.El = u | 0, this.Fh = l | 0, this.Fl = b | 0, this.Gh = p | 0, this.Gl = g | 0, this.Hh = w | 0, this.Hl = E | 0;
  }
  process(e, n) {
    for (let y = 0; y < 16; y++, n += 4)
      pe[y] = e.getUint32(n), be[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const _ = pe[y - 15] | 0, v = be[y - 15] | 0, P = V.rotrSH(_, v, 1) ^ V.rotrSH(_, v, 8) ^ V.shrSH(_, v, 7), M = V.rotrSL(_, v, 1) ^ V.rotrSL(_, v, 8) ^ V.shrSL(_, v, 7), O = pe[y - 2] | 0, N = be[y - 2] | 0, x = V.rotrSH(O, N, 19) ^ V.rotrBH(O, N, 61) ^ V.shrSH(O, N, 6), A = V.rotrSL(O, N, 19) ^ V.rotrBL(O, N, 61) ^ V.shrSL(O, N, 6), k = V.add4L(M, A, be[y - 7], be[y - 16]), C = V.add4H(k, P, x, pe[y - 7], pe[y - 16]);
      pe[y] = C | 0, be[y] = k | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: a, Cl: c, Dh: h, Dl: u, Eh: l, El: b, Fh: p, Fl: g, Gh: w, Gl: E, Hh: $, Hl: H } = this;
    for (let y = 0; y < 80; y++) {
      const _ = V.rotrSH(l, b, 14) ^ V.rotrSH(l, b, 18) ^ V.rotrBH(l, b, 41), v = V.rotrSL(l, b, 14) ^ V.rotrSL(l, b, 18) ^ V.rotrBL(l, b, 41), P = l & p ^ ~l & w, M = b & g ^ ~b & E, O = V.add5L(H, v, M, Ad[y], be[y]), N = V.add5H(O, $, _, P, Ed[y], pe[y]), x = O | 0, A = V.rotrSH(r, o, 28) ^ V.rotrBH(r, o, 34) ^ V.rotrBH(r, o, 39), k = V.rotrSL(r, o, 28) ^ V.rotrBL(r, o, 34) ^ V.rotrBL(r, o, 39), C = r & s ^ r & a ^ s & a, R = o & i ^ o & c ^ i & c;
      $ = w | 0, H = E | 0, w = p | 0, E = g | 0, p = l | 0, g = b | 0, { h: l, l: b } = V.add(h | 0, u | 0, N | 0, x | 0), h = a | 0, u = c | 0, a = s | 0, c = i | 0, s = r | 0, i = o | 0;
      const D = V.add3L(x, k, R);
      r = V.add3H(D, N, A, C), o = D | 0;
    }
    ({ h: r, l: o } = V.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = V.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: a, l: c } = V.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h, l: u } = V.add(this.Dh | 0, this.Dl | 0, h | 0, u | 0), { h: l, l: b } = V.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h: p, l: g } = V.add(this.Fh | 0, this.Fl | 0, p | 0, g | 0), { h: w, l: E } = V.add(this.Gh | 0, this.Gl | 0, w | 0, E | 0), { h: $, l: H } = V.add(this.Hh | 0, this.Hl | 0, $ | 0, H | 0), this.set(r, o, s, i, a, c, h, u, l, b, p, g, w, E, $, H);
  }
  roundClean() {
    pe.fill(0), be.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, vd = class extends Co {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Bd = class extends Co {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, $d = class extends Co {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
hn(() => new Co());
hn(() => new vd());
hn(() => new Bd());
hn(() => new $d());
const _d = {}, Ql = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _d
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Z = BigInt(0), at = BigInt(1), Me = BigInt(2), cr = BigInt(3), Na = BigInt(8), ot = Object.freeze({
  a: Z,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: at,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Pa = (t, e) => (t + e / Me) / e, Gr = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = ot, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -at * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), o = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), s = n, i = BigInt("0x100000000000000000000000000000000"), a = Pa(s * t, e), c = Pa(-r * t, e);
    let h = I(t - a * n - c * o, e), u = I(-a * r - c * s, e);
    const l = h > i, b = u > i;
    if (l && (h = e - h), b && (u = e - u), h > i || u > i)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: h, k2neg: b, k2: u };
  }
}, zt = 32, on = 32, tf = 32, xo = zt + 1, wo = 2 * zt + 1;
function Da(t) {
  const { a: e, b: n } = ot, r = I(t * t), o = I(r * t);
  return I(o + e * t + n);
}
const Vr = ot.a === Z;
class Si extends Error {
  constructor(e) {
    super(e);
  }
}
function Ta(t) {
  if (!(t instanceof nt))
    throw new TypeError("JacobianPoint expected");
}
class nt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof tt))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(tt.ZERO) ? nt.ZERO : new nt(e.x, e.y, at);
  }
  static toAffineBatch(e) {
    const n = Ud(e.map((r) => r.z));
    return e.map((r, o) => r.toAffine(n[o]));
  }
  static normalizeZ(e) {
    return nt.toAffineBatch(e).map(nt.fromAffine);
  }
  equals(e) {
    Ta(e);
    const { x: n, y: r, z: o } = this, { x: s, y: i, z: a } = e, c = I(o * o), h = I(a * a), u = I(n * h), l = I(s * c), b = I(I(r * a) * h), p = I(I(i * o) * c);
    return u === l && b === p;
  }
  negate() {
    return new nt(this.x, I(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, o = I(e * e), s = I(n * n), i = I(s * s), a = e + s, c = I(Me * (I(a * a) - o - i)), h = I(cr * o), u = I(h * h), l = I(u - Me * c), b = I(h * (c - l) - Na * i), p = I(Me * n * r);
    return new nt(l, b, p);
  }
  add(e) {
    Ta(e);
    const { x: n, y: r, z: o } = this, { x: s, y: i, z: a } = e;
    if (s === Z || i === Z)
      return this;
    if (n === Z || r === Z)
      return e;
    const c = I(o * o), h = I(a * a), u = I(n * h), l = I(s * c), b = I(I(r * a) * h), p = I(I(i * o) * c), g = I(l - u), w = I(p - b);
    if (g === Z)
      return w === Z ? this.double() : nt.ZERO;
    const E = I(g * g), $ = I(g * E), H = I(u * E), y = I(w * w - $ - Me * H), _ = I(w * (H - y) - b * $), v = I(o * a * g);
    return new nt(y, _, v);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = nt.ZERO;
    if (typeof e == "bigint" && e === Z)
      return n;
    let r = Ra(e);
    if (r === at)
      return this;
    if (!Vr) {
      let l = n, b = this;
      for (; r > Z; )
        r & at && (l = l.add(b)), b = b.double(), r >>= at;
      return l;
    }
    let { k1neg: o, k1: s, k2neg: i, k2: a } = Gr.splitScalar(r), c = n, h = n, u = this;
    for (; s > Z || a > Z; )
      s & at && (c = c.add(u)), a & at && (h = h.add(u)), u = u.double(), s >>= at, a >>= at;
    return o && (c = c.negate()), i && (h = h.negate()), h = new nt(I(h.x * Gr.beta), h.y, h.z), c.add(h);
  }
  precomputeWindow(e) {
    const n = Vr ? 128 / e + 1 : 256 / e + 1, r = [];
    let o = this, s = o;
    for (let i = 0; i < n; i++) {
      s = o, r.push(s);
      for (let a = 1; a < 2 ** (e - 1); a++)
        s = s.add(o), r.push(s);
      o = s.double();
    }
    return r;
  }
  wNAF(e, n) {
    !n && this.equals(nt.BASE) && (n = tt.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let o = n && Ms.get(n);
    o || (o = this.precomputeWindow(r), n && r !== 1 && (o = nt.normalizeZ(o), Ms.set(n, o)));
    let s = nt.ZERO, i = nt.BASE;
    const a = 1 + (Vr ? 128 / r : 256 / r), c = 2 ** (r - 1), h = BigInt(2 ** r - 1), u = 2 ** r, l = BigInt(r);
    for (let b = 0; b < a; b++) {
      const p = b * c;
      let g = Number(e & h);
      e >>= l, g > c && (g -= u, e += at);
      const w = p, E = p + Math.abs(g) - 1, $ = b % 2 !== 0, H = g < 0;
      g === 0 ? i = i.add(Kr($, o[w])) : s = s.add(Kr(H, o[E]));
    }
    return { p: s, f: i };
  }
  multiply(e, n) {
    let r = Ra(e), o, s;
    if (Vr) {
      const { k1neg: i, k1: a, k2neg: c, k2: h } = Gr.splitScalar(r);
      let { p: u, f: l } = this.wNAF(a, n), { p: b, f: p } = this.wNAF(h, n);
      u = Kr(i, u), b = Kr(c, b), b = new nt(I(b.x * Gr.beta), b.y, b.z), o = u.add(b), s = l.add(p);
    } else {
      const { p: i, f: a } = this.wNAF(r, n);
      o = i, s = a;
    }
    return nt.normalizeZ([o, s])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: o } = this, s = this.equals(nt.ZERO);
    e == null && (e = s ? Na : Vn(o));
    const i = e, a = I(i * i), c = I(a * i), h = I(n * a), u = I(r * c), l = I(o * i);
    if (s)
      return tt.ZERO;
    if (l !== at)
      throw new Error("invZ was invalid");
    return new tt(h, u);
  }
}
nt.BASE = new nt(ot.Gx, ot.Gy, at);
nt.ZERO = new nt(Z, at, Z);
function Kr(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Ms = /* @__PURE__ */ new WeakMap();
class tt {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Ms.delete(this);
  }
  hasEvenY() {
    return this.y % Me === Z;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = Lt(n ? e : e.subarray(1));
    if (!ho(r))
      throw new Error("Point is not on curve");
    const o = Da(r);
    let s = Id(o);
    const i = (s & at) === at;
    n ? i && (s = I(-s)) : (e[0] & 1) === 1 !== i && (s = I(-s));
    const a = new tt(r, s);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = Lt(e.subarray(1, zt + 1)), r = Lt(e.subarray(zt + 1, zt * 2 + 1)), o = new tt(n, r);
    return o.assertValidity(), o;
  }
  static fromHex(e) {
    const n = Zt(e), r = n.length, o = n[0];
    if (r === zt)
      return this.fromCompressedHex(n);
    if (r === xo && (o === 2 || o === 3))
      return this.fromCompressedHex(n);
    if (r === wo && o === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${xo} compressed bytes or ${wo} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return tt.BASE.multiply(sn(e));
  }
  static fromSignature(e, n, r) {
    const { r: o, s } = rf(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const i = Ei(Zt(e)), { n: a } = ot, c = r === 2 || r === 3 ? o + a : o, h = Vn(c, a), u = I(-i * h, a), l = I(s * h, a), b = r & 1 ? "03" : "02", p = tt.fromHex(b + Re(c)), g = tt.BASE.multiplyAndAddUnsafe(p, u, l);
    if (!g)
      throw new Error("Cannot recover signature: point at infinify");
    return g.assertValidity(), g;
  }
  toRawBytes(e = !1) {
    return ze(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Re(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Re(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!ho(n) || !ho(r))
      throw new Error(e);
    const o = I(r * r), s = Da(n);
    if (I(o - s) !== Z)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new tt(this.x, I(-this.y));
  }
  double() {
    return nt.fromAffine(this).double().toAffine();
  }
  add(e) {
    return nt.fromAffine(this).add(nt.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return nt.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const o = nt.fromAffine(this), s = n === Z || n === at || this !== tt.BASE ? o.multiplyUnsafe(n) : o.multiply(n), i = nt.fromAffine(e).multiplyUnsafe(r), a = s.add(i);
    return a.equals(nt.ZERO) ? void 0 : a.toAffine();
  }
}
tt.BASE = new tt(ot.Gx, ot.Gy);
tt.ZERO = new tt(Z, Z);
function Fa(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Ma(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Un(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Lt(n), left: t.subarray(e + 2) };
}
function Ld(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Un(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Ma(t.subarray(2)), { data: r, left: o } = Ma(n);
  if (o.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Un(o)}`);
  return { r: e, s: r };
}
class ae {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const o = n ? Un(e) : e;
    if (o.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new ae(yo(o.slice(0, 64)), yo(o.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s: o } = Ld(n ? e : ze(e));
    return new ae(r, o);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Cn(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Cn(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = ot.n >> at;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new ae(this.r, I(-this.s, ot.n)) : this;
  }
  toDERRawBytes() {
    return ze(this.toDERHex());
  }
  toDERHex() {
    const e = Fa(rr(this.s)), n = Fa(rr(this.r)), r = e.length / 2, o = n.length / 2, s = rr(r), i = rr(o);
    return `30${rr(o + r + 4)}02${i}${n}02${s}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return ze(this.toCompactHex());
  }
  toCompactHex() {
    return Re(this.r) + Re(this.s);
  }
}
function Te(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, o) => r + o.length, 0), n = new Uint8Array(e);
  for (let r = 0, o = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, o), o += s.length;
  }
  return n;
}
const Hd = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Un(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Hd[t[n]];
  return e;
}
const kd = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Re(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Z <= t && t < kd))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function On(t) {
  const e = ze(Re(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function rr(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function yo(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function ze(t) {
  if (typeof t != "string")
    throw new TypeError("hexToBytes: expected string, got " + typeof t);
  if (t.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + t.length);
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, o = t.slice(r, r + 2), s = Number.parseInt(o, 16);
    if (Number.isNaN(s) || s < 0)
      throw new Error("Invalid byte sequence");
    e[n] = s;
  }
  return e;
}
function Lt(t) {
  return yo(Un(t));
}
function Zt(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : ze(t);
}
function Ra(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Cn(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function I(t, e = ot.P) {
  const n = t % e;
  return n >= Z ? n : e + n;
}
function kt(t, e) {
  const { P: n } = ot;
  let r = t;
  for (; e-- > Z; )
    r *= r, r %= n;
  return r;
}
function Id(t) {
  const { P: e } = ot, n = BigInt(6), r = BigInt(11), o = BigInt(22), s = BigInt(23), i = BigInt(44), a = BigInt(88), c = t * t * t % e, h = c * c * t % e, u = kt(h, cr) * h % e, l = kt(u, cr) * h % e, b = kt(l, Me) * c % e, p = kt(b, r) * b % e, g = kt(p, o) * p % e, w = kt(g, i) * g % e, E = kt(w, a) * w % e, $ = kt(E, i) * g % e, H = kt($, cr) * h % e, y = kt(H, s) * p % e, _ = kt(y, n) * c % e, v = kt(_, Me);
  if (v * v % e !== t)
    throw new Error("Cannot find square root");
  return v;
}
function Vn(t, e = ot.P) {
  if (t === Z || e <= Z)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = I(t, e), r = e, o = Z, s = at;
  for (; n !== Z; ) {
    const a = r / n, c = r % n, h = o - s * a;
    r = n, n = c, o = s, s = h;
  }
  if (r !== at)
    throw new Error("invert: does not exist");
  return I(o, e);
}
function Ud(t, e = ot.P) {
  const n = new Array(t.length), r = t.reduce((s, i, a) => i === Z ? s : (n[a] = s, I(s * i, e)), at), o = Vn(r, e);
  return t.reduceRight((s, i, a) => i === Z ? s : (n[a] = I(s * n[a], e), I(s * i, e)), o), n;
}
function Od(t) {
  const e = t.length * 8 - on * 8, n = Lt(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Ei(t, e = !1) {
  const n = Od(t);
  if (e)
    return n;
  const { n: r } = ot;
  return n >= r ? n - r : n;
}
let kn, lr;
class ef {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return ct.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return lr(this.k, ...e);
  }
  checkSync() {
    if (typeof lr != "function")
      throw new Si("hmacSha256Sync needs to be set");
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
    return Te(...n);
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
    return Te(...n);
  }
}
function Cn(t) {
  return Z < t && t < ot.n;
}
function ho(t) {
  return Z < t && t < ot.P;
}
function nf(t, e, n, r = !0) {
  const { n: o } = ot, s = Ei(t, !0);
  if (!Cn(s))
    return;
  const i = Vn(s, o), a = tt.BASE.multiply(s), c = I(a.x, o);
  if (c === Z)
    return;
  const h = I(i * I(e + n * c, o), o);
  if (h === Z)
    return;
  let u = new ae(c, h), l = (a.x === u.r ? 0 : 2) | Number(a.y & at);
  return r && u.hasHighS() && (u = u.normalizeS(), l ^= 1), { sig: u, recovery: l };
}
function sn(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * on)
      throw new Error("Expected 32 bytes of private key");
    e = yo(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== on)
      throw new Error("Expected 32 bytes of private key");
    e = Lt(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Cn(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Ai(t) {
  return t instanceof tt ? (t.assertValidity(), t) : tt.fromHex(t);
}
function rf(t) {
  if (t instanceof ae)
    return t.assertValidity(), t;
  try {
    return ae.fromDER(t);
  } catch {
    return ae.fromCompact(t);
  }
}
function vi(t, e = !1) {
  return tt.fromPrivateKey(t).toRawBytes(e);
}
function Cd(t, e, n, r = !1) {
  return tt.fromSignature(t, e, n).toRawBytes(r);
}
function za(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === xo || r === wo : n ? r === xo * 2 || r === wo * 2 : t instanceof tt;
}
function Bi(t, e, n = !1) {
  if (za(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!za(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Ai(e);
  return r.assertValidity(), r.multiply(sn(t)).toRawBytes(n);
}
function of(t) {
  const e = t.length > zt ? t.slice(0, zt) : t;
  return Lt(e);
}
function Nd(t) {
  const e = of(t), n = I(e, ot.n);
  return sf(n < Z ? e : n);
}
function sf(t) {
  return On(t);
}
function af(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Zt(t), o = sn(e), s = [sf(o), Nd(r)];
  if (n != null) {
    n === !0 && (n = ct.randomBytes(zt));
    const c = Zt(n);
    if (c.length !== zt)
      throw new Error(`sign: Expected ${zt} bytes of extra data`);
    s.push(c);
  }
  const i = Te(...s), a = of(r);
  return { seed: i, m: a, d: o };
}
function cf(t, e) {
  const { sig: n, recovery: r } = t, { der: o, recovered: s } = Object.assign({ canonical: !0, der: !0 }, e), i = o ? n.toDERRawBytes() : n.toCompactRawBytes();
  return s ? [i, r] : i;
}
async function Pd(t, e, n = {}) {
  const { seed: r, m: o, d: s } = af(t, e, n.extraEntropy), i = new ef(tf, on);
  await i.reseed(r);
  let a;
  for (; !(a = nf(await i.generate(), o, s, n.canonical)); )
    await i.reseed();
  return cf(a, n);
}
function lf(t, e, n = {}) {
  const { seed: r, m: o, d: s } = af(t, e, n.extraEntropy), i = new ef(tf, on);
  i.reseedSync(r);
  let a;
  for (; !(a = nf(i.generateSync(), o, s, n.canonical)); )
    i.reseedSync();
  return cf(a, n);
}
const Dd = { strict: !0 };
function Td(t, e, n, r = Dd) {
  let o;
  try {
    o = rf(t), e = Zt(e);
  } catch {
    return !1;
  }
  const { r: s, s: i } = o;
  if (r.strict && o.hasHighS())
    return !1;
  const a = Ei(e);
  let c;
  try {
    c = Ai(n);
  } catch {
    return !1;
  }
  const { n: h } = ot, u = Vn(i, h), l = I(a * u, h), b = I(s * u, h), p = tt.BASE.multiplyAndAddUnsafe(c, l, b);
  return p ? I(p.x, h) === s : !1;
}
function mo(t) {
  return I(Lt(t), ot.n);
}
class Nn {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Zt(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = Lt(n.subarray(0, 32)), o = Lt(n.subarray(32, 64));
    return new Nn(r, o);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!ho(e) || !Cn(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Re(this.r) + Re(this.s);
  }
  toRawBytes() {
    return ze(this.toHex());
  }
}
function Fd(t) {
  return tt.fromPrivateKey(t).toRawX();
}
class ff {
  constructor(e, n, r = ct.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Zt(e);
    const { x: o, scalar: s } = this.getScalar(sn(n));
    if (this.px = o, this.d = s, this.rand = Zt(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = tt.fromPrivateKey(e), r = n.hasEvenY() ? e : ot.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return On(e ^ Lt(n));
  }
  finalizeNonce(e) {
    const n = I(Lt(e), ot.n);
    if (n === Z)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: o, scalar: s } = this.getScalar(n);
    return { R: r, rx: o, k: s };
  }
  finalizeSig(e, n, r, o) {
    return new Nn(e.x, I(n + r * o, ot.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: o } = this, s = ct.taggedHash, i = this.initNonce(n, await s(De.aux, o)), { R: a, rx: c, k: h } = this.finalizeNonce(await s(De.nonce, i, r, e)), u = mo(await s(De.challenge, c, r, e)), l = this.finalizeSig(a, h, u, n);
    return await df(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: o } = this, s = ct.taggedHashSync, i = this.initNonce(n, s(De.aux, o)), { R: a, rx: c, k: h } = this.finalizeNonce(s(De.nonce, i, r, e)), u = mo(s(De.challenge, c, r, e)), l = this.finalizeSig(a, h, u, n);
    return pf(l, e, r) || this.error(), l;
  }
}
async function Md(t, e, n) {
  return new ff(t, e, n).calc();
}
function Rd(t, e, n) {
  return new ff(t, e, n).calcSync();
}
function hf(t, e, n) {
  const r = t instanceof Nn, o = r ? t : Nn.fromHex(t);
  return r && o.assertValidity(), {
    ...o,
    m: Zt(e),
    P: Ai(n)
  };
}
function uf(t, e, n, r) {
  const o = tt.BASE.multiplyAndAddUnsafe(e, sn(n), I(-r, ot.n));
  return !(!o || !o.hasEvenY() || o.x !== t);
}
async function df(t, e, n) {
  try {
    const { r, s: o, m: s, P: i } = hf(t, e, n), a = mo(await ct.taggedHash(De.challenge, On(r), i.toRawX(), s));
    return uf(r, i, o, a);
  } catch {
    return !1;
  }
}
function pf(t, e, n) {
  try {
    const { r, s: o, m: s, P: i } = hf(t, e, n), a = mo(ct.taggedHashSync(De.challenge, On(r), i.toRawX(), s));
    return uf(r, i, o, a);
  } catch (r) {
    if (r instanceof Si)
      throw r;
    return !1;
  }
}
const zd = {
  Signature: Nn,
  getPublicKey: Fd,
  sign: Md,
  verify: df,
  signSync: Rd,
  verifySync: pf
};
tt.BASE._setWindowSize(8);
const Bt = {
  node: Ql,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, De = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, jr = {}, ct = {
  bytesToHex: Un,
  hexToBytes: ze,
  concatBytes: Te,
  mod: I,
  invert: Vn,
  isValidPrivateKey(t) {
    try {
      return sn(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: On,
  _normalizePrivateKey: sn,
  hashToPrivateKey: (t) => {
    t = Zt(t);
    const e = on + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = I(Lt(t), ot.n - at) + at;
    return On(n);
  },
  randomBytes: (t = 32) => {
    if (Bt.web)
      return Bt.web.getRandomValues(new Uint8Array(t));
    if (Bt.node) {
      const { randomBytes: e } = Bt.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => ct.hashToPrivateKey(ct.randomBytes(on + 8)),
  precompute(t = 8, e = tt.BASE) {
    const n = e === tt.BASE ? e : new tt(e.x, e.y);
    return n._setWindowSize(t), n.multiply(cr), n;
  },
  sha256: async (...t) => {
    if (Bt.web) {
      const e = await Bt.web.subtle.digest("SHA-256", Te(...t));
      return new Uint8Array(e);
    } else if (Bt.node) {
      const { createHash: e } = Bt.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Bt.web) {
      const n = await Bt.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Te(...e), o = await Bt.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(o);
    } else if (Bt.node) {
      const { createHmac: n } = Bt.node, r = n("sha256", t);
      return e.forEach((o) => r.update(o)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = jr[t];
    if (n === void 0) {
      const r = await ct.sha256(Uint8Array.from(t, (o) => o.charCodeAt(0)));
      n = Te(r, r), jr[t] = n;
    }
    return ct.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof kn != "function")
      throw new Si("sha256Sync is undefined, you need to set it");
    let n = jr[t];
    if (n === void 0) {
      const r = kn(Uint8Array.from(t, (o) => o.charCodeAt(0)));
      n = Te(r, r), jr[t] = n;
    }
    return kn(n, ...e);
  },
  _JacobianPoint: nt
};
Object.defineProperties(ct, {
  sha256Sync: {
    configurable: !1,
    get() {
      return kn;
    },
    set(t) {
      kn || (kn = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return lr;
    },
    set(t) {
      lr || (lr = t);
    }
  }
});
const Gd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: ot,
  Point: tt,
  Signature: ae,
  getPublicKey: vi,
  getSharedSecret: Bi,
  recoverPublicKey: Cd,
  schnorr: zd,
  sign: Pd,
  signSync: lf,
  utils: ct,
  verify: Td
}, Symbol.toStringTag, { value: "Module" }));
var xt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Vd(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Sr(t) {
  if (t.__esModule) return t;
  var e = t.default;
  if (typeof e == "function") {
    var n = function r() {
      return this instanceof r ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    n.prototype = e.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(t).forEach(function(r) {
    var o = Object.getOwnPropertyDescriptor(t, r);
    Object.defineProperty(n, r, o.get ? o : {
      enumerable: !0,
      get: function() {
        return t[r];
      }
    });
  }), n;
}
var Kn = {}, $i = {};
const vn = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function bf(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Rs(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Ve(t, ...e) {
  if (!bf(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function gf(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Rs(t.outputLen), Rs(t.blockLen);
}
function dr(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function xf(t, e) {
  Ve(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function Kd(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function jd(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function pr(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function uo(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Pt(t, e) {
  return t << 32 - e | t >>> e;
}
function qd(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const _i = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Li(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const wf = _i ? (t) => t : (t) => Li(t), Wd = wf;
function yf(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Li(t[e]);
  return t;
}
const Jd = _i ? (t) => t : yf, mf = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", Xd = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Yd(t) {
  if (Ve(t), mf)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Xd[t[n]];
  return e;
}
const oe = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Ga(t) {
  if (t >= oe._0 && t <= oe._9)
    return t - oe._0;
  if (t >= oe.A && t <= oe.F)
    return t - (oe.A - 10);
  if (t >= oe.a && t <= oe.f)
    return t - (oe.a - 10);
}
function Zd(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (mf)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let o = 0, s = 0; o < n; o++, s += 2) {
    const i = Ga(t.charCodeAt(s)), a = Ga(t.charCodeAt(s + 1));
    if (i === void 0 || a === void 0) {
      const c = t[s] + t[s + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + s);
    }
    r[o] = i * 16 + a;
  }
  return r;
}
const Sf = async () => {
};
async function Qd(t, e, n) {
  let r = Date.now();
  for (let o = 0; o < t; o++) {
    n(o);
    const s = Date.now() - r;
    s >= 0 && s < e || (await Sf(), r += s);
  }
}
function Hi(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function tp(t) {
  return new TextDecoder().decode(t);
}
function jn(t) {
  return typeof t == "string" && (t = Hi(t)), Ve(t), t;
}
function ep(t) {
  return typeof t == "string" && (t = Hi(t)), Ve(t), t;
}
function np(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const o = t[r];
    Ve(o), e += o.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, o = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, o), o += s.length;
  }
  return n;
}
function rp(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let ki = class {
};
function No(t) {
  const e = (r) => t().update(jn(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Ef(t) {
  const e = (r, o) => t(o).update(jn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function Af(t) {
  const e = (r, o) => t(o).update(jn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const op = No, sp = Ef, ip = Af;
function ap(t = 32) {
  if (vn && typeof vn.getRandomValues == "function")
    return vn.getRandomValues(new Uint8Array(t));
  if (vn && typeof vn.randomBytes == "function")
    return Uint8Array.from(vn.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const cp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: ki,
  abytes: Ve,
  aexists: dr,
  ahash: gf,
  anumber: Rs,
  aoutput: xf,
  asyncLoop: Qd,
  byteSwap: Li,
  byteSwap32: yf,
  byteSwapIfBE: Wd,
  bytesToHex: Yd,
  bytesToUtf8: tp,
  checkOpts: rp,
  clean: pr,
  concatBytes: np,
  createHasher: No,
  createOptHasher: Ef,
  createView: uo,
  createXOFer: Af,
  hexToBytes: Zd,
  isBytes: bf,
  isLE: _i,
  kdfInputToBytes: ep,
  nextTick: Sf,
  randomBytes: ap,
  rotl: qd,
  rotr: Pt,
  swap32IfBE: Jd,
  swap8IfBE: wf,
  toBytes: jn,
  u32: jd,
  u8: Kd,
  utf8ToBytes: Hi,
  wrapConstructor: op,
  wrapConstructorWithOpts: sp,
  wrapXOFConstructorWithOpts: ip
}, Symbol.toStringTag, { value: "Module" })), Er = /* @__PURE__ */ Sr(cp);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = Er;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(i, a) {
    if (!i.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    i.length % 2 !== 0 && (i = `0${i}`), i = i.toLowerCase();
    let c = [], h = 0;
    for (let p = i.length - 1; p >= 0; p--)
      if (h < 4) {
        const g = n.indexOf(i[p]) >> h;
        let w = 0;
        p !== 0 && (w = n.indexOf(i[p - 1]));
        const E = 1 + h, $ = w % (1 << E) << 5 - E, H = t.c32[g + $];
        h = E, c.unshift(H);
      } else
        h = 0;
    let u = 0;
    for (let p = 0; p < c.length && c[p] === "0"; p++)
      u++;
    c = c.slice(u);
    const l = new TextDecoder().decode((0, e.hexToBytes)(i)).match(/^\u0000*/), b = l ? l[0].length : 0;
    for (let p = 0; p < b; p++)
      c.unshift(t.c32[0]);
    if (a) {
      const p = a - c.length;
      for (let g = 0; g < p; g++)
        c.unshift(t.c32[0]);
    }
    return c.join("");
  }
  t.c32encode = r;
  function o(i) {
    return i.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  t.c32normalize = o;
  function s(i, a) {
    if (i = o(i), !i.match(`^[${t.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const c = i.match(`^${t.c32[0]}*`), h = c ? c[0].length : 0;
    let u = [], l = 0, b = 0;
    for (let w = i.length - 1; w >= 0; w--) {
      b === 4 && (u.unshift(n[l]), b = 0, l = 0);
      const $ = (t.c32.indexOf(i[w]) << b) + l, H = n[$ % 16];
      if (b += 1, l = $ >> 4, l > 1 << b)
        throw new Error("Panic error in decoding.");
      u.unshift(H);
    }
    u.unshift(n[l]), u.length % 2 === 1 && u.unshift("0");
    let p = 0;
    for (let w = 0; w < u.length && u[w] === "0"; w++)
      p++;
    u = u.slice(p - p % 2);
    let g = u.join("");
    for (let w = 0; w < h; w++)
      g = `00${g}`;
    if (a) {
      const w = a * 2 - g.length;
      for (let E = 0; E < w; E += 2)
        g = `00${g}`;
    }
    return g;
  }
  t.c32decode = s;
})($i);
var an = {};
function lp(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, h = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + h, a, r);
}
function fp(t, e, n) {
  return t & e ^ ~t & n;
}
function hp(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class up extends ki {
  constructor(e, n, r, o) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = o, this.buffer = new Uint8Array(e), this.view = uo(this.buffer);
  }
  update(e) {
    dr(this), e = jn(e), Ve(e);
    const { view: n, buffer: r, blockLen: o } = this, s = e.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(o - this.pos, s - i);
      if (a === o) {
        const c = uo(e);
        for (; o <= s - i; i += o)
          this.process(c, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    dr(this), xf(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, pr(this.buffer.subarray(i)), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let l = i; l < o; l++)
      n[l] = 0;
    lp(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = uo(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const h = c / 4, u = this.get();
    if (h > u.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < h; l++)
      a.setUint32(4 * l, u[l], s);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: a } = this;
    return e.destroyed = i, e.finished = s, e.length = o, e.pos = a, o % n && e.buffer.set(r), e;
  }
  clone() {
    return this._cloneInto();
  }
}
const ge = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), xe = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), dp = /* @__PURE__ */ Uint32Array.from([
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
]), we = /* @__PURE__ */ new Uint32Array(64);
let Ii = class extends up {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = ge[0] | 0, this.B = ge[1] | 0, this.C = ge[2] | 0, this.D = ge[3] | 0, this.E = ge[4] | 0, this.F = ge[5] | 0, this.G = ge[6] | 0, this.H = ge[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: o, E: s, F: i, G: a, H: c } = this;
    return [e, n, r, o, s, i, a, c];
  }
  // prettier-ignore
  set(e, n, r, o, s, i, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      we[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = we[l - 15], p = we[l - 2], g = Pt(b, 7) ^ Pt(b, 18) ^ b >>> 3, w = Pt(p, 17) ^ Pt(p, 19) ^ p >>> 10;
      we[l] = w + we[l - 7] + g + we[l - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: h, H: u } = this;
    for (let l = 0; l < 64; l++) {
      const b = Pt(a, 6) ^ Pt(a, 11) ^ Pt(a, 25), p = u + b + fp(a, c, h) + dp[l] + we[l] | 0, w = (Pt(r, 2) ^ Pt(r, 13) ^ Pt(r, 22)) + hp(r, o, s) | 0;
      u = h, h = c, c = a, a = i + p | 0, i = s, s = o, o = r, r = p + w | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, h = h + this.G | 0, u = u + this.H | 0, this.set(r, o, s, i, a, c, h, u);
  }
  roundClean() {
    pr(we);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), pr(this.buffer);
  }
}, vf = class extends Ii {
  constructor() {
    super(28), this.A = xe[0] | 0, this.B = xe[1] | 0, this.C = xe[2] | 0, this.D = xe[3] | 0, this.E = xe[4] | 0, this.F = xe[5] | 0, this.G = xe[6] | 0, this.H = xe[7] | 0;
  }
};
const pp = /* @__PURE__ */ No(() => new Ii()), bp = /* @__PURE__ */ No(() => new vf()), gp = Ii, xp = pp, wp = vf, yp = bp, mp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: wp,
  SHA256: gp,
  sha224: yp,
  sha256: xp
}, Symbol.toStringTag, { value: "Module" })), Po = /* @__PURE__ */ Sr(mp);
Object.defineProperty(an, "__esModule", { value: !0 });
an.c32checkDecode = an.c32checkEncode = void 0;
const Va = Po, Ka = Er, fr = $i;
function Bf(t) {
  const e = (0, Va.sha256)((0, Va.sha256)((0, Ka.hexToBytes)(t)));
  return (0, Ka.bytesToHex)(e.slice(0, 4));
}
function Sp(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Bf(`${n}${e}`), o = (0, fr.c32encode)(`${e}${r}`);
  return `${fr.c32[t]}${o}`;
}
an.c32checkEncode = Sp;
function Ep(t) {
  t = (0, fr.c32normalize)(t);
  const e = (0, fr.c32decode)(t.slice(1)), n = t[0], r = fr.c32.indexOf(n), o = e.slice(-8);
  let s = r.toString(16);
  if (s.length === 1 && (s = `0${s}`), Bf(`${s}${e.substring(0, e.length - 8)}`) !== o)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
an.c32checkDecode = Ep;
var $f = {}, Pn = {};
function Ap(t) {
  if (t.length >= 255)
    throw new TypeError("Alphabet too long");
  for (var e = new Uint8Array(256), n = 0; n < e.length; n++)
    e[n] = 255;
  for (var r = 0; r < t.length; r++) {
    var o = t.charAt(r), s = o.charCodeAt(0);
    if (e[s] !== 255)
      throw new TypeError(o + " is ambiguous");
    e[s] = r;
  }
  var i = t.length, a = t.charAt(0), c = Math.log(i) / Math.log(256), h = Math.log(256) / Math.log(i);
  function u(p) {
    if (p instanceof Uint8Array || (ArrayBuffer.isView(p) ? p = new Uint8Array(p.buffer, p.byteOffset, p.byteLength) : Array.isArray(p) && (p = Uint8Array.from(p))), !(p instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (p.length === 0)
      return "";
    for (var g = 0, w = 0, E = 0, $ = p.length; E !== $ && p[E] === 0; )
      E++, g++;
    for (var H = ($ - E) * h + 1 >>> 0, y = new Uint8Array(H); E !== $; ) {
      for (var _ = p[E], v = 0, P = H - 1; (_ !== 0 || v < w) && P !== -1; P--, v++)
        _ += 256 * y[P] >>> 0, y[P] = _ % i >>> 0, _ = _ / i >>> 0;
      if (_ !== 0)
        throw new Error("Non-zero carry");
      w = v, E++;
    }
    for (var M = H - w; M !== H && y[M] === 0; )
      M++;
    for (var O = a.repeat(g); M < H; ++M)
      O += t.charAt(y[M]);
    return O;
  }
  function l(p) {
    if (typeof p != "string")
      throw new TypeError("Expected String");
    if (p.length === 0)
      return new Uint8Array();
    for (var g = 0, w = 0, E = 0; p[g] === a; )
      w++, g++;
    for (var $ = (p.length - g) * c + 1 >>> 0, H = new Uint8Array($); p[g]; ) {
      var y = p.charCodeAt(g);
      if (y > 255)
        return;
      var _ = e[y];
      if (_ === 255)
        return;
      for (var v = 0, P = $ - 1; (_ !== 0 || v < E) && P !== -1; P--, v++)
        _ += i * H[P] >>> 0, H[P] = _ % 256 >>> 0, _ = _ / 256 >>> 0;
      if (_ !== 0)
        throw new Error("Non-zero carry");
      E = v, g++;
    }
    for (var M = $ - E; M !== $ && H[M] === 0; )
      M++;
    for (var O = new Uint8Array(w + ($ - M)), N = w; M !== $; )
      O[N++] = H[M++];
    return O;
  }
  function b(p) {
    var g = l(p);
    if (g)
      return g;
    throw new Error("Non-base" + i + " character");
  }
  return {
    encode: u,
    decodeUnsafe: l,
    decode: b
  };
}
var _f = Ap;
Object.defineProperty(Pn, "__esModule", { value: !0 });
Pn.decode = Pn.encode = void 0;
const So = Po, ja = Er, Lf = _f, Hf = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function vp(t, e = "00") {
  const n = typeof t == "string" ? (0, ja.hexToBytes)(t) : t, r = typeof e == "string" ? (0, ja.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const o = (0, So.sha256)((0, So.sha256)(new Uint8Array([...r, ...n])));
  return Lf(Hf).encode([...r, ...n, ...o.slice(0, 4)]);
}
Pn.encode = vp;
function Bp(t) {
  const e = Lf(Hf).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), o = (0, So.sha256)((0, So.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((s, i) => {
    if (s !== o[i])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Pn.decode = Bp;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = an, n = Pn, r = Er;
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
  const o = {};
  o[0] = t.versions.mainnet.p2pkh, o[5] = t.versions.mainnet.p2sh, o[111] = t.versions.testnet.p2pkh, o[196] = t.versions.testnet.p2sh;
  const s = {};
  s[t.versions.mainnet.p2pkh] = 0, s[t.versions.mainnet.p2sh] = 5, s[t.versions.testnet.p2pkh] = 111, s[t.versions.testnet.p2sh] = 196;
  function i(u, l) {
    if (!l.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, e.c32checkEncode)(u, l)}`;
  }
  t.c32address = i;
  function a(u) {
    if (u.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (u[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, e.c32checkDecode)(u.slice(1));
  }
  t.c32addressDecode = a;
  function c(u, l = -1) {
    const b = n.decode(u), p = (0, r.bytesToHex)(b.data), g = parseInt((0, r.bytesToHex)(b.prefix), 16);
    let w;
    return l < 0 ? (w = g, o[g] !== void 0 && (w = o[g])) : w = l, i(w, p);
  }
  t.b58ToC32 = c;
  function h(u, l = -1) {
    const b = a(u), p = b[0], g = b[1];
    let w;
    l < 0 ? (w = p, s[p] !== void 0 && (w = s[p])) : w = l;
    let E = w.toString(16);
    return E.length === 1 && (E = `0${E}`), n.encode(g, E);
  }
  t.c32ToB58 = h;
})($f);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = $i;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = an;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = $f;
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
})(Kn);
var Eo = { exports: {} };
Eo.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", o = 9007199254740991, s = "[object Arguments]", i = "[object Array]", a = "[object Boolean]", c = "[object Date]", h = "[object Error]", u = "[object Function]", l = "[object GeneratorFunction]", b = "[object Map]", p = "[object Number]", g = "[object Object]", w = "[object Promise]", E = "[object RegExp]", $ = "[object Set]", H = "[object String]", y = "[object Symbol]", _ = "[object WeakMap]", v = "[object ArrayBuffer]", P = "[object DataView]", M = "[object Float32Array]", O = "[object Float64Array]", N = "[object Int8Array]", x = "[object Int16Array]", A = "[object Int32Array]", k = "[object Uint8Array]", C = "[object Uint8ClampedArray]", R = "[object Uint16Array]", D = "[object Uint32Array]", ht = /[\\^$.*+?()[\]{}|]/g, rt = /\w*$/, Ke = /^\[object .+?Constructor\]$/, st = /^(?:0|[1-9]\d*)$/, G = {};
  G[s] = G[i] = G[v] = G[P] = G[a] = G[c] = G[M] = G[O] = G[N] = G[x] = G[A] = G[b] = G[p] = G[g] = G[E] = G[$] = G[H] = G[y] = G[k] = G[C] = G[R] = G[D] = !0, G[h] = G[u] = G[_] = !1;
  var Lr = typeof xt == "object" && xt && xt.Object === Object && xt, Xn = typeof self == "object" && self && self.Object === Object && self, yt = Lr || Xn || Function("return this")(), je = e && !e.nodeType && e, Et = je && !0 && t && !t.nodeType && t, Ht = Et && Et.exports === je;
  function Xo(d, S) {
    return d.set(S[0], S[1]), d;
  }
  function Yo(d, S) {
    return d.add(S), d;
  }
  function xn(d, S) {
    for (var B = -1, T = d ? d.length : 0; ++B < T && S(d[B], B, d) !== !1; )
      ;
    return d;
  }
  function Zo(d, S) {
    for (var B = -1, T = S.length, dt = d.length; ++B < T; )
      d[dt + B] = S[B];
    return d;
  }
  function Hr(d, S, B, T) {
    for (var dt = -1, mt = d ? d.length : 0; ++dt < mt; )
      B = S(B, d[dt], dt, d);
    return B;
  }
  function kr(d, S) {
    for (var B = -1, T = Array(d); ++B < d; )
      T[B] = S(B);
    return T;
  }
  function Qo(d, S) {
    return d == null ? void 0 : d[S];
  }
  function Yn(d) {
    var S = !1;
    if (d != null && typeof d.toString != "function")
      try {
        S = !!(d + "");
      } catch {
      }
    return S;
  }
  function wn(d) {
    var S = -1, B = Array(d.size);
    return d.forEach(function(T, dt) {
      B[++S] = [dt, T];
    }), B;
  }
  function Zn(d, S) {
    return function(B) {
      return d(S(B));
    };
  }
  function Qn(d) {
    var S = -1, B = Array(d.size);
    return d.forEach(function(T) {
      B[++S] = T;
    }), B;
  }
  var ts = Array.prototype, es = Function.prototype, et = Object.prototype, qe = yt["__core-js_shared__"], pt = function() {
    var d = /[^.]+$/.exec(qe && qe.keys && qe.keys.IE_PROTO || "");
    return d ? "Symbol(src)_1." + d : "";
  }(), tr = es.toString, Ot = et.hasOwnProperty, We = et.toString, ns = RegExp(
    "^" + tr.call(Ot).replace(ht, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Je = Ht ? yt.Buffer : void 0, er = yt.Symbol, nr = yt.Uint8Array, rs = Zn(Object.getPrototypeOf, Object), Ir = Object.create, Ur = et.propertyIsEnumerable, Or = ts.splice, Cr = Object.getOwnPropertySymbols, Nr = Je ? Je.isBuffer : void 0, os = Zn(Object.keys, Object), m = Sn(yt, "DataView"), F = Sn(yt, "Map"), Y = Sn(yt, "Promise"), X = Sn(yt, "Set"), it = Sn(yt, "WeakMap"), ut = Sn(Object, "create"), At = Ze(m), vt = Ze(F), he = Ze(Y), Ct = Ze(X), aa = Ze(it), ca = er ? er.prototype : void 0, la = ca ? ca.valueOf : void 0;
  function Xe(d) {
    var S = -1, B = d ? d.length : 0;
    for (this.clear(); ++S < B; ) {
      var T = d[S];
      this.set(T[0], T[1]);
    }
  }
  function $0() {
    this.__data__ = ut ? ut(null) : {};
  }
  function _0(d) {
    return this.has(d) && delete this.__data__[d];
  }
  function L0(d) {
    var S = this.__data__;
    if (ut) {
      var B = S[d];
      return B === r ? void 0 : B;
    }
    return Ot.call(S, d) ? S[d] : void 0;
  }
  function H0(d) {
    var S = this.__data__;
    return ut ? S[d] !== void 0 : Ot.call(S, d);
  }
  function k0(d, S) {
    var B = this.__data__;
    return B[d] = ut && S === void 0 ? r : S, this;
  }
  Xe.prototype.clear = $0, Xe.prototype.delete = _0, Xe.prototype.get = L0, Xe.prototype.has = H0, Xe.prototype.set = k0;
  function ne(d) {
    var S = -1, B = d ? d.length : 0;
    for (this.clear(); ++S < B; ) {
      var T = d[S];
      this.set(T[0], T[1]);
    }
  }
  function I0() {
    this.__data__ = [];
  }
  function U0(d) {
    var S = this.__data__, B = Pr(S, d);
    if (B < 0)
      return !1;
    var T = S.length - 1;
    return B == T ? S.pop() : Or.call(S, B, 1), !0;
  }
  function O0(d) {
    var S = this.__data__, B = Pr(S, d);
    return B < 0 ? void 0 : S[B][1];
  }
  function C0(d) {
    return Pr(this.__data__, d) > -1;
  }
  function N0(d, S) {
    var B = this.__data__, T = Pr(B, d);
    return T < 0 ? B.push([d, S]) : B[T][1] = S, this;
  }
  ne.prototype.clear = I0, ne.prototype.delete = U0, ne.prototype.get = O0, ne.prototype.has = C0, ne.prototype.set = N0;
  function yn(d) {
    var S = -1, B = d ? d.length : 0;
    for (this.clear(); ++S < B; ) {
      var T = d[S];
      this.set(T[0], T[1]);
    }
  }
  function P0() {
    this.__data__ = {
      hash: new Xe(),
      map: new (F || ne)(),
      string: new Xe()
    };
  }
  function D0(d) {
    return Dr(this, d).delete(d);
  }
  function T0(d) {
    return Dr(this, d).get(d);
  }
  function F0(d) {
    return Dr(this, d).has(d);
  }
  function M0(d, S) {
    return Dr(this, d).set(d, S), this;
  }
  yn.prototype.clear = P0, yn.prototype.delete = D0, yn.prototype.get = T0, yn.prototype.has = F0, yn.prototype.set = M0;
  function mn(d) {
    this.__data__ = new ne(d);
  }
  function R0() {
    this.__data__ = new ne();
  }
  function z0(d) {
    return this.__data__.delete(d);
  }
  function G0(d) {
    return this.__data__.get(d);
  }
  function V0(d) {
    return this.__data__.has(d);
  }
  function K0(d, S) {
    var B = this.__data__;
    if (B instanceof ne) {
      var T = B.__data__;
      if (!F || T.length < n - 1)
        return T.push([d, S]), this;
      B = this.__data__ = new yn(T);
    }
    return B.set(d, S), this;
  }
  mn.prototype.clear = R0, mn.prototype.delete = z0, mn.prototype.get = G0, mn.prototype.has = V0, mn.prototype.set = K0;
  function j0(d, S) {
    var B = as(d) || gu(d) ? kr(d.length, String) : [], T = B.length, dt = !!T;
    for (var mt in d)
      Ot.call(d, mt) && !(dt && (mt == "length" || uu(mt, T))) && B.push(mt);
    return B;
  }
  function fa(d, S, B) {
    var T = d[S];
    (!(Ot.call(d, S) && pa(T, B)) || B === void 0 && !(S in d)) && (d[S] = B);
  }
  function Pr(d, S) {
    for (var B = d.length; B--; )
      if (pa(d[B][0], S))
        return B;
    return -1;
  }
  function q0(d, S) {
    return d && ha(S, cs(S), d);
  }
  function ss(d, S, B, T, dt, mt, re) {
    var St;
    if (T && (St = mt ? T(d, dt, mt, re) : T(d)), St !== void 0)
      return St;
    if (!Tr(d))
      return d;
    var xa = as(d);
    if (xa) {
      if (St = lu(d), !S)
        return iu(d, St);
    } else {
      var En = Ye(d), wa = En == u || En == l;
      if (wu(d))
        return Q0(d, S);
      if (En == g || En == s || wa && !mt) {
        if (Yn(d))
          return mt ? d : {};
        if (St = fu(wa ? {} : d), !S)
          return au(d, q0(St, d));
      } else {
        if (!G[En])
          return mt ? d : {};
        St = hu(d, En, ss, S);
      }
    }
    re || (re = new mn());
    var ya = re.get(d);
    if (ya)
      return ya;
    if (re.set(d, St), !xa)
      var ma = B ? cu(d) : cs(d);
    return xn(ma || d, function(ls, Fr) {
      ma && (Fr = ls, ls = d[Fr]), fa(St, Fr, ss(ls, S, B, T, Fr, d, re));
    }), St;
  }
  function W0(d) {
    return Tr(d) ? Ir(d) : {};
  }
  function J0(d, S, B) {
    var T = S(d);
    return as(d) ? T : Zo(T, B(d));
  }
  function X0(d) {
    return We.call(d);
  }
  function Y0(d) {
    if (!Tr(d) || pu(d))
      return !1;
    var S = ga(d) || Yn(d) ? ns : Ke;
    return S.test(Ze(d));
  }
  function Z0(d) {
    if (!da(d))
      return os(d);
    var S = [];
    for (var B in Object(d))
      Ot.call(d, B) && B != "constructor" && S.push(B);
    return S;
  }
  function Q0(d, S) {
    if (S)
      return d.slice();
    var B = new d.constructor(d.length);
    return d.copy(B), B;
  }
  function is(d) {
    var S = new d.constructor(d.byteLength);
    return new nr(S).set(new nr(d)), S;
  }
  function tu(d, S) {
    var B = S ? is(d.buffer) : d.buffer;
    return new d.constructor(B, d.byteOffset, d.byteLength);
  }
  function eu(d, S, B) {
    var T = S ? B(wn(d), !0) : wn(d);
    return Hr(T, Xo, new d.constructor());
  }
  function nu(d) {
    var S = new d.constructor(d.source, rt.exec(d));
    return S.lastIndex = d.lastIndex, S;
  }
  function ru(d, S, B) {
    var T = S ? B(Qn(d), !0) : Qn(d);
    return Hr(T, Yo, new d.constructor());
  }
  function ou(d) {
    return la ? Object(la.call(d)) : {};
  }
  function su(d, S) {
    var B = S ? is(d.buffer) : d.buffer;
    return new d.constructor(B, d.byteOffset, d.length);
  }
  function iu(d, S) {
    var B = -1, T = d.length;
    for (S || (S = Array(T)); ++B < T; )
      S[B] = d[B];
    return S;
  }
  function ha(d, S, B, T) {
    B || (B = {});
    for (var dt = -1, mt = S.length; ++dt < mt; ) {
      var re = S[dt], St = void 0;
      fa(B, re, St === void 0 ? d[re] : St);
    }
    return B;
  }
  function au(d, S) {
    return ha(d, ua(d), S);
  }
  function cu(d) {
    return J0(d, cs, ua);
  }
  function Dr(d, S) {
    var B = d.__data__;
    return du(S) ? B[typeof S == "string" ? "string" : "hash"] : B.map;
  }
  function Sn(d, S) {
    var B = Qo(d, S);
    return Y0(B) ? B : void 0;
  }
  var ua = Cr ? Zn(Cr, Object) : Su, Ye = X0;
  (m && Ye(new m(new ArrayBuffer(1))) != P || F && Ye(new F()) != b || Y && Ye(Y.resolve()) != w || X && Ye(new X()) != $ || it && Ye(new it()) != _) && (Ye = function(d) {
    var S = We.call(d), B = S == g ? d.constructor : void 0, T = B ? Ze(B) : void 0;
    if (T)
      switch (T) {
        case At:
          return P;
        case vt:
          return b;
        case he:
          return w;
        case Ct:
          return $;
        case aa:
          return _;
      }
    return S;
  });
  function lu(d) {
    var S = d.length, B = d.constructor(S);
    return S && typeof d[0] == "string" && Ot.call(d, "index") && (B.index = d.index, B.input = d.input), B;
  }
  function fu(d) {
    return typeof d.constructor == "function" && !da(d) ? W0(rs(d)) : {};
  }
  function hu(d, S, B, T) {
    var dt = d.constructor;
    switch (S) {
      case v:
        return is(d);
      case a:
      case c:
        return new dt(+d);
      case P:
        return tu(d, T);
      case M:
      case O:
      case N:
      case x:
      case A:
      case k:
      case C:
      case R:
      case D:
        return su(d, T);
      case b:
        return eu(d, T, B);
      case p:
      case H:
        return new dt(d);
      case E:
        return nu(d);
      case $:
        return ru(d, T, B);
      case y:
        return ou(d);
    }
  }
  function uu(d, S) {
    return S = S ?? o, !!S && (typeof d == "number" || st.test(d)) && d > -1 && d % 1 == 0 && d < S;
  }
  function du(d) {
    var S = typeof d;
    return S == "string" || S == "number" || S == "symbol" || S == "boolean" ? d !== "__proto__" : d === null;
  }
  function pu(d) {
    return !!pt && pt in d;
  }
  function da(d) {
    var S = d && d.constructor, B = typeof S == "function" && S.prototype || et;
    return d === B;
  }
  function Ze(d) {
    if (d != null) {
      try {
        return tr.call(d);
      } catch {
      }
      try {
        return d + "";
      } catch {
      }
    }
    return "";
  }
  function bu(d) {
    return ss(d, !0, !0);
  }
  function pa(d, S) {
    return d === S || d !== d && S !== S;
  }
  function gu(d) {
    return xu(d) && Ot.call(d, "callee") && (!Ur.call(d, "callee") || We.call(d) == s);
  }
  var as = Array.isArray;
  function ba(d) {
    return d != null && yu(d.length) && !ga(d);
  }
  function xu(d) {
    return mu(d) && ba(d);
  }
  var wu = Nr || Eu;
  function ga(d) {
    var S = Tr(d) ? We.call(d) : "";
    return S == u || S == l;
  }
  function yu(d) {
    return typeof d == "number" && d > -1 && d % 1 == 0 && d <= o;
  }
  function Tr(d) {
    var S = typeof d;
    return !!d && (S == "object" || S == "function");
  }
  function mu(d) {
    return !!d && typeof d == "object";
  }
  function cs(d) {
    return ba(d) ? j0(d) : Z0(d);
  }
  function Su() {
    return [];
  }
  function Eu() {
    return !1;
  }
  t.exports = bu;
})(Eo, Eo.exports);
Eo.exports;
function zs(t) {
  return Kn.c32address(t.version, t.hash160);
}
function Ui(t, e, n) {
  const r = e || 1, o = n || Cu;
  if (nb(t, o))
    throw new Error(`String length exceeds maximum bytes ${o}`);
  return {
    type: ur.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: o
  };
}
function Oi(t) {
  const e = Kn.c32addressDecode(t);
  return {
    type: ur.Address,
    version: e[0],
    hash160: e[1]
  };
}
var L;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(L || (L = {}));
function $p(t) {
  if (t.type === L.PrincipalStandard)
    return zs(t.address);
  if (t.type === L.PrincipalContract)
    return `${zs(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function _p(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return kp(e, n);
  } else
    return Lp(t);
}
function Lp(t) {
  const e = Oi(t);
  return { type: L.PrincipalStandard, address: e };
}
function Hp(t) {
  return { type: L.PrincipalStandard, address: t };
}
function kp(t, e) {
  const n = Oi(t), r = Ui(e);
  return kf(n, r);
}
function kf(t, e) {
  if (mr(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: L.PrincipalContract, address: t, contractName: e };
}
function ds(t, e = !1) {
  switch (t.type) {
    case L.BoolTrue:
      return !0;
    case L.BoolFalse:
      return !1;
    case L.Int:
    case L.UInt:
      return e ? t.value.toString() : t.value;
    case L.Buffer:
      return `0x${ce(t.buffer)}`;
    case L.OptionalNone:
      return null;
    case L.OptionalSome:
      return _n(t.value);
    case L.ResponseErr:
      return _n(t.value);
    case L.ResponseOk:
      return _n(t.value);
    case L.PrincipalStandard:
    case L.PrincipalContract:
      return $p(t);
    case L.List:
      return t.list.map((r) => _n(r));
    case L.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = _n(t.data[r]);
      }), n;
    case L.StringASCII:
      return t.data;
    case L.StringUTF8:
      return t.data;
  }
}
function _n(t) {
  switch (t.type) {
    case L.ResponseErr:
      return { type: Fe(t), value: ds(t, !0), success: !1 };
    case L.ResponseOk:
      return { type: Fe(t), value: ds(t, !0), success: !0 };
    default:
      return { type: Fe(t), value: ds(t, !0) };
  }
}
function Fe(t) {
  switch (t.type) {
    case L.BoolTrue:
    case L.BoolFalse:
      return "bool";
    case L.Int:
      return "int";
    case L.UInt:
      return "uint";
    case L.Buffer:
      return `(buff ${t.buffer.length})`;
    case L.OptionalNone:
      return "(optional none)";
    case L.OptionalSome:
      return `(optional ${Fe(t.value)})`;
    case L.ResponseErr:
      return `(response UnknownType ${Fe(t.value)})`;
    case L.ResponseOk:
      return `(response ${Fe(t.value)} UnknownType)`;
    case L.PrincipalStandard:
    case L.PrincipalContract:
      return "principal";
    case L.List:
      return `(list ${t.list.length} ${t.list.length ? Fe(t.list[0]) : "UnknownType"})`;
    case L.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${Fe(t.data[e])})`).join(" ")})`;
    case L.StringASCII:
      return `(string-ascii ${Kl(t.data).length})`;
    case L.StringUTF8:
      return `(string-utf8 ${mr(t.data).length})`;
  }
}
const Ip = () => ({ type: L.BoolTrue }), Up = () => ({ type: L.BoolFalse }), qa = BigInt("0xffffffffffffffffffffffffffffffff"), Op = BigInt(0), Wa = BigInt("0x7fffffffffffffffffffffffffffffff"), Ja = BigInt("-170141183460469231731687303715884105728"), Cp = (t) => {
  const e = bi(t, !0);
  if (e > Wa)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Wa}`);
  if (e < Ja)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Ja}`);
  return { type: L.Int, value: e };
}, If = (t) => {
  const e = bi(t, !1);
  if (e < Op)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > qa)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${qa}`);
  return { type: L.UInt, value: e };
}, Np = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: L.Buffer, buffer: t };
};
function Pp() {
  return { type: L.OptionalNone };
}
function Dp(t) {
  return { type: L.OptionalSome, value: t };
}
function Tp(t) {
  return { type: L.ResponseErr, value: t };
}
function Fp(t) {
  return { type: L.ResponseOk, value: t };
}
function Mp(t) {
  return { type: L.List, list: t };
}
function Uf(t) {
  for (const e in t)
    if (!rb(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: L.Tuple, data: t };
}
const po = (t) => ({ type: L.StringASCII, data: t }), Rp = (t) => ({ type: L.StringUTF8, data: t });
let Of = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, zp = class extends Of {
  constructor(e) {
    super(e);
  }
};
class ps extends Of {
  constructor(e) {
    super(e);
  }
}
function Cf(t) {
  const e = [];
  return e.push(In(gi(t.version, 1))), e.push(In(t.hash160)), Gn(e);
}
function Xa(t) {
  const e = zl(ce(t.readBytes(1))), n = ce(t.readBytes(20));
  return { type: ur.Address, version: e, hash160: n };
}
function Nf(t) {
  const e = [], n = mr(t.content), r = n.byteLength;
  return e.push(In(gi(r, t.lengthPrefixBytes))), e.push(n), Gn(e);
}
function Ya(t, e, n) {
  e = e || 1;
  const r = zl(ce(t.readBytes(e))), o = Vl(t.readBytes(r));
  return Ui(o, e, 128);
}
function Qt(t, e) {
  return Gn([t, e]);
}
function Gp(t) {
  return new Uint8Array([t.type]);
}
function Vp(t) {
  return t.type === L.OptionalNone ? new Uint8Array([t.type]) : Qt(t.type, Ar(t.value));
}
function Kp(t) {
  const e = new Uint8Array(4);
  return Oo(e, t.buffer.length, 0), Qt(t.type, xi(e, t.buffer));
}
function jp(t) {
  const e = Gl(Bu(t.value, BigInt(Nu)), jl);
  return Qt(t.type, e);
}
function qp(t) {
  const e = Gl(t.value, jl);
  return Qt(t.type, e);
}
function Wp(t) {
  return Qt(t.type, Cf(t.address));
}
function Jp(t) {
  return Qt(t.type, xi(Cf(t.address), Nf(t.contractName)));
}
function Xp(t) {
  return Qt(t.type, Ar(t.value));
}
function Yp(t) {
  const e = [], n = new Uint8Array(4);
  Oo(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const o = Ar(r);
    e.push(o);
  }
  return Qt(t.type, Gn(e));
}
function Zp(t) {
  const e = [], n = new Uint8Array(4);
  Oo(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((o, s) => o.localeCompare(s));
  for (const o of r) {
    const s = Ui(o);
    e.push(Nf(s));
    const i = Ar(t.data[o]);
    e.push(i);
  }
  return Qt(t.type, Gn(e));
}
function Pf(t, e) {
  const n = [], r = e == "ascii" ? Kl(t.data) : mr(t.data), o = new Uint8Array(4);
  return Oo(o, r.length, 0), n.push(o), n.push(r), Qt(t.type, Gn(n));
}
function Qp(t) {
  return Pf(t, "ascii");
}
function tb(t) {
  return Pf(t, "utf8");
}
function Ar(t) {
  switch (t.type) {
    case L.BoolTrue:
    case L.BoolFalse:
      return Gp(t);
    case L.OptionalNone:
    case L.OptionalSome:
      return Vp(t);
    case L.Buffer:
      return Kp(t);
    case L.UInt:
      return qp(t);
    case L.Int:
      return jp(t);
    case L.PrincipalStandard:
      return Wp(t);
    case L.PrincipalContract:
      return Jp(t);
    case L.ResponseOk:
    case L.ResponseErr:
      return Xp(t);
    case L.List:
      return Yp(t);
    case L.Tuple:
      return Zp(t);
    case L.StringASCII:
      return Qp(t);
    case L.StringUTF8:
      return tb(t);
    default:
      throw new zp("Unable to serialize. Invalid Clarity Value.");
  }
}
function eb(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Za = /* @__PURE__ */ new Map();
function Df(t, e) {
  const n = Za.get(t);
  if (n !== void 0)
    return n(e);
  const r = eb(t);
  return Za.set(t, r), Df(t, e);
}
class Qa {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Ou(this.readBytes(4), 0);
  }
  readUInt8() {
    return Uu(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Iu(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = ce(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = ce(n);
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
    if (Df(e, r))
      return r;
    throw n(r);
  }
}
function Ln(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Qa(In(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Qa(t) : e = t;
  switch (e.readUInt8Enum(L, (r) => {
    throw new ps(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case L.Int:
      return Cp(e.readBytes(16));
    case L.UInt:
      return If(e.readBytes(16));
    case L.Buffer:
      const r = e.readUInt32BE();
      return Np(e.readBytes(r));
    case L.BoolTrue:
      return Ip();
    case L.BoolFalse:
      return Up();
    case L.PrincipalStandard:
      const o = Xa(e);
      return Hp(o);
    case L.PrincipalContract:
      const s = Xa(e), i = Ya(e);
      return kf(s, i);
    case L.ResponseOk:
      return Fp(Ln(e));
    case L.ResponseErr:
      return Tp(Ln(e));
    case L.OptionalNone:
      return Pp();
    case L.OptionalSome:
      return Dp(Ln(e));
    case L.List:
      const a = e.readUInt32BE(), c = [];
      for (let w = 0; w < a; w++)
        c.push(Ln(e));
      return Mp(c);
    case L.Tuple:
      const h = e.readUInt32BE(), u = {};
      for (let w = 0; w < h; w++) {
        const E = Ya(e).content;
        if (E === void 0)
          throw new ps('"content" is undefined');
        u[E] = Ln(e);
      }
      return Uf(u);
    case L.StringASCII:
      const l = e.readUInt32BE(), b = Hu(e.readBytes(l));
      return po(b);
    case L.StringUTF8:
      const p = e.readUInt32BE(), g = Vl(e.readBytes(p));
      return Rp(g);
    default:
      throw new ps("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const nb = (t, e) => t ? mr(t).length > e : !1;
function rb(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function Tf(t) {
  const e = Ar(t);
  return `0x${ce(e)}`;
}
function ob(t) {
  return Ln(t);
}
const sb = (t) => {
  try {
    return Kn.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
(function() {
  (function(t) {
    (function(e) {
      var n = typeof globalThis < "u" && globalThis || typeof t < "u" && t || // eslint-disable-next-line no-undef
      typeof xt < "u" && xt || {}, r = {
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
      function o(x) {
        return x && DataView.prototype.isPrototypeOf(x);
      }
      if (r.arrayBuffer)
        var s = [
          "[object Int8Array]",
          "[object Uint8Array]",
          "[object Uint8ClampedArray]",
          "[object Int16Array]",
          "[object Uint16Array]",
          "[object Int32Array]",
          "[object Uint32Array]",
          "[object Float32Array]",
          "[object Float64Array]"
        ], i = ArrayBuffer.isView || function(x) {
          return x && s.indexOf(Object.prototype.toString.call(x)) > -1;
        };
      function a(x) {
        if (typeof x != "string" && (x = String(x)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(x) || x === "")
          throw new TypeError('Invalid character in header field name: "' + x + '"');
        return x.toLowerCase();
      }
      function c(x) {
        return typeof x != "string" && (x = String(x)), x;
      }
      function h(x) {
        var A = {
          next: function() {
            var k = x.shift();
            return { done: k === void 0, value: k };
          }
        };
        return r.iterable && (A[Symbol.iterator] = function() {
          return A;
        }), A;
      }
      function u(x) {
        this.map = {}, x instanceof u ? x.forEach(function(A, k) {
          this.append(k, A);
        }, this) : Array.isArray(x) ? x.forEach(function(A) {
          if (A.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + A.length);
          this.append(A[0], A[1]);
        }, this) : x && Object.getOwnPropertyNames(x).forEach(function(A) {
          this.append(A, x[A]);
        }, this);
      }
      u.prototype.append = function(x, A) {
        x = a(x), A = c(A);
        var k = this.map[x];
        this.map[x] = k ? k + ", " + A : A;
      }, u.prototype.delete = function(x) {
        delete this.map[a(x)];
      }, u.prototype.get = function(x) {
        return x = a(x), this.has(x) ? this.map[x] : null;
      }, u.prototype.has = function(x) {
        return this.map.hasOwnProperty(a(x));
      }, u.prototype.set = function(x, A) {
        this.map[a(x)] = c(A);
      }, u.prototype.forEach = function(x, A) {
        for (var k in this.map)
          this.map.hasOwnProperty(k) && x.call(A, this.map[k], k, this);
      }, u.prototype.keys = function() {
        var x = [];
        return this.forEach(function(A, k) {
          x.push(k);
        }), h(x);
      }, u.prototype.values = function() {
        var x = [];
        return this.forEach(function(A) {
          x.push(A);
        }), h(x);
      }, u.prototype.entries = function() {
        var x = [];
        return this.forEach(function(A, k) {
          x.push([k, A]);
        }), h(x);
      }, r.iterable && (u.prototype[Symbol.iterator] = u.prototype.entries);
      function l(x) {
        if (!x._noBody) {
          if (x.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          x.bodyUsed = !0;
        }
      }
      function b(x) {
        return new Promise(function(A, k) {
          x.onload = function() {
            A(x.result);
          }, x.onerror = function() {
            k(x.error);
          };
        });
      }
      function p(x) {
        var A = new FileReader(), k = b(A);
        return A.readAsArrayBuffer(x), k;
      }
      function g(x) {
        var A = new FileReader(), k = b(A), C = /charset=([A-Za-z0-9_-]+)/.exec(x.type), R = C ? C[1] : "utf-8";
        return A.readAsText(x, R), k;
      }
      function w(x) {
        for (var A = new Uint8Array(x), k = new Array(A.length), C = 0; C < A.length; C++)
          k[C] = String.fromCharCode(A[C]);
        return k.join("");
      }
      function E(x) {
        if (x.slice)
          return x.slice(0);
        var A = new Uint8Array(x.byteLength);
        return A.set(new Uint8Array(x)), A.buffer;
      }
      function $() {
        return this.bodyUsed = !1, this._initBody = function(x) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = x, x ? typeof x == "string" ? this._bodyText = x : r.blob && Blob.prototype.isPrototypeOf(x) ? this._bodyBlob = x : r.formData && FormData.prototype.isPrototypeOf(x) ? this._bodyFormData = x : r.searchParams && URLSearchParams.prototype.isPrototypeOf(x) ? this._bodyText = x.toString() : r.arrayBuffer && r.blob && o(x) ? (this._bodyArrayBuffer = E(x.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(x) || i(x)) ? this._bodyArrayBuffer = E(x) : this._bodyText = x = Object.prototype.toString.call(x) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof x == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(x) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var x = l(this);
          if (x)
            return x;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var x = l(this);
            return x || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
              this._bodyArrayBuffer.buffer.slice(
                this._bodyArrayBuffer.byteOffset,
                this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
              )
            ) : Promise.resolve(this._bodyArrayBuffer));
          } else {
            if (r.blob)
              return this.blob().then(p);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var x = l(this);
          if (x)
            return x;
          if (this._bodyBlob)
            return g(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(w(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(v);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var H = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function y(x) {
        var A = x.toUpperCase();
        return H.indexOf(A) > -1 ? A : x;
      }
      function _(x, A) {
        if (!(this instanceof _))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        A = A || {};
        var k = A.body;
        if (x instanceof _) {
          if (x.bodyUsed)
            throw new TypeError("Already read");
          this.url = x.url, this.credentials = x.credentials, A.headers || (this.headers = new u(x.headers)), this.method = x.method, this.mode = x.mode, this.signal = x.signal, !k && x._bodyInit != null && (k = x._bodyInit, x.bodyUsed = !0);
        } else
          this.url = String(x);
        if (this.credentials = A.credentials || this.credentials || "same-origin", (A.headers || !this.headers) && (this.headers = new u(A.headers)), this.method = y(A.method || this.method || "GET"), this.mode = A.mode || this.mode || null, this.signal = A.signal || this.signal || function() {
          if ("AbortController" in n) {
            var D = new AbortController();
            return D.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && k)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(k), (this.method === "GET" || this.method === "HEAD") && (A.cache === "no-store" || A.cache === "no-cache")) {
          var C = /([?&])_=[^&]*/;
          if (C.test(this.url))
            this.url = this.url.replace(C, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var R = /\?/;
            this.url += (R.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      _.prototype.clone = function() {
        return new _(this, { body: this._bodyInit });
      };
      function v(x) {
        var A = new FormData();
        return x.trim().split("&").forEach(function(k) {
          if (k) {
            var C = k.split("="), R = C.shift().replace(/\+/g, " "), D = C.join("=").replace(/\+/g, " ");
            A.append(decodeURIComponent(R), decodeURIComponent(D));
          }
        }), A;
      }
      function P(x) {
        var A = new u(), k = x.replace(/\r?\n[\t ]+/g, " ");
        return k.split("\r").map(function(C) {
          return C.indexOf(`
`) === 0 ? C.substr(1, C.length) : C;
        }).forEach(function(C) {
          var R = C.split(":"), D = R.shift().trim();
          if (D) {
            var ht = R.join(":").trim();
            try {
              A.append(D, ht);
            } catch (rt) {
              console.warn("Response " + rt.message);
            }
          }
        }), A;
      }
      $.call(_.prototype);
      function M(x, A) {
        if (!(this instanceof M))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (A || (A = {}), this.type = "default", this.status = A.status === void 0 ? 200 : A.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = A.statusText === void 0 ? "" : "" + A.statusText, this.headers = new u(A.headers), this.url = A.url || "", this._initBody(x);
      }
      $.call(M.prototype), M.prototype.clone = function() {
        return new M(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new u(this.headers),
          url: this.url
        });
      }, M.error = function() {
        var x = new M(null, { status: 200, statusText: "" });
        return x.ok = !1, x.status = 0, x.type = "error", x;
      };
      var O = [301, 302, 303, 307, 308];
      M.redirect = function(x, A) {
        if (O.indexOf(A) === -1)
          throw new RangeError("Invalid status code");
        return new M(null, { status: A, headers: { location: x } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(A, k) {
          this.message = A, this.name = k;
          var C = Error(A);
          this.stack = C.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function N(x, A) {
        return new Promise(function(k, C) {
          var R = new _(x, A);
          if (R.signal && R.signal.aborted)
            return C(new e.DOMException("Aborted", "AbortError"));
          var D = new XMLHttpRequest();
          function ht() {
            D.abort();
          }
          D.onload = function() {
            var st = {
              statusText: D.statusText,
              headers: P(D.getAllResponseHeaders() || "")
            };
            R.url.indexOf("file://") === 0 && (D.status < 200 || D.status > 599) ? st.status = 200 : st.status = D.status, st.url = "responseURL" in D ? D.responseURL : st.headers.get("X-Request-URL");
            var G = "response" in D ? D.response : D.responseText;
            setTimeout(function() {
              k(new M(G, st));
            }, 0);
          }, D.onerror = function() {
            setTimeout(function() {
              C(new TypeError("Network request failed"));
            }, 0);
          }, D.ontimeout = function() {
            setTimeout(function() {
              C(new TypeError("Network request timed out"));
            }, 0);
          }, D.onabort = function() {
            setTimeout(function() {
              C(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function rt(st) {
            try {
              return st === "" && n.location.href ? n.location.href : st;
            } catch {
              return st;
            }
          }
          if (D.open(R.method, rt(R.url), !0), R.credentials === "include" ? D.withCredentials = !0 : R.credentials === "omit" && (D.withCredentials = !1), "responseType" in D && (r.blob ? D.responseType = "blob" : r.arrayBuffer && (D.responseType = "arraybuffer")), A && typeof A.headers == "object" && !(A.headers instanceof u || n.Headers && A.headers instanceof n.Headers)) {
            var Ke = [];
            Object.getOwnPropertyNames(A.headers).forEach(function(st) {
              Ke.push(a(st)), D.setRequestHeader(st, c(A.headers[st]));
            }), R.headers.forEach(function(st, G) {
              Ke.indexOf(G) === -1 && D.setRequestHeader(G, st);
            });
          } else
            R.headers.forEach(function(st, G) {
              D.setRequestHeader(G, st);
            });
          R.signal && (R.signal.addEventListener("abort", ht), D.onreadystatechange = function() {
            D.readyState === 4 && R.signal.removeEventListener("abort", ht);
          }), D.send(typeof R._bodyInit > "u" ? null : R._bodyInit);
        });
      }
      return N.polyfill = !0, n.fetch || (n.fetch = N, n.Headers = u, n.Request = _, n.Response = M), e.Headers = u, e.Request = _, e.Response = M, e.fetch = N, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : xt);
})();
const ib = "https://browser.blockstack.org/auth", ab = {
  "@type": "Person",
  "@context": "http://schema.org"
}, Ff = ["store_write"], cb = "blockstack-session", lb = {
  logLevel: "debug"
}, un = {
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
Object.freeze(un);
class qn extends Error {
  constructor(e) {
    super();
    let n = e.message, r = `Error Code: ${e.code}`, o = this.stack;
    if (o)
      r += `Stack Trace:
${o}`;
    else
      try {
        throw new Error();
      } catch (s) {
        o = s.stack;
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
class fb extends qn {
  constructor(e, n = "") {
    super({ code: un.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class tc extends qn {
  constructor(e = "") {
    super({ code: un.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class qr extends qn {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: un.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class ec extends qn {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: un.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Gs extends qn {
  constructor(e) {
    super({ code: un.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class Mf extends qn {
  constructor(e) {
    super({ code: un.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const nc = ["debug", "info", "warn", "error", "none"], Vs = {};
for (let t = 0; t < nc.length; t++) {
  const e = nc[t];
  Vs[e] = t;
}
class Hn {
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
    return Vs[lb.logLevel] <= Vs[e];
  }
}
function hb() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function ub() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function bs(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((o) => parseInt(o, 10)), r = e.split(".").map((o) => parseInt(o, 10));
  for (let o = 0; o < e.length; o++)
    if (o >= t.length && r.push(0), n[o] < r[o])
      return !1;
  return !0;
}
function db() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function pb() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function bb(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function Ci(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let o;
  try {
    if (o = pb(), o) {
      const s = o[t];
      if (s)
        return s;
    }
  } catch (s) {
    Hn.error(`Error getting object '${t}' from global scope '${o}': ${s}`);
  }
  if (e) {
    const s = bb(o, t.toString(), n);
    throw Hn.error(s), new Error(s);
  }
  if (r)
    return {};
}
function gb(t) {
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
  if (Eb(t, Uint8Array))
    return BigInt(`0x${Ut(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function xb(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Ni(t, e = 8) {
  return (typeof t == "bigint" ? t : gb(t)).toString(16).padStart(e * 2, "0");
}
function Rf(t, e = 16) {
  const n = Ni(t, e);
  return _t(n);
}
function wb(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const yb = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ut(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += yb[n];
  return e;
}
function _t(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = xb(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, o = t.slice(r, r + 2), s = Number.parseInt(o, 16);
    if (Number.isNaN(s) || s < 0)
      throw new Error("Invalid byte sequence");
    e[n] = s;
  }
  return e;
}
function vr(t) {
  return new TextEncoder().encode(t);
}
function zf(t) {
  return new TextDecoder().decode(t);
}
function mb(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Sb(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function rc(t) {
  if (t.some(Sb))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function le(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, o) => r + o.length, 0), n = new Uint8Array(e);
  for (let r = 0, o = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, o), o += s.length;
  }
  return n;
}
function Wn(t) {
  return le(...t.map((e) => typeof e == "number" ? rc([e]) : e instanceof Array ? rc(e) : e));
}
function Eb(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const Ab = "https://api.mainnet.hiro.so", vb = "https://api.testnet.hiro.so", Bb = "http://localhost:3999", $b = "https://hub.blockstack.org";
function _b(t) {
  const e = typeof t == "string" ? _t(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Do(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const Lb = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Hb(t, e) {
  const n = {};
  return Object.assign(n, Lb, e), await fetch(t, n);
}
function kb(t) {
  let e = Hb, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Ib(...t) {
  const { fetchLib: e, middlewares: n } = kb(t);
  return async (o, s) => {
    let i = { url: o, init: s ?? {} };
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
class Gf {
  constructor(e = Ff.slice(), n = ((a) => (a = Ci("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", o = "/manifest.json", s = void 0, i = ib) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = o, this.coreNode = s, this.authenticatorURL = i;
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
function Ub(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Vf(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Ob(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ks(t.outputLen), Ks(t.blockLen);
}
function Cb(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Nb(t, e) {
  Vf(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const tn = {
  number: Ks,
  bool: Ub,
  bytes: Vf,
  hash: Ob,
  exists: Cb,
  output: Nb
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const gs = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Kt = (t, e) => t << 32 - e | t >>> e, Pb = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Pb)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Db(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Pi(t) {
  if (typeof t == "string" && (t = Db(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Kf = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function dn(t) {
  const e = (r) => t().update(Pi(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let jf = class extends Kf {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, tn.hash(e);
    const r = Pi(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const o = this.blockLen, s = new Uint8Array(o);
    s.set(r.length > o ? e.create().update(r).digest() : r);
    for (let i = 0; i < s.length; i++)
      s[i] ^= 54;
    this.iHash.update(s), this.oHash = e.create();
    for (let i = 0; i < s.length; i++)
      s[i] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(e) {
    return tn.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    tn.exists(this), tn.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: o, destroyed: s, blockLen: i, outputLen: a } = this;
    return e = e, e.finished = o, e.destroyed = s, e.blockLen = i, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const To = (t, e, n) => new jf(t, e).update(n).digest();
To.create = (t, e) => new jf(t, e);
function Tb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, h = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + h, a, r);
}
let Di = class extends Kf {
  constructor(e, n, r, o) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = gs(this.buffer);
  }
  update(e) {
    tn.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    e = Pi(e);
    const s = e.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(o - this.pos, s - i);
      if (a === o) {
        const c = gs(e);
        for (; o <= s - i; i += o)
          this.process(c, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    tn.exists(this), tn.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let l = i; l < o; l++)
      n[l] = 0;
    Tb(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = gs(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const h = c / 4, u = this.get();
    if (h > u.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < h; l++)
      a.setUint32(4 * l, u[l], s);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: a } = this;
    return e.length = o, e.pos = a, e.finished = s, e.destroyed = i, o % n && e.buffer.set(r), e;
  }
};
const Fb = (t, e, n) => t & e ^ ~t & n, Mb = (t, e, n) => t & e ^ t & n ^ e & n, Rb = new Uint32Array([
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
]), ye = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), me = new Uint32Array(64);
let qf = class extends Di {
  constructor() {
    super(64, 32, 8, !1), this.A = ye[0] | 0, this.B = ye[1] | 0, this.C = ye[2] | 0, this.D = ye[3] | 0, this.E = ye[4] | 0, this.F = ye[5] | 0, this.G = ye[6] | 0, this.H = ye[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: o, E: s, F: i, G: a, H: c } = this;
    return [e, n, r, o, s, i, a, c];
  }
  // prettier-ignore
  set(e, n, r, o, s, i, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      me[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = me[l - 15], p = me[l - 2], g = Kt(b, 7) ^ Kt(b, 18) ^ b >>> 3, w = Kt(p, 17) ^ Kt(p, 19) ^ p >>> 10;
      me[l] = w + me[l - 7] + g + me[l - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: h, H: u } = this;
    for (let l = 0; l < 64; l++) {
      const b = Kt(a, 6) ^ Kt(a, 11) ^ Kt(a, 25), p = u + b + Fb(a, c, h) + Rb[l] + me[l] | 0, w = (Kt(r, 2) ^ Kt(r, 13) ^ Kt(r, 22)) + Mb(r, o, s) | 0;
      u = h, h = c, c = a, a = i + p | 0, i = s, s = o, o = r, r = p + w | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, h = h + this.G | 0, u = u + this.H | 0, this.set(r, o, s, i, a, c, h, u);
  }
  roundClean() {
    me.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, zb = class extends qf {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Dn = dn(() => new qf());
dn(() => new zb());
var Br = {};
Br.byteLength = qb;
var Gb = Br.toByteArray = Jb, Vb = Br.fromByteArray = Zb, Jt = [], It = [], Kb = typeof Uint8Array < "u" ? Uint8Array : Array, xs = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Bn = 0, jb = xs.length; Bn < jb; ++Bn)
  Jt[Bn] = xs[Bn], It[xs.charCodeAt(Bn)] = Bn;
It[45] = 62;
It[95] = 63;
function Wf(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function qb(t) {
  var e = Wf(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Wb(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Jb(t) {
  var e, n = Wf(t), r = n[0], o = n[1], s = new Kb(Wb(t, r, o)), i = 0, a = o > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = It[t.charCodeAt(c)] << 18 | It[t.charCodeAt(c + 1)] << 12 | It[t.charCodeAt(c + 2)] << 6 | It[t.charCodeAt(c + 3)], s[i++] = e >> 16 & 255, s[i++] = e >> 8 & 255, s[i++] = e & 255;
  return o === 2 && (e = It[t.charCodeAt(c)] << 2 | It[t.charCodeAt(c + 1)] >> 4, s[i++] = e & 255), o === 1 && (e = It[t.charCodeAt(c)] << 10 | It[t.charCodeAt(c + 1)] << 4 | It[t.charCodeAt(c + 2)] >> 2, s[i++] = e >> 8 & 255, s[i++] = e & 255), s;
}
function Xb(t) {
  return Jt[t >> 18 & 63] + Jt[t >> 12 & 63] + Jt[t >> 6 & 63] + Jt[t & 63];
}
function Yb(t, e, n) {
  for (var r, o = [], s = e; s < n; s += 3)
    r = (t[s] << 16 & 16711680) + (t[s + 1] << 8 & 65280) + (t[s + 2] & 255), o.push(Xb(r));
  return o.join("");
}
function Zb(t) {
  for (var e, n = t.length, r = n % 3, o = [], s = 16383, i = 0, a = n - r; i < a; i += s)
    o.push(Yb(t, i, i + s > a ? a : i + s));
  return r === 1 ? (e = t[n - 1], o.push(
    Jt[e >> 2] + Jt[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], o.push(
    Jt[e >> 10] + Jt[e >> 4 & 63] + Jt[e << 2 & 63] + "="
  )), o.join("");
}
function Qb() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const t1 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function e1() {
  if (Qb())
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
    throw new Error(t1);
  }
}
class n1 {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, o) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const s = this.createCipher(e, n, r), i = new Uint8Array(le(s.update(o), s.final()));
    return Promise.resolve(i);
  }
  async decrypt(e, n, r, o) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const s = this.createDecipher(e, n, r), i = new Uint8Array(le(s.update(o), s.final()));
    return Promise.resolve(i);
  }
}
class r1 {
  constructor(e) {
    this.subtleCrypto = e;
  }
  async encrypt(e, n, r, o) {
    let s, i;
    if (e === "aes-128-cbc")
      s = "AES-CBC", i = 128;
    else if (e === "aes-256-cbc")
      s = "AES-CBC", i = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: s, length: i }, !1, ["encrypt"]), c = await this.subtleCrypto.encrypt({ name: s, iv: r }, a, o);
    return new Uint8Array(c);
  }
  async decrypt(e, n, r, o) {
    let s, i;
    if (e === "aes-128-cbc")
      s = "AES-CBC", i = 128;
    else if (e === "aes-256-cbc")
      s = "AES-CBC", i = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: s, length: i }, !1, ["decrypt"]), c = await this.subtleCrypto.decrypt({ name: s, iv: r }, a, o);
    return new Uint8Array(c);
  }
}
async function Jf() {
  const t = await e1();
  return t.name === "subtleCrypto" ? new r1(t.lib) : new n1(t.lib.createCipheriv, t.lib.createDecipheriv);
}
const o1 = _f, s1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var i1 = o1(s1);
const a1 = /* @__PURE__ */ Vd(i1), c1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Xf = Uint8Array.from({ length: 16 }, (t, e) => e), l1 = Xf.map((t) => (9 * t + 5) % 16);
let Ti = [Xf], Fi = [l1];
for (let t = 0; t < 4; t++)
  for (let e of [Ti, Fi])
    e.push(e[t].map((n) => c1[n]));
const Yf = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), f1 = Ti.map((t, e) => t.map((n) => Yf[e][n])), h1 = Fi.map((t, e) => t.map((n) => Yf[e][n])), u1 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), d1 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Wr = (t, e) => t << e | t >>> 32 - e;
function oc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Jr = new Uint32Array(16);
let p1 = class extends Di {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: o, h4: s } = this;
    return [e, n, r, o, s];
  }
  set(e, n, r, o, s) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = o | 0, this.h4 = s | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Jr[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, o = r, s = this.h1 | 0, i = s, a = this.h2 | 0, c = a, h = this.h3 | 0, u = h, l = this.h4 | 0, b = l;
    for (let p = 0; p < 5; p++) {
      const g = 4 - p, w = u1[p], E = d1[p], $ = Ti[p], H = Fi[p], y = f1[p], _ = h1[p];
      for (let v = 0; v < 16; v++) {
        const P = Wr(r + oc(p, s, a, h) + Jr[$[v]] + w, y[v]) + l | 0;
        r = l, l = h, h = Wr(a, 10) | 0, a = s, s = P;
      }
      for (let v = 0; v < 16; v++) {
        const P = Wr(o + oc(g, i, c, u) + Jr[H[v]] + E, _[v]) + b | 0;
        o = b, b = u, u = Wr(c, 10) | 0, c = i, i = P;
      }
    }
    this.set(this.h1 + a + u | 0, this.h2 + h + b | 0, this.h3 + l + o | 0, this.h4 + r + i | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Jr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const b1 = dn(() => new p1());
function g1(t) {
  return b1(t);
}
const Xr = BigInt(2 ** 32 - 1), js = BigInt(32);
function Zf(t, e = !1) {
  return e ? { h: Number(t & Xr), l: Number(t >> js & Xr) } : { h: Number(t >> js & Xr) | 0, l: Number(t & Xr) | 0 };
}
function x1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let o = 0; o < t.length; o++) {
    const { h: s, l: i } = Zf(t[o], e);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const w1 = (t, e) => BigInt(t >>> 0) << js | BigInt(e >>> 0), y1 = (t, e, n) => t >>> n, m1 = (t, e, n) => t << 32 - n | e >>> n, S1 = (t, e, n) => t >>> n | e << 32 - n, E1 = (t, e, n) => t << 32 - n | e >>> n, A1 = (t, e, n) => t << 64 - n | e >>> n - 32, v1 = (t, e, n) => t >>> n - 32 | e << 64 - n, B1 = (t, e) => e, $1 = (t, e) => t, _1 = (t, e, n) => t << n | e >>> 32 - n, L1 = (t, e, n) => e << n | t >>> 32 - n, H1 = (t, e, n) => e << n - 32 | t >>> 64 - n, k1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function I1(t, e, n, r) {
  const o = (e >>> 0) + (r >>> 0);
  return { h: t + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const U1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), O1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, C1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), N1 = (t, e, n, r, o) => e + n + r + o + (t / 2 ** 32 | 0) | 0, P1 = (t, e, n, r, o) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), D1 = (t, e, n, r, o, s) => e + n + r + o + s + (t / 2 ** 32 | 0) | 0, K = {
  fromBig: Zf,
  split: x1,
  toBig: w1,
  shrSH: y1,
  shrSL: m1,
  rotrSH: S1,
  rotrSL: E1,
  rotrBH: A1,
  rotrBL: v1,
  rotr32H: B1,
  rotr32L: $1,
  rotlSH: _1,
  rotlSL: L1,
  rotlBH: H1,
  rotlBL: k1,
  add: I1,
  add3L: U1,
  add3H: O1,
  add4L: C1,
  add4H: N1,
  add5H: D1,
  add5L: P1
}, [T1, F1] = K.split([
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
].map((t) => BigInt(t))), Se = new Uint32Array(80), Ee = new Uint32Array(80);
let Fo = class extends Di {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: a, Dl: c, Eh: h, El: u, Fh: l, Fl: b, Gh: p, Gl: g, Hh: w, Hl: E } = this;
    return [e, n, r, o, s, i, a, c, h, u, l, b, p, g, w, E];
  }
  // prettier-ignore
  set(e, n, r, o, s, i, a, c, h, u, l, b, p, g, w, E) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = h | 0, this.El = u | 0, this.Fh = l | 0, this.Fl = b | 0, this.Gh = p | 0, this.Gl = g | 0, this.Hh = w | 0, this.Hl = E | 0;
  }
  process(e, n) {
    for (let y = 0; y < 16; y++, n += 4)
      Se[y] = e.getUint32(n), Ee[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const _ = Se[y - 15] | 0, v = Ee[y - 15] | 0, P = K.rotrSH(_, v, 1) ^ K.rotrSH(_, v, 8) ^ K.shrSH(_, v, 7), M = K.rotrSL(_, v, 1) ^ K.rotrSL(_, v, 8) ^ K.shrSL(_, v, 7), O = Se[y - 2] | 0, N = Ee[y - 2] | 0, x = K.rotrSH(O, N, 19) ^ K.rotrBH(O, N, 61) ^ K.shrSH(O, N, 6), A = K.rotrSL(O, N, 19) ^ K.rotrBL(O, N, 61) ^ K.shrSL(O, N, 6), k = K.add4L(M, A, Ee[y - 7], Ee[y - 16]), C = K.add4H(k, P, x, Se[y - 7], Se[y - 16]);
      Se[y] = C | 0, Ee[y] = k | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: a, Cl: c, Dh: h, Dl: u, Eh: l, El: b, Fh: p, Fl: g, Gh: w, Gl: E, Hh: $, Hl: H } = this;
    for (let y = 0; y < 80; y++) {
      const _ = K.rotrSH(l, b, 14) ^ K.rotrSH(l, b, 18) ^ K.rotrBH(l, b, 41), v = K.rotrSL(l, b, 14) ^ K.rotrSL(l, b, 18) ^ K.rotrBL(l, b, 41), P = l & p ^ ~l & w, M = b & g ^ ~b & E, O = K.add5L(H, v, M, F1[y], Ee[y]), N = K.add5H(O, $, _, P, T1[y], Se[y]), x = O | 0, A = K.rotrSH(r, o, 28) ^ K.rotrBH(r, o, 34) ^ K.rotrBH(r, o, 39), k = K.rotrSL(r, o, 28) ^ K.rotrBL(r, o, 34) ^ K.rotrBL(r, o, 39), C = r & s ^ r & a ^ s & a, R = o & i ^ o & c ^ i & c;
      $ = w | 0, H = E | 0, w = p | 0, E = g | 0, p = l | 0, g = b | 0, { h: l, l: b } = K.add(h | 0, u | 0, N | 0, x | 0), h = a | 0, u = c | 0, a = s | 0, c = i | 0, s = r | 0, i = o | 0;
      const D = K.add3L(x, k, R);
      r = K.add3H(D, N, A, C), o = D | 0;
    }
    ({ h: r, l: o } = K.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = K.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: a, l: c } = K.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h, l: u } = K.add(this.Dh | 0, this.Dl | 0, h | 0, u | 0), { h: l, l: b } = K.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h: p, l: g } = K.add(this.Fh | 0, this.Fl | 0, p | 0, g | 0), { h: w, l: E } = K.add(this.Gh | 0, this.Gl | 0, w | 0, E | 0), { h: $, l: H } = K.add(this.Hh | 0, this.Hl | 0, $ | 0, H | 0), this.set(r, o, s, i, a, c, h, u, l, b, p, g, w, E, $, H);
  }
  roundClean() {
    Se.fill(0), Ee.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, M1 = class extends Fo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, R1 = class extends Fo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, z1 = class extends Fo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const G1 = dn(() => new Fo());
dn(() => new M1());
dn(() => new R1());
dn(() => new z1());
function Qf(t) {
  return Dn(t);
}
function V1(t) {
  return G1(t);
}
const K1 = 0;
ct.hmacSha256Sync = (t, ...e) => {
  const n = To.create(Dn, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function j1() {
  return Ut(ct.randomPrivateKey());
}
function q1(t) {
  const e = Dn(Dn(t));
  return a1.encode(le(t, e).slice(0, t.length + 4));
}
function W1(t, e) {
  return q1(le(new Uint8Array([t]), e.slice(0, 20)));
}
function th(t, e = K1) {
  const n = typeof t == "string" ? _t(t) : t, r = g1(Qf(n));
  return W1(e, r);
}
function eh(t) {
  const e = _b(t);
  return Ut(vi(e.slice(0, 32), !0));
}
ct.hmacSha256Sync = (t, ...e) => {
  const n = To.create(Dn, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Ao;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Ao || (Ao = {}));
async function J1(t, e, n) {
  return await (await Jf()).encrypt("aes-256-cbc", e, t, n);
}
async function X1(t, e, n) {
  return await (await Jf()).decrypt("aes-256-cbc", e, t, n);
}
function nh(t, e) {
  return To(Dn, t, e);
}
function Y1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function rh(t) {
  const e = V1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function Z1(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function Q1(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Ao.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Ao.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !Z1(t))
    return e;
  try {
    return tt.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function tg(t, e, n, r) {
  const o = Q1(t);
  if (!o.result)
    throw o;
  const s = ct.randomPrivateKey(), i = vi(s, !0);
  let a = Bi(s, t, !0);
  a = a.slice(1);
  const c = rh(a), h = ct.randomBytes(16), u = await J1(h, c.encryptionKey, e), l = le(h, i, u), b = nh(c.hmacKey, l);
  let p;
  if (!r || r === "hex")
    p = Ut(u);
  else if (r === "base64")
    p = Vb(u);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const g = {
    iv: Ut(h),
    ephemeralPK: Ut(i),
    cipherText: p,
    mac: Ut(b),
    wasString: n
  };
  return r && r !== "hex" && (g.cipherTextEncoding = r), g;
}
async function oh(t, e) {
  if (!e.ephemeralPK)
    throw new ec("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = Bi(t, n, !0);
  r = r.slice(1);
  const o = rh(r), s = _t(e.iv);
  let i;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    i = _t(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    i = Gb(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = le(s, _t(n), i), c = nh(o.hmacKey, a), h = _t(e.mac);
  if (!Y1(h, c))
    throw new ec("Decryption failed: failure in MAC check");
  const u = await X1(s, o.encryptionKey, i);
  return e.wasString ? zf(u) : u;
}
function eg(t, e) {
  const n = typeof e == "string" ? vr(e) : e, r = eh(t), o = Qf(n), s = lf(o, t);
  return {
    signature: Ut(s),
    publicKey: r
  };
}
async function ng(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = eh(n.privateKey);
  }
  const o = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", s = typeof t == "string" ? vr(t) : t, i = await tg(n.publicKey, s, o, n.cipherTextEncoding);
  let a = JSON.stringify(i);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = eg(r, a), h = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(h);
  }
  return a;
}
function rg(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return oh(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var wt = {}, Tn = {}, gt = {};
Object.defineProperty(gt, "__esModule", { value: !0 });
gt.decode = gt.encode = gt.unescape = gt.escape = gt.pad = void 0;
const sh = Br;
function Mi(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
gt.pad = Mi;
function ih(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
gt.escape = ih;
function ah(t) {
  return Mi(t).replace(/-/g, "+").replace(/_/g, "/");
}
gt.unescape = ah;
function og(t) {
  return ih((0, sh.fromByteArray)(new TextEncoder().encode(t)));
}
gt.encode = og;
function sg(t) {
  return new TextDecoder().decode((0, sh.toByteArray)(Mi(ah(t))));
}
gt.decode = sg;
var Mo = {}, Ro = {};
let Ri = class extends ki {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, gf(e);
    const r = jn(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const o = this.blockLen, s = new Uint8Array(o);
    s.set(r.length > o ? e.create().update(r).digest() : r);
    for (let i = 0; i < s.length; i++)
      s[i] ^= 54;
    this.iHash.update(s), this.oHash = e.create();
    for (let i = 0; i < s.length; i++)
      s[i] ^= 106;
    this.oHash.update(s), pr(s);
  }
  update(e) {
    return dr(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    dr(this), Ve(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: o, destroyed: s, blockLen: i, outputLen: a } = this;
    return e = e, e.finished = o, e.destroyed = s, e.blockLen = i, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const ch = (t, e, n) => new Ri(t, e).update(n).digest();
ch.create = (t, e) => new Ri(t, e);
const ig = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HMAC: Ri,
  hmac: ch
}, Symbol.toStringTag, { value: "Module" })), ag = /* @__PURE__ */ Sr(ig), cg = /* @__PURE__ */ Sr(Gd);
var Fn = {};
Object.defineProperty(Fn, "__esModule", { value: !0 });
Fn.joseToDer = Fn.derToJose = void 0;
const lh = Br, fh = gt;
function ws(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const lg = {
  ES256: ws(256),
  ES384: ws(384),
  ES512: ws(521)
};
function hh(t) {
  const e = lg[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const vo = 128, uh = 0, fg = 32, hg = 16, ug = 2, dh = hg | fg | uh << 6, Bo = ug | uh << 6;
function ph(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, lh.toByteArray)((0, fh.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function dg(t, e) {
  const n = ph(t), r = hh(e), o = r + 1, s = n.length;
  let i = 0;
  if (n[i++] !== dh)
    throw new Error('Could not find expected "seq"');
  let a = n[i++];
  if (a === (vo | 1) && (a = n[i++]), s - i < a)
    throw new Error(`"seq" specified length of "${a}", only "${s - i}" remaining`);
  if (n[i++] !== Bo)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[i++];
  if (s - i - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${s - i - 2}" available`);
  if (o < c)
    throw new Error(`"r" specified length of "${c}", max of "${o}" is acceptable`);
  const h = i;
  if (i += c, n[i++] !== Bo)
    throw new Error('Could not find expected "int" for "s"');
  const u = n[i++];
  if (s - i !== u)
    throw new Error(`"s" specified length of "${u}", expected "${s - i}"`);
  if (o < u)
    throw new Error(`"s" specified length of "${u}", max of "${o}" is acceptable`);
  const l = i;
  if (i += u, i !== s)
    throw new Error(`Expected to consume entire array, but "${s - i}" bytes remain`);
  const b = r - c, p = r - u, g = new Uint8Array(b + c + p + u);
  for (i = 0; i < b; ++i)
    g[i] = 0;
  g.set(n.subarray(h + Math.max(-b, 0), h + c), i), i = r;
  for (const w = i; i < w + p; ++i)
    g[i] = 0;
  return g.set(n.subarray(l + Math.max(-p, 0), l + u), i), (0, fh.escape)((0, lh.fromByteArray)(g));
}
Fn.derToJose = dg;
function sc(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= vo && --r, r;
}
function pg(t, e) {
  t = ph(t);
  const n = hh(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const o = sc(t, 0, n), s = sc(t, n, t.length), i = n - o, a = n - s, c = 2 + i + 1 + 1 + a, h = c < vo, u = new Uint8Array((h ? 2 : 3) + c);
  let l = 0;
  return u[l++] = dh, h ? u[l++] = c : (u[l++] = vo | 1, u[l++] = c & 255), u[l++] = Bo, u[l++] = i, o < 0 ? (u[l++] = 0, u.set(t.subarray(0, n), l), l += n) : (u.set(t.subarray(o, n), l), l += n - o), u[l++] = Bo, u[l++] = a, s < 0 ? (u[l++] = 0, u.set(t.subarray(n), l)) : u.set(t.subarray(n + s), l), u;
}
Fn.joseToDer = pg;
var fe = {};
Object.defineProperty(fe, "__esModule", { value: !0 });
fe.InvalidTokenError = fe.MissingParametersError = void 0;
class bg extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
fe.MissingParametersError = bg;
class gg extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
fe.InvalidTokenError = gg;
Object.defineProperty(Ro, "__esModule", { value: !0 });
Ro.SECP256K1Client = void 0;
const xg = ag, wg = Po, bo = cg, ic = Fn, ac = fe, cc = Er;
bo.utils.hmacSha256Sync = (t, ...e) => {
  const n = xg.hmac.create(wg.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class bh {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, cc.bytesToHex)(bo.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new ac.MissingParametersError("a signing input hash and private key are all required");
    const o = bo.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, cc.bytesToHex)(o);
    if (r === "jose")
      return (0, ic.derToJose)(o, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, ic.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new ac.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return bo.verify(n, e, r, { strict: !1 });
  }
}
Ro.SECP256K1Client = bh;
bh.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Ro;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(Mo);
var cn = {};
const yg = /* @__PURE__ */ Sr(Ql);
var mg = xt && xt.__awaiter || function(t, e, n, r) {
  function o(s) {
    return s instanceof n ? s : new n(function(i) {
      i(s);
    });
  }
  return new (n || (n = Promise))(function(s, i) {
    function a(u) {
      try {
        h(r.next(u));
      } catch (l) {
        i(l);
      }
    }
    function c(u) {
      try {
        h(r.throw(u));
      } catch (l) {
        i(l);
      }
    }
    function h(u) {
      u.done ? s(u.value) : o(u.value).then(a, c);
    }
    h((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(cn, "__esModule", { value: !0 });
cn.hashSha256Async = cn.hashSha256 = void 0;
const Sg = Po;
function gh(t) {
  return (0, Sg.sha256)(t);
}
cn.hashSha256 = gh;
function Eg(t) {
  return mg(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = yg;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(gh(t));
    }
  });
}
cn.hashSha256Async = Eg;
var Ag = xt && xt.__awaiter || function(t, e, n, r) {
  function o(s) {
    return s instanceof n ? s : new n(function(i) {
      i(s);
    });
  }
  return new (n || (n = Promise))(function(s, i) {
    function a(u) {
      try {
        h(r.next(u));
      } catch (l) {
        i(l);
      }
    }
    function c(u) {
      try {
        h(r.throw(u));
      } catch (l) {
        i(l);
      }
    }
    function h(u) {
      u.done ? s(u.value) : o(u.value).then(a, c);
    }
    h((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Tn, "__esModule", { value: !0 });
Tn.TokenSigner = Tn.createUnsecuredToken = void 0;
const qs = gt, lc = Mo, vg = fe, fc = cn;
function Ws(t, e) {
  const n = [], r = qs.encode(JSON.stringify(e));
  n.push(r);
  const o = qs.encode(JSON.stringify(t));
  return n.push(o), n.join(".");
}
function Bg(t) {
  return Ws(t, { typ: "JWT", alg: "none" }) + ".";
}
Tn.createUnsecuredToken = Bg;
class $g {
  constructor(e, n) {
    if (!(e && n))
      throw new vg.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !lc.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = lc.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const o = this.header(r), s = Ws(e, o), i = (0, fc.hashSha256)(s);
    return this.createWithSignedHash(e, n, o, s, i);
  }
  signAsync(e, n = !1, r = {}) {
    return Ag(this, void 0, void 0, function* () {
      const o = this.header(r), s = Ws(e, o), i = yield (0, fc.hashSha256Async)(s);
      return this.createWithSignedHash(e, n, o, s, i);
    });
  }
  createWithSignedHash(e, n, r, o, s) {
    const i = this.cryptoClient.signHash(s, this.rawPrivateKey);
    return n ? {
      header: [qs.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [i]
    } : [o, i].join(".");
  }
}
Tn.TokenSigner = $g;
var zo = {};
Object.defineProperty(zo, "__esModule", { value: !0 });
zo.TokenVerifier = void 0;
const _g = gt, hc = Mo, Lg = fe, Yr = cn;
class Hg {
  constructor(e, n) {
    if (!(e && n))
      throw new Lg.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !hc.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = hc.cryptoClients[e], this.rawPublicKey = n;
  }
  verify(e) {
    return typeof e == "string" ? this.verifyCompact(e, !1) : typeof e == "object" ? this.verifyExpanded(e, !1) : !1;
  }
  verifyAsync(e) {
    return typeof e == "string" ? this.verifyCompact(e, !0) : typeof e == "object" ? this.verifyExpanded(e, !0) : Promise.resolve(!1);
  }
  verifyCompact(e, n) {
    const r = e.split("."), o = r[0] + "." + r[1], s = (i) => {
      const a = this.cryptoClient.loadSignature(r[2]);
      return this.cryptoClient.verifyHash(i, a, this.rawPublicKey);
    };
    if (n)
      return (0, Yr.hashSha256Async)(o).then((i) => s(i));
    {
      const i = (0, Yr.hashSha256)(o);
      return s(i);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), _g.encode(e.payload)].join(".");
    let o = !0;
    const s = (i) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(i, c, this.rawPublicKey) || (o = !1);
    }), o);
    if (n)
      return (0, Yr.hashSha256Async)(r).then((i) => s(i));
    {
      const i = (0, Yr.hashSha256)(r);
      return s(i);
    }
  }
}
zo.TokenVerifier = Hg;
var Go = {};
Object.defineProperty(Go, "__esModule", { value: !0 });
Go.decodeToken = void 0;
const Zr = gt;
function kg(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Zr.decode(e[0])), r = JSON.parse(Zr.decode(e[1])), o = e[2];
    return {
      header: n,
      payload: r,
      signature: o
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Zr.decode(e));
    const n = [];
    return t.header.map((r) => {
      const o = JSON.parse(Zr.decode(r));
      n.push(o);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
Go.decodeToken = kg;
(function(t) {
  var e = xt && xt.__createBinding || (Object.create ? function(r, o, s, i) {
    i === void 0 && (i = s);
    var a = Object.getOwnPropertyDescriptor(o, s);
    (!a || ("get" in a ? !o.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return o[s];
    } }), Object.defineProperty(r, i, a);
  } : function(r, o, s, i) {
    i === void 0 && (i = s), r[i] = o[s];
  }), n = xt && xt.__exportStar || function(r, o) {
    for (var s in r) s !== "default" && !Object.prototype.hasOwnProperty.call(o, s) && e(o, r, s);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Tn, t), n(zo, t), n(Go, t), n(fe, t), n(Mo, t);
})(wt);
function Ig(t) {
  return `did:btc-addr:${t}`;
}
function Ug(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new tc("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new tc('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function xh(t) {
  if (t)
    return Ug(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const Og = "1.4.0";
function Cg() {
  return j1();
}
function Ng(t, e, n, r = Ff.slice(), o, s = hb().getTime(), i = {}) {
  const a = (p) => {
    const g = Ci("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${p}=undefined])`
    });
    return g == null ? void 0 : g.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), o || (o = a("appDomain"));
  const c = Object.assign({}, i, {
    jti: db(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(s / 1e3),
    iss: null,
    public_keys: [],
    domain_name: o,
    manifest_uri: n,
    redirect_uri: e,
    version: Og,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), h = wt.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [h];
  const u = th(h);
  return c.iss = Ig(u), new wt.TokenSigner("ES256k", t).sign(c);
}
async function uc(t, e) {
  const n = zf(_t(e)), r = JSON.parse(n), o = await oh(t, r);
  if (typeof o != "string")
    throw new Error("Unable to correctly decrypt private key");
  return o;
}
function Pg(t) {
  const e = wt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new wt.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function Dg(t) {
  const e = wt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = xh(e.iss);
  if (n.length === 1) {
    if (th(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function Tg(t) {
  const e = wt.decodeToken(t).payload;
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
function Fg(t) {
  const e = wt.decodeToken(t).payload;
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
function Mg(t) {
  const e = [
    Fg(t),
    Tg(t),
    Pg(t),
    Dg(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const dc = "1.0.0";
class Ge {
  constructor(e) {
    this.version = dc, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== dc)
      throw new Gs(`JSON data version ${e.version} not supported by SessionData`);
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
class wh {
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
class pc extends wh {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Ge({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new Mf("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Ge({})), !0;
  }
}
class bc extends wh {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = cb, !localStorage.getItem(this.key)) {
      const r = new Ge({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new Mf("No session data was found in localStorage");
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
var br;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(br || (br = {}));
var $o;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})($o || ($o = {}));
br.Mainnet;
var ie;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ie || (ie = {}));
var Xt;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Xt || (Xt = {}));
ie.Mainnet;
const yh = {
  chainId: br.Mainnet,
  transactionVersion: ie.Mainnet,
  peerNetworkId: $o.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Xt.MainnetSingleSig,
    multiSig: Xt.MainnetMultiSig
  },
  client: { baseUrl: Ab }
}, Js = {
  chainId: br.Testnet,
  transactionVersion: ie.Testnet,
  peerNetworkId: $o.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Xt.TestnetSingleSig,
    multiSig: Xt.TestnetMultiSig
  },
  client: { baseUrl: vb }
}, go = {
  ...Js,
  addressVersion: { ...Js.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Bb }
}, Rg = {
  ...go,
  addressVersion: { ...go.addressVersion },
  client: { ...go.client }
};
function zg(t) {
  switch (t) {
    case "mainnet":
      return yh;
    case "testnet":
      return Js;
    case "devnet":
      return go;
    case "mocknet":
      return Rg;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function mh(t) {
  return typeof t == "string" ? zg(t) : t;
}
var gc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(gc || (gc = {}));
var xc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(xc || (xc = {}));
var Tt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Tt || (Tt = {}));
const ys = ["onChainOnly", "offChainOnly", "any"];
ys[0] + "", Tt.OnChainOnly, ys[1] + "", Tt.OffChainOnly, ys[2] + "", Tt.Any, Tt.OnChainOnly + "", Tt.OnChainOnly, Tt.OffChainOnly + "", Tt.OffChainOnly, Tt.Any + "", Tt.Any;
var wc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(wc || (wc = {}));
var yc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(yc || (yc = {}));
var mc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(mc || (mc = {}));
var se;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(se || (se = {}));
var Sc;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Sc || (Sc = {}));
var Ec;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ec || (Ec = {}));
var Ac;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Ac || (Ac = {}));
var vc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(vc || (vc = {}));
var Bc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Bc || (Bc = {}));
var $c;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})($c || ($c = {}));
var _c;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(_c || (_c = {}));
var Lc;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Lc || (Lc = {}));
var Hc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Hc || (Hc = {}));
function Xs(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Gg(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Sh(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Vg(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Xs(t.outputLen), Xs(t.blockLen);
}
function Kg(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function jg(t, e) {
  Sh(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const en = {
  number: Xs,
  bool: Gg,
  bytes: Sh,
  hash: Vg,
  exists: Kg,
  output: jg
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ms = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), jt = (t, e) => t << 32 - e | t >>> e, qg = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!qg)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Wg(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function zi(t) {
  if (typeof t == "string" && (t = Wg(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Eh = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function pn(t) {
  const e = (r) => t().update(zi(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
class Ah extends Eh {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, en.hash(e);
    const r = zi(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const o = this.blockLen, s = new Uint8Array(o);
    s.set(r.length > o ? e.create().update(r).digest() : r);
    for (let i = 0; i < s.length; i++)
      s[i] ^= 54;
    this.iHash.update(s), this.oHash = e.create();
    for (let i = 0; i < s.length; i++)
      s[i] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(e) {
    return en.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    en.exists(this), en.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: o, destroyed: s, blockLen: i, outputLen: a } = this;
    return e = e, e.finished = o, e.destroyed = s, e.blockLen = i, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const vh = (t, e, n) => new Ah(t, e).update(n).digest();
vh.create = (t, e) => new Ah(t, e);
function Jg(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, h = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + h, a, r);
}
let Gi = class extends Eh {
  constructor(e, n, r, o) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ms(this.buffer);
  }
  update(e) {
    en.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    e = zi(e);
    const s = e.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(o - this.pos, s - i);
      if (a === o) {
        const c = ms(e);
        for (; o <= s - i; i += o)
          this.process(c, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    en.exists(this), en.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let l = i; l < o; l++)
      n[l] = 0;
    Jg(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = ms(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const h = c / 4, u = this.get();
    if (h > u.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < h; l++)
      a.setUint32(4 * l, u[l], s);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: a } = this;
    return e.length = o, e.pos = a, e.finished = s, e.destroyed = i, o % n && e.buffer.set(r), e;
  }
};
const Xg = (t, e, n) => t & e ^ ~t & n, Yg = (t, e, n) => t & e ^ t & n ^ e & n, Zg = new Uint32Array([
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
]), Ae = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ve = new Uint32Array(64);
let Bh = class extends Gi {
  constructor() {
    super(64, 32, 8, !1), this.A = Ae[0] | 0, this.B = Ae[1] | 0, this.C = Ae[2] | 0, this.D = Ae[3] | 0, this.E = Ae[4] | 0, this.F = Ae[5] | 0, this.G = Ae[6] | 0, this.H = Ae[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: o, E: s, F: i, G: a, H: c } = this;
    return [e, n, r, o, s, i, a, c];
  }
  // prettier-ignore
  set(e, n, r, o, s, i, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      ve[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = ve[l - 15], p = ve[l - 2], g = jt(b, 7) ^ jt(b, 18) ^ b >>> 3, w = jt(p, 17) ^ jt(p, 19) ^ p >>> 10;
      ve[l] = w + ve[l - 7] + g + ve[l - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: h, H: u } = this;
    for (let l = 0; l < 64; l++) {
      const b = jt(a, 6) ^ jt(a, 11) ^ jt(a, 25), p = u + b + Xg(a, c, h) + Zg[l] + ve[l] | 0, w = (jt(r, 2) ^ jt(r, 13) ^ jt(r, 22)) + Yg(r, o, s) | 0;
      u = h, h = c, c = a, a = i + p | 0, i = s, s = o, o = r, r = p + w | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, h = h + this.G | 0, u = u + this.H | 0, this.set(r, o, s, i, a, c, h, u);
  }
  roundClean() {
    ve.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Qg = class extends Bh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const $h = pn(() => new Bh());
pn(() => new Qg());
function t2(t, e) {
  switch (e = mh(e ?? yh), t) {
    case se.P2PKH:
      switch (e.transactionVersion) {
        case ie.Mainnet:
          return Xt.MainnetSingleSig;
        case ie.Testnet:
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
        case ie.Mainnet:
          return Xt.MainnetMultiSig;
        case ie.Testnet:
          return Xt.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const e2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), _h = Uint8Array.from({ length: 16 }, (t, e) => e), n2 = _h.map((t) => (9 * t + 5) % 16);
let Vi = [_h], Ki = [n2];
for (let t = 0; t < 4; t++)
  for (let e of [Vi, Ki])
    e.push(e[t].map((n) => e2[n]));
const Lh = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), r2 = Vi.map((t, e) => t.map((n) => Lh[e][n])), o2 = Ki.map((t, e) => t.map((n) => Lh[e][n])), s2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), i2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Qr = (t, e) => t << e | t >>> 32 - e;
function kc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const to = new Uint32Array(16);
let a2 = class extends Gi {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: o, h4: s } = this;
    return [e, n, r, o, s];
  }
  set(e, n, r, o, s) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = o | 0, this.h4 = s | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      to[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, o = r, s = this.h1 | 0, i = s, a = this.h2 | 0, c = a, h = this.h3 | 0, u = h, l = this.h4 | 0, b = l;
    for (let p = 0; p < 5; p++) {
      const g = 4 - p, w = s2[p], E = i2[p], $ = Vi[p], H = Ki[p], y = r2[p], _ = o2[p];
      for (let v = 0; v < 16; v++) {
        const P = Qr(r + kc(p, s, a, h) + to[$[v]] + w, y[v]) + l | 0;
        r = l, l = h, h = Qr(a, 10) | 0, a = s, s = P;
      }
      for (let v = 0; v < 16; v++) {
        const P = Qr(o + kc(g, i, c, u) + to[H[v]] + E, _[v]) + b | 0;
        o = b, b = u, u = Qr(c, 10) | 0, c = i, i = P;
      }
    }
    this.set(this.h1 + a + u | 0, this.h2 + h + b | 0, this.h3 + l + o | 0, this.h4 + r + i | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    to.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const c2 = pn(() => new a2()), eo = BigInt(2 ** 32 - 1), Ys = BigInt(32);
function Hh(t, e = !1) {
  return e ? { h: Number(t & eo), l: Number(t >> Ys & eo) } : { h: Number(t >> Ys & eo) | 0, l: Number(t & eo) | 0 };
}
function l2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let o = 0; o < t.length; o++) {
    const { h: s, l: i } = Hh(t[o], e);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const f2 = (t, e) => BigInt(t >>> 0) << Ys | BigInt(e >>> 0), h2 = (t, e, n) => t >>> n, u2 = (t, e, n) => t << 32 - n | e >>> n, d2 = (t, e, n) => t >>> n | e << 32 - n, p2 = (t, e, n) => t << 32 - n | e >>> n, b2 = (t, e, n) => t << 64 - n | e >>> n - 32, g2 = (t, e, n) => t >>> n - 32 | e << 64 - n, x2 = (t, e) => e, w2 = (t, e) => t, y2 = (t, e, n) => t << n | e >>> 32 - n, m2 = (t, e, n) => e << n | t >>> 32 - n, S2 = (t, e, n) => e << n - 32 | t >>> 64 - n, E2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function A2(t, e, n, r) {
  const o = (e >>> 0) + (r >>> 0);
  return { h: t + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const v2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), B2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, $2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), _2 = (t, e, n, r, o) => e + n + r + o + (t / 2 ** 32 | 0) | 0, L2 = (t, e, n, r, o) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), H2 = (t, e, n, r, o, s) => e + n + r + o + s + (t / 2 ** 32 | 0) | 0, j = {
  fromBig: Hh,
  split: l2,
  toBig: f2,
  shrSH: h2,
  shrSL: u2,
  rotrSH: d2,
  rotrSL: p2,
  rotrBH: b2,
  rotrBL: g2,
  rotr32H: x2,
  rotr32L: w2,
  rotlSH: y2,
  rotlSL: m2,
  rotlBH: S2,
  rotlBL: E2,
  add: A2,
  add3L: v2,
  add3H: B2,
  add4L: $2,
  add4H: _2,
  add5H: H2,
  add5L: L2
}, [k2, I2] = j.split([
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
].map((t) => BigInt(t))), Be = new Uint32Array(80), $e = new Uint32Array(80);
let Vo = class extends Gi {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: a, Dl: c, Eh: h, El: u, Fh: l, Fl: b, Gh: p, Gl: g, Hh: w, Hl: E } = this;
    return [e, n, r, o, s, i, a, c, h, u, l, b, p, g, w, E];
  }
  // prettier-ignore
  set(e, n, r, o, s, i, a, c, h, u, l, b, p, g, w, E) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = h | 0, this.El = u | 0, this.Fh = l | 0, this.Fl = b | 0, this.Gh = p | 0, this.Gl = g | 0, this.Hh = w | 0, this.Hl = E | 0;
  }
  process(e, n) {
    for (let y = 0; y < 16; y++, n += 4)
      Be[y] = e.getUint32(n), $e[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const _ = Be[y - 15] | 0, v = $e[y - 15] | 0, P = j.rotrSH(_, v, 1) ^ j.rotrSH(_, v, 8) ^ j.shrSH(_, v, 7), M = j.rotrSL(_, v, 1) ^ j.rotrSL(_, v, 8) ^ j.shrSL(_, v, 7), O = Be[y - 2] | 0, N = $e[y - 2] | 0, x = j.rotrSH(O, N, 19) ^ j.rotrBH(O, N, 61) ^ j.shrSH(O, N, 6), A = j.rotrSL(O, N, 19) ^ j.rotrBL(O, N, 61) ^ j.shrSL(O, N, 6), k = j.add4L(M, A, $e[y - 7], $e[y - 16]), C = j.add4H(k, P, x, Be[y - 7], Be[y - 16]);
      Be[y] = C | 0, $e[y] = k | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: a, Cl: c, Dh: h, Dl: u, Eh: l, El: b, Fh: p, Fl: g, Gh: w, Gl: E, Hh: $, Hl: H } = this;
    for (let y = 0; y < 80; y++) {
      const _ = j.rotrSH(l, b, 14) ^ j.rotrSH(l, b, 18) ^ j.rotrBH(l, b, 41), v = j.rotrSL(l, b, 14) ^ j.rotrSL(l, b, 18) ^ j.rotrBL(l, b, 41), P = l & p ^ ~l & w, M = b & g ^ ~b & E, O = j.add5L(H, v, M, I2[y], $e[y]), N = j.add5H(O, $, _, P, k2[y], Be[y]), x = O | 0, A = j.rotrSH(r, o, 28) ^ j.rotrBH(r, o, 34) ^ j.rotrBH(r, o, 39), k = j.rotrSL(r, o, 28) ^ j.rotrBL(r, o, 34) ^ j.rotrBL(r, o, 39), C = r & s ^ r & a ^ s & a, R = o & i ^ o & c ^ i & c;
      $ = w | 0, H = E | 0, w = p | 0, E = g | 0, p = l | 0, g = b | 0, { h: l, l: b } = j.add(h | 0, u | 0, N | 0, x | 0), h = a | 0, u = c | 0, a = s | 0, c = i | 0, s = r | 0, i = o | 0;
      const D = j.add3L(x, k, R);
      r = j.add3H(D, N, A, C), o = D | 0;
    }
    ({ h: r, l: o } = j.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = j.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: a, l: c } = j.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h, l: u } = j.add(this.Dh | 0, this.Dl | 0, h | 0, u | 0), { h: l, l: b } = j.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h: p, l: g } = j.add(this.Fh | 0, this.Fl | 0, p | 0, g | 0), { h: w, l: E } = j.add(this.Gh | 0, this.Gl | 0, w | 0, E | 0), { h: $, l: H } = j.add(this.Hh | 0, this.Hl | 0, $ | 0, H | 0), this.set(r, o, s, i, a, c, h, u, l, b, p, g, w, E, $, H);
  }
  roundClean() {
    Be.fill(0), $e.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, U2 = class extends Vo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, O2 = class extends Vo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, C2 = class extends Vo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
pn(() => new Vo());
pn(() => new U2());
pn(() => new O2());
pn(() => new C2());
var Zs;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Zs || (Zs = {}));
function N2(t, e) {
  return { type: Zs.Address, version: t, hash160: e };
}
function P2(t) {
  return Kn.c32address(t.version, t.hash160);
}
const D2 = (t) => c2($h(t)), T2 = (t) => Ut(D2(t));
ct.hmacSha256Sync = (t, ...e) => {
  const n = vh.create($h, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function F2(t, e = "mainnet") {
  e = mh(e), t = typeof t == "string" ? _t(t) : t;
  const n = t2(se.P2PKH, e), r = N2(n, T2(t));
  return P2(r);
}
function M2(t, e) {
  const n = wt.decodeToken(t), r = n.payload;
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
  const o = r.issuer.publicKey, s = F2(o);
  if (e !== o) {
    if (e !== s) throw new Error("Token issuer public key does not match the verifying value");
  }
  const i = new wt.TokenVerifier(n.header.alg, o);
  if (!i)
    throw new Error("Invalid token verifier");
  if (!i.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function R2(t, e = null) {
  let n;
  e ? n = M2(t, e) : n = wt.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const o = n.payload;
    if (typeof o == "string")
      throw new Error("Unexpected token payload type of string");
    o.hasOwnProperty("claim") && (r = o.claim);
  }
  return r;
}
const Ic = "_blockstackDidCheckEchoReply", z2 = "echoReply", G2 = "authContinuation";
function V2(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [o, s] = r.split("=");
    return n[o] = s ? decodeURIComponent(s.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function K2() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[Ic];
  if (typeof e == "boolean")
    return e;
  const n = V2(t.location.search), r = n[z2];
  if (r) {
    t[Ic] = !0;
    const o = `echo-reply-${r}`;
    return t.localStorage.setItem(o, "success"), t.setTimeout(() => {
      const s = n[G2];
      t.location.href = s;
    }, 10), !0;
  }
  return !1;
}
class Qs {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new Gf();
    else
      throw new fb("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new bc(e.sessionOptions) : this.store = new bc() : e ? this.store = new pc(e.sessionOptions) : this.store = new pc();
  }
  makeAuthRequestToken(e, n, r, o, s, i = ub().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new Gs("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), o = o || c.scopes, s = s || c.appDomain, Ng(e, n, r, o, s, i, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = Cg();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = Ci("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (K2())
        return Hn.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Hn.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = Ib()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new qr("Existing user session found.");
    const o = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const s = wt.decodeToken(e).payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await Mg(e))
      throw new qr("Invalid authentication response.");
    let a = s.private_key, c = s.core_token;
    if (bs(s.version, "1.1.0"))
      if (o !== void 0 && o != null) {
        if (s.private_key !== void 0 && s.private_key !== null)
          try {
            a = await uc(o, s.private_key);
          } catch {
            if (Hn.warn("Failed decryption of appPrivateKey, will try to use as given"), !ct.isValidPrivateKey(s.private_key))
              throw new qr("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await uc(o, c);
          } catch {
            Hn.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new qr("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let h = $b, u;
    bs(s.version, "1.2.0") && s.hubUrl !== null && s.hubUrl !== void 0 && (h = s.hubUrl), bs(s.version, "1.3.0") && s.associationToken !== null && s.associationToken !== void 0 && (u = s.associationToken);
    const l = {
      profile: s.profile,
      email: s.email,
      decentralizedID: s.iss,
      identityAddress: xh(s.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: h,
      appPrivateKeyFromWalletSalt: s.appPrivateKeyFromWalletSalt,
      coreNode: s.blockstackAPIUrl,
      gaiaAssociationToken: u
    }, b = s.profile_url;
    if (!l.profile && b) {
      const p = await n(b);
      if (!p.ok)
        l.profile = Object.assign({}, ab);
      else {
        const g = await p.text(), w = JSON.parse(g);
        l.profile = R2(w[0].token);
      }
    } else
      l.profile = s.profile;
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
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), ng(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), rg(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
Qs.prototype.makeAuthRequest = Qs.prototype.makeAuthRequestToken;
const j2 = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), kh = "STX_PROVIDER", Ih = () => typeof window > "u" ? null : window.localStorage.getItem(kh), q2 = (t) => {
  typeof window < "u" && window.localStorage.setItem(kh, t);
}, W2 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function J2(t, e) {
  const n = {};
  return Object.assign(n, W2, e), await fetch(t, n);
}
function X2(t) {
  let e = J2, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Y2(...t) {
  const { fetchLib: e, middlewares: n } = X2(t);
  return async (o, s) => {
    let i = { url: o, init: s ?? {} };
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
var Mn;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Mn || (Mn = {}));
var ln;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ln || (ln = {}));
var Uc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Uc || (Uc = {}));
const Z2 = "https://api.mainnet.hiro.so", Q2 = "https://api.testnet.hiro.so", tx = "http://localhost:3999", ex = ["mainnet", "testnet", "devnet", "mocknet"];
class fn {
  constructor(e) {
    this.version = ln.Mainnet, this.chainId = Mn.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === ln.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, o) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(o)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let o = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (o = `${o}?limit=${r.limit}&offset=${r.offset}`), o;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let o = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (o = `${o}?limit=${r.limit}&offset=${r.offset}`), o;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, o) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${o}?proof=0`, this.getMapEntryUrl = (n, r, o) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${o}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Y2();
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
fn.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new ti();
    case "testnet":
      return new ei();
    case "devnet":
      return new nx();
    case "mocknet":
      return new Uh();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${ex.join(", ")}`);
  }
};
fn.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : fn.fromName(t);
class ti extends fn {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Z2,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ln.Mainnet, this.chainId = Mn.Mainnet;
  }
}
class ei extends fn {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Q2,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ln.Testnet, this.chainId = Mn.Testnet;
  }
}
class Uh extends fn {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? tx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ln.Testnet, this.chainId = Mn.Testnet;
  }
}
const nx = Uh;
var ni;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(ni || (ni = {}));
var Oc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Oc || (Oc = {}));
ni.Mainnet;
var _o;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(_o || (_o = {}));
var Cc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Cc || (Cc = {}));
_o.Mainnet;
const rx = 128, ox = 128, Oh = 16;
var Nc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Nc || (Nc = {}));
var Pc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Pc || (Pc = {}));
var Ft;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ft || (Ft = {}));
const Ss = ["onChainOnly", "offChainOnly", "any"];
Ss[0] + "", Ft.OnChainOnly, Ss[1] + "", Ft.OffChainOnly, Ss[2] + "", Ft.Any, Ft.OnChainOnly + "", Ft.OnChainOnly, Ft.OffChainOnly + "", Ft.OffChainOnly, Ft.Any + "", Ft.Any;
var Dc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Dc || (Dc = {}));
var Tc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Tc || (Tc = {}));
var Fc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Fc || (Fc = {}));
var Mc;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Mc || (Mc = {}));
var Rc;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Rc || (Rc = {}));
var zc;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(zc || (zc = {}));
var Gc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Gc || (Gc = {}));
var Vc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Vc || (Vc = {}));
var Kc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Kc || (Kc = {}));
var jc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(jc || (jc = {}));
var qc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(qc || (qc = {}));
var Wc;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Wc || (Wc = {}));
var Jc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Jc || (Jc = {}));
let sx = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, ix = class extends sx {
  constructor(e) {
    super(e);
  }
};
function ri(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function ax(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Ch(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function cx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ri(t.outputLen), ri(t.blockLen);
}
function lx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function fx(t, e) {
  Ch(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Es = {
  number: ri,
  bool: ax,
  bytes: Ch,
  hash: cx,
  exists: lx,
  output: fx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const As = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), qt = (t, e) => t << 32 - e | t >>> e, hx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!hx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ux(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Nh(t) {
  if (typeof t == "string" && (t = ux(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let dx = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function bn(t) {
  const e = (r) => t().update(Nh(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function px(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, h = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + h, a, r);
}
let ji = class extends dx {
  constructor(e, n, r, o) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = As(this.buffer);
  }
  update(e) {
    Es.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    e = Nh(e);
    const s = e.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(o - this.pos, s - i);
      if (a === o) {
        const c = As(e);
        for (; o <= s - i; i += o)
          this.process(c, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Es.exists(this), Es.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let l = i; l < o; l++)
      n[l] = 0;
    px(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = As(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const h = c / 4, u = this.get();
    if (h > u.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < h; l++)
      a.setUint32(4 * l, u[l], s);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: a } = this;
    return e.length = o, e.pos = a, e.finished = s, e.destroyed = i, o % n && e.buffer.set(r), e;
  }
};
const bx = (t, e, n) => t & e ^ ~t & n, gx = (t, e, n) => t & e ^ t & n ^ e & n, xx = new Uint32Array([
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
]), _e = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Le = new Uint32Array(64);
let Ph = class extends ji {
  constructor() {
    super(64, 32, 8, !1), this.A = _e[0] | 0, this.B = _e[1] | 0, this.C = _e[2] | 0, this.D = _e[3] | 0, this.E = _e[4] | 0, this.F = _e[5] | 0, this.G = _e[6] | 0, this.H = _e[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: o, E: s, F: i, G: a, H: c } = this;
    return [e, n, r, o, s, i, a, c];
  }
  // prettier-ignore
  set(e, n, r, o, s, i, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      Le[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = Le[l - 15], p = Le[l - 2], g = qt(b, 7) ^ qt(b, 18) ^ b >>> 3, w = qt(p, 17) ^ qt(p, 19) ^ p >>> 10;
      Le[l] = w + Le[l - 7] + g + Le[l - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: h, H: u } = this;
    for (let l = 0; l < 64; l++) {
      const b = qt(a, 6) ^ qt(a, 11) ^ qt(a, 25), p = u + b + bx(a, c, h) + xx[l] + Le[l] | 0, w = (qt(r, 2) ^ qt(r, 13) ^ qt(r, 22)) + gx(r, o, s) | 0;
      u = h, h = c, c = a, a = i + p | 0, i = s, s = o, o = r, r = p + w | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, h = h + this.G | 0, u = u + this.H | 0, this.set(r, o, s, i, a, c, h, u);
  }
  roundClean() {
    Le.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, wx = class extends Ph {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
bn(() => new Ph());
bn(() => new wx());
const yx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Dh = Uint8Array.from({ length: 16 }, (t, e) => e), mx = Dh.map((t) => (9 * t + 5) % 16);
let qi = [Dh], Wi = [mx];
for (let t = 0; t < 4; t++)
  for (let e of [qi, Wi])
    e.push(e[t].map((n) => yx[n]));
const Th = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Sx = qi.map((t, e) => t.map((n) => Th[e][n])), Ex = Wi.map((t, e) => t.map((n) => Th[e][n])), Ax = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), vx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), no = (t, e) => t << e | t >>> 32 - e;
function Xc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ro = new Uint32Array(16);
let Bx = class extends ji {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: o, h4: s } = this;
    return [e, n, r, o, s];
  }
  set(e, n, r, o, s) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = o | 0, this.h4 = s | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      ro[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, o = r, s = this.h1 | 0, i = s, a = this.h2 | 0, c = a, h = this.h3 | 0, u = h, l = this.h4 | 0, b = l;
    for (let p = 0; p < 5; p++) {
      const g = 4 - p, w = Ax[p], E = vx[p], $ = qi[p], H = Wi[p], y = Sx[p], _ = Ex[p];
      for (let v = 0; v < 16; v++) {
        const P = no(r + Xc(p, s, a, h) + ro[$[v]] + w, y[v]) + l | 0;
        r = l, l = h, h = no(a, 10) | 0, a = s, s = P;
      }
      for (let v = 0; v < 16; v++) {
        const P = no(o + Xc(g, i, c, u) + ro[H[v]] + E, _[v]) + b | 0;
        o = b, b = u, u = no(c, 10) | 0, c = i, i = P;
      }
    }
    this.set(this.h1 + a + u | 0, this.h2 + h + b | 0, this.h3 + l + o | 0, this.h4 + r + i | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    ro.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
bn(() => new Bx());
const oo = BigInt(2 ** 32 - 1), oi = BigInt(32);
function Fh(t, e = !1) {
  return e ? { h: Number(t & oo), l: Number(t >> oi & oo) } : { h: Number(t >> oi & oo) | 0, l: Number(t & oo) | 0 };
}
function $x(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let o = 0; o < t.length; o++) {
    const { h: s, l: i } = Fh(t[o], e);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const _x = (t, e) => BigInt(t >>> 0) << oi | BigInt(e >>> 0), Lx = (t, e, n) => t >>> n, Hx = (t, e, n) => t << 32 - n | e >>> n, kx = (t, e, n) => t >>> n | e << 32 - n, Ix = (t, e, n) => t << 32 - n | e >>> n, Ux = (t, e, n) => t << 64 - n | e >>> n - 32, Ox = (t, e, n) => t >>> n - 32 | e << 64 - n, Cx = (t, e) => e, Nx = (t, e) => t, Px = (t, e, n) => t << n | e >>> 32 - n, Dx = (t, e, n) => e << n | t >>> 32 - n, Tx = (t, e, n) => e << n - 32 | t >>> 64 - n, Fx = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Mx(t, e, n, r) {
  const o = (e >>> 0) + (r >>> 0);
  return { h: t + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const Rx = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), zx = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Gx = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Vx = (t, e, n, r, o) => e + n + r + o + (t / 2 ** 32 | 0) | 0, Kx = (t, e, n, r, o) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), jx = (t, e, n, r, o, s) => e + n + r + o + s + (t / 2 ** 32 | 0) | 0, q = {
  fromBig: Fh,
  split: $x,
  toBig: _x,
  shrSH: Lx,
  shrSL: Hx,
  rotrSH: kx,
  rotrSL: Ix,
  rotrBH: Ux,
  rotrBL: Ox,
  rotr32H: Cx,
  rotr32L: Nx,
  rotlSH: Px,
  rotlSL: Dx,
  rotlBH: Tx,
  rotlBL: Fx,
  add: Mx,
  add3L: Rx,
  add3H: zx,
  add4L: Gx,
  add4H: Vx,
  add5H: jx,
  add5L: Kx
}, [qx, Wx] = q.split([
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
].map((t) => BigInt(t))), He = new Uint32Array(80), ke = new Uint32Array(80);
let Ko = class extends ji {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: a, Dl: c, Eh: h, El: u, Fh: l, Fl: b, Gh: p, Gl: g, Hh: w, Hl: E } = this;
    return [e, n, r, o, s, i, a, c, h, u, l, b, p, g, w, E];
  }
  // prettier-ignore
  set(e, n, r, o, s, i, a, c, h, u, l, b, p, g, w, E) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = h | 0, this.El = u | 0, this.Fh = l | 0, this.Fl = b | 0, this.Gh = p | 0, this.Gl = g | 0, this.Hh = w | 0, this.Hl = E | 0;
  }
  process(e, n) {
    for (let y = 0; y < 16; y++, n += 4)
      He[y] = e.getUint32(n), ke[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const _ = He[y - 15] | 0, v = ke[y - 15] | 0, P = q.rotrSH(_, v, 1) ^ q.rotrSH(_, v, 8) ^ q.shrSH(_, v, 7), M = q.rotrSL(_, v, 1) ^ q.rotrSL(_, v, 8) ^ q.shrSL(_, v, 7), O = He[y - 2] | 0, N = ke[y - 2] | 0, x = q.rotrSH(O, N, 19) ^ q.rotrBH(O, N, 61) ^ q.shrSH(O, N, 6), A = q.rotrSL(O, N, 19) ^ q.rotrBL(O, N, 61) ^ q.shrSL(O, N, 6), k = q.add4L(M, A, ke[y - 7], ke[y - 16]), C = q.add4H(k, P, x, He[y - 7], He[y - 16]);
      He[y] = C | 0, ke[y] = k | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: a, Cl: c, Dh: h, Dl: u, Eh: l, El: b, Fh: p, Fl: g, Gh: w, Gl: E, Hh: $, Hl: H } = this;
    for (let y = 0; y < 80; y++) {
      const _ = q.rotrSH(l, b, 14) ^ q.rotrSH(l, b, 18) ^ q.rotrBH(l, b, 41), v = q.rotrSL(l, b, 14) ^ q.rotrSL(l, b, 18) ^ q.rotrBL(l, b, 41), P = l & p ^ ~l & w, M = b & g ^ ~b & E, O = q.add5L(H, v, M, Wx[y], ke[y]), N = q.add5H(O, $, _, P, qx[y], He[y]), x = O | 0, A = q.rotrSH(r, o, 28) ^ q.rotrBH(r, o, 34) ^ q.rotrBH(r, o, 39), k = q.rotrSL(r, o, 28) ^ q.rotrBL(r, o, 34) ^ q.rotrBL(r, o, 39), C = r & s ^ r & a ^ s & a, R = o & i ^ o & c ^ i & c;
      $ = w | 0, H = E | 0, w = p | 0, E = g | 0, p = l | 0, g = b | 0, { h: l, l: b } = q.add(h | 0, u | 0, N | 0, x | 0), h = a | 0, u = c | 0, a = s | 0, c = i | 0, s = r | 0, i = o | 0;
      const D = q.add3L(x, k, R);
      r = q.add3H(D, N, A, C), o = D | 0;
    }
    ({ h: r, l: o } = q.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = q.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: a, l: c } = q.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h, l: u } = q.add(this.Dh | 0, this.Dl | 0, h | 0, u | 0), { h: l, l: b } = q.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h: p, l: g } = q.add(this.Fh | 0, this.Fl | 0, p | 0, g | 0), { h: w, l: E } = q.add(this.Gh | 0, this.Gl | 0, w | 0, E | 0), { h: $, l: H } = q.add(this.Hh | 0, this.Hl | 0, $ | 0, H | 0), this.set(r, o, s, i, a, c, h, u, l, b, p, g, w, E, $, H);
  }
  roundClean() {
    He.fill(0), ke.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Jx = class extends Ko {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Xx = class extends Ko {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Yx = class extends Ko {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
bn(() => new Ko());
bn(() => new Jx());
bn(() => new Xx());
bn(() => new Yx());
var lt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(lt || (lt = {}));
var si;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(si || (si = {}));
function Ji(t) {
  return si[t];
}
var Lo;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Lo || (Lo = {}));
function Mh(t, e, n) {
  const o = rx;
  if (fw(t, o))
    throw new Error(`String length exceeds maximum bytes ${o}`);
  return {
    type: Lo.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: o
  };
}
function Rh(t) {
  const e = Kn.c32addressDecode(t);
  return {
    type: Lo.Address,
    version: e[0],
    hash160: e[1]
  };
}
function zh(t) {
  const e = [];
  return e.push(_t(Ni(t.version, 1))), e.push(_t(t.hash160)), Wn(e);
}
function Gh(t) {
  const e = [], n = vr(t.content), r = n.byteLength;
  return e.push(_t(Ni(r, t.lengthPrefixBytes))), e.push(n), Wn(e);
}
function te(t, e) {
  return Wn([Ji(t), e]);
}
function Zx(t) {
  return new Uint8Array([Ji(t.type)]);
}
function Qx(t) {
  return t.type === lt.OptionalNone ? new Uint8Array([Ji(t.type)]) : te(t.type, $r(t.value));
}
function tw(t) {
  const e = new Uint8Array(4);
  return Do(e, Math.ceil(t.value.length / 2), 0), te(t.type, le(e, _t(t.value)));
}
function ew(t) {
  const e = Rf(wb(BigInt(t.value), BigInt(ox)), Oh);
  return te(t.type, e);
}
function nw(t) {
  const e = Rf(BigInt(t.value), Oh);
  return te(t.type, e);
}
function rw(t) {
  return te(t.type, zh(Rh(t.value)));
}
function ow(t) {
  const [e, n] = hw(t.value);
  return te(t.type, le(zh(Rh(e)), Gh(Mh(n))));
}
function sw(t) {
  return te(t.type, $r(t.value));
}
function iw(t) {
  const e = [], n = new Uint8Array(4);
  Do(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const o = $r(r);
    e.push(o);
  }
  return te(t.type, Wn(e));
}
function aw(t) {
  const e = [], n = new Uint8Array(4);
  Do(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((o, s) => o.localeCompare(s));
  for (const o of r) {
    const s = Mh(o);
    e.push(Gh(s));
    const i = $r(t.value[o]);
    e.push(i);
  }
  return te(t.type, Wn(e));
}
function Vh(t, e) {
  const n = [], r = e == "ascii" ? mb(t.value) : vr(t.value), o = new Uint8Array(4);
  return Do(o, r.length, 0), n.push(o), n.push(r), te(t.type, Wn(n));
}
function cw(t) {
  return Vh(t, "ascii");
}
function lw(t) {
  return Vh(t, "utf8");
}
function Yc(t) {
  return Ut($r(t));
}
function $r(t) {
  switch (t.type) {
    case lt.BoolTrue:
    case lt.BoolFalse:
      return Zx(t);
    case lt.OptionalNone:
    case lt.OptionalSome:
      return Qx(t);
    case lt.Buffer:
      return tw(t);
    case lt.UInt:
      return nw(t);
    case lt.Int:
      return ew(t);
    case lt.PrincipalStandard:
      return rw(t);
    case lt.PrincipalContract:
      return ow(t);
    case lt.ResponseOk:
    case lt.ResponseErr:
      return sw(t);
    case lt.List:
      return iw(t);
    case lt.Tuple:
      return aw(t);
    case lt.StringASCII:
      return cw(t);
    case lt.StringUTF8:
      return lw(t);
    default:
      throw new ix("Unable to serialize. Invalid Clarity Value.");
  }
}
const fw = (t, e) => t ? vr(t).length > e : !1;
function hw(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
function uw(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = gr(r);
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
    return BigInt(`0x${bw(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Xi(t, e = 8) {
  return (typeof t == "bigint" ? t : uw(t)).toString(16).padStart(e * 2, "0");
}
function Kh(t, e = 16) {
  const n = Xi(t, e);
  return gr(n);
}
function dw(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const pw = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function bw(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += pw[n];
  return e;
}
function gr(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t;
  const e = t.length % 2 ? `0${t}` : t, n = new Uint8Array(e.length / 2);
  for (let r = 0; r < n.length; r++) {
    const o = r * 2, s = e.slice(o, o + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    n[r] = i;
  }
  return n;
}
function Yi(t) {
  return new TextEncoder().encode(t);
}
function gw(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function xw(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Zc(t) {
  if (t.some(xw))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Zi(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, o) => r + o.length, 0), n = new Uint8Array(e);
  for (let r = 0, o = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, o), o += s.length;
  }
  return n;
}
function Jn(t) {
  return Zi(...t.map((e) => typeof e == "number" ? Zc([e]) : e instanceof Array ? Zc(e) : e));
}
function jo(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var ii;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ii || (ii = {}));
ii.Mainnet;
const ww = 128, yw = 128, jh = 16;
var ai;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ai || (ai = {}));
var Qc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Qc || (Qc = {}));
var tl;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(tl || (tl = {}));
var Mt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Mt || (Mt = {}));
const vs = ["onChainOnly", "offChainOnly", "any"];
vs[0] + "", Mt.OnChainOnly, vs[1] + "", Mt.OffChainOnly, vs[2] + "", Mt.Any, Mt.OnChainOnly + "", Mt.OnChainOnly, Mt.OffChainOnly + "", Mt.OffChainOnly, Mt.Any + "", Mt.Any;
var ci;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ci || (ci = {}));
ci.Mainnet;
var el;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(el || (el = {}));
var nl;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(nl || (nl = {}));
var rl;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(rl || (rl = {}));
var ol;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(ol || (ol = {}));
var sl;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(sl || (sl = {}));
var il;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(il || (il = {}));
var al;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(al || (al = {}));
var cl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(cl || (cl = {}));
var ll;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ll || (ll = {}));
var fl;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(fl || (fl = {}));
var hl;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(hl || (hl = {}));
function li(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function mw(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function qh(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Sw(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  li(t.outputLen), li(t.blockLen);
}
function Ew(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Aw(t, e) {
  qh(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Bs = {
  number: li,
  bool: mw,
  bytes: qh,
  hash: Sw,
  exists: Ew,
  output: Aw
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const $s = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Wt = (t, e) => t << 32 - e | t >>> e, vw = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!vw)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Bw(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Wh(t) {
  if (typeof t == "string" && (t = Bw(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class $w {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function gn(t) {
  const e = (r) => t().update(Wh(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function _w(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, h = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + h, a, r);
}
class Qi extends $w {
  constructor(e, n, r, o) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = $s(this.buffer);
  }
  update(e) {
    Bs.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    e = Wh(e);
    const s = e.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(o - this.pos, s - i);
      if (a === o) {
        const c = $s(e);
        for (; o <= s - i; i += o)
          this.process(c, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Bs.exists(this), Bs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let l = i; l < o; l++)
      n[l] = 0;
    _w(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = $s(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const h = c / 4, u = this.get();
    if (h > u.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < h; l++)
      a.setUint32(4 * l, u[l], s);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: a } = this;
    return e.length = o, e.pos = a, e.finished = s, e.destroyed = i, o % n && e.buffer.set(r), e;
  }
}
const Lw = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Jh = Uint8Array.from({ length: 16 }, (t, e) => e), Hw = Jh.map((t) => (9 * t + 5) % 16);
let ta = [Jh], ea = [Hw];
for (let t = 0; t < 4; t++)
  for (let e of [ta, ea])
    e.push(e[t].map((n) => Lw[n]));
const Xh = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), kw = ta.map((t, e) => t.map((n) => Xh[e][n])), Iw = ea.map((t, e) => t.map((n) => Xh[e][n])), Uw = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Ow = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), so = (t, e) => t << e | t >>> 32 - e;
function ul(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const io = new Uint32Array(16);
class Cw extends Qi {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: o, h4: s } = this;
    return [e, n, r, o, s];
  }
  set(e, n, r, o, s) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = o | 0, this.h4 = s | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      io[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, o = r, s = this.h1 | 0, i = s, a = this.h2 | 0, c = a, h = this.h3 | 0, u = h, l = this.h4 | 0, b = l;
    for (let p = 0; p < 5; p++) {
      const g = 4 - p, w = Uw[p], E = Ow[p], $ = ta[p], H = ea[p], y = kw[p], _ = Iw[p];
      for (let v = 0; v < 16; v++) {
        const P = so(r + ul(p, s, a, h) + io[$[v]] + w, y[v]) + l | 0;
        r = l, l = h, h = so(a, 10) | 0, a = s, s = P;
      }
      for (let v = 0; v < 16; v++) {
        const P = so(o + ul(g, i, c, u) + io[H[v]] + E, _[v]) + b | 0;
        o = b, b = u, u = so(c, 10) | 0, c = i, i = P;
      }
    }
    this.set(this.h1 + a + u | 0, this.h2 + h + b | 0, this.h3 + l + o | 0, this.h4 + r + i | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    io.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
gn(() => new Cw());
const Nw = (t, e, n) => t & e ^ ~t & n, Pw = (t, e, n) => t & e ^ t & n ^ e & n, Dw = new Uint32Array([
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
class Yh extends Qi {
  constructor() {
    super(64, 32, 8, !1), this.A = Ie[0] | 0, this.B = Ie[1] | 0, this.C = Ie[2] | 0, this.D = Ie[3] | 0, this.E = Ie[4] | 0, this.F = Ie[5] | 0, this.G = Ie[6] | 0, this.H = Ie[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: o, E: s, F: i, G: a, H: c } = this;
    return [e, n, r, o, s, i, a, c];
  }
  // prettier-ignore
  set(e, n, r, o, s, i, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      Ue[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = Ue[l - 15], p = Ue[l - 2], g = Wt(b, 7) ^ Wt(b, 18) ^ b >>> 3, w = Wt(p, 17) ^ Wt(p, 19) ^ p >>> 10;
      Ue[l] = w + Ue[l - 7] + g + Ue[l - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: h, H: u } = this;
    for (let l = 0; l < 64; l++) {
      const b = Wt(a, 6) ^ Wt(a, 11) ^ Wt(a, 25), p = u + b + Nw(a, c, h) + Dw[l] + Ue[l] | 0, w = (Wt(r, 2) ^ Wt(r, 13) ^ Wt(r, 22)) + Pw(r, o, s) | 0;
      u = h, h = c, c = a, a = i + p | 0, i = s, s = o, o = r, r = p + w | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, h = h + this.G | 0, u = u + this.H | 0, this.set(r, o, s, i, a, c, h, u);
  }
  roundClean() {
    Ue.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class Tw extends Yh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
gn(() => new Yh());
gn(() => new Tw());
const ao = BigInt(2 ** 32 - 1), fi = BigInt(32);
function Zh(t, e = !1) {
  return e ? { h: Number(t & ao), l: Number(t >> fi & ao) } : { h: Number(t >> fi & ao) | 0, l: Number(t & ao) | 0 };
}
function Fw(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let o = 0; o < t.length; o++) {
    const { h: s, l: i } = Zh(t[o], e);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const Mw = (t, e) => BigInt(t >>> 0) << fi | BigInt(e >>> 0), Rw = (t, e, n) => t >>> n, zw = (t, e, n) => t << 32 - n | e >>> n, Gw = (t, e, n) => t >>> n | e << 32 - n, Vw = (t, e, n) => t << 32 - n | e >>> n, Kw = (t, e, n) => t << 64 - n | e >>> n - 32, jw = (t, e, n) => t >>> n - 32 | e << 64 - n, qw = (t, e) => e, Ww = (t, e) => t, Jw = (t, e, n) => t << n | e >>> 32 - n, Xw = (t, e, n) => e << n | t >>> 32 - n, Yw = (t, e, n) => e << n - 32 | t >>> 64 - n, Zw = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Qw(t, e, n, r) {
  const o = (e >>> 0) + (r >>> 0);
  return { h: t + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const ty = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), ey = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, ny = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), ry = (t, e, n, r, o) => e + n + r + o + (t / 2 ** 32 | 0) | 0, oy = (t, e, n, r, o) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), sy = (t, e, n, r, o, s) => e + n + r + o + s + (t / 2 ** 32 | 0) | 0, W = {
  fromBig: Zh,
  split: Fw,
  toBig: Mw,
  shrSH: Rw,
  shrSL: zw,
  rotrSH: Gw,
  rotrSL: Vw,
  rotrBH: Kw,
  rotrBL: jw,
  rotr32H: qw,
  rotr32L: Ww,
  rotlSH: Jw,
  rotlSL: Xw,
  rotlBH: Yw,
  rotlBL: Zw,
  add: Qw,
  add3L: ty,
  add3H: ey,
  add4L: ny,
  add4H: ry,
  add5H: sy,
  add5L: oy
}, [iy, ay] = W.split([
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
].map((t) => BigInt(t))), Oe = new Uint32Array(80), Ce = new Uint32Array(80);
class qo extends Qi {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: a, Dl: c, Eh: h, El: u, Fh: l, Fl: b, Gh: p, Gl: g, Hh: w, Hl: E } = this;
    return [e, n, r, o, s, i, a, c, h, u, l, b, p, g, w, E];
  }
  // prettier-ignore
  set(e, n, r, o, s, i, a, c, h, u, l, b, p, g, w, E) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = h | 0, this.El = u | 0, this.Fh = l | 0, this.Fl = b | 0, this.Gh = p | 0, this.Gl = g | 0, this.Hh = w | 0, this.Hl = E | 0;
  }
  process(e, n) {
    for (let y = 0; y < 16; y++, n += 4)
      Oe[y] = e.getUint32(n), Ce[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const _ = Oe[y - 15] | 0, v = Ce[y - 15] | 0, P = W.rotrSH(_, v, 1) ^ W.rotrSH(_, v, 8) ^ W.shrSH(_, v, 7), M = W.rotrSL(_, v, 1) ^ W.rotrSL(_, v, 8) ^ W.shrSL(_, v, 7), O = Oe[y - 2] | 0, N = Ce[y - 2] | 0, x = W.rotrSH(O, N, 19) ^ W.rotrBH(O, N, 61) ^ W.shrSH(O, N, 6), A = W.rotrSL(O, N, 19) ^ W.rotrBL(O, N, 61) ^ W.shrSL(O, N, 6), k = W.add4L(M, A, Ce[y - 7], Ce[y - 16]), C = W.add4H(k, P, x, Oe[y - 7], Oe[y - 16]);
      Oe[y] = C | 0, Ce[y] = k | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: a, Cl: c, Dh: h, Dl: u, Eh: l, El: b, Fh: p, Fl: g, Gh: w, Gl: E, Hh: $, Hl: H } = this;
    for (let y = 0; y < 80; y++) {
      const _ = W.rotrSH(l, b, 14) ^ W.rotrSH(l, b, 18) ^ W.rotrBH(l, b, 41), v = W.rotrSL(l, b, 14) ^ W.rotrSL(l, b, 18) ^ W.rotrBL(l, b, 41), P = l & p ^ ~l & w, M = b & g ^ ~b & E, O = W.add5L(H, v, M, ay[y], Ce[y]), N = W.add5H(O, $, _, P, iy[y], Oe[y]), x = O | 0, A = W.rotrSH(r, o, 28) ^ W.rotrBH(r, o, 34) ^ W.rotrBH(r, o, 39), k = W.rotrSL(r, o, 28) ^ W.rotrBL(r, o, 34) ^ W.rotrBL(r, o, 39), C = r & s ^ r & a ^ s & a, R = o & i ^ o & c ^ i & c;
      $ = w | 0, H = E | 0, w = p | 0, E = g | 0, p = l | 0, g = b | 0, { h: l, l: b } = W.add(h | 0, u | 0, N | 0, x | 0), h = a | 0, u = c | 0, a = s | 0, c = i | 0, s = r | 0, i = o | 0;
      const D = W.add3L(x, k, R);
      r = W.add3H(D, N, A, C), o = D | 0;
    }
    ({ h: r, l: o } = W.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = W.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: a, l: c } = W.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h, l: u } = W.add(this.Dh | 0, this.Dl | 0, h | 0, u | 0), { h: l, l: b } = W.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h: p, l: g } = W.add(this.Fh | 0, this.Fl | 0, p | 0, g | 0), { h: w, l: E } = W.add(this.Gh | 0, this.Gl | 0, w | 0, E | 0), { h: $, l: H } = W.add(this.Hh | 0, this.Hl | 0, $ | 0, H | 0), this.set(r, o, s, i, a, c, h, u, l, b, p, g, w, E, $, H);
  }
  roundClean() {
    Oe.fill(0), Ce.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class cy extends qo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class ly extends qo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class fy extends qo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
gn(() => new qo());
gn(() => new cy());
gn(() => new ly());
gn(() => new fy());
function hy(t, e, n) {
  const o = ww;
  if ($y(t, o))
    throw new Error(`String length exceeds maximum bytes ${o}`);
  return {
    type: ai.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: o
  };
}
var ft;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(ft || (ft = {}));
class uy extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class dy extends uy {
  constructor(e) {
    super(e);
  }
}
function Qh(t) {
  const e = [];
  return e.push(gr(Xi(t.version, 1))), e.push(gr(t.hash160)), Jn(e);
}
function t0(t) {
  const e = [], n = Yi(t.content), r = n.byteLength;
  return e.push(gr(Xi(r, t.lengthPrefixBytes))), e.push(n), Jn(e);
}
function ee(t, e) {
  return Jn([t, e]);
}
function py(t) {
  return new Uint8Array([t.type]);
}
function by(t) {
  return t.type === ft.OptionalNone ? new Uint8Array([t.type]) : ee(t.type, Rn(t.value));
}
function gy(t) {
  const e = new Uint8Array(4);
  return jo(e, t.buffer.length, 0), ee(t.type, Zi(e, t.buffer));
}
function xy(t) {
  const e = Kh(dw(t.value, BigInt(yw)), jh);
  return ee(t.type, e);
}
function wy(t) {
  const e = Kh(t.value, jh);
  return ee(t.type, e);
}
function yy(t) {
  return ee(t.type, Qh(t.address));
}
function my(t) {
  return ee(t.type, Zi(Qh(t.address), t0(t.contractName)));
}
function Sy(t) {
  return ee(t.type, Rn(t.value));
}
function Ey(t) {
  const e = [], n = new Uint8Array(4);
  jo(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const o = Rn(r);
    e.push(o);
  }
  return ee(t.type, Jn(e));
}
function Ay(t) {
  const e = [], n = new Uint8Array(4);
  jo(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((o, s) => o.localeCompare(s));
  for (const o of r) {
    const s = hy(o);
    e.push(t0(s));
    const i = Rn(t.data[o]);
    e.push(i);
  }
  return ee(t.type, Jn(e));
}
function e0(t, e) {
  const n = [], r = e == "ascii" ? gw(t.data) : Yi(t.data), o = new Uint8Array(4);
  return jo(o, r.length, 0), n.push(o), n.push(r), ee(t.type, Jn(n));
}
function vy(t) {
  return e0(t, "ascii");
}
function By(t) {
  return e0(t, "utf8");
}
function Rn(t) {
  switch (t.type) {
    case ft.BoolTrue:
    case ft.BoolFalse:
      return py(t);
    case ft.OptionalNone:
    case ft.OptionalSome:
      return by(t);
    case ft.Buffer:
      return gy(t);
    case ft.UInt:
      return wy(t);
    case ft.Int:
      return xy(t);
    case ft.PrincipalStandard:
      return yy(t);
    case ft.PrincipalContract:
      return my(t);
    case ft.ResponseOk:
    case ft.ResponseErr:
      return Sy(t);
    case ft.List:
      return Ey(t);
    case ft.Tuple:
      return Ay(t);
    case ft.StringASCII:
      return vy(t);
    case ft.StringUTF8:
      return By(t);
    default:
      throw new dy("Unable to serialize. Invalid Clarity Value.");
  }
}
const $y = (t, e) => t ? Yi(t).length > e : !1;
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var _y = Object.defineProperty, Ly = Object.defineProperties, Hy = Object.getOwnPropertyDescriptors, Ho = Object.getOwnPropertySymbols, n0 = Object.prototype.hasOwnProperty, r0 = Object.prototype.propertyIsEnumerable, dl = (t, e, n) => e in t ? _y(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, hi = (t, e) => {
  for (var n in e || (e = {})) n0.call(e, n) && dl(t, n, e[n]);
  if (Ho) for (var n of Ho(e)) r0.call(e, n) && dl(t, n, e[n]);
  return t;
}, ui = (t, e) => Ly(t, Hy(e)), ky = (t, e) => {
  var n = {};
  for (var r in t) n0.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Ho) for (var r of Ho(t)) e.indexOf(r) < 0 && r0.call(t, r) && (n[r] = t[r]);
  return n;
};
function Iy(t) {
  return t ? typeof t == "string" ? fn.fromName(t) : "version" in t ? t : "url" in t ? new ti({ url: t.url }) : t.transactionVersion === _o.Mainnet ? new ti({ url: t.client.baseUrl }) : new ei({ url: t.client.baseUrl }) : new ei();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var Uy = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(Uy || {}), Oy = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(Oy || {}), o0 = (t) => {
  let e = t;
  if (!e) {
    let n = new Gf(["store_write"], document.location.href);
    e = new Qs({ appConfig: n });
  }
  return e;
};
function Cy(t) {
  try {
    return o0(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Ny = (t) => {
  let e = o0(t).loadUserData().appPrivateKey, n = wt.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function s0(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? ui(hi({}, t), { message: Yc(e), domain: Yc(n) }) : ui(hi({}, t), { message: Ut(Rn(e)), domain: Ut(Rn(n)) });
}
async function Py(t, e) {
  return new wt.TokenSigner("ES256k", e).signAsync(s0(t));
}
async function Dy(t) {
  let e = t, { userSession: n } = e, r = ky(e, ["userSession"]);
  if (Cy(n)) {
    let { privateKey: o, publicKey: s } = Ny(n), i = ui(hi({}, r), { publicKey: s });
    return Py(i, o);
  }
  return wt.createUnsecuredToken(s0(t));
}
var Ty = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(Ty || {}), i0 = "asigna-stx", pl = (t, e) => new Promise((n) => {
  function r(o) {
    o.data.source === i0 && o.data[e] && (n(o.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(My(t, e), "*");
}), Fy = { authenticationRequest: async (t) => pl(t, "authenticationRequest"), transactionRequest: async (t) => pl(t, "transactionRequest") }, My = (t, e) => ({ source: i0, [e]: t }), Ry = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = Fy);
};
Ry();
const zy = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], na = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Wo = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, hr = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, Gy = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), a0 = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, o) => !!(r != null && r.id) && n.findIndex((s) => Gy(s, r)) === o
  );
}, Vy = (t) => t ? a0(Wo()).some(
  (e) => {
    var n;
    return e.id === t && (na(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Ky = () => {
  if (typeof window > "u")
    return;
  const t = Wo(), e = a0(t).filter(
    (n) => {
      var r;
      return na(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = hr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of zy) {
    const r = hr(t, n) ?? (t === window ? void 0 : hr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, jy = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Wo(), n = hr(e, t) ?? (e === window ? void 0 : hr(window, t)) ?? j2(t);
  if (n)
    return n;
  if (na(t) || Vy(t))
    return Ky();
}, qy = ["blockstack-session", "blockstack"], Wy = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of qy) {
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
Wy();
const Jy = () => Ih(), Xy = () => {
  var r, o;
  if (typeof window > "u")
    return;
  const t = Ih(), e = t ? jy(t) : void 0;
  if (e)
    return e;
  const n = Wo() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((o = n.xverseProviders) == null ? void 0 : o.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, Yy = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), bl = (t) => Tf(t).replace(/^0x/, ""), gl = "This wallet cannot sign messages. Try Xverse or Leather.", xl = (t) => typeof (t == null ? void 0 : t.request) == "function", wl = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", Zy = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, Qy = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function tm(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: bl(e.message),
    domain: bl(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function em(t, e) {
  const n = await Dy({
    domain: e.domain,
    message: e.message,
    network: Iy(e.network),
    stxAddress: e.stxAddress,
    appDetails: e.appDetails ?? Yy()
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function nm(t) {
  var o, s;
  const e = Jy() || "", n = /xverse/i.test(e);
  let r = Xy();
  if (n && !wl(r)) {
    const i = window;
    r = ((o = i.XverseProviders) == null ? void 0 : o.StacksProvider) ?? ((s = i.xverseProviders) == null ? void 0 : s.StacksProvider);
  }
  if (wl(r))
    try {
      return await em(r, t);
    } catch (i) {
      if (n || !xl(r) || !Qy(i)) throw i;
    }
  if (!n && xl(r))
    try {
      return await tm(r, t);
    } catch (i) {
      throw Zy(i) ? new Error(gl) : i;
    }
  throw new Error(gl);
}
function rm(t, e, n = {}) {
  const r = n.retryAfterMs ?? 3e4, o = n.now ?? Date.now, s = /* @__PURE__ */ new Map(), i = (a, c) => {
    c.pending = !0, c.failedAt = void 0, Promise.resolve().then(() => t(a)).then((h) => {
      c.pending = !1, h && (c.name = h, e());
    }).catch(() => {
      c.pending = !1, c.failedAt = o();
    });
  };
  return {
    get(a) {
      if (!a) return null;
      let c = s.get(a);
      return c ? !c.pending && c.name === null && c.failedAt !== void 0 && o() - c.failedAt >= r && i(a, c) : (c = { name: null, pending: !1 }, s.set(a, c), i(a, c)), c.name;
    }
  };
}
const om = {}, sm = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, im = (t) => {
  const e = om;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, am = (t) => `/hiro/${t}`, cm = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, lm = (t) => {
  const e = im(t);
  if (e)
    return [cm(e)];
  const n = sm[t];
  return typeof window < "u" ? [`${window.location.origin}${am(t)}`, ...n.filter((o) => !o.includes("hiro.so"))] : n;
}, fm = {}, yl = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, hm = "xtrata.log.enabled", um = "xtrata.log.level", dm = "xtrata.log.tags", pm = "xtrata.log.dedupe", co = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, bm = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, gm = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, xm = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, wm = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, ym = () => {
  const t = fm ?? {}, e = co(hm) ?? t.VITE_LOG_ENABLED, n = co(um) ?? t.VITE_LOG_LEVEL, r = co(dm) ?? t.VITE_LOG_TAGS, o = co(pm) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: bm(e),
    level: gm(n) ?? "warn",
    tags: wm(r),
    dedupe: xm(o)
  };
}, mm = (t, e, n) => !t.enabled || yl[n] < yl[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), Sm = (t, e, n, r) => {
  const o = ym();
  if (!mm(o, e, t) || Am(o.dedupe))
    return;
  const s = `[xtrata:${e}] ${n}`, i = console[t] ?? console.log;
  r !== void 0 ? i(s, r) : i(s);
}, Em = /* @__PURE__ */ new Set();
let ml = null;
const Am = (t, e, n, r, o) => (ml !== t && (Em.clear(), ml = t), !1), vm = (t, e, n) => Sm("debug", t, e, n), Bm = {}, $m = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, _m = (t) => {
  const e = Bm, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : $m[t];
}, Lm = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, Hm = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return Lm.test(n) ? n : null;
}, km = (t) => t.replace(/\/+$/, ""), Im = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), Sl = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.startsWith("0x") ? t.slice(2) : t;
  if (!e || e.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(e))
    return null;
  let n = "";
  for (let r = 0; r < e.length; r += 2) {
    const o = Number.parseInt(e.slice(r, r + 2), 16);
    if (o < 32 || o > 126)
      return null;
    n += String.fromCharCode(o);
  }
  return n;
}, $n = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, Um = (t) => {
  var c, h;
  let e;
  try {
    e = _n(ob(t));
  } catch {
    return null;
  }
  const n = $n(e);
  if (!n || n.success === !1)
    return null;
  const r = $n(n.value), o = $n(r == null ? void 0 : r.value), s = $n(o == null ? void 0 : o.value);
  if (!s)
    return null;
  const i = Sl((c = $n(s.name)) == null ? void 0 : c.value), a = Sl((h = $n(s.namespace)) == null ? void 0 : h.value);
  return !i || !a ? null : Hm(`${i}.${a}`);
}, Om = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${km(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, o = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [Tf(_p(t.address))]
    }),
    signal: t.signal
  });
  if (!o.ok)
    throw new Error(`BNS primary lookup failed (${o.status})`);
  const s = await o.json();
  return !(s != null && s.okay) || typeof s.result != "string" ? null : Um(s.result);
}, Cm = async (t) => {
  const e = t.address.trim();
  if (!sb(e))
    return null;
  const n = _m(t.network);
  if (!n)
    return null;
  let r = null;
  for (const o of lm(t.network))
    try {
      return await Om({
        baseUrl: o,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (s) {
      r = s;
    }
  return vm("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: Im(r)
  }), null;
}, Nm = "ParallaX Casino", Pm = "ParallaX Casino room sign-in. This is free: it sends no transaction, costs no fees and gives no permission to spend anything.";
new TextEncoder();
new TextDecoder();
const Dm = (t) => t === "mainnet" ? 1 : 2147483648, Tm = (t) => `${Pm} Account ${t.address}. Valid until ${new Date(t.expires).toISOString().replace(".000Z", "Z")}. Request code ${t.nonce}.`, Fm = (t) => ({
  domain: Uf({
    name: po(Nm),
    version: po("1"),
    "chain-id": If(Dm(t.network))
  }),
  message: po(Tm(t))
}), lo = (t) => !!t && typeof t.request == "function", ra = () => {
  try {
    const t = window.top;
    if (t && t !== window.self && t.location.origin === window.location.origin) return t;
  } catch {
  }
  return window;
}, Mm = () => {
  const t = ra();
  return t === window ? [window] : [t, window];
}, El = (t) => {
  for (const e of Mm()) {
    const n = t(e);
    if (n) return n;
  }
  return null;
}, Rm = (t) => {
  if (t === "leather") {
    const n = El((r) => lo(r.LeatherProvider) ? r.LeatherProvider : null);
    return n ? { rpc: n } : null;
  }
  const e = El((n) => {
    const r = n.XverseProviders || n.xverseProviders;
    return r && (lo(r.BitcoinProvider) || lo(r.StacksProvider)) ? r : null;
  });
  return e ? { rpc: lo(e.BitcoinProvider) ? e.BitcoinProvider : e.StacksProvider } : null;
}, zm = (t, e) => new Promise((n) => {
  const r = Date.now();
  (function o() {
    const s = Rm(t);
    s || Date.now() - r >= e ? n(s) : window.setTimeout(o, 150);
  })();
}), ko = (t) => {
  var e;
  return (t == null ? void 0 : t.code) ?? ((e = t == null ? void 0 : t.error) == null ? void 0 : e.code);
}, rn = (t) => {
  var e;
  return String((t == null ? void 0 : t.message) ?? ((e = t == null ? void 0 : t.error) == null ? void 0 : e.message) ?? t ?? "unknown error");
}, Gm = (t) => [4001, -31001].includes(Number(ko(t))) || /cancel|denied|reject|declin|closed/i.test(rn(t)), Al = (t) => Number(ko(t)) === -32601 || /not supported|method not found|unsupported|not implemented|legacy method/i.test(rn(t)), _s = async (t, e, n) => {
  const r = n === void 0 ? await t.request(e) : await t.request(e, n);
  if (r && typeof r == "object") {
    if (r.error) throw Object.assign(new Error(rn(r.error)), { code: ko(r.error) });
    if (r.status === "error") throw Object.assign(new Error(rn(r.error || r)), { code: ko(r.error || r) });
    if ("result" in r) return r.result;
  }
  return r;
}, Vm = (t) => new Promise((e, n) => {
  const r = window.setTimeout(() => n(new Error("The wallet did not answer. Check its window.")), 9e4);
  t.then((o) => {
    window.clearTimeout(r), e(o);
  }, (o) => {
    window.clearTimeout(r), n(o);
  });
}), Km = (t) => (JSON.stringify(t) || "").match(/S[PT][0-9A-HJKMNP-TV-Z]{38,39}/g) || [], Ne = [], zn = () => {
  const t = ra().ParallaxCasinoWalletUI ?? window.ParallaxCasinoWalletUI;
  try {
    return t && t.available() ? t : null;
  } catch {
    return null;
  }
}, jm = (t) => {
  const e = ra().ParallaxPasskeyWallet ?? window.ParallaxPasskeyWallet;
  return e != null && e.signRoomJoin ? e.signRoomJoin(t) : Promise.reject(new Error("The casino wallet is not loaded. Reload the page."));
};
async function qm(t) {
  if (t === "casino") {
    const o = zn();
    if (!o) throw new Error("The casino wallet is not available here yet. Reload the page.");
    const s = await o.open();
    if (!s) throw new Error("The casino wallet did not open.");
    return { kind: t, address: s, network: s.startsWith("SP") ? "mainnet" : "testnet", via: "casino-wallet" };
  }
  const e = await zm(t, 1500);
  if (!e) throw new Error(`${t === "leather" ? "Leather" : "Xverse"} was not found in this browser.`);
  Ne.length = 0;
  let n;
  if (t === "xverse") {
    try {
      await _s(e.rpc, "wallet_disconnect"), Ne.push("wallet_disconnect: ok");
    } catch (o) {
      Ne.push("wallet_disconnect: " + rn(o).slice(0, 80));
    }
    n = ["wallet_connect", "wallet_getAccount"];
  } else
    n = ["getAddresses", "stx_getAccounts", "stx_getAddresses", "stx_requestAccounts"];
  let r = null;
  for (const o of n)
    try {
      const s = await (t === "xverse" ? Vm(_s(e.rpc, o)) : _s(e.rpc, o)), i = Km(s);
      if (i.length) {
        const a = i[0];
        return Ne.push(`${o}: ok`), { kind: t, address: a, network: a.startsWith("SP") ? "mainnet" : "testnet", via: o };
      }
      Ne.push(`${o}: answered but no Stacks address in it`);
    } catch (s) {
      if (Gm(s))
        throw Ne.push(`${o}: cancelled`), new Error("Connection cancelled.");
      Ne.push(`${o}: ${Al(s) ? "not supported" : rn(s).slice(0, 80)}`), Al(s) || (r = s);
    }
  throw new Error(r ? rn(r) : "The wallet did not share a Stacks address.");
}
const c0 = (t) => {
  t !== "casino" && q2(t === "leather" ? "LeatherProvider" : "XverseProviders.BitcoinProvider");
}, Io = (t) => t instanceof Error ? t.message : String(t), Ls = 500, l0 = 40, Wm = 2e3, xr = 280, vl = "px_room_blocks_v1", Bl = "px_chat_ui_v1", Hs = "px_chat_session_v1:", $l = { hidden: !1, side: "left" }, Jm = [
  { code: "spam", label: "Spam" },
  { code: "abuse", label: "Abuse" },
  { code: "scam", label: "Scam" },
  { code: "other", label: "Something else" }
], Xm = (t) => {
  if (!Array.isArray(t)) return [];
  const e = [];
  for (const n of t)
    if (!(typeof n != "string" || !/^S[A-Z0-9]{19,60}$/.test(n) || e.includes(n)) && (e.push(n), e.length >= l0))
      break;
  return e;
}, Ym = (t) => {
  if (!t) return [];
  try {
    return Xm(JSON.parse(t));
  } catch {
    return [];
  }
}, Zm = (t) => {
  if (!t) return { ...$l };
  try {
    const e = JSON.parse(t);
    return { hidden: (e == null ? void 0 : e.hidden) === !0, side: (e == null ? void 0 : e.side) === "right" ? "right" : "left" };
  } catch {
    return { ...$l };
  }
}, f0 = {
  "no-links": "Links are not allowed in messages.",
  "too-long": `That message is too long (${xr} characters at most).`,
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
}, Qm = (t) => typeof t == "string" && Object.prototype.hasOwnProperty.call(f0, t), or = (t) => f0[String(t)] ?? "The room could not take that. Try again in a moment.", t3 = (t) => t.replace(/\s+/g, " ").trim(), e3 = (t) => Array.from(t).length, n3 = (t, e) => {
  const n = t3(t);
  return e.signed ? e.connected ? n ? e3(n) > xr ? { ok: !1, code: "too-long" } : e.now - e.lastSentAt < Wm ? { ok: !1, code: "slow-down" } : { ok: !0, text: n } : { ok: !1, code: "empty" } : { ok: !1, code: "offline" } : { ok: !1, code: "sign-in-first" };
};
class r3 {
  constructor() {
    An(this, "lines", []);
    An(this, "seq", 0);
    An(this, "blocked", /* @__PURE__ */ new Set());
  }
  setBlocked(e) {
    this.blocked = new Set(e);
  }
  add(e, n, r, o, s, i) {
    if (e && !r && this.blocked.has(e.a)) return null;
    const a = { id: this.seq += 1, who: e, mine: r, text: n, at: o };
    return s && (a.to = s), i && (a.tb = i), this.lines.push(a), this.lines.length > Ls && this.lines.splice(0, this.lines.length - Ls), a;
  }
  /** Blocking someone takes what they already said off the screen too, and the direct messages you sent them. */
  dropFrom(e) {
    this.lines = this.lines.filter((n) => {
      var r, o;
      return ((r = n.who) == null ? void 0 : r.a) !== e && ((o = n.to) == null ? void 0 : o.a) !== e;
    });
  }
  /** The last few things somebody said, as this browser received them: what a report can attach (short, so a report stays small). */
  lastFrom(e, n = 5, r = 120) {
    return this.lines.filter((o) => {
      var s;
      return ((s = o.who) == null ? void 0 : s.a) === e;
    }).slice(-n).map((o) => o.text.slice(0, r));
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
    for (const o of n.slice(-Ls)) {
      if (!o || typeof o.a != "string" || typeof o.t != "string" || typeof o.at != "number") continue;
      const s = typeof o.to == "string" ? { a: o.to } : void 0;
      this.add({ a: o.a }, o.t.slice(0, xr * 2), o.m === 1, o.at, s) && (r += 1);
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
class o3 {
  constructor() {
    An(this, "people", /* @__PURE__ */ new Map());
    An(this, "known", !1);
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
const s3 = `
.pxaddr{display:flex;flex-direction:column;gap:6px;margin:4px 0 8px}
.pxaddr .r{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;padding:6px 8px;border-radius:8px;background:rgba(255,255,255,.04);border:1px solid rgba(227,184,74,.25)}
.pxaddr .k{flex:1 1 100%;font-size:11px;letter-spacing:.03em;color:var(--dim,#c9b894)}
.pxaddr code{flex:1 1 0;min-width:0;font:12px/1.35 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:var(--ink,#f6ead0);overflow-wrap:anywhere;word-break:break-all;user-select:all;-webkit-user-select:all}
:is(#pxroom-panel,#pxchat,body) .pxaddr button{flex:0 0 auto;margin:0;font:inherit;font-size:12px;cursor:pointer;padding:5px 10px;border-radius:7px;background:rgba(12,9,14,.82);color:var(--ink,#f6ead0);border:1px solid rgba(227,184,74,.55)}
:is(#pxroom-panel,#pxchat,body) .pxaddr button:hover{background:rgba(227,184,74,.22)}
:is(#pxroom-panel,#pxchat,body) .pxaddr button.ok{background:rgba(70,140,90,.35);border-color:#9fd7b0}
`;
let _l = !1;
function i3() {
  if (_l) return;
  _l = !0;
  const t = document.createElement("style");
  t.textContent = s3, document.head.append(t);
}
async function a3(t, e) {
  var n;
  try {
    if ((n = navigator.clipboard) != null && n.writeText)
      return await navigator.clipboard.writeText(t), !0;
  } catch {
  }
  try {
    const r = window.getSelection(), o = document.createRange();
    let s = null;
    e ? o.selectNodeContents(e) : (s = document.createElement("textarea"), s.value = t, s.style.cssText = "position:fixed;left:-9999px;top:0", document.body.append(s), s.select()), e && r && (r.removeAllRanges(), r.addRange(o));
    const i = document.execCommand("copy");
    return s == null || s.remove(), i;
  } catch {
    return !1;
  }
}
const ir = (t, e, n) => {
  const r = document.createElement(t);
  return e !== void 0 && (r.textContent = e), n && (r.className = n), r;
};
function Ll(t, e) {
  const n = ir("div", void 0, "r"), r = ir("code", e), o = ir("button", "Copy");
  o.type = "button", o.setAttribute("aria-label", `Copy ${t.toLowerCase()}`);
  let s = 0;
  return o.onclick = async (i) => {
    i.stopPropagation();
    const a = await a3(e, r);
    o.textContent = a ? "Copied ✓" : "Select it and copy", o.classList.toggle("ok", a), window.clearTimeout(s), s = window.setTimeout(() => {
      o.textContent = "Copy", o.classList.remove("ok");
    }, 1800);
  }, n.append(ir("span", t, "k"), r, o), n;
}
function h0(t, e) {
  i3();
  const n = ir("div", void 0, "pxaddr"), r = /^S[TN]/.test(t);
  let o = null;
  if (r && e)
    try {
      o = e(t);
    } catch {
      o = null;
    }
  return n.append(Ll(r ? "Testnet address · what the casino plays with" : "Address", t)), o && o !== t && n.append(Ll("Mainnet address (same key) · send BNS names here", o)), n;
}
const Hl = (t) => typeof t == "string" && /^S[PTMN][0-9A-Z]{37,41}$/.test(t), c3 = `
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
#pxchat.peek #pxchat-lines,#pxchat.peek .newer{display:none}
#pxchat .panel .row{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-bottom:6px}
#pxchat .panel .row:last-child{margin-bottom:0}
#pxchat .panel .row > span{flex:1 1 auto;min-width:0;overflow-wrap:anywhere}
#pxchat-btn .dot{display:inline-block;min-width:16px;padding:0 4px;margin-left:6px;border-radius:9px;background:#e3b84a;color:#1a1208;font-size:11px;font-weight:700;text-align:center}
#pxchat-btn .dot.dm{background:#c58ee6}
@media (max-width:700px){#pxchat{font-size:12px}}
`, J = (t, e, n) => {
  const r = document.createElement(t);
  return e !== void 0 && (r.textContent = e), n && (r.className = n), r;
}, Nt = (t, e, n = "sm") => {
  const r = J("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function l3(t) {
  const e = new r3(), n = new o3();
  let r = { hidden: !1, side: "left" }, o = [];
  try {
    r = Zm(window.localStorage.getItem(Bl)), o = Ym(window.localStorage.getItem(vl));
  } catch {
  }
  e.setBlocked(o);
  let s = !1, i = null, a = !1, c = null, h = !1, u = "", l = 0, b = 0, p = 0, g = null, w = 0, E = !0, $ = null;
  const H = () => {
    try {
      window.localStorage.setItem(Bl, JSON.stringify(r));
    } catch {
    }
  }, y = () => {
    try {
      window.localStorage.setItem(vl, JSON.stringify(o));
    } catch {
    }
  }, _ = (m) => t.labelFor(m), v = () => {
    if ($)
      try {
        window.sessionStorage.setItem(Hs + $, e.dump());
      } catch {
      }
  }, P = (m) => {
    if (m)
      try {
        window.sessionStorage.removeItem(Hs + m);
      } catch {
      }
  }, M = (m) => {
    if (m !== $) {
      if (P($), e.clear(), Ht.forEach((F) => F.remove()), Ht.clear(), $ = m, m)
        try {
          e.load(window.sessionStorage.getItem(Hs + m));
        } catch {
        }
      E = !0;
    }
  }, O = (m) => o.includes(m), N = document.createElement("style");
  N.textContent = c3, document.head.append(N);
  const x = J("div");
  x.id = "pxchat";
  const A = J("div");
  A.id = "pxchat-lines";
  const k = J("button", "New messages ↓", "newer");
  k.type = "button", k.hidden = !0, A.setAttribute("role", "log"), A.setAttribute("aria-live", "polite"), A.setAttribute("aria-label", "Casino chat");
  const C = J("div", void 0, "panel");
  C.id = "pxchat-menu", C.hidden = !0;
  const R = J("div", void 0, "panel");
  R.id = "pxchat-panel", R.hidden = !0;
  const D = J("form");
  D.hidden = !0;
  const ht = J("button", void 0, "to");
  ht.type = "button", ht.hidden = !0;
  const rt = J("input");
  rt.type = "text", rt.autocomplete = "off", rt.enterKeyHint = "send", rt.maxLength = xr * 2;
  const Ke = J("button", "Send", "sm");
  Ke.type = "submit", D.append(ht, rt, Ke);
  const st = J("div", void 0, "bar");
  st.hidden = !0;
  const G = Nt("Here now", () => nr("people")), Lr = Nt("Hide chat", () => ns()), Xn = Nt("", () => {
    r.side = r.side === "left" ? "right" : "left", H(), et();
  }), yt = Nt("Blocked", () => nr("blocked")), je = Nt("Table", () => {
    a = !a, i = null, et(), s && rt.focus();
  });
  je.id = "pxchat-table", G.id = "pxchat-people", Lr.id = "pxchat-hide", Xn.id = "pxchat-side", yt.id = "pxchat-blocked", st.append(je, G, Lr, Xn, yt), x.append(A, k, C, R, D, st);
  const Et = J("button");
  Et.id = "pxchat-btn", Et.type = "button", Et.setAttribute("aria-controls", "pxchat");
  const Ht = /* @__PURE__ */ new Map(), Xo = () => s || !!c || !!u, Yo = () => {
    var m;
    return (m = window.matchMedia) != null && m.call(window, "(max-width:700px)").matches ? 5 : 8;
  }, xn = (m) => {
    const F = J("button", _(m.a), "nm");
    return F.type = "button", F.dataset.a = m.a, F.setAttribute("aria-label", `Options for ${_(m.a)}`), F.onclick = () => er(m), F;
  }, Zo = (m) => {
    const F = m.who ? `ln${m.mine ? " mine" : ""}${m.to ? " dm" : ""}${m.tb ? " tb" : ""}` : "ln note", Y = J("div", void 0, F);
    if (!m.who)
      return Y.append(J("span", m.text, "tx")), Y;
    const X = [];
    return m.to ? m.mine ? X.push(J("span", "You", "nm"), J("span", "→", "tag"), xn(m.to)) : X.push(xn(m.who), J("span", "→ you", "tag")) : (m.tb && X.push(J("span", "Table", "tag")), X.push(m.mine ? J("span", "You", "nm") : xn(m.who))), X.push(J("span", m.text, "tx")), X.forEach((it, ut) => {
      ut && Y.append(document.createTextNode(" ")), Y.append(it);
    }), Y;
  }, Hr = () => A.scrollTop + A.clientHeight >= A.scrollHeight - 8, kr = () => {
    A.scrollTop = A.scrollHeight, E = !0, k.hidden = !0;
  }, Qo = () => {
    const m = Xo(), F = m ? e.all() : e.tail(Yo()), Y = A.classList.contains("scroll");
    A.classList.toggle("scroll", m);
    const X = new Set(F.map((At) => At.id));
    let it = !1;
    for (const [At, vt] of Ht) X.has(At) || (vt.remove(), Ht.delete(At));
    let ut = null;
    for (const At of F) {
      let vt = Ht.get(At.id);
      vt || (vt = Zo(At), Ht.set(At.id, vt), it = !0);
      const he = ut ? ut.nextElementSibling : A.firstElementChild;
      he !== vt && A.insertBefore(vt, he), ut = vt;
    }
    if (!m) {
      k.hidden = !0, E = !0;
      return;
    }
    !Y || E ? kr() : it && (k.hidden = !1);
  }, Yn = () => {
    Et.replaceChildren(J("span", "💬", "ic"), J("span", "Chat", "lbl")), r.hidden && l > 0 && Et.append(J("span", l > 9 ? "9+" : String(l), b ? "dot dm" : "dot")), Et.setAttribute("aria-expanded", String(s && !r.hidden)), Et.setAttribute("aria-label", r.hidden && l ? `Chat: ${l} new${b ? `, ${b} sent to you` : ""}` : "Casino chat: type a message");
  }, wn = () => t.table ? t.table() : null, Zn = { blackjack: "blackjack", baccarat: "baccarat", sicbo: "Sic Bo", holdem: "Hold'em", roulette: "roulette", videopoker: "video poker", pvpholdem: "Salon Hold'em", liars: "Liar's Dice" }, Qn = () => {
    a && !wn() && (a = !1), D.hidden = !s || r.hidden, ht.hidden = !i && !a, ht.classList.toggle("tb", a && !i), i ? (ht.textContent = `To ${_(i.a)} ×`, ht.setAttribute("aria-label", `Writing to ${_(i.a)}. Press to write to the whole room instead.`)) : a && (ht.textContent = "To this table ×", ht.setAttribute("aria-label", "Writing to the people at your table. Press to write to the whole room instead.")), rt.classList.toggle("dm", !!i);
    const m = wn();
    je.hidden = !m, je.classList.toggle("on", a);
    const F = i ? `Message ${_(i.a)}` : a && m ? `Say something to the ${Zn[m] || m} table` : "Say something to the room";
    rt.placeholder = F, rt.setAttribute("aria-label", F);
  }, ts = () => {
    if (C.replaceChildren(), C.hidden = !c, !c) return;
    const m = c, F = O(m.a), Y = m.a === t.me();
    C.append(J("p", Y ? `${_(m.a)} (you)` : _(m.a), "who")), Hl(m.a) && !h && C.append(h0(m.a, t.mainnetOf));
    const X = J("div", void 0, "row");
    if (!Y) if (h) {
      C.append(J("p", "Why? Your report goes to the casino team with the last few things they said to you or the room."));
      for (const it of Jm) X.append(Nt(it.label, () => {
        Cr(m, it.code), Je();
      }));
    } else {
      const it = Nt("Message", () => {
        Je(), rs(m);
      });
      it.disabled = F || !n.has(m.a), F ? C.append(J("p", "You have blocked this person. Unblock them to message them.")) : n.known && !n.has(m.a) && C.append(J("p", "They have left the room.")), X.append(
        it,
        Nt(F ? "Unblock" : "Block", () => {
          Or(m, !F), Je();
        }),
        Nt("Report…", () => {
          h = !0, et();
        }, "sm danger")
      );
    }
    X.append(Nt("Cancel", Je)), C.append(X);
  }, es = () => {
    if (R.replaceChildren(), R.hidden = !u, u === "people") {
      const m = n.others(t.me());
      if (!n.known) R.append(J("p", t.connected() ? "Asking the room who is here…" : "Not connected to the room."));
      else if (!m.length) R.append(J("p", "Nobody else is signed in right now."));
      else {
        R.append(J("p", `Signed in now (${m.length}). Tap a name to message, block or report.`));
        for (const F of m) {
          const Y = J("div", void 0, "row"), X = J("span");
          X.append(xn(F)), O(F.a) && X.append(document.createTextNode(" (blocked)")), Y.append(X), R.append(Y);
        }
      }
    } else if (u === "blocked") {
      if (!o.length) {
        R.append(J("p", "You have not blocked anyone."));
        return;
      }
      R.append(J("p", "Blocked people cannot reach you and you cannot reach them."));
      for (const m of o) {
        const F = J("div", void 0, "row");
        F.append(J("span", _(m)), Nt("Unblock", () => {
          Or({ a: m }, !1), et();
        })), R.append(F);
      }
    }
  }, et = () => {
    x.hidden = r.hidden && !c, x.classList.toggle("peek", r.hidden && !!c), x.classList.remove("left", "right"), x.classList.add(r.side), st.hidden = !s || r.hidden;
    const m = n.others(t.me()).length;
    G.textContent = n.known ? `Here now (${m})` : "Here now", G.classList.toggle("on", u === "people"), Xn.textContent = r.side === "left" ? "Move right ▸" : "◂ Move left", yt.textContent = o.length ? `Blocked (${o.length})` : "Blocked", yt.classList.toggle("on", u === "blocked"), Yn(), Qn(), ts(), es(), Qo(), qe();
  }, qe = () => {
    const m = window.innerWidth, F = window.innerHeight, Y = document.getElementById("tools"), X = Math.round(Math.max(70, (Y ? Y.getBoundingClientRect().bottom : 58) + 12));
    let it = r.side === "left" ? 14 : null, ut = Math.min(340, m - 28), At = F - X - 12, vt = !1;
    const he = document.getElementById("intro"), Ct = he && he.getClientRects().length ? he.getBoundingClientRect() : null;
    Ct && Ct.width > 0 && Ct.height > 0 && Ct.bottom > X && (r.side === "left" ? Ct.left < 14 + ut : Ct.right > m - 14 - ut) && (r.side === "left" && m - Ct.right - 30 >= 260 ? (it = Math.round(Ct.right + 16), ut = Math.min(340, m - it - 14)) : (vt = !0, At = Math.max(170, Math.round(Ct.top - X - 8)))), x.style.top = `${X}px`, x.style.left = it === null ? "auto" : `${it}px`, x.style.right = it === null ? "14px" : "", x.style.width = `${ut}px`, x.style.maxHeight = `${At}px`, x.classList.toggle("over", vt && !x.hidden && (s || Ht.size > 0));
  }, pt = (m) => {
    e.add(null, m, !1, Date.now());
  }, tr = () => {
    try {
      document.pointerLockElement && document.exitPointerLock();
    } catch {
    }
  }, Ot = () => {
    if (!t.me()) {
      r.hidden && (r.hidden = !1, H()), s = !1, pt("Join the room to chat. Anyone can watch; you need one free signature to speak."), et(), t.joinPrompt();
      return;
    }
    r.hidden && (r.hidden = !1, H()), l = 0, b = 0, s = !0, tr(), et(), rt.focus();
  }, We = () => {
    s = !1, c = null, h = !1, u = "", rt.blur(), et();
  }, ns = () => {
    r.hidden = !0, H(), s = !1, c = null, h = !1, u = "", l = 0, b = 0, rt.blur(), et();
  }, Je = () => {
    c = null, h = !1, et();
  };
  function er(m) {
    c = m, h = !1, tr(), et();
  }
  function nr(m) {
    u = u === m ? "" : m, c = null, h = !1, et();
  }
  function rs(m) {
    if (O(m.a)) {
      pt(or("blocked")), et();
      return;
    }
    i = { a: m.a }, u = "", Ot();
  }
  const Ir = () => {
    i = null, a = !1, et(), rt.focus();
  }, Ur = () => {
    t.me() && t.send({ t: "blocks", list: o }) && (w = Date.now());
  };
  function Or(m, F) {
    const Y = _(m.a);
    if (F) {
      if (o.length >= l0) {
        pt(or("too-many-blocks"));
        return;
      }
      o.includes(m.a) || o.push(m.a), e.dropFrom(m.a), v(), (i == null ? void 0 : i.a) === m.a && (i = null), pt(`You blocked ${Y}. Neither of you will see the other's messages.`);
    } else
      o = o.filter((X) => X !== m.a), pt(`You unblocked ${Y}.`);
    e.setBlocked(o), Ht.forEach((X) => X.remove()), Ht.clear(), y(), Ur();
  }
  function Cr(m, F) {
    if (!t.me() || !t.connected()) {
      pt("Not connected to the room, so the report was not sent.");
      return;
    }
    t.send({ t: "report", who: m.a, why: F, lines: e.lastFrom(m.a) }) && (w = Date.now()), pt("Sending your report…");
  }
  Et.onclick = () => {
    s && !r.hidden ? We() : Ot();
  }, ht.onclick = Ir, k.onclick = () => kr(), A.addEventListener("scroll", () => {
    E = Hr(), E && (k.hidden = !0);
  }, { passive: !0 }), A.addEventListener("wheel", (m) => {
    A.classList.contains("scroll") && m.stopPropagation();
  }, { passive: !0 }), A.addEventListener("touchmove", (m) => {
    A.classList.contains("scroll") && m.stopPropagation();
  }, { passive: !0 }), D.onsubmit = (m) => {
    m.preventDefault();
    const F = Date.now(), Y = n3(rt.value, { signed: !!t.me(), connected: t.connected(), now: F, lastSentAt: p }), X = "Not connected to the room yet. Your message is still in the box.";
    if (!Y.ok) {
      pt(Y.code === "offline" ? X : or(Y.code)), et();
      return;
    }
    if (i && n.known && !n.has(i.a)) {
      pt(or("not-here")), et();
      return;
    }
    const it = i ? { t: "dm", to: i.a, text: Y.text } : a && wn() ? { t: "say", text: Y.text, ch: "table" } : { t: "say", text: Y.text };
    if (!t.send(it)) {
      pt(X), et();
      return;
    }
    p = F, w = F, g = { text: Y.text, to: i }, rt.value = "";
  }, rt.addEventListener("keydown", (m) => {
    m.stopPropagation(), m.key === "Escape" && (m.preventDefault(), i && !rt.value ? Ir() : We());
  }), rt.addEventListener("keypress", (m) => m.stopPropagation()), document.addEventListener("pointerdown", (m) => {
    if (!c && !u) return;
    const F = m.target;
    F && (x.contains(F) || Et.contains(F)) || (c = null, h = !1, u = "", et());
  }), window.addEventListener("resize", qe);
  const Nr = document.getElementById("intro");
  Nr && "MutationObserver" in window && new MutationObserver(() => qe()).observe(Nr, { attributes: !0, attributeFilter: ["class", "style", "hidden"] });
  const os = {
    button: Et,
    mount(m) {
      m.append(x), et();
    },
    /**
     * Someone spoke: `say` to the room or `dm` to one person. The room sends our own lines back too (to every tab of ours), so our
     * screen shows exactly what was delivered.
     */
    heard(m) {
      if (!(m != null && m.from) || typeof m.from.a != "string") return;
      const F = t.me(), Y = !!F && m.from.a === F, X = m.t === "dm" && m.to && typeof m.to.a == "string" ? { a: m.to.a } : void 0, it = m.t === "say" && m.ch === "table" && typeof m.tb == "string" ? m.tb : void 0;
      e.add({ a: m.from.a }, String(m.text ?? "").slice(0, xr * 2), Y, Date.now(), X, it) && (v(), Y ? (g = null, E = !0) : r.hidden && (l += 1, X && (b += 1)), et());
    },
    /**
     * The room refused something. Only a refusal of something chat just sent is chat's business: the room also says "slow down" to
     * the page's own seat updates, and those must not show up as chat notes. Returns whether chat took it.
     * A refused message goes back into the box so nothing typed is lost.
     */
    failed(m) {
      return !g && Date.now() - w > 4e3 ? !1 : (g && !rt.value && (rt.value = g.text, g.to && m !== "not-here" && m !== "no-such-player" && (i = g.to)), (m === "not-here" || m === "no-such-player") && (i = null), g = null, pt(or(m)), et(), !0);
    },
    reported() {
      pt("Report sent. Thank you."), et();
    },
    /** A fresh connection: the room has forgotten our block list, so hand it over again, and take its list of who is here. */
    room(m, F) {
      n.set(m), M(F ? t.me() : null), F ? Ur() : (s = !1, i = null, c = null, h = !1, u = "", rt.value = "", g = null), i && !n.has(i.a) && (i = null), et();
    },
    joined(m) {
      n.join(m), u === "people" || c ? et() : G.textContent = `Here now (${n.others(t.me()).length})`;
    },
    left(m) {
      n.leave(m), typeof m == "string" && (i == null ? void 0 : i.a) === m && (pt(`${_(m)} left the room.`), i = null), et();
    },
    /** The player pressed Leave the room: their session's chat is cleared from this tab now. */
    endSession() {
      M(null), s = !1, i = null, c = null, h = !1, u = "", rt.value = "", g = null, et();
    },
    /** The connection dropped: until the room speaks again we do not know who is here. Their chat stays: a reconnect is the same session. */
    disconnected() {
      n.forget(), et();
    },
    /** Names learned from BNS arrive late; relabel what is already on screen. */
    refreshNames() {
      x.querySelectorAll("button.nm[data-a]").forEach((m) => {
        m.textContent = _(m.dataset.a);
      }), i && Qn();
    },
    /** Someone tapped a person in the casino (their figure or name tag): show their menu, with their address. */
    openPerson(m) {
      return Hl(m) ? (er({ a: m }), !0) : !1;
    },
    isTyping: () => s,
    debug: () => ({ typing: s, hidden: r.hidden, side: r.side, target: (i == null ? void 0 : i.a) ?? null, blocks: [...o], lines: e.size, shown: Ht.size, session: $, stick: E, people: n.others(t.me()).map((m) => m.a) })
  };
  return Yn(), os;
}
const u0 = (t) => {
  if (!/^[0-9a-f]{64}$/.test(t)) throw new Error("A round seed is 64 hex characters.");
  const e = new Uint8Array(new ArrayBuffer(32));
  for (let n = 0; n < 32; n++) e[n] = parseInt(t.slice(n * 2, n * 2 + 2), 16);
  return e;
}, oa = (t) => {
  const e = u0(t), n = (h) => (e[h] | e[h + 1] << 8 | e[h + 2] << 16 | e[h + 3] << 24) >>> 0;
  let r = n(0) ^ n(16), o = n(4) ^ n(20), s = n(8) ^ n(24), i = n(12) ^ n(28);
  const a = () => {
    r >>>= 0, o >>>= 0, s >>>= 0, i >>>= 0;
    const h = r + o + i >>> 0;
    return i = i + 1 >>> 0, r = o ^ o >>> 9, o = s + (s << 3) >>> 0, s = s << 21 | s >>> 11, s = s + h >>> 0, h;
  };
  for (let h = 0; h < 12; h++) a();
  return { next: a, below: (h) => {
    const u = Math.floor(4294967296 / h) * h;
    for (; ; ) {
      const l = a();
      if (l < u) return l % h;
    }
  } };
}, f3 = (t) => oa(t).below(37), h3 = ["S", "H", "D", "C"], u3 = (t, e = 6) => {
  const n = oa(t), r = Array.from({ length: 416 }, (s, i) => i), o = [];
  for (let s = 0; s < e; s++) {
    const i = s + n.below(r.length - s), a = r[i];
    r[i] = r[s], r[s] = a;
    const c = a % 52;
    o.push({ r: 2 + c % 13, s: h3[Math.floor(c / 13)] });
  }
  return o;
}, d3 = (t) => {
  const e = oa(t);
  return [e.below(6) + 1, e.below(6) + 1, e.below(6) + 1];
}, p3 = () => {
  const t = globalThis.crypto;
  if (!(t != null && t.subtle)) throw new Error("WebCrypto is not available.");
  return t.subtle;
}, b3 = (t) => [...new Uint8Array(t)].map((e) => e.toString(16).padStart(2, "0")).join(""), g3 = async (t) => b3(await p3().digest("SHA-256", u0(t))), x3 = async (t, e) => {
  try {
    return await g3(t) === e;
  } catch {
    return !1;
  }
}, f = {
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
  retryTimer: 0,
  // who is here (docs/plans/CASINO-WHO-IS-HERE-PLAN.md): everyone signed in (with whether they are away), the visitor's own away,
  // whether this tab has left by itself (parked: in the background too long, or idle too long), and the clocks for those
  players: /* @__PURE__ */ new Map(),
  away: !1,
  parked: "",
  lastActive: Date.now(),
  hiddenAt: 0,
  lastBeat: 0,
  // the welcome card (docs/plans/CASINO-WELCOME-JOIN-PLAN.md): the join step lives in the page's welcome card, not a second window
  resumed: !1,
  // signed in from an earlier visit's session (the card says "Welcome back")
  trying: null,
  // the wallet being asked right now, for the card's "Check Leather..." line
  later: !1,
  // the visitor went in without signing in: the card's join step shrinks to one line
  introSeen: !1
  // the welcome card has shown while the room was on: no separate arrival panel
}, Qe = (() => {
  const t = { beat: 3e4, hide: 3e5, away: 12e5, leave: 144e5, guest: 18e5 };
  try {
    const e = /[?&]roomtimes=(\d+),(\d+),(\d+),(\d+)/.exec(location.search);
    e && (t.beat = +e[1], t.hide = +e[2], t.away = +e[3], t.leave = +e[4], t.guest = Math.min(t.guest, +e[4]));
  } catch {
  }
  return t;
})();
let z = null;
const w3 = (t) => t.length <= 12 ? t : `${t.slice(0, 5)}…${t.slice(-4)}`, sa = (t) => {
  if (t.startsWith("SP")) return t;
  const e = Oi(t);
  return zs({ ...e, version: Ds.MainnetSingleSig });
}, y3 = rm((t) => Cm({ address: sa(t), network: "mainnet" }), () => {
  wr(), Uo(), z == null || z.refreshNames(), Q();
}), Yt = (t) => {
  let e = null;
  try {
    e = y3.get(t);
  } catch {
  }
  return e || w3(t);
}, d0 = (t, e) => ({ key: t, label: Yt(t), x: e.x, z: e.z, r: e.r, at: e.at }), Uo = () => {
  var n, r;
  if (!((n = f.host) != null && n.moves) || f.service !== "ok") return;
  const t = ((r = f.you) == null ? void 0 : r.a) ?? null, e = [...f.walk.entries()].filter(([o]) => o !== t).map(([o, s]) => d0(o, s));
  try {
    f.host.moves(e);
  } catch (o) {
    console.warn("[room] the page could not draw the walkers", o);
  }
}, fo = (t, e) => {
  var n, r;
  if (e ? f.walk.set(t, e) : f.walk.delete(t), !(!((n = f.host) != null && n.move) || t === (((r = f.you) == null ? void 0 : r.a) ?? null)))
    try {
      f.host.move(e ? d0(t, e) : { key: t, off: !0 });
    } catch (o) {
      console.warn("[room] the page could not move a walker", o);
    }
}, p0 = () => {
  var t;
  !f.features.includes("move") || f.service !== "ok" || !f.connected || !f.signed || !f.you || f.you.guest || ((t = f.ws) == null ? void 0 : t.readyState) === WebSocket.OPEN && (f.ownMove ? (f.ws.send(JSON.stringify({ t: "move", ...f.ownMove })), f.ownSent = !0) : f.ownSent && (f.ws.send(JSON.stringify({ t: "move", off: !0 })), f.ownSent = !1));
}, Rt = (t) => {
  var e, n;
  try {
    (n = (e = f.host) == null ? void 0 : e.on) == null || n.call(e, t);
  } catch (r) {
    console.warn("[room] the page could not take a room message", r);
  }
}, m3 = /^(react|win|daily|round|gift|pvp|table|no-table|log|bal|board|friends|tourney|card|mission|cres|cbet)/, wr = () => {
  var n;
  if (!f.host || f.service !== "ok") return;
  const t = ((n = f.you) == null ? void 0 : n.a) ?? null, e = Object.entries(f.spots).filter(([, r]) => r.a !== t).map(([r, o]) => ({ key: o.a, spot: r, label: Yt(o.a), since: o.since }));
  try {
    f.host.setPeople(e);
  } catch (r) {
    console.warn("[room] the page could not draw the people", r);
  }
}, yr = async (t, e) => {
  const n = await fetch(t, { credentials: "same-origin", ...e });
  let r = null;
  try {
    r = await n.json();
  } catch {
  }
  return { res: n, body: r };
}, di = (t) => {
  var e;
  return ((e = f.ws) == null ? void 0 : e.readyState) !== WebSocket.OPEN ? !1 : (f.ws.send(JSON.stringify(t)), f.lastSent = Date.now(), !0);
}, b0 = () => {
  var e;
  if (f.service !== "ok" || !f.connected || !f.you || f.you.guest || !f.signed || f.away) return;
  const t = ((e = Object.entries(f.spots).find(([, n]) => n.a === f.you.a)) == null ? void 0 : e[0]) ?? null;
  f.want ? t !== f.want && f.want !== f.badSpot && f.want !== f.yielded && !f.spots[f.want] && Date.now() - f.lastSent > 1200 && di({ t: "sit", spot: f.want }) : t && t !== f.standSent && Date.now() - f.lastSent > 600 && (f.standSent = t, di({ t: "stand" }));
}, Jo = () => {
  if (f.service !== "ok" || f.ws) return;
  f.attempts += 1;
  let t;
  try {
    t = new WebSocket(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/casino/room/ws`);
  } catch {
    return Il();
  }
  f.ws = t, t.onopen = () => {
    f.connected = !0, f.attempts = 0, Q();
  }, t.onmessage = (e) => {
    var r, o, s, i, a;
    let n;
    try {
      n = JSON.parse(String(e.data));
    } catch {
      return;
    }
    switch (n.t) {
      case "room":
        f.you = n.you, f.spots = n.spots || {}, f.joined = n.joined, f.guests = n.guests, f.watch = n.watch !== !1, f.arrivedAt || (f.arrivedAt = Date.now()), f.features = Array.isArray(n.features) ? n.features.filter((c) => typeof c == "string") : [], f.walk = /* @__PURE__ */ new Map();
        for (const c of Array.isArray(n.walkers) ? n.walkers : []) c && typeof c.a == "string" && f.walk.set(c.a, { x: +c.x, z: +c.z, r: +c.r, at: +c.at });
        Uo(), f.ownSent = !1, p0(), f.standSent = null, f.signed && ((r = f.you) != null && r.guest) && (f.signed = null), z == null || z.room(n.players, !!(f.you && !f.you.guest)), f.players = /* @__PURE__ */ new Map();
        for (const c of Array.isArray(n.players) ? n.players : []) c && typeof c.a == "string" && f.players.set(c.a, { a: c.a, aw: c.aw === !0 });
        ar(), f.features.includes("here") && ((o = f.ws) == null ? void 0 : o.readyState) === WebSocket.OPEN && (f.ws.send(JSON.stringify({ t: "here" })), f.away && f.signed && f.you && !f.you.guest && f.ws.send(JSON.stringify({ t: "away", on: !0 }))), Rt({
          t: "room",
          features: f.features.slice(),
          wins: n.wins || [],
          bets: n.bets || {},
          seekers: n.seekers || [],
          at: n.at,
          you: f.you,
          watch: f.watch,
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
        f.spots[n.spot] = n.who, (s = n.who) != null && s.a && f.walk.has(n.who.a) && fo(n.who.a, null);
        break;
      case "stood":
        delete f.spots[n.spot], f.standSent === n.spot && (f.standSent = null);
        break;
      case "moved":
        f.yielded = n.spot;
        break;
      case "count":
        f.joined = n.joined, f.guests = n.guests;
        break;
      case "say":
      case "dm":
        z == null || z.heard(n), n.t === "say" && Rt(n);
        return;
      case "join":
        n.who && typeof n.who.a == "string" && f.players.set(n.who.a, { a: n.who.a }), z == null || z.joined(n.who), Rt(n), Q();
        return;
      case "leave":
        f.players.delete(n.a), ar(), z == null || z.left(n.a), f.walk.has(n.a) && fo(n.a, null), Rt(n), Q();
        return;
      case "away":
        typeof n.a == "string" && (f.players.set(n.a, { a: n.a, aw: n.on === !0 }), ar());
        break;
      case "react":
      case "win":
      case "daily":
      case "round":
      case "bet":
      case "gift":
      case "seek":
      case "pvp":
      case "spec":
        Rt(n);
        return;
      case "cres":
      case "cgone":
      case "cend":
      case "cbet":
      case "cpool":
      case "cpay":
        Rt(n);
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
        Rt(n);
        return;
      case "reported":
        z == null || z.reported();
        return;
      case "play":
        if (typeof n.spot == "string" && Array.isArray(n.s) && typeof n.b == "number")
          try {
            (a = (i = f.host) == null ? void 0 : i.play) == null || a.call(i, n.spot, { a: String(n.a || ""), s: n.s, b: n.b, f: !!n.f });
          } catch (c) {
            console.warn("[room] the page could not show a spin", c);
          }
        return;
      case "move":
        typeof n.a == "string" && (n.off ? fo(n.a, null) : [n.x, n.z, n.r, n.at].every((c) => typeof c == "number" && Number.isFinite(c)) && fo(n.a, { x: n.x, z: n.z, r: n.r, at: n.at }));
        return;
      case "err":
        if (typeof n.code == "string" && (n.code.startsWith("play-") || n.code.startsWith("move-")) || typeof n.code == "string" && m3.test(n.code) && (Rt({ t: "err", code: n.code }), n.code !== "no-table"))
          return;
        n.code === "no-such-spot" || typeof n.code == "string" && n.code.startsWith("salon-") ? f.badSpot = f.want : Qm(n.code) && (z != null && z.failed(n.code)) || n.code === "slow-down" && (f.lastSent = Date.now() + 3e3);
        return;
      default:
        return;
    }
    wr(), b0(), Q();
  }, t.onclose = (e) => {
    if (f.ws === t) {
      if (f.ws = null, f.connected = !1, f.spots = {}, wr(), f.walk = /* @__PURE__ */ new Map(), Uo(), f.ownSent = !1, f.players = /* @__PURE__ */ new Map(), ar(), z == null || z.disconnected(), e.code === 4001) {
        f.replaced = !0, Q();
        return;
      }
      Q(), Il();
    }
  }, t.onerror = () => {
  };
};
let kl = "";
const ar = () => {
  var n, r;
  const t = [...f.players.values()].filter((o) => o.aw).map((o) => o.a).sort(), e = t.join();
  if (e !== kl) {
    kl = e;
    try {
      (r = (n = f.host) == null ? void 0 : n.awayOf) == null || r.call(n, t);
    } catch (o) {
      console.warn("[room] the page could not take who is away", o);
    }
  }
}, ks = (t) => {
  if (f.parked || !f.ws) return;
  f.parked = t;
  const e = f.ws;
  f.ws = null, f.connected = !1, window.clearTimeout(f.retryTimer);
  try {
    e.close(1e3, t);
  } catch {
  }
  f.spots = {}, wr(), f.walk = /* @__PURE__ */ new Map(), Uo(), f.ownSent = !1, f.players = /* @__PURE__ */ new Map(), ar(), z == null || z.disconnected(), Q();
}, ia = () => {
  f.parked && (f.parked = "", f.attempts = 0, f.lastActive = Date.now(), Jo(), Q());
}, g0 = (t) => {
  var e, n, r;
  if (f.away !== t) {
    if (f.away = t, ((e = f.ws) == null ? void 0 : e.readyState) === WebSocket.OPEN && f.features.includes("here") && f.signed && f.you && !f.you.guest && f.ws.send(JSON.stringify({ t: "away", on: t })), t)
      try {
        (r = (n = f.host) == null ? void 0 : n.standUp) == null || r.call(n);
      } catch (o) {
        console.warn("[room] the page could not stand the visitor up", o);
      }
    Q();
  }
}, nn = () => {
  f.lastActive = Date.now(), f.away && g0(!1), (f.parked === "idle" || f.parked === "hidden" && !document.hidden) && ia();
}, S3 = () => {
  var o;
  if (f.service !== "ok") return;
  const t = Date.now();
  if (((o = f.ws) == null ? void 0 : o.readyState) === WebSocket.OPEN && f.features.includes("here") && t - f.lastBeat >= Qe.beat) {
    f.lastBeat = t;
    try {
      f.ws.send("ping");
    } catch {
    }
  }
  if (f.parked) return;
  const e = t - f.lastActive, n = !!(f.signed && f.you && !f.you.guest), r = document.hidden && f.hiddenAt ? t - f.hiddenAt : 0;
  if (!n) {
    r > Qe.hide ? ks("hidden") : e > Qe.guest && ks("idle");
    return;
  }
  e > Qe.leave ? ks("idle") : !f.away && f.features.includes("here") && (r > Qe.hide || e > Qe.away) && g0(!0);
}, Il = () => {
  window.clearTimeout(f.retryTimer);
  const t = Math.min(15e3, 1e3 * 2 ** Math.min(f.attempts, 4));
  f.retryTimer = window.setTimeout(() => {
    f.ws || Jo();
  }, t);
}, _r = () => {
  const t = f.ws;
  f.ws = null, f.connected = !1, f.attempts = 0, f.replaced = !1;
  try {
    t == null || t.close(1e3, "client");
  } catch {
  }
  Jo();
};
let Gt = 0;
const pi = () => new Error("Sign-in cancelled.");
async function x0(t, e = Gt) {
  const { res: n, body: r } = await yr(`/casino/room/challenge?address=${encodeURIComponent(t.address)}`);
  if (!n.ok) throw new Error((r == null ? void 0 : r.error) || `The room answered ${n.status}.`);
  const o = r.challenge, { domain: s, message: i } = Fm(o);
  f.busy = "sign", Q();
  let a;
  try {
    a = t.kind === "casino" ? await jm(o) : await nm({
      domain: s,
      message: i,
      network: o.network,
      stxAddress: t.address,
      appDetails: { name: "ParallaX Casino", icon: `${location.origin}/favicons/xtrata-apple-touch-icon.png` }
    });
  } catch (u) {
    throw e !== Gt ? pi() : new Error("The wallet did not sign: " + Io(u));
  }
  if (e !== Gt) throw pi();
  const { res: c, body: h } = await yr("/casino/room/session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ challenge: o, signature: a })
  });
  if (!c.ok) throw new Error((h == null ? void 0 : h.error) || `The room answered ${c.status}.`);
  f.signed = { address: h.address, hash160: h.hash160, expiresAt: h.expiresAt }, f.resumed = !1, _r();
}
async function w0(t) {
  var r, o;
  if (f.busy) return;
  const e = ++Gt;
  f.error = "", f.busy = "connect", f.trying = t, Q();
  const n = t === "casino" && !((r = zn()) != null && r.describe().has);
  try {
    const s = await qm(t);
    if (e !== Gt) throw pi();
    f.wallet = s, c0(t), await x0(s, e), f.open = !1, n && ((o = zn()) == null || o.fundNew().catch(() => {
    }));
  } catch (s) {
    e === Gt && (f.error = /cancel/i.test(Io(s)) ? "" : Io(s));
  } finally {
    e === Gt && (f.busy = "", f.trying = null), Q();
  }
}
const E3 = () => {
  Gt++, f.busy = "", f.trying = null, f.error = "", Q();
};
async function A3(t) {
  var o;
  const e = t.detail;
  if (!e || typeof e.address != "string" || f.service !== "ok" || f.busy || ((o = f.signed) == null ? void 0 : o.address) === e.address) return;
  const n = e.kind === "casino" || e.kind === "leather" || e.kind === "xverse" ? e.kind : null;
  if (!n) return;
  const r = ++Gt;
  f.error = "", f.busy = "sign", f.trying = n, Q();
  try {
    f.wallet = { kind: n, address: e.address, network: e.address.startsWith("SP") ? "mainnet" : "testnet", via: "page" }, c0(n), await x0(f.wallet, r), f.open = !1;
  } catch (s) {
    const i = Io(s);
    r === Gt && !/cancel/i.test(i) && (f.error = i, f.open = !B0());
  } finally {
    r === Gt && (f.busy = "", f.trying = null), Q();
  }
}
const v3 = 2e3, B3 = () => {
  var t;
  f.service === "ok" && B0() && (f.introSeen || (f.introSeen = !0, Q())), !f.introSeen && (f.prompted || f.service !== "ok" || !f.connected || f.signed || f.busy || f.open || !f.arrivedAt || Date.now() - f.arrivedAt < v3 || (t = f.host) != null && t.currentSpot() || (f.prompted = !0, f.open = !0, Q()));
}, y0 = () => {
  const t = zn();
  let e = null;
  try {
    e = localStorage.getItem("STX_PROVIDER");
  } catch {
  }
  const n = /Xverse/.test(e || "") ? ["xverse", "leather"] : ["leather", "xverse"];
  return t ? t.describe().has || !e ? ["casino", ...n] : [n[0], "casino", n[1]] : n;
};
async function m0() {
  try {
    await yr("/casino/room/session", { method: "DELETE" });
  } catch {
  }
  f.signed = null, f.wallet = null, f.error = "", f.resumed = !1, f.later = !1, z == null || z.endSession(), z == null || z.disconnected(), _r(), Q();
}
const $3 = `
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
#pxroom-btn.away i{background:#8a8f98;box-shadow:none}
#pxroom-btn .lbl{display:inline-block;max-width:150px;overflow:hidden;text-overflow:ellipsis;vertical-align:bottom;white-space:nowrap}
#pxroom-panel .here{display:flex;flex-direction:column;gap:4px;max-height:240px;overflow:auto;margin:0 0 10px}
#pxroom-panel .here .person{display:flex;justify-content:space-between;align-items:center;gap:8px;flex:none;text-align:left;padding:6px 10px;background:rgba(255,255,255,.03);border:1px solid rgba(227,184,74,.25)}
#pxroom-panel .here .nm{color:var(--ink,#f6ead0);font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#pxroom-panel .here .at{color:var(--dim,#b7a587);font-size:12px;white-space:nowrap}
#pxroom-panel .here .away .nm,#pxroom-panel .here .away .at{color:#8a8f98;font-style:italic}
#pxroom-panel{position:fixed;top:max(64px,calc(env(safe-area-inset-top) + 54px));right:10px;width:min(320px,calc(100vw - 20px));z-index:40;box-sizing:border-box;padding:14px 16px;border-radius:12px;background:rgba(12,9,14,.98);backdrop-filter:blur(6px);color:var(--ink,#f6ead0);border:1px solid var(--gold,#e3b84a);box-shadow:0 10px 40px rgba(0,0,0,.55);font-size:13px;line-height:1.45;pointer-events:auto}
#pxroom-panel{overflow-y:auto;overscroll-behavior:contain}
#pxroom-panel[hidden]{display:none}
#pxroom-panel .top{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 0 2px}
#pxroom-panel .top h3{margin:0}
#pxroom-panel button.x{flex:none;width:28px;height:28px;padding:0;border-radius:50%;font-size:18px;line-height:1;background:transparent;border-color:rgba(227,184,74,.4)}
#pxroom-panel .who{font-size:16px;margin:0 0 2px}
#pxroom-panel p.sub{font-size:12px;margin:0 0 12px}
#pxroom-panel h3:not(:first-child){margin-top:4px}
#pxroom-panel details.fold{margin:0 0 8px;border:1px solid rgba(227,184,74,.22);border-radius:8px;padding:0 10px}
#pxroom-panel details.fold summary{cursor:pointer;padding:9px 0;color:var(--ink,#f6ead0);font-weight:600;list-style:none;display:flex;justify-content:space-between}
#pxroom-panel details.fold summary::-webkit-details-marker{display:none}
#pxroom-panel details.fold summary:after{content:'+';color:var(--gold,#e3b84a);font-weight:400}
#pxroom-panel details.fold[open] summary:after{content:'–'}
#pxroom-panel details.fold[open]{padding-bottom:4px}
#pxroom-panel .foot{position:sticky;bottom:-14px;display:flex;gap:8px;margin:10px -16px -14px;padding:10px 16px 14px;background:rgba(12,9,14,.98);border-top:1px solid rgba(227,184,74,.2)}
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
#intro #introJoin{margin:0 0 4px;padding:14px 0 0;border-top:1px solid rgba(227,184,74,.18)}
#intro #introJoin[hidden]{display:none}
#introJoin .jh{display:flex;align-items:center;gap:8px;margin:0 0 6px;font:700 10px Arial,sans-serif;letter-spacing:.2em;color:var(--gold,#e3b84a);text-transform:uppercase}
#introJoin .jh i{font-style:normal;display:inline-grid;place-items:center;width:18px;height:18px;border-radius:50%;border:1px solid var(--gold,#e3b84a);font-size:10px;letter-spacing:0}
#introJoin .jh.done i{border-color:#2fae66;color:#2fae66}
#intro #introJoin p{font:11.5px/1.6 Arial,sans-serif;color:#9aa6b6;margin:0 0 10px;max-width:none}
#intro #introJoin p b{color:#e8d6b0;font-weight:600}
#intro #introJoin p.fine{font-size:10px;line-height:1.5;color:#7f8ca0;margin:0 0 4px}
#intro #introJoin p.fine b{color:#b9c3d0}
#intro #introJoin p.lead2{font-size:12px;color:#aab4c2}
#introJoin .wallets{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:0 0 8px}
#introJoin .wallets button{font:600 13px Arial,sans-serif;color:var(--ink,#f6ead0);background:rgba(227,184,74,.08);border:1px solid rgba(227,184,74,.55);border-radius:6px;padding:11px 10px;text-align:left;cursor:pointer;margin:0;letter-spacing:0;text-transform:none;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#introJoin .wallets button small{display:block;font:400 10px Arial,sans-serif;color:#8997a9;margin-top:3px;white-space:normal}
#introJoin .wallets button.wide{grid-column:1/-1;background:linear-gradient(100deg,rgba(227,184,74,.22),rgba(227,184,74,.08));border-color:var(--gold,#e3b84a)}
#introJoin .wallets button:hover:not(:disabled){background:rgba(227,184,74,.24)}
#introJoin .wallets button:disabled{opacity:.5;cursor:default}
#introJoin .wallets button.on{opacity:.85;border-style:dashed}
#introJoin .lnk{display:inline;background:none!important;border:0!important;padding:0!important;margin:0;font:11px Arial,sans-serif!important;color:#b7a587!important;text-decoration:underline;text-underline-offset:3px;cursor:pointer;width:auto;letter-spacing:0;text-transform:none}
#introJoin .lnk.guest{display:block;margin:6px auto 4px}
#introJoin .msg{display:flex;gap:10px;align-items:center;border:1px dashed rgba(227,184,74,.6);border-radius:6px;padding:12px;font:12px/1.5 Arial,sans-serif;color:#e8d6b0;margin:0 0 8px}
#introJoin .msg small{display:block;color:#9aa6b6;font-size:11px}
#introJoin .msg.err{border-style:solid;border-color:rgba(255,120,120,.6);color:#ffb0b0;background:rgba(120,30,30,.18)}
#introJoin .spin{width:16px;height:16px;flex:none;border:2px solid rgba(227,184,74,.3);border-top-color:var(--gold,#e3b84a);border-radius:50%;animation:pxspin .9s linear infinite}
@keyframes pxspin{to{transform:rotate(360deg)}}
#introJoin .me{display:flex;align-items:center;gap:12px;background:rgba(47,174,102,.08);border:1px solid rgba(47,174,102,.45);border-radius:6px;padding:10px 12px;margin:0 0 8px}
#introJoin .me.away{background:rgba(138,143,152,.08);border-color:rgba(138,143,152,.45)}
#introJoin .me .dot{width:10px;height:10px;border-radius:50%;background:#2fae66;box-shadow:0 0 8px #2fae66;flex:none}
#introJoin .me.away .dot{background:#8a8f98;box-shadow:none}
#introJoin .me div{min-width:0;flex:1}
#introJoin .me b{display:block;font:600 15px Arial,sans-serif;color:var(--ink,#f6ead0);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#introJoin .me div span{font:11px Arial,sans-serif;color:#9aa6b6}
#introJoin .me .lnk{flex:none}
#intro #introJoin p.here{font-size:11px;margin:0 0 4px}
#intro #introJoin p.here b{color:var(--gold,#e3b84a)}
#introJoin button.later{display:flex;width:100%;justify-content:space-between;align-items:center;gap:10px;margin:0 0 4px;padding:10px 12px;border:1px solid rgba(227,184,74,.35);border-radius:6px;background:rgba(227,184,74,.06);font:11.5px Arial,sans-serif;color:#9aa6b6;text-align:left;cursor:pointer;letter-spacing:0;text-transform:none}
#introJoin button.later b{color:#e8d6b0;font-weight:600}
#introJoin button.later .go{color:var(--gold,#e3b84a);font-size:16px}
@media(max-width:620px){
  #intro #introJoin{padding-top:10px}
  #introJoin .wallets button{padding:9px 8px;font-size:12px}
  #introJoin .me{padding:8px 10px}
  #introJoin .me b{font-size:14px}
}
`, U = (t, e, n) => {
  const r = document.createElement(t);
  return e !== void 0 && (r.textContent = e), n && (r.className = n), r;
}, sr = (t, e) => {
  const n = U("p", void 0, "fact");
  return n.append(U("b", t), document.createTextNode(` ${e}`)), n;
};
let Pe = null, $t = null, bt = null;
function _3() {
  var n, r;
  if (Pe || f.service !== "ok") return;
  const t = document.createElement("style");
  t.textContent = $3, document.head.append(t), Pe = U("span"), Pe.id = "pxroom", $t = U("button"), $t.id = "pxroom-btn", $t.type = "button", $t.setAttribute("aria-label", "Casino room: see who is here and join"), $t.onclick = () => {
    f.open = !f.open, Q();
  }, bt = U("div"), bt.id = "pxroom-panel", bt.hidden = !0, z = l3({
    send: di,
    me: () => f.you && !f.you.guest ? f.you.a : null,
    connected: () => f.connected,
    labelFor: Yt,
    mainnetOf: sa,
    joinPrompt: () => {
      f.open = !0, Q();
    },
    table: () => {
      var o, s;
      return f.features.includes("table") ? ((s = (o = f.host) == null ? void 0 : o.table) == null ? void 0 : s.call(o)) ?? null : null;
    }
  }), Pe.append($t, z.button);
  const e = ((r = (n = f.host) == null ? void 0 : n.mount) == null ? void 0 : r.call(n)) ?? document.querySelector("#tools .rt");
  e ? e.insertBefore(Pe, e.firstChild) : (Pe.style.cssText = "position:fixed;top:10px;right:10px;z-index:30", document.body.append(Pe)), document.body.append(bt), z.mount(document.body), document.addEventListener("keydown", (o) => {
    o.key === "Escape" && f.open && (f.open = !1, Q());
  }), document.addEventListener("pointerdown", (o) => {
    if (!f.open) return;
    const s = o.target;
    s && (bt.contains(s) || $t.contains(s)) || (f.open = !1, Q());
  }), window.addEventListener("resize", () => Q());
}
function L3() {
  if (!$t || !bt) return;
  const t = $t.getBoundingClientRect(), e = t.height ? Math.round(t.bottom + 8) : 64, n = Math.min(e, Math.max(64, window.innerHeight - 220));
  bt.style.top = `${n}px`, bt.style.maxHeight = `${Math.max(200, window.innerHeight - n - 12)}px`;
}
let Ul;
const H3 = () => {
  var n, r;
  const t = !!(f.signed && f.you && !f.you.guest), e = t ? f.signed.address : null;
  if (e !== Ul) {
    Ul = e;
    try {
      (r = (n = f.host) == null ? void 0 : n.self) == null || r.call(n, { signed: t, address: e });
    } catch (o) {
      console.warn("[room] the page could not take the sign-in state", o);
    }
  }
}, S0 = () => {
  const t = f.you, e = t && !t.guest ? t.a : null;
  return f.service === "offline" ? { state: "offline", address: null, name: null } : !f.connected || !t ? { state: "connecting", address: null, name: null } : f.features.includes("salon-bns") ? t.guest || !f.signed ? { state: "guest", address: null, name: null } : t.bnsChecked !== !0 ? { state: "unchecked", address: e, name: null } : t.bns ? { state: "allowed", address: e, name: t.bns } : { state: "no-name", address: e, name: null } : { state: "unenforced", address: e, name: null };
};
let Ol = "";
const E0 = () => {
  var n, r;
  const t = S0(), e = JSON.stringify(t);
  if (e !== Ol) {
    Ol = e;
    try {
      (r = (n = f.host) == null ? void 0 : n.salon) == null || r.call(n, t);
    } catch (o) {
      console.warn("[room] the page could not take the Salon state", o);
    }
  }
};
let Is = !1;
const k3 = async () => {
  if (!(Is || f.service !== "ok")) {
    Is = !0;
    try {
      const { res: t, body: e } = await yr("/casino/room/bns", { method: "POST" });
      Rt({ t: "bns-check", ok: t.ok, bns: (e == null ? void 0 : e.bns) ?? null, bnsChecked: (e == null ? void 0 : e.bnsChecked) === !0, failed: !t.ok || (e == null ? void 0 : e.failed) === !0, error: t.ok ? null : (e == null ? void 0 : e.error) || `The room answered ${t.status}.` }), t.ok && _r();
    } catch {
      Rt({ t: "bns-check", ok: !1, bns: null, bnsChecked: !1, failed: !0, error: "Could not reach the room." });
    } finally {
      Is = !1;
    }
  }
}, I3 = {
  blackjack: "Blackjack",
  baccarat: "Baccarat",
  sicbo: "Sic Bo",
  roulette: "Roulette",
  videopoker: "Video poker",
  pvpholdem: "Salon Hold'em",
  liars: "Liar's Dice",
  drop: "The Drop",
  twins: "Forever Twins",
  ds: "Deep Strata",
  bf: "Block Fortune",
  nv: "Neon Vault",
  bar: "The bar",
  chess1: "Chess",
  chess2: "Chess"
}, A0 = (t) => {
  var n;
  const e = (n = Object.entries(f.spots).find(([, r]) => r.a === t)) == null ? void 0 : n[0];
  if (e) {
    const r = e.split(".")[0];
    return I3[r] || r;
  }
  return f.walk.has(t) ? "walking" : "in the room";
}, Cl = (t) => {
  var o;
  const e = ((o = f.you) == null ? void 0 : o.a) ?? null, n = [...f.players.values()].sort((s, i) => s.a === e ? -1 : i.a === e ? 1 : Yt(s.a).localeCompare(Yt(i.a)));
  t.push(U("h3", `Here now · ${n.length}`));
  const r = U("div", void 0, "here");
  for (const s of n.slice(0, 50)) {
    const i = U("button", void 0, "person" + (s.aw ? " away" : ""));
    i.type = "button", i.append(U("span", Yt(s.a) + (s.a === e ? " (you)" : ""), "nm"), U("span", s.aw ? "away" : A0(s.a), "at")), i.onclick = () => {
      const a = { a: s.a };
      window.dispatchEvent(new CustomEvent("px-room-person", { detail: a })), a.handled && (f.open = !1, Q());
    }, r.append(i);
  }
  n.length > 50 && r.append(U("p", `and ${n.length - 50} more`, "fact")), n.length || r.append(U("p", "Nobody is signed in yet.", "fact")), t.push(r, U("p", `${f.guests} watching without signing in.`, "fact"));
}, v0 = () => document.getElementById("intro"), B0 = () => {
  const t = v0();
  if (!t || !t.classList.contains("on") || !document.getElementById("introJoin")) return !1;
  try {
    return getComputedStyle(t).display !== "none";
  } catch {
    return !0;
  }
}, Nl = { leather: "Leather", xverse: "Xverse", casino: "your casino wallet" };
let Us = "";
function U3() {
  const t = v0(), e = document.getElementById("introJoin");
  if (!t || !e) return;
  const n = (g) => {
    for (const [w, E] of Object.entries(g)) t.classList.toggle(w, E);
  };
  if (f.service !== "ok") {
    n({ "join-on": !1, "join-ask": !1, "join-steps": !1, "join-back": !1 }), e.hidden = !0, e.replaceChildren(), Us = "";
    return;
  }
  const r = !!(f.signed && f.you && !f.you.guest), o = f.parked ? "parked" : f.replaced ? "replaced" : r ? f.resumed ? "back" : "in" : f.signed ? "joining" : f.busy ? "busy" : f.later ? "later" : "join", s = o === "join" || o === "busy" || o === "joining";
  n({ "join-on": !0, "join-ask": s, "join-steps": s || o === "in", "join-back": o === "back" });
  const i = [], a = (g, w, E = !1) => {
    const $ = U("div", void 0, "jh" + (E ? " done" : ""));
    return $.append(U("i", g), document.createTextNode(w)), $;
  }, c = (g, w, E = "lnk") => {
    const $ = U("button", g, E);
    return $.type = "button", $.onclick = w, $;
  }, h = zn(), u = (g) => {
    const w = U("div", void 0, "wallets"), E = y0();
    return E.forEach(($, H) => {
      const y = U("button", void 0, (E.length === 3 && H === 0 ? "wide" : "") + (f.trying === $ ? " on" : ""));
      y.type = "button";
      const _ = $ === "casino" ? h ? h.describe().label : "Casino wallet" : $ === "leather" ? "Leather" : "Xverse", v = $ === "casino" ? h != null && h.describe().has ? "Face ID or fingerprint · your passkey" : "Face ID or fingerprint · free · 1,000,000 LAYR to start" : f.trying === $ ? "waiting…" : $ === "leather" ? "browser extension" : "extension or app";
      y.append(document.createTextNode(_), U("small", v)), y.disabled = !g || !f.connected, y.onclick = () => {
        w0($);
      }, w.append(y);
    }), w;
  }, l = (g, w) => {
    const E = U("div", void 0, "me" + (f.away ? " away" : "")), $ = U("div");
    return $.append(U("b", Yt(f.signed.address)), U("span", g)), E.append(U("span", void 0, "dot"), $, c(w, () => {
      m0();
    })), E;
  }, b = (g) => `${g} ${g === 1 ? "player is" : "players are"} in the room now.`;
  if (o === "join") {
    i.push(a("1", "Join the room"));
    const g = U("p");
    g.append(document.createTextNode("Sign in so other players can see you, chat and play the shared tables with you. ")), g.append(U("b", f.connected ? f.joined ? b(f.joined) : "Be the first one in tonight." : "Connecting to the room…")), i.push(g, u(!0));
    const w = U("p", void 0, "fine");
    w.append(U("b", "One free signature."), document.createTextNode(" No transaction, no fee, no permission to spend anything.")), i.push(w), f.error && i.push(U("div", f.error, "msg err")), i.push(c("Or look around first, without signing in", () => {
      var E;
      f.later = !0, Q(), (E = document.getElementById("walkin")) == null || E.click();
    }, "lnk guest"));
  } else if (o === "busy" || o === "joining") {
    i.push(a("1", "Join the room"));
    const g = f.trying ? Nl[f.trying] : "your wallet", w = o === "joining" ? `Joining the room as ${Yt(f.signed.address)}…` : f.busy === "connect" ? f.trying === "casino" ? "Opening your casino wallet…" : `Connecting to ${g}…` : f.trying === "casino" ? "Confirm with Face ID or your fingerprint to sign in." : `Check ${g}: approve the free sign-in message.`, E = U("div", void 0, "msg"), $ = U("div", w);
    o === "busy" && $.append(U("small", "No transaction. Nothing to pay.")), E.append(U("span", void 0, "spin"), $), i.push(E), o === "busy" && i.push(u(!1), c("Cancel", E3, "lnk guest"));
  } else if (o === "in") {
    i.push(a("✓", "You are in the room", !0));
    const g = f.wallet ? `${f.wallet.kind === "casino" ? "Casino wallet" : Nl[f.wallet.kind]} · ` : "";
    i.push(l(f.away ? "away · do anything to come back" : `${g}the name others see on your tag`, "Switch"));
    const w = [...f.players.values()].filter(($) => $.a !== f.signed.address), E = U("p", void 0, "here");
    w.length ? (E.append(document.createTextNode("Here now: ")), w.slice(0, 2).forEach(($, H) => {
      const y = A0($.a), _ = $.aw ? "away" : y === "walking" || y === "in the room" ? y : `at ${y}`;
      H && E.append(document.createTextNode(" · ")), E.append(U("b", Yt($.a)), document.createTextNode(` ${_}`));
    }), w.length > 2 && E.append(document.createTextNode(" · "), U("b", `+${w.length - 2} more`))) : E.textContent = "Nobody else is signed in yet. Sit down and they will see you when they arrive.", i.push(E);
  } else if (o === "back")
    i.push(U("p", "Welcome back. You are still signed in from earlier, so you are already in the room.", "lead2")), i.push(l(f.away ? "away · do anything to come back" : `signed in · ${f.joined} here now`, "Not you?"));
  else if (o === "later") {
    const g = U("button", void 0, "later");
    g.type = "button";
    const w = U("span");
    w.append(U("b", "Join the room"), document.createTextNode(" to be seen, chat and play together")), g.append(w, U("span", "›", "go")), g.onclick = () => {
      f.later = !1, Q();
    }, i.push(g);
  } else o === "parked" ? (i.push(U("div", f.parked === "hidden" ? "This tab was in the background for a while, so it left the room." : "You were away for a while, so you left the room.", "msg")), i.push(c("Rejoin the room", () => {
    nn(), ia();
  }, "lnk guest"))) : (i.push(U("div", "Another tab of yours is in the room. You are not connected here.", "msg")), i.push(c("Use this tab instead", () => {
    _r(), Q();
  }, "lnk guest")));
  const p = U("div");
  p.append(...i), e.hidden = !1, p.innerHTML !== Us && (Us = p.innerHTML, e.replaceChildren(...i));
}
const Pl = (t) => {
  const e = U("div", void 0, "top"), n = U("button", "×", "x");
  return n.type = "button", n.setAttribute("aria-label", "Close"), n.onclick = () => {
    f.open = !1, Q();
  }, e.append(U("h3", t), n), e;
}, Os = /* @__PURE__ */ new Set(), Cs = (t, e, n) => {
  const r = U("details", void 0, "fold");
  return r.open = Os.has(t), r.append(U("summary", e), ...n), r.addEventListener("toggle", () => {
    r.open ? Os.add(t) : Os.delete(t);
  }), r;
}, Dl = (...t) => {
  const e = U("div", void 0, "foot");
  return e.append(...t), e;
}, Tl = (t) => {
  const e = [
    sr("Be seen", t ? "Sit at a table or a machine and everyone sees your avatar and name there." : "Signed in, sit at a table or a machine and everyone sees your avatar and name there. Watching shows you to nobody."),
    sr("Seats", "One person per seat or machine. If yours is taken you get a free one at the same table."),
    sr("Chat", "Talk to the room, or tap a name to message, block or report someone. Not secret; cleared when you leave.")
  ];
  return f.features.includes("rounds") && e.push(sr("Play together", "Roulette, baccarat and Sic Bo deal one shared round for everyone at the table. In the Salon you can play another player.")), f.features.includes("react") && e.push(sr("React", "😊 for reactions, drinks and invites. Sign in each day for a free LAYR drop.")), e.push(U("p", "Nothing here moves any money.", "fact")), e;
};
function Q() {
  var i, a;
  if (H3(), E0(), U3(), !Pe || !$t || !bt) return;
  const t = !!(f.signed && f.you && !f.you.guest), e = t ? Yt(f.signed.address) : null;
  if ($t.className = f.parked ? "wait" : f.away ? "away" : f.connected ? "live" : "wait", $t.replaceChildren(U("i"), U("span", f.parked ? "Rejoin the room" : e ? f.away ? `${e} · away` : e : "Room", "lbl"), U("span", f.connected ? (i = window.matchMedia) != null && i.call(window, "(max-width:620px)").matches ? String(f.joined) : ` · ${f.joined}` : "", "n")), $t.setAttribute("aria-label", `Casino room: ${f.connected ? `${f.joined} signed in, ` : ""}${f.parked ? "you left; tap to rejoin" : e ? `you are in as ${e}${f.away ? ", marked away" : ""}` : "see who is here and join"}`), bt.hidden = !f.open, !f.open) return;
  L3();
  const n = [];
  if (f.parked) {
    n.push(U("h3", "Room"), U("p", f.parked === "hidden" ? "This tab was in the background for a while, so it left the room and your seat was freed." : "You were away for a while, so you left the room and your seat was freed."));
    const c = U("button", "Rejoin the room");
    c.onclick = () => {
      nn(), ia();
    }, n.push(c);
  } else if (f.replaced) {
    n.push(U("h3", "Room"), U("p", "Another tab of yours took over the room. You are not connected here."));
    const c = U("button", "Use this tab instead");
    c.onclick = () => {
      _r(), Q();
    }, n.push(c);
  } else if (t) {
    n.push(Pl("Connected as"), U("p", e, "who"));
    const c = { leather: "Leather", xverse: "Xverse", casino: "Casino wallet" };
    if (n.push(U("p", (f.wallet ? `${c[f.wallet.kind] || f.wallet.kind} · ` : "") + "others see this name on your tag", "sub")), f.away) {
      n.push(U("p", "You are marked away (idle), so you were stood up.", "err"));
      const u = U("button", "I'm back");
      u.onclick = () => nn(), n.push(u);
    }
    Cl(n), n.push(Cs("addr", "Your address", [U("p", "To share, or for someone to send you a BNS name.", "fact"), h0(f.signed.address, sa)])), n.push(Cs("how", "How the room works", Tl(!0)));
    const h = U("button", "Leave the room");
    h.onclick = () => {
      m0();
    }, n.push(Dl(h));
  } else {
    n.push(Pl("Join the room")), n.push(U("p", f.connected ? f.watch ? `${f.joined} signed in · ${f.guests} watching. Sign in to be seen, chat and play together.` : `${f.joined} ${f.joined === 1 ? "person is" : "people are"} in the room. Sign in to join them.` : "Connecting to the room…", "sub"));
    const c = U("div", void 0, "row"), h = zn(), u = { leather: "Leather", xverse: "Xverse", casino: h ? h.describe().label : "Casino wallet" };
    for (const l of y0()) {
      const b = U("button", f.busy ? f.busy === "sign" ? "Check your wallet…" : "Connecting…" : u[l]);
      if (b.disabled = !!f.busy || !f.connected, b.onclick = () => {
        w0(l);
      }, l === "casino" && (b.style.flexBasis = "100%"), c.append(b), f.busy) break;
    }
    if (n.push(c), n.push(U("p", "One free signature: no transaction, no fee, no permission to spend.", "fact")), h && !h.describe().has && n.push(U("p", "Casino wallet: made free with Face ID or your fingerprint, with 500 testnet STX and your first 1,000,000 LAYR.", "fact")), f.error && n.push(U("p", f.error, "err")), f.connected && f.watch && Cl(n), n.push(Cs("how", "How the room works", Tl(!1))), !f.busy) {
      const l = U("button", "Not now");
      l.onclick = () => {
        f.open = !1, Q();
      }, n.push(Dl(l));
    }
  }
  const r = bt.scrollTop, o = ((a = bt.querySelector(".here")) == null ? void 0 : a.scrollTop) ?? 0;
  bt.replaceChildren(...n), bt.scrollTop = r;
  const s = bt.querySelector(".here");
  s && (s.scrollTop = o);
}
const O3 = (t) => {
  var n, r;
  const e = t.detail;
  !e || typeof e.spot != "string" || !Array.isArray(e.s) || typeof e.b != "number" || !f.features.includes("play") || f.service !== "ok" || !f.connected || !f.signed || !f.you || f.you.guest || ((n = f.spots[e.spot]) == null ? void 0 : n.a) === f.you.a && ((r = f.ws) == null ? void 0 : r.readyState) === WebSocket.OPEN && f.ws.send(JSON.stringify({ t: "play", spot: e.spot, s: e.s.slice(0, 8), b: e.b, f: !!e.f }));
}, C3 = (t) => {
  const e = t.detail;
  if (e) {
    if (e.off) f.ownMove = null;
    else if ([e.x, e.z, e.r].every((n) => typeof n == "number" && Number.isFinite(n))) f.ownMove = { x: e.x, z: e.z, r: e.r };
    else return;
    p0();
  }
}, Fl = {
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
  cres: "cres",
  cbet: "cbet",
  log: "progress",
  mission: "missions",
  card: "progress",
  board: "boards",
  tjoin: "tourney",
  bal: "bal",
  friends: "friends"
}, N3 = (t) => {
  var o;
  const e = t.detail;
  if (!e || typeof e.t != "string" || !Fl[e.t]) return;
  const n = e.t === "round" || e.t === "watch" || (e.t === "spec" || e.t === "cbet") && e.ask === !0;
  if (!(f.service === "ok" && f.connected && f.features.includes(Fl[e.t]) && (n || !!(f.signed && f.you && !f.you.guest))) || ((o = f.ws) == null ? void 0 : o.readyState) !== WebSocket.OPEN) {
    Rt({ t: "unsent", msg: e });
    return;
  }
  f.ws.send(JSON.stringify(e));
}, P3 = () => {
  var e;
  const t = ((e = f.host) == null ? void 0 : e.currentSpot()) ?? null;
  t !== f.want && (f.want = t, f.yielded = null, f.standSent = null, wr()), b0();
};
async function D3() {
  var e;
  const t = () => {
    f.service = "offline", E0();
  };
  try {
    const { res: n, body: r } = await yr("/casino/room/session");
    if (n.status === 503) return t();
    n.ok && (r != null && r.address) && (f.signed = { address: r.address, hash160: r.hash160, expiresAt: r.expiresAt }, f.resumed = !0), f.service = "ok";
  } catch {
    return t();
  }
  _3(), Q(), Jo(), window.setInterval(P3, 250), window.setInterval(B3, 500), window.addEventListener("px-wallet-connected", (n) => {
    A3(n);
  }), window.addEventListener("px-casino-wallet-ready", () => Q()), window.addEventListener("px-room-play", O3), window.addEventListener("px-room-move", C3), window.addEventListener("px-room-send", N3), window.addEventListener("px-room-bns-check", () => {
    k3();
  }), (e = document.getElementById("intro")) == null || e.addEventListener("click", (n) => {
    const r = n.composedPath();
    !r.some((o) => o instanceof HTMLButtonElement) || r.some((o) => o instanceof Element && o.id === "introJoin") || !(f.signed && f.you && !f.you.guest) && !f.busy && !f.later && (f.later = !0, Q());
  }), window.setInterval(S3, 1e3);
  for (const n of ["pointerdown", "keydown", "wheel", "touchstart"]) window.addEventListener(n, nn, { capture: !0, passive: !0 });
  window.addEventListener("px-room-play", nn), window.addEventListener("px-room-move", nn), document.addEventListener("visibilitychange", () => {
    document.hidden ? f.hiddenAt = Date.now() : (f.hiddenAt = 0, nn());
  }), window.addEventListener("px-room-person", (n) => {
    const r = n.detail;
    r && z && z.openPerson(r.a) && (r.handled = !0);
  });
}
window.PXRounds = Object.freeze({ verifySeed: x3, rouletteResult: f3, baccaratCards: u3, sicboDice: d3 });
const Ml = (t) => {
  f.host || (f.host = t, D3());
}, Rl = window.PXRoomHost;
Rl ? Ml(Rl) : window.addEventListener("px-room-host", () => Ml(window.PXRoomHost), { once: !0 });
window.__pxRoom = {
  chat: () => (z == null ? void 0 : z.debug()) ?? null,
  here: () => ({ away: f.away, parked: f.parked, players: [...f.players.values()], idleFor: Date.now() - f.lastActive, times: { ...Qe } }),
  get state() {
    var t;
    return { service: f.service, signed: ((t = f.signed) == null ? void 0 : t.address) ?? null, connected: f.connected, watch: f.watch, prompted: f.prompted, open: f.open, busy: f.busy, error: f.error, you: f.you, spots: f.spots, joined: f.joined, guests: f.guests, want: f.want, features: f.features.slice(), walkers: [...f.walk.keys()], ownMove: f.ownMove, salon: S0(), trail: Ne.slice() };
  }
};
