var hc = Object.defineProperty;
var uc = (t, e, n) => e in t ? hc(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var He = (t, e, n) => uc(t, typeof e != "symbol" ? e + "" : e, n);
const Ps = "xtrata.wallet.bridge.v1", lc = (t) => typeof t == "object" && t !== null && t.protocol === Ps, dc = (t) => lc(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", gc = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class Ie extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const Jr = 12e4;
class pc {
  constructor(e) {
    He(this, "pending", /* @__PURE__ */ new Map());
    He(this, "listenTarget");
    He(this, "closed", !1);
    /**
     * Validate and route an incoming message.
     *
     * Three checks, all required:
     *  1. `event.origin` matches the wallet origin exactly — no prefix or suffix
     *     matching, since `https://wallet.xtrata.xyz.evil.com` would pass those.
     *  2. `event.source` is our iframe's window — origin alone is not enough, as
     *     any frame from that origin could otherwise answer.
     *  3. The id matches a request we actually sent, so an unsolicited or replayed
     *     response is dropped rather than resolving a stale caller.
     */
    He(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !dc(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new Ie("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new Ie("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new Ie("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = gc(), o = { protocol: Ps, kind: "request", id: s, method: e, params: n };
    return new Promise((c, a) => {
      const f = setTimeout(() => {
        this.pending.delete(s), a(
          new Ie(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? Jr}ms.`
          )
        );
      }, this.options.timeoutMs ?? Jr);
      this.pending.set(s, { resolve: c, reject: a, timer: f }), r.postMessage(o, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new Ie("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
function qt(t, e, n) {
  return lr(at(t, e), n);
}
function at(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Y(r);
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
      const r = wc(BigInt(`0x${$(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${$(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function ts(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Ge(t, e = 8) {
  return (typeof t == "bigint" ? t : at(t, !1)).toString(16).padStart(e * 2, "0");
}
function Bn(t) {
  return parseInt(t, 16);
}
function lr(t, e = 16) {
  const n = Ge(t, e);
  return Y(n);
}
function bc(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function yc(t, e) {
  return t & BigInt(1) << e;
}
function wc(t, e) {
  return yc(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const xc = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function $(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += xc[n];
  return e;
}
function Y(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t;
  const e = t.length % 2 ? `0${t}` : t, n = new Uint8Array(e.length / 2);
  for (let r = 0; r < n.length; r++) {
    const s = r * 2, o = e.slice(s, s + 2), c = Number.parseInt(o, 16);
    if (Number.isNaN(c) || c < 0)
      throw new Error("Invalid byte sequence");
    n[r] = c;
  }
  return n;
}
function We(t) {
  return new TextEncoder().encode(t);
}
function dr(t) {
  return new TextDecoder().decode(t);
}
function Sc(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function mc(t) {
  return String.fromCharCode.apply(null, t);
}
function Ac(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function es(t) {
  if (t.some(Ac))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Hn(...t) {
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
function J(t) {
  return Hn(...t.map((e) => typeof e == "number" ? es([e]) : e instanceof Array ? es(e) : e));
}
var ns;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ns || (ns = {}));
var rs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(rs || (rs = {}));
var ss;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ss || (ss = {}));
const Os = 33, Kn = 32;
function Ec(t) {
  if (t.length < Kn * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Kn * 2), r = t.slice(2 + Kn * 2);
  return {
    recoveryId: Bn(e),
    r: n,
    s: r
  };
}
function Bc(t) {
  const e = typeof t == "string" ? Y(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Hc(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Ic(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function Cc(t, e) {
  return t[e];
}
function _c(t, e, n = 0) {
  return t[n] = e, t;
}
function vc(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function re(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Yn;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Yn || (Yn = {}));
const Tc = Yn.Mainnet, Uc = 128, Lc = 128, ks = 16, ee = 32, Rn = 80, In = 65, Pc = 32, Oc = 64, gn = 34;
var H;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(H || (H = {}));
var k;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(k || (k = {}));
var Qn;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Qn || (Qn = {}));
var lt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(lt || (lt = {}));
const dn = ["onChainOnly", "offChainOnly", "any"], is = {
  [dn[0]]: lt.OnChainOnly,
  [dn[1]]: lt.OffChainOnly,
  [dn[2]]: lt.Any,
  [lt.OnChainOnly]: lt.OnChainOnly,
  [lt.OffChainOnly]: lt.OffChainOnly,
  [lt.Any]: lt.Any
};
function kc(t) {
  if (t in is)
    return is[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${dn.join(", ")}`);
}
var ke;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ke || (ke = {}));
ke.Mainnet;
var pn;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(pn || (pn = {}));
var dt;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(dt || (dt = {}));
var R;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(R || (R = {}));
var D;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(D || (D = {}));
var bn;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(bn || (bn = {}));
var Q;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Q || (Q = {}));
var yn;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(yn || (yn = {}));
var Jn;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Jn || (Jn = {}));
var $e;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})($e || ($e = {}));
var os;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(os || (os = {}));
var cs;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(cs || (cs = {}));
function tr(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function $c(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function $s(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Nc(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  tr(t.outputLen), tr(t.blockLen);
}
function zc(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Mc(t, e) {
  $s(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Jt = {
  number: tr,
  bool: $c,
  bytes: $s,
  hash: Nc,
  exists: zc,
  output: Mc
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const jn = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Bt = (t, e) => t << 32 - e | t >>> e, Vc = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Vc)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Fc(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function gr(t) {
  if (typeof t == "string" && (t = Fc(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Ns {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function oe(t) {
  const e = (r) => t().update(gr(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Dc(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), c = Number(n >> s & o), a = Number(n & o), f = r ? 4 : 0, d = r ? 0 : 4;
  t.setUint32(e + f, c, r), t.setUint32(e + d, a, r);
}
class pr extends Ns {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = jn(this.buffer);
  }
  update(e) {
    Jt.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = gr(e);
    const o = e.length;
    for (let c = 0; c < o; ) {
      const a = Math.min(s - this.pos, o - c);
      if (a === s) {
        const f = jn(e);
        for (; s <= o - c; c += s)
          this.process(f, c);
        continue;
      }
      r.set(e.subarray(c, c + a), this.pos), this.pos += a, c += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Jt.exists(this), Jt.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: c } = this;
    n[c++] = 128, this.buffer.subarray(c).fill(0), this.padOffset > s - c && (this.process(r, 0), c = 0);
    for (let h = c; h < s; h++)
      n[h] = 0;
    Dc(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = jn(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = f / 4, p = this.get();
    if (d > p.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < d; h++)
      a.setUint32(4 * h, p[h], o);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: c, pos: a } = this;
    return e.length = s, e.pos = a, e.finished = o, e.destroyed = c, s % n && e.buffer.set(r), e;
  }
}
const Gc = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), zs = Uint8Array.from({ length: 16 }, (t, e) => e), Wc = zs.map((t) => (9 * t + 5) % 16);
let br = [zs], yr = [Wc];
for (let t = 0; t < 4; t++)
  for (let e of [br, yr])
    e.push(e[t].map((n) => Gc[n]));
const Ms = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Kc = br.map((t, e) => t.map((n) => Ms[e][n])), jc = yr.map((t, e) => t.map((n) => Ms[e][n])), qc = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Zc = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), rn = (t, e) => t << e | t >>> 32 - e;
function as(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const sn = new Uint32Array(16);
class Xc extends pr {
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
    for (let g = 0; g < 16; g++, n += 4)
      sn[g] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, c = o, a = this.h2 | 0, f = a, d = this.h3 | 0, p = d, h = this.h4 | 0, b = h;
    for (let g = 0; g < 5; g++) {
      const w = 4 - g, S = qc[g], A = Zc[g], T = br[g], L = yr[g], x = Kc[g], I = jc[g];
      for (let v = 0; v < 16; v++) {
        const M = rn(r + as(g, o, a, d) + sn[T[v]] + S, x[v]) + h | 0;
        r = h, h = d, d = rn(a, 10) | 0, a = o, o = M;
      }
      for (let v = 0; v < 16; v++) {
        const M = rn(s + as(w, c, f, p) + sn[L[v]] + A, I[v]) + b | 0;
        s = b, b = p, p = rn(f, 10) | 0, f = c, c = M;
      }
    }
    this.set(this.h1 + a + p | 0, this.h2 + d + b | 0, this.h3 + h + s | 0, this.h4 + r + c | 0, this.h0 + o + f | 0);
  }
  roundClean() {
    sn.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const Yc = oe(() => new Xc()), Rc = (t, e, n) => t & e ^ ~t & n, Qc = (t, e, n) => t & e ^ t & n ^ e & n, Jc = new Uint32Array([
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
]), $t = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Nt = new Uint32Array(64);
let Vs = class extends pr {
  constructor() {
    super(64, 32, 8, !1), this.A = $t[0] | 0, this.B = $t[1] | 0, this.C = $t[2] | 0, this.D = $t[3] | 0, this.E = $t[4] | 0, this.F = $t[5] | 0, this.G = $t[6] | 0, this.H = $t[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: c, G: a, H: f } = this;
    return [e, n, r, s, o, c, a, f];
  }
  // prettier-ignore
  set(e, n, r, s, o, c, a, f) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = c | 0, this.G = a | 0, this.H = f | 0;
  }
  process(e, n) {
    for (let h = 0; h < 16; h++, n += 4)
      Nt[h] = e.getUint32(n, !1);
    for (let h = 16; h < 64; h++) {
      const b = Nt[h - 15], g = Nt[h - 2], w = Bt(b, 7) ^ Bt(b, 18) ^ b >>> 3, S = Bt(g, 17) ^ Bt(g, 19) ^ g >>> 10;
      Nt[h] = S + Nt[h - 7] + w + Nt[h - 16] | 0;
    }
    let { A: r, B: s, C: o, D: c, E: a, F: f, G: d, H: p } = this;
    for (let h = 0; h < 64; h++) {
      const b = Bt(a, 6) ^ Bt(a, 11) ^ Bt(a, 25), g = p + b + Rc(a, f, d) + Jc[h] + Nt[h] | 0, S = (Bt(r, 2) ^ Bt(r, 13) ^ Bt(r, 22)) + Qc(r, s, o) | 0;
      p = d, d = f, f = a, a = c + g | 0, c = o, o = s, s = r, r = g + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, c = c + this.D | 0, a = a + this.E | 0, f = f + this.F | 0, d = d + this.G | 0, p = p + this.H | 0, this.set(r, s, o, c, a, f, d, p);
  }
  roundClean() {
    Nt.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, ta = class extends Vs {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const wr = oe(() => new Vs());
oe(() => new ta());
const on = BigInt(2 ** 32 - 1), er = BigInt(32);
function Fs(t, e = !1) {
  return e ? { h: Number(t & on), l: Number(t >> er & on) } : { h: Number(t >> er & on) | 0, l: Number(t & on) | 0 };
}
function ea(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: c } = Fs(t[s], e);
    [n[s], r[s]] = [o, c];
  }
  return [n, r];
}
const na = (t, e) => BigInt(t >>> 0) << er | BigInt(e >>> 0), ra = (t, e, n) => t >>> n, sa = (t, e, n) => t << 32 - n | e >>> n, ia = (t, e, n) => t >>> n | e << 32 - n, oa = (t, e, n) => t << 32 - n | e >>> n, ca = (t, e, n) => t << 64 - n | e >>> n - 32, aa = (t, e, n) => t >>> n - 32 | e << 64 - n, fa = (t, e) => e, ha = (t, e) => t, ua = (t, e, n) => t << n | e >>> 32 - n, la = (t, e, n) => e << n | t >>> 32 - n, da = (t, e, n) => e << n - 32 | t >>> 64 - n, ga = (t, e, n) => t << n - 32 | e >>> 64 - n;
function pa(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const ba = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), ya = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, wa = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), xa = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Sa = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), ma = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, P = {
  fromBig: Fs,
  split: ea,
  toBig: na,
  shrSH: ra,
  shrSL: sa,
  rotrSH: ia,
  rotrSL: oa,
  rotrBH: ca,
  rotrBL: aa,
  rotr32H: fa,
  rotr32L: ha,
  rotlSH: ua,
  rotlSL: la,
  rotlBH: da,
  rotlBL: ga,
  add: pa,
  add3L: ba,
  add3H: ya,
  add4L: wa,
  add4H: xa,
  add5H: ma,
  add5L: Sa
}, [Aa, Ea] = P.split([
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
].map((t) => BigInt(t))), zt = new Uint32Array(80), Mt = new Uint32Array(80);
let Cn = class extends pr {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: c, Dh: a, Dl: f, Eh: d, El: p, Fh: h, Fl: b, Gh: g, Gl: w, Hh: S, Hl: A } = this;
    return [e, n, r, s, o, c, a, f, d, p, h, b, g, w, S, A];
  }
  // prettier-ignore
  set(e, n, r, s, o, c, a, f, d, p, h, b, g, w, S, A) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = c | 0, this.Dh = a | 0, this.Dl = f | 0, this.Eh = d | 0, this.El = p | 0, this.Fh = h | 0, this.Fl = b | 0, this.Gh = g | 0, this.Gl = w | 0, this.Hh = S | 0, this.Hl = A | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      zt[x] = e.getUint32(n), Mt[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const I = zt[x - 15] | 0, v = Mt[x - 15] | 0, M = P.rotrSH(I, v, 1) ^ P.rotrSH(I, v, 8) ^ P.shrSH(I, v, 7), G = P.rotrSL(I, v, 1) ^ P.rotrSL(I, v, 8) ^ P.shrSL(I, v, 7), z = zt[x - 2] | 0, W = Mt[x - 2] | 0, nt = P.rotrSH(z, W, 19) ^ P.rotrBH(z, W, 61) ^ P.shrSH(z, W, 6), bt = P.rotrSL(z, W, 19) ^ P.rotrBL(z, W, 61) ^ P.shrSL(z, W, 6), ft = P.add4L(G, bt, Mt[x - 7], Mt[x - 16]), yt = P.add4H(ft, M, nt, zt[x - 7], zt[x - 16]);
      zt[x] = yt | 0, Mt[x] = ft | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: c, Ch: a, Cl: f, Dh: d, Dl: p, Eh: h, El: b, Fh: g, Fl: w, Gh: S, Gl: A, Hh: T, Hl: L } = this;
    for (let x = 0; x < 80; x++) {
      const I = P.rotrSH(h, b, 14) ^ P.rotrSH(h, b, 18) ^ P.rotrBH(h, b, 41), v = P.rotrSL(h, b, 14) ^ P.rotrSL(h, b, 18) ^ P.rotrBL(h, b, 41), M = h & g ^ ~h & S, G = b & w ^ ~b & A, z = P.add5L(L, v, G, Ea[x], Mt[x]), W = P.add5H(z, T, I, M, Aa[x], zt[x]), nt = z | 0, bt = P.rotrSH(r, s, 28) ^ P.rotrBH(r, s, 34) ^ P.rotrBH(r, s, 39), ft = P.rotrSL(r, s, 28) ^ P.rotrBL(r, s, 34) ^ P.rotrBL(r, s, 39), yt = r & o ^ r & a ^ o & a, Ot = s & c ^ s & f ^ c & f;
      T = S | 0, L = A | 0, S = g | 0, A = w | 0, g = h | 0, w = b | 0, { h, l: b } = P.add(d | 0, p | 0, W | 0, nt | 0), d = a | 0, p = f | 0, a = o | 0, f = c | 0, o = r | 0, c = s | 0;
      const St = P.add3L(nt, ft, Ot);
      r = P.add3H(St, W, bt, yt), s = St | 0;
    }
    ({ h: r, l: s } = P.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: c } = P.add(this.Bh | 0, this.Bl | 0, o | 0, c | 0), { h: a, l: f } = P.add(this.Ch | 0, this.Cl | 0, a | 0, f | 0), { h: d, l: p } = P.add(this.Dh | 0, this.Dl | 0, d | 0, p | 0), { h, l: b } = P.add(this.Eh | 0, this.El | 0, h | 0, b | 0), { h: g, l: w } = P.add(this.Fh | 0, this.Fl | 0, g | 0, w | 0), { h: S, l: A } = P.add(this.Gh | 0, this.Gl | 0, S | 0, A | 0), { h: T, l: L } = P.add(this.Hh | 0, this.Hl | 0, T | 0, L | 0), this.set(r, s, o, c, a, f, d, p, h, b, g, w, S, A, T, L);
  }
  roundClean() {
    zt.fill(0), Mt.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Ba = class extends Cn {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Ha = class extends Cn {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Ia = class extends Cn {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
oe(() => new Cn());
oe(() => new Ba());
const Ca = oe(() => new Ha());
oe(() => new Ia());
const _a = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const N = BigInt(0), X = BigInt(1), Wt = BigInt(2), Ue = BigInt(3), fs = BigInt(8), tt = Object.freeze({
  a: N,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: X,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), hs = (t, e) => (t + e / Wt) / e, cn = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = tt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -X * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), o = n, c = BigInt("0x100000000000000000000000000000000"), a = hs(o * t, e), f = hs(-r * t, e);
    let d = E(t - a * n - f * s, e), p = E(-a * r - f * o, e);
    const h = d > c, b = p > c;
    if (h && (d = e - d), b && (p = e - p), d > c || p > c)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: h, k1: d, k2neg: b, k2: p };
  }
}, At = 32, pe = 32, va = 32, us = At + 1, ls = 2 * At + 1;
function ds(t) {
  const { a: e, b: n } = tt, r = E(t * t), s = E(r * t);
  return E(s + e * t + n);
}
const an = tt.a === N;
class Ds extends Error {
  constructor(e) {
    super(e);
  }
}
function gs(t) {
  if (!(t instanceof V))
    throw new TypeError("JacobianPoint expected");
}
class V {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof q))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(q.ZERO) ? V.ZERO : new V(e.x, e.y, X);
  }
  static toAffineBatch(e) {
    const n = Oa(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return V.toAffineBatch(e).map(V.fromAffine);
  }
  equals(e) {
    gs(e);
    const { x: n, y: r, z: s } = this, { x: o, y: c, z: a } = e, f = E(s * s), d = E(a * a), p = E(n * d), h = E(o * f), b = E(E(r * a) * d), g = E(E(c * s) * f);
    return p === h && b === g;
  }
  negate() {
    return new V(this.x, E(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = E(e * e), o = E(n * n), c = E(o * o), a = e + o, f = E(Wt * (E(a * a) - s - c)), d = E(Ue * s), p = E(d * d), h = E(p - Wt * f), b = E(d * (f - h) - fs * c), g = E(Wt * n * r);
    return new V(h, b, g);
  }
  add(e) {
    gs(e);
    const { x: n, y: r, z: s } = this, { x: o, y: c, z: a } = e;
    if (o === N || c === N)
      return this;
    if (n === N || r === N)
      return e;
    const f = E(s * s), d = E(a * a), p = E(n * d), h = E(o * f), b = E(E(r * a) * d), g = E(E(c * s) * f), w = E(h - p), S = E(g - b);
    if (w === N)
      return S === N ? this.double() : V.ZERO;
    const A = E(w * w), T = E(w * A), L = E(p * A), x = E(S * S - T - Wt * L), I = E(S * (L - x) - b * T), v = E(s * a * w);
    return new V(x, I, v);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = V.ZERO;
    if (typeof e == "bigint" && e === N)
      return n;
    let r = ys(e);
    if (r === X)
      return this;
    if (!an) {
      let h = n, b = this;
      for (; r > N; )
        r & X && (h = h.add(b)), b = b.double(), r >>= X;
      return h;
    }
    let { k1neg: s, k1: o, k2neg: c, k2: a } = cn.splitScalar(r), f = n, d = n, p = this;
    for (; o > N || a > N; )
      o & X && (f = f.add(p)), a & X && (d = d.add(p)), p = p.double(), o >>= X, a >>= X;
    return s && (f = f.negate()), c && (d = d.negate()), d = new V(E(d.x * cn.beta), d.y, d.z), f.add(d);
  }
  precomputeWindow(e) {
    const n = an ? 128 / e + 1 : 256 / e + 1, r = [];
    let s = this, o = s;
    for (let c = 0; c < n; c++) {
      o = s, r.push(o);
      for (let a = 1; a < 2 ** (e - 1); a++)
        o = o.add(s), r.push(o);
      s = o.double();
    }
    return r;
  }
  wNAF(e, n) {
    !n && this.equals(V.BASE) && (n = q.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && nr.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = V.normalizeZ(s), nr.set(n, s)));
    let o = V.ZERO, c = V.BASE;
    const a = 1 + (an ? 128 / r : 256 / r), f = 2 ** (r - 1), d = BigInt(2 ** r - 1), p = 2 ** r, h = BigInt(r);
    for (let b = 0; b < a; b++) {
      const g = b * f;
      let w = Number(e & d);
      e >>= h, w > f && (w -= p, e += X);
      const S = g, A = g + Math.abs(w) - 1, T = b % 2 !== 0, L = w < 0;
      w === 0 ? c = c.add(fn(T, s[S])) : o = o.add(fn(L, s[A]));
    }
    return { p: o, f: c };
  }
  multiply(e, n) {
    let r = ys(e), s, o;
    if (an) {
      const { k1neg: c, k1: a, k2neg: f, k2: d } = cn.splitScalar(r);
      let { p, f: h } = this.wNAF(a, n), { p: b, f: g } = this.wNAF(d, n);
      p = fn(c, p), b = fn(f, b), b = new V(E(b.x * cn.beta), b.y, b.z), s = p.add(b), o = h.add(g);
    } else {
      const { p: c, f: a } = this.wNAF(r, n);
      s = c, o = a;
    }
    return V.normalizeZ([s, o])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, o = this.equals(V.ZERO);
    e == null && (e = o ? fs : Ke(s));
    const c = e, a = E(c * c), f = E(a * c), d = E(n * a), p = E(r * f), h = E(s * c);
    if (o)
      return q.ZERO;
    if (h !== X)
      throw new Error("invZ was invalid");
    return new q(d, p);
  }
}
V.BASE = new V(tt.Gx, tt.Gy, X);
V.ZERO = new V(N, X, N);
function fn(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const nr = /* @__PURE__ */ new WeakMap();
class q {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, nr.delete(this);
  }
  hasEvenY() {
    return this.y % Wt === N;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = jt(n ? e : e.subarray(1));
    if (!qn(r))
      throw new Error("Point is not on curve");
    const s = ds(r);
    let o = Pa(s);
    const c = (o & X) === X;
    n ? c && (o = E(-o)) : (e[0] & 1) === 1 !== c && (o = E(-o));
    const a = new q(r, o);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = jt(e.subarray(1, At + 1)), r = jt(e.subarray(At + 1, At * 2 + 1)), s = new q(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Ne(e), r = n.length, s = n[0];
    if (r === At)
      return this.fromCompressedHex(n);
    if (r === us && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === ls && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${us} compressed bytes or ${ls} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return q.BASE.multiply(xn(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: o } = za(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const c = Gs(Ne(e)), { n: a } = tt, f = r === 2 || r === 3 ? s + a : s, d = Ke(f, a), p = E(-c * d, a), h = E(o * d, a), b = r & 1 ? "03" : "02", g = q.fromHex(b + de(f)), w = q.BASE.multiplyAndAddUnsafe(g, p, h);
    if (!w)
      throw new Error("Cannot recover signature: point at infinify");
    return w.assertValidity(), w;
  }
  toRawBytes(e = !1) {
    return ne(this.toHex(e));
  }
  toHex(e = !1) {
    const n = de(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${de(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!qn(n) || !qn(r))
      throw new Error(e);
    const s = E(r * r), o = ds(n);
    if (E(s - o) !== N)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new q(this.x, E(-this.y));
  }
  double() {
    return V.fromAffine(this).double().toAffine();
  }
  add(e) {
    return V.fromAffine(this).add(V.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return V.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = V.fromAffine(this), o = n === N || n === X || this !== q.BASE ? s.multiplyUnsafe(n) : s.multiply(n), c = V.fromAffine(e).multiplyUnsafe(r), a = o.add(c);
    return a.equals(V.ZERO) ? void 0 : a.toAffine();
  }
}
q.BASE = new q(tt.Gx, tt.Gy);
q.ZERO = new q(N, N);
function ps(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function bs(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${be(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: jt(n), left: t.subarray(e + 2) };
}
function Ta(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${be(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = bs(t.subarray(2)), { data: r, left: s } = bs(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${be(s)}`);
  return { r: e, s: r };
}
class _t {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? be(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new _t(wn(s.slice(0, 64)), wn(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Ta(n ? e : ne(e));
    return new _t(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!ze(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!ze(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = tt.n >> X;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new _t(this.r, E(-this.s, tt.n)) : this;
  }
  toDERRawBytes() {
    return ne(this.toDERHex());
  }
  toDERHex() {
    const e = ps(Ce(this.s)), n = ps(Ce(this.r)), r = e.length / 2, s = n.length / 2, o = Ce(r), c = Ce(s);
    return `30${Ce(s + r + 4)}02${c}${n}02${o}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return ne(this.toCompactHex());
  }
  toCompactHex() {
    return de(this.r) + de(this.s);
  }
}
function Gt(...t) {
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
const Ua = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function be(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Ua[t[n]];
  return e;
}
const La = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function de(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(N <= t && t < La))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function rr(t) {
  const e = ne(de(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Ce(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function wn(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function ne(t) {
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
function jt(t) {
  return wn(be(t));
}
function Ne(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : ne(t);
}
function ys(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && ze(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function E(t, e = tt.P) {
  const n = t % e;
  return n >= N ? n : e + n;
}
function wt(t, e) {
  const { P: n } = tt;
  let r = t;
  for (; e-- > N; )
    r *= r, r %= n;
  return r;
}
function Pa(t) {
  const { P: e } = tt, n = BigInt(6), r = BigInt(11), s = BigInt(22), o = BigInt(23), c = BigInt(44), a = BigInt(88), f = t * t * t % e, d = f * f * t % e, p = wt(d, Ue) * d % e, h = wt(p, Ue) * d % e, b = wt(h, Wt) * f % e, g = wt(b, r) * b % e, w = wt(g, s) * g % e, S = wt(w, c) * w % e, A = wt(S, a) * S % e, T = wt(A, c) * w % e, L = wt(T, Ue) * d % e, x = wt(L, o) * g % e, I = wt(x, n) * f % e, v = wt(I, Wt);
  if (v * v % e !== t)
    throw new Error("Cannot find square root");
  return v;
}
function Ke(t, e = tt.P) {
  if (t === N || e <= N)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = E(t, e), r = e, s = N, o = X;
  for (; n !== N; ) {
    const a = r / n, f = r % n, d = s - o * a;
    r = n, n = f, s = o, o = d;
  }
  if (r !== X)
    throw new Error("invert: does not exist");
  return E(s, e);
}
function Oa(t, e = tt.P) {
  const n = new Array(t.length), r = t.reduce((o, c, a) => c === N ? o : (n[a] = o, E(o * c, e)), X), s = Ke(r, e);
  return t.reduceRight((o, c, a) => c === N ? o : (n[a] = E(o * n[a], e), E(o * c, e)), s), n;
}
function ka(t) {
  const e = t.length * 8 - pe * 8, n = jt(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Gs(t, e = !1) {
  const n = ka(t);
  if (e)
    return n;
  const { n: r } = tt;
  return n >= r ? n - r : n;
}
let ge, Le;
class $a {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return Kt.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return Le(this.k, ...e);
  }
  checkSync() {
    if (typeof Le != "function")
      throw new Ds("hmacSha256Sync needs to be set");
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
    return Gt(...n);
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
    return Gt(...n);
  }
}
function ze(t) {
  return N < t && t < tt.n;
}
function qn(t) {
  return N < t && t < tt.P;
}
function Na(t, e, n, r = !0) {
  const { n: s } = tt, o = Gs(t, !0);
  if (!ze(o))
    return;
  const c = Ke(o, s), a = q.BASE.multiply(o), f = E(a.x, s);
  if (f === N)
    return;
  const d = E(c * E(e + n * f, s), s);
  if (d === N)
    return;
  let p = new _t(f, d), h = (a.x === p.r ? 0 : 2) | Number(a.y & X);
  return r && p.hasHighS() && (p = p.normalizeS(), h ^= 1), { sig: p, recovery: h };
}
function xn(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * pe)
      throw new Error("Expected 32 bytes of private key");
    e = wn(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== pe)
      throw new Error("Expected 32 bytes of private key");
    e = jt(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!ze(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function za(t) {
  if (t instanceof _t)
    return t.assertValidity(), t;
  try {
    return _t.fromDER(t);
  } catch {
    return _t.fromCompact(t);
  }
}
function Ma(t, e = !1) {
  return q.fromPrivateKey(t).toRawBytes(e);
}
function Ws(t) {
  const e = t.length > At ? t.slice(0, At) : t;
  return jt(e);
}
function Va(t) {
  const e = Ws(t), n = E(e, tt.n);
  return Ks(n < N ? e : n);
}
function Ks(t) {
  return rr(t);
}
function Fa(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Ne(t), s = xn(e), o = [Ks(s), Va(r)];
  if (n != null) {
    n === !0 && (n = Kt.randomBytes(At));
    const f = Ne(n);
    if (f.length !== At)
      throw new Error(`sign: Expected ${At} bytes of extra data`);
    o.push(f);
  }
  const c = Gt(...o), a = Ws(r);
  return { seed: c, m: a, d: s };
}
function Da(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: o } = Object.assign({ canonical: !0, der: !0 }, e), c = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return o ? [c, r] : c;
}
function Ga(t, e, n = {}) {
  const { seed: r, m: s, d: o } = Fa(t, e, n.extraEntropy), c = new $a(va, pe);
  c.reseedSync(r);
  let a;
  for (; !(a = Na(c.generateSync(), s, o, n.canonical)); )
    c.reseedSync();
  return Da(a, n);
}
q.BASE._setWindowSize(8);
const gt = {
  node: _a,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, hn = {}, Kt = {
  bytesToHex: be,
  hexToBytes: ne,
  concatBytes: Gt,
  mod: E,
  invert: Ke,
  isValidPrivateKey(t) {
    try {
      return xn(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: rr,
  _normalizePrivateKey: xn,
  hashToPrivateKey: (t) => {
    t = Ne(t);
    const e = pe + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = E(jt(t), tt.n - X) + X;
    return rr(n);
  },
  randomBytes: (t = 32) => {
    if (gt.web)
      return gt.web.getRandomValues(new Uint8Array(t));
    if (gt.node) {
      const { randomBytes: e } = gt.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Kt.hashToPrivateKey(Kt.randomBytes(pe + 8)),
  precompute(t = 8, e = q.BASE) {
    const n = e === q.BASE ? e : new q(e.x, e.y);
    return n._setWindowSize(t), n.multiply(Ue), n;
  },
  sha256: async (...t) => {
    if (gt.web) {
      const e = await gt.web.subtle.digest("SHA-256", Gt(...t));
      return new Uint8Array(e);
    } else if (gt.node) {
      const { createHash: e } = gt.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (gt.web) {
      const n = await gt.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Gt(...e), s = await gt.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (gt.node) {
      const { createHmac: n } = gt.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = hn[t];
    if (n === void 0) {
      const r = await Kt.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Gt(r, r), hn[t] = n;
    }
    return Kt.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof ge != "function")
      throw new Ds("sha256Sync is undefined, you need to set it");
    let n = hn[t];
    if (n === void 0) {
      const r = ge(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Gt(r, r), hn[t] = n;
    }
    return ge(n, ...e);
  },
  _JacobianPoint: V
};
Object.defineProperties(Kt, {
  sha256Sync: {
    configurable: !1,
    get() {
      return ge;
    },
    set(t) {
      ge || (ge = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Le;
    },
    set(t) {
      Le || (Le = t);
    }
  }
});
var un = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Wa(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var xr = {}, Sr = {}, ce = {}, _n = {};
Object.defineProperty(_n, "__esModule", { value: !0 });
_n.crypto = void 0;
_n.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = o, t.aexists = c, t.aoutput = a, t.u8 = f, t.u32 = d, t.clean = p, t.createView = h, t.rotr = b, t.rotl = g, t.byteSwap = w, t.byteSwap32 = S, t.bytesToHex = L, t.hexToBytes = v, t.asyncLoop = G, t.utf8ToBytes = z, t.bytesToUtf8 = W, t.toBytes = nt, t.kdfInputToBytes = bt, t.concatBytes = ft, t.checkOpts = yt, t.createHasher = St, t.createOptHasher = Ze, t.createXOFer = Xe, t.randomBytes = Ln;
  const e = _n;
  function n(l) {
    return l instanceof Uint8Array || ArrayBuffer.isView(l) && l.constructor.name === "Uint8Array";
  }
  function r(l) {
    if (!Number.isSafeInteger(l) || l < 0)
      throw new Error("positive integer expected, got " + l);
  }
  function s(l, ...m) {
    if (!n(l))
      throw new Error("Uint8Array expected");
    if (m.length > 0 && !m.includes(l.length))
      throw new Error("Uint8Array expected of length " + m + ", got length=" + l.length);
  }
  function o(l) {
    if (typeof l != "function" || typeof l.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(l.outputLen), r(l.blockLen);
  }
  function c(l, m = !0) {
    if (l.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (m && l.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(l, m) {
    s(l);
    const K = m.outputLen;
    if (l.length < K)
      throw new Error("digestInto() expects output buffer of length at least " + K);
  }
  function f(l) {
    return new Uint8Array(l.buffer, l.byteOffset, l.byteLength);
  }
  function d(l) {
    return new Uint32Array(l.buffer, l.byteOffset, Math.floor(l.byteLength / 4));
  }
  function p(...l) {
    for (let m = 0; m < l.length; m++)
      l[m].fill(0);
  }
  function h(l) {
    return new DataView(l.buffer, l.byteOffset, l.byteLength);
  }
  function b(l, m) {
    return l << 32 - m | l >>> m;
  }
  function g(l, m) {
    return l << m | l >>> 32 - m >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function w(l) {
    return l << 24 & 4278190080 | l << 8 & 16711680 | l >>> 8 & 65280 | l >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (l) => l : (l) => w(l), t.byteSwapIfBE = t.swap8IfBE;
  function S(l) {
    for (let m = 0; m < l.length; m++)
      l[m] = w(l[m]);
    return l;
  }
  t.swap32IfBE = t.isLE ? (l) => l : S;
  const A = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", T = /* @__PURE__ */ Array.from({ length: 256 }, (l, m) => m.toString(16).padStart(2, "0"));
  function L(l) {
    if (s(l), A)
      return l.toHex();
    let m = "";
    for (let K = 0; K < l.length; K++)
      m += T[l[K]];
    return m;
  }
  const x = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function I(l) {
    if (l >= x._0 && l <= x._9)
      return l - x._0;
    if (l >= x.A && l <= x.F)
      return l - (x.A - 10);
    if (l >= x.a && l <= x.f)
      return l - (x.a - 10);
  }
  function v(l) {
    if (typeof l != "string")
      throw new Error("hex string expected, got " + typeof l);
    if (A)
      return Uint8Array.fromHex(l);
    const m = l.length, K = m / 2;
    if (m % 2)
      throw new Error("hex string expected, got unpadded hex of length " + m);
    const Z = new Uint8Array(K);
    for (let F = 0, st = 0; F < K; F++, st += 2) {
      const Ae = I(l.charCodeAt(st)), Ye = I(l.charCodeAt(st + 1));
      if (Ae === void 0 || Ye === void 0) {
        const Pn = l[st] + l[st + 1];
        throw new Error('hex string expected, got non-hex character "' + Pn + '" at index ' + st);
      }
      Z[F] = Ae * 16 + Ye;
    }
    return Z;
  }
  const M = async () => {
  };
  t.nextTick = M;
  async function G(l, m, K) {
    let Z = Date.now();
    for (let F = 0; F < l; F++) {
      K(F);
      const st = Date.now() - Z;
      st >= 0 && st < m || (await (0, t.nextTick)(), Z += st);
    }
  }
  function z(l) {
    if (typeof l != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(l));
  }
  function W(l) {
    return new TextDecoder().decode(l);
  }
  function nt(l) {
    return typeof l == "string" && (l = z(l)), s(l), l;
  }
  function bt(l) {
    return typeof l == "string" && (l = z(l)), s(l), l;
  }
  function ft(...l) {
    let m = 0;
    for (let Z = 0; Z < l.length; Z++) {
      const F = l[Z];
      s(F), m += F.length;
    }
    const K = new Uint8Array(m);
    for (let Z = 0, F = 0; Z < l.length; Z++) {
      const st = l[Z];
      K.set(st, F), F += st.length;
    }
    return K;
  }
  function yt(l, m) {
    if (m !== void 0 && {}.toString.call(m) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(l, m);
  }
  class Ot {
  }
  t.Hash = Ot;
  function St(l) {
    const m = (Z) => l().update(nt(Z)).digest(), K = l();
    return m.outputLen = K.outputLen, m.blockLen = K.blockLen, m.create = () => l(), m;
  }
  function Ze(l) {
    const m = (Z, F) => l(F).update(nt(Z)).digest(), K = l({});
    return m.outputLen = K.outputLen, m.blockLen = K.blockLen, m.create = (Z) => l(Z), m;
  }
  function Xe(l) {
    const m = (Z, F) => l(F).update(nt(Z)).digest(), K = l({});
    return m.outputLen = K.outputLen, m.blockLen = K.blockLen, m.create = (Z) => l(Z), m;
  }
  t.wrapConstructor = St, t.wrapConstructorWithOpts = Ze, t.wrapXOFConstructorWithOpts = Xe;
  function Ln(l = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(l));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(l));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(ce);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = ce;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(c, a) {
    if (!c.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    c.length % 2 !== 0 && (c = `0${c}`), c = c.toLowerCase();
    let f = [], d = 0;
    for (let g = c.length - 1; g >= 0; g--)
      if (d < 4) {
        const w = n.indexOf(c[g]) >> d;
        let S = 0;
        g !== 0 && (S = n.indexOf(c[g - 1]));
        const A = 1 + d, T = S % (1 << A) << 5 - A, L = t.c32[w + T];
        d = A, f.unshift(L);
      } else
        d = 0;
    let p = 0;
    for (let g = 0; g < f.length && f[g] === "0"; g++)
      p++;
    f = f.slice(p);
    const h = new TextDecoder().decode((0, e.hexToBytes)(c)).match(/^\u0000*/), b = h ? h[0].length : 0;
    for (let g = 0; g < b; g++)
      f.unshift(t.c32[0]);
    if (a) {
      const g = a - f.length;
      for (let w = 0; w < g; w++)
        f.unshift(t.c32[0]);
    }
    return f.join("");
  }
  t.c32encode = r;
  function s(c) {
    return c.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  t.c32normalize = s;
  function o(c, a) {
    if (c = s(c), !c.match(`^[${t.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const f = c.match(`^${t.c32[0]}*`), d = f ? f[0].length : 0;
    let p = [], h = 0, b = 0;
    for (let S = c.length - 1; S >= 0; S--) {
      b === 4 && (p.unshift(n[h]), b = 0, h = 0);
      const T = (t.c32.indexOf(c[S]) << b) + h, L = n[T % 16];
      if (b += 1, h = T >> 4, h > 1 << b)
        throw new Error("Panic error in decoding.");
      p.unshift(L);
    }
    p.unshift(n[h]), p.length % 2 === 1 && p.unshift("0");
    let g = 0;
    for (let S = 0; S < p.length && p[S] === "0"; S++)
      g++;
    p = p.slice(g - g % 2);
    let w = p.join("");
    for (let S = 0; S < d; S++)
      w = `00${w}`;
    if (a) {
      const S = a * 2 - w.length;
      for (let A = 0; A < S; A += 2)
        w = `00${w}`;
    }
    return w;
  }
  t.c32decode = o;
})(Sr);
var se = {}, Et = {}, j = {}, ct = {};
Object.defineProperty(ct, "__esModule", { value: !0 });
ct.SHA512_IV = ct.SHA384_IV = ct.SHA224_IV = ct.SHA256_IV = ct.HashMD = void 0;
ct.setBigUint64 = js;
ct.Chi = Ka;
ct.Maj = ja;
const Ht = ce;
function js(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), c = Number(n >> s & o), a = Number(n & o), f = r ? 4 : 0, d = r ? 0 : 4;
  t.setUint32(e + f, c, r), t.setUint32(e + d, a, r);
}
function Ka(t, e, n) {
  return t & e ^ ~t & n;
}
function ja(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class qa extends Ht.Hash {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = (0, Ht.createView)(this.buffer);
  }
  update(e) {
    (0, Ht.aexists)(this), e = (0, Ht.toBytes)(e), (0, Ht.abytes)(e);
    const { view: n, buffer: r, blockLen: s } = this, o = e.length;
    for (let c = 0; c < o; ) {
      const a = Math.min(s - this.pos, o - c);
      if (a === s) {
        const f = (0, Ht.createView)(e);
        for (; s <= o - c; c += s)
          this.process(f, c);
        continue;
      }
      r.set(e.subarray(c, c + a), this.pos), this.pos += a, c += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    (0, Ht.aexists)(this), (0, Ht.aoutput)(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: c } = this;
    n[c++] = 128, (0, Ht.clean)(this.buffer.subarray(c)), this.padOffset > s - c && (this.process(r, 0), c = 0);
    for (let h = c; h < s; h++)
      n[h] = 0;
    js(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = (0, Ht.createView)(e), f = this.outputLen;
    if (f % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = f / 4, p = this.get();
    if (d > p.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < d; h++)
      a.setUint32(4 * h, p[h], o);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: c, pos: a } = this;
    return e.destroyed = c, e.finished = o, e.length = s, e.pos = a, s % n && e.buffer.set(r), e;
  }
  clone() {
    return this._cloneInto();
  }
}
ct.HashMD = qa;
ct.SHA256_IV = Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
ct.SHA224_IV = Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]);
ct.SHA384_IV = Uint32Array.from([
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
ct.SHA512_IV = Uint32Array.from([
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
var U = {};
Object.defineProperty(U, "__esModule", { value: !0 });
U.toBig = U.shrSL = U.shrSH = U.rotrSL = U.rotrSH = U.rotrBL = U.rotrBH = U.rotr32L = U.rotr32H = U.rotlSL = U.rotlSH = U.rotlBL = U.rotlBH = U.add5L = U.add5H = U.add4L = U.add4H = U.add3L = U.add3H = void 0;
U.add = ci;
U.fromBig = mr;
U.split = qs;
const ln = /* @__PURE__ */ BigInt(2 ** 32 - 1), sr = /* @__PURE__ */ BigInt(32);
function mr(t, e = !1) {
  return e ? { h: Number(t & ln), l: Number(t >> sr & ln) } : { h: Number(t >> sr & ln) | 0, l: Number(t & ln) | 0 };
}
function qs(t, e = !1) {
  const n = t.length;
  let r = new Uint32Array(n), s = new Uint32Array(n);
  for (let o = 0; o < n; o++) {
    const { h: c, l: a } = mr(t[o], e);
    [r[o], s[o]] = [c, a];
  }
  return [r, s];
}
const Zs = (t, e) => BigInt(t >>> 0) << sr | BigInt(e >>> 0);
U.toBig = Zs;
const Xs = (t, e, n) => t >>> n;
U.shrSH = Xs;
const Ys = (t, e, n) => t << 32 - n | e >>> n;
U.shrSL = Ys;
const Rs = (t, e, n) => t >>> n | e << 32 - n;
U.rotrSH = Rs;
const Qs = (t, e, n) => t << 32 - n | e >>> n;
U.rotrSL = Qs;
const Js = (t, e, n) => t << 64 - n | e >>> n - 32;
U.rotrBH = Js;
const ti = (t, e, n) => t >>> n - 32 | e << 64 - n;
U.rotrBL = ti;
const ei = (t, e) => e;
U.rotr32H = ei;
const ni = (t, e) => t;
U.rotr32L = ni;
const ri = (t, e, n) => t << n | e >>> 32 - n;
U.rotlSH = ri;
const si = (t, e, n) => e << n | t >>> 32 - n;
U.rotlSL = si;
const ii = (t, e, n) => e << n - 32 | t >>> 64 - n;
U.rotlBH = ii;
const oi = (t, e, n) => t << n - 32 | e >>> 64 - n;
U.rotlBL = oi;
function ci(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const ai = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0);
U.add3L = ai;
const fi = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0;
U.add3H = fi;
const hi = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0);
U.add4L = hi;
const ui = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0;
U.add4H = ui;
const li = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0);
U.add5L = li;
const di = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0;
U.add5H = di;
const Za = {
  fromBig: mr,
  split: qs,
  toBig: Zs,
  shrSH: Xs,
  shrSL: Ys,
  rotrSH: Rs,
  rotrSL: Qs,
  rotrBH: Js,
  rotrBL: ti,
  rotr32H: ei,
  rotr32L: ni,
  rotlSH: ri,
  rotlSL: si,
  rotlBH: ii,
  rotlBL: oi,
  add: ci,
  add3L: ai,
  add3H: fi,
  add4L: hi,
  add4H: ui,
  add5H: di,
  add5L: li
};
U.default = Za;
Object.defineProperty(j, "__esModule", { value: !0 });
j.sha512_224 = j.sha512_256 = j.sha384 = j.sha512 = j.sha224 = j.sha256 = j.SHA512_256 = j.SHA512_224 = j.SHA384 = j.SHA512 = j.SHA224 = j.SHA256 = void 0;
const C = ct, O = U, et = ce, Xa = /* @__PURE__ */ Uint32Array.from([
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
]), Vt = /* @__PURE__ */ new Uint32Array(64);
class Ar extends C.HashMD {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = C.SHA256_IV[0] | 0, this.B = C.SHA256_IV[1] | 0, this.C = C.SHA256_IV[2] | 0, this.D = C.SHA256_IV[3] | 0, this.E = C.SHA256_IV[4] | 0, this.F = C.SHA256_IV[5] | 0, this.G = C.SHA256_IV[6] | 0, this.H = C.SHA256_IV[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: c, G: a, H: f } = this;
    return [e, n, r, s, o, c, a, f];
  }
  // prettier-ignore
  set(e, n, r, s, o, c, a, f) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = c | 0, this.G = a | 0, this.H = f | 0;
  }
  process(e, n) {
    for (let h = 0; h < 16; h++, n += 4)
      Vt[h] = e.getUint32(n, !1);
    for (let h = 16; h < 64; h++) {
      const b = Vt[h - 15], g = Vt[h - 2], w = (0, et.rotr)(b, 7) ^ (0, et.rotr)(b, 18) ^ b >>> 3, S = (0, et.rotr)(g, 17) ^ (0, et.rotr)(g, 19) ^ g >>> 10;
      Vt[h] = S + Vt[h - 7] + w + Vt[h - 16] | 0;
    }
    let { A: r, B: s, C: o, D: c, E: a, F: f, G: d, H: p } = this;
    for (let h = 0; h < 64; h++) {
      const b = (0, et.rotr)(a, 6) ^ (0, et.rotr)(a, 11) ^ (0, et.rotr)(a, 25), g = p + b + (0, C.Chi)(a, f, d) + Xa[h] + Vt[h] | 0, S = ((0, et.rotr)(r, 2) ^ (0, et.rotr)(r, 13) ^ (0, et.rotr)(r, 22)) + (0, C.Maj)(r, s, o) | 0;
      p = d, d = f, f = a, a = c + g | 0, c = o, o = s, s = r, r = g + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, c = c + this.D | 0, a = a + this.E | 0, f = f + this.F | 0, d = d + this.G | 0, p = p + this.H | 0, this.set(r, s, o, c, a, f, d, p);
  }
  roundClean() {
    (0, et.clean)(Vt);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), (0, et.clean)(this.buffer);
  }
}
j.SHA256 = Ar;
class gi extends Ar {
  constructor() {
    super(28), this.A = C.SHA224_IV[0] | 0, this.B = C.SHA224_IV[1] | 0, this.C = C.SHA224_IV[2] | 0, this.D = C.SHA224_IV[3] | 0, this.E = C.SHA224_IV[4] | 0, this.F = C.SHA224_IV[5] | 0, this.G = C.SHA224_IV[6] | 0, this.H = C.SHA224_IV[7] | 0;
  }
}
j.SHA224 = gi;
const pi = O.split([
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
].map((t) => BigInt(t))), Ya = pi[0], Ra = pi[1], Ft = /* @__PURE__ */ new Uint32Array(80), Dt = /* @__PURE__ */ new Uint32Array(80);
class je extends C.HashMD {
  constructor(e = 64) {
    super(128, e, 16, !1), this.Ah = C.SHA512_IV[0] | 0, this.Al = C.SHA512_IV[1] | 0, this.Bh = C.SHA512_IV[2] | 0, this.Bl = C.SHA512_IV[3] | 0, this.Ch = C.SHA512_IV[4] | 0, this.Cl = C.SHA512_IV[5] | 0, this.Dh = C.SHA512_IV[6] | 0, this.Dl = C.SHA512_IV[7] | 0, this.Eh = C.SHA512_IV[8] | 0, this.El = C.SHA512_IV[9] | 0, this.Fh = C.SHA512_IV[10] | 0, this.Fl = C.SHA512_IV[11] | 0, this.Gh = C.SHA512_IV[12] | 0, this.Gl = C.SHA512_IV[13] | 0, this.Hh = C.SHA512_IV[14] | 0, this.Hl = C.SHA512_IV[15] | 0;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: c, Dh: a, Dl: f, Eh: d, El: p, Fh: h, Fl: b, Gh: g, Gl: w, Hh: S, Hl: A } = this;
    return [e, n, r, s, o, c, a, f, d, p, h, b, g, w, S, A];
  }
  // prettier-ignore
  set(e, n, r, s, o, c, a, f, d, p, h, b, g, w, S, A) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = c | 0, this.Dh = a | 0, this.Dl = f | 0, this.Eh = d | 0, this.El = p | 0, this.Fh = h | 0, this.Fl = b | 0, this.Gh = g | 0, this.Gl = w | 0, this.Hh = S | 0, this.Hl = A | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      Ft[x] = e.getUint32(n), Dt[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const I = Ft[x - 15] | 0, v = Dt[x - 15] | 0, M = O.rotrSH(I, v, 1) ^ O.rotrSH(I, v, 8) ^ O.shrSH(I, v, 7), G = O.rotrSL(I, v, 1) ^ O.rotrSL(I, v, 8) ^ O.shrSL(I, v, 7), z = Ft[x - 2] | 0, W = Dt[x - 2] | 0, nt = O.rotrSH(z, W, 19) ^ O.rotrBH(z, W, 61) ^ O.shrSH(z, W, 6), bt = O.rotrSL(z, W, 19) ^ O.rotrBL(z, W, 61) ^ O.shrSL(z, W, 6), ft = O.add4L(G, bt, Dt[x - 7], Dt[x - 16]), yt = O.add4H(ft, M, nt, Ft[x - 7], Ft[x - 16]);
      Ft[x] = yt | 0, Dt[x] = ft | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: c, Ch: a, Cl: f, Dh: d, Dl: p, Eh: h, El: b, Fh: g, Fl: w, Gh: S, Gl: A, Hh: T, Hl: L } = this;
    for (let x = 0; x < 80; x++) {
      const I = O.rotrSH(h, b, 14) ^ O.rotrSH(h, b, 18) ^ O.rotrBH(h, b, 41), v = O.rotrSL(h, b, 14) ^ O.rotrSL(h, b, 18) ^ O.rotrBL(h, b, 41), M = h & g ^ ~h & S, G = b & w ^ ~b & A, z = O.add5L(L, v, G, Ra[x], Dt[x]), W = O.add5H(z, T, I, M, Ya[x], Ft[x]), nt = z | 0, bt = O.rotrSH(r, s, 28) ^ O.rotrBH(r, s, 34) ^ O.rotrBH(r, s, 39), ft = O.rotrSL(r, s, 28) ^ O.rotrBL(r, s, 34) ^ O.rotrBL(r, s, 39), yt = r & o ^ r & a ^ o & a, Ot = s & c ^ s & f ^ c & f;
      T = S | 0, L = A | 0, S = g | 0, A = w | 0, g = h | 0, w = b | 0, { h, l: b } = O.add(d | 0, p | 0, W | 0, nt | 0), d = a | 0, p = f | 0, a = o | 0, f = c | 0, o = r | 0, c = s | 0;
      const St = O.add3L(nt, ft, Ot);
      r = O.add3H(St, W, bt, yt), s = St | 0;
    }
    ({ h: r, l: s } = O.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: c } = O.add(this.Bh | 0, this.Bl | 0, o | 0, c | 0), { h: a, l: f } = O.add(this.Ch | 0, this.Cl | 0, a | 0, f | 0), { h: d, l: p } = O.add(this.Dh | 0, this.Dl | 0, d | 0, p | 0), { h, l: b } = O.add(this.Eh | 0, this.El | 0, h | 0, b | 0), { h: g, l: w } = O.add(this.Fh | 0, this.Fl | 0, g | 0, w | 0), { h: S, l: A } = O.add(this.Gh | 0, this.Gl | 0, S | 0, A | 0), { h: T, l: L } = O.add(this.Hh | 0, this.Hl | 0, T | 0, L | 0), this.set(r, s, o, c, a, f, d, p, h, b, g, w, S, A, T, L);
  }
  roundClean() {
    (0, et.clean)(Ft, Dt);
  }
  destroy() {
    (0, et.clean)(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
j.SHA512 = je;
class bi extends je {
  constructor() {
    super(48), this.Ah = C.SHA384_IV[0] | 0, this.Al = C.SHA384_IV[1] | 0, this.Bh = C.SHA384_IV[2] | 0, this.Bl = C.SHA384_IV[3] | 0, this.Ch = C.SHA384_IV[4] | 0, this.Cl = C.SHA384_IV[5] | 0, this.Dh = C.SHA384_IV[6] | 0, this.Dl = C.SHA384_IV[7] | 0, this.Eh = C.SHA384_IV[8] | 0, this.El = C.SHA384_IV[9] | 0, this.Fh = C.SHA384_IV[10] | 0, this.Fl = C.SHA384_IV[11] | 0, this.Gh = C.SHA384_IV[12] | 0, this.Gl = C.SHA384_IV[13] | 0, this.Hh = C.SHA384_IV[14] | 0, this.Hl = C.SHA384_IV[15] | 0;
  }
}
j.SHA384 = bi;
const it = /* @__PURE__ */ Uint32Array.from([
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
]), ot = /* @__PURE__ */ Uint32Array.from([
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
class yi extends je {
  constructor() {
    super(28), this.Ah = it[0] | 0, this.Al = it[1] | 0, this.Bh = it[2] | 0, this.Bl = it[3] | 0, this.Ch = it[4] | 0, this.Cl = it[5] | 0, this.Dh = it[6] | 0, this.Dl = it[7] | 0, this.Eh = it[8] | 0, this.El = it[9] | 0, this.Fh = it[10] | 0, this.Fl = it[11] | 0, this.Gh = it[12] | 0, this.Gl = it[13] | 0, this.Hh = it[14] | 0, this.Hl = it[15] | 0;
  }
}
j.SHA512_224 = yi;
class wi extends je {
  constructor() {
    super(32), this.Ah = ot[0] | 0, this.Al = ot[1] | 0, this.Bh = ot[2] | 0, this.Bl = ot[3] | 0, this.Ch = ot[4] | 0, this.Cl = ot[5] | 0, this.Dh = ot[6] | 0, this.Dl = ot[7] | 0, this.Eh = ot[8] | 0, this.El = ot[9] | 0, this.Fh = ot[10] | 0, this.Fl = ot[11] | 0, this.Gh = ot[12] | 0, this.Gl = ot[13] | 0, this.Hh = ot[14] | 0, this.Hl = ot[15] | 0;
  }
}
j.SHA512_256 = wi;
j.sha256 = (0, et.createHasher)(() => new Ar());
j.sha224 = (0, et.createHasher)(() => new gi());
j.sha512 = (0, et.createHasher)(() => new je());
j.sha384 = (0, et.createHasher)(() => new bi());
j.sha512_256 = (0, et.createHasher)(() => new wi());
j.sha512_224 = (0, et.createHasher)(() => new yi());
Object.defineProperty(Et, "__esModule", { value: !0 });
Et.sha224 = Et.SHA224 = Et.sha256 = Et.SHA256 = void 0;
const vn = j;
Et.SHA256 = vn.SHA256;
Et.sha256 = vn.sha256;
Et.SHA224 = vn.SHA224;
Et.sha224 = vn.sha224;
Object.defineProperty(se, "__esModule", { value: !0 });
se.c32checkDecode = se.c32checkEncode = void 0;
const ws = Et, xs = ce, Pe = Sr;
function xi(t) {
  const e = (0, ws.sha256)((0, ws.sha256)((0, xs.hexToBytes)(t)));
  return (0, xs.bytesToHex)(e.slice(0, 4));
}
function Qa(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = xi(`${n}${e}`), s = (0, Pe.c32encode)(`${e}${r}`);
  return `${Pe.c32[t]}${s}`;
}
se.c32checkEncode = Qa;
function Ja(t) {
  t = (0, Pe.c32normalize)(t);
  const e = (0, Pe.c32decode)(t.slice(1)), n = t[0], r = Pe.c32.indexOf(n), s = e.slice(-8);
  let o = r.toString(16);
  if (o.length === 1 && (o = `0${o}`), xi(`${o}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
se.c32checkDecode = Ja;
var Si = {}, ye = {};
function tf(t) {
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
  var c = t.length, a = t.charAt(0), f = Math.log(c) / Math.log(256), d = Math.log(256) / Math.log(c);
  function p(g) {
    if (g instanceof Uint8Array || (ArrayBuffer.isView(g) ? g = new Uint8Array(g.buffer, g.byteOffset, g.byteLength) : Array.isArray(g) && (g = Uint8Array.from(g))), !(g instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (g.length === 0)
      return "";
    for (var w = 0, S = 0, A = 0, T = g.length; A !== T && g[A] === 0; )
      A++, w++;
    for (var L = (T - A) * d + 1 >>> 0, x = new Uint8Array(L); A !== T; ) {
      for (var I = g[A], v = 0, M = L - 1; (I !== 0 || v < S) && M !== -1; M--, v++)
        I += 256 * x[M] >>> 0, x[M] = I % c >>> 0, I = I / c >>> 0;
      if (I !== 0)
        throw new Error("Non-zero carry");
      S = v, A++;
    }
    for (var G = L - S; G !== L && x[G] === 0; )
      G++;
    for (var z = a.repeat(w); G < L; ++G)
      z += t.charAt(x[G]);
    return z;
  }
  function h(g) {
    if (typeof g != "string")
      throw new TypeError("Expected String");
    if (g.length === 0)
      return new Uint8Array();
    for (var w = 0, S = 0, A = 0; g[w] === a; )
      S++, w++;
    for (var T = (g.length - w) * f + 1 >>> 0, L = new Uint8Array(T); g[w]; ) {
      var x = g.charCodeAt(w);
      if (x > 255)
        return;
      var I = e[x];
      if (I === 255)
        return;
      for (var v = 0, M = T - 1; (I !== 0 || v < A) && M !== -1; M--, v++)
        I += c * L[M] >>> 0, L[M] = I % 256 >>> 0, I = I / 256 >>> 0;
      if (I !== 0)
        throw new Error("Non-zero carry");
      A = v, w++;
    }
    for (var G = T - A; G !== T && L[G] === 0; )
      G++;
    for (var z = new Uint8Array(S + (T - G)), W = S; G !== T; )
      z[W++] = L[G++];
    return z;
  }
  function b(g) {
    var w = h(g);
    if (w)
      return w;
    throw new Error("Non-base" + c + " character");
  }
  return {
    encode: p,
    decodeUnsafe: h,
    decode: b
  };
}
var ef = tf;
Object.defineProperty(ye, "__esModule", { value: !0 });
ye.decode = ye.encode = void 0;
const Sn = Et, Ss = ce, mi = ef, Ai = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function nf(t, e = "00") {
  const n = typeof t == "string" ? (0, Ss.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Ss.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Sn.sha256)((0, Sn.sha256)(new Uint8Array([...r, ...n])));
  return mi(Ai).encode([...r, ...n, ...s.slice(0, 4)]);
}
ye.encode = nf;
function rf(t) {
  const e = mi(Ai).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Sn.sha256)((0, Sn.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((o, c) => {
    if (o !== s[c])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
ye.decode = rf;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = se, n = ye, r = ce;
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
  function c(p, h) {
    if (!h.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, e.c32checkEncode)(p, h)}`;
  }
  t.c32address = c;
  function a(p) {
    if (p.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (p[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, e.c32checkDecode)(p.slice(1));
  }
  t.c32addressDecode = a;
  function f(p, h = -1) {
    const b = n.decode(p), g = (0, r.bytesToHex)(b.data), w = parseInt((0, r.bytesToHex)(b.prefix), 16);
    let S;
    return h < 0 ? (S = w, s[w] !== void 0 && (S = s[w])) : S = h, c(S, g);
  }
  t.b58ToC32 = f;
  function d(p, h = -1) {
    const b = a(p), g = b[0], w = b[1];
    let S;
    h < 0 ? (S = g, o[g] !== void 0 && (S = o[g])) : S = h;
    let A = S.toString(16);
    return A.length === 1 && (A = `0${A}`), n.encode(w, A);
  }
  t.c32ToB58 = d;
})(Si);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Sr;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = se;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Si;
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
})(xr);
var mn = { exports: {} };
mn.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, o = "[object Arguments]", c = "[object Array]", a = "[object Boolean]", f = "[object Date]", d = "[object Error]", p = "[object Function]", h = "[object GeneratorFunction]", b = "[object Map]", g = "[object Number]", w = "[object Object]", S = "[object Promise]", A = "[object RegExp]", T = "[object Set]", L = "[object String]", x = "[object Symbol]", I = "[object WeakMap]", v = "[object ArrayBuffer]", M = "[object DataView]", G = "[object Float32Array]", z = "[object Float64Array]", W = "[object Int8Array]", nt = "[object Int16Array]", bt = "[object Int32Array]", ft = "[object Uint8Array]", yt = "[object Uint8ClampedArray]", Ot = "[object Uint16Array]", St = "[object Uint32Array]", Ze = /[\\^$.*+?()[\]{}|]/g, Xe = /\w*$/, Ln = /^\[object .+?Constructor\]$/, l = /^(?:0|[1-9]\d*)$/, m = {};
  m[o] = m[c] = m[v] = m[M] = m[a] = m[f] = m[G] = m[z] = m[W] = m[nt] = m[bt] = m[b] = m[g] = m[w] = m[A] = m[T] = m[L] = m[x] = m[ft] = m[yt] = m[Ot] = m[St] = !0, m[d] = m[p] = m[I] = !1;
  var K = typeof un == "object" && un && un.Object === Object && un, Z = typeof self == "object" && self && self.Object === Object && self, F = K || Z || Function("return this")(), st = e && !e.nodeType && e, Ae = st && !0 && t && !t.nodeType && t, Ye = Ae && Ae.exports === st;
  function Pn(i, u) {
    return i.set(u[0], u[1]), i;
  }
  function qi(i, u) {
    return i.add(u), i;
  }
  function Zi(i, u) {
    for (var y = -1, B = i ? i.length : 0; ++y < B && u(i[y], y, i) !== !1; )
      ;
    return i;
  }
  function Xi(i, u) {
    for (var y = -1, B = u.length, rt = i.length; ++y < B; )
      i[rt + y] = u[y];
    return i;
  }
  function Tr(i, u, y, B) {
    for (var rt = -1, ht = i ? i.length : 0; ++rt < ht; )
      y = u(y, i[rt], rt, i);
    return y;
  }
  function Yi(i, u) {
    for (var y = -1, B = Array(i); ++y < i; )
      B[y] = u(y);
    return B;
  }
  function Ri(i, u) {
    return i == null ? void 0 : i[u];
  }
  function Ur(i) {
    var u = !1;
    if (i != null && typeof i.toString != "function")
      try {
        u = !!(i + "");
      } catch {
      }
    return u;
  }
  function Lr(i) {
    var u = -1, y = Array(i.size);
    return i.forEach(function(B, rt) {
      y[++u] = [rt, B];
    }), y;
  }
  function On(i, u) {
    return function(y) {
      return i(u(y));
    };
  }
  function Pr(i) {
    var u = -1, y = Array(i.size);
    return i.forEach(function(B) {
      y[++u] = B;
    }), y;
  }
  var Qi = Array.prototype, Ji = Function.prototype, Re = Object.prototype, kn = F["__core-js_shared__"], Or = function() {
    var i = /[^.]+$/.exec(kn && kn.keys && kn.keys.IE_PROTO || "");
    return i ? "Symbol(src)_1." + i : "";
  }(), kr = Ji.toString, kt = Re.hasOwnProperty, Qe = Re.toString, to = RegExp(
    "^" + kr.call(kt).replace(Ze, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), $r = Ye ? F.Buffer : void 0, Nr = F.Symbol, zr = F.Uint8Array, eo = On(Object.getPrototypeOf, Object), no = Object.create, ro = Re.propertyIsEnumerable, so = Qi.splice, Mr = Object.getOwnPropertySymbols, io = $r ? $r.isBuffer : void 0, oo = On(Object.keys, Object), $n = he(F, "DataView"), Ee = he(F, "Map"), Nn = he(F, "Promise"), zn = he(F, "Set"), Mn = he(F, "WeakMap"), Be = he(Object, "create"), co = Yt($n), ao = Yt(Ee), fo = Yt(Nn), ho = Yt(zn), uo = Yt(Mn), Vr = Nr ? Nr.prototype : void 0, Fr = Vr ? Vr.valueOf : void 0;
  function Zt(i) {
    var u = -1, y = i ? i.length : 0;
    for (this.clear(); ++u < y; ) {
      var B = i[u];
      this.set(B[0], B[1]);
    }
  }
  function lo() {
    this.__data__ = Be ? Be(null) : {};
  }
  function go(i) {
    return this.has(i) && delete this.__data__[i];
  }
  function po(i) {
    var u = this.__data__;
    if (Be) {
      var y = u[i];
      return y === r ? void 0 : y;
    }
    return kt.call(u, i) ? u[i] : void 0;
  }
  function bo(i) {
    var u = this.__data__;
    return Be ? u[i] !== void 0 : kt.call(u, i);
  }
  function yo(i, u) {
    var y = this.__data__;
    return y[i] = Be && u === void 0 ? r : u, this;
  }
  Zt.prototype.clear = lo, Zt.prototype.delete = go, Zt.prototype.get = po, Zt.prototype.has = bo, Zt.prototype.set = yo;
  function Tt(i) {
    var u = -1, y = i ? i.length : 0;
    for (this.clear(); ++u < y; ) {
      var B = i[u];
      this.set(B[0], B[1]);
    }
  }
  function wo() {
    this.__data__ = [];
  }
  function xo(i) {
    var u = this.__data__, y = Je(u, i);
    if (y < 0)
      return !1;
    var B = u.length - 1;
    return y == B ? u.pop() : so.call(u, y, 1), !0;
  }
  function So(i) {
    var u = this.__data__, y = Je(u, i);
    return y < 0 ? void 0 : u[y][1];
  }
  function mo(i) {
    return Je(this.__data__, i) > -1;
  }
  function Ao(i, u) {
    var y = this.__data__, B = Je(y, i);
    return B < 0 ? y.push([i, u]) : y[B][1] = u, this;
  }
  Tt.prototype.clear = wo, Tt.prototype.delete = xo, Tt.prototype.get = So, Tt.prototype.has = mo, Tt.prototype.set = Ao;
  function ae(i) {
    var u = -1, y = i ? i.length : 0;
    for (this.clear(); ++u < y; ) {
      var B = i[u];
      this.set(B[0], B[1]);
    }
  }
  function Eo() {
    this.__data__ = {
      hash: new Zt(),
      map: new (Ee || Tt)(),
      string: new Zt()
    };
  }
  function Bo(i) {
    return tn(this, i).delete(i);
  }
  function Ho(i) {
    return tn(this, i).get(i);
  }
  function Io(i) {
    return tn(this, i).has(i);
  }
  function Co(i, u) {
    return tn(this, i).set(i, u), this;
  }
  ae.prototype.clear = Eo, ae.prototype.delete = Bo, ae.prototype.get = Ho, ae.prototype.has = Io, ae.prototype.set = Co;
  function fe(i) {
    this.__data__ = new Tt(i);
  }
  function _o() {
    this.__data__ = new Tt();
  }
  function vo(i) {
    return this.__data__.delete(i);
  }
  function To(i) {
    return this.__data__.get(i);
  }
  function Uo(i) {
    return this.__data__.has(i);
  }
  function Lo(i, u) {
    var y = this.__data__;
    if (y instanceof Tt) {
      var B = y.__data__;
      if (!Ee || B.length < n - 1)
        return B.push([i, u]), this;
      y = this.__data__ = new ae(B);
    }
    return y.set(i, u), this;
  }
  fe.prototype.clear = _o, fe.prototype.delete = vo, fe.prototype.get = To, fe.prototype.has = Uo, fe.prototype.set = Lo;
  function Po(i, u) {
    var y = Dn(i) || rc(i) ? Yi(i.length, String) : [], B = y.length, rt = !!B;
    for (var ht in i)
      kt.call(i, ht) && !(rt && (ht == "length" || Jo(ht, B))) && y.push(ht);
    return y;
  }
  function Dr(i, u, y) {
    var B = i[u];
    (!(kt.call(i, u) && jr(B, y)) || y === void 0 && !(u in i)) && (i[u] = y);
  }
  function Je(i, u) {
    for (var y = i.length; y--; )
      if (jr(i[y][0], u))
        return y;
    return -1;
  }
  function Oo(i, u) {
    return i && Gr(u, Gn(u), i);
  }
  function Vn(i, u, y, B, rt, ht, Ut) {
    var ut;
    if (B && (ut = ht ? B(i, rt, ht, Ut) : B(i)), ut !== void 0)
      return ut;
    if (!en(i))
      return i;
    var Xr = Dn(i);
    if (Xr) {
      if (ut = Yo(i), !u)
        return qo(i, ut);
    } else {
      var ue = Xt(i), Yr = ue == p || ue == h;
      if (ic(i))
        return Vo(i, u);
      if (ue == w || ue == o || Yr && !ht) {
        if (Ur(i))
          return ht ? i : {};
        if (ut = Ro(Yr ? {} : i), !u)
          return Zo(i, Oo(ut, i));
      } else {
        if (!m[ue])
          return ht ? i : {};
        ut = Qo(i, ue, Vn, u);
      }
    }
    Ut || (Ut = new fe());
    var Rr = Ut.get(i);
    if (Rr)
      return Rr;
    if (Ut.set(i, ut), !Xr)
      var Qr = y ? Xo(i) : Gn(i);
    return Zi(Qr || i, function(Wn, nn) {
      Qr && (nn = Wn, Wn = i[nn]), Dr(ut, nn, Vn(Wn, u, y, B, nn, i, Ut));
    }), ut;
  }
  function ko(i) {
    return en(i) ? no(i) : {};
  }
  function $o(i, u, y) {
    var B = u(i);
    return Dn(i) ? B : Xi(B, y(i));
  }
  function No(i) {
    return Qe.call(i);
  }
  function zo(i) {
    if (!en(i) || ec(i))
      return !1;
    var u = Zr(i) || Ur(i) ? to : Ln;
    return u.test(Yt(i));
  }
  function Mo(i) {
    if (!Kr(i))
      return oo(i);
    var u = [];
    for (var y in Object(i))
      kt.call(i, y) && y != "constructor" && u.push(y);
    return u;
  }
  function Vo(i, u) {
    if (u)
      return i.slice();
    var y = new i.constructor(i.length);
    return i.copy(y), y;
  }
  function Fn(i) {
    var u = new i.constructor(i.byteLength);
    return new zr(u).set(new zr(i)), u;
  }
  function Fo(i, u) {
    var y = u ? Fn(i.buffer) : i.buffer;
    return new i.constructor(y, i.byteOffset, i.byteLength);
  }
  function Do(i, u, y) {
    var B = u ? y(Lr(i), !0) : Lr(i);
    return Tr(B, Pn, new i.constructor());
  }
  function Go(i) {
    var u = new i.constructor(i.source, Xe.exec(i));
    return u.lastIndex = i.lastIndex, u;
  }
  function Wo(i, u, y) {
    var B = u ? y(Pr(i), !0) : Pr(i);
    return Tr(B, qi, new i.constructor());
  }
  function Ko(i) {
    return Fr ? Object(Fr.call(i)) : {};
  }
  function jo(i, u) {
    var y = u ? Fn(i.buffer) : i.buffer;
    return new i.constructor(y, i.byteOffset, i.length);
  }
  function qo(i, u) {
    var y = -1, B = i.length;
    for (u || (u = Array(B)); ++y < B; )
      u[y] = i[y];
    return u;
  }
  function Gr(i, u, y, B) {
    y || (y = {});
    for (var rt = -1, ht = u.length; ++rt < ht; ) {
      var Ut = u[rt], ut = void 0;
      Dr(y, Ut, ut === void 0 ? i[Ut] : ut);
    }
    return y;
  }
  function Zo(i, u) {
    return Gr(i, Wr(i), u);
  }
  function Xo(i) {
    return $o(i, Gn, Wr);
  }
  function tn(i, u) {
    var y = i.__data__;
    return tc(u) ? y[typeof u == "string" ? "string" : "hash"] : y.map;
  }
  function he(i, u) {
    var y = Ri(i, u);
    return zo(y) ? y : void 0;
  }
  var Wr = Mr ? On(Mr, Object) : ac, Xt = No;
  ($n && Xt(new $n(new ArrayBuffer(1))) != M || Ee && Xt(new Ee()) != b || Nn && Xt(Nn.resolve()) != S || zn && Xt(new zn()) != T || Mn && Xt(new Mn()) != I) && (Xt = function(i) {
    var u = Qe.call(i), y = u == w ? i.constructor : void 0, B = y ? Yt(y) : void 0;
    if (B)
      switch (B) {
        case co:
          return M;
        case ao:
          return b;
        case fo:
          return S;
        case ho:
          return T;
        case uo:
          return I;
      }
    return u;
  });
  function Yo(i) {
    var u = i.length, y = i.constructor(u);
    return u && typeof i[0] == "string" && kt.call(i, "index") && (y.index = i.index, y.input = i.input), y;
  }
  function Ro(i) {
    return typeof i.constructor == "function" && !Kr(i) ? ko(eo(i)) : {};
  }
  function Qo(i, u, y, B) {
    var rt = i.constructor;
    switch (u) {
      case v:
        return Fn(i);
      case a:
      case f:
        return new rt(+i);
      case M:
        return Fo(i, B);
      case G:
      case z:
      case W:
      case nt:
      case bt:
      case ft:
      case yt:
      case Ot:
      case St:
        return jo(i, B);
      case b:
        return Do(i, B, y);
      case g:
      case L:
        return new rt(i);
      case A:
        return Go(i);
      case T:
        return Wo(i, B, y);
      case x:
        return Ko(i);
    }
  }
  function Jo(i, u) {
    return u = u ?? s, !!u && (typeof i == "number" || l.test(i)) && i > -1 && i % 1 == 0 && i < u;
  }
  function tc(i) {
    var u = typeof i;
    return u == "string" || u == "number" || u == "symbol" || u == "boolean" ? i !== "__proto__" : i === null;
  }
  function ec(i) {
    return !!Or && Or in i;
  }
  function Kr(i) {
    var u = i && i.constructor, y = typeof u == "function" && u.prototype || Re;
    return i === y;
  }
  function Yt(i) {
    if (i != null) {
      try {
        return kr.call(i);
      } catch {
      }
      try {
        return i + "";
      } catch {
      }
    }
    return "";
  }
  function nc(i) {
    return Vn(i, !0, !0);
  }
  function jr(i, u) {
    return i === u || i !== i && u !== u;
  }
  function rc(i) {
    return sc(i) && kt.call(i, "callee") && (!ro.call(i, "callee") || Qe.call(i) == o);
  }
  var Dn = Array.isArray;
  function qr(i) {
    return i != null && oc(i.length) && !Zr(i);
  }
  function sc(i) {
    return cc(i) && qr(i);
  }
  var ic = io || fc;
  function Zr(i) {
    var u = en(i) ? Qe.call(i) : "";
    return u == p || u == h;
  }
  function oc(i) {
    return typeof i == "number" && i > -1 && i % 1 == 0 && i <= s;
  }
  function en(i) {
    var u = typeof i;
    return !!i && (u == "object" || u == "function");
  }
  function cc(i) {
    return !!i && typeof i == "object";
  }
  function Gn(i) {
    return qr(i) ? Po(i) : Mo(i);
  }
  function ac() {
    return [];
  }
  function fc() {
    return !1;
  }
  t.exports = nc;
})(mn, mn.exports);
var sf = mn.exports;
const of = /* @__PURE__ */ Wa(sf);
function Ei(t) {
  if (Y(t).byteLength != In)
    throw Error("Invalid signature");
  return {
    type: H.MessageSignature,
    data: t
  };
}
function ve(t, e) {
  return { type: H.Address, version: t, hash160: e };
}
function ms(t) {
  return xr.c32address(t.version, t.hash160);
}
function ie(t, e, n) {
  const r = e || 1, s = n || Uc;
  if ($i(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: H.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Er(t) {
  const e = xr.c32addressDecode(t);
  return {
    type: H.Address,
    version: e[0],
    hash160: e[1]
  };
}
var _;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(_ || (_ = {}));
function cf(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return hf(e, n);
  } else
    return af(t);
}
function af(t) {
  const e = Er(t);
  return { type: _.PrincipalStandard, address: e };
}
function ff(t) {
  return { type: _.PrincipalStandard, address: t };
}
function hf(t, e) {
  const n = Er(t), r = ie(e);
  return Bi(n, r);
}
function Bi(t, e) {
  if (We(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: _.PrincipalContract, address: t, contractName: e };
}
const uf = () => ({ type: _.BoolTrue }), lf = () => ({ type: _.BoolFalse }), As = BigInt("0xffffffffffffffffffffffffffffffff"), df = BigInt(0), Es = BigInt("0x7fffffffffffffffffffffffffffffff"), Bs = BigInt("-170141183460469231731687303715884105728"), gf = (t) => {
  const e = at(t, !0);
  if (e > Es)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Es}`);
  if (e < Bs)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Bs}`);
  return { type: _.Int, value: e };
}, pf = (t) => {
  const e = at(t, !1);
  if (e < df)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > As)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${As}`);
  return { type: _.UInt, value: e };
}, bf = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: _.Buffer, buffer: t };
};
function Hi() {
  return { type: _.OptionalNone };
}
function Ii(t) {
  return { type: _.OptionalSome, value: t };
}
function yf(t) {
  return { type: _.ResponseErr, value: t };
}
function wf(t) {
  return { type: _.ResponseOk, value: t };
}
function xf(t) {
  return { type: _.List, list: t };
}
function Sf(t) {
  for (const e in t)
    if (!hh(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: _.Tuple, data: t };
}
const mf = (t) => ({ type: _.StringASCII, data: t }), Af = (t) => ({ type: _.StringUTF8, data: t });
class Ci extends Ns {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Jt.hash(e);
    const r = gr(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, o = new Uint8Array(s);
    o.set(r.length > s ? e.create().update(r).digest() : r);
    for (let c = 0; c < o.length; c++)
      o[c] ^= 54;
    this.iHash.update(o), this.oHash = e.create();
    for (let c = 0; c < o.length; c++)
      o[c] ^= 106;
    this.oHash.update(o), o.fill(0);
  }
  update(e) {
    return Jt.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Jt.exists(this), Jt.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: c, outputLen: a } = this;
    return e = e, e.finished = s, e.destroyed = o, e.blockLen = c, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const _i = (t, e, n) => new Ci(t, e).update(n).digest();
_i.create = (t, e) => new Ci(t, e);
Kt.hmacSha256Sync = (t, ...e) => {
  const n = _i.create(wr, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function we(t) {
  return {
    type: H.PublicKey,
    data: Y(t)
  };
}
function Ef(t, e, n = Q.Compressed) {
  const r = Ec(e.data), s = new _t(ts(r.r), ts(r.s)), o = q.fromSignature(t, s, r.recoveryId), c = n === Q.Compressed;
  return o.toHex(c);
}
function Bf(t) {
  return { type: H.PublicKey, data: t };
}
function me(t) {
  return !$(t.data).startsWith("04");
}
function An(t) {
  return t.data.slice();
}
function Hf(t) {
  const e = _f(t), n = Ma(e.data.slice(0, 32), e.compressed);
  return we($(n));
}
function If(t) {
  const e = typeof t == "string" ? t : $(t), n = q.fromHex(e).toHex(!0);
  return we(n);
}
function Cf(t) {
  const e = typeof t == "string" ? t : $(t), n = q.fromHex(e).toHex(!1);
  return we(n);
}
function ir(t) {
  const e = t.readUInt8(), n = e === 4 ? Oc : Pc;
  return Bf(J([e, t.readBytes(n)]));
}
function _f(t) {
  const e = Bc(t), n = e.length == Os;
  return { data: e, compressed: n };
}
function vf(t, e) {
  const [n, r] = Ga(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const o = Ge(r, 1) + _t.fromHex(n).toCompactHex();
  return Ei(o);
}
function Tf(t) {
  return Hf(t.data);
}
function Uf(t, e, n) {
  return typeof t == "string" && (t = cf(t)), typeof n == "string" && (n = Cs(n)), {
    type: H.Payload,
    payloadType: k.TokenTransfer,
    recipient: t,
    amount: at(e, !1),
    memo: n ?? Cs("")
  };
}
function Lf(t, e, n, r) {
  return typeof t == "string" && (t = Er(t)), typeof e == "string" && (e = ie(e)), typeof n == "string" && (n = ie(n)), {
    type: H.Payload,
    payloadType: k.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Hs(t, e, n) {
  return typeof t == "string" && (t = ie(t)), typeof e == "string" && (e = Ff(e)), typeof n == "number" ? {
    type: H.Payload,
    payloadType: k.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: H.Payload,
    payloadType: k.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function Pf() {
  return { type: H.Payload, payloadType: k.PoisonMicroblock };
}
function Is(t, e) {
  if (t.byteLength != ee)
    throw Error(`Coinbase buffer size must be ${ee} bytes`);
  return e != null ? {
    type: H.Payload,
    payloadType: k.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: H.Payload,
    payloadType: k.Coinbase,
    coinbaseBytes: t
  };
}
function Of(t, e, n) {
  if (t.byteLength != ee)
    throw Error(`Coinbase buffer size must be ${ee} bytes`);
  if (n.byteLength != Rn)
    throw Error(`VRF proof buffer size must be ${Rn} bytes`);
  return {
    type: H.Payload,
    payloadType: k.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === _.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var or;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(or || (or = {}));
function kf(t, e, n, r, s, o, c) {
  return {
    type: H.Payload,
    payloadType: k.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: o,
    publicKeyHash: c
  };
}
function vi(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case k.TokenTransfer:
      e.push(Pt(t.recipient)), e.push(qt(t.amount, !1, 8)), e.push(Lt(t.memo));
      break;
    case k.ContractCall:
      e.push(Lt(t.contractAddress)), e.push(Lt(t.contractName)), e.push(Lt(t.functionName));
      const n = new Uint8Array(4);
      re(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Pt(r));
      });
      break;
    case k.SmartContract:
      e.push(Lt(t.contractName)), e.push(Lt(t.codeBody));
      break;
    case k.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Lt(t.contractName)), e.push(Lt(t.codeBody));
      break;
    case k.PoisonMicroblock:
      break;
    case k.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case k.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Pt(t.recipient));
      break;
    case k.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Pt(t.recipient ? Ii(t.recipient) : Hi())), e.push(t.vrfProof);
      break;
    case k.TenureChange:
      e.push(Y(t.tenureHash)), e.push(Y(t.previousTenureHash)), e.push(Y(t.burnViewHash)), e.push(Y(t.previousTenureEnd)), e.push(re(new Uint8Array(4), t.previousTenureBlocks)), e.push(_c(new Uint8Array(1), t.cause)), e.push(Y(t.publicKeyHash));
      break;
  }
  return J(e);
}
function $f(t) {
  switch (t.readUInt8Enum(k, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case k.TokenTransfer:
      const n = It(t), r = at(t.readBytes(8), !1), s = Ui(t);
      return Uf(n, r, s);
    case k.ContractCall:
      const o = xe(t), c = xt(t), a = xt(t), f = [], d = t.readUInt32BE();
      for (let x = 0; x < d; x++) {
        const I = It(t);
        f.push(I);
      }
      return Lf(o, c, a, f);
    case k.SmartContract:
      const p = xt(t), h = xt(t, 4, 1e5);
      return Hs(p, h);
    case k.VersionedSmartContract: {
      const x = t.readUInt8Enum(Qn, (M) => {
        throw new Error(`Cannot recognize ClarityVersion: ${M}`);
      }), I = xt(t), v = xt(t, 4, 1e5);
      return Hs(I, v, x);
    }
    case k.PoisonMicroblock:
      return Pf();
    case k.Coinbase: {
      const x = t.readBytes(ee);
      return Is(x);
    }
    case k.CoinbaseToAltRecipient: {
      const x = t.readBytes(ee), I = It(t);
      return Is(x, I);
    }
    case k.NakamotoCoinbase: {
      const x = t.readBytes(ee), I = It(t), v = t.readBytes(Rn);
      return Of(x, I, v);
    }
    case k.TenureChange:
      const b = $(t.readBytes(20)), g = $(t.readBytes(20)), w = $(t.readBytes(20)), S = $(t.readBytes(32)), A = t.readUInt32BE(), T = t.readUInt8Enum(or, (x) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${x}`);
      }), L = $(t.readBytes(20));
      return kf(b, g, w, S, A, T, L);
  }
}
class Tn extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Rt extends Tn {
  constructor(e) {
    super(e);
  }
}
class pt extends Tn {
  constructor(e) {
    super(e);
  }
}
class En extends Tn {
  constructor(e) {
    super(e);
  }
}
class te extends Tn {
  constructor(e) {
    super(e);
  }
}
var mt;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(mt || (mt = {}));
function cr(t) {
  return Ei($(t.readBytes(In)));
}
function le(t, e) {
  return {
    pubKeyEncoding: t,
    type: H.TransactionAuthField,
    contents: e
  };
}
function Nf(t) {
  const e = t.readUInt8Enum(mt, (n) => {
    throw new pt(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case mt.PublicKeyCompressed:
      return le(Q.Compressed, ir(t));
    case mt.PublicKeyUncompressed:
      return le(Q.Uncompressed, Cf(ir(t).data));
    case mt.SignatureCompressed:
      return le(Q.Compressed, cr(t));
    case mt.SignatureUncompressed:
      return le(Q.Uncompressed, cr(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function Br(t) {
  return Y(t.data);
}
function zf(t) {
  const e = [];
  switch (t.contents.type) {
    case H.PublicKey:
      e.push(t.pubKeyEncoding === Q.Compressed ? mt.PublicKeyCompressed : mt.PublicKeyUncompressed), e.push(An(If(t.contents.data)));
      break;
    case H.MessageSignature:
      e.push(t.pubKeyEncoding === Q.Compressed ? mt.SignatureCompressed : mt.SignatureUncompressed), e.push(Br(t.contents));
      break;
  }
  return J(e);
}
function Lt(t) {
  switch (t.type) {
    case H.Address:
      return qe(t);
    case H.Principal:
      return Ti(t);
    case H.LengthPrefixedString:
      return Se(t);
    case H.MemoString:
      return Df(t);
    case H.AssetInfo:
      return Li(t);
    case H.PostCondition:
      return Gf(t);
    case H.PublicKey:
      return An(t);
    case H.LengthPrefixedList:
      return Cr(t);
    case H.Payload:
      return vi(t);
    case H.TransactionAuthField:
      return zf(t);
    case H.MessageSignature:
      return Br(t);
  }
}
function Mf() {
  return {
    type: H.Address,
    version: bn.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Hr(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === D.SerializeP2PKH || e === D.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === D.SerializeP2WPKH || e === D.SerializeP2WSH || e === D.SerializeP2WSHNonSequential) && !r.every(me))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case D.SerializeP2PKH:
      return ve(t, oh(r[0].data));
    case D.SerializeP2WPKH:
      return ve(t, ch(r[0].data));
    case D.SerializeP2SH:
    case D.SerializeP2SHNonSequential:
      return ve(t, ah(n, r.map(An)));
    case D.SerializeP2WSH:
    case D.SerializeP2WSHNonSequential:
      return ve(t, fh(n, r.map(An)));
  }
}
function qe(t) {
  const e = [];
  return e.push(Y(Ge(t.version, 1))), e.push(Y(t.hash160)), J(e);
}
function xe(t) {
  const e = Bn($(t.readBytes(1))), n = $(t.readBytes(20));
  return { type: H.Address, version: e, hash160: n };
}
function Ti(t) {
  const e = [];
  return e.push(t.prefix), e.push(qe(t.address)), t.prefix === $e.Contract && e.push(Se(t.contractName)), J(e);
}
function Vf(t) {
  const e = t.readUInt8Enum($e, (s) => {
    throw new pt(`Unexpected Principal payload type: ${s}`);
  }), n = xe(t);
  if (e === $e.Standard)
    return { type: H.Principal, prefix: e, address: n };
  const r = xt(t);
  return {
    type: H.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function Se(t) {
  const e = [], n = We(t.content), r = n.byteLength;
  return e.push(Y(Ge(r, t.lengthPrefixBytes))), e.push(n), J(e);
}
function xt(t, e, n) {
  e = e || 1;
  const r = Bn($(t.readBytes(e))), s = dr(t.readBytes(r));
  return ie(s, e, n ?? 128);
}
function Ff(t) {
  return ie(t, 4, 1e5);
}
function Cs(t) {
  if (t && $i(t, gn))
    throw new Error(`Memo exceeds maximum length of ${gn} bytes`);
  return { type: H.MemoString, content: t };
}
function Df(t) {
  const e = [], n = We(t.content), r = ih($(n), gn * 2);
  return e.push(Y(r)), J(e);
}
function Ui(t) {
  let e = dr(t.readBytes(gn));
  return e = e.replace(/\u0000*$/, ""), { type: H.MemoString, content: e };
}
function Li(t) {
  const e = [];
  return e.push(qe(t.address)), e.push(Se(t.contractName)), e.push(Se(t.assetName)), J(e);
}
function ar(t) {
  return {
    type: H.AssetInfo,
    address: xe(t),
    contractName: xt(t),
    assetName: xt(t)
  };
}
function Ir(t, e) {
  return {
    type: H.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Cr(t) {
  const e = t.values, n = [];
  n.push(Y(Ge(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Lt(r));
  return J(n);
}
function Pi(t, e, n) {
  const r = Bn($(t.readBytes(4))), s = [];
  for (let o = 0; o < r; o++)
    switch (e) {
      case H.Address:
        s.push(xe(t));
        break;
      case H.LengthPrefixedString:
        s.push(xt(t));
        break;
      case H.MemoString:
        s.push(Ui(t));
        break;
      case H.AssetInfo:
        s.push(ar(t));
        break;
      case H.PostCondition:
        s.push(Wf(t));
        break;
      case H.PublicKey:
        s.push(ir(t));
        break;
      case H.TransactionAuthField:
        s.push(Nf(t));
        break;
    }
  return Ir(s, n);
}
function Gf(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Ti(t.principal)), (t.conditionType === dt.Fungible || t.conditionType === dt.NonFungible) && e.push(Li(t.assetInfo)), t.conditionType === dt.NonFungible && e.push(Pt(t.assetName)), e.push(t.conditionCode), t.conditionType === dt.STX || t.conditionType === dt.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Rt("The post-condition amount may not be larger than 8 bytes");
    e.push(qt(t.amount, !1, 8));
  }
  return J(e);
}
function Wf(t) {
  const e = t.readUInt8Enum(dt, (c) => {
    throw new pt(`Could not read ${c} as PostConditionType`);
  }), n = Vf(t);
  let r, s, o;
  switch (e) {
    case dt.STX:
      return r = t.readUInt8Enum(yn, (a) => {
        throw new pt(`Could not read ${a} as FungibleConditionCode`);
      }), o = BigInt(`0x${$(t.readBytes(8))}`), {
        type: H.PostCondition,
        conditionType: dt.STX,
        principal: n,
        conditionCode: r,
        amount: o
      };
    case dt.Fungible:
      return s = ar(t), r = t.readUInt8Enum(yn, (a) => {
        throw new pt(`Could not read ${a} as FungibleConditionCode`);
      }), o = BigInt(`0x${$(t.readBytes(8))}`), {
        type: H.PostCondition,
        conditionType: dt.Fungible,
        principal: n,
        conditionCode: r,
        amount: o,
        assetInfo: s
      };
    case dt.NonFungible:
      s = ar(t);
      const c = It(t);
      return r = t.readUInt8Enum(Jn, (a) => {
        throw new pt(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: H.PostCondition,
        conditionType: dt.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: c
      };
  }
}
function vt(t, e) {
  return J([t, e]);
}
function Kf(t) {
  return new Uint8Array([t.type]);
}
function jf(t) {
  return t.type === _.OptionalNone ? new Uint8Array([t.type]) : vt(t.type, Pt(t.value));
}
function qf(t) {
  const e = new Uint8Array(4);
  return re(e, t.buffer.length, 0), vt(t.type, Hn(e, t.buffer));
}
function Zf(t) {
  const e = lr(bc(t.value, BigInt(Lc)), ks);
  return vt(t.type, e);
}
function Xf(t) {
  const e = lr(t.value, ks);
  return vt(t.type, e);
}
function Yf(t) {
  return vt(t.type, qe(t.address));
}
function Rf(t) {
  return vt(t.type, Hn(qe(t.address), Se(t.contractName)));
}
function Qf(t) {
  return vt(t.type, Pt(t.value));
}
function Jf(t) {
  const e = [], n = new Uint8Array(4);
  re(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Pt(r);
    e.push(s);
  }
  return vt(t.type, J(e));
}
function th(t) {
  const e = [], n = new Uint8Array(4);
  re(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = ie(s);
    e.push(Se(o));
    const c = Pt(t.data[s]);
    e.push(c);
  }
  return vt(t.type, J(e));
}
function Oi(t, e) {
  const n = [], r = e == "ascii" ? Sc(t.data) : We(t.data), s = new Uint8Array(4);
  return re(s, r.length, 0), n.push(s), n.push(r), vt(t.type, J(n));
}
function eh(t) {
  return Oi(t, "ascii");
}
function nh(t) {
  return Oi(t, "utf8");
}
function Pt(t) {
  switch (t.type) {
    case _.BoolTrue:
    case _.BoolFalse:
      return Kf(t);
    case _.OptionalNone:
    case _.OptionalSome:
      return jf(t);
    case _.Buffer:
      return qf(t);
    case _.UInt:
      return Xf(t);
    case _.Int:
      return Zf(t);
    case _.PrincipalStandard:
      return Yf(t);
    case _.PrincipalContract:
      return Rf(t);
    case _.ResponseOk:
    case _.ResponseErr:
      return Qf(t);
    case _.List:
      return Jf(t);
    case _.Tuple:
      return th(t);
    case _.StringASCII:
      return eh(t);
    case _.StringUTF8:
      return nh(t);
    default:
      throw new Rt("Unable to serialize. Invalid Clarity Value.");
  }
}
function rh(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const _s = /* @__PURE__ */ new Map();
function ki(t, e) {
  const n = _s.get(t);
  if (n !== void 0)
    return n(e);
  const r = rh(t);
  return _s.set(t, r), ki(t, e);
}
class Oe {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return vc(this.readBytes(4), 0);
  }
  readUInt8() {
    return Cc(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Hc(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = $(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = $(n);
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
    if (ki(e, r))
      return r;
    throw n(r);
  }
}
function It(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Oe(Y(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Oe(t) : e = t;
  switch (e.readUInt8Enum(_, (r) => {
    throw new pt(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case _.Int:
      return gf(e.readBytes(16));
    case _.UInt:
      return pf(e.readBytes(16));
    case _.Buffer:
      const r = e.readUInt32BE();
      return bf(e.readBytes(r));
    case _.BoolTrue:
      return uf();
    case _.BoolFalse:
      return lf();
    case _.PrincipalStandard:
      const s = xe(e);
      return ff(s);
    case _.PrincipalContract:
      const o = xe(e), c = xt(e);
      return Bi(o, c);
    case _.ResponseOk:
      return wf(It(e));
    case _.ResponseErr:
      return yf(It(e));
    case _.OptionalNone:
      return Hi();
    case _.OptionalSome:
      return Ii(It(e));
    case _.List:
      const a = e.readUInt32BE(), f = [];
      for (let S = 0; S < a; S++)
        f.push(It(e));
      return xf(f);
    case _.Tuple:
      const d = e.readUInt32BE(), p = {};
      for (let S = 0; S < d; S++) {
        const A = xt(e).content;
        if (A === void 0)
          throw new pt('"content" is undefined');
        p[A] = It(e);
      }
      return Sf(p);
    case _.StringASCII:
      const h = e.readUInt32BE(), b = mc(e.readBytes(h));
      return mf(b);
    case _.StringUTF8:
      const g = e.readUInt32BE(), w = dr(e.readBytes(g));
      return Af(w);
    default:
      throw new pt("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const sh = (t) => t.length % 2 == 0 ? t : `0${t}`, ih = (t, e) => t.padEnd(e, "0"), $i = (t, e) => t ? We(t).length > e : !1;
function fr(t) {
  return of(t);
}
const Me = (t) => Yc(wr(t)), _r = (t) => $(Ca(t)), oh = (t) => $(Me(t)), ch = (t) => {
  const e = Me(t), n = Hn(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Me(n);
  return $(r);
}, ah = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((o) => {
    n.push(o.length), n.push(o);
  }), n.push(80 + e.length), n.push(174);
  const r = J(n), s = Me(r);
  return $(s);
}, fh = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((f) => {
    n.push(f.length), n.push(f);
  }), n.push(80 + e.length), n.push(174);
  const r = J(n), s = wr(r), o = [];
  o.push(0), o.push(s.length), o.push(s);
  const c = J(o), a = Me(c);
  return $(a);
};
function hh(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function vr() {
  return {
    type: H.MessageSignature,
    data: $(new Uint8Array(In))
  };
}
function Ni(t, e, n, r) {
  const s = Hr(0, t, 1, [we(e)]).hash160, o = me(we(e)) ? Q.Compressed : Q.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: at(n, !1),
    fee: at(r, !1),
    keyEncoding: o,
    signature: vr()
  };
}
function Ve(t) {
  return "signature" in t;
}
function vs(t) {
  return t === D.SerializeP2SH || t === D.SerializeP2WSH;
}
function uh(t) {
  return t === D.SerializeP2SHNonSequential || t === D.SerializeP2WSHNonSequential;
}
function Ts(t) {
  const e = fr(t);
  return e.nonce = 0, e.fee = 0, Ve(e) ? e.signature = vr() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function lh(t) {
  const e = [
    t.hashMode,
    Y(t.signer),
    qt(t.nonce, !1, 8),
    qt(t.fee, !1, 8),
    t.keyEncoding,
    Br(t.signature)
  ];
  return J(e);
}
function dh(t) {
  const e = [
    t.hashMode,
    Y(t.signer),
    qt(t.nonce, !1, 8),
    qt(t.fee, !1, 8)
  ], n = Ir(t.fields);
  e.push(Cr(n));
  const r = new Uint8Array(2);
  return Ic(r, t.signaturesRequired, 0), e.push(r), J(e);
}
function gh(t, e) {
  const n = $(e.readBytes(20)), r = BigInt(`0x${$(e.readBytes(8))}`), s = BigInt(`0x${$(e.readBytes(8))}`), o = e.readUInt8Enum(Q, (a) => {
    throw new pt(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === D.SerializeP2WPKH && o != Q.Compressed)
    throw new pt("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const c = cr(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: o,
    signature: c
  };
}
function ph(t, e) {
  const n = $(e.readBytes(20)), r = BigInt("0x" + $(e.readBytes(8))), s = BigInt("0x" + $(e.readBytes(8))), o = Pi(e, H.TransactionAuthField).values;
  let c = !1, a = 0;
  for (const d of o)
    switch (d.contents.type) {
      case H.PublicKey:
        me(d.contents) || (c = !0);
        break;
      case H.MessageSignature:
        if (d.pubKeyEncoding === Q.Uncompressed && (c = !0), a += 1, a === 65536)
          throw new te("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const f = e.readUInt16BE();
  if (c && (t === D.SerializeP2WSH || t === D.SerializeP2WSHNonSequential))
    throw new te("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: o,
    signaturesRequired: f
  };
}
function Zn(t) {
  return Ve(t) ? lh(t) : dh(t);
}
function Xn(t) {
  const e = t.readUInt8Enum(D, (n) => {
    throw new pt(`Could not parse ${n} as AddressHashMode`);
  });
  return e === D.SerializeP2PKH || e === D.SerializeP2WPKH ? gh(e, t) : ph(e, t);
}
function zi(t, e, n, r) {
  const o = t + $(new Uint8Array([e])) + $(qt(n, !1, 8)) + $(qt(r, !1, 8));
  if (Y(o).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return _r(Y(o));
}
function Mi(t, e, n) {
  const r = 33 + In, s = me(e) ? Q.Compressed : Q.Uncompressed, o = t + sh(s.toString(16)) + n.data, c = Y(o);
  if (c.byteLength > r)
    throw Error("Invalid signature hash length");
  return _r(c);
}
function bh(t, e, n, r, s) {
  const o = zi(t, e, n, r), c = vf(s, o), a = Tf(s), f = Mi(o, a, c);
  return {
    nextSig: c,
    nextSigHash: f
  };
}
function Vi(t, e, n, r, s, o) {
  const c = zi(t, e, n, r), a = we(Ef(c, o, s)), f = Mi(c, a, o);
  return {
    pubKey: a,
    nextSigHash: f
  };
}
function yh() {
  const t = Ni(D.SerializeP2PKH, "", 0, 0);
  return t.signer = Mf().hash160, t.keyEncoding = Q.Compressed, t.signature = vr(), t;
}
function Us(t, e, n) {
  return Ve(t) ? wh(t, e, n) : xh(t, e, n);
}
function wh(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Vi(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), o = Hr(0, t.hashMode, 1, [r]).hash160;
  if (o !== t.signer)
    throw new te(`Signer hash does not equal hash of public key(s): ${o} != ${t.signer}`);
  return s;
}
function xh(t, e, n) {
  const r = [];
  let s = e, o = !1, c = 0;
  for (const f of t.fields)
    switch (f.contents.type) {
      case H.PublicKey:
        me(f.contents) || (o = !0), r.push(f.contents);
        break;
      case H.MessageSignature:
        f.pubKeyEncoding === Q.Uncompressed && (o = !0);
        const { pubKey: d, nextSigHash: p } = Vi(s, n, t.fee, t.nonce, f.pubKeyEncoding, f.contents);
        if (vs(t.hashMode) && (s = p), r.push(d), c += 1, c === 65536)
          throw new te("Too many signatures");
        break;
    }
  if (vs(t.hashMode) && c !== t.signaturesRequired || uh(t.hashMode) && c < t.signaturesRequired)
    throw new te("Incorrect number of signatures");
  if (o && (t.hashMode === D.SerializeP2WSH || t.hashMode === D.SerializeP2WSHNonSequential))
    throw new te("Uncompressed keys are not allowed in this hash mode");
  const a = Hr(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new te(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Fi(t) {
  return {
    authType: R.Standard,
    spendingCondition: t
  };
}
function Di(t, e) {
  return {
    authType: R.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Ni(D.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function Ls(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case R.Standard:
        return Fi(Ts(t.spendingCondition));
      case R.Sponsored:
        return Di(Ts(t.spendingCondition), yh());
      default:
        throw new En("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function Sh(t, e) {
  switch (t.authType) {
    case R.Standard:
      return Us(t.spendingCondition, e, R.Standard);
    case R.Sponsored:
      return Us(t.spendingCondition, e, R.Standard);
    default:
      throw new En("Invalid origin auth type");
  }
}
function mh(t, e) {
  switch (t.authType) {
    case R.Standard:
      const n = {
        ...t.spendingCondition,
        fee: at(e, !1)
      };
      return { ...t, spendingCondition: n };
    case R.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: at(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function Ah(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: at(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function Eh(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: at(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function Bh(t, e) {
  const n = {
    ...e,
    nonce: at(e.nonce, !1),
    fee: at(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function Hh(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case R.Standard:
      e.push(Zn(t.spendingCondition));
      break;
    case R.Sponsored:
      e.push(Zn(t.spendingCondition)), e.push(Zn(t.sponsorSpendingCondition));
      break;
  }
  return J(e);
}
function Ih(t) {
  const e = t.readUInt8Enum(R, (r) => {
    throw new pt(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case R.Standard:
      return n = Xn(t), Fi(n);
    case R.Sponsored:
      n = Xn(t);
      const r = Xn(t);
      return Di(n, r);
  }
}
class Ch {
  constructor(e, n, r, s, o, c, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: at(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? Tc, this.postConditionMode = o ?? pn.Deny, this.postConditions = s ?? Ir([]), c)
      this.anchorMode = kc(c);
    else
      switch (r.payloadType) {
        case k.Coinbase:
        case k.CoinbaseToAltRecipient:
        case k.NakamotoCoinbase:
        case k.PoisonMicroblock:
        case k.TenureChange:
          this.anchorMode = lt.OnChainOnly;
          break;
        case k.ContractCall:
        case k.SmartContract:
        case k.VersionedSmartContract:
        case k.TokenTransfer:
          this.anchorMode = lt.Any;
          break;
      }
  }
  signBegin() {
    const e = fr(this);
    return e.auth = Ls(e.auth), e.txid();
  }
  verifyBegin() {
    const e = fr(this);
    return e.auth = Ls(e.auth), e.txid();
  }
  verifyOrigin() {
    return Sh(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, R.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === R.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, R.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !Ve(n)) {
      const r = me(e);
      n.fields.push(le(r ? Q.Compressed : Q.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: o, nextSigHash: c } = bh(n, r, e.fee, e.nonce, s);
    return Ve(e) ? e.signature = o : e.fields.push(le(s.data.byteLength === Os ? Q.Compressed : Q.Uncompressed, o)), c;
  }
  txid() {
    const e = this.serialize();
    return _r(e);
  }
  setSponsor(e) {
    if (this.auth.authType != R.Sponsored)
      throw new En("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Bh(this.auth, e);
  }
  setFee(e) {
    this.auth = mh(this.auth, e);
  }
  setNonce(e) {
    this.auth = Ah(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != R.Sponsored)
      throw new En("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Eh(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new Rt('"version" is undefined');
    if (this.chainId === void 0)
      throw new Rt('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Rt('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Rt('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Rt('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return re(n, this.chainId, 0), e.push(n), e.push(Hh(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Cr(this.postConditions)), e.push(vi(this.payload)), J(e);
  }
}
function _h(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new Oe(Y(t.slice(2))) : e = new Oe(Y(t)) : t instanceof Uint8Array ? e = new Oe(t) : e = t;
  const n = e.readUInt8Enum(ke, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = Ih(e), o = e.readUInt8Enum(lt, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), c = e.readUInt8Enum(pn, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), a = Pi(e, H.PostCondition), f = $f(e);
  return new Ch(n, s, f, a, c, o, r);
}
const Gi = "ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA", vh = "ParallaX LAYR", hr = 3000n, Th = 2147483648, Uh = (t) => {
  const e = t.replace(/^0x/, "");
  if (!/^(?:[0-9a-f]{2})+$/i.test(e) || e.length > 4096) throw new Error("The signed transaction is not readable.");
  return Uint8Array.from(e.match(/../g), (n) => parseInt(n, 16));
};
function Lh(t, e) {
  var f;
  const n = _h(Uh(t)), r = n.auth, s = r.spendingCondition, o = n.payload, c = ms(ve(bn.TestnetSingleSig, s.signer));
  if (n.version !== ke.Testnet || n.chainId !== Th || r.authType !== R.Standard || s.hashMode !== 0 || c !== e.address || BigInt(s.fee) !== e.fee || BigInt(s.nonce) !== e.nonce || o.payloadType !== k.TokenTransfer || ms(o.recipient.address) !== Gi || BigInt(o.amount) !== BigInt(e.stx) * 1000000n || String(((f = o.memo) == null ? void 0 : f.content) ?? "").replace(/\0+$/, "") !== vh) throw new Error("The casino wallet signed something other than the buy that was asked for. Nothing was sent.");
  return n.verifyOrigin(), "0x" + n.txid();
}
const Fe = window, Te = typeof Fe.ParallaxCasinoWalletOrigin == "string" ? Fe.ParallaxCasinoWalletOrigin : "https://casino-wallet.xtrata.xyz", Wi = typeof Fe.ParallaxCasinoTestnetApi == "string" ? Fe.ParallaxCasinoTestnetApi : "https://api.testnet.hiro.so", Ph = 30 * 6e4, Oh = 15e3, Qt = (t) => Object.assign(new Error(t), { code: "NOT_SENT" });
let De = null, Ct = null, _e = null;
function kh(t) {
  De = t;
}
function Ki() {
  if (Ct) return Promise.resolve(Ct);
  if (_e) return _e;
  if (!De) return Promise.reject(new Error("The casino wallet has nowhere to appear. Reload the page."));
  const t = De;
  return _e = new Promise((e, n) => {
    const r = document.createElement("iframe");
    r.title = "Xtrata casino wallet (testnet)", r.className = "lx-wallet-frame", r.setAttribute("allow", `publickey-credentials-get ${Te}; publickey-credentials-create ${Te}`), r.referrerPolicy = "no-referrer";
    const s = setTimeout(() => {
      _e = null, n(new Error("The casino wallet did not load. Check your connection and try again."));
    }, 15e3);
    r.addEventListener("load", () => {
      clearTimeout(s), Ct = new pc({ walletOrigin: Te, frame: r, timeoutMs: Ph }), e(Ct);
    }, { once: !0 }), r.src = Te + "/", t.replaceChildren(r);
  }), _e;
}
const Un = (t, e, n) => Promise.race([
  t.request(e, n),
  new Promise((r, s) => setTimeout(() => s(new Error("The casino wallet is not answering. Reload the page.")), Oh))
]), ur = (t) => {
  De && (De.hidden = !t);
};
async function $h() {
  return Un(await Ki(), "casino.status");
}
async function Nh(t, e = !1) {
  const n = await Ki();
  ur(!0);
  try {
    return await n.request("casino.open", { mode: t, anyPasskey: e });
  } finally {
    ur(!1);
  }
}
async function zh() {
  if (Ct)
    try {
      await Un(Ct, "casino.cancel");
    } catch {
    }
  ur(!1);
}
async function Mh() {
  if (Ct)
    try {
      await Un(Ct, "casino.lock");
    } catch {
    }
}
async function ji(t, e) {
  const n = await fetch(Wi + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) }), r = await n.json().catch(() => null);
  return { status: n.status, ok: n.ok, body: r };
}
async function Vh(t) {
  var r;
  const e = await ji(`/extended/v1/address/${encodeURIComponent(t)}/nonces`), n = (r = e.body) == null ? void 0 : r.possible_next_nonce;
  if (!e.ok || !Number.isSafeInteger(n) || n < 0) throw Qt("Could not read this wallet from the testnet. Nothing was sent; try again.");
  return BigInt(n);
}
const Fh = (t) => Uint8Array.from(t.replace(/^0x/, "").match(/../g), (e) => parseInt(e, 16));
async function Dh(t, e) {
  let n = !1;
  for (let r = 0; r < 3; r++) {
    let s;
    try {
      s = await fetch(Wi + "/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: Fh(t), signal: AbortSignal.timeout(15e3) });
    } catch {
      n = !0, await new Promise((c) => setTimeout(c, 1500 * (r + 1)));
      continue;
    }
    const o = await s.json().catch(() => null);
    if (s.ok && typeof o == "string" && o.replace(/^0x/, "") === e.replace(/^0x/, "")) return { txid: e };
    if (s.status >= 500) {
      n = !0, await new Promise((c) => setTimeout(c, 1500 * (r + 1)));
      continue;
    }
    if (!n) throw Qt(`The testnet refused the transfer (${(o == null ? void 0 : o.reason) || s.status}). Nothing was sent.`);
    break;
  }
  return { txid: e, uncertain: !0 };
}
async function Gh(t) {
  if (!Ct) throw Qt("Open your casino wallet first.");
  if (t.address === Gi) throw Qt("The exchange cannot pay itself.");
  const e = await Vh(t.address);
  let n;
  try {
    n = await Un(Ct, "casino.signBuy", { stx: t.stx, fee: hr.toString(), nonce: e.toString() });
  } catch (s) {
    throw Qt(s.message || "The casino wallet did not sign. Nothing was sent.");
  }
  let r;
  try {
    r = Lh(n.raw, { address: t.address, stx: t.stx, fee: hr, nonce: e });
  } catch (s) {
    throw Qt(s.message);
  }
  if (r !== n.txid) throw Qt("The casino wallet reported a different transaction. Nothing was sent.");
  return Dh(n.raw, r);
}
async function Wh(t) {
  var n, r, s;
  let e;
  try {
    e = await ji(`/extended/v1/faucets/stx?address=${encodeURIComponent(t)}`, { method: "POST" });
  } catch {
    throw new Error("The testnet faucet did not answer. Try again in a minute.");
  }
  if (e.status === 429) throw new Error("The testnet faucet is busy (one request a minute). Try again in a minute.");
  if (!e.ok || ((n = e.body) == null ? void 0 : n.success) !== !0 || typeof ((r = e.body) == null ? void 0 : r.txId) != "string")
    throw new Error(`The testnet faucet could not send STX right now (${((s = e.body) == null ? void 0 : s.error) || e.status}). Try again shortly.`);
  return e.body.txId;
}
Fe.ParallaxPasskeyWallet = Object.freeze({
  version: "1.0.0",
  origin: Te,
  /** Network fee for one buy, in microSTX (add it to the amount when checking the balance). */
  fee: Number(hr),
  attach: kh,
  status: $h,
  open: Nh,
  cancel: zh,
  lock: Mh,
  buy: Gh,
  faucet: Wh
});
try {
  window.dispatchEvent(new Event("parallax-passkey-wallet"));
} catch {
}
