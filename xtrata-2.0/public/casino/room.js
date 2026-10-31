var Ph = Object.defineProperty;
var Nh = (t, e, n) => e in t ? Ph(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var yn = (t, e, n) => Nh(t, typeof e != "symbol" ? e + "" : e, n);
function Xo(t, e) {
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
      const r = Fh(BigInt(`0x${oe(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${oe(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Yo(t, e = 8) {
  return (typeof t == "bigint" ? t : Xo(t, !1)).toString(16).padStart(e * 2, "0");
}
function ff(t) {
  return parseInt(t, 16);
}
function lf(t, e = 16) {
  const n = Yo(t, e);
  return _n(n);
}
function Dh(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Th(t, e) {
  return t & BigInt(1) << e;
}
function Fh(t, e) {
  return Th(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Mh = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function oe(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Mh[n];
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
function hf(t) {
  return new TextDecoder().decode(t);
}
function uf(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Rh(t) {
  return String.fromCharCode.apply(null, t);
}
function Gh(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Qi(t) {
  if (t.some(Gh))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Jo(...t) {
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
  return Jo(...t.map((e) => typeof e == "number" ? Qi([e]) : e instanceof Array ? Qi(e) : e));
}
function Vh(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Kh(t, e) {
  return t[e];
}
function zh(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function ms(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var bo;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(bo || (bo = {}));
bo.Mainnet;
const jh = 128, qh = 128, df = 16;
var er;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(er || (er = {}));
var ta;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ta || (ta = {}));
var ea;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(ea || (ea = {}));
var Ot;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ot || (Ot = {}));
const Ws = ["onChainOnly", "offChainOnly", "any"];
Ws[0] + "", Ot.OnChainOnly, Ws[1] + "", Ot.OffChainOnly, Ws[2] + "", Ot.Any, Ot.OnChainOnly + "", Ot.OnChainOnly, Ot.OffChainOnly + "", Ot.OffChainOnly, Ot.Any + "", Ot.Any;
var go;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(go || (go = {}));
go.Mainnet;
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
var oa;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(oa || (oa = {}));
var xo;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(xo || (xo = {}));
var ia;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(ia || (ia = {}));
var aa;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(aa || (aa = {}));
var ca;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(ca || (ca = {}));
var fa;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(fa || (fa = {}));
var la;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(la || (la = {}));
var ha;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(ha || (ha = {}));
function wo(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Wh(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function pf(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Xh(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  wo(t.outputLen), wo(t.blockLen);
}
function Yh(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Jh(t, e) {
  pf(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Xs = {
  number: wo,
  bool: Wh,
  bytes: pf,
  hash: Xh,
  exists: Yh,
  output: Jh
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ys = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ft = (t, e) => t << 32 - e | t >>> e, Zh = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Zh)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Qh(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function bf(t) {
  if (typeof t == "string" && (t = Qh(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let tu = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function sn(t) {
  const e = (r) => t().update(bf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function eu(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, i, r), t.setUint32(e + u, a, r);
}
let Zo = class extends tu {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ys(this.buffer);
  }
  update(e) {
    Xs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = bf(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const f = Ys(e);
        for (; s <= o - i; i += s)
          this.process(f, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Xs.exists(this), Xs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let c = i; c < s; c++)
      n[c] = 0;
    eu(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Ys(e), f = this.outputLen;
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
const nu = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), gf = Uint8Array.from({ length: 16 }, (t, e) => e), ru = gf.map((t) => (9 * t + 5) % 16);
let Qo = [gf], ti = [ru];
for (let t = 0; t < 4; t++)
  for (let e of [Qo, ti])
    e.push(e[t].map((n) => nu[n]));
const xf = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), su = Qo.map((t, e) => t.map((n) => xf[e][n])), ou = ti.map((t, e) => t.map((n) => xf[e][n])), iu = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), au = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Hr = (t, e) => t << e | t >>> 32 - e;
function ua(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Lr = new Uint32Array(16);
let cu = class extends Zo {
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
      const w = 4 - d, y = iu[d], v = au[d], L = Qo[d], O = ti[d], x = su[d], $ = ou[d];
      for (let A = 0; A < 16; A++) {
        const P = Hr(r + ua(d, o, a, u) + Lr[L[A]] + y, x[A]) + c | 0;
        r = c, c = u, u = Hr(a, 10) | 0, a = o, o = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = Hr(s + ua(w, i, f, h) + Lr[O[A]] + v, $[A]) + p | 0;
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
sn(() => new cu());
const fu = (t, e, n) => t & e ^ ~t & n, lu = (t, e, n) => t & e ^ t & n ^ e & n, hu = new Uint32Array([
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
let wf = class extends Zo {
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
      const p = le[c - 15], d = le[c - 2], w = Ft(p, 7) ^ Ft(p, 18) ^ p >>> 3, y = Ft(d, 17) ^ Ft(d, 19) ^ d >>> 10;
      le[c] = y + le[c - 7] + w + le[c - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: f, G: u, H: h } = this;
    for (let c = 0; c < 64; c++) {
      const p = Ft(a, 6) ^ Ft(a, 11) ^ Ft(a, 25), d = h + p + fu(a, f, u) + hu[c] + le[c] | 0, y = (Ft(r, 2) ^ Ft(r, 13) ^ Ft(r, 22)) + lu(r, s, o) | 0;
      h = u, u = f, f = a, a = i + d | 0, i = o, o = s, s = r, r = d + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, f, u, h);
  }
  roundClean() {
    le.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, uu = class extends wf {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
sn(() => new wf());
sn(() => new uu());
const Ir = BigInt(2 ** 32 - 1), yo = BigInt(32);
function yf(t, e = !1) {
  return e ? { h: Number(t & Ir), l: Number(t >> yo & Ir) } : { h: Number(t >> yo & Ir) | 0, l: Number(t & Ir) | 0 };
}
function du(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = yf(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const pu = (t, e) => BigInt(t >>> 0) << yo | BigInt(e >>> 0), bu = (t, e, n) => t >>> n, gu = (t, e, n) => t << 32 - n | e >>> n, xu = (t, e, n) => t >>> n | e << 32 - n, wu = (t, e, n) => t << 32 - n | e >>> n, yu = (t, e, n) => t << 64 - n | e >>> n - 32, mu = (t, e, n) => t >>> n - 32 | e << 64 - n, Su = (t, e) => e, Eu = (t, e) => t, Au = (t, e, n) => t << n | e >>> 32 - n, vu = (t, e, n) => e << n | t >>> 32 - n, Bu = (t, e, n) => e << n - 32 | t >>> 64 - n, $u = (t, e, n) => t << n - 32 | e >>> 64 - n;
function _u(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Hu = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Lu = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Iu = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Uu = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Ou = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Cu = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, R = {
  fromBig: yf,
  split: du,
  toBig: pu,
  shrSH: bu,
  shrSL: gu,
  rotrSH: xu,
  rotrSL: wu,
  rotrBH: yu,
  rotrBL: mu,
  rotr32H: Su,
  rotr32L: Eu,
  rotlSH: Au,
  rotlSL: vu,
  rotlBH: Bu,
  rotlBL: $u,
  add: _u,
  add3L: Hu,
  add3H: Lu,
  add4L: Iu,
  add4H: Uu,
  add5H: Cu,
  add5L: Ou
}, [ku, Pu] = R.split([
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
let Ss = class extends Zo {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: f, Eh: u, El: h, Fh: c, Fl: p, Gh: d, Gl: w, Hh: y, Hl: v } = this;
    return [e, n, r, s, o, i, a, f, u, h, c, p, d, w, y, v];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, f, u, h, c, p, d, w, y, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = f | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = c | 0, this.Fl = p | 0, this.Gh = d | 0, this.Gl = w | 0, this.Hh = y | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      he[x] = e.getUint32(n), ue[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const $ = he[x - 15] | 0, A = ue[x - 15] | 0, P = R.rotrSH($, A, 1) ^ R.rotrSH($, A, 8) ^ R.shrSH($, A, 7), T = R.rotrSL($, A, 1) ^ R.rotrSL($, A, 8) ^ R.shrSL($, A, 7), C = he[x - 2] | 0, I = ue[x - 2] | 0, b = R.rotrSH(C, I, 19) ^ R.rotrBH(C, I, 61) ^ R.shrSH(C, I, 6), E = R.rotrSL(C, I, 19) ^ R.rotrBL(C, I, 61) ^ R.shrSL(C, I, 6), H = R.add4L(T, E, ue[x - 7], ue[x - 16]), k = R.add4H(H, P, b, he[x - 7], he[x - 16]);
      he[x] = k | 0, ue[x] = H | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: f, Dh: u, Dl: h, Eh: c, El: p, Fh: d, Fl: w, Gh: y, Gl: v, Hh: L, Hl: O } = this;
    for (let x = 0; x < 80; x++) {
      const $ = R.rotrSH(c, p, 14) ^ R.rotrSH(c, p, 18) ^ R.rotrBH(c, p, 41), A = R.rotrSL(c, p, 14) ^ R.rotrSL(c, p, 18) ^ R.rotrBL(c, p, 41), P = c & d ^ ~c & y, T = p & w ^ ~p & v, C = R.add5L(O, A, T, Pu[x], ue[x]), I = R.add5H(C, L, $, P, ku[x], he[x]), b = C | 0, E = R.rotrSH(r, s, 28) ^ R.rotrBH(r, s, 34) ^ R.rotrBH(r, s, 39), H = R.rotrSL(r, s, 28) ^ R.rotrBL(r, s, 34) ^ R.rotrBL(r, s, 39), k = r & o ^ r & a ^ o & a, M = s & i ^ s & f ^ i & f;
      L = y | 0, O = v | 0, y = d | 0, v = w | 0, d = c | 0, w = p | 0, { h: c, l: p } = R.add(u | 0, h | 0, I | 0, b | 0), u = a | 0, h = f | 0, a = o | 0, f = i | 0, o = r | 0, i = s | 0;
      const N = R.add3L(b, H, M);
      r = R.add3H(N, I, E, k), s = N | 0;
    }
    ({ h: r, l: s } = R.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = R.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: f } = R.add(this.Ch | 0, this.Cl | 0, a | 0, f | 0), { h: u, l: h } = R.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: c, l: p } = R.add(this.Eh | 0, this.El | 0, c | 0, p | 0), { h: d, l: w } = R.add(this.Fh | 0, this.Fl | 0, d | 0, w | 0), { h: y, l: v } = R.add(this.Gh | 0, this.Gl | 0, y | 0, v | 0), { h: L, l: O } = R.add(this.Hh | 0, this.Hl | 0, L | 0, O | 0), this.set(r, s, o, i, a, f, u, h, c, p, d, w, y, v, L, O);
  }
  roundClean() {
    he.fill(0), ue.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Nu = class extends Ss {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Du = class extends Ss {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Tu = class extends Ss {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
sn(() => new Ss());
sn(() => new Nu());
sn(() => new Du());
sn(() => new Tu());
const Fu = {}, mf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Fu
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Y = BigInt(0), st = BigInt(1), De = BigInt(2), Jn = BigInt(3), da = BigInt(8), nt = Object.freeze({
  a: Y,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: st,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), pa = (t, e) => (t + e / De) / e, Ur = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = nt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -st * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), o = n, i = BigInt("0x100000000000000000000000000000000"), a = pa(o * t, e), f = pa(-r * t, e);
    let u = U(t - a * n - f * s, e), h = U(-a * r - f * o, e);
    const c = u > i, p = h > i;
    if (c && (u = e - u), p && (h = e - h), u > i || h > i)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: c, k1: u, k2neg: p, k2: h };
  }
}, Nt = 32, Ze = 32, Sf = 32, ss = Nt + 1, os = 2 * Nt + 1;
function ba(t) {
  const { a: e, b: n } = nt, r = U(t * t), s = U(r * t);
  return U(s + e * t + n);
}
const Or = nt.a === Y;
class ei extends Error {
  constructor(e) {
    super(e);
  }
}
function ga(t) {
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
    const n = Ku(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return Q.toAffineBatch(e).map(Q.fromAffine);
  }
  equals(e) {
    ga(e);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = e, f = U(s * s), u = U(a * a), h = U(n * u), c = U(o * f), p = U(U(r * a) * u), d = U(U(i * s) * f);
    return h === c && p === d;
  }
  negate() {
    return new Q(this.x, U(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = U(e * e), o = U(n * n), i = U(o * o), a = e + o, f = U(De * (U(a * a) - s - i)), u = U(Jn * s), h = U(u * u), c = U(h - De * f), p = U(u * (f - c) - da * i), d = U(De * n * r);
    return new Q(c, p, d);
  }
  add(e) {
    ga(e);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = e;
    if (o === Y || i === Y)
      return this;
    if (n === Y || r === Y)
      return e;
    const f = U(s * s), u = U(a * a), h = U(n * u), c = U(o * f), p = U(U(r * a) * u), d = U(U(i * s) * f), w = U(c - h), y = U(d - p);
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
    let r = ya(e);
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
    let s = n && mo.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = Q.normalizeZ(s), mo.set(n, s)));
    let o = Q.ZERO, i = Q.BASE;
    const a = 1 + (Or ? 128 / r : 256 / r), f = 2 ** (r - 1), u = BigInt(2 ** r - 1), h = 2 ** r, c = BigInt(r);
    for (let p = 0; p < a; p++) {
      const d = p * f;
      let w = Number(e & u);
      e >>= c, w > f && (w -= h, e += st);
      const y = d, v = d + Math.abs(w) - 1, L = p % 2 !== 0, O = w < 0;
      w === 0 ? i = i.add(Cr(L, s[y])) : o = o.add(Cr(O, s[v]));
    }
    return { p: o, f: i };
  }
  multiply(e, n) {
    let r = ya(e), s, o;
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
    e == null && (e = o ? da : Fn(s));
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
const mo = /* @__PURE__ */ new WeakMap();
class Z {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, mo.delete(this);
  }
  hasEvenY() {
    return this.y % De === Y;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = _t(n ? e : e.subarray(1));
    if (!Qr(r))
      throw new Error("Point is not on curve");
    const s = ba(r);
    let o = Vu(s);
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
    if (r === ss && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === os && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${ss} compressed bytes or ${os} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Z.BASE.multiply(Qe(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: o } = vf(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const i = ni(Wt(e)), { n: a } = nt, f = r === 2 || r === 3 ? s + a : s, u = Fn(f, a), h = U(-i * u, a), c = U(o * u, a), p = r & 1 ? "03" : "02", d = Z.fromHex(p + Te(f)), w = Z.BASE.multiplyAndAddUnsafe(d, h, c);
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
    if (!Qr(n) || !Qr(r))
      throw new Error(e);
    const s = U(r * r), o = ba(n);
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
function xa(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function wa(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Hn(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: _t(n), left: t.subarray(e + 2) };
}
function Mu(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Hn(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = wa(t.subarray(2)), { data: r, left: s } = wa(n);
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
    return new se(is(s.slice(0, 64)), is(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Mu(n ? e : Fe(e));
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
    const e = xa(Xn(this.s)), n = xa(Xn(this.r)), r = e.length / 2, s = n.length / 2, o = Xn(r), i = Xn(s);
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
const Ru = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Hn(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Ru[t[n]];
  return e;
}
const Gu = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Te(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Y <= t && t < Gu))
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
function is(t) {
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
  return is(Hn(t));
}
function Wt(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Fe(t);
}
function ya(t) {
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
function Vu(t) {
  const { P: e } = nt, n = BigInt(6), r = BigInt(11), s = BigInt(22), o = BigInt(23), i = BigInt(44), a = BigInt(88), f = t * t * t % e, u = f * f * t % e, h = Ht(u, Jn) * u % e, c = Ht(h, Jn) * u % e, p = Ht(c, De) * f % e, d = Ht(p, r) * p % e, w = Ht(d, s) * d % e, y = Ht(w, i) * w % e, v = Ht(y, a) * y % e, L = Ht(v, i) * w % e, O = Ht(L, Jn) * u % e, x = Ht(O, o) * d % e, $ = Ht(x, n) * f % e, A = Ht($, De);
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
function Ku(t, e = nt.P) {
  const n = new Array(t.length), r = t.reduce((o, i, a) => i === Y ? o : (n[a] = o, U(o * i, e)), st), s = Fn(r, e);
  return t.reduceRight((o, i, a) => i === Y ? o : (n[a] = U(o * n[a], e), U(o * i, e)), s), n;
}
function zu(t) {
  const e = t.length * 8 - Ze * 8, n = _t(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function ni(t, e = !1) {
  const n = zu(t);
  if (e)
    return n;
  const { n: r } = nt;
  return n >= r ? n - r : n;
}
let $n, Zn;
class Ef {
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
      throw new ei("hmacSha256Sync needs to be set");
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
function Qr(t) {
  return Y < t && t < nt.P;
}
function Af(t, e, n, r = !0) {
  const { n: s } = nt, o = ni(t, !0);
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
    e = is(t);
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
function ri(t) {
  return t instanceof Z ? (t.assertValidity(), t) : Z.fromHex(t);
}
function vf(t) {
  if (t instanceof se)
    return t.assertValidity(), t;
  try {
    return se.fromDER(t);
  } catch {
    return se.fromCompact(t);
  }
}
function si(t, e = !1) {
  return Z.fromPrivateKey(t).toRawBytes(e);
}
function ju(t, e, n, r = !1) {
  return Z.fromSignature(t, e, n).toRawBytes(r);
}
function ma(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === ss || r === os : n ? r === ss * 2 || r === os * 2 : t instanceof Z;
}
function oi(t, e, n = !1) {
  if (ma(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!ma(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = ri(e);
  return r.assertValidity(), r.multiply(Qe(t)).toRawBytes(n);
}
function Bf(t) {
  const e = t.length > Nt ? t.slice(0, Nt) : t;
  return _t(e);
}
function qu(t) {
  const e = Bf(t), n = U(e, nt.n);
  return $f(n < Y ? e : n);
}
function $f(t) {
  return Ln(t);
}
function _f(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Wt(t), s = Qe(e), o = [$f(s), qu(r)];
  if (n != null) {
    n === !0 && (n = at.randomBytes(Nt));
    const f = Wt(n);
    if (f.length !== Nt)
      throw new Error(`sign: Expected ${Nt} bytes of extra data`);
    o.push(f);
  }
  const i = Pe(...o), a = Bf(r);
  return { seed: i, m: a, d: s };
}
function Hf(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: o } = Object.assign({ canonical: !0, der: !0 }, e), i = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return o ? [i, r] : i;
}
async function Wu(t, e, n = {}) {
  const { seed: r, m: s, d: o } = _f(t, e, n.extraEntropy), i = new Ef(Sf, Ze);
  await i.reseed(r);
  let a;
  for (; !(a = Af(await i.generate(), s, o, n.canonical)); )
    await i.reseed();
  return Hf(a, n);
}
function Lf(t, e, n = {}) {
  const { seed: r, m: s, d: o } = _f(t, e, n.extraEntropy), i = new Ef(Sf, Ze);
  i.reseedSync(r);
  let a;
  for (; !(a = Af(i.generateSync(), s, o, n.canonical)); )
    i.reseedSync();
  return Hf(a, n);
}
const Xu = { strict: !0 };
function Yu(t, e, n, r = Xu) {
  let s;
  try {
    s = vf(t), e = Wt(e);
  } catch {
    return !1;
  }
  const { r: o, s: i } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = ni(e);
  let f;
  try {
    f = ri(n);
  } catch {
    return !1;
  }
  const { n: u } = nt, h = Fn(i, u), c = U(a * h, u), p = U(o * h, u), d = Z.BASE.multiplyAndAddUnsafe(f, c, p);
  return d ? U(d.x, u) === o : !1;
}
function as(t) {
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
    if (!Qr(e) || !In(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Te(this.r) + Te(this.s);
  }
  toRawBytes() {
    return Fe(this.toHex());
  }
}
function Ju(t) {
  return Z.fromPrivateKey(t).toRawX();
}
class If {
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
    const { m: e, d: n, px: r, rand: s } = this, o = at.taggedHash, i = this.initNonce(n, await o(ke.aux, s)), { R: a, rx: f, k: u } = this.finalizeNonce(await o(ke.nonce, i, r, e)), h = as(await o(ke.challenge, f, r, e)), c = this.finalizeSig(a, u, h, n);
    return await Cf(c, e, r) || this.error(), c;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, o = at.taggedHashSync, i = this.initNonce(n, o(ke.aux, s)), { R: a, rx: f, k: u } = this.finalizeNonce(o(ke.nonce, i, r, e)), h = as(o(ke.challenge, f, r, e)), c = this.finalizeSig(a, u, h, n);
    return kf(c, e, r) || this.error(), c;
  }
}
async function Zu(t, e, n) {
  return new If(t, e, n).calc();
}
function Qu(t, e, n) {
  return new If(t, e, n).calcSync();
}
function Uf(t, e, n) {
  const r = t instanceof Un, s = r ? t : Un.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Wt(e),
    P: ri(n)
  };
}
function Of(t, e, n, r) {
  const s = Z.BASE.multiplyAndAddUnsafe(e, Qe(n), U(-r, nt.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Cf(t, e, n) {
  try {
    const { r, s, m: o, P: i } = Uf(t, e, n), a = as(await at.taggedHash(ke.challenge, Ln(r), i.toRawX(), o));
    return Of(r, i, s, a);
  } catch {
    return !1;
  }
}
function kf(t, e, n) {
  try {
    const { r, s, m: o, P: i } = Uf(t, e, n), a = as(at.taggedHashSync(ke.challenge, Ln(r), i.toRawX(), o));
    return Of(r, i, s, a);
  } catch (r) {
    if (r instanceof ei)
      throw r;
    return !1;
  }
}
const td = {
  Signature: Un,
  getPublicKey: Ju,
  sign: Zu,
  verify: Cf,
  signSync: Qu,
  verifySync: kf
};
Z.BASE._setWindowSize(8);
const vt = {
  node: mf,
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
      throw new ei("sha256Sync is undefined, you need to set it");
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
const ed = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: nt,
  Point: Z,
  Signature: se,
  getPublicKey: si,
  getSharedSecret: oi,
  recoverPublicKey: ju,
  schnorr: td,
  sign: Wu,
  signSync: Lf,
  utils: at,
  verify: Yu
}, Symbol.toStringTag, { value: "Module" }));
var yt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function nd(t) {
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
var Mn = {}, ii = {};
const mn = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Pf(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function So(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Re(t, ...e) {
  if (!Pf(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function Nf(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  So(t.outputLen), So(t.blockLen);
}
function nr(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Df(t, e) {
  Re(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function rd(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function sd(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function rr(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function ts(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Ut(t, e) {
  return t << 32 - e | t >>> e;
}
function od(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const ai = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function ci(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const Tf = ai ? (t) => t : (t) => ci(t), id = Tf;
function Ff(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = ci(t[e]);
  return t;
}
const ad = ai ? (t) => t : Ff, Mf = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", cd = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function fd(t) {
  if (Re(t), Mf)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += cd[t[n]];
  return e;
}
const ee = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Sa(t) {
  if (t >= ee._0 && t <= ee._9)
    return t - ee._0;
  if (t >= ee.A && t <= ee.F)
    return t - (ee.A - 10);
  if (t >= ee.a && t <= ee.f)
    return t - (ee.a - 10);
}
function ld(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (Mf)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, o = 0; s < n; s++, o += 2) {
    const i = Sa(t.charCodeAt(o)), a = Sa(t.charCodeAt(o + 1));
    if (i === void 0 || a === void 0) {
      const f = t[o] + t[o + 1];
      throw new Error('hex string expected, got non-hex character "' + f + '" at index ' + o);
    }
    r[s] = i * 16 + a;
  }
  return r;
}
const Rf = async () => {
};
async function hd(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const o = Date.now() - r;
    o >= 0 && o < e || (await Rf(), r += o);
  }
}
function fi(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function ud(t) {
  return new TextDecoder().decode(t);
}
function Rn(t) {
  return typeof t == "string" && (t = fi(t)), Re(t), t;
}
function dd(t) {
  return typeof t == "string" && (t = fi(t)), Re(t), t;
}
function pd(...t) {
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
function bd(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let li = class {
};
function Es(t) {
  const e = (r) => t().update(Rn(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Gf(t) {
  const e = (r, s) => t(s).update(Rn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function Vf(t) {
  const e = (r, s) => t(s).update(Rn(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const gd = Es, xd = Gf, wd = Vf;
function yd(t = 32) {
  if (mn && typeof mn.getRandomValues == "function")
    return mn.getRandomValues(new Uint8Array(t));
  if (mn && typeof mn.randomBytes == "function")
    return Uint8Array.from(mn.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const md = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: li,
  abytes: Re,
  aexists: nr,
  ahash: Nf,
  anumber: So,
  aoutput: Df,
  asyncLoop: hd,
  byteSwap: ci,
  byteSwap32: Ff,
  byteSwapIfBE: id,
  bytesToHex: fd,
  bytesToUtf8: ud,
  checkOpts: bd,
  clean: rr,
  concatBytes: pd,
  createHasher: Es,
  createOptHasher: Gf,
  createView: ts,
  createXOFer: Vf,
  hexToBytes: ld,
  isBytes: Pf,
  isLE: ai,
  kdfInputToBytes: dd,
  nextTick: Rf,
  randomBytes: yd,
  rotl: od,
  rotr: Ut,
  swap32IfBE: ad,
  swap8IfBE: Tf,
  toBytes: Rn,
  u32: sd,
  u8: rd,
  utf8ToBytes: fi,
  wrapConstructor: gd,
  wrapConstructorWithOpts: xd,
  wrapXOFConstructorWithOpts: wd
}, Symbol.toStringTag, { value: "Module" })), fr = /* @__PURE__ */ cr(md);
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
        const w = n.indexOf(i[d]) >> u;
        let y = 0;
        d !== 0 && (y = n.indexOf(i[d - 1]));
        const v = 1 + u, L = y % (1 << v) << 5 - v, O = t.c32[w + L];
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
      for (let w = 0; w < d; w++)
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
})(ii);
var tn = {};
function Sd(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, i, r), t.setUint32(e + u, a, r);
}
function Ed(t, e, n) {
  return t & e ^ ~t & n;
}
function Ad(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class vd extends li {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = ts(this.buffer);
  }
  update(e) {
    nr(this), e = Rn(e), Re(e);
    const { view: n, buffer: r, blockLen: s } = this, o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const f = ts(e);
        for (; s <= o - i; i += s)
          this.process(f, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    nr(this), Df(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, rr(this.buffer.subarray(i)), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let c = i; c < s; c++)
      n[c] = 0;
    Sd(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = ts(e), f = this.outputLen;
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
]), Bd = /* @__PURE__ */ Uint32Array.from([
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
let hi = class extends vd {
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
      const p = be[c - 15], d = be[c - 2], w = Ut(p, 7) ^ Ut(p, 18) ^ p >>> 3, y = Ut(d, 17) ^ Ut(d, 19) ^ d >>> 10;
      be[c] = y + be[c - 7] + w + be[c - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: f, G: u, H: h } = this;
    for (let c = 0; c < 64; c++) {
      const p = Ut(a, 6) ^ Ut(a, 11) ^ Ut(a, 25), d = h + p + Ed(a, f, u) + Bd[c] + be[c] | 0, y = (Ut(r, 2) ^ Ut(r, 13) ^ Ut(r, 22)) + Ad(r, s, o) | 0;
      h = u, u = f, f = a, a = i + d | 0, i = o, o = s, s = r, r = d + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, f, u, h);
  }
  roundClean() {
    rr(be);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), rr(this.buffer);
  }
}, Kf = class extends hi {
  constructor() {
    super(28), this.A = pe[0] | 0, this.B = pe[1] | 0, this.C = pe[2] | 0, this.D = pe[3] | 0, this.E = pe[4] | 0, this.F = pe[5] | 0, this.G = pe[6] | 0, this.H = pe[7] | 0;
  }
};
const $d = /* @__PURE__ */ Es(() => new hi()), _d = /* @__PURE__ */ Es(() => new Kf()), Hd = hi, Ld = $d, Id = Kf, Ud = _d, Od = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: Id,
  SHA256: Hd,
  sha224: Ud,
  sha256: Ld
}, Symbol.toStringTag, { value: "Module" })), As = /* @__PURE__ */ cr(Od);
Object.defineProperty(tn, "__esModule", { value: !0 });
tn.c32checkDecode = tn.c32checkEncode = void 0;
const Ea = As, Aa = fr, Qn = ii;
function zf(t) {
  const e = (0, Ea.sha256)((0, Ea.sha256)((0, Aa.hexToBytes)(t)));
  return (0, Aa.bytesToHex)(e.slice(0, 4));
}
function Cd(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = zf(`${n}${e}`), s = (0, Qn.c32encode)(`${e}${r}`);
  return `${Qn.c32[t]}${s}`;
}
tn.c32checkEncode = Cd;
function kd(t) {
  t = (0, Qn.c32normalize)(t);
  const e = (0, Qn.c32decode)(t.slice(1)), n = t[0], r = Qn.c32.indexOf(n), s = e.slice(-8);
  let o = r.toString(16);
  if (o.length === 1 && (o = `0${o}`), zf(`${o}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
tn.c32checkDecode = kd;
var jf = {}, On = {};
function Pd(t) {
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
    for (var L = (d.length - w) * f + 1 >>> 0, O = new Uint8Array(L); d[w]; ) {
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
var qf = Pd;
Object.defineProperty(On, "__esModule", { value: !0 });
On.decode = On.encode = void 0;
const cs = As, va = fr, Wf = qf, Xf = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function Nd(t, e = "00") {
  const n = typeof t == "string" ? (0, va.hexToBytes)(t) : t, r = typeof e == "string" ? (0, va.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, cs.sha256)((0, cs.sha256)(new Uint8Array([...r, ...n])));
  return Wf(Xf).encode([...r, ...n, ...s.slice(0, 4)]);
}
On.encode = Nd;
function Dd(t) {
  const e = Wf(Xf).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, cs.sha256)((0, cs.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((o, i) => {
    if (o !== s[i])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
On.decode = Dd;
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
    const p = n.decode(h), d = (0, r.bytesToHex)(p.data), w = parseInt((0, r.bytesToHex)(p.prefix), 16);
    let y;
    return c < 0 ? (y = w, s[w] !== void 0 && (y = s[w])) : y = c, i(y, d);
  }
  t.b58ToC32 = f;
  function u(h, c = -1) {
    const p = a(h), d = p[0], w = p[1];
    let y;
    c < 0 ? (y = d, o[d] !== void 0 && (y = o[d])) : y = c;
    let v = y.toString(16);
    return v.length === 1 && (v = `0${v}`), n.encode(w, v);
  }
  t.c32ToB58 = u;
})(jf);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = ii;
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
  const r = jf;
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
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, o = "[object Arguments]", i = "[object Array]", a = "[object Boolean]", f = "[object Date]", u = "[object Error]", h = "[object Function]", c = "[object GeneratorFunction]", p = "[object Map]", d = "[object Number]", w = "[object Object]", y = "[object Promise]", v = "[object RegExp]", L = "[object Set]", O = "[object String]", x = "[object Symbol]", $ = "[object WeakMap]", A = "[object ArrayBuffer]", P = "[object DataView]", T = "[object Float32Array]", C = "[object Float64Array]", I = "[object Int8Array]", b = "[object Int16Array]", E = "[object Int32Array]", H = "[object Uint8Array]", k = "[object Uint8ClampedArray]", M = "[object Uint16Array]", N = "[object Uint32Array]", et = /[\\^$.*+?()[\]{}|]/g, ce = /\w*$/, Zt = /^\[object .+?Constructor\]$/, rt = /^(?:0|[1-9]\d*)$/, j = {};
  j[o] = j[i] = j[A] = j[P] = j[a] = j[f] = j[T] = j[C] = j[I] = j[b] = j[E] = j[p] = j[d] = j[w] = j[v] = j[L] = j[O] = j[x] = j[H] = j[k] = j[M] = j[N] = !0, j[u] = j[h] = j[$] = !1;
  var zn = typeof yt == "object" && yt && yt.Object === Object && yt, hn = typeof self == "object" && self && self.Object === Object && self, it = zn || hn || Function("return this")(), At = e && !e.nodeType && e, pr = At && !0 && t && !t.nodeType && t, Ds = pr && pr.exports === At;
  function un(l, m) {
    return l.set(m[0], m[1]), l;
  }
  function Ts(l, m) {
    return l.add(m), l;
  }
  function Fs(l, m) {
    for (var B = -1, D = l ? l.length : 0; ++B < D && m(l[B], B, l) !== !1; )
      ;
    return l;
  }
  function br(l, m) {
    for (var B = -1, D = m.length, ht = l.length; ++B < D; )
      l[ht + B] = m[B];
    return l;
  }
  function gr(l, m, B, D) {
    for (var ht = -1, St = l ? l.length : 0; ++ht < St; )
      B = m(B, l[ht], ht, l);
    return B;
  }
  function xr(l, m) {
    for (var B = -1, D = Array(l); ++B < l; )
      D[B] = m(B);
    return D;
  }
  function wr(l, m) {
    return l == null ? void 0 : l[m];
  }
  function yr(l) {
    var m = !1;
    if (l != null && typeof l.toString != "function")
      try {
        m = !!(l + "");
      } catch {
      }
    return m;
  }
  function mr(l) {
    var m = -1, B = Array(l.size);
    return l.forEach(function(D, ht) {
      B[++m] = [ht, D];
    }), B;
  }
  function tt(l, m) {
    return function(B) {
      return l(m(B));
    };
  }
  function dn(l) {
    var m = -1, B = Array(l.size);
    return l.forEach(function(D) {
      B[++m] = D;
    }), B;
  }
  var dt = Array.prototype, Sr = Function.prototype, Ge = Object.prototype, pn = it["__core-js_shared__"], Er = function() {
    var l = /[^.]+$/.exec(pn && pn.keys && pn.keys.IE_PROTO || "");
    return l ? "Symbol(src)_1." + l : "";
  }(), Ve = Sr.toString, Dt = Ge.hasOwnProperty, Ke = Ge.toString, Ms = RegExp(
    "^" + Ve.call(Dt).replace(et, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), jn = Ds ? it.Buffer : void 0, qn = it.Symbol, Wn = it.Uint8Array, Rs = tt(Object.getPrototypeOf, Object), Ar = Object.create, Gs = Ge.propertyIsEnumerable, S = dt.splice, F = Object.getOwnPropertySymbols, J = jn ? jn.isBuffer : void 0, X = tt(Object.keys, Object), lt = xn(it, "DataView"), ut = xn(it, "Map"), pt = xn(it, "Promise"), bt = xn(it, "Set"), Tt = xn(it, "WeakMap"), gt = xn(Object, "create"), Fi = qe(lt), k0 = qe(ut), P0 = qe(pt), N0 = qe(bt), D0 = qe(Tt), Mi = qn ? qn.prototype : void 0, Ri = Mi ? Mi.valueOf : void 0;
  function ze(l) {
    var m = -1, B = l ? l.length : 0;
    for (this.clear(); ++m < B; ) {
      var D = l[m];
      this.set(D[0], D[1]);
    }
  }
  function T0() {
    this.__data__ = gt ? gt(null) : {};
  }
  function F0(l) {
    return this.has(l) && delete this.__data__[l];
  }
  function M0(l) {
    var m = this.__data__;
    if (gt) {
      var B = m[l];
      return B === r ? void 0 : B;
    }
    return Dt.call(m, l) ? m[l] : void 0;
  }
  function R0(l) {
    var m = this.__data__;
    return gt ? m[l] !== void 0 : Dt.call(m, l);
  }
  function G0(l, m) {
    var B = this.__data__;
    return B[l] = gt && m === void 0 ? r : m, this;
  }
  ze.prototype.clear = T0, ze.prototype.delete = F0, ze.prototype.get = M0, ze.prototype.has = R0, ze.prototype.set = G0;
  function Qt(l) {
    var m = -1, B = l ? l.length : 0;
    for (this.clear(); ++m < B; ) {
      var D = l[m];
      this.set(D[0], D[1]);
    }
  }
  function V0() {
    this.__data__ = [];
  }
  function K0(l) {
    var m = this.__data__, B = vr(m, l);
    if (B < 0)
      return !1;
    var D = m.length - 1;
    return B == D ? m.pop() : S.call(m, B, 1), !0;
  }
  function z0(l) {
    var m = this.__data__, B = vr(m, l);
    return B < 0 ? void 0 : m[B][1];
  }
  function j0(l) {
    return vr(this.__data__, l) > -1;
  }
  function q0(l, m) {
    var B = this.__data__, D = vr(B, l);
    return D < 0 ? B.push([l, m]) : B[D][1] = m, this;
  }
  Qt.prototype.clear = V0, Qt.prototype.delete = K0, Qt.prototype.get = z0, Qt.prototype.has = j0, Qt.prototype.set = q0;
  function bn(l) {
    var m = -1, B = l ? l.length : 0;
    for (this.clear(); ++m < B; ) {
      var D = l[m];
      this.set(D[0], D[1]);
    }
  }
  function W0() {
    this.__data__ = {
      hash: new ze(),
      map: new (ut || Qt)(),
      string: new ze()
    };
  }
  function X0(l) {
    return Br(this, l).delete(l);
  }
  function Y0(l) {
    return Br(this, l).get(l);
  }
  function J0(l) {
    return Br(this, l).has(l);
  }
  function Z0(l, m) {
    return Br(this, l).set(l, m), this;
  }
  bn.prototype.clear = W0, bn.prototype.delete = X0, bn.prototype.get = Y0, bn.prototype.has = J0, bn.prototype.set = Z0;
  function gn(l) {
    this.__data__ = new Qt(l);
  }
  function Q0() {
    this.__data__ = new Qt();
  }
  function th(l) {
    return this.__data__.delete(l);
  }
  function eh(l) {
    return this.__data__.get(l);
  }
  function nh(l) {
    return this.__data__.has(l);
  }
  function rh(l, m) {
    var B = this.__data__;
    if (B instanceof Qt) {
      var D = B.__data__;
      if (!ut || D.length < n - 1)
        return D.push([l, m]), this;
      B = this.__data__ = new bn(D);
    }
    return B.set(l, m), this;
  }
  gn.prototype.clear = Q0, gn.prototype.delete = th, gn.prototype.get = eh, gn.prototype.has = nh, gn.prototype.set = rh;
  function sh(l, m) {
    var B = zs(l) || Hh(l) ? xr(l.length, String) : [], D = B.length, ht = !!D;
    for (var St in l)
      Dt.call(l, St) && !(ht && (St == "length" || vh(St, D))) && B.push(St);
    return B;
  }
  function Gi(l, m, B) {
    var D = l[m];
    (!(Dt.call(l, m) && ji(D, B)) || B === void 0 && !(m in l)) && (l[m] = B);
  }
  function vr(l, m) {
    for (var B = l.length; B--; )
      if (ji(l[B][0], m))
        return B;
    return -1;
  }
  function oh(l, m) {
    return l && Vi(m, js(m), l);
  }
  function Vs(l, m, B, D, ht, St, te) {
    var Et;
    if (D && (Et = St ? D(l, ht, St, te) : D(l)), Et !== void 0)
      return Et;
    if (!$r(l))
      return l;
    var Xi = zs(l);
    if (Xi) {
      if (Et = Sh(l), !m)
        return wh(l, Et);
    } else {
      var wn = je(l), Yi = wn == h || wn == c;
      if (Ih(l))
        return hh(l, m);
      if (wn == w || wn == o || Yi && !St) {
        if (yr(l))
          return St ? l : {};
        if (Et = Eh(Yi ? {} : l), !m)
          return yh(l, oh(Et, l));
      } else {
        if (!j[wn])
          return St ? l : {};
        Et = Ah(l, wn, Vs, m);
      }
    }
    te || (te = new gn());
    var Ji = te.get(l);
    if (Ji)
      return Ji;
    if (te.set(l, Et), !Xi)
      var Zi = B ? mh(l) : js(l);
    return Fs(Zi || l, function(qs, _r) {
      Zi && (_r = qs, qs = l[_r]), Gi(Et, _r, Vs(qs, m, B, D, _r, l, te));
    }), Et;
  }
  function ih(l) {
    return $r(l) ? Ar(l) : {};
  }
  function ah(l, m, B) {
    var D = m(l);
    return zs(l) ? D : br(D, B(l));
  }
  function ch(l) {
    return Ke.call(l);
  }
  function fh(l) {
    if (!$r(l) || $h(l))
      return !1;
    var m = Wi(l) || yr(l) ? Ms : Zt;
    return m.test(qe(l));
  }
  function lh(l) {
    if (!zi(l))
      return X(l);
    var m = [];
    for (var B in Object(l))
      Dt.call(l, B) && B != "constructor" && m.push(B);
    return m;
  }
  function hh(l, m) {
    if (m)
      return l.slice();
    var B = new l.constructor(l.length);
    return l.copy(B), B;
  }
  function Ks(l) {
    var m = new l.constructor(l.byteLength);
    return new Wn(m).set(new Wn(l)), m;
  }
  function uh(l, m) {
    var B = m ? Ks(l.buffer) : l.buffer;
    return new l.constructor(B, l.byteOffset, l.byteLength);
  }
  function dh(l, m, B) {
    var D = m ? B(mr(l), !0) : mr(l);
    return gr(D, un, new l.constructor());
  }
  function ph(l) {
    var m = new l.constructor(l.source, ce.exec(l));
    return m.lastIndex = l.lastIndex, m;
  }
  function bh(l, m, B) {
    var D = m ? B(dn(l), !0) : dn(l);
    return gr(D, Ts, new l.constructor());
  }
  function gh(l) {
    return Ri ? Object(Ri.call(l)) : {};
  }
  function xh(l, m) {
    var B = m ? Ks(l.buffer) : l.buffer;
    return new l.constructor(B, l.byteOffset, l.length);
  }
  function wh(l, m) {
    var B = -1, D = l.length;
    for (m || (m = Array(D)); ++B < D; )
      m[B] = l[B];
    return m;
  }
  function Vi(l, m, B, D) {
    B || (B = {});
    for (var ht = -1, St = m.length; ++ht < St; ) {
      var te = m[ht], Et = void 0;
      Gi(B, te, Et === void 0 ? l[te] : Et);
    }
    return B;
  }
  function yh(l, m) {
    return Vi(l, Ki(l), m);
  }
  function mh(l) {
    return ah(l, js, Ki);
  }
  function Br(l, m) {
    var B = l.__data__;
    return Bh(m) ? B[typeof m == "string" ? "string" : "hash"] : B.map;
  }
  function xn(l, m) {
    var B = wr(l, m);
    return fh(B) ? B : void 0;
  }
  var Ki = F ? tt(F, Object) : Ch, je = ch;
  (lt && je(new lt(new ArrayBuffer(1))) != P || ut && je(new ut()) != p || pt && je(pt.resolve()) != y || bt && je(new bt()) != L || Tt && je(new Tt()) != $) && (je = function(l) {
    var m = Ke.call(l), B = m == w ? l.constructor : void 0, D = B ? qe(B) : void 0;
    if (D)
      switch (D) {
        case Fi:
          return P;
        case k0:
          return p;
        case P0:
          return y;
        case N0:
          return L;
        case D0:
          return $;
      }
    return m;
  });
  function Sh(l) {
    var m = l.length, B = l.constructor(m);
    return m && typeof l[0] == "string" && Dt.call(l, "index") && (B.index = l.index, B.input = l.input), B;
  }
  function Eh(l) {
    return typeof l.constructor == "function" && !zi(l) ? ih(Rs(l)) : {};
  }
  function Ah(l, m, B, D) {
    var ht = l.constructor;
    switch (m) {
      case A:
        return Ks(l);
      case a:
      case f:
        return new ht(+l);
      case P:
        return uh(l, D);
      case T:
      case C:
      case I:
      case b:
      case E:
      case H:
      case k:
      case M:
      case N:
        return xh(l, D);
      case p:
        return dh(l, D, B);
      case d:
      case O:
        return new ht(l);
      case v:
        return ph(l);
      case L:
        return bh(l, D, B);
      case x:
        return gh(l);
    }
  }
  function vh(l, m) {
    return m = m ?? s, !!m && (typeof l == "number" || rt.test(l)) && l > -1 && l % 1 == 0 && l < m;
  }
  function Bh(l) {
    var m = typeof l;
    return m == "string" || m == "number" || m == "symbol" || m == "boolean" ? l !== "__proto__" : l === null;
  }
  function $h(l) {
    return !!Er && Er in l;
  }
  function zi(l) {
    var m = l && l.constructor, B = typeof m == "function" && m.prototype || Ge;
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
  function _h(l) {
    return Vs(l, !0, !0);
  }
  function ji(l, m) {
    return l === m || l !== l && m !== m;
  }
  function Hh(l) {
    return Lh(l) && Dt.call(l, "callee") && (!Gs.call(l, "callee") || Ke.call(l) == o);
  }
  var zs = Array.isArray;
  function qi(l) {
    return l != null && Uh(l.length) && !Wi(l);
  }
  function Lh(l) {
    return Oh(l) && qi(l);
  }
  var Ih = J || kh;
  function Wi(l) {
    var m = $r(l) ? Ke.call(l) : "";
    return m == h || m == c;
  }
  function Uh(l) {
    return typeof l == "number" && l > -1 && l % 1 == 0 && l <= s;
  }
  function $r(l) {
    var m = typeof l;
    return !!l && (m == "object" || m == "function");
  }
  function Oh(l) {
    return !!l && typeof l == "object";
  }
  function js(l) {
    return qi(l) ? sh(l) : lh(l);
  }
  function Ch() {
    return [];
  }
  function kh() {
    return !1;
  }
  t.exports = _h;
})(fs, fs.exports);
fs.exports;
function Eo(t) {
  return Mn.c32address(t.version, t.hash160);
}
function ui(t, e, n) {
  const r = e || 1, s = n || jh;
  if (pp(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: er.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function di(t) {
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
function Td(t) {
  if (t.type === _.PrincipalStandard)
    return Eo(t.address);
  if (t.type === _.PrincipalContract)
    return `${Eo(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function Fd(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Gd(e, n);
  } else
    return Md(t);
}
function Md(t) {
  const e = di(t);
  return { type: _.PrincipalStandard, address: e };
}
function Rd(t) {
  return { type: _.PrincipalStandard, address: t };
}
function Gd(t, e) {
  const n = di(t), r = ui(e);
  return Yf(n, r);
}
function Yf(t, e) {
  if (ar(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: _.PrincipalContract, address: t, contractName: e };
}
function Js(t, e = !1) {
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
      return Td(t);
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
      return { type: Ne(t), value: Js(t, !0), success: !1 };
    case _.ResponseOk:
      return { type: Ne(t), value: Js(t, !0), success: !0 };
    default:
      return { type: Ne(t), value: Js(t, !0) };
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
      return `(string-ascii ${uf(t.data).length})`;
    case _.StringUTF8:
      return `(string-utf8 ${ar(t.data).length})`;
  }
}
const Vd = () => ({ type: _.BoolTrue }), Kd = () => ({ type: _.BoolFalse }), Ba = BigInt("0xffffffffffffffffffffffffffffffff"), zd = BigInt(0), $a = BigInt("0x7fffffffffffffffffffffffffffffff"), _a = BigInt("-170141183460469231731687303715884105728"), jd = (t) => {
  const e = Xo(t, !0);
  if (e > $a)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${$a}`);
  if (e < _a)
    throw new RangeError(`Cannot construct clarity integer form value less than ${_a}`);
  return { type: _.Int, value: e };
}, Jf = (t) => {
  const e = Xo(t, !1);
  if (e < zd)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Ba)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Ba}`);
  return { type: _.UInt, value: e };
}, qd = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: _.Buffer, buffer: t };
};
function Wd() {
  return { type: _.OptionalNone };
}
function Xd(t) {
  return { type: _.OptionalSome, value: t };
}
function Yd(t) {
  return { type: _.ResponseErr, value: t };
}
function Jd(t) {
  return { type: _.ResponseOk, value: t };
}
function Zd(t) {
  return { type: _.List, list: t };
}
function Zf(t) {
  for (const e in t)
    if (!bp(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: _.Tuple, data: t };
}
const es = (t) => ({ type: _.StringASCII, data: t }), Qd = (t) => ({ type: _.StringUTF8, data: t });
let Qf = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, tp = class extends Qf {
  constructor(e) {
    super(e);
  }
};
class Zs extends Qf {
  constructor(e) {
    super(e);
  }
}
function tl(t) {
  const e = [];
  return e.push(_n(Yo(t.version, 1))), e.push(_n(t.hash160)), Tn(e);
}
function Ha(t) {
  const e = ff(oe(t.readBytes(1))), n = oe(t.readBytes(20));
  return { type: er.Address, version: e, hash160: n };
}
function el(t) {
  const e = [], n = ar(t.content), r = n.byteLength;
  return e.push(_n(Yo(r, t.lengthPrefixBytes))), e.push(n), Tn(e);
}
function La(t, e, n) {
  e = e || 1;
  const r = ff(oe(t.readBytes(e))), s = hf(t.readBytes(r));
  return ui(s, e, 128);
}
function Xt(t, e) {
  return Tn([t, e]);
}
function ep(t) {
  return new Uint8Array([t.type]);
}
function np(t) {
  return t.type === _.OptionalNone ? new Uint8Array([t.type]) : Xt(t.type, lr(t.value));
}
function rp(t) {
  const e = new Uint8Array(4);
  return ms(e, t.buffer.length, 0), Xt(t.type, Jo(e, t.buffer));
}
function sp(t) {
  const e = lf(Dh(t.value, BigInt(qh)), df);
  return Xt(t.type, e);
}
function op(t) {
  const e = lf(t.value, df);
  return Xt(t.type, e);
}
function ip(t) {
  return Xt(t.type, tl(t.address));
}
function ap(t) {
  return Xt(t.type, Jo(tl(t.address), el(t.contractName)));
}
function cp(t) {
  return Xt(t.type, lr(t.value));
}
function fp(t) {
  const e = [], n = new Uint8Array(4);
  ms(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = lr(r);
    e.push(s);
  }
  return Xt(t.type, Tn(e));
}
function lp(t) {
  const e = [], n = new Uint8Array(4);
  ms(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = ui(s);
    e.push(el(o));
    const i = lr(t.data[s]);
    e.push(i);
  }
  return Xt(t.type, Tn(e));
}
function nl(t, e) {
  const n = [], r = e == "ascii" ? uf(t.data) : ar(t.data), s = new Uint8Array(4);
  return ms(s, r.length, 0), n.push(s), n.push(r), Xt(t.type, Tn(n));
}
function hp(t) {
  return nl(t, "ascii");
}
function up(t) {
  return nl(t, "utf8");
}
function lr(t) {
  switch (t.type) {
    case _.BoolTrue:
    case _.BoolFalse:
      return ep(t);
    case _.OptionalNone:
    case _.OptionalSome:
      return np(t);
    case _.Buffer:
      return rp(t);
    case _.UInt:
      return op(t);
    case _.Int:
      return sp(t);
    case _.PrincipalStandard:
      return ip(t);
    case _.PrincipalContract:
      return ap(t);
    case _.ResponseOk:
    case _.ResponseErr:
      return cp(t);
    case _.List:
      return fp(t);
    case _.Tuple:
      return lp(t);
    case _.StringASCII:
      return hp(t);
    case _.StringUTF8:
      return up(t);
    default:
      throw new tp("Unable to serialize. Invalid Clarity Value.");
  }
}
function dp(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Ia = /* @__PURE__ */ new Map();
function rl(t, e) {
  const n = Ia.get(t);
  if (n !== void 0)
    return n(e);
  const r = dp(t);
  return Ia.set(t, r), rl(t, e);
}
class Ua {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return zh(this.readBytes(4), 0);
  }
  readUInt8() {
    return Kh(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Vh(this.readBytes(2), 0);
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
    if (rl(e, r))
      return r;
    throw n(r);
  }
}
function vn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Ua(_n(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Ua(t) : e = t;
  switch (e.readUInt8Enum(_, (r) => {
    throw new Zs(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case _.Int:
      return jd(e.readBytes(16));
    case _.UInt:
      return Jf(e.readBytes(16));
    case _.Buffer:
      const r = e.readUInt32BE();
      return qd(e.readBytes(r));
    case _.BoolTrue:
      return Vd();
    case _.BoolFalse:
      return Kd();
    case _.PrincipalStandard:
      const s = Ha(e);
      return Rd(s);
    case _.PrincipalContract:
      const o = Ha(e), i = La(e);
      return Yf(o, i);
    case _.ResponseOk:
      return Jd(vn(e));
    case _.ResponseErr:
      return Yd(vn(e));
    case _.OptionalNone:
      return Wd();
    case _.OptionalSome:
      return Xd(vn(e));
    case _.List:
      const a = e.readUInt32BE(), f = [];
      for (let y = 0; y < a; y++)
        f.push(vn(e));
      return Zd(f);
    case _.Tuple:
      const u = e.readUInt32BE(), h = {};
      for (let y = 0; y < u; y++) {
        const v = La(e).content;
        if (v === void 0)
          throw new Zs('"content" is undefined');
        h[v] = vn(e);
      }
      return Zf(h);
    case _.StringASCII:
      const c = e.readUInt32BE(), p = Rh(e.readBytes(c));
      return es(p);
    case _.StringUTF8:
      const d = e.readUInt32BE(), w = hf(e.readBytes(d));
      return Qd(w);
    default:
      throw new Zs("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const pp = (t, e) => t ? ar(t).length > e : !1;
function bp(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function sl(t) {
  const e = lr(t);
  return `0x${oe(e)}`;
}
function gp(t) {
  return vn(t);
}
const xp = (t) => {
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
      function w(b) {
        var E = new FileReader(), H = p(E), k = /charset=([A-Za-z0-9_-]+)/.exec(b.type), M = k ? k[1] : "utf-8";
        return E.readAsText(b, M), H;
      }
      function y(b) {
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
      function x(b) {
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
const wp = "https://browser.blockstack.org/auth", yp = {
  "@type": "Person",
  "@context": "http://schema.org"
}, ol = ["store_write"], mp = "blockstack-session", Sp = {
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
class Ep extends Gn {
  constructor(e, n = "") {
    super({ code: on.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Oa extends Gn {
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
class Ca extends Gn {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: on.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Ao extends Gn {
  constructor(e) {
    super({ code: on.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class il extends Gn {
  constructor(e) {
    super({ code: on.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const ka = ["debug", "info", "warn", "error", "none"], vo = {};
for (let t = 0; t < ka.length; t++) {
  const e = ka[t];
  vo[e] = t;
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
    return vo[Sp.logLevel] <= vo[e];
  }
}
function Ap() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function vp() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Qs(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function Bp() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function $p() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function _p(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function pi(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = $p(), s) {
      const o = s[t];
      if (o)
        return o;
    }
  } catch (o) {
    Bn.error(`Error getting object '${t}' from global scope '${s}': ${o}`);
  }
  if (e) {
    const o = _p(s, t.toString(), n);
    throw Bn.error(o), new Error(o);
  }
  if (r)
    return {};
}
function Hp(t) {
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
  if (kp(t, Uint8Array))
    return BigInt(`0x${It(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Lp(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function bi(t, e = 8) {
  return (typeof t == "bigint" ? t : Hp(t)).toString(16).padStart(e * 2, "0");
}
function al(t, e = 16) {
  const n = bi(t, e);
  return $t(n);
}
function Ip(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const Up = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function It(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Up[n];
  return e;
}
function $t(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Lp(t), t = t.length % 2 ? `0${t}` : t;
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
function cl(t) {
  return new TextDecoder().decode(t);
}
function Op(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Cp(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Pa(t) {
  if (t.some(Cp))
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
  return ie(...t.map((e) => typeof e == "number" ? Pa([e]) : e instanceof Array ? Pa(e) : e));
}
function kp(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const Pp = "https://api.mainnet.hiro.so", Np = "https://api.testnet.hiro.so", Dp = "http://localhost:3999", Tp = "https://hub.blockstack.org";
function Fp(t) {
  const e = typeof t == "string" ? $t(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function vs(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const Mp = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Rp(t, e) {
  const n = {};
  return Object.assign(n, Mp, e), await fetch(t, n);
}
function Gp(t) {
  let e = Rp, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Vp(...t) {
  const { fetchLib: e, middlewares: n } = Gp(t);
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
class fl {
  constructor(e = ol.slice(), n = ((a) => (a = pi("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", o = void 0, i = wp) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = o, this.authenticatorURL = i;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Bo(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Kp(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function ll(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function zp(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Bo(t.outputLen), Bo(t.blockLen);
}
function jp(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function qp(t, e) {
  ll(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Xe = {
  number: Bo,
  bool: Kp,
  bytes: ll,
  hash: zp,
  exists: jp,
  output: qp
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const to = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Mt = (t, e) => t << 32 - e | t >>> e, Wp = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Wp)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Xp(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function gi(t) {
  if (typeof t == "string" && (t = Xp(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let hl = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function an(t) {
  const e = (r) => t().update(gi(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let ul = class extends hl {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Xe.hash(e);
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
const Bs = (t, e, n) => new ul(t, e).update(n).digest();
Bs.create = (t, e) => new ul(t, e);
function Yp(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, i, r), t.setUint32(e + u, a, r);
}
let xi = class extends hl {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = to(this.buffer);
  }
  update(e) {
    Xe.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = gi(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const f = to(e);
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
    Yp(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = to(e), f = this.outputLen;
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
const Jp = (t, e, n) => t & e ^ ~t & n, Zp = (t, e, n) => t & e ^ t & n ^ e & n, Qp = new Uint32Array([
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
let dl = class extends xi {
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
      const p = xe[c - 15], d = xe[c - 2], w = Mt(p, 7) ^ Mt(p, 18) ^ p >>> 3, y = Mt(d, 17) ^ Mt(d, 19) ^ d >>> 10;
      xe[c] = y + xe[c - 7] + w + xe[c - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: f, G: u, H: h } = this;
    for (let c = 0; c < 64; c++) {
      const p = Mt(a, 6) ^ Mt(a, 11) ^ Mt(a, 25), d = h + p + Jp(a, f, u) + Qp[c] + xe[c] | 0, y = (Mt(r, 2) ^ Mt(r, 13) ^ Mt(r, 22)) + Zp(r, s, o) | 0;
      h = u, u = f, f = a, a = i + d | 0, i = o, o = s, s = r, r = d + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, f, u, h);
  }
  roundClean() {
    xe.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, t1 = class extends dl {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Cn = an(() => new dl());
an(() => new t1());
var ur = {};
ur.byteLength = o1;
var e1 = ur.toByteArray = a1, n1 = ur.fromByteArray = l1, zt = [], Lt = [], r1 = typeof Uint8Array < "u" ? Uint8Array : Array, eo = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Sn = 0, s1 = eo.length; Sn < s1; ++Sn)
  zt[Sn] = eo[Sn], Lt[eo.charCodeAt(Sn)] = Sn;
Lt[45] = 62;
Lt[95] = 63;
function pl(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function o1(t) {
  var e = pl(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function i1(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function a1(t) {
  var e, n = pl(t), r = n[0], s = n[1], o = new r1(i1(t, r, s)), i = 0, a = s > 0 ? r - 4 : r, f;
  for (f = 0; f < a; f += 4)
    e = Lt[t.charCodeAt(f)] << 18 | Lt[t.charCodeAt(f + 1)] << 12 | Lt[t.charCodeAt(f + 2)] << 6 | Lt[t.charCodeAt(f + 3)], o[i++] = e >> 16 & 255, o[i++] = e >> 8 & 255, o[i++] = e & 255;
  return s === 2 && (e = Lt[t.charCodeAt(f)] << 2 | Lt[t.charCodeAt(f + 1)] >> 4, o[i++] = e & 255), s === 1 && (e = Lt[t.charCodeAt(f)] << 10 | Lt[t.charCodeAt(f + 1)] << 4 | Lt[t.charCodeAt(f + 2)] >> 2, o[i++] = e >> 8 & 255, o[i++] = e & 255), o;
}
function c1(t) {
  return zt[t >> 18 & 63] + zt[t >> 12 & 63] + zt[t >> 6 & 63] + zt[t & 63];
}
function f1(t, e, n) {
  for (var r, s = [], o = e; o < n; o += 3)
    r = (t[o] << 16 & 16711680) + (t[o + 1] << 8 & 65280) + (t[o + 2] & 255), s.push(c1(r));
  return s.join("");
}
function l1(t) {
  for (var e, n = t.length, r = n % 3, s = [], o = 16383, i = 0, a = n - r; i < a; i += o)
    s.push(f1(t, i, i + o > a ? a : i + o));
  return r === 1 ? (e = t[n - 1], s.push(
    zt[e >> 2] + zt[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    zt[e >> 10] + zt[e >> 4 & 63] + zt[e << 2 & 63] + "="
  )), s.join("");
}
function h1() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const u1 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function d1() {
  if (h1())
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
    throw new Error(u1);
  }
}
class p1 {
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
class b1 {
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
async function bl() {
  const t = await d1();
  return t.name === "subtleCrypto" ? new b1(t.lib) : new p1(t.lib.createCipheriv, t.lib.createDecipheriv);
}
const g1 = qf, x1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var w1 = g1(x1);
const y1 = /* @__PURE__ */ nd(w1), m1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), gl = Uint8Array.from({ length: 16 }, (t, e) => e), S1 = gl.map((t) => (9 * t + 5) % 16);
let wi = [gl], yi = [S1];
for (let t = 0; t < 4; t++)
  for (let e of [wi, yi])
    e.push(e[t].map((n) => m1[n]));
const xl = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), E1 = wi.map((t, e) => t.map((n) => xl[e][n])), A1 = yi.map((t, e) => t.map((n) => xl[e][n])), v1 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), B1 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Nr = (t, e) => t << e | t >>> 32 - e;
function Na(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Dr = new Uint32Array(16);
let $1 = class extends xi {
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
      const w = 4 - d, y = v1[d], v = B1[d], L = wi[d], O = yi[d], x = E1[d], $ = A1[d];
      for (let A = 0; A < 16; A++) {
        const P = Nr(r + Na(d, o, a, u) + Dr[L[A]] + y, x[A]) + c | 0;
        r = c, c = u, u = Nr(a, 10) | 0, a = o, o = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = Nr(s + Na(w, i, f, h) + Dr[O[A]] + v, $[A]) + p | 0;
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
const _1 = an(() => new $1());
function H1(t) {
  return _1(t);
}
const Tr = BigInt(2 ** 32 - 1), $o = BigInt(32);
function wl(t, e = !1) {
  return e ? { h: Number(t & Tr), l: Number(t >> $o & Tr) } : { h: Number(t >> $o & Tr) | 0, l: Number(t & Tr) | 0 };
}
function L1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = wl(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const I1 = (t, e) => BigInt(t >>> 0) << $o | BigInt(e >>> 0), U1 = (t, e, n) => t >>> n, O1 = (t, e, n) => t << 32 - n | e >>> n, C1 = (t, e, n) => t >>> n | e << 32 - n, k1 = (t, e, n) => t << 32 - n | e >>> n, P1 = (t, e, n) => t << 64 - n | e >>> n - 32, N1 = (t, e, n) => t >>> n - 32 | e << 64 - n, D1 = (t, e) => e, T1 = (t, e) => t, F1 = (t, e, n) => t << n | e >>> 32 - n, M1 = (t, e, n) => e << n | t >>> 32 - n, R1 = (t, e, n) => e << n - 32 | t >>> 64 - n, G1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function V1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const K1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), z1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, j1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), q1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, W1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), X1 = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, G = {
  fromBig: wl,
  split: L1,
  toBig: I1,
  shrSH: U1,
  shrSL: O1,
  rotrSH: C1,
  rotrSL: k1,
  rotrBH: P1,
  rotrBL: N1,
  rotr32H: D1,
  rotr32L: T1,
  rotlSH: F1,
  rotlSL: M1,
  rotlBH: R1,
  rotlBL: G1,
  add: V1,
  add3L: K1,
  add3H: z1,
  add4L: j1,
  add4H: q1,
  add5H: X1,
  add5L: W1
}, [Y1, J1] = G.split([
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
let $s = class extends xi {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: f, Eh: u, El: h, Fh: c, Fl: p, Gh: d, Gl: w, Hh: y, Hl: v } = this;
    return [e, n, r, s, o, i, a, f, u, h, c, p, d, w, y, v];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, f, u, h, c, p, d, w, y, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = f | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = c | 0, this.Fl = p | 0, this.Gh = d | 0, this.Gl = w | 0, this.Hh = y | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      we[x] = e.getUint32(n), ye[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const $ = we[x - 15] | 0, A = ye[x - 15] | 0, P = G.rotrSH($, A, 1) ^ G.rotrSH($, A, 8) ^ G.shrSH($, A, 7), T = G.rotrSL($, A, 1) ^ G.rotrSL($, A, 8) ^ G.shrSL($, A, 7), C = we[x - 2] | 0, I = ye[x - 2] | 0, b = G.rotrSH(C, I, 19) ^ G.rotrBH(C, I, 61) ^ G.shrSH(C, I, 6), E = G.rotrSL(C, I, 19) ^ G.rotrBL(C, I, 61) ^ G.shrSL(C, I, 6), H = G.add4L(T, E, ye[x - 7], ye[x - 16]), k = G.add4H(H, P, b, we[x - 7], we[x - 16]);
      we[x] = k | 0, ye[x] = H | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: f, Dh: u, Dl: h, Eh: c, El: p, Fh: d, Fl: w, Gh: y, Gl: v, Hh: L, Hl: O } = this;
    for (let x = 0; x < 80; x++) {
      const $ = G.rotrSH(c, p, 14) ^ G.rotrSH(c, p, 18) ^ G.rotrBH(c, p, 41), A = G.rotrSL(c, p, 14) ^ G.rotrSL(c, p, 18) ^ G.rotrBL(c, p, 41), P = c & d ^ ~c & y, T = p & w ^ ~p & v, C = G.add5L(O, A, T, J1[x], ye[x]), I = G.add5H(C, L, $, P, Y1[x], we[x]), b = C | 0, E = G.rotrSH(r, s, 28) ^ G.rotrBH(r, s, 34) ^ G.rotrBH(r, s, 39), H = G.rotrSL(r, s, 28) ^ G.rotrBL(r, s, 34) ^ G.rotrBL(r, s, 39), k = r & o ^ r & a ^ o & a, M = s & i ^ s & f ^ i & f;
      L = y | 0, O = v | 0, y = d | 0, v = w | 0, d = c | 0, w = p | 0, { h: c, l: p } = G.add(u | 0, h | 0, I | 0, b | 0), u = a | 0, h = f | 0, a = o | 0, f = i | 0, o = r | 0, i = s | 0;
      const N = G.add3L(b, H, M);
      r = G.add3H(N, I, E, k), s = N | 0;
    }
    ({ h: r, l: s } = G.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = G.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: f } = G.add(this.Ch | 0, this.Cl | 0, a | 0, f | 0), { h: u, l: h } = G.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: c, l: p } = G.add(this.Eh | 0, this.El | 0, c | 0, p | 0), { h: d, l: w } = G.add(this.Fh | 0, this.Fl | 0, d | 0, w | 0), { h: y, l: v } = G.add(this.Gh | 0, this.Gl | 0, y | 0, v | 0), { h: L, l: O } = G.add(this.Hh | 0, this.Hl | 0, L | 0, O | 0), this.set(r, s, o, i, a, f, u, h, c, p, d, w, y, v, L, O);
  }
  roundClean() {
    we.fill(0), ye.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Z1 = class extends $s {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Q1 = class extends $s {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, t2 = class extends $s {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const e2 = an(() => new $s());
an(() => new Z1());
an(() => new Q1());
an(() => new t2());
function yl(t) {
  return Cn(t);
}
function n2(t) {
  return e2(t);
}
const r2 = 0;
at.hmacSha256Sync = (t, ...e) => {
  const n = Bs.create(Cn, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function s2() {
  return It(at.randomPrivateKey());
}
function o2(t) {
  const e = Cn(Cn(t));
  return y1.encode(ie(t, e).slice(0, t.length + 4));
}
function i2(t, e) {
  return o2(ie(new Uint8Array([t]), e.slice(0, 20)));
}
function ml(t, e = r2) {
  const n = typeof t == "string" ? $t(t) : t, r = H1(yl(n));
  return i2(e, r);
}
function Sl(t) {
  const e = Fp(t);
  return It(si(e.slice(0, 32), !0));
}
at.hmacSha256Sync = (t, ...e) => {
  const n = Bs.create(Cn, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var ls;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(ls || (ls = {}));
async function a2(t, e, n) {
  return await (await bl()).encrypt("aes-256-cbc", e, t, n);
}
async function c2(t, e, n) {
  return await (await bl()).decrypt("aes-256-cbc", e, t, n);
}
function El(t, e) {
  return Bs(Cn, t, e);
}
function f2(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function Al(t) {
  const e = n2(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function l2(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function h2(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: ls.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: ls.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !l2(t))
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
async function u2(t, e, n, r) {
  const s = h2(t);
  if (!s.result)
    throw s;
  const o = at.randomPrivateKey(), i = si(o, !0);
  let a = oi(o, t, !0);
  a = a.slice(1);
  const f = Al(a), u = at.randomBytes(16), h = await a2(u, f.encryptionKey, e), c = ie(u, i, h), p = El(f.hmacKey, c);
  let d;
  if (!r || r === "hex")
    d = It(h);
  else if (r === "base64")
    d = n1(h);
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
async function vl(t, e) {
  if (!e.ephemeralPK)
    throw new Ca("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = oi(t, n, !0);
  r = r.slice(1);
  const s = Al(r), o = $t(e.iv);
  let i;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    i = $t(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    i = e1(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = ie(o, $t(n), i), f = El(s.hmacKey, a), u = $t(e.mac);
  if (!f2(u, f))
    throw new Ca("Decryption failed: failure in MAC check");
  const h = await c2(o, s.encryptionKey, i);
  return e.wasString ? cl(h) : h;
}
function d2(t, e) {
  const n = typeof e == "string" ? hr(e) : e, r = Sl(t), s = yl(n), o = Lf(s, t);
  return {
    signature: It(o),
    publicKey: r
  };
}
async function p2(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = Sl(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", o = typeof t == "string" ? hr(t) : t, i = await u2(n.publicKey, o, s, n.cipherTextEncoding);
  let a = JSON.stringify(i);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const f = d2(r, a), u = {
      signature: f.signature,
      publicKey: f.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function b2(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return vl(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var mt = {}, kn = {}, xt = {};
Object.defineProperty(xt, "__esModule", { value: !0 });
xt.decode = xt.encode = xt.unescape = xt.escape = xt.pad = void 0;
const Bl = ur;
function mi(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
xt.pad = mi;
function $l(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
xt.escape = $l;
function _l(t) {
  return mi(t).replace(/-/g, "+").replace(/_/g, "/");
}
xt.unescape = _l;
function g2(t) {
  return $l((0, Bl.fromByteArray)(new TextEncoder().encode(t)));
}
xt.encode = g2;
function x2(t) {
  return new TextDecoder().decode((0, Bl.toByteArray)(mi(_l(t))));
}
xt.decode = x2;
var _s = {}, Hs = {};
let Si = class extends li {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Nf(e);
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
const Hl = (t, e, n) => new Si(t, e).update(n).digest();
Hl.create = (t, e) => new Si(t, e);
const w2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HMAC: Si,
  hmac: Hl
}, Symbol.toStringTag, { value: "Module" })), y2 = /* @__PURE__ */ cr(w2), m2 = /* @__PURE__ */ cr(ed);
var Pn = {};
Object.defineProperty(Pn, "__esModule", { value: !0 });
Pn.joseToDer = Pn.derToJose = void 0;
const Ll = ur, Il = xt;
function no(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const S2 = {
  ES256: no(256),
  ES384: no(384),
  ES512: no(521)
};
function Ul(t) {
  const e = S2[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const hs = 128, Ol = 0, E2 = 32, A2 = 16, v2 = 2, Cl = A2 | E2 | Ol << 6, us = v2 | Ol << 6;
function kl(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, Ll.toByteArray)((0, Il.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function B2(t, e) {
  const n = kl(t), r = Ul(e), s = r + 1, o = n.length;
  let i = 0;
  if (n[i++] !== Cl)
    throw new Error('Could not find expected "seq"');
  let a = n[i++];
  if (a === (hs | 1) && (a = n[i++]), o - i < a)
    throw new Error(`"seq" specified length of "${a}", only "${o - i}" remaining`);
  if (n[i++] !== us)
    throw new Error('Could not find expected "int" for "r"');
  const f = n[i++];
  if (o - i - 2 < f)
    throw new Error(`"r" specified length of "${f}", only "${o - i - 2}" available`);
  if (s < f)
    throw new Error(`"r" specified length of "${f}", max of "${s}" is acceptable`);
  const u = i;
  if (i += f, n[i++] !== us)
    throw new Error('Could not find expected "int" for "s"');
  const h = n[i++];
  if (o - i !== h)
    throw new Error(`"s" specified length of "${h}", expected "${o - i}"`);
  if (s < h)
    throw new Error(`"s" specified length of "${h}", max of "${s}" is acceptable`);
  const c = i;
  if (i += h, i !== o)
    throw new Error(`Expected to consume entire array, but "${o - i}" bytes remain`);
  const p = r - f, d = r - h, w = new Uint8Array(p + f + d + h);
  for (i = 0; i < p; ++i)
    w[i] = 0;
  w.set(n.subarray(u + Math.max(-p, 0), u + f), i), i = r;
  for (const y = i; i < y + d; ++i)
    w[i] = 0;
  return w.set(n.subarray(c + Math.max(-d, 0), c + h), i), (0, Il.escape)((0, Ll.fromByteArray)(w));
}
Pn.derToJose = B2;
function Da(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= hs && --r, r;
}
function $2(t, e) {
  t = kl(t);
  const n = Ul(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Da(t, 0, n), o = Da(t, n, t.length), i = n - s, a = n - o, f = 2 + i + 1 + 1 + a, u = f < hs, h = new Uint8Array((u ? 2 : 3) + f);
  let c = 0;
  return h[c++] = Cl, u ? h[c++] = f : (h[c++] = hs | 1, h[c++] = f & 255), h[c++] = us, h[c++] = i, s < 0 ? (h[c++] = 0, h.set(t.subarray(0, n), c), c += n) : (h.set(t.subarray(s, n), c), c += n - s), h[c++] = us, h[c++] = a, o < 0 ? (h[c++] = 0, h.set(t.subarray(n), c)) : h.set(t.subarray(n + o), c), h;
}
Pn.joseToDer = $2;
var ae = {};
Object.defineProperty(ae, "__esModule", { value: !0 });
ae.InvalidTokenError = ae.MissingParametersError = void 0;
class _2 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
ae.MissingParametersError = _2;
class H2 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
ae.InvalidTokenError = H2;
Object.defineProperty(Hs, "__esModule", { value: !0 });
Hs.SECP256K1Client = void 0;
const L2 = y2, I2 = As, ns = m2, Ta = Pn, Fa = ae, Ma = fr;
ns.utils.hmacSha256Sync = (t, ...e) => {
  const n = L2.hmac.create(I2.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class Pl {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Ma.bytesToHex)(ns.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Fa.MissingParametersError("a signing input hash and private key are all required");
    const s = ns.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Ma.bytesToHex)(s);
    if (r === "jose")
      return (0, Ta.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Ta.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Fa.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return ns.verify(n, e, r, { strict: !1 });
  }
}
Hs.SECP256K1Client = Pl;
Pl.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Hs;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(_s);
var en = {};
const U2 = /* @__PURE__ */ cr(mf);
var O2 = yt && yt.__awaiter || function(t, e, n, r) {
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
const C2 = As;
function Nl(t) {
  return (0, C2.sha256)(t);
}
en.hashSha256 = Nl;
function k2(t) {
  return O2(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = U2;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Nl(t));
    }
  });
}
en.hashSha256Async = k2;
var P2 = yt && yt.__awaiter || function(t, e, n, r) {
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
const _o = xt, Ra = _s, N2 = ae, Ga = en;
function Ho(t, e) {
  const n = [], r = _o.encode(JSON.stringify(e));
  n.push(r);
  const s = _o.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function D2(t) {
  return Ho(t, { typ: "JWT", alg: "none" }) + ".";
}
kn.createUnsecuredToken = D2;
class T2 {
  constructor(e, n) {
    if (!(e && n))
      throw new N2.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Ra.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Ra.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), o = Ho(e, s), i = (0, Ga.hashSha256)(o);
    return this.createWithSignedHash(e, n, s, o, i);
  }
  signAsync(e, n = !1, r = {}) {
    return P2(this, void 0, void 0, function* () {
      const s = this.header(r), o = Ho(e, s), i = yield (0, Ga.hashSha256Async)(o);
      return this.createWithSignedHash(e, n, s, o, i);
    });
  }
  createWithSignedHash(e, n, r, s, o) {
    const i = this.cryptoClient.signHash(o, this.rawPrivateKey);
    return n ? {
      header: [_o.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [i]
    } : [s, i].join(".");
  }
}
kn.TokenSigner = T2;
var Ls = {};
Object.defineProperty(Ls, "__esModule", { value: !0 });
Ls.TokenVerifier = void 0;
const F2 = xt, Va = _s, M2 = ae, Fr = en;
class R2 {
  constructor(e, n) {
    if (!(e && n))
      throw new M2.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Va.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Va.cryptoClients[e], this.rawPublicKey = n;
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
    const r = [e.header.join("."), F2.encode(e.payload)].join(".");
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
Ls.TokenVerifier = R2;
var Is = {};
Object.defineProperty(Is, "__esModule", { value: !0 });
Is.decodeToken = void 0;
const Mr = xt;
function G2(t) {
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
Is.decodeToken = G2;
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
  Object.defineProperty(t, "__esModule", { value: !0 }), n(kn, t), n(Ls, t), n(Is, t), n(ae, t), n(_s, t);
})(mt);
function V2(t) {
  return `did:btc-addr:${t}`;
}
function K2(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Oa("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Oa('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function Dl(t) {
  if (t)
    return K2(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const z2 = "1.4.0";
function j2() {
  return s2();
}
function q2(t, e, n, r = ol.slice(), s, o = Ap().getTime(), i = {}) {
  const a = (d) => {
    const w = pi("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${d}=undefined])`
    });
    return w == null ? void 0 : w.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const f = Object.assign({}, i, {
    jti: Bp(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(o / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: z2,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = mt.SECP256K1Client.derivePublicKey(t);
  f.public_keys = [u];
  const h = ml(u);
  return f.iss = V2(h), new mt.TokenSigner("ES256k", t).sign(f);
}
async function Ka(t, e) {
  const n = cl($t(e)), r = JSON.parse(n), s = await vl(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function W2(t) {
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
function X2(t) {
  const e = mt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = Dl(e.iss);
  if (n.length === 1) {
    if (ml(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function Y2(t) {
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
function J2(t) {
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
function Z2(t) {
  const e = [
    J2(t),
    Y2(t),
    W2(t),
    X2(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const za = "1.0.0";
class Me {
  constructor(e) {
    this.version = za, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== za)
      throw new Ao(`JSON data version ${e.version} not supported by SessionData`);
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
class Tl {
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
class ja extends Tl {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Me({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new il("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Me({})), !0;
  }
}
class qa extends Tl {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = mp, !localStorage.getItem(this.key)) {
      const r = new Me({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new il("No session data was found in localStorage");
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
var ds;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ds || (ds = {}));
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
const Fl = {
  chainId: sr.Mainnet,
  transactionVersion: re.Mainnet,
  peerNetworkId: ds.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: qt.MainnetSingleSig,
    multiSig: qt.MainnetMultiSig
  },
  client: { baseUrl: Pp }
}, Lo = {
  chainId: sr.Testnet,
  transactionVersion: re.Testnet,
  peerNetworkId: ds.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: qt.TestnetSingleSig,
    multiSig: qt.TestnetMultiSig
  },
  client: { baseUrl: Np }
}, rs = {
  ...Lo,
  addressVersion: { ...Lo.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Dp }
}, Q2 = {
  ...rs,
  addressVersion: { ...rs.addressVersion },
  client: { ...rs.client }
};
function tb(t) {
  switch (t) {
    case "mainnet":
      return Fl;
    case "testnet":
      return Lo;
    case "devnet":
      return rs;
    case "mocknet":
      return Q2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Ml(t) {
  return typeof t == "string" ? tb(t) : t;
}
var Wa;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Wa || (Wa = {}));
var Xa;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Xa || (Xa = {}));
var Ct;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ct || (Ct = {}));
const ro = ["onChainOnly", "offChainOnly", "any"];
ro[0] + "", Ct.OnChainOnly, ro[1] + "", Ct.OffChainOnly, ro[2] + "", Ct.Any, Ct.OnChainOnly + "", Ct.OnChainOnly, Ct.OffChainOnly + "", Ct.OffChainOnly, Ct.Any + "", Ct.Any;
var Ya;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Ya || (Ya = {}));
var Ja;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Ja || (Ja = {}));
var Za;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Za || (Za = {}));
var ne;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(ne || (ne = {}));
var Qa;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Qa || (Qa = {}));
var tc;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(tc || (tc = {}));
var ec;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(ec || (ec = {}));
var nc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(nc || (nc = {}));
var rc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(rc || (rc = {}));
var sc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(sc || (sc = {}));
var oc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(oc || (oc = {}));
var ic;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(ic || (ic = {}));
var ac;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(ac || (ac = {}));
function Io(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function eb(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Rl(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function nb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Io(t.outputLen), Io(t.blockLen);
}
function rb(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function sb(t, e) {
  Rl(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ye = {
  number: Io,
  bool: eb,
  bytes: Rl,
  hash: nb,
  exists: rb,
  output: sb
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const so = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Rt = (t, e) => t << 32 - e | t >>> e, ob = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!ob)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ib(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Ei(t) {
  if (typeof t == "string" && (t = ib(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Gl = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function cn(t) {
  const e = (r) => t().update(Ei(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
class Vl extends Gl {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ye.hash(e);
    const r = Ei(n);
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
const Kl = (t, e, n) => new Vl(t, e).update(n).digest();
Kl.create = (t, e) => new Vl(t, e);
function ab(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, i, r), t.setUint32(e + u, a, r);
}
let Ai = class extends Gl {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = so(this.buffer);
  }
  update(e) {
    Ye.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Ei(e);
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
    Ye.exists(this), Ye.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let c = i; c < s; c++)
      n[c] = 0;
    ab(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = so(e), f = this.outputLen;
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
const cb = (t, e, n) => t & e ^ ~t & n, fb = (t, e, n) => t & e ^ t & n ^ e & n, lb = new Uint32Array([
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
let zl = class extends Ai {
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
      const p = Se[c - 15], d = Se[c - 2], w = Rt(p, 7) ^ Rt(p, 18) ^ p >>> 3, y = Rt(d, 17) ^ Rt(d, 19) ^ d >>> 10;
      Se[c] = y + Se[c - 7] + w + Se[c - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: f, G: u, H: h } = this;
    for (let c = 0; c < 64; c++) {
      const p = Rt(a, 6) ^ Rt(a, 11) ^ Rt(a, 25), d = h + p + cb(a, f, u) + lb[c] + Se[c] | 0, y = (Rt(r, 2) ^ Rt(r, 13) ^ Rt(r, 22)) + fb(r, s, o) | 0;
      h = u, u = f, f = a, a = i + d | 0, i = o, o = s, s = r, r = d + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, f, u, h);
  }
  roundClean() {
    Se.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, hb = class extends zl {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const jl = cn(() => new zl());
cn(() => new hb());
function ub(t, e) {
  switch (e = Ml(e ?? Fl), t) {
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
const db = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ql = Uint8Array.from({ length: 16 }, (t, e) => e), pb = ql.map((t) => (9 * t + 5) % 16);
let vi = [ql], Bi = [pb];
for (let t = 0; t < 4; t++)
  for (let e of [vi, Bi])
    e.push(e[t].map((n) => db[n]));
const Wl = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), bb = vi.map((t, e) => t.map((n) => Wl[e][n])), gb = Bi.map((t, e) => t.map((n) => Wl[e][n])), xb = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), wb = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Rr = (t, e) => t << e | t >>> 32 - e;
function cc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Gr = new Uint32Array(16);
let yb = class extends Ai {
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
      const w = 4 - d, y = xb[d], v = wb[d], L = vi[d], O = Bi[d], x = bb[d], $ = gb[d];
      for (let A = 0; A < 16; A++) {
        const P = Rr(r + cc(d, o, a, u) + Gr[L[A]] + y, x[A]) + c | 0;
        r = c, c = u, u = Rr(a, 10) | 0, a = o, o = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = Rr(s + cc(w, i, f, h) + Gr[O[A]] + v, $[A]) + p | 0;
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
const mb = cn(() => new yb()), Vr = BigInt(2 ** 32 - 1), Uo = BigInt(32);
function Xl(t, e = !1) {
  return e ? { h: Number(t & Vr), l: Number(t >> Uo & Vr) } : { h: Number(t >> Uo & Vr) | 0, l: Number(t & Vr) | 0 };
}
function Sb(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = Xl(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const Eb = (t, e) => BigInt(t >>> 0) << Uo | BigInt(e >>> 0), Ab = (t, e, n) => t >>> n, vb = (t, e, n) => t << 32 - n | e >>> n, Bb = (t, e, n) => t >>> n | e << 32 - n, $b = (t, e, n) => t << 32 - n | e >>> n, _b = (t, e, n) => t << 64 - n | e >>> n - 32, Hb = (t, e, n) => t >>> n - 32 | e << 64 - n, Lb = (t, e) => e, Ib = (t, e) => t, Ub = (t, e, n) => t << n | e >>> 32 - n, Ob = (t, e, n) => e << n | t >>> 32 - n, Cb = (t, e, n) => e << n - 32 | t >>> 64 - n, kb = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Pb(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Nb = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Db = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Tb = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Fb = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Mb = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Rb = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, V = {
  fromBig: Xl,
  split: Sb,
  toBig: Eb,
  shrSH: Ab,
  shrSL: vb,
  rotrSH: Bb,
  rotrSL: $b,
  rotrBH: _b,
  rotrBL: Hb,
  rotr32H: Lb,
  rotr32L: Ib,
  rotlSH: Ub,
  rotlSL: Ob,
  rotlBH: Cb,
  rotlBL: kb,
  add: Pb,
  add3L: Nb,
  add3H: Db,
  add4L: Tb,
  add4H: Fb,
  add5H: Rb,
  add5L: Mb
}, [Gb, Vb] = V.split([
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
let Us = class extends Ai {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: f, Eh: u, El: h, Fh: c, Fl: p, Gh: d, Gl: w, Hh: y, Hl: v } = this;
    return [e, n, r, s, o, i, a, f, u, h, c, p, d, w, y, v];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, f, u, h, c, p, d, w, y, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = f | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = c | 0, this.Fl = p | 0, this.Gh = d | 0, this.Gl = w | 0, this.Hh = y | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      Ee[x] = e.getUint32(n), Ae[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const $ = Ee[x - 15] | 0, A = Ae[x - 15] | 0, P = V.rotrSH($, A, 1) ^ V.rotrSH($, A, 8) ^ V.shrSH($, A, 7), T = V.rotrSL($, A, 1) ^ V.rotrSL($, A, 8) ^ V.shrSL($, A, 7), C = Ee[x - 2] | 0, I = Ae[x - 2] | 0, b = V.rotrSH(C, I, 19) ^ V.rotrBH(C, I, 61) ^ V.shrSH(C, I, 6), E = V.rotrSL(C, I, 19) ^ V.rotrBL(C, I, 61) ^ V.shrSL(C, I, 6), H = V.add4L(T, E, Ae[x - 7], Ae[x - 16]), k = V.add4H(H, P, b, Ee[x - 7], Ee[x - 16]);
      Ee[x] = k | 0, Ae[x] = H | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: f, Dh: u, Dl: h, Eh: c, El: p, Fh: d, Fl: w, Gh: y, Gl: v, Hh: L, Hl: O } = this;
    for (let x = 0; x < 80; x++) {
      const $ = V.rotrSH(c, p, 14) ^ V.rotrSH(c, p, 18) ^ V.rotrBH(c, p, 41), A = V.rotrSL(c, p, 14) ^ V.rotrSL(c, p, 18) ^ V.rotrBL(c, p, 41), P = c & d ^ ~c & y, T = p & w ^ ~p & v, C = V.add5L(O, A, T, Vb[x], Ae[x]), I = V.add5H(C, L, $, P, Gb[x], Ee[x]), b = C | 0, E = V.rotrSH(r, s, 28) ^ V.rotrBH(r, s, 34) ^ V.rotrBH(r, s, 39), H = V.rotrSL(r, s, 28) ^ V.rotrBL(r, s, 34) ^ V.rotrBL(r, s, 39), k = r & o ^ r & a ^ o & a, M = s & i ^ s & f ^ i & f;
      L = y | 0, O = v | 0, y = d | 0, v = w | 0, d = c | 0, w = p | 0, { h: c, l: p } = V.add(u | 0, h | 0, I | 0, b | 0), u = a | 0, h = f | 0, a = o | 0, f = i | 0, o = r | 0, i = s | 0;
      const N = V.add3L(b, H, M);
      r = V.add3H(N, I, E, k), s = N | 0;
    }
    ({ h: r, l: s } = V.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = V.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: f } = V.add(this.Ch | 0, this.Cl | 0, a | 0, f | 0), { h: u, l: h } = V.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: c, l: p } = V.add(this.Eh | 0, this.El | 0, c | 0, p | 0), { h: d, l: w } = V.add(this.Fh | 0, this.Fl | 0, d | 0, w | 0), { h: y, l: v } = V.add(this.Gh | 0, this.Gl | 0, y | 0, v | 0), { h: L, l: O } = V.add(this.Hh | 0, this.Hl | 0, L | 0, O | 0), this.set(r, s, o, i, a, f, u, h, c, p, d, w, y, v, L, O);
  }
  roundClean() {
    Ee.fill(0), Ae.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Kb = class extends Us {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, zb = class extends Us {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, jb = class extends Us {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
cn(() => new Us());
cn(() => new Kb());
cn(() => new zb());
cn(() => new jb());
var Oo;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Oo || (Oo = {}));
function qb(t, e) {
  return { type: Oo.Address, version: t, hash160: e };
}
function Wb(t) {
  return Mn.c32address(t.version, t.hash160);
}
const Xb = (t) => mb(jl(t)), Yb = (t) => It(Xb(t));
at.hmacSha256Sync = (t, ...e) => {
  const n = Kl.create(jl, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Jb(t, e = "mainnet") {
  e = Ml(e), t = typeof t == "string" ? $t(t) : t;
  const n = ub(ne.P2PKH, e), r = qb(n, Yb(t));
  return Wb(r);
}
function Zb(t, e) {
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
  const s = r.issuer.publicKey, o = Jb(s);
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
function Qb(t, e = null) {
  let n;
  e ? n = Zb(t, e) : n = mt.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const fc = "_blockstackDidCheckEchoReply", tg = "echoReply", eg = "authContinuation";
function ng(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, o] = r.split("=");
    return n[s] = o ? decodeURIComponent(o.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function rg() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[fc];
  if (typeof e == "boolean")
    return e;
  const n = ng(t.location.search), r = n[tg];
  if (r) {
    t[fc] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const o = n[eg];
      t.location.href = o;
    }, 10), !0;
  }
  return !1;
}
class Co {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new fl();
    else
      throw new Ep("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new qa(e.sessionOptions) : this.store = new qa() : e ? this.store = new ja(e.sessionOptions) : this.store = new ja();
  }
  makeAuthRequestToken(e, n, r, s, o, i = vp().getTime(), a = {}) {
    const f = this.appConfig;
    if (!f)
      throw new Ao("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || f.redirectURI(), r = r || f.manifestURI(), s = s || f.scopes, o = o || f.appDomain, q2(e, n, r, s, o, i, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = j2();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = pi("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (rg())
        return Bn.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Bn.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = Vp()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Pr("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const o = mt.decodeToken(e).payload;
    if (typeof o == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await Z2(e))
      throw new Pr("Invalid authentication response.");
    let a = o.private_key, f = o.core_token;
    if (Qs(o.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (o.private_key !== void 0 && o.private_key !== null)
          try {
            a = await Ka(s, o.private_key);
          } catch {
            if (Bn.warn("Failed decryption of appPrivateKey, will try to use as given"), !at.isValidPrivateKey(o.private_key))
              throw new Pr("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (f != null)
          try {
            f = await Ka(s, f);
          } catch {
            Bn.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Pr("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = Tp, h;
    Qs(o.version, "1.2.0") && o.hubUrl !== null && o.hubUrl !== void 0 && (u = o.hubUrl), Qs(o.version, "1.3.0") && o.associationToken !== null && o.associationToken !== void 0 && (h = o.associationToken);
    const c = {
      profile: o.profile,
      email: o.email,
      decentralizedID: o.iss,
      identityAddress: Dl(o.iss),
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
        c.profile = Object.assign({}, yp);
      else {
        const w = await d.text(), y = JSON.parse(w);
        c.profile = Qb(y[0].token);
      }
    } else
      c.profile = o.profile;
    return r.userData = c, this.store.setSessionData(r), c;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new Ao("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), p2(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), b2(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
Co.prototype.makeAuthRequest = Co.prototype.makeAuthRequestToken;
const sg = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), Yl = "STX_PROVIDER", Jl = () => typeof window > "u" ? null : window.localStorage.getItem(Yl), og = (t) => {
  typeof window < "u" && window.localStorage.setItem(Yl, t);
}, ig = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function ag(t, e) {
  const n = {};
  return Object.assign(n, ig, e), await fetch(t, n);
}
function cg(t) {
  let e = ag, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function fg(...t) {
  const { fetchLib: e, middlewares: n } = cg(t);
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
var lc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(lc || (lc = {}));
const lg = "https://api.mainnet.hiro.so", hg = "https://api.testnet.hiro.so", ug = "http://localhost:3999", dg = ["mainnet", "testnet", "devnet", "mocknet"];
class rn {
  constructor(e) {
    this.version = nn.Mainnet, this.chainId = Nn.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === nn.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? fg();
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
      return new ko();
    case "testnet":
      return new Po();
    case "devnet":
      return new pg();
    case "mocknet":
      return new Zl();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${dg.join(", ")}`);
  }
};
rn.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : rn.fromName(t);
class ko extends rn {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? lg,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = nn.Mainnet, this.chainId = Nn.Mainnet;
  }
}
class Po extends rn {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? hg,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = nn.Testnet, this.chainId = Nn.Testnet;
  }
}
class Zl extends rn {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? ug,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = nn.Testnet, this.chainId = Nn.Testnet;
  }
}
const pg = Zl;
var No;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(No || (No = {}));
var hc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(hc || (hc = {}));
No.Mainnet;
var ps;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ps || (ps = {}));
var uc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(uc || (uc = {}));
ps.Mainnet;
const bg = 128, gg = 128, Ql = 16;
var dc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(dc || (dc = {}));
var pc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(pc || (pc = {}));
var kt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(kt || (kt = {}));
const oo = ["onChainOnly", "offChainOnly", "any"];
oo[0] + "", kt.OnChainOnly, oo[1] + "", kt.OffChainOnly, oo[2] + "", kt.Any, kt.OnChainOnly + "", kt.OnChainOnly, kt.OffChainOnly + "", kt.OffChainOnly, kt.Any + "", kt.Any;
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
var wc;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(wc || (wc = {}));
var yc;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(yc || (yc = {}));
var mc;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(mc || (mc = {}));
var Sc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Sc || (Sc = {}));
var Ec;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Ec || (Ec = {}));
var Ac;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ac || (Ac = {}));
var vc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(vc || (vc = {}));
var Bc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Bc || (Bc = {}));
var $c;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})($c || ($c = {}));
var _c;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(_c || (_c = {}));
let xg = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, wg = class extends xg {
  constructor(e) {
    super(e);
  }
};
function Do(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function yg(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function t0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function mg(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Do(t.outputLen), Do(t.blockLen);
}
function Sg(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Eg(t, e) {
  t0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const io = {
  number: Do,
  bool: yg,
  bytes: t0,
  hash: mg,
  exists: Sg,
  output: Eg
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ao = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Gt = (t, e) => t << 32 - e | t >>> e, Ag = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Ag)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function vg(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function e0(t) {
  if (typeof t == "string" && (t = vg(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Bg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function fn(t) {
  const e = (r) => t().update(e0(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function $g(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, i, r), t.setUint32(e + u, a, r);
}
let $i = class extends Bg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ao(this.buffer);
  }
  update(e) {
    io.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = e0(e);
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
    $g(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = ao(e), f = this.outputLen;
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
const _g = (t, e, n) => t & e ^ ~t & n, Hg = (t, e, n) => t & e ^ t & n ^ e & n, Lg = new Uint32Array([
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
let n0 = class extends $i {
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
      const p = Be[c - 15], d = Be[c - 2], w = Gt(p, 7) ^ Gt(p, 18) ^ p >>> 3, y = Gt(d, 17) ^ Gt(d, 19) ^ d >>> 10;
      Be[c] = y + Be[c - 7] + w + Be[c - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: f, G: u, H: h } = this;
    for (let c = 0; c < 64; c++) {
      const p = Gt(a, 6) ^ Gt(a, 11) ^ Gt(a, 25), d = h + p + _g(a, f, u) + Lg[c] + Be[c] | 0, y = (Gt(r, 2) ^ Gt(r, 13) ^ Gt(r, 22)) + Hg(r, s, o) | 0;
      h = u, u = f, f = a, a = i + d | 0, i = o, o = s, s = r, r = d + y | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, f = f + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, f, u, h);
  }
  roundClean() {
    Be.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Ig = class extends n0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
fn(() => new n0());
fn(() => new Ig());
const Ug = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), r0 = Uint8Array.from({ length: 16 }, (t, e) => e), Og = r0.map((t) => (9 * t + 5) % 16);
let _i = [r0], Hi = [Og];
for (let t = 0; t < 4; t++)
  for (let e of [_i, Hi])
    e.push(e[t].map((n) => Ug[n]));
const s0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Cg = _i.map((t, e) => t.map((n) => s0[e][n])), kg = Hi.map((t, e) => t.map((n) => s0[e][n])), Pg = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Ng = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Kr = (t, e) => t << e | t >>> 32 - e;
function Hc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const zr = new Uint32Array(16);
let Dg = class extends $i {
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
      const w = 4 - d, y = Pg[d], v = Ng[d], L = _i[d], O = Hi[d], x = Cg[d], $ = kg[d];
      for (let A = 0; A < 16; A++) {
        const P = Kr(r + Hc(d, o, a, u) + zr[L[A]] + y, x[A]) + c | 0;
        r = c, c = u, u = Kr(a, 10) | 0, a = o, o = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = Kr(s + Hc(w, i, f, h) + zr[O[A]] + v, $[A]) + p | 0;
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
fn(() => new Dg());
const jr = BigInt(2 ** 32 - 1), To = BigInt(32);
function o0(t, e = !1) {
  return e ? { h: Number(t & jr), l: Number(t >> To & jr) } : { h: Number(t >> To & jr) | 0, l: Number(t & jr) | 0 };
}
function Tg(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = o0(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const Fg = (t, e) => BigInt(t >>> 0) << To | BigInt(e >>> 0), Mg = (t, e, n) => t >>> n, Rg = (t, e, n) => t << 32 - n | e >>> n, Gg = (t, e, n) => t >>> n | e << 32 - n, Vg = (t, e, n) => t << 32 - n | e >>> n, Kg = (t, e, n) => t << 64 - n | e >>> n - 32, zg = (t, e, n) => t >>> n - 32 | e << 64 - n, jg = (t, e) => e, qg = (t, e) => t, Wg = (t, e, n) => t << n | e >>> 32 - n, Xg = (t, e, n) => e << n | t >>> 32 - n, Yg = (t, e, n) => e << n - 32 | t >>> 64 - n, Jg = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Zg(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Qg = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), tx = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, ex = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), nx = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, rx = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), sx = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, K = {
  fromBig: o0,
  split: Tg,
  toBig: Fg,
  shrSH: Mg,
  shrSL: Rg,
  rotrSH: Gg,
  rotrSL: Vg,
  rotrBH: Kg,
  rotrBL: zg,
  rotr32H: jg,
  rotr32L: qg,
  rotlSH: Wg,
  rotlSL: Xg,
  rotlBH: Yg,
  rotlBL: Jg,
  add: Zg,
  add3L: Qg,
  add3H: tx,
  add4L: ex,
  add4H: nx,
  add5H: sx,
  add5L: rx
}, [ox, ix] = K.split([
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
let Os = class extends $i {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: f, Eh: u, El: h, Fh: c, Fl: p, Gh: d, Gl: w, Hh: y, Hl: v } = this;
    return [e, n, r, s, o, i, a, f, u, h, c, p, d, w, y, v];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, f, u, h, c, p, d, w, y, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = f | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = c | 0, this.Fl = p | 0, this.Gh = d | 0, this.Gl = w | 0, this.Hh = y | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      $e[x] = e.getUint32(n), _e[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const $ = $e[x - 15] | 0, A = _e[x - 15] | 0, P = K.rotrSH($, A, 1) ^ K.rotrSH($, A, 8) ^ K.shrSH($, A, 7), T = K.rotrSL($, A, 1) ^ K.rotrSL($, A, 8) ^ K.shrSL($, A, 7), C = $e[x - 2] | 0, I = _e[x - 2] | 0, b = K.rotrSH(C, I, 19) ^ K.rotrBH(C, I, 61) ^ K.shrSH(C, I, 6), E = K.rotrSL(C, I, 19) ^ K.rotrBL(C, I, 61) ^ K.shrSL(C, I, 6), H = K.add4L(T, E, _e[x - 7], _e[x - 16]), k = K.add4H(H, P, b, $e[x - 7], $e[x - 16]);
      $e[x] = k | 0, _e[x] = H | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: f, Dh: u, Dl: h, Eh: c, El: p, Fh: d, Fl: w, Gh: y, Gl: v, Hh: L, Hl: O } = this;
    for (let x = 0; x < 80; x++) {
      const $ = K.rotrSH(c, p, 14) ^ K.rotrSH(c, p, 18) ^ K.rotrBH(c, p, 41), A = K.rotrSL(c, p, 14) ^ K.rotrSL(c, p, 18) ^ K.rotrBL(c, p, 41), P = c & d ^ ~c & y, T = p & w ^ ~p & v, C = K.add5L(O, A, T, ix[x], _e[x]), I = K.add5H(C, L, $, P, ox[x], $e[x]), b = C | 0, E = K.rotrSH(r, s, 28) ^ K.rotrBH(r, s, 34) ^ K.rotrBH(r, s, 39), H = K.rotrSL(r, s, 28) ^ K.rotrBL(r, s, 34) ^ K.rotrBL(r, s, 39), k = r & o ^ r & a ^ o & a, M = s & i ^ s & f ^ i & f;
      L = y | 0, O = v | 0, y = d | 0, v = w | 0, d = c | 0, w = p | 0, { h: c, l: p } = K.add(u | 0, h | 0, I | 0, b | 0), u = a | 0, h = f | 0, a = o | 0, f = i | 0, o = r | 0, i = s | 0;
      const N = K.add3L(b, H, M);
      r = K.add3H(N, I, E, k), s = N | 0;
    }
    ({ h: r, l: s } = K.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = K.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: f } = K.add(this.Ch | 0, this.Cl | 0, a | 0, f | 0), { h: u, l: h } = K.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: c, l: p } = K.add(this.Eh | 0, this.El | 0, c | 0, p | 0), { h: d, l: w } = K.add(this.Fh | 0, this.Fl | 0, d | 0, w | 0), { h: y, l: v } = K.add(this.Gh | 0, this.Gl | 0, y | 0, v | 0), { h: L, l: O } = K.add(this.Hh | 0, this.Hl | 0, L | 0, O | 0), this.set(r, s, o, i, a, f, u, h, c, p, d, w, y, v, L, O);
  }
  roundClean() {
    $e.fill(0), _e.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, ax = class extends Os {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, cx = class extends Os {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, fx = class extends Os {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
fn(() => new Os());
fn(() => new ax());
fn(() => new cx());
fn(() => new fx());
var ct;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(ct || (ct = {}));
var Fo;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Fo || (Fo = {}));
function Li(t) {
  return Fo[t];
}
var bs;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(bs || (bs = {}));
function i0(t, e, n) {
  const s = bg;
  if (Ex(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: bs.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
function a0(t) {
  const e = Mn.c32addressDecode(t);
  return {
    type: bs.Address,
    version: e[0],
    hash160: e[1]
  };
}
function c0(t) {
  const e = [];
  return e.push($t(bi(t.version, 1))), e.push($t(t.hash160)), Vn(e);
}
function f0(t) {
  const e = [], n = hr(t.content), r = n.byteLength;
  return e.push($t(bi(r, t.lengthPrefixBytes))), e.push(n), Vn(e);
}
function Yt(t, e) {
  return Vn([Li(t), e]);
}
function lx(t) {
  return new Uint8Array([Li(t.type)]);
}
function hx(t) {
  return t.type === ct.OptionalNone ? new Uint8Array([Li(t.type)]) : Yt(t.type, dr(t.value));
}
function ux(t) {
  const e = new Uint8Array(4);
  return vs(e, Math.ceil(t.value.length / 2), 0), Yt(t.type, ie(e, $t(t.value)));
}
function dx(t) {
  const e = al(Ip(BigInt(t.value), BigInt(gg)), Ql);
  return Yt(t.type, e);
}
function px(t) {
  const e = al(BigInt(t.value), Ql);
  return Yt(t.type, e);
}
function bx(t) {
  return Yt(t.type, c0(a0(t.value)));
}
function gx(t) {
  const [e, n] = Ax(t.value);
  return Yt(t.type, ie(c0(a0(e)), f0(i0(n))));
}
function xx(t) {
  return Yt(t.type, dr(t.value));
}
function wx(t) {
  const e = [], n = new Uint8Array(4);
  vs(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = dr(r);
    e.push(s);
  }
  return Yt(t.type, Vn(e));
}
function yx(t) {
  const e = [], n = new Uint8Array(4);
  vs(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = i0(s);
    e.push(f0(o));
    const i = dr(t.value[s]);
    e.push(i);
  }
  return Yt(t.type, Vn(e));
}
function l0(t, e) {
  const n = [], r = e == "ascii" ? Op(t.value) : hr(t.value), s = new Uint8Array(4);
  return vs(s, r.length, 0), n.push(s), n.push(r), Yt(t.type, Vn(n));
}
function mx(t) {
  return l0(t, "ascii");
}
function Sx(t) {
  return l0(t, "utf8");
}
function Lc(t) {
  return It(dr(t));
}
function dr(t) {
  switch (t.type) {
    case ct.BoolTrue:
    case ct.BoolFalse:
      return lx(t);
    case ct.OptionalNone:
    case ct.OptionalSome:
      return hx(t);
    case ct.Buffer:
      return ux(t);
    case ct.UInt:
      return px(t);
    case ct.Int:
      return dx(t);
    case ct.PrincipalStandard:
      return bx(t);
    case ct.PrincipalContract:
      return gx(t);
    case ct.ResponseOk:
    case ct.ResponseErr:
      return xx(t);
    case ct.List:
      return wx(t);
    case ct.Tuple:
      return yx(t);
    case ct.StringASCII:
      return mx(t);
    case ct.StringUTF8:
      return Sx(t);
    default:
      throw new wg("Unable to serialize. Invalid Clarity Value.");
  }
}
const Ex = (t, e) => t ? hr(t).length > e : !1;
function Ax(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
function vx(t, e) {
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
    return BigInt(`0x${_x(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Ii(t, e = 8) {
  return (typeof t == "bigint" ? t : vx(t)).toString(16).padStart(e * 2, "0");
}
function h0(t, e = 16) {
  const n = Ii(t, e);
  return or(n);
}
function Bx(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const $x = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function _x(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += $x[n];
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
function Ui(t) {
  return new TextEncoder().encode(t);
}
function Hx(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Lx(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Ic(t) {
  if (t.some(Lx))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Oi(...t) {
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
  return Oi(...t.map((e) => typeof e == "number" ? Ic([e]) : e instanceof Array ? Ic(e) : e));
}
function Cs(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Mo;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Mo || (Mo = {}));
Mo.Mainnet;
const Ix = 128, Ux = 128, u0 = 16;
var Ro;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Ro || (Ro = {}));
var Uc;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Uc || (Uc = {}));
var Oc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Oc || (Oc = {}));
var Pt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Pt || (Pt = {}));
const co = ["onChainOnly", "offChainOnly", "any"];
co[0] + "", Pt.OnChainOnly, co[1] + "", Pt.OffChainOnly, co[2] + "", Pt.Any, Pt.OnChainOnly + "", Pt.OnChainOnly, Pt.OffChainOnly + "", Pt.OffChainOnly, Pt.Any + "", Pt.Any;
var Go;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Go || (Go = {}));
Go.Mainnet;
var Cc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Cc || (Cc = {}));
var kc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(kc || (kc = {}));
var Pc;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Pc || (Pc = {}));
var Nc;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Nc || (Nc = {}));
var Dc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
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
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Mc || (Mc = {}));
var Rc;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Rc || (Rc = {}));
var Gc;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Gc || (Gc = {}));
var Vc;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Vc || (Vc = {}));
function Vo(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Ox(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function d0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Cx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Vo(t.outputLen), Vo(t.blockLen);
}
function kx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Px(t, e) {
  d0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const fo = {
  number: Vo,
  bool: Ox,
  bytes: d0,
  hash: Cx,
  exists: kx,
  output: Px
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const lo = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Vt = (t, e) => t << 32 - e | t >>> e, Nx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Nx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Dx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function p0(t) {
  if (typeof t == "string" && (t = Dx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Tx {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function ln(t) {
  const e = (r) => t().update(p0(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Fx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), f = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + f, i, r), t.setUint32(e + u, a, r);
}
class Ci extends Tx {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = lo(this.buffer);
  }
  update(e) {
    fo.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = p0(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const f = lo(e);
        for (; s <= o - i; i += s)
          this.process(f, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    fo.exists(this), fo.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let c = i; c < s; c++)
      n[c] = 0;
    Fx(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = lo(e), f = this.outputLen;
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
const Mx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), b0 = Uint8Array.from({ length: 16 }, (t, e) => e), Rx = b0.map((t) => (9 * t + 5) % 16);
let ki = [b0], Pi = [Rx];
for (let t = 0; t < 4; t++)
  for (let e of [ki, Pi])
    e.push(e[t].map((n) => Mx[n]));
const g0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Gx = ki.map((t, e) => t.map((n) => g0[e][n])), Vx = Pi.map((t, e) => t.map((n) => g0[e][n])), Kx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), zx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), qr = (t, e) => t << e | t >>> 32 - e;
function Kc(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Wr = new Uint32Array(16);
class jx extends Ci {
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
      const w = 4 - d, y = Kx[d], v = zx[d], L = ki[d], O = Pi[d], x = Gx[d], $ = Vx[d];
      for (let A = 0; A < 16; A++) {
        const P = qr(r + Kc(d, o, a, u) + Wr[L[A]] + y, x[A]) + c | 0;
        r = c, c = u, u = qr(a, 10) | 0, a = o, o = P;
      }
      for (let A = 0; A < 16; A++) {
        const P = qr(s + Kc(w, i, f, h) + Wr[O[A]] + v, $[A]) + p | 0;
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
ln(() => new jx());
const qx = (t, e, n) => t & e ^ ~t & n, Wx = (t, e, n) => t & e ^ t & n ^ e & n, Xx = new Uint32Array([
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
class x0 extends Ci {
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
      const p = Le[c - 15], d = Le[c - 2], w = Vt(p, 7) ^ Vt(p, 18) ^ p >>> 3, y = Vt(d, 17) ^ Vt(d, 19) ^ d >>> 10;
      Le[c] = y + Le[c - 7] + w + Le[c - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: f, G: u, H: h } = this;
    for (let c = 0; c < 64; c++) {
      const p = Vt(a, 6) ^ Vt(a, 11) ^ Vt(a, 25), d = h + p + qx(a, f, u) + Xx[c] + Le[c] | 0, y = (Vt(r, 2) ^ Vt(r, 13) ^ Vt(r, 22)) + Wx(r, s, o) | 0;
      h = u, u = f, f = a, a = i + d | 0, i = o, o = s, s = r, r = d + y | 0;
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
class Yx extends x0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
ln(() => new x0());
ln(() => new Yx());
const Xr = BigInt(2 ** 32 - 1), Ko = BigInt(32);
function w0(t, e = !1) {
  return e ? { h: Number(t & Xr), l: Number(t >> Ko & Xr) } : { h: Number(t >> Ko & Xr) | 0, l: Number(t & Xr) | 0 };
}
function Jx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = w0(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const Zx = (t, e) => BigInt(t >>> 0) << Ko | BigInt(e >>> 0), Qx = (t, e, n) => t >>> n, tw = (t, e, n) => t << 32 - n | e >>> n, ew = (t, e, n) => t >>> n | e << 32 - n, nw = (t, e, n) => t << 32 - n | e >>> n, rw = (t, e, n) => t << 64 - n | e >>> n - 32, sw = (t, e, n) => t >>> n - 32 | e << 64 - n, ow = (t, e) => e, iw = (t, e) => t, aw = (t, e, n) => t << n | e >>> 32 - n, cw = (t, e, n) => e << n | t >>> 32 - n, fw = (t, e, n) => e << n - 32 | t >>> 64 - n, lw = (t, e, n) => t << n - 32 | e >>> 64 - n;
function hw(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const uw = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), dw = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, pw = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), bw = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, gw = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), xw = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, z = {
  fromBig: w0,
  split: Jx,
  toBig: Zx,
  shrSH: Qx,
  shrSL: tw,
  rotrSH: ew,
  rotrSL: nw,
  rotrBH: rw,
  rotrBL: sw,
  rotr32H: ow,
  rotr32L: iw,
  rotlSH: aw,
  rotlSL: cw,
  rotlBH: fw,
  rotlBL: lw,
  add: hw,
  add3L: uw,
  add3H: dw,
  add4L: pw,
  add4H: bw,
  add5H: xw,
  add5L: gw
}, [ww, yw] = z.split([
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
class ks extends Ci {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: f, Eh: u, El: h, Fh: c, Fl: p, Gh: d, Gl: w, Hh: y, Hl: v } = this;
    return [e, n, r, s, o, i, a, f, u, h, c, p, d, w, y, v];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, f, u, h, c, p, d, w, y, v) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = f | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = c | 0, this.Fl = p | 0, this.Gh = d | 0, this.Gl = w | 0, this.Hh = y | 0, this.Hl = v | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      Ie[x] = e.getUint32(n), Ue[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const $ = Ie[x - 15] | 0, A = Ue[x - 15] | 0, P = z.rotrSH($, A, 1) ^ z.rotrSH($, A, 8) ^ z.shrSH($, A, 7), T = z.rotrSL($, A, 1) ^ z.rotrSL($, A, 8) ^ z.shrSL($, A, 7), C = Ie[x - 2] | 0, I = Ue[x - 2] | 0, b = z.rotrSH(C, I, 19) ^ z.rotrBH(C, I, 61) ^ z.shrSH(C, I, 6), E = z.rotrSL(C, I, 19) ^ z.rotrBL(C, I, 61) ^ z.shrSL(C, I, 6), H = z.add4L(T, E, Ue[x - 7], Ue[x - 16]), k = z.add4H(H, P, b, Ie[x - 7], Ie[x - 16]);
      Ie[x] = k | 0, Ue[x] = H | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: f, Dh: u, Dl: h, Eh: c, El: p, Fh: d, Fl: w, Gh: y, Gl: v, Hh: L, Hl: O } = this;
    for (let x = 0; x < 80; x++) {
      const $ = z.rotrSH(c, p, 14) ^ z.rotrSH(c, p, 18) ^ z.rotrBH(c, p, 41), A = z.rotrSL(c, p, 14) ^ z.rotrSL(c, p, 18) ^ z.rotrBL(c, p, 41), P = c & d ^ ~c & y, T = p & w ^ ~p & v, C = z.add5L(O, A, T, yw[x], Ue[x]), I = z.add5H(C, L, $, P, ww[x], Ie[x]), b = C | 0, E = z.rotrSH(r, s, 28) ^ z.rotrBH(r, s, 34) ^ z.rotrBH(r, s, 39), H = z.rotrSL(r, s, 28) ^ z.rotrBL(r, s, 34) ^ z.rotrBL(r, s, 39), k = r & o ^ r & a ^ o & a, M = s & i ^ s & f ^ i & f;
      L = y | 0, O = v | 0, y = d | 0, v = w | 0, d = c | 0, w = p | 0, { h: c, l: p } = z.add(u | 0, h | 0, I | 0, b | 0), u = a | 0, h = f | 0, a = o | 0, f = i | 0, o = r | 0, i = s | 0;
      const N = z.add3L(b, H, M);
      r = z.add3H(N, I, E, k), s = N | 0;
    }
    ({ h: r, l: s } = z.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = z.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: f } = z.add(this.Ch | 0, this.Cl | 0, a | 0, f | 0), { h: u, l: h } = z.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: c, l: p } = z.add(this.Eh | 0, this.El | 0, c | 0, p | 0), { h: d, l: w } = z.add(this.Fh | 0, this.Fl | 0, d | 0, w | 0), { h: y, l: v } = z.add(this.Gh | 0, this.Gl | 0, y | 0, v | 0), { h: L, l: O } = z.add(this.Hh | 0, this.Hl | 0, L | 0, O | 0), this.set(r, s, o, i, a, f, u, h, c, p, d, w, y, v, L, O);
  }
  roundClean() {
    Ie.fill(0), Ue.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class mw extends ks {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class Sw extends ks {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class Ew extends ks {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
ln(() => new ks());
ln(() => new mw());
ln(() => new Sw());
ln(() => new Ew());
function Aw(t, e, n) {
  const s = Ix;
  if (Tw(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Ro.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var ft;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(ft || (ft = {}));
class vw extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Bw extends vw {
  constructor(e) {
    super(e);
  }
}
function y0(t) {
  const e = [];
  return e.push(or(Ii(t.version, 1))), e.push(or(t.hash160)), Kn(e);
}
function m0(t) {
  const e = [], n = Ui(t.content), r = n.byteLength;
  return e.push(or(Ii(r, t.lengthPrefixBytes))), e.push(n), Kn(e);
}
function Jt(t, e) {
  return Kn([t, e]);
}
function $w(t) {
  return new Uint8Array([t.type]);
}
function _w(t) {
  return t.type === ft.OptionalNone ? new Uint8Array([t.type]) : Jt(t.type, Dn(t.value));
}
function Hw(t) {
  const e = new Uint8Array(4);
  return Cs(e, t.buffer.length, 0), Jt(t.type, Oi(e, t.buffer));
}
function Lw(t) {
  const e = h0(Bx(t.value, BigInt(Ux)), u0);
  return Jt(t.type, e);
}
function Iw(t) {
  const e = h0(t.value, u0);
  return Jt(t.type, e);
}
function Uw(t) {
  return Jt(t.type, y0(t.address));
}
function Ow(t) {
  return Jt(t.type, Oi(y0(t.address), m0(t.contractName)));
}
function Cw(t) {
  return Jt(t.type, Dn(t.value));
}
function kw(t) {
  const e = [], n = new Uint8Array(4);
  Cs(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Dn(r);
    e.push(s);
  }
  return Jt(t.type, Kn(e));
}
function Pw(t) {
  const e = [], n = new Uint8Array(4);
  Cs(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = Aw(s);
    e.push(m0(o));
    const i = Dn(t.data[s]);
    e.push(i);
  }
  return Jt(t.type, Kn(e));
}
function S0(t, e) {
  const n = [], r = e == "ascii" ? Hx(t.data) : Ui(t.data), s = new Uint8Array(4);
  return Cs(s, r.length, 0), n.push(s), n.push(r), Jt(t.type, Kn(n));
}
function Nw(t) {
  return S0(t, "ascii");
}
function Dw(t) {
  return S0(t, "utf8");
}
function Dn(t) {
  switch (t.type) {
    case ft.BoolTrue:
    case ft.BoolFalse:
      return $w(t);
    case ft.OptionalNone:
    case ft.OptionalSome:
      return _w(t);
    case ft.Buffer:
      return Hw(t);
    case ft.UInt:
      return Iw(t);
    case ft.Int:
      return Lw(t);
    case ft.PrincipalStandard:
      return Uw(t);
    case ft.PrincipalContract:
      return Ow(t);
    case ft.ResponseOk:
    case ft.ResponseErr:
      return Cw(t);
    case ft.List:
      return kw(t);
    case ft.Tuple:
      return Pw(t);
    case ft.StringASCII:
      return Nw(t);
    case ft.StringUTF8:
      return Dw(t);
    default:
      throw new Bw("Unable to serialize. Invalid Clarity Value.");
  }
}
const Tw = (t, e) => t ? Ui(t).length > e : !1;
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var Fw = Object.defineProperty, Mw = Object.defineProperties, Rw = Object.getOwnPropertyDescriptors, gs = Object.getOwnPropertySymbols, E0 = Object.prototype.hasOwnProperty, A0 = Object.prototype.propertyIsEnumerable, zc = (t, e, n) => e in t ? Fw(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, zo = (t, e) => {
  for (var n in e || (e = {})) E0.call(e, n) && zc(t, n, e[n]);
  if (gs) for (var n of gs(e)) A0.call(e, n) && zc(t, n, e[n]);
  return t;
}, jo = (t, e) => Mw(t, Rw(e)), Gw = (t, e) => {
  var n = {};
  for (var r in t) E0.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && gs) for (var r of gs(t)) e.indexOf(r) < 0 && A0.call(t, r) && (n[r] = t[r]);
  return n;
};
function Vw(t) {
  return t ? typeof t == "string" ? rn.fromName(t) : "version" in t ? t : "url" in t ? new ko({ url: t.url }) : t.transactionVersion === ps.Mainnet ? new ko({ url: t.client.baseUrl }) : new Po({ url: t.client.baseUrl }) : new Po();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var Kw = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(Kw || {}), zw = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(zw || {}), v0 = (t) => {
  let e = t;
  if (!e) {
    let n = new fl(["store_write"], document.location.href);
    e = new Co({ appConfig: n });
  }
  return e;
};
function jw(t) {
  try {
    return v0(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var qw = (t) => {
  let e = v0(t).loadUserData().appPrivateKey, n = mt.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function B0(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? jo(zo({}, t), { message: Lc(e), domain: Lc(n) }) : jo(zo({}, t), { message: It(Dn(e)), domain: It(Dn(n)) });
}
async function Ww(t, e) {
  return new mt.TokenSigner("ES256k", e).signAsync(B0(t));
}
async function Xw(t) {
  let e = t, { userSession: n } = e, r = Gw(e, ["userSession"]);
  if (jw(n)) {
    let { privateKey: s, publicKey: o } = qw(n), i = jo(zo({}, r), { publicKey: o });
    return Ww(i, s);
  }
  return mt.createUnsecuredToken(B0(t));
}
var Yw = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(Yw || {}), $0 = "asigna-stx", jc = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === $0 && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(Zw(t, e), "*");
}), Jw = { authenticationRequest: async (t) => jc(t, "authenticationRequest"), transactionRequest: async (t) => jc(t, "transactionRequest") }, Zw = (t, e) => ({ source: $0, [e]: t }), Qw = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = Jw);
};
Qw();
const ty = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], Ni = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Ps = () => {
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
}, ey = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), _0 = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((o) => ey(o, r)) === s
  );
}, ny = (t) => t ? _0(Ps()).some(
  (e) => {
    var n;
    return e.id === t && (Ni(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, ry = () => {
  if (typeof window > "u")
    return;
  const t = Ps(), e = _0(t).filter(
    (n) => {
      var r;
      return Ni(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = tr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of ty) {
    const r = tr(t, n) ?? (t === window ? void 0 : tr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, sy = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Ps(), n = tr(e, t) ?? (e === window ? void 0 : tr(window, t)) ?? sg(t);
  if (n)
    return n;
  if (Ni(t) || ny(t))
    return ry();
}, oy = ["blockstack-session", "blockstack"], iy = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of oy) {
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
iy();
const ay = () => Jl(), cy = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = Jl(), e = t ? sy(t) : void 0;
  if (e)
    return e;
  const n = Ps() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, fy = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), qc = (t) => sl(t).replace(/^0x/, ""), Wc = "This wallet cannot sign messages. Try Xverse or Leather.", Xc = (t) => typeof (t == null ? void 0 : t.request) == "function", Yc = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", ly = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, hy = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function uy(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: qc(e.message),
    domain: qc(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function dy(t, e) {
  const n = await Xw({
    domain: e.domain,
    message: e.message,
    network: Vw(e.network),
    stxAddress: e.stxAddress,
    appDetails: e.appDetails ?? fy()
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function py(t) {
  var s, o;
  const e = ay() || "", n = /xverse/i.test(e);
  let r = cy();
  if (n && !Yc(r)) {
    const i = window;
    r = ((s = i.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((o = i.xverseProviders) == null ? void 0 : o.StacksProvider);
  }
  if (Yc(r))
    try {
      return await dy(r, t);
    } catch (i) {
      if (n || !Xc(r) || !hy(i)) throw i;
    }
  if (!n && Xc(r))
    try {
      return await uy(r, t);
    } catch (i) {
      throw ly(i) ? new Error(Wc) : i;
    }
  throw new Error(Wc);
}
function by(t, e, n = {}) {
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
const gy = {}, xy = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, wy = (t) => {
  const e = gy;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, yy = (t) => `/hiro/${t}`, my = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, Sy = (t) => {
  const e = wy(t);
  if (e)
    return [my(e)];
  const n = xy[t];
  return typeof window < "u" ? [`${window.location.origin}${yy(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, Ey = {}, Jc = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, Ay = "xtrata.log.enabled", vy = "xtrata.log.level", By = "xtrata.log.tags", $y = "xtrata.log.dedupe", Yr = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, _y = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, Hy = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, Ly = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, Iy = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, Uy = () => {
  const t = Ey ?? {}, e = Yr(Ay) ?? t.VITE_LOG_ENABLED, n = Yr(vy) ?? t.VITE_LOG_LEVEL, r = Yr(By) ?? t.VITE_LOG_TAGS, s = Yr($y) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: _y(e),
    level: Hy(n) ?? "warn",
    tags: Iy(r),
    dedupe: Ly(s)
  };
}, Oy = (t, e, n) => !t.enabled || Jc[n] < Jc[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), Cy = (t, e, n, r) => {
  const s = Uy();
  if (!Oy(s, e, t) || Py(s.dedupe))
    return;
  const o = `[xtrata:${e}] ${n}`, i = console[t] ?? console.log;
  r !== void 0 ? i(o, r) : i(o);
}, ky = /* @__PURE__ */ new Set();
let Zc = null;
const Py = (t, e, n, r, s) => (Zc !== t && (ky.clear(), Zc = t), !1), Ny = (t, e, n) => Cy("debug", t, e, n), Dy = {}, Ty = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, Fy = (t) => {
  const e = Dy, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : Ty[t];
}, My = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, Ry = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return My.test(n) ? n : null;
}, Gy = (t) => t.replace(/\/+$/, ""), Vy = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), Qc = (t) => {
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
}, En = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, Ky = (t) => {
  var f, u;
  let e;
  try {
    e = An(gp(t));
  } catch {
    return null;
  }
  const n = En(e);
  if (!n || n.success === !1)
    return null;
  const r = En(n.value), s = En(r == null ? void 0 : r.value), o = En(s == null ? void 0 : s.value);
  if (!o)
    return null;
  const i = Qc((f = En(o.name)) == null ? void 0 : f.value), a = Qc((u = En(o.namespace)) == null ? void 0 : u.value);
  return !i || !a ? null : Ry(`${i}.${a}`);
}, zy = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${Gy(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [sl(Fd(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const o = await s.json();
  return !(o != null && o.okay) || typeof o.result != "string" ? null : Ky(o.result);
}, jy = async (t) => {
  const e = t.address.trim();
  if (!xp(e))
    return null;
  const n = Fy(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of Sy(t.network))
    try {
      return await zy({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (o) {
      r = o;
    }
  return Ny("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: Vy(r)
  }), null;
}, qy = "ParallaX Casino", Wy = "ParallaX Casino room sign-in. This is free: it sends no transaction, costs no fees and gives no permission to spend anything.";
new TextEncoder();
new TextDecoder();
const Xy = (t) => t === "mainnet" ? 1 : 2147483648, Yy = (t) => `${Wy} Account ${t.address}. Valid until ${new Date(t.expires).toISOString().replace(".000Z", "Z")}. Request code ${t.nonce}.`, Jy = (t) => ({
  domain: Zf({
    name: es(qy),
    version: es("1"),
    "chain-id": Jf(Xy(t.network))
  }),
  message: es(Yy(t))
}), Jr = (t) => !!t && typeof t.request == "function", Zy = () => {
  try {
    const t = window.top;
    if (t && t !== window.self && t.location.origin === window.location.origin) return t;
  } catch {
  }
  return window;
}, Qy = () => {
  const t = Zy();
  return t === window ? [window] : [t, window];
}, tf = (t) => {
  for (const e of Qy()) {
    const n = t(e);
    if (n) return n;
  }
  return null;
}, t3 = (t) => {
  if (t === "leather") {
    const n = tf((r) => Jr(r.LeatherProvider) ? r.LeatherProvider : null);
    return n ? { rpc: n } : null;
  }
  const e = tf((n) => {
    const r = n.XverseProviders || n.xverseProviders;
    return r && (Jr(r.BitcoinProvider) || Jr(r.StacksProvider)) ? r : null;
  });
  return e ? { rpc: Jr(e.BitcoinProvider) ? e.BitcoinProvider : e.StacksProvider } : null;
}, e3 = (t, e) => new Promise((n) => {
  const r = Date.now();
  (function s() {
    const o = t3(t);
    o || Date.now() - r >= e ? n(o) : window.setTimeout(s, 150);
  })();
}), xs = (t) => {
  var e;
  return (t == null ? void 0 : t.code) ?? ((e = t == null ? void 0 : t.error) == null ? void 0 : e.code);
}, Je = (t) => {
  var e;
  return String((t == null ? void 0 : t.message) ?? ((e = t == null ? void 0 : t.error) == null ? void 0 : e.message) ?? t ?? "unknown error");
}, n3 = (t) => [4001, -31001].includes(Number(xs(t))) || /cancel|denied|reject|declin|closed/i.test(Je(t)), ef = (t) => Number(xs(t)) === -32601 || /not supported|method not found|unsupported|not implemented|legacy method/i.test(Je(t)), ho = async (t, e, n) => {
  const r = n === void 0 ? await t.request(e) : await t.request(e, n);
  if (r && typeof r == "object") {
    if (r.error) throw Object.assign(new Error(Je(r.error)), { code: xs(r.error) });
    if (r.status === "error") throw Object.assign(new Error(Je(r.error || r)), { code: xs(r.error || r) });
    if ("result" in r) return r.result;
  }
  return r;
}, r3 = (t) => new Promise((e, n) => {
  const r = window.setTimeout(() => n(new Error("The wallet did not answer. Check its window.")), 9e4);
  t.then((s) => {
    window.clearTimeout(r), e(s);
  }, (s) => {
    window.clearTimeout(r), n(s);
  });
}), s3 = (t) => (JSON.stringify(t) || "").match(/S[PT][0-9A-HJKMNP-TV-Z]{38,39}/g) || [], Oe = [];
async function o3(t) {
  const e = await e3(t, 1500);
  if (!e) throw new Error(`${t === "leather" ? "Leather" : "Xverse"} was not found in this browser.`);
  Oe.length = 0;
  let n;
  if (t === "xverse") {
    try {
      await ho(e.rpc, "wallet_disconnect"), Oe.push("wallet_disconnect: ok");
    } catch (s) {
      Oe.push("wallet_disconnect: " + Je(s).slice(0, 80));
    }
    n = ["wallet_connect", "wallet_getAccount"];
  } else
    n = ["getAddresses", "stx_getAccounts", "stx_getAddresses", "stx_requestAccounts"];
  let r = null;
  for (const s of n)
    try {
      const o = await (t === "xverse" ? r3(ho(e.rpc, s)) : ho(e.rpc, s)), i = s3(o);
      if (i.length) {
        const a = i[0];
        return Oe.push(`${s}: ok`), { kind: t, address: a, network: a.startsWith("SP") ? "mainnet" : "testnet", via: s };
      }
      Oe.push(`${s}: answered but no Stacks address in it`);
    } catch (o) {
      if (n3(o))
        throw Oe.push(`${s}: cancelled`), new Error("Connection cancelled.");
      Oe.push(`${s}: ${ef(o) ? "not supported" : Je(o).slice(0, 80)}`), ef(o) || (r = o);
    }
  throw new Error(r ? Je(r) : "The wallet did not share a Stacks address.");
}
const i3 = (t) => og(t === "leather" ? "LeatherProvider" : "XverseProviders.BitcoinProvider"), H0 = (t) => t instanceof Error ? t.message : String(t), uo = 500, L0 = 40, a3 = 2e3, ir = 280, nf = "px_room_blocks_v1", rf = "px_chat_ui_v1", po = "px_chat_session_v1:", sf = { hidden: !1, side: "left" }, c3 = [
  { code: "spam", label: "Spam" },
  { code: "abuse", label: "Abuse" },
  { code: "scam", label: "Scam" },
  { code: "other", label: "Something else" }
], f3 = (t) => {
  if (!Array.isArray(t)) return [];
  const e = [];
  for (const n of t)
    if (!(typeof n != "string" || !/^S[A-Z0-9]{19,60}$/.test(n) || e.includes(n)) && (e.push(n), e.length >= L0))
      break;
  return e;
}, l3 = (t) => {
  if (!t) return [];
  try {
    return f3(JSON.parse(t));
  } catch {
    return [];
  }
}, h3 = (t) => {
  if (!t) return { ...sf };
  try {
    const e = JSON.parse(t);
    return { hidden: (e == null ? void 0 : e.hidden) === !0, side: (e == null ? void 0 : e.side) === "right" ? "right" : "left" };
  } catch {
    return { ...sf };
  }
}, I0 = {
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
}, u3 = (t) => typeof t == "string" && Object.prototype.hasOwnProperty.call(I0, t), Yn = (t) => I0[String(t)] ?? "The room could not take that. Try again in a moment.", d3 = (t) => t.replace(/\s+/g, " ").trim(), p3 = (t) => Array.from(t).length, b3 = (t, e) => {
  const n = d3(t);
  return e.signed ? e.connected ? n ? p3(n) > ir ? { ok: !1, code: "too-long" } : e.now - e.lastSentAt < a3 ? { ok: !1, code: "slow-down" } : { ok: !0, text: n } : { ok: !1, code: "empty" } : { ok: !1, code: "offline" } : { ok: !1, code: "sign-in-first" };
};
class g3 {
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
    return o && (i.to = o), this.lines.push(i), this.lines.length > uo && this.lines.splice(0, this.lines.length - uo), i;
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
    for (const s of n.slice(-uo)) {
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
class x3 {
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
const w3 = `
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
function y3(t) {
  const e = new g3(), n = new x3();
  let r = { hidden: !1, side: "left" }, s = [];
  try {
    r = h3(window.localStorage.getItem(rf)), s = l3(window.localStorage.getItem(nf));
  } catch {
  }
  e.setBlocked(s);
  let o = !1, i = null, a = null, f = !1, u = "", h = 0, c = 0, p = 0, d = null, w = 0, y = !0, v = null;
  const L = () => {
    try {
      window.localStorage.setItem(rf, JSON.stringify(r));
    } catch {
    }
  }, O = () => {
    try {
      window.localStorage.setItem(nf, JSON.stringify(s));
    } catch {
    }
  }, x = (S) => t.labelFor(S), $ = () => {
    if (v)
      try {
        window.sessionStorage.setItem(po + v, e.dump());
      } catch {
      }
  }, A = (S) => {
    if (S)
      try {
        window.sessionStorage.removeItem(po + S);
      } catch {
      }
  }, P = (S) => {
    if (S !== v) {
      if (A(v), e.clear(), At.forEach((F) => F.remove()), At.clear(), v = S, S)
        try {
          e.load(window.sessionStorage.getItem(po + S));
        } catch {
        }
      y = !0;
    }
  }, T = (S) => s.includes(S), C = document.createElement("style");
  C.textContent = w3, document.head.append(C);
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
  const At = /* @__PURE__ */ new Map(), pr = () => o || !!a || !!u, Ds = () => {
    var S;
    return (S = window.matchMedia) != null && S.call(window, "(max-width:700px)").matches ? 5 : 8;
  }, un = (S) => {
    const F = q("button", x(S.a), "nm");
    return F.type = "button", F.dataset.a = S.a, F.setAttribute("aria-label", `Options for ${x(S.a)}`), F.onclick = () => Dt(S), F;
  }, Ts = (S) => {
    const F = S.who ? `ln${S.mine ? " mine" : ""}${S.to ? " dm" : ""}` : "ln note", J = q("div", void 0, F);
    if (!S.who)
      return J.append(q("span", S.text, "tx")), J;
    const X = [];
    return S.to ? S.mine ? X.push(q("span", "You", "nm"), q("span", "→", "tag"), un(S.to)) : X.push(un(S.who), q("span", "→ you", "tag")) : X.push(S.mine ? q("span", "You", "nm") : un(S.who)), X.push(q("span", S.text, "tx")), X.forEach((lt, ut) => {
      ut && J.append(document.createTextNode(" ")), J.append(lt);
    }), J;
  }, Fs = () => b.scrollTop + b.clientHeight >= b.scrollHeight - 8, br = () => {
    b.scrollTop = b.scrollHeight, y = !0, E.hidden = !0;
  }, gr = () => {
    const S = pr(), F = S ? e.all() : e.tail(Ds()), J = b.classList.contains("scroll");
    b.classList.toggle("scroll", S);
    const X = new Set(F.map((pt) => pt.id));
    let lt = !1;
    for (const [pt, bt] of At) X.has(pt) || (bt.remove(), At.delete(pt));
    let ut = null;
    for (const pt of F) {
      let bt = At.get(pt.id);
      bt || (bt = Ts(pt), At.set(pt.id, bt), lt = !0);
      const Tt = ut ? ut.nextElementSibling : b.firstElementChild;
      Tt !== bt && b.insertBefore(bt, Tt), ut = bt;
    }
    if (!S) {
      E.hidden = !0, y = !0;
      return;
    }
    !J || y ? br() : lt && (E.hidden = !1);
  }, xr = () => {
    it.replaceChildren(q("span", "💬", "ic"), q("span", "Chat", "lbl")), r.hidden && h > 0 && it.append(q("span", h > 9 ? "9+" : String(h), c ? "dot dm" : "dot")), it.setAttribute("aria-expanded", String(o && !r.hidden)), it.setAttribute("aria-label", r.hidden && h ? `Chat: ${h} new${c ? `, ${c} sent to you` : ""}` : "Casino chat: type a message");
  }, wr = () => {
    M.hidden = !o || r.hidden, N.hidden = !i, i && (N.textContent = `To ${x(i.a)} ×`, N.setAttribute("aria-label", `Writing to ${x(i.a)}. Press to write to the whole room instead.`)), et.classList.toggle("dm", !!i);
    const S = i ? `Message ${x(i.a)}` : "Say something to the room";
    et.placeholder = S, et.setAttribute("aria-label", S);
  }, yr = () => {
    if (H.replaceChildren(), H.hidden = !a, !a) return;
    const S = a, F = T(S.a);
    H.append(q("p", x(S.a), "who"));
    const J = q("div", void 0, "row");
    if (f) {
      H.append(q("p", "Why? Your report goes to the casino team with the last few things they said to you or the room."));
      for (const X of c3) J.append(Kt(X.label, () => {
        Rs(S, X.code), Ve();
      }));
    } else {
      const X = Kt("Message", () => {
        Ve(), Ms(S);
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
        F.append(q("span", x(S)), Kt("Unblock", () => {
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
  function Ms(S) {
    if (T(S.a)) {
      dt(Yn("blocked")), tt();
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
      if (s.length >= L0) {
        dt(Yn("too-many-blocks"));
        return;
      }
      s.includes(S.a) || s.push(S.a), e.dropFrom(S.a), $(), (i == null ? void 0 : i.a) === S.a && (i = null), dt(`You blocked ${J}. Neither of you will see the other's messages.`);
    } else
      s = s.filter((X) => X !== S.a), dt(`You unblocked ${J}.`);
    e.setBlocked(s), At.forEach((X) => X.remove()), At.clear(), O(), qn();
  }
  function Rs(S, F) {
    if (!t.me() || !t.connected()) {
      dt("Not connected to the room, so the report was not sent.");
      return;
    }
    t.send({ t: "report", who: S.a, why: F, lines: e.lastFrom(S.a) }) && (w = Date.now()), dt("Sending your report…");
  }
  it.onclick = () => {
    o && !r.hidden ? pn() : Ge();
  }, N.onclick = jn, E.onclick = () => br(), b.addEventListener("scroll", () => {
    y = Fs(), y && (E.hidden = !0);
  }, { passive: !0 }), b.addEventListener("wheel", (S) => {
    b.classList.contains("scroll") && S.stopPropagation();
  }, { passive: !0 }), b.addEventListener("touchmove", (S) => {
    b.classList.contains("scroll") && S.stopPropagation();
  }, { passive: !0 }), M.onsubmit = (S) => {
    S.preventDefault();
    const F = Date.now(), J = b3(et.value, { signed: !!t.me(), connected: t.connected(), now: F, lastSentAt: p }), X = "Not connected to the room yet. Your message is still in the box.";
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
    p = F, w = F, d = { text: J.text, to: i }, et.value = "";
  }, et.addEventListener("keydown", (S) => {
    S.stopPropagation(), S.key === "Escape" && (S.preventDefault(), i && !et.value ? jn() : pn());
  }), et.addEventListener("keypress", (S) => S.stopPropagation()), document.addEventListener("pointerdown", (S) => {
    if (!a && !u) return;
    const F = S.target;
    F && (I.contains(F) || it.contains(F)) || (a = null, f = !1, u = "", tt());
  }), window.addEventListener("resize", dn);
  const Ar = document.getElementById("intro");
  Ar && "MutationObserver" in window && new MutationObserver(() => dn()).observe(Ar, { attributes: !0, attributeFilter: ["class", "style", "hidden"] });
  const Gs = {
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
      e.add({ a: S.from.a }, String(S.text ?? "").slice(0, ir * 2), J, Date.now(), X) && ($(), J ? (d = null, y = !0) : r.hidden && (h += 1, X && (c += 1)), tt());
    },
    /**
     * The room refused something. Only a refusal of something chat just sent is chat's business: the room also says "slow down" to
     * the page's own seat updates, and those must not show up as chat notes. Returns whether chat took it.
     * A refused message goes back into the box so nothing typed is lost.
     */
    failed(S) {
      return !d && Date.now() - w > 4e3 ? !1 : (d && !et.value && (et.value = d.text, d.to && S !== "not-here" && S !== "no-such-player" && (i = d.to)), (S === "not-here" || S === "no-such-player") && (i = null), d = null, dt(Yn(S)), tt(), !0);
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
      n.leave(S), typeof S == "string" && (i == null ? void 0 : i.a) === S && (dt(`${x(S)} left the room.`), i = null), tt();
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
        S.textContent = x(S.dataset.a);
      }), i && wr();
    },
    isTyping: () => o,
    debug: () => ({ typing: o, hidden: r.hidden, side: r.side, target: (i == null ? void 0 : i.a) ?? null, blocks: [...s], lines: e.size, shown: At.size, session: v, stick: y, people: n.others(t.me()).map((S) => S.a) })
  };
  return xr(), Gs;
}
const g = {
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
const m3 = (t) => t.length <= 12 ? t : `${t.slice(0, 5)}…${t.slice(-4)}`, S3 = (t) => {
  if (t.startsWith("SP")) return t;
  const e = di(t);
  return Eo({ ...e, version: xo.MainnetSingleSig });
}, E3 = by((t) => jy({ address: S3(t), network: "mainnet" }), () => {
  ws(), qo(), W == null || W.refreshNames();
}), Ns = (t) => {
  let e = null;
  try {
    e = E3.get(t);
  } catch {
  }
  return e || m3(t);
}, U0 = (t, e) => ({ key: t, label: Ns(t), x: e.x, z: e.z, r: e.r, at: e.at }), qo = () => {
  var n, r;
  if (!((n = g.host) != null && n.moves) || g.service !== "ok") return;
  const t = ((r = g.you) == null ? void 0 : r.a) ?? null, e = [...g.walk.entries()].filter(([s]) => s !== t).map(([s, o]) => U0(s, o));
  try {
    g.host.moves(e);
  } catch (s) {
    console.warn("[room] the page could not draw the walkers", s);
  }
}, Zr = (t, e) => {
  var n, r;
  if (e ? g.walk.set(t, e) : g.walk.delete(t), !(!((n = g.host) != null && n.move) || t === (((r = g.you) == null ? void 0 : r.a) ?? null)))
    try {
      g.host.move(e ? U0(t, e) : { key: t, off: !0 });
    } catch (s) {
      console.warn("[room] the page could not move a walker", s);
    }
}, O0 = () => {
  var t;
  !g.features.includes("move") || g.service !== "ok" || !g.connected || !g.signed || !g.you || g.you.guest || ((t = g.ws) == null ? void 0 : t.readyState) === WebSocket.OPEN && (g.ownMove ? (g.ws.send(JSON.stringify({ t: "move", ...g.ownMove })), g.ownSent = !0) : g.ownSent && (g.ws.send(JSON.stringify({ t: "move", off: !0 })), g.ownSent = !1));
}, ws = () => {
  var n;
  if (!g.host || g.service !== "ok") return;
  const t = ((n = g.you) == null ? void 0 : n.a) ?? null, e = Object.entries(g.spots).filter(([, r]) => r.a !== t).map(([r, s]) => ({ key: s.a, spot: r, label: Ns(s.a), since: s.since }));
  try {
    g.host.setPeople(e);
  } catch (r) {
    console.warn("[room] the page could not draw the people", r);
  }
}, ys = async (t, e) => {
  const n = await fetch(t, { credentials: "same-origin", ...e });
  let r = null;
  try {
    r = await n.json();
  } catch {
  }
  return { res: n, body: r };
}, Wo = (t) => {
  var e;
  return ((e = g.ws) == null ? void 0 : e.readyState) !== WebSocket.OPEN ? !1 : (g.ws.send(JSON.stringify(t)), g.lastSent = Date.now(), !0);
}, C0 = () => {
  var e;
  if (g.service !== "ok" || !g.connected || !g.you || g.you.guest || !g.signed) return;
  const t = ((e = Object.entries(g.spots).find(([, n]) => n.a === g.you.a)) == null ? void 0 : e[0]) ?? null;
  g.want ? t !== g.want && g.want !== g.badSpot && g.want !== g.yielded && !g.spots[g.want] && Date.now() - g.lastSent > 1200 && Wo({ t: "sit", spot: g.want }) : t && t !== g.standSent && Date.now() - g.lastSent > 600 && (g.standSent = t, Wo({ t: "stand" }));
}, Di = () => {
  if (g.service !== "ok" || g.ws) return;
  g.attempts += 1;
  let t;
  try {
    t = new WebSocket(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/casino/room/ws`);
  } catch {
    return of();
  }
  g.ws = t, t.onopen = () => {
    g.connected = !0, g.attempts = 0, wt();
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
        g.you = n.you, g.spots = n.spots || {}, g.joined = n.joined, g.guests = n.guests, g.features = Array.isArray(n.features) ? n.features.filter((a) => typeof a == "string") : [], g.walk = /* @__PURE__ */ new Map();
        for (const a of Array.isArray(n.walkers) ? n.walkers : []) a && typeof a.a == "string" && g.walk.set(a.a, { x: +a.x, z: +a.z, r: +a.r, at: +a.at });
        qo(), g.ownSent = !1, O0(), g.standSent = null, g.signed && ((r = g.you) != null && r.guest) && (g.signed = null), W == null || W.room(n.players, !!(g.you && !g.you.guest));
        break;
      case "sat":
        g.spots[n.spot] = n.who, (s = n.who) != null && s.a && g.walk.has(n.who.a) && Zr(n.who.a, null);
        break;
      case "stood":
        delete g.spots[n.spot], g.standSent === n.spot && (g.standSent = null);
        break;
      case "moved":
        g.yielded = n.spot;
        break;
      case "count":
        g.joined = n.joined, g.guests = n.guests;
        break;
      case "say":
      case "dm":
        W == null || W.heard(n);
        return;
      case "join":
        W == null || W.joined(n.who);
        return;
      case "leave":
        W == null || W.left(n.a), g.walk.has(n.a) && Zr(n.a, null);
        return;
      case "reported":
        W == null || W.reported();
        return;
      case "play":
        if (typeof n.spot == "string" && Array.isArray(n.s) && typeof n.b == "number")
          try {
            (i = (o = g.host) == null ? void 0 : o.play) == null || i.call(o, n.spot, { a: String(n.a || ""), s: n.s, b: n.b, f: !!n.f });
          } catch (a) {
            console.warn("[room] the page could not show a spin", a);
          }
        return;
      case "move":
        typeof n.a == "string" && (n.off ? Zr(n.a, null) : [n.x, n.z, n.r, n.at].every((a) => typeof a == "number" && Number.isFinite(a)) && Zr(n.a, { x: n.x, z: n.z, r: n.r, at: n.at }));
        return;
      case "err":
        if (typeof n.code == "string" && (n.code.startsWith("play-") || n.code.startsWith("move-"))) return;
        n.code === "no-such-spot" ? g.badSpot = g.want : u3(n.code) && (W != null && W.failed(n.code)) || n.code === "slow-down" && (g.lastSent = Date.now() + 3e3);
        return;
      default:
        return;
    }
    ws(), C0(), wt();
  }, t.onclose = (e) => {
    if (g.ws === t) {
      if (g.ws = null, g.connected = !1, g.spots = {}, ws(), g.walk = /* @__PURE__ */ new Map(), qo(), g.ownSent = !1, W == null || W.disconnected(), e.code === 4001) {
        g.replaced = !0, wt();
        return;
      }
      wt(), of();
    }
  }, t.onerror = () => {
  };
}, of = () => {
  window.clearTimeout(g.retryTimer);
  const t = Math.min(15e3, 1e3 * 2 ** Math.min(g.attempts, 4));
  g.retryTimer = window.setTimeout(() => {
    g.ws || Di();
  }, t);
}, Ti = () => {
  const t = g.ws;
  g.ws = null, g.connected = !1, g.attempts = 0, g.replaced = !1;
  try {
    t == null || t.close(1e3, "client");
  } catch {
  }
  Di();
};
async function A3(t) {
  const { res: e, body: n } = await ys(`/casino/room/challenge?address=${encodeURIComponent(t.address)}`);
  if (!e.ok) throw new Error((n == null ? void 0 : n.error) || `The room answered ${e.status}.`);
  const r = n.challenge, { domain: s, message: o } = Jy(r);
  g.busy = "sign", wt();
  let i;
  try {
    i = await py({
      domain: s,
      message: o,
      network: r.network,
      stxAddress: t.address,
      appDetails: { name: "ParallaX Casino", icon: `${location.origin}/favicons/xtrata-apple-touch-icon.png` }
    });
  } catch (u) {
    throw new Error("The wallet did not sign: " + H0(u));
  }
  const { res: a, body: f } = await ys("/casino/room/session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ challenge: r, signature: i })
  });
  if (!a.ok) throw new Error((f == null ? void 0 : f.error) || `The room answered ${a.status}.`);
  g.signed = { address: f.address, hash160: f.hash160, expiresAt: f.expiresAt }, Ti();
}
async function v3(t) {
  if (!g.busy) {
    g.error = "", g.busy = "connect", wt();
    try {
      g.wallet = await o3(t), i3(t), await A3(g.wallet), g.open = !1;
    } catch (e) {
      g.error = H0(e);
    } finally {
      g.busy = "", wt();
    }
  }
}
async function B3() {
  try {
    await ys("/casino/room/session", { method: "DELETE" });
  } catch {
  }
  g.signed = null, g.wallet = null, g.error = "", W == null || W.endSession(), W == null || W.disconnected(), Ti(), wt();
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
function _3() {
  var n, r;
  if (Ce || g.service !== "ok") return;
  const t = document.createElement("style");
  t.textContent = $3, document.head.append(t), Ce = ot("span"), Ce.id = "pxroom", Bt = ot("button"), Bt.id = "pxroom-btn", Bt.type = "button", Bt.setAttribute("aria-label", "Casino room: see who is here and join"), Bt.onclick = () => {
    g.open = !g.open, wt();
  }, jt = ot("div"), jt.id = "pxroom-panel", jt.hidden = !0, W = y3({
    send: Wo,
    me: () => g.you && !g.you.guest ? g.you.a : null,
    connected: () => g.connected,
    labelFor: Ns,
    joinPrompt: () => {
      g.open = !0, wt();
    }
  }), Ce.append(Bt, W.button);
  const e = ((r = (n = g.host) == null ? void 0 : n.mount) == null ? void 0 : r.call(n)) ?? document.querySelector("#tools .rt");
  e ? e.insertBefore(Ce, e.firstChild) : (Ce.style.cssText = "position:fixed;top:10px;right:10px;z-index:30", document.body.append(Ce)), document.body.append(jt), W.mount(document.body), document.addEventListener("keydown", (s) => {
    s.key === "Escape" && g.open && (g.open = !1, wt());
  }), document.addEventListener("pointerdown", (s) => {
    if (!g.open) return;
    const o = s.target;
    o && (jt.contains(o) || Bt.contains(o)) || (g.open = !1, wt());
  }), window.addEventListener("resize", () => wt());
}
function H3() {
  if (!Bt || !jt) return;
  const t = Bt.getBoundingClientRect(), e = t.height ? Math.round(t.bottom + 8) : 64;
  jt.style.top = `${Math.min(e, Math.max(64, window.innerHeight - 220))}px`;
}
function wt() {
  var n;
  if (!Ce || !Bt || !jt) return;
  const t = !!(g.signed && g.you && !g.you.guest);
  if (Bt.className = g.connected ? "live" : "wait", Bt.replaceChildren(ot("i"), ot("span", t ? "In the room" : "Room", "lbl"), ot("span", g.connected ? (n = window.matchMedia) != null && n.call(window, "(max-width:620px)").matches ? String(g.joined) : ` · ${g.joined}` : "", "n")), Bt.setAttribute("aria-label", `Casino room: ${g.connected ? `${g.joined} signed in, ` : ""}${t ? "you are in" : "see who is here and join"}`), jt.hidden = !g.open, !g.open) return;
  H3();
  const e = [];
  if (g.replaced) {
    e.push(ot("h3", "Room"), ot("p", "Another tab of yours took over the room. You are not connected here."));
    const r = ot("button", "Use this tab instead");
    r.onclick = () => {
      Ti(), wt();
    }, e.push(r);
  } else if (t) {
    e.push(ot("h3", "You are in the room")), e.push(ot("p", "Others see you at your seat as"), ot("p", Ns(g.signed.address), "who")), e.push(ot("p", `${g.joined} signed in, ${g.guests} watching.`)), e.push(We("Be seen", "Sit at a table or connect to a machine and your Adrian and name tag appear there for everyone in the room. Stand up or walk away and they go too.")), e.push(We("Spaces", "Each seat and machine holds one person. If someone already has the seat you choose, you are given a free one at the same table.")), e.push(We("Live chat", "Press Chat to talk to the room and scroll back through this session. Tap a name, or Here now, to send someone a direct message, block or report them. Messages are not secret; this session's chat is kept in this tab only and cleared when you leave the room.")), e.push(ot("p", "Nothing here moves any money.", "fact"));
    const r = ot("button", "Leave the room");
    r.onclick = () => {
      B3();
    }, e.push(r);
  } else {
    e.push(ot("h3", "Join the room")), e.push(ot("p", g.connected ? `You are watching: ${g.joined} signed in, ${g.guests} watching.` : "Connecting to the room…")), e.push(We("Be seen", "Join, then sit at a table or connect to a machine. Everyone in the room sees your Adrian there, with a name tag (your BNS name, or a short version of your address). Watching alone shows you to nobody.")), e.push(We("Spaces", "Each seat and machine holds one person. If someone already has the seat you choose, you are given a free one at the same table.")), e.push(We("Live chat", "Signed-in players can chat with the room and send each other direct messages. Messages are not secret and are not saved.")), e.push(We("Free", "One signature. It sends no transaction, costs no fee and gives no permission to spend anything."));
    const r = ot("div", void 0, "row");
    for (const s of ["leather", "xverse"]) {
      const o = ot("button", g.busy ? g.busy === "sign" ? "Check your wallet…" : "Connecting…" : s === "leather" ? "Leather" : "Xverse");
      if (o.disabled = !!g.busy || !g.connected, o.onclick = () => {
        v3(s);
      }, r.append(o), g.busy) break;
    }
    e.push(r), g.error && e.push(ot("p", g.error, "err"));
  }
  jt.replaceChildren(...e);
}
const L3 = (t) => {
  var n, r;
  const e = t.detail;
  !e || typeof e.spot != "string" || !Array.isArray(e.s) || typeof e.b != "number" || !g.features.includes("play") || g.service !== "ok" || !g.connected || !g.signed || !g.you || g.you.guest || ((n = g.spots[e.spot]) == null ? void 0 : n.a) === g.you.a && ((r = g.ws) == null ? void 0 : r.readyState) === WebSocket.OPEN && g.ws.send(JSON.stringify({ t: "play", spot: e.spot, s: e.s.slice(0, 8), b: e.b, f: !!e.f }));
}, I3 = (t) => {
  const e = t.detail;
  if (e) {
    if (e.off) g.ownMove = null;
    else if ([e.x, e.z, e.r].every((n) => typeof n == "number" && Number.isFinite(n))) g.ownMove = { x: e.x, z: e.z, r: e.r };
    else return;
    O0();
  }
}, U3 = () => {
  var e;
  const t = ((e = g.host) == null ? void 0 : e.currentSpot()) ?? null;
  t !== g.want && (g.want = t, g.yielded = null, g.standSent = null, ws()), C0();
};
async function O3() {
  try {
    const { res: t, body: e } = await ys("/casino/room/session");
    if (t.status === 503) return;
    t.ok && (e != null && e.address) && (g.signed = { address: e.address, hash160: e.hash160, expiresAt: e.expiresAt }), g.service = "ok";
  } catch {
    return;
  }
  _3(), wt(), Di(), window.setInterval(U3, 250), window.addEventListener("px-room-play", L3), window.addEventListener("px-room-move", I3);
}
const af = (t) => {
  g.host || (g.host = t, O3());
}, cf = window.PXRoomHost;
cf ? af(cf) : window.addEventListener("px-room-host", () => af(window.PXRoomHost), { once: !0 });
window.__pxRoom = {
  chat: () => (W == null ? void 0 : W.debug()) ?? null,
  get state() {
    var t;
    return { service: g.service, signed: ((t = g.signed) == null ? void 0 : t.address) ?? null, connected: g.connected, you: g.you, spots: g.spots, joined: g.joined, guests: g.guests, want: g.want, features: g.features.slice(), walkers: [...g.walk.keys()], ownMove: g.ownMove, trail: Oe.slice() };
  }
};
