var Uh = Object.defineProperty;
var Oh = (t, e, n) => e in t ? Uh(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var yn = (t, e, n) => Oh(t, typeof e != "symbol" ? e + "" : e, n);
function jo(t, e) {
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
    if (e) {
      const r = Ph(BigInt(`0x${oe(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${oe(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function qo(t, e = 8) {
  return (typeof t == "bigint" ? t : jo(t, !1)).toString(16).padStart(e * 2, "0");
}
function af(t) {
  return parseInt(t, 16);
}
function cf(t, e = 16) {
  const n = qo(t, e);
  return _n(n);
}
function Ch(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function kh(t, e) {
  return t & BigInt(1) << e;
}
function Ph(t, e) {
  return kh(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Nh = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function oe(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Nh[n];
  return e;
}
function _n(t) {
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
function ar(t) {
  return new TextEncoder().encode(t);
}
function ff(t) {
  return new TextDecoder().decode(t);
}
function lf(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Dh(t) {
  return String.fromCharCode.apply(null, t);
}
function Th(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Ji(t) {
  if (t.some(Th))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Wo(...t) {
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
function Tn(t) {
  return Wo(...t.map((e) => typeof e == "number" ? Ji([e]) : e instanceof Array ? Ji(e) : e));
}
function Fh(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Mh(t, e) {
  return t[e];
}
function Rh(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function ys(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var uo;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(uo || (uo = {}));
uo.Mainnet;
const Gh = 128, Vh = 128, hf = 16;
var er;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(er || (er = {}));
var Zi;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Zi || (Zi = {}));
var Qi;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Qi || (Qi = {}));
var Ot;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ot || (Ot = {}));
const js = ["onChainOnly", "offChainOnly", "any"];
js[0] + "", Ot.OnChainOnly, js[1] + "", Ot.OffChainOnly, js[2] + "", Ot.Any, Ot.OnChainOnly + "", Ot.OnChainOnly, Ot.OffChainOnly + "", Ot.OffChainOnly, Ot.Any + "", Ot.Any;
var po;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(po || (po = {}));
po.Mainnet;
var ta;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(ta || (ta = {}));
var ea;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(ea || (ea = {}));
var na;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(na || (na = {}));
var ra;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(ra || (ra = {}));
var bo;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(bo || (bo = {}));
var sa;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(sa || (sa = {}));
var oa;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(oa || (oa = {}));
var ia;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(ia || (ia = {}));
var aa;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(aa || (aa = {}));
var ca;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(ca || (ca = {}));
var fa;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(fa || (fa = {}));
function go(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Kh(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function uf(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function zh(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  go(t.outputLen), go(t.blockLen);
}
function jh(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function qh(t, e) {
  uf(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const qs = {
  number: go,
  bool: Kh,
  bytes: uf,
  hash: zh,
  exists: jh,
  output: qh
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ws = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ft = (t, e) => t << 32 - e | t >>> e, Wh = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Wh)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Xh(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function df(t) {
  if (typeof t == "string" && (t = Xh(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Yh = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function sn(t) {
  const e = (r) => t().update(df(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Jh(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, i, r), t.setUint32(e + u, a, r);
}
let Xo = class extends Yh {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ws(this.buffer);
  }
  update(e) {
    qs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = df(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const f = Ws(e);
        for (; s <= o - i; i += s)
          this.process(f, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    qs.exists(this), qs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let c = i; c < s; c++)
      n[c] = 0;
    Jh(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Ws(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = f / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let c = 0; c < u; c++)
      a.setUint32(4 * c, h[c], o);
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
const Zh = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), pf = Uint8Array.from({ length: 16 }, (t, e) => e), Qh = pf.map((t) => (9 * t + 5) % 16);
let Yo = [pf], Jo = [Qh];
for (let t = 0; t < 4; t++)
  for (let e of [Yo, Jo])
    e.push(e[t].map((n) => Zh[n]));
const bf = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), tu = Yo.map((t, e) => t.map((n) => bf[e][n])), eu = Jo.map((t, e) => t.map((n) => bf[e][n])), nu = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), ru = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Hr = (t, e) => t << e | t >>> 32 - e;
function la(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Lr = new Uint32Array(16);
let su = class extends Xo {
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
      Lr[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, f = a, u = this.h3 | 0, h = u, c = this.h4 | 0, p = c;
    for (let d = 0; d < 5; d++) {
      const x = 4 - d, w = nu[d], v = ru[d], L = Yo[d], O = Jo[d], g = tu[d], $ = eu[d];
      for (let A = 0; A < 16; A++) {
        const P = Hr(r + la(d, o, a, u) + Lr[L[A]] + w, g[A]) + c | 0;
        r = c, c = u, u = Hr(a, 10) | 0, a = o, o = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = Hr(s + la(x, i, f, h) + Lr[O[A]] + v, $[A]) + p | 0;
        s = p, p = h, h = Hr(f, 10) | 0, f = i, i = P;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + p | 0, this.h3 + c + s | 0, this.h4 + r + i | 0, this.h0 + o + f | 0);
  }
  roundClean() {
    Lr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
sn(() => new su());
const ou = (t, e, n) => t & e ^ ~t & n, iu = (t, e, n) => t & e ^ t & n ^ e & n, au = new Uint32Array([
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
]), le = new Uint32Array(64);
let gf = class extends Xo {
  constructor() {
    super(64, 32, 8, !1), this.A = fe[0] | 0, this.B = fe[1] | 0, this.C = fe[2] | 0, this.D = fe[3] | 0, this.E = fe[4] | 0, this.F = fe[5] | 0, this.G = fe[6] | 0, this.H = fe[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: a, H: f } = this;
    return [e, n, r, s, o, i, a, f];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, f) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = f | 0;
  }
  process(e, n) {
    for (let c = 0; c < 16; c++, n += 4)
      le[c] = e.getUint32(n, !1);
    for (let c = 16; c < 64; c++) {
      const p = le[c - 15], d = le[c - 2], x = Ft(p, 7) ^ Ft(p, 18) ^ p >>> 3, w = Ft(d, 17) ^ Ft(d, 19) ^ d >>> 10;
      le[c] = w + le[c - 7] + x + le[c - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: f, G: u, H: h } = this;
    for (let c = 0; c < 64; c++) {
      const p = Ft(a, 6) ^ Ft(a, 11) ^ Ft(a, 25), d = h + p + ou(a, f, u) + au[c] + le[c] | 0, w = (Ft(r, 2) ^ Ft(r, 13) ^ Ft(r, 22)) + iu(r, s, o) | 0;
      h = u, u = f, f = a, a = i + d | 0, i = o, o = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, f, u, h);
  }
  roundClean() {
    le.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, cu = class extends gf {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
sn(() => new gf());
sn(() => new cu());
const Ir = BigInt(2 ** 32 - 1), xo = BigInt(32);
function xf(t, e = !1) {
  return e ? { h: Number(t & Ir), l: Number(t >> xo & Ir) } : { h: Number(t >> xo & Ir) | 0, l: Number(t & Ir) | 0 };
}
function fu(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = xf(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const lu = (t, e) => BigInt(t >>> 0) << xo | BigInt(e >>> 0), hu = (t, e, n) => t >>> n, uu = (t, e, n) => t << 32 - n | e >>> n, du = (t, e, n) => t >>> n | e << 32 - n, pu = (t, e, n) => t << 32 - n | e >>> n, bu = (t, e, n) => t << 64 - n | e >>> n - 32, gu = (t, e, n) => t >>> n - 32 | e << 64 - n, xu = (t, e) => e, wu = (t, e) => t, yu = (t, e, n) => t << n | e >>> 32 - n, mu = (t, e, n) => e << n | t >>> 32 - n, Su = (t, e, n) => e << n - 32 | t >>> 64 - n, Eu = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Au(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const vu = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Bu = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, $u = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), _u = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Hu = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Lu = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, R = {
  fromBig: xf,
  split: fu,
  toBig: lu,
  shrSH: hu,
  shrSL: uu,
  rotrSH: du,
  rotrSL: pu,
  rotrBH: bu,
  rotrBL: gu,
  rotr32H: xu,
  rotr32L: wu,
  rotlSH: yu,
  rotlSL: mu,
  rotlBH: Su,
  rotlBL: Eu,
  add: Au,
  add3L: vu,
  add3H: Bu,
  add4L: $u,
  add4H: _u,
  add5H: Lu,
  add5L: Hu
}, [Iu, Uu] = R.split([
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
].map((t) => BigInt(t))), he = new Uint32Array(80), ue = new Uint32Array(80);
let ms = class extends Xo {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: f, Eh: u, El: h, Fh: c, Fl: p, Gh: d, Gl: x, Hh: w, Hl: v } = this;
    return [e, n, r, s, o, i, a, f, u, h, c, p, d, x, w, v];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, f, u, h, c, p, d, x, w, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = f | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = c | 0, this.Fl = p | 0, this.Gh = d | 0, this.Gl = x | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let g = 0; g < 16; g++, n += 4)
      he[g] = e.getUint32(n), ue[g] = e.getUint32(n += 4);
    for (let g = 16; g < 80; g++) {
      const $ = he[g - 15] | 0, A = ue[g - 15] | 0, P = R.rotrSH($, A, 1) ^ R.rotrSH($, A, 8) ^ R.shrSH($, A, 7), T = R.rotrSL($, A, 1) ^ R.rotrSL($, A, 8) ^ R.shrSL($, A, 7), C = he[g - 2] | 0, I = ue[g - 2] | 0, b = R.rotrSH(C, I, 19) ^ R.rotrBH(C, I, 61) ^ R.shrSH(C, I, 6), E = R.rotrSL(C, I, 19) ^ R.rotrBL(C, I, 61) ^ R.shrSL(C, I, 6), H = R.add4L(T, E, ue[g - 7], ue[g - 16]), k = R.add4H(H, P, b, he[g - 7], he[g - 16]);
      he[g] = k | 0, ue[g] = H | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: f, Dh: u, Dl: h, Eh: c, El: p, Fh: d, Fl: x, Gh: w, Gl: v, Hh: L, Hl: O } = this;
    for (let g = 0; g < 80; g++) {
      const $ = R.rotrSH(c, p, 14) ^ R.rotrSH(c, p, 18) ^ R.rotrBH(c, p, 41), A = R.rotrSL(c, p, 14) ^ R.rotrSL(c, p, 18) ^ R.rotrBL(c, p, 41), P = c & d ^ ~c & w, T = p & x ^ ~p & v, C = R.add5L(O, A, T, Uu[g], ue[g]), I = R.add5H(C, L, $, P, Iu[g], he[g]), b = C | 0, E = R.rotrSH(r, s, 28) ^ R.rotrBH(r, s, 34) ^ R.rotrBH(r, s, 39), H = R.rotrSL(r, s, 28) ^ R.rotrBL(r, s, 34) ^ R.rotrBL(r, s, 39), k = r & o ^ r & a ^ o & a, M = s & i ^ s & f ^ i & f;
      L = w | 0, O = v | 0, w = d | 0, v = x | 0, d = c | 0, x = p | 0, { h: c, l: p } = R.add(u | 0, h | 0, I | 0, b | 0), u = a | 0, h = f | 0, a = o | 0, f = i | 0, o = r | 0, i = s | 0;
      const N = R.add3L(b, H, M);
      r = R.add3H(N, I, E, k), s = N | 0;
    }
    ({ h: r, l: s } = R.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = R.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: f } = R.add(this.Ch | 0, this.Cl | 0, a | 0, f | 0), { h: u, l: h } = R.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: c, l: p } = R.add(this.Eh | 0, this.El | 0, c | 0, p | 0), { h: d, l: x } = R.add(this.Fh | 0, this.Fl | 0, d | 0, x | 0), { h: w, l: v } = R.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: L, l: O } = R.add(this.Hh | 0, this.Hl | 0, L | 0, O | 0), this.set(r, s, o, i, a, f, u, h, c, p, d, x, w, v, L, O);
  }
  roundClean() {
    he.fill(0), ue.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Ou = class extends ms {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Cu = class extends ms {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, ku = class extends ms {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
sn(() => new ms());
sn(() => new Ou());
sn(() => new Cu());
sn(() => new ku());
const Pu = {}, wf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Pu
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Y = BigInt(0), st = BigInt(1), De = BigInt(2), Jn = BigInt(3), ha = BigInt(8), nt = Object.freeze({
  a: Y,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: st,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), ua = (t, e) => (t + e / De) / e, Ur = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = nt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -st * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), o = n, i = BigInt("0x100000000000000000000000000000000"), a = ua(o * t, e), f = ua(-r * t, e);
    let u = U(t - a * n - f * s, e), h = U(-a * r - f * o, e);
    const c = u > i, p = h > i;
    if (c && (u = e - u), p && (h = e - h), u > i || h > i)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: c, k1: u, k2neg: p, k2: h };
  }
}, Nt = 32, Ze = 32, yf = 32, rs = Nt + 1, ss = 2 * Nt + 1;
function da(t) {
  const { a: e, b: n } = nt, r = U(t * t), s = U(r * t);
  return U(s + e * t + n);
}
const Or = nt.a === Y;
class Zo extends Error {
  constructor(e) {
    super(e);
  }
}
function pa(t) {
  if (!(t instanceof Q))
    throw new TypeError("JacobianPoint expected");
}
class Q {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof Z))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(Z.ZERO) ? Q.ZERO : new Q(e.x, e.y, st);
  }
  static toAffineBatch(e) {
    const n = Mu(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return Q.toAffineBatch(e).map(Q.fromAffine);
  }
  equals(e) {
    pa(e);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = e, f = U(s * s), u = U(a * a), h = U(n * u), c = U(o * f), p = U(U(r * a) * u), d = U(U(i * s) * f);
    return h === c && p === d;
  }
  negate() {
    return new Q(this.x, U(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = U(e * e), o = U(n * n), i = U(o * o), a = e + o, f = U(De * (U(a * a) - s - i)), u = U(Jn * s), h = U(u * u), c = U(h - De * f), p = U(u * (f - c) - ha * i), d = U(De * n * r);
    return new Q(c, p, d);
  }
  add(e) {
    pa(e);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = e;
    if (o === Y || i === Y)
      return this;
    if (n === Y || r === Y)
      return e;
    const f = U(s * s), u = U(a * a), h = U(n * u), c = U(o * f), p = U(U(r * a) * u), d = U(U(i * s) * f), x = U(c - h), w = U(d - p);
    if (x === Y)
      return w === Y ? this.double() : Q.ZERO;
    const v = U(x * x), L = U(x * v), O = U(h * v), g = U(w * w - L - De * O), $ = U(w * (O - g) - p * L), A = U(s * a * x);
    return new Q(g, $, A);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = Q.ZERO;
    if (typeof e == "bigint" && e === Y)
      return n;
    let r = xa(e);
    if (r === st)
      return this;
    if (!Or) {
      let c = n, p = this;
      for (; r > Y; )
        r & st && (c = c.add(p)), p = p.double(), r >>= st;
      return c;
    }
    let { k1neg: s, k1: o, k2neg: i, k2: a } = Ur.splitScalar(r), f = n, u = n, h = this;
    for (; o > Y || a > Y; )
      o & st && (f = f.add(h)), a & st && (u = u.add(h)), h = h.double(), o >>= st, a >>= st;
    return s && (f = f.negate()), i && (u = u.negate()), u = new Q(U(u.x * Ur.beta), u.y, u.z), f.add(u);
  }
  precomputeWindow(e) {
    const n = Or ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(Q.BASE) && (n = Z.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && wo.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = Q.normalizeZ(s), wo.set(n, s)));
    let o = Q.ZERO, i = Q.BASE;
    const a = 1 + (Or ? 128 / r : 256 / r), f = 2 ** (r - 1), u = BigInt(2 ** r - 1), h = 2 ** r, c = BigInt(r);
    for (let p = 0; p < a; p++) {
      const d = p * f;
      let x = Number(e & u);
      e >>= c, x > f && (x -= h, e += st);
      const w = d, v = d + Math.abs(x) - 1, L = p % 2 !== 0, O = x < 0;
      x === 0 ? i = i.add(Cr(L, s[w])) : o = o.add(Cr(O, s[v]));
    }
    return { p: o, f: i };
  }
  multiply(e, n) {
    let r = xa(e), s, o;
    if (Or) {
      const { k1neg: i, k1: a, k2neg: f, k2: u } = Ur.splitScalar(r);
      let { p: h, f: c } = this.wNAF(a, n), { p, f: d } = this.wNAF(u, n);
      h = Cr(i, h), p = Cr(f, p), p = new Q(U(p.x * Ur.beta), p.y, p.z), s = h.add(p), o = c.add(d);
    } else {
      const { p: i, f: a } = this.wNAF(r, n);
      s = i, o = a;
    }
    return Q.normalizeZ([s, o])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, o = this.equals(Q.ZERO);
    e == null && (e = o ? ha : Fn(s));
    const i = e, a = U(i * i), f = U(a * i), u = U(n * a), h = U(r * f), c = U(s * i);
    if (o)
      return Z.ZERO;
    if (c !== st)
      throw new Error("invZ was invalid");
    return new Z(u, h);
  }
}
Q.BASE = new Q(nt.Gx, nt.Gy, st);
Q.ZERO = new Q(Y, st, Y);
function Cr(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const wo = /* @__PURE__ */ new WeakMap();
class Z {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, wo.delete(this);
  }
  hasEvenY() {
    return this.y % De === Y;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = _t(n ? e : e.subarray(1));
    if (!Zr(r))
      throw new Error("Point is not on curve");
    const s = da(r);
    let o = Fu(s);
    const i = (o & st) === st;
    n ? i && (o = U(-o)) : (e[0] & 1) === 1 !== i && (o = U(-o));
    const a = new Z(r, o);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = _t(e.subarray(1, Nt + 1)), r = _t(e.subarray(Nt + 1, Nt * 2 + 1)), s = new Z(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Wt(e), r = n.length, s = n[0];
    if (r === Nt)
      return this.fromCompressedHex(n);
    if (r === rs && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === ss && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${rs} compressed bytes or ${ss} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Z.BASE.multiply(Qe(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: o } = Ef(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const i = Qo(Wt(e)), { n: a } = nt, f = r === 2 || r === 3 ? s + a : s, u = Fn(f, a), h = U(-i * u, a), c = U(o * u, a), p = r & 1 ? "03" : "02", d = Z.fromHex(p + Te(f)), x = Z.BASE.multiplyAndAddUnsafe(d, h, c);
    if (!x)
      throw new Error("Cannot recover signature: point at infinify");
    return x.assertValidity(), x;
  }
  toRawBytes(e = !1) {
    return Fe(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Te(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Te(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Zr(n) || !Zr(r))
      throw new Error(e);
    const s = U(r * r), o = da(n);
    if (U(s - o) !== Y)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new Z(this.x, U(-this.y));
  }
  double() {
    return Q.fromAffine(this).double().toAffine();
  }
  add(e) {
    return Q.fromAffine(this).add(Q.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return Q.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = Q.fromAffine(this), o = n === Y || n === st || this !== Z.BASE ? s.multiplyUnsafe(n) : s.multiply(n), i = Q.fromAffine(e).multiplyUnsafe(r), a = o.add(i);
    return a.equals(Q.ZERO) ? void 0 : a.toAffine();
  }
}
Z.BASE = new Z(nt.Gx, nt.Gy);
Z.ZERO = new Z(Y, Y);
function ba(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function ga(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Hn(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: _t(n), left: t.subarray(e + 2) };
}
function Nu(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Hn(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = ga(t.subarray(2)), { data: r, left: s } = ga(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Hn(s)}`);
  return { r: e, s: r };
}
class se {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? Hn(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new se(os(s.slice(0, 64)), os(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Nu(n ? e : Fe(e));
    return new se(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!In(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!In(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = nt.n >> st;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new se(this.r, U(-this.s, nt.n)) : this;
  }
  toDERRawBytes() {
    return Fe(this.toDERHex());
  }
  toDERHex() {
    const e = ba(Xn(this.s)), n = ba(Xn(this.r)), r = e.length / 2, s = n.length / 2, o = Xn(r), i = Xn(s);
    return `30${Xn(s + r + 4)}02${i}${n}02${o}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Fe(this.toCompactHex());
  }
  toCompactHex() {
    return Te(this.r) + Te(this.s);
  }
}
function Pe(...t) {
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
const Du = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Hn(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Du[t[n]];
  return e;
}
const Tu = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Te(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Y <= t && t < Tu))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Ln(t) {
  const e = Fe(Te(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Xn(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function os(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function Fe(t) {
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
  return os(Hn(t));
}
function Wt(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Fe(t);
}
function xa(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && In(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function U(t, e = nt.P) {
  const n = t % e;
  return n >= Y ? n : e + n;
}
function Ht(t, e) {
  const { P: n } = nt;
  let r = t;
  for (; e-- > Y; )
    r *= r, r %= n;
  return r;
}
function Fu(t) {
  const { P: e } = nt, n = BigInt(6), r = BigInt(11), s = BigInt(22), o = BigInt(23), i = BigInt(44), a = BigInt(88), f = t * t * t % e, u = f * f * t % e, h = Ht(u, Jn) * u % e, c = Ht(h, Jn) * u % e, p = Ht(c, De) * f % e, d = Ht(p, r) * p % e, x = Ht(d, s) * d % e, w = Ht(x, i) * x % e, v = Ht(w, a) * w % e, L = Ht(v, i) * x % e, O = Ht(L, Jn) * u % e, g = Ht(O, o) * d % e, $ = Ht(g, n) * f % e, A = Ht($, De);
  if (A * A % e !== t)
    throw new Error("Cannot find square root");
  return A;
}
function Fn(t, e = nt.P) {
  if (t === Y || e <= Y)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = U(t, e), r = e, s = Y, o = st;
  for (; n !== Y; ) {
    const a = r / n, f = r % n, u = s - o * a;
    r = n, n = f, s = o, o = u;
  }
  if (r !== st)
    throw new Error("invert: does not exist");
  return U(s, e);
}
function Mu(t, e = nt.P) {
  const n = new Array(t.length), r = t.reduce((o, i, a) => i === Y ? o : (n[a] = o, U(o * i, e)), st), s = Fn(r, e);
  return t.reduceRight((o, i, a) => i === Y ? o : (n[a] = U(o * n[a], e), U(o * i, e)), s), n;
}
function Ru(t) {
  const e = t.length * 8 - Ze * 8, n = _t(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Qo(t, e = !1) {
  const n = Ru(t);
  if (e)
    return n;
  const { n: r } = nt;
  return n >= r ? n - r : n;
}
let $n, Zn;
class mf {
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
    return Zn(this.k, ...e);
  }
  checkSync() {
    if (typeof Zn != "function")
      throw new Zo("hmacSha256Sync needs to be set");
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
    return Pe(...n);
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
    return Pe(...n);
  }
}
function In(t) {
  return Y < t && t < nt.n;
}
function Zr(t) {
  return Y < t && t < nt.P;
}
function Sf(t, e, n, r = !0) {
  const { n: s } = nt, o = Qo(t, !0);
  if (!In(o))
    return;
  const i = Fn(o, s), a = Z.BASE.multiply(o), f = U(a.x, s);
  if (f === Y)
    return;
  const u = U(i * U(e + n * f, s), s);
  if (u === Y)
    return;
  let h = new se(f, u), c = (a.x === h.r ? 0 : 2) | Number(a.y & st);
  return r && h.hasHighS() && (h = h.normalizeS(), c ^= 1), { sig: h, recovery: c };
}
function Qe(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Ze)
      throw new Error("Expected 32 bytes of private key");
    e = os(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Ze)
      throw new Error("Expected 32 bytes of private key");
    e = _t(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!In(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function ti(t) {
  return t instanceof Z ? (t.assertValidity(), t) : Z.fromHex(t);
}
function Ef(t) {
  if (t instanceof se)
    return t.assertValidity(), t;
  try {
    return se.fromDER(t);
  } catch {
    return se.fromCompact(t);
  }
}
function ei(t, e = !1) {
  return Z.fromPrivateKey(t).toRawBytes(e);
}
function Gu(t, e, n, r = !1) {
  return Z.fromSignature(t, e, n).toRawBytes(r);
}
function wa(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === rs || r === ss : n ? r === rs * 2 || r === ss * 2 : t instanceof Z;
}
function ni(t, e, n = !1) {
  if (wa(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!wa(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = ti(e);
  return r.assertValidity(), r.multiply(Qe(t)).toRawBytes(n);
}
function Af(t) {
  const e = t.length > Nt ? t.slice(0, Nt) : t;
  return _t(e);
}
function Vu(t) {
  const e = Af(t), n = U(e, nt.n);
  return vf(n < Y ? e : n);
}
function vf(t) {
  return Ln(t);
}
function Bf(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Wt(t), s = Qe(e), o = [vf(s), Vu(r)];
  if (n != null) {
    n === !0 && (n = at.randomBytes(Nt));
    const f = Wt(n);
    if (f.length !== Nt)
      throw new Error(`sign: Expected ${Nt} bytes of extra data`);
    o.push(f);
  }
  const i = Pe(...o), a = Af(r);
  return { seed: i, m: a, d: s };
}
function $f(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: o } = Object.assign({ canonical: !0, der: !0 }, e), i = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return o ? [i, r] : i;
}
async function Ku(t, e, n = {}) {
  const { seed: r, m: s, d: o } = Bf(t, e, n.extraEntropy), i = new mf(yf, Ze);
  await i.reseed(r);
  let a;
  for (; !(a = Sf(await i.generate(), s, o, n.canonical)); )
    await i.reseed();
  return $f(a, n);
}
function _f(t, e, n = {}) {
  const { seed: r, m: s, d: o } = Bf(t, e, n.extraEntropy), i = new mf(yf, Ze);
  i.reseedSync(r);
  let a;
  for (; !(a = Sf(i.generateSync(), s, o, n.canonical)); )
    i.reseedSync();
  return $f(a, n);
}
const zu = { strict: !0 };
function ju(t, e, n, r = zu) {
  let s;
  try {
    s = Ef(t), e = Wt(e);
  } catch {
    return !1;
  }
  const { r: o, s: i } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = Qo(e);
  let f;
  try {
    f = ti(n);
  } catch {
    return !1;
  }
  const { n: u } = nt, h = Fn(i, u), c = U(a * h, u), p = U(o * h, u), d = Z.BASE.multiplyAndAddUnsafe(f, c, p);
  return d ? U(d.x, u) === o : !1;
}
function is(t) {
  return U(_t(t), nt.n);
}
class Un {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Wt(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = _t(n.subarray(0, 32)), s = _t(n.subarray(32, 64));
    return new Un(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Zr(e) || !In(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Te(this.r) + Te(this.s);
  }
  toRawBytes() {
    return Fe(this.toHex());
  }
}
function qu(t) {
  return Z.fromPrivateKey(t).toRawX();
}
class Hf {
  constructor(e, n, r = at.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Wt(e);
    const { x: s, scalar: o } = this.getScalar(Qe(n));
    if (this.px = s, this.d = o, this.rand = Wt(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = Z.fromPrivateKey(e), r = n.hasEvenY() ? e : nt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Ln(e ^ _t(n));
  }
  finalizeNonce(e) {
    const n = U(_t(e), nt.n);
    if (n === Y)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: o } = this.getScalar(n);
    return { R: r, rx: s, k: o };
  }
  finalizeSig(e, n, r, s) {
    return new Un(e.x, U(n + r * s, nt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, o = at.taggedHash, i = this.initNonce(n, await o(ke.aux, s)), { R: a, rx: f, k: u } = this.finalizeNonce(await o(ke.nonce, i, r, e)), h = is(await o(ke.challenge, f, r, e)), c = this.finalizeSig(a, u, h, n);
    return await Uf(c, e, r) || this.error(), c;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, o = at.taggedHashSync, i = this.initNonce(n, o(ke.aux, s)), { R: a, rx: f, k: u } = this.finalizeNonce(o(ke.nonce, i, r, e)), h = is(o(ke.challenge, f, r, e)), c = this.finalizeSig(a, u, h, n);
    return Of(c, e, r) || this.error(), c;
  }
}
async function Wu(t, e, n) {
  return new Hf(t, e, n).calc();
}
function Xu(t, e, n) {
  return new Hf(t, e, n).calcSync();
}
function Lf(t, e, n) {
  const r = t instanceof Un, s = r ? t : Un.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Wt(e),
    P: ti(n)
  };
}
function If(t, e, n, r) {
  const s = Z.BASE.multiplyAndAddUnsafe(e, Qe(n), U(-r, nt.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Uf(t, e, n) {
  try {
    const { r, s, m: o, P: i } = Lf(t, e, n), a = is(await at.taggedHash(ke.challenge, Ln(r), i.toRawX(), o));
    return If(r, i, s, a);
  } catch {
    return !1;
  }
}
function Of(t, e, n) {
  try {
    const { r, s, m: o, P: i } = Lf(t, e, n), a = is(at.taggedHashSync(ke.challenge, Ln(r), i.toRawX(), o));
    return If(r, i, s, a);
  } catch (r) {
    if (r instanceof Zo)
      throw r;
    return !1;
  }
}
const Yu = {
  Signature: Un,
  getPublicKey: qu,
  sign: Wu,
  verify: Uf,
  signSync: Xu,
  verifySync: Of
};
Z.BASE._setWindowSize(8);
const vt = {
  node: wf,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, ke = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, kr = {}, at = {
  bytesToHex: Hn,
  hexToBytes: Fe,
  concatBytes: Pe,
  mod: U,
  invert: Fn,
  isValidPrivateKey(t) {
    try {
      return Qe(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Ln,
  _normalizePrivateKey: Qe,
  hashToPrivateKey: (t) => {
    t = Wt(t);
    const e = Ze + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = U(_t(t), nt.n - st) + st;
    return Ln(n);
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
  randomPrivateKey: () => at.hashToPrivateKey(at.randomBytes(Ze + 8)),
  precompute(t = 8, e = Z.BASE) {
    const n = e === Z.BASE ? e : new Z(e.x, e.y);
    return n._setWindowSize(t), n.multiply(Jn), n;
  },
  sha256: async (...t) => {
    if (vt.web) {
      const e = await vt.web.subtle.digest("SHA-256", Pe(...t));
      return new Uint8Array(e);
    } else if (vt.node) {
      const { createHash: e } = vt.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (vt.web) {
      const n = await vt.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Pe(...e), s = await vt.web.subtle.sign("HMAC", n, r);
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
    let n = kr[t];
    if (n === void 0) {
      const r = await at.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Pe(r, r), kr[t] = n;
    }
    return at.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof $n != "function")
      throw new Zo("sha256Sync is undefined, you need to set it");
    let n = kr[t];
    if (n === void 0) {
      const r = $n(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Pe(r, r), kr[t] = n;
    }
    return $n(n, ...e);
  },
  _JacobianPoint: Q
};
Object.defineProperties(at, {
  sha256Sync: {
    configurable: !1,
    get() {
      return $n;
    },
    set(t) {
      $n || ($n = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Zn;
    },
    set(t) {
      Zn || (Zn = t);
    }
  }
});
const Ju = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: nt,
  Point: Z,
  Signature: se,
  getPublicKey: ei,
  getSharedSecret: ni,
  recoverPublicKey: Gu,
  schnorr: Yu,
  sign: Ku,
  signSync: _f,
  utils: at,
  verify: ju
}, Symbol.toStringTag, { value: "Module" }));
var yt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Zu(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function cr(t) {
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
var Mn = {}, ri = {};
const mn = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Cf(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function yo(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Re(t, ...e) {
  if (!Cf(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function kf(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  yo(t.outputLen), yo(t.blockLen);
}
function nr(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Pf(t, e) {
  Re(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function Qu(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function td(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function rr(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function Qr(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Ut(t, e) {
  return t << 32 - e | t >>> e;
}
function ed(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const si = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function oi(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const Nf = si ? (t) => t : (t) => oi(t), nd = Nf;
function Df(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = oi(t[e]);
  return t;
}
const rd = si ? (t) => t : Df, Tf = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", sd = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function od(t) {
  if (Re(t), Tf)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += sd[t[n]];
  return e;
}
const ee = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function ya(t) {
  if (t >= ee._0 && t <= ee._9)
    return t - ee._0;
  if (t >= ee.A && t <= ee.F)
    return t - (ee.A - 10);
  if (t >= ee.a && t <= ee.f)
    return t - (ee.a - 10);
}
function id(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (Tf)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, o = 0; s < n; s++, o += 2) {
    const i = ya(t.charCodeAt(o)), a = ya(t.charCodeAt(o + 1));
    if (i === void 0 || a === void 0) {
      const f = t[o] + t[o + 1];
      throw new Error('hex string expected, got non-hex character "' + f + '" at index ' + o);
    }
    r[s] = i * 16 + a;
  }
  return r;
}
const Ff = async () => {
};
async function ad(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const o = Date.now() - r;
    o >= 0 && o < e || (await Ff(), r += o);
  }
}
function ii(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function cd(t) {
  return new TextDecoder().decode(t);
}
function Rn(t) {
  return typeof t == "string" && (t = ii(t)), Re(t), t;
}
function fd(t) {
  return typeof t == "string" && (t = ii(t)), Re(t), t;
}
function ld(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    Re(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const o = t[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function hd(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let ai = class {
};
function Ss(t) {
  const e = (r) => t().update(Rn(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Mf(t) {
  const e = (r, s) => t(s).update(Rn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function Rf(t) {
  const e = (r, s) => t(s).update(Rn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const ud = Ss, dd = Mf, pd = Rf;
function bd(t = 32) {
  if (mn && typeof mn.getRandomValues == "function")
    return mn.getRandomValues(new Uint8Array(t));
  if (mn && typeof mn.randomBytes == "function")
    return Uint8Array.from(mn.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const gd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: ai,
  abytes: Re,
  aexists: nr,
  ahash: kf,
  anumber: yo,
  aoutput: Pf,
  asyncLoop: ad,
  byteSwap: oi,
  byteSwap32: Df,
  byteSwapIfBE: nd,
  bytesToHex: od,
  bytesToUtf8: cd,
  checkOpts: hd,
  clean: rr,
  concatBytes: ld,
  createHasher: Ss,
  createOptHasher: Mf,
  createView: Qr,
  createXOFer: Rf,
  hexToBytes: id,
  isBytes: Cf,
  isLE: si,
  kdfInputToBytes: fd,
  nextTick: Ff,
  randomBytes: bd,
  rotl: ed,
  rotr: Ut,
  swap32IfBE: rd,
  swap8IfBE: Nf,
  toBytes: Rn,
  u32: td,
  u8: Qu,
  utf8ToBytes: ii,
  wrapConstructor: ud,
  wrapConstructorWithOpts: dd,
  wrapXOFConstructorWithOpts: pd
}, Symbol.toStringTag, { value: "Module" })), fr = /* @__PURE__ */ cr(gd);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = fr;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(i, a) {
    if (!i.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    i.length % 2 !== 0 && (i = `0${i}`), i = i.toLowerCase();
    let f = [], u = 0;
    for (let d = i.length - 1; d >= 0; d--)
      if (u < 4) {
        const x = n.indexOf(i[d]) >> u;
        let w = 0;
        d !== 0 && (w = n.indexOf(i[d - 1]));
        const v = 1 + u, L = w % (1 << v) << 5 - v, O = t.c32[x + L];
        u = v, f.unshift(O);
      } else
        u = 0;
    let h = 0;
    for (let d = 0; d < f.length && f[d] === "0"; d++)
      h++;
    f = f.slice(h);
    const c = new TextDecoder().decode((0, e.hexToBytes)(i)).match(/^\u0000*/), p = c ? c[0].length : 0;
    for (let d = 0; d < p; d++)
      f.unshift(t.c32[0]);
    if (a) {
      const d = a - f.length;
      for (let x = 0; x < d; x++)
        f.unshift(t.c32[0]);
    }
    return f.join("");
  }
  t.c32encode = r;
  function s(i) {
    return i.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  t.c32normalize = s;
  function o(i, a) {
    if (i = s(i), !i.match(`^[${t.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const f = i.match(`^${t.c32[0]}*`), u = f ? f[0].length : 0;
    let h = [], c = 0, p = 0;
    for (let w = i.length - 1; w >= 0; w--) {
      p === 4 && (h.unshift(n[c]), p = 0, c = 0);
      const L = (t.c32.indexOf(i[w]) << p) + c, O = n[L % 16];
      if (p += 1, c = L >> 4, c > 1 << p)
        throw new Error("Panic error in decoding.");
      h.unshift(O);
    }
    h.unshift(n[c]), h.length % 2 === 1 && h.unshift("0");
    let d = 0;
    for (let w = 0; w < h.length && h[w] === "0"; w++)
      d++;
    h = h.slice(d - d % 2);
    let x = h.join("");
    for (let w = 0; w < u; w++)
      x = `00${x}`;
    if (a) {
      const w = a * 2 - x.length;
      for (let v = 0; v < w; v += 2)
        x = `00${x}`;
    }
    return x;
  }
  t.c32decode = o;
})(ri);
var tn = {};
function xd(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, i, r), t.setUint32(e + u, a, r);
}
function wd(t, e, n) {
  return t & e ^ ~t & n;
}
function yd(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class md extends ai {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = Qr(this.buffer);
  }
  update(e) {
    nr(this), e = Rn(e), Re(e);
    const { view: n, buffer: r, blockLen: s } = this, o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const f = Qr(e);
        for (; s <= o - i; i += s)
          this.process(f, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    nr(this), Pf(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, rr(this.buffer.subarray(i)), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let c = i; c < s; c++)
      n[c] = 0;
    xd(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Qr(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = f / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let c = 0; c < u; c++)
      a.setUint32(4 * c, h[c], o);
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
const de = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), pe = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), Sd = /* @__PURE__ */ Uint32Array.from([
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
]), be = /* @__PURE__ */ new Uint32Array(64);
let ci = class extends md {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = de[0] | 0, this.B = de[1] | 0, this.C = de[2] | 0, this.D = de[3] | 0, this.E = de[4] | 0, this.F = de[5] | 0, this.G = de[6] | 0, this.H = de[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: a, H: f } = this;
    return [e, n, r, s, o, i, a, f];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, f) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = f | 0;
  }
  process(e, n) {
    for (let c = 0; c < 16; c++, n += 4)
      be[c] = e.getUint32(n, !1);
    for (let c = 16; c < 64; c++) {
      const p = be[c - 15], d = be[c - 2], x = Ut(p, 7) ^ Ut(p, 18) ^ p >>> 3, w = Ut(d, 17) ^ Ut(d, 19) ^ d >>> 10;
      be[c] = w + be[c - 7] + x + be[c - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: f, G: u, H: h } = this;
    for (let c = 0; c < 64; c++) {
      const p = Ut(a, 6) ^ Ut(a, 11) ^ Ut(a, 25), d = h + p + wd(a, f, u) + Sd[c] + be[c] | 0, w = (Ut(r, 2) ^ Ut(r, 13) ^ Ut(r, 22)) + yd(r, s, o) | 0;
      h = u, u = f, f = a, a = i + d | 0, i = o, o = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, f, u, h);
  }
  roundClean() {
    rr(be);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), rr(this.buffer);
  }
}, Gf = class extends ci {
  constructor() {
    super(28), this.A = pe[0] | 0, this.B = pe[1] | 0, this.C = pe[2] | 0, this.D = pe[3] | 0, this.E = pe[4] | 0, this.F = pe[5] | 0, this.G = pe[6] | 0, this.H = pe[7] | 0;
  }
};
const Ed = /* @__PURE__ */ Ss(() => new ci()), Ad = /* @__PURE__ */ Ss(() => new Gf()), vd = ci, Bd = Ed, $d = Gf, _d = Ad, Hd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: $d,
  SHA256: vd,
  sha224: _d,
  sha256: Bd
}, Symbol.toStringTag, { value: "Module" })), Es = /* @__PURE__ */ cr(Hd);
Object.defineProperty(tn, "__esModule", { value: !0 });
tn.c32checkDecode = tn.c32checkEncode = void 0;
const ma = Es, Sa = fr, Qn = ri;
function Vf(t) {
  const e = (0, ma.sha256)((0, ma.sha256)((0, Sa.hexToBytes)(t)));
  return (0, Sa.bytesToHex)(e.slice(0, 4));
}
function Ld(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Vf(`${n}${e}`), s = (0, Qn.c32encode)(`${e}${r}`);
  return `${Qn.c32[t]}${s}`;
}
tn.c32checkEncode = Ld;
function Id(t) {
  t = (0, Qn.c32normalize)(t);
  const e = (0, Qn.c32decode)(t.slice(1)), n = t[0], r = Qn.c32.indexOf(n), s = e.slice(-8);
  let o = r.toString(16);
  if (o.length === 1 && (o = `0${o}`), Vf(`${o}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
tn.c32checkDecode = Id;
var Kf = {}, On = {};
function Ud(t) {
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
  var i = t.length, a = t.charAt(0), f = Math.log(i) / Math.log(256), u = Math.log(256) / Math.log(i);
  function h(d) {
    if (d instanceof Uint8Array || (ArrayBuffer.isView(d) ? d = new Uint8Array(d.buffer, d.byteOffset, d.byteLength) : Array.isArray(d) && (d = Uint8Array.from(d))), !(d instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (d.length === 0)
      return "";
    for (var x = 0, w = 0, v = 0, L = d.length; v !== L && d[v] === 0; )
      v++, x++;
    for (var O = (L - v) * u + 1 >>> 0, g = new Uint8Array(O); v !== L; ) {
      for (var $ = d[v], A = 0, P = O - 1; ($ !== 0 || A < w) && P !== -1; P--, A++)
        $ += 256 * g[P] >>> 0, g[P] = $ % i >>> 0, $ = $ / i >>> 0;
      if ($ !== 0)
        throw new Error("Non-zero carry");
      w = A, v++;
    }
    for (var T = O - w; T !== O && g[T] === 0; )
      T++;
    for (var C = a.repeat(x); T < O; ++T)
      C += t.charAt(g[T]);
    return C;
  }
  function c(d) {
    if (typeof d != "string")
      throw new TypeError("Expected String");
    if (d.length === 0)
      return new Uint8Array();
    for (var x = 0, w = 0, v = 0; d[x] === a; )
      w++, x++;
    for (var L = (d.length - x) * f + 1 >>> 0, O = new Uint8Array(L); d[x]; ) {
      var g = d.charCodeAt(x);
      if (g > 255)
        return;
      var $ = e[g];
      if ($ === 255)
        return;
      for (var A = 0, P = L - 1; ($ !== 0 || A < v) && P !== -1; P--, A++)
        $ += i * O[P] >>> 0, O[P] = $ % 256 >>> 0, $ = $ / 256 >>> 0;
      if ($ !== 0)
        throw new Error("Non-zero carry");
      v = A, x++;
    }
    for (var T = L - v; T !== L && O[T] === 0; )
      T++;
    for (var C = new Uint8Array(w + (L - T)), I = w; T !== L; )
      C[I++] = O[T++];
    return C;
  }
  function p(d) {
    var x = c(d);
    if (x)
      return x;
    throw new Error("Non-base" + i + " character");
  }
  return {
    encode: h,
    decodeUnsafe: c,
    decode: p
  };
}
var zf = Ud;
Object.defineProperty(On, "__esModule", { value: !0 });
On.decode = On.encode = void 0;
const as = Es, Ea = fr, jf = zf, qf = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function Od(t, e = "00") {
  const n = typeof t == "string" ? (0, Ea.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Ea.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, as.sha256)((0, as.sha256)(new Uint8Array([...r, ...n])));
  return jf(qf).encode([...r, ...n, ...s.slice(0, 4)]);
}
On.encode = Od;
function Cd(t) {
  const e = jf(qf).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, as.sha256)((0, as.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((o, i) => {
    if (o !== s[i])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
On.decode = Cd;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = tn, n = On, r = fr;
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
  function i(h, c) {
    if (!c.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, e.c32checkEncode)(h, c)}`;
  }
  t.c32address = i;
  function a(h) {
    if (h.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (h[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, e.c32checkDecode)(h.slice(1));
  }
  t.c32addressDecode = a;
  function f(h, c = -1) {
    const p = n.decode(h), d = (0, r.bytesToHex)(p.data), x = parseInt((0, r.bytesToHex)(p.prefix), 16);
    let w;
    return c < 0 ? (w = x, s[x] !== void 0 && (w = s[x])) : w = c, i(w, d);
  }
  t.b58ToC32 = f;
  function u(h, c = -1) {
    const p = a(h), d = p[0], x = p[1];
    let w;
    c < 0 ? (w = d, o[d] !== void 0 && (w = o[d])) : w = c;
    let v = w.toString(16);
    return v.length === 1 && (v = `0${v}`), n.encode(x, v);
  }
  t.c32ToB58 = u;
})(Kf);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = ri;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = tn;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Kf;
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
})(Mn);
var cs = { exports: {} };
cs.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, o = "[object Arguments]", i = "[object Array]", a = "[object Boolean]", f = "[object Date]", u = "[object Error]", h = "[object Function]", c = "[object GeneratorFunction]", p = "[object Map]", d = "[object Number]", x = "[object Object]", w = "[object Promise]", v = "[object RegExp]", L = "[object Set]", O = "[object String]", g = "[object Symbol]", $ = "[object WeakMap]", A = "[object ArrayBuffer]", P = "[object DataView]", T = "[object Float32Array]", C = "[object Float64Array]", I = "[object Int8Array]", b = "[object Int16Array]", E = "[object Int32Array]", H = "[object Uint8Array]", k = "[object Uint8ClampedArray]", M = "[object Uint16Array]", N = "[object Uint32Array]", et = /[\\^$.*+?()[\]{}|]/g, ce = /\w*$/, Zt = /^\[object .+?Constructor\]$/, rt = /^(?:0|[1-9]\d*)$/, j = {};
  j[o] = j[i] = j[A] = j[P] = j[a] = j[f] = j[T] = j[C] = j[I] = j[b] = j[E] = j[p] = j[d] = j[x] = j[v] = j[L] = j[O] = j[g] = j[H] = j[k] = j[M] = j[N] = !0, j[u] = j[h] = j[$] = !1;
  var zn = typeof yt == "object" && yt && yt.Object === Object && yt, hn = typeof self == "object" && self && self.Object === Object && self, it = zn || hn || Function("return this")(), At = e && !e.nodeType && e, pr = At && !0 && t && !t.nodeType && t, Ps = pr && pr.exports === At;
  function un(l, y) {
    return l.set(y[0], y[1]), l;
  }
  function Ns(l, y) {
    return l.add(y), l;
  }
  function Ds(l, y) {
    for (var B = -1, D = l ? l.length : 0; ++B < D && y(l[B], B, l) !== !1; )
      ;
    return l;
  }
  function br(l, y) {
    for (var B = -1, D = y.length, ht = l.length; ++B < D; )
      l[ht + B] = y[B];
    return l;
  }
  function gr(l, y, B, D) {
    for (var ht = -1, St = l ? l.length : 0; ++ht < St; )
      B = y(B, l[ht], ht, l);
    return B;
  }
  function xr(l, y) {
    for (var B = -1, D = Array(l); ++B < l; )
      D[B] = y(B);
    return D;
  }
  function wr(l, y) {
    return l == null ? void 0 : l[y];
  }
  function yr(l) {
    var y = !1;
    if (l != null && typeof l.toString != "function")
      try {
        y = !!(l + "");
      } catch {
      }
    return y;
  }
  function mr(l) {
    var y = -1, B = Array(l.size);
    return l.forEach(function(D, ht) {
      B[++y] = [ht, D];
    }), B;
  }
  function tt(l, y) {
    return function(B) {
      return l(y(B));
    };
  }
  function dn(l) {
    var y = -1, B = Array(l.size);
    return l.forEach(function(D) {
      B[++y] = D;
    }), B;
  }
  var dt = Array.prototype, Sr = Function.prototype, Ge = Object.prototype, pn = it["__core-js_shared__"], Er = function() {
    var l = /[^.]+$/.exec(pn && pn.keys && pn.keys.IE_PROTO || "");
    return l ? "Symbol(src)_1." + l : "";
  }(), Ve = Sr.toString, Dt = Ge.hasOwnProperty, Ke = Ge.toString, Ts = RegExp(
    "^" + Ve.call(Dt).replace(et, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), jn = Ps ? it.Buffer : void 0, qn = it.Symbol, Wn = it.Uint8Array, Fs = tt(Object.getPrototypeOf, Object), Ar = Object.create, Ms = Ge.propertyIsEnumerable, S = dt.splice, F = Object.getOwnPropertySymbols, J = jn ? jn.isBuffer : void 0, X = tt(Object.keys, Object), lt = xn(it, "DataView"), ut = xn(it, "Map"), pt = xn(it, "Promise"), bt = xn(it, "Set"), Tt = xn(it, "WeakMap"), gt = xn(Object, "create"), Di = qe(lt), Il = qe(ut), Ul = qe(pt), Ol = qe(bt), Cl = qe(Tt), Ti = qn ? qn.prototype : void 0, Fi = Ti ? Ti.valueOf : void 0;
  function ze(l) {
    var y = -1, B = l ? l.length : 0;
    for (this.clear(); ++y < B; ) {
      var D = l[y];
      this.set(D[0], D[1]);
    }
  }
  function kl() {
    this.__data__ = gt ? gt(null) : {};
  }
  function Pl(l) {
    return this.has(l) && delete this.__data__[l];
  }
  function Nl(l) {
    var y = this.__data__;
    if (gt) {
      var B = y[l];
      return B === r ? void 0 : B;
    }
    return Dt.call(y, l) ? y[l] : void 0;
  }
  function Dl(l) {
    var y = this.__data__;
    return gt ? y[l] !== void 0 : Dt.call(y, l);
  }
  function Tl(l, y) {
    var B = this.__data__;
    return B[l] = gt && y === void 0 ? r : y, this;
  }
  ze.prototype.clear = kl, ze.prototype.delete = Pl, ze.prototype.get = Nl, ze.prototype.has = Dl, ze.prototype.set = Tl;
  function Qt(l) {
    var y = -1, B = l ? l.length : 0;
    for (this.clear(); ++y < B; ) {
      var D = l[y];
      this.set(D[0], D[1]);
    }
  }
  function Fl() {
    this.__data__ = [];
  }
  function Ml(l) {
    var y = this.__data__, B = vr(y, l);
    if (B < 0)
      return !1;
    var D = y.length - 1;
    return B == D ? y.pop() : S.call(y, B, 1), !0;
  }
  function Rl(l) {
    var y = this.__data__, B = vr(y, l);
    return B < 0 ? void 0 : y[B][1];
  }
  function Gl(l) {
    return vr(this.__data__, l) > -1;
  }
  function Vl(l, y) {
    var B = this.__data__, D = vr(B, l);
    return D < 0 ? B.push([l, y]) : B[D][1] = y, this;
  }
  Qt.prototype.clear = Fl, Qt.prototype.delete = Ml, Qt.prototype.get = Rl, Qt.prototype.has = Gl, Qt.prototype.set = Vl;
  function bn(l) {
    var y = -1, B = l ? l.length : 0;
    for (this.clear(); ++y < B; ) {
      var D = l[y];
      this.set(D[0], D[1]);
    }
  }
  function Kl() {
    this.__data__ = {
      hash: new ze(),
      map: new (ut || Qt)(),
      string: new ze()
    };
  }
  function zl(l) {
    return Br(this, l).delete(l);
  }
  function jl(l) {
    return Br(this, l).get(l);
  }
  function ql(l) {
    return Br(this, l).has(l);
  }
  function Wl(l, y) {
    return Br(this, l).set(l, y), this;
  }
  bn.prototype.clear = Kl, bn.prototype.delete = zl, bn.prototype.get = jl, bn.prototype.has = ql, bn.prototype.set = Wl;
  function gn(l) {
    this.__data__ = new Qt(l);
  }
  function Xl() {
    this.__data__ = new Qt();
  }
  function Yl(l) {
    return this.__data__.delete(l);
  }
  function Jl(l) {
    return this.__data__.get(l);
  }
  function Zl(l) {
    return this.__data__.has(l);
  }
  function Ql(l, y) {
    var B = this.__data__;
    if (B instanceof Qt) {
      var D = B.__data__;
      if (!ut || D.length < n - 1)
        return D.push([l, y]), this;
      B = this.__data__ = new bn(D);
    }
    return B.set(l, y), this;
  }
  gn.prototype.clear = Xl, gn.prototype.delete = Yl, gn.prototype.get = Jl, gn.prototype.has = Zl, gn.prototype.set = Ql;
  function th(l, y) {
    var B = Vs(l) || vh(l) ? xr(l.length, String) : [], D = B.length, ht = !!D;
    for (var St in l)
      Dt.call(l, St) && !(ht && (St == "length" || mh(St, D))) && B.push(St);
    return B;
  }
  function Mi(l, y, B) {
    var D = l[y];
    (!(Dt.call(l, y) && Ki(D, B)) || B === void 0 && !(y in l)) && (l[y] = B);
  }
  function vr(l, y) {
    for (var B = l.length; B--; )
      if (Ki(l[B][0], y))
        return B;
    return -1;
  }
  function eh(l, y) {
    return l && Ri(y, Ks(y), l);
  }
  function Rs(l, y, B, D, ht, St, te) {
    var Et;
    if (D && (Et = St ? D(l, ht, St, te) : D(l)), Et !== void 0)
      return Et;
    if (!$r(l))
      return l;
    var qi = Vs(l);
    if (qi) {
      if (Et = xh(l), !y)
        return ph(l, Et);
    } else {
      var wn = je(l), Wi = wn == h || wn == c;
      if ($h(l))
        return ah(l, y);
      if (wn == x || wn == o || Wi && !St) {
        if (yr(l))
          return St ? l : {};
        if (Et = wh(Wi ? {} : l), !y)
          return bh(l, eh(Et, l));
      } else {
        if (!j[wn])
          return St ? l : {};
        Et = yh(l, wn, Rs, y);
      }
    }
    te || (te = new gn());
    var Xi = te.get(l);
    if (Xi)
      return Xi;
    if (te.set(l, Et), !qi)
      var Yi = B ? gh(l) : Ks(l);
    return Ds(Yi || l, function(zs, _r) {
      Yi && (_r = zs, zs = l[_r]), Mi(Et, _r, Rs(zs, y, B, D, _r, l, te));
    }), Et;
  }
  function nh(l) {
    return $r(l) ? Ar(l) : {};
  }
  function rh(l, y, B) {
    var D = y(l);
    return Vs(l) ? D : br(D, B(l));
  }
  function sh(l) {
    return Ke.call(l);
  }
  function oh(l) {
    if (!$r(l) || Eh(l))
      return !1;
    var y = ji(l) || yr(l) ? Ts : Zt;
    return y.test(qe(l));
  }
  function ih(l) {
    if (!Vi(l))
      return X(l);
    var y = [];
    for (var B in Object(l))
      Dt.call(l, B) && B != "constructor" && y.push(B);
    return y;
  }
  function ah(l, y) {
    if (y)
      return l.slice();
    var B = new l.constructor(l.length);
    return l.copy(B), B;
  }
  function Gs(l) {
    var y = new l.constructor(l.byteLength);
    return new Wn(y).set(new Wn(l)), y;
  }
  function ch(l, y) {
    var B = y ? Gs(l.buffer) : l.buffer;
    return new l.constructor(B, l.byteOffset, l.byteLength);
  }
  function fh(l, y, B) {
    var D = y ? B(mr(l), !0) : mr(l);
    return gr(D, un, new l.constructor());
  }
  function lh(l) {
    var y = new l.constructor(l.source, ce.exec(l));
    return y.lastIndex = l.lastIndex, y;
  }
  function hh(l, y, B) {
    var D = y ? B(dn(l), !0) : dn(l);
    return gr(D, Ns, new l.constructor());
  }
  function uh(l) {
    return Fi ? Object(Fi.call(l)) : {};
  }
  function dh(l, y) {
    var B = y ? Gs(l.buffer) : l.buffer;
    return new l.constructor(B, l.byteOffset, l.length);
  }
  function ph(l, y) {
    var B = -1, D = l.length;
    for (y || (y = Array(D)); ++B < D; )
      y[B] = l[B];
    return y;
  }
  function Ri(l, y, B, D) {
    B || (B = {});
    for (var ht = -1, St = y.length; ++ht < St; ) {
      var te = y[ht], Et = void 0;
      Mi(B, te, Et === void 0 ? l[te] : Et);
    }
    return B;
  }
  function bh(l, y) {
    return Ri(l, Gi(l), y);
  }
  function gh(l) {
    return rh(l, Ks, Gi);
  }
  function Br(l, y) {
    var B = l.__data__;
    return Sh(y) ? B[typeof y == "string" ? "string" : "hash"] : B.map;
  }
  function xn(l, y) {
    var B = wr(l, y);
    return oh(B) ? B : void 0;
  }
  var Gi = F ? tt(F, Object) : Lh, je = sh;
  (lt && je(new lt(new ArrayBuffer(1))) != P || ut && je(new ut()) != p || pt && je(pt.resolve()) != w || bt && je(new bt()) != L || Tt && je(new Tt()) != $) && (je = function(l) {
    var y = Ke.call(l), B = y == x ? l.constructor : void 0, D = B ? qe(B) : void 0;
    if (D)
      switch (D) {
        case Di:
          return P;
        case Il:
          return p;
        case Ul:
          return w;
        case Ol:
          return L;
        case Cl:
          return $;
      }
    return y;
  });
  function xh(l) {
    var y = l.length, B = l.constructor(y);
    return y && typeof l[0] == "string" && Dt.call(l, "index") && (B.index = l.index, B.input = l.input), B;
  }
  function wh(l) {
    return typeof l.constructor == "function" && !Vi(l) ? nh(Fs(l)) : {};
  }
  function yh(l, y, B, D) {
    var ht = l.constructor;
    switch (y) {
      case A:
        return Gs(l);
      case a:
      case f:
        return new ht(+l);
      case P:
        return ch(l, D);
      case T:
      case C:
      case I:
      case b:
      case E:
      case H:
      case k:
      case M:
      case N:
        return dh(l, D);
      case p:
        return fh(l, D, B);
      case d:
      case O:
        return new ht(l);
      case v:
        return lh(l);
      case L:
        return hh(l, D, B);
      case g:
        return uh(l);
    }
  }
  function mh(l, y) {
    return y = y ?? s, !!y && (typeof l == "number" || rt.test(l)) && l > -1 && l % 1 == 0 && l < y;
  }
  function Sh(l) {
    var y = typeof l;
    return y == "string" || y == "number" || y == "symbol" || y == "boolean" ? l !== "__proto__" : l === null;
  }
  function Eh(l) {
    return !!Er && Er in l;
  }
  function Vi(l) {
    var y = l && l.constructor, B = typeof y == "function" && y.prototype || Ge;
    return l === B;
  }
  function qe(l) {
    if (l != null) {
      try {
        return Ve.call(l);
      } catch {
      }
      try {
        return l + "";
      } catch {
      }
    }
    return "";
  }
  function Ah(l) {
    return Rs(l, !0, !0);
  }
  function Ki(l, y) {
    return l === y || l !== l && y !== y;
  }
  function vh(l) {
    return Bh(l) && Dt.call(l, "callee") && (!Ms.call(l, "callee") || Ke.call(l) == o);
  }
  var Vs = Array.isArray;
  function zi(l) {
    return l != null && _h(l.length) && !ji(l);
  }
  function Bh(l) {
    return Hh(l) && zi(l);
  }
  var $h = J || Ih;
  function ji(l) {
    var y = $r(l) ? Ke.call(l) : "";
    return y == h || y == c;
  }
  function _h(l) {
    return typeof l == "number" && l > -1 && l % 1 == 0 && l <= s;
  }
  function $r(l) {
    var y = typeof l;
    return !!l && (y == "object" || y == "function");
  }
  function Hh(l) {
    return !!l && typeof l == "object";
  }
  function Ks(l) {
    return zi(l) ? th(l) : ih(l);
  }
  function Lh() {
    return [];
  }
  function Ih() {
    return !1;
  }
  t.exports = Ah;
})(cs, cs.exports);
cs.exports;
function mo(t) {
  return Mn.c32address(t.version, t.hash160);
}
function fi(t, e, n) {
  const r = e || 1, s = n || Gh;
  if (lp(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: er.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function li(t) {
  const e = Mn.c32addressDecode(t);
  return {
    type: er.Address,
    version: e[0],
    hash160: e[1]
  };
}
var _;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(_ || (_ = {}));
function kd(t) {
  if (t.type === _.PrincipalStandard)
    return mo(t.address);
  if (t.type === _.PrincipalContract)
    return `${mo(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function Pd(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Td(e, n);
  } else
    return Nd(t);
}
function Nd(t) {
  const e = li(t);
  return { type: _.PrincipalStandard, address: e };
}
function Dd(t) {
  return { type: _.PrincipalStandard, address: t };
}
function Td(t, e) {
  const n = li(t), r = fi(e);
  return Wf(n, r);
}
function Wf(t, e) {
  if (ar(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: _.PrincipalContract, address: t, contractName: e };
}
function Xs(t, e = !1) {
  switch (t.type) {
    case _.BoolTrue:
      return !0;
    case _.BoolFalse:
      return !1;
    case _.Int:
    case _.UInt:
      return e ? t.value.toString() : t.value;
    case _.Buffer:
      return `0x${oe(t.buffer)}`;
    case _.OptionalNone:
      return null;
    case _.OptionalSome:
      return An(t.value);
    case _.ResponseErr:
      return An(t.value);
    case _.ResponseOk:
      return An(t.value);
    case _.PrincipalStandard:
    case _.PrincipalContract:
      return kd(t);
    case _.List:
      return t.list.map((r) => An(r));
    case _.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = An(t.data[r]);
      }), n;
    case _.StringASCII:
      return t.data;
    case _.StringUTF8:
      return t.data;
  }
}
function An(t) {
  switch (t.type) {
    case _.ResponseErr:
      return { type: Ne(t), value: Xs(t, !0), success: !1 };
    case _.ResponseOk:
      return { type: Ne(t), value: Xs(t, !0), success: !0 };
    default:
      return { type: Ne(t), value: Xs(t, !0) };
  }
}
function Ne(t) {
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
      return `(optional ${Ne(t.value)})`;
    case _.ResponseErr:
      return `(response UnknownType ${Ne(t.value)})`;
    case _.ResponseOk:
      return `(response ${Ne(t.value)} UnknownType)`;
    case _.PrincipalStandard:
    case _.PrincipalContract:
      return "principal";
    case _.List:
      return `(list ${t.list.length} ${t.list.length ? Ne(t.list[0]) : "UnknownType"})`;
    case _.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${Ne(t.data[e])})`).join(" ")})`;
    case _.StringASCII:
      return `(string-ascii ${lf(t.data).length})`;
    case _.StringUTF8:
      return `(string-utf8 ${ar(t.data).length})`;
  }
}
const Fd = () => ({ type: _.BoolTrue }), Md = () => ({ type: _.BoolFalse }), Aa = BigInt("0xffffffffffffffffffffffffffffffff"), Rd = BigInt(0), va = BigInt("0x7fffffffffffffffffffffffffffffff"), Ba = BigInt("-170141183460469231731687303715884105728"), Gd = (t) => {
  const e = jo(t, !0);
  if (e > va)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${va}`);
  if (e < Ba)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Ba}`);
  return { type: _.Int, value: e };
}, Xf = (t) => {
  const e = jo(t, !1);
  if (e < Rd)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Aa)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Aa}`);
  return { type: _.UInt, value: e };
}, Vd = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: _.Buffer, buffer: t };
};
function Kd() {
  return { type: _.OptionalNone };
}
function zd(t) {
  return { type: _.OptionalSome, value: t };
}
function jd(t) {
  return { type: _.ResponseErr, value: t };
}
function qd(t) {
  return { type: _.ResponseOk, value: t };
}
function Wd(t) {
  return { type: _.List, list: t };
}
function Yf(t) {
  for (const e in t)
    if (!hp(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: _.Tuple, data: t };
}
const ts = (t) => ({ type: _.StringASCII, data: t }), Xd = (t) => ({ type: _.StringUTF8, data: t });
let Jf = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Yd = class extends Jf {
  constructor(e) {
    super(e);
  }
};
class Ys extends Jf {
  constructor(e) {
    super(e);
  }
}
function Zf(t) {
  const e = [];
  return e.push(_n(qo(t.version, 1))), e.push(_n(t.hash160)), Tn(e);
}
function $a(t) {
  const e = af(oe(t.readBytes(1))), n = oe(t.readBytes(20));
  return { type: er.Address, version: e, hash160: n };
}
function Qf(t) {
  const e = [], n = ar(t.content), r = n.byteLength;
  return e.push(_n(qo(r, t.lengthPrefixBytes))), e.push(n), Tn(e);
}
function _a(t, e, n) {
  e = e || 1;
  const r = af(oe(t.readBytes(e))), s = ff(t.readBytes(r));
  return fi(s, e, 128);
}
function Xt(t, e) {
  return Tn([t, e]);
}
function Jd(t) {
  return new Uint8Array([t.type]);
}
function Zd(t) {
  return t.type === _.OptionalNone ? new Uint8Array([t.type]) : Xt(t.type, lr(t.value));
}
function Qd(t) {
  const e = new Uint8Array(4);
  return ys(e, t.buffer.length, 0), Xt(t.type, Wo(e, t.buffer));
}
function tp(t) {
  const e = cf(Ch(t.value, BigInt(Vh)), hf);
  return Xt(t.type, e);
}
function ep(t) {
  const e = cf(t.value, hf);
  return Xt(t.type, e);
}
function np(t) {
  return Xt(t.type, Zf(t.address));
}
function rp(t) {
  return Xt(t.type, Wo(Zf(t.address), Qf(t.contractName)));
}
function sp(t) {
  return Xt(t.type, lr(t.value));
}
function op(t) {
  const e = [], n = new Uint8Array(4);
  ys(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = lr(r);
    e.push(s);
  }
  return Xt(t.type, Tn(e));
}
function ip(t) {
  const e = [], n = new Uint8Array(4);
  ys(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = fi(s);
    e.push(Qf(o));
    const i = lr(t.data[s]);
    e.push(i);
  }
  return Xt(t.type, Tn(e));
}
function t0(t, e) {
  const n = [], r = e == "ascii" ? lf(t.data) : ar(t.data), s = new Uint8Array(4);
  return ys(s, r.length, 0), n.push(s), n.push(r), Xt(t.type, Tn(n));
}
function ap(t) {
  return t0(t, "ascii");
}
function cp(t) {
  return t0(t, "utf8");
}
function lr(t) {
  switch (t.type) {
    case _.BoolTrue:
    case _.BoolFalse:
      return Jd(t);
    case _.OptionalNone:
    case _.OptionalSome:
      return Zd(t);
    case _.Buffer:
      return Qd(t);
    case _.UInt:
      return ep(t);
    case _.Int:
      return tp(t);
    case _.PrincipalStandard:
      return np(t);
    case _.PrincipalContract:
      return rp(t);
    case _.ResponseOk:
    case _.ResponseErr:
      return sp(t);
    case _.List:
      return op(t);
    case _.Tuple:
      return ip(t);
    case _.StringASCII:
      return ap(t);
    case _.StringUTF8:
      return cp(t);
    default:
      throw new Yd("Unable to serialize. Invalid Clarity Value.");
  }
}
function fp(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Ha = /* @__PURE__ */ new Map();
function e0(t, e) {
  const n = Ha.get(t);
  if (n !== void 0)
    return n(e);
  const r = fp(t);
  return Ha.set(t, r), e0(t, e);
}
class La {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Rh(this.readBytes(4), 0);
  }
  readUInt8() {
    return Mh(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Fh(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = oe(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = oe(n);
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
    if (e0(e, r))
      return r;
    throw n(r);
  }
}
function vn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new La(_n(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new La(t) : e = t;
  switch (e.readUInt8Enum(_, (r) => {
    throw new Ys(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case _.Int:
      return Gd(e.readBytes(16));
    case _.UInt:
      return Xf(e.readBytes(16));
    case _.Buffer:
      const r = e.readUInt32BE();
      return Vd(e.readBytes(r));
    case _.BoolTrue:
      return Fd();
    case _.BoolFalse:
      return Md();
    case _.PrincipalStandard:
      const s = $a(e);
      return Dd(s);
    case _.PrincipalContract:
      const o = $a(e), i = _a(e);
      return Wf(o, i);
    case _.ResponseOk:
      return qd(vn(e));
    case _.ResponseErr:
      return jd(vn(e));
    case _.OptionalNone:
      return Kd();
    case _.OptionalSome:
      return zd(vn(e));
    case _.List:
      const a = e.readUInt32BE(), f = [];
      for (let w = 0; w < a; w++)
        f.push(vn(e));
      return Wd(f);
    case _.Tuple:
      const u = e.readUInt32BE(), h = {};
      for (let w = 0; w < u; w++) {
        const v = _a(e).content;
        if (v === void 0)
          throw new Ys('"content" is undefined');
        h[v] = vn(e);
      }
      return Yf(h);
    case _.StringASCII:
      const c = e.readUInt32BE(), p = Dh(e.readBytes(c));
      return ts(p);
    case _.StringUTF8:
      const d = e.readUInt32BE(), x = ff(e.readBytes(d));
      return Xd(x);
    default:
      throw new Ys("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const lp = (t, e) => t ? ar(t).length > e : !1;
function hp(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function n0(t) {
  const e = lr(t);
  return `0x${oe(e)}`;
}
function up(t) {
  return vn(t);
}
const dp = (t) => {
  try {
    return Mn.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
(function() {
  (function(t) {
    (function(e) {
      var n = typeof globalThis < "u" && globalThis || typeof t < "u" && t || // eslint-disable-next-line no-undef
      typeof yt < "u" && yt || {}, r = {
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
        ], i = ArrayBuffer.isView || function(b) {
          return b && o.indexOf(Object.prototype.toString.call(b)) > -1;
        };
      function a(b) {
        if (typeof b != "string" && (b = String(b)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(b) || b === "")
          throw new TypeError('Invalid character in header field name: "' + b + '"');
        return b.toLowerCase();
      }
      function f(b) {
        return typeof b != "string" && (b = String(b)), b;
      }
      function u(b) {
        var E = {
          next: function() {
            var H = b.shift();
            return { done: H === void 0, value: H };
          }
        };
        return r.iterable && (E[Symbol.iterator] = function() {
          return E;
        }), E;
      }
      function h(b) {
        this.map = {}, b instanceof h ? b.forEach(function(E, H) {
          this.append(H, E);
        }, this) : Array.isArray(b) ? b.forEach(function(E) {
          if (E.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + E.length);
          this.append(E[0], E[1]);
        }, this) : b && Object.getOwnPropertyNames(b).forEach(function(E) {
          this.append(E, b[E]);
        }, this);
      }
      h.prototype.append = function(b, E) {
        b = a(b), E = f(E);
        var H = this.map[b];
        this.map[b] = H ? H + ", " + E : E;
      }, h.prototype.delete = function(b) {
        delete this.map[a(b)];
      }, h.prototype.get = function(b) {
        return b = a(b), this.has(b) ? this.map[b] : null;
      }, h.prototype.has = function(b) {
        return this.map.hasOwnProperty(a(b));
      }, h.prototype.set = function(b, E) {
        this.map[a(b)] = f(E);
      }, h.prototype.forEach = function(b, E) {
        for (var H in this.map)
          this.map.hasOwnProperty(H) && b.call(E, this.map[H], H, this);
      }, h.prototype.keys = function() {
        var b = [];
        return this.forEach(function(E, H) {
          b.push(H);
        }), u(b);
      }, h.prototype.values = function() {
        var b = [];
        return this.forEach(function(E) {
          b.push(E);
        }), u(b);
      }, h.prototype.entries = function() {
        var b = [];
        return this.forEach(function(E, H) {
          b.push([H, E]);
        }), u(b);
      }, r.iterable && (h.prototype[Symbol.iterator] = h.prototype.entries);
      function c(b) {
        if (!b._noBody) {
          if (b.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          b.bodyUsed = !0;
        }
      }
      function p(b) {
        return new Promise(function(E, H) {
          b.onload = function() {
            E(b.result);
          }, b.onerror = function() {
            H(b.error);
          };
        });
      }
      function d(b) {
        var E = new FileReader(), H = p(E);
        return E.readAsArrayBuffer(b), H;
      }
      function x(b) {
        var E = new FileReader(), H = p(E), k = /charset=([A-Za-z0-9_-]+)/.exec(b.type), M = k ? k[1] : "utf-8";
        return E.readAsText(b, M), H;
      }
      function w(b) {
        for (var E = new Uint8Array(b), H = new Array(E.length), k = 0; k < E.length; k++)
          H[k] = String.fromCharCode(E[k]);
        return H.join("");
      }
      function v(b) {
        if (b.slice)
          return b.slice(0);
        var E = new Uint8Array(b.byteLength);
        return E.set(new Uint8Array(b)), E.buffer;
      }
      function L() {
        return this.bodyUsed = !1, this._initBody = function(b) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = b, b ? typeof b == "string" ? this._bodyText = b : r.blob && Blob.prototype.isPrototypeOf(b) ? this._bodyBlob = b : r.formData && FormData.prototype.isPrototypeOf(b) ? this._bodyFormData = b : r.searchParams && URLSearchParams.prototype.isPrototypeOf(b) ? this._bodyText = b.toString() : r.arrayBuffer && r.blob && s(b) ? (this._bodyArrayBuffer = v(b.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(b) || i(b)) ? this._bodyArrayBuffer = v(b) : this._bodyText = b = Object.prototype.toString.call(b) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof b == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(b) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var b = c(this);
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
            var b = c(this);
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
          var b = c(this);
          if (b)
            return b;
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
      var O = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function g(b) {
        var E = b.toUpperCase();
        return O.indexOf(E) > -1 ? E : b;
      }
      function $(b, E) {
        if (!(this instanceof $))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        E = E || {};
        var H = E.body;
        if (b instanceof $) {
          if (b.bodyUsed)
            throw new TypeError("Already read");
          this.url = b.url, this.credentials = b.credentials, E.headers || (this.headers = new h(b.headers)), this.method = b.method, this.mode = b.mode, this.signal = b.signal, !H && b._bodyInit != null && (H = b._bodyInit, b.bodyUsed = !0);
        } else
          this.url = String(b);
        if (this.credentials = E.credentials || this.credentials || "same-origin", (E.headers || !this.headers) && (this.headers = new h(E.headers)), this.method = g(E.method || this.method || "GET"), this.mode = E.mode || this.mode || null, this.signal = E.signal || this.signal || function() {
          if ("AbortController" in n) {
            var N = new AbortController();
            return N.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && H)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(H), (this.method === "GET" || this.method === "HEAD") && (E.cache === "no-store" || E.cache === "no-cache")) {
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
      function A(b) {
        var E = new FormData();
        return b.trim().split("&").forEach(function(H) {
          if (H) {
            var k = H.split("="), M = k.shift().replace(/\+/g, " "), N = k.join("=").replace(/\+/g, " ");
            E.append(decodeURIComponent(M), decodeURIComponent(N));
          }
        }), E;
      }
      function P(b) {
        var E = new h(), H = b.replace(/\r?\n[\t ]+/g, " ");
        return H.split("\r").map(function(k) {
          return k.indexOf(`
`) === 0 ? k.substr(1, k.length) : k;
        }).forEach(function(k) {
          var M = k.split(":"), N = M.shift().trim();
          if (N) {
            var et = M.join(":").trim();
            try {
              E.append(N, et);
            } catch (ce) {
              console.warn("Response " + ce.message);
            }
          }
        }), E;
      }
      L.call($.prototype);
      function T(b, E) {
        if (!(this instanceof T))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (E || (E = {}), this.type = "default", this.status = E.status === void 0 ? 200 : E.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = E.statusText === void 0 ? "" : "" + E.statusText, this.headers = new h(E.headers), this.url = E.url || "", this._initBody(b);
      }
      L.call(T.prototype), T.prototype.clone = function() {
        return new T(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new h(this.headers),
          url: this.url
        });
      }, T.error = function() {
        var b = new T(null, { status: 200, statusText: "" });
        return b.ok = !1, b.status = 0, b.type = "error", b;
      };
      var C = [301, 302, 303, 307, 308];
      T.redirect = function(b, E) {
        if (C.indexOf(E) === -1)
          throw new RangeError("Invalid status code");
        return new T(null, { status: E, headers: { location: b } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(E, H) {
          this.message = E, this.name = H;
          var k = Error(E);
          this.stack = k.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function I(b, E) {
        return new Promise(function(H, k) {
          var M = new $(b, E);
          if (M.signal && M.signal.aborted)
            return k(new e.DOMException("Aborted", "AbortError"));
          var N = new XMLHttpRequest();
          function et() {
            N.abort();
          }
          N.onload = function() {
            var rt = {
              statusText: N.statusText,
              headers: P(N.getAllResponseHeaders() || "")
            };
            M.url.indexOf("file://") === 0 && (N.status < 200 || N.status > 599) ? rt.status = 200 : rt.status = N.status, rt.url = "responseURL" in N ? N.responseURL : rt.headers.get("X-Request-URL");
            var j = "response" in N ? N.response : N.responseText;
            setTimeout(function() {
              H(new T(j, rt));
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
          function ce(rt) {
            try {
              return rt === "" && n.location.href ? n.location.href : rt;
            } catch {
              return rt;
            }
          }
          if (N.open(M.method, ce(M.url), !0), M.credentials === "include" ? N.withCredentials = !0 : M.credentials === "omit" && (N.withCredentials = !1), "responseType" in N && (r.blob ? N.responseType = "blob" : r.arrayBuffer && (N.responseType = "arraybuffer")), E && typeof E.headers == "object" && !(E.headers instanceof h || n.Headers && E.headers instanceof n.Headers)) {
            var Zt = [];
            Object.getOwnPropertyNames(E.headers).forEach(function(rt) {
              Zt.push(a(rt)), N.setRequestHeader(rt, f(E.headers[rt]));
            }), M.headers.forEach(function(rt, j) {
              Zt.indexOf(j) === -1 && N.setRequestHeader(j, rt);
            });
          } else
            M.headers.forEach(function(rt, j) {
              N.setRequestHeader(j, rt);
            });
          M.signal && (M.signal.addEventListener("abort", et), N.onreadystatechange = function() {
            N.readyState === 4 && M.signal.removeEventListener("abort", et);
          }), N.send(typeof M._bodyInit > "u" ? null : M._bodyInit);
        });
      }
      return I.polyfill = !0, n.fetch || (n.fetch = I, n.Headers = h, n.Request = $, n.Response = T), e.Headers = h, e.Request = $, e.Response = T, e.fetch = I, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : yt);
})();
const pp = "https://browser.blockstack.org/auth", bp = {
  "@type": "Person",
  "@context": "http://schema.org"
}, r0 = ["store_write"], gp = "blockstack-session", xp = {
  logLevel: "debug"
}, on = {
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
Object.freeze(on);
class Gn extends Error {
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
class wp extends Gn {
  constructor(e, n = "") {
    super({ code: on.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Ia extends Gn {
  constructor(e = "") {
    super({ code: on.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Pr extends Gn {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: on.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Ua extends Gn {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: on.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class So extends Gn {
  constructor(e) {
    super({ code: on.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class s0 extends Gn {
  constructor(e) {
    super({ code: on.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Oa = ["debug", "info", "warn", "error", "none"], Eo = {};
for (let t = 0; t < Oa.length; t++) {
  const e = Oa[t];
  Eo[e] = t;
}
class Bn {
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
    return Eo[xp.logLevel] <= Eo[e];
  }
}
function yp() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function mp() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Js(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function Sp() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Ep() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Ap(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function hi(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Ep(), s) {
      const o = s[t];
      if (o)
        return o;
    }
  } catch (o) {
    Bn.error(`Error getting object '${t}' from global scope '${s}': ${o}`);
  }
  if (e) {
    const o = Ap(s, t.toString(), n);
    throw Bn.error(o), new Error(o);
  }
  if (r)
    return {};
}
function vp(t) {
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
  if (Ip(t, Uint8Array))
    return BigInt(`0x${It(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Bp(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function ui(t, e = 8) {
  return (typeof t == "bigint" ? t : vp(t)).toString(16).padStart(e * 2, "0");
}
function o0(t, e = 16) {
  const n = ui(t, e);
  return $t(n);
}
function $p(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const _p = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function It(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += _p[n];
  return e;
}
function $t(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Bp(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    e[n] = o;
  }
  return e;
}
function hr(t) {
  return new TextEncoder().encode(t);
}
function i0(t) {
  return new TextDecoder().decode(t);
}
function Hp(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Lp(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Ca(t) {
  if (t.some(Lp))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function ie(...t) {
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
function Vn(t) {
  return ie(...t.map((e) => typeof e == "number" ? Ca([e]) : e instanceof Array ? Ca(e) : e));
}
function Ip(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const Up = "https://api.mainnet.hiro.so", Op = "https://api.testnet.hiro.so", Cp = "http://localhost:3999", kp = "https://hub.blockstack.org";
function Pp(t) {
  const e = typeof t == "string" ? $t(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function As(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const Np = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Dp(t, e) {
  const n = {};
  return Object.assign(n, Np, e), await fetch(t, n);
}
function Tp(t) {
  let e = Dp, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Fp(...t) {
  const { fetchLib: e, middlewares: n } = Tp(t);
  return async (s, o) => {
    let i = { url: s, init: o ?? {} };
    for (const f of n)
      typeof f.pre == "function" && (i = await Promise.resolve(f.pre({
        fetch: e,
        ...i
      })) ?? i);
    let a = await e(i.url, i.init);
    for (const f of n)
      typeof f.post == "function" && (a = await Promise.resolve(f.post({
        fetch: e,
        url: i.url,
        init: i.init,
        response: (a == null ? void 0 : a.clone()) ?? a
      })) ?? a);
    return a;
  };
}
class a0 {
  constructor(e = r0.slice(), n = ((a) => (a = hi("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", o = void 0, i = pp) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = o, this.authenticatorURL = i;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Ao(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Mp(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function c0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Rp(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ao(t.outputLen), Ao(t.blockLen);
}
function Gp(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Vp(t, e) {
  c0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Xe = {
  number: Ao,
  bool: Mp,
  bytes: c0,
  hash: Rp,
  exists: Gp,
  output: Vp
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Zs = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Mt = (t, e) => t << 32 - e | t >>> e, Kp = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Kp)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function zp(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function di(t) {
  if (typeof t == "string" && (t = zp(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let f0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function an(t) {
  const e = (r) => t().update(di(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let l0 = class extends f0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Xe.hash(e);
    const r = di(n);
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
    return Xe.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Xe.exists(this), Xe.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const vs = (t, e, n) => new l0(t, e).update(n).digest();
vs.create = (t, e) => new l0(t, e);
function jp(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, i, r), t.setUint32(e + u, a, r);
}
let pi = class extends f0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Zs(this.buffer);
  }
  update(e) {
    Xe.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = di(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const f = Zs(e);
        for (; s <= o - i; i += s)
          this.process(f, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Xe.exists(this), Xe.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let c = i; c < s; c++)
      n[c] = 0;
    jp(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Zs(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = f / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let c = 0; c < u; c++)
      a.setUint32(4 * c, h[c], o);
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
const qp = (t, e, n) => t & e ^ ~t & n, Wp = (t, e, n) => t & e ^ t & n ^ e & n, Xp = new Uint32Array([
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
]), ge = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), xe = new Uint32Array(64);
let h0 = class extends pi {
  constructor() {
    super(64, 32, 8, !1), this.A = ge[0] | 0, this.B = ge[1] | 0, this.C = ge[2] | 0, this.D = ge[3] | 0, this.E = ge[4] | 0, this.F = ge[5] | 0, this.G = ge[6] | 0, this.H = ge[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: a, H: f } = this;
    return [e, n, r, s, o, i, a, f];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, f) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = f | 0;
  }
  process(e, n) {
    for (let c = 0; c < 16; c++, n += 4)
      xe[c] = e.getUint32(n, !1);
    for (let c = 16; c < 64; c++) {
      const p = xe[c - 15], d = xe[c - 2], x = Mt(p, 7) ^ Mt(p, 18) ^ p >>> 3, w = Mt(d, 17) ^ Mt(d, 19) ^ d >>> 10;
      xe[c] = w + xe[c - 7] + x + xe[c - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: f, G: u, H: h } = this;
    for (let c = 0; c < 64; c++) {
      const p = Mt(a, 6) ^ Mt(a, 11) ^ Mt(a, 25), d = h + p + qp(a, f, u) + Xp[c] + xe[c] | 0, w = (Mt(r, 2) ^ Mt(r, 13) ^ Mt(r, 22)) + Wp(r, s, o) | 0;
      h = u, u = f, f = a, a = i + d | 0, i = o, o = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, f, u, h);
  }
  roundClean() {
    xe.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Yp = class extends h0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Cn = an(() => new h0());
an(() => new Yp());
var ur = {};
ur.byteLength = e1;
var Jp = ur.toByteArray = r1, Zp = ur.fromByteArray = i1, zt = [], Lt = [], Qp = typeof Uint8Array < "u" ? Uint8Array : Array, Qs = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Sn = 0, t1 = Qs.length; Sn < t1; ++Sn)
  zt[Sn] = Qs[Sn], Lt[Qs.charCodeAt(Sn)] = Sn;
Lt[45] = 62;
Lt[95] = 63;
function u0(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function e1(t) {
  var e = u0(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function n1(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function r1(t) {
  var e, n = u0(t), r = n[0], s = n[1], o = new Qp(n1(t, r, s)), i = 0, a = s > 0 ? r - 4 : r, f;
  for (f = 0; f < a; f += 4)
    e = Lt[t.charCodeAt(f)] << 18 | Lt[t.charCodeAt(f + 1)] << 12 | Lt[t.charCodeAt(f + 2)] << 6 | Lt[t.charCodeAt(f + 3)], o[i++] = e >> 16 & 255, o[i++] = e >> 8 & 255, o[i++] = e & 255;
  return s === 2 && (e = Lt[t.charCodeAt(f)] << 2 | Lt[t.charCodeAt(f + 1)] >> 4, o[i++] = e & 255), s === 1 && (e = Lt[t.charCodeAt(f)] << 10 | Lt[t.charCodeAt(f + 1)] << 4 | Lt[t.charCodeAt(f + 2)] >> 2, o[i++] = e >> 8 & 255, o[i++] = e & 255), o;
}
function s1(t) {
  return zt[t >> 18 & 63] + zt[t >> 12 & 63] + zt[t >> 6 & 63] + zt[t & 63];
}
function o1(t, e, n) {
  for (var r, s = [], o = e; o < n; o += 3)
    r = (t[o] << 16 & 16711680) + (t[o + 1] << 8 & 65280) + (t[o + 2] & 255), s.push(s1(r));
  return s.join("");
}
function i1(t) {
  for (var e, n = t.length, r = n % 3, s = [], o = 16383, i = 0, a = n - r; i < a; i += o)
    s.push(o1(t, i, i + o > a ? a : i + o));
  return r === 1 ? (e = t[n - 1], s.push(
    zt[e >> 2] + zt[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    zt[e >> 10] + zt[e >> 4 & 63] + zt[e << 2 & 63] + "="
  )), s.join("");
}
function a1() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const c1 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function f1() {
  if (a1())
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
    throw new Error(c1);
  }
}
class l1 {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const o = this.createCipher(e, n, r), i = new Uint8Array(ie(o.update(s), o.final()));
    return Promise.resolve(i);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const o = this.createDecipher(e, n, r), i = new Uint8Array(ie(o.update(s), o.final()));
    return Promise.resolve(i);
  }
}
class h1 {
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
    const a = await this.subtleCrypto.importKey("raw", n, { name: o, length: i }, !1, ["encrypt"]), f = await this.subtleCrypto.encrypt({ name: o, iv: r }, a, s);
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
    const a = await this.subtleCrypto.importKey("raw", n, { name: o, length: i }, !1, ["decrypt"]), f = await this.subtleCrypto.decrypt({ name: o, iv: r }, a, s);
    return new Uint8Array(f);
  }
}
async function d0() {
  const t = await f1();
  return t.name === "subtleCrypto" ? new h1(t.lib) : new l1(t.lib.createCipheriv, t.lib.createDecipheriv);
}
const u1 = zf, d1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var p1 = u1(d1);
const b1 = /* @__PURE__ */ Zu(p1), g1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), p0 = Uint8Array.from({ length: 16 }, (t, e) => e), x1 = p0.map((t) => (9 * t + 5) % 16);
let bi = [p0], gi = [x1];
for (let t = 0; t < 4; t++)
  for (let e of [bi, gi])
    e.push(e[t].map((n) => g1[n]));
const b0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), w1 = bi.map((t, e) => t.map((n) => b0[e][n])), y1 = gi.map((t, e) => t.map((n) => b0[e][n])), m1 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), S1 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Nr = (t, e) => t << e | t >>> 32 - e;
function ka(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Dr = new Uint32Array(16);
let E1 = class extends pi {
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
      Dr[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, f = a, u = this.h3 | 0, h = u, c = this.h4 | 0, p = c;
    for (let d = 0; d < 5; d++) {
      const x = 4 - d, w = m1[d], v = S1[d], L = bi[d], O = gi[d], g = w1[d], $ = y1[d];
      for (let A = 0; A < 16; A++) {
        const P = Nr(r + ka(d, o, a, u) + Dr[L[A]] + w, g[A]) + c | 0;
        r = c, c = u, u = Nr(a, 10) | 0, a = o, o = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = Nr(s + ka(x, i, f, h) + Dr[O[A]] + v, $[A]) + p | 0;
        s = p, p = h, h = Nr(f, 10) | 0, f = i, i = P;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + p | 0, this.h3 + c + s | 0, this.h4 + r + i | 0, this.h0 + o + f | 0);
  }
  roundClean() {
    Dr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const A1 = an(() => new E1());
function v1(t) {
  return A1(t);
}
const Tr = BigInt(2 ** 32 - 1), vo = BigInt(32);
function g0(t, e = !1) {
  return e ? { h: Number(t & Tr), l: Number(t >> vo & Tr) } : { h: Number(t >> vo & Tr) | 0, l: Number(t & Tr) | 0 };
}
function B1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = g0(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const $1 = (t, e) => BigInt(t >>> 0) << vo | BigInt(e >>> 0), _1 = (t, e, n) => t >>> n, H1 = (t, e, n) => t << 32 - n | e >>> n, L1 = (t, e, n) => t >>> n | e << 32 - n, I1 = (t, e, n) => t << 32 - n | e >>> n, U1 = (t, e, n) => t << 64 - n | e >>> n - 32, O1 = (t, e, n) => t >>> n - 32 | e << 64 - n, C1 = (t, e) => e, k1 = (t, e) => t, P1 = (t, e, n) => t << n | e >>> 32 - n, N1 = (t, e, n) => e << n | t >>> 32 - n, D1 = (t, e, n) => e << n - 32 | t >>> 64 - n, T1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function F1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const M1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), R1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, G1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), V1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, K1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), z1 = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, G = {
  fromBig: g0,
  split: B1,
  toBig: $1,
  shrSH: _1,
  shrSL: H1,
  rotrSH: L1,
  rotrSL: I1,
  rotrBH: U1,
  rotrBL: O1,
  rotr32H: C1,
  rotr32L: k1,
  rotlSH: P1,
  rotlSL: N1,
  rotlBH: D1,
  rotlBL: T1,
  add: F1,
  add3L: M1,
  add3H: R1,
  add4L: G1,
  add4H: V1,
  add5H: z1,
  add5L: K1
}, [j1, q1] = G.split([
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
let Bs = class extends pi {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: f, Eh: u, El: h, Fh: c, Fl: p, Gh: d, Gl: x, Hh: w, Hl: v } = this;
    return [e, n, r, s, o, i, a, f, u, h, c, p, d, x, w, v];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, f, u, h, c, p, d, x, w, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = f | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = c | 0, this.Fl = p | 0, this.Gh = d | 0, this.Gl = x | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let g = 0; g < 16; g++, n += 4)
      we[g] = e.getUint32(n), ye[g] = e.getUint32(n += 4);
    for (let g = 16; g < 80; g++) {
      const $ = we[g - 15] | 0, A = ye[g - 15] | 0, P = G.rotrSH($, A, 1) ^ G.rotrSH($, A, 8) ^ G.shrSH($, A, 7), T = G.rotrSL($, A, 1) ^ G.rotrSL($, A, 8) ^ G.shrSL($, A, 7), C = we[g - 2] | 0, I = ye[g - 2] | 0, b = G.rotrSH(C, I, 19) ^ G.rotrBH(C, I, 61) ^ G.shrSH(C, I, 6), E = G.rotrSL(C, I, 19) ^ G.rotrBL(C, I, 61) ^ G.shrSL(C, I, 6), H = G.add4L(T, E, ye[g - 7], ye[g - 16]), k = G.add4H(H, P, b, we[g - 7], we[g - 16]);
      we[g] = k | 0, ye[g] = H | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: f, Dh: u, Dl: h, Eh: c, El: p, Fh: d, Fl: x, Gh: w, Gl: v, Hh: L, Hl: O } = this;
    for (let g = 0; g < 80; g++) {
      const $ = G.rotrSH(c, p, 14) ^ G.rotrSH(c, p, 18) ^ G.rotrBH(c, p, 41), A = G.rotrSL(c, p, 14) ^ G.rotrSL(c, p, 18) ^ G.rotrBL(c, p, 41), P = c & d ^ ~c & w, T = p & x ^ ~p & v, C = G.add5L(O, A, T, q1[g], ye[g]), I = G.add5H(C, L, $, P, j1[g], we[g]), b = C | 0, E = G.rotrSH(r, s, 28) ^ G.rotrBH(r, s, 34) ^ G.rotrBH(r, s, 39), H = G.rotrSL(r, s, 28) ^ G.rotrBL(r, s, 34) ^ G.rotrBL(r, s, 39), k = r & o ^ r & a ^ o & a, M = s & i ^ s & f ^ i & f;
      L = w | 0, O = v | 0, w = d | 0, v = x | 0, d = c | 0, x = p | 0, { h: c, l: p } = G.add(u | 0, h | 0, I | 0, b | 0), u = a | 0, h = f | 0, a = o | 0, f = i | 0, o = r | 0, i = s | 0;
      const N = G.add3L(b, H, M);
      r = G.add3H(N, I, E, k), s = N | 0;
    }
    ({ h: r, l: s } = G.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = G.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: f } = G.add(this.Ch | 0, this.Cl | 0, a | 0, f | 0), { h: u, l: h } = G.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: c, l: p } = G.add(this.Eh | 0, this.El | 0, c | 0, p | 0), { h: d, l: x } = G.add(this.Fh | 0, this.Fl | 0, d | 0, x | 0), { h: w, l: v } = G.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: L, l: O } = G.add(this.Hh | 0, this.Hl | 0, L | 0, O | 0), this.set(r, s, o, i, a, f, u, h, c, p, d, x, w, v, L, O);
  }
  roundClean() {
    we.fill(0), ye.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, W1 = class extends Bs {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, X1 = class extends Bs {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Y1 = class extends Bs {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const J1 = an(() => new Bs());
an(() => new W1());
an(() => new X1());
an(() => new Y1());
function x0(t) {
  return Cn(t);
}
function Z1(t) {
  return J1(t);
}
const Q1 = 0;
at.hmacSha256Sync = (t, ...e) => {
  const n = vs.create(Cn, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function t2() {
  return It(at.randomPrivateKey());
}
function e2(t) {
  const e = Cn(Cn(t));
  return b1.encode(ie(t, e).slice(0, t.length + 4));
}
function n2(t, e) {
  return e2(ie(new Uint8Array([t]), e.slice(0, 20)));
}
function w0(t, e = Q1) {
  const n = typeof t == "string" ? $t(t) : t, r = v1(x0(n));
  return n2(e, r);
}
function y0(t) {
  const e = Pp(t);
  return It(ei(e.slice(0, 32), !0));
}
at.hmacSha256Sync = (t, ...e) => {
  const n = vs.create(Cn, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var fs;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(fs || (fs = {}));
async function r2(t, e, n) {
  return await (await d0()).encrypt("aes-256-cbc", e, t, n);
}
async function s2(t, e, n) {
  return await (await d0()).decrypt("aes-256-cbc", e, t, n);
}
function m0(t, e) {
  return vs(Cn, t, e);
}
function o2(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function S0(t) {
  const e = Z1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function i2(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function a2(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: fs.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: fs.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !i2(t))
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
async function c2(t, e, n, r) {
  const s = a2(t);
  if (!s.result)
    throw s;
  const o = at.randomPrivateKey(), i = ei(o, !0);
  let a = ni(o, t, !0);
  a = a.slice(1);
  const f = S0(a), u = at.randomBytes(16), h = await r2(u, f.encryptionKey, e), c = ie(u, i, h), p = m0(f.hmacKey, c);
  let d;
  if (!r || r === "hex")
    d = It(h);
  else if (r === "base64")
    d = Zp(h);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const x = {
    iv: It(u),
    ephemeralPK: It(i),
    cipherText: d,
    mac: It(p),
    wasString: n
  };
  return r && r !== "hex" && (x.cipherTextEncoding = r), x;
}
async function E0(t, e) {
  if (!e.ephemeralPK)
    throw new Ua("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = ni(t, n, !0);
  r = r.slice(1);
  const s = S0(r), o = $t(e.iv);
  let i;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    i = $t(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    i = Jp(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = ie(o, $t(n), i), f = m0(s.hmacKey, a), u = $t(e.mac);
  if (!o2(u, f))
    throw new Ua("Decryption failed: failure in MAC check");
  const h = await s2(o, s.encryptionKey, i);
  return e.wasString ? i0(h) : h;
}
function f2(t, e) {
  const n = typeof e == "string" ? hr(e) : e, r = y0(t), s = x0(n), o = _f(s, t);
  return {
    signature: It(o),
    publicKey: r
  };
}
async function l2(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = y0(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", o = typeof t == "string" ? hr(t) : t, i = await c2(n.publicKey, o, s, n.cipherTextEncoding);
  let a = JSON.stringify(i);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const f = f2(r, a), u = {
      signature: f.signature,
      publicKey: f.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function h2(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return E0(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var mt = {}, kn = {}, xt = {};
Object.defineProperty(xt, "__esModule", { value: !0 });
xt.decode = xt.encode = xt.unescape = xt.escape = xt.pad = void 0;
const A0 = ur;
function xi(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
xt.pad = xi;
function v0(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
xt.escape = v0;
function B0(t) {
  return xi(t).replace(/-/g, "+").replace(/_/g, "/");
}
xt.unescape = B0;
function u2(t) {
  return v0((0, A0.fromByteArray)(new TextEncoder().encode(t)));
}
xt.encode = u2;
function d2(t) {
  return new TextDecoder().decode((0, A0.toByteArray)(xi(B0(t))));
}
xt.decode = d2;
var $s = {}, _s = {};
let wi = class extends ai {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, kf(e);
    const r = Rn(n);
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
    this.oHash.update(o), rr(o);
  }
  update(e) {
    return nr(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    nr(this), Re(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const $0 = (t, e, n) => new wi(t, e).update(n).digest();
$0.create = (t, e) => new wi(t, e);
const p2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HMAC: wi,
  hmac: $0
}, Symbol.toStringTag, { value: "Module" })), b2 = /* @__PURE__ */ cr(p2), g2 = /* @__PURE__ */ cr(Ju);
var Pn = {};
Object.defineProperty(Pn, "__esModule", { value: !0 });
Pn.joseToDer = Pn.derToJose = void 0;
const _0 = ur, H0 = xt;
function to(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const x2 = {
  ES256: to(256),
  ES384: to(384),
  ES512: to(521)
};
function L0(t) {
  const e = x2[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const ls = 128, I0 = 0, w2 = 32, y2 = 16, m2 = 2, U0 = y2 | w2 | I0 << 6, hs = m2 | I0 << 6;
function O0(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, _0.toByteArray)((0, H0.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function S2(t, e) {
  const n = O0(t), r = L0(e), s = r + 1, o = n.length;
  let i = 0;
  if (n[i++] !== U0)
    throw new Error('Could not find expected "seq"');
  let a = n[i++];
  if (a === (ls | 1) && (a = n[i++]), o - i < a)
    throw new Error(`"seq" specified length of "${a}", only "${o - i}" remaining`);
  if (n[i++] !== hs)
    throw new Error('Could not find expected "int" for "r"');
  const f = n[i++];
  if (o - i - 2 < f)
    throw new Error(`"r" specified length of "${f}", only "${o - i - 2}" available`);
  if (s < f)
    throw new Error(`"r" specified length of "${f}", max of "${s}" is acceptable`);
  const u = i;
  if (i += f, n[i++] !== hs)
    throw new Error('Could not find expected "int" for "s"');
  const h = n[i++];
  if (o - i !== h)
    throw new Error(`"s" specified length of "${h}", expected "${o - i}"`);
  if (s < h)
    throw new Error(`"s" specified length of "${h}", max of "${s}" is acceptable`);
  const c = i;
  if (i += h, i !== o)
    throw new Error(`Expected to consume entire array, but "${o - i}" bytes remain`);
  const p = r - f, d = r - h, x = new Uint8Array(p + f + d + h);
  for (i = 0; i < p; ++i)
    x[i] = 0;
  x.set(n.subarray(u + Math.max(-p, 0), u + f), i), i = r;
  for (const w = i; i < w + d; ++i)
    x[i] = 0;
  return x.set(n.subarray(c + Math.max(-d, 0), c + h), i), (0, H0.escape)((0, _0.fromByteArray)(x));
}
Pn.derToJose = S2;
function Pa(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= ls && --r, r;
}
function E2(t, e) {
  t = O0(t);
  const n = L0(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Pa(t, 0, n), o = Pa(t, n, t.length), i = n - s, a = n - o, f = 2 + i + 1 + 1 + a, u = f < ls, h = new Uint8Array((u ? 2 : 3) + f);
  let c = 0;
  return h[c++] = U0, u ? h[c++] = f : (h[c++] = ls | 1, h[c++] = f & 255), h[c++] = hs, h[c++] = i, s < 0 ? (h[c++] = 0, h.set(t.subarray(0, n), c), c += n) : (h.set(t.subarray(s, n), c), c += n - s), h[c++] = hs, h[c++] = a, o < 0 ? (h[c++] = 0, h.set(t.subarray(n), c)) : h.set(t.subarray(n + o), c), h;
}
Pn.joseToDer = E2;
var ae = {};
Object.defineProperty(ae, "__esModule", { value: !0 });
ae.InvalidTokenError = ae.MissingParametersError = void 0;
class A2 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
ae.MissingParametersError = A2;
class v2 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
ae.InvalidTokenError = v2;
Object.defineProperty(_s, "__esModule", { value: !0 });
_s.SECP256K1Client = void 0;
const B2 = b2, $2 = Es, es = g2, Na = Pn, Da = ae, Ta = fr;
es.utils.hmacSha256Sync = (t, ...e) => {
  const n = B2.hmac.create($2.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class C0 {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Ta.bytesToHex)(es.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Da.MissingParametersError("a signing input hash and private key are all required");
    const s = es.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Ta.bytesToHex)(s);
    if (r === "jose")
      return (0, Na.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Na.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Da.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return es.verify(n, e, r, { strict: !1 });
  }
}
_s.SECP256K1Client = C0;
C0.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = _s;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})($s);
var en = {};
const _2 = /* @__PURE__ */ cr(wf);
var H2 = yt && yt.__awaiter || function(t, e, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
    function a(h) {
      try {
        u(r.next(h));
      } catch (c) {
        i(c);
      }
    }
    function f(h) {
      try {
        u(r.throw(h));
      } catch (c) {
        i(c);
      }
    }
    function u(h) {
      h.done ? o(h.value) : s(h.value).then(a, f);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(en, "__esModule", { value: !0 });
en.hashSha256Async = en.hashSha256 = void 0;
const L2 = Es;
function k0(t) {
  return (0, L2.sha256)(t);
}
en.hashSha256 = k0;
function I2(t) {
  return H2(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = _2;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(k0(t));
    }
  });
}
en.hashSha256Async = I2;
var U2 = yt && yt.__awaiter || function(t, e, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
    function a(h) {
      try {
        u(r.next(h));
      } catch (c) {
        i(c);
      }
    }
    function f(h) {
      try {
        u(r.throw(h));
      } catch (c) {
        i(c);
      }
    }
    function u(h) {
      h.done ? o(h.value) : s(h.value).then(a, f);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(kn, "__esModule", { value: !0 });
kn.TokenSigner = kn.createUnsecuredToken = void 0;
const Bo = xt, Fa = $s, O2 = ae, Ma = en;
function $o(t, e) {
  const n = [], r = Bo.encode(JSON.stringify(e));
  n.push(r);
  const s = Bo.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function C2(t) {
  return $o(t, { typ: "JWT", alg: "none" }) + ".";
}
kn.createUnsecuredToken = C2;
class k2 {
  constructor(e, n) {
    if (!(e && n))
      throw new O2.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Fa.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Fa.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), o = $o(e, s), i = (0, Ma.hashSha256)(o);
    return this.createWithSignedHash(e, n, s, o, i);
  }
  signAsync(e, n = !1, r = {}) {
    return U2(this, void 0, void 0, function* () {
      const s = this.header(r), o = $o(e, s), i = yield (0, Ma.hashSha256Async)(o);
      return this.createWithSignedHash(e, n, s, o, i);
    });
  }
  createWithSignedHash(e, n, r, s, o) {
    const i = this.cryptoClient.signHash(o, this.rawPrivateKey);
    return n ? {
      header: [Bo.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [i]
    } : [s, i].join(".");
  }
}
kn.TokenSigner = k2;
var Hs = {};
Object.defineProperty(Hs, "__esModule", { value: !0 });
Hs.TokenVerifier = void 0;
const P2 = xt, Ra = $s, N2 = ae, Fr = en;
class D2 {
  constructor(e, n) {
    if (!(e && n))
      throw new N2.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Ra.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Ra.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, Fr.hashSha256Async)(s).then((i) => o(i));
    {
      const i = (0, Fr.hashSha256)(s);
      return o(i);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), P2.encode(e.payload)].join(".");
    let s = !0;
    const o = (i) => (e.signature.map((a) => {
      const f = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(i, f, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Fr.hashSha256Async)(r).then((i) => o(i));
    {
      const i = (0, Fr.hashSha256)(r);
      return o(i);
    }
  }
}
Hs.TokenVerifier = D2;
var Ls = {};
Object.defineProperty(Ls, "__esModule", { value: !0 });
Ls.decodeToken = void 0;
const Mr = xt;
function T2(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Mr.decode(e[0])), r = JSON.parse(Mr.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Mr.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Mr.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
Ls.decodeToken = T2;
(function(t) {
  var e = yt && yt.__createBinding || (Object.create ? function(r, s, o, i) {
    i === void 0 && (i = o);
    var a = Object.getOwnPropertyDescriptor(s, o);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[o];
    } }), Object.defineProperty(r, i, a);
  } : function(r, s, o, i) {
    i === void 0 && (i = o), r[i] = s[o];
  }), n = yt && yt.__exportStar || function(r, s) {
    for (var o in r) o !== "default" && !Object.prototype.hasOwnProperty.call(s, o) && e(s, r, o);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(kn, t), n(Hs, t), n(Ls, t), n(ae, t), n($s, t);
})(mt);
function F2(t) {
  return `did:btc-addr:${t}`;
}
function M2(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Ia("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Ia('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function P0(t) {
  if (t)
    return M2(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const R2 = "1.4.0";
function G2() {
  return t2();
}
function V2(t, e, n, r = r0.slice(), s, o = yp().getTime(), i = {}) {
  const a = (d) => {
    const x = hi("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${d}=undefined])`
    });
    return x == null ? void 0 : x.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const f = Object.assign({}, i, {
    jti: Sp(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(o / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: R2,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = mt.SECP256K1Client.derivePublicKey(t);
  f.public_keys = [u];
  const h = w0(u);
  return f.iss = F2(h), new mt.TokenSigner("ES256k", t).sign(f);
}
async function Ga(t, e) {
  const n = i0($t(e)), r = JSON.parse(n), s = await E0(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function K2(t) {
  const e = mt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new mt.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function z2(t) {
  const e = mt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = P0(e.iss);
  if (n.length === 1) {
    if (w0(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function j2(t) {
  const e = mt.decodeToken(t).payload;
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
function q2(t) {
  const e = mt.decodeToken(t).payload;
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
function W2(t) {
  const e = [
    q2(t),
    j2(t),
    K2(t),
    z2(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Va = "1.0.0";
class Me {
  constructor(e) {
    this.version = Va, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Va)
      throw new So(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Me(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class N0 {
  constructor(e) {
    if (e) {
      const n = new Me(e);
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
class Ka extends N0 {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Me({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new s0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Me({})), !0;
  }
}
class za extends N0 {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = gp, !localStorage.getItem(this.key)) {
      const r = new Me({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new s0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Me.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Me({})), !0;
  }
}
var sr;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(sr || (sr = {}));
var us;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(us || (us = {}));
sr.Mainnet;
var re;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(re || (re = {}));
var qt;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(qt || (qt = {}));
re.Mainnet;
const D0 = {
  chainId: sr.Mainnet,
  transactionVersion: re.Mainnet,
  peerNetworkId: us.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: qt.MainnetSingleSig,
    multiSig: qt.MainnetMultiSig
  },
  client: { baseUrl: Up }
}, _o = {
  chainId: sr.Testnet,
  transactionVersion: re.Testnet,
  peerNetworkId: us.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: qt.TestnetSingleSig,
    multiSig: qt.TestnetMultiSig
  },
  client: { baseUrl: Op }
}, ns = {
  ..._o,
  addressVersion: { ..._o.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Cp }
}, X2 = {
  ...ns,
  addressVersion: { ...ns.addressVersion },
  client: { ...ns.client }
};
function Y2(t) {
  switch (t) {
    case "mainnet":
      return D0;
    case "testnet":
      return _o;
    case "devnet":
      return ns;
    case "mocknet":
      return X2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function T0(t) {
  return typeof t == "string" ? Y2(t) : t;
}
var ja;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ja || (ja = {}));
var qa;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(qa || (qa = {}));
var Ct;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ct || (Ct = {}));
const eo = ["onChainOnly", "offChainOnly", "any"];
eo[0] + "", Ct.OnChainOnly, eo[1] + "", Ct.OffChainOnly, eo[2] + "", Ct.Any, Ct.OnChainOnly + "", Ct.OnChainOnly, Ct.OffChainOnly + "", Ct.OffChainOnly, Ct.Any + "", Ct.Any;
var Wa;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Wa || (Wa = {}));
var Xa;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Xa || (Xa = {}));
var Ya;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ya || (Ya = {}));
var ne;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(ne || (ne = {}));
var Ja;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ja || (Ja = {}));
var Za;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Za || (Za = {}));
var Qa;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Qa || (Qa = {}));
var tc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(tc || (tc = {}));
var ec;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ec || (ec = {}));
var nc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(nc || (nc = {}));
var rc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(rc || (rc = {}));
var sc;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(sc || (sc = {}));
var oc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(oc || (oc = {}));
function Ho(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function J2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function F0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Z2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ho(t.outputLen), Ho(t.blockLen);
}
function Q2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function tb(t, e) {
  F0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ye = {
  number: Ho,
  bool: J2,
  bytes: F0,
  hash: Z2,
  exists: Q2,
  output: tb
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const no = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Rt = (t, e) => t << 32 - e | t >>> e, eb = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!eb)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function nb(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function yi(t) {
  if (typeof t == "string" && (t = nb(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let M0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function cn(t) {
  const e = (r) => t().update(yi(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
class R0 extends M0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ye.hash(e);
    const r = yi(n);
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
    return Ye.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Ye.exists(this), Ye.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const G0 = (t, e, n) => new R0(t, e).update(n).digest();
G0.create = (t, e) => new R0(t, e);
function rb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, i, r), t.setUint32(e + u, a, r);
}
let mi = class extends M0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = no(this.buffer);
  }
  update(e) {
    Ye.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = yi(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const f = no(e);
        for (; s <= o - i; i += s)
          this.process(f, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ye.exists(this), Ye.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let c = i; c < s; c++)
      n[c] = 0;
    rb(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = no(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = f / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let c = 0; c < u; c++)
      a.setUint32(4 * c, h[c], o);
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
const sb = (t, e, n) => t & e ^ ~t & n, ob = (t, e, n) => t & e ^ t & n ^ e & n, ib = new Uint32Array([
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
let V0 = class extends mi {
  constructor() {
    super(64, 32, 8, !1), this.A = me[0] | 0, this.B = me[1] | 0, this.C = me[2] | 0, this.D = me[3] | 0, this.E = me[4] | 0, this.F = me[5] | 0, this.G = me[6] | 0, this.H = me[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: a, H: f } = this;
    return [e, n, r, s, o, i, a, f];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, f) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = f | 0;
  }
  process(e, n) {
    for (let c = 0; c < 16; c++, n += 4)
      Se[c] = e.getUint32(n, !1);
    for (let c = 16; c < 64; c++) {
      const p = Se[c - 15], d = Se[c - 2], x = Rt(p, 7) ^ Rt(p, 18) ^ p >>> 3, w = Rt(d, 17) ^ Rt(d, 19) ^ d >>> 10;
      Se[c] = w + Se[c - 7] + x + Se[c - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: f, G: u, H: h } = this;
    for (let c = 0; c < 64; c++) {
      const p = Rt(a, 6) ^ Rt(a, 11) ^ Rt(a, 25), d = h + p + sb(a, f, u) + ib[c] + Se[c] | 0, w = (Rt(r, 2) ^ Rt(r, 13) ^ Rt(r, 22)) + ob(r, s, o) | 0;
      h = u, u = f, f = a, a = i + d | 0, i = o, o = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, f, u, h);
  }
  roundClean() {
    Se.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, ab = class extends V0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const K0 = cn(() => new V0());
cn(() => new ab());
function cb(t, e) {
  switch (e = T0(e ?? D0), t) {
    case ne.P2PKH:
      switch (e.transactionVersion) {
        case re.Mainnet:
          return qt.MainnetSingleSig;
        case re.Testnet:
          return qt.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case ne.P2SH:
    case ne.P2SHNonSequential:
    case ne.P2WPKH:
    case ne.P2WSH:
    case ne.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case re.Mainnet:
          return qt.MainnetMultiSig;
        case re.Testnet:
          return qt.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const fb = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), z0 = Uint8Array.from({ length: 16 }, (t, e) => e), lb = z0.map((t) => (9 * t + 5) % 16);
let Si = [z0], Ei = [lb];
for (let t = 0; t < 4; t++)
  for (let e of [Si, Ei])
    e.push(e[t].map((n) => fb[n]));
const j0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), hb = Si.map((t, e) => t.map((n) => j0[e][n])), ub = Ei.map((t, e) => t.map((n) => j0[e][n])), db = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), pb = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Rr = (t, e) => t << e | t >>> 32 - e;
function ic(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Gr = new Uint32Array(16);
let bb = class extends mi {
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
      Gr[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, f = a, u = this.h3 | 0, h = u, c = this.h4 | 0, p = c;
    for (let d = 0; d < 5; d++) {
      const x = 4 - d, w = db[d], v = pb[d], L = Si[d], O = Ei[d], g = hb[d], $ = ub[d];
      for (let A = 0; A < 16; A++) {
        const P = Rr(r + ic(d, o, a, u) + Gr[L[A]] + w, g[A]) + c | 0;
        r = c, c = u, u = Rr(a, 10) | 0, a = o, o = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = Rr(s + ic(x, i, f, h) + Gr[O[A]] + v, $[A]) + p | 0;
        s = p, p = h, h = Rr(f, 10) | 0, f = i, i = P;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + p | 0, this.h3 + c + s | 0, this.h4 + r + i | 0, this.h0 + o + f | 0);
  }
  roundClean() {
    Gr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const gb = cn(() => new bb()), Vr = BigInt(2 ** 32 - 1), Lo = BigInt(32);
function q0(t, e = !1) {
  return e ? { h: Number(t & Vr), l: Number(t >> Lo & Vr) } : { h: Number(t >> Lo & Vr) | 0, l: Number(t & Vr) | 0 };
}
function xb(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = q0(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const wb = (t, e) => BigInt(t >>> 0) << Lo | BigInt(e >>> 0), yb = (t, e, n) => t >>> n, mb = (t, e, n) => t << 32 - n | e >>> n, Sb = (t, e, n) => t >>> n | e << 32 - n, Eb = (t, e, n) => t << 32 - n | e >>> n, Ab = (t, e, n) => t << 64 - n | e >>> n - 32, vb = (t, e, n) => t >>> n - 32 | e << 64 - n, Bb = (t, e) => e, $b = (t, e) => t, _b = (t, e, n) => t << n | e >>> 32 - n, Hb = (t, e, n) => e << n | t >>> 32 - n, Lb = (t, e, n) => e << n - 32 | t >>> 64 - n, Ib = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Ub(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Ob = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Cb = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, kb = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Pb = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Nb = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Db = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, V = {
  fromBig: q0,
  split: xb,
  toBig: wb,
  shrSH: yb,
  shrSL: mb,
  rotrSH: Sb,
  rotrSL: Eb,
  rotrBH: Ab,
  rotrBL: vb,
  rotr32H: Bb,
  rotr32L: $b,
  rotlSH: _b,
  rotlSL: Hb,
  rotlBH: Lb,
  rotlBL: Ib,
  add: Ub,
  add3L: Ob,
  add3H: Cb,
  add4L: kb,
  add4H: Pb,
  add5H: Db,
  add5L: Nb
}, [Tb, Fb] = V.split([
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
let Is = class extends mi {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: f, Eh: u, El: h, Fh: c, Fl: p, Gh: d, Gl: x, Hh: w, Hl: v } = this;
    return [e, n, r, s, o, i, a, f, u, h, c, p, d, x, w, v];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, f, u, h, c, p, d, x, w, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = f | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = c | 0, this.Fl = p | 0, this.Gh = d | 0, this.Gl = x | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let g = 0; g < 16; g++, n += 4)
      Ee[g] = e.getUint32(n), Ae[g] = e.getUint32(n += 4);
    for (let g = 16; g < 80; g++) {
      const $ = Ee[g - 15] | 0, A = Ae[g - 15] | 0, P = V.rotrSH($, A, 1) ^ V.rotrSH($, A, 8) ^ V.shrSH($, A, 7), T = V.rotrSL($, A, 1) ^ V.rotrSL($, A, 8) ^ V.shrSL($, A, 7), C = Ee[g - 2] | 0, I = Ae[g - 2] | 0, b = V.rotrSH(C, I, 19) ^ V.rotrBH(C, I, 61) ^ V.shrSH(C, I, 6), E = V.rotrSL(C, I, 19) ^ V.rotrBL(C, I, 61) ^ V.shrSL(C, I, 6), H = V.add4L(T, E, Ae[g - 7], Ae[g - 16]), k = V.add4H(H, P, b, Ee[g - 7], Ee[g - 16]);
      Ee[g] = k | 0, Ae[g] = H | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: f, Dh: u, Dl: h, Eh: c, El: p, Fh: d, Fl: x, Gh: w, Gl: v, Hh: L, Hl: O } = this;
    for (let g = 0; g < 80; g++) {
      const $ = V.rotrSH(c, p, 14) ^ V.rotrSH(c, p, 18) ^ V.rotrBH(c, p, 41), A = V.rotrSL(c, p, 14) ^ V.rotrSL(c, p, 18) ^ V.rotrBL(c, p, 41), P = c & d ^ ~c & w, T = p & x ^ ~p & v, C = V.add5L(O, A, T, Fb[g], Ae[g]), I = V.add5H(C, L, $, P, Tb[g], Ee[g]), b = C | 0, E = V.rotrSH(r, s, 28) ^ V.rotrBH(r, s, 34) ^ V.rotrBH(r, s, 39), H = V.rotrSL(r, s, 28) ^ V.rotrBL(r, s, 34) ^ V.rotrBL(r, s, 39), k = r & o ^ r & a ^ o & a, M = s & i ^ s & f ^ i & f;
      L = w | 0, O = v | 0, w = d | 0, v = x | 0, d = c | 0, x = p | 0, { h: c, l: p } = V.add(u | 0, h | 0, I | 0, b | 0), u = a | 0, h = f | 0, a = o | 0, f = i | 0, o = r | 0, i = s | 0;
      const N = V.add3L(b, H, M);
      r = V.add3H(N, I, E, k), s = N | 0;
    }
    ({ h: r, l: s } = V.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = V.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: f } = V.add(this.Ch | 0, this.Cl | 0, a | 0, f | 0), { h: u, l: h } = V.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: c, l: p } = V.add(this.Eh | 0, this.El | 0, c | 0, p | 0), { h: d, l: x } = V.add(this.Fh | 0, this.Fl | 0, d | 0, x | 0), { h: w, l: v } = V.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: L, l: O } = V.add(this.Hh | 0, this.Hl | 0, L | 0, O | 0), this.set(r, s, o, i, a, f, u, h, c, p, d, x, w, v, L, O);
  }
  roundClean() {
    Ee.fill(0), Ae.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Mb = class extends Is {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Rb = class extends Is {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Gb = class extends Is {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
cn(() => new Is());
cn(() => new Mb());
cn(() => new Rb());
cn(() => new Gb());
var Io;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Io || (Io = {}));
function Vb(t, e) {
  return { type: Io.Address, version: t, hash160: e };
}
function Kb(t) {
  return Mn.c32address(t.version, t.hash160);
}
const zb = (t) => gb(K0(t)), jb = (t) => It(zb(t));
at.hmacSha256Sync = (t, ...e) => {
  const n = G0.create(K0, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function qb(t, e = "mainnet") {
  e = T0(e), t = typeof t == "string" ? $t(t) : t;
  const n = cb(ne.P2PKH, e), r = Vb(n, jb(t));
  return Kb(r);
}
function Wb(t, e) {
  const n = mt.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, o = qb(s);
  if (e !== s) {
    if (e !== o) throw new Error("Token issuer public key does not match the verifying value");
  }
  const i = new mt.TokenVerifier(n.header.alg, s);
  if (!i)
    throw new Error("Invalid token verifier");
  if (!i.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function Xb(t, e = null) {
  let n;
  e ? n = Wb(t, e) : n = mt.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const ac = "_blockstackDidCheckEchoReply", Yb = "echoReply", Jb = "authContinuation";
function Zb(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, o] = r.split("=");
    return n[s] = o ? decodeURIComponent(o.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function Qb() {
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
  const n = Zb(t.location.search), r = n[Yb];
  if (r) {
    t[ac] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const o = n[Jb];
      t.location.href = o;
    }, 10), !0;
  }
  return !1;
}
class Uo {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new a0();
    else
      throw new wp("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new za(e.sessionOptions) : this.store = new za() : e ? this.store = new Ka(e.sessionOptions) : this.store = new Ka();
  }
  makeAuthRequestToken(e, n, r, s, o, i = mp().getTime(), a = {}) {
    const f = this.appConfig;
    if (!f)
      throw new So("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || f.redirectURI(), r = r || f.manifestURI(), s = s || f.scopes, o = o || f.appDomain, V2(e, n, r, s, o, i, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = G2();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = hi("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (Qb())
        return Bn.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Bn.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = Fp()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Pr("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const o = mt.decodeToken(e).payload;
    if (typeof o == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await W2(e))
      throw new Pr("Invalid authentication response.");
    let a = o.private_key, f = o.core_token;
    if (Js(o.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (o.private_key !== void 0 && o.private_key !== null)
          try {
            a = await Ga(s, o.private_key);
          } catch {
            if (Bn.warn("Failed decryption of appPrivateKey, will try to use as given"), !at.isValidPrivateKey(o.private_key))
              throw new Pr("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (f != null)
          try {
            f = await Ga(s, f);
          } catch {
            Bn.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Pr("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = kp, h;
    Js(o.version, "1.2.0") && o.hubUrl !== null && o.hubUrl !== void 0 && (u = o.hubUrl), Js(o.version, "1.3.0") && o.associationToken !== null && o.associationToken !== void 0 && (h = o.associationToken);
    const c = {
      profile: o.profile,
      email: o.email,
      decentralizedID: o.iss,
      identityAddress: P0(o.iss),
      appPrivateKey: a,
      coreSessionToken: f,
      authResponseToken: e,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: o.appPrivateKeyFromWalletSalt,
      coreNode: o.blockstackAPIUrl,
      gaiaAssociationToken: h
    }, p = o.profile_url;
    if (!c.profile && p) {
      const d = await n(p);
      if (!d.ok)
        c.profile = Object.assign({}, bp);
      else {
        const x = await d.text(), w = JSON.parse(x);
        c.profile = Xb(w[0].token);
      }
    } else
      c.profile = o.profile;
    return r.userData = c, this.store.setSessionData(r), c;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new So("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), l2(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), h2(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
Uo.prototype.makeAuthRequest = Uo.prototype.makeAuthRequestToken;
const tg = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), W0 = "STX_PROVIDER", X0 = () => typeof window > "u" ? null : window.localStorage.getItem(W0), eg = (t) => {
  typeof window < "u" && window.localStorage.setItem(W0, t);
}, ng = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function rg(t, e) {
  const n = {};
  return Object.assign(n, ng, e), await fetch(t, n);
}
function sg(t) {
  let e = rg, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function og(...t) {
  const { fetchLib: e, middlewares: n } = sg(t);
  return async (s, o) => {
    let i = { url: s, init: o ?? {} };
    for (const f of n)
      typeof f.pre == "function" && (i = await Promise.resolve(f.pre({
        fetch: e,
        ...i
      })) ?? i);
    let a = await e(i.url, i.init);
    for (const f of n)
      typeof f.post == "function" && (a = await Promise.resolve(f.post({
        fetch: e,
        url: i.url,
        init: i.init,
        response: (a == null ? void 0 : a.clone()) ?? a
      })) ?? a);
    return a;
  };
}
var Nn;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Nn || (Nn = {}));
var nn;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(nn || (nn = {}));
var cc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(cc || (cc = {}));
const ig = "https://api.mainnet.hiro.so", ag = "https://api.testnet.hiro.so", cg = "http://localhost:3999", fg = ["mainnet", "testnet", "devnet", "mocknet"];
class rn {
  constructor(e) {
    this.version = nn.Mainnet, this.chainId = Nn.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === nn.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? og();
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
rn.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Oo();
    case "testnet":
      return new Co();
    case "devnet":
      return new lg();
    case "mocknet":
      return new Y0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${fg.join(", ")}`);
  }
};
rn.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : rn.fromName(t);
class Oo extends rn {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? ig,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = nn.Mainnet, this.chainId = Nn.Mainnet;
  }
}
class Co extends rn {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? ag,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = nn.Testnet, this.chainId = Nn.Testnet;
  }
}
class Y0 extends rn {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? cg,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = nn.Testnet, this.chainId = Nn.Testnet;
  }
}
const lg = Y0;
var ko;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(ko || (ko = {}));
var fc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(fc || (fc = {}));
ko.Mainnet;
var ds;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ds || (ds = {}));
var lc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(lc || (lc = {}));
ds.Mainnet;
const hg = 128, ug = 128, J0 = 16;
var hc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(hc || (hc = {}));
var uc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(uc || (uc = {}));
var kt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(kt || (kt = {}));
const ro = ["onChainOnly", "offChainOnly", "any"];
ro[0] + "", kt.OnChainOnly, ro[1] + "", kt.OffChainOnly, ro[2] + "", kt.Any, kt.OnChainOnly + "", kt.OnChainOnly, kt.OffChainOnly + "", kt.OffChainOnly, kt.Any + "", kt.Any;
var dc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(dc || (dc = {}));
var pc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(pc || (pc = {}));
var bc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(bc || (bc = {}));
var gc;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(gc || (gc = {}));
var xc;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(xc || (xc = {}));
var wc;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(wc || (wc = {}));
var yc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(yc || (yc = {}));
var mc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(mc || (mc = {}));
var Sc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Sc || (Sc = {}));
var Ec;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ec || (Ec = {}));
var Ac;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Ac || (Ac = {}));
var vc;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(vc || (vc = {}));
var Bc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Bc || (Bc = {}));
let dg = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, pg = class extends dg {
  constructor(e) {
    super(e);
  }
};
function Po(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function bg(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Z0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function gg(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Po(t.outputLen), Po(t.blockLen);
}
function xg(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function wg(t, e) {
  Z0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const so = {
  number: Po,
  bool: bg,
  bytes: Z0,
  hash: gg,
  exists: xg,
  output: wg
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const oo = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Gt = (t, e) => t << 32 - e | t >>> e, yg = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!yg)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function mg(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Q0(t) {
  if (typeof t == "string" && (t = mg(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Sg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function fn(t) {
  const e = (r) => t().update(Q0(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Eg(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, i, r), t.setUint32(e + u, a, r);
}
let Ai = class extends Sg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = oo(this.buffer);
  }
  update(e) {
    so.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Q0(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const f = oo(e);
        for (; s <= o - i; i += s)
          this.process(f, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    so.exists(this), so.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let c = i; c < s; c++)
      n[c] = 0;
    Eg(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = oo(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = f / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let c = 0; c < u; c++)
      a.setUint32(4 * c, h[c], o);
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
const Ag = (t, e, n) => t & e ^ ~t & n, vg = (t, e, n) => t & e ^ t & n ^ e & n, Bg = new Uint32Array([
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
let tl = class extends Ai {
  constructor() {
    super(64, 32, 8, !1), this.A = ve[0] | 0, this.B = ve[1] | 0, this.C = ve[2] | 0, this.D = ve[3] | 0, this.E = ve[4] | 0, this.F = ve[5] | 0, this.G = ve[6] | 0, this.H = ve[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: a, H: f } = this;
    return [e, n, r, s, o, i, a, f];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, f) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = f | 0;
  }
  process(e, n) {
    for (let c = 0; c < 16; c++, n += 4)
      Be[c] = e.getUint32(n, !1);
    for (let c = 16; c < 64; c++) {
      const p = Be[c - 15], d = Be[c - 2], x = Gt(p, 7) ^ Gt(p, 18) ^ p >>> 3, w = Gt(d, 17) ^ Gt(d, 19) ^ d >>> 10;
      Be[c] = w + Be[c - 7] + x + Be[c - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: f, G: u, H: h } = this;
    for (let c = 0; c < 64; c++) {
      const p = Gt(a, 6) ^ Gt(a, 11) ^ Gt(a, 25), d = h + p + Ag(a, f, u) + Bg[c] + Be[c] | 0, w = (Gt(r, 2) ^ Gt(r, 13) ^ Gt(r, 22)) + vg(r, s, o) | 0;
      h = u, u = f, f = a, a = i + d | 0, i = o, o = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, f, u, h);
  }
  roundClean() {
    Be.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, $g = class extends tl {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
fn(() => new tl());
fn(() => new $g());
const _g = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), el = Uint8Array.from({ length: 16 }, (t, e) => e), Hg = el.map((t) => (9 * t + 5) % 16);
let vi = [el], Bi = [Hg];
for (let t = 0; t < 4; t++)
  for (let e of [vi, Bi])
    e.push(e[t].map((n) => _g[n]));
const nl = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Lg = vi.map((t, e) => t.map((n) => nl[e][n])), Ig = Bi.map((t, e) => t.map((n) => nl[e][n])), Ug = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Og = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Kr = (t, e) => t << e | t >>> 32 - e;
function $c(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const zr = new Uint32Array(16);
let Cg = class extends Ai {
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
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, f = a, u = this.h3 | 0, h = u, c = this.h4 | 0, p = c;
    for (let d = 0; d < 5; d++) {
      const x = 4 - d, w = Ug[d], v = Og[d], L = vi[d], O = Bi[d], g = Lg[d], $ = Ig[d];
      for (let A = 0; A < 16; A++) {
        const P = Kr(r + $c(d, o, a, u) + zr[L[A]] + w, g[A]) + c | 0;
        r = c, c = u, u = Kr(a, 10) | 0, a = o, o = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = Kr(s + $c(x, i, f, h) + zr[O[A]] + v, $[A]) + p | 0;
        s = p, p = h, h = Kr(f, 10) | 0, f = i, i = P;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + p | 0, this.h3 + c + s | 0, this.h4 + r + i | 0, this.h0 + o + f | 0);
  }
  roundClean() {
    zr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
fn(() => new Cg());
const jr = BigInt(2 ** 32 - 1), No = BigInt(32);
function rl(t, e = !1) {
  return e ? { h: Number(t & jr), l: Number(t >> No & jr) } : { h: Number(t >> No & jr) | 0, l: Number(t & jr) | 0 };
}
function kg(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = rl(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const Pg = (t, e) => BigInt(t >>> 0) << No | BigInt(e >>> 0), Ng = (t, e, n) => t >>> n, Dg = (t, e, n) => t << 32 - n | e >>> n, Tg = (t, e, n) => t >>> n | e << 32 - n, Fg = (t, e, n) => t << 32 - n | e >>> n, Mg = (t, e, n) => t << 64 - n | e >>> n - 32, Rg = (t, e, n) => t >>> n - 32 | e << 64 - n, Gg = (t, e) => e, Vg = (t, e) => t, Kg = (t, e, n) => t << n | e >>> 32 - n, zg = (t, e, n) => e << n | t >>> 32 - n, jg = (t, e, n) => e << n - 32 | t >>> 64 - n, qg = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Wg(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Xg = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Yg = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Jg = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Zg = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Qg = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), tx = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, K = {
  fromBig: rl,
  split: kg,
  toBig: Pg,
  shrSH: Ng,
  shrSL: Dg,
  rotrSH: Tg,
  rotrSL: Fg,
  rotrBH: Mg,
  rotrBL: Rg,
  rotr32H: Gg,
  rotr32L: Vg,
  rotlSH: Kg,
  rotlSL: zg,
  rotlBH: jg,
  rotlBL: qg,
  add: Wg,
  add3L: Xg,
  add3H: Yg,
  add4L: Jg,
  add4H: Zg,
  add5H: tx,
  add5L: Qg
}, [ex, nx] = K.split([
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
let Us = class extends Ai {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: f, Eh: u, El: h, Fh: c, Fl: p, Gh: d, Gl: x, Hh: w, Hl: v } = this;
    return [e, n, r, s, o, i, a, f, u, h, c, p, d, x, w, v];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, f, u, h, c, p, d, x, w, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = f | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = c | 0, this.Fl = p | 0, this.Gh = d | 0, this.Gl = x | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let g = 0; g < 16; g++, n += 4)
      $e[g] = e.getUint32(n), _e[g] = e.getUint32(n += 4);
    for (let g = 16; g < 80; g++) {
      const $ = $e[g - 15] | 0, A = _e[g - 15] | 0, P = K.rotrSH($, A, 1) ^ K.rotrSH($, A, 8) ^ K.shrSH($, A, 7), T = K.rotrSL($, A, 1) ^ K.rotrSL($, A, 8) ^ K.shrSL($, A, 7), C = $e[g - 2] | 0, I = _e[g - 2] | 0, b = K.rotrSH(C, I, 19) ^ K.rotrBH(C, I, 61) ^ K.shrSH(C, I, 6), E = K.rotrSL(C, I, 19) ^ K.rotrBL(C, I, 61) ^ K.shrSL(C, I, 6), H = K.add4L(T, E, _e[g - 7], _e[g - 16]), k = K.add4H(H, P, b, $e[g - 7], $e[g - 16]);
      $e[g] = k | 0, _e[g] = H | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: f, Dh: u, Dl: h, Eh: c, El: p, Fh: d, Fl: x, Gh: w, Gl: v, Hh: L, Hl: O } = this;
    for (let g = 0; g < 80; g++) {
      const $ = K.rotrSH(c, p, 14) ^ K.rotrSH(c, p, 18) ^ K.rotrBH(c, p, 41), A = K.rotrSL(c, p, 14) ^ K.rotrSL(c, p, 18) ^ K.rotrBL(c, p, 41), P = c & d ^ ~c & w, T = p & x ^ ~p & v, C = K.add5L(O, A, T, nx[g], _e[g]), I = K.add5H(C, L, $, P, ex[g], $e[g]), b = C | 0, E = K.rotrSH(r, s, 28) ^ K.rotrBH(r, s, 34) ^ K.rotrBH(r, s, 39), H = K.rotrSL(r, s, 28) ^ K.rotrBL(r, s, 34) ^ K.rotrBL(r, s, 39), k = r & o ^ r & a ^ o & a, M = s & i ^ s & f ^ i & f;
      L = w | 0, O = v | 0, w = d | 0, v = x | 0, d = c | 0, x = p | 0, { h: c, l: p } = K.add(u | 0, h | 0, I | 0, b | 0), u = a | 0, h = f | 0, a = o | 0, f = i | 0, o = r | 0, i = s | 0;
      const N = K.add3L(b, H, M);
      r = K.add3H(N, I, E, k), s = N | 0;
    }
    ({ h: r, l: s } = K.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = K.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: f } = K.add(this.Ch | 0, this.Cl | 0, a | 0, f | 0), { h: u, l: h } = K.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: c, l: p } = K.add(this.Eh | 0, this.El | 0, c | 0, p | 0), { h: d, l: x } = K.add(this.Fh | 0, this.Fl | 0, d | 0, x | 0), { h: w, l: v } = K.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: L, l: O } = K.add(this.Hh | 0, this.Hl | 0, L | 0, O | 0), this.set(r, s, o, i, a, f, u, h, c, p, d, x, w, v, L, O);
  }
  roundClean() {
    $e.fill(0), _e.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, rx = class extends Us {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, sx = class extends Us {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, ox = class extends Us {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
fn(() => new Us());
fn(() => new rx());
fn(() => new sx());
fn(() => new ox());
var ct;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(ct || (ct = {}));
var Do;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Do || (Do = {}));
function $i(t) {
  return Do[t];
}
var ps;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ps || (ps = {}));
function sl(t, e, n) {
  const s = hg;
  if (wx(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ps.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
function ol(t) {
  const e = Mn.c32addressDecode(t);
  return {
    type: ps.Address,
    version: e[0],
    hash160: e[1]
  };
}
function il(t) {
  const e = [];
  return e.push($t(ui(t.version, 1))), e.push($t(t.hash160)), Vn(e);
}
function al(t) {
  const e = [], n = hr(t.content), r = n.byteLength;
  return e.push($t(ui(r, t.lengthPrefixBytes))), e.push(n), Vn(e);
}
function Yt(t, e) {
  return Vn([$i(t), e]);
}
function ix(t) {
  return new Uint8Array([$i(t.type)]);
}
function ax(t) {
  return t.type === ct.OptionalNone ? new Uint8Array([$i(t.type)]) : Yt(t.type, dr(t.value));
}
function cx(t) {
  const e = new Uint8Array(4);
  return As(e, Math.ceil(t.value.length / 2), 0), Yt(t.type, ie(e, $t(t.value)));
}
function fx(t) {
  const e = o0($p(BigInt(t.value), BigInt(ug)), J0);
  return Yt(t.type, e);
}
function lx(t) {
  const e = o0(BigInt(t.value), J0);
  return Yt(t.type, e);
}
function hx(t) {
  return Yt(t.type, il(ol(t.value)));
}
function ux(t) {
  const [e, n] = yx(t.value);
  return Yt(t.type, ie(il(ol(e)), al(sl(n))));
}
function dx(t) {
  return Yt(t.type, dr(t.value));
}
function px(t) {
  const e = [], n = new Uint8Array(4);
  As(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = dr(r);
    e.push(s);
  }
  return Yt(t.type, Vn(e));
}
function bx(t) {
  const e = [], n = new Uint8Array(4);
  As(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = sl(s);
    e.push(al(o));
    const i = dr(t.value[s]);
    e.push(i);
  }
  return Yt(t.type, Vn(e));
}
function cl(t, e) {
  const n = [], r = e == "ascii" ? Hp(t.value) : hr(t.value), s = new Uint8Array(4);
  return As(s, r.length, 0), n.push(s), n.push(r), Yt(t.type, Vn(n));
}
function gx(t) {
  return cl(t, "ascii");
}
function xx(t) {
  return cl(t, "utf8");
}
function _c(t) {
  return It(dr(t));
}
function dr(t) {
  switch (t.type) {
    case ct.BoolTrue:
    case ct.BoolFalse:
      return ix(t);
    case ct.OptionalNone:
    case ct.OptionalSome:
      return ax(t);
    case ct.Buffer:
      return cx(t);
    case ct.UInt:
      return lx(t);
    case ct.Int:
      return fx(t);
    case ct.PrincipalStandard:
      return hx(t);
    case ct.PrincipalContract:
      return ux(t);
    case ct.ResponseOk:
    case ct.ResponseErr:
      return dx(t);
    case ct.List:
      return px(t);
    case ct.Tuple:
      return bx(t);
    case ct.StringASCII:
      return gx(t);
    case ct.StringUTF8:
      return xx(t);
    default:
      throw new pg("Unable to serialize. Invalid Clarity Value.");
  }
}
const wx = (t, e) => t ? hr(t).length > e : !1;
function yx(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
function mx(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = or(r);
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
    return BigInt(`0x${Ax(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function _i(t, e = 8) {
  return (typeof t == "bigint" ? t : mx(t)).toString(16).padStart(e * 2, "0");
}
function fl(t, e = 16) {
  const n = _i(t, e);
  return or(n);
}
function Sx(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const Ex = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ax(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Ex[n];
  return e;
}
function or(t) {
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
function Hi(t) {
  return new TextEncoder().encode(t);
}
function vx(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Bx(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Hc(t) {
  if (t.some(Bx))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Li(...t) {
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
  return Li(...t.map((e) => typeof e == "number" ? Hc([e]) : e instanceof Array ? Hc(e) : e));
}
function Os(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var To;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(To || (To = {}));
To.Mainnet;
const $x = 128, _x = 128, ll = 16;
var Fo;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Fo || (Fo = {}));
var Lc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Lc || (Lc = {}));
var Ic;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Ic || (Ic = {}));
var Pt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Pt || (Pt = {}));
const io = ["onChainOnly", "offChainOnly", "any"];
io[0] + "", Pt.OnChainOnly, io[1] + "", Pt.OffChainOnly, io[2] + "", Pt.Any, Pt.OnChainOnly + "", Pt.OnChainOnly, Pt.OffChainOnly + "", Pt.OffChainOnly, Pt.Any + "", Pt.Any;
var Mo;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Mo || (Mo = {}));
Mo.Mainnet;
var Uc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Uc || (Uc = {}));
var Oc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Oc || (Oc = {}));
var Cc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Cc || (Cc = {}));
var kc;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(kc || (kc = {}));
var Pc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Pc || (Pc = {}));
var Nc;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Nc || (Nc = {}));
var Dc;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Dc || (Dc = {}));
var Tc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Tc || (Tc = {}));
var Fc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Fc || (Fc = {}));
var Mc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Mc || (Mc = {}));
var Rc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Rc || (Rc = {}));
function Ro(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Hx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function hl(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Lx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ro(t.outputLen), Ro(t.blockLen);
}
function Ix(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Ux(t, e) {
  hl(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ao = {
  number: Ro,
  bool: Hx,
  bytes: hl,
  hash: Lx,
  exists: Ix,
  output: Ux
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const co = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Vt = (t, e) => t << 32 - e | t >>> e, Ox = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Ox)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Cx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function ul(t) {
  if (typeof t == "string" && (t = Cx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class kx {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function ln(t) {
  const e = (r) => t().update(ul(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Px(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, i, r), t.setUint32(e + u, a, r);
}
class Ii extends kx {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = co(this.buffer);
  }
  update(e) {
    ao.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = ul(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const f = co(e);
        for (; s <= o - i; i += s)
          this.process(f, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ao.exists(this), ao.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let c = i; c < s; c++)
      n[c] = 0;
    Px(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = co(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = f / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let c = 0; c < u; c++)
      a.setUint32(4 * c, h[c], o);
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
const Nx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), dl = Uint8Array.from({ length: 16 }, (t, e) => e), Dx = dl.map((t) => (9 * t + 5) % 16);
let Ui = [dl], Oi = [Dx];
for (let t = 0; t < 4; t++)
  for (let e of [Ui, Oi])
    e.push(e[t].map((n) => Nx[n]));
const pl = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Tx = Ui.map((t, e) => t.map((n) => pl[e][n])), Fx = Oi.map((t, e) => t.map((n) => pl[e][n])), Mx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Rx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), qr = (t, e) => t << e | t >>> 32 - e;
function Gc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Wr = new Uint32Array(16);
class Gx extends Ii {
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
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, f = a, u = this.h3 | 0, h = u, c = this.h4 | 0, p = c;
    for (let d = 0; d < 5; d++) {
      const x = 4 - d, w = Mx[d], v = Rx[d], L = Ui[d], O = Oi[d], g = Tx[d], $ = Fx[d];
      for (let A = 0; A < 16; A++) {
        const P = qr(r + Gc(d, o, a, u) + Wr[L[A]] + w, g[A]) + c | 0;
        r = c, c = u, u = qr(a, 10) | 0, a = o, o = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = qr(s + Gc(x, i, f, h) + Wr[O[A]] + v, $[A]) + p | 0;
        s = p, p = h, h = qr(f, 10) | 0, f = i, i = P;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + p | 0, this.h3 + c + s | 0, this.h4 + r + i | 0, this.h0 + o + f | 0);
  }
  roundClean() {
    Wr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
ln(() => new Gx());
const Vx = (t, e, n) => t & e ^ ~t & n, Kx = (t, e, n) => t & e ^ t & n ^ e & n, zx = new Uint32Array([
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
]), He = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Le = new Uint32Array(64);
class bl extends Ii {
  constructor() {
    super(64, 32, 8, !1), this.A = He[0] | 0, this.B = He[1] | 0, this.C = He[2] | 0, this.D = He[3] | 0, this.E = He[4] | 0, this.F = He[5] | 0, this.G = He[6] | 0, this.H = He[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: a, H: f } = this;
    return [e, n, r, s, o, i, a, f];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, f) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = f | 0;
  }
  process(e, n) {
    for (let c = 0; c < 16; c++, n += 4)
      Le[c] = e.getUint32(n, !1);
    for (let c = 16; c < 64; c++) {
      const p = Le[c - 15], d = Le[c - 2], x = Vt(p, 7) ^ Vt(p, 18) ^ p >>> 3, w = Vt(d, 17) ^ Vt(d, 19) ^ d >>> 10;
      Le[c] = w + Le[c - 7] + x + Le[c - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: f, G: u, H: h } = this;
    for (let c = 0; c < 64; c++) {
      const p = Vt(a, 6) ^ Vt(a, 11) ^ Vt(a, 25), d = h + p + Vx(a, f, u) + zx[c] + Le[c] | 0, w = (Vt(r, 2) ^ Vt(r, 13) ^ Vt(r, 22)) + Kx(r, s, o) | 0;
      h = u, u = f, f = a, a = i + d | 0, i = o, o = s, s = r, r = d + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, f, u, h);
  }
  roundClean() {
    Le.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class jx extends bl {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
ln(() => new bl());
ln(() => new jx());
const Xr = BigInt(2 ** 32 - 1), Go = BigInt(32);
function gl(t, e = !1) {
  return e ? { h: Number(t & Xr), l: Number(t >> Go & Xr) } : { h: Number(t >> Go & Xr) | 0, l: Number(t & Xr) | 0 };
}
function qx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = gl(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const Wx = (t, e) => BigInt(t >>> 0) << Go | BigInt(e >>> 0), Xx = (t, e, n) => t >>> n, Yx = (t, e, n) => t << 32 - n | e >>> n, Jx = (t, e, n) => t >>> n | e << 32 - n, Zx = (t, e, n) => t << 32 - n | e >>> n, Qx = (t, e, n) => t << 64 - n | e >>> n - 32, tw = (t, e, n) => t >>> n - 32 | e << 64 - n, ew = (t, e) => e, nw = (t, e) => t, rw = (t, e, n) => t << n | e >>> 32 - n, sw = (t, e, n) => e << n | t >>> 32 - n, ow = (t, e, n) => e << n - 32 | t >>> 64 - n, iw = (t, e, n) => t << n - 32 | e >>> 64 - n;
function aw(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const cw = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), fw = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, lw = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), hw = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, uw = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), dw = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, z = {
  fromBig: gl,
  split: qx,
  toBig: Wx,
  shrSH: Xx,
  shrSL: Yx,
  rotrSH: Jx,
  rotrSL: Zx,
  rotrBH: Qx,
  rotrBL: tw,
  rotr32H: ew,
  rotr32L: nw,
  rotlSH: rw,
  rotlSL: sw,
  rotlBH: ow,
  rotlBL: iw,
  add: aw,
  add3L: cw,
  add3H: fw,
  add4L: lw,
  add4H: hw,
  add5H: dw,
  add5L: uw
}, [pw, bw] = z.split([
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
].map((t) => BigInt(t))), Ie = new Uint32Array(80), Ue = new Uint32Array(80);
class Cs extends Ii {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: f, Eh: u, El: h, Fh: c, Fl: p, Gh: d, Gl: x, Hh: w, Hl: v } = this;
    return [e, n, r, s, o, i, a, f, u, h, c, p, d, x, w, v];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, f, u, h, c, p, d, x, w, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = f | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = c | 0, this.Fl = p | 0, this.Gh = d | 0, this.Gl = x | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let g = 0; g < 16; g++, n += 4)
      Ie[g] = e.getUint32(n), Ue[g] = e.getUint32(n += 4);
    for (let g = 16; g < 80; g++) {
      const $ = Ie[g - 15] | 0, A = Ue[g - 15] | 0, P = z.rotrSH($, A, 1) ^ z.rotrSH($, A, 8) ^ z.shrSH($, A, 7), T = z.rotrSL($, A, 1) ^ z.rotrSL($, A, 8) ^ z.shrSL($, A, 7), C = Ie[g - 2] | 0, I = Ue[g - 2] | 0, b = z.rotrSH(C, I, 19) ^ z.rotrBH(C, I, 61) ^ z.shrSH(C, I, 6), E = z.rotrSL(C, I, 19) ^ z.rotrBL(C, I, 61) ^ z.shrSL(C, I, 6), H = z.add4L(T, E, Ue[g - 7], Ue[g - 16]), k = z.add4H(H, P, b, Ie[g - 7], Ie[g - 16]);
      Ie[g] = k | 0, Ue[g] = H | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: f, Dh: u, Dl: h, Eh: c, El: p, Fh: d, Fl: x, Gh: w, Gl: v, Hh: L, Hl: O } = this;
    for (let g = 0; g < 80; g++) {
      const $ = z.rotrSH(c, p, 14) ^ z.rotrSH(c, p, 18) ^ z.rotrBH(c, p, 41), A = z.rotrSL(c, p, 14) ^ z.rotrSL(c, p, 18) ^ z.rotrBL(c, p, 41), P = c & d ^ ~c & w, T = p & x ^ ~p & v, C = z.add5L(O, A, T, bw[g], Ue[g]), I = z.add5H(C, L, $, P, pw[g], Ie[g]), b = C | 0, E = z.rotrSH(r, s, 28) ^ z.rotrBH(r, s, 34) ^ z.rotrBH(r, s, 39), H = z.rotrSL(r, s, 28) ^ z.rotrBL(r, s, 34) ^ z.rotrBL(r, s, 39), k = r & o ^ r & a ^ o & a, M = s & i ^ s & f ^ i & f;
      L = w | 0, O = v | 0, w = d | 0, v = x | 0, d = c | 0, x = p | 0, { h: c, l: p } = z.add(u | 0, h | 0, I | 0, b | 0), u = a | 0, h = f | 0, a = o | 0, f = i | 0, o = r | 0, i = s | 0;
      const N = z.add3L(b, H, M);
      r = z.add3H(N, I, E, k), s = N | 0;
    }
    ({ h: r, l: s } = z.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = z.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: f } = z.add(this.Ch | 0, this.Cl | 0, a | 0, f | 0), { h: u, l: h } = z.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: c, l: p } = z.add(this.Eh | 0, this.El | 0, c | 0, p | 0), { h: d, l: x } = z.add(this.Fh | 0, this.Fl | 0, d | 0, x | 0), { h: w, l: v } = z.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: L, l: O } = z.add(this.Hh | 0, this.Hl | 0, L | 0, O | 0), this.set(r, s, o, i, a, f, u, h, c, p, d, x, w, v, L, O);
  }
  roundClean() {
    Ie.fill(0), Ue.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class gw extends Cs {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class xw extends Cs {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class ww extends Cs {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
ln(() => new Cs());
ln(() => new gw());
ln(() => new xw());
ln(() => new ww());
function yw(t, e, n) {
  const s = $x;
  if (kw(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Fo.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var ft;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(ft || (ft = {}));
class mw extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Sw extends mw {
  constructor(e) {
    super(e);
  }
}
function xl(t) {
  const e = [];
  return e.push(or(_i(t.version, 1))), e.push(or(t.hash160)), Kn(e);
}
function wl(t) {
  const e = [], n = Hi(t.content), r = n.byteLength;
  return e.push(or(_i(r, t.lengthPrefixBytes))), e.push(n), Kn(e);
}
function Jt(t, e) {
  return Kn([t, e]);
}
function Ew(t) {
  return new Uint8Array([t.type]);
}
function Aw(t) {
  return t.type === ft.OptionalNone ? new Uint8Array([t.type]) : Jt(t.type, Dn(t.value));
}
function vw(t) {
  const e = new Uint8Array(4);
  return Os(e, t.buffer.length, 0), Jt(t.type, Li(e, t.buffer));
}
function Bw(t) {
  const e = fl(Sx(t.value, BigInt(_x)), ll);
  return Jt(t.type, e);
}
function $w(t) {
  const e = fl(t.value, ll);
  return Jt(t.type, e);
}
function _w(t) {
  return Jt(t.type, xl(t.address));
}
function Hw(t) {
  return Jt(t.type, Li(xl(t.address), wl(t.contractName)));
}
function Lw(t) {
  return Jt(t.type, Dn(t.value));
}
function Iw(t) {
  const e = [], n = new Uint8Array(4);
  Os(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Dn(r);
    e.push(s);
  }
  return Jt(t.type, Kn(e));
}
function Uw(t) {
  const e = [], n = new Uint8Array(4);
  Os(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = yw(s);
    e.push(wl(o));
    const i = Dn(t.data[s]);
    e.push(i);
  }
  return Jt(t.type, Kn(e));
}
function yl(t, e) {
  const n = [], r = e == "ascii" ? vx(t.data) : Hi(t.data), s = new Uint8Array(4);
  return Os(s, r.length, 0), n.push(s), n.push(r), Jt(t.type, Kn(n));
}
function Ow(t) {
  return yl(t, "ascii");
}
function Cw(t) {
  return yl(t, "utf8");
}
function Dn(t) {
  switch (t.type) {
    case ft.BoolTrue:
    case ft.BoolFalse:
      return Ew(t);
    case ft.OptionalNone:
    case ft.OptionalSome:
      return Aw(t);
    case ft.Buffer:
      return vw(t);
    case ft.UInt:
      return $w(t);
    case ft.Int:
      return Bw(t);
    case ft.PrincipalStandard:
      return _w(t);
    case ft.PrincipalContract:
      return Hw(t);
    case ft.ResponseOk:
    case ft.ResponseErr:
      return Lw(t);
    case ft.List:
      return Iw(t);
    case ft.Tuple:
      return Uw(t);
    case ft.StringASCII:
      return Ow(t);
    case ft.StringUTF8:
      return Cw(t);
    default:
      throw new Sw("Unable to serialize. Invalid Clarity Value.");
  }
}
const kw = (t, e) => t ? Hi(t).length > e : !1;
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var Pw = Object.defineProperty, Nw = Object.defineProperties, Dw = Object.getOwnPropertyDescriptors, bs = Object.getOwnPropertySymbols, ml = Object.prototype.hasOwnProperty, Sl = Object.prototype.propertyIsEnumerable, Vc = (t, e, n) => e in t ? Pw(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Vo = (t, e) => {
  for (var n in e || (e = {})) ml.call(e, n) && Vc(t, n, e[n]);
  if (bs) for (var n of bs(e)) Sl.call(e, n) && Vc(t, n, e[n]);
  return t;
}, Ko = (t, e) => Nw(t, Dw(e)), Tw = (t, e) => {
  var n = {};
  for (var r in t) ml.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && bs) for (var r of bs(t)) e.indexOf(r) < 0 && Sl.call(t, r) && (n[r] = t[r]);
  return n;
};
function Fw(t) {
  return t ? typeof t == "string" ? rn.fromName(t) : "version" in t ? t : "url" in t ? new Oo({ url: t.url }) : t.transactionVersion === ds.Mainnet ? new Oo({ url: t.client.baseUrl }) : new Co({ url: t.client.baseUrl }) : new Co();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var Mw = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(Mw || {}), Rw = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(Rw || {}), El = (t) => {
  let e = t;
  if (!e) {
    let n = new a0(["store_write"], document.location.href);
    e = new Uo({ appConfig: n });
  }
  return e;
};
function Gw(t) {
  try {
    return El(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Vw = (t) => {
  let e = El(t).loadUserData().appPrivateKey, n = mt.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function Al(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? Ko(Vo({}, t), { message: _c(e), domain: _c(n) }) : Ko(Vo({}, t), { message: It(Dn(e)), domain: It(Dn(n)) });
}
async function Kw(t, e) {
  return new mt.TokenSigner("ES256k", e).signAsync(Al(t));
}
async function zw(t) {
  let e = t, { userSession: n } = e, r = Tw(e, ["userSession"]);
  if (Gw(n)) {
    let { privateKey: s, publicKey: o } = Vw(n), i = Ko(Vo({}, r), { publicKey: o });
    return Kw(i, s);
  }
  return mt.createUnsecuredToken(Al(t));
}
var jw = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(jw || {}), vl = "asigna-stx", Kc = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === vl && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(Ww(t, e), "*");
}), qw = { authenticationRequest: async (t) => Kc(t, "authenticationRequest"), transactionRequest: async (t) => Kc(t, "transactionRequest") }, Ww = (t, e) => ({ source: vl, [e]: t }), Xw = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = qw);
};
Xw();
const Yw = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], Ci = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), ks = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, tr = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, Jw = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Bl = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((o) => Jw(o, r)) === s
  );
}, Zw = (t) => t ? Bl(ks()).some(
  (e) => {
    var n;
    return e.id === t && (Ci(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Qw = () => {
  if (typeof window > "u")
    return;
  const t = ks(), e = Bl(t).filter(
    (n) => {
      var r;
      return Ci(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = tr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of Yw) {
    const r = tr(t, n) ?? (t === window ? void 0 : tr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, ty = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = ks(), n = tr(e, t) ?? (e === window ? void 0 : tr(window, t)) ?? tg(t);
  if (n)
    return n;
  if (Ci(t) || Zw(t))
    return Qw();
}, ey = ["blockstack-session", "blockstack"], ny = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of ey) {
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
ny();
const ry = () => X0(), sy = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = X0(), e = t ? ty(t) : void 0;
  if (e)
    return e;
  const n = ks() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, zc = (t) => n0(t).replace(/^0x/, ""), jc = "This wallet cannot sign messages. Try Xverse or Leather.", qc = (t) => typeof (t == null ? void 0 : t.request) == "function", Wc = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", oy = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, iy = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function ay(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: zc(e.message),
    domain: zc(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function cy(t, e) {
  const n = await zw({
    domain: e.domain,
    message: e.message,
    network: Fw(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function fy(t) {
  var s, o;
  const e = ry() || "", n = /xverse/i.test(e);
  let r = sy();
  if (n && !Wc(r)) {
    const i = window;
    r = ((s = i.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((o = i.xverseProviders) == null ? void 0 : o.StacksProvider);
  }
  if (Wc(r))
    try {
      return await cy(r, t);
    } catch (i) {
      if (n || !qc(r) || !iy(i)) throw i;
    }
  if (!n && qc(r))
    try {
      return await ay(r, t);
    } catch (i) {
      throw oy(i) ? new Error(jc) : i;
    }
  throw new Error(jc);
}
function ly(t, e, n = {}) {
  const r = n.retryAfterMs ?? 3e4, s = n.now ?? Date.now, o = /* @__PURE__ */ new Map(), i = (a, f) => {
    f.pending = !0, f.failedAt = void 0, Promise.resolve().then(() => t(a)).then((u) => {
      f.pending = !1, u && (f.name = u, e());
    }).catch(() => {
      f.pending = !1, f.failedAt = s();
    });
  };
  return {
    get(a) {
      if (!a) return null;
      let f = o.get(a);
      return f ? !f.pending && f.name === null && f.failedAt !== void 0 && s() - f.failedAt >= r && i(a, f) : (f = { name: null, pending: !1 }, o.set(a, f), i(a, f)), f.name;
    }
  };
}
const hy = {}, uy = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, dy = (t) => {
  const e = hy;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, py = (t) => `/hiro/${t}`, by = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, gy = (t) => {
  const e = dy(t);
  if (e)
    return [by(e)];
  const n = uy[t];
  return typeof window < "u" ? [`${window.location.origin}${py(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, xy = {}, Xc = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, wy = "xtrata.log.enabled", yy = "xtrata.log.level", my = "xtrata.log.tags", Sy = "xtrata.log.dedupe", Yr = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, Ey = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, Ay = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, vy = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, By = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, $y = () => {
  const t = xy ?? {}, e = Yr(wy) ?? t.VITE_LOG_ENABLED, n = Yr(yy) ?? t.VITE_LOG_LEVEL, r = Yr(my) ?? t.VITE_LOG_TAGS, s = Yr(Sy) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: Ey(e),
    level: Ay(n) ?? "warn",
    tags: By(r),
    dedupe: vy(s)
  };
}, _y = (t, e, n) => !t.enabled || Xc[n] < Xc[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), Hy = (t, e, n, r) => {
  const s = $y();
  if (!_y(s, e, t) || Iy(s.dedupe))
    return;
  const o = `[xtrata:${e}] ${n}`, i = console[t] ?? console.log;
  r !== void 0 ? i(o, r) : i(o);
}, Ly = /* @__PURE__ */ new Set();
let Yc = null;
const Iy = (t, e, n, r, s) => (Yc !== t && (Ly.clear(), Yc = t), !1), Uy = (t, e, n) => Hy("debug", t, e, n), Oy = {}, Cy = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, ky = (t) => {
  const e = Oy, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : Cy[t];
}, Py = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, Ny = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return Py.test(n) ? n : null;
}, Dy = (t) => t.replace(/\/+$/, ""), Ty = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), Jc = (t) => {
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
}, En = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, Fy = (t) => {
  var f, u;
  let e;
  try {
    e = An(up(t));
  } catch {
    return null;
  }
  const n = En(e);
  if (!n || n.success === !1)
    return null;
  const r = En(n.value), s = En(r == null ? void 0 : r.value), o = En(s == null ? void 0 : s.value);
  if (!o)
    return null;
  const i = Jc((f = En(o.name)) == null ? void 0 : f.value), a = Jc((u = En(o.namespace)) == null ? void 0 : u.value);
  return !i || !a ? null : Ny(`${i}.${a}`);
}, My = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${Dy(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [n0(Pd(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const o = await s.json();
  return !(o != null && o.okay) || typeof o.result != "string" ? null : Fy(o.result);
}, Ry = async (t) => {
  const e = t.address.trim();
  if (!dp(e))
    return null;
  const n = ky(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of gy(t.network))
    try {
      return await My({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (o) {
      r = o;
    }
  return Uy("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: Ty(r)
  }), null;
}, Gy = "ParallaX Casino", Vy = "ParallaX Casino room sign-in. This is free: it sends no transaction, costs no fees and gives no permission to spend anything.";
new TextEncoder();
new TextDecoder();
const Ky = (t) => t === "mainnet" ? 1 : 2147483648, zy = (t) => `${Vy} Account ${t.address}. Valid until ${new Date(t.expires).toISOString().replace(".000Z", "Z")}. Request code ${t.nonce}.`, jy = (t) => ({
  domain: Yf({
    name: ts(Gy),
    version: ts("1"),
    "chain-id": Xf(Ky(t.network))
  }),
  message: ts(zy(t))
}), Jr = (t) => !!t && typeof t.request == "function", qy = () => {
  try {
    const t = window.top;
    if (t && t !== window.self && t.location.origin === window.location.origin) return t;
  } catch {
  }
  return window;
}, Wy = () => {
  const t = qy();
  return t === window ? [window] : [t, window];
}, Zc = (t) => {
  for (const e of Wy()) {
    const n = t(e);
    if (n) return n;
  }
  return null;
}, Xy = (t) => {
  if (t === "leather") {
    const n = Zc((r) => Jr(r.LeatherProvider) ? r.LeatherProvider : null);
    return n ? { rpc: n } : null;
  }
  const e = Zc((n) => {
    const r = n.XverseProviders || n.xverseProviders;
    return r && (Jr(r.BitcoinProvider) || Jr(r.StacksProvider)) ? r : null;
  });
  return e ? { rpc: Jr(e.BitcoinProvider) ? e.BitcoinProvider : e.StacksProvider } : null;
}, Yy = (t, e) => new Promise((n) => {
  const r = Date.now();
  (function s() {
    const o = Xy(t);
    o || Date.now() - r >= e ? n(o) : window.setTimeout(s, 150);
  })();
}), gs = (t) => {
  var e;
  return (t == null ? void 0 : t.code) ?? ((e = t == null ? void 0 : t.error) == null ? void 0 : e.code);
}, Je = (t) => {
  var e;
  return String((t == null ? void 0 : t.message) ?? ((e = t == null ? void 0 : t.error) == null ? void 0 : e.message) ?? t ?? "unknown error");
}, Jy = (t) => [4001, -31001].includes(Number(gs(t))) || /cancel|denied|reject|declin|closed/i.test(Je(t)), Qc = (t) => Number(gs(t)) === -32601 || /not supported|method not found|unsupported|not implemented|legacy method/i.test(Je(t)), fo = async (t, e, n) => {
  const r = n === void 0 ? await t.request(e) : await t.request(e, n);
  if (r && typeof r == "object") {
    if (r.error) throw Object.assign(new Error(Je(r.error)), { code: gs(r.error) });
    if (r.status === "error") throw Object.assign(new Error(Je(r.error || r)), { code: gs(r.error || r) });
    if ("result" in r) return r.result;
  }
  return r;
}, Zy = (t) => new Promise((e, n) => {
  const r = window.setTimeout(() => n(new Error("The wallet did not answer. Check its window.")), 9e4);
  t.then((s) => {
    window.clearTimeout(r), e(s);
  }, (s) => {
    window.clearTimeout(r), n(s);
  });
}), Qy = (t) => (JSON.stringify(t) || "").match(/S[PT][0-9A-HJKMNP-TV-Z]{38,39}/g) || [], Oe = [];
async function t3(t) {
  const e = await Yy(t, 1500);
  if (!e) throw new Error(`${t === "leather" ? "Leather" : "Xverse"} was not found in this browser.`);
  Oe.length = 0;
  let n;
  if (t === "xverse") {
    try {
      await fo(e.rpc, "wallet_disconnect"), Oe.push("wallet_disconnect: ok");
    } catch (s) {
      Oe.push("wallet_disconnect: " + Je(s).slice(0, 80));
    }
    n = ["wallet_connect", "wallet_getAccount"];
  } else
    n = ["getAddresses", "stx_getAccounts", "stx_getAddresses", "stx_requestAccounts"];
  let r = null;
  for (const s of n)
    try {
      const o = await (t === "xverse" ? Zy(fo(e.rpc, s)) : fo(e.rpc, s)), i = Qy(o);
      if (i.length) {
        const a = i[0];
        return Oe.push(`${s}: ok`), { kind: t, address: a, network: a.startsWith("SP") ? "mainnet" : "testnet", via: s };
      }
      Oe.push(`${s}: answered but no Stacks address in it`);
    } catch (o) {
      if (Jy(o))
        throw Oe.push(`${s}: cancelled`), new Error("Connection cancelled.");
      Oe.push(`${s}: ${Qc(o) ? "not supported" : Je(o).slice(0, 80)}`), Qc(o) || (r = o);
    }
  throw new Error(r ? Je(r) : "The wallet did not share a Stacks address.");
}
const e3 = (t) => eg(t === "leather" ? "LeatherProvider" : "XverseProviders.BitcoinProvider"), $l = (t) => t instanceof Error ? t.message : String(t), lo = 500, _l = 40, n3 = 2e3, ir = 280, tf = "px_room_blocks_v1", ef = "px_chat_ui_v1", ho = "px_chat_session_v1:", nf = { hidden: !1, side: "left" }, r3 = [
  { code: "spam", label: "Spam" },
  { code: "abuse", label: "Abuse" },
  { code: "scam", label: "Scam" },
  { code: "other", label: "Something else" }
], s3 = (t) => {
  if (!Array.isArray(t)) return [];
  const e = [];
  for (const n of t)
    if (!(typeof n != "string" || !/^S[A-Z0-9]{19,60}$/.test(n) || e.includes(n)) && (e.push(n), e.length >= _l))
      break;
  return e;
}, o3 = (t) => {
  if (!t) return [];
  try {
    return s3(JSON.parse(t));
  } catch {
    return [];
  }
}, i3 = (t) => {
  if (!t) return { ...nf };
  try {
    const e = JSON.parse(t);
    return { hidden: (e == null ? void 0 : e.hidden) === !0, side: (e == null ? void 0 : e.side) === "right" ? "right" : "left" };
  } catch {
    return { ...nf };
  }
}, Hl = {
  "no-links": "Links are not allowed in messages.",
  "too-long": `That message is too long (${ir} characters at most).`,
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
  "rate-limited": "You are sending too much. Wait a moment."
}, a3 = (t) => typeof t == "string" && Object.prototype.hasOwnProperty.call(Hl, t), Yn = (t) => Hl[String(t)] ?? "The room could not take that. Try again in a moment.", c3 = (t) => t.replace(/\s+/g, " ").trim(), f3 = (t) => Array.from(t).length, l3 = (t, e) => {
  const n = c3(t);
  return e.signed ? e.connected ? n ? f3(n) > ir ? { ok: !1, code: "too-long" } : e.now - e.lastSentAt < n3 ? { ok: !1, code: "slow-down" } : { ok: !0, text: n } : { ok: !1, code: "empty" } : { ok: !1, code: "offline" } : { ok: !1, code: "sign-in-first" };
};
class h3 {
  constructor() {
    yn(this, "lines", []);
    yn(this, "seq", 0);
    yn(this, "blocked", /* @__PURE__ */ new Set());
  }
  setBlocked(e) {
    this.blocked = new Set(e);
  }
  add(e, n, r, s, o) {
    if (e && !r && this.blocked.has(e.a)) return null;
    const i = { id: this.seq += 1, who: e, mine: r, text: n, at: s };
    return o && (i.to = o), this.lines.push(i), this.lines.length > lo && this.lines.splice(0, this.lines.length - lo), i;
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
    for (const s of n.slice(-lo)) {
      if (!s || typeof s.a != "string" || typeof s.t != "string" || typeof s.at != "number") continue;
      const o = typeof s.to == "string" ? { a: s.to } : void 0;
      this.add({ a: s.a }, s.t.slice(0, ir * 2), s.m === 1, s.at, o) && (r += 1);
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
class u3 {
  constructor() {
    yn(this, "people", /* @__PURE__ */ new Map());
    yn(this, "known", !1);
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
const d3 = `
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
}, Kt = (t, e, n = "sm") => {
  const r = q("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function p3(t) {
  const e = new h3(), n = new u3();
  let r = { hidden: !1, side: "left" }, s = [];
  try {
    r = i3(window.localStorage.getItem(ef)), s = o3(window.localStorage.getItem(tf));
  } catch {
  }
  e.setBlocked(s);
  let o = !1, i = null, a = null, f = !1, u = "", h = 0, c = 0, p = 0, d = null, x = 0, w = !0, v = null;
  const L = () => {
    try {
      window.localStorage.setItem(ef, JSON.stringify(r));
    } catch {
    }
  }, O = () => {
    try {
      window.localStorage.setItem(tf, JSON.stringify(s));
    } catch {
    }
  }, g = (S) => t.labelFor(S), $ = () => {
    if (v)
      try {
        window.sessionStorage.setItem(ho + v, e.dump());
      } catch {
      }
  }, A = (S) => {
    if (S)
      try {
        window.sessionStorage.removeItem(ho + S);
      } catch {
      }
  }, P = (S) => {
    if (S !== v) {
      if (A(v), e.clear(), At.forEach((F) => F.remove()), At.clear(), v = S, S)
        try {
          e.load(window.sessionStorage.getItem(ho + S));
        } catch {
        }
      w = !0;
    }
  }, T = (S) => s.includes(S), C = document.createElement("style");
  C.textContent = d3, document.head.append(C);
  const I = q("div");
  I.id = "pxchat";
  const b = q("div");
  b.id = "pxchat-lines";
  const E = q("button", "New messages ↓", "newer");
  E.type = "button", E.hidden = !0, b.setAttribute("role", "log"), b.setAttribute("aria-live", "polite"), b.setAttribute("aria-label", "Casino chat");
  const H = q("div", void 0, "panel");
  H.id = "pxchat-menu", H.hidden = !0;
  const k = q("div", void 0, "panel");
  k.id = "pxchat-panel", k.hidden = !0;
  const M = q("form");
  M.hidden = !0;
  const N = q("button", void 0, "to");
  N.type = "button", N.hidden = !0;
  const et = q("input");
  et.type = "text", et.autocomplete = "off", et.enterKeyHint = "send", et.maxLength = ir * 2;
  const ce = q("button", "Send", "sm");
  ce.type = "submit", M.append(N, et, ce);
  const Zt = q("div", void 0, "bar");
  Zt.hidden = !0;
  const rt = Kt("Here now", () => Ke("people")), j = Kt("Hide chat", () => Er()), zn = Kt("", () => {
    r.side = r.side === "left" ? "right" : "left", L(), tt();
  }), hn = Kt("Blocked", () => Ke("blocked"));
  rt.id = "pxchat-people", j.id = "pxchat-hide", zn.id = "pxchat-side", hn.id = "pxchat-blocked", Zt.append(rt, j, zn, hn), I.append(b, E, H, k, M, Zt);
  const it = q("button");
  it.id = "pxchat-btn", it.type = "button", it.setAttribute("aria-controls", "pxchat");
  const At = /* @__PURE__ */ new Map(), pr = () => o || !!a || !!u, Ps = () => {
    var S;
    return (S = window.matchMedia) != null && S.call(window, "(max-width:700px)").matches ? 5 : 8;
  }, un = (S) => {
    const F = q("button", g(S.a), "nm");
    return F.type = "button", F.dataset.a = S.a, F.setAttribute("aria-label", `Options for ${g(S.a)}`), F.onclick = () => Dt(S), F;
  }, Ns = (S) => {
    const F = S.who ? `ln${S.mine ? " mine" : ""}${S.to ? " dm" : ""}` : "ln note", J = q("div", void 0, F);
    if (!S.who)
      return J.append(q("span", S.text, "tx")), J;
    const X = [];
    return S.to ? S.mine ? X.push(q("span", "You", "nm"), q("span", "→", "tag"), un(S.to)) : X.push(un(S.who), q("span", "→ you", "tag")) : X.push(S.mine ? q("span", "You", "nm") : un(S.who)), X.push(q("span", S.text, "tx")), X.forEach((lt, ut) => {
      ut && J.append(document.createTextNode(" ")), J.append(lt);
    }), J;
  }, Ds = () => b.scrollTop + b.clientHeight >= b.scrollHeight - 8, br = () => {
    b.scrollTop = b.scrollHeight, w = !0, E.hidden = !0;
  }, gr = () => {
    const S = pr(), F = S ? e.all() : e.tail(Ps()), J = b.classList.contains("scroll");
    b.classList.toggle("scroll", S);
    const X = new Set(F.map((pt) => pt.id));
    let lt = !1;
    for (const [pt, bt] of At) X.has(pt) || (bt.remove(), At.delete(pt));
    let ut = null;
    for (const pt of F) {
      let bt = At.get(pt.id);
      bt || (bt = Ns(pt), At.set(pt.id, bt), lt = !0);
      const Tt = ut ? ut.nextElementSibling : b.firstElementChild;
      Tt !== bt && b.insertBefore(bt, Tt), ut = bt;
    }
    if (!S) {
      E.hidden = !0, w = !0;
      return;
    }
    !J || w ? br() : lt && (E.hidden = !1);
  }, xr = () => {
    it.replaceChildren(q("span", "💬", "ic"), q("span", "Chat", "lbl")), r.hidden && h > 0 && it.append(q("span", h > 9 ? "9+" : String(h), c ? "dot dm" : "dot")), it.setAttribute("aria-expanded", String(o && !r.hidden)), it.setAttribute("aria-label", r.hidden && h ? `Chat: ${h} new${c ? `, ${c} sent to you` : ""}` : "Casino chat: type a message");
  }, wr = () => {
    M.hidden = !o || r.hidden, N.hidden = !i, i && (N.textContent = `To ${g(i.a)} ×`, N.setAttribute("aria-label", `Writing to ${g(i.a)}. Press to write to the whole room instead.`)), et.classList.toggle("dm", !!i);
    const S = i ? `Message ${g(i.a)}` : "Say something to the room";
    et.placeholder = S, et.setAttribute("aria-label", S);
  }, yr = () => {
    if (H.replaceChildren(), H.hidden = !a, !a) return;
    const S = a, F = T(S.a);
    H.append(q("p", g(S.a), "who"));
    const J = q("div", void 0, "row");
    if (f) {
      H.append(q("p", "Why? Your report goes to the casino team with the last few things they said to you or the room."));
      for (const X of r3) J.append(Kt(X.label, () => {
        Fs(S, X.code), Ve();
      }));
    } else {
      const X = Kt("Message", () => {
        Ve(), Ts(S);
      });
      X.disabled = F || !n.has(S.a), F ? H.append(q("p", "You have blocked this person. Unblock them to message them.")) : n.known && !n.has(S.a) && H.append(q("p", "They have left the room.")), J.append(
        X,
        Kt(F ? "Unblock" : "Block", () => {
          Wn(S, !F), Ve();
        }),
        Kt("Report…", () => {
          f = !0, tt();
        }, "sm danger")
      );
    }
    J.append(Kt("Cancel", Ve)), H.append(J);
  }, mr = () => {
    if (k.replaceChildren(), k.hidden = !u, u === "people") {
      const S = n.others(t.me());
      if (!n.known) k.append(q("p", t.connected() ? "Asking the room who is here…" : "Not connected to the room."));
      else if (!S.length) k.append(q("p", "Nobody else is signed in right now."));
      else {
        k.append(q("p", `Signed in now (${S.length}). Tap a name to message, block or report.`));
        for (const F of S) {
          const J = q("div", void 0, "row"), X = q("span");
          X.append(un(F)), T(F.a) && X.append(document.createTextNode(" (blocked)")), J.append(X), k.append(J);
        }
      }
    } else if (u === "blocked") {
      if (!s.length) {
        k.append(q("p", "You have not blocked anyone."));
        return;
      }
      k.append(q("p", "Blocked people cannot reach you and you cannot reach them."));
      for (const S of s) {
        const F = q("div", void 0, "row");
        F.append(q("span", g(S)), Kt("Unblock", () => {
          Wn({ a: S }, !1), tt();
        })), k.append(F);
      }
    }
  }, tt = () => {
    I.hidden = r.hidden, I.classList.remove("left", "right"), I.classList.add(r.side), Zt.hidden = !o || r.hidden;
    const S = n.others(t.me()).length;
    rt.textContent = n.known ? `Here now (${S})` : "Here now", rt.classList.toggle("on", u === "people"), zn.textContent = r.side === "left" ? "Move right ▸" : "◂ Move left", hn.textContent = s.length ? `Blocked (${s.length})` : "Blocked", hn.classList.toggle("on", u === "blocked"), xr(), wr(), yr(), mr(), gr(), dn();
  }, dn = () => {
    const S = window.innerWidth, F = window.innerHeight, J = document.getElementById("tools"), X = Math.round(Math.max(70, (J ? J.getBoundingClientRect().bottom : 58) + 12));
    let lt = r.side === "left" ? 14 : null, ut = Math.min(340, S - 28), pt = F - X - 12, bt = !1;
    const Tt = document.getElementById("intro"), gt = Tt && Tt.getClientRects().length ? Tt.getBoundingClientRect() : null;
    gt && gt.width > 0 && gt.height > 0 && gt.bottom > X && (r.side === "left" ? gt.left < 14 + ut : gt.right > S - 14 - ut) && (r.side === "left" && S - gt.right - 30 >= 260 ? (lt = Math.round(gt.right + 16), ut = Math.min(340, S - lt - 14)) : (bt = !0, pt = Math.max(170, Math.round(gt.top - X - 8)))), I.style.top = `${X}px`, I.style.left = lt === null ? "auto" : `${lt}px`, I.style.right = lt === null ? "14px" : "", I.style.width = `${ut}px`, I.style.maxHeight = `${pt}px`, I.classList.toggle("over", bt && !I.hidden && (o || At.size > 0));
  }, dt = (S) => {
    e.add(null, S, !1, Date.now());
  }, Sr = () => {
    try {
      document.pointerLockElement && document.exitPointerLock();
    } catch {
    }
  }, Ge = () => {
    if (!t.me()) {
      r.hidden && (r.hidden = !1, L()), o = !1, dt("Join the room to chat. Anyone can watch; you need one free signature to speak."), tt(), t.joinPrompt();
      return;
    }
    r.hidden && (r.hidden = !1, L()), h = 0, c = 0, o = !0, Sr(), tt(), et.focus();
  }, pn = () => {
    o = !1, a = null, f = !1, u = "", et.blur(), tt();
  }, Er = () => {
    r.hidden = !0, L(), o = !1, a = null, f = !1, u = "", h = 0, c = 0, et.blur(), tt();
  }, Ve = () => {
    a = null, f = !1, tt();
  };
  function Dt(S) {
    a = S, f = !1, Sr(), tt();
  }
  function Ke(S) {
    u = u === S ? "" : S, a = null, f = !1, tt();
  }
  function Ts(S) {
    if (T(S.a)) {
      dt(Yn("blocked")), tt();
      return;
    }
    i = { a: S.a }, u = "", Ge();
  }
  const jn = () => {
    i = null, tt(), et.focus();
  }, qn = () => {
    t.me() && t.send({ t: "blocks", list: s }) && (x = Date.now());
  };
  function Wn(S, F) {
    const J = g(S.a);
    if (F) {
      if (s.length >= _l) {
        dt(Yn("too-many-blocks"));
        return;
      }
      s.includes(S.a) || s.push(S.a), e.dropFrom(S.a), $(), (i == null ? void 0 : i.a) === S.a && (i = null), dt(`You blocked ${J}. Neither of you will see the other's messages.`);
    } else
      s = s.filter((X) => X !== S.a), dt(`You unblocked ${J}.`);
    e.setBlocked(s), At.forEach((X) => X.remove()), At.clear(), O(), qn();
  }
  function Fs(S, F) {
    if (!t.me() || !t.connected()) {
      dt("Not connected to the room, so the report was not sent.");
      return;
    }
    t.send({ t: "report", who: S.a, why: F, lines: e.lastFrom(S.a) }) && (x = Date.now()), dt("Sending your report…");
  }
  it.onclick = () => {
    o && !r.hidden ? pn() : Ge();
  }, N.onclick = jn, E.onclick = () => br(), b.addEventListener("scroll", () => {
    w = Ds(), w && (E.hidden = !0);
  }, { passive: !0 }), b.addEventListener("wheel", (S) => {
    b.classList.contains("scroll") && S.stopPropagation();
  }, { passive: !0 }), b.addEventListener("touchmove", (S) => {
    b.classList.contains("scroll") && S.stopPropagation();
  }, { passive: !0 }), M.onsubmit = (S) => {
    S.preventDefault();
    const F = Date.now(), J = l3(et.value, { signed: !!t.me(), connected: t.connected(), now: F, lastSentAt: p }), X = "Not connected to the room yet. Your message is still in the box.";
    if (!J.ok) {
      dt(J.code === "offline" ? X : Yn(J.code)), tt();
      return;
    }
    if (i && n.known && !n.has(i.a)) {
      dt(Yn("not-here")), tt();
      return;
    }
    const lt = i ? { t: "dm", to: i.a, text: J.text } : { t: "say", text: J.text };
    if (!t.send(lt)) {
      dt(X), tt();
      return;
    }
    p = F, x = F, d = { text: J.text, to: i }, et.value = "";
  }, et.addEventListener("keydown", (S) => {
    S.stopPropagation(), S.key === "Escape" && (S.preventDefault(), i && !et.value ? jn() : pn());
  }), et.addEventListener("keypress", (S) => S.stopPropagation()), document.addEventListener("pointerdown", (S) => {
    if (!a && !u) return;
    const F = S.target;
    F && (I.contains(F) || it.contains(F)) || (a = null, f = !1, u = "", tt());
  }), window.addEventListener("resize", dn);
  const Ar = document.getElementById("intro");
  Ar && "MutationObserver" in window && new MutationObserver(() => dn()).observe(Ar, { attributes: !0, attributeFilter: ["class", "style", "hidden"] });
  const Ms = {
    button: it,
    mount(S) {
      S.append(I), tt();
    },
    /**
     * Someone spoke: `say` to the room or `dm` to one person. The room sends our own lines back too (to every tab of ours), so our
     * screen shows exactly what was delivered.
     */
    heard(S) {
      if (!(S != null && S.from) || typeof S.from.a != "string") return;
      const F = t.me(), J = !!F && S.from.a === F, X = S.t === "dm" && S.to && typeof S.to.a == "string" ? { a: S.to.a } : void 0;
      e.add({ a: S.from.a }, String(S.text ?? "").slice(0, ir * 2), J, Date.now(), X) && ($(), J ? (d = null, w = !0) : r.hidden && (h += 1, X && (c += 1)), tt());
    },
    /**
     * The room refused something. Only a refusal of something chat just sent is chat's business: the room also says "slow down" to
     * the page's own seat updates, and those must not show up as chat notes. Returns whether chat took it.
     * A refused message goes back into the box so nothing typed is lost.
     */
    failed(S) {
      return !d && Date.now() - x > 4e3 ? !1 : (d && !et.value && (et.value = d.text, d.to && S !== "not-here" && S !== "no-such-player" && (i = d.to)), (S === "not-here" || S === "no-such-player") && (i = null), d = null, dt(Yn(S)), tt(), !0);
    },
    reported() {
      dt("Report sent. Thank you."), tt();
    },
    /** A fresh connection: the room has forgotten our block list, so hand it over again, and take its list of who is here. */
    room(S, F) {
      n.set(S), P(F ? t.me() : null), F ? qn() : (o = !1, i = null, a = null, f = !1, u = "", et.value = "", d = null), i && !n.has(i.a) && (i = null), tt();
    },
    joined(S) {
      n.join(S), u === "people" || a ? tt() : rt.textContent = `Here now (${n.others(t.me()).length})`;
    },
    left(S) {
      n.leave(S), typeof S == "string" && (i == null ? void 0 : i.a) === S && (dt(`${g(S)} left the room.`), i = null), tt();
    },
    /** The player pressed Leave the room: their session's chat is cleared from this tab now. */
    endSession() {
      P(null), o = !1, i = null, a = null, f = !1, u = "", et.value = "", d = null, tt();
    },
    /** The connection dropped: until the room speaks again we do not know who is here. Their chat stays: a reconnect is the same session. */
    disconnected() {
      n.forget(), tt();
    },
    /** Names learned from BNS arrive late; relabel what is already on screen. */
    refreshNames() {
      I.querySelectorAll("button.nm[data-a]").forEach((S) => {
        S.textContent = g(S.dataset.a);
      }), i && wr();
    },
    isTyping: () => o,
    debug: () => ({ typing: o, hidden: r.hidden, side: r.side, target: (i == null ? void 0 : i.a) ?? null, blocks: [...s], lines: e.size, shown: At.size, session: v, stick: w, people: n.others(t.me()).map((S) => S.a) })
  };
  return xr(), Ms;
}
const m = {
  service: "unknown",
  signed: null,
  wallet: null,
  ws: null,
  connected: !1,
  attempts: 0,
  replaced: !1,
  you: null,
  spots: {},
  joined: 0,
  guests: 0,
  busy: "",
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
let W = null;
const b3 = (t) => t.length <= 12 ? t : `${t.slice(0, 5)}…${t.slice(-4)}`, g3 = (t) => {
  if (t.startsWith("SP")) return t;
  const e = li(t);
  return mo({ ...e, version: bo.MainnetSingleSig });
}, x3 = ly((t) => Ry({ address: g3(t), network: "mainnet" }), () => {
  xs(), W == null || W.refreshNames();
}), ki = (t) => {
  let e = null;
  try {
    e = x3.get(t);
  } catch {
  }
  return e || b3(t);
}, xs = () => {
  var n;
  if (!m.host || m.service !== "ok") return;
  const t = ((n = m.you) == null ? void 0 : n.a) ?? null, e = Object.entries(m.spots).filter(([, r]) => r.a !== t).map(([r, s]) => ({ key: s.a, spot: r, label: ki(s.a), since: s.since }));
  try {
    m.host.setPeople(e);
  } catch (r) {
    console.warn("[room] the page could not draw the people", r);
  }
}, ws = async (t, e) => {
  const n = await fetch(t, { credentials: "same-origin", ...e });
  let r = null;
  try {
    r = await n.json();
  } catch {
  }
  return { res: n, body: r };
}, zo = (t) => {
  var e;
  return ((e = m.ws) == null ? void 0 : e.readyState) !== WebSocket.OPEN ? !1 : (m.ws.send(JSON.stringify(t)), m.lastSent = Date.now(), !0);
}, Ll = () => {
  var e;
  if (m.service !== "ok" || !m.connected || !m.you || m.you.guest || !m.signed) return;
  const t = ((e = Object.entries(m.spots).find(([, n]) => n.a === m.you.a)) == null ? void 0 : e[0]) ?? null;
  m.want ? t !== m.want && m.want !== m.badSpot && m.want !== m.yielded && !m.spots[m.want] && Date.now() - m.lastSent > 1200 && zo({ t: "sit", spot: m.want }) : t && t !== m.standSent && Date.now() - m.lastSent > 600 && (m.standSent = t, zo({ t: "stand" }));
}, Pi = () => {
  if (m.service !== "ok" || m.ws) return;
  m.attempts += 1;
  let t;
  try {
    t = new WebSocket(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/casino/room/ws`);
  } catch {
    return rf();
  }
  m.ws = t, t.onopen = () => {
    m.connected = !0, m.attempts = 0, wt();
  }, t.onmessage = (e) => {
    var r;
    let n;
    try {
      n = JSON.parse(String(e.data));
    } catch {
      return;
    }
    switch (n.t) {
      case "room":
        m.you = n.you, m.spots = n.spots || {}, m.joined = n.joined, m.guests = n.guests, m.standSent = null, m.signed && ((r = m.you) != null && r.guest) && (m.signed = null), W == null || W.room(n.players, !!(m.you && !m.you.guest));
        break;
      case "sat":
        m.spots[n.spot] = n.who;
        break;
      case "stood":
        delete m.spots[n.spot], m.standSent === n.spot && (m.standSent = null);
        break;
      case "moved":
        m.yielded = n.spot;
        break;
      case "count":
        m.joined = n.joined, m.guests = n.guests;
        break;
      case "say":
      case "dm":
        W == null || W.heard(n);
        return;
      case "join":
        W == null || W.joined(n.who);
        return;
      case "leave":
        W == null || W.left(n.a);
        return;
      case "reported":
        W == null || W.reported();
        return;
      case "err":
        n.code === "no-such-spot" ? m.badSpot = m.want : a3(n.code) && (W != null && W.failed(n.code)) || n.code === "slow-down" && (m.lastSent = Date.now() + 3e3);
        return;
      default:
        return;
    }
    xs(), Ll(), wt();
  }, t.onclose = (e) => {
    if (m.ws === t) {
      if (m.ws = null, m.connected = !1, m.spots = {}, xs(), W == null || W.disconnected(), e.code === 4001) {
        m.replaced = !0, wt();
        return;
      }
      wt(), rf();
    }
  }, t.onerror = () => {
  };
}, rf = () => {
  window.clearTimeout(m.retryTimer);
  const t = Math.min(15e3, 1e3 * 2 ** Math.min(m.attempts, 4));
  m.retryTimer = window.setTimeout(() => {
    m.ws || Pi();
  }, t);
}, Ni = () => {
  const t = m.ws;
  m.ws = null, m.connected = !1, m.attempts = 0, m.replaced = !1;
  try {
    t == null || t.close(1e3, "client");
  } catch {
  }
  Pi();
};
async function w3(t) {
  const { res: e, body: n } = await ws(`/casino/room/challenge?address=${encodeURIComponent(t.address)}`);
  if (!e.ok) throw new Error((n == null ? void 0 : n.error) || `The room answered ${e.status}.`);
  const r = n.challenge, { domain: s, message: o } = jy(r);
  m.busy = "sign", wt();
  let i;
  try {
    i = await fy({ domain: s, message: o, network: r.network, stxAddress: t.address });
  } catch (u) {
    throw new Error("The wallet did not sign: " + $l(u));
  }
  const { res: a, body: f } = await ws("/casino/room/session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ challenge: r, signature: i })
  });
  if (!a.ok) throw new Error((f == null ? void 0 : f.error) || `The room answered ${a.status}.`);
  m.signed = { address: f.address, hash160: f.hash160, expiresAt: f.expiresAt }, Ni();
}
async function y3(t) {
  if (!m.busy) {
    m.error = "", m.busy = "connect", wt();
    try {
      m.wallet = await t3(t), e3(t), await w3(m.wallet), m.open = !1;
    } catch (e) {
      m.error = $l(e);
    } finally {
      m.busy = "", wt();
    }
  }
}
async function m3() {
  try {
    await ws("/casino/room/session", { method: "DELETE" });
  } catch {
  }
  m.signed = null, m.wallet = null, m.error = "", W == null || W.endSession(), W == null || W.disconnected(), Ni(), wt();
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
`, ot = (t, e, n) => {
  const r = document.createElement(t);
  return e !== void 0 && (r.textContent = e), n && (r.className = n), r;
}, We = (t, e) => {
  const n = ot("p", void 0, "fact");
  return n.append(ot("b", t), document.createTextNode(` ${e}`)), n;
};
let Ce = null, Bt = null, jt = null;
function E3() {
  var n, r;
  if (Ce || m.service !== "ok") return;
  const t = document.createElement("style");
  t.textContent = S3, document.head.append(t), Ce = ot("span"), Ce.id = "pxroom", Bt = ot("button"), Bt.id = "pxroom-btn", Bt.type = "button", Bt.setAttribute("aria-label", "Casino room: see who is here and join"), Bt.onclick = () => {
    m.open = !m.open, wt();
  }, jt = ot("div"), jt.id = "pxroom-panel", jt.hidden = !0, W = p3({
    send: zo,
    me: () => m.you && !m.you.guest ? m.you.a : null,
    connected: () => m.connected,
    labelFor: ki,
    joinPrompt: () => {
      m.open = !0, wt();
    }
  }), Ce.append(Bt, W.button);
  const e = ((r = (n = m.host) == null ? void 0 : n.mount) == null ? void 0 : r.call(n)) ?? document.querySelector("#tools .rt");
  e ? e.insertBefore(Ce, e.firstChild) : (Ce.style.cssText = "position:fixed;top:10px;right:10px;z-index:30", document.body.append(Ce)), document.body.append(jt), W.mount(document.body), document.addEventListener("keydown", (s) => {
    s.key === "Escape" && m.open && (m.open = !1, wt());
  }), document.addEventListener("pointerdown", (s) => {
    if (!m.open) return;
    const o = s.target;
    o && (jt.contains(o) || Bt.contains(o)) || (m.open = !1, wt());
  }), window.addEventListener("resize", () => wt());
}
function A3() {
  if (!Bt || !jt) return;
  const t = Bt.getBoundingClientRect(), e = t.height ? Math.round(t.bottom + 8) : 64;
  jt.style.top = `${Math.min(e, Math.max(64, window.innerHeight - 220))}px`;
}
function wt() {
  var n;
  if (!Ce || !Bt || !jt) return;
  const t = !!(m.signed && m.you && !m.you.guest);
  if (Bt.className = m.connected ? "live" : "wait", Bt.replaceChildren(ot("i"), ot("span", t ? "In the room" : "Room", "lbl"), ot("span", m.connected ? (n = window.matchMedia) != null && n.call(window, "(max-width:620px)").matches ? String(m.joined) : ` · ${m.joined}` : "", "n")), Bt.setAttribute("aria-label", `Casino room: ${m.connected ? `${m.joined} signed in, ` : ""}${t ? "you are in" : "see who is here and join"}`), jt.hidden = !m.open, !m.open) return;
  A3();
  const e = [];
  if (m.replaced) {
    e.push(ot("h3", "Room"), ot("p", "Another tab of yours took over the room. You are not connected here."));
    const r = ot("button", "Use this tab instead");
    r.onclick = () => {
      Ni(), wt();
    }, e.push(r);
  } else if (t) {
    e.push(ot("h3", "You are in the room")), e.push(ot("p", "Others see you at your seat as"), ot("p", ki(m.signed.address), "who")), e.push(ot("p", `${m.joined} signed in, ${m.guests} watching.`)), e.push(We("Be seen", "Sit at a table or connect to a machine and your Adrian and name tag appear there for everyone in the room. Stand up or walk away and they go too.")), e.push(We("Spaces", "Each seat and machine holds one person. If someone already has the seat you choose, you are given a free one at the same table.")), e.push(We("Live chat", "Press Chat to talk to the room and scroll back through this session. Tap a name, or Here now, to send someone a direct message, block or report them. Messages are not secret; this session's chat is kept in this tab only and cleared when you leave the room.")), e.push(ot("p", "Nothing here moves any money.", "fact"));
    const r = ot("button", "Leave the room");
    r.onclick = () => {
      m3();
    }, e.push(r);
  } else {
    e.push(ot("h3", "Join the room")), e.push(ot("p", m.connected ? `You are watching: ${m.joined} signed in, ${m.guests} watching.` : "Connecting to the room…")), e.push(We("Be seen", "Join, then sit at a table or connect to a machine. Everyone in the room sees your Adrian there, with a name tag (your BNS name, or a short version of your address). Watching alone shows you to nobody.")), e.push(We("Spaces", "Each seat and machine holds one person. If someone already has the seat you choose, you are given a free one at the same table.")), e.push(We("Live chat", "Signed-in players can chat with the room and send each other direct messages. Messages are not secret and are not saved.")), e.push(We("Free", "One signature. It sends no transaction, costs no fee and gives no permission to spend anything."));
    const r = ot("div", void 0, "row");
    for (const s of ["leather", "xverse"]) {
      const o = ot("button", m.busy ? m.busy === "sign" ? "Check your wallet…" : "Connecting…" : s === "leather" ? "Leather" : "Xverse");
      if (o.disabled = !!m.busy || !m.connected, o.onclick = () => {
        y3(s);
      }, r.append(o), m.busy) break;
    }
    e.push(r), m.error && e.push(ot("p", m.error, "err"));
  }
  jt.replaceChildren(...e);
}
const v3 = () => {
  var e;
  const t = ((e = m.host) == null ? void 0 : e.currentSpot()) ?? null;
  t !== m.want && (m.want = t, m.yielded = null, m.standSent = null, xs()), Ll();
};
async function B3() {
  try {
    const { res: t, body: e } = await ws("/casino/room/session");
    if (t.status === 503) return;
    t.ok && (e != null && e.address) && (m.signed = { address: e.address, hash160: e.hash160, expiresAt: e.expiresAt }), m.service = "ok";
  } catch {
    return;
  }
  E3(), wt(), Pi(), window.setInterval(v3, 250);
}
const sf = (t) => {
  m.host || (m.host = t, B3());
}, of = window.PXRoomHost;
of ? sf(of) : window.addEventListener("px-room-host", () => sf(window.PXRoomHost), { once: !0 });
window.__pxRoom = {
  chat: () => (W == null ? void 0 : W.debug()) ?? null,
  get state() {
    var t;
    return { service: m.service, signed: ((t = m.signed) == null ? void 0 : t.address) ?? null, connected: m.connected, you: m.you, spots: m.spots, joined: m.joined, guests: m.guests, want: m.want, trail: Oe.slice() };
  }
};
