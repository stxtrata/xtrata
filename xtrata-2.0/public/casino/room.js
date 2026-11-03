var cu = Object.defineProperty;
var lu = (t, e, n) => e in t ? cu(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Sn = (t, e, n) => lu(t, typeof e != "symbol" ? e + "" : e, n);
function li(t, e) {
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
      const r = uu(BigInt(`0x${ae(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${ae(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function fi(t, e = 8) {
  return (typeof t == "bigint" ? t : li(t, !1)).toString(16).padStart(e * 2, "0");
}
function Ul(t) {
  return parseInt(t, 16);
}
function Ol(t, e = 16) {
  const n = fi(t, e);
  return In(n);
}
function fu(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function hu(t, e) {
  return t & BigInt(1) << e;
}
function uu(t, e) {
  return hu(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const du = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ae(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += du[n];
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
function yr(t) {
  return new TextEncoder().encode(t);
}
function Cl(t) {
  return new TextDecoder().decode(t);
}
function Pl(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function pu(t) {
  return String.fromCharCode.apply(null, t);
}
function bu(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function pa(t) {
  if (t.some(bu))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function hi(...t) {
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
function Rn(t) {
  return hi(...t.map((e) => typeof e == "number" ? pa([e]) : e instanceof Array ? pa(e) : e));
}
function gu(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function xu(t, e) {
  return t[e];
}
function wu(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Is(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Io;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Io || (Io = {}));
Io.Mainnet;
const yu = 128, mu = 128, Nl = 16;
var fr;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(fr || (fr = {}));
var ba;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ba || (ba = {}));
var ga;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(ga || (ga = {}));
var Nt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Nt || (Nt = {}));
const co = ["onChainOnly", "offChainOnly", "any"];
co[0] + "", Nt.OnChainOnly, co[1] + "", Nt.OffChainOnly, co[2] + "", Nt.Any, Nt.OnChainOnly + "", Nt.OnChainOnly, Nt.OffChainOnly + "", Nt.OffChainOnly, Nt.Any + "", Nt.Any;
var ko;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ko || (ko = {}));
ko.Mainnet;
var xa;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(xa || (xa = {}));
var wa;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(wa || (wa = {}));
var ya;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(ya || (ya = {}));
var ma;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(ma || (ma = {}));
var Uo;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Uo || (Uo = {}));
var Sa;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Sa || (Sa = {}));
var Ea;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ea || (Ea = {}));
var Aa;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Aa || (Aa = {}));
var va;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(va || (va = {}));
var Ba;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ba || (Ba = {}));
var $a;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})($a || ($a = {}));
function Oo(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Su(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Dl(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Eu(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Oo(t.outputLen), Oo(t.blockLen);
}
function Au(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function vu(t, e) {
  Dl(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const lo = {
  number: Oo,
  bool: Su,
  bytes: Dl,
  hash: Eu,
  exists: Au,
  output: vu
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const fo = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Rt = (t, e) => t << 32 - e | t >>> e, Bu = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Bu)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function $u(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Tl(t) {
  if (typeof t == "string" && (t = $u(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let _u = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ln(t) {
  const e = (r) => t().update(Tl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Hu(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + u, a, r);
}
let ui = class extends _u {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = fo(this.buffer);
  }
  update(e) {
    lo.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Tl(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = fo(e);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    lo.exists(this), lo.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let l = i; l < s; l++)
      n[l] = 0;
    Hu(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = fo(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, h[l], o);
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
const Lu = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Fl = Uint8Array.from({ length: 16 }, (t, e) => e), Iu = Fl.map((t) => (9 * t + 5) % 16);
let di = [Fl], pi = [Iu];
for (let t = 0; t < 4; t++)
  for (let e of [di, pi])
    e.push(e[t].map((n) => Lu[n]));
const Ml = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), ku = di.map((t, e) => t.map((n) => Ml[e][n])), Uu = pi.map((t, e) => t.map((n) => Ml[e][n])), Ou = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Cu = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Tr = (t, e) => t << e | t >>> 32 - e;
function _a(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Fr = new Uint32Array(16);
let Pu = class extends ui {
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
    for (let p = 0; p < 16; p++, n += 4)
      Fr[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, l = this.h4 | 0, b = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, w = Ou[p], v = Cu[p], H = di[p], k = pi[p], y = ku[p], $ = Uu[p];
      for (let A = 0; A < 16; A++) {
        const P = Tr(r + _a(p, o, a, u) + Fr[H[A]] + w, y[A]) + l | 0;
        r = l, l = u, u = Tr(a, 10) | 0, a = o, o = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = Tr(s + _a(x, i, c, h) + Fr[k[A]] + v, $[A]) + b | 0;
        s = b, b = h, h = Tr(c, 10) | 0, c = i, i = P;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + b | 0, this.h3 + l + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Fr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
ln(() => new Pu());
const Nu = (t, e, n) => t & e ^ ~t & n, Du = (t, e, n) => t & e ^ t & n ^ e & n, Tu = new Uint32Array([
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
let Rl = class extends ui {
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
      const b = ue[l - 15], p = ue[l - 2], x = Rt(b, 7) ^ Rt(b, 18) ^ b >>> 3, w = Rt(p, 17) ^ Rt(p, 19) ^ p >>> 10;
      ue[l] = w + ue[l - 7] + x + ue[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const b = Rt(a, 6) ^ Rt(a, 11) ^ Rt(a, 25), p = h + b + Nu(a, c, u) + Tu[l] + ue[l] | 0, w = (Rt(r, 2) ^ Rt(r, 13) ^ Rt(r, 22)) + Du(r, s, o) | 0;
      h = u, u = c, c = a, a = i + p | 0, i = o, o = s, s = r, r = p + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    ue.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Fu = class extends Rl {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
ln(() => new Rl());
ln(() => new Fu());
const Mr = BigInt(2 ** 32 - 1), Co = BigInt(32);
function Gl(t, e = !1) {
  return e ? { h: Number(t & Mr), l: Number(t >> Co & Mr) } : { h: Number(t >> Co & Mr) | 0, l: Number(t & Mr) | 0 };
}
function Mu(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = Gl(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const Ru = (t, e) => BigInt(t >>> 0) << Co | BigInt(e >>> 0), Gu = (t, e, n) => t >>> n, Vu = (t, e, n) => t << 32 - n | e >>> n, zu = (t, e, n) => t >>> n | e << 32 - n, Ku = (t, e, n) => t << 32 - n | e >>> n, ju = (t, e, n) => t << 64 - n | e >>> n - 32, qu = (t, e, n) => t >>> n - 32 | e << 64 - n, Wu = (t, e) => e, Xu = (t, e) => t, Yu = (t, e, n) => t << n | e >>> 32 - n, Ju = (t, e, n) => e << n | t >>> 32 - n, Zu = (t, e, n) => e << n - 32 | t >>> 64 - n, Qu = (t, e, n) => t << n - 32 | e >>> 64 - n;
function td(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const ed = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), nd = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, rd = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), sd = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, od = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), id = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, V = {
  fromBig: Gl,
  split: Mu,
  toBig: Ru,
  shrSH: Gu,
  shrSL: Vu,
  rotrSH: zu,
  rotrSL: Ku,
  rotrBH: ju,
  rotrBL: qu,
  rotr32H: Wu,
  rotr32L: Xu,
  rotlSH: Yu,
  rotlSL: Ju,
  rotlBH: Zu,
  rotlBL: Qu,
  add: td,
  add3L: ed,
  add3H: nd,
  add4L: rd,
  add4H: sd,
  add5H: id,
  add5L: od
}, [ad, cd] = V.split([
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
let ks = class extends ui {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: l, Fl: b, Gh: p, Gl: x, Hh: w, Hl: v } = this;
    return [e, n, r, s, o, i, a, c, u, h, l, b, p, x, w, v];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, c, u, h, l, b, p, x, w, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = b | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let y = 0; y < 16; y++, n += 4)
      de[y] = e.getUint32(n), pe[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const $ = de[y - 15] | 0, A = pe[y - 15] | 0, P = V.rotrSH($, A, 1) ^ V.rotrSH($, A, 8) ^ V.shrSH($, A, 7), F = V.rotrSL($, A, 1) ^ V.rotrSL($, A, 8) ^ V.shrSL($, A, 7), U = de[y - 2] | 0, C = pe[y - 2] | 0, g = V.rotrSH(U, C, 19) ^ V.rotrBH(U, C, 61) ^ V.shrSH(U, C, 6), E = V.rotrSL(U, C, 19) ^ V.rotrBL(U, C, 61) ^ V.shrSL(U, C, 6), L = V.add4L(F, E, pe[y - 7], pe[y - 16]), O = V.add4H(L, P, g, de[y - 7], de[y - 16]);
      de[y] = O | 0, pe[y] = L | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: b, Fh: p, Fl: x, Gh: w, Gl: v, Hh: H, Hl: k } = this;
    for (let y = 0; y < 80; y++) {
      const $ = V.rotrSH(l, b, 14) ^ V.rotrSH(l, b, 18) ^ V.rotrBH(l, b, 41), A = V.rotrSL(l, b, 14) ^ V.rotrSL(l, b, 18) ^ V.rotrBL(l, b, 41), P = l & p ^ ~l & w, F = b & x ^ ~b & v, U = V.add5L(k, A, F, cd[y], pe[y]), C = V.add5H(U, H, $, P, ad[y], de[y]), g = U | 0, E = V.rotrSH(r, s, 28) ^ V.rotrBH(r, s, 34) ^ V.rotrBH(r, s, 39), L = V.rotrSL(r, s, 28) ^ V.rotrBL(r, s, 34) ^ V.rotrBL(r, s, 39), O = r & o ^ r & a ^ o & a, M = s & i ^ s & c ^ i & c;
      H = w | 0, k = v | 0, w = p | 0, v = x | 0, p = l | 0, x = b | 0, { h: l, l: b } = V.add(u | 0, h | 0, C | 0, g | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const N = V.add3L(g, L, M);
      r = V.add3H(N, C, E, O), s = N | 0;
    }
    ({ h: r, l: s } = V.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = V.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = V.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = V.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: b } = V.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h: p, l: x } = V.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: w, l: v } = V.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: H, l: k } = V.add(this.Hh | 0, this.Hl | 0, H | 0, k | 0), this.set(r, s, o, i, a, c, u, h, l, b, p, x, w, v, H, k);
  }
  roundClean() {
    de.fill(0), pe.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, ld = class extends ks {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, fd = class extends ks {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, hd = class extends ks {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ln(() => new ks());
ln(() => new ld());
ln(() => new fd());
ln(() => new hd());
const ud = {}, Vl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ud
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Z = BigInt(0), at = BigInt(1), Fe = BigInt(2), ir = BigInt(3), Ha = BigInt(8), rt = Object.freeze({
  a: Z,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: at,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), La = (t, e) => (t + e / Fe) / e, Rr = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = rt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -at * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), o = n, i = BigInt("0x100000000000000000000000000000000"), a = La(o * t, e), c = La(-r * t, e);
    let u = I(t - a * n - c * s, e), h = I(-a * r - c * o, e);
    const l = u > i, b = h > i;
    if (l && (u = e - u), b && (h = e - h), u > i || h > i)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: b, k2: h };
  }
}, Mt = 32, nn = 32, zl = 32, ps = Mt + 1, bs = 2 * Mt + 1;
function Ia(t) {
  const { a: e, b: n } = rt, r = I(t * t), s = I(r * t);
  return I(s + e * t + n);
}
const Gr = rt.a === Z;
class bi extends Error {
  constructor(e) {
    super(e);
  }
}
function ka(t) {
  if (!(t instanceof et))
    throw new TypeError("JacobianPoint expected");
}
class et {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof Q))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(Q.ZERO) ? et.ZERO : new et(e.x, e.y, at);
  }
  static toAffineBatch(e) {
    const n = xd(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return et.toAffineBatch(e).map(et.fromAffine);
  }
  equals(e) {
    ka(e);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = e, c = I(s * s), u = I(a * a), h = I(n * u), l = I(o * c), b = I(I(r * a) * u), p = I(I(i * s) * c);
    return h === l && b === p;
  }
  negate() {
    return new et(this.x, I(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = I(e * e), o = I(n * n), i = I(o * o), a = e + o, c = I(Fe * (I(a * a) - s - i)), u = I(ir * s), h = I(u * u), l = I(h - Fe * c), b = I(u * (c - l) - Ha * i), p = I(Fe * n * r);
    return new et(l, b, p);
  }
  add(e) {
    ka(e);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = e;
    if (o === Z || i === Z)
      return this;
    if (n === Z || r === Z)
      return e;
    const c = I(s * s), u = I(a * a), h = I(n * u), l = I(o * c), b = I(I(r * a) * u), p = I(I(i * s) * c), x = I(l - h), w = I(p - b);
    if (x === Z)
      return w === Z ? this.double() : et.ZERO;
    const v = I(x * x), H = I(x * v), k = I(h * v), y = I(w * w - H - Fe * k), $ = I(w * (k - y) - b * H), A = I(s * a * x);
    return new et(y, $, A);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = et.ZERO;
    if (typeof e == "bigint" && e === Z)
      return n;
    let r = Ca(e);
    if (r === at)
      return this;
    if (!Gr) {
      let l = n, b = this;
      for (; r > Z; )
        r & at && (l = l.add(b)), b = b.double(), r >>= at;
      return l;
    }
    let { k1neg: s, k1: o, k2neg: i, k2: a } = Rr.splitScalar(r), c = n, u = n, h = this;
    for (; o > Z || a > Z; )
      o & at && (c = c.add(h)), a & at && (u = u.add(h)), h = h.double(), o >>= at, a >>= at;
    return s && (c = c.negate()), i && (u = u.negate()), u = new et(I(u.x * Rr.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = Gr ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(et.BASE) && (n = Q.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Po.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = et.normalizeZ(s), Po.set(n, s)));
    let o = et.ZERO, i = et.BASE;
    const a = 1 + (Gr ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), h = 2 ** r, l = BigInt(r);
    for (let b = 0; b < a; b++) {
      const p = b * c;
      let x = Number(e & u);
      e >>= l, x > c && (x -= h, e += at);
      const w = p, v = p + Math.abs(x) - 1, H = b % 2 !== 0, k = x < 0;
      x === 0 ? i = i.add(Vr(H, s[w])) : o = o.add(Vr(k, s[v]));
    }
    return { p: o, f: i };
  }
  multiply(e, n) {
    let r = Ca(e), s, o;
    if (Gr) {
      const { k1neg: i, k1: a, k2neg: c, k2: u } = Rr.splitScalar(r);
      let { p: h, f: l } = this.wNAF(a, n), { p: b, f: p } = this.wNAF(u, n);
      h = Vr(i, h), b = Vr(c, b), b = new et(I(b.x * Rr.beta), b.y, b.z), s = h.add(b), o = l.add(p);
    } else {
      const { p: i, f: a } = this.wNAF(r, n);
      s = i, o = a;
    }
    return et.normalizeZ([s, o])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, o = this.equals(et.ZERO);
    e == null && (e = o ? Ha : Gn(s));
    const i = e, a = I(i * i), c = I(a * i), u = I(n * a), h = I(r * c), l = I(s * i);
    if (o)
      return Q.ZERO;
    if (l !== at)
      throw new Error("invZ was invalid");
    return new Q(u, h);
  }
}
et.BASE = new et(rt.Gx, rt.Gy, at);
et.ZERO = new et(Z, at, Z);
function Vr(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Po = /* @__PURE__ */ new WeakMap();
class Q {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Po.delete(this);
  }
  hasEvenY() {
    return this.y % Fe === Z;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = _t(n ? e : e.subarray(1));
    if (!ls(r))
      throw new Error("Point is not on curve");
    const s = Ia(r);
    let o = gd(s);
    const i = (o & at) === at;
    n ? i && (o = I(-o)) : (e[0] & 1) === 1 !== i && (o = I(-o));
    const a = new Q(r, o);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = _t(e.subarray(1, Mt + 1)), r = _t(e.subarray(Mt + 1, Mt * 2 + 1)), s = new Q(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Yt(e), r = n.length, s = n[0];
    if (r === Mt)
      return this.fromCompressedHex(n);
    if (r === ps && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === bs && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${ps} compressed bytes or ${bs} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Q.BASE.multiply(rn(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: o } = ql(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const i = gi(Yt(e)), { n: a } = rt, c = r === 2 || r === 3 ? s + a : s, u = Gn(c, a), h = I(-i * u, a), l = I(o * u, a), b = r & 1 ? "03" : "02", p = Q.fromHex(b + Me(c)), x = Q.BASE.multiplyAndAddUnsafe(p, h, l);
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
    if (!ls(n) || !ls(r))
      throw new Error(e);
    const s = I(r * r), o = Ia(n);
    if (I(s - o) !== Z)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new Q(this.x, I(-this.y));
  }
  double() {
    return et.fromAffine(this).double().toAffine();
  }
  add(e) {
    return et.fromAffine(this).add(et.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return et.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = et.fromAffine(this), o = n === Z || n === at || this !== Q.BASE ? s.multiplyUnsafe(n) : s.multiply(n), i = et.fromAffine(e).multiplyUnsafe(r), a = o.add(i);
    return a.equals(et.ZERO) ? void 0 : a.toAffine();
  }
}
Q.BASE = new Q(rt.Gx, rt.Gy);
Q.ZERO = new Q(Z, Z);
function Ua(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Oa(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${kn(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: _t(n), left: t.subarray(e + 2) };
}
function dd(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${kn(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Oa(t.subarray(2)), { data: r, left: s } = Oa(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${kn(s)}`);
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
    const s = n ? kn(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new ie(gs(s.slice(0, 64)), gs(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = dd(n ? e : Re(e));
    return new ie(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!On(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!On(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = rt.n >> at;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new ie(this.r, I(-this.s, rt.n)) : this;
  }
  toDERRawBytes() {
    return Re(this.toDERHex());
  }
  toDERHex() {
    const e = Ua(er(this.s)), n = Ua(er(this.r)), r = e.length / 2, s = n.length / 2, o = er(r), i = er(s);
    return `30${er(s + r + 4)}02${i}${n}02${o}${e}`;
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
const pd = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function kn(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += pd[t[n]];
  return e;
}
const bd = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Me(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Z <= t && t < bd))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Un(t) {
  const e = Re(Me(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function er(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function gs(t) {
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
  return gs(kn(t));
}
function Yt(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Re(t);
}
function Ca(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && On(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function I(t, e = rt.P) {
  const n = t % e;
  return n >= Z ? n : e + n;
}
function Lt(t, e) {
  const { P: n } = rt;
  let r = t;
  for (; e-- > Z; )
    r *= r, r %= n;
  return r;
}
function gd(t) {
  const { P: e } = rt, n = BigInt(6), r = BigInt(11), s = BigInt(22), o = BigInt(23), i = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, h = Lt(u, ir) * u % e, l = Lt(h, ir) * u % e, b = Lt(l, Fe) * c % e, p = Lt(b, r) * b % e, x = Lt(p, s) * p % e, w = Lt(x, i) * x % e, v = Lt(w, a) * w % e, H = Lt(v, i) * x % e, k = Lt(H, ir) * u % e, y = Lt(k, o) * p % e, $ = Lt(y, n) * c % e, A = Lt($, Fe);
  if (A * A % e !== t)
    throw new Error("Cannot find square root");
  return A;
}
function Gn(t, e = rt.P) {
  if (t === Z || e <= Z)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = I(t, e), r = e, s = Z, o = at;
  for (; n !== Z; ) {
    const a = r / n, c = r % n, u = s - o * a;
    r = n, n = c, s = o, o = u;
  }
  if (r !== at)
    throw new Error("invert: does not exist");
  return I(s, e);
}
function xd(t, e = rt.P) {
  const n = new Array(t.length), r = t.reduce((o, i, a) => i === Z ? o : (n[a] = o, I(o * i, e)), at), s = Gn(r, e);
  return t.reduceRight((o, i, a) => i === Z ? o : (n[a] = I(o * n[a], e), I(o * i, e)), s), n;
}
function wd(t) {
  const e = t.length * 8 - nn * 8, n = _t(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function gi(t, e = !1) {
  const n = wd(t);
  if (e)
    return n;
  const { n: r } = rt;
  return n >= r ? n - r : n;
}
let Ln, ar;
class Kl {
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
    return ar(this.k, ...e);
  }
  checkSync() {
    if (typeof ar != "function")
      throw new bi("hmacSha256Sync needs to be set");
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
function On(t) {
  return Z < t && t < rt.n;
}
function ls(t) {
  return Z < t && t < rt.P;
}
function jl(t, e, n, r = !0) {
  const { n: s } = rt, o = gi(t, !0);
  if (!On(o))
    return;
  const i = Gn(o, s), a = Q.BASE.multiply(o), c = I(a.x, s);
  if (c === Z)
    return;
  const u = I(i * I(e + n * c, s), s);
  if (u === Z)
    return;
  let h = new ie(c, u), l = (a.x === h.r ? 0 : 2) | Number(a.y & at);
  return r && h.hasHighS() && (h = h.normalizeS(), l ^= 1), { sig: h, recovery: l };
}
function rn(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * nn)
      throw new Error("Expected 32 bytes of private key");
    e = gs(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== nn)
      throw new Error("Expected 32 bytes of private key");
    e = _t(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!On(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function xi(t) {
  return t instanceof Q ? (t.assertValidity(), t) : Q.fromHex(t);
}
function ql(t) {
  if (t instanceof ie)
    return t.assertValidity(), t;
  try {
    return ie.fromDER(t);
  } catch {
    return ie.fromCompact(t);
  }
}
function wi(t, e = !1) {
  return Q.fromPrivateKey(t).toRawBytes(e);
}
function yd(t, e, n, r = !1) {
  return Q.fromSignature(t, e, n).toRawBytes(r);
}
function Pa(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === ps || r === bs : n ? r === ps * 2 || r === bs * 2 : t instanceof Q;
}
function yi(t, e, n = !1) {
  if (Pa(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Pa(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = xi(e);
  return r.assertValidity(), r.multiply(rn(t)).toRawBytes(n);
}
function Wl(t) {
  const e = t.length > Mt ? t.slice(0, Mt) : t;
  return _t(e);
}
function md(t) {
  const e = Wl(t), n = I(e, rt.n);
  return Xl(n < Z ? e : n);
}
function Xl(t) {
  return Un(t);
}
function Yl(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Yt(t), s = rn(e), o = [Xl(s), md(r)];
  if (n != null) {
    n === !0 && (n = ct.randomBytes(Mt));
    const c = Yt(n);
    if (c.length !== Mt)
      throw new Error(`sign: Expected ${Mt} bytes of extra data`);
    o.push(c);
  }
  const i = De(...o), a = Wl(r);
  return { seed: i, m: a, d: s };
}
function Jl(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: o } = Object.assign({ canonical: !0, der: !0 }, e), i = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return o ? [i, r] : i;
}
async function Sd(t, e, n = {}) {
  const { seed: r, m: s, d: o } = Yl(t, e, n.extraEntropy), i = new Kl(zl, nn);
  await i.reseed(r);
  let a;
  for (; !(a = jl(await i.generate(), s, o, n.canonical)); )
    await i.reseed();
  return Jl(a, n);
}
function Zl(t, e, n = {}) {
  const { seed: r, m: s, d: o } = Yl(t, e, n.extraEntropy), i = new Kl(zl, nn);
  i.reseedSync(r);
  let a;
  for (; !(a = jl(i.generateSync(), s, o, n.canonical)); )
    i.reseedSync();
  return Jl(a, n);
}
const Ed = { strict: !0 };
function Ad(t, e, n, r = Ed) {
  let s;
  try {
    s = ql(t), e = Yt(e);
  } catch {
    return !1;
  }
  const { r: o, s: i } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = gi(e);
  let c;
  try {
    c = xi(n);
  } catch {
    return !1;
  }
  const { n: u } = rt, h = Gn(i, u), l = I(a * h, u), b = I(o * h, u), p = Q.BASE.multiplyAndAddUnsafe(c, l, b);
  return p ? I(p.x, u) === o : !1;
}
function xs(t) {
  return I(_t(t), rt.n);
}
class Cn {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Yt(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = _t(n.subarray(0, 32)), s = _t(n.subarray(32, 64));
    return new Cn(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!ls(e) || !On(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Me(this.r) + Me(this.s);
  }
  toRawBytes() {
    return Re(this.toHex());
  }
}
function vd(t) {
  return Q.fromPrivateKey(t).toRawX();
}
class Ql {
  constructor(e, n, r = ct.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Yt(e);
    const { x: s, scalar: o } = this.getScalar(rn(n));
    if (this.px = s, this.d = o, this.rand = Yt(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = Q.fromPrivateKey(e), r = n.hasEvenY() ? e : rt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Un(e ^ _t(n));
  }
  finalizeNonce(e) {
    const n = I(_t(e), rt.n);
    if (n === Z)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: o } = this.getScalar(n);
    return { R: r, rx: s, k: o };
  }
  finalizeSig(e, n, r, s) {
    return new Cn(e.x, I(n + r * s, rt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, o = ct.taggedHash, i = this.initNonce(n, await o(Ne.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await o(Ne.nonce, i, r, e)), h = xs(await o(Ne.challenge, c, r, e)), l = this.finalizeSig(a, u, h, n);
    return await nf(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, o = ct.taggedHashSync, i = this.initNonce(n, o(Ne.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(o(Ne.nonce, i, r, e)), h = xs(o(Ne.challenge, c, r, e)), l = this.finalizeSig(a, u, h, n);
    return rf(l, e, r) || this.error(), l;
  }
}
async function Bd(t, e, n) {
  return new Ql(t, e, n).calc();
}
function $d(t, e, n) {
  return new Ql(t, e, n).calcSync();
}
function tf(t, e, n) {
  const r = t instanceof Cn, s = r ? t : Cn.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Yt(e),
    P: xi(n)
  };
}
function ef(t, e, n, r) {
  const s = Q.BASE.multiplyAndAddUnsafe(e, rn(n), I(-r, rt.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function nf(t, e, n) {
  try {
    const { r, s, m: o, P: i } = tf(t, e, n), a = xs(await ct.taggedHash(Ne.challenge, Un(r), i.toRawX(), o));
    return ef(r, i, s, a);
  } catch {
    return !1;
  }
}
function rf(t, e, n) {
  try {
    const { r, s, m: o, P: i } = tf(t, e, n), a = xs(ct.taggedHashSync(Ne.challenge, Un(r), i.toRawX(), o));
    return ef(r, i, s, a);
  } catch (r) {
    if (r instanceof bi)
      throw r;
    return !1;
  }
}
const _d = {
  Signature: Cn,
  getPublicKey: vd,
  sign: Bd,
  verify: nf,
  signSync: $d,
  verifySync: rf
};
Q.BASE._setWindowSize(8);
const vt = {
  node: Vl,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Ne = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, zr = {}, ct = {
  bytesToHex: kn,
  hexToBytes: Re,
  concatBytes: De,
  mod: I,
  invert: Gn,
  isValidPrivateKey(t) {
    try {
      return rn(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Un,
  _normalizePrivateKey: rn,
  hashToPrivateKey: (t) => {
    t = Yt(t);
    const e = nn + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = I(_t(t), rt.n - at) + at;
    return Un(n);
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
  randomPrivateKey: () => ct.hashToPrivateKey(ct.randomBytes(nn + 8)),
  precompute(t = 8, e = Q.BASE) {
    const n = e === Q.BASE ? e : new Q(e.x, e.y);
    return n._setWindowSize(t), n.multiply(ir), n;
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
    let n = zr[t];
    if (n === void 0) {
      const r = await ct.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = De(r, r), zr[t] = n;
    }
    return ct.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Ln != "function")
      throw new bi("sha256Sync is undefined, you need to set it");
    let n = zr[t];
    if (n === void 0) {
      const r = Ln(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = De(r, r), zr[t] = n;
    }
    return Ln(n, ...e);
  },
  _JacobianPoint: et
};
Object.defineProperties(ct, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Ln;
    },
    set(t) {
      Ln || (Ln = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return ar;
    },
    set(t) {
      ar || (ar = t);
    }
  }
});
const Hd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: rt,
  Point: Q,
  Signature: ie,
  getPublicKey: wi,
  getSharedSecret: yi,
  recoverPublicKey: yd,
  schnorr: _d,
  sign: Sd,
  signSync: Zl,
  utils: ct,
  verify: Ad
}, Symbol.toStringTag, { value: "Module" }));
var gt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ld(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function mr(t) {
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
var Vn = {}, mi = {};
const En = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function sf(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function No(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Ve(t, ...e) {
  if (!sf(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function of(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  No(t.outputLen), No(t.blockLen);
}
function hr(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function af(t, e) {
  Ve(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function Id(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function kd(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function ur(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function fs(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Pt(t, e) {
  return t << 32 - e | t >>> e;
}
function Ud(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Si = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Ei(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const cf = Si ? (t) => t : (t) => Ei(t), Od = cf;
function lf(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Ei(t[e]);
  return t;
}
const Cd = Si ? (t) => t : lf, ff = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", Pd = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Nd(t) {
  if (Ve(t), ff)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Pd[t[n]];
  return e;
}
const ne = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Na(t) {
  if (t >= ne._0 && t <= ne._9)
    return t - ne._0;
  if (t >= ne.A && t <= ne.F)
    return t - (ne.A - 10);
  if (t >= ne.a && t <= ne.f)
    return t - (ne.a - 10);
}
function Dd(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (ff)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, o = 0; s < n; s++, o += 2) {
    const i = Na(t.charCodeAt(o)), a = Na(t.charCodeAt(o + 1));
    if (i === void 0 || a === void 0) {
      const c = t[o] + t[o + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + o);
    }
    r[s] = i * 16 + a;
  }
  return r;
}
const hf = async () => {
};
async function Td(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const o = Date.now() - r;
    o >= 0 && o < e || (await hf(), r += o);
  }
}
function Ai(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function Fd(t) {
  return new TextDecoder().decode(t);
}
function zn(t) {
  return typeof t == "string" && (t = Ai(t)), Ve(t), t;
}
function Md(t) {
  return typeof t == "string" && (t = Ai(t)), Ve(t), t;
}
function Rd(...t) {
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
function Gd(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let vi = class {
};
function Us(t) {
  const e = (r) => t().update(zn(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function uf(t) {
  const e = (r, s) => t(s).update(zn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function df(t) {
  const e = (r, s) => t(s).update(zn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const Vd = Us, zd = uf, Kd = df;
function jd(t = 32) {
  if (En && typeof En.getRandomValues == "function")
    return En.getRandomValues(new Uint8Array(t));
  if (En && typeof En.randomBytes == "function")
    return Uint8Array.from(En.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const qd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: vi,
  abytes: Ve,
  aexists: hr,
  ahash: of,
  anumber: No,
  aoutput: af,
  asyncLoop: Td,
  byteSwap: Ei,
  byteSwap32: lf,
  byteSwapIfBE: Od,
  bytesToHex: Nd,
  bytesToUtf8: Fd,
  checkOpts: Gd,
  clean: ur,
  concatBytes: Rd,
  createHasher: Us,
  createOptHasher: uf,
  createView: fs,
  createXOFer: df,
  hexToBytes: Dd,
  isBytes: sf,
  isLE: Si,
  kdfInputToBytes: Md,
  nextTick: hf,
  randomBytes: jd,
  rotl: Ud,
  rotr: Pt,
  swap32IfBE: Cd,
  swap8IfBE: cf,
  toBytes: zn,
  u32: kd,
  u8: Id,
  utf8ToBytes: Ai,
  wrapConstructor: Vd,
  wrapConstructorWithOpts: zd,
  wrapXOFConstructorWithOpts: Kd
}, Symbol.toStringTag, { value: "Module" })), Sr = /* @__PURE__ */ mr(qd);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = Sr;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(i, a) {
    if (!i.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    i.length % 2 !== 0 && (i = `0${i}`), i = i.toLowerCase();
    let c = [], u = 0;
    for (let p = i.length - 1; p >= 0; p--)
      if (u < 4) {
        const x = n.indexOf(i[p]) >> u;
        let w = 0;
        p !== 0 && (w = n.indexOf(i[p - 1]));
        const v = 1 + u, H = w % (1 << v) << 5 - v, k = t.c32[x + H];
        u = v, c.unshift(k);
      } else
        u = 0;
    let h = 0;
    for (let p = 0; p < c.length && c[p] === "0"; p++)
      h++;
    c = c.slice(h);
    const l = new TextDecoder().decode((0, e.hexToBytes)(i)).match(/^\u0000*/), b = l ? l[0].length : 0;
    for (let p = 0; p < b; p++)
      c.unshift(t.c32[0]);
    if (a) {
      const p = a - c.length;
      for (let x = 0; x < p; x++)
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
    const c = i.match(`^${t.c32[0]}*`), u = c ? c[0].length : 0;
    let h = [], l = 0, b = 0;
    for (let w = i.length - 1; w >= 0; w--) {
      b === 4 && (h.unshift(n[l]), b = 0, l = 0);
      const H = (t.c32.indexOf(i[w]) << b) + l, k = n[H % 16];
      if (b += 1, l = H >> 4, l > 1 << b)
        throw new Error("Panic error in decoding.");
      h.unshift(k);
    }
    h.unshift(n[l]), h.length % 2 === 1 && h.unshift("0");
    let p = 0;
    for (let w = 0; w < h.length && h[w] === "0"; w++)
      p++;
    h = h.slice(p - p % 2);
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
})(mi);
var sn = {};
function Wd(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + u, a, r);
}
function Xd(t, e, n) {
  return t & e ^ ~t & n;
}
function Yd(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class Jd extends vi {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = fs(this.buffer);
  }
  update(e) {
    hr(this), e = zn(e), Ve(e);
    const { view: n, buffer: r, blockLen: s } = this, o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = fs(e);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    hr(this), af(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, ur(this.buffer.subarray(i)), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let l = i; l < s; l++)
      n[l] = 0;
    Wd(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = fs(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, h[l], o);
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
]), xe = /* @__PURE__ */ new Uint32Array(64);
let Bi = class extends Jd {
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
      const b = xe[l - 15], p = xe[l - 2], x = Pt(b, 7) ^ Pt(b, 18) ^ b >>> 3, w = Pt(p, 17) ^ Pt(p, 19) ^ p >>> 10;
      xe[l] = w + xe[l - 7] + x + xe[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const b = Pt(a, 6) ^ Pt(a, 11) ^ Pt(a, 25), p = h + b + Xd(a, c, u) + Zd[l] + xe[l] | 0, w = (Pt(r, 2) ^ Pt(r, 13) ^ Pt(r, 22)) + Yd(r, s, o) | 0;
      h = u, u = c, c = a, a = i + p | 0, i = o, o = s, s = r, r = p + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    ur(xe);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), ur(this.buffer);
  }
}, pf = class extends Bi {
  constructor() {
    super(28), this.A = ge[0] | 0, this.B = ge[1] | 0, this.C = ge[2] | 0, this.D = ge[3] | 0, this.E = ge[4] | 0, this.F = ge[5] | 0, this.G = ge[6] | 0, this.H = ge[7] | 0;
  }
};
const Qd = /* @__PURE__ */ Us(() => new Bi()), tp = /* @__PURE__ */ Us(() => new pf()), ep = Bi, np = Qd, rp = pf, sp = tp, op = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: rp,
  SHA256: ep,
  sha224: sp,
  sha256: np
}, Symbol.toStringTag, { value: "Module" })), Os = /* @__PURE__ */ mr(op);
Object.defineProperty(sn, "__esModule", { value: !0 });
sn.c32checkDecode = sn.c32checkEncode = void 0;
const Da = Os, Ta = Sr, cr = mi;
function bf(t) {
  const e = (0, Da.sha256)((0, Da.sha256)((0, Ta.hexToBytes)(t)));
  return (0, Ta.bytesToHex)(e.slice(0, 4));
}
function ip(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = bf(`${n}${e}`), s = (0, cr.c32encode)(`${e}${r}`);
  return `${cr.c32[t]}${s}`;
}
sn.c32checkEncode = ip;
function ap(t) {
  t = (0, cr.c32normalize)(t);
  const e = (0, cr.c32decode)(t.slice(1)), n = t[0], r = cr.c32.indexOf(n), s = e.slice(-8);
  let o = r.toString(16);
  if (o.length === 1 && (o = `0${o}`), bf(`${o}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
sn.c32checkDecode = ap;
var gf = {}, Pn = {};
function cp(t) {
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
  var i = t.length, a = t.charAt(0), c = Math.log(i) / Math.log(256), u = Math.log(256) / Math.log(i);
  function h(p) {
    if (p instanceof Uint8Array || (ArrayBuffer.isView(p) ? p = new Uint8Array(p.buffer, p.byteOffset, p.byteLength) : Array.isArray(p) && (p = Uint8Array.from(p))), !(p instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (p.length === 0)
      return "";
    for (var x = 0, w = 0, v = 0, H = p.length; v !== H && p[v] === 0; )
      v++, x++;
    for (var k = (H - v) * u + 1 >>> 0, y = new Uint8Array(k); v !== H; ) {
      for (var $ = p[v], A = 0, P = k - 1; ($ !== 0 || A < w) && P !== -1; P--, A++)
        $ += 256 * y[P] >>> 0, y[P] = $ % i >>> 0, $ = $ / i >>> 0;
      if ($ !== 0)
        throw new Error("Non-zero carry");
      w = A, v++;
    }
    for (var F = k - w; F !== k && y[F] === 0; )
      F++;
    for (var U = a.repeat(x); F < k; ++F)
      U += t.charAt(y[F]);
    return U;
  }
  function l(p) {
    if (typeof p != "string")
      throw new TypeError("Expected String");
    if (p.length === 0)
      return new Uint8Array();
    for (var x = 0, w = 0, v = 0; p[x] === a; )
      w++, x++;
    for (var H = (p.length - x) * c + 1 >>> 0, k = new Uint8Array(H); p[x]; ) {
      var y = p.charCodeAt(x);
      if (y > 255)
        return;
      var $ = e[y];
      if ($ === 255)
        return;
      for (var A = 0, P = H - 1; ($ !== 0 || A < v) && P !== -1; P--, A++)
        $ += i * k[P] >>> 0, k[P] = $ % 256 >>> 0, $ = $ / 256 >>> 0;
      if ($ !== 0)
        throw new Error("Non-zero carry");
      v = A, x++;
    }
    for (var F = H - v; F !== H && k[F] === 0; )
      F++;
    for (var U = new Uint8Array(w + (H - F)), C = w; F !== H; )
      U[C++] = k[F++];
    return U;
  }
  function b(p) {
    var x = l(p);
    if (x)
      return x;
    throw new Error("Non-base" + i + " character");
  }
  return {
    encode: h,
    decodeUnsafe: l,
    decode: b
  };
}
var xf = cp;
Object.defineProperty(Pn, "__esModule", { value: !0 });
Pn.decode = Pn.encode = void 0;
const ws = Os, Fa = Sr, wf = xf, yf = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function lp(t, e = "00") {
  const n = typeof t == "string" ? (0, Fa.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Fa.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, ws.sha256)((0, ws.sha256)(new Uint8Array([...r, ...n])));
  return wf(yf).encode([...r, ...n, ...s.slice(0, 4)]);
}
Pn.encode = lp;
function fp(t) {
  const e = wf(yf).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, ws.sha256)((0, ws.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((o, i) => {
    if (o !== s[i])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Pn.decode = fp;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = sn, n = Pn, r = Sr;
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
  function i(h, l) {
    if (!l.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, e.c32checkEncode)(h, l)}`;
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
  function c(h, l = -1) {
    const b = n.decode(h), p = (0, r.bytesToHex)(b.data), x = parseInt((0, r.bytesToHex)(b.prefix), 16);
    let w;
    return l < 0 ? (w = x, s[x] !== void 0 && (w = s[x])) : w = l, i(w, p);
  }
  t.b58ToC32 = c;
  function u(h, l = -1) {
    const b = a(h), p = b[0], x = b[1];
    let w;
    l < 0 ? (w = p, o[p] !== void 0 && (w = o[p])) : w = l;
    let v = w.toString(16);
    return v.length === 1 && (v = `0${v}`), n.encode(x, v);
  }
  t.c32ToB58 = u;
})(gf);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = mi;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = sn;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = gf;
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
})(Vn);
var ys = { exports: {} };
ys.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, o = "[object Arguments]", i = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", h = "[object Function]", l = "[object GeneratorFunction]", b = "[object Map]", p = "[object Number]", x = "[object Object]", w = "[object Promise]", v = "[object RegExp]", H = "[object Set]", k = "[object String]", y = "[object Symbol]", $ = "[object WeakMap]", A = "[object ArrayBuffer]", P = "[object DataView]", F = "[object Float32Array]", U = "[object Float64Array]", C = "[object Int8Array]", g = "[object Int16Array]", E = "[object Int32Array]", L = "[object Uint8Array]", O = "[object Uint8ClampedArray]", M = "[object Uint16Array]", N = "[object Uint32Array]", ht = /[\\^$.*+?()[\]{}|]/g, nt = /\w*$/, ze = /^\[object .+?Constructor\]$/, ot = /^(?:0|[1-9]\d*)$/, G = {};
  G[o] = G[i] = G[A] = G[P] = G[a] = G[c] = G[F] = G[U] = G[C] = G[g] = G[E] = G[b] = G[p] = G[x] = G[v] = G[H] = G[k] = G[y] = G[L] = G[O] = G[M] = G[N] = !0, G[u] = G[h] = G[$] = !1;
  var $r = typeof gt == "object" && gt && gt.Object === Object && gt, Wn = typeof self == "object" && self && self.Object === Object && self, wt = $r || Wn || Function("return this")(), Ke = e && !e.nodeType && e, St = Ke && !0 && t && !t.nodeType && t, Ht = St && St.exports === Ke;
  function Ws(d, S) {
    return d.set(S[0], S[1]), d;
  }
  function Xs(d, S) {
    return d.add(S), d;
  }
  function bn(d, S) {
    for (var B = -1, D = d ? d.length : 0; ++B < D && S(d[B], B, d) !== !1; )
      ;
    return d;
  }
  function Ys(d, S) {
    for (var B = -1, D = S.length, dt = d.length; ++B < D; )
      d[dt + B] = S[B];
    return d;
  }
  function _r(d, S, B, D) {
    for (var dt = -1, yt = d ? d.length : 0; ++dt < yt; )
      B = S(B, d[dt], dt, d);
    return B;
  }
  function Hr(d, S) {
    for (var B = -1, D = Array(d); ++B < d; )
      D[B] = S(B);
    return D;
  }
  function Js(d, S) {
    return d == null ? void 0 : d[S];
  }
  function Xn(d) {
    var S = !1;
    if (d != null && typeof d.toString != "function")
      try {
        S = !!(d + "");
      } catch {
      }
    return S;
  }
  function gn(d) {
    var S = -1, B = Array(d.size);
    return d.forEach(function(D, dt) {
      B[++S] = [dt, D];
    }), B;
  }
  function Yn(d, S) {
    return function(B) {
      return d(S(B));
    };
  }
  function Jn(d) {
    var S = -1, B = Array(d.size);
    return d.forEach(function(D) {
      B[++S] = D;
    }), B;
  }
  var Zs = Array.prototype, Qs = Function.prototype, tt = Object.prototype, je = wt["__core-js_shared__"], pt = function() {
    var d = /[^.]+$/.exec(je && je.keys && je.keys.IE_PROTO || "");
    return d ? "Symbol(src)_1." + d : "";
  }(), Zn = Qs.toString, Ut = tt.hasOwnProperty, qe = tt.toString, to = RegExp(
    "^" + Zn.call(Ut).replace(ht, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), We = Ht ? wt.Buffer : void 0, Qn = wt.Symbol, tr = wt.Uint8Array, eo = Yn(Object.getPrototypeOf, Object), Lr = Object.create, Ir = tt.propertyIsEnumerable, kr = Zs.splice, Ur = Object.getOwnPropertySymbols, Or = We ? We.isBuffer : void 0, no = Yn(Object.keys, Object), m = yn(wt, "DataView"), T = yn(wt, "Map"), J = yn(wt, "Promise"), Y = yn(wt, "Set"), it = yn(wt, "WeakMap"), ut = yn(Object, "create"), Et = Je(m), At = Je(T), fe = Je(J), Ot = Je(Y), ta = Je(it), ea = Qn ? Qn.prototype : void 0, na = ea ? ea.valueOf : void 0;
  function Xe(d) {
    var S = -1, B = d ? d.length : 0;
    for (this.clear(); ++S < B; ) {
      var D = d[S];
      this.set(D[0], D[1]);
    }
  }
  function h0() {
    this.__data__ = ut ? ut(null) : {};
  }
  function u0(d) {
    return this.has(d) && delete this.__data__[d];
  }
  function d0(d) {
    var S = this.__data__;
    if (ut) {
      var B = S[d];
      return B === r ? void 0 : B;
    }
    return Ut.call(S, d) ? S[d] : void 0;
  }
  function p0(d) {
    var S = this.__data__;
    return ut ? S[d] !== void 0 : Ut.call(S, d);
  }
  function b0(d, S) {
    var B = this.__data__;
    return B[d] = ut && S === void 0 ? r : S, this;
  }
  Xe.prototype.clear = h0, Xe.prototype.delete = u0, Xe.prototype.get = d0, Xe.prototype.has = p0, Xe.prototype.set = b0;
  function te(d) {
    var S = -1, B = d ? d.length : 0;
    for (this.clear(); ++S < B; ) {
      var D = d[S];
      this.set(D[0], D[1]);
    }
  }
  function g0() {
    this.__data__ = [];
  }
  function x0(d) {
    var S = this.__data__, B = Cr(S, d);
    if (B < 0)
      return !1;
    var D = S.length - 1;
    return B == D ? S.pop() : kr.call(S, B, 1), !0;
  }
  function w0(d) {
    var S = this.__data__, B = Cr(S, d);
    return B < 0 ? void 0 : S[B][1];
  }
  function y0(d) {
    return Cr(this.__data__, d) > -1;
  }
  function m0(d, S) {
    var B = this.__data__, D = Cr(B, d);
    return D < 0 ? B.push([d, S]) : B[D][1] = S, this;
  }
  te.prototype.clear = g0, te.prototype.delete = x0, te.prototype.get = w0, te.prototype.has = y0, te.prototype.set = m0;
  function xn(d) {
    var S = -1, B = d ? d.length : 0;
    for (this.clear(); ++S < B; ) {
      var D = d[S];
      this.set(D[0], D[1]);
    }
  }
  function S0() {
    this.__data__ = {
      hash: new Xe(),
      map: new (T || te)(),
      string: new Xe()
    };
  }
  function E0(d) {
    return Pr(this, d).delete(d);
  }
  function A0(d) {
    return Pr(this, d).get(d);
  }
  function v0(d) {
    return Pr(this, d).has(d);
  }
  function B0(d, S) {
    return Pr(this, d).set(d, S), this;
  }
  xn.prototype.clear = S0, xn.prototype.delete = E0, xn.prototype.get = A0, xn.prototype.has = v0, xn.prototype.set = B0;
  function wn(d) {
    this.__data__ = new te(d);
  }
  function $0() {
    this.__data__ = new te();
  }
  function _0(d) {
    return this.__data__.delete(d);
  }
  function H0(d) {
    return this.__data__.get(d);
  }
  function L0(d) {
    return this.__data__.has(d);
  }
  function I0(d, S) {
    var B = this.__data__;
    if (B instanceof te) {
      var D = B.__data__;
      if (!T || D.length < n - 1)
        return D.push([d, S]), this;
      B = this.__data__ = new xn(D);
    }
    return B.set(d, S), this;
  }
  wn.prototype.clear = $0, wn.prototype.delete = _0, wn.prototype.get = H0, wn.prototype.has = L0, wn.prototype.set = I0;
  function k0(d, S) {
    var B = oo(d) || eu(d) ? Hr(d.length, String) : [], D = B.length, dt = !!D;
    for (var yt in d)
      Ut.call(d, yt) && !(dt && (yt == "length" || J0(yt, D))) && B.push(yt);
    return B;
  }
  function ra(d, S, B) {
    var D = d[S];
    (!(Ut.call(d, S) && aa(D, B)) || B === void 0 && !(S in d)) && (d[S] = B);
  }
  function Cr(d, S) {
    for (var B = d.length; B--; )
      if (aa(d[B][0], S))
        return B;
    return -1;
  }
  function U0(d, S) {
    return d && sa(S, io(S), d);
  }
  function ro(d, S, B, D, dt, yt, ee) {
    var mt;
    if (D && (mt = yt ? D(d, dt, yt, ee) : D(d)), mt !== void 0)
      return mt;
    if (!Nr(d))
      return d;
    var fa = oo(d);
    if (fa) {
      if (mt = W0(d), !S)
        return K0(d, mt);
    } else {
      var mn = Ye(d), ha = mn == h || mn == l;
      if (ru(d))
        return T0(d, S);
      if (mn == x || mn == o || ha && !yt) {
        if (Xn(d))
          return yt ? d : {};
        if (mt = X0(ha ? {} : d), !S)
          return j0(d, U0(mt, d));
      } else {
        if (!G[mn])
          return yt ? d : {};
        mt = Y0(d, mn, ro, S);
      }
    }
    ee || (ee = new wn());
    var ua = ee.get(d);
    if (ua)
      return ua;
    if (ee.set(d, mt), !fa)
      var da = B ? q0(d) : io(d);
    return bn(da || d, function(ao, Dr) {
      da && (Dr = ao, ao = d[Dr]), ra(mt, Dr, ro(ao, S, B, D, Dr, d, ee));
    }), mt;
  }
  function O0(d) {
    return Nr(d) ? Lr(d) : {};
  }
  function C0(d, S, B) {
    var D = S(d);
    return oo(d) ? D : Ys(D, B(d));
  }
  function P0(d) {
    return qe.call(d);
  }
  function N0(d) {
    if (!Nr(d) || Q0(d))
      return !1;
    var S = la(d) || Xn(d) ? to : ze;
    return S.test(Je(d));
  }
  function D0(d) {
    if (!ia(d))
      return no(d);
    var S = [];
    for (var B in Object(d))
      Ut.call(d, B) && B != "constructor" && S.push(B);
    return S;
  }
  function T0(d, S) {
    if (S)
      return d.slice();
    var B = new d.constructor(d.length);
    return d.copy(B), B;
  }
  function so(d) {
    var S = new d.constructor(d.byteLength);
    return new tr(S).set(new tr(d)), S;
  }
  function F0(d, S) {
    var B = S ? so(d.buffer) : d.buffer;
    return new d.constructor(B, d.byteOffset, d.byteLength);
  }
  function M0(d, S, B) {
    var D = S ? B(gn(d), !0) : gn(d);
    return _r(D, Ws, new d.constructor());
  }
  function R0(d) {
    var S = new d.constructor(d.source, nt.exec(d));
    return S.lastIndex = d.lastIndex, S;
  }
  function G0(d, S, B) {
    var D = S ? B(Jn(d), !0) : Jn(d);
    return _r(D, Xs, new d.constructor());
  }
  function V0(d) {
    return na ? Object(na.call(d)) : {};
  }
  function z0(d, S) {
    var B = S ? so(d.buffer) : d.buffer;
    return new d.constructor(B, d.byteOffset, d.length);
  }
  function K0(d, S) {
    var B = -1, D = d.length;
    for (S || (S = Array(D)); ++B < D; )
      S[B] = d[B];
    return S;
  }
  function sa(d, S, B, D) {
    B || (B = {});
    for (var dt = -1, yt = S.length; ++dt < yt; ) {
      var ee = S[dt], mt = void 0;
      ra(B, ee, mt === void 0 ? d[ee] : mt);
    }
    return B;
  }
  function j0(d, S) {
    return sa(d, oa(d), S);
  }
  function q0(d) {
    return C0(d, io, oa);
  }
  function Pr(d, S) {
    var B = d.__data__;
    return Z0(S) ? B[typeof S == "string" ? "string" : "hash"] : B.map;
  }
  function yn(d, S) {
    var B = Js(d, S);
    return N0(B) ? B : void 0;
  }
  var oa = Ur ? Yn(Ur, Object) : iu, Ye = P0;
  (m && Ye(new m(new ArrayBuffer(1))) != P || T && Ye(new T()) != b || J && Ye(J.resolve()) != w || Y && Ye(new Y()) != H || it && Ye(new it()) != $) && (Ye = function(d) {
    var S = qe.call(d), B = S == x ? d.constructor : void 0, D = B ? Je(B) : void 0;
    if (D)
      switch (D) {
        case Et:
          return P;
        case At:
          return b;
        case fe:
          return w;
        case Ot:
          return H;
        case ta:
          return $;
      }
    return S;
  });
  function W0(d) {
    var S = d.length, B = d.constructor(S);
    return S && typeof d[0] == "string" && Ut.call(d, "index") && (B.index = d.index, B.input = d.input), B;
  }
  function X0(d) {
    return typeof d.constructor == "function" && !ia(d) ? O0(eo(d)) : {};
  }
  function Y0(d, S, B, D) {
    var dt = d.constructor;
    switch (S) {
      case A:
        return so(d);
      case a:
      case c:
        return new dt(+d);
      case P:
        return F0(d, D);
      case F:
      case U:
      case C:
      case g:
      case E:
      case L:
      case O:
      case M:
      case N:
        return z0(d, D);
      case b:
        return M0(d, D, B);
      case p:
      case k:
        return new dt(d);
      case v:
        return R0(d);
      case H:
        return G0(d, D, B);
      case y:
        return V0(d);
    }
  }
  function J0(d, S) {
    return S = S ?? s, !!S && (typeof d == "number" || ot.test(d)) && d > -1 && d % 1 == 0 && d < S;
  }
  function Z0(d) {
    var S = typeof d;
    return S == "string" || S == "number" || S == "symbol" || S == "boolean" ? d !== "__proto__" : d === null;
  }
  function Q0(d) {
    return !!pt && pt in d;
  }
  function ia(d) {
    var S = d && d.constructor, B = typeof S == "function" && S.prototype || tt;
    return d === B;
  }
  function Je(d) {
    if (d != null) {
      try {
        return Zn.call(d);
      } catch {
      }
      try {
        return d + "";
      } catch {
      }
    }
    return "";
  }
  function tu(d) {
    return ro(d, !0, !0);
  }
  function aa(d, S) {
    return d === S || d !== d && S !== S;
  }
  function eu(d) {
    return nu(d) && Ut.call(d, "callee") && (!Ir.call(d, "callee") || qe.call(d) == o);
  }
  var oo = Array.isArray;
  function ca(d) {
    return d != null && su(d.length) && !la(d);
  }
  function nu(d) {
    return ou(d) && ca(d);
  }
  var ru = Or || au;
  function la(d) {
    var S = Nr(d) ? qe.call(d) : "";
    return S == h || S == l;
  }
  function su(d) {
    return typeof d == "number" && d > -1 && d % 1 == 0 && d <= s;
  }
  function Nr(d) {
    var S = typeof d;
    return !!d && (S == "object" || S == "function");
  }
  function ou(d) {
    return !!d && typeof d == "object";
  }
  function io(d) {
    return ca(d) ? k0(d) : D0(d);
  }
  function iu() {
    return [];
  }
  function au() {
    return !1;
  }
  t.exports = tu;
})(ys, ys.exports);
ys.exports;
function Do(t) {
  return Vn.c32address(t.version, t.hash160);
}
function $i(t, e, n) {
  const r = e || 1, s = n || yu;
  if (Rp(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: fr.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function _i(t) {
  const e = Vn.c32addressDecode(t);
  return {
    type: fr.Address,
    version: e[0],
    hash160: e[1]
  };
}
var _;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(_ || (_ = {}));
function hp(t) {
  if (t.type === _.PrincipalStandard)
    return Do(t.address);
  if (t.type === _.PrincipalContract)
    return `${Do(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function up(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return bp(e, n);
  } else
    return dp(t);
}
function dp(t) {
  const e = _i(t);
  return { type: _.PrincipalStandard, address: e };
}
function pp(t) {
  return { type: _.PrincipalStandard, address: t };
}
function bp(t, e) {
  const n = _i(t), r = $i(e);
  return mf(n, r);
}
function mf(t, e) {
  if (yr(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: _.PrincipalContract, address: t, contractName: e };
}
function ho(t, e = !1) {
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
      return Bn(t.value);
    case _.ResponseErr:
      return Bn(t.value);
    case _.ResponseOk:
      return Bn(t.value);
    case _.PrincipalStandard:
    case _.PrincipalContract:
      return hp(t);
    case _.List:
      return t.list.map((r) => Bn(r));
    case _.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = Bn(t.data[r]);
      }), n;
    case _.StringASCII:
      return t.data;
    case _.StringUTF8:
      return t.data;
  }
}
function Bn(t) {
  switch (t.type) {
    case _.ResponseErr:
      return { type: Te(t), value: ho(t, !0), success: !1 };
    case _.ResponseOk:
      return { type: Te(t), value: ho(t, !0), success: !0 };
    default:
      return { type: Te(t), value: ho(t, !0) };
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
      return `(string-ascii ${Pl(t.data).length})`;
    case _.StringUTF8:
      return `(string-utf8 ${yr(t.data).length})`;
  }
}
const gp = () => ({ type: _.BoolTrue }), xp = () => ({ type: _.BoolFalse }), Ma = BigInt("0xffffffffffffffffffffffffffffffff"), wp = BigInt(0), Ra = BigInt("0x7fffffffffffffffffffffffffffffff"), Ga = BigInt("-170141183460469231731687303715884105728"), yp = (t) => {
  const e = li(t, !0);
  if (e > Ra)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Ra}`);
  if (e < Ga)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Ga}`);
  return { type: _.Int, value: e };
}, Sf = (t) => {
  const e = li(t, !1);
  if (e < wp)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Ma)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Ma}`);
  return { type: _.UInt, value: e };
}, mp = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: _.Buffer, buffer: t };
};
function Sp() {
  return { type: _.OptionalNone };
}
function Ep(t) {
  return { type: _.OptionalSome, value: t };
}
function Ap(t) {
  return { type: _.ResponseErr, value: t };
}
function vp(t) {
  return { type: _.ResponseOk, value: t };
}
function Bp(t) {
  return { type: _.List, list: t };
}
function Ef(t) {
  for (const e in t)
    if (!Gp(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: _.Tuple, data: t };
}
const hs = (t) => ({ type: _.StringASCII, data: t }), $p = (t) => ({ type: _.StringUTF8, data: t });
let Af = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, _p = class extends Af {
  constructor(e) {
    super(e);
  }
};
class uo extends Af {
  constructor(e) {
    super(e);
  }
}
function vf(t) {
  const e = [];
  return e.push(In(fi(t.version, 1))), e.push(In(t.hash160)), Rn(e);
}
function Va(t) {
  const e = Ul(ae(t.readBytes(1))), n = ae(t.readBytes(20));
  return { type: fr.Address, version: e, hash160: n };
}
function Bf(t) {
  const e = [], n = yr(t.content), r = n.byteLength;
  return e.push(In(fi(r, t.lengthPrefixBytes))), e.push(n), Rn(e);
}
function za(t, e, n) {
  e = e || 1;
  const r = Ul(ae(t.readBytes(e))), s = Cl(t.readBytes(r));
  return $i(s, e, 128);
}
function Jt(t, e) {
  return Rn([t, e]);
}
function Hp(t) {
  return new Uint8Array([t.type]);
}
function Lp(t) {
  return t.type === _.OptionalNone ? new Uint8Array([t.type]) : Jt(t.type, Er(t.value));
}
function Ip(t) {
  const e = new Uint8Array(4);
  return Is(e, t.buffer.length, 0), Jt(t.type, hi(e, t.buffer));
}
function kp(t) {
  const e = Ol(fu(t.value, BigInt(mu)), Nl);
  return Jt(t.type, e);
}
function Up(t) {
  const e = Ol(t.value, Nl);
  return Jt(t.type, e);
}
function Op(t) {
  return Jt(t.type, vf(t.address));
}
function Cp(t) {
  return Jt(t.type, hi(vf(t.address), Bf(t.contractName)));
}
function Pp(t) {
  return Jt(t.type, Er(t.value));
}
function Np(t) {
  const e = [], n = new Uint8Array(4);
  Is(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Er(r);
    e.push(s);
  }
  return Jt(t.type, Rn(e));
}
function Dp(t) {
  const e = [], n = new Uint8Array(4);
  Is(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = $i(s);
    e.push(Bf(o));
    const i = Er(t.data[s]);
    e.push(i);
  }
  return Jt(t.type, Rn(e));
}
function $f(t, e) {
  const n = [], r = e == "ascii" ? Pl(t.data) : yr(t.data), s = new Uint8Array(4);
  return Is(s, r.length, 0), n.push(s), n.push(r), Jt(t.type, Rn(n));
}
function Tp(t) {
  return $f(t, "ascii");
}
function Fp(t) {
  return $f(t, "utf8");
}
function Er(t) {
  switch (t.type) {
    case _.BoolTrue:
    case _.BoolFalse:
      return Hp(t);
    case _.OptionalNone:
    case _.OptionalSome:
      return Lp(t);
    case _.Buffer:
      return Ip(t);
    case _.UInt:
      return Up(t);
    case _.Int:
      return kp(t);
    case _.PrincipalStandard:
      return Op(t);
    case _.PrincipalContract:
      return Cp(t);
    case _.ResponseOk:
    case _.ResponseErr:
      return Pp(t);
    case _.List:
      return Np(t);
    case _.Tuple:
      return Dp(t);
    case _.StringASCII:
      return Tp(t);
    case _.StringUTF8:
      return Fp(t);
    default:
      throw new _p("Unable to serialize. Invalid Clarity Value.");
  }
}
function Mp(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Ka = /* @__PURE__ */ new Map();
function _f(t, e) {
  const n = Ka.get(t);
  if (n !== void 0)
    return n(e);
  const r = Mp(t);
  return Ka.set(t, r), _f(t, e);
}
class ja {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return wu(this.readBytes(4), 0);
  }
  readUInt8() {
    return xu(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return gu(this.readBytes(2), 0);
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
    if (_f(e, r))
      return r;
    throw n(r);
  }
}
function $n(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new ja(In(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new ja(t) : e = t;
  switch (e.readUInt8Enum(_, (r) => {
    throw new uo(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case _.Int:
      return yp(e.readBytes(16));
    case _.UInt:
      return Sf(e.readBytes(16));
    case _.Buffer:
      const r = e.readUInt32BE();
      return mp(e.readBytes(r));
    case _.BoolTrue:
      return gp();
    case _.BoolFalse:
      return xp();
    case _.PrincipalStandard:
      const s = Va(e);
      return pp(s);
    case _.PrincipalContract:
      const o = Va(e), i = za(e);
      return mf(o, i);
    case _.ResponseOk:
      return vp($n(e));
    case _.ResponseErr:
      return Ap($n(e));
    case _.OptionalNone:
      return Sp();
    case _.OptionalSome:
      return Ep($n(e));
    case _.List:
      const a = e.readUInt32BE(), c = [];
      for (let w = 0; w < a; w++)
        c.push($n(e));
      return Bp(c);
    case _.Tuple:
      const u = e.readUInt32BE(), h = {};
      for (let w = 0; w < u; w++) {
        const v = za(e).content;
        if (v === void 0)
          throw new uo('"content" is undefined');
        h[v] = $n(e);
      }
      return Ef(h);
    case _.StringASCII:
      const l = e.readUInt32BE(), b = pu(e.readBytes(l));
      return hs(b);
    case _.StringUTF8:
      const p = e.readUInt32BE(), x = Cl(e.readBytes(p));
      return $p(x);
    default:
      throw new uo("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const Rp = (t, e) => t ? yr(t).length > e : !1;
function Gp(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function Hf(t) {
  const e = Er(t);
  return `0x${ae(e)}`;
}
function Vp(t) {
  return $n(t);
}
const zp = (t) => {
  try {
    return Vn.c32addressDecode(t), !0;
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
      function u(g) {
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
      function h(g) {
        this.map = {}, g instanceof h ? g.forEach(function(E, L) {
          this.append(L, E);
        }, this) : Array.isArray(g) ? g.forEach(function(E) {
          if (E.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + E.length);
          this.append(E[0], E[1]);
        }, this) : g && Object.getOwnPropertyNames(g).forEach(function(E) {
          this.append(E, g[E]);
        }, this);
      }
      h.prototype.append = function(g, E) {
        g = a(g), E = c(E);
        var L = this.map[g];
        this.map[g] = L ? L + ", " + E : E;
      }, h.prototype.delete = function(g) {
        delete this.map[a(g)];
      }, h.prototype.get = function(g) {
        return g = a(g), this.has(g) ? this.map[g] : null;
      }, h.prototype.has = function(g) {
        return this.map.hasOwnProperty(a(g));
      }, h.prototype.set = function(g, E) {
        this.map[a(g)] = c(E);
      }, h.prototype.forEach = function(g, E) {
        for (var L in this.map)
          this.map.hasOwnProperty(L) && g.call(E, this.map[L], L, this);
      }, h.prototype.keys = function() {
        var g = [];
        return this.forEach(function(E, L) {
          g.push(L);
        }), u(g);
      }, h.prototype.values = function() {
        var g = [];
        return this.forEach(function(E) {
          g.push(E);
        }), u(g);
      }, h.prototype.entries = function() {
        var g = [];
        return this.forEach(function(E, L) {
          g.push([L, E]);
        }), u(g);
      }, r.iterable && (h.prototype[Symbol.iterator] = h.prototype.entries);
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
      function p(g) {
        var E = new FileReader(), L = b(E);
        return E.readAsArrayBuffer(g), L;
      }
      function x(g) {
        var E = new FileReader(), L = b(E), O = /charset=([A-Za-z0-9_-]+)/.exec(g.type), M = O ? O[1] : "utf-8";
        return E.readAsText(g, M), L;
      }
      function w(g) {
        for (var E = new Uint8Array(g), L = new Array(E.length), O = 0; O < E.length; O++)
          L[O] = String.fromCharCode(E[O]);
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
              return this.blob().then(p);
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
      var k = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function y(g) {
        var E = g.toUpperCase();
        return k.indexOf(E) > -1 ? E : g;
      }
      function $(g, E) {
        if (!(this instanceof $))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        E = E || {};
        var L = E.body;
        if (g instanceof $) {
          if (g.bodyUsed)
            throw new TypeError("Already read");
          this.url = g.url, this.credentials = g.credentials, E.headers || (this.headers = new h(g.headers)), this.method = g.method, this.mode = g.mode, this.signal = g.signal, !L && g._bodyInit != null && (L = g._bodyInit, g.bodyUsed = !0);
        } else
          this.url = String(g);
        if (this.credentials = E.credentials || this.credentials || "same-origin", (E.headers || !this.headers) && (this.headers = new h(E.headers)), this.method = y(E.method || this.method || "GET"), this.mode = E.mode || this.mode || null, this.signal = E.signal || this.signal || function() {
          if ("AbortController" in n) {
            var N = new AbortController();
            return N.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && L)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(L), (this.method === "GET" || this.method === "HEAD") && (E.cache === "no-store" || E.cache === "no-cache")) {
          var O = /([?&])_=[^&]*/;
          if (O.test(this.url))
            this.url = this.url.replace(O, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
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
            var O = L.split("="), M = O.shift().replace(/\+/g, " "), N = O.join("=").replace(/\+/g, " ");
            E.append(decodeURIComponent(M), decodeURIComponent(N));
          }
        }), E;
      }
      function P(g) {
        var E = new h(), L = g.replace(/\r?\n[\t ]+/g, " ");
        return L.split("\r").map(function(O) {
          return O.indexOf(`
`) === 0 ? O.substr(1, O.length) : O;
        }).forEach(function(O) {
          var M = O.split(":"), N = M.shift().trim();
          if (N) {
            var ht = M.join(":").trim();
            try {
              E.append(N, ht);
            } catch (nt) {
              console.warn("Response " + nt.message);
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
        this.ok = this.status >= 200 && this.status < 300, this.statusText = E.statusText === void 0 ? "" : "" + E.statusText, this.headers = new h(E.headers), this.url = E.url || "", this._initBody(g);
      }
      H.call(F.prototype), F.prototype.clone = function() {
        return new F(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new h(this.headers),
          url: this.url
        });
      }, F.error = function() {
        var g = new F(null, { status: 200, statusText: "" });
        return g.ok = !1, g.status = 0, g.type = "error", g;
      };
      var U = [301, 302, 303, 307, 308];
      F.redirect = function(g, E) {
        if (U.indexOf(E) === -1)
          throw new RangeError("Invalid status code");
        return new F(null, { status: E, headers: { location: g } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(E, L) {
          this.message = E, this.name = L;
          var O = Error(E);
          this.stack = O.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function C(g, E) {
        return new Promise(function(L, O) {
          var M = new $(g, E);
          if (M.signal && M.signal.aborted)
            return O(new e.DOMException("Aborted", "AbortError"));
          var N = new XMLHttpRequest();
          function ht() {
            N.abort();
          }
          N.onload = function() {
            var ot = {
              statusText: N.statusText,
              headers: P(N.getAllResponseHeaders() || "")
            };
            M.url.indexOf("file://") === 0 && (N.status < 200 || N.status > 599) ? ot.status = 200 : ot.status = N.status, ot.url = "responseURL" in N ? N.responseURL : ot.headers.get("X-Request-URL");
            var G = "response" in N ? N.response : N.responseText;
            setTimeout(function() {
              L(new F(G, ot));
            }, 0);
          }, N.onerror = function() {
            setTimeout(function() {
              O(new TypeError("Network request failed"));
            }, 0);
          }, N.ontimeout = function() {
            setTimeout(function() {
              O(new TypeError("Network request timed out"));
            }, 0);
          }, N.onabort = function() {
            setTimeout(function() {
              O(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function nt(ot) {
            try {
              return ot === "" && n.location.href ? n.location.href : ot;
            } catch {
              return ot;
            }
          }
          if (N.open(M.method, nt(M.url), !0), M.credentials === "include" ? N.withCredentials = !0 : M.credentials === "omit" && (N.withCredentials = !1), "responseType" in N && (r.blob ? N.responseType = "blob" : r.arrayBuffer && (N.responseType = "arraybuffer")), E && typeof E.headers == "object" && !(E.headers instanceof h || n.Headers && E.headers instanceof n.Headers)) {
            var ze = [];
            Object.getOwnPropertyNames(E.headers).forEach(function(ot) {
              ze.push(a(ot)), N.setRequestHeader(ot, c(E.headers[ot]));
            }), M.headers.forEach(function(ot, G) {
              ze.indexOf(G) === -1 && N.setRequestHeader(G, ot);
            });
          } else
            M.headers.forEach(function(ot, G) {
              N.setRequestHeader(G, ot);
            });
          M.signal && (M.signal.addEventListener("abort", ht), N.onreadystatechange = function() {
            N.readyState === 4 && M.signal.removeEventListener("abort", ht);
          }), N.send(typeof M._bodyInit > "u" ? null : M._bodyInit);
        });
      }
      return C.polyfill = !0, n.fetch || (n.fetch = C, n.Headers = h, n.Request = $, n.Response = F), e.Headers = h, e.Request = $, e.Response = F, e.fetch = C, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : gt);
})();
const Kp = "https://browser.blockstack.org/auth", jp = {
  "@type": "Person",
  "@context": "http://schema.org"
}, Lf = ["store_write"], qp = "blockstack-session", Wp = {
  logLevel: "debug"
}, fn = {
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
Object.freeze(fn);
class Kn extends Error {
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
class Xp extends Kn {
  constructor(e, n = "") {
    super({ code: fn.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class qa extends Kn {
  constructor(e = "") {
    super({ code: fn.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Kr extends Kn {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: fn.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Wa extends Kn {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: fn.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class To extends Kn {
  constructor(e) {
    super({ code: fn.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class If extends Kn {
  constructor(e) {
    super({ code: fn.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Xa = ["debug", "info", "warn", "error", "none"], Fo = {};
for (let t = 0; t < Xa.length; t++) {
  const e = Xa[t];
  Fo[e] = t;
}
class _n {
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
    return Fo[Wp.logLevel] <= Fo[e];
  }
}
function Yp() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Jp() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function po(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function Zp() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Qp() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function tb(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function Hi(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Qp(), s) {
      const o = s[t];
      if (o)
        return o;
    }
  } catch (o) {
    _n.error(`Error getting object '${t}' from global scope '${s}': ${o}`);
  }
  if (e) {
    const o = tb(s, t.toString(), n);
    throw _n.error(o), new Error(o);
  }
  if (r)
    return {};
}
function eb(t) {
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
  if (ab(t, Uint8Array))
    return BigInt(`0x${kt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function nb(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Li(t, e = 8) {
  return (typeof t == "bigint" ? t : eb(t)).toString(16).padStart(e * 2, "0");
}
function kf(t, e = 16) {
  const n = Li(t, e);
  return $t(n);
}
function rb(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const sb = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function kt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += sb[n];
  return e;
}
function $t(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = nb(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    e[n] = o;
  }
  return e;
}
function Ar(t) {
  return new TextEncoder().encode(t);
}
function Uf(t) {
  return new TextDecoder().decode(t);
}
function ob(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function ib(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Ya(t) {
  if (t.some(ib))
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
function jn(t) {
  return ce(...t.map((e) => typeof e == "number" ? Ya([e]) : e instanceof Array ? Ya(e) : e));
}
function ab(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const cb = "https://api.mainnet.hiro.so", lb = "https://api.testnet.hiro.so", fb = "http://localhost:3999", hb = "https://hub.blockstack.org";
function ub(t) {
  const e = typeof t == "string" ? $t(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Cs(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const db = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function pb(t, e) {
  const n = {};
  return Object.assign(n, db, e), await fetch(t, n);
}
function bb(t) {
  let e = pb, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function gb(...t) {
  const { fetchLib: e, middlewares: n } = bb(t);
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
class Of {
  constructor(e = Lf.slice(), n = ((a) => (a = Hi("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", o = void 0, i = Kp) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = o, this.authenticatorURL = i;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Mo(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function xb(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Cf(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function wb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Mo(t.outputLen), Mo(t.blockLen);
}
function yb(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function mb(t, e) {
  Cf(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ze = {
  number: Mo,
  bool: xb,
  bytes: Cf,
  hash: wb,
  exists: yb,
  output: mb
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const bo = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Gt = (t, e) => t << 32 - e | t >>> e, Sb = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Sb)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Eb(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Ii(t) {
  if (typeof t == "string" && (t = Eb(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Pf = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function hn(t) {
  const e = (r) => t().update(Ii(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Nf = class extends Pf {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ze.hash(e);
    const r = Ii(n);
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
const Ps = (t, e, n) => new Nf(t, e).update(n).digest();
Ps.create = (t, e) => new Nf(t, e);
function Ab(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + u, a, r);
}
let ki = class extends Pf {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = bo(this.buffer);
  }
  update(e) {
    Ze.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Ii(e);
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
    Ze.exists(this), Ze.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let l = i; l < s; l++)
      n[l] = 0;
    Ab(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = bo(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, h[l], o);
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
const vb = (t, e, n) => t & e ^ ~t & n, Bb = (t, e, n) => t & e ^ t & n ^ e & n, $b = new Uint32Array([
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
let Df = class extends ki {
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
      const b = ye[l - 15], p = ye[l - 2], x = Gt(b, 7) ^ Gt(b, 18) ^ b >>> 3, w = Gt(p, 17) ^ Gt(p, 19) ^ p >>> 10;
      ye[l] = w + ye[l - 7] + x + ye[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const b = Gt(a, 6) ^ Gt(a, 11) ^ Gt(a, 25), p = h + b + vb(a, c, u) + $b[l] + ye[l] | 0, w = (Gt(r, 2) ^ Gt(r, 13) ^ Gt(r, 22)) + Bb(r, s, o) | 0;
      h = u, u = c, c = a, a = i + p | 0, i = o, o = s, s = r, r = p + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    ye.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, _b = class extends Df {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Nn = hn(() => new Df());
hn(() => new _b());
var vr = {};
vr.byteLength = Ub;
var Hb = vr.toByteArray = Cb, Lb = vr.fromByteArray = Db, qt = [], It = [], Ib = typeof Uint8Array < "u" ? Uint8Array : Array, go = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var An = 0, kb = go.length; An < kb; ++An)
  qt[An] = go[An], It[go.charCodeAt(An)] = An;
It[45] = 62;
It[95] = 63;
function Tf(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Ub(t) {
  var e = Tf(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Ob(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Cb(t) {
  var e, n = Tf(t), r = n[0], s = n[1], o = new Ib(Ob(t, r, s)), i = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = It[t.charCodeAt(c)] << 18 | It[t.charCodeAt(c + 1)] << 12 | It[t.charCodeAt(c + 2)] << 6 | It[t.charCodeAt(c + 3)], o[i++] = e >> 16 & 255, o[i++] = e >> 8 & 255, o[i++] = e & 255;
  return s === 2 && (e = It[t.charCodeAt(c)] << 2 | It[t.charCodeAt(c + 1)] >> 4, o[i++] = e & 255), s === 1 && (e = It[t.charCodeAt(c)] << 10 | It[t.charCodeAt(c + 1)] << 4 | It[t.charCodeAt(c + 2)] >> 2, o[i++] = e >> 8 & 255, o[i++] = e & 255), o;
}
function Pb(t) {
  return qt[t >> 18 & 63] + qt[t >> 12 & 63] + qt[t >> 6 & 63] + qt[t & 63];
}
function Nb(t, e, n) {
  for (var r, s = [], o = e; o < n; o += 3)
    r = (t[o] << 16 & 16711680) + (t[o + 1] << 8 & 65280) + (t[o + 2] & 255), s.push(Pb(r));
  return s.join("");
}
function Db(t) {
  for (var e, n = t.length, r = n % 3, s = [], o = 16383, i = 0, a = n - r; i < a; i += o)
    s.push(Nb(t, i, i + o > a ? a : i + o));
  return r === 1 ? (e = t[n - 1], s.push(
    qt[e >> 2] + qt[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    qt[e >> 10] + qt[e >> 4 & 63] + qt[e << 2 & 63] + "="
  )), s.join("");
}
function Tb() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const Fb = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function Mb() {
  if (Tb())
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
    throw new Error(Fb);
  }
}
class Rb {
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
class Gb {
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
async function Ff() {
  const t = await Mb();
  return t.name === "subtleCrypto" ? new Gb(t.lib) : new Rb(t.lib.createCipheriv, t.lib.createDecipheriv);
}
const Vb = xf, zb = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Kb = Vb(zb);
const jb = /* @__PURE__ */ Ld(Kb), qb = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Mf = Uint8Array.from({ length: 16 }, (t, e) => e), Wb = Mf.map((t) => (9 * t + 5) % 16);
let Ui = [Mf], Oi = [Wb];
for (let t = 0; t < 4; t++)
  for (let e of [Ui, Oi])
    e.push(e[t].map((n) => qb[n]));
const Rf = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Xb = Ui.map((t, e) => t.map((n) => Rf[e][n])), Yb = Oi.map((t, e) => t.map((n) => Rf[e][n])), Jb = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Zb = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), jr = (t, e) => t << e | t >>> 32 - e;
function Ja(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const qr = new Uint32Array(16);
let Qb = class extends ki {
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
    for (let p = 0; p < 16; p++, n += 4)
      qr[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, l = this.h4 | 0, b = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, w = Jb[p], v = Zb[p], H = Ui[p], k = Oi[p], y = Xb[p], $ = Yb[p];
      for (let A = 0; A < 16; A++) {
        const P = jr(r + Ja(p, o, a, u) + qr[H[A]] + w, y[A]) + l | 0;
        r = l, l = u, u = jr(a, 10) | 0, a = o, o = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = jr(s + Ja(x, i, c, h) + qr[k[A]] + v, $[A]) + b | 0;
        s = b, b = h, h = jr(c, 10) | 0, c = i, i = P;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + b | 0, this.h3 + l + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    qr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const t1 = hn(() => new Qb());
function e1(t) {
  return t1(t);
}
const Wr = BigInt(2 ** 32 - 1), Ro = BigInt(32);
function Gf(t, e = !1) {
  return e ? { h: Number(t & Wr), l: Number(t >> Ro & Wr) } : { h: Number(t >> Ro & Wr) | 0, l: Number(t & Wr) | 0 };
}
function n1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = Gf(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const r1 = (t, e) => BigInt(t >>> 0) << Ro | BigInt(e >>> 0), s1 = (t, e, n) => t >>> n, o1 = (t, e, n) => t << 32 - n | e >>> n, i1 = (t, e, n) => t >>> n | e << 32 - n, a1 = (t, e, n) => t << 32 - n | e >>> n, c1 = (t, e, n) => t << 64 - n | e >>> n - 32, l1 = (t, e, n) => t >>> n - 32 | e << 64 - n, f1 = (t, e) => e, h1 = (t, e) => t, u1 = (t, e, n) => t << n | e >>> 32 - n, d1 = (t, e, n) => e << n | t >>> 32 - n, p1 = (t, e, n) => e << n - 32 | t >>> 64 - n, b1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function g1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const x1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), w1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, y1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), m1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, S1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), E1 = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, z = {
  fromBig: Gf,
  split: n1,
  toBig: r1,
  shrSH: s1,
  shrSL: o1,
  rotrSH: i1,
  rotrSL: a1,
  rotrBH: c1,
  rotrBL: l1,
  rotr32H: f1,
  rotr32L: h1,
  rotlSH: u1,
  rotlSL: d1,
  rotlBH: p1,
  rotlBL: b1,
  add: g1,
  add3L: x1,
  add3H: w1,
  add4L: y1,
  add4H: m1,
  add5H: E1,
  add5L: S1
}, [A1, v1] = z.split([
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
let Ns = class extends ki {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: l, Fl: b, Gh: p, Gl: x, Hh: w, Hl: v } = this;
    return [e, n, r, s, o, i, a, c, u, h, l, b, p, x, w, v];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, c, u, h, l, b, p, x, w, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = b | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let y = 0; y < 16; y++, n += 4)
      me[y] = e.getUint32(n), Se[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const $ = me[y - 15] | 0, A = Se[y - 15] | 0, P = z.rotrSH($, A, 1) ^ z.rotrSH($, A, 8) ^ z.shrSH($, A, 7), F = z.rotrSL($, A, 1) ^ z.rotrSL($, A, 8) ^ z.shrSL($, A, 7), U = me[y - 2] | 0, C = Se[y - 2] | 0, g = z.rotrSH(U, C, 19) ^ z.rotrBH(U, C, 61) ^ z.shrSH(U, C, 6), E = z.rotrSL(U, C, 19) ^ z.rotrBL(U, C, 61) ^ z.shrSL(U, C, 6), L = z.add4L(F, E, Se[y - 7], Se[y - 16]), O = z.add4H(L, P, g, me[y - 7], me[y - 16]);
      me[y] = O | 0, Se[y] = L | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: b, Fh: p, Fl: x, Gh: w, Gl: v, Hh: H, Hl: k } = this;
    for (let y = 0; y < 80; y++) {
      const $ = z.rotrSH(l, b, 14) ^ z.rotrSH(l, b, 18) ^ z.rotrBH(l, b, 41), A = z.rotrSL(l, b, 14) ^ z.rotrSL(l, b, 18) ^ z.rotrBL(l, b, 41), P = l & p ^ ~l & w, F = b & x ^ ~b & v, U = z.add5L(k, A, F, v1[y], Se[y]), C = z.add5H(U, H, $, P, A1[y], me[y]), g = U | 0, E = z.rotrSH(r, s, 28) ^ z.rotrBH(r, s, 34) ^ z.rotrBH(r, s, 39), L = z.rotrSL(r, s, 28) ^ z.rotrBL(r, s, 34) ^ z.rotrBL(r, s, 39), O = r & o ^ r & a ^ o & a, M = s & i ^ s & c ^ i & c;
      H = w | 0, k = v | 0, w = p | 0, v = x | 0, p = l | 0, x = b | 0, { h: l, l: b } = z.add(u | 0, h | 0, C | 0, g | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const N = z.add3L(g, L, M);
      r = z.add3H(N, C, E, O), s = N | 0;
    }
    ({ h: r, l: s } = z.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = z.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = z.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = z.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: b } = z.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h: p, l: x } = z.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: w, l: v } = z.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: H, l: k } = z.add(this.Hh | 0, this.Hl | 0, H | 0, k | 0), this.set(r, s, o, i, a, c, u, h, l, b, p, x, w, v, H, k);
  }
  roundClean() {
    me.fill(0), Se.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, B1 = class extends Ns {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, $1 = class extends Ns {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, _1 = class extends Ns {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const H1 = hn(() => new Ns());
hn(() => new B1());
hn(() => new $1());
hn(() => new _1());
function Vf(t) {
  return Nn(t);
}
function L1(t) {
  return H1(t);
}
const I1 = 0;
ct.hmacSha256Sync = (t, ...e) => {
  const n = Ps.create(Nn, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function k1() {
  return kt(ct.randomPrivateKey());
}
function U1(t) {
  const e = Nn(Nn(t));
  return jb.encode(ce(t, e).slice(0, t.length + 4));
}
function O1(t, e) {
  return U1(ce(new Uint8Array([t]), e.slice(0, 20)));
}
function zf(t, e = I1) {
  const n = typeof t == "string" ? $t(t) : t, r = e1(Vf(n));
  return O1(e, r);
}
function Kf(t) {
  const e = ub(t);
  return kt(wi(e.slice(0, 32), !0));
}
ct.hmacSha256Sync = (t, ...e) => {
  const n = Ps.create(Nn, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var ms;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(ms || (ms = {}));
async function C1(t, e, n) {
  return await (await Ff()).encrypt("aes-256-cbc", e, t, n);
}
async function P1(t, e, n) {
  return await (await Ff()).decrypt("aes-256-cbc", e, t, n);
}
function jf(t, e) {
  return Ps(Nn, t, e);
}
function N1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function qf(t) {
  const e = L1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function D1(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function T1(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: ms.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: ms.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !D1(t))
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
async function F1(t, e, n, r) {
  const s = T1(t);
  if (!s.result)
    throw s;
  const o = ct.randomPrivateKey(), i = wi(o, !0);
  let a = yi(o, t, !0);
  a = a.slice(1);
  const c = qf(a), u = ct.randomBytes(16), h = await C1(u, c.encryptionKey, e), l = ce(u, i, h), b = jf(c.hmacKey, l);
  let p;
  if (!r || r === "hex")
    p = kt(h);
  else if (r === "base64")
    p = Lb(h);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const x = {
    iv: kt(u),
    ephemeralPK: kt(i),
    cipherText: p,
    mac: kt(b),
    wasString: n
  };
  return r && r !== "hex" && (x.cipherTextEncoding = r), x;
}
async function Wf(t, e) {
  if (!e.ephemeralPK)
    throw new Wa("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = yi(t, n, !0);
  r = r.slice(1);
  const s = qf(r), o = $t(e.iv);
  let i;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    i = $t(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    i = Hb(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = ce(o, $t(n), i), c = jf(s.hmacKey, a), u = $t(e.mac);
  if (!N1(u, c))
    throw new Wa("Decryption failed: failure in MAC check");
  const h = await P1(o, s.encryptionKey, i);
  return e.wasString ? Uf(h) : h;
}
function M1(t, e) {
  const n = typeof e == "string" ? Ar(e) : e, r = Kf(t), s = Vf(n), o = Zl(s, t);
  return {
    signature: kt(o),
    publicKey: r
  };
}
async function R1(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = Kf(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", o = typeof t == "string" ? Ar(t) : t, i = await F1(n.publicKey, o, s, n.cipherTextEncoding);
  let a = JSON.stringify(i);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = M1(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function G1(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return Wf(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var xt = {}, Dn = {}, bt = {};
Object.defineProperty(bt, "__esModule", { value: !0 });
bt.decode = bt.encode = bt.unescape = bt.escape = bt.pad = void 0;
const Xf = vr;
function Ci(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
bt.pad = Ci;
function Yf(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
bt.escape = Yf;
function Jf(t) {
  return Ci(t).replace(/-/g, "+").replace(/_/g, "/");
}
bt.unescape = Jf;
function V1(t) {
  return Yf((0, Xf.fromByteArray)(new TextEncoder().encode(t)));
}
bt.encode = V1;
function z1(t) {
  return new TextDecoder().decode((0, Xf.toByteArray)(Ci(Jf(t))));
}
bt.decode = z1;
var Ds = {}, Ts = {};
let Pi = class extends vi {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, of(e);
    const r = zn(n);
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
    this.oHash.update(o), ur(o);
  }
  update(e) {
    return hr(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    hr(this), Ve(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Zf = (t, e, n) => new Pi(t, e).update(n).digest();
Zf.create = (t, e) => new Pi(t, e);
const K1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HMAC: Pi,
  hmac: Zf
}, Symbol.toStringTag, { value: "Module" })), j1 = /* @__PURE__ */ mr(K1), q1 = /* @__PURE__ */ mr(Hd);
var Tn = {};
Object.defineProperty(Tn, "__esModule", { value: !0 });
Tn.joseToDer = Tn.derToJose = void 0;
const Qf = vr, th = bt;
function xo(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const W1 = {
  ES256: xo(256),
  ES384: xo(384),
  ES512: xo(521)
};
function eh(t) {
  const e = W1[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Ss = 128, nh = 0, X1 = 32, Y1 = 16, J1 = 2, rh = Y1 | X1 | nh << 6, Es = J1 | nh << 6;
function sh(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, Qf.toByteArray)((0, th.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function Z1(t, e) {
  const n = sh(t), r = eh(e), s = r + 1, o = n.length;
  let i = 0;
  if (n[i++] !== rh)
    throw new Error('Could not find expected "seq"');
  let a = n[i++];
  if (a === (Ss | 1) && (a = n[i++]), o - i < a)
    throw new Error(`"seq" specified length of "${a}", only "${o - i}" remaining`);
  if (n[i++] !== Es)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[i++];
  if (o - i - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${o - i - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const u = i;
  if (i += c, n[i++] !== Es)
    throw new Error('Could not find expected "int" for "s"');
  const h = n[i++];
  if (o - i !== h)
    throw new Error(`"s" specified length of "${h}", expected "${o - i}"`);
  if (s < h)
    throw new Error(`"s" specified length of "${h}", max of "${s}" is acceptable`);
  const l = i;
  if (i += h, i !== o)
    throw new Error(`Expected to consume entire array, but "${o - i}" bytes remain`);
  const b = r - c, p = r - h, x = new Uint8Array(b + c + p + h);
  for (i = 0; i < b; ++i)
    x[i] = 0;
  x.set(n.subarray(u + Math.max(-b, 0), u + c), i), i = r;
  for (const w = i; i < w + p; ++i)
    x[i] = 0;
  return x.set(n.subarray(l + Math.max(-p, 0), l + h), i), (0, th.escape)((0, Qf.fromByteArray)(x));
}
Tn.derToJose = Z1;
function Za(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Ss && --r, r;
}
function Q1(t, e) {
  t = sh(t);
  const n = eh(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Za(t, 0, n), o = Za(t, n, t.length), i = n - s, a = n - o, c = 2 + i + 1 + 1 + a, u = c < Ss, h = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return h[l++] = rh, u ? h[l++] = c : (h[l++] = Ss | 1, h[l++] = c & 255), h[l++] = Es, h[l++] = i, s < 0 ? (h[l++] = 0, h.set(t.subarray(0, n), l), l += n) : (h.set(t.subarray(s, n), l), l += n - s), h[l++] = Es, h[l++] = a, o < 0 ? (h[l++] = 0, h.set(t.subarray(n), l)) : h.set(t.subarray(n + o), l), h;
}
Tn.joseToDer = Q1;
var le = {};
Object.defineProperty(le, "__esModule", { value: !0 });
le.InvalidTokenError = le.MissingParametersError = void 0;
class t2 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
le.MissingParametersError = t2;
class e2 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
le.InvalidTokenError = e2;
Object.defineProperty(Ts, "__esModule", { value: !0 });
Ts.SECP256K1Client = void 0;
const n2 = j1, r2 = Os, us = q1, Qa = Tn, tc = le, ec = Sr;
us.utils.hmacSha256Sync = (t, ...e) => {
  const n = n2.hmac.create(r2.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class oh {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, ec.bytesToHex)(us.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new tc.MissingParametersError("a signing input hash and private key are all required");
    const s = us.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, ec.bytesToHex)(s);
    if (r === "jose")
      return (0, Qa.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Qa.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new tc.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return us.verify(n, e, r, { strict: !1 });
  }
}
Ts.SECP256K1Client = oh;
oh.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Ts;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(Ds);
var on = {};
const s2 = /* @__PURE__ */ mr(Vl);
var o2 = gt && gt.__awaiter || function(t, e, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
    function a(h) {
      try {
        u(r.next(h));
      } catch (l) {
        i(l);
      }
    }
    function c(h) {
      try {
        u(r.throw(h));
      } catch (l) {
        i(l);
      }
    }
    function u(h) {
      h.done ? o(h.value) : s(h.value).then(a, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(on, "__esModule", { value: !0 });
on.hashSha256Async = on.hashSha256 = void 0;
const i2 = Os;
function ih(t) {
  return (0, i2.sha256)(t);
}
on.hashSha256 = ih;
function a2(t) {
  return o2(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = s2;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(ih(t));
    }
  });
}
on.hashSha256Async = a2;
var c2 = gt && gt.__awaiter || function(t, e, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
    function a(h) {
      try {
        u(r.next(h));
      } catch (l) {
        i(l);
      }
    }
    function c(h) {
      try {
        u(r.throw(h));
      } catch (l) {
        i(l);
      }
    }
    function u(h) {
      h.done ? o(h.value) : s(h.value).then(a, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Dn, "__esModule", { value: !0 });
Dn.TokenSigner = Dn.createUnsecuredToken = void 0;
const Go = bt, nc = Ds, l2 = le, rc = on;
function Vo(t, e) {
  const n = [], r = Go.encode(JSON.stringify(e));
  n.push(r);
  const s = Go.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function f2(t) {
  return Vo(t, { typ: "JWT", alg: "none" }) + ".";
}
Dn.createUnsecuredToken = f2;
class h2 {
  constructor(e, n) {
    if (!(e && n))
      throw new l2.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !nc.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = nc.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), o = Vo(e, s), i = (0, rc.hashSha256)(o);
    return this.createWithSignedHash(e, n, s, o, i);
  }
  signAsync(e, n = !1, r = {}) {
    return c2(this, void 0, void 0, function* () {
      const s = this.header(r), o = Vo(e, s), i = yield (0, rc.hashSha256Async)(o);
      return this.createWithSignedHash(e, n, s, o, i);
    });
  }
  createWithSignedHash(e, n, r, s, o) {
    const i = this.cryptoClient.signHash(o, this.rawPrivateKey);
    return n ? {
      header: [Go.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [i]
    } : [s, i].join(".");
  }
}
Dn.TokenSigner = h2;
var Fs = {};
Object.defineProperty(Fs, "__esModule", { value: !0 });
Fs.TokenVerifier = void 0;
const u2 = bt, sc = Ds, d2 = le, Xr = on;
class p2 {
  constructor(e, n) {
    if (!(e && n))
      throw new d2.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !sc.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = sc.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, Xr.hashSha256Async)(s).then((i) => o(i));
    {
      const i = (0, Xr.hashSha256)(s);
      return o(i);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), u2.encode(e.payload)].join(".");
    let s = !0;
    const o = (i) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(i, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Xr.hashSha256Async)(r).then((i) => o(i));
    {
      const i = (0, Xr.hashSha256)(r);
      return o(i);
    }
  }
}
Fs.TokenVerifier = p2;
var Ms = {};
Object.defineProperty(Ms, "__esModule", { value: !0 });
Ms.decodeToken = void 0;
const Yr = bt;
function b2(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Yr.decode(e[0])), r = JSON.parse(Yr.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Yr.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Yr.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
Ms.decodeToken = b2;
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
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Dn, t), n(Fs, t), n(Ms, t), n(le, t), n(Ds, t);
})(xt);
function g2(t) {
  return `did:btc-addr:${t}`;
}
function x2(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new qa("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new qa('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function ah(t) {
  if (t)
    return x2(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const w2 = "1.4.0";
function y2() {
  return k1();
}
function m2(t, e, n, r = Lf.slice(), s, o = Yp().getTime(), i = {}) {
  const a = (p) => {
    const x = Hi("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${p}=undefined])`
    });
    return x == null ? void 0 : x.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, i, {
    jti: Zp(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(o / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: w2,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = xt.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const h = zf(u);
  return c.iss = g2(h), new xt.TokenSigner("ES256k", t).sign(c);
}
async function oc(t, e) {
  const n = Uf($t(e)), r = JSON.parse(n), s = await Wf(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function S2(t) {
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
function E2(t) {
  const e = xt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = ah(e.iss);
  if (n.length === 1) {
    if (zf(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function A2(t) {
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
function v2(t) {
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
function B2(t) {
  const e = [
    v2(t),
    A2(t),
    S2(t),
    E2(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const ic = "1.0.0";
class Ge {
  constructor(e) {
    this.version = ic, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== ic)
      throw new To(`JSON data version ${e.version} not supported by SessionData`);
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
class ch {
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
class ac extends ch {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Ge({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new If("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Ge({})), !0;
  }
}
class cc extends ch {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = qp, !localStorage.getItem(this.key)) {
      const r = new Ge({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new If("No session data was found in localStorage");
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
var dr;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(dr || (dr = {}));
var As;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(As || (As = {}));
dr.Mainnet;
var oe;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(oe || (oe = {}));
var Xt;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Xt || (Xt = {}));
oe.Mainnet;
const lh = {
  chainId: dr.Mainnet,
  transactionVersion: oe.Mainnet,
  peerNetworkId: As.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Xt.MainnetSingleSig,
    multiSig: Xt.MainnetMultiSig
  },
  client: { baseUrl: cb }
}, zo = {
  chainId: dr.Testnet,
  transactionVersion: oe.Testnet,
  peerNetworkId: As.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Xt.TestnetSingleSig,
    multiSig: Xt.TestnetMultiSig
  },
  client: { baseUrl: lb }
}, ds = {
  ...zo,
  addressVersion: { ...zo.addressVersion },
  magicBytes: "id",
  client: { baseUrl: fb }
}, $2 = {
  ...ds,
  addressVersion: { ...ds.addressVersion },
  client: { ...ds.client }
};
function _2(t) {
  switch (t) {
    case "mainnet":
      return lh;
    case "testnet":
      return zo;
    case "devnet":
      return ds;
    case "mocknet":
      return $2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function fh(t) {
  return typeof t == "string" ? _2(t) : t;
}
var lc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(lc || (lc = {}));
var fc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(fc || (fc = {}));
var Dt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Dt || (Dt = {}));
const wo = ["onChainOnly", "offChainOnly", "any"];
wo[0] + "", Dt.OnChainOnly, wo[1] + "", Dt.OffChainOnly, wo[2] + "", Dt.Any, Dt.OnChainOnly + "", Dt.OnChainOnly, Dt.OffChainOnly + "", Dt.OffChainOnly, Dt.Any + "", Dt.Any;
var hc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(hc || (hc = {}));
var uc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(uc || (uc = {}));
var dc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(dc || (dc = {}));
var se;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(se || (se = {}));
var pc;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(pc || (pc = {}));
var bc;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(bc || (bc = {}));
var gc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(gc || (gc = {}));
var xc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(xc || (xc = {}));
var wc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(wc || (wc = {}));
var yc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(yc || (yc = {}));
var mc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(mc || (mc = {}));
var Sc;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Sc || (Sc = {}));
var Ec;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Ec || (Ec = {}));
function Ko(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function H2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function hh(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function L2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ko(t.outputLen), Ko(t.blockLen);
}
function I2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function k2(t, e) {
  hh(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Qe = {
  number: Ko,
  bool: H2,
  bytes: hh,
  hash: L2,
  exists: I2,
  output: k2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const yo = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Vt = (t, e) => t << 32 - e | t >>> e, U2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!U2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function O2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Ni(t) {
  if (typeof t == "string" && (t = O2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let uh = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function un(t) {
  const e = (r) => t().update(Ni(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
class dh extends uh {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Qe.hash(e);
    const r = Ni(n);
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
const ph = (t, e, n) => new dh(t, e).update(n).digest();
ph.create = (t, e) => new dh(t, e);
function C2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + u, a, r);
}
let Di = class extends uh {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = yo(this.buffer);
  }
  update(e) {
    Qe.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Ni(e);
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
    Qe.exists(this), Qe.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let l = i; l < s; l++)
      n[l] = 0;
    C2(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = yo(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, h[l], o);
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
const P2 = (t, e, n) => t & e ^ ~t & n, N2 = (t, e, n) => t & e ^ t & n ^ e & n, D2 = new Uint32Array([
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
let bh = class extends Di {
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
      const b = Ae[l - 15], p = Ae[l - 2], x = Vt(b, 7) ^ Vt(b, 18) ^ b >>> 3, w = Vt(p, 17) ^ Vt(p, 19) ^ p >>> 10;
      Ae[l] = w + Ae[l - 7] + x + Ae[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const b = Vt(a, 6) ^ Vt(a, 11) ^ Vt(a, 25), p = h + b + P2(a, c, u) + D2[l] + Ae[l] | 0, w = (Vt(r, 2) ^ Vt(r, 13) ^ Vt(r, 22)) + N2(r, s, o) | 0;
      h = u, u = c, c = a, a = i + p | 0, i = o, o = s, s = r, r = p + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    Ae.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, T2 = class extends bh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const gh = un(() => new bh());
un(() => new T2());
function F2(t, e) {
  switch (e = fh(e ?? lh), t) {
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
const M2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), xh = Uint8Array.from({ length: 16 }, (t, e) => e), R2 = xh.map((t) => (9 * t + 5) % 16);
let Ti = [xh], Fi = [R2];
for (let t = 0; t < 4; t++)
  for (let e of [Ti, Fi])
    e.push(e[t].map((n) => M2[n]));
const wh = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), G2 = Ti.map((t, e) => t.map((n) => wh[e][n])), V2 = Fi.map((t, e) => t.map((n) => wh[e][n])), z2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), K2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Jr = (t, e) => t << e | t >>> 32 - e;
function Ac(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Zr = new Uint32Array(16);
let j2 = class extends Di {
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
    for (let p = 0; p < 16; p++, n += 4)
      Zr[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, l = this.h4 | 0, b = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, w = z2[p], v = K2[p], H = Ti[p], k = Fi[p], y = G2[p], $ = V2[p];
      for (let A = 0; A < 16; A++) {
        const P = Jr(r + Ac(p, o, a, u) + Zr[H[A]] + w, y[A]) + l | 0;
        r = l, l = u, u = Jr(a, 10) | 0, a = o, o = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = Jr(s + Ac(x, i, c, h) + Zr[k[A]] + v, $[A]) + b | 0;
        s = b, b = h, h = Jr(c, 10) | 0, c = i, i = P;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + b | 0, this.h3 + l + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Zr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const q2 = un(() => new j2()), Qr = BigInt(2 ** 32 - 1), jo = BigInt(32);
function yh(t, e = !1) {
  return e ? { h: Number(t & Qr), l: Number(t >> jo & Qr) } : { h: Number(t >> jo & Qr) | 0, l: Number(t & Qr) | 0 };
}
function W2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = yh(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const X2 = (t, e) => BigInt(t >>> 0) << jo | BigInt(e >>> 0), Y2 = (t, e, n) => t >>> n, J2 = (t, e, n) => t << 32 - n | e >>> n, Z2 = (t, e, n) => t >>> n | e << 32 - n, Q2 = (t, e, n) => t << 32 - n | e >>> n, tg = (t, e, n) => t << 64 - n | e >>> n - 32, eg = (t, e, n) => t >>> n - 32 | e << 64 - n, ng = (t, e) => e, rg = (t, e) => t, sg = (t, e, n) => t << n | e >>> 32 - n, og = (t, e, n) => e << n | t >>> 32 - n, ig = (t, e, n) => e << n - 32 | t >>> 64 - n, ag = (t, e, n) => t << n - 32 | e >>> 64 - n;
function cg(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const lg = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), fg = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, hg = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), ug = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, dg = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), pg = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, K = {
  fromBig: yh,
  split: W2,
  toBig: X2,
  shrSH: Y2,
  shrSL: J2,
  rotrSH: Z2,
  rotrSL: Q2,
  rotrBH: tg,
  rotrBL: eg,
  rotr32H: ng,
  rotr32L: rg,
  rotlSH: sg,
  rotlSL: og,
  rotlBH: ig,
  rotlBL: ag,
  add: cg,
  add3L: lg,
  add3H: fg,
  add4L: hg,
  add4H: ug,
  add5H: pg,
  add5L: dg
}, [bg, gg] = K.split([
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
let Rs = class extends Di {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: l, Fl: b, Gh: p, Gl: x, Hh: w, Hl: v } = this;
    return [e, n, r, s, o, i, a, c, u, h, l, b, p, x, w, v];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, c, u, h, l, b, p, x, w, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = b | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let y = 0; y < 16; y++, n += 4)
      ve[y] = e.getUint32(n), Be[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const $ = ve[y - 15] | 0, A = Be[y - 15] | 0, P = K.rotrSH($, A, 1) ^ K.rotrSH($, A, 8) ^ K.shrSH($, A, 7), F = K.rotrSL($, A, 1) ^ K.rotrSL($, A, 8) ^ K.shrSL($, A, 7), U = ve[y - 2] | 0, C = Be[y - 2] | 0, g = K.rotrSH(U, C, 19) ^ K.rotrBH(U, C, 61) ^ K.shrSH(U, C, 6), E = K.rotrSL(U, C, 19) ^ K.rotrBL(U, C, 61) ^ K.shrSL(U, C, 6), L = K.add4L(F, E, Be[y - 7], Be[y - 16]), O = K.add4H(L, P, g, ve[y - 7], ve[y - 16]);
      ve[y] = O | 0, Be[y] = L | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: b, Fh: p, Fl: x, Gh: w, Gl: v, Hh: H, Hl: k } = this;
    for (let y = 0; y < 80; y++) {
      const $ = K.rotrSH(l, b, 14) ^ K.rotrSH(l, b, 18) ^ K.rotrBH(l, b, 41), A = K.rotrSL(l, b, 14) ^ K.rotrSL(l, b, 18) ^ K.rotrBL(l, b, 41), P = l & p ^ ~l & w, F = b & x ^ ~b & v, U = K.add5L(k, A, F, gg[y], Be[y]), C = K.add5H(U, H, $, P, bg[y], ve[y]), g = U | 0, E = K.rotrSH(r, s, 28) ^ K.rotrBH(r, s, 34) ^ K.rotrBH(r, s, 39), L = K.rotrSL(r, s, 28) ^ K.rotrBL(r, s, 34) ^ K.rotrBL(r, s, 39), O = r & o ^ r & a ^ o & a, M = s & i ^ s & c ^ i & c;
      H = w | 0, k = v | 0, w = p | 0, v = x | 0, p = l | 0, x = b | 0, { h: l, l: b } = K.add(u | 0, h | 0, C | 0, g | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const N = K.add3L(g, L, M);
      r = K.add3H(N, C, E, O), s = N | 0;
    }
    ({ h: r, l: s } = K.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = K.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = K.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = K.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: b } = K.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h: p, l: x } = K.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: w, l: v } = K.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: H, l: k } = K.add(this.Hh | 0, this.Hl | 0, H | 0, k | 0), this.set(r, s, o, i, a, c, u, h, l, b, p, x, w, v, H, k);
  }
  roundClean() {
    ve.fill(0), Be.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, xg = class extends Rs {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, wg = class extends Rs {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, yg = class extends Rs {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
un(() => new Rs());
un(() => new xg());
un(() => new wg());
un(() => new yg());
var qo;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(qo || (qo = {}));
function mg(t, e) {
  return { type: qo.Address, version: t, hash160: e };
}
function Sg(t) {
  return Vn.c32address(t.version, t.hash160);
}
const Eg = (t) => q2(gh(t)), Ag = (t) => kt(Eg(t));
ct.hmacSha256Sync = (t, ...e) => {
  const n = ph.create(gh, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function vg(t, e = "mainnet") {
  e = fh(e), t = typeof t == "string" ? $t(t) : t;
  const n = F2(se.P2PKH, e), r = mg(n, Ag(t));
  return Sg(r);
}
function Bg(t, e) {
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
  const s = r.issuer.publicKey, o = vg(s);
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
function $g(t, e = null) {
  let n;
  e ? n = Bg(t, e) : n = xt.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const vc = "_blockstackDidCheckEchoReply", _g = "echoReply", Hg = "authContinuation";
function Lg(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, o] = r.split("=");
    return n[s] = o ? decodeURIComponent(o.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function Ig() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[vc];
  if (typeof e == "boolean")
    return e;
  const n = Lg(t.location.search), r = n[_g];
  if (r) {
    t[vc] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const o = n[Hg];
      t.location.href = o;
    }, 10), !0;
  }
  return !1;
}
class Wo {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new Of();
    else
      throw new Xp("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new cc(e.sessionOptions) : this.store = new cc() : e ? this.store = new ac(e.sessionOptions) : this.store = new ac();
  }
  makeAuthRequestToken(e, n, r, s, o, i = Jp().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new To("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, o = o || c.appDomain, m2(e, n, r, s, o, i, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = y2();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = Hi("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (Ig())
        return _n.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      _n.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = gb()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Kr("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const o = xt.decodeToken(e).payload;
    if (typeof o == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await B2(e))
      throw new Kr("Invalid authentication response.");
    let a = o.private_key, c = o.core_token;
    if (po(o.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (o.private_key !== void 0 && o.private_key !== null)
          try {
            a = await oc(s, o.private_key);
          } catch {
            if (_n.warn("Failed decryption of appPrivateKey, will try to use as given"), !ct.isValidPrivateKey(o.private_key))
              throw new Kr("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await oc(s, c);
          } catch {
            _n.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Kr("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = hb, h;
    po(o.version, "1.2.0") && o.hubUrl !== null && o.hubUrl !== void 0 && (u = o.hubUrl), po(o.version, "1.3.0") && o.associationToken !== null && o.associationToken !== void 0 && (h = o.associationToken);
    const l = {
      profile: o.profile,
      email: o.email,
      decentralizedID: o.iss,
      identityAddress: ah(o.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: o.appPrivateKeyFromWalletSalt,
      coreNode: o.blockstackAPIUrl,
      gaiaAssociationToken: h
    }, b = o.profile_url;
    if (!l.profile && b) {
      const p = await n(b);
      if (!p.ok)
        l.profile = Object.assign({}, jp);
      else {
        const x = await p.text(), w = JSON.parse(x);
        l.profile = $g(w[0].token);
      }
    } else
      l.profile = o.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new To("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), R1(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), G1(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
Wo.prototype.makeAuthRequest = Wo.prototype.makeAuthRequestToken;
const kg = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), mh = "STX_PROVIDER", Sh = () => typeof window > "u" ? null : window.localStorage.getItem(mh), Ug = (t) => {
  typeof window < "u" && window.localStorage.setItem(mh, t);
}, Og = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Cg(t, e) {
  const n = {};
  return Object.assign(n, Og, e), await fetch(t, n);
}
function Pg(t) {
  let e = Cg, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Ng(...t) {
  const { fetchLib: e, middlewares: n } = Pg(t);
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
var Fn;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Fn || (Fn = {}));
var an;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(an || (an = {}));
var Bc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Bc || (Bc = {}));
const Dg = "https://api.mainnet.hiro.so", Tg = "https://api.testnet.hiro.so", Fg = "http://localhost:3999", Mg = ["mainnet", "testnet", "devnet", "mocknet"];
class cn {
  constructor(e) {
    this.version = an.Mainnet, this.chainId = Fn.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === an.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Ng();
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
cn.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Xo();
    case "testnet":
      return new Yo();
    case "devnet":
      return new Rg();
    case "mocknet":
      return new Eh();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Mg.join(", ")}`);
  }
};
cn.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : cn.fromName(t);
class Xo extends cn {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Dg,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = an.Mainnet, this.chainId = Fn.Mainnet;
  }
}
class Yo extends cn {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Tg,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = an.Testnet, this.chainId = Fn.Testnet;
  }
}
class Eh extends cn {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Fg,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = an.Testnet, this.chainId = Fn.Testnet;
  }
}
const Rg = Eh;
var Jo;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Jo || (Jo = {}));
var $c;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})($c || ($c = {}));
Jo.Mainnet;
var vs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(vs || (vs = {}));
var _c;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(_c || (_c = {}));
vs.Mainnet;
const Gg = 128, Vg = 128, Ah = 16;
var Hc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Hc || (Hc = {}));
var Lc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Lc || (Lc = {}));
var Tt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Tt || (Tt = {}));
const mo = ["onChainOnly", "offChainOnly", "any"];
mo[0] + "", Tt.OnChainOnly, mo[1] + "", Tt.OffChainOnly, mo[2] + "", Tt.Any, Tt.OnChainOnly + "", Tt.OnChainOnly, Tt.OffChainOnly + "", Tt.OffChainOnly, Tt.Any + "", Tt.Any;
var Ic;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Ic || (Ic = {}));
var kc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(kc || (kc = {}));
var Uc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Uc || (Uc = {}));
var Oc;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Oc || (Oc = {}));
var Cc;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Cc || (Cc = {}));
var Pc;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Pc || (Pc = {}));
var Nc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Nc || (Nc = {}));
var Dc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Dc || (Dc = {}));
var Tc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Tc || (Tc = {}));
var Fc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Fc || (Fc = {}));
var Mc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Mc || (Mc = {}));
var Rc;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Rc || (Rc = {}));
var Gc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Gc || (Gc = {}));
let zg = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Kg = class extends zg {
  constructor(e) {
    super(e);
  }
};
function Zo(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function jg(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function vh(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function qg(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Zo(t.outputLen), Zo(t.blockLen);
}
function Wg(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Xg(t, e) {
  vh(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const So = {
  number: Zo,
  bool: jg,
  bytes: vh,
  hash: qg,
  exists: Wg,
  output: Xg
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Eo = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), zt = (t, e) => t << 32 - e | t >>> e, Yg = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Yg)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Jg(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Bh(t) {
  if (typeof t == "string" && (t = Jg(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Zg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function dn(t) {
  const e = (r) => t().update(Bh(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Qg(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + u, a, r);
}
let Mi = class extends Zg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Eo(this.buffer);
  }
  update(e) {
    So.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Bh(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Eo(e);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    So.exists(this), So.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let l = i; l < s; l++)
      n[l] = 0;
    Qg(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Eo(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, h[l], o);
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
const tx = (t, e, n) => t & e ^ ~t & n, ex = (t, e, n) => t & e ^ t & n ^ e & n, nx = new Uint32Array([
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
let $h = class extends Mi {
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
      const b = _e[l - 15], p = _e[l - 2], x = zt(b, 7) ^ zt(b, 18) ^ b >>> 3, w = zt(p, 17) ^ zt(p, 19) ^ p >>> 10;
      _e[l] = w + _e[l - 7] + x + _e[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const b = zt(a, 6) ^ zt(a, 11) ^ zt(a, 25), p = h + b + tx(a, c, u) + nx[l] + _e[l] | 0, w = (zt(r, 2) ^ zt(r, 13) ^ zt(r, 22)) + ex(r, s, o) | 0;
      h = u, u = c, c = a, a = i + p | 0, i = o, o = s, s = r, r = p + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    _e.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, rx = class extends $h {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
dn(() => new $h());
dn(() => new rx());
const sx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), _h = Uint8Array.from({ length: 16 }, (t, e) => e), ox = _h.map((t) => (9 * t + 5) % 16);
let Ri = [_h], Gi = [ox];
for (let t = 0; t < 4; t++)
  for (let e of [Ri, Gi])
    e.push(e[t].map((n) => sx[n]));
const Hh = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), ix = Ri.map((t, e) => t.map((n) => Hh[e][n])), ax = Gi.map((t, e) => t.map((n) => Hh[e][n])), cx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), lx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ts = (t, e) => t << e | t >>> 32 - e;
function Vc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const es = new Uint32Array(16);
let fx = class extends Mi {
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
    for (let p = 0; p < 16; p++, n += 4)
      es[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, l = this.h4 | 0, b = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, w = cx[p], v = lx[p], H = Ri[p], k = Gi[p], y = ix[p], $ = ax[p];
      for (let A = 0; A < 16; A++) {
        const P = ts(r + Vc(p, o, a, u) + es[H[A]] + w, y[A]) + l | 0;
        r = l, l = u, u = ts(a, 10) | 0, a = o, o = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = ts(s + Vc(x, i, c, h) + es[k[A]] + v, $[A]) + b | 0;
        s = b, b = h, h = ts(c, 10) | 0, c = i, i = P;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + b | 0, this.h3 + l + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    es.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
dn(() => new fx());
const ns = BigInt(2 ** 32 - 1), Qo = BigInt(32);
function Lh(t, e = !1) {
  return e ? { h: Number(t & ns), l: Number(t >> Qo & ns) } : { h: Number(t >> Qo & ns) | 0, l: Number(t & ns) | 0 };
}
function hx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = Lh(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const ux = (t, e) => BigInt(t >>> 0) << Qo | BigInt(e >>> 0), dx = (t, e, n) => t >>> n, px = (t, e, n) => t << 32 - n | e >>> n, bx = (t, e, n) => t >>> n | e << 32 - n, gx = (t, e, n) => t << 32 - n | e >>> n, xx = (t, e, n) => t << 64 - n | e >>> n - 32, wx = (t, e, n) => t >>> n - 32 | e << 64 - n, yx = (t, e) => e, mx = (t, e) => t, Sx = (t, e, n) => t << n | e >>> 32 - n, Ex = (t, e, n) => e << n | t >>> 32 - n, Ax = (t, e, n) => e << n - 32 | t >>> 64 - n, vx = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Bx(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const $x = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), _x = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Hx = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Lx = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Ix = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), kx = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, j = {
  fromBig: Lh,
  split: hx,
  toBig: ux,
  shrSH: dx,
  shrSL: px,
  rotrSH: bx,
  rotrSL: gx,
  rotrBH: xx,
  rotrBL: wx,
  rotr32H: yx,
  rotr32L: mx,
  rotlSH: Sx,
  rotlSL: Ex,
  rotlBH: Ax,
  rotlBL: vx,
  add: Bx,
  add3L: $x,
  add3H: _x,
  add4L: Hx,
  add4H: Lx,
  add5H: kx,
  add5L: Ix
}, [Ux, Ox] = j.split([
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
let Gs = class extends Mi {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: l, Fl: b, Gh: p, Gl: x, Hh: w, Hl: v } = this;
    return [e, n, r, s, o, i, a, c, u, h, l, b, p, x, w, v];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, c, u, h, l, b, p, x, w, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = b | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let y = 0; y < 16; y++, n += 4)
      He[y] = e.getUint32(n), Le[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const $ = He[y - 15] | 0, A = Le[y - 15] | 0, P = j.rotrSH($, A, 1) ^ j.rotrSH($, A, 8) ^ j.shrSH($, A, 7), F = j.rotrSL($, A, 1) ^ j.rotrSL($, A, 8) ^ j.shrSL($, A, 7), U = He[y - 2] | 0, C = Le[y - 2] | 0, g = j.rotrSH(U, C, 19) ^ j.rotrBH(U, C, 61) ^ j.shrSH(U, C, 6), E = j.rotrSL(U, C, 19) ^ j.rotrBL(U, C, 61) ^ j.shrSL(U, C, 6), L = j.add4L(F, E, Le[y - 7], Le[y - 16]), O = j.add4H(L, P, g, He[y - 7], He[y - 16]);
      He[y] = O | 0, Le[y] = L | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: b, Fh: p, Fl: x, Gh: w, Gl: v, Hh: H, Hl: k } = this;
    for (let y = 0; y < 80; y++) {
      const $ = j.rotrSH(l, b, 14) ^ j.rotrSH(l, b, 18) ^ j.rotrBH(l, b, 41), A = j.rotrSL(l, b, 14) ^ j.rotrSL(l, b, 18) ^ j.rotrBL(l, b, 41), P = l & p ^ ~l & w, F = b & x ^ ~b & v, U = j.add5L(k, A, F, Ox[y], Le[y]), C = j.add5H(U, H, $, P, Ux[y], He[y]), g = U | 0, E = j.rotrSH(r, s, 28) ^ j.rotrBH(r, s, 34) ^ j.rotrBH(r, s, 39), L = j.rotrSL(r, s, 28) ^ j.rotrBL(r, s, 34) ^ j.rotrBL(r, s, 39), O = r & o ^ r & a ^ o & a, M = s & i ^ s & c ^ i & c;
      H = w | 0, k = v | 0, w = p | 0, v = x | 0, p = l | 0, x = b | 0, { h: l, l: b } = j.add(u | 0, h | 0, C | 0, g | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const N = j.add3L(g, L, M);
      r = j.add3H(N, C, E, O), s = N | 0;
    }
    ({ h: r, l: s } = j.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = j.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = j.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = j.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: b } = j.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h: p, l: x } = j.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: w, l: v } = j.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: H, l: k } = j.add(this.Hh | 0, this.Hl | 0, H | 0, k | 0), this.set(r, s, o, i, a, c, u, h, l, b, p, x, w, v, H, k);
  }
  roundClean() {
    He.fill(0), Le.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Cx = class extends Gs {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Px = class extends Gs {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Nx = class extends Gs {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
dn(() => new Gs());
dn(() => new Cx());
dn(() => new Px());
dn(() => new Nx());
var lt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(lt || (lt = {}));
var ti;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(ti || (ti = {}));
function Vi(t) {
  return ti[t];
}
var Bs;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Bs || (Bs = {}));
function Ih(t, e, n) {
  const s = Gg;
  if (Xx(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Bs.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
function kh(t) {
  const e = Vn.c32addressDecode(t);
  return {
    type: Bs.Address,
    version: e[0],
    hash160: e[1]
  };
}
function Uh(t) {
  const e = [];
  return e.push($t(Li(t.version, 1))), e.push($t(t.hash160)), jn(e);
}
function Oh(t) {
  const e = [], n = Ar(t.content), r = n.byteLength;
  return e.push($t(Li(r, t.lengthPrefixBytes))), e.push(n), jn(e);
}
function Zt(t, e) {
  return jn([Vi(t), e]);
}
function Dx(t) {
  return new Uint8Array([Vi(t.type)]);
}
function Tx(t) {
  return t.type === lt.OptionalNone ? new Uint8Array([Vi(t.type)]) : Zt(t.type, Br(t.value));
}
function Fx(t) {
  const e = new Uint8Array(4);
  return Cs(e, Math.ceil(t.value.length / 2), 0), Zt(t.type, ce(e, $t(t.value)));
}
function Mx(t) {
  const e = kf(rb(BigInt(t.value), BigInt(Vg)), Ah);
  return Zt(t.type, e);
}
function Rx(t) {
  const e = kf(BigInt(t.value), Ah);
  return Zt(t.type, e);
}
function Gx(t) {
  return Zt(t.type, Uh(kh(t.value)));
}
function Vx(t) {
  const [e, n] = Yx(t.value);
  return Zt(t.type, ce(Uh(kh(e)), Oh(Ih(n))));
}
function zx(t) {
  return Zt(t.type, Br(t.value));
}
function Kx(t) {
  const e = [], n = new Uint8Array(4);
  Cs(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = Br(r);
    e.push(s);
  }
  return Zt(t.type, jn(e));
}
function jx(t) {
  const e = [], n = new Uint8Array(4);
  Cs(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = Ih(s);
    e.push(Oh(o));
    const i = Br(t.value[s]);
    e.push(i);
  }
  return Zt(t.type, jn(e));
}
function Ch(t, e) {
  const n = [], r = e == "ascii" ? ob(t.value) : Ar(t.value), s = new Uint8Array(4);
  return Cs(s, r.length, 0), n.push(s), n.push(r), Zt(t.type, jn(n));
}
function qx(t) {
  return Ch(t, "ascii");
}
function Wx(t) {
  return Ch(t, "utf8");
}
function zc(t) {
  return kt(Br(t));
}
function Br(t) {
  switch (t.type) {
    case lt.BoolTrue:
    case lt.BoolFalse:
      return Dx(t);
    case lt.OptionalNone:
    case lt.OptionalSome:
      return Tx(t);
    case lt.Buffer:
      return Fx(t);
    case lt.UInt:
      return Rx(t);
    case lt.Int:
      return Mx(t);
    case lt.PrincipalStandard:
      return Gx(t);
    case lt.PrincipalContract:
      return Vx(t);
    case lt.ResponseOk:
    case lt.ResponseErr:
      return zx(t);
    case lt.List:
      return Kx(t);
    case lt.Tuple:
      return jx(t);
    case lt.StringASCII:
      return qx(t);
    case lt.StringUTF8:
      return Wx(t);
    default:
      throw new Kg("Unable to serialize. Invalid Clarity Value.");
  }
}
const Xx = (t, e) => t ? Ar(t).length > e : !1;
function Yx(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
function Jx(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = pr(r);
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
    return BigInt(`0x${tw(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function zi(t, e = 8) {
  return (typeof t == "bigint" ? t : Jx(t)).toString(16).padStart(e * 2, "0");
}
function Ph(t, e = 16) {
  const n = zi(t, e);
  return pr(n);
}
function Zx(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const Qx = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function tw(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Qx[n];
  return e;
}
function pr(t) {
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
function Ki(t) {
  return new TextEncoder().encode(t);
}
function ew(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function nw(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Kc(t) {
  if (t.some(nw))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function ji(...t) {
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
function qn(t) {
  return ji(...t.map((e) => typeof e == "number" ? Kc([e]) : e instanceof Array ? Kc(e) : e));
}
function Vs(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var ei;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ei || (ei = {}));
ei.Mainnet;
const rw = 128, sw = 128, Nh = 16;
var ni;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ni || (ni = {}));
var jc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(jc || (jc = {}));
var qc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(qc || (qc = {}));
var Ft;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ft || (Ft = {}));
const Ao = ["onChainOnly", "offChainOnly", "any"];
Ao[0] + "", Ft.OnChainOnly, Ao[1] + "", Ft.OffChainOnly, Ao[2] + "", Ft.Any, Ft.OnChainOnly + "", Ft.OnChainOnly, Ft.OffChainOnly + "", Ft.OffChainOnly, Ft.Any + "", Ft.Any;
var ri;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ri || (ri = {}));
ri.Mainnet;
var Wc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Wc || (Wc = {}));
var Xc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Xc || (Xc = {}));
var Yc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Yc || (Yc = {}));
var Jc;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Jc || (Jc = {}));
var Zc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Zc || (Zc = {}));
var Qc;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Qc || (Qc = {}));
var tl;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(tl || (tl = {}));
var el;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(el || (el = {}));
var nl;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(nl || (nl = {}));
var rl;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(rl || (rl = {}));
var sl;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(sl || (sl = {}));
function si(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function ow(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Dh(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function iw(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  si(t.outputLen), si(t.blockLen);
}
function aw(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function cw(t, e) {
  Dh(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const vo = {
  number: si,
  bool: ow,
  bytes: Dh,
  hash: iw,
  exists: aw,
  output: cw
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Bo = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Kt = (t, e) => t << 32 - e | t >>> e, lw = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!lw)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function fw(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Th(t) {
  if (typeof t == "string" && (t = fw(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class hw {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function pn(t) {
  const e = (r) => t().update(Th(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function uw(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + u, a, r);
}
class qi extends hw {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Bo(this.buffer);
  }
  update(e) {
    vo.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Th(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Bo(e);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    vo.exists(this), vo.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let l = i; l < s; l++)
      n[l] = 0;
    uw(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Bo(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, h[l], o);
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
const dw = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Fh = Uint8Array.from({ length: 16 }, (t, e) => e), pw = Fh.map((t) => (9 * t + 5) % 16);
let Wi = [Fh], Xi = [pw];
for (let t = 0; t < 4; t++)
  for (let e of [Wi, Xi])
    e.push(e[t].map((n) => dw[n]));
const Mh = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), bw = Wi.map((t, e) => t.map((n) => Mh[e][n])), gw = Xi.map((t, e) => t.map((n) => Mh[e][n])), xw = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), ww = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), rs = (t, e) => t << e | t >>> 32 - e;
function ol(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ss = new Uint32Array(16);
class yw extends qi {
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
    for (let p = 0; p < 16; p++, n += 4)
      ss[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, l = this.h4 | 0, b = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, w = xw[p], v = ww[p], H = Wi[p], k = Xi[p], y = bw[p], $ = gw[p];
      for (let A = 0; A < 16; A++) {
        const P = rs(r + ol(p, o, a, u) + ss[H[A]] + w, y[A]) + l | 0;
        r = l, l = u, u = rs(a, 10) | 0, a = o, o = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = rs(s + ol(x, i, c, h) + ss[k[A]] + v, $[A]) + b | 0;
        s = b, b = h, h = rs(c, 10) | 0, c = i, i = P;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + b | 0, this.h3 + l + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    ss.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
pn(() => new yw());
const mw = (t, e, n) => t & e ^ ~t & n, Sw = (t, e, n) => t & e ^ t & n ^ e & n, Ew = new Uint32Array([
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
]), ke = new Uint32Array(64);
class Rh extends qi {
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
      ke[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = ke[l - 15], p = ke[l - 2], x = Kt(b, 7) ^ Kt(b, 18) ^ b >>> 3, w = Kt(p, 17) ^ Kt(p, 19) ^ p >>> 10;
      ke[l] = w + ke[l - 7] + x + ke[l - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const b = Kt(a, 6) ^ Kt(a, 11) ^ Kt(a, 25), p = h + b + mw(a, c, u) + Ew[l] + ke[l] | 0, w = (Kt(r, 2) ^ Kt(r, 13) ^ Kt(r, 22)) + Sw(r, s, o) | 0;
      h = u, u = c, c = a, a = i + p | 0, i = o, o = s, s = r, r = p + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    ke.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class Aw extends Rh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
pn(() => new Rh());
pn(() => new Aw());
const os = BigInt(2 ** 32 - 1), oi = BigInt(32);
function Gh(t, e = !1) {
  return e ? { h: Number(t & os), l: Number(t >> oi & os) } : { h: Number(t >> oi & os) | 0, l: Number(t & os) | 0 };
}
function vw(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = Gh(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const Bw = (t, e) => BigInt(t >>> 0) << oi | BigInt(e >>> 0), $w = (t, e, n) => t >>> n, _w = (t, e, n) => t << 32 - n | e >>> n, Hw = (t, e, n) => t >>> n | e << 32 - n, Lw = (t, e, n) => t << 32 - n | e >>> n, Iw = (t, e, n) => t << 64 - n | e >>> n - 32, kw = (t, e, n) => t >>> n - 32 | e << 64 - n, Uw = (t, e) => e, Ow = (t, e) => t, Cw = (t, e, n) => t << n | e >>> 32 - n, Pw = (t, e, n) => e << n | t >>> 32 - n, Nw = (t, e, n) => e << n - 32 | t >>> 64 - n, Dw = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Tw(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Fw = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Mw = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Rw = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Gw = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Vw = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), zw = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, q = {
  fromBig: Gh,
  split: vw,
  toBig: Bw,
  shrSH: $w,
  shrSL: _w,
  rotrSH: Hw,
  rotrSL: Lw,
  rotrBH: Iw,
  rotrBL: kw,
  rotr32H: Uw,
  rotr32L: Ow,
  rotlSH: Cw,
  rotlSL: Pw,
  rotlBH: Nw,
  rotlBL: Dw,
  add: Tw,
  add3L: Fw,
  add3H: Mw,
  add4L: Rw,
  add4H: Gw,
  add5H: zw,
  add5L: Vw
}, [Kw, jw] = q.split([
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
class zs extends qi {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: l, Fl: b, Gh: p, Gl: x, Hh: w, Hl: v } = this;
    return [e, n, r, s, o, i, a, c, u, h, l, b, p, x, w, v];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, c, u, h, l, b, p, x, w, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = b | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let y = 0; y < 16; y++, n += 4)
      Ue[y] = e.getUint32(n), Oe[y] = e.getUint32(n += 4);
    for (let y = 16; y < 80; y++) {
      const $ = Ue[y - 15] | 0, A = Oe[y - 15] | 0, P = q.rotrSH($, A, 1) ^ q.rotrSH($, A, 8) ^ q.shrSH($, A, 7), F = q.rotrSL($, A, 1) ^ q.rotrSL($, A, 8) ^ q.shrSL($, A, 7), U = Ue[y - 2] | 0, C = Oe[y - 2] | 0, g = q.rotrSH(U, C, 19) ^ q.rotrBH(U, C, 61) ^ q.shrSH(U, C, 6), E = q.rotrSL(U, C, 19) ^ q.rotrBL(U, C, 61) ^ q.shrSL(U, C, 6), L = q.add4L(F, E, Oe[y - 7], Oe[y - 16]), O = q.add4H(L, P, g, Ue[y - 7], Ue[y - 16]);
      Ue[y] = O | 0, Oe[y] = L | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: b, Fh: p, Fl: x, Gh: w, Gl: v, Hh: H, Hl: k } = this;
    for (let y = 0; y < 80; y++) {
      const $ = q.rotrSH(l, b, 14) ^ q.rotrSH(l, b, 18) ^ q.rotrBH(l, b, 41), A = q.rotrSL(l, b, 14) ^ q.rotrSL(l, b, 18) ^ q.rotrBL(l, b, 41), P = l & p ^ ~l & w, F = b & x ^ ~b & v, U = q.add5L(k, A, F, jw[y], Oe[y]), C = q.add5H(U, H, $, P, Kw[y], Ue[y]), g = U | 0, E = q.rotrSH(r, s, 28) ^ q.rotrBH(r, s, 34) ^ q.rotrBH(r, s, 39), L = q.rotrSL(r, s, 28) ^ q.rotrBL(r, s, 34) ^ q.rotrBL(r, s, 39), O = r & o ^ r & a ^ o & a, M = s & i ^ s & c ^ i & c;
      H = w | 0, k = v | 0, w = p | 0, v = x | 0, p = l | 0, x = b | 0, { h: l, l: b } = q.add(u | 0, h | 0, C | 0, g | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const N = q.add3L(g, L, M);
      r = q.add3H(N, C, E, O), s = N | 0;
    }
    ({ h: r, l: s } = q.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = q.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = q.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = q.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: b } = q.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h: p, l: x } = q.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: w, l: v } = q.add(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: H, l: k } = q.add(this.Hh | 0, this.Hl | 0, H | 0, k | 0), this.set(r, s, o, i, a, c, u, h, l, b, p, x, w, v, H, k);
  }
  roundClean() {
    Ue.fill(0), Oe.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class qw extends zs {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class Ww extends zs {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class Xw extends zs {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
pn(() => new zs());
pn(() => new qw());
pn(() => new Ww());
pn(() => new Xw());
function Yw(t, e, n) {
  const s = rw;
  if (hy(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ni.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var ft;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(ft || (ft = {}));
class Jw extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Zw extends Jw {
  constructor(e) {
    super(e);
  }
}
function Vh(t) {
  const e = [];
  return e.push(pr(zi(t.version, 1))), e.push(pr(t.hash160)), qn(e);
}
function zh(t) {
  const e = [], n = Ki(t.content), r = n.byteLength;
  return e.push(pr(zi(r, t.lengthPrefixBytes))), e.push(n), qn(e);
}
function Qt(t, e) {
  return qn([t, e]);
}
function Qw(t) {
  return new Uint8Array([t.type]);
}
function ty(t) {
  return t.type === ft.OptionalNone ? new Uint8Array([t.type]) : Qt(t.type, Mn(t.value));
}
function ey(t) {
  const e = new Uint8Array(4);
  return Vs(e, t.buffer.length, 0), Qt(t.type, ji(e, t.buffer));
}
function ny(t) {
  const e = Ph(Zx(t.value, BigInt(sw)), Nh);
  return Qt(t.type, e);
}
function ry(t) {
  const e = Ph(t.value, Nh);
  return Qt(t.type, e);
}
function sy(t) {
  return Qt(t.type, Vh(t.address));
}
function oy(t) {
  return Qt(t.type, ji(Vh(t.address), zh(t.contractName)));
}
function iy(t) {
  return Qt(t.type, Mn(t.value));
}
function ay(t) {
  const e = [], n = new Uint8Array(4);
  Vs(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Mn(r);
    e.push(s);
  }
  return Qt(t.type, qn(e));
}
function cy(t) {
  const e = [], n = new Uint8Array(4);
  Vs(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = Yw(s);
    e.push(zh(o));
    const i = Mn(t.data[s]);
    e.push(i);
  }
  return Qt(t.type, qn(e));
}
function Kh(t, e) {
  const n = [], r = e == "ascii" ? ew(t.data) : Ki(t.data), s = new Uint8Array(4);
  return Vs(s, r.length, 0), n.push(s), n.push(r), Qt(t.type, qn(n));
}
function ly(t) {
  return Kh(t, "ascii");
}
function fy(t) {
  return Kh(t, "utf8");
}
function Mn(t) {
  switch (t.type) {
    case ft.BoolTrue:
    case ft.BoolFalse:
      return Qw(t);
    case ft.OptionalNone:
    case ft.OptionalSome:
      return ty(t);
    case ft.Buffer:
      return ey(t);
    case ft.UInt:
      return ry(t);
    case ft.Int:
      return ny(t);
    case ft.PrincipalStandard:
      return sy(t);
    case ft.PrincipalContract:
      return oy(t);
    case ft.ResponseOk:
    case ft.ResponseErr:
      return iy(t);
    case ft.List:
      return ay(t);
    case ft.Tuple:
      return cy(t);
    case ft.StringASCII:
      return ly(t);
    case ft.StringUTF8:
      return fy(t);
    default:
      throw new Zw("Unable to serialize. Invalid Clarity Value.");
  }
}
const hy = (t, e) => t ? Ki(t).length > e : !1;
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var uy = Object.defineProperty, dy = Object.defineProperties, py = Object.getOwnPropertyDescriptors, $s = Object.getOwnPropertySymbols, jh = Object.prototype.hasOwnProperty, qh = Object.prototype.propertyIsEnumerable, il = (t, e, n) => e in t ? uy(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, ii = (t, e) => {
  for (var n in e || (e = {})) jh.call(e, n) && il(t, n, e[n]);
  if ($s) for (var n of $s(e)) qh.call(e, n) && il(t, n, e[n]);
  return t;
}, ai = (t, e) => dy(t, py(e)), by = (t, e) => {
  var n = {};
  for (var r in t) jh.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && $s) for (var r of $s(t)) e.indexOf(r) < 0 && qh.call(t, r) && (n[r] = t[r]);
  return n;
};
function gy(t) {
  return t ? typeof t == "string" ? cn.fromName(t) : "version" in t ? t : "url" in t ? new Xo({ url: t.url }) : t.transactionVersion === vs.Mainnet ? new Xo({ url: t.client.baseUrl }) : new Yo({ url: t.client.baseUrl }) : new Yo();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var xy = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(xy || {}), wy = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(wy || {}), Wh = (t) => {
  let e = t;
  if (!e) {
    let n = new Of(["store_write"], document.location.href);
    e = new Wo({ appConfig: n });
  }
  return e;
};
function yy(t) {
  try {
    return Wh(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var my = (t) => {
  let e = Wh(t).loadUserData().appPrivateKey, n = xt.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function Xh(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? ai(ii({}, t), { message: zc(e), domain: zc(n) }) : ai(ii({}, t), { message: kt(Mn(e)), domain: kt(Mn(n)) });
}
async function Sy(t, e) {
  return new xt.TokenSigner("ES256k", e).signAsync(Xh(t));
}
async function Ey(t) {
  let e = t, { userSession: n } = e, r = by(e, ["userSession"]);
  if (yy(n)) {
    let { privateKey: s, publicKey: o } = my(n), i = ai(ii({}, r), { publicKey: o });
    return Sy(i, s);
  }
  return xt.createUnsecuredToken(Xh(t));
}
var Ay = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(Ay || {}), Yh = "asigna-stx", al = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === Yh && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(By(t, e), "*");
}), vy = { authenticationRequest: async (t) => al(t, "authenticationRequest"), transactionRequest: async (t) => al(t, "transactionRequest") }, By = (t, e) => ({ source: Yh, [e]: t }), $y = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = vy);
};
$y();
const _y = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], Yi = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Ks = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, lr = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, Hy = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Jh = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((o) => Hy(o, r)) === s
  );
}, Ly = (t) => t ? Jh(Ks()).some(
  (e) => {
    var n;
    return e.id === t && (Yi(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Iy = () => {
  if (typeof window > "u")
    return;
  const t = Ks(), e = Jh(t).filter(
    (n) => {
      var r;
      return Yi(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = lr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of _y) {
    const r = lr(t, n) ?? (t === window ? void 0 : lr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, ky = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Ks(), n = lr(e, t) ?? (e === window ? void 0 : lr(window, t)) ?? kg(t);
  if (n)
    return n;
  if (Yi(t) || Ly(t))
    return Iy();
}, Uy = ["blockstack-session", "blockstack"], Oy = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of Uy) {
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
Oy();
const Cy = () => Sh(), Py = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = Sh(), e = t ? ky(t) : void 0;
  if (e)
    return e;
  const n = Ks() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, Ny = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), cl = (t) => Hf(t).replace(/^0x/, ""), ll = "This wallet cannot sign messages. Try Xverse or Leather.", fl = (t) => typeof (t == null ? void 0 : t.request) == "function", hl = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", Dy = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, Ty = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function Fy(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: cl(e.message),
    domain: cl(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function My(t, e) {
  const n = await Ey({
    domain: e.domain,
    message: e.message,
    network: gy(e.network),
    stxAddress: e.stxAddress,
    appDetails: e.appDetails ?? Ny()
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Ry(t) {
  var s, o;
  const e = Cy() || "", n = /xverse/i.test(e);
  let r = Py();
  if (n && !hl(r)) {
    const i = window;
    r = ((s = i.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((o = i.xverseProviders) == null ? void 0 : o.StacksProvider);
  }
  if (hl(r))
    try {
      return await My(r, t);
    } catch (i) {
      if (n || !fl(r) || !Ty(i)) throw i;
    }
  if (!n && fl(r))
    try {
      return await Fy(r, t);
    } catch (i) {
      throw Dy(i) ? new Error(ll) : i;
    }
  throw new Error(ll);
}
function Gy(t, e, n = {}) {
  const r = n.retryAfterMs ?? 3e4, s = n.now ?? Date.now, o = /* @__PURE__ */ new Map(), i = (a, c) => {
    c.pending = !0, c.failedAt = void 0, Promise.resolve().then(() => t(a)).then((u) => {
      c.pending = !1, u && (c.name = u, e());
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
const Vy = {}, zy = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, Ky = (t) => {
  const e = Vy;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, jy = (t) => `/hiro/${t}`, qy = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, Wy = (t) => {
  const e = Ky(t);
  if (e)
    return [qy(e)];
  const n = zy[t];
  return typeof window < "u" ? [`${window.location.origin}${jy(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, Xy = {}, ul = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, Yy = "xtrata.log.enabled", Jy = "xtrata.log.level", Zy = "xtrata.log.tags", Qy = "xtrata.log.dedupe", is = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, tm = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, em = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, nm = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, rm = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, sm = () => {
  const t = Xy ?? {}, e = is(Yy) ?? t.VITE_LOG_ENABLED, n = is(Jy) ?? t.VITE_LOG_LEVEL, r = is(Zy) ?? t.VITE_LOG_TAGS, s = is(Qy) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: tm(e),
    level: em(n) ?? "warn",
    tags: rm(r),
    dedupe: nm(s)
  };
}, om = (t, e, n) => !t.enabled || ul[n] < ul[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), im = (t, e, n, r) => {
  const s = sm();
  if (!om(s, e, t) || cm(s.dedupe))
    return;
  const o = `[xtrata:${e}] ${n}`, i = console[t] ?? console.log;
  r !== void 0 ? i(o, r) : i(o);
}, am = /* @__PURE__ */ new Set();
let dl = null;
const cm = (t, e, n, r, s) => (dl !== t && (am.clear(), dl = t), !1), lm = (t, e, n) => im("debug", t, e, n), fm = {}, hm = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, um = (t) => {
  const e = fm, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : hm[t];
}, dm = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, pm = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return dm.test(n) ? n : null;
}, bm = (t) => t.replace(/\/+$/, ""), gm = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), pl = (t) => {
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
}, vn = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, xm = (t) => {
  var c, u;
  let e;
  try {
    e = Bn(Vp(t));
  } catch {
    return null;
  }
  const n = vn(e);
  if (!n || n.success === !1)
    return null;
  const r = vn(n.value), s = vn(r == null ? void 0 : r.value), o = vn(s == null ? void 0 : s.value);
  if (!o)
    return null;
  const i = pl((c = vn(o.name)) == null ? void 0 : c.value), a = pl((u = vn(o.namespace)) == null ? void 0 : u.value);
  return !i || !a ? null : pm(`${i}.${a}`);
}, wm = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${bm(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [Hf(up(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const o = await s.json();
  return !(o != null && o.okay) || typeof o.result != "string" ? null : xm(o.result);
}, ym = async (t) => {
  const e = t.address.trim();
  if (!zp(e))
    return null;
  const n = um(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of Wy(t.network))
    try {
      return await wm({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (o) {
      r = o;
    }
  return lm("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: gm(r)
  }), null;
}, mm = "ParallaX Casino", Sm = "ParallaX Casino room sign-in. This is free: it sends no transaction, costs no fees and gives no permission to spend anything.";
new TextEncoder();
new TextDecoder();
const Em = (t) => t === "mainnet" ? 1 : 2147483648, Am = (t) => `${Sm} Account ${t.address}. Valid until ${new Date(t.expires).toISOString().replace(".000Z", "Z")}. Request code ${t.nonce}.`, vm = (t) => ({
  domain: Ef({
    name: hs(mm),
    version: hs("1"),
    "chain-id": Sf(Em(t.network))
  }),
  message: hs(Am(t))
}), as = (t) => !!t && typeof t.request == "function", Ji = () => {
  try {
    const t = window.top;
    if (t && t !== window.self && t.location.origin === window.location.origin) return t;
  } catch {
  }
  return window;
}, Bm = () => {
  const t = Ji();
  return t === window ? [window] : [t, window];
}, bl = (t) => {
  for (const e of Bm()) {
    const n = t(e);
    if (n) return n;
  }
  return null;
}, $m = (t) => {
  if (t === "leather") {
    const n = bl((r) => as(r.LeatherProvider) ? r.LeatherProvider : null);
    return n ? { rpc: n } : null;
  }
  const e = bl((n) => {
    const r = n.XverseProviders || n.xverseProviders;
    return r && (as(r.BitcoinProvider) || as(r.StacksProvider)) ? r : null;
  });
  return e ? { rpc: as(e.BitcoinProvider) ? e.BitcoinProvider : e.StacksProvider } : null;
}, _m = (t, e) => new Promise((n) => {
  const r = Date.now();
  (function s() {
    const o = $m(t);
    o || Date.now() - r >= e ? n(o) : window.setTimeout(s, 150);
  })();
}), _s = (t) => {
  var e;
  return (t == null ? void 0 : t.code) ?? ((e = t == null ? void 0 : t.error) == null ? void 0 : e.code);
}, tn = (t) => {
  var e;
  return String((t == null ? void 0 : t.message) ?? ((e = t == null ? void 0 : t.error) == null ? void 0 : e.message) ?? t ?? "unknown error");
}, Hm = (t) => [4001, -31001].includes(Number(_s(t))) || /cancel|denied|reject|declin|closed/i.test(tn(t)), gl = (t) => Number(_s(t)) === -32601 || /not supported|method not found|unsupported|not implemented|legacy method/i.test(tn(t)), $o = async (t, e, n) => {
  const r = n === void 0 ? await t.request(e) : await t.request(e, n);
  if (r && typeof r == "object") {
    if (r.error) throw Object.assign(new Error(tn(r.error)), { code: _s(r.error) });
    if (r.status === "error") throw Object.assign(new Error(tn(r.error || r)), { code: _s(r.error || r) });
    if ("result" in r) return r.result;
  }
  return r;
}, Lm = (t) => new Promise((e, n) => {
  const r = window.setTimeout(() => n(new Error("The wallet did not answer. Check its window.")), 9e4);
  t.then((s) => {
    window.clearTimeout(r), e(s);
  }, (s) => {
    window.clearTimeout(r), n(s);
  });
}), Im = (t) => (JSON.stringify(t) || "").match(/S[PT][0-9A-HJKMNP-TV-Z]{38,39}/g) || [], Ce = [], br = () => {
  const t = Ji().ParallaxCasinoWalletUI ?? window.ParallaxCasinoWalletUI;
  try {
    return t && t.available() ? t : null;
  } catch {
    return null;
  }
}, km = (t) => {
  const e = Ji().ParallaxPasskeyWallet ?? window.ParallaxPasskeyWallet;
  return e != null && e.signRoomJoin ? e.signRoomJoin(t) : Promise.reject(new Error("The casino wallet is not loaded. Reload the page."));
};
async function Um(t) {
  if (t === "casino") {
    const s = br();
    if (!s) throw new Error("The casino wallet is not available here yet. Reload the page.");
    const o = await s.open();
    if (!o) throw new Error("The casino wallet did not open.");
    return { kind: t, address: o, network: o.startsWith("SP") ? "mainnet" : "testnet", via: "casino-wallet" };
  }
  const e = await _m(t, 1500);
  if (!e) throw new Error(`${t === "leather" ? "Leather" : "Xverse"} was not found in this browser.`);
  Ce.length = 0;
  let n;
  if (t === "xverse") {
    try {
      await $o(e.rpc, "wallet_disconnect"), Ce.push("wallet_disconnect: ok");
    } catch (s) {
      Ce.push("wallet_disconnect: " + tn(s).slice(0, 80));
    }
    n = ["wallet_connect", "wallet_getAccount"];
  } else
    n = ["getAddresses", "stx_getAccounts", "stx_getAddresses", "stx_requestAccounts"];
  let r = null;
  for (const s of n)
    try {
      const o = await (t === "xverse" ? Lm($o(e.rpc, s)) : $o(e.rpc, s)), i = Im(o);
      if (i.length) {
        const a = i[0];
        return Ce.push(`${s}: ok`), { kind: t, address: a, network: a.startsWith("SP") ? "mainnet" : "testnet", via: s };
      }
      Ce.push(`${s}: answered but no Stacks address in it`);
    } catch (o) {
      if (Hm(o))
        throw Ce.push(`${s}: cancelled`), new Error("Connection cancelled.");
      Ce.push(`${s}: ${gl(o) ? "not supported" : tn(o).slice(0, 80)}`), gl(o) || (r = o);
    }
  throw new Error(r ? tn(r) : "The wallet did not share a Stacks address.");
}
const Zh = (t) => {
  t !== "casino" && Ug(t === "leather" ? "LeatherProvider" : "XverseProviders.BitcoinProvider");
}, Hs = (t) => t instanceof Error ? t.message : String(t), _o = 500, Qh = 40, Om = 2e3, gr = 280, xl = "px_room_blocks_v1", wl = "px_chat_ui_v1", Ho = "px_chat_session_v1:", yl = { hidden: !1, side: "left" }, Cm = [
  { code: "spam", label: "Spam" },
  { code: "abuse", label: "Abuse" },
  { code: "scam", label: "Scam" },
  { code: "other", label: "Something else" }
], Pm = (t) => {
  if (!Array.isArray(t)) return [];
  const e = [];
  for (const n of t)
    if (!(typeof n != "string" || !/^S[A-Z0-9]{19,60}$/.test(n) || e.includes(n)) && (e.push(n), e.length >= Qh))
      break;
  return e;
}, Nm = (t) => {
  if (!t) return [];
  try {
    return Pm(JSON.parse(t));
  } catch {
    return [];
  }
}, Dm = (t) => {
  if (!t) return { ...yl };
  try {
    const e = JSON.parse(t);
    return { hidden: (e == null ? void 0 : e.hidden) === !0, side: (e == null ? void 0 : e.side) === "right" ? "right" : "left" };
  } catch {
    return { ...yl };
  }
}, t0 = {
  "no-links": "Links are not allowed in messages.",
  "too-long": `That message is too long (${gr} characters at most).`,
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
}, Tm = (t) => typeof t == "string" && Object.prototype.hasOwnProperty.call(t0, t), nr = (t) => t0[String(t)] ?? "The room could not take that. Try again in a moment.", Fm = (t) => t.replace(/\s+/g, " ").trim(), Mm = (t) => Array.from(t).length, Rm = (t, e) => {
  const n = Fm(t);
  return e.signed ? e.connected ? n ? Mm(n) > gr ? { ok: !1, code: "too-long" } : e.now - e.lastSentAt < Om ? { ok: !1, code: "slow-down" } : { ok: !0, text: n } : { ok: !1, code: "empty" } : { ok: !1, code: "offline" } : { ok: !1, code: "sign-in-first" };
};
class Gm {
  constructor() {
    Sn(this, "lines", []);
    Sn(this, "seq", 0);
    Sn(this, "blocked", /* @__PURE__ */ new Set());
  }
  setBlocked(e) {
    this.blocked = new Set(e);
  }
  add(e, n, r, s, o, i) {
    if (e && !r && this.blocked.has(e.a)) return null;
    const a = { id: this.seq += 1, who: e, mine: r, text: n, at: s };
    return o && (a.to = o), i && (a.tb = i), this.lines.push(a), this.lines.length > _o && this.lines.splice(0, this.lines.length - _o), a;
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
    for (const s of n.slice(-_o)) {
      if (!s || typeof s.a != "string" || typeof s.t != "string" || typeof s.at != "number") continue;
      const o = typeof s.to == "string" ? { a: s.to } : void 0;
      this.add({ a: s.a }, s.t.slice(0, gr * 2), s.m === 1, s.at, o) && (r += 1);
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
class Vm {
  constructor() {
    Sn(this, "people", /* @__PURE__ */ new Map());
    Sn(this, "known", !1);
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
const zm = `
.pxaddr{display:flex;flex-direction:column;gap:6px;margin:4px 0 8px}
.pxaddr .r{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;padding:6px 8px;border-radius:8px;background:rgba(255,255,255,.04);border:1px solid rgba(227,184,74,.25)}
.pxaddr .k{flex:1 1 100%;font-size:11px;letter-spacing:.03em;color:var(--dim,#c9b894)}
.pxaddr code{flex:1 1 0;min-width:0;font:12px/1.35 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:var(--ink,#f6ead0);overflow-wrap:anywhere;word-break:break-all;user-select:all;-webkit-user-select:all}
:is(#pxroom-panel,#pxchat,body) .pxaddr button{flex:0 0 auto;margin:0;font:inherit;font-size:12px;cursor:pointer;padding:5px 10px;border-radius:7px;background:rgba(12,9,14,.82);color:var(--ink,#f6ead0);border:1px solid rgba(227,184,74,.55)}
:is(#pxroom-panel,#pxchat,body) .pxaddr button:hover{background:rgba(227,184,74,.22)}
:is(#pxroom-panel,#pxchat,body) .pxaddr button.ok{background:rgba(70,140,90,.35);border-color:#9fd7b0}
`;
let ml = !1;
function Km() {
  if (ml) return;
  ml = !0;
  const t = document.createElement("style");
  t.textContent = zm, document.head.append(t);
}
async function jm(t, e) {
  var n;
  try {
    if ((n = navigator.clipboard) != null && n.writeText)
      return await navigator.clipboard.writeText(t), !0;
  } catch {
  }
  try {
    const r = window.getSelection(), s = document.createRange();
    let o = null;
    e ? s.selectNodeContents(e) : (o = document.createElement("textarea"), o.value = t, o.style.cssText = "position:fixed;left:-9999px;top:0", document.body.append(o), o.select()), e && r && (r.removeAllRanges(), r.addRange(s));
    const i = document.execCommand("copy");
    return o == null || o.remove(), i;
  } catch {
    return !1;
  }
}
const rr = (t, e, n) => {
  const r = document.createElement(t);
  return e !== void 0 && (r.textContent = e), n && (r.className = n), r;
};
function Sl(t, e) {
  const n = rr("div", void 0, "r"), r = rr("code", e), s = rr("button", "Copy");
  s.type = "button", s.setAttribute("aria-label", `Copy ${t.toLowerCase()}`);
  let o = 0;
  return s.onclick = async (i) => {
    i.stopPropagation();
    const a = await jm(e, r);
    s.textContent = a ? "Copied ✓" : "Select it and copy", s.classList.toggle("ok", a), window.clearTimeout(o), o = window.setTimeout(() => {
      s.textContent = "Copy", s.classList.remove("ok");
    }, 1800);
  }, n.append(rr("span", t, "k"), r, s), n;
}
function e0(t, e) {
  Km();
  const n = rr("div", void 0, "pxaddr"), r = /^S[TN]/.test(t);
  let s = null;
  if (r && e)
    try {
      s = e(t);
    } catch {
      s = null;
    }
  return n.append(Sl(r ? "Testnet address · what the casino plays with" : "Address", t)), s && s !== t && n.append(Sl("Mainnet address (same key) · send BNS names here", s)), n;
}
const El = (t) => typeof t == "string" && /^S[PTMN][0-9A-Z]{37,41}$/.test(t), qm = `
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
`, W = (t, e, n) => {
  const r = document.createElement(t);
  return e !== void 0 && (r.textContent = e), n && (r.className = n), r;
}, Ct = (t, e, n = "sm") => {
  const r = W("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function Wm(t) {
  const e = new Gm(), n = new Vm();
  let r = { hidden: !1, side: "left" }, s = [];
  try {
    r = Dm(window.localStorage.getItem(wl)), s = Nm(window.localStorage.getItem(xl));
  } catch {
  }
  e.setBlocked(s);
  let o = !1, i = null, a = !1, c = null, u = !1, h = "", l = 0, b = 0, p = 0, x = null, w = 0, v = !0, H = null;
  const k = () => {
    try {
      window.localStorage.setItem(wl, JSON.stringify(r));
    } catch {
    }
  }, y = () => {
    try {
      window.localStorage.setItem(xl, JSON.stringify(s));
    } catch {
    }
  }, $ = (m) => t.labelFor(m), A = () => {
    if (H)
      try {
        window.sessionStorage.setItem(Ho + H, e.dump());
      } catch {
      }
  }, P = (m) => {
    if (m)
      try {
        window.sessionStorage.removeItem(Ho + m);
      } catch {
      }
  }, F = (m) => {
    if (m !== H) {
      if (P(H), e.clear(), Ht.forEach((T) => T.remove()), Ht.clear(), H = m, m)
        try {
          e.load(window.sessionStorage.getItem(Ho + m));
        } catch {
        }
      v = !0;
    }
  }, U = (m) => s.includes(m), C = document.createElement("style");
  C.textContent = qm, document.head.append(C);
  const g = W("div");
  g.id = "pxchat";
  const E = W("div");
  E.id = "pxchat-lines";
  const L = W("button", "New messages ↓", "newer");
  L.type = "button", L.hidden = !0, E.setAttribute("role", "log"), E.setAttribute("aria-live", "polite"), E.setAttribute("aria-label", "Casino chat");
  const O = W("div", void 0, "panel");
  O.id = "pxchat-menu", O.hidden = !0;
  const M = W("div", void 0, "panel");
  M.id = "pxchat-panel", M.hidden = !0;
  const N = W("form");
  N.hidden = !0;
  const ht = W("button", void 0, "to");
  ht.type = "button", ht.hidden = !0;
  const nt = W("input");
  nt.type = "text", nt.autocomplete = "off", nt.enterKeyHint = "send", nt.maxLength = gr * 2;
  const ze = W("button", "Send", "sm");
  ze.type = "submit", N.append(ht, nt, ze);
  const ot = W("div", void 0, "bar");
  ot.hidden = !0;
  const G = Ct("Here now", () => tr("people")), $r = Ct("Hide chat", () => to()), Wn = Ct("", () => {
    r.side = r.side === "left" ? "right" : "left", k(), tt();
  }), wt = Ct("Blocked", () => tr("blocked")), Ke = Ct("Table", () => {
    a = !a, i = null, tt(), o && nt.focus();
  });
  Ke.id = "pxchat-table", G.id = "pxchat-people", $r.id = "pxchat-hide", Wn.id = "pxchat-side", wt.id = "pxchat-blocked", ot.append(Ke, G, $r, Wn, wt), g.append(E, L, O, M, N, ot);
  const St = W("button");
  St.id = "pxchat-btn", St.type = "button", St.setAttribute("aria-controls", "pxchat");
  const Ht = /* @__PURE__ */ new Map(), Ws = () => o || !!c || !!h, Xs = () => {
    var m;
    return (m = window.matchMedia) != null && m.call(window, "(max-width:700px)").matches ? 5 : 8;
  }, bn = (m) => {
    const T = W("button", $(m.a), "nm");
    return T.type = "button", T.dataset.a = m.a, T.setAttribute("aria-label", `Options for ${$(m.a)}`), T.onclick = () => Qn(m), T;
  }, Ys = (m) => {
    const T = m.who ? `ln${m.mine ? " mine" : ""}${m.to ? " dm" : ""}${m.tb ? " tb" : ""}` : "ln note", J = W("div", void 0, T);
    if (!m.who)
      return J.append(W("span", m.text, "tx")), J;
    const Y = [];
    return m.to ? m.mine ? Y.push(W("span", "You", "nm"), W("span", "→", "tag"), bn(m.to)) : Y.push(bn(m.who), W("span", "→ you", "tag")) : (m.tb && Y.push(W("span", "Table", "tag")), Y.push(m.mine ? W("span", "You", "nm") : bn(m.who))), Y.push(W("span", m.text, "tx")), Y.forEach((it, ut) => {
      ut && J.append(document.createTextNode(" ")), J.append(it);
    }), J;
  }, _r = () => E.scrollTop + E.clientHeight >= E.scrollHeight - 8, Hr = () => {
    E.scrollTop = E.scrollHeight, v = !0, L.hidden = !0;
  }, Js = () => {
    const m = Ws(), T = m ? e.all() : e.tail(Xs()), J = E.classList.contains("scroll");
    E.classList.toggle("scroll", m);
    const Y = new Set(T.map((Et) => Et.id));
    let it = !1;
    for (const [Et, At] of Ht) Y.has(Et) || (At.remove(), Ht.delete(Et));
    let ut = null;
    for (const Et of T) {
      let At = Ht.get(Et.id);
      At || (At = Ys(Et), Ht.set(Et.id, At), it = !0);
      const fe = ut ? ut.nextElementSibling : E.firstElementChild;
      fe !== At && E.insertBefore(At, fe), ut = At;
    }
    if (!m) {
      L.hidden = !0, v = !0;
      return;
    }
    !J || v ? Hr() : it && (L.hidden = !1);
  }, Xn = () => {
    St.replaceChildren(W("span", "💬", "ic"), W("span", "Chat", "lbl")), r.hidden && l > 0 && St.append(W("span", l > 9 ? "9+" : String(l), b ? "dot dm" : "dot")), St.setAttribute("aria-expanded", String(o && !r.hidden)), St.setAttribute("aria-label", r.hidden && l ? `Chat: ${l} new${b ? `, ${b} sent to you` : ""}` : "Casino chat: type a message");
  }, gn = () => t.table ? t.table() : null, Yn = { blackjack: "blackjack", baccarat: "baccarat", sicbo: "Sic Bo", holdem: "Hold'em", roulette: "roulette", videopoker: "video poker", pvpholdem: "Salon Hold'em", liars: "Liar's Dice" }, Jn = () => {
    a && !gn() && (a = !1), N.hidden = !o || r.hidden, ht.hidden = !i && !a, ht.classList.toggle("tb", a && !i), i ? (ht.textContent = `To ${$(i.a)} ×`, ht.setAttribute("aria-label", `Writing to ${$(i.a)}. Press to write to the whole room instead.`)) : a && (ht.textContent = "To this table ×", ht.setAttribute("aria-label", "Writing to the people at your table. Press to write to the whole room instead.")), nt.classList.toggle("dm", !!i);
    const m = gn();
    Ke.hidden = !m, Ke.classList.toggle("on", a);
    const T = i ? `Message ${$(i.a)}` : a && m ? `Say something to the ${Yn[m] || m} table` : "Say something to the room";
    nt.placeholder = T, nt.setAttribute("aria-label", T);
  }, Zs = () => {
    if (O.replaceChildren(), O.hidden = !c, !c) return;
    const m = c, T = U(m.a), J = m.a === t.me();
    O.append(W("p", J ? `${$(m.a)} (you)` : $(m.a), "who")), El(m.a) && !u && O.append(e0(m.a, t.mainnetOf));
    const Y = W("div", void 0, "row");
    if (!J) if (u) {
      O.append(W("p", "Why? Your report goes to the casino team with the last few things they said to you or the room."));
      for (const it of Cm) Y.append(Ct(it.label, () => {
        Ur(m, it.code), We();
      }));
    } else {
      const it = Ct("Message", () => {
        We(), eo(m);
      });
      it.disabled = T || !n.has(m.a), T ? O.append(W("p", "You have blocked this person. Unblock them to message them.")) : n.known && !n.has(m.a) && O.append(W("p", "They have left the room.")), Y.append(
        it,
        Ct(T ? "Unblock" : "Block", () => {
          kr(m, !T), We();
        }),
        Ct("Report…", () => {
          u = !0, tt();
        }, "sm danger")
      );
    }
    Y.append(Ct("Cancel", We)), O.append(Y);
  }, Qs = () => {
    if (M.replaceChildren(), M.hidden = !h, h === "people") {
      const m = n.others(t.me());
      if (!n.known) M.append(W("p", t.connected() ? "Asking the room who is here…" : "Not connected to the room."));
      else if (!m.length) M.append(W("p", "Nobody else is signed in right now."));
      else {
        M.append(W("p", `Signed in now (${m.length}). Tap a name to message, block or report.`));
        for (const T of m) {
          const J = W("div", void 0, "row"), Y = W("span");
          Y.append(bn(T)), U(T.a) && Y.append(document.createTextNode(" (blocked)")), J.append(Y), M.append(J);
        }
      }
    } else if (h === "blocked") {
      if (!s.length) {
        M.append(W("p", "You have not blocked anyone."));
        return;
      }
      M.append(W("p", "Blocked people cannot reach you and you cannot reach them."));
      for (const m of s) {
        const T = W("div", void 0, "row");
        T.append(W("span", $(m)), Ct("Unblock", () => {
          kr({ a: m }, !1), tt();
        })), M.append(T);
      }
    }
  }, tt = () => {
    g.hidden = r.hidden && !c, g.classList.toggle("peek", r.hidden && !!c), g.classList.remove("left", "right"), g.classList.add(r.side), ot.hidden = !o || r.hidden;
    const m = n.others(t.me()).length;
    G.textContent = n.known ? `Here now (${m})` : "Here now", G.classList.toggle("on", h === "people"), Wn.textContent = r.side === "left" ? "Move right ▸" : "◂ Move left", wt.textContent = s.length ? `Blocked (${s.length})` : "Blocked", wt.classList.toggle("on", h === "blocked"), Xn(), Jn(), Zs(), Qs(), Js(), je();
  }, je = () => {
    const m = window.innerWidth, T = window.innerHeight, J = document.getElementById("tools"), Y = Math.round(Math.max(70, (J ? J.getBoundingClientRect().bottom : 58) + 12));
    let it = r.side === "left" ? 14 : null, ut = Math.min(340, m - 28), Et = T - Y - 12, At = !1;
    const fe = document.getElementById("intro"), Ot = fe && fe.getClientRects().length ? fe.getBoundingClientRect() : null;
    Ot && Ot.width > 0 && Ot.height > 0 && Ot.bottom > Y && (r.side === "left" ? Ot.left < 14 + ut : Ot.right > m - 14 - ut) && (r.side === "left" && m - Ot.right - 30 >= 260 ? (it = Math.round(Ot.right + 16), ut = Math.min(340, m - it - 14)) : (At = !0, Et = Math.max(170, Math.round(Ot.top - Y - 8)))), g.style.top = `${Y}px`, g.style.left = it === null ? "auto" : `${it}px`, g.style.right = it === null ? "14px" : "", g.style.width = `${ut}px`, g.style.maxHeight = `${Et}px`, g.classList.toggle("over", At && !g.hidden && (o || Ht.size > 0));
  }, pt = (m) => {
    e.add(null, m, !1, Date.now());
  }, Zn = () => {
    try {
      document.pointerLockElement && document.exitPointerLock();
    } catch {
    }
  }, Ut = () => {
    if (!t.me()) {
      r.hidden && (r.hidden = !1, k()), o = !1, pt("Join the room to chat. Anyone can watch; you need one free signature to speak."), tt(), t.joinPrompt();
      return;
    }
    r.hidden && (r.hidden = !1, k()), l = 0, b = 0, o = !0, Zn(), tt(), nt.focus();
  }, qe = () => {
    o = !1, c = null, u = !1, h = "", nt.blur(), tt();
  }, to = () => {
    r.hidden = !0, k(), o = !1, c = null, u = !1, h = "", l = 0, b = 0, nt.blur(), tt();
  }, We = () => {
    c = null, u = !1, tt();
  };
  function Qn(m) {
    c = m, u = !1, Zn(), tt();
  }
  function tr(m) {
    h = h === m ? "" : m, c = null, u = !1, tt();
  }
  function eo(m) {
    if (U(m.a)) {
      pt(nr("blocked")), tt();
      return;
    }
    i = { a: m.a }, h = "", Ut();
  }
  const Lr = () => {
    i = null, a = !1, tt(), nt.focus();
  }, Ir = () => {
    t.me() && t.send({ t: "blocks", list: s }) && (w = Date.now());
  };
  function kr(m, T) {
    const J = $(m.a);
    if (T) {
      if (s.length >= Qh) {
        pt(nr("too-many-blocks"));
        return;
      }
      s.includes(m.a) || s.push(m.a), e.dropFrom(m.a), A(), (i == null ? void 0 : i.a) === m.a && (i = null), pt(`You blocked ${J}. Neither of you will see the other's messages.`);
    } else
      s = s.filter((Y) => Y !== m.a), pt(`You unblocked ${J}.`);
    e.setBlocked(s), Ht.forEach((Y) => Y.remove()), Ht.clear(), y(), Ir();
  }
  function Ur(m, T) {
    if (!t.me() || !t.connected()) {
      pt("Not connected to the room, so the report was not sent.");
      return;
    }
    t.send({ t: "report", who: m.a, why: T, lines: e.lastFrom(m.a) }) && (w = Date.now()), pt("Sending your report…");
  }
  St.onclick = () => {
    o && !r.hidden ? qe() : Ut();
  }, ht.onclick = Lr, L.onclick = () => Hr(), E.addEventListener("scroll", () => {
    v = _r(), v && (L.hidden = !0);
  }, { passive: !0 }), E.addEventListener("wheel", (m) => {
    E.classList.contains("scroll") && m.stopPropagation();
  }, { passive: !0 }), E.addEventListener("touchmove", (m) => {
    E.classList.contains("scroll") && m.stopPropagation();
  }, { passive: !0 }), N.onsubmit = (m) => {
    m.preventDefault();
    const T = Date.now(), J = Rm(nt.value, { signed: !!t.me(), connected: t.connected(), now: T, lastSentAt: p }), Y = "Not connected to the room yet. Your message is still in the box.";
    if (!J.ok) {
      pt(J.code === "offline" ? Y : nr(J.code)), tt();
      return;
    }
    if (i && n.known && !n.has(i.a)) {
      pt(nr("not-here")), tt();
      return;
    }
    const it = i ? { t: "dm", to: i.a, text: J.text } : a && gn() ? { t: "say", text: J.text, ch: "table" } : { t: "say", text: J.text };
    if (!t.send(it)) {
      pt(Y), tt();
      return;
    }
    p = T, w = T, x = { text: J.text, to: i }, nt.value = "";
  }, nt.addEventListener("keydown", (m) => {
    m.stopPropagation(), m.key === "Escape" && (m.preventDefault(), i && !nt.value ? Lr() : qe());
  }), nt.addEventListener("keypress", (m) => m.stopPropagation()), document.addEventListener("pointerdown", (m) => {
    if (!c && !h) return;
    const T = m.target;
    T && (g.contains(T) || St.contains(T)) || (c = null, u = !1, h = "", tt());
  }), window.addEventListener("resize", je);
  const Or = document.getElementById("intro");
  Or && "MutationObserver" in window && new MutationObserver(() => je()).observe(Or, { attributes: !0, attributeFilter: ["class", "style", "hidden"] });
  const no = {
    button: St,
    mount(m) {
      m.append(g), tt();
    },
    /**
     * Someone spoke: `say` to the room or `dm` to one person. The room sends our own lines back too (to every tab of ours), so our
     * screen shows exactly what was delivered.
     */
    heard(m) {
      if (!(m != null && m.from) || typeof m.from.a != "string") return;
      const T = t.me(), J = !!T && m.from.a === T, Y = m.t === "dm" && m.to && typeof m.to.a == "string" ? { a: m.to.a } : void 0, it = m.t === "say" && m.ch === "table" && typeof m.tb == "string" ? m.tb : void 0;
      e.add({ a: m.from.a }, String(m.text ?? "").slice(0, gr * 2), J, Date.now(), Y, it) && (A(), J ? (x = null, v = !0) : r.hidden && (l += 1, Y && (b += 1)), tt());
    },
    /**
     * The room refused something. Only a refusal of something chat just sent is chat's business: the room also says "slow down" to
     * the page's own seat updates, and those must not show up as chat notes. Returns whether chat took it.
     * A refused message goes back into the box so nothing typed is lost.
     */
    failed(m) {
      return !x && Date.now() - w > 4e3 ? !1 : (x && !nt.value && (nt.value = x.text, x.to && m !== "not-here" && m !== "no-such-player" && (i = x.to)), (m === "not-here" || m === "no-such-player") && (i = null), x = null, pt(nr(m)), tt(), !0);
    },
    reported() {
      pt("Report sent. Thank you."), tt();
    },
    /** A fresh connection: the room has forgotten our block list, so hand it over again, and take its list of who is here. */
    room(m, T) {
      n.set(m), F(T ? t.me() : null), T ? Ir() : (o = !1, i = null, c = null, u = !1, h = "", nt.value = "", x = null), i && !n.has(i.a) && (i = null), tt();
    },
    joined(m) {
      n.join(m), h === "people" || c ? tt() : G.textContent = `Here now (${n.others(t.me()).length})`;
    },
    left(m) {
      n.leave(m), typeof m == "string" && (i == null ? void 0 : i.a) === m && (pt(`${$(m)} left the room.`), i = null), tt();
    },
    /** The player pressed Leave the room: their session's chat is cleared from this tab now. */
    endSession() {
      F(null), o = !1, i = null, c = null, u = !1, h = "", nt.value = "", x = null, tt();
    },
    /** The connection dropped: until the room speaks again we do not know who is here. Their chat stays: a reconnect is the same session. */
    disconnected() {
      n.forget(), tt();
    },
    /** Names learned from BNS arrive late; relabel what is already on screen. */
    refreshNames() {
      g.querySelectorAll("button.nm[data-a]").forEach((m) => {
        m.textContent = $(m.dataset.a);
      }), i && Jn();
    },
    /** Someone tapped a person in the casino (their figure or name tag): show their menu, with their address. */
    openPerson(m) {
      return El(m) ? (Qn({ a: m }), !0) : !1;
    },
    isTyping: () => o,
    debug: () => ({ typing: o, hidden: r.hidden, side: r.side, target: (i == null ? void 0 : i.a) ?? null, blocks: [...s], lines: e.size, shown: Ht.size, session: H, stick: v, people: n.others(t.me()).map((m) => m.a) })
  };
  return Xn(), no;
}
const n0 = (t) => {
  if (!/^[0-9a-f]{64}$/.test(t)) throw new Error("A round seed is 64 hex characters.");
  const e = new Uint8Array(new ArrayBuffer(32));
  for (let n = 0; n < 32; n++) e[n] = parseInt(t.slice(n * 2, n * 2 + 2), 16);
  return e;
}, Zi = (t) => {
  const e = n0(t), n = (u) => (e[u] | e[u + 1] << 8 | e[u + 2] << 16 | e[u + 3] << 24) >>> 0;
  let r = n(0) ^ n(16), s = n(4) ^ n(20), o = n(8) ^ n(24), i = n(12) ^ n(28);
  const a = () => {
    r >>>= 0, s >>>= 0, o >>>= 0, i >>>= 0;
    const u = r + s + i >>> 0;
    return i = i + 1 >>> 0, r = s ^ s >>> 9, s = o + (o << 3) >>> 0, o = o << 21 | o >>> 11, o = o + u >>> 0, u;
  };
  for (let u = 0; u < 12; u++) a();
  return { next: a, below: (u) => {
    const h = Math.floor(4294967296 / u) * u;
    for (; ; ) {
      const l = a();
      if (l < h) return l % u;
    }
  } };
}, Xm = (t) => Zi(t).below(37), Ym = ["S", "H", "D", "C"], Jm = (t, e = 6) => {
  const n = Zi(t), r = Array.from({ length: 416 }, (o, i) => i), s = [];
  for (let o = 0; o < e; o++) {
    const i = o + n.below(r.length - o), a = r[i];
    r[i] = r[o], r[o] = a;
    const c = a % 52;
    s.push({ r: 2 + c % 13, s: Ym[Math.floor(c / 13)] });
  }
  return s;
}, Zm = (t) => {
  const e = Zi(t);
  return [e.below(6) + 1, e.below(6) + 1, e.below(6) + 1];
}, Qm = () => {
  const t = globalThis.crypto;
  if (!(t != null && t.subtle)) throw new Error("WebCrypto is not available.");
  return t.subtle;
}, t3 = (t) => [...new Uint8Array(t)].map((e) => e.toString(16).padStart(2, "0")).join(""), e3 = async (t) => t3(await Qm().digest("SHA-256", n0(t))), n3 = async (t, e) => {
  try {
    return await e3(t) === e;
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
  lastBeat: 0
}, sr = (() => {
  const t = { beat: 3e4, hide: 3e5, away: 12e5, leave: 18e5 };
  try {
    const e = /[?&]roomtimes=(\d+),(\d+),(\d+),(\d+)/.exec(location.search);
    e && (t.beat = +e[1], t.hide = +e[2], t.away = +e[3], t.leave = +e[4]);
  } catch {
  }
  return t;
})();
let R = null;
const r3 = (t) => t.length <= 12 ? t : `${t.slice(0, 5)}…${t.slice(-4)}`, Qi = (t) => {
  if (t.startsWith("SP")) return t;
  const e = _i(t);
  return Do({ ...e, version: Uo.MainnetSingleSig });
}, s3 = Gy((t) => ym({ address: Qi(t), network: "mainnet" }), () => {
  xr(), Ls(), R == null || R.refreshNames();
}), en = (t) => {
  let e = null;
  try {
    e = s3.get(t);
  } catch {
  }
  return e || r3(t);
}, r0 = (t, e) => ({ key: t, label: en(t), x: e.x, z: e.z, r: e.r, at: e.at }), Ls = () => {
  var n, r;
  if (!((n = f.host) != null && n.moves) || f.service !== "ok") return;
  const t = ((r = f.you) == null ? void 0 : r.a) ?? null, e = [...f.walk.entries()].filter(([s]) => s !== t).map(([s, o]) => r0(s, o));
  try {
    f.host.moves(e);
  } catch (s) {
    console.warn("[room] the page could not draw the walkers", s);
  }
}, cs = (t, e) => {
  var n, r;
  if (e ? f.walk.set(t, e) : f.walk.delete(t), !(!((n = f.host) != null && n.move) || t === (((r = f.you) == null ? void 0 : r.a) ?? null)))
    try {
      f.host.move(e ? r0(t, e) : { key: t, off: !0 });
    } catch (s) {
      console.warn("[room] the page could not move a walker", s);
    }
}, s0 = () => {
  var t;
  !f.features.includes("move") || f.service !== "ok" || !f.connected || !f.signed || !f.you || f.you.guest || ((t = f.ws) == null ? void 0 : t.readyState) === WebSocket.OPEN && (f.ownMove ? (f.ws.send(JSON.stringify({ t: "move", ...f.ownMove })), f.ownSent = !0) : f.ownSent && (f.ws.send(JSON.stringify({ t: "move", off: !0 })), f.ownSent = !1));
}, jt = (t) => {
  var e, n;
  try {
    (n = (e = f.host) == null ? void 0 : e.on) == null || n.call(e, t);
  } catch (r) {
    console.warn("[room] the page could not take a room message", r);
  }
}, o3 = /^(react|win|daily|round|gift|pvp|table|no-table|log|bal|board|friends|tourney|card|mission)/, xr = () => {
  var n;
  if (!f.host || f.service !== "ok") return;
  const t = ((n = f.you) == null ? void 0 : n.a) ?? null, e = Object.entries(f.spots).filter(([, r]) => r.a !== t).map(([r, s]) => ({ key: s.a, spot: r, label: en(s.a), since: s.since }));
  try {
    f.host.setPeople(e);
  } catch (r) {
    console.warn("[room] the page could not draw the people", r);
  }
}, wr = async (t, e) => {
  const n = await fetch(t, { credentials: "same-origin", ...e });
  let r = null;
  try {
    r = await n.json();
  } catch {
  }
  return { res: n, body: r };
}, ci = (t) => {
  var e;
  return ((e = f.ws) == null ? void 0 : e.readyState) !== WebSocket.OPEN ? !1 : (f.ws.send(JSON.stringify(t)), f.lastSent = Date.now(), !0);
}, o0 = () => {
  var e;
  if (f.service !== "ok" || !f.connected || !f.you || f.you.guest || !f.signed || f.away) return;
  const t = ((e = Object.entries(f.spots).find(([, n]) => n.a === f.you.a)) == null ? void 0 : e[0]) ?? null;
  f.want ? t !== f.want && f.want !== f.badSpot && f.want !== f.yielded && !f.spots[f.want] && Date.now() - f.lastSent > 1200 && ci({ t: "sit", spot: f.want }) : t && t !== f.standSent && Date.now() - f.lastSent > 600 && (f.standSent = t, ci({ t: "stand" }));
}, js = () => {
  if (f.service !== "ok" || f.ws) return;
  f.attempts += 1;
  let t;
  try {
    t = new WebSocket(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/casino/room/ws`);
  } catch {
    return Bl();
  }
  f.ws = t, t.onopen = () => {
    f.connected = !0, f.attempts = 0, st();
  }, t.onmessage = (e) => {
    var r, s, o, i, a;
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
        Ls(), f.ownSent = !1, s0(), f.standSent = null, f.signed && ((r = f.you) != null && r.guest) && (f.signed = null), R == null || R.room(n.players, !!(f.you && !f.you.guest)), f.players = /* @__PURE__ */ new Map();
        for (const c of Array.isArray(n.players) ? n.players : []) c && typeof c.a == "string" && f.players.set(c.a, { a: c.a, aw: c.aw === !0 });
        or(), f.features.includes("here") && ((s = f.ws) == null ? void 0 : s.readyState) === WebSocket.OPEN && (f.ws.send(JSON.stringify({ t: "here" })), f.away && f.signed && f.you && !f.you.guest && f.ws.send(JSON.stringify({ t: "away", on: !0 }))), jt({
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
        f.spots[n.spot] = n.who, (o = n.who) != null && o.a && f.walk.has(n.who.a) && cs(n.who.a, null);
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
        R == null || R.heard(n), n.t === "say" && jt(n);
        return;
      case "join":
        n.who && typeof n.who.a == "string" && f.players.set(n.who.a, { a: n.who.a }), R == null || R.joined(n.who), jt(n), st();
        return;
      case "leave":
        f.players.delete(n.a), or(), R == null || R.left(n.a), f.walk.has(n.a) && cs(n.a, null), jt(n), st();
        return;
      case "away":
        typeof n.a == "string" && (f.players.set(n.a, { a: n.a, aw: n.on === !0 }), or());
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
        R == null || R.reported();
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
        typeof n.a == "string" && (n.off ? cs(n.a, null) : [n.x, n.z, n.r, n.at].every((c) => typeof c == "number" && Number.isFinite(c)) && cs(n.a, { x: n.x, z: n.z, r: n.r, at: n.at }));
        return;
      case "err":
        if (typeof n.code == "string" && (n.code.startsWith("play-") || n.code.startsWith("move-")) || typeof n.code == "string" && o3.test(n.code) && (jt({ t: "err", code: n.code }), n.code !== "no-table"))
          return;
        n.code === "no-such-spot" || typeof n.code == "string" && n.code.startsWith("salon-") ? f.badSpot = f.want : Tm(n.code) && (R != null && R.failed(n.code)) || n.code === "slow-down" && (f.lastSent = Date.now() + 3e3);
        return;
      default:
        return;
    }
    xr(), o0(), st();
  }, t.onclose = (e) => {
    if (f.ws === t) {
      if (f.ws = null, f.connected = !1, f.spots = {}, xr(), f.walk = /* @__PURE__ */ new Map(), Ls(), f.ownSent = !1, f.players = /* @__PURE__ */ new Map(), or(), R == null || R.disconnected(), e.code === 4001) {
        f.replaced = !0, st();
        return;
      }
      st(), Bl();
    }
  }, t.onerror = () => {
  };
};
let Al = "";
const or = () => {
  var n, r;
  const t = [...f.players.values()].filter((s) => s.aw).map((s) => s.a).sort(), e = t.join();
  if (e !== Al) {
    Al = e;
    try {
      (r = (n = f.host) == null ? void 0 : n.awayOf) == null || r.call(n, t);
    } catch (s) {
      console.warn("[room] the page could not take who is away", s);
    }
  }
}, vl = (t) => {
  if (f.parked || !f.ws) return;
  f.parked = t;
  const e = f.ws;
  f.ws = null, f.connected = !1, window.clearTimeout(f.retryTimer);
  try {
    e.close(1e3, t);
  } catch {
  }
  f.spots = {}, xr(), f.walk = /* @__PURE__ */ new Map(), Ls(), f.ownSent = !1, f.players = /* @__PURE__ */ new Map(), or(), R == null || R.disconnected(), st();
}, i0 = () => {
  f.parked && (f.parked = "", f.attempts = 0, f.lastActive = Date.now(), js(), st());
}, a0 = (t) => {
  var e, n, r;
  if (f.away !== t) {
    if (f.away = t, ((e = f.ws) == null ? void 0 : e.readyState) === WebSocket.OPEN && f.features.includes("here") && f.signed && f.you && !f.you.guest && f.ws.send(JSON.stringify({ t: "away", on: t })), t)
      try {
        (r = (n = f.host) == null ? void 0 : n.standUp) == null || r.call(n);
      } catch (s) {
        console.warn("[room] the page could not stand the visitor up", s);
      }
    st();
  }
}, Hn = () => {
  f.lastActive = Date.now(), f.away && a0(!1), (f.parked === "idle" || f.parked === "hidden" && !document.hidden) && i0();
}, i3 = () => {
  var r;
  if (f.service !== "ok") return;
  const t = Date.now();
  if (((r = f.ws) == null ? void 0 : r.readyState) === WebSocket.OPEN && f.features.includes("here") && t - f.lastBeat >= sr.beat) {
    f.lastBeat = t;
    try {
      f.ws.send("ping");
    } catch {
    }
  }
  if (f.parked) return;
  if (document.hidden) {
    f.hiddenAt && t - f.hiddenAt > sr.hide && vl("hidden");
    return;
  }
  const e = t - f.lastActive, n = !!(f.signed && f.you && !f.you.guest);
  e > sr.leave ? vl("idle") : n && !f.away && e > sr.away && f.features.includes("here") && a0(!0);
}, Bl = () => {
  window.clearTimeout(f.retryTimer);
  const t = Math.min(15e3, 1e3 * 2 ** Math.min(f.attempts, 4));
  f.retryTimer = window.setTimeout(() => {
    f.ws || js();
  }, t);
}, qs = () => {
  const t = f.ws;
  f.ws = null, f.connected = !1, f.attempts = 0, f.replaced = !1;
  try {
    t == null || t.close(1e3, "client");
  } catch {
  }
  js();
};
async function c0(t) {
  const { res: e, body: n } = await wr(`/casino/room/challenge?address=${encodeURIComponent(t.address)}`);
  if (!e.ok) throw new Error((n == null ? void 0 : n.error) || `The room answered ${e.status}.`);
  const r = n.challenge, { domain: s, message: o } = vm(r);
  f.busy = "sign", st();
  let i;
  try {
    i = t.kind === "casino" ? await km(r) : await Ry({
      domain: s,
      message: o,
      network: r.network,
      stxAddress: t.address,
      appDetails: { name: "ParallaX Casino", icon: `${location.origin}/favicons/xtrata-apple-touch-icon.png` }
    });
  } catch (u) {
    throw new Error("The wallet did not sign: " + Hs(u));
  }
  const { res: a, body: c } = await wr("/casino/room/session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ challenge: r, signature: i })
  });
  if (!a.ok) throw new Error((c == null ? void 0 : c.error) || `The room answered ${a.status}.`);
  f.signed = { address: c.address, hash160: c.hash160, expiresAt: c.expiresAt }, qs();
}
async function a3(t) {
  var n, r;
  if (f.busy) return;
  f.error = "", f.busy = "connect", st();
  const e = t === "casino" && !((n = br()) != null && n.describe().has);
  try {
    f.wallet = await Um(t), Zh(t), await c0(f.wallet), f.open = !1, e && ((r = br()) == null || r.fundNew().catch(() => {
    }));
  } catch (s) {
    f.error = /cancel/i.test(Hs(s)) ? "" : Hs(s);
  } finally {
    f.busy = "", st();
  }
}
async function c3(t) {
  var r;
  const e = t.detail;
  if (!e || typeof e.address != "string" || f.service !== "ok" || f.busy || ((r = f.signed) == null ? void 0 : r.address) === e.address) return;
  const n = e.kind === "casino" || e.kind === "leather" || e.kind === "xverse" ? e.kind : null;
  if (n) {
    f.error = "", f.busy = "sign", st();
    try {
      f.wallet = { kind: n, address: e.address, network: e.address.startsWith("SP") ? "mainnet" : "testnet", via: "page" }, Zh(n), await c0(f.wallet), f.open = !1;
    } catch (s) {
      const o = Hs(s);
      /cancel/i.test(o) || (f.error = o, f.open = !0);
    } finally {
      f.busy = "", st();
    }
  }
}
const l3 = 2e3, f3 = () => {
  var t;
  f.prompted || f.service !== "ok" || !f.connected || f.signed || f.busy || f.open || !f.arrivedAt || Date.now() - f.arrivedAt < l3 || (t = f.host) != null && t.currentSpot() || (f.prompted = !0, f.open = !0, st());
}, h3 = () => {
  const t = br();
  let e = null;
  try {
    e = localStorage.getItem("STX_PROVIDER");
  } catch {
  }
  const n = /Xverse/.test(e || "") ? ["xverse", "leather"] : ["leather", "xverse"];
  return t ? t.describe().has || !e ? ["casino", ...n] : [n[0], "casino", n[1]] : n;
};
async function u3() {
  try {
    await wr("/casino/room/session", { method: "DELETE" });
  } catch {
  }
  f.signed = null, f.wallet = null, f.error = "", R == null || R.endSession(), R == null || R.disconnected(), qs(), st();
}
const d3 = `
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
`, X = (t, e, n) => {
  const r = document.createElement(t);
  return e !== void 0 && (r.textContent = e), n && (r.className = n), r;
}, re = (t, e) => {
  const n = X("p", void 0, "fact");
  return n.append(X("b", t), document.createTextNode(` ${e}`)), n;
};
let Pe = null, Bt = null, Wt = null;
function p3() {
  var n, r;
  if (Pe || f.service !== "ok") return;
  const t = document.createElement("style");
  t.textContent = d3, document.head.append(t), Pe = X("span"), Pe.id = "pxroom", Bt = X("button"), Bt.id = "pxroom-btn", Bt.type = "button", Bt.setAttribute("aria-label", "Casino room: see who is here and join"), Bt.onclick = () => {
    f.open = !f.open, st();
  }, Wt = X("div"), Wt.id = "pxroom-panel", Wt.hidden = !0, R = Wm({
    send: ci,
    me: () => f.you && !f.you.guest ? f.you.a : null,
    connected: () => f.connected,
    labelFor: en,
    mainnetOf: Qi,
    joinPrompt: () => {
      f.open = !0, st();
    },
    table: () => {
      var s, o;
      return f.features.includes("table") ? ((o = (s = f.host) == null ? void 0 : s.table) == null ? void 0 : o.call(s)) ?? null : null;
    }
  }), Pe.append(Bt, R.button);
  const e = ((r = (n = f.host) == null ? void 0 : n.mount) == null ? void 0 : r.call(n)) ?? document.querySelector("#tools .rt");
  e ? e.insertBefore(Pe, e.firstChild) : (Pe.style.cssText = "position:fixed;top:10px;right:10px;z-index:30", document.body.append(Pe)), document.body.append(Wt), R.mount(document.body), document.addEventListener("keydown", (s) => {
    s.key === "Escape" && f.open && (f.open = !1, st());
  }), document.addEventListener("pointerdown", (s) => {
    if (!f.open) return;
    const o = s.target;
    o && (Wt.contains(o) || Bt.contains(o)) || (f.open = !1, st());
  }), window.addEventListener("resize", () => st());
}
function b3() {
  if (!Bt || !Wt) return;
  const t = Bt.getBoundingClientRect(), e = t.height ? Math.round(t.bottom + 8) : 64;
  Wt.style.top = `${Math.min(e, Math.max(64, window.innerHeight - 220))}px`;
}
let $l;
const g3 = () => {
  var n, r;
  const t = !!(f.signed && f.you && !f.you.guest), e = t ? f.signed.address : null;
  if (e !== $l) {
    $l = e;
    try {
      (r = (n = f.host) == null ? void 0 : n.self) == null || r.call(n, { signed: t, address: e });
    } catch (s) {
      console.warn("[room] the page could not take the sign-in state", s);
    }
  }
}, l0 = () => {
  const t = f.you, e = t && !t.guest ? t.a : null;
  return f.service === "offline" ? { state: "offline", address: null, name: null } : !f.connected || !t ? { state: "connecting", address: null, name: null } : f.features.includes("salon-bns") ? t.guest || !f.signed ? { state: "guest", address: null, name: null } : t.bnsChecked !== !0 ? { state: "unchecked", address: e, name: null } : t.bns ? { state: "allowed", address: e, name: t.bns } : { state: "no-name", address: e, name: null } : { state: "unenforced", address: e, name: null };
};
let _l = "";
const f0 = () => {
  var n, r;
  const t = l0(), e = JSON.stringify(t);
  if (e !== _l) {
    _l = e;
    try {
      (r = (n = f.host) == null ? void 0 : n.salon) == null || r.call(n, t);
    } catch (s) {
      console.warn("[room] the page could not take the Salon state", s);
    }
  }
};
let Lo = !1;
const x3 = async () => {
  if (!(Lo || f.service !== "ok")) {
    Lo = !0;
    try {
      const { res: t, body: e } = await wr("/casino/room/bns", { method: "POST" });
      jt({ t: "bns-check", ok: t.ok, bns: (e == null ? void 0 : e.bns) ?? null, bnsChecked: (e == null ? void 0 : e.bnsChecked) === !0, failed: !t.ok || (e == null ? void 0 : e.failed) === !0, error: t.ok ? null : (e == null ? void 0 : e.error) || `The room answered ${t.status}.` }), t.ok && qs();
    } catch {
      jt({ t: "bns-check", ok: !1, bns: null, bnsChecked: !1, failed: !0, error: "Could not reach the room." });
    } finally {
      Lo = !1;
    }
  }
}, w3 = {
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
}, y3 = (t) => {
  var n;
  const e = (n = Object.entries(f.spots).find(([, r]) => r.a === t)) == null ? void 0 : n[0];
  if (e) {
    const r = e.split(".")[0];
    return w3[r] || r;
  }
  return f.walk.has(t) ? "walking" : "in the room";
}, Hl = (t) => {
  var s;
  const e = ((s = f.you) == null ? void 0 : s.a) ?? null, n = [...f.players.values()].sort((o, i) => o.a === e ? -1 : i.a === e ? 1 : en(o.a).localeCompare(en(i.a)));
  t.push(X("h3", `Here now · ${n.length}`));
  const r = X("div", void 0, "here");
  for (const o of n.slice(0, 50)) {
    const i = X("button", void 0, "person" + (o.aw ? " away" : ""));
    i.type = "button", i.append(X("span", en(o.a) + (o.a === e ? " (you)" : ""), "nm"), X("span", o.aw ? "away" : y3(o.a), "at")), i.onclick = () => {
      const a = { a: o.a };
      window.dispatchEvent(new CustomEvent("px-room-person", { detail: a })), a.handled && (f.open = !1, st());
    }, r.append(i);
  }
  n.length > 50 && r.append(X("p", `and ${n.length - 50} more`, "fact")), n.length || r.append(X("p", "Nobody is signed in yet.", "fact")), t.push(r, X("p", `${f.guests} watching without signing in.`, "fact"));
};
function st() {
  var r;
  if (g3(), f0(), !Pe || !Bt || !Wt) return;
  const t = !!(f.signed && f.you && !f.you.guest), e = t ? en(f.signed.address) : null;
  if (Bt.className = f.parked ? "wait" : f.away ? "away" : f.connected ? "live" : "wait", Bt.replaceChildren(X("i"), X("span", f.parked ? "Rejoin the room" : e ? f.away ? `${e} · away` : e : "Room", "lbl"), X("span", f.connected ? (r = window.matchMedia) != null && r.call(window, "(max-width:620px)").matches ? String(f.joined) : ` · ${f.joined}` : "", "n")), Bt.setAttribute("aria-label", `Casino room: ${f.connected ? `${f.joined} signed in, ` : ""}${f.parked ? "you left; tap to rejoin" : e ? `you are in as ${e}${f.away ? ", marked away" : ""}` : "see who is here and join"}`), Wt.hidden = !f.open, !f.open) return;
  b3();
  const n = [];
  if (f.parked) {
    n.push(X("h3", "Room"), X("p", f.parked === "hidden" ? "This tab was in the background for a while, so it left the room and your seat was freed." : "You were away for a while, so you left the room and your seat was freed."));
    const s = X("button", "Rejoin the room");
    s.onclick = () => {
      Hn(), i0();
    }, n.push(s);
  } else if (f.replaced) {
    n.push(X("h3", "Room"), X("p", "Another tab of yours took over the room. You are not connected here."));
    const s = X("button", "Use this tab instead");
    s.onclick = () => {
      qs(), st();
    }, n.push(s);
  } else if (t) {
    n.push(X("h3", "Connected as"), X("p", e, "who"));
    const s = { leather: "Leather", xverse: "Xverse", casino: "your casino wallet" };
    if (n.push(X("p", (f.wallet ? `With ${s[f.wallet.kind] || f.wallet.kind}. ` : "") + "Others see this name on your tag.", "fact")), f.away) {
      n.push(X("p", "You are marked away (idle for a while), so you were stood up. Do anything to come back.", "err"));
      const i = X("button", "I'm back");
      i.onclick = () => Hn(), n.push(i);
    }
    n.push(X("p", "Your address (tap Copy to share it, say for someone to send you a BNS name):"), e0(f.signed.address, Qi)), Hl(n), n.push(re("Be seen", "Sit at a table or connect to a machine and your Adrian and name tag appear there for everyone in the room. Stand up or walk away and they go too.")), n.push(re("Spaces", "Each seat and machine holds one person. If someone already has the seat you choose, you are given a free one at the same table.")), n.push(re("Live chat", "Press Chat to talk to the room and scroll back through this session. Tap a name, or Here now, to send someone a direct message, block or report them. Messages are not secret; this session's chat is kept in this tab only and cleared when you leave the room.")), f.features.includes("rounds") && n.push(re("Play together", "Roulette and baccarat are shared tables: everyone there plays the same spin or hand, dealt by the room on a timer and checked by your own browser. In the Strata Salon you can take on another player instead of the house bot.")), f.features.includes("react") && n.push(re("React", "Press 😊 to react, buy your table a round, send someone a drink or invite a friend. Table chat (the Table button in Chat) reaches only the people at your table. Sign in each day for a free daily drop of LAYR.")), n.push(X("p", "Nothing here moves any money.", "fact"));
    const o = X("button", "Leave the room");
    o.onclick = () => {
      u3();
    }, n.push(o);
  } else {
    n.push(X("h3", "Join the room")), n.push(X("p", f.connected ? f.watch ? `You are watching: ${f.joined} signed in, ${f.guests} watching.` : `${f.joined} ${f.joined === 1 ? "person is" : "people are"} in the room. Sign in to join them.` : "Connecting to the room…")), n.push(re("Be seen", f.watch ? "Join, then sit at a table or connect to a machine. Everyone in the room sees your Adrian there, with a name tag (your BNS name, or a short version of your address). Watching alone shows you to nobody." : "Join, then sit at a table or connect to a machine. Everyone in the room sees your Adrian there, with a name tag (your BNS name, or a short version of your address). Until you join you are invisible, and the room is hidden from you; the casino still plays as normal.")), f.connected && f.watch && Hl(n), n.push(re("Spaces", "Each seat and machine holds one person. If someone already has the seat you choose, you are given a free one at the same table.")), n.push(re("Live chat", "Signed-in players can chat with the room and send each other direct messages. Messages are not secret and are not saved.")), n.push(re("Free", "One signature. It sends no transaction, costs no fee and gives no permission to spend anything."));
    const s = X("div", void 0, "row"), o = br(), i = { leather: "Leather", xverse: "Xverse", casino: o ? o.describe().label : "Casino wallet" };
    for (const a of h3()) {
      const c = X("button", f.busy ? f.busy === "sign" ? "Check your wallet…" : "Connecting…" : i[a]);
      if (c.disabled = !!f.busy || !f.connected, c.onclick = () => {
        a3(a);
      }, a === "casino" && (c.style.flexBasis = "100%"), s.append(c), f.busy) break;
    }
    if (n.push(s), o && !o.describe().has && n.push(X("p", "Casino wallet: use your casino passkey from any of your devices, or make one free with Face ID or your fingerprint (500 free testnet STX and your first 1,000,000 LAYR).", "fact")), f.error && n.push(X("p", f.error, "err")), !f.busy) {
      const a = X("button", "Not now");
      a.onclick = () => {
        f.open = !1, st();
      }, n.push(a);
    }
  }
  Wt.replaceChildren(...n);
}
const m3 = (t) => {
  var n, r;
  const e = t.detail;
  !e || typeof e.spot != "string" || !Array.isArray(e.s) || typeof e.b != "number" || !f.features.includes("play") || f.service !== "ok" || !f.connected || !f.signed || !f.you || f.you.guest || ((n = f.spots[e.spot]) == null ? void 0 : n.a) === f.you.a && ((r = f.ws) == null ? void 0 : r.readyState) === WebSocket.OPEN && f.ws.send(JSON.stringify({ t: "play", spot: e.spot, s: e.s.slice(0, 8), b: e.b, f: !!e.f }));
}, S3 = (t) => {
  const e = t.detail;
  if (e) {
    if (e.off) f.ownMove = null;
    else if ([e.x, e.z, e.r].every((n) => typeof n == "number" && Number.isFinite(n))) f.ownMove = { x: e.x, z: e.z, r: e.r };
    else return;
    s0();
  }
}, Ll = {
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
}, E3 = (t) => {
  var s;
  const e = t.detail;
  if (!e || typeof e.t != "string" || !Ll[e.t]) return;
  const n = e.t === "round" || e.t === "watch" || e.t === "spec" && e.ask === !0;
  if (!(f.service === "ok" && f.connected && f.features.includes(Ll[e.t]) && (n || !!(f.signed && f.you && !f.you.guest))) || ((s = f.ws) == null ? void 0 : s.readyState) !== WebSocket.OPEN) {
    jt({ t: "unsent", msg: e });
    return;
  }
  f.ws.send(JSON.stringify(e));
}, A3 = () => {
  var e;
  const t = ((e = f.host) == null ? void 0 : e.currentSpot()) ?? null;
  t !== f.want && (f.want = t, f.yielded = null, f.standSent = null, xr()), o0();
};
async function v3() {
  const t = () => {
    f.service = "offline", f0();
  };
  try {
    const { res: e, body: n } = await wr("/casino/room/session");
    if (e.status === 503) return t();
    e.ok && (n != null && n.address) && (f.signed = { address: n.address, hash160: n.hash160, expiresAt: n.expiresAt }), f.service = "ok";
  } catch {
    return t();
  }
  p3(), st(), js(), window.setInterval(A3, 250), window.setInterval(f3, 500), window.addEventListener("px-wallet-connected", (e) => {
    c3(e);
  }), window.addEventListener("px-casino-wallet-ready", () => st()), window.addEventListener("px-room-play", m3), window.addEventListener("px-room-move", S3), window.addEventListener("px-room-send", E3), window.addEventListener("px-room-bns-check", () => {
    x3();
  }), window.setInterval(i3, 1e3);
  for (const e of ["pointerdown", "keydown", "wheel", "touchstart"]) window.addEventListener(e, Hn, { capture: !0, passive: !0 });
  window.addEventListener("px-room-play", Hn), window.addEventListener("px-room-move", Hn), document.addEventListener("visibilitychange", () => {
    document.hidden ? f.hiddenAt = Date.now() : (f.hiddenAt = 0, Hn());
  }), window.addEventListener("px-room-person", (e) => {
    const n = e.detail;
    n && R && R.openPerson(n.a) && (n.handled = !0);
  });
}
window.PXRounds = Object.freeze({ verifySeed: n3, rouletteResult: Xm, baccaratCards: Jm, sicboDice: Zm });
const Il = (t) => {
  f.host || (f.host = t, v3());
}, kl = window.PXRoomHost;
kl ? Il(kl) : window.addEventListener("px-room-host", () => Il(window.PXRoomHost), { once: !0 });
window.__pxRoom = {
  chat: () => (R == null ? void 0 : R.debug()) ?? null,
  here: () => ({ away: f.away, parked: f.parked, players: [...f.players.values()], idleFor: Date.now() - f.lastActive, times: { ...sr } }),
  get state() {
    var t;
    return { service: f.service, signed: ((t = f.signed) == null ? void 0 : t.address) ?? null, connected: f.connected, watch: f.watch, prompted: f.prompted, open: f.open, busy: f.busy, error: f.error, you: f.you, spots: f.spots, joined: f.joined, guests: f.guests, want: f.want, features: f.features.slice(), walkers: [...f.walk.keys()], ownMove: f.ownMove, salon: l0(), trail: Ce.slice() };
  }
};
