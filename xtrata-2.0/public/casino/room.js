var Fh = Object.defineProperty;
var Mh = (t, e, n) => e in t ? Fh(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var yn = (t, e, n) => Mh(t, typeof e != "symbol" ? e + "" : e, n);
function Jo(t, e) {
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
      const r = Vh(BigInt(`0x${oe(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${oe(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Zo(t, e = 8) {
  return (typeof t == "bigint" ? t : Jo(t, !1)).toString(16).padStart(e * 2, "0");
}
function hl(t) {
  return parseInt(t, 16);
}
function ul(t, e = 16) {
  const n = Zo(t, e);
  return _n(n);
}
function Rh(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Gh(t, e) {
  return t & BigInt(1) << e;
}
function Vh(t, e) {
  return Gh(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Kh = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function oe(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Kh[n];
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
function cr(t) {
  return new TextEncoder().encode(t);
}
function dl(t) {
  return new TextDecoder().decode(t);
}
function pl(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function zh(t) {
  return String.fromCharCode.apply(null, t);
}
function jh(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function na(t) {
  if (t.some(jh))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Qo(...t) {
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
  return Qo(...t.map((e) => typeof e == "number" ? na([e]) : e instanceof Array ? na(e) : e));
}
function qh(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Wh(t, e) {
  return t[e];
}
function Xh(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Es(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var xo;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(xo || (xo = {}));
xo.Mainnet;
const Yh = 128, Jh = 128, bl = 16;
var er;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(er || (er = {}));
var ra;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ra || (ra = {}));
var sa;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(sa || (sa = {}));
var Ot;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ot || (Ot = {}));
const Ys = ["onChainOnly", "offChainOnly", "any"];
Ys[0] + "", Ot.OnChainOnly, Ys[1] + "", Ot.OffChainOnly, Ys[2] + "", Ot.Any, Ot.OnChainOnly + "", Ot.OnChainOnly, Ot.OffChainOnly + "", Ot.OffChainOnly, Ot.Any + "", Ot.Any;
var wo;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(wo || (wo = {}));
wo.Mainnet;
var oa;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(oa || (oa = {}));
var ia;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(ia || (ia = {}));
var aa;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(aa || (aa = {}));
var ca;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(ca || (ca = {}));
var yo;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(yo || (yo = {}));
var la;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(la || (la = {}));
var fa;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(fa || (fa = {}));
var ha;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(ha || (ha = {}));
var ua;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ua || (ua = {}));
var da;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(da || (da = {}));
var pa;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(pa || (pa = {}));
function mo(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Zh(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function gl(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Qh(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  mo(t.outputLen), mo(t.blockLen);
}
function tu(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function eu(t, e) {
  gl(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Js = {
  number: mo,
  bool: Zh,
  bytes: gl,
  hash: Qh,
  exists: tu,
  output: eu
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Zs = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ft = (t, e) => t << 32 - e | t >>> e, nu = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!nu)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ru(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function xl(t) {
  if (typeof t == "string" && (t = ru(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let su = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function sn(t) {
  const e = (r) => t().update(xl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function ou(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), l = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + l, i, r), t.setUint32(e + u, a, r);
}
let ti = class extends su {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Zs(this.buffer);
  }
  update(e) {
    Js.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = xl(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const l = Zs(e);
        for (; s <= o - i; i += s)
          this.process(l, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Js.exists(this), Js.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let c = i; c < s; c++)
      n[c] = 0;
    ou(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Zs(e), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = l / 4, h = this.get();
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
const iu = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), wl = Uint8Array.from({ length: 16 }, (t, e) => e), au = wl.map((t) => (9 * t + 5) % 16);
let ei = [wl], ni = [au];
for (let t = 0; t < 4; t++)
  for (let e of [ei, ni])
    e.push(e[t].map((n) => iu[n]));
const yl = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), cu = ei.map((t, e) => t.map((n) => yl[e][n])), lu = ni.map((t, e) => t.map((n) => yl[e][n])), fu = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), hu = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Lr = (t, e) => t << e | t >>> 32 - e;
function ba(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ir = new Uint32Array(16);
let uu = class extends ti {
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
      Ir[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, l = a, u = this.h3 | 0, h = u, c = this.h4 | 0, p = c;
    for (let d = 0; d < 5; d++) {
      const w = 4 - d, y = fu[d], v = hu[d], L = ei[d], O = ni[d], x = cu[d], $ = lu[d];
      for (let A = 0; A < 16; A++) {
        const P = Lr(r + ba(d, o, a, u) + Ir[L[A]] + y, x[A]) + c | 0;
        r = c, c = u, u = Lr(a, 10) | 0, a = o, o = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = Lr(s + ba(w, i, l, h) + Ir[O[A]] + v, $[A]) + p | 0;
        s = p, p = h, h = Lr(l, 10) | 0, l = i, i = P;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + p | 0, this.h3 + c + s | 0, this.h4 + r + i | 0, this.h0 + o + l | 0);
  }
  roundClean() {
    Ir.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
sn(() => new uu());
const du = (t, e, n) => t & e ^ ~t & n, pu = (t, e, n) => t & e ^ t & n ^ e & n, bu = new Uint32Array([
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
]), le = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), fe = new Uint32Array(64);
let ml = class extends ti {
  constructor() {
    super(64, 32, 8, !1), this.A = le[0] | 0, this.B = le[1] | 0, this.C = le[2] | 0, this.D = le[3] | 0, this.E = le[4] | 0, this.F = le[5] | 0, this.G = le[6] | 0, this.H = le[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: a, H: l } = this;
    return [e, n, r, s, o, i, a, l];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, l) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = l | 0;
  }
  process(e, n) {
    for (let c = 0; c < 16; c++, n += 4)
      fe[c] = e.getUint32(n, !1);
    for (let c = 16; c < 64; c++) {
      const p = fe[c - 15], d = fe[c - 2], w = Ft(p, 7) ^ Ft(p, 18) ^ p >>> 3, y = Ft(d, 17) ^ Ft(d, 19) ^ d >>> 10;
      fe[c] = y + fe[c - 7] + w + fe[c - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: l, G: u, H: h } = this;
    for (let c = 0; c < 64; c++) {
      const p = Ft(a, 6) ^ Ft(a, 11) ^ Ft(a, 25), d = h + p + du(a, l, u) + bu[c] + fe[c] | 0, y = (Ft(r, 2) ^ Ft(r, 13) ^ Ft(r, 22)) + pu(r, s, o) | 0;
      h = u, u = l, l = a, a = i + d | 0, i = o, o = s, s = r, r = d + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, l = l + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, l, u, h);
  }
  roundClean() {
    fe.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, gu = class extends ml {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
sn(() => new ml());
sn(() => new gu());
const Ur = BigInt(2 ** 32 - 1), So = BigInt(32);
function Sl(t, e = !1) {
  return e ? { h: Number(t & Ur), l: Number(t >> So & Ur) } : { h: Number(t >> So & Ur) | 0, l: Number(t & Ur) | 0 };
}
function xu(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = Sl(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const wu = (t, e) => BigInt(t >>> 0) << So | BigInt(e >>> 0), yu = (t, e, n) => t >>> n, mu = (t, e, n) => t << 32 - n | e >>> n, Su = (t, e, n) => t >>> n | e << 32 - n, Eu = (t, e, n) => t << 32 - n | e >>> n, Au = (t, e, n) => t << 64 - n | e >>> n - 32, vu = (t, e, n) => t >>> n - 32 | e << 64 - n, Bu = (t, e) => e, $u = (t, e) => t, _u = (t, e, n) => t << n | e >>> 32 - n, Hu = (t, e, n) => e << n | t >>> 32 - n, Lu = (t, e, n) => e << n - 32 | t >>> 64 - n, Iu = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Uu(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Ou = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Cu = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, ku = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Pu = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Nu = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Du = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, R = {
  fromBig: Sl,
  split: xu,
  toBig: wu,
  shrSH: yu,
  shrSL: mu,
  rotrSH: Su,
  rotrSL: Eu,
  rotrBH: Au,
  rotrBL: vu,
  rotr32H: Bu,
  rotr32L: $u,
  rotlSH: _u,
  rotlSL: Hu,
  rotlBH: Lu,
  rotlBL: Iu,
  add: Uu,
  add3L: Ou,
  add3H: Cu,
  add4L: ku,
  add4H: Pu,
  add5H: Du,
  add5L: Nu
}, [Tu, Fu] = R.split([
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
let As = class extends ti {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: l, Eh: u, El: h, Fh: c, Fl: p, Gh: d, Gl: w, Hh: y, Hl: v } = this;
    return [e, n, r, s, o, i, a, l, u, h, c, p, d, w, y, v];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, l, u, h, c, p, d, w, y, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = l | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = c | 0, this.Fl = p | 0, this.Gh = d | 0, this.Gl = w | 0, this.Hh = y | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      he[x] = e.getUint32(n), ue[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const $ = he[x - 15] | 0, A = ue[x - 15] | 0, P = R.rotrSH($, A, 1) ^ R.rotrSH($, A, 8) ^ R.shrSH($, A, 7), T = R.rotrSL($, A, 1) ^ R.rotrSL($, A, 8) ^ R.shrSL($, A, 7), C = he[x - 2] | 0, I = ue[x - 2] | 0, g = R.rotrSH(C, I, 19) ^ R.rotrBH(C, I, 61) ^ R.shrSH(C, I, 6), E = R.rotrSL(C, I, 19) ^ R.rotrBL(C, I, 61) ^ R.shrSL(C, I, 6), H = R.add4L(T, E, ue[x - 7], ue[x - 16]), k = R.add4H(H, P, g, he[x - 7], he[x - 16]);
      he[x] = k | 0, ue[x] = H | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: l, Dh: u, Dl: h, Eh: c, El: p, Fh: d, Fl: w, Gh: y, Gl: v, Hh: L, Hl: O } = this;
    for (let x = 0; x < 80; x++) {
      const $ = R.rotrSH(c, p, 14) ^ R.rotrSH(c, p, 18) ^ R.rotrBH(c, p, 41), A = R.rotrSL(c, p, 14) ^ R.rotrSL(c, p, 18) ^ R.rotrBL(c, p, 41), P = c & d ^ ~c & y, T = p & w ^ ~p & v, C = R.add5L(O, A, T, Fu[x], ue[x]), I = R.add5H(C, L, $, P, Tu[x], he[x]), g = C | 0, E = R.rotrSH(r, s, 28) ^ R.rotrBH(r, s, 34) ^ R.rotrBH(r, s, 39), H = R.rotrSL(r, s, 28) ^ R.rotrBL(r, s, 34) ^ R.rotrBL(r, s, 39), k = r & o ^ r & a ^ o & a, M = s & i ^ s & l ^ i & l;
      L = y | 0, O = v | 0, y = d | 0, v = w | 0, d = c | 0, w = p | 0, { h: c, l: p } = R.add(u | 0, h | 0, I | 0, g | 0), u = a | 0, h = l | 0, a = o | 0, l = i | 0, o = r | 0, i = s | 0;
      const N = R.add3L(g, H, M);
      r = R.add3H(N, I, E, k), s = N | 0;
    }
    ({ h: r, l: s } = R.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = R.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l } = R.add(this.Ch | 0, this.Cl | 0, a | 0, l | 0), { h: u, l: h } = R.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: c, l: p } = R.add(this.Eh | 0, this.El | 0, c | 0, p | 0), { h: d, l: w } = R.add(this.Fh | 0, this.Fl | 0, d | 0, w | 0), { h: y, l: v } = R.add(this.Gh | 0, this.Gl | 0, y | 0, v | 0), { h: L, l: O } = R.add(this.Hh | 0, this.Hl | 0, L | 0, O | 0), this.set(r, s, o, i, a, l, u, h, c, p, d, w, y, v, L, O);
  }
  roundClean() {
    he.fill(0), ue.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Mu = class extends As {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Ru = class extends As {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Gu = class extends As {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
sn(() => new As());
sn(() => new Mu());
sn(() => new Ru());
sn(() => new Gu());
const Vu = {}, El = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Vu
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Y = BigInt(0), ot = BigInt(1), De = BigInt(2), Jn = BigInt(3), ga = BigInt(8), nt = Object.freeze({
  a: Y,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: ot,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), xa = (t, e) => (t + e / De) / e, Or = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = nt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -ot * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), o = n, i = BigInt("0x100000000000000000000000000000000"), a = xa(o * t, e), l = xa(-r * t, e);
    let u = U(t - a * n - l * s, e), h = U(-a * r - l * o, e);
    const c = u > i, p = h > i;
    if (c && (u = e - u), p && (h = e - h), u > i || h > i)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: c, k1: u, k2neg: p, k2: h };
  }
}, Nt = 32, Ze = 32, Al = 32, os = Nt + 1, is = 2 * Nt + 1;
function wa(t) {
  const { a: e, b: n } = nt, r = U(t * t), s = U(r * t);
  return U(s + e * t + n);
}
const Cr = nt.a === Y;
class ri extends Error {
  constructor(e) {
    super(e);
  }
}
function ya(t) {
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
    return e.equals(Z.ZERO) ? Q.ZERO : new Q(e.x, e.y, ot);
  }
  static toAffineBatch(e) {
    const n = Wu(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return Q.toAffineBatch(e).map(Q.fromAffine);
  }
  equals(e) {
    ya(e);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = e, l = U(s * s), u = U(a * a), h = U(n * u), c = U(o * l), p = U(U(r * a) * u), d = U(U(i * s) * l);
    return h === c && p === d;
  }
  negate() {
    return new Q(this.x, U(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = U(e * e), o = U(n * n), i = U(o * o), a = e + o, l = U(De * (U(a * a) - s - i)), u = U(Jn * s), h = U(u * u), c = U(h - De * l), p = U(u * (l - c) - ga * i), d = U(De * n * r);
    return new Q(c, p, d);
  }
  add(e) {
    ya(e);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = e;
    if (o === Y || i === Y)
      return this;
    if (n === Y || r === Y)
      return e;
    const l = U(s * s), u = U(a * a), h = U(n * u), c = U(o * l), p = U(U(r * a) * u), d = U(U(i * s) * l), w = U(c - h), y = U(d - p);
    if (w === Y)
      return y === Y ? this.double() : Q.ZERO;
    const v = U(w * w), L = U(w * v), O = U(h * v), x = U(y * y - L - De * O), $ = U(y * (O - x) - p * L), A = U(s * a * w);
    return new Q(x, $, A);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = Q.ZERO;
    if (typeof e == "bigint" && e === Y)
      return n;
    let r = Ea(e);
    if (r === ot)
      return this;
    if (!Cr) {
      let c = n, p = this;
      for (; r > Y; )
        r & ot && (c = c.add(p)), p = p.double(), r >>= ot;
      return c;
    }
    let { k1neg: s, k1: o, k2neg: i, k2: a } = Or.splitScalar(r), l = n, u = n, h = this;
    for (; o > Y || a > Y; )
      o & ot && (l = l.add(h)), a & ot && (u = u.add(h)), h = h.double(), o >>= ot, a >>= ot;
    return s && (l = l.negate()), i && (u = u.negate()), u = new Q(U(u.x * Or.beta), u.y, u.z), l.add(u);
  }
  precomputeWindow(e) {
    const n = Cr ? 128 / e + 1 : 256 / e + 1, r = [];
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
    let s = n && Eo.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = Q.normalizeZ(s), Eo.set(n, s)));
    let o = Q.ZERO, i = Q.BASE;
    const a = 1 + (Cr ? 128 / r : 256 / r), l = 2 ** (r - 1), u = BigInt(2 ** r - 1), h = 2 ** r, c = BigInt(r);
    for (let p = 0; p < a; p++) {
      const d = p * l;
      let w = Number(e & u);
      e >>= c, w > l && (w -= h, e += ot);
      const y = d, v = d + Math.abs(w) - 1, L = p % 2 !== 0, O = w < 0;
      w === 0 ? i = i.add(kr(L, s[y])) : o = o.add(kr(O, s[v]));
    }
    return { p: o, f: i };
  }
  multiply(e, n) {
    let r = Ea(e), s, o;
    if (Cr) {
      const { k1neg: i, k1: a, k2neg: l, k2: u } = Or.splitScalar(r);
      let { p: h, f: c } = this.wNAF(a, n), { p, f: d } = this.wNAF(u, n);
      h = kr(i, h), p = kr(l, p), p = new Q(U(p.x * Or.beta), p.y, p.z), s = h.add(p), o = c.add(d);
    } else {
      const { p: i, f: a } = this.wNAF(r, n);
      s = i, o = a;
    }
    return Q.normalizeZ([s, o])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, o = this.equals(Q.ZERO);
    e == null && (e = o ? ga : Fn(s));
    const i = e, a = U(i * i), l = U(a * i), u = U(n * a), h = U(r * l), c = U(s * i);
    if (o)
      return Z.ZERO;
    if (c !== ot)
      throw new Error("invZ was invalid");
    return new Z(u, h);
  }
}
Q.BASE = new Q(nt.Gx, nt.Gy, ot);
Q.ZERO = new Q(Y, ot, Y);
function kr(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Eo = /* @__PURE__ */ new WeakMap();
class Z {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Eo.delete(this);
  }
  hasEvenY() {
    return this.y % De === Y;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = _t(n ? e : e.subarray(1));
    if (!ts(r))
      throw new Error("Point is not on curve");
    const s = wa(r);
    let o = qu(s);
    const i = (o & ot) === ot;
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
    if (r === os && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === is && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${os} compressed bytes or ${is} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Z.BASE.multiply(Qe(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: o } = $l(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const i = si(Wt(e)), { n: a } = nt, l = r === 2 || r === 3 ? s + a : s, u = Fn(l, a), h = U(-i * u, a), c = U(o * u, a), p = r & 1 ? "03" : "02", d = Z.fromHex(p + Te(l)), w = Z.BASE.multiplyAndAddUnsafe(d, h, c);
    if (!w)
      throw new Error("Cannot recover signature: point at infinify");
    return w.assertValidity(), w;
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
    if (!ts(n) || !ts(r))
      throw new Error(e);
    const s = U(r * r), o = wa(n);
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
    const s = Q.fromAffine(this), o = n === Y || n === ot || this !== Z.BASE ? s.multiplyUnsafe(n) : s.multiply(n), i = Q.fromAffine(e).multiplyUnsafe(r), a = o.add(i);
    return a.equals(Q.ZERO) ? void 0 : a.toAffine();
  }
}
Z.BASE = new Z(nt.Gx, nt.Gy);
Z.ZERO = new Z(Y, Y);
function ma(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Sa(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Hn(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: _t(n), left: t.subarray(e + 2) };
}
function Ku(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Hn(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Sa(t.subarray(2)), { data: r, left: s } = Sa(n);
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
    return new se(as(s.slice(0, 64)), as(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Ku(n ? e : Fe(e));
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
    const e = nt.n >> ot;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new se(this.r, U(-this.s, nt.n)) : this;
  }
  toDERRawBytes() {
    return Fe(this.toDERHex());
  }
  toDERHex() {
    const e = ma(Xn(this.s)), n = ma(Xn(this.r)), r = e.length / 2, s = n.length / 2, o = Xn(r), i = Xn(s);
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
const zu = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Hn(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += zu[t[n]];
  return e;
}
const ju = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Te(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Y <= t && t < ju))
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
function as(t) {
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
  return as(Hn(t));
}
function Wt(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Fe(t);
}
function Ea(t) {
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
function qu(t) {
  const { P: e } = nt, n = BigInt(6), r = BigInt(11), s = BigInt(22), o = BigInt(23), i = BigInt(44), a = BigInt(88), l = t * t * t % e, u = l * l * t % e, h = Ht(u, Jn) * u % e, c = Ht(h, Jn) * u % e, p = Ht(c, De) * l % e, d = Ht(p, r) * p % e, w = Ht(d, s) * d % e, y = Ht(w, i) * w % e, v = Ht(y, a) * y % e, L = Ht(v, i) * w % e, O = Ht(L, Jn) * u % e, x = Ht(O, o) * d % e, $ = Ht(x, n) * l % e, A = Ht($, De);
  if (A * A % e !== t)
    throw new Error("Cannot find square root");
  return A;
}
function Fn(t, e = nt.P) {
  if (t === Y || e <= Y)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = U(t, e), r = e, s = Y, o = ot;
  for (; n !== Y; ) {
    const a = r / n, l = r % n, u = s - o * a;
    r = n, n = l, s = o, o = u;
  }
  if (r !== ot)
    throw new Error("invert: does not exist");
  return U(s, e);
}
function Wu(t, e = nt.P) {
  const n = new Array(t.length), r = t.reduce((o, i, a) => i === Y ? o : (n[a] = o, U(o * i, e)), ot), s = Fn(r, e);
  return t.reduceRight((o, i, a) => i === Y ? o : (n[a] = U(o * n[a], e), U(o * i, e)), s), n;
}
function Xu(t) {
  const e = t.length * 8 - Ze * 8, n = _t(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function si(t, e = !1) {
  const n = Xu(t);
  if (e)
    return n;
  const { n: r } = nt;
  return n >= r ? n - r : n;
}
let $n, Zn;
class vl {
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
    return Zn(this.k, ...e);
  }
  checkSync() {
    if (typeof Zn != "function")
      throw new ri("hmacSha256Sync needs to be set");
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
function ts(t) {
  return Y < t && t < nt.P;
}
function Bl(t, e, n, r = !0) {
  const { n: s } = nt, o = si(t, !0);
  if (!In(o))
    return;
  const i = Fn(o, s), a = Z.BASE.multiply(o), l = U(a.x, s);
  if (l === Y)
    return;
  const u = U(i * U(e + n * l, s), s);
  if (u === Y)
    return;
  let h = new se(l, u), c = (a.x === h.r ? 0 : 2) | Number(a.y & ot);
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
    e = as(t);
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
function oi(t) {
  return t instanceof Z ? (t.assertValidity(), t) : Z.fromHex(t);
}
function $l(t) {
  if (t instanceof se)
    return t.assertValidity(), t;
  try {
    return se.fromDER(t);
  } catch {
    return se.fromCompact(t);
  }
}
function ii(t, e = !1) {
  return Z.fromPrivateKey(t).toRawBytes(e);
}
function Yu(t, e, n, r = !1) {
  return Z.fromSignature(t, e, n).toRawBytes(r);
}
function Aa(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === os || r === is : n ? r === os * 2 || r === is * 2 : t instanceof Z;
}
function ai(t, e, n = !1) {
  if (Aa(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Aa(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = oi(e);
  return r.assertValidity(), r.multiply(Qe(t)).toRawBytes(n);
}
function _l(t) {
  const e = t.length > Nt ? t.slice(0, Nt) : t;
  return _t(e);
}
function Ju(t) {
  const e = _l(t), n = U(e, nt.n);
  return Hl(n < Y ? e : n);
}
function Hl(t) {
  return Ln(t);
}
function Ll(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Wt(t), s = Qe(e), o = [Hl(s), Ju(r)];
  if (n != null) {
    n === !0 && (n = ct.randomBytes(Nt));
    const l = Wt(n);
    if (l.length !== Nt)
      throw new Error(`sign: Expected ${Nt} bytes of extra data`);
    o.push(l);
  }
  const i = Pe(...o), a = _l(r);
  return { seed: i, m: a, d: s };
}
function Il(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: o } = Object.assign({ canonical: !0, der: !0 }, e), i = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return o ? [i, r] : i;
}
async function Zu(t, e, n = {}) {
  const { seed: r, m: s, d: o } = Ll(t, e, n.extraEntropy), i = new vl(Al, Ze);
  await i.reseed(r);
  let a;
  for (; !(a = Bl(await i.generate(), s, o, n.canonical)); )
    await i.reseed();
  return Il(a, n);
}
function Ul(t, e, n = {}) {
  const { seed: r, m: s, d: o } = Ll(t, e, n.extraEntropy), i = new vl(Al, Ze);
  i.reseedSync(r);
  let a;
  for (; !(a = Bl(i.generateSync(), s, o, n.canonical)); )
    i.reseedSync();
  return Il(a, n);
}
const Qu = { strict: !0 };
function td(t, e, n, r = Qu) {
  let s;
  try {
    s = $l(t), e = Wt(e);
  } catch {
    return !1;
  }
  const { r: o, s: i } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = si(e);
  let l;
  try {
    l = oi(n);
  } catch {
    return !1;
  }
  const { n: u } = nt, h = Fn(i, u), c = U(a * h, u), p = U(o * h, u), d = Z.BASE.multiplyAndAddUnsafe(l, c, p);
  return d ? U(d.x, u) === o : !1;
}
function cs(t) {
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
    if (!ts(e) || !In(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Te(this.r) + Te(this.s);
  }
  toRawBytes() {
    return Fe(this.toHex());
  }
}
function ed(t) {
  return Z.fromPrivateKey(t).toRawX();
}
class Ol {
  constructor(e, n, r = ct.randomBytes()) {
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
    const { m: e, d: n, px: r, rand: s } = this, o = ct.taggedHash, i = this.initNonce(n, await o(ke.aux, s)), { R: a, rx: l, k: u } = this.finalizeNonce(await o(ke.nonce, i, r, e)), h = cs(await o(ke.challenge, l, r, e)), c = this.finalizeSig(a, u, h, n);
    return await Pl(c, e, r) || this.error(), c;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, o = ct.taggedHashSync, i = this.initNonce(n, o(ke.aux, s)), { R: a, rx: l, k: u } = this.finalizeNonce(o(ke.nonce, i, r, e)), h = cs(o(ke.challenge, l, r, e)), c = this.finalizeSig(a, u, h, n);
    return Nl(c, e, r) || this.error(), c;
  }
}
async function nd(t, e, n) {
  return new Ol(t, e, n).calc();
}
function rd(t, e, n) {
  return new Ol(t, e, n).calcSync();
}
function Cl(t, e, n) {
  const r = t instanceof Un, s = r ? t : Un.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Wt(e),
    P: oi(n)
  };
}
function kl(t, e, n, r) {
  const s = Z.BASE.multiplyAndAddUnsafe(e, Qe(n), U(-r, nt.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Pl(t, e, n) {
  try {
    const { r, s, m: o, P: i } = Cl(t, e, n), a = cs(await ct.taggedHash(ke.challenge, Ln(r), i.toRawX(), o));
    return kl(r, i, s, a);
  } catch {
    return !1;
  }
}
function Nl(t, e, n) {
  try {
    const { r, s, m: o, P: i } = Cl(t, e, n), a = cs(ct.taggedHashSync(ke.challenge, Ln(r), i.toRawX(), o));
    return kl(r, i, s, a);
  } catch (r) {
    if (r instanceof ri)
      throw r;
    return !1;
  }
}
const sd = {
  Signature: Un,
  getPublicKey: ed,
  sign: nd,
  verify: Pl,
  signSync: rd,
  verifySync: Nl
};
Z.BASE._setWindowSize(8);
const vt = {
  node: El,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, ke = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Pr = {}, ct = {
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
    const n = U(_t(t), nt.n - ot) + ot;
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
  randomPrivateKey: () => ct.hashToPrivateKey(ct.randomBytes(Ze + 8)),
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
    let n = Pr[t];
    if (n === void 0) {
      const r = await ct.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Pe(r, r), Pr[t] = n;
    }
    return ct.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof $n != "function")
      throw new ri("sha256Sync is undefined, you need to set it");
    let n = Pr[t];
    if (n === void 0) {
      const r = $n(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Pe(r, r), Pr[t] = n;
    }
    return $n(n, ...e);
  },
  _JacobianPoint: Q
};
Object.defineProperties(ct, {
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
const od = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: nt,
  Point: Z,
  Signature: se,
  getPublicKey: ii,
  getSharedSecret: ai,
  recoverPublicKey: Yu,
  schnorr: sd,
  sign: Zu,
  signSync: Ul,
  utils: ct,
  verify: td
}, Symbol.toStringTag, { value: "Module" }));
var yt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function id(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function lr(t) {
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
var Mn = {}, ci = {};
const mn = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Dl(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Ao(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Re(t, ...e) {
  if (!Dl(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function Tl(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Ao(t.outputLen), Ao(t.blockLen);
}
function nr(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Fl(t, e) {
  Re(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function ad(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function cd(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function rr(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function es(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Ut(t, e) {
  return t << 32 - e | t >>> e;
}
function ld(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const li = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function fi(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const Ml = li ? (t) => t : (t) => fi(t), fd = Ml;
function Rl(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = fi(t[e]);
  return t;
}
const hd = li ? (t) => t : Rl, Gl = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", ud = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function dd(t) {
  if (Re(t), Gl)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += ud[t[n]];
  return e;
}
const ee = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function va(t) {
  if (t >= ee._0 && t <= ee._9)
    return t - ee._0;
  if (t >= ee.A && t <= ee.F)
    return t - (ee.A - 10);
  if (t >= ee.a && t <= ee.f)
    return t - (ee.a - 10);
}
function pd(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (Gl)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, o = 0; s < n; s++, o += 2) {
    const i = va(t.charCodeAt(o)), a = va(t.charCodeAt(o + 1));
    if (i === void 0 || a === void 0) {
      const l = t[o] + t[o + 1];
      throw new Error('hex string expected, got non-hex character "' + l + '" at index ' + o);
    }
    r[s] = i * 16 + a;
  }
  return r;
}
const Vl = async () => {
};
async function bd(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const o = Date.now() - r;
    o >= 0 && o < e || (await Vl(), r += o);
  }
}
function hi(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function gd(t) {
  return new TextDecoder().decode(t);
}
function Rn(t) {
  return typeof t == "string" && (t = hi(t)), Re(t), t;
}
function xd(t) {
  return typeof t == "string" && (t = hi(t)), Re(t), t;
}
function wd(...t) {
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
function yd(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let ui = class {
};
function vs(t) {
  const e = (r) => t().update(Rn(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Kl(t) {
  const e = (r, s) => t(s).update(Rn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function zl(t) {
  const e = (r, s) => t(s).update(Rn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const md = vs, Sd = Kl, Ed = zl;
function Ad(t = 32) {
  if (mn && typeof mn.getRandomValues == "function")
    return mn.getRandomValues(new Uint8Array(t));
  if (mn && typeof mn.randomBytes == "function")
    return Uint8Array.from(mn.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const vd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: ui,
  abytes: Re,
  aexists: nr,
  ahash: Tl,
  anumber: Ao,
  aoutput: Fl,
  asyncLoop: bd,
  byteSwap: fi,
  byteSwap32: Rl,
  byteSwapIfBE: fd,
  bytesToHex: dd,
  bytesToUtf8: gd,
  checkOpts: yd,
  clean: rr,
  concatBytes: wd,
  createHasher: vs,
  createOptHasher: Kl,
  createView: es,
  createXOFer: zl,
  hexToBytes: pd,
  isBytes: Dl,
  isLE: li,
  kdfInputToBytes: xd,
  nextTick: Vl,
  randomBytes: Ad,
  rotl: ld,
  rotr: Ut,
  swap32IfBE: hd,
  swap8IfBE: Ml,
  toBytes: Rn,
  u32: cd,
  u8: ad,
  utf8ToBytes: hi,
  wrapConstructor: md,
  wrapConstructorWithOpts: Sd,
  wrapXOFConstructorWithOpts: Ed
}, Symbol.toStringTag, { value: "Module" })), fr = /* @__PURE__ */ lr(vd);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = fr;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(i, a) {
    if (!i.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    i.length % 2 !== 0 && (i = `0${i}`), i = i.toLowerCase();
    let l = [], u = 0;
    for (let d = i.length - 1; d >= 0; d--)
      if (u < 4) {
        const w = n.indexOf(i[d]) >> u;
        let y = 0;
        d !== 0 && (y = n.indexOf(i[d - 1]));
        const v = 1 + u, L = y % (1 << v) << 5 - v, O = t.c32[w + L];
        u = v, l.unshift(O);
      } else
        u = 0;
    let h = 0;
    for (let d = 0; d < l.length && l[d] === "0"; d++)
      h++;
    l = l.slice(h);
    const c = new TextDecoder().decode((0, e.hexToBytes)(i)).match(/^\u0000*/), p = c ? c[0].length : 0;
    for (let d = 0; d < p; d++)
      l.unshift(t.c32[0]);
    if (a) {
      const d = a - l.length;
      for (let w = 0; w < d; w++)
        l.unshift(t.c32[0]);
    }
    return l.join("");
  }
  t.c32encode = r;
  function s(i) {
    return i.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  t.c32normalize = s;
  function o(i, a) {
    if (i = s(i), !i.match(`^[${t.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const l = i.match(`^${t.c32[0]}*`), u = l ? l[0].length : 0;
    let h = [], c = 0, p = 0;
    for (let y = i.length - 1; y >= 0; y--) {
      p === 4 && (h.unshift(n[c]), p = 0, c = 0);
      const L = (t.c32.indexOf(i[y]) << p) + c, O = n[L % 16];
      if (p += 1, c = L >> 4, c > 1 << p)
        throw new Error("Panic error in decoding.");
      h.unshift(O);
    }
    h.unshift(n[c]), h.length % 2 === 1 && h.unshift("0");
    let d = 0;
    for (let y = 0; y < h.length && h[y] === "0"; y++)
      d++;
    h = h.slice(d - d % 2);
    let w = h.join("");
    for (let y = 0; y < u; y++)
      w = `00${w}`;
    if (a) {
      const y = a * 2 - w.length;
      for (let v = 0; v < y; v += 2)
        w = `00${w}`;
    }
    return w;
  }
  t.c32decode = o;
})(ci);
var tn = {};
function Bd(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), l = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + l, i, r), t.setUint32(e + u, a, r);
}
function $d(t, e, n) {
  return t & e ^ ~t & n;
}
function _d(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class Hd extends ui {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = es(this.buffer);
  }
  update(e) {
    nr(this), e = Rn(e), Re(e);
    const { view: n, buffer: r, blockLen: s } = this, o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const l = es(e);
        for (; s <= o - i; i += s)
          this.process(l, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    nr(this), Fl(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, rr(this.buffer.subarray(i)), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let c = i; c < s; c++)
      n[c] = 0;
    Bd(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = es(e), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = l / 4, h = this.get();
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
]), Ld = /* @__PURE__ */ Uint32Array.from([
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
let di = class extends Hd {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = de[0] | 0, this.B = de[1] | 0, this.C = de[2] | 0, this.D = de[3] | 0, this.E = de[4] | 0, this.F = de[5] | 0, this.G = de[6] | 0, this.H = de[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: a, H: l } = this;
    return [e, n, r, s, o, i, a, l];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, l) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = l | 0;
  }
  process(e, n) {
    for (let c = 0; c < 16; c++, n += 4)
      be[c] = e.getUint32(n, !1);
    for (let c = 16; c < 64; c++) {
      const p = be[c - 15], d = be[c - 2], w = Ut(p, 7) ^ Ut(p, 18) ^ p >>> 3, y = Ut(d, 17) ^ Ut(d, 19) ^ d >>> 10;
      be[c] = y + be[c - 7] + w + be[c - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: l, G: u, H: h } = this;
    for (let c = 0; c < 64; c++) {
      const p = Ut(a, 6) ^ Ut(a, 11) ^ Ut(a, 25), d = h + p + $d(a, l, u) + Ld[c] + be[c] | 0, y = (Ut(r, 2) ^ Ut(r, 13) ^ Ut(r, 22)) + _d(r, s, o) | 0;
      h = u, u = l, l = a, a = i + d | 0, i = o, o = s, s = r, r = d + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, l = l + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, l, u, h);
  }
  roundClean() {
    rr(be);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), rr(this.buffer);
  }
}, jl = class extends di {
  constructor() {
    super(28), this.A = pe[0] | 0, this.B = pe[1] | 0, this.C = pe[2] | 0, this.D = pe[3] | 0, this.E = pe[4] | 0, this.F = pe[5] | 0, this.G = pe[6] | 0, this.H = pe[7] | 0;
  }
};
const Id = /* @__PURE__ */ vs(() => new di()), Ud = /* @__PURE__ */ vs(() => new jl()), Od = di, Cd = Id, kd = jl, Pd = Ud, Nd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: kd,
  SHA256: Od,
  sha224: Pd,
  sha256: Cd
}, Symbol.toStringTag, { value: "Module" })), Bs = /* @__PURE__ */ lr(Nd);
Object.defineProperty(tn, "__esModule", { value: !0 });
tn.c32checkDecode = tn.c32checkEncode = void 0;
const Ba = Bs, $a = fr, Qn = ci;
function ql(t) {
  const e = (0, Ba.sha256)((0, Ba.sha256)((0, $a.hexToBytes)(t)));
  return (0, $a.bytesToHex)(e.slice(0, 4));
}
function Dd(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = ql(`${n}${e}`), s = (0, Qn.c32encode)(`${e}${r}`);
  return `${Qn.c32[t]}${s}`;
}
tn.c32checkEncode = Dd;
function Td(t) {
  t = (0, Qn.c32normalize)(t);
  const e = (0, Qn.c32decode)(t.slice(1)), n = t[0], r = Qn.c32.indexOf(n), s = e.slice(-8);
  let o = r.toString(16);
  if (o.length === 1 && (o = `0${o}`), ql(`${o}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
tn.c32checkDecode = Td;
var Wl = {}, On = {};
function Fd(t) {
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
  var i = t.length, a = t.charAt(0), l = Math.log(i) / Math.log(256), u = Math.log(256) / Math.log(i);
  function h(d) {
    if (d instanceof Uint8Array || (ArrayBuffer.isView(d) ? d = new Uint8Array(d.buffer, d.byteOffset, d.byteLength) : Array.isArray(d) && (d = Uint8Array.from(d))), !(d instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (d.length === 0)
      return "";
    for (var w = 0, y = 0, v = 0, L = d.length; v !== L && d[v] === 0; )
      v++, w++;
    for (var O = (L - v) * u + 1 >>> 0, x = new Uint8Array(O); v !== L; ) {
      for (var $ = d[v], A = 0, P = O - 1; ($ !== 0 || A < y) && P !== -1; P--, A++)
        $ += 256 * x[P] >>> 0, x[P] = $ % i >>> 0, $ = $ / i >>> 0;
      if ($ !== 0)
        throw new Error("Non-zero carry");
      y = A, v++;
    }
    for (var T = O - y; T !== O && x[T] === 0; )
      T++;
    for (var C = a.repeat(w); T < O; ++T)
      C += t.charAt(x[T]);
    return C;
  }
  function c(d) {
    if (typeof d != "string")
      throw new TypeError("Expected String");
    if (d.length === 0)
      return new Uint8Array();
    for (var w = 0, y = 0, v = 0; d[w] === a; )
      y++, w++;
    for (var L = (d.length - w) * l + 1 >>> 0, O = new Uint8Array(L); d[w]; ) {
      var x = d.charCodeAt(w);
      if (x > 255)
        return;
      var $ = e[x];
      if ($ === 255)
        return;
      for (var A = 0, P = L - 1; ($ !== 0 || A < v) && P !== -1; P--, A++)
        $ += i * O[P] >>> 0, O[P] = $ % 256 >>> 0, $ = $ / 256 >>> 0;
      if ($ !== 0)
        throw new Error("Non-zero carry");
      v = A, w++;
    }
    for (var T = L - v; T !== L && O[T] === 0; )
      T++;
    for (var C = new Uint8Array(y + (L - T)), I = y; T !== L; )
      C[I++] = O[T++];
    return C;
  }
  function p(d) {
    var w = c(d);
    if (w)
      return w;
    throw new Error("Non-base" + i + " character");
  }
  return {
    encode: h,
    decodeUnsafe: c,
    decode: p
  };
}
var Xl = Fd;
Object.defineProperty(On, "__esModule", { value: !0 });
On.decode = On.encode = void 0;
const ls = Bs, _a = fr, Yl = Xl, Jl = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function Md(t, e = "00") {
  const n = typeof t == "string" ? (0, _a.hexToBytes)(t) : t, r = typeof e == "string" ? (0, _a.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, ls.sha256)((0, ls.sha256)(new Uint8Array([...r, ...n])));
  return Yl(Jl).encode([...r, ...n, ...s.slice(0, 4)]);
}
On.encode = Md;
function Rd(t) {
  const e = Yl(Jl).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, ls.sha256)((0, ls.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((o, i) => {
    if (o !== s[i])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
On.decode = Rd;
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
  function l(h, c = -1) {
    const p = n.decode(h), d = (0, r.bytesToHex)(p.data), w = parseInt((0, r.bytesToHex)(p.prefix), 16);
    let y;
    return c < 0 ? (y = w, s[w] !== void 0 && (y = s[w])) : y = c, i(y, d);
  }
  t.b58ToC32 = l;
  function u(h, c = -1) {
    const p = a(h), d = p[0], w = p[1];
    let y;
    c < 0 ? (y = d, o[d] !== void 0 && (y = o[d])) : y = c;
    let v = y.toString(16);
    return v.length === 1 && (v = `0${v}`), n.encode(w, v);
  }
  t.c32ToB58 = u;
})(Wl);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = ci;
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
  const r = Wl;
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
var fs = { exports: {} };
fs.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, o = "[object Arguments]", i = "[object Array]", a = "[object Boolean]", l = "[object Date]", u = "[object Error]", h = "[object Function]", c = "[object GeneratorFunction]", p = "[object Map]", d = "[object Number]", w = "[object Object]", y = "[object Promise]", v = "[object RegExp]", L = "[object Set]", O = "[object String]", x = "[object Symbol]", $ = "[object WeakMap]", A = "[object ArrayBuffer]", P = "[object DataView]", T = "[object Float32Array]", C = "[object Float64Array]", I = "[object Int8Array]", g = "[object Int16Array]", E = "[object Int32Array]", H = "[object Uint8Array]", k = "[object Uint8ClampedArray]", M = "[object Uint16Array]", N = "[object Uint32Array]", et = /[\\^$.*+?()[\]{}|]/g, ce = /\w*$/, Zt = /^\[object .+?Constructor\]$/, rt = /^(?:0|[1-9]\d*)$/, j = {};
  j[o] = j[i] = j[A] = j[P] = j[a] = j[l] = j[T] = j[C] = j[I] = j[g] = j[E] = j[p] = j[d] = j[w] = j[v] = j[L] = j[O] = j[x] = j[H] = j[k] = j[M] = j[N] = !0, j[u] = j[h] = j[$] = !1;
  var zn = typeof yt == "object" && yt && yt.Object === Object && yt, hn = typeof self == "object" && self && self.Object === Object && self, it = zn || hn || Function("return this")(), At = e && !e.nodeType && e, br = At && !0 && t && !t.nodeType && t, Fs = br && br.exports === At;
  function un(f, m) {
    return f.set(m[0], m[1]), f;
  }
  function Ms(f, m) {
    return f.add(m), f;
  }
  function Rs(f, m) {
    for (var B = -1, D = f ? f.length : 0; ++B < D && m(f[B], B, f) !== !1; )
      ;
    return f;
  }
  function gr(f, m) {
    for (var B = -1, D = m.length, ut = f.length; ++B < D; )
      f[ut + B] = m[B];
    return f;
  }
  function xr(f, m, B, D) {
    for (var ut = -1, St = f ? f.length : 0; ++ut < St; )
      B = m(B, f[ut], ut, f);
    return B;
  }
  function wr(f, m) {
    for (var B = -1, D = Array(f); ++B < f; )
      D[B] = m(B);
    return D;
  }
  function yr(f, m) {
    return f == null ? void 0 : f[m];
  }
  function mr(f) {
    var m = !1;
    if (f != null && typeof f.toString != "function")
      try {
        m = !!(f + "");
      } catch {
      }
    return m;
  }
  function Sr(f) {
    var m = -1, B = Array(f.size);
    return f.forEach(function(D, ut) {
      B[++m] = [ut, D];
    }), B;
  }
  function tt(f, m) {
    return function(B) {
      return f(m(B));
    };
  }
  function dn(f) {
    var m = -1, B = Array(f.size);
    return f.forEach(function(D) {
      B[++m] = D;
    }), B;
  }
  var pt = Array.prototype, Er = Function.prototype, Ge = Object.prototype, pn = it["__core-js_shared__"], Ar = function() {
    var f = /[^.]+$/.exec(pn && pn.keys && pn.keys.IE_PROTO || "");
    return f ? "Symbol(src)_1." + f : "";
  }(), Ve = Er.toString, Dt = Ge.hasOwnProperty, Ke = Ge.toString, Gs = RegExp(
    "^" + Ve.call(Dt).replace(et, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), jn = Fs ? it.Buffer : void 0, qn = it.Symbol, Wn = it.Uint8Array, Vs = tt(Object.getPrototypeOf, Object), vr = Object.create, Ks = Ge.propertyIsEnumerable, S = pt.splice, F = Object.getOwnPropertySymbols, J = jn ? jn.isBuffer : void 0, X = tt(Object.keys, Object), ht = xn(it, "DataView"), dt = xn(it, "Map"), bt = xn(it, "Promise"), gt = xn(it, "Set"), Tt = xn(it, "WeakMap"), xt = xn(Object, "create"), Gi = qe(ht), T0 = qe(dt), F0 = qe(bt), M0 = qe(gt), R0 = qe(Tt), Vi = qn ? qn.prototype : void 0, Ki = Vi ? Vi.valueOf : void 0;
  function ze(f) {
    var m = -1, B = f ? f.length : 0;
    for (this.clear(); ++m < B; ) {
      var D = f[m];
      this.set(D[0], D[1]);
    }
  }
  function G0() {
    this.__data__ = xt ? xt(null) : {};
  }
  function V0(f) {
    return this.has(f) && delete this.__data__[f];
  }
  function K0(f) {
    var m = this.__data__;
    if (xt) {
      var B = m[f];
      return B === r ? void 0 : B;
    }
    return Dt.call(m, f) ? m[f] : void 0;
  }
  function z0(f) {
    var m = this.__data__;
    return xt ? m[f] !== void 0 : Dt.call(m, f);
  }
  function j0(f, m) {
    var B = this.__data__;
    return B[f] = xt && m === void 0 ? r : m, this;
  }
  ze.prototype.clear = G0, ze.prototype.delete = V0, ze.prototype.get = K0, ze.prototype.has = z0, ze.prototype.set = j0;
  function Qt(f) {
    var m = -1, B = f ? f.length : 0;
    for (this.clear(); ++m < B; ) {
      var D = f[m];
      this.set(D[0], D[1]);
    }
  }
  function q0() {
    this.__data__ = [];
  }
  function W0(f) {
    var m = this.__data__, B = Br(m, f);
    if (B < 0)
      return !1;
    var D = m.length - 1;
    return B == D ? m.pop() : S.call(m, B, 1), !0;
  }
  function X0(f) {
    var m = this.__data__, B = Br(m, f);
    return B < 0 ? void 0 : m[B][1];
  }
  function Y0(f) {
    return Br(this.__data__, f) > -1;
  }
  function J0(f, m) {
    var B = this.__data__, D = Br(B, f);
    return D < 0 ? B.push([f, m]) : B[D][1] = m, this;
  }
  Qt.prototype.clear = q0, Qt.prototype.delete = W0, Qt.prototype.get = X0, Qt.prototype.has = Y0, Qt.prototype.set = J0;
  function bn(f) {
    var m = -1, B = f ? f.length : 0;
    for (this.clear(); ++m < B; ) {
      var D = f[m];
      this.set(D[0], D[1]);
    }
  }
  function Z0() {
    this.__data__ = {
      hash: new ze(),
      map: new (dt || Qt)(),
      string: new ze()
    };
  }
  function Q0(f) {
    return $r(this, f).delete(f);
  }
  function th(f) {
    return $r(this, f).get(f);
  }
  function eh(f) {
    return $r(this, f).has(f);
  }
  function nh(f, m) {
    return $r(this, f).set(f, m), this;
  }
  bn.prototype.clear = Z0, bn.prototype.delete = Q0, bn.prototype.get = th, bn.prototype.has = eh, bn.prototype.set = nh;
  function gn(f) {
    this.__data__ = new Qt(f);
  }
  function rh() {
    this.__data__ = new Qt();
  }
  function sh(f) {
    return this.__data__.delete(f);
  }
  function oh(f) {
    return this.__data__.get(f);
  }
  function ih(f) {
    return this.__data__.has(f);
  }
  function ah(f, m) {
    var B = this.__data__;
    if (B instanceof Qt) {
      var D = B.__data__;
      if (!dt || D.length < n - 1)
        return D.push([f, m]), this;
      B = this.__data__ = new bn(D);
    }
    return B.set(f, m), this;
  }
  gn.prototype.clear = rh, gn.prototype.delete = sh, gn.prototype.get = oh, gn.prototype.has = ih, gn.prototype.set = ah;
  function ch(f, m) {
    var B = qs(f) || Oh(f) ? wr(f.length, String) : [], D = B.length, ut = !!D;
    for (var St in f)
      Dt.call(f, St) && !(ut && (St == "length" || Hh(St, D))) && B.push(St);
    return B;
  }
  function zi(f, m, B) {
    var D = f[m];
    (!(Dt.call(f, m) && Xi(D, B)) || B === void 0 && !(m in f)) && (f[m] = B);
  }
  function Br(f, m) {
    for (var B = f.length; B--; )
      if (Xi(f[B][0], m))
        return B;
    return -1;
  }
  function lh(f, m) {
    return f && ji(m, Ws(m), f);
  }
  function zs(f, m, B, D, ut, St, te) {
    var Et;
    if (D && (Et = St ? D(f, ut, St, te) : D(f)), Et !== void 0)
      return Et;
    if (!_r(f))
      return f;
    var Zi = qs(f);
    if (Zi) {
      if (Et = Bh(f), !m)
        return Eh(f, Et);
    } else {
      var wn = je(f), Qi = wn == h || wn == c;
      if (kh(f))
        return bh(f, m);
      if (wn == w || wn == o || Qi && !St) {
        if (mr(f))
          return St ? f : {};
        if (Et = $h(Qi ? {} : f), !m)
          return Ah(f, lh(Et, f));
      } else {
        if (!j[wn])
          return St ? f : {};
        Et = _h(f, wn, zs, m);
      }
    }
    te || (te = new gn());
    var ta = te.get(f);
    if (ta)
      return ta;
    if (te.set(f, Et), !Zi)
      var ea = B ? vh(f) : Ws(f);
    return Rs(ea || f, function(Xs, Hr) {
      ea && (Hr = Xs, Xs = f[Hr]), zi(Et, Hr, zs(Xs, m, B, D, Hr, f, te));
    }), Et;
  }
  function fh(f) {
    return _r(f) ? vr(f) : {};
  }
  function hh(f, m, B) {
    var D = m(f);
    return qs(f) ? D : gr(D, B(f));
  }
  function uh(f) {
    return Ke.call(f);
  }
  function dh(f) {
    if (!_r(f) || Ih(f))
      return !1;
    var m = Ji(f) || mr(f) ? Gs : Zt;
    return m.test(qe(f));
  }
  function ph(f) {
    if (!Wi(f))
      return X(f);
    var m = [];
    for (var B in Object(f))
      Dt.call(f, B) && B != "constructor" && m.push(B);
    return m;
  }
  function bh(f, m) {
    if (m)
      return f.slice();
    var B = new f.constructor(f.length);
    return f.copy(B), B;
  }
  function js(f) {
    var m = new f.constructor(f.byteLength);
    return new Wn(m).set(new Wn(f)), m;
  }
  function gh(f, m) {
    var B = m ? js(f.buffer) : f.buffer;
    return new f.constructor(B, f.byteOffset, f.byteLength);
  }
  function xh(f, m, B) {
    var D = m ? B(Sr(f), !0) : Sr(f);
    return xr(D, un, new f.constructor());
  }
  function wh(f) {
    var m = new f.constructor(f.source, ce.exec(f));
    return m.lastIndex = f.lastIndex, m;
  }
  function yh(f, m, B) {
    var D = m ? B(dn(f), !0) : dn(f);
    return xr(D, Ms, new f.constructor());
  }
  function mh(f) {
    return Ki ? Object(Ki.call(f)) : {};
  }
  function Sh(f, m) {
    var B = m ? js(f.buffer) : f.buffer;
    return new f.constructor(B, f.byteOffset, f.length);
  }
  function Eh(f, m) {
    var B = -1, D = f.length;
    for (m || (m = Array(D)); ++B < D; )
      m[B] = f[B];
    return m;
  }
  function ji(f, m, B, D) {
    B || (B = {});
    for (var ut = -1, St = m.length; ++ut < St; ) {
      var te = m[ut], Et = void 0;
      zi(B, te, Et === void 0 ? f[te] : Et);
    }
    return B;
  }
  function Ah(f, m) {
    return ji(f, qi(f), m);
  }
  function vh(f) {
    return hh(f, Ws, qi);
  }
  function $r(f, m) {
    var B = f.__data__;
    return Lh(m) ? B[typeof m == "string" ? "string" : "hash"] : B.map;
  }
  function xn(f, m) {
    var B = yr(f, m);
    return dh(B) ? B : void 0;
  }
  var qi = F ? tt(F, Object) : Dh, je = uh;
  (ht && je(new ht(new ArrayBuffer(1))) != P || dt && je(new dt()) != p || bt && je(bt.resolve()) != y || gt && je(new gt()) != L || Tt && je(new Tt()) != $) && (je = function(f) {
    var m = Ke.call(f), B = m == w ? f.constructor : void 0, D = B ? qe(B) : void 0;
    if (D)
      switch (D) {
        case Gi:
          return P;
        case T0:
          return p;
        case F0:
          return y;
        case M0:
          return L;
        case R0:
          return $;
      }
    return m;
  });
  function Bh(f) {
    var m = f.length, B = f.constructor(m);
    return m && typeof f[0] == "string" && Dt.call(f, "index") && (B.index = f.index, B.input = f.input), B;
  }
  function $h(f) {
    return typeof f.constructor == "function" && !Wi(f) ? fh(Vs(f)) : {};
  }
  function _h(f, m, B, D) {
    var ut = f.constructor;
    switch (m) {
      case A:
        return js(f);
      case a:
      case l:
        return new ut(+f);
      case P:
        return gh(f, D);
      case T:
      case C:
      case I:
      case g:
      case E:
      case H:
      case k:
      case M:
      case N:
        return Sh(f, D);
      case p:
        return xh(f, D, B);
      case d:
      case O:
        return new ut(f);
      case v:
        return wh(f);
      case L:
        return yh(f, D, B);
      case x:
        return mh(f);
    }
  }
  function Hh(f, m) {
    return m = m ?? s, !!m && (typeof f == "number" || rt.test(f)) && f > -1 && f % 1 == 0 && f < m;
  }
  function Lh(f) {
    var m = typeof f;
    return m == "string" || m == "number" || m == "symbol" || m == "boolean" ? f !== "__proto__" : f === null;
  }
  function Ih(f) {
    return !!Ar && Ar in f;
  }
  function Wi(f) {
    var m = f && f.constructor, B = typeof m == "function" && m.prototype || Ge;
    return f === B;
  }
  function qe(f) {
    if (f != null) {
      try {
        return Ve.call(f);
      } catch {
      }
      try {
        return f + "";
      } catch {
      }
    }
    return "";
  }
  function Uh(f) {
    return zs(f, !0, !0);
  }
  function Xi(f, m) {
    return f === m || f !== f && m !== m;
  }
  function Oh(f) {
    return Ch(f) && Dt.call(f, "callee") && (!Ks.call(f, "callee") || Ke.call(f) == o);
  }
  var qs = Array.isArray;
  function Yi(f) {
    return f != null && Ph(f.length) && !Ji(f);
  }
  function Ch(f) {
    return Nh(f) && Yi(f);
  }
  var kh = J || Th;
  function Ji(f) {
    var m = _r(f) ? Ke.call(f) : "";
    return m == h || m == c;
  }
  function Ph(f) {
    return typeof f == "number" && f > -1 && f % 1 == 0 && f <= s;
  }
  function _r(f) {
    var m = typeof f;
    return !!f && (m == "object" || m == "function");
  }
  function Nh(f) {
    return !!f && typeof f == "object";
  }
  function Ws(f) {
    return Yi(f) ? ch(f) : ph(f);
  }
  function Dh() {
    return [];
  }
  function Th() {
    return !1;
  }
  t.exports = Uh;
})(fs, fs.exports);
fs.exports;
function vo(t) {
  return Mn.c32address(t.version, t.hash160);
}
function pi(t, e, n) {
  const r = e || 1, s = n || Yh;
  if (wp(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: er.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function bi(t) {
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
function Gd(t) {
  if (t.type === _.PrincipalStandard)
    return vo(t.address);
  if (t.type === _.PrincipalContract)
    return `${vo(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function Vd(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return jd(e, n);
  } else
    return Kd(t);
}
function Kd(t) {
  const e = bi(t);
  return { type: _.PrincipalStandard, address: e };
}
function zd(t) {
  return { type: _.PrincipalStandard, address: t };
}
function jd(t, e) {
  const n = bi(t), r = pi(e);
  return Zl(n, r);
}
function Zl(t, e) {
  if (cr(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: _.PrincipalContract, address: t, contractName: e };
}
function Qs(t, e = !1) {
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
      return Gd(t);
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
      return { type: Ne(t), value: Qs(t, !0), success: !1 };
    case _.ResponseOk:
      return { type: Ne(t), value: Qs(t, !0), success: !0 };
    default:
      return { type: Ne(t), value: Qs(t, !0) };
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
      return `(string-ascii ${pl(t.data).length})`;
    case _.StringUTF8:
      return `(string-utf8 ${cr(t.data).length})`;
  }
}
const qd = () => ({ type: _.BoolTrue }), Wd = () => ({ type: _.BoolFalse }), Ha = BigInt("0xffffffffffffffffffffffffffffffff"), Xd = BigInt(0), La = BigInt("0x7fffffffffffffffffffffffffffffff"), Ia = BigInt("-170141183460469231731687303715884105728"), Yd = (t) => {
  const e = Jo(t, !0);
  if (e > La)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${La}`);
  if (e < Ia)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Ia}`);
  return { type: _.Int, value: e };
}, Ql = (t) => {
  const e = Jo(t, !1);
  if (e < Xd)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Ha)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Ha}`);
  return { type: _.UInt, value: e };
}, Jd = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: _.Buffer, buffer: t };
};
function Zd() {
  return { type: _.OptionalNone };
}
function Qd(t) {
  return { type: _.OptionalSome, value: t };
}
function tp(t) {
  return { type: _.ResponseErr, value: t };
}
function ep(t) {
  return { type: _.ResponseOk, value: t };
}
function np(t) {
  return { type: _.List, list: t };
}
function tf(t) {
  for (const e in t)
    if (!yp(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: _.Tuple, data: t };
}
const ns = (t) => ({ type: _.StringASCII, data: t }), rp = (t) => ({ type: _.StringUTF8, data: t });
let ef = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, sp = class extends ef {
  constructor(e) {
    super(e);
  }
};
class to extends ef {
  constructor(e) {
    super(e);
  }
}
function nf(t) {
  const e = [];
  return e.push(_n(Zo(t.version, 1))), e.push(_n(t.hash160)), Tn(e);
}
function Ua(t) {
  const e = hl(oe(t.readBytes(1))), n = oe(t.readBytes(20));
  return { type: er.Address, version: e, hash160: n };
}
function rf(t) {
  const e = [], n = cr(t.content), r = n.byteLength;
  return e.push(_n(Zo(r, t.lengthPrefixBytes))), e.push(n), Tn(e);
}
function Oa(t, e, n) {
  e = e || 1;
  const r = hl(oe(t.readBytes(e))), s = dl(t.readBytes(r));
  return pi(s, e, 128);
}
function Xt(t, e) {
  return Tn([t, e]);
}
function op(t) {
  return new Uint8Array([t.type]);
}
function ip(t) {
  return t.type === _.OptionalNone ? new Uint8Array([t.type]) : Xt(t.type, hr(t.value));
}
function ap(t) {
  const e = new Uint8Array(4);
  return Es(e, t.buffer.length, 0), Xt(t.type, Qo(e, t.buffer));
}
function cp(t) {
  const e = ul(Rh(t.value, BigInt(Jh)), bl);
  return Xt(t.type, e);
}
function lp(t) {
  const e = ul(t.value, bl);
  return Xt(t.type, e);
}
function fp(t) {
  return Xt(t.type, nf(t.address));
}
function hp(t) {
  return Xt(t.type, Qo(nf(t.address), rf(t.contractName)));
}
function up(t) {
  return Xt(t.type, hr(t.value));
}
function dp(t) {
  const e = [], n = new Uint8Array(4);
  Es(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = hr(r);
    e.push(s);
  }
  return Xt(t.type, Tn(e));
}
function pp(t) {
  const e = [], n = new Uint8Array(4);
  Es(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = pi(s);
    e.push(rf(o));
    const i = hr(t.data[s]);
    e.push(i);
  }
  return Xt(t.type, Tn(e));
}
function sf(t, e) {
  const n = [], r = e == "ascii" ? pl(t.data) : cr(t.data), s = new Uint8Array(4);
  return Es(s, r.length, 0), n.push(s), n.push(r), Xt(t.type, Tn(n));
}
function bp(t) {
  return sf(t, "ascii");
}
function gp(t) {
  return sf(t, "utf8");
}
function hr(t) {
  switch (t.type) {
    case _.BoolTrue:
    case _.BoolFalse:
      return op(t);
    case _.OptionalNone:
    case _.OptionalSome:
      return ip(t);
    case _.Buffer:
      return ap(t);
    case _.UInt:
      return lp(t);
    case _.Int:
      return cp(t);
    case _.PrincipalStandard:
      return fp(t);
    case _.PrincipalContract:
      return hp(t);
    case _.ResponseOk:
    case _.ResponseErr:
      return up(t);
    case _.List:
      return dp(t);
    case _.Tuple:
      return pp(t);
    case _.StringASCII:
      return bp(t);
    case _.StringUTF8:
      return gp(t);
    default:
      throw new sp("Unable to serialize. Invalid Clarity Value.");
  }
}
function xp(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Ca = /* @__PURE__ */ new Map();
function of(t, e) {
  const n = Ca.get(t);
  if (n !== void 0)
    return n(e);
  const r = xp(t);
  return Ca.set(t, r), of(t, e);
}
class ka {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Xh(this.readBytes(4), 0);
  }
  readUInt8() {
    return Wh(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return qh(this.readBytes(2), 0);
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
    if (of(e, r))
      return r;
    throw n(r);
  }
}
function vn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new ka(_n(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new ka(t) : e = t;
  switch (e.readUInt8Enum(_, (r) => {
    throw new to(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case _.Int:
      return Yd(e.readBytes(16));
    case _.UInt:
      return Ql(e.readBytes(16));
    case _.Buffer:
      const r = e.readUInt32BE();
      return Jd(e.readBytes(r));
    case _.BoolTrue:
      return qd();
    case _.BoolFalse:
      return Wd();
    case _.PrincipalStandard:
      const s = Ua(e);
      return zd(s);
    case _.PrincipalContract:
      const o = Ua(e), i = Oa(e);
      return Zl(o, i);
    case _.ResponseOk:
      return ep(vn(e));
    case _.ResponseErr:
      return tp(vn(e));
    case _.OptionalNone:
      return Zd();
    case _.OptionalSome:
      return Qd(vn(e));
    case _.List:
      const a = e.readUInt32BE(), l = [];
      for (let y = 0; y < a; y++)
        l.push(vn(e));
      return np(l);
    case _.Tuple:
      const u = e.readUInt32BE(), h = {};
      for (let y = 0; y < u; y++) {
        const v = Oa(e).content;
        if (v === void 0)
          throw new to('"content" is undefined');
        h[v] = vn(e);
      }
      return tf(h);
    case _.StringASCII:
      const c = e.readUInt32BE(), p = zh(e.readBytes(c));
      return ns(p);
    case _.StringUTF8:
      const d = e.readUInt32BE(), w = dl(e.readBytes(d));
      return rp(w);
    default:
      throw new to("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const wp = (t, e) => t ? cr(t).length > e : !1;
function yp(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function af(t) {
  const e = hr(t);
  return `0x${oe(e)}`;
}
function mp(t) {
  return vn(t);
}
const Sp = (t) => {
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
      function l(g) {
        return typeof g != "string" && (g = String(g)), g;
      }
      function u(g) {
        var E = {
          next: function() {
            var H = g.shift();
            return { done: H === void 0, value: H };
          }
        };
        return r.iterable && (E[Symbol.iterator] = function() {
          return E;
        }), E;
      }
      function h(g) {
        this.map = {}, g instanceof h ? g.forEach(function(E, H) {
          this.append(H, E);
        }, this) : Array.isArray(g) ? g.forEach(function(E) {
          if (E.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + E.length);
          this.append(E[0], E[1]);
        }, this) : g && Object.getOwnPropertyNames(g).forEach(function(E) {
          this.append(E, g[E]);
        }, this);
      }
      h.prototype.append = function(g, E) {
        g = a(g), E = l(E);
        var H = this.map[g];
        this.map[g] = H ? H + ", " + E : E;
      }, h.prototype.delete = function(g) {
        delete this.map[a(g)];
      }, h.prototype.get = function(g) {
        return g = a(g), this.has(g) ? this.map[g] : null;
      }, h.prototype.has = function(g) {
        return this.map.hasOwnProperty(a(g));
      }, h.prototype.set = function(g, E) {
        this.map[a(g)] = l(E);
      }, h.prototype.forEach = function(g, E) {
        for (var H in this.map)
          this.map.hasOwnProperty(H) && g.call(E, this.map[H], H, this);
      }, h.prototype.keys = function() {
        var g = [];
        return this.forEach(function(E, H) {
          g.push(H);
        }), u(g);
      }, h.prototype.values = function() {
        var g = [];
        return this.forEach(function(E) {
          g.push(E);
        }), u(g);
      }, h.prototype.entries = function() {
        var g = [];
        return this.forEach(function(E, H) {
          g.push([H, E]);
        }), u(g);
      }, r.iterable && (h.prototype[Symbol.iterator] = h.prototype.entries);
      function c(g) {
        if (!g._noBody) {
          if (g.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          g.bodyUsed = !0;
        }
      }
      function p(g) {
        return new Promise(function(E, H) {
          g.onload = function() {
            E(g.result);
          }, g.onerror = function() {
            H(g.error);
          };
        });
      }
      function d(g) {
        var E = new FileReader(), H = p(E);
        return E.readAsArrayBuffer(g), H;
      }
      function w(g) {
        var E = new FileReader(), H = p(E), k = /charset=([A-Za-z0-9_-]+)/.exec(g.type), M = k ? k[1] : "utf-8";
        return E.readAsText(g, M), H;
      }
      function y(g) {
        for (var E = new Uint8Array(g), H = new Array(E.length), k = 0; k < E.length; k++)
          H[k] = String.fromCharCode(E[k]);
        return H.join("");
      }
      function v(g) {
        if (g.slice)
          return g.slice(0);
        var E = new Uint8Array(g.byteLength);
        return E.set(new Uint8Array(g)), E.buffer;
      }
      function L() {
        return this.bodyUsed = !1, this._initBody = function(g) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = g, g ? typeof g == "string" ? this._bodyText = g : r.blob && Blob.prototype.isPrototypeOf(g) ? this._bodyBlob = g : r.formData && FormData.prototype.isPrototypeOf(g) ? this._bodyFormData = g : r.searchParams && URLSearchParams.prototype.isPrototypeOf(g) ? this._bodyText = g.toString() : r.arrayBuffer && r.blob && s(g) ? (this._bodyArrayBuffer = v(g.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(g) || i(g)) ? this._bodyArrayBuffer = v(g) : this._bodyText = g = Object.prototype.toString.call(g) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof g == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(g) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var g = c(this);
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
            var g = c(this);
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
          var g = c(this);
          if (g)
            return g;
          if (this._bodyBlob)
            return w(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(y(this._bodyArrayBuffer));
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
      function x(g) {
        var E = g.toUpperCase();
        return O.indexOf(E) > -1 ? E : g;
      }
      function $(g, E) {
        if (!(this instanceof $))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        E = E || {};
        var H = E.body;
        if (g instanceof $) {
          if (g.bodyUsed)
            throw new TypeError("Already read");
          this.url = g.url, this.credentials = g.credentials, E.headers || (this.headers = new h(g.headers)), this.method = g.method, this.mode = g.mode, this.signal = g.signal, !H && g._bodyInit != null && (H = g._bodyInit, g.bodyUsed = !0);
        } else
          this.url = String(g);
        if (this.credentials = E.credentials || this.credentials || "same-origin", (E.headers || !this.headers) && (this.headers = new h(E.headers)), this.method = x(E.method || this.method || "GET"), this.mode = E.mode || this.mode || null, this.signal = E.signal || this.signal || function() {
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
      function A(g) {
        var E = new FormData();
        return g.trim().split("&").forEach(function(H) {
          if (H) {
            var k = H.split("="), M = k.shift().replace(/\+/g, " "), N = k.join("=").replace(/\+/g, " ");
            E.append(decodeURIComponent(M), decodeURIComponent(N));
          }
        }), E;
      }
      function P(g) {
        var E = new h(), H = g.replace(/\r?\n[\t ]+/g, " ");
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
      function T(g, E) {
        if (!(this instanceof T))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (E || (E = {}), this.type = "default", this.status = E.status === void 0 ? 200 : E.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = E.statusText === void 0 ? "" : "" + E.statusText, this.headers = new h(E.headers), this.url = E.url || "", this._initBody(g);
      }
      L.call(T.prototype), T.prototype.clone = function() {
        return new T(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new h(this.headers),
          url: this.url
        });
      }, T.error = function() {
        var g = new T(null, { status: 200, statusText: "" });
        return g.ok = !1, g.status = 0, g.type = "error", g;
      };
      var C = [301, 302, 303, 307, 308];
      T.redirect = function(g, E) {
        if (C.indexOf(E) === -1)
          throw new RangeError("Invalid status code");
        return new T(null, { status: E, headers: { location: g } });
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
      function I(g, E) {
        return new Promise(function(H, k) {
          var M = new $(g, E);
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
              Zt.push(a(rt)), N.setRequestHeader(rt, l(E.headers[rt]));
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
const Ep = "https://browser.blockstack.org/auth", Ap = {
  "@type": "Person",
  "@context": "http://schema.org"
}, cf = ["store_write"], vp = "blockstack-session", Bp = {
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
class $p extends Gn {
  constructor(e, n = "") {
    super({ code: on.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Pa extends Gn {
  constructor(e = "") {
    super({ code: on.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Nr extends Gn {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: on.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Na extends Gn {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: on.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Bo extends Gn {
  constructor(e) {
    super({ code: on.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class lf extends Gn {
  constructor(e) {
    super({ code: on.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Da = ["debug", "info", "warn", "error", "none"], $o = {};
for (let t = 0; t < Da.length; t++) {
  const e = Da[t];
  $o[e] = t;
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
    return $o[Bp.logLevel] <= $o[e];
  }
}
function _p() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Hp() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function eo(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function Lp() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Ip() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Up(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function gi(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Ip(), s) {
      const o = s[t];
      if (o)
        return o;
    }
  } catch (o) {
    Bn.error(`Error getting object '${t}' from global scope '${s}': ${o}`);
  }
  if (e) {
    const o = Up(s, t.toString(), n);
    throw Bn.error(o), new Error(o);
  }
  if (r)
    return {};
}
function Op(t) {
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
  if (Tp(t, Uint8Array))
    return BigInt(`0x${It(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Cp(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function xi(t, e = 8) {
  return (typeof t == "bigint" ? t : Op(t)).toString(16).padStart(e * 2, "0");
}
function ff(t, e = 16) {
  const n = xi(t, e);
  return $t(n);
}
function kp(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const Pp = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function It(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Pp[n];
  return e;
}
function $t(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Cp(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    e[n] = o;
  }
  return e;
}
function ur(t) {
  return new TextEncoder().encode(t);
}
function hf(t) {
  return new TextDecoder().decode(t);
}
function Np(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Dp(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Ta(t) {
  if (t.some(Dp))
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
  return ie(...t.map((e) => typeof e == "number" ? Ta([e]) : e instanceof Array ? Ta(e) : e));
}
function Tp(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const Fp = "https://api.mainnet.hiro.so", Mp = "https://api.testnet.hiro.so", Rp = "http://localhost:3999", Gp = "https://hub.blockstack.org";
function Vp(t) {
  const e = typeof t == "string" ? $t(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function $s(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const Kp = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function zp(t, e) {
  const n = {};
  return Object.assign(n, Kp, e), await fetch(t, n);
}
function jp(t) {
  let e = zp, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function qp(...t) {
  const { fetchLib: e, middlewares: n } = jp(t);
  return async (s, o) => {
    let i = { url: s, init: o ?? {} };
    for (const l of n)
      typeof l.pre == "function" && (i = await Promise.resolve(l.pre({
        fetch: e,
        ...i
      })) ?? i);
    let a = await e(i.url, i.init);
    for (const l of n)
      typeof l.post == "function" && (a = await Promise.resolve(l.post({
        fetch: e,
        url: i.url,
        init: i.init,
        response: (a == null ? void 0 : a.clone()) ?? a
      })) ?? a);
    return a;
  };
}
class uf {
  constructor(e = cf.slice(), n = ((a) => (a = gi("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", o = void 0, i = Ep) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = o, this.authenticatorURL = i;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function _o(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Wp(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function df(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Xp(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  _o(t.outputLen), _o(t.blockLen);
}
function Yp(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Jp(t, e) {
  df(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Xe = {
  number: _o,
  bool: Wp,
  bytes: df,
  hash: Xp,
  exists: Yp,
  output: Jp
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const no = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Mt = (t, e) => t << 32 - e | t >>> e, Zp = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Zp)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Qp(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function wi(t) {
  if (typeof t == "string" && (t = Qp(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let pf = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function an(t) {
  const e = (r) => t().update(wi(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let bf = class extends pf {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Xe.hash(e);
    const r = wi(n);
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
const _s = (t, e, n) => new bf(t, e).update(n).digest();
_s.create = (t, e) => new bf(t, e);
function t1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), l = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + l, i, r), t.setUint32(e + u, a, r);
}
let yi = class extends pf {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = no(this.buffer);
  }
  update(e) {
    Xe.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = wi(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const l = no(e);
        for (; s <= o - i; i += s)
          this.process(l, i);
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
    t1(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = no(e), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = l / 4, h = this.get();
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
const e1 = (t, e, n) => t & e ^ ~t & n, n1 = (t, e, n) => t & e ^ t & n ^ e & n, r1 = new Uint32Array([
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
let gf = class extends yi {
  constructor() {
    super(64, 32, 8, !1), this.A = ge[0] | 0, this.B = ge[1] | 0, this.C = ge[2] | 0, this.D = ge[3] | 0, this.E = ge[4] | 0, this.F = ge[5] | 0, this.G = ge[6] | 0, this.H = ge[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: a, H: l } = this;
    return [e, n, r, s, o, i, a, l];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, l) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = l | 0;
  }
  process(e, n) {
    for (let c = 0; c < 16; c++, n += 4)
      xe[c] = e.getUint32(n, !1);
    for (let c = 16; c < 64; c++) {
      const p = xe[c - 15], d = xe[c - 2], w = Mt(p, 7) ^ Mt(p, 18) ^ p >>> 3, y = Mt(d, 17) ^ Mt(d, 19) ^ d >>> 10;
      xe[c] = y + xe[c - 7] + w + xe[c - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: l, G: u, H: h } = this;
    for (let c = 0; c < 64; c++) {
      const p = Mt(a, 6) ^ Mt(a, 11) ^ Mt(a, 25), d = h + p + e1(a, l, u) + r1[c] + xe[c] | 0, y = (Mt(r, 2) ^ Mt(r, 13) ^ Mt(r, 22)) + n1(r, s, o) | 0;
      h = u, u = l, l = a, a = i + d | 0, i = o, o = s, s = r, r = d + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, l = l + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, l, u, h);
  }
  roundClean() {
    xe.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, s1 = class extends gf {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Cn = an(() => new gf());
an(() => new s1());
var dr = {};
dr.byteLength = l1;
var o1 = dr.toByteArray = h1, i1 = dr.fromByteArray = p1, zt = [], Lt = [], a1 = typeof Uint8Array < "u" ? Uint8Array : Array, ro = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Sn = 0, c1 = ro.length; Sn < c1; ++Sn)
  zt[Sn] = ro[Sn], Lt[ro.charCodeAt(Sn)] = Sn;
Lt[45] = 62;
Lt[95] = 63;
function xf(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function l1(t) {
  var e = xf(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function f1(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function h1(t) {
  var e, n = xf(t), r = n[0], s = n[1], o = new a1(f1(t, r, s)), i = 0, a = s > 0 ? r - 4 : r, l;
  for (l = 0; l < a; l += 4)
    e = Lt[t.charCodeAt(l)] << 18 | Lt[t.charCodeAt(l + 1)] << 12 | Lt[t.charCodeAt(l + 2)] << 6 | Lt[t.charCodeAt(l + 3)], o[i++] = e >> 16 & 255, o[i++] = e >> 8 & 255, o[i++] = e & 255;
  return s === 2 && (e = Lt[t.charCodeAt(l)] << 2 | Lt[t.charCodeAt(l + 1)] >> 4, o[i++] = e & 255), s === 1 && (e = Lt[t.charCodeAt(l)] << 10 | Lt[t.charCodeAt(l + 1)] << 4 | Lt[t.charCodeAt(l + 2)] >> 2, o[i++] = e >> 8 & 255, o[i++] = e & 255), o;
}
function u1(t) {
  return zt[t >> 18 & 63] + zt[t >> 12 & 63] + zt[t >> 6 & 63] + zt[t & 63];
}
function d1(t, e, n) {
  for (var r, s = [], o = e; o < n; o += 3)
    r = (t[o] << 16 & 16711680) + (t[o + 1] << 8 & 65280) + (t[o + 2] & 255), s.push(u1(r));
  return s.join("");
}
function p1(t) {
  for (var e, n = t.length, r = n % 3, s = [], o = 16383, i = 0, a = n - r; i < a; i += o)
    s.push(d1(t, i, i + o > a ? a : i + o));
  return r === 1 ? (e = t[n - 1], s.push(
    zt[e >> 2] + zt[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    zt[e >> 10] + zt[e >> 4 & 63] + zt[e << 2 & 63] + "="
  )), s.join("");
}
function b1() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const g1 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function x1() {
  if (b1())
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
    throw new Error(g1);
  }
}
class w1 {
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
class y1 {
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
    const a = await this.subtleCrypto.importKey("raw", n, { name: o, length: i }, !1, ["encrypt"]), l = await this.subtleCrypto.encrypt({ name: o, iv: r }, a, s);
    return new Uint8Array(l);
  }
  async decrypt(e, n, r, s) {
    let o, i;
    if (e === "aes-128-cbc")
      o = "AES-CBC", i = 128;
    else if (e === "aes-256-cbc")
      o = "AES-CBC", i = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: o, length: i }, !1, ["decrypt"]), l = await this.subtleCrypto.decrypt({ name: o, iv: r }, a, s);
    return new Uint8Array(l);
  }
}
async function wf() {
  const t = await x1();
  return t.name === "subtleCrypto" ? new y1(t.lib) : new w1(t.lib.createCipheriv, t.lib.createDecipheriv);
}
const m1 = Xl, S1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var E1 = m1(S1);
const A1 = /* @__PURE__ */ id(E1), v1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), yf = Uint8Array.from({ length: 16 }, (t, e) => e), B1 = yf.map((t) => (9 * t + 5) % 16);
let mi = [yf], Si = [B1];
for (let t = 0; t < 4; t++)
  for (let e of [mi, Si])
    e.push(e[t].map((n) => v1[n]));
const mf = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), $1 = mi.map((t, e) => t.map((n) => mf[e][n])), _1 = Si.map((t, e) => t.map((n) => mf[e][n])), H1 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), L1 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Dr = (t, e) => t << e | t >>> 32 - e;
function Fa(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Tr = new Uint32Array(16);
let I1 = class extends yi {
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
      Tr[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, l = a, u = this.h3 | 0, h = u, c = this.h4 | 0, p = c;
    for (let d = 0; d < 5; d++) {
      const w = 4 - d, y = H1[d], v = L1[d], L = mi[d], O = Si[d], x = $1[d], $ = _1[d];
      for (let A = 0; A < 16; A++) {
        const P = Dr(r + Fa(d, o, a, u) + Tr[L[A]] + y, x[A]) + c | 0;
        r = c, c = u, u = Dr(a, 10) | 0, a = o, o = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = Dr(s + Fa(w, i, l, h) + Tr[O[A]] + v, $[A]) + p | 0;
        s = p, p = h, h = Dr(l, 10) | 0, l = i, i = P;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + p | 0, this.h3 + c + s | 0, this.h4 + r + i | 0, this.h0 + o + l | 0);
  }
  roundClean() {
    Tr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const U1 = an(() => new I1());
function O1(t) {
  return U1(t);
}
const Fr = BigInt(2 ** 32 - 1), Ho = BigInt(32);
function Sf(t, e = !1) {
  return e ? { h: Number(t & Fr), l: Number(t >> Ho & Fr) } : { h: Number(t >> Ho & Fr) | 0, l: Number(t & Fr) | 0 };
}
function C1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = Sf(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const k1 = (t, e) => BigInt(t >>> 0) << Ho | BigInt(e >>> 0), P1 = (t, e, n) => t >>> n, N1 = (t, e, n) => t << 32 - n | e >>> n, D1 = (t, e, n) => t >>> n | e << 32 - n, T1 = (t, e, n) => t << 32 - n | e >>> n, F1 = (t, e, n) => t << 64 - n | e >>> n - 32, M1 = (t, e, n) => t >>> n - 32 | e << 64 - n, R1 = (t, e) => e, G1 = (t, e) => t, V1 = (t, e, n) => t << n | e >>> 32 - n, K1 = (t, e, n) => e << n | t >>> 32 - n, z1 = (t, e, n) => e << n - 32 | t >>> 64 - n, j1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function q1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const W1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), X1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Y1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), J1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Z1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Q1 = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, G = {
  fromBig: Sf,
  split: C1,
  toBig: k1,
  shrSH: P1,
  shrSL: N1,
  rotrSH: D1,
  rotrSL: T1,
  rotrBH: F1,
  rotrBL: M1,
  rotr32H: R1,
  rotr32L: G1,
  rotlSH: V1,
  rotlSL: K1,
  rotlBH: z1,
  rotlBL: j1,
  add: q1,
  add3L: W1,
  add3H: X1,
  add4L: Y1,
  add4H: J1,
  add5H: Q1,
  add5L: Z1
}, [tb, eb] = G.split([
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
let Hs = class extends yi {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: l, Eh: u, El: h, Fh: c, Fl: p, Gh: d, Gl: w, Hh: y, Hl: v } = this;
    return [e, n, r, s, o, i, a, l, u, h, c, p, d, w, y, v];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, l, u, h, c, p, d, w, y, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = l | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = c | 0, this.Fl = p | 0, this.Gh = d | 0, this.Gl = w | 0, this.Hh = y | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      we[x] = e.getUint32(n), ye[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const $ = we[x - 15] | 0, A = ye[x - 15] | 0, P = G.rotrSH($, A, 1) ^ G.rotrSH($, A, 8) ^ G.shrSH($, A, 7), T = G.rotrSL($, A, 1) ^ G.rotrSL($, A, 8) ^ G.shrSL($, A, 7), C = we[x - 2] | 0, I = ye[x - 2] | 0, g = G.rotrSH(C, I, 19) ^ G.rotrBH(C, I, 61) ^ G.shrSH(C, I, 6), E = G.rotrSL(C, I, 19) ^ G.rotrBL(C, I, 61) ^ G.shrSL(C, I, 6), H = G.add4L(T, E, ye[x - 7], ye[x - 16]), k = G.add4H(H, P, g, we[x - 7], we[x - 16]);
      we[x] = k | 0, ye[x] = H | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: l, Dh: u, Dl: h, Eh: c, El: p, Fh: d, Fl: w, Gh: y, Gl: v, Hh: L, Hl: O } = this;
    for (let x = 0; x < 80; x++) {
      const $ = G.rotrSH(c, p, 14) ^ G.rotrSH(c, p, 18) ^ G.rotrBH(c, p, 41), A = G.rotrSL(c, p, 14) ^ G.rotrSL(c, p, 18) ^ G.rotrBL(c, p, 41), P = c & d ^ ~c & y, T = p & w ^ ~p & v, C = G.add5L(O, A, T, eb[x], ye[x]), I = G.add5H(C, L, $, P, tb[x], we[x]), g = C | 0, E = G.rotrSH(r, s, 28) ^ G.rotrBH(r, s, 34) ^ G.rotrBH(r, s, 39), H = G.rotrSL(r, s, 28) ^ G.rotrBL(r, s, 34) ^ G.rotrBL(r, s, 39), k = r & o ^ r & a ^ o & a, M = s & i ^ s & l ^ i & l;
      L = y | 0, O = v | 0, y = d | 0, v = w | 0, d = c | 0, w = p | 0, { h: c, l: p } = G.add(u | 0, h | 0, I | 0, g | 0), u = a | 0, h = l | 0, a = o | 0, l = i | 0, o = r | 0, i = s | 0;
      const N = G.add3L(g, H, M);
      r = G.add3H(N, I, E, k), s = N | 0;
    }
    ({ h: r, l: s } = G.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = G.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l } = G.add(this.Ch | 0, this.Cl | 0, a | 0, l | 0), { h: u, l: h } = G.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: c, l: p } = G.add(this.Eh | 0, this.El | 0, c | 0, p | 0), { h: d, l: w } = G.add(this.Fh | 0, this.Fl | 0, d | 0, w | 0), { h: y, l: v } = G.add(this.Gh | 0, this.Gl | 0, y | 0, v | 0), { h: L, l: O } = G.add(this.Hh | 0, this.Hl | 0, L | 0, O | 0), this.set(r, s, o, i, a, l, u, h, c, p, d, w, y, v, L, O);
  }
  roundClean() {
    we.fill(0), ye.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, nb = class extends Hs {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, rb = class extends Hs {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, sb = class extends Hs {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const ob = an(() => new Hs());
an(() => new nb());
an(() => new rb());
an(() => new sb());
function Ef(t) {
  return Cn(t);
}
function ib(t) {
  return ob(t);
}
const ab = 0;
ct.hmacSha256Sync = (t, ...e) => {
  const n = _s.create(Cn, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function cb() {
  return It(ct.randomPrivateKey());
}
function lb(t) {
  const e = Cn(Cn(t));
  return A1.encode(ie(t, e).slice(0, t.length + 4));
}
function fb(t, e) {
  return lb(ie(new Uint8Array([t]), e.slice(0, 20)));
}
function Af(t, e = ab) {
  const n = typeof t == "string" ? $t(t) : t, r = O1(Ef(n));
  return fb(e, r);
}
function vf(t) {
  const e = Vp(t);
  return It(ii(e.slice(0, 32), !0));
}
ct.hmacSha256Sync = (t, ...e) => {
  const n = _s.create(Cn, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var hs;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(hs || (hs = {}));
async function hb(t, e, n) {
  return await (await wf()).encrypt("aes-256-cbc", e, t, n);
}
async function ub(t, e, n) {
  return await (await wf()).decrypt("aes-256-cbc", e, t, n);
}
function Bf(t, e) {
  return _s(Cn, t, e);
}
function db(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function $f(t) {
  const e = ib(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function pb(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function bb(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: hs.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: hs.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !pb(t))
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
async function gb(t, e, n, r) {
  const s = bb(t);
  if (!s.result)
    throw s;
  const o = ct.randomPrivateKey(), i = ii(o, !0);
  let a = ai(o, t, !0);
  a = a.slice(1);
  const l = $f(a), u = ct.randomBytes(16), h = await hb(u, l.encryptionKey, e), c = ie(u, i, h), p = Bf(l.hmacKey, c);
  let d;
  if (!r || r === "hex")
    d = It(h);
  else if (r === "base64")
    d = i1(h);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const w = {
    iv: It(u),
    ephemeralPK: It(i),
    cipherText: d,
    mac: It(p),
    wasString: n
  };
  return r && r !== "hex" && (w.cipherTextEncoding = r), w;
}
async function _f(t, e) {
  if (!e.ephemeralPK)
    throw new Na("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = ai(t, n, !0);
  r = r.slice(1);
  const s = $f(r), o = $t(e.iv);
  let i;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    i = $t(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    i = o1(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = ie(o, $t(n), i), l = Bf(s.hmacKey, a), u = $t(e.mac);
  if (!db(u, l))
    throw new Na("Decryption failed: failure in MAC check");
  const h = await ub(o, s.encryptionKey, i);
  return e.wasString ? hf(h) : h;
}
function xb(t, e) {
  const n = typeof e == "string" ? ur(e) : e, r = vf(t), s = Ef(n), o = Ul(s, t);
  return {
    signature: It(o),
    publicKey: r
  };
}
async function wb(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = vf(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", o = typeof t == "string" ? ur(t) : t, i = await gb(n.publicKey, o, s, n.cipherTextEncoding);
  let a = JSON.stringify(i);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const l = xb(r, a), u = {
      signature: l.signature,
      publicKey: l.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function yb(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return _f(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var mt = {}, kn = {}, wt = {};
Object.defineProperty(wt, "__esModule", { value: !0 });
wt.decode = wt.encode = wt.unescape = wt.escape = wt.pad = void 0;
const Hf = dr;
function Ei(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
wt.pad = Ei;
function Lf(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
wt.escape = Lf;
function If(t) {
  return Ei(t).replace(/-/g, "+").replace(/_/g, "/");
}
wt.unescape = If;
function mb(t) {
  return Lf((0, Hf.fromByteArray)(new TextEncoder().encode(t)));
}
wt.encode = mb;
function Sb(t) {
  return new TextDecoder().decode((0, Hf.toByteArray)(Ei(If(t))));
}
wt.decode = Sb;
var Ls = {}, Is = {};
let Ai = class extends ui {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Tl(e);
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
const Uf = (t, e, n) => new Ai(t, e).update(n).digest();
Uf.create = (t, e) => new Ai(t, e);
const Eb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HMAC: Ai,
  hmac: Uf
}, Symbol.toStringTag, { value: "Module" })), Ab = /* @__PURE__ */ lr(Eb), vb = /* @__PURE__ */ lr(od);
var Pn = {};
Object.defineProperty(Pn, "__esModule", { value: !0 });
Pn.joseToDer = Pn.derToJose = void 0;
const Of = dr, Cf = wt;
function so(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const Bb = {
  ES256: so(256),
  ES384: so(384),
  ES512: so(521)
};
function kf(t) {
  const e = Bb[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const us = 128, Pf = 0, $b = 32, _b = 16, Hb = 2, Nf = _b | $b | Pf << 6, ds = Hb | Pf << 6;
function Df(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, Of.toByteArray)((0, Cf.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function Lb(t, e) {
  const n = Df(t), r = kf(e), s = r + 1, o = n.length;
  let i = 0;
  if (n[i++] !== Nf)
    throw new Error('Could not find expected "seq"');
  let a = n[i++];
  if (a === (us | 1) && (a = n[i++]), o - i < a)
    throw new Error(`"seq" specified length of "${a}", only "${o - i}" remaining`);
  if (n[i++] !== ds)
    throw new Error('Could not find expected "int" for "r"');
  const l = n[i++];
  if (o - i - 2 < l)
    throw new Error(`"r" specified length of "${l}", only "${o - i - 2}" available`);
  if (s < l)
    throw new Error(`"r" specified length of "${l}", max of "${s}" is acceptable`);
  const u = i;
  if (i += l, n[i++] !== ds)
    throw new Error('Could not find expected "int" for "s"');
  const h = n[i++];
  if (o - i !== h)
    throw new Error(`"s" specified length of "${h}", expected "${o - i}"`);
  if (s < h)
    throw new Error(`"s" specified length of "${h}", max of "${s}" is acceptable`);
  const c = i;
  if (i += h, i !== o)
    throw new Error(`Expected to consume entire array, but "${o - i}" bytes remain`);
  const p = r - l, d = r - h, w = new Uint8Array(p + l + d + h);
  for (i = 0; i < p; ++i)
    w[i] = 0;
  w.set(n.subarray(u + Math.max(-p, 0), u + l), i), i = r;
  for (const y = i; i < y + d; ++i)
    w[i] = 0;
  return w.set(n.subarray(c + Math.max(-d, 0), c + h), i), (0, Cf.escape)((0, Of.fromByteArray)(w));
}
Pn.derToJose = Lb;
function Ma(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= us && --r, r;
}
function Ib(t, e) {
  t = Df(t);
  const n = kf(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Ma(t, 0, n), o = Ma(t, n, t.length), i = n - s, a = n - o, l = 2 + i + 1 + 1 + a, u = l < us, h = new Uint8Array((u ? 2 : 3) + l);
  let c = 0;
  return h[c++] = Nf, u ? h[c++] = l : (h[c++] = us | 1, h[c++] = l & 255), h[c++] = ds, h[c++] = i, s < 0 ? (h[c++] = 0, h.set(t.subarray(0, n), c), c += n) : (h.set(t.subarray(s, n), c), c += n - s), h[c++] = ds, h[c++] = a, o < 0 ? (h[c++] = 0, h.set(t.subarray(n), c)) : h.set(t.subarray(n + o), c), h;
}
Pn.joseToDer = Ib;
var ae = {};
Object.defineProperty(ae, "__esModule", { value: !0 });
ae.InvalidTokenError = ae.MissingParametersError = void 0;
class Ub extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
ae.MissingParametersError = Ub;
class Ob extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
ae.InvalidTokenError = Ob;
Object.defineProperty(Is, "__esModule", { value: !0 });
Is.SECP256K1Client = void 0;
const Cb = Ab, kb = Bs, rs = vb, Ra = Pn, Ga = ae, Va = fr;
rs.utils.hmacSha256Sync = (t, ...e) => {
  const n = Cb.hmac.create(kb.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class Tf {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Va.bytesToHex)(rs.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Ga.MissingParametersError("a signing input hash and private key are all required");
    const s = rs.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Va.bytesToHex)(s);
    if (r === "jose")
      return (0, Ra.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Ra.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Ga.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return rs.verify(n, e, r, { strict: !1 });
  }
}
Is.SECP256K1Client = Tf;
Tf.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Is;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(Ls);
var en = {};
const Pb = /* @__PURE__ */ lr(El);
var Nb = yt && yt.__awaiter || function(t, e, n, r) {
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
    function l(h) {
      try {
        u(r.throw(h));
      } catch (c) {
        i(c);
      }
    }
    function u(h) {
      h.done ? o(h.value) : s(h.value).then(a, l);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(en, "__esModule", { value: !0 });
en.hashSha256Async = en.hashSha256 = void 0;
const Db = Bs;
function Ff(t) {
  return (0, Db.sha256)(t);
}
en.hashSha256 = Ff;
function Tb(t) {
  return Nb(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Pb;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Ff(t));
    }
  });
}
en.hashSha256Async = Tb;
var Fb = yt && yt.__awaiter || function(t, e, n, r) {
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
    function l(h) {
      try {
        u(r.throw(h));
      } catch (c) {
        i(c);
      }
    }
    function u(h) {
      h.done ? o(h.value) : s(h.value).then(a, l);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(kn, "__esModule", { value: !0 });
kn.TokenSigner = kn.createUnsecuredToken = void 0;
const Lo = wt, Ka = Ls, Mb = ae, za = en;
function Io(t, e) {
  const n = [], r = Lo.encode(JSON.stringify(e));
  n.push(r);
  const s = Lo.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function Rb(t) {
  return Io(t, { typ: "JWT", alg: "none" }) + ".";
}
kn.createUnsecuredToken = Rb;
class Gb {
  constructor(e, n) {
    if (!(e && n))
      throw new Mb.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Ka.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Ka.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), o = Io(e, s), i = (0, za.hashSha256)(o);
    return this.createWithSignedHash(e, n, s, o, i);
  }
  signAsync(e, n = !1, r = {}) {
    return Fb(this, void 0, void 0, function* () {
      const s = this.header(r), o = Io(e, s), i = yield (0, za.hashSha256Async)(o);
      return this.createWithSignedHash(e, n, s, o, i);
    });
  }
  createWithSignedHash(e, n, r, s, o) {
    const i = this.cryptoClient.signHash(o, this.rawPrivateKey);
    return n ? {
      header: [Lo.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [i]
    } : [s, i].join(".");
  }
}
kn.TokenSigner = Gb;
var Us = {};
Object.defineProperty(Us, "__esModule", { value: !0 });
Us.TokenVerifier = void 0;
const Vb = wt, ja = Ls, Kb = ae, Mr = en;
class zb {
  constructor(e, n) {
    if (!(e && n))
      throw new Kb.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !ja.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = ja.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, Mr.hashSha256Async)(s).then((i) => o(i));
    {
      const i = (0, Mr.hashSha256)(s);
      return o(i);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), Vb.encode(e.payload)].join(".");
    let s = !0;
    const o = (i) => (e.signature.map((a) => {
      const l = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(i, l, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Mr.hashSha256Async)(r).then((i) => o(i));
    {
      const i = (0, Mr.hashSha256)(r);
      return o(i);
    }
  }
}
Us.TokenVerifier = zb;
var Os = {};
Object.defineProperty(Os, "__esModule", { value: !0 });
Os.decodeToken = void 0;
const Rr = wt;
function jb(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Rr.decode(e[0])), r = JSON.parse(Rr.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Rr.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Rr.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
Os.decodeToken = jb;
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
  Object.defineProperty(t, "__esModule", { value: !0 }), n(kn, t), n(Us, t), n(Os, t), n(ae, t), n(Ls, t);
})(mt);
function qb(t) {
  return `did:btc-addr:${t}`;
}
function Wb(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Pa("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Pa('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function Mf(t) {
  if (t)
    return Wb(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const Xb = "1.4.0";
function Yb() {
  return cb();
}
function Jb(t, e, n, r = cf.slice(), s, o = _p().getTime(), i = {}) {
  const a = (d) => {
    const w = gi("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${d}=undefined])`
    });
    return w == null ? void 0 : w.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const l = Object.assign({}, i, {
    jti: Lp(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(o / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: Xb,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = mt.SECP256K1Client.derivePublicKey(t);
  l.public_keys = [u];
  const h = Af(u);
  return l.iss = qb(h), new mt.TokenSigner("ES256k", t).sign(l);
}
async function qa(t, e) {
  const n = hf($t(e)), r = JSON.parse(n), s = await _f(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function Zb(t) {
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
function Qb(t) {
  const e = mt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = Mf(e.iss);
  if (n.length === 1) {
    if (Af(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function t2(t) {
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
function e2(t) {
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
function n2(t) {
  const e = [
    e2(t),
    t2(t),
    Zb(t),
    Qb(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Wa = "1.0.0";
class Me {
  constructor(e) {
    this.version = Wa, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Wa)
      throw new Bo(`JSON data version ${e.version} not supported by SessionData`);
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
class Rf {
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
class Xa extends Rf {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Me({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new lf("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Me({})), !0;
  }
}
class Ya extends Rf {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = vp, !localStorage.getItem(this.key)) {
      const r = new Me({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new lf("No session data was found in localStorage");
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
var ps;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ps || (ps = {}));
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
const Gf = {
  chainId: sr.Mainnet,
  transactionVersion: re.Mainnet,
  peerNetworkId: ps.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: qt.MainnetSingleSig,
    multiSig: qt.MainnetMultiSig
  },
  client: { baseUrl: Fp }
}, Uo = {
  chainId: sr.Testnet,
  transactionVersion: re.Testnet,
  peerNetworkId: ps.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: qt.TestnetSingleSig,
    multiSig: qt.TestnetMultiSig
  },
  client: { baseUrl: Mp }
}, ss = {
  ...Uo,
  addressVersion: { ...Uo.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Rp }
}, r2 = {
  ...ss,
  addressVersion: { ...ss.addressVersion },
  client: { ...ss.client }
};
function s2(t) {
  switch (t) {
    case "mainnet":
      return Gf;
    case "testnet":
      return Uo;
    case "devnet":
      return ss;
    case "mocknet":
      return r2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Vf(t) {
  return typeof t == "string" ? s2(t) : t;
}
var Ja;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ja || (Ja = {}));
var Za;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Za || (Za = {}));
var Ct;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ct || (Ct = {}));
const oo = ["onChainOnly", "offChainOnly", "any"];
oo[0] + "", Ct.OnChainOnly, oo[1] + "", Ct.OffChainOnly, oo[2] + "", Ct.Any, Ct.OnChainOnly + "", Ct.OnChainOnly, Ct.OffChainOnly + "", Ct.OffChainOnly, Ct.Any + "", Ct.Any;
var Qa;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Qa || (Qa = {}));
var tc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(tc || (tc = {}));
var ec;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(ec || (ec = {}));
var ne;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(ne || (ne = {}));
var nc;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(nc || (nc = {}));
var rc;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(rc || (rc = {}));
var sc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(sc || (sc = {}));
var oc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(oc || (oc = {}));
var ic;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ic || (ic = {}));
var ac;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(ac || (ac = {}));
var cc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(cc || (cc = {}));
var lc;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(lc || (lc = {}));
var fc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(fc || (fc = {}));
function Oo(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function o2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Kf(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function i2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Oo(t.outputLen), Oo(t.blockLen);
}
function a2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function c2(t, e) {
  Kf(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ye = {
  number: Oo,
  bool: o2,
  bytes: Kf,
  hash: i2,
  exists: a2,
  output: c2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const io = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Rt = (t, e) => t << 32 - e | t >>> e, l2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!l2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function f2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function vi(t) {
  if (typeof t == "string" && (t = f2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let zf = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function cn(t) {
  const e = (r) => t().update(vi(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
class jf extends zf {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ye.hash(e);
    const r = vi(n);
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
const qf = (t, e, n) => new jf(t, e).update(n).digest();
qf.create = (t, e) => new jf(t, e);
function h2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), l = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + l, i, r), t.setUint32(e + u, a, r);
}
let Bi = class extends zf {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = io(this.buffer);
  }
  update(e) {
    Ye.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = vi(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const l = io(e);
        for (; s <= o - i; i += s)
          this.process(l, i);
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
    h2(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = io(e), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = l / 4, h = this.get();
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
const u2 = (t, e, n) => t & e ^ ~t & n, d2 = (t, e, n) => t & e ^ t & n ^ e & n, p2 = new Uint32Array([
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
let Wf = class extends Bi {
  constructor() {
    super(64, 32, 8, !1), this.A = me[0] | 0, this.B = me[1] | 0, this.C = me[2] | 0, this.D = me[3] | 0, this.E = me[4] | 0, this.F = me[5] | 0, this.G = me[6] | 0, this.H = me[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: a, H: l } = this;
    return [e, n, r, s, o, i, a, l];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, l) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = l | 0;
  }
  process(e, n) {
    for (let c = 0; c < 16; c++, n += 4)
      Se[c] = e.getUint32(n, !1);
    for (let c = 16; c < 64; c++) {
      const p = Se[c - 15], d = Se[c - 2], w = Rt(p, 7) ^ Rt(p, 18) ^ p >>> 3, y = Rt(d, 17) ^ Rt(d, 19) ^ d >>> 10;
      Se[c] = y + Se[c - 7] + w + Se[c - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: l, G: u, H: h } = this;
    for (let c = 0; c < 64; c++) {
      const p = Rt(a, 6) ^ Rt(a, 11) ^ Rt(a, 25), d = h + p + u2(a, l, u) + p2[c] + Se[c] | 0, y = (Rt(r, 2) ^ Rt(r, 13) ^ Rt(r, 22)) + d2(r, s, o) | 0;
      h = u, u = l, l = a, a = i + d | 0, i = o, o = s, s = r, r = d + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, l = l + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, l, u, h);
  }
  roundClean() {
    Se.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, b2 = class extends Wf {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Xf = cn(() => new Wf());
cn(() => new b2());
function g2(t, e) {
  switch (e = Vf(e ?? Gf), t) {
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
const x2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Yf = Uint8Array.from({ length: 16 }, (t, e) => e), w2 = Yf.map((t) => (9 * t + 5) % 16);
let $i = [Yf], _i = [w2];
for (let t = 0; t < 4; t++)
  for (let e of [$i, _i])
    e.push(e[t].map((n) => x2[n]));
const Jf = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), y2 = $i.map((t, e) => t.map((n) => Jf[e][n])), m2 = _i.map((t, e) => t.map((n) => Jf[e][n])), S2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), E2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Gr = (t, e) => t << e | t >>> 32 - e;
function hc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Vr = new Uint32Array(16);
let A2 = class extends Bi {
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
      Vr[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, l = a, u = this.h3 | 0, h = u, c = this.h4 | 0, p = c;
    for (let d = 0; d < 5; d++) {
      const w = 4 - d, y = S2[d], v = E2[d], L = $i[d], O = _i[d], x = y2[d], $ = m2[d];
      for (let A = 0; A < 16; A++) {
        const P = Gr(r + hc(d, o, a, u) + Vr[L[A]] + y, x[A]) + c | 0;
        r = c, c = u, u = Gr(a, 10) | 0, a = o, o = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = Gr(s + hc(w, i, l, h) + Vr[O[A]] + v, $[A]) + p | 0;
        s = p, p = h, h = Gr(l, 10) | 0, l = i, i = P;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + p | 0, this.h3 + c + s | 0, this.h4 + r + i | 0, this.h0 + o + l | 0);
  }
  roundClean() {
    Vr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const v2 = cn(() => new A2()), Kr = BigInt(2 ** 32 - 1), Co = BigInt(32);
function Zf(t, e = !1) {
  return e ? { h: Number(t & Kr), l: Number(t >> Co & Kr) } : { h: Number(t >> Co & Kr) | 0, l: Number(t & Kr) | 0 };
}
function B2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = Zf(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const $2 = (t, e) => BigInt(t >>> 0) << Co | BigInt(e >>> 0), _2 = (t, e, n) => t >>> n, H2 = (t, e, n) => t << 32 - n | e >>> n, L2 = (t, e, n) => t >>> n | e << 32 - n, I2 = (t, e, n) => t << 32 - n | e >>> n, U2 = (t, e, n) => t << 64 - n | e >>> n - 32, O2 = (t, e, n) => t >>> n - 32 | e << 64 - n, C2 = (t, e) => e, k2 = (t, e) => t, P2 = (t, e, n) => t << n | e >>> 32 - n, N2 = (t, e, n) => e << n | t >>> 32 - n, D2 = (t, e, n) => e << n - 32 | t >>> 64 - n, T2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function F2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const M2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), R2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, G2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), V2 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, K2 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), z2 = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, V = {
  fromBig: Zf,
  split: B2,
  toBig: $2,
  shrSH: _2,
  shrSL: H2,
  rotrSH: L2,
  rotrSL: I2,
  rotrBH: U2,
  rotrBL: O2,
  rotr32H: C2,
  rotr32L: k2,
  rotlSH: P2,
  rotlSL: N2,
  rotlBH: D2,
  rotlBL: T2,
  add: F2,
  add3L: M2,
  add3H: R2,
  add4L: G2,
  add4H: V2,
  add5H: z2,
  add5L: K2
}, [j2, q2] = V.split([
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
let Cs = class extends Bi {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: l, Eh: u, El: h, Fh: c, Fl: p, Gh: d, Gl: w, Hh: y, Hl: v } = this;
    return [e, n, r, s, o, i, a, l, u, h, c, p, d, w, y, v];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, l, u, h, c, p, d, w, y, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = l | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = c | 0, this.Fl = p | 0, this.Gh = d | 0, this.Gl = w | 0, this.Hh = y | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      Ee[x] = e.getUint32(n), Ae[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const $ = Ee[x - 15] | 0, A = Ae[x - 15] | 0, P = V.rotrSH($, A, 1) ^ V.rotrSH($, A, 8) ^ V.shrSH($, A, 7), T = V.rotrSL($, A, 1) ^ V.rotrSL($, A, 8) ^ V.shrSL($, A, 7), C = Ee[x - 2] | 0, I = Ae[x - 2] | 0, g = V.rotrSH(C, I, 19) ^ V.rotrBH(C, I, 61) ^ V.shrSH(C, I, 6), E = V.rotrSL(C, I, 19) ^ V.rotrBL(C, I, 61) ^ V.shrSL(C, I, 6), H = V.add4L(T, E, Ae[x - 7], Ae[x - 16]), k = V.add4H(H, P, g, Ee[x - 7], Ee[x - 16]);
      Ee[x] = k | 0, Ae[x] = H | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: l, Dh: u, Dl: h, Eh: c, El: p, Fh: d, Fl: w, Gh: y, Gl: v, Hh: L, Hl: O } = this;
    for (let x = 0; x < 80; x++) {
      const $ = V.rotrSH(c, p, 14) ^ V.rotrSH(c, p, 18) ^ V.rotrBH(c, p, 41), A = V.rotrSL(c, p, 14) ^ V.rotrSL(c, p, 18) ^ V.rotrBL(c, p, 41), P = c & d ^ ~c & y, T = p & w ^ ~p & v, C = V.add5L(O, A, T, q2[x], Ae[x]), I = V.add5H(C, L, $, P, j2[x], Ee[x]), g = C | 0, E = V.rotrSH(r, s, 28) ^ V.rotrBH(r, s, 34) ^ V.rotrBH(r, s, 39), H = V.rotrSL(r, s, 28) ^ V.rotrBL(r, s, 34) ^ V.rotrBL(r, s, 39), k = r & o ^ r & a ^ o & a, M = s & i ^ s & l ^ i & l;
      L = y | 0, O = v | 0, y = d | 0, v = w | 0, d = c | 0, w = p | 0, { h: c, l: p } = V.add(u | 0, h | 0, I | 0, g | 0), u = a | 0, h = l | 0, a = o | 0, l = i | 0, o = r | 0, i = s | 0;
      const N = V.add3L(g, H, M);
      r = V.add3H(N, I, E, k), s = N | 0;
    }
    ({ h: r, l: s } = V.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = V.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l } = V.add(this.Ch | 0, this.Cl | 0, a | 0, l | 0), { h: u, l: h } = V.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: c, l: p } = V.add(this.Eh | 0, this.El | 0, c | 0, p | 0), { h: d, l: w } = V.add(this.Fh | 0, this.Fl | 0, d | 0, w | 0), { h: y, l: v } = V.add(this.Gh | 0, this.Gl | 0, y | 0, v | 0), { h: L, l: O } = V.add(this.Hh | 0, this.Hl | 0, L | 0, O | 0), this.set(r, s, o, i, a, l, u, h, c, p, d, w, y, v, L, O);
  }
  roundClean() {
    Ee.fill(0), Ae.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, W2 = class extends Cs {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, X2 = class extends Cs {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Y2 = class extends Cs {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
cn(() => new Cs());
cn(() => new W2());
cn(() => new X2());
cn(() => new Y2());
var ko;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ko || (ko = {}));
function J2(t, e) {
  return { type: ko.Address, version: t, hash160: e };
}
function Z2(t) {
  return Mn.c32address(t.version, t.hash160);
}
const Q2 = (t) => v2(Xf(t)), tg = (t) => It(Q2(t));
ct.hmacSha256Sync = (t, ...e) => {
  const n = qf.create(Xf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function eg(t, e = "mainnet") {
  e = Vf(e), t = typeof t == "string" ? $t(t) : t;
  const n = g2(ne.P2PKH, e), r = J2(n, tg(t));
  return Z2(r);
}
function ng(t, e) {
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
  const s = r.issuer.publicKey, o = eg(s);
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
function rg(t, e = null) {
  let n;
  e ? n = ng(t, e) : n = mt.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const uc = "_blockstackDidCheckEchoReply", sg = "echoReply", og = "authContinuation";
function ig(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, o] = r.split("=");
    return n[s] = o ? decodeURIComponent(o.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function ag() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[uc];
  if (typeof e == "boolean")
    return e;
  const n = ig(t.location.search), r = n[sg];
  if (r) {
    t[uc] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const o = n[og];
      t.location.href = o;
    }, 10), !0;
  }
  return !1;
}
class Po {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new uf();
    else
      throw new $p("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new Ya(e.sessionOptions) : this.store = new Ya() : e ? this.store = new Xa(e.sessionOptions) : this.store = new Xa();
  }
  makeAuthRequestToken(e, n, r, s, o, i = Hp().getTime(), a = {}) {
    const l = this.appConfig;
    if (!l)
      throw new Bo("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || l.redirectURI(), r = r || l.manifestURI(), s = s || l.scopes, o = o || l.appDomain, Jb(e, n, r, s, o, i, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = Yb();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = gi("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (ag())
        return Bn.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Bn.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = qp()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Nr("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const o = mt.decodeToken(e).payload;
    if (typeof o == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await n2(e))
      throw new Nr("Invalid authentication response.");
    let a = o.private_key, l = o.core_token;
    if (eo(o.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (o.private_key !== void 0 && o.private_key !== null)
          try {
            a = await qa(s, o.private_key);
          } catch {
            if (Bn.warn("Failed decryption of appPrivateKey, will try to use as given"), !ct.isValidPrivateKey(o.private_key))
              throw new Nr("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (l != null)
          try {
            l = await qa(s, l);
          } catch {
            Bn.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Nr("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = Gp, h;
    eo(o.version, "1.2.0") && o.hubUrl !== null && o.hubUrl !== void 0 && (u = o.hubUrl), eo(o.version, "1.3.0") && o.associationToken !== null && o.associationToken !== void 0 && (h = o.associationToken);
    const c = {
      profile: o.profile,
      email: o.email,
      decentralizedID: o.iss,
      identityAddress: Mf(o.iss),
      appPrivateKey: a,
      coreSessionToken: l,
      authResponseToken: e,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: o.appPrivateKeyFromWalletSalt,
      coreNode: o.blockstackAPIUrl,
      gaiaAssociationToken: h
    }, p = o.profile_url;
    if (!c.profile && p) {
      const d = await n(p);
      if (!d.ok)
        c.profile = Object.assign({}, Ap);
      else {
        const w = await d.text(), y = JSON.parse(w);
        c.profile = rg(y[0].token);
      }
    } else
      c.profile = o.profile;
    return r.userData = c, this.store.setSessionData(r), c;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new Bo("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), wb(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), yb(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
Po.prototype.makeAuthRequest = Po.prototype.makeAuthRequestToken;
const cg = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), Qf = "STX_PROVIDER", t0 = () => typeof window > "u" ? null : window.localStorage.getItem(Qf), lg = (t) => {
  typeof window < "u" && window.localStorage.setItem(Qf, t);
}, fg = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function hg(t, e) {
  const n = {};
  return Object.assign(n, fg, e), await fetch(t, n);
}
function ug(t) {
  let e = hg, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function dg(...t) {
  const { fetchLib: e, middlewares: n } = ug(t);
  return async (s, o) => {
    let i = { url: s, init: o ?? {} };
    for (const l of n)
      typeof l.pre == "function" && (i = await Promise.resolve(l.pre({
        fetch: e,
        ...i
      })) ?? i);
    let a = await e(i.url, i.init);
    for (const l of n)
      typeof l.post == "function" && (a = await Promise.resolve(l.post({
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
var dc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(dc || (dc = {}));
const pg = "https://api.mainnet.hiro.so", bg = "https://api.testnet.hiro.so", gg = "http://localhost:3999", xg = ["mainnet", "testnet", "devnet", "mocknet"];
class rn {
  constructor(e) {
    this.version = nn.Mainnet, this.chainId = Nn.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === nn.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? dg();
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
      return new No();
    case "testnet":
      return new Do();
    case "devnet":
      return new wg();
    case "mocknet":
      return new e0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${xg.join(", ")}`);
  }
};
rn.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : rn.fromName(t);
class No extends rn {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? pg,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = nn.Mainnet, this.chainId = Nn.Mainnet;
  }
}
class Do extends rn {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? bg,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = nn.Testnet, this.chainId = Nn.Testnet;
  }
}
class e0 extends rn {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? gg,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = nn.Testnet, this.chainId = Nn.Testnet;
  }
}
const wg = e0;
var To;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(To || (To = {}));
var pc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(pc || (pc = {}));
To.Mainnet;
var bs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(bs || (bs = {}));
var bc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(bc || (bc = {}));
bs.Mainnet;
const yg = 128, mg = 128, n0 = 16;
var gc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(gc || (gc = {}));
var xc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(xc || (xc = {}));
var kt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(kt || (kt = {}));
const ao = ["onChainOnly", "offChainOnly", "any"];
ao[0] + "", kt.OnChainOnly, ao[1] + "", kt.OffChainOnly, ao[2] + "", kt.Any, kt.OnChainOnly + "", kt.OnChainOnly, kt.OffChainOnly + "", kt.OffChainOnly, kt.Any + "", kt.Any;
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
var Sc;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Sc || (Sc = {}));
var Ec;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ec || (Ec = {}));
var Ac;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ac || (Ac = {}));
var vc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(vc || (vc = {}));
var Bc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Bc || (Bc = {}));
var $c;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})($c || ($c = {}));
var _c;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(_c || (_c = {}));
var Hc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Hc || (Hc = {}));
var Lc;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Lc || (Lc = {}));
var Ic;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Ic || (Ic = {}));
let Sg = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Eg = class extends Sg {
  constructor(e) {
    super(e);
  }
};
function Fo(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Ag(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function r0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function vg(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Fo(t.outputLen), Fo(t.blockLen);
}
function Bg(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function $g(t, e) {
  r0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const co = {
  number: Fo,
  bool: Ag,
  bytes: r0,
  hash: vg,
  exists: Bg,
  output: $g
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const lo = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Gt = (t, e) => t << 32 - e | t >>> e, _g = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!_g)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Hg(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function s0(t) {
  if (typeof t == "string" && (t = Hg(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Lg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ln(t) {
  const e = (r) => t().update(s0(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Ig(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), l = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + l, i, r), t.setUint32(e + u, a, r);
}
let Hi = class extends Lg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = lo(this.buffer);
  }
  update(e) {
    co.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = s0(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const l = lo(e);
        for (; s <= o - i; i += s)
          this.process(l, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    co.exists(this), co.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let c = i; c < s; c++)
      n[c] = 0;
    Ig(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = lo(e), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = l / 4, h = this.get();
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
const Ug = (t, e, n) => t & e ^ ~t & n, Og = (t, e, n) => t & e ^ t & n ^ e & n, Cg = new Uint32Array([
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
let o0 = class extends Hi {
  constructor() {
    super(64, 32, 8, !1), this.A = ve[0] | 0, this.B = ve[1] | 0, this.C = ve[2] | 0, this.D = ve[3] | 0, this.E = ve[4] | 0, this.F = ve[5] | 0, this.G = ve[6] | 0, this.H = ve[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: a, H: l } = this;
    return [e, n, r, s, o, i, a, l];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, l) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = l | 0;
  }
  process(e, n) {
    for (let c = 0; c < 16; c++, n += 4)
      Be[c] = e.getUint32(n, !1);
    for (let c = 16; c < 64; c++) {
      const p = Be[c - 15], d = Be[c - 2], w = Gt(p, 7) ^ Gt(p, 18) ^ p >>> 3, y = Gt(d, 17) ^ Gt(d, 19) ^ d >>> 10;
      Be[c] = y + Be[c - 7] + w + Be[c - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: l, G: u, H: h } = this;
    for (let c = 0; c < 64; c++) {
      const p = Gt(a, 6) ^ Gt(a, 11) ^ Gt(a, 25), d = h + p + Ug(a, l, u) + Cg[c] + Be[c] | 0, y = (Gt(r, 2) ^ Gt(r, 13) ^ Gt(r, 22)) + Og(r, s, o) | 0;
      h = u, u = l, l = a, a = i + d | 0, i = o, o = s, s = r, r = d + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, l = l + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, l, u, h);
  }
  roundClean() {
    Be.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, kg = class extends o0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
ln(() => new o0());
ln(() => new kg());
const Pg = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), i0 = Uint8Array.from({ length: 16 }, (t, e) => e), Ng = i0.map((t) => (9 * t + 5) % 16);
let Li = [i0], Ii = [Ng];
for (let t = 0; t < 4; t++)
  for (let e of [Li, Ii])
    e.push(e[t].map((n) => Pg[n]));
const a0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Dg = Li.map((t, e) => t.map((n) => a0[e][n])), Tg = Ii.map((t, e) => t.map((n) => a0[e][n])), Fg = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Mg = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), zr = (t, e) => t << e | t >>> 32 - e;
function Uc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const jr = new Uint32Array(16);
let Rg = class extends Hi {
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
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, l = a, u = this.h3 | 0, h = u, c = this.h4 | 0, p = c;
    for (let d = 0; d < 5; d++) {
      const w = 4 - d, y = Fg[d], v = Mg[d], L = Li[d], O = Ii[d], x = Dg[d], $ = Tg[d];
      for (let A = 0; A < 16; A++) {
        const P = zr(r + Uc(d, o, a, u) + jr[L[A]] + y, x[A]) + c | 0;
        r = c, c = u, u = zr(a, 10) | 0, a = o, o = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = zr(s + Uc(w, i, l, h) + jr[O[A]] + v, $[A]) + p | 0;
        s = p, p = h, h = zr(l, 10) | 0, l = i, i = P;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + p | 0, this.h3 + c + s | 0, this.h4 + r + i | 0, this.h0 + o + l | 0);
  }
  roundClean() {
    jr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
ln(() => new Rg());
const qr = BigInt(2 ** 32 - 1), Mo = BigInt(32);
function c0(t, e = !1) {
  return e ? { h: Number(t & qr), l: Number(t >> Mo & qr) } : { h: Number(t >> Mo & qr) | 0, l: Number(t & qr) | 0 };
}
function Gg(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = c0(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const Vg = (t, e) => BigInt(t >>> 0) << Mo | BigInt(e >>> 0), Kg = (t, e, n) => t >>> n, zg = (t, e, n) => t << 32 - n | e >>> n, jg = (t, e, n) => t >>> n | e << 32 - n, qg = (t, e, n) => t << 32 - n | e >>> n, Wg = (t, e, n) => t << 64 - n | e >>> n - 32, Xg = (t, e, n) => t >>> n - 32 | e << 64 - n, Yg = (t, e) => e, Jg = (t, e) => t, Zg = (t, e, n) => t << n | e >>> 32 - n, Qg = (t, e, n) => e << n | t >>> 32 - n, tx = (t, e, n) => e << n - 32 | t >>> 64 - n, ex = (t, e, n) => t << n - 32 | e >>> 64 - n;
function nx(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const rx = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), sx = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, ox = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), ix = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, ax = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), cx = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, K = {
  fromBig: c0,
  split: Gg,
  toBig: Vg,
  shrSH: Kg,
  shrSL: zg,
  rotrSH: jg,
  rotrSL: qg,
  rotrBH: Wg,
  rotrBL: Xg,
  rotr32H: Yg,
  rotr32L: Jg,
  rotlSH: Zg,
  rotlSL: Qg,
  rotlBH: tx,
  rotlBL: ex,
  add: nx,
  add3L: rx,
  add3H: sx,
  add4L: ox,
  add4H: ix,
  add5H: cx,
  add5L: ax
}, [lx, fx] = K.split([
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
let ks = class extends Hi {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: l, Eh: u, El: h, Fh: c, Fl: p, Gh: d, Gl: w, Hh: y, Hl: v } = this;
    return [e, n, r, s, o, i, a, l, u, h, c, p, d, w, y, v];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, l, u, h, c, p, d, w, y, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = l | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = c | 0, this.Fl = p | 0, this.Gh = d | 0, this.Gl = w | 0, this.Hh = y | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      $e[x] = e.getUint32(n), _e[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const $ = $e[x - 15] | 0, A = _e[x - 15] | 0, P = K.rotrSH($, A, 1) ^ K.rotrSH($, A, 8) ^ K.shrSH($, A, 7), T = K.rotrSL($, A, 1) ^ K.rotrSL($, A, 8) ^ K.shrSL($, A, 7), C = $e[x - 2] | 0, I = _e[x - 2] | 0, g = K.rotrSH(C, I, 19) ^ K.rotrBH(C, I, 61) ^ K.shrSH(C, I, 6), E = K.rotrSL(C, I, 19) ^ K.rotrBL(C, I, 61) ^ K.shrSL(C, I, 6), H = K.add4L(T, E, _e[x - 7], _e[x - 16]), k = K.add4H(H, P, g, $e[x - 7], $e[x - 16]);
      $e[x] = k | 0, _e[x] = H | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: l, Dh: u, Dl: h, Eh: c, El: p, Fh: d, Fl: w, Gh: y, Gl: v, Hh: L, Hl: O } = this;
    for (let x = 0; x < 80; x++) {
      const $ = K.rotrSH(c, p, 14) ^ K.rotrSH(c, p, 18) ^ K.rotrBH(c, p, 41), A = K.rotrSL(c, p, 14) ^ K.rotrSL(c, p, 18) ^ K.rotrBL(c, p, 41), P = c & d ^ ~c & y, T = p & w ^ ~p & v, C = K.add5L(O, A, T, fx[x], _e[x]), I = K.add5H(C, L, $, P, lx[x], $e[x]), g = C | 0, E = K.rotrSH(r, s, 28) ^ K.rotrBH(r, s, 34) ^ K.rotrBH(r, s, 39), H = K.rotrSL(r, s, 28) ^ K.rotrBL(r, s, 34) ^ K.rotrBL(r, s, 39), k = r & o ^ r & a ^ o & a, M = s & i ^ s & l ^ i & l;
      L = y | 0, O = v | 0, y = d | 0, v = w | 0, d = c | 0, w = p | 0, { h: c, l: p } = K.add(u | 0, h | 0, I | 0, g | 0), u = a | 0, h = l | 0, a = o | 0, l = i | 0, o = r | 0, i = s | 0;
      const N = K.add3L(g, H, M);
      r = K.add3H(N, I, E, k), s = N | 0;
    }
    ({ h: r, l: s } = K.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = K.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l } = K.add(this.Ch | 0, this.Cl | 0, a | 0, l | 0), { h: u, l: h } = K.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: c, l: p } = K.add(this.Eh | 0, this.El | 0, c | 0, p | 0), { h: d, l: w } = K.add(this.Fh | 0, this.Fl | 0, d | 0, w | 0), { h: y, l: v } = K.add(this.Gh | 0, this.Gl | 0, y | 0, v | 0), { h: L, l: O } = K.add(this.Hh | 0, this.Hl | 0, L | 0, O | 0), this.set(r, s, o, i, a, l, u, h, c, p, d, w, y, v, L, O);
  }
  roundClean() {
    $e.fill(0), _e.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, hx = class extends ks {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, ux = class extends ks {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, dx = class extends ks {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ln(() => new ks());
ln(() => new hx());
ln(() => new ux());
ln(() => new dx());
var lt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(lt || (lt = {}));
var Ro;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Ro || (Ro = {}));
function Ui(t) {
  return Ro[t];
}
var gs;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(gs || (gs = {}));
function l0(t, e, n) {
  const s = yg;
  if ($x(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: gs.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
function f0(t) {
  const e = Mn.c32addressDecode(t);
  return {
    type: gs.Address,
    version: e[0],
    hash160: e[1]
  };
}
function h0(t) {
  const e = [];
  return e.push($t(xi(t.version, 1))), e.push($t(t.hash160)), Vn(e);
}
function u0(t) {
  const e = [], n = ur(t.content), r = n.byteLength;
  return e.push($t(xi(r, t.lengthPrefixBytes))), e.push(n), Vn(e);
}
function Yt(t, e) {
  return Vn([Ui(t), e]);
}
function px(t) {
  return new Uint8Array([Ui(t.type)]);
}
function bx(t) {
  return t.type === lt.OptionalNone ? new Uint8Array([Ui(t.type)]) : Yt(t.type, pr(t.value));
}
function gx(t) {
  const e = new Uint8Array(4);
  return $s(e, Math.ceil(t.value.length / 2), 0), Yt(t.type, ie(e, $t(t.value)));
}
function xx(t) {
  const e = ff(kp(BigInt(t.value), BigInt(mg)), n0);
  return Yt(t.type, e);
}
function wx(t) {
  const e = ff(BigInt(t.value), n0);
  return Yt(t.type, e);
}
function yx(t) {
  return Yt(t.type, h0(f0(t.value)));
}
function mx(t) {
  const [e, n] = _x(t.value);
  return Yt(t.type, ie(h0(f0(e)), u0(l0(n))));
}
function Sx(t) {
  return Yt(t.type, pr(t.value));
}
function Ex(t) {
  const e = [], n = new Uint8Array(4);
  $s(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = pr(r);
    e.push(s);
  }
  return Yt(t.type, Vn(e));
}
function Ax(t) {
  const e = [], n = new Uint8Array(4);
  $s(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = l0(s);
    e.push(u0(o));
    const i = pr(t.value[s]);
    e.push(i);
  }
  return Yt(t.type, Vn(e));
}
function d0(t, e) {
  const n = [], r = e == "ascii" ? Np(t.value) : ur(t.value), s = new Uint8Array(4);
  return $s(s, r.length, 0), n.push(s), n.push(r), Yt(t.type, Vn(n));
}
function vx(t) {
  return d0(t, "ascii");
}
function Bx(t) {
  return d0(t, "utf8");
}
function Oc(t) {
  return It(pr(t));
}
function pr(t) {
  switch (t.type) {
    case lt.BoolTrue:
    case lt.BoolFalse:
      return px(t);
    case lt.OptionalNone:
    case lt.OptionalSome:
      return bx(t);
    case lt.Buffer:
      return gx(t);
    case lt.UInt:
      return wx(t);
    case lt.Int:
      return xx(t);
    case lt.PrincipalStandard:
      return yx(t);
    case lt.PrincipalContract:
      return mx(t);
    case lt.ResponseOk:
    case lt.ResponseErr:
      return Sx(t);
    case lt.List:
      return Ex(t);
    case lt.Tuple:
      return Ax(t);
    case lt.StringASCII:
      return vx(t);
    case lt.StringUTF8:
      return Bx(t);
    default:
      throw new Eg("Unable to serialize. Invalid Clarity Value.");
  }
}
const $x = (t, e) => t ? ur(t).length > e : !1;
function _x(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
function Hx(t, e) {
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
    return BigInt(`0x${Ux(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Oi(t, e = 8) {
  return (typeof t == "bigint" ? t : Hx(t)).toString(16).padStart(e * 2, "0");
}
function p0(t, e = 16) {
  const n = Oi(t, e);
  return or(n);
}
function Lx(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const Ix = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ux(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Ix[n];
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
function Ci(t) {
  return new TextEncoder().encode(t);
}
function Ox(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Cx(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Cc(t) {
  if (t.some(Cx))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function ki(...t) {
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
  return ki(...t.map((e) => typeof e == "number" ? Cc([e]) : e instanceof Array ? Cc(e) : e));
}
function Ps(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Go;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Go || (Go = {}));
Go.Mainnet;
const kx = 128, Px = 128, b0 = 16;
var Vo;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Vo || (Vo = {}));
var kc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(kc || (kc = {}));
var Pc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Pc || (Pc = {}));
var Pt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Pt || (Pt = {}));
const fo = ["onChainOnly", "offChainOnly", "any"];
fo[0] + "", Pt.OnChainOnly, fo[1] + "", Pt.OffChainOnly, fo[2] + "", Pt.Any, Pt.OnChainOnly + "", Pt.OnChainOnly, Pt.OffChainOnly + "", Pt.OffChainOnly, Pt.Any + "", Pt.Any;
var Ko;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ko || (Ko = {}));
Ko.Mainnet;
var Nc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Nc || (Nc = {}));
var Dc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Dc || (Dc = {}));
var Tc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Tc || (Tc = {}));
var Fc;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Fc || (Fc = {}));
var Mc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Mc || (Mc = {}));
var Rc;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Rc || (Rc = {}));
var Gc;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Gc || (Gc = {}));
var Vc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Vc || (Vc = {}));
var Kc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Kc || (Kc = {}));
var zc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(zc || (zc = {}));
var jc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(jc || (jc = {}));
function zo(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Nx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function g0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Dx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  zo(t.outputLen), zo(t.blockLen);
}
function Tx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Fx(t, e) {
  g0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ho = {
  number: zo,
  bool: Nx,
  bytes: g0,
  hash: Dx,
  exists: Tx,
  output: Fx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const uo = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Vt = (t, e) => t << 32 - e | t >>> e, Mx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Mx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Rx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function x0(t) {
  if (typeof t == "string" && (t = Rx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Gx {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function fn(t) {
  const e = (r) => t().update(x0(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Vx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), l = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + l, i, r), t.setUint32(e + u, a, r);
}
class Pi extends Gx {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = uo(this.buffer);
  }
  update(e) {
    ho.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = x0(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const l = uo(e);
        for (; s <= o - i; i += s)
          this.process(l, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ho.exists(this), ho.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let c = i; c < s; c++)
      n[c] = 0;
    Vx(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = uo(e), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = l / 4, h = this.get();
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
const Kx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), w0 = Uint8Array.from({ length: 16 }, (t, e) => e), zx = w0.map((t) => (9 * t + 5) % 16);
let Ni = [w0], Di = [zx];
for (let t = 0; t < 4; t++)
  for (let e of [Ni, Di])
    e.push(e[t].map((n) => Kx[n]));
const y0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), jx = Ni.map((t, e) => t.map((n) => y0[e][n])), qx = Di.map((t, e) => t.map((n) => y0[e][n])), Wx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Xx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Wr = (t, e) => t << e | t >>> 32 - e;
function qc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Xr = new Uint32Array(16);
class Yx extends Pi {
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
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, l = a, u = this.h3 | 0, h = u, c = this.h4 | 0, p = c;
    for (let d = 0; d < 5; d++) {
      const w = 4 - d, y = Wx[d], v = Xx[d], L = Ni[d], O = Di[d], x = jx[d], $ = qx[d];
      for (let A = 0; A < 16; A++) {
        const P = Wr(r + qc(d, o, a, u) + Xr[L[A]] + y, x[A]) + c | 0;
        r = c, c = u, u = Wr(a, 10) | 0, a = o, o = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = Wr(s + qc(w, i, l, h) + Xr[O[A]] + v, $[A]) + p | 0;
        s = p, p = h, h = Wr(l, 10) | 0, l = i, i = P;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + p | 0, this.h3 + c + s | 0, this.h4 + r + i | 0, this.h0 + o + l | 0);
  }
  roundClean() {
    Xr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
fn(() => new Yx());
const Jx = (t, e, n) => t & e ^ ~t & n, Zx = (t, e, n) => t & e ^ t & n ^ e & n, Qx = new Uint32Array([
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
class m0 extends Pi {
  constructor() {
    super(64, 32, 8, !1), this.A = He[0] | 0, this.B = He[1] | 0, this.C = He[2] | 0, this.D = He[3] | 0, this.E = He[4] | 0, this.F = He[5] | 0, this.G = He[6] | 0, this.H = He[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: a, H: l } = this;
    return [e, n, r, s, o, i, a, l];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, l) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = l | 0;
  }
  process(e, n) {
    for (let c = 0; c < 16; c++, n += 4)
      Le[c] = e.getUint32(n, !1);
    for (let c = 16; c < 64; c++) {
      const p = Le[c - 15], d = Le[c - 2], w = Vt(p, 7) ^ Vt(p, 18) ^ p >>> 3, y = Vt(d, 17) ^ Vt(d, 19) ^ d >>> 10;
      Le[c] = y + Le[c - 7] + w + Le[c - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: l, G: u, H: h } = this;
    for (let c = 0; c < 64; c++) {
      const p = Vt(a, 6) ^ Vt(a, 11) ^ Vt(a, 25), d = h + p + Jx(a, l, u) + Qx[c] + Le[c] | 0, y = (Vt(r, 2) ^ Vt(r, 13) ^ Vt(r, 22)) + Zx(r, s, o) | 0;
      h = u, u = l, l = a, a = i + d | 0, i = o, o = s, s = r, r = d + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, l = l + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, l, u, h);
  }
  roundClean() {
    Le.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class tw extends m0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
fn(() => new m0());
fn(() => new tw());
const Yr = BigInt(2 ** 32 - 1), jo = BigInt(32);
function S0(t, e = !1) {
  return e ? { h: Number(t & Yr), l: Number(t >> jo & Yr) } : { h: Number(t >> jo & Yr) | 0, l: Number(t & Yr) | 0 };
}
function ew(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = S0(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const nw = (t, e) => BigInt(t >>> 0) << jo | BigInt(e >>> 0), rw = (t, e, n) => t >>> n, sw = (t, e, n) => t << 32 - n | e >>> n, ow = (t, e, n) => t >>> n | e << 32 - n, iw = (t, e, n) => t << 32 - n | e >>> n, aw = (t, e, n) => t << 64 - n | e >>> n - 32, cw = (t, e, n) => t >>> n - 32 | e << 64 - n, lw = (t, e) => e, fw = (t, e) => t, hw = (t, e, n) => t << n | e >>> 32 - n, uw = (t, e, n) => e << n | t >>> 32 - n, dw = (t, e, n) => e << n - 32 | t >>> 64 - n, pw = (t, e, n) => t << n - 32 | e >>> 64 - n;
function bw(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const gw = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), xw = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, ww = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), yw = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, mw = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Sw = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, z = {
  fromBig: S0,
  split: ew,
  toBig: nw,
  shrSH: rw,
  shrSL: sw,
  rotrSH: ow,
  rotrSL: iw,
  rotrBH: aw,
  rotrBL: cw,
  rotr32H: lw,
  rotr32L: fw,
  rotlSH: hw,
  rotlSL: uw,
  rotlBH: dw,
  rotlBL: pw,
  add: bw,
  add3L: gw,
  add3H: xw,
  add4L: ww,
  add4H: yw,
  add5H: Sw,
  add5L: mw
}, [Ew, Aw] = z.split([
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
class Ns extends Pi {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: l, Eh: u, El: h, Fh: c, Fl: p, Gh: d, Gl: w, Hh: y, Hl: v } = this;
    return [e, n, r, s, o, i, a, l, u, h, c, p, d, w, y, v];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, l, u, h, c, p, d, w, y, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = l | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = c | 0, this.Fl = p | 0, this.Gh = d | 0, this.Gl = w | 0, this.Hh = y | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      Ie[x] = e.getUint32(n), Ue[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const $ = Ie[x - 15] | 0, A = Ue[x - 15] | 0, P = z.rotrSH($, A, 1) ^ z.rotrSH($, A, 8) ^ z.shrSH($, A, 7), T = z.rotrSL($, A, 1) ^ z.rotrSL($, A, 8) ^ z.shrSL($, A, 7), C = Ie[x - 2] | 0, I = Ue[x - 2] | 0, g = z.rotrSH(C, I, 19) ^ z.rotrBH(C, I, 61) ^ z.shrSH(C, I, 6), E = z.rotrSL(C, I, 19) ^ z.rotrBL(C, I, 61) ^ z.shrSL(C, I, 6), H = z.add4L(T, E, Ue[x - 7], Ue[x - 16]), k = z.add4H(H, P, g, Ie[x - 7], Ie[x - 16]);
      Ie[x] = k | 0, Ue[x] = H | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: l, Dh: u, Dl: h, Eh: c, El: p, Fh: d, Fl: w, Gh: y, Gl: v, Hh: L, Hl: O } = this;
    for (let x = 0; x < 80; x++) {
      const $ = z.rotrSH(c, p, 14) ^ z.rotrSH(c, p, 18) ^ z.rotrBH(c, p, 41), A = z.rotrSL(c, p, 14) ^ z.rotrSL(c, p, 18) ^ z.rotrBL(c, p, 41), P = c & d ^ ~c & y, T = p & w ^ ~p & v, C = z.add5L(O, A, T, Aw[x], Ue[x]), I = z.add5H(C, L, $, P, Ew[x], Ie[x]), g = C | 0, E = z.rotrSH(r, s, 28) ^ z.rotrBH(r, s, 34) ^ z.rotrBH(r, s, 39), H = z.rotrSL(r, s, 28) ^ z.rotrBL(r, s, 34) ^ z.rotrBL(r, s, 39), k = r & o ^ r & a ^ o & a, M = s & i ^ s & l ^ i & l;
      L = y | 0, O = v | 0, y = d | 0, v = w | 0, d = c | 0, w = p | 0, { h: c, l: p } = z.add(u | 0, h | 0, I | 0, g | 0), u = a | 0, h = l | 0, a = o | 0, l = i | 0, o = r | 0, i = s | 0;
      const N = z.add3L(g, H, M);
      r = z.add3H(N, I, E, k), s = N | 0;
    }
    ({ h: r, l: s } = z.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = z.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l } = z.add(this.Ch | 0, this.Cl | 0, a | 0, l | 0), { h: u, l: h } = z.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: c, l: p } = z.add(this.Eh | 0, this.El | 0, c | 0, p | 0), { h: d, l: w } = z.add(this.Fh | 0, this.Fl | 0, d | 0, w | 0), { h: y, l: v } = z.add(this.Gh | 0, this.Gl | 0, y | 0, v | 0), { h: L, l: O } = z.add(this.Hh | 0, this.Hl | 0, L | 0, O | 0), this.set(r, s, o, i, a, l, u, h, c, p, d, w, y, v, L, O);
  }
  roundClean() {
    Ie.fill(0), Ue.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class vw extends Ns {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class Bw extends Ns {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class $w extends Ns {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
fn(() => new Ns());
fn(() => new vw());
fn(() => new Bw());
fn(() => new $w());
function _w(t, e, n) {
  const s = kx;
  if (Gw(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Vo.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var ft;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(ft || (ft = {}));
class Hw extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Lw extends Hw {
  constructor(e) {
    super(e);
  }
}
function E0(t) {
  const e = [];
  return e.push(or(Oi(t.version, 1))), e.push(or(t.hash160)), Kn(e);
}
function A0(t) {
  const e = [], n = Ci(t.content), r = n.byteLength;
  return e.push(or(Oi(r, t.lengthPrefixBytes))), e.push(n), Kn(e);
}
function Jt(t, e) {
  return Kn([t, e]);
}
function Iw(t) {
  return new Uint8Array([t.type]);
}
function Uw(t) {
  return t.type === ft.OptionalNone ? new Uint8Array([t.type]) : Jt(t.type, Dn(t.value));
}
function Ow(t) {
  const e = new Uint8Array(4);
  return Ps(e, t.buffer.length, 0), Jt(t.type, ki(e, t.buffer));
}
function Cw(t) {
  const e = p0(Lx(t.value, BigInt(Px)), b0);
  return Jt(t.type, e);
}
function kw(t) {
  const e = p0(t.value, b0);
  return Jt(t.type, e);
}
function Pw(t) {
  return Jt(t.type, E0(t.address));
}
function Nw(t) {
  return Jt(t.type, ki(E0(t.address), A0(t.contractName)));
}
function Dw(t) {
  return Jt(t.type, Dn(t.value));
}
function Tw(t) {
  const e = [], n = new Uint8Array(4);
  Ps(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Dn(r);
    e.push(s);
  }
  return Jt(t.type, Kn(e));
}
function Fw(t) {
  const e = [], n = new Uint8Array(4);
  Ps(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = _w(s);
    e.push(A0(o));
    const i = Dn(t.data[s]);
    e.push(i);
  }
  return Jt(t.type, Kn(e));
}
function v0(t, e) {
  const n = [], r = e == "ascii" ? Ox(t.data) : Ci(t.data), s = new Uint8Array(4);
  return Ps(s, r.length, 0), n.push(s), n.push(r), Jt(t.type, Kn(n));
}
function Mw(t) {
  return v0(t, "ascii");
}
function Rw(t) {
  return v0(t, "utf8");
}
function Dn(t) {
  switch (t.type) {
    case ft.BoolTrue:
    case ft.BoolFalse:
      return Iw(t);
    case ft.OptionalNone:
    case ft.OptionalSome:
      return Uw(t);
    case ft.Buffer:
      return Ow(t);
    case ft.UInt:
      return kw(t);
    case ft.Int:
      return Cw(t);
    case ft.PrincipalStandard:
      return Pw(t);
    case ft.PrincipalContract:
      return Nw(t);
    case ft.ResponseOk:
    case ft.ResponseErr:
      return Dw(t);
    case ft.List:
      return Tw(t);
    case ft.Tuple:
      return Fw(t);
    case ft.StringASCII:
      return Mw(t);
    case ft.StringUTF8:
      return Rw(t);
    default:
      throw new Lw("Unable to serialize. Invalid Clarity Value.");
  }
}
const Gw = (t, e) => t ? Ci(t).length > e : !1;
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var Vw = Object.defineProperty, Kw = Object.defineProperties, zw = Object.getOwnPropertyDescriptors, xs = Object.getOwnPropertySymbols, B0 = Object.prototype.hasOwnProperty, $0 = Object.prototype.propertyIsEnumerable, Wc = (t, e, n) => e in t ? Vw(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, qo = (t, e) => {
  for (var n in e || (e = {})) B0.call(e, n) && Wc(t, n, e[n]);
  if (xs) for (var n of xs(e)) $0.call(e, n) && Wc(t, n, e[n]);
  return t;
}, Wo = (t, e) => Kw(t, zw(e)), jw = (t, e) => {
  var n = {};
  for (var r in t) B0.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && xs) for (var r of xs(t)) e.indexOf(r) < 0 && $0.call(t, r) && (n[r] = t[r]);
  return n;
};
function qw(t) {
  return t ? typeof t == "string" ? rn.fromName(t) : "version" in t ? t : "url" in t ? new No({ url: t.url }) : t.transactionVersion === bs.Mainnet ? new No({ url: t.client.baseUrl }) : new Do({ url: t.client.baseUrl }) : new Do();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var Ww = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(Ww || {}), Xw = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(Xw || {}), _0 = (t) => {
  let e = t;
  if (!e) {
    let n = new uf(["store_write"], document.location.href);
    e = new Po({ appConfig: n });
  }
  return e;
};
function Yw(t) {
  try {
    return _0(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Jw = (t) => {
  let e = _0(t).loadUserData().appPrivateKey, n = mt.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function H0(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? Wo(qo({}, t), { message: Oc(e), domain: Oc(n) }) : Wo(qo({}, t), { message: It(Dn(e)), domain: It(Dn(n)) });
}
async function Zw(t, e) {
  return new mt.TokenSigner("ES256k", e).signAsync(H0(t));
}
async function Qw(t) {
  let e = t, { userSession: n } = e, r = jw(e, ["userSession"]);
  if (Yw(n)) {
    let { privateKey: s, publicKey: o } = Jw(n), i = Wo(qo({}, r), { publicKey: o });
    return Zw(i, s);
  }
  return mt.createUnsecuredToken(H0(t));
}
var ty = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(ty || {}), L0 = "asigna-stx", Xc = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === L0 && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(ny(t, e), "*");
}), ey = { authenticationRequest: async (t) => Xc(t, "authenticationRequest"), transactionRequest: async (t) => Xc(t, "transactionRequest") }, ny = (t, e) => ({ source: L0, [e]: t }), ry = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = ey);
};
ry();
const sy = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], Ti = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Ds = () => {
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
}, oy = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), I0 = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((o) => oy(o, r)) === s
  );
}, iy = (t) => t ? I0(Ds()).some(
  (e) => {
    var n;
    return e.id === t && (Ti(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, ay = () => {
  if (typeof window > "u")
    return;
  const t = Ds(), e = I0(t).filter(
    (n) => {
      var r;
      return Ti(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = tr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of sy) {
    const r = tr(t, n) ?? (t === window ? void 0 : tr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, cy = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Ds(), n = tr(e, t) ?? (e === window ? void 0 : tr(window, t)) ?? cg(t);
  if (n)
    return n;
  if (Ti(t) || iy(t))
    return ay();
}, ly = ["blockstack-session", "blockstack"], fy = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of ly) {
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
fy();
const hy = () => t0(), uy = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = t0(), e = t ? cy(t) : void 0;
  if (e)
    return e;
  const n = Ds() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, dy = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), Yc = (t) => af(t).replace(/^0x/, ""), Jc = "This wallet cannot sign messages. Try Xverse or Leather.", Zc = (t) => typeof (t == null ? void 0 : t.request) == "function", Qc = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", py = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, by = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function gy(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: Yc(e.message),
    domain: Yc(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function xy(t, e) {
  const n = await Qw({
    domain: e.domain,
    message: e.message,
    network: qw(e.network),
    stxAddress: e.stxAddress,
    appDetails: e.appDetails ?? dy()
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function wy(t) {
  var s, o;
  const e = hy() || "", n = /xverse/i.test(e);
  let r = uy();
  if (n && !Qc(r)) {
    const i = window;
    r = ((s = i.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((o = i.xverseProviders) == null ? void 0 : o.StacksProvider);
  }
  if (Qc(r))
    try {
      return await xy(r, t);
    } catch (i) {
      if (n || !Zc(r) || !by(i)) throw i;
    }
  if (!n && Zc(r))
    try {
      return await gy(r, t);
    } catch (i) {
      throw py(i) ? new Error(Jc) : i;
    }
  throw new Error(Jc);
}
function yy(t, e, n = {}) {
  const r = n.retryAfterMs ?? 3e4, s = n.now ?? Date.now, o = /* @__PURE__ */ new Map(), i = (a, l) => {
    l.pending = !0, l.failedAt = void 0, Promise.resolve().then(() => t(a)).then((u) => {
      l.pending = !1, u && (l.name = u, e());
    }).catch(() => {
      l.pending = !1, l.failedAt = s();
    });
  };
  return {
    get(a) {
      if (!a) return null;
      let l = o.get(a);
      return l ? !l.pending && l.name === null && l.failedAt !== void 0 && s() - l.failedAt >= r && i(a, l) : (l = { name: null, pending: !1 }, o.set(a, l), i(a, l)), l.name;
    }
  };
}
const my = {}, Sy = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, Ey = (t) => {
  const e = my;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, Ay = (t) => `/hiro/${t}`, vy = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, By = (t) => {
  const e = Ey(t);
  if (e)
    return [vy(e)];
  const n = Sy[t];
  return typeof window < "u" ? [`${window.location.origin}${Ay(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, $y = {}, tl = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, _y = "xtrata.log.enabled", Hy = "xtrata.log.level", Ly = "xtrata.log.tags", Iy = "xtrata.log.dedupe", Jr = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, Uy = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, Oy = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, Cy = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, ky = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, Py = () => {
  const t = $y ?? {}, e = Jr(_y) ?? t.VITE_LOG_ENABLED, n = Jr(Hy) ?? t.VITE_LOG_LEVEL, r = Jr(Ly) ?? t.VITE_LOG_TAGS, s = Jr(Iy) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: Uy(e),
    level: Oy(n) ?? "warn",
    tags: ky(r),
    dedupe: Cy(s)
  };
}, Ny = (t, e, n) => !t.enabled || tl[n] < tl[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), Dy = (t, e, n, r) => {
  const s = Py();
  if (!Ny(s, e, t) || Fy(s.dedupe))
    return;
  const o = `[xtrata:${e}] ${n}`, i = console[t] ?? console.log;
  r !== void 0 ? i(o, r) : i(o);
}, Ty = /* @__PURE__ */ new Set();
let el = null;
const Fy = (t, e, n, r, s) => (el !== t && (Ty.clear(), el = t), !1), My = (t, e, n) => Dy("debug", t, e, n), Ry = {}, Gy = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, Vy = (t) => {
  const e = Ry, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : Gy[t];
}, Ky = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, zy = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return Ky.test(n) ? n : null;
}, jy = (t) => t.replace(/\/+$/, ""), qy = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), nl = (t) => {
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
}, En = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, Wy = (t) => {
  var l, u;
  let e;
  try {
    e = An(mp(t));
  } catch {
    return null;
  }
  const n = En(e);
  if (!n || n.success === !1)
    return null;
  const r = En(n.value), s = En(r == null ? void 0 : r.value), o = En(s == null ? void 0 : s.value);
  if (!o)
    return null;
  const i = nl((l = En(o.name)) == null ? void 0 : l.value), a = nl((u = En(o.namespace)) == null ? void 0 : u.value);
  return !i || !a ? null : zy(`${i}.${a}`);
}, Xy = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${jy(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [af(Vd(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const o = await s.json();
  return !(o != null && o.okay) || typeof o.result != "string" ? null : Wy(o.result);
}, Yy = async (t) => {
  const e = t.address.trim();
  if (!Sp(e))
    return null;
  const n = Vy(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of By(t.network))
    try {
      return await Xy({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (o) {
      r = o;
    }
  return My("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: qy(r)
  }), null;
}, Jy = "ParallaX Casino", Zy = "ParallaX Casino room sign-in. This is free: it sends no transaction, costs no fees and gives no permission to spend anything.";
new TextEncoder();
new TextDecoder();
const Qy = (t) => t === "mainnet" ? 1 : 2147483648, t3 = (t) => `${Zy} Account ${t.address}. Valid until ${new Date(t.expires).toISOString().replace(".000Z", "Z")}. Request code ${t.nonce}.`, e3 = (t) => ({
  domain: tf({
    name: ns(Jy),
    version: ns("1"),
    "chain-id": Ql(Qy(t.network))
  }),
  message: ns(t3(t))
}), Zr = (t) => !!t && typeof t.request == "function", Fi = () => {
  try {
    const t = window.top;
    if (t && t !== window.self && t.location.origin === window.location.origin) return t;
  } catch {
  }
  return window;
}, n3 = () => {
  const t = Fi();
  return t === window ? [window] : [t, window];
}, rl = (t) => {
  for (const e of n3()) {
    const n = t(e);
    if (n) return n;
  }
  return null;
}, r3 = (t) => {
  if (t === "leather") {
    const n = rl((r) => Zr(r.LeatherProvider) ? r.LeatherProvider : null);
    return n ? { rpc: n } : null;
  }
  const e = rl((n) => {
    const r = n.XverseProviders || n.xverseProviders;
    return r && (Zr(r.BitcoinProvider) || Zr(r.StacksProvider)) ? r : null;
  });
  return e ? { rpc: Zr(e.BitcoinProvider) ? e.BitcoinProvider : e.StacksProvider } : null;
}, s3 = (t, e) => new Promise((n) => {
  const r = Date.now();
  (function s() {
    const o = r3(t);
    o || Date.now() - r >= e ? n(o) : window.setTimeout(s, 150);
  })();
}), ws = (t) => {
  var e;
  return (t == null ? void 0 : t.code) ?? ((e = t == null ? void 0 : t.error) == null ? void 0 : e.code);
}, Je = (t) => {
  var e;
  return String((t == null ? void 0 : t.message) ?? ((e = t == null ? void 0 : t.error) == null ? void 0 : e.message) ?? t ?? "unknown error");
}, o3 = (t) => [4001, -31001].includes(Number(ws(t))) || /cancel|denied|reject|declin|closed/i.test(Je(t)), sl = (t) => Number(ws(t)) === -32601 || /not supported|method not found|unsupported|not implemented|legacy method/i.test(Je(t)), po = async (t, e, n) => {
  const r = n === void 0 ? await t.request(e) : await t.request(e, n);
  if (r && typeof r == "object") {
    if (r.error) throw Object.assign(new Error(Je(r.error)), { code: ws(r.error) });
    if (r.status === "error") throw Object.assign(new Error(Je(r.error || r)), { code: ws(r.error || r) });
    if ("result" in r) return r.result;
  }
  return r;
}, i3 = (t) => new Promise((e, n) => {
  const r = window.setTimeout(() => n(new Error("The wallet did not answer. Check its window.")), 9e4);
  t.then((s) => {
    window.clearTimeout(r), e(s);
  }, (s) => {
    window.clearTimeout(r), n(s);
  });
}), a3 = (t) => (JSON.stringify(t) || "").match(/S[PT][0-9A-HJKMNP-TV-Z]{38,39}/g) || [], Oe = [], ir = () => {
  const t = Fi().ParallaxCasinoWalletUI ?? window.ParallaxCasinoWalletUI;
  try {
    return t && t.available() ? t : null;
  } catch {
    return null;
  }
}, c3 = (t) => {
  const e = Fi().ParallaxPasskeyWallet ?? window.ParallaxPasskeyWallet;
  return e != null && e.signRoomJoin ? e.signRoomJoin(t) : Promise.reject(new Error("The casino wallet is not loaded. Reload the page."));
};
async function l3(t) {
  if (t === "casino") {
    const s = ir();
    if (!s) throw new Error("The casino wallet is not available here yet. Reload the page.");
    const o = await s.open();
    if (!o) throw new Error("The casino wallet did not open.");
    return { kind: t, address: o, network: o.startsWith("SP") ? "mainnet" : "testnet", via: "casino-wallet" };
  }
  const e = await s3(t, 1500);
  if (!e) throw new Error(`${t === "leather" ? "Leather" : "Xverse"} was not found in this browser.`);
  Oe.length = 0;
  let n;
  if (t === "xverse") {
    try {
      await po(e.rpc, "wallet_disconnect"), Oe.push("wallet_disconnect: ok");
    } catch (s) {
      Oe.push("wallet_disconnect: " + Je(s).slice(0, 80));
    }
    n = ["wallet_connect", "wallet_getAccount"];
  } else
    n = ["getAddresses", "stx_getAccounts", "stx_getAddresses", "stx_requestAccounts"];
  let r = null;
  for (const s of n)
    try {
      const o = await (t === "xverse" ? i3(po(e.rpc, s)) : po(e.rpc, s)), i = a3(o);
      if (i.length) {
        const a = i[0];
        return Oe.push(`${s}: ok`), { kind: t, address: a, network: a.startsWith("SP") ? "mainnet" : "testnet", via: s };
      }
      Oe.push(`${s}: answered but no Stacks address in it`);
    } catch (o) {
      if (o3(o))
        throw Oe.push(`${s}: cancelled`), new Error("Connection cancelled.");
      Oe.push(`${s}: ${sl(o) ? "not supported" : Je(o).slice(0, 80)}`), sl(o) || (r = o);
    }
  throw new Error(r ? Je(r) : "The wallet did not share a Stacks address.");
}
const U0 = (t) => {
  t !== "casino" && lg(t === "leather" ? "LeatherProvider" : "XverseProviders.BitcoinProvider");
}, ys = (t) => t instanceof Error ? t.message : String(t), bo = 500, O0 = 40, f3 = 2e3, ar = 280, ol = "px_room_blocks_v1", il = "px_chat_ui_v1", go = "px_chat_session_v1:", al = { hidden: !1, side: "left" }, h3 = [
  { code: "spam", label: "Spam" },
  { code: "abuse", label: "Abuse" },
  { code: "scam", label: "Scam" },
  { code: "other", label: "Something else" }
], u3 = (t) => {
  if (!Array.isArray(t)) return [];
  const e = [];
  for (const n of t)
    if (!(typeof n != "string" || !/^S[A-Z0-9]{19,60}$/.test(n) || e.includes(n)) && (e.push(n), e.length >= O0))
      break;
  return e;
}, d3 = (t) => {
  if (!t) return [];
  try {
    return u3(JSON.parse(t));
  } catch {
    return [];
  }
}, p3 = (t) => {
  if (!t) return { ...al };
  try {
    const e = JSON.parse(t);
    return { hidden: (e == null ? void 0 : e.hidden) === !0, side: (e == null ? void 0 : e.side) === "right" ? "right" : "left" };
  } catch {
    return { ...al };
  }
}, C0 = {
  "no-links": "Links are not allowed in messages.",
  "too-long": `That message is too long (${ar} characters at most).`,
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
}, b3 = (t) => typeof t == "string" && Object.prototype.hasOwnProperty.call(C0, t), Yn = (t) => C0[String(t)] ?? "The room could not take that. Try again in a moment.", g3 = (t) => t.replace(/\s+/g, " ").trim(), x3 = (t) => Array.from(t).length, w3 = (t, e) => {
  const n = g3(t);
  return e.signed ? e.connected ? n ? x3(n) > ar ? { ok: !1, code: "too-long" } : e.now - e.lastSentAt < f3 ? { ok: !1, code: "slow-down" } : { ok: !0, text: n } : { ok: !1, code: "empty" } : { ok: !1, code: "offline" } : { ok: !1, code: "sign-in-first" };
};
class y3 {
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
    return o && (i.to = o), this.lines.push(i), this.lines.length > bo && this.lines.splice(0, this.lines.length - bo), i;
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
    for (const s of n.slice(-bo)) {
      if (!s || typeof s.a != "string" || typeof s.t != "string" || typeof s.at != "number") continue;
      const o = typeof s.to == "string" ? { a: s.to } : void 0;
      this.add({ a: s.a }, s.t.slice(0, ar * 2), s.m === 1, s.at, o) && (r += 1);
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
class m3 {
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
const S3 = `
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
function E3(t) {
  const e = new y3(), n = new m3();
  let r = { hidden: !1, side: "left" }, s = [];
  try {
    r = p3(window.localStorage.getItem(il)), s = d3(window.localStorage.getItem(ol));
  } catch {
  }
  e.setBlocked(s);
  let o = !1, i = null, a = null, l = !1, u = "", h = 0, c = 0, p = 0, d = null, w = 0, y = !0, v = null;
  const L = () => {
    try {
      window.localStorage.setItem(il, JSON.stringify(r));
    } catch {
    }
  }, O = () => {
    try {
      window.localStorage.setItem(ol, JSON.stringify(s));
    } catch {
    }
  }, x = (S) => t.labelFor(S), $ = () => {
    if (v)
      try {
        window.sessionStorage.setItem(go + v, e.dump());
      } catch {
      }
  }, A = (S) => {
    if (S)
      try {
        window.sessionStorage.removeItem(go + S);
      } catch {
      }
  }, P = (S) => {
    if (S !== v) {
      if (A(v), e.clear(), At.forEach((F) => F.remove()), At.clear(), v = S, S)
        try {
          e.load(window.sessionStorage.getItem(go + S));
        } catch {
        }
      y = !0;
    }
  }, T = (S) => s.includes(S), C = document.createElement("style");
  C.textContent = S3, document.head.append(C);
  const I = q("div");
  I.id = "pxchat";
  const g = q("div");
  g.id = "pxchat-lines";
  const E = q("button", "New messages ↓", "newer");
  E.type = "button", E.hidden = !0, g.setAttribute("role", "log"), g.setAttribute("aria-live", "polite"), g.setAttribute("aria-label", "Casino chat");
  const H = q("div", void 0, "panel");
  H.id = "pxchat-menu", H.hidden = !0;
  const k = q("div", void 0, "panel");
  k.id = "pxchat-panel", k.hidden = !0;
  const M = q("form");
  M.hidden = !0;
  const N = q("button", void 0, "to");
  N.type = "button", N.hidden = !0;
  const et = q("input");
  et.type = "text", et.autocomplete = "off", et.enterKeyHint = "send", et.maxLength = ar * 2;
  const ce = q("button", "Send", "sm");
  ce.type = "submit", M.append(N, et, ce);
  const Zt = q("div", void 0, "bar");
  Zt.hidden = !0;
  const rt = Kt("Here now", () => Ke("people")), j = Kt("Hide chat", () => Ar()), zn = Kt("", () => {
    r.side = r.side === "left" ? "right" : "left", L(), tt();
  }), hn = Kt("Blocked", () => Ke("blocked"));
  rt.id = "pxchat-people", j.id = "pxchat-hide", zn.id = "pxchat-side", hn.id = "pxchat-blocked", Zt.append(rt, j, zn, hn), I.append(g, E, H, k, M, Zt);
  const it = q("button");
  it.id = "pxchat-btn", it.type = "button", it.setAttribute("aria-controls", "pxchat");
  const At = /* @__PURE__ */ new Map(), br = () => o || !!a || !!u, Fs = () => {
    var S;
    return (S = window.matchMedia) != null && S.call(window, "(max-width:700px)").matches ? 5 : 8;
  }, un = (S) => {
    const F = q("button", x(S.a), "nm");
    return F.type = "button", F.dataset.a = S.a, F.setAttribute("aria-label", `Options for ${x(S.a)}`), F.onclick = () => Dt(S), F;
  }, Ms = (S) => {
    const F = S.who ? `ln${S.mine ? " mine" : ""}${S.to ? " dm" : ""}` : "ln note", J = q("div", void 0, F);
    if (!S.who)
      return J.append(q("span", S.text, "tx")), J;
    const X = [];
    return S.to ? S.mine ? X.push(q("span", "You", "nm"), q("span", "→", "tag"), un(S.to)) : X.push(un(S.who), q("span", "→ you", "tag")) : X.push(S.mine ? q("span", "You", "nm") : un(S.who)), X.push(q("span", S.text, "tx")), X.forEach((ht, dt) => {
      dt && J.append(document.createTextNode(" ")), J.append(ht);
    }), J;
  }, Rs = () => g.scrollTop + g.clientHeight >= g.scrollHeight - 8, gr = () => {
    g.scrollTop = g.scrollHeight, y = !0, E.hidden = !0;
  }, xr = () => {
    const S = br(), F = S ? e.all() : e.tail(Fs()), J = g.classList.contains("scroll");
    g.classList.toggle("scroll", S);
    const X = new Set(F.map((bt) => bt.id));
    let ht = !1;
    for (const [bt, gt] of At) X.has(bt) || (gt.remove(), At.delete(bt));
    let dt = null;
    for (const bt of F) {
      let gt = At.get(bt.id);
      gt || (gt = Ms(bt), At.set(bt.id, gt), ht = !0);
      const Tt = dt ? dt.nextElementSibling : g.firstElementChild;
      Tt !== gt && g.insertBefore(gt, Tt), dt = gt;
    }
    if (!S) {
      E.hidden = !0, y = !0;
      return;
    }
    !J || y ? gr() : ht && (E.hidden = !1);
  }, wr = () => {
    it.replaceChildren(q("span", "💬", "ic"), q("span", "Chat", "lbl")), r.hidden && h > 0 && it.append(q("span", h > 9 ? "9+" : String(h), c ? "dot dm" : "dot")), it.setAttribute("aria-expanded", String(o && !r.hidden)), it.setAttribute("aria-label", r.hidden && h ? `Chat: ${h} new${c ? `, ${c} sent to you` : ""}` : "Casino chat: type a message");
  }, yr = () => {
    M.hidden = !o || r.hidden, N.hidden = !i, i && (N.textContent = `To ${x(i.a)} ×`, N.setAttribute("aria-label", `Writing to ${x(i.a)}. Press to write to the whole room instead.`)), et.classList.toggle("dm", !!i);
    const S = i ? `Message ${x(i.a)}` : "Say something to the room";
    et.placeholder = S, et.setAttribute("aria-label", S);
  }, mr = () => {
    if (H.replaceChildren(), H.hidden = !a, !a) return;
    const S = a, F = T(S.a);
    H.append(q("p", x(S.a), "who"));
    const J = q("div", void 0, "row");
    if (l) {
      H.append(q("p", "Why? Your report goes to the casino team with the last few things they said to you or the room."));
      for (const X of h3) J.append(Kt(X.label, () => {
        Vs(S, X.code), Ve();
      }));
    } else {
      const X = Kt("Message", () => {
        Ve(), Gs(S);
      });
      X.disabled = F || !n.has(S.a), F ? H.append(q("p", "You have blocked this person. Unblock them to message them.")) : n.known && !n.has(S.a) && H.append(q("p", "They have left the room.")), J.append(
        X,
        Kt(F ? "Unblock" : "Block", () => {
          Wn(S, !F), Ve();
        }),
        Kt("Report…", () => {
          l = !0, tt();
        }, "sm danger")
      );
    }
    J.append(Kt("Cancel", Ve)), H.append(J);
  }, Sr = () => {
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
        F.append(q("span", x(S)), Kt("Unblock", () => {
          Wn({ a: S }, !1), tt();
        })), k.append(F);
      }
    }
  }, tt = () => {
    I.hidden = r.hidden, I.classList.remove("left", "right"), I.classList.add(r.side), Zt.hidden = !o || r.hidden;
    const S = n.others(t.me()).length;
    rt.textContent = n.known ? `Here now (${S})` : "Here now", rt.classList.toggle("on", u === "people"), zn.textContent = r.side === "left" ? "Move right ▸" : "◂ Move left", hn.textContent = s.length ? `Blocked (${s.length})` : "Blocked", hn.classList.toggle("on", u === "blocked"), wr(), yr(), mr(), Sr(), xr(), dn();
  }, dn = () => {
    const S = window.innerWidth, F = window.innerHeight, J = document.getElementById("tools"), X = Math.round(Math.max(70, (J ? J.getBoundingClientRect().bottom : 58) + 12));
    let ht = r.side === "left" ? 14 : null, dt = Math.min(340, S - 28), bt = F - X - 12, gt = !1;
    const Tt = document.getElementById("intro"), xt = Tt && Tt.getClientRects().length ? Tt.getBoundingClientRect() : null;
    xt && xt.width > 0 && xt.height > 0 && xt.bottom > X && (r.side === "left" ? xt.left < 14 + dt : xt.right > S - 14 - dt) && (r.side === "left" && S - xt.right - 30 >= 260 ? (ht = Math.round(xt.right + 16), dt = Math.min(340, S - ht - 14)) : (gt = !0, bt = Math.max(170, Math.round(xt.top - X - 8)))), I.style.top = `${X}px`, I.style.left = ht === null ? "auto" : `${ht}px`, I.style.right = ht === null ? "14px" : "", I.style.width = `${dt}px`, I.style.maxHeight = `${bt}px`, I.classList.toggle("over", gt && !I.hidden && (o || At.size > 0));
  }, pt = (S) => {
    e.add(null, S, !1, Date.now());
  }, Er = () => {
    try {
      document.pointerLockElement && document.exitPointerLock();
    } catch {
    }
  }, Ge = () => {
    if (!t.me()) {
      r.hidden && (r.hidden = !1, L()), o = !1, pt("Join the room to chat. Anyone can watch; you need one free signature to speak."), tt(), t.joinPrompt();
      return;
    }
    r.hidden && (r.hidden = !1, L()), h = 0, c = 0, o = !0, Er(), tt(), et.focus();
  }, pn = () => {
    o = !1, a = null, l = !1, u = "", et.blur(), tt();
  }, Ar = () => {
    r.hidden = !0, L(), o = !1, a = null, l = !1, u = "", h = 0, c = 0, et.blur(), tt();
  }, Ve = () => {
    a = null, l = !1, tt();
  };
  function Dt(S) {
    a = S, l = !1, Er(), tt();
  }
  function Ke(S) {
    u = u === S ? "" : S, a = null, l = !1, tt();
  }
  function Gs(S) {
    if (T(S.a)) {
      pt(Yn("blocked")), tt();
      return;
    }
    i = { a: S.a }, u = "", Ge();
  }
  const jn = () => {
    i = null, tt(), et.focus();
  }, qn = () => {
    t.me() && t.send({ t: "blocks", list: s }) && (w = Date.now());
  };
  function Wn(S, F) {
    const J = x(S.a);
    if (F) {
      if (s.length >= O0) {
        pt(Yn("too-many-blocks"));
        return;
      }
      s.includes(S.a) || s.push(S.a), e.dropFrom(S.a), $(), (i == null ? void 0 : i.a) === S.a && (i = null), pt(`You blocked ${J}. Neither of you will see the other's messages.`);
    } else
      s = s.filter((X) => X !== S.a), pt(`You unblocked ${J}.`);
    e.setBlocked(s), At.forEach((X) => X.remove()), At.clear(), O(), qn();
  }
  function Vs(S, F) {
    if (!t.me() || !t.connected()) {
      pt("Not connected to the room, so the report was not sent.");
      return;
    }
    t.send({ t: "report", who: S.a, why: F, lines: e.lastFrom(S.a) }) && (w = Date.now()), pt("Sending your report…");
  }
  it.onclick = () => {
    o && !r.hidden ? pn() : Ge();
  }, N.onclick = jn, E.onclick = () => gr(), g.addEventListener("scroll", () => {
    y = Rs(), y && (E.hidden = !0);
  }, { passive: !0 }), g.addEventListener("wheel", (S) => {
    g.classList.contains("scroll") && S.stopPropagation();
  }, { passive: !0 }), g.addEventListener("touchmove", (S) => {
    g.classList.contains("scroll") && S.stopPropagation();
  }, { passive: !0 }), M.onsubmit = (S) => {
    S.preventDefault();
    const F = Date.now(), J = w3(et.value, { signed: !!t.me(), connected: t.connected(), now: F, lastSentAt: p }), X = "Not connected to the room yet. Your message is still in the box.";
    if (!J.ok) {
      pt(J.code === "offline" ? X : Yn(J.code)), tt();
      return;
    }
    if (i && n.known && !n.has(i.a)) {
      pt(Yn("not-here")), tt();
      return;
    }
    const ht = i ? { t: "dm", to: i.a, text: J.text } : { t: "say", text: J.text };
    if (!t.send(ht)) {
      pt(X), tt();
      return;
    }
    p = F, w = F, d = { text: J.text, to: i }, et.value = "";
  }, et.addEventListener("keydown", (S) => {
    S.stopPropagation(), S.key === "Escape" && (S.preventDefault(), i && !et.value ? jn() : pn());
  }), et.addEventListener("keypress", (S) => S.stopPropagation()), document.addEventListener("pointerdown", (S) => {
    if (!a && !u) return;
    const F = S.target;
    F && (I.contains(F) || it.contains(F)) || (a = null, l = !1, u = "", tt());
  }), window.addEventListener("resize", dn);
  const vr = document.getElementById("intro");
  vr && "MutationObserver" in window && new MutationObserver(() => dn()).observe(vr, { attributes: !0, attributeFilter: ["class", "style", "hidden"] });
  const Ks = {
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
      e.add({ a: S.from.a }, String(S.text ?? "").slice(0, ar * 2), J, Date.now(), X) && ($(), J ? (d = null, y = !0) : r.hidden && (h += 1, X && (c += 1)), tt());
    },
    /**
     * The room refused something. Only a refusal of something chat just sent is chat's business: the room also says "slow down" to
     * the page's own seat updates, and those must not show up as chat notes. Returns whether chat took it.
     * A refused message goes back into the box so nothing typed is lost.
     */
    failed(S) {
      return !d && Date.now() - w > 4e3 ? !1 : (d && !et.value && (et.value = d.text, d.to && S !== "not-here" && S !== "no-such-player" && (i = d.to)), (S === "not-here" || S === "no-such-player") && (i = null), d = null, pt(Yn(S)), tt(), !0);
    },
    reported() {
      pt("Report sent. Thank you."), tt();
    },
    /** A fresh connection: the room has forgotten our block list, so hand it over again, and take its list of who is here. */
    room(S, F) {
      n.set(S), P(F ? t.me() : null), F ? qn() : (o = !1, i = null, a = null, l = !1, u = "", et.value = "", d = null), i && !n.has(i.a) && (i = null), tt();
    },
    joined(S) {
      n.join(S), u === "people" || a ? tt() : rt.textContent = `Here now (${n.others(t.me()).length})`;
    },
    left(S) {
      n.leave(S), typeof S == "string" && (i == null ? void 0 : i.a) === S && (pt(`${x(S)} left the room.`), i = null), tt();
    },
    /** The player pressed Leave the room: their session's chat is cleared from this tab now. */
    endSession() {
      P(null), o = !1, i = null, a = null, l = !1, u = "", et.value = "", d = null, tt();
    },
    /** The connection dropped: until the room speaks again we do not know who is here. Their chat stays: a reconnect is the same session. */
    disconnected() {
      n.forget(), tt();
    },
    /** Names learned from BNS arrive late; relabel what is already on screen. */
    refreshNames() {
      I.querySelectorAll("button.nm[data-a]").forEach((S) => {
        S.textContent = x(S.dataset.a);
      }), i && yr();
    },
    isTyping: () => o,
    debug: () => ({ typing: o, hidden: r.hidden, side: r.side, target: (i == null ? void 0 : i.a) ?? null, blocks: [...s], lines: e.size, shown: At.size, session: v, stick: y, people: n.others(t.me()).map((S) => S.a) })
  };
  return wr(), Ks;
}
const b = {
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
let W = null;
const A3 = (t) => t.length <= 12 ? t : `${t.slice(0, 5)}…${t.slice(-4)}`, v3 = (t) => {
  if (t.startsWith("SP")) return t;
  const e = bi(t);
  return vo({ ...e, version: yo.MainnetSingleSig });
}, B3 = yy((t) => Yy({ address: v3(t), network: "mainnet" }), () => {
  ms(), Xo(), W == null || W.refreshNames();
}), Ts = (t) => {
  let e = null;
  try {
    e = B3.get(t);
  } catch {
  }
  return e || A3(t);
}, k0 = (t, e) => ({ key: t, label: Ts(t), x: e.x, z: e.z, r: e.r, at: e.at }), Xo = () => {
  var n, r;
  if (!((n = b.host) != null && n.moves) || b.service !== "ok") return;
  const t = ((r = b.you) == null ? void 0 : r.a) ?? null, e = [...b.walk.entries()].filter(([s]) => s !== t).map(([s, o]) => k0(s, o));
  try {
    b.host.moves(e);
  } catch (s) {
    console.warn("[room] the page could not draw the walkers", s);
  }
}, Qr = (t, e) => {
  var n, r;
  if (e ? b.walk.set(t, e) : b.walk.delete(t), !(!((n = b.host) != null && n.move) || t === (((r = b.you) == null ? void 0 : r.a) ?? null)))
    try {
      b.host.move(e ? k0(t, e) : { key: t, off: !0 });
    } catch (s) {
      console.warn("[room] the page could not move a walker", s);
    }
}, P0 = () => {
  var t;
  !b.features.includes("move") || b.service !== "ok" || !b.connected || !b.signed || !b.you || b.you.guest || ((t = b.ws) == null ? void 0 : t.readyState) === WebSocket.OPEN && (b.ownMove ? (b.ws.send(JSON.stringify({ t: "move", ...b.ownMove })), b.ownSent = !0) : b.ownSent && (b.ws.send(JSON.stringify({ t: "move", off: !0 })), b.ownSent = !1));
}, ms = () => {
  var n;
  if (!b.host || b.service !== "ok") return;
  const t = ((n = b.you) == null ? void 0 : n.a) ?? null, e = Object.entries(b.spots).filter(([, r]) => r.a !== t).map(([r, s]) => ({ key: s.a, spot: r, label: Ts(s.a), since: s.since }));
  try {
    b.host.setPeople(e);
  } catch (r) {
    console.warn("[room] the page could not draw the people", r);
  }
}, Ss = async (t, e) => {
  const n = await fetch(t, { credentials: "same-origin", ...e });
  let r = null;
  try {
    r = await n.json();
  } catch {
  }
  return { res: n, body: r };
}, Yo = (t) => {
  var e;
  return ((e = b.ws) == null ? void 0 : e.readyState) !== WebSocket.OPEN ? !1 : (b.ws.send(JSON.stringify(t)), b.lastSent = Date.now(), !0);
}, N0 = () => {
  var e;
  if (b.service !== "ok" || !b.connected || !b.you || b.you.guest || !b.signed) return;
  const t = ((e = Object.entries(b.spots).find(([, n]) => n.a === b.you.a)) == null ? void 0 : e[0]) ?? null;
  b.want ? t !== b.want && b.want !== b.badSpot && b.want !== b.yielded && !b.spots[b.want] && Date.now() - b.lastSent > 1200 && Yo({ t: "sit", spot: b.want }) : t && t !== b.standSent && Date.now() - b.lastSent > 600 && (b.standSent = t, Yo({ t: "stand" }));
}, Mi = () => {
  if (b.service !== "ok" || b.ws) return;
  b.attempts += 1;
  let t;
  try {
    t = new WebSocket(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/casino/room/ws`);
  } catch {
    return cl();
  }
  b.ws = t, t.onopen = () => {
    b.connected = !0, b.attempts = 0, at();
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
        b.you = n.you, b.spots = n.spots || {}, b.joined = n.joined, b.guests = n.guests, b.watch = n.watch !== !1, b.arrivedAt || (b.arrivedAt = Date.now()), b.features = Array.isArray(n.features) ? n.features.filter((a) => typeof a == "string") : [], b.walk = /* @__PURE__ */ new Map();
        for (const a of Array.isArray(n.walkers) ? n.walkers : []) a && typeof a.a == "string" && b.walk.set(a.a, { x: +a.x, z: +a.z, r: +a.r, at: +a.at });
        Xo(), b.ownSent = !1, P0(), b.standSent = null, b.signed && ((r = b.you) != null && r.guest) && (b.signed = null), W == null || W.room(n.players, !!(b.you && !b.you.guest));
        break;
      case "sat":
        b.spots[n.spot] = n.who, (s = n.who) != null && s.a && b.walk.has(n.who.a) && Qr(n.who.a, null);
        break;
      case "stood":
        delete b.spots[n.spot], b.standSent === n.spot && (b.standSent = null);
        break;
      case "moved":
        b.yielded = n.spot;
        break;
      case "count":
        b.joined = n.joined, b.guests = n.guests;
        break;
      case "say":
      case "dm":
        W == null || W.heard(n);
        return;
      case "join":
        W == null || W.joined(n.who);
        return;
      case "leave":
        W == null || W.left(n.a), b.walk.has(n.a) && Qr(n.a, null);
        return;
      case "reported":
        W == null || W.reported();
        return;
      case "play":
        if (typeof n.spot == "string" && Array.isArray(n.s) && typeof n.b == "number")
          try {
            (i = (o = b.host) == null ? void 0 : o.play) == null || i.call(o, n.spot, { a: String(n.a || ""), s: n.s, b: n.b, f: !!n.f });
          } catch (a) {
            console.warn("[room] the page could not show a spin", a);
          }
        return;
      case "move":
        typeof n.a == "string" && (n.off ? Qr(n.a, null) : [n.x, n.z, n.r, n.at].every((a) => typeof a == "number" && Number.isFinite(a)) && Qr(n.a, { x: n.x, z: n.z, r: n.r, at: n.at }));
        return;
      case "err":
        if (typeof n.code == "string" && (n.code.startsWith("play-") || n.code.startsWith("move-"))) return;
        n.code === "no-such-spot" ? b.badSpot = b.want : b3(n.code) && (W != null && W.failed(n.code)) || n.code === "slow-down" && (b.lastSent = Date.now() + 3e3);
        return;
      default:
        return;
    }
    ms(), N0(), at();
  }, t.onclose = (e) => {
    if (b.ws === t) {
      if (b.ws = null, b.connected = !1, b.spots = {}, ms(), b.walk = /* @__PURE__ */ new Map(), Xo(), b.ownSent = !1, W == null || W.disconnected(), e.code === 4001) {
        b.replaced = !0, at();
        return;
      }
      at(), cl();
    }
  }, t.onerror = () => {
  };
}, cl = () => {
  window.clearTimeout(b.retryTimer);
  const t = Math.min(15e3, 1e3 * 2 ** Math.min(b.attempts, 4));
  b.retryTimer = window.setTimeout(() => {
    b.ws || Mi();
  }, t);
}, Ri = () => {
  const t = b.ws;
  b.ws = null, b.connected = !1, b.attempts = 0, b.replaced = !1;
  try {
    t == null || t.close(1e3, "client");
  } catch {
  }
  Mi();
};
async function D0(t) {
  const { res: e, body: n } = await Ss(`/casino/room/challenge?address=${encodeURIComponent(t.address)}`);
  if (!e.ok) throw new Error((n == null ? void 0 : n.error) || `The room answered ${e.status}.`);
  const r = n.challenge, { domain: s, message: o } = e3(r);
  b.busy = "sign", at();
  let i;
  try {
    i = t.kind === "casino" ? await c3(r) : await wy({
      domain: s,
      message: o,
      network: r.network,
      stxAddress: t.address,
      appDetails: { name: "ParallaX Casino", icon: `${location.origin}/favicons/xtrata-apple-touch-icon.png` }
    });
  } catch (u) {
    throw new Error("The wallet did not sign: " + ys(u));
  }
  const { res: a, body: l } = await Ss("/casino/room/session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ challenge: r, signature: i })
  });
  if (!a.ok) throw new Error((l == null ? void 0 : l.error) || `The room answered ${a.status}.`);
  b.signed = { address: l.address, hash160: l.hash160, expiresAt: l.expiresAt }, Ri();
}
async function $3(t) {
  var n, r;
  if (b.busy) return;
  b.error = "", b.busy = "connect", at();
  const e = t === "casino" && !((n = ir()) != null && n.describe().has);
  try {
    b.wallet = await l3(t), U0(t), await D0(b.wallet), b.open = !1, e && ((r = ir()) == null || r.fundNew().catch(() => {
    }));
  } catch (s) {
    b.error = /cancel/i.test(ys(s)) ? "" : ys(s);
  } finally {
    b.busy = "", at();
  }
}
async function _3(t) {
  var r;
  const e = t.detail;
  if (!e || typeof e.address != "string" || b.service !== "ok" || b.busy || ((r = b.signed) == null ? void 0 : r.address) === e.address) return;
  const n = e.kind === "casino" || e.kind === "leather" || e.kind === "xverse" ? e.kind : null;
  if (n) {
    b.error = "", b.busy = "sign", at();
    try {
      b.wallet = { kind: n, address: e.address, network: e.address.startsWith("SP") ? "mainnet" : "testnet", via: "page" }, U0(n), await D0(b.wallet), b.open = !1;
    } catch (s) {
      const o = ys(s);
      /cancel/i.test(o) || (b.error = o, b.open = !0);
    } finally {
      b.busy = "", at();
    }
  }
}
const H3 = 2e3, L3 = () => {
  var t;
  b.prompted || b.service !== "ok" || !b.connected || b.signed || b.busy || b.open || !b.arrivedAt || Date.now() - b.arrivedAt < H3 || (t = b.host) != null && t.currentSpot() || (b.prompted = !0, b.open = !0, at());
}, I3 = () => {
  const t = ir();
  let e = null;
  try {
    e = localStorage.getItem("STX_PROVIDER");
  } catch {
  }
  const n = /Xverse/.test(e || "") ? ["xverse", "leather"] : ["leather", "xverse"];
  return t ? t.describe().has || !e ? ["casino", ...n] : [n[0], "casino", n[1]] : n;
};
async function U3() {
  try {
    await Ss("/casino/room/session", { method: "DELETE" });
  } catch {
  }
  b.signed = null, b.wallet = null, b.error = "", W == null || W.endSession(), W == null || W.disconnected(), Ri(), at();
}
const O3 = `
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
}, We = (t, e) => {
  const n = st("p", void 0, "fact");
  return n.append(st("b", t), document.createTextNode(` ${e}`)), n;
};
let Ce = null, Bt = null, jt = null;
function C3() {
  var n, r;
  if (Ce || b.service !== "ok") return;
  const t = document.createElement("style");
  t.textContent = O3, document.head.append(t), Ce = st("span"), Ce.id = "pxroom", Bt = st("button"), Bt.id = "pxroom-btn", Bt.type = "button", Bt.setAttribute("aria-label", "Casino room: see who is here and join"), Bt.onclick = () => {
    b.open = !b.open, at();
  }, jt = st("div"), jt.id = "pxroom-panel", jt.hidden = !0, W = E3({
    send: Yo,
    me: () => b.you && !b.you.guest ? b.you.a : null,
    connected: () => b.connected,
    labelFor: Ts,
    joinPrompt: () => {
      b.open = !0, at();
    }
  }), Ce.append(Bt, W.button);
  const e = ((r = (n = b.host) == null ? void 0 : n.mount) == null ? void 0 : r.call(n)) ?? document.querySelector("#tools .rt");
  e ? e.insertBefore(Ce, e.firstChild) : (Ce.style.cssText = "position:fixed;top:10px;right:10px;z-index:30", document.body.append(Ce)), document.body.append(jt), W.mount(document.body), document.addEventListener("keydown", (s) => {
    s.key === "Escape" && b.open && (b.open = !1, at());
  }), document.addEventListener("pointerdown", (s) => {
    if (!b.open) return;
    const o = s.target;
    o && (jt.contains(o) || Bt.contains(o)) || (b.open = !1, at());
  }), window.addEventListener("resize", () => at());
}
function k3() {
  if (!Bt || !jt) return;
  const t = Bt.getBoundingClientRect(), e = t.height ? Math.round(t.bottom + 8) : 64;
  jt.style.top = `${Math.min(e, Math.max(64, window.innerHeight - 220))}px`;
}
function at() {
  var n;
  if (!Ce || !Bt || !jt) return;
  const t = !!(b.signed && b.you && !b.you.guest);
  if (Bt.className = b.connected ? "live" : "wait", Bt.replaceChildren(st("i"), st("span", t ? "In the room" : "Room", "lbl"), st("span", b.connected ? (n = window.matchMedia) != null && n.call(window, "(max-width:620px)").matches ? String(b.joined) : ` · ${b.joined}` : "", "n")), Bt.setAttribute("aria-label", `Casino room: ${b.connected ? `${b.joined} signed in, ` : ""}${t ? "you are in" : "see who is here and join"}`), jt.hidden = !b.open, !b.open) return;
  k3();
  const e = [];
  if (b.replaced) {
    e.push(st("h3", "Room"), st("p", "Another tab of yours took over the room. You are not connected here."));
    const r = st("button", "Use this tab instead");
    r.onclick = () => {
      Ri(), at();
    }, e.push(r);
  } else if (t) {
    e.push(st("h3", "You are in the room")), e.push(st("p", "Others see you at your seat as"), st("p", Ts(b.signed.address), "who")), e.push(st("p", `${b.joined} signed in, ${b.guests} watching.`)), e.push(We("Be seen", "Sit at a table or connect to a machine and your Adrian and name tag appear there for everyone in the room. Stand up or walk away and they go too.")), e.push(We("Spaces", "Each seat and machine holds one person. If someone already has the seat you choose, you are given a free one at the same table.")), e.push(We("Live chat", "Press Chat to talk to the room and scroll back through this session. Tap a name, or Here now, to send someone a direct message, block or report them. Messages are not secret; this session's chat is kept in this tab only and cleared when you leave the room.")), e.push(st("p", "Nothing here moves any money.", "fact"));
    const r = st("button", "Leave the room");
    r.onclick = () => {
      U3();
    }, e.push(r);
  } else {
    e.push(st("h3", "Join the room")), e.push(st("p", b.connected ? b.watch ? `You are watching: ${b.joined} signed in, ${b.guests} watching.` : `${b.joined} ${b.joined === 1 ? "person is" : "people are"} in the room. Sign in to join them.` : "Connecting to the room…")), e.push(We("Be seen", b.watch ? "Join, then sit at a table or connect to a machine. Everyone in the room sees your Adrian there, with a name tag (your BNS name, or a short version of your address). Watching alone shows you to nobody." : "Join, then sit at a table or connect to a machine. Everyone in the room sees your Adrian there, with a name tag (your BNS name, or a short version of your address). Until you join you are invisible, and the room is hidden from you; the casino still plays as normal.")), e.push(We("Spaces", "Each seat and machine holds one person. If someone already has the seat you choose, you are given a free one at the same table.")), e.push(We("Live chat", "Signed-in players can chat with the room and send each other direct messages. Messages are not secret and are not saved.")), e.push(We("Free", "One signature. It sends no transaction, costs no fee and gives no permission to spend anything."));
    const r = st("div", void 0, "row"), s = ir(), o = { leather: "Leather", xverse: "Xverse", casino: s ? s.describe().label : "Casino wallet" };
    for (const i of I3()) {
      const a = st("button", b.busy ? b.busy === "sign" ? "Check your wallet…" : "Connecting…" : o[i]);
      if (a.disabled = !!b.busy || !b.connected, a.onclick = () => {
        $3(i);
      }, i === "casino" && (a.style.flexBasis = "100%"), r.append(a), b.busy) break;
    }
    if (e.push(r), s && !s.describe().has && e.push(st("p", "No wallet? The casino wallet is free: made with Face ID or your fingerprint, with 500 free testnet STX and your first 1,000,000 LAYR.", "fact")), b.error && e.push(st("p", b.error, "err")), !b.busy) {
      const i = st("button", "Not now");
      i.onclick = () => {
        b.open = !1, at();
      }, e.push(i);
    }
  }
  jt.replaceChildren(...e);
}
const P3 = (t) => {
  var n, r;
  const e = t.detail;
  !e || typeof e.spot != "string" || !Array.isArray(e.s) || typeof e.b != "number" || !b.features.includes("play") || b.service !== "ok" || !b.connected || !b.signed || !b.you || b.you.guest || ((n = b.spots[e.spot]) == null ? void 0 : n.a) === b.you.a && ((r = b.ws) == null ? void 0 : r.readyState) === WebSocket.OPEN && b.ws.send(JSON.stringify({ t: "play", spot: e.spot, s: e.s.slice(0, 8), b: e.b, f: !!e.f }));
}, N3 = (t) => {
  const e = t.detail;
  if (e) {
    if (e.off) b.ownMove = null;
    else if ([e.x, e.z, e.r].every((n) => typeof n == "number" && Number.isFinite(n))) b.ownMove = { x: e.x, z: e.z, r: e.r };
    else return;
    P0();
  }
}, D3 = () => {
  var e;
  const t = ((e = b.host) == null ? void 0 : e.currentSpot()) ?? null;
  t !== b.want && (b.want = t, b.yielded = null, b.standSent = null, ms()), N0();
};
async function T3() {
  try {
    const { res: t, body: e } = await Ss("/casino/room/session");
    if (t.status === 503) return;
    t.ok && (e != null && e.address) && (b.signed = { address: e.address, hash160: e.hash160, expiresAt: e.expiresAt }), b.service = "ok";
  } catch {
    return;
  }
  C3(), at(), Mi(), window.setInterval(D3, 250), window.setInterval(L3, 500), window.addEventListener("px-wallet-connected", (t) => {
    _3(t);
  }), window.addEventListener("px-casino-wallet-ready", () => at()), window.addEventListener("px-room-play", P3), window.addEventListener("px-room-move", N3);
}
const ll = (t) => {
  b.host || (b.host = t, T3());
}, fl = window.PXRoomHost;
fl ? ll(fl) : window.addEventListener("px-room-host", () => ll(window.PXRoomHost), { once: !0 });
window.__pxRoom = {
  chat: () => (W == null ? void 0 : W.debug()) ?? null,
  get state() {
    var t;
    return { service: b.service, signed: ((t = b.signed) == null ? void 0 : t.address) ?? null, connected: b.connected, watch: b.watch, prompted: b.prompted, open: b.open, busy: b.busy, error: b.error, you: b.you, spots: b.spots, joined: b.joined, guests: b.guests, want: b.want, features: b.features.slice(), walkers: [...b.walk.keys()], ownMove: b.ownMove, trail: Oe.slice() };
  }
};
