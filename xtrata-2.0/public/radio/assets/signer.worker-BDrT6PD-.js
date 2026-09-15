var Bh = Object.defineProperty;
var _h = (e, t, n) => t in e ? Bh(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Dr = (e, t, n) => _h(e, typeof t != "symbol" ? t + "" : t, n);
function xt(e, t, n) {
  return di(we(e, t), n);
}
function we(e, t) {
  let n = e;
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
      r = r.padStart(r.length + r.length % 2, "0"), n = ce(r);
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
    if (t) {
      const r = kh(BigInt(`0x${oe(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${oe(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function ys(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function kn(e, t = 8) {
  return (typeof e == "bigint" ? e : we(e, !1)).toString(16).padStart(t * 2, "0");
}
function li(e) {
  return parseInt(e, 16);
}
function di(e, t = 16) {
  const n = kn(e, t);
  return ce(n);
}
function Ch(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function Ih(e, t) {
  return e & BigInt(1) << t;
}
function kh(e, t) {
  return Ih(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const Th = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function oe(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += Th[n];
  return t;
}
function ce(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e;
  const t = e.length % 2 ? `0${e}` : e, n = new Uint8Array(t.length / 2);
  for (let r = 0; r < n.length; r++) {
    const i = r * 2, s = t.slice(i, i + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    n[r] = o;
  }
  return n;
}
function bn(e) {
  return new TextEncoder().encode(e);
}
function io(e) {
  return new TextDecoder().decode(e);
}
function so(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function Uh(e) {
  return String.fromCharCode.apply(null, e);
}
function $h(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function ws(e) {
  if (e.some($h))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function xr(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, i) => r + i.length, 0), n = new Uint8Array(t);
  for (let r = 0, i = 0; r < e.length; r++) {
    const s = e[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
function de(e) {
  return xr(...e.map((t) => typeof t == "number" ? ws([t]) : t instanceof Array ? ws(t) : t));
}
var xs;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(xs || (xs = {}));
var ms;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(ms || (ms = {}));
var Ss;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Ss || (Ss = {}));
const oo = 33, Kr = 32;
function Lh(e) {
  if (e.length < Kr * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + Kr * 2), r = e.slice(2 + Kr * 2);
  return {
    recoveryId: li(t),
    r: n,
    s: r
  };
}
function Oh(e) {
  const t = typeof e == "string" ? ce(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function Ph(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function Nh(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function Fh(e, t) {
  return e[t];
}
function Mh(e, t, n = 0) {
  return e[n] = t, e;
}
function Dh(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function Ot(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var Jr;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Jr || (Jr = {}));
const Kh = Jr.Mainnet, zh = 128, Rh = 128, ao = 16, mr = 65, Qr = 34;
var Z;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Z || (Z = {}));
var fe;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(fe || (fe = {}));
var As;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(As || (As = {}));
var Se;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Se || (Se = {}));
const or = ["onChainOnly", "offChainOnly", "any"], Es = {
  [or[0]]: Se.OnChainOnly,
  [or[1]]: Se.OffChainOnly,
  [or[2]]: Se.Any,
  [Se.OnChainOnly]: Se.OnChainOnly,
  [Se.OffChainOnly]: Se.OffChainOnly,
  [Se.Any]: Se.Any
};
function Vh(e) {
  if (e in Es)
    return Es[e];
  throw new Error(`Invalid anchor mode "${e}", must be one of: ${or.join(", ")}`);
}
var He;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(He || (He = {}));
He.Mainnet;
var Bn;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(Bn || (Bn = {}));
var bt;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(bt || (bt = {}));
var ue;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(ue || (ue = {}));
var Y;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Y || (Y = {}));
var Le;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Le || (Le = {}));
var ye;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(ye || (ye = {}));
var ei;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(ei || (ei = {}));
var vs;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(vs || (vs = {}));
var _n;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(_n || (_n = {}));
var Hs;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Hs || (Hs = {}));
var Bs;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(Bs || (Bs = {}));
function ti(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function jh(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function co(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function Gh(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ti(e.outputLen), ti(e.blockLen);
}
function Wh(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function qh(e, t) {
  co(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Tt = {
  number: ti,
  bool: jh,
  bytes: co,
  hash: Gh,
  exists: Wh,
  output: qh
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const zr = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Fe = (e, t) => e << 32 - t | e >>> t, Xh = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Xh)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Zh(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function bi(e) {
  if (typeof e == "string" && (e = Zh(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let ho = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ft(e) {
  const t = (r) => e().update(bi(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function Yh(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), h = r ? 4 : 0, l = r ? 0 : 4;
  e.setUint32(t + h, o, r), e.setUint32(t + l, a, r);
}
let pi = class extends ho {
  constructor(t, n, r, i) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = zr(this.buffer);
  }
  update(t) {
    Tt.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    t = bi(t);
    const s = t.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const h = zr(t);
        for (; i <= s - o; o += i)
          this.process(h, o);
        continue;
      }
      r.set(t.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Tt.exists(this), Tt.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let f = o; f < i; f++)
      n[f] = 0;
    Yh(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = zr(t), h = this.outputLen;
    if (h % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = h / 4, u = this.get();
    if (l > u.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let f = 0; f < l; f++)
      a.setUint32(4 * f, u[f], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: a } = this;
    return t.length = i, t.pos = a, t.finished = s, t.destroyed = o, i % n && t.buffer.set(r), t;
  }
};
const Jh = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), fo = Uint8Array.from({ length: 16 }, (e, t) => t), Qh = fo.map((e) => (9 * e + 5) % 16);
let gi = [fo], yi = [Qh];
for (let e = 0; e < 4; e++)
  for (let t of [gi, yi])
    t.push(t[e].map((n) => Jh[n]));
const uo = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), ef = gi.map((e, t) => e.map((n) => uo[t][n])), tf = yi.map((e, t) => e.map((n) => uo[t][n])), nf = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), rf = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), jn = (e, t) => e << t | e >>> 32 - t;
function _s(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Gn = new Uint32Array(16);
let sf = class extends pi {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: i, h4: s } = this;
    return [t, n, r, i, s];
  }
  set(t, n, r, i, s) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = i | 0, this.h4 = s | 0;
  }
  process(t, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Gn[p] = t.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, h = a, l = this.h3 | 0, u = l, f = this.h4 | 0, g = f;
    for (let p = 0; p < 5; p++) {
      const v = 4 - p, A = nf[p], C = rf[p], $ = gi[p], N = yi[p], E = ef[p], S = tf[p];
      for (let B = 0; B < 16; B++) {
        const O = jn(r + _s(p, s, a, l) + Gn[$[B]] + A, E[B]) + f | 0;
        r = f, f = l, l = jn(a, 10) | 0, a = s, s = O;
      }
      for (let B = 0; B < 16; B++) {
        const O = jn(i + _s(v, o, h, u) + Gn[N[B]] + C, S[B]) + g | 0;
        i = g, g = u, u = jn(h, 10) | 0, h = o, o = O;
      }
    }
    this.set(this.h1 + a + u | 0, this.h2 + l + g | 0, this.h3 + f + i | 0, this.h4 + r + o | 0, this.h0 + s + h | 0);
  }
  roundClean() {
    Gn.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const of = Ft(() => new sf()), af = (e, t, n) => e & t ^ ~e & n, cf = (e, t, n) => e & t ^ e & n ^ t & n, hf = new Uint32Array([
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
]), Qe = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), et = new Uint32Array(64);
let lo = class extends pi {
  constructor() {
    super(64, 32, 8, !1), this.A = Qe[0] | 0, this.B = Qe[1] | 0, this.C = Qe[2] | 0, this.D = Qe[3] | 0, this.E = Qe[4] | 0, this.F = Qe[5] | 0, this.G = Qe[6] | 0, this.H = Qe[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: i, E: s, F: o, G: a, H: h } = this;
    return [t, n, r, i, s, o, a, h];
  }
  // prettier-ignore
  set(t, n, r, i, s, o, a, h) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = a | 0, this.H = h | 0;
  }
  process(t, n) {
    for (let f = 0; f < 16; f++, n += 4)
      et[f] = t.getUint32(n, !1);
    for (let f = 16; f < 64; f++) {
      const g = et[f - 15], p = et[f - 2], v = Fe(g, 7) ^ Fe(g, 18) ^ g >>> 3, A = Fe(p, 17) ^ Fe(p, 19) ^ p >>> 10;
      et[f] = A + et[f - 7] + v + et[f - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: h, G: l, H: u } = this;
    for (let f = 0; f < 64; f++) {
      const g = Fe(a, 6) ^ Fe(a, 11) ^ Fe(a, 25), p = u + g + af(a, h, l) + hf[f] + et[f] | 0, A = (Fe(r, 2) ^ Fe(r, 13) ^ Fe(r, 22)) + cf(r, i, s) | 0;
      u = l, l = h, h = a, a = o + p | 0, o = s, s = i, i = r, r = p + A | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, h = h + this.F | 0, l = l + this.G | 0, u = u + this.H | 0, this.set(r, i, s, o, a, h, l, u);
  }
  roundClean() {
    et.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, ff = class extends lo {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const wi = Ft(() => new lo());
Ft(() => new ff());
const Wn = BigInt(2 ** 32 - 1), ni = BigInt(32);
function bo(e, t = !1) {
  return t ? { h: Number(e & Wn), l: Number(e >> ni & Wn) } : { h: Number(e >> ni & Wn) | 0, l: Number(e & Wn) | 0 };
}
function uf(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let i = 0; i < e.length; i++) {
    const { h: s, l: o } = bo(e[i], t);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const lf = (e, t) => BigInt(e >>> 0) << ni | BigInt(t >>> 0), df = (e, t, n) => e >>> n, bf = (e, t, n) => e << 32 - n | t >>> n, pf = (e, t, n) => e >>> n | t << 32 - n, gf = (e, t, n) => e << 32 - n | t >>> n, yf = (e, t, n) => e << 64 - n | t >>> n - 32, wf = (e, t, n) => e >>> n - 32 | t << 64 - n, xf = (e, t) => t, mf = (e, t) => e, Sf = (e, t, n) => e << n | t >>> 32 - n, Af = (e, t, n) => t << n | e >>> 32 - n, Ef = (e, t, n) => t << n - 32 | e >>> 64 - n, vf = (e, t, n) => e << n - 32 | t >>> 64 - n;
function Hf(e, t, n, r) {
  const i = (t >>> 0) + (r >>> 0);
  return { h: e + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const Bf = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), _f = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, Cf = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), If = (e, t, n, r, i) => t + n + r + i + (e / 2 ** 32 | 0) | 0, kf = (e, t, n, r, i) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), Tf = (e, t, n, r, i, s) => t + n + r + i + s + (e / 2 ** 32 | 0) | 0, G = {
  fromBig: bo,
  split: uf,
  toBig: lf,
  shrSH: df,
  shrSL: bf,
  rotrSH: pf,
  rotrSL: gf,
  rotrBH: yf,
  rotrBL: wf,
  rotr32H: xf,
  rotr32L: mf,
  rotlSH: Sf,
  rotlSL: Af,
  rotlBH: Ef,
  rotlBL: vf,
  add: Hf,
  add3L: Bf,
  add3H: _f,
  add4L: Cf,
  add4H: If,
  add5H: Tf,
  add5L: kf
}, [Uf, $f] = G.split([
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
].map((e) => BigInt(e))), tt = new Uint32Array(80), nt = new Uint32Array(80);
let Sr = class extends pi {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: h, Eh: l, El: u, Fh: f, Fl: g, Gh: p, Gl: v, Hh: A, Hl: C } = this;
    return [t, n, r, i, s, o, a, h, l, u, f, g, p, v, A, C];
  }
  // prettier-ignore
  set(t, n, r, i, s, o, a, h, l, u, f, g, p, v, A, C) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = h | 0, this.Eh = l | 0, this.El = u | 0, this.Fh = f | 0, this.Fl = g | 0, this.Gh = p | 0, this.Gl = v | 0, this.Hh = A | 0, this.Hl = C | 0;
  }
  process(t, n) {
    for (let E = 0; E < 16; E++, n += 4)
      tt[E] = t.getUint32(n), nt[E] = t.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const S = tt[E - 15] | 0, B = nt[E - 15] | 0, O = G.rotrSH(S, B, 1) ^ G.rotrSH(S, B, 8) ^ G.shrSH(S, B, 7), L = G.rotrSL(S, B, 1) ^ G.rotrSL(S, B, 8) ^ G.shrSL(S, B, 7), U = tt[E - 2] | 0, F = nt[E - 2] | 0, d = G.rotrSH(U, F, 19) ^ G.rotrBH(U, F, 61) ^ G.shrSH(U, F, 6), x = G.rotrSL(U, F, 19) ^ G.rotrBL(U, F, 61) ^ G.shrSL(U, F, 6), b = G.add4L(L, x, nt[E - 7], nt[E - 16]), y = G.add4H(b, O, d, tt[E - 7], tt[E - 16]);
      tt[E] = y | 0, nt[E] = b | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: h, Dh: l, Dl: u, Eh: f, El: g, Fh: p, Fl: v, Gh: A, Gl: C, Hh: $, Hl: N } = this;
    for (let E = 0; E < 80; E++) {
      const S = G.rotrSH(f, g, 14) ^ G.rotrSH(f, g, 18) ^ G.rotrBH(f, g, 41), B = G.rotrSL(f, g, 14) ^ G.rotrSL(f, g, 18) ^ G.rotrBL(f, g, 41), O = f & p ^ ~f & A, L = g & v ^ ~g & C, U = G.add5L(N, B, L, $f[E], nt[E]), F = G.add5H(U, $, S, O, Uf[E], tt[E]), d = U | 0, x = G.rotrSH(r, i, 28) ^ G.rotrBH(r, i, 34) ^ G.rotrBH(r, i, 39), b = G.rotrSL(r, i, 28) ^ G.rotrBL(r, i, 34) ^ G.rotrBL(r, i, 39), y = r & s ^ r & a ^ s & a, H = i & o ^ i & h ^ o & h;
      $ = A | 0, N = C | 0, A = p | 0, C = v | 0, p = f | 0, v = g | 0, { h: f, l: g } = G.add(l | 0, u | 0, F | 0, d | 0), l = a | 0, u = h | 0, a = s | 0, h = o | 0, s = r | 0, o = i | 0;
      const k = G.add3L(d, b, H);
      r = G.add3H(k, F, x, y), i = k | 0;
    }
    ({ h: r, l: i } = G.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = G.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: h } = G.add(this.Ch | 0, this.Cl | 0, a | 0, h | 0), { h: l, l: u } = G.add(this.Dh | 0, this.Dl | 0, l | 0, u | 0), { h: f, l: g } = G.add(this.Eh | 0, this.El | 0, f | 0, g | 0), { h: p, l: v } = G.add(this.Fh | 0, this.Fl | 0, p | 0, v | 0), { h: A, l: C } = G.add(this.Gh | 0, this.Gl | 0, A | 0, C | 0), { h: $, l: N } = G.add(this.Hh | 0, this.Hl | 0, $ | 0, N | 0), this.set(r, i, s, o, a, h, l, u, f, g, p, v, A, C, $, N);
  }
  roundClean() {
    tt.fill(0), nt.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Lf = class extends Sr {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Of = class extends Sr {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Pf = class extends Sr {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ft(() => new Sr());
Ft(() => new Lf());
const Nf = Ft(() => new Of());
Ft(() => new Pf());
var Ff = /* @__PURE__ */ Object.freeze({
  __proto__: null
});
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const ee = BigInt(0), ae = BigInt(1), gt = BigInt(2), En = BigInt(3), Cs = BigInt(8), he = Object.freeze({
  a: ee,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: ae,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Is = (e, t) => (e + t / gt) / t, qn = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(e) {
    const { n: t } = he, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -ae * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), i = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), s = n, o = BigInt("0x100000000000000000000000000000000"), a = Is(s * e, t), h = Is(-r * e, t);
    let l = P(e - a * n - h * i, t), u = P(-a * r - h * s, t);
    const f = l > o, g = u > o;
    if (f && (l = t - l), g && (u = t - u), l > o || u > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + e);
    return { k1neg: f, k1: l, k2neg: g, k2: u };
  }
}, Oe = 32, nn = 32, Mf = 32, ks = Oe + 1, Ts = 2 * Oe + 1;
function Us(e) {
  const { a: t, b: n } = he, r = P(e * e), i = P(r * e);
  return P(i + t * e + n);
}
const Xn = he.a === ee;
class po extends Error {
  constructor(t) {
    super(t);
  }
}
function $s(e) {
  if (!(e instanceof re))
    throw new TypeError("JacobianPoint expected");
}
class re {
  constructor(t, n, r) {
    this.x = t, this.y = n, this.z = r;
  }
  static fromAffine(t) {
    if (!(t instanceof te))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return t.equals(te.ZERO) ? re.ZERO : new re(t.x, t.y, ae);
  }
  static toAffineBatch(t) {
    const n = Vf(t.map((r) => r.z));
    return t.map((r, i) => r.toAffine(n[i]));
  }
  static normalizeZ(t) {
    return re.toAffineBatch(t).map(re.fromAffine);
  }
  equals(t) {
    $s(t);
    const { x: n, y: r, z: i } = this, { x: s, y: o, z: a } = t, h = P(i * i), l = P(a * a), u = P(n * l), f = P(s * h), g = P(P(r * a) * l), p = P(P(o * i) * h);
    return u === f && g === p;
  }
  negate() {
    return new re(this.x, P(-this.y), this.z);
  }
  double() {
    const { x: t, y: n, z: r } = this, i = P(t * t), s = P(n * n), o = P(s * s), a = t + s, h = P(gt * (P(a * a) - i - o)), l = P(En * i), u = P(l * l), f = P(u - gt * h), g = P(l * (h - f) - Cs * o), p = P(gt * n * r);
    return new re(f, g, p);
  }
  add(t) {
    $s(t);
    const { x: n, y: r, z: i } = this, { x: s, y: o, z: a } = t;
    if (s === ee || o === ee)
      return this;
    if (n === ee || r === ee)
      return t;
    const h = P(i * i), l = P(a * a), u = P(n * l), f = P(s * h), g = P(P(r * a) * l), p = P(P(o * i) * h), v = P(f - u), A = P(p - g);
    if (v === ee)
      return A === ee ? this.double() : re.ZERO;
    const C = P(v * v), $ = P(v * C), N = P(u * C), E = P(A * A - $ - gt * N), S = P(A * (N - E) - g * $), B = P(i * a * v);
    return new re(E, S, B);
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiplyUnsafe(t) {
    const n = re.ZERO;
    if (typeof t == "bigint" && t === ee)
      return n;
    let r = Ps(t);
    if (r === ae)
      return this;
    if (!Xn) {
      let f = n, g = this;
      for (; r > ee; )
        r & ae && (f = f.add(g)), g = g.double(), r >>= ae;
      return f;
    }
    let { k1neg: i, k1: s, k2neg: o, k2: a } = qn.splitScalar(r), h = n, l = n, u = this;
    for (; s > ee || a > ee; )
      s & ae && (h = h.add(u)), a & ae && (l = l.add(u)), u = u.double(), s >>= ae, a >>= ae;
    return i && (h = h.negate()), o && (l = l.negate()), l = new re(P(l.x * qn.beta), l.y, l.z), h.add(l);
  }
  precomputeWindow(t) {
    const n = Xn ? 128 / t + 1 : 256 / t + 1, r = [];
    let i = this, s = i;
    for (let o = 0; o < n; o++) {
      s = i, r.push(s);
      for (let a = 1; a < 2 ** (t - 1); a++)
        s = s.add(i), r.push(s);
      i = s.double();
    }
    return r;
  }
  wNAF(t, n) {
    !n && this.equals(re.BASE) && (n = te.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let i = n && ri.get(n);
    i || (i = this.precomputeWindow(r), n && r !== 1 && (i = re.normalizeZ(i), ri.set(n, i)));
    let s = re.ZERO, o = re.BASE;
    const a = 1 + (Xn ? 128 / r : 256 / r), h = 2 ** (r - 1), l = BigInt(2 ** r - 1), u = 2 ** r, f = BigInt(r);
    for (let g = 0; g < a; g++) {
      const p = g * h;
      let v = Number(t & l);
      t >>= f, v > h && (v -= u, t += ae);
      const A = p, C = p + Math.abs(v) - 1, $ = g % 2 !== 0, N = v < 0;
      v === 0 ? o = o.add(Zn($, i[A])) : s = s.add(Zn(N, i[C]));
    }
    return { p: s, f: o };
  }
  multiply(t, n) {
    let r = Ps(t), i, s;
    if (Xn) {
      const { k1neg: o, k1: a, k2neg: h, k2: l } = qn.splitScalar(r);
      let { p: u, f } = this.wNAF(a, n), { p: g, f: p } = this.wNAF(l, n);
      u = Zn(o, u), g = Zn(h, g), g = new re(P(g.x * qn.beta), g.y, g.z), i = u.add(g), s = f.add(p);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      i = o, s = a;
    }
    return re.normalizeZ([i, s])[0];
  }
  toAffine(t) {
    const { x: n, y: r, z: i } = this, s = this.equals(re.ZERO);
    t == null && (t = s ? Cs : pn(i));
    const o = t, a = P(o * o), h = P(a * o), l = P(n * a), u = P(r * h), f = P(i * o);
    if (s)
      return te.ZERO;
    if (f !== ae)
      throw new Error("invZ was invalid");
    return new te(l, u);
  }
}
re.BASE = new re(he.Gx, he.Gy, ae);
re.ZERO = new re(ee, ae, ee);
function Zn(e, t) {
  const n = t.negate();
  return e ? n : t;
}
const ri = /* @__PURE__ */ new WeakMap();
class te {
  constructor(t, n) {
    this.x = t, this.y = n;
  }
  _setWindowSize(t) {
    this._WINDOW_SIZE = t, ri.delete(this);
  }
  hasEvenY() {
    return this.y % gt === ee;
  }
  static fromCompressedHex(t) {
    const n = t.length === 32, r = yt(n ? t : t.subarray(1));
    if (!Rr(r))
      throw new Error("Point is not on curve");
    const i = Us(r);
    let s = Rf(i);
    const o = (s & ae) === ae;
    n ? o && (s = P(-s)) : (t[0] & 1) === 1 !== o && (s = P(-s));
    const a = new te(r, s);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(t) {
    const n = yt(t.subarray(1, Oe + 1)), r = yt(t.subarray(Oe + 1, Oe * 2 + 1)), i = new te(n, r);
    return i.assertValidity(), i;
  }
  static fromHex(t) {
    const n = sn(t), r = n.length, i = n[0];
    if (r === Oe)
      return this.fromCompressedHex(n);
    if (r === ks && (i === 2 || i === 3))
      return this.fromCompressedHex(n);
    if (r === Ts && i === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${ks} compressed bytes or ${Ts} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(t) {
    return te.BASE.multiply(hr(t));
  }
  static fromSignature(t, n, r) {
    const { r: i, s } = go(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = xi(sn(t)), { n: a } = he, h = r === 2 || r === 3 ? i + a : i, l = pn(h, a), u = P(-o * l, a), f = P(s * l, a), g = r & 1 ? "03" : "02", p = te.fromHex(g + Jt(h)), v = te.BASE.multiplyAndAddUnsafe(p, u, f);
    if (!v)
      throw new Error("Cannot recover signature: point at infinify");
    return v.assertValidity(), v;
  }
  toRawBytes(t = !1) {
    return Lt(this.toHex(t));
  }
  toHex(t = !1) {
    const n = Jt(this.x);
    return t ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Jt(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const t = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Rr(n) || !Rr(r))
      throw new Error(t);
    const i = P(r * r), s = Us(n);
    if (P(i - s) !== ee)
      throw new Error(t);
  }
  equals(t) {
    return this.x === t.x && this.y === t.y;
  }
  negate() {
    return new te(this.x, P(-this.y));
  }
  double() {
    return re.fromAffine(this).double().toAffine();
  }
  add(t) {
    return re.fromAffine(this).add(re.fromAffine(t)).toAffine();
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiply(t) {
    return re.fromAffine(this).multiply(t, this).toAffine();
  }
  multiplyAndAddUnsafe(t, n, r) {
    const i = re.fromAffine(this), s = n === ee || n === ae || this !== te.BASE ? i.multiplyUnsafe(n) : i.multiply(n), o = re.fromAffine(t).multiplyUnsafe(r), a = s.add(o);
    return a.equals(re.ZERO) ? void 0 : a.toAffine();
  }
}
te.BASE = new te(he.Gx, he.Gy);
te.ZERO = new te(ee, ee);
function Ls(e) {
  return Number.parseInt(e[0], 16) >= 8 ? "00" + e : e;
}
function Os(e) {
  if (e.length < 2 || e[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${rn(e)}`);
  const t = e[1], n = e.subarray(2, t + 2);
  if (!t || n.length !== t)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: yt(n), left: e.subarray(t + 2) };
}
function Df(e) {
  if (e.length < 2 || e[0] != 48)
    throw new Error(`Invalid signature tag: ${rn(e)}`);
  if (e[1] !== e.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: t, left: n } = Os(e.subarray(2)), { data: r, left: i } = Os(n);
  if (i.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${rn(i)}`);
  return { r: t, s: r };
}
class Ne {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromCompact(t) {
    const n = t instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof t != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const i = n ? rn(t) : t;
    if (i.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Ne(cr(i.slice(0, 64)), cr(i.slice(64, 128)));
  }
  static fromDER(t) {
    const n = t instanceof Uint8Array;
    if (typeof t != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s: i } = Df(n ? t : Lt(t));
    return new Ne(r, i);
  }
  static fromHex(t) {
    return this.fromDER(t);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!Cn(t))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Cn(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const t = he.n >> ae;
    return this.s > t;
  }
  normalizeS() {
    return this.hasHighS() ? new Ne(this.r, P(-this.s, he.n)) : this;
  }
  toDERRawBytes() {
    return Lt(this.toDERHex());
  }
  toDERHex() {
    const t = Ls(xn(this.s)), n = Ls(xn(this.r)), r = t.length / 2, i = n.length / 2, s = xn(r), o = xn(i);
    return `30${xn(i + r + 4)}02${o}${n}02${s}${t}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Lt(this.toCompactHex());
  }
  toCompactHex() {
    return Jt(this.r) + Jt(this.s);
  }
}
function pt(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, i) => r + i.length, 0), n = new Uint8Array(t);
  for (let r = 0, i = 0; r < e.length; r++) {
    const s = e[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
const Kf = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function rn(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += Kf[e[n]];
  return t;
}
const zf = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Jt(e) {
  if (typeof e != "bigint")
    throw new Error("Expected bigint");
  if (!(ee <= e && e < zf))
    throw new Error("Expected number 0 <= n < 2^256");
  return e.toString(16).padStart(64, "0");
}
function ii(e) {
  const t = Lt(Jt(e));
  if (t.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return t;
}
function xn(e) {
  const t = e.toString(16);
  return t.length & 1 ? `0${t}` : t;
}
function cr(e) {
  if (typeof e != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof e);
  return BigInt(`0x${e}`);
}
function Lt(e) {
  if (typeof e != "string")
    throw new TypeError("hexToBytes: expected string, got " + typeof e);
  if (e.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + e.length);
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, i = e.slice(r, r + 2), s = Number.parseInt(i, 16);
    if (Number.isNaN(s) || s < 0)
      throw new Error("Invalid byte sequence");
    t[n] = s;
  }
  return t;
}
function yt(e) {
  return cr(rn(e));
}
function sn(e) {
  return e instanceof Uint8Array ? Uint8Array.from(e) : Lt(e);
}
function Ps(e) {
  if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    return BigInt(e);
  if (typeof e == "bigint" && Cn(e))
    return e;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function P(e, t = he.P) {
  const n = e % t;
  return n >= ee ? n : t + n;
}
function ke(e, t) {
  const { P: n } = he;
  let r = e;
  for (; t-- > ee; )
    r *= r, r %= n;
  return r;
}
function Rf(e) {
  const { P: t } = he, n = BigInt(6), r = BigInt(11), i = BigInt(22), s = BigInt(23), o = BigInt(44), a = BigInt(88), h = e * e * e % t, l = h * h * e % t, u = ke(l, En) * l % t, f = ke(u, En) * l % t, g = ke(f, gt) * h % t, p = ke(g, r) * g % t, v = ke(p, i) * p % t, A = ke(v, o) * v % t, C = ke(A, a) * A % t, $ = ke(C, o) * v % t, N = ke($, En) * l % t, E = ke(N, s) * p % t, S = ke(E, n) * h % t, B = ke(S, gt);
  if (B * B % t !== e)
    throw new Error("Cannot find square root");
  return B;
}
function pn(e, t = he.P) {
  if (e === ee || t <= ee)
    throw new Error(`invert: expected positive integers, got n=${e} mod=${t}`);
  let n = P(e, t), r = t, i = ee, s = ae;
  for (; n !== ee; ) {
    const a = r / n, h = r % n, l = i - s * a;
    r = n, n = h, i = s, s = l;
  }
  if (r !== ae)
    throw new Error("invert: does not exist");
  return P(i, t);
}
function Vf(e, t = he.P) {
  const n = new Array(e.length), r = e.reduce((s, o, a) => o === ee ? s : (n[a] = s, P(s * o, t)), ae), i = pn(r, t);
  return e.reduceRight((s, o, a) => o === ee ? s : (n[a] = P(s * n[a], t), P(s * o, t)), i), n;
}
function jf(e) {
  const t = e.length * 8 - nn * 8, n = yt(e);
  return t > 0 ? n >> BigInt(t) : n;
}
function xi(e, t = !1) {
  const n = jf(e);
  if (t)
    return n;
  const { n: r } = he;
  return n >= r ? n - r : n;
}
let Qt, vn;
class Gf {
  constructor(t, n) {
    if (this.hashLen = t, this.qByteLen = n, typeof t != "number" || t < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(t).fill(1), this.k = new Uint8Array(t).fill(0), this.counter = 0;
  }
  hmac(...t) {
    return Be.hmacSha256(this.k, ...t);
  }
  hmacSync(...t) {
    return vn(this.k, ...t);
  }
  checkSync() {
    if (typeof vn != "function")
      throw new po("hmacSha256Sync needs to be set");
  }
  incr() {
    if (this.counter >= 1e3)
      throw new Error("Tried 1,000 k values for sign(), all were invalid");
    this.counter += 1;
  }
  async reseed(t = new Uint8Array()) {
    this.k = await this.hmac(this.v, Uint8Array.from([0]), t), this.v = await this.hmac(this.v), t.length !== 0 && (this.k = await this.hmac(this.v, Uint8Array.from([1]), t), this.v = await this.hmac(this.v));
  }
  reseedSync(t = new Uint8Array()) {
    this.checkSync(), this.k = this.hmacSync(this.v, Uint8Array.from([0]), t), this.v = this.hmacSync(this.v), t.length !== 0 && (this.k = this.hmacSync(this.v, Uint8Array.from([1]), t), this.v = this.hmacSync(this.v));
  }
  async generate() {
    this.incr();
    let t = 0;
    const n = [];
    for (; t < this.qByteLen; ) {
      this.v = await this.hmac(this.v);
      const r = this.v.slice();
      n.push(r), t += this.v.length;
    }
    return pt(...n);
  }
  generateSync() {
    this.checkSync(), this.incr();
    let t = 0;
    const n = [];
    for (; t < this.qByteLen; ) {
      this.v = this.hmacSync(this.v);
      const r = this.v.slice();
      n.push(r), t += this.v.length;
    }
    return pt(...n);
  }
}
function Cn(e) {
  return ee < e && e < he.n;
}
function Rr(e) {
  return ee < e && e < he.P;
}
function Wf(e, t, n, r = !0) {
  const { n: i } = he, s = xi(e, !0);
  if (!Cn(s))
    return;
  const o = pn(s, i), a = te.BASE.multiply(s), h = P(a.x, i);
  if (h === ee)
    return;
  const l = P(o * P(t + n * h, i), i);
  if (l === ee)
    return;
  let u = new Ne(h, l), f = (a.x === u.r ? 0 : 2) | Number(a.y & ae);
  return r && u.hasHighS() && (u = u.normalizeS(), f ^= 1), { sig: u, recovery: f };
}
function hr(e) {
  let t;
  if (typeof e == "bigint")
    t = e;
  else if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    t = BigInt(e);
  else if (typeof e == "string") {
    if (e.length !== 2 * nn)
      throw new Error("Expected 32 bytes of private key");
    t = cr(e);
  } else if (e instanceof Uint8Array) {
    if (e.length !== nn)
      throw new Error("Expected 32 bytes of private key");
    t = yt(e);
  } else
    throw new TypeError("Expected valid private key");
  if (!Cn(t))
    throw new Error("Expected private key: 0 < key < n");
  return t;
}
function qf(e) {
  return e instanceof te ? (e.assertValidity(), e) : te.fromHex(e);
}
function go(e) {
  if (e instanceof Ne)
    return e.assertValidity(), e;
  try {
    return Ne.fromDER(e);
  } catch {
    return Ne.fromCompact(e);
  }
}
function yo(e, t = !1) {
  return te.fromPrivateKey(e).toRawBytes(t);
}
function wo(e) {
  const t = e.length > Oe ? e.slice(0, Oe) : e;
  return yt(t);
}
function Xf(e) {
  const t = wo(e), n = P(t, he.n);
  return xo(n < ee ? t : n);
}
function xo(e) {
  return ii(e);
}
function Zf(e, t, n) {
  if (e == null)
    throw new Error(`sign: expected valid message hash, not "${e}"`);
  const r = sn(e), i = hr(t), s = [xo(i), Xf(r)];
  if (n != null) {
    n === !0 && (n = Be.randomBytes(Oe));
    const h = sn(n);
    if (h.length !== Oe)
      throw new Error(`sign: Expected ${Oe} bytes of extra data`);
    s.push(h);
  }
  const o = pt(...s), a = wo(r);
  return { seed: o, m: a, d: i };
}
function Yf(e, t) {
  const { sig: n, recovery: r } = e, { der: i, recovered: s } = Object.assign({ canonical: !0, der: !0 }, t), o = i ? n.toDERRawBytes() : n.toCompactRawBytes();
  return s ? [o, r] : o;
}
function mo(e, t, n = {}) {
  const { seed: r, m: i, d: s } = Zf(e, t, n.extraEntropy), o = new Gf(Mf, nn);
  o.reseedSync(r);
  let a;
  for (; !(a = Wf(o.generateSync(), i, s, n.canonical)); )
    o.reseedSync();
  return Yf(a, n);
}
const Jf = { strict: !0 };
function Qf(e, t, n, r = Jf) {
  let i;
  try {
    i = go(e), t = sn(t);
  } catch {
    return !1;
  }
  const { r: s, s: o } = i;
  if (r.strict && i.hasHighS())
    return !1;
  const a = xi(t);
  let h;
  try {
    h = qf(n);
  } catch {
    return !1;
  }
  const { n: l } = he, u = pn(o, l), f = P(a * u, l), g = P(s * u, l), p = te.BASE.multiplyAndAddUnsafe(h, f, g);
  return p ? P(p.x, l) === s : !1;
}
te.BASE._setWindowSize(8);
const _e = {
  node: Ff,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Yn = {}, Be = {
  bytesToHex: rn,
  hexToBytes: Lt,
  concatBytes: pt,
  mod: P,
  invert: pn,
  isValidPrivateKey(e) {
    try {
      return hr(e), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: ii,
  _normalizePrivateKey: hr,
  hashToPrivateKey: (e) => {
    e = sn(e);
    const t = nn + 8;
    if (e.length < t || e.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = P(yt(e), he.n - ae) + ae;
    return ii(n);
  },
  randomBytes: (e = 32) => {
    if (_e.web)
      return _e.web.getRandomValues(new Uint8Array(e));
    if (_e.node) {
      const { randomBytes: t } = _e.node;
      return Uint8Array.from(t(e));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Be.hashToPrivateKey(Be.randomBytes(nn + 8)),
  precompute(e = 8, t = te.BASE) {
    const n = t === te.BASE ? t : new te(t.x, t.y);
    return n._setWindowSize(e), n.multiply(En), n;
  },
  sha256: async (...e) => {
    if (_e.web) {
      const t = await _e.web.subtle.digest("SHA-256", pt(...e));
      return new Uint8Array(t);
    } else if (_e.node) {
      const { createHash: t } = _e.node, n = t("sha256");
      return e.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (e, ...t) => {
    if (_e.web) {
      const n = await _e.web.subtle.importKey("raw", e, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = pt(...t), i = await _e.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(i);
    } else if (_e.node) {
      const { createHmac: n } = _e.node, r = n("sha256", e);
      return t.forEach((i) => r.update(i)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (e, ...t) => {
    let n = Yn[e];
    if (n === void 0) {
      const r = await Be.sha256(Uint8Array.from(e, (i) => i.charCodeAt(0)));
      n = pt(r, r), Yn[e] = n;
    }
    return Be.sha256(n, ...t);
  },
  taggedHashSync: (e, ...t) => {
    if (typeof Qt != "function")
      throw new po("sha256Sync is undefined, you need to set it");
    let n = Yn[e];
    if (n === void 0) {
      const r = Qt(Uint8Array.from(e, (i) => i.charCodeAt(0)));
      n = pt(r, r), Yn[e] = n;
    }
    return Qt(n, ...t);
  },
  _JacobianPoint: re
};
Object.defineProperties(Be, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Qt;
    },
    set(e) {
      Qt || (Qt = e);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return vn;
    },
    set(e) {
      vn || (vn = e);
    }
  }
});
var Ut = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function eu(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var gn = {}, mi = {}, Mt = {}, Ar = {};
Object.defineProperty(Ar, "__esModule", { value: !0 });
Ar.crypto = void 0;
Ar.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(e) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(e, "__esModule", { value: !0 }), e.wrapXOFConstructorWithOpts = e.wrapConstructorWithOpts = e.wrapConstructor = e.Hash = e.nextTick = e.swap32IfBE = e.byteSwapIfBE = e.swap8IfBE = e.isLE = void 0, e.isBytes = n, e.anumber = r, e.abytes = i, e.ahash = s, e.aexists = o, e.aoutput = a, e.u8 = h, e.u32 = l, e.clean = u, e.createView = f, e.rotr = g, e.rotl = p, e.byteSwap = v, e.byteSwap32 = A, e.bytesToHex = N, e.hexToBytes = B, e.asyncLoop = L, e.utf8ToBytes = U, e.bytesToUtf8 = F, e.toBytes = d, e.kdfInputToBytes = x, e.concatBytes = b, e.checkOpts = y, e.createHasher = k, e.createOptHasher = D, e.createXOFer = z, e.randomBytes = j;
  const t = Ar;
  function n(w) {
    return w instanceof Uint8Array || ArrayBuffer.isView(w) && w.constructor.name === "Uint8Array";
  }
  function r(w) {
    if (!Number.isSafeInteger(w) || w < 0)
      throw new Error("positive integer expected, got " + w);
  }
  function i(w, ...I) {
    if (!n(w))
      throw new Error("Uint8Array expected");
    if (I.length > 0 && !I.includes(w.length))
      throw new Error("Uint8Array expected of length " + I + ", got length=" + w.length);
  }
  function s(w) {
    if (typeof w != "function" || typeof w.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(w.outputLen), r(w.blockLen);
  }
  function o(w, I = !0) {
    if (w.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (I && w.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(w, I) {
    i(w);
    const ne = I.outputLen;
    if (w.length < ne)
      throw new Error("digestInto() expects output buffer of length at least " + ne);
  }
  function h(w) {
    return new Uint8Array(w.buffer, w.byteOffset, w.byteLength);
  }
  function l(w) {
    return new Uint32Array(w.buffer, w.byteOffset, Math.floor(w.byteLength / 4));
  }
  function u(...w) {
    for (let I = 0; I < w.length; I++)
      w[I].fill(0);
  }
  function f(w) {
    return new DataView(w.buffer, w.byteOffset, w.byteLength);
  }
  function g(w, I) {
    return w << 32 - I | w >>> I;
  }
  function p(w, I) {
    return w << I | w >>> 32 - I >>> 0;
  }
  e.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function v(w) {
    return w << 24 & 4278190080 | w << 8 & 16711680 | w >>> 8 & 65280 | w >>> 24 & 255;
  }
  e.swap8IfBE = e.isLE ? (w) => w : (w) => v(w), e.byteSwapIfBE = e.swap8IfBE;
  function A(w) {
    for (let I = 0; I < w.length; I++)
      w[I] = v(w[I]);
    return w;
  }
  e.swap32IfBE = e.isLE ? (w) => w : A;
  const C = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", $ = /* @__PURE__ */ Array.from({ length: 256 }, (w, I) => I.toString(16).padStart(2, "0"));
  function N(w) {
    if (i(w), C)
      return w.toHex();
    let I = "";
    for (let ne = 0; ne < w.length; ne++)
      I += $[w[ne]];
    return I;
  }
  const E = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function S(w) {
    if (w >= E._0 && w <= E._9)
      return w - E._0;
    if (w >= E.A && w <= E.F)
      return w - (E.A - 10);
    if (w >= E.a && w <= E.f)
      return w - (E.a - 10);
  }
  function B(w) {
    if (typeof w != "string")
      throw new Error("hex string expected, got " + typeof w);
    if (C)
      return Uint8Array.fromHex(w);
    const I = w.length, ne = I / 2;
    if (I % 2)
      throw new Error("hex string expected, got unpadded hex of length " + I);
    const Q = new Uint8Array(ne);
    for (let K = 0, J = 0; K < ne; K++, J += 2) {
      const pe = S(w.charCodeAt(J)), Ie = S(w.charCodeAt(J + 1));
      if (pe === void 0 || Ie === void 0) {
        const Ve = w[J] + w[J + 1];
        throw new Error('hex string expected, got non-hex character "' + Ve + '" at index ' + J);
      }
      Q[K] = pe * 16 + Ie;
    }
    return Q;
  }
  const O = async () => {
  };
  e.nextTick = O;
  async function L(w, I, ne) {
    let Q = Date.now();
    for (let K = 0; K < w; K++) {
      ne(K);
      const J = Date.now() - Q;
      J >= 0 && J < I || (await (0, e.nextTick)(), Q += J);
    }
  }
  function U(w) {
    if (typeof w != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(w));
  }
  function F(w) {
    return new TextDecoder().decode(w);
  }
  function d(w) {
    return typeof w == "string" && (w = U(w)), i(w), w;
  }
  function x(w) {
    return typeof w == "string" && (w = U(w)), i(w), w;
  }
  function b(...w) {
    let I = 0;
    for (let Q = 0; Q < w.length; Q++) {
      const K = w[Q];
      i(K), I += K.length;
    }
    const ne = new Uint8Array(I);
    for (let Q = 0, K = 0; Q < w.length; Q++) {
      const J = w[Q];
      ne.set(J, K), K += J.length;
    }
    return ne;
  }
  function y(w, I) {
    if (I !== void 0 && {}.toString.call(I) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(w, I);
  }
  class H {
  }
  e.Hash = H;
  function k(w) {
    const I = (Q) => w().update(d(Q)).digest(), ne = w();
    return I.outputLen = ne.outputLen, I.blockLen = ne.blockLen, I.create = () => w(), I;
  }
  function D(w) {
    const I = (Q, K) => w(K).update(d(Q)).digest(), ne = w({});
    return I.outputLen = ne.outputLen, I.blockLen = ne.blockLen, I.create = (Q) => w(Q), I;
  }
  function z(w) {
    const I = (Q, K) => w(K).update(d(Q)).digest(), ne = w({});
    return I.outputLen = ne.outputLen, I.blockLen = ne.blockLen, I.create = (Q) => w(Q), I;
  }
  e.wrapConstructor = k, e.wrapConstructorWithOpts = D, e.wrapXOFConstructorWithOpts = z;
  function j(w = 32) {
    if (t.crypto && typeof t.crypto.getRandomValues == "function")
      return t.crypto.getRandomValues(new Uint8Array(w));
    if (t.crypto && typeof t.crypto.randomBytes == "function")
      return Uint8Array.from(t.crypto.randomBytes(w));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(Mt);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32decode = e.c32normalize = e.c32encode = e.c32 = void 0;
  const t = Mt;
  e.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let h = [], l = 0;
    for (let p = o.length - 1; p >= 0; p--)
      if (l < 4) {
        const v = n.indexOf(o[p]) >> l;
        let A = 0;
        p !== 0 && (A = n.indexOf(o[p - 1]));
        const C = 1 + l, $ = A % (1 << C) << 5 - C, N = e.c32[v + $];
        l = C, h.unshift(N);
      } else
        l = 0;
    let u = 0;
    for (let p = 0; p < h.length && h[p] === "0"; p++)
      u++;
    h = h.slice(u);
    const f = new TextDecoder().decode((0, t.hexToBytes)(o)).match(/^\u0000*/), g = f ? f[0].length : 0;
    for (let p = 0; p < g; p++)
      h.unshift(e.c32[0]);
    if (a) {
      const p = a - h.length;
      for (let v = 0; v < p; v++)
        h.unshift(e.c32[0]);
    }
    return h.join("");
  }
  e.c32encode = r;
  function i(o) {
    return o.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  e.c32normalize = i;
  function s(o, a) {
    if (o = i(o), !o.match(`^[${e.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const h = o.match(`^${e.c32[0]}*`), l = h ? h[0].length : 0;
    let u = [], f = 0, g = 0;
    for (let A = o.length - 1; A >= 0; A--) {
      g === 4 && (u.unshift(n[f]), g = 0, f = 0);
      const $ = (e.c32.indexOf(o[A]) << g) + f, N = n[$ % 16];
      if (g += 1, f = $ >> 4, f > 1 << g)
        throw new Error("Panic error in decoding.");
      u.unshift(N);
    }
    u.unshift(n[f]), u.length % 2 === 1 && u.unshift("0");
    let p = 0;
    for (let A = 0; A < u.length && u[A] === "0"; A++)
      p++;
    u = u.slice(p - p % 2);
    let v = u.join("");
    for (let A = 0; A < l; A++)
      v = `00${v}`;
    if (a) {
      const A = a * 2 - v.length;
      for (let C = 0; C < A; C += 2)
        v = `00${v}`;
    }
    return v;
  }
  e.c32decode = s;
})(mi);
var Pt = {}, Pe = {}, se = {}, Ae = {};
Object.defineProperty(Ae, "__esModule", { value: !0 });
Ae.SHA512_IV = Ae.SHA384_IV = Ae.SHA224_IV = Ae.SHA256_IV = Ae.HashMD = void 0;
Ae.setBigUint64 = So;
Ae.Chi = tu;
Ae.Maj = nu;
const Me = Mt;
function So(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), h = r ? 4 : 0, l = r ? 0 : 4;
  e.setUint32(t + h, o, r), e.setUint32(t + l, a, r);
}
function tu(e, t, n) {
  return e & t ^ ~e & n;
}
function nu(e, t, n) {
  return e & t ^ e & n ^ t & n;
}
class ru extends Me.Hash {
  constructor(t, n, r, i) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = i, this.buffer = new Uint8Array(t), this.view = (0, Me.createView)(this.buffer);
  }
  update(t) {
    (0, Me.aexists)(this), t = (0, Me.toBytes)(t), (0, Me.abytes)(t);
    const { view: n, buffer: r, blockLen: i } = this, s = t.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const h = (0, Me.createView)(t);
        for (; i <= s - o; o += i)
          this.process(h, o);
        continue;
      }
      r.set(t.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    (0, Me.aexists)(this), (0, Me.aoutput)(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, (0, Me.clean)(this.buffer.subarray(o)), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let f = o; f < i; f++)
      n[f] = 0;
    So(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = (0, Me.createView)(t), h = this.outputLen;
    if (h % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = h / 4, u = this.get();
    if (l > u.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let f = 0; f < l; f++)
      a.setUint32(4 * f, u[f], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: a } = this;
    return t.destroyed = o, t.finished = s, t.length = i, t.pos = a, i % n && t.buffer.set(r), t;
  }
  clone() {
    return this._cloneInto();
  }
}
Ae.HashMD = ru;
Ae.SHA256_IV = Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
Ae.SHA224_IV = Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]);
Ae.SHA384_IV = Uint32Array.from([
  3418070365,
  3238371032,
  1654270250,
  914150663,
  2438529370,
  812702999,
  355462360,
  4144912697,
  1731405415,
  4290775857,
  2394180231,
  1750603025,
  3675008525,
  1694076839,
  1203062813,
  3204075428
]);
Ae.SHA512_IV = Uint32Array.from([
  1779033703,
  4089235720,
  3144134277,
  2227873595,
  1013904242,
  4271175723,
  2773480762,
  1595750129,
  1359893119,
  2917565137,
  2600822924,
  725511199,
  528734635,
  4215389547,
  1541459225,
  327033209
]);
var V = {};
Object.defineProperty(V, "__esModule", { value: !0 });
V.toBig = V.shrSL = V.shrSH = V.rotrSL = V.rotrSH = V.rotrBL = V.rotrBH = V.rotr32L = V.rotr32H = V.rotlSL = V.rotlSH = V.rotlBL = V.rotlBH = V.add5L = V.add5H = V.add4L = V.add4H = V.add3L = V.add3H = void 0;
V.add = Po;
V.fromBig = Si;
V.split = Ao;
const Jn = /* @__PURE__ */ BigInt(2 ** 32 - 1), si = /* @__PURE__ */ BigInt(32);
function Si(e, t = !1) {
  return t ? { h: Number(e & Jn), l: Number(e >> si & Jn) } : { h: Number(e >> si & Jn) | 0, l: Number(e & Jn) | 0 };
}
function Ao(e, t = !1) {
  const n = e.length;
  let r = new Uint32Array(n), i = new Uint32Array(n);
  for (let s = 0; s < n; s++) {
    const { h: o, l: a } = Si(e[s], t);
    [r[s], i[s]] = [o, a];
  }
  return [r, i];
}
const Eo = (e, t) => BigInt(e >>> 0) << si | BigInt(t >>> 0);
V.toBig = Eo;
const vo = (e, t, n) => e >>> n;
V.shrSH = vo;
const Ho = (e, t, n) => e << 32 - n | t >>> n;
V.shrSL = Ho;
const Bo = (e, t, n) => e >>> n | t << 32 - n;
V.rotrSH = Bo;
const _o = (e, t, n) => e << 32 - n | t >>> n;
V.rotrSL = _o;
const Co = (e, t, n) => e << 64 - n | t >>> n - 32;
V.rotrBH = Co;
const Io = (e, t, n) => e >>> n - 32 | t << 64 - n;
V.rotrBL = Io;
const ko = (e, t) => t;
V.rotr32H = ko;
const To = (e, t) => e;
V.rotr32L = To;
const Uo = (e, t, n) => e << n | t >>> 32 - n;
V.rotlSH = Uo;
const $o = (e, t, n) => t << n | e >>> 32 - n;
V.rotlSL = $o;
const Lo = (e, t, n) => t << n - 32 | e >>> 64 - n;
V.rotlBH = Lo;
const Oo = (e, t, n) => e << n - 32 | t >>> 64 - n;
V.rotlBL = Oo;
function Po(e, t, n, r) {
  const i = (t >>> 0) + (r >>> 0);
  return { h: e + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const No = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0);
V.add3L = No;
const Fo = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0;
V.add3H = Fo;
const Mo = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0);
V.add4L = Mo;
const Do = (e, t, n, r, i) => t + n + r + i + (e / 2 ** 32 | 0) | 0;
V.add4H = Do;
const Ko = (e, t, n, r, i) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0);
V.add5L = Ko;
const zo = (e, t, n, r, i, s) => t + n + r + i + s + (e / 2 ** 32 | 0) | 0;
V.add5H = zo;
const iu = {
  fromBig: Si,
  split: Ao,
  toBig: Eo,
  shrSH: vo,
  shrSL: Ho,
  rotrSH: Bo,
  rotrSL: _o,
  rotrBH: Co,
  rotrBL: Io,
  rotr32H: ko,
  rotr32L: To,
  rotlSH: Uo,
  rotlSL: $o,
  rotlBH: Lo,
  rotlBL: Oo,
  add: Po,
  add3L: No,
  add3H: Fo,
  add4L: Mo,
  add4H: Do,
  add5H: zo,
  add5L: Ko
};
V.default = iu;
Object.defineProperty(se, "__esModule", { value: !0 });
se.sha512_224 = se.sha512_256 = se.sha384 = se.sha512 = se.sha224 = se.sha256 = se.SHA512_256 = se.SHA512_224 = se.SHA384 = se.SHA512 = se.SHA224 = se.SHA256 = void 0;
const R = Ae, W = V, le = Mt, su = /* @__PURE__ */ Uint32Array.from([
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
]), rt = /* @__PURE__ */ new Uint32Array(64);
let Ai = class extends R.HashMD {
  constructor(t = 32) {
    super(64, t, 8, !1), this.A = R.SHA256_IV[0] | 0, this.B = R.SHA256_IV[1] | 0, this.C = R.SHA256_IV[2] | 0, this.D = R.SHA256_IV[3] | 0, this.E = R.SHA256_IV[4] | 0, this.F = R.SHA256_IV[5] | 0, this.G = R.SHA256_IV[6] | 0, this.H = R.SHA256_IV[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: i, E: s, F: o, G: a, H: h } = this;
    return [t, n, r, i, s, o, a, h];
  }
  // prettier-ignore
  set(t, n, r, i, s, o, a, h) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = a | 0, this.H = h | 0;
  }
  process(t, n) {
    for (let f = 0; f < 16; f++, n += 4)
      rt[f] = t.getUint32(n, !1);
    for (let f = 16; f < 64; f++) {
      const g = rt[f - 15], p = rt[f - 2], v = (0, le.rotr)(g, 7) ^ (0, le.rotr)(g, 18) ^ g >>> 3, A = (0, le.rotr)(p, 17) ^ (0, le.rotr)(p, 19) ^ p >>> 10;
      rt[f] = A + rt[f - 7] + v + rt[f - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: h, G: l, H: u } = this;
    for (let f = 0; f < 64; f++) {
      const g = (0, le.rotr)(a, 6) ^ (0, le.rotr)(a, 11) ^ (0, le.rotr)(a, 25), p = u + g + (0, R.Chi)(a, h, l) + su[f] + rt[f] | 0, A = ((0, le.rotr)(r, 2) ^ (0, le.rotr)(r, 13) ^ (0, le.rotr)(r, 22)) + (0, R.Maj)(r, i, s) | 0;
      u = l, l = h, h = a, a = o + p | 0, o = s, s = i, i = r, r = p + A | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, h = h + this.F | 0, l = l + this.G | 0, u = u + this.H | 0, this.set(r, i, s, o, a, h, l, u);
  }
  roundClean() {
    (0, le.clean)(rt);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), (0, le.clean)(this.buffer);
  }
};
se.SHA256 = Ai;
let Ro = class extends Ai {
  constructor() {
    super(28), this.A = R.SHA224_IV[0] | 0, this.B = R.SHA224_IV[1] | 0, this.C = R.SHA224_IV[2] | 0, this.D = R.SHA224_IV[3] | 0, this.E = R.SHA224_IV[4] | 0, this.F = R.SHA224_IV[5] | 0, this.G = R.SHA224_IV[6] | 0, this.H = R.SHA224_IV[7] | 0;
  }
};
se.SHA224 = Ro;
const Vo = W.split([
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
].map((e) => BigInt(e))), ou = Vo[0], au = Vo[1], it = /* @__PURE__ */ new Uint32Array(80), st = /* @__PURE__ */ new Uint32Array(80);
let Tn = class extends R.HashMD {
  constructor(t = 64) {
    super(128, t, 16, !1), this.Ah = R.SHA512_IV[0] | 0, this.Al = R.SHA512_IV[1] | 0, this.Bh = R.SHA512_IV[2] | 0, this.Bl = R.SHA512_IV[3] | 0, this.Ch = R.SHA512_IV[4] | 0, this.Cl = R.SHA512_IV[5] | 0, this.Dh = R.SHA512_IV[6] | 0, this.Dl = R.SHA512_IV[7] | 0, this.Eh = R.SHA512_IV[8] | 0, this.El = R.SHA512_IV[9] | 0, this.Fh = R.SHA512_IV[10] | 0, this.Fl = R.SHA512_IV[11] | 0, this.Gh = R.SHA512_IV[12] | 0, this.Gl = R.SHA512_IV[13] | 0, this.Hh = R.SHA512_IV[14] | 0, this.Hl = R.SHA512_IV[15] | 0;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: h, Eh: l, El: u, Fh: f, Fl: g, Gh: p, Gl: v, Hh: A, Hl: C } = this;
    return [t, n, r, i, s, o, a, h, l, u, f, g, p, v, A, C];
  }
  // prettier-ignore
  set(t, n, r, i, s, o, a, h, l, u, f, g, p, v, A, C) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = h | 0, this.Eh = l | 0, this.El = u | 0, this.Fh = f | 0, this.Fl = g | 0, this.Gh = p | 0, this.Gl = v | 0, this.Hh = A | 0, this.Hl = C | 0;
  }
  process(t, n) {
    for (let E = 0; E < 16; E++, n += 4)
      it[E] = t.getUint32(n), st[E] = t.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const S = it[E - 15] | 0, B = st[E - 15] | 0, O = W.rotrSH(S, B, 1) ^ W.rotrSH(S, B, 8) ^ W.shrSH(S, B, 7), L = W.rotrSL(S, B, 1) ^ W.rotrSL(S, B, 8) ^ W.shrSL(S, B, 7), U = it[E - 2] | 0, F = st[E - 2] | 0, d = W.rotrSH(U, F, 19) ^ W.rotrBH(U, F, 61) ^ W.shrSH(U, F, 6), x = W.rotrSL(U, F, 19) ^ W.rotrBL(U, F, 61) ^ W.shrSL(U, F, 6), b = W.add4L(L, x, st[E - 7], st[E - 16]), y = W.add4H(b, O, d, it[E - 7], it[E - 16]);
      it[E] = y | 0, st[E] = b | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: h, Dh: l, Dl: u, Eh: f, El: g, Fh: p, Fl: v, Gh: A, Gl: C, Hh: $, Hl: N } = this;
    for (let E = 0; E < 80; E++) {
      const S = W.rotrSH(f, g, 14) ^ W.rotrSH(f, g, 18) ^ W.rotrBH(f, g, 41), B = W.rotrSL(f, g, 14) ^ W.rotrSL(f, g, 18) ^ W.rotrBL(f, g, 41), O = f & p ^ ~f & A, L = g & v ^ ~g & C, U = W.add5L(N, B, L, au[E], st[E]), F = W.add5H(U, $, S, O, ou[E], it[E]), d = U | 0, x = W.rotrSH(r, i, 28) ^ W.rotrBH(r, i, 34) ^ W.rotrBH(r, i, 39), b = W.rotrSL(r, i, 28) ^ W.rotrBL(r, i, 34) ^ W.rotrBL(r, i, 39), y = r & s ^ r & a ^ s & a, H = i & o ^ i & h ^ o & h;
      $ = A | 0, N = C | 0, A = p | 0, C = v | 0, p = f | 0, v = g | 0, { h: f, l: g } = W.add(l | 0, u | 0, F | 0, d | 0), l = a | 0, u = h | 0, a = s | 0, h = o | 0, s = r | 0, o = i | 0;
      const k = W.add3L(d, b, H);
      r = W.add3H(k, F, x, y), i = k | 0;
    }
    ({ h: r, l: i } = W.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = W.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: h } = W.add(this.Ch | 0, this.Cl | 0, a | 0, h | 0), { h: l, l: u } = W.add(this.Dh | 0, this.Dl | 0, l | 0, u | 0), { h: f, l: g } = W.add(this.Eh | 0, this.El | 0, f | 0, g | 0), { h: p, l: v } = W.add(this.Fh | 0, this.Fl | 0, p | 0, v | 0), { h: A, l: C } = W.add(this.Gh | 0, this.Gl | 0, A | 0, C | 0), { h: $, l: N } = W.add(this.Hh | 0, this.Hl | 0, $ | 0, N | 0), this.set(r, i, s, o, a, h, l, u, f, g, p, v, A, C, $, N);
  }
  roundClean() {
    (0, le.clean)(it, st);
  }
  destroy() {
    (0, le.clean)(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
se.SHA512 = Tn;
let jo = class extends Tn {
  constructor() {
    super(48), this.Ah = R.SHA384_IV[0] | 0, this.Al = R.SHA384_IV[1] | 0, this.Bh = R.SHA384_IV[2] | 0, this.Bl = R.SHA384_IV[3] | 0, this.Ch = R.SHA384_IV[4] | 0, this.Cl = R.SHA384_IV[5] | 0, this.Dh = R.SHA384_IV[6] | 0, this.Dl = R.SHA384_IV[7] | 0, this.Eh = R.SHA384_IV[8] | 0, this.El = R.SHA384_IV[9] | 0, this.Fh = R.SHA384_IV[10] | 0, this.Fl = R.SHA384_IV[11] | 0, this.Gh = R.SHA384_IV[12] | 0, this.Gl = R.SHA384_IV[13] | 0, this.Hh = R.SHA384_IV[14] | 0, this.Hl = R.SHA384_IV[15] | 0;
  }
};
se.SHA384 = jo;
const xe = /* @__PURE__ */ Uint32Array.from([
  2352822216,
  424955298,
  1944164710,
  2312950998,
  502970286,
  855612546,
  1738396948,
  1479516111,
  258812777,
  2077511080,
  2011393907,
  79989058,
  1067287976,
  1780299464,
  286451373,
  2446758561
]), me = /* @__PURE__ */ Uint32Array.from([
  573645204,
  4230739756,
  2673172387,
  3360449730,
  596883563,
  1867755857,
  2520282905,
  1497426621,
  2519219938,
  2827943907,
  3193839141,
  1401305490,
  721525244,
  746961066,
  246885852,
  2177182882
]);
let Go = class extends Tn {
  constructor() {
    super(28), this.Ah = xe[0] | 0, this.Al = xe[1] | 0, this.Bh = xe[2] | 0, this.Bl = xe[3] | 0, this.Ch = xe[4] | 0, this.Cl = xe[5] | 0, this.Dh = xe[6] | 0, this.Dl = xe[7] | 0, this.Eh = xe[8] | 0, this.El = xe[9] | 0, this.Fh = xe[10] | 0, this.Fl = xe[11] | 0, this.Gh = xe[12] | 0, this.Gl = xe[13] | 0, this.Hh = xe[14] | 0, this.Hl = xe[15] | 0;
  }
};
se.SHA512_224 = Go;
let Wo = class extends Tn {
  constructor() {
    super(32), this.Ah = me[0] | 0, this.Al = me[1] | 0, this.Bh = me[2] | 0, this.Bl = me[3] | 0, this.Ch = me[4] | 0, this.Cl = me[5] | 0, this.Dh = me[6] | 0, this.Dl = me[7] | 0, this.Eh = me[8] | 0, this.El = me[9] | 0, this.Fh = me[10] | 0, this.Fl = me[11] | 0, this.Gh = me[12] | 0, this.Gl = me[13] | 0, this.Hh = me[14] | 0, this.Hl = me[15] | 0;
  }
};
se.SHA512_256 = Wo;
se.sha256 = (0, le.createHasher)(() => new Ai());
se.sha224 = (0, le.createHasher)(() => new Ro());
se.sha512 = (0, le.createHasher)(() => new Tn());
se.sha384 = (0, le.createHasher)(() => new jo());
se.sha512_256 = (0, le.createHasher)(() => new Wo());
se.sha512_224 = (0, le.createHasher)(() => new Go());
Object.defineProperty(Pe, "__esModule", { value: !0 });
Pe.sha224 = Pe.SHA224 = Pe.sha256 = Pe.SHA256 = void 0;
const Er = se;
Pe.SHA256 = Er.SHA256;
Pe.sha256 = Er.sha256;
Pe.SHA224 = Er.SHA224;
Pe.sha224 = Er.sha224;
Object.defineProperty(Pt, "__esModule", { value: !0 });
Pt.c32checkDecode = Pt.c32checkEncode = void 0;
const Ns = Pe, Fs = Mt, Hn = mi;
function qo(e) {
  const t = (0, Ns.sha256)((0, Ns.sha256)((0, Fs.hexToBytes)(e)));
  return (0, Fs.bytesToHex)(t.slice(0, 4));
}
function cu(e, t) {
  if (e < 0 || e >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!t.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  t = t.toLowerCase(), t.length % 2 !== 0 && (t = `0${t}`);
  let n = e.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = qo(`${n}${t}`), i = (0, Hn.c32encode)(`${t}${r}`);
  return `${Hn.c32[e]}${i}`;
}
Pt.c32checkEncode = cu;
function hu(e) {
  e = (0, Hn.c32normalize)(e);
  const t = (0, Hn.c32decode)(e.slice(1)), n = e[0], r = Hn.c32.indexOf(n), i = t.slice(-8);
  let s = r.toString(16);
  if (s.length === 1 && (s = `0${s}`), qo(`${s}${t.substring(0, t.length - 8)}`) !== i)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, t.substring(0, t.length - 8)];
}
Pt.c32checkDecode = hu;
var Xo = {}, on = {};
function fu(e) {
  if (e.length >= 255)
    throw new TypeError("Alphabet too long");
  for (var t = new Uint8Array(256), n = 0; n < t.length; n++)
    t[n] = 255;
  for (var r = 0; r < e.length; r++) {
    var i = e.charAt(r), s = i.charCodeAt(0);
    if (t[s] !== 255)
      throw new TypeError(i + " is ambiguous");
    t[s] = r;
  }
  var o = e.length, a = e.charAt(0), h = Math.log(o) / Math.log(256), l = Math.log(256) / Math.log(o);
  function u(p) {
    if (p instanceof Uint8Array || (ArrayBuffer.isView(p) ? p = new Uint8Array(p.buffer, p.byteOffset, p.byteLength) : Array.isArray(p) && (p = Uint8Array.from(p))), !(p instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (p.length === 0)
      return "";
    for (var v = 0, A = 0, C = 0, $ = p.length; C !== $ && p[C] === 0; )
      C++, v++;
    for (var N = ($ - C) * l + 1 >>> 0, E = new Uint8Array(N); C !== $; ) {
      for (var S = p[C], B = 0, O = N - 1; (S !== 0 || B < A) && O !== -1; O--, B++)
        S += 256 * E[O] >>> 0, E[O] = S % o >>> 0, S = S / o >>> 0;
      if (S !== 0)
        throw new Error("Non-zero carry");
      A = B, C++;
    }
    for (var L = N - A; L !== N && E[L] === 0; )
      L++;
    for (var U = a.repeat(v); L < N; ++L)
      U += e.charAt(E[L]);
    return U;
  }
  function f(p) {
    if (typeof p != "string")
      throw new TypeError("Expected String");
    if (p.length === 0)
      return new Uint8Array();
    for (var v = 0, A = 0, C = 0; p[v] === a; )
      A++, v++;
    for (var $ = (p.length - v) * h + 1 >>> 0, N = new Uint8Array($); p[v]; ) {
      var E = p.charCodeAt(v);
      if (E > 255)
        return;
      var S = t[E];
      if (S === 255)
        return;
      for (var B = 0, O = $ - 1; (S !== 0 || B < C) && O !== -1; O--, B++)
        S += o * N[O] >>> 0, N[O] = S % 256 >>> 0, S = S / 256 >>> 0;
      if (S !== 0)
        throw new Error("Non-zero carry");
      C = B, v++;
    }
    for (var L = $ - C; L !== $ && N[L] === 0; )
      L++;
    for (var U = new Uint8Array(A + ($ - L)), F = A; L !== $; )
      U[F++] = N[L++];
    return U;
  }
  function g(p) {
    var v = f(p);
    if (v)
      return v;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: u,
    decodeUnsafe: f,
    decode: g
  };
}
var uu = fu;
Object.defineProperty(on, "__esModule", { value: !0 });
on.decode = on.encode = void 0;
const fr = Pe, Ms = Mt, Zo = uu, Yo = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function lu(e, t = "00") {
  const n = typeof e == "string" ? (0, Ms.hexToBytes)(e) : e, r = typeof t == "string" ? (0, Ms.hexToBytes)(t) : e;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const i = (0, fr.sha256)((0, fr.sha256)(new Uint8Array([...r, ...n])));
  return Zo(Yo).encode([...r, ...n, ...i.slice(0, 4)]);
}
on.encode = lu;
function du(e) {
  const t = Zo(Yo).decode(e), n = t.slice(0, 1), r = t.slice(1, -4), i = (0, fr.sha256)((0, fr.sha256)(new Uint8Array([...n, ...r])));
  return t.slice(-4).forEach((s, o) => {
    if (s !== i[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
on.decode = du;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32ToB58 = e.b58ToC32 = e.c32addressDecode = e.c32address = e.versions = void 0;
  const t = Pt, n = on, r = Mt;
  e.versions = {
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
  const i = {};
  i[0] = e.versions.mainnet.p2pkh, i[5] = e.versions.mainnet.p2sh, i[111] = e.versions.testnet.p2pkh, i[196] = e.versions.testnet.p2sh;
  const s = {};
  s[e.versions.mainnet.p2pkh] = 0, s[e.versions.mainnet.p2sh] = 5, s[e.versions.testnet.p2pkh] = 111, s[e.versions.testnet.p2sh] = 196;
  function o(u, f) {
    if (!f.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, t.c32checkEncode)(u, f)}`;
  }
  e.c32address = o;
  function a(u) {
    if (u.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (u[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, t.c32checkDecode)(u.slice(1));
  }
  e.c32addressDecode = a;
  function h(u, f = -1) {
    const g = n.decode(u), p = (0, r.bytesToHex)(g.data), v = parseInt((0, r.bytesToHex)(g.prefix), 16);
    let A;
    return f < 0 ? (A = v, i[v] !== void 0 && (A = i[v])) : A = f, o(A, p);
  }
  e.b58ToC32 = h;
  function l(u, f = -1) {
    const g = a(u), p = g[0], v = g[1];
    let A;
    f < 0 ? (A = p, s[p] !== void 0 && (A = s[p])) : A = f;
    let C = A.toString(16);
    return C.length === 1 && (C = `0${C}`), n.encode(v, C);
  }
  e.c32ToB58 = l;
})(Xo);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.b58ToC32 = e.c32ToB58 = e.versions = e.c32normalize = e.c32addressDecode = e.c32address = e.c32checkDecode = e.c32checkEncode = e.c32decode = e.c32encode = void 0;
  const t = mi;
  Object.defineProperty(e, "c32encode", { enumerable: !0, get: function() {
    return t.c32encode;
  } }), Object.defineProperty(e, "c32decode", { enumerable: !0, get: function() {
    return t.c32decode;
  } }), Object.defineProperty(e, "c32normalize", { enumerable: !0, get: function() {
    return t.c32normalize;
  } });
  const n = Pt;
  Object.defineProperty(e, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(e, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Xo;
  Object.defineProperty(e, "c32address", { enumerable: !0, get: function() {
    return r.c32address;
  } }), Object.defineProperty(e, "c32addressDecode", { enumerable: !0, get: function() {
    return r.c32addressDecode;
  } }), Object.defineProperty(e, "c32ToB58", { enumerable: !0, get: function() {
    return r.c32ToB58;
  } }), Object.defineProperty(e, "b58ToC32", { enumerable: !0, get: function() {
    return r.b58ToC32;
  } }), Object.defineProperty(e, "versions", { enumerable: !0, get: function() {
    return r.versions;
  } });
})(gn);
var ur = { exports: {} };
ur.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", i = 9007199254740991, s = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", h = "[object Date]", l = "[object Error]", u = "[object Function]", f = "[object GeneratorFunction]", g = "[object Map]", p = "[object Number]", v = "[object Object]", A = "[object Promise]", C = "[object RegExp]", $ = "[object Set]", N = "[object String]", E = "[object Symbol]", S = "[object WeakMap]", B = "[object ArrayBuffer]", O = "[object DataView]", L = "[object Float32Array]", U = "[object Float64Array]", F = "[object Int8Array]", d = "[object Int16Array]", x = "[object Int32Array]", b = "[object Uint8Array]", y = "[object Uint8ClampedArray]", H = "[object Uint16Array]", k = "[object Uint32Array]", D = /[\\^$.*+?()[\]{}|]/g, z = /\w*$/, j = /^\[object .+?Constructor\]$/, w = /^(?:0|[1-9]\d*)$/, I = {};
  I[s] = I[o] = I[B] = I[O] = I[a] = I[h] = I[L] = I[U] = I[F] = I[d] = I[x] = I[g] = I[p] = I[v] = I[C] = I[$] = I[N] = I[E] = I[b] = I[y] = I[H] = I[k] = !0, I[l] = I[u] = I[S] = !1;
  var ne = typeof Ut == "object" && Ut && Ut.Object === Object && Ut, Q = typeof self == "object" && self && self.Object === Object && self, K = ne || Q || Function("return this")(), J = t && !t.nodeType && t, pe = J && !0 && e && !e.nodeType && e, Ie = pe && pe.exports === J;
  function Ve(c, m) {
    return c.set(m[0], m[1]), c;
  }
  function Et(c, m) {
    return c.add(m), c;
  }
  function Nn(c, m) {
    for (var _ = -1, M = c ? c.length : 0; ++_ < M && m(c[_], _, c) !== !1; )
      ;
    return c;
  }
  function Fn(c, m) {
    for (var _ = -1, M = m.length, ge = c.length; ++_ < M; )
      c[ge + _] = m[_];
    return c;
  }
  function qi(c, m, _, M) {
    for (var ge = -1, Ee = c ? c.length : 0; ++ge < Ee; )
      _ = m(_, c[ge], ge, c);
    return _;
  }
  function dc(c, m) {
    for (var _ = -1, M = Array(c); ++_ < c; )
      M[_] = m(_);
    return M;
  }
  function bc(c, m) {
    return c == null ? void 0 : c[m];
  }
  function Xi(c) {
    var m = !1;
    if (c != null && typeof c.toString != "function")
      try {
        m = !!(c + "");
      } catch {
      }
    return m;
  }
  function Zi(c) {
    var m = -1, _ = Array(c.size);
    return c.forEach(function(M, ge) {
      _[++m] = [ge, M];
    }), _;
  }
  function Ir(c, m) {
    return function(_) {
      return c(m(_));
    };
  }
  function Yi(c) {
    var m = -1, _ = Array(c.size);
    return c.forEach(function(M) {
      _[++m] = M;
    }), _;
  }
  var pc = Array.prototype, gc = Function.prototype, Mn = Object.prototype, kr = K["__core-js_shared__"], Ji = function() {
    var c = /[^.]+$/.exec(kr && kr.keys && kr.keys.IE_PROTO || "");
    return c ? "Symbol(src)_1." + c : "";
  }(), Qi = gc.toString, Je = Mn.hasOwnProperty, Dn = Mn.toString, yc = RegExp(
    "^" + Qi.call(Je).replace(D, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), es = Ie ? K.Buffer : void 0, ts = K.Symbol, ns = K.Uint8Array, wc = Ir(Object.getPrototypeOf, Object), xc = Object.create, mc = Mn.propertyIsEnumerable, Sc = pc.splice, rs = Object.getOwnPropertySymbols, Ac = es ? es.isBuffer : void 0, Ec = Ir(Object.keys, Object), Tr = Vt(K, "DataView"), yn = Vt(K, "Map"), Ur = Vt(K, "Promise"), $r = Vt(K, "Set"), Lr = Vt(K, "WeakMap"), wn = Vt(Object, "create"), vc = Bt(Tr), Hc = Bt(yn), Bc = Bt(Ur), _c = Bt($r), Cc = Bt(Lr), is = ts ? ts.prototype : void 0, ss = is ? is.valueOf : void 0;
  function vt(c) {
    var m = -1, _ = c ? c.length : 0;
    for (this.clear(); ++m < _; ) {
      var M = c[m];
      this.set(M[0], M[1]);
    }
  }
  function Ic() {
    this.__data__ = wn ? wn(null) : {};
  }
  function kc(c) {
    return this.has(c) && delete this.__data__[c];
  }
  function Tc(c) {
    var m = this.__data__;
    if (wn) {
      var _ = m[c];
      return _ === r ? void 0 : _;
    }
    return Je.call(m, c) ? m[c] : void 0;
  }
  function Uc(c) {
    var m = this.__data__;
    return wn ? m[c] !== void 0 : Je.call(m, c);
  }
  function $c(c, m) {
    var _ = this.__data__;
    return _[c] = wn && m === void 0 ? r : m, this;
  }
  vt.prototype.clear = Ic, vt.prototype.delete = kc, vt.prototype.get = Tc, vt.prototype.has = Uc, vt.prototype.set = $c;
  function je(c) {
    var m = -1, _ = c ? c.length : 0;
    for (this.clear(); ++m < _; ) {
      var M = c[m];
      this.set(M[0], M[1]);
    }
  }
  function Lc() {
    this.__data__ = [];
  }
  function Oc(c) {
    var m = this.__data__, _ = Kn(m, c);
    if (_ < 0)
      return !1;
    var M = m.length - 1;
    return _ == M ? m.pop() : Sc.call(m, _, 1), !0;
  }
  function Pc(c) {
    var m = this.__data__, _ = Kn(m, c);
    return _ < 0 ? void 0 : m[_][1];
  }
  function Nc(c) {
    return Kn(this.__data__, c) > -1;
  }
  function Fc(c, m) {
    var _ = this.__data__, M = Kn(_, c);
    return M < 0 ? _.push([c, m]) : _[M][1] = m, this;
  }
  je.prototype.clear = Lc, je.prototype.delete = Oc, je.prototype.get = Pc, je.prototype.has = Nc, je.prototype.set = Fc;
  function zt(c) {
    var m = -1, _ = c ? c.length : 0;
    for (this.clear(); ++m < _; ) {
      var M = c[m];
      this.set(M[0], M[1]);
    }
  }
  function Mc() {
    this.__data__ = {
      hash: new vt(),
      map: new (yn || je)(),
      string: new vt()
    };
  }
  function Dc(c) {
    return zn(this, c).delete(c);
  }
  function Kc(c) {
    return zn(this, c).get(c);
  }
  function zc(c) {
    return zn(this, c).has(c);
  }
  function Rc(c, m) {
    return zn(this, c).set(c, m), this;
  }
  zt.prototype.clear = Mc, zt.prototype.delete = Dc, zt.prototype.get = Kc, zt.prototype.has = zc, zt.prototype.set = Rc;
  function Rt(c) {
    this.__data__ = new je(c);
  }
  function Vc() {
    this.__data__ = new je();
  }
  function jc(c) {
    return this.__data__.delete(c);
  }
  function Gc(c) {
    return this.__data__.get(c);
  }
  function Wc(c) {
    return this.__data__.has(c);
  }
  function qc(c, m) {
    var _ = this.__data__;
    if (_ instanceof je) {
      var M = _.__data__;
      if (!yn || M.length < n - 1)
        return M.push([c, m]), this;
      _ = this.__data__ = new zt(M);
    }
    return _.set(c, m), this;
  }
  Rt.prototype.clear = Vc, Rt.prototype.delete = jc, Rt.prototype.get = Gc, Rt.prototype.has = Wc, Rt.prototype.set = qc;
  function Xc(c, m) {
    var _ = Nr(c) || xh(c) ? dc(c.length, String) : [], M = _.length, ge = !!M;
    for (var Ee in c)
      Je.call(c, Ee) && !(ge && (Ee == "length" || ph(Ee, M))) && _.push(Ee);
    return _;
  }
  function os(c, m, _) {
    var M = c[m];
    (!(Je.call(c, m) && fs(M, _)) || _ === void 0 && !(m in c)) && (c[m] = _);
  }
  function Kn(c, m) {
    for (var _ = c.length; _--; )
      if (fs(c[_][0], m))
        return _;
    return -1;
  }
  function Zc(c, m) {
    return c && as(m, Fr(m), c);
  }
  function Or(c, m, _, M, ge, Ee, Ge) {
    var ve;
    if (M && (ve = Ee ? M(c, ge, Ee, Ge) : M(c)), ve !== void 0)
      return ve;
    if (!Rn(c))
      return c;
    var ds = Nr(c);
    if (ds) {
      if (ve = lh(c), !m)
        return hh(c, ve);
    } else {
      var jt = Ht(c), bs = jt == u || jt == f;
      if (Sh(c))
        return nh(c, m);
      if (jt == v || jt == s || bs && !Ee) {
        if (Xi(c))
          return Ee ? c : {};
        if (ve = dh(bs ? {} : c), !m)
          return fh(c, Zc(ve, c));
      } else {
        if (!I[jt])
          return Ee ? c : {};
        ve = bh(c, jt, Or, m);
      }
    }
    Ge || (Ge = new Rt());
    var ps = Ge.get(c);
    if (ps)
      return ps;
    if (Ge.set(c, ve), !ds)
      var gs = _ ? uh(c) : Fr(c);
    return Nn(gs || c, function(Mr, Vn) {
      gs && (Vn = Mr, Mr = c[Vn]), os(ve, Vn, Or(Mr, m, _, M, Vn, c, Ge));
    }), ve;
  }
  function Yc(c) {
    return Rn(c) ? xc(c) : {};
  }
  function Jc(c, m, _) {
    var M = m(c);
    return Nr(c) ? M : Fn(M, _(c));
  }
  function Qc(c) {
    return Dn.call(c);
  }
  function eh(c) {
    if (!Rn(c) || yh(c))
      return !1;
    var m = ls(c) || Xi(c) ? yc : j;
    return m.test(Bt(c));
  }
  function th(c) {
    if (!hs(c))
      return Ec(c);
    var m = [];
    for (var _ in Object(c))
      Je.call(c, _) && _ != "constructor" && m.push(_);
    return m;
  }
  function nh(c, m) {
    if (m)
      return c.slice();
    var _ = new c.constructor(c.length);
    return c.copy(_), _;
  }
  function Pr(c) {
    var m = new c.constructor(c.byteLength);
    return new ns(m).set(new ns(c)), m;
  }
  function rh(c, m) {
    var _ = m ? Pr(c.buffer) : c.buffer;
    return new c.constructor(_, c.byteOffset, c.byteLength);
  }
  function ih(c, m, _) {
    var M = m ? _(Zi(c), !0) : Zi(c);
    return qi(M, Ve, new c.constructor());
  }
  function sh(c) {
    var m = new c.constructor(c.source, z.exec(c));
    return m.lastIndex = c.lastIndex, m;
  }
  function oh(c, m, _) {
    var M = m ? _(Yi(c), !0) : Yi(c);
    return qi(M, Et, new c.constructor());
  }
  function ah(c) {
    return ss ? Object(ss.call(c)) : {};
  }
  function ch(c, m) {
    var _ = m ? Pr(c.buffer) : c.buffer;
    return new c.constructor(_, c.byteOffset, c.length);
  }
  function hh(c, m) {
    var _ = -1, M = c.length;
    for (m || (m = Array(M)); ++_ < M; )
      m[_] = c[_];
    return m;
  }
  function as(c, m, _, M) {
    _ || (_ = {});
    for (var ge = -1, Ee = m.length; ++ge < Ee; ) {
      var Ge = m[ge], ve = void 0;
      os(_, Ge, ve === void 0 ? c[Ge] : ve);
    }
    return _;
  }
  function fh(c, m) {
    return as(c, cs(c), m);
  }
  function uh(c) {
    return Jc(c, Fr, cs);
  }
  function zn(c, m) {
    var _ = c.__data__;
    return gh(m) ? _[typeof m == "string" ? "string" : "hash"] : _.map;
  }
  function Vt(c, m) {
    var _ = bc(c, m);
    return eh(_) ? _ : void 0;
  }
  var cs = rs ? Ir(rs, Object) : vh, Ht = Qc;
  (Tr && Ht(new Tr(new ArrayBuffer(1))) != O || yn && Ht(new yn()) != g || Ur && Ht(Ur.resolve()) != A || $r && Ht(new $r()) != $ || Lr && Ht(new Lr()) != S) && (Ht = function(c) {
    var m = Dn.call(c), _ = m == v ? c.constructor : void 0, M = _ ? Bt(_) : void 0;
    if (M)
      switch (M) {
        case vc:
          return O;
        case Hc:
          return g;
        case Bc:
          return A;
        case _c:
          return $;
        case Cc:
          return S;
      }
    return m;
  });
  function lh(c) {
    var m = c.length, _ = c.constructor(m);
    return m && typeof c[0] == "string" && Je.call(c, "index") && (_.index = c.index, _.input = c.input), _;
  }
  function dh(c) {
    return typeof c.constructor == "function" && !hs(c) ? Yc(wc(c)) : {};
  }
  function bh(c, m, _, M) {
    var ge = c.constructor;
    switch (m) {
      case B:
        return Pr(c);
      case a:
      case h:
        return new ge(+c);
      case O:
        return rh(c, M);
      case L:
      case U:
      case F:
      case d:
      case x:
      case b:
      case y:
      case H:
      case k:
        return ch(c, M);
      case g:
        return ih(c, M, _);
      case p:
      case N:
        return new ge(c);
      case C:
        return sh(c);
      case $:
        return oh(c, M, _);
      case E:
        return ah(c);
    }
  }
  function ph(c, m) {
    return m = m ?? i, !!m && (typeof c == "number" || w.test(c)) && c > -1 && c % 1 == 0 && c < m;
  }
  function gh(c) {
    var m = typeof c;
    return m == "string" || m == "number" || m == "symbol" || m == "boolean" ? c !== "__proto__" : c === null;
  }
  function yh(c) {
    return !!Ji && Ji in c;
  }
  function hs(c) {
    var m = c && c.constructor, _ = typeof m == "function" && m.prototype || Mn;
    return c === _;
  }
  function Bt(c) {
    if (c != null) {
      try {
        return Qi.call(c);
      } catch {
      }
      try {
        return c + "";
      } catch {
      }
    }
    return "";
  }
  function wh(c) {
    return Or(c, !0, !0);
  }
  function fs(c, m) {
    return c === m || c !== c && m !== m;
  }
  function xh(c) {
    return mh(c) && Je.call(c, "callee") && (!mc.call(c, "callee") || Dn.call(c) == s);
  }
  var Nr = Array.isArray;
  function us(c) {
    return c != null && Ah(c.length) && !ls(c);
  }
  function mh(c) {
    return Eh(c) && us(c);
  }
  var Sh = Ac || Hh;
  function ls(c) {
    var m = Rn(c) ? Dn.call(c) : "";
    return m == u || m == f;
  }
  function Ah(c) {
    return typeof c == "number" && c > -1 && c % 1 == 0 && c <= i;
  }
  function Rn(c) {
    var m = typeof c;
    return !!c && (m == "object" || m == "function");
  }
  function Eh(c) {
    return !!c && typeof c == "object";
  }
  function Fr(c) {
    return us(c) ? Xc(c) : th(c);
  }
  function vh() {
    return [];
  }
  function Hh() {
    return !1;
  }
  e.exports = wh;
})(ur, ur.exports);
var bu = ur.exports, pu = /* @__PURE__ */ eu(bu);
function gu(e) {
  if (ce(e).byteLength != mr)
    throw Error("Invalid signature");
  return {
    type: Z.MessageSignature,
    data: e
  };
}
function yu(e, t) {
  switch (e) {
    case Y.SerializeP2PKH:
      switch (t) {
        case He.Mainnet:
          return Le.MainnetSingleSig;
        case He.Testnet:
          return Le.TestnetSingleSig;
        default:
          throw new Error(`Unexpected txVersion ${JSON.stringify(t)} for hashMode ${e}`);
      }
    case Y.SerializeP2SH:
    case Y.SerializeP2SHNonSequential:
    case Y.SerializeP2WPKH:
    case Y.SerializeP2WSH:
    case Y.SerializeP2WSHNonSequential:
      switch (t) {
        case He.Mainnet:
          return Le.MainnetMultiSig;
        case He.Testnet:
          return Le.TestnetMultiSig;
        default:
          throw new Error(`Unexpected txVersion ${JSON.stringify(t)} for hashMode ${e}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${JSON.stringify(e)}`);
  }
}
function Sn(e, t) {
  return { type: Z.Address, version: e, hash160: t };
}
function oi(e) {
  return gn.c32address(e.version, e.hash160);
}
function an(e, t, n) {
  const r = t || 1, i = n || zh;
  if (la(e, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: Z.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: i
  };
}
function At(e) {
  const t = gn.c32addressDecode(e);
  return {
    type: Z.Address,
    version: t[0],
    hash160: t[1]
  };
}
function wu(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return xu(t, n);
  } else
    return Jo(e);
}
function xu(e, t) {
  const n = At(e), r = an(t);
  return {
    type: Z.Principal,
    prefix: _n.Contract,
    address: n,
    contractName: r
  };
}
function Jo(e) {
  const t = At(e);
  return {
    type: Z.Principal,
    prefix: _n.Standard,
    address: t
  };
}
var T;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(T || (T = {}));
function mu(e) {
  if (e.type === T.PrincipalStandard)
    return oi(e.address);
  if (e.type === T.PrincipalContract)
    return `${oi(e.address)}.${e.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(e)}`);
}
function Su(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return vu(t, n);
  } else
    return Au(e);
}
function Au(e) {
  const t = At(e);
  return { type: T.PrincipalStandard, address: t };
}
function Eu(e) {
  return { type: T.PrincipalStandard, address: e };
}
function vu(e, t) {
  const n = At(e), r = an(t);
  return Qo(n, r);
}
function Qo(e, t) {
  if (bn(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: T.PrincipalContract, address: e, contractName: t };
}
function Vr(e, t = !1) {
  switch (e.type) {
    case T.BoolTrue:
      return !0;
    case T.BoolFalse:
      return !1;
    case T.Int:
    case T.UInt:
      return t ? e.value.toString() : e.value;
    case T.Buffer:
      return `0x${oe(e.buffer)}`;
    case T.OptionalNone:
      return null;
    case T.OptionalSome:
      return Wt(e.value);
    case T.ResponseErr:
      return Wt(e.value);
    case T.ResponseOk:
      return Wt(e.value);
    case T.PrincipalStandard:
    case T.PrincipalContract:
      return mu(e);
    case T.List:
      return e.list.map((r) => Wt(r));
    case T.Tuple:
      const n = {};
      return Object.keys(e.data).forEach((r) => {
        n[r] = Wt(e.data[r]);
      }), n;
    case T.StringASCII:
      return e.data;
    case T.StringUTF8:
      return e.data;
  }
}
function Wt(e) {
  switch (e.type) {
    case T.ResponseErr:
      return { type: Xe(e), value: Vr(e, !0), success: !1 };
    case T.ResponseOk:
      return { type: Xe(e), value: Vr(e, !0), success: !0 };
    default:
      return { type: Xe(e), value: Vr(e, !0) };
  }
}
function Xe(e) {
  switch (e.type) {
    case T.BoolTrue:
    case T.BoolFalse:
      return "bool";
    case T.Int:
      return "int";
    case T.UInt:
      return "uint";
    case T.Buffer:
      return `(buff ${e.buffer.length})`;
    case T.OptionalNone:
      return "(optional none)";
    case T.OptionalSome:
      return `(optional ${Xe(e.value)})`;
    case T.ResponseErr:
      return `(response UnknownType ${Xe(e.value)})`;
    case T.ResponseOk:
      return `(response ${Xe(e.value)} UnknownType)`;
    case T.PrincipalStandard:
    case T.PrincipalContract:
      return "principal";
    case T.List:
      return `(list ${e.list.length} ${e.list.length ? Xe(e.list[0]) : "UnknownType"})`;
    case T.Tuple:
      return `(tuple ${Object.keys(e.data).map((t) => `(${t} ${Xe(e.data[t])})`).join(" ")})`;
    case T.StringASCII:
      return `(string-ascii ${so(e.data).length})`;
    case T.StringUTF8:
      return `(string-utf8 ${bn(e.data).length})`;
  }
}
const Hu = () => ({ type: T.BoolTrue }), Bu = () => ({ type: T.BoolFalse }), Ds = BigInt("0xffffffffffffffffffffffffffffffff"), _u = BigInt(0), Ks = BigInt("0x7fffffffffffffffffffffffffffffff"), zs = BigInt("-170141183460469231731687303715884105728"), Cu = (e) => {
  const t = we(e, !0);
  if (t > Ks)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Ks}`);
  if (t < zs)
    throw new RangeError(`Cannot construct clarity integer form value less than ${zs}`);
  return { type: T.Int, value: t };
}, ea = (e) => {
  const t = we(e, !1);
  if (t < _u)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > Ds)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Ds}`);
  return { type: T.UInt, value: t };
}, ta = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: T.Buffer, buffer: e };
};
function na() {
  return { type: T.OptionalNone };
}
function ra(e) {
  return { type: T.OptionalSome, value: e };
}
function Iu(e) {
  return { type: T.ResponseErr, value: e };
}
function ku(e) {
  return { type: T.ResponseOk, value: e };
}
function Tu(e) {
  return { type: T.List, list: e };
}
function Uu(e) {
  for (const t in e)
    if (!ul(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: T.Tuple, data: e };
}
const $u = (e) => ({ type: T.StringASCII, data: e }), Lu = (e) => ({ type: T.StringUTF8, data: e });
let ia = class extends ho {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Tt.hash(t);
    const r = bi(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const i = this.blockLen, s = new Uint8Array(i);
    s.set(r.length > i ? t.create().update(r).digest() : r);
    for (let o = 0; o < s.length; o++)
      s[o] ^= 54;
    this.iHash.update(s), this.oHash = t.create();
    for (let o = 0; o < s.length; o++)
      s[o] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(t) {
    return Tt.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Tt.exists(this), Tt.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: i, destroyed: s, blockLen: o, outputLen: a } = this;
    return t = t, t.finished = i, t.destroyed = s, t.blockLen = o, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const sa = (e, t, n) => new ia(e, t).update(n).digest();
sa.create = (e, t) => new ia(e, t);
Be.hmacSha256Sync = (e, ...t) => {
  const n = sa.create(wi, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Ou(e, t = He.Mainnet) {
  const n = Ei(e);
  return Pu(n.data, t);
}
function Pu(e, t = He.Mainnet) {
  e = typeof e == "string" ? e : oe(e);
  const n = yu(Y.SerializeP2PKH, t), r = Sn(n, da(ce(e)));
  return oi(r);
}
function mt(e) {
  return {
    type: Z.PublicKey,
    data: ce(e)
  };
}
function Nu(e, t, n = ye.Compressed) {
  const r = Lh(t.data), i = new Ne(ys(r.r), ys(r.s)), s = te.fromSignature(e, i, r.recoveryId), o = n === ye.Compressed;
  return s.toHex(o);
}
function Fu(e) {
  return { type: Z.PublicKey, data: e };
}
function Un(e) {
  return !oe(e.data).startsWith("04");
}
function oa(e) {
  return oe(e.data);
}
function lr(e) {
  return e.data.slice();
}
function Ei(e) {
  const t = cn(e), n = yo(t.data.slice(0, 32), t.compressed);
  return mt(oe(n));
}
function Mu(e) {
  const t = typeof e == "string" ? e : oe(e), n = te.fromHex(t).toHex(!0);
  return mt(n);
}
function cn(e) {
  const t = Oh(e), n = t.length == oo;
  return { data: t, compressed: n };
}
function Du(e, t) {
  const [n, r] = mo(t, e.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const s = kn(r, 1) + Ne.fromHex(n).toCompactHex();
  return gu(s);
}
function vi(e) {
  return Ei(e.data);
}
function Ku(e, t, n) {
  return typeof e == "string" && (e = Su(e)), typeof n == "string" && (n = Ws(n)), {
    type: Z.Payload,
    payloadType: fe.TokenTransfer,
    recipient: e,
    amount: we(t, !1),
    memo: n ?? Ws("")
  };
}
function zu(e, t, n, r) {
  return typeof e == "string" && (e = At(e)), typeof t == "string" && (t = an(t)), typeof n == "string" && (n = an(n)), {
    type: Z.Payload,
    payloadType: fe.ContractCall,
    contractAddress: e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
var Rs;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended";
})(Rs || (Rs = {}));
function Hi(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case fe.TokenTransfer:
      t.push(ze(e.recipient)), t.push(xt(e.amount, !1, 8)), t.push(qe(e.memo));
      break;
    case fe.ContractCall:
      t.push(qe(e.contractAddress)), t.push(qe(e.contractName)), t.push(qe(e.functionName));
      const n = new Uint8Array(4);
      Ot(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(ze(r));
      });
      break;
    case fe.SmartContract:
      t.push(qe(e.contractName)), t.push(qe(e.codeBody));
      break;
    case fe.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(qe(e.contractName)), t.push(qe(e.codeBody));
      break;
    case fe.PoisonMicroblock:
      break;
    case fe.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case fe.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(ze(e.recipient));
      break;
    case fe.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(ze(e.recipient ? ra(e.recipient) : na())), t.push(e.vrfProof);
      break;
    case fe.TenureChange:
      t.push(ce(e.tenureHash)), t.push(ce(e.previousTenureHash)), t.push(ce(e.burnViewHash)), t.push(ce(e.previousTenureEnd)), t.push(Ot(new Uint8Array(4), e.previousTenureBlocks)), t.push(Mh(new Uint8Array(1), e.cause)), t.push(ce(e.publicKeyHash));
      break;
  }
  return de(t);
}
class $n extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Ct extends $n {
  constructor(t) {
    super(t);
  }
}
class jr extends $n {
  constructor(t) {
    super(t);
  }
}
class aa extends $n {
  constructor(t) {
    super(t);
  }
}
class Ke extends $n {
  constructor(t) {
    super(t);
  }
}
class An extends $n {
  constructor(t) {
    super(t);
  }
}
var Yt;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Yt || (Yt = {}));
function Vs(e, t) {
  return {
    pubKeyEncoding: e,
    type: Z.TransactionAuthField,
    contents: t
  };
}
function Bi(e) {
  return ce(e.data);
}
function Ru(e) {
  const t = [];
  switch (e.contents.type) {
    case Z.PublicKey:
      t.push(e.pubKeyEncoding === ye.Compressed ? Yt.PublicKeyCompressed : Yt.PublicKeyUncompressed), t.push(lr(Mu(e.contents.data)));
      break;
    case Z.MessageSignature:
      t.push(e.pubKeyEncoding === ye.Compressed ? Yt.SignatureCompressed : Yt.SignatureUncompressed), t.push(Bi(e.contents));
      break;
  }
  return de(t);
}
function qe(e) {
  switch (e.type) {
    case Z.Address:
      return Ln(e);
    case Z.Principal:
      return ca(e);
    case Z.LengthPrefixedString:
      return fn(e);
    case Z.MemoString:
      return ju(e);
    case Z.AssetInfo:
      return ha(e);
    case Z.PostCondition:
      return Gu(e);
    case Z.PublicKey:
      return lr(e);
    case Z.LengthPrefixedList:
      return Ci(e);
    case Z.Payload:
      return Hi(e);
    case Z.TransactionAuthField:
      return Ru(e);
    case Z.MessageSignature:
      return Bi(e);
  }
}
function Vu() {
  return {
    type: Z.Address,
    version: Le.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function hn(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === Y.SerializeP2PKH || t === Y.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === Y.SerializeP2WPKH || t === Y.SerializeP2WSH || t === Y.SerializeP2WSHNonSequential) && !r.every(Un))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case Y.SerializeP2PKH:
      return Sn(e, da(r[0].data));
    case Y.SerializeP2WPKH:
      return Sn(e, cl(r[0].data));
    case Y.SerializeP2SH:
    case Y.SerializeP2SHNonSequential:
      return Sn(e, hl(n, r.map(lr)));
    case Y.SerializeP2WSH:
    case Y.SerializeP2WSHNonSequential:
      return Sn(e, fl(n, r.map(lr)));
  }
}
function Ln(e) {
  const t = [];
  return t.push(ce(kn(e.version, 1))), t.push(ce(e.hash160)), de(t);
}
function js(e) {
  const t = li(oe(e.readBytes(1))), n = oe(e.readBytes(20));
  return { type: Z.Address, version: t, hash160: n };
}
function ca(e) {
  const t = [];
  return t.push(e.prefix), t.push(Ln(e.address)), e.prefix === _n.Contract && t.push(fn(e.contractName)), de(t);
}
function fn(e) {
  const t = [], n = bn(e.content), r = n.byteLength;
  return t.push(ce(kn(r, e.lengthPrefixBytes))), t.push(n), de(t);
}
function Gs(e, t, n) {
  t = t || 1;
  const r = li(oe(e.readBytes(t))), i = io(e.readBytes(r));
  return an(i, t, 128);
}
function Ws(e) {
  if (e && la(e, Qr))
    throw new Error(`Memo exceeds maximum length of ${Qr} bytes`);
  return { type: Z.MemoString, content: e };
}
function ju(e) {
  const t = [], n = bn(e.content), r = al(oe(n), Qr * 2);
  return t.push(ce(r)), de(t);
}
function ha(e) {
  const t = [];
  return t.push(Ln(e.address)), t.push(fn(e.contractName)), t.push(fn(e.assetName)), de(t);
}
function _i(e, t) {
  return {
    type: Z.LengthPrefixedList,
    lengthPrefixBytes: 4,
    values: e
  };
}
function Ci(e) {
  const t = e.values, n = [];
  n.push(ce(kn(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(qe(r));
  return de(n);
}
function Gu(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(ca(e.principal)), (e.conditionType === bt.Fungible || e.conditionType === bt.NonFungible) && t.push(ha(e.assetInfo)), e.conditionType === bt.NonFungible && t.push(ze(e.assetName)), t.push(e.conditionCode), e.conditionType === bt.STX || e.conditionType === bt.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new Ct("The post-condition amount may not be larger than 8 bytes");
    t.push(xt(e.amount, !1, 8));
  }
  return de(t);
}
function Re(e, t) {
  return de([e, t]);
}
function Wu(e) {
  return new Uint8Array([e.type]);
}
function qu(e) {
  return e.type === T.OptionalNone ? new Uint8Array([e.type]) : Re(e.type, ze(e.value));
}
function Xu(e) {
  const t = new Uint8Array(4);
  return Ot(t, e.buffer.length, 0), Re(e.type, xr(t, e.buffer));
}
function Zu(e) {
  const t = di(Ch(e.value, BigInt(Rh)), ao);
  return Re(e.type, t);
}
function Yu(e) {
  const t = di(e.value, ao);
  return Re(e.type, t);
}
function Ju(e) {
  return Re(e.type, Ln(e.address));
}
function Qu(e) {
  return Re(e.type, xr(Ln(e.address), fn(e.contractName)));
}
function el(e) {
  return Re(e.type, ze(e.value));
}
function tl(e) {
  const t = [], n = new Uint8Array(4);
  Ot(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const i = ze(r);
    t.push(i);
  }
  return Re(e.type, de(t));
}
function nl(e) {
  const t = [], n = new Uint8Array(4);
  Ot(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = an(i);
    t.push(fn(s));
    const o = ze(e.data[i]);
    t.push(o);
  }
  return Re(e.type, de(t));
}
function fa(e, t) {
  const n = [], r = t == "ascii" ? so(e.data) : bn(e.data), i = new Uint8Array(4);
  return Ot(i, r.length, 0), n.push(i), n.push(r), Re(e.type, de(n));
}
function rl(e) {
  return fa(e, "ascii");
}
function il(e) {
  return fa(e, "utf8");
}
function ze(e) {
  switch (e.type) {
    case T.BoolTrue:
    case T.BoolFalse:
      return Wu(e);
    case T.OptionalNone:
    case T.OptionalSome:
      return qu(e);
    case T.Buffer:
      return Xu(e);
    case T.UInt:
      return Yu(e);
    case T.Int:
      return Zu(e);
    case T.PrincipalStandard:
      return Ju(e);
    case T.PrincipalContract:
      return Qu(e);
    case T.ResponseOk:
    case T.ResponseErr:
      return el(e);
    case T.List:
      return tl(e);
    case T.Tuple:
      return nl(e);
    case T.StringASCII:
      return rl(e);
    case T.StringUTF8:
      return il(e);
    default:
      throw new Ct("Unable to serialize. Invalid Clarity Value.");
  }
}
function sl(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const qs = /* @__PURE__ */ new Map();
function ua(e, t) {
  const n = qs.get(e);
  if (n !== void 0)
    return n(t);
  const r = sl(e);
  return qs.set(e, r), ua(e, t);
}
class Xs {
  constructor(t) {
    this.consumed = 0, this.source = t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return Dh(this.readBytes(4), 0);
  }
  readUInt8() {
    return Fh(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Ph(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = oe(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = oe(n);
    return BigInt(`0x${r}`);
  }
  get readOffset() {
    return this.consumed;
  }
  set readOffset(t) {
    this.consumed = t;
  }
  get internalBytes() {
    return this.source;
  }
  readUInt8Enum(t, n) {
    const r = this.readUInt8();
    if (ua(t, r))
      return r;
    throw n(r);
  }
}
function qt(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new Xs(ce(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new Xs(e) : t = e;
  switch (t.readUInt8Enum(T, (r) => {
    throw new jr(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case T.Int:
      return Cu(t.readBytes(16));
    case T.UInt:
      return ea(t.readBytes(16));
    case T.Buffer:
      const r = t.readUInt32BE();
      return ta(t.readBytes(r));
    case T.BoolTrue:
      return Hu();
    case T.BoolFalse:
      return Bu();
    case T.PrincipalStandard:
      const i = js(t);
      return Eu(i);
    case T.PrincipalContract:
      const s = js(t), o = Gs(t);
      return Qo(s, o);
    case T.ResponseOk:
      return ku(qt(t));
    case T.ResponseErr:
      return Iu(qt(t));
    case T.OptionalNone:
      return na();
    case T.OptionalSome:
      return ra(qt(t));
    case T.List:
      const a = t.readUInt32BE(), h = [];
      for (let A = 0; A < a; A++)
        h.push(qt(t));
      return Tu(h);
    case T.Tuple:
      const l = t.readUInt32BE(), u = {};
      for (let A = 0; A < l; A++) {
        const C = Gs(t).content;
        if (C === void 0)
          throw new jr('"content" is undefined');
        u[C] = qt(t);
      }
      return Uu(u);
    case T.StringASCII:
      const f = t.readUInt32BE(), g = Uh(t.readBytes(f));
      return $u(g);
    case T.StringUTF8:
      const p = t.readUInt32BE(), v = io(t.readBytes(p));
      return Lu(v);
    default:
      throw new jr("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const ol = (e) => e.length % 2 == 0 ? e : `0${e}`, al = (e, t) => e.padEnd(t, "0"), la = (e, t) => e ? bn(e).length > t : !1;
function wt(e) {
  return pu(e);
}
function dr(e, t) {
  const n = wt(e);
  return delete n[t], n;
}
const In = (e) => of(wi(e)), Ii = (e) => oe(Nf(e)), da = (e) => oe(In(e)), cl = (e) => {
  const t = In(e), n = xr(new Uint8Array([0]), new Uint8Array([t.length]), t), r = In(n);
  return oe(r);
}, hl = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + t.length), n.push(174);
  const r = de(n), i = In(r);
  return oe(i);
}, fl = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((h) => {
    n.push(h.length), n.push(h);
  }), n.push(80 + t.length), n.push(174);
  const r = de(n), i = wi(r), s = [];
  s.push(0), s.push(i.length), s.push(i);
  const o = de(s), a = In(o);
  return oe(a);
};
function ul(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
const ll = (e) => {
  try {
    return gn.c32addressDecode(e), !0;
  } catch {
    return !1;
  }
};
function ki() {
  return {
    type: Z.MessageSignature,
    data: oe(new Uint8Array(mr))
  };
}
function vr(e, t, n, r) {
  const i = hn(0, e, 1, [mt(t)]).hash160, s = Un(mt(t)) ? ye.Compressed : ye.Uncompressed;
  return {
    hashMode: e,
    signer: i,
    nonce: we(n, !1),
    fee: we(r, !1),
    keyEncoding: s,
    signature: ki()
  };
}
function ba(e, t, n, r, i) {
  const s = n.map(mt), o = hn(0, e, t, s).hash160;
  return {
    hashMode: e,
    signer: o,
    nonce: we(r, !1),
    fee: we(i, !1),
    fields: [],
    signaturesRequired: t
  };
}
function St(e) {
  return "signature" in e;
}
function ai(e) {
  return e === Y.SerializeP2SH || e === Y.SerializeP2WSH;
}
function pa(e) {
  return e === Y.SerializeP2SHNonSequential || e === Y.SerializeP2WSHNonSequential;
}
function Zs(e) {
  const t = wt(e);
  return t.nonce = 0, t.fee = 0, St(t) ? t.signature = ki() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function dl(e) {
  const t = [
    e.hashMode,
    ce(e.signer),
    xt(e.nonce, !1, 8),
    xt(e.fee, !1, 8),
    e.keyEncoding,
    Bi(e.signature)
  ];
  return de(t);
}
function bl(e) {
  const t = [
    e.hashMode,
    ce(e.signer),
    xt(e.nonce, !1, 8),
    xt(e.fee, !1, 8)
  ], n = _i(e.fields);
  t.push(Ci(n));
  const r = new Uint8Array(2);
  return Nh(r, e.signaturesRequired, 0), t.push(r), de(t);
}
function Gr(e) {
  return St(e) ? dl(e) : bl(e);
}
function ga(e, t, n, r) {
  const s = e + oe(new Uint8Array([t])) + oe(xt(n, !1, 8)) + oe(xt(r, !1, 8));
  if (ce(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Ii(ce(s));
}
function ya(e, t, n) {
  const r = 33 + mr, i = Un(t) ? ye.Compressed : ye.Uncompressed, s = e + ol(i.toString(16)) + n.data, o = ce(s);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Ii(o);
}
function pl(e, t, n, r, i) {
  const s = ga(e, t, n, r), o = Du(i, s), a = vi(i), h = ya(s, a, o);
  return {
    nextSig: o,
    nextSigHash: h
  };
}
function Ti(e, t, n, r, i, s) {
  const o = ga(e, t, n, r), a = mt(Nu(o, s, i)), h = ya(o, a, s);
  return {
    pubKey: a,
    nextSigHash: h
  };
}
function gl() {
  const e = vr(Y.SerializeP2PKH, "", 0, 0);
  return e.signer = Vu().hash160, e.keyEncoding = ye.Compressed, e.signature = ki(), e;
}
function Ys(e, t, n) {
  return St(e) ? yl(e, t, n) : wl(e, t, n);
}
function yl(e, t, n) {
  const { pubKey: r, nextSigHash: i } = Ti(t, n, e.fee, e.nonce, e.keyEncoding, e.signature), s = hn(0, e.hashMode, 1, [r]).hash160;
  if (s !== e.signer)
    throw new An(`Signer hash does not equal hash of public key(s): ${s} != ${e.signer}`);
  return i;
}
function wl(e, t, n) {
  const r = [];
  let i = t, s = !1, o = 0;
  for (const h of e.fields)
    switch (h.contents.type) {
      case Z.PublicKey:
        Un(h.contents) || (s = !0), r.push(h.contents);
        break;
      case Z.MessageSignature:
        h.pubKeyEncoding === ye.Uncompressed && (s = !0);
        const { pubKey: l, nextSigHash: u } = Ti(i, n, e.fee, e.nonce, h.pubKeyEncoding, h.contents);
        if (ai(e.hashMode) && (i = u), r.push(l), o += 1, o === 65536)
          throw new An("Too many signatures");
        break;
    }
  if (ai(e.hashMode) && o !== e.signaturesRequired || pa(e.hashMode) && o < e.signaturesRequired)
    throw new An("Incorrect number of signatures");
  if (s && (e.hashMode === Y.SerializeP2WSH || e.hashMode === Y.SerializeP2WSHNonSequential))
    throw new An("Uncompressed keys are not allowed in this hash mode");
  const a = hn(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new An(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return i;
}
function Ui(e) {
  return {
    authType: ue.Standard,
    spendingCondition: e
  };
}
function $i(e, t) {
  return {
    authType: ue.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || vr(Y.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function Js(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case ue.Standard:
        return Ui(Zs(e.spendingCondition));
      case ue.Sponsored:
        return $i(Zs(e.spendingCondition), gl());
      default:
        throw new Ke("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function xl(e, t) {
  switch (e.authType) {
    case ue.Standard:
      return Ys(e.spendingCondition, t, ue.Standard);
    case ue.Sponsored:
      return Ys(e.spendingCondition, t, ue.Standard);
    default:
      throw new Ke("Invalid origin auth type");
  }
}
function ml(e, t) {
  switch (e.authType) {
    case ue.Standard:
      const n = {
        ...e.spendingCondition,
        fee: we(t, !1)
      };
      return { ...e, spendingCondition: n };
    case ue.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: we(t, !1)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function Sl(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: we(t, !1)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function Al(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: we(t, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function El(e, t) {
  const n = {
    ...t,
    nonce: we(t.nonce, !1),
    fee: we(t.fee, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function vl(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case ue.Standard:
      t.push(Gr(e.spendingCondition));
      break;
    case ue.Sponsored:
      t.push(Gr(e.spendingCondition)), t.push(Gr(e.sponsorSpendingCondition));
      break;
  }
  return de(t);
}
(function() {
  (function(e) {
    (function(t) {
      var n = typeof globalThis < "u" && globalThis || typeof e < "u" && e || // eslint-disable-next-line no-undef
      typeof Ut < "u" && Ut || {}, r = {
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
      function i(d) {
        return d && DataView.prototype.isPrototypeOf(d);
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
        ], o = ArrayBuffer.isView || function(d) {
          return d && s.indexOf(Object.prototype.toString.call(d)) > -1;
        };
      function a(d) {
        if (typeof d != "string" && (d = String(d)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(d) || d === "")
          throw new TypeError('Invalid character in header field name: "' + d + '"');
        return d.toLowerCase();
      }
      function h(d) {
        return typeof d != "string" && (d = String(d)), d;
      }
      function l(d) {
        var x = {
          next: function() {
            var b = d.shift();
            return { done: b === void 0, value: b };
          }
        };
        return r.iterable && (x[Symbol.iterator] = function() {
          return x;
        }), x;
      }
      function u(d) {
        this.map = {}, d instanceof u ? d.forEach(function(x, b) {
          this.append(b, x);
        }, this) : Array.isArray(d) ? d.forEach(function(x) {
          if (x.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + x.length);
          this.append(x[0], x[1]);
        }, this) : d && Object.getOwnPropertyNames(d).forEach(function(x) {
          this.append(x, d[x]);
        }, this);
      }
      u.prototype.append = function(d, x) {
        d = a(d), x = h(x);
        var b = this.map[d];
        this.map[d] = b ? b + ", " + x : x;
      }, u.prototype.delete = function(d) {
        delete this.map[a(d)];
      }, u.prototype.get = function(d) {
        return d = a(d), this.has(d) ? this.map[d] : null;
      }, u.prototype.has = function(d) {
        return this.map.hasOwnProperty(a(d));
      }, u.prototype.set = function(d, x) {
        this.map[a(d)] = h(x);
      }, u.prototype.forEach = function(d, x) {
        for (var b in this.map)
          this.map.hasOwnProperty(b) && d.call(x, this.map[b], b, this);
      }, u.prototype.keys = function() {
        var d = [];
        return this.forEach(function(x, b) {
          d.push(b);
        }), l(d);
      }, u.prototype.values = function() {
        var d = [];
        return this.forEach(function(x) {
          d.push(x);
        }), l(d);
      }, u.prototype.entries = function() {
        var d = [];
        return this.forEach(function(x, b) {
          d.push([b, x]);
        }), l(d);
      }, r.iterable && (u.prototype[Symbol.iterator] = u.prototype.entries);
      function f(d) {
        if (!d._noBody) {
          if (d.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          d.bodyUsed = !0;
        }
      }
      function g(d) {
        return new Promise(function(x, b) {
          d.onload = function() {
            x(d.result);
          }, d.onerror = function() {
            b(d.error);
          };
        });
      }
      function p(d) {
        var x = new FileReader(), b = g(x);
        return x.readAsArrayBuffer(d), b;
      }
      function v(d) {
        var x = new FileReader(), b = g(x), y = /charset=([A-Za-z0-9_-]+)/.exec(d.type), H = y ? y[1] : "utf-8";
        return x.readAsText(d, H), b;
      }
      function A(d) {
        for (var x = new Uint8Array(d), b = new Array(x.length), y = 0; y < x.length; y++)
          b[y] = String.fromCharCode(x[y]);
        return b.join("");
      }
      function C(d) {
        if (d.slice)
          return d.slice(0);
        var x = new Uint8Array(d.byteLength);
        return x.set(new Uint8Array(d)), x.buffer;
      }
      function $() {
        return this.bodyUsed = !1, this._initBody = function(d) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = d, d ? typeof d == "string" ? this._bodyText = d : r.blob && Blob.prototype.isPrototypeOf(d) ? this._bodyBlob = d : r.formData && FormData.prototype.isPrototypeOf(d) ? this._bodyFormData = d : r.searchParams && URLSearchParams.prototype.isPrototypeOf(d) ? this._bodyText = d.toString() : r.arrayBuffer && r.blob && i(d) ? (this._bodyArrayBuffer = C(d.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(d) || o(d)) ? this._bodyArrayBuffer = C(d) : this._bodyText = d = Object.prototype.toString.call(d) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof d == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(d) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var d = f(this);
          if (d)
            return d;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var d = f(this);
            return d || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
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
          var d = f(this);
          if (d)
            return d;
          if (this._bodyBlob)
            return v(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(A(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(B);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var N = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function E(d) {
        var x = d.toUpperCase();
        return N.indexOf(x) > -1 ? x : d;
      }
      function S(d, x) {
        if (!(this instanceof S))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        x = x || {};
        var b = x.body;
        if (d instanceof S) {
          if (d.bodyUsed)
            throw new TypeError("Already read");
          this.url = d.url, this.credentials = d.credentials, x.headers || (this.headers = new u(d.headers)), this.method = d.method, this.mode = d.mode, this.signal = d.signal, !b && d._bodyInit != null && (b = d._bodyInit, d.bodyUsed = !0);
        } else
          this.url = String(d);
        if (this.credentials = x.credentials || this.credentials || "same-origin", (x.headers || !this.headers) && (this.headers = new u(x.headers)), this.method = E(x.method || this.method || "GET"), this.mode = x.mode || this.mode || null, this.signal = x.signal || this.signal || function() {
          if ("AbortController" in n) {
            var k = new AbortController();
            return k.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && b)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(b), (this.method === "GET" || this.method === "HEAD") && (x.cache === "no-store" || x.cache === "no-cache")) {
          var y = /([?&])_=[^&]*/;
          if (y.test(this.url))
            this.url = this.url.replace(y, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var H = /\?/;
            this.url += (H.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      S.prototype.clone = function() {
        return new S(this, { body: this._bodyInit });
      };
      function B(d) {
        var x = new FormData();
        return d.trim().split("&").forEach(function(b) {
          if (b) {
            var y = b.split("="), H = y.shift().replace(/\+/g, " "), k = y.join("=").replace(/\+/g, " ");
            x.append(decodeURIComponent(H), decodeURIComponent(k));
          }
        }), x;
      }
      function O(d) {
        var x = new u(), b = d.replace(/\r?\n[\t ]+/g, " ");
        return b.split("\r").map(function(y) {
          return y.indexOf(`
`) === 0 ? y.substr(1, y.length) : y;
        }).forEach(function(y) {
          var H = y.split(":"), k = H.shift().trim();
          if (k) {
            var D = H.join(":").trim();
            try {
              x.append(k, D);
            } catch (z) {
              console.warn("Response " + z.message);
            }
          }
        }), x;
      }
      $.call(S.prototype);
      function L(d, x) {
        if (!(this instanceof L))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (x || (x = {}), this.type = "default", this.status = x.status === void 0 ? 200 : x.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = x.statusText === void 0 ? "" : "" + x.statusText, this.headers = new u(x.headers), this.url = x.url || "", this._initBody(d);
      }
      $.call(L.prototype), L.prototype.clone = function() {
        return new L(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new u(this.headers),
          url: this.url
        });
      }, L.error = function() {
        var d = new L(null, { status: 200, statusText: "" });
        return d.ok = !1, d.status = 0, d.type = "error", d;
      };
      var U = [301, 302, 303, 307, 308];
      L.redirect = function(d, x) {
        if (U.indexOf(x) === -1)
          throw new RangeError("Invalid status code");
        return new L(null, { status: x, headers: { location: d } });
      }, t.DOMException = n.DOMException;
      try {
        new t.DOMException();
      } catch {
        t.DOMException = function(x, b) {
          this.message = x, this.name = b;
          var y = Error(x);
          this.stack = y.stack;
        }, t.DOMException.prototype = Object.create(Error.prototype), t.DOMException.prototype.constructor = t.DOMException;
      }
      function F(d, x) {
        return new Promise(function(b, y) {
          var H = new S(d, x);
          if (H.signal && H.signal.aborted)
            return y(new t.DOMException("Aborted", "AbortError"));
          var k = new XMLHttpRequest();
          function D() {
            k.abort();
          }
          k.onload = function() {
            var w = {
              statusText: k.statusText,
              headers: O(k.getAllResponseHeaders() || "")
            };
            H.url.indexOf("file://") === 0 && (k.status < 200 || k.status > 599) ? w.status = 200 : w.status = k.status, w.url = "responseURL" in k ? k.responseURL : w.headers.get("X-Request-URL");
            var I = "response" in k ? k.response : k.responseText;
            setTimeout(function() {
              b(new L(I, w));
            }, 0);
          }, k.onerror = function() {
            setTimeout(function() {
              y(new TypeError("Network request failed"));
            }, 0);
          }, k.ontimeout = function() {
            setTimeout(function() {
              y(new TypeError("Network request timed out"));
            }, 0);
          }, k.onabort = function() {
            setTimeout(function() {
              y(new t.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function z(w) {
            try {
              return w === "" && n.location.href ? n.location.href : w;
            } catch {
              return w;
            }
          }
          if (k.open(H.method, z(H.url), !0), H.credentials === "include" ? k.withCredentials = !0 : H.credentials === "omit" && (k.withCredentials = !1), "responseType" in k && (r.blob ? k.responseType = "blob" : r.arrayBuffer && (k.responseType = "arraybuffer")), x && typeof x.headers == "object" && !(x.headers instanceof u || n.Headers && x.headers instanceof n.Headers)) {
            var j = [];
            Object.getOwnPropertyNames(x.headers).forEach(function(w) {
              j.push(a(w)), k.setRequestHeader(w, h(x.headers[w]));
            }), H.headers.forEach(function(w, I) {
              j.indexOf(I) === -1 && k.setRequestHeader(I, w);
            });
          } else
            H.headers.forEach(function(w, I) {
              k.setRequestHeader(I, w);
            });
          H.signal && (H.signal.addEventListener("abort", D), k.onreadystatechange = function() {
            k.readyState === 4 && H.signal.removeEventListener("abort", D);
          }), k.send(typeof H._bodyInit > "u" ? null : H._bodyInit);
        });
      }
      return F.polyfill = !0, n.fetch || (n.fetch = F, n.Headers = u, n.Request = S, n.Response = L), t.Headers = u, t.Request = S, t.Response = L, t.fetch = F, Object.defineProperty(t, "__esModule", { value: !0 }), t;
    })({});
  })(typeof self < "u" ? self : Ut);
})();
const Hl = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Bl(e, t) {
  const n = {};
  return Object.assign(n, Hl, t), await fetch(e, n);
}
function _l(e) {
  let t = Bl, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function Cl(...e) {
  const { fetchLib: t, middlewares: n } = _l(e);
  return async (i, s) => {
    let o = { url: i, init: s ?? {} };
    for (const h of n)
      typeof h.pre == "function" && (o = await Promise.resolve(h.pre({
        fetch: t,
        ...o
      })) ?? o);
    let a = await t(o.url, o.init);
    for (const h of n)
      typeof h.post == "function" && (a = await Promise.resolve(h.post({
        fetch: t,
        url: o.url,
        init: o.init,
        response: (a == null ? void 0 : a.clone()) ?? a
      })) ?? a);
    return a;
  };
}
var un;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(un || (un = {}));
var Nt;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Nt || (Nt = {}));
var Qs;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Qs || (Qs = {}));
const Il = "https://api.mainnet.hiro.so", kl = "https://api.testnet.hiro.so", Tl = "http://localhost:3999", Ul = ["mainnet", "testnet", "devnet", "mocknet"];
class $e {
  constructor(t) {
    this.version = Nt.Mainnet, this.chainId = un.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Nt.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, i) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(i)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, i) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${i}?proof=0`, this.getMapEntryUrl = (n, r, i) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${i}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? Cl();
  }
  getNameInfo(t) {
    const n = `${this.bnsLookupUrl}/v1/names/${t}`;
    return this.fetchFn(n).then((r) => {
      if (r.status === 404)
        throw new Error("Name not found");
      if (r.status !== 200)
        throw new Error(`Bad response status: ${r.status}`);
      return r.json();
    }).then((r) => r.address ? Object.assign({}, r, { address: r.address }) : r);
  }
}
$e.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new Ye();
    case "testnet":
      return new wa();
    case "devnet":
      return new $l();
    case "mocknet":
      return new xa();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Ul.join(", ")}`);
  }
};
$e.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : $e.fromName(e);
class Ye extends $e {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Il,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Nt.Mainnet, this.chainId = un.Mainnet;
  }
}
class wa extends $e {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? kl,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Nt.Testnet, this.chainId = un.Testnet;
  }
}
class xa extends $e {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Tl,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Nt.Testnet, this.chainId = un.Testnet;
  }
}
const $l = xa;
var ie;
(function(e) {
  e[e.ClarityAbiTypeUInt128 = 1] = "ClarityAbiTypeUInt128", e[e.ClarityAbiTypeInt128 = 2] = "ClarityAbiTypeInt128", e[e.ClarityAbiTypeBool = 3] = "ClarityAbiTypeBool", e[e.ClarityAbiTypePrincipal = 4] = "ClarityAbiTypePrincipal", e[e.ClarityAbiTypeNone = 5] = "ClarityAbiTypeNone", e[e.ClarityAbiTypeBuffer = 6] = "ClarityAbiTypeBuffer", e[e.ClarityAbiTypeResponse = 7] = "ClarityAbiTypeResponse", e[e.ClarityAbiTypeOptional = 8] = "ClarityAbiTypeOptional", e[e.ClarityAbiTypeTuple = 9] = "ClarityAbiTypeTuple", e[e.ClarityAbiTypeList = 10] = "ClarityAbiTypeList", e[e.ClarityAbiTypeStringAscii = 11] = "ClarityAbiTypeStringAscii", e[e.ClarityAbiTypeStringUtf8 = 12] = "ClarityAbiTypeStringUtf8", e[e.ClarityAbiTypeTraitReference = 13] = "ClarityAbiTypeTraitReference";
})(ie || (ie = {}));
const ma = (e) => typeof e == "string", Sa = (e) => e.buffer !== void 0, Aa = (e) => e["string-ascii"] !== void 0, Ea = (e) => e["string-utf8"] !== void 0, va = (e) => e.response !== void 0, Ha = (e) => e.optional !== void 0, Ba = (e) => e.tuple !== void 0, _a = (e) => e.list !== void 0;
function Ll(e) {
  if (ma(e)) {
    if (e === "uint128")
      return { id: ie.ClarityAbiTypeUInt128, type: e };
    if (e === "int128")
      return { id: ie.ClarityAbiTypeInt128, type: e };
    if (e === "bool")
      return { id: ie.ClarityAbiTypeBool, type: e };
    if (e === "principal")
      return { id: ie.ClarityAbiTypePrincipal, type: e };
    if (e === "trait_reference")
      return { id: ie.ClarityAbiTypeTraitReference, type: e };
    if (e === "none")
      return { id: ie.ClarityAbiTypeNone, type: e };
    throw new Error(`Unexpected Clarity ABI type primitive: ${JSON.stringify(e)}`);
  } else {
    if (Sa(e))
      return { id: ie.ClarityAbiTypeBuffer, type: e };
    if (va(e))
      return { id: ie.ClarityAbiTypeResponse, type: e };
    if (Ha(e))
      return { id: ie.ClarityAbiTypeOptional, type: e };
    if (Ba(e))
      return { id: ie.ClarityAbiTypeTuple, type: e };
    if (_a(e))
      return { id: ie.ClarityAbiTypeList, type: e };
    if (Aa(e))
      return { id: ie.ClarityAbiTypeStringAscii, type: e };
    if (Ea(e))
      return { id: ie.ClarityAbiTypeStringUtf8, type: e };
    throw new Error(`Unexpected Clarity ABI type: ${JSON.stringify(e)}`);
  }
}
function Xt(e) {
  if (ma(e))
    return e === "int128" ? "int" : e === "uint128" ? "uint" : e;
  if (Sa(e))
    return `(buff ${e.buffer.length})`;
  if (Aa(e))
    return `(string-ascii ${e["string-ascii"].length})`;
  if (Ea(e))
    return `(string-utf8 ${e["string-utf8"].length})`;
  if (va(e))
    return `(response ${Xt(e.response.ok)} ${Xt(e.response.error)})`;
  if (Ha(e))
    return `(optional ${Xt(e.optional)})`;
  if (Ba(e))
    return `(tuple ${e.tuple.map((t) => `(${t.name} ${Xt(t.type)})`).join(" ")})`;
  if (_a(e))
    return `(list ${e.list.length} ${Xt(e.list.type)})`;
  throw new Error(`Type string unsupported for Clarity type: ${JSON.stringify(e)}`);
}
function Zt(e, t) {
  const n = Ll(t);
  switch (e.type) {
    case T.BoolTrue:
    case T.BoolFalse:
      return n.id === ie.ClarityAbiTypeBool;
    case T.Int:
      return n.id === ie.ClarityAbiTypeInt128;
    case T.UInt:
      return n.id === ie.ClarityAbiTypeUInt128;
    case T.Buffer:
      return n.id === ie.ClarityAbiTypeBuffer && n.type.buffer.length >= e.buffer.length;
    case T.StringASCII:
      return n.id === ie.ClarityAbiTypeStringAscii && n.type["string-ascii"].length >= e.data.length;
    case T.StringUTF8:
      return n.id === ie.ClarityAbiTypeStringUtf8 && n.type["string-utf8"].length >= e.data.length;
    case T.OptionalNone:
      return n.id === ie.ClarityAbiTypeNone || n.id === ie.ClarityAbiTypeOptional;
    case T.OptionalSome:
      return n.id === ie.ClarityAbiTypeOptional && Zt(e.value, n.type.optional);
    case T.ResponseErr:
      return n.id === ie.ClarityAbiTypeResponse && Zt(e.value, n.type.response.error);
    case T.ResponseOk:
      return n.id === ie.ClarityAbiTypeResponse && Zt(e.value, n.type.response.ok);
    case T.PrincipalContract:
      return n.id === ie.ClarityAbiTypePrincipal || n.id === ie.ClarityAbiTypeTraitReference;
    case T.PrincipalStandard:
      return n.id === ie.ClarityAbiTypePrincipal;
    case T.List:
      return n.id == ie.ClarityAbiTypeList && n.type.list.length >= e.list.length && e.list.every((r) => Zt(r, n.type.list.type));
    case T.Tuple:
      if (n.id == ie.ClarityAbiTypeTuple) {
        const r = wt(e.data);
        for (let i = 0; i < n.type.tuple.length; i++) {
          const s = n.type.tuple[i], o = s.name, a = r[o];
          if (a) {
            if (!Zt(a, s.type))
              return !1;
            delete r[o];
          } else
            return !1;
        }
        return !0;
      } else
        return !1;
    default:
      return !1;
  }
}
function Ol(e, t) {
  const n = t.functions.filter((r) => r.name === e.functionName.content);
  if (n.length === 1) {
    const i = n[0].args;
    if (e.functionArgs.length !== i.length)
      throw new Error(`Clarity function expects ${i.length} argument(s) but received ${e.functionArgs.length}`);
    for (let s = 0; s < e.functionArgs.length; s++) {
      const o = e.functionArgs[s], a = i[s];
      if (!Zt(o, a.type)) {
        const h = s + 1;
        throw new Error(`Clarity function \`${e.functionName.content}\` expects argument ${h} to be of type ${Xt(a.type)}, not ${Xe(o)}`);
      }
    }
    return !0;
  } else throw n.length === 0 ? new Error(`ABI doesn't contain a function with the name ${e.functionName.content}`) : new Error(`Malformed ABI. Contains multiple functions with the name ${e.functionName.content}`);
}
function Pl(e, t, n) {
  return typeof e == "string" && (e = wu(e)), {
    type: Z.PostCondition,
    conditionType: bt.STX,
    principal: e,
    conditionCode: t,
    amount: we(n, !1)
  };
}
class Li {
  constructor(t) {
    this.transaction = t, this.sigHash = t.signBegin(), this.originDone = !1, this.checkOversign = !0, this.checkOverlap = !0;
    const n = t.auth.spendingCondition;
    if (n && !St(n)) {
      if (n.fields.filter((r) => r.contents.type === Z.MessageSignature).length >= n.signaturesRequired)
        throw new Error("SpendingCondition has more signatures than are expected");
      n.fields.forEach((r) => {
        if (r.contents.type !== Z.MessageSignature)
          return;
        const i = r.contents, s = Ti(this.sigHash, t.auth.authType, n.fee, n.nonce, ye.Compressed, i);
        pa(n.hashMode) || (this.sigHash = s.nextSigHash);
      });
    }
  }
  static createSponsorSigner(t, n) {
    if (t.auth.authType != ue.Sponsored)
      throw new Ke("Cannot add sponsor to non-sponsored transaction");
    const r = wt(t);
    r.setSponsor(n);
    const i = r.verifyOrigin(), s = new this(r);
    return s.originDone = !0, s.sigHash = i, s.checkOversign = !0, s.checkOverlap = !0, s;
  }
  signOrigin(t) {
    if (this.checkOverlap && this.originDone)
      throw new Ke("Cannot sign origin after sponsor key");
    if (this.transaction.auth === void 0)
      throw new Ke('"transaction.auth" is undefined');
    if (this.transaction.auth.spendingCondition === void 0)
      throw new Ke('"transaction.auth.spendingCondition" is undefined');
    const n = this.transaction.auth.spendingCondition;
    if ((n.hashMode === Y.SerializeP2SH || n.hashMode === Y.SerializeP2WSH) && this.checkOversign && n.fields.filter((i) => i.contents.type === Z.MessageSignature).length >= n.signaturesRequired)
      throw new Error("Origin would have too many signatures");
    const r = this.transaction.signNextOrigin(this.sigHash, t);
    (St(this.transaction.auth.spendingCondition) || ai(this.transaction.auth.spendingCondition.hashMode)) && (this.sigHash = r);
  }
  appendOrigin(t) {
    if (this.checkOverlap && this.originDone)
      throw Error("Cannot append public key to origin after sponsor key");
    if (this.transaction.auth === void 0)
      throw new Error('"transaction.auth" is undefined');
    if (this.transaction.auth.spendingCondition === void 0)
      throw new Error('"transaction.auth.spendingCondition" is undefined');
    this.transaction.appendPubkey(t);
  }
  signSponsor(t) {
    if (this.transaction.auth === void 0)
      throw new Ke('"transaction.auth" is undefined');
    if (this.transaction.auth.authType !== ue.Sponsored)
      throw new Ke('"transaction.auth.authType" is not AuthType.Sponsored');
    const n = this.transaction.signNextSponsor(this.sigHash, t);
    this.sigHash = n, this.originDone = !0;
  }
  getTxInComplete() {
    return wt(this.transaction);
  }
  resume(t) {
    this.transaction = wt(t), this.sigHash = t.signBegin();
  }
}
class Ca {
  constructor(t, n, r, i, s, o, a) {
    if (this.version = t, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: we(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? Kh, this.postConditionMode = s ?? Bn.Deny, this.postConditions = i ?? _i([]), o)
      this.anchorMode = Vh(o);
    else
      switch (r.payloadType) {
        case fe.Coinbase:
        case fe.CoinbaseToAltRecipient:
        case fe.NakamotoCoinbase:
        case fe.PoisonMicroblock:
        case fe.TenureChange:
          this.anchorMode = Se.OnChainOnly;
          break;
        case fe.ContractCall:
        case fe.SmartContract:
        case fe.VersionedSmartContract:
        case fe.TokenTransfer:
          this.anchorMode = Se.Any;
          break;
      }
  }
  signBegin() {
    const t = wt(this);
    return t.auth = Js(t.auth), t.txid();
  }
  verifyBegin() {
    const t = wt(this);
    return t.auth = Js(t.auth), t.txid();
  }
  verifyOrigin() {
    return xl(this.auth, this.verifyBegin());
  }
  signNextOrigin(t, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, t, ue.Standard, n);
  }
  signNextSponsor(t, n) {
    if (this.auth.authType === ue.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, t, ue.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(t) {
    const n = this.auth.spendingCondition;
    if (n && !St(n)) {
      const r = Un(t);
      n.fields.push(Vs(r ? ye.Compressed : ye.Uncompressed, t));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, i) {
    const { nextSig: s, nextSigHash: o } = pl(n, r, t.fee, t.nonce, i);
    return St(t) ? t.signature = s : t.fields.push(Vs(i.data.byteLength === oo ? ye.Compressed : ye.Uncompressed, s)), o;
  }
  txid() {
    const t = this.serialize();
    return Ii(t);
  }
  setSponsor(t) {
    if (this.auth.authType != ue.Sponsored)
      throw new Ke("Cannot sponsor sign a non-sponsored transaction");
    this.auth = El(this.auth, t);
  }
  setFee(t) {
    this.auth = ml(this.auth, t);
  }
  setNonce(t) {
    this.auth = Sl(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != ue.Sponsored)
      throw new Ke("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Al(this.auth, t);
  }
  serialize() {
    if (this.version === void 0)
      throw new Ct('"version" is undefined');
    if (this.chainId === void 0)
      throw new Ct('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Ct('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Ct('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Ct('"payload" is undefined');
    const t = [];
    t.push(this.version);
    const n = new Uint8Array(4);
    return Ot(n, this.chainId, 0), t.push(n), t.push(vl(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(Ci(this.postConditions)), t.push(Hi(this.payload)), de(t);
  }
}
async function Nl(e, t) {
  const n = `${t.coreApiUrl}/extended/v1/address/${e}/nonces`, i = await (await t.fetchFn(n)).json();
  return BigInt(i.possible_next_nonce);
}
async function Ia(e, t) {
  const n = $e.fromNameOrNetwork(t ?? new Ye()), r = n.getAccountApiUrl(e);
  try {
    return await Nl(e, n);
  } catch {
  }
  const i = await n.fetchFn(r);
  if (!i.ok) {
    let a = "";
    try {
      a = await i.text();
    } catch {
    }
    throw new Error(`Error fetching nonce. Response ${i.status}: ${i.statusText}. Attempted to fetch ${r} and failed with the message: "${a}"`);
  }
  const s = await i.text(), o = JSON.parse(s);
  return BigInt(o.nonce);
}
async function Fl(e, t) {
  const r = {
    method: "GET",
    headers: {
      Accept: "application/text"
    }
  }, i = $e.fromNameOrNetwork(t ?? Kl(e)), s = i.getTransferFeeEstimateApiUrl(), o = await i.fetchFn(s, r);
  if (!o.ok) {
    let u = "";
    try {
      u = await o.text();
    } catch {
    }
    throw new Error(`Error estimating transaction fee. Response ${o.status}: ${o.statusText}. Attempted to fetch ${s} and failed with the message: "${u}"`);
  }
  const a = await o.text(), h = BigInt(e.serialize().byteLength);
  return BigInt(a) * h;
}
async function Ml(e, t, n) {
  var h;
  const r = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      transaction_payload: oe(Hi(e)),
      ...t ? { estimated_len: t } : {}
    })
  }, i = $e.fromNameOrNetwork(n ?? new Ye()), s = i.getTransactionFeeEstimateApiUrl(), o = await i.fetchFn(s, r);
  if (!o.ok) {
    const l = await o.text().then((u) => {
      try {
        return JSON.parse(u);
      } catch {
        return u;
      }
    });
    throw (l == null ? void 0 : l.reason) === "NoEstimateAvailable" || typeof l == "string" && l.includes("NoEstimateAvailable") ? new aa(((h = l == null ? void 0 : l.reason_data) == null ? void 0 : h.message) ?? "") : new Error(`Error estimating transaction fee. Response ${o.status}: ${o.statusText}. Attempted to fetch ${s} and failed with the message: "${l}"`);
  }
  return (await o.json()).estimations;
}
async function Dl(e, t, n) {
  const r = {
    method: "GET"
  }, i = $e.fromNameOrNetwork(n), s = i.getAbiApiUrl(e, t), o = await i.fetchFn(s, r);
  if (!o.ok) {
    const a = await o.text().catch(() => "");
    throw new Error(`Error fetching contract ABI for contract "${t}" at address ${e}. Response ${o.status}: ${o.statusText}. Attempted to fetch ${s} and failed with the message: "${a}"`);
  }
  return JSON.parse(await o.text());
}
function Kl(e) {
  switch (e.version) {
    case He.Mainnet:
      return new Ye();
    case He.Testnet:
      return new wa();
  }
}
async function ci(e) {
  const t = {
    fee: BigInt(0),
    nonce: BigInt(0),
    network: new Ye(),
    memo: "",
    sponsored: !1
  }, n = Object.assign(t, e), r = Ku(n.recipient, n.amount, n.memo);
  let i = null, s = null;
  if ("publicKey" in n)
    s = vr(Y.SerializeP2PKH, n.publicKey, n.nonce, n.fee);
  else {
    const h = n.useNonSequentialMultiSig ? Y.SerializeP2SHNonSequential : Y.SerializeP2SH, l = n.address ? Oi(n.publicKeys, n.numSignatures, h, At(n.address).hash160) : n.publicKeys;
    s = ba(h, n.numSignatures, l, n.nonce, n.fee);
  }
  n.sponsored ? i = $i(s) : i = Ui(s);
  const o = $e.fromNameOrNetwork(n.network), a = new Ca(o.version, i, r, void 0, void 0, n.anchorMode, o.chainId);
  if (e.fee === void 0 || e.fee === null) {
    const h = await ka(a, o);
    a.setFee(h);
  }
  if (e.nonce === void 0 || e.nonce === null) {
    const h = n.network.version === He.Mainnet ? Le.MainnetSingleSig : Le.TestnetSingleSig, l = gn.c32address(h, a.auth.spendingCondition.signer), u = await Ia(l, n.network);
    a.setNonce(u);
  }
  return a;
}
async function zl(e) {
  if ("senderKey" in e) {
    const t = oa(vi(cn(e.senderKey))), n = dr(e, "senderKey"), r = await ci({ publicKey: t, ...n }), i = cn(e.senderKey);
    return new Li(r).signOrigin(i), r;
  } else {
    const t = dr(e, "signerKeys"), n = await ci(t);
    return Ta(n, e.publicKeys.slice(), e.signerKeys, e.address), n;
  }
}
async function hi(e) {
  const t = {
    fee: BigInt(0),
    nonce: BigInt(0),
    network: new Ye(),
    postConditionMode: Bn.Deny,
    sponsored: !1
  }, n = Object.assign(t, e), r = zu(n.contractAddress, n.contractName, n.functionName, n.functionArgs);
  if (n != null && n.validateWithAbi) {
    let u;
    if (typeof n.validateWithAbi == "boolean")
      if (n != null && n.network)
        u = await Dl(n.contractAddress, n.contractName, n.network);
      else
        throw new Error("Network option must be provided in order to validate with ABI");
    else
      u = n.validateWithAbi;
    Ol(r, u);
  }
  let i = null, s = null;
  if ("publicKey" in n)
    i = vr(Y.SerializeP2PKH, n.publicKey, n.nonce, n.fee);
  else {
    const u = n.useNonSequentialMultiSig ? Y.SerializeP2SHNonSequential : Y.SerializeP2SH, f = n.address ? Oi(n.publicKeys, n.numSignatures, u, At(n.address).hash160) : n.publicKeys;
    i = ba(u, n.numSignatures, f, n.nonce, n.fee);
  }
  n.sponsored ? s = $i(i) : s = Ui(i);
  const o = $e.fromNameOrNetwork(n.network), a = [];
  n.postConditions && n.postConditions.length > 0 && n.postConditions.forEach((u) => {
    a.push(u);
  });
  const h = _i(a), l = new Ca(o.version, s, r, h, n.postConditionMode, n.anchorMode, o.chainId);
  if (e.fee === void 0 || e.fee === null) {
    const u = await ka(l, o);
    l.setFee(u);
  }
  if (e.nonce === void 0 || e.nonce === null) {
    const u = o.version === He.Mainnet ? Le.MainnetSingleSig : Le.TestnetSingleSig, f = gn.c32address(u, l.auth.spendingCondition.signer), g = await Ia(f, o);
    l.setNonce(g);
  }
  return l;
}
async function Rl(e) {
  if ("senderKey" in e) {
    const t = oa(vi(cn(e.senderKey))), n = dr(e, "senderKey"), r = await hi({ publicKey: t, ...n }), i = cn(e.senderKey);
    return new Li(r).signOrigin(i), r;
  } else {
    const t = dr(e, "signerKeys"), n = await hi(t);
    return Ta(n, e.publicKeys.slice(), e.signerKeys, e.address), n;
  }
}
function Vl(e, t, n) {
  return Pl(Jo(e), t, n);
}
function jl(e) {
  const t = e.auth.spendingCondition.hashMode;
  if ([Y.SerializeP2SH, Y.SerializeP2WSH].includes(t)) {
    const r = e.auth.spendingCondition, i = r.fields.filter((o) => o.contents.type === Z.MessageSignature).length, s = (r.signaturesRequired - i) * (mr + 1);
    return e.serialize().byteLength + s;
  } else
    return e.serialize().byteLength;
}
async function ka(e, t) {
  try {
    const n = jl(e);
    return (await Ml(e.payload, n, t))[1].fee;
  } catch (n) {
    if (n instanceof aa)
      return await Fl(e, t);
    throw n;
  }
}
function Ta(e, t, n, r) {
  if (St(e.auth.spendingCondition))
    throw new Error("Transaction is not a multi-sig transaction");
  const i = new Li(e), s = r ? Oi(t, e.auth.spendingCondition.signaturesRequired, e.auth.spendingCondition.hashMode, At(r).hash160) : t;
  for (const o of s) {
    const a = n.find((h) => oe(Ei(h).data) === o);
    a ? i.signOrigin(cn(a)) : i.appendOrigin(Fu(ce(o)));
  }
}
function Oi(e, t, n, r) {
  if (hn(0, n, t, e.map(mt)).hash160 === r)
    return e;
  const s = e.slice().sort();
  if (hn(0, n, t, s.map(mt)).hash160 === r)
    return s;
  throw new Error("Failed to find matching multi-sig address given public-keys.");
}
const br = ea, Gl = ta;
var Ce = {}, be = {};
Object.defineProperty(be, "__esModule", { value: !0 });
be.output = be.exists = be.hash = be.bytes = be.bool = be.number = void 0;
function pr(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
be.number = pr;
function Ua(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
be.bool = Ua;
function Pi(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
be.bytes = Pi;
function $a(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  pr(e.outputLen), pr(e.blockLen);
}
be.hash = $a;
function La(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
be.exists = La;
function Oa(e, t) {
  Pi(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
be.output = Oa;
const Wl = {
  number: pr,
  bool: Ua,
  bytes: Pi,
  hash: $a,
  exists: La,
  output: Oa
};
be.default = Wl;
var ln = {}, Pa = {}, Dt = {}, Hr = {};
Object.defineProperty(Hr, "__esModule", { value: !0 });
Hr.crypto = void 0;
Hr.crypto = {
  node: void 0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
};
(function(e) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(e, "__esModule", { value: !0 }), e.randomBytes = e.wrapConstructorWithOpts = e.wrapConstructor = e.checkOpts = e.Hash = e.concatBytes = e.toBytes = e.utf8ToBytes = e.asyncLoop = e.nextTick = e.hexToBytes = e.bytesToHex = e.isLE = e.rotr = e.createView = e.u32 = e.u8 = void 0;
  const t = Hr, n = (S) => new Uint8Array(S.buffer, S.byteOffset, S.byteLength);
  e.u8 = n;
  const r = (S) => new Uint32Array(S.buffer, S.byteOffset, Math.floor(S.byteLength / 4));
  e.u32 = r;
  const i = (S) => new DataView(S.buffer, S.byteOffset, S.byteLength);
  e.createView = i;
  const s = (S, B) => S << 32 - B | S >>> B;
  if (e.rotr = s, e.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68, !e.isLE)
    throw new Error("Non little-endian hardware is not supported");
  const o = Array.from({ length: 256 }, (S, B) => B.toString(16).padStart(2, "0"));
  function a(S) {
    if (!(S instanceof Uint8Array))
      throw new Error("Uint8Array expected");
    let B = "";
    for (let O = 0; O < S.length; O++)
      B += o[S[O]];
    return B;
  }
  e.bytesToHex = a;
  function h(S) {
    if (typeof S != "string")
      throw new TypeError("hexToBytes: expected string, got " + typeof S);
    if (S.length % 2)
      throw new Error("hexToBytes: received invalid unpadded hex");
    const B = new Uint8Array(S.length / 2);
    for (let O = 0; O < B.length; O++) {
      const L = O * 2, U = S.slice(L, L + 2), F = Number.parseInt(U, 16);
      if (Number.isNaN(F) || F < 0)
        throw new Error("Invalid byte sequence");
      B[O] = F;
    }
    return B;
  }
  e.hexToBytes = h;
  const l = async () => {
  };
  e.nextTick = l;
  async function u(S, B, O) {
    let L = Date.now();
    for (let U = 0; U < S; U++) {
      O(U);
      const F = Date.now() - L;
      F >= 0 && F < B || (await (0, e.nextTick)(), L += F);
    }
  }
  e.asyncLoop = u;
  function f(S) {
    if (typeof S != "string")
      throw new TypeError(`utf8ToBytes expected string, got ${typeof S}`);
    return new TextEncoder().encode(S);
  }
  e.utf8ToBytes = f;
  function g(S) {
    if (typeof S == "string" && (S = f(S)), !(S instanceof Uint8Array))
      throw new TypeError(`Expected input type is Uint8Array (got ${typeof S})`);
    return S;
  }
  e.toBytes = g;
  function p(...S) {
    if (!S.every((L) => L instanceof Uint8Array))
      throw new Error("Uint8Array list expected");
    if (S.length === 1)
      return S[0];
    const B = S.reduce((L, U) => L + U.length, 0), O = new Uint8Array(B);
    for (let L = 0, U = 0; L < S.length; L++) {
      const F = S[L];
      O.set(F, U), U += F.length;
    }
    return O;
  }
  e.concatBytes = p;
  class v {
    // Safe version that clones internal state
    clone() {
      return this._cloneInto();
    }
  }
  e.Hash = v;
  const A = (S) => Object.prototype.toString.call(S) === "[object Object]" && S.constructor === Object;
  function C(S, B) {
    if (B !== void 0 && (typeof B != "object" || !A(B)))
      throw new TypeError("Options should be object or undefined");
    return Object.assign(S, B);
  }
  e.checkOpts = C;
  function $(S) {
    const B = (L) => S().update(g(L)).digest(), O = S();
    return B.outputLen = O.outputLen, B.blockLen = O.blockLen, B.create = () => S(), B;
  }
  e.wrapConstructor = $;
  function N(S) {
    const B = (L, U) => S(U).update(g(L)).digest(), O = S({});
    return B.outputLen = O.outputLen, B.blockLen = O.blockLen, B.create = (L) => S(L), B;
  }
  e.wrapConstructorWithOpts = N;
  function E(S = 32) {
    if (t.crypto.web)
      return t.crypto.web.getRandomValues(new Uint8Array(S));
    if (t.crypto.node)
      return new Uint8Array(t.crypto.node.randomBytes(S).buffer);
    throw new Error("The environment doesn't have randomBytes function");
  }
  e.randomBytes = E;
})(Dt);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.hmac = void 0;
  const t = be, n = Dt;
  class r extends n.Hash {
    constructor(o, a) {
      super(), this.finished = !1, this.destroyed = !1, t.default.hash(o);
      const h = (0, n.toBytes)(a);
      if (this.iHash = o.create(), typeof this.iHash.update != "function")
        throw new TypeError("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const l = this.blockLen, u = new Uint8Array(l);
      u.set(h.length > l ? o.create().update(h).digest() : h);
      for (let f = 0; f < u.length; f++)
        u[f] ^= 54;
      this.iHash.update(u), this.oHash = o.create();
      for (let f = 0; f < u.length; f++)
        u[f] ^= 106;
      this.oHash.update(u), u.fill(0);
    }
    update(o) {
      return t.default.exists(this), this.iHash.update(o), this;
    }
    digestInto(o) {
      t.default.exists(this), t.default.bytes(o, this.outputLen), this.finished = !0, this.iHash.digestInto(o), this.oHash.update(o), this.oHash.digestInto(o), this.destroy();
    }
    digest() {
      const o = new Uint8Array(this.oHash.outputLen);
      return this.digestInto(o), o;
    }
    _cloneInto(o) {
      o || (o = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash: a, iHash: h, finished: l, destroyed: u, blockLen: f, outputLen: g } = this;
      return o = o, o.finished = l, o.destroyed = u, o.blockLen = f, o.outputLen = g, o.oHash = a._cloneInto(o.oHash), o.iHash = h._cloneInto(o.iHash), o;
    }
    destroy() {
      this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
    }
  }
  const i = (s, o, a) => new r(s, o).update(a).digest();
  e.hmac = i, e.hmac.create = (s, o) => new r(s, o);
})(Pa);
Object.defineProperty(ln, "__esModule", { value: !0 });
ln.pbkdf2Async = ln.pbkdf2 = void 0;
const Qn = be, ql = Pa, en = Dt;
function Na(e, t, n, r) {
  Qn.default.hash(e);
  const i = (0, en.checkOpts)({ dkLen: 32, asyncTick: 10 }, r), { c: s, dkLen: o, asyncTick: a } = i;
  if (Qn.default.number(s), Qn.default.number(o), Qn.default.number(a), s < 1)
    throw new Error("PBKDF2: iterations (c) should be >= 1");
  const h = (0, en.toBytes)(t), l = (0, en.toBytes)(n), u = new Uint8Array(o), f = ql.hmac.create(e, h), g = f._cloneInto().update(l);
  return { c: s, dkLen: o, asyncTick: a, DK: u, PRF: f, PRFSalt: g };
}
function Fa(e, t, n, r, i) {
  return e.destroy(), t.destroy(), r && r.destroy(), i.fill(0), n;
}
function Xl(e, t, n, r) {
  const { c: i, dkLen: s, DK: o, PRF: a, PRFSalt: h } = Na(e, t, n, r);
  let l;
  const u = new Uint8Array(4), f = (0, en.createView)(u), g = new Uint8Array(a.outputLen);
  for (let p = 1, v = 0; v < s; p++, v += a.outputLen) {
    const A = o.subarray(v, v + a.outputLen);
    f.setInt32(0, p, !1), (l = h._cloneInto(l)).update(u).digestInto(g), A.set(g.subarray(0, A.length));
    for (let C = 1; C < i; C++) {
      a._cloneInto(l).update(g).digestInto(g);
      for (let $ = 0; $ < A.length; $++)
        A[$] ^= g[$];
    }
  }
  return Fa(a, h, o, l, g);
}
ln.pbkdf2 = Xl;
async function Zl(e, t, n, r) {
  const { c: i, dkLen: s, asyncTick: o, DK: a, PRF: h, PRFSalt: l } = Na(e, t, n, r);
  let u;
  const f = new Uint8Array(4), g = (0, en.createView)(f), p = new Uint8Array(h.outputLen);
  for (let v = 1, A = 0; A < s; v++, A += h.outputLen) {
    const C = a.subarray(A, A + h.outputLen);
    g.setInt32(0, v, !1), (u = l._cloneInto(u)).update(f).digestInto(p), C.set(p.subarray(0, C.length)), await (0, en.asyncLoop)(i - 1, o, ($) => {
      h._cloneInto(u).update(p).digestInto(p);
      for (let N = 0; N < C.length; N++)
        C[N] ^= p[N];
    });
  }
  return Fa(h, l, a, u, p);
}
ln.pbkdf2Async = Zl;
var dn = {}, On = {};
Object.defineProperty(On, "__esModule", { value: !0 });
On.SHA2 = void 0;
const Wr = be, mn = Dt;
function Yl(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), h = r ? 4 : 0, l = r ? 0 : 4;
  e.setUint32(t + h, o, r), e.setUint32(t + l, a, r);
}
let Jl = class extends mn.Hash {
  constructor(t, n, r, i) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = (0, mn.createView)(this.buffer);
  }
  update(t) {
    Wr.default.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    t = (0, mn.toBytes)(t);
    const s = t.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const h = (0, mn.createView)(t);
        for (; i <= s - o; o += i)
          this.process(h, o);
        continue;
      }
      r.set(t.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Wr.default.exists(this), Wr.default.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let f = o; f < i; f++)
      n[f] = 0;
    Yl(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = (0, mn.createView)(t), h = this.outputLen;
    if (h % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = h / 4, u = this.get();
    if (l > u.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let f = 0; f < l; f++)
      a.setUint32(4 * f, u[f], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: a } = this;
    return t.length = i, t.pos = a, t.finished = s, t.destroyed = o, i % n && t.buffer.set(r), t;
  }
};
On.SHA2 = Jl;
Object.defineProperty(dn, "__esModule", { value: !0 });
dn.sha224 = dn.sha256 = void 0;
const Ql = On, Te = Dt, e0 = (e, t, n) => e & t ^ ~e & n, t0 = (e, t, n) => e & t ^ e & n ^ t & n, n0 = new Uint32Array([
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
]), ot = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), at = new Uint32Array(64);
let Ma = class extends Ql.SHA2 {
  constructor() {
    super(64, 32, 8, !1), this.A = ot[0] | 0, this.B = ot[1] | 0, this.C = ot[2] | 0, this.D = ot[3] | 0, this.E = ot[4] | 0, this.F = ot[5] | 0, this.G = ot[6] | 0, this.H = ot[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: i, E: s, F: o, G: a, H: h } = this;
    return [t, n, r, i, s, o, a, h];
  }
  // prettier-ignore
  set(t, n, r, i, s, o, a, h) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = a | 0, this.H = h | 0;
  }
  process(t, n) {
    for (let f = 0; f < 16; f++, n += 4)
      at[f] = t.getUint32(n, !1);
    for (let f = 16; f < 64; f++) {
      const g = at[f - 15], p = at[f - 2], v = (0, Te.rotr)(g, 7) ^ (0, Te.rotr)(g, 18) ^ g >>> 3, A = (0, Te.rotr)(p, 17) ^ (0, Te.rotr)(p, 19) ^ p >>> 10;
      at[f] = A + at[f - 7] + v + at[f - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: h, G: l, H: u } = this;
    for (let f = 0; f < 64; f++) {
      const g = (0, Te.rotr)(a, 6) ^ (0, Te.rotr)(a, 11) ^ (0, Te.rotr)(a, 25), p = u + g + e0(a, h, l) + n0[f] + at[f] | 0, A = ((0, Te.rotr)(r, 2) ^ (0, Te.rotr)(r, 13) ^ (0, Te.rotr)(r, 22)) + t0(r, i, s) | 0;
      u = l, l = h, h = a, a = o + p | 0, o = s, s = i, i = r, r = p + A | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, h = h + this.F | 0, l = l + this.G | 0, u = u + this.H | 0, this.set(r, i, s, o, a, h, l, u);
  }
  roundClean() {
    at.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, r0 = class extends Ma {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
dn.sha256 = (0, Te.wrapConstructor)(() => new Ma());
dn.sha224 = (0, Te.wrapConstructor)(() => new r0());
var Ue = {}, Da = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.add = e.toBig = e.split = e.fromBig = void 0;
  const t = BigInt(2 ** 32 - 1), n = BigInt(32);
  function r(d, x = !1) {
    return x ? { h: Number(d & t), l: Number(d >> n & t) } : { h: Number(d >> n & t) | 0, l: Number(d & t) | 0 };
  }
  e.fromBig = r;
  function i(d, x = !1) {
    let b = new Uint32Array(d.length), y = new Uint32Array(d.length);
    for (let H = 0; H < d.length; H++) {
      const { h: k, l: D } = r(d[H], x);
      [b[H], y[H]] = [k, D];
    }
    return [b, y];
  }
  e.split = i;
  const s = (d, x) => BigInt(d >>> 0) << n | BigInt(x >>> 0);
  e.toBig = s;
  const o = (d, x, b) => d >>> b, a = (d, x, b) => d << 32 - b | x >>> b, h = (d, x, b) => d >>> b | x << 32 - b, l = (d, x, b) => d << 32 - b | x >>> b, u = (d, x, b) => d << 64 - b | x >>> b - 32, f = (d, x, b) => d >>> b - 32 | x << 64 - b, g = (d, x) => x, p = (d, x) => d, v = (d, x, b) => d << b | x >>> 32 - b, A = (d, x, b) => x << b | d >>> 32 - b, C = (d, x, b) => x << b - 32 | d >>> 64 - b, $ = (d, x, b) => d << b - 32 | x >>> 64 - b;
  function N(d, x, b, y) {
    const H = (x >>> 0) + (y >>> 0);
    return { h: d + b + (H / 2 ** 32 | 0) | 0, l: H | 0 };
  }
  e.add = N;
  const E = (d, x, b) => (d >>> 0) + (x >>> 0) + (b >>> 0), S = (d, x, b, y) => x + b + y + (d / 2 ** 32 | 0) | 0, B = (d, x, b, y) => (d >>> 0) + (x >>> 0) + (b >>> 0) + (y >>> 0), O = (d, x, b, y, H) => x + b + y + H + (d / 2 ** 32 | 0) | 0, L = (d, x, b, y, H) => (d >>> 0) + (x >>> 0) + (b >>> 0) + (y >>> 0) + (H >>> 0), U = (d, x, b, y, H, k) => x + b + y + H + k + (d / 2 ** 32 | 0) | 0, F = {
    fromBig: r,
    split: i,
    toBig: e.toBig,
    shrSH: o,
    shrSL: a,
    rotrSH: h,
    rotrSL: l,
    rotrBH: u,
    rotrBL: f,
    rotr32H: g,
    rotr32L: p,
    rotlSH: v,
    rotlSL: A,
    rotlBH: C,
    rotlBL: $,
    add: N,
    add3L: E,
    add3H: S,
    add4L: B,
    add4H: O,
    add5H: U,
    add5L: L
  };
  e.default = F;
})(Da);
Object.defineProperty(Ue, "__esModule", { value: !0 });
Ue.sha384 = Ue.sha512_256 = Ue.sha512_224 = Ue.sha512 = Ue.SHA512 = void 0;
const i0 = On, q = Da, Br = Dt, [s0, o0] = q.default.split([
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
].map((e) => BigInt(e))), ct = new Uint32Array(80), ht = new Uint32Array(80);
let Pn = class extends i0.SHA2 {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: h, Eh: l, El: u, Fh: f, Fl: g, Gh: p, Gl: v, Hh: A, Hl: C } = this;
    return [t, n, r, i, s, o, a, h, l, u, f, g, p, v, A, C];
  }
  // prettier-ignore
  set(t, n, r, i, s, o, a, h, l, u, f, g, p, v, A, C) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = h | 0, this.Eh = l | 0, this.El = u | 0, this.Fh = f | 0, this.Fl = g | 0, this.Gh = p | 0, this.Gl = v | 0, this.Hh = A | 0, this.Hl = C | 0;
  }
  process(t, n) {
    for (let E = 0; E < 16; E++, n += 4)
      ct[E] = t.getUint32(n), ht[E] = t.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const S = ct[E - 15] | 0, B = ht[E - 15] | 0, O = q.default.rotrSH(S, B, 1) ^ q.default.rotrSH(S, B, 8) ^ q.default.shrSH(S, B, 7), L = q.default.rotrSL(S, B, 1) ^ q.default.rotrSL(S, B, 8) ^ q.default.shrSL(S, B, 7), U = ct[E - 2] | 0, F = ht[E - 2] | 0, d = q.default.rotrSH(U, F, 19) ^ q.default.rotrBH(U, F, 61) ^ q.default.shrSH(U, F, 6), x = q.default.rotrSL(U, F, 19) ^ q.default.rotrBL(U, F, 61) ^ q.default.shrSL(U, F, 6), b = q.default.add4L(L, x, ht[E - 7], ht[E - 16]), y = q.default.add4H(b, O, d, ct[E - 7], ct[E - 16]);
      ct[E] = y | 0, ht[E] = b | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: h, Dh: l, Dl: u, Eh: f, El: g, Fh: p, Fl: v, Gh: A, Gl: C, Hh: $, Hl: N } = this;
    for (let E = 0; E < 80; E++) {
      const S = q.default.rotrSH(f, g, 14) ^ q.default.rotrSH(f, g, 18) ^ q.default.rotrBH(f, g, 41), B = q.default.rotrSL(f, g, 14) ^ q.default.rotrSL(f, g, 18) ^ q.default.rotrBL(f, g, 41), O = f & p ^ ~f & A, L = g & v ^ ~g & C, U = q.default.add5L(N, B, L, o0[E], ht[E]), F = q.default.add5H(U, $, S, O, s0[E], ct[E]), d = U | 0, x = q.default.rotrSH(r, i, 28) ^ q.default.rotrBH(r, i, 34) ^ q.default.rotrBH(r, i, 39), b = q.default.rotrSL(r, i, 28) ^ q.default.rotrBL(r, i, 34) ^ q.default.rotrBL(r, i, 39), y = r & s ^ r & a ^ s & a, H = i & o ^ i & h ^ o & h;
      $ = A | 0, N = C | 0, A = p | 0, C = v | 0, p = f | 0, v = g | 0, { h: f, l: g } = q.default.add(l | 0, u | 0, F | 0, d | 0), l = a | 0, u = h | 0, a = s | 0, h = o | 0, s = r | 0, o = i | 0;
      const k = q.default.add3L(d, b, H);
      r = q.default.add3H(k, F, x, y), i = k | 0;
    }
    ({ h: r, l: i } = q.default.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = q.default.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: h } = q.default.add(this.Ch | 0, this.Cl | 0, a | 0, h | 0), { h: l, l: u } = q.default.add(this.Dh | 0, this.Dl | 0, l | 0, u | 0), { h: f, l: g } = q.default.add(this.Eh | 0, this.El | 0, f | 0, g | 0), { h: p, l: v } = q.default.add(this.Fh | 0, this.Fl | 0, p | 0, v | 0), { h: A, l: C } = q.default.add(this.Gh | 0, this.Gl | 0, A | 0, C | 0), { h: $, l: N } = q.default.add(this.Hh | 0, this.Hl | 0, $ | 0, N | 0), this.set(r, i, s, o, a, h, l, u, f, g, p, v, A, C, $, N);
  }
  roundClean() {
    ct.fill(0), ht.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
Ue.SHA512 = Pn;
let a0 = class extends Pn {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, c0 = class extends Pn {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, h0 = class extends Pn {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ue.sha512 = (0, Br.wrapConstructor)(() => new Pn());
Ue.sha512_224 = (0, Br.wrapConstructor)(() => new a0());
Ue.sha512_256 = (0, Br.wrapConstructor)(() => new c0());
Ue.sha384 = (0, Br.wrapConstructor)(() => new h0());
var Ni = {};
(function(e) {
  /*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(e, "__esModule", { value: !0 }), e.bytes = e.stringToBytes = e.str = e.bytesToString = e.hex = e.utf8 = e.bech32m = e.bech32 = e.base58check = e.createBase58check = e.base58xmr = e.base58xrp = e.base58flickr = e.base58 = e.base64urlnopad = e.base64url = e.base64nopad = e.base64 = e.base32crockford = e.base32hexnopad = e.base32hex = e.base32nopad = e.base32 = e.base16 = e.utils = void 0, e.assertNumber = t;
  // @__NO_SIDE_EFFECTS__
  function t(b) {
    if (!Number.isSafeInteger(b))
      throw new Error(`Wrong integer: ${b}`);
  }
  function n(b) {
    return b instanceof Uint8Array || b != null && typeof b == "object" && b.constructor.name === "Uint8Array";
  }
  // @__NO_SIDE_EFFECTS__
  function r(...b) {
    const y = (z) => z, H = (z, j) => (w) => z(j(w)), k = b.map((z) => z.encode).reduceRight(H, y), D = b.map((z) => z.decode).reduce(H, y);
    return { encode: k, decode: D };
  }
  // @__NO_SIDE_EFFECTS__
  function i(b) {
    return {
      encode: (y) => {
        if (!Array.isArray(y) || y.length && typeof y[0] != "number")
          throw new Error("alphabet.encode input should be an array of numbers");
        return y.map((H) => {
          if (H < 0 || H >= b.length)
            throw new Error(`Digit index outside alphabet: ${H} (alphabet: ${b.length})`);
          return b[H];
        });
      },
      decode: (y) => {
        if (!Array.isArray(y) || y.length && typeof y[0] != "string")
          throw new Error("alphabet.decode input should be array of strings");
        return y.map((H) => {
          if (typeof H != "string")
            throw new Error(`alphabet.decode: not string element=${H}`);
          const k = b.indexOf(H);
          if (k === -1)
            throw new Error(`Unknown letter: "${H}". Allowed: ${b}`);
          return k;
        });
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function s(b = "") {
    if (typeof b != "string")
      throw new Error("join separator should be string");
    return {
      encode: (y) => {
        if (!Array.isArray(y) || y.length && typeof y[0] != "string")
          throw new Error("join.encode input should be array of strings");
        for (let H of y)
          if (typeof H != "string")
            throw new Error(`join.encode: non-string input=${H}`);
        return y.join(b);
      },
      decode: (y) => {
        if (typeof y != "string")
          throw new Error("join.decode input should be string");
        return y.split(b);
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function o(b, y = "=") {
    if (typeof y != "string")
      throw new Error("padding chr should be string");
    return {
      encode(H) {
        if (!Array.isArray(H) || H.length && typeof H[0] != "string")
          throw new Error("padding.encode input should be array of strings");
        for (let k of H)
          if (typeof k != "string")
            throw new Error(`padding.encode: non-string input=${k}`);
        for (; H.length * b % 8; )
          H.push(y);
        return H;
      },
      decode(H) {
        if (!Array.isArray(H) || H.length && typeof H[0] != "string")
          throw new Error("padding.encode input should be array of strings");
        for (let D of H)
          if (typeof D != "string")
            throw new Error(`padding.decode: non-string input=${D}`);
        let k = H.length;
        if (k * b % 8)
          throw new Error("Invalid padding: string should have whole number of bytes");
        for (; k > 0 && H[k - 1] === y; k--)
          if (!((k - 1) * b % 8))
            throw new Error("Invalid padding: string has too much padding");
        return H.slice(0, k);
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function a(b) {
    if (typeof b != "function")
      throw new Error("normalize fn should be function");
    return { encode: (y) => y, decode: (y) => b(y) };
  }
  // @__NO_SIDE_EFFECTS__
  function h(b, y, H) {
    if (y < 2)
      throw new Error(`convertRadix: wrong from=${y}, base cannot be less than 2`);
    if (H < 2)
      throw new Error(`convertRadix: wrong to=${H}, base cannot be less than 2`);
    if (!Array.isArray(b))
      throw new Error("convertRadix: data should be array");
    if (!b.length)
      return [];
    let k = 0;
    const D = [], z = Array.from(b);
    for (z.forEach((j) => {
      if (j < 0 || j >= y)
        throw new Error(`Wrong integer: ${j}`);
    }); ; ) {
      let j = 0, w = !0;
      for (let I = k; I < z.length; I++) {
        const ne = z[I], Q = y * j + ne;
        if (!Number.isSafeInteger(Q) || y * j / y !== j || Q - ne !== y * j)
          throw new Error("convertRadix: carry overflow");
        j = Q % H;
        const K = Math.floor(Q / H);
        if (z[I] = K, !Number.isSafeInteger(K) || K * H + j !== Q)
          throw new Error("convertRadix: carry overflow");
        if (w)
          K ? w = !1 : k = I;
        else continue;
      }
      if (D.push(j), w)
        break;
    }
    for (let j = 0; j < b.length - 1 && b[j] === 0; j++)
      D.push(0);
    return D.reverse();
  }
  const l = /* @__NO_SIDE_EFFECTS__ */ (b, y) => y ? /* @__PURE__ */ l(y, b % y) : b, u = /* @__NO_SIDE_EFFECTS__ */ (b, y) => b + (y - /* @__PURE__ */ l(b, y));
  // @__NO_SIDE_EFFECTS__
  function f(b, y, H, k) {
    if (!Array.isArray(b))
      throw new Error("convertRadix2: data should be array");
    if (y <= 0 || y > 32)
      throw new Error(`convertRadix2: wrong from=${y}`);
    if (H <= 0 || H > 32)
      throw new Error(`convertRadix2: wrong to=${H}`);
    if (/* @__PURE__ */ u(y, H) > 32)
      throw new Error(`convertRadix2: carry overflow from=${y} to=${H} carryBits=${/* @__PURE__ */ u(y, H)}`);
    let D = 0, z = 0;
    const j = 2 ** H - 1, w = [];
    for (const I of b) {
      if (I >= 2 ** y)
        throw new Error(`convertRadix2: invalid data word=${I} from=${y}`);
      if (D = D << y | I, z + y > 32)
        throw new Error(`convertRadix2: carry overflow pos=${z} from=${y}`);
      for (z += y; z >= H; z -= H)
        w.push((D >> z - H & j) >>> 0);
      D &= 2 ** z - 1;
    }
    if (D = D << H - z & j, !k && z >= y)
      throw new Error("Excess padding");
    if (!k && D)
      throw new Error(`Non-zero padding: ${D}`);
    return k && z > 0 && w.push(D >>> 0), w;
  }
  // @__NO_SIDE_EFFECTS__
  function g(b) {
    return {
      encode: (y) => {
        if (!n(y))
          throw new Error("radix.encode input should be Uint8Array");
        return /* @__PURE__ */ h(Array.from(y), 2 ** 8, b);
      },
      decode: (y) => {
        if (!Array.isArray(y) || y.length && typeof y[0] != "number")
          throw new Error("radix.decode input should be array of numbers");
        return Uint8Array.from(/* @__PURE__ */ h(y, b, 2 ** 8));
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function p(b, y = !1) {
    if (b <= 0 || b > 32)
      throw new Error("radix2: bits should be in (0..32]");
    if (/* @__PURE__ */ u(8, b) > 32 || /* @__PURE__ */ u(b, 8) > 32)
      throw new Error("radix2: carry overflow");
    return {
      encode: (H) => {
        if (!n(H))
          throw new Error("radix2.encode input should be Uint8Array");
        return /* @__PURE__ */ f(Array.from(H), 8, b, !y);
      },
      decode: (H) => {
        if (!Array.isArray(H) || H.length && typeof H[0] != "number")
          throw new Error("radix2.decode input should be array of numbers");
        return Uint8Array.from(/* @__PURE__ */ f(H, b, 8, y));
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function v(b) {
    if (typeof b != "function")
      throw new Error("unsafeWrapper fn should be function");
    return function(...y) {
      try {
        return b.apply(null, y);
      } catch {
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function A(b, y) {
    if (typeof y != "function")
      throw new Error("checksum fn should be function");
    return {
      encode(H) {
        if (!n(H))
          throw new Error("checksum.encode: input should be Uint8Array");
        const k = y(H).slice(0, b), D = new Uint8Array(H.length + b);
        return D.set(H), D.set(k, H.length), D;
      },
      decode(H) {
        if (!n(H))
          throw new Error("checksum.decode: input should be Uint8Array");
        const k = H.slice(0, -b), D = y(k).slice(0, b), z = H.slice(-b);
        for (let j = 0; j < b; j++)
          if (D[j] !== z[j])
            throw new Error("Invalid checksum");
        return k;
      }
    };
  }
  e.utils = {
    alphabet: i,
    chain: r,
    checksum: A,
    convertRadix: h,
    convertRadix2: f,
    radix: g,
    radix2: p,
    join: s,
    padding: o
  }, e.base16 = /* @__PURE__ */ r(/* @__PURE__ */ p(4), /* @__PURE__ */ i("0123456789ABCDEF"), /* @__PURE__ */ s("")), e.base32 = /* @__PURE__ */ r(/* @__PURE__ */ p(5), /* @__PURE__ */ i("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), /* @__PURE__ */ o(5), /* @__PURE__ */ s("")), e.base32nopad = /* @__PURE__ */ r(/* @__PURE__ */ p(5), /* @__PURE__ */ i("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), /* @__PURE__ */ s("")), e.base32hex = /* @__PURE__ */ r(/* @__PURE__ */ p(5), /* @__PURE__ */ i("0123456789ABCDEFGHIJKLMNOPQRSTUV"), /* @__PURE__ */ o(5), /* @__PURE__ */ s("")), e.base32hexnopad = /* @__PURE__ */ r(/* @__PURE__ */ p(5), /* @__PURE__ */ i("0123456789ABCDEFGHIJKLMNOPQRSTUV"), /* @__PURE__ */ s("")), e.base32crockford = /* @__PURE__ */ r(/* @__PURE__ */ p(5), /* @__PURE__ */ i("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), /* @__PURE__ */ s(""), /* @__PURE__ */ a((b) => b.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1"))), e.base64 = /* @__PURE__ */ r(/* @__PURE__ */ p(6), /* @__PURE__ */ i("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), /* @__PURE__ */ o(6), /* @__PURE__ */ s("")), e.base64nopad = /* @__PURE__ */ r(/* @__PURE__ */ p(6), /* @__PURE__ */ i("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), /* @__PURE__ */ s("")), e.base64url = /* @__PURE__ */ r(/* @__PURE__ */ p(6), /* @__PURE__ */ i("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), /* @__PURE__ */ o(6), /* @__PURE__ */ s("")), e.base64urlnopad = /* @__PURE__ */ r(/* @__PURE__ */ p(6), /* @__PURE__ */ i("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), /* @__PURE__ */ s(""));
  const C = (b) => /* @__PURE__ */ r(/* @__PURE__ */ g(58), /* @__PURE__ */ i(b), /* @__PURE__ */ s(""));
  e.base58 = C("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"), e.base58flickr = C("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"), e.base58xrp = C("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");
  const $ = [0, 2, 3, 5, 6, 7, 9, 10, 11];
  e.base58xmr = {
    encode(b) {
      let y = "";
      for (let H = 0; H < b.length; H += 8) {
        const k = b.subarray(H, H + 8);
        y += e.base58.encode(k).padStart($[k.length], "1");
      }
      return y;
    },
    decode(b) {
      let y = [];
      for (let H = 0; H < b.length; H += 11) {
        const k = b.slice(H, H + 11), D = $.indexOf(k.length), z = e.base58.decode(k);
        for (let j = 0; j < z.length - D; j++)
          if (z[j] !== 0)
            throw new Error("base58xmr: wrong padding");
        y = y.concat(Array.from(z.slice(z.length - D)));
      }
      return Uint8Array.from(y);
    }
  };
  const N = (b) => /* @__PURE__ */ r(/* @__PURE__ */ A(4, (y) => b(b(y))), e.base58);
  e.createBase58check = N, e.base58check = e.createBase58check;
  const E = /* @__PURE__ */ r(/* @__PURE__ */ i("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), /* @__PURE__ */ s("")), S = [996825010, 642813549, 513874426, 1027748829, 705979059];
  // @__NO_SIDE_EFFECTS__
  function B(b) {
    const y = b >> 25;
    let H = (b & 33554431) << 5;
    for (let k = 0; k < S.length; k++)
      (y >> k & 1) === 1 && (H ^= S[k]);
    return H;
  }
  // @__NO_SIDE_EFFECTS__
  function O(b, y, H = 1) {
    const k = b.length;
    let D = 1;
    for (let z = 0; z < k; z++) {
      const j = b.charCodeAt(z);
      if (j < 33 || j > 126)
        throw new Error(`Invalid prefix (${b})`);
      D = /* @__PURE__ */ B(D) ^ j >> 5;
    }
    D = /* @__PURE__ */ B(D);
    for (let z = 0; z < k; z++)
      D = /* @__PURE__ */ B(D) ^ b.charCodeAt(z) & 31;
    for (let z of y)
      D = /* @__PURE__ */ B(D) ^ z;
    for (let z = 0; z < 6; z++)
      D = /* @__PURE__ */ B(D);
    return D ^= H, E.encode(/* @__PURE__ */ f([D % 2 ** 30], 30, 5, !1));
  }
  // @__NO_SIDE_EFFECTS__
  function L(b) {
    const y = b === "bech32" ? 1 : 734539939, H = /* @__PURE__ */ p(5), k = H.decode, D = H.encode, z = /* @__PURE__ */ v(k);
    function j(K, J, pe = 90) {
      if (typeof K != "string")
        throw new Error(`bech32.encode prefix should be string, not ${typeof K}`);
      if (J instanceof Uint8Array && (J = Array.from(J)), !Array.isArray(J) || J.length && typeof J[0] != "number")
        throw new Error(`bech32.encode words should be array of numbers, not ${typeof J}`);
      if (K.length === 0)
        throw new TypeError(`Invalid prefix length ${K.length}`);
      const Ie = K.length + 7 + J.length;
      if (pe !== !1 && Ie > pe)
        throw new TypeError(`Length ${Ie} exceeds limit ${pe}`);
      const Ve = K.toLowerCase(), Et = /* @__PURE__ */ O(Ve, J, y);
      return `${Ve}1${E.encode(J)}${Et}`;
    }
    function w(K, J = 90) {
      if (typeof K != "string")
        throw new Error(`bech32.decode input should be string, not ${typeof K}`);
      if (K.length < 8 || J !== !1 && K.length > J)
        throw new TypeError(`Wrong string length: ${K.length} (${K}). Expected (8..${J})`);
      const pe = K.toLowerCase();
      if (K !== pe && K !== K.toUpperCase())
        throw new Error("String must be lowercase or uppercase");
      const Ie = pe.lastIndexOf("1");
      if (Ie === 0 || Ie === -1)
        throw new Error('Letter "1" must be present between prefix and data only');
      const Ve = pe.slice(0, Ie), Et = pe.slice(Ie + 1);
      if (Et.length < 6)
        throw new Error("Data must be at least 6 characters long");
      const Nn = E.decode(Et).slice(0, -6), Fn = /* @__PURE__ */ O(Ve, Nn, y);
      if (!Et.endsWith(Fn))
        throw new Error(`Invalid checksum in ${K}: expected "${Fn}"`);
      return { prefix: Ve, words: Nn };
    }
    const I = /* @__PURE__ */ v(w);
    function ne(K) {
      const { prefix: J, words: pe } = w(K, !1);
      return { prefix: J, words: pe, bytes: k(pe) };
    }
    function Q(K, J) {
      return j(K, D(J));
    }
    return {
      encode: j,
      decode: w,
      encodeFromBytes: Q,
      decodeToBytes: ne,
      decodeUnsafe: I,
      fromWords: k,
      fromWordsUnsafe: z,
      toWords: D
    };
  }
  e.bech32 = /* @__PURE__ */ L("bech32"), e.bech32m = /* @__PURE__ */ L("bech32m"), e.utf8 = {
    encode: (b) => new TextDecoder().decode(b),
    decode: (b) => new TextEncoder().encode(b)
  }, e.hex = /* @__PURE__ */ r(/* @__PURE__ */ p(4), /* @__PURE__ */ i("0123456789abcdef"), /* @__PURE__ */ s(""), /* @__PURE__ */ a((b) => {
    if (typeof b != "string" || b.length % 2)
      throw new TypeError(`hex.decode: expected string, got ${typeof b} with length ${b.length}`);
    return b.toLowerCase();
  }));
  const U = {
    utf8: e.utf8,
    hex: e.hex,
    base16: e.base16,
    base32: e.base32,
    base64: e.base64,
    base64url: e.base64url,
    base58: e.base58,
    base58xmr: e.base58xmr
  }, F = "Invalid encoding type. Available types: utf8, hex, base16, base32, base64, base64url, base58, base58xmr", d = (b, y) => {
    if (typeof b != "string" || !U.hasOwnProperty(b))
      throw new TypeError(F);
    if (!n(y))
      throw new TypeError("bytesToString() expects Uint8Array");
    return U[b].encode(y);
  };
  e.bytesToString = d, e.str = e.bytesToString;
  const x = (b, y) => {
    if (!U.hasOwnProperty(b))
      throw new TypeError(F);
    if (typeof y != "string")
      throw new TypeError("stringToBytes() expects string");
    return U[b].decode(y);
  };
  e.stringToBytes = x, e.bytes = e.stringToBytes;
})(Ni);
Object.defineProperty(Ce, "__esModule", { value: !0 });
var Ka = Ce.mnemonicToSeedSync = Ce.mnemonicToSeed = Ya = Ce.validateMnemonic = Ce.entropyToMnemonic = Ce.mnemonicToEntropy = Wa = Ce.generateMnemonic = void 0;
/*! scure-bip39 - MIT License (c) 2022 Patricio Palladino, Paul Miller (paulmillr.com) */
const za = be, Ra = ln, f0 = dn, Va = Ue, u0 = Dt, er = Ni, l0 = (e) => e[0] === "あいこくしん";
function ja(e) {
  if (typeof e != "string")
    throw new TypeError(`Invalid mnemonic type: ${typeof e}`);
  return e.normalize("NFKD");
}
function Fi(e) {
  const t = ja(e), n = t.split(" ");
  if (![12, 15, 18, 21, 24].includes(n.length))
    throw new Error("Invalid mnemonic");
  return { nfkd: t, words: n };
}
function Ga(e) {
  za.default.bytes(e, 16, 20, 24, 28, 32);
}
function d0(e, t = 128) {
  if (za.default.number(t), t % 32 !== 0 || t > 256)
    throw new TypeError("Invalid entropy");
  return Za((0, u0.randomBytes)(t / 8), e);
}
var Wa = Ce.generateMnemonic = d0;
const b0 = (e) => {
  const t = 8 - e.length / 4;
  return new Uint8Array([(0, f0.sha256)(e)[0] >> t << t]);
};
function qa(e) {
  if (!Array.isArray(e) || e.length !== 2 ** 11 || typeof e[0] != "string")
    throw new Error("Worlist: expected array of 2048 strings");
  return e.forEach((t) => {
    if (typeof t != "string")
      throw new Error(`Wordlist: non-string element: ${t}`);
  }), er.utils.chain(er.utils.checksum(1, b0), er.utils.radix2(11, !0), er.utils.alphabet(e));
}
function Xa(e, t) {
  const { words: n } = Fi(e), r = qa(t).decode(n);
  return Ga(r), r;
}
Ce.mnemonicToEntropy = Xa;
function Za(e, t) {
  return Ga(e), qa(t).encode(e).join(l0(t) ? "　" : " ");
}
Ce.entropyToMnemonic = Za;
function p0(e, t) {
  try {
    Xa(e, t);
  } catch {
    return !1;
  }
  return !0;
}
var Ya = Ce.validateMnemonic = p0;
const Ja = (e) => ja(`mnemonic${e}`);
function g0(e, t = "") {
  return (0, Ra.pbkdf2Async)(Va.sha512, Fi(e).nfkd, Ja(t), { c: 2048, dkLen: 64 });
}
Ce.mnemonicToSeed = g0;
function y0(e, t = "") {
  return (0, Ra.pbkdf2)(Va.sha512, Fi(e).nfkd, Ja(t), { c: 2048, dkLen: 64 });
}
Ka = Ce.mnemonicToSeedSync = y0;
var Mi = {};
Object.defineProperty(Mi, "__esModule", { value: !0 });
var Di = Mi.wordlist = void 0;
Di = Mi.wordlist = `abandon
ability
able
about
above
absent
absorb
abstract
absurd
abuse
access
accident
account
accuse
achieve
acid
acoustic
acquire
across
act
action
actor
actress
actual
adapt
add
addict
address
adjust
admit
adult
advance
advice
aerobic
affair
afford
afraid
again
age
agent
agree
ahead
aim
air
airport
aisle
alarm
album
alcohol
alert
alien
all
alley
allow
almost
alone
alpha
already
also
alter
always
amateur
amazing
among
amount
amused
analyst
anchor
ancient
anger
angle
angry
animal
ankle
announce
annual
another
answer
antenna
antique
anxiety
any
apart
apology
appear
apple
approve
april
arch
arctic
area
arena
argue
arm
armed
armor
army
around
arrange
arrest
arrive
arrow
art
artefact
artist
artwork
ask
aspect
assault
asset
assist
assume
asthma
athlete
atom
attack
attend
attitude
attract
auction
audit
august
aunt
author
auto
autumn
average
avocado
avoid
awake
aware
away
awesome
awful
awkward
axis
baby
bachelor
bacon
badge
bag
balance
balcony
ball
bamboo
banana
banner
bar
barely
bargain
barrel
base
basic
basket
battle
beach
bean
beauty
because
become
beef
before
begin
behave
behind
believe
below
belt
bench
benefit
best
betray
better
between
beyond
bicycle
bid
bike
bind
biology
bird
birth
bitter
black
blade
blame
blanket
blast
bleak
bless
blind
blood
blossom
blouse
blue
blur
blush
board
boat
body
boil
bomb
bone
bonus
book
boost
border
boring
borrow
boss
bottom
bounce
box
boy
bracket
brain
brand
brass
brave
bread
breeze
brick
bridge
brief
bright
bring
brisk
broccoli
broken
bronze
broom
brother
brown
brush
bubble
buddy
budget
buffalo
build
bulb
bulk
bullet
bundle
bunker
burden
burger
burst
bus
business
busy
butter
buyer
buzz
cabbage
cabin
cable
cactus
cage
cake
call
calm
camera
camp
can
canal
cancel
candy
cannon
canoe
canvas
canyon
capable
capital
captain
car
carbon
card
cargo
carpet
carry
cart
case
cash
casino
castle
casual
cat
catalog
catch
category
cattle
caught
cause
caution
cave
ceiling
celery
cement
census
century
cereal
certain
chair
chalk
champion
change
chaos
chapter
charge
chase
chat
cheap
check
cheese
chef
cherry
chest
chicken
chief
child
chimney
choice
choose
chronic
chuckle
chunk
churn
cigar
cinnamon
circle
citizen
city
civil
claim
clap
clarify
claw
clay
clean
clerk
clever
click
client
cliff
climb
clinic
clip
clock
clog
close
cloth
cloud
clown
club
clump
cluster
clutch
coach
coast
coconut
code
coffee
coil
coin
collect
color
column
combine
come
comfort
comic
common
company
concert
conduct
confirm
congress
connect
consider
control
convince
cook
cool
copper
copy
coral
core
corn
correct
cost
cotton
couch
country
couple
course
cousin
cover
coyote
crack
cradle
craft
cram
crane
crash
crater
crawl
crazy
cream
credit
creek
crew
cricket
crime
crisp
critic
crop
cross
crouch
crowd
crucial
cruel
cruise
crumble
crunch
crush
cry
crystal
cube
culture
cup
cupboard
curious
current
curtain
curve
cushion
custom
cute
cycle
dad
damage
damp
dance
danger
daring
dash
daughter
dawn
day
deal
debate
debris
decade
december
decide
decline
decorate
decrease
deer
defense
define
defy
degree
delay
deliver
demand
demise
denial
dentist
deny
depart
depend
deposit
depth
deputy
derive
describe
desert
design
desk
despair
destroy
detail
detect
develop
device
devote
diagram
dial
diamond
diary
dice
diesel
diet
differ
digital
dignity
dilemma
dinner
dinosaur
direct
dirt
disagree
discover
disease
dish
dismiss
disorder
display
distance
divert
divide
divorce
dizzy
doctor
document
dog
doll
dolphin
domain
donate
donkey
donor
door
dose
double
dove
draft
dragon
drama
drastic
draw
dream
dress
drift
drill
drink
drip
drive
drop
drum
dry
duck
dumb
dune
during
dust
dutch
duty
dwarf
dynamic
eager
eagle
early
earn
earth
easily
east
easy
echo
ecology
economy
edge
edit
educate
effort
egg
eight
either
elbow
elder
electric
elegant
element
elephant
elevator
elite
else
embark
embody
embrace
emerge
emotion
employ
empower
empty
enable
enact
end
endless
endorse
enemy
energy
enforce
engage
engine
enhance
enjoy
enlist
enough
enrich
enroll
ensure
enter
entire
entry
envelope
episode
equal
equip
era
erase
erode
erosion
error
erupt
escape
essay
essence
estate
eternal
ethics
evidence
evil
evoke
evolve
exact
example
excess
exchange
excite
exclude
excuse
execute
exercise
exhaust
exhibit
exile
exist
exit
exotic
expand
expect
expire
explain
expose
express
extend
extra
eye
eyebrow
fabric
face
faculty
fade
faint
faith
fall
false
fame
family
famous
fan
fancy
fantasy
farm
fashion
fat
fatal
father
fatigue
fault
favorite
feature
february
federal
fee
feed
feel
female
fence
festival
fetch
fever
few
fiber
fiction
field
figure
file
film
filter
final
find
fine
finger
finish
fire
firm
first
fiscal
fish
fit
fitness
fix
flag
flame
flash
flat
flavor
flee
flight
flip
float
flock
floor
flower
fluid
flush
fly
foam
focus
fog
foil
fold
follow
food
foot
force
forest
forget
fork
fortune
forum
forward
fossil
foster
found
fox
fragile
frame
frequent
fresh
friend
fringe
frog
front
frost
frown
frozen
fruit
fuel
fun
funny
furnace
fury
future
gadget
gain
galaxy
gallery
game
gap
garage
garbage
garden
garlic
garment
gas
gasp
gate
gather
gauge
gaze
general
genius
genre
gentle
genuine
gesture
ghost
giant
gift
giggle
ginger
giraffe
girl
give
glad
glance
glare
glass
glide
glimpse
globe
gloom
glory
glove
glow
glue
goat
goddess
gold
good
goose
gorilla
gospel
gossip
govern
gown
grab
grace
grain
grant
grape
grass
gravity
great
green
grid
grief
grit
grocery
group
grow
grunt
guard
guess
guide
guilt
guitar
gun
gym
habit
hair
half
hammer
hamster
hand
happy
harbor
hard
harsh
harvest
hat
have
hawk
hazard
head
health
heart
heavy
hedgehog
height
hello
helmet
help
hen
hero
hidden
high
hill
hint
hip
hire
history
hobby
hockey
hold
hole
holiday
hollow
home
honey
hood
hope
horn
horror
horse
hospital
host
hotel
hour
hover
hub
huge
human
humble
humor
hundred
hungry
hunt
hurdle
hurry
hurt
husband
hybrid
ice
icon
idea
identify
idle
ignore
ill
illegal
illness
image
imitate
immense
immune
impact
impose
improve
impulse
inch
include
income
increase
index
indicate
indoor
industry
infant
inflict
inform
inhale
inherit
initial
inject
injury
inmate
inner
innocent
input
inquiry
insane
insect
inside
inspire
install
intact
interest
into
invest
invite
involve
iron
island
isolate
issue
item
ivory
jacket
jaguar
jar
jazz
jealous
jeans
jelly
jewel
job
join
joke
journey
joy
judge
juice
jump
jungle
junior
junk
just
kangaroo
keen
keep
ketchup
key
kick
kid
kidney
kind
kingdom
kiss
kit
kitchen
kite
kitten
kiwi
knee
knife
knock
know
lab
label
labor
ladder
lady
lake
lamp
language
laptop
large
later
latin
laugh
laundry
lava
law
lawn
lawsuit
layer
lazy
leader
leaf
learn
leave
lecture
left
leg
legal
legend
leisure
lemon
lend
length
lens
leopard
lesson
letter
level
liar
liberty
library
license
life
lift
light
like
limb
limit
link
lion
liquid
list
little
live
lizard
load
loan
lobster
local
lock
logic
lonely
long
loop
lottery
loud
lounge
love
loyal
lucky
luggage
lumber
lunar
lunch
luxury
lyrics
machine
mad
magic
magnet
maid
mail
main
major
make
mammal
man
manage
mandate
mango
mansion
manual
maple
marble
march
margin
marine
market
marriage
mask
mass
master
match
material
math
matrix
matter
maximum
maze
meadow
mean
measure
meat
mechanic
medal
media
melody
melt
member
memory
mention
menu
mercy
merge
merit
merry
mesh
message
metal
method
middle
midnight
milk
million
mimic
mind
minimum
minor
minute
miracle
mirror
misery
miss
mistake
mix
mixed
mixture
mobile
model
modify
mom
moment
monitor
monkey
monster
month
moon
moral
more
morning
mosquito
mother
motion
motor
mountain
mouse
move
movie
much
muffin
mule
multiply
muscle
museum
mushroom
music
must
mutual
myself
mystery
myth
naive
name
napkin
narrow
nasty
nation
nature
near
neck
need
negative
neglect
neither
nephew
nerve
nest
net
network
neutral
never
news
next
nice
night
noble
noise
nominee
noodle
normal
north
nose
notable
note
nothing
notice
novel
now
nuclear
number
nurse
nut
oak
obey
object
oblige
obscure
observe
obtain
obvious
occur
ocean
october
odor
off
offer
office
often
oil
okay
old
olive
olympic
omit
once
one
onion
online
only
open
opera
opinion
oppose
option
orange
orbit
orchard
order
ordinary
organ
orient
original
orphan
ostrich
other
outdoor
outer
output
outside
oval
oven
over
own
owner
oxygen
oyster
ozone
pact
paddle
page
pair
palace
palm
panda
panel
panic
panther
paper
parade
parent
park
parrot
party
pass
patch
path
patient
patrol
pattern
pause
pave
payment
peace
peanut
pear
peasant
pelican
pen
penalty
pencil
people
pepper
perfect
permit
person
pet
phone
photo
phrase
physical
piano
picnic
picture
piece
pig
pigeon
pill
pilot
pink
pioneer
pipe
pistol
pitch
pizza
place
planet
plastic
plate
play
please
pledge
pluck
plug
plunge
poem
poet
point
polar
pole
police
pond
pony
pool
popular
portion
position
possible
post
potato
pottery
poverty
powder
power
practice
praise
predict
prefer
prepare
present
pretty
prevent
price
pride
primary
print
priority
prison
private
prize
problem
process
produce
profit
program
project
promote
proof
property
prosper
protect
proud
provide
public
pudding
pull
pulp
pulse
pumpkin
punch
pupil
puppy
purchase
purity
purpose
purse
push
put
puzzle
pyramid
quality
quantum
quarter
question
quick
quit
quiz
quote
rabbit
raccoon
race
rack
radar
radio
rail
rain
raise
rally
ramp
ranch
random
range
rapid
rare
rate
rather
raven
raw
razor
ready
real
reason
rebel
rebuild
recall
receive
recipe
record
recycle
reduce
reflect
reform
refuse
region
regret
regular
reject
relax
release
relief
rely
remain
remember
remind
remove
render
renew
rent
reopen
repair
repeat
replace
report
require
rescue
resemble
resist
resource
response
result
retire
retreat
return
reunion
reveal
review
reward
rhythm
rib
ribbon
rice
rich
ride
ridge
rifle
right
rigid
ring
riot
ripple
risk
ritual
rival
river
road
roast
robot
robust
rocket
romance
roof
rookie
room
rose
rotate
rough
round
route
royal
rubber
rude
rug
rule
run
runway
rural
sad
saddle
sadness
safe
sail
salad
salmon
salon
salt
salute
same
sample
sand
satisfy
satoshi
sauce
sausage
save
say
scale
scan
scare
scatter
scene
scheme
school
science
scissors
scorpion
scout
scrap
screen
script
scrub
sea
search
season
seat
second
secret
section
security
seed
seek
segment
select
sell
seminar
senior
sense
sentence
series
service
session
settle
setup
seven
shadow
shaft
shallow
share
shed
shell
sheriff
shield
shift
shine
ship
shiver
shock
shoe
shoot
shop
short
shoulder
shove
shrimp
shrug
shuffle
shy
sibling
sick
side
siege
sight
sign
silent
silk
silly
silver
similar
simple
since
sing
siren
sister
situate
six
size
skate
sketch
ski
skill
skin
skirt
skull
slab
slam
sleep
slender
slice
slide
slight
slim
slogan
slot
slow
slush
small
smart
smile
smoke
smooth
snack
snake
snap
sniff
snow
soap
soccer
social
sock
soda
soft
solar
soldier
solid
solution
solve
someone
song
soon
sorry
sort
soul
sound
soup
source
south
space
spare
spatial
spawn
speak
special
speed
spell
spend
sphere
spice
spider
spike
spin
spirit
split
spoil
sponsor
spoon
sport
spot
spray
spread
spring
spy
square
squeeze
squirrel
stable
stadium
staff
stage
stairs
stamp
stand
start
state
stay
steak
steel
stem
step
stereo
stick
still
sting
stock
stomach
stone
stool
story
stove
strategy
street
strike
strong
struggle
student
stuff
stumble
style
subject
submit
subway
success
such
sudden
suffer
sugar
suggest
suit
summer
sun
sunny
sunset
super
supply
supreme
sure
surface
surge
surprise
surround
survey
suspect
sustain
swallow
swamp
swap
swarm
swear
sweet
swift
swim
swing
switch
sword
symbol
symptom
syrup
system
table
tackle
tag
tail
talent
talk
tank
tape
target
task
taste
tattoo
taxi
teach
team
tell
ten
tenant
tennis
tent
term
test
text
thank
that
theme
then
theory
there
they
thing
this
thought
three
thrive
throw
thumb
thunder
ticket
tide
tiger
tilt
timber
time
tiny
tip
tired
tissue
title
toast
tobacco
today
toddler
toe
together
toilet
token
tomato
tomorrow
tone
tongue
tonight
tool
tooth
top
topic
topple
torch
tornado
tortoise
toss
total
tourist
toward
tower
town
toy
track
trade
traffic
tragic
train
transfer
trap
trash
travel
tray
treat
tree
trend
trial
tribe
trick
trigger
trim
trip
trophy
trouble
truck
true
truly
trumpet
trust
truth
try
tube
tuition
tumble
tuna
tunnel
turkey
turn
turtle
twelve
twenty
twice
twin
twist
two
type
typical
ugly
umbrella
unable
unaware
uncle
uncover
under
undo
unfair
unfold
unhappy
uniform
unique
unit
universe
unknown
unlock
until
unusual
unveil
update
upgrade
uphold
upon
upper
upset
urban
urge
usage
use
used
useful
useless
usual
utility
vacant
vacuum
vague
valid
valley
valve
van
vanish
vapor
various
vast
vault
vehicle
velvet
vendor
venture
venue
verb
verify
version
very
vessel
veteran
viable
vibrant
vicious
victory
video
view
village
vintage
violin
virtual
virus
visa
visit
visual
vital
vivid
vocal
voice
void
volcano
volume
vote
voyage
wage
wagon
wait
walk
wall
walnut
want
warfare
warm
warrior
wash
wasp
waste
water
wave
way
wealth
weapon
wear
weasel
weather
web
wedding
weekend
weird
welcome
west
wet
whale
what
wheat
wheel
when
where
whip
whisper
wide
width
wife
wild
will
win
window
wine
wing
wink
winner
winter
wire
wisdom
wise
wish
witness
wolf
woman
wonder
wood
wool
word
work
world
worry
worth
wrap
wreck
wrestle
wrist
write
wrong
yard
year
yellow
you
young
youth
zebra
zero
zone
zoo`.split(`
`);
function fi(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function w0(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function It(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function x0(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  fi(e.outputLen), fi(e.blockLen);
}
function m0(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function S0(e, t) {
  It(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const $t = {
  number: fi,
  bool: w0,
  bytes: It,
  hash: x0,
  exists: m0,
  output: S0
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const tn = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), De = (e, t) => e << 32 - t | e >>> t, A0 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!A0)
  throw new Error("Non little-endian hardware is not supported");
const E0 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function v0(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += E0[e[n]];
  return t;
}
function H0(e) {
  if (typeof e != "string")
    throw new TypeError("hexToBytes: expected string, got " + typeof e);
  if (e.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex");
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, i = e.slice(r, r + 2), s = Number.parseInt(i, 16);
    if (Number.isNaN(s) || s < 0)
      throw new Error("Invalid byte sequence");
    t[n] = s;
  }
  return t;
}
function Qa(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Ki(e) {
  if (typeof e == "string" && (e = Qa(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
function tr(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, i) => r + i.length, 0), n = new Uint8Array(t);
  for (let r = 0, i = 0; r < e.length; r++) {
    const s = e[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
class ec {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Kt(e) {
  const t = (r) => e().update(Ki(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
class tc extends ec {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, $t.hash(t);
    const r = Ki(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const i = this.blockLen, s = new Uint8Array(i);
    s.set(r.length > i ? t.create().update(r).digest() : r);
    for (let o = 0; o < s.length; o++)
      s[o] ^= 54;
    this.iHash.update(s), this.oHash = t.create();
    for (let o = 0; o < s.length; o++)
      s[o] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(t) {
    return $t.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    $t.exists(this), $t.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: i, destroyed: s, blockLen: o, outputLen: a } = this;
    return t = t, t.finished = i, t.destroyed = s, t.blockLen = o, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const gr = (e, t, n) => new tc(e, t).update(n).digest();
gr.create = (e, t) => new tc(e, t);
function B0(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), h = r ? 4 : 0, l = r ? 0 : 4;
  e.setUint32(t + h, o, r), e.setUint32(t + l, a, r);
}
class zi extends ec {
  constructor(t, n, r, i) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = tn(this.buffer);
  }
  update(t) {
    $t.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    t = Ki(t);
    const s = t.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const h = tn(t);
        for (; i <= s - o; o += i)
          this.process(h, o);
        continue;
      }
      r.set(t.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    $t.exists(this), $t.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let f = o; f < i; f++)
      n[f] = 0;
    B0(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = tn(t), h = this.outputLen;
    if (h % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = h / 4, u = this.get();
    if (l > u.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let f = 0; f < l; f++)
      a.setUint32(4 * f, u[f], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: a } = this;
    return t.length = i, t.pos = a, t.finished = s, t.destroyed = o, i % n && t.buffer.set(r), t;
  }
}
const _0 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), nc = Uint8Array.from({ length: 16 }, (e, t) => t), C0 = nc.map((e) => (9 * e + 5) % 16);
let Ri = [nc], Vi = [C0];
for (let e = 0; e < 4; e++)
  for (let t of [Ri, Vi])
    t.push(t[e].map((n) => _0[n]));
const rc = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), I0 = Ri.map((e, t) => e.map((n) => rc[t][n])), k0 = Vi.map((e, t) => e.map((n) => rc[t][n])), T0 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), U0 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), nr = (e, t) => e << t | e >>> 32 - t;
function eo(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const rr = new Uint32Array(16);
class $0 extends zi {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: i, h4: s } = this;
    return [t, n, r, i, s];
  }
  set(t, n, r, i, s) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = i | 0, this.h4 = s | 0;
  }
  process(t, n) {
    for (let p = 0; p < 16; p++, n += 4)
      rr[p] = t.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, h = a, l = this.h3 | 0, u = l, f = this.h4 | 0, g = f;
    for (let p = 0; p < 5; p++) {
      const v = 4 - p, A = T0[p], C = U0[p], $ = Ri[p], N = Vi[p], E = I0[p], S = k0[p];
      for (let B = 0; B < 16; B++) {
        const O = nr(r + eo(p, s, a, l) + rr[$[B]] + A, E[B]) + f | 0;
        r = f, f = l, l = nr(a, 10) | 0, a = s, s = O;
      }
      for (let B = 0; B < 16; B++) {
        const O = nr(i + eo(v, o, h, u) + rr[N[B]] + C, S[B]) + g | 0;
        i = g, g = u, u = nr(h, 10) | 0, h = o, o = O;
      }
    }
    this.set(this.h1 + a + u | 0, this.h2 + l + g | 0, this.h3 + f + i | 0, this.h4 + r + o | 0, this.h0 + s + h | 0);
  }
  roundClean() {
    rr.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const L0 = Kt(() => new $0()), O0 = (e, t, n) => e & t ^ ~e & n, P0 = (e, t, n) => e & t ^ e & n ^ t & n, N0 = new Uint32Array([
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
]), ft = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ut = new Uint32Array(64);
class ic extends zi {
  constructor() {
    super(64, 32, 8, !1), this.A = ft[0] | 0, this.B = ft[1] | 0, this.C = ft[2] | 0, this.D = ft[3] | 0, this.E = ft[4] | 0, this.F = ft[5] | 0, this.G = ft[6] | 0, this.H = ft[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: i, E: s, F: o, G: a, H: h } = this;
    return [t, n, r, i, s, o, a, h];
  }
  // prettier-ignore
  set(t, n, r, i, s, o, a, h) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = a | 0, this.H = h | 0;
  }
  process(t, n) {
    for (let f = 0; f < 16; f++, n += 4)
      ut[f] = t.getUint32(n, !1);
    for (let f = 16; f < 64; f++) {
      const g = ut[f - 15], p = ut[f - 2], v = De(g, 7) ^ De(g, 18) ^ g >>> 3, A = De(p, 17) ^ De(p, 19) ^ p >>> 10;
      ut[f] = A + ut[f - 7] + v + ut[f - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: h, G: l, H: u } = this;
    for (let f = 0; f < 64; f++) {
      const g = De(a, 6) ^ De(a, 11) ^ De(a, 25), p = u + g + O0(a, h, l) + N0[f] + ut[f] | 0, A = (De(r, 2) ^ De(r, 13) ^ De(r, 22)) + P0(r, i, s) | 0;
      u = l, l = h, h = a, a = o + p | 0, o = s, s = i, i = r, r = p + A | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, h = h + this.F | 0, l = l + this.G | 0, u = u + this.H | 0, this.set(r, i, s, o, a, h, l, u);
  }
  roundClean() {
    ut.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class F0 extends ic {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const ji = Kt(() => new ic());
Kt(() => new F0());
const ir = BigInt(2 ** 32 - 1), ui = BigInt(32);
function sc(e, t = !1) {
  return t ? { h: Number(e & ir), l: Number(e >> ui & ir) } : { h: Number(e >> ui & ir) | 0, l: Number(e & ir) | 0 };
}
function M0(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let i = 0; i < e.length; i++) {
    const { h: s, l: o } = sc(e[i], t);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const D0 = (e, t) => BigInt(e >>> 0) << ui | BigInt(t >>> 0), K0 = (e, t, n) => e >>> n, z0 = (e, t, n) => e << 32 - n | t >>> n, R0 = (e, t, n) => e >>> n | t << 32 - n, V0 = (e, t, n) => e << 32 - n | t >>> n, j0 = (e, t, n) => e << 64 - n | t >>> n - 32, G0 = (e, t, n) => e >>> n - 32 | t << 64 - n, W0 = (e, t) => t, q0 = (e, t) => e, X0 = (e, t, n) => e << n | t >>> 32 - n, Z0 = (e, t, n) => t << n | e >>> 32 - n, Y0 = (e, t, n) => t << n - 32 | e >>> 64 - n, J0 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function Q0(e, t, n, r) {
  const i = (t >>> 0) + (r >>> 0);
  return { h: e + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const ed = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), td = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, nd = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), rd = (e, t, n, r, i) => t + n + r + i + (e / 2 ** 32 | 0) | 0, id = (e, t, n, r, i) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), sd = (e, t, n, r, i, s) => t + n + r + i + s + (e / 2 ** 32 | 0) | 0, X = {
  fromBig: sc,
  split: M0,
  toBig: D0,
  shrSH: K0,
  shrSL: z0,
  rotrSH: R0,
  rotrSL: V0,
  rotrBH: j0,
  rotrBL: G0,
  rotr32H: W0,
  rotr32L: q0,
  rotlSH: X0,
  rotlSL: Z0,
  rotlBH: Y0,
  rotlBL: J0,
  add: Q0,
  add3L: ed,
  add3H: td,
  add4L: nd,
  add4H: rd,
  add5H: sd,
  add5L: id
}, [od, ad] = X.split([
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
].map((e) => BigInt(e))), lt = new Uint32Array(80), dt = new Uint32Array(80);
class _r extends zi {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: h, Eh: l, El: u, Fh: f, Fl: g, Gh: p, Gl: v, Hh: A, Hl: C } = this;
    return [t, n, r, i, s, o, a, h, l, u, f, g, p, v, A, C];
  }
  // prettier-ignore
  set(t, n, r, i, s, o, a, h, l, u, f, g, p, v, A, C) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = h | 0, this.Eh = l | 0, this.El = u | 0, this.Fh = f | 0, this.Fl = g | 0, this.Gh = p | 0, this.Gl = v | 0, this.Hh = A | 0, this.Hl = C | 0;
  }
  process(t, n) {
    for (let E = 0; E < 16; E++, n += 4)
      lt[E] = t.getUint32(n), dt[E] = t.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const S = lt[E - 15] | 0, B = dt[E - 15] | 0, O = X.rotrSH(S, B, 1) ^ X.rotrSH(S, B, 8) ^ X.shrSH(S, B, 7), L = X.rotrSL(S, B, 1) ^ X.rotrSL(S, B, 8) ^ X.shrSL(S, B, 7), U = lt[E - 2] | 0, F = dt[E - 2] | 0, d = X.rotrSH(U, F, 19) ^ X.rotrBH(U, F, 61) ^ X.shrSH(U, F, 6), x = X.rotrSL(U, F, 19) ^ X.rotrBL(U, F, 61) ^ X.shrSL(U, F, 6), b = X.add4L(L, x, dt[E - 7], dt[E - 16]), y = X.add4H(b, O, d, lt[E - 7], lt[E - 16]);
      lt[E] = y | 0, dt[E] = b | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: h, Dh: l, Dl: u, Eh: f, El: g, Fh: p, Fl: v, Gh: A, Gl: C, Hh: $, Hl: N } = this;
    for (let E = 0; E < 80; E++) {
      const S = X.rotrSH(f, g, 14) ^ X.rotrSH(f, g, 18) ^ X.rotrBH(f, g, 41), B = X.rotrSL(f, g, 14) ^ X.rotrSL(f, g, 18) ^ X.rotrBL(f, g, 41), O = f & p ^ ~f & A, L = g & v ^ ~g & C, U = X.add5L(N, B, L, ad[E], dt[E]), F = X.add5H(U, $, S, O, od[E], lt[E]), d = U | 0, x = X.rotrSH(r, i, 28) ^ X.rotrBH(r, i, 34) ^ X.rotrBH(r, i, 39), b = X.rotrSL(r, i, 28) ^ X.rotrBL(r, i, 34) ^ X.rotrBL(r, i, 39), y = r & s ^ r & a ^ s & a, H = i & o ^ i & h ^ o & h;
      $ = A | 0, N = C | 0, A = p | 0, C = v | 0, p = f | 0, v = g | 0, { h: f, l: g } = X.add(l | 0, u | 0, F | 0, d | 0), l = a | 0, u = h | 0, a = s | 0, h = o | 0, s = r | 0, o = i | 0;
      const k = X.add3L(d, b, H);
      r = X.add3H(k, F, x, y), i = k | 0;
    }
    ({ h: r, l: i } = X.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = X.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: h } = X.add(this.Ch | 0, this.Cl | 0, a | 0, h | 0), { h: l, l: u } = X.add(this.Dh | 0, this.Dl | 0, l | 0, u | 0), { h: f, l: g } = X.add(this.Eh | 0, this.El | 0, f | 0, g | 0), { h: p, l: v } = X.add(this.Fh | 0, this.Fl | 0, p | 0, v | 0), { h: A, l: C } = X.add(this.Gh | 0, this.Gl | 0, A | 0, C | 0), { h: $, l: N } = X.add(this.Hh | 0, this.Hl | 0, $ | 0, N | 0), this.set(r, i, s, o, a, h, l, u, f, g, p, v, A, C, $, N);
  }
  roundClean() {
    lt.fill(0), dt.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class cd extends _r {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class hd extends _r {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class fd extends _r {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
const to = Kt(() => new _r());
Kt(() => new cd());
Kt(() => new hd());
Kt(() => new fd());
Be.hmacSha256Sync = (e, ...t) => gr(ji, e, Be.concatBytes(...t));
const qr = Ni.base58check(ji);
function no(e) {
  return BigInt(`0x${v0(e)}`);
}
function ud(e) {
  return H0(e.toString(16).padStart(64, "0"));
}
const ld = Qa("Bitcoin seed"), Xr = { private: 76066276, public: 76067358 }, Zr = 2147483648, dd = (e) => L0(ji(e)), bd = (e) => tn(e).getUint32(0, !1), sr = (e) => {
  if (!Number.isSafeInteger(e) || e < 0 || e > 2 ** 32 - 1)
    throw new Error(`Invalid number=${e}. Should be from 0 to 2 ** 32 - 1`);
  const t = new Uint8Array(4);
  return tn(t).setUint32(0, e, !1), t;
};
class kt {
  constructor(t) {
    if (this.depth = 0, this.index = 0, this.chainCode = null, this.parentFingerprint = 0, !t || typeof t != "object")
      throw new Error("HDKey.constructor must not be called directly");
    if (this.versions = t.versions || Xr, this.depth = t.depth || 0, this.chainCode = t.chainCode, this.index = t.index || 0, this.parentFingerprint = t.parentFingerprint || 0, !this.depth && (this.parentFingerprint || this.index))
      throw new Error("HDKey: zero depth with non-zero index/parent fingerprint");
    if (t.publicKey && t.privateKey)
      throw new Error("HDKey: publicKey and privateKey at same time.");
    if (t.privateKey) {
      if (!Be.isValidPrivateKey(t.privateKey))
        throw new Error("Invalid private key");
      this.privKey = typeof t.privateKey == "bigint" ? t.privateKey : no(t.privateKey), this.privKeyBytes = ud(this.privKey), this.pubKey = yo(t.privateKey, !0);
    } else if (t.publicKey)
      this.pubKey = te.fromHex(t.publicKey).toRawBytes(!0);
    else
      throw new Error("HDKey: no public or private key provided");
    this.pubHash = dd(this.pubKey);
  }
  get fingerprint() {
    if (!this.pubHash)
      throw new Error("No publicKey set!");
    return bd(this.pubHash);
  }
  get identifier() {
    return this.pubHash;
  }
  get pubKeyHash() {
    return this.pubHash;
  }
  get privateKey() {
    return this.privKeyBytes || null;
  }
  get publicKey() {
    return this.pubKey || null;
  }
  get privateExtendedKey() {
    const t = this.privateKey;
    if (!t)
      throw new Error("No private key");
    return qr.encode(this.serialize(this.versions.private, tr(new Uint8Array([0]), t)));
  }
  get publicExtendedKey() {
    if (!this.pubKey)
      throw new Error("No public key");
    return qr.encode(this.serialize(this.versions.public, this.pubKey));
  }
  static fromMasterSeed(t, n = Xr) {
    if (It(t), 8 * t.length < 128 || 8 * t.length > 512)
      throw new Error(`HDKey: wrong seed length=${t.length}. Should be between 128 and 512 bits; 256 bits is advised)`);
    const r = gr(to, ld, t);
    return new kt({
      versions: n,
      chainCode: r.slice(32),
      privateKey: r.slice(0, 32)
    });
  }
  static fromExtendedKey(t, n = Xr) {
    const r = qr.decode(t), i = tn(r), s = i.getUint32(0, !1), o = {
      versions: n,
      depth: r[4],
      parentFingerprint: i.getUint32(5, !1),
      index: i.getUint32(9, !1),
      chainCode: r.slice(13, 45)
    }, a = r.slice(45), h = a[0] === 0;
    if (s !== n[h ? "private" : "public"])
      throw new Error("Version mismatch");
    return h ? new kt({ ...o, privateKey: a.slice(1) }) : new kt({ ...o, publicKey: a });
  }
  static fromJSON(t) {
    return kt.fromExtendedKey(t.xpriv);
  }
  derive(t) {
    if (!/^[mM]'?/.test(t))
      throw new Error('Path must start with "m" or "M"');
    if (/^[mM]'?$/.test(t))
      return this;
    const n = t.replace(/^[mM]'?\//, "").split("/");
    let r = this;
    for (const i of n) {
      const s = /^(\d+)('?)$/.exec(i);
      if (!s || s.length !== 3)
        throw new Error(`Invalid child index: ${i}`);
      let o = +s[1];
      if (!Number.isSafeInteger(o) || o >= Zr)
        throw new Error("Invalid index");
      s[2] === "'" && (o += Zr), r = r.deriveChild(o);
    }
    return r;
  }
  deriveChild(t) {
    if (!this.pubKey || !this.chainCode)
      throw new Error("No publicKey or chainCode set");
    let n = sr(t);
    if (t >= Zr) {
      const a = this.privateKey;
      if (!a)
        throw new Error("Could not derive hardened child key");
      n = tr(new Uint8Array([0]), a, n);
    } else
      n = tr(this.pubKey, n);
    const r = gr(to, this.chainCode, n), i = no(r.slice(0, 32)), s = r.slice(32);
    if (!Be.isValidPrivateKey(i))
      throw new Error("Tweak bigger than curve order");
    const o = {
      versions: this.versions,
      chainCode: s,
      depth: this.depth + 1,
      parentFingerprint: this.fingerprint,
      index: t
    };
    try {
      if (this.privateKey) {
        const a = Be.mod(this.privKey + i, he.n);
        if (!Be.isValidPrivateKey(a))
          throw new Error("The tweak was out of range or the resulted private key is invalid");
        o.privateKey = a;
      } else {
        const a = te.fromHex(this.pubKey).add(te.fromPrivateKey(i));
        if (a.equals(te.ZERO))
          throw new Error("The tweak was equal to negative P, which made the result key invalid");
        o.publicKey = a.toRawBytes(!0);
      }
      return new kt(o);
    } catch {
      return this.deriveChild(t + 1);
    }
  }
  sign(t) {
    if (!this.privateKey)
      throw new Error("No privateKey set!");
    return It(t, 32), mo(t, this.privKey, {
      canonical: !0,
      der: !1
    });
  }
  verify(t, n) {
    if (It(t, 32), It(n, 64), !this.publicKey)
      throw new Error("No publicKey set!");
    let r;
    try {
      r = Ne.fromCompact(n);
    } catch {
      return !1;
    }
    return Qf(r, t, this.publicKey);
  }
  wipePrivateData() {
    return this.privKey = void 0, this.privKeyBytes && (this.privKeyBytes.fill(0), this.privKeyBytes = void 0), this;
  }
  toJSON() {
    return {
      xpriv: this.privateExtendedKey,
      xpub: this.publicExtendedKey
    };
  }
  serialize(t, n) {
    if (!this.chainCode)
      throw new Error("No chainCode set");
    return It(n, 33), tr(sr(t), new Uint8Array([this.depth]), sr(this.parentFingerprint), sr(this.index), this.chainCode, n);
  }
}
const pd = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", gd = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", yd = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function wd(e) {
  var n, r, i, s;
  const t = (e == null ? void 0 : e.success) === !0 ? (n = e.value) == null ? void 0 : n.value : null;
  return !t || ((r = t.version) == null ? void 0 : r.value) !== "1" || ((i = t["holder-payment"]) == null ? void 0 : i.value) !== "50" || ((s = t["receipt-bytes"]) == null ? void 0 : s.value) !== "16" || yd.some((o, a) => {
    var h;
    return ((h = t["core-" + (a + 1)]) == null ? void 0 : h.value) !== pd + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const xd = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", oc = 50n, md = 1000n;
function Sd(e, t = Date.now()) {
  if (!/^\d+$/.test(e.fee) || BigInt(e.fee) < 1n || BigInt(e.fee) > 10000n || !/^\d+$/.test(e.budget) || BigInt(e.budget) > 1000000n || BigInt(e.budget) < BigInt(e.fee) + oc) throw Error("Invalid fee or budget (maximum 1 STX).");
  if (!Number.isInteger(e.max) || e.max < 1 || e.max > 20 || !Number.isFinite(e.expires) || e.expires <= t || e.expires > t + 30 * 6e4 || ![1, 2, 3].includes(e.core) || !e.songs.length || e.songs.length > 20 || e.songs.some((n) => !Number.isSafeInteger(n) || n < 0)) throw Error("Invalid test session. Maximum 20 starts and 30 minutes.");
}
class Ad {
  constructor(t) {
    Dr(this, "used", 0n);
    Dr(this, "count", 0);
    this.policy = t, Sd(t);
  }
  consume(t, n, r, i = Date.now()) {
    const s = this.policy, o = r + oc;
    if (i >= s.expires || this.count >= s.max || r !== BigInt(s.fee) || t !== s.core || !s.songs.includes(n) || this.used + o > BigInt(s.budget)) throw Error("Test session limit reached or terms changed.");
    this.used += o, this.count++;
  }
}
const [yr, Gi] = xd.split("."), Ze = (e) => Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
function ar(e) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(e)) throw Error("Invalid encoded data.");
  return Uint8Array.from(e.match(/../g), (t) => parseInt(t, 16));
}
async function Ed(e) {
  return Ze(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(e))));
}
async function wr(e, t = {}) {
  const n = await fetch("/hiro/mainnet" + e, { ...t, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function ac(e, t = []) {
  const n = await wr(`/v2/contracts/call-read/${yr}/${Gi}/${e}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: yr, arguments: t.map((r) => "0x" + Ze(ze(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Wt(qt(n.result));
}
async function vd() {
  const e = await wr(`/v2/contracts/source/${yr}/${Gi}?proof=0`);
  if (typeof e.source != "string" || await Ed(e.source) !== gd) throw Error("Deployed source does not match the tested helper.");
  if (wd(await ac("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Cr(e) {
  return e.startsWith("SP") && ll(e) && !e.includes(".");
}
async function cc(e) {
  var r;
  if (!Cr(e)) throw Error("Invalid mainnet wallet address.");
  const t = await wr(`/v2/accounts/${e}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(t.balance) || !Number.isSafeInteger(t.nonce) || t.nonce < 0) throw Error("Malformed account data.");
  const n = await wr(`/extended/v1/address/${e}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== t.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= t.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(t.balance), nonce: BigInt(t.nonce) };
}
async function Hd(e, t) {
  var i, s;
  const n = await ac("get-owner", [br(e), br(t)]), r = (n == null ? void 0 : n.success) === !0 ? (s = (i = n.value) == null ? void 0 : i.value) == null ? void 0 : s.value : null;
  if (typeof r != "string" || !Cr(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
function hc(e, t, n, r, i, s, o) {
  if (![1, 2, 3].includes(n) || !Number.isSafeInteger(r) || r < 0 || !/^[0-9a-f]{32}$/.test(i)) throw Error("Invalid play request.");
  return { contractAddress: yr, contractName: Gi, functionName: "play", functionArgs: [br(n), br(r), Gl(ar(i))], publicKey: t, fee: s, nonce: o, network: new Ye(), anchorMode: Se.Any, postConditionMode: Bn.Deny, postConditions: [Vl(e, ei.Equal, 50n)] };
}
async function Bd(e, t, n, r, i, s) {
  await vd();
  const o = await cc(e), a = await Hd(n, r);
  if (a === e) throw Error("Your test wallet holds this master; self-payment is not supported.");
  const h = await hi(hc(e, t, n, r, i, s, o.nonce));
  return { recipient: a, nonce: o.nonce.toString(), balance: o.balance.toString(), bytes: h.serialize().length };
}
async function _d(e, t, n, r, i) {
  if (i < 1n || i > 10000n) throw Error("Withdrawal fee outside test limits.");
  if (!Cr(n) || n === e || r <= 0n) throw Error("Choose a different standard mainnet recipient and positive amount.");
  const s = await cc(e);
  if (r + i > s.balance) throw Error("Insufficient balance for amount plus fee.");
  const o = await ci({ recipient: n, amount: r, fee: i, nonce: s.nonce, publicKey: t, network: new Ye(), memo: "Radio test withdrawal", anchorMode: Se.Any });
  return { nonce: s.nonce.toString(), bytes: o.serialize().length };
}
const Wi = new TextEncoder();
function fc(e) {
  if (!Ya(e, Di)) throw Error("Invalid recovery seed.");
  const t = kt.fromMasterSeed(Ka(e)).derive("m/44'/5757'/0'/0/0");
  if (!t.privateKey) throw Error("Key derivation failed.");
  const n = Ze(t.privateKey) + "01";
  return { privateKey: n, address: Ou(n, He.Mainnet), publicKey: Ze(t.publicKey) };
}
async function uc(e, t, n) {
  if (e.length < 12 || e.length > 1024) throw Error("Use a password of at least 12 characters.");
  const r = await crypto.subtle.importKey("raw", Wi.encode(e), "PBKDF2", !1, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", hash: "SHA-256", salt: new Uint8Array(t).buffer, iterations: 6e5 }, r, { name: "AES-GCM", length: 256 }, !1, n);
}
function lc(e) {
  return Wi.encode("xtrata-radio-test-wallet:1:mainnet:" + e.address + ":" + e.publicKey);
}
function Cd(e) {
  const t = e;
  if (!t || t.version !== 1 || t.network !== "mainnet" || t.iterations !== 6e5 || !Cr(t.address) || !/^(02|03)[0-9a-f]{64}$/.test(t.publicKey) || !/^[0-9a-f]{32}$/.test(t.salt) || !/^[0-9a-f]{24}$/.test(t.iv) || typeof t.ciphertext != "string" || t.ciphertext.length > 4096 || !/^(?:[0-9a-f]{2})+$/.test(t.ciphertext)) throw Error("Not a supported encrypted listening-wallet backup.");
  return t;
}
async function Id(e) {
  const t = Wa(Di, 128), n = fc(t), r = crypto.getRandomValues(new Uint8Array(16)), i = crypto.getRandomValues(new Uint8Array(12)), s = { version: 1, network: "mainnet", address: n.address, publicKey: n.publicKey, salt: Ze(r), iv: Ze(i), iterations: 6e5, ciphertext: "" };
  return s.ciphertext = Ze(new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: i, additionalData: lc(s) }, await uc(e, r, ["encrypt"]), Wi.encode(t)))), s;
}
async function ro(e, t) {
  const n = Cd(e);
  try {
    const r = await crypto.subtle.decrypt({ name: "AES-GCM", iv: ar(n.iv), additionalData: lc(n) }, await uc(t, ar(n.salt), ["decrypt"]), ar(n.ciphertext)), i = fc(new TextDecoder().decode(r));
    if (new Uint8Array(r).fill(0), i.address !== n.address || i.publicKey !== n.publicKey) throw Error();
    return i;
  } catch {
    throw Error("Incorrect password or damaged backup. No wallet was changed.");
  }
}
let We = null, Gt = null, _t = 0, Yr = !1;
self.onmessage = async (e) => {
  const { id: t, op: n, data: r } = e.data;
  if (n === "lock" || n === "stop") {
    _t++, Gt = null, n === "lock" && (We = null), self.postMessage({ id: t, result: !0 });
    return;
  }
  if (Yr) {
    self.postMessage({ id: t, error: "Signer busy. Wait for the existing operation." });
    return;
  }
  Yr = !0;
  const i = _t;
  try {
    let s;
    if (n === "ping") s = !0;
    else if (n === "create") s = await Id(r.password);
    else if (n === "open") {
      const o = await ro(r.vault, r.password);
      if (_t !== i) throw Error("Wallet locked.");
      We = o, s = { address: o.address, publicKey: o.publicKey };
    } else if (n === "verify-backup") {
      const o = await ro(r.vault, r.password);
      s = { address: o.address, publicKey: o.publicKey };
    } else if (n === "arm") {
      if (!We) throw Error("Unlock the listening wallet first.");
      Gt = new Ad(r), s = !0;
    } else if (n === "sign-play") {
      if (!We || !Gt) throw Error("No authorised test session.");
      const o = We, a = Gt, h = BigInt(r.fee), l = await Bd(o.address, o.publicKey, r.core, r.song, r.receipt, h);
      if (_t !== i || We !== o || Gt !== a) throw Error("Test stopped.");
      if (l.nonce !== r.nonce || l.recipient !== r.recipient) throw Error("Owner or nonce changed. Review the transaction again.");
      if (BigInt(l.balance) < h + 50n + md) throw Error("Not enough funds after retaining 0.001 STX for recovery fees.");
      a.consume(r.core, r.song, h);
      const u = await Rl({ ...hc(o.address, o.publicKey, r.core, r.song, r.receipt, h, BigInt(r.nonce)), senderKey: o.privateKey });
      if (_t !== i) throw Error("Test stopped before submission.");
      s = { raw: Ze(u.serialize()), txid: "0x" + u.txid() };
    } else if (n === "withdraw") {
      if (!We) throw Error("Unlock the wallet first.");
      Gt = null;
      const o = We, a = await _d(o.address, o.publicKey, r.recipient, BigInt(r.amount), BigInt(r.fee));
      if (_t !== i || We !== o || a.nonce !== r.nonce) throw Error("Wallet or nonce changed. Review again.");
      const h = await zl({ recipient: r.recipient, amount: BigInt(r.amount), fee: BigInt(r.fee), nonce: BigInt(r.nonce), network: new Ye(), memo: "Radio test withdrawal", anchorMode: Se.Any, senderKey: o.privateKey });
      if (_t !== i) throw Error("Wallet locked.");
      s = { raw: Ze(h.serialize()), txid: "0x" + h.txid() };
    } else throw Error("Unsupported signer operation.");
    self.postMessage({ id: t, result: s });
  } catch (s) {
    self.postMessage({ id: t, error: s instanceof Error ? s.message : "Signer operation failed." });
  } finally {
    Yr = !1;
  }
};
