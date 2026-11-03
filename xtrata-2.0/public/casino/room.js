var wu = Object.defineProperty;
var yu = (t, e, n) => e in t ? wu(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var An = (t, e, n) => yu(t, typeof e != "symbol" ? e + "" : e, n);
function ui(t, e) {
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
      const r = Eu(BigInt(`0x${le(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${le(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function di(t, e = 8) {
  return (typeof t == "bigint" ? t : ui(t, !1)).toString(16).padStart(e * 2, "0");
}
function Dl(t) {
  return parseInt(t, 16);
}
function Tl(t, e = 16) {
  const n = di(t, e);
  return In(n);
}
function mu(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Su(t, e) {
  return t & BigInt(1) << e;
}
function Eu(t, e) {
  return Su(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Au = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function le(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Au[n];
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
function Fl(t) {
  return new TextDecoder().decode(t);
}
function Ml(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function vu(t) {
  return String.fromCharCode.apply(null, t);
}
function Bu(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function wa(t) {
  if (t.some(Bu))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function pi(...t) {
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
function zn(t) {
  return pi(...t.map((e) => typeof e == "number" ? wa([e]) : e instanceof Array ? wa(e) : e));
}
function $u(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function _u(t, e) {
  return t[e];
}
function Lu(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Oo(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Us;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Us || (Us = {}));
Us.Mainnet;
const Hu = 128, ku = 128, Rl = 16;
var ur;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ur || (ur = {}));
var ya;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ya || (ya = {}));
var ma;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(ma || (ma = {}));
var Pt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Pt || (Pt = {}));
const fs = ["onChainOnly", "offChainOnly", "any"];
fs[0] + "", Pt.OnChainOnly, fs[1] + "", Pt.OffChainOnly, fs[2] + "", Pt.Any, Pt.OnChainOnly + "", Pt.OnChainOnly, Pt.OffChainOnly + "", Pt.OffChainOnly, Pt.Any + "", Pt.Any;
var Os;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Os || (Os = {}));
Os.Mainnet;
var Sa;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Sa || (Sa = {}));
var Ea;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ea || (Ea = {}));
var Aa;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Aa || (Aa = {}));
var va;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(va || (va = {}));
var Cs;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Cs || (Cs = {}));
var Ba;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ba || (Ba = {}));
var $a;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})($a || ($a = {}));
var _a;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(_a || (_a = {}));
var La;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(La || (La = {}));
var Ha;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ha || (Ha = {}));
var ka;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(ka || (ka = {}));
function Ns(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Iu(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Gl(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Uu(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ns(t.outputLen), Ns(t.blockLen);
}
function Ou(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Cu(t, e) {
  Gl(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const hs = {
  number: Ns,
  bool: Iu,
  bytes: Gl,
  hash: Uu,
  exists: Ou,
  output: Cu
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const us = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Gt = (t, e) => t << 32 - e | t >>> e, Nu = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Nu)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Pu(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function zl(t) {
  if (typeof t == "string" && (t = Pu(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Du = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function hn(t) {
  const e = (r) => t().update(zl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Tu(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, h = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + h, a, r);
}
let bi = class extends Du {
  constructor(e, n, r, o) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = us(this.buffer);
  }
  update(e) {
    hs.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    e = zl(e);
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
    Tu(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
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
const Fu = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Vl = Uint8Array.from({ length: 16 }, (t, e) => e), Mu = Vl.map((t) => (9 * t + 5) % 16);
let gi = [Vl], xi = [Mu];
for (let t = 0; t < 4; t++)
  for (let e of [gi, xi])
    e.push(e[t].map((n) => Fu[n]));
const Kl = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Ru = gi.map((t, e) => t.map((n) => Kl[e][n])), Gu = xi.map((t, e) => t.map((n) => Kl[e][n])), zu = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Vu = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Mr = (t, e) => t << e | t >>> 32 - e;
function Ia(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Rr = new Uint32Array(16);
let Ku = class extends bi {
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
      const g = 4 - p, w = zu[p], E = Vu[p], $ = gi[p], H = xi[p], y = Ru[p], _ = Gu[p];
      for (let v = 0; v < 16; v++) {
        const P = Mr(r + Ia(p, s, a, h) + Rr[$[v]] + w, y[v]) + l | 0;
        r = l, l = h, h = Mr(a, 10) | 0, a = s, s = P;
      }
      for (let v = 0; v < 16; v++) {
        const P = Mr(o + Ia(g, i, c, u) + Rr[H[v]] + E, _[v]) + b | 0;
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
hn(() => new Ku());
const ju = (t, e, n) => t & e ^ ~t & n, qu = (t, e, n) => t & e ^ t & n ^ e & n, Wu = new Uint32Array([
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
]), de = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), pe = new Uint32Array(64);
let jl = class extends bi {
  constructor() {
    super(64, 32, 8, !1), this.A = de[0] | 0, this.B = de[1] | 0, this.C = de[2] | 0, this.D = de[3] | 0, this.E = de[4] | 0, this.F = de[5] | 0, this.G = de[6] | 0, this.H = de[7] | 0;
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
      pe[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = pe[l - 15], p = pe[l - 2], g = Gt(b, 7) ^ Gt(b, 18) ^ b >>> 3, w = Gt(p, 17) ^ Gt(p, 19) ^ p >>> 10;
      pe[l] = w + pe[l - 7] + g + pe[l - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: h, H: u } = this;
    for (let l = 0; l < 64; l++) {
      const b = Gt(a, 6) ^ Gt(a, 11) ^ Gt(a, 25), p = u + b + ju(a, c, h) + Wu[l] + pe[l] | 0, w = (Gt(r, 2) ^ Gt(r, 13) ^ Gt(r, 22)) + qu(r, o, s) | 0;
      u = h, h = c, c = a, a = i + p | 0, i = s, s = o, o = r, r = p + w | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, h = h + this.G | 0, u = u + this.H | 0, this.set(r, o, s, i, a, c, h, u);
  }
  roundClean() {
    pe.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Ju = class extends jl {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
hn(() => new jl());
hn(() => new Ju());
const Gr = BigInt(2 ** 32 - 1), Ps = BigInt(32);
function ql(t, e = !1) {
  return e ? { h: Number(t & Gr), l: Number(t >> Ps & Gr) } : { h: Number(t >> Ps & Gr) | 0, l: Number(t & Gr) | 0 };
}
function Xu(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let o = 0; o < t.length; o++) {
    const { h: s, l: i } = ql(t[o], e);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const Yu = (t, e) => BigInt(t >>> 0) << Ps | BigInt(e >>> 0), Zu = (t, e, n) => t >>> n, Qu = (t, e, n) => t << 32 - n | e >>> n, td = (t, e, n) => t >>> n | e << 32 - n, ed = (t, e, n) => t << 32 - n | e >>> n, nd = (t, e, n) => t << 64 - n | e >>> n - 32, rd = (t, e, n) => t >>> n - 32 | e << 64 - n, od = (t, e) => e, sd = (t, e) => t, id = (t, e, n) => t << n | e >>> 32 - n, ad = (t, e, n) => e << n | t >>> 32 - n, cd = (t, e, n) => e << n - 32 | t >>> 64 - n, ld = (t, e, n) => t << n - 32 | e >>> 64 - n;
function fd(t, e, n, r) {
  const o = (e >>> 0) + (r >>> 0);
  return { h: t + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const hd = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), ud = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, dd = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), pd = (t, e, n, r, o) => e + n + r + o + (t / 2 ** 32 | 0) | 0, bd = (t, e, n, r, o) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), gd = (t, e, n, r, o, s) => e + n + r + o + s + (t / 2 ** 32 | 0) | 0, V = {
  fromBig: ql,
  split: Xu,
  toBig: Yu,
  shrSH: Zu,
  shrSL: Qu,
  rotrSH: td,
  rotrSL: ed,
  rotrBH: nd,
  rotrBL: rd,
  rotr32H: od,
  rotr32L: sd,
  rotlSH: id,
  rotlSL: ad,
  rotlBH: cd,
  rotlBL: ld,
  add: fd,
  add3L: hd,
  add3H: ud,
  add4L: dd,
  add4H: pd,
  add5H: gd,
  add5L: bd
}, [xd, wd] = V.split([
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
].map((t) => BigInt(t))), be = new Uint32Array(80), ge = new Uint32Array(80);
let Co = class extends bi {
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
      be[y] = e.getUint32(n), ge[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const _ = be[y - 15] | 0, v = ge[y - 15] | 0, P = V.rotrSH(_, v, 1) ^ V.rotrSH(_, v, 8) ^ V.shrSH(_, v, 7), M = V.rotrSL(_, v, 1) ^ V.rotrSL(_, v, 8) ^ V.shrSL(_, v, 7), O = be[y - 2] | 0, N = ge[y - 2] | 0, x = V.rotrSH(O, N, 19) ^ V.rotrBH(O, N, 61) ^ V.shrSH(O, N, 6), A = V.rotrSL(O, N, 19) ^ V.rotrBL(O, N, 61) ^ V.shrSL(O, N, 6), k = V.add4L(M, A, ge[y - 7], ge[y - 16]), C = V.add4H(k, P, x, be[y - 7], be[y - 16]);
      be[y] = C | 0, ge[y] = k | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: a, Cl: c, Dh: h, Dl: u, Eh: l, El: b, Fh: p, Fl: g, Gh: w, Gl: E, Hh: $, Hl: H } = this;
    for (let y = 0; y < 80; y++) {
      const _ = V.rotrSH(l, b, 14) ^ V.rotrSH(l, b, 18) ^ V.rotrBH(l, b, 41), v = V.rotrSL(l, b, 14) ^ V.rotrSL(l, b, 18) ^ V.rotrBL(l, b, 41), P = l & p ^ ~l & w, M = b & g ^ ~b & E, O = V.add5L(H, v, M, wd[y], ge[y]), N = V.add5H(O, $, _, P, xd[y], be[y]), x = O | 0, A = V.rotrSH(r, o, 28) ^ V.rotrBH(r, o, 34) ^ V.rotrBH(r, o, 39), k = V.rotrSL(r, o, 28) ^ V.rotrBL(r, o, 34) ^ V.rotrBL(r, o, 39), C = r & s ^ r & a ^ s & a, R = o & i ^ o & c ^ i & c;
      $ = w | 0, H = E | 0, w = p | 0, E = g | 0, p = l | 0, g = b | 0, { h: l, l: b } = V.add(h | 0, u | 0, N | 0, x | 0), h = a | 0, u = c | 0, a = s | 0, c = i | 0, s = r | 0, i = o | 0;
      const D = V.add3L(x, k, R);
      r = V.add3H(D, N, A, C), o = D | 0;
    }
    ({ h: r, l: o } = V.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = V.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: a, l: c } = V.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h, l: u } = V.add(this.Dh | 0, this.Dl | 0, h | 0, u | 0), { h: l, l: b } = V.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h: p, l: g } = V.add(this.Fh | 0, this.Fl | 0, p | 0, g | 0), { h: w, l: E } = V.add(this.Gh | 0, this.Gl | 0, w | 0, E | 0), { h: $, l: H } = V.add(this.Hh | 0, this.Hl | 0, $ | 0, H | 0), this.set(r, o, s, i, a, c, h, u, l, b, p, g, w, E, $, H);
  }
  roundClean() {
    be.fill(0), ge.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, yd = class extends Co {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, md = class extends Co {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Sd = class extends Co {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
hn(() => new Co());
hn(() => new yd());
hn(() => new md());
hn(() => new Sd());
const Ed = {}, Wl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ed
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Z = BigInt(0), at = BigInt(1), Re = BigInt(2), cr = BigInt(3), Ua = BigInt(8), ot = Object.freeze({
  a: Z,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: at,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Oa = (t, e) => (t + e / Re) / e, zr = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = ot, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -at * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), o = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), s = n, i = BigInt("0x100000000000000000000000000000000"), a = Oa(s * t, e), c = Oa(-r * t, e);
    let h = I(t - a * n - c * o, e), u = I(-a * r - c * s, e);
    const l = h > i, b = u > i;
    if (l && (h = e - h), b && (u = e - u), h > i || u > i)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: h, k2neg: b, k2: u };
  }
}, Mt = 32, on = 32, Jl = 32, xo = Mt + 1, wo = 2 * Mt + 1;
function Ca(t) {
  const { a: e, b: n } = ot, r = I(t * t), o = I(r * t);
  return I(o + e * t + n);
}
const Vr = ot.a === Z;
class wi extends Error {
  constructor(e) {
    super(e);
  }
}
function Na(t) {
  if (!(t instanceof nt))
    throw new TypeError("JacobianPoint expected");
}
class nt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof Q))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(Q.ZERO) ? nt.ZERO : new nt(e.x, e.y, at);
  }
  static toAffineBatch(e) {
    const n = _d(e.map((r) => r.z));
    return e.map((r, o) => r.toAffine(n[o]));
  }
  static normalizeZ(e) {
    return nt.toAffineBatch(e).map(nt.fromAffine);
  }
  equals(e) {
    Na(e);
    const { x: n, y: r, z: o } = this, { x: s, y: i, z: a } = e, c = I(o * o), h = I(a * a), u = I(n * h), l = I(s * c), b = I(I(r * a) * h), p = I(I(i * o) * c);
    return u === l && b === p;
  }
  negate() {
    return new nt(this.x, I(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, o = I(e * e), s = I(n * n), i = I(s * s), a = e + s, c = I(Re * (I(a * a) - o - i)), h = I(cr * o), u = I(h * h), l = I(u - Re * c), b = I(h * (c - l) - Ua * i), p = I(Re * n * r);
    return new nt(l, b, p);
  }
  add(e) {
    Na(e);
    const { x: n, y: r, z: o } = this, { x: s, y: i, z: a } = e;
    if (s === Z || i === Z)
      return this;
    if (n === Z || r === Z)
      return e;
    const c = I(o * o), h = I(a * a), u = I(n * h), l = I(s * c), b = I(I(r * a) * h), p = I(I(i * o) * c), g = I(l - u), w = I(p - b);
    if (g === Z)
      return w === Z ? this.double() : nt.ZERO;
    const E = I(g * g), $ = I(g * E), H = I(u * E), y = I(w * w - $ - Re * H), _ = I(w * (H - y) - b * $), v = I(o * a * g);
    return new nt(y, _, v);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = nt.ZERO;
    if (typeof e == "bigint" && e === Z)
      return n;
    let r = Ta(e);
    if (r === at)
      return this;
    if (!Vr) {
      let l = n, b = this;
      for (; r > Z; )
        r & at && (l = l.add(b)), b = b.double(), r >>= at;
      return l;
    }
    let { k1neg: o, k1: s, k2neg: i, k2: a } = zr.splitScalar(r), c = n, h = n, u = this;
    for (; s > Z || a > Z; )
      s & at && (c = c.add(u)), a & at && (h = h.add(u)), u = u.double(), s >>= at, a >>= at;
    return o && (c = c.negate()), i && (h = h.negate()), h = new nt(I(h.x * zr.beta), h.y, h.z), c.add(h);
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
    !n && this.equals(nt.BASE) && (n = Q.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let o = n && Ds.get(n);
    o || (o = this.precomputeWindow(r), n && r !== 1 && (o = nt.normalizeZ(o), Ds.set(n, o)));
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
    let r = Ta(e), o, s;
    if (Vr) {
      const { k1neg: i, k1: a, k2neg: c, k2: h } = zr.splitScalar(r);
      let { p: u, f: l } = this.wNAF(a, n), { p: b, f: p } = this.wNAF(h, n);
      u = Kr(i, u), b = Kr(c, b), b = new nt(I(b.x * zr.beta), b.y, b.z), o = u.add(b), s = l.add(p);
    } else {
      const { p: i, f: a } = this.wNAF(r, n);
      o = i, s = a;
    }
    return nt.normalizeZ([o, s])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: o } = this, s = this.equals(nt.ZERO);
    e == null && (e = s ? Ua : Vn(o));
    const i = e, a = I(i * i), c = I(a * i), h = I(n * a), u = I(r * c), l = I(o * i);
    if (s)
      return Q.ZERO;
    if (l !== at)
      throw new Error("invZ was invalid");
    return new Q(h, u);
  }
}
nt.BASE = new nt(ot.Gx, ot.Gy, at);
nt.ZERO = new nt(Z, at, Z);
function Kr(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Ds = /* @__PURE__ */ new WeakMap();
class Q {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Ds.delete(this);
  }
  hasEvenY() {
    return this.y % Re === Z;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = _t(n ? e : e.subarray(1));
    if (!ho(r))
      throw new Error("Point is not on curve");
    const o = Ca(r);
    let s = $d(o);
    const i = (s & at) === at;
    n ? i && (s = I(-s)) : (e[0] & 1) === 1 !== i && (s = I(-s));
    const a = new Q(r, s);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = _t(e.subarray(1, Mt + 1)), r = _t(e.subarray(Mt + 1, Mt * 2 + 1)), o = new Q(n, r);
    return o.assertValidity(), o;
  }
  static fromHex(e) {
    const n = Zt(e), r = n.length, o = n[0];
    if (r === Mt)
      return this.fromCompressedHex(n);
    if (r === xo && (o === 2 || o === 3))
      return this.fromCompressedHex(n);
    if (r === wo && o === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${xo} compressed bytes or ${wo} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Q.BASE.multiply(sn(e));
  }
  static fromSignature(e, n, r) {
    const { r: o, s } = Zl(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const i = yi(Zt(e)), { n: a } = ot, c = r === 2 || r === 3 ? o + a : o, h = Vn(c, a), u = I(-i * h, a), l = I(s * h, a), b = r & 1 ? "03" : "02", p = Q.fromHex(b + Ge(c)), g = Q.BASE.multiplyAndAddUnsafe(p, u, l);
    if (!g)
      throw new Error("Cannot recover signature: point at infinify");
    return g.assertValidity(), g;
  }
  toRawBytes(e = !1) {
    return ze(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Ge(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Ge(this.y)}`;
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
    const o = I(r * r), s = Ca(n);
    if (I(o - s) !== Z)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new Q(this.x, I(-this.y));
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
    const o = nt.fromAffine(this), s = n === Z || n === at || this !== Q.BASE ? o.multiplyUnsafe(n) : o.multiply(n), i = nt.fromAffine(e).multiplyUnsafe(r), a = s.add(i);
    return a.equals(nt.ZERO) ? void 0 : a.toAffine();
  }
}
Q.BASE = new Q(ot.Gx, ot.Gy);
Q.ZERO = new Q(Z, Z);
function Pa(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Da(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Un(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: _t(n), left: t.subarray(e + 2) };
}
function Ad(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Un(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Da(t.subarray(2)), { data: r, left: o } = Da(n);
  if (o.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Un(o)}`);
  return { r: e, s: r };
}
class ce {
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
    return new ce(yo(o.slice(0, 64)), yo(o.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s: o } = Ad(n ? e : ze(e));
    return new ce(r, o);
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
    return this.hasHighS() ? new ce(this.r, I(-this.s, ot.n)) : this;
  }
  toDERRawBytes() {
    return ze(this.toDERHex());
  }
  toDERHex() {
    const e = Pa(rr(this.s)), n = Pa(rr(this.r)), r = e.length / 2, o = n.length / 2, s = rr(r), i = rr(o);
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
    return Ge(this.r) + Ge(this.s);
  }
}
function Fe(...t) {
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
const vd = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Un(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += vd[t[n]];
  return e;
}
const Bd = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Ge(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Z <= t && t < Bd))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function On(t) {
  const e = ze(Ge(t));
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
function _t(t) {
  return yo(Un(t));
}
function Zt(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : ze(t);
}
function Ta(t) {
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
function Ht(t, e) {
  const { P: n } = ot;
  let r = t;
  for (; e-- > Z; )
    r *= r, r %= n;
  return r;
}
function $d(t) {
  const { P: e } = ot, n = BigInt(6), r = BigInt(11), o = BigInt(22), s = BigInt(23), i = BigInt(44), a = BigInt(88), c = t * t * t % e, h = c * c * t % e, u = Ht(h, cr) * h % e, l = Ht(u, cr) * h % e, b = Ht(l, Re) * c % e, p = Ht(b, r) * b % e, g = Ht(p, o) * p % e, w = Ht(g, i) * g % e, E = Ht(w, a) * w % e, $ = Ht(E, i) * g % e, H = Ht($, cr) * h % e, y = Ht(H, s) * p % e, _ = Ht(y, n) * c % e, v = Ht(_, Re);
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
function _d(t, e = ot.P) {
  const n = new Array(t.length), r = t.reduce((s, i, a) => i === Z ? s : (n[a] = s, I(s * i, e)), at), o = Vn(r, e);
  return t.reduceRight((s, i, a) => i === Z ? s : (n[a] = I(s * n[a], e), I(s * i, e)), o), n;
}
function Ld(t) {
  const e = t.length * 8 - on * 8, n = _t(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function yi(t, e = !1) {
  const n = Ld(t);
  if (e)
    return n;
  const { n: r } = ot;
  return n >= r ? n - r : n;
}
let kn, lr;
class Xl {
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
      throw new wi("hmacSha256Sync needs to be set");
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
    return Fe(...n);
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
    return Fe(...n);
  }
}
function Cn(t) {
  return Z < t && t < ot.n;
}
function ho(t) {
  return Z < t && t < ot.P;
}
function Yl(t, e, n, r = !0) {
  const { n: o } = ot, s = yi(t, !0);
  if (!Cn(s))
    return;
  const i = Vn(s, o), a = Q.BASE.multiply(s), c = I(a.x, o);
  if (c === Z)
    return;
  const h = I(i * I(e + n * c, o), o);
  if (h === Z)
    return;
  let u = new ce(c, h), l = (a.x === u.r ? 0 : 2) | Number(a.y & at);
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
    e = _t(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Cn(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function mi(t) {
  return t instanceof Q ? (t.assertValidity(), t) : Q.fromHex(t);
}
function Zl(t) {
  if (t instanceof ce)
    return t.assertValidity(), t;
  try {
    return ce.fromDER(t);
  } catch {
    return ce.fromCompact(t);
  }
}
function Si(t, e = !1) {
  return Q.fromPrivateKey(t).toRawBytes(e);
}
function Hd(t, e, n, r = !1) {
  return Q.fromSignature(t, e, n).toRawBytes(r);
}
function Fa(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === xo || r === wo : n ? r === xo * 2 || r === wo * 2 : t instanceof Q;
}
function Ei(t, e, n = !1) {
  if (Fa(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Fa(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = mi(e);
  return r.assertValidity(), r.multiply(sn(t)).toRawBytes(n);
}
function Ql(t) {
  const e = t.length > Mt ? t.slice(0, Mt) : t;
  return _t(e);
}
function kd(t) {
  const e = Ql(t), n = I(e, ot.n);
  return tf(n < Z ? e : n);
}
function tf(t) {
  return On(t);
}
function ef(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Zt(t), o = sn(e), s = [tf(o), kd(r)];
  if (n != null) {
    n === !0 && (n = ct.randomBytes(Mt));
    const c = Zt(n);
    if (c.length !== Mt)
      throw new Error(`sign: Expected ${Mt} bytes of extra data`);
    s.push(c);
  }
  const i = Fe(...s), a = Ql(r);
  return { seed: i, m: a, d: o };
}
function nf(t, e) {
  const { sig: n, recovery: r } = t, { der: o, recovered: s } = Object.assign({ canonical: !0, der: !0 }, e), i = o ? n.toDERRawBytes() : n.toCompactRawBytes();
  return s ? [i, r] : i;
}
async function Id(t, e, n = {}) {
  const { seed: r, m: o, d: s } = ef(t, e, n.extraEntropy), i = new Xl(Jl, on);
  await i.reseed(r);
  let a;
  for (; !(a = Yl(await i.generate(), o, s, n.canonical)); )
    await i.reseed();
  return nf(a, n);
}
function rf(t, e, n = {}) {
  const { seed: r, m: o, d: s } = ef(t, e, n.extraEntropy), i = new Xl(Jl, on);
  i.reseedSync(r);
  let a;
  for (; !(a = Yl(i.generateSync(), o, s, n.canonical)); )
    i.reseedSync();
  return nf(a, n);
}
const Ud = { strict: !0 };
function Od(t, e, n, r = Ud) {
  let o;
  try {
    o = Zl(t), e = Zt(e);
  } catch {
    return !1;
  }
  const { r: s, s: i } = o;
  if (r.strict && o.hasHighS())
    return !1;
  const a = yi(e);
  let c;
  try {
    c = mi(n);
  } catch {
    return !1;
  }
  const { n: h } = ot, u = Vn(i, h), l = I(a * u, h), b = I(s * u, h), p = Q.BASE.multiplyAndAddUnsafe(c, l, b);
  return p ? I(p.x, h) === s : !1;
}
function mo(t) {
  return I(_t(t), ot.n);
}
class Nn {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Zt(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = _t(n.subarray(0, 32)), o = _t(n.subarray(32, 64));
    return new Nn(r, o);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!ho(e) || !Cn(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Ge(this.r) + Ge(this.s);
  }
  toRawBytes() {
    return ze(this.toHex());
  }
}
function Cd(t) {
  return Q.fromPrivateKey(t).toRawX();
}
class of {
  constructor(e, n, r = ct.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Zt(e);
    const { x: o, scalar: s } = this.getScalar(sn(n));
    if (this.px = o, this.d = s, this.rand = Zt(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = Q.fromPrivateKey(e), r = n.hasEvenY() ? e : ot.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return On(e ^ _t(n));
  }
  finalizeNonce(e) {
    const n = I(_t(e), ot.n);
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
    const { m: e, d: n, px: r, rand: o } = this, s = ct.taggedHash, i = this.initNonce(n, await s(Te.aux, o)), { R: a, rx: c, k: h } = this.finalizeNonce(await s(Te.nonce, i, r, e)), u = mo(await s(Te.challenge, c, r, e)), l = this.finalizeSig(a, h, u, n);
    return await cf(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: o } = this, s = ct.taggedHashSync, i = this.initNonce(n, s(Te.aux, o)), { R: a, rx: c, k: h } = this.finalizeNonce(s(Te.nonce, i, r, e)), u = mo(s(Te.challenge, c, r, e)), l = this.finalizeSig(a, h, u, n);
    return lf(l, e, r) || this.error(), l;
  }
}
async function Nd(t, e, n) {
  return new of(t, e, n).calc();
}
function Pd(t, e, n) {
  return new of(t, e, n).calcSync();
}
function sf(t, e, n) {
  const r = t instanceof Nn, o = r ? t : Nn.fromHex(t);
  return r && o.assertValidity(), {
    ...o,
    m: Zt(e),
    P: mi(n)
  };
}
function af(t, e, n, r) {
  const o = Q.BASE.multiplyAndAddUnsafe(e, sn(n), I(-r, ot.n));
  return !(!o || !o.hasEvenY() || o.x !== t);
}
async function cf(t, e, n) {
  try {
    const { r, s: o, m: s, P: i } = sf(t, e, n), a = mo(await ct.taggedHash(Te.challenge, On(r), i.toRawX(), s));
    return af(r, i, o, a);
  } catch {
    return !1;
  }
}
function lf(t, e, n) {
  try {
    const { r, s: o, m: s, P: i } = sf(t, e, n), a = mo(ct.taggedHashSync(Te.challenge, On(r), i.toRawX(), s));
    return af(r, i, o, a);
  } catch (r) {
    if (r instanceof wi)
      throw r;
    return !1;
  }
}
const Dd = {
  Signature: Nn,
  getPublicKey: Cd,
  sign: Nd,
  verify: cf,
  signSync: Pd,
  verifySync: lf
};
Q.BASE._setWindowSize(8);
const vt = {
  node: Wl,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Te = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, jr = {}, ct = {
  bytesToHex: Un,
  hexToBytes: ze,
  concatBytes: Fe,
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
    const n = I(_t(t), ot.n - at) + at;
    return On(n);
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
  randomPrivateKey: () => ct.hashToPrivateKey(ct.randomBytes(on + 8)),
  precompute(t = 8, e = Q.BASE) {
    const n = e === Q.BASE ? e : new Q(e.x, e.y);
    return n._setWindowSize(t), n.multiply(cr), n;
  },
  sha256: async (...t) => {
    if (vt.web) {
      const e = await vt.web.subtle.digest("SHA-256", Fe(...t));
      return new Uint8Array(e);
    } else if (vt.node) {
      const { createHash: e } = vt.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (vt.web) {
      const n = await vt.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Fe(...e), o = await vt.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(o);
    } else if (vt.node) {
      const { createHmac: n } = vt.node, r = n("sha256", t);
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
      n = Fe(r, r), jr[t] = n;
    }
    return ct.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof kn != "function")
      throw new wi("sha256Sync is undefined, you need to set it");
    let n = jr[t];
    if (n === void 0) {
      const r = kn(Uint8Array.from(t, (o) => o.charCodeAt(0)));
      n = Fe(r, r), jr[t] = n;
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
const Td = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: ot,
  Point: Q,
  Signature: ce,
  getPublicKey: Si,
  getSharedSecret: Ei,
  recoverPublicKey: Hd,
  schnorr: Dd,
  sign: Id,
  signSync: rf,
  utils: ct,
  verify: Od
}, Symbol.toStringTag, { value: "Module" }));
var gt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Fd(t) {
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
var Kn = {}, Ai = {};
const vn = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function ff(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Ts(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Ke(t, ...e) {
  if (!ff(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function hf(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Ts(t.outputLen), Ts(t.blockLen);
}
function dr(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function uf(t, e) {
  Ke(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function Md(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function Rd(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function pr(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function uo(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Nt(t, e) {
  return t << 32 - e | t >>> e;
}
function Gd(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const vi = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Bi(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const df = vi ? (t) => t : (t) => Bi(t), zd = df;
function pf(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Bi(t[e]);
  return t;
}
const Vd = vi ? (t) => t : pf, bf = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", Kd = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function jd(t) {
  if (Ke(t), bf)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Kd[t[n]];
  return e;
}
const oe = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Ma(t) {
  if (t >= oe._0 && t <= oe._9)
    return t - oe._0;
  if (t >= oe.A && t <= oe.F)
    return t - (oe.A - 10);
  if (t >= oe.a && t <= oe.f)
    return t - (oe.a - 10);
}
function qd(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (bf)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let o = 0, s = 0; o < n; o++, s += 2) {
    const i = Ma(t.charCodeAt(s)), a = Ma(t.charCodeAt(s + 1));
    if (i === void 0 || a === void 0) {
      const c = t[s] + t[s + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + s);
    }
    r[o] = i * 16 + a;
  }
  return r;
}
const gf = async () => {
};
async function Wd(t, e, n) {
  let r = Date.now();
  for (let o = 0; o < t; o++) {
    n(o);
    const s = Date.now() - r;
    s >= 0 && s < e || (await gf(), r += s);
  }
}
function $i(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function Jd(t) {
  return new TextDecoder().decode(t);
}
function jn(t) {
  return typeof t == "string" && (t = $i(t)), Ke(t), t;
}
function Xd(t) {
  return typeof t == "string" && (t = $i(t)), Ke(t), t;
}
function Yd(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const o = t[r];
    Ke(o), e += o.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, o = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, o), o += s.length;
  }
  return n;
}
function Zd(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let _i = class {
};
function No(t) {
  const e = (r) => t().update(jn(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function xf(t) {
  const e = (r, o) => t(o).update(jn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function wf(t) {
  const e = (r, o) => t(o).update(jn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const Qd = No, tp = xf, ep = wf;
function np(t = 32) {
  if (vn && typeof vn.getRandomValues == "function")
    return vn.getRandomValues(new Uint8Array(t));
  if (vn && typeof vn.randomBytes == "function")
    return Uint8Array.from(vn.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const rp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: _i,
  abytes: Ke,
  aexists: dr,
  ahash: hf,
  anumber: Ts,
  aoutput: uf,
  asyncLoop: Wd,
  byteSwap: Bi,
  byteSwap32: pf,
  byteSwapIfBE: zd,
  bytesToHex: jd,
  bytesToUtf8: Jd,
  checkOpts: Zd,
  clean: pr,
  concatBytes: Yd,
  createHasher: No,
  createOptHasher: xf,
  createView: uo,
  createXOFer: wf,
  hexToBytes: qd,
  isBytes: ff,
  isLE: vi,
  kdfInputToBytes: Xd,
  nextTick: gf,
  randomBytes: np,
  rotl: Gd,
  rotr: Nt,
  swap32IfBE: Vd,
  swap8IfBE: df,
  toBytes: jn,
  u32: Rd,
  u8: Md,
  utf8ToBytes: $i,
  wrapConstructor: Qd,
  wrapConstructorWithOpts: tp,
  wrapXOFConstructorWithOpts: ep
}, Symbol.toStringTag, { value: "Module" })), Er = /* @__PURE__ */ Sr(rp);
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
})(Ai);
var an = {};
function op(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, h = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + h, a, r);
}
function sp(t, e, n) {
  return t & e ^ ~t & n;
}
function ip(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class ap extends _i {
  constructor(e, n, r, o) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = o, this.buffer = new Uint8Array(e), this.view = uo(this.buffer);
  }
  update(e) {
    dr(this), e = jn(e), Ke(e);
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
    dr(this), uf(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, pr(this.buffer.subarray(i)), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let l = i; l < o; l++)
      n[l] = 0;
    op(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
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
const xe = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), we = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), cp = /* @__PURE__ */ Uint32Array.from([
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
]), ye = /* @__PURE__ */ new Uint32Array(64);
let Li = class extends ap {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = xe[0] | 0, this.B = xe[1] | 0, this.C = xe[2] | 0, this.D = xe[3] | 0, this.E = xe[4] | 0, this.F = xe[5] | 0, this.G = xe[6] | 0, this.H = xe[7] | 0;
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
      ye[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = ye[l - 15], p = ye[l - 2], g = Nt(b, 7) ^ Nt(b, 18) ^ b >>> 3, w = Nt(p, 17) ^ Nt(p, 19) ^ p >>> 10;
      ye[l] = w + ye[l - 7] + g + ye[l - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: h, H: u } = this;
    for (let l = 0; l < 64; l++) {
      const b = Nt(a, 6) ^ Nt(a, 11) ^ Nt(a, 25), p = u + b + sp(a, c, h) + cp[l] + ye[l] | 0, w = (Nt(r, 2) ^ Nt(r, 13) ^ Nt(r, 22)) + ip(r, o, s) | 0;
      u = h, h = c, c = a, a = i + p | 0, i = s, s = o, o = r, r = p + w | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, h = h + this.G | 0, u = u + this.H | 0, this.set(r, o, s, i, a, c, h, u);
  }
  roundClean() {
    pr(ye);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), pr(this.buffer);
  }
}, yf = class extends Li {
  constructor() {
    super(28), this.A = we[0] | 0, this.B = we[1] | 0, this.C = we[2] | 0, this.D = we[3] | 0, this.E = we[4] | 0, this.F = we[5] | 0, this.G = we[6] | 0, this.H = we[7] | 0;
  }
};
const lp = /* @__PURE__ */ No(() => new Li()), fp = /* @__PURE__ */ No(() => new yf()), hp = Li, up = lp, dp = yf, pp = fp, bp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: dp,
  SHA256: hp,
  sha224: pp,
  sha256: up
}, Symbol.toStringTag, { value: "Module" })), Po = /* @__PURE__ */ Sr(bp);
Object.defineProperty(an, "__esModule", { value: !0 });
an.c32checkDecode = an.c32checkEncode = void 0;
const Ra = Po, Ga = Er, fr = Ai;
function mf(t) {
  const e = (0, Ra.sha256)((0, Ra.sha256)((0, Ga.hexToBytes)(t)));
  return (0, Ga.bytesToHex)(e.slice(0, 4));
}
function gp(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = mf(`${n}${e}`), o = (0, fr.c32encode)(`${e}${r}`);
  return `${fr.c32[t]}${o}`;
}
an.c32checkEncode = gp;
function xp(t) {
  t = (0, fr.c32normalize)(t);
  const e = (0, fr.c32decode)(t.slice(1)), n = t[0], r = fr.c32.indexOf(n), o = e.slice(-8);
  let s = r.toString(16);
  if (s.length === 1 && (s = `0${s}`), mf(`${s}${e.substring(0, e.length - 8)}`) !== o)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
an.c32checkDecode = xp;
var Sf = {}, Pn = {};
function wp(t) {
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
var Ef = wp;
Object.defineProperty(Pn, "__esModule", { value: !0 });
Pn.decode = Pn.encode = void 0;
const So = Po, za = Er, Af = Ef, vf = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function yp(t, e = "00") {
  const n = typeof t == "string" ? (0, za.hexToBytes)(t) : t, r = typeof e == "string" ? (0, za.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const o = (0, So.sha256)((0, So.sha256)(new Uint8Array([...r, ...n])));
  return Af(vf).encode([...r, ...n, ...o.slice(0, 4)]);
}
Pn.encode = yp;
function mp(t) {
  const e = Af(vf).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), o = (0, So.sha256)((0, So.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((s, i) => {
    if (s !== o[i])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Pn.decode = mp;
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
})(Sf);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Ai;
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
  const r = Sf;
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
  var n = 200, r = "__lodash_hash_undefined__", o = 9007199254740991, s = "[object Arguments]", i = "[object Array]", a = "[object Boolean]", c = "[object Date]", h = "[object Error]", u = "[object Function]", l = "[object GeneratorFunction]", b = "[object Map]", p = "[object Number]", g = "[object Object]", w = "[object Promise]", E = "[object RegExp]", $ = "[object Set]", H = "[object String]", y = "[object Symbol]", _ = "[object WeakMap]", v = "[object ArrayBuffer]", P = "[object DataView]", M = "[object Float32Array]", O = "[object Float64Array]", N = "[object Int8Array]", x = "[object Int16Array]", A = "[object Int32Array]", k = "[object Uint8Array]", C = "[object Uint8ClampedArray]", R = "[object Uint16Array]", D = "[object Uint32Array]", ht = /[\\^$.*+?()[\]{}|]/g, rt = /\w*$/, je = /^\[object .+?Constructor\]$/, st = /^(?:0|[1-9]\d*)$/, z = {};
  z[s] = z[i] = z[v] = z[P] = z[a] = z[c] = z[M] = z[O] = z[N] = z[x] = z[A] = z[b] = z[p] = z[g] = z[E] = z[$] = z[H] = z[y] = z[k] = z[C] = z[R] = z[D] = !0, z[h] = z[u] = z[_] = !1;
  var Lr = typeof gt == "object" && gt && gt.Object === Object && gt, Xn = typeof self == "object" && self && self.Object === Object && self, wt = Lr || Xn || Function("return this")(), qe = e && !e.nodeType && e, St = qe && !0 && t && !t.nodeType && t, Lt = St && St.exports === qe;
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
    for (var dt = -1, yt = d ? d.length : 0; ++dt < yt; )
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
  var ts = Array.prototype, es = Function.prototype, et = Object.prototype, We = wt["__core-js_shared__"], pt = function() {
    var d = /[^.]+$/.exec(We && We.keys && We.keys.IE_PROTO || "");
    return d ? "Symbol(src)_1." + d : "";
  }(), tr = es.toString, Ut = et.hasOwnProperty, Je = et.toString, ns = RegExp(
    "^" + tr.call(Ut).replace(ht, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Xe = Lt ? wt.Buffer : void 0, er = wt.Symbol, nr = wt.Uint8Array, rs = Zn(Object.getPrototypeOf, Object), Ir = Object.create, Ur = et.propertyIsEnumerable, Or = ts.splice, Cr = Object.getOwnPropertySymbols, Nr = Xe ? Xe.isBuffer : void 0, os = Zn(Object.keys, Object), m = Sn(wt, "DataView"), F = Sn(wt, "Map"), Y = Sn(wt, "Promise"), X = Sn(wt, "Set"), it = Sn(wt, "WeakMap"), ut = Sn(Object, "create"), Et = Qe(m), At = Qe(F), ue = Qe(Y), Ot = Qe(X), oa = Qe(it), sa = er ? er.prototype : void 0, ia = sa ? sa.valueOf : void 0;
  function Ye(d) {
    var S = -1, B = d ? d.length : 0;
    for (this.clear(); ++S < B; ) {
      var T = d[S];
      this.set(T[0], T[1]);
    }
  }
  function S0() {
    this.__data__ = ut ? ut(null) : {};
  }
  function E0(d) {
    return this.has(d) && delete this.__data__[d];
  }
  function A0(d) {
    var S = this.__data__;
    if (ut) {
      var B = S[d];
      return B === r ? void 0 : B;
    }
    return Ut.call(S, d) ? S[d] : void 0;
  }
  function v0(d) {
    var S = this.__data__;
    return ut ? S[d] !== void 0 : Ut.call(S, d);
  }
  function B0(d, S) {
    var B = this.__data__;
    return B[d] = ut && S === void 0 ? r : S, this;
  }
  Ye.prototype.clear = S0, Ye.prototype.delete = E0, Ye.prototype.get = A0, Ye.prototype.has = v0, Ye.prototype.set = B0;
  function ne(d) {
    var S = -1, B = d ? d.length : 0;
    for (this.clear(); ++S < B; ) {
      var T = d[S];
      this.set(T[0], T[1]);
    }
  }
  function $0() {
    this.__data__ = [];
  }
  function _0(d) {
    var S = this.__data__, B = Pr(S, d);
    if (B < 0)
      return !1;
    var T = S.length - 1;
    return B == T ? S.pop() : Or.call(S, B, 1), !0;
  }
  function L0(d) {
    var S = this.__data__, B = Pr(S, d);
    return B < 0 ? void 0 : S[B][1];
  }
  function H0(d) {
    return Pr(this.__data__, d) > -1;
  }
  function k0(d, S) {
    var B = this.__data__, T = Pr(B, d);
    return T < 0 ? B.push([d, S]) : B[T][1] = S, this;
  }
  ne.prototype.clear = $0, ne.prototype.delete = _0, ne.prototype.get = L0, ne.prototype.has = H0, ne.prototype.set = k0;
  function yn(d) {
    var S = -1, B = d ? d.length : 0;
    for (this.clear(); ++S < B; ) {
      var T = d[S];
      this.set(T[0], T[1]);
    }
  }
  function I0() {
    this.__data__ = {
      hash: new Ye(),
      map: new (F || ne)(),
      string: new Ye()
    };
  }
  function U0(d) {
    return Dr(this, d).delete(d);
  }
  function O0(d) {
    return Dr(this, d).get(d);
  }
  function C0(d) {
    return Dr(this, d).has(d);
  }
  function N0(d, S) {
    return Dr(this, d).set(d, S), this;
  }
  yn.prototype.clear = I0, yn.prototype.delete = U0, yn.prototype.get = O0, yn.prototype.has = C0, yn.prototype.set = N0;
  function mn(d) {
    this.__data__ = new ne(d);
  }
  function P0() {
    this.__data__ = new ne();
  }
  function D0(d) {
    return this.__data__.delete(d);
  }
  function T0(d) {
    return this.__data__.get(d);
  }
  function F0(d) {
    return this.__data__.has(d);
  }
  function M0(d, S) {
    var B = this.__data__;
    if (B instanceof ne) {
      var T = B.__data__;
      if (!F || T.length < n - 1)
        return T.push([d, S]), this;
      B = this.__data__ = new yn(T);
    }
    return B.set(d, S), this;
  }
  mn.prototype.clear = P0, mn.prototype.delete = D0, mn.prototype.get = T0, mn.prototype.has = F0, mn.prototype.set = M0;
  function R0(d, S) {
    var B = as(d) || hu(d) ? kr(d.length, String) : [], T = B.length, dt = !!T;
    for (var yt in d)
      Ut.call(d, yt) && !(dt && (yt == "length" || au(yt, T))) && B.push(yt);
    return B;
  }
  function aa(d, S, B) {
    var T = d[S];
    (!(Ut.call(d, S) && ha(T, B)) || B === void 0 && !(S in d)) && (d[S] = B);
  }
  function Pr(d, S) {
    for (var B = d.length; B--; )
      if (ha(d[B][0], S))
        return B;
    return -1;
  }
  function G0(d, S) {
    return d && ca(S, cs(S), d);
  }
  function ss(d, S, B, T, dt, yt, re) {
    var mt;
    if (T && (mt = yt ? T(d, dt, yt, re) : T(d)), mt !== void 0)
      return mt;
    if (!Tr(d))
      return d;
    var pa = as(d);
    if (pa) {
      if (mt = ou(d), !S)
        return eu(d, mt);
    } else {
      var En = Ze(d), ba = En == u || En == l;
      if (du(d))
        return W0(d, S);
      if (En == g || En == s || ba && !yt) {
        if (Yn(d))
          return yt ? d : {};
        if (mt = su(ba ? {} : d), !S)
          return nu(d, G0(mt, d));
      } else {
        if (!z[En])
          return yt ? d : {};
        mt = iu(d, En, ss, S);
      }
    }
    re || (re = new mn());
    var ga = re.get(d);
    if (ga)
      return ga;
    if (re.set(d, mt), !pa)
      var xa = B ? ru(d) : cs(d);
    return xn(xa || d, function(ls, Fr) {
      xa && (Fr = ls, ls = d[Fr]), aa(mt, Fr, ss(ls, S, B, T, Fr, d, re));
    }), mt;
  }
  function z0(d) {
    return Tr(d) ? Ir(d) : {};
  }
  function V0(d, S, B) {
    var T = S(d);
    return as(d) ? T : Zo(T, B(d));
  }
  function K0(d) {
    return Je.call(d);
  }
  function j0(d) {
    if (!Tr(d) || lu(d))
      return !1;
    var S = da(d) || Yn(d) ? ns : je;
    return S.test(Qe(d));
  }
  function q0(d) {
    if (!fa(d))
      return os(d);
    var S = [];
    for (var B in Object(d))
      Ut.call(d, B) && B != "constructor" && S.push(B);
    return S;
  }
  function W0(d, S) {
    if (S)
      return d.slice();
    var B = new d.constructor(d.length);
    return d.copy(B), B;
  }
  function is(d) {
    var S = new d.constructor(d.byteLength);
    return new nr(S).set(new nr(d)), S;
  }
  function J0(d, S) {
    var B = S ? is(d.buffer) : d.buffer;
    return new d.constructor(B, d.byteOffset, d.byteLength);
  }
  function X0(d, S, B) {
    var T = S ? B(wn(d), !0) : wn(d);
    return Hr(T, Xo, new d.constructor());
  }
  function Y0(d) {
    var S = new d.constructor(d.source, rt.exec(d));
    return S.lastIndex = d.lastIndex, S;
  }
  function Z0(d, S, B) {
    var T = S ? B(Qn(d), !0) : Qn(d);
    return Hr(T, Yo, new d.constructor());
  }
  function Q0(d) {
    return ia ? Object(ia.call(d)) : {};
  }
  function tu(d, S) {
    var B = S ? is(d.buffer) : d.buffer;
    return new d.constructor(B, d.byteOffset, d.length);
  }
  function eu(d, S) {
    var B = -1, T = d.length;
    for (S || (S = Array(T)); ++B < T; )
      S[B] = d[B];
    return S;
  }
  function ca(d, S, B, T) {
    B || (B = {});
    for (var dt = -1, yt = S.length; ++dt < yt; ) {
      var re = S[dt], mt = void 0;
      aa(B, re, mt === void 0 ? d[re] : mt);
    }
    return B;
  }
  function nu(d, S) {
    return ca(d, la(d), S);
  }
  function ru(d) {
    return V0(d, cs, la);
  }
  function Dr(d, S) {
    var B = d.__data__;
    return cu(S) ? B[typeof S == "string" ? "string" : "hash"] : B.map;
  }
  function Sn(d, S) {
    var B = Qo(d, S);
    return j0(B) ? B : void 0;
  }
  var la = Cr ? Zn(Cr, Object) : gu, Ze = K0;
  (m && Ze(new m(new ArrayBuffer(1))) != P || F && Ze(new F()) != b || Y && Ze(Y.resolve()) != w || X && Ze(new X()) != $ || it && Ze(new it()) != _) && (Ze = function(d) {
    var S = Je.call(d), B = S == g ? d.constructor : void 0, T = B ? Qe(B) : void 0;
    if (T)
      switch (T) {
        case Et:
          return P;
        case At:
          return b;
        case ue:
          return w;
        case Ot:
          return $;
        case oa:
          return _;
      }
    return S;
  });
  function ou(d) {
    var S = d.length, B = d.constructor(S);
    return S && typeof d[0] == "string" && Ut.call(d, "index") && (B.index = d.index, B.input = d.input), B;
  }
  function su(d) {
    return typeof d.constructor == "function" && !fa(d) ? z0(rs(d)) : {};
  }
  function iu(d, S, B, T) {
    var dt = d.constructor;
    switch (S) {
      case v:
        return is(d);
      case a:
      case c:
        return new dt(+d);
      case P:
        return J0(d, T);
      case M:
      case O:
      case N:
      case x:
      case A:
      case k:
      case C:
      case R:
      case D:
        return tu(d, T);
      case b:
        return X0(d, T, B);
      case p:
      case H:
        return new dt(d);
      case E:
        return Y0(d);
      case $:
        return Z0(d, T, B);
      case y:
        return Q0(d);
    }
  }
  function au(d, S) {
    return S = S ?? o, !!S && (typeof d == "number" || st.test(d)) && d > -1 && d % 1 == 0 && d < S;
  }
  function cu(d) {
    var S = typeof d;
    return S == "string" || S == "number" || S == "symbol" || S == "boolean" ? d !== "__proto__" : d === null;
  }
  function lu(d) {
    return !!pt && pt in d;
  }
  function fa(d) {
    var S = d && d.constructor, B = typeof S == "function" && S.prototype || et;
    return d === B;
  }
  function Qe(d) {
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
  function fu(d) {
    return ss(d, !0, !0);
  }
  function ha(d, S) {
    return d === S || d !== d && S !== S;
  }
  function hu(d) {
    return uu(d) && Ut.call(d, "callee") && (!Ur.call(d, "callee") || Je.call(d) == s);
  }
  var as = Array.isArray;
  function ua(d) {
    return d != null && pu(d.length) && !da(d);
  }
  function uu(d) {
    return bu(d) && ua(d);
  }
  var du = Nr || xu;
  function da(d) {
    var S = Tr(d) ? Je.call(d) : "";
    return S == u || S == l;
  }
  function pu(d) {
    return typeof d == "number" && d > -1 && d % 1 == 0 && d <= o;
  }
  function Tr(d) {
    var S = typeof d;
    return !!d && (S == "object" || S == "function");
  }
  function bu(d) {
    return !!d && typeof d == "object";
  }
  function cs(d) {
    return ua(d) ? R0(d) : q0(d);
  }
  function gu() {
    return [];
  }
  function xu() {
    return !1;
  }
  t.exports = fu;
})(Eo, Eo.exports);
Eo.exports;
function Fs(t) {
  return Kn.c32address(t.version, t.hash160);
}
function Hi(t, e, n) {
  const r = e || 1, o = n || Hu;
  if (Yp(t, o))
    throw new Error(`String length exceeds maximum bytes ${o}`);
  return {
    type: ur.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: o
  };
}
function ki(t) {
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
function Sp(t) {
  if (t.type === L.PrincipalStandard)
    return Fs(t.address);
  if (t.type === L.PrincipalContract)
    return `${Fs(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function Ep(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Bp(e, n);
  } else
    return Ap(t);
}
function Ap(t) {
  const e = ki(t);
  return { type: L.PrincipalStandard, address: e };
}
function vp(t) {
  return { type: L.PrincipalStandard, address: t };
}
function Bp(t, e) {
  const n = ki(t), r = Hi(e);
  return Bf(n, r);
}
function Bf(t, e) {
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
      return `0x${le(t.buffer)}`;
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
      return Sp(t);
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
      return { type: Me(t), value: ds(t, !0), success: !1 };
    case L.ResponseOk:
      return { type: Me(t), value: ds(t, !0), success: !0 };
    default:
      return { type: Me(t), value: ds(t, !0) };
  }
}
function Me(t) {
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
      return `(optional ${Me(t.value)})`;
    case L.ResponseErr:
      return `(response UnknownType ${Me(t.value)})`;
    case L.ResponseOk:
      return `(response ${Me(t.value)} UnknownType)`;
    case L.PrincipalStandard:
    case L.PrincipalContract:
      return "principal";
    case L.List:
      return `(list ${t.list.length} ${t.list.length ? Me(t.list[0]) : "UnknownType"})`;
    case L.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${Me(t.data[e])})`).join(" ")})`;
    case L.StringASCII:
      return `(string-ascii ${Ml(t.data).length})`;
    case L.StringUTF8:
      return `(string-utf8 ${mr(t.data).length})`;
  }
}
const $p = () => ({ type: L.BoolTrue }), _p = () => ({ type: L.BoolFalse }), Va = BigInt("0xffffffffffffffffffffffffffffffff"), Lp = BigInt(0), Ka = BigInt("0x7fffffffffffffffffffffffffffffff"), ja = BigInt("-170141183460469231731687303715884105728"), Hp = (t) => {
  const e = ui(t, !0);
  if (e > Ka)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Ka}`);
  if (e < ja)
    throw new RangeError(`Cannot construct clarity integer form value less than ${ja}`);
  return { type: L.Int, value: e };
}, $f = (t) => {
  const e = ui(t, !1);
  if (e < Lp)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Va)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Va}`);
  return { type: L.UInt, value: e };
}, kp = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: L.Buffer, buffer: t };
};
function Ip() {
  return { type: L.OptionalNone };
}
function Up(t) {
  return { type: L.OptionalSome, value: t };
}
function Op(t) {
  return { type: L.ResponseErr, value: t };
}
function Cp(t) {
  return { type: L.ResponseOk, value: t };
}
function Np(t) {
  return { type: L.List, list: t };
}
function _f(t) {
  for (const e in t)
    if (!Zp(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: L.Tuple, data: t };
}
const po = (t) => ({ type: L.StringASCII, data: t }), Pp = (t) => ({ type: L.StringUTF8, data: t });
let Lf = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Dp = class extends Lf {
  constructor(e) {
    super(e);
  }
};
class ps extends Lf {
  constructor(e) {
    super(e);
  }
}
function Hf(t) {
  const e = [];
  return e.push(In(di(t.version, 1))), e.push(In(t.hash160)), zn(e);
}
function qa(t) {
  const e = Dl(le(t.readBytes(1))), n = le(t.readBytes(20));
  return { type: ur.Address, version: e, hash160: n };
}
function kf(t) {
  const e = [], n = mr(t.content), r = n.byteLength;
  return e.push(In(di(r, t.lengthPrefixBytes))), e.push(n), zn(e);
}
function Wa(t, e, n) {
  e = e || 1;
  const r = Dl(le(t.readBytes(e))), o = Fl(t.readBytes(r));
  return Hi(o, e, 128);
}
function Qt(t, e) {
  return zn([t, e]);
}
function Tp(t) {
  return new Uint8Array([t.type]);
}
function Fp(t) {
  return t.type === L.OptionalNone ? new Uint8Array([t.type]) : Qt(t.type, Ar(t.value));
}
function Mp(t) {
  const e = new Uint8Array(4);
  return Oo(e, t.buffer.length, 0), Qt(t.type, pi(e, t.buffer));
}
function Rp(t) {
  const e = Tl(mu(t.value, BigInt(ku)), Rl);
  return Qt(t.type, e);
}
function Gp(t) {
  const e = Tl(t.value, Rl);
  return Qt(t.type, e);
}
function zp(t) {
  return Qt(t.type, Hf(t.address));
}
function Vp(t) {
  return Qt(t.type, pi(Hf(t.address), kf(t.contractName)));
}
function Kp(t) {
  return Qt(t.type, Ar(t.value));
}
function jp(t) {
  const e = [], n = new Uint8Array(4);
  Oo(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const o = Ar(r);
    e.push(o);
  }
  return Qt(t.type, zn(e));
}
function qp(t) {
  const e = [], n = new Uint8Array(4);
  Oo(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((o, s) => o.localeCompare(s));
  for (const o of r) {
    const s = Hi(o);
    e.push(kf(s));
    const i = Ar(t.data[o]);
    e.push(i);
  }
  return Qt(t.type, zn(e));
}
function If(t, e) {
  const n = [], r = e == "ascii" ? Ml(t.data) : mr(t.data), o = new Uint8Array(4);
  return Oo(o, r.length, 0), n.push(o), n.push(r), Qt(t.type, zn(n));
}
function Wp(t) {
  return If(t, "ascii");
}
function Jp(t) {
  return If(t, "utf8");
}
function Ar(t) {
  switch (t.type) {
    case L.BoolTrue:
    case L.BoolFalse:
      return Tp(t);
    case L.OptionalNone:
    case L.OptionalSome:
      return Fp(t);
    case L.Buffer:
      return Mp(t);
    case L.UInt:
      return Gp(t);
    case L.Int:
      return Rp(t);
    case L.PrincipalStandard:
      return zp(t);
    case L.PrincipalContract:
      return Vp(t);
    case L.ResponseOk:
    case L.ResponseErr:
      return Kp(t);
    case L.List:
      return jp(t);
    case L.Tuple:
      return qp(t);
    case L.StringASCII:
      return Wp(t);
    case L.StringUTF8:
      return Jp(t);
    default:
      throw new Dp("Unable to serialize. Invalid Clarity Value.");
  }
}
function Xp(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Ja = /* @__PURE__ */ new Map();
function Uf(t, e) {
  const n = Ja.get(t);
  if (n !== void 0)
    return n(e);
  const r = Xp(t);
  return Ja.set(t, r), Uf(t, e);
}
class Xa {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Lu(this.readBytes(4), 0);
  }
  readUInt8() {
    return _u(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return $u(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = le(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = le(n);
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
    if (Uf(e, r))
      return r;
    throw n(r);
  }
}
function Ln(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Xa(In(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Xa(t) : e = t;
  switch (e.readUInt8Enum(L, (r) => {
    throw new ps(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case L.Int:
      return Hp(e.readBytes(16));
    case L.UInt:
      return $f(e.readBytes(16));
    case L.Buffer:
      const r = e.readUInt32BE();
      return kp(e.readBytes(r));
    case L.BoolTrue:
      return $p();
    case L.BoolFalse:
      return _p();
    case L.PrincipalStandard:
      const o = qa(e);
      return vp(o);
    case L.PrincipalContract:
      const s = qa(e), i = Wa(e);
      return Bf(s, i);
    case L.ResponseOk:
      return Cp(Ln(e));
    case L.ResponseErr:
      return Op(Ln(e));
    case L.OptionalNone:
      return Ip();
    case L.OptionalSome:
      return Up(Ln(e));
    case L.List:
      const a = e.readUInt32BE(), c = [];
      for (let w = 0; w < a; w++)
        c.push(Ln(e));
      return Np(c);
    case L.Tuple:
      const h = e.readUInt32BE(), u = {};
      for (let w = 0; w < h; w++) {
        const E = Wa(e).content;
        if (E === void 0)
          throw new ps('"content" is undefined');
        u[E] = Ln(e);
      }
      return _f(u);
    case L.StringASCII:
      const l = e.readUInt32BE(), b = vu(e.readBytes(l));
      return po(b);
    case L.StringUTF8:
      const p = e.readUInt32BE(), g = Fl(e.readBytes(p));
      return Pp(g);
    default:
      throw new ps("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const Yp = (t, e) => t ? mr(t).length > e : !1;
function Zp(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function Of(t) {
  const e = Ar(t);
  return `0x${le(e)}`;
}
function Qp(t) {
  return Ln(t);
}
const tb = (t) => {
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
            var z = "response" in D ? D.response : D.responseText;
            setTimeout(function() {
              k(new M(z, st));
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
            var je = [];
            Object.getOwnPropertyNames(A.headers).forEach(function(st) {
              je.push(a(st)), D.setRequestHeader(st, c(A.headers[st]));
            }), R.headers.forEach(function(st, z) {
              je.indexOf(z) === -1 && D.setRequestHeader(z, st);
            });
          } else
            R.headers.forEach(function(st, z) {
              D.setRequestHeader(z, st);
            });
          R.signal && (R.signal.addEventListener("abort", ht), D.onreadystatechange = function() {
            D.readyState === 4 && R.signal.removeEventListener("abort", ht);
          }), D.send(typeof R._bodyInit > "u" ? null : R._bodyInit);
        });
      }
      return N.polyfill = !0, n.fetch || (n.fetch = N, n.Headers = u, n.Request = _, n.Response = M), e.Headers = u, e.Request = _, e.Response = M, e.fetch = N, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : gt);
})();
const eb = "https://browser.blockstack.org/auth", nb = {
  "@type": "Person",
  "@context": "http://schema.org"
}, Cf = ["store_write"], rb = "blockstack-session", ob = {
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
class sb extends qn {
  constructor(e, n = "") {
    super({ code: un.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Ya extends qn {
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
class Za extends qn {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: un.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Ms extends qn {
  constructor(e) {
    super({ code: un.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class Nf extends qn {
  constructor(e) {
    super({ code: un.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Qa = ["debug", "info", "warn", "error", "none"], Rs = {};
for (let t = 0; t < Qa.length; t++) {
  const e = Qa[t];
  Rs[e] = t;
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
    return Rs[ob.logLevel] <= Rs[e];
  }
}
function ib() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function ab() {
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
function cb() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function lb() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function fb(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function Ii(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let o;
  try {
    if (o = lb(), o) {
      const s = o[t];
      if (s)
        return s;
    }
  } catch (s) {
    Hn.error(`Error getting object '${t}' from global scope '${o}': ${s}`);
  }
  if (e) {
    const s = fb(o, t.toString(), n);
    throw Hn.error(s), new Error(s);
  }
  if (r)
    return {};
}
function hb(t) {
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
  if (xb(t, Uint8Array))
    return BigInt(`0x${It(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function ub(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Ui(t, e = 8) {
  return (typeof t == "bigint" ? t : hb(t)).toString(16).padStart(e * 2, "0");
}
function Pf(t, e = 16) {
  const n = Ui(t, e);
  return $t(n);
}
function db(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const pb = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function It(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += pb[n];
  return e;
}
function $t(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = ub(t), t = t.length % 2 ? `0${t}` : t;
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
function Df(t) {
  return new TextDecoder().decode(t);
}
function bb(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function gb(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function tc(t) {
  if (t.some(gb))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function fe(...t) {
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
  return fe(...t.map((e) => typeof e == "number" ? tc([e]) : e instanceof Array ? tc(e) : e));
}
function xb(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const wb = "https://api.mainnet.hiro.so", yb = "https://api.testnet.hiro.so", mb = "http://localhost:3999", Sb = "https://hub.blockstack.org";
function Eb(t) {
  const e = typeof t == "string" ? $t(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Do(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const Ab = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function vb(t, e) {
  const n = {};
  return Object.assign(n, Ab, e), await fetch(t, n);
}
function Bb(t) {
  let e = vb, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function $b(...t) {
  const { fetchLib: e, middlewares: n } = Bb(t);
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
class Tf {
  constructor(e = Cf.slice(), n = ((a) => (a = Ii("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", o = "/manifest.json", s = void 0, i = eb) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = o, this.coreNode = s, this.authenticatorURL = i;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Gs(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function _b(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Ff(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Lb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Gs(t.outputLen), Gs(t.blockLen);
}
function Hb(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function kb(t, e) {
  Ff(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const tn = {
  number: Gs,
  bool: _b,
  bytes: Ff,
  hash: Lb,
  exists: Hb,
  output: kb
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const gs = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), zt = (t, e) => t << 32 - e | t >>> e, Ib = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Ib)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ub(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Oi(t) {
  if (typeof t == "string" && (t = Ub(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Mf = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function dn(t) {
  const e = (r) => t().update(Oi(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Rf = class extends Mf {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, tn.hash(e);
    const r = Oi(n);
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
const To = (t, e, n) => new Rf(t, e).update(n).digest();
To.create = (t, e) => new Rf(t, e);
function Ob(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, h = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + h, a, r);
}
let Ci = class extends Mf {
  constructor(e, n, r, o) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = gs(this.buffer);
  }
  update(e) {
    tn.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    e = Oi(e);
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
    Ob(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
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
const Cb = (t, e, n) => t & e ^ ~t & n, Nb = (t, e, n) => t & e ^ t & n ^ e & n, Pb = new Uint32Array([
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
let Gf = class extends Ci {
  constructor() {
    super(64, 32, 8, !1), this.A = me[0] | 0, this.B = me[1] | 0, this.C = me[2] | 0, this.D = me[3] | 0, this.E = me[4] | 0, this.F = me[5] | 0, this.G = me[6] | 0, this.H = me[7] | 0;
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
      Se[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = Se[l - 15], p = Se[l - 2], g = zt(b, 7) ^ zt(b, 18) ^ b >>> 3, w = zt(p, 17) ^ zt(p, 19) ^ p >>> 10;
      Se[l] = w + Se[l - 7] + g + Se[l - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: h, H: u } = this;
    for (let l = 0; l < 64; l++) {
      const b = zt(a, 6) ^ zt(a, 11) ^ zt(a, 25), p = u + b + Cb(a, c, h) + Pb[l] + Se[l] | 0, w = (zt(r, 2) ^ zt(r, 13) ^ zt(r, 22)) + Nb(r, o, s) | 0;
      u = h, h = c, c = a, a = i + p | 0, i = s, s = o, o = r, r = p + w | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, h = h + this.G | 0, u = u + this.H | 0, this.set(r, o, s, i, a, c, h, u);
  }
  roundClean() {
    Se.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Db = class extends Gf {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Dn = dn(() => new Gf());
dn(() => new Db());
var Br = {};
Br.byteLength = Gb;
var Tb = Br.toByteArray = Vb, Fb = Br.fromByteArray = qb, Wt = [], kt = [], Mb = typeof Uint8Array < "u" ? Uint8Array : Array, xs = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Bn = 0, Rb = xs.length; Bn < Rb; ++Bn)
  Wt[Bn] = xs[Bn], kt[xs.charCodeAt(Bn)] = Bn;
kt[45] = 62;
kt[95] = 63;
function zf(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Gb(t) {
  var e = zf(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function zb(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Vb(t) {
  var e, n = zf(t), r = n[0], o = n[1], s = new Mb(zb(t, r, o)), i = 0, a = o > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = kt[t.charCodeAt(c)] << 18 | kt[t.charCodeAt(c + 1)] << 12 | kt[t.charCodeAt(c + 2)] << 6 | kt[t.charCodeAt(c + 3)], s[i++] = e >> 16 & 255, s[i++] = e >> 8 & 255, s[i++] = e & 255;
  return o === 2 && (e = kt[t.charCodeAt(c)] << 2 | kt[t.charCodeAt(c + 1)] >> 4, s[i++] = e & 255), o === 1 && (e = kt[t.charCodeAt(c)] << 10 | kt[t.charCodeAt(c + 1)] << 4 | kt[t.charCodeAt(c + 2)] >> 2, s[i++] = e >> 8 & 255, s[i++] = e & 255), s;
}
function Kb(t) {
  return Wt[t >> 18 & 63] + Wt[t >> 12 & 63] + Wt[t >> 6 & 63] + Wt[t & 63];
}
function jb(t, e, n) {
  for (var r, o = [], s = e; s < n; s += 3)
    r = (t[s] << 16 & 16711680) + (t[s + 1] << 8 & 65280) + (t[s + 2] & 255), o.push(Kb(r));
  return o.join("");
}
function qb(t) {
  for (var e, n = t.length, r = n % 3, o = [], s = 16383, i = 0, a = n - r; i < a; i += s)
    o.push(jb(t, i, i + s > a ? a : i + s));
  return r === 1 ? (e = t[n - 1], o.push(
    Wt[e >> 2] + Wt[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], o.push(
    Wt[e >> 10] + Wt[e >> 4 & 63] + Wt[e << 2 & 63] + "="
  )), o.join("");
}
function Wb() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const Jb = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function Xb() {
  if (Wb())
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
    throw new Error(Jb);
  }
}
class Yb {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, o) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const s = this.createCipher(e, n, r), i = new Uint8Array(fe(s.update(o), s.final()));
    return Promise.resolve(i);
  }
  async decrypt(e, n, r, o) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const s = this.createDecipher(e, n, r), i = new Uint8Array(fe(s.update(o), s.final()));
    return Promise.resolve(i);
  }
}
class Zb {
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
async function Vf() {
  const t = await Xb();
  return t.name === "subtleCrypto" ? new Zb(t.lib) : new Yb(t.lib.createCipheriv, t.lib.createDecipheriv);
}
const Qb = Ef, t1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var e1 = Qb(t1);
const n1 = /* @__PURE__ */ Fd(e1), r1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Kf = Uint8Array.from({ length: 16 }, (t, e) => e), o1 = Kf.map((t) => (9 * t + 5) % 16);
let Ni = [Kf], Pi = [o1];
for (let t = 0; t < 4; t++)
  for (let e of [Ni, Pi])
    e.push(e[t].map((n) => r1[n]));
const jf = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), s1 = Ni.map((t, e) => t.map((n) => jf[e][n])), i1 = Pi.map((t, e) => t.map((n) => jf[e][n])), a1 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), c1 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Wr = (t, e) => t << e | t >>> 32 - e;
function ec(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Jr = new Uint32Array(16);
let l1 = class extends Ci {
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
      const g = 4 - p, w = a1[p], E = c1[p], $ = Ni[p], H = Pi[p], y = s1[p], _ = i1[p];
      for (let v = 0; v < 16; v++) {
        const P = Wr(r + ec(p, s, a, h) + Jr[$[v]] + w, y[v]) + l | 0;
        r = l, l = h, h = Wr(a, 10) | 0, a = s, s = P;
      }
      for (let v = 0; v < 16; v++) {
        const P = Wr(o + ec(g, i, c, u) + Jr[H[v]] + E, _[v]) + b | 0;
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
const f1 = dn(() => new l1());
function h1(t) {
  return f1(t);
}
const Xr = BigInt(2 ** 32 - 1), zs = BigInt(32);
function qf(t, e = !1) {
  return e ? { h: Number(t & Xr), l: Number(t >> zs & Xr) } : { h: Number(t >> zs & Xr) | 0, l: Number(t & Xr) | 0 };
}
function u1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let o = 0; o < t.length; o++) {
    const { h: s, l: i } = qf(t[o], e);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const d1 = (t, e) => BigInt(t >>> 0) << zs | BigInt(e >>> 0), p1 = (t, e, n) => t >>> n, b1 = (t, e, n) => t << 32 - n | e >>> n, g1 = (t, e, n) => t >>> n | e << 32 - n, x1 = (t, e, n) => t << 32 - n | e >>> n, w1 = (t, e, n) => t << 64 - n | e >>> n - 32, y1 = (t, e, n) => t >>> n - 32 | e << 64 - n, m1 = (t, e) => e, S1 = (t, e) => t, E1 = (t, e, n) => t << n | e >>> 32 - n, A1 = (t, e, n) => e << n | t >>> 32 - n, v1 = (t, e, n) => e << n - 32 | t >>> 64 - n, B1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function $1(t, e, n, r) {
  const o = (e >>> 0) + (r >>> 0);
  return { h: t + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const _1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), L1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, H1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), k1 = (t, e, n, r, o) => e + n + r + o + (t / 2 ** 32 | 0) | 0, I1 = (t, e, n, r, o) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), U1 = (t, e, n, r, o, s) => e + n + r + o + s + (t / 2 ** 32 | 0) | 0, K = {
  fromBig: qf,
  split: u1,
  toBig: d1,
  shrSH: p1,
  shrSL: b1,
  rotrSH: g1,
  rotrSL: x1,
  rotrBH: w1,
  rotrBL: y1,
  rotr32H: m1,
  rotr32L: S1,
  rotlSH: E1,
  rotlSL: A1,
  rotlBH: v1,
  rotlBL: B1,
  add: $1,
  add3L: _1,
  add3H: L1,
  add4L: H1,
  add4H: k1,
  add5H: U1,
  add5L: I1
}, [O1, C1] = K.split([
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
].map((t) => BigInt(t))), Ee = new Uint32Array(80), Ae = new Uint32Array(80);
let Fo = class extends Ci {
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
      Ee[y] = e.getUint32(n), Ae[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const _ = Ee[y - 15] | 0, v = Ae[y - 15] | 0, P = K.rotrSH(_, v, 1) ^ K.rotrSH(_, v, 8) ^ K.shrSH(_, v, 7), M = K.rotrSL(_, v, 1) ^ K.rotrSL(_, v, 8) ^ K.shrSL(_, v, 7), O = Ee[y - 2] | 0, N = Ae[y - 2] | 0, x = K.rotrSH(O, N, 19) ^ K.rotrBH(O, N, 61) ^ K.shrSH(O, N, 6), A = K.rotrSL(O, N, 19) ^ K.rotrBL(O, N, 61) ^ K.shrSL(O, N, 6), k = K.add4L(M, A, Ae[y - 7], Ae[y - 16]), C = K.add4H(k, P, x, Ee[y - 7], Ee[y - 16]);
      Ee[y] = C | 0, Ae[y] = k | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: a, Cl: c, Dh: h, Dl: u, Eh: l, El: b, Fh: p, Fl: g, Gh: w, Gl: E, Hh: $, Hl: H } = this;
    for (let y = 0; y < 80; y++) {
      const _ = K.rotrSH(l, b, 14) ^ K.rotrSH(l, b, 18) ^ K.rotrBH(l, b, 41), v = K.rotrSL(l, b, 14) ^ K.rotrSL(l, b, 18) ^ K.rotrBL(l, b, 41), P = l & p ^ ~l & w, M = b & g ^ ~b & E, O = K.add5L(H, v, M, C1[y], Ae[y]), N = K.add5H(O, $, _, P, O1[y], Ee[y]), x = O | 0, A = K.rotrSH(r, o, 28) ^ K.rotrBH(r, o, 34) ^ K.rotrBH(r, o, 39), k = K.rotrSL(r, o, 28) ^ K.rotrBL(r, o, 34) ^ K.rotrBL(r, o, 39), C = r & s ^ r & a ^ s & a, R = o & i ^ o & c ^ i & c;
      $ = w | 0, H = E | 0, w = p | 0, E = g | 0, p = l | 0, g = b | 0, { h: l, l: b } = K.add(h | 0, u | 0, N | 0, x | 0), h = a | 0, u = c | 0, a = s | 0, c = i | 0, s = r | 0, i = o | 0;
      const D = K.add3L(x, k, R);
      r = K.add3H(D, N, A, C), o = D | 0;
    }
    ({ h: r, l: o } = K.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = K.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: a, l: c } = K.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h, l: u } = K.add(this.Dh | 0, this.Dl | 0, h | 0, u | 0), { h: l, l: b } = K.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h: p, l: g } = K.add(this.Fh | 0, this.Fl | 0, p | 0, g | 0), { h: w, l: E } = K.add(this.Gh | 0, this.Gl | 0, w | 0, E | 0), { h: $, l: H } = K.add(this.Hh | 0, this.Hl | 0, $ | 0, H | 0), this.set(r, o, s, i, a, c, h, u, l, b, p, g, w, E, $, H);
  }
  roundClean() {
    Ee.fill(0), Ae.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, N1 = class extends Fo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, P1 = class extends Fo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, D1 = class extends Fo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const T1 = dn(() => new Fo());
dn(() => new N1());
dn(() => new P1());
dn(() => new D1());
function Wf(t) {
  return Dn(t);
}
function F1(t) {
  return T1(t);
}
const M1 = 0;
ct.hmacSha256Sync = (t, ...e) => {
  const n = To.create(Dn, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function R1() {
  return It(ct.randomPrivateKey());
}
function G1(t) {
  const e = Dn(Dn(t));
  return n1.encode(fe(t, e).slice(0, t.length + 4));
}
function z1(t, e) {
  return G1(fe(new Uint8Array([t]), e.slice(0, 20)));
}
function Jf(t, e = M1) {
  const n = typeof t == "string" ? $t(t) : t, r = h1(Wf(n));
  return z1(e, r);
}
function Xf(t) {
  const e = Eb(t);
  return It(Si(e.slice(0, 32), !0));
}
ct.hmacSha256Sync = (t, ...e) => {
  const n = To.create(Dn, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Ao;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Ao || (Ao = {}));
async function V1(t, e, n) {
  return await (await Vf()).encrypt("aes-256-cbc", e, t, n);
}
async function K1(t, e, n) {
  return await (await Vf()).decrypt("aes-256-cbc", e, t, n);
}
function Yf(t, e) {
  return To(Dn, t, e);
}
function j1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function Zf(t) {
  const e = F1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function q1(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function W1(t) {
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
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !q1(t))
    return e;
  try {
    return Q.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function J1(t, e, n, r) {
  const o = W1(t);
  if (!o.result)
    throw o;
  const s = ct.randomPrivateKey(), i = Si(s, !0);
  let a = Ei(s, t, !0);
  a = a.slice(1);
  const c = Zf(a), h = ct.randomBytes(16), u = await V1(h, c.encryptionKey, e), l = fe(h, i, u), b = Yf(c.hmacKey, l);
  let p;
  if (!r || r === "hex")
    p = It(u);
  else if (r === "base64")
    p = Fb(u);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const g = {
    iv: It(h),
    ephemeralPK: It(i),
    cipherText: p,
    mac: It(b),
    wasString: n
  };
  return r && r !== "hex" && (g.cipherTextEncoding = r), g;
}
async function Qf(t, e) {
  if (!e.ephemeralPK)
    throw new Za("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = Ei(t, n, !0);
  r = r.slice(1);
  const o = Zf(r), s = $t(e.iv);
  let i;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    i = $t(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    i = Tb(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = fe(s, $t(n), i), c = Yf(o.hmacKey, a), h = $t(e.mac);
  if (!j1(h, c))
    throw new Za("Decryption failed: failure in MAC check");
  const u = await K1(s, o.encryptionKey, i);
  return e.wasString ? Df(u) : u;
}
function X1(t, e) {
  const n = typeof e == "string" ? vr(e) : e, r = Xf(t), o = Wf(n), s = rf(o, t);
  return {
    signature: It(s),
    publicKey: r
  };
}
async function Y1(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = Xf(n.privateKey);
  }
  const o = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", s = typeof t == "string" ? vr(t) : t, i = await J1(n.publicKey, s, o, n.cipherTextEncoding);
  let a = JSON.stringify(i);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = X1(r, a), h = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(h);
  }
  return a;
}
function Z1(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return Qf(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var xt = {}, Tn = {}, bt = {};
Object.defineProperty(bt, "__esModule", { value: !0 });
bt.decode = bt.encode = bt.unescape = bt.escape = bt.pad = void 0;
const th = Br;
function Di(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
bt.pad = Di;
function eh(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
bt.escape = eh;
function nh(t) {
  return Di(t).replace(/-/g, "+").replace(/_/g, "/");
}
bt.unescape = nh;
function Q1(t) {
  return eh((0, th.fromByteArray)(new TextEncoder().encode(t)));
}
bt.encode = Q1;
function tg(t) {
  return new TextDecoder().decode((0, th.toByteArray)(Di(nh(t))));
}
bt.decode = tg;
var Mo = {}, Ro = {};
let Ti = class extends _i {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, hf(e);
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
    dr(this), Ke(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const rh = (t, e, n) => new Ti(t, e).update(n).digest();
rh.create = (t, e) => new Ti(t, e);
const eg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HMAC: Ti,
  hmac: rh
}, Symbol.toStringTag, { value: "Module" })), ng = /* @__PURE__ */ Sr(eg), rg = /* @__PURE__ */ Sr(Td);
var Fn = {};
Object.defineProperty(Fn, "__esModule", { value: !0 });
Fn.joseToDer = Fn.derToJose = void 0;
const oh = Br, sh = bt;
function ws(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const og = {
  ES256: ws(256),
  ES384: ws(384),
  ES512: ws(521)
};
function ih(t) {
  const e = og[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const vo = 128, ah = 0, sg = 32, ig = 16, ag = 2, ch = ig | sg | ah << 6, Bo = ag | ah << 6;
function lh(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, oh.toByteArray)((0, sh.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function cg(t, e) {
  const n = lh(t), r = ih(e), o = r + 1, s = n.length;
  let i = 0;
  if (n[i++] !== ch)
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
  return g.set(n.subarray(l + Math.max(-p, 0), l + u), i), (0, sh.escape)((0, oh.fromByteArray)(g));
}
Fn.derToJose = cg;
function nc(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= vo && --r, r;
}
function lg(t, e) {
  t = lh(t);
  const n = ih(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const o = nc(t, 0, n), s = nc(t, n, t.length), i = n - o, a = n - s, c = 2 + i + 1 + 1 + a, h = c < vo, u = new Uint8Array((h ? 2 : 3) + c);
  let l = 0;
  return u[l++] = ch, h ? u[l++] = c : (u[l++] = vo | 1, u[l++] = c & 255), u[l++] = Bo, u[l++] = i, o < 0 ? (u[l++] = 0, u.set(t.subarray(0, n), l), l += n) : (u.set(t.subarray(o, n), l), l += n - o), u[l++] = Bo, u[l++] = a, s < 0 ? (u[l++] = 0, u.set(t.subarray(n), l)) : u.set(t.subarray(n + s), l), u;
}
Fn.joseToDer = lg;
var he = {};
Object.defineProperty(he, "__esModule", { value: !0 });
he.InvalidTokenError = he.MissingParametersError = void 0;
class fg extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
he.MissingParametersError = fg;
class hg extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
he.InvalidTokenError = hg;
Object.defineProperty(Ro, "__esModule", { value: !0 });
Ro.SECP256K1Client = void 0;
const ug = ng, dg = Po, bo = rg, rc = Fn, oc = he, sc = Er;
bo.utils.hmacSha256Sync = (t, ...e) => {
  const n = ug.hmac.create(dg.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class fh {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, sc.bytesToHex)(bo.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new oc.MissingParametersError("a signing input hash and private key are all required");
    const o = bo.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, sc.bytesToHex)(o);
    if (r === "jose")
      return (0, rc.derToJose)(o, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, rc.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new oc.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return bo.verify(n, e, r, { strict: !1 });
  }
}
Ro.SECP256K1Client = fh;
fh.algorithmName = "ES256K";
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
const pg = /* @__PURE__ */ Sr(Wl);
var bg = gt && gt.__awaiter || function(t, e, n, r) {
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
const gg = Po;
function hh(t) {
  return (0, gg.sha256)(t);
}
cn.hashSha256 = hh;
function xg(t) {
  return bg(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = pg;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(hh(t));
    }
  });
}
cn.hashSha256Async = xg;
var wg = gt && gt.__awaiter || function(t, e, n, r) {
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
const Vs = bt, ic = Mo, yg = he, ac = cn;
function Ks(t, e) {
  const n = [], r = Vs.encode(JSON.stringify(e));
  n.push(r);
  const o = Vs.encode(JSON.stringify(t));
  return n.push(o), n.join(".");
}
function mg(t) {
  return Ks(t, { typ: "JWT", alg: "none" }) + ".";
}
Tn.createUnsecuredToken = mg;
class Sg {
  constructor(e, n) {
    if (!(e && n))
      throw new yg.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !ic.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = ic.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const o = this.header(r), s = Ks(e, o), i = (0, ac.hashSha256)(s);
    return this.createWithSignedHash(e, n, o, s, i);
  }
  signAsync(e, n = !1, r = {}) {
    return wg(this, void 0, void 0, function* () {
      const o = this.header(r), s = Ks(e, o), i = yield (0, ac.hashSha256Async)(s);
      return this.createWithSignedHash(e, n, o, s, i);
    });
  }
  createWithSignedHash(e, n, r, o, s) {
    const i = this.cryptoClient.signHash(s, this.rawPrivateKey);
    return n ? {
      header: [Vs.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [i]
    } : [o, i].join(".");
  }
}
Tn.TokenSigner = Sg;
var Go = {};
Object.defineProperty(Go, "__esModule", { value: !0 });
Go.TokenVerifier = void 0;
const Eg = bt, cc = Mo, Ag = he, Yr = cn;
class vg {
  constructor(e, n) {
    if (!(e && n))
      throw new Ag.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !cc.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = cc.cryptoClients[e], this.rawPublicKey = n;
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
    const r = [e.header.join("."), Eg.encode(e.payload)].join(".");
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
Go.TokenVerifier = vg;
var zo = {};
Object.defineProperty(zo, "__esModule", { value: !0 });
zo.decodeToken = void 0;
const Zr = bt;
function Bg(t) {
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
zo.decodeToken = Bg;
(function(t) {
  var e = gt && gt.__createBinding || (Object.create ? function(r, o, s, i) {
    i === void 0 && (i = s);
    var a = Object.getOwnPropertyDescriptor(o, s);
    (!a || ("get" in a ? !o.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return o[s];
    } }), Object.defineProperty(r, i, a);
  } : function(r, o, s, i) {
    i === void 0 && (i = s), r[i] = o[s];
  }), n = gt && gt.__exportStar || function(r, o) {
    for (var s in r) s !== "default" && !Object.prototype.hasOwnProperty.call(o, s) && e(o, r, s);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Tn, t), n(Go, t), n(zo, t), n(he, t), n(Mo, t);
})(xt);
function $g(t) {
  return `did:btc-addr:${t}`;
}
function _g(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Ya("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Ya('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function uh(t) {
  if (t)
    return _g(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const Lg = "1.4.0";
function Hg() {
  return R1();
}
function kg(t, e, n, r = Cf.slice(), o, s = ib().getTime(), i = {}) {
  const a = (p) => {
    const g = Ii("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${p}=undefined])`
    });
    return g == null ? void 0 : g.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), o || (o = a("appDomain"));
  const c = Object.assign({}, i, {
    jti: cb(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(s / 1e3),
    iss: null,
    public_keys: [],
    domain_name: o,
    manifest_uri: n,
    redirect_uri: e,
    version: Lg,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), h = xt.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [h];
  const u = Jf(h);
  return c.iss = $g(u), new xt.TokenSigner("ES256k", t).sign(c);
}
async function lc(t, e) {
  const n = Df($t(e)), r = JSON.parse(n), o = await Qf(t, r);
  if (typeof o != "string")
    throw new Error("Unable to correctly decrypt private key");
  return o;
}
function Ig(t) {
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
function Ug(t) {
  const e = xt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = uh(e.iss);
  if (n.length === 1) {
    if (Jf(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function Og(t) {
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
function Cg(t) {
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
function Ng(t) {
  const e = [
    Cg(t),
    Og(t),
    Ig(t),
    Ug(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const fc = "1.0.0";
class Ve {
  constructor(e) {
    this.version = fc, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== fc)
      throw new Ms(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Ve(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class dh {
  constructor(e) {
    if (e) {
      const n = new Ve(e);
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
class hc extends dh {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Ve({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new Nf("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Ve({})), !0;
  }
}
class uc extends dh {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = rb, !localStorage.getItem(this.key)) {
      const r = new Ve({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new Nf("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Ve.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Ve({})), !0;
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
var ae;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ae || (ae = {}));
var Xt;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Xt || (Xt = {}));
ae.Mainnet;
const ph = {
  chainId: br.Mainnet,
  transactionVersion: ae.Mainnet,
  peerNetworkId: $o.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Xt.MainnetSingleSig,
    multiSig: Xt.MainnetMultiSig
  },
  client: { baseUrl: wb }
}, js = {
  chainId: br.Testnet,
  transactionVersion: ae.Testnet,
  peerNetworkId: $o.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Xt.TestnetSingleSig,
    multiSig: Xt.TestnetMultiSig
  },
  client: { baseUrl: yb }
}, go = {
  ...js,
  addressVersion: { ...js.addressVersion },
  magicBytes: "id",
  client: { baseUrl: mb }
}, Pg = {
  ...go,
  addressVersion: { ...go.addressVersion },
  client: { ...go.client }
};
function Dg(t) {
  switch (t) {
    case "mainnet":
      return ph;
    case "testnet":
      return js;
    case "devnet":
      return go;
    case "mocknet":
      return Pg;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function bh(t) {
  return typeof t == "string" ? Dg(t) : t;
}
var dc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(dc || (dc = {}));
var pc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(pc || (pc = {}));
var Dt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Dt || (Dt = {}));
const ys = ["onChainOnly", "offChainOnly", "any"];
ys[0] + "", Dt.OnChainOnly, ys[1] + "", Dt.OffChainOnly, ys[2] + "", Dt.Any, Dt.OnChainOnly + "", Dt.OnChainOnly, Dt.OffChainOnly + "", Dt.OffChainOnly, Dt.Any + "", Dt.Any;
var bc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(bc || (bc = {}));
var gc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(gc || (gc = {}));
var xc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(xc || (xc = {}));
var ie;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(ie || (ie = {}));
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
var Bc;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Bc || (Bc = {}));
var $c;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})($c || ($c = {}));
function qs(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Tg(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function gh(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Fg(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  qs(t.outputLen), qs(t.blockLen);
}
function Mg(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Rg(t, e) {
  gh(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const en = {
  number: qs,
  bool: Tg,
  bytes: gh,
  hash: Fg,
  exists: Mg,
  output: Rg
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ms = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Vt = (t, e) => t << 32 - e | t >>> e, Gg = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Gg)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function zg(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Fi(t) {
  if (typeof t == "string" && (t = zg(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let xh = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function pn(t) {
  const e = (r) => t().update(Fi(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
class wh extends xh {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, en.hash(e);
    const r = Fi(n);
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
const yh = (t, e, n) => new wh(t, e).update(n).digest();
yh.create = (t, e) => new wh(t, e);
function Vg(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, h = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + h, a, r);
}
let Mi = class extends xh {
  constructor(e, n, r, o) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ms(this.buffer);
  }
  update(e) {
    en.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    e = Fi(e);
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
    Vg(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
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
const Kg = (t, e, n) => t & e ^ ~t & n, jg = (t, e, n) => t & e ^ t & n ^ e & n, qg = new Uint32Array([
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
]), ve = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Be = new Uint32Array(64);
let mh = class extends Mi {
  constructor() {
    super(64, 32, 8, !1), this.A = ve[0] | 0, this.B = ve[1] | 0, this.C = ve[2] | 0, this.D = ve[3] | 0, this.E = ve[4] | 0, this.F = ve[5] | 0, this.G = ve[6] | 0, this.H = ve[7] | 0;
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
      Be[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = Be[l - 15], p = Be[l - 2], g = Vt(b, 7) ^ Vt(b, 18) ^ b >>> 3, w = Vt(p, 17) ^ Vt(p, 19) ^ p >>> 10;
      Be[l] = w + Be[l - 7] + g + Be[l - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: h, H: u } = this;
    for (let l = 0; l < 64; l++) {
      const b = Vt(a, 6) ^ Vt(a, 11) ^ Vt(a, 25), p = u + b + Kg(a, c, h) + qg[l] + Be[l] | 0, w = (Vt(r, 2) ^ Vt(r, 13) ^ Vt(r, 22)) + jg(r, o, s) | 0;
      u = h, h = c, c = a, a = i + p | 0, i = s, s = o, o = r, r = p + w | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, h = h + this.G | 0, u = u + this.H | 0, this.set(r, o, s, i, a, c, h, u);
  }
  roundClean() {
    Be.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Wg = class extends mh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Sh = pn(() => new mh());
pn(() => new Wg());
function Jg(t, e) {
  switch (e = bh(e ?? ph), t) {
    case ie.P2PKH:
      switch (e.transactionVersion) {
        case ae.Mainnet:
          return Xt.MainnetSingleSig;
        case ae.Testnet:
          return Xt.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case ie.P2SH:
    case ie.P2SHNonSequential:
    case ie.P2WPKH:
    case ie.P2WSH:
    case ie.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case ae.Mainnet:
          return Xt.MainnetMultiSig;
        case ae.Testnet:
          return Xt.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const Xg = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Eh = Uint8Array.from({ length: 16 }, (t, e) => e), Yg = Eh.map((t) => (9 * t + 5) % 16);
let Ri = [Eh], Gi = [Yg];
for (let t = 0; t < 4; t++)
  for (let e of [Ri, Gi])
    e.push(e[t].map((n) => Xg[n]));
const Ah = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Zg = Ri.map((t, e) => t.map((n) => Ah[e][n])), Qg = Gi.map((t, e) => t.map((n) => Ah[e][n])), t2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), e2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Qr = (t, e) => t << e | t >>> 32 - e;
function _c(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const to = new Uint32Array(16);
let n2 = class extends Mi {
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
      const g = 4 - p, w = t2[p], E = e2[p], $ = Ri[p], H = Gi[p], y = Zg[p], _ = Qg[p];
      for (let v = 0; v < 16; v++) {
        const P = Qr(r + _c(p, s, a, h) + to[$[v]] + w, y[v]) + l | 0;
        r = l, l = h, h = Qr(a, 10) | 0, a = s, s = P;
      }
      for (let v = 0; v < 16; v++) {
        const P = Qr(o + _c(g, i, c, u) + to[H[v]] + E, _[v]) + b | 0;
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
const r2 = pn(() => new n2()), eo = BigInt(2 ** 32 - 1), Ws = BigInt(32);
function vh(t, e = !1) {
  return e ? { h: Number(t & eo), l: Number(t >> Ws & eo) } : { h: Number(t >> Ws & eo) | 0, l: Number(t & eo) | 0 };
}
function o2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let o = 0; o < t.length; o++) {
    const { h: s, l: i } = vh(t[o], e);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const s2 = (t, e) => BigInt(t >>> 0) << Ws | BigInt(e >>> 0), i2 = (t, e, n) => t >>> n, a2 = (t, e, n) => t << 32 - n | e >>> n, c2 = (t, e, n) => t >>> n | e << 32 - n, l2 = (t, e, n) => t << 32 - n | e >>> n, f2 = (t, e, n) => t << 64 - n | e >>> n - 32, h2 = (t, e, n) => t >>> n - 32 | e << 64 - n, u2 = (t, e) => e, d2 = (t, e) => t, p2 = (t, e, n) => t << n | e >>> 32 - n, b2 = (t, e, n) => e << n | t >>> 32 - n, g2 = (t, e, n) => e << n - 32 | t >>> 64 - n, x2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function w2(t, e, n, r) {
  const o = (e >>> 0) + (r >>> 0);
  return { h: t + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const y2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), m2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, S2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), E2 = (t, e, n, r, o) => e + n + r + o + (t / 2 ** 32 | 0) | 0, A2 = (t, e, n, r, o) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), v2 = (t, e, n, r, o, s) => e + n + r + o + s + (t / 2 ** 32 | 0) | 0, j = {
  fromBig: vh,
  split: o2,
  toBig: s2,
  shrSH: i2,
  shrSL: a2,
  rotrSH: c2,
  rotrSL: l2,
  rotrBH: f2,
  rotrBL: h2,
  rotr32H: u2,
  rotr32L: d2,
  rotlSH: p2,
  rotlSL: b2,
  rotlBH: g2,
  rotlBL: x2,
  add: w2,
  add3L: y2,
  add3H: m2,
  add4L: S2,
  add4H: E2,
  add5H: v2,
  add5L: A2
}, [B2, $2] = j.split([
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
].map((t) => BigInt(t))), $e = new Uint32Array(80), _e = new Uint32Array(80);
let Vo = class extends Mi {
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
      $e[y] = e.getUint32(n), _e[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const _ = $e[y - 15] | 0, v = _e[y - 15] | 0, P = j.rotrSH(_, v, 1) ^ j.rotrSH(_, v, 8) ^ j.shrSH(_, v, 7), M = j.rotrSL(_, v, 1) ^ j.rotrSL(_, v, 8) ^ j.shrSL(_, v, 7), O = $e[y - 2] | 0, N = _e[y - 2] | 0, x = j.rotrSH(O, N, 19) ^ j.rotrBH(O, N, 61) ^ j.shrSH(O, N, 6), A = j.rotrSL(O, N, 19) ^ j.rotrBL(O, N, 61) ^ j.shrSL(O, N, 6), k = j.add4L(M, A, _e[y - 7], _e[y - 16]), C = j.add4H(k, P, x, $e[y - 7], $e[y - 16]);
      $e[y] = C | 0, _e[y] = k | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: a, Cl: c, Dh: h, Dl: u, Eh: l, El: b, Fh: p, Fl: g, Gh: w, Gl: E, Hh: $, Hl: H } = this;
    for (let y = 0; y < 80; y++) {
      const _ = j.rotrSH(l, b, 14) ^ j.rotrSH(l, b, 18) ^ j.rotrBH(l, b, 41), v = j.rotrSL(l, b, 14) ^ j.rotrSL(l, b, 18) ^ j.rotrBL(l, b, 41), P = l & p ^ ~l & w, M = b & g ^ ~b & E, O = j.add5L(H, v, M, $2[y], _e[y]), N = j.add5H(O, $, _, P, B2[y], $e[y]), x = O | 0, A = j.rotrSH(r, o, 28) ^ j.rotrBH(r, o, 34) ^ j.rotrBH(r, o, 39), k = j.rotrSL(r, o, 28) ^ j.rotrBL(r, o, 34) ^ j.rotrBL(r, o, 39), C = r & s ^ r & a ^ s & a, R = o & i ^ o & c ^ i & c;
      $ = w | 0, H = E | 0, w = p | 0, E = g | 0, p = l | 0, g = b | 0, { h: l, l: b } = j.add(h | 0, u | 0, N | 0, x | 0), h = a | 0, u = c | 0, a = s | 0, c = i | 0, s = r | 0, i = o | 0;
      const D = j.add3L(x, k, R);
      r = j.add3H(D, N, A, C), o = D | 0;
    }
    ({ h: r, l: o } = j.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = j.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: a, l: c } = j.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h, l: u } = j.add(this.Dh | 0, this.Dl | 0, h | 0, u | 0), { h: l, l: b } = j.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h: p, l: g } = j.add(this.Fh | 0, this.Fl | 0, p | 0, g | 0), { h: w, l: E } = j.add(this.Gh | 0, this.Gl | 0, w | 0, E | 0), { h: $, l: H } = j.add(this.Hh | 0, this.Hl | 0, $ | 0, H | 0), this.set(r, o, s, i, a, c, h, u, l, b, p, g, w, E, $, H);
  }
  roundClean() {
    $e.fill(0), _e.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, _2 = class extends Vo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, L2 = class extends Vo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, H2 = class extends Vo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
pn(() => new Vo());
pn(() => new _2());
pn(() => new L2());
pn(() => new H2());
var Js;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Js || (Js = {}));
function k2(t, e) {
  return { type: Js.Address, version: t, hash160: e };
}
function I2(t) {
  return Kn.c32address(t.version, t.hash160);
}
const U2 = (t) => r2(Sh(t)), O2 = (t) => It(U2(t));
ct.hmacSha256Sync = (t, ...e) => {
  const n = yh.create(Sh, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function C2(t, e = "mainnet") {
  e = bh(e), t = typeof t == "string" ? $t(t) : t;
  const n = Jg(ie.P2PKH, e), r = k2(n, O2(t));
  return I2(r);
}
function N2(t, e) {
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
  const o = r.issuer.publicKey, s = C2(o);
  if (e !== o) {
    if (e !== s) throw new Error("Token issuer public key does not match the verifying value");
  }
  const i = new xt.TokenVerifier(n.header.alg, o);
  if (!i)
    throw new Error("Invalid token verifier");
  if (!i.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function P2(t, e = null) {
  let n;
  e ? n = N2(t, e) : n = xt.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const o = n.payload;
    if (typeof o == "string")
      throw new Error("Unexpected token payload type of string");
    o.hasOwnProperty("claim") && (r = o.claim);
  }
  return r;
}
const Lc = "_blockstackDidCheckEchoReply", D2 = "echoReply", T2 = "authContinuation";
function F2(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [o, s] = r.split("=");
    return n[o] = s ? decodeURIComponent(s.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function M2() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[Lc];
  if (typeof e == "boolean")
    return e;
  const n = F2(t.location.search), r = n[D2];
  if (r) {
    t[Lc] = !0;
    const o = `echo-reply-${r}`;
    return t.localStorage.setItem(o, "success"), t.setTimeout(() => {
      const s = n[T2];
      t.location.href = s;
    }, 10), !0;
  }
  return !1;
}
class Xs {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new Tf();
    else
      throw new sb("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new uc(e.sessionOptions) : this.store = new uc() : e ? this.store = new hc(e.sessionOptions) : this.store = new hc();
  }
  makeAuthRequestToken(e, n, r, o, s, i = ab().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new Ms("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), o = o || c.scopes, s = s || c.appDomain, kg(e, n, r, o, s, i, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = Hg();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = Ii("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (M2())
        return Hn.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Hn.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = $b()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new qr("Existing user session found.");
    const o = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const s = xt.decodeToken(e).payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await Ng(e))
      throw new qr("Invalid authentication response.");
    let a = s.private_key, c = s.core_token;
    if (bs(s.version, "1.1.0"))
      if (o !== void 0 && o != null) {
        if (s.private_key !== void 0 && s.private_key !== null)
          try {
            a = await lc(o, s.private_key);
          } catch {
            if (Hn.warn("Failed decryption of appPrivateKey, will try to use as given"), !ct.isValidPrivateKey(s.private_key))
              throw new qr("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await lc(o, c);
          } catch {
            Hn.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new qr("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let h = Sb, u;
    bs(s.version, "1.2.0") && s.hubUrl !== null && s.hubUrl !== void 0 && (h = s.hubUrl), bs(s.version, "1.3.0") && s.associationToken !== null && s.associationToken !== void 0 && (u = s.associationToken);
    const l = {
      profile: s.profile,
      email: s.email,
      decentralizedID: s.iss,
      identityAddress: uh(s.iss),
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
        l.profile = Object.assign({}, nb);
      else {
        const g = await p.text(), w = JSON.parse(g);
        l.profile = P2(w[0].token);
      }
    } else
      l.profile = s.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new Ms("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Y1(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Z1(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
Xs.prototype.makeAuthRequest = Xs.prototype.makeAuthRequestToken;
const R2 = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), Bh = "STX_PROVIDER", $h = () => typeof window > "u" ? null : window.localStorage.getItem(Bh), G2 = (t) => {
  typeof window < "u" && window.localStorage.setItem(Bh, t);
}, z2 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function V2(t, e) {
  const n = {};
  return Object.assign(n, z2, e), await fetch(t, n);
}
function K2(t) {
  let e = V2, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function j2(...t) {
  const { fetchLib: e, middlewares: n } = K2(t);
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
var Hc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Hc || (Hc = {}));
const q2 = "https://api.mainnet.hiro.so", W2 = "https://api.testnet.hiro.so", J2 = "http://localhost:3999", X2 = ["mainnet", "testnet", "devnet", "mocknet"];
class fn {
  constructor(e) {
    this.version = ln.Mainnet, this.chainId = Mn.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === ln.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, o) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(o)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let o = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (o = `${o}?limit=${r.limit}&offset=${r.offset}`), o;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let o = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (o = `${o}?limit=${r.limit}&offset=${r.offset}`), o;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, o) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${o}?proof=0`, this.getMapEntryUrl = (n, r, o) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${o}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? j2();
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
      return new Ys();
    case "testnet":
      return new Zs();
    case "devnet":
      return new Y2();
    case "mocknet":
      return new _h();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${X2.join(", ")}`);
  }
};
fn.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : fn.fromName(t);
class Ys extends fn {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? q2,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ln.Mainnet, this.chainId = Mn.Mainnet;
  }
}
class Zs extends fn {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? W2,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ln.Testnet, this.chainId = Mn.Testnet;
  }
}
class _h extends fn {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? J2,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ln.Testnet, this.chainId = Mn.Testnet;
  }
}
const Y2 = _h;
var Qs;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Qs || (Qs = {}));
var kc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(kc || (kc = {}));
Qs.Mainnet;
var _o;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(_o || (_o = {}));
var Ic;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ic || (Ic = {}));
_o.Mainnet;
const Z2 = 128, Q2 = 128, Lh = 16;
var Uc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Uc || (Uc = {}));
var Oc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Oc || (Oc = {}));
var Tt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Tt || (Tt = {}));
const Ss = ["onChainOnly", "offChainOnly", "any"];
Ss[0] + "", Tt.OnChainOnly, Ss[1] + "", Tt.OffChainOnly, Ss[2] + "", Tt.Any, Tt.OnChainOnly + "", Tt.OnChainOnly, Tt.OffChainOnly + "", Tt.OffChainOnly, Tt.Any + "", Tt.Any;
var Cc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Cc || (Cc = {}));
var Nc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Nc || (Nc = {}));
var Pc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Pc || (Pc = {}));
var Dc;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Dc || (Dc = {}));
var Tc;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Tc || (Tc = {}));
var Fc;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Fc || (Fc = {}));
var Mc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Mc || (Mc = {}));
var Rc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Rc || (Rc = {}));
var Gc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Gc || (Gc = {}));
var zc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(zc || (zc = {}));
var Vc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Vc || (Vc = {}));
var Kc;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Kc || (Kc = {}));
var jc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(jc || (jc = {}));
let tx = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, ex = class extends tx {
  constructor(e) {
    super(e);
  }
};
function ti(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function nx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Hh(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function rx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ti(t.outputLen), ti(t.blockLen);
}
function ox(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function sx(t, e) {
  Hh(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Es = {
  number: ti,
  bool: nx,
  bytes: Hh,
  hash: rx,
  exists: ox,
  output: sx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const As = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Kt = (t, e) => t << 32 - e | t >>> e, ix = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!ix)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ax(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function kh(t) {
  if (typeof t == "string" && (t = ax(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let cx = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function bn(t) {
  const e = (r) => t().update(kh(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function lx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, h = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + h, a, r);
}
let zi = class extends cx {
  constructor(e, n, r, o) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = As(this.buffer);
  }
  update(e) {
    Es.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    e = kh(e);
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
    lx(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
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
const fx = (t, e, n) => t & e ^ ~t & n, hx = (t, e, n) => t & e ^ t & n ^ e & n, ux = new Uint32Array([
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
]), He = new Uint32Array(64);
let Ih = class extends zi {
  constructor() {
    super(64, 32, 8, !1), this.A = Le[0] | 0, this.B = Le[1] | 0, this.C = Le[2] | 0, this.D = Le[3] | 0, this.E = Le[4] | 0, this.F = Le[5] | 0, this.G = Le[6] | 0, this.H = Le[7] | 0;
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
      He[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = He[l - 15], p = He[l - 2], g = Kt(b, 7) ^ Kt(b, 18) ^ b >>> 3, w = Kt(p, 17) ^ Kt(p, 19) ^ p >>> 10;
      He[l] = w + He[l - 7] + g + He[l - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: h, H: u } = this;
    for (let l = 0; l < 64; l++) {
      const b = Kt(a, 6) ^ Kt(a, 11) ^ Kt(a, 25), p = u + b + fx(a, c, h) + ux[l] + He[l] | 0, w = (Kt(r, 2) ^ Kt(r, 13) ^ Kt(r, 22)) + hx(r, o, s) | 0;
      u = h, h = c, c = a, a = i + p | 0, i = s, s = o, o = r, r = p + w | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, h = h + this.G | 0, u = u + this.H | 0, this.set(r, o, s, i, a, c, h, u);
  }
  roundClean() {
    He.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, dx = class extends Ih {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
bn(() => new Ih());
bn(() => new dx());
const px = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Uh = Uint8Array.from({ length: 16 }, (t, e) => e), bx = Uh.map((t) => (9 * t + 5) % 16);
let Vi = [Uh], Ki = [bx];
for (let t = 0; t < 4; t++)
  for (let e of [Vi, Ki])
    e.push(e[t].map((n) => px[n]));
const Oh = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), gx = Vi.map((t, e) => t.map((n) => Oh[e][n])), xx = Ki.map((t, e) => t.map((n) => Oh[e][n])), wx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), yx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), no = (t, e) => t << e | t >>> 32 - e;
function qc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ro = new Uint32Array(16);
let mx = class extends zi {
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
      const g = 4 - p, w = wx[p], E = yx[p], $ = Vi[p], H = Ki[p], y = gx[p], _ = xx[p];
      for (let v = 0; v < 16; v++) {
        const P = no(r + qc(p, s, a, h) + ro[$[v]] + w, y[v]) + l | 0;
        r = l, l = h, h = no(a, 10) | 0, a = s, s = P;
      }
      for (let v = 0; v < 16; v++) {
        const P = no(o + qc(g, i, c, u) + ro[H[v]] + E, _[v]) + b | 0;
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
bn(() => new mx());
const oo = BigInt(2 ** 32 - 1), ei = BigInt(32);
function Ch(t, e = !1) {
  return e ? { h: Number(t & oo), l: Number(t >> ei & oo) } : { h: Number(t >> ei & oo) | 0, l: Number(t & oo) | 0 };
}
function Sx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let o = 0; o < t.length; o++) {
    const { h: s, l: i } = Ch(t[o], e);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const Ex = (t, e) => BigInt(t >>> 0) << ei | BigInt(e >>> 0), Ax = (t, e, n) => t >>> n, vx = (t, e, n) => t << 32 - n | e >>> n, Bx = (t, e, n) => t >>> n | e << 32 - n, $x = (t, e, n) => t << 32 - n | e >>> n, _x = (t, e, n) => t << 64 - n | e >>> n - 32, Lx = (t, e, n) => t >>> n - 32 | e << 64 - n, Hx = (t, e) => e, kx = (t, e) => t, Ix = (t, e, n) => t << n | e >>> 32 - n, Ux = (t, e, n) => e << n | t >>> 32 - n, Ox = (t, e, n) => e << n - 32 | t >>> 64 - n, Cx = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Nx(t, e, n, r) {
  const o = (e >>> 0) + (r >>> 0);
  return { h: t + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const Px = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Dx = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Tx = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Fx = (t, e, n, r, o) => e + n + r + o + (t / 2 ** 32 | 0) | 0, Mx = (t, e, n, r, o) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), Rx = (t, e, n, r, o, s) => e + n + r + o + s + (t / 2 ** 32 | 0) | 0, q = {
  fromBig: Ch,
  split: Sx,
  toBig: Ex,
  shrSH: Ax,
  shrSL: vx,
  rotrSH: Bx,
  rotrSL: $x,
  rotrBH: _x,
  rotrBL: Lx,
  rotr32H: Hx,
  rotr32L: kx,
  rotlSH: Ix,
  rotlSL: Ux,
  rotlBH: Ox,
  rotlBL: Cx,
  add: Nx,
  add3L: Px,
  add3H: Dx,
  add4L: Tx,
  add4H: Fx,
  add5H: Rx,
  add5L: Mx
}, [Gx, zx] = q.split([
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
].map((t) => BigInt(t))), ke = new Uint32Array(80), Ie = new Uint32Array(80);
let Ko = class extends zi {
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
      ke[y] = e.getUint32(n), Ie[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const _ = ke[y - 15] | 0, v = Ie[y - 15] | 0, P = q.rotrSH(_, v, 1) ^ q.rotrSH(_, v, 8) ^ q.shrSH(_, v, 7), M = q.rotrSL(_, v, 1) ^ q.rotrSL(_, v, 8) ^ q.shrSL(_, v, 7), O = ke[y - 2] | 0, N = Ie[y - 2] | 0, x = q.rotrSH(O, N, 19) ^ q.rotrBH(O, N, 61) ^ q.shrSH(O, N, 6), A = q.rotrSL(O, N, 19) ^ q.rotrBL(O, N, 61) ^ q.shrSL(O, N, 6), k = q.add4L(M, A, Ie[y - 7], Ie[y - 16]), C = q.add4H(k, P, x, ke[y - 7], ke[y - 16]);
      ke[y] = C | 0, Ie[y] = k | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: a, Cl: c, Dh: h, Dl: u, Eh: l, El: b, Fh: p, Fl: g, Gh: w, Gl: E, Hh: $, Hl: H } = this;
    for (let y = 0; y < 80; y++) {
      const _ = q.rotrSH(l, b, 14) ^ q.rotrSH(l, b, 18) ^ q.rotrBH(l, b, 41), v = q.rotrSL(l, b, 14) ^ q.rotrSL(l, b, 18) ^ q.rotrBL(l, b, 41), P = l & p ^ ~l & w, M = b & g ^ ~b & E, O = q.add5L(H, v, M, zx[y], Ie[y]), N = q.add5H(O, $, _, P, Gx[y], ke[y]), x = O | 0, A = q.rotrSH(r, o, 28) ^ q.rotrBH(r, o, 34) ^ q.rotrBH(r, o, 39), k = q.rotrSL(r, o, 28) ^ q.rotrBL(r, o, 34) ^ q.rotrBL(r, o, 39), C = r & s ^ r & a ^ s & a, R = o & i ^ o & c ^ i & c;
      $ = w | 0, H = E | 0, w = p | 0, E = g | 0, p = l | 0, g = b | 0, { h: l, l: b } = q.add(h | 0, u | 0, N | 0, x | 0), h = a | 0, u = c | 0, a = s | 0, c = i | 0, s = r | 0, i = o | 0;
      const D = q.add3L(x, k, R);
      r = q.add3H(D, N, A, C), o = D | 0;
    }
    ({ h: r, l: o } = q.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = q.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: a, l: c } = q.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h, l: u } = q.add(this.Dh | 0, this.Dl | 0, h | 0, u | 0), { h: l, l: b } = q.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h: p, l: g } = q.add(this.Fh | 0, this.Fl | 0, p | 0, g | 0), { h: w, l: E } = q.add(this.Gh | 0, this.Gl | 0, w | 0, E | 0), { h: $, l: H } = q.add(this.Hh | 0, this.Hl | 0, $ | 0, H | 0), this.set(r, o, s, i, a, c, h, u, l, b, p, g, w, E, $, H);
  }
  roundClean() {
    ke.fill(0), Ie.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Vx = class extends Ko {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Kx = class extends Ko {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, jx = class extends Ko {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
bn(() => new Ko());
bn(() => new Vx());
bn(() => new Kx());
bn(() => new jx());
var lt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(lt || (lt = {}));
var ni;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(ni || (ni = {}));
function ji(t) {
  return ni[t];
}
var Lo;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Lo || (Lo = {}));
function Nh(t, e, n) {
  const o = Z2;
  if (sw(t, o))
    throw new Error(`String length exceeds maximum bytes ${o}`);
  return {
    type: Lo.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: o
  };
}
function Ph(t) {
  const e = Kn.c32addressDecode(t);
  return {
    type: Lo.Address,
    version: e[0],
    hash160: e[1]
  };
}
function Dh(t) {
  const e = [];
  return e.push($t(Ui(t.version, 1))), e.push($t(t.hash160)), Wn(e);
}
function Th(t) {
  const e = [], n = vr(t.content), r = n.byteLength;
  return e.push($t(Ui(r, t.lengthPrefixBytes))), e.push(n), Wn(e);
}
function te(t, e) {
  return Wn([ji(t), e]);
}
function qx(t) {
  return new Uint8Array([ji(t.type)]);
}
function Wx(t) {
  return t.type === lt.OptionalNone ? new Uint8Array([ji(t.type)]) : te(t.type, $r(t.value));
}
function Jx(t) {
  const e = new Uint8Array(4);
  return Do(e, Math.ceil(t.value.length / 2), 0), te(t.type, fe(e, $t(t.value)));
}
function Xx(t) {
  const e = Pf(db(BigInt(t.value), BigInt(Q2)), Lh);
  return te(t.type, e);
}
function Yx(t) {
  const e = Pf(BigInt(t.value), Lh);
  return te(t.type, e);
}
function Zx(t) {
  return te(t.type, Dh(Ph(t.value)));
}
function Qx(t) {
  const [e, n] = iw(t.value);
  return te(t.type, fe(Dh(Ph(e)), Th(Nh(n))));
}
function tw(t) {
  return te(t.type, $r(t.value));
}
function ew(t) {
  const e = [], n = new Uint8Array(4);
  Do(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const o = $r(r);
    e.push(o);
  }
  return te(t.type, Wn(e));
}
function nw(t) {
  const e = [], n = new Uint8Array(4);
  Do(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((o, s) => o.localeCompare(s));
  for (const o of r) {
    const s = Nh(o);
    e.push(Th(s));
    const i = $r(t.value[o]);
    e.push(i);
  }
  return te(t.type, Wn(e));
}
function Fh(t, e) {
  const n = [], r = e == "ascii" ? bb(t.value) : vr(t.value), o = new Uint8Array(4);
  return Do(o, r.length, 0), n.push(o), n.push(r), te(t.type, Wn(n));
}
function rw(t) {
  return Fh(t, "ascii");
}
function ow(t) {
  return Fh(t, "utf8");
}
function Wc(t) {
  return It($r(t));
}
function $r(t) {
  switch (t.type) {
    case lt.BoolTrue:
    case lt.BoolFalse:
      return qx(t);
    case lt.OptionalNone:
    case lt.OptionalSome:
      return Wx(t);
    case lt.Buffer:
      return Jx(t);
    case lt.UInt:
      return Yx(t);
    case lt.Int:
      return Xx(t);
    case lt.PrincipalStandard:
      return Zx(t);
    case lt.PrincipalContract:
      return Qx(t);
    case lt.ResponseOk:
    case lt.ResponseErr:
      return tw(t);
    case lt.List:
      return ew(t);
    case lt.Tuple:
      return nw(t);
    case lt.StringASCII:
      return rw(t);
    case lt.StringUTF8:
      return ow(t);
    default:
      throw new ex("Unable to serialize. Invalid Clarity Value.");
  }
}
const sw = (t, e) => t ? vr(t).length > e : !1;
function iw(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
function aw(t, e) {
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
    return BigInt(`0x${fw(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function qi(t, e = 8) {
  return (typeof t == "bigint" ? t : aw(t)).toString(16).padStart(e * 2, "0");
}
function Mh(t, e = 16) {
  const n = qi(t, e);
  return gr(n);
}
function cw(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const lw = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function fw(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += lw[n];
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
function Wi(t) {
  return new TextEncoder().encode(t);
}
function hw(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function uw(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Jc(t) {
  if (t.some(uw))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Ji(...t) {
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
  return Ji(...t.map((e) => typeof e == "number" ? Jc([e]) : e instanceof Array ? Jc(e) : e));
}
function jo(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var ri;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ri || (ri = {}));
ri.Mainnet;
const dw = 128, pw = 128, Rh = 16;
var oi;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(oi || (oi = {}));
var Xc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Xc || (Xc = {}));
var Yc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Yc || (Yc = {}));
var Ft;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ft || (Ft = {}));
const vs = ["onChainOnly", "offChainOnly", "any"];
vs[0] + "", Ft.OnChainOnly, vs[1] + "", Ft.OffChainOnly, vs[2] + "", Ft.Any, Ft.OnChainOnly + "", Ft.OnChainOnly, Ft.OffChainOnly + "", Ft.OffChainOnly, Ft.Any + "", Ft.Any;
var si;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(si || (si = {}));
si.Mainnet;
var Zc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Zc || (Zc = {}));
var Qc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Qc || (Qc = {}));
var tl;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(tl || (tl = {}));
var el;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(el || (el = {}));
var nl;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(nl || (nl = {}));
var rl;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(rl || (rl = {}));
var ol;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(ol || (ol = {}));
var sl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(sl || (sl = {}));
var il;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(il || (il = {}));
var al;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(al || (al = {}));
var cl;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(cl || (cl = {}));
function ii(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function bw(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Gh(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function gw(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ii(t.outputLen), ii(t.blockLen);
}
function xw(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function ww(t, e) {
  Gh(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Bs = {
  number: ii,
  bool: bw,
  bytes: Gh,
  hash: gw,
  exists: xw,
  output: ww
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const $s = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), jt = (t, e) => t << 32 - e | t >>> e, yw = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!yw)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function mw(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function zh(t) {
  if (typeof t == "string" && (t = mw(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Sw {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function gn(t) {
  const e = (r) => t().update(zh(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Ew(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, h = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + h, a, r);
}
class Xi extends Sw {
  constructor(e, n, r, o) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = $s(this.buffer);
  }
  update(e) {
    Bs.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    e = zh(e);
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
    Ew(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
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
const Aw = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Vh = Uint8Array.from({ length: 16 }, (t, e) => e), vw = Vh.map((t) => (9 * t + 5) % 16);
let Yi = [Vh], Zi = [vw];
for (let t = 0; t < 4; t++)
  for (let e of [Yi, Zi])
    e.push(e[t].map((n) => Aw[n]));
const Kh = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Bw = Yi.map((t, e) => t.map((n) => Kh[e][n])), $w = Zi.map((t, e) => t.map((n) => Kh[e][n])), _w = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Lw = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), so = (t, e) => t << e | t >>> 32 - e;
function ll(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const io = new Uint32Array(16);
class Hw extends Xi {
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
      const g = 4 - p, w = _w[p], E = Lw[p], $ = Yi[p], H = Zi[p], y = Bw[p], _ = $w[p];
      for (let v = 0; v < 16; v++) {
        const P = so(r + ll(p, s, a, h) + io[$[v]] + w, y[v]) + l | 0;
        r = l, l = h, h = so(a, 10) | 0, a = s, s = P;
      }
      for (let v = 0; v < 16; v++) {
        const P = so(o + ll(g, i, c, u) + io[H[v]] + E, _[v]) + b | 0;
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
gn(() => new Hw());
const kw = (t, e, n) => t & e ^ ~t & n, Iw = (t, e, n) => t & e ^ t & n ^ e & n, Uw = new Uint32Array([
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
]), Ue = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Oe = new Uint32Array(64);
class jh extends Xi {
  constructor() {
    super(64, 32, 8, !1), this.A = Ue[0] | 0, this.B = Ue[1] | 0, this.C = Ue[2] | 0, this.D = Ue[3] | 0, this.E = Ue[4] | 0, this.F = Ue[5] | 0, this.G = Ue[6] | 0, this.H = Ue[7] | 0;
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
      Oe[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = Oe[l - 15], p = Oe[l - 2], g = jt(b, 7) ^ jt(b, 18) ^ b >>> 3, w = jt(p, 17) ^ jt(p, 19) ^ p >>> 10;
      Oe[l] = w + Oe[l - 7] + g + Oe[l - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: h, H: u } = this;
    for (let l = 0; l < 64; l++) {
      const b = jt(a, 6) ^ jt(a, 11) ^ jt(a, 25), p = u + b + kw(a, c, h) + Uw[l] + Oe[l] | 0, w = (jt(r, 2) ^ jt(r, 13) ^ jt(r, 22)) + Iw(r, o, s) | 0;
      u = h, h = c, c = a, a = i + p | 0, i = s, s = o, o = r, r = p + w | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, h = h + this.G | 0, u = u + this.H | 0, this.set(r, o, s, i, a, c, h, u);
  }
  roundClean() {
    Oe.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class Ow extends jh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
gn(() => new jh());
gn(() => new Ow());
const ao = BigInt(2 ** 32 - 1), ai = BigInt(32);
function qh(t, e = !1) {
  return e ? { h: Number(t & ao), l: Number(t >> ai & ao) } : { h: Number(t >> ai & ao) | 0, l: Number(t & ao) | 0 };
}
function Cw(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let o = 0; o < t.length; o++) {
    const { h: s, l: i } = qh(t[o], e);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const Nw = (t, e) => BigInt(t >>> 0) << ai | BigInt(e >>> 0), Pw = (t, e, n) => t >>> n, Dw = (t, e, n) => t << 32 - n | e >>> n, Tw = (t, e, n) => t >>> n | e << 32 - n, Fw = (t, e, n) => t << 32 - n | e >>> n, Mw = (t, e, n) => t << 64 - n | e >>> n - 32, Rw = (t, e, n) => t >>> n - 32 | e << 64 - n, Gw = (t, e) => e, zw = (t, e) => t, Vw = (t, e, n) => t << n | e >>> 32 - n, Kw = (t, e, n) => e << n | t >>> 32 - n, jw = (t, e, n) => e << n - 32 | t >>> 64 - n, qw = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Ww(t, e, n, r) {
  const o = (e >>> 0) + (r >>> 0);
  return { h: t + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const Jw = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Xw = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Yw = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Zw = (t, e, n, r, o) => e + n + r + o + (t / 2 ** 32 | 0) | 0, Qw = (t, e, n, r, o) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), ty = (t, e, n, r, o, s) => e + n + r + o + s + (t / 2 ** 32 | 0) | 0, W = {
  fromBig: qh,
  split: Cw,
  toBig: Nw,
  shrSH: Pw,
  shrSL: Dw,
  rotrSH: Tw,
  rotrSL: Fw,
  rotrBH: Mw,
  rotrBL: Rw,
  rotr32H: Gw,
  rotr32L: zw,
  rotlSH: Vw,
  rotlSL: Kw,
  rotlBH: jw,
  rotlBL: qw,
  add: Ww,
  add3L: Jw,
  add3H: Xw,
  add4L: Yw,
  add4H: Zw,
  add5H: ty,
  add5L: Qw
}, [ey, ny] = W.split([
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
].map((t) => BigInt(t))), Ce = new Uint32Array(80), Ne = new Uint32Array(80);
class qo extends Xi {
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
      Ce[y] = e.getUint32(n), Ne[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const _ = Ce[y - 15] | 0, v = Ne[y - 15] | 0, P = W.rotrSH(_, v, 1) ^ W.rotrSH(_, v, 8) ^ W.shrSH(_, v, 7), M = W.rotrSL(_, v, 1) ^ W.rotrSL(_, v, 8) ^ W.shrSL(_, v, 7), O = Ce[y - 2] | 0, N = Ne[y - 2] | 0, x = W.rotrSH(O, N, 19) ^ W.rotrBH(O, N, 61) ^ W.shrSH(O, N, 6), A = W.rotrSL(O, N, 19) ^ W.rotrBL(O, N, 61) ^ W.shrSL(O, N, 6), k = W.add4L(M, A, Ne[y - 7], Ne[y - 16]), C = W.add4H(k, P, x, Ce[y - 7], Ce[y - 16]);
      Ce[y] = C | 0, Ne[y] = k | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: a, Cl: c, Dh: h, Dl: u, Eh: l, El: b, Fh: p, Fl: g, Gh: w, Gl: E, Hh: $, Hl: H } = this;
    for (let y = 0; y < 80; y++) {
      const _ = W.rotrSH(l, b, 14) ^ W.rotrSH(l, b, 18) ^ W.rotrBH(l, b, 41), v = W.rotrSL(l, b, 14) ^ W.rotrSL(l, b, 18) ^ W.rotrBL(l, b, 41), P = l & p ^ ~l & w, M = b & g ^ ~b & E, O = W.add5L(H, v, M, ny[y], Ne[y]), N = W.add5H(O, $, _, P, ey[y], Ce[y]), x = O | 0, A = W.rotrSH(r, o, 28) ^ W.rotrBH(r, o, 34) ^ W.rotrBH(r, o, 39), k = W.rotrSL(r, o, 28) ^ W.rotrBL(r, o, 34) ^ W.rotrBL(r, o, 39), C = r & s ^ r & a ^ s & a, R = o & i ^ o & c ^ i & c;
      $ = w | 0, H = E | 0, w = p | 0, E = g | 0, p = l | 0, g = b | 0, { h: l, l: b } = W.add(h | 0, u | 0, N | 0, x | 0), h = a | 0, u = c | 0, a = s | 0, c = i | 0, s = r | 0, i = o | 0;
      const D = W.add3L(x, k, R);
      r = W.add3H(D, N, A, C), o = D | 0;
    }
    ({ h: r, l: o } = W.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = W.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: a, l: c } = W.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h, l: u } = W.add(this.Dh | 0, this.Dl | 0, h | 0, u | 0), { h: l, l: b } = W.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h: p, l: g } = W.add(this.Fh | 0, this.Fl | 0, p | 0, g | 0), { h: w, l: E } = W.add(this.Gh | 0, this.Gl | 0, w | 0, E | 0), { h: $, l: H } = W.add(this.Hh | 0, this.Hl | 0, $ | 0, H | 0), this.set(r, o, s, i, a, c, h, u, l, b, p, g, w, E, $, H);
  }
  roundClean() {
    Ce.fill(0), Ne.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class ry extends qo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class oy extends qo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class sy extends qo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
gn(() => new qo());
gn(() => new ry());
gn(() => new oy());
gn(() => new sy());
function iy(t, e, n) {
  const o = dw;
  if (Sy(t, o))
    throw new Error(`String length exceeds maximum bytes ${o}`);
  return {
    type: oi.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: o
  };
}
var ft;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(ft || (ft = {}));
class ay extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class cy extends ay {
  constructor(e) {
    super(e);
  }
}
function Wh(t) {
  const e = [];
  return e.push(gr(qi(t.version, 1))), e.push(gr(t.hash160)), Jn(e);
}
function Jh(t) {
  const e = [], n = Wi(t.content), r = n.byteLength;
  return e.push(gr(qi(r, t.lengthPrefixBytes))), e.push(n), Jn(e);
}
function ee(t, e) {
  return Jn([t, e]);
}
function ly(t) {
  return new Uint8Array([t.type]);
}
function fy(t) {
  return t.type === ft.OptionalNone ? new Uint8Array([t.type]) : ee(t.type, Rn(t.value));
}
function hy(t) {
  const e = new Uint8Array(4);
  return jo(e, t.buffer.length, 0), ee(t.type, Ji(e, t.buffer));
}
function uy(t) {
  const e = Mh(cw(t.value, BigInt(pw)), Rh);
  return ee(t.type, e);
}
function dy(t) {
  const e = Mh(t.value, Rh);
  return ee(t.type, e);
}
function py(t) {
  return ee(t.type, Wh(t.address));
}
function by(t) {
  return ee(t.type, Ji(Wh(t.address), Jh(t.contractName)));
}
function gy(t) {
  return ee(t.type, Rn(t.value));
}
function xy(t) {
  const e = [], n = new Uint8Array(4);
  jo(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const o = Rn(r);
    e.push(o);
  }
  return ee(t.type, Jn(e));
}
function wy(t) {
  const e = [], n = new Uint8Array(4);
  jo(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((o, s) => o.localeCompare(s));
  for (const o of r) {
    const s = iy(o);
    e.push(Jh(s));
    const i = Rn(t.data[o]);
    e.push(i);
  }
  return ee(t.type, Jn(e));
}
function Xh(t, e) {
  const n = [], r = e == "ascii" ? hw(t.data) : Wi(t.data), o = new Uint8Array(4);
  return jo(o, r.length, 0), n.push(o), n.push(r), ee(t.type, Jn(n));
}
function yy(t) {
  return Xh(t, "ascii");
}
function my(t) {
  return Xh(t, "utf8");
}
function Rn(t) {
  switch (t.type) {
    case ft.BoolTrue:
    case ft.BoolFalse:
      return ly(t);
    case ft.OptionalNone:
    case ft.OptionalSome:
      return fy(t);
    case ft.Buffer:
      return hy(t);
    case ft.UInt:
      return dy(t);
    case ft.Int:
      return uy(t);
    case ft.PrincipalStandard:
      return py(t);
    case ft.PrincipalContract:
      return by(t);
    case ft.ResponseOk:
    case ft.ResponseErr:
      return gy(t);
    case ft.List:
      return xy(t);
    case ft.Tuple:
      return wy(t);
    case ft.StringASCII:
      return yy(t);
    case ft.StringUTF8:
      return my(t);
    default:
      throw new cy("Unable to serialize. Invalid Clarity Value.");
  }
}
const Sy = (t, e) => t ? Wi(t).length > e : !1;
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var Ey = Object.defineProperty, Ay = Object.defineProperties, vy = Object.getOwnPropertyDescriptors, Ho = Object.getOwnPropertySymbols, Yh = Object.prototype.hasOwnProperty, Zh = Object.prototype.propertyIsEnumerable, fl = (t, e, n) => e in t ? Ey(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, ci = (t, e) => {
  for (var n in e || (e = {})) Yh.call(e, n) && fl(t, n, e[n]);
  if (Ho) for (var n of Ho(e)) Zh.call(e, n) && fl(t, n, e[n]);
  return t;
}, li = (t, e) => Ay(t, vy(e)), By = (t, e) => {
  var n = {};
  for (var r in t) Yh.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Ho) for (var r of Ho(t)) e.indexOf(r) < 0 && Zh.call(t, r) && (n[r] = t[r]);
  return n;
};
function $y(t) {
  return t ? typeof t == "string" ? fn.fromName(t) : "version" in t ? t : "url" in t ? new Ys({ url: t.url }) : t.transactionVersion === _o.Mainnet ? new Ys({ url: t.client.baseUrl }) : new Zs({ url: t.client.baseUrl }) : new Zs();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var _y = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(_y || {}), Ly = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(Ly || {}), Qh = (t) => {
  let e = t;
  if (!e) {
    let n = new Tf(["store_write"], document.location.href);
    e = new Xs({ appConfig: n });
  }
  return e;
};
function Hy(t) {
  try {
    return Qh(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var ky = (t) => {
  let e = Qh(t).loadUserData().appPrivateKey, n = xt.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function t0(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? li(ci({}, t), { message: Wc(e), domain: Wc(n) }) : li(ci({}, t), { message: It(Rn(e)), domain: It(Rn(n)) });
}
async function Iy(t, e) {
  return new xt.TokenSigner("ES256k", e).signAsync(t0(t));
}
async function Uy(t) {
  let e = t, { userSession: n } = e, r = By(e, ["userSession"]);
  if (Hy(n)) {
    let { privateKey: o, publicKey: s } = ky(n), i = li(ci({}, r), { publicKey: s });
    return Iy(i, o);
  }
  return xt.createUnsecuredToken(t0(t));
}
var Oy = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(Oy || {}), e0 = "asigna-stx", hl = (t, e) => new Promise((n) => {
  function r(o) {
    o.data.source === e0 && o.data[e] && (n(o.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(Ny(t, e), "*");
}), Cy = { authenticationRequest: async (t) => hl(t, "authenticationRequest"), transactionRequest: async (t) => hl(t, "transactionRequest") }, Ny = (t, e) => ({ source: e0, [e]: t }), Py = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = Cy);
};
Py();
const Dy = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], Qi = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Wo = () => {
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
}, Ty = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), n0 = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, o) => !!(r != null && r.id) && n.findIndex((s) => Ty(s, r)) === o
  );
}, Fy = (t) => t ? n0(Wo()).some(
  (e) => {
    var n;
    return e.id === t && (Qi(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, My = () => {
  if (typeof window > "u")
    return;
  const t = Wo(), e = n0(t).filter(
    (n) => {
      var r;
      return Qi(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = hr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of Dy) {
    const r = hr(t, n) ?? (t === window ? void 0 : hr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, Ry = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Wo(), n = hr(e, t) ?? (e === window ? void 0 : hr(window, t)) ?? R2(t);
  if (n)
    return n;
  if (Qi(t) || Fy(t))
    return My();
}, Gy = ["blockstack-session", "blockstack"], zy = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of Gy) {
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
zy();
const Vy = () => $h(), Ky = () => {
  var r, o;
  if (typeof window > "u")
    return;
  const t = $h(), e = t ? Ry(t) : void 0;
  if (e)
    return e;
  const n = Wo() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((o = n.xverseProviders) == null ? void 0 : o.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, jy = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), ul = (t) => Of(t).replace(/^0x/, ""), dl = "This wallet cannot sign messages. Try Xverse or Leather.", pl = (t) => typeof (t == null ? void 0 : t.request) == "function", bl = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", qy = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, Wy = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function Jy(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: ul(e.message),
    domain: ul(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Xy(t, e) {
  const n = await Uy({
    domain: e.domain,
    message: e.message,
    network: $y(e.network),
    stxAddress: e.stxAddress,
    appDetails: e.appDetails ?? jy()
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Yy(t) {
  var o, s;
  const e = Vy() || "", n = /xverse/i.test(e);
  let r = Ky();
  if (n && !bl(r)) {
    const i = window;
    r = ((o = i.XverseProviders) == null ? void 0 : o.StacksProvider) ?? ((s = i.xverseProviders) == null ? void 0 : s.StacksProvider);
  }
  if (bl(r))
    try {
      return await Xy(r, t);
    } catch (i) {
      if (n || !pl(r) || !Wy(i)) throw i;
    }
  if (!n && pl(r))
    try {
      return await Jy(r, t);
    } catch (i) {
      throw qy(i) ? new Error(dl) : i;
    }
  throw new Error(dl);
}
function Zy(t, e, n = {}) {
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
const Qy = {}, tm = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, em = (t) => {
  const e = Qy;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, nm = (t) => `/hiro/${t}`, rm = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, om = (t) => {
  const e = em(t);
  if (e)
    return [rm(e)];
  const n = tm[t];
  return typeof window < "u" ? [`${window.location.origin}${nm(t)}`, ...n.filter((o) => !o.includes("hiro.so"))] : n;
}, sm = {}, gl = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, im = "xtrata.log.enabled", am = "xtrata.log.level", cm = "xtrata.log.tags", lm = "xtrata.log.dedupe", co = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, fm = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, hm = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, um = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, dm = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, pm = () => {
  const t = sm ?? {}, e = co(im) ?? t.VITE_LOG_ENABLED, n = co(am) ?? t.VITE_LOG_LEVEL, r = co(cm) ?? t.VITE_LOG_TAGS, o = co(lm) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: fm(e),
    level: hm(n) ?? "warn",
    tags: dm(r),
    dedupe: um(o)
  };
}, bm = (t, e, n) => !t.enabled || gl[n] < gl[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), gm = (t, e, n, r) => {
  const o = pm();
  if (!bm(o, e, t) || wm(o.dedupe))
    return;
  const s = `[xtrata:${e}] ${n}`, i = console[t] ?? console.log;
  r !== void 0 ? i(s, r) : i(s);
}, xm = /* @__PURE__ */ new Set();
let xl = null;
const wm = (t, e, n, r, o) => (xl !== t && (xm.clear(), xl = t), !1), ym = (t, e, n) => gm("debug", t, e, n), mm = {}, Sm = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, Em = (t) => {
  const e = mm, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : Sm[t];
}, Am = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, vm = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return Am.test(n) ? n : null;
}, Bm = (t) => t.replace(/\/+$/, ""), $m = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), wl = (t) => {
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
}, $n = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, _m = (t) => {
  var c, h;
  let e;
  try {
    e = _n(Qp(t));
  } catch {
    return null;
  }
  const n = $n(e);
  if (!n || n.success === !1)
    return null;
  const r = $n(n.value), o = $n(r == null ? void 0 : r.value), s = $n(o == null ? void 0 : o.value);
  if (!s)
    return null;
  const i = wl((c = $n(s.name)) == null ? void 0 : c.value), a = wl((h = $n(s.namespace)) == null ? void 0 : h.value);
  return !i || !a ? null : vm(`${i}.${a}`);
}, Lm = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${Bm(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, o = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [Of(Ep(t.address))]
    }),
    signal: t.signal
  });
  if (!o.ok)
    throw new Error(`BNS primary lookup failed (${o.status})`);
  const s = await o.json();
  return !(s != null && s.okay) || typeof s.result != "string" ? null : _m(s.result);
}, Hm = async (t) => {
  const e = t.address.trim();
  if (!tb(e))
    return null;
  const n = Em(t.network);
  if (!n)
    return null;
  let r = null;
  for (const o of om(t.network))
    try {
      return await Lm({
        baseUrl: o,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (s) {
      r = s;
    }
  return ym("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: $m(r)
  }), null;
}, km = "ParallaX Casino", Im = "ParallaX Casino room sign-in. This is free: it sends no transaction, costs no fees and gives no permission to spend anything.";
new TextEncoder();
new TextDecoder();
const Um = (t) => t === "mainnet" ? 1 : 2147483648, Om = (t) => `${Im} Account ${t.address}. Valid until ${new Date(t.expires).toISOString().replace(".000Z", "Z")}. Request code ${t.nonce}.`, Cm = (t) => ({
  domain: _f({
    name: po(km),
    version: po("1"),
    "chain-id": $f(Um(t.network))
  }),
  message: po(Om(t))
}), lo = (t) => !!t && typeof t.request == "function", ta = () => {
  try {
    const t = window.top;
    if (t && t !== window.self && t.location.origin === window.location.origin) return t;
  } catch {
  }
  return window;
}, Nm = () => {
  const t = ta();
  return t === window ? [window] : [t, window];
}, yl = (t) => {
  for (const e of Nm()) {
    const n = t(e);
    if (n) return n;
  }
  return null;
}, Pm = (t) => {
  if (t === "leather") {
    const n = yl((r) => lo(r.LeatherProvider) ? r.LeatherProvider : null);
    return n ? { rpc: n } : null;
  }
  const e = yl((n) => {
    const r = n.XverseProviders || n.xverseProviders;
    return r && (lo(r.BitcoinProvider) || lo(r.StacksProvider)) ? r : null;
  });
  return e ? { rpc: lo(e.BitcoinProvider) ? e.BitcoinProvider : e.StacksProvider } : null;
}, Dm = (t, e) => new Promise((n) => {
  const r = Date.now();
  (function o() {
    const s = Pm(t);
    s || Date.now() - r >= e ? n(s) : window.setTimeout(o, 150);
  })();
}), ko = (t) => {
  var e;
  return (t == null ? void 0 : t.code) ?? ((e = t == null ? void 0 : t.error) == null ? void 0 : e.code);
}, rn = (t) => {
  var e;
  return String((t == null ? void 0 : t.message) ?? ((e = t == null ? void 0 : t.error) == null ? void 0 : e.message) ?? t ?? "unknown error");
}, Tm = (t) => [4001, -31001].includes(Number(ko(t))) || /cancel|denied|reject|declin|closed/i.test(rn(t)), ml = (t) => Number(ko(t)) === -32601 || /not supported|method not found|unsupported|not implemented|legacy method/i.test(rn(t)), _s = async (t, e, n) => {
  const r = n === void 0 ? await t.request(e) : await t.request(e, n);
  if (r && typeof r == "object") {
    if (r.error) throw Object.assign(new Error(rn(r.error)), { code: ko(r.error) });
    if (r.status === "error") throw Object.assign(new Error(rn(r.error || r)), { code: ko(r.error || r) });
    if ("result" in r) return r.result;
  }
  return r;
}, Fm = (t) => new Promise((e, n) => {
  const r = window.setTimeout(() => n(new Error("The wallet did not answer. Check its window.")), 9e4);
  t.then((o) => {
    window.clearTimeout(r), e(o);
  }, (o) => {
    window.clearTimeout(r), n(o);
  });
}), Mm = (t) => (JSON.stringify(t) || "").match(/S[PT][0-9A-HJKMNP-TV-Z]{38,39}/g) || [], Pe = [], Gn = () => {
  const t = ta().ParallaxCasinoWalletUI ?? window.ParallaxCasinoWalletUI;
  try {
    return t && t.available() ? t : null;
  } catch {
    return null;
  }
}, Rm = (t) => {
  const e = ta().ParallaxPasskeyWallet ?? window.ParallaxPasskeyWallet;
  return e != null && e.signRoomJoin ? e.signRoomJoin(t) : Promise.reject(new Error("The casino wallet is not loaded. Reload the page."));
};
async function Gm(t) {
  if (t === "casino") {
    const o = Gn();
    if (!o) throw new Error("The casino wallet is not available here yet. Reload the page.");
    const s = await o.open();
    if (!s) throw new Error("The casino wallet did not open.");
    return { kind: t, address: s, network: s.startsWith("SP") ? "mainnet" : "testnet", via: "casino-wallet" };
  }
  const e = await Dm(t, 1500);
  if (!e) throw new Error(`${t === "leather" ? "Leather" : "Xverse"} was not found in this browser.`);
  Pe.length = 0;
  let n;
  if (t === "xverse") {
    try {
      await _s(e.rpc, "wallet_disconnect"), Pe.push("wallet_disconnect: ok");
    } catch (o) {
      Pe.push("wallet_disconnect: " + rn(o).slice(0, 80));
    }
    n = ["wallet_connect", "wallet_getAccount"];
  } else
    n = ["getAddresses", "stx_getAccounts", "stx_getAddresses", "stx_requestAccounts"];
  let r = null;
  for (const o of n)
    try {
      const s = await (t === "xverse" ? Fm(_s(e.rpc, o)) : _s(e.rpc, o)), i = Mm(s);
      if (i.length) {
        const a = i[0];
        return Pe.push(`${o}: ok`), { kind: t, address: a, network: a.startsWith("SP") ? "mainnet" : "testnet", via: o };
      }
      Pe.push(`${o}: answered but no Stacks address in it`);
    } catch (s) {
      if (Tm(s))
        throw Pe.push(`${o}: cancelled`), new Error("Connection cancelled.");
      Pe.push(`${o}: ${ml(s) ? "not supported" : rn(s).slice(0, 80)}`), ml(s) || (r = s);
    }
  throw new Error(r ? rn(r) : "The wallet did not share a Stacks address.");
}
const r0 = (t) => {
  t !== "casino" && G2(t === "leather" ? "LeatherProvider" : "XverseProviders.BitcoinProvider");
}, Io = (t) => t instanceof Error ? t.message : String(t), Ls = 500, o0 = 40, zm = 2e3, xr = 280, Sl = "px_room_blocks_v1", El = "px_chat_ui_v1", Hs = "px_chat_session_v1:", Al = { hidden: !1, side: "left" }, Vm = [
  { code: "spam", label: "Spam" },
  { code: "abuse", label: "Abuse" },
  { code: "scam", label: "Scam" },
  { code: "other", label: "Something else" }
], Km = (t) => {
  if (!Array.isArray(t)) return [];
  const e = [];
  for (const n of t)
    if (!(typeof n != "string" || !/^S[A-Z0-9]{19,60}$/.test(n) || e.includes(n)) && (e.push(n), e.length >= o0))
      break;
  return e;
}, jm = (t) => {
  if (!t) return [];
  try {
    return Km(JSON.parse(t));
  } catch {
    return [];
  }
}, qm = (t) => {
  if (!t) return { ...Al };
  try {
    const e = JSON.parse(t);
    return { hidden: (e == null ? void 0 : e.hidden) === !0, side: (e == null ? void 0 : e.side) === "right" ? "right" : "left" };
  } catch {
    return { ...Al };
  }
}, s0 = {
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
}, Wm = (t) => typeof t == "string" && Object.prototype.hasOwnProperty.call(s0, t), or = (t) => s0[String(t)] ?? "The room could not take that. Try again in a moment.", Jm = (t) => t.replace(/\s+/g, " ").trim(), Xm = (t) => Array.from(t).length, Ym = (t, e) => {
  const n = Jm(t);
  return e.signed ? e.connected ? n ? Xm(n) > xr ? { ok: !1, code: "too-long" } : e.now - e.lastSentAt < zm ? { ok: !1, code: "slow-down" } : { ok: !0, text: n } : { ok: !1, code: "empty" } : { ok: !1, code: "offline" } : { ok: !1, code: "sign-in-first" };
};
class Zm {
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
class Qm {
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
const t3 = `
.pxaddr{display:flex;flex-direction:column;gap:6px;margin:4px 0 8px}
.pxaddr .r{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;padding:6px 8px;border-radius:8px;background:rgba(255,255,255,.04);border:1px solid rgba(227,184,74,.25)}
.pxaddr .k{flex:1 1 100%;font-size:11px;letter-spacing:.03em;color:var(--dim,#c9b894)}
.pxaddr code{flex:1 1 0;min-width:0;font:12px/1.35 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:var(--ink,#f6ead0);overflow-wrap:anywhere;word-break:break-all;user-select:all;-webkit-user-select:all}
:is(#pxroom-panel,#pxchat,body) .pxaddr button{flex:0 0 auto;margin:0;font:inherit;font-size:12px;cursor:pointer;padding:5px 10px;border-radius:7px;background:rgba(12,9,14,.82);color:var(--ink,#f6ead0);border:1px solid rgba(227,184,74,.55)}
:is(#pxroom-panel,#pxchat,body) .pxaddr button:hover{background:rgba(227,184,74,.22)}
:is(#pxroom-panel,#pxchat,body) .pxaddr button.ok{background:rgba(70,140,90,.35);border-color:#9fd7b0}
`;
let vl = !1;
function e3() {
  if (vl) return;
  vl = !0;
  const t = document.createElement("style");
  t.textContent = t3, document.head.append(t);
}
async function n3(t, e) {
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
const sr = (t, e, n) => {
  const r = document.createElement(t);
  return e !== void 0 && (r.textContent = e), n && (r.className = n), r;
};
function Bl(t, e) {
  const n = sr("div", void 0, "r"), r = sr("code", e), o = sr("button", "Copy");
  o.type = "button", o.setAttribute("aria-label", `Copy ${t.toLowerCase()}`);
  let s = 0;
  return o.onclick = async (i) => {
    i.stopPropagation();
    const a = await n3(e, r);
    o.textContent = a ? "Copied ✓" : "Select it and copy", o.classList.toggle("ok", a), window.clearTimeout(s), s = window.setTimeout(() => {
      o.textContent = "Copy", o.classList.remove("ok");
    }, 1800);
  }, n.append(sr("span", t, "k"), r, o), n;
}
function i0(t, e) {
  e3();
  const n = sr("div", void 0, "pxaddr"), r = /^S[TN]/.test(t);
  let o = null;
  if (r && e)
    try {
      o = e(t);
    } catch {
      o = null;
    }
  return n.append(Bl(r ? "Testnet address · what the casino plays with" : "Address", t)), o && o !== t && n.append(Bl("Mainnet address (same key) · send BNS names here", o)), n;
}
const $l = (t) => typeof t == "string" && /^S[PTMN][0-9A-Z]{37,41}$/.test(t), r3 = `
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
}, Ct = (t, e, n = "sm") => {
  const r = J("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function o3(t) {
  const e = new Zm(), n = new Qm();
  let r = { hidden: !1, side: "left" }, o = [];
  try {
    r = qm(window.localStorage.getItem(El)), o = jm(window.localStorage.getItem(Sl));
  } catch {
  }
  e.setBlocked(o);
  let s = !1, i = null, a = !1, c = null, h = !1, u = "", l = 0, b = 0, p = 0, g = null, w = 0, E = !0, $ = null;
  const H = () => {
    try {
      window.localStorage.setItem(El, JSON.stringify(r));
    } catch {
    }
  }, y = () => {
    try {
      window.localStorage.setItem(Sl, JSON.stringify(o));
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
      if (P($), e.clear(), Lt.forEach((F) => F.remove()), Lt.clear(), $ = m, m)
        try {
          e.load(window.sessionStorage.getItem(Hs + m));
        } catch {
        }
      E = !0;
    }
  }, O = (m) => o.includes(m), N = document.createElement("style");
  N.textContent = r3, document.head.append(N);
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
  const je = J("button", "Send", "sm");
  je.type = "submit", D.append(ht, rt, je);
  const st = J("div", void 0, "bar");
  st.hidden = !0;
  const z = Ct("Here now", () => nr("people")), Lr = Ct("Hide chat", () => ns()), Xn = Ct("", () => {
    r.side = r.side === "left" ? "right" : "left", H(), et();
  }), wt = Ct("Blocked", () => nr("blocked")), qe = Ct("Table", () => {
    a = !a, i = null, et(), s && rt.focus();
  });
  qe.id = "pxchat-table", z.id = "pxchat-people", Lr.id = "pxchat-hide", Xn.id = "pxchat-side", wt.id = "pxchat-blocked", st.append(qe, z, Lr, Xn, wt), x.append(A, k, C, R, D, st);
  const St = J("button");
  St.id = "pxchat-btn", St.type = "button", St.setAttribute("aria-controls", "pxchat");
  const Lt = /* @__PURE__ */ new Map(), Xo = () => s || !!c || !!u, Yo = () => {
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
    const X = new Set(F.map((Et) => Et.id));
    let it = !1;
    for (const [Et, At] of Lt) X.has(Et) || (At.remove(), Lt.delete(Et));
    let ut = null;
    for (const Et of F) {
      let At = Lt.get(Et.id);
      At || (At = Zo(Et), Lt.set(Et.id, At), it = !0);
      const ue = ut ? ut.nextElementSibling : A.firstElementChild;
      ue !== At && A.insertBefore(At, ue), ut = At;
    }
    if (!m) {
      k.hidden = !0, E = !0;
      return;
    }
    !Y || E ? kr() : it && (k.hidden = !1);
  }, Yn = () => {
    St.replaceChildren(J("span", "💬", "ic"), J("span", "Chat", "lbl")), r.hidden && l > 0 && St.append(J("span", l > 9 ? "9+" : String(l), b ? "dot dm" : "dot")), St.setAttribute("aria-expanded", String(s && !r.hidden)), St.setAttribute("aria-label", r.hidden && l ? `Chat: ${l} new${b ? `, ${b} sent to you` : ""}` : "Casino chat: type a message");
  }, wn = () => t.table ? t.table() : null, Zn = { blackjack: "blackjack", baccarat: "baccarat", sicbo: "Sic Bo", holdem: "Hold'em", roulette: "roulette", videopoker: "video poker", pvpholdem: "Salon Hold'em", liars: "Liar's Dice" }, Qn = () => {
    a && !wn() && (a = !1), D.hidden = !s || r.hidden, ht.hidden = !i && !a, ht.classList.toggle("tb", a && !i), i ? (ht.textContent = `To ${_(i.a)} ×`, ht.setAttribute("aria-label", `Writing to ${_(i.a)}. Press to write to the whole room instead.`)) : a && (ht.textContent = "To this table ×", ht.setAttribute("aria-label", "Writing to the people at your table. Press to write to the whole room instead.")), rt.classList.toggle("dm", !!i);
    const m = wn();
    qe.hidden = !m, qe.classList.toggle("on", a);
    const F = i ? `Message ${_(i.a)}` : a && m ? `Say something to the ${Zn[m] || m} table` : "Say something to the room";
    rt.placeholder = F, rt.setAttribute("aria-label", F);
  }, ts = () => {
    if (C.replaceChildren(), C.hidden = !c, !c) return;
    const m = c, F = O(m.a), Y = m.a === t.me();
    C.append(J("p", Y ? `${_(m.a)} (you)` : _(m.a), "who")), $l(m.a) && !h && C.append(i0(m.a, t.mainnetOf));
    const X = J("div", void 0, "row");
    if (!Y) if (h) {
      C.append(J("p", "Why? Your report goes to the casino team with the last few things they said to you or the room."));
      for (const it of Vm) X.append(Ct(it.label, () => {
        Cr(m, it.code), Xe();
      }));
    } else {
      const it = Ct("Message", () => {
        Xe(), rs(m);
      });
      it.disabled = F || !n.has(m.a), F ? C.append(J("p", "You have blocked this person. Unblock them to message them.")) : n.known && !n.has(m.a) && C.append(J("p", "They have left the room.")), X.append(
        it,
        Ct(F ? "Unblock" : "Block", () => {
          Or(m, !F), Xe();
        }),
        Ct("Report…", () => {
          h = !0, et();
        }, "sm danger")
      );
    }
    X.append(Ct("Cancel", Xe)), C.append(X);
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
        F.append(J("span", _(m)), Ct("Unblock", () => {
          Or({ a: m }, !1), et();
        })), R.append(F);
      }
    }
  }, et = () => {
    x.hidden = r.hidden && !c, x.classList.toggle("peek", r.hidden && !!c), x.classList.remove("left", "right"), x.classList.add(r.side), st.hidden = !s || r.hidden;
    const m = n.others(t.me()).length;
    z.textContent = n.known ? `Here now (${m})` : "Here now", z.classList.toggle("on", u === "people"), Xn.textContent = r.side === "left" ? "Move right ▸" : "◂ Move left", wt.textContent = o.length ? `Blocked (${o.length})` : "Blocked", wt.classList.toggle("on", u === "blocked"), Yn(), Qn(), ts(), es(), Qo(), We();
  }, We = () => {
    const m = window.innerWidth, F = window.innerHeight, Y = document.getElementById("tools"), X = Math.round(Math.max(70, (Y ? Y.getBoundingClientRect().bottom : 58) + 12));
    let it = r.side === "left" ? 14 : null, ut = Math.min(340, m - 28), Et = F - X - 12, At = !1;
    const ue = document.getElementById("intro"), Ot = ue && ue.getClientRects().length ? ue.getBoundingClientRect() : null;
    Ot && Ot.width > 0 && Ot.height > 0 && Ot.bottom > X && (r.side === "left" ? Ot.left < 14 + ut : Ot.right > m - 14 - ut) && (r.side === "left" && m - Ot.right - 30 >= 260 ? (it = Math.round(Ot.right + 16), ut = Math.min(340, m - it - 14)) : (At = !0, Et = Math.max(170, Math.round(Ot.top - X - 8)))), x.style.top = `${X}px`, x.style.left = it === null ? "auto" : `${it}px`, x.style.right = it === null ? "14px" : "", x.style.width = `${ut}px`, x.style.maxHeight = `${Et}px`, x.classList.toggle("over", At && !x.hidden && (s || Lt.size > 0));
  }, pt = (m) => {
    e.add(null, m, !1, Date.now());
  }, tr = () => {
    try {
      document.pointerLockElement && document.exitPointerLock();
    } catch {
    }
  }, Ut = () => {
    if (!t.me()) {
      r.hidden && (r.hidden = !1, H()), s = !1, pt("Join the room to chat. Anyone can watch; you need one free signature to speak."), et(), t.joinPrompt();
      return;
    }
    r.hidden && (r.hidden = !1, H()), l = 0, b = 0, s = !0, tr(), et(), rt.focus();
  }, Je = () => {
    s = !1, c = null, h = !1, u = "", rt.blur(), et();
  }, ns = () => {
    r.hidden = !0, H(), s = !1, c = null, h = !1, u = "", l = 0, b = 0, rt.blur(), et();
  }, Xe = () => {
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
    i = { a: m.a }, u = "", Ut();
  }
  const Ir = () => {
    i = null, a = !1, et(), rt.focus();
  }, Ur = () => {
    t.me() && t.send({ t: "blocks", list: o }) && (w = Date.now());
  };
  function Or(m, F) {
    const Y = _(m.a);
    if (F) {
      if (o.length >= o0) {
        pt(or("too-many-blocks"));
        return;
      }
      o.includes(m.a) || o.push(m.a), e.dropFrom(m.a), v(), (i == null ? void 0 : i.a) === m.a && (i = null), pt(`You blocked ${Y}. Neither of you will see the other's messages.`);
    } else
      o = o.filter((X) => X !== m.a), pt(`You unblocked ${Y}.`);
    e.setBlocked(o), Lt.forEach((X) => X.remove()), Lt.clear(), y(), Ur();
  }
  function Cr(m, F) {
    if (!t.me() || !t.connected()) {
      pt("Not connected to the room, so the report was not sent.");
      return;
    }
    t.send({ t: "report", who: m.a, why: F, lines: e.lastFrom(m.a) }) && (w = Date.now()), pt("Sending your report…");
  }
  St.onclick = () => {
    s && !r.hidden ? Je() : Ut();
  }, ht.onclick = Ir, k.onclick = () => kr(), A.addEventListener("scroll", () => {
    E = Hr(), E && (k.hidden = !0);
  }, { passive: !0 }), A.addEventListener("wheel", (m) => {
    A.classList.contains("scroll") && m.stopPropagation();
  }, { passive: !0 }), A.addEventListener("touchmove", (m) => {
    A.classList.contains("scroll") && m.stopPropagation();
  }, { passive: !0 }), D.onsubmit = (m) => {
    m.preventDefault();
    const F = Date.now(), Y = Ym(rt.value, { signed: !!t.me(), connected: t.connected(), now: F, lastSentAt: p }), X = "Not connected to the room yet. Your message is still in the box.";
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
    m.stopPropagation(), m.key === "Escape" && (m.preventDefault(), i && !rt.value ? Ir() : Je());
  }), rt.addEventListener("keypress", (m) => m.stopPropagation()), document.addEventListener("pointerdown", (m) => {
    if (!c && !u) return;
    const F = m.target;
    F && (x.contains(F) || St.contains(F)) || (c = null, h = !1, u = "", et());
  }), window.addEventListener("resize", We);
  const Nr = document.getElementById("intro");
  Nr && "MutationObserver" in window && new MutationObserver(() => We()).observe(Nr, { attributes: !0, attributeFilter: ["class", "style", "hidden"] });
  const os = {
    button: St,
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
      n.join(m), u === "people" || c ? et() : z.textContent = `Here now (${n.others(t.me()).length})`;
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
      return $l(m) ? (er({ a: m }), !0) : !1;
    },
    isTyping: () => s,
    debug: () => ({ typing: s, hidden: r.hidden, side: r.side, target: (i == null ? void 0 : i.a) ?? null, blocks: [...o], lines: e.size, shown: Lt.size, session: $, stick: E, people: n.others(t.me()).map((m) => m.a) })
  };
  return Yn(), os;
}
const a0 = (t) => {
  if (!/^[0-9a-f]{64}$/.test(t)) throw new Error("A round seed is 64 hex characters.");
  const e = new Uint8Array(new ArrayBuffer(32));
  for (let n = 0; n < 32; n++) e[n] = parseInt(t.slice(n * 2, n * 2 + 2), 16);
  return e;
}, ea = (t) => {
  const e = a0(t), n = (h) => (e[h] | e[h + 1] << 8 | e[h + 2] << 16 | e[h + 3] << 24) >>> 0;
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
}, s3 = (t) => ea(t).below(37), i3 = ["S", "H", "D", "C"], a3 = (t, e = 6) => {
  const n = ea(t), r = Array.from({ length: 416 }, (s, i) => i), o = [];
  for (let s = 0; s < e; s++) {
    const i = s + n.below(r.length - s), a = r[i];
    r[i] = r[s], r[s] = a;
    const c = a % 52;
    o.push({ r: 2 + c % 13, s: i3[Math.floor(c / 13)] });
  }
  return o;
}, c3 = (t) => {
  const e = ea(t);
  return [e.below(6) + 1, e.below(6) + 1, e.below(6) + 1];
}, l3 = () => {
  const t = globalThis.crypto;
  if (!(t != null && t.subtle)) throw new Error("WebCrypto is not available.");
  return t.subtle;
}, f3 = (t) => [...new Uint8Array(t)].map((e) => e.toString(16).padStart(2, "0")).join(""), h3 = async (t) => f3(await l3().digest("SHA-256", a0(t))), u3 = async (t, e) => {
  try {
    return await h3(t) === e;
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
}, ir = (() => {
  const t = { beat: 3e4, hide: 3e5, away: 12e5, leave: 18e5 };
  try {
    const e = /[?&]roomtimes=(\d+),(\d+),(\d+),(\d+)/.exec(location.search);
    e && (t.beat = +e[1], t.hide = +e[2], t.away = +e[3], t.leave = +e[4]);
  } catch {
  }
  return t;
})();
let G = null;
const d3 = (t) => t.length <= 12 ? t : `${t.slice(0, 5)}…${t.slice(-4)}`, na = (t) => {
  if (t.startsWith("SP")) return t;
  const e = ki(t);
  return Fs({ ...e, version: Cs.MainnetSingleSig });
}, p3 = Zy((t) => Hm({ address: na(t), network: "mainnet" }), () => {
  wr(), Uo(), G == null || G.refreshNames(), tt();
}), Yt = (t) => {
  let e = null;
  try {
    e = p3.get(t);
  } catch {
  }
  return e || d3(t);
}, c0 = (t, e) => ({ key: t, label: Yt(t), x: e.x, z: e.z, r: e.r, at: e.at }), Uo = () => {
  var n, r;
  if (!((n = f.host) != null && n.moves) || f.service !== "ok") return;
  const t = ((r = f.you) == null ? void 0 : r.a) ?? null, e = [...f.walk.entries()].filter(([o]) => o !== t).map(([o, s]) => c0(o, s));
  try {
    f.host.moves(e);
  } catch (o) {
    console.warn("[room] the page could not draw the walkers", o);
  }
}, fo = (t, e) => {
  var n, r;
  if (e ? f.walk.set(t, e) : f.walk.delete(t), !(!((n = f.host) != null && n.move) || t === (((r = f.you) == null ? void 0 : r.a) ?? null)))
    try {
      f.host.move(e ? c0(t, e) : { key: t, off: !0 });
    } catch (o) {
      console.warn("[room] the page could not move a walker", o);
    }
}, l0 = () => {
  var t;
  !f.features.includes("move") || f.service !== "ok" || !f.connected || !f.signed || !f.you || f.you.guest || ((t = f.ws) == null ? void 0 : t.readyState) === WebSocket.OPEN && (f.ownMove ? (f.ws.send(JSON.stringify({ t: "move", ...f.ownMove })), f.ownSent = !0) : f.ownSent && (f.ws.send(JSON.stringify({ t: "move", off: !0 })), f.ownSent = !1));
}, qt = (t) => {
  var e, n;
  try {
    (n = (e = f.host) == null ? void 0 : e.on) == null || n.call(e, t);
  } catch (r) {
    console.warn("[room] the page could not take a room message", r);
  }
}, b3 = /^(react|win|daily|round|gift|pvp|table|no-table|log|bal|board|friends|tourney|card|mission)/, wr = () => {
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
}, fi = (t) => {
  var e;
  return ((e = f.ws) == null ? void 0 : e.readyState) !== WebSocket.OPEN ? !1 : (f.ws.send(JSON.stringify(t)), f.lastSent = Date.now(), !0);
}, f0 = () => {
  var e;
  if (f.service !== "ok" || !f.connected || !f.you || f.you.guest || !f.signed || f.away) return;
  const t = ((e = Object.entries(f.spots).find(([, n]) => n.a === f.you.a)) == null ? void 0 : e[0]) ?? null;
  f.want ? t !== f.want && f.want !== f.badSpot && f.want !== f.yielded && !f.spots[f.want] && Date.now() - f.lastSent > 1200 && fi({ t: "sit", spot: f.want }) : t && t !== f.standSent && Date.now() - f.lastSent > 600 && (f.standSent = t, fi({ t: "stand" }));
}, Jo = () => {
  if (f.service !== "ok" || f.ws) return;
  f.attempts += 1;
  let t;
  try {
    t = new WebSocket(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/casino/room/ws`);
  } catch {
    return Hl();
  }
  f.ws = t, t.onopen = () => {
    f.connected = !0, f.attempts = 0, tt();
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
        Uo(), f.ownSent = !1, l0(), f.standSent = null, f.signed && ((r = f.you) != null && r.guest) && (f.signed = null), G == null || G.room(n.players, !!(f.you && !f.you.guest)), f.players = /* @__PURE__ */ new Map();
        for (const c of Array.isArray(n.players) ? n.players : []) c && typeof c.a == "string" && f.players.set(c.a, { a: c.a, aw: c.aw === !0 });
        ar(), f.features.includes("here") && ((o = f.ws) == null ? void 0 : o.readyState) === WebSocket.OPEN && (f.ws.send(JSON.stringify({ t: "here" })), f.away && f.signed && f.you && !f.you.guest && f.ws.send(JSON.stringify({ t: "away", on: !0 }))), qt({
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
        G == null || G.heard(n), n.t === "say" && qt(n);
        return;
      case "join":
        n.who && typeof n.who.a == "string" && f.players.set(n.who.a, { a: n.who.a }), G == null || G.joined(n.who), qt(n), tt();
        return;
      case "leave":
        f.players.delete(n.a), ar(), G == null || G.left(n.a), f.walk.has(n.a) && fo(n.a, null), qt(n), tt();
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
        qt(n);
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
        qt(n);
        return;
      case "reported":
        G == null || G.reported();
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
        if (typeof n.code == "string" && (n.code.startsWith("play-") || n.code.startsWith("move-")) || typeof n.code == "string" && b3.test(n.code) && (qt({ t: "err", code: n.code }), n.code !== "no-table"))
          return;
        n.code === "no-such-spot" || typeof n.code == "string" && n.code.startsWith("salon-") ? f.badSpot = f.want : Wm(n.code) && (G != null && G.failed(n.code)) || n.code === "slow-down" && (f.lastSent = Date.now() + 3e3);
        return;
      default:
        return;
    }
    wr(), f0(), tt();
  }, t.onclose = (e) => {
    if (f.ws === t) {
      if (f.ws = null, f.connected = !1, f.spots = {}, wr(), f.walk = /* @__PURE__ */ new Map(), Uo(), f.ownSent = !1, f.players = /* @__PURE__ */ new Map(), ar(), G == null || G.disconnected(), e.code === 4001) {
        f.replaced = !0, tt();
        return;
      }
      tt(), Hl();
    }
  }, t.onerror = () => {
  };
};
let _l = "";
const ar = () => {
  var n, r;
  const t = [...f.players.values()].filter((o) => o.aw).map((o) => o.a).sort(), e = t.join();
  if (e !== _l) {
    _l = e;
    try {
      (r = (n = f.host) == null ? void 0 : n.awayOf) == null || r.call(n, t);
    } catch (o) {
      console.warn("[room] the page could not take who is away", o);
    }
  }
}, Ll = (t) => {
  if (f.parked || !f.ws) return;
  f.parked = t;
  const e = f.ws;
  f.ws = null, f.connected = !1, window.clearTimeout(f.retryTimer);
  try {
    e.close(1e3, t);
  } catch {
  }
  f.spots = {}, wr(), f.walk = /* @__PURE__ */ new Map(), Uo(), f.ownSent = !1, f.players = /* @__PURE__ */ new Map(), ar(), G == null || G.disconnected(), tt();
}, ra = () => {
  f.parked && (f.parked = "", f.attempts = 0, f.lastActive = Date.now(), Jo(), tt());
}, h0 = (t) => {
  var e, n, r;
  if (f.away !== t) {
    if (f.away = t, ((e = f.ws) == null ? void 0 : e.readyState) === WebSocket.OPEN && f.features.includes("here") && f.signed && f.you && !f.you.guest && f.ws.send(JSON.stringify({ t: "away", on: t })), t)
      try {
        (r = (n = f.host) == null ? void 0 : n.standUp) == null || r.call(n);
      } catch (o) {
        console.warn("[room] the page could not stand the visitor up", o);
      }
    tt();
  }
}, nn = () => {
  f.lastActive = Date.now(), f.away && h0(!1), (f.parked === "idle" || f.parked === "hidden" && !document.hidden) && ra();
}, g3 = () => {
  var r;
  if (f.service !== "ok") return;
  const t = Date.now();
  if (((r = f.ws) == null ? void 0 : r.readyState) === WebSocket.OPEN && f.features.includes("here") && t - f.lastBeat >= ir.beat) {
    f.lastBeat = t;
    try {
      f.ws.send("ping");
    } catch {
    }
  }
  if (f.parked) return;
  if (document.hidden) {
    f.hiddenAt && t - f.hiddenAt > ir.hide && Ll("hidden");
    return;
  }
  const e = t - f.lastActive, n = !!(f.signed && f.you && !f.you.guest);
  e > ir.leave ? Ll("idle") : n && !f.away && e > ir.away && f.features.includes("here") && h0(!0);
}, Hl = () => {
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
let Rt = 0;
const hi = () => new Error("Sign-in cancelled.");
async function u0(t, e = Rt) {
  const { res: n, body: r } = await yr(`/casino/room/challenge?address=${encodeURIComponent(t.address)}`);
  if (!n.ok) throw new Error((r == null ? void 0 : r.error) || `The room answered ${n.status}.`);
  const o = r.challenge, { domain: s, message: i } = Cm(o);
  f.busy = "sign", tt();
  let a;
  try {
    a = t.kind === "casino" ? await Rm(o) : await Yy({
      domain: s,
      message: i,
      network: o.network,
      stxAddress: t.address,
      appDetails: { name: "ParallaX Casino", icon: `${location.origin}/favicons/xtrata-apple-touch-icon.png` }
    });
  } catch (u) {
    throw e !== Rt ? hi() : new Error("The wallet did not sign: " + Io(u));
  }
  if (e !== Rt) throw hi();
  const { res: c, body: h } = await yr("/casino/room/session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ challenge: o, signature: a })
  });
  if (!c.ok) throw new Error((h == null ? void 0 : h.error) || `The room answered ${c.status}.`);
  f.signed = { address: h.address, hash160: h.hash160, expiresAt: h.expiresAt }, f.resumed = !1, _r();
}
async function d0(t) {
  var r, o;
  if (f.busy) return;
  const e = ++Rt;
  f.error = "", f.busy = "connect", f.trying = t, tt();
  const n = t === "casino" && !((r = Gn()) != null && r.describe().has);
  try {
    const s = await Gm(t);
    if (e !== Rt) throw hi();
    f.wallet = s, r0(t), await u0(s, e), f.open = !1, n && ((o = Gn()) == null || o.fundNew().catch(() => {
    }));
  } catch (s) {
    e === Rt && (f.error = /cancel/i.test(Io(s)) ? "" : Io(s));
  } finally {
    e === Rt && (f.busy = "", f.trying = null), tt();
  }
}
const x3 = () => {
  Rt++, f.busy = "", f.trying = null, f.error = "", tt();
};
async function w3(t) {
  var o;
  const e = t.detail;
  if (!e || typeof e.address != "string" || f.service !== "ok" || f.busy || ((o = f.signed) == null ? void 0 : o.address) === e.address) return;
  const n = e.kind === "casino" || e.kind === "leather" || e.kind === "xverse" ? e.kind : null;
  if (!n) return;
  const r = ++Rt;
  f.error = "", f.busy = "sign", f.trying = n, tt();
  try {
    f.wallet = { kind: n, address: e.address, network: e.address.startsWith("SP") ? "mainnet" : "testnet", via: "page" }, r0(n), await u0(f.wallet, r), f.open = !1;
  } catch (s) {
    const i = Io(s);
    r === Rt && !/cancel/i.test(i) && (f.error = i, f.open = !m0());
  } finally {
    r === Rt && (f.busy = "", f.trying = null), tt();
  }
}
const y3 = 2e3, m3 = () => {
  var t;
  f.service === "ok" && m0() && (f.introSeen || (f.introSeen = !0, tt())), !f.introSeen && (f.prompted || f.service !== "ok" || !f.connected || f.signed || f.busy || f.open || !f.arrivedAt || Date.now() - f.arrivedAt < y3 || (t = f.host) != null && t.currentSpot() || (f.prompted = !0, f.open = !0, tt()));
}, p0 = () => {
  const t = Gn();
  let e = null;
  try {
    e = localStorage.getItem("STX_PROVIDER");
  } catch {
  }
  const n = /Xverse/.test(e || "") ? ["xverse", "leather"] : ["leather", "xverse"];
  return t ? t.describe().has || !e ? ["casino", ...n] : [n[0], "casino", n[1]] : n;
};
async function b0() {
  try {
    await yr("/casino/room/session", { method: "DELETE" });
  } catch {
  }
  f.signed = null, f.wallet = null, f.error = "", f.resumed = !1, f.later = !1, G == null || G.endSession(), G == null || G.disconnected(), _r(), tt();
}
const S3 = `
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
}, se = (t, e) => {
  const n = U("p", void 0, "fact");
  return n.append(U("b", t), document.createTextNode(` ${e}`)), n;
};
let De = null, Bt = null, Jt = null;
function E3() {
  var n, r;
  if (De || f.service !== "ok") return;
  const t = document.createElement("style");
  t.textContent = S3, document.head.append(t), De = U("span"), De.id = "pxroom", Bt = U("button"), Bt.id = "pxroom-btn", Bt.type = "button", Bt.setAttribute("aria-label", "Casino room: see who is here and join"), Bt.onclick = () => {
    f.open = !f.open, tt();
  }, Jt = U("div"), Jt.id = "pxroom-panel", Jt.hidden = !0, G = o3({
    send: fi,
    me: () => f.you && !f.you.guest ? f.you.a : null,
    connected: () => f.connected,
    labelFor: Yt,
    mainnetOf: na,
    joinPrompt: () => {
      f.open = !0, tt();
    },
    table: () => {
      var o, s;
      return f.features.includes("table") ? ((s = (o = f.host) == null ? void 0 : o.table) == null ? void 0 : s.call(o)) ?? null : null;
    }
  }), De.append(Bt, G.button);
  const e = ((r = (n = f.host) == null ? void 0 : n.mount) == null ? void 0 : r.call(n)) ?? document.querySelector("#tools .rt");
  e ? e.insertBefore(De, e.firstChild) : (De.style.cssText = "position:fixed;top:10px;right:10px;z-index:30", document.body.append(De)), document.body.append(Jt), G.mount(document.body), document.addEventListener("keydown", (o) => {
    o.key === "Escape" && f.open && (f.open = !1, tt());
  }), document.addEventListener("pointerdown", (o) => {
    if (!f.open) return;
    const s = o.target;
    s && (Jt.contains(s) || Bt.contains(s)) || (f.open = !1, tt());
  }), window.addEventListener("resize", () => tt());
}
function A3() {
  if (!Bt || !Jt) return;
  const t = Bt.getBoundingClientRect(), e = t.height ? Math.round(t.bottom + 8) : 64;
  Jt.style.top = `${Math.min(e, Math.max(64, window.innerHeight - 220))}px`;
}
let kl;
const v3 = () => {
  var n, r;
  const t = !!(f.signed && f.you && !f.you.guest), e = t ? f.signed.address : null;
  if (e !== kl) {
    kl = e;
    try {
      (r = (n = f.host) == null ? void 0 : n.self) == null || r.call(n, { signed: t, address: e });
    } catch (o) {
      console.warn("[room] the page could not take the sign-in state", o);
    }
  }
}, g0 = () => {
  const t = f.you, e = t && !t.guest ? t.a : null;
  return f.service === "offline" ? { state: "offline", address: null, name: null } : !f.connected || !t ? { state: "connecting", address: null, name: null } : f.features.includes("salon-bns") ? t.guest || !f.signed ? { state: "guest", address: null, name: null } : t.bnsChecked !== !0 ? { state: "unchecked", address: e, name: null } : t.bns ? { state: "allowed", address: e, name: t.bns } : { state: "no-name", address: e, name: null } : { state: "unenforced", address: e, name: null };
};
let Il = "";
const x0 = () => {
  var n, r;
  const t = g0(), e = JSON.stringify(t);
  if (e !== Il) {
    Il = e;
    try {
      (r = (n = f.host) == null ? void 0 : n.salon) == null || r.call(n, t);
    } catch (o) {
      console.warn("[room] the page could not take the Salon state", o);
    }
  }
};
let ks = !1;
const B3 = async () => {
  if (!(ks || f.service !== "ok")) {
    ks = !0;
    try {
      const { res: t, body: e } = await yr("/casino/room/bns", { method: "POST" });
      qt({ t: "bns-check", ok: t.ok, bns: (e == null ? void 0 : e.bns) ?? null, bnsChecked: (e == null ? void 0 : e.bnsChecked) === !0, failed: !t.ok || (e == null ? void 0 : e.failed) === !0, error: t.ok ? null : (e == null ? void 0 : e.error) || `The room answered ${t.status}.` }), t.ok && _r();
    } catch {
      qt({ t: "bns-check", ok: !1, bns: null, bnsChecked: !1, failed: !0, error: "Could not reach the room." });
    } finally {
      ks = !1;
    }
  }
}, $3 = {
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
}, w0 = (t) => {
  var n;
  const e = (n = Object.entries(f.spots).find(([, r]) => r.a === t)) == null ? void 0 : n[0];
  if (e) {
    const r = e.split(".")[0];
    return $3[r] || r;
  }
  return f.walk.has(t) ? "walking" : "in the room";
}, Ul = (t) => {
  var o;
  const e = ((o = f.you) == null ? void 0 : o.a) ?? null, n = [...f.players.values()].sort((s, i) => s.a === e ? -1 : i.a === e ? 1 : Yt(s.a).localeCompare(Yt(i.a)));
  t.push(U("h3", `Here now · ${n.length}`));
  const r = U("div", void 0, "here");
  for (const s of n.slice(0, 50)) {
    const i = U("button", void 0, "person" + (s.aw ? " away" : ""));
    i.type = "button", i.append(U("span", Yt(s.a) + (s.a === e ? " (you)" : ""), "nm"), U("span", s.aw ? "away" : w0(s.a), "at")), i.onclick = () => {
      const a = { a: s.a };
      window.dispatchEvent(new CustomEvent("px-room-person", { detail: a })), a.handled && (f.open = !1, tt());
    }, r.append(i);
  }
  n.length > 50 && r.append(U("p", `and ${n.length - 50} more`, "fact")), n.length || r.append(U("p", "Nobody is signed in yet.", "fact")), t.push(r, U("p", `${f.guests} watching without signing in.`, "fact"));
}, y0 = () => document.getElementById("intro"), m0 = () => {
  const t = y0();
  if (!t || !t.classList.contains("on") || !document.getElementById("introJoin")) return !1;
  try {
    return getComputedStyle(t).display !== "none";
  } catch {
    return !0;
  }
}, Ol = { leather: "Leather", xverse: "Xverse", casino: "your casino wallet" };
let Is = "";
function _3() {
  const t = y0(), e = document.getElementById("introJoin");
  if (!t || !e) return;
  const n = (g) => {
    for (const [w, E] of Object.entries(g)) t.classList.toggle(w, E);
  };
  if (f.service !== "ok") {
    n({ "join-on": !1, "join-ask": !1, "join-steps": !1, "join-back": !1 }), e.hidden = !0, e.replaceChildren(), Is = "";
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
  }, h = Gn(), u = (g) => {
    const w = U("div", void 0, "wallets"), E = p0();
    return E.forEach(($, H) => {
      const y = U("button", void 0, (E.length === 3 && H === 0 ? "wide" : "") + (f.trying === $ ? " on" : ""));
      y.type = "button";
      const _ = $ === "casino" ? h ? h.describe().label : "Casino wallet" : $ === "leather" ? "Leather" : "Xverse", v = $ === "casino" ? h != null && h.describe().has ? "Face ID or fingerprint · your passkey" : "Face ID or fingerprint · free · 1,000,000 LAYR to start" : f.trying === $ ? "waiting…" : $ === "leather" ? "browser extension" : "extension or app";
      y.append(document.createTextNode(_), U("small", v)), y.disabled = !g || !f.connected, y.onclick = () => {
        d0($);
      }, w.append(y);
    }), w;
  }, l = (g, w) => {
    const E = U("div", void 0, "me" + (f.away ? " away" : "")), $ = U("div");
    return $.append(U("b", Yt(f.signed.address)), U("span", g)), E.append(U("span", void 0, "dot"), $, c(w, () => {
      b0();
    })), E;
  }, b = (g) => `${g} ${g === 1 ? "player is" : "players are"} in the room now.`;
  if (o === "join") {
    i.push(a("1", "Join the room"));
    const g = U("p");
    g.append(document.createTextNode("Sign in so other players can see you, chat and play the shared tables with you. ")), g.append(U("b", f.connected ? f.joined ? b(f.joined) : "Be the first one in tonight." : "Connecting to the room…")), i.push(g, u(!0));
    const w = U("p", void 0, "fine");
    w.append(U("b", "One free signature."), document.createTextNode(" No transaction, no fee, no permission to spend anything.")), i.push(w), f.error && i.push(U("div", f.error, "msg err")), i.push(c("Or look around first, without signing in", () => {
      var E;
      f.later = !0, tt(), (E = document.getElementById("walkin")) == null || E.click();
    }, "lnk guest"));
  } else if (o === "busy" || o === "joining") {
    i.push(a("1", "Join the room"));
    const g = f.trying ? Ol[f.trying] : "your wallet", w = o === "joining" ? `Joining the room as ${Yt(f.signed.address)}…` : f.busy === "connect" ? f.trying === "casino" ? "Opening your casino wallet…" : `Connecting to ${g}…` : f.trying === "casino" ? "Confirm with Face ID or your fingerprint to sign in." : `Check ${g}: approve the free sign-in message.`, E = U("div", void 0, "msg"), $ = U("div", w);
    o === "busy" && $.append(U("small", "No transaction. Nothing to pay.")), E.append(U("span", void 0, "spin"), $), i.push(E), o === "busy" && i.push(u(!1), c("Cancel", x3, "lnk guest"));
  } else if (o === "in") {
    i.push(a("✓", "You are in the room", !0));
    const g = f.wallet ? `${f.wallet.kind === "casino" ? "Casino wallet" : Ol[f.wallet.kind]} · ` : "";
    i.push(l(f.away ? "away · do anything to come back" : `${g}the name others see on your tag`, "Switch"));
    const w = [...f.players.values()].filter(($) => $.a !== f.signed.address), E = U("p", void 0, "here");
    w.length ? (E.append(document.createTextNode("Here now: ")), w.slice(0, 2).forEach(($, H) => {
      const y = w0($.a), _ = $.aw ? "away" : y === "walking" || y === "in the room" ? y : `at ${y}`;
      H && E.append(document.createTextNode(" · ")), E.append(U("b", Yt($.a)), document.createTextNode(` ${_}`));
    }), w.length > 2 && E.append(document.createTextNode(" · "), U("b", `+${w.length - 2} more`))) : E.textContent = "Nobody else is signed in yet. Sit down and they will see you when they arrive.", i.push(E);
  } else if (o === "back")
    i.push(U("p", "Welcome back. You are still signed in from earlier, so you are already in the room.", "lead2")), i.push(l(f.away ? "away · do anything to come back" : `signed in · ${f.joined} here now`, "Not you?"));
  else if (o === "later") {
    const g = U("button", void 0, "later");
    g.type = "button";
    const w = U("span");
    w.append(U("b", "Join the room"), document.createTextNode(" to be seen, chat and play together")), g.append(w, U("span", "›", "go")), g.onclick = () => {
      f.later = !1, tt();
    }, i.push(g);
  } else o === "parked" ? (i.push(U("div", f.parked === "hidden" ? "This tab was in the background for a while, so it left the room." : "You were away for a while, so you left the room.", "msg")), i.push(c("Rejoin the room", () => {
    nn(), ra();
  }, "lnk guest"))) : (i.push(U("div", "Another tab of yours is in the room. You are not connected here.", "msg")), i.push(c("Use this tab instead", () => {
    _r(), tt();
  }, "lnk guest")));
  const p = U("div");
  p.append(...i), e.hidden = !1, p.innerHTML !== Is && (Is = p.innerHTML, e.replaceChildren(...i));
}
function tt() {
  var r;
  if (v3(), x0(), _3(), !De || !Bt || !Jt) return;
  const t = !!(f.signed && f.you && !f.you.guest), e = t ? Yt(f.signed.address) : null;
  if (Bt.className = f.parked ? "wait" : f.away ? "away" : f.connected ? "live" : "wait", Bt.replaceChildren(U("i"), U("span", f.parked ? "Rejoin the room" : e ? f.away ? `${e} · away` : e : "Room", "lbl"), U("span", f.connected ? (r = window.matchMedia) != null && r.call(window, "(max-width:620px)").matches ? String(f.joined) : ` · ${f.joined}` : "", "n")), Bt.setAttribute("aria-label", `Casino room: ${f.connected ? `${f.joined} signed in, ` : ""}${f.parked ? "you left; tap to rejoin" : e ? `you are in as ${e}${f.away ? ", marked away" : ""}` : "see who is here and join"}`), Jt.hidden = !f.open, !f.open) return;
  A3();
  const n = [];
  if (f.parked) {
    n.push(U("h3", "Room"), U("p", f.parked === "hidden" ? "This tab was in the background for a while, so it left the room and your seat was freed." : "You were away for a while, so you left the room and your seat was freed."));
    const o = U("button", "Rejoin the room");
    o.onclick = () => {
      nn(), ra();
    }, n.push(o);
  } else if (f.replaced) {
    n.push(U("h3", "Room"), U("p", "Another tab of yours took over the room. You are not connected here."));
    const o = U("button", "Use this tab instead");
    o.onclick = () => {
      _r(), tt();
    }, n.push(o);
  } else if (t) {
    n.push(U("h3", "Connected as"), U("p", e, "who"));
    const o = { leather: "Leather", xverse: "Xverse", casino: "your casino wallet" };
    if (n.push(U("p", (f.wallet ? `With ${o[f.wallet.kind] || f.wallet.kind}. ` : "") + "Others see this name on your tag.", "fact")), f.away) {
      n.push(U("p", "You are marked away (idle for a while), so you were stood up. Do anything to come back.", "err"));
      const i = U("button", "I'm back");
      i.onclick = () => nn(), n.push(i);
    }
    n.push(U("p", "Your address (tap Copy to share it, say for someone to send you a BNS name):"), i0(f.signed.address, na)), Ul(n), n.push(se("Be seen", "Sit at a table or connect to a machine and your Adrian and name tag appear there for everyone in the room. Stand up or walk away and they go too.")), n.push(se("Spaces", "Each seat and machine holds one person. If someone already has the seat you choose, you are given a free one at the same table.")), n.push(se("Live chat", "Press Chat to talk to the room and scroll back through this session. Tap a name, or Here now, to send someone a direct message, block or report them. Messages are not secret; this session's chat is kept in this tab only and cleared when you leave the room.")), f.features.includes("rounds") && n.push(se("Play together", "Roulette and baccarat are shared tables: everyone there plays the same spin or hand, dealt by the room on a timer and checked by your own browser. In the Strata Salon you can take on another player instead of the house bot.")), f.features.includes("react") && n.push(se("React", "Press 😊 to react, buy your table a round, send someone a drink or invite a friend. Table chat (the Table button in Chat) reaches only the people at your table. Sign in each day for a free daily drop of LAYR.")), n.push(U("p", "Nothing here moves any money.", "fact"));
    const s = U("button", "Leave the room");
    s.onclick = () => {
      b0();
    }, n.push(s);
  } else {
    n.push(U("h3", "Join the room")), n.push(U("p", f.connected ? f.watch ? `You are watching: ${f.joined} signed in, ${f.guests} watching.` : `${f.joined} ${f.joined === 1 ? "person is" : "people are"} in the room. Sign in to join them.` : "Connecting to the room…")), n.push(se("Be seen", f.watch ? "Join, then sit at a table or connect to a machine. Everyone in the room sees your Adrian there, with a name tag (your BNS name, or a short version of your address). Watching alone shows you to nobody." : "Join, then sit at a table or connect to a machine. Everyone in the room sees your Adrian there, with a name tag (your BNS name, or a short version of your address). Until you join you are invisible, and the room is hidden from you; the casino still plays as normal.")), f.connected && f.watch && Ul(n), n.push(se("Spaces", "Each seat and machine holds one person. If someone already has the seat you choose, you are given a free one at the same table.")), n.push(se("Live chat", "Signed-in players can chat with the room and send each other direct messages. Messages are not secret and are not saved.")), n.push(se("Free", "One signature. It sends no transaction, costs no fee and gives no permission to spend anything."));
    const o = U("div", void 0, "row"), s = Gn(), i = { leather: "Leather", xverse: "Xverse", casino: s ? s.describe().label : "Casino wallet" };
    for (const a of p0()) {
      const c = U("button", f.busy ? f.busy === "sign" ? "Check your wallet…" : "Connecting…" : i[a]);
      if (c.disabled = !!f.busy || !f.connected, c.onclick = () => {
        d0(a);
      }, a === "casino" && (c.style.flexBasis = "100%"), o.append(c), f.busy) break;
    }
    if (n.push(o), s && !s.describe().has && n.push(U("p", "Casino wallet: use your casino passkey from any of your devices, or make one free with Face ID or your fingerprint (500 free testnet STX and your first 1,000,000 LAYR).", "fact")), f.error && n.push(U("p", f.error, "err")), !f.busy) {
      const a = U("button", "Not now");
      a.onclick = () => {
        f.open = !1, tt();
      }, n.push(a);
    }
  }
  Jt.replaceChildren(...n);
}
const L3 = (t) => {
  var n, r;
  const e = t.detail;
  !e || typeof e.spot != "string" || !Array.isArray(e.s) || typeof e.b != "number" || !f.features.includes("play") || f.service !== "ok" || !f.connected || !f.signed || !f.you || f.you.guest || ((n = f.spots[e.spot]) == null ? void 0 : n.a) === f.you.a && ((r = f.ws) == null ? void 0 : r.readyState) === WebSocket.OPEN && f.ws.send(JSON.stringify({ t: "play", spot: e.spot, s: e.s.slice(0, 8), b: e.b, f: !!e.f }));
}, H3 = (t) => {
  const e = t.detail;
  if (e) {
    if (e.off) f.ownMove = null;
    else if ([e.x, e.z, e.r].every((n) => typeof n == "number" && Number.isFinite(n))) f.ownMove = { x: e.x, z: e.z, r: e.r };
    else return;
    l0();
  }
}, Cl = {
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
}, k3 = (t) => {
  var o;
  const e = t.detail;
  if (!e || typeof e.t != "string" || !Cl[e.t]) return;
  const n = e.t === "round" || e.t === "watch" || e.t === "spec" && e.ask === !0;
  if (!(f.service === "ok" && f.connected && f.features.includes(Cl[e.t]) && (n || !!(f.signed && f.you && !f.you.guest))) || ((o = f.ws) == null ? void 0 : o.readyState) !== WebSocket.OPEN) {
    qt({ t: "unsent", msg: e });
    return;
  }
  f.ws.send(JSON.stringify(e));
}, I3 = () => {
  var e;
  const t = ((e = f.host) == null ? void 0 : e.currentSpot()) ?? null;
  t !== f.want && (f.want = t, f.yielded = null, f.standSent = null, wr()), f0();
};
async function U3() {
  var e;
  const t = () => {
    f.service = "offline", x0();
  };
  try {
    const { res: n, body: r } = await yr("/casino/room/session");
    if (n.status === 503) return t();
    n.ok && (r != null && r.address) && (f.signed = { address: r.address, hash160: r.hash160, expiresAt: r.expiresAt }, f.resumed = !0), f.service = "ok";
  } catch {
    return t();
  }
  E3(), tt(), Jo(), window.setInterval(I3, 250), window.setInterval(m3, 500), window.addEventListener("px-wallet-connected", (n) => {
    w3(n);
  }), window.addEventListener("px-casino-wallet-ready", () => tt()), window.addEventListener("px-room-play", L3), window.addEventListener("px-room-move", H3), window.addEventListener("px-room-send", k3), window.addEventListener("px-room-bns-check", () => {
    B3();
  }), (e = document.getElementById("intro")) == null || e.addEventListener("click", (n) => {
    const r = n.composedPath();
    !r.some((o) => o instanceof HTMLButtonElement) || r.some((o) => o instanceof Element && o.id === "introJoin") || !(f.signed && f.you && !f.you.guest) && !f.busy && !f.later && (f.later = !0, tt());
  }), window.setInterval(g3, 1e3);
  for (const n of ["pointerdown", "keydown", "wheel", "touchstart"]) window.addEventListener(n, nn, { capture: !0, passive: !0 });
  window.addEventListener("px-room-play", nn), window.addEventListener("px-room-move", nn), document.addEventListener("visibilitychange", () => {
    document.hidden ? f.hiddenAt = Date.now() : (f.hiddenAt = 0, nn());
  }), window.addEventListener("px-room-person", (n) => {
    const r = n.detail;
    r && G && G.openPerson(r.a) && (r.handled = !0);
  });
}
window.PXRounds = Object.freeze({ verifySeed: u3, rouletteResult: s3, baccaratCards: a3, sicboDice: c3 });
const Nl = (t) => {
  f.host || (f.host = t, U3());
}, Pl = window.PXRoomHost;
Pl ? Nl(Pl) : window.addEventListener("px-room-host", () => Nl(window.PXRoomHost), { once: !0 });
window.__pxRoom = {
  chat: () => (G == null ? void 0 : G.debug()) ?? null,
  here: () => ({ away: f.away, parked: f.parked, players: [...f.players.values()], idleFor: Date.now() - f.lastActive, times: { ...ir } }),
  get state() {
    var t;
    return { service: f.service, signed: ((t = f.signed) == null ? void 0 : t.address) ?? null, connected: f.connected, watch: f.watch, prompted: f.prompted, open: f.open, busy: f.busy, error: f.error, you: f.you, spots: f.spots, joined: f.joined, guests: f.guests, want: f.want, features: f.features.slice(), walkers: [...f.walk.keys()], ownMove: f.ownMove, salon: g0(), trail: Pe.slice() };
  }
};
