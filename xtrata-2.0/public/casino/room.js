function oi(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = tn(r);
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
      const r = Sl(BigInt(`0x${Mt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Mt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function ci(t, e = 8) {
  return (typeof t == "bigint" ? t : oi(t, !1)).toString(16).padStart(e * 2, "0");
}
function La(t) {
  return parseInt(t, 16);
}
function Ia(t, e = 16) {
  const n = ci(t, e);
  return tn(n);
}
function wl(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function ml(t, e) {
  return t & BigInt(1) << e;
}
function Sl(t, e) {
  return ml(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const El = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Mt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += El[n];
  return e;
}
function tn(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t;
  const e = t.length % 2 ? `0${t}` : t, n = new Uint8Array(e.length / 2);
  for (let r = 0; r < n.length; r++) {
    const s = r * 2, i = e.slice(s, s + 2), o = Number.parseInt(i, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    n[r] = o;
  }
  return n;
}
function On(t) {
  return new TextEncoder().encode(t);
}
function Ua(t) {
  return new TextDecoder().decode(t);
}
function Oa(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Al(t) {
  return String.fromCharCode.apply(null, t);
}
function Bl(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Eo(t) {
  if (t.some(Bl))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function ai(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, s) => r + s.length, 0), n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function un(t) {
  return ai(...t.map((e) => typeof e == "number" ? Eo([e]) : e instanceof Array ? Eo(e) : e));
}
function $l(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function vl(t, e) {
  return t[e];
}
function _l(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function kr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Hs;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Hs || (Hs = {}));
Hs.Mainnet;
const Hl = 128, Ll = 128, Ca = 16;
var _n;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(_n || (_n = {}));
var Ao;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ao || (Ao = {}));
var Bo;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Bo || (Bo = {}));
var gt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(gt || (gt = {}));
const hs = ["onChainOnly", "offChainOnly", "any"];
hs[0] + "", gt.OnChainOnly, hs[1] + "", gt.OffChainOnly, hs[2] + "", gt.Any, gt.OnChainOnly + "", gt.OnChainOnly, gt.OffChainOnly + "", gt.OffChainOnly, gt.Any + "", gt.Any;
var Ls;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ls || (Ls = {}));
Ls.Mainnet;
var $o;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})($o || ($o = {}));
var vo;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(vo || (vo = {}));
var _o;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(_o || (_o = {}));
var Ho;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Ho || (Ho = {}));
var Is;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Is || (Is = {}));
var Lo;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Lo || (Lo = {}));
var Io;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Io || (Io = {}));
var Uo;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Uo || (Uo = {}));
var Oo;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Oo || (Oo = {}));
var Co;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Co || (Co = {}));
var Po;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Po || (Po = {}));
function Us(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Il(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Pa(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Ul(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Us(t.outputLen), Us(t.blockLen);
}
function Ol(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Cl(t, e) {
  Pa(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ls = {
  number: Us,
  bool: Il,
  bytes: Pa,
  hash: Ul,
  exists: Ol,
  output: Cl
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const us = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), St = (t, e) => t << 32 - e | t >>> e, Pl = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Pl)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Nl(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Na(t) {
  if (typeof t == "string" && (t = Nl(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Dl = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function De(t) {
  const e = (r) => t().update(Na(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function kl(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, o, r), t.setUint32(e + u, c, r);
}
let fi = class extends Dl {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = us(this.buffer);
  }
  update(e) {
    ls.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Na(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const f = us(e);
        for (; s <= i - o; o += s)
          this.process(f, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ls.exists(this), ls.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let a = o; a < s; a++)
      n[a] = 0;
    kl(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = us(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = f / 4, l = this.get();
    if (u > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let a = 0; a < u; a++)
      c.setUint32(4 * a, l[a], i);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: c } = this;
    return e.length = s, e.pos = c, e.finished = i, e.destroyed = o, s % n && e.buffer.set(r), e;
  }
};
const Tl = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Da = Uint8Array.from({ length: 16 }, (t, e) => e), Fl = Da.map((t) => (9 * t + 5) % 16);
let hi = [Da], li = [Fl];
for (let t = 0; t < 4; t++)
  for (let e of [hi, li])
    e.push(e[t].map((n) => Tl[n]));
const ka = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Ml = hi.map((t, e) => t.map((n) => ka[e][n])), Gl = li.map((t, e) => t.map((n) => ka[e][n])), Rl = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Vl = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), jn = (t, e) => t << e | t >>> 32 - e;
function No(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const qn = new Uint32Array(16);
let Kl = class extends fi {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: s, h4: i } = this;
    return [e, n, r, s, i];
  }
  set(e, n, r, s, i) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = i | 0;
  }
  process(e, n) {
    for (let d = 0; d < 16; d++, n += 4)
      qn[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, f = c, u = this.h3 | 0, l = u, a = this.h4 | 0, b = a;
    for (let d = 0; d < 5; d++) {
      const g = 4 - d, y = Rl[d], B = Vl[d], H = hi[d], L = li[d], x = Ml[d], $ = Gl[d];
      for (let S = 0; S < 16; S++) {
        const P = jn(r + No(d, i, c, u) + qn[H[S]] + y, x[S]) + a | 0;
        r = a, a = u, u = jn(c, 10) | 0, c = i, i = P;
      }
      for (let S = 0; S < 16; S++) {
        const P = jn(s + No(g, o, f, l) + qn[L[S]] + B, $[S]) + b | 0;
        s = b, b = l, l = jn(f, 10) | 0, f = o, o = P;
      }
    }
    this.set(this.h1 + c + l | 0, this.h2 + u + b | 0, this.h3 + a + s | 0, this.h4 + r + o | 0, this.h0 + i + f | 0);
  }
  roundClean() {
    qn.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
De(() => new Kl());
const zl = (t, e, n) => t & e ^ ~t & n, jl = (t, e, n) => t & e ^ t & n ^ e & n, ql = new Uint32Array([
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
]), Kt = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), zt = new Uint32Array(64);
let Ta = class extends fi {
  constructor() {
    super(64, 32, 8, !1), this.A = Kt[0] | 0, this.B = Kt[1] | 0, this.C = Kt[2] | 0, this.D = Kt[3] | 0, this.E = Kt[4] | 0, this.F = Kt[5] | 0, this.G = Kt[6] | 0, this.H = Kt[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: o, G: c, H: f } = this;
    return [e, n, r, s, i, o, c, f];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, f) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = c | 0, this.H = f | 0;
  }
  process(e, n) {
    for (let a = 0; a < 16; a++, n += 4)
      zt[a] = e.getUint32(n, !1);
    for (let a = 16; a < 64; a++) {
      const b = zt[a - 15], d = zt[a - 2], g = St(b, 7) ^ St(b, 18) ^ b >>> 3, y = St(d, 17) ^ St(d, 19) ^ d >>> 10;
      zt[a] = y + zt[a - 7] + g + zt[a - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: f, G: u, H: l } = this;
    for (let a = 0; a < 64; a++) {
      const b = St(c, 6) ^ St(c, 11) ^ St(c, 25), d = l + b + zl(c, f, u) + ql[a] + zt[a] | 0, y = (St(r, 2) ^ St(r, 13) ^ St(r, 22)) + jl(r, s, i) | 0;
      l = u, u = f, f = c, c = o + d | 0, o = i, i = s, s = r, r = d + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, l = l + this.H | 0, this.set(r, s, i, o, c, f, u, l);
  }
  roundClean() {
    zt.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Wl = class extends Ta {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
De(() => new Ta());
De(() => new Wl());
const Wn = BigInt(2 ** 32 - 1), Os = BigInt(32);
function Fa(t, e = !1) {
  return e ? { h: Number(t & Wn), l: Number(t >> Os & Wn) } : { h: Number(t >> Os & Wn) | 0, l: Number(t & Wn) | 0 };
}
function Xl(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Fa(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Yl = (t, e) => BigInt(t >>> 0) << Os | BigInt(e >>> 0), Zl = (t, e, n) => t >>> n, Jl = (t, e, n) => t << 32 - n | e >>> n, Ql = (t, e, n) => t >>> n | e << 32 - n, tu = (t, e, n) => t << 32 - n | e >>> n, eu = (t, e, n) => t << 64 - n | e >>> n - 32, nu = (t, e, n) => t >>> n - 32 | e << 64 - n, ru = (t, e) => e, su = (t, e) => t, iu = (t, e, n) => t << n | e >>> 32 - n, ou = (t, e, n) => e << n | t >>> 32 - n, cu = (t, e, n) => e << n - 32 | t >>> 64 - n, au = (t, e, n) => t << n - 32 | e >>> 64 - n;
function fu(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const hu = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), lu = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, uu = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), du = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, bu = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), pu = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, T = {
  fromBig: Fa,
  split: Xl,
  toBig: Yl,
  shrSH: Zl,
  shrSL: Jl,
  rotrSH: Ql,
  rotrSL: tu,
  rotrBH: eu,
  rotrBL: nu,
  rotr32H: ru,
  rotr32L: su,
  rotlSH: iu,
  rotlSL: ou,
  rotlBH: cu,
  rotlBL: au,
  add: fu,
  add3L: hu,
  add3H: lu,
  add4L: uu,
  add4H: du,
  add5H: pu,
  add5L: bu
}, [gu, xu] = T.split([
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
].map((t) => BigInt(t))), jt = new Uint32Array(80), qt = new Uint32Array(80);
let Tr = class extends fi {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: f, Eh: u, El: l, Fh: a, Fl: b, Gh: d, Gl: g, Hh: y, Hl: B } = this;
    return [e, n, r, s, i, o, c, f, u, l, a, b, d, g, y, B];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, f, u, l, a, b, d, g, y, B) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = f | 0, this.Eh = u | 0, this.El = l | 0, this.Fh = a | 0, this.Fl = b | 0, this.Gh = d | 0, this.Gl = g | 0, this.Hh = y | 0, this.Hl = B | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      jt[x] = e.getUint32(n), qt[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const $ = jt[x - 15] | 0, S = qt[x - 15] | 0, P = T.rotrSH($, S, 1) ^ T.rotrSH($, S, 8) ^ T.shrSH($, S, 7), k = T.rotrSL($, S, 1) ^ T.rotrSL($, S, 8) ^ T.shrSL($, S, 7), U = jt[x - 2] | 0, O = qt[x - 2] | 0, p = T.rotrSH(U, O, 19) ^ T.rotrBH(U, O, 61) ^ T.shrSH(U, O, 6), E = T.rotrSL(U, O, 19) ^ T.rotrBL(U, O, 61) ^ T.shrSL(U, O, 6), I = T.add4L(k, E, qt[x - 7], qt[x - 16]), D = T.add4H(I, P, p, jt[x - 7], jt[x - 16]);
      jt[x] = D | 0, qt[x] = I | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: f, Dh: u, Dl: l, Eh: a, El: b, Fh: d, Fl: g, Gh: y, Gl: B, Hh: H, Hl: L } = this;
    for (let x = 0; x < 80; x++) {
      const $ = T.rotrSH(a, b, 14) ^ T.rotrSH(a, b, 18) ^ T.rotrBH(a, b, 41), S = T.rotrSL(a, b, 14) ^ T.rotrSL(a, b, 18) ^ T.rotrBL(a, b, 41), P = a & d ^ ~a & y, k = b & g ^ ~b & B, U = T.add5L(L, S, k, xu[x], qt[x]), O = T.add5H(U, H, $, P, gu[x], jt[x]), p = U | 0, E = T.rotrSH(r, s, 28) ^ T.rotrBH(r, s, 34) ^ T.rotrBH(r, s, 39), I = T.rotrSL(r, s, 28) ^ T.rotrBL(r, s, 34) ^ T.rotrBL(r, s, 39), D = r & i ^ r & c ^ i & c, V = s & o ^ s & f ^ o & f;
      H = y | 0, L = B | 0, y = d | 0, B = g | 0, d = a | 0, g = b | 0, { h: a, l: b } = T.add(u | 0, l | 0, O | 0, p | 0), u = c | 0, l = f | 0, c = i | 0, f = o | 0, i = r | 0, o = s | 0;
      const N = T.add3L(p, I, V);
      r = T.add3H(N, O, E, D), s = N | 0;
    }
    ({ h: r, l: s } = T.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = T.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l: f } = T.add(this.Ch | 0, this.Cl | 0, c | 0, f | 0), { h: u, l } = T.add(this.Dh | 0, this.Dl | 0, u | 0, l | 0), { h: a, l: b } = T.add(this.Eh | 0, this.El | 0, a | 0, b | 0), { h: d, l: g } = T.add(this.Fh | 0, this.Fl | 0, d | 0, g | 0), { h: y, l: B } = T.add(this.Gh | 0, this.Gl | 0, y | 0, B | 0), { h: H, l: L } = T.add(this.Hh | 0, this.Hl | 0, H | 0, L | 0), this.set(r, s, i, o, c, f, u, l, a, b, d, g, y, B, H, L);
  }
  roundClean() {
    jt.fill(0), qt.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, yu = class extends Tr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, wu = class extends Tr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, mu = class extends Tr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
De(() => new Tr());
De(() => new yu());
De(() => new wu());
De(() => new mu());
const Su = {}, Ma = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Su
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const z = BigInt(0), X = BigInt(1), ye = BigInt(2), An = BigInt(3), Do = BigInt(8), W = Object.freeze({
  a: z,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: X,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), ko = (t, e) => (t + e / ye) / e, Xn = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = W, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -X * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), c = ko(i * t, e), f = ko(-r * t, e);
    let u = _(t - c * n - f * s, e), l = _(-c * r - f * i, e);
    const a = u > o, b = l > o;
    if (a && (u = e - u), b && (l = e - l), u > o || l > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: a, k1: u, k2neg: b, k2: l };
  }
}, mt = 32, Ie = 32, Ga = 32, Sr = mt + 1, Er = 2 * mt + 1;
function To(t) {
  const { a: e, b: n } = W, r = _(t * t), s = _(r * t);
  return _(s + e * t + n);
}
const Yn = W.a === z;
class ui extends Error {
  constructor(e) {
    super(e);
  }
}
function Fo(t) {
  if (!(t instanceof q))
    throw new TypeError("JacobianPoint expected");
}
class q {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof j))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(j.ZERO) ? q.ZERO : new q(e.x, e.y, X);
  }
  static toAffineBatch(e) {
    const n = vu(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return q.toAffineBatch(e).map(q.fromAffine);
  }
  equals(e) {
    Fo(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: c } = e, f = _(s * s), u = _(c * c), l = _(n * u), a = _(i * f), b = _(_(r * c) * u), d = _(_(o * s) * f);
    return l === a && b === d;
  }
  negate() {
    return new q(this.x, _(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = _(e * e), i = _(n * n), o = _(i * i), c = e + i, f = _(ye * (_(c * c) - s - o)), u = _(An * s), l = _(u * u), a = _(l - ye * f), b = _(u * (f - a) - Do * o), d = _(ye * n * r);
    return new q(a, b, d);
  }
  add(e) {
    Fo(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: c } = e;
    if (i === z || o === z)
      return this;
    if (n === z || r === z)
      return e;
    const f = _(s * s), u = _(c * c), l = _(n * u), a = _(i * f), b = _(_(r * c) * u), d = _(_(o * s) * f), g = _(a - l), y = _(d - b);
    if (g === z)
      return y === z ? this.double() : q.ZERO;
    const B = _(g * g), H = _(g * B), L = _(l * B), x = _(y * y - H - ye * L), $ = _(y * (L - x) - b * H), S = _(s * c * g);
    return new q(x, $, S);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = q.ZERO;
    if (typeof e == "bigint" && e === z)
      return n;
    let r = Ro(e);
    if (r === X)
      return this;
    if (!Yn) {
      let a = n, b = this;
      for (; r > z; )
        r & X && (a = a.add(b)), b = b.double(), r >>= X;
      return a;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: c } = Xn.splitScalar(r), f = n, u = n, l = this;
    for (; i > z || c > z; )
      i & X && (f = f.add(l)), c & X && (u = u.add(l)), l = l.double(), i >>= X, c >>= X;
    return s && (f = f.negate()), o && (u = u.negate()), u = new q(_(u.x * Xn.beta), u.y, u.z), f.add(u);
  }
  precomputeWindow(e) {
    const n = Yn ? 128 / e + 1 : 256 / e + 1, r = [];
    let s = this, i = s;
    for (let o = 0; o < n; o++) {
      i = s, r.push(i);
      for (let c = 1; c < 2 ** (e - 1); c++)
        i = i.add(s), r.push(i);
      s = i.double();
    }
    return r;
  }
  wNAF(e, n) {
    !n && this.equals(q.BASE) && (n = j.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Cs.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = q.normalizeZ(s), Cs.set(n, s)));
    let i = q.ZERO, o = q.BASE;
    const c = 1 + (Yn ? 128 / r : 256 / r), f = 2 ** (r - 1), u = BigInt(2 ** r - 1), l = 2 ** r, a = BigInt(r);
    for (let b = 0; b < c; b++) {
      const d = b * f;
      let g = Number(e & u);
      e >>= a, g > f && (g -= l, e += X);
      const y = d, B = d + Math.abs(g) - 1, H = b % 2 !== 0, L = g < 0;
      g === 0 ? o = o.add(Zn(H, s[y])) : i = i.add(Zn(L, s[B]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = Ro(e), s, i;
    if (Yn) {
      const { k1neg: o, k1: c, k2neg: f, k2: u } = Xn.splitScalar(r);
      let { p: l, f: a } = this.wNAF(c, n), { p: b, f: d } = this.wNAF(u, n);
      l = Zn(o, l), b = Zn(f, b), b = new q(_(b.x * Xn.beta), b.y, b.z), s = l.add(b), i = a.add(d);
    } else {
      const { p: o, f: c } = this.wNAF(r, n);
      s = o, i = c;
    }
    return q.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(q.ZERO);
    e == null && (e = i ? Do : dn(s));
    const o = e, c = _(o * o), f = _(c * o), u = _(n * c), l = _(r * f), a = _(s * o);
    if (i)
      return j.ZERO;
    if (a !== X)
      throw new Error("invZ was invalid");
    return new j(u, l);
  }
}
q.BASE = new q(W.Gx, W.Gy, X);
q.ZERO = new q(z, X, z);
function Zn(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Cs = /* @__PURE__ */ new WeakMap();
class j {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Cs.delete(this);
  }
  hasEvenY() {
    return this.y % ye === z;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = ht(n ? e : e.subarray(1));
    if (!gr(r))
      throw new Error("Point is not on curve");
    const s = To(r);
    let i = $u(s);
    const o = (i & X) === X;
    n ? o && (i = _(-i)) : (e[0] & 1) === 1 !== o && (i = _(-i));
    const c = new j(r, i);
    return c.assertValidity(), c;
  }
  static fromUncompressedHex(e) {
    const n = ht(e.subarray(1, mt + 1)), r = ht(e.subarray(mt + 1, mt * 2 + 1)), s = new j(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Lt(e), r = n.length, s = n[0];
    if (r === mt)
      return this.fromCompressedHex(n);
    if (r === Sr && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === Er && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Sr} compressed bytes or ${Er} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return j.BASE.multiply(Ue(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = Ka(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = di(Lt(e)), { n: c } = W, f = r === 2 || r === 3 ? s + c : s, u = dn(f, c), l = _(-o * u, c), a = _(i * u, c), b = r & 1 ? "03" : "02", d = j.fromHex(b + we(f)), g = j.BASE.multiplyAndAddUnsafe(d, l, a);
    if (!g)
      throw new Error("Cannot recover signature: point at infinify");
    return g.assertValidity(), g;
  }
  toRawBytes(e = !1) {
    return me(this.toHex(e));
  }
  toHex(e = !1) {
    const n = we(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${we(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!gr(n) || !gr(r))
      throw new Error(e);
    const s = _(r * r), i = To(n);
    if (_(s - i) !== z)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new j(this.x, _(-this.y));
  }
  double() {
    return q.fromAffine(this).double().toAffine();
  }
  add(e) {
    return q.fromAffine(this).add(q.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return q.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = q.fromAffine(this), i = n === z || n === X || this !== j.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = q.fromAffine(e).multiplyUnsafe(r), c = i.add(o);
    return c.equals(q.ZERO) ? void 0 : c.toAffine();
  }
}
j.BASE = new j(W.Gx, W.Gy);
j.ZERO = new j(z, z);
function Mo(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Go(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${en(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: ht(n), left: t.subarray(e + 2) };
}
function Eu(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${en(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Go(t.subarray(2)), { data: r, left: s } = Go(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${en(s)}`);
  return { r: e, s: r };
}
class Ft {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? en(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Ft(Ar(s.slice(0, 64)), Ar(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Eu(n ? e : me(e));
    return new Ft(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!rn(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!rn(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = W.n >> X;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Ft(this.r, _(-this.s, W.n)) : this;
  }
  toDERRawBytes() {
    return me(this.toDERHex());
  }
  toDERHex() {
    const e = Mo(En(this.s)), n = Mo(En(this.r)), r = e.length / 2, s = n.length / 2, i = En(r), o = En(s);
    return `30${En(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return me(this.toCompactHex());
  }
  toCompactHex() {
    return we(this.r) + we(this.s);
  }
}
function ge(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, s) => r + s.length, 0), n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
const Au = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function en(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Au[t[n]];
  return e;
}
const Bu = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function we(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(z <= t && t < Bu))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function nn(t) {
  const e = me(we(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function En(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Ar(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function me(t) {
  if (typeof t != "string")
    throw new TypeError("hexToBytes: expected string, got " + typeof t);
  if (t.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + t.length);
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function ht(t) {
  return Ar(en(t));
}
function Lt(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : me(t);
}
function Ro(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && rn(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function _(t, e = W.P) {
  const n = t % e;
  return n >= z ? n : e + n;
}
function lt(t, e) {
  const { P: n } = W;
  let r = t;
  for (; e-- > z; )
    r *= r, r %= n;
  return r;
}
function $u(t) {
  const { P: e } = W, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), c = BigInt(88), f = t * t * t % e, u = f * f * t % e, l = lt(u, An) * u % e, a = lt(l, An) * u % e, b = lt(a, ye) * f % e, d = lt(b, r) * b % e, g = lt(d, s) * d % e, y = lt(g, o) * g % e, B = lt(y, c) * y % e, H = lt(B, o) * g % e, L = lt(H, An) * u % e, x = lt(L, i) * d % e, $ = lt(x, n) * f % e, S = lt($, ye);
  if (S * S % e !== t)
    throw new Error("Cannot find square root");
  return S;
}
function dn(t, e = W.P) {
  if (t === z || e <= z)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = _(t, e), r = e, s = z, i = X;
  for (; n !== z; ) {
    const c = r / n, f = r % n, u = s - i * c;
    r = n, n = f, s = i, i = u;
  }
  if (r !== X)
    throw new Error("invert: does not exist");
  return _(s, e);
}
function vu(t, e = W.P) {
  const n = new Array(t.length), r = t.reduce((i, o, c) => o === z ? i : (n[c] = i, _(i * o, e)), X), s = dn(r, e);
  return t.reduceRight((i, o, c) => o === z ? i : (n[c] = _(i * n[c], e), _(i * o, e)), s), n;
}
function _u(t) {
  const e = t.length * 8 - Ie * 8, n = ht(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function di(t, e = !1) {
  const n = _u(t);
  if (e)
    return n;
  const { n: r } = W;
  return n >= r ? n - r : n;
}
let Qe, Bn;
class Ra {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return Z.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return Bn(this.k, ...e);
  }
  checkSync() {
    if (typeof Bn != "function")
      throw new ui("hmacSha256Sync needs to be set");
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
    return ge(...n);
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
    return ge(...n);
  }
}
function rn(t) {
  return z < t && t < W.n;
}
function gr(t) {
  return z < t && t < W.P;
}
function Va(t, e, n, r = !0) {
  const { n: s } = W, i = di(t, !0);
  if (!rn(i))
    return;
  const o = dn(i, s), c = j.BASE.multiply(i), f = _(c.x, s);
  if (f === z)
    return;
  const u = _(o * _(e + n * f, s), s);
  if (u === z)
    return;
  let l = new Ft(f, u), a = (c.x === l.r ? 0 : 2) | Number(c.y & X);
  return r && l.hasHighS() && (l = l.normalizeS(), a ^= 1), { sig: l, recovery: a };
}
function Ue(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Ie)
      throw new Error("Expected 32 bytes of private key");
    e = Ar(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Ie)
      throw new Error("Expected 32 bytes of private key");
    e = ht(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!rn(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function bi(t) {
  return t instanceof j ? (t.assertValidity(), t) : j.fromHex(t);
}
function Ka(t) {
  if (t instanceof Ft)
    return t.assertValidity(), t;
  try {
    return Ft.fromDER(t);
  } catch {
    return Ft.fromCompact(t);
  }
}
function pi(t, e = !1) {
  return j.fromPrivateKey(t).toRawBytes(e);
}
function Hu(t, e, n, r = !1) {
  return j.fromSignature(t, e, n).toRawBytes(r);
}
function Vo(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === Sr || r === Er : n ? r === Sr * 2 || r === Er * 2 : t instanceof j;
}
function gi(t, e, n = !1) {
  if (Vo(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Vo(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = bi(e);
  return r.assertValidity(), r.multiply(Ue(t)).toRawBytes(n);
}
function za(t) {
  const e = t.length > mt ? t.slice(0, mt) : t;
  return ht(e);
}
function Lu(t) {
  const e = za(t), n = _(e, W.n);
  return ja(n < z ? e : n);
}
function ja(t) {
  return nn(t);
}
function qa(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Lt(t), s = Ue(e), i = [ja(s), Lu(r)];
  if (n != null) {
    n === !0 && (n = Z.randomBytes(mt));
    const f = Lt(n);
    if (f.length !== mt)
      throw new Error(`sign: Expected ${mt} bytes of extra data`);
    i.push(f);
  }
  const o = ge(...i), c = za(r);
  return { seed: o, m: c, d: s };
}
function Wa(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function Iu(t, e, n = {}) {
  const { seed: r, m: s, d: i } = qa(t, e, n.extraEntropy), o = new Ra(Ga, Ie);
  await o.reseed(r);
  let c;
  for (; !(c = Va(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return Wa(c, n);
}
function Xa(t, e, n = {}) {
  const { seed: r, m: s, d: i } = qa(t, e, n.extraEntropy), o = new Ra(Ga, Ie);
  o.reseedSync(r);
  let c;
  for (; !(c = Va(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return Wa(c, n);
}
const Uu = { strict: !0 };
function Ou(t, e, n, r = Uu) {
  let s;
  try {
    s = Ka(t), e = Lt(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const c = di(e);
  let f;
  try {
    f = bi(n);
  } catch {
    return !1;
  }
  const { n: u } = W, l = dn(o, u), a = _(c * l, u), b = _(i * l, u), d = j.BASE.multiplyAndAddUnsafe(f, a, b);
  return d ? _(d.x, u) === i : !1;
}
function Br(t) {
  return _(ht(t), W.n);
}
class sn {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Lt(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = ht(n.subarray(0, 32)), s = ht(n.subarray(32, 64));
    return new sn(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!gr(e) || !rn(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return we(this.r) + we(this.s);
  }
  toRawBytes() {
    return me(this.toHex());
  }
}
function Cu(t) {
  return j.fromPrivateKey(t).toRawX();
}
class Ya {
  constructor(e, n, r = Z.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Lt(e);
    const { x: s, scalar: i } = this.getScalar(Ue(n));
    if (this.px = s, this.d = i, this.rand = Lt(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = j.fromPrivateKey(e), r = n.hasEvenY() ? e : W.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return nn(e ^ ht(n));
  }
  finalizeNonce(e) {
    const n = _(ht(e), W.n);
    if (n === z)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new sn(e.x, _(n + r * s, W.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = Z.taggedHash, o = this.initNonce(n, await i(pe.aux, s)), { R: c, rx: f, k: u } = this.finalizeNonce(await i(pe.nonce, o, r, e)), l = Br(await i(pe.challenge, f, r, e)), a = this.finalizeSig(c, u, l, n);
    return await Qa(a, e, r) || this.error(), a;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = Z.taggedHashSync, o = this.initNonce(n, i(pe.aux, s)), { R: c, rx: f, k: u } = this.finalizeNonce(i(pe.nonce, o, r, e)), l = Br(i(pe.challenge, f, r, e)), a = this.finalizeSig(c, u, l, n);
    return t0(a, e, r) || this.error(), a;
  }
}
async function Pu(t, e, n) {
  return new Ya(t, e, n).calc();
}
function Nu(t, e, n) {
  return new Ya(t, e, n).calcSync();
}
function Za(t, e, n) {
  const r = t instanceof sn, s = r ? t : sn.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Lt(e),
    P: bi(n)
  };
}
function Ja(t, e, n, r) {
  const s = j.BASE.multiplyAndAddUnsafe(e, Ue(n), _(-r, W.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Qa(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Za(t, e, n), c = Br(await Z.taggedHash(pe.challenge, nn(r), o.toRawX(), i));
    return Ja(r, o, s, c);
  } catch {
    return !1;
  }
}
function t0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Za(t, e, n), c = Br(Z.taggedHashSync(pe.challenge, nn(r), o.toRawX(), i));
    return Ja(r, o, s, c);
  } catch (r) {
    if (r instanceof ui)
      throw r;
    return !1;
  }
}
const Du = {
  Signature: sn,
  getPublicKey: Cu,
  sign: Pu,
  verify: Qa,
  signSync: Nu,
  verifySync: t0
};
j.BASE._setWindowSize(8);
const ct = {
  node: Ma,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, pe = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Jn = {}, Z = {
  bytesToHex: en,
  hexToBytes: me,
  concatBytes: ge,
  mod: _,
  invert: dn,
  isValidPrivateKey(t) {
    try {
      return Ue(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: nn,
  _normalizePrivateKey: Ue,
  hashToPrivateKey: (t) => {
    t = Lt(t);
    const e = Ie + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = _(ht(t), W.n - X) + X;
    return nn(n);
  },
  randomBytes: (t = 32) => {
    if (ct.web)
      return ct.web.getRandomValues(new Uint8Array(t));
    if (ct.node) {
      const { randomBytes: e } = ct.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Z.hashToPrivateKey(Z.randomBytes(Ie + 8)),
  precompute(t = 8, e = j.BASE) {
    const n = e === j.BASE ? e : new j(e.x, e.y);
    return n._setWindowSize(t), n.multiply(An), n;
  },
  sha256: async (...t) => {
    if (ct.web) {
      const e = await ct.web.subtle.digest("SHA-256", ge(...t));
      return new Uint8Array(e);
    } else if (ct.node) {
      const { createHash: e } = ct.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (ct.web) {
      const n = await ct.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = ge(...e), s = await ct.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (ct.node) {
      const { createHmac: n } = ct.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = Jn[t];
    if (n === void 0) {
      const r = await Z.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = ge(r, r), Jn[t] = n;
    }
    return Z.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Qe != "function")
      throw new ui("sha256Sync is undefined, you need to set it");
    let n = Jn[t];
    if (n === void 0) {
      const r = Qe(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = ge(r, r), Jn[t] = n;
    }
    return Qe(n, ...e);
  },
  _JacobianPoint: q
};
Object.defineProperties(Z, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Qe;
    },
    set(t) {
      Qe || (Qe = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Bn;
    },
    set(t) {
      Bn || (Bn = t);
    }
  }
});
const ku = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: W,
  Point: j,
  Signature: Ft,
  getPublicKey: pi,
  getSharedSecret: gi,
  recoverPublicKey: Hu,
  schnorr: Du,
  sign: Iu,
  signSync: Xa,
  utils: Z,
  verify: Ou
}, Symbol.toStringTag, { value: "Module" }));
var rt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Tu(t) {
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
var bn = {}, xi = {};
const qe = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function e0(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Ps(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Ee(t, ...e) {
  if (!e0(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function n0(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Ps(t.outputLen), Ps(t.blockLen);
}
function Hn(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function r0(t, e) {
  Ee(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function Fu(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function Mu(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Ln(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function xr(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function pt(t, e) {
  return t << 32 - e | t >>> e;
}
function Gu(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const yi = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function wi(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const s0 = yi ? (t) => t : (t) => wi(t), Ru = s0;
function i0(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = wi(t[e]);
  return t;
}
const Vu = yi ? (t) => t : i0, o0 = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", Ku = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function zu(t) {
  if (Ee(t), o0)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Ku[t[n]];
  return e;
}
const Dt = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Ko(t) {
  if (t >= Dt._0 && t <= Dt._9)
    return t - Dt._0;
  if (t >= Dt.A && t <= Dt.F)
    return t - (Dt.A - 10);
  if (t >= Dt.a && t <= Dt.f)
    return t - (Dt.a - 10);
}
function ju(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (o0)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = Ko(t.charCodeAt(i)), c = Ko(t.charCodeAt(i + 1));
    if (o === void 0 || c === void 0) {
      const f = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + f + '" at index ' + i);
    }
    r[s] = o * 16 + c;
  }
  return r;
}
const c0 = async () => {
};
async function qu(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await c0(), r += i);
  }
}
function mi(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function Wu(t) {
  return new TextDecoder().decode(t);
}
function pn(t) {
  return typeof t == "string" && (t = mi(t)), Ee(t), t;
}
function Xu(t) {
  return typeof t == "string" && (t = mi(t)), Ee(t), t;
}
function Yu(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    Ee(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function Zu(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let Si = class {
};
function Fr(t) {
  const e = (r) => t().update(pn(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function a0(t) {
  const e = (r, s) => t(s).update(pn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function f0(t) {
  const e = (r, s) => t(s).update(pn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const Ju = Fr, Qu = a0, td = f0;
function ed(t = 32) {
  if (qe && typeof qe.getRandomValues == "function")
    return qe.getRandomValues(new Uint8Array(t));
  if (qe && typeof qe.randomBytes == "function")
    return Uint8Array.from(qe.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const nd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Si,
  abytes: Ee,
  aexists: Hn,
  ahash: n0,
  anumber: Ps,
  aoutput: r0,
  asyncLoop: qu,
  byteSwap: wi,
  byteSwap32: i0,
  byteSwapIfBE: Ru,
  bytesToHex: zu,
  bytesToUtf8: Wu,
  checkOpts: Zu,
  clean: Ln,
  concatBytes: Yu,
  createHasher: Fr,
  createOptHasher: a0,
  createView: xr,
  createXOFer: f0,
  hexToBytes: ju,
  isBytes: e0,
  isLE: yi,
  kdfInputToBytes: Xu,
  nextTick: c0,
  randomBytes: ed,
  rotl: Gu,
  rotr: pt,
  swap32IfBE: Vu,
  swap8IfBE: s0,
  toBytes: pn,
  u32: Mu,
  u8: Fu,
  utf8ToBytes: mi,
  wrapConstructor: Ju,
  wrapConstructorWithOpts: Qu,
  wrapXOFConstructorWithOpts: td
}, Symbol.toStringTag, { value: "Module" })), Pn = /* @__PURE__ */ Cn(nd);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = Pn;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, c) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let f = [], u = 0;
    for (let d = o.length - 1; d >= 0; d--)
      if (u < 4) {
        const g = n.indexOf(o[d]) >> u;
        let y = 0;
        d !== 0 && (y = n.indexOf(o[d - 1]));
        const B = 1 + u, H = y % (1 << B) << 5 - B, L = t.c32[g + H];
        u = B, f.unshift(L);
      } else
        u = 0;
    let l = 0;
    for (let d = 0; d < f.length && f[d] === "0"; d++)
      l++;
    f = f.slice(l);
    const a = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), b = a ? a[0].length : 0;
    for (let d = 0; d < b; d++)
      f.unshift(t.c32[0]);
    if (c) {
      const d = c - f.length;
      for (let g = 0; g < d; g++)
        f.unshift(t.c32[0]);
    }
    return f.join("");
  }
  t.c32encode = r;
  function s(o) {
    return o.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  t.c32normalize = s;
  function i(o, c) {
    if (o = s(o), !o.match(`^[${t.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const f = o.match(`^${t.c32[0]}*`), u = f ? f[0].length : 0;
    let l = [], a = 0, b = 0;
    for (let y = o.length - 1; y >= 0; y--) {
      b === 4 && (l.unshift(n[a]), b = 0, a = 0);
      const H = (t.c32.indexOf(o[y]) << b) + a, L = n[H % 16];
      if (b += 1, a = H >> 4, a > 1 << b)
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
      for (let B = 0; B < y; B += 2)
        g = `00${g}`;
    }
    return g;
  }
  t.c32decode = i;
})(xi);
var Oe = {};
function rd(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, o, r), t.setUint32(e + u, c, r);
}
function sd(t, e, n) {
  return t & e ^ ~t & n;
}
function id(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class od extends Si {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = xr(this.buffer);
  }
  update(e) {
    Hn(this), e = pn(e), Ee(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const f = xr(e);
        for (; s <= i - o; o += s)
          this.process(f, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Hn(this), r0(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, Ln(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let a = o; a < s; a++)
      n[a] = 0;
    rd(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = xr(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = f / 4, l = this.get();
    if (u > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let a = 0; a < u; a++)
      c.setUint32(4 * a, l[a], i);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: c } = this;
    return e.destroyed = o, e.finished = i, e.length = s, e.pos = c, s % n && e.buffer.set(r), e;
  }
  clone() {
    return this._cloneInto();
  }
}
const Wt = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Xt = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), cd = /* @__PURE__ */ Uint32Array.from([
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
]), Yt = /* @__PURE__ */ new Uint32Array(64);
let Ei = class extends od {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = Wt[0] | 0, this.B = Wt[1] | 0, this.C = Wt[2] | 0, this.D = Wt[3] | 0, this.E = Wt[4] | 0, this.F = Wt[5] | 0, this.G = Wt[6] | 0, this.H = Wt[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: o, G: c, H: f } = this;
    return [e, n, r, s, i, o, c, f];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, f) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = c | 0, this.H = f | 0;
  }
  process(e, n) {
    for (let a = 0; a < 16; a++, n += 4)
      Yt[a] = e.getUint32(n, !1);
    for (let a = 16; a < 64; a++) {
      const b = Yt[a - 15], d = Yt[a - 2], g = pt(b, 7) ^ pt(b, 18) ^ b >>> 3, y = pt(d, 17) ^ pt(d, 19) ^ d >>> 10;
      Yt[a] = y + Yt[a - 7] + g + Yt[a - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: f, G: u, H: l } = this;
    for (let a = 0; a < 64; a++) {
      const b = pt(c, 6) ^ pt(c, 11) ^ pt(c, 25), d = l + b + sd(c, f, u) + cd[a] + Yt[a] | 0, y = (pt(r, 2) ^ pt(r, 13) ^ pt(r, 22)) + id(r, s, i) | 0;
      l = u, u = f, f = c, c = o + d | 0, o = i, i = s, s = r, r = d + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, l = l + this.H | 0, this.set(r, s, i, o, c, f, u, l);
  }
  roundClean() {
    Ln(Yt);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Ln(this.buffer);
  }
}, h0 = class extends Ei {
  constructor() {
    super(28), this.A = Xt[0] | 0, this.B = Xt[1] | 0, this.C = Xt[2] | 0, this.D = Xt[3] | 0, this.E = Xt[4] | 0, this.F = Xt[5] | 0, this.G = Xt[6] | 0, this.H = Xt[7] | 0;
  }
};
const ad = /* @__PURE__ */ Fr(() => new Ei()), fd = /* @__PURE__ */ Fr(() => new h0()), hd = Ei, ld = ad, ud = h0, dd = fd, bd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: ud,
  SHA256: hd,
  sha224: dd,
  sha256: ld
}, Symbol.toStringTag, { value: "Module" })), Mr = /* @__PURE__ */ Cn(bd);
Object.defineProperty(Oe, "__esModule", { value: !0 });
Oe.c32checkDecode = Oe.c32checkEncode = void 0;
const zo = Mr, jo = Pn, $n = xi;
function l0(t) {
  const e = (0, zo.sha256)((0, zo.sha256)((0, jo.hexToBytes)(t)));
  return (0, jo.bytesToHex)(e.slice(0, 4));
}
function pd(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = l0(`${n}${e}`), s = (0, $n.c32encode)(`${e}${r}`);
  return `${$n.c32[t]}${s}`;
}
Oe.c32checkEncode = pd;
function gd(t) {
  t = (0, $n.c32normalize)(t);
  const e = (0, $n.c32decode)(t.slice(1)), n = t[0], r = $n.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), l0(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Oe.c32checkDecode = gd;
var u0 = {}, on = {};
function xd(t) {
  if (t.length >= 255)
    throw new TypeError("Alphabet too long");
  for (var e = new Uint8Array(256), n = 0; n < e.length; n++)
    e[n] = 255;
  for (var r = 0; r < t.length; r++) {
    var s = t.charAt(r), i = s.charCodeAt(0);
    if (e[i] !== 255)
      throw new TypeError(s + " is ambiguous");
    e[i] = r;
  }
  var o = t.length, c = t.charAt(0), f = Math.log(o) / Math.log(256), u = Math.log(256) / Math.log(o);
  function l(d) {
    if (d instanceof Uint8Array || (ArrayBuffer.isView(d) ? d = new Uint8Array(d.buffer, d.byteOffset, d.byteLength) : Array.isArray(d) && (d = Uint8Array.from(d))), !(d instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (d.length === 0)
      return "";
    for (var g = 0, y = 0, B = 0, H = d.length; B !== H && d[B] === 0; )
      B++, g++;
    for (var L = (H - B) * u + 1 >>> 0, x = new Uint8Array(L); B !== H; ) {
      for (var $ = d[B], S = 0, P = L - 1; ($ !== 0 || S < y) && P !== -1; P--, S++)
        $ += 256 * x[P] >>> 0, x[P] = $ % o >>> 0, $ = $ / o >>> 0;
      if ($ !== 0)
        throw new Error("Non-zero carry");
      y = S, B++;
    }
    for (var k = L - y; k !== L && x[k] === 0; )
      k++;
    for (var U = c.repeat(g); k < L; ++k)
      U += t.charAt(x[k]);
    return U;
  }
  function a(d) {
    if (typeof d != "string")
      throw new TypeError("Expected String");
    if (d.length === 0)
      return new Uint8Array();
    for (var g = 0, y = 0, B = 0; d[g] === c; )
      y++, g++;
    for (var H = (d.length - g) * f + 1 >>> 0, L = new Uint8Array(H); d[g]; ) {
      var x = d.charCodeAt(g);
      if (x > 255)
        return;
      var $ = e[x];
      if ($ === 255)
        return;
      for (var S = 0, P = H - 1; ($ !== 0 || S < B) && P !== -1; P--, S++)
        $ += o * L[P] >>> 0, L[P] = $ % 256 >>> 0, $ = $ / 256 >>> 0;
      if ($ !== 0)
        throw new Error("Non-zero carry");
      B = S, g++;
    }
    for (var k = H - B; k !== H && L[k] === 0; )
      k++;
    for (var U = new Uint8Array(y + (H - k)), O = y; k !== H; )
      U[O++] = L[k++];
    return U;
  }
  function b(d) {
    var g = a(d);
    if (g)
      return g;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: l,
    decodeUnsafe: a,
    decode: b
  };
}
var d0 = xd;
Object.defineProperty(on, "__esModule", { value: !0 });
on.decode = on.encode = void 0;
const $r = Mr, qo = Pn, b0 = d0, p0 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function yd(t, e = "00") {
  const n = typeof t == "string" ? (0, qo.hexToBytes)(t) : t, r = typeof e == "string" ? (0, qo.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, $r.sha256)((0, $r.sha256)(new Uint8Array([...r, ...n])));
  return b0(p0).encode([...r, ...n, ...s.slice(0, 4)]);
}
on.encode = yd;
function wd(t) {
  const e = b0(p0).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, $r.sha256)((0, $r.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
on.decode = wd;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Oe, n = on, r = Pn;
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
  const i = {};
  i[t.versions.mainnet.p2pkh] = 0, i[t.versions.mainnet.p2sh] = 5, i[t.versions.testnet.p2pkh] = 111, i[t.versions.testnet.p2sh] = 196;
  function o(l, a) {
    if (!a.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, e.c32checkEncode)(l, a)}`;
  }
  t.c32address = o;
  function c(l) {
    if (l.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (l[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, e.c32checkDecode)(l.slice(1));
  }
  t.c32addressDecode = c;
  function f(l, a = -1) {
    const b = n.decode(l), d = (0, r.bytesToHex)(b.data), g = parseInt((0, r.bytesToHex)(b.prefix), 16);
    let y;
    return a < 0 ? (y = g, s[g] !== void 0 && (y = s[g])) : y = a, o(y, d);
  }
  t.b58ToC32 = f;
  function u(l, a = -1) {
    const b = c(l), d = b[0], g = b[1];
    let y;
    a < 0 ? (y = d, i[d] !== void 0 && (y = i[d])) : y = a;
    let B = y.toString(16);
    return B.length === 1 && (B = `0${B}`), n.encode(g, B);
  }
  t.c32ToB58 = u;
})(u0);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = xi;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Oe;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = u0;
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
})(bn);
var vr = { exports: {} };
vr.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", c = "[object Boolean]", f = "[object Date]", u = "[object Error]", l = "[object Function]", a = "[object GeneratorFunction]", b = "[object Map]", d = "[object Number]", g = "[object Object]", y = "[object Promise]", B = "[object RegExp]", H = "[object Set]", L = "[object String]", x = "[object Symbol]", $ = "[object WeakMap]", S = "[object ArrayBuffer]", P = "[object DataView]", k = "[object Float32Array]", U = "[object Float64Array]", O = "[object Int8Array]", p = "[object Int16Array]", E = "[object Int32Array]", I = "[object Uint8Array]", D = "[object Uint8ClampedArray]", V = "[object Uint16Array]", N = "[object Uint32Array]", Re = /[\\^$.*+?()[\]{}|]/g, wn = /\w*$/, Fn = /^\[object .+?Constructor\]$/, J = /^(?:0|[1-9]\d*)$/, K = {};
  K[i] = K[o] = K[S] = K[P] = K[c] = K[f] = K[k] = K[U] = K[O] = K[p] = K[E] = K[b] = K[d] = K[g] = K[B] = K[H] = K[L] = K[x] = K[I] = K[D] = K[V] = K[N] = !0, K[u] = K[l] = K[$] = !1;
  var Qf = typeof rt == "object" && rt && rt.Object === Object && rt, th = typeof self == "object" && self && self.Object === Object && self, Ct = Qf || th || Function("return this")(), Yi = e && !e.nodeType && e, Zi = Yi && !0 && t && !t.nodeType && t, eh = Zi && Zi.exports === Yi;
  function nh(h, w) {
    return h.set(w[0], w[1]), h;
  }
  function rh(h, w) {
    return h.add(w), h;
  }
  function sh(h, w) {
    for (var A = -1, C = h ? h.length : 0; ++A < C && w(h[A], A, h) !== !1; )
      ;
    return h;
  }
  function ih(h, w) {
    for (var A = -1, C = w.length, et = h.length; ++A < C; )
      h[et + A] = w[A];
    return h;
  }
  function Ji(h, w, A, C) {
    for (var et = -1, it = h ? h.length : 0; ++et < it; )
      A = w(A, h[et], et, h);
    return A;
  }
  function oh(h, w) {
    for (var A = -1, C = Array(h); ++A < h; )
      C[A] = w(A);
    return C;
  }
  function ch(h, w) {
    return h == null ? void 0 : h[w];
  }
  function Qi(h) {
    var w = !1;
    if (h != null && typeof h.toString != "function")
      try {
        w = !!(h + "");
      } catch {
      }
    return w;
  }
  function to(h) {
    var w = -1, A = Array(h.size);
    return h.forEach(function(C, et) {
      A[++w] = [et, C];
    }), A;
  }
  function Qr(h, w) {
    return function(A) {
      return h(w(A));
    };
  }
  function eo(h) {
    var w = -1, A = Array(h.size);
    return h.forEach(function(C) {
      A[++w] = C;
    }), A;
  }
  var ah = Array.prototype, fh = Function.prototype, Mn = Object.prototype, ts = Ct["__core-js_shared__"], no = function() {
    var h = /[^.]+$/.exec(ts && ts.keys && ts.keys.IE_PROTO || "");
    return h ? "Symbol(src)_1." + h : "";
  }(), ro = fh.toString, Vt = Mn.hasOwnProperty, Gn = Mn.toString, hh = RegExp(
    "^" + ro.call(Vt).replace(Re, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), so = eh ? Ct.Buffer : void 0, io = Ct.Symbol, oo = Ct.Uint8Array, lh = Qr(Object.getPrototypeOf, Object), uh = Object.create, dh = Mn.propertyIsEnumerable, bh = ah.splice, co = Object.getOwnPropertySymbols, ph = so ? so.isBuffer : void 0, gh = Qr(Object.keys, Object), es = ze(Ct, "DataView"), mn = ze(Ct, "Map"), ns = ze(Ct, "Promise"), rs = ze(Ct, "Set"), ss = ze(Ct, "WeakMap"), Sn = ze(Object, "create"), xh = $e(es), yh = $e(mn), wh = $e(ns), mh = $e(rs), Sh = $e(ss), ao = io ? io.prototype : void 0, fo = ao ? ao.valueOf : void 0;
  function Ae(h) {
    var w = -1, A = h ? h.length : 0;
    for (this.clear(); ++w < A; ) {
      var C = h[w];
      this.set(C[0], C[1]);
    }
  }
  function Eh() {
    this.__data__ = Sn ? Sn(null) : {};
  }
  function Ah(h) {
    return this.has(h) && delete this.__data__[h];
  }
  function Bh(h) {
    var w = this.__data__;
    if (Sn) {
      var A = w[h];
      return A === r ? void 0 : A;
    }
    return Vt.call(w, h) ? w[h] : void 0;
  }
  function $h(h) {
    var w = this.__data__;
    return Sn ? w[h] !== void 0 : Vt.call(w, h);
  }
  function vh(h, w) {
    var A = this.__data__;
    return A[h] = Sn && w === void 0 ? r : w, this;
  }
  Ae.prototype.clear = Eh, Ae.prototype.delete = Ah, Ae.prototype.get = Bh, Ae.prototype.has = $h, Ae.prototype.set = vh;
  function Pt(h) {
    var w = -1, A = h ? h.length : 0;
    for (this.clear(); ++w < A; ) {
      var C = h[w];
      this.set(C[0], C[1]);
    }
  }
  function _h() {
    this.__data__ = [];
  }
  function Hh(h) {
    var w = this.__data__, A = Rn(w, h);
    if (A < 0)
      return !1;
    var C = w.length - 1;
    return A == C ? w.pop() : bh.call(w, A, 1), !0;
  }
  function Lh(h) {
    var w = this.__data__, A = Rn(w, h);
    return A < 0 ? void 0 : w[A][1];
  }
  function Ih(h) {
    return Rn(this.__data__, h) > -1;
  }
  function Uh(h, w) {
    var A = this.__data__, C = Rn(A, h);
    return C < 0 ? A.push([h, w]) : A[C][1] = w, this;
  }
  Pt.prototype.clear = _h, Pt.prototype.delete = Hh, Pt.prototype.get = Lh, Pt.prototype.has = Ih, Pt.prototype.set = Uh;
  function Ve(h) {
    var w = -1, A = h ? h.length : 0;
    for (this.clear(); ++w < A; ) {
      var C = h[w];
      this.set(C[0], C[1]);
    }
  }
  function Oh() {
    this.__data__ = {
      hash: new Ae(),
      map: new (mn || Pt)(),
      string: new Ae()
    };
  }
  function Ch(h) {
    return Vn(this, h).delete(h);
  }
  function Ph(h) {
    return Vn(this, h).get(h);
  }
  function Nh(h) {
    return Vn(this, h).has(h);
  }
  function Dh(h, w) {
    return Vn(this, h).set(h, w), this;
  }
  Ve.prototype.clear = Oh, Ve.prototype.delete = Ch, Ve.prototype.get = Ph, Ve.prototype.has = Nh, Ve.prototype.set = Dh;
  function Ke(h) {
    this.__data__ = new Pt(h);
  }
  function kh() {
    this.__data__ = new Pt();
  }
  function Th(h) {
    return this.__data__.delete(h);
  }
  function Fh(h) {
    return this.__data__.get(h);
  }
  function Mh(h) {
    return this.__data__.has(h);
  }
  function Gh(h, w) {
    var A = this.__data__;
    if (A instanceof Pt) {
      var C = A.__data__;
      if (!mn || C.length < n - 1)
        return C.push([h, w]), this;
      A = this.__data__ = new Ve(C);
    }
    return A.set(h, w), this;
  }
  Ke.prototype.clear = kh, Ke.prototype.delete = Th, Ke.prototype.get = Fh, Ke.prototype.has = Mh, Ke.prototype.set = Gh;
  function Rh(h, w) {
    var A = cs(h) || ul(h) ? oh(h.length, String) : [], C = A.length, et = !!C;
    for (var it in h)
      Vt.call(h, it) && !(et && (it == "length" || al(it, C))) && A.push(it);
    return A;
  }
  function ho(h, w, A) {
    var C = h[w];
    (!(Vt.call(h, w) && po(C, A)) || A === void 0 && !(w in h)) && (h[w] = A);
  }
  function Rn(h, w) {
    for (var A = h.length; A--; )
      if (po(h[A][0], w))
        return A;
    return -1;
  }
  function Vh(h, w) {
    return h && lo(w, as(w), h);
  }
  function is(h, w, A, C, et, it, Nt) {
    var ot;
    if (C && (ot = it ? C(h, et, it, Nt) : C(h)), ot !== void 0)
      return ot;
    if (!Kn(h))
      return h;
    var yo = cs(h);
    if (yo) {
      if (ot = il(h), !w)
        return nl(h, ot);
    } else {
      var je = Be(h), wo = je == l || je == a;
      if (bl(h))
        return Xh(h, w);
      if (je == g || je == i || wo && !it) {
        if (Qi(h))
          return it ? h : {};
        if (ot = ol(wo ? {} : h), !w)
          return rl(h, Vh(ot, h));
      } else {
        if (!K[je])
          return it ? h : {};
        ot = cl(h, je, is, w);
      }
    }
    Nt || (Nt = new Ke());
    var mo = Nt.get(h);
    if (mo)
      return mo;
    if (Nt.set(h, ot), !yo)
      var So = A ? sl(h) : as(h);
    return sh(So || h, function(fs, zn) {
      So && (zn = fs, fs = h[zn]), ho(ot, zn, is(fs, w, A, C, zn, h, Nt));
    }), ot;
  }
  function Kh(h) {
    return Kn(h) ? uh(h) : {};
  }
  function zh(h, w, A) {
    var C = w(h);
    return cs(h) ? C : ih(C, A(h));
  }
  function jh(h) {
    return Gn.call(h);
  }
  function qh(h) {
    if (!Kn(h) || hl(h))
      return !1;
    var w = xo(h) || Qi(h) ? hh : Fn;
    return w.test($e(h));
  }
  function Wh(h) {
    if (!bo(h))
      return gh(h);
    var w = [];
    for (var A in Object(h))
      Vt.call(h, A) && A != "constructor" && w.push(A);
    return w;
  }
  function Xh(h, w) {
    if (w)
      return h.slice();
    var A = new h.constructor(h.length);
    return h.copy(A), A;
  }
  function os(h) {
    var w = new h.constructor(h.byteLength);
    return new oo(w).set(new oo(h)), w;
  }
  function Yh(h, w) {
    var A = w ? os(h.buffer) : h.buffer;
    return new h.constructor(A, h.byteOffset, h.byteLength);
  }
  function Zh(h, w, A) {
    var C = w ? A(to(h), !0) : to(h);
    return Ji(C, nh, new h.constructor());
  }
  function Jh(h) {
    var w = new h.constructor(h.source, wn.exec(h));
    return w.lastIndex = h.lastIndex, w;
  }
  function Qh(h, w, A) {
    var C = w ? A(eo(h), !0) : eo(h);
    return Ji(C, rh, new h.constructor());
  }
  function tl(h) {
    return fo ? Object(fo.call(h)) : {};
  }
  function el(h, w) {
    var A = w ? os(h.buffer) : h.buffer;
    return new h.constructor(A, h.byteOffset, h.length);
  }
  function nl(h, w) {
    var A = -1, C = h.length;
    for (w || (w = Array(C)); ++A < C; )
      w[A] = h[A];
    return w;
  }
  function lo(h, w, A, C) {
    A || (A = {});
    for (var et = -1, it = w.length; ++et < it; ) {
      var Nt = w[et], ot = void 0;
      ho(A, Nt, ot === void 0 ? h[Nt] : ot);
    }
    return A;
  }
  function rl(h, w) {
    return lo(h, uo(h), w);
  }
  function sl(h) {
    return zh(h, as, uo);
  }
  function Vn(h, w) {
    var A = h.__data__;
    return fl(w) ? A[typeof w == "string" ? "string" : "hash"] : A.map;
  }
  function ze(h, w) {
    var A = ch(h, w);
    return qh(A) ? A : void 0;
  }
  var uo = co ? Qr(co, Object) : xl, Be = jh;
  (es && Be(new es(new ArrayBuffer(1))) != P || mn && Be(new mn()) != b || ns && Be(ns.resolve()) != y || rs && Be(new rs()) != H || ss && Be(new ss()) != $) && (Be = function(h) {
    var w = Gn.call(h), A = w == g ? h.constructor : void 0, C = A ? $e(A) : void 0;
    if (C)
      switch (C) {
        case xh:
          return P;
        case yh:
          return b;
        case wh:
          return y;
        case mh:
          return H;
        case Sh:
          return $;
      }
    return w;
  });
  function il(h) {
    var w = h.length, A = h.constructor(w);
    return w && typeof h[0] == "string" && Vt.call(h, "index") && (A.index = h.index, A.input = h.input), A;
  }
  function ol(h) {
    return typeof h.constructor == "function" && !bo(h) ? Kh(lh(h)) : {};
  }
  function cl(h, w, A, C) {
    var et = h.constructor;
    switch (w) {
      case S:
        return os(h);
      case c:
      case f:
        return new et(+h);
      case P:
        return Yh(h, C);
      case k:
      case U:
      case O:
      case p:
      case E:
      case I:
      case D:
      case V:
      case N:
        return el(h, C);
      case b:
        return Zh(h, C, A);
      case d:
      case L:
        return new et(h);
      case B:
        return Jh(h);
      case H:
        return Qh(h, C, A);
      case x:
        return tl(h);
    }
  }
  function al(h, w) {
    return w = w ?? s, !!w && (typeof h == "number" || J.test(h)) && h > -1 && h % 1 == 0 && h < w;
  }
  function fl(h) {
    var w = typeof h;
    return w == "string" || w == "number" || w == "symbol" || w == "boolean" ? h !== "__proto__" : h === null;
  }
  function hl(h) {
    return !!no && no in h;
  }
  function bo(h) {
    var w = h && h.constructor, A = typeof w == "function" && w.prototype || Mn;
    return h === A;
  }
  function $e(h) {
    if (h != null) {
      try {
        return ro.call(h);
      } catch {
      }
      try {
        return h + "";
      } catch {
      }
    }
    return "";
  }
  function ll(h) {
    return is(h, !0, !0);
  }
  function po(h, w) {
    return h === w || h !== h && w !== w;
  }
  function ul(h) {
    return dl(h) && Vt.call(h, "callee") && (!dh.call(h, "callee") || Gn.call(h) == i);
  }
  var cs = Array.isArray;
  function go(h) {
    return h != null && pl(h.length) && !xo(h);
  }
  function dl(h) {
    return gl(h) && go(h);
  }
  var bl = ph || yl;
  function xo(h) {
    var w = Kn(h) ? Gn.call(h) : "";
    return w == l || w == a;
  }
  function pl(h) {
    return typeof h == "number" && h > -1 && h % 1 == 0 && h <= s;
  }
  function Kn(h) {
    var w = typeof h;
    return !!h && (w == "object" || w == "function");
  }
  function gl(h) {
    return !!h && typeof h == "object";
  }
  function as(h) {
    return go(h) ? Rh(h) : Wh(h);
  }
  function xl() {
    return [];
  }
  function yl() {
    return !1;
  }
  t.exports = ll;
})(vr, vr.exports);
vr.exports;
function Ns(t) {
  return bn.c32address(t.version, t.hash160);
}
function Ai(t, e, n) {
  const r = e || 1, s = n || Hl;
  if (Yd(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: _n.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Bi(t) {
  const e = bn.c32addressDecode(t);
  return {
    type: _n.Address,
    version: e[0],
    hash160: e[1]
  };
}
var v;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(v || (v = {}));
function md(t) {
  if (t.type === v.PrincipalStandard)
    return Ns(t.address);
  if (t.type === v.PrincipalContract)
    return `${Ns(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function Sd(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Bd(e, n);
  } else
    return Ed(t);
}
function Ed(t) {
  const e = Bi(t);
  return { type: v.PrincipalStandard, address: e };
}
function Ad(t) {
  return { type: v.PrincipalStandard, address: t };
}
function Bd(t, e) {
  const n = Bi(t), r = Ai(e);
  return g0(n, r);
}
function g0(t, e) {
  if (On(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: v.PrincipalContract, address: t, contractName: e };
}
function ds(t, e = !1) {
  switch (t.type) {
    case v.BoolTrue:
      return !0;
    case v.BoolFalse:
      return !1;
    case v.Int:
    case v.UInt:
      return e ? t.value.toString() : t.value;
    case v.Buffer:
      return `0x${Mt(t.buffer)}`;
    case v.OptionalNone:
      return null;
    case v.OptionalSome:
      return Ye(t.value);
    case v.ResponseErr:
      return Ye(t.value);
    case v.ResponseOk:
      return Ye(t.value);
    case v.PrincipalStandard:
    case v.PrincipalContract:
      return md(t);
    case v.List:
      return t.list.map((r) => Ye(r));
    case v.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = Ye(t.data[r]);
      }), n;
    case v.StringASCII:
      return t.data;
    case v.StringUTF8:
      return t.data;
  }
}
function Ye(t) {
  switch (t.type) {
    case v.ResponseErr:
      return { type: xe(t), value: ds(t, !0), success: !1 };
    case v.ResponseOk:
      return { type: xe(t), value: ds(t, !0), success: !0 };
    default:
      return { type: xe(t), value: ds(t, !0) };
  }
}
function xe(t) {
  switch (t.type) {
    case v.BoolTrue:
    case v.BoolFalse:
      return "bool";
    case v.Int:
      return "int";
    case v.UInt:
      return "uint";
    case v.Buffer:
      return `(buff ${t.buffer.length})`;
    case v.OptionalNone:
      return "(optional none)";
    case v.OptionalSome:
      return `(optional ${xe(t.value)})`;
    case v.ResponseErr:
      return `(response UnknownType ${xe(t.value)})`;
    case v.ResponseOk:
      return `(response ${xe(t.value)} UnknownType)`;
    case v.PrincipalStandard:
    case v.PrincipalContract:
      return "principal";
    case v.List:
      return `(list ${t.list.length} ${t.list.length ? xe(t.list[0]) : "UnknownType"})`;
    case v.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${xe(t.data[e])})`).join(" ")})`;
    case v.StringASCII:
      return `(string-ascii ${Oa(t.data).length})`;
    case v.StringUTF8:
      return `(string-utf8 ${On(t.data).length})`;
  }
}
const $d = () => ({ type: v.BoolTrue }), vd = () => ({ type: v.BoolFalse }), Wo = BigInt("0xffffffffffffffffffffffffffffffff"), _d = BigInt(0), Xo = BigInt("0x7fffffffffffffffffffffffffffffff"), Yo = BigInt("-170141183460469231731687303715884105728"), Hd = (t) => {
  const e = oi(t, !0);
  if (e > Xo)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Xo}`);
  if (e < Yo)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Yo}`);
  return { type: v.Int, value: e };
}, x0 = (t) => {
  const e = oi(t, !1);
  if (e < _d)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Wo)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Wo}`);
  return { type: v.UInt, value: e };
}, Ld = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: v.Buffer, buffer: t };
};
function Id() {
  return { type: v.OptionalNone };
}
function Ud(t) {
  return { type: v.OptionalSome, value: t };
}
function Od(t) {
  return { type: v.ResponseErr, value: t };
}
function Cd(t) {
  return { type: v.ResponseOk, value: t };
}
function Pd(t) {
  return { type: v.List, list: t };
}
function y0(t) {
  for (const e in t)
    if (!Zd(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: v.Tuple, data: t };
}
const yr = (t) => ({ type: v.StringASCII, data: t }), Nd = (t) => ({ type: v.StringUTF8, data: t });
let w0 = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Dd = class extends w0 {
  constructor(e) {
    super(e);
  }
};
class bs extends w0 {
  constructor(e) {
    super(e);
  }
}
function m0(t) {
  const e = [];
  return e.push(tn(ci(t.version, 1))), e.push(tn(t.hash160)), un(e);
}
function Zo(t) {
  const e = La(Mt(t.readBytes(1))), n = Mt(t.readBytes(20));
  return { type: _n.Address, version: e, hash160: n };
}
function S0(t) {
  const e = [], n = On(t.content), r = n.byteLength;
  return e.push(tn(ci(r, t.lengthPrefixBytes))), e.push(n), un(e);
}
function Jo(t, e, n) {
  e = e || 1;
  const r = La(Mt(t.readBytes(e))), s = Ua(t.readBytes(r));
  return Ai(s, e, 128);
}
function It(t, e) {
  return un([t, e]);
}
function kd(t) {
  return new Uint8Array([t.type]);
}
function Td(t) {
  return t.type === v.OptionalNone ? new Uint8Array([t.type]) : It(t.type, Nn(t.value));
}
function Fd(t) {
  const e = new Uint8Array(4);
  return kr(e, t.buffer.length, 0), It(t.type, ai(e, t.buffer));
}
function Md(t) {
  const e = Ia(wl(t.value, BigInt(Ll)), Ca);
  return It(t.type, e);
}
function Gd(t) {
  const e = Ia(t.value, Ca);
  return It(t.type, e);
}
function Rd(t) {
  return It(t.type, m0(t.address));
}
function Vd(t) {
  return It(t.type, ai(m0(t.address), S0(t.contractName)));
}
function Kd(t) {
  return It(t.type, Nn(t.value));
}
function zd(t) {
  const e = [], n = new Uint8Array(4);
  kr(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Nn(r);
    e.push(s);
  }
  return It(t.type, un(e));
}
function jd(t) {
  const e = [], n = new Uint8Array(4);
  kr(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Ai(s);
    e.push(S0(i));
    const o = Nn(t.data[s]);
    e.push(o);
  }
  return It(t.type, un(e));
}
function E0(t, e) {
  const n = [], r = e == "ascii" ? Oa(t.data) : On(t.data), s = new Uint8Array(4);
  return kr(s, r.length, 0), n.push(s), n.push(r), It(t.type, un(n));
}
function qd(t) {
  return E0(t, "ascii");
}
function Wd(t) {
  return E0(t, "utf8");
}
function Nn(t) {
  switch (t.type) {
    case v.BoolTrue:
    case v.BoolFalse:
      return kd(t);
    case v.OptionalNone:
    case v.OptionalSome:
      return Td(t);
    case v.Buffer:
      return Fd(t);
    case v.UInt:
      return Gd(t);
    case v.Int:
      return Md(t);
    case v.PrincipalStandard:
      return Rd(t);
    case v.PrincipalContract:
      return Vd(t);
    case v.ResponseOk:
    case v.ResponseErr:
      return Kd(t);
    case v.List:
      return zd(t);
    case v.Tuple:
      return jd(t);
    case v.StringASCII:
      return qd(t);
    case v.StringUTF8:
      return Wd(t);
    default:
      throw new Dd("Unable to serialize. Invalid Clarity Value.");
  }
}
function Xd(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Qo = /* @__PURE__ */ new Map();
function A0(t, e) {
  const n = Qo.get(t);
  if (n !== void 0)
    return n(e);
  const r = Xd(t);
  return Qo.set(t, r), A0(t, e);
}
class tc {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return _l(this.readBytes(4), 0);
  }
  readUInt8() {
    return vl(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return $l(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = Mt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = Mt(n);
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
    if (A0(e, r))
      return r;
    throw n(r);
  }
}
function Ze(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new tc(tn(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new tc(t) : e = t;
  switch (e.readUInt8Enum(v, (r) => {
    throw new bs(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case v.Int:
      return Hd(e.readBytes(16));
    case v.UInt:
      return x0(e.readBytes(16));
    case v.Buffer:
      const r = e.readUInt32BE();
      return Ld(e.readBytes(r));
    case v.BoolTrue:
      return $d();
    case v.BoolFalse:
      return vd();
    case v.PrincipalStandard:
      const s = Zo(e);
      return Ad(s);
    case v.PrincipalContract:
      const i = Zo(e), o = Jo(e);
      return g0(i, o);
    case v.ResponseOk:
      return Cd(Ze(e));
    case v.ResponseErr:
      return Od(Ze(e));
    case v.OptionalNone:
      return Id();
    case v.OptionalSome:
      return Ud(Ze(e));
    case v.List:
      const c = e.readUInt32BE(), f = [];
      for (let y = 0; y < c; y++)
        f.push(Ze(e));
      return Pd(f);
    case v.Tuple:
      const u = e.readUInt32BE(), l = {};
      for (let y = 0; y < u; y++) {
        const B = Jo(e).content;
        if (B === void 0)
          throw new bs('"content" is undefined');
        l[B] = Ze(e);
      }
      return y0(l);
    case v.StringASCII:
      const a = e.readUInt32BE(), b = Al(e.readBytes(a));
      return yr(b);
    case v.StringUTF8:
      const d = e.readUInt32BE(), g = Ua(e.readBytes(d));
      return Nd(g);
    default:
      throw new bs("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const Yd = (t, e) => t ? On(t).length > e : !1;
function Zd(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function B0(t) {
  const e = Nn(t);
  return `0x${Mt(e)}`;
}
function Jd(t) {
  return Ze(t);
}
const Qd = (t) => {
  try {
    return bn.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
(function() {
  (function(t) {
    (function(e) {
      var n = typeof globalThis < "u" && globalThis || typeof t < "u" && t || // eslint-disable-next-line no-undef
      typeof rt < "u" && rt || {}, r = {
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
        var i = [
          "[object Int8Array]",
          "[object Uint8Array]",
          "[object Uint8ClampedArray]",
          "[object Int16Array]",
          "[object Uint16Array]",
          "[object Int32Array]",
          "[object Uint32Array]",
          "[object Float32Array]",
          "[object Float64Array]"
        ], o = ArrayBuffer.isView || function(p) {
          return p && i.indexOf(Object.prototype.toString.call(p)) > -1;
        };
      function c(p) {
        if (typeof p != "string" && (p = String(p)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(p) || p === "")
          throw new TypeError('Invalid character in header field name: "' + p + '"');
        return p.toLowerCase();
      }
      function f(p) {
        return typeof p != "string" && (p = String(p)), p;
      }
      function u(p) {
        var E = {
          next: function() {
            var I = p.shift();
            return { done: I === void 0, value: I };
          }
        };
        return r.iterable && (E[Symbol.iterator] = function() {
          return E;
        }), E;
      }
      function l(p) {
        this.map = {}, p instanceof l ? p.forEach(function(E, I) {
          this.append(I, E);
        }, this) : Array.isArray(p) ? p.forEach(function(E) {
          if (E.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + E.length);
          this.append(E[0], E[1]);
        }, this) : p && Object.getOwnPropertyNames(p).forEach(function(E) {
          this.append(E, p[E]);
        }, this);
      }
      l.prototype.append = function(p, E) {
        p = c(p), E = f(E);
        var I = this.map[p];
        this.map[p] = I ? I + ", " + E : E;
      }, l.prototype.delete = function(p) {
        delete this.map[c(p)];
      }, l.prototype.get = function(p) {
        return p = c(p), this.has(p) ? this.map[p] : null;
      }, l.prototype.has = function(p) {
        return this.map.hasOwnProperty(c(p));
      }, l.prototype.set = function(p, E) {
        this.map[c(p)] = f(E);
      }, l.prototype.forEach = function(p, E) {
        for (var I in this.map)
          this.map.hasOwnProperty(I) && p.call(E, this.map[I], I, this);
      }, l.prototype.keys = function() {
        var p = [];
        return this.forEach(function(E, I) {
          p.push(I);
        }), u(p);
      }, l.prototype.values = function() {
        var p = [];
        return this.forEach(function(E) {
          p.push(E);
        }), u(p);
      }, l.prototype.entries = function() {
        var p = [];
        return this.forEach(function(E, I) {
          p.push([I, E]);
        }), u(p);
      }, r.iterable && (l.prototype[Symbol.iterator] = l.prototype.entries);
      function a(p) {
        if (!p._noBody) {
          if (p.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          p.bodyUsed = !0;
        }
      }
      function b(p) {
        return new Promise(function(E, I) {
          p.onload = function() {
            E(p.result);
          }, p.onerror = function() {
            I(p.error);
          };
        });
      }
      function d(p) {
        var E = new FileReader(), I = b(E);
        return E.readAsArrayBuffer(p), I;
      }
      function g(p) {
        var E = new FileReader(), I = b(E), D = /charset=([A-Za-z0-9_-]+)/.exec(p.type), V = D ? D[1] : "utf-8";
        return E.readAsText(p, V), I;
      }
      function y(p) {
        for (var E = new Uint8Array(p), I = new Array(E.length), D = 0; D < E.length; D++)
          I[D] = String.fromCharCode(E[D]);
        return I.join("");
      }
      function B(p) {
        if (p.slice)
          return p.slice(0);
        var E = new Uint8Array(p.byteLength);
        return E.set(new Uint8Array(p)), E.buffer;
      }
      function H() {
        return this.bodyUsed = !1, this._initBody = function(p) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = p, p ? typeof p == "string" ? this._bodyText = p : r.blob && Blob.prototype.isPrototypeOf(p) ? this._bodyBlob = p : r.formData && FormData.prototype.isPrototypeOf(p) ? this._bodyFormData = p : r.searchParams && URLSearchParams.prototype.isPrototypeOf(p) ? this._bodyText = p.toString() : r.arrayBuffer && r.blob && s(p) ? (this._bodyArrayBuffer = B(p.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(p) || o(p)) ? this._bodyArrayBuffer = B(p) : this._bodyText = p = Object.prototype.toString.call(p) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof p == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(p) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
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
              return this.blob().then(d);
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
          return this.text().then(S);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var L = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function x(p) {
        var E = p.toUpperCase();
        return L.indexOf(E) > -1 ? E : p;
      }
      function $(p, E) {
        if (!(this instanceof $))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        E = E || {};
        var I = E.body;
        if (p instanceof $) {
          if (p.bodyUsed)
            throw new TypeError("Already read");
          this.url = p.url, this.credentials = p.credentials, E.headers || (this.headers = new l(p.headers)), this.method = p.method, this.mode = p.mode, this.signal = p.signal, !I && p._bodyInit != null && (I = p._bodyInit, p.bodyUsed = !0);
        } else
          this.url = String(p);
        if (this.credentials = E.credentials || this.credentials || "same-origin", (E.headers || !this.headers) && (this.headers = new l(E.headers)), this.method = x(E.method || this.method || "GET"), this.mode = E.mode || this.mode || null, this.signal = E.signal || this.signal || function() {
          if ("AbortController" in n) {
            var N = new AbortController();
            return N.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && I)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(I), (this.method === "GET" || this.method === "HEAD") && (E.cache === "no-store" || E.cache === "no-cache")) {
          var D = /([?&])_=[^&]*/;
          if (D.test(this.url))
            this.url = this.url.replace(D, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var V = /\?/;
            this.url += (V.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      $.prototype.clone = function() {
        return new $(this, { body: this._bodyInit });
      };
      function S(p) {
        var E = new FormData();
        return p.trim().split("&").forEach(function(I) {
          if (I) {
            var D = I.split("="), V = D.shift().replace(/\+/g, " "), N = D.join("=").replace(/\+/g, " ");
            E.append(decodeURIComponent(V), decodeURIComponent(N));
          }
        }), E;
      }
      function P(p) {
        var E = new l(), I = p.replace(/\r?\n[\t ]+/g, " ");
        return I.split("\r").map(function(D) {
          return D.indexOf(`
`) === 0 ? D.substr(1, D.length) : D;
        }).forEach(function(D) {
          var V = D.split(":"), N = V.shift().trim();
          if (N) {
            var Re = V.join(":").trim();
            try {
              E.append(N, Re);
            } catch (wn) {
              console.warn("Response " + wn.message);
            }
          }
        }), E;
      }
      H.call($.prototype);
      function k(p, E) {
        if (!(this instanceof k))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (E || (E = {}), this.type = "default", this.status = E.status === void 0 ? 200 : E.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = E.statusText === void 0 ? "" : "" + E.statusText, this.headers = new l(E.headers), this.url = E.url || "", this._initBody(p);
      }
      H.call(k.prototype), k.prototype.clone = function() {
        return new k(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new l(this.headers),
          url: this.url
        });
      }, k.error = function() {
        var p = new k(null, { status: 200, statusText: "" });
        return p.ok = !1, p.status = 0, p.type = "error", p;
      };
      var U = [301, 302, 303, 307, 308];
      k.redirect = function(p, E) {
        if (U.indexOf(E) === -1)
          throw new RangeError("Invalid status code");
        return new k(null, { status: E, headers: { location: p } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(E, I) {
          this.message = E, this.name = I;
          var D = Error(E);
          this.stack = D.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function O(p, E) {
        return new Promise(function(I, D) {
          var V = new $(p, E);
          if (V.signal && V.signal.aborted)
            return D(new e.DOMException("Aborted", "AbortError"));
          var N = new XMLHttpRequest();
          function Re() {
            N.abort();
          }
          N.onload = function() {
            var J = {
              statusText: N.statusText,
              headers: P(N.getAllResponseHeaders() || "")
            };
            V.url.indexOf("file://") === 0 && (N.status < 200 || N.status > 599) ? J.status = 200 : J.status = N.status, J.url = "responseURL" in N ? N.responseURL : J.headers.get("X-Request-URL");
            var K = "response" in N ? N.response : N.responseText;
            setTimeout(function() {
              I(new k(K, J));
            }, 0);
          }, N.onerror = function() {
            setTimeout(function() {
              D(new TypeError("Network request failed"));
            }, 0);
          }, N.ontimeout = function() {
            setTimeout(function() {
              D(new TypeError("Network request timed out"));
            }, 0);
          }, N.onabort = function() {
            setTimeout(function() {
              D(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function wn(J) {
            try {
              return J === "" && n.location.href ? n.location.href : J;
            } catch {
              return J;
            }
          }
          if (N.open(V.method, wn(V.url), !0), V.credentials === "include" ? N.withCredentials = !0 : V.credentials === "omit" && (N.withCredentials = !1), "responseType" in N && (r.blob ? N.responseType = "blob" : r.arrayBuffer && (N.responseType = "arraybuffer")), E && typeof E.headers == "object" && !(E.headers instanceof l || n.Headers && E.headers instanceof n.Headers)) {
            var Fn = [];
            Object.getOwnPropertyNames(E.headers).forEach(function(J) {
              Fn.push(c(J)), N.setRequestHeader(J, f(E.headers[J]));
            }), V.headers.forEach(function(J, K) {
              Fn.indexOf(K) === -1 && N.setRequestHeader(K, J);
            });
          } else
            V.headers.forEach(function(J, K) {
              N.setRequestHeader(K, J);
            });
          V.signal && (V.signal.addEventListener("abort", Re), N.onreadystatechange = function() {
            N.readyState === 4 && V.signal.removeEventListener("abort", Re);
          }), N.send(typeof V._bodyInit > "u" ? null : V._bodyInit);
        });
      }
      return O.polyfill = !0, n.fetch || (n.fetch = O, n.Headers = l, n.Request = $, n.Response = k), e.Headers = l, e.Request = $, e.Response = k, e.fetch = O, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : rt);
})();
const t1 = "https://browser.blockstack.org/auth", e1 = {
  "@type": "Person",
  "@context": "http://schema.org"
}, $0 = ["store_write"], n1 = "blockstack-session", r1 = {
  logLevel: "debug"
}, ke = {
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
Object.freeze(ke);
class gn extends Error {
  constructor(e) {
    super();
    let n = e.message, r = `Error Code: ${e.code}`, s = this.stack;
    if (s)
      r += `Stack Trace:
${s}`;
    else
      try {
        throw new Error();
      } catch (i) {
        s = i.stack;
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
class s1 extends gn {
  constructor(e, n = "") {
    super({ code: ke.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class ec extends gn {
  constructor(e = "") {
    super({ code: ke.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Qn extends gn {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: ke.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class nc extends gn {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: ke.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Ds extends gn {
  constructor(e) {
    super({ code: ke.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class v0 extends gn {
  constructor(e) {
    super({ code: ke.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const rc = ["debug", "info", "warn", "error", "none"], ks = {};
for (let t = 0; t < rc.length; t++) {
  const e = rc[t];
  ks[e] = t;
}
class Je {
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
    return ks[r1.logLevel] <= ks[e];
  }
}
function i1() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function o1() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function ps(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function c1() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function a1() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function f1(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function $i(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = a1(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    Je.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = f1(s, t.toString(), n);
    throw Je.error(i), new Error(i);
  }
  if (r)
    return {};
}
function h1(t) {
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
  if (g1(t, Uint8Array))
    return BigInt(`0x${bt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function l1(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function vi(t, e = 8) {
  return (typeof t == "bigint" ? t : h1(t)).toString(16).padStart(e * 2, "0");
}
function _0(t, e = 16) {
  const n = vi(t, e);
  return at(n);
}
function u1(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const d1 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function bt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += d1[n];
  return e;
}
function at(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = l1(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function Dn(t) {
  return new TextEncoder().encode(t);
}
function H0(t) {
  return new TextDecoder().decode(t);
}
function b1(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function p1(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function sc(t) {
  if (t.some(p1))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Gt(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, s) => r + s.length, 0), n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function xn(t) {
  return Gt(...t.map((e) => typeof e == "number" ? sc([e]) : e instanceof Array ? sc(e) : e));
}
function g1(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const x1 = "https://api.mainnet.hiro.so", y1 = "https://api.testnet.hiro.so", w1 = "http://localhost:3999", m1 = "https://hub.blockstack.org";
function S1(t) {
  const e = typeof t == "string" ? at(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Gr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const E1 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function A1(t, e) {
  const n = {};
  return Object.assign(n, E1, e), await fetch(t, n);
}
function B1(t) {
  let e = A1, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function $1(...t) {
  const { fetchLib: e, middlewares: n } = B1(t);
  return async (s, i) => {
    let o = { url: s, init: i ?? {} };
    for (const f of n)
      typeof f.pre == "function" && (o = await Promise.resolve(f.pre({
        fetch: e,
        ...o
      })) ?? o);
    let c = await e(o.url, o.init);
    for (const f of n)
      typeof f.post == "function" && (c = await Promise.resolve(f.post({
        fetch: e,
        url: o.url,
        init: o.init,
        response: (c == null ? void 0 : c.clone()) ?? c
      })) ?? c);
    return c;
  };
}
class L0 {
  constructor(e = $0.slice(), n = ((c) => (c = $i("location", { returnEmptyObject: !0 })) == null ? void 0 : c.origin)(), r = "", s = "/manifest.json", i = void 0, o = t1) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Ts(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function v1(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function I0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function _1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ts(t.outputLen), Ts(t.blockLen);
}
function H1(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function L1(t, e) {
  I0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const _e = {
  number: Ts,
  bool: v1,
  bytes: I0,
  hash: _1,
  exists: H1,
  output: L1
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const gs = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Et = (t, e) => t << 32 - e | t >>> e, I1 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!I1)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function U1(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function _i(t) {
  if (typeof t == "string" && (t = U1(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let U0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Te(t) {
  const e = (r) => t().update(_i(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let O0 = class extends U0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, _e.hash(e);
    const r = _i(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, i = new Uint8Array(s);
    i.set(r.length > s ? e.create().update(r).digest() : r);
    for (let o = 0; o < i.length; o++)
      i[o] ^= 54;
    this.iHash.update(i), this.oHash = e.create();
    for (let o = 0; o < i.length; o++)
      i[o] ^= 106;
    this.oHash.update(i), i.fill(0);
  }
  update(e) {
    return _e.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    _e.exists(this), _e.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: c } = this;
    return e = e, e.finished = s, e.destroyed = i, e.blockLen = o, e.outputLen = c, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Rr = (t, e, n) => new O0(t, e).update(n).digest();
Rr.create = (t, e) => new O0(t, e);
function O1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, o, r), t.setUint32(e + u, c, r);
}
let Hi = class extends U0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = gs(this.buffer);
  }
  update(e) {
    _e.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = _i(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const f = gs(e);
        for (; s <= i - o; o += s)
          this.process(f, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    _e.exists(this), _e.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let a = o; a < s; a++)
      n[a] = 0;
    O1(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = gs(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = f / 4, l = this.get();
    if (u > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let a = 0; a < u; a++)
      c.setUint32(4 * a, l[a], i);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: c } = this;
    return e.length = s, e.pos = c, e.finished = i, e.destroyed = o, s % n && e.buffer.set(r), e;
  }
};
const C1 = (t, e, n) => t & e ^ ~t & n, P1 = (t, e, n) => t & e ^ t & n ^ e & n, N1 = new Uint32Array([
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
]), Zt = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Jt = new Uint32Array(64);
let C0 = class extends Hi {
  constructor() {
    super(64, 32, 8, !1), this.A = Zt[0] | 0, this.B = Zt[1] | 0, this.C = Zt[2] | 0, this.D = Zt[3] | 0, this.E = Zt[4] | 0, this.F = Zt[5] | 0, this.G = Zt[6] | 0, this.H = Zt[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: o, G: c, H: f } = this;
    return [e, n, r, s, i, o, c, f];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, f) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = c | 0, this.H = f | 0;
  }
  process(e, n) {
    for (let a = 0; a < 16; a++, n += 4)
      Jt[a] = e.getUint32(n, !1);
    for (let a = 16; a < 64; a++) {
      const b = Jt[a - 15], d = Jt[a - 2], g = Et(b, 7) ^ Et(b, 18) ^ b >>> 3, y = Et(d, 17) ^ Et(d, 19) ^ d >>> 10;
      Jt[a] = y + Jt[a - 7] + g + Jt[a - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: f, G: u, H: l } = this;
    for (let a = 0; a < 64; a++) {
      const b = Et(c, 6) ^ Et(c, 11) ^ Et(c, 25), d = l + b + C1(c, f, u) + N1[a] + Jt[a] | 0, y = (Et(r, 2) ^ Et(r, 13) ^ Et(r, 22)) + P1(r, s, i) | 0;
      l = u, u = f, f = c, c = o + d | 0, o = i, i = s, s = r, r = d + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, l = l + this.H | 0, this.set(r, s, i, o, c, f, u, l);
  }
  roundClean() {
    Jt.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, D1 = class extends C0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const cn = Te(() => new C0());
Te(() => new D1());
var kn = {};
kn.byteLength = G1;
var k1 = kn.toByteArray = V1, T1 = kn.fromByteArray = j1, vt = [], ut = [], F1 = typeof Uint8Array < "u" ? Uint8Array : Array, xs = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var We = 0, M1 = xs.length; We < M1; ++We)
  vt[We] = xs[We], ut[xs.charCodeAt(We)] = We;
ut[45] = 62;
ut[95] = 63;
function P0(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function G1(t) {
  var e = P0(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function R1(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function V1(t) {
  var e, n = P0(t), r = n[0], s = n[1], i = new F1(R1(t, r, s)), o = 0, c = s > 0 ? r - 4 : r, f;
  for (f = 0; f < c; f += 4)
    e = ut[t.charCodeAt(f)] << 18 | ut[t.charCodeAt(f + 1)] << 12 | ut[t.charCodeAt(f + 2)] << 6 | ut[t.charCodeAt(f + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = ut[t.charCodeAt(f)] << 2 | ut[t.charCodeAt(f + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = ut[t.charCodeAt(f)] << 10 | ut[t.charCodeAt(f + 1)] << 4 | ut[t.charCodeAt(f + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function K1(t) {
  return vt[t >> 18 & 63] + vt[t >> 12 & 63] + vt[t >> 6 & 63] + vt[t & 63];
}
function z1(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(K1(r));
  return s.join("");
}
function j1(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, c = n - r; o < c; o += i)
    s.push(z1(t, o, o + i > c ? c : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    vt[e >> 2] + vt[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    vt[e >> 10] + vt[e >> 4 & 63] + vt[e << 2 & 63] + "="
  )), s.join("");
}
function q1() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const W1 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function X1() {
  if (q1())
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
    throw new Error(W1);
  }
}
class Y1 {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(Gt(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(Gt(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class Z1 {
  constructor(e) {
    this.subtleCrypto = e;
  }
  async encrypt(e, n, r, s) {
    let i, o;
    if (e === "aes-128-cbc")
      i = "AES-CBC", o = 128;
    else if (e === "aes-256-cbc")
      i = "AES-CBC", o = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const c = await this.subtleCrypto.importKey("raw", n, { name: i, length: o }, !1, ["encrypt"]), f = await this.subtleCrypto.encrypt({ name: i, iv: r }, c, s);
    return new Uint8Array(f);
  }
  async decrypt(e, n, r, s) {
    let i, o;
    if (e === "aes-128-cbc")
      i = "AES-CBC", o = 128;
    else if (e === "aes-256-cbc")
      i = "AES-CBC", o = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const c = await this.subtleCrypto.importKey("raw", n, { name: i, length: o }, !1, ["decrypt"]), f = await this.subtleCrypto.decrypt({ name: i, iv: r }, c, s);
    return new Uint8Array(f);
  }
}
async function N0() {
  const t = await X1();
  return t.name === "subtleCrypto" ? new Z1(t.lib) : new Y1(t.lib.createCipheriv, t.lib.createDecipheriv);
}
const J1 = d0, Q1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var t2 = J1(Q1);
const e2 = /* @__PURE__ */ Tu(t2), n2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), D0 = Uint8Array.from({ length: 16 }, (t, e) => e), r2 = D0.map((t) => (9 * t + 5) % 16);
let Li = [D0], Ii = [r2];
for (let t = 0; t < 4; t++)
  for (let e of [Li, Ii])
    e.push(e[t].map((n) => n2[n]));
const k0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), s2 = Li.map((t, e) => t.map((n) => k0[e][n])), i2 = Ii.map((t, e) => t.map((n) => k0[e][n])), o2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), c2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), tr = (t, e) => t << e | t >>> 32 - e;
function ic(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const er = new Uint32Array(16);
let a2 = class extends Hi {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: s, h4: i } = this;
    return [e, n, r, s, i];
  }
  set(e, n, r, s, i) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = i | 0;
  }
  process(e, n) {
    for (let d = 0; d < 16; d++, n += 4)
      er[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, f = c, u = this.h3 | 0, l = u, a = this.h4 | 0, b = a;
    for (let d = 0; d < 5; d++) {
      const g = 4 - d, y = o2[d], B = c2[d], H = Li[d], L = Ii[d], x = s2[d], $ = i2[d];
      for (let S = 0; S < 16; S++) {
        const P = tr(r + ic(d, i, c, u) + er[H[S]] + y, x[S]) + a | 0;
        r = a, a = u, u = tr(c, 10) | 0, c = i, i = P;
      }
      for (let S = 0; S < 16; S++) {
        const P = tr(s + ic(g, o, f, l) + er[L[S]] + B, $[S]) + b | 0;
        s = b, b = l, l = tr(f, 10) | 0, f = o, o = P;
      }
    }
    this.set(this.h1 + c + l | 0, this.h2 + u + b | 0, this.h3 + a + s | 0, this.h4 + r + o | 0, this.h0 + i + f | 0);
  }
  roundClean() {
    er.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const f2 = Te(() => new a2());
function h2(t) {
  return f2(t);
}
const nr = BigInt(2 ** 32 - 1), Fs = BigInt(32);
function T0(t, e = !1) {
  return e ? { h: Number(t & nr), l: Number(t >> Fs & nr) } : { h: Number(t >> Fs & nr) | 0, l: Number(t & nr) | 0 };
}
function l2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = T0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const u2 = (t, e) => BigInt(t >>> 0) << Fs | BigInt(e >>> 0), d2 = (t, e, n) => t >>> n, b2 = (t, e, n) => t << 32 - n | e >>> n, p2 = (t, e, n) => t >>> n | e << 32 - n, g2 = (t, e, n) => t << 32 - n | e >>> n, x2 = (t, e, n) => t << 64 - n | e >>> n - 32, y2 = (t, e, n) => t >>> n - 32 | e << 64 - n, w2 = (t, e) => e, m2 = (t, e) => t, S2 = (t, e, n) => t << n | e >>> 32 - n, E2 = (t, e, n) => e << n | t >>> 32 - n, A2 = (t, e, n) => e << n - 32 | t >>> 64 - n, B2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function $2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const v2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), _2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, H2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), L2 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, I2 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), U2 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, F = {
  fromBig: T0,
  split: l2,
  toBig: u2,
  shrSH: d2,
  shrSL: b2,
  rotrSH: p2,
  rotrSL: g2,
  rotrBH: x2,
  rotrBL: y2,
  rotr32H: w2,
  rotr32L: m2,
  rotlSH: S2,
  rotlSL: E2,
  rotlBH: A2,
  rotlBL: B2,
  add: $2,
  add3L: v2,
  add3H: _2,
  add4L: H2,
  add4H: L2,
  add5H: U2,
  add5L: I2
}, [O2, C2] = F.split([
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
].map((t) => BigInt(t))), Qt = new Uint32Array(80), te = new Uint32Array(80);
let Vr = class extends Hi {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: f, Eh: u, El: l, Fh: a, Fl: b, Gh: d, Gl: g, Hh: y, Hl: B } = this;
    return [e, n, r, s, i, o, c, f, u, l, a, b, d, g, y, B];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, f, u, l, a, b, d, g, y, B) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = f | 0, this.Eh = u | 0, this.El = l | 0, this.Fh = a | 0, this.Fl = b | 0, this.Gh = d | 0, this.Gl = g | 0, this.Hh = y | 0, this.Hl = B | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      Qt[x] = e.getUint32(n), te[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const $ = Qt[x - 15] | 0, S = te[x - 15] | 0, P = F.rotrSH($, S, 1) ^ F.rotrSH($, S, 8) ^ F.shrSH($, S, 7), k = F.rotrSL($, S, 1) ^ F.rotrSL($, S, 8) ^ F.shrSL($, S, 7), U = Qt[x - 2] | 0, O = te[x - 2] | 0, p = F.rotrSH(U, O, 19) ^ F.rotrBH(U, O, 61) ^ F.shrSH(U, O, 6), E = F.rotrSL(U, O, 19) ^ F.rotrBL(U, O, 61) ^ F.shrSL(U, O, 6), I = F.add4L(k, E, te[x - 7], te[x - 16]), D = F.add4H(I, P, p, Qt[x - 7], Qt[x - 16]);
      Qt[x] = D | 0, te[x] = I | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: f, Dh: u, Dl: l, Eh: a, El: b, Fh: d, Fl: g, Gh: y, Gl: B, Hh: H, Hl: L } = this;
    for (let x = 0; x < 80; x++) {
      const $ = F.rotrSH(a, b, 14) ^ F.rotrSH(a, b, 18) ^ F.rotrBH(a, b, 41), S = F.rotrSL(a, b, 14) ^ F.rotrSL(a, b, 18) ^ F.rotrBL(a, b, 41), P = a & d ^ ~a & y, k = b & g ^ ~b & B, U = F.add5L(L, S, k, C2[x], te[x]), O = F.add5H(U, H, $, P, O2[x], Qt[x]), p = U | 0, E = F.rotrSH(r, s, 28) ^ F.rotrBH(r, s, 34) ^ F.rotrBH(r, s, 39), I = F.rotrSL(r, s, 28) ^ F.rotrBL(r, s, 34) ^ F.rotrBL(r, s, 39), D = r & i ^ r & c ^ i & c, V = s & o ^ s & f ^ o & f;
      H = y | 0, L = B | 0, y = d | 0, B = g | 0, d = a | 0, g = b | 0, { h: a, l: b } = F.add(u | 0, l | 0, O | 0, p | 0), u = c | 0, l = f | 0, c = i | 0, f = o | 0, i = r | 0, o = s | 0;
      const N = F.add3L(p, I, V);
      r = F.add3H(N, O, E, D), s = N | 0;
    }
    ({ h: r, l: s } = F.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = F.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l: f } = F.add(this.Ch | 0, this.Cl | 0, c | 0, f | 0), { h: u, l } = F.add(this.Dh | 0, this.Dl | 0, u | 0, l | 0), { h: a, l: b } = F.add(this.Eh | 0, this.El | 0, a | 0, b | 0), { h: d, l: g } = F.add(this.Fh | 0, this.Fl | 0, d | 0, g | 0), { h: y, l: B } = F.add(this.Gh | 0, this.Gl | 0, y | 0, B | 0), { h: H, l: L } = F.add(this.Hh | 0, this.Hl | 0, H | 0, L | 0), this.set(r, s, i, o, c, f, u, l, a, b, d, g, y, B, H, L);
  }
  roundClean() {
    Qt.fill(0), te.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, P2 = class extends Vr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, N2 = class extends Vr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, D2 = class extends Vr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const k2 = Te(() => new Vr());
Te(() => new P2());
Te(() => new N2());
Te(() => new D2());
function F0(t) {
  return cn(t);
}
function T2(t) {
  return k2(t);
}
const F2 = 0;
Z.hmacSha256Sync = (t, ...e) => {
  const n = Rr.create(cn, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function M2() {
  return bt(Z.randomPrivateKey());
}
function G2(t) {
  const e = cn(cn(t));
  return e2.encode(Gt(t, e).slice(0, t.length + 4));
}
function R2(t, e) {
  return G2(Gt(new Uint8Array([t]), e.slice(0, 20)));
}
function M0(t, e = F2) {
  const n = typeof t == "string" ? at(t) : t, r = h2(F0(n));
  return R2(e, r);
}
function G0(t) {
  const e = S1(t);
  return bt(pi(e.slice(0, 32), !0));
}
Z.hmacSha256Sync = (t, ...e) => {
  const n = Rr.create(cn, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var _r;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(_r || (_r = {}));
async function V2(t, e, n) {
  return await (await N0()).encrypt("aes-256-cbc", e, t, n);
}
async function K2(t, e, n) {
  return await (await N0()).decrypt("aes-256-cbc", e, t, n);
}
function R0(t, e) {
  return Rr(cn, t, e);
}
function z2(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function V0(t) {
  const e = T2(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function j2(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function q2(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: _r.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: _r.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !j2(t))
    return e;
  try {
    return j.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function W2(t, e, n, r) {
  const s = q2(t);
  if (!s.result)
    throw s;
  const i = Z.randomPrivateKey(), o = pi(i, !0);
  let c = gi(i, t, !0);
  c = c.slice(1);
  const f = V0(c), u = Z.randomBytes(16), l = await V2(u, f.encryptionKey, e), a = Gt(u, o, l), b = R0(f.hmacKey, a);
  let d;
  if (!r || r === "hex")
    d = bt(l);
  else if (r === "base64")
    d = T1(l);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const g = {
    iv: bt(u),
    ephemeralPK: bt(o),
    cipherText: d,
    mac: bt(b),
    wasString: n
  };
  return r && r !== "hex" && (g.cipherTextEncoding = r), g;
}
async function K0(t, e) {
  if (!e.ephemeralPK)
    throw new nc("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = gi(t, n, !0);
  r = r.slice(1);
  const s = V0(r), i = at(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = at(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = k1(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const c = Gt(i, at(n), o), f = R0(s.hmacKey, c), u = at(e.mac);
  if (!z2(u, f))
    throw new nc("Decryption failed: failure in MAC check");
  const l = await K2(i, s.encryptionKey, o);
  return e.wasString ? H0(l) : l;
}
function X2(t, e) {
  const n = typeof e == "string" ? Dn(e) : e, r = G0(t), s = F0(n), i = Xa(s, t);
  return {
    signature: bt(i),
    publicKey: r
  };
}
async function Y2(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = G0(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? Dn(t) : t, o = await W2(n.publicKey, i, s, n.cipherTextEncoding);
  let c = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const f = X2(r, c), u = {
      signature: f.signature,
      publicKey: f.publicKey,
      cipherText: c
    };
    c = JSON.stringify(u);
  }
  return c;
}
function Z2(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return K0(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var st = {}, an = {}, nt = {};
Object.defineProperty(nt, "__esModule", { value: !0 });
nt.decode = nt.encode = nt.unescape = nt.escape = nt.pad = void 0;
const z0 = kn;
function Ui(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
nt.pad = Ui;
function j0(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
nt.escape = j0;
function q0(t) {
  return Ui(t).replace(/-/g, "+").replace(/_/g, "/");
}
nt.unescape = q0;
function J2(t) {
  return j0((0, z0.fromByteArray)(new TextEncoder().encode(t)));
}
nt.encode = J2;
function Q2(t) {
  return new TextDecoder().decode((0, z0.toByteArray)(Ui(q0(t))));
}
nt.decode = Q2;
var Kr = {}, zr = {};
let Oi = class extends Si {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, n0(e);
    const r = pn(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, i = new Uint8Array(s);
    i.set(r.length > s ? e.create().update(r).digest() : r);
    for (let o = 0; o < i.length; o++)
      i[o] ^= 54;
    this.iHash.update(i), this.oHash = e.create();
    for (let o = 0; o < i.length; o++)
      i[o] ^= 106;
    this.oHash.update(i), Ln(i);
  }
  update(e) {
    return Hn(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Hn(this), Ee(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: c } = this;
    return e = e, e.finished = s, e.destroyed = i, e.blockLen = o, e.outputLen = c, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const W0 = (t, e, n) => new Oi(t, e).update(n).digest();
W0.create = (t, e) => new Oi(t, e);
const tb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HMAC: Oi,
  hmac: W0
}, Symbol.toStringTag, { value: "Module" })), eb = /* @__PURE__ */ Cn(tb), nb = /* @__PURE__ */ Cn(ku);
var fn = {};
Object.defineProperty(fn, "__esModule", { value: !0 });
fn.joseToDer = fn.derToJose = void 0;
const X0 = kn, Y0 = nt;
function ys(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const rb = {
  ES256: ys(256),
  ES384: ys(384),
  ES512: ys(521)
};
function Z0(t) {
  const e = rb[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Hr = 128, J0 = 0, sb = 32, ib = 16, ob = 2, Q0 = ib | sb | J0 << 6, Lr = ob | J0 << 6;
function tf(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, X0.toByteArray)((0, Y0.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function cb(t, e) {
  const n = tf(t), r = Z0(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== Q0)
    throw new Error('Could not find expected "seq"');
  let c = n[o++];
  if (c === (Hr | 1) && (c = n[o++]), i - o < c)
    throw new Error(`"seq" specified length of "${c}", only "${i - o}" remaining`);
  if (n[o++] !== Lr)
    throw new Error('Could not find expected "int" for "r"');
  const f = n[o++];
  if (i - o - 2 < f)
    throw new Error(`"r" specified length of "${f}", only "${i - o - 2}" available`);
  if (s < f)
    throw new Error(`"r" specified length of "${f}", max of "${s}" is acceptable`);
  const u = o;
  if (o += f, n[o++] !== Lr)
    throw new Error('Could not find expected "int" for "s"');
  const l = n[o++];
  if (i - o !== l)
    throw new Error(`"s" specified length of "${l}", expected "${i - o}"`);
  if (s < l)
    throw new Error(`"s" specified length of "${l}", max of "${s}" is acceptable`);
  const a = o;
  if (o += l, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const b = r - f, d = r - l, g = new Uint8Array(b + f + d + l);
  for (o = 0; o < b; ++o)
    g[o] = 0;
  g.set(n.subarray(u + Math.max(-b, 0), u + f), o), o = r;
  for (const y = o; o < y + d; ++o)
    g[o] = 0;
  return g.set(n.subarray(a + Math.max(-d, 0), a + l), o), (0, Y0.escape)((0, X0.fromByteArray)(g));
}
fn.derToJose = cb;
function oc(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Hr && --r, r;
}
function ab(t, e) {
  t = tf(t);
  const n = Z0(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = oc(t, 0, n), i = oc(t, n, t.length), o = n - s, c = n - i, f = 2 + o + 1 + 1 + c, u = f < Hr, l = new Uint8Array((u ? 2 : 3) + f);
  let a = 0;
  return l[a++] = Q0, u ? l[a++] = f : (l[a++] = Hr | 1, l[a++] = f & 255), l[a++] = Lr, l[a++] = o, s < 0 ? (l[a++] = 0, l.set(t.subarray(0, n), a), a += n) : (l.set(t.subarray(s, n), a), a += n - s), l[a++] = Lr, l[a++] = c, i < 0 ? (l[a++] = 0, l.set(t.subarray(n), a)) : l.set(t.subarray(n + i), a), l;
}
fn.joseToDer = ab;
var Rt = {};
Object.defineProperty(Rt, "__esModule", { value: !0 });
Rt.InvalidTokenError = Rt.MissingParametersError = void 0;
class fb extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Rt.MissingParametersError = fb;
class hb extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Rt.InvalidTokenError = hb;
Object.defineProperty(zr, "__esModule", { value: !0 });
zr.SECP256K1Client = void 0;
const lb = eb, ub = Mr, wr = nb, cc = fn, ac = Rt, fc = Pn;
wr.utils.hmacSha256Sync = (t, ...e) => {
  const n = lb.hmac.create(ub.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class ef {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, fc.bytesToHex)(wr.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new ac.MissingParametersError("a signing input hash and private key are all required");
    const s = wr.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, fc.bytesToHex)(s);
    if (r === "jose")
      return (0, cc.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, cc.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new ac.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return wr.verify(n, e, r, { strict: !1 });
  }
}
zr.SECP256K1Client = ef;
ef.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = zr;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(Kr);
var Ce = {};
const db = /* @__PURE__ */ Cn(Ma);
var bb = rt && rt.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function c(l) {
      try {
        u(r.next(l));
      } catch (a) {
        o(a);
      }
    }
    function f(l) {
      try {
        u(r.throw(l));
      } catch (a) {
        o(a);
      }
    }
    function u(l) {
      l.done ? i(l.value) : s(l.value).then(c, f);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Ce, "__esModule", { value: !0 });
Ce.hashSha256Async = Ce.hashSha256 = void 0;
const pb = Mr;
function nf(t) {
  return (0, pb.sha256)(t);
}
Ce.hashSha256 = nf;
function gb(t) {
  return bb(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = db;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(nf(t));
    }
  });
}
Ce.hashSha256Async = gb;
var xb = rt && rt.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function c(l) {
      try {
        u(r.next(l));
      } catch (a) {
        o(a);
      }
    }
    function f(l) {
      try {
        u(r.throw(l));
      } catch (a) {
        o(a);
      }
    }
    function u(l) {
      l.done ? i(l.value) : s(l.value).then(c, f);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(an, "__esModule", { value: !0 });
an.TokenSigner = an.createUnsecuredToken = void 0;
const Ms = nt, hc = Kr, yb = Rt, lc = Ce;
function Gs(t, e) {
  const n = [], r = Ms.encode(JSON.stringify(e));
  n.push(r);
  const s = Ms.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function wb(t) {
  return Gs(t, { typ: "JWT", alg: "none" }) + ".";
}
an.createUnsecuredToken = wb;
class mb {
  constructor(e, n) {
    if (!(e && n))
      throw new yb.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !hc.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = hc.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = Gs(e, s), o = (0, lc.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return xb(this, void 0, void 0, function* () {
      const s = this.header(r), i = Gs(e, s), o = yield (0, lc.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [Ms.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
an.TokenSigner = mb;
var jr = {};
Object.defineProperty(jr, "__esModule", { value: !0 });
jr.TokenVerifier = void 0;
const Sb = nt, uc = Kr, Eb = Rt, rr = Ce;
class Ab {
  constructor(e, n) {
    if (!(e && n))
      throw new Eb.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !uc.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = uc.cryptoClients[e], this.rawPublicKey = n;
  }
  verify(e) {
    return typeof e == "string" ? this.verifyCompact(e, !1) : typeof e == "object" ? this.verifyExpanded(e, !1) : !1;
  }
  verifyAsync(e) {
    return typeof e == "string" ? this.verifyCompact(e, !0) : typeof e == "object" ? this.verifyExpanded(e, !0) : Promise.resolve(!1);
  }
  verifyCompact(e, n) {
    const r = e.split("."), s = r[0] + "." + r[1], i = (o) => {
      const c = this.cryptoClient.loadSignature(r[2]);
      return this.cryptoClient.verifyHash(o, c, this.rawPublicKey);
    };
    if (n)
      return (0, rr.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, rr.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), Sb.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((c) => {
      const f = this.cryptoClient.loadSignature(c);
      this.cryptoClient.verifyHash(o, f, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, rr.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, rr.hashSha256)(r);
      return i(o);
    }
  }
}
jr.TokenVerifier = Ab;
var qr = {};
Object.defineProperty(qr, "__esModule", { value: !0 });
qr.decodeToken = void 0;
const sr = nt;
function Bb(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(sr.decode(e[0])), r = JSON.parse(sr.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = sr.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(sr.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
qr.decodeToken = Bb;
(function(t) {
  var e = rt && rt.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var c = Object.getOwnPropertyDescriptor(s, i);
    (!c || ("get" in c ? !s.__esModule : c.writable || c.configurable)) && (c = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, c);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = rt && rt.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(an, t), n(jr, t), n(qr, t), n(Rt, t), n(Kr, t);
})(st);
function $b(t) {
  return `did:btc-addr:${t}`;
}
function vb(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new ec("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new ec('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function rf(t) {
  if (t)
    return vb(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const _b = "1.4.0";
function Hb() {
  return M2();
}
function Lb(t, e, n, r = $0.slice(), s, i = i1().getTime(), o = {}) {
  const c = (d) => {
    const g = $i("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${d}=undefined])`
    });
    return g == null ? void 0 : g.origin;
  };
  e || (e = `${c("redirectURI")}/`), n || (n = `${c("manifestURI")}/manifest.json`), s || (s = c("appDomain"));
  const f = Object.assign({}, o, {
    jti: c1(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: _b,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = st.SECP256K1Client.derivePublicKey(t);
  f.public_keys = [u];
  const l = M0(u);
  return f.iss = $b(l), new st.TokenSigner("ES256k", t).sign(f);
}
async function dc(t, e) {
  const n = H0(at(e)), r = JSON.parse(n), s = await K0(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function Ib(t) {
  const e = st.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new st.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function Ub(t) {
  const e = st.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = rf(e.iss);
  if (n.length === 1) {
    if (M0(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function Ob(t) {
  const e = st.decodeToken(t).payload;
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
function Cb(t) {
  const e = st.decodeToken(t).payload;
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
function Pb(t) {
  const e = [
    Cb(t),
    Ob(t),
    Ib(t),
    Ub(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const bc = "1.0.0";
class Se {
  constructor(e) {
    this.version = bc, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== bc)
      throw new Ds(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Se(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class sf {
  constructor(e) {
    if (e) {
      const n = new Se(e);
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
class pc extends sf {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Se({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new v0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Se({})), !0;
  }
}
class gc extends sf {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = n1, !localStorage.getItem(this.key)) {
      const r = new Se({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new v0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Se.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Se({})), !0;
  }
}
var In;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(In || (In = {}));
var Ir;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Ir || (Ir = {}));
In.Mainnet;
var Tt;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Tt || (Tt = {}));
var Ht;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ht || (Ht = {}));
Tt.Mainnet;
const of = {
  chainId: In.Mainnet,
  transactionVersion: Tt.Mainnet,
  peerNetworkId: Ir.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Ht.MainnetSingleSig,
    multiSig: Ht.MainnetMultiSig
  },
  client: { baseUrl: x1 }
}, Rs = {
  chainId: In.Testnet,
  transactionVersion: Tt.Testnet,
  peerNetworkId: Ir.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Ht.TestnetSingleSig,
    multiSig: Ht.TestnetMultiSig
  },
  client: { baseUrl: y1 }
}, mr = {
  ...Rs,
  addressVersion: { ...Rs.addressVersion },
  magicBytes: "id",
  client: { baseUrl: w1 }
}, Nb = {
  ...mr,
  addressVersion: { ...mr.addressVersion },
  client: { ...mr.client }
};
function Db(t) {
  switch (t) {
    case "mainnet":
      return of;
    case "testnet":
      return Rs;
    case "devnet":
      return mr;
    case "mocknet":
      return Nb;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function cf(t) {
  return typeof t == "string" ? Db(t) : t;
}
var xc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(xc || (xc = {}));
var yc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(yc || (yc = {}));
var xt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(xt || (xt = {}));
const ws = ["onChainOnly", "offChainOnly", "any"];
ws[0] + "", xt.OnChainOnly, ws[1] + "", xt.OffChainOnly, ws[2] + "", xt.Any, xt.OnChainOnly + "", xt.OnChainOnly, xt.OffChainOnly + "", xt.OffChainOnly, xt.Any + "", xt.Any;
var wc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(wc || (wc = {}));
var mc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(mc || (mc = {}));
var Sc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Sc || (Sc = {}));
var kt;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(kt || (kt = {}));
var Ec;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ec || (Ec = {}));
var Ac;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ac || (Ac = {}));
var Bc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Bc || (Bc = {}));
var $c;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})($c || ($c = {}));
var vc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(vc || (vc = {}));
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
function Vs(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function kb(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function af(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Tb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Vs(t.outputLen), Vs(t.blockLen);
}
function Fb(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Mb(t, e) {
  af(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const He = {
  number: Vs,
  bool: kb,
  bytes: af,
  hash: Tb,
  exists: Fb,
  output: Mb
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ms = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), At = (t, e) => t << 32 - e | t >>> e, Gb = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Gb)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Rb(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Ci(t) {
  if (typeof t == "string" && (t = Rb(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let ff = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Fe(t) {
  const e = (r) => t().update(Ci(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
class hf extends ff {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, He.hash(e);
    const r = Ci(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, i = new Uint8Array(s);
    i.set(r.length > s ? e.create().update(r).digest() : r);
    for (let o = 0; o < i.length; o++)
      i[o] ^= 54;
    this.iHash.update(i), this.oHash = e.create();
    for (let o = 0; o < i.length; o++)
      i[o] ^= 106;
    this.oHash.update(i), i.fill(0);
  }
  update(e) {
    return He.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    He.exists(this), He.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: c } = this;
    return e = e, e.finished = s, e.destroyed = i, e.blockLen = o, e.outputLen = c, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const lf = (t, e, n) => new hf(t, e).update(n).digest();
lf.create = (t, e) => new hf(t, e);
function Vb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, o, r), t.setUint32(e + u, c, r);
}
let Pi = class extends ff {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ms(this.buffer);
  }
  update(e) {
    He.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Ci(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const f = ms(e);
        for (; s <= i - o; o += s)
          this.process(f, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    He.exists(this), He.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let a = o; a < s; a++)
      n[a] = 0;
    Vb(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = ms(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = f / 4, l = this.get();
    if (u > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let a = 0; a < u; a++)
      c.setUint32(4 * a, l[a], i);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: c } = this;
    return e.length = s, e.pos = c, e.finished = i, e.destroyed = o, s % n && e.buffer.set(r), e;
  }
};
const Kb = (t, e, n) => t & e ^ ~t & n, zb = (t, e, n) => t & e ^ t & n ^ e & n, jb = new Uint32Array([
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
let uf = class extends Pi {
  constructor() {
    super(64, 32, 8, !1), this.A = ee[0] | 0, this.B = ee[1] | 0, this.C = ee[2] | 0, this.D = ee[3] | 0, this.E = ee[4] | 0, this.F = ee[5] | 0, this.G = ee[6] | 0, this.H = ee[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: o, G: c, H: f } = this;
    return [e, n, r, s, i, o, c, f];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, f) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = c | 0, this.H = f | 0;
  }
  process(e, n) {
    for (let a = 0; a < 16; a++, n += 4)
      ne[a] = e.getUint32(n, !1);
    for (let a = 16; a < 64; a++) {
      const b = ne[a - 15], d = ne[a - 2], g = At(b, 7) ^ At(b, 18) ^ b >>> 3, y = At(d, 17) ^ At(d, 19) ^ d >>> 10;
      ne[a] = y + ne[a - 7] + g + ne[a - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: f, G: u, H: l } = this;
    for (let a = 0; a < 64; a++) {
      const b = At(c, 6) ^ At(c, 11) ^ At(c, 25), d = l + b + Kb(c, f, u) + jb[a] + ne[a] | 0, y = (At(r, 2) ^ At(r, 13) ^ At(r, 22)) + zb(r, s, i) | 0;
      l = u, u = f, f = c, c = o + d | 0, o = i, i = s, s = r, r = d + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, l = l + this.H | 0, this.set(r, s, i, o, c, f, u, l);
  }
  roundClean() {
    ne.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, qb = class extends uf {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const df = Fe(() => new uf());
Fe(() => new qb());
function Wb(t, e) {
  switch (e = cf(e ?? of), t) {
    case kt.P2PKH:
      switch (e.transactionVersion) {
        case Tt.Mainnet:
          return Ht.MainnetSingleSig;
        case Tt.Testnet:
          return Ht.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case kt.P2SH:
    case kt.P2SHNonSequential:
    case kt.P2WPKH:
    case kt.P2WSH:
    case kt.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Tt.Mainnet:
          return Ht.MainnetMultiSig;
        case Tt.Testnet:
          return Ht.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const Xb = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), bf = Uint8Array.from({ length: 16 }, (t, e) => e), Yb = bf.map((t) => (9 * t + 5) % 16);
let Ni = [bf], Di = [Yb];
for (let t = 0; t < 4; t++)
  for (let e of [Ni, Di])
    e.push(e[t].map((n) => Xb[n]));
const pf = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Zb = Ni.map((t, e) => t.map((n) => pf[e][n])), Jb = Di.map((t, e) => t.map((n) => pf[e][n])), Qb = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), tp = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ir = (t, e) => t << e | t >>> 32 - e;
function Uc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const or = new Uint32Array(16);
let ep = class extends Pi {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: s, h4: i } = this;
    return [e, n, r, s, i];
  }
  set(e, n, r, s, i) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = i | 0;
  }
  process(e, n) {
    for (let d = 0; d < 16; d++, n += 4)
      or[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, f = c, u = this.h3 | 0, l = u, a = this.h4 | 0, b = a;
    for (let d = 0; d < 5; d++) {
      const g = 4 - d, y = Qb[d], B = tp[d], H = Ni[d], L = Di[d], x = Zb[d], $ = Jb[d];
      for (let S = 0; S < 16; S++) {
        const P = ir(r + Uc(d, i, c, u) + or[H[S]] + y, x[S]) + a | 0;
        r = a, a = u, u = ir(c, 10) | 0, c = i, i = P;
      }
      for (let S = 0; S < 16; S++) {
        const P = ir(s + Uc(g, o, f, l) + or[L[S]] + B, $[S]) + b | 0;
        s = b, b = l, l = ir(f, 10) | 0, f = o, o = P;
      }
    }
    this.set(this.h1 + c + l | 0, this.h2 + u + b | 0, this.h3 + a + s | 0, this.h4 + r + o | 0, this.h0 + i + f | 0);
  }
  roundClean() {
    or.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const np = Fe(() => new ep()), cr = BigInt(2 ** 32 - 1), Ks = BigInt(32);
function gf(t, e = !1) {
  return e ? { h: Number(t & cr), l: Number(t >> Ks & cr) } : { h: Number(t >> Ks & cr) | 0, l: Number(t & cr) | 0 };
}
function rp(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = gf(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const sp = (t, e) => BigInt(t >>> 0) << Ks | BigInt(e >>> 0), ip = (t, e, n) => t >>> n, op = (t, e, n) => t << 32 - n | e >>> n, cp = (t, e, n) => t >>> n | e << 32 - n, ap = (t, e, n) => t << 32 - n | e >>> n, fp = (t, e, n) => t << 64 - n | e >>> n - 32, hp = (t, e, n) => t >>> n - 32 | e << 64 - n, lp = (t, e) => e, up = (t, e) => t, dp = (t, e, n) => t << n | e >>> 32 - n, bp = (t, e, n) => e << n | t >>> 32 - n, pp = (t, e, n) => e << n - 32 | t >>> 64 - n, gp = (t, e, n) => t << n - 32 | e >>> 64 - n;
function xp(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const yp = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), wp = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, mp = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Sp = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Ep = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Ap = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, M = {
  fromBig: gf,
  split: rp,
  toBig: sp,
  shrSH: ip,
  shrSL: op,
  rotrSH: cp,
  rotrSL: ap,
  rotrBH: fp,
  rotrBL: hp,
  rotr32H: lp,
  rotr32L: up,
  rotlSH: dp,
  rotlSL: bp,
  rotlBH: pp,
  rotlBL: gp,
  add: xp,
  add3L: yp,
  add3H: wp,
  add4L: mp,
  add4H: Sp,
  add5H: Ap,
  add5L: Ep
}, [Bp, $p] = M.split([
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
let Wr = class extends Pi {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: f, Eh: u, El: l, Fh: a, Fl: b, Gh: d, Gl: g, Hh: y, Hl: B } = this;
    return [e, n, r, s, i, o, c, f, u, l, a, b, d, g, y, B];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, f, u, l, a, b, d, g, y, B) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = f | 0, this.Eh = u | 0, this.El = l | 0, this.Fh = a | 0, this.Fl = b | 0, this.Gh = d | 0, this.Gl = g | 0, this.Hh = y | 0, this.Hl = B | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      re[x] = e.getUint32(n), se[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const $ = re[x - 15] | 0, S = se[x - 15] | 0, P = M.rotrSH($, S, 1) ^ M.rotrSH($, S, 8) ^ M.shrSH($, S, 7), k = M.rotrSL($, S, 1) ^ M.rotrSL($, S, 8) ^ M.shrSL($, S, 7), U = re[x - 2] | 0, O = se[x - 2] | 0, p = M.rotrSH(U, O, 19) ^ M.rotrBH(U, O, 61) ^ M.shrSH(U, O, 6), E = M.rotrSL(U, O, 19) ^ M.rotrBL(U, O, 61) ^ M.shrSL(U, O, 6), I = M.add4L(k, E, se[x - 7], se[x - 16]), D = M.add4H(I, P, p, re[x - 7], re[x - 16]);
      re[x] = D | 0, se[x] = I | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: f, Dh: u, Dl: l, Eh: a, El: b, Fh: d, Fl: g, Gh: y, Gl: B, Hh: H, Hl: L } = this;
    for (let x = 0; x < 80; x++) {
      const $ = M.rotrSH(a, b, 14) ^ M.rotrSH(a, b, 18) ^ M.rotrBH(a, b, 41), S = M.rotrSL(a, b, 14) ^ M.rotrSL(a, b, 18) ^ M.rotrBL(a, b, 41), P = a & d ^ ~a & y, k = b & g ^ ~b & B, U = M.add5L(L, S, k, $p[x], se[x]), O = M.add5H(U, H, $, P, Bp[x], re[x]), p = U | 0, E = M.rotrSH(r, s, 28) ^ M.rotrBH(r, s, 34) ^ M.rotrBH(r, s, 39), I = M.rotrSL(r, s, 28) ^ M.rotrBL(r, s, 34) ^ M.rotrBL(r, s, 39), D = r & i ^ r & c ^ i & c, V = s & o ^ s & f ^ o & f;
      H = y | 0, L = B | 0, y = d | 0, B = g | 0, d = a | 0, g = b | 0, { h: a, l: b } = M.add(u | 0, l | 0, O | 0, p | 0), u = c | 0, l = f | 0, c = i | 0, f = o | 0, i = r | 0, o = s | 0;
      const N = M.add3L(p, I, V);
      r = M.add3H(N, O, E, D), s = N | 0;
    }
    ({ h: r, l: s } = M.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = M.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l: f } = M.add(this.Ch | 0, this.Cl | 0, c | 0, f | 0), { h: u, l } = M.add(this.Dh | 0, this.Dl | 0, u | 0, l | 0), { h: a, l: b } = M.add(this.Eh | 0, this.El | 0, a | 0, b | 0), { h: d, l: g } = M.add(this.Fh | 0, this.Fl | 0, d | 0, g | 0), { h: y, l: B } = M.add(this.Gh | 0, this.Gl | 0, y | 0, B | 0), { h: H, l: L } = M.add(this.Hh | 0, this.Hl | 0, H | 0, L | 0), this.set(r, s, i, o, c, f, u, l, a, b, d, g, y, B, H, L);
  }
  roundClean() {
    re.fill(0), se.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, vp = class extends Wr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, _p = class extends Wr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Hp = class extends Wr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Fe(() => new Wr());
Fe(() => new vp());
Fe(() => new _p());
Fe(() => new Hp());
var zs;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(zs || (zs = {}));
function Lp(t, e) {
  return { type: zs.Address, version: t, hash160: e };
}
function Ip(t) {
  return bn.c32address(t.version, t.hash160);
}
const Up = (t) => np(df(t)), Op = (t) => bt(Up(t));
Z.hmacSha256Sync = (t, ...e) => {
  const n = lf.create(df, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Cp(t, e = "mainnet") {
  e = cf(e), t = typeof t == "string" ? at(t) : t;
  const n = Wb(kt.P2PKH, e), r = Lp(n, Op(t));
  return Ip(r);
}
function Pp(t, e) {
  const n = st.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = Cp(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new st.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function Np(t, e = null) {
  let n;
  e ? n = Pp(t, e) : n = st.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const Oc = "_blockstackDidCheckEchoReply", Dp = "echoReply", kp = "authContinuation";
function Tp(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function Fp() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[Oc];
  if (typeof e == "boolean")
    return e;
  const n = Tp(t.location.search), r = n[Dp];
  if (r) {
    t[Oc] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[kp];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class js {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new L0();
    else
      throw new s1("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new gc(e.sessionOptions) : this.store = new gc() : e ? this.store = new pc(e.sessionOptions) : this.store = new pc();
  }
  makeAuthRequestToken(e, n, r, s, i, o = o1().getTime(), c = {}) {
    const f = this.appConfig;
    if (!f)
      throw new Ds("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || f.redirectURI(), r = r || f.manifestURI(), s = s || f.scopes, i = i || f.appDomain, Lb(e, n, r, s, i, o, c);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = Hb();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = $i("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (Fp())
        return Je.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Je.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = $1()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Qn("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = st.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await Pb(e))
      throw new Qn("Invalid authentication response.");
    let c = i.private_key, f = i.core_token;
    if (ps(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            c = await dc(s, i.private_key);
          } catch {
            if (Je.warn("Failed decryption of appPrivateKey, will try to use as given"), !Z.isValidPrivateKey(i.private_key))
              throw new Qn("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (f != null)
          try {
            f = await dc(s, f);
          } catch {
            Je.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Qn("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = m1, l;
    ps(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (u = i.hubUrl), ps(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (l = i.associationToken);
    const a = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: rf(i.iss),
      appPrivateKey: c,
      coreSessionToken: f,
      authResponseToken: e,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: l
    }, b = i.profile_url;
    if (!a.profile && b) {
      const d = await n(b);
      if (!d.ok)
        a.profile = Object.assign({}, e1);
      else {
        const g = await d.text(), y = JSON.parse(g);
        a.profile = Np(y[0].token);
      }
    } else
      a.profile = i.profile;
    return r.userData = a, this.store.setSessionData(r), a;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new Ds("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Y2(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Z2(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
js.prototype.makeAuthRequest = js.prototype.makeAuthRequestToken;
const Mp = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), xf = "STX_PROVIDER", yf = () => typeof window > "u" ? null : window.localStorage.getItem(xf), Gp = (t) => {
  typeof window < "u" && window.localStorage.setItem(xf, t);
}, Rp = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Vp(t, e) {
  const n = {};
  return Object.assign(n, Rp, e), await fetch(t, n);
}
function Kp(t) {
  let e = Vp, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function zp(...t) {
  const { fetchLib: e, middlewares: n } = Kp(t);
  return async (s, i) => {
    let o = { url: s, init: i ?? {} };
    for (const f of n)
      typeof f.pre == "function" && (o = await Promise.resolve(f.pre({
        fetch: e,
        ...o
      })) ?? o);
    let c = await e(o.url, o.init);
    for (const f of n)
      typeof f.post == "function" && (c = await Promise.resolve(f.post({
        fetch: e,
        url: o.url,
        init: o.init,
        response: (c == null ? void 0 : c.clone()) ?? c
      })) ?? c);
    return c;
  };
}
var hn;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(hn || (hn = {}));
var Pe;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Pe || (Pe = {}));
var Cc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Cc || (Cc = {}));
const jp = "https://api.mainnet.hiro.so", qp = "https://api.testnet.hiro.so", Wp = "http://localhost:3999", Xp = ["mainnet", "testnet", "devnet", "mocknet"];
class Ne {
  constructor(e) {
    this.version = Pe.Mainnet, this.chainId = hn.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Pe.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? zp();
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
Ne.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new qs();
    case "testnet":
      return new Ws();
    case "devnet":
      return new Yp();
    case "mocknet":
      return new wf();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Xp.join(", ")}`);
  }
};
Ne.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Ne.fromName(t);
class qs extends Ne {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? jp,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Pe.Mainnet, this.chainId = hn.Mainnet;
  }
}
class Ws extends Ne {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? qp,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Pe.Testnet, this.chainId = hn.Testnet;
  }
}
class wf extends Ne {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Wp,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Pe.Testnet, this.chainId = hn.Testnet;
  }
}
const Yp = wf;
var Xs;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Xs || (Xs = {}));
var Pc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Pc || (Pc = {}));
Xs.Mainnet;
var Ur;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ur || (Ur = {}));
var Nc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Nc || (Nc = {}));
Ur.Mainnet;
const Zp = 128, Jp = 128, mf = 16;
var Dc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Dc || (Dc = {}));
var kc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(kc || (kc = {}));
var yt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(yt || (yt = {}));
const Ss = ["onChainOnly", "offChainOnly", "any"];
Ss[0] + "", yt.OnChainOnly, Ss[1] + "", yt.OffChainOnly, Ss[2] + "", yt.Any, yt.OnChainOnly + "", yt.OnChainOnly, yt.OffChainOnly + "", yt.OffChainOnly, yt.Any + "", yt.Any;
var Tc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Tc || (Tc = {}));
var Fc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Fc || (Fc = {}));
var Mc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Mc || (Mc = {}));
var Gc;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Gc || (Gc = {}));
var Rc;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Rc || (Rc = {}));
var Vc;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Vc || (Vc = {}));
var Kc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Kc || (Kc = {}));
var zc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(zc || (zc = {}));
var jc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(jc || (jc = {}));
var qc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(qc || (qc = {}));
var Wc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Wc || (Wc = {}));
var Xc;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Xc || (Xc = {}));
var Yc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Yc || (Yc = {}));
let Qp = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, tg = class extends Qp {
  constructor(e) {
    super(e);
  }
};
function Ys(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function eg(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Sf(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function ng(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ys(t.outputLen), Ys(t.blockLen);
}
function rg(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function sg(t, e) {
  Sf(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Es = {
  number: Ys,
  bool: eg,
  bytes: Sf,
  hash: ng,
  exists: rg,
  output: sg
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const As = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Bt = (t, e) => t << 32 - e | t >>> e, ig = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!ig)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function og(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Ef(t) {
  if (typeof t == "string" && (t = og(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let cg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Me(t) {
  const e = (r) => t().update(Ef(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function ag(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, o, r), t.setUint32(e + u, c, r);
}
let ki = class extends cg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = As(this.buffer);
  }
  update(e) {
    Es.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Ef(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const f = As(e);
        for (; s <= i - o; o += s)
          this.process(f, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Es.exists(this), Es.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let a = o; a < s; a++)
      n[a] = 0;
    ag(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = As(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = f / 4, l = this.get();
    if (u > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let a = 0; a < u; a++)
      c.setUint32(4 * a, l[a], i);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: c } = this;
    return e.length = s, e.pos = c, e.finished = i, e.destroyed = o, s % n && e.buffer.set(r), e;
  }
};
const fg = (t, e, n) => t & e ^ ~t & n, hg = (t, e, n) => t & e ^ t & n ^ e & n, lg = new Uint32Array([
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
]), oe = new Uint32Array(64);
let Af = class extends ki {
  constructor() {
    super(64, 32, 8, !1), this.A = ie[0] | 0, this.B = ie[1] | 0, this.C = ie[2] | 0, this.D = ie[3] | 0, this.E = ie[4] | 0, this.F = ie[5] | 0, this.G = ie[6] | 0, this.H = ie[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: o, G: c, H: f } = this;
    return [e, n, r, s, i, o, c, f];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, f) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = c | 0, this.H = f | 0;
  }
  process(e, n) {
    for (let a = 0; a < 16; a++, n += 4)
      oe[a] = e.getUint32(n, !1);
    for (let a = 16; a < 64; a++) {
      const b = oe[a - 15], d = oe[a - 2], g = Bt(b, 7) ^ Bt(b, 18) ^ b >>> 3, y = Bt(d, 17) ^ Bt(d, 19) ^ d >>> 10;
      oe[a] = y + oe[a - 7] + g + oe[a - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: f, G: u, H: l } = this;
    for (let a = 0; a < 64; a++) {
      const b = Bt(c, 6) ^ Bt(c, 11) ^ Bt(c, 25), d = l + b + fg(c, f, u) + lg[a] + oe[a] | 0, y = (Bt(r, 2) ^ Bt(r, 13) ^ Bt(r, 22)) + hg(r, s, i) | 0;
      l = u, u = f, f = c, c = o + d | 0, o = i, i = s, s = r, r = d + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, l = l + this.H | 0, this.set(r, s, i, o, c, f, u, l);
  }
  roundClean() {
    oe.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, ug = class extends Af {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Me(() => new Af());
Me(() => new ug());
const dg = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Bf = Uint8Array.from({ length: 16 }, (t, e) => e), bg = Bf.map((t) => (9 * t + 5) % 16);
let Ti = [Bf], Fi = [bg];
for (let t = 0; t < 4; t++)
  for (let e of [Ti, Fi])
    e.push(e[t].map((n) => dg[n]));
const $f = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), pg = Ti.map((t, e) => t.map((n) => $f[e][n])), gg = Fi.map((t, e) => t.map((n) => $f[e][n])), xg = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), yg = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ar = (t, e) => t << e | t >>> 32 - e;
function Zc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const fr = new Uint32Array(16);
let wg = class extends ki {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: s, h4: i } = this;
    return [e, n, r, s, i];
  }
  set(e, n, r, s, i) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = i | 0;
  }
  process(e, n) {
    for (let d = 0; d < 16; d++, n += 4)
      fr[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, f = c, u = this.h3 | 0, l = u, a = this.h4 | 0, b = a;
    for (let d = 0; d < 5; d++) {
      const g = 4 - d, y = xg[d], B = yg[d], H = Ti[d], L = Fi[d], x = pg[d], $ = gg[d];
      for (let S = 0; S < 16; S++) {
        const P = ar(r + Zc(d, i, c, u) + fr[H[S]] + y, x[S]) + a | 0;
        r = a, a = u, u = ar(c, 10) | 0, c = i, i = P;
      }
      for (let S = 0; S < 16; S++) {
        const P = ar(s + Zc(g, o, f, l) + fr[L[S]] + B, $[S]) + b | 0;
        s = b, b = l, l = ar(f, 10) | 0, f = o, o = P;
      }
    }
    this.set(this.h1 + c + l | 0, this.h2 + u + b | 0, this.h3 + a + s | 0, this.h4 + r + o | 0, this.h0 + i + f | 0);
  }
  roundClean() {
    fr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Me(() => new wg());
const hr = BigInt(2 ** 32 - 1), Zs = BigInt(32);
function vf(t, e = !1) {
  return e ? { h: Number(t & hr), l: Number(t >> Zs & hr) } : { h: Number(t >> Zs & hr) | 0, l: Number(t & hr) | 0 };
}
function mg(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = vf(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Sg = (t, e) => BigInt(t >>> 0) << Zs | BigInt(e >>> 0), Eg = (t, e, n) => t >>> n, Ag = (t, e, n) => t << 32 - n | e >>> n, Bg = (t, e, n) => t >>> n | e << 32 - n, $g = (t, e, n) => t << 32 - n | e >>> n, vg = (t, e, n) => t << 64 - n | e >>> n - 32, _g = (t, e, n) => t >>> n - 32 | e << 64 - n, Hg = (t, e) => e, Lg = (t, e) => t, Ig = (t, e, n) => t << n | e >>> 32 - n, Ug = (t, e, n) => e << n | t >>> 32 - n, Og = (t, e, n) => e << n - 32 | t >>> 64 - n, Cg = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Pg(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Ng = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Dg = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, kg = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Tg = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Fg = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Mg = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, G = {
  fromBig: vf,
  split: mg,
  toBig: Sg,
  shrSH: Eg,
  shrSL: Ag,
  rotrSH: Bg,
  rotrSL: $g,
  rotrBH: vg,
  rotrBL: _g,
  rotr32H: Hg,
  rotr32L: Lg,
  rotlSH: Ig,
  rotlSL: Ug,
  rotlBH: Og,
  rotlBL: Cg,
  add: Pg,
  add3L: Ng,
  add3H: Dg,
  add4L: kg,
  add4H: Tg,
  add5H: Mg,
  add5L: Fg
}, [Gg, Rg] = G.split([
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
].map((t) => BigInt(t))), ce = new Uint32Array(80), ae = new Uint32Array(80);
let Xr = class extends ki {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: f, Eh: u, El: l, Fh: a, Fl: b, Gh: d, Gl: g, Hh: y, Hl: B } = this;
    return [e, n, r, s, i, o, c, f, u, l, a, b, d, g, y, B];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, f, u, l, a, b, d, g, y, B) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = f | 0, this.Eh = u | 0, this.El = l | 0, this.Fh = a | 0, this.Fl = b | 0, this.Gh = d | 0, this.Gl = g | 0, this.Hh = y | 0, this.Hl = B | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      ce[x] = e.getUint32(n), ae[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const $ = ce[x - 15] | 0, S = ae[x - 15] | 0, P = G.rotrSH($, S, 1) ^ G.rotrSH($, S, 8) ^ G.shrSH($, S, 7), k = G.rotrSL($, S, 1) ^ G.rotrSL($, S, 8) ^ G.shrSL($, S, 7), U = ce[x - 2] | 0, O = ae[x - 2] | 0, p = G.rotrSH(U, O, 19) ^ G.rotrBH(U, O, 61) ^ G.shrSH(U, O, 6), E = G.rotrSL(U, O, 19) ^ G.rotrBL(U, O, 61) ^ G.shrSL(U, O, 6), I = G.add4L(k, E, ae[x - 7], ae[x - 16]), D = G.add4H(I, P, p, ce[x - 7], ce[x - 16]);
      ce[x] = D | 0, ae[x] = I | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: f, Dh: u, Dl: l, Eh: a, El: b, Fh: d, Fl: g, Gh: y, Gl: B, Hh: H, Hl: L } = this;
    for (let x = 0; x < 80; x++) {
      const $ = G.rotrSH(a, b, 14) ^ G.rotrSH(a, b, 18) ^ G.rotrBH(a, b, 41), S = G.rotrSL(a, b, 14) ^ G.rotrSL(a, b, 18) ^ G.rotrBL(a, b, 41), P = a & d ^ ~a & y, k = b & g ^ ~b & B, U = G.add5L(L, S, k, Rg[x], ae[x]), O = G.add5H(U, H, $, P, Gg[x], ce[x]), p = U | 0, E = G.rotrSH(r, s, 28) ^ G.rotrBH(r, s, 34) ^ G.rotrBH(r, s, 39), I = G.rotrSL(r, s, 28) ^ G.rotrBL(r, s, 34) ^ G.rotrBL(r, s, 39), D = r & i ^ r & c ^ i & c, V = s & o ^ s & f ^ o & f;
      H = y | 0, L = B | 0, y = d | 0, B = g | 0, d = a | 0, g = b | 0, { h: a, l: b } = G.add(u | 0, l | 0, O | 0, p | 0), u = c | 0, l = f | 0, c = i | 0, f = o | 0, i = r | 0, o = s | 0;
      const N = G.add3L(p, I, V);
      r = G.add3H(N, O, E, D), s = N | 0;
    }
    ({ h: r, l: s } = G.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = G.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l: f } = G.add(this.Ch | 0, this.Cl | 0, c | 0, f | 0), { h: u, l } = G.add(this.Dh | 0, this.Dl | 0, u | 0, l | 0), { h: a, l: b } = G.add(this.Eh | 0, this.El | 0, a | 0, b | 0), { h: d, l: g } = G.add(this.Fh | 0, this.Fl | 0, d | 0, g | 0), { h: y, l: B } = G.add(this.Gh | 0, this.Gl | 0, y | 0, B | 0), { h: H, l: L } = G.add(this.Hh | 0, this.Hl | 0, H | 0, L | 0), this.set(r, s, i, o, c, f, u, l, a, b, d, g, y, B, H, L);
  }
  roundClean() {
    ce.fill(0), ae.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Vg = class extends Xr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Kg = class extends Xr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, zg = class extends Xr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Me(() => new Xr());
Me(() => new Vg());
Me(() => new Kg());
Me(() => new zg());
var Q;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(Q || (Q = {}));
var Js;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Js || (Js = {}));
function Mi(t) {
  return Js[t];
}
var Or;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Or || (Or = {}));
function _f(t, e, n) {
  const s = Zp;
  if (sx(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Or.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
function Hf(t) {
  const e = bn.c32addressDecode(t);
  return {
    type: Or.Address,
    version: e[0],
    hash160: e[1]
  };
}
function Lf(t) {
  const e = [];
  return e.push(at(vi(t.version, 1))), e.push(at(t.hash160)), xn(e);
}
function If(t) {
  const e = [], n = Dn(t.content), r = n.byteLength;
  return e.push(at(vi(r, t.lengthPrefixBytes))), e.push(n), xn(e);
}
function Ut(t, e) {
  return xn([Mi(t), e]);
}
function jg(t) {
  return new Uint8Array([Mi(t.type)]);
}
function qg(t) {
  return t.type === Q.OptionalNone ? new Uint8Array([Mi(t.type)]) : Ut(t.type, Tn(t.value));
}
function Wg(t) {
  const e = new Uint8Array(4);
  return Gr(e, Math.ceil(t.value.length / 2), 0), Ut(t.type, Gt(e, at(t.value)));
}
function Xg(t) {
  const e = _0(u1(BigInt(t.value), BigInt(Jp)), mf);
  return Ut(t.type, e);
}
function Yg(t) {
  const e = _0(BigInt(t.value), mf);
  return Ut(t.type, e);
}
function Zg(t) {
  return Ut(t.type, Lf(Hf(t.value)));
}
function Jg(t) {
  const [e, n] = ix(t.value);
  return Ut(t.type, Gt(Lf(Hf(e)), If(_f(n))));
}
function Qg(t) {
  return Ut(t.type, Tn(t.value));
}
function tx(t) {
  const e = [], n = new Uint8Array(4);
  Gr(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = Tn(r);
    e.push(s);
  }
  return Ut(t.type, xn(e));
}
function ex(t) {
  const e = [], n = new Uint8Array(4);
  Gr(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = _f(s);
    e.push(If(i));
    const o = Tn(t.value[s]);
    e.push(o);
  }
  return Ut(t.type, xn(e));
}
function Uf(t, e) {
  const n = [], r = e == "ascii" ? b1(t.value) : Dn(t.value), s = new Uint8Array(4);
  return Gr(s, r.length, 0), n.push(s), n.push(r), Ut(t.type, xn(n));
}
function nx(t) {
  return Uf(t, "ascii");
}
function rx(t) {
  return Uf(t, "utf8");
}
function Jc(t) {
  return bt(Tn(t));
}
function Tn(t) {
  switch (t.type) {
    case Q.BoolTrue:
    case Q.BoolFalse:
      return jg(t);
    case Q.OptionalNone:
    case Q.OptionalSome:
      return qg(t);
    case Q.Buffer:
      return Wg(t);
    case Q.UInt:
      return Yg(t);
    case Q.Int:
      return Xg(t);
    case Q.PrincipalStandard:
      return Zg(t);
    case Q.PrincipalContract:
      return Jg(t);
    case Q.ResponseOk:
    case Q.ResponseErr:
      return Qg(t);
    case Q.List:
      return tx(t);
    case Q.Tuple:
      return ex(t);
    case Q.StringASCII:
      return nx(t);
    case Q.StringUTF8:
      return rx(t);
    default:
      throw new tg("Unable to serialize. Invalid Clarity Value.");
  }
}
const sx = (t, e) => t ? Dn(t).length > e : !1;
function ix(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
function ox(t, e) {
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
    return BigInt(`0x${fx(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Gi(t, e = 8) {
  return (typeof t == "bigint" ? t : ox(t)).toString(16).padStart(e * 2, "0");
}
function Of(t, e = 16) {
  const n = Gi(t, e);
  return Un(n);
}
function cx(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const ax = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function fx(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += ax[n];
  return e;
}
function Un(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t;
  const e = t.length % 2 ? `0${t}` : t, n = new Uint8Array(e.length / 2);
  for (let r = 0; r < n.length; r++) {
    const s = r * 2, i = e.slice(s, s + 2), o = Number.parseInt(i, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    n[r] = o;
  }
  return n;
}
function Ri(t) {
  return new TextEncoder().encode(t);
}
function hx(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function lx(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Qc(t) {
  if (t.some(lx))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Vi(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, s) => r + s.length, 0), n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function yn(t) {
  return Vi(...t.map((e) => typeof e == "number" ? Qc([e]) : e instanceof Array ? Qc(e) : e));
}
function Yr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Qs;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Qs || (Qs = {}));
Qs.Mainnet;
const ux = 128, dx = 128, Cf = 16;
var ti;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ti || (ti = {}));
var ta;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ta || (ta = {}));
var ea;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(ea || (ea = {}));
var wt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(wt || (wt = {}));
const Bs = ["onChainOnly", "offChainOnly", "any"];
Bs[0] + "", wt.OnChainOnly, Bs[1] + "", wt.OffChainOnly, Bs[2] + "", wt.Any, wt.OnChainOnly + "", wt.OnChainOnly, wt.OffChainOnly + "", wt.OffChainOnly, wt.Any + "", wt.Any;
var ei;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ei || (ei = {}));
ei.Mainnet;
var na;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(na || (na = {}));
var ra;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(ra || (ra = {}));
var sa;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(sa || (sa = {}));
var ia;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(ia || (ia = {}));
var oa;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(oa || (oa = {}));
var ca;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(ca || (ca = {}));
var aa;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(aa || (aa = {}));
var fa;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(fa || (fa = {}));
var ha;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ha || (ha = {}));
var la;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(la || (la = {}));
var ua;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(ua || (ua = {}));
function ni(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function bx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Pf(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function px(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ni(t.outputLen), ni(t.blockLen);
}
function gx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function xx(t, e) {
  Pf(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const $s = {
  number: ni,
  bool: bx,
  bytes: Pf,
  hash: px,
  exists: gx,
  output: xx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const vs = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), $t = (t, e) => t << 32 - e | t >>> e, yx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!yx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function wx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Nf(t) {
  if (typeof t == "string" && (t = wx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class mx {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Ge(t) {
  const e = (r) => t().update(Nf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Sx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, o, r), t.setUint32(e + u, c, r);
}
class Ki extends mx {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = vs(this.buffer);
  }
  update(e) {
    $s.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Nf(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const f = vs(e);
        for (; s <= i - o; o += s)
          this.process(f, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    $s.exists(this), $s.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let a = o; a < s; a++)
      n[a] = 0;
    Sx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = vs(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = f / 4, l = this.get();
    if (u > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let a = 0; a < u; a++)
      c.setUint32(4 * a, l[a], i);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: o, pos: c } = this;
    return e.length = s, e.pos = c, e.finished = i, e.destroyed = o, s % n && e.buffer.set(r), e;
  }
}
const Ex = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Df = Uint8Array.from({ length: 16 }, (t, e) => e), Ax = Df.map((t) => (9 * t + 5) % 16);
let zi = [Df], ji = [Ax];
for (let t = 0; t < 4; t++)
  for (let e of [zi, ji])
    e.push(e[t].map((n) => Ex[n]));
const kf = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Bx = zi.map((t, e) => t.map((n) => kf[e][n])), $x = ji.map((t, e) => t.map((n) => kf[e][n])), vx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), _x = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), lr = (t, e) => t << e | t >>> 32 - e;
function da(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ur = new Uint32Array(16);
class Hx extends Ki {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: s, h4: i } = this;
    return [e, n, r, s, i];
  }
  set(e, n, r, s, i) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = i | 0;
  }
  process(e, n) {
    for (let d = 0; d < 16; d++, n += 4)
      ur[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, f = c, u = this.h3 | 0, l = u, a = this.h4 | 0, b = a;
    for (let d = 0; d < 5; d++) {
      const g = 4 - d, y = vx[d], B = _x[d], H = zi[d], L = ji[d], x = Bx[d], $ = $x[d];
      for (let S = 0; S < 16; S++) {
        const P = lr(r + da(d, i, c, u) + ur[H[S]] + y, x[S]) + a | 0;
        r = a, a = u, u = lr(c, 10) | 0, c = i, i = P;
      }
      for (let S = 0; S < 16; S++) {
        const P = lr(s + da(g, o, f, l) + ur[L[S]] + B, $[S]) + b | 0;
        s = b, b = l, l = lr(f, 10) | 0, f = o, o = P;
      }
    }
    this.set(this.h1 + c + l | 0, this.h2 + u + b | 0, this.h3 + a + s | 0, this.h4 + r + o | 0, this.h0 + i + f | 0);
  }
  roundClean() {
    ur.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
Ge(() => new Hx());
const Lx = (t, e, n) => t & e ^ ~t & n, Ix = (t, e, n) => t & e ^ t & n ^ e & n, Ux = new Uint32Array([
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
class Tf extends Ki {
  constructor() {
    super(64, 32, 8, !1), this.A = fe[0] | 0, this.B = fe[1] | 0, this.C = fe[2] | 0, this.D = fe[3] | 0, this.E = fe[4] | 0, this.F = fe[5] | 0, this.G = fe[6] | 0, this.H = fe[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: o, G: c, H: f } = this;
    return [e, n, r, s, i, o, c, f];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, f) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = o | 0, this.G = c | 0, this.H = f | 0;
  }
  process(e, n) {
    for (let a = 0; a < 16; a++, n += 4)
      he[a] = e.getUint32(n, !1);
    for (let a = 16; a < 64; a++) {
      const b = he[a - 15], d = he[a - 2], g = $t(b, 7) ^ $t(b, 18) ^ b >>> 3, y = $t(d, 17) ^ $t(d, 19) ^ d >>> 10;
      he[a] = y + he[a - 7] + g + he[a - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: c, F: f, G: u, H: l } = this;
    for (let a = 0; a < 64; a++) {
      const b = $t(c, 6) ^ $t(c, 11) ^ $t(c, 25), d = l + b + Lx(c, f, u) + Ux[a] + he[a] | 0, y = ($t(r, 2) ^ $t(r, 13) ^ $t(r, 22)) + Ix(r, s, i) | 0;
      l = u, u = f, f = c, c = o + d | 0, o = i, i = s, s = r, r = d + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, l = l + this.H | 0, this.set(r, s, i, o, c, f, u, l);
  }
  roundClean() {
    he.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class Ox extends Tf {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
Ge(() => new Tf());
Ge(() => new Ox());
const dr = BigInt(2 ** 32 - 1), ri = BigInt(32);
function Ff(t, e = !1) {
  return e ? { h: Number(t & dr), l: Number(t >> ri & dr) } : { h: Number(t >> ri & dr) | 0, l: Number(t & dr) | 0 };
}
function Cx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Ff(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Px = (t, e) => BigInt(t >>> 0) << ri | BigInt(e >>> 0), Nx = (t, e, n) => t >>> n, Dx = (t, e, n) => t << 32 - n | e >>> n, kx = (t, e, n) => t >>> n | e << 32 - n, Tx = (t, e, n) => t << 32 - n | e >>> n, Fx = (t, e, n) => t << 64 - n | e >>> n - 32, Mx = (t, e, n) => t >>> n - 32 | e << 64 - n, Gx = (t, e) => e, Rx = (t, e) => t, Vx = (t, e, n) => t << n | e >>> 32 - n, Kx = (t, e, n) => e << n | t >>> 32 - n, zx = (t, e, n) => e << n - 32 | t >>> 64 - n, jx = (t, e, n) => t << n - 32 | e >>> 64 - n;
function qx(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Wx = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Xx = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Yx = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Zx = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Jx = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Qx = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, R = {
  fromBig: Ff,
  split: Cx,
  toBig: Px,
  shrSH: Nx,
  shrSL: Dx,
  rotrSH: kx,
  rotrSL: Tx,
  rotrBH: Fx,
  rotrBL: Mx,
  rotr32H: Gx,
  rotr32L: Rx,
  rotlSH: Vx,
  rotlSL: Kx,
  rotlBH: zx,
  rotlBL: jx,
  add: qx,
  add3L: Wx,
  add3H: Xx,
  add4L: Yx,
  add4H: Zx,
  add5H: Qx,
  add5L: Jx
}, [ty, ey] = R.split([
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
].map((t) => BigInt(t))), le = new Uint32Array(80), ue = new Uint32Array(80);
class Zr extends Ki {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: c, Dl: f, Eh: u, El: l, Fh: a, Fl: b, Gh: d, Gl: g, Hh: y, Hl: B } = this;
    return [e, n, r, s, i, o, c, f, u, l, a, b, d, g, y, B];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, c, f, u, l, a, b, d, g, y, B) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = f | 0, this.Eh = u | 0, this.El = l | 0, this.Fh = a | 0, this.Fl = b | 0, this.Gh = d | 0, this.Gl = g | 0, this.Hh = y | 0, this.Hl = B | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      le[x] = e.getUint32(n), ue[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const $ = le[x - 15] | 0, S = ue[x - 15] | 0, P = R.rotrSH($, S, 1) ^ R.rotrSH($, S, 8) ^ R.shrSH($, S, 7), k = R.rotrSL($, S, 1) ^ R.rotrSL($, S, 8) ^ R.shrSL($, S, 7), U = le[x - 2] | 0, O = ue[x - 2] | 0, p = R.rotrSH(U, O, 19) ^ R.rotrBH(U, O, 61) ^ R.shrSH(U, O, 6), E = R.rotrSL(U, O, 19) ^ R.rotrBL(U, O, 61) ^ R.shrSL(U, O, 6), I = R.add4L(k, E, ue[x - 7], ue[x - 16]), D = R.add4H(I, P, p, le[x - 7], le[x - 16]);
      le[x] = D | 0, ue[x] = I | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: c, Cl: f, Dh: u, Dl: l, Eh: a, El: b, Fh: d, Fl: g, Gh: y, Gl: B, Hh: H, Hl: L } = this;
    for (let x = 0; x < 80; x++) {
      const $ = R.rotrSH(a, b, 14) ^ R.rotrSH(a, b, 18) ^ R.rotrBH(a, b, 41), S = R.rotrSL(a, b, 14) ^ R.rotrSL(a, b, 18) ^ R.rotrBL(a, b, 41), P = a & d ^ ~a & y, k = b & g ^ ~b & B, U = R.add5L(L, S, k, ey[x], ue[x]), O = R.add5H(U, H, $, P, ty[x], le[x]), p = U | 0, E = R.rotrSH(r, s, 28) ^ R.rotrBH(r, s, 34) ^ R.rotrBH(r, s, 39), I = R.rotrSL(r, s, 28) ^ R.rotrBL(r, s, 34) ^ R.rotrBL(r, s, 39), D = r & i ^ r & c ^ i & c, V = s & o ^ s & f ^ o & f;
      H = y | 0, L = B | 0, y = d | 0, B = g | 0, d = a | 0, g = b | 0, { h: a, l: b } = R.add(u | 0, l | 0, O | 0, p | 0), u = c | 0, l = f | 0, c = i | 0, f = o | 0, i = r | 0, o = s | 0;
      const N = R.add3L(p, I, V);
      r = R.add3H(N, O, E, D), s = N | 0;
    }
    ({ h: r, l: s } = R.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = R.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: c, l: f } = R.add(this.Ch | 0, this.Cl | 0, c | 0, f | 0), { h: u, l } = R.add(this.Dh | 0, this.Dl | 0, u | 0, l | 0), { h: a, l: b } = R.add(this.Eh | 0, this.El | 0, a | 0, b | 0), { h: d, l: g } = R.add(this.Fh | 0, this.Fl | 0, d | 0, g | 0), { h: y, l: B } = R.add(this.Gh | 0, this.Gl | 0, y | 0, B | 0), { h: H, l: L } = R.add(this.Hh | 0, this.Hl | 0, H | 0, L | 0), this.set(r, s, i, o, c, f, u, l, a, b, d, g, y, B, H, L);
  }
  roundClean() {
    le.fill(0), ue.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class ny extends Zr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class ry extends Zr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class sy extends Zr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Ge(() => new Zr());
Ge(() => new ny());
Ge(() => new ry());
Ge(() => new sy());
function iy(t, e, n) {
  const s = ux;
  if (my(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ti.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var tt;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(tt || (tt = {}));
class oy extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class cy extends oy {
  constructor(e) {
    super(e);
  }
}
function Mf(t) {
  const e = [];
  return e.push(Un(Gi(t.version, 1))), e.push(Un(t.hash160)), yn(e);
}
function Gf(t) {
  const e = [], n = Ri(t.content), r = n.byteLength;
  return e.push(Un(Gi(r, t.lengthPrefixBytes))), e.push(n), yn(e);
}
function Ot(t, e) {
  return yn([t, e]);
}
function ay(t) {
  return new Uint8Array([t.type]);
}
function fy(t) {
  return t.type === tt.OptionalNone ? new Uint8Array([t.type]) : Ot(t.type, ln(t.value));
}
function hy(t) {
  const e = new Uint8Array(4);
  return Yr(e, t.buffer.length, 0), Ot(t.type, Vi(e, t.buffer));
}
function ly(t) {
  const e = Of(cx(t.value, BigInt(dx)), Cf);
  return Ot(t.type, e);
}
function uy(t) {
  const e = Of(t.value, Cf);
  return Ot(t.type, e);
}
function dy(t) {
  return Ot(t.type, Mf(t.address));
}
function by(t) {
  return Ot(t.type, Vi(Mf(t.address), Gf(t.contractName)));
}
function py(t) {
  return Ot(t.type, ln(t.value));
}
function gy(t) {
  const e = [], n = new Uint8Array(4);
  Yr(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = ln(r);
    e.push(s);
  }
  return Ot(t.type, yn(e));
}
function xy(t) {
  const e = [], n = new Uint8Array(4);
  Yr(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = iy(s);
    e.push(Gf(i));
    const o = ln(t.data[s]);
    e.push(o);
  }
  return Ot(t.type, yn(e));
}
function Rf(t, e) {
  const n = [], r = e == "ascii" ? hx(t.data) : Ri(t.data), s = new Uint8Array(4);
  return Yr(s, r.length, 0), n.push(s), n.push(r), Ot(t.type, yn(n));
}
function yy(t) {
  return Rf(t, "ascii");
}
function wy(t) {
  return Rf(t, "utf8");
}
function ln(t) {
  switch (t.type) {
    case tt.BoolTrue:
    case tt.BoolFalse:
      return ay(t);
    case tt.OptionalNone:
    case tt.OptionalSome:
      return fy(t);
    case tt.Buffer:
      return hy(t);
    case tt.UInt:
      return uy(t);
    case tt.Int:
      return ly(t);
    case tt.PrincipalStandard:
      return dy(t);
    case tt.PrincipalContract:
      return by(t);
    case tt.ResponseOk:
    case tt.ResponseErr:
      return py(t);
    case tt.List:
      return gy(t);
    case tt.Tuple:
      return xy(t);
    case tt.StringASCII:
      return yy(t);
    case tt.StringUTF8:
      return wy(t);
    default:
      throw new cy("Unable to serialize. Invalid Clarity Value.");
  }
}
const my = (t, e) => t ? Ri(t).length > e : !1;
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var Sy = Object.defineProperty, Ey = Object.defineProperties, Ay = Object.getOwnPropertyDescriptors, Cr = Object.getOwnPropertySymbols, Vf = Object.prototype.hasOwnProperty, Kf = Object.prototype.propertyIsEnumerable, ba = (t, e, n) => e in t ? Sy(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, si = (t, e) => {
  for (var n in e || (e = {})) Vf.call(e, n) && ba(t, n, e[n]);
  if (Cr) for (var n of Cr(e)) Kf.call(e, n) && ba(t, n, e[n]);
  return t;
}, ii = (t, e) => Ey(t, Ay(e)), By = (t, e) => {
  var n = {};
  for (var r in t) Vf.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Cr) for (var r of Cr(t)) e.indexOf(r) < 0 && Kf.call(t, r) && (n[r] = t[r]);
  return n;
};
function $y(t) {
  return t ? typeof t == "string" ? Ne.fromName(t) : "version" in t ? t : "url" in t ? new qs({ url: t.url }) : t.transactionVersion === Ur.Mainnet ? new qs({ url: t.client.baseUrl }) : new Ws({ url: t.client.baseUrl }) : new Ws();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var vy = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(vy || {}), _y = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(_y || {}), zf = (t) => {
  let e = t;
  if (!e) {
    let n = new L0(["store_write"], document.location.href);
    e = new js({ appConfig: n });
  }
  return e;
};
function Hy(t) {
  try {
    return zf(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Ly = (t) => {
  let e = zf(t).loadUserData().appPrivateKey, n = st.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function jf(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? ii(si({}, t), { message: Jc(e), domain: Jc(n) }) : ii(si({}, t), { message: bt(ln(e)), domain: bt(ln(n)) });
}
async function Iy(t, e) {
  return new st.TokenSigner("ES256k", e).signAsync(jf(t));
}
async function Uy(t) {
  let e = t, { userSession: n } = e, r = By(e, ["userSession"]);
  if (Hy(n)) {
    let { privateKey: s, publicKey: i } = Ly(n), o = ii(si({}, r), { publicKey: i });
    return Iy(o, s);
  }
  return st.createUnsecuredToken(jf(t));
}
var Oy = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(Oy || {}), qf = "asigna-stx", pa = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === qf && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(Py(t, e), "*");
}), Cy = { authenticationRequest: async (t) => pa(t, "authenticationRequest"), transactionRequest: async (t) => pa(t, "transactionRequest") }, Py = (t, e) => ({ source: qf, [e]: t }), Ny = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = Cy);
};
Ny();
const Dy = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], qi = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Jr = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, vn = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, ky = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Wf = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => ky(i, r)) === s
  );
}, Ty = (t) => t ? Wf(Jr()).some(
  (e) => {
    var n;
    return e.id === t && (qi(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Fy = () => {
  if (typeof window > "u")
    return;
  const t = Jr(), e = Wf(t).filter(
    (n) => {
      var r;
      return qi(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = vn(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of Dy) {
    const r = vn(t, n) ?? (t === window ? void 0 : vn(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, My = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Jr(), n = vn(e, t) ?? (e === window ? void 0 : vn(window, t)) ?? Mp(t);
  if (n)
    return n;
  if (qi(t) || Ty(t))
    return Fy();
}, Gy = ["blockstack-session", "blockstack"], Ry = () => {
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
Ry();
const Vy = () => yf(), Ky = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = yf(), e = t ? My(t) : void 0;
  if (e)
    return e;
  const n = Jr() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, ga = (t) => B0(t).replace(/^0x/, ""), xa = "This wallet cannot sign messages. Try Xverse or Leather.", ya = (t) => typeof (t == null ? void 0 : t.request) == "function", wa = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", zy = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, jy = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function qy(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: ga(e.message),
    domain: ga(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Wy(t, e) {
  const n = await Uy({
    domain: e.domain,
    message: e.message,
    network: $y(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Xy(t) {
  var s, i;
  const e = Vy() || "", n = /xverse/i.test(e);
  let r = Ky();
  if (n && !wa(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (wa(r))
    try {
      return await Wy(r, t);
    } catch (o) {
      if (n || !ya(r) || !jy(o)) throw o;
    }
  if (!n && ya(r))
    try {
      return await qy(r, t);
    } catch (o) {
      throw zy(o) ? new Error(xa) : o;
    }
  throw new Error(xa);
}
function Yy(t, e, n = {}) {
  const r = n.retryAfterMs ?? 3e4, s = n.now ?? Date.now, i = /* @__PURE__ */ new Map(), o = (c, f) => {
    f.pending = !0, f.failedAt = void 0, Promise.resolve().then(() => t(c)).then((u) => {
      f.pending = !1, u && (f.name = u, e());
    }).catch(() => {
      f.pending = !1, f.failedAt = s();
    });
  };
  return {
    get(c) {
      if (!c) return null;
      let f = i.get(c);
      return f ? !f.pending && f.name === null && f.failedAt !== void 0 && s() - f.failedAt >= r && o(c, f) : (f = { name: null, pending: !1 }, i.set(c, f), o(c, f)), f.name;
    }
  };
}
const Zy = {}, Jy = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, Qy = (t) => {
  const e = Zy;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, t3 = (t) => `/hiro/${t}`, e3 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, n3 = (t) => {
  const e = Qy(t);
  if (e)
    return [e3(e)];
  const n = Jy[t];
  return typeof window < "u" ? [`${window.location.origin}${t3(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, r3 = {}, ma = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, s3 = "xtrata.log.enabled", i3 = "xtrata.log.level", o3 = "xtrata.log.tags", c3 = "xtrata.log.dedupe", br = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, a3 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, f3 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, h3 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, l3 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, u3 = () => {
  const t = r3 ?? {}, e = br(s3) ?? t.VITE_LOG_ENABLED, n = br(i3) ?? t.VITE_LOG_LEVEL, r = br(o3) ?? t.VITE_LOG_TAGS, s = br(c3) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: a3(e),
    level: f3(n) ?? "warn",
    tags: l3(r),
    dedupe: h3(s)
  };
}, d3 = (t, e, n) => !t.enabled || ma[n] < ma[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), b3 = (t, e, n, r) => {
  const s = u3();
  if (!d3(s, e, t) || g3(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, p3 = /* @__PURE__ */ new Set();
let Sa = null;
const g3 = (t, e, n, r, s) => (Sa !== t && (p3.clear(), Sa = t), !1), x3 = (t, e, n) => b3("debug", t, e, n), y3 = {}, w3 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, m3 = (t) => {
  const e = y3, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : w3[t];
}, S3 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, E3 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return S3.test(n) ? n : null;
}, A3 = (t) => t.replace(/\/+$/, ""), B3 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), Ea = (t) => {
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
}, Xe = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, $3 = (t) => {
  var f, u;
  let e;
  try {
    e = Ye(Jd(t));
  } catch {
    return null;
  }
  const n = Xe(e);
  if (!n || n.success === !1)
    return null;
  const r = Xe(n.value), s = Xe(r == null ? void 0 : r.value), i = Xe(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = Ea((f = Xe(i.name)) == null ? void 0 : f.value), c = Ea((u = Xe(i.namespace)) == null ? void 0 : u.value);
  return !o || !c ? null : E3(`${o}.${c}`);
}, v3 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${A3(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [B0(Sd(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : $3(i.result);
}, _3 = async (t) => {
  const e = t.address.trim();
  if (!Qd(e))
    return null;
  const n = m3(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of n3(t.network))
    try {
      return await v3({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return x3("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: B3(r)
  }), null;
}, H3 = "ParallaX Casino", L3 = "ParallaX Casino room sign-in. This is free: it sends no transaction, costs no fees and gives no permission to spend anything.";
new TextEncoder();
new TextDecoder();
const I3 = (t) => t === "mainnet" ? 1 : 2147483648, U3 = (t) => `${L3} Account ${t.address}. Valid until ${new Date(t.expires).toISOString().replace(".000Z", "Z")}. Request code ${t.nonce}.`, O3 = (t) => ({
  domain: y0({
    name: yr(H3),
    version: yr("1"),
    "chain-id": x0(I3(t.network))
  }),
  message: yr(U3(t))
}), pr = (t) => !!t && typeof t.request == "function", C3 = () => {
  try {
    const t = window.top;
    if (t && t !== window.self && t.location.origin === window.location.origin) return t;
  } catch {
  }
  return window;
}, P3 = () => {
  const t = C3();
  return t === window ? [window] : [t, window];
}, Aa = (t) => {
  for (const e of P3()) {
    const n = t(e);
    if (n) return n;
  }
  return null;
}, N3 = (t) => {
  if (t === "leather") {
    const n = Aa((r) => pr(r.LeatherProvider) ? r.LeatherProvider : null);
    return n ? { rpc: n } : null;
  }
  const e = Aa((n) => {
    const r = n.XverseProviders || n.xverseProviders;
    return r && (pr(r.BitcoinProvider) || pr(r.StacksProvider)) ? r : null;
  });
  return e ? { rpc: pr(e.BitcoinProvider) ? e.BitcoinProvider : e.StacksProvider } : null;
}, D3 = (t, e) => new Promise((n) => {
  const r = Date.now();
  (function s() {
    const i = N3(t);
    i || Date.now() - r >= e ? n(i) : window.setTimeout(s, 150);
  })();
}), Pr = (t) => {
  var e;
  return (t == null ? void 0 : t.code) ?? ((e = t == null ? void 0 : t.error) == null ? void 0 : e.code);
}, Le = (t) => {
  var e;
  return String((t == null ? void 0 : t.message) ?? ((e = t == null ? void 0 : t.error) == null ? void 0 : e.message) ?? t ?? "unknown error");
}, k3 = (t) => [4001, -31001].includes(Number(Pr(t))) || /cancel|denied|reject|declin|closed/i.test(Le(t)), Ba = (t) => Number(Pr(t)) === -32601 || /not supported|method not found|unsupported|not implemented|legacy method/i.test(Le(t)), _s = async (t, e, n) => {
  const r = n === void 0 ? await t.request(e) : await t.request(e, n);
  if (r && typeof r == "object") {
    if (r.error) throw Object.assign(new Error(Le(r.error)), { code: Pr(r.error) });
    if (r.status === "error") throw Object.assign(new Error(Le(r.error || r)), { code: Pr(r.error || r) });
    if ("result" in r) return r.result;
  }
  return r;
}, T3 = (t) => new Promise((e, n) => {
  const r = window.setTimeout(() => n(new Error("The wallet did not answer. Check its window.")), 9e4);
  t.then((s) => {
    window.clearTimeout(r), e(s);
  }, (s) => {
    window.clearTimeout(r), n(s);
  });
}), F3 = (t) => (JSON.stringify(t) || "").match(/S[PT][0-9A-HJKMNP-TV-Z]{38,39}/g) || [], de = [];
async function M3(t) {
  const e = await D3(t, 1500);
  if (!e) throw new Error(`${t === "leather" ? "Leather" : "Xverse"} was not found in this browser.`);
  de.length = 0;
  let n;
  if (t === "xverse") {
    try {
      await _s(e.rpc, "wallet_disconnect"), de.push("wallet_disconnect: ok");
    } catch (s) {
      de.push("wallet_disconnect: " + Le(s).slice(0, 80));
    }
    n = ["wallet_connect", "wallet_getAccount"];
  } else
    n = ["getAddresses", "stx_getAccounts", "stx_getAddresses", "stx_requestAccounts"];
  let r = null;
  for (const s of n)
    try {
      const i = await (t === "xverse" ? T3(_s(e.rpc, s)) : _s(e.rpc, s)), o = F3(i);
      if (o.length) {
        const c = o[0];
        return de.push(`${s}: ok`), { kind: t, address: c, network: c.startsWith("SP") ? "mainnet" : "testnet", via: s };
      }
      de.push(`${s}: answered but no Stacks address in it`);
    } catch (i) {
      if (k3(i))
        throw de.push(`${s}: cancelled`), new Error("Connection cancelled.");
      de.push(`${s}: ${Ba(i) ? "not supported" : Le(i).slice(0, 80)}`), Ba(i) || (r = i);
    }
  throw new Error(r ? Le(r) : "The wallet did not share a Stacks address.");
}
const G3 = (t) => Gp(t === "leather" ? "LeatherProvider" : "XverseProviders.BitcoinProvider"), Xf = (t) => t instanceof Error ? t.message : String(t), m = {
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
}, R3 = (t) => t.length <= 12 ? t : `${t.slice(0, 5)}…${t.slice(-4)}`, V3 = (t) => {
  if (t.startsWith("SP")) return t;
  const e = Bi(t);
  return Ns({ ...e, version: Is.MainnetSingleSig });
}, K3 = Yy((t) => _3({ address: V3(t), network: "mainnet" }), () => Nr()), Yf = (t) => {
  let e = null;
  try {
    e = K3.get(t);
  } catch {
  }
  return e || R3(t);
}, Nr = () => {
  var n;
  if (!m.host || m.service !== "ok") return;
  const t = ((n = m.you) == null ? void 0 : n.a) ?? null, e = Object.entries(m.spots).filter(([, r]) => r.a !== t).map(([r, s]) => ({ key: s.a, spot: r, label: Yf(s.a), since: s.since }));
  try {
    m.host.setPeople(e);
  } catch (r) {
    console.warn("[room] the page could not draw the people", r);
  }
}, Dr = async (t, e) => {
  const n = await fetch(t, { credentials: "same-origin", ...e });
  let r = null;
  try {
    r = await n.json();
  } catch {
  }
  return { res: n, body: r };
}, $a = (t) => {
  var e;
  return ((e = m.ws) == null ? void 0 : e.readyState) !== WebSocket.OPEN ? !1 : (m.ws.send(JSON.stringify(t)), m.lastSent = Date.now(), !0);
}, Zf = () => {
  var e;
  if (m.service !== "ok" || !m.connected || !m.you || m.you.guest || !m.signed) return;
  const t = ((e = Object.entries(m.spots).find(([, n]) => n.a === m.you.a)) == null ? void 0 : e[0]) ?? null;
  m.want ? t !== m.want && m.want !== m.badSpot && !m.spots[m.want] && Date.now() - m.lastSent > 1200 && $a({ t: "sit", spot: m.want }) : t && Date.now() - m.lastSent > 600 && $a({ t: "stand" });
}, Wi = () => {
  if (m.service !== "ok" || m.ws) return;
  m.attempts += 1;
  let t;
  try {
    t = new WebSocket(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/casino/room/ws`);
  } catch {
    return va();
  }
  m.ws = t, t.onopen = () => {
    m.connected = !0, m.attempts = 0, ft();
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
        m.you = n.you, m.spots = n.spots || {}, m.joined = n.joined, m.guests = n.guests, m.signed && ((r = m.you) != null && r.guest) && (m.signed = null);
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
      case "err":
        n.code === "no-such-spot" && (m.badSpot = m.want);
        return;
      default:
        return;
    }
    Nr(), Zf(), ft();
  }, t.onclose = (e) => {
    if (m.ws === t) {
      if (m.ws = null, m.connected = !1, m.spots = {}, Nr(), e.code === 4001) {
        m.replaced = !0, ft();
        return;
      }
      ft(), va();
    }
  }, t.onerror = () => {
  };
}, va = () => {
  window.clearTimeout(m.retryTimer);
  const t = Math.min(15e3, 1e3 * 2 ** Math.min(m.attempts, 4));
  m.retryTimer = window.setTimeout(() => {
    m.ws || Wi();
  }, t);
}, Xi = () => {
  const t = m.ws;
  m.ws = null, m.connected = !1, m.attempts = 0, m.replaced = !1;
  try {
    t == null || t.close(1e3, "client");
  } catch {
  }
  Wi();
};
async function z3(t) {
  const { res: e, body: n } = await Dr(`/casino/room/challenge?address=${encodeURIComponent(t.address)}`);
  if (!e.ok) throw new Error((n == null ? void 0 : n.error) || `The room answered ${e.status}.`);
  const r = n.challenge, { domain: s, message: i } = O3(r);
  m.busy = "sign", ft();
  let o;
  try {
    o = await Xy({ domain: s, message: i, network: r.network, stxAddress: t.address });
  } catch (u) {
    throw new Error("The wallet did not sign: " + Xf(u));
  }
  const { res: c, body: f } = await Dr("/casino/room/session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ challenge: r, signature: o })
  });
  if (!c.ok) throw new Error((f == null ? void 0 : f.error) || `The room answered ${c.status}.`);
  m.signed = { address: f.address, hash160: f.hash160, expiresAt: f.expiresAt }, Xi();
}
async function j3(t) {
  if (!m.busy) {
    m.error = "", m.busy = "connect", ft();
    try {
      m.wallet = await M3(t), G3(t), await z3(m.wallet), m.open = !1;
    } catch (e) {
      m.error = Xf(e);
    } finally {
      m.busy = "", ft();
    }
  }
}
async function q3() {
  try {
    await Dr("/casino/room/session", { method: "DELETE" });
  } catch {
  }
  m.signed = null, m.wallet = null, m.error = "", Xi(), ft();
}
const W3 = `
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
`, Y = (t, e, n) => {
  const r = document.createElement(t);
  return e !== void 0 && (r.textContent = e), n && (r.className = n), r;
}, ve = (t, e) => {
  const n = Y("p", void 0, "fact");
  return n.append(Y("b", t), document.createTextNode(` ${e}`)), n;
};
let be = null, dt = null, _t = null;
function X3() {
  var n, r;
  if (be || m.service !== "ok") return;
  const t = document.createElement("style");
  t.textContent = W3, document.head.append(t), be = Y("span"), be.id = "pxroom", dt = Y("button"), dt.id = "pxroom-btn", dt.type = "button", dt.setAttribute("aria-label", "Casino room: see who is here and join"), dt.onclick = () => {
    m.open = !m.open, ft();
  }, _t = Y("div"), _t.id = "pxroom-panel", _t.hidden = !0, be.append(dt);
  const e = ((r = (n = m.host) == null ? void 0 : n.mount) == null ? void 0 : r.call(n)) ?? document.querySelector("#tools .rt");
  e ? e.insertBefore(be, e.firstChild) : (be.style.cssText = "position:fixed;top:10px;right:10px;z-index:30", document.body.append(be)), document.body.append(_t), document.addEventListener("keydown", (s) => {
    s.key === "Escape" && m.open && (m.open = !1, ft());
  }), document.addEventListener("pointerdown", (s) => {
    if (!m.open) return;
    const i = s.target;
    i && (_t.contains(i) || dt.contains(i)) || (m.open = !1, ft());
  }), window.addEventListener("resize", () => {
    m.open && Jf();
  });
}
function Jf() {
  if (!dt || !_t) return;
  const t = dt.getBoundingClientRect(), e = t.height ? Math.round(t.bottom + 8) : 64;
  _t.style.top = `${Math.min(e, Math.max(64, window.innerHeight - 220))}px`;
}
function ft() {
  if (!be || !dt || !_t) return;
  const t = !!(m.signed && m.you && !m.you.guest);
  dt.className = m.connected ? "live" : "wait";
  const e = m.connected ? ` · ${m.joined}` : "";
  if (dt.replaceChildren(Y("i"), document.createTextNode(t ? `In the room${e}` : `Room${e}`)), _t.hidden = !m.open, !m.open) return;
  Jf();
  const n = [];
  if (m.replaced) {
    n.push(Y("h3", "Room"), Y("p", "Another tab of yours took over the room. You are not connected here."));
    const r = Y("button", "Use this tab instead");
    r.onclick = () => {
      Xi(), ft();
    }, n.push(r);
  } else if (t) {
    n.push(Y("h3", "You are in the room")), n.push(Y("p", "Others see you at your seat as"), Y("p", Yf(m.signed.address), "who")), n.push(Y("p", `${m.joined} signed in, ${m.guests} watching.`)), n.push(ve("Be seen", "Sit at a table or connect to a machine and your Adrian and name tag appear there for everyone in the room. Stand up or walk away and they go too.")), n.push(ve("Spaces", "Each seat and machine holds one person. If someone already has the seat you choose, you are given a free one at the same table.")), n.push(ve("Live chat", "Chat and private messages are on the room test page for now. They are not on the casino floor yet.")), n.push(Y("p", "Nothing here moves any money.", "fact"));
    const r = Y("button", "Leave the room");
    r.onclick = () => {
      q3();
    }, n.push(r);
  } else {
    n.push(Y("h3", "Join the room")), n.push(Y("p", m.connected ? `You are watching: ${m.joined} signed in, ${m.guests} watching.` : "Connecting to the room…")), n.push(ve("Be seen", "Join, then sit at a table or connect to a machine. Everyone in the room sees your Adrian there, with a name tag (your BNS name, or a short version of your address). Watching alone shows you to nobody.")), n.push(ve("Spaces", "Each seat and machine holds one person. If someone already has the seat you choose, you are given a free one at the same table.")), n.push(ve("Live chat", "Chat and private messages are for signed-in players and are on the room test page for now. They are not on the casino floor yet.")), n.push(ve("Free", "One signature. It sends no transaction, costs no fee and gives no permission to spend anything."));
    const r = Y("div", void 0, "row");
    for (const s of ["leather", "xverse"]) {
      const i = Y("button", m.busy ? m.busy === "sign" ? "Check your wallet…" : "Connecting…" : s === "leather" ? "Leather" : "Xverse");
      if (i.disabled = !!m.busy || !m.connected, i.onclick = () => {
        j3(s);
      }, r.append(i), m.busy) break;
    }
    n.push(r), m.error && n.push(Y("p", m.error, "err"));
  }
  _t.replaceChildren(...n);
}
const Y3 = () => {
  var e;
  const t = ((e = m.host) == null ? void 0 : e.currentSpot()) ?? null;
  t !== m.want && (m.want = t, Nr()), Zf();
};
async function Z3() {
  try {
    const { res: t, body: e } = await Dr("/casino/room/session");
    if (t.status === 503) return;
    t.ok && (e != null && e.address) && (m.signed = { address: e.address, hash160: e.hash160, expiresAt: e.expiresAt }), m.service = "ok";
  } catch {
    return;
  }
  X3(), ft(), Wi(), window.setInterval(Y3, 250);
}
const _a = (t) => {
  m.host || (m.host = t, Z3());
}, Ha = window.PXRoomHost;
Ha ? _a(Ha) : window.addEventListener("px-room-host", () => _a(window.PXRoomHost), { once: !0 });
window.__pxRoom = {
  get state() {
    var t;
    return { service: m.service, signed: ((t = m.signed) == null ? void 0 : t.address) ?? null, connected: m.connected, you: m.you, spots: m.spots, joined: m.joined, guests: m.guests, want: m.want, trail: de.slice() };
  }
};
