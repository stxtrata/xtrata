var Il = Object.defineProperty;
var Ul = (t, e, n) => e in t ? Il(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var bn = (t, e, n) => Ul(t, typeof e != "symbol" ? e + "" : e, n);
function Vo(t, e) {
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
    if (e) {
      const r = kl(BigInt(`0x${ne(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${ne(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Ko(t, e = 8) {
  return (typeof t == "bigint" ? t : Vo(t, !1)).toString(16).padStart(e * 2, "0");
}
function sf(t) {
  return parseInt(t, 16);
}
function of(t, e = 16) {
  const n = Ko(t, e);
  return An(n);
}
function Ol(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Cl(t, e) {
  return t & BigInt(1) << e;
}
function kl(t, e) {
  return Cl(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Pl = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ne(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Pl[n];
  return e;
}
function An(t) {
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
function sr(t) {
  return new TextEncoder().encode(t);
}
function af(t) {
  return new TextDecoder().decode(t);
}
function cf(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Nl(t) {
  return String.fromCharCode.apply(null, t);
}
function Dl(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Wi(t) {
  if (t.some(Dl))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function zo(...t) {
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
function kn(t) {
  return zo(...t.map((e) => typeof e == "number" ? Wi([e]) : e instanceof Array ? Wi(e) : e));
}
function Tl(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Fl(t, e) {
  return t[e];
}
function Ml(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function gs(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var fo;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(fo || (fo = {}));
fo.Mainnet;
const Rl = 128, Gl = 128, ff = 16;
var Qn;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Qn || (Qn = {}));
var Xi;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Xi || (Xi = {}));
var Yi;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Yi || (Yi = {}));
var Ot;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ot || (Ot = {}));
const zs = ["onChainOnly", "offChainOnly", "any"];
zs[0] + "", Ot.OnChainOnly, zs[1] + "", Ot.OffChainOnly, zs[2] + "", Ot.Any, Ot.OnChainOnly + "", Ot.OnChainOnly, Ot.OffChainOnly + "", Ot.OffChainOnly, Ot.Any + "", Ot.Any;
var ho;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ho || (ho = {}));
ho.Mainnet;
var Ji;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Ji || (Ji = {}));
var Zi;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Zi || (Zi = {}));
var Qi;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Qi || (Qi = {}));
var ta;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(ta || (ta = {}));
var lo;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(lo || (lo = {}));
var ea;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(ea || (ea = {}));
var na;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(na || (na = {}));
var ra;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(ra || (ra = {}));
var sa;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(sa || (sa = {}));
var oa;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(oa || (oa = {}));
var ia;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(ia || (ia = {}));
function uo(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Vl(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function hf(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Kl(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  uo(t.outputLen), uo(t.blockLen);
}
function zl(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function jl(t, e) {
  hf(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const js = {
  number: uo,
  bool: Vl,
  bytes: hf,
  hash: Kl,
  exists: zl,
  output: jl
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const qs = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Dt = (t, e) => t << 32 - e | t >>> e, ql = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!ql)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Wl(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function lf(t) {
  if (typeof t == "string" && (t = Wl(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Xl = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Qe(t) {
  const e = (r) => t().update(lf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Yl(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, i, r), t.setUint32(e + u, a, r);
}
let jo = class extends Xl {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = qs(this.buffer);
  }
  update(e) {
    js.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = lf(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const f = qs(e);
        for (; s <= o - i; i += s)
          this.process(f, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    js.exists(this), js.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let c = i; c < s; c++)
      n[c] = 0;
    Yl(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = qs(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = f / 4, l = this.get();
    if (u > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let c = 0; c < u; c++)
      a.setUint32(4 * c, l[c], o);
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
const Jl = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), uf = Uint8Array.from({ length: 16 }, (t, e) => e), Zl = uf.map((t) => (9 * t + 5) % 16);
let qo = [uf], Wo = [Zl];
for (let t = 0; t < 4; t++)
  for (let e of [qo, Wo])
    e.push(e[t].map((n) => Jl[n]));
const df = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Ql = qo.map((t, e) => t.map((n) => df[e][n])), tu = Wo.map((t, e) => t.map((n) => df[e][n])), eu = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), nu = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), vr = (t, e) => t << e | t >>> 32 - e;
function aa(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Br = new Uint32Array(16);
let ru = class extends jo {
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
      Br[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, f = a, u = this.h3 | 0, l = u, c = this.h4 | 0, p = c;
    for (let d = 0; d < 5; d++) {
      const g = 4 - d, y = eu[d], B = nu[d], H = qo[d], U = Wo[d], x = Ql[d], $ = tu[d];
      for (let S = 0; S < 16; S++) {
        const O = vr(r + aa(d, o, a, u) + Br[H[S]] + y, x[S]) + c | 0;
        r = c, c = u, u = vr(a, 10) | 0, a = o, o = O;
      }
      for (let S = 0; S < 16; S++) {
        const O = vr(s + aa(g, i, f, l) + Br[U[S]] + B, $[S]) + p | 0;
        s = p, p = l, l = vr(f, 10) | 0, f = i, i = O;
      }
    }
    this.set(this.h1 + a + l | 0, this.h2 + u + p | 0, this.h3 + c + s | 0, this.h4 + r + i | 0, this.h0 + o + f | 0);
  }
  roundClean() {
    Br.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Qe(() => new ru());
const su = (t, e, n) => t & e ^ ~t & n, ou = (t, e, n) => t & e ^ t & n ^ e & n, iu = new Uint32Array([
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
]), ae = new Uint32Array(64);
let pf = class extends jo {
  constructor() {
    super(64, 32, 8, !1), this.A = ie[0] | 0, this.B = ie[1] | 0, this.C = ie[2] | 0, this.D = ie[3] | 0, this.E = ie[4] | 0, this.F = ie[5] | 0, this.G = ie[6] | 0, this.H = ie[7] | 0;
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
      ae[c] = e.getUint32(n, !1);
    for (let c = 16; c < 64; c++) {
      const p = ae[c - 15], d = ae[c - 2], g = Dt(p, 7) ^ Dt(p, 18) ^ p >>> 3, y = Dt(d, 17) ^ Dt(d, 19) ^ d >>> 10;
      ae[c] = y + ae[c - 7] + g + ae[c - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: f, G: u, H: l } = this;
    for (let c = 0; c < 64; c++) {
      const p = Dt(a, 6) ^ Dt(a, 11) ^ Dt(a, 25), d = l + p + su(a, f, u) + iu[c] + ae[c] | 0, y = (Dt(r, 2) ^ Dt(r, 13) ^ Dt(r, 22)) + ou(r, s, o) | 0;
      l = u, u = f, f = a, a = i + d | 0, i = o, o = s, s = r, r = d + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, l = l + this.H | 0, this.set(r, s, o, i, a, f, u, l);
  }
  roundClean() {
    ae.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, au = class extends pf {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Qe(() => new pf());
Qe(() => new au());
const $r = BigInt(2 ** 32 - 1), po = BigInt(32);
function bf(t, e = !1) {
  return e ? { h: Number(t & $r), l: Number(t >> po & $r) } : { h: Number(t >> po & $r) | 0, l: Number(t & $r) | 0 };
}
function cu(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = bf(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const fu = (t, e) => BigInt(t >>> 0) << po | BigInt(e >>> 0), hu = (t, e, n) => t >>> n, lu = (t, e, n) => t << 32 - n | e >>> n, uu = (t, e, n) => t >>> n | e << 32 - n, du = (t, e, n) => t << 32 - n | e >>> n, pu = (t, e, n) => t << 64 - n | e >>> n - 32, bu = (t, e, n) => t >>> n - 32 | e << 64 - n, gu = (t, e) => e, xu = (t, e) => t, yu = (t, e, n) => t << n | e >>> 32 - n, wu = (t, e, n) => e << n | t >>> 32 - n, mu = (t, e, n) => e << n - 32 | t >>> 64 - n, Su = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Eu(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Au = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), vu = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Bu = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), $u = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, _u = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Hu = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, R = {
  fromBig: bf,
  split: cu,
  toBig: fu,
  shrSH: hu,
  shrSL: lu,
  rotrSH: uu,
  rotrSL: du,
  rotrBH: pu,
  rotrBL: bu,
  rotr32H: gu,
  rotr32L: xu,
  rotlSH: yu,
  rotlSL: wu,
  rotlBH: mu,
  rotlBL: Su,
  add: Eu,
  add3L: Au,
  add3H: vu,
  add4L: Bu,
  add4H: $u,
  add5H: Hu,
  add5L: _u
}, [Lu, Iu] = R.split([
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
].map((t) => BigInt(t))), ce = new Uint32Array(80), fe = new Uint32Array(80);
let xs = class extends jo {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: f, Eh: u, El: l, Fh: c, Fl: p, Gh: d, Gl: g, Hh: y, Hl: B } = this;
    return [e, n, r, s, o, i, a, f, u, l, c, p, d, g, y, B];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, f, u, l, c, p, d, g, y, B) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = f | 0, this.Eh = u | 0, this.El = l | 0, this.Fh = c | 0, this.Fl = p | 0, this.Gh = d | 0, this.Gl = g | 0, this.Hh = y | 0, this.Hl = B | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      ce[x] = e.getUint32(n), fe[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const $ = ce[x - 15] | 0, S = fe[x - 15] | 0, O = R.rotrSH($, S, 1) ^ R.rotrSH($, S, 8) ^ R.shrSH($, S, 7), P = R.rotrSL($, S, 1) ^ R.rotrSL($, S, 8) ^ R.shrSL($, S, 7), C = ce[x - 2] | 0, k = fe[x - 2] | 0, b = R.rotrSH(C, k, 19) ^ R.rotrBH(C, k, 61) ^ R.shrSH(C, k, 6), A = R.rotrSL(C, k, 19) ^ R.rotrBL(C, k, 61) ^ R.shrSL(C, k, 6), I = R.add4L(P, A, fe[x - 7], fe[x - 16]), D = R.add4H(I, O, b, ce[x - 7], ce[x - 16]);
      ce[x] = D | 0, fe[x] = I | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: f, Dh: u, Dl: l, Eh: c, El: p, Fh: d, Fl: g, Gh: y, Gl: B, Hh: H, Hl: U } = this;
    for (let x = 0; x < 80; x++) {
      const $ = R.rotrSH(c, p, 14) ^ R.rotrSH(c, p, 18) ^ R.rotrBH(c, p, 41), S = R.rotrSL(c, p, 14) ^ R.rotrSL(c, p, 18) ^ R.rotrBL(c, p, 41), O = c & d ^ ~c & y, P = p & g ^ ~p & B, C = R.add5L(U, S, P, Iu[x], fe[x]), k = R.add5H(C, H, $, O, Lu[x], ce[x]), b = C | 0, A = R.rotrSH(r, s, 28) ^ R.rotrBH(r, s, 34) ^ R.rotrBH(r, s, 39), I = R.rotrSL(r, s, 28) ^ R.rotrBL(r, s, 34) ^ R.rotrBL(r, s, 39), D = r & o ^ r & a ^ o & a, j = s & i ^ s & f ^ i & f;
      H = y | 0, U = B | 0, y = d | 0, B = g | 0, d = c | 0, g = p | 0, { h: c, l: p } = R.add(u | 0, l | 0, k | 0, b | 0), u = a | 0, l = f | 0, a = o | 0, f = i | 0, o = r | 0, i = s | 0;
      const T = R.add3L(b, I, j);
      r = R.add3H(T, k, A, D), s = T | 0;
    }
    ({ h: r, l: s } = R.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = R.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: f } = R.add(this.Ch | 0, this.Cl | 0, a | 0, f | 0), { h: u, l } = R.add(this.Dh | 0, this.Dl | 0, u | 0, l | 0), { h: c, l: p } = R.add(this.Eh | 0, this.El | 0, c | 0, p | 0), { h: d, l: g } = R.add(this.Fh | 0, this.Fl | 0, d | 0, g | 0), { h: y, l: B } = R.add(this.Gh | 0, this.Gl | 0, y | 0, B | 0), { h: H, l: U } = R.add(this.Hh | 0, this.Hl | 0, H | 0, U | 0), this.set(r, s, o, i, a, f, u, l, c, p, d, g, y, B, H, U);
  }
  roundClean() {
    ce.fill(0), fe.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Uu = class extends xs {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Ou = class extends xs {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Cu = class extends xs {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Qe(() => new xs());
Qe(() => new Uu());
Qe(() => new Ou());
Qe(() => new Cu());
const ku = {}, gf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ku
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Y = BigInt(0), nt = BigInt(1), ke = BigInt(2), Xn = BigInt(3), ca = BigInt(8), tt = Object.freeze({
  a: Y,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: nt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), fa = (t, e) => (t + e / ke) / e, _r = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = tt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -nt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), o = n, i = BigInt("0x100000000000000000000000000000000"), a = fa(o * t, e), f = fa(-r * t, e);
    let u = L(t - a * n - f * s, e), l = L(-a * r - f * o, e);
    const c = u > i, p = l > i;
    if (c && (u = e - u), p && (l = e - l), u > i || l > i)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: c, k1: u, k2neg: p, k2: l };
  }
}, Nt = 32, qe = 32, xf = 32, Qr = Nt + 1, ts = 2 * Nt + 1;
function ha(t) {
  const { a: e, b: n } = tt, r = L(t * t), s = L(r * t);
  return L(s + e * t + n);
}
const Hr = tt.a === Y;
class Xo extends Error {
  constructor(e) {
    super(e);
  }
}
function la(t) {
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
    return e.equals(Z.ZERO) ? Q.ZERO : new Q(e.x, e.y, nt);
  }
  static toAffineBatch(e) {
    const n = Fu(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return Q.toAffineBatch(e).map(Q.fromAffine);
  }
  equals(e) {
    la(e);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = e, f = L(s * s), u = L(a * a), l = L(n * u), c = L(o * f), p = L(L(r * a) * u), d = L(L(i * s) * f);
    return l === c && p === d;
  }
  negate() {
    return new Q(this.x, L(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = L(e * e), o = L(n * n), i = L(o * o), a = e + o, f = L(ke * (L(a * a) - s - i)), u = L(Xn * s), l = L(u * u), c = L(l - ke * f), p = L(u * (f - c) - ca * i), d = L(ke * n * r);
    return new Q(c, p, d);
  }
  add(e) {
    la(e);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = e;
    if (o === Y || i === Y)
      return this;
    if (n === Y || r === Y)
      return e;
    const f = L(s * s), u = L(a * a), l = L(n * u), c = L(o * f), p = L(L(r * a) * u), d = L(L(i * s) * f), g = L(c - l), y = L(d - p);
    if (g === Y)
      return y === Y ? this.double() : Q.ZERO;
    const B = L(g * g), H = L(g * B), U = L(l * B), x = L(y * y - H - ke * U), $ = L(y * (U - x) - p * H), S = L(s * a * g);
    return new Q(x, $, S);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = Q.ZERO;
    if (typeof e == "bigint" && e === Y)
      return n;
    let r = pa(e);
    if (r === nt)
      return this;
    if (!Hr) {
      let c = n, p = this;
      for (; r > Y; )
        r & nt && (c = c.add(p)), p = p.double(), r >>= nt;
      return c;
    }
    let { k1neg: s, k1: o, k2neg: i, k2: a } = _r.splitScalar(r), f = n, u = n, l = this;
    for (; o > Y || a > Y; )
      o & nt && (f = f.add(l)), a & nt && (u = u.add(l)), l = l.double(), o >>= nt, a >>= nt;
    return s && (f = f.negate()), i && (u = u.negate()), u = new Q(L(u.x * _r.beta), u.y, u.z), f.add(u);
  }
  precomputeWindow(e) {
    const n = Hr ? 128 / e + 1 : 256 / e + 1, r = [];
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
    let s = n && bo.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = Q.normalizeZ(s), bo.set(n, s)));
    let o = Q.ZERO, i = Q.BASE;
    const a = 1 + (Hr ? 128 / r : 256 / r), f = 2 ** (r - 1), u = BigInt(2 ** r - 1), l = 2 ** r, c = BigInt(r);
    for (let p = 0; p < a; p++) {
      const d = p * f;
      let g = Number(e & u);
      e >>= c, g > f && (g -= l, e += nt);
      const y = d, B = d + Math.abs(g) - 1, H = p % 2 !== 0, U = g < 0;
      g === 0 ? i = i.add(Lr(H, s[y])) : o = o.add(Lr(U, s[B]));
    }
    return { p: o, f: i };
  }
  multiply(e, n) {
    let r = pa(e), s, o;
    if (Hr) {
      const { k1neg: i, k1: a, k2neg: f, k2: u } = _r.splitScalar(r);
      let { p: l, f: c } = this.wNAF(a, n), { p, f: d } = this.wNAF(u, n);
      l = Lr(i, l), p = Lr(f, p), p = new Q(L(p.x * _r.beta), p.y, p.z), s = l.add(p), o = c.add(d);
    } else {
      const { p: i, f: a } = this.wNAF(r, n);
      s = i, o = a;
    }
    return Q.normalizeZ([s, o])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, o = this.equals(Q.ZERO);
    e == null && (e = o ? ca : Pn(s));
    const i = e, a = L(i * i), f = L(a * i), u = L(n * a), l = L(r * f), c = L(s * i);
    if (o)
      return Z.ZERO;
    if (c !== nt)
      throw new Error("invZ was invalid");
    return new Z(u, l);
  }
}
Q.BASE = new Q(tt.Gx, tt.Gy, nt);
Q.ZERO = new Q(Y, nt, Y);
function Lr(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const bo = /* @__PURE__ */ new WeakMap();
class Z {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, bo.delete(this);
  }
  hasEvenY() {
    return this.y % ke === Y;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = Et(n ? e : e.subarray(1));
    if (!Wr(r))
      throw new Error("Point is not on curve");
    const s = ha(r);
    let o = Tu(s);
    const i = (o & nt) === nt;
    n ? i && (o = L(-o)) : (e[0] & 1) === 1 !== i && (o = L(-o));
    const a = new Z(r, o);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = Et(e.subarray(1, Nt + 1)), r = Et(e.subarray(Nt + 1, Nt * 2 + 1)), s = new Z(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = jt(e), r = n.length, s = n[0];
    if (r === Nt)
      return this.fromCompressedHex(n);
    if (r === Qr && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === ts && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Qr} compressed bytes or ${ts} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Z.BASE.multiply(We(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: o } = mf(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const i = Yo(jt(e)), { n: a } = tt, f = r === 2 || r === 3 ? s + a : s, u = Pn(f, a), l = L(-i * u, a), c = L(o * u, a), p = r & 1 ? "03" : "02", d = Z.fromHex(p + Pe(f)), g = Z.BASE.multiplyAndAddUnsafe(d, l, c);
    if (!g)
      throw new Error("Cannot recover signature: point at infinify");
    return g.assertValidity(), g;
  }
  toRawBytes(e = !1) {
    return Ne(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Pe(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Pe(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Wr(n) || !Wr(r))
      throw new Error(e);
    const s = L(r * r), o = ha(n);
    if (L(s - o) !== Y)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new Z(this.x, L(-this.y));
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
    const s = Q.fromAffine(this), o = n === Y || n === nt || this !== Z.BASE ? s.multiplyUnsafe(n) : s.multiply(n), i = Q.fromAffine(e).multiplyUnsafe(r), a = o.add(i);
    return a.equals(Q.ZERO) ? void 0 : a.toAffine();
  }
}
Z.BASE = new Z(tt.Gx, tt.Gy);
Z.ZERO = new Z(Y, Y);
function ua(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function da(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${vn(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Et(n), left: t.subarray(e + 2) };
}
function Pu(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${vn(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = da(t.subarray(2)), { data: r, left: s } = da(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${vn(s)}`);
  return { r: e, s: r };
}
class ee {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? vn(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new ee(es(s.slice(0, 64)), es(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Pu(n ? e : Ne(e));
    return new ee(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!$n(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!$n(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = tt.n >> nt;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new ee(this.r, L(-this.s, tt.n)) : this;
  }
  toDERRawBytes() {
    return Ne(this.toDERHex());
  }
  toDERHex() {
    const e = ua(qn(this.s)), n = ua(qn(this.r)), r = e.length / 2, s = n.length / 2, o = qn(r), i = qn(s);
    return `30${qn(s + r + 4)}02${i}${n}02${o}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Ne(this.toCompactHex());
  }
  toCompactHex() {
    return Pe(this.r) + Pe(this.s);
  }
}
function Oe(...t) {
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
const Nu = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function vn(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Nu[t[n]];
  return e;
}
const Du = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Pe(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Y <= t && t < Du))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Bn(t) {
  const e = Ne(Pe(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function qn(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function es(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function Ne(t) {
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
function Et(t) {
  return es(vn(t));
}
function jt(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Ne(t);
}
function pa(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && $n(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function L(t, e = tt.P) {
  const n = t % e;
  return n >= Y ? n : e + n;
}
function vt(t, e) {
  const { P: n } = tt;
  let r = t;
  for (; e-- > Y; )
    r *= r, r %= n;
  return r;
}
function Tu(t) {
  const { P: e } = tt, n = BigInt(6), r = BigInt(11), s = BigInt(22), o = BigInt(23), i = BigInt(44), a = BigInt(88), f = t * t * t % e, u = f * f * t % e, l = vt(u, Xn) * u % e, c = vt(l, Xn) * u % e, p = vt(c, ke) * f % e, d = vt(p, r) * p % e, g = vt(d, s) * d % e, y = vt(g, i) * g % e, B = vt(y, a) * y % e, H = vt(B, i) * g % e, U = vt(H, Xn) * u % e, x = vt(U, o) * d % e, $ = vt(x, n) * f % e, S = vt($, ke);
  if (S * S % e !== t)
    throw new Error("Cannot find square root");
  return S;
}
function Pn(t, e = tt.P) {
  if (t === Y || e <= Y)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = L(t, e), r = e, s = Y, o = nt;
  for (; n !== Y; ) {
    const a = r / n, f = r % n, u = s - o * a;
    r = n, n = f, s = o, o = u;
  }
  if (r !== nt)
    throw new Error("invert: does not exist");
  return L(s, e);
}
function Fu(t, e = tt.P) {
  const n = new Array(t.length), r = t.reduce((o, i, a) => i === Y ? o : (n[a] = o, L(o * i, e)), nt), s = Pn(r, e);
  return t.reduceRight((o, i, a) => i === Y ? o : (n[a] = L(o * n[a], e), L(o * i, e)), s), n;
}
function Mu(t) {
  const e = t.length * 8 - qe * 8, n = Et(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Yo(t, e = !1) {
  const n = Mu(t);
  if (e)
    return n;
  const { n: r } = tt;
  return n >= r ? n - r : n;
}
let En, Yn;
class yf {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return it.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return Yn(this.k, ...e);
  }
  checkSync() {
    if (typeof Yn != "function")
      throw new Xo("hmacSha256Sync needs to be set");
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
    return Oe(...n);
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
    return Oe(...n);
  }
}
function $n(t) {
  return Y < t && t < tt.n;
}
function Wr(t) {
  return Y < t && t < tt.P;
}
function wf(t, e, n, r = !0) {
  const { n: s } = tt, o = Yo(t, !0);
  if (!$n(o))
    return;
  const i = Pn(o, s), a = Z.BASE.multiply(o), f = L(a.x, s);
  if (f === Y)
    return;
  const u = L(i * L(e + n * f, s), s);
  if (u === Y)
    return;
  let l = new ee(f, u), c = (a.x === l.r ? 0 : 2) | Number(a.y & nt);
  return r && l.hasHighS() && (l = l.normalizeS(), c ^= 1), { sig: l, recovery: c };
}
function We(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * qe)
      throw new Error("Expected 32 bytes of private key");
    e = es(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== qe)
      throw new Error("Expected 32 bytes of private key");
    e = Et(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!$n(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Jo(t) {
  return t instanceof Z ? (t.assertValidity(), t) : Z.fromHex(t);
}
function mf(t) {
  if (t instanceof ee)
    return t.assertValidity(), t;
  try {
    return ee.fromDER(t);
  } catch {
    return ee.fromCompact(t);
  }
}
function Zo(t, e = !1) {
  return Z.fromPrivateKey(t).toRawBytes(e);
}
function Ru(t, e, n, r = !1) {
  return Z.fromSignature(t, e, n).toRawBytes(r);
}
function ba(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === Qr || r === ts : n ? r === Qr * 2 || r === ts * 2 : t instanceof Z;
}
function Qo(t, e, n = !1) {
  if (ba(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!ba(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Jo(e);
  return r.assertValidity(), r.multiply(We(t)).toRawBytes(n);
}
function Sf(t) {
  const e = t.length > Nt ? t.slice(0, Nt) : t;
  return Et(e);
}
function Gu(t) {
  const e = Sf(t), n = L(e, tt.n);
  return Ef(n < Y ? e : n);
}
function Ef(t) {
  return Bn(t);
}
function Af(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = jt(t), s = We(e), o = [Ef(s), Gu(r)];
  if (n != null) {
    n === !0 && (n = it.randomBytes(Nt));
    const f = jt(n);
    if (f.length !== Nt)
      throw new Error(`sign: Expected ${Nt} bytes of extra data`);
    o.push(f);
  }
  const i = Oe(...o), a = Sf(r);
  return { seed: i, m: a, d: s };
}
function vf(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: o } = Object.assign({ canonical: !0, der: !0 }, e), i = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return o ? [i, r] : i;
}
async function Vu(t, e, n = {}) {
  const { seed: r, m: s, d: o } = Af(t, e, n.extraEntropy), i = new yf(xf, qe);
  await i.reseed(r);
  let a;
  for (; !(a = wf(await i.generate(), s, o, n.canonical)); )
    await i.reseed();
  return vf(a, n);
}
function Bf(t, e, n = {}) {
  const { seed: r, m: s, d: o } = Af(t, e, n.extraEntropy), i = new yf(xf, qe);
  i.reseedSync(r);
  let a;
  for (; !(a = wf(i.generateSync(), s, o, n.canonical)); )
    i.reseedSync();
  return vf(a, n);
}
const Ku = { strict: !0 };
function zu(t, e, n, r = Ku) {
  let s;
  try {
    s = mf(t), e = jt(e);
  } catch {
    return !1;
  }
  const { r: o, s: i } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = Yo(e);
  let f;
  try {
    f = Jo(n);
  } catch {
    return !1;
  }
  const { n: u } = tt, l = Pn(i, u), c = L(a * l, u), p = L(o * l, u), d = Z.BASE.multiplyAndAddUnsafe(f, c, p);
  return d ? L(d.x, u) === o : !1;
}
function ns(t) {
  return L(Et(t), tt.n);
}
class _n {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = jt(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = Et(n.subarray(0, 32)), s = Et(n.subarray(32, 64));
    return new _n(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Wr(e) || !$n(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Pe(this.r) + Pe(this.s);
  }
  toRawBytes() {
    return Ne(this.toHex());
  }
}
function ju(t) {
  return Z.fromPrivateKey(t).toRawX();
}
class $f {
  constructor(e, n, r = it.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = jt(e);
    const { x: s, scalar: o } = this.getScalar(We(n));
    if (this.px = s, this.d = o, this.rand = jt(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = Z.fromPrivateKey(e), r = n.hasEvenY() ? e : tt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Bn(e ^ Et(n));
  }
  finalizeNonce(e) {
    const n = L(Et(e), tt.n);
    if (n === Y)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: o } = this.getScalar(n);
    return { R: r, rx: s, k: o };
  }
  finalizeSig(e, n, r, s) {
    return new _n(e.x, L(n + r * s, tt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, o = it.taggedHash, i = this.initNonce(n, await o(Ue.aux, s)), { R: a, rx: f, k: u } = this.finalizeNonce(await o(Ue.nonce, i, r, e)), l = ns(await o(Ue.challenge, f, r, e)), c = this.finalizeSig(a, u, l, n);
    return await Lf(c, e, r) || this.error(), c;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, o = it.taggedHashSync, i = this.initNonce(n, o(Ue.aux, s)), { R: a, rx: f, k: u } = this.finalizeNonce(o(Ue.nonce, i, r, e)), l = ns(o(Ue.challenge, f, r, e)), c = this.finalizeSig(a, u, l, n);
    return If(c, e, r) || this.error(), c;
  }
}
async function qu(t, e, n) {
  return new $f(t, e, n).calc();
}
function Wu(t, e, n) {
  return new $f(t, e, n).calcSync();
}
function _f(t, e, n) {
  const r = t instanceof _n, s = r ? t : _n.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: jt(e),
    P: Jo(n)
  };
}
function Hf(t, e, n, r) {
  const s = Z.BASE.multiplyAndAddUnsafe(e, We(n), L(-r, tt.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Lf(t, e, n) {
  try {
    const { r, s, m: o, P: i } = _f(t, e, n), a = ns(await it.taggedHash(Ue.challenge, Bn(r), i.toRawX(), o));
    return Hf(r, i, s, a);
  } catch {
    return !1;
  }
}
function If(t, e, n) {
  try {
    const { r, s, m: o, P: i } = _f(t, e, n), a = ns(it.taggedHashSync(Ue.challenge, Bn(r), i.toRawX(), o));
    return Hf(r, i, s, a);
  } catch (r) {
    if (r instanceof Xo)
      throw r;
    return !1;
  }
}
const Xu = {
  Signature: _n,
  getPublicKey: ju,
  sign: qu,
  verify: Lf,
  signSync: Wu,
  verifySync: If
};
Z.BASE._setWindowSize(8);
const wt = {
  node: gf,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Ue = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Ir = {}, it = {
  bytesToHex: vn,
  hexToBytes: Ne,
  concatBytes: Oe,
  mod: L,
  invert: Pn,
  isValidPrivateKey(t) {
    try {
      return We(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Bn,
  _normalizePrivateKey: We,
  hashToPrivateKey: (t) => {
    t = jt(t);
    const e = qe + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = L(Et(t), tt.n - nt) + nt;
    return Bn(n);
  },
  randomBytes: (t = 32) => {
    if (wt.web)
      return wt.web.getRandomValues(new Uint8Array(t));
    if (wt.node) {
      const { randomBytes: e } = wt.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => it.hashToPrivateKey(it.randomBytes(qe + 8)),
  precompute(t = 8, e = Z.BASE) {
    const n = e === Z.BASE ? e : new Z(e.x, e.y);
    return n._setWindowSize(t), n.multiply(Xn), n;
  },
  sha256: async (...t) => {
    if (wt.web) {
      const e = await wt.web.subtle.digest("SHA-256", Oe(...t));
      return new Uint8Array(e);
    } else if (wt.node) {
      const { createHash: e } = wt.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (wt.web) {
      const n = await wt.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Oe(...e), s = await wt.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (wt.node) {
      const { createHmac: n } = wt.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = Ir[t];
    if (n === void 0) {
      const r = await it.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Oe(r, r), Ir[t] = n;
    }
    return it.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof En != "function")
      throw new Xo("sha256Sync is undefined, you need to set it");
    let n = Ir[t];
    if (n === void 0) {
      const r = En(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Oe(r, r), Ir[t] = n;
    }
    return En(n, ...e);
  },
  _JacobianPoint: Q
};
Object.defineProperties(it, {
  sha256Sync: {
    configurable: !1,
    get() {
      return En;
    },
    set(t) {
      En || (En = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Yn;
    },
    set(t) {
      Yn || (Yn = t);
    }
  }
});
const Yu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: tt,
  Point: Z,
  Signature: ee,
  getPublicKey: Zo,
  getSharedSecret: Qo,
  recoverPublicKey: Ru,
  schnorr: Xu,
  sign: Vu,
  signSync: Bf,
  utils: it,
  verify: zu
}, Symbol.toStringTag, { value: "Module" }));
var pt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ju(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function or(t) {
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
var Nn = {}, ti = {};
const gn = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Uf(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function go(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Te(t, ...e) {
  if (!Uf(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function Of(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  go(t.outputLen), go(t.blockLen);
}
function tr(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Cf(t, e) {
  Te(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function Zu(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function Qu(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function er(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function Xr(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Ut(t, e) {
  return t << 32 - e | t >>> e;
}
function td(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const ei = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function ni(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const kf = ei ? (t) => t : (t) => ni(t), ed = kf;
function Pf(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = ni(t[e]);
  return t;
}
const nd = ei ? (t) => t : Pf, Nf = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", rd = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function sd(t) {
  if (Te(t), Nf)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += rd[t[n]];
  return e;
}
const Zt = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function ga(t) {
  if (t >= Zt._0 && t <= Zt._9)
    return t - Zt._0;
  if (t >= Zt.A && t <= Zt.F)
    return t - (Zt.A - 10);
  if (t >= Zt.a && t <= Zt.f)
    return t - (Zt.a - 10);
}
function od(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (Nf)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, o = 0; s < n; s++, o += 2) {
    const i = ga(t.charCodeAt(o)), a = ga(t.charCodeAt(o + 1));
    if (i === void 0 || a === void 0) {
      const f = t[o] + t[o + 1];
      throw new Error('hex string expected, got non-hex character "' + f + '" at index ' + o);
    }
    r[s] = i * 16 + a;
  }
  return r;
}
const Df = async () => {
};
async function id(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const o = Date.now() - r;
    o >= 0 && o < e || (await Df(), r += o);
  }
}
function ri(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function ad(t) {
  return new TextDecoder().decode(t);
}
function Dn(t) {
  return typeof t == "string" && (t = ri(t)), Te(t), t;
}
function cd(t) {
  return typeof t == "string" && (t = ri(t)), Te(t), t;
}
function fd(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    Te(s), e += s.length;
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
let si = class {
};
function ys(t) {
  const e = (r) => t().update(Dn(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Tf(t) {
  const e = (r, s) => t(s).update(Dn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function Ff(t) {
  const e = (r, s) => t(s).update(Dn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const ld = ys, ud = Tf, dd = Ff;
function pd(t = 32) {
  if (gn && typeof gn.getRandomValues == "function")
    return gn.getRandomValues(new Uint8Array(t));
  if (gn && typeof gn.randomBytes == "function")
    return Uint8Array.from(gn.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const bd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: si,
  abytes: Te,
  aexists: tr,
  ahash: Of,
  anumber: go,
  aoutput: Cf,
  asyncLoop: id,
  byteSwap: ni,
  byteSwap32: Pf,
  byteSwapIfBE: ed,
  bytesToHex: sd,
  bytesToUtf8: ad,
  checkOpts: hd,
  clean: er,
  concatBytes: fd,
  createHasher: ys,
  createOptHasher: Tf,
  createView: Xr,
  createXOFer: Ff,
  hexToBytes: od,
  isBytes: Uf,
  isLE: ei,
  kdfInputToBytes: cd,
  nextTick: Df,
  randomBytes: pd,
  rotl: td,
  rotr: Ut,
  swap32IfBE: nd,
  swap8IfBE: kf,
  toBytes: Dn,
  u32: Qu,
  u8: Zu,
  utf8ToBytes: ri,
  wrapConstructor: ld,
  wrapConstructorWithOpts: ud,
  wrapXOFConstructorWithOpts: dd
}, Symbol.toStringTag, { value: "Module" })), ir = /* @__PURE__ */ or(bd);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = ir;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(i, a) {
    if (!i.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    i.length % 2 !== 0 && (i = `0${i}`), i = i.toLowerCase();
    let f = [], u = 0;
    for (let d = i.length - 1; d >= 0; d--)
      if (u < 4) {
        const g = n.indexOf(i[d]) >> u;
        let y = 0;
        d !== 0 && (y = n.indexOf(i[d - 1]));
        const B = 1 + u, H = y % (1 << B) << 5 - B, U = t.c32[g + H];
        u = B, f.unshift(U);
      } else
        u = 0;
    let l = 0;
    for (let d = 0; d < f.length && f[d] === "0"; d++)
      l++;
    f = f.slice(l);
    const c = new TextDecoder().decode((0, e.hexToBytes)(i)).match(/^\u0000*/), p = c ? c[0].length : 0;
    for (let d = 0; d < p; d++)
      f.unshift(t.c32[0]);
    if (a) {
      const d = a - f.length;
      for (let g = 0; g < d; g++)
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
    let l = [], c = 0, p = 0;
    for (let y = i.length - 1; y >= 0; y--) {
      p === 4 && (l.unshift(n[c]), p = 0, c = 0);
      const H = (t.c32.indexOf(i[y]) << p) + c, U = n[H % 16];
      if (p += 1, c = H >> 4, c > 1 << p)
        throw new Error("Panic error in decoding.");
      l.unshift(U);
    }
    l.unshift(n[c]), l.length % 2 === 1 && l.unshift("0");
    let d = 0;
    for (let y = 0; y < l.length && l[y] === "0"; y++)
      d++;
    l = l.slice(d - d % 2);
    let g = l.join("");
    for (let y = 0; y < u; y++)
      g = `00${g}`;
    if (a) {
      const y = a * 2 - g.length;
      for (let B = 0; B < y; B += 2)
        g = `00${g}`;
    }
    return g;
  }
  t.c32decode = o;
})(ti);
var Xe = {};
function gd(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, i, r), t.setUint32(e + u, a, r);
}
function xd(t, e, n) {
  return t & e ^ ~t & n;
}
function yd(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class wd extends si {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = Xr(this.buffer);
  }
  update(e) {
    tr(this), e = Dn(e), Te(e);
    const { view: n, buffer: r, blockLen: s } = this, o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const f = Xr(e);
        for (; s <= o - i; i += s)
          this.process(f, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    tr(this), Cf(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, er(this.buffer.subarray(i)), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let c = i; c < s; c++)
      n[c] = 0;
    gd(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Xr(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = f / 4, l = this.get();
    if (u > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let c = 0; c < u; c++)
      a.setUint32(4 * c, l[c], o);
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
const he = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), le = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), md = /* @__PURE__ */ Uint32Array.from([
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
]), ue = /* @__PURE__ */ new Uint32Array(64);
let oi = class extends wd {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = he[0] | 0, this.B = he[1] | 0, this.C = he[2] | 0, this.D = he[3] | 0, this.E = he[4] | 0, this.F = he[5] | 0, this.G = he[6] | 0, this.H = he[7] | 0;
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
      ue[c] = e.getUint32(n, !1);
    for (let c = 16; c < 64; c++) {
      const p = ue[c - 15], d = ue[c - 2], g = Ut(p, 7) ^ Ut(p, 18) ^ p >>> 3, y = Ut(d, 17) ^ Ut(d, 19) ^ d >>> 10;
      ue[c] = y + ue[c - 7] + g + ue[c - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: f, G: u, H: l } = this;
    for (let c = 0; c < 64; c++) {
      const p = Ut(a, 6) ^ Ut(a, 11) ^ Ut(a, 25), d = l + p + xd(a, f, u) + md[c] + ue[c] | 0, y = (Ut(r, 2) ^ Ut(r, 13) ^ Ut(r, 22)) + yd(r, s, o) | 0;
      l = u, u = f, f = a, a = i + d | 0, i = o, o = s, s = r, r = d + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, l = l + this.H | 0, this.set(r, s, o, i, a, f, u, l);
  }
  roundClean() {
    er(ue);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), er(this.buffer);
  }
}, Mf = class extends oi {
  constructor() {
    super(28), this.A = le[0] | 0, this.B = le[1] | 0, this.C = le[2] | 0, this.D = le[3] | 0, this.E = le[4] | 0, this.F = le[5] | 0, this.G = le[6] | 0, this.H = le[7] | 0;
  }
};
const Sd = /* @__PURE__ */ ys(() => new oi()), Ed = /* @__PURE__ */ ys(() => new Mf()), Ad = oi, vd = Sd, Bd = Mf, $d = Ed, _d = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: Bd,
  SHA256: Ad,
  sha224: $d,
  sha256: vd
}, Symbol.toStringTag, { value: "Module" })), ws = /* @__PURE__ */ or(_d);
Object.defineProperty(Xe, "__esModule", { value: !0 });
Xe.c32checkDecode = Xe.c32checkEncode = void 0;
const xa = ws, ya = ir, Jn = ti;
function Rf(t) {
  const e = (0, xa.sha256)((0, xa.sha256)((0, ya.hexToBytes)(t)));
  return (0, ya.bytesToHex)(e.slice(0, 4));
}
function Hd(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Rf(`${n}${e}`), s = (0, Jn.c32encode)(`${e}${r}`);
  return `${Jn.c32[t]}${s}`;
}
Xe.c32checkEncode = Hd;
function Ld(t) {
  t = (0, Jn.c32normalize)(t);
  const e = (0, Jn.c32decode)(t.slice(1)), n = t[0], r = Jn.c32.indexOf(n), s = e.slice(-8);
  let o = r.toString(16);
  if (o.length === 1 && (o = `0${o}`), Rf(`${o}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Xe.c32checkDecode = Ld;
var Gf = {}, Hn = {};
function Id(t) {
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
  function l(d) {
    if (d instanceof Uint8Array || (ArrayBuffer.isView(d) ? d = new Uint8Array(d.buffer, d.byteOffset, d.byteLength) : Array.isArray(d) && (d = Uint8Array.from(d))), !(d instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (d.length === 0)
      return "";
    for (var g = 0, y = 0, B = 0, H = d.length; B !== H && d[B] === 0; )
      B++, g++;
    for (var U = (H - B) * u + 1 >>> 0, x = new Uint8Array(U); B !== H; ) {
      for (var $ = d[B], S = 0, O = U - 1; ($ !== 0 || S < y) && O !== -1; O--, S++)
        $ += 256 * x[O] >>> 0, x[O] = $ % i >>> 0, $ = $ / i >>> 0;
      if ($ !== 0)
        throw new Error("Non-zero carry");
      y = S, B++;
    }
    for (var P = U - y; P !== U && x[P] === 0; )
      P++;
    for (var C = a.repeat(g); P < U; ++P)
      C += t.charAt(x[P]);
    return C;
  }
  function c(d) {
    if (typeof d != "string")
      throw new TypeError("Expected String");
    if (d.length === 0)
      return new Uint8Array();
    for (var g = 0, y = 0, B = 0; d[g] === a; )
      y++, g++;
    for (var H = (d.length - g) * f + 1 >>> 0, U = new Uint8Array(H); d[g]; ) {
      var x = d.charCodeAt(g);
      if (x > 255)
        return;
      var $ = e[x];
      if ($ === 255)
        return;
      for (var S = 0, O = H - 1; ($ !== 0 || S < B) && O !== -1; O--, S++)
        $ += i * U[O] >>> 0, U[O] = $ % 256 >>> 0, $ = $ / 256 >>> 0;
      if ($ !== 0)
        throw new Error("Non-zero carry");
      B = S, g++;
    }
    for (var P = H - B; P !== H && U[P] === 0; )
      P++;
    for (var C = new Uint8Array(y + (H - P)), k = y; P !== H; )
      C[k++] = U[P++];
    return C;
  }
  function p(d) {
    var g = c(d);
    if (g)
      return g;
    throw new Error("Non-base" + i + " character");
  }
  return {
    encode: l,
    decodeUnsafe: c,
    decode: p
  };
}
var Vf = Id;
Object.defineProperty(Hn, "__esModule", { value: !0 });
Hn.decode = Hn.encode = void 0;
const rs = ws, wa = ir, Kf = Vf, zf = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function Ud(t, e = "00") {
  const n = typeof t == "string" ? (0, wa.hexToBytes)(t) : t, r = typeof e == "string" ? (0, wa.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, rs.sha256)((0, rs.sha256)(new Uint8Array([...r, ...n])));
  return Kf(zf).encode([...r, ...n, ...s.slice(0, 4)]);
}
Hn.encode = Ud;
function Od(t) {
  const e = Kf(zf).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, rs.sha256)((0, rs.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((o, i) => {
    if (o !== s[i])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Hn.decode = Od;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Xe, n = Hn, r = ir;
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
  function i(l, c) {
    if (!c.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, e.c32checkEncode)(l, c)}`;
  }
  t.c32address = i;
  function a(l) {
    if (l.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (l[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, e.c32checkDecode)(l.slice(1));
  }
  t.c32addressDecode = a;
  function f(l, c = -1) {
    const p = n.decode(l), d = (0, r.bytesToHex)(p.data), g = parseInt((0, r.bytesToHex)(p.prefix), 16);
    let y;
    return c < 0 ? (y = g, s[g] !== void 0 && (y = s[g])) : y = c, i(y, d);
  }
  t.b58ToC32 = f;
  function u(l, c = -1) {
    const p = a(l), d = p[0], g = p[1];
    let y;
    c < 0 ? (y = d, o[d] !== void 0 && (y = o[d])) : y = c;
    let B = y.toString(16);
    return B.length === 1 && (B = `0${B}`), n.encode(g, B);
  }
  t.c32ToB58 = u;
})(Gf);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = ti;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Xe;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Gf;
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
})(Nn);
var ss = { exports: {} };
ss.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, o = "[object Arguments]", i = "[object Array]", a = "[object Boolean]", f = "[object Date]", u = "[object Error]", l = "[object Function]", c = "[object GeneratorFunction]", p = "[object Map]", d = "[object Number]", g = "[object Object]", y = "[object Promise]", B = "[object RegExp]", H = "[object Set]", U = "[object String]", x = "[object Symbol]", $ = "[object WeakMap]", S = "[object ArrayBuffer]", O = "[object DataView]", P = "[object Float32Array]", C = "[object Float64Array]", k = "[object Int8Array]", b = "[object Int16Array]", A = "[object Int32Array]", I = "[object Uint8Array]", D = "[object Uint8ClampedArray]", j = "[object Uint16Array]", T = "[object Uint32Array]", _t = /[\\^$.*+?()[\]{}|]/g, ht = /\w*$/, gt = /^\[object .+?Constructor\]$/, rt = /^(?:0|[1-9]\d*)$/, q = {};
  q[o] = q[i] = q[S] = q[O] = q[a] = q[f] = q[P] = q[C] = q[k] = q[b] = q[A] = q[p] = q[d] = q[g] = q[B] = q[H] = q[U] = q[x] = q[I] = q[D] = q[j] = q[T] = !0, q[u] = q[l] = q[$] = !1;
  var on = typeof pt == "object" && pt && pt.Object === Object && pt, Os = typeof self == "object" && self && self.Object === Object && self, At = on || Os || Function("return this")(), Rn = e && !e.nodeType && e, Gn = Rn && !0 && t && !t.nodeType && t, Cs = Gn && Gn.exports === Rn;
  function ks(h, w) {
    return h.set(w[0], w[1]), h;
  }
  function et(h, w) {
    return h.add(w), h;
  }
  function an(h, w) {
    for (var v = -1, N = h ? h.length : 0; ++v < N && w(h[v], v, h) !== !1; )
      ;
    return h;
  }
  function lr(h, w) {
    for (var v = -1, N = w.length, ft = h.length; ++v < N; )
      h[ft + v] = w[v];
    return h;
  }
  function lt(h, w, v, N) {
    for (var ft = -1, xt = h ? h.length : 0; ++ft < xt; )
      v = w(v, h[ft], ft, h);
    return v;
  }
  function ur(h, w) {
    for (var v = -1, N = Array(h); ++v < h; )
      N[v] = w(v);
    return N;
  }
  function dr(h, w) {
    return h == null ? void 0 : h[w];
  }
  function Vn(h) {
    var w = !1;
    if (h != null && typeof h.toString != "function")
      try {
        w = !!(h + "");
      } catch {
      }
    return w;
  }
  function pr(h) {
    var w = -1, v = Array(h.size);
    return h.forEach(function(N, ft) {
      v[++w] = [ft, N];
    }), v;
  }
  function oe(h, w) {
    return function(v) {
      return h(w(v));
    };
  }
  function br(h) {
    var w = -1, v = Array(h.size);
    return h.forEach(function(N) {
      v[++w] = N;
    }), v;
  }
  var gr = Array.prototype, Ps = Function.prototype, Fe = Object.prototype, cn = At["__core-js_shared__"], Kn = function() {
    var h = /[^.]+$/.exec(cn && cn.keys && cn.keys.IE_PROTO || "");
    return h ? "Symbol(src)_1." + h : "";
  }(), xr = Ps.toString, Ht = Fe.hasOwnProperty, fn = Fe.toString, E = RegExp(
    "^" + xr.call(Ht).replace(_t, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), M = Cs ? At.Buffer : void 0, W = At.Symbol, F = At.Uint8Array, st = oe(Object.getPrototypeOf, Object), Lt = Object.create, yr = Fe.propertyIsEnumerable, wr = gr.splice, hn = Object.getOwnPropertySymbols, It = M ? M.isBuffer : void 0, ki = oe(Object.keys, Object), Ns = dn(At, "DataView"), zn = dn(At, "Map"), Ds = dn(At, "Promise"), Ts = dn(At, "Set"), Fs = dn(At, "WeakMap"), jn = dn(Object, "create"), Hh = Ge(Ns), Lh = Ge(zn), Ih = Ge(Ds), Uh = Ge(Ts), Oh = Ge(Fs), Pi = W ? W.prototype : void 0, Ni = Pi ? Pi.valueOf : void 0;
  function Me(h) {
    var w = -1, v = h ? h.length : 0;
    for (this.clear(); ++w < v; ) {
      var N = h[w];
      this.set(N[0], N[1]);
    }
  }
  function Ch() {
    this.__data__ = jn ? jn(null) : {};
  }
  function kh(h) {
    return this.has(h) && delete this.__data__[h];
  }
  function Ph(h) {
    var w = this.__data__;
    if (jn) {
      var v = w[h];
      return v === r ? void 0 : v;
    }
    return Ht.call(w, h) ? w[h] : void 0;
  }
  function Nh(h) {
    var w = this.__data__;
    return jn ? w[h] !== void 0 : Ht.call(w, h);
  }
  function Dh(h, w) {
    var v = this.__data__;
    return v[h] = jn && w === void 0 ? r : w, this;
  }
  Me.prototype.clear = Ch, Me.prototype.delete = kh, Me.prototype.get = Ph, Me.prototype.has = Nh, Me.prototype.set = Dh;
  function Yt(h) {
    var w = -1, v = h ? h.length : 0;
    for (this.clear(); ++w < v; ) {
      var N = h[w];
      this.set(N[0], N[1]);
    }
  }
  function Th() {
    this.__data__ = [];
  }
  function Fh(h) {
    var w = this.__data__, v = mr(w, h);
    if (v < 0)
      return !1;
    var N = w.length - 1;
    return v == N ? w.pop() : wr.call(w, v, 1), !0;
  }
  function Mh(h) {
    var w = this.__data__, v = mr(w, h);
    return v < 0 ? void 0 : w[v][1];
  }
  function Rh(h) {
    return mr(this.__data__, h) > -1;
  }
  function Gh(h, w) {
    var v = this.__data__, N = mr(v, h);
    return N < 0 ? v.push([h, w]) : v[N][1] = w, this;
  }
  Yt.prototype.clear = Th, Yt.prototype.delete = Fh, Yt.prototype.get = Mh, Yt.prototype.has = Rh, Yt.prototype.set = Gh;
  function ln(h) {
    var w = -1, v = h ? h.length : 0;
    for (this.clear(); ++w < v; ) {
      var N = h[w];
      this.set(N[0], N[1]);
    }
  }
  function Vh() {
    this.__data__ = {
      hash: new Me(),
      map: new (zn || Yt)(),
      string: new Me()
    };
  }
  function Kh(h) {
    return Sr(this, h).delete(h);
  }
  function zh(h) {
    return Sr(this, h).get(h);
  }
  function jh(h) {
    return Sr(this, h).has(h);
  }
  function qh(h, w) {
    return Sr(this, h).set(h, w), this;
  }
  ln.prototype.clear = Vh, ln.prototype.delete = Kh, ln.prototype.get = zh, ln.prototype.has = jh, ln.prototype.set = qh;
  function un(h) {
    this.__data__ = new Yt(h);
  }
  function Wh() {
    this.__data__ = new Yt();
  }
  function Xh(h) {
    return this.__data__.delete(h);
  }
  function Yh(h) {
    return this.__data__.get(h);
  }
  function Jh(h) {
    return this.__data__.has(h);
  }
  function Zh(h, w) {
    var v = this.__data__;
    if (v instanceof Yt) {
      var N = v.__data__;
      if (!zn || N.length < n - 1)
        return N.push([h, w]), this;
      v = this.__data__ = new ln(N);
    }
    return v.set(h, w), this;
  }
  un.prototype.clear = Wh, un.prototype.delete = Xh, un.prototype.get = Yh, un.prototype.has = Jh, un.prototype.set = Zh;
  function Qh(h, w) {
    var v = Gs(h) || Al(h) ? ur(h.length, String) : [], N = v.length, ft = !!N;
    for (var xt in h)
      Ht.call(h, xt) && !(ft && (xt == "length" || wl(xt, N))) && v.push(xt);
    return v;
  }
  function Di(h, w, v) {
    var N = h[w];
    (!(Ht.call(h, w) && Ri(N, v)) || v === void 0 && !(w in h)) && (h[w] = v);
  }
  function mr(h, w) {
    for (var v = h.length; v--; )
      if (Ri(h[v][0], w))
        return v;
    return -1;
  }
  function tl(h, w) {
    return h && Ti(w, Vs(w), h);
  }
  function Ms(h, w, v, N, ft, xt, Jt) {
    var yt;
    if (N && (yt = xt ? N(h, ft, xt, Jt) : N(h)), yt !== void 0)
      return yt;
    if (!Er(h))
      return h;
    var Ki = Gs(h);
    if (Ki) {
      if (yt = gl(h), !w)
        return dl(h, yt);
    } else {
      var pn = Re(h), zi = pn == l || pn == c;
      if (Bl(h))
        return il(h, w);
      if (pn == g || pn == o || zi && !xt) {
        if (Vn(h))
          return xt ? h : {};
        if (yt = xl(zi ? {} : h), !w)
          return pl(h, tl(yt, h));
      } else {
        if (!q[pn])
          return xt ? h : {};
        yt = yl(h, pn, Ms, w);
      }
    }
    Jt || (Jt = new un());
    var ji = Jt.get(h);
    if (ji)
      return ji;
    if (Jt.set(h, yt), !Ki)
      var qi = v ? bl(h) : Vs(h);
    return an(qi || h, function(Ks, Ar) {
      qi && (Ar = Ks, Ks = h[Ar]), Di(yt, Ar, Ms(Ks, w, v, N, Ar, h, Jt));
    }), yt;
  }
  function el(h) {
    return Er(h) ? Lt(h) : {};
  }
  function nl(h, w, v) {
    var N = w(h);
    return Gs(h) ? N : lr(N, v(h));
  }
  function rl(h) {
    return fn.call(h);
  }
  function sl(h) {
    if (!Er(h) || Sl(h))
      return !1;
    var w = Vi(h) || Vn(h) ? E : gt;
    return w.test(Ge(h));
  }
  function ol(h) {
    if (!Mi(h))
      return ki(h);
    var w = [];
    for (var v in Object(h))
      Ht.call(h, v) && v != "constructor" && w.push(v);
    return w;
  }
  function il(h, w) {
    if (w)
      return h.slice();
    var v = new h.constructor(h.length);
    return h.copy(v), v;
  }
  function Rs(h) {
    var w = new h.constructor(h.byteLength);
    return new F(w).set(new F(h)), w;
  }
  function al(h, w) {
    var v = w ? Rs(h.buffer) : h.buffer;
    return new h.constructor(v, h.byteOffset, h.byteLength);
  }
  function cl(h, w, v) {
    var N = w ? v(pr(h), !0) : pr(h);
    return lt(N, ks, new h.constructor());
  }
  function fl(h) {
    var w = new h.constructor(h.source, ht.exec(h));
    return w.lastIndex = h.lastIndex, w;
  }
  function hl(h, w, v) {
    var N = w ? v(br(h), !0) : br(h);
    return lt(N, et, new h.constructor());
  }
  function ll(h) {
    return Ni ? Object(Ni.call(h)) : {};
  }
  function ul(h, w) {
    var v = w ? Rs(h.buffer) : h.buffer;
    return new h.constructor(v, h.byteOffset, h.length);
  }
  function dl(h, w) {
    var v = -1, N = h.length;
    for (w || (w = Array(N)); ++v < N; )
      w[v] = h[v];
    return w;
  }
  function Ti(h, w, v, N) {
    v || (v = {});
    for (var ft = -1, xt = w.length; ++ft < xt; ) {
      var Jt = w[ft], yt = void 0;
      Di(v, Jt, yt === void 0 ? h[Jt] : yt);
    }
    return v;
  }
  function pl(h, w) {
    return Ti(h, Fi(h), w);
  }
  function bl(h) {
    return nl(h, Vs, Fi);
  }
  function Sr(h, w) {
    var v = h.__data__;
    return ml(w) ? v[typeof w == "string" ? "string" : "hash"] : v.map;
  }
  function dn(h, w) {
    var v = dr(h, w);
    return sl(v) ? v : void 0;
  }
  var Fi = hn ? oe(hn, Object) : Hl, Re = rl;
  (Ns && Re(new Ns(new ArrayBuffer(1))) != O || zn && Re(new zn()) != p || Ds && Re(Ds.resolve()) != y || Ts && Re(new Ts()) != H || Fs && Re(new Fs()) != $) && (Re = function(h) {
    var w = fn.call(h), v = w == g ? h.constructor : void 0, N = v ? Ge(v) : void 0;
    if (N)
      switch (N) {
        case Hh:
          return O;
        case Lh:
          return p;
        case Ih:
          return y;
        case Uh:
          return H;
        case Oh:
          return $;
      }
    return w;
  });
  function gl(h) {
    var w = h.length, v = h.constructor(w);
    return w && typeof h[0] == "string" && Ht.call(h, "index") && (v.index = h.index, v.input = h.input), v;
  }
  function xl(h) {
    return typeof h.constructor == "function" && !Mi(h) ? el(st(h)) : {};
  }
  function yl(h, w, v, N) {
    var ft = h.constructor;
    switch (w) {
      case S:
        return Rs(h);
      case a:
      case f:
        return new ft(+h);
      case O:
        return al(h, N);
      case P:
      case C:
      case k:
      case b:
      case A:
      case I:
      case D:
      case j:
      case T:
        return ul(h, N);
      case p:
        return cl(h, N, v);
      case d:
      case U:
        return new ft(h);
      case B:
        return fl(h);
      case H:
        return hl(h, N, v);
      case x:
        return ll(h);
    }
  }
  function wl(h, w) {
    return w = w ?? s, !!w && (typeof h == "number" || rt.test(h)) && h > -1 && h % 1 == 0 && h < w;
  }
  function ml(h) {
    var w = typeof h;
    return w == "string" || w == "number" || w == "symbol" || w == "boolean" ? h !== "__proto__" : h === null;
  }
  function Sl(h) {
    return !!Kn && Kn in h;
  }
  function Mi(h) {
    var w = h && h.constructor, v = typeof w == "function" && w.prototype || Fe;
    return h === v;
  }
  function Ge(h) {
    if (h != null) {
      try {
        return xr.call(h);
      } catch {
      }
      try {
        return h + "";
      } catch {
      }
    }
    return "";
  }
  function El(h) {
    return Ms(h, !0, !0);
  }
  function Ri(h, w) {
    return h === w || h !== h && w !== w;
  }
  function Al(h) {
    return vl(h) && Ht.call(h, "callee") && (!yr.call(h, "callee") || fn.call(h) == o);
  }
  var Gs = Array.isArray;
  function Gi(h) {
    return h != null && $l(h.length) && !Vi(h);
  }
  function vl(h) {
    return _l(h) && Gi(h);
  }
  var Bl = It || Ll;
  function Vi(h) {
    var w = Er(h) ? fn.call(h) : "";
    return w == l || w == c;
  }
  function $l(h) {
    return typeof h == "number" && h > -1 && h % 1 == 0 && h <= s;
  }
  function Er(h) {
    var w = typeof h;
    return !!h && (w == "object" || w == "function");
  }
  function _l(h) {
    return !!h && typeof h == "object";
  }
  function Vs(h) {
    return Gi(h) ? Qh(h) : ol(h);
  }
  function Hl() {
    return [];
  }
  function Ll() {
    return !1;
  }
  t.exports = El;
})(ss, ss.exports);
ss.exports;
function xo(t) {
  return Nn.c32address(t.version, t.hash160);
}
function ii(t, e, n) {
  const r = e || 1, s = n || Rl;
  if (fp(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Qn.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function ai(t) {
  const e = Nn.c32addressDecode(t);
  return {
    type: Qn.Address,
    version: e[0],
    hash160: e[1]
  };
}
var _;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(_ || (_ = {}));
function Cd(t) {
  if (t.type === _.PrincipalStandard)
    return xo(t.address);
  if (t.type === _.PrincipalContract)
    return `${xo(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function kd(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Dd(e, n);
  } else
    return Pd(t);
}
function Pd(t) {
  const e = ai(t);
  return { type: _.PrincipalStandard, address: e };
}
function Nd(t) {
  return { type: _.PrincipalStandard, address: t };
}
function Dd(t, e) {
  const n = ai(t), r = ii(e);
  return jf(n, r);
}
function jf(t, e) {
  if (sr(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: _.PrincipalContract, address: t, contractName: e };
}
function Ws(t, e = !1) {
  switch (t.type) {
    case _.BoolTrue:
      return !0;
    case _.BoolFalse:
      return !1;
    case _.Int:
    case _.UInt:
      return e ? t.value.toString() : t.value;
    case _.Buffer:
      return `0x${ne(t.buffer)}`;
    case _.OptionalNone:
      return null;
    case _.OptionalSome:
      return wn(t.value);
    case _.ResponseErr:
      return wn(t.value);
    case _.ResponseOk:
      return wn(t.value);
    case _.PrincipalStandard:
    case _.PrincipalContract:
      return Cd(t);
    case _.List:
      return t.list.map((r) => wn(r));
    case _.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = wn(t.data[r]);
      }), n;
    case _.StringASCII:
      return t.data;
    case _.StringUTF8:
      return t.data;
  }
}
function wn(t) {
  switch (t.type) {
    case _.ResponseErr:
      return { type: Ce(t), value: Ws(t, !0), success: !1 };
    case _.ResponseOk:
      return { type: Ce(t), value: Ws(t, !0), success: !0 };
    default:
      return { type: Ce(t), value: Ws(t, !0) };
  }
}
function Ce(t) {
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
      return `(optional ${Ce(t.value)})`;
    case _.ResponseErr:
      return `(response UnknownType ${Ce(t.value)})`;
    case _.ResponseOk:
      return `(response ${Ce(t.value)} UnknownType)`;
    case _.PrincipalStandard:
    case _.PrincipalContract:
      return "principal";
    case _.List:
      return `(list ${t.list.length} ${t.list.length ? Ce(t.list[0]) : "UnknownType"})`;
    case _.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${Ce(t.data[e])})`).join(" ")})`;
    case _.StringASCII:
      return `(string-ascii ${cf(t.data).length})`;
    case _.StringUTF8:
      return `(string-utf8 ${sr(t.data).length})`;
  }
}
const Td = () => ({ type: _.BoolTrue }), Fd = () => ({ type: _.BoolFalse }), ma = BigInt("0xffffffffffffffffffffffffffffffff"), Md = BigInt(0), Sa = BigInt("0x7fffffffffffffffffffffffffffffff"), Ea = BigInt("-170141183460469231731687303715884105728"), Rd = (t) => {
  const e = Vo(t, !0);
  if (e > Sa)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Sa}`);
  if (e < Ea)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Ea}`);
  return { type: _.Int, value: e };
}, qf = (t) => {
  const e = Vo(t, !1);
  if (e < Md)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > ma)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${ma}`);
  return { type: _.UInt, value: e };
}, Gd = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: _.Buffer, buffer: t };
};
function Vd() {
  return { type: _.OptionalNone };
}
function Kd(t) {
  return { type: _.OptionalSome, value: t };
}
function zd(t) {
  return { type: _.ResponseErr, value: t };
}
function jd(t) {
  return { type: _.ResponseOk, value: t };
}
function qd(t) {
  return { type: _.List, list: t };
}
function Wf(t) {
  for (const e in t)
    if (!hp(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: _.Tuple, data: t };
}
const Yr = (t) => ({ type: _.StringASCII, data: t }), Wd = (t) => ({ type: _.StringUTF8, data: t });
let Xf = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Xd = class extends Xf {
  constructor(e) {
    super(e);
  }
};
class Xs extends Xf {
  constructor(e) {
    super(e);
  }
}
function Yf(t) {
  const e = [];
  return e.push(An(Ko(t.version, 1))), e.push(An(t.hash160)), kn(e);
}
function Aa(t) {
  const e = sf(ne(t.readBytes(1))), n = ne(t.readBytes(20));
  return { type: Qn.Address, version: e, hash160: n };
}
function Jf(t) {
  const e = [], n = sr(t.content), r = n.byteLength;
  return e.push(An(Ko(r, t.lengthPrefixBytes))), e.push(n), kn(e);
}
function va(t, e, n) {
  e = e || 1;
  const r = sf(ne(t.readBytes(e))), s = af(t.readBytes(r));
  return ii(s, e, 128);
}
function qt(t, e) {
  return kn([t, e]);
}
function Yd(t) {
  return new Uint8Array([t.type]);
}
function Jd(t) {
  return t.type === _.OptionalNone ? new Uint8Array([t.type]) : qt(t.type, ar(t.value));
}
function Zd(t) {
  const e = new Uint8Array(4);
  return gs(e, t.buffer.length, 0), qt(t.type, zo(e, t.buffer));
}
function Qd(t) {
  const e = of(Ol(t.value, BigInt(Gl)), ff);
  return qt(t.type, e);
}
function tp(t) {
  const e = of(t.value, ff);
  return qt(t.type, e);
}
function ep(t) {
  return qt(t.type, Yf(t.address));
}
function np(t) {
  return qt(t.type, zo(Yf(t.address), Jf(t.contractName)));
}
function rp(t) {
  return qt(t.type, ar(t.value));
}
function sp(t) {
  const e = [], n = new Uint8Array(4);
  gs(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = ar(r);
    e.push(s);
  }
  return qt(t.type, kn(e));
}
function op(t) {
  const e = [], n = new Uint8Array(4);
  gs(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = ii(s);
    e.push(Jf(o));
    const i = ar(t.data[s]);
    e.push(i);
  }
  return qt(t.type, kn(e));
}
function Zf(t, e) {
  const n = [], r = e == "ascii" ? cf(t.data) : sr(t.data), s = new Uint8Array(4);
  return gs(s, r.length, 0), n.push(s), n.push(r), qt(t.type, kn(n));
}
function ip(t) {
  return Zf(t, "ascii");
}
function ap(t) {
  return Zf(t, "utf8");
}
function ar(t) {
  switch (t.type) {
    case _.BoolTrue:
    case _.BoolFalse:
      return Yd(t);
    case _.OptionalNone:
    case _.OptionalSome:
      return Jd(t);
    case _.Buffer:
      return Zd(t);
    case _.UInt:
      return tp(t);
    case _.Int:
      return Qd(t);
    case _.PrincipalStandard:
      return ep(t);
    case _.PrincipalContract:
      return np(t);
    case _.ResponseOk:
    case _.ResponseErr:
      return rp(t);
    case _.List:
      return sp(t);
    case _.Tuple:
      return op(t);
    case _.StringASCII:
      return ip(t);
    case _.StringUTF8:
      return ap(t);
    default:
      throw new Xd("Unable to serialize. Invalid Clarity Value.");
  }
}
function cp(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Ba = /* @__PURE__ */ new Map();
function Qf(t, e) {
  const n = Ba.get(t);
  if (n !== void 0)
    return n(e);
  const r = cp(t);
  return Ba.set(t, r), Qf(t, e);
}
class $a {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Ml(this.readBytes(4), 0);
  }
  readUInt8() {
    return Fl(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Tl(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = ne(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = ne(n);
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
    if (Qf(e, r))
      return r;
    throw n(r);
  }
}
function mn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new $a(An(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new $a(t) : e = t;
  switch (e.readUInt8Enum(_, (r) => {
    throw new Xs(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case _.Int:
      return Rd(e.readBytes(16));
    case _.UInt:
      return qf(e.readBytes(16));
    case _.Buffer:
      const r = e.readUInt32BE();
      return Gd(e.readBytes(r));
    case _.BoolTrue:
      return Td();
    case _.BoolFalse:
      return Fd();
    case _.PrincipalStandard:
      const s = Aa(e);
      return Nd(s);
    case _.PrincipalContract:
      const o = Aa(e), i = va(e);
      return jf(o, i);
    case _.ResponseOk:
      return jd(mn(e));
    case _.ResponseErr:
      return zd(mn(e));
    case _.OptionalNone:
      return Vd();
    case _.OptionalSome:
      return Kd(mn(e));
    case _.List:
      const a = e.readUInt32BE(), f = [];
      for (let y = 0; y < a; y++)
        f.push(mn(e));
      return qd(f);
    case _.Tuple:
      const u = e.readUInt32BE(), l = {};
      for (let y = 0; y < u; y++) {
        const B = va(e).content;
        if (B === void 0)
          throw new Xs('"content" is undefined');
        l[B] = mn(e);
      }
      return Wf(l);
    case _.StringASCII:
      const c = e.readUInt32BE(), p = Nl(e.readBytes(c));
      return Yr(p);
    case _.StringUTF8:
      const d = e.readUInt32BE(), g = af(e.readBytes(d));
      return Wd(g);
    default:
      throw new Xs("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const fp = (t, e) => t ? sr(t).length > e : !1;
function hp(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function t0(t) {
  const e = ar(t);
  return `0x${ne(e)}`;
}
function lp(t) {
  return mn(t);
}
const up = (t) => {
  try {
    return Nn.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
(function() {
  (function(t) {
    (function(e) {
      var n = typeof globalThis < "u" && globalThis || typeof t < "u" && t || // eslint-disable-next-line no-undef
      typeof pt < "u" && pt || {}, r = {
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
        var A = {
          next: function() {
            var I = b.shift();
            return { done: I === void 0, value: I };
          }
        };
        return r.iterable && (A[Symbol.iterator] = function() {
          return A;
        }), A;
      }
      function l(b) {
        this.map = {}, b instanceof l ? b.forEach(function(A, I) {
          this.append(I, A);
        }, this) : Array.isArray(b) ? b.forEach(function(A) {
          if (A.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + A.length);
          this.append(A[0], A[1]);
        }, this) : b && Object.getOwnPropertyNames(b).forEach(function(A) {
          this.append(A, b[A]);
        }, this);
      }
      l.prototype.append = function(b, A) {
        b = a(b), A = f(A);
        var I = this.map[b];
        this.map[b] = I ? I + ", " + A : A;
      }, l.prototype.delete = function(b) {
        delete this.map[a(b)];
      }, l.prototype.get = function(b) {
        return b = a(b), this.has(b) ? this.map[b] : null;
      }, l.prototype.has = function(b) {
        return this.map.hasOwnProperty(a(b));
      }, l.prototype.set = function(b, A) {
        this.map[a(b)] = f(A);
      }, l.prototype.forEach = function(b, A) {
        for (var I in this.map)
          this.map.hasOwnProperty(I) && b.call(A, this.map[I], I, this);
      }, l.prototype.keys = function() {
        var b = [];
        return this.forEach(function(A, I) {
          b.push(I);
        }), u(b);
      }, l.prototype.values = function() {
        var b = [];
        return this.forEach(function(A) {
          b.push(A);
        }), u(b);
      }, l.prototype.entries = function() {
        var b = [];
        return this.forEach(function(A, I) {
          b.push([I, A]);
        }), u(b);
      }, r.iterable && (l.prototype[Symbol.iterator] = l.prototype.entries);
      function c(b) {
        if (!b._noBody) {
          if (b.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          b.bodyUsed = !0;
        }
      }
      function p(b) {
        return new Promise(function(A, I) {
          b.onload = function() {
            A(b.result);
          }, b.onerror = function() {
            I(b.error);
          };
        });
      }
      function d(b) {
        var A = new FileReader(), I = p(A);
        return A.readAsArrayBuffer(b), I;
      }
      function g(b) {
        var A = new FileReader(), I = p(A), D = /charset=([A-Za-z0-9_-]+)/.exec(b.type), j = D ? D[1] : "utf-8";
        return A.readAsText(b, j), I;
      }
      function y(b) {
        for (var A = new Uint8Array(b), I = new Array(A.length), D = 0; D < A.length; D++)
          I[D] = String.fromCharCode(A[D]);
        return I.join("");
      }
      function B(b) {
        if (b.slice)
          return b.slice(0);
        var A = new Uint8Array(b.byteLength);
        return A.set(new Uint8Array(b)), A.buffer;
      }
      function H() {
        return this.bodyUsed = !1, this._initBody = function(b) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = b, b ? typeof b == "string" ? this._bodyText = b : r.blob && Blob.prototype.isPrototypeOf(b) ? this._bodyBlob = b : r.formData && FormData.prototype.isPrototypeOf(b) ? this._bodyFormData = b : r.searchParams && URLSearchParams.prototype.isPrototypeOf(b) ? this._bodyText = b.toString() : r.arrayBuffer && r.blob && s(b) ? (this._bodyArrayBuffer = B(b.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(b) || i(b)) ? this._bodyArrayBuffer = B(b) : this._bodyText = b = Object.prototype.toString.call(b) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof b == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(b) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
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
            return g(this._bodyBlob);
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
      var U = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function x(b) {
        var A = b.toUpperCase();
        return U.indexOf(A) > -1 ? A : b;
      }
      function $(b, A) {
        if (!(this instanceof $))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        A = A || {};
        var I = A.body;
        if (b instanceof $) {
          if (b.bodyUsed)
            throw new TypeError("Already read");
          this.url = b.url, this.credentials = b.credentials, A.headers || (this.headers = new l(b.headers)), this.method = b.method, this.mode = b.mode, this.signal = b.signal, !I && b._bodyInit != null && (I = b._bodyInit, b.bodyUsed = !0);
        } else
          this.url = String(b);
        if (this.credentials = A.credentials || this.credentials || "same-origin", (A.headers || !this.headers) && (this.headers = new l(A.headers)), this.method = x(A.method || this.method || "GET"), this.mode = A.mode || this.mode || null, this.signal = A.signal || this.signal || function() {
          if ("AbortController" in n) {
            var T = new AbortController();
            return T.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && I)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(I), (this.method === "GET" || this.method === "HEAD") && (A.cache === "no-store" || A.cache === "no-cache")) {
          var D = /([?&])_=[^&]*/;
          if (D.test(this.url))
            this.url = this.url.replace(D, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var j = /\?/;
            this.url += (j.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      $.prototype.clone = function() {
        return new $(this, { body: this._bodyInit });
      };
      function S(b) {
        var A = new FormData();
        return b.trim().split("&").forEach(function(I) {
          if (I) {
            var D = I.split("="), j = D.shift().replace(/\+/g, " "), T = D.join("=").replace(/\+/g, " ");
            A.append(decodeURIComponent(j), decodeURIComponent(T));
          }
        }), A;
      }
      function O(b) {
        var A = new l(), I = b.replace(/\r?\n[\t ]+/g, " ");
        return I.split("\r").map(function(D) {
          return D.indexOf(`
`) === 0 ? D.substr(1, D.length) : D;
        }).forEach(function(D) {
          var j = D.split(":"), T = j.shift().trim();
          if (T) {
            var _t = j.join(":").trim();
            try {
              A.append(T, _t);
            } catch (ht) {
              console.warn("Response " + ht.message);
            }
          }
        }), A;
      }
      H.call($.prototype);
      function P(b, A) {
        if (!(this instanceof P))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (A || (A = {}), this.type = "default", this.status = A.status === void 0 ? 200 : A.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = A.statusText === void 0 ? "" : "" + A.statusText, this.headers = new l(A.headers), this.url = A.url || "", this._initBody(b);
      }
      H.call(P.prototype), P.prototype.clone = function() {
        return new P(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new l(this.headers),
          url: this.url
        });
      }, P.error = function() {
        var b = new P(null, { status: 200, statusText: "" });
        return b.ok = !1, b.status = 0, b.type = "error", b;
      };
      var C = [301, 302, 303, 307, 308];
      P.redirect = function(b, A) {
        if (C.indexOf(A) === -1)
          throw new RangeError("Invalid status code");
        return new P(null, { status: A, headers: { location: b } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(A, I) {
          this.message = A, this.name = I;
          var D = Error(A);
          this.stack = D.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function k(b, A) {
        return new Promise(function(I, D) {
          var j = new $(b, A);
          if (j.signal && j.signal.aborted)
            return D(new e.DOMException("Aborted", "AbortError"));
          var T = new XMLHttpRequest();
          function _t() {
            T.abort();
          }
          T.onload = function() {
            var rt = {
              statusText: T.statusText,
              headers: O(T.getAllResponseHeaders() || "")
            };
            j.url.indexOf("file://") === 0 && (T.status < 200 || T.status > 599) ? rt.status = 200 : rt.status = T.status, rt.url = "responseURL" in T ? T.responseURL : rt.headers.get("X-Request-URL");
            var q = "response" in T ? T.response : T.responseText;
            setTimeout(function() {
              I(new P(q, rt));
            }, 0);
          }, T.onerror = function() {
            setTimeout(function() {
              D(new TypeError("Network request failed"));
            }, 0);
          }, T.ontimeout = function() {
            setTimeout(function() {
              D(new TypeError("Network request timed out"));
            }, 0);
          }, T.onabort = function() {
            setTimeout(function() {
              D(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function ht(rt) {
            try {
              return rt === "" && n.location.href ? n.location.href : rt;
            } catch {
              return rt;
            }
          }
          if (T.open(j.method, ht(j.url), !0), j.credentials === "include" ? T.withCredentials = !0 : j.credentials === "omit" && (T.withCredentials = !1), "responseType" in T && (r.blob ? T.responseType = "blob" : r.arrayBuffer && (T.responseType = "arraybuffer")), A && typeof A.headers == "object" && !(A.headers instanceof l || n.Headers && A.headers instanceof n.Headers)) {
            var gt = [];
            Object.getOwnPropertyNames(A.headers).forEach(function(rt) {
              gt.push(a(rt)), T.setRequestHeader(rt, f(A.headers[rt]));
            }), j.headers.forEach(function(rt, q) {
              gt.indexOf(q) === -1 && T.setRequestHeader(q, rt);
            });
          } else
            j.headers.forEach(function(rt, q) {
              T.setRequestHeader(q, rt);
            });
          j.signal && (j.signal.addEventListener("abort", _t), T.onreadystatechange = function() {
            T.readyState === 4 && j.signal.removeEventListener("abort", _t);
          }), T.send(typeof j._bodyInit > "u" ? null : j._bodyInit);
        });
      }
      return k.polyfill = !0, n.fetch || (n.fetch = k, n.Headers = l, n.Request = $, n.Response = P), e.Headers = l, e.Request = $, e.Response = P, e.fetch = k, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : pt);
})();
const dp = "https://browser.blockstack.org/auth", pp = {
  "@type": "Person",
  "@context": "http://schema.org"
}, e0 = ["store_write"], bp = "blockstack-session", gp = {
  logLevel: "debug"
}, tn = {
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
Object.freeze(tn);
class Tn extends Error {
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
class xp extends Tn {
  constructor(e, n = "") {
    super({ code: tn.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class _a extends Tn {
  constructor(e = "") {
    super({ code: tn.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Ur extends Tn {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: tn.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Ha extends Tn {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: tn.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class yo extends Tn {
  constructor(e) {
    super({ code: tn.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class n0 extends Tn {
  constructor(e) {
    super({ code: tn.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const La = ["debug", "info", "warn", "error", "none"], wo = {};
for (let t = 0; t < La.length; t++) {
  const e = La[t];
  wo[e] = t;
}
class Sn {
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
    return wo[gp.logLevel] <= wo[e];
  }
}
function yp() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function wp() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Ys(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function mp() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Sp() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Ep(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function ci(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Sp(), s) {
      const o = s[t];
      if (o)
        return o;
    }
  } catch (o) {
    Sn.error(`Error getting object '${t}' from global scope '${s}': ${o}`);
  }
  if (e) {
    const o = Ep(s, t.toString(), n);
    throw Sn.error(o), new Error(o);
  }
  if (r)
    return {};
}
function Ap(t) {
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
  if (Lp(t, Uint8Array))
    return BigInt(`0x${$t(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function vp(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function fi(t, e = 8) {
  return (typeof t == "bigint" ? t : Ap(t)).toString(16).padStart(e * 2, "0");
}
function r0(t, e = 16) {
  const n = fi(t, e);
  return St(n);
}
function Bp(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const $p = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function $t(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += $p[n];
  return e;
}
function St(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = vp(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    e[n] = o;
  }
  return e;
}
function cr(t) {
  return new TextEncoder().encode(t);
}
function s0(t) {
  return new TextDecoder().decode(t);
}
function _p(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Hp(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Ia(t) {
  if (t.some(Hp))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function re(...t) {
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
  return re(...t.map((e) => typeof e == "number" ? Ia([e]) : e instanceof Array ? Ia(e) : e));
}
function Lp(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const Ip = "https://api.mainnet.hiro.so", Up = "https://api.testnet.hiro.so", Op = "http://localhost:3999", Cp = "https://hub.blockstack.org";
function kp(t) {
  const e = typeof t == "string" ? St(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function ms(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const Pp = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Np(t, e) {
  const n = {};
  return Object.assign(n, Pp, e), await fetch(t, n);
}
function Dp(t) {
  let e = Np, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Tp(...t) {
  const { fetchLib: e, middlewares: n } = Dp(t);
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
class o0 {
  constructor(e = e0.slice(), n = ((a) => (a = ci("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", o = void 0, i = dp) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = o, this.authenticatorURL = i;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function mo(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Fp(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function i0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Mp(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  mo(t.outputLen), mo(t.blockLen);
}
function Rp(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Gp(t, e) {
  i0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ke = {
  number: mo,
  bool: Fp,
  bytes: i0,
  hash: Mp,
  exists: Rp,
  output: Gp
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Js = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Tt = (t, e) => t << 32 - e | t >>> e, Vp = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Vp)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Kp(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function hi(t) {
  if (typeof t == "string" && (t = Kp(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let a0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function en(t) {
  const e = (r) => t().update(hi(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let c0 = class extends a0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ke.hash(e);
    const r = hi(n);
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
    return Ke.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Ke.exists(this), Ke.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Ss = (t, e, n) => new c0(t, e).update(n).digest();
Ss.create = (t, e) => new c0(t, e);
function zp(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, i, r), t.setUint32(e + u, a, r);
}
let li = class extends a0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Js(this.buffer);
  }
  update(e) {
    Ke.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = hi(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const f = Js(e);
        for (; s <= o - i; i += s)
          this.process(f, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ke.exists(this), Ke.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let c = i; c < s; c++)
      n[c] = 0;
    zp(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Js(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = f / 4, l = this.get();
    if (u > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let c = 0; c < u; c++)
      a.setUint32(4 * c, l[c], o);
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
const jp = (t, e, n) => t & e ^ ~t & n, qp = (t, e, n) => t & e ^ t & n ^ e & n, Wp = new Uint32Array([
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
let f0 = class extends li {
  constructor() {
    super(64, 32, 8, !1), this.A = de[0] | 0, this.B = de[1] | 0, this.C = de[2] | 0, this.D = de[3] | 0, this.E = de[4] | 0, this.F = de[5] | 0, this.G = de[6] | 0, this.H = de[7] | 0;
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
      pe[c] = e.getUint32(n, !1);
    for (let c = 16; c < 64; c++) {
      const p = pe[c - 15], d = pe[c - 2], g = Tt(p, 7) ^ Tt(p, 18) ^ p >>> 3, y = Tt(d, 17) ^ Tt(d, 19) ^ d >>> 10;
      pe[c] = y + pe[c - 7] + g + pe[c - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: f, G: u, H: l } = this;
    for (let c = 0; c < 64; c++) {
      const p = Tt(a, 6) ^ Tt(a, 11) ^ Tt(a, 25), d = l + p + jp(a, f, u) + Wp[c] + pe[c] | 0, y = (Tt(r, 2) ^ Tt(r, 13) ^ Tt(r, 22)) + qp(r, s, o) | 0;
      l = u, u = f, f = a, a = i + d | 0, i = o, o = s, s = r, r = d + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, l = l + this.H | 0, this.set(r, s, o, i, a, f, u, l);
  }
  roundClean() {
    pe.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Xp = class extends f0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Ln = en(() => new f0());
en(() => new Xp());
var fr = {};
fr.byteLength = t1;
var Yp = fr.toByteArray = n1, Jp = fr.fromByteArray = o1, Vt = [], Bt = [], Zp = typeof Uint8Array < "u" ? Uint8Array : Array, Zs = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var xn = 0, Qp = Zs.length; xn < Qp; ++xn)
  Vt[xn] = Zs[xn], Bt[Zs.charCodeAt(xn)] = xn;
Bt[45] = 62;
Bt[95] = 63;
function h0(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function t1(t) {
  var e = h0(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function e1(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function n1(t) {
  var e, n = h0(t), r = n[0], s = n[1], o = new Zp(e1(t, r, s)), i = 0, a = s > 0 ? r - 4 : r, f;
  for (f = 0; f < a; f += 4)
    e = Bt[t.charCodeAt(f)] << 18 | Bt[t.charCodeAt(f + 1)] << 12 | Bt[t.charCodeAt(f + 2)] << 6 | Bt[t.charCodeAt(f + 3)], o[i++] = e >> 16 & 255, o[i++] = e >> 8 & 255, o[i++] = e & 255;
  return s === 2 && (e = Bt[t.charCodeAt(f)] << 2 | Bt[t.charCodeAt(f + 1)] >> 4, o[i++] = e & 255), s === 1 && (e = Bt[t.charCodeAt(f)] << 10 | Bt[t.charCodeAt(f + 1)] << 4 | Bt[t.charCodeAt(f + 2)] >> 2, o[i++] = e >> 8 & 255, o[i++] = e & 255), o;
}
function r1(t) {
  return Vt[t >> 18 & 63] + Vt[t >> 12 & 63] + Vt[t >> 6 & 63] + Vt[t & 63];
}
function s1(t, e, n) {
  for (var r, s = [], o = e; o < n; o += 3)
    r = (t[o] << 16 & 16711680) + (t[o + 1] << 8 & 65280) + (t[o + 2] & 255), s.push(r1(r));
  return s.join("");
}
function o1(t) {
  for (var e, n = t.length, r = n % 3, s = [], o = 16383, i = 0, a = n - r; i < a; i += o)
    s.push(s1(t, i, i + o > a ? a : i + o));
  return r === 1 ? (e = t[n - 1], s.push(
    Vt[e >> 2] + Vt[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    Vt[e >> 10] + Vt[e >> 4 & 63] + Vt[e << 2 & 63] + "="
  )), s.join("");
}
function i1() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const a1 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function c1() {
  if (i1())
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
    throw new Error(a1);
  }
}
class f1 {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const o = this.createCipher(e, n, r), i = new Uint8Array(re(o.update(s), o.final()));
    return Promise.resolve(i);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const o = this.createDecipher(e, n, r), i = new Uint8Array(re(o.update(s), o.final()));
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
async function l0() {
  const t = await c1();
  return t.name === "subtleCrypto" ? new h1(t.lib) : new f1(t.lib.createCipheriv, t.lib.createDecipheriv);
}
const l1 = Vf, u1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var d1 = l1(u1);
const p1 = /* @__PURE__ */ Ju(d1), b1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), u0 = Uint8Array.from({ length: 16 }, (t, e) => e), g1 = u0.map((t) => (9 * t + 5) % 16);
let ui = [u0], di = [g1];
for (let t = 0; t < 4; t++)
  for (let e of [ui, di])
    e.push(e[t].map((n) => b1[n]));
const d0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), x1 = ui.map((t, e) => t.map((n) => d0[e][n])), y1 = di.map((t, e) => t.map((n) => d0[e][n])), w1 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), m1 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Or = (t, e) => t << e | t >>> 32 - e;
function Ua(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Cr = new Uint32Array(16);
let S1 = class extends li {
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
      Cr[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, f = a, u = this.h3 | 0, l = u, c = this.h4 | 0, p = c;
    for (let d = 0; d < 5; d++) {
      const g = 4 - d, y = w1[d], B = m1[d], H = ui[d], U = di[d], x = x1[d], $ = y1[d];
      for (let S = 0; S < 16; S++) {
        const O = Or(r + Ua(d, o, a, u) + Cr[H[S]] + y, x[S]) + c | 0;
        r = c, c = u, u = Or(a, 10) | 0, a = o, o = O;
      }
      for (let S = 0; S < 16; S++) {
        const O = Or(s + Ua(g, i, f, l) + Cr[U[S]] + B, $[S]) + p | 0;
        s = p, p = l, l = Or(f, 10) | 0, f = i, i = O;
      }
    }
    this.set(this.h1 + a + l | 0, this.h2 + u + p | 0, this.h3 + c + s | 0, this.h4 + r + i | 0, this.h0 + o + f | 0);
  }
  roundClean() {
    Cr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const E1 = en(() => new S1());
function A1(t) {
  return E1(t);
}
const kr = BigInt(2 ** 32 - 1), So = BigInt(32);
function p0(t, e = !1) {
  return e ? { h: Number(t & kr), l: Number(t >> So & kr) } : { h: Number(t >> So & kr) | 0, l: Number(t & kr) | 0 };
}
function v1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = p0(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const B1 = (t, e) => BigInt(t >>> 0) << So | BigInt(e >>> 0), $1 = (t, e, n) => t >>> n, _1 = (t, e, n) => t << 32 - n | e >>> n, H1 = (t, e, n) => t >>> n | e << 32 - n, L1 = (t, e, n) => t << 32 - n | e >>> n, I1 = (t, e, n) => t << 64 - n | e >>> n - 32, U1 = (t, e, n) => t >>> n - 32 | e << 64 - n, O1 = (t, e) => e, C1 = (t, e) => t, k1 = (t, e, n) => t << n | e >>> 32 - n, P1 = (t, e, n) => e << n | t >>> 32 - n, N1 = (t, e, n) => e << n - 32 | t >>> 64 - n, D1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function T1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const F1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), M1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, R1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), G1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, V1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), K1 = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, G = {
  fromBig: p0,
  split: v1,
  toBig: B1,
  shrSH: $1,
  shrSL: _1,
  rotrSH: H1,
  rotrSL: L1,
  rotrBH: I1,
  rotrBL: U1,
  rotr32H: O1,
  rotr32L: C1,
  rotlSH: k1,
  rotlSL: P1,
  rotlBH: N1,
  rotlBL: D1,
  add: T1,
  add3L: F1,
  add3H: M1,
  add4L: R1,
  add4H: G1,
  add5H: K1,
  add5L: V1
}, [z1, j1] = G.split([
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
let Es = class extends li {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: f, Eh: u, El: l, Fh: c, Fl: p, Gh: d, Gl: g, Hh: y, Hl: B } = this;
    return [e, n, r, s, o, i, a, f, u, l, c, p, d, g, y, B];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, f, u, l, c, p, d, g, y, B) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = f | 0, this.Eh = u | 0, this.El = l | 0, this.Fh = c | 0, this.Fl = p | 0, this.Gh = d | 0, this.Gl = g | 0, this.Hh = y | 0, this.Hl = B | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      be[x] = e.getUint32(n), ge[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const $ = be[x - 15] | 0, S = ge[x - 15] | 0, O = G.rotrSH($, S, 1) ^ G.rotrSH($, S, 8) ^ G.shrSH($, S, 7), P = G.rotrSL($, S, 1) ^ G.rotrSL($, S, 8) ^ G.shrSL($, S, 7), C = be[x - 2] | 0, k = ge[x - 2] | 0, b = G.rotrSH(C, k, 19) ^ G.rotrBH(C, k, 61) ^ G.shrSH(C, k, 6), A = G.rotrSL(C, k, 19) ^ G.rotrBL(C, k, 61) ^ G.shrSL(C, k, 6), I = G.add4L(P, A, ge[x - 7], ge[x - 16]), D = G.add4H(I, O, b, be[x - 7], be[x - 16]);
      be[x] = D | 0, ge[x] = I | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: f, Dh: u, Dl: l, Eh: c, El: p, Fh: d, Fl: g, Gh: y, Gl: B, Hh: H, Hl: U } = this;
    for (let x = 0; x < 80; x++) {
      const $ = G.rotrSH(c, p, 14) ^ G.rotrSH(c, p, 18) ^ G.rotrBH(c, p, 41), S = G.rotrSL(c, p, 14) ^ G.rotrSL(c, p, 18) ^ G.rotrBL(c, p, 41), O = c & d ^ ~c & y, P = p & g ^ ~p & B, C = G.add5L(U, S, P, j1[x], ge[x]), k = G.add5H(C, H, $, O, z1[x], be[x]), b = C | 0, A = G.rotrSH(r, s, 28) ^ G.rotrBH(r, s, 34) ^ G.rotrBH(r, s, 39), I = G.rotrSL(r, s, 28) ^ G.rotrBL(r, s, 34) ^ G.rotrBL(r, s, 39), D = r & o ^ r & a ^ o & a, j = s & i ^ s & f ^ i & f;
      H = y | 0, U = B | 0, y = d | 0, B = g | 0, d = c | 0, g = p | 0, { h: c, l: p } = G.add(u | 0, l | 0, k | 0, b | 0), u = a | 0, l = f | 0, a = o | 0, f = i | 0, o = r | 0, i = s | 0;
      const T = G.add3L(b, I, j);
      r = G.add3H(T, k, A, D), s = T | 0;
    }
    ({ h: r, l: s } = G.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = G.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: f } = G.add(this.Ch | 0, this.Cl | 0, a | 0, f | 0), { h: u, l } = G.add(this.Dh | 0, this.Dl | 0, u | 0, l | 0), { h: c, l: p } = G.add(this.Eh | 0, this.El | 0, c | 0, p | 0), { h: d, l: g } = G.add(this.Fh | 0, this.Fl | 0, d | 0, g | 0), { h: y, l: B } = G.add(this.Gh | 0, this.Gl | 0, y | 0, B | 0), { h: H, l: U } = G.add(this.Hh | 0, this.Hl | 0, H | 0, U | 0), this.set(r, s, o, i, a, f, u, l, c, p, d, g, y, B, H, U);
  }
  roundClean() {
    be.fill(0), ge.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, q1 = class extends Es {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, W1 = class extends Es {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, X1 = class extends Es {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const Y1 = en(() => new Es());
en(() => new q1());
en(() => new W1());
en(() => new X1());
function b0(t) {
  return Ln(t);
}
function J1(t) {
  return Y1(t);
}
const Z1 = 0;
it.hmacSha256Sync = (t, ...e) => {
  const n = Ss.create(Ln, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Q1() {
  return $t(it.randomPrivateKey());
}
function t2(t) {
  const e = Ln(Ln(t));
  return p1.encode(re(t, e).slice(0, t.length + 4));
}
function e2(t, e) {
  return t2(re(new Uint8Array([t]), e.slice(0, 20)));
}
function g0(t, e = Z1) {
  const n = typeof t == "string" ? St(t) : t, r = A1(b0(n));
  return e2(e, r);
}
function x0(t) {
  const e = kp(t);
  return $t(Zo(e.slice(0, 32), !0));
}
it.hmacSha256Sync = (t, ...e) => {
  const n = Ss.create(Ln, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var os;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(os || (os = {}));
async function n2(t, e, n) {
  return await (await l0()).encrypt("aes-256-cbc", e, t, n);
}
async function r2(t, e, n) {
  return await (await l0()).decrypt("aes-256-cbc", e, t, n);
}
function y0(t, e) {
  return Ss(Ln, t, e);
}
function s2(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function w0(t) {
  const e = J1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function o2(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function i2(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: os.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: os.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !o2(t))
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
async function a2(t, e, n, r) {
  const s = i2(t);
  if (!s.result)
    throw s;
  const o = it.randomPrivateKey(), i = Zo(o, !0);
  let a = Qo(o, t, !0);
  a = a.slice(1);
  const f = w0(a), u = it.randomBytes(16), l = await n2(u, f.encryptionKey, e), c = re(u, i, l), p = y0(f.hmacKey, c);
  let d;
  if (!r || r === "hex")
    d = $t(l);
  else if (r === "base64")
    d = Jp(l);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const g = {
    iv: $t(u),
    ephemeralPK: $t(i),
    cipherText: d,
    mac: $t(p),
    wasString: n
  };
  return r && r !== "hex" && (g.cipherTextEncoding = r), g;
}
async function m0(t, e) {
  if (!e.ephemeralPK)
    throw new Ha("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = Qo(t, n, !0);
  r = r.slice(1);
  const s = w0(r), o = St(e.iv);
  let i;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    i = St(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    i = Yp(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = re(o, St(n), i), f = y0(s.hmacKey, a), u = St(e.mac);
  if (!s2(u, f))
    throw new Ha("Decryption failed: failure in MAC check");
  const l = await r2(o, s.encryptionKey, i);
  return e.wasString ? s0(l) : l;
}
function c2(t, e) {
  const n = typeof e == "string" ? cr(e) : e, r = x0(t), s = b0(n), o = Bf(s, t);
  return {
    signature: $t(o),
    publicKey: r
  };
}
async function f2(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = x0(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", o = typeof t == "string" ? cr(t) : t, i = await a2(n.publicKey, o, s, n.cipherTextEncoding);
  let a = JSON.stringify(i);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const f = c2(r, a), u = {
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
    return m0(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var bt = {}, In = {}, ut = {};
Object.defineProperty(ut, "__esModule", { value: !0 });
ut.decode = ut.encode = ut.unescape = ut.escape = ut.pad = void 0;
const S0 = fr;
function pi(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
ut.pad = pi;
function E0(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
ut.escape = E0;
function A0(t) {
  return pi(t).replace(/-/g, "+").replace(/_/g, "/");
}
ut.unescape = A0;
function l2(t) {
  return E0((0, S0.fromByteArray)(new TextEncoder().encode(t)));
}
ut.encode = l2;
function u2(t) {
  return new TextDecoder().decode((0, S0.toByteArray)(pi(A0(t))));
}
ut.decode = u2;
var As = {}, vs = {};
let bi = class extends si {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Of(e);
    const r = Dn(n);
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
    this.oHash.update(o), er(o);
  }
  update(e) {
    return tr(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    tr(this), Te(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const v0 = (t, e, n) => new bi(t, e).update(n).digest();
v0.create = (t, e) => new bi(t, e);
const d2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HMAC: bi,
  hmac: v0
}, Symbol.toStringTag, { value: "Module" })), p2 = /* @__PURE__ */ or(d2), b2 = /* @__PURE__ */ or(Yu);
var Un = {};
Object.defineProperty(Un, "__esModule", { value: !0 });
Un.joseToDer = Un.derToJose = void 0;
const B0 = fr, $0 = ut;
function Qs(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const g2 = {
  ES256: Qs(256),
  ES384: Qs(384),
  ES512: Qs(521)
};
function _0(t) {
  const e = g2[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const is = 128, H0 = 0, x2 = 32, y2 = 16, w2 = 2, L0 = y2 | x2 | H0 << 6, as = w2 | H0 << 6;
function I0(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, B0.toByteArray)((0, $0.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function m2(t, e) {
  const n = I0(t), r = _0(e), s = r + 1, o = n.length;
  let i = 0;
  if (n[i++] !== L0)
    throw new Error('Could not find expected "seq"');
  let a = n[i++];
  if (a === (is | 1) && (a = n[i++]), o - i < a)
    throw new Error(`"seq" specified length of "${a}", only "${o - i}" remaining`);
  if (n[i++] !== as)
    throw new Error('Could not find expected "int" for "r"');
  const f = n[i++];
  if (o - i - 2 < f)
    throw new Error(`"r" specified length of "${f}", only "${o - i - 2}" available`);
  if (s < f)
    throw new Error(`"r" specified length of "${f}", max of "${s}" is acceptable`);
  const u = i;
  if (i += f, n[i++] !== as)
    throw new Error('Could not find expected "int" for "s"');
  const l = n[i++];
  if (o - i !== l)
    throw new Error(`"s" specified length of "${l}", expected "${o - i}"`);
  if (s < l)
    throw new Error(`"s" specified length of "${l}", max of "${s}" is acceptable`);
  const c = i;
  if (i += l, i !== o)
    throw new Error(`Expected to consume entire array, but "${o - i}" bytes remain`);
  const p = r - f, d = r - l, g = new Uint8Array(p + f + d + l);
  for (i = 0; i < p; ++i)
    g[i] = 0;
  g.set(n.subarray(u + Math.max(-p, 0), u + f), i), i = r;
  for (const y = i; i < y + d; ++i)
    g[i] = 0;
  return g.set(n.subarray(c + Math.max(-d, 0), c + l), i), (0, $0.escape)((0, B0.fromByteArray)(g));
}
Un.derToJose = m2;
function Oa(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= is && --r, r;
}
function S2(t, e) {
  t = I0(t);
  const n = _0(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Oa(t, 0, n), o = Oa(t, n, t.length), i = n - s, a = n - o, f = 2 + i + 1 + 1 + a, u = f < is, l = new Uint8Array((u ? 2 : 3) + f);
  let c = 0;
  return l[c++] = L0, u ? l[c++] = f : (l[c++] = is | 1, l[c++] = f & 255), l[c++] = as, l[c++] = i, s < 0 ? (l[c++] = 0, l.set(t.subarray(0, n), c), c += n) : (l.set(t.subarray(s, n), c), c += n - s), l[c++] = as, l[c++] = a, o < 0 ? (l[c++] = 0, l.set(t.subarray(n), c)) : l.set(t.subarray(n + o), c), l;
}
Un.joseToDer = S2;
var se = {};
Object.defineProperty(se, "__esModule", { value: !0 });
se.InvalidTokenError = se.MissingParametersError = void 0;
class E2 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
se.MissingParametersError = E2;
class A2 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
se.InvalidTokenError = A2;
Object.defineProperty(vs, "__esModule", { value: !0 });
vs.SECP256K1Client = void 0;
const v2 = p2, B2 = ws, Jr = b2, Ca = Un, ka = se, Pa = ir;
Jr.utils.hmacSha256Sync = (t, ...e) => {
  const n = v2.hmac.create(B2.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class U0 {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Pa.bytesToHex)(Jr.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new ka.MissingParametersError("a signing input hash and private key are all required");
    const s = Jr.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Pa.bytesToHex)(s);
    if (r === "jose")
      return (0, Ca.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Ca.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new ka.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Jr.verify(n, e, r, { strict: !1 });
  }
}
vs.SECP256K1Client = U0;
U0.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = vs;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(As);
var Ye = {};
const $2 = /* @__PURE__ */ or(gf);
var _2 = pt && pt.__awaiter || function(t, e, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
    function a(l) {
      try {
        u(r.next(l));
      } catch (c) {
        i(c);
      }
    }
    function f(l) {
      try {
        u(r.throw(l));
      } catch (c) {
        i(c);
      }
    }
    function u(l) {
      l.done ? o(l.value) : s(l.value).then(a, f);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Ye, "__esModule", { value: !0 });
Ye.hashSha256Async = Ye.hashSha256 = void 0;
const H2 = ws;
function O0(t) {
  return (0, H2.sha256)(t);
}
Ye.hashSha256 = O0;
function L2(t) {
  return _2(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = $2;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(O0(t));
    }
  });
}
Ye.hashSha256Async = L2;
var I2 = pt && pt.__awaiter || function(t, e, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
    function a(l) {
      try {
        u(r.next(l));
      } catch (c) {
        i(c);
      }
    }
    function f(l) {
      try {
        u(r.throw(l));
      } catch (c) {
        i(c);
      }
    }
    function u(l) {
      l.done ? o(l.value) : s(l.value).then(a, f);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(In, "__esModule", { value: !0 });
In.TokenSigner = In.createUnsecuredToken = void 0;
const Eo = ut, Na = As, U2 = se, Da = Ye;
function Ao(t, e) {
  const n = [], r = Eo.encode(JSON.stringify(e));
  n.push(r);
  const s = Eo.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function O2(t) {
  return Ao(t, { typ: "JWT", alg: "none" }) + ".";
}
In.createUnsecuredToken = O2;
class C2 {
  constructor(e, n) {
    if (!(e && n))
      throw new U2.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Na.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Na.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), o = Ao(e, s), i = (0, Da.hashSha256)(o);
    return this.createWithSignedHash(e, n, s, o, i);
  }
  signAsync(e, n = !1, r = {}) {
    return I2(this, void 0, void 0, function* () {
      const s = this.header(r), o = Ao(e, s), i = yield (0, Da.hashSha256Async)(o);
      return this.createWithSignedHash(e, n, s, o, i);
    });
  }
  createWithSignedHash(e, n, r, s, o) {
    const i = this.cryptoClient.signHash(o, this.rawPrivateKey);
    return n ? {
      header: [Eo.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [i]
    } : [s, i].join(".");
  }
}
In.TokenSigner = C2;
var Bs = {};
Object.defineProperty(Bs, "__esModule", { value: !0 });
Bs.TokenVerifier = void 0;
const k2 = ut, Ta = As, P2 = se, Pr = Ye;
class N2 {
  constructor(e, n) {
    if (!(e && n))
      throw new P2.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Ta.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Ta.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, Pr.hashSha256Async)(s).then((i) => o(i));
    {
      const i = (0, Pr.hashSha256)(s);
      return o(i);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), k2.encode(e.payload)].join(".");
    let s = !0;
    const o = (i) => (e.signature.map((a) => {
      const f = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(i, f, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Pr.hashSha256Async)(r).then((i) => o(i));
    {
      const i = (0, Pr.hashSha256)(r);
      return o(i);
    }
  }
}
Bs.TokenVerifier = N2;
var $s = {};
Object.defineProperty($s, "__esModule", { value: !0 });
$s.decodeToken = void 0;
const Nr = ut;
function D2(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Nr.decode(e[0])), r = JSON.parse(Nr.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Nr.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Nr.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
$s.decodeToken = D2;
(function(t) {
  var e = pt && pt.__createBinding || (Object.create ? function(r, s, o, i) {
    i === void 0 && (i = o);
    var a = Object.getOwnPropertyDescriptor(s, o);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[o];
    } }), Object.defineProperty(r, i, a);
  } : function(r, s, o, i) {
    i === void 0 && (i = o), r[i] = s[o];
  }), n = pt && pt.__exportStar || function(r, s) {
    for (var o in r) o !== "default" && !Object.prototype.hasOwnProperty.call(s, o) && e(s, r, o);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(In, t), n(Bs, t), n($s, t), n(se, t), n(As, t);
})(bt);
function T2(t) {
  return `did:btc-addr:${t}`;
}
function F2(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new _a("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new _a('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function C0(t) {
  if (t)
    return F2(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const M2 = "1.4.0";
function R2() {
  return Q1();
}
function G2(t, e, n, r = e0.slice(), s, o = yp().getTime(), i = {}) {
  const a = (d) => {
    const g = ci("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${d}=undefined])`
    });
    return g == null ? void 0 : g.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const f = Object.assign({}, i, {
    jti: mp(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(o / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: M2,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = bt.SECP256K1Client.derivePublicKey(t);
  f.public_keys = [u];
  const l = g0(u);
  return f.iss = T2(l), new bt.TokenSigner("ES256k", t).sign(f);
}
async function Fa(t, e) {
  const n = s0(St(e)), r = JSON.parse(n), s = await m0(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function V2(t) {
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
function K2(t) {
  const e = bt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = C0(e.iss);
  if (n.length === 1) {
    if (g0(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function z2(t) {
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
function j2(t) {
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
function q2(t) {
  const e = [
    j2(t),
    z2(t),
    V2(t),
    K2(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Ma = "1.0.0";
class De {
  constructor(e) {
    this.version = Ma, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Ma)
      throw new yo(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new De(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class k0 {
  constructor(e) {
    if (e) {
      const n = new De(e);
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
class Ra extends k0 {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new De({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new n0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new De({})), !0;
  }
}
class Ga extends k0 {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = bp, !localStorage.getItem(this.key)) {
      const r = new De({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new n0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return De.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new De({})), !0;
  }
}
var nr;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(nr || (nr = {}));
var cs;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(cs || (cs = {}));
nr.Mainnet;
var te;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(te || (te = {}));
var zt;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(zt || (zt = {}));
te.Mainnet;
const P0 = {
  chainId: nr.Mainnet,
  transactionVersion: te.Mainnet,
  peerNetworkId: cs.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: zt.MainnetSingleSig,
    multiSig: zt.MainnetMultiSig
  },
  client: { baseUrl: Ip }
}, vo = {
  chainId: nr.Testnet,
  transactionVersion: te.Testnet,
  peerNetworkId: cs.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: zt.TestnetSingleSig,
    multiSig: zt.TestnetMultiSig
  },
  client: { baseUrl: Up }
}, Zr = {
  ...vo,
  addressVersion: { ...vo.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Op }
}, W2 = {
  ...Zr,
  addressVersion: { ...Zr.addressVersion },
  client: { ...Zr.client }
};
function X2(t) {
  switch (t) {
    case "mainnet":
      return P0;
    case "testnet":
      return vo;
    case "devnet":
      return Zr;
    case "mocknet":
      return W2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function N0(t) {
  return typeof t == "string" ? X2(t) : t;
}
var Va;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Va || (Va = {}));
var Ka;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Ka || (Ka = {}));
var Ct;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ct || (Ct = {}));
const to = ["onChainOnly", "offChainOnly", "any"];
to[0] + "", Ct.OnChainOnly, to[1] + "", Ct.OffChainOnly, to[2] + "", Ct.Any, Ct.OnChainOnly + "", Ct.OnChainOnly, Ct.OffChainOnly + "", Ct.OffChainOnly, Ct.Any + "", Ct.Any;
var za;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(za || (za = {}));
var ja;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(ja || (ja = {}));
var qa;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(qa || (qa = {}));
var Qt;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Qt || (Qt = {}));
var Wa;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Wa || (Wa = {}));
var Xa;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Xa || (Xa = {}));
var Ya;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Ya || (Ya = {}));
var Ja;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Ja || (Ja = {}));
var Za;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Za || (Za = {}));
var Qa;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Qa || (Qa = {}));
var tc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(tc || (tc = {}));
var ec;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(ec || (ec = {}));
var nc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(nc || (nc = {}));
function Bo(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Y2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function D0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function J2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Bo(t.outputLen), Bo(t.blockLen);
}
function Z2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Q2(t, e) {
  D0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ze = {
  number: Bo,
  bool: Y2,
  bytes: D0,
  hash: J2,
  exists: Z2,
  output: Q2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const eo = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ft = (t, e) => t << 32 - e | t >>> e, tb = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!tb)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function eb(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function gi(t) {
  if (typeof t == "string" && (t = eb(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let T0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function nn(t) {
  const e = (r) => t().update(gi(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
class F0 extends T0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ze.hash(e);
    const r = gi(n);
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
    return ze.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    ze.exists(this), ze.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const M0 = (t, e, n) => new F0(t, e).update(n).digest();
M0.create = (t, e) => new F0(t, e);
function nb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, i, r), t.setUint32(e + u, a, r);
}
let xi = class extends T0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = eo(this.buffer);
  }
  update(e) {
    ze.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = gi(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const f = eo(e);
        for (; s <= o - i; i += s)
          this.process(f, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ze.exists(this), ze.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let c = i; c < s; c++)
      n[c] = 0;
    nb(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = eo(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = f / 4, l = this.get();
    if (u > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let c = 0; c < u; c++)
      a.setUint32(4 * c, l[c], o);
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
const rb = (t, e, n) => t & e ^ ~t & n, sb = (t, e, n) => t & e ^ t & n ^ e & n, ob = new Uint32Array([
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
]), ye = new Uint32Array(64);
let R0 = class extends xi {
  constructor() {
    super(64, 32, 8, !1), this.A = xe[0] | 0, this.B = xe[1] | 0, this.C = xe[2] | 0, this.D = xe[3] | 0, this.E = xe[4] | 0, this.F = xe[5] | 0, this.G = xe[6] | 0, this.H = xe[7] | 0;
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
      ye[c] = e.getUint32(n, !1);
    for (let c = 16; c < 64; c++) {
      const p = ye[c - 15], d = ye[c - 2], g = Ft(p, 7) ^ Ft(p, 18) ^ p >>> 3, y = Ft(d, 17) ^ Ft(d, 19) ^ d >>> 10;
      ye[c] = y + ye[c - 7] + g + ye[c - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: f, G: u, H: l } = this;
    for (let c = 0; c < 64; c++) {
      const p = Ft(a, 6) ^ Ft(a, 11) ^ Ft(a, 25), d = l + p + rb(a, f, u) + ob[c] + ye[c] | 0, y = (Ft(r, 2) ^ Ft(r, 13) ^ Ft(r, 22)) + sb(r, s, o) | 0;
      l = u, u = f, f = a, a = i + d | 0, i = o, o = s, s = r, r = d + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, l = l + this.H | 0, this.set(r, s, o, i, a, f, u, l);
  }
  roundClean() {
    ye.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, ib = class extends R0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const G0 = nn(() => new R0());
nn(() => new ib());
function ab(t, e) {
  switch (e = N0(e ?? P0), t) {
    case Qt.P2PKH:
      switch (e.transactionVersion) {
        case te.Mainnet:
          return zt.MainnetSingleSig;
        case te.Testnet:
          return zt.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case Qt.P2SH:
    case Qt.P2SHNonSequential:
    case Qt.P2WPKH:
    case Qt.P2WSH:
    case Qt.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case te.Mainnet:
          return zt.MainnetMultiSig;
        case te.Testnet:
          return zt.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const cb = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), V0 = Uint8Array.from({ length: 16 }, (t, e) => e), fb = V0.map((t) => (9 * t + 5) % 16);
let yi = [V0], wi = [fb];
for (let t = 0; t < 4; t++)
  for (let e of [yi, wi])
    e.push(e[t].map((n) => cb[n]));
const K0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), hb = yi.map((t, e) => t.map((n) => K0[e][n])), lb = wi.map((t, e) => t.map((n) => K0[e][n])), ub = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), db = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Dr = (t, e) => t << e | t >>> 32 - e;
function rc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Tr = new Uint32Array(16);
let pb = class extends xi {
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
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, f = a, u = this.h3 | 0, l = u, c = this.h4 | 0, p = c;
    for (let d = 0; d < 5; d++) {
      const g = 4 - d, y = ub[d], B = db[d], H = yi[d], U = wi[d], x = hb[d], $ = lb[d];
      for (let S = 0; S < 16; S++) {
        const O = Dr(r + rc(d, o, a, u) + Tr[H[S]] + y, x[S]) + c | 0;
        r = c, c = u, u = Dr(a, 10) | 0, a = o, o = O;
      }
      for (let S = 0; S < 16; S++) {
        const O = Dr(s + rc(g, i, f, l) + Tr[U[S]] + B, $[S]) + p | 0;
        s = p, p = l, l = Dr(f, 10) | 0, f = i, i = O;
      }
    }
    this.set(this.h1 + a + l | 0, this.h2 + u + p | 0, this.h3 + c + s | 0, this.h4 + r + i | 0, this.h0 + o + f | 0);
  }
  roundClean() {
    Tr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const bb = nn(() => new pb()), Fr = BigInt(2 ** 32 - 1), $o = BigInt(32);
function z0(t, e = !1) {
  return e ? { h: Number(t & Fr), l: Number(t >> $o & Fr) } : { h: Number(t >> $o & Fr) | 0, l: Number(t & Fr) | 0 };
}
function gb(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = z0(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const xb = (t, e) => BigInt(t >>> 0) << $o | BigInt(e >>> 0), yb = (t, e, n) => t >>> n, wb = (t, e, n) => t << 32 - n | e >>> n, mb = (t, e, n) => t >>> n | e << 32 - n, Sb = (t, e, n) => t << 32 - n | e >>> n, Eb = (t, e, n) => t << 64 - n | e >>> n - 32, Ab = (t, e, n) => t >>> n - 32 | e << 64 - n, vb = (t, e) => e, Bb = (t, e) => t, $b = (t, e, n) => t << n | e >>> 32 - n, _b = (t, e, n) => e << n | t >>> 32 - n, Hb = (t, e, n) => e << n - 32 | t >>> 64 - n, Lb = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Ib(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Ub = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Ob = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Cb = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), kb = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Pb = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Nb = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, V = {
  fromBig: z0,
  split: gb,
  toBig: xb,
  shrSH: yb,
  shrSL: wb,
  rotrSH: mb,
  rotrSL: Sb,
  rotrBH: Eb,
  rotrBL: Ab,
  rotr32H: vb,
  rotr32L: Bb,
  rotlSH: $b,
  rotlSL: _b,
  rotlBH: Hb,
  rotlBL: Lb,
  add: Ib,
  add3L: Ub,
  add3H: Ob,
  add4L: Cb,
  add4H: kb,
  add5H: Nb,
  add5L: Pb
}, [Db, Tb] = V.split([
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
].map((t) => BigInt(t))), we = new Uint32Array(80), me = new Uint32Array(80);
let _s = class extends xi {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: f, Eh: u, El: l, Fh: c, Fl: p, Gh: d, Gl: g, Hh: y, Hl: B } = this;
    return [e, n, r, s, o, i, a, f, u, l, c, p, d, g, y, B];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, f, u, l, c, p, d, g, y, B) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = f | 0, this.Eh = u | 0, this.El = l | 0, this.Fh = c | 0, this.Fl = p | 0, this.Gh = d | 0, this.Gl = g | 0, this.Hh = y | 0, this.Hl = B | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      we[x] = e.getUint32(n), me[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const $ = we[x - 15] | 0, S = me[x - 15] | 0, O = V.rotrSH($, S, 1) ^ V.rotrSH($, S, 8) ^ V.shrSH($, S, 7), P = V.rotrSL($, S, 1) ^ V.rotrSL($, S, 8) ^ V.shrSL($, S, 7), C = we[x - 2] | 0, k = me[x - 2] | 0, b = V.rotrSH(C, k, 19) ^ V.rotrBH(C, k, 61) ^ V.shrSH(C, k, 6), A = V.rotrSL(C, k, 19) ^ V.rotrBL(C, k, 61) ^ V.shrSL(C, k, 6), I = V.add4L(P, A, me[x - 7], me[x - 16]), D = V.add4H(I, O, b, we[x - 7], we[x - 16]);
      we[x] = D | 0, me[x] = I | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: f, Dh: u, Dl: l, Eh: c, El: p, Fh: d, Fl: g, Gh: y, Gl: B, Hh: H, Hl: U } = this;
    for (let x = 0; x < 80; x++) {
      const $ = V.rotrSH(c, p, 14) ^ V.rotrSH(c, p, 18) ^ V.rotrBH(c, p, 41), S = V.rotrSL(c, p, 14) ^ V.rotrSL(c, p, 18) ^ V.rotrBL(c, p, 41), O = c & d ^ ~c & y, P = p & g ^ ~p & B, C = V.add5L(U, S, P, Tb[x], me[x]), k = V.add5H(C, H, $, O, Db[x], we[x]), b = C | 0, A = V.rotrSH(r, s, 28) ^ V.rotrBH(r, s, 34) ^ V.rotrBH(r, s, 39), I = V.rotrSL(r, s, 28) ^ V.rotrBL(r, s, 34) ^ V.rotrBL(r, s, 39), D = r & o ^ r & a ^ o & a, j = s & i ^ s & f ^ i & f;
      H = y | 0, U = B | 0, y = d | 0, B = g | 0, d = c | 0, g = p | 0, { h: c, l: p } = V.add(u | 0, l | 0, k | 0, b | 0), u = a | 0, l = f | 0, a = o | 0, f = i | 0, o = r | 0, i = s | 0;
      const T = V.add3L(b, I, j);
      r = V.add3H(T, k, A, D), s = T | 0;
    }
    ({ h: r, l: s } = V.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = V.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: f } = V.add(this.Ch | 0, this.Cl | 0, a | 0, f | 0), { h: u, l } = V.add(this.Dh | 0, this.Dl | 0, u | 0, l | 0), { h: c, l: p } = V.add(this.Eh | 0, this.El | 0, c | 0, p | 0), { h: d, l: g } = V.add(this.Fh | 0, this.Fl | 0, d | 0, g | 0), { h: y, l: B } = V.add(this.Gh | 0, this.Gl | 0, y | 0, B | 0), { h: H, l: U } = V.add(this.Hh | 0, this.Hl | 0, H | 0, U | 0), this.set(r, s, o, i, a, f, u, l, c, p, d, g, y, B, H, U);
  }
  roundClean() {
    we.fill(0), me.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Fb = class extends _s {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Mb = class extends _s {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Rb = class extends _s {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
nn(() => new _s());
nn(() => new Fb());
nn(() => new Mb());
nn(() => new Rb());
var _o;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(_o || (_o = {}));
function Gb(t, e) {
  return { type: _o.Address, version: t, hash160: e };
}
function Vb(t) {
  return Nn.c32address(t.version, t.hash160);
}
const Kb = (t) => bb(G0(t)), zb = (t) => $t(Kb(t));
it.hmacSha256Sync = (t, ...e) => {
  const n = M0.create(G0, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function jb(t, e = "mainnet") {
  e = N0(e), t = typeof t == "string" ? St(t) : t;
  const n = ab(Qt.P2PKH, e), r = Gb(n, zb(t));
  return Vb(r);
}
function qb(t, e) {
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
  const s = r.issuer.publicKey, o = jb(s);
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
function Wb(t, e = null) {
  let n;
  e ? n = qb(t, e) : n = bt.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const sc = "_blockstackDidCheckEchoReply", Xb = "echoReply", Yb = "authContinuation";
function Jb(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, o] = r.split("=");
    return n[s] = o ? decodeURIComponent(o.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function Zb() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[sc];
  if (typeof e == "boolean")
    return e;
  const n = Jb(t.location.search), r = n[Xb];
  if (r) {
    t[sc] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const o = n[Yb];
      t.location.href = o;
    }, 10), !0;
  }
  return !1;
}
class Ho {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new o0();
    else
      throw new xp("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new Ga(e.sessionOptions) : this.store = new Ga() : e ? this.store = new Ra(e.sessionOptions) : this.store = new Ra();
  }
  makeAuthRequestToken(e, n, r, s, o, i = wp().getTime(), a = {}) {
    const f = this.appConfig;
    if (!f)
      throw new yo("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || f.redirectURI(), r = r || f.manifestURI(), s = s || f.scopes, o = o || f.appDomain, G2(e, n, r, s, o, i, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = R2();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = ci("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (Zb())
        return Sn.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Sn.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = Tp()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Ur("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const o = bt.decodeToken(e).payload;
    if (typeof o == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await q2(e))
      throw new Ur("Invalid authentication response.");
    let a = o.private_key, f = o.core_token;
    if (Ys(o.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (o.private_key !== void 0 && o.private_key !== null)
          try {
            a = await Fa(s, o.private_key);
          } catch {
            if (Sn.warn("Failed decryption of appPrivateKey, will try to use as given"), !it.isValidPrivateKey(o.private_key))
              throw new Ur("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (f != null)
          try {
            f = await Fa(s, f);
          } catch {
            Sn.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Ur("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = Cp, l;
    Ys(o.version, "1.2.0") && o.hubUrl !== null && o.hubUrl !== void 0 && (u = o.hubUrl), Ys(o.version, "1.3.0") && o.associationToken !== null && o.associationToken !== void 0 && (l = o.associationToken);
    const c = {
      profile: o.profile,
      email: o.email,
      decentralizedID: o.iss,
      identityAddress: C0(o.iss),
      appPrivateKey: a,
      coreSessionToken: f,
      authResponseToken: e,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: o.appPrivateKeyFromWalletSalt,
      coreNode: o.blockstackAPIUrl,
      gaiaAssociationToken: l
    }, p = o.profile_url;
    if (!c.profile && p) {
      const d = await n(p);
      if (!d.ok)
        c.profile = Object.assign({}, pp);
      else {
        const g = await d.text(), y = JSON.parse(g);
        c.profile = Wb(y[0].token);
      }
    } else
      c.profile = o.profile;
    return r.userData = c, this.store.setSessionData(r), c;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new yo("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), f2(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), h2(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
Ho.prototype.makeAuthRequest = Ho.prototype.makeAuthRequestToken;
const Qb = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), j0 = "STX_PROVIDER", q0 = () => typeof window > "u" ? null : window.localStorage.getItem(j0), tg = (t) => {
  typeof window < "u" && window.localStorage.setItem(j0, t);
}, eg = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function ng(t, e) {
  const n = {};
  return Object.assign(n, eg, e), await fetch(t, n);
}
function rg(t) {
  let e = ng, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function sg(...t) {
  const { fetchLib: e, middlewares: n } = rg(t);
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
var On;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(On || (On = {}));
var Je;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Je || (Je = {}));
var oc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(oc || (oc = {}));
const og = "https://api.mainnet.hiro.so", ig = "https://api.testnet.hiro.so", ag = "http://localhost:3999", cg = ["mainnet", "testnet", "devnet", "mocknet"];
class Ze {
  constructor(e) {
    this.version = Je.Mainnet, this.chainId = On.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Je.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? sg();
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
Ze.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Lo();
    case "testnet":
      return new Io();
    case "devnet":
      return new fg();
    case "mocknet":
      return new W0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${cg.join(", ")}`);
  }
};
Ze.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Ze.fromName(t);
class Lo extends Ze {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? og,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Je.Mainnet, this.chainId = On.Mainnet;
  }
}
class Io extends Ze {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? ig,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Je.Testnet, this.chainId = On.Testnet;
  }
}
class W0 extends Ze {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? ag,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Je.Testnet, this.chainId = On.Testnet;
  }
}
const fg = W0;
var Uo;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Uo || (Uo = {}));
var ic;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ic || (ic = {}));
Uo.Mainnet;
var fs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(fs || (fs = {}));
var ac;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ac || (ac = {}));
fs.Mainnet;
const hg = 128, lg = 128, X0 = 16;
var cc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(cc || (cc = {}));
var fc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(fc || (fc = {}));
var kt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(kt || (kt = {}));
const no = ["onChainOnly", "offChainOnly", "any"];
no[0] + "", kt.OnChainOnly, no[1] + "", kt.OffChainOnly, no[2] + "", kt.Any, kt.OnChainOnly + "", kt.OnChainOnly, kt.OffChainOnly + "", kt.OffChainOnly, kt.Any + "", kt.Any;
var hc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(hc || (hc = {}));
var lc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(lc || (lc = {}));
var uc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(uc || (uc = {}));
var dc;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(dc || (dc = {}));
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
var yc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(yc || (yc = {}));
var wc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(wc || (wc = {}));
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
let ug = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, dg = class extends ug {
  constructor(e) {
    super(e);
  }
};
function Oo(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function pg(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Y0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function bg(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Oo(t.outputLen), Oo(t.blockLen);
}
function gg(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function xg(t, e) {
  Y0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ro = {
  number: Oo,
  bool: pg,
  bytes: Y0,
  hash: bg,
  exists: gg,
  output: xg
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const so = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Mt = (t, e) => t << 32 - e | t >>> e, yg = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!yg)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function wg(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function J0(t) {
  if (typeof t == "string" && (t = wg(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let mg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function rn(t) {
  const e = (r) => t().update(J0(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Sg(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, i, r), t.setUint32(e + u, a, r);
}
let mi = class extends mg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = so(this.buffer);
  }
  update(e) {
    ro.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = J0(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const f = so(e);
        for (; s <= o - i; i += s)
          this.process(f, i);
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
    for (let c = i; c < s; c++)
      n[c] = 0;
    Sg(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = so(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = f / 4, l = this.get();
    if (u > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let c = 0; c < u; c++)
      a.setUint32(4 * c, l[c], o);
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
const Eg = (t, e, n) => t & e ^ ~t & n, Ag = (t, e, n) => t & e ^ t & n ^ e & n, vg = new Uint32Array([
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
let Z0 = class extends mi {
  constructor() {
    super(64, 32, 8, !1), this.A = Se[0] | 0, this.B = Se[1] | 0, this.C = Se[2] | 0, this.D = Se[3] | 0, this.E = Se[4] | 0, this.F = Se[5] | 0, this.G = Se[6] | 0, this.H = Se[7] | 0;
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
      Ee[c] = e.getUint32(n, !1);
    for (let c = 16; c < 64; c++) {
      const p = Ee[c - 15], d = Ee[c - 2], g = Mt(p, 7) ^ Mt(p, 18) ^ p >>> 3, y = Mt(d, 17) ^ Mt(d, 19) ^ d >>> 10;
      Ee[c] = y + Ee[c - 7] + g + Ee[c - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: f, G: u, H: l } = this;
    for (let c = 0; c < 64; c++) {
      const p = Mt(a, 6) ^ Mt(a, 11) ^ Mt(a, 25), d = l + p + Eg(a, f, u) + vg[c] + Ee[c] | 0, y = (Mt(r, 2) ^ Mt(r, 13) ^ Mt(r, 22)) + Ag(r, s, o) | 0;
      l = u, u = f, f = a, a = i + d | 0, i = o, o = s, s = r, r = d + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, l = l + this.H | 0, this.set(r, s, o, i, a, f, u, l);
  }
  roundClean() {
    Ee.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Bg = class extends Z0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
rn(() => new Z0());
rn(() => new Bg());
const $g = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Q0 = Uint8Array.from({ length: 16 }, (t, e) => e), _g = Q0.map((t) => (9 * t + 5) % 16);
let Si = [Q0], Ei = [_g];
for (let t = 0; t < 4; t++)
  for (let e of [Si, Ei])
    e.push(e[t].map((n) => $g[n]));
const th = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Hg = Si.map((t, e) => t.map((n) => th[e][n])), Lg = Ei.map((t, e) => t.map((n) => th[e][n])), Ig = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Ug = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Mr = (t, e) => t << e | t >>> 32 - e;
function Ac(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Rr = new Uint32Array(16);
let Og = class extends mi {
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
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, f = a, u = this.h3 | 0, l = u, c = this.h4 | 0, p = c;
    for (let d = 0; d < 5; d++) {
      const g = 4 - d, y = Ig[d], B = Ug[d], H = Si[d], U = Ei[d], x = Hg[d], $ = Lg[d];
      for (let S = 0; S < 16; S++) {
        const O = Mr(r + Ac(d, o, a, u) + Rr[H[S]] + y, x[S]) + c | 0;
        r = c, c = u, u = Mr(a, 10) | 0, a = o, o = O;
      }
      for (let S = 0; S < 16; S++) {
        const O = Mr(s + Ac(g, i, f, l) + Rr[U[S]] + B, $[S]) + p | 0;
        s = p, p = l, l = Mr(f, 10) | 0, f = i, i = O;
      }
    }
    this.set(this.h1 + a + l | 0, this.h2 + u + p | 0, this.h3 + c + s | 0, this.h4 + r + i | 0, this.h0 + o + f | 0);
  }
  roundClean() {
    Rr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
rn(() => new Og());
const Gr = BigInt(2 ** 32 - 1), Co = BigInt(32);
function eh(t, e = !1) {
  return e ? { h: Number(t & Gr), l: Number(t >> Co & Gr) } : { h: Number(t >> Co & Gr) | 0, l: Number(t & Gr) | 0 };
}
function Cg(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = eh(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const kg = (t, e) => BigInt(t >>> 0) << Co | BigInt(e >>> 0), Pg = (t, e, n) => t >>> n, Ng = (t, e, n) => t << 32 - n | e >>> n, Dg = (t, e, n) => t >>> n | e << 32 - n, Tg = (t, e, n) => t << 32 - n | e >>> n, Fg = (t, e, n) => t << 64 - n | e >>> n - 32, Mg = (t, e, n) => t >>> n - 32 | e << 64 - n, Rg = (t, e) => e, Gg = (t, e) => t, Vg = (t, e, n) => t << n | e >>> 32 - n, Kg = (t, e, n) => e << n | t >>> 32 - n, zg = (t, e, n) => e << n - 32 | t >>> 64 - n, jg = (t, e, n) => t << n - 32 | e >>> 64 - n;
function qg(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Wg = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Xg = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Yg = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Jg = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Zg = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Qg = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, K = {
  fromBig: eh,
  split: Cg,
  toBig: kg,
  shrSH: Pg,
  shrSL: Ng,
  rotrSH: Dg,
  rotrSL: Tg,
  rotrBH: Fg,
  rotrBL: Mg,
  rotr32H: Rg,
  rotr32L: Gg,
  rotlSH: Vg,
  rotlSL: Kg,
  rotlBH: zg,
  rotlBL: jg,
  add: qg,
  add3L: Wg,
  add3H: Xg,
  add4L: Yg,
  add4H: Jg,
  add5H: Qg,
  add5L: Zg
}, [tx, ex] = K.split([
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
let Hs = class extends mi {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: f, Eh: u, El: l, Fh: c, Fl: p, Gh: d, Gl: g, Hh: y, Hl: B } = this;
    return [e, n, r, s, o, i, a, f, u, l, c, p, d, g, y, B];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, f, u, l, c, p, d, g, y, B) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = f | 0, this.Eh = u | 0, this.El = l | 0, this.Fh = c | 0, this.Fl = p | 0, this.Gh = d | 0, this.Gl = g | 0, this.Hh = y | 0, this.Hl = B | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      Ae[x] = e.getUint32(n), ve[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const $ = Ae[x - 15] | 0, S = ve[x - 15] | 0, O = K.rotrSH($, S, 1) ^ K.rotrSH($, S, 8) ^ K.shrSH($, S, 7), P = K.rotrSL($, S, 1) ^ K.rotrSL($, S, 8) ^ K.shrSL($, S, 7), C = Ae[x - 2] | 0, k = ve[x - 2] | 0, b = K.rotrSH(C, k, 19) ^ K.rotrBH(C, k, 61) ^ K.shrSH(C, k, 6), A = K.rotrSL(C, k, 19) ^ K.rotrBL(C, k, 61) ^ K.shrSL(C, k, 6), I = K.add4L(P, A, ve[x - 7], ve[x - 16]), D = K.add4H(I, O, b, Ae[x - 7], Ae[x - 16]);
      Ae[x] = D | 0, ve[x] = I | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: f, Dh: u, Dl: l, Eh: c, El: p, Fh: d, Fl: g, Gh: y, Gl: B, Hh: H, Hl: U } = this;
    for (let x = 0; x < 80; x++) {
      const $ = K.rotrSH(c, p, 14) ^ K.rotrSH(c, p, 18) ^ K.rotrBH(c, p, 41), S = K.rotrSL(c, p, 14) ^ K.rotrSL(c, p, 18) ^ K.rotrBL(c, p, 41), O = c & d ^ ~c & y, P = p & g ^ ~p & B, C = K.add5L(U, S, P, ex[x], ve[x]), k = K.add5H(C, H, $, O, tx[x], Ae[x]), b = C | 0, A = K.rotrSH(r, s, 28) ^ K.rotrBH(r, s, 34) ^ K.rotrBH(r, s, 39), I = K.rotrSL(r, s, 28) ^ K.rotrBL(r, s, 34) ^ K.rotrBL(r, s, 39), D = r & o ^ r & a ^ o & a, j = s & i ^ s & f ^ i & f;
      H = y | 0, U = B | 0, y = d | 0, B = g | 0, d = c | 0, g = p | 0, { h: c, l: p } = K.add(u | 0, l | 0, k | 0, b | 0), u = a | 0, l = f | 0, a = o | 0, f = i | 0, o = r | 0, i = s | 0;
      const T = K.add3L(b, I, j);
      r = K.add3H(T, k, A, D), s = T | 0;
    }
    ({ h: r, l: s } = K.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = K.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: f } = K.add(this.Ch | 0, this.Cl | 0, a | 0, f | 0), { h: u, l } = K.add(this.Dh | 0, this.Dl | 0, u | 0, l | 0), { h: c, l: p } = K.add(this.Eh | 0, this.El | 0, c | 0, p | 0), { h: d, l: g } = K.add(this.Fh | 0, this.Fl | 0, d | 0, g | 0), { h: y, l: B } = K.add(this.Gh | 0, this.Gl | 0, y | 0, B | 0), { h: H, l: U } = K.add(this.Hh | 0, this.Hl | 0, H | 0, U | 0), this.set(r, s, o, i, a, f, u, l, c, p, d, g, y, B, H, U);
  }
  roundClean() {
    Ae.fill(0), ve.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, nx = class extends Hs {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, rx = class extends Hs {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, sx = class extends Hs {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
rn(() => new Hs());
rn(() => new nx());
rn(() => new rx());
rn(() => new sx());
var at;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(at || (at = {}));
var ko;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(ko || (ko = {}));
function Ai(t) {
  return ko[t];
}
var hs;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(hs || (hs = {}));
function nh(t, e, n) {
  const s = hg;
  if (xx(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: hs.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
function rh(t) {
  const e = Nn.c32addressDecode(t);
  return {
    type: hs.Address,
    version: e[0],
    hash160: e[1]
  };
}
function sh(t) {
  const e = [];
  return e.push(St(fi(t.version, 1))), e.push(St(t.hash160)), Fn(e);
}
function oh(t) {
  const e = [], n = cr(t.content), r = n.byteLength;
  return e.push(St(fi(r, t.lengthPrefixBytes))), e.push(n), Fn(e);
}
function Wt(t, e) {
  return Fn([Ai(t), e]);
}
function ox(t) {
  return new Uint8Array([Ai(t.type)]);
}
function ix(t) {
  return t.type === at.OptionalNone ? new Uint8Array([Ai(t.type)]) : Wt(t.type, hr(t.value));
}
function ax(t) {
  const e = new Uint8Array(4);
  return ms(e, Math.ceil(t.value.length / 2), 0), Wt(t.type, re(e, St(t.value)));
}
function cx(t) {
  const e = r0(Bp(BigInt(t.value), BigInt(lg)), X0);
  return Wt(t.type, e);
}
function fx(t) {
  const e = r0(BigInt(t.value), X0);
  return Wt(t.type, e);
}
function hx(t) {
  return Wt(t.type, sh(rh(t.value)));
}
function lx(t) {
  const [e, n] = yx(t.value);
  return Wt(t.type, re(sh(rh(e)), oh(nh(n))));
}
function ux(t) {
  return Wt(t.type, hr(t.value));
}
function dx(t) {
  const e = [], n = new Uint8Array(4);
  ms(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = hr(r);
    e.push(s);
  }
  return Wt(t.type, Fn(e));
}
function px(t) {
  const e = [], n = new Uint8Array(4);
  ms(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = nh(s);
    e.push(oh(o));
    const i = hr(t.value[s]);
    e.push(i);
  }
  return Wt(t.type, Fn(e));
}
function ih(t, e) {
  const n = [], r = e == "ascii" ? _p(t.value) : cr(t.value), s = new Uint8Array(4);
  return ms(s, r.length, 0), n.push(s), n.push(r), Wt(t.type, Fn(n));
}
function bx(t) {
  return ih(t, "ascii");
}
function gx(t) {
  return ih(t, "utf8");
}
function vc(t) {
  return $t(hr(t));
}
function hr(t) {
  switch (t.type) {
    case at.BoolTrue:
    case at.BoolFalse:
      return ox(t);
    case at.OptionalNone:
    case at.OptionalSome:
      return ix(t);
    case at.Buffer:
      return ax(t);
    case at.UInt:
      return fx(t);
    case at.Int:
      return cx(t);
    case at.PrincipalStandard:
      return hx(t);
    case at.PrincipalContract:
      return lx(t);
    case at.ResponseOk:
    case at.ResponseErr:
      return ux(t);
    case at.List:
      return dx(t);
    case at.Tuple:
      return px(t);
    case at.StringASCII:
      return bx(t);
    case at.StringUTF8:
      return gx(t);
    default:
      throw new dg("Unable to serialize. Invalid Clarity Value.");
  }
}
const xx = (t, e) => t ? cr(t).length > e : !1;
function yx(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
function wx(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = rr(r);
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
    return BigInt(`0x${Ex(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function vi(t, e = 8) {
  return (typeof t == "bigint" ? t : wx(t)).toString(16).padStart(e * 2, "0");
}
function ah(t, e = 16) {
  const n = vi(t, e);
  return rr(n);
}
function mx(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const Sx = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ex(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Sx[n];
  return e;
}
function rr(t) {
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
function Bi(t) {
  return new TextEncoder().encode(t);
}
function Ax(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function vx(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Bc(t) {
  if (t.some(vx))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function $i(...t) {
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
function Mn(t) {
  return $i(...t.map((e) => typeof e == "number" ? Bc([e]) : e instanceof Array ? Bc(e) : e));
}
function Ls(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Po;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Po || (Po = {}));
Po.Mainnet;
const Bx = 128, $x = 128, ch = 16;
var No;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(No || (No = {}));
var $c;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})($c || ($c = {}));
var _c;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(_c || (_c = {}));
var Pt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Pt || (Pt = {}));
const oo = ["onChainOnly", "offChainOnly", "any"];
oo[0] + "", Pt.OnChainOnly, oo[1] + "", Pt.OffChainOnly, oo[2] + "", Pt.Any, Pt.OnChainOnly + "", Pt.OnChainOnly, Pt.OffChainOnly + "", Pt.OffChainOnly, Pt.Any + "", Pt.Any;
var Do;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Do || (Do = {}));
Do.Mainnet;
var Hc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Hc || (Hc = {}));
var Lc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Lc || (Lc = {}));
var Ic;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ic || (Ic = {}));
var Uc;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Uc || (Uc = {}));
var Oc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Oc || (Oc = {}));
var Cc;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Cc || (Cc = {}));
var kc;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(kc || (kc = {}));
var Pc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Pc || (Pc = {}));
var Nc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Nc || (Nc = {}));
var Dc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Dc || (Dc = {}));
var Tc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Tc || (Tc = {}));
function To(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function _x(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function fh(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Hx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  To(t.outputLen), To(t.blockLen);
}
function Lx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Ix(t, e) {
  fh(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const io = {
  number: To,
  bool: _x,
  bytes: fh,
  hash: Hx,
  exists: Lx,
  output: Ix
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ao = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Rt = (t, e) => t << 32 - e | t >>> e, Ux = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Ux)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ox(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function hh(t) {
  if (typeof t == "string" && (t = Ox(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Cx {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function sn(t) {
  const e = (r) => t().update(hh(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function kx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, i, r), t.setUint32(e + u, a, r);
}
class _i extends Cx {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ao(this.buffer);
  }
  update(e) {
    io.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = hh(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const f = ao(e);
        for (; s <= o - i; i += s)
          this.process(f, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    io.exists(this), io.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let c = i; c < s; c++)
      n[c] = 0;
    kx(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = ao(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = f / 4, l = this.get();
    if (u > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let c = 0; c < u; c++)
      a.setUint32(4 * c, l[c], o);
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
const Px = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), lh = Uint8Array.from({ length: 16 }, (t, e) => e), Nx = lh.map((t) => (9 * t + 5) % 16);
let Hi = [lh], Li = [Nx];
for (let t = 0; t < 4; t++)
  for (let e of [Hi, Li])
    e.push(e[t].map((n) => Px[n]));
const uh = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Dx = Hi.map((t, e) => t.map((n) => uh[e][n])), Tx = Li.map((t, e) => t.map((n) => uh[e][n])), Fx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Mx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Vr = (t, e) => t << e | t >>> 32 - e;
function Fc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Kr = new Uint32Array(16);
class Rx extends _i {
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
      Kr[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, f = a, u = this.h3 | 0, l = u, c = this.h4 | 0, p = c;
    for (let d = 0; d < 5; d++) {
      const g = 4 - d, y = Fx[d], B = Mx[d], H = Hi[d], U = Li[d], x = Dx[d], $ = Tx[d];
      for (let S = 0; S < 16; S++) {
        const O = Vr(r + Fc(d, o, a, u) + Kr[H[S]] + y, x[S]) + c | 0;
        r = c, c = u, u = Vr(a, 10) | 0, a = o, o = O;
      }
      for (let S = 0; S < 16; S++) {
        const O = Vr(s + Fc(g, i, f, l) + Kr[U[S]] + B, $[S]) + p | 0;
        s = p, p = l, l = Vr(f, 10) | 0, f = i, i = O;
      }
    }
    this.set(this.h1 + a + l | 0, this.h2 + u + p | 0, this.h3 + c + s | 0, this.h4 + r + i | 0, this.h0 + o + f | 0);
  }
  roundClean() {
    Kr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
sn(() => new Rx());
const Gx = (t, e, n) => t & e ^ ~t & n, Vx = (t, e, n) => t & e ^ t & n ^ e & n, Kx = new Uint32Array([
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
class dh extends _i {
  constructor() {
    super(64, 32, 8, !1), this.A = Be[0] | 0, this.B = Be[1] | 0, this.C = Be[2] | 0, this.D = Be[3] | 0, this.E = Be[4] | 0, this.F = Be[5] | 0, this.G = Be[6] | 0, this.H = Be[7] | 0;
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
      $e[c] = e.getUint32(n, !1);
    for (let c = 16; c < 64; c++) {
      const p = $e[c - 15], d = $e[c - 2], g = Rt(p, 7) ^ Rt(p, 18) ^ p >>> 3, y = Rt(d, 17) ^ Rt(d, 19) ^ d >>> 10;
      $e[c] = y + $e[c - 7] + g + $e[c - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: f, G: u, H: l } = this;
    for (let c = 0; c < 64; c++) {
      const p = Rt(a, 6) ^ Rt(a, 11) ^ Rt(a, 25), d = l + p + Gx(a, f, u) + Kx[c] + $e[c] | 0, y = (Rt(r, 2) ^ Rt(r, 13) ^ Rt(r, 22)) + Vx(r, s, o) | 0;
      l = u, u = f, f = a, a = i + d | 0, i = o, o = s, s = r, r = d + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, l = l + this.H | 0, this.set(r, s, o, i, a, f, u, l);
  }
  roundClean() {
    $e.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class zx extends dh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
sn(() => new dh());
sn(() => new zx());
const zr = BigInt(2 ** 32 - 1), Fo = BigInt(32);
function ph(t, e = !1) {
  return e ? { h: Number(t & zr), l: Number(t >> Fo & zr) } : { h: Number(t >> Fo & zr) | 0, l: Number(t & zr) | 0 };
}
function jx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = ph(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const qx = (t, e) => BigInt(t >>> 0) << Fo | BigInt(e >>> 0), Wx = (t, e, n) => t >>> n, Xx = (t, e, n) => t << 32 - n | e >>> n, Yx = (t, e, n) => t >>> n | e << 32 - n, Jx = (t, e, n) => t << 32 - n | e >>> n, Zx = (t, e, n) => t << 64 - n | e >>> n - 32, Qx = (t, e, n) => t >>> n - 32 | e << 64 - n, ty = (t, e) => e, ey = (t, e) => t, ny = (t, e, n) => t << n | e >>> 32 - n, ry = (t, e, n) => e << n | t >>> 32 - n, sy = (t, e, n) => e << n - 32 | t >>> 64 - n, oy = (t, e, n) => t << n - 32 | e >>> 64 - n;
function iy(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const ay = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), cy = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, fy = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), hy = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, ly = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), uy = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, z = {
  fromBig: ph,
  split: jx,
  toBig: qx,
  shrSH: Wx,
  shrSL: Xx,
  rotrSH: Yx,
  rotrSL: Jx,
  rotrBH: Zx,
  rotrBL: Qx,
  rotr32H: ty,
  rotr32L: ey,
  rotlSH: ny,
  rotlSL: ry,
  rotlBH: sy,
  rotlBL: oy,
  add: iy,
  add3L: ay,
  add3H: cy,
  add4L: fy,
  add4H: hy,
  add5H: uy,
  add5L: ly
}, [dy, py] = z.split([
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
class Is extends _i {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: f, Eh: u, El: l, Fh: c, Fl: p, Gh: d, Gl: g, Hh: y, Hl: B } = this;
    return [e, n, r, s, o, i, a, f, u, l, c, p, d, g, y, B];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, f, u, l, c, p, d, g, y, B) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = f | 0, this.Eh = u | 0, this.El = l | 0, this.Fh = c | 0, this.Fl = p | 0, this.Gh = d | 0, this.Gl = g | 0, this.Hh = y | 0, this.Hl = B | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      _e[x] = e.getUint32(n), He[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const $ = _e[x - 15] | 0, S = He[x - 15] | 0, O = z.rotrSH($, S, 1) ^ z.rotrSH($, S, 8) ^ z.shrSH($, S, 7), P = z.rotrSL($, S, 1) ^ z.rotrSL($, S, 8) ^ z.shrSL($, S, 7), C = _e[x - 2] | 0, k = He[x - 2] | 0, b = z.rotrSH(C, k, 19) ^ z.rotrBH(C, k, 61) ^ z.shrSH(C, k, 6), A = z.rotrSL(C, k, 19) ^ z.rotrBL(C, k, 61) ^ z.shrSL(C, k, 6), I = z.add4L(P, A, He[x - 7], He[x - 16]), D = z.add4H(I, O, b, _e[x - 7], _e[x - 16]);
      _e[x] = D | 0, He[x] = I | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: f, Dh: u, Dl: l, Eh: c, El: p, Fh: d, Fl: g, Gh: y, Gl: B, Hh: H, Hl: U } = this;
    for (let x = 0; x < 80; x++) {
      const $ = z.rotrSH(c, p, 14) ^ z.rotrSH(c, p, 18) ^ z.rotrBH(c, p, 41), S = z.rotrSL(c, p, 14) ^ z.rotrSL(c, p, 18) ^ z.rotrBL(c, p, 41), O = c & d ^ ~c & y, P = p & g ^ ~p & B, C = z.add5L(U, S, P, py[x], He[x]), k = z.add5H(C, H, $, O, dy[x], _e[x]), b = C | 0, A = z.rotrSH(r, s, 28) ^ z.rotrBH(r, s, 34) ^ z.rotrBH(r, s, 39), I = z.rotrSL(r, s, 28) ^ z.rotrBL(r, s, 34) ^ z.rotrBL(r, s, 39), D = r & o ^ r & a ^ o & a, j = s & i ^ s & f ^ i & f;
      H = y | 0, U = B | 0, y = d | 0, B = g | 0, d = c | 0, g = p | 0, { h: c, l: p } = z.add(u | 0, l | 0, k | 0, b | 0), u = a | 0, l = f | 0, a = o | 0, f = i | 0, o = r | 0, i = s | 0;
      const T = z.add3L(b, I, j);
      r = z.add3H(T, k, A, D), s = T | 0;
    }
    ({ h: r, l: s } = z.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = z.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: f } = z.add(this.Ch | 0, this.Cl | 0, a | 0, f | 0), { h: u, l } = z.add(this.Dh | 0, this.Dl | 0, u | 0, l | 0), { h: c, l: p } = z.add(this.Eh | 0, this.El | 0, c | 0, p | 0), { h: d, l: g } = z.add(this.Fh | 0, this.Fl | 0, d | 0, g | 0), { h: y, l: B } = z.add(this.Gh | 0, this.Gl | 0, y | 0, B | 0), { h: H, l: U } = z.add(this.Hh | 0, this.Hl | 0, H | 0, U | 0), this.set(r, s, o, i, a, f, u, l, c, p, d, g, y, B, H, U);
  }
  roundClean() {
    _e.fill(0), He.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class by extends Is {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class gy extends Is {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class xy extends Is {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
sn(() => new Is());
sn(() => new by());
sn(() => new gy());
sn(() => new xy());
function yy(t, e, n) {
  const s = Bx;
  if (Cy(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: No.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var ct;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(ct || (ct = {}));
class wy extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class my extends wy {
  constructor(e) {
    super(e);
  }
}
function bh(t) {
  const e = [];
  return e.push(rr(vi(t.version, 1))), e.push(rr(t.hash160)), Mn(e);
}
function gh(t) {
  const e = [], n = Bi(t.content), r = n.byteLength;
  return e.push(rr(vi(r, t.lengthPrefixBytes))), e.push(n), Mn(e);
}
function Xt(t, e) {
  return Mn([t, e]);
}
function Sy(t) {
  return new Uint8Array([t.type]);
}
function Ey(t) {
  return t.type === ct.OptionalNone ? new Uint8Array([t.type]) : Xt(t.type, Cn(t.value));
}
function Ay(t) {
  const e = new Uint8Array(4);
  return Ls(e, t.buffer.length, 0), Xt(t.type, $i(e, t.buffer));
}
function vy(t) {
  const e = ah(mx(t.value, BigInt($x)), ch);
  return Xt(t.type, e);
}
function By(t) {
  const e = ah(t.value, ch);
  return Xt(t.type, e);
}
function $y(t) {
  return Xt(t.type, bh(t.address));
}
function _y(t) {
  return Xt(t.type, $i(bh(t.address), gh(t.contractName)));
}
function Hy(t) {
  return Xt(t.type, Cn(t.value));
}
function Ly(t) {
  const e = [], n = new Uint8Array(4);
  Ls(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Cn(r);
    e.push(s);
  }
  return Xt(t.type, Mn(e));
}
function Iy(t) {
  const e = [], n = new Uint8Array(4);
  Ls(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = yy(s);
    e.push(gh(o));
    const i = Cn(t.data[s]);
    e.push(i);
  }
  return Xt(t.type, Mn(e));
}
function xh(t, e) {
  const n = [], r = e == "ascii" ? Ax(t.data) : Bi(t.data), s = new Uint8Array(4);
  return Ls(s, r.length, 0), n.push(s), n.push(r), Xt(t.type, Mn(n));
}
function Uy(t) {
  return xh(t, "ascii");
}
function Oy(t) {
  return xh(t, "utf8");
}
function Cn(t) {
  switch (t.type) {
    case ct.BoolTrue:
    case ct.BoolFalse:
      return Sy(t);
    case ct.OptionalNone:
    case ct.OptionalSome:
      return Ey(t);
    case ct.Buffer:
      return Ay(t);
    case ct.UInt:
      return By(t);
    case ct.Int:
      return vy(t);
    case ct.PrincipalStandard:
      return $y(t);
    case ct.PrincipalContract:
      return _y(t);
    case ct.ResponseOk:
    case ct.ResponseErr:
      return Hy(t);
    case ct.List:
      return Ly(t);
    case ct.Tuple:
      return Iy(t);
    case ct.StringASCII:
      return Uy(t);
    case ct.StringUTF8:
      return Oy(t);
    default:
      throw new my("Unable to serialize. Invalid Clarity Value.");
  }
}
const Cy = (t, e) => t ? Bi(t).length > e : !1;
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var ky = Object.defineProperty, Py = Object.defineProperties, Ny = Object.getOwnPropertyDescriptors, ls = Object.getOwnPropertySymbols, yh = Object.prototype.hasOwnProperty, wh = Object.prototype.propertyIsEnumerable, Mc = (t, e, n) => e in t ? ky(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Mo = (t, e) => {
  for (var n in e || (e = {})) yh.call(e, n) && Mc(t, n, e[n]);
  if (ls) for (var n of ls(e)) wh.call(e, n) && Mc(t, n, e[n]);
  return t;
}, Ro = (t, e) => Py(t, Ny(e)), Dy = (t, e) => {
  var n = {};
  for (var r in t) yh.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && ls) for (var r of ls(t)) e.indexOf(r) < 0 && wh.call(t, r) && (n[r] = t[r]);
  return n;
};
function Ty(t) {
  return t ? typeof t == "string" ? Ze.fromName(t) : "version" in t ? t : "url" in t ? new Lo({ url: t.url }) : t.transactionVersion === fs.Mainnet ? new Lo({ url: t.client.baseUrl }) : new Io({ url: t.client.baseUrl }) : new Io();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var Fy = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(Fy || {}), My = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(My || {}), mh = (t) => {
  let e = t;
  if (!e) {
    let n = new o0(["store_write"], document.location.href);
    e = new Ho({ appConfig: n });
  }
  return e;
};
function Ry(t) {
  try {
    return mh(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Gy = (t) => {
  let e = mh(t).loadUserData().appPrivateKey, n = bt.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function Sh(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? Ro(Mo({}, t), { message: vc(e), domain: vc(n) }) : Ro(Mo({}, t), { message: $t(Cn(e)), domain: $t(Cn(n)) });
}
async function Vy(t, e) {
  return new bt.TokenSigner("ES256k", e).signAsync(Sh(t));
}
async function Ky(t) {
  let e = t, { userSession: n } = e, r = Dy(e, ["userSession"]);
  if (Ry(n)) {
    let { privateKey: s, publicKey: o } = Gy(n), i = Ro(Mo({}, r), { publicKey: o });
    return Vy(i, s);
  }
  return bt.createUnsecuredToken(Sh(t));
}
var zy = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(zy || {}), Eh = "asigna-stx", Rc = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === Eh && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(qy(t, e), "*");
}), jy = { authenticationRequest: async (t) => Rc(t, "authenticationRequest"), transactionRequest: async (t) => Rc(t, "transactionRequest") }, qy = (t, e) => ({ source: Eh, [e]: t }), Wy = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = jy);
};
Wy();
const Xy = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], Ii = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Us = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, Zn = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, Yy = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Ah = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((o) => Yy(o, r)) === s
  );
}, Jy = (t) => t ? Ah(Us()).some(
  (e) => {
    var n;
    return e.id === t && (Ii(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Zy = () => {
  if (typeof window > "u")
    return;
  const t = Us(), e = Ah(t).filter(
    (n) => {
      var r;
      return Ii(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Zn(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of Xy) {
    const r = Zn(t, n) ?? (t === window ? void 0 : Zn(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, Qy = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Us(), n = Zn(e, t) ?? (e === window ? void 0 : Zn(window, t)) ?? Qb(t);
  if (n)
    return n;
  if (Ii(t) || Jy(t))
    return Zy();
}, tw = ["blockstack-session", "blockstack"], ew = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of tw) {
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
ew();
const nw = () => q0(), rw = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = q0(), e = t ? Qy(t) : void 0;
  if (e)
    return e;
  const n = Us() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, Gc = (t) => t0(t).replace(/^0x/, ""), Vc = "This wallet cannot sign messages. Try Xverse or Leather.", Kc = (t) => typeof (t == null ? void 0 : t.request) == "function", zc = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", sw = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, ow = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function iw(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: Gc(e.message),
    domain: Gc(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function aw(t, e) {
  const n = await Ky({
    domain: e.domain,
    message: e.message,
    network: Ty(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function cw(t) {
  var s, o;
  const e = nw() || "", n = /xverse/i.test(e);
  let r = rw();
  if (n && !zc(r)) {
    const i = window;
    r = ((s = i.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((o = i.xverseProviders) == null ? void 0 : o.StacksProvider);
  }
  if (zc(r))
    try {
      return await aw(r, t);
    } catch (i) {
      if (n || !Kc(r) || !ow(i)) throw i;
    }
  if (!n && Kc(r))
    try {
      return await iw(r, t);
    } catch (i) {
      throw sw(i) ? new Error(Vc) : i;
    }
  throw new Error(Vc);
}
function fw(t, e, n = {}) {
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
const hw = {}, lw = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, uw = (t) => {
  const e = hw;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, dw = (t) => `/hiro/${t}`, pw = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, bw = (t) => {
  const e = uw(t);
  if (e)
    return [pw(e)];
  const n = lw[t];
  return typeof window < "u" ? [`${window.location.origin}${dw(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, gw = {}, jc = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, xw = "xtrata.log.enabled", yw = "xtrata.log.level", ww = "xtrata.log.tags", mw = "xtrata.log.dedupe", jr = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, Sw = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, Ew = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, Aw = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, vw = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, Bw = () => {
  const t = gw ?? {}, e = jr(xw) ?? t.VITE_LOG_ENABLED, n = jr(yw) ?? t.VITE_LOG_LEVEL, r = jr(ww) ?? t.VITE_LOG_TAGS, s = jr(mw) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: Sw(e),
    level: Ew(n) ?? "warn",
    tags: vw(r),
    dedupe: Aw(s)
  };
}, $w = (t, e, n) => !t.enabled || jc[n] < jc[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), _w = (t, e, n, r) => {
  const s = Bw();
  if (!$w(s, e, t) || Lw(s.dedupe))
    return;
  const o = `[xtrata:${e}] ${n}`, i = console[t] ?? console.log;
  r !== void 0 ? i(o, r) : i(o);
}, Hw = /* @__PURE__ */ new Set();
let qc = null;
const Lw = (t, e, n, r, s) => (qc !== t && (Hw.clear(), qc = t), !1), Iw = (t, e, n) => _w("debug", t, e, n), Uw = {}, Ow = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, Cw = (t) => {
  const e = Uw, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : Ow[t];
}, kw = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, Pw = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return kw.test(n) ? n : null;
}, Nw = (t) => t.replace(/\/+$/, ""), Dw = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), Wc = (t) => {
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
}, yn = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, Tw = (t) => {
  var f, u;
  let e;
  try {
    e = wn(lp(t));
  } catch {
    return null;
  }
  const n = yn(e);
  if (!n || n.success === !1)
    return null;
  const r = yn(n.value), s = yn(r == null ? void 0 : r.value), o = yn(s == null ? void 0 : s.value);
  if (!o)
    return null;
  const i = Wc((f = yn(o.name)) == null ? void 0 : f.value), a = Wc((u = yn(o.namespace)) == null ? void 0 : u.value);
  return !i || !a ? null : Pw(`${i}.${a}`);
}, Fw = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${Nw(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [t0(kd(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const o = await s.json();
  return !(o != null && o.okay) || typeof o.result != "string" ? null : Tw(o.result);
}, Mw = async (t) => {
  const e = t.address.trim();
  if (!up(e))
    return null;
  const n = Cw(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of bw(t.network))
    try {
      return await Fw({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (o) {
      r = o;
    }
  return Iw("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: Dw(r)
  }), null;
}, Rw = "ParallaX Casino", Gw = "ParallaX Casino room sign-in. This is free: it sends no transaction, costs no fees and gives no permission to spend anything.";
new TextEncoder();
new TextDecoder();
const Vw = (t) => t === "mainnet" ? 1 : 2147483648, Kw = (t) => `${Gw} Account ${t.address}. Valid until ${new Date(t.expires).toISOString().replace(".000Z", "Z")}. Request code ${t.nonce}.`, zw = (t) => ({
  domain: Wf({
    name: Yr(Rw),
    version: Yr("1"),
    "chain-id": qf(Vw(t.network))
  }),
  message: Yr(Kw(t))
}), qr = (t) => !!t && typeof t.request == "function", jw = () => {
  try {
    const t = window.top;
    if (t && t !== window.self && t.location.origin === window.location.origin) return t;
  } catch {
  }
  return window;
}, qw = () => {
  const t = jw();
  return t === window ? [window] : [t, window];
}, Xc = (t) => {
  for (const e of qw()) {
    const n = t(e);
    if (n) return n;
  }
  return null;
}, Ww = (t) => {
  if (t === "leather") {
    const n = Xc((r) => qr(r.LeatherProvider) ? r.LeatherProvider : null);
    return n ? { rpc: n } : null;
  }
  const e = Xc((n) => {
    const r = n.XverseProviders || n.xverseProviders;
    return r && (qr(r.BitcoinProvider) || qr(r.StacksProvider)) ? r : null;
  });
  return e ? { rpc: qr(e.BitcoinProvider) ? e.BitcoinProvider : e.StacksProvider } : null;
}, Xw = (t, e) => new Promise((n) => {
  const r = Date.now();
  (function s() {
    const o = Ww(t);
    o || Date.now() - r >= e ? n(o) : window.setTimeout(s, 150);
  })();
}), us = (t) => {
  var e;
  return (t == null ? void 0 : t.code) ?? ((e = t == null ? void 0 : t.error) == null ? void 0 : e.code);
}, je = (t) => {
  var e;
  return String((t == null ? void 0 : t.message) ?? ((e = t == null ? void 0 : t.error) == null ? void 0 : e.message) ?? t ?? "unknown error");
}, Yw = (t) => [4001, -31001].includes(Number(us(t))) || /cancel|denied|reject|declin|closed/i.test(je(t)), Yc = (t) => Number(us(t)) === -32601 || /not supported|method not found|unsupported|not implemented|legacy method/i.test(je(t)), co = async (t, e, n) => {
  const r = n === void 0 ? await t.request(e) : await t.request(e, n);
  if (r && typeof r == "object") {
    if (r.error) throw Object.assign(new Error(je(r.error)), { code: us(r.error) });
    if (r.status === "error") throw Object.assign(new Error(je(r.error || r)), { code: us(r.error || r) });
    if ("result" in r) return r.result;
  }
  return r;
}, Jw = (t) => new Promise((e, n) => {
  const r = window.setTimeout(() => n(new Error("The wallet did not answer. Check its window.")), 9e4);
  t.then((s) => {
    window.clearTimeout(r), e(s);
  }, (s) => {
    window.clearTimeout(r), n(s);
  });
}), Zw = (t) => (JSON.stringify(t) || "").match(/S[PT][0-9A-HJKMNP-TV-Z]{38,39}/g) || [], Le = [];
async function Qw(t) {
  const e = await Xw(t, 1500);
  if (!e) throw new Error(`${t === "leather" ? "Leather" : "Xverse"} was not found in this browser.`);
  Le.length = 0;
  let n;
  if (t === "xverse") {
    try {
      await co(e.rpc, "wallet_disconnect"), Le.push("wallet_disconnect: ok");
    } catch (s) {
      Le.push("wallet_disconnect: " + je(s).slice(0, 80));
    }
    n = ["wallet_connect", "wallet_getAccount"];
  } else
    n = ["getAddresses", "stx_getAccounts", "stx_getAddresses", "stx_requestAccounts"];
  let r = null;
  for (const s of n)
    try {
      const o = await (t === "xverse" ? Jw(co(e.rpc, s)) : co(e.rpc, s)), i = Zw(o);
      if (i.length) {
        const a = i[0];
        return Le.push(`${s}: ok`), { kind: t, address: a, network: a.startsWith("SP") ? "mainnet" : "testnet", via: s };
      }
      Le.push(`${s}: answered but no Stacks address in it`);
    } catch (o) {
      if (Yw(o))
        throw Le.push(`${s}: cancelled`), new Error("Connection cancelled.");
      Le.push(`${s}: ${Yc(o) ? "not supported" : je(o).slice(0, 80)}`), Yc(o) || (r = o);
    }
  throw new Error(r ? je(r) : "The wallet did not share a Stacks address.");
}
const t3 = (t) => tg(t === "leather" ? "LeatherProvider" : "XverseProviders.BitcoinProvider"), vh = (t) => t instanceof Error ? t.message : String(t), Jc = 200, Bh = 40, e3 = 2e3, ds = 280, n3 = 5 * 6e4, Zc = "px_room_blocks_v1", Qc = "px_chat_ui_v1", r3 = 3e4, tf = { hidden: !1, side: "left" }, s3 = [
  { code: "spam", label: "Spam" },
  { code: "abuse", label: "Abuse" },
  { code: "scam", label: "Scam" },
  { code: "other", label: "Something else" }
], o3 = (t) => {
  if (!Array.isArray(t)) return [];
  const e = [];
  for (const n of t)
    if (!(typeof n != "string" || !/^S[A-Z0-9]{19,60}$/.test(n) || e.includes(n)) && (e.push(n), e.length >= Bh))
      break;
  return e;
}, i3 = (t) => {
  if (!t) return [];
  try {
    return o3(JSON.parse(t));
  } catch {
    return [];
  }
}, a3 = (t) => {
  if (!t) return { ...tf };
  try {
    const e = JSON.parse(t);
    return { hidden: (e == null ? void 0 : e.hidden) === !0, side: (e == null ? void 0 : e.side) === "right" ? "right" : "left" };
  } catch {
    return { ...tf };
  }
}, $h = {
  "no-links": "Links are not allowed in messages.",
  "too-long": `That message is too long (${ds} characters at most).`,
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
}, c3 = (t) => typeof t == "string" && Object.prototype.hasOwnProperty.call($h, t), Wn = (t) => $h[String(t)] ?? "The room could not take that. Try again in a moment.", f3 = (t) => t.replace(/\s+/g, " ").trim(), h3 = (t) => Array.from(t).length, l3 = (t, e) => {
  const n = f3(t);
  return e.signed ? e.connected ? n ? h3(n) > ds ? { ok: !1, code: "too-long" } : e.now - e.lastSentAt < e3 ? { ok: !1, code: "slow-down" } : { ok: !0, text: n } : { ok: !1, code: "empty" } : { ok: !1, code: "offline" } : { ok: !1, code: "sign-in-first" };
};
class u3 {
  constructor() {
    bn(this, "lines", []);
    bn(this, "seq", 0);
    bn(this, "blocked", /* @__PURE__ */ new Set());
  }
  setBlocked(e) {
    this.blocked = new Set(e);
  }
  add(e, n, r, s, o) {
    if (e && !r && this.blocked.has(e.a)) return null;
    const i = { id: this.seq += 1, who: e, mine: r, text: n, at: s };
    return o && (i.to = o), this.lines.push(i), this.lines.length > Jc && this.lines.splice(0, this.lines.length - Jc), i;
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
  /**
   * Which lines to show. A line stays fully visible for `holdMs`, fades over `fadeMs`, and is gone after that. While the player is typing
   * (or has a menu open) the last `max` lines stay for up to five minutes. At most `max` lines are ever shown.
   */
  visible(e, n) {
    const r = [];
    for (const s of this.lines.slice(-n.max)) {
      const o = e - s.at;
      if (n.pinned && o <= n3) {
        r.push({ line: s, opacity: 1 });
        continue;
      }
      const i = s.to ? Math.max(n.holdMs, r3) : n.holdMs;
      if (o <= i) {
        r.push({ line: s, opacity: 1 });
        continue;
      }
      const a = 1 - (o - i) / n.fadeMs;
      a > 0 && r.push({ line: s, opacity: Math.round(a * 100) / 100 });
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
class d3 {
  constructor() {
    bn(this, "people", /* @__PURE__ */ new Map());
    bn(this, "known", !1);
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
const p3 = `
#pxchat{position:fixed;z-index:11;top:110px;left:14px;width:min(340px,calc(100vw - 28px));box-sizing:border-box;display:flex;flex-direction:column;gap:6px;pointer-events:none;color:var(--ink,#f6ead0);font-size:13px;line-height:1.35}
#pxchat.left{align-items:flex-start}
#pxchat.right{align-items:flex-end;text-align:right}
#pxchat[hidden]{display:none}
#pxchat.over{padding:8px;border-radius:10px;background:rgba(12,9,14,.94);border:1px solid rgba(227,184,74,.45);box-shadow:0 8px 24px rgba(0,0,0,.6)}
#pxchat-lines{display:flex;flex-direction:column;justify-content:flex-end;gap:3px;max-width:100%;min-height:0;flex:0 1 auto;overflow:hidden}
#pxchat.right #pxchat-lines{align-items:flex-end}
#pxchat .ln{transition:opacity .6s linear;overflow-wrap:anywhere;text-shadow:0 1px 2px #000,0 0 7px rgba(0,0,0,.9),0 0 14px rgba(0,0,0,.6)}
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
@media (prefers-reduced-motion:reduce){#pxchat .ln{transition:none}}
`, b3 = 14e3, g3 = 4e3, X = (t, e, n) => {
  const r = document.createElement(t);
  return e !== void 0 && (r.textContent = e), n && (r.className = n), r;
}, Gt = (t, e, n = "sm") => {
  const r = X("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function x3(t) {
  const e = new u3(), n = new d3();
  let r = { hidden: !1, side: "left" }, s = [];
  try {
    r = a3(window.localStorage.getItem(Qc)), s = i3(window.localStorage.getItem(Zc));
  } catch {
  }
  e.setBlocked(s);
  let o = !1, i = null, a = null, f = !1, u = "", l = 0, c = 0, p = 0, d = null, g = 0;
  const y = () => {
    try {
      window.localStorage.setItem(Qc, JSON.stringify(r));
    } catch {
    }
  }, B = () => {
    try {
      window.localStorage.setItem(Zc, JSON.stringify(s));
    } catch {
    }
  }, H = (E) => t.labelFor(E), U = (E) => s.includes(E), x = document.createElement("style");
  x.textContent = p3, document.head.append(x);
  const $ = X("div");
  $.id = "pxchat";
  const S = X("div");
  S.id = "pxchat-lines", S.setAttribute("role", "log"), S.setAttribute("aria-live", "polite"), S.setAttribute("aria-label", "Casino chat");
  const O = X("div", void 0, "panel");
  O.id = "pxchat-menu", O.hidden = !0;
  const P = X("div", void 0, "panel");
  P.id = "pxchat-panel", P.hidden = !0;
  const C = X("form");
  C.hidden = !0;
  const k = X("button", void 0, "to");
  k.type = "button", k.hidden = !0;
  const b = X("input");
  b.type = "text", b.autocomplete = "off", b.enterKeyHint = "send", b.maxLength = ds * 2;
  const A = X("button", "Send", "sm");
  A.type = "submit", C.append(k, b, A);
  const I = X("div", void 0, "bar");
  I.hidden = !0;
  const D = Gt("Here now", () => gr("people")), j = Gt("Hide chat", () => pr()), T = Gt("", () => {
    r.side = r.side === "left" ? "right" : "left", y(), et();
  }), _t = Gt("Blocked", () => gr("blocked"));
  D.id = "pxchat-people", j.id = "pxchat-hide", T.id = "pxchat-side", _t.id = "pxchat-blocked", I.append(D, j, T, _t), $.append(S, O, P, C, I);
  const ht = X("button");
  ht.id = "pxchat-btn", ht.type = "button", ht.setAttribute("aria-controls", "pxchat");
  const gt = /* @__PURE__ */ new Map(), rt = () => o || !!a || !!u, q = () => {
    var E;
    return (E = window.matchMedia) != null && E.call(window, "(max-width:700px)").matches ? 5 : 8;
  }, on = (E) => {
    const M = X("button", H(E.a), "nm");
    return M.type = "button", M.dataset.a = E.a, M.setAttribute("aria-label", `Options for ${H(E.a)}`), M.onclick = () => br(E), M;
  }, Os = (E) => {
    const M = E.who ? `ln${E.mine ? " mine" : ""}${E.to ? " dm" : ""}` : "ln note", W = X("div", void 0, M);
    if (!E.who)
      return W.append(X("span", E.text, "tx")), W;
    const F = [];
    return E.to ? E.mine ? F.push(X("span", "You", "nm"), X("span", "→", "tag"), on(E.to)) : F.push(on(E.who), X("span", "→ you", "tag")) : F.push(E.mine ? X("span", "You", "nm") : on(E.who)), F.push(X("span", E.text, "tx")), F.forEach((st, Lt) => {
      Lt && W.append(document.createTextNode(" ")), W.append(st);
    }), W;
  }, At = () => {
    const E = e.visible(Date.now(), { max: q(), holdMs: b3, fadeMs: g3, pinned: rt() }), M = new Set(E.map((F) => F.line.id));
    for (const [F, st] of gt) M.has(F) || (st.remove(), gt.delete(F));
    let W = null;
    for (const F of E) {
      let st = gt.get(F.line.id);
      st || (st = Os(F.line), gt.set(F.line.id, st));
      const Lt = W ? W.nextElementSibling : S.firstElementChild;
      Lt !== st && S.insertBefore(st, Lt), st.style.opacity = String(F.opacity), W = st;
    }
  }, Rn = () => {
    ht.replaceChildren(X("span", "💬", "ic"), X("span", "Chat", "lbl")), r.hidden && l > 0 && ht.append(X("span", l > 9 ? "9+" : String(l), c ? "dot dm" : "dot")), ht.setAttribute("aria-expanded", String(o && !r.hidden)), ht.setAttribute("aria-label", r.hidden && l ? `Chat: ${l} new${c ? `, ${c} sent to you` : ""}` : "Casino chat: type a message");
  }, Gn = () => {
    C.hidden = !o || r.hidden, k.hidden = !i, i && (k.textContent = `To ${H(i.a)} ×`, k.setAttribute("aria-label", `Writing to ${H(i.a)}. Press to write to the whole room instead.`)), b.classList.toggle("dm", !!i);
    const E = i ? `Message ${H(i.a)}` : "Say something to the room";
    b.placeholder = E, b.setAttribute("aria-label", E);
  }, Cs = () => {
    if (O.replaceChildren(), O.hidden = !a, !a) return;
    const E = a, M = U(E.a);
    O.append(X("p", H(E.a), "who"));
    const W = X("div", void 0, "row");
    if (f) {
      O.append(X("p", "Why? Your report goes to the casino team with the last few things they said to you or the room."));
      for (const F of s3) W.append(Gt(F.label, () => {
        xr(E, F.code), oe();
      }));
    } else {
      const F = Gt("Message", () => {
        oe(), Ps(E);
      });
      F.disabled = M || !n.has(E.a), M ? O.append(X("p", "You have blocked this person. Unblock them to message them.")) : n.known && !n.has(E.a) && O.append(X("p", "They have left the room.")), W.append(
        F,
        Gt(M ? "Unblock" : "Block", () => {
          Kn(E, !M), oe();
        }),
        Gt("Report…", () => {
          f = !0, et();
        }, "sm danger")
      );
    }
    W.append(Gt("Cancel", oe)), O.append(W);
  }, ks = () => {
    if (P.replaceChildren(), P.hidden = !u, u === "people") {
      const E = n.others(t.me());
      if (!n.known) P.append(X("p", t.connected() ? "Asking the room who is here…" : "Not connected to the room."));
      else if (!E.length) P.append(X("p", "Nobody else is signed in right now."));
      else {
        P.append(X("p", `Signed in now (${E.length}). Tap a name to message, block or report.`));
        for (const M of E) {
          const W = X("div", void 0, "row"), F = X("span");
          F.append(on(M)), U(M.a) && F.append(document.createTextNode(" (blocked)")), W.append(F), P.append(W);
        }
      }
    } else if (u === "blocked") {
      if (!s.length) {
        P.append(X("p", "You have not blocked anyone."));
        return;
      }
      P.append(X("p", "Blocked people cannot reach you and you cannot reach them."));
      for (const E of s) {
        const M = X("div", void 0, "row");
        M.append(X("span", H(E)), Gt("Unblock", () => {
          Kn({ a: E }, !1), et();
        })), P.append(M);
      }
    }
  }, et = () => {
    $.hidden = r.hidden, $.classList.remove("left", "right"), $.classList.add(r.side), I.hidden = !o || r.hidden;
    const E = n.others(t.me()).length;
    D.textContent = n.known ? `Here now (${E})` : "Here now", D.classList.toggle("on", u === "people"), T.textContent = r.side === "left" ? "Move right ▸" : "◂ Move left", _t.textContent = s.length ? `Blocked (${s.length})` : "Blocked", _t.classList.toggle("on", u === "blocked"), Rn(), Gn(), Cs(), ks(), At(), an(), lr();
  }, an = () => {
    const E = window.innerWidth, M = window.innerHeight, W = document.getElementById("tools"), F = Math.round(Math.max(70, (W ? W.getBoundingClientRect().bottom : 58) + 12));
    let st = r.side === "left" ? 14 : null, Lt = Math.min(340, E - 28), yr = M - F - 12, wr = !1;
    const hn = document.getElementById("intro"), It = hn && hn.getClientRects().length ? hn.getBoundingClientRect() : null;
    It && It.width > 0 && It.height > 0 && It.bottom > F && (r.side === "left" ? It.left < 14 + Lt : It.right > E - 14 - Lt) && (r.side === "left" && E - It.right - 30 >= 260 ? (st = Math.round(It.right + 16), Lt = Math.min(340, E - st - 14)) : (wr = !0, yr = Math.max(170, Math.round(It.top - F - 8)))), $.style.top = `${F}px`, $.style.left = st === null ? "auto" : `${st}px`, $.style.right = st === null ? "14px" : "", $.style.width = `${Lt}px`, $.style.maxHeight = `${yr}px`, $.classList.toggle("over", wr && !$.hidden && (o || gt.size > 0));
  }, lr = () => {
    window.clearTimeout(g), !(r.hidden || document.hidden) && (gt.size || rt()) && (g = window.setTimeout(() => {
      At(), an(), lr();
    }, 500));
  }, lt = (E) => {
    e.add(null, E, !1, Date.now());
  }, ur = () => {
    try {
      document.pointerLockElement && document.exitPointerLock();
    } catch {
    }
  }, dr = () => {
    if (!t.me()) {
      r.hidden && (r.hidden = !1, y()), o = !1, lt("Join the room to chat. Anyone can watch; you need one free signature to speak."), et(), t.joinPrompt();
      return;
    }
    r.hidden && (r.hidden = !1, y()), l = 0, c = 0, o = !0, ur(), et(), b.focus();
  }, Vn = () => {
    o = !1, a = null, f = !1, u = "", b.blur(), et();
  }, pr = () => {
    r.hidden = !0, y(), o = !1, a = null, f = !1, u = "", l = 0, c = 0, b.blur(), et();
  }, oe = () => {
    a = null, f = !1, et();
  };
  function br(E) {
    a = E, f = !1, ur(), et();
  }
  function gr(E) {
    u = u === E ? "" : E, a = null, f = !1, et();
  }
  function Ps(E) {
    if (U(E.a)) {
      lt(Wn("blocked")), et();
      return;
    }
    i = { a: E.a }, u = "", dr();
  }
  const Fe = () => {
    i = null, et(), b.focus();
  }, cn = () => {
    t.me() && t.send({ t: "blocks", list: s });
  };
  function Kn(E, M) {
    const W = H(E.a);
    if (M) {
      if (s.length >= Bh) {
        lt(Wn("too-many-blocks"));
        return;
      }
      s.includes(E.a) || s.push(E.a), e.dropFrom(E.a), (i == null ? void 0 : i.a) === E.a && (i = null), lt(`You blocked ${W}. Neither of you will see the other's messages.`);
    } else
      s = s.filter((F) => F !== E.a), lt(`You unblocked ${W}.`);
    e.setBlocked(s), gt.forEach((F) => F.remove()), gt.clear(), B(), cn();
  }
  function xr(E, M) {
    if (!t.me() || !t.connected()) {
      lt("Not connected to the room, so the report was not sent.");
      return;
    }
    t.send({ t: "report", who: E.a, why: M, lines: e.lastFrom(E.a) }), lt("Sending your report…");
  }
  ht.onclick = () => {
    o && !r.hidden ? Vn() : dr();
  }, k.onclick = Fe, C.onsubmit = (E) => {
    E.preventDefault();
    const M = Date.now(), W = l3(b.value, { signed: !!t.me(), connected: t.connected(), now: M, lastSentAt: p }), F = "Not connected to the room yet. Your message is still in the box.";
    if (!W.ok) {
      lt(W.code === "offline" ? F : Wn(W.code)), et();
      return;
    }
    if (i && n.known && !n.has(i.a)) {
      lt(Wn("not-here")), et();
      return;
    }
    const st = i ? { t: "dm", to: i.a, text: W.text } : { t: "say", text: W.text };
    if (!t.send(st)) {
      lt(F), et();
      return;
    }
    p = M, d = { text: W.text, to: i }, b.value = "";
  }, b.addEventListener("keydown", (E) => {
    E.stopPropagation(), E.key === "Escape" && (E.preventDefault(), i && !b.value ? Fe() : Vn());
  }), b.addEventListener("keypress", (E) => E.stopPropagation()), document.addEventListener("pointerdown", (E) => {
    if (!a && !u) return;
    const M = E.target;
    M && ($.contains(M) || ht.contains(M)) || (a = null, f = !1, u = "", et());
  }), window.addEventListener("resize", an);
  const Ht = document.getElementById("intro");
  Ht && "MutationObserver" in window && new MutationObserver(() => an()).observe(Ht, { attributes: !0, attributeFilter: ["class", "style", "hidden"] }), document.addEventListener("visibilitychange", () => {
    document.hidden || et();
  });
  const fn = {
    button: ht,
    mount(E) {
      E.append($), et();
    },
    /**
     * Someone spoke: `say` to the room or `dm` to one person. The room sends our own lines back too (to every tab of ours), so our
     * screen shows exactly what was delivered.
     */
    heard(E) {
      if (!(E != null && E.from) || typeof E.from.a != "string") return;
      const M = t.me(), W = !!M && E.from.a === M, F = E.t === "dm" && E.to && typeof E.to.a == "string" ? { a: E.to.a } : void 0;
      e.add({ a: E.from.a }, String(E.text ?? "").slice(0, ds * 2), W, Date.now(), F) && (W ? d = null : r.hidden && (l += 1, F && (c += 1)), et());
    },
    /** The room refused something. A refused message goes back into the box so nothing typed is lost. */
    failed(E) {
      d && !b.value && (b.value = d.text, d.to && E !== "not-here" && E !== "no-such-player" && (i = d.to)), (E === "not-here" || E === "no-such-player") && (i = null), d = null, lt(Wn(E)), et();
    },
    reported() {
      lt("Report sent. Thank you."), et();
    },
    /** A fresh connection: the room has forgotten our block list, so hand it over again, and take its list of who is here. */
    room(E, M) {
      n.set(E), M ? cn() : (o = !1, i = null, a = null, f = !1, u = "", b.value = "", d = null), i && !n.has(i.a) && (i = null), et();
    },
    joined(E) {
      n.join(E), u === "people" || a ? et() : D.textContent = `Here now (${n.others(t.me()).length})`;
    },
    left(E) {
      n.leave(E), typeof E == "string" && (i == null ? void 0 : i.a) === E && (lt(`${H(E)} left the room.`), i = null), et();
    },
    /** The connection dropped: until the room speaks again we do not know who is here. */
    disconnected() {
      n.forget(), et();
    },
    /** Names learned from BNS arrive late; relabel what is already on screen. */
    refreshNames() {
      $.querySelectorAll("button.nm[data-a]").forEach((E) => {
        E.textContent = H(E.dataset.a);
      }), i && Gn();
    },
    isTyping: () => o,
    debug: () => ({ typing: o, hidden: r.hidden, side: r.side, target: (i == null ? void 0 : i.a) ?? null, blocks: [...s], lines: e.size, shown: gt.size, people: n.others(t.me()).map((E) => E.a) })
  };
  return Rn(), fn;
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
  lastSent: 0,
  host: null,
  retryTimer: 0
};
let J = null;
const y3 = (t) => t.length <= 12 ? t : `${t.slice(0, 5)}…${t.slice(-4)}`, w3 = (t) => {
  if (t.startsWith("SP")) return t;
  const e = ai(t);
  return xo({ ...e, version: lo.MainnetSingleSig });
}, m3 = fw((t) => Mw({ address: w3(t), network: "mainnet" }), () => {
  ps(), J == null || J.refreshNames();
}), Ui = (t) => {
  let e = null;
  try {
    e = m3.get(t);
  } catch {
  }
  return e || y3(t);
}, ps = () => {
  var n;
  if (!m.host || m.service !== "ok") return;
  const t = ((n = m.you) == null ? void 0 : n.a) ?? null, e = Object.entries(m.spots).filter(([, r]) => r.a !== t).map(([r, s]) => ({ key: s.a, spot: r, label: Ui(s.a), since: s.since }));
  try {
    m.host.setPeople(e);
  } catch (r) {
    console.warn("[room] the page could not draw the people", r);
  }
}, bs = async (t, e) => {
  const n = await fetch(t, { credentials: "same-origin", ...e });
  let r = null;
  try {
    r = await n.json();
  } catch {
  }
  return { res: n, body: r };
}, Go = (t) => {
  var e;
  return ((e = m.ws) == null ? void 0 : e.readyState) !== WebSocket.OPEN ? !1 : (m.ws.send(JSON.stringify(t)), m.lastSent = Date.now(), !0);
}, _h = () => {
  var e;
  if (m.service !== "ok" || !m.connected || !m.you || m.you.guest || !m.signed) return;
  const t = ((e = Object.entries(m.spots).find(([, n]) => n.a === m.you.a)) == null ? void 0 : e[0]) ?? null;
  m.want ? t !== m.want && m.want !== m.badSpot && !m.spots[m.want] && Date.now() - m.lastSent > 1200 && Go({ t: "sit", spot: m.want }) : t && Date.now() - m.lastSent > 600 && Go({ t: "stand" });
}, Oi = () => {
  if (m.service !== "ok" || m.ws) return;
  m.attempts += 1;
  let t;
  try {
    t = new WebSocket(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/casino/room/ws`);
  } catch {
    return ef();
  }
  m.ws = t, t.onopen = () => {
    m.connected = !0, m.attempts = 0, dt();
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
        m.you = n.you, m.spots = n.spots || {}, m.joined = n.joined, m.guests = n.guests, m.signed && ((r = m.you) != null && r.guest) && (m.signed = null), J == null || J.room(n.players, !!(m.you && !m.you.guest));
        break;
      case "sat":
        m.spots[n.spot] = n.who;
        break;
      case "stood":
        delete m.spots[n.spot];
        break;
      case "count":
        m.joined = n.joined, m.guests = n.guests;
        break;
      case "say":
      case "dm":
        J == null || J.heard(n);
        return;
      case "join":
        J == null || J.joined(n.who);
        return;
      case "leave":
        J == null || J.left(n.a);
        return;
      case "reported":
        J == null || J.reported();
        return;
      case "err":
        n.code === "no-such-spot" ? m.badSpot = m.want : c3(n.code) && (J == null || J.failed(n.code));
        return;
      default:
        return;
    }
    ps(), _h(), dt();
  }, t.onclose = (e) => {
    if (m.ws === t) {
      if (m.ws = null, m.connected = !1, m.spots = {}, ps(), J == null || J.disconnected(), e.code === 4001) {
        m.replaced = !0, dt();
        return;
      }
      dt(), ef();
    }
  }, t.onerror = () => {
  };
}, ef = () => {
  window.clearTimeout(m.retryTimer);
  const t = Math.min(15e3, 1e3 * 2 ** Math.min(m.attempts, 4));
  m.retryTimer = window.setTimeout(() => {
    m.ws || Oi();
  }, t);
}, Ci = () => {
  const t = m.ws;
  m.ws = null, m.connected = !1, m.attempts = 0, m.replaced = !1;
  try {
    t == null || t.close(1e3, "client");
  } catch {
  }
  Oi();
};
async function S3(t) {
  const { res: e, body: n } = await bs(`/casino/room/challenge?address=${encodeURIComponent(t.address)}`);
  if (!e.ok) throw new Error((n == null ? void 0 : n.error) || `The room answered ${e.status}.`);
  const r = n.challenge, { domain: s, message: o } = zw(r);
  m.busy = "sign", dt();
  let i;
  try {
    i = await cw({ domain: s, message: o, network: r.network, stxAddress: t.address });
  } catch (u) {
    throw new Error("The wallet did not sign: " + vh(u));
  }
  const { res: a, body: f } = await bs("/casino/room/session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ challenge: r, signature: i })
  });
  if (!a.ok) throw new Error((f == null ? void 0 : f.error) || `The room answered ${a.status}.`);
  m.signed = { address: f.address, hash160: f.hash160, expiresAt: f.expiresAt }, Ci();
}
async function E3(t) {
  if (!m.busy) {
    m.error = "", m.busy = "connect", dt();
    try {
      m.wallet = await Qw(t), t3(t), await S3(m.wallet), m.open = !1;
    } catch (e) {
      m.error = vh(e);
    } finally {
      m.busy = "", dt();
    }
  }
}
async function A3() {
  try {
    await bs("/casino/room/session", { method: "DELETE" });
  } catch {
  }
  m.signed = null, m.wallet = null, m.error = "", J == null || J.disconnected(), Ci(), dt();
}
const v3 = `
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
}, Ve = (t, e) => {
  const n = ot("p", void 0, "fact");
  return n.append(ot("b", t), document.createTextNode(` ${e}`)), n;
};
let Ie = null, mt = null, Kt = null;
function B3() {
  var n, r;
  if (Ie || m.service !== "ok") return;
  const t = document.createElement("style");
  t.textContent = v3, document.head.append(t), Ie = ot("span"), Ie.id = "pxroom", mt = ot("button"), mt.id = "pxroom-btn", mt.type = "button", mt.setAttribute("aria-label", "Casino room: see who is here and join"), mt.onclick = () => {
    m.open = !m.open, dt();
  }, Kt = ot("div"), Kt.id = "pxroom-panel", Kt.hidden = !0, J = x3({
    send: Go,
    me: () => m.you && !m.you.guest ? m.you.a : null,
    connected: () => m.connected,
    labelFor: Ui,
    joinPrompt: () => {
      m.open = !0, dt();
    }
  }), Ie.append(mt, J.button);
  const e = ((r = (n = m.host) == null ? void 0 : n.mount) == null ? void 0 : r.call(n)) ?? document.querySelector("#tools .rt");
  e ? e.insertBefore(Ie, e.firstChild) : (Ie.style.cssText = "position:fixed;top:10px;right:10px;z-index:30", document.body.append(Ie)), document.body.append(Kt), J.mount(document.body), document.addEventListener("keydown", (s) => {
    s.key === "Escape" && m.open && (m.open = !1, dt());
  }), document.addEventListener("pointerdown", (s) => {
    if (!m.open) return;
    const o = s.target;
    o && (Kt.contains(o) || mt.contains(o)) || (m.open = !1, dt());
  }), window.addEventListener("resize", () => dt());
}
function $3() {
  if (!mt || !Kt) return;
  const t = mt.getBoundingClientRect(), e = t.height ? Math.round(t.bottom + 8) : 64;
  Kt.style.top = `${Math.min(e, Math.max(64, window.innerHeight - 220))}px`;
}
function dt() {
  var n;
  if (!Ie || !mt || !Kt) return;
  const t = !!(m.signed && m.you && !m.you.guest);
  if (mt.className = m.connected ? "live" : "wait", mt.replaceChildren(ot("i"), ot("span", t ? "In the room" : "Room", "lbl"), ot("span", m.connected ? (n = window.matchMedia) != null && n.call(window, "(max-width:620px)").matches ? String(m.joined) : ` · ${m.joined}` : "", "n")), mt.setAttribute("aria-label", `Casino room: ${m.connected ? `${m.joined} signed in, ` : ""}${t ? "you are in" : "see who is here and join"}`), Kt.hidden = !m.open, !m.open) return;
  $3();
  const e = [];
  if (m.replaced) {
    e.push(ot("h3", "Room"), ot("p", "Another tab of yours took over the room. You are not connected here."));
    const r = ot("button", "Use this tab instead");
    r.onclick = () => {
      Ci(), dt();
    }, e.push(r);
  } else if (t) {
    e.push(ot("h3", "You are in the room")), e.push(ot("p", "Others see you at your seat as"), ot("p", Ui(m.signed.address), "who")), e.push(ot("p", `${m.joined} signed in, ${m.guests} watching.`)), e.push(Ve("Be seen", "Sit at a table or connect to a machine and your Adrian and name tag appear there for everyone in the room. Stand up or walk away and they go too.")), e.push(Ve("Spaces", "Each seat and machine holds one person. If someone already has the seat you choose, you are given a free one at the same table.")), e.push(Ve("Live chat", "Press Chat to talk to the room. Tap a name, or Here now, to send someone a direct message, block or report them. Messages are not secret and are not saved.")), e.push(ot("p", "Nothing here moves any money.", "fact"));
    const r = ot("button", "Leave the room");
    r.onclick = () => {
      A3();
    }, e.push(r);
  } else {
    e.push(ot("h3", "Join the room")), e.push(ot("p", m.connected ? `You are watching: ${m.joined} signed in, ${m.guests} watching.` : "Connecting to the room…")), e.push(Ve("Be seen", "Join, then sit at a table or connect to a machine. Everyone in the room sees your Adrian there, with a name tag (your BNS name, or a short version of your address). Watching alone shows you to nobody.")), e.push(Ve("Spaces", "Each seat and machine holds one person. If someone already has the seat you choose, you are given a free one at the same table.")), e.push(Ve("Live chat", "Signed-in players can chat with the room and send each other direct messages. Messages are not secret and are not saved.")), e.push(Ve("Free", "One signature. It sends no transaction, costs no fee and gives no permission to spend anything."));
    const r = ot("div", void 0, "row");
    for (const s of ["leather", "xverse"]) {
      const o = ot("button", m.busy ? m.busy === "sign" ? "Check your wallet…" : "Connecting…" : s === "leather" ? "Leather" : "Xverse");
      if (o.disabled = !!m.busy || !m.connected, o.onclick = () => {
        E3(s);
      }, r.append(o), m.busy) break;
    }
    e.push(r), m.error && e.push(ot("p", m.error, "err"));
  }
  Kt.replaceChildren(...e);
}
const _3 = () => {
  var e;
  const t = ((e = m.host) == null ? void 0 : e.currentSpot()) ?? null;
  t !== m.want && (m.want = t, ps()), _h();
};
async function H3() {
  try {
    const { res: t, body: e } = await bs("/casino/room/session");
    if (t.status === 503) return;
    t.ok && (e != null && e.address) && (m.signed = { address: e.address, hash160: e.hash160, expiresAt: e.expiresAt }), m.service = "ok";
  } catch {
    return;
  }
  B3(), dt(), Oi(), window.setInterval(_3, 250);
}
const nf = (t) => {
  m.host || (m.host = t, H3());
}, rf = window.PXRoomHost;
rf ? nf(rf) : window.addEventListener("px-room-host", () => nf(window.PXRoomHost), { once: !0 });
window.__pxRoom = {
  chat: () => (J == null ? void 0 : J.debug()) ?? null,
  get state() {
    var t;
    return { service: m.service, signed: ((t = m.signed) == null ? void 0 : t.address) ?? null, connected: m.connected, you: m.you, spots: m.spots, joined: m.joined, guests: m.guests, want: m.want, trail: Le.slice() };
  }
};
