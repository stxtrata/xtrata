var Il = Object.defineProperty;
var Ul = (t, e, n) => e in t ? Il(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var fr = (t, e, n) => Ul(t, typeof e != "symbol" ? e + "" : e, n);
function Lo(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = un(r);
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
      const r = Pl(BigInt(`0x${Yt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Yt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Io(t, e = 8) {
  return (typeof t == "bigint" ? t : Lo(t, !1)).toString(16).padStart(e * 2, "0");
}
function Xa(t) {
  return parseInt(t, 16);
}
function Ya(t, e = 16) {
  const n = Io(t, e);
  return un(n);
}
function Ol(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Cl(t, e) {
  return t & BigInt(1) << e;
}
function Pl(t, e) {
  return Cl(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Nl = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Yt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Nl[n];
  return e;
}
function un(t) {
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
function Kn(t) {
  return new TextEncoder().encode(t);
}
function Ja(t) {
  return new TextDecoder().decode(t);
}
function Za(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function kl(t) {
  return String.fromCharCode.apply(null, t);
}
function Dl(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Fi(t) {
  if (t.some(Dl))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Uo(...t) {
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
function An(t) {
  return Uo(...t.map((e) => typeof e == "number" ? Fi([e]) : e instanceof Array ? Fi(e) : e));
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
function ns(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Xs;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Xs || (Xs = {}));
Xs.Mainnet;
const Rl = 128, Gl = 128, Qa = 16;
var Fn;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Fn || (Fn = {}));
var Mi;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Mi || (Mi = {}));
var Ri;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Ri || (Ri = {}));
var vt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(vt || (vt = {}));
const Is = ["onChainOnly", "offChainOnly", "any"];
Is[0] + "", vt.OnChainOnly, Is[1] + "", vt.OffChainOnly, Is[2] + "", vt.Any, vt.OnChainOnly + "", vt.OnChainOnly, vt.OffChainOnly + "", vt.OffChainOnly, vt.Any + "", vt.Any;
var Ys;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ys || (Ys = {}));
Ys.Mainnet;
var Gi;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Gi || (Gi = {}));
var Vi;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Vi || (Vi = {}));
var Ki;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ki || (Ki = {}));
var zi;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(zi || (zi = {}));
var Js;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Js || (Js = {}));
var ji;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(ji || (ji = {}));
var qi;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(qi || (qi = {}));
var Wi;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Wi || (Wi = {}));
var Xi;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Xi || (Xi = {}));
var Yi;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Yi || (Yi = {}));
var Ji;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Ji || (Ji = {}));
function Zs(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Vl(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function t0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Kl(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Zs(t.outputLen), Zs(t.blockLen);
}
function zl(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function jl(t, e) {
  t0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Us = {
  number: Zs,
  bool: Vl,
  bytes: t0,
  hash: Kl,
  exists: zl,
  output: jl
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Os = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), It = (t, e) => t << 32 - e | t >>> e, ql = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!ql)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Wl(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function e0(t) {
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
function We(t) {
  const e = (r) => t().update(e0(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Yl(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, i, r), t.setUint32(e + u, c, r);
}
let Oo = class extends Xl {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Os(this.buffer);
  }
  update(e) {
    Us.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = e0(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const f = Os(e);
        for (; s <= o - i; i += s)
          this.process(f, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Us.exists(this), Us.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let a = i; a < s; a++)
      n[a] = 0;
    Yl(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = Os(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = f / 4, l = this.get();
    if (u > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let a = 0; a < u; a++)
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
const Jl = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), n0 = Uint8Array.from({ length: 16 }, (t, e) => e), Zl = n0.map((t) => (9 * t + 5) % 16);
let Co = [n0], Po = [Zl];
for (let t = 0; t < 4; t++)
  for (let e of [Co, Po])
    e.push(e[t].map((n) => Jl[n]));
const r0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Ql = Co.map((t, e) => t.map((n) => r0[e][n])), tu = Po.map((t, e) => t.map((n) => r0[e][n])), eu = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), nu = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), hr = (t, e) => t << e | t >>> 32 - e;
function Zi(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const lr = new Uint32Array(16);
let ru = class extends Oo {
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
      lr[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, c = this.h2 | 0, f = c, u = this.h3 | 0, l = u, a = this.h4 | 0, p = a;
    for (let d = 0; d < 5; d++) {
      const g = 4 - d, y = eu[d], E = nu[d], _ = Co[d], L = Po[d], x = Ql[d], v = tu[d];
      for (let S = 0; S < 16; S++) {
        const P = hr(r + Zi(d, o, c, u) + lr[_[S]] + y, x[S]) + a | 0;
        r = a, a = u, u = hr(c, 10) | 0, c = o, o = P;
      }
      for (let S = 0; S < 16; S++) {
        const P = hr(s + Zi(g, i, f, l) + lr[L[S]] + E, v[S]) + p | 0;
        s = p, p = l, l = hr(f, 10) | 0, f = i, i = P;
      }
    }
    this.set(this.h1 + c + l | 0, this.h2 + u + p | 0, this.h3 + a + s | 0, this.h4 + r + i | 0, this.h0 + o + f | 0);
  }
  roundClean() {
    lr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
We(() => new ru());
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
let s0 = class extends Oo {
  constructor() {
    super(64, 32, 8, !1), this.A = ee[0] | 0, this.B = ee[1] | 0, this.C = ee[2] | 0, this.D = ee[3] | 0, this.E = ee[4] | 0, this.F = ee[5] | 0, this.G = ee[6] | 0, this.H = ee[7] | 0;
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
      ne[a] = e.getUint32(n, !1);
    for (let a = 16; a < 64; a++) {
      const p = ne[a - 15], d = ne[a - 2], g = It(p, 7) ^ It(p, 18) ^ p >>> 3, y = It(d, 17) ^ It(d, 19) ^ d >>> 10;
      ne[a] = y + ne[a - 7] + g + ne[a - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: f, G: u, H: l } = this;
    for (let a = 0; a < 64; a++) {
      const p = It(c, 6) ^ It(c, 11) ^ It(c, 25), d = l + p + su(c, f, u) + iu[a] + ne[a] | 0, y = (It(r, 2) ^ It(r, 13) ^ It(r, 22)) + ou(r, s, o) | 0;
      l = u, u = f, f = c, c = i + d | 0, i = o, o = s, s = r, r = d + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, l = l + this.H | 0, this.set(r, s, o, i, c, f, u, l);
  }
  roundClean() {
    ne.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, cu = class extends s0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
We(() => new s0());
We(() => new cu());
const ur = BigInt(2 ** 32 - 1), Qs = BigInt(32);
function o0(t, e = !1) {
  return e ? { h: Number(t & ur), l: Number(t >> Qs & ur) } : { h: Number(t >> Qs & ur) | 0, l: Number(t & ur) | 0 };
}
function au(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = o0(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const fu = (t, e) => BigInt(t >>> 0) << Qs | BigInt(e >>> 0), hu = (t, e, n) => t >>> n, lu = (t, e, n) => t << 32 - n | e >>> n, uu = (t, e, n) => t >>> n | e << 32 - n, du = (t, e, n) => t << 32 - n | e >>> n, pu = (t, e, n) => t << 64 - n | e >>> n - 32, bu = (t, e, n) => t >>> n - 32 | e << 64 - n, gu = (t, e) => e, xu = (t, e) => t, yu = (t, e, n) => t << n | e >>> 32 - n, wu = (t, e, n) => e << n | t >>> 32 - n, mu = (t, e, n) => e << n - 32 | t >>> 64 - n, Su = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Eu(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Au = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Bu = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, vu = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), $u = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, _u = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Hu = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, M = {
  fromBig: o0,
  split: au,
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
  add3H: Bu,
  add4L: vu,
  add4H: $u,
  add5H: Hu,
  add5L: _u
}, [Lu, Iu] = M.split([
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
let rs = class extends Oo {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: c, Dl: f, Eh: u, El: l, Fh: a, Fl: p, Gh: d, Gl: g, Hh: y, Hl: E } = this;
    return [e, n, r, s, o, i, c, f, u, l, a, p, d, g, y, E];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, f, u, l, a, p, d, g, y, E) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = f | 0, this.Eh = u | 0, this.El = l | 0, this.Fh = a | 0, this.Fl = p | 0, this.Gh = d | 0, this.Gl = g | 0, this.Hh = y | 0, this.Hl = E | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      re[x] = e.getUint32(n), se[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const v = re[x - 15] | 0, S = se[x - 15] | 0, P = M.rotrSH(v, S, 1) ^ M.rotrSH(v, S, 8) ^ M.shrSH(v, S, 7), F = M.rotrSL(v, S, 1) ^ M.rotrSL(v, S, 8) ^ M.shrSL(v, S, 7), O = re[x - 2] | 0, C = se[x - 2] | 0, b = M.rotrSH(O, C, 19) ^ M.rotrBH(O, C, 61) ^ M.shrSH(O, C, 6), A = M.rotrSL(O, C, 19) ^ M.rotrBL(O, C, 61) ^ M.shrSL(O, C, 6), H = M.add4L(F, A, se[x - 7], se[x - 16]), D = M.add4H(H, P, b, re[x - 7], re[x - 16]);
      re[x] = D | 0, se[x] = H | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: c, Cl: f, Dh: u, Dl: l, Eh: a, El: p, Fh: d, Fl: g, Gh: y, Gl: E, Hh: _, Hl: L } = this;
    for (let x = 0; x < 80; x++) {
      const v = M.rotrSH(a, p, 14) ^ M.rotrSH(a, p, 18) ^ M.rotrBH(a, p, 41), S = M.rotrSL(a, p, 14) ^ M.rotrSL(a, p, 18) ^ M.rotrBL(a, p, 41), P = a & d ^ ~a & y, F = p & g ^ ~p & E, O = M.add5L(L, S, F, Iu[x], se[x]), C = M.add5H(O, _, v, P, Lu[x], re[x]), b = O | 0, A = M.rotrSH(r, s, 28) ^ M.rotrBH(r, s, 34) ^ M.rotrBH(r, s, 39), H = M.rotrSL(r, s, 28) ^ M.rotrBL(r, s, 34) ^ M.rotrBL(r, s, 39), D = r & o ^ r & c ^ o & c, z = s & i ^ s & f ^ i & f;
      _ = y | 0, L = E | 0, y = d | 0, E = g | 0, d = a | 0, g = p | 0, { h: a, l: p } = M.add(u | 0, l | 0, C | 0, b | 0), u = c | 0, l = f | 0, c = o | 0, f = i | 0, o = r | 0, i = s | 0;
      const k = M.add3L(b, H, z);
      r = M.add3H(k, C, A, D), s = k | 0;
    }
    ({ h: r, l: s } = M.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = M.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: c, l: f } = M.add(this.Ch | 0, this.Cl | 0, c | 0, f | 0), { h: u, l } = M.add(this.Dh | 0, this.Dl | 0, u | 0, l | 0), { h: a, l: p } = M.add(this.Eh | 0, this.El | 0, a | 0, p | 0), { h: d, l: g } = M.add(this.Fh | 0, this.Fl | 0, d | 0, g | 0), { h: y, l: E } = M.add(this.Gh | 0, this.Gl | 0, y | 0, E | 0), { h: _, l: L } = M.add(this.Hh | 0, this.Hl | 0, _ | 0, L | 0), this.set(r, s, o, i, c, f, u, l, a, p, d, g, y, E, _, L);
  }
  roundClean() {
    re.fill(0), se.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Uu = class extends rs {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Ou = class extends rs {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Cu = class extends rs {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
We(() => new rs());
We(() => new Uu());
We(() => new Ou());
We(() => new Cu());
const Pu = {}, i0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Pu
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const j = BigInt(0), et = BigInt(1), Le = BigInt(2), Nn = BigInt(3), Qi = BigInt(8), J = Object.freeze({
  a: j,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: et,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), tc = (t, e) => (t + e / Le) / e, dr = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = J, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -et * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), o = n, i = BigInt("0x100000000000000000000000000000000"), c = tc(o * t, e), f = tc(-r * t, e);
    let u = I(t - c * n - f * s, e), l = I(-c * r - f * o, e);
    const a = u > i, p = l > i;
    if (a && (u = e - u), p && (l = e - l), u > i || l > i)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: a, k1: u, k2neg: p, k2: l };
  }
}, Lt = 32, Ge = 32, c0 = 32, Fr = Lt + 1, Mr = 2 * Lt + 1;
function ec(t) {
  const { a: e, b: n } = J, r = I(t * t), s = I(r * t);
  return I(s + e * t + n);
}
const pr = J.a === j;
class No extends Error {
  constructor(e) {
    super(e);
  }
}
function nc(t) {
  if (!(t instanceof X))
    throw new TypeError("JacobianPoint expected");
}
class X {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof q))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(q.ZERO) ? X.ZERO : new X(e.x, e.y, et);
  }
  static toAffineBatch(e) {
    const n = Fu(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return X.toAffineBatch(e).map(X.fromAffine);
  }
  equals(e) {
    nc(e);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: c } = e, f = I(s * s), u = I(c * c), l = I(n * u), a = I(o * f), p = I(I(r * c) * u), d = I(I(i * s) * f);
    return l === a && p === d;
  }
  negate() {
    return new X(this.x, I(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = I(e * e), o = I(n * n), i = I(o * o), c = e + o, f = I(Le * (I(c * c) - s - i)), u = I(Nn * s), l = I(u * u), a = I(l - Le * f), p = I(u * (f - a) - Qi * i), d = I(Le * n * r);
    return new X(a, p, d);
  }
  add(e) {
    nc(e);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: c } = e;
    if (o === j || i === j)
      return this;
    if (n === j || r === j)
      return e;
    const f = I(s * s), u = I(c * c), l = I(n * u), a = I(o * f), p = I(I(r * c) * u), d = I(I(i * s) * f), g = I(a - l), y = I(d - p);
    if (g === j)
      return y === j ? this.double() : X.ZERO;
    const E = I(g * g), _ = I(g * E), L = I(l * E), x = I(y * y - _ - Le * L), v = I(y * (L - x) - p * _), S = I(s * c * g);
    return new X(x, v, S);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = X.ZERO;
    if (typeof e == "bigint" && e === j)
      return n;
    let r = oc(e);
    if (r === et)
      return this;
    if (!pr) {
      let a = n, p = this;
      for (; r > j; )
        r & et && (a = a.add(p)), p = p.double(), r >>= et;
      return a;
    }
    let { k1neg: s, k1: o, k2neg: i, k2: c } = dr.splitScalar(r), f = n, u = n, l = this;
    for (; o > j || c > j; )
      o & et && (f = f.add(l)), c & et && (u = u.add(l)), l = l.double(), o >>= et, c >>= et;
    return s && (f = f.negate()), i && (u = u.negate()), u = new X(I(u.x * dr.beta), u.y, u.z), f.add(u);
  }
  precomputeWindow(e) {
    const n = pr ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(X.BASE) && (n = q.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && to.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = X.normalizeZ(s), to.set(n, s)));
    let o = X.ZERO, i = X.BASE;
    const c = 1 + (pr ? 128 / r : 256 / r), f = 2 ** (r - 1), u = BigInt(2 ** r - 1), l = 2 ** r, a = BigInt(r);
    for (let p = 0; p < c; p++) {
      const d = p * f;
      let g = Number(e & u);
      e >>= a, g > f && (g -= l, e += et);
      const y = d, E = d + Math.abs(g) - 1, _ = p % 2 !== 0, L = g < 0;
      g === 0 ? i = i.add(br(_, s[y])) : o = o.add(br(L, s[E]));
    }
    return { p: o, f: i };
  }
  multiply(e, n) {
    let r = oc(e), s, o;
    if (pr) {
      const { k1neg: i, k1: c, k2neg: f, k2: u } = dr.splitScalar(r);
      let { p: l, f: a } = this.wNAF(c, n), { p, f: d } = this.wNAF(u, n);
      l = br(i, l), p = br(f, p), p = new X(I(p.x * dr.beta), p.y, p.z), s = l.add(p), o = a.add(d);
    } else {
      const { p: i, f: c } = this.wNAF(r, n);
      s = i, o = c;
    }
    return X.normalizeZ([s, o])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, o = this.equals(X.ZERO);
    e == null && (e = o ? Qi : Bn(s));
    const i = e, c = I(i * i), f = I(c * i), u = I(n * c), l = I(r * f), a = I(s * i);
    if (o)
      return q.ZERO;
    if (a !== et)
      throw new Error("invZ was invalid");
    return new q(u, l);
  }
}
X.BASE = new X(J.Gx, J.Gy, et);
X.ZERO = new X(j, et, j);
function br(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const to = /* @__PURE__ */ new WeakMap();
class q {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, to.delete(this);
  }
  hasEvenY() {
    return this.y % Le === j;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = wt(n ? e : e.subarray(1));
    if (!Pr(r))
      throw new Error("Point is not on curve");
    const s = ec(r);
    let o = Tu(s);
    const i = (o & et) === et;
    n ? i && (o = I(-o)) : (e[0] & 1) === 1 !== i && (o = I(-o));
    const c = new q(r, o);
    return c.assertValidity(), c;
  }
  static fromUncompressedHex(e) {
    const n = wt(e.subarray(1, Lt + 1)), r = wt(e.subarray(Lt + 1, Lt * 2 + 1)), s = new q(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Tt(e), r = n.length, s = n[0];
    if (r === Lt)
      return this.fromCompressedHex(n);
    if (r === Fr && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === Mr && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Fr} compressed bytes or ${Mr} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return q.BASE.multiply(Ve(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: o } = h0(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const i = ko(Tt(e)), { n: c } = J, f = r === 2 || r === 3 ? s + c : s, u = Bn(f, c), l = I(-i * u, c), a = I(o * u, c), p = r & 1 ? "03" : "02", d = q.fromHex(p + Ie(f)), g = q.BASE.multiplyAndAddUnsafe(d, l, a);
    if (!g)
      throw new Error("Cannot recover signature: point at infinify");
    return g.assertValidity(), g;
  }
  toRawBytes(e = !1) {
    return Ue(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Ie(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Ie(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Pr(n) || !Pr(r))
      throw new Error(e);
    const s = I(r * r), o = ec(n);
    if (I(s - o) !== j)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new q(this.x, I(-this.y));
  }
  double() {
    return X.fromAffine(this).double().toAffine();
  }
  add(e) {
    return X.fromAffine(this).add(X.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return X.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = X.fromAffine(this), o = n === j || n === et || this !== q.BASE ? s.multiplyUnsafe(n) : s.multiply(n), i = X.fromAffine(e).multiplyUnsafe(r), c = o.add(i);
    return c.equals(X.ZERO) ? void 0 : c.toAffine();
  }
}
q.BASE = new q(J.Gx, J.Gy);
q.ZERO = new q(j, j);
function rc(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function sc(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${dn(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: wt(n), left: t.subarray(e + 2) };
}
function Nu(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${dn(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = sc(t.subarray(2)), { data: r, left: s } = sc(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${dn(s)}`);
  return { r: e, s: r };
}
class Xt {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? dn(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Xt(Rr(s.slice(0, 64)), Rr(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Nu(n ? e : Ue(e));
    return new Xt(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!bn(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!bn(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = J.n >> et;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Xt(this.r, I(-this.s, J.n)) : this;
  }
  toDERRawBytes() {
    return Ue(this.toDERHex());
  }
  toDERHex() {
    const e = rc(Pn(this.s)), n = rc(Pn(this.r)), r = e.length / 2, s = n.length / 2, o = Pn(r), i = Pn(s);
    return `30${Pn(s + r + 4)}02${i}${n}02${o}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Ue(this.toCompactHex());
  }
  toCompactHex() {
    return Ie(this.r) + Ie(this.s);
  }
}
function _e(...t) {
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
const ku = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function dn(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += ku[t[n]];
  return e;
}
const Du = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Ie(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(j <= t && t < Du))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function pn(t) {
  const e = Ue(Ie(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Pn(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Rr(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function Ue(t) {
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
function wt(t) {
  return Rr(dn(t));
}
function Tt(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Ue(t);
}
function oc(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && bn(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function I(t, e = J.P) {
  const n = t % e;
  return n >= j ? n : e + n;
}
function mt(t, e) {
  const { P: n } = J;
  let r = t;
  for (; e-- > j; )
    r *= r, r %= n;
  return r;
}
function Tu(t) {
  const { P: e } = J, n = BigInt(6), r = BigInt(11), s = BigInt(22), o = BigInt(23), i = BigInt(44), c = BigInt(88), f = t * t * t % e, u = f * f * t % e, l = mt(u, Nn) * u % e, a = mt(l, Nn) * u % e, p = mt(a, Le) * f % e, d = mt(p, r) * p % e, g = mt(d, s) * d % e, y = mt(g, i) * g % e, E = mt(y, c) * y % e, _ = mt(E, i) * g % e, L = mt(_, Nn) * u % e, x = mt(L, o) * d % e, v = mt(x, n) * f % e, S = mt(v, Le);
  if (S * S % e !== t)
    throw new Error("Cannot find square root");
  return S;
}
function Bn(t, e = J.P) {
  if (t === j || e <= j)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = I(t, e), r = e, s = j, o = et;
  for (; n !== j; ) {
    const c = r / n, f = r % n, u = s - o * c;
    r = n, n = f, s = o, o = u;
  }
  if (r !== et)
    throw new Error("invert: does not exist");
  return I(s, e);
}
function Fu(t, e = J.P) {
  const n = new Array(t.length), r = t.reduce((o, i, c) => i === j ? o : (n[c] = o, I(o * i, e)), et), s = Bn(r, e);
  return t.reduceRight((o, i, c) => i === j ? o : (n[c] = I(o * n[c], e), I(o * i, e)), s), n;
}
function Mu(t) {
  const e = t.length * 8 - Ge * 8, n = wt(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function ko(t, e = !1) {
  const n = Mu(t);
  if (e)
    return n;
  const { n: r } = J;
  return n >= r ? n - r : n;
}
let ln, kn;
class a0 {
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
    return kn(this.k, ...e);
  }
  checkSync() {
    if (typeof kn != "function")
      throw new No("hmacSha256Sync needs to be set");
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
    return _e(...n);
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
    return _e(...n);
  }
}
function bn(t) {
  return j < t && t < J.n;
}
function Pr(t) {
  return j < t && t < J.P;
}
function f0(t, e, n, r = !0) {
  const { n: s } = J, o = ko(t, !0);
  if (!bn(o))
    return;
  const i = Bn(o, s), c = q.BASE.multiply(o), f = I(c.x, s);
  if (f === j)
    return;
  const u = I(i * I(e + n * f, s), s);
  if (u === j)
    return;
  let l = new Xt(f, u), a = (c.x === l.r ? 0 : 2) | Number(c.y & et);
  return r && l.hasHighS() && (l = l.normalizeS(), a ^= 1), { sig: l, recovery: a };
}
function Ve(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Ge)
      throw new Error("Expected 32 bytes of private key");
    e = Rr(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Ge)
      throw new Error("Expected 32 bytes of private key");
    e = wt(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!bn(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Do(t) {
  return t instanceof q ? (t.assertValidity(), t) : q.fromHex(t);
}
function h0(t) {
  if (t instanceof Xt)
    return t.assertValidity(), t;
  try {
    return Xt.fromDER(t);
  } catch {
    return Xt.fromCompact(t);
  }
}
function To(t, e = !1) {
  return q.fromPrivateKey(t).toRawBytes(e);
}
function Ru(t, e, n, r = !1) {
  return q.fromSignature(t, e, n).toRawBytes(r);
}
function ic(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === Fr || r === Mr : n ? r === Fr * 2 || r === Mr * 2 : t instanceof q;
}
function Fo(t, e, n = !1) {
  if (ic(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!ic(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Do(e);
  return r.assertValidity(), r.multiply(Ve(t)).toRawBytes(n);
}
function l0(t) {
  const e = t.length > Lt ? t.slice(0, Lt) : t;
  return wt(e);
}
function Gu(t) {
  const e = l0(t), n = I(e, J.n);
  return u0(n < j ? e : n);
}
function u0(t) {
  return pn(t);
}
function d0(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Tt(t), s = Ve(e), o = [u0(s), Gu(r)];
  if (n != null) {
    n === !0 && (n = it.randomBytes(Lt));
    const f = Tt(n);
    if (f.length !== Lt)
      throw new Error(`sign: Expected ${Lt} bytes of extra data`);
    o.push(f);
  }
  const i = _e(...o), c = l0(r);
  return { seed: i, m: c, d: s };
}
function p0(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: o } = Object.assign({ canonical: !0, der: !0 }, e), i = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return o ? [i, r] : i;
}
async function Vu(t, e, n = {}) {
  const { seed: r, m: s, d: o } = d0(t, e, n.extraEntropy), i = new a0(c0, Ge);
  await i.reseed(r);
  let c;
  for (; !(c = f0(await i.generate(), s, o, n.canonical)); )
    await i.reseed();
  return p0(c, n);
}
function b0(t, e, n = {}) {
  const { seed: r, m: s, d: o } = d0(t, e, n.extraEntropy), i = new a0(c0, Ge);
  i.reseedSync(r);
  let c;
  for (; !(c = f0(i.generateSync(), s, o, n.canonical)); )
    i.reseedSync();
  return p0(c, n);
}
const Ku = { strict: !0 };
function zu(t, e, n, r = Ku) {
  let s;
  try {
    s = h0(t), e = Tt(e);
  } catch {
    return !1;
  }
  const { r: o, s: i } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const c = ko(e);
  let f;
  try {
    f = Do(n);
  } catch {
    return !1;
  }
  const { n: u } = J, l = Bn(i, u), a = I(c * l, u), p = I(o * l, u), d = q.BASE.multiplyAndAddUnsafe(f, a, p);
  return d ? I(d.x, u) === o : !1;
}
function Gr(t) {
  return I(wt(t), J.n);
}
class gn {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Tt(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = wt(n.subarray(0, 32)), s = wt(n.subarray(32, 64));
    return new gn(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Pr(e) || !bn(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Ie(this.r) + Ie(this.s);
  }
  toRawBytes() {
    return Ue(this.toHex());
  }
}
function ju(t) {
  return q.fromPrivateKey(t).toRawX();
}
class g0 {
  constructor(e, n, r = it.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Tt(e);
    const { x: s, scalar: o } = this.getScalar(Ve(n));
    if (this.px = s, this.d = o, this.rand = Tt(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = q.fromPrivateKey(e), r = n.hasEvenY() ? e : J.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return pn(e ^ wt(n));
  }
  finalizeNonce(e) {
    const n = I(wt(e), J.n);
    if (n === j)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: o } = this.getScalar(n);
    return { R: r, rx: s, k: o };
  }
  finalizeSig(e, n, r, s) {
    return new gn(e.x, I(n + r * s, J.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, o = it.taggedHash, i = this.initNonce(n, await o($e.aux, s)), { R: c, rx: f, k: u } = this.finalizeNonce(await o($e.nonce, i, r, e)), l = Gr(await o($e.challenge, f, r, e)), a = this.finalizeSig(c, u, l, n);
    return await w0(a, e, r) || this.error(), a;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, o = it.taggedHashSync, i = this.initNonce(n, o($e.aux, s)), { R: c, rx: f, k: u } = this.finalizeNonce(o($e.nonce, i, r, e)), l = Gr(o($e.challenge, f, r, e)), a = this.finalizeSig(c, u, l, n);
    return m0(a, e, r) || this.error(), a;
  }
}
async function qu(t, e, n) {
  return new g0(t, e, n).calc();
}
function Wu(t, e, n) {
  return new g0(t, e, n).calcSync();
}
function x0(t, e, n) {
  const r = t instanceof gn, s = r ? t : gn.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Tt(e),
    P: Do(n)
  };
}
function y0(t, e, n, r) {
  const s = q.BASE.multiplyAndAddUnsafe(e, Ve(n), I(-r, J.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function w0(t, e, n) {
  try {
    const { r, s, m: o, P: i } = x0(t, e, n), c = Gr(await it.taggedHash($e.challenge, pn(r), i.toRawX(), o));
    return y0(r, i, s, c);
  } catch {
    return !1;
  }
}
function m0(t, e, n) {
  try {
    const { r, s, m: o, P: i } = x0(t, e, n), c = Gr(it.taggedHashSync($e.challenge, pn(r), i.toRawX(), o));
    return y0(r, i, s, c);
  } catch (r) {
    if (r instanceof No)
      throw r;
    return !1;
  }
}
const Xu = {
  Signature: gn,
  getPublicKey: ju,
  sign: qu,
  verify: w0,
  signSync: Wu,
  verifySync: m0
};
q.BASE._setWindowSize(8);
const xt = {
  node: i0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, $e = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, gr = {}, it = {
  bytesToHex: dn,
  hexToBytes: Ue,
  concatBytes: _e,
  mod: I,
  invert: Bn,
  isValidPrivateKey(t) {
    try {
      return Ve(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: pn,
  _normalizePrivateKey: Ve,
  hashToPrivateKey: (t) => {
    t = Tt(t);
    const e = Ge + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = I(wt(t), J.n - et) + et;
    return pn(n);
  },
  randomBytes: (t = 32) => {
    if (xt.web)
      return xt.web.getRandomValues(new Uint8Array(t));
    if (xt.node) {
      const { randomBytes: e } = xt.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => it.hashToPrivateKey(it.randomBytes(Ge + 8)),
  precompute(t = 8, e = q.BASE) {
    const n = e === q.BASE ? e : new q(e.x, e.y);
    return n._setWindowSize(t), n.multiply(Nn), n;
  },
  sha256: async (...t) => {
    if (xt.web) {
      const e = await xt.web.subtle.digest("SHA-256", _e(...t));
      return new Uint8Array(e);
    } else if (xt.node) {
      const { createHash: e } = xt.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (xt.web) {
      const n = await xt.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = _e(...e), s = await xt.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (xt.node) {
      const { createHmac: n } = xt.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = gr[t];
    if (n === void 0) {
      const r = await it.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = _e(r, r), gr[t] = n;
    }
    return it.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof ln != "function")
      throw new No("sha256Sync is undefined, you need to set it");
    let n = gr[t];
    if (n === void 0) {
      const r = ln(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = _e(r, r), gr[t] = n;
    }
    return ln(n, ...e);
  },
  _JacobianPoint: X
};
Object.defineProperties(it, {
  sha256Sync: {
    configurable: !1,
    get() {
      return ln;
    },
    set(t) {
      ln || (ln = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return kn;
    },
    set(t) {
      kn || (kn = t);
    }
  }
});
const Yu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: J,
  Point: q,
  Signature: Xt,
  getPublicKey: To,
  getSharedSecret: Fo,
  recoverPublicKey: Ru,
  schnorr: Xu,
  sign: Vu,
  signSync: b0,
  utils: it,
  verify: zu
}, Symbol.toStringTag, { value: "Module" }));
var ut = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ju(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function zn(t) {
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
var vn = {}, Mo = {};
const sn = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function S0(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function eo(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Ce(t, ...e) {
  if (!S0(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function E0(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  eo(t.outputLen), eo(t.blockLen);
}
function Mn(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function A0(t, e) {
  Ce(t);
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
function Rn(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function Nr(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Bt(t, e) {
  return t << 32 - e | t >>> e;
}
function td(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Ro = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Go(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const B0 = Ro ? (t) => t : (t) => Go(t), ed = B0;
function v0(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Go(t[e]);
  return t;
}
const nd = Ro ? (t) => t : v0, $0 = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", rd = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function sd(t) {
  if (Ce(t), $0)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += rd[t[n]];
  return e;
}
const jt = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function cc(t) {
  if (t >= jt._0 && t <= jt._9)
    return t - jt._0;
  if (t >= jt.A && t <= jt.F)
    return t - (jt.A - 10);
  if (t >= jt.a && t <= jt.f)
    return t - (jt.a - 10);
}
function od(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if ($0)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, o = 0; s < n; s++, o += 2) {
    const i = cc(t.charCodeAt(o)), c = cc(t.charCodeAt(o + 1));
    if (i === void 0 || c === void 0) {
      const f = t[o] + t[o + 1];
      throw new Error('hex string expected, got non-hex character "' + f + '" at index ' + o);
    }
    r[s] = i * 16 + c;
  }
  return r;
}
const _0 = async () => {
};
async function id(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const o = Date.now() - r;
    o >= 0 && o < e || (await _0(), r += o);
  }
}
function Vo(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function cd(t) {
  return new TextDecoder().decode(t);
}
function $n(t) {
  return typeof t == "string" && (t = Vo(t)), Ce(t), t;
}
function ad(t) {
  return typeof t == "string" && (t = Vo(t)), Ce(t), t;
}
function fd(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    Ce(s), e += s.length;
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
let Ko = class {
};
function ss(t) {
  const e = (r) => t().update($n(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function H0(t) {
  const e = (r, s) => t(s).update($n(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function L0(t) {
  const e = (r, s) => t(s).update($n(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const ld = ss, ud = H0, dd = L0;
function pd(t = 32) {
  if (sn && typeof sn.getRandomValues == "function")
    return sn.getRandomValues(new Uint8Array(t));
  if (sn && typeof sn.randomBytes == "function")
    return Uint8Array.from(sn.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const bd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Ko,
  abytes: Ce,
  aexists: Mn,
  ahash: E0,
  anumber: eo,
  aoutput: A0,
  asyncLoop: id,
  byteSwap: Go,
  byteSwap32: v0,
  byteSwapIfBE: ed,
  bytesToHex: sd,
  bytesToUtf8: cd,
  checkOpts: hd,
  clean: Rn,
  concatBytes: fd,
  createHasher: ss,
  createOptHasher: H0,
  createView: Nr,
  createXOFer: L0,
  hexToBytes: od,
  isBytes: S0,
  isLE: Ro,
  kdfInputToBytes: ad,
  nextTick: _0,
  randomBytes: pd,
  rotl: td,
  rotr: Bt,
  swap32IfBE: nd,
  swap8IfBE: B0,
  toBytes: $n,
  u32: Qu,
  u8: Zu,
  utf8ToBytes: Vo,
  wrapConstructor: ld,
  wrapConstructorWithOpts: ud,
  wrapXOFConstructorWithOpts: dd
}, Symbol.toStringTag, { value: "Module" })), jn = /* @__PURE__ */ zn(bd);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = jn;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(i, c) {
    if (!i.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    i.length % 2 !== 0 && (i = `0${i}`), i = i.toLowerCase();
    let f = [], u = 0;
    for (let d = i.length - 1; d >= 0; d--)
      if (u < 4) {
        const g = n.indexOf(i[d]) >> u;
        let y = 0;
        d !== 0 && (y = n.indexOf(i[d - 1]));
        const E = 1 + u, _ = y % (1 << E) << 5 - E, L = t.c32[g + _];
        u = E, f.unshift(L);
      } else
        u = 0;
    let l = 0;
    for (let d = 0; d < f.length && f[d] === "0"; d++)
      l++;
    f = f.slice(l);
    const a = new TextDecoder().decode((0, e.hexToBytes)(i)).match(/^\u0000*/), p = a ? a[0].length : 0;
    for (let d = 0; d < p; d++)
      f.unshift(t.c32[0]);
    if (c) {
      const d = c - f.length;
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
  function o(i, c) {
    if (i = s(i), !i.match(`^[${t.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const f = i.match(`^${t.c32[0]}*`), u = f ? f[0].length : 0;
    let l = [], a = 0, p = 0;
    for (let y = i.length - 1; y >= 0; y--) {
      p === 4 && (l.unshift(n[a]), p = 0, a = 0);
      const _ = (t.c32.indexOf(i[y]) << p) + a, L = n[_ % 16];
      if (p += 1, a = _ >> 4, a > 1 << p)
        throw new Error("Panic error in decoding.");
      l.unshift(L);
    }
    l.unshift(n[a]), l.length % 2 === 1 && l.unshift("0");
    let d = 0;
    for (let y = 0; y < l.length && l[y] === "0"; y++)
      d++;
    l = l.slice(d - d % 2);
    let g = l.join("");
    for (let y = 0; y < u; y++)
      g = `00${g}`;
    if (c) {
      const y = c * 2 - g.length;
      for (let E = 0; E < y; E += 2)
        g = `00${g}`;
    }
    return g;
  }
  t.c32decode = o;
})(Mo);
var Ke = {};
function gd(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, i, r), t.setUint32(e + u, c, r);
}
function xd(t, e, n) {
  return t & e ^ ~t & n;
}
function yd(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class wd extends Ko {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = Nr(this.buffer);
  }
  update(e) {
    Mn(this), e = $n(e), Ce(e);
    const { view: n, buffer: r, blockLen: s } = this, o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const f = Nr(e);
        for (; s <= o - i; i += s)
          this.process(f, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Mn(this), A0(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, Rn(this.buffer.subarray(i)), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let a = i; a < s; a++)
      n[a] = 0;
    gd(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = Nr(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = f / 4, l = this.get();
    if (u > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let a = 0; a < u; a++)
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
const oe = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ie = /* @__PURE__ */ Uint32Array.from([
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
]), ce = /* @__PURE__ */ new Uint32Array(64);
let zo = class extends wd {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = oe[0] | 0, this.B = oe[1] | 0, this.C = oe[2] | 0, this.D = oe[3] | 0, this.E = oe[4] | 0, this.F = oe[5] | 0, this.G = oe[6] | 0, this.H = oe[7] | 0;
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
      const p = ce[a - 15], d = ce[a - 2], g = Bt(p, 7) ^ Bt(p, 18) ^ p >>> 3, y = Bt(d, 17) ^ Bt(d, 19) ^ d >>> 10;
      ce[a] = y + ce[a - 7] + g + ce[a - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: f, G: u, H: l } = this;
    for (let a = 0; a < 64; a++) {
      const p = Bt(c, 6) ^ Bt(c, 11) ^ Bt(c, 25), d = l + p + xd(c, f, u) + md[a] + ce[a] | 0, y = (Bt(r, 2) ^ Bt(r, 13) ^ Bt(r, 22)) + yd(r, s, o) | 0;
      l = u, u = f, f = c, c = i + d | 0, i = o, o = s, s = r, r = d + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, l = l + this.H | 0, this.set(r, s, o, i, c, f, u, l);
  }
  roundClean() {
    Rn(ce);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Rn(this.buffer);
  }
}, I0 = class extends zo {
  constructor() {
    super(28), this.A = ie[0] | 0, this.B = ie[1] | 0, this.C = ie[2] | 0, this.D = ie[3] | 0, this.E = ie[4] | 0, this.F = ie[5] | 0, this.G = ie[6] | 0, this.H = ie[7] | 0;
  }
};
const Sd = /* @__PURE__ */ ss(() => new zo()), Ed = /* @__PURE__ */ ss(() => new I0()), Ad = zo, Bd = Sd, vd = I0, $d = Ed, _d = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: vd,
  SHA256: Ad,
  sha224: $d,
  sha256: Bd
}, Symbol.toStringTag, { value: "Module" })), os = /* @__PURE__ */ zn(_d);
Object.defineProperty(Ke, "__esModule", { value: !0 });
Ke.c32checkDecode = Ke.c32checkEncode = void 0;
const ac = os, fc = jn, Dn = Mo;
function U0(t) {
  const e = (0, ac.sha256)((0, ac.sha256)((0, fc.hexToBytes)(t)));
  return (0, fc.bytesToHex)(e.slice(0, 4));
}
function Hd(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = U0(`${n}${e}`), s = (0, Dn.c32encode)(`${e}${r}`);
  return `${Dn.c32[t]}${s}`;
}
Ke.c32checkEncode = Hd;
function Ld(t) {
  t = (0, Dn.c32normalize)(t);
  const e = (0, Dn.c32decode)(t.slice(1)), n = t[0], r = Dn.c32.indexOf(n), s = e.slice(-8);
  let o = r.toString(16);
  if (o.length === 1 && (o = `0${o}`), U0(`${o}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Ke.c32checkDecode = Ld;
var O0 = {}, xn = {};
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
  var i = t.length, c = t.charAt(0), f = Math.log(i) / Math.log(256), u = Math.log(256) / Math.log(i);
  function l(d) {
    if (d instanceof Uint8Array || (ArrayBuffer.isView(d) ? d = new Uint8Array(d.buffer, d.byteOffset, d.byteLength) : Array.isArray(d) && (d = Uint8Array.from(d))), !(d instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (d.length === 0)
      return "";
    for (var g = 0, y = 0, E = 0, _ = d.length; E !== _ && d[E] === 0; )
      E++, g++;
    for (var L = (_ - E) * u + 1 >>> 0, x = new Uint8Array(L); E !== _; ) {
      for (var v = d[E], S = 0, P = L - 1; (v !== 0 || S < y) && P !== -1; P--, S++)
        v += 256 * x[P] >>> 0, x[P] = v % i >>> 0, v = v / i >>> 0;
      if (v !== 0)
        throw new Error("Non-zero carry");
      y = S, E++;
    }
    for (var F = L - y; F !== L && x[F] === 0; )
      F++;
    for (var O = c.repeat(g); F < L; ++F)
      O += t.charAt(x[F]);
    return O;
  }
  function a(d) {
    if (typeof d != "string")
      throw new TypeError("Expected String");
    if (d.length === 0)
      return new Uint8Array();
    for (var g = 0, y = 0, E = 0; d[g] === c; )
      y++, g++;
    for (var _ = (d.length - g) * f + 1 >>> 0, L = new Uint8Array(_); d[g]; ) {
      var x = d.charCodeAt(g);
      if (x > 255)
        return;
      var v = e[x];
      if (v === 255)
        return;
      for (var S = 0, P = _ - 1; (v !== 0 || S < E) && P !== -1; P--, S++)
        v += i * L[P] >>> 0, L[P] = v % 256 >>> 0, v = v / 256 >>> 0;
      if (v !== 0)
        throw new Error("Non-zero carry");
      E = S, g++;
    }
    for (var F = _ - E; F !== _ && L[F] === 0; )
      F++;
    for (var O = new Uint8Array(y + (_ - F)), C = y; F !== _; )
      O[C++] = L[F++];
    return O;
  }
  function p(d) {
    var g = a(d);
    if (g)
      return g;
    throw new Error("Non-base" + i + " character");
  }
  return {
    encode: l,
    decodeUnsafe: a,
    decode: p
  };
}
var C0 = Id;
Object.defineProperty(xn, "__esModule", { value: !0 });
xn.decode = xn.encode = void 0;
const Vr = os, hc = jn, P0 = C0, N0 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function Ud(t, e = "00") {
  const n = typeof t == "string" ? (0, hc.hexToBytes)(t) : t, r = typeof e == "string" ? (0, hc.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Vr.sha256)((0, Vr.sha256)(new Uint8Array([...r, ...n])));
  return P0(N0).encode([...r, ...n, ...s.slice(0, 4)]);
}
xn.encode = Ud;
function Od(t) {
  const e = P0(N0).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Vr.sha256)((0, Vr.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((o, i) => {
    if (o !== s[i])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
xn.decode = Od;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Ke, n = xn, r = jn;
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
    const p = n.decode(l), d = (0, r.bytesToHex)(p.data), g = parseInt((0, r.bytesToHex)(p.prefix), 16);
    let y;
    return a < 0 ? (y = g, s[g] !== void 0 && (y = s[g])) : y = a, i(y, d);
  }
  t.b58ToC32 = f;
  function u(l, a = -1) {
    const p = c(l), d = p[0], g = p[1];
    let y;
    a < 0 ? (y = d, o[d] !== void 0 && (y = o[d])) : y = a;
    let E = y.toString(16);
    return E.length === 1 && (E = `0${E}`), n.encode(g, E);
  }
  t.c32ToB58 = u;
})(O0);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Mo;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Ke;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = O0;
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
})(vn);
var Kr = { exports: {} };
Kr.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, o = "[object Arguments]", i = "[object Array]", c = "[object Boolean]", f = "[object Date]", u = "[object Error]", l = "[object Function]", a = "[object GeneratorFunction]", p = "[object Map]", d = "[object Number]", g = "[object Object]", y = "[object Promise]", E = "[object RegExp]", _ = "[object Set]", L = "[object String]", x = "[object Symbol]", v = "[object WeakMap]", S = "[object ArrayBuffer]", P = "[object DataView]", F = "[object Float32Array]", O = "[object Float64Array]", C = "[object Int8Array]", b = "[object Int16Array]", A = "[object Int32Array]", H = "[object Uint8Array]", D = "[object Uint8ClampedArray]", z = "[object Uint16Array]", k = "[object Uint32Array]", Gt = /[\\^$.*+?()[\]{}|]/g, Qt = /\w*$/, Pe = /^\[object .+?Constructor\]$/, nt = /^(?:0|[1-9]\d*)$/, T = {};
  T[o] = T[i] = T[S] = T[P] = T[c] = T[f] = T[F] = T[O] = T[C] = T[b] = T[A] = T[p] = T[d] = T[g] = T[E] = T[_] = T[L] = T[x] = T[H] = T[D] = T[z] = T[k] = !0, T[u] = T[l] = T[v] = !1;
  var Jn = typeof ut == "object" && ut && ut.Object === Object && ut, Zn = typeof self == "object" && self && self.Object === Object && self, rt = Jn || Zn || Function("return this")(), Qn = e && !e.nodeType && e, In = Qn && !0 && t && !t.nodeType && t, Un = In && In.exports === Qn;
  function ys(h, w) {
    return h.set(w[0], w[1]), h;
  }
  function tr(h, w) {
    return h.add(w), h;
  }
  function er(h, w) {
    for (var B = -1, N = h ? h.length : 0; ++B < N && w(h[B], B, h) !== !1; )
      ;
    return h;
  }
  function ws(h, w) {
    for (var B = -1, N = w.length, ht = h.length; ++B < N; )
      h[ht + B] = w[B];
    return h;
  }
  function nr(h, w, B, N) {
    for (var ht = -1, pt = h ? h.length : 0; ++ht < pt; )
      B = w(B, h[ht], ht, h);
    return B;
  }
  function U(h, w) {
    for (var B = -1, N = Array(h); ++B < h; )
      N[B] = w(B);
    return N;
  }
  function W(h, w) {
    return h == null ? void 0 : h[w];
  }
  function Z(h) {
    var w = !1;
    if (h != null && typeof h.toString != "function")
      try {
        w = !!(h + "");
      } catch {
      }
    return w;
  }
  function Q(h) {
    var w = -1, B = Array(h.size);
    return h.forEach(function(N, ht) {
      B[++w] = [ht, N];
    }), B;
  }
  function ft(h, w) {
    return function(B) {
      return h(w(B));
    };
  }
  function st(h) {
    var w = -1, B = Array(h.size);
    return h.forEach(function(N) {
      B[++w] = N;
    }), B;
  }
  var Vt = Array.prototype, mh = Function.prototype, rr = Object.prototype, ms = rt["__core-js_shared__"], mi = function() {
    var h = /[^.]+$/.exec(ms && ms.keys && ms.keys.IE_PROTO || "");
    return h ? "Symbol(src)_1." + h : "";
  }(), Si = mh.toString, te = rr.hasOwnProperty, sr = rr.toString, Sh = RegExp(
    "^" + Si.call(te).replace(Gt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Ei = Un ? rt.Buffer : void 0, Ai = rt.Symbol, Bi = rt.Uint8Array, Eh = ft(Object.getPrototypeOf, Object), Ah = Object.create, Bh = rr.propertyIsEnumerable, vh = Vt.splice, vi = Object.getOwnPropertySymbols, $h = Ei ? Ei.isBuffer : void 0, _h = ft(Object.keys, Object), Ss = nn(rt, "DataView"), On = nn(rt, "Map"), Es = nn(rt, "Promise"), As = nn(rt, "Set"), Bs = nn(rt, "WeakMap"), Cn = nn(Object, "create"), Hh = De(Ss), Lh = De(On), Ih = De(Es), Uh = De(As), Oh = De(Bs), $i = Ai ? Ai.prototype : void 0, _i = $i ? $i.valueOf : void 0;
  function Ne(h) {
    var w = -1, B = h ? h.length : 0;
    for (this.clear(); ++w < B; ) {
      var N = h[w];
      this.set(N[0], N[1]);
    }
  }
  function Ch() {
    this.__data__ = Cn ? Cn(null) : {};
  }
  function Ph(h) {
    return this.has(h) && delete this.__data__[h];
  }
  function Nh(h) {
    var w = this.__data__;
    if (Cn) {
      var B = w[h];
      return B === r ? void 0 : B;
    }
    return te.call(w, h) ? w[h] : void 0;
  }
  function kh(h) {
    var w = this.__data__;
    return Cn ? w[h] !== void 0 : te.call(w, h);
  }
  function Dh(h, w) {
    var B = this.__data__;
    return B[h] = Cn && w === void 0 ? r : w, this;
  }
  Ne.prototype.clear = Ch, Ne.prototype.delete = Ph, Ne.prototype.get = Nh, Ne.prototype.has = kh, Ne.prototype.set = Dh;
  function Kt(h) {
    var w = -1, B = h ? h.length : 0;
    for (this.clear(); ++w < B; ) {
      var N = h[w];
      this.set(N[0], N[1]);
    }
  }
  function Th() {
    this.__data__ = [];
  }
  function Fh(h) {
    var w = this.__data__, B = or(w, h);
    if (B < 0)
      return !1;
    var N = w.length - 1;
    return B == N ? w.pop() : vh.call(w, B, 1), !0;
  }
  function Mh(h) {
    var w = this.__data__, B = or(w, h);
    return B < 0 ? void 0 : w[B][1];
  }
  function Rh(h) {
    return or(this.__data__, h) > -1;
  }
  function Gh(h, w) {
    var B = this.__data__, N = or(B, h);
    return N < 0 ? B.push([h, w]) : B[N][1] = w, this;
  }
  Kt.prototype.clear = Th, Kt.prototype.delete = Fh, Kt.prototype.get = Mh, Kt.prototype.has = Rh, Kt.prototype.set = Gh;
  function tn(h) {
    var w = -1, B = h ? h.length : 0;
    for (this.clear(); ++w < B; ) {
      var N = h[w];
      this.set(N[0], N[1]);
    }
  }
  function Vh() {
    this.__data__ = {
      hash: new Ne(),
      map: new (On || Kt)(),
      string: new Ne()
    };
  }
  function Kh(h) {
    return ir(this, h).delete(h);
  }
  function zh(h) {
    return ir(this, h).get(h);
  }
  function jh(h) {
    return ir(this, h).has(h);
  }
  function qh(h, w) {
    return ir(this, h).set(h, w), this;
  }
  tn.prototype.clear = Vh, tn.prototype.delete = Kh, tn.prototype.get = zh, tn.prototype.has = jh, tn.prototype.set = qh;
  function en(h) {
    this.__data__ = new Kt(h);
  }
  function Wh() {
    this.__data__ = new Kt();
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
    var B = this.__data__;
    if (B instanceof Kt) {
      var N = B.__data__;
      if (!On || N.length < n - 1)
        return N.push([h, w]), this;
      B = this.__data__ = new tn(N);
    }
    return B.set(h, w), this;
  }
  en.prototype.clear = Wh, en.prototype.delete = Xh, en.prototype.get = Yh, en.prototype.has = Jh, en.prototype.set = Zh;
  function Qh(h, w) {
    var B = _s(h) || Al(h) ? U(h.length, String) : [], N = B.length, ht = !!N;
    for (var pt in h)
      te.call(h, pt) && !(ht && (pt == "length" || wl(pt, N))) && B.push(pt);
    return B;
  }
  function Hi(h, w, B) {
    var N = h[w];
    (!(te.call(h, w) && Oi(N, B)) || B === void 0 && !(w in h)) && (h[w] = B);
  }
  function or(h, w) {
    for (var B = h.length; B--; )
      if (Oi(h[B][0], w))
        return B;
    return -1;
  }
  function tl(h, w) {
    return h && Li(w, Hs(w), h);
  }
  function vs(h, w, B, N, ht, pt, zt) {
    var bt;
    if (N && (bt = pt ? N(h, ht, pt, zt) : N(h)), bt !== void 0)
      return bt;
    if (!cr(h))
      return h;
    var Ni = _s(h);
    if (Ni) {
      if (bt = gl(h), !w)
        return dl(h, bt);
    } else {
      var rn = ke(h), ki = rn == l || rn == a;
      if (vl(h))
        return il(h, w);
      if (rn == g || rn == o || ki && !pt) {
        if (Z(h))
          return pt ? h : {};
        if (bt = xl(ki ? {} : h), !w)
          return pl(h, tl(bt, h));
      } else {
        if (!T[rn])
          return pt ? h : {};
        bt = yl(h, rn, vs, w);
      }
    }
    zt || (zt = new en());
    var Di = zt.get(h);
    if (Di)
      return Di;
    if (zt.set(h, bt), !Ni)
      var Ti = B ? bl(h) : Hs(h);
    return er(Ti || h, function(Ls, ar) {
      Ti && (ar = Ls, Ls = h[ar]), Hi(bt, ar, vs(Ls, w, B, N, ar, h, zt));
    }), bt;
  }
  function el(h) {
    return cr(h) ? Ah(h) : {};
  }
  function nl(h, w, B) {
    var N = w(h);
    return _s(h) ? N : ws(N, B(h));
  }
  function rl(h) {
    return sr.call(h);
  }
  function sl(h) {
    if (!cr(h) || Sl(h))
      return !1;
    var w = Pi(h) || Z(h) ? Sh : Pe;
    return w.test(De(h));
  }
  function ol(h) {
    if (!Ui(h))
      return _h(h);
    var w = [];
    for (var B in Object(h))
      te.call(h, B) && B != "constructor" && w.push(B);
    return w;
  }
  function il(h, w) {
    if (w)
      return h.slice();
    var B = new h.constructor(h.length);
    return h.copy(B), B;
  }
  function $s(h) {
    var w = new h.constructor(h.byteLength);
    return new Bi(w).set(new Bi(h)), w;
  }
  function cl(h, w) {
    var B = w ? $s(h.buffer) : h.buffer;
    return new h.constructor(B, h.byteOffset, h.byteLength);
  }
  function al(h, w, B) {
    var N = w ? B(Q(h), !0) : Q(h);
    return nr(N, ys, new h.constructor());
  }
  function fl(h) {
    var w = new h.constructor(h.source, Qt.exec(h));
    return w.lastIndex = h.lastIndex, w;
  }
  function hl(h, w, B) {
    var N = w ? B(st(h), !0) : st(h);
    return nr(N, tr, new h.constructor());
  }
  function ll(h) {
    return _i ? Object(_i.call(h)) : {};
  }
  function ul(h, w) {
    var B = w ? $s(h.buffer) : h.buffer;
    return new h.constructor(B, h.byteOffset, h.length);
  }
  function dl(h, w) {
    var B = -1, N = h.length;
    for (w || (w = Array(N)); ++B < N; )
      w[B] = h[B];
    return w;
  }
  function Li(h, w, B, N) {
    B || (B = {});
    for (var ht = -1, pt = w.length; ++ht < pt; ) {
      var zt = w[ht], bt = void 0;
      Hi(B, zt, bt === void 0 ? h[zt] : bt);
    }
    return B;
  }
  function pl(h, w) {
    return Li(h, Ii(h), w);
  }
  function bl(h) {
    return nl(h, Hs, Ii);
  }
  function ir(h, w) {
    var B = h.__data__;
    return ml(w) ? B[typeof w == "string" ? "string" : "hash"] : B.map;
  }
  function nn(h, w) {
    var B = W(h, w);
    return sl(B) ? B : void 0;
  }
  var Ii = vi ? ft(vi, Object) : Hl, ke = rl;
  (Ss && ke(new Ss(new ArrayBuffer(1))) != P || On && ke(new On()) != p || Es && ke(Es.resolve()) != y || As && ke(new As()) != _ || Bs && ke(new Bs()) != v) && (ke = function(h) {
    var w = sr.call(h), B = w == g ? h.constructor : void 0, N = B ? De(B) : void 0;
    if (N)
      switch (N) {
        case Hh:
          return P;
        case Lh:
          return p;
        case Ih:
          return y;
        case Uh:
          return _;
        case Oh:
          return v;
      }
    return w;
  });
  function gl(h) {
    var w = h.length, B = h.constructor(w);
    return w && typeof h[0] == "string" && te.call(h, "index") && (B.index = h.index, B.input = h.input), B;
  }
  function xl(h) {
    return typeof h.constructor == "function" && !Ui(h) ? el(Eh(h)) : {};
  }
  function yl(h, w, B, N) {
    var ht = h.constructor;
    switch (w) {
      case S:
        return $s(h);
      case c:
      case f:
        return new ht(+h);
      case P:
        return cl(h, N);
      case F:
      case O:
      case C:
      case b:
      case A:
      case H:
      case D:
      case z:
      case k:
        return ul(h, N);
      case p:
        return al(h, N, B);
      case d:
      case L:
        return new ht(h);
      case E:
        return fl(h);
      case _:
        return hl(h, N, B);
      case x:
        return ll(h);
    }
  }
  function wl(h, w) {
    return w = w ?? s, !!w && (typeof h == "number" || nt.test(h)) && h > -1 && h % 1 == 0 && h < w;
  }
  function ml(h) {
    var w = typeof h;
    return w == "string" || w == "number" || w == "symbol" || w == "boolean" ? h !== "__proto__" : h === null;
  }
  function Sl(h) {
    return !!mi && mi in h;
  }
  function Ui(h) {
    var w = h && h.constructor, B = typeof w == "function" && w.prototype || rr;
    return h === B;
  }
  function De(h) {
    if (h != null) {
      try {
        return Si.call(h);
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
    return vs(h, !0, !0);
  }
  function Oi(h, w) {
    return h === w || h !== h && w !== w;
  }
  function Al(h) {
    return Bl(h) && te.call(h, "callee") && (!Bh.call(h, "callee") || sr.call(h) == o);
  }
  var _s = Array.isArray;
  function Ci(h) {
    return h != null && $l(h.length) && !Pi(h);
  }
  function Bl(h) {
    return _l(h) && Ci(h);
  }
  var vl = $h || Ll;
  function Pi(h) {
    var w = cr(h) ? sr.call(h) : "";
    return w == l || w == a;
  }
  function $l(h) {
    return typeof h == "number" && h > -1 && h % 1 == 0 && h <= s;
  }
  function cr(h) {
    var w = typeof h;
    return !!h && (w == "object" || w == "function");
  }
  function _l(h) {
    return !!h && typeof h == "object";
  }
  function Hs(h) {
    return Ci(h) ? Qh(h) : ol(h);
  }
  function Hl() {
    return [];
  }
  function Ll() {
    return !1;
  }
  t.exports = El;
})(Kr, Kr.exports);
Kr.exports;
function no(t) {
  return vn.c32address(t.version, t.hash160);
}
function jo(t, e, n) {
  const r = e || 1, s = n || Rl;
  if (f1(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Fn.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function qo(t) {
  const e = vn.c32addressDecode(t);
  return {
    type: Fn.Address,
    version: e[0],
    hash160: e[1]
  };
}
var $;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})($ || ($ = {}));
function Cd(t) {
  if (t.type === $.PrincipalStandard)
    return no(t.address);
  if (t.type === $.PrincipalContract)
    return `${no(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function Pd(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Dd(e, n);
  } else
    return Nd(t);
}
function Nd(t) {
  const e = qo(t);
  return { type: $.PrincipalStandard, address: e };
}
function kd(t) {
  return { type: $.PrincipalStandard, address: t };
}
function Dd(t, e) {
  const n = qo(t), r = jo(e);
  return k0(n, r);
}
function k0(t, e) {
  if (Kn(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: $.PrincipalContract, address: t, contractName: e };
}
function Cs(t, e = !1) {
  switch (t.type) {
    case $.BoolTrue:
      return !0;
    case $.BoolFalse:
      return !1;
    case $.Int:
    case $.UInt:
      return e ? t.value.toString() : t.value;
    case $.Buffer:
      return `0x${Yt(t.buffer)}`;
    case $.OptionalNone:
      return null;
    case $.OptionalSome:
      return an(t.value);
    case $.ResponseErr:
      return an(t.value);
    case $.ResponseOk:
      return an(t.value);
    case $.PrincipalStandard:
    case $.PrincipalContract:
      return Cd(t);
    case $.List:
      return t.list.map((r) => an(r));
    case $.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = an(t.data[r]);
      }), n;
    case $.StringASCII:
      return t.data;
    case $.StringUTF8:
      return t.data;
  }
}
function an(t) {
  switch (t.type) {
    case $.ResponseErr:
      return { type: He(t), value: Cs(t, !0), success: !1 };
    case $.ResponseOk:
      return { type: He(t), value: Cs(t, !0), success: !0 };
    default:
      return { type: He(t), value: Cs(t, !0) };
  }
}
function He(t) {
  switch (t.type) {
    case $.BoolTrue:
    case $.BoolFalse:
      return "bool";
    case $.Int:
      return "int";
    case $.UInt:
      return "uint";
    case $.Buffer:
      return `(buff ${t.buffer.length})`;
    case $.OptionalNone:
      return "(optional none)";
    case $.OptionalSome:
      return `(optional ${He(t.value)})`;
    case $.ResponseErr:
      return `(response UnknownType ${He(t.value)})`;
    case $.ResponseOk:
      return `(response ${He(t.value)} UnknownType)`;
    case $.PrincipalStandard:
    case $.PrincipalContract:
      return "principal";
    case $.List:
      return `(list ${t.list.length} ${t.list.length ? He(t.list[0]) : "UnknownType"})`;
    case $.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${He(t.data[e])})`).join(" ")})`;
    case $.StringASCII:
      return `(string-ascii ${Za(t.data).length})`;
    case $.StringUTF8:
      return `(string-utf8 ${Kn(t.data).length})`;
  }
}
const Td = () => ({ type: $.BoolTrue }), Fd = () => ({ type: $.BoolFalse }), lc = BigInt("0xffffffffffffffffffffffffffffffff"), Md = BigInt(0), uc = BigInt("0x7fffffffffffffffffffffffffffffff"), dc = BigInt("-170141183460469231731687303715884105728"), Rd = (t) => {
  const e = Lo(t, !0);
  if (e > uc)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${uc}`);
  if (e < dc)
    throw new RangeError(`Cannot construct clarity integer form value less than ${dc}`);
  return { type: $.Int, value: e };
}, D0 = (t) => {
  const e = Lo(t, !1);
  if (e < Md)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > lc)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${lc}`);
  return { type: $.UInt, value: e };
}, Gd = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: $.Buffer, buffer: t };
};
function Vd() {
  return { type: $.OptionalNone };
}
function Kd(t) {
  return { type: $.OptionalSome, value: t };
}
function zd(t) {
  return { type: $.ResponseErr, value: t };
}
function jd(t) {
  return { type: $.ResponseOk, value: t };
}
function qd(t) {
  return { type: $.List, list: t };
}
function T0(t) {
  for (const e in t)
    if (!h1(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: $.Tuple, data: t };
}
const kr = (t) => ({ type: $.StringASCII, data: t }), Wd = (t) => ({ type: $.StringUTF8, data: t });
let F0 = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Xd = class extends F0 {
  constructor(e) {
    super(e);
  }
};
class Ps extends F0 {
  constructor(e) {
    super(e);
  }
}
function M0(t) {
  const e = [];
  return e.push(un(Io(t.version, 1))), e.push(un(t.hash160)), An(e);
}
function pc(t) {
  const e = Xa(Yt(t.readBytes(1))), n = Yt(t.readBytes(20));
  return { type: Fn.Address, version: e, hash160: n };
}
function R0(t) {
  const e = [], n = Kn(t.content), r = n.byteLength;
  return e.push(un(Io(r, t.lengthPrefixBytes))), e.push(n), An(e);
}
function bc(t, e, n) {
  e = e || 1;
  const r = Xa(Yt(t.readBytes(e))), s = Ja(t.readBytes(r));
  return jo(s, e, 128);
}
function Ft(t, e) {
  return An([t, e]);
}
function Yd(t) {
  return new Uint8Array([t.type]);
}
function Jd(t) {
  return t.type === $.OptionalNone ? new Uint8Array([t.type]) : Ft(t.type, qn(t.value));
}
function Zd(t) {
  const e = new Uint8Array(4);
  return ns(e, t.buffer.length, 0), Ft(t.type, Uo(e, t.buffer));
}
function Qd(t) {
  const e = Ya(Ol(t.value, BigInt(Gl)), Qa);
  return Ft(t.type, e);
}
function t1(t) {
  const e = Ya(t.value, Qa);
  return Ft(t.type, e);
}
function e1(t) {
  return Ft(t.type, M0(t.address));
}
function n1(t) {
  return Ft(t.type, Uo(M0(t.address), R0(t.contractName)));
}
function r1(t) {
  return Ft(t.type, qn(t.value));
}
function s1(t) {
  const e = [], n = new Uint8Array(4);
  ns(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = qn(r);
    e.push(s);
  }
  return Ft(t.type, An(e));
}
function o1(t) {
  const e = [], n = new Uint8Array(4);
  ns(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = jo(s);
    e.push(R0(o));
    const i = qn(t.data[s]);
    e.push(i);
  }
  return Ft(t.type, An(e));
}
function G0(t, e) {
  const n = [], r = e == "ascii" ? Za(t.data) : Kn(t.data), s = new Uint8Array(4);
  return ns(s, r.length, 0), n.push(s), n.push(r), Ft(t.type, An(n));
}
function i1(t) {
  return G0(t, "ascii");
}
function c1(t) {
  return G0(t, "utf8");
}
function qn(t) {
  switch (t.type) {
    case $.BoolTrue:
    case $.BoolFalse:
      return Yd(t);
    case $.OptionalNone:
    case $.OptionalSome:
      return Jd(t);
    case $.Buffer:
      return Zd(t);
    case $.UInt:
      return t1(t);
    case $.Int:
      return Qd(t);
    case $.PrincipalStandard:
      return e1(t);
    case $.PrincipalContract:
      return n1(t);
    case $.ResponseOk:
    case $.ResponseErr:
      return r1(t);
    case $.List:
      return s1(t);
    case $.Tuple:
      return o1(t);
    case $.StringASCII:
      return i1(t);
    case $.StringUTF8:
      return c1(t);
    default:
      throw new Xd("Unable to serialize. Invalid Clarity Value.");
  }
}
function a1(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const gc = /* @__PURE__ */ new Map();
function V0(t, e) {
  const n = gc.get(t);
  if (n !== void 0)
    return n(e);
  const r = a1(t);
  return gc.set(t, r), V0(t, e);
}
class xc {
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
    const n = this.readBytes(e).slice().reverse(), r = Yt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = Yt(n);
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
    if (V0(e, r))
      return r;
    throw n(r);
  }
}
function fn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new xc(un(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new xc(t) : e = t;
  switch (e.readUInt8Enum($, (r) => {
    throw new Ps(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case $.Int:
      return Rd(e.readBytes(16));
    case $.UInt:
      return D0(e.readBytes(16));
    case $.Buffer:
      const r = e.readUInt32BE();
      return Gd(e.readBytes(r));
    case $.BoolTrue:
      return Td();
    case $.BoolFalse:
      return Fd();
    case $.PrincipalStandard:
      const s = pc(e);
      return kd(s);
    case $.PrincipalContract:
      const o = pc(e), i = bc(e);
      return k0(o, i);
    case $.ResponseOk:
      return jd(fn(e));
    case $.ResponseErr:
      return zd(fn(e));
    case $.OptionalNone:
      return Vd();
    case $.OptionalSome:
      return Kd(fn(e));
    case $.List:
      const c = e.readUInt32BE(), f = [];
      for (let y = 0; y < c; y++)
        f.push(fn(e));
      return qd(f);
    case $.Tuple:
      const u = e.readUInt32BE(), l = {};
      for (let y = 0; y < u; y++) {
        const E = bc(e).content;
        if (E === void 0)
          throw new Ps('"content" is undefined');
        l[E] = fn(e);
      }
      return T0(l);
    case $.StringASCII:
      const a = e.readUInt32BE(), p = kl(e.readBytes(a));
      return kr(p);
    case $.StringUTF8:
      const d = e.readUInt32BE(), g = Ja(e.readBytes(d));
      return Wd(g);
    default:
      throw new Ps("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const f1 = (t, e) => t ? Kn(t).length > e : !1;
function h1(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function K0(t) {
  const e = qn(t);
  return `0x${Yt(e)}`;
}
function l1(t) {
  return fn(t);
}
const u1 = (t) => {
  try {
    return vn.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
(function() {
  (function(t) {
    (function(e) {
      var n = typeof globalThis < "u" && globalThis || typeof t < "u" && t || // eslint-disable-next-line no-undef
      typeof ut < "u" && ut || {}, r = {
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
      function c(b) {
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
            var H = b.shift();
            return { done: H === void 0, value: H };
          }
        };
        return r.iterable && (A[Symbol.iterator] = function() {
          return A;
        }), A;
      }
      function l(b) {
        this.map = {}, b instanceof l ? b.forEach(function(A, H) {
          this.append(H, A);
        }, this) : Array.isArray(b) ? b.forEach(function(A) {
          if (A.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + A.length);
          this.append(A[0], A[1]);
        }, this) : b && Object.getOwnPropertyNames(b).forEach(function(A) {
          this.append(A, b[A]);
        }, this);
      }
      l.prototype.append = function(b, A) {
        b = c(b), A = f(A);
        var H = this.map[b];
        this.map[b] = H ? H + ", " + A : A;
      }, l.prototype.delete = function(b) {
        delete this.map[c(b)];
      }, l.prototype.get = function(b) {
        return b = c(b), this.has(b) ? this.map[b] : null;
      }, l.prototype.has = function(b) {
        return this.map.hasOwnProperty(c(b));
      }, l.prototype.set = function(b, A) {
        this.map[c(b)] = f(A);
      }, l.prototype.forEach = function(b, A) {
        for (var H in this.map)
          this.map.hasOwnProperty(H) && b.call(A, this.map[H], H, this);
      }, l.prototype.keys = function() {
        var b = [];
        return this.forEach(function(A, H) {
          b.push(H);
        }), u(b);
      }, l.prototype.values = function() {
        var b = [];
        return this.forEach(function(A) {
          b.push(A);
        }), u(b);
      }, l.prototype.entries = function() {
        var b = [];
        return this.forEach(function(A, H) {
          b.push([H, A]);
        }), u(b);
      }, r.iterable && (l.prototype[Symbol.iterator] = l.prototype.entries);
      function a(b) {
        if (!b._noBody) {
          if (b.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          b.bodyUsed = !0;
        }
      }
      function p(b) {
        return new Promise(function(A, H) {
          b.onload = function() {
            A(b.result);
          }, b.onerror = function() {
            H(b.error);
          };
        });
      }
      function d(b) {
        var A = new FileReader(), H = p(A);
        return A.readAsArrayBuffer(b), H;
      }
      function g(b) {
        var A = new FileReader(), H = p(A), D = /charset=([A-Za-z0-9_-]+)/.exec(b.type), z = D ? D[1] : "utf-8";
        return A.readAsText(b, z), H;
      }
      function y(b) {
        for (var A = new Uint8Array(b), H = new Array(A.length), D = 0; D < A.length; D++)
          H[D] = String.fromCharCode(A[D]);
        return H.join("");
      }
      function E(b) {
        if (b.slice)
          return b.slice(0);
        var A = new Uint8Array(b.byteLength);
        return A.set(new Uint8Array(b)), A.buffer;
      }
      function _() {
        return this.bodyUsed = !1, this._initBody = function(b) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = b, b ? typeof b == "string" ? this._bodyText = b : r.blob && Blob.prototype.isPrototypeOf(b) ? this._bodyBlob = b : r.formData && FormData.prototype.isPrototypeOf(b) ? this._bodyFormData = b : r.searchParams && URLSearchParams.prototype.isPrototypeOf(b) ? this._bodyText = b.toString() : r.arrayBuffer && r.blob && s(b) ? (this._bodyArrayBuffer = E(b.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(b) || i(b)) ? this._bodyArrayBuffer = E(b) : this._bodyText = b = Object.prototype.toString.call(b) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof b == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(b) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var b = a(this);
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
            var b = a(this);
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
          var b = a(this);
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
      var L = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function x(b) {
        var A = b.toUpperCase();
        return L.indexOf(A) > -1 ? A : b;
      }
      function v(b, A) {
        if (!(this instanceof v))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        A = A || {};
        var H = A.body;
        if (b instanceof v) {
          if (b.bodyUsed)
            throw new TypeError("Already read");
          this.url = b.url, this.credentials = b.credentials, A.headers || (this.headers = new l(b.headers)), this.method = b.method, this.mode = b.mode, this.signal = b.signal, !H && b._bodyInit != null && (H = b._bodyInit, b.bodyUsed = !0);
        } else
          this.url = String(b);
        if (this.credentials = A.credentials || this.credentials || "same-origin", (A.headers || !this.headers) && (this.headers = new l(A.headers)), this.method = x(A.method || this.method || "GET"), this.mode = A.mode || this.mode || null, this.signal = A.signal || this.signal || function() {
          if ("AbortController" in n) {
            var k = new AbortController();
            return k.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && H)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(H), (this.method === "GET" || this.method === "HEAD") && (A.cache === "no-store" || A.cache === "no-cache")) {
          var D = /([?&])_=[^&]*/;
          if (D.test(this.url))
            this.url = this.url.replace(D, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var z = /\?/;
            this.url += (z.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      v.prototype.clone = function() {
        return new v(this, { body: this._bodyInit });
      };
      function S(b) {
        var A = new FormData();
        return b.trim().split("&").forEach(function(H) {
          if (H) {
            var D = H.split("="), z = D.shift().replace(/\+/g, " "), k = D.join("=").replace(/\+/g, " ");
            A.append(decodeURIComponent(z), decodeURIComponent(k));
          }
        }), A;
      }
      function P(b) {
        var A = new l(), H = b.replace(/\r?\n[\t ]+/g, " ");
        return H.split("\r").map(function(D) {
          return D.indexOf(`
`) === 0 ? D.substr(1, D.length) : D;
        }).forEach(function(D) {
          var z = D.split(":"), k = z.shift().trim();
          if (k) {
            var Gt = z.join(":").trim();
            try {
              A.append(k, Gt);
            } catch (Qt) {
              console.warn("Response " + Qt.message);
            }
          }
        }), A;
      }
      _.call(v.prototype);
      function F(b, A) {
        if (!(this instanceof F))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (A || (A = {}), this.type = "default", this.status = A.status === void 0 ? 200 : A.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = A.statusText === void 0 ? "" : "" + A.statusText, this.headers = new l(A.headers), this.url = A.url || "", this._initBody(b);
      }
      _.call(F.prototype), F.prototype.clone = function() {
        return new F(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new l(this.headers),
          url: this.url
        });
      }, F.error = function() {
        var b = new F(null, { status: 200, statusText: "" });
        return b.ok = !1, b.status = 0, b.type = "error", b;
      };
      var O = [301, 302, 303, 307, 308];
      F.redirect = function(b, A) {
        if (O.indexOf(A) === -1)
          throw new RangeError("Invalid status code");
        return new F(null, { status: A, headers: { location: b } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(A, H) {
          this.message = A, this.name = H;
          var D = Error(A);
          this.stack = D.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function C(b, A) {
        return new Promise(function(H, D) {
          var z = new v(b, A);
          if (z.signal && z.signal.aborted)
            return D(new e.DOMException("Aborted", "AbortError"));
          var k = new XMLHttpRequest();
          function Gt() {
            k.abort();
          }
          k.onload = function() {
            var nt = {
              statusText: k.statusText,
              headers: P(k.getAllResponseHeaders() || "")
            };
            z.url.indexOf("file://") === 0 && (k.status < 200 || k.status > 599) ? nt.status = 200 : nt.status = k.status, nt.url = "responseURL" in k ? k.responseURL : nt.headers.get("X-Request-URL");
            var T = "response" in k ? k.response : k.responseText;
            setTimeout(function() {
              H(new F(T, nt));
            }, 0);
          }, k.onerror = function() {
            setTimeout(function() {
              D(new TypeError("Network request failed"));
            }, 0);
          }, k.ontimeout = function() {
            setTimeout(function() {
              D(new TypeError("Network request timed out"));
            }, 0);
          }, k.onabort = function() {
            setTimeout(function() {
              D(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function Qt(nt) {
            try {
              return nt === "" && n.location.href ? n.location.href : nt;
            } catch {
              return nt;
            }
          }
          if (k.open(z.method, Qt(z.url), !0), z.credentials === "include" ? k.withCredentials = !0 : z.credentials === "omit" && (k.withCredentials = !1), "responseType" in k && (r.blob ? k.responseType = "blob" : r.arrayBuffer && (k.responseType = "arraybuffer")), A && typeof A.headers == "object" && !(A.headers instanceof l || n.Headers && A.headers instanceof n.Headers)) {
            var Pe = [];
            Object.getOwnPropertyNames(A.headers).forEach(function(nt) {
              Pe.push(c(nt)), k.setRequestHeader(nt, f(A.headers[nt]));
            }), z.headers.forEach(function(nt, T) {
              Pe.indexOf(T) === -1 && k.setRequestHeader(T, nt);
            });
          } else
            z.headers.forEach(function(nt, T) {
              k.setRequestHeader(T, nt);
            });
          z.signal && (z.signal.addEventListener("abort", Gt), k.onreadystatechange = function() {
            k.readyState === 4 && z.signal.removeEventListener("abort", Gt);
          }), k.send(typeof z._bodyInit > "u" ? null : z._bodyInit);
        });
      }
      return C.polyfill = !0, n.fetch || (n.fetch = C, n.Headers = l, n.Request = v, n.Response = F), e.Headers = l, e.Request = v, e.Response = F, e.fetch = C, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : ut);
})();
const d1 = "https://browser.blockstack.org/auth", p1 = {
  "@type": "Person",
  "@context": "http://schema.org"
}, z0 = ["store_write"], b1 = "blockstack-session", g1 = {
  logLevel: "debug"
}, Xe = {
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
Object.freeze(Xe);
class _n extends Error {
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
class x1 extends _n {
  constructor(e, n = "") {
    super({ code: Xe.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class yc extends _n {
  constructor(e = "") {
    super({ code: Xe.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class xr extends _n {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Xe.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class wc extends _n {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Xe.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class ro extends _n {
  constructor(e) {
    super({ code: Xe.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class j0 extends _n {
  constructor(e) {
    super({ code: Xe.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const mc = ["debug", "info", "warn", "error", "none"], so = {};
for (let t = 0; t < mc.length; t++) {
  const e = mc[t];
  so[e] = t;
}
class hn {
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
    return so[g1.logLevel] <= so[e];
  }
}
function y1() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function w1() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Ns(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function m1() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function S1() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function E1(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function Wo(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = S1(), s) {
      const o = s[t];
      if (o)
        return o;
    }
  } catch (o) {
    hn.error(`Error getting object '${t}' from global scope '${s}': ${o}`);
  }
  if (e) {
    const o = E1(s, t.toString(), n);
    throw hn.error(o), new Error(o);
  }
  if (r)
    return {};
}
function A1(t) {
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
  if (L1(t, Uint8Array))
    return BigInt(`0x${At(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function B1(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Xo(t, e = 8) {
  return (typeof t == "bigint" ? t : A1(t)).toString(16).padStart(e * 2, "0");
}
function q0(t, e = 16) {
  const n = Xo(t, e);
  return yt(n);
}
function v1(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const $1 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function At(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += $1[n];
  return e;
}
function yt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = B1(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    e[n] = o;
  }
  return e;
}
function Wn(t) {
  return new TextEncoder().encode(t);
}
function W0(t) {
  return new TextDecoder().decode(t);
}
function _1(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function H1(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Sc(t) {
  if (t.some(H1))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Jt(...t) {
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
function Hn(t) {
  return Jt(...t.map((e) => typeof e == "number" ? Sc([e]) : e instanceof Array ? Sc(e) : e));
}
function L1(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const I1 = "https://api.mainnet.hiro.so", U1 = "https://api.testnet.hiro.so", O1 = "http://localhost:3999", C1 = "https://hub.blockstack.org";
function P1(t) {
  const e = typeof t == "string" ? yt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function is(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const N1 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function k1(t, e) {
  const n = {};
  return Object.assign(n, N1, e), await fetch(t, n);
}
function D1(t) {
  let e = k1, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function T1(...t) {
  const { fetchLib: e, middlewares: n } = D1(t);
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
class X0 {
  constructor(e = z0.slice(), n = ((c) => (c = Wo("location", { returnEmptyObject: !0 })) == null ? void 0 : c.origin)(), r = "", s = "/manifest.json", o = void 0, i = d1) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = o, this.authenticatorURL = i;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function oo(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function F1(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Y0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function M1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  oo(t.outputLen), oo(t.blockLen);
}
function R1(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function G1(t, e) {
  Y0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Fe = {
  number: oo,
  bool: F1,
  bytes: Y0,
  hash: M1,
  exists: R1,
  output: G1
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ks = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ut = (t, e) => t << 32 - e | t >>> e, V1 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!V1)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function K1(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Yo(t) {
  if (typeof t == "string" && (t = K1(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let J0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ye(t) {
  const e = (r) => t().update(Yo(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Z0 = class extends J0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Fe.hash(e);
    const r = Yo(n);
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
    return Fe.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Fe.exists(this), Fe.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const cs = (t, e, n) => new Z0(t, e).update(n).digest();
cs.create = (t, e) => new Z0(t, e);
function z1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, i, r), t.setUint32(e + u, c, r);
}
let Jo = class extends J0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ks(this.buffer);
  }
  update(e) {
    Fe.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Yo(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const f = ks(e);
        for (; s <= o - i; i += s)
          this.process(f, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Fe.exists(this), Fe.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let a = i; a < s; a++)
      n[a] = 0;
    z1(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = ks(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = f / 4, l = this.get();
    if (u > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let a = 0; a < u; a++)
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
const j1 = (t, e, n) => t & e ^ ~t & n, q1 = (t, e, n) => t & e ^ t & n ^ e & n, W1 = new Uint32Array([
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
]), ae = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), fe = new Uint32Array(64);
let Q0 = class extends Jo {
  constructor() {
    super(64, 32, 8, !1), this.A = ae[0] | 0, this.B = ae[1] | 0, this.C = ae[2] | 0, this.D = ae[3] | 0, this.E = ae[4] | 0, this.F = ae[5] | 0, this.G = ae[6] | 0, this.H = ae[7] | 0;
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
      fe[a] = e.getUint32(n, !1);
    for (let a = 16; a < 64; a++) {
      const p = fe[a - 15], d = fe[a - 2], g = Ut(p, 7) ^ Ut(p, 18) ^ p >>> 3, y = Ut(d, 17) ^ Ut(d, 19) ^ d >>> 10;
      fe[a] = y + fe[a - 7] + g + fe[a - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: f, G: u, H: l } = this;
    for (let a = 0; a < 64; a++) {
      const p = Ut(c, 6) ^ Ut(c, 11) ^ Ut(c, 25), d = l + p + j1(c, f, u) + W1[a] + fe[a] | 0, y = (Ut(r, 2) ^ Ut(r, 13) ^ Ut(r, 22)) + q1(r, s, o) | 0;
      l = u, u = f, f = c, c = i + d | 0, i = o, o = s, s = r, r = d + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, l = l + this.H | 0, this.set(r, s, o, i, c, f, u, l);
  }
  roundClean() {
    fe.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, X1 = class extends Q0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const yn = Ye(() => new Q0());
Ye(() => new X1());
var Xn = {};
Xn.byteLength = t2;
var Y1 = Xn.toByteArray = n2, J1 = Xn.fromByteArray = o2, Nt = [], St = [], Z1 = typeof Uint8Array < "u" ? Uint8Array : Array, Ds = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var on = 0, Q1 = Ds.length; on < Q1; ++on)
  Nt[on] = Ds[on], St[Ds.charCodeAt(on)] = on;
St[45] = 62;
St[95] = 63;
function tf(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function t2(t) {
  var e = tf(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function e2(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function n2(t) {
  var e, n = tf(t), r = n[0], s = n[1], o = new Z1(e2(t, r, s)), i = 0, c = s > 0 ? r - 4 : r, f;
  for (f = 0; f < c; f += 4)
    e = St[t.charCodeAt(f)] << 18 | St[t.charCodeAt(f + 1)] << 12 | St[t.charCodeAt(f + 2)] << 6 | St[t.charCodeAt(f + 3)], o[i++] = e >> 16 & 255, o[i++] = e >> 8 & 255, o[i++] = e & 255;
  return s === 2 && (e = St[t.charCodeAt(f)] << 2 | St[t.charCodeAt(f + 1)] >> 4, o[i++] = e & 255), s === 1 && (e = St[t.charCodeAt(f)] << 10 | St[t.charCodeAt(f + 1)] << 4 | St[t.charCodeAt(f + 2)] >> 2, o[i++] = e >> 8 & 255, o[i++] = e & 255), o;
}
function r2(t) {
  return Nt[t >> 18 & 63] + Nt[t >> 12 & 63] + Nt[t >> 6 & 63] + Nt[t & 63];
}
function s2(t, e, n) {
  for (var r, s = [], o = e; o < n; o += 3)
    r = (t[o] << 16 & 16711680) + (t[o + 1] << 8 & 65280) + (t[o + 2] & 255), s.push(r2(r));
  return s.join("");
}
function o2(t) {
  for (var e, n = t.length, r = n % 3, s = [], o = 16383, i = 0, c = n - r; i < c; i += o)
    s.push(s2(t, i, i + o > c ? c : i + o));
  return r === 1 ? (e = t[n - 1], s.push(
    Nt[e >> 2] + Nt[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    Nt[e >> 10] + Nt[e >> 4 & 63] + Nt[e << 2 & 63] + "="
  )), s.join("");
}
function i2() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const c2 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function a2() {
  if (i2())
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
    throw new Error(c2);
  }
}
class f2 {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const o = this.createCipher(e, n, r), i = new Uint8Array(Jt(o.update(s), o.final()));
    return Promise.resolve(i);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const o = this.createDecipher(e, n, r), i = new Uint8Array(Jt(o.update(s), o.final()));
    return Promise.resolve(i);
  }
}
class h2 {
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
async function ef() {
  const t = await a2();
  return t.name === "subtleCrypto" ? new h2(t.lib) : new f2(t.lib.createCipheriv, t.lib.createDecipheriv);
}
const l2 = C0, u2 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var d2 = l2(u2);
const p2 = /* @__PURE__ */ Ju(d2), b2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), nf = Uint8Array.from({ length: 16 }, (t, e) => e), g2 = nf.map((t) => (9 * t + 5) % 16);
let Zo = [nf], Qo = [g2];
for (let t = 0; t < 4; t++)
  for (let e of [Zo, Qo])
    e.push(e[t].map((n) => b2[n]));
const rf = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), x2 = Zo.map((t, e) => t.map((n) => rf[e][n])), y2 = Qo.map((t, e) => t.map((n) => rf[e][n])), w2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), m2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), yr = (t, e) => t << e | t >>> 32 - e;
function Ec(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const wr = new Uint32Array(16);
let S2 = class extends Jo {
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
      wr[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, c = this.h2 | 0, f = c, u = this.h3 | 0, l = u, a = this.h4 | 0, p = a;
    for (let d = 0; d < 5; d++) {
      const g = 4 - d, y = w2[d], E = m2[d], _ = Zo[d], L = Qo[d], x = x2[d], v = y2[d];
      for (let S = 0; S < 16; S++) {
        const P = yr(r + Ec(d, o, c, u) + wr[_[S]] + y, x[S]) + a | 0;
        r = a, a = u, u = yr(c, 10) | 0, c = o, o = P;
      }
      for (let S = 0; S < 16; S++) {
        const P = yr(s + Ec(g, i, f, l) + wr[L[S]] + E, v[S]) + p | 0;
        s = p, p = l, l = yr(f, 10) | 0, f = i, i = P;
      }
    }
    this.set(this.h1 + c + l | 0, this.h2 + u + p | 0, this.h3 + a + s | 0, this.h4 + r + i | 0, this.h0 + o + f | 0);
  }
  roundClean() {
    wr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const E2 = Ye(() => new S2());
function A2(t) {
  return E2(t);
}
const mr = BigInt(2 ** 32 - 1), io = BigInt(32);
function sf(t, e = !1) {
  return e ? { h: Number(t & mr), l: Number(t >> io & mr) } : { h: Number(t >> io & mr) | 0, l: Number(t & mr) | 0 };
}
function B2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = sf(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const v2 = (t, e) => BigInt(t >>> 0) << io | BigInt(e >>> 0), $2 = (t, e, n) => t >>> n, _2 = (t, e, n) => t << 32 - n | e >>> n, H2 = (t, e, n) => t >>> n | e << 32 - n, L2 = (t, e, n) => t << 32 - n | e >>> n, I2 = (t, e, n) => t << 64 - n | e >>> n - 32, U2 = (t, e, n) => t >>> n - 32 | e << 64 - n, O2 = (t, e) => e, C2 = (t, e) => t, P2 = (t, e, n) => t << n | e >>> 32 - n, N2 = (t, e, n) => e << n | t >>> 32 - n, k2 = (t, e, n) => e << n - 32 | t >>> 64 - n, D2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function T2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const F2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), M2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, R2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), G2 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, V2 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), K2 = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, R = {
  fromBig: sf,
  split: B2,
  toBig: v2,
  shrSH: $2,
  shrSL: _2,
  rotrSH: H2,
  rotrSL: L2,
  rotrBH: I2,
  rotrBL: U2,
  rotr32H: O2,
  rotr32L: C2,
  rotlSH: P2,
  rotlSL: N2,
  rotlBH: k2,
  rotlBL: D2,
  add: T2,
  add3L: F2,
  add3H: M2,
  add4L: R2,
  add4H: G2,
  add5H: K2,
  add5L: V2
}, [z2, j2] = R.split([
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
].map((t) => BigInt(t))), he = new Uint32Array(80), le = new Uint32Array(80);
let as = class extends Jo {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: c, Dl: f, Eh: u, El: l, Fh: a, Fl: p, Gh: d, Gl: g, Hh: y, Hl: E } = this;
    return [e, n, r, s, o, i, c, f, u, l, a, p, d, g, y, E];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, f, u, l, a, p, d, g, y, E) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = f | 0, this.Eh = u | 0, this.El = l | 0, this.Fh = a | 0, this.Fl = p | 0, this.Gh = d | 0, this.Gl = g | 0, this.Hh = y | 0, this.Hl = E | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      he[x] = e.getUint32(n), le[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const v = he[x - 15] | 0, S = le[x - 15] | 0, P = R.rotrSH(v, S, 1) ^ R.rotrSH(v, S, 8) ^ R.shrSH(v, S, 7), F = R.rotrSL(v, S, 1) ^ R.rotrSL(v, S, 8) ^ R.shrSL(v, S, 7), O = he[x - 2] | 0, C = le[x - 2] | 0, b = R.rotrSH(O, C, 19) ^ R.rotrBH(O, C, 61) ^ R.shrSH(O, C, 6), A = R.rotrSL(O, C, 19) ^ R.rotrBL(O, C, 61) ^ R.shrSL(O, C, 6), H = R.add4L(F, A, le[x - 7], le[x - 16]), D = R.add4H(H, P, b, he[x - 7], he[x - 16]);
      he[x] = D | 0, le[x] = H | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: c, Cl: f, Dh: u, Dl: l, Eh: a, El: p, Fh: d, Fl: g, Gh: y, Gl: E, Hh: _, Hl: L } = this;
    for (let x = 0; x < 80; x++) {
      const v = R.rotrSH(a, p, 14) ^ R.rotrSH(a, p, 18) ^ R.rotrBH(a, p, 41), S = R.rotrSL(a, p, 14) ^ R.rotrSL(a, p, 18) ^ R.rotrBL(a, p, 41), P = a & d ^ ~a & y, F = p & g ^ ~p & E, O = R.add5L(L, S, F, j2[x], le[x]), C = R.add5H(O, _, v, P, z2[x], he[x]), b = O | 0, A = R.rotrSH(r, s, 28) ^ R.rotrBH(r, s, 34) ^ R.rotrBH(r, s, 39), H = R.rotrSL(r, s, 28) ^ R.rotrBL(r, s, 34) ^ R.rotrBL(r, s, 39), D = r & o ^ r & c ^ o & c, z = s & i ^ s & f ^ i & f;
      _ = y | 0, L = E | 0, y = d | 0, E = g | 0, d = a | 0, g = p | 0, { h: a, l: p } = R.add(u | 0, l | 0, C | 0, b | 0), u = c | 0, l = f | 0, c = o | 0, f = i | 0, o = r | 0, i = s | 0;
      const k = R.add3L(b, H, z);
      r = R.add3H(k, C, A, D), s = k | 0;
    }
    ({ h: r, l: s } = R.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = R.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: c, l: f } = R.add(this.Ch | 0, this.Cl | 0, c | 0, f | 0), { h: u, l } = R.add(this.Dh | 0, this.Dl | 0, u | 0, l | 0), { h: a, l: p } = R.add(this.Eh | 0, this.El | 0, a | 0, p | 0), { h: d, l: g } = R.add(this.Fh | 0, this.Fl | 0, d | 0, g | 0), { h: y, l: E } = R.add(this.Gh | 0, this.Gl | 0, y | 0, E | 0), { h: _, l: L } = R.add(this.Hh | 0, this.Hl | 0, _ | 0, L | 0), this.set(r, s, o, i, c, f, u, l, a, p, d, g, y, E, _, L);
  }
  roundClean() {
    he.fill(0), le.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, q2 = class extends as {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, W2 = class extends as {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, X2 = class extends as {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const Y2 = Ye(() => new as());
Ye(() => new q2());
Ye(() => new W2());
Ye(() => new X2());
function of(t) {
  return yn(t);
}
function J2(t) {
  return Y2(t);
}
const Z2 = 0;
it.hmacSha256Sync = (t, ...e) => {
  const n = cs.create(yn, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Q2() {
  return At(it.randomPrivateKey());
}
function tp(t) {
  const e = yn(yn(t));
  return p2.encode(Jt(t, e).slice(0, t.length + 4));
}
function ep(t, e) {
  return tp(Jt(new Uint8Array([t]), e.slice(0, 20)));
}
function cf(t, e = Z2) {
  const n = typeof t == "string" ? yt(t) : t, r = A2(of(n));
  return ep(e, r);
}
function af(t) {
  const e = P1(t);
  return At(To(e.slice(0, 32), !0));
}
it.hmacSha256Sync = (t, ...e) => {
  const n = cs.create(yn, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var zr;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(zr || (zr = {}));
async function np(t, e, n) {
  return await (await ef()).encrypt("aes-256-cbc", e, t, n);
}
async function rp(t, e, n) {
  return await (await ef()).decrypt("aes-256-cbc", e, t, n);
}
function ff(t, e) {
  return cs(yn, t, e);
}
function sp(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function hf(t) {
  const e = J2(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function op(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function ip(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: zr.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: zr.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !op(t))
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
async function cp(t, e, n, r) {
  const s = ip(t);
  if (!s.result)
    throw s;
  const o = it.randomPrivateKey(), i = To(o, !0);
  let c = Fo(o, t, !0);
  c = c.slice(1);
  const f = hf(c), u = it.randomBytes(16), l = await np(u, f.encryptionKey, e), a = Jt(u, i, l), p = ff(f.hmacKey, a);
  let d;
  if (!r || r === "hex")
    d = At(l);
  else if (r === "base64")
    d = J1(l);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const g = {
    iv: At(u),
    ephemeralPK: At(i),
    cipherText: d,
    mac: At(p),
    wasString: n
  };
  return r && r !== "hex" && (g.cipherTextEncoding = r), g;
}
async function lf(t, e) {
  if (!e.ephemeralPK)
    throw new wc("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = Fo(t, n, !0);
  r = r.slice(1);
  const s = hf(r), o = yt(e.iv);
  let i;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    i = yt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    i = Y1(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const c = Jt(o, yt(n), i), f = ff(s.hmacKey, c), u = yt(e.mac);
  if (!sp(u, f))
    throw new wc("Decryption failed: failure in MAC check");
  const l = await rp(o, s.encryptionKey, i);
  return e.wasString ? W0(l) : l;
}
function ap(t, e) {
  const n = typeof e == "string" ? Wn(e) : e, r = af(t), s = of(n), o = b0(s, t);
  return {
    signature: At(o),
    publicKey: r
  };
}
async function fp(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = af(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", o = typeof t == "string" ? Wn(t) : t, i = await cp(n.publicKey, o, s, n.cipherTextEncoding);
  let c = JSON.stringify(i);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const f = ap(r, c), u = {
      signature: f.signature,
      publicKey: f.publicKey,
      cipherText: c
    };
    c = JSON.stringify(u);
  }
  return c;
}
function hp(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return lf(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var dt = {}, wn = {}, lt = {};
Object.defineProperty(lt, "__esModule", { value: !0 });
lt.decode = lt.encode = lt.unescape = lt.escape = lt.pad = void 0;
const uf = Xn;
function ti(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
lt.pad = ti;
function df(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
lt.escape = df;
function pf(t) {
  return ti(t).replace(/-/g, "+").replace(/_/g, "/");
}
lt.unescape = pf;
function lp(t) {
  return df((0, uf.fromByteArray)(new TextEncoder().encode(t)));
}
lt.encode = lp;
function up(t) {
  return new TextDecoder().decode((0, uf.toByteArray)(ti(pf(t))));
}
lt.decode = up;
var fs = {}, hs = {};
let ei = class extends Ko {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, E0(e);
    const r = $n(n);
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
    this.oHash.update(o), Rn(o);
  }
  update(e) {
    return Mn(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Mn(this), Ce(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const bf = (t, e, n) => new ei(t, e).update(n).digest();
bf.create = (t, e) => new ei(t, e);
const dp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HMAC: ei,
  hmac: bf
}, Symbol.toStringTag, { value: "Module" })), pp = /* @__PURE__ */ zn(dp), bp = /* @__PURE__ */ zn(Yu);
var mn = {};
Object.defineProperty(mn, "__esModule", { value: !0 });
mn.joseToDer = mn.derToJose = void 0;
const gf = Xn, xf = lt;
function Ts(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const gp = {
  ES256: Ts(256),
  ES384: Ts(384),
  ES512: Ts(521)
};
function yf(t) {
  const e = gp[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const jr = 128, wf = 0, xp = 32, yp = 16, wp = 2, mf = yp | xp | wf << 6, qr = wp | wf << 6;
function Sf(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, gf.toByteArray)((0, xf.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function mp(t, e) {
  const n = Sf(t), r = yf(e), s = r + 1, o = n.length;
  let i = 0;
  if (n[i++] !== mf)
    throw new Error('Could not find expected "seq"');
  let c = n[i++];
  if (c === (jr | 1) && (c = n[i++]), o - i < c)
    throw new Error(`"seq" specified length of "${c}", only "${o - i}" remaining`);
  if (n[i++] !== qr)
    throw new Error('Could not find expected "int" for "r"');
  const f = n[i++];
  if (o - i - 2 < f)
    throw new Error(`"r" specified length of "${f}", only "${o - i - 2}" available`);
  if (s < f)
    throw new Error(`"r" specified length of "${f}", max of "${s}" is acceptable`);
  const u = i;
  if (i += f, n[i++] !== qr)
    throw new Error('Could not find expected "int" for "s"');
  const l = n[i++];
  if (o - i !== l)
    throw new Error(`"s" specified length of "${l}", expected "${o - i}"`);
  if (s < l)
    throw new Error(`"s" specified length of "${l}", max of "${s}" is acceptable`);
  const a = i;
  if (i += l, i !== o)
    throw new Error(`Expected to consume entire array, but "${o - i}" bytes remain`);
  const p = r - f, d = r - l, g = new Uint8Array(p + f + d + l);
  for (i = 0; i < p; ++i)
    g[i] = 0;
  g.set(n.subarray(u + Math.max(-p, 0), u + f), i), i = r;
  for (const y = i; i < y + d; ++i)
    g[i] = 0;
  return g.set(n.subarray(a + Math.max(-d, 0), a + l), i), (0, xf.escape)((0, gf.fromByteArray)(g));
}
mn.derToJose = mp;
function Ac(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= jr && --r, r;
}
function Sp(t, e) {
  t = Sf(t);
  const n = yf(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Ac(t, 0, n), o = Ac(t, n, t.length), i = n - s, c = n - o, f = 2 + i + 1 + 1 + c, u = f < jr, l = new Uint8Array((u ? 2 : 3) + f);
  let a = 0;
  return l[a++] = mf, u ? l[a++] = f : (l[a++] = jr | 1, l[a++] = f & 255), l[a++] = qr, l[a++] = i, s < 0 ? (l[a++] = 0, l.set(t.subarray(0, n), a), a += n) : (l.set(t.subarray(s, n), a), a += n - s), l[a++] = qr, l[a++] = c, o < 0 ? (l[a++] = 0, l.set(t.subarray(n), a)) : l.set(t.subarray(n + o), a), l;
}
mn.joseToDer = Sp;
var Zt = {};
Object.defineProperty(Zt, "__esModule", { value: !0 });
Zt.InvalidTokenError = Zt.MissingParametersError = void 0;
class Ep extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Zt.MissingParametersError = Ep;
class Ap extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Zt.InvalidTokenError = Ap;
Object.defineProperty(hs, "__esModule", { value: !0 });
hs.SECP256K1Client = void 0;
const Bp = pp, vp = os, Dr = bp, Bc = mn, vc = Zt, $c = jn;
Dr.utils.hmacSha256Sync = (t, ...e) => {
  const n = Bp.hmac.create(vp.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class Ef {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, $c.bytesToHex)(Dr.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new vc.MissingParametersError("a signing input hash and private key are all required");
    const s = Dr.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, $c.bytesToHex)(s);
    if (r === "jose")
      return (0, Bc.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Bc.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new vc.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Dr.verify(n, e, r, { strict: !1 });
  }
}
hs.SECP256K1Client = Ef;
Ef.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = hs;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(fs);
var ze = {};
const $p = /* @__PURE__ */ zn(i0);
var _p = ut && ut.__awaiter || function(t, e, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
    function c(l) {
      try {
        u(r.next(l));
      } catch (a) {
        i(a);
      }
    }
    function f(l) {
      try {
        u(r.throw(l));
      } catch (a) {
        i(a);
      }
    }
    function u(l) {
      l.done ? o(l.value) : s(l.value).then(c, f);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(ze, "__esModule", { value: !0 });
ze.hashSha256Async = ze.hashSha256 = void 0;
const Hp = os;
function Af(t) {
  return (0, Hp.sha256)(t);
}
ze.hashSha256 = Af;
function Lp(t) {
  return _p(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = $p;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Af(t));
    }
  });
}
ze.hashSha256Async = Lp;
var Ip = ut && ut.__awaiter || function(t, e, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
    function c(l) {
      try {
        u(r.next(l));
      } catch (a) {
        i(a);
      }
    }
    function f(l) {
      try {
        u(r.throw(l));
      } catch (a) {
        i(a);
      }
    }
    function u(l) {
      l.done ? o(l.value) : s(l.value).then(c, f);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(wn, "__esModule", { value: !0 });
wn.TokenSigner = wn.createUnsecuredToken = void 0;
const co = lt, _c = fs, Up = Zt, Hc = ze;
function ao(t, e) {
  const n = [], r = co.encode(JSON.stringify(e));
  n.push(r);
  const s = co.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function Op(t) {
  return ao(t, { typ: "JWT", alg: "none" }) + ".";
}
wn.createUnsecuredToken = Op;
class Cp {
  constructor(e, n) {
    if (!(e && n))
      throw new Up.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !_c.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = _c.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), o = ao(e, s), i = (0, Hc.hashSha256)(o);
    return this.createWithSignedHash(e, n, s, o, i);
  }
  signAsync(e, n = !1, r = {}) {
    return Ip(this, void 0, void 0, function* () {
      const s = this.header(r), o = ao(e, s), i = yield (0, Hc.hashSha256Async)(o);
      return this.createWithSignedHash(e, n, s, o, i);
    });
  }
  createWithSignedHash(e, n, r, s, o) {
    const i = this.cryptoClient.signHash(o, this.rawPrivateKey);
    return n ? {
      header: [co.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [i]
    } : [s, i].join(".");
  }
}
wn.TokenSigner = Cp;
var ls = {};
Object.defineProperty(ls, "__esModule", { value: !0 });
ls.TokenVerifier = void 0;
const Pp = lt, Lc = fs, Np = Zt, Sr = ze;
class kp {
  constructor(e, n) {
    if (!(e && n))
      throw new Np.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Lc.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Lc.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, Sr.hashSha256Async)(s).then((i) => o(i));
    {
      const i = (0, Sr.hashSha256)(s);
      return o(i);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), Pp.encode(e.payload)].join(".");
    let s = !0;
    const o = (i) => (e.signature.map((c) => {
      const f = this.cryptoClient.loadSignature(c);
      this.cryptoClient.verifyHash(i, f, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Sr.hashSha256Async)(r).then((i) => o(i));
    {
      const i = (0, Sr.hashSha256)(r);
      return o(i);
    }
  }
}
ls.TokenVerifier = kp;
var us = {};
Object.defineProperty(us, "__esModule", { value: !0 });
us.decodeToken = void 0;
const Er = lt;
function Dp(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Er.decode(e[0])), r = JSON.parse(Er.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Er.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Er.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
us.decodeToken = Dp;
(function(t) {
  var e = ut && ut.__createBinding || (Object.create ? function(r, s, o, i) {
    i === void 0 && (i = o);
    var c = Object.getOwnPropertyDescriptor(s, o);
    (!c || ("get" in c ? !s.__esModule : c.writable || c.configurable)) && (c = { enumerable: !0, get: function() {
      return s[o];
    } }), Object.defineProperty(r, i, c);
  } : function(r, s, o, i) {
    i === void 0 && (i = o), r[i] = s[o];
  }), n = ut && ut.__exportStar || function(r, s) {
    for (var o in r) o !== "default" && !Object.prototype.hasOwnProperty.call(s, o) && e(s, r, o);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(wn, t), n(ls, t), n(us, t), n(Zt, t), n(fs, t);
})(dt);
function Tp(t) {
  return `did:btc-addr:${t}`;
}
function Fp(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new yc("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new yc('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function Bf(t) {
  if (t)
    return Fp(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const Mp = "1.4.0";
function Rp() {
  return Q2();
}
function Gp(t, e, n, r = z0.slice(), s, o = y1().getTime(), i = {}) {
  const c = (d) => {
    const g = Wo("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${d}=undefined])`
    });
    return g == null ? void 0 : g.origin;
  };
  e || (e = `${c("redirectURI")}/`), n || (n = `${c("manifestURI")}/manifest.json`), s || (s = c("appDomain"));
  const f = Object.assign({}, i, {
    jti: m1(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(o / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: Mp,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = dt.SECP256K1Client.derivePublicKey(t);
  f.public_keys = [u];
  const l = cf(u);
  return f.iss = Tp(l), new dt.TokenSigner("ES256k", t).sign(f);
}
async function Ic(t, e) {
  const n = W0(yt(e)), r = JSON.parse(n), s = await lf(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function Vp(t) {
  const e = dt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new dt.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function Kp(t) {
  const e = dt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = Bf(e.iss);
  if (n.length === 1) {
    if (cf(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function zp(t) {
  const e = dt.decodeToken(t).payload;
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
function jp(t) {
  const e = dt.decodeToken(t).payload;
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
function qp(t) {
  const e = [
    jp(t),
    zp(t),
    Vp(t),
    Kp(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Uc = "1.0.0";
class Oe {
  constructor(e) {
    this.version = Uc, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Uc)
      throw new ro(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Oe(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class vf {
  constructor(e) {
    if (e) {
      const n = new Oe(e);
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
class Oc extends vf {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Oe({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new j0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Oe({})), !0;
  }
}
class Cc extends vf {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = b1, !localStorage.getItem(this.key)) {
      const r = new Oe({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new j0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Oe.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Oe({})), !0;
  }
}
var Gn;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Gn || (Gn = {}));
var Wr;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Wr || (Wr = {}));
Gn.Mainnet;
var Wt;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Wt || (Wt = {}));
var Dt;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Dt || (Dt = {}));
Wt.Mainnet;
const $f = {
  chainId: Gn.Mainnet,
  transactionVersion: Wt.Mainnet,
  peerNetworkId: Wr.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Dt.MainnetSingleSig,
    multiSig: Dt.MainnetMultiSig
  },
  client: { baseUrl: I1 }
}, fo = {
  chainId: Gn.Testnet,
  transactionVersion: Wt.Testnet,
  peerNetworkId: Wr.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Dt.TestnetSingleSig,
    multiSig: Dt.TestnetMultiSig
  },
  client: { baseUrl: U1 }
}, Tr = {
  ...fo,
  addressVersion: { ...fo.addressVersion },
  magicBytes: "id",
  client: { baseUrl: O1 }
}, Wp = {
  ...Tr,
  addressVersion: { ...Tr.addressVersion },
  client: { ...Tr.client }
};
function Xp(t) {
  switch (t) {
    case "mainnet":
      return $f;
    case "testnet":
      return fo;
    case "devnet":
      return Tr;
    case "mocknet":
      return Wp;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function _f(t) {
  return typeof t == "string" ? Xp(t) : t;
}
var Pc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Pc || (Pc = {}));
var Nc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Nc || (Nc = {}));
var $t;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})($t || ($t = {}));
const Fs = ["onChainOnly", "offChainOnly", "any"];
Fs[0] + "", $t.OnChainOnly, Fs[1] + "", $t.OffChainOnly, Fs[2] + "", $t.Any, $t.OnChainOnly + "", $t.OnChainOnly, $t.OffChainOnly + "", $t.OffChainOnly, $t.Any + "", $t.Any;
var kc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(kc || (kc = {}));
var Dc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Dc || (Dc = {}));
var Tc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Tc || (Tc = {}));
var qt;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(qt || (qt = {}));
var Fc;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Fc || (Fc = {}));
var Mc;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Mc || (Mc = {}));
var Rc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Rc || (Rc = {}));
var Gc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Gc || (Gc = {}));
var Vc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Vc || (Vc = {}));
var Kc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Kc || (Kc = {}));
var zc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(zc || (zc = {}));
var jc;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(jc || (jc = {}));
var qc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(qc || (qc = {}));
function ho(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Yp(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Hf(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Jp(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ho(t.outputLen), ho(t.blockLen);
}
function Zp(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Qp(t, e) {
  Hf(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Me = {
  number: ho,
  bool: Yp,
  bytes: Hf,
  hash: Jp,
  exists: Zp,
  output: Qp
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ms = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ot = (t, e) => t << 32 - e | t >>> e, tb = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!tb)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function eb(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function ni(t) {
  if (typeof t == "string" && (t = eb(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Lf = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Je(t) {
  const e = (r) => t().update(ni(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
class If extends Lf {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Me.hash(e);
    const r = ni(n);
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
    return Me.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Me.exists(this), Me.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Uf = (t, e, n) => new If(t, e).update(n).digest();
Uf.create = (t, e) => new If(t, e);
function nb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, i, r), t.setUint32(e + u, c, r);
}
let ri = class extends Lf {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ms(this.buffer);
  }
  update(e) {
    Me.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = ni(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const f = Ms(e);
        for (; s <= o - i; i += s)
          this.process(f, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Me.exists(this), Me.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let a = i; a < s; a++)
      n[a] = 0;
    nb(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = Ms(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = f / 4, l = this.get();
    if (u > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let a = 0; a < u; a++)
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
let Of = class extends ri {
  constructor() {
    super(64, 32, 8, !1), this.A = ue[0] | 0, this.B = ue[1] | 0, this.C = ue[2] | 0, this.D = ue[3] | 0, this.E = ue[4] | 0, this.F = ue[5] | 0, this.G = ue[6] | 0, this.H = ue[7] | 0;
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
      de[a] = e.getUint32(n, !1);
    for (let a = 16; a < 64; a++) {
      const p = de[a - 15], d = de[a - 2], g = Ot(p, 7) ^ Ot(p, 18) ^ p >>> 3, y = Ot(d, 17) ^ Ot(d, 19) ^ d >>> 10;
      de[a] = y + de[a - 7] + g + de[a - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: f, G: u, H: l } = this;
    for (let a = 0; a < 64; a++) {
      const p = Ot(c, 6) ^ Ot(c, 11) ^ Ot(c, 25), d = l + p + rb(c, f, u) + ob[a] + de[a] | 0, y = (Ot(r, 2) ^ Ot(r, 13) ^ Ot(r, 22)) + sb(r, s, o) | 0;
      l = u, u = f, f = c, c = i + d | 0, i = o, o = s, s = r, r = d + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, l = l + this.H | 0, this.set(r, s, o, i, c, f, u, l);
  }
  roundClean() {
    de.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, ib = class extends Of {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Cf = Je(() => new Of());
Je(() => new ib());
function cb(t, e) {
  switch (e = _f(e ?? $f), t) {
    case qt.P2PKH:
      switch (e.transactionVersion) {
        case Wt.Mainnet:
          return Dt.MainnetSingleSig;
        case Wt.Testnet:
          return Dt.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case qt.P2SH:
    case qt.P2SHNonSequential:
    case qt.P2WPKH:
    case qt.P2WSH:
    case qt.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Wt.Mainnet:
          return Dt.MainnetMultiSig;
        case Wt.Testnet:
          return Dt.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const ab = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Pf = Uint8Array.from({ length: 16 }, (t, e) => e), fb = Pf.map((t) => (9 * t + 5) % 16);
let si = [Pf], oi = [fb];
for (let t = 0; t < 4; t++)
  for (let e of [si, oi])
    e.push(e[t].map((n) => ab[n]));
const Nf = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), hb = si.map((t, e) => t.map((n) => Nf[e][n])), lb = oi.map((t, e) => t.map((n) => Nf[e][n])), ub = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), db = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ar = (t, e) => t << e | t >>> 32 - e;
function Wc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Br = new Uint32Array(16);
let pb = class extends ri {
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
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, c = this.h2 | 0, f = c, u = this.h3 | 0, l = u, a = this.h4 | 0, p = a;
    for (let d = 0; d < 5; d++) {
      const g = 4 - d, y = ub[d], E = db[d], _ = si[d], L = oi[d], x = hb[d], v = lb[d];
      for (let S = 0; S < 16; S++) {
        const P = Ar(r + Wc(d, o, c, u) + Br[_[S]] + y, x[S]) + a | 0;
        r = a, a = u, u = Ar(c, 10) | 0, c = o, o = P;
      }
      for (let S = 0; S < 16; S++) {
        const P = Ar(s + Wc(g, i, f, l) + Br[L[S]] + E, v[S]) + p | 0;
        s = p, p = l, l = Ar(f, 10) | 0, f = i, i = P;
      }
    }
    this.set(this.h1 + c + l | 0, this.h2 + u + p | 0, this.h3 + a + s | 0, this.h4 + r + i | 0, this.h0 + o + f | 0);
  }
  roundClean() {
    Br.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const bb = Je(() => new pb()), vr = BigInt(2 ** 32 - 1), lo = BigInt(32);
function kf(t, e = !1) {
  return e ? { h: Number(t & vr), l: Number(t >> lo & vr) } : { h: Number(t >> lo & vr) | 0, l: Number(t & vr) | 0 };
}
function gb(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = kf(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const xb = (t, e) => BigInt(t >>> 0) << lo | BigInt(e >>> 0), yb = (t, e, n) => t >>> n, wb = (t, e, n) => t << 32 - n | e >>> n, mb = (t, e, n) => t >>> n | e << 32 - n, Sb = (t, e, n) => t << 32 - n | e >>> n, Eb = (t, e, n) => t << 64 - n | e >>> n - 32, Ab = (t, e, n) => t >>> n - 32 | e << 64 - n, Bb = (t, e) => e, vb = (t, e) => t, $b = (t, e, n) => t << n | e >>> 32 - n, _b = (t, e, n) => e << n | t >>> 32 - n, Hb = (t, e, n) => e << n - 32 | t >>> 64 - n, Lb = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Ib(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Ub = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Ob = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Cb = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Pb = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Nb = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), kb = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, G = {
  fromBig: kf,
  split: gb,
  toBig: xb,
  shrSH: yb,
  shrSL: wb,
  rotrSH: mb,
  rotrSL: Sb,
  rotrBH: Eb,
  rotrBL: Ab,
  rotr32H: Bb,
  rotr32L: vb,
  rotlSH: $b,
  rotlSL: _b,
  rotlBH: Hb,
  rotlBL: Lb,
  add: Ib,
  add3L: Ub,
  add3H: Ob,
  add4L: Cb,
  add4H: Pb,
  add5H: kb,
  add5L: Nb
}, [Db, Tb] = G.split([
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
let ds = class extends ri {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: c, Dl: f, Eh: u, El: l, Fh: a, Fl: p, Gh: d, Gl: g, Hh: y, Hl: E } = this;
    return [e, n, r, s, o, i, c, f, u, l, a, p, d, g, y, E];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, f, u, l, a, p, d, g, y, E) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = f | 0, this.Eh = u | 0, this.El = l | 0, this.Fh = a | 0, this.Fl = p | 0, this.Gh = d | 0, this.Gl = g | 0, this.Hh = y | 0, this.Hl = E | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      pe[x] = e.getUint32(n), be[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const v = pe[x - 15] | 0, S = be[x - 15] | 0, P = G.rotrSH(v, S, 1) ^ G.rotrSH(v, S, 8) ^ G.shrSH(v, S, 7), F = G.rotrSL(v, S, 1) ^ G.rotrSL(v, S, 8) ^ G.shrSL(v, S, 7), O = pe[x - 2] | 0, C = be[x - 2] | 0, b = G.rotrSH(O, C, 19) ^ G.rotrBH(O, C, 61) ^ G.shrSH(O, C, 6), A = G.rotrSL(O, C, 19) ^ G.rotrBL(O, C, 61) ^ G.shrSL(O, C, 6), H = G.add4L(F, A, be[x - 7], be[x - 16]), D = G.add4H(H, P, b, pe[x - 7], pe[x - 16]);
      pe[x] = D | 0, be[x] = H | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: c, Cl: f, Dh: u, Dl: l, Eh: a, El: p, Fh: d, Fl: g, Gh: y, Gl: E, Hh: _, Hl: L } = this;
    for (let x = 0; x < 80; x++) {
      const v = G.rotrSH(a, p, 14) ^ G.rotrSH(a, p, 18) ^ G.rotrBH(a, p, 41), S = G.rotrSL(a, p, 14) ^ G.rotrSL(a, p, 18) ^ G.rotrBL(a, p, 41), P = a & d ^ ~a & y, F = p & g ^ ~p & E, O = G.add5L(L, S, F, Tb[x], be[x]), C = G.add5H(O, _, v, P, Db[x], pe[x]), b = O | 0, A = G.rotrSH(r, s, 28) ^ G.rotrBH(r, s, 34) ^ G.rotrBH(r, s, 39), H = G.rotrSL(r, s, 28) ^ G.rotrBL(r, s, 34) ^ G.rotrBL(r, s, 39), D = r & o ^ r & c ^ o & c, z = s & i ^ s & f ^ i & f;
      _ = y | 0, L = E | 0, y = d | 0, E = g | 0, d = a | 0, g = p | 0, { h: a, l: p } = G.add(u | 0, l | 0, C | 0, b | 0), u = c | 0, l = f | 0, c = o | 0, f = i | 0, o = r | 0, i = s | 0;
      const k = G.add3L(b, H, z);
      r = G.add3H(k, C, A, D), s = k | 0;
    }
    ({ h: r, l: s } = G.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = G.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: c, l: f } = G.add(this.Ch | 0, this.Cl | 0, c | 0, f | 0), { h: u, l } = G.add(this.Dh | 0, this.Dl | 0, u | 0, l | 0), { h: a, l: p } = G.add(this.Eh | 0, this.El | 0, a | 0, p | 0), { h: d, l: g } = G.add(this.Fh | 0, this.Fl | 0, d | 0, g | 0), { h: y, l: E } = G.add(this.Gh | 0, this.Gl | 0, y | 0, E | 0), { h: _, l: L } = G.add(this.Hh | 0, this.Hl | 0, _ | 0, L | 0), this.set(r, s, o, i, c, f, u, l, a, p, d, g, y, E, _, L);
  }
  roundClean() {
    pe.fill(0), be.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Fb = class extends ds {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Mb = class extends ds {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Rb = class extends ds {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Je(() => new ds());
Je(() => new Fb());
Je(() => new Mb());
Je(() => new Rb());
var uo;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(uo || (uo = {}));
function Gb(t, e) {
  return { type: uo.Address, version: t, hash160: e };
}
function Vb(t) {
  return vn.c32address(t.version, t.hash160);
}
const Kb = (t) => bb(Cf(t)), zb = (t) => At(Kb(t));
it.hmacSha256Sync = (t, ...e) => {
  const n = Uf.create(Cf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function jb(t, e = "mainnet") {
  e = _f(e), t = typeof t == "string" ? yt(t) : t;
  const n = cb(qt.P2PKH, e), r = Gb(n, zb(t));
  return Vb(r);
}
function qb(t, e) {
  const n = dt.decodeToken(t), r = n.payload;
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
  const i = new dt.TokenVerifier(n.header.alg, s);
  if (!i)
    throw new Error("Invalid token verifier");
  if (!i.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function Wb(t, e = null) {
  let n;
  e ? n = qb(t, e) : n = dt.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const Xc = "_blockstackDidCheckEchoReply", Xb = "echoReply", Yb = "authContinuation";
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
  const e = t[Xc];
  if (typeof e == "boolean")
    return e;
  const n = Jb(t.location.search), r = n[Xb];
  if (r) {
    t[Xc] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const o = n[Yb];
      t.location.href = o;
    }, 10), !0;
  }
  return !1;
}
class po {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new X0();
    else
      throw new x1("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new Cc(e.sessionOptions) : this.store = new Cc() : e ? this.store = new Oc(e.sessionOptions) : this.store = new Oc();
  }
  makeAuthRequestToken(e, n, r, s, o, i = w1().getTime(), c = {}) {
    const f = this.appConfig;
    if (!f)
      throw new ro("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || f.redirectURI(), r = r || f.manifestURI(), s = s || f.scopes, o = o || f.appDomain, Gp(e, n, r, s, o, i, c);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = Rp();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = Wo("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (Zb())
        return hn.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      hn.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = T1()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new xr("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const o = dt.decodeToken(e).payload;
    if (typeof o == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await qp(e))
      throw new xr("Invalid authentication response.");
    let c = o.private_key, f = o.core_token;
    if (Ns(o.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (o.private_key !== void 0 && o.private_key !== null)
          try {
            c = await Ic(s, o.private_key);
          } catch {
            if (hn.warn("Failed decryption of appPrivateKey, will try to use as given"), !it.isValidPrivateKey(o.private_key))
              throw new xr("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (f != null)
          try {
            f = await Ic(s, f);
          } catch {
            hn.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new xr("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = C1, l;
    Ns(o.version, "1.2.0") && o.hubUrl !== null && o.hubUrl !== void 0 && (u = o.hubUrl), Ns(o.version, "1.3.0") && o.associationToken !== null && o.associationToken !== void 0 && (l = o.associationToken);
    const a = {
      profile: o.profile,
      email: o.email,
      decentralizedID: o.iss,
      identityAddress: Bf(o.iss),
      appPrivateKey: c,
      coreSessionToken: f,
      authResponseToken: e,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: o.appPrivateKeyFromWalletSalt,
      coreNode: o.blockstackAPIUrl,
      gaiaAssociationToken: l
    }, p = o.profile_url;
    if (!a.profile && p) {
      const d = await n(p);
      if (!d.ok)
        a.profile = Object.assign({}, p1);
      else {
        const g = await d.text(), y = JSON.parse(g);
        a.profile = Wb(y[0].token);
      }
    } else
      a.profile = o.profile;
    return r.userData = a, this.store.setSessionData(r), a;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new ro("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), fp(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), hp(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
po.prototype.makeAuthRequest = po.prototype.makeAuthRequestToken;
const Qb = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), Df = "STX_PROVIDER", Tf = () => typeof window > "u" ? null : window.localStorage.getItem(Df), tg = (t) => {
  typeof window < "u" && window.localStorage.setItem(Df, t);
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
var Sn;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Sn || (Sn = {}));
var je;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(je || (je = {}));
var Yc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Yc || (Yc = {}));
const og = "https://api.mainnet.hiro.so", ig = "https://api.testnet.hiro.so", cg = "http://localhost:3999", ag = ["mainnet", "testnet", "devnet", "mocknet"];
class qe {
  constructor(e) {
    this.version = je.Mainnet, this.chainId = Sn.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === je.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
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
qe.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new bo();
    case "testnet":
      return new go();
    case "devnet":
      return new fg();
    case "mocknet":
      return new Ff();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${ag.join(", ")}`);
  }
};
qe.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : qe.fromName(t);
class bo extends qe {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? og,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = je.Mainnet, this.chainId = Sn.Mainnet;
  }
}
class go extends qe {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? ig,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = je.Testnet, this.chainId = Sn.Testnet;
  }
}
class Ff extends qe {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? cg,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = je.Testnet, this.chainId = Sn.Testnet;
  }
}
const fg = Ff;
var xo;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(xo || (xo = {}));
var Jc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Jc || (Jc = {}));
xo.Mainnet;
var Xr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Xr || (Xr = {}));
var Zc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Zc || (Zc = {}));
Xr.Mainnet;
const hg = 128, lg = 128, Mf = 16;
var Qc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Qc || (Qc = {}));
var ta;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(ta || (ta = {}));
var _t;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(_t || (_t = {}));
const Rs = ["onChainOnly", "offChainOnly", "any"];
Rs[0] + "", _t.OnChainOnly, Rs[1] + "", _t.OffChainOnly, Rs[2] + "", _t.Any, _t.OnChainOnly + "", _t.OnChainOnly, _t.OffChainOnly + "", _t.OffChainOnly, _t.Any + "", _t.Any;
var ea;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(ea || (ea = {}));
var na;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(na || (na = {}));
var ra;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(ra || (ra = {}));
var sa;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(sa || (sa = {}));
var oa;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(oa || (oa = {}));
var ia;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(ia || (ia = {}));
var ca;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(ca || (ca = {}));
var aa;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(aa || (aa = {}));
var fa;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(fa || (fa = {}));
var ha;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(ha || (ha = {}));
var la;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(la || (la = {}));
var ua;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(ua || (ua = {}));
var da;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(da || (da = {}));
let ug = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, dg = class extends ug {
  constructor(e) {
    super(e);
  }
};
function yo(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function pg(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Rf(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function bg(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  yo(t.outputLen), yo(t.blockLen);
}
function gg(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function xg(t, e) {
  Rf(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Gs = {
  number: yo,
  bool: pg,
  bytes: Rf,
  hash: bg,
  exists: gg,
  output: xg
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Vs = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ct = (t, e) => t << 32 - e | t >>> e, yg = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!yg)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function wg(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Gf(t) {
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
function Ze(t) {
  const e = (r) => t().update(Gf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Sg(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, i, r), t.setUint32(e + u, c, r);
}
let ii = class extends mg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Vs(this.buffer);
  }
  update(e) {
    Gs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Gf(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const f = Vs(e);
        for (; s <= o - i; i += s)
          this.process(f, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Gs.exists(this), Gs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let a = i; a < s; a++)
      n[a] = 0;
    Sg(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = Vs(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = f / 4, l = this.get();
    if (u > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let a = 0; a < u; a++)
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
const Eg = (t, e, n) => t & e ^ ~t & n, Ag = (t, e, n) => t & e ^ t & n ^ e & n, Bg = new Uint32Array([
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
let Vf = class extends ii {
  constructor() {
    super(64, 32, 8, !1), this.A = ge[0] | 0, this.B = ge[1] | 0, this.C = ge[2] | 0, this.D = ge[3] | 0, this.E = ge[4] | 0, this.F = ge[5] | 0, this.G = ge[6] | 0, this.H = ge[7] | 0;
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
      xe[a] = e.getUint32(n, !1);
    for (let a = 16; a < 64; a++) {
      const p = xe[a - 15], d = xe[a - 2], g = Ct(p, 7) ^ Ct(p, 18) ^ p >>> 3, y = Ct(d, 17) ^ Ct(d, 19) ^ d >>> 10;
      xe[a] = y + xe[a - 7] + g + xe[a - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: f, G: u, H: l } = this;
    for (let a = 0; a < 64; a++) {
      const p = Ct(c, 6) ^ Ct(c, 11) ^ Ct(c, 25), d = l + p + Eg(c, f, u) + Bg[a] + xe[a] | 0, y = (Ct(r, 2) ^ Ct(r, 13) ^ Ct(r, 22)) + Ag(r, s, o) | 0;
      l = u, u = f, f = c, c = i + d | 0, i = o, o = s, s = r, r = d + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, l = l + this.H | 0, this.set(r, s, o, i, c, f, u, l);
  }
  roundClean() {
    xe.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, vg = class extends Vf {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Ze(() => new Vf());
Ze(() => new vg());
const $g = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Kf = Uint8Array.from({ length: 16 }, (t, e) => e), _g = Kf.map((t) => (9 * t + 5) % 16);
let ci = [Kf], ai = [_g];
for (let t = 0; t < 4; t++)
  for (let e of [ci, ai])
    e.push(e[t].map((n) => $g[n]));
const zf = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Hg = ci.map((t, e) => t.map((n) => zf[e][n])), Lg = ai.map((t, e) => t.map((n) => zf[e][n])), Ig = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Ug = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), $r = (t, e) => t << e | t >>> 32 - e;
function pa(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const _r = new Uint32Array(16);
let Og = class extends ii {
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
      _r[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, c = this.h2 | 0, f = c, u = this.h3 | 0, l = u, a = this.h4 | 0, p = a;
    for (let d = 0; d < 5; d++) {
      const g = 4 - d, y = Ig[d], E = Ug[d], _ = ci[d], L = ai[d], x = Hg[d], v = Lg[d];
      for (let S = 0; S < 16; S++) {
        const P = $r(r + pa(d, o, c, u) + _r[_[S]] + y, x[S]) + a | 0;
        r = a, a = u, u = $r(c, 10) | 0, c = o, o = P;
      }
      for (let S = 0; S < 16; S++) {
        const P = $r(s + pa(g, i, f, l) + _r[L[S]] + E, v[S]) + p | 0;
        s = p, p = l, l = $r(f, 10) | 0, f = i, i = P;
      }
    }
    this.set(this.h1 + c + l | 0, this.h2 + u + p | 0, this.h3 + a + s | 0, this.h4 + r + i | 0, this.h0 + o + f | 0);
  }
  roundClean() {
    _r.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Ze(() => new Og());
const Hr = BigInt(2 ** 32 - 1), wo = BigInt(32);
function jf(t, e = !1) {
  return e ? { h: Number(t & Hr), l: Number(t >> wo & Hr) } : { h: Number(t >> wo & Hr) | 0, l: Number(t & Hr) | 0 };
}
function Cg(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = jf(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const Pg = (t, e) => BigInt(t >>> 0) << wo | BigInt(e >>> 0), Ng = (t, e, n) => t >>> n, kg = (t, e, n) => t << 32 - n | e >>> n, Dg = (t, e, n) => t >>> n | e << 32 - n, Tg = (t, e, n) => t << 32 - n | e >>> n, Fg = (t, e, n) => t << 64 - n | e >>> n - 32, Mg = (t, e, n) => t >>> n - 32 | e << 64 - n, Rg = (t, e) => e, Gg = (t, e) => t, Vg = (t, e, n) => t << n | e >>> 32 - n, Kg = (t, e, n) => e << n | t >>> 32 - n, zg = (t, e, n) => e << n - 32 | t >>> 64 - n, jg = (t, e, n) => t << n - 32 | e >>> 64 - n;
function qg(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Wg = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Xg = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Yg = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Jg = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Zg = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Qg = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, V = {
  fromBig: jf,
  split: Cg,
  toBig: Pg,
  shrSH: Ng,
  shrSL: kg,
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
}, [tx, ex] = V.split([
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
].map((t) => BigInt(t))), ye = new Uint32Array(80), we = new Uint32Array(80);
let ps = class extends ii {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: c, Dl: f, Eh: u, El: l, Fh: a, Fl: p, Gh: d, Gl: g, Hh: y, Hl: E } = this;
    return [e, n, r, s, o, i, c, f, u, l, a, p, d, g, y, E];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, f, u, l, a, p, d, g, y, E) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = f | 0, this.Eh = u | 0, this.El = l | 0, this.Fh = a | 0, this.Fl = p | 0, this.Gh = d | 0, this.Gl = g | 0, this.Hh = y | 0, this.Hl = E | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      ye[x] = e.getUint32(n), we[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const v = ye[x - 15] | 0, S = we[x - 15] | 0, P = V.rotrSH(v, S, 1) ^ V.rotrSH(v, S, 8) ^ V.shrSH(v, S, 7), F = V.rotrSL(v, S, 1) ^ V.rotrSL(v, S, 8) ^ V.shrSL(v, S, 7), O = ye[x - 2] | 0, C = we[x - 2] | 0, b = V.rotrSH(O, C, 19) ^ V.rotrBH(O, C, 61) ^ V.shrSH(O, C, 6), A = V.rotrSL(O, C, 19) ^ V.rotrBL(O, C, 61) ^ V.shrSL(O, C, 6), H = V.add4L(F, A, we[x - 7], we[x - 16]), D = V.add4H(H, P, b, ye[x - 7], ye[x - 16]);
      ye[x] = D | 0, we[x] = H | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: c, Cl: f, Dh: u, Dl: l, Eh: a, El: p, Fh: d, Fl: g, Gh: y, Gl: E, Hh: _, Hl: L } = this;
    for (let x = 0; x < 80; x++) {
      const v = V.rotrSH(a, p, 14) ^ V.rotrSH(a, p, 18) ^ V.rotrBH(a, p, 41), S = V.rotrSL(a, p, 14) ^ V.rotrSL(a, p, 18) ^ V.rotrBL(a, p, 41), P = a & d ^ ~a & y, F = p & g ^ ~p & E, O = V.add5L(L, S, F, ex[x], we[x]), C = V.add5H(O, _, v, P, tx[x], ye[x]), b = O | 0, A = V.rotrSH(r, s, 28) ^ V.rotrBH(r, s, 34) ^ V.rotrBH(r, s, 39), H = V.rotrSL(r, s, 28) ^ V.rotrBL(r, s, 34) ^ V.rotrBL(r, s, 39), D = r & o ^ r & c ^ o & c, z = s & i ^ s & f ^ i & f;
      _ = y | 0, L = E | 0, y = d | 0, E = g | 0, d = a | 0, g = p | 0, { h: a, l: p } = V.add(u | 0, l | 0, C | 0, b | 0), u = c | 0, l = f | 0, c = o | 0, f = i | 0, o = r | 0, i = s | 0;
      const k = V.add3L(b, H, z);
      r = V.add3H(k, C, A, D), s = k | 0;
    }
    ({ h: r, l: s } = V.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = V.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: c, l: f } = V.add(this.Ch | 0, this.Cl | 0, c | 0, f | 0), { h: u, l } = V.add(this.Dh | 0, this.Dl | 0, u | 0, l | 0), { h: a, l: p } = V.add(this.Eh | 0, this.El | 0, a | 0, p | 0), { h: d, l: g } = V.add(this.Fh | 0, this.Fl | 0, d | 0, g | 0), { h: y, l: E } = V.add(this.Gh | 0, this.Gl | 0, y | 0, E | 0), { h: _, l: L } = V.add(this.Hh | 0, this.Hl | 0, _ | 0, L | 0), this.set(r, s, o, i, c, f, u, l, a, p, d, g, y, E, _, L);
  }
  roundClean() {
    ye.fill(0), we.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, nx = class extends ps {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, rx = class extends ps {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, sx = class extends ps {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ze(() => new ps());
Ze(() => new nx());
Ze(() => new rx());
Ze(() => new sx());
var ct;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(ct || (ct = {}));
var mo;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(mo || (mo = {}));
function fi(t) {
  return mo[t];
}
var Yr;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Yr || (Yr = {}));
function qf(t, e, n) {
  const s = hg;
  if (xx(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Yr.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
function Wf(t) {
  const e = vn.c32addressDecode(t);
  return {
    type: Yr.Address,
    version: e[0],
    hash160: e[1]
  };
}
function Xf(t) {
  const e = [];
  return e.push(yt(Xo(t.version, 1))), e.push(yt(t.hash160)), Hn(e);
}
function Yf(t) {
  const e = [], n = Wn(t.content), r = n.byteLength;
  return e.push(yt(Xo(r, t.lengthPrefixBytes))), e.push(n), Hn(e);
}
function Mt(t, e) {
  return Hn([fi(t), e]);
}
function ox(t) {
  return new Uint8Array([fi(t.type)]);
}
function ix(t) {
  return t.type === ct.OptionalNone ? new Uint8Array([fi(t.type)]) : Mt(t.type, Yn(t.value));
}
function cx(t) {
  const e = new Uint8Array(4);
  return is(e, Math.ceil(t.value.length / 2), 0), Mt(t.type, Jt(e, yt(t.value)));
}
function ax(t) {
  const e = q0(v1(BigInt(t.value), BigInt(lg)), Mf);
  return Mt(t.type, e);
}
function fx(t) {
  const e = q0(BigInt(t.value), Mf);
  return Mt(t.type, e);
}
function hx(t) {
  return Mt(t.type, Xf(Wf(t.value)));
}
function lx(t) {
  const [e, n] = yx(t.value);
  return Mt(t.type, Jt(Xf(Wf(e)), Yf(qf(n))));
}
function ux(t) {
  return Mt(t.type, Yn(t.value));
}
function dx(t) {
  const e = [], n = new Uint8Array(4);
  is(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = Yn(r);
    e.push(s);
  }
  return Mt(t.type, Hn(e));
}
function px(t) {
  const e = [], n = new Uint8Array(4);
  is(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = qf(s);
    e.push(Yf(o));
    const i = Yn(t.value[s]);
    e.push(i);
  }
  return Mt(t.type, Hn(e));
}
function Jf(t, e) {
  const n = [], r = e == "ascii" ? _1(t.value) : Wn(t.value), s = new Uint8Array(4);
  return is(s, r.length, 0), n.push(s), n.push(r), Mt(t.type, Hn(n));
}
function bx(t) {
  return Jf(t, "ascii");
}
function gx(t) {
  return Jf(t, "utf8");
}
function ba(t) {
  return At(Yn(t));
}
function Yn(t) {
  switch (t.type) {
    case ct.BoolTrue:
    case ct.BoolFalse:
      return ox(t);
    case ct.OptionalNone:
    case ct.OptionalSome:
      return ix(t);
    case ct.Buffer:
      return cx(t);
    case ct.UInt:
      return fx(t);
    case ct.Int:
      return ax(t);
    case ct.PrincipalStandard:
      return hx(t);
    case ct.PrincipalContract:
      return lx(t);
    case ct.ResponseOk:
    case ct.ResponseErr:
      return ux(t);
    case ct.List:
      return dx(t);
    case ct.Tuple:
      return px(t);
    case ct.StringASCII:
      return bx(t);
    case ct.StringUTF8:
      return gx(t);
    default:
      throw new dg("Unable to serialize. Invalid Clarity Value.");
  }
}
const xx = (t, e) => t ? Wn(t).length > e : !1;
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Vn(r);
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
function hi(t, e = 8) {
  return (typeof t == "bigint" ? t : wx(t)).toString(16).padStart(e * 2, "0");
}
function Zf(t, e = 16) {
  const n = hi(t, e);
  return Vn(n);
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
function Vn(t) {
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
function li(t) {
  return new TextEncoder().encode(t);
}
function Ax(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Bx(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function ga(t) {
  if (t.some(Bx))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function ui(...t) {
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
function Ln(t) {
  return ui(...t.map((e) => typeof e == "number" ? ga([e]) : e instanceof Array ? ga(e) : e));
}
function bs(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var So;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(So || (So = {}));
So.Mainnet;
const vx = 128, $x = 128, Qf = 16;
var Eo;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Eo || (Eo = {}));
var xa;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(xa || (xa = {}));
var ya;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(ya || (ya = {}));
var Ht;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ht || (Ht = {}));
const Ks = ["onChainOnly", "offChainOnly", "any"];
Ks[0] + "", Ht.OnChainOnly, Ks[1] + "", Ht.OffChainOnly, Ks[2] + "", Ht.Any, Ht.OnChainOnly + "", Ht.OnChainOnly, Ht.OffChainOnly + "", Ht.OffChainOnly, Ht.Any + "", Ht.Any;
var Ao;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ao || (Ao = {}));
Ao.Mainnet;
var wa;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(wa || (wa = {}));
var ma;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(ma || (ma = {}));
var Sa;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Sa || (Sa = {}));
var Ea;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Ea || (Ea = {}));
var Aa;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Aa || (Aa = {}));
var Ba;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ba || (Ba = {}));
var va;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(va || (va = {}));
var $a;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})($a || ($a = {}));
var _a;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(_a || (_a = {}));
var Ha;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ha || (Ha = {}));
var La;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(La || (La = {}));
function Bo(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function _x(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function th(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Hx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Bo(t.outputLen), Bo(t.blockLen);
}
function Lx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Ix(t, e) {
  th(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const zs = {
  number: Bo,
  bool: _x,
  bytes: th,
  hash: Hx,
  exists: Lx,
  output: Ix
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const js = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Pt = (t, e) => t << 32 - e | t >>> e, Ux = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Ux)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ox(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function eh(t) {
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
function Qe(t) {
  const e = (r) => t().update(eh(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Px(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, i, r), t.setUint32(e + u, c, r);
}
class di extends Cx {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = js(this.buffer);
  }
  update(e) {
    zs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = eh(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const f = js(e);
        for (; s <= o - i; i += s)
          this.process(f, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    zs.exists(this), zs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let a = i; a < s; a++)
      n[a] = 0;
    Px(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = js(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = f / 4, l = this.get();
    if (u > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let a = 0; a < u; a++)
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
const Nx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), nh = Uint8Array.from({ length: 16 }, (t, e) => e), kx = nh.map((t) => (9 * t + 5) % 16);
let pi = [nh], bi = [kx];
for (let t = 0; t < 4; t++)
  for (let e of [pi, bi])
    e.push(e[t].map((n) => Nx[n]));
const rh = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Dx = pi.map((t, e) => t.map((n) => rh[e][n])), Tx = bi.map((t, e) => t.map((n) => rh[e][n])), Fx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Mx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Lr = (t, e) => t << e | t >>> 32 - e;
function Ia(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ir = new Uint32Array(16);
class Rx extends di {
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
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, c = this.h2 | 0, f = c, u = this.h3 | 0, l = u, a = this.h4 | 0, p = a;
    for (let d = 0; d < 5; d++) {
      const g = 4 - d, y = Fx[d], E = Mx[d], _ = pi[d], L = bi[d], x = Dx[d], v = Tx[d];
      for (let S = 0; S < 16; S++) {
        const P = Lr(r + Ia(d, o, c, u) + Ir[_[S]] + y, x[S]) + a | 0;
        r = a, a = u, u = Lr(c, 10) | 0, c = o, o = P;
      }
      for (let S = 0; S < 16; S++) {
        const P = Lr(s + Ia(g, i, f, l) + Ir[L[S]] + E, v[S]) + p | 0;
        s = p, p = l, l = Lr(f, 10) | 0, f = i, i = P;
      }
    }
    this.set(this.h1 + c + l | 0, this.h2 + u + p | 0, this.h3 + a + s | 0, this.h4 + r + i | 0, this.h0 + o + f | 0);
  }
  roundClean() {
    Ir.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
Qe(() => new Rx());
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
class sh extends di {
  constructor() {
    super(64, 32, 8, !1), this.A = me[0] | 0, this.B = me[1] | 0, this.C = me[2] | 0, this.D = me[3] | 0, this.E = me[4] | 0, this.F = me[5] | 0, this.G = me[6] | 0, this.H = me[7] | 0;
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
      Se[a] = e.getUint32(n, !1);
    for (let a = 16; a < 64; a++) {
      const p = Se[a - 15], d = Se[a - 2], g = Pt(p, 7) ^ Pt(p, 18) ^ p >>> 3, y = Pt(d, 17) ^ Pt(d, 19) ^ d >>> 10;
      Se[a] = y + Se[a - 7] + g + Se[a - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: f, G: u, H: l } = this;
    for (let a = 0; a < 64; a++) {
      const p = Pt(c, 6) ^ Pt(c, 11) ^ Pt(c, 25), d = l + p + Gx(c, f, u) + Kx[a] + Se[a] | 0, y = (Pt(r, 2) ^ Pt(r, 13) ^ Pt(r, 22)) + Vx(r, s, o) | 0;
      l = u, u = f, f = c, c = i + d | 0, i = o, o = s, s = r, r = d + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, l = l + this.H | 0, this.set(r, s, o, i, c, f, u, l);
  }
  roundClean() {
    Se.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class zx extends sh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
Qe(() => new sh());
Qe(() => new zx());
const Ur = BigInt(2 ** 32 - 1), vo = BigInt(32);
function oh(t, e = !1) {
  return e ? { h: Number(t & Ur), l: Number(t >> vo & Ur) } : { h: Number(t >> vo & Ur) | 0, l: Number(t & Ur) | 0 };
}
function jx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = oh(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const qx = (t, e) => BigInt(t >>> 0) << vo | BigInt(e >>> 0), Wx = (t, e, n) => t >>> n, Xx = (t, e, n) => t << 32 - n | e >>> n, Yx = (t, e, n) => t >>> n | e << 32 - n, Jx = (t, e, n) => t << 32 - n | e >>> n, Zx = (t, e, n) => t << 64 - n | e >>> n - 32, Qx = (t, e, n) => t >>> n - 32 | e << 64 - n, ty = (t, e) => e, ey = (t, e) => t, ny = (t, e, n) => t << n | e >>> 32 - n, ry = (t, e, n) => e << n | t >>> 32 - n, sy = (t, e, n) => e << n - 32 | t >>> 64 - n, oy = (t, e, n) => t << n - 32 | e >>> 64 - n;
function iy(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const cy = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), ay = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, fy = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), hy = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, ly = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), uy = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, K = {
  fromBig: oh,
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
  add3L: cy,
  add3H: ay,
  add4L: fy,
  add4H: hy,
  add5H: uy,
  add5L: ly
}, [dy, py] = K.split([
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
class gs extends di {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: c, Dl: f, Eh: u, El: l, Fh: a, Fl: p, Gh: d, Gl: g, Hh: y, Hl: E } = this;
    return [e, n, r, s, o, i, c, f, u, l, a, p, d, g, y, E];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, f, u, l, a, p, d, g, y, E) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = f | 0, this.Eh = u | 0, this.El = l | 0, this.Fh = a | 0, this.Fl = p | 0, this.Gh = d | 0, this.Gl = g | 0, this.Hh = y | 0, this.Hl = E | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      Ee[x] = e.getUint32(n), Ae[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const v = Ee[x - 15] | 0, S = Ae[x - 15] | 0, P = K.rotrSH(v, S, 1) ^ K.rotrSH(v, S, 8) ^ K.shrSH(v, S, 7), F = K.rotrSL(v, S, 1) ^ K.rotrSL(v, S, 8) ^ K.shrSL(v, S, 7), O = Ee[x - 2] | 0, C = Ae[x - 2] | 0, b = K.rotrSH(O, C, 19) ^ K.rotrBH(O, C, 61) ^ K.shrSH(O, C, 6), A = K.rotrSL(O, C, 19) ^ K.rotrBL(O, C, 61) ^ K.shrSL(O, C, 6), H = K.add4L(F, A, Ae[x - 7], Ae[x - 16]), D = K.add4H(H, P, b, Ee[x - 7], Ee[x - 16]);
      Ee[x] = D | 0, Ae[x] = H | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: c, Cl: f, Dh: u, Dl: l, Eh: a, El: p, Fh: d, Fl: g, Gh: y, Gl: E, Hh: _, Hl: L } = this;
    for (let x = 0; x < 80; x++) {
      const v = K.rotrSH(a, p, 14) ^ K.rotrSH(a, p, 18) ^ K.rotrBH(a, p, 41), S = K.rotrSL(a, p, 14) ^ K.rotrSL(a, p, 18) ^ K.rotrBL(a, p, 41), P = a & d ^ ~a & y, F = p & g ^ ~p & E, O = K.add5L(L, S, F, py[x], Ae[x]), C = K.add5H(O, _, v, P, dy[x], Ee[x]), b = O | 0, A = K.rotrSH(r, s, 28) ^ K.rotrBH(r, s, 34) ^ K.rotrBH(r, s, 39), H = K.rotrSL(r, s, 28) ^ K.rotrBL(r, s, 34) ^ K.rotrBL(r, s, 39), D = r & o ^ r & c ^ o & c, z = s & i ^ s & f ^ i & f;
      _ = y | 0, L = E | 0, y = d | 0, E = g | 0, d = a | 0, g = p | 0, { h: a, l: p } = K.add(u | 0, l | 0, C | 0, b | 0), u = c | 0, l = f | 0, c = o | 0, f = i | 0, o = r | 0, i = s | 0;
      const k = K.add3L(b, H, z);
      r = K.add3H(k, C, A, D), s = k | 0;
    }
    ({ h: r, l: s } = K.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = K.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: c, l: f } = K.add(this.Ch | 0, this.Cl | 0, c | 0, f | 0), { h: u, l } = K.add(this.Dh | 0, this.Dl | 0, u | 0, l | 0), { h: a, l: p } = K.add(this.Eh | 0, this.El | 0, a | 0, p | 0), { h: d, l: g } = K.add(this.Fh | 0, this.Fl | 0, d | 0, g | 0), { h: y, l: E } = K.add(this.Gh | 0, this.Gl | 0, y | 0, E | 0), { h: _, l: L } = K.add(this.Hh | 0, this.Hl | 0, _ | 0, L | 0), this.set(r, s, o, i, c, f, u, l, a, p, d, g, y, E, _, L);
  }
  roundClean() {
    Ee.fill(0), Ae.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class by extends gs {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class gy extends gs {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class xy extends gs {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Qe(() => new gs());
Qe(() => new by());
Qe(() => new gy());
Qe(() => new xy());
function yy(t, e, n) {
  const s = vx;
  if (Cy(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Eo.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var at;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(at || (at = {}));
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
function ih(t) {
  const e = [];
  return e.push(Vn(hi(t.version, 1))), e.push(Vn(t.hash160)), Ln(e);
}
function ch(t) {
  const e = [], n = li(t.content), r = n.byteLength;
  return e.push(Vn(hi(r, t.lengthPrefixBytes))), e.push(n), Ln(e);
}
function Rt(t, e) {
  return Ln([t, e]);
}
function Sy(t) {
  return new Uint8Array([t.type]);
}
function Ey(t) {
  return t.type === at.OptionalNone ? new Uint8Array([t.type]) : Rt(t.type, En(t.value));
}
function Ay(t) {
  const e = new Uint8Array(4);
  return bs(e, t.buffer.length, 0), Rt(t.type, ui(e, t.buffer));
}
function By(t) {
  const e = Zf(mx(t.value, BigInt($x)), Qf);
  return Rt(t.type, e);
}
function vy(t) {
  const e = Zf(t.value, Qf);
  return Rt(t.type, e);
}
function $y(t) {
  return Rt(t.type, ih(t.address));
}
function _y(t) {
  return Rt(t.type, ui(ih(t.address), ch(t.contractName)));
}
function Hy(t) {
  return Rt(t.type, En(t.value));
}
function Ly(t) {
  const e = [], n = new Uint8Array(4);
  bs(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = En(r);
    e.push(s);
  }
  return Rt(t.type, Ln(e));
}
function Iy(t) {
  const e = [], n = new Uint8Array(4);
  bs(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = yy(s);
    e.push(ch(o));
    const i = En(t.data[s]);
    e.push(i);
  }
  return Rt(t.type, Ln(e));
}
function ah(t, e) {
  const n = [], r = e == "ascii" ? Ax(t.data) : li(t.data), s = new Uint8Array(4);
  return bs(s, r.length, 0), n.push(s), n.push(r), Rt(t.type, Ln(n));
}
function Uy(t) {
  return ah(t, "ascii");
}
function Oy(t) {
  return ah(t, "utf8");
}
function En(t) {
  switch (t.type) {
    case at.BoolTrue:
    case at.BoolFalse:
      return Sy(t);
    case at.OptionalNone:
    case at.OptionalSome:
      return Ey(t);
    case at.Buffer:
      return Ay(t);
    case at.UInt:
      return vy(t);
    case at.Int:
      return By(t);
    case at.PrincipalStandard:
      return $y(t);
    case at.PrincipalContract:
      return _y(t);
    case at.ResponseOk:
    case at.ResponseErr:
      return Hy(t);
    case at.List:
      return Ly(t);
    case at.Tuple:
      return Iy(t);
    case at.StringASCII:
      return Uy(t);
    case at.StringUTF8:
      return Oy(t);
    default:
      throw new my("Unable to serialize. Invalid Clarity Value.");
  }
}
const Cy = (t, e) => t ? li(t).length > e : !1;
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var Py = Object.defineProperty, Ny = Object.defineProperties, ky = Object.getOwnPropertyDescriptors, Jr = Object.getOwnPropertySymbols, fh = Object.prototype.hasOwnProperty, hh = Object.prototype.propertyIsEnumerable, Ua = (t, e, n) => e in t ? Py(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, $o = (t, e) => {
  for (var n in e || (e = {})) fh.call(e, n) && Ua(t, n, e[n]);
  if (Jr) for (var n of Jr(e)) hh.call(e, n) && Ua(t, n, e[n]);
  return t;
}, _o = (t, e) => Ny(t, ky(e)), Dy = (t, e) => {
  var n = {};
  for (var r in t) fh.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Jr) for (var r of Jr(t)) e.indexOf(r) < 0 && hh.call(t, r) && (n[r] = t[r]);
  return n;
};
function Ty(t) {
  return t ? typeof t == "string" ? qe.fromName(t) : "version" in t ? t : "url" in t ? new bo({ url: t.url }) : t.transactionVersion === Xr.Mainnet ? new bo({ url: t.client.baseUrl }) : new go({ url: t.client.baseUrl }) : new go();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var Fy = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(Fy || {}), My = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(My || {}), lh = (t) => {
  let e = t;
  if (!e) {
    let n = new X0(["store_write"], document.location.href);
    e = new po({ appConfig: n });
  }
  return e;
};
function Ry(t) {
  try {
    return lh(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Gy = (t) => {
  let e = lh(t).loadUserData().appPrivateKey, n = dt.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function uh(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? _o($o({}, t), { message: ba(e), domain: ba(n) }) : _o($o({}, t), { message: At(En(e)), domain: At(En(n)) });
}
async function Vy(t, e) {
  return new dt.TokenSigner("ES256k", e).signAsync(uh(t));
}
async function Ky(t) {
  let e = t, { userSession: n } = e, r = Dy(e, ["userSession"]);
  if (Ry(n)) {
    let { privateKey: s, publicKey: o } = Gy(n), i = _o($o({}, r), { publicKey: o });
    return Vy(i, s);
  }
  return dt.createUnsecuredToken(uh(t));
}
var zy = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(zy || {}), dh = "asigna-stx", Oa = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === dh && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(qy(t, e), "*");
}), jy = { authenticationRequest: async (t) => Oa(t, "authenticationRequest"), transactionRequest: async (t) => Oa(t, "transactionRequest") }, qy = (t, e) => ({ source: dh, [e]: t }), Wy = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = jy);
};
Wy();
const Xy = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], gi = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), xs = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, Tn = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, Yy = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), ph = (t) => {
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
}, Jy = (t) => t ? ph(xs()).some(
  (e) => {
    var n;
    return e.id === t && (gi(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Zy = () => {
  if (typeof window > "u")
    return;
  const t = xs(), e = ph(t).filter(
    (n) => {
      var r;
      return gi(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Tn(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of Xy) {
    const r = Tn(t, n) ?? (t === window ? void 0 : Tn(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, Qy = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = xs(), n = Tn(e, t) ?? (e === window ? void 0 : Tn(window, t)) ?? Qb(t);
  if (n)
    return n;
  if (gi(t) || Jy(t))
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
const nw = () => Tf(), rw = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = Tf(), e = t ? Qy(t) : void 0;
  if (e)
    return e;
  const n = xs() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, Ca = (t) => K0(t).replace(/^0x/, ""), Pa = "This wallet cannot sign messages. Try Xverse or Leather.", Na = (t) => typeof (t == null ? void 0 : t.request) == "function", ka = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", sw = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, ow = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function iw(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: Ca(e.message),
    domain: Ca(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function cw(t, e) {
  const n = await Ky({
    domain: e.domain,
    message: e.message,
    network: Ty(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function aw(t) {
  var s, o;
  const e = nw() || "", n = /xverse/i.test(e);
  let r = rw();
  if (n && !ka(r)) {
    const i = window;
    r = ((s = i.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((o = i.xverseProviders) == null ? void 0 : o.StacksProvider);
  }
  if (ka(r))
    try {
      return await cw(r, t);
    } catch (i) {
      if (n || !Na(r) || !ow(i)) throw i;
    }
  if (!n && Na(r))
    try {
      return await iw(r, t);
    } catch (i) {
      throw sw(i) ? new Error(Pa) : i;
    }
  throw new Error(Pa);
}
function fw(t, e, n = {}) {
  const r = n.retryAfterMs ?? 3e4, s = n.now ?? Date.now, o = /* @__PURE__ */ new Map(), i = (c, f) => {
    f.pending = !0, f.failedAt = void 0, Promise.resolve().then(() => t(c)).then((u) => {
      f.pending = !1, u && (f.name = u, e());
    }).catch(() => {
      f.pending = !1, f.failedAt = s();
    });
  };
  return {
    get(c) {
      if (!c) return null;
      let f = o.get(c);
      return f ? !f.pending && f.name === null && f.failedAt !== void 0 && s() - f.failedAt >= r && i(c, f) : (f = { name: null, pending: !1 }, o.set(c, f), i(c, f)), f.name;
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
}, gw = {}, Da = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, xw = "xtrata.log.enabled", yw = "xtrata.log.level", ww = "xtrata.log.tags", mw = "xtrata.log.dedupe", Or = (t) => {
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
}, Bw = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, vw = () => {
  const t = gw ?? {}, e = Or(xw) ?? t.VITE_LOG_ENABLED, n = Or(yw) ?? t.VITE_LOG_LEVEL, r = Or(ww) ?? t.VITE_LOG_TAGS, s = Or(mw) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: Sw(e),
    level: Ew(n) ?? "warn",
    tags: Bw(r),
    dedupe: Aw(s)
  };
}, $w = (t, e, n) => !t.enabled || Da[n] < Da[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), _w = (t, e, n, r) => {
  const s = vw();
  if (!$w(s, e, t) || Lw(s.dedupe))
    return;
  const o = `[xtrata:${e}] ${n}`, i = console[t] ?? console.log;
  r !== void 0 ? i(o, r) : i(o);
}, Hw = /* @__PURE__ */ new Set();
let Ta = null;
const Lw = (t, e, n, r, s) => (Ta !== t && (Hw.clear(), Ta = t), !1), Iw = (t, e, n) => _w("debug", t, e, n), Uw = {}, Ow = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, Cw = (t) => {
  const e = Uw, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : Ow[t];
}, Pw = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, Nw = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return Pw.test(n) ? n : null;
}, kw = (t) => t.replace(/\/+$/, ""), Dw = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), Fa = (t) => {
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
}, cn = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, Tw = (t) => {
  var f, u;
  let e;
  try {
    e = an(l1(t));
  } catch {
    return null;
  }
  const n = cn(e);
  if (!n || n.success === !1)
    return null;
  const r = cn(n.value), s = cn(r == null ? void 0 : r.value), o = cn(s == null ? void 0 : s.value);
  if (!o)
    return null;
  const i = Fa((f = cn(o.name)) == null ? void 0 : f.value), c = Fa((u = cn(o.namespace)) == null ? void 0 : u.value);
  return !i || !c ? null : Nw(`${i}.${c}`);
}, Fw = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${kw(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [K0(Pd(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const o = await s.json();
  return !(o != null && o.okay) || typeof o.result != "string" ? null : Tw(o.result);
}, Mw = async (t) => {
  const e = t.address.trim();
  if (!u1(e))
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
  domain: T0({
    name: kr(Rw),
    version: kr("1"),
    "chain-id": D0(Vw(t.network))
  }),
  message: kr(Kw(t))
}), Cr = (t) => !!t && typeof t.request == "function", jw = () => {
  try {
    const t = window.top;
    if (t && t !== window.self && t.location.origin === window.location.origin) return t;
  } catch {
  }
  return window;
}, qw = () => {
  const t = jw();
  return t === window ? [window] : [t, window];
}, Ma = (t) => {
  for (const e of qw()) {
    const n = t(e);
    if (n) return n;
  }
  return null;
}, Ww = (t) => {
  if (t === "leather") {
    const n = Ma((r) => Cr(r.LeatherProvider) ? r.LeatherProvider : null);
    return n ? { rpc: n } : null;
  }
  const e = Ma((n) => {
    const r = n.XverseProviders || n.xverseProviders;
    return r && (Cr(r.BitcoinProvider) || Cr(r.StacksProvider)) ? r : null;
  });
  return e ? { rpc: Cr(e.BitcoinProvider) ? e.BitcoinProvider : e.StacksProvider } : null;
}, Xw = (t, e) => new Promise((n) => {
  const r = Date.now();
  (function s() {
    const o = Ww(t);
    o || Date.now() - r >= e ? n(o) : window.setTimeout(s, 150);
  })();
}), Zr = (t) => {
  var e;
  return (t == null ? void 0 : t.code) ?? ((e = t == null ? void 0 : t.error) == null ? void 0 : e.code);
}, Re = (t) => {
  var e;
  return String((t == null ? void 0 : t.message) ?? ((e = t == null ? void 0 : t.error) == null ? void 0 : e.message) ?? t ?? "unknown error");
}, Yw = (t) => [4001, -31001].includes(Number(Zr(t))) || /cancel|denied|reject|declin|closed/i.test(Re(t)), Ra = (t) => Number(Zr(t)) === -32601 || /not supported|method not found|unsupported|not implemented|legacy method/i.test(Re(t)), qs = async (t, e, n) => {
  const r = n === void 0 ? await t.request(e) : await t.request(e, n);
  if (r && typeof r == "object") {
    if (r.error) throw Object.assign(new Error(Re(r.error)), { code: Zr(r.error) });
    if (r.status === "error") throw Object.assign(new Error(Re(r.error || r)), { code: Zr(r.error || r) });
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
}), Zw = (t) => (JSON.stringify(t) || "").match(/S[PT][0-9A-HJKMNP-TV-Z]{38,39}/g) || [], Be = [];
async function Qw(t) {
  const e = await Xw(t, 1500);
  if (!e) throw new Error(`${t === "leather" ? "Leather" : "Xverse"} was not found in this browser.`);
  Be.length = 0;
  let n;
  if (t === "xverse") {
    try {
      await qs(e.rpc, "wallet_disconnect"), Be.push("wallet_disconnect: ok");
    } catch (s) {
      Be.push("wallet_disconnect: " + Re(s).slice(0, 80));
    }
    n = ["wallet_connect", "wallet_getAccount"];
  } else
    n = ["getAddresses", "stx_getAccounts", "stx_getAddresses", "stx_requestAccounts"];
  let r = null;
  for (const s of n)
    try {
      const o = await (t === "xverse" ? Jw(qs(e.rpc, s)) : qs(e.rpc, s)), i = Zw(o);
      if (i.length) {
        const c = i[0];
        return Be.push(`${s}: ok`), { kind: t, address: c, network: c.startsWith("SP") ? "mainnet" : "testnet", via: s };
      }
      Be.push(`${s}: answered but no Stacks address in it`);
    } catch (o) {
      if (Yw(o))
        throw Be.push(`${s}: cancelled`), new Error("Connection cancelled.");
      Be.push(`${s}: ${Ra(o) ? "not supported" : Re(o).slice(0, 80)}`), Ra(o) || (r = o);
    }
  throw new Error(r ? Re(r) : "The wallet did not share a Stacks address.");
}
const t3 = (t) => tg(t === "leather" ? "LeatherProvider" : "XverseProviders.BitcoinProvider"), bh = (t) => t instanceof Error ? t.message : String(t), Ga = 200, gh = 40, e3 = 2e3, Qr = 280, n3 = 5 * 6e4, Va = "px_room_blocks_v1", Ka = "px_chat_ui_v1", za = { hidden: !1, side: "left" }, r3 = [
  { code: "spam", label: "Spam" },
  { code: "abuse", label: "Abuse" },
  { code: "scam", label: "Scam" },
  { code: "other", label: "Something else" }
], s3 = (t) => {
  if (!Array.isArray(t)) return [];
  const e = [];
  for (const n of t)
    if (!(typeof n != "string" || !/^S[A-Z0-9]{19,60}$/.test(n) || e.includes(n)) && (e.push(n), e.length >= gh))
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
  if (!t) return { ...za };
  try {
    const e = JSON.parse(t);
    return { hidden: (e == null ? void 0 : e.hidden) === !0, side: (e == null ? void 0 : e.side) === "right" ? "right" : "left" };
  } catch {
    return { ...za };
  }
}, xh = {
  "no-links": "Links are not allowed in messages.",
  "too-long": `That message is too long (${Qr} characters at most).`,
  empty: "Type something first.",
  "bad-message": "That message could not be sent.",
  "slow-down": "Slow down a little: one message every two seconds.",
  "sign-in-first": "Join the room first to chat.",
  blocked: "You have blocked this person.",
  "not-you": "You cannot do that to yourself.",
  "too-many-blocks": "Your block list is full (40 people).",
  "rate-limited": "You are sending too much. Wait a moment."
}, c3 = (t) => typeof t == "string" && Object.prototype.hasOwnProperty.call(xh, t), Ws = (t) => xh[String(t)] ?? "The room could not take that. Try again in a moment.", a3 = (t) => t.replace(/\s+/g, " ").trim(), f3 = (t) => Array.from(t).length, h3 = (t, e) => {
  const n = a3(t);
  return e.signed ? e.connected ? n ? f3(n) > Qr ? { ok: !1, code: "too-long" } : e.now - e.lastSentAt < e3 ? { ok: !1, code: "slow-down" } : { ok: !0, text: n } : { ok: !1, code: "empty" } : { ok: !1, code: "offline" } : { ok: !1, code: "sign-in-first" };
};
class l3 {
  constructor() {
    fr(this, "lines", []);
    fr(this, "seq", 0);
    fr(this, "blocked", /* @__PURE__ */ new Set());
  }
  setBlocked(e) {
    this.blocked = new Set(e);
  }
  add(e, n, r, s) {
    if (e && !r && this.blocked.has(e.a)) return null;
    const o = { id: this.seq += 1, who: e, mine: r, text: n, at: s };
    return this.lines.push(o), this.lines.length > Ga && this.lines.splice(0, this.lines.length - Ga), o;
  }
  /** Blocking someone takes what they already said off the screen too. */
  dropFrom(e) {
    this.lines = this.lines.filter((n) => {
      var r;
      return ((r = n.who) == null ? void 0 : r.a) !== e;
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
      if (o <= n.holdMs) {
        r.push({ line: s, opacity: 1 });
        continue;
      }
      const i = 1 - (o - n.holdMs) / n.fadeMs;
      i > 0 && r.push({ line: s, opacity: Math.round(i * 100) / 100 });
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
const u3 = `
#pxchat{position:fixed;z-index:11;top:110px;width:min(330px,calc(100vw - 28px));display:flex;flex-direction:column;gap:6px;pointer-events:none;color:var(--ink,#f6ead0);font-size:13px;line-height:1.35}
#pxchat.left{left:14px;align-items:flex-start}
#pxchat.right{right:14px;align-items:flex-end;text-align:right}
#pxchat[hidden]{display:none}
#pxchat-lines{display:flex;flex-direction:column;gap:3px;max-width:100%}
#pxchat .ln{transition:opacity .6s linear;overflow-wrap:anywhere;text-shadow:0 1px 2px #000,0 0 7px rgba(0,0,0,.9),0 0 14px rgba(0,0,0,.6)}
#pxchat .ln .tx{color:#fff}
#pxchat .ln.mine .nm{color:#9fd7b0}
#pxchat .ln.note{font-style:italic;color:var(--dim,#c9b894)}
#pxchat .nm{all:unset;cursor:pointer;pointer-events:auto;color:var(--gold,#e3b84a);font-weight:700;margin-right:6px}
#pxchat .nm:hover,#pxchat .nm:focus-visible{text-decoration:underline}
#pxchat span.nm{cursor:default;pointer-events:none}
#pxchat .bar{display:flex;flex-wrap:wrap;gap:6px;pointer-events:auto;max-width:100%}
#pxchat .bar[hidden],#pxchat form[hidden],#pxchat .panel[hidden]{display:none}
#pxchat button.sm{font:inherit;font-size:12px;cursor:pointer;padding:5px 9px;border-radius:7px;background:rgba(12,9,14,.82);color:var(--ink,#f6ead0);border:1px solid rgba(227,184,74,.55)}
#pxchat button.sm:hover{background:rgba(227,184,74,.22)}
#pxchat button.sm.danger{border-color:#ff8a8a;color:#ffb3b3}
#pxchat form{display:flex;gap:6px;pointer-events:auto;width:100%}
#pxchat input{flex:1 1 auto;min-width:0;font:inherit;font-size:16px;padding:7px 10px;border-radius:8px;background:rgba(12,9,14,.88);color:#fff;border:1px solid var(--gold,#e3b84a);outline:none}
#pxchat input:focus{box-shadow:0 0 0 2px rgba(227,184,74,.35)}
#pxchat .panel{pointer-events:auto;padding:8px 10px;border-radius:10px;background:rgba(12,9,14,.92);border:1px solid rgba(227,184,74,.55);max-width:100%;text-align:left}
#pxchat .panel p{margin:0 0 6px;color:var(--dim,#c9b894);font-size:12px}
#pxchat .panel .row{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px}
#pxchat .panel .row:last-child{margin-bottom:0}
#pxchat-btn .dot{display:inline-block;min-width:16px;padding:0 4px;margin-left:6px;border-radius:9px;background:#e3b84a;color:#1a1208;font-size:11px;font-weight:700;text-align:center}
@media (max-width:700px){#pxchat{font-size:12px;width:min(300px,calc(100vw - 24px))}}
@media (prefers-reduced-motion:reduce){#pxchat .ln{transition:none}}
`, d3 = 14e3, p3 = 4e3, Y = (t, e, n) => {
  const r = document.createElement(t);
  return e !== void 0 && (r.textContent = e), n && (r.className = n), r;
};
function b3(t) {
  const e = new l3();
  let n = { hidden: !1, side: "left" }, r = [];
  try {
    n = i3(window.localStorage.getItem(Ka)), r = o3(window.localStorage.getItem(Va));
  } catch {
  }
  e.setBlocked(r);
  let s = !1, o = null, i = !1, c = !1, f = 0, u = 0, l = "", a = 0;
  const p = () => {
    try {
      window.localStorage.setItem(Ka, JSON.stringify(n));
    } catch {
    }
  }, d = () => {
    try {
      window.localStorage.setItem(Va, JSON.stringify(r));
    } catch {
    }
  }, g = document.createElement("style");
  g.textContent = u3, document.head.append(g);
  const y = Y("div");
  y.id = "pxchat";
  const E = Y("div");
  E.id = "pxchat-lines", E.setAttribute("role", "log"), E.setAttribute("aria-live", "polite"), E.setAttribute("aria-label", "Casino chat");
  const _ = Y("div", void 0, "panel");
  _.hidden = !0;
  const L = Y("div", void 0, "panel");
  L.hidden = !0;
  const x = Y("form");
  x.hidden = !0;
  const v = Y("input");
  v.type = "text", v.autocomplete = "off", v.enterKeyHint = "send", v.maxLength = Qr * 2, v.setAttribute("aria-label", "Say something to the room"), v.placeholder = "Say something to the room";
  const S = Y("button", "Send", "sm");
  S.type = "submit", x.append(v, S);
  const P = Y("div", void 0, "bar");
  P.hidden = !0;
  const F = Y("button", "Hide chat", "sm");
  F.type = "button";
  const O = Y("button", void 0, "sm");
  O.type = "button";
  const C = Y("button", void 0, "sm");
  C.type = "button", P.append(F, O, C), y.append(E, _, L, x, P);
  const b = Y("button");
  b.id = "pxchat-btn", b.type = "button", b.setAttribute("aria-controls", "pxchat");
  const A = (U, W) => t.labelFor(U), H = /* @__PURE__ */ new Map(), D = () => s || !!o || c, z = () => {
    var U;
    return (U = window.matchMedia) != null && U.call(window, "(max-width:700px)").matches ? 5 : 8;
  }, k = (U) => {
    const W = Y("div", void 0, U.who ? U.mine ? "ln mine" : "ln" : "ln note");
    if (U.who) {
      let Z;
      if (U.mine) Z = Y("span", "You", "nm");
      else {
        const Q = Y("button", A(U.who.a), "nm");
        Q.type = "button", Q.dataset.a = U.who.a, Q.setAttribute("aria-label", `Options for ${A(U.who.a)}`), Q.onclick = () => ys(U.who), Z = Q;
      }
      W.append(Z, Y("span", U.text, "tx"));
    } else W.append(Y("span", U.text, "tx"));
    return W;
  }, Gt = () => {
    const U = Date.now(), W = e.visible(U, { max: z(), holdMs: d3, fadeMs: p3, pinned: D() }), Z = new Set(W.map((ft) => ft.line.id));
    for (const [ft, st] of H) Z.has(ft) || (st.remove(), H.delete(ft));
    let Q = null;
    for (const ft of W) {
      let st = H.get(ft.line.id);
      st || (st = k(ft.line), H.set(ft.line.id, st)), (Q ? Q.nextElementSibling !== st : E.firstElementChild !== st) && E.insertBefore(st, Q ? Q.nextElementSibling : E.firstChild), st.style.opacity = String(ft.opacity), Q = st;
    }
  }, Qt = () => {
    b.replaceChildren(document.createTextNode("Chat")), n.hidden && f > 0 && b.append(Y("span", f > 9 ? "9+" : String(f), "dot"));
    const U = s && !n.hidden;
    b.setAttribute("aria-expanded", String(U)), b.setAttribute("aria-label", n.hidden && f ? `Chat: ${f} new` : "Casino chat: type a message");
  }, Pe = () => {
    if (_.replaceChildren(), _.hidden = !o, !o) return;
    const U = o, W = A(U.a), Z = r.includes(U.a);
    _.append(Y("p", W));
    const Q = Y("div", void 0, "row");
    if (i) {
      _.append(Y("p", "Why? Your report goes to the casino team with what they last said."));
      for (const st of r3) {
        const Vt = Y("button", st.label, "sm");
        Vt.type = "button", Vt.onclick = () => {
          ws(U, st.code), Un();
        }, Q.append(Vt);
      }
    } else {
      const st = Y("button", Z ? "Unblock" : "Block", "sm");
      st.type = "button", st.onclick = () => {
        er(U, !Z), Un();
      };
      const Vt = Y("button", "Report…", "sm danger");
      Vt.type = "button", Vt.onclick = () => {
        i = !0, Pe();
      }, Q.append(st, Vt);
    }
    const ft = Y("button", "Cancel", "sm");
    ft.type = "button", ft.onclick = Un, Q.append(ft), _.append(Q);
  }, nt = () => {
    if (L.replaceChildren(), L.hidden = !c, !!c) {
      if (!r.length) {
        L.append(Y("p", "You have not blocked anyone."));
        return;
      }
      L.append(Y("p", "Blocked people cannot reach you and you cannot reach them."));
      for (const U of r) {
        const W = Y("div", void 0, "row");
        W.append(Y("span", t.labelFor(U)));
        const Z = Y("button", "Unblock", "sm");
        Z.type = "button", Z.onclick = () => {
          er({ a: U }, !1), nt(), T();
        }, W.append(Z), L.append(W);
      }
    }
  }, T = () => {
    y.hidden = n.hidden, y.className = n.side, x.hidden = !s || n.hidden, P.hidden = !s || n.hidden, O.textContent = n.side === "left" ? "Move to right ▸" : "◂ Move to left", C.textContent = r.length ? `Blocked (${r.length})` : "Blocked", Qt(), Pe(), nt(), Gt(), Jn(), Zn();
  }, Jn = () => {
    const U = document.getElementById("tools"), W = U ? U.getBoundingClientRect().bottom : 70;
    y.style.top = `${Math.round(Math.max(70, W + 12))}px`;
  }, Zn = () => {
    window.clearTimeout(a), !(n.hidden || document.hidden) && (H.size || D()) && (a = window.setTimeout(() => {
      Gt(), Zn();
    }, 500));
  }, rt = (U) => {
    e.add(null, U, !1, Date.now());
  }, Qn = () => {
    if (!t.me()) {
      n.hidden = !1, p(), s = !1, rt("Join the room to chat. Anyone can watch; you need one free signature to speak."), T(), t.joinPrompt();
      return;
    }
    n.hidden && (n.hidden = !1, p(), f = 0), s = !0;
    try {
      document.pointerLockElement && document.exitPointerLock();
    } catch {
    }
    T(), v.focus();
  }, In = () => {
    s = !1, o = null, i = !1, c = !1, v.blur(), T();
  }, Un = () => {
    o = null, i = !1, T();
  };
  function ys(U) {
    o = U, i = !1, c = !1, T();
  }
  const tr = () => {
    t.me() && t.send({ t: "blocks", list: r });
  };
  function er(U, W) {
    const Z = t.labelFor(U.a);
    if (W) {
      if (r.length >= gh) {
        rt(Ws("too-many-blocks"));
        return;
      }
      r.includes(U.a) || r.push(U.a), e.dropFrom(U.a), rt(`You blocked ${Z}. Neither of you will see the other's messages.`);
    } else
      r = r.filter((Q) => Q !== U.a), rt(`You unblocked ${Z}.`);
    e.setBlocked(r), H.forEach((Q) => Q.remove()), H.clear(), d(), tr();
  }
  function ws(U, W) {
    if (!t.me() || !t.connected()) {
      rt("Not connected to the room, so the report was not sent.");
      return;
    }
    t.send({ t: "report", who: U.a, why: W, lines: e.lastFrom(U.a) }), rt("Sending your report…");
  }
  b.onclick = () => {
    s && !n.hidden ? In() : Qn();
  }, F.onclick = () => {
    n.hidden = !0, p(), s = !1, o = null, c = !1, f = 0, v.blur(), T();
  }, O.onclick = () => {
    n.side = n.side === "left" ? "right" : "left", p(), T();
  }, C.onclick = () => {
    c = !c, o = null, i = !1, T();
  }, x.onsubmit = (U) => {
    U.preventDefault();
    const W = Date.now(), Z = h3(v.value, { signed: !!t.me(), connected: t.connected(), now: W, lastSentAt: u });
    if (!Z.ok) {
      rt(Z.code === "offline" ? "Not connected to the room yet. Your message is still in the box." : Ws(Z.code)), T();
      return;
    }
    if (!t.send({ t: "say", text: Z.text })) {
      rt("Not connected to the room yet. Your message is still in the box."), T();
      return;
    }
    u = W, l = Z.text, v.value = "";
  }, v.addEventListener("keydown", (U) => {
    U.stopPropagation(), U.key === "Escape" && (U.preventDefault(), In());
  }), v.addEventListener("keypress", (U) => U.stopPropagation()), document.addEventListener("pointerdown", (U) => {
    if (!o && !c) return;
    const W = U.target;
    W && (y.contains(W) || b.contains(W)) || (o = null, i = !1, c = !1, T());
  }), window.addEventListener("resize", Jn), document.addEventListener("visibilitychange", () => {
    document.hidden || T();
  });
  const nr = {
    button: b,
    mount(U) {
      U.append(y), T();
    },
    /** Someone spoke in the room (the room sends our own line back too, so our screen shows exactly what everyone got). */
    heard(U) {
      const W = t.me(), Z = !!W && U.from.a === W;
      e.add(U.from, String(U.text ?? "").slice(0, Qr * 2), Z, Date.now()) && (Z ? l = "" : n.hidden && (f += 1), T());
    },
    /** The room refused something. A refused message goes back into the box so nothing typed is lost. */
    failed(U) {
      l && !v.value && (v.value = l), l = "", rt(Ws(U)), T();
    },
    reported() {
      rt("Report sent. Thank you."), T();
    },
    /** A fresh connection: the room has forgotten our block list, so hand it over again. */
    connectedAgain() {
      tr();
    },
    /** Names learned from BNS arrive late; relabel what is already on screen. */
    refreshNames() {
      E.querySelectorAll("button.nm[data-a]").forEach((U) => {
        U.textContent = t.labelFor(U.dataset.a);
      });
    },
    /** Leaving the room, or the session ending: nobody to talk as any more. */
    signedOut() {
      s = !1, o = null, i = !1, c = !1, v.value = "", l = "", T();
    },
    isTyping: () => s,
    debug: () => ({ typing: s, hidden: n.hidden, side: n.side, blocks: [...r], lines: e.size, shown: H.size })
  };
  return Qt(), nr;
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
let tt = null;
const g3 = (t) => t.length <= 12 ? t : `${t.slice(0, 5)}…${t.slice(-4)}`, x3 = (t) => {
  if (t.startsWith("SP")) return t;
  const e = qo(t);
  return no({ ...e, version: Js.MainnetSingleSig });
}, y3 = fw((t) => Mw({ address: x3(t), network: "mainnet" }), () => {
  ts(), tt == null || tt.refreshNames();
}), xi = (t) => {
  let e = null;
  try {
    e = y3.get(t);
  } catch {
  }
  return e || g3(t);
}, ts = () => {
  var n;
  if (!m.host || m.service !== "ok") return;
  const t = ((n = m.you) == null ? void 0 : n.a) ?? null, e = Object.entries(m.spots).filter(([, r]) => r.a !== t).map(([r, s]) => ({ key: s.a, spot: r, label: xi(s.a), since: s.since }));
  try {
    m.host.setPeople(e);
  } catch (r) {
    console.warn("[room] the page could not draw the people", r);
  }
}, es = async (t, e) => {
  const n = await fetch(t, { credentials: "same-origin", ...e });
  let r = null;
  try {
    r = await n.json();
  } catch {
  }
  return { res: n, body: r };
}, Ho = (t) => {
  var e;
  return ((e = m.ws) == null ? void 0 : e.readyState) !== WebSocket.OPEN ? !1 : (m.ws.send(JSON.stringify(t)), m.lastSent = Date.now(), !0);
}, yh = () => {
  var e;
  if (m.service !== "ok" || !m.connected || !m.you || m.you.guest || !m.signed) return;
  const t = ((e = Object.entries(m.spots).find(([, n]) => n.a === m.you.a)) == null ? void 0 : e[0]) ?? null;
  m.want ? t !== m.want && m.want !== m.badSpot && !m.spots[m.want] && Date.now() - m.lastSent > 1200 && Ho({ t: "sit", spot: m.want }) : t && Date.now() - m.lastSent > 600 && Ho({ t: "stand" });
}, yi = () => {
  if (m.service !== "ok" || m.ws) return;
  m.attempts += 1;
  let t;
  try {
    t = new WebSocket(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/casino/room/ws`);
  } catch {
    return ja();
  }
  m.ws = t, t.onopen = () => {
    m.connected = !0, m.attempts = 0, gt();
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
        m.you = n.you, m.spots = n.spots || {}, m.joined = n.joined, m.guests = n.guests, m.signed && ((r = m.you) != null && r.guest) && (m.signed = null), m.you && !m.you.guest ? tt == null || tt.connectedAgain() : tt == null || tt.signedOut();
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
        tt == null || tt.heard(n);
        return;
      case "reported":
        tt == null || tt.reported();
        return;
      case "err":
        n.code === "no-such-spot" ? m.badSpot = m.want : c3(n.code) && (tt == null || tt.failed(n.code));
        return;
      default:
        return;
    }
    ts(), yh(), gt();
  }, t.onclose = (e) => {
    if (m.ws === t) {
      if (m.ws = null, m.connected = !1, m.spots = {}, ts(), e.code === 4001) {
        m.replaced = !0, gt();
        return;
      }
      gt(), ja();
    }
  }, t.onerror = () => {
  };
}, ja = () => {
  window.clearTimeout(m.retryTimer);
  const t = Math.min(15e3, 1e3 * 2 ** Math.min(m.attempts, 4));
  m.retryTimer = window.setTimeout(() => {
    m.ws || yi();
  }, t);
}, wi = () => {
  const t = m.ws;
  m.ws = null, m.connected = !1, m.attempts = 0, m.replaced = !1;
  try {
    t == null || t.close(1e3, "client");
  } catch {
  }
  yi();
};
async function w3(t) {
  const { res: e, body: n } = await es(`/casino/room/challenge?address=${encodeURIComponent(t.address)}`);
  if (!e.ok) throw new Error((n == null ? void 0 : n.error) || `The room answered ${e.status}.`);
  const r = n.challenge, { domain: s, message: o } = zw(r);
  m.busy = "sign", gt();
  let i;
  try {
    i = await aw({ domain: s, message: o, network: r.network, stxAddress: t.address });
  } catch (u) {
    throw new Error("The wallet did not sign: " + bh(u));
  }
  const { res: c, body: f } = await es("/casino/room/session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ challenge: r, signature: i })
  });
  if (!c.ok) throw new Error((f == null ? void 0 : f.error) || `The room answered ${c.status}.`);
  m.signed = { address: f.address, hash160: f.hash160, expiresAt: f.expiresAt }, wi();
}
async function m3(t) {
  if (!m.busy) {
    m.error = "", m.busy = "connect", gt();
    try {
      m.wallet = await Qw(t), t3(t), await w3(m.wallet), m.open = !1;
    } catch (e) {
      m.error = bh(e);
    } finally {
      m.busy = "", gt();
    }
  }
}
async function S3() {
  try {
    await es("/casino/room/session", { method: "DELETE" });
  } catch {
  }
  m.signed = null, m.wallet = null, m.error = "", tt == null || tt.signedOut(), wi(), gt();
}
const E3 = `
#pxroom{position:relative;display:inline-block}
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
}, Te = (t, e) => {
  const n = ot("p", void 0, "fact");
  return n.append(ot("b", t), document.createTextNode(` ${e}`)), n;
};
let ve = null, Et = null, kt = null;
function A3() {
  var n, r;
  if (ve || m.service !== "ok") return;
  const t = document.createElement("style");
  t.textContent = E3, document.head.append(t), ve = ot("span"), ve.id = "pxroom", Et = ot("button"), Et.id = "pxroom-btn", Et.type = "button", Et.setAttribute("aria-label", "Casino room: see who is here and join"), Et.onclick = () => {
    m.open = !m.open, gt();
  }, kt = ot("div"), kt.id = "pxroom-panel", kt.hidden = !0, tt = b3({
    send: Ho,
    me: () => m.you && !m.you.guest ? m.you.a : null,
    connected: () => m.connected,
    labelFor: xi,
    joinPrompt: () => {
      m.open = !0, gt();
    }
  }), ve.append(Et, tt.button);
  const e = ((r = (n = m.host) == null ? void 0 : n.mount) == null ? void 0 : r.call(n)) ?? document.querySelector("#tools .rt");
  e ? e.insertBefore(ve, e.firstChild) : (ve.style.cssText = "position:fixed;top:10px;right:10px;z-index:30", document.body.append(ve)), document.body.append(kt), tt.mount(document.body), document.addEventListener("keydown", (s) => {
    s.key === "Escape" && m.open && (m.open = !1, gt());
  }), document.addEventListener("pointerdown", (s) => {
    if (!m.open) return;
    const o = s.target;
    o && (kt.contains(o) || Et.contains(o)) || (m.open = !1, gt());
  }), window.addEventListener("resize", () => {
    m.open && wh();
  });
}
function wh() {
  if (!Et || !kt) return;
  const t = Et.getBoundingClientRect(), e = t.height ? Math.round(t.bottom + 8) : 64;
  kt.style.top = `${Math.min(e, Math.max(64, window.innerHeight - 220))}px`;
}
function gt() {
  if (!ve || !Et || !kt) return;
  const t = !!(m.signed && m.you && !m.you.guest);
  Et.className = m.connected ? "live" : "wait";
  const e = m.connected ? ` · ${m.joined}` : "";
  if (Et.replaceChildren(ot("i"), document.createTextNode(t ? `In the room${e}` : `Room${e}`)), kt.hidden = !m.open, !m.open) return;
  wh();
  const n = [];
  if (m.replaced) {
    n.push(ot("h3", "Room"), ot("p", "Another tab of yours took over the room. You are not connected here."));
    const r = ot("button", "Use this tab instead");
    r.onclick = () => {
      wi(), gt();
    }, n.push(r);
  } else if (t) {
    n.push(ot("h3", "You are in the room")), n.push(ot("p", "Others see you at your seat as"), ot("p", xi(m.signed.address), "who")), n.push(ot("p", `${m.joined} signed in, ${m.guests} watching.`)), n.push(Te("Be seen", "Sit at a table or connect to a machine and your Adrian and name tag appear there for everyone in the room. Stand up or walk away and they go too.")), n.push(Te("Spaces", "Each seat and machine holds one person. If someone already has the seat you choose, you are given a free one at the same table.")), n.push(Te("Live chat", "Chat and direct messages are on the room test page for now. They are not on the casino floor yet.")), n.push(ot("p", "Nothing here moves any money.", "fact"));
    const r = ot("button", "Leave the room");
    r.onclick = () => {
      S3();
    }, n.push(r);
  } else {
    n.push(ot("h3", "Join the room")), n.push(ot("p", m.connected ? `You are watching: ${m.joined} signed in, ${m.guests} watching.` : "Connecting to the room…")), n.push(Te("Be seen", "Join, then sit at a table or connect to a machine. Everyone in the room sees your Adrian there, with a name tag (your BNS name, or a short version of your address). Watching alone shows you to nobody.")), n.push(Te("Spaces", "Each seat and machine holds one person. If someone already has the seat you choose, you are given a free one at the same table.")), n.push(Te("Live chat", "Chat and direct messages are for signed-in players and are on the room test page for now. They are not on the casino floor yet.")), n.push(Te("Free", "One signature. It sends no transaction, costs no fee and gives no permission to spend anything."));
    const r = ot("div", void 0, "row");
    for (const s of ["leather", "xverse"]) {
      const o = ot("button", m.busy ? m.busy === "sign" ? "Check your wallet…" : "Connecting…" : s === "leather" ? "Leather" : "Xverse");
      if (o.disabled = !!m.busy || !m.connected, o.onclick = () => {
        m3(s);
      }, r.append(o), m.busy) break;
    }
    n.push(r), m.error && n.push(ot("p", m.error, "err"));
  }
  kt.replaceChildren(...n);
}
const B3 = () => {
  var e;
  const t = ((e = m.host) == null ? void 0 : e.currentSpot()) ?? null;
  t !== m.want && (m.want = t, ts()), yh();
};
async function v3() {
  try {
    const { res: t, body: e } = await es("/casino/room/session");
    if (t.status === 503) return;
    t.ok && (e != null && e.address) && (m.signed = { address: e.address, hash160: e.hash160, expiresAt: e.expiresAt }), m.service = "ok";
  } catch {
    return;
  }
  A3(), gt(), yi(), window.setInterval(B3, 250);
}
const qa = (t) => {
  m.host || (m.host = t, v3());
}, Wa = window.PXRoomHost;
Wa ? qa(Wa) : window.addEventListener("px-room-host", () => qa(window.PXRoomHost), { once: !0 });
window.__pxRoom = {
  get state() {
    var t;
    return { service: m.service, signed: ((t = m.signed) == null ? void 0 : t.address) ?? null, connected: m.connected, you: m.you, spots: m.spots, joined: m.joined, guests: m.guests, want: m.want, trail: Be.slice() };
  }
};
