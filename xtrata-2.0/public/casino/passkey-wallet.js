var hc = Object.defineProperty;
var lc = (t, e, n) => e in t ? hc(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var ye = (t, e, n) => lc(t, typeof e != "symbol" ? e + "" : e, n);
const _s = "xtrata.wallet.bridge.v1", dc = (t) => typeof t == "object" && t !== null && t.protocol === _s, gc = (t) => dc(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", pc = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class we extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const Rr = 12e4;
class yc {
  constructor(e) {
    ye(this, "pending", /* @__PURE__ */ new Map());
    ye(this, "listenTarget");
    ye(this, "closed", !1);
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
    ye(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !gc(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new we("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new we("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new we("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = pc(), i = { protocol: _s, kind: "request", id: s, method: e, params: n };
    return new Promise((c, a) => {
      const u = setTimeout(() => {
        this.pending.delete(s), a(
          new we(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? Rr}ms.`
          )
        );
      }, this.options.timeoutMs ?? Rr);
      this.pending.set(s, { resolve: c, reject: a, timer: u }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new we("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
function _t(t, e, n) {
  return sr(q(t, e), n);
}
function q(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = z(r);
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
      const r = mc(BigInt(`0x${H(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${H(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Xr(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Oe(t, e = 8) {
  return (typeof t == "bigint" ? t : q(t, !1)).toString(16).padStart(e * 2, "0");
}
function yn(t) {
  return parseInt(t, 16);
}
function sr(t, e = 16) {
  const n = Oe(t, e);
  return z(n);
}
function wc(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function bc(t, e) {
  return t & BigInt(1) << e;
}
function mc(t, e) {
  return bc(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const xc = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function H(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += xc[n];
  return e;
}
function z(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t;
  const e = t.length % 2 ? `0${t}` : t, n = new Uint8Array(e.length / 2);
  for (let r = 0; r < n.length; r++) {
    const s = r * 2, i = e.slice(s, s + 2), c = Number.parseInt(i, 16);
    if (Number.isNaN(c) || c < 0)
      throw new Error("Invalid byte sequence");
    n[r] = c;
  }
  return n;
}
function Le(t) {
  return new TextEncoder().encode(t);
}
function ir(t) {
  return new TextDecoder().decode(t);
}
function Sc(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Ec(t) {
  return String.fromCharCode.apply(null, t);
}
function Ac(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Yr(t) {
  if (t.some(Ac))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function ke(...t) {
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
function V(t) {
  return ke(...t.map((e) => typeof e == "number" ? Yr([e]) : e instanceof Array ? Yr(e) : e));
}
var Qr;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Qr || (Qr = {}));
var Jr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Jr || (Jr = {}));
var ts;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ts || (ts = {}));
const Ps = 33, On = 32;
function Bc(t) {
  if (t.length < On * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + On * 2), r = t.slice(2 + On * 2);
  return {
    recoveryId: yn(e),
    r: n,
    s: r
  };
}
function Cc(t) {
  return t.slice(-2) + t.slice(0, -2);
}
function Ic(t) {
  const e = typeof t == "string" ? z(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Tc(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function vc(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function Uc(t, e) {
  return t[e];
}
function Hc(t, e, n = 0) {
  return t[n] = e, t;
}
function _c(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Kt(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var zn;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(zn || (zn = {}));
const Pc = zn.Mainnet, Oc = 128, Lc = 128, Os = 16, Dt = 32, Mn = 80, wn = 65, kc = 32, $c = 64, cn = 34;
var E;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(E || (E = {}));
var v;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(v || (v = {}));
var Fn;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Fn || (Fn = {}));
var Y;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Y || (Y = {}));
const rn = ["onChainOnly", "offChainOnly", "any"], es = {
  [rn[0]]: Y.OnChainOnly,
  [rn[1]]: Y.OffChainOnly,
  [rn[2]]: Y.Any,
  [Y.OnChainOnly]: Y.OnChainOnly,
  [Y.OffChainOnly]: Y.OffChainOnly,
  [Y.Any]: Y.Any
};
function Nc(t) {
  if (t in es)
    return es[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${rn.join(", ")}`);
}
var rt;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(rt || (rt = {}));
rt.Mainnet;
var an;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(an || (an = {}));
var Q;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Q || (Q = {}));
var D;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(D || (D = {}));
var P;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(P || (P = {}));
var Tt;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Tt || (Tt = {}));
var F;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(F || (F = {}));
var un;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(un || (un = {}));
var Dn;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Dn || (Dn = {}));
var Ie;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ie || (Ie = {}));
var ns;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(ns || (ns = {}));
var rs;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(rs || (rs = {}));
function Vn(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function zc(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Ls(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Mc(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Vn(t.outputLen), Vn(t.blockLen);
}
function Fc(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Dc(t, e) {
  Ls(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Mt = {
  number: Vn,
  bool: zc,
  bytes: Ls,
  hash: Mc,
  exists: Fc,
  output: Dc
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ln = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), at = (t, e) => t << 32 - e | t >>> e, Vc = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Vc)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Kc(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function or(t) {
  if (typeof t == "string" && (t = Kc(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let ks = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Gt(t) {
  const e = (r) => t().update(or(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Wc(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), c = Number(n >> s & i), a = Number(n & i), u = r ? 4 : 0, d = r ? 0 : 4;
  t.setUint32(e + u, c, r), t.setUint32(e + d, a, r);
}
class cr extends ks {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ln(this.buffer);
  }
  update(e) {
    Mt.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = or(e);
    const i = e.length;
    for (let c = 0; c < i; ) {
      const a = Math.min(s - this.pos, i - c);
      if (a === s) {
        const u = Ln(e);
        for (; s <= i - c; c += s)
          this.process(u, c);
        continue;
      }
      r.set(e.subarray(c, c + a), this.pos), this.pos += a, c += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Mt.exists(this), Mt.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: c } = this;
    n[c++] = 128, this.buffer.subarray(c).fill(0), this.padOffset > s - c && (this.process(r, 0), c = 0);
    for (let h = c; h < s; h++)
      n[h] = 0;
    Wc(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Ln(e), u = this.outputLen;
    if (u % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = u / 4, g = this.get();
    if (d > g.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < d; h++)
      a.setUint32(4 * h, g[h], i);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: c, pos: a } = this;
    return e.length = s, e.pos = a, e.finished = i, e.destroyed = c, s % n && e.buffer.set(r), e;
  }
}
const jc = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), $s = Uint8Array.from({ length: 16 }, (t, e) => e), Gc = $s.map((t) => (9 * t + 5) % 16);
let ar = [$s], ur = [Gc];
for (let t = 0; t < 4; t++)
  for (let e of [ar, ur])
    e.push(e[t].map((n) => jc[n]));
const Ns = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), qc = ar.map((t, e) => t.map((n) => Ns[e][n])), Zc = ur.map((t, e) => t.map((n) => Ns[e][n])), Rc = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Xc = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ze = (t, e) => t << e | t >>> 32 - e;
function ss(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Re = new Uint32Array(16);
let Yc = class extends cr {
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
    for (let l = 0; l < 16; l++, n += 4)
      Re[l] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, c = i, a = this.h2 | 0, u = a, d = this.h3 | 0, g = d, h = this.h4 | 0, y = h;
    for (let l = 0; l < 5; l++) {
      const w = 4 - l, b = Rc[l], A = Xc[l], U = ar[l], _ = ur[l], S = qc[l], I = Zc[l];
      for (let C = 0; C < 16; C++) {
        const k = Ze(r + ss(l, i, a, d) + Re[U[C]] + b, S[C]) + h | 0;
        r = h, h = d, d = Ze(a, 10) | 0, a = i, i = k;
      }
      for (let C = 0; C < 16; C++) {
        const k = Ze(s + ss(w, c, u, g) + Re[_[C]] + A, I[C]) + y | 0;
        s = y, y = g, g = Ze(u, 10) | 0, u = c, c = k;
      }
    }
    this.set(this.h1 + a + g | 0, this.h2 + d + y | 0, this.h3 + h + s | 0, this.h4 + r + c | 0, this.h0 + i + u | 0);
  }
  roundClean() {
    Re.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Qc = Gt(() => new Yc()), Jc = (t, e, n) => t & e ^ ~t & n, ta = (t, e, n) => t & e ^ t & n ^ e & n, ea = new Uint32Array([
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
]), mt = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), xt = new Uint32Array(64);
let zs = class extends cr {
  constructor() {
    super(64, 32, 8, !1), this.A = mt[0] | 0, this.B = mt[1] | 0, this.C = mt[2] | 0, this.D = mt[3] | 0, this.E = mt[4] | 0, this.F = mt[5] | 0, this.G = mt[6] | 0, this.H = mt[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: c, G: a, H: u } = this;
    return [e, n, r, s, i, c, a, u];
  }
  // prettier-ignore
  set(e, n, r, s, i, c, a, u) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = c | 0, this.G = a | 0, this.H = u | 0;
  }
  process(e, n) {
    for (let h = 0; h < 16; h++, n += 4)
      xt[h] = e.getUint32(n, !1);
    for (let h = 16; h < 64; h++) {
      const y = xt[h - 15], l = xt[h - 2], w = at(y, 7) ^ at(y, 18) ^ y >>> 3, b = at(l, 17) ^ at(l, 19) ^ l >>> 10;
      xt[h] = b + xt[h - 7] + w + xt[h - 16] | 0;
    }
    let { A: r, B: s, C: i, D: c, E: a, F: u, G: d, H: g } = this;
    for (let h = 0; h < 64; h++) {
      const y = at(a, 6) ^ at(a, 11) ^ at(a, 25), l = g + y + Jc(a, u, d) + ea[h] + xt[h] | 0, b = (at(r, 2) ^ at(r, 13) ^ at(r, 22)) + ta(r, s, i) | 0;
      g = d, d = u, u = a, a = c + l | 0, c = i, i = s, s = r, r = l + b | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, c = c + this.D | 0, a = a + this.E | 0, u = u + this.F | 0, d = d + this.G | 0, g = g + this.H | 0, this.set(r, s, i, c, a, u, d, g);
  }
  roundClean() {
    xt.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, na = class extends zs {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const bn = Gt(() => new zs());
Gt(() => new na());
const Xe = BigInt(2 ** 32 - 1), Kn = BigInt(32);
function Ms(t, e = !1) {
  return e ? { h: Number(t & Xe), l: Number(t >> Kn & Xe) } : { h: Number(t >> Kn & Xe) | 0, l: Number(t & Xe) | 0 };
}
function ra(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: c } = Ms(t[s], e);
    [n[s], r[s]] = [i, c];
  }
  return [n, r];
}
const sa = (t, e) => BigInt(t >>> 0) << Kn | BigInt(e >>> 0), ia = (t, e, n) => t >>> n, oa = (t, e, n) => t << 32 - n | e >>> n, ca = (t, e, n) => t >>> n | e << 32 - n, aa = (t, e, n) => t << 32 - n | e >>> n, ua = (t, e, n) => t << 64 - n | e >>> n - 32, fa = (t, e, n) => t >>> n - 32 | e << 64 - n, ha = (t, e) => e, la = (t, e) => t, da = (t, e, n) => t << n | e >>> 32 - n, ga = (t, e, n) => e << n | t >>> 32 - n, pa = (t, e, n) => e << n - 32 | t >>> 64 - n, ya = (t, e, n) => t << n - 32 | e >>> 64 - n;
function wa(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const ba = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), ma = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, xa = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Sa = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Ea = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Aa = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, T = {
  fromBig: Ms,
  split: ra,
  toBig: sa,
  shrSH: ia,
  shrSL: oa,
  rotrSH: ca,
  rotrSL: aa,
  rotrBH: ua,
  rotrBL: fa,
  rotr32H: ha,
  rotr32L: la,
  rotlSH: da,
  rotlSL: ga,
  rotlBH: pa,
  rotlBL: ya,
  add: wa,
  add3L: ba,
  add3H: ma,
  add4L: xa,
  add4H: Sa,
  add5H: Aa,
  add5L: Ea
}, [Ba, Ca] = T.split([
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
].map((t) => BigInt(t))), St = new Uint32Array(80), Et = new Uint32Array(80);
class mn extends cr {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: c, Dh: a, Dl: u, Eh: d, El: g, Fh: h, Fl: y, Gh: l, Gl: w, Hh: b, Hl: A } = this;
    return [e, n, r, s, i, c, a, u, d, g, h, y, l, w, b, A];
  }
  // prettier-ignore
  set(e, n, r, s, i, c, a, u, d, g, h, y, l, w, b, A) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = c | 0, this.Dh = a | 0, this.Dl = u | 0, this.Eh = d | 0, this.El = g | 0, this.Fh = h | 0, this.Fl = y | 0, this.Gh = l | 0, this.Gl = w | 0, this.Hh = b | 0, this.Hl = A | 0;
  }
  process(e, n) {
    for (let S = 0; S < 16; S++, n += 4)
      St[S] = e.getUint32(n), Et[S] = e.getUint32(n += 4);
    for (let S = 16; S < 80; S++) {
      const I = St[S - 15] | 0, C = Et[S - 15] | 0, k = T.rotrSH(I, C, 1) ^ T.rotrSH(I, C, 8) ^ T.shrSH(I, C, 7), W = T.rotrSL(I, C, 1) ^ T.rotrSL(I, C, 8) ^ T.shrSL(I, C, 7), j = St[S - 2] | 0, Z = Et[S - 2] | 0, Pt = T.rotrSH(j, Z, 19) ^ T.rotrBH(j, Z, 61) ^ T.shrSH(j, Z, 6), Zt = T.rotrSL(j, Z, 19) ^ T.rotrBL(j, Z, 61) ^ T.shrSL(j, Z, 6), Ot = T.add4L(W, Zt, Et[S - 7], Et[S - 16]), Rt = T.add4H(Ot, k, Pt, St[S - 7], St[S - 16]);
      St[S] = Rt | 0, Et[S] = Ot | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: c, Ch: a, Cl: u, Dh: d, Dl: g, Eh: h, El: y, Fh: l, Fl: w, Gh: b, Gl: A, Hh: U, Hl: _ } = this;
    for (let S = 0; S < 80; S++) {
      const I = T.rotrSH(h, y, 14) ^ T.rotrSH(h, y, 18) ^ T.rotrBH(h, y, 41), C = T.rotrSL(h, y, 14) ^ T.rotrSL(h, y, 18) ^ T.rotrBL(h, y, 41), k = h & l ^ ~h & b, W = y & w ^ ~y & A, j = T.add5L(_, C, W, Ca[S], Et[S]), Z = T.add5H(j, U, I, k, Ba[S], St[S]), Pt = j | 0, Zt = T.rotrSH(r, s, 28) ^ T.rotrBH(r, s, 34) ^ T.rotrBH(r, s, 39), Ot = T.rotrSL(r, s, 28) ^ T.rotrBL(r, s, 34) ^ T.rotrBL(r, s, 39), Rt = r & i ^ r & a ^ i & a, De = s & c ^ s & u ^ c & u;
      U = b | 0, _ = A | 0, b = l | 0, A = w | 0, l = h | 0, w = y | 0, { h, l: y } = T.add(d | 0, g | 0, Z | 0, Pt | 0), d = a | 0, g = u | 0, a = i | 0, u = c | 0, i = r | 0, c = s | 0;
      const de = T.add3L(Pt, Ot, De);
      r = T.add3H(de, Z, Zt, Rt), s = de | 0;
    }
    ({ h: r, l: s } = T.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: c } = T.add(this.Bh | 0, this.Bl | 0, i | 0, c | 0), { h: a, l: u } = T.add(this.Ch | 0, this.Cl | 0, a | 0, u | 0), { h: d, l: g } = T.add(this.Dh | 0, this.Dl | 0, d | 0, g | 0), { h, l: y } = T.add(this.Eh | 0, this.El | 0, h | 0, y | 0), { h: l, l: w } = T.add(this.Fh | 0, this.Fl | 0, l | 0, w | 0), { h: b, l: A } = T.add(this.Gh | 0, this.Gl | 0, b | 0, A | 0), { h: U, l: _ } = T.add(this.Hh | 0, this.Hl | 0, U | 0, _ | 0), this.set(r, s, i, c, a, u, d, g, h, y, l, w, b, A, U, _);
  }
  roundClean() {
    St.fill(0), Et.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class Ia extends mn {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class Ta extends mn {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class va extends mn {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Gt(() => new mn());
Gt(() => new Ia());
const Ua = Gt(() => new Ta());
Gt(() => new va());
const Ha = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const O = BigInt(0), M = BigInt(1), vt = BigInt(2), Ee = BigInt(3), is = BigInt(8), K = Object.freeze({
  a: O,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: M,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), os = (t, e) => (t + e / vt) / e, Ye = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = K, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -M * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, c = BigInt("0x100000000000000000000000000000000"), a = os(i * t, e), u = os(-r * t, e);
    let d = m(t - a * n - u * s, e), g = m(-a * r - u * i, e);
    const h = d > c, y = g > c;
    if (h && (d = e - d), y && (g = e - g), d > c || g > c)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: h, k1: d, k2neg: y, k2: g };
  }
}, ct = 32, ie = 32, _a = 32, cs = ct + 1, as = 2 * ct + 1;
function us(t) {
  const { a: e, b: n } = K, r = m(t * t), s = m(r * t);
  return m(s + e * t + n);
}
const Qe = K.a === O;
class Fs extends Error {
  constructor(e) {
    super(e);
  }
}
function fs(t) {
  if (!(t instanceof L))
    throw new TypeError("JacobianPoint expected");
}
class L {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof N))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(N.ZERO) ? L.ZERO : new L(e.x, e.y, M);
  }
  static toAffineBatch(e) {
    const n = $a(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return L.toAffineBatch(e).map(L.fromAffine);
  }
  equals(e) {
    fs(e);
    const { x: n, y: r, z: s } = this, { x: i, y: c, z: a } = e, u = m(s * s), d = m(a * a), g = m(n * d), h = m(i * u), y = m(m(r * a) * d), l = m(m(c * s) * u);
    return g === h && y === l;
  }
  negate() {
    return new L(this.x, m(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = m(e * e), i = m(n * n), c = m(i * i), a = e + i, u = m(vt * (m(a * a) - s - c)), d = m(Ee * s), g = m(d * d), h = m(g - vt * u), y = m(d * (u - h) - is * c), l = m(vt * n * r);
    return new L(h, y, l);
  }
  add(e) {
    fs(e);
    const { x: n, y: r, z: s } = this, { x: i, y: c, z: a } = e;
    if (i === O || c === O)
      return this;
    if (n === O || r === O)
      return e;
    const u = m(s * s), d = m(a * a), g = m(n * d), h = m(i * u), y = m(m(r * a) * d), l = m(m(c * s) * u), w = m(h - g), b = m(l - y);
    if (w === O)
      return b === O ? this.double() : L.ZERO;
    const A = m(w * w), U = m(w * A), _ = m(g * A), S = m(b * b - U - vt * _), I = m(b * (_ - S) - y * U), C = m(s * a * w);
    return new L(S, I, C);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = L.ZERO;
    if (typeof e == "bigint" && e === O)
      return n;
    let r = ds(e);
    if (r === M)
      return this;
    if (!Qe) {
      let h = n, y = this;
      for (; r > O; )
        r & M && (h = h.add(y)), y = y.double(), r >>= M;
      return h;
    }
    let { k1neg: s, k1: i, k2neg: c, k2: a } = Ye.splitScalar(r), u = n, d = n, g = this;
    for (; i > O || a > O; )
      i & M && (u = u.add(g)), a & M && (d = d.add(g)), g = g.double(), i >>= M, a >>= M;
    return s && (u = u.negate()), c && (d = d.negate()), d = new L(m(d.x * Ye.beta), d.y, d.z), u.add(d);
  }
  precomputeWindow(e) {
    const n = Qe ? 128 / e + 1 : 256 / e + 1, r = [];
    let s = this, i = s;
    for (let c = 0; c < n; c++) {
      i = s, r.push(i);
      for (let a = 1; a < 2 ** (e - 1); a++)
        i = i.add(s), r.push(i);
      s = i.double();
    }
    return r;
  }
  wNAF(e, n) {
    !n && this.equals(L.BASE) && (n = N.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Wn.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = L.normalizeZ(s), Wn.set(n, s)));
    let i = L.ZERO, c = L.BASE;
    const a = 1 + (Qe ? 128 / r : 256 / r), u = 2 ** (r - 1), d = BigInt(2 ** r - 1), g = 2 ** r, h = BigInt(r);
    for (let y = 0; y < a; y++) {
      const l = y * u;
      let w = Number(e & d);
      e >>= h, w > u && (w -= g, e += M);
      const b = l, A = l + Math.abs(w) - 1, U = y % 2 !== 0, _ = w < 0;
      w === 0 ? c = c.add(Je(U, s[b])) : i = i.add(Je(_, s[A]));
    }
    return { p: i, f: c };
  }
  multiply(e, n) {
    let r = ds(e), s, i;
    if (Qe) {
      const { k1neg: c, k1: a, k2neg: u, k2: d } = Ye.splitScalar(r);
      let { p: g, f: h } = this.wNAF(a, n), { p: y, f: l } = this.wNAF(d, n);
      g = Je(c, g), y = Je(u, y), y = new L(m(y.x * Ye.beta), y.y, y.z), s = g.add(y), i = h.add(l);
    } else {
      const { p: c, f: a } = this.wNAF(r, n);
      s = c, i = a;
    }
    return L.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(L.ZERO);
    e == null && (e = i ? is : $e(s));
    const c = e, a = m(c * c), u = m(a * c), d = m(n * a), g = m(r * u), h = m(s * c);
    if (i)
      return N.ZERO;
    if (h !== M)
      throw new Error("invZ was invalid");
    return new N(d, g);
  }
}
L.BASE = new L(K.Gx, K.Gy, M);
L.ZERO = new L(O, M, O);
function Je(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Wn = /* @__PURE__ */ new WeakMap();
class N {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Wn.delete(this);
  }
  hasEvenY() {
    return this.y % vt === O;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = Ht(n ? e : e.subarray(1));
    if (!kn(r))
      throw new Error("Point is not on curve");
    const s = us(r);
    let i = ka(s);
    const c = (i & M) === M;
    n ? c && (i = m(-i)) : (e[0] & 1) === 1 !== c && (i = m(-i));
    const a = new N(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = Ht(e.subarray(1, ct + 1)), r = Ht(e.subarray(ct + 1, ct * 2 + 1)), s = new N(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Te(e), r = n.length, s = n[0];
    if (r === ct)
      return this.fromCompressedHex(n);
    if (r === cs && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === as && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${cs} compressed bytes or ${as} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return N.BASE.multiply(hn(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = Fa(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const c = Ds(Te(e)), { n: a } = K, u = r === 2 || r === 3 ? s + a : s, d = $e(u, a), g = m(-c * d, a), h = m(i * d, a), y = r & 1 ? "03" : "02", l = N.fromHex(y + re(u)), w = N.BASE.multiplyAndAddUnsafe(l, g, h);
    if (!w)
      throw new Error("Cannot recover signature: point at infinify");
    return w.assertValidity(), w;
  }
  toRawBytes(e = !1) {
    return Vt(this.toHex(e));
  }
  toHex(e = !1) {
    const n = re(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${re(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!kn(n) || !kn(r))
      throw new Error(e);
    const s = m(r * r), i = us(n);
    if (m(s - i) !== O)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new N(this.x, m(-this.y));
  }
  double() {
    return L.fromAffine(this).double().toAffine();
  }
  add(e) {
    return L.fromAffine(this).add(L.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return L.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = L.fromAffine(this), i = n === O || n === M || this !== N.BASE ? s.multiplyUnsafe(n) : s.multiply(n), c = L.fromAffine(e).multiplyUnsafe(r), a = i.add(c);
    return a.equals(L.ZERO) ? void 0 : a.toAffine();
  }
}
N.BASE = new N(K.Gx, K.Gy);
N.ZERO = new N(O, O);
function hs(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function ls(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${oe(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Ht(n), left: t.subarray(e + 2) };
}
function Pa(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${oe(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = ls(t.subarray(2)), { data: r, left: s } = ls(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${oe(s)}`);
  return { r: e, s: r };
}
class ht {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? oe(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new ht(fn(s.slice(0, 64)), fn(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Pa(n ? e : Vt(e));
    return new ht(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!ve(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!ve(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = K.n >> M;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new ht(this.r, m(-this.s, K.n)) : this;
  }
  toDERRawBytes() {
    return Vt(this.toDERHex());
  }
  toDERHex() {
    const e = hs(be(this.s)), n = hs(be(this.r)), r = e.length / 2, s = n.length / 2, i = be(r), c = be(s);
    return `30${be(s + r + 4)}02${c}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Vt(this.toCompactHex());
  }
  toCompactHex() {
    return re(this.r) + re(this.s);
  }
}
function It(...t) {
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
const Oa = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function oe(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Oa[t[n]];
  return e;
}
const La = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function re(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(O <= t && t < La))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function jn(t) {
  const e = Vt(re(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function be(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function fn(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function Vt(t) {
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
function Ht(t) {
  return fn(oe(t));
}
function Te(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Vt(t);
}
function ds(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && ve(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function m(t, e = K.P) {
  const n = t % e;
  return n >= O ? n : e + n;
}
function et(t, e) {
  const { P: n } = K;
  let r = t;
  for (; e-- > O; )
    r *= r, r %= n;
  return r;
}
function ka(t) {
  const { P: e } = K, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), c = BigInt(44), a = BigInt(88), u = t * t * t % e, d = u * u * t % e, g = et(d, Ee) * d % e, h = et(g, Ee) * d % e, y = et(h, vt) * u % e, l = et(y, r) * y % e, w = et(l, s) * l % e, b = et(w, c) * w % e, A = et(b, a) * b % e, U = et(A, c) * w % e, _ = et(U, Ee) * d % e, S = et(_, i) * l % e, I = et(S, n) * u % e, C = et(I, vt);
  if (C * C % e !== t)
    throw new Error("Cannot find square root");
  return C;
}
function $e(t, e = K.P) {
  if (t === O || e <= O)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = m(t, e), r = e, s = O, i = M;
  for (; n !== O; ) {
    const a = r / n, u = r % n, d = s - i * a;
    r = n, n = u, s = i, i = d;
  }
  if (r !== M)
    throw new Error("invert: does not exist");
  return m(s, e);
}
function $a(t, e = K.P) {
  const n = new Array(t.length), r = t.reduce((i, c, a) => c === O ? i : (n[a] = i, m(i * c, e)), M), s = $e(r, e);
  return t.reduceRight((i, c, a) => c === O ? i : (n[a] = m(i * n[a], e), m(i * c, e)), s), n;
}
function Na(t) {
  const e = t.length * 8 - ie * 8, n = Ht(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Ds(t, e = !1) {
  const n = Na(t);
  if (e)
    return n;
  const { n: r } = K;
  return n >= r ? n - r : n;
}
let se, Ae;
class za {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return Ut.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return Ae(this.k, ...e);
  }
  checkSync() {
    if (typeof Ae != "function")
      throw new Fs("hmacSha256Sync needs to be set");
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
    return It(...n);
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
    return It(...n);
  }
}
function ve(t) {
  return O < t && t < K.n;
}
function kn(t) {
  return O < t && t < K.P;
}
function Ma(t, e, n, r = !0) {
  const { n: s } = K, i = Ds(t, !0);
  if (!ve(i))
    return;
  const c = $e(i, s), a = N.BASE.multiply(i), u = m(a.x, s);
  if (u === O)
    return;
  const d = m(c * m(e + n * u, s), s);
  if (d === O)
    return;
  let g = new ht(u, d), h = (a.x === g.r ? 0 : 2) | Number(a.y & M);
  return r && g.hasHighS() && (g = g.normalizeS(), h ^= 1), { sig: g, recovery: h };
}
function hn(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * ie)
      throw new Error("Expected 32 bytes of private key");
    e = fn(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== ie)
      throw new Error("Expected 32 bytes of private key");
    e = Ht(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!ve(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Fa(t) {
  if (t instanceof ht)
    return t.assertValidity(), t;
  try {
    return ht.fromDER(t);
  } catch {
    return ht.fromCompact(t);
  }
}
function Da(t, e = !1) {
  return N.fromPrivateKey(t).toRawBytes(e);
}
function Vs(t) {
  const e = t.length > ct ? t.slice(0, ct) : t;
  return Ht(e);
}
function Va(t) {
  const e = Vs(t), n = m(e, K.n);
  return Ks(n < O ? e : n);
}
function Ks(t) {
  return jn(t);
}
function Ka(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Te(t), s = hn(e), i = [Ks(s), Va(r)];
  if (n != null) {
    n === !0 && (n = Ut.randomBytes(ct));
    const u = Te(n);
    if (u.length !== ct)
      throw new Error(`sign: Expected ${ct} bytes of extra data`);
    i.push(u);
  }
  const c = It(...i), a = Vs(r);
  return { seed: c, m: a, d: s };
}
function Wa(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), c = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [c, r] : c;
}
function ja(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Ka(t, e, n.extraEntropy), c = new za(_a, ie);
  c.reseedSync(r);
  let a;
  for (; !(a = Ma(c.generateSync(), s, i, n.canonical)); )
    c.reseedSync();
  return Wa(a, n);
}
N.BASE._setWindowSize(8);
const J = {
  node: Ha,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, tn = {}, Ut = {
  bytesToHex: oe,
  hexToBytes: Vt,
  concatBytes: It,
  mod: m,
  invert: $e,
  isValidPrivateKey(t) {
    try {
      return hn(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: jn,
  _normalizePrivateKey: hn,
  hashToPrivateKey: (t) => {
    t = Te(t);
    const e = ie + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = m(Ht(t), K.n - M) + M;
    return jn(n);
  },
  randomBytes: (t = 32) => {
    if (J.web)
      return J.web.getRandomValues(new Uint8Array(t));
    if (J.node) {
      const { randomBytes: e } = J.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Ut.hashToPrivateKey(Ut.randomBytes(ie + 8)),
  precompute(t = 8, e = N.BASE) {
    const n = e === N.BASE ? e : new N(e.x, e.y);
    return n._setWindowSize(t), n.multiply(Ee), n;
  },
  sha256: async (...t) => {
    if (J.web) {
      const e = await J.web.subtle.digest("SHA-256", It(...t));
      return new Uint8Array(e);
    } else if (J.node) {
      const { createHash: e } = J.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (J.web) {
      const n = await J.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = It(...e), s = await J.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (J.node) {
      const { createHmac: n } = J.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = tn[t];
    if (n === void 0) {
      const r = await Ut.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = It(r, r), tn[t] = n;
    }
    return Ut.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof se != "function")
      throw new Fs("sha256Sync is undefined, you need to set it");
    let n = tn[t];
    if (n === void 0) {
      const r = se(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = It(r, r), tn[t] = n;
    }
    return se(n, ...e);
  },
  _JacobianPoint: L
};
Object.defineProperties(Ut, {
  sha256Sync: {
    configurable: !1,
    get() {
      return se;
    },
    set(t) {
      se || (se = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Ae;
    },
    set(t) {
      Ae || (Ae = t);
    }
  }
});
var en = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ga(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Ws(t) {
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
var fr = {}, hr = {};
const te = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function js(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Gn(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function qt(t, ...e) {
  if (!js(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function qa(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Gn(t.outputLen), Gn(t.blockLen);
}
function qn(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Gs(t, e) {
  qt(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function Za(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function Ra(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function ce(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function sn(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function it(t, e) {
  return t << 32 - e | t >>> e;
}
function xe(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const lr = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function dr(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const qs = lr ? (t) => t : (t) => dr(t), Xa = qs;
function Zs(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = dr(t[e]);
  return t;
}
const Ya = lr ? (t) => t : Zs, Rs = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", Qa = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Zn(t) {
  if (qt(t), Rs)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Qa[t[n]];
  return e;
}
const yt = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function gs(t) {
  if (t >= yt._0 && t <= yt._9)
    return t - yt._0;
  if (t >= yt.A && t <= yt.F)
    return t - (yt.A - 10);
  if (t >= yt.a && t <= yt.f)
    return t - (yt.a - 10);
}
function Xs(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (Rs)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const c = gs(t.charCodeAt(i)), a = gs(t.charCodeAt(i + 1));
    if (c === void 0 || a === void 0) {
      const u = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + u + '" at index ' + i);
    }
    r[s] = c * 16 + a;
  }
  return r;
}
const Ys = async () => {
};
async function Ja(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await Ys(), r += i);
  }
}
function gr(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function tu(t) {
  return new TextDecoder().decode(t);
}
function Ne(t) {
  return typeof t == "string" && (t = gr(t)), qt(t), t;
}
function eu(t) {
  return typeof t == "string" && (t = gr(t)), qt(t), t;
}
function nu(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    qt(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function ru(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
class Qs {
}
function ze(t) {
  const e = (r) => t().update(Ne(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Js(t) {
  const e = (r, s) => t(s).update(Ne(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function ti(t) {
  const e = (r, s) => t(s).update(Ne(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const su = ze, iu = Js, ou = ti;
function cu(t = 32) {
  if (te && typeof te.getRandomValues == "function")
    return te.getRandomValues(new Uint8Array(t));
  if (te && typeof te.randomBytes == "function")
    return Uint8Array.from(te.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const au = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Qs,
  abytes: qt,
  aexists: qn,
  ahash: qa,
  anumber: Gn,
  aoutput: Gs,
  asyncLoop: Ja,
  byteSwap: dr,
  byteSwap32: Zs,
  byteSwapIfBE: Xa,
  bytesToHex: Zn,
  bytesToUtf8: tu,
  checkOpts: ru,
  clean: ce,
  concatBytes: nu,
  createHasher: ze,
  createOptHasher: Js,
  createView: sn,
  createXOFer: ti,
  hexToBytes: Xs,
  isBytes: js,
  isLE: lr,
  kdfInputToBytes: eu,
  nextTick: Ys,
  randomBytes: cu,
  rotl: xe,
  rotr: it,
  swap32IfBE: Ya,
  swap8IfBE: qs,
  toBytes: Ne,
  u32: Ra,
  u8: Za,
  utf8ToBytes: gr,
  wrapConstructor: su,
  wrapConstructorWithOpts: iu,
  wrapXOFConstructorWithOpts: ou
}, Symbol.toStringTag, { value: "Module" })), xn = /* @__PURE__ */ Ws(au);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = xn;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(c, a) {
    if (!c.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    c.length % 2 !== 0 && (c = `0${c}`), c = c.toLowerCase();
    let u = [], d = 0;
    for (let l = c.length - 1; l >= 0; l--)
      if (d < 4) {
        const w = n.indexOf(c[l]) >> d;
        let b = 0;
        l !== 0 && (b = n.indexOf(c[l - 1]));
        const A = 1 + d, U = b % (1 << A) << 5 - A, _ = t.c32[w + U];
        d = A, u.unshift(_);
      } else
        d = 0;
    let g = 0;
    for (let l = 0; l < u.length && u[l] === "0"; l++)
      g++;
    u = u.slice(g);
    const h = new TextDecoder().decode((0, e.hexToBytes)(c)).match(/^\u0000*/), y = h ? h[0].length : 0;
    for (let l = 0; l < y; l++)
      u.unshift(t.c32[0]);
    if (a) {
      const l = a - u.length;
      for (let w = 0; w < l; w++)
        u.unshift(t.c32[0]);
    }
    return u.join("");
  }
  t.c32encode = r;
  function s(c) {
    return c.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  t.c32normalize = s;
  function i(c, a) {
    if (c = s(c), !c.match(`^[${t.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const u = c.match(`^${t.c32[0]}*`), d = u ? u[0].length : 0;
    let g = [], h = 0, y = 0;
    for (let b = c.length - 1; b >= 0; b--) {
      y === 4 && (g.unshift(n[h]), y = 0, h = 0);
      const U = (t.c32.indexOf(c[b]) << y) + h, _ = n[U % 16];
      if (y += 1, h = U >> 4, h > 1 << y)
        throw new Error("Panic error in decoding.");
      g.unshift(_);
    }
    g.unshift(n[h]), g.length % 2 === 1 && g.unshift("0");
    let l = 0;
    for (let b = 0; b < g.length && g[b] === "0"; b++)
      l++;
    g = g.slice(l - l % 2);
    let w = g.join("");
    for (let b = 0; b < d; b++)
      w = `00${w}`;
    if (a) {
      const b = a * 2 - w.length;
      for (let A = 0; A < b; A += 2)
        w = `00${w}`;
    }
    return w;
  }
  t.c32decode = i;
})(hr);
var Wt = {};
function uu(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), c = Number(n >> s & i), a = Number(n & i), u = r ? 4 : 0, d = r ? 0 : 4;
  t.setUint32(e + u, c, r), t.setUint32(e + d, a, r);
}
function fu(t, e, n) {
  return t & e ^ ~t & n;
}
function hu(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class ei extends Qs {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = sn(this.buffer);
  }
  update(e) {
    qn(this), e = Ne(e), qt(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let c = 0; c < i; ) {
      const a = Math.min(s - this.pos, i - c);
      if (a === s) {
        const u = sn(e);
        for (; s <= i - c; c += s)
          this.process(u, c);
        continue;
      }
      r.set(e.subarray(c, c + a), this.pos), this.pos += a, c += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    qn(this), Gs(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: c } = this;
    n[c++] = 128, ce(this.buffer.subarray(c)), this.padOffset > s - c && (this.process(r, 0), c = 0);
    for (let h = c; h < s; h++)
      n[h] = 0;
    uu(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = sn(e), u = this.outputLen;
    if (u % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = u / 4, g = this.get();
    if (d > g.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < d; h++)
      a.setUint32(4 * h, g[h], i);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: i, destroyed: c, pos: a } = this;
    return e.destroyed = c, e.finished = i, e.length = s, e.pos = a, s % n && e.buffer.set(r), e;
  }
  clone() {
    return this._cloneInto();
  }
}
const At = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Bt = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), lu = /* @__PURE__ */ Uint32Array.from([
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
]), Ct = /* @__PURE__ */ new Uint32Array(64);
let pr = class extends ei {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = At[0] | 0, this.B = At[1] | 0, this.C = At[2] | 0, this.D = At[3] | 0, this.E = At[4] | 0, this.F = At[5] | 0, this.G = At[6] | 0, this.H = At[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: i, F: c, G: a, H: u } = this;
    return [e, n, r, s, i, c, a, u];
  }
  // prettier-ignore
  set(e, n, r, s, i, c, a, u) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = i | 0, this.F = c | 0, this.G = a | 0, this.H = u | 0;
  }
  process(e, n) {
    for (let h = 0; h < 16; h++, n += 4)
      Ct[h] = e.getUint32(n, !1);
    for (let h = 16; h < 64; h++) {
      const y = Ct[h - 15], l = Ct[h - 2], w = it(y, 7) ^ it(y, 18) ^ y >>> 3, b = it(l, 17) ^ it(l, 19) ^ l >>> 10;
      Ct[h] = b + Ct[h - 7] + w + Ct[h - 16] | 0;
    }
    let { A: r, B: s, C: i, D: c, E: a, F: u, G: d, H: g } = this;
    for (let h = 0; h < 64; h++) {
      const y = it(a, 6) ^ it(a, 11) ^ it(a, 25), l = g + y + fu(a, u, d) + lu[h] + Ct[h] | 0, b = (it(r, 2) ^ it(r, 13) ^ it(r, 22)) + hu(r, s, i) | 0;
      g = d, d = u, u = a, a = c + l | 0, c = i, i = s, s = r, r = l + b | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, c = c + this.D | 0, a = a + this.E | 0, u = u + this.F | 0, d = d + this.G | 0, g = g + this.H | 0, this.set(r, s, i, c, a, u, d, g);
  }
  roundClean() {
    ce(Ct);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), ce(this.buffer);
  }
}, ni = class extends pr {
  constructor() {
    super(28), this.A = Bt[0] | 0, this.B = Bt[1] | 0, this.C = Bt[2] | 0, this.D = Bt[3] | 0, this.E = Bt[4] | 0, this.F = Bt[5] | 0, this.G = Bt[6] | 0, this.H = Bt[7] | 0;
  }
};
const du = /* @__PURE__ */ ze(() => new pr()), gu = /* @__PURE__ */ ze(() => new ni()), pu = pr, Rn = du, yu = ni, wu = gu, bu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: yu,
  SHA256: pu,
  sha224: wu,
  sha256: Rn
}, Symbol.toStringTag, { value: "Module" })), ri = /* @__PURE__ */ Ws(bu);
Object.defineProperty(Wt, "__esModule", { value: !0 });
Wt.c32checkDecode = Wt.c32checkEncode = void 0;
const ps = ri, ys = xn, Be = hr;
function si(t) {
  const e = (0, ps.sha256)((0, ps.sha256)((0, ys.hexToBytes)(t)));
  return (0, ys.bytesToHex)(e.slice(0, 4));
}
function mu(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = si(`${n}${e}`), s = (0, Be.c32encode)(`${e}${r}`);
  return `${Be.c32[t]}${s}`;
}
Wt.c32checkEncode = mu;
function xu(t) {
  t = (0, Be.c32normalize)(t);
  const e = (0, Be.c32decode)(t.slice(1)), n = t[0], r = Be.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), si(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Wt.c32checkDecode = xu;
var ii = {}, ae = {};
function Su(t) {
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
  var c = t.length, a = t.charAt(0), u = Math.log(c) / Math.log(256), d = Math.log(256) / Math.log(c);
  function g(l) {
    if (l instanceof Uint8Array || (ArrayBuffer.isView(l) ? l = new Uint8Array(l.buffer, l.byteOffset, l.byteLength) : Array.isArray(l) && (l = Uint8Array.from(l))), !(l instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (l.length === 0)
      return "";
    for (var w = 0, b = 0, A = 0, U = l.length; A !== U && l[A] === 0; )
      A++, w++;
    for (var _ = (U - A) * d + 1 >>> 0, S = new Uint8Array(_); A !== U; ) {
      for (var I = l[A], C = 0, k = _ - 1; (I !== 0 || C < b) && k !== -1; k--, C++)
        I += 256 * S[k] >>> 0, S[k] = I % c >>> 0, I = I / c >>> 0;
      if (I !== 0)
        throw new Error("Non-zero carry");
      b = C, A++;
    }
    for (var W = _ - b; W !== _ && S[W] === 0; )
      W++;
    for (var j = a.repeat(w); W < _; ++W)
      j += t.charAt(S[W]);
    return j;
  }
  function h(l) {
    if (typeof l != "string")
      throw new TypeError("Expected String");
    if (l.length === 0)
      return new Uint8Array();
    for (var w = 0, b = 0, A = 0; l[w] === a; )
      b++, w++;
    for (var U = (l.length - w) * u + 1 >>> 0, _ = new Uint8Array(U); l[w]; ) {
      var S = l.charCodeAt(w);
      if (S > 255)
        return;
      var I = e[S];
      if (I === 255)
        return;
      for (var C = 0, k = U - 1; (I !== 0 || C < A) && k !== -1; k--, C++)
        I += c * _[k] >>> 0, _[k] = I % 256 >>> 0, I = I / 256 >>> 0;
      if (I !== 0)
        throw new Error("Non-zero carry");
      A = C, w++;
    }
    for (var W = U - A; W !== U && _[W] === 0; )
      W++;
    for (var j = new Uint8Array(b + (U - W)), Z = b; W !== U; )
      j[Z++] = _[W++];
    return j;
  }
  function y(l) {
    var w = h(l);
    if (w)
      return w;
    throw new Error("Non-base" + c + " character");
  }
  return {
    encode: g,
    decodeUnsafe: h,
    decode: y
  };
}
var Eu = Su;
Object.defineProperty(ae, "__esModule", { value: !0 });
ae.decode = ae.encode = void 0;
const ln = ri, ws = xn, oi = Eu, ci = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function Au(t, e = "00") {
  const n = typeof t == "string" ? (0, ws.hexToBytes)(t) : t, r = typeof e == "string" ? (0, ws.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, ln.sha256)((0, ln.sha256)(new Uint8Array([...r, ...n])));
  return oi(ci).encode([...r, ...n, ...s.slice(0, 4)]);
}
ae.encode = Au;
function Bu(t) {
  const e = oi(ci).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, ln.sha256)((0, ln.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, c) => {
    if (i !== s[c])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
ae.decode = Bu;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Wt, n = ae, r = xn;
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
  function c(g, h) {
    if (!h.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, e.c32checkEncode)(g, h)}`;
  }
  t.c32address = c;
  function a(g) {
    if (g.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (g[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, e.c32checkDecode)(g.slice(1));
  }
  t.c32addressDecode = a;
  function u(g, h = -1) {
    const y = n.decode(g), l = (0, r.bytesToHex)(y.data), w = parseInt((0, r.bytesToHex)(y.prefix), 16);
    let b;
    return h < 0 ? (b = w, s[w] !== void 0 && (b = s[w])) : b = h, c(b, l);
  }
  t.b58ToC32 = u;
  function d(g, h = -1) {
    const y = a(g), l = y[0], w = y[1];
    let b;
    h < 0 ? (b = l, i[l] !== void 0 && (b = i[l])) : b = h;
    let A = b.toString(16);
    return A.length === 1 && (A = `0${A}`), n.encode(w, A);
  }
  t.c32ToB58 = d;
})(ii);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = hr;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Wt;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = ii;
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
})(fr);
var dn = { exports: {} };
dn.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", c = "[object Array]", a = "[object Boolean]", u = "[object Date]", d = "[object Error]", g = "[object Function]", h = "[object GeneratorFunction]", y = "[object Map]", l = "[object Number]", w = "[object Object]", b = "[object Promise]", A = "[object RegExp]", U = "[object Set]", _ = "[object String]", S = "[object Symbol]", I = "[object WeakMap]", C = "[object ArrayBuffer]", k = "[object DataView]", W = "[object Float32Array]", j = "[object Float64Array]", Z = "[object Int8Array]", Pt = "[object Int16Array]", Zt = "[object Int32Array]", Ot = "[object Uint8Array]", Rt = "[object Uint8ClampedArray]", De = "[object Uint16Array]", de = "[object Uint32Array]", Fi = /[\\^$.*+?()[\]{}|]/g, Di = /\w*$/, Vi = /^\[object .+?Constructor\]$/, Ki = /^(?:0|[1-9]\d*)$/, $ = {};
  $[i] = $[c] = $[C] = $[k] = $[a] = $[u] = $[W] = $[j] = $[Z] = $[Pt] = $[Zt] = $[y] = $[l] = $[w] = $[A] = $[U] = $[_] = $[S] = $[Ot] = $[Rt] = $[De] = $[de] = !0, $[d] = $[g] = $[I] = !1;
  var Wi = typeof en == "object" && en && en.Object === Object && en, ji = typeof self == "object" && self && self.Object === Object && self, dt = Wi || ji || Function("return this")(), Br = e && !e.nodeType && e, Cr = Br && !0 && t && !t.nodeType && t, Gi = Cr && Cr.exports === Br;
  function qi(o, f) {
    return o.set(f[0], f[1]), o;
  }
  function Zi(o, f) {
    return o.add(f), o;
  }
  function Ri(o, f) {
    for (var p = -1, x = o ? o.length : 0; ++p < x && f(o[p], p, o) !== !1; )
      ;
    return o;
  }
  function Xi(o, f) {
    for (var p = -1, x = f.length, G = o.length; ++p < x; )
      o[G + p] = f[p];
    return o;
  }
  function Ir(o, f, p, x) {
    for (var G = -1, R = o ? o.length : 0; ++G < R; )
      p = f(p, o[G], G, o);
    return p;
  }
  function Yi(o, f) {
    for (var p = -1, x = Array(o); ++p < o; )
      x[p] = f(p);
    return x;
  }
  function Qi(o, f) {
    return o == null ? void 0 : o[f];
  }
  function Tr(o) {
    var f = !1;
    if (o != null && typeof o.toString != "function")
      try {
        f = !!(o + "");
      } catch {
      }
    return f;
  }
  function vr(o) {
    var f = -1, p = Array(o.size);
    return o.forEach(function(x, G) {
      p[++f] = [G, x];
    }), p;
  }
  function En(o, f) {
    return function(p) {
      return o(f(p));
    };
  }
  function Ur(o) {
    var f = -1, p = Array(o.size);
    return o.forEach(function(x) {
      p[++f] = x;
    }), p;
  }
  var Ji = Array.prototype, to = Function.prototype, Ve = Object.prototype, An = dt["__core-js_shared__"], Hr = function() {
    var o = /[^.]+$/.exec(An && An.keys && An.keys.IE_PROTO || "");
    return o ? "Symbol(src)_1." + o : "";
  }(), _r = to.toString, bt = Ve.hasOwnProperty, Ke = Ve.toString, eo = RegExp(
    "^" + _r.call(bt).replace(Fi, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Pr = Gi ? dt.Buffer : void 0, Or = dt.Symbol, Lr = dt.Uint8Array, no = En(Object.getPrototypeOf, Object), ro = Object.create, so = Ve.propertyIsEnumerable, io = Ji.splice, kr = Object.getOwnPropertySymbols, oo = Pr ? Pr.isBuffer : void 0, co = En(Object.keys, Object), Bn = Qt(dt, "DataView"), ge = Qt(dt, "Map"), Cn = Qt(dt, "Promise"), In = Qt(dt, "Set"), Tn = Qt(dt, "WeakMap"), pe = Qt(Object, "create"), ao = $t(Bn), uo = $t(ge), fo = $t(Cn), ho = $t(In), lo = $t(Tn), $r = Or ? Or.prototype : void 0, Nr = $r ? $r.valueOf : void 0;
  function Lt(o) {
    var f = -1, p = o ? o.length : 0;
    for (this.clear(); ++f < p; ) {
      var x = o[f];
      this.set(x[0], x[1]);
    }
  }
  function go() {
    this.__data__ = pe ? pe(null) : {};
  }
  function po(o) {
    return this.has(o) && delete this.__data__[o];
  }
  function yo(o) {
    var f = this.__data__;
    if (pe) {
      var p = f[o];
      return p === r ? void 0 : p;
    }
    return bt.call(f, o) ? f[o] : void 0;
  }
  function wo(o) {
    var f = this.__data__;
    return pe ? f[o] !== void 0 : bt.call(f, o);
  }
  function bo(o, f) {
    var p = this.__data__;
    return p[o] = pe && f === void 0 ? r : f, this;
  }
  Lt.prototype.clear = go, Lt.prototype.delete = po, Lt.prototype.get = yo, Lt.prototype.has = wo, Lt.prototype.set = bo;
  function gt(o) {
    var f = -1, p = o ? o.length : 0;
    for (this.clear(); ++f < p; ) {
      var x = o[f];
      this.set(x[0], x[1]);
    }
  }
  function mo() {
    this.__data__ = [];
  }
  function xo(o) {
    var f = this.__data__, p = We(f, o);
    if (p < 0)
      return !1;
    var x = f.length - 1;
    return p == x ? f.pop() : io.call(f, p, 1), !0;
  }
  function So(o) {
    var f = this.__data__, p = We(f, o);
    return p < 0 ? void 0 : f[p][1];
  }
  function Eo(o) {
    return We(this.__data__, o) > -1;
  }
  function Ao(o, f) {
    var p = this.__data__, x = We(p, o);
    return x < 0 ? p.push([o, f]) : p[x][1] = f, this;
  }
  gt.prototype.clear = mo, gt.prototype.delete = xo, gt.prototype.get = So, gt.prototype.has = Eo, gt.prototype.set = Ao;
  function Xt(o) {
    var f = -1, p = o ? o.length : 0;
    for (this.clear(); ++f < p; ) {
      var x = o[f];
      this.set(x[0], x[1]);
    }
  }
  function Bo() {
    this.__data__ = {
      hash: new Lt(),
      map: new (ge || gt)(),
      string: new Lt()
    };
  }
  function Co(o) {
    return je(this, o).delete(o);
  }
  function Io(o) {
    return je(this, o).get(o);
  }
  function To(o) {
    return je(this, o).has(o);
  }
  function vo(o, f) {
    return je(this, o).set(o, f), this;
  }
  Xt.prototype.clear = Bo, Xt.prototype.delete = Co, Xt.prototype.get = Io, Xt.prototype.has = To, Xt.prototype.set = vo;
  function Yt(o) {
    this.__data__ = new gt(o);
  }
  function Uo() {
    this.__data__ = new gt();
  }
  function Ho(o) {
    return this.__data__.delete(o);
  }
  function _o(o) {
    return this.__data__.get(o);
  }
  function Po(o) {
    return this.__data__.has(o);
  }
  function Oo(o, f) {
    var p = this.__data__;
    if (p instanceof gt) {
      var x = p.__data__;
      if (!ge || x.length < n - 1)
        return x.push([o, f]), this;
      p = this.__data__ = new Xt(x);
    }
    return p.set(o, f), this;
  }
  Yt.prototype.clear = Uo, Yt.prototype.delete = Ho, Yt.prototype.get = _o, Yt.prototype.has = Po, Yt.prototype.set = Oo;
  function Lo(o, f) {
    var p = Hn(o) || sc(o) ? Yi(o.length, String) : [], x = p.length, G = !!x;
    for (var R in o)
      bt.call(o, R) && !(G && (R == "length" || tc(R, x))) && p.push(R);
    return p;
  }
  function zr(o, f, p) {
    var x = o[f];
    (!(bt.call(o, f) && Vr(x, p)) || p === void 0 && !(f in o)) && (o[f] = p);
  }
  function We(o, f) {
    for (var p = o.length; p--; )
      if (Vr(o[p][0], f))
        return p;
    return -1;
  }
  function ko(o, f) {
    return o && Mr(f, _n(f), o);
  }
  function vn(o, f, p, x, G, R, pt) {
    var X;
    if (x && (X = R ? x(o, G, R, pt) : x(o)), X !== void 0)
      return X;
    if (!Ge(o))
      return o;
    var jr = Hn(o);
    if (jr) {
      if (X = Yo(o), !f)
        return Zo(o, X);
    } else {
      var Jt = kt(o), Gr = Jt == g || Jt == h;
      if (oc(o))
        return Do(o, f);
      if (Jt == w || Jt == i || Gr && !R) {
        if (Tr(o))
          return R ? o : {};
        if (X = Qo(Gr ? {} : o), !f)
          return Ro(o, ko(X, o));
      } else {
        if (!$[Jt])
          return R ? o : {};
        X = Jo(o, Jt, vn, f);
      }
    }
    pt || (pt = new Yt());
    var qr = pt.get(o);
    if (qr)
      return qr;
    if (pt.set(o, X), !jr)
      var Zr = p ? Xo(o) : _n(o);
    return Ri(Zr || o, function(Pn, qe) {
      Zr && (qe = Pn, Pn = o[qe]), zr(X, qe, vn(Pn, f, p, x, qe, o, pt));
    }), X;
  }
  function $o(o) {
    return Ge(o) ? ro(o) : {};
  }
  function No(o, f, p) {
    var x = f(o);
    return Hn(o) ? x : Xi(x, p(o));
  }
  function zo(o) {
    return Ke.call(o);
  }
  function Mo(o) {
    if (!Ge(o) || nc(o))
      return !1;
    var f = Wr(o) || Tr(o) ? eo : Vi;
    return f.test($t(o));
  }
  function Fo(o) {
    if (!Dr(o))
      return co(o);
    var f = [];
    for (var p in Object(o))
      bt.call(o, p) && p != "constructor" && f.push(p);
    return f;
  }
  function Do(o, f) {
    if (f)
      return o.slice();
    var p = new o.constructor(o.length);
    return o.copy(p), p;
  }
  function Un(o) {
    var f = new o.constructor(o.byteLength);
    return new Lr(f).set(new Lr(o)), f;
  }
  function Vo(o, f) {
    var p = f ? Un(o.buffer) : o.buffer;
    return new o.constructor(p, o.byteOffset, o.byteLength);
  }
  function Ko(o, f, p) {
    var x = f ? p(vr(o), !0) : vr(o);
    return Ir(x, qi, new o.constructor());
  }
  function Wo(o) {
    var f = new o.constructor(o.source, Di.exec(o));
    return f.lastIndex = o.lastIndex, f;
  }
  function jo(o, f, p) {
    var x = f ? p(Ur(o), !0) : Ur(o);
    return Ir(x, Zi, new o.constructor());
  }
  function Go(o) {
    return Nr ? Object(Nr.call(o)) : {};
  }
  function qo(o, f) {
    var p = f ? Un(o.buffer) : o.buffer;
    return new o.constructor(p, o.byteOffset, o.length);
  }
  function Zo(o, f) {
    var p = -1, x = o.length;
    for (f || (f = Array(x)); ++p < x; )
      f[p] = o[p];
    return f;
  }
  function Mr(o, f, p, x) {
    p || (p = {});
    for (var G = -1, R = f.length; ++G < R; ) {
      var pt = f[G], X = void 0;
      zr(p, pt, X === void 0 ? o[pt] : X);
    }
    return p;
  }
  function Ro(o, f) {
    return Mr(o, Fr(o), f);
  }
  function Xo(o) {
    return No(o, _n, Fr);
  }
  function je(o, f) {
    var p = o.__data__;
    return ec(f) ? p[typeof f == "string" ? "string" : "hash"] : p.map;
  }
  function Qt(o, f) {
    var p = Qi(o, f);
    return Mo(p) ? p : void 0;
  }
  var Fr = kr ? En(kr, Object) : uc, kt = zo;
  (Bn && kt(new Bn(new ArrayBuffer(1))) != k || ge && kt(new ge()) != y || Cn && kt(Cn.resolve()) != b || In && kt(new In()) != U || Tn && kt(new Tn()) != I) && (kt = function(o) {
    var f = Ke.call(o), p = f == w ? o.constructor : void 0, x = p ? $t(p) : void 0;
    if (x)
      switch (x) {
        case ao:
          return k;
        case uo:
          return y;
        case fo:
          return b;
        case ho:
          return U;
        case lo:
          return I;
      }
    return f;
  });
  function Yo(o) {
    var f = o.length, p = o.constructor(f);
    return f && typeof o[0] == "string" && bt.call(o, "index") && (p.index = o.index, p.input = o.input), p;
  }
  function Qo(o) {
    return typeof o.constructor == "function" && !Dr(o) ? $o(no(o)) : {};
  }
  function Jo(o, f, p, x) {
    var G = o.constructor;
    switch (f) {
      case C:
        return Un(o);
      case a:
      case u:
        return new G(+o);
      case k:
        return Vo(o, x);
      case W:
      case j:
      case Z:
      case Pt:
      case Zt:
      case Ot:
      case Rt:
      case De:
      case de:
        return qo(o, x);
      case y:
        return Ko(o, x, p);
      case l:
      case _:
        return new G(o);
      case A:
        return Wo(o);
      case U:
        return jo(o, x, p);
      case S:
        return Go(o);
    }
  }
  function tc(o, f) {
    return f = f ?? s, !!f && (typeof o == "number" || Ki.test(o)) && o > -1 && o % 1 == 0 && o < f;
  }
  function ec(o) {
    var f = typeof o;
    return f == "string" || f == "number" || f == "symbol" || f == "boolean" ? o !== "__proto__" : o === null;
  }
  function nc(o) {
    return !!Hr && Hr in o;
  }
  function Dr(o) {
    var f = o && o.constructor, p = typeof f == "function" && f.prototype || Ve;
    return o === p;
  }
  function $t(o) {
    if (o != null) {
      try {
        return _r.call(o);
      } catch {
      }
      try {
        return o + "";
      } catch {
      }
    }
    return "";
  }
  function rc(o) {
    return vn(o, !0, !0);
  }
  function Vr(o, f) {
    return o === f || o !== o && f !== f;
  }
  function sc(o) {
    return ic(o) && bt.call(o, "callee") && (!so.call(o, "callee") || Ke.call(o) == i);
  }
  var Hn = Array.isArray;
  function Kr(o) {
    return o != null && cc(o.length) && !Wr(o);
  }
  function ic(o) {
    return ac(o) && Kr(o);
  }
  var oc = oo || fc;
  function Wr(o) {
    var f = Ge(o) ? Ke.call(o) : "";
    return f == g || f == h;
  }
  function cc(o) {
    return typeof o == "number" && o > -1 && o % 1 == 0 && o <= s;
  }
  function Ge(o) {
    var f = typeof o;
    return !!o && (f == "object" || f == "function");
  }
  function ac(o) {
    return !!o && typeof o == "object";
  }
  function _n(o) {
    return Kr(o) ? Lo(o) : Fo(o);
  }
  function uc() {
    return [];
  }
  function fc() {
    return !1;
  }
  t.exports = rc;
})(dn, dn.exports);
var Cu = dn.exports;
const Iu = /* @__PURE__ */ Ga(Cu);
function yr(t) {
  if (z(t).byteLength != wn)
    throw Error("Invalid signature");
  return {
    type: E.MessageSignature,
    data: t
  };
}
function Tu(t, e) {
  switch (t) {
    case P.SerializeP2PKH:
      switch (e) {
        case rt.Mainnet:
          return Tt.MainnetSingleSig;
        case rt.Testnet:
          return Tt.TestnetSingleSig;
        default:
          throw new Error(`Unexpected txVersion ${JSON.stringify(e)} for hashMode ${t}`);
      }
    case P.SerializeP2SH:
    case P.SerializeP2SHNonSequential:
    case P.SerializeP2WPKH:
    case P.SerializeP2WSH:
    case P.SerializeP2WSHNonSequential:
      switch (e) {
        case rt.Mainnet:
          return Tt.MainnetMultiSig;
        case rt.Testnet:
          return Tt.TestnetMultiSig;
        default:
          throw new Error(`Unexpected txVersion ${JSON.stringify(e)} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${JSON.stringify(t)}`);
  }
}
function ee(t, e) {
  return { type: E.Address, version: t, hash160: e };
}
function Xn(t) {
  return fr.c32address(t.version, t.hash160);
}
function jt(t, e, n) {
  const r = e || 1, s = n || Oc;
  if (Ai(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: E.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function wr(t) {
  const e = fr.c32addressDecode(t);
  return {
    type: E.Address,
    version: e[0],
    hash160: e[1]
  };
}
var B;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(B || (B = {}));
function vu(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return _u(e, n);
  } else
    return Uu(t);
}
function Uu(t) {
  const e = wr(t);
  return { type: B.PrincipalStandard, address: e };
}
function Hu(t) {
  return { type: B.PrincipalStandard, address: t };
}
function _u(t, e) {
  const n = wr(t), r = jt(e);
  return ai(n, r);
}
function ai(t, e) {
  if (Le(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: B.PrincipalContract, address: t, contractName: e };
}
const Pu = () => ({ type: B.BoolTrue }), Ou = () => ({ type: B.BoolFalse }), bs = BigInt("0xffffffffffffffffffffffffffffffff"), Lu = BigInt(0), ms = BigInt("0x7fffffffffffffffffffffffffffffff"), xs = BigInt("-170141183460469231731687303715884105728"), ku = (t) => {
  const e = q(t, !0);
  if (e > ms)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${ms}`);
  if (e < xs)
    throw new RangeError(`Cannot construct clarity integer form value less than ${xs}`);
  return { type: B.Int, value: e };
}, ui = (t) => {
  const e = q(t, !1);
  if (e < Lu)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > bs)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${bs}`);
  return { type: B.UInt, value: e };
}, $u = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: B.Buffer, buffer: t };
};
function fi() {
  return { type: B.OptionalNone };
}
function hi(t) {
  return { type: B.OptionalSome, value: t };
}
function Nu(t) {
  return { type: B.ResponseErr, value: t };
}
function zu(t) {
  return { type: B.ResponseOk, value: t };
}
function Mu(t) {
  return { type: B.List, list: t };
}
function li(t) {
  for (const e in t)
    if (!Uf(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: B.Tuple, data: t };
}
const on = (t) => ({ type: B.StringASCII, data: t }), Fu = (t) => ({ type: B.StringUTF8, data: t });
class di extends ks {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Mt.hash(e);
    const r = or(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, i = new Uint8Array(s);
    i.set(r.length > s ? e.create().update(r).digest() : r);
    for (let c = 0; c < i.length; c++)
      i[c] ^= 54;
    this.iHash.update(i), this.oHash = e.create();
    for (let c = 0; c < i.length; c++)
      i[c] ^= 106;
    this.oHash.update(i), i.fill(0);
  }
  update(e) {
    return Mt.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Mt.exists(this), Mt.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: c, outputLen: a } = this;
    return e = e, e.finished = s, e.destroyed = i, e.blockLen = c, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const gi = (t, e, n) => new di(t, e).update(n).digest();
gi.create = (t, e) => new di(t, e);
Ut.hmacSha256Sync = (t, ...e) => {
  const n = gi.create(bn, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Du(t, e = rt.Mainnet) {
  t = typeof t == "string" ? t : H(t);
  const n = Tu(P.SerializeP2PKH, e), r = ee(n, Bi(z(t)));
  return Xn(r);
}
function ue(t) {
  return {
    type: E.PublicKey,
    data: z(t)
  };
}
function pi(t, e, n = F.Compressed) {
  const r = Bc(e.data), s = new ht(Xr(r.r), Xr(r.s)), i = N.fromSignature(t, s, r.recoveryId), c = n === F.Compressed;
  return i.toHex(c);
}
function Vu(t, e, n = F.Compressed) {
  return pi(t, { ...e, data: Cc(e.data) }, n);
}
function Ku(t) {
  return { type: E.PublicKey, data: t };
}
function le(t) {
  return !H(t.data).startsWith("04");
}
function gn(t) {
  return t.data.slice();
}
function Wu(t) {
  const e = qu(t), n = Da(e.data.slice(0, 32), e.compressed);
  return ue(H(n));
}
function ju(t) {
  const e = typeof t == "string" ? t : H(t), n = N.fromHex(e).toHex(!0);
  return ue(n);
}
function Gu(t) {
  const e = typeof t == "string" ? t : H(t), n = N.fromHex(e).toHex(!1);
  return ue(n);
}
function Yn(t) {
  const e = t.readUInt8(), n = e === 4 ? $c : kc;
  return Ku(V([e, t.readBytes(n)]));
}
function qu(t) {
  const e = Ic(t), n = e.length == Ps;
  return { data: e, compressed: n };
}
function Zu(t, e) {
  const [n, r] = ja(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = Oe(r, 1) + ht.fromHex(n).toCompactHex();
  return yr(i);
}
function Ru(t) {
  return Wu(t.data);
}
function Xu(t, e, n) {
  return typeof t == "string" && (t = vu(t)), typeof n == "string" && (n = As(n)), {
    type: E.Payload,
    payloadType: v.TokenTransfer,
    recipient: t,
    amount: q(e, !1),
    memo: n ?? As("")
  };
}
function Yu(t, e, n, r) {
  return typeof t == "string" && (t = wr(t)), typeof e == "string" && (e = jt(e)), typeof n == "string" && (n = jt(n)), {
    type: E.Payload,
    payloadType: v.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Ss(t, e, n) {
  return typeof t == "string" && (t = jt(t)), typeof e == "string" && (e = cf(e)), typeof n == "number" ? {
    type: E.Payload,
    payloadType: v.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: E.Payload,
    payloadType: v.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function Qu() {
  return { type: E.Payload, payloadType: v.PoisonMicroblock };
}
function Es(t, e) {
  if (t.byteLength != Dt)
    throw Error(`Coinbase buffer size must be ${Dt} bytes`);
  return e != null ? {
    type: E.Payload,
    payloadType: v.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: E.Payload,
    payloadType: v.Coinbase,
    coinbaseBytes: t
  };
}
function Ju(t, e, n) {
  if (t.byteLength != Dt)
    throw Error(`Coinbase buffer size must be ${Dt} bytes`);
  if (n.byteLength != Mn)
    throw Error(`VRF proof buffer size must be ${Mn} bytes`);
  return {
    type: E.Payload,
    payloadType: v.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === B.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var Qn;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(Qn || (Qn = {}));
function tf(t, e, n, r, s, i, c) {
  return {
    type: E.Payload,
    payloadType: v.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: c
  };
}
function yi(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case v.TokenTransfer:
      e.push(ft(t.recipient)), e.push(_t(t.amount, !1, 8)), e.push(wt(t.memo));
      break;
    case v.ContractCall:
      e.push(wt(t.contractAddress)), e.push(wt(t.contractName)), e.push(wt(t.functionName));
      const n = new Uint8Array(4);
      Kt(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(ft(r));
      });
      break;
    case v.SmartContract:
      e.push(wt(t.contractName)), e.push(wt(t.codeBody));
      break;
    case v.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(wt(t.contractName)), e.push(wt(t.codeBody));
      break;
    case v.PoisonMicroblock:
      break;
    case v.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case v.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(ft(t.recipient));
      break;
    case v.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(ft(t.recipient ? hi(t.recipient) : fi())), e.push(t.vrfProof);
      break;
    case v.TenureChange:
      e.push(z(t.tenureHash)), e.push(z(t.previousTenureHash)), e.push(z(t.burnViewHash)), e.push(z(t.previousTenureEnd)), e.push(Kt(new Uint8Array(4), t.previousTenureBlocks)), e.push(Hc(new Uint8Array(1), t.cause)), e.push(z(t.publicKeyHash));
      break;
  }
  return V(e);
}
function ef(t) {
  switch (t.readUInt8Enum(v, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case v.TokenTransfer:
      const n = ut(t), r = q(t.readBytes(8), !1), s = bi(t);
      return Xu(n, r, s);
    case v.ContractCall:
      const i = fe(t), c = nt(t), a = nt(t), u = [], d = t.readUInt32BE();
      for (let S = 0; S < d; S++) {
        const I = ut(t);
        u.push(I);
      }
      return Yu(i, c, a, u);
    case v.SmartContract:
      const g = nt(t), h = nt(t, 4, 1e5);
      return Ss(g, h);
    case v.VersionedSmartContract: {
      const S = t.readUInt8Enum(Fn, (k) => {
        throw new Error(`Cannot recognize ClarityVersion: ${k}`);
      }), I = nt(t), C = nt(t, 4, 1e5);
      return Ss(I, C, S);
    }
    case v.PoisonMicroblock:
      return Qu();
    case v.Coinbase: {
      const S = t.readBytes(Dt);
      return Es(S);
    }
    case v.CoinbaseToAltRecipient: {
      const S = t.readBytes(Dt), I = ut(t);
      return Es(S, I);
    }
    case v.NakamotoCoinbase: {
      const S = t.readBytes(Dt), I = ut(t), C = t.readBytes(Mn);
      return Ju(S, I, C);
    }
    case v.TenureChange:
      const y = H(t.readBytes(20)), l = H(t.readBytes(20)), w = H(t.readBytes(20)), b = H(t.readBytes(32)), A = t.readUInt32BE(), U = t.readUInt8Enum(Qn, (S) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${S}`);
      }), _ = H(t.readBytes(20));
      return tf(y, l, w, b, A, U, _);
  }
}
class Sn extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Nt extends Sn {
  constructor(e) {
    super(e);
  }
}
class tt extends Sn {
  constructor(e) {
    super(e);
  }
}
class pn extends Sn {
  constructor(e) {
    super(e);
  }
}
class Ft extends Sn {
  constructor(e) {
    super(e);
  }
}
var ot;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(ot || (ot = {}));
function Jn(t) {
  return yr(H(t.readBytes(wn)));
}
function ne(t, e) {
  return {
    pubKeyEncoding: t,
    type: E.TransactionAuthField,
    contents: e
  };
}
function nf(t) {
  const e = t.readUInt8Enum(ot, (n) => {
    throw new tt(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case ot.PublicKeyCompressed:
      return ne(F.Compressed, Yn(t));
    case ot.PublicKeyUncompressed:
      return ne(F.Uncompressed, Gu(Yn(t).data));
    case ot.SignatureCompressed:
      return ne(F.Compressed, Jn(t));
    case ot.SignatureUncompressed:
      return ne(F.Uncompressed, Jn(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function br(t) {
  return z(t.data);
}
function rf(t) {
  const e = [];
  switch (t.contents.type) {
    case E.PublicKey:
      e.push(t.pubKeyEncoding === F.Compressed ? ot.PublicKeyCompressed : ot.PublicKeyUncompressed), e.push(gn(ju(t.contents.data)));
      break;
    case E.MessageSignature:
      e.push(t.pubKeyEncoding === F.Compressed ? ot.SignatureCompressed : ot.SignatureUncompressed), e.push(br(t.contents));
      break;
  }
  return V(e);
}
function wt(t) {
  switch (t.type) {
    case E.Address:
      return Me(t);
    case E.Principal:
      return wi(t);
    case E.LengthPrefixedString:
      return he(t);
    case E.MemoString:
      return af(t);
    case E.AssetInfo:
      return mi(t);
    case E.PostCondition:
      return uf(t);
    case E.PublicKey:
      return gn(t);
    case E.LengthPrefixedList:
      return Sr(t);
    case E.Payload:
      return yi(t);
    case E.TransactionAuthField:
      return rf(t);
    case E.MessageSignature:
      return br(t);
  }
}
function sf() {
  return {
    type: E.Address,
    version: Tt.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function mr(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === P.SerializeP2PKH || e === P.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === P.SerializeP2WPKH || e === P.SerializeP2WSH || e === P.SerializeP2WSHNonSequential) && !r.every(le))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case P.SerializeP2PKH:
      return ee(t, Bi(r[0].data));
    case P.SerializeP2WPKH:
      return ee(t, If(r[0].data));
    case P.SerializeP2SH:
    case P.SerializeP2SHNonSequential:
      return ee(t, Tf(n, r.map(gn)));
    case P.SerializeP2WSH:
    case P.SerializeP2WSHNonSequential:
      return ee(t, vf(n, r.map(gn)));
  }
}
function Me(t) {
  const e = [];
  return e.push(z(Oe(t.version, 1))), e.push(z(t.hash160)), V(e);
}
function fe(t) {
  const e = yn(H(t.readBytes(1))), n = H(t.readBytes(20));
  return { type: E.Address, version: e, hash160: n };
}
function wi(t) {
  const e = [];
  return e.push(t.prefix), e.push(Me(t.address)), t.prefix === Ie.Contract && e.push(he(t.contractName)), V(e);
}
function of(t) {
  const e = t.readUInt8Enum(Ie, (s) => {
    throw new tt(`Unexpected Principal payload type: ${s}`);
  }), n = fe(t);
  if (e === Ie.Standard)
    return { type: E.Principal, prefix: e, address: n };
  const r = nt(t);
  return {
    type: E.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function he(t) {
  const e = [], n = Le(t.content), r = n.byteLength;
  return e.push(z(Oe(r, t.lengthPrefixBytes))), e.push(n), V(e);
}
function nt(t, e, n) {
  e = e || 1;
  const r = yn(H(t.readBytes(e))), s = ir(t.readBytes(r));
  return jt(s, e, n ?? 128);
}
function cf(t) {
  return jt(t, 4, 1e5);
}
function As(t) {
  if (t && Ai(t, cn))
    throw new Error(`Memo exceeds maximum length of ${cn} bytes`);
  return { type: E.MemoString, content: t };
}
function af(t) {
  const e = [], n = Le(t.content), r = Cf(H(n), cn * 2);
  return e.push(z(r)), V(e);
}
function bi(t) {
  let e = ir(t.readBytes(cn));
  return e = e.replace(/\u0000*$/, ""), { type: E.MemoString, content: e };
}
function mi(t) {
  const e = [];
  return e.push(Me(t.address)), e.push(he(t.contractName)), e.push(he(t.assetName)), V(e);
}
function tr(t) {
  return {
    type: E.AssetInfo,
    address: fe(t),
    contractName: nt(t),
    assetName: nt(t)
  };
}
function xr(t, e) {
  return {
    type: E.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Sr(t) {
  const e = t.values, n = [];
  n.push(z(Oe(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(wt(r));
  return V(n);
}
function xi(t, e, n) {
  const r = yn(H(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case E.Address:
        s.push(fe(t));
        break;
      case E.LengthPrefixedString:
        s.push(nt(t));
        break;
      case E.MemoString:
        s.push(bi(t));
        break;
      case E.AssetInfo:
        s.push(tr(t));
        break;
      case E.PostCondition:
        s.push(ff(t));
        break;
      case E.PublicKey:
        s.push(Yn(t));
        break;
      case E.TransactionAuthField:
        s.push(nf(t));
        break;
    }
  return xr(s, n);
}
function uf(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(wi(t.principal)), (t.conditionType === Q.Fungible || t.conditionType === Q.NonFungible) && e.push(mi(t.assetInfo)), t.conditionType === Q.NonFungible && e.push(ft(t.assetName)), e.push(t.conditionCode), t.conditionType === Q.STX || t.conditionType === Q.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Nt("The post-condition amount may not be larger than 8 bytes");
    e.push(_t(t.amount, !1, 8));
  }
  return V(e);
}
function ff(t) {
  const e = t.readUInt8Enum(Q, (c) => {
    throw new tt(`Could not read ${c} as PostConditionType`);
  }), n = of(t);
  let r, s, i;
  switch (e) {
    case Q.STX:
      return r = t.readUInt8Enum(un, (a) => {
        throw new tt(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${H(t.readBytes(8))}`), {
        type: E.PostCondition,
        conditionType: Q.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case Q.Fungible:
      return s = tr(t), r = t.readUInt8Enum(un, (a) => {
        throw new tt(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${H(t.readBytes(8))}`), {
        type: E.PostCondition,
        conditionType: Q.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case Q.NonFungible:
      s = tr(t);
      const c = ut(t);
      return r = t.readUInt8Enum(Dn, (a) => {
        throw new tt(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: E.PostCondition,
        conditionType: Q.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: c
      };
  }
}
function lt(t, e) {
  return V([t, e]);
}
function hf(t) {
  return new Uint8Array([t.type]);
}
function lf(t) {
  return t.type === B.OptionalNone ? new Uint8Array([t.type]) : lt(t.type, ft(t.value));
}
function df(t) {
  const e = new Uint8Array(4);
  return Kt(e, t.buffer.length, 0), lt(t.type, ke(e, t.buffer));
}
function gf(t) {
  const e = sr(wc(t.value, BigInt(Lc)), Os);
  return lt(t.type, e);
}
function pf(t) {
  const e = sr(t.value, Os);
  return lt(t.type, e);
}
function yf(t) {
  return lt(t.type, Me(t.address));
}
function wf(t) {
  return lt(t.type, ke(Me(t.address), he(t.contractName)));
}
function bf(t) {
  return lt(t.type, ft(t.value));
}
function mf(t) {
  const e = [], n = new Uint8Array(4);
  Kt(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = ft(r);
    e.push(s);
  }
  return lt(t.type, V(e));
}
function xf(t) {
  const e = [], n = new Uint8Array(4);
  Kt(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = jt(s);
    e.push(he(i));
    const c = ft(t.data[s]);
    e.push(c);
  }
  return lt(t.type, V(e));
}
function Si(t, e) {
  const n = [], r = e == "ascii" ? Sc(t.data) : Le(t.data), s = new Uint8Array(4);
  return Kt(s, r.length, 0), n.push(s), n.push(r), lt(t.type, V(n));
}
function Sf(t) {
  return Si(t, "ascii");
}
function Ef(t) {
  return Si(t, "utf8");
}
function ft(t) {
  switch (t.type) {
    case B.BoolTrue:
    case B.BoolFalse:
      return hf(t);
    case B.OptionalNone:
    case B.OptionalSome:
      return lf(t);
    case B.Buffer:
      return df(t);
    case B.UInt:
      return pf(t);
    case B.Int:
      return gf(t);
    case B.PrincipalStandard:
      return yf(t);
    case B.PrincipalContract:
      return wf(t);
    case B.ResponseOk:
    case B.ResponseErr:
      return bf(t);
    case B.List:
      return mf(t);
    case B.Tuple:
      return xf(t);
    case B.StringASCII:
      return Sf(t);
    case B.StringUTF8:
      return Ef(t);
    default:
      throw new Nt("Unable to serialize. Invalid Clarity Value.");
  }
}
function Af(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Bs = /* @__PURE__ */ new Map();
function Ei(t, e) {
  const n = Bs.get(t);
  if (n !== void 0)
    return n(e);
  const r = Af(t);
  return Bs.set(t, r), Ei(t, e);
}
class Ce {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return _c(this.readBytes(4), 0);
  }
  readUInt8() {
    return Uc(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Tc(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = H(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = H(n);
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
    if (Ei(e, r))
      return r;
    throw n(r);
  }
}
function ut(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Ce(z(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Ce(t) : e = t;
  switch (e.readUInt8Enum(B, (r) => {
    throw new tt(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case B.Int:
      return ku(e.readBytes(16));
    case B.UInt:
      return ui(e.readBytes(16));
    case B.Buffer:
      const r = e.readUInt32BE();
      return $u(e.readBytes(r));
    case B.BoolTrue:
      return Pu();
    case B.BoolFalse:
      return Ou();
    case B.PrincipalStandard:
      const s = fe(e);
      return Hu(s);
    case B.PrincipalContract:
      const i = fe(e), c = nt(e);
      return ai(i, c);
    case B.ResponseOk:
      return zu(ut(e));
    case B.ResponseErr:
      return Nu(ut(e));
    case B.OptionalNone:
      return fi();
    case B.OptionalSome:
      return hi(ut(e));
    case B.List:
      const a = e.readUInt32BE(), u = [];
      for (let b = 0; b < a; b++)
        u.push(ut(e));
      return Mu(u);
    case B.Tuple:
      const d = e.readUInt32BE(), g = {};
      for (let b = 0; b < d; b++) {
        const A = nt(e).content;
        if (A === void 0)
          throw new tt('"content" is undefined');
        g[A] = ut(e);
      }
      return li(g);
    case B.StringASCII:
      const h = e.readUInt32BE(), y = Ec(e.readBytes(h));
      return on(y);
    case B.StringUTF8:
      const l = e.readUInt32BE(), w = ir(e.readBytes(l));
      return Fu(w);
    default:
      throw new tt("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const Bf = (t) => t.length % 2 == 0 ? t : `0${t}`, Cf = (t, e) => t.padEnd(e, "0"), Ai = (t, e) => t ? Le(t).length > e : !1;
function er(t) {
  return Iu(t);
}
const Ue = (t) => Qc(bn(t)), Er = (t) => H(Ua(t)), Bi = (t) => H(Ue(t)), If = (t) => {
  const e = Ue(t), n = ke(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Ue(n);
  return H(r);
}, Tf = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = V(n), s = Ue(r);
  return H(s);
}, vf = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((u) => {
    n.push(u.length), n.push(u);
  }), n.push(80 + e.length), n.push(174);
  const r = V(n), s = bn(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const c = V(i), a = Ue(c);
  return H(a);
};
function Uf(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function Ar() {
  return {
    type: E.MessageSignature,
    data: H(new Uint8Array(wn))
  };
}
function Ci(t, e, n, r) {
  const s = mr(0, t, 1, [ue(e)]).hash160, i = le(ue(e)) ? F.Compressed : F.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: q(n, !1),
    fee: q(r, !1),
    keyEncoding: i,
    signature: Ar()
  };
}
function He(t) {
  return "signature" in t;
}
function Cs(t) {
  return t === P.SerializeP2SH || t === P.SerializeP2WSH;
}
function Hf(t) {
  return t === P.SerializeP2SHNonSequential || t === P.SerializeP2WSHNonSequential;
}
function Is(t) {
  const e = er(t);
  return e.nonce = 0, e.fee = 0, He(e) ? e.signature = Ar() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function _f(t) {
  const e = [
    t.hashMode,
    z(t.signer),
    _t(t.nonce, !1, 8),
    _t(t.fee, !1, 8),
    t.keyEncoding,
    br(t.signature)
  ];
  return V(e);
}
function Pf(t) {
  const e = [
    t.hashMode,
    z(t.signer),
    _t(t.nonce, !1, 8),
    _t(t.fee, !1, 8)
  ], n = xr(t.fields);
  e.push(Sr(n));
  const r = new Uint8Array(2);
  return vc(r, t.signaturesRequired, 0), e.push(r), V(e);
}
function Of(t, e) {
  const n = H(e.readBytes(20)), r = BigInt(`0x${H(e.readBytes(8))}`), s = BigInt(`0x${H(e.readBytes(8))}`), i = e.readUInt8Enum(F, (a) => {
    throw new tt(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === P.SerializeP2WPKH && i != F.Compressed)
    throw new tt("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const c = Jn(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: c
  };
}
function Lf(t, e) {
  const n = H(e.readBytes(20)), r = BigInt("0x" + H(e.readBytes(8))), s = BigInt("0x" + H(e.readBytes(8))), i = xi(e, E.TransactionAuthField).values;
  let c = !1, a = 0;
  for (const d of i)
    switch (d.contents.type) {
      case E.PublicKey:
        le(d.contents) || (c = !0);
        break;
      case E.MessageSignature:
        if (d.pubKeyEncoding === F.Uncompressed && (c = !0), a += 1, a === 65536)
          throw new Ft("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const u = e.readUInt16BE();
  if (c && (t === P.SerializeP2WSH || t === P.SerializeP2WSHNonSequential))
    throw new Ft("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: u
  };
}
function $n(t) {
  return He(t) ? _f(t) : Pf(t);
}
function Nn(t) {
  const e = t.readUInt8Enum(P, (n) => {
    throw new tt(`Could not parse ${n} as AddressHashMode`);
  });
  return e === P.SerializeP2PKH || e === P.SerializeP2WPKH ? Of(e, t) : Lf(e, t);
}
function Ii(t, e, n, r) {
  const i = t + H(new Uint8Array([e])) + H(_t(n, !1, 8)) + H(_t(r, !1, 8));
  if (z(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Er(z(i));
}
function Ti(t, e, n) {
  const r = 33 + wn, s = le(e) ? F.Compressed : F.Uncompressed, i = t + Bf(s.toString(16)) + n.data, c = z(i);
  if (c.byteLength > r)
    throw Error("Invalid signature hash length");
  return Er(c);
}
function kf(t, e, n, r, s) {
  const i = Ii(t, e, n, r), c = Zu(s, i), a = Ru(s), u = Ti(i, a, c);
  return {
    nextSig: c,
    nextSigHash: u
  };
}
function vi(t, e, n, r, s, i) {
  const c = Ii(t, e, n, r), a = ue(pi(c, i, s)), u = Ti(c, a, i);
  return {
    pubKey: a,
    nextSigHash: u
  };
}
function $f() {
  const t = Ci(P.SerializeP2PKH, "", 0, 0);
  return t.signer = sf().hash160, t.keyEncoding = F.Compressed, t.signature = Ar(), t;
}
function Ts(t, e, n) {
  return He(t) ? Nf(t, e, n) : zf(t, e, n);
}
function Nf(t, e, n) {
  const { pubKey: r, nextSigHash: s } = vi(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = mr(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Ft(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function zf(t, e, n) {
  const r = [];
  let s = e, i = !1, c = 0;
  for (const u of t.fields)
    switch (u.contents.type) {
      case E.PublicKey:
        le(u.contents) || (i = !0), r.push(u.contents);
        break;
      case E.MessageSignature:
        u.pubKeyEncoding === F.Uncompressed && (i = !0);
        const { pubKey: d, nextSigHash: g } = vi(s, n, t.fee, t.nonce, u.pubKeyEncoding, u.contents);
        if (Cs(t.hashMode) && (s = g), r.push(d), c += 1, c === 65536)
          throw new Ft("Too many signatures");
        break;
    }
  if (Cs(t.hashMode) && c !== t.signaturesRequired || Hf(t.hashMode) && c < t.signaturesRequired)
    throw new Ft("Incorrect number of signatures");
  if (i && (t.hashMode === P.SerializeP2WSH || t.hashMode === P.SerializeP2WSHNonSequential))
    throw new Ft("Uncompressed keys are not allowed in this hash mode");
  const a = mr(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Ft(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Ui(t) {
  return {
    authType: D.Standard,
    spendingCondition: t
  };
}
function Hi(t, e) {
  return {
    authType: D.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Ci(P.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function vs(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case D.Standard:
        return Ui(Is(t.spendingCondition));
      case D.Sponsored:
        return Hi(Is(t.spendingCondition), $f());
      default:
        throw new pn("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function Mf(t, e) {
  switch (t.authType) {
    case D.Standard:
      return Ts(t.spendingCondition, e, D.Standard);
    case D.Sponsored:
      return Ts(t.spendingCondition, e, D.Standard);
    default:
      throw new pn("Invalid origin auth type");
  }
}
function Ff(t, e) {
  switch (t.authType) {
    case D.Standard:
      const n = {
        ...t.spendingCondition,
        fee: q(e, !1)
      };
      return { ...t, spendingCondition: n };
    case D.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: q(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function Df(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: q(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function Vf(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: q(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function Kf(t, e) {
  const n = {
    ...e,
    nonce: q(e.nonce, !1),
    fee: q(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function Wf(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case D.Standard:
      e.push($n(t.spendingCondition));
      break;
    case D.Sponsored:
      e.push($n(t.spendingCondition)), e.push($n(t.sponsorSpendingCondition));
      break;
  }
  return V(e);
}
function jf(t) {
  const e = t.readUInt8Enum(D, (r) => {
    throw new tt(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case D.Standard:
      return n = Nn(t), Ui(n);
    case D.Sponsored:
      n = Nn(t);
      const r = Nn(t);
      return Hi(n, r);
  }
}
class Gf {
  constructor(e, n, r, s, i, c, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: q(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? Pc, this.postConditionMode = i ?? an.Deny, this.postConditions = s ?? xr([]), c)
      this.anchorMode = Nc(c);
    else
      switch (r.payloadType) {
        case v.Coinbase:
        case v.CoinbaseToAltRecipient:
        case v.NakamotoCoinbase:
        case v.PoisonMicroblock:
        case v.TenureChange:
          this.anchorMode = Y.OnChainOnly;
          break;
        case v.ContractCall:
        case v.SmartContract:
        case v.VersionedSmartContract:
        case v.TokenTransfer:
          this.anchorMode = Y.Any;
          break;
      }
  }
  signBegin() {
    const e = er(this);
    return e.auth = vs(e.auth), e.txid();
  }
  verifyBegin() {
    const e = er(this);
    return e.auth = vs(e.auth), e.txid();
  }
  verifyOrigin() {
    return Mf(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, D.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === D.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, D.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !He(n)) {
      const r = le(e);
      n.fields.push(ne(r ? F.Compressed : F.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: c } = kf(n, r, e.fee, e.nonce, s);
    return He(e) ? e.signature = i : e.fields.push(ne(s.data.byteLength === Ps ? F.Compressed : F.Uncompressed, i)), c;
  }
  txid() {
    const e = this.serialize();
    return Er(e);
  }
  setSponsor(e) {
    if (this.auth.authType != D.Sponsored)
      throw new pn("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Kf(this.auth, e);
  }
  setFee(e) {
    this.auth = Ff(this.auth, e);
  }
  setNonce(e) {
    this.auth = Df(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != D.Sponsored)
      throw new pn("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Vf(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new Nt('"version" is undefined');
    if (this.chainId === void 0)
      throw new Nt('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Nt('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Nt('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Nt('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return Kt(n, this.chainId, 0), e.push(n), e.push(Wf(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Sr(this.postConditions)), e.push(yi(this.payload)), V(e);
  }
}
function qf(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new Ce(z(t.slice(2))) : e = new Ce(z(t)) : t instanceof Uint8Array ? e = new Ce(t) : e = t;
  const n = e.readUInt8Enum(rt, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = jf(e), i = e.readUInt8Enum(Y, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), c = e.readUInt8Enum(an, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), a = xi(e, E.PostCondition), u = ef(e);
  return new Gf(n, s, u, a, c, i, r);
}
const Zf = new Uint8Array([83, 73, 80, 48, 49, 56]);
function Us(t) {
  return bn(ft(t));
}
function Rf(t) {
  return !(t.type !== B.Tuple || !["name", "version", "chain-id"].every((e) => e in t.data) || !["name", "version"].every((e) => t.data[e].type === B.StringASCII) || t.data["chain-id"].type !== B.UInt);
}
function Xf({ message: t, domain: e }) {
  const n = Us(t);
  if (!Rf(e))
    throw new Error("domain parameter must be a valid domain of type TupleCV with keys 'name', 'version', 'chain-id' with respective types StringASCII, StringASCII, UInt");
  const r = Us(e);
  return ke(Zf, r, n);
}
const _i = "ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA", Yf = "ParallaX LAYR", nr = 3000n, Qf = 2147483648, Jf = (t) => {
  const e = t.replace(/^0x/, "");
  if (!/^(?:[0-9a-f]{2})+$/i.test(e) || e.length > 4096) throw new Error("The signed transaction is not readable.");
  return Uint8Array.from(e.match(/../g), (n) => parseInt(n, 16));
};
function th(t, e) {
  var u;
  const n = qf(Jf(t)), r = n.auth, s = r.spendingCondition, i = n.payload, c = Xn(ee(Tt.TestnetSingleSig, s.signer));
  if (n.version !== rt.Testnet || n.chainId !== Qf || r.authType !== D.Standard || s.hashMode !== 0 || c !== e.address || BigInt(s.fee) !== e.fee || BigInt(s.nonce) !== e.nonce || i.payloadType !== v.TokenTransfer || Xn(i.recipient.address) !== _i || BigInt(i.amount) !== BigInt(e.stx) * 1000000n || String(((u = i.memo) == null ? void 0 : u.content) ?? "").replace(/\0+$/, "") !== Yf) throw new Error("The casino wallet signed something other than the buy that was asked for. Nothing was sent.");
  return n.verifyOrigin(), "0x" + n.txid();
}
const eh = /* @__PURE__ */ Uint8Array.from([
  7,
  4,
  13,
  1,
  10,
  6,
  15,
  3,
  12,
  0,
  9,
  5,
  2,
  14,
  11,
  8
]), Pi = Uint8Array.from(new Array(16).fill(0).map((t, e) => e)), nh = Pi.map((t) => (9 * t + 5) % 16), Oi = /* @__PURE__ */ (() => {
  const n = [[Pi], [nh]];
  for (let r = 0; r < 4; r++)
    for (let s of n)
      s.push(s[r].map((i) => eh[i]));
  return n;
})(), Li = Oi[0], ki = Oi[1], $i = /* @__PURE__ */ [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => Uint8Array.from(t)), rh = /* @__PURE__ */ Li.map((t, e) => t.map((n) => $i[e][n])), sh = /* @__PURE__ */ ki.map((t, e) => t.map((n) => $i[e][n])), ih = /* @__PURE__ */ Uint32Array.from([
  0,
  1518500249,
  1859775393,
  2400959708,
  2840853838
]), oh = /* @__PURE__ */ Uint32Array.from([
  1352829926,
  1548603684,
  1836072691,
  2053994217,
  0
]);
function Hs(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const nn = /* @__PURE__ */ new Uint32Array(16);
class ch extends ei {
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
    for (let l = 0; l < 16; l++, n += 4)
      nn[l] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, c = i, a = this.h2 | 0, u = a, d = this.h3 | 0, g = d, h = this.h4 | 0, y = h;
    for (let l = 0; l < 5; l++) {
      const w = 4 - l, b = ih[l], A = oh[l], U = Li[l], _ = ki[l], S = rh[l], I = sh[l];
      for (let C = 0; C < 16; C++) {
        const k = xe(r + Hs(l, i, a, d) + nn[U[C]] + b, S[C]) + h | 0;
        r = h, h = d, d = xe(a, 10) | 0, a = i, i = k;
      }
      for (let C = 0; C < 16; C++) {
        const k = xe(s + Hs(w, c, u, g) + nn[_[C]] + A, I[C]) + y | 0;
        s = y, y = g, g = xe(u, 10) | 0, u = c, c = k;
      }
    }
    this.set(this.h1 + a + g | 0, this.h2 + d + y | 0, this.h3 + h + s | 0, this.h4 + r + c | 0, this.h0 + i + u | 0);
  }
  roundClean() {
    ce(nn);
  }
  destroy() {
    this.destroyed = !0, ce(this.buffer), this.set(0, 0, 0, 0, 0);
  }
}
const ah = /* @__PURE__ */ ze(() => new ch()), uh = ah, fh = "ParallaX Casino", hh = "ParallaX Casino room sign-in. This is free: it sends no transaction, costs no fees and gives no permission to spend anything.";
new TextEncoder();
new TextDecoder();
const lh = (t) => t === "mainnet" ? 1 : 2147483648, dh = (t) => `${hh} Account ${t.address}. Valid until ${new Date(t.expires).toISOString().replace(".000Z", "Z")}. Request code ${t.nonce}.`, gh = (t) => ({
  domain: li({
    name: on(fh),
    version: on("1"),
    "chain-id": ui(lh(t.network))
  }),
  message: on(dh(t))
}), ph = (t, e) => {
  try {
    if (typeof e != "string") return null;
    const n = e.replace(/^0x/, "");
    if (!/^[a-fA-F0-9]{130}$/.test(n)) return null;
    const r = Zn(Rn(Xf(gh(t)))), s = Vu(r, yr(n)), i = t.network === "mainnet" ? rt.Mainnet : rt.Testnet;
    return Du(s, i) !== t.address ? null : { address: t.address, hash160: Zn(uh(Rn(Xs(s)))) };
  } catch {
    return null;
  }
}, _e = window, Se = typeof _e.ParallaxCasinoWalletOrigin == "string" ? _e.ParallaxCasinoWalletOrigin : "https://casino-wallet.xtrata.xyz", Ni = typeof _e.ParallaxCasinoTestnetApi == "string" ? _e.ParallaxCasinoTestnetApi : "https://api.testnet.hiro.so", yh = 30 * 6e4, wh = 15e3, zt = (t) => Object.assign(new Error(t), { code: "NOT_SENT" });
let Pe = null, st = null, me = null;
function bh(t) {
  Pe = t;
}
function zi() {
  if (st) return Promise.resolve(st);
  if (me) return me;
  if (!Pe) return Promise.reject(new Error("The casino wallet has nowhere to appear. Reload the page."));
  const t = Pe;
  return me = new Promise((e, n) => {
    const r = document.createElement("iframe");
    r.title = "Xtrata casino wallet (testnet)", r.className = "lx-wallet-frame", r.setAttribute("allow", `publickey-credentials-get ${Se}; publickey-credentials-create ${Se}`), r.referrerPolicy = "no-referrer";
    const s = setTimeout(() => {
      me = null, n(new Error("The casino wallet did not load. Check your connection and try again."));
    }, 15e3);
    r.addEventListener("load", () => {
      clearTimeout(s), st = new yc({ walletOrigin: Se, frame: r, timeoutMs: yh }), e(st);
    }, { once: !0 }), r.src = Se + "/", t.replaceChildren(r);
  }), me;
}
const Fe = (t, e, n) => Promise.race([
  t.request(e, n),
  new Promise((r, s) => setTimeout(() => s(new Error("The casino wallet is not answering. Reload the page.")), wh))
]), rr = (t) => {
  Pe && (Pe.hidden = !t);
};
async function mh() {
  return Fe(await zi(), "casino.status");
}
async function xh(t, e = !1) {
  const n = await zi();
  rr(!0);
  try {
    return await n.request("casino.open", { mode: t, anyPasskey: e });
  } finally {
    rr(!1);
  }
}
async function Sh() {
  if (st)
    try {
      await Fe(st, "casino.cancel");
    } catch {
    }
  rr(!1);
}
async function Eh() {
  if (st)
    try {
      await Fe(st, "casino.lock");
    } catch {
    }
}
async function Mi(t, e) {
  const n = await fetch(Ni + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) }), r = await n.json().catch(() => null);
  return { status: n.status, ok: n.ok, body: r };
}
async function Ah(t) {
  var r;
  const e = await Mi(`/extended/v1/address/${encodeURIComponent(t)}/nonces`), n = (r = e.body) == null ? void 0 : r.possible_next_nonce;
  if (!e.ok || !Number.isSafeInteger(n) || n < 0) throw zt("Could not read this wallet from the testnet. Nothing was sent; try again.");
  return BigInt(n);
}
const Bh = (t) => Uint8Array.from(t.replace(/^0x/, "").match(/../g), (e) => parseInt(e, 16));
async function Ch(t, e) {
  let n = !1;
  for (let r = 0; r < 3; r++) {
    let s;
    try {
      s = await fetch(Ni + "/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: Bh(t), signal: AbortSignal.timeout(15e3) });
    } catch {
      n = !0, await new Promise((c) => setTimeout(c, 1500 * (r + 1)));
      continue;
    }
    const i = await s.json().catch(() => null);
    if (s.ok && typeof i == "string" && i.replace(/^0x/, "") === e.replace(/^0x/, "")) return { txid: e };
    if (s.status >= 500) {
      n = !0, await new Promise((c) => setTimeout(c, 1500 * (r + 1)));
      continue;
    }
    if (!n) throw zt(`The testnet refused the transfer (${(i == null ? void 0 : i.reason) || s.status}). Nothing was sent.`);
    break;
  }
  return { txid: e, uncertain: !0 };
}
async function Ih(t) {
  if (!st) throw zt("Open your casino wallet first.");
  if (t.address === _i) throw zt("The exchange cannot pay itself.");
  const e = await Ah(t.address);
  let n;
  try {
    n = await Fe(st, "casino.signBuy", { stx: t.stx, fee: nr.toString(), nonce: e.toString() });
  } catch (s) {
    throw zt(s.message || "The casino wallet did not sign. Nothing was sent.");
  }
  let r;
  try {
    r = th(n.raw, { address: t.address, stx: t.stx, fee: nr, nonce: e });
  } catch (s) {
    throw zt(s.message);
  }
  if (r !== n.txid) throw zt("The casino wallet reported a different transaction. Nothing was sent.");
  return Ch(n.raw, r);
}
async function Th(t) {
  var n, r, s;
  let e;
  try {
    e = await Mi(`/extended/v1/faucets/stx?address=${encodeURIComponent(t)}`, { method: "POST" });
  } catch {
    throw new Error("The testnet faucet did not answer. Try again in a minute.");
  }
  if (e.status === 429) throw new Error("The testnet faucet is busy (one request a minute). Try again in a minute.");
  if (!e.ok || ((n = e.body) == null ? void 0 : n.success) !== !0 || typeof ((r = e.body) == null ? void 0 : r.txId) != "string")
    throw new Error(`The testnet faucet could not send STX right now (${((s = e.body) == null ? void 0 : s.error) || e.status}). Try again shortly.`);
  return e.body.txId;
}
async function vh(t) {
  if (!st) throw new Error("Open your casino wallet first.");
  const { signature: e } = await Fe(st, "casino.signRoomJoin", {
    address: t.address,
    network: t.network,
    nonce: t.nonce,
    expires: t.expires
  });
  if (!ph(t, e)) throw new Error("The casino wallet did not sign the room sign-in correctly. Nothing was sent.");
  return e;
}
_e.ParallaxPasskeyWallet = Object.freeze({
  version: "1.1.0",
  origin: Se,
  /** Network fee for one buy, in microSTX (add it to the amount when checking the balance). */
  fee: Number(nr),
  attach: bh,
  status: mh,
  open: xh,
  cancel: Sh,
  lock: Eh,
  buy: Ih,
  faucet: Th,
  signRoomJoin: vh
});
try {
  window.dispatchEvent(new Event("parallax-passkey-wallet"));
} catch {
}
