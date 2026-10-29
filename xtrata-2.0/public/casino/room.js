function ii(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Qe(r);
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
      const r = ml(BigInt(`0x${Mt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Mt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function oi(t, e = 8) {
  return (typeof t == "bigint" ? t : ii(t, !1)).toString(16).padStart(e * 2, "0");
}
function Ha(t) {
  return parseInt(t, 16);
}
function La(t, e = 16) {
  const n = oi(t, e);
  return Qe(n);
}
function yl(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function wl(t, e) {
  return t & BigInt(1) << e;
}
function ml(t, e) {
  return wl(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Sl = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Mt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Sl[n];
  return e;
}
function Qe(t) {
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
function Un(t) {
  return new TextEncoder().encode(t);
}
function Ia(t) {
  return new TextDecoder().decode(t);
}
function Ua(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function El(t) {
  return String.fromCharCode.apply(null, t);
}
function Al(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function So(t) {
  if (t.some(Al))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function ci(...t) {
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
function ln(t) {
  return ci(...t.map((e) => typeof e == "number" ? So([e]) : e instanceof Array ? So(e) : e));
}
function Bl(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function $l(t, e) {
  return t[e];
}
function vl(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Dr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var _s;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(_s || (_s = {}));
_s.Mainnet;
const _l = 128, Hl = 128, Oa = 16;
var vn;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(vn || (vn = {}));
var Eo;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Eo || (Eo = {}));
var Ao;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Ao || (Ao = {}));
var gt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(gt || (gt = {}));
const fs = ["onChainOnly", "offChainOnly", "any"];
fs[0] + "", gt.OnChainOnly, fs[1] + "", gt.OffChainOnly, fs[2] + "", gt.Any, gt.OnChainOnly + "", gt.OnChainOnly, gt.OffChainOnly + "", gt.OffChainOnly, gt.Any + "", gt.Any;
var Hs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Hs || (Hs = {}));
Hs.Mainnet;
var Bo;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Bo || (Bo = {}));
var $o;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})($o || ($o = {}));
var vo;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(vo || (vo = {}));
var _o;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(_o || (_o = {}));
var Ls;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ls || (Ls = {}));
var Ho;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ho || (Ho = {}));
var Lo;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Lo || (Lo = {}));
var Io;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Io || (Io = {}));
var Uo;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Uo || (Uo = {}));
var Oo;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Oo || (Oo = {}));
var Co;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Co || (Co = {}));
function Is(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Ll(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Ca(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Il(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Is(t.outputLen), Is(t.blockLen);
}
function Ul(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Ol(t, e) {
  Ca(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const hs = {
  number: Is,
  bool: Ll,
  bytes: Ca,
  hash: Il,
  exists: Ul,
  output: Ol
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ls = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), St = (t, e) => t << 32 - e | t >>> e, Cl = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Cl)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Pl(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Pa(t) {
  if (typeof t == "string" && (t = Pl(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Nl = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ne(t) {
  const e = (r) => t().update(Pa(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Dl(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, o, r), t.setUint32(e + u, c, r);
}
let ai = class extends Nl {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ls(this.buffer);
  }
  update(e) {
    hs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Pa(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const f = ls(e);
        for (; s <= i - o; o += s)
          this.process(f, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    hs.exists(this), hs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let a = o; a < s; a++)
      n[a] = 0;
    Dl(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = ls(e), f = this.outputLen;
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
const kl = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Na = Uint8Array.from({ length: 16 }, (t, e) => e), Tl = Na.map((t) => (9 * t + 5) % 16);
let fi = [Na], hi = [Tl];
for (let t = 0; t < 4; t++)
  for (let e of [fi, hi])
    e.push(e[t].map((n) => kl[n]));
const Da = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Fl = fi.map((t, e) => t.map((n) => Da[e][n])), Ml = hi.map((t, e) => t.map((n) => Da[e][n])), Gl = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Rl = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), zn = (t, e) => t << e | t >>> 32 - e;
function Po(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const jn = new Uint32Array(16);
let Vl = class extends ai {
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
      jn[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, f = c, u = this.h3 | 0, l = u, a = this.h4 | 0, b = a;
    for (let d = 0; d < 5; d++) {
      const g = 4 - d, y = Gl[d], B = Rl[d], H = fi[d], L = hi[d], x = Fl[d], $ = Ml[d];
      for (let S = 0; S < 16; S++) {
        const P = zn(r + Po(d, i, c, u) + jn[H[S]] + y, x[S]) + a | 0;
        r = a, a = u, u = zn(c, 10) | 0, c = i, i = P;
      }
      for (let S = 0; S < 16; S++) {
        const P = zn(s + Po(g, o, f, l) + jn[L[S]] + B, $[S]) + b | 0;
        s = b, b = l, l = zn(f, 10) | 0, f = o, o = P;
      }
    }
    this.set(this.h1 + c + l | 0, this.h2 + u + b | 0, this.h3 + a + s | 0, this.h4 + r + o | 0, this.h0 + i + f | 0);
  }
  roundClean() {
    jn.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Ne(() => new Vl());
const Kl = (t, e, n) => t & e ^ ~t & n, zl = (t, e, n) => t & e ^ t & n ^ e & n, jl = new Uint32Array([
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
let ka = class extends ai {
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
      const b = St(c, 6) ^ St(c, 11) ^ St(c, 25), d = l + b + Kl(c, f, u) + jl[a] + zt[a] | 0, y = (St(r, 2) ^ St(r, 13) ^ St(r, 22)) + zl(r, s, i) | 0;
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
}, ql = class extends ka {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Ne(() => new ka());
Ne(() => new ql());
const qn = BigInt(2 ** 32 - 1), Us = BigInt(32);
function Ta(t, e = !1) {
  return e ? { h: Number(t & qn), l: Number(t >> Us & qn) } : { h: Number(t >> Us & qn) | 0, l: Number(t & qn) | 0 };
}
function Wl(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Ta(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Xl = (t, e) => BigInt(t >>> 0) << Us | BigInt(e >>> 0), Yl = (t, e, n) => t >>> n, Zl = (t, e, n) => t << 32 - n | e >>> n, Jl = (t, e, n) => t >>> n | e << 32 - n, Ql = (t, e, n) => t << 32 - n | e >>> n, tu = (t, e, n) => t << 64 - n | e >>> n - 32, eu = (t, e, n) => t >>> n - 32 | e << 64 - n, nu = (t, e) => e, ru = (t, e) => t, su = (t, e, n) => t << n | e >>> 32 - n, iu = (t, e, n) => e << n | t >>> 32 - n, ou = (t, e, n) => e << n - 32 | t >>> 64 - n, cu = (t, e, n) => t << n - 32 | e >>> 64 - n;
function au(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const fu = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), hu = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, lu = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), uu = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, du = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), bu = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, T = {
  fromBig: Ta,
  split: Wl,
  toBig: Xl,
  shrSH: Yl,
  shrSL: Zl,
  rotrSH: Jl,
  rotrSL: Ql,
  rotrBH: tu,
  rotrBL: eu,
  rotr32H: nu,
  rotr32L: ru,
  rotlSH: su,
  rotlSL: iu,
  rotlBH: ou,
  rotlBL: cu,
  add: au,
  add3L: fu,
  add3H: hu,
  add4L: lu,
  add4H: uu,
  add5H: bu,
  add5L: du
}, [pu, gu] = T.split([
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
let kr = class extends ai {
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
      const $ = T.rotrSH(a, b, 14) ^ T.rotrSH(a, b, 18) ^ T.rotrBH(a, b, 41), S = T.rotrSL(a, b, 14) ^ T.rotrSL(a, b, 18) ^ T.rotrBL(a, b, 41), P = a & d ^ ~a & y, k = b & g ^ ~b & B, U = T.add5L(L, S, k, gu[x], qt[x]), O = T.add5H(U, H, $, P, pu[x], jt[x]), p = U | 0, E = T.rotrSH(r, s, 28) ^ T.rotrBH(r, s, 34) ^ T.rotrBH(r, s, 39), I = T.rotrSL(r, s, 28) ^ T.rotrBL(r, s, 34) ^ T.rotrBL(r, s, 39), D = r & i ^ r & c ^ i & c, V = s & o ^ s & f ^ o & f;
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
}, xu = class extends kr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, yu = class extends kr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, wu = class extends kr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ne(() => new kr());
Ne(() => new xu());
Ne(() => new yu());
Ne(() => new wu());
const mu = {}, Fa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: mu
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const z = BigInt(0), X = BigInt(1), ye = BigInt(2), En = BigInt(3), No = BigInt(8), W = Object.freeze({
  a: z,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: X,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Do = (t, e) => (t + e / ye) / e, Wn = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = W, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -X * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), c = Do(i * t, e), f = Do(-r * t, e);
    let u = _(t - c * n - f * s, e), l = _(-c * r - f * i, e);
    const a = u > o, b = l > o;
    if (a && (u = e - u), b && (l = e - l), u > o || l > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: a, k1: u, k2neg: b, k2: l };
  }
}, mt = 32, Le = 32, Ma = 32, mr = mt + 1, Sr = 2 * mt + 1;
function ko(t) {
  const { a: e, b: n } = W, r = _(t * t), s = _(r * t);
  return _(s + e * t + n);
}
const Xn = W.a === z;
class li extends Error {
  constructor(e) {
    super(e);
  }
}
function To(t) {
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
    const n = $u(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return q.toAffineBatch(e).map(q.fromAffine);
  }
  equals(e) {
    To(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: c } = e, f = _(s * s), u = _(c * c), l = _(n * u), a = _(i * f), b = _(_(r * c) * u), d = _(_(o * s) * f);
    return l === a && b === d;
  }
  negate() {
    return new q(this.x, _(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = _(e * e), i = _(n * n), o = _(i * i), c = e + i, f = _(ye * (_(c * c) - s - o)), u = _(En * s), l = _(u * u), a = _(l - ye * f), b = _(u * (f - a) - No * o), d = _(ye * n * r);
    return new q(a, b, d);
  }
  add(e) {
    To(e);
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
    let r = Go(e);
    if (r === X)
      return this;
    if (!Xn) {
      let a = n, b = this;
      for (; r > z; )
        r & X && (a = a.add(b)), b = b.double(), r >>= X;
      return a;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: c } = Wn.splitScalar(r), f = n, u = n, l = this;
    for (; i > z || c > z; )
      i & X && (f = f.add(l)), c & X && (u = u.add(l)), l = l.double(), i >>= X, c >>= X;
    return s && (f = f.negate()), o && (u = u.negate()), u = new q(_(u.x * Wn.beta), u.y, u.z), f.add(u);
  }
  precomputeWindow(e) {
    const n = Xn ? 128 / e + 1 : 256 / e + 1, r = [];
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
    let s = n && Os.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = q.normalizeZ(s), Os.set(n, s)));
    let i = q.ZERO, o = q.BASE;
    const c = 1 + (Xn ? 128 / r : 256 / r), f = 2 ** (r - 1), u = BigInt(2 ** r - 1), l = 2 ** r, a = BigInt(r);
    for (let b = 0; b < c; b++) {
      const d = b * f;
      let g = Number(e & u);
      e >>= a, g > f && (g -= l, e += X);
      const y = d, B = d + Math.abs(g) - 1, H = b % 2 !== 0, L = g < 0;
      g === 0 ? o = o.add(Yn(H, s[y])) : i = i.add(Yn(L, s[B]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = Go(e), s, i;
    if (Xn) {
      const { k1neg: o, k1: c, k2neg: f, k2: u } = Wn.splitScalar(r);
      let { p: l, f: a } = this.wNAF(c, n), { p: b, f: d } = this.wNAF(u, n);
      l = Yn(o, l), b = Yn(f, b), b = new q(_(b.x * Wn.beta), b.y, b.z), s = l.add(b), i = a.add(d);
    } else {
      const { p: o, f: c } = this.wNAF(r, n);
      s = o, i = c;
    }
    return q.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(q.ZERO);
    e == null && (e = i ? No : un(s));
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
function Yn(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Os = /* @__PURE__ */ new WeakMap();
class j {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Os.delete(this);
  }
  hasEvenY() {
    return this.y % ye === z;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = ht(n ? e : e.subarray(1));
    if (!pr(r))
      throw new Error("Point is not on curve");
    const s = ko(r);
    let i = Bu(s);
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
    if (r === mr && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === Sr && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${mr} compressed bytes or ${Sr} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return j.BASE.multiply(Ie(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = Va(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = ui(Lt(e)), { n: c } = W, f = r === 2 || r === 3 ? s + c : s, u = un(f, c), l = _(-o * u, c), a = _(i * u, c), b = r & 1 ? "03" : "02", d = j.fromHex(b + we(f)), g = j.BASE.multiplyAndAddUnsafe(d, l, a);
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
    if (!pr(n) || !pr(r))
      throw new Error(e);
    const s = _(r * r), i = ko(n);
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
function Fo(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Mo(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${tn(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: ht(n), left: t.subarray(e + 2) };
}
function Su(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${tn(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Mo(t.subarray(2)), { data: r, left: s } = Mo(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${tn(s)}`);
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
    const s = n ? tn(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Ft(Er(s.slice(0, 64)), Er(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Su(n ? e : me(e));
    return new Ft(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!nn(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!nn(n))
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
    const e = Fo(Sn(this.s)), n = Fo(Sn(this.r)), r = e.length / 2, s = n.length / 2, i = Sn(r), o = Sn(s);
    return `30${Sn(s + r + 4)}02${o}${n}02${i}${e}`;
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
const Eu = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function tn(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Eu[t[n]];
  return e;
}
const Au = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function we(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(z <= t && t < Au))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function en(t) {
  const e = me(we(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Sn(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Er(t) {
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
  return Er(tn(t));
}
function Lt(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : me(t);
}
function Go(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && nn(t))
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
function Bu(t) {
  const { P: e } = W, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), c = BigInt(88), f = t * t * t % e, u = f * f * t % e, l = lt(u, En) * u % e, a = lt(l, En) * u % e, b = lt(a, ye) * f % e, d = lt(b, r) * b % e, g = lt(d, s) * d % e, y = lt(g, o) * g % e, B = lt(y, c) * y % e, H = lt(B, o) * g % e, L = lt(H, En) * u % e, x = lt(L, i) * d % e, $ = lt(x, n) * f % e, S = lt($, ye);
  if (S * S % e !== t)
    throw new Error("Cannot find square root");
  return S;
}
function un(t, e = W.P) {
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
function $u(t, e = W.P) {
  const n = new Array(t.length), r = t.reduce((i, o, c) => o === z ? i : (n[c] = i, _(i * o, e)), X), s = un(r, e);
  return t.reduceRight((i, o, c) => o === z ? i : (n[c] = _(i * n[c], e), _(i * o, e)), s), n;
}
function vu(t) {
  const e = t.length * 8 - Le * 8, n = ht(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function ui(t, e = !1) {
  const n = vu(t);
  if (e)
    return n;
  const { n: r } = W;
  return n >= r ? n - r : n;
}
let Je, An;
class Ga {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return Y.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return An(this.k, ...e);
  }
  checkSync() {
    if (typeof An != "function")
      throw new li("hmacSha256Sync needs to be set");
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
function nn(t) {
  return z < t && t < W.n;
}
function pr(t) {
  return z < t && t < W.P;
}
function Ra(t, e, n, r = !0) {
  const { n: s } = W, i = ui(t, !0);
  if (!nn(i))
    return;
  const o = un(i, s), c = j.BASE.multiply(i), f = _(c.x, s);
  if (f === z)
    return;
  const u = _(o * _(e + n * f, s), s);
  if (u === z)
    return;
  let l = new Ft(f, u), a = (c.x === l.r ? 0 : 2) | Number(c.y & X);
  return r && l.hasHighS() && (l = l.normalizeS(), a ^= 1), { sig: l, recovery: a };
}
function Ie(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Le)
      throw new Error("Expected 32 bytes of private key");
    e = Er(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Le)
      throw new Error("Expected 32 bytes of private key");
    e = ht(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!nn(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function di(t) {
  return t instanceof j ? (t.assertValidity(), t) : j.fromHex(t);
}
function Va(t) {
  if (t instanceof Ft)
    return t.assertValidity(), t;
  try {
    return Ft.fromDER(t);
  } catch {
    return Ft.fromCompact(t);
  }
}
function bi(t, e = !1) {
  return j.fromPrivateKey(t).toRawBytes(e);
}
function _u(t, e, n, r = !1) {
  return j.fromSignature(t, e, n).toRawBytes(r);
}
function Ro(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === mr || r === Sr : n ? r === mr * 2 || r === Sr * 2 : t instanceof j;
}
function pi(t, e, n = !1) {
  if (Ro(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Ro(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = di(e);
  return r.assertValidity(), r.multiply(Ie(t)).toRawBytes(n);
}
function Ka(t) {
  const e = t.length > mt ? t.slice(0, mt) : t;
  return ht(e);
}
function Hu(t) {
  const e = Ka(t), n = _(e, W.n);
  return za(n < z ? e : n);
}
function za(t) {
  return en(t);
}
function ja(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Lt(t), s = Ie(e), i = [za(s), Hu(r)];
  if (n != null) {
    n === !0 && (n = Y.randomBytes(mt));
    const f = Lt(n);
    if (f.length !== mt)
      throw new Error(`sign: Expected ${mt} bytes of extra data`);
    i.push(f);
  }
  const o = ge(...i), c = Ka(r);
  return { seed: o, m: c, d: s };
}
function qa(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function Lu(t, e, n = {}) {
  const { seed: r, m: s, d: i } = ja(t, e, n.extraEntropy), o = new Ga(Ma, Le);
  await o.reseed(r);
  let c;
  for (; !(c = Ra(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return qa(c, n);
}
function Wa(t, e, n = {}) {
  const { seed: r, m: s, d: i } = ja(t, e, n.extraEntropy), o = new Ga(Ma, Le);
  o.reseedSync(r);
  let c;
  for (; !(c = Ra(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return qa(c, n);
}
const Iu = { strict: !0 };
function Uu(t, e, n, r = Iu) {
  let s;
  try {
    s = Va(t), e = Lt(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const c = ui(e);
  let f;
  try {
    f = di(n);
  } catch {
    return !1;
  }
  const { n: u } = W, l = un(o, u), a = _(c * l, u), b = _(i * l, u), d = j.BASE.multiplyAndAddUnsafe(f, a, b);
  return d ? _(d.x, u) === i : !1;
}
function Ar(t) {
  return _(ht(t), W.n);
}
class rn {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Lt(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = ht(n.subarray(0, 32)), s = ht(n.subarray(32, 64));
    return new rn(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!pr(e) || !nn(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return we(this.r) + we(this.s);
  }
  toRawBytes() {
    return me(this.toHex());
  }
}
function Ou(t) {
  return j.fromPrivateKey(t).toRawX();
}
class Xa {
  constructor(e, n, r = Y.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Lt(e);
    const { x: s, scalar: i } = this.getScalar(Ie(n));
    if (this.px = s, this.d = i, this.rand = Lt(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = j.fromPrivateKey(e), r = n.hasEvenY() ? e : W.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return en(e ^ ht(n));
  }
  finalizeNonce(e) {
    const n = _(ht(e), W.n);
    if (n === z)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new rn(e.x, _(n + r * s, W.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = Y.taggedHash, o = this.initNonce(n, await i(pe.aux, s)), { R: c, rx: f, k: u } = this.finalizeNonce(await i(pe.nonce, o, r, e)), l = Ar(await i(pe.challenge, f, r, e)), a = this.finalizeSig(c, u, l, n);
    return await Ja(a, e, r) || this.error(), a;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = Y.taggedHashSync, o = this.initNonce(n, i(pe.aux, s)), { R: c, rx: f, k: u } = this.finalizeNonce(i(pe.nonce, o, r, e)), l = Ar(i(pe.challenge, f, r, e)), a = this.finalizeSig(c, u, l, n);
    return Qa(a, e, r) || this.error(), a;
  }
}
async function Cu(t, e, n) {
  return new Xa(t, e, n).calc();
}
function Pu(t, e, n) {
  return new Xa(t, e, n).calcSync();
}
function Ya(t, e, n) {
  const r = t instanceof rn, s = r ? t : rn.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Lt(e),
    P: di(n)
  };
}
function Za(t, e, n, r) {
  const s = j.BASE.multiplyAndAddUnsafe(e, Ie(n), _(-r, W.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Ja(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Ya(t, e, n), c = Ar(await Y.taggedHash(pe.challenge, en(r), o.toRawX(), i));
    return Za(r, o, s, c);
  } catch {
    return !1;
  }
}
function Qa(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Ya(t, e, n), c = Ar(Y.taggedHashSync(pe.challenge, en(r), o.toRawX(), i));
    return Za(r, o, s, c);
  } catch (r) {
    if (r instanceof li)
      throw r;
    return !1;
  }
}
const Nu = {
  Signature: rn,
  getPublicKey: Ou,
  sign: Cu,
  verify: Ja,
  signSync: Pu,
  verifySync: Qa
};
j.BASE._setWindowSize(8);
const ct = {
  node: Fa,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, pe = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Zn = {}, Y = {
  bytesToHex: tn,
  hexToBytes: me,
  concatBytes: ge,
  mod: _,
  invert: un,
  isValidPrivateKey(t) {
    try {
      return Ie(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: en,
  _normalizePrivateKey: Ie,
  hashToPrivateKey: (t) => {
    t = Lt(t);
    const e = Le + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = _(ht(t), W.n - X) + X;
    return en(n);
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
  randomPrivateKey: () => Y.hashToPrivateKey(Y.randomBytes(Le + 8)),
  precompute(t = 8, e = j.BASE) {
    const n = e === j.BASE ? e : new j(e.x, e.y);
    return n._setWindowSize(t), n.multiply(En), n;
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
    let n = Zn[t];
    if (n === void 0) {
      const r = await Y.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = ge(r, r), Zn[t] = n;
    }
    return Y.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Je != "function")
      throw new li("sha256Sync is undefined, you need to set it");
    let n = Zn[t];
    if (n === void 0) {
      const r = Je(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = ge(r, r), Zn[t] = n;
    }
    return Je(n, ...e);
  },
  _JacobianPoint: q
};
Object.defineProperties(Y, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Je;
    },
    set(t) {
      Je || (Je = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return An;
    },
    set(t) {
      An || (An = t);
    }
  }
});
const Du = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: W,
  Point: j,
  Signature: Ft,
  getPublicKey: bi,
  getSharedSecret: pi,
  recoverPublicKey: _u,
  schnorr: Nu,
  sign: Lu,
  signSync: Wa,
  utils: Y,
  verify: Uu
}, Symbol.toStringTag, { value: "Module" }));
var rt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ku(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function On(t) {
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
var dn = {}, gi = {};
const je = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function t0(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Cs(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Ee(t, ...e) {
  if (!t0(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function e0(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Cs(t.outputLen), Cs(t.blockLen);
}
function _n(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function n0(t, e) {
  Ee(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function Tu(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function Fu(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Hn(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function gr(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function pt(t, e) {
  return t << 32 - e | t >>> e;
}
function Mu(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const xi = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function yi(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const r0 = xi ? (t) => t : (t) => yi(t), Gu = r0;
function s0(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = yi(t[e]);
  return t;
}
const Ru = xi ? (t) => t : s0, i0 = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", Vu = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ku(t) {
  if (Ee(t), i0)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Vu[t[n]];
  return e;
}
const Dt = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Vo(t) {
  if (t >= Dt._0 && t <= Dt._9)
    return t - Dt._0;
  if (t >= Dt.A && t <= Dt.F)
    return t - (Dt.A - 10);
  if (t >= Dt.a && t <= Dt.f)
    return t - (Dt.a - 10);
}
function zu(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (i0)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = Vo(t.charCodeAt(i)), c = Vo(t.charCodeAt(i + 1));
    if (o === void 0 || c === void 0) {
      const f = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + f + '" at index ' + i);
    }
    r[s] = o * 16 + c;
  }
  return r;
}
const o0 = async () => {
};
async function ju(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await o0(), r += i);
  }
}
function wi(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function qu(t) {
  return new TextDecoder().decode(t);
}
function bn(t) {
  return typeof t == "string" && (t = wi(t)), Ee(t), t;
}
function Wu(t) {
  return typeof t == "string" && (t = wi(t)), Ee(t), t;
}
function Xu(...t) {
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
function Yu(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let mi = class {
};
function Tr(t) {
  const e = (r) => t().update(bn(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function c0(t) {
  const e = (r, s) => t(s).update(bn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function a0(t) {
  const e = (r, s) => t(s).update(bn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const Zu = Tr, Ju = c0, Qu = a0;
function td(t = 32) {
  if (je && typeof je.getRandomValues == "function")
    return je.getRandomValues(new Uint8Array(t));
  if (je && typeof je.randomBytes == "function")
    return Uint8Array.from(je.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const ed = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: mi,
  abytes: Ee,
  aexists: _n,
  ahash: e0,
  anumber: Cs,
  aoutput: n0,
  asyncLoop: ju,
  byteSwap: yi,
  byteSwap32: s0,
  byteSwapIfBE: Gu,
  bytesToHex: Ku,
  bytesToUtf8: qu,
  checkOpts: Yu,
  clean: Hn,
  concatBytes: Xu,
  createHasher: Tr,
  createOptHasher: c0,
  createView: gr,
  createXOFer: a0,
  hexToBytes: zu,
  isBytes: t0,
  isLE: xi,
  kdfInputToBytes: Wu,
  nextTick: o0,
  randomBytes: td,
  rotl: Mu,
  rotr: pt,
  swap32IfBE: Ru,
  swap8IfBE: r0,
  toBytes: bn,
  u32: Fu,
  u8: Tu,
  utf8ToBytes: wi,
  wrapConstructor: Zu,
  wrapConstructorWithOpts: Ju,
  wrapXOFConstructorWithOpts: Qu
}, Symbol.toStringTag, { value: "Module" })), Cn = /* @__PURE__ */ On(ed);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = Cn;
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
})(gi);
var Ue = {};
function nd(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, o, r), t.setUint32(e + u, c, r);
}
function rd(t, e, n) {
  return t & e ^ ~t & n;
}
function sd(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class id extends mi {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = gr(this.buffer);
  }
  update(e) {
    _n(this), e = bn(e), Ee(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const f = gr(e);
        for (; s <= i - o; o += s)
          this.process(f, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    _n(this), n0(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, Hn(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let a = o; a < s; a++)
      n[a] = 0;
    nd(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = gr(e), f = this.outputLen;
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
]), od = /* @__PURE__ */ Uint32Array.from([
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
let Si = class extends id {
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
      const b = pt(c, 6) ^ pt(c, 11) ^ pt(c, 25), d = l + b + rd(c, f, u) + od[a] + Yt[a] | 0, y = (pt(r, 2) ^ pt(r, 13) ^ pt(r, 22)) + sd(r, s, i) | 0;
      l = u, u = f, f = c, c = o + d | 0, o = i, i = s, s = r, r = d + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, l = l + this.H | 0, this.set(r, s, i, o, c, f, u, l);
  }
  roundClean() {
    Hn(Yt);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Hn(this.buffer);
  }
}, f0 = class extends Si {
  constructor() {
    super(28), this.A = Xt[0] | 0, this.B = Xt[1] | 0, this.C = Xt[2] | 0, this.D = Xt[3] | 0, this.E = Xt[4] | 0, this.F = Xt[5] | 0, this.G = Xt[6] | 0, this.H = Xt[7] | 0;
  }
};
const cd = /* @__PURE__ */ Tr(() => new Si()), ad = /* @__PURE__ */ Tr(() => new f0()), fd = Si, hd = cd, ld = f0, ud = ad, dd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: ld,
  SHA256: fd,
  sha224: ud,
  sha256: hd
}, Symbol.toStringTag, { value: "Module" })), Fr = /* @__PURE__ */ On(dd);
Object.defineProperty(Ue, "__esModule", { value: !0 });
Ue.c32checkDecode = Ue.c32checkEncode = void 0;
const Ko = Fr, zo = Cn, Bn = gi;
function h0(t) {
  const e = (0, Ko.sha256)((0, Ko.sha256)((0, zo.hexToBytes)(t)));
  return (0, zo.bytesToHex)(e.slice(0, 4));
}
function bd(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = h0(`${n}${e}`), s = (0, Bn.c32encode)(`${e}${r}`);
  return `${Bn.c32[t]}${s}`;
}
Ue.c32checkEncode = bd;
function pd(t) {
  t = (0, Bn.c32normalize)(t);
  const e = (0, Bn.c32decode)(t.slice(1)), n = t[0], r = Bn.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), h0(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Ue.c32checkDecode = pd;
var l0 = {}, sn = {};
function gd(t) {
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
var u0 = gd;
Object.defineProperty(sn, "__esModule", { value: !0 });
sn.decode = sn.encode = void 0;
const Br = Fr, jo = Cn, d0 = u0, b0 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function xd(t, e = "00") {
  const n = typeof t == "string" ? (0, jo.hexToBytes)(t) : t, r = typeof e == "string" ? (0, jo.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Br.sha256)((0, Br.sha256)(new Uint8Array([...r, ...n])));
  return d0(b0).encode([...r, ...n, ...s.slice(0, 4)]);
}
sn.encode = xd;
function yd(t) {
  const e = d0(b0).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Br.sha256)((0, Br.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
sn.decode = yd;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Ue, n = sn, r = Cn;
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
})(l0);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = gi;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Ue;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = l0;
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
})(dn);
var $r = { exports: {} };
$r.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", c = "[object Boolean]", f = "[object Date]", u = "[object Error]", l = "[object Function]", a = "[object GeneratorFunction]", b = "[object Map]", d = "[object Number]", g = "[object Object]", y = "[object Promise]", B = "[object RegExp]", H = "[object Set]", L = "[object String]", x = "[object Symbol]", $ = "[object WeakMap]", S = "[object ArrayBuffer]", P = "[object DataView]", k = "[object Float32Array]", U = "[object Float64Array]", O = "[object Int8Array]", p = "[object Int16Array]", E = "[object Int32Array]", I = "[object Uint8Array]", D = "[object Uint8ClampedArray]", V = "[object Uint16Array]", N = "[object Uint32Array]", Ge = /[\\^$.*+?()[\]{}|]/g, yn = /\w*$/, Tn = /^\[object .+?Constructor\]$/, Z = /^(?:0|[1-9]\d*)$/, K = {};
  K[i] = K[o] = K[S] = K[P] = K[c] = K[f] = K[k] = K[U] = K[O] = K[p] = K[E] = K[b] = K[d] = K[g] = K[B] = K[H] = K[L] = K[x] = K[I] = K[D] = K[V] = K[N] = !0, K[u] = K[l] = K[$] = !1;
  var Jf = typeof rt == "object" && rt && rt.Object === Object && rt, Qf = typeof self == "object" && self && self.Object === Object && self, Ct = Jf || Qf || Function("return this")(), Xi = e && !e.nodeType && e, Yi = Xi && !0 && t && !t.nodeType && t, th = Yi && Yi.exports === Xi;
  function eh(h, w) {
    return h.set(w[0], w[1]), h;
  }
  function nh(h, w) {
    return h.add(w), h;
  }
  function rh(h, w) {
    for (var A = -1, C = h ? h.length : 0; ++A < C && w(h[A], A, h) !== !1; )
      ;
    return h;
  }
  function sh(h, w) {
    for (var A = -1, C = w.length, et = h.length; ++A < C; )
      h[et + A] = w[A];
    return h;
  }
  function Zi(h, w, A, C) {
    for (var et = -1, it = h ? h.length : 0; ++et < it; )
      A = w(A, h[et], et, h);
    return A;
  }
  function ih(h, w) {
    for (var A = -1, C = Array(h); ++A < h; )
      C[A] = w(A);
    return C;
  }
  function oh(h, w) {
    return h == null ? void 0 : h[w];
  }
  function Ji(h) {
    var w = !1;
    if (h != null && typeof h.toString != "function")
      try {
        w = !!(h + "");
      } catch {
      }
    return w;
  }
  function Qi(h) {
    var w = -1, A = Array(h.size);
    return h.forEach(function(C, et) {
      A[++w] = [et, C];
    }), A;
  }
  function Jr(h, w) {
    return function(A) {
      return h(w(A));
    };
  }
  function to(h) {
    var w = -1, A = Array(h.size);
    return h.forEach(function(C) {
      A[++w] = C;
    }), A;
  }
  var ch = Array.prototype, ah = Function.prototype, Fn = Object.prototype, Qr = Ct["__core-js_shared__"], eo = function() {
    var h = /[^.]+$/.exec(Qr && Qr.keys && Qr.keys.IE_PROTO || "");
    return h ? "Symbol(src)_1." + h : "";
  }(), no = ah.toString, Vt = Fn.hasOwnProperty, Mn = Fn.toString, fh = RegExp(
    "^" + no.call(Vt).replace(Ge, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), ro = th ? Ct.Buffer : void 0, so = Ct.Symbol, io = Ct.Uint8Array, hh = Jr(Object.getPrototypeOf, Object), lh = Object.create, uh = Fn.propertyIsEnumerable, dh = ch.splice, oo = Object.getOwnPropertySymbols, bh = ro ? ro.isBuffer : void 0, ph = Jr(Object.keys, Object), ts = Ke(Ct, "DataView"), wn = Ke(Ct, "Map"), es = Ke(Ct, "Promise"), ns = Ke(Ct, "Set"), rs = Ke(Ct, "WeakMap"), mn = Ke(Object, "create"), gh = $e(ts), xh = $e(wn), yh = $e(es), wh = $e(ns), mh = $e(rs), co = so ? so.prototype : void 0, ao = co ? co.valueOf : void 0;
  function Ae(h) {
    var w = -1, A = h ? h.length : 0;
    for (this.clear(); ++w < A; ) {
      var C = h[w];
      this.set(C[0], C[1]);
    }
  }
  function Sh() {
    this.__data__ = mn ? mn(null) : {};
  }
  function Eh(h) {
    return this.has(h) && delete this.__data__[h];
  }
  function Ah(h) {
    var w = this.__data__;
    if (mn) {
      var A = w[h];
      return A === r ? void 0 : A;
    }
    return Vt.call(w, h) ? w[h] : void 0;
  }
  function Bh(h) {
    var w = this.__data__;
    return mn ? w[h] !== void 0 : Vt.call(w, h);
  }
  function $h(h, w) {
    var A = this.__data__;
    return A[h] = mn && w === void 0 ? r : w, this;
  }
  Ae.prototype.clear = Sh, Ae.prototype.delete = Eh, Ae.prototype.get = Ah, Ae.prototype.has = Bh, Ae.prototype.set = $h;
  function Pt(h) {
    var w = -1, A = h ? h.length : 0;
    for (this.clear(); ++w < A; ) {
      var C = h[w];
      this.set(C[0], C[1]);
    }
  }
  function vh() {
    this.__data__ = [];
  }
  function _h(h) {
    var w = this.__data__, A = Gn(w, h);
    if (A < 0)
      return !1;
    var C = w.length - 1;
    return A == C ? w.pop() : dh.call(w, A, 1), !0;
  }
  function Hh(h) {
    var w = this.__data__, A = Gn(w, h);
    return A < 0 ? void 0 : w[A][1];
  }
  function Lh(h) {
    return Gn(this.__data__, h) > -1;
  }
  function Ih(h, w) {
    var A = this.__data__, C = Gn(A, h);
    return C < 0 ? A.push([h, w]) : A[C][1] = w, this;
  }
  Pt.prototype.clear = vh, Pt.prototype.delete = _h, Pt.prototype.get = Hh, Pt.prototype.has = Lh, Pt.prototype.set = Ih;
  function Re(h) {
    var w = -1, A = h ? h.length : 0;
    for (this.clear(); ++w < A; ) {
      var C = h[w];
      this.set(C[0], C[1]);
    }
  }
  function Uh() {
    this.__data__ = {
      hash: new Ae(),
      map: new (wn || Pt)(),
      string: new Ae()
    };
  }
  function Oh(h) {
    return Rn(this, h).delete(h);
  }
  function Ch(h) {
    return Rn(this, h).get(h);
  }
  function Ph(h) {
    return Rn(this, h).has(h);
  }
  function Nh(h, w) {
    return Rn(this, h).set(h, w), this;
  }
  Re.prototype.clear = Uh, Re.prototype.delete = Oh, Re.prototype.get = Ch, Re.prototype.has = Ph, Re.prototype.set = Nh;
  function Ve(h) {
    this.__data__ = new Pt(h);
  }
  function Dh() {
    this.__data__ = new Pt();
  }
  function kh(h) {
    return this.__data__.delete(h);
  }
  function Th(h) {
    return this.__data__.get(h);
  }
  function Fh(h) {
    return this.__data__.has(h);
  }
  function Mh(h, w) {
    var A = this.__data__;
    if (A instanceof Pt) {
      var C = A.__data__;
      if (!wn || C.length < n - 1)
        return C.push([h, w]), this;
      A = this.__data__ = new Re(C);
    }
    return A.set(h, w), this;
  }
  Ve.prototype.clear = Dh, Ve.prototype.delete = kh, Ve.prototype.get = Th, Ve.prototype.has = Fh, Ve.prototype.set = Mh;
  function Gh(h, w) {
    var A = os(h) || ll(h) ? ih(h.length, String) : [], C = A.length, et = !!C;
    for (var it in h)
      Vt.call(h, it) && !(et && (it == "length" || cl(it, C))) && A.push(it);
    return A;
  }
  function fo(h, w, A) {
    var C = h[w];
    (!(Vt.call(h, w) && bo(C, A)) || A === void 0 && !(w in h)) && (h[w] = A);
  }
  function Gn(h, w) {
    for (var A = h.length; A--; )
      if (bo(h[A][0], w))
        return A;
    return -1;
  }
  function Rh(h, w) {
    return h && ho(w, cs(w), h);
  }
  function ss(h, w, A, C, et, it, Nt) {
    var ot;
    if (C && (ot = it ? C(h, et, it, Nt) : C(h)), ot !== void 0)
      return ot;
    if (!Vn(h))
      return h;
    var xo = os(h);
    if (xo) {
      if (ot = sl(h), !w)
        return el(h, ot);
    } else {
      var ze = Be(h), yo = ze == l || ze == a;
      if (dl(h))
        return Wh(h, w);
      if (ze == g || ze == i || yo && !it) {
        if (Ji(h))
          return it ? h : {};
        if (ot = il(yo ? {} : h), !w)
          return nl(h, Rh(ot, h));
      } else {
        if (!K[ze])
          return it ? h : {};
        ot = ol(h, ze, ss, w);
      }
    }
    Nt || (Nt = new Ve());
    var wo = Nt.get(h);
    if (wo)
      return wo;
    if (Nt.set(h, ot), !xo)
      var mo = A ? rl(h) : cs(h);
    return rh(mo || h, function(as, Kn) {
      mo && (Kn = as, as = h[Kn]), fo(ot, Kn, ss(as, w, A, C, Kn, h, Nt));
    }), ot;
  }
  function Vh(h) {
    return Vn(h) ? lh(h) : {};
  }
  function Kh(h, w, A) {
    var C = w(h);
    return os(h) ? C : sh(C, A(h));
  }
  function zh(h) {
    return Mn.call(h);
  }
  function jh(h) {
    if (!Vn(h) || fl(h))
      return !1;
    var w = go(h) || Ji(h) ? fh : Tn;
    return w.test($e(h));
  }
  function qh(h) {
    if (!uo(h))
      return ph(h);
    var w = [];
    for (var A in Object(h))
      Vt.call(h, A) && A != "constructor" && w.push(A);
    return w;
  }
  function Wh(h, w) {
    if (w)
      return h.slice();
    var A = new h.constructor(h.length);
    return h.copy(A), A;
  }
  function is(h) {
    var w = new h.constructor(h.byteLength);
    return new io(w).set(new io(h)), w;
  }
  function Xh(h, w) {
    var A = w ? is(h.buffer) : h.buffer;
    return new h.constructor(A, h.byteOffset, h.byteLength);
  }
  function Yh(h, w, A) {
    var C = w ? A(Qi(h), !0) : Qi(h);
    return Zi(C, eh, new h.constructor());
  }
  function Zh(h) {
    var w = new h.constructor(h.source, yn.exec(h));
    return w.lastIndex = h.lastIndex, w;
  }
  function Jh(h, w, A) {
    var C = w ? A(to(h), !0) : to(h);
    return Zi(C, nh, new h.constructor());
  }
  function Qh(h) {
    return ao ? Object(ao.call(h)) : {};
  }
  function tl(h, w) {
    var A = w ? is(h.buffer) : h.buffer;
    return new h.constructor(A, h.byteOffset, h.length);
  }
  function el(h, w) {
    var A = -1, C = h.length;
    for (w || (w = Array(C)); ++A < C; )
      w[A] = h[A];
    return w;
  }
  function ho(h, w, A, C) {
    A || (A = {});
    for (var et = -1, it = w.length; ++et < it; ) {
      var Nt = w[et], ot = void 0;
      fo(A, Nt, ot === void 0 ? h[Nt] : ot);
    }
    return A;
  }
  function nl(h, w) {
    return ho(h, lo(h), w);
  }
  function rl(h) {
    return Kh(h, cs, lo);
  }
  function Rn(h, w) {
    var A = h.__data__;
    return al(w) ? A[typeof w == "string" ? "string" : "hash"] : A.map;
  }
  function Ke(h, w) {
    var A = oh(h, w);
    return jh(A) ? A : void 0;
  }
  var lo = oo ? Jr(oo, Object) : gl, Be = zh;
  (ts && Be(new ts(new ArrayBuffer(1))) != P || wn && Be(new wn()) != b || es && Be(es.resolve()) != y || ns && Be(new ns()) != H || rs && Be(new rs()) != $) && (Be = function(h) {
    var w = Mn.call(h), A = w == g ? h.constructor : void 0, C = A ? $e(A) : void 0;
    if (C)
      switch (C) {
        case gh:
          return P;
        case xh:
          return b;
        case yh:
          return y;
        case wh:
          return H;
        case mh:
          return $;
      }
    return w;
  });
  function sl(h) {
    var w = h.length, A = h.constructor(w);
    return w && typeof h[0] == "string" && Vt.call(h, "index") && (A.index = h.index, A.input = h.input), A;
  }
  function il(h) {
    return typeof h.constructor == "function" && !uo(h) ? Vh(hh(h)) : {};
  }
  function ol(h, w, A, C) {
    var et = h.constructor;
    switch (w) {
      case S:
        return is(h);
      case c:
      case f:
        return new et(+h);
      case P:
        return Xh(h, C);
      case k:
      case U:
      case O:
      case p:
      case E:
      case I:
      case D:
      case V:
      case N:
        return tl(h, C);
      case b:
        return Yh(h, C, A);
      case d:
      case L:
        return new et(h);
      case B:
        return Zh(h);
      case H:
        return Jh(h, C, A);
      case x:
        return Qh(h);
    }
  }
  function cl(h, w) {
    return w = w ?? s, !!w && (typeof h == "number" || Z.test(h)) && h > -1 && h % 1 == 0 && h < w;
  }
  function al(h) {
    var w = typeof h;
    return w == "string" || w == "number" || w == "symbol" || w == "boolean" ? h !== "__proto__" : h === null;
  }
  function fl(h) {
    return !!eo && eo in h;
  }
  function uo(h) {
    var w = h && h.constructor, A = typeof w == "function" && w.prototype || Fn;
    return h === A;
  }
  function $e(h) {
    if (h != null) {
      try {
        return no.call(h);
      } catch {
      }
      try {
        return h + "";
      } catch {
      }
    }
    return "";
  }
  function hl(h) {
    return ss(h, !0, !0);
  }
  function bo(h, w) {
    return h === w || h !== h && w !== w;
  }
  function ll(h) {
    return ul(h) && Vt.call(h, "callee") && (!uh.call(h, "callee") || Mn.call(h) == i);
  }
  var os = Array.isArray;
  function po(h) {
    return h != null && bl(h.length) && !go(h);
  }
  function ul(h) {
    return pl(h) && po(h);
  }
  var dl = bh || xl;
  function go(h) {
    var w = Vn(h) ? Mn.call(h) : "";
    return w == l || w == a;
  }
  function bl(h) {
    return typeof h == "number" && h > -1 && h % 1 == 0 && h <= s;
  }
  function Vn(h) {
    var w = typeof h;
    return !!h && (w == "object" || w == "function");
  }
  function pl(h) {
    return !!h && typeof h == "object";
  }
  function cs(h) {
    return po(h) ? Gh(h) : qh(h);
  }
  function gl() {
    return [];
  }
  function xl() {
    return !1;
  }
  t.exports = hl;
})($r, $r.exports);
$r.exports;
function Ps(t) {
  return dn.c32address(t.version, t.hash160);
}
function Ei(t, e, n) {
  const r = e || 1, s = n || _l;
  if (Xd(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: vn.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Ai(t) {
  const e = dn.c32addressDecode(t);
  return {
    type: vn.Address,
    version: e[0],
    hash160: e[1]
  };
}
var v;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(v || (v = {}));
function wd(t) {
  if (t.type === v.PrincipalStandard)
    return Ps(t.address);
  if (t.type === v.PrincipalContract)
    return `${Ps(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function md(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Ad(e, n);
  } else
    return Sd(t);
}
function Sd(t) {
  const e = Ai(t);
  return { type: v.PrincipalStandard, address: e };
}
function Ed(t) {
  return { type: v.PrincipalStandard, address: t };
}
function Ad(t, e) {
  const n = Ai(t), r = Ei(e);
  return p0(n, r);
}
function p0(t, e) {
  if (Un(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: v.PrincipalContract, address: t, contractName: e };
}
function us(t, e = !1) {
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
      return Xe(t.value);
    case v.ResponseErr:
      return Xe(t.value);
    case v.ResponseOk:
      return Xe(t.value);
    case v.PrincipalStandard:
    case v.PrincipalContract:
      return wd(t);
    case v.List:
      return t.list.map((r) => Xe(r));
    case v.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = Xe(t.data[r]);
      }), n;
    case v.StringASCII:
      return t.data;
    case v.StringUTF8:
      return t.data;
  }
}
function Xe(t) {
  switch (t.type) {
    case v.ResponseErr:
      return { type: xe(t), value: us(t, !0), success: !1 };
    case v.ResponseOk:
      return { type: xe(t), value: us(t, !0), success: !0 };
    default:
      return { type: xe(t), value: us(t, !0) };
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
      return `(string-ascii ${Ua(t.data).length})`;
    case v.StringUTF8:
      return `(string-utf8 ${Un(t.data).length})`;
  }
}
const Bd = () => ({ type: v.BoolTrue }), $d = () => ({ type: v.BoolFalse }), qo = BigInt("0xffffffffffffffffffffffffffffffff"), vd = BigInt(0), Wo = BigInt("0x7fffffffffffffffffffffffffffffff"), Xo = BigInt("-170141183460469231731687303715884105728"), _d = (t) => {
  const e = ii(t, !0);
  if (e > Wo)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Wo}`);
  if (e < Xo)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Xo}`);
  return { type: v.Int, value: e };
}, g0 = (t) => {
  const e = ii(t, !1);
  if (e < vd)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > qo)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${qo}`);
  return { type: v.UInt, value: e };
}, Hd = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: v.Buffer, buffer: t };
};
function Ld() {
  return { type: v.OptionalNone };
}
function Id(t) {
  return { type: v.OptionalSome, value: t };
}
function Ud(t) {
  return { type: v.ResponseErr, value: t };
}
function Od(t) {
  return { type: v.ResponseOk, value: t };
}
function Cd(t) {
  return { type: v.List, list: t };
}
function x0(t) {
  for (const e in t)
    if (!Yd(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: v.Tuple, data: t };
}
const xr = (t) => ({ type: v.StringASCII, data: t }), Pd = (t) => ({ type: v.StringUTF8, data: t });
let y0 = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Nd = class extends y0 {
  constructor(e) {
    super(e);
  }
};
class ds extends y0 {
  constructor(e) {
    super(e);
  }
}
function w0(t) {
  const e = [];
  return e.push(Qe(oi(t.version, 1))), e.push(Qe(t.hash160)), ln(e);
}
function Yo(t) {
  const e = Ha(Mt(t.readBytes(1))), n = Mt(t.readBytes(20));
  return { type: vn.Address, version: e, hash160: n };
}
function m0(t) {
  const e = [], n = Un(t.content), r = n.byteLength;
  return e.push(Qe(oi(r, t.lengthPrefixBytes))), e.push(n), ln(e);
}
function Zo(t, e, n) {
  e = e || 1;
  const r = Ha(Mt(t.readBytes(e))), s = Ia(t.readBytes(r));
  return Ei(s, e, 128);
}
function It(t, e) {
  return ln([t, e]);
}
function Dd(t) {
  return new Uint8Array([t.type]);
}
function kd(t) {
  return t.type === v.OptionalNone ? new Uint8Array([t.type]) : It(t.type, Pn(t.value));
}
function Td(t) {
  const e = new Uint8Array(4);
  return Dr(e, t.buffer.length, 0), It(t.type, ci(e, t.buffer));
}
function Fd(t) {
  const e = La(yl(t.value, BigInt(Hl)), Oa);
  return It(t.type, e);
}
function Md(t) {
  const e = La(t.value, Oa);
  return It(t.type, e);
}
function Gd(t) {
  return It(t.type, w0(t.address));
}
function Rd(t) {
  return It(t.type, ci(w0(t.address), m0(t.contractName)));
}
function Vd(t) {
  return It(t.type, Pn(t.value));
}
function Kd(t) {
  const e = [], n = new Uint8Array(4);
  Dr(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Pn(r);
    e.push(s);
  }
  return It(t.type, ln(e));
}
function zd(t) {
  const e = [], n = new Uint8Array(4);
  Dr(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Ei(s);
    e.push(m0(i));
    const o = Pn(t.data[s]);
    e.push(o);
  }
  return It(t.type, ln(e));
}
function S0(t, e) {
  const n = [], r = e == "ascii" ? Ua(t.data) : Un(t.data), s = new Uint8Array(4);
  return Dr(s, r.length, 0), n.push(s), n.push(r), It(t.type, ln(n));
}
function jd(t) {
  return S0(t, "ascii");
}
function qd(t) {
  return S0(t, "utf8");
}
function Pn(t) {
  switch (t.type) {
    case v.BoolTrue:
    case v.BoolFalse:
      return Dd(t);
    case v.OptionalNone:
    case v.OptionalSome:
      return kd(t);
    case v.Buffer:
      return Td(t);
    case v.UInt:
      return Md(t);
    case v.Int:
      return Fd(t);
    case v.PrincipalStandard:
      return Gd(t);
    case v.PrincipalContract:
      return Rd(t);
    case v.ResponseOk:
    case v.ResponseErr:
      return Vd(t);
    case v.List:
      return Kd(t);
    case v.Tuple:
      return zd(t);
    case v.StringASCII:
      return jd(t);
    case v.StringUTF8:
      return qd(t);
    default:
      throw new Nd("Unable to serialize. Invalid Clarity Value.");
  }
}
function Wd(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Jo = /* @__PURE__ */ new Map();
function E0(t, e) {
  const n = Jo.get(t);
  if (n !== void 0)
    return n(e);
  const r = Wd(t);
  return Jo.set(t, r), E0(t, e);
}
class Qo {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return vl(this.readBytes(4), 0);
  }
  readUInt8() {
    return $l(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Bl(this.readBytes(2), 0);
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
    if (E0(e, r))
      return r;
    throw n(r);
  }
}
function Ye(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Qo(Qe(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Qo(t) : e = t;
  switch (e.readUInt8Enum(v, (r) => {
    throw new ds(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case v.Int:
      return _d(e.readBytes(16));
    case v.UInt:
      return g0(e.readBytes(16));
    case v.Buffer:
      const r = e.readUInt32BE();
      return Hd(e.readBytes(r));
    case v.BoolTrue:
      return Bd();
    case v.BoolFalse:
      return $d();
    case v.PrincipalStandard:
      const s = Yo(e);
      return Ed(s);
    case v.PrincipalContract:
      const i = Yo(e), o = Zo(e);
      return p0(i, o);
    case v.ResponseOk:
      return Od(Ye(e));
    case v.ResponseErr:
      return Ud(Ye(e));
    case v.OptionalNone:
      return Ld();
    case v.OptionalSome:
      return Id(Ye(e));
    case v.List:
      const c = e.readUInt32BE(), f = [];
      for (let y = 0; y < c; y++)
        f.push(Ye(e));
      return Cd(f);
    case v.Tuple:
      const u = e.readUInt32BE(), l = {};
      for (let y = 0; y < u; y++) {
        const B = Zo(e).content;
        if (B === void 0)
          throw new ds('"content" is undefined');
        l[B] = Ye(e);
      }
      return x0(l);
    case v.StringASCII:
      const a = e.readUInt32BE(), b = El(e.readBytes(a));
      return xr(b);
    case v.StringUTF8:
      const d = e.readUInt32BE(), g = Ia(e.readBytes(d));
      return Pd(g);
    default:
      throw new ds("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const Xd = (t, e) => t ? Un(t).length > e : !1;
function Yd(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function A0(t) {
  const e = Pn(t);
  return `0x${Mt(e)}`;
}
function Zd(t) {
  return Ye(t);
}
const Jd = (t) => {
  try {
    return dn.c32addressDecode(t), !0;
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
            var Ge = V.join(":").trim();
            try {
              E.append(N, Ge);
            } catch (yn) {
              console.warn("Response " + yn.message);
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
          function Ge() {
            N.abort();
          }
          N.onload = function() {
            var Z = {
              statusText: N.statusText,
              headers: P(N.getAllResponseHeaders() || "")
            };
            V.url.indexOf("file://") === 0 && (N.status < 200 || N.status > 599) ? Z.status = 200 : Z.status = N.status, Z.url = "responseURL" in N ? N.responseURL : Z.headers.get("X-Request-URL");
            var K = "response" in N ? N.response : N.responseText;
            setTimeout(function() {
              I(new k(K, Z));
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
          function yn(Z) {
            try {
              return Z === "" && n.location.href ? n.location.href : Z;
            } catch {
              return Z;
            }
          }
          if (N.open(V.method, yn(V.url), !0), V.credentials === "include" ? N.withCredentials = !0 : V.credentials === "omit" && (N.withCredentials = !1), "responseType" in N && (r.blob ? N.responseType = "blob" : r.arrayBuffer && (N.responseType = "arraybuffer")), E && typeof E.headers == "object" && !(E.headers instanceof l || n.Headers && E.headers instanceof n.Headers)) {
            var Tn = [];
            Object.getOwnPropertyNames(E.headers).forEach(function(Z) {
              Tn.push(c(Z)), N.setRequestHeader(Z, f(E.headers[Z]));
            }), V.headers.forEach(function(Z, K) {
              Tn.indexOf(K) === -1 && N.setRequestHeader(K, Z);
            });
          } else
            V.headers.forEach(function(Z, K) {
              N.setRequestHeader(K, Z);
            });
          V.signal && (V.signal.addEventListener("abort", Ge), N.onreadystatechange = function() {
            N.readyState === 4 && V.signal.removeEventListener("abort", Ge);
          }), N.send(typeof V._bodyInit > "u" ? null : V._bodyInit);
        });
      }
      return O.polyfill = !0, n.fetch || (n.fetch = O, n.Headers = l, n.Request = $, n.Response = k), e.Headers = l, e.Request = $, e.Response = k, e.fetch = O, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : rt);
})();
const Qd = "https://browser.blockstack.org/auth", t1 = {
  "@type": "Person",
  "@context": "http://schema.org"
}, B0 = ["store_write"], e1 = "blockstack-session", n1 = {
  logLevel: "debug"
}, De = {
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
Object.freeze(De);
class pn extends Error {
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
class r1 extends pn {
  constructor(e, n = "") {
    super({ code: De.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class tc extends pn {
  constructor(e = "") {
    super({ code: De.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Jn extends pn {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: De.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class ec extends pn {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: De.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Ns extends pn {
  constructor(e) {
    super({ code: De.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class $0 extends pn {
  constructor(e) {
    super({ code: De.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const nc = ["debug", "info", "warn", "error", "none"], Ds = {};
for (let t = 0; t < nc.length; t++) {
  const e = nc[t];
  Ds[e] = t;
}
class Ze {
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
    return Ds[n1.logLevel] <= Ds[e];
  }
}
function s1() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function i1() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function bs(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function o1() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function c1() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function a1(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function Bi(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = c1(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    Ze.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = a1(s, t.toString(), n);
    throw Ze.error(i), new Error(i);
  }
  if (r)
    return {};
}
function f1(t) {
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
  if (p1(t, Uint8Array))
    return BigInt(`0x${bt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function h1(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function $i(t, e = 8) {
  return (typeof t == "bigint" ? t : f1(t)).toString(16).padStart(e * 2, "0");
}
function v0(t, e = 16) {
  const n = $i(t, e);
  return at(n);
}
function l1(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const u1 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function bt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += u1[n];
  return e;
}
function at(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = h1(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function Nn(t) {
  return new TextEncoder().encode(t);
}
function _0(t) {
  return new TextDecoder().decode(t);
}
function d1(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function b1(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function rc(t) {
  if (t.some(b1))
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
function gn(t) {
  return Gt(...t.map((e) => typeof e == "number" ? rc([e]) : e instanceof Array ? rc(e) : e));
}
function p1(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const g1 = "https://api.mainnet.hiro.so", x1 = "https://api.testnet.hiro.so", y1 = "http://localhost:3999", w1 = "https://hub.blockstack.org";
function m1(t) {
  const e = typeof t == "string" ? at(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Mr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const S1 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function E1(t, e) {
  const n = {};
  return Object.assign(n, S1, e), await fetch(t, n);
}
function A1(t) {
  let e = E1, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function B1(...t) {
  const { fetchLib: e, middlewares: n } = A1(t);
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
class H0 {
  constructor(e = B0.slice(), n = ((c) => (c = Bi("location", { returnEmptyObject: !0 })) == null ? void 0 : c.origin)(), r = "", s = "/manifest.json", i = void 0, o = Qd) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function ks(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function $1(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function L0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function v1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ks(t.outputLen), ks(t.blockLen);
}
function _1(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function H1(t, e) {
  L0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ve = {
  number: ks,
  bool: $1,
  bytes: L0,
  hash: v1,
  exists: _1,
  output: H1
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ps = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Et = (t, e) => t << 32 - e | t >>> e, L1 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!L1)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function I1(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function vi(t) {
  if (typeof t == "string" && (t = I1(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let I0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ke(t) {
  const e = (r) => t().update(vi(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let U0 = class extends I0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ve.hash(e);
    const r = vi(n);
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
    return ve.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    ve.exists(this), ve.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Gr = (t, e, n) => new U0(t, e).update(n).digest();
Gr.create = (t, e) => new U0(t, e);
function U1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, o, r), t.setUint32(e + u, c, r);
}
let _i = class extends I0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ps(this.buffer);
  }
  update(e) {
    ve.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = vi(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const f = ps(e);
        for (; s <= i - o; o += s)
          this.process(f, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ve.exists(this), ve.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let a = o; a < s; a++)
      n[a] = 0;
    U1(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = ps(e), f = this.outputLen;
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
const O1 = (t, e, n) => t & e ^ ~t & n, C1 = (t, e, n) => t & e ^ t & n ^ e & n, P1 = new Uint32Array([
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
let O0 = class extends _i {
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
      const b = Et(c, 6) ^ Et(c, 11) ^ Et(c, 25), d = l + b + O1(c, f, u) + P1[a] + Jt[a] | 0, y = (Et(r, 2) ^ Et(r, 13) ^ Et(r, 22)) + C1(r, s, i) | 0;
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
}, N1 = class extends O0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const on = ke(() => new O0());
ke(() => new N1());
var Dn = {};
Dn.byteLength = M1;
var D1 = Dn.toByteArray = R1, k1 = Dn.fromByteArray = z1, vt = [], ut = [], T1 = typeof Uint8Array < "u" ? Uint8Array : Array, gs = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var qe = 0, F1 = gs.length; qe < F1; ++qe)
  vt[qe] = gs[qe], ut[gs.charCodeAt(qe)] = qe;
ut[45] = 62;
ut[95] = 63;
function C0(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function M1(t) {
  var e = C0(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function G1(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function R1(t) {
  var e, n = C0(t), r = n[0], s = n[1], i = new T1(G1(t, r, s)), o = 0, c = s > 0 ? r - 4 : r, f;
  for (f = 0; f < c; f += 4)
    e = ut[t.charCodeAt(f)] << 18 | ut[t.charCodeAt(f + 1)] << 12 | ut[t.charCodeAt(f + 2)] << 6 | ut[t.charCodeAt(f + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = ut[t.charCodeAt(f)] << 2 | ut[t.charCodeAt(f + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = ut[t.charCodeAt(f)] << 10 | ut[t.charCodeAt(f + 1)] << 4 | ut[t.charCodeAt(f + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function V1(t) {
  return vt[t >> 18 & 63] + vt[t >> 12 & 63] + vt[t >> 6 & 63] + vt[t & 63];
}
function K1(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(V1(r));
  return s.join("");
}
function z1(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, c = n - r; o < c; o += i)
    s.push(K1(t, o, o + i > c ? c : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    vt[e >> 2] + vt[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    vt[e >> 10] + vt[e >> 4 & 63] + vt[e << 2 & 63] + "="
  )), s.join("");
}
function j1() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const q1 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function W1() {
  if (j1())
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
    throw new Error(q1);
  }
}
class X1 {
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
class Y1 {
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
async function P0() {
  const t = await W1();
  return t.name === "subtleCrypto" ? new Y1(t.lib) : new X1(t.lib.createCipheriv, t.lib.createDecipheriv);
}
const Z1 = u0, J1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Q1 = Z1(J1);
const t2 = /* @__PURE__ */ ku(Q1), e2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), N0 = Uint8Array.from({ length: 16 }, (t, e) => e), n2 = N0.map((t) => (9 * t + 5) % 16);
let Hi = [N0], Li = [n2];
for (let t = 0; t < 4; t++)
  for (let e of [Hi, Li])
    e.push(e[t].map((n) => e2[n]));
const D0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), r2 = Hi.map((t, e) => t.map((n) => D0[e][n])), s2 = Li.map((t, e) => t.map((n) => D0[e][n])), i2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), o2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Qn = (t, e) => t << e | t >>> 32 - e;
function sc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const tr = new Uint32Array(16);
let c2 = class extends _i {
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
      tr[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, f = c, u = this.h3 | 0, l = u, a = this.h4 | 0, b = a;
    for (let d = 0; d < 5; d++) {
      const g = 4 - d, y = i2[d], B = o2[d], H = Hi[d], L = Li[d], x = r2[d], $ = s2[d];
      for (let S = 0; S < 16; S++) {
        const P = Qn(r + sc(d, i, c, u) + tr[H[S]] + y, x[S]) + a | 0;
        r = a, a = u, u = Qn(c, 10) | 0, c = i, i = P;
      }
      for (let S = 0; S < 16; S++) {
        const P = Qn(s + sc(g, o, f, l) + tr[L[S]] + B, $[S]) + b | 0;
        s = b, b = l, l = Qn(f, 10) | 0, f = o, o = P;
      }
    }
    this.set(this.h1 + c + l | 0, this.h2 + u + b | 0, this.h3 + a + s | 0, this.h4 + r + o | 0, this.h0 + i + f | 0);
  }
  roundClean() {
    tr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const a2 = ke(() => new c2());
function f2(t) {
  return a2(t);
}
const er = BigInt(2 ** 32 - 1), Ts = BigInt(32);
function k0(t, e = !1) {
  return e ? { h: Number(t & er), l: Number(t >> Ts & er) } : { h: Number(t >> Ts & er) | 0, l: Number(t & er) | 0 };
}
function h2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = k0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const l2 = (t, e) => BigInt(t >>> 0) << Ts | BigInt(e >>> 0), u2 = (t, e, n) => t >>> n, d2 = (t, e, n) => t << 32 - n | e >>> n, b2 = (t, e, n) => t >>> n | e << 32 - n, p2 = (t, e, n) => t << 32 - n | e >>> n, g2 = (t, e, n) => t << 64 - n | e >>> n - 32, x2 = (t, e, n) => t >>> n - 32 | e << 64 - n, y2 = (t, e) => e, w2 = (t, e) => t, m2 = (t, e, n) => t << n | e >>> 32 - n, S2 = (t, e, n) => e << n | t >>> 32 - n, E2 = (t, e, n) => e << n - 32 | t >>> 64 - n, A2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function B2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const $2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), v2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, _2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), H2 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, L2 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), I2 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, F = {
  fromBig: k0,
  split: h2,
  toBig: l2,
  shrSH: u2,
  shrSL: d2,
  rotrSH: b2,
  rotrSL: p2,
  rotrBH: g2,
  rotrBL: x2,
  rotr32H: y2,
  rotr32L: w2,
  rotlSH: m2,
  rotlSL: S2,
  rotlBH: E2,
  rotlBL: A2,
  add: B2,
  add3L: $2,
  add3H: v2,
  add4L: _2,
  add4H: H2,
  add5H: I2,
  add5L: L2
}, [U2, O2] = F.split([
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
let Rr = class extends _i {
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
      const $ = F.rotrSH(a, b, 14) ^ F.rotrSH(a, b, 18) ^ F.rotrBH(a, b, 41), S = F.rotrSL(a, b, 14) ^ F.rotrSL(a, b, 18) ^ F.rotrBL(a, b, 41), P = a & d ^ ~a & y, k = b & g ^ ~b & B, U = F.add5L(L, S, k, O2[x], te[x]), O = F.add5H(U, H, $, P, U2[x], Qt[x]), p = U | 0, E = F.rotrSH(r, s, 28) ^ F.rotrBH(r, s, 34) ^ F.rotrBH(r, s, 39), I = F.rotrSL(r, s, 28) ^ F.rotrBL(r, s, 34) ^ F.rotrBL(r, s, 39), D = r & i ^ r & c ^ i & c, V = s & o ^ s & f ^ o & f;
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
}, C2 = class extends Rr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, P2 = class extends Rr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, N2 = class extends Rr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const D2 = ke(() => new Rr());
ke(() => new C2());
ke(() => new P2());
ke(() => new N2());
function T0(t) {
  return on(t);
}
function k2(t) {
  return D2(t);
}
const T2 = 0;
Y.hmacSha256Sync = (t, ...e) => {
  const n = Gr.create(on, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function F2() {
  return bt(Y.randomPrivateKey());
}
function M2(t) {
  const e = on(on(t));
  return t2.encode(Gt(t, e).slice(0, t.length + 4));
}
function G2(t, e) {
  return M2(Gt(new Uint8Array([t]), e.slice(0, 20)));
}
function F0(t, e = T2) {
  const n = typeof t == "string" ? at(t) : t, r = f2(T0(n));
  return G2(e, r);
}
function M0(t) {
  const e = m1(t);
  return bt(bi(e.slice(0, 32), !0));
}
Y.hmacSha256Sync = (t, ...e) => {
  const n = Gr.create(on, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var vr;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(vr || (vr = {}));
async function R2(t, e, n) {
  return await (await P0()).encrypt("aes-256-cbc", e, t, n);
}
async function V2(t, e, n) {
  return await (await P0()).decrypt("aes-256-cbc", e, t, n);
}
function G0(t, e) {
  return Gr(on, t, e);
}
function K2(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function R0(t) {
  const e = k2(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function z2(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function j2(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: vr.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: vr.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !z2(t))
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
async function q2(t, e, n, r) {
  const s = j2(t);
  if (!s.result)
    throw s;
  const i = Y.randomPrivateKey(), o = bi(i, !0);
  let c = pi(i, t, !0);
  c = c.slice(1);
  const f = R0(c), u = Y.randomBytes(16), l = await R2(u, f.encryptionKey, e), a = Gt(u, o, l), b = G0(f.hmacKey, a);
  let d;
  if (!r || r === "hex")
    d = bt(l);
  else if (r === "base64")
    d = k1(l);
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
async function V0(t, e) {
  if (!e.ephemeralPK)
    throw new ec("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = pi(t, n, !0);
  r = r.slice(1);
  const s = R0(r), i = at(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = at(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = D1(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const c = Gt(i, at(n), o), f = G0(s.hmacKey, c), u = at(e.mac);
  if (!K2(u, f))
    throw new ec("Decryption failed: failure in MAC check");
  const l = await V2(i, s.encryptionKey, o);
  return e.wasString ? _0(l) : l;
}
function W2(t, e) {
  const n = typeof e == "string" ? Nn(e) : e, r = M0(t), s = T0(n), i = Wa(s, t);
  return {
    signature: bt(i),
    publicKey: r
  };
}
async function X2(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = M0(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? Nn(t) : t, o = await q2(n.publicKey, i, s, n.cipherTextEncoding);
  let c = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const f = W2(r, c), u = {
      signature: f.signature,
      publicKey: f.publicKey,
      cipherText: c
    };
    c = JSON.stringify(u);
  }
  return c;
}
function Y2(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return V0(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var st = {}, cn = {}, nt = {};
Object.defineProperty(nt, "__esModule", { value: !0 });
nt.decode = nt.encode = nt.unescape = nt.escape = nt.pad = void 0;
const K0 = Dn;
function Ii(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
nt.pad = Ii;
function z0(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
nt.escape = z0;
function j0(t) {
  return Ii(t).replace(/-/g, "+").replace(/_/g, "/");
}
nt.unescape = j0;
function Z2(t) {
  return z0((0, K0.fromByteArray)(new TextEncoder().encode(t)));
}
nt.encode = Z2;
function J2(t) {
  return new TextDecoder().decode((0, K0.toByteArray)(Ii(j0(t))));
}
nt.decode = J2;
var Vr = {}, Kr = {};
let Ui = class extends mi {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, e0(e);
    const r = bn(n);
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
    this.oHash.update(i), Hn(i);
  }
  update(e) {
    return _n(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    _n(this), Ee(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const q0 = (t, e, n) => new Ui(t, e).update(n).digest();
q0.create = (t, e) => new Ui(t, e);
const Q2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HMAC: Ui,
  hmac: q0
}, Symbol.toStringTag, { value: "Module" })), tb = /* @__PURE__ */ On(Q2), eb = /* @__PURE__ */ On(Du);
var an = {};
Object.defineProperty(an, "__esModule", { value: !0 });
an.joseToDer = an.derToJose = void 0;
const W0 = Dn, X0 = nt;
function xs(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const nb = {
  ES256: xs(256),
  ES384: xs(384),
  ES512: xs(521)
};
function Y0(t) {
  const e = nb[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const _r = 128, Z0 = 0, rb = 32, sb = 16, ib = 2, J0 = sb | rb | Z0 << 6, Hr = ib | Z0 << 6;
function Q0(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, W0.toByteArray)((0, X0.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function ob(t, e) {
  const n = Q0(t), r = Y0(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== J0)
    throw new Error('Could not find expected "seq"');
  let c = n[o++];
  if (c === (_r | 1) && (c = n[o++]), i - o < c)
    throw new Error(`"seq" specified length of "${c}", only "${i - o}" remaining`);
  if (n[o++] !== Hr)
    throw new Error('Could not find expected "int" for "r"');
  const f = n[o++];
  if (i - o - 2 < f)
    throw new Error(`"r" specified length of "${f}", only "${i - o - 2}" available`);
  if (s < f)
    throw new Error(`"r" specified length of "${f}", max of "${s}" is acceptable`);
  const u = o;
  if (o += f, n[o++] !== Hr)
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
  return g.set(n.subarray(a + Math.max(-d, 0), a + l), o), (0, X0.escape)((0, W0.fromByteArray)(g));
}
an.derToJose = ob;
function ic(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= _r && --r, r;
}
function cb(t, e) {
  t = Q0(t);
  const n = Y0(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = ic(t, 0, n), i = ic(t, n, t.length), o = n - s, c = n - i, f = 2 + o + 1 + 1 + c, u = f < _r, l = new Uint8Array((u ? 2 : 3) + f);
  let a = 0;
  return l[a++] = J0, u ? l[a++] = f : (l[a++] = _r | 1, l[a++] = f & 255), l[a++] = Hr, l[a++] = o, s < 0 ? (l[a++] = 0, l.set(t.subarray(0, n), a), a += n) : (l.set(t.subarray(s, n), a), a += n - s), l[a++] = Hr, l[a++] = c, i < 0 ? (l[a++] = 0, l.set(t.subarray(n), a)) : l.set(t.subarray(n + i), a), l;
}
an.joseToDer = cb;
var Rt = {};
Object.defineProperty(Rt, "__esModule", { value: !0 });
Rt.InvalidTokenError = Rt.MissingParametersError = void 0;
class ab extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Rt.MissingParametersError = ab;
class fb extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Rt.InvalidTokenError = fb;
Object.defineProperty(Kr, "__esModule", { value: !0 });
Kr.SECP256K1Client = void 0;
const hb = tb, lb = Fr, yr = eb, oc = an, cc = Rt, ac = Cn;
yr.utils.hmacSha256Sync = (t, ...e) => {
  const n = hb.hmac.create(lb.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class tf {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, ac.bytesToHex)(yr.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new cc.MissingParametersError("a signing input hash and private key are all required");
    const s = yr.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, ac.bytesToHex)(s);
    if (r === "jose")
      return (0, oc.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, oc.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new cc.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return yr.verify(n, e, r, { strict: !1 });
  }
}
Kr.SECP256K1Client = tf;
tf.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Kr;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(Vr);
var Oe = {};
const ub = /* @__PURE__ */ On(Fa);
var db = rt && rt.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Oe, "__esModule", { value: !0 });
Oe.hashSha256Async = Oe.hashSha256 = void 0;
const bb = Fr;
function ef(t) {
  return (0, bb.sha256)(t);
}
Oe.hashSha256 = ef;
function pb(t) {
  return db(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = ub;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(ef(t));
    }
  });
}
Oe.hashSha256Async = pb;
var gb = rt && rt.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(cn, "__esModule", { value: !0 });
cn.TokenSigner = cn.createUnsecuredToken = void 0;
const Fs = nt, fc = Vr, xb = Rt, hc = Oe;
function Ms(t, e) {
  const n = [], r = Fs.encode(JSON.stringify(e));
  n.push(r);
  const s = Fs.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function yb(t) {
  return Ms(t, { typ: "JWT", alg: "none" }) + ".";
}
cn.createUnsecuredToken = yb;
class wb {
  constructor(e, n) {
    if (!(e && n))
      throw new xb.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !fc.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = fc.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = Ms(e, s), o = (0, hc.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return gb(this, void 0, void 0, function* () {
      const s = this.header(r), i = Ms(e, s), o = yield (0, hc.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [Fs.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
cn.TokenSigner = wb;
var zr = {};
Object.defineProperty(zr, "__esModule", { value: !0 });
zr.TokenVerifier = void 0;
const mb = nt, lc = Vr, Sb = Rt, nr = Oe;
class Eb {
  constructor(e, n) {
    if (!(e && n))
      throw new Sb.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !lc.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = lc.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, nr.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, nr.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), mb.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((c) => {
      const f = this.cryptoClient.loadSignature(c);
      this.cryptoClient.verifyHash(o, f, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, nr.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, nr.hashSha256)(r);
      return i(o);
    }
  }
}
zr.TokenVerifier = Eb;
var jr = {};
Object.defineProperty(jr, "__esModule", { value: !0 });
jr.decodeToken = void 0;
const rr = nt;
function Ab(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(rr.decode(e[0])), r = JSON.parse(rr.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = rr.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(rr.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
jr.decodeToken = Ab;
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
  Object.defineProperty(t, "__esModule", { value: !0 }), n(cn, t), n(zr, t), n(jr, t), n(Rt, t), n(Vr, t);
})(st);
function Bb(t) {
  return `did:btc-addr:${t}`;
}
function $b(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new tc("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new tc('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function nf(t) {
  if (t)
    return $b(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const vb = "1.4.0";
function _b() {
  return F2();
}
function Hb(t, e, n, r = B0.slice(), s, i = s1().getTime(), o = {}) {
  const c = (d) => {
    const g = Bi("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${d}=undefined])`
    });
    return g == null ? void 0 : g.origin;
  };
  e || (e = `${c("redirectURI")}/`), n || (n = `${c("manifestURI")}/manifest.json`), s || (s = c("appDomain"));
  const f = Object.assign({}, o, {
    jti: o1(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: vb,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = st.SECP256K1Client.derivePublicKey(t);
  f.public_keys = [u];
  const l = F0(u);
  return f.iss = Bb(l), new st.TokenSigner("ES256k", t).sign(f);
}
async function uc(t, e) {
  const n = _0(at(e)), r = JSON.parse(n), s = await V0(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function Lb(t) {
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
function Ib(t) {
  const e = st.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = nf(e.iss);
  if (n.length === 1) {
    if (F0(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function Ub(t) {
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
function Ob(t) {
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
function Cb(t) {
  const e = [
    Ob(t),
    Ub(t),
    Lb(t),
    Ib(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const dc = "1.0.0";
class Se {
  constructor(e) {
    this.version = dc, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== dc)
      throw new Ns(`JSON data version ${e.version} not supported by SessionData`);
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
class rf {
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
class bc extends rf {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Se({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new $0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Se({})), !0;
  }
}
class pc extends rf {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = e1, !localStorage.getItem(this.key)) {
      const r = new Se({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new $0("No session data was found in localStorage");
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
var Ln;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Ln || (Ln = {}));
var Lr;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Lr || (Lr = {}));
Ln.Mainnet;
var Tt;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Tt || (Tt = {}));
var Ht;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ht || (Ht = {}));
Tt.Mainnet;
const sf = {
  chainId: Ln.Mainnet,
  transactionVersion: Tt.Mainnet,
  peerNetworkId: Lr.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Ht.MainnetSingleSig,
    multiSig: Ht.MainnetMultiSig
  },
  client: { baseUrl: g1 }
}, Gs = {
  chainId: Ln.Testnet,
  transactionVersion: Tt.Testnet,
  peerNetworkId: Lr.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Ht.TestnetSingleSig,
    multiSig: Ht.TestnetMultiSig
  },
  client: { baseUrl: x1 }
}, wr = {
  ...Gs,
  addressVersion: { ...Gs.addressVersion },
  magicBytes: "id",
  client: { baseUrl: y1 }
}, Pb = {
  ...wr,
  addressVersion: { ...wr.addressVersion },
  client: { ...wr.client }
};
function Nb(t) {
  switch (t) {
    case "mainnet":
      return sf;
    case "testnet":
      return Gs;
    case "devnet":
      return wr;
    case "mocknet":
      return Pb;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function of(t) {
  return typeof t == "string" ? Nb(t) : t;
}
var gc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(gc || (gc = {}));
var xc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(xc || (xc = {}));
var xt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(xt || (xt = {}));
const ys = ["onChainOnly", "offChainOnly", "any"];
ys[0] + "", xt.OnChainOnly, ys[1] + "", xt.OffChainOnly, ys[2] + "", xt.Any, xt.OnChainOnly + "", xt.OnChainOnly, xt.OffChainOnly + "", xt.OffChainOnly, xt.Any + "", xt.Any;
var yc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(yc || (yc = {}));
var wc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(wc || (wc = {}));
var mc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(mc || (mc = {}));
var kt;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(kt || (kt = {}));
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
var Bc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Bc || (Bc = {}));
var $c;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})($c || ($c = {}));
var vc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(vc || (vc = {}));
var _c;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(_c || (_c = {}));
var Hc;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Hc || (Hc = {}));
var Lc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Lc || (Lc = {}));
function Rs(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Db(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function cf(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function kb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Rs(t.outputLen), Rs(t.blockLen);
}
function Tb(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Fb(t, e) {
  cf(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const _e = {
  number: Rs,
  bool: Db,
  bytes: cf,
  hash: kb,
  exists: Tb,
  output: Fb
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ws = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), At = (t, e) => t << 32 - e | t >>> e, Mb = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Mb)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Gb(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Oi(t) {
  if (typeof t == "string" && (t = Gb(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let af = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Te(t) {
  const e = (r) => t().update(Oi(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
class ff extends af {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, _e.hash(e);
    const r = Oi(n);
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
}
const hf = (t, e, n) => new ff(t, e).update(n).digest();
hf.create = (t, e) => new ff(t, e);
function Rb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, o, r), t.setUint32(e + u, c, r);
}
let Ci = class extends af {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ws(this.buffer);
  }
  update(e) {
    _e.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Oi(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const f = ws(e);
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
    Rb(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = ws(e), f = this.outputLen;
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
const Vb = (t, e, n) => t & e ^ ~t & n, Kb = (t, e, n) => t & e ^ t & n ^ e & n, zb = new Uint32Array([
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
let lf = class extends Ci {
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
      const b = At(c, 6) ^ At(c, 11) ^ At(c, 25), d = l + b + Vb(c, f, u) + zb[a] + ne[a] | 0, y = (At(r, 2) ^ At(r, 13) ^ At(r, 22)) + Kb(r, s, i) | 0;
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
}, jb = class extends lf {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const uf = Te(() => new lf());
Te(() => new jb());
function qb(t, e) {
  switch (e = of(e ?? sf), t) {
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
const Wb = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), df = Uint8Array.from({ length: 16 }, (t, e) => e), Xb = df.map((t) => (9 * t + 5) % 16);
let Pi = [df], Ni = [Xb];
for (let t = 0; t < 4; t++)
  for (let e of [Pi, Ni])
    e.push(e[t].map((n) => Wb[n]));
const bf = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Yb = Pi.map((t, e) => t.map((n) => bf[e][n])), Zb = Ni.map((t, e) => t.map((n) => bf[e][n])), Jb = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Qb = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), sr = (t, e) => t << e | t >>> 32 - e;
function Ic(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ir = new Uint32Array(16);
let tp = class extends Ci {
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
      ir[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, f = c, u = this.h3 | 0, l = u, a = this.h4 | 0, b = a;
    for (let d = 0; d < 5; d++) {
      const g = 4 - d, y = Jb[d], B = Qb[d], H = Pi[d], L = Ni[d], x = Yb[d], $ = Zb[d];
      for (let S = 0; S < 16; S++) {
        const P = sr(r + Ic(d, i, c, u) + ir[H[S]] + y, x[S]) + a | 0;
        r = a, a = u, u = sr(c, 10) | 0, c = i, i = P;
      }
      for (let S = 0; S < 16; S++) {
        const P = sr(s + Ic(g, o, f, l) + ir[L[S]] + B, $[S]) + b | 0;
        s = b, b = l, l = sr(f, 10) | 0, f = o, o = P;
      }
    }
    this.set(this.h1 + c + l | 0, this.h2 + u + b | 0, this.h3 + a + s | 0, this.h4 + r + o | 0, this.h0 + i + f | 0);
  }
  roundClean() {
    ir.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const ep = Te(() => new tp()), or = BigInt(2 ** 32 - 1), Vs = BigInt(32);
function pf(t, e = !1) {
  return e ? { h: Number(t & or), l: Number(t >> Vs & or) } : { h: Number(t >> Vs & or) | 0, l: Number(t & or) | 0 };
}
function np(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = pf(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const rp = (t, e) => BigInt(t >>> 0) << Vs | BigInt(e >>> 0), sp = (t, e, n) => t >>> n, ip = (t, e, n) => t << 32 - n | e >>> n, op = (t, e, n) => t >>> n | e << 32 - n, cp = (t, e, n) => t << 32 - n | e >>> n, ap = (t, e, n) => t << 64 - n | e >>> n - 32, fp = (t, e, n) => t >>> n - 32 | e << 64 - n, hp = (t, e) => e, lp = (t, e) => t, up = (t, e, n) => t << n | e >>> 32 - n, dp = (t, e, n) => e << n | t >>> 32 - n, bp = (t, e, n) => e << n - 32 | t >>> 64 - n, pp = (t, e, n) => t << n - 32 | e >>> 64 - n;
function gp(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const xp = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), yp = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, wp = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), mp = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Sp = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Ep = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, M = {
  fromBig: pf,
  split: np,
  toBig: rp,
  shrSH: sp,
  shrSL: ip,
  rotrSH: op,
  rotrSL: cp,
  rotrBH: ap,
  rotrBL: fp,
  rotr32H: hp,
  rotr32L: lp,
  rotlSH: up,
  rotlSL: dp,
  rotlBH: bp,
  rotlBL: pp,
  add: gp,
  add3L: xp,
  add3H: yp,
  add4L: wp,
  add4H: mp,
  add5H: Ep,
  add5L: Sp
}, [Ap, Bp] = M.split([
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
let qr = class extends Ci {
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
      const $ = M.rotrSH(a, b, 14) ^ M.rotrSH(a, b, 18) ^ M.rotrBH(a, b, 41), S = M.rotrSL(a, b, 14) ^ M.rotrSL(a, b, 18) ^ M.rotrBL(a, b, 41), P = a & d ^ ~a & y, k = b & g ^ ~b & B, U = M.add5L(L, S, k, Bp[x], se[x]), O = M.add5H(U, H, $, P, Ap[x], re[x]), p = U | 0, E = M.rotrSH(r, s, 28) ^ M.rotrBH(r, s, 34) ^ M.rotrBH(r, s, 39), I = M.rotrSL(r, s, 28) ^ M.rotrBL(r, s, 34) ^ M.rotrBL(r, s, 39), D = r & i ^ r & c ^ i & c, V = s & o ^ s & f ^ o & f;
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
}, $p = class extends qr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, vp = class extends qr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, _p = class extends qr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Te(() => new qr());
Te(() => new $p());
Te(() => new vp());
Te(() => new _p());
var Ks;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Ks || (Ks = {}));
function Hp(t, e) {
  return { type: Ks.Address, version: t, hash160: e };
}
function Lp(t) {
  return dn.c32address(t.version, t.hash160);
}
const Ip = (t) => ep(uf(t)), Up = (t) => bt(Ip(t));
Y.hmacSha256Sync = (t, ...e) => {
  const n = hf.create(uf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Op(t, e = "mainnet") {
  e = of(e), t = typeof t == "string" ? at(t) : t;
  const n = qb(kt.P2PKH, e), r = Hp(n, Up(t));
  return Lp(r);
}
function Cp(t, e) {
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
  const s = r.issuer.publicKey, i = Op(s);
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
function Pp(t, e = null) {
  let n;
  e ? n = Cp(t, e) : n = st.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const Uc = "_blockstackDidCheckEchoReply", Np = "echoReply", Dp = "authContinuation";
function kp(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function Tp() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[Uc];
  if (typeof e == "boolean")
    return e;
  const n = kp(t.location.search), r = n[Np];
  if (r) {
    t[Uc] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[Dp];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class zs {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new H0();
    else
      throw new r1("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new pc(e.sessionOptions) : this.store = new pc() : e ? this.store = new bc(e.sessionOptions) : this.store = new bc();
  }
  makeAuthRequestToken(e, n, r, s, i, o = i1().getTime(), c = {}) {
    const f = this.appConfig;
    if (!f)
      throw new Ns("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || f.redirectURI(), r = r || f.manifestURI(), s = s || f.scopes, i = i || f.appDomain, Hb(e, n, r, s, i, o, c);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = _b();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = Bi("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (Tp())
        return Ze.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Ze.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = B1()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Jn("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = st.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await Cb(e))
      throw new Jn("Invalid authentication response.");
    let c = i.private_key, f = i.core_token;
    if (bs(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            c = await uc(s, i.private_key);
          } catch {
            if (Ze.warn("Failed decryption of appPrivateKey, will try to use as given"), !Y.isValidPrivateKey(i.private_key))
              throw new Jn("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (f != null)
          try {
            f = await uc(s, f);
          } catch {
            Ze.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Jn("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = w1, l;
    bs(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (u = i.hubUrl), bs(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (l = i.associationToken);
    const a = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: nf(i.iss),
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
        a.profile = Object.assign({}, t1);
      else {
        const g = await d.text(), y = JSON.parse(g);
        a.profile = Pp(y[0].token);
      }
    } else
      a.profile = i.profile;
    return r.userData = a, this.store.setSessionData(r), a;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new Ns("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), X2(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Y2(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
zs.prototype.makeAuthRequest = zs.prototype.makeAuthRequestToken;
const Fp = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), gf = "STX_PROVIDER", xf = () => typeof window > "u" ? null : window.localStorage.getItem(gf), Mp = (t) => {
  typeof window < "u" && window.localStorage.setItem(gf, t);
}, Gp = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Rp(t, e) {
  const n = {};
  return Object.assign(n, Gp, e), await fetch(t, n);
}
function Vp(t) {
  let e = Rp, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Kp(...t) {
  const { fetchLib: e, middlewares: n } = Vp(t);
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
var fn;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(fn || (fn = {}));
var Ce;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ce || (Ce = {}));
var Oc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Oc || (Oc = {}));
const zp = "https://api.mainnet.hiro.so", jp = "https://api.testnet.hiro.so", qp = "http://localhost:3999", Wp = ["mainnet", "testnet", "devnet", "mocknet"];
class Pe {
  constructor(e) {
    this.version = Ce.Mainnet, this.chainId = fn.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ce.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Kp();
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
Pe.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new js();
    case "testnet":
      return new qs();
    case "devnet":
      return new Xp();
    case "mocknet":
      return new yf();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Wp.join(", ")}`);
  }
};
Pe.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Pe.fromName(t);
class js extends Pe {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? zp,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ce.Mainnet, this.chainId = fn.Mainnet;
  }
}
class qs extends Pe {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? jp,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ce.Testnet, this.chainId = fn.Testnet;
  }
}
class yf extends Pe {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? qp,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ce.Testnet, this.chainId = fn.Testnet;
  }
}
const Xp = yf;
var Ws;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Ws || (Ws = {}));
var Cc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Cc || (Cc = {}));
Ws.Mainnet;
var Ir;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ir || (Ir = {}));
var Pc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Pc || (Pc = {}));
Ir.Mainnet;
const Yp = 128, Zp = 128, wf = 16;
var Nc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Nc || (Nc = {}));
var Dc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Dc || (Dc = {}));
var yt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(yt || (yt = {}));
const ms = ["onChainOnly", "offChainOnly", "any"];
ms[0] + "", yt.OnChainOnly, ms[1] + "", yt.OffChainOnly, ms[2] + "", yt.Any, yt.OnChainOnly + "", yt.OnChainOnly, yt.OffChainOnly + "", yt.OffChainOnly, yt.Any + "", yt.Any;
var kc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(kc || (kc = {}));
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
var Gc;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Gc || (Gc = {}));
var Rc;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Rc || (Rc = {}));
var Vc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Vc || (Vc = {}));
var Kc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Kc || (Kc = {}));
var zc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(zc || (zc = {}));
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
var Xc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Xc || (Xc = {}));
let Jp = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Qp = class extends Jp {
  constructor(e) {
    super(e);
  }
};
function Xs(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function tg(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function mf(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function eg(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Xs(t.outputLen), Xs(t.blockLen);
}
function ng(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function rg(t, e) {
  mf(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ss = {
  number: Xs,
  bool: tg,
  bytes: mf,
  hash: eg,
  exists: ng,
  output: rg
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Es = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Bt = (t, e) => t << 32 - e | t >>> e, sg = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!sg)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ig(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Sf(t) {
  if (typeof t == "string" && (t = ig(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let og = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Fe(t) {
  const e = (r) => t().update(Sf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function cg(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, o, r), t.setUint32(e + u, c, r);
}
let Di = class extends og {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Es(this.buffer);
  }
  update(e) {
    Ss.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Sf(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const f = Es(e);
        for (; s <= i - o; o += s)
          this.process(f, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ss.exists(this), Ss.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let a = o; a < s; a++)
      n[a] = 0;
    cg(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = Es(e), f = this.outputLen;
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
const ag = (t, e, n) => t & e ^ ~t & n, fg = (t, e, n) => t & e ^ t & n ^ e & n, hg = new Uint32Array([
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
let Ef = class extends Di {
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
      const b = Bt(c, 6) ^ Bt(c, 11) ^ Bt(c, 25), d = l + b + ag(c, f, u) + hg[a] + oe[a] | 0, y = (Bt(r, 2) ^ Bt(r, 13) ^ Bt(r, 22)) + fg(r, s, i) | 0;
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
}, lg = class extends Ef {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Fe(() => new Ef());
Fe(() => new lg());
const ug = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Af = Uint8Array.from({ length: 16 }, (t, e) => e), dg = Af.map((t) => (9 * t + 5) % 16);
let ki = [Af], Ti = [dg];
for (let t = 0; t < 4; t++)
  for (let e of [ki, Ti])
    e.push(e[t].map((n) => ug[n]));
const Bf = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), bg = ki.map((t, e) => t.map((n) => Bf[e][n])), pg = Ti.map((t, e) => t.map((n) => Bf[e][n])), gg = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), xg = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), cr = (t, e) => t << e | t >>> 32 - e;
function Yc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ar = new Uint32Array(16);
let yg = class extends Di {
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
      ar[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, f = c, u = this.h3 | 0, l = u, a = this.h4 | 0, b = a;
    for (let d = 0; d < 5; d++) {
      const g = 4 - d, y = gg[d], B = xg[d], H = ki[d], L = Ti[d], x = bg[d], $ = pg[d];
      for (let S = 0; S < 16; S++) {
        const P = cr(r + Yc(d, i, c, u) + ar[H[S]] + y, x[S]) + a | 0;
        r = a, a = u, u = cr(c, 10) | 0, c = i, i = P;
      }
      for (let S = 0; S < 16; S++) {
        const P = cr(s + Yc(g, o, f, l) + ar[L[S]] + B, $[S]) + b | 0;
        s = b, b = l, l = cr(f, 10) | 0, f = o, o = P;
      }
    }
    this.set(this.h1 + c + l | 0, this.h2 + u + b | 0, this.h3 + a + s | 0, this.h4 + r + o | 0, this.h0 + i + f | 0);
  }
  roundClean() {
    ar.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Fe(() => new yg());
const fr = BigInt(2 ** 32 - 1), Ys = BigInt(32);
function $f(t, e = !1) {
  return e ? { h: Number(t & fr), l: Number(t >> Ys & fr) } : { h: Number(t >> Ys & fr) | 0, l: Number(t & fr) | 0 };
}
function wg(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = $f(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const mg = (t, e) => BigInt(t >>> 0) << Ys | BigInt(e >>> 0), Sg = (t, e, n) => t >>> n, Eg = (t, e, n) => t << 32 - n | e >>> n, Ag = (t, e, n) => t >>> n | e << 32 - n, Bg = (t, e, n) => t << 32 - n | e >>> n, $g = (t, e, n) => t << 64 - n | e >>> n - 32, vg = (t, e, n) => t >>> n - 32 | e << 64 - n, _g = (t, e) => e, Hg = (t, e) => t, Lg = (t, e, n) => t << n | e >>> 32 - n, Ig = (t, e, n) => e << n | t >>> 32 - n, Ug = (t, e, n) => e << n - 32 | t >>> 64 - n, Og = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Cg(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Pg = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Ng = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Dg = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), kg = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Tg = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Fg = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, G = {
  fromBig: $f,
  split: wg,
  toBig: mg,
  shrSH: Sg,
  shrSL: Eg,
  rotrSH: Ag,
  rotrSL: Bg,
  rotrBH: $g,
  rotrBL: vg,
  rotr32H: _g,
  rotr32L: Hg,
  rotlSH: Lg,
  rotlSL: Ig,
  rotlBH: Ug,
  rotlBL: Og,
  add: Cg,
  add3L: Pg,
  add3H: Ng,
  add4L: Dg,
  add4H: kg,
  add5H: Fg,
  add5L: Tg
}, [Mg, Gg] = G.split([
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
let Wr = class extends Di {
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
      const $ = G.rotrSH(a, b, 14) ^ G.rotrSH(a, b, 18) ^ G.rotrBH(a, b, 41), S = G.rotrSL(a, b, 14) ^ G.rotrSL(a, b, 18) ^ G.rotrBL(a, b, 41), P = a & d ^ ~a & y, k = b & g ^ ~b & B, U = G.add5L(L, S, k, Gg[x], ae[x]), O = G.add5H(U, H, $, P, Mg[x], ce[x]), p = U | 0, E = G.rotrSH(r, s, 28) ^ G.rotrBH(r, s, 34) ^ G.rotrBH(r, s, 39), I = G.rotrSL(r, s, 28) ^ G.rotrBL(r, s, 34) ^ G.rotrBL(r, s, 39), D = r & i ^ r & c ^ i & c, V = s & o ^ s & f ^ o & f;
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
}, Rg = class extends Wr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Vg = class extends Wr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Kg = class extends Wr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Fe(() => new Wr());
Fe(() => new Rg());
Fe(() => new Vg());
Fe(() => new Kg());
var J;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(J || (J = {}));
var Zs;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Zs || (Zs = {}));
function Fi(t) {
  return Zs[t];
}
var Ur;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Ur || (Ur = {}));
function vf(t, e, n) {
  const s = Yp;
  if (rx(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Ur.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
function _f(t) {
  const e = dn.c32addressDecode(t);
  return {
    type: Ur.Address,
    version: e[0],
    hash160: e[1]
  };
}
function Hf(t) {
  const e = [];
  return e.push(at($i(t.version, 1))), e.push(at(t.hash160)), gn(e);
}
function Lf(t) {
  const e = [], n = Nn(t.content), r = n.byteLength;
  return e.push(at($i(r, t.lengthPrefixBytes))), e.push(n), gn(e);
}
function Ut(t, e) {
  return gn([Fi(t), e]);
}
function zg(t) {
  return new Uint8Array([Fi(t.type)]);
}
function jg(t) {
  return t.type === J.OptionalNone ? new Uint8Array([Fi(t.type)]) : Ut(t.type, kn(t.value));
}
function qg(t) {
  const e = new Uint8Array(4);
  return Mr(e, Math.ceil(t.value.length / 2), 0), Ut(t.type, Gt(e, at(t.value)));
}
function Wg(t) {
  const e = v0(l1(BigInt(t.value), BigInt(Zp)), wf);
  return Ut(t.type, e);
}
function Xg(t) {
  const e = v0(BigInt(t.value), wf);
  return Ut(t.type, e);
}
function Yg(t) {
  return Ut(t.type, Hf(_f(t.value)));
}
function Zg(t) {
  const [e, n] = sx(t.value);
  return Ut(t.type, Gt(Hf(_f(e)), Lf(vf(n))));
}
function Jg(t) {
  return Ut(t.type, kn(t.value));
}
function Qg(t) {
  const e = [], n = new Uint8Array(4);
  Mr(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = kn(r);
    e.push(s);
  }
  return Ut(t.type, gn(e));
}
function tx(t) {
  const e = [], n = new Uint8Array(4);
  Mr(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = vf(s);
    e.push(Lf(i));
    const o = kn(t.value[s]);
    e.push(o);
  }
  return Ut(t.type, gn(e));
}
function If(t, e) {
  const n = [], r = e == "ascii" ? d1(t.value) : Nn(t.value), s = new Uint8Array(4);
  return Mr(s, r.length, 0), n.push(s), n.push(r), Ut(t.type, gn(n));
}
function ex(t) {
  return If(t, "ascii");
}
function nx(t) {
  return If(t, "utf8");
}
function Zc(t) {
  return bt(kn(t));
}
function kn(t) {
  switch (t.type) {
    case J.BoolTrue:
    case J.BoolFalse:
      return zg(t);
    case J.OptionalNone:
    case J.OptionalSome:
      return jg(t);
    case J.Buffer:
      return qg(t);
    case J.UInt:
      return Xg(t);
    case J.Int:
      return Wg(t);
    case J.PrincipalStandard:
      return Yg(t);
    case J.PrincipalContract:
      return Zg(t);
    case J.ResponseOk:
    case J.ResponseErr:
      return Jg(t);
    case J.List:
      return Qg(t);
    case J.Tuple:
      return tx(t);
    case J.StringASCII:
      return ex(t);
    case J.StringUTF8:
      return nx(t);
    default:
      throw new Qp("Unable to serialize. Invalid Clarity Value.");
  }
}
const rx = (t, e) => t ? Nn(t).length > e : !1;
function sx(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
function ix(t, e) {
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
    return BigInt(`0x${ax(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Mi(t, e = 8) {
  return (typeof t == "bigint" ? t : ix(t)).toString(16).padStart(e * 2, "0");
}
function Uf(t, e = 16) {
  const n = Mi(t, e);
  return In(n);
}
function ox(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const cx = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ax(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += cx[n];
  return e;
}
function In(t) {
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
function Gi(t) {
  return new TextEncoder().encode(t);
}
function fx(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function hx(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Jc(t) {
  if (t.some(hx))
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
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function xn(t) {
  return Ri(...t.map((e) => typeof e == "number" ? Jc([e]) : e instanceof Array ? Jc(e) : e));
}
function Xr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Js;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Js || (Js = {}));
Js.Mainnet;
const lx = 128, ux = 128, Of = 16;
var Qs;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Qs || (Qs = {}));
var Qc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Qc || (Qc = {}));
var ta;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(ta || (ta = {}));
var wt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(wt || (wt = {}));
const As = ["onChainOnly", "offChainOnly", "any"];
As[0] + "", wt.OnChainOnly, As[1] + "", wt.OffChainOnly, As[2] + "", wt.Any, wt.OnChainOnly + "", wt.OnChainOnly, wt.OffChainOnly + "", wt.OffChainOnly, wt.Any + "", wt.Any;
var ti;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ti || (ti = {}));
ti.Mainnet;
var ea;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(ea || (ea = {}));
var na;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(na || (na = {}));
var ra;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(ra || (ra = {}));
var sa;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(sa || (sa = {}));
var ia;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ia || (ia = {}));
var oa;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(oa || (oa = {}));
var ca;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(ca || (ca = {}));
var aa;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
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
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(la || (la = {}));
function ei(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function dx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Cf(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function bx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ei(t.outputLen), ei(t.blockLen);
}
function px(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function gx(t, e) {
  Cf(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Bs = {
  number: ei,
  bool: dx,
  bytes: Cf,
  hash: bx,
  exists: px,
  output: gx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const $s = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), $t = (t, e) => t << 32 - e | t >>> e, xx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!xx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function yx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Pf(t) {
  if (typeof t == "string" && (t = yx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class wx {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Me(t) {
  const e = (r) => t().update(Pf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function mx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), c = Number(n & i), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, o, r), t.setUint32(e + u, c, r);
}
class Vi extends wx {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = $s(this.buffer);
  }
  update(e) {
    Bs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Pf(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const c = Math.min(s - this.pos, i - o);
      if (c === s) {
        const f = $s(e);
        for (; s <= i - o; o += s)
          this.process(f, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Bs.exists(this), Bs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let a = o; a < s; a++)
      n[a] = 0;
    mx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = $s(e), f = this.outputLen;
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
const Sx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Nf = Uint8Array.from({ length: 16 }, (t, e) => e), Ex = Nf.map((t) => (9 * t + 5) % 16);
let Ki = [Nf], zi = [Ex];
for (let t = 0; t < 4; t++)
  for (let e of [Ki, zi])
    e.push(e[t].map((n) => Sx[n]));
const Df = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Ax = Ki.map((t, e) => t.map((n) => Df[e][n])), Bx = zi.map((t, e) => t.map((n) => Df[e][n])), $x = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), vx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), hr = (t, e) => t << e | t >>> 32 - e;
function ua(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const lr = new Uint32Array(16);
class _x extends Vi {
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
      lr[d] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, c = this.h2 | 0, f = c, u = this.h3 | 0, l = u, a = this.h4 | 0, b = a;
    for (let d = 0; d < 5; d++) {
      const g = 4 - d, y = $x[d], B = vx[d], H = Ki[d], L = zi[d], x = Ax[d], $ = Bx[d];
      for (let S = 0; S < 16; S++) {
        const P = hr(r + ua(d, i, c, u) + lr[H[S]] + y, x[S]) + a | 0;
        r = a, a = u, u = hr(c, 10) | 0, c = i, i = P;
      }
      for (let S = 0; S < 16; S++) {
        const P = hr(s + ua(g, o, f, l) + lr[L[S]] + B, $[S]) + b | 0;
        s = b, b = l, l = hr(f, 10) | 0, f = o, o = P;
      }
    }
    this.set(this.h1 + c + l | 0, this.h2 + u + b | 0, this.h3 + a + s | 0, this.h4 + r + o | 0, this.h0 + i + f | 0);
  }
  roundClean() {
    lr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
Me(() => new _x());
const Hx = (t, e, n) => t & e ^ ~t & n, Lx = (t, e, n) => t & e ^ t & n ^ e & n, Ix = new Uint32Array([
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
class kf extends Vi {
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
      const b = $t(c, 6) ^ $t(c, 11) ^ $t(c, 25), d = l + b + Hx(c, f, u) + Ix[a] + he[a] | 0, y = ($t(r, 2) ^ $t(r, 13) ^ $t(r, 22)) + Lx(r, s, i) | 0;
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
class Ux extends kf {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
Me(() => new kf());
Me(() => new Ux());
const ur = BigInt(2 ** 32 - 1), ni = BigInt(32);
function Tf(t, e = !1) {
  return e ? { h: Number(t & ur), l: Number(t >> ni & ur) } : { h: Number(t >> ni & ur) | 0, l: Number(t & ur) | 0 };
}
function Ox(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Tf(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Cx = (t, e) => BigInt(t >>> 0) << ni | BigInt(e >>> 0), Px = (t, e, n) => t >>> n, Nx = (t, e, n) => t << 32 - n | e >>> n, Dx = (t, e, n) => t >>> n | e << 32 - n, kx = (t, e, n) => t << 32 - n | e >>> n, Tx = (t, e, n) => t << 64 - n | e >>> n - 32, Fx = (t, e, n) => t >>> n - 32 | e << 64 - n, Mx = (t, e) => e, Gx = (t, e) => t, Rx = (t, e, n) => t << n | e >>> 32 - n, Vx = (t, e, n) => e << n | t >>> 32 - n, Kx = (t, e, n) => e << n - 32 | t >>> 64 - n, zx = (t, e, n) => t << n - 32 | e >>> 64 - n;
function jx(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const qx = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Wx = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Xx = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Yx = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Zx = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Jx = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, R = {
  fromBig: Tf,
  split: Ox,
  toBig: Cx,
  shrSH: Px,
  shrSL: Nx,
  rotrSH: Dx,
  rotrSL: kx,
  rotrBH: Tx,
  rotrBL: Fx,
  rotr32H: Mx,
  rotr32L: Gx,
  rotlSH: Rx,
  rotlSL: Vx,
  rotlBH: Kx,
  rotlBL: zx,
  add: jx,
  add3L: qx,
  add3H: Wx,
  add4L: Xx,
  add4H: Yx,
  add5H: Jx,
  add5L: Zx
}, [Qx, ty] = R.split([
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
class Yr extends Vi {
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
      const $ = R.rotrSH(a, b, 14) ^ R.rotrSH(a, b, 18) ^ R.rotrBH(a, b, 41), S = R.rotrSL(a, b, 14) ^ R.rotrSL(a, b, 18) ^ R.rotrBL(a, b, 41), P = a & d ^ ~a & y, k = b & g ^ ~b & B, U = R.add5L(L, S, k, ty[x], ue[x]), O = R.add5H(U, H, $, P, Qx[x], le[x]), p = U | 0, E = R.rotrSH(r, s, 28) ^ R.rotrBH(r, s, 34) ^ R.rotrBH(r, s, 39), I = R.rotrSL(r, s, 28) ^ R.rotrBL(r, s, 34) ^ R.rotrBL(r, s, 39), D = r & i ^ r & c ^ i & c, V = s & o ^ s & f ^ o & f;
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
class ey extends Yr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class ny extends Yr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class ry extends Yr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Me(() => new Yr());
Me(() => new ey());
Me(() => new ny());
Me(() => new ry());
function sy(t, e, n) {
  const s = lx;
  if (wy(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Qs.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Q;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Q || (Q = {}));
class iy extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class oy extends iy {
  constructor(e) {
    super(e);
  }
}
function Ff(t) {
  const e = [];
  return e.push(In(Mi(t.version, 1))), e.push(In(t.hash160)), xn(e);
}
function Mf(t) {
  const e = [], n = Gi(t.content), r = n.byteLength;
  return e.push(In(Mi(r, t.lengthPrefixBytes))), e.push(n), xn(e);
}
function Ot(t, e) {
  return xn([t, e]);
}
function cy(t) {
  return new Uint8Array([t.type]);
}
function ay(t) {
  return t.type === Q.OptionalNone ? new Uint8Array([t.type]) : Ot(t.type, hn(t.value));
}
function fy(t) {
  const e = new Uint8Array(4);
  return Xr(e, t.buffer.length, 0), Ot(t.type, Ri(e, t.buffer));
}
function hy(t) {
  const e = Uf(ox(t.value, BigInt(ux)), Of);
  return Ot(t.type, e);
}
function ly(t) {
  const e = Uf(t.value, Of);
  return Ot(t.type, e);
}
function uy(t) {
  return Ot(t.type, Ff(t.address));
}
function dy(t) {
  return Ot(t.type, Ri(Ff(t.address), Mf(t.contractName)));
}
function by(t) {
  return Ot(t.type, hn(t.value));
}
function py(t) {
  const e = [], n = new Uint8Array(4);
  Xr(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = hn(r);
    e.push(s);
  }
  return Ot(t.type, xn(e));
}
function gy(t) {
  const e = [], n = new Uint8Array(4);
  Xr(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = sy(s);
    e.push(Mf(i));
    const o = hn(t.data[s]);
    e.push(o);
  }
  return Ot(t.type, xn(e));
}
function Gf(t, e) {
  const n = [], r = e == "ascii" ? fx(t.data) : Gi(t.data), s = new Uint8Array(4);
  return Xr(s, r.length, 0), n.push(s), n.push(r), Ot(t.type, xn(n));
}
function xy(t) {
  return Gf(t, "ascii");
}
function yy(t) {
  return Gf(t, "utf8");
}
function hn(t) {
  switch (t.type) {
    case Q.BoolTrue:
    case Q.BoolFalse:
      return cy(t);
    case Q.OptionalNone:
    case Q.OptionalSome:
      return ay(t);
    case Q.Buffer:
      return fy(t);
    case Q.UInt:
      return ly(t);
    case Q.Int:
      return hy(t);
    case Q.PrincipalStandard:
      return uy(t);
    case Q.PrincipalContract:
      return dy(t);
    case Q.ResponseOk:
    case Q.ResponseErr:
      return by(t);
    case Q.List:
      return py(t);
    case Q.Tuple:
      return gy(t);
    case Q.StringASCII:
      return xy(t);
    case Q.StringUTF8:
      return yy(t);
    default:
      throw new oy("Unable to serialize. Invalid Clarity Value.");
  }
}
const wy = (t, e) => t ? Gi(t).length > e : !1;
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var my = Object.defineProperty, Sy = Object.defineProperties, Ey = Object.getOwnPropertyDescriptors, Or = Object.getOwnPropertySymbols, Rf = Object.prototype.hasOwnProperty, Vf = Object.prototype.propertyIsEnumerable, da = (t, e, n) => e in t ? my(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, ri = (t, e) => {
  for (var n in e || (e = {})) Rf.call(e, n) && da(t, n, e[n]);
  if (Or) for (var n of Or(e)) Vf.call(e, n) && da(t, n, e[n]);
  return t;
}, si = (t, e) => Sy(t, Ey(e)), Ay = (t, e) => {
  var n = {};
  for (var r in t) Rf.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Or) for (var r of Or(t)) e.indexOf(r) < 0 && Vf.call(t, r) && (n[r] = t[r]);
  return n;
};
function By(t) {
  return t ? typeof t == "string" ? Pe.fromName(t) : "version" in t ? t : "url" in t ? new js({ url: t.url }) : t.transactionVersion === Ir.Mainnet ? new js({ url: t.client.baseUrl }) : new qs({ url: t.client.baseUrl }) : new qs();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var $y = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))($y || {}), vy = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(vy || {}), Kf = (t) => {
  let e = t;
  if (!e) {
    let n = new H0(["store_write"], document.location.href);
    e = new zs({ appConfig: n });
  }
  return e;
};
function _y(t) {
  try {
    return Kf(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Hy = (t) => {
  let e = Kf(t).loadUserData().appPrivateKey, n = st.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function zf(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? si(ri({}, t), { message: Zc(e), domain: Zc(n) }) : si(ri({}, t), { message: bt(hn(e)), domain: bt(hn(n)) });
}
async function Ly(t, e) {
  return new st.TokenSigner("ES256k", e).signAsync(zf(t));
}
async function Iy(t) {
  let e = t, { userSession: n } = e, r = Ay(e, ["userSession"]);
  if (_y(n)) {
    let { privateKey: s, publicKey: i } = Hy(n), o = si(ri({}, r), { publicKey: i });
    return Ly(o, s);
  }
  return st.createUnsecuredToken(zf(t));
}
var Uy = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(Uy || {}), jf = "asigna-stx", ba = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === jf && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(Cy(t, e), "*");
}), Oy = { authenticationRequest: async (t) => ba(t, "authenticationRequest"), transactionRequest: async (t) => ba(t, "transactionRequest") }, Cy = (t, e) => ({ source: jf, [e]: t }), Py = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = Oy);
};
Py();
const Ny = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], ji = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Zr = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, $n = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, Dy = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), qf = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => Dy(i, r)) === s
  );
}, ky = (t) => t ? qf(Zr()).some(
  (e) => {
    var n;
    return e.id === t && (ji(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Ty = () => {
  if (typeof window > "u")
    return;
  const t = Zr(), e = qf(t).filter(
    (n) => {
      var r;
      return ji(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = $n(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of Ny) {
    const r = $n(t, n) ?? (t === window ? void 0 : $n(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, Fy = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Zr(), n = $n(e, t) ?? (e === window ? void 0 : $n(window, t)) ?? Fp(t);
  if (n)
    return n;
  if (ji(t) || ky(t))
    return Ty();
}, My = ["blockstack-session", "blockstack"], Gy = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of My) {
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
Gy();
const Ry = () => xf(), Vy = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = xf(), e = t ? Fy(t) : void 0;
  if (e)
    return e;
  const n = Zr() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, pa = (t) => A0(t).replace(/^0x/, ""), ga = "This wallet cannot sign messages. Try Xverse or Leather.", xa = (t) => typeof (t == null ? void 0 : t.request) == "function", ya = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", Ky = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, zy = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function jy(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: pa(e.message),
    domain: pa(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function qy(t, e) {
  const n = await Iy({
    domain: e.domain,
    message: e.message,
    network: By(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Wy(t) {
  var s, i;
  const e = Ry() || "", n = /xverse/i.test(e);
  let r = Vy();
  if (n && !ya(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (ya(r))
    try {
      return await qy(r, t);
    } catch (o) {
      if (n || !xa(r) || !zy(o)) throw o;
    }
  if (!n && xa(r))
    try {
      return await jy(r, t);
    } catch (o) {
      throw Ky(o) ? new Error(ga) : o;
    }
  throw new Error(ga);
}
function Xy(t, e, n = {}) {
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
const Yy = {}, Zy = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, Jy = (t) => {
  const e = Yy;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, Qy = (t) => `/hiro/${t}`, t3 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, e3 = (t) => {
  const e = Jy(t);
  if (e)
    return [t3(e)];
  const n = Zy[t];
  return typeof window < "u" ? [`${window.location.origin}${Qy(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, n3 = {}, wa = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, r3 = "xtrata.log.enabled", s3 = "xtrata.log.level", i3 = "xtrata.log.tags", o3 = "xtrata.log.dedupe", dr = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, c3 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, a3 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, f3 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, h3 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, l3 = () => {
  const t = n3 ?? {}, e = dr(r3) ?? t.VITE_LOG_ENABLED, n = dr(s3) ?? t.VITE_LOG_LEVEL, r = dr(i3) ?? t.VITE_LOG_TAGS, s = dr(o3) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: c3(e),
    level: a3(n) ?? "warn",
    tags: h3(r),
    dedupe: f3(s)
  };
}, u3 = (t, e, n) => !t.enabled || wa[n] < wa[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), d3 = (t, e, n, r) => {
  const s = l3();
  if (!u3(s, e, t) || p3(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, b3 = /* @__PURE__ */ new Set();
let ma = null;
const p3 = (t, e, n, r, s) => (ma !== t && (b3.clear(), ma = t), !1), g3 = (t, e, n) => d3("debug", t, e, n), x3 = {}, y3 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, w3 = (t) => {
  const e = x3, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : y3[t];
}, m3 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, S3 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return m3.test(n) ? n : null;
}, E3 = (t) => t.replace(/\/+$/, ""), A3 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), Sa = (t) => {
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
}, We = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, B3 = (t) => {
  var f, u;
  let e;
  try {
    e = Xe(Zd(t));
  } catch {
    return null;
  }
  const n = We(e);
  if (!n || n.success === !1)
    return null;
  const r = We(n.value), s = We(r == null ? void 0 : r.value), i = We(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = Sa((f = We(i.name)) == null ? void 0 : f.value), c = Sa((u = We(i.namespace)) == null ? void 0 : u.value);
  return !o || !c ? null : S3(`${o}.${c}`);
}, $3 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${E3(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [A0(md(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : B3(i.result);
}, v3 = async (t) => {
  const e = t.address.trim();
  if (!Jd(e))
    return null;
  const n = w3(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of e3(t.network))
    try {
      return await $3({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return g3("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: A3(r)
  }), null;
}, _3 = "ParallaX Casino", H3 = "ParallaX Casino room sign-in. This is free: it sends no transaction, costs no fees and gives no permission to spend anything.";
new TextEncoder();
new TextDecoder();
const L3 = (t) => t === "mainnet" ? 1 : 2147483648, I3 = (t) => `${H3} Account ${t.address}. Valid until ${new Date(t.expires).toISOString().replace(".000Z", "Z")}. Request code ${t.nonce}.`, U3 = (t) => ({
  domain: x0({
    name: xr(_3),
    version: xr("1"),
    "chain-id": g0(L3(t.network))
  }),
  message: xr(I3(t))
}), br = (t) => !!t && typeof t.request == "function", O3 = () => {
  try {
    const t = window.top;
    if (t && t !== window.self && t.location.origin === window.location.origin) return t;
  } catch {
  }
  return window;
}, C3 = () => {
  const t = O3();
  return t === window ? [window] : [t, window];
}, Ea = (t) => {
  for (const e of C3()) {
    const n = t(e);
    if (n) return n;
  }
  return null;
}, P3 = (t) => {
  if (t === "leather") {
    const n = Ea((r) => br(r.LeatherProvider) ? r.LeatherProvider : null);
    return n ? { rpc: n } : null;
  }
  const e = Ea((n) => {
    const r = n.XverseProviders || n.xverseProviders;
    return r && (br(r.BitcoinProvider) || br(r.StacksProvider)) ? r : null;
  });
  return e ? { rpc: br(e.BitcoinProvider) ? e.BitcoinProvider : e.StacksProvider } : null;
}, N3 = (t, e) => new Promise((n) => {
  const r = Date.now();
  (function s() {
    const i = P3(t);
    i || Date.now() - r >= e ? n(i) : window.setTimeout(s, 150);
  })();
}), Cr = (t) => {
  var e;
  return (t == null ? void 0 : t.code) ?? ((e = t == null ? void 0 : t.error) == null ? void 0 : e.code);
}, He = (t) => {
  var e;
  return String((t == null ? void 0 : t.message) ?? ((e = t == null ? void 0 : t.error) == null ? void 0 : e.message) ?? t ?? "unknown error");
}, D3 = (t) => [4001, -31001].includes(Number(Cr(t))) || /cancel|denied|reject|declin|closed/i.test(He(t)), Aa = (t) => Number(Cr(t)) === -32601 || /not supported|method not found|unsupported|not implemented|legacy method/i.test(He(t)), vs = async (t, e, n) => {
  const r = n === void 0 ? await t.request(e) : await t.request(e, n);
  if (r && typeof r == "object") {
    if (r.error) throw Object.assign(new Error(He(r.error)), { code: Cr(r.error) });
    if (r.status === "error") throw Object.assign(new Error(He(r.error || r)), { code: Cr(r.error || r) });
    if ("result" in r) return r.result;
  }
  return r;
}, k3 = (t) => new Promise((e, n) => {
  const r = window.setTimeout(() => n(new Error("The wallet did not answer. Check its window.")), 9e4);
  t.then((s) => {
    window.clearTimeout(r), e(s);
  }, (s) => {
    window.clearTimeout(r), n(s);
  });
}), T3 = (t) => (JSON.stringify(t) || "").match(/S[PT][0-9A-HJKMNP-TV-Z]{38,39}/g) || [], de = [];
async function F3(t) {
  const e = await N3(t, 1500);
  if (!e) throw new Error(`${t === "leather" ? "Leather" : "Xverse"} was not found in this browser.`);
  de.length = 0;
  let n;
  if (t === "xverse") {
    try {
      await vs(e.rpc, "wallet_disconnect"), de.push("wallet_disconnect: ok");
    } catch (s) {
      de.push("wallet_disconnect: " + He(s).slice(0, 80));
    }
    n = ["wallet_connect", "wallet_getAccount"];
  } else
    n = ["getAddresses", "stx_getAccounts", "stx_getAddresses", "stx_requestAccounts"];
  let r = null;
  for (const s of n)
    try {
      const i = await (t === "xverse" ? k3(vs(e.rpc, s)) : vs(e.rpc, s)), o = T3(i);
      if (o.length) {
        const c = o[0];
        return de.push(`${s}: ok`), { kind: t, address: c, network: c.startsWith("SP") ? "mainnet" : "testnet", via: s };
      }
      de.push(`${s}: answered but no Stacks address in it`);
    } catch (i) {
      if (D3(i))
        throw de.push(`${s}: cancelled`), new Error("Connection cancelled.");
      de.push(`${s}: ${Aa(i) ? "not supported" : He(i).slice(0, 80)}`), Aa(i) || (r = i);
    }
  throw new Error(r ? He(r) : "The wallet did not share a Stacks address.");
}
const M3 = (t) => Mp(t === "leather" ? "LeatherProvider" : "XverseProviders.BitcoinProvider"), Wf = (t) => t instanceof Error ? t.message : String(t), m = {
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
}, G3 = (t) => t.length <= 12 ? t : `${t.slice(0, 5)}…${t.slice(-4)}`, R3 = (t) => {
  if (t.startsWith("SP")) return t;
  const e = Ai(t);
  return Ps({ ...e, version: Ls.MainnetSingleSig });
}, V3 = Xy((t) => v3({ address: R3(t), network: "mainnet" }), () => Pr()), Xf = (t) => {
  let e = null;
  try {
    e = V3.get(t);
  } catch {
  }
  return e || G3(t);
}, Pr = () => {
  var n;
  if (!m.host || m.service !== "ok") return;
  const t = ((n = m.you) == null ? void 0 : n.a) ?? null, e = Object.entries(m.spots).filter(([, r]) => r.a !== t).map(([r, s]) => ({ key: s.a, spot: r, label: Xf(s.a), since: s.since }));
  try {
    m.host.setPeople(e);
  } catch (r) {
    console.warn("[room] the page could not draw the people", r);
  }
}, Nr = async (t, e) => {
  const n = await fetch(t, { credentials: "same-origin", ...e });
  let r = null;
  try {
    r = await n.json();
  } catch {
  }
  return { res: n, body: r };
}, Ba = (t) => {
  var e;
  return ((e = m.ws) == null ? void 0 : e.readyState) !== WebSocket.OPEN ? !1 : (m.ws.send(JSON.stringify(t)), m.lastSent = Date.now(), !0);
}, Yf = () => {
  var e;
  if (m.service !== "ok" || !m.connected || !m.you || m.you.guest || !m.signed) return;
  const t = ((e = Object.entries(m.spots).find(([, n]) => n.a === m.you.a)) == null ? void 0 : e[0]) ?? null;
  m.want ? t !== m.want && m.want !== m.badSpot && !m.spots[m.want] && Date.now() - m.lastSent > 1200 && Ba({ t: "sit", spot: m.want }) : t && Date.now() - m.lastSent > 600 && Ba({ t: "stand" });
}, qi = () => {
  if (m.service !== "ok" || m.ws) return;
  m.attempts += 1;
  let t;
  try {
    t = new WebSocket(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/casino/room/ws`);
  } catch {
    return $a();
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
    Pr(), Yf(), ft();
  }, t.onclose = (e) => {
    if (m.ws === t) {
      if (m.ws = null, m.connected = !1, m.spots = {}, Pr(), e.code === 4001) {
        m.replaced = !0, ft();
        return;
      }
      ft(), $a();
    }
  }, t.onerror = () => {
  };
}, $a = () => {
  window.clearTimeout(m.retryTimer);
  const t = Math.min(15e3, 1e3 * 2 ** Math.min(m.attempts, 4));
  m.retryTimer = window.setTimeout(() => {
    m.ws || qi();
  }, t);
}, Wi = () => {
  const t = m.ws;
  m.ws = null, m.connected = !1, m.attempts = 0, m.replaced = !1;
  try {
    t == null || t.close(1e3, "client");
  } catch {
  }
  qi();
};
async function K3(t) {
  const { res: e, body: n } = await Nr(`/casino/room/challenge?address=${encodeURIComponent(t.address)}`);
  if (!e.ok) throw new Error((n == null ? void 0 : n.error) || `The room answered ${e.status}.`);
  const r = n.challenge, { domain: s, message: i } = U3(r);
  m.busy = "sign", ft();
  let o;
  try {
    o = await Wy({ domain: s, message: i, network: r.network, stxAddress: t.address });
  } catch (u) {
    throw new Error("The wallet did not sign: " + Wf(u));
  }
  const { res: c, body: f } = await Nr("/casino/room/session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ challenge: r, signature: o })
  });
  if (!c.ok) throw new Error((f == null ? void 0 : f.error) || `The room answered ${c.status}.`);
  m.signed = { address: f.address, hash160: f.hash160, expiresAt: f.expiresAt }, Wi();
}
async function z3(t) {
  if (!m.busy) {
    m.error = "", m.busy = "connect", ft();
    try {
      m.wallet = await F3(t), M3(t), await K3(m.wallet), m.open = !1;
    } catch (e) {
      m.error = Wf(e);
    } finally {
      m.busy = "", ft();
    }
  }
}
async function j3() {
  try {
    await Nr("/casino/room/session", { method: "DELETE" });
  } catch {
  }
  m.signed = null, m.wallet = null, m.error = "", Wi(), ft();
}
const q3 = `
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
`, tt = (t, e, n) => {
  const r = document.createElement(t);
  return e !== void 0 && (r.textContent = e), n && (r.className = n), r;
};
let be = null, dt = null, _t = null;
function W3() {
  var n, r;
  if (be || m.service !== "ok") return;
  const t = document.createElement("style");
  t.textContent = q3, document.head.append(t), be = tt("span"), be.id = "pxroom", dt = tt("button"), dt.id = "pxroom-btn", dt.type = "button", dt.setAttribute("aria-label", "Casino room: see who is here and join"), dt.onclick = () => {
    m.open = !m.open, ft();
  }, _t = tt("div"), _t.id = "pxroom-panel", _t.hidden = !0, be.append(dt);
  const e = ((r = (n = m.host) == null ? void 0 : n.mount) == null ? void 0 : r.call(n)) ?? document.querySelector("#tools .rt");
  e ? e.insertBefore(be, e.firstChild) : (be.style.cssText = "position:fixed;top:10px;right:10px;z-index:30", document.body.append(be)), document.body.append(_t), document.addEventListener("keydown", (s) => {
    s.key === "Escape" && m.open && (m.open = !1, ft());
  }), document.addEventListener("pointerdown", (s) => {
    if (!m.open) return;
    const i = s.target;
    i && (_t.contains(i) || dt.contains(i)) || (m.open = !1, ft());
  }), window.addEventListener("resize", () => {
    m.open && Zf();
  });
}
function Zf() {
  if (!dt || !_t) return;
  const t = dt.getBoundingClientRect(), e = t.height ? Math.round(t.bottom + 8) : 64;
  _t.style.top = `${Math.min(e, Math.max(64, window.innerHeight - 220))}px`;
}
function ft() {
  if (!be || !dt || !_t) return;
  const t = !!(m.signed && m.you && !m.you.guest);
  dt.className = m.connected ? "live" : "wait";
  const e = m.connected ? ` · ${m.joined}` : "";
  if (dt.replaceChildren(tt("i"), document.createTextNode(t ? `In the room${e}` : `Room${e}`)), _t.hidden = !m.open, !m.open) return;
  Zf();
  const n = [];
  if (m.replaced) {
    n.push(tt("h3", "Room"), tt("p", "Another tab of yours took over the room. You are not connected here."));
    const r = tt("button", "Use this tab instead");
    r.onclick = () => {
      Wi(), ft();
    }, n.push(r);
  } else if (t) {
    n.push(tt("h3", "You are in the room")), n.push(tt("p", "Others see you at your seat as"), tt("p", Xf(m.signed.address), "who")), n.push(tt("p", `${m.joined} signed in, ${m.guests} watching. Sit at a table or a machine and you appear there. Nothing here moves any money.`));
    const r = tt("button", "Leave the room");
    r.onclick = () => {
      j3();
    }, n.push(r);
  } else {
    n.push(tt("h3", "Join the room")), n.push(tt("p", m.connected ? `You are watching: ${m.joined} signed in, ${m.guests} watching. Join to be seen where you sit.` : "Connecting to the room…")), n.push(tt("p", "One free signature. It sends no transaction, costs no fee and gives no permission to spend anything."));
    const r = tt("div", void 0, "row");
    for (const s of ["leather", "xverse"]) {
      const i = tt("button", m.busy ? m.busy === "sign" ? "Check your wallet…" : "Connecting…" : s === "leather" ? "Leather" : "Xverse");
      if (i.disabled = !!m.busy || !m.connected, i.onclick = () => {
        z3(s);
      }, r.append(i), m.busy) break;
    }
    n.push(r), m.error && n.push(tt("p", m.error, "err"));
  }
  _t.replaceChildren(...n);
}
const X3 = () => {
  var e;
  const t = ((e = m.host) == null ? void 0 : e.currentSpot()) ?? null;
  t !== m.want && (m.want = t, Pr()), Yf();
};
async function Y3() {
  try {
    const { res: t, body: e } = await Nr("/casino/room/session");
    if (t.status === 503) return;
    t.ok && (e != null && e.address) && (m.signed = { address: e.address, hash160: e.hash160, expiresAt: e.expiresAt }), m.service = "ok";
  } catch {
    return;
  }
  W3(), ft(), qi(), window.setInterval(X3, 250);
}
const va = (t) => {
  m.host || (m.host = t, Y3());
}, _a = window.PXRoomHost;
_a ? va(_a) : window.addEventListener("px-room-host", () => va(window.PXRoomHost), { once: !0 });
window.__pxRoom = {
  get state() {
    var t;
    return { service: m.service, signed: ((t = m.signed) == null ? void 0 : t.address) ?? null, connected: m.connected, you: m.you, spots: m.spots, joined: m.joined, guests: m.guests, want: m.want, trail: de.slice() };
  }
};
