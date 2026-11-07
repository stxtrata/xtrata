var ww = Object.defineProperty;
var bw = (t, e, n) => e in t ? ww(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var go = (t, e, n) => bw(t, typeof e != "symbol" ? e + "" : e, n);
var hn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function B0(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function mc(t) {
  if (t.__esModule) return t;
  var e = t.default;
  if (typeof e == "function") {
    var n = function r() {
      return this instanceof r ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    n.prototype = e.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(t).forEach(function(r) {
    var i = Object.getOwnPropertyDescriptor(t, r);
    Object.defineProperty(n, r, i.get ? i : {
      enumerable: !0,
      get: function() {
        return t[r];
      }
    });
  }), n;
}
(function() {
  (function(t) {
    (function(e) {
      var n = typeof globalThis < "u" && globalThis || typeof t < "u" && t || // eslint-disable-next-line no-undef
      typeof hn < "u" && hn || {}, r = {
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
      function i(L) {
        return L && DataView.prototype.isPrototypeOf(L);
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
        ], o = ArrayBuffer.isView || function(L) {
          return L && s.indexOf(Object.prototype.toString.call(L)) > -1;
        };
      function a(L) {
        if (typeof L != "string" && (L = String(L)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(L) || L === "")
          throw new TypeError('Invalid character in header field name: "' + L + '"');
        return L.toLowerCase();
      }
      function c(L) {
        return typeof L != "string" && (L = String(L)), L;
      }
      function u(L) {
        var P = {
          next: function() {
            var b = L.shift();
            return { done: b === void 0, value: b };
          }
        };
        return r.iterable && (P[Symbol.iterator] = function() {
          return P;
        }), P;
      }
      function f(L) {
        this.map = {}, L instanceof f ? L.forEach(function(P, b) {
          this.append(b, P);
        }, this) : Array.isArray(L) ? L.forEach(function(P) {
          if (P.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + P.length);
          this.append(P[0], P[1]);
        }, this) : L && Object.getOwnPropertyNames(L).forEach(function(P) {
          this.append(P, L[P]);
        }, this);
      }
      f.prototype.append = function(L, P) {
        L = a(L), P = c(P);
        var b = this.map[L];
        this.map[L] = b ? b + ", " + P : P;
      }, f.prototype.delete = function(L) {
        delete this.map[a(L)];
      }, f.prototype.get = function(L) {
        return L = a(L), this.has(L) ? this.map[L] : null;
      }, f.prototype.has = function(L) {
        return this.map.hasOwnProperty(a(L));
      }, f.prototype.set = function(L, P) {
        this.map[a(L)] = c(P);
      }, f.prototype.forEach = function(L, P) {
        for (var b in this.map)
          this.map.hasOwnProperty(b) && L.call(P, this.map[b], b, this);
      }, f.prototype.keys = function() {
        var L = [];
        return this.forEach(function(P, b) {
          L.push(b);
        }), u(L);
      }, f.prototype.values = function() {
        var L = [];
        return this.forEach(function(P) {
          L.push(P);
        }), u(L);
      }, f.prototype.entries = function() {
        var L = [];
        return this.forEach(function(P, b) {
          L.push([b, P]);
        }), u(L);
      }, r.iterable && (f.prototype[Symbol.iterator] = f.prototype.entries);
      function l(L) {
        if (!L._noBody) {
          if (L.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          L.bodyUsed = !0;
        }
      }
      function w(L) {
        return new Promise(function(P, b) {
          L.onload = function() {
            P(L.result);
          }, L.onerror = function() {
            b(L.error);
          };
        });
      }
      function p(L) {
        var P = new FileReader(), b = w(P);
        return P.readAsArrayBuffer(L), b;
      }
      function x(L) {
        var P = new FileReader(), b = w(P), T = /charset=([A-Za-z0-9_-]+)/.exec(L.type), H = T ? T[1] : "utf-8";
        return P.readAsText(L, H), b;
      }
      function S(L) {
        for (var P = new Uint8Array(L), b = new Array(P.length), T = 0; T < P.length; T++)
          b[T] = String.fromCharCode(P[T]);
        return b.join("");
      }
      function M(L) {
        if (L.slice)
          return L.slice(0);
        var P = new Uint8Array(L.byteLength);
        return P.set(new Uint8Array(L)), P.buffer;
      }
      function j() {
        return this.bodyUsed = !1, this._initBody = function(L) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = L, L ? typeof L == "string" ? this._bodyText = L : r.blob && Blob.prototype.isPrototypeOf(L) ? this._bodyBlob = L : r.formData && FormData.prototype.isPrototypeOf(L) ? this._bodyFormData = L : r.searchParams && URLSearchParams.prototype.isPrototypeOf(L) ? this._bodyText = L.toString() : r.arrayBuffer && r.blob && i(L) ? (this._bodyArrayBuffer = M(L.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(L) || o(L)) ? this._bodyArrayBuffer = M(L) : this._bodyText = L = Object.prototype.toString.call(L) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof L == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(L) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var L = l(this);
          if (L)
            return L;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var L = l(this);
            return L || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
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
          var L = l(this);
          if (L)
            return L;
          if (this._bodyBlob)
            return x(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(S(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(N);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var z = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function A(L) {
        var P = L.toUpperCase();
        return z.indexOf(P) > -1 ? P : L;
      }
      function _(L, P) {
        if (!(this instanceof _))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        P = P || {};
        var b = P.body;
        if (L instanceof _) {
          if (L.bodyUsed)
            throw new TypeError("Already read");
          this.url = L.url, this.credentials = L.credentials, P.headers || (this.headers = new f(L.headers)), this.method = L.method, this.mode = L.mode, this.signal = L.signal, !b && L._bodyInit != null && (b = L._bodyInit, L.bodyUsed = !0);
        } else
          this.url = String(L);
        if (this.credentials = P.credentials || this.credentials || "same-origin", (P.headers || !this.headers) && (this.headers = new f(P.headers)), this.method = A(P.method || this.method || "GET"), this.mode = P.mode || this.mode || null, this.signal = P.signal || this.signal || function() {
          if ("AbortController" in n) {
            var C = new AbortController();
            return C.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && b)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(b), (this.method === "GET" || this.method === "HEAD") && (P.cache === "no-store" || P.cache === "no-cache")) {
          var T = /([?&])_=[^&]*/;
          if (T.test(this.url))
            this.url = this.url.replace(T, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var H = /\?/;
            this.url += (H.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      _.prototype.clone = function() {
        return new _(this, { body: this._bodyInit });
      };
      function N(L) {
        var P = new FormData();
        return L.trim().split("&").forEach(function(b) {
          if (b) {
            var T = b.split("="), H = T.shift().replace(/\+/g, " "), C = T.join("=").replace(/\+/g, " ");
            P.append(decodeURIComponent(H), decodeURIComponent(C));
          }
        }), P;
      }
      function Q(L) {
        var P = new f(), b = L.replace(/\r?\n[\t ]+/g, " ");
        return b.split("\r").map(function(T) {
          return T.indexOf(`
`) === 0 ? T.substr(1, T.length) : T;
        }).forEach(function(T) {
          var H = T.split(":"), C = H.shift().trim();
          if (C) {
            var ot = H.join(":").trim();
            try {
              P.append(C, ot);
            } catch (X) {
              console.warn("Response " + X.message);
            }
          }
        }), P;
      }
      j.call(_.prototype);
      function tt(L, P) {
        if (!(this instanceof tt))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (P || (P = {}), this.type = "default", this.status = P.status === void 0 ? 200 : P.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = P.statusText === void 0 ? "" : "" + P.statusText, this.headers = new f(P.headers), this.url = P.url || "", this._initBody(L);
      }
      j.call(tt.prototype), tt.prototype.clone = function() {
        return new tt(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new f(this.headers),
          url: this.url
        });
      }, tt.error = function() {
        var L = new tt(null, { status: 200, statusText: "" });
        return L.ok = !1, L.status = 0, L.type = "error", L;
      };
      var R = [301, 302, 303, 307, 308];
      tt.redirect = function(L, P) {
        if (R.indexOf(P) === -1)
          throw new RangeError("Invalid status code");
        return new tt(null, { status: P, headers: { location: L } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(P, b) {
          this.message = P, this.name = b;
          var T = Error(P);
          this.stack = T.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function K(L, P) {
        return new Promise(function(b, T) {
          var H = new _(L, P);
          if (H.signal && H.signal.aborted)
            return T(new e.DOMException("Aborted", "AbortError"));
          var C = new XMLHttpRequest();
          function ot() {
            C.abort();
          }
          C.onload = function() {
            var k = {
              statusText: C.statusText,
              headers: Q(C.getAllResponseHeaders() || "")
            };
            H.url.indexOf("file://") === 0 && (C.status < 200 || C.status > 599) ? k.status = 200 : k.status = C.status, k.url = "responseURL" in C ? C.responseURL : k.headers.get("X-Request-URL");
            var m = "response" in C ? C.response : C.responseText;
            setTimeout(function() {
              b(new tt(m, k));
            }, 0);
          }, C.onerror = function() {
            setTimeout(function() {
              T(new TypeError("Network request failed"));
            }, 0);
          }, C.ontimeout = function() {
            setTimeout(function() {
              T(new TypeError("Network request timed out"));
            }, 0);
          }, C.onabort = function() {
            setTimeout(function() {
              T(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function X(k) {
            try {
              return k === "" && n.location.href ? n.location.href : k;
            } catch {
              return k;
            }
          }
          if (C.open(H.method, X(H.url), !0), H.credentials === "include" ? C.withCredentials = !0 : H.credentials === "omit" && (C.withCredentials = !1), "responseType" in C && (r.blob ? C.responseType = "blob" : r.arrayBuffer && (C.responseType = "arraybuffer")), P && typeof P.headers == "object" && !(P.headers instanceof f || n.Headers && P.headers instanceof n.Headers)) {
            var Et = [];
            Object.getOwnPropertyNames(P.headers).forEach(function(k) {
              Et.push(a(k)), C.setRequestHeader(k, c(P.headers[k]));
            }), H.headers.forEach(function(k, m) {
              Et.indexOf(m) === -1 && C.setRequestHeader(m, k);
            });
          } else
            H.headers.forEach(function(k, m) {
              C.setRequestHeader(m, k);
            });
          H.signal && (H.signal.addEventListener("abort", ot), C.onreadystatechange = function() {
            C.readyState === 4 && H.signal.removeEventListener("abort", ot);
          }), C.send(typeof H._bodyInit > "u" ? null : H._bodyInit);
        });
      }
      return K.polyfill = !0, n.fetch || (n.fetch = K, n.Headers = f, n.Request = _, n.Response = tt), e.Headers = f, e.Request = _, e.Response = tt, e.fetch = K, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : hn);
})();
const mw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function xw(t, e) {
  const n = {};
  return Object.assign(n, mw, e), await fetch(t, n);
}
function Sw(t) {
  let e = xw, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Ew(...t) {
  const { fetchLib: e, middlewares: n } = Sw(t);
  return async (i, s) => {
    let o = { url: i, init: s ?? {} };
    for (const c of n)
      typeof c.pre == "function" && (o = await Promise.resolve(c.pre({
        fetch: e,
        ...o
      })) ?? o);
    let a = await e(o.url, o.init);
    for (const c of n)
      typeof c.post == "function" && (a = await Promise.resolve(c.post({
        fetch: e,
        url: o.url,
        init: o.init,
        response: (a == null ? void 0 : a.clone()) ?? a
      })) ?? a);
    return a;
  };
}
var ji;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ji || (ji = {}));
var Rs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Rs || (Rs = {}));
var Zf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Zf || (Zf = {}));
const Aw = "https://api.mainnet.hiro.so", vw = "https://api.testnet.hiro.so", kw = "http://localhost:3999", $w = ["mainnet", "testnet", "devnet", "mocknet"];
let zi = class {
  constructor(e) {
    this.version = Rs.Mainnet, this.chainId = ji.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Rs.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, i) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(i)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, i) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${i}?proof=0`, this.getMapEntryUrl = (n, r, i) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${i}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Ew();
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
};
zi.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Il();
    case "testnet":
      return new Iw();
    case "devnet":
      return new Lw();
    case "mocknet":
      return new M0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${$w.join(", ")}`);
  }
};
zi.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : zi.fromName(t);
let Il = class extends zi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Aw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Rs.Mainnet, this.chainId = ji.Mainnet;
  }
}, Iw = class extends zi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? vw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Rs.Testnet, this.chainId = ji.Testnet;
  }
}, M0 = class extends zi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? kw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Rs.Testnet, this.chainId = ji.Testnet;
  }
};
const Lw = M0, N0 = "xtrata.wallet.bridge.v1", Cw = (t) => typeof t == "object" && t !== null && t.protocol === N0, Tw = (t) => Cw(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", Bw = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class yo extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const Qf = 12e4;
class Mw {
  constructor(e) {
    go(this, "pending", /* @__PURE__ */ new Map());
    go(this, "listenTarget");
    go(this, "closed", !1);
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
    go(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !Tw(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new yo("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new yo("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new yo("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const i = Bw(), s = { protocol: N0, kind: "request", id: i, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(i), a(
          new yo(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? Qf}ms.`
          )
        );
      }, this.options.timeoutMs ?? Qf);
      this.pending.set(i, { resolve: o, reject: a, timer: c }), r.postMessage(s, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new yo("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const Nw = ["SP", "SM"], Pw = ["ST", "SN"], _w = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return Nw.includes(n) ? "mainnet" : Pw.includes(n) ? "testnet" : null;
}, Uw = () => {
  const t = /* @__PURE__ */ new Map();
  return {
    getItem: (e) => t.get(e) ?? null,
    setItem: (e, n) => {
      t.set(e, n);
    },
    removeItem: (e) => {
      t.delete(e);
    }
  };
}, Hw = () => typeof window > "u" || !window.localStorage ? Uw() : window.localStorage, Xc = "xtrata.v15.1.wallet.session", Jf = "mainnet", za = { isConnected: !1 }, Ow = (t) => t.address ? _w(t.address) ?? t.network : t.network, P0 = (t) => !t.isConnected || !t.address ? { ...za } : Ow(t) !== Jf ? { ...za } : {
  isConnected: !0,
  address: t.address,
  network: Jf,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, Dw = (t) => {
  if (!t)
    return { ...za };
  try {
    const e = JSON.parse(t);
    return P0(e);
  } catch {
    return { ...za };
  }
}, Fw = (t) => {
  const e = P0(t);
  return JSON.stringify(e);
}, jw = (t) => {
  const e = Hw();
  return {
    load: () => Dw(e.getItem(Xc)),
    save: (n) => {
      e.setItem(Xc, Fw(n));
    },
    clear: () => {
      e.removeItem(Xc);
    }
  };
}, zw = "https://browser.blockstack.org/auth", Rw = {
  "@type": "Person",
  "@context": "http://schema.org"
}, _0 = ["store_write"], Gw = "blockstack-session", Kw = {
  logLevel: "debug"
}, oi = {
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
Object.freeze(oi);
class io extends Error {
  constructor(e) {
    super();
    let n = e.message, r = `Error Code: ${e.code}`, i = this.stack;
    if (i)
      r += `Stack Trace:
${i}`;
    else
      try {
        throw new Error();
      } catch (s) {
        i = s.stack;
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
class Vw extends io {
  constructor(e, n = "") {
    super({ code: oi.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class td extends io {
  constructor(e = "") {
    super({ code: oi.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class ea extends io {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: oi.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class ed extends io {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: oi.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Ll extends io {
  constructor(e) {
    super({ code: oi.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class U0 extends io {
  constructor(e) {
    super({ code: oi.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const nd = ["debug", "info", "warn", "error", "none"], Cl = {};
for (let t = 0; t < nd.length; t++) {
  const e = nd[t];
  Cl[e] = t;
}
class Mi {
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
    return Cl[Kw.logLevel] <= Cl[e];
  }
}
function qw() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Ww() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Yc(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((i) => parseInt(i, 10)), r = e.split(".").map((i) => parseInt(i, 10));
  for (let i = 0; i < e.length; i++)
    if (i >= t.length && r.push(0), n[i] < r[i])
      return !1;
  return !0;
}
function Xw() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Yw() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Zw(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function _u(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let i;
  try {
    if (i = Yw(), i) {
      const s = i[t];
      if (s)
        return s;
    }
  } catch (s) {
    Mi.error(`Error getting object '${t}' from global scope '${i}': ${s}`);
  }
  if (e) {
    const s = Zw(i, t.toString(), n);
    throw Mi.error(s), new Error(s);
  }
  if (r)
    return {};
}
function ks(t, e) {
  return Uu(an(t), e);
}
function an(t) {
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
  if (vn(t, Uint8Array))
    return BigInt(`0x${pt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Qw(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function rd(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Ro(t, e = 8) {
  return (typeof t == "bigint" ? t : an(t)).toString(16).padStart(e * 2, "0");
}
function xc(t) {
  return parseInt(t, 16);
}
function Uu(t, e = 16) {
  const n = Ro(t, e);
  return Kt(n);
}
function Jw(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function tb(t, e) {
  return t & BigInt(1) << e;
}
function Tl(t) {
  return eb(BigInt(`0x${pt(t)}`), BigInt(t.byteLength * 8));
}
function eb(t, e) {
  return tb(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const nb = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function pt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += nb[n];
  return e;
}
function Kt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Qw(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, i = t.slice(r, r + 2), s = Number.parseInt(i, 16);
    if (Number.isNaN(s) || s < 0)
      throw new Error("Invalid byte sequence");
    e[n] = s;
  }
  return e;
}
function ai(t) {
  return new TextEncoder().encode(t);
}
function Go(t) {
  return new TextDecoder().decode(t);
}
function rb(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function sb(t) {
  return String.fromCharCode.apply(null, t);
}
function ib(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function sd(t) {
  if (t.some(ib))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Er(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, i) => r + i.length, 0), n = new Uint8Array(e);
  for (let r = 0, i = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
function Ue(t) {
  return Er(...t.map((e) => typeof e == "number" ? sd([e]) : e instanceof Array ? sd(e) : e));
}
function vn(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const H0 = "https://api.mainnet.hiro.so", O0 = "https://api.testnet.hiro.so", D0 = "http://localhost:3999", ob = "https://hub.blockstack.org", ab = 33, Zc = 32;
function cb(t) {
  if (t.length < Zc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Zc * 2), r = t.slice(2 + Zc * 2);
  return {
    recoveryId: xc(e),
    r: n,
    s: r
  };
}
function Hu(t) {
  const e = typeof t == "string" ? Kt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function lb(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function ub(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function fb(t, e) {
  return t[e];
}
function db(t, e, n = 0) {
  return t[n] = e, t;
}
function hb(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Gs(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const pb = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function gb(t, e) {
  const n = {};
  return Object.assign(n, pb, e), await fetch(t, n);
}
function yb(t) {
  let e = gb, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function wb(...t) {
  const { fetchLib: e, middlewares: n } = yb(t);
  return async (i, s) => {
    let o = { url: i, init: s ?? {} };
    for (const c of n)
      typeof c.pre == "function" && (o = await Promise.resolve(c.pre({
        fetch: e,
        ...o
      })) ?? o);
    let a = await e(o.url, o.init);
    for (const c of n)
      typeof c.post == "function" && (a = await Promise.resolve(c.post({
        fetch: e,
        url: o.url,
        init: o.init,
        response: (a == null ? void 0 : a.clone()) ?? a
      })) ?? a);
    return a;
  };
}
class F0 {
  constructor(e = _0.slice(), n = ((a) => (a = _u("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", i = "/manifest.json", s = void 0, o = zw) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = i, this.coreNode = s, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Bl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function bb(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function j0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function mb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Bl(t.outputLen), Bl(t.blockLen);
}
function xb(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Sb(t, e) {
  j0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ns = {
  number: Bl,
  bool: bb,
  bytes: j0,
  hash: mb,
  exists: xb,
  output: Sb
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Qc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), lr = (t, e) => t << 32 - e | t >>> e, Eb = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Eb)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ab(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Ou(t) {
  if (typeof t == "string" && (t = Ab(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let z0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ci(t) {
  const e = (r) => t().update(Ou(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let R0 = class extends z0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ns.hash(e);
    const r = Ou(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const i = this.blockLen, s = new Uint8Array(i);
    s.set(r.length > i ? e.create().update(r).digest() : r);
    for (let o = 0; o < s.length; o++)
      s[o] ^= 54;
    this.iHash.update(s), this.oHash = e.create();
    for (let o = 0; o < s.length; o++)
      s[o] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(e) {
    return Ns.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Ns.exists(this), Ns.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: i, destroyed: s, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = i, e.destroyed = s, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Sc = (t, e, n) => new R0(t, e).update(n).digest();
Sc.create = (t, e) => new R0(t, e);
function vb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Du = class extends z0 {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Qc(this.buffer);
  }
  update(e) {
    Ns.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Ou(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Qc(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ns.exists(this), Ns.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    vb(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Qc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, f[l], s);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: a } = this;
    return e.length = i, e.pos = a, e.finished = s, e.destroyed = o, i % n && e.buffer.set(r), e;
  }
};
const kb = (t, e, n) => t & e ^ ~t & n, $b = (t, e, n) => t & e ^ t & n ^ e & n, Ib = new Uint32Array([
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
]), Wr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Xr = new Uint32Array(64);
let G0 = class extends Du {
  constructor() {
    super(64, 32, 8, !1), this.A = Wr[0] | 0, this.B = Wr[1] | 0, this.C = Wr[2] | 0, this.D = Wr[3] | 0, this.E = Wr[4] | 0, this.F = Wr[5] | 0, this.G = Wr[6] | 0, this.H = Wr[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: i, E: s, F: o, G: a, H: c } = this;
    return [e, n, r, i, s, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      Xr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const w = Xr[l - 15], p = Xr[l - 2], x = lr(w, 7) ^ lr(w, 18) ^ w >>> 3, S = lr(p, 17) ^ lr(p, 19) ^ p >>> 10;
      Xr[l] = S + Xr[l - 7] + x + Xr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const w = lr(a, 6) ^ lr(a, 11) ^ lr(a, 25), p = f + w + kb(a, c, u) + Ib[l] + Xr[l] | 0, S = (lr(r, 2) ^ lr(r, 13) ^ lr(r, 22)) + $b(r, i, s) | 0;
      f = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + S | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, i, s, o, a, c, u, f);
  }
  roundClean() {
    Xr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Lb = class extends G0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Ri = ci(() => new G0());
ci(() => new Lb());
const Cb = {}, K0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Cb
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Ft = BigInt(0), pe = BigInt(1), xs = BigInt(2), ko = BigInt(3), id = BigInt(8), Jt = Object.freeze({
  a: Ft,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: pe,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), od = (t, e) => (t + e / xs) / e, na = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = Jt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -pe * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), i = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), s = n, o = BigInt("0x100000000000000000000000000000000"), a = od(s * t, e), c = od(-r * t, e);
    let u = et(t - a * n - c * i, e), f = et(-a * r - c * s, e);
    const l = u > o, w = f > o;
    if (l && (u = e - u), w && (f = e - f), u > o || f > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: w, k2: f };
  }
}, tr = 32, Ks = 32, V0 = 32, Ra = tr + 1, Ga = 2 * tr + 1;
function ad(t) {
  const { a: e, b: n } = Jt, r = et(t * t), i = et(r * t);
  return et(i + e * t + n);
}
const ra = Jt.a === Ft;
class Fu extends Error {
  constructor(e) {
    super(e);
  }
}
function cd(t) {
  if (!(t instanceof Wt))
    throw new TypeError("JacobianPoint expected");
}
class Wt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof Ut))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(Ut.ZERO) ? Wt.ZERO : new Wt(e.x, e.y, pe);
  }
  static toAffineBatch(e) {
    const n = Pb(e.map((r) => r.z));
    return e.map((r, i) => r.toAffine(n[i]));
  }
  static normalizeZ(e) {
    return Wt.toAffineBatch(e).map(Wt.fromAffine);
  }
  equals(e) {
    cd(e);
    const { x: n, y: r, z: i } = this, { x: s, y: o, z: a } = e, c = et(i * i), u = et(a * a), f = et(n * u), l = et(s * c), w = et(et(r * a) * u), p = et(et(o * i) * c);
    return f === l && w === p;
  }
  negate() {
    return new Wt(this.x, et(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, i = et(e * e), s = et(n * n), o = et(s * s), a = e + s, c = et(xs * (et(a * a) - i - o)), u = et(ko * i), f = et(u * u), l = et(f - xs * c), w = et(u * (c - l) - id * o), p = et(xs * n * r);
    return new Wt(l, w, p);
  }
  add(e) {
    cd(e);
    const { x: n, y: r, z: i } = this, { x: s, y: o, z: a } = e;
    if (s === Ft || o === Ft)
      return this;
    if (n === Ft || r === Ft)
      return e;
    const c = et(i * i), u = et(a * a), f = et(n * u), l = et(s * c), w = et(et(r * a) * u), p = et(et(o * i) * c), x = et(l - f), S = et(p - w);
    if (x === Ft)
      return S === Ft ? this.double() : Wt.ZERO;
    const M = et(x * x), j = et(x * M), z = et(f * M), A = et(S * S - j - xs * z), _ = et(S * (z - A) - w * j), N = et(i * a * x);
    return new Wt(A, _, N);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = Wt.ZERO;
    if (typeof e == "bigint" && e === Ft)
      return n;
    let r = fd(e);
    if (r === pe)
      return this;
    if (!ra) {
      let l = n, w = this;
      for (; r > Ft; )
        r & pe && (l = l.add(w)), w = w.double(), r >>= pe;
      return l;
    }
    let { k1neg: i, k1: s, k2neg: o, k2: a } = na.splitScalar(r), c = n, u = n, f = this;
    for (; s > Ft || a > Ft; )
      s & pe && (c = c.add(f)), a & pe && (u = u.add(f)), f = f.double(), s >>= pe, a >>= pe;
    return i && (c = c.negate()), o && (u = u.negate()), u = new Wt(et(u.x * na.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = ra ? 128 / e + 1 : 256 / e + 1, r = [];
    let i = this, s = i;
    for (let o = 0; o < n; o++) {
      s = i, r.push(s);
      for (let a = 1; a < 2 ** (e - 1); a++)
        s = s.add(i), r.push(s);
      i = s.double();
    }
    return r;
  }
  wNAF(e, n) {
    !n && this.equals(Wt.BASE) && (n = Ut.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let i = n && Ml.get(n);
    i || (i = this.precomputeWindow(r), n && r !== 1 && (i = Wt.normalizeZ(i), Ml.set(n, i)));
    let s = Wt.ZERO, o = Wt.BASE;
    const a = 1 + (ra ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), f = 2 ** r, l = BigInt(r);
    for (let w = 0; w < a; w++) {
      const p = w * c;
      let x = Number(e & u);
      e >>= l, x > c && (x -= f, e += pe);
      const S = p, M = p + Math.abs(x) - 1, j = w % 2 !== 0, z = x < 0;
      x === 0 ? o = o.add(sa(j, i[S])) : s = s.add(sa(z, i[M]));
    }
    return { p: s, f: o };
  }
  multiply(e, n) {
    let r = fd(e), i, s;
    if (ra) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = na.splitScalar(r);
      let { p: f, f: l } = this.wNAF(a, n), { p: w, f: p } = this.wNAF(u, n);
      f = sa(o, f), w = sa(c, w), w = new Wt(et(w.x * na.beta), w.y, w.z), i = f.add(w), s = l.add(p);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      i = o, s = a;
    }
    return Wt.normalizeZ([i, s])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: i } = this, s = this.equals(Wt.ZERO);
    e == null && (e = s ? id : oo(i));
    const o = e, a = et(o * o), c = et(a * o), u = et(n * a), f = et(r * c), l = et(i * o);
    if (s)
      return Ut.ZERO;
    if (l !== pe)
      throw new Error("invZ was invalid");
    return new Ut(u, f);
  }
}
Wt.BASE = new Wt(Jt.Gx, Jt.Gy, pe);
Wt.ZERO = new Wt(Ft, pe, Ft);
function sa(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Ml = /* @__PURE__ */ new WeakMap();
class Ut {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Ml.delete(this);
  }
  hasEvenY() {
    return this.y % xs === Ft;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = _n(n ? e : e.subarray(1));
    if (!Na(r))
      throw new Error("Point is not on curve");
    const i = ad(r);
    let s = Nb(i);
    const o = (s & pe) === pe;
    n ? o && (s = et(-s)) : (e[0] & 1) === 1 !== o && (s = et(-s));
    const a = new Ut(r, s);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = _n(e.subarray(1, tr + 1)), r = _n(e.subarray(tr + 1, tr * 2 + 1)), i = new Ut(n, r);
    return i.assertValidity(), i;
  }
  static fromHex(e) {
    const n = Ar(e), r = n.length, i = n[0];
    if (r === tr)
      return this.fromCompressedHex(n);
    if (r === Ra && (i === 2 || i === 3))
      return this.fromCompressedHex(n);
    if (r === Ga && i === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Ra} compressed bytes or ${Ga} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Ut.BASE.multiply(Vs(e));
  }
  static fromSignature(e, n, r) {
    const { r: i, s } = X0(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = ju(Ar(e)), { n: a } = Jt, c = r === 2 || r === 3 ? i + a : i, u = oo(c, a), f = et(-o * u, a), l = et(s * u, a), w = r & 1 ? "03" : "02", p = Ut.fromHex(w + Ss(c)), x = Ut.BASE.multiplyAndAddUnsafe(p, f, l);
    if (!x)
      throw new Error("Cannot recover signature: point at infinify");
    return x.assertValidity(), x;
  }
  toRawBytes(e = !1) {
    return Es(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Ss(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Ss(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Na(n) || !Na(r))
      throw new Error(e);
    const i = et(r * r), s = ad(n);
    if (et(i - s) !== Ft)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new Ut(this.x, et(-this.y));
  }
  double() {
    return Wt.fromAffine(this).double().toAffine();
  }
  add(e) {
    return Wt.fromAffine(this).add(Wt.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return Wt.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const i = Wt.fromAffine(this), s = n === Ft || n === pe || this !== Ut.BASE ? i.multiplyUnsafe(n) : i.multiply(n), o = Wt.fromAffine(e).multiplyUnsafe(r), a = s.add(o);
    return a.equals(Wt.ZERO) ? void 0 : a.toAffine();
  }
}
Ut.BASE = new Ut(Jt.Gx, Jt.Gy);
Ut.ZERO = new Ut(Ft, Ft);
function ld(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function ud(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Gi(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: _n(n), left: t.subarray(e + 2) };
}
function Tb(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Gi(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = ud(t.subarray(2)), { data: r, left: i } = ud(n);
  if (i.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Gi(i)}`);
  return { r: e, s: r };
}
class Pn {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const i = n ? Gi(e) : e;
    if (i.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Pn(Ka(i.slice(0, 64)), Ka(i.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s: i } = Tb(n ? e : Es(e));
    return new Pn(r, i);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Vi(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Vi(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = Jt.n >> pe;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Pn(this.r, et(-this.s, Jt.n)) : this;
  }
  toDERRawBytes() {
    return Es(this.toDERHex());
  }
  toDERHex() {
    const e = ld(wo(this.s)), n = ld(wo(this.r)), r = e.length / 2, i = n.length / 2, s = wo(r), o = wo(i);
    return `30${wo(i + r + 4)}02${o}${n}02${s}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Es(this.toCompactHex());
  }
  toCompactHex() {
    return Ss(this.r) + Ss(this.s);
  }
}
function bs(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, i) => r + i.length, 0), n = new Uint8Array(e);
  for (let r = 0, i = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
const Bb = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Gi(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Bb[t[n]];
  return e;
}
const Mb = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Ss(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Ft <= t && t < Mb))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Ki(t) {
  const e = Es(Ss(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function wo(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Ka(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function Es(t) {
  if (typeof t != "string")
    throw new TypeError("hexToBytes: expected string, got " + typeof t);
  if (t.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + t.length);
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, i = t.slice(r, r + 2), s = Number.parseInt(i, 16);
    if (Number.isNaN(s) || s < 0)
      throw new Error("Invalid byte sequence");
    e[n] = s;
  }
  return e;
}
function _n(t) {
  return Ka(Gi(t));
}
function Ar(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Es(t);
}
function fd(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Vi(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function et(t, e = Jt.P) {
  const n = t % e;
  return n >= Ft ? n : e + n;
}
function Dn(t, e) {
  const { P: n } = Jt;
  let r = t;
  for (; e-- > Ft; )
    r *= r, r %= n;
  return r;
}
function Nb(t) {
  const { P: e } = Jt, n = BigInt(6), r = BigInt(11), i = BigInt(22), s = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, f = Dn(u, ko) * u % e, l = Dn(f, ko) * u % e, w = Dn(l, xs) * c % e, p = Dn(w, r) * w % e, x = Dn(p, i) * p % e, S = Dn(x, o) * x % e, M = Dn(S, a) * S % e, j = Dn(M, o) * x % e, z = Dn(j, ko) * u % e, A = Dn(z, s) * p % e, _ = Dn(A, n) * c % e, N = Dn(_, xs);
  if (N * N % e !== t)
    throw new Error("Cannot find square root");
  return N;
}
function oo(t, e = Jt.P) {
  if (t === Ft || e <= Ft)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = et(t, e), r = e, i = Ft, s = pe;
  for (; n !== Ft; ) {
    const a = r / n, c = r % n, u = i - s * a;
    r = n, n = c, i = s, s = u;
  }
  if (r !== pe)
    throw new Error("invert: does not exist");
  return et(i, e);
}
function Pb(t, e = Jt.P) {
  const n = new Array(t.length), r = t.reduce((s, o, a) => o === Ft ? s : (n[a] = s, et(s * o, e)), pe), i = oo(r, e);
  return t.reduceRight((s, o, a) => o === Ft ? s : (n[a] = et(s * n[a], e), et(s * o, e)), i), n;
}
function _b(t) {
  const e = t.length * 8 - Ks * 8, n = _n(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function ju(t, e = !1) {
  const n = _b(t);
  if (e)
    return n;
  const { n: r } = Jt;
  return n >= r ? n - r : n;
}
let Oi, $o;
class q0 {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return Be.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return $o(this.k, ...e);
  }
  checkSync() {
    if (typeof $o != "function")
      throw new Fu("hmacSha256Sync needs to be set");
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
    return bs(...n);
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
    return bs(...n);
  }
}
function Vi(t) {
  return Ft < t && t < Jt.n;
}
function Na(t) {
  return Ft < t && t < Jt.P;
}
function W0(t, e, n, r = !0) {
  const { n: i } = Jt, s = ju(t, !0);
  if (!Vi(s))
    return;
  const o = oo(s, i), a = Ut.BASE.multiply(s), c = et(a.x, i);
  if (c === Ft)
    return;
  const u = et(o * et(e + n * c, i), i);
  if (u === Ft)
    return;
  let f = new Pn(c, u), l = (a.x === f.r ? 0 : 2) | Number(a.y & pe);
  return r && f.hasHighS() && (f = f.normalizeS(), l ^= 1), { sig: f, recovery: l };
}
function Vs(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Ks)
      throw new Error("Expected 32 bytes of private key");
    e = Ka(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Ks)
      throw new Error("Expected 32 bytes of private key");
    e = _n(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Vi(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function zu(t) {
  return t instanceof Ut ? (t.assertValidity(), t) : Ut.fromHex(t);
}
function X0(t) {
  if (t instanceof Pn)
    return t.assertValidity(), t;
  try {
    return Pn.fromDER(t);
  } catch {
    return Pn.fromCompact(t);
  }
}
function Ko(t, e = !1) {
  return Ut.fromPrivateKey(t).toRawBytes(e);
}
function Ub(t, e, n, r = !1) {
  return Ut.fromSignature(t, e, n).toRawBytes(r);
}
function dd(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === Ra || r === Ga : n ? r === Ra * 2 || r === Ga * 2 : t instanceof Ut;
}
function Ru(t, e, n = !1) {
  if (dd(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!dd(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = zu(e);
  return r.assertValidity(), r.multiply(Vs(t)).toRawBytes(n);
}
function Y0(t) {
  const e = t.length > tr ? t.slice(0, tr) : t;
  return _n(e);
}
function Hb(t) {
  const e = Y0(t), n = et(e, Jt.n);
  return Z0(n < Ft ? e : n);
}
function Z0(t) {
  return Ki(t);
}
function Q0(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Ar(t), i = Vs(e), s = [Z0(i), Hb(r)];
  if (n != null) {
    n === !0 && (n = Be.randomBytes(tr));
    const c = Ar(n);
    if (c.length !== tr)
      throw new Error(`sign: Expected ${tr} bytes of extra data`);
    s.push(c);
  }
  const o = bs(...s), a = Y0(r);
  return { seed: o, m: a, d: i };
}
function J0(t, e) {
  const { sig: n, recovery: r } = t, { der: i, recovered: s } = Object.assign({ canonical: !0, der: !0 }, e), o = i ? n.toDERRawBytes() : n.toCompactRawBytes();
  return s ? [o, r] : o;
}
async function Ob(t, e, n = {}) {
  const { seed: r, m: i, d: s } = Q0(t, e, n.extraEntropy), o = new q0(V0, Ks);
  await o.reseed(r);
  let a;
  for (; !(a = W0(await o.generate(), i, s, n.canonical)); )
    await o.reseed();
  return J0(a, n);
}
function Ec(t, e, n = {}) {
  const { seed: r, m: i, d: s } = Q0(t, e, n.extraEntropy), o = new q0(V0, Ks);
  o.reseedSync(r);
  let a;
  for (; !(a = W0(o.generateSync(), i, s, n.canonical)); )
    o.reseedSync();
  return J0(a, n);
}
const Db = { strict: !0 };
function Fb(t, e, n, r = Db) {
  let i;
  try {
    i = X0(t), e = Ar(e);
  } catch {
    return !1;
  }
  const { r: s, s: o } = i;
  if (r.strict && i.hasHighS())
    return !1;
  const a = ju(e);
  let c;
  try {
    c = zu(n);
  } catch {
    return !1;
  }
  const { n: u } = Jt, f = oo(o, u), l = et(a * f, u), w = et(s * f, u), p = Ut.BASE.multiplyAndAddUnsafe(c, l, w);
  return p ? et(p.x, u) === s : !1;
}
function Va(t) {
  return et(_n(t), Jt.n);
}
class qi {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Ar(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = _n(n.subarray(0, 32)), i = _n(n.subarray(32, 64));
    return new qi(r, i);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Na(e) || !Vi(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Ss(this.r) + Ss(this.s);
  }
  toRawBytes() {
    return Es(this.toHex());
  }
}
function jb(t) {
  return Ut.fromPrivateKey(t).toRawX();
}
class tp {
  constructor(e, n, r = Be.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Ar(e);
    const { x: i, scalar: s } = this.getScalar(Vs(n));
    if (this.px = i, this.d = s, this.rand = Ar(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = Ut.fromPrivateKey(e), r = n.hasEvenY() ? e : Jt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Ki(e ^ _n(n));
  }
  finalizeNonce(e) {
    const n = et(_n(e), Jt.n);
    if (n === Ft)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: i, scalar: s } = this.getScalar(n);
    return { R: r, rx: i, k: s };
  }
  finalizeSig(e, n, r, i) {
    return new qi(e.x, et(n + r * i, Jt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: i } = this, s = Be.taggedHash, o = this.initNonce(n, await s(ws.aux, i)), { R: a, rx: c, k: u } = this.finalizeNonce(await s(ws.nonce, o, r, e)), f = Va(await s(ws.challenge, c, r, e)), l = this.finalizeSig(a, u, f, n);
    return await rp(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: i } = this, s = Be.taggedHashSync, o = this.initNonce(n, s(ws.aux, i)), { R: a, rx: c, k: u } = this.finalizeNonce(s(ws.nonce, o, r, e)), f = Va(s(ws.challenge, c, r, e)), l = this.finalizeSig(a, u, f, n);
    return sp(l, e, r) || this.error(), l;
  }
}
async function zb(t, e, n) {
  return new tp(t, e, n).calc();
}
function Rb(t, e, n) {
  return new tp(t, e, n).calcSync();
}
function ep(t, e, n) {
  const r = t instanceof qi, i = r ? t : qi.fromHex(t);
  return r && i.assertValidity(), {
    ...i,
    m: Ar(e),
    P: zu(n)
  };
}
function np(t, e, n, r) {
  const i = Ut.BASE.multiplyAndAddUnsafe(e, Vs(n), et(-r, Jt.n));
  return !(!i || !i.hasEvenY() || i.x !== t);
}
async function rp(t, e, n) {
  try {
    const { r, s: i, m: s, P: o } = ep(t, e, n), a = Va(await Be.taggedHash(ws.challenge, Ki(r), o.toRawX(), s));
    return np(r, o, i, a);
  } catch {
    return !1;
  }
}
function sp(t, e, n) {
  try {
    const { r, s: i, m: s, P: o } = ep(t, e, n), a = Va(Be.taggedHashSync(ws.challenge, Ki(r), o.toRawX(), s));
    return np(r, o, i, a);
  } catch (r) {
    if (r instanceof Fu)
      throw r;
    return !1;
  }
}
const Gb = {
  Signature: qi,
  getPublicKey: jb,
  sign: zb,
  verify: rp,
  signSync: Rb,
  verifySync: sp
};
Ut.BASE._setWindowSize(8);
const Ln = {
  node: K0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, ws = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, ia = {}, Be = {
  bytesToHex: Gi,
  hexToBytes: Es,
  concatBytes: bs,
  mod: et,
  invert: oo,
  isValidPrivateKey(t) {
    try {
      return Vs(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Ki,
  _normalizePrivateKey: Vs,
  hashToPrivateKey: (t) => {
    t = Ar(t);
    const e = Ks + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = et(_n(t), Jt.n - pe) + pe;
    return Ki(n);
  },
  randomBytes: (t = 32) => {
    if (Ln.web)
      return Ln.web.getRandomValues(new Uint8Array(t));
    if (Ln.node) {
      const { randomBytes: e } = Ln.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Be.hashToPrivateKey(Be.randomBytes(Ks + 8)),
  precompute(t = 8, e = Ut.BASE) {
    const n = e === Ut.BASE ? e : new Ut(e.x, e.y);
    return n._setWindowSize(t), n.multiply(ko), n;
  },
  sha256: async (...t) => {
    if (Ln.web) {
      const e = await Ln.web.subtle.digest("SHA-256", bs(...t));
      return new Uint8Array(e);
    } else if (Ln.node) {
      const { createHash: e } = Ln.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Ln.web) {
      const n = await Ln.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = bs(...e), i = await Ln.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(i);
    } else if (Ln.node) {
      const { createHmac: n } = Ln.node, r = n("sha256", t);
      return e.forEach((i) => r.update(i)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = ia[t];
    if (n === void 0) {
      const r = await Be.sha256(Uint8Array.from(t, (i) => i.charCodeAt(0)));
      n = bs(r, r), ia[t] = n;
    }
    return Be.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Oi != "function")
      throw new Fu("sha256Sync is undefined, you need to set it");
    let n = ia[t];
    if (n === void 0) {
      const r = Oi(Uint8Array.from(t, (i) => i.charCodeAt(0)));
      n = bs(r, r), ia[t] = n;
    }
    return Oi(n, ...e);
  },
  _JacobianPoint: Wt
};
Object.defineProperties(Be, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Oi;
    },
    set(t) {
      Oi || (Oi = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return $o;
    },
    set(t) {
      $o || ($o = t);
    }
  }
});
const Kb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: Jt,
  Point: Ut,
  Signature: Pn,
  getPublicKey: Ko,
  getSharedSecret: Ru,
  recoverPublicKey: Ub,
  schnorr: Gb,
  sign: Ob,
  signSync: Ec,
  utils: Be,
  verify: Fb
}, Symbol.toStringTag, { value: "Module" }));
var Vo = {};
Vo.byteLength = Yb;
var Vb = Vo.toByteArray = Qb, qb = Vo.fromByteArray = em, gr = [], zn = [], Wb = typeof Uint8Array < "u" ? Uint8Array : Array, Jc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var ki = 0, Xb = Jc.length; ki < Xb; ++ki)
  gr[ki] = Jc[ki], zn[Jc.charCodeAt(ki)] = ki;
zn[45] = 62;
zn[95] = 63;
function ip(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Yb(t) {
  var e = ip(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Zb(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Qb(t) {
  var e, n = ip(t), r = n[0], i = n[1], s = new Wb(Zb(t, r, i)), o = 0, a = i > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = zn[t.charCodeAt(c)] << 18 | zn[t.charCodeAt(c + 1)] << 12 | zn[t.charCodeAt(c + 2)] << 6 | zn[t.charCodeAt(c + 3)], s[o++] = e >> 16 & 255, s[o++] = e >> 8 & 255, s[o++] = e & 255;
  return i === 2 && (e = zn[t.charCodeAt(c)] << 2 | zn[t.charCodeAt(c + 1)] >> 4, s[o++] = e & 255), i === 1 && (e = zn[t.charCodeAt(c)] << 10 | zn[t.charCodeAt(c + 1)] << 4 | zn[t.charCodeAt(c + 2)] >> 2, s[o++] = e >> 8 & 255, s[o++] = e & 255), s;
}
function Jb(t) {
  return gr[t >> 18 & 63] + gr[t >> 12 & 63] + gr[t >> 6 & 63] + gr[t & 63];
}
function tm(t, e, n) {
  for (var r, i = [], s = e; s < n; s += 3)
    r = (t[s] << 16 & 16711680) + (t[s + 1] << 8 & 65280) + (t[s + 2] & 255), i.push(Jb(r));
  return i.join("");
}
function em(t) {
  for (var e, n = t.length, r = n % 3, i = [], s = 16383, o = 0, a = n - r; o < a; o += s)
    i.push(tm(t, o, o + s > a ? a : o + s));
  return r === 1 ? (e = t[n - 1], i.push(
    gr[e >> 2] + gr[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], i.push(
    gr[e >> 10] + gr[e >> 4 & 63] + gr[e << 2 & 63] + "="
  )), i.join("");
}
function nm() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const rm = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function sm() {
  if (nm())
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
    throw new Error(rm);
  }
}
class im {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, i) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const s = this.createCipher(e, n, r), o = new Uint8Array(Er(s.update(i), s.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, i) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const s = this.createDecipher(e, n, r), o = new Uint8Array(Er(s.update(i), s.final()));
    return Promise.resolve(o);
  }
}
class om {
  constructor(e) {
    this.subtleCrypto = e;
  }
  async encrypt(e, n, r, i) {
    let s, o;
    if (e === "aes-128-cbc")
      s = "AES-CBC", o = 128;
    else if (e === "aes-256-cbc")
      s = "AES-CBC", o = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: s, length: o }, !1, ["encrypt"]), c = await this.subtleCrypto.encrypt({ name: s, iv: r }, a, i);
    return new Uint8Array(c);
  }
  async decrypt(e, n, r, i) {
    let s, o;
    if (e === "aes-128-cbc")
      s = "AES-CBC", o = 128;
    else if (e === "aes-256-cbc")
      s = "AES-CBC", o = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: s, length: o }, !1, ["decrypt"]), c = await this.subtleCrypto.decrypt({ name: s, iv: r }, a, i);
    return new Uint8Array(c);
  }
}
async function op() {
  const t = await sm();
  return t.name === "subtleCrypto" ? new om(t.lib) : new im(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function am(t) {
  if (t.length >= 255)
    throw new TypeError("Alphabet too long");
  for (var e = new Uint8Array(256), n = 0; n < e.length; n++)
    e[n] = 255;
  for (var r = 0; r < t.length; r++) {
    var i = t.charAt(r), s = i.charCodeAt(0);
    if (e[s] !== 255)
      throw new TypeError(i + " is ambiguous");
    e[s] = r;
  }
  var o = t.length, a = t.charAt(0), c = Math.log(o) / Math.log(256), u = Math.log(256) / Math.log(o);
  function f(p) {
    if (p instanceof Uint8Array || (ArrayBuffer.isView(p) ? p = new Uint8Array(p.buffer, p.byteOffset, p.byteLength) : Array.isArray(p) && (p = Uint8Array.from(p))), !(p instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (p.length === 0)
      return "";
    for (var x = 0, S = 0, M = 0, j = p.length; M !== j && p[M] === 0; )
      M++, x++;
    for (var z = (j - M) * u + 1 >>> 0, A = new Uint8Array(z); M !== j; ) {
      for (var _ = p[M], N = 0, Q = z - 1; (_ !== 0 || N < S) && Q !== -1; Q--, N++)
        _ += 256 * A[Q] >>> 0, A[Q] = _ % o >>> 0, _ = _ / o >>> 0;
      if (_ !== 0)
        throw new Error("Non-zero carry");
      S = N, M++;
    }
    for (var tt = z - S; tt !== z && A[tt] === 0; )
      tt++;
    for (var R = a.repeat(x); tt < z; ++tt)
      R += t.charAt(A[tt]);
    return R;
  }
  function l(p) {
    if (typeof p != "string")
      throw new TypeError("Expected String");
    if (p.length === 0)
      return new Uint8Array();
    for (var x = 0, S = 0, M = 0; p[x] === a; )
      S++, x++;
    for (var j = (p.length - x) * c + 1 >>> 0, z = new Uint8Array(j); p[x]; ) {
      var A = p.charCodeAt(x);
      if (A > 255)
        return;
      var _ = e[A];
      if (_ === 255)
        return;
      for (var N = 0, Q = j - 1; (_ !== 0 || N < M) && Q !== -1; Q--, N++)
        _ += o * z[Q] >>> 0, z[Q] = _ % 256 >>> 0, _ = _ / 256 >>> 0;
      if (_ !== 0)
        throw new Error("Non-zero carry");
      M = N, x++;
    }
    for (var tt = j - M; tt !== j && z[tt] === 0; )
      tt++;
    for (var R = new Uint8Array(S + (j - tt)), K = S; tt !== j; )
      R[K++] = z[tt++];
    return R;
  }
  function w(p) {
    var x = l(p);
    if (x)
      return x;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: f,
    decodeUnsafe: l,
    decode: w
  };
}
var ap = am;
const cm = ap, lm = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var um = cm(lm);
const fm = /* @__PURE__ */ B0(um), dm = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), cp = Uint8Array.from({ length: 16 }, (t, e) => e), hm = cp.map((t) => (9 * t + 5) % 16);
let Gu = [cp], Ku = [hm];
for (let t = 0; t < 4; t++)
  for (let e of [Gu, Ku])
    e.push(e[t].map((n) => dm[n]));
const lp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), pm = Gu.map((t, e) => t.map((n) => lp[e][n])), gm = Ku.map((t, e) => t.map((n) => lp[e][n])), ym = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), wm = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), oa = (t, e) => t << e | t >>> 32 - e;
function hd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const aa = new Uint32Array(16);
let bm = class extends Du {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: i, h4: s } = this;
    return [e, n, r, i, s];
  }
  set(e, n, r, i, s) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = i | 0, this.h4 = s | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      aa[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, w = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, S = ym[p], M = wm[p], j = Gu[p], z = Ku[p], A = pm[p], _ = gm[p];
      for (let N = 0; N < 16; N++) {
        const Q = oa(r + hd(p, s, a, u) + aa[j[N]] + S, A[N]) + l | 0;
        r = l, l = u, u = oa(a, 10) | 0, a = s, s = Q;
      }
      for (let N = 0; N < 16; N++) {
        const Q = oa(i + hd(x, o, c, f) + aa[z[N]] + M, _[N]) + w | 0;
        i = w, w = f, f = oa(c, 10) | 0, c = o, o = Q;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + w | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    aa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const mm = ci(() => new bm());
function xm(t) {
  return mm(t);
}
const ca = BigInt(2 ** 32 - 1), Nl = BigInt(32);
function up(t, e = !1) {
  return e ? { h: Number(t & ca), l: Number(t >> Nl & ca) } : { h: Number(t >> Nl & ca) | 0, l: Number(t & ca) | 0 };
}
function Sm(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = up(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const Em = (t, e) => BigInt(t >>> 0) << Nl | BigInt(e >>> 0), Am = (t, e, n) => t >>> n, vm = (t, e, n) => t << 32 - n | e >>> n, km = (t, e, n) => t >>> n | e << 32 - n, $m = (t, e, n) => t << 32 - n | e >>> n, Im = (t, e, n) => t << 64 - n | e >>> n - 32, Lm = (t, e, n) => t >>> n - 32 | e << 64 - n, Cm = (t, e) => e, Tm = (t, e) => t, Bm = (t, e, n) => t << n | e >>> 32 - n, Mm = (t, e, n) => e << n | t >>> 32 - n, Nm = (t, e, n) => e << n - 32 | t >>> 64 - n, Pm = (t, e, n) => t << n - 32 | e >>> 64 - n;
function _m(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const Um = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Hm = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Om = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Dm = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, Fm = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), jm = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, Lt = {
  fromBig: up,
  split: Sm,
  toBig: Em,
  shrSH: Am,
  shrSL: vm,
  rotrSH: km,
  rotrSL: $m,
  rotrBH: Im,
  rotrBL: Lm,
  rotr32H: Cm,
  rotr32L: Tm,
  rotlSH: Bm,
  rotlSL: Mm,
  rotlBH: Nm,
  rotlBL: Pm,
  add: _m,
  add3L: Um,
  add3H: Hm,
  add4L: Om,
  add4H: Dm,
  add5H: jm,
  add5L: Fm
}, [zm, Rm] = Lt.split([
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
].map((t) => BigInt(t))), Yr = new Uint32Array(80), Zr = new Uint32Array(80);
let Ac = class extends Du {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: w, Gh: p, Gl: x, Hh: S, Hl: M } = this;
    return [e, n, r, i, s, o, a, c, u, f, l, w, p, x, S, M];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, f, l, w, p, x, S, M) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = w | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = S | 0, this.Hl = M | 0;
  }
  process(e, n) {
    for (let A = 0; A < 16; A++, n += 4)
      Yr[A] = e.getUint32(n), Zr[A] = e.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const _ = Yr[A - 15] | 0, N = Zr[A - 15] | 0, Q = Lt.rotrSH(_, N, 1) ^ Lt.rotrSH(_, N, 8) ^ Lt.shrSH(_, N, 7), tt = Lt.rotrSL(_, N, 1) ^ Lt.rotrSL(_, N, 8) ^ Lt.shrSL(_, N, 7), R = Yr[A - 2] | 0, K = Zr[A - 2] | 0, L = Lt.rotrSH(R, K, 19) ^ Lt.rotrBH(R, K, 61) ^ Lt.shrSH(R, K, 6), P = Lt.rotrSL(R, K, 19) ^ Lt.rotrBL(R, K, 61) ^ Lt.shrSL(R, K, 6), b = Lt.add4L(tt, P, Zr[A - 7], Zr[A - 16]), T = Lt.add4H(b, Q, L, Yr[A - 7], Yr[A - 16]);
      Yr[A] = T | 0, Zr[A] = b | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: w, Fh: p, Fl: x, Gh: S, Gl: M, Hh: j, Hl: z } = this;
    for (let A = 0; A < 80; A++) {
      const _ = Lt.rotrSH(l, w, 14) ^ Lt.rotrSH(l, w, 18) ^ Lt.rotrBH(l, w, 41), N = Lt.rotrSL(l, w, 14) ^ Lt.rotrSL(l, w, 18) ^ Lt.rotrBL(l, w, 41), Q = l & p ^ ~l & S, tt = w & x ^ ~w & M, R = Lt.add5L(z, N, tt, Rm[A], Zr[A]), K = Lt.add5H(R, j, _, Q, zm[A], Yr[A]), L = R | 0, P = Lt.rotrSH(r, i, 28) ^ Lt.rotrBH(r, i, 34) ^ Lt.rotrBH(r, i, 39), b = Lt.rotrSL(r, i, 28) ^ Lt.rotrBL(r, i, 34) ^ Lt.rotrBL(r, i, 39), T = r & s ^ r & a ^ s & a, H = i & o ^ i & c ^ o & c;
      j = S | 0, z = M | 0, S = p | 0, M = x | 0, p = l | 0, x = w | 0, { h: l, l: w } = Lt.add(u | 0, f | 0, K | 0, L | 0), u = a | 0, f = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const C = Lt.add3L(L, b, H);
      r = Lt.add3H(C, K, P, T), i = C | 0;
    }
    ({ h: r, l: i } = Lt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = Lt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = Lt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Lt.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: w } = Lt.add(this.Eh | 0, this.El | 0, l | 0, w | 0), { h: p, l: x } = Lt.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: S, l: M } = Lt.add(this.Gh | 0, this.Gl | 0, S | 0, M | 0), { h: j, l: z } = Lt.add(this.Hh | 0, this.Hl | 0, j | 0, z | 0), this.set(r, i, s, o, a, c, u, f, l, w, p, x, S, M, j, z);
  }
  roundClean() {
    Yr.fill(0), Zr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Gm = class extends Ac {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Km = class extends Ac {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Vm = class extends Ac {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const qm = ci(() => new Ac());
ci(() => new Gm());
ci(() => new Km());
ci(() => new Vm());
function fp(t) {
  return Ri(t);
}
function Wm(t) {
  return qm(t);
}
const Xm = 0;
Be.hmacSha256Sync = (t, ...e) => {
  const n = Sc.create(Ri, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Ym() {
  return pt(Be.randomPrivateKey());
}
function Zm(t) {
  const e = Ri(Ri(t));
  return fm.encode(Er(t, e).slice(0, t.length + 4));
}
function Qm(t, e) {
  return Zm(Er(new Uint8Array([t]), e.slice(0, 20)));
}
function dp(t, e = Xm) {
  const n = typeof t == "string" ? Kt(t) : t, r = xm(fp(n));
  return Qm(e, r);
}
function hp(t) {
  const e = Hu(t);
  return pt(Ko(e.slice(0, 32), !0));
}
Be.hmacSha256Sync = (t, ...e) => {
  const n = Sc.create(Ri, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var qa;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(qa || (qa = {}));
async function Jm(t, e, n) {
  return await (await op()).encrypt("aes-256-cbc", e, t, n);
}
async function t1(t, e, n) {
  return await (await op()).decrypt("aes-256-cbc", e, t, n);
}
function pp(t, e) {
  return Sc(Ri, t, e);
}
function e1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function gp(t) {
  const e = Wm(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function n1(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function r1(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: qa.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: qa.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !n1(t))
    return e;
  try {
    return Ut.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function s1(t, e, n, r) {
  const i = r1(t);
  if (!i.result)
    throw i;
  const s = Be.randomPrivateKey(), o = Ko(s, !0);
  let a = Ru(s, t, !0);
  a = a.slice(1);
  const c = gp(a), u = Be.randomBytes(16), f = await Jm(u, c.encryptionKey, e), l = Er(u, o, f), w = pp(c.hmacKey, l);
  let p;
  if (!r || r === "hex")
    p = pt(f);
  else if (r === "base64")
    p = qb(f);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const x = {
    iv: pt(u),
    ephemeralPK: pt(o),
    cipherText: p,
    mac: pt(w),
    wasString: n
  };
  return r && r !== "hex" && (x.cipherTextEncoding = r), x;
}
async function yp(t, e) {
  if (!e.ephemeralPK)
    throw new ed("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = Ru(t, n, !0);
  r = r.slice(1);
  const i = gp(r), s = Kt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = Kt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = Vb(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = Er(s, Kt(n), o), c = pp(i.hmacKey, a), u = Kt(e.mac);
  if (!e1(u, c))
    throw new ed("Decryption failed: failure in MAC check");
  const f = await t1(s, i.encryptionKey, o);
  return e.wasString ? Go(f) : f;
}
function i1(t, e) {
  const n = typeof e == "string" ? ai(e) : e, r = hp(t), i = fp(n), s = Ec(i, t);
  return {
    signature: pt(s),
    publicKey: r
  };
}
async function o1(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = hp(n.privateKey);
  }
  const i = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", s = typeof t == "string" ? ai(t) : t, o = await s1(n.publicKey, s, i, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = i1(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function a1(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return yp(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var Qe = {}, Wi = {}, fn = {};
Object.defineProperty(fn, "__esModule", { value: !0 });
fn.decode = fn.encode = fn.unescape = fn.escape = fn.pad = void 0;
const wp = Vo;
function Vu(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
fn.pad = Vu;
function bp(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
fn.escape = bp;
function mp(t) {
  return Vu(t).replace(/-/g, "+").replace(/_/g, "/");
}
fn.unescape = mp;
function c1(t) {
  return bp((0, wp.fromByteArray)(new TextEncoder().encode(t)));
}
fn.encode = c1;
function l1(t) {
  return new TextDecoder().decode((0, wp.toByteArray)(Vu(mp(t))));
}
fn.decode = l1;
var vc = {}, kc = {}, xp = {}, Sp = {}, $c = {};
Object.defineProperty($c, "__esModule", { value: !0 });
$c.crypto = void 0;
$c.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = i, t.ahash = s, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = f, t.createView = l, t.rotr = w, t.rotl = p, t.byteSwap = x, t.byteSwap32 = S, t.bytesToHex = z, t.hexToBytes = N, t.asyncLoop = tt, t.utf8ToBytes = R, t.bytesToUtf8 = K, t.toBytes = L, t.kdfInputToBytes = P, t.concatBytes = b, t.checkOpts = T, t.createHasher = C, t.createOptHasher = ot, t.createXOFer = X, t.randomBytes = Et;
  const e = $c;
  function n(k) {
    return k instanceof Uint8Array || ArrayBuffer.isView(k) && k.constructor.name === "Uint8Array";
  }
  function r(k) {
    if (!Number.isSafeInteger(k) || k < 0)
      throw new Error("positive integer expected, got " + k);
  }
  function i(k, ...m) {
    if (!n(k))
      throw new Error("Uint8Array expected");
    if (m.length > 0 && !m.includes(k.length))
      throw new Error("Uint8Array expected of length " + m + ", got length=" + k.length);
  }
  function s(k) {
    if (typeof k != "function" || typeof k.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(k.outputLen), r(k.blockLen);
  }
  function o(k, m = !0) {
    if (k.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (m && k.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(k, m) {
    i(k);
    const q = m.outputLen;
    if (k.length < q)
      throw new Error("digestInto() expects output buffer of length at least " + q);
  }
  function c(k) {
    return new Uint8Array(k.buffer, k.byteOffset, k.byteLength);
  }
  function u(k) {
    return new Uint32Array(k.buffer, k.byteOffset, Math.floor(k.byteLength / 4));
  }
  function f(...k) {
    for (let m = 0; m < k.length; m++)
      k[m].fill(0);
  }
  function l(k) {
    return new DataView(k.buffer, k.byteOffset, k.byteLength);
  }
  function w(k, m) {
    return k << 32 - m | k >>> m;
  }
  function p(k, m) {
    return k << m | k >>> 32 - m >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function x(k) {
    return k << 24 & 4278190080 | k << 8 & 16711680 | k >>> 8 & 65280 | k >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (k) => k : (k) => x(k), t.byteSwapIfBE = t.swap8IfBE;
  function S(k) {
    for (let m = 0; m < k.length; m++)
      k[m] = x(k[m]);
    return k;
  }
  t.swap32IfBE = t.isLE ? (k) => k : S;
  const M = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", j = /* @__PURE__ */ Array.from({ length: 256 }, (k, m) => m.toString(16).padStart(2, "0"));
  function z(k) {
    if (i(k), M)
      return k.toHex();
    let m = "";
    for (let q = 0; q < k.length; q++)
      m += j[k[q]];
    return m;
  }
  const A = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function _(k) {
    if (k >= A._0 && k <= A._9)
      return k - A._0;
    if (k >= A.A && k <= A.F)
      return k - (A.A - 10);
    if (k >= A.a && k <= A.f)
      return k - (A.a - 10);
  }
  function N(k) {
    if (typeof k != "string")
      throw new Error("hex string expected, got " + typeof k);
    if (M)
      return Uint8Array.fromHex(k);
    const m = k.length, q = m / 2;
    if (m % 2)
      throw new Error("hex string expected, got unpadded hex of length " + m);
    const nt = new Uint8Array(q);
    for (let at = 0, vt = 0; at < q; at++, vt += 2) {
      const te = _(k.charCodeAt(vt)), $t = _(k.charCodeAt(vt + 1));
      if (te === void 0 || $t === void 0) {
        const Dt = k[vt] + k[vt + 1];
        throw new Error('hex string expected, got non-hex character "' + Dt + '" at index ' + vt);
      }
      nt[at] = te * 16 + $t;
    }
    return nt;
  }
  const Q = async () => {
  };
  t.nextTick = Q;
  async function tt(k, m, q) {
    let nt = Date.now();
    for (let at = 0; at < k; at++) {
      q(at);
      const vt = Date.now() - nt;
      vt >= 0 && vt < m || (await (0, t.nextTick)(), nt += vt);
    }
  }
  function R(k) {
    if (typeof k != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(k));
  }
  function K(k) {
    return new TextDecoder().decode(k);
  }
  function L(k) {
    return typeof k == "string" && (k = R(k)), i(k), k;
  }
  function P(k) {
    return typeof k == "string" && (k = R(k)), i(k), k;
  }
  function b(...k) {
    let m = 0;
    for (let nt = 0; nt < k.length; nt++) {
      const at = k[nt];
      i(at), m += at.length;
    }
    const q = new Uint8Array(m);
    for (let nt = 0, at = 0; nt < k.length; nt++) {
      const vt = k[nt];
      q.set(vt, at), at += vt.length;
    }
    return q;
  }
  function T(k, m) {
    if (m !== void 0 && {}.toString.call(m) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(k, m);
  }
  class H {
  }
  t.Hash = H;
  function C(k) {
    const m = (nt) => k().update(L(nt)).digest(), q = k();
    return m.outputLen = q.outputLen, m.blockLen = q.blockLen, m.create = () => k(), m;
  }
  function ot(k) {
    const m = (nt, at) => k(at).update(L(nt)).digest(), q = k({});
    return m.outputLen = q.outputLen, m.blockLen = q.blockLen, m.create = (nt) => k(nt), m;
  }
  function X(k) {
    const m = (nt, at) => k(at).update(L(nt)).digest(), q = k({});
    return m.outputLen = q.outputLen, m.blockLen = q.blockLen, m.create = (nt) => k(nt), m;
  }
  t.wrapConstructor = C, t.wrapConstructorWithOpts = ot, t.wrapXOFConstructorWithOpts = X;
  function Et(k = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(k));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(k));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(Sp);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = Sp;
  class n extends e.Hash {
    constructor(s, o) {
      super(), this.finished = !1, this.destroyed = !1, (0, e.ahash)(s);
      const a = (0, e.toBytes)(o);
      if (this.iHash = s.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, u = new Uint8Array(c);
      u.set(a.length > c ? s.create().update(a).digest() : a);
      for (let f = 0; f < u.length; f++)
        u[f] ^= 54;
      this.iHash.update(u), this.oHash = s.create();
      for (let f = 0; f < u.length; f++)
        u[f] ^= 106;
      this.oHash.update(u), (0, e.clean)(u);
    }
    update(s) {
      return (0, e.aexists)(this), this.iHash.update(s), this;
    }
    digestInto(s) {
      (0, e.aexists)(this), (0, e.abytes)(s, this.outputLen), this.finished = !0, this.iHash.digestInto(s), this.oHash.update(s), this.oHash.digestInto(s), this.destroy();
    }
    digest() {
      const s = new Uint8Array(this.oHash.outputLen);
      return this.digestInto(s), s;
    }
    _cloneInto(s) {
      s || (s = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash: o, iHash: a, finished: c, destroyed: u, blockLen: f, outputLen: l } = this;
      return s = s, s.finished = c, s.destroyed = u, s.blockLen = f, s.outputLen = l, s.oHash = o._cloneInto(s.oHash), s.iHash = a._cloneInto(s.iHash), s;
    }
    clone() {
      return this._cloneInto();
    }
    destroy() {
      this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
    }
  }
  t.HMAC = n;
  const r = (i, s, o) => new n(i, s).update(o).digest();
  t.hmac = r, t.hmac.create = (i, s) => new n(i, s);
})(xp);
const $i = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Ep(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Pl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function li(t, ...e) {
  if (!Ep(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function u1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Pl(t.outputLen), Pl(t.blockLen);
}
function _l(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Ap(t, e) {
  li(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function f1(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function d1(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Wa(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function Pa(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Xn(t, e) {
  return t << 32 - e | t >>> e;
}
function h1(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const qu = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Wu(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const vp = qu ? (t) => t : (t) => Wu(t), p1 = vp;
function kp(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Wu(t[e]);
  return t;
}
const g1 = qu ? (t) => t : kp, $p = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", y1 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ip(t) {
  if (li(t), $p)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += y1[t[n]];
  return e;
}
const Mr = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function pd(t) {
  if (t >= Mr._0 && t <= Mr._9)
    return t - Mr._0;
  if (t >= Mr.A && t <= Mr.F)
    return t - (Mr.A - 10);
  if (t >= Mr.a && t <= Mr.f)
    return t - (Mr.a - 10);
}
function w1(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if ($p)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let i = 0, s = 0; i < n; i++, s += 2) {
    const o = pd(t.charCodeAt(s)), a = pd(t.charCodeAt(s + 1));
    if (o === void 0 || a === void 0) {
      const c = t[s] + t[s + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + s);
    }
    r[i] = o * 16 + a;
  }
  return r;
}
const Lp = async () => {
};
async function b1(t, e, n) {
  let r = Date.now();
  for (let i = 0; i < t; i++) {
    n(i);
    const s = Date.now() - r;
    s >= 0 && s < e || (await Lp(), r += s);
  }
}
function Xu(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function m1(t) {
  return new TextDecoder().decode(t);
}
function qo(t) {
  return typeof t == "string" && (t = Xu(t)), li(t), t;
}
function x1(t) {
  return typeof t == "string" && (t = Xu(t)), li(t), t;
}
function S1(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const i = t[r];
    li(i), e += i.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, i = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
function E1(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let Cp = class {
};
function Ic(t) {
  const e = (r) => t().update(qo(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Tp(t) {
  const e = (r, i) => t(i).update(qo(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function Bp(t) {
  const e = (r, i) => t(i).update(qo(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const A1 = Ic, v1 = Tp, k1 = Bp;
function $1(t = 32) {
  if ($i && typeof $i.getRandomValues == "function")
    return $i.getRandomValues(new Uint8Array(t));
  if ($i && typeof $i.randomBytes == "function")
    return Uint8Array.from($i.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const I1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Cp,
  abytes: li,
  aexists: _l,
  ahash: u1,
  anumber: Pl,
  aoutput: Ap,
  asyncLoop: b1,
  byteSwap: Wu,
  byteSwap32: kp,
  byteSwapIfBE: p1,
  bytesToHex: Ip,
  bytesToUtf8: m1,
  checkOpts: E1,
  clean: Wa,
  concatBytes: S1,
  createHasher: Ic,
  createOptHasher: Tp,
  createView: Pa,
  createXOFer: Bp,
  hexToBytes: w1,
  isBytes: Ep,
  isLE: qu,
  kdfInputToBytes: x1,
  nextTick: Lp,
  randomBytes: $1,
  rotl: h1,
  rotr: Xn,
  swap32IfBE: g1,
  swap8IfBE: vp,
  toBytes: qo,
  u32: d1,
  u8: f1,
  utf8ToBytes: Xu,
  wrapConstructor: A1,
  wrapConstructorWithOpts: v1,
  wrapXOFConstructorWithOpts: k1
}, Symbol.toStringTag, { value: "Module" }));
function L1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function C1(t, e, n) {
  return t & e ^ ~t & n;
}
function T1(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class B1 extends Cp {
  constructor(e, n, r, i) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.buffer = new Uint8Array(e), this.view = Pa(this.buffer);
  }
  update(e) {
    _l(this), e = qo(e), li(e);
    const { view: n, buffer: r, blockLen: i } = this, s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Pa(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    _l(this), Ap(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, Wa(this.buffer.subarray(o)), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    L1(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Pa(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, f[l], s);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: a } = this;
    return e.destroyed = o, e.finished = s, e.length = i, e.pos = a, i % n && e.buffer.set(r), e;
  }
  clone() {
    return this._cloneInto();
  }
}
const Qr = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Jr = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), M1 = /* @__PURE__ */ Uint32Array.from([
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
]), ts = /* @__PURE__ */ new Uint32Array(64);
let Yu = class extends B1 {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = Qr[0] | 0, this.B = Qr[1] | 0, this.C = Qr[2] | 0, this.D = Qr[3] | 0, this.E = Qr[4] | 0, this.F = Qr[5] | 0, this.G = Qr[6] | 0, this.H = Qr[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: i, E: s, F: o, G: a, H: c } = this;
    return [e, n, r, i, s, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      ts[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const w = ts[l - 15], p = ts[l - 2], x = Xn(w, 7) ^ Xn(w, 18) ^ w >>> 3, S = Xn(p, 17) ^ Xn(p, 19) ^ p >>> 10;
      ts[l] = S + ts[l - 7] + x + ts[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const w = Xn(a, 6) ^ Xn(a, 11) ^ Xn(a, 25), p = f + w + C1(a, c, u) + M1[l] + ts[l] | 0, S = (Xn(r, 2) ^ Xn(r, 13) ^ Xn(r, 22)) + T1(r, i, s) | 0;
      f = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + S | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, i, s, o, a, c, u, f);
  }
  roundClean() {
    Wa(ts);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Wa(this.buffer);
  }
}, Mp = class extends Yu {
  constructor() {
    super(28), this.A = Jr[0] | 0, this.B = Jr[1] | 0, this.C = Jr[2] | 0, this.D = Jr[3] | 0, this.E = Jr[4] | 0, this.F = Jr[5] | 0, this.G = Jr[6] | 0, this.H = Jr[7] | 0;
  }
};
const N1 = /* @__PURE__ */ Ic(() => new Yu()), P1 = /* @__PURE__ */ Ic(() => new Mp()), _1 = Yu, Np = N1, U1 = Mp, H1 = P1, O1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: U1,
  SHA256: _1,
  sha224: H1,
  sha256: Np
}, Symbol.toStringTag, { value: "Module" })), Lc = /* @__PURE__ */ mc(O1), D1 = /* @__PURE__ */ mc(Kb);
var Xi = {};
Object.defineProperty(Xi, "__esModule", { value: !0 });
Xi.joseToDer = Xi.derToJose = void 0;
const Pp = Vo, _p = fn;
function tl(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const F1 = {
  ES256: tl(256),
  ES384: tl(384),
  ES512: tl(521)
};
function Up(t) {
  const e = F1[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Xa = 128, Hp = 0, j1 = 32, z1 = 16, R1 = 2, Op = z1 | j1 | Hp << 6, Ya = R1 | Hp << 6;
function Dp(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, Pp.toByteArray)((0, _p.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function G1(t, e) {
  const n = Dp(t), r = Up(e), i = r + 1, s = n.length;
  let o = 0;
  if (n[o++] !== Op)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (Xa | 1) && (a = n[o++]), s - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${s - o}" remaining`);
  if (n[o++] !== Ya)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (s - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${s - o - 2}" available`);
  if (i < c)
    throw new Error(`"r" specified length of "${c}", max of "${i}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== Ya)
    throw new Error('Could not find expected "int" for "s"');
  const f = n[o++];
  if (s - o !== f)
    throw new Error(`"s" specified length of "${f}", expected "${s - o}"`);
  if (i < f)
    throw new Error(`"s" specified length of "${f}", max of "${i}" is acceptable`);
  const l = o;
  if (o += f, o !== s)
    throw new Error(`Expected to consume entire array, but "${s - o}" bytes remain`);
  const w = r - c, p = r - f, x = new Uint8Array(w + c + p + f);
  for (o = 0; o < w; ++o)
    x[o] = 0;
  x.set(n.subarray(u + Math.max(-w, 0), u + c), o), o = r;
  for (const S = o; o < S + p; ++o)
    x[o] = 0;
  return x.set(n.subarray(l + Math.max(-p, 0), l + f), o), (0, _p.escape)((0, Pp.fromByteArray)(x));
}
Xi.derToJose = G1;
function gd(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Xa && --r, r;
}
function K1(t, e) {
  t = Dp(t);
  const n = Up(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const i = gd(t, 0, n), s = gd(t, n, t.length), o = n - i, a = n - s, c = 2 + o + 1 + 1 + a, u = c < Xa, f = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return f[l++] = Op, u ? f[l++] = c : (f[l++] = Xa | 1, f[l++] = c & 255), f[l++] = Ya, f[l++] = o, i < 0 ? (f[l++] = 0, f.set(t.subarray(0, n), l), l += n) : (f.set(t.subarray(i, n), l), l += n - i), f[l++] = Ya, f[l++] = a, s < 0 ? (f[l++] = 0, f.set(t.subarray(n), l)) : f.set(t.subarray(n + s), l), f;
}
Xi.joseToDer = K1;
var jr = {};
Object.defineProperty(jr, "__esModule", { value: !0 });
jr.InvalidTokenError = jr.MissingParametersError = void 0;
class V1 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
jr.MissingParametersError = V1;
class q1 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
jr.InvalidTokenError = q1;
const Wo = /* @__PURE__ */ mc(I1);
Object.defineProperty(kc, "__esModule", { value: !0 });
kc.SECP256K1Client = void 0;
const W1 = xp, X1 = Lc, _a = D1, yd = Xi, wd = jr, bd = Wo;
_a.utils.hmacSha256Sync = (t, ...e) => {
  const n = W1.hmac.create(X1.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class Fp {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, bd.bytesToHex)(_a.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new wd.MissingParametersError("a signing input hash and private key are all required");
    const i = _a.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, bd.bytesToHex)(i);
    if (r === "jose")
      return (0, yd.derToJose)(i, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, yd.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new wd.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return _a.verify(n, e, r, { strict: !1 });
  }
}
kc.SECP256K1Client = Fp;
Fp.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = kc;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(vc);
var qs = {};
const Y1 = /* @__PURE__ */ mc(K0);
var Z1 = hn && hn.__awaiter || function(t, e, n, r) {
  function i(s) {
    return s instanceof n ? s : new n(function(o) {
      o(s);
    });
  }
  return new (n || (n = Promise))(function(s, o) {
    function a(f) {
      try {
        u(r.next(f));
      } catch (l) {
        o(l);
      }
    }
    function c(f) {
      try {
        u(r.throw(f));
      } catch (l) {
        o(l);
      }
    }
    function u(f) {
      f.done ? s(f.value) : i(f.value).then(a, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(qs, "__esModule", { value: !0 });
qs.hashSha256Async = qs.hashSha256 = void 0;
const Q1 = Lc;
function jp(t) {
  return (0, Q1.sha256)(t);
}
qs.hashSha256 = jp;
function J1(t) {
  return Z1(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Y1;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(jp(t));
    }
  });
}
qs.hashSha256Async = J1;
var t2 = hn && hn.__awaiter || function(t, e, n, r) {
  function i(s) {
    return s instanceof n ? s : new n(function(o) {
      o(s);
    });
  }
  return new (n || (n = Promise))(function(s, o) {
    function a(f) {
      try {
        u(r.next(f));
      } catch (l) {
        o(l);
      }
    }
    function c(f) {
      try {
        u(r.throw(f));
      } catch (l) {
        o(l);
      }
    }
    function u(f) {
      f.done ? s(f.value) : i(f.value).then(a, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Wi, "__esModule", { value: !0 });
Wi.TokenSigner = Wi.createUnsecuredToken = void 0;
const Ul = fn, md = vc, e2 = jr, xd = qs;
function Hl(t, e) {
  const n = [], r = Ul.encode(JSON.stringify(e));
  n.push(r);
  const i = Ul.encode(JSON.stringify(t));
  return n.push(i), n.join(".");
}
function n2(t) {
  return Hl(t, { typ: "JWT", alg: "none" }) + ".";
}
Wi.createUnsecuredToken = n2;
class r2 {
  constructor(e, n) {
    if (!(e && n))
      throw new e2.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !md.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = md.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const i = this.header(r), s = Hl(e, i), o = (0, xd.hashSha256)(s);
    return this.createWithSignedHash(e, n, i, s, o);
  }
  signAsync(e, n = !1, r = {}) {
    return t2(this, void 0, void 0, function* () {
      const i = this.header(r), s = Hl(e, i), o = yield (0, xd.hashSha256Async)(s);
      return this.createWithSignedHash(e, n, i, s, o);
    });
  }
  createWithSignedHash(e, n, r, i, s) {
    const o = this.cryptoClient.signHash(s, this.rawPrivateKey);
    return n ? {
      header: [Ul.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [i, o].join(".");
  }
}
Wi.TokenSigner = r2;
var Cc = {};
Object.defineProperty(Cc, "__esModule", { value: !0 });
Cc.TokenVerifier = void 0;
const s2 = fn, Sd = vc, i2 = jr, la = qs;
class o2 {
  constructor(e, n) {
    if (!(e && n))
      throw new i2.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Sd.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Sd.cryptoClients[e], this.rawPublicKey = n;
  }
  verify(e) {
    return typeof e == "string" ? this.verifyCompact(e, !1) : typeof e == "object" ? this.verifyExpanded(e, !1) : !1;
  }
  verifyAsync(e) {
    return typeof e == "string" ? this.verifyCompact(e, !0) : typeof e == "object" ? this.verifyExpanded(e, !0) : Promise.resolve(!1);
  }
  verifyCompact(e, n) {
    const r = e.split("."), i = r[0] + "." + r[1], s = (o) => {
      const a = this.cryptoClient.loadSignature(r[2]);
      return this.cryptoClient.verifyHash(o, a, this.rawPublicKey);
    };
    if (n)
      return (0, la.hashSha256Async)(i).then((o) => s(o));
    {
      const o = (0, la.hashSha256)(i);
      return s(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), s2.encode(e.payload)].join(".");
    let i = !0;
    const s = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (i = !1);
    }), i);
    if (n)
      return (0, la.hashSha256Async)(r).then((o) => s(o));
    {
      const o = (0, la.hashSha256)(r);
      return s(o);
    }
  }
}
Cc.TokenVerifier = o2;
var Tc = {};
Object.defineProperty(Tc, "__esModule", { value: !0 });
Tc.decodeToken = void 0;
const ua = fn;
function a2(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(ua.decode(e[0])), r = JSON.parse(ua.decode(e[1])), i = e[2];
    return {
      header: n,
      payload: r,
      signature: i
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = ua.decode(e));
    const n = [];
    return t.header.map((r) => {
      const i = JSON.parse(ua.decode(r));
      n.push(i);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
Tc.decodeToken = a2;
(function(t) {
  var e = hn && hn.__createBinding || (Object.create ? function(r, i, s, o) {
    o === void 0 && (o = s);
    var a = Object.getOwnPropertyDescriptor(i, s);
    (!a || ("get" in a ? !i.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return i[s];
    } }), Object.defineProperty(r, o, a);
  } : function(r, i, s, o) {
    o === void 0 && (o = s), r[o] = i[s];
  }), n = hn && hn.__exportStar || function(r, i) {
    for (var s in r) s !== "default" && !Object.prototype.hasOwnProperty.call(i, s) && e(i, r, s);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Wi, t), n(Cc, t), n(Tc, t), n(jr, t), n(vc, t);
})(Qe);
function c2(t) {
  return `did:btc-addr:${t}`;
}
function l2(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new td("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new td('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function zp(t) {
  if (t)
    return l2(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const u2 = "1.4.0";
function f2() {
  return Ym();
}
function d2(t, e, n, r = _0.slice(), i, s = qw().getTime(), o = {}) {
  const a = (p) => {
    const x = _u("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${p}=undefined])`
    });
    return x == null ? void 0 : x.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), i || (i = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: Xw(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(s / 1e3),
    iss: null,
    public_keys: [],
    domain_name: i,
    manifest_uri: n,
    redirect_uri: e,
    version: u2,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = Qe.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const f = dp(u);
  return c.iss = c2(f), new Qe.TokenSigner("ES256k", t).sign(c);
}
async function Ed(t, e) {
  const n = Go(Kt(e)), r = JSON.parse(n), i = await yp(t, r);
  if (typeof i != "string")
    throw new Error("Unable to correctly decrypt private key");
  return i;
}
function h2(t) {
  const e = Qe.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new Qe.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function p2(t) {
  const e = Qe.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = zp(e.iss);
  if (n.length === 1) {
    if (dp(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function g2(t) {
  const e = Qe.decodeToken(t).payload;
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
function y2(t) {
  const e = Qe.decodeToken(t).payload;
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
function w2(t) {
  const e = [
    y2(t),
    g2(t),
    h2(t),
    p2(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Ad = "1.0.0";
class As {
  constructor(e) {
    this.version = Ad, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Ad)
      throw new Ll(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new As(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Rp {
  constructor(e) {
    if (e) {
      const n = new As(e);
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
class vd extends Rp {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new As({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new U0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new As({})), !0;
  }
}
class kd extends Rp {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Gw, !localStorage.getItem(this.key)) {
      const r = new As({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new U0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return As.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new As({})), !0;
  }
}
var Mo;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Mo || (Mo = {}));
var Za;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Za || (Za = {}));
Mo.Mainnet;
var Or;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Or || (Or = {}));
var br;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(br || (br = {}));
Or.Mainnet;
const Gp = {
  chainId: Mo.Mainnet,
  transactionVersion: Or.Mainnet,
  peerNetworkId: Za.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: br.MainnetSingleSig,
    multiSig: br.MainnetMultiSig
  },
  client: { baseUrl: H0 }
}, Ol = {
  chainId: Mo.Testnet,
  transactionVersion: Or.Testnet,
  peerNetworkId: Za.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: br.TestnetSingleSig,
    multiSig: br.TestnetMultiSig
  },
  client: { baseUrl: O0 }
}, Ua = {
  ...Ol,
  addressVersion: { ...Ol.addressVersion },
  magicBytes: "id",
  client: { baseUrl: D0 }
}, b2 = {
  ...Ua,
  addressVersion: { ...Ua.addressVersion },
  client: { ...Ua.client }
};
function m2(t) {
  switch (t) {
    case "mainnet":
      return Gp;
    case "testnet":
      return Ol;
    case "devnet":
      return Ua;
    case "mocknet":
      return b2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Kp(t) {
  return typeof t == "string" ? m2(t) : t;
}
var $d;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})($d || ($d = {}));
var Id;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Id || (Id = {}));
var Yn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Yn || (Yn = {}));
const el = ["onChainOnly", "offChainOnly", "any"];
el[0] + "", Yn.OnChainOnly, el[1] + "", Yn.OffChainOnly, el[2] + "", Yn.Any, Yn.OnChainOnly + "", Yn.OnChainOnly, Yn.OffChainOnly + "", Yn.OffChainOnly, Yn.Any + "", Yn.Any;
var Ld;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Ld || (Ld = {}));
var Cd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Cd || (Cd = {}));
var Td;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Td || (Td = {}));
var Hr;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Hr || (Hr = {}));
var Bd;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Bd || (Bd = {}));
var Md;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Md || (Md = {}));
var Nd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Nd || (Nd = {}));
var Pd;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Pd || (Pd = {}));
var _d;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(_d || (_d = {}));
var Ud;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ud || (Ud = {}));
var Hd;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Hd || (Hd = {}));
var Od;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Od || (Od = {}));
var Dd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Dd || (Dd = {}));
function Dl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function x2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Vp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function S2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Dl(t.outputLen), Dl(t.blockLen);
}
function E2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function A2(t, e) {
  Vp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ps = {
  number: Dl,
  bool: x2,
  bytes: Vp,
  hash: S2,
  exists: E2,
  output: A2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const nl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), ur = (t, e) => t << 32 - e | t >>> e, v2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!v2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function k2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Zu(t) {
  if (typeof t == "string" && (t = k2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let qp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ui(t) {
  const e = (r) => t().update(Zu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Wp = class extends qp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ps.hash(e);
    const r = Zu(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const i = this.blockLen, s = new Uint8Array(i);
    s.set(r.length > i ? e.create().update(r).digest() : r);
    for (let o = 0; o < s.length; o++)
      s[o] ^= 54;
    this.iHash.update(s), this.oHash = e.create();
    for (let o = 0; o < s.length; o++)
      s[o] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(e) {
    return Ps.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Ps.exists(this), Ps.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: i, destroyed: s, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = i, e.destroyed = s, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Xp = (t, e, n) => new Wp(t, e).update(n).digest();
Xp.create = (t, e) => new Wp(t, e);
function $2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Qu = class extends qp {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = nl(this.buffer);
  }
  update(e) {
    Ps.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Zu(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = nl(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ps.exists(this), Ps.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    $2(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = nl(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, f[l], s);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: a } = this;
    return e.length = i, e.pos = a, e.finished = s, e.destroyed = o, i % n && e.buffer.set(r), e;
  }
};
const I2 = (t, e, n) => t & e ^ ~t & n, L2 = (t, e, n) => t & e ^ t & n ^ e & n, C2 = new Uint32Array([
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
]), es = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ns = new Uint32Array(64);
let Yp = class extends Qu {
  constructor() {
    super(64, 32, 8, !1), this.A = es[0] | 0, this.B = es[1] | 0, this.C = es[2] | 0, this.D = es[3] | 0, this.E = es[4] | 0, this.F = es[5] | 0, this.G = es[6] | 0, this.H = es[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: i, E: s, F: o, G: a, H: c } = this;
    return [e, n, r, i, s, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      ns[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const w = ns[l - 15], p = ns[l - 2], x = ur(w, 7) ^ ur(w, 18) ^ w >>> 3, S = ur(p, 17) ^ ur(p, 19) ^ p >>> 10;
      ns[l] = S + ns[l - 7] + x + ns[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const w = ur(a, 6) ^ ur(a, 11) ^ ur(a, 25), p = f + w + I2(a, c, u) + C2[l] + ns[l] | 0, S = (ur(r, 2) ^ ur(r, 13) ^ ur(r, 22)) + L2(r, i, s) | 0;
      f = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + S | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, i, s, o, a, c, u, f);
  }
  roundClean() {
    ns.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, T2 = class extends Yp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Zp = ui(() => new Yp());
ui(() => new T2());
var fi = {}, Ju = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = Wo;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], u = 0;
    for (let p = o.length - 1; p >= 0; p--)
      if (u < 4) {
        const x = n.indexOf(o[p]) >> u;
        let S = 0;
        p !== 0 && (S = n.indexOf(o[p - 1]));
        const M = 1 + u, j = S % (1 << M) << 5 - M, z = t.c32[x + j];
        u = M, c.unshift(z);
      } else
        u = 0;
    let f = 0;
    for (let p = 0; p < c.length && c[p] === "0"; p++)
      f++;
    c = c.slice(f);
    const l = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), w = l ? l[0].length : 0;
    for (let p = 0; p < w; p++)
      c.unshift(t.c32[0]);
    if (a) {
      const p = a - c.length;
      for (let x = 0; x < p; x++)
        c.unshift(t.c32[0]);
    }
    return c.join("");
  }
  t.c32encode = r;
  function i(o) {
    return o.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  t.c32normalize = i;
  function s(o, a) {
    if (o = i(o), !o.match(`^[${t.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const c = o.match(`^${t.c32[0]}*`), u = c ? c[0].length : 0;
    let f = [], l = 0, w = 0;
    for (let S = o.length - 1; S >= 0; S--) {
      w === 4 && (f.unshift(n[l]), w = 0, l = 0);
      const j = (t.c32.indexOf(o[S]) << w) + l, z = n[j % 16];
      if (w += 1, l = j >> 4, l > 1 << w)
        throw new Error("Panic error in decoding.");
      f.unshift(z);
    }
    f.unshift(n[l]), f.length % 2 === 1 && f.unshift("0");
    let p = 0;
    for (let S = 0; S < f.length && f[S] === "0"; S++)
      p++;
    f = f.slice(p - p % 2);
    let x = f.join("");
    for (let S = 0; S < u; S++)
      x = `00${x}`;
    if (a) {
      const S = a * 2 - x.length;
      for (let M = 0; M < S; M += 2)
        x = `00${x}`;
    }
    return x;
  }
  t.c32decode = s;
})(Ju);
var Ws = {};
Object.defineProperty(Ws, "__esModule", { value: !0 });
Ws.c32checkDecode = Ws.c32checkEncode = void 0;
const Fd = Lc, jd = Wo, Io = Ju;
function Qp(t) {
  const e = (0, Fd.sha256)((0, Fd.sha256)((0, jd.hexToBytes)(t)));
  return (0, jd.bytesToHex)(e.slice(0, 4));
}
function B2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Qp(`${n}${e}`), i = (0, Io.c32encode)(`${e}${r}`);
  return `${Io.c32[t]}${i}`;
}
Ws.c32checkEncode = B2;
function M2(t) {
  t = (0, Io.c32normalize)(t);
  const e = (0, Io.c32decode)(t.slice(1)), n = t[0], r = Io.c32.indexOf(n), i = e.slice(-8);
  let s = r.toString(16);
  if (s.length === 1 && (s = `0${s}`), Qp(`${s}${e.substring(0, e.length - 8)}`) !== i)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Ws.c32checkDecode = M2;
var Jp = {}, Yi = {};
Object.defineProperty(Yi, "__esModule", { value: !0 });
Yi.decode = Yi.encode = void 0;
const Qa = Lc, zd = Wo, tg = ap, eg = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function N2(t, e = "00") {
  const n = typeof t == "string" ? (0, zd.hexToBytes)(t) : t, r = typeof e == "string" ? (0, zd.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const i = (0, Qa.sha256)((0, Qa.sha256)(new Uint8Array([...r, ...n])));
  return tg(eg).encode([...r, ...n, ...i.slice(0, 4)]);
}
Yi.encode = N2;
function P2(t) {
  const e = tg(eg).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), i = (0, Qa.sha256)((0, Qa.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((s, o) => {
    if (s !== i[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Yi.decode = P2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Ws, n = Yi, r = Wo;
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
  const i = {};
  i[0] = t.versions.mainnet.p2pkh, i[5] = t.versions.mainnet.p2sh, i[111] = t.versions.testnet.p2pkh, i[196] = t.versions.testnet.p2sh;
  const s = {};
  s[t.versions.mainnet.p2pkh] = 0, s[t.versions.mainnet.p2sh] = 5, s[t.versions.testnet.p2pkh] = 111, s[t.versions.testnet.p2sh] = 196;
  function o(f, l) {
    if (!l.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, e.c32checkEncode)(f, l)}`;
  }
  t.c32address = o;
  function a(f) {
    if (f.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (f[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, e.c32checkDecode)(f.slice(1));
  }
  t.c32addressDecode = a;
  function c(f, l = -1) {
    const w = n.decode(f), p = (0, r.bytesToHex)(w.data), x = parseInt((0, r.bytesToHex)(w.prefix), 16);
    let S;
    return l < 0 ? (S = x, i[x] !== void 0 && (S = i[x])) : S = l, o(S, p);
  }
  t.b58ToC32 = c;
  function u(f, l = -1) {
    const w = a(f), p = w[0], x = w[1];
    let S;
    l < 0 ? (S = p, s[p] !== void 0 && (S = s[p])) : S = l;
    let M = S.toString(16);
    return M.length === 1 && (M = `0${M}`), n.encode(x, M);
  }
  t.c32ToB58 = u;
})(Jp);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Ju;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Ws;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Jp;
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
})(fi);
function _2(t, e) {
  switch (e = Kp(e ?? Gp), t) {
    case Hr.P2PKH:
      switch (e.transactionVersion) {
        case Or.Mainnet:
          return br.MainnetSingleSig;
        case Or.Testnet:
          return br.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case Hr.P2SH:
    case Hr.P2SHNonSequential:
    case Hr.P2WPKH:
    case Hr.P2WSH:
    case Hr.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Or.Mainnet:
          return br.MainnetMultiSig;
        case Or.Testnet:
          return br.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const U2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ng = Uint8Array.from({ length: 16 }, (t, e) => e), H2 = ng.map((t) => (9 * t + 5) % 16);
let tf = [ng], ef = [H2];
for (let t = 0; t < 4; t++)
  for (let e of [tf, ef])
    e.push(e[t].map((n) => U2[n]));
const rg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), O2 = tf.map((t, e) => t.map((n) => rg[e][n])), D2 = ef.map((t, e) => t.map((n) => rg[e][n])), F2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), j2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), fa = (t, e) => t << e | t >>> 32 - e;
function Rd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const da = new Uint32Array(16);
let z2 = class extends Qu {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: i, h4: s } = this;
    return [e, n, r, i, s];
  }
  set(e, n, r, i, s) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = i | 0, this.h4 = s | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      da[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, w = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, S = F2[p], M = j2[p], j = tf[p], z = ef[p], A = O2[p], _ = D2[p];
      for (let N = 0; N < 16; N++) {
        const Q = fa(r + Rd(p, s, a, u) + da[j[N]] + S, A[N]) + l | 0;
        r = l, l = u, u = fa(a, 10) | 0, a = s, s = Q;
      }
      for (let N = 0; N < 16; N++) {
        const Q = fa(i + Rd(x, o, c, f) + da[z[N]] + M, _[N]) + w | 0;
        i = w, w = f, f = fa(c, 10) | 0, c = o, o = Q;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + w | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    da.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const R2 = ui(() => new z2()), ha = BigInt(2 ** 32 - 1), Fl = BigInt(32);
function sg(t, e = !1) {
  return e ? { h: Number(t & ha), l: Number(t >> Fl & ha) } : { h: Number(t >> Fl & ha) | 0, l: Number(t & ha) | 0 };
}
function G2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = sg(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const K2 = (t, e) => BigInt(t >>> 0) << Fl | BigInt(e >>> 0), V2 = (t, e, n) => t >>> n, q2 = (t, e, n) => t << 32 - n | e >>> n, W2 = (t, e, n) => t >>> n | e << 32 - n, X2 = (t, e, n) => t << 32 - n | e >>> n, Y2 = (t, e, n) => t << 64 - n | e >>> n - 32, Z2 = (t, e, n) => t >>> n - 32 | e << 64 - n, Q2 = (t, e) => e, J2 = (t, e) => t, tx = (t, e, n) => t << n | e >>> 32 - n, ex = (t, e, n) => e << n | t >>> 32 - n, nx = (t, e, n) => e << n - 32 | t >>> 64 - n, rx = (t, e, n) => t << n - 32 | e >>> 64 - n;
function sx(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const ix = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), ox = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, ax = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), cx = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, lx = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), ux = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, Ct = {
  fromBig: sg,
  split: G2,
  toBig: K2,
  shrSH: V2,
  shrSL: q2,
  rotrSH: W2,
  rotrSL: X2,
  rotrBH: Y2,
  rotrBL: Z2,
  rotr32H: Q2,
  rotr32L: J2,
  rotlSH: tx,
  rotlSL: ex,
  rotlBH: nx,
  rotlBL: rx,
  add: sx,
  add3L: ix,
  add3H: ox,
  add4L: ax,
  add4H: cx,
  add5H: ux,
  add5L: lx
}, [fx, dx] = Ct.split([
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
].map((t) => BigInt(t))), rs = new Uint32Array(80), ss = new Uint32Array(80);
let Bc = class extends Qu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: w, Gh: p, Gl: x, Hh: S, Hl: M } = this;
    return [e, n, r, i, s, o, a, c, u, f, l, w, p, x, S, M];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, f, l, w, p, x, S, M) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = w | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = S | 0, this.Hl = M | 0;
  }
  process(e, n) {
    for (let A = 0; A < 16; A++, n += 4)
      rs[A] = e.getUint32(n), ss[A] = e.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const _ = rs[A - 15] | 0, N = ss[A - 15] | 0, Q = Ct.rotrSH(_, N, 1) ^ Ct.rotrSH(_, N, 8) ^ Ct.shrSH(_, N, 7), tt = Ct.rotrSL(_, N, 1) ^ Ct.rotrSL(_, N, 8) ^ Ct.shrSL(_, N, 7), R = rs[A - 2] | 0, K = ss[A - 2] | 0, L = Ct.rotrSH(R, K, 19) ^ Ct.rotrBH(R, K, 61) ^ Ct.shrSH(R, K, 6), P = Ct.rotrSL(R, K, 19) ^ Ct.rotrBL(R, K, 61) ^ Ct.shrSL(R, K, 6), b = Ct.add4L(tt, P, ss[A - 7], ss[A - 16]), T = Ct.add4H(b, Q, L, rs[A - 7], rs[A - 16]);
      rs[A] = T | 0, ss[A] = b | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: w, Fh: p, Fl: x, Gh: S, Gl: M, Hh: j, Hl: z } = this;
    for (let A = 0; A < 80; A++) {
      const _ = Ct.rotrSH(l, w, 14) ^ Ct.rotrSH(l, w, 18) ^ Ct.rotrBH(l, w, 41), N = Ct.rotrSL(l, w, 14) ^ Ct.rotrSL(l, w, 18) ^ Ct.rotrBL(l, w, 41), Q = l & p ^ ~l & S, tt = w & x ^ ~w & M, R = Ct.add5L(z, N, tt, dx[A], ss[A]), K = Ct.add5H(R, j, _, Q, fx[A], rs[A]), L = R | 0, P = Ct.rotrSH(r, i, 28) ^ Ct.rotrBH(r, i, 34) ^ Ct.rotrBH(r, i, 39), b = Ct.rotrSL(r, i, 28) ^ Ct.rotrBL(r, i, 34) ^ Ct.rotrBL(r, i, 39), T = r & s ^ r & a ^ s & a, H = i & o ^ i & c ^ o & c;
      j = S | 0, z = M | 0, S = p | 0, M = x | 0, p = l | 0, x = w | 0, { h: l, l: w } = Ct.add(u | 0, f | 0, K | 0, L | 0), u = a | 0, f = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const C = Ct.add3L(L, b, H);
      r = Ct.add3H(C, K, P, T), i = C | 0;
    }
    ({ h: r, l: i } = Ct.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = Ct.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = Ct.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Ct.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: w } = Ct.add(this.Eh | 0, this.El | 0, l | 0, w | 0), { h: p, l: x } = Ct.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: S, l: M } = Ct.add(this.Gh | 0, this.Gl | 0, S | 0, M | 0), { h: j, l: z } = Ct.add(this.Hh | 0, this.Hl | 0, j | 0, z | 0), this.set(r, i, s, o, a, c, u, f, l, w, p, x, S, M, j, z);
  }
  roundClean() {
    rs.fill(0), ss.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, hx = class extends Bc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, px = class extends Bc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, gx = class extends Bc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ui(() => new Bc());
ui(() => new hx());
ui(() => new px());
ui(() => new gx());
var Ja = { exports: {} };
Ja.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", i = 9007199254740991, s = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", f = "[object Function]", l = "[object GeneratorFunction]", w = "[object Map]", p = "[object Number]", x = "[object Object]", S = "[object Promise]", M = "[object RegExp]", j = "[object Set]", z = "[object String]", A = "[object Symbol]", _ = "[object WeakMap]", N = "[object ArrayBuffer]", Q = "[object DataView]", tt = "[object Float32Array]", R = "[object Float64Array]", K = "[object Int8Array]", L = "[object Int16Array]", P = "[object Int32Array]", b = "[object Uint8Array]", T = "[object Uint8ClampedArray]", H = "[object Uint16Array]", C = "[object Uint32Array]", ot = /[\\^$.*+?()[\]{}|]/g, X = /\w*$/, Et = /^\[object .+?Constructor\]$/, k = /^(?:0|[1-9]\d*)$/, m = {};
  m[s] = m[o] = m[N] = m[Q] = m[a] = m[c] = m[tt] = m[R] = m[K] = m[L] = m[P] = m[w] = m[p] = m[x] = m[M] = m[j] = m[z] = m[A] = m[b] = m[T] = m[H] = m[C] = !0, m[u] = m[f] = m[_] = !1;
  var q = typeof hn == "object" && hn && hn.Object === Object && hn, nt = typeof self == "object" && self && self.Object === Object && self, at = q || nt || Function("return this")(), vt = e && !e.nodeType && e, te = vt && !0 && t && !t.nodeType && t, $t = te && te.exports === vt;
  function Dt(g, B) {
    return g.set(B[0], B[1]), g;
  }
  function Nt(g, B) {
    return g.add(B), g;
  }
  function ee(g, B) {
    for (var U = -1, ut = g ? g.length : 0; ++U < ut && B(g[U], U, g) !== !1; )
      ;
    return g;
  }
  function ct(g, B) {
    for (var U = -1, ut = B.length, Xe = g.length; ++U < ut; )
      g[Xe + U] = B[U];
    return g;
  }
  function jt(g, B, U, ut) {
    for (var Xe = -1, xn = g ? g.length : 0; ++Xe < xn; )
      U = B(U, g[Xe], Xe, g);
    return U;
  }
  function Je(g, B) {
    for (var U = -1, ut = Array(g); ++U < g; )
      ut[U] = B(U);
    return ut;
  }
  function ne(g, B) {
    return g == null ? void 0 : g[B];
  }
  function tn(g) {
    var B = !1;
    if (g != null && typeof g.toString != "function")
      try {
        B = !!(g + "");
      } catch {
      }
    return B;
  }
  function De(g) {
    var B = -1, U = Array(g.size);
    return g.forEach(function(ut, Xe) {
      U[++B] = [Xe, ut];
    }), U;
  }
  function xe(g, B) {
    return function(U) {
      return g(B(U));
    };
  }
  function qe(g) {
    var B = -1, U = Array(g.size);
    return g.forEach(function(ut) {
      U[++B] = ut;
    }), U;
  }
  var Me = Array.prototype, ze = Function.prototype, Se = Object.prototype, zt = at["__core-js_shared__"], Re = function() {
    var g = /[^.]+$/.exec(zt && zt.keys && zt.keys.IE_PROTO || "");
    return g ? "Symbol(src)_1." + g : "";
  }(), gn = ze.toString, Ne = Se.hasOwnProperty, Ee = Se.toString, v = RegExp(
    "^" + gn.call(Ne).replace(ot, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), O = $t ? at.Buffer : void 0, D = at.Symbol, G = at.Uint8Array, ht = xe(Object.getPrototypeOf, Object), it = Object.create, Yt = Se.propertyIsEnumerable, Zt = Me.splice, re = Object.getOwnPropertySymbols, ye = O ? O.isBuffer : void 0, ue = xe(Object.keys, Object), Ae = cr(at, "DataView"), It = cr(at, "Map"), At = cr(at, "Promise"), qt = cr(at, "Set"), Qt = cr(at, "WeakMap"), fe = cr(Object, "create"), oe = Pt(Ae), Hn = Pt(It), kn = Pt(At), Gr = Pt(qt), Ls = Pt(Qt), Kr = D ? D.prototype : void 0, wi = Kr ? Kr.valueOf : void 0;
  function ve(g) {
    var B = -1, U = g ? g.length : 0;
    for (this.clear(); ++B < U; ) {
      var ut = g[B];
      this.set(ut[0], ut[1]);
    }
  }
  function $n() {
    this.__data__ = fe ? fe(null) : {};
  }
  function bi(g) {
    return this.has(g) && delete this.__data__[g];
  }
  function mi(g) {
    var B = this.__data__;
    if (fe) {
      var U = B[g];
      return U === r ? void 0 : U;
    }
    return Ne.call(B, g) ? B[g] : void 0;
  }
  function Vt(g) {
    var B = this.__data__;
    return fe ? B[g] !== void 0 : Ne.call(B, g);
  }
  function We(g, B) {
    var U = this.__data__;
    return U[g] = fe && B === void 0 ? r : B, this;
  }
  ve.prototype.clear = $n, ve.prototype.delete = bi, ve.prototype.get = mi, ve.prototype.has = Vt, ve.prototype.set = We;
  function d(g) {
    var B = -1, U = g ? g.length : 0;
    for (this.clear(); ++B < U; ) {
      var ut = g[B];
      this.set(ut[0], ut[1]);
    }
  }
  function E() {
    this.__data__ = [];
  }
  function $(g) {
    var B = this.__data__, U = Vn(B, g);
    if (U < 0)
      return !1;
    var ut = B.length - 1;
    return U == ut ? B.pop() : Zt.call(B, U, 1), !0;
  }
  function h(g) {
    var B = this.__data__, U = Vn(B, g);
    return U < 0 ? void 0 : B[U][1];
  }
  function rt(g) {
    return Vn(this.__data__, g) > -1;
  }
  function dt(g, B) {
    var U = this.__data__, ut = Vn(U, g);
    return ut < 0 ? U.push([g, B]) : U[ut][1] = B, this;
  }
  d.prototype.clear = E, d.prototype.delete = $, d.prototype.get = h, d.prototype.has = rt, d.prototype.set = dt;
  function yt(g) {
    var B = -1, U = g ? g.length : 0;
    for (this.clear(); ++B < U; ) {
      var ut = g[B];
      this.set(ut[0], ut[1]);
    }
  }
  function ae() {
    this.__data__ = {
      hash: new ve(),
      map: new (It || d)(),
      string: new ve()
    };
  }
  function ke(g) {
    return Wn(this, g).delete(g);
  }
  function yn(g) {
    return Wn(this, g).get(g);
  }
  function wn(g) {
    return Wn(this, g).has(g);
  }
  function Rt(g, B) {
    return Wn(this, g).set(g, B), this;
  }
  yt.prototype.clear = ae, yt.prototype.delete = ke, yt.prototype.get = yn, yt.prototype.has = wn, yt.prototype.set = Rt;
  function we(g) {
    this.__data__ = new d(g);
  }
  function Pe() {
    this.__data__ = new d();
  }
  function rr(g) {
    return this.__data__.delete(g);
  }
  function In(g) {
    return this.__data__.get(g);
  }
  function en(g) {
    return this.__data__.has(g);
  }
  function Ir(g, B) {
    var U = this.__data__;
    if (U instanceof d) {
      var ut = U.__data__;
      if (!It || ut.length < n - 1)
        return ut.push([g, B]), this;
      U = this.__data__ = new yt(ut);
    }
    return U.set(g, B), this;
  }
  we.prototype.clear = Pe, we.prototype.delete = rr, we.prototype.get = In, we.prototype.has = en, we.prototype.set = Ir;
  function Lr(g, B) {
    var U = cn(g) || Ke(g) ? Je(g.length, String) : [], ut = U.length, Xe = !!ut;
    for (var xn in g)
      Ne.call(g, xn) && !(Xe && (xn == "length" || F(xn, ut))) && U.push(xn);
    return U;
  }
  function Ge(g, B, U) {
    var ut = g[B];
    (!(Ne.call(g, B) && nn(ut, U)) || U === void 0 && !(B in g)) && (g[B] = U);
  }
  function Vn(g, B) {
    for (var U = g.length; U--; )
      if (nn(g[U][0], B))
        return U;
    return -1;
  }
  function sr(g, B) {
    return g && ar(B, Tr(B), g);
  }
  function wt(g, B, U, ut, Xe, xn, Br) {
    var Sn;
    if (ut && (Sn = xn ? ut(g, Xe, xn, Br) : ut(g)), Sn !== void 0)
      return Sn;
    if (!Ie(g))
      return g;
    var qf = cn(g);
    if (qf) {
      if (Sn = V(g), !B)
        return Cr(g, Sn);
    } else {
      var vi = I(g), Wf = vi == f || vi == l;
      if (W(g))
        return xi(g, B);
      if (vi == x || vi == s || Wf && !xn) {
        if (tn(g))
          return xn ? g : {};
        if (Sn = J(Wf ? {} : g), !B)
          return Ai(g, sr(Sn, g));
      } else {
        if (!m[vi])
          return xn ? g : {};
        Sn = bt(g, vi, wt, B);
      }
    }
    Br || (Br = new we());
    var Xf = Br.get(g);
    if (Xf)
      return Xf;
    if (Br.set(g, Sn), !qf)
      var Yf = U ? Cs(g) : Tr(g);
    return ee(Yf || g, function(Wc, ta) {
      Yf && (ta = Wc, Wc = g[ta]), Ge(Sn, ta, wt(Wc, B, U, ut, ta, g, Br));
    }), Sn;
  }
  function Gt(g) {
    return Ie(g) ? it(g) : {};
  }
  function le(g, B, U) {
    var ut = B(g);
    return cn(g) ? ut : ct(ut, U(g));
  }
  function bn(g) {
    return Ee.call(g);
  }
  function Vr(g) {
    if (!Ie(g) || mt(g))
      return !1;
    var B = lt(g) || tn(g) ? v : Et;
    return B.test(Pt(g));
  }
  function ho(g) {
    if (!xt(g))
      return ue(g);
    var B = [];
    for (var U in Object(g))
      Ne.call(g, U) && U != "constructor" && B.push(U);
    return B;
  }
  function xi(g, B) {
    if (B)
      return g.slice();
    var U = new g.constructor(g.length);
    return g.copy(U), U;
  }
  function On(g) {
    var B = new g.constructor(g.byteLength);
    return new G(B).set(new G(g)), B;
  }
  function de(g, B) {
    var U = B ? On(g.buffer) : g.buffer;
    return new g.constructor(U, g.byteOffset, g.byteLength);
  }
  function Si(g, B, U) {
    var ut = B ? U(De(g), !0) : De(g);
    return jt(ut, Dt, new g.constructor());
  }
  function Ei(g) {
    var B = new g.constructor(g.source, X.exec(g));
    return B.lastIndex = g.lastIndex, B;
  }
  function ir(g, B, U) {
    var ut = B ? U(qe(g), !0) : qe(g);
    return jt(ut, Nt, new g.constructor());
  }
  function or(g) {
    return wi ? Object(wi.call(g)) : {};
  }
  function qn(g, B) {
    var U = B ? On(g.buffer) : g.buffer;
    return new g.constructor(U, g.byteOffset, g.length);
  }
  function Cr(g, B) {
    var U = -1, ut = g.length;
    for (B || (B = Array(ut)); ++U < ut; )
      B[U] = g[U];
    return B;
  }
  function ar(g, B, U, ut) {
    U || (U = {});
    for (var Xe = -1, xn = B.length; ++Xe < xn; ) {
      var Br = B[Xe], Sn = void 0;
      Ge(U, Br, Sn === void 0 ? g[Br] : Sn);
    }
    return U;
  }
  function Ai(g, B) {
    return ar(g, y(g), B);
  }
  function Cs(g) {
    return le(g, Tr, y);
  }
  function Wn(g, B) {
    var U = g.__data__;
    return gt(B) ? U[typeof B == "string" ? "string" : "hash"] : U.map;
  }
  function cr(g, B) {
    var U = ne(g, B);
    return Vr(U) ? U : void 0;
  }
  var y = re ? xe(re, Object) : mn, I = bn;
  (Ae && I(new Ae(new ArrayBuffer(1))) != Q || It && I(new It()) != w || At && I(At.resolve()) != S || qt && I(new qt()) != j || Qt && I(new Qt()) != _) && (I = function(g) {
    var B = Ee.call(g), U = B == x ? g.constructor : void 0, ut = U ? Pt(U) : void 0;
    if (ut)
      switch (ut) {
        case oe:
          return Q;
        case Hn:
          return w;
        case kn:
          return S;
        case Gr:
          return j;
        case Ls:
          return _;
      }
    return B;
  });
  function V(g) {
    var B = g.length, U = g.constructor(B);
    return B && typeof g[0] == "string" && Ne.call(g, "index") && (U.index = g.index, U.input = g.input), U;
  }
  function J(g) {
    return typeof g.constructor == "function" && !xt(g) ? Gt(ht(g)) : {};
  }
  function bt(g, B, U, ut) {
    var Xe = g.constructor;
    switch (B) {
      case N:
        return On(g);
      case a:
      case c:
        return new Xe(+g);
      case Q:
        return de(g, ut);
      case tt:
      case R:
      case K:
      case L:
      case P:
      case b:
      case T:
      case H:
      case C:
        return qn(g, ut);
      case w:
        return Si(g, ut, U);
      case p:
      case z:
        return new Xe(g);
      case M:
        return Ei(g);
      case j:
        return ir(g, ut, U);
      case A:
        return or(g);
    }
  }
  function F(g, B) {
    return B = B ?? i, !!B && (typeof g == "number" || k.test(g)) && g > -1 && g % 1 == 0 && g < B;
  }
  function gt(g) {
    var B = typeof g;
    return B == "string" || B == "number" || B == "symbol" || B == "boolean" ? g !== "__proto__" : g === null;
  }
  function mt(g) {
    return !!Re && Re in g;
  }
  function xt(g) {
    var B = g && g.constructor, U = typeof B == "function" && B.prototype || Se;
    return g === U;
  }
  function Pt(g) {
    if (g != null) {
      try {
        return gn.call(g);
      } catch {
      }
      try {
        return g + "";
      } catch {
      }
    }
    return "";
  }
  function Oe(g) {
    return wt(g, !0, !0);
  }
  function nn(g, B) {
    return g === B || g !== g && B !== B;
  }
  function Ke(g) {
    return Qo(g) && Ne.call(g, "callee") && (!Yt.call(g, "callee") || Ee.call(g) == s);
  }
  var cn = Array.isArray;
  function qr(g) {
    return g != null && $e(g.length) && !lt(g);
  }
  function Qo(g) {
    return po(g) && qr(g);
  }
  var W = ye || Jo;
  function lt(g) {
    var B = Ie(g) ? Ee.call(g) : "";
    return B == f || B == l;
  }
  function $e(g) {
    return typeof g == "number" && g > -1 && g % 1 == 0 && g <= i;
  }
  function Ie(g) {
    var B = typeof g;
    return !!g && (B == "object" || B == "function");
  }
  function po(g) {
    return !!g && typeof g == "object";
  }
  function Tr(g) {
    return qr(g) ? Lr(g) : ho(g);
  }
  function mn() {
    return [];
  }
  function Jo() {
    return !1;
  }
  t.exports = Oe;
})(Ja, Ja.exports);
var yx = Ja.exports;
const ig = /* @__PURE__ */ B0(yx);
var jl;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(jl || (jl = {}));
function wx(t, e) {
  return { type: jl.Address, version: t, hash160: e };
}
function bx(t) {
  return fi.c32address(t.version, t.hash160);
}
const mx = (t) => R2(Zp(t)), xx = (t) => pt(mx(t));
Be.hmacSha256Sync = (t, ...e) => {
  const n = Xp.create(Zp, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Sx(t, e = "mainnet") {
  e = Kp(e), t = typeof t == "string" ? Kt(t) : t;
  const n = _2(Hr.P2PKH, e), r = wx(n, xx(t));
  return bx(r);
}
function Ex(t, e) {
  const n = Qe.decodeToken(t), r = n.payload;
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
  const i = r.issuer.publicKey, s = Sx(i);
  if (e !== i) {
    if (e !== s) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new Qe.TokenVerifier(n.header.alg, i);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function Ax(t, e = null) {
  let n;
  e ? n = Ex(t, e) : n = Qe.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const i = n.payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    i.hasOwnProperty("claim") && (r = i.claim);
  }
  return r;
}
const Gd = "_blockstackDidCheckEchoReply", vx = "echoReply", kx = "authContinuation";
function $x(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [i, s] = r.split("=");
    return n[i] = s ? decodeURIComponent(s.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function Ix() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[Gd];
  if (typeof e == "boolean")
    return e;
  const n = $x(t.location.search), r = n[vx];
  if (r) {
    t[Gd] = !0;
    const i = `echo-reply-${r}`;
    return t.localStorage.setItem(i, "success"), t.setTimeout(() => {
      const s = n[kx];
      t.location.href = s;
    }, 10), !0;
  }
  return !1;
}
class zl {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new F0();
    else
      throw new Vw("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new kd(e.sessionOptions) : this.store = new kd() : e ? this.store = new vd(e.sessionOptions) : this.store = new vd();
  }
  makeAuthRequestToken(e, n, r, i, s, o = Ww().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new Ll("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), i = i || c.scopes, s = s || c.appDomain, d2(e, n, r, i, s, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = f2();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = _u("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (Ix())
        return Mi.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Mi.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = wb()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new ea("Existing user session found.");
    const i = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const s = Qe.decodeToken(e).payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await w2(e))
      throw new ea("Invalid authentication response.");
    let a = s.private_key, c = s.core_token;
    if (Yc(s.version, "1.1.0"))
      if (i !== void 0 && i != null) {
        if (s.private_key !== void 0 && s.private_key !== null)
          try {
            a = await Ed(i, s.private_key);
          } catch {
            if (Mi.warn("Failed decryption of appPrivateKey, will try to use as given"), !Be.isValidPrivateKey(s.private_key))
              throw new ea("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Ed(i, c);
          } catch {
            Mi.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new ea("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = ob, f;
    Yc(s.version, "1.2.0") && s.hubUrl !== null && s.hubUrl !== void 0 && (u = s.hubUrl), Yc(s.version, "1.3.0") && s.associationToken !== null && s.associationToken !== void 0 && (f = s.associationToken);
    const l = {
      profile: s.profile,
      email: s.email,
      decentralizedID: s.iss,
      identityAddress: zp(s.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: s.appPrivateKeyFromWalletSalt,
      coreNode: s.blockstackAPIUrl,
      gaiaAssociationToken: f
    }, w = s.profile_url;
    if (!l.profile && w) {
      const p = await n(w);
      if (!p.ok)
        l.profile = Object.assign({}, Rw);
      else {
        const x = await p.text(), S = JSON.parse(x);
        l.profile = Ax(S[0].token);
      }
    } else
      l.profile = s.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new Ll("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), o1(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), a1(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
zl.prototype.makeAuthRequest = zl.prototype.makeAuthRequestToken;
const Lx = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], Cx = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = Lx(), n = t.filter((r) => e.find((s) => s.id === r.id) ? !1 : !!Mc(r.id));
  return e.concat(n);
}, Mc = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), og = "STX_PROVIDER", Xs = () => typeof window > "u" ? null : window.localStorage.getItem(og), Tx = (t) => {
  typeof window < "u" && window.localStorage.setItem(og, t);
}, Bx = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Mx(t, e) {
  const n = {};
  return Object.assign(n, Bx, e), await fetch(t, n);
}
function Nx(t) {
  let e = Mx, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Px(...t) {
  const { fetchLib: e, middlewares: n } = Nx(t);
  return async (i, s) => {
    let o = { url: i, init: s ?? {} };
    for (const c of n)
      typeof c.pre == "function" && (o = await Promise.resolve(c.pre({
        fetch: e,
        ...o
      })) ?? o);
    let a = await e(o.url, o.init);
    for (const c of n)
      typeof c.post == "function" && (a = await Promise.resolve(c.post({
        fetch: e,
        url: o.url,
        init: o.init,
        response: (a == null ? void 0 : a.clone()) ?? a
      })) ?? a);
    return a;
  };
}
var Zi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Zi || (Zi = {}));
var Ys;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ys || (Ys = {}));
var Kd;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Kd || (Kd = {}));
const _x = "https://api.mainnet.hiro.so", Ux = "https://api.testnet.hiro.so", Hx = "http://localhost:3999", Ox = ["mainnet", "testnet", "devnet", "mocknet"];
class Zs {
  constructor(e) {
    this.version = Ys.Mainnet, this.chainId = Zi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ys.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, i) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(i)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, i) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${i}?proof=0`, this.getMapEntryUrl = (n, r, i) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${i}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Px();
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
Zs.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Rl();
    case "testnet":
      return new Gl();
    case "devnet":
      return new Dx();
    case "mocknet":
      return new ag();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Ox.join(", ")}`);
  }
};
Zs.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Zs.fromName(t);
class Rl extends Zs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? _x,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ys.Mainnet, this.chainId = Zi.Mainnet;
  }
}
class Gl extends Zs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ux,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ys.Testnet, this.chainId = Zi.Testnet;
  }
}
class ag extends Zs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Hx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ys.Testnet, this.chainId = Zi.Testnet;
  }
}
const Dx = ag;
var Qs;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Qs || (Qs = {}));
var tc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(tc || (tc = {}));
Qs.Mainnet;
var Js;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Js || (Js = {}));
var ti;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ti || (ti = {}));
Js.Mainnet;
const Fx = {
  chainId: Qs.Mainnet,
  transactionVersion: Js.Mainnet,
  peerNetworkId: tc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: ti.MainnetSingleSig,
    multiSig: ti.MainnetMultiSig
  },
  client: { baseUrl: H0 }
}, Kl = {
  chainId: Qs.Testnet,
  transactionVersion: Js.Testnet,
  peerNetworkId: tc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: ti.TestnetSingleSig,
    multiSig: ti.TestnetMultiSig
  },
  client: { baseUrl: O0 }
}, Ha = {
  ...Kl,
  addressVersion: { ...Kl.addressVersion },
  magicBytes: "id",
  client: { baseUrl: D0 }
}, jx = {
  ...Ha,
  addressVersion: { ...Ha.addressVersion },
  client: { ...Ha.client }
};
function zx(t) {
  switch (t) {
    case "mainnet":
      return Fx;
    case "testnet":
      return Kl;
    case "devnet":
      return Ha;
    case "mocknet":
      return jx;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Rx(t) {
  return typeof t == "string" ? zx(t) : t;
}
function Gx(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Vd = /* @__PURE__ */ new Map();
function cg(t, e) {
  const n = Vd.get(t);
  if (n !== void 0)
    return n(e);
  const r = Gx(t);
  return Vd.set(t, r), cg(t, e);
}
let ce = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? Kt(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return hb(this.readBytes(4), 0);
  }
  readUInt8() {
    return fb(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return lb(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = pt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = pt(n);
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
    if (cg(e, r))
      return r;
    throw n(r);
  }
};
const Kx = 128, Vx = 128, lg = 16, Fs = 32, Vl = 80, Nc = 65, qx = 32, Wx = 64, ec = 34, Xx = 1 + 16 * 1024 * 1024, Yx = 165, Zx = 16, Qx = 16, Jx = 20, tS = Qx + 2 + Jx, eS = tS + 4, nS = Xx + (Yx + Zx * eS);
var Xt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Xt || (Xt = {}));
var ql;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(ql || (ql = {}));
var Cn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Cn || (Cn = {}));
const rl = ["onChainOnly", "offChainOnly", "any"];
rl[0] + "", Cn.OnChainOnly, rl[1] + "", Cn.OffChainOnly, rl[2] + "", Cn.Any, Cn.OnChainOnly + "", Cn.OnChainOnly, Cn.OffChainOnly + "", Cn.OffChainOnly, Cn.Any + "", Cn.Any;
var nc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(nc || (nc = {}));
var he;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(he || (he = {}));
var Ce;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ce || (Ce = {}));
var se;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(se || (se = {}));
var be;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(be || (be = {}));
var Lo;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Lo || (Lo = {}));
var Wl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Wl || (Wl = {}));
var Xl;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Xl || (Xl = {}));
var dn;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(dn || (dn = {}));
var qd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(qd || (qd = {}));
var Yl;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Yl || (Yl = {}));
var Qn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Qn || (Qn = {}));
var Wd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Wd || (Wd = {}));
let Pc = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Ni = class extends Pc {
  constructor(e) {
    super(e);
  }
}, un = class extends Pc {
  constructor(e) {
    super(e);
  }
}, rc = class extends Pc {
  constructor(e) {
    super(e);
  }
}, _s = class extends Pc {
  constructor(e) {
    super(e);
  }
};
function Zl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function rS(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function ug(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function sS(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Zl(t.outputLen), Zl(t.blockLen);
}
function iS(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function oS(t, e) {
  ug(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Us = {
  number: Zl,
  bool: rS,
  bytes: ug,
  hash: sS,
  exists: iS,
  output: oS
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const sl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), fr = (t, e) => t << 32 - e | t >>> e, aS = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!aS)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function cS(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function nf(t) {
  if (typeof t == "string" && (t = cS(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let fg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function di(t) {
  const e = (r) => t().update(nf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let dg = class extends fg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Us.hash(e);
    const r = nf(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const i = this.blockLen, s = new Uint8Array(i);
    s.set(r.length > i ? e.create().update(r).digest() : r);
    for (let o = 0; o < s.length; o++)
      s[o] ^= 54;
    this.iHash.update(s), this.oHash = e.create();
    for (let o = 0; o < s.length; o++)
      s[o] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(e) {
    return Us.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Us.exists(this), Us.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: i, destroyed: s, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = i, e.destroyed = s, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const hg = (t, e, n) => new dg(t, e).update(n).digest();
hg.create = (t, e) => new dg(t, e);
function lS(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let rf = class extends fg {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = sl(this.buffer);
  }
  update(e) {
    Us.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = nf(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = sl(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Us.exists(this), Us.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    lS(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = sl(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, f[l], s);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: a } = this;
    return e.length = i, e.pos = a, e.finished = s, e.destroyed = o, i % n && e.buffer.set(r), e;
  }
};
const uS = (t, e, n) => t & e ^ ~t & n, fS = (t, e, n) => t & e ^ t & n ^ e & n, dS = new Uint32Array([
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
]), is = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), os = new Uint32Array(64);
let pg = class extends rf {
  constructor() {
    super(64, 32, 8, !1), this.A = is[0] | 0, this.B = is[1] | 0, this.C = is[2] | 0, this.D = is[3] | 0, this.E = is[4] | 0, this.F = is[5] | 0, this.G = is[6] | 0, this.H = is[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: i, E: s, F: o, G: a, H: c } = this;
    return [e, n, r, i, s, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      os[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const w = os[l - 15], p = os[l - 2], x = fr(w, 7) ^ fr(w, 18) ^ w >>> 3, S = fr(p, 17) ^ fr(p, 19) ^ p >>> 10;
      os[l] = S + os[l - 7] + x + os[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const w = fr(a, 6) ^ fr(a, 11) ^ fr(a, 25), p = f + w + uS(a, c, u) + dS[l] + os[l] | 0, S = (fr(r, 2) ^ fr(r, 13) ^ fr(r, 22)) + fS(r, i, s) | 0;
      f = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + S | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, i, s, o, a, c, u, f);
  }
  roundClean() {
    os.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, hS = class extends pg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const sf = di(() => new pg());
di(() => new hS());
const pS = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), gg = Uint8Array.from({ length: 16 }, (t, e) => e), gS = gg.map((t) => (9 * t + 5) % 16);
let of = [gg], af = [gS];
for (let t = 0; t < 4; t++)
  for (let e of [of, af])
    e.push(e[t].map((n) => pS[n]));
const yg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), yS = of.map((t, e) => t.map((n) => yg[e][n])), wS = af.map((t, e) => t.map((n) => yg[e][n])), bS = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), mS = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), pa = (t, e) => t << e | t >>> 32 - e;
function Xd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ga = new Uint32Array(16);
let xS = class extends rf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: i, h4: s } = this;
    return [e, n, r, i, s];
  }
  set(e, n, r, i, s) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = i | 0, this.h4 = s | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      ga[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, w = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, S = bS[p], M = mS[p], j = of[p], z = af[p], A = yS[p], _ = wS[p];
      for (let N = 0; N < 16; N++) {
        const Q = pa(r + Xd(p, s, a, u) + ga[j[N]] + S, A[N]) + l | 0;
        r = l, l = u, u = pa(a, 10) | 0, a = s, s = Q;
      }
      for (let N = 0; N < 16; N++) {
        const Q = pa(i + Xd(x, o, c, f) + ga[z[N]] + M, _[N]) + w | 0;
        i = w, w = f, f = pa(c, 10) | 0, c = o, o = Q;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + w | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    ga.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const SS = di(() => new xS()), ya = BigInt(2 ** 32 - 1), Ql = BigInt(32);
function wg(t, e = !1) {
  return e ? { h: Number(t & ya), l: Number(t >> Ql & ya) } : { h: Number(t >> Ql & ya) | 0, l: Number(t & ya) | 0 };
}
function ES(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = wg(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const AS = (t, e) => BigInt(t >>> 0) << Ql | BigInt(e >>> 0), vS = (t, e, n) => t >>> n, kS = (t, e, n) => t << 32 - n | e >>> n, $S = (t, e, n) => t >>> n | e << 32 - n, IS = (t, e, n) => t << 32 - n | e >>> n, LS = (t, e, n) => t << 64 - n | e >>> n - 32, CS = (t, e, n) => t >>> n - 32 | e << 64 - n, TS = (t, e) => e, BS = (t, e) => t, MS = (t, e, n) => t << n | e >>> 32 - n, NS = (t, e, n) => e << n | t >>> 32 - n, PS = (t, e, n) => e << n - 32 | t >>> 64 - n, _S = (t, e, n) => t << n - 32 | e >>> 64 - n;
function US(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const HS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), OS = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, DS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), FS = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, jS = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), zS = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, Tt = {
  fromBig: wg,
  split: ES,
  toBig: AS,
  shrSH: vS,
  shrSL: kS,
  rotrSH: $S,
  rotrSL: IS,
  rotrBH: LS,
  rotrBL: CS,
  rotr32H: TS,
  rotr32L: BS,
  rotlSH: MS,
  rotlSL: NS,
  rotlBH: PS,
  rotlBL: _S,
  add: US,
  add3L: HS,
  add3H: OS,
  add4L: DS,
  add4H: FS,
  add5H: zS,
  add5L: jS
}, [RS, GS] = Tt.split([
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
].map((t) => BigInt(t))), as = new Uint32Array(80), cs = new Uint32Array(80);
let _c = class extends rf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: w, Gh: p, Gl: x, Hh: S, Hl: M } = this;
    return [e, n, r, i, s, o, a, c, u, f, l, w, p, x, S, M];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, f, l, w, p, x, S, M) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = w | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = S | 0, this.Hl = M | 0;
  }
  process(e, n) {
    for (let A = 0; A < 16; A++, n += 4)
      as[A] = e.getUint32(n), cs[A] = e.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const _ = as[A - 15] | 0, N = cs[A - 15] | 0, Q = Tt.rotrSH(_, N, 1) ^ Tt.rotrSH(_, N, 8) ^ Tt.shrSH(_, N, 7), tt = Tt.rotrSL(_, N, 1) ^ Tt.rotrSL(_, N, 8) ^ Tt.shrSL(_, N, 7), R = as[A - 2] | 0, K = cs[A - 2] | 0, L = Tt.rotrSH(R, K, 19) ^ Tt.rotrBH(R, K, 61) ^ Tt.shrSH(R, K, 6), P = Tt.rotrSL(R, K, 19) ^ Tt.rotrBL(R, K, 61) ^ Tt.shrSL(R, K, 6), b = Tt.add4L(tt, P, cs[A - 7], cs[A - 16]), T = Tt.add4H(b, Q, L, as[A - 7], as[A - 16]);
      as[A] = T | 0, cs[A] = b | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: w, Fh: p, Fl: x, Gh: S, Gl: M, Hh: j, Hl: z } = this;
    for (let A = 0; A < 80; A++) {
      const _ = Tt.rotrSH(l, w, 14) ^ Tt.rotrSH(l, w, 18) ^ Tt.rotrBH(l, w, 41), N = Tt.rotrSL(l, w, 14) ^ Tt.rotrSL(l, w, 18) ^ Tt.rotrBL(l, w, 41), Q = l & p ^ ~l & S, tt = w & x ^ ~w & M, R = Tt.add5L(z, N, tt, GS[A], cs[A]), K = Tt.add5H(R, j, _, Q, RS[A], as[A]), L = R | 0, P = Tt.rotrSH(r, i, 28) ^ Tt.rotrBH(r, i, 34) ^ Tt.rotrBH(r, i, 39), b = Tt.rotrSL(r, i, 28) ^ Tt.rotrBL(r, i, 34) ^ Tt.rotrBL(r, i, 39), T = r & s ^ r & a ^ s & a, H = i & o ^ i & c ^ o & c;
      j = S | 0, z = M | 0, S = p | 0, M = x | 0, p = l | 0, x = w | 0, { h: l, l: w } = Tt.add(u | 0, f | 0, K | 0, L | 0), u = a | 0, f = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const C = Tt.add3L(L, b, H);
      r = Tt.add3H(C, K, P, T), i = C | 0;
    }
    ({ h: r, l: i } = Tt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = Tt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = Tt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Tt.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: w } = Tt.add(this.Eh | 0, this.El | 0, l | 0, w | 0), { h: p, l: x } = Tt.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: S, l: M } = Tt.add(this.Gh | 0, this.Gl | 0, S | 0, M | 0), { h: j, l: z } = Tt.add(this.Hh | 0, this.Hl | 0, j | 0, z | 0), this.set(r, i, s, o, a, c, u, f, l, w, p, x, S, M, j, z);
  }
  roundClean() {
    as.fill(0), cs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, KS = class extends _c {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, VS = class extends _c {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, qS = class extends _c {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
di(() => new _c());
di(() => new KS());
const WS = di(() => new VS());
di(() => new qS());
var Ot;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(Ot || (Ot = {}));
var Fe;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Fe || (Fe = {}));
function cf(t) {
  return Fe[t];
}
const XS = () => ({ type: Ot.BoolTrue }), YS = () => ({ type: Ot.BoolFalse }), ZS = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Ot.Buffer, value: pt(t) };
}, Yd = BigInt("0xffffffffffffffffffffffffffffffff"), QS = BigInt(0), Zd = BigInt("0x7fffffffffffffffffffffffffffffff"), Qd = BigInt("-170141183460469231731687303715884105728"), JS = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = Tl(Kt(t))), vn(t, Uint8Array) && (t = Tl(t));
  const e = an(t);
  if (e > Zd)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Zd}`);
  if (e < Qd)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Qd}`);
  return { type: Ot.Int, value: e };
}, t3 = (t) => {
  const e = an(t);
  if (e < QS)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Yd)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Yd}`);
  return { type: Ot.UInt, value: e };
};
function e3(t) {
  return { type: Ot.List, value: t };
}
function bg() {
  return { type: Ot.OptionalNone };
}
function mg(t) {
  return { type: Ot.OptionalSome, value: t };
}
var st;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(st || (st = {}));
function n3() {
  return {
    type: st.Address,
    version: ti.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Jd(t) {
  if (t && Lg(t, ec))
    throw new Error(`Memo exceeds maximum length of ${ec} bytes`);
  return { type: st.MemoString, content: t };
}
function lf(t, e) {
  return {
    type: st.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Jl(t) {
  if (Kt(t).byteLength != Nc)
    throw Error("Invalid signature");
  return {
    type: st.MessageSignature,
    data: t
  };
}
function r3(t, e, n) {
  return typeof t == "string" && (t = m3(t)), typeof n == "string" && (n = Jd(n)), {
    type: st.Payload,
    payloadType: Xt.TokenTransfer,
    recipient: t,
    amount: an(e),
    memo: n ?? Jd("")
  };
}
function s3(t, e, n, r) {
  return typeof e == "string" && (e = er(e)), typeof n == "string" && (n = er(n)), {
    type: st.Payload,
    payloadType: Xt.ContractCall,
    contractAddress: typeof t == "string" ? Is(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function i3(t) {
  return er(t, 4, 1e5);
}
function th(t, e, n) {
  return typeof t == "string" && (t = er(t)), typeof e == "string" && (e = i3(e)), typeof n == "number" ? {
    type: st.Payload,
    payloadType: Xt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: st.Payload,
    payloadType: Xt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function o3() {
  return { type: st.Payload, payloadType: Xt.PoisonMicroblock };
}
function eh(t, e) {
  if (t.byteLength != Fs)
    throw Error(`Coinbase buffer size must be ${Fs} bytes`);
  return e != null ? {
    type: st.Payload,
    payloadType: Xt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: st.Payload,
    payloadType: Xt.Coinbase,
    coinbaseBytes: t
  };
}
function a3(t, e, n) {
  if (t.byteLength != Fs)
    throw Error(`Coinbase buffer size must be ${Fs} bytes`);
  if (n.byteLength != Vl)
    throw Error(`VRF proof buffer size must be ${Vl} bytes`);
  return {
    type: st.Payload,
    payloadType: Xt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Ot.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function c3(t, e, n, r, i, s, o) {
  return {
    type: st.Payload,
    payloadType: Xt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: i,
    cause: s,
    publicKeyHash: o
  };
}
function er(t, e, n) {
  const r = e || 1, i = n || Kx;
  if (Lg(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: st.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: i
  };
}
function l3(t, e, n) {
  return {
    type: st.Asset,
    address: Is(t),
    contractName: er(e),
    assetName: er(n)
  };
}
function Is(t) {
  const e = fi.c32addressDecode(t);
  return {
    type: st.Address,
    version: e[0],
    hash160: e[1]
  };
}
function u3(t, e) {
  const n = Is(t), r = er(e);
  return {
    type: st.Principal,
    prefix: dn.Contract,
    address: n,
    contractName: r
  };
}
function f3(t) {
  const e = Is(t);
  return {
    type: st.Principal,
    prefix: dn.Standard,
    address: e
  };
}
function Pi(t, e) {
  return {
    pubKeyEncoding: t,
    type: st.TransactionAuthField,
    contents: e
  };
}
function _r(t) {
  switch (t.type) {
    case st.Address:
      return Xo(t);
    case st.Principal:
      return xg(t);
    case st.LengthPrefixedString:
      return Ji(t);
    case st.MemoString:
      return h3(t);
    case st.Asset:
      return Eg(t);
    case st.PostCondition:
      return vg(t);
    case st.PublicKey:
      return nu(t);
    case st.LengthPrefixedList:
      return uf(t);
    case st.Payload:
      return kg(t);
    case st.TransactionAuthField:
      return b3(t);
    case st.MessageSignature:
      return ff(t);
  }
}
function Xo(t) {
  const e = [];
  return e.push(Kt(Ro(t.version, 1))), e.push(Kt(t.hash160)), Ue(e);
}
function Qi(t) {
  const e = vn(t, ce) ? t : new ce(t), n = xc(pt(e.readBytes(1))), r = pt(e.readBytes(20));
  return { type: st.Address, version: n, hash160: r };
}
function xg(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === dn.Standard || t.prefix === dn.Contract) && e.push(Xo(t.address)), t.prefix === dn.Contract && e.push(Ji(t.contractName)), Ue(e);
}
function d3(t) {
  const e = vn(t, ce) ? t : new ce(t), n = e.readUInt8Enum(dn, (s) => {
    throw new un(`Unexpected Principal payload type: ${s}`);
  });
  if (n === dn.Origin)
    return { type: st.Principal, prefix: n };
  const r = Qi(e);
  if (n === dn.Standard)
    return { type: st.Principal, prefix: n, address: r };
  const i = Rn(e);
  return {
    type: st.Principal,
    prefix: n,
    address: r,
    contractName: i
  };
}
function Ji(t) {
  const e = [], n = ai(t.content), r = n.byteLength;
  return e.push(Kt(Ro(r, t.lengthPrefixBytes))), e.push(n), Ue(e);
}
function Rn(t, e, n) {
  e = e || 1;
  const r = vn(t, ce) ? t : new ce(t), i = xc(pt(r.readBytes(e))), s = Go(r.readBytes(i));
  return er(s, e, n ?? 128);
}
function h3(t) {
  const e = [], n = ai(t.content), r = j3(pt(n), ec * 2);
  return e.push(Kt(r)), Ue(e);
}
function Sg(t) {
  const e = vn(t, ce) ? t : new ce(t);
  let n = Go(e.readBytes(ec));
  return n = n.replace(/\u0000*$/, ""), { type: st.MemoString, content: n };
}
function Eg(t) {
  const e = [];
  return e.push(Xo(t.address)), e.push(Ji(t.contractName)), e.push(Ji(t.assetName)), Ue(e);
}
function tu(t) {
  const e = vn(t, ce) ? t : new ce(t);
  return {
    type: st.Asset,
    address: Qi(e),
    contractName: Rn(e),
    assetName: Rn(e)
  };
}
function uf(t) {
  const e = t.values, n = [];
  n.push(Kt(Ro(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(_r(r));
  return Ue(n);
}
function Ag(t, e, n) {
  const r = vn(t, ce) ? t : new ce(t), i = xc(pt(r.readBytes(4))), s = [];
  for (let o = 0; o < i; o++)
    switch (e) {
      case st.Address:
        s.push(Qi(r));
        break;
      case st.LengthPrefixedString:
        s.push(Rn(r));
        break;
      case st.MemoString:
        s.push(Sg(r));
        break;
      case st.Asset:
        s.push(tu(r));
        break;
      case st.PostCondition:
        s.push(g3(r));
        break;
      case st.PublicKey:
        s.push(ru(r));
        break;
      case st.TransactionAuthField:
        s.push(w3(r));
        break;
    }
  return lf(s, n);
}
function p3(t) {
  return pt(vg(t));
}
function vg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(xg(t.principal)), (t.conditionType === he.Fungible || t.conditionType === he.NonFungible) && e.push(Eg(t.asset)), t.conditionType === he.NonFungible && e.push(mr(t.assetName)), e.push(t.conditionCode), t.conditionType === he.STX || t.conditionType === he.Fungible || t.conditionType === he.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Ni("The post-condition amount may not be larger than 8 bytes");
    e.push(ks(t.amount, 8));
  }
  return Ue(e);
}
function g3(t) {
  const e = vn(t, ce) ? t : new ce(t), n = e.readUInt8Enum(he, (a) => {
    throw new un(`Could not read ${a} as PostConditionType`);
  }), r = d3(e);
  let i, s, o;
  switch (n) {
    case he.STX:
      return i = e.readUInt8Enum(Lo, (c) => {
        throw new un(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${pt(e.readBytes(8))}`), {
        type: st.PostCondition,
        conditionType: he.STX,
        principal: r,
        conditionCode: i,
        amount: o
      };
    case he.Fungible:
      return s = tu(e), i = e.readUInt8Enum(Lo, (c) => {
        throw new un(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${pt(e.readBytes(8))}`), {
        type: st.PostCondition,
        conditionType: he.Fungible,
        principal: r,
        conditionCode: i,
        amount: o,
        asset: s
      };
    case he.NonFungible:
      s = tu(e);
      const a = yr(e);
      return i = e.readUInt8Enum(Wl, (c) => {
        throw new un(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: st.PostCondition,
        conditionType: he.NonFungible,
        principal: r,
        conditionCode: i,
        asset: s,
        assetName: a
      };
    case he.Staking:
      return i = e.readUInt8Enum(Lo, (c) => {
        throw new un(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${pt(e.readBytes(8))}`), {
        type: st.PostCondition,
        conditionType: he.Staking,
        principal: r,
        conditionCode: i,
        amount: o
      };
    case he.PoX: {
      const c = e.readUInt8Enum(Xl, (u) => {
        throw new un(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: st.PostCondition,
        conditionType: he.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function kg(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Xt.TokenTransfer:
      e.push(mr(t.recipient)), e.push(ks(t.amount, 8)), e.push(_r(t.memo));
      break;
    case Xt.ContractCall:
      e.push(_r(t.contractAddress)), e.push(_r(t.contractName)), e.push(_r(t.functionName));
      const n = new Uint8Array(4);
      Gs(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(mr(r));
      });
      break;
    case Xt.SmartContract:
      e.push(_r(t.contractName)), e.push(_r(t.codeBody));
      break;
    case Xt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(_r(t.contractName)), e.push(_r(t.codeBody));
      break;
    case Xt.PoisonMicroblock:
      break;
    case Xt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Xt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(mr(t.recipient));
      break;
    case Xt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(mr(t.recipient ? mg(t.recipient) : bg())), e.push(t.vrfProof);
      break;
    case Xt.TenureChange:
      e.push(Kt(t.tenureHash)), e.push(Kt(t.previousTenureHash)), e.push(Kt(t.burnViewHash)), e.push(Kt(t.previousTenureEnd)), e.push(Gs(new Uint8Array(4), t.previousTenureBlocks)), e.push(db(new Uint8Array(1), t.cause)), e.push(Kt(t.publicKeyHash));
      break;
  }
  return Ue(e);
}
function y3(t) {
  const e = vn(t, ce) ? t : new ce(t);
  switch (e.readUInt8Enum(Xt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case Xt.TokenTransfer:
      const r = yr(e), i = an(e.readBytes(8)), s = Sg(e);
      return r3(r, i, s);
    case Xt.ContractCall:
      const o = Qi(e), a = Rn(e), c = Rn(e), u = [], f = e.readUInt32BE();
      for (let _ = 0; _ < f; _++) {
        const N = yr(e);
        u.push(N);
      }
      return s3(o, a, c, u);
    case Xt.SmartContract:
      const l = Rn(e), w = Rn(e, 4, 1e5);
      return th(l, w);
    case Xt.VersionedSmartContract: {
      const _ = e.readUInt8Enum(ql, (tt) => {
        throw new Error(`Cannot recognize ClarityVersion: ${tt}`);
      }), N = Rn(e), Q = Rn(e, 4, nS);
      return th(N, Q, _);
    }
    case Xt.PoisonMicroblock:
      return o3();
    case Xt.Coinbase: {
      const _ = e.readBytes(Fs);
      return eh(_);
    }
    case Xt.CoinbaseToAltRecipient: {
      const _ = e.readBytes(Fs), N = yr(e);
      return eh(_, N);
    }
    case Xt.NakamotoCoinbase: {
      const _ = e.readBytes(Fs), N = yr(e), Q = e.readBytes(Vl);
      return a3(_, N, Q);
    }
    case Xt.TenureChange:
      const p = pt(e.readBytes(20)), x = pt(e.readBytes(20)), S = pt(e.readBytes(20)), M = pt(e.readBytes(32)), j = e.readUInt32BE(), z = e.readUInt8Enum(Yl, (_) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${_}`);
      }), A = pt(e.readBytes(20));
      return c3(p, x, S, M, j, z, A);
  }
}
function eu(t) {
  const e = vn(t, ce) ? t : new ce(t);
  return Jl(pt(e.readBytes(Nc)));
}
function w3(t) {
  const e = vn(t, ce) ? t : new ce(t), n = e.readUInt8Enum(Qn, (r) => {
    throw new un(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case Qn.PublicKeyCompressed:
      return Pi(be.Compressed, ru(e));
    case Qn.PublicKeyUncompressed:
      return Pi(be.Uncompressed, ao(Q3(ru(e).data)));
    case Qn.SignatureCompressed:
      return Pi(be.Compressed, eu(e));
    case Qn.SignatureUncompressed:
      return Pi(be.Uncompressed, eu(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function ff(t) {
  return Kt(t.data);
}
function b3(t) {
  const e = [];
  switch (t.contents.type) {
    case st.PublicKey:
      e.push(t.pubKeyEncoding === be.Compressed ? Qn.PublicKeyCompressed : Qn.PublicKeyUncompressed), e.push(Kt(Z3(t.contents.data)));
      break;
    case st.MessageSignature:
      e.push(t.pubKeyEncoding === be.Compressed ? Qn.SignatureCompressed : Qn.SignatureUncompressed), e.push(ff(t.contents));
      break;
  }
  return Ue(e);
}
function nu(t) {
  return t.data.slice();
}
function ru(t) {
  const e = vn(t, ce) ? t : new ce(t), n = e.readUInt8(), r = n === 4 ? Wx : qx;
  return ao(Ue([n, e.readBytes(r)]));
}
function df(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === se.P2PKH || e === se.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === se.P2WPKH || e === se.P2WSH || e === se.P2WSHNonSequential) && !r.map((i) => i.data).every(co))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case se.P2PKH:
      return wa(t, z3(r[0].data));
    case se.P2WPKH:
      return wa(t, R3(r[0].data));
    case se.P2SH:
    case se.P2SHNonSequential:
      return wa(t, G3(n, r.map(nu)));
    case se.P2WSH:
    case se.P2WSHNonSequential:
      return wa(t, K3(n, r.map(nu)));
  }
}
function wa(t, e) {
  return { type: st.Address, version: t, hash160: e };
}
function hf(t) {
  return fi.c32address(t.version, t.hash160);
}
function nh(t) {
  const [e, n, r] = t.split(/\.|::/);
  return l3(e, n, r);
}
function bo(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return u3(e, n);
  } else
    return f3(t);
}
function m3(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return E3(e, n);
  } else
    return x3(t);
}
function x3(t) {
  const e = Is(t);
  return { type: Ot.PrincipalStandard, value: hf(e) };
}
function S3(t) {
  return { type: Ot.PrincipalStandard, value: hf(t) };
}
function E3(t, e) {
  const n = Is(t), r = er(e);
  return $g(n, r);
}
function $g(t, e) {
  if (ai(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: Ot.PrincipalContract,
    value: `${hf(t)}.${e.content}`
  };
}
function A3(t) {
  return { type: Ot.ResponseErr, value: t };
}
function v3(t) {
  return { type: Ot.ResponseOk, value: t };
}
const k3 = (t) => ({ type: Ot.StringASCII, value: t }), $3 = (t) => ({ type: Ot.StringUTF8, value: t });
function I3(t) {
  for (const e in t)
    if (!V3(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Ot.Tuple, value: t };
}
function yr(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new ce(Kt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new ce(t) : e = t;
  switch (e.readUInt8Enum(Fe, (r) => {
    throw new un(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Fe.int:
      return JS(Tl(e.readBytes(16)));
    case Fe.uint:
      return t3(e.readBytes(16));
    case Fe.buffer:
      const r = e.readUInt32BE();
      return ZS(e.readBytes(r));
    case Fe.true:
      return XS();
    case Fe.false:
      return YS();
    case Fe.address:
      const i = Qi(e);
      return S3(i);
    case Fe.contract:
      const s = Qi(e), o = Rn(e);
      return $g(s, o);
    case Fe.ok:
      return v3(yr(e));
    case Fe.err:
      return A3(yr(e));
    case Fe.none:
      return bg();
    case Fe.some:
      return mg(yr(e));
    case Fe.list:
      const a = e.readUInt32BE(), c = [];
      for (let S = 0; S < a; S++)
        c.push(yr(e));
      return e3(c);
    case Fe.tuple:
      const u = e.readUInt32BE(), f = {};
      for (let S = 0; S < u; S++) {
        const M = Rn(e).content;
        if (M === void 0)
          throw new un('"content" is undefined');
        f[M] = yr(e);
      }
      return I3(f);
    case Fe.ascii:
      const l = e.readUInt32BE(), w = sb(e.readBytes(l));
      return k3(w);
    case Fe.utf8:
      const p = e.readUInt32BE(), x = Go(e.readBytes(p));
      return $3(x);
    default:
      throw new un("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function vr(t, e) {
  return Ue([cf(t), e]);
}
function L3(t) {
  return new Uint8Array([cf(t.type)]);
}
function C3(t) {
  return t.type === Ot.OptionalNone ? new Uint8Array([cf(t.type)]) : vr(t.type, mr(t.value));
}
function T3(t) {
  const e = new Uint8Array(4);
  return Gs(e, Math.ceil(t.value.length / 2), 0), vr(t.type, Er(e, Kt(t.value)));
}
function B3(t) {
  const e = Uu(Jw(BigInt(t.value), BigInt(Vx)), lg);
  return vr(t.type, e);
}
function M3(t) {
  const e = Uu(BigInt(t.value), lg);
  return vr(t.type, e);
}
function N3(t) {
  return vr(t.type, Xo(Is(t.value)));
}
function P3(t) {
  const [e, n] = q3(t.value);
  return vr(t.type, Er(Xo(Is(e)), Ji(er(n))));
}
function _3(t) {
  return vr(t.type, mr(t.value));
}
function U3(t) {
  const e = [], n = new Uint8Array(4);
  Gs(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const i = mr(r);
    e.push(i);
  }
  return vr(t.type, Ue(e));
}
function H3(t) {
  const e = [], n = new Uint8Array(4);
  Gs(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = er(i);
    e.push(Ji(s));
    const o = mr(t.value[i]);
    e.push(o);
  }
  return vr(t.type, Ue(e));
}
function Ig(t, e) {
  const n = [], r = e == "ascii" ? rb(t.value) : ai(t.value), i = new Uint8Array(4);
  return Gs(i, r.length, 0), n.push(i), n.push(r), vr(t.type, Ue(n));
}
function O3(t) {
  return Ig(t, "ascii");
}
function D3(t) {
  return Ig(t, "utf8");
}
function rh(t) {
  return pt(mr(t));
}
function mr(t) {
  switch (t.type) {
    case Ot.BoolTrue:
    case Ot.BoolFalse:
      return L3(t);
    case Ot.OptionalNone:
    case Ot.OptionalSome:
      return C3(t);
    case Ot.Buffer:
      return T3(t);
    case Ot.UInt:
      return M3(t);
    case Ot.Int:
      return B3(t);
    case Ot.PrincipalStandard:
      return N3(t);
    case Ot.PrincipalContract:
      return P3(t);
    case Ot.ResponseOk:
    case Ot.ResponseErr:
      return _3(t);
    case Ot.List:
      return U3(t);
    case Ot.Tuple:
      return H3(t);
    case Ot.StringASCII:
      return O3(t);
    case Ot.StringUTF8:
      return D3(t);
    default:
      throw new Ni("Unable to serialize. Invalid Clarity Value.");
  }
}
const F3 = (t) => t.length % 2 ? `0${t}` : t, j3 = (t, e) => t.padEnd(e, "0"), Lg = (t, e) => t ? ai(t).length > e : !1;
function su(t) {
  return ig(t);
}
const No = (t) => SS(sf(t)), pf = (t) => pt(WS(t)), z3 = (t) => pt(No(t)), R3 = (t) => {
  const e = No(t), n = Er(new Uint8Array([0]), new Uint8Array([e.length]), e), r = No(n);
  return pt(r);
}, G3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + e.length), n.push(174);
  const r = Ue(n), i = No(r);
  return pt(i);
}, K3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Ue(n), i = sf(r), s = [];
  s.push(0), s.push(i.length), s.push(i);
  const o = Ue(s), a = No(o);
  return pt(a);
};
function V3(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function q3(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
Be.hmacSha256Sync = (t, ...e) => {
  const n = hg.create(sf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function ao(t) {
  return t = typeof t == "string" ? Kt(t) : t, {
    type: st.PublicKey,
    data: t
  };
}
function W3(t, e, n = be.Compressed) {
  const r = cb(e), i = new Pn(rd(r.r), rd(r.s)), s = Ut.fromSignature(t, i, r.recoveryId), o = n === be.Compressed;
  return s.toHex(o);
}
function X3(t) {
  return typeof t == "string" ? t : pt(t);
}
const gf = X3;
function Cg(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === ab;
}
function co(t) {
  return !gf(t).startsWith("04");
}
function Y3(t) {
  t = Hu(t);
  const e = Cg(t);
  return pt(Ko(t.slice(0, 32), e));
}
function Z3(t) {
  return Ut.fromHex(gf(t)).toHex(!0);
}
function Q3(t) {
  return Ut.fromHex(gf(t)).toHex(!1);
}
function J3(t, e) {
  t = Hu(t);
  const [n, r] = Ec(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Ro(r, 1) + Pn.fromHex(n).toCompactHex();
}
function yf() {
  return {
    type: st.MessageSignature,
    data: pt(new Uint8Array(Nc))
  };
}
function Tg(t, e, n, r) {
  const i = df(0, t, 1, [ao(e)]).hash160, s = co(e) ? be.Compressed : be.Uncompressed;
  return {
    hashMode: t,
    signer: i,
    nonce: an(n),
    fee: an(r),
    keyEncoding: s,
    signature: yf()
  };
}
function Po(t) {
  return "signature" in t;
}
function sh(t) {
  return t === se.P2SH || t === se.P2WSH;
}
function tE(t) {
  return t === se.P2SHNonSequential || t === se.P2WSHNonSequential;
}
function ih(t) {
  const e = su(t);
  return e.nonce = 0, e.fee = 0, Po(e) ? e.signature = yf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function eE(t) {
  const e = [
    t.hashMode,
    Kt(t.signer),
    ks(t.nonce, 8),
    ks(t.fee, 8),
    t.keyEncoding,
    ff(t.signature)
  ];
  return Ue(e);
}
function nE(t) {
  const e = [
    t.hashMode,
    Kt(t.signer),
    ks(t.nonce, 8),
    ks(t.fee, 8)
  ], n = lf(t.fields);
  e.push(uf(n));
  const r = new Uint8Array(2);
  return ub(r, t.signaturesRequired, 0), e.push(r), Ue(e);
}
function rE(t, e) {
  const n = pt(e.readBytes(20)), r = BigInt(`0x${pt(e.readBytes(8))}`), i = BigInt(`0x${pt(e.readBytes(8))}`), s = e.readUInt8Enum(be, (a) => {
    throw new un(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === se.P2WPKH && s != be.Compressed)
    throw new un("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = eu(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    keyEncoding: s,
    signature: o
  };
}
function sE(t, e) {
  const n = pt(e.readBytes(20)), r = BigInt("0x" + pt(e.readBytes(8))), i = BigInt("0x" + pt(e.readBytes(8))), s = Ag(e, st.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of s)
    switch (u.contents.type) {
      case st.PublicKey:
        co(u.contents.data) || (o = !0);
        break;
      case st.MessageSignature:
        if (u.pubKeyEncoding === be.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new _s("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === se.P2WSH || t === se.P2WSHNonSequential))
    throw new _s("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    fields: s,
    signaturesRequired: c
  };
}
function il(t) {
  return Po(t) ? eE(t) : nE(t);
}
function ol(t) {
  const e = t.readUInt8Enum(se, (n) => {
    throw new un(`Could not parse ${n} as AddressHashMode`);
  });
  return e === se.P2PKH || e === se.P2WPKH ? rE(e, t) : sE(e, t);
}
function Bg(t, e, n, r) {
  const s = t + pt(new Uint8Array([e])) + pt(ks(n, 8)) + pt(ks(r, 8));
  if (Kt(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return pf(Kt(s));
}
function Mg(t, e, n) {
  const r = 33 + Nc, i = co(e.data) ? be.Compressed : be.Uncompressed, s = t + F3(i.toString(16)) + n, o = Kt(s);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return pf(o);
}
function iE(t, e, n, r, i) {
  const s = Bg(t, e, n, r), o = J3(i, s), a = ao(Y3(i)), c = Mg(s, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Ng(t, e, n, r, i, s) {
  const o = Bg(t, e, n, r), a = ao(W3(o, s, i)), c = Mg(o, a, s);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function oE() {
  const t = Tg(se.P2PKH, "", 0, 0);
  return t.signer = n3().hash160, t.keyEncoding = be.Compressed, t.signature = yf(), t;
}
function oh(t, e, n) {
  return Po(t) ? aE(t, e, n) : cE(t, e, n);
}
function aE(t, e, n) {
  const { pubKey: r, nextSigHash: i } = Ng(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), s = df(0, t.hashMode, 1, [r]).hash160;
  if (s !== t.signer)
    throw new _s(`Signer hash does not equal hash of public key(s): ${s} != ${t.signer}`);
  return i;
}
function cE(t, e, n) {
  const r = [];
  let i = e, s = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case st.PublicKey:
        co(c.contents.data) || (s = !0), r.push(c.contents);
        break;
      case st.MessageSignature:
        c.pubKeyEncoding === be.Uncompressed && (s = !0);
        const { pubKey: u, nextSigHash: f } = Ng(i, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (sh(t.hashMode) && (i = f), r.push(u), o += 1, o === 65536)
          throw new _s("Too many signatures");
        break;
    }
  if (sh(t.hashMode) && o !== t.signaturesRequired || tE(t.hashMode) && o < t.signaturesRequired)
    throw new _s("Incorrect number of signatures");
  if (s && (t.hashMode === se.P2WSH || t.hashMode === se.P2WSHNonSequential))
    throw new _s("Uncompressed keys are not allowed in this hash mode");
  const a = df(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new _s(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return i;
}
function Pg(t) {
  return {
    authType: Ce.Standard,
    spendingCondition: t
  };
}
function _g(t, e) {
  return {
    authType: Ce.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Tg(se.P2PKH, "0".repeat(66), 0, 0)
  };
}
function ah(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Ce.Standard:
        return Pg(ih(t.spendingCondition));
      case Ce.Sponsored:
        return _g(ih(t.spendingCondition), oE());
      default:
        throw new rc("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function lE(t, e) {
  switch (t.authType) {
    case Ce.Standard:
      return oh(t.spendingCondition, e, Ce.Standard);
    case Ce.Sponsored:
      return oh(t.spendingCondition, e, Ce.Standard);
    default:
      throw new rc("Invalid origin auth type");
  }
}
function uE(t, e) {
  switch (t.authType) {
    case Ce.Standard:
      const n = {
        ...t.spendingCondition,
        fee: an(e)
      };
      return { ...t, spendingCondition: n };
    case Ce.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: an(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function fE(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: an(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function dE(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: an(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function hE(t, e) {
  const n = {
    ...e,
    nonce: an(e.nonce),
    fee: an(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function pE(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Ce.Standard:
      e.push(il(t.spendingCondition));
      break;
    case Ce.Sponsored:
      e.push(il(t.spendingCondition)), e.push(il(t.sponsorSpendingCondition));
      break;
  }
  return Ue(e);
}
function gE(t) {
  const e = t.readUInt8Enum(Ce, (r) => {
    throw new un(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Ce.Standard:
      return n = ol(t), Pg(n);
    case Ce.Sponsored:
      n = ol(t);
      const r = ol(t);
      return _g(n, r);
  }
}
class yE {
  constructor({ auth: e, payload: n, postConditions: r = lf([]), postConditionMode: i = nc.Deny, transactionVersion: s, chainId: o, network: a = "mainnet" }) {
    a = Rx(a), this.transactionVersion = s ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: an(n.amount)
    } : this.payload = n, this.postConditionMode = i, this.postConditions = r, this.anchorMode = Cn.Any;
  }
  signBegin() {
    const e = su(this);
    return e.auth = ah(e.auth), e.txid();
  }
  verifyBegin() {
    const e = su(this);
    return e.auth = ah(e.auth), e.txid();
  }
  verifyOrigin() {
    return lE(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Ce.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Ce.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Ce.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : ao(e), r = this.auth.spendingCondition;
    if (r && !Po(r)) {
      const i = co(n.data);
      r.fields.push(Pi(i ? be.Compressed : be.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, i) {
    const { nextSig: s, nextSigHash: o } = iE(n, r, e.fee, e.nonce, i);
    if (Po(e))
      e.signature = Jl(s);
    else {
      const a = Cg(i);
      e.fields.push(Pi(a ? be.Compressed : be.Uncompressed, Jl(s)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return pf(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Ce.Sponsored)
      throw new rc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = hE(this.auth, e);
  }
  setFee(e) {
    this.auth = uE(this.auth, e);
  }
  setNonce(e) {
    this.auth = fE(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Ce.Sponsored)
      throw new rc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = dE(this.auth, e);
  }
  serialize() {
    return pt(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Ni('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Ni('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Ni('"auth" is undefined');
    if (this.payload === void 0)
      throw new Ni('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Gs(n, this.chainId, 0), e.push(n), e.push(pE(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(uf(this.postConditions)), e.push(kg(this.payload)), Ue(e);
  }
}
function wE(t) {
  const e = vn(t, ce) ? t : new ce(t), n = e.readUInt8Enum(Js, (f) => {
    throw new Error(`Could not parse ${f} as TransactionVersion`);
  }), r = e.readUInt32BE(), i = gE(e), s = e.readUInt8Enum(Cn, (f) => {
    throw new Error(`Could not parse ${f} as AnchorMode`);
  }), o = e.readUInt8Enum(nc, (f) => {
    throw new Error(`Could not parse ${f} as PostConditionMode`);
  }), a = Ag(e, st.PostCondition), c = y3(e), u = new yE({
    transactionVersion: n,
    chainId: r,
    auth: i,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = s, u;
}
const ch = BigInt("18446744073709551615");
function al(t) {
  const e = an(t);
  if (e < 0n || e > ch)
    throw new RangeError(`Post-condition amount must be between 0 and ${ch} (u64 max), received: ${e}`);
  return e;
}
var iu;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(iu || (iu = {}));
var ou;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(ou || (ou = {}));
function bE(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: st.PostCondition,
        conditionType: he.STX,
        principal: t.address === "origin" ? { type: st.Principal, prefix: dn.Origin } : bo(t.address),
        conditionCode: ba(t.condition),
        amount: al(t.amount)
      };
    case "ft-postcondition":
      return {
        type: st.PostCondition,
        conditionType: he.Fungible,
        principal: t.address === "origin" ? { type: st.Principal, prefix: dn.Origin } : bo(t.address),
        conditionCode: ba(t.condition),
        amount: al(t.amount),
        asset: nh(t.asset)
      };
    case "nft-postcondition":
      return {
        type: st.PostCondition,
        conditionType: he.NonFungible,
        principal: t.address === "origin" ? { type: st.Principal, prefix: dn.Origin } : bo(t.address),
        conditionCode: ba(t.condition),
        asset: nh(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: st.PostCondition,
        conditionType: he.Staking,
        principal: t.address === "origin" ? { type: st.Principal, prefix: dn.Origin } : bo(t.address),
        conditionCode: ba(t.condition),
        amount: al(t.amount)
      };
    case "pox-postcondition":
      return {
        type: st.PostCondition,
        conditionType: he.PoX,
        principal: t.address === "origin" ? { type: st.Principal, prefix: dn.Origin } : bo(t.address),
        conditionCode: mE(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function ba(t) {
  return iu[t];
}
function mE(t) {
  return ou[t];
}
function Ug(t) {
  const e = bE(t);
  return p3(e);
}
function xE(t, e, n) {
  return bf(Hg(t), n);
}
function Hg(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = _o(r);
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
    return BigInt(`0x${AE(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function wf(t, e = 8) {
  return (typeof t == "bigint" ? t : Hg(t)).toString(16).padStart(e * 2, "0");
}
function bf(t, e = 16) {
  const n = wf(t, e);
  return _o(n);
}
function SE(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const EE = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function AE(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += EE[n];
  return e;
}
function _o(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t;
  const e = t.length % 2 ? `0${t}` : t, n = new Uint8Array(e.length / 2);
  for (let r = 0; r < n.length; r++) {
    const i = r * 2, s = e.slice(i, i + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    n[r] = o;
  }
  return n;
}
function mf(t) {
  return new TextEncoder().encode(t);
}
function vE(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function kE(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function lh(t) {
  if (t.some(kE))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function xf(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, i) => r + i.length, 0), n = new Uint8Array(e);
  for (let r = 0, i = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
function Rr(t) {
  return xf(...t.map((e) => typeof e == "number" ? lh([e]) : e instanceof Array ? lh(e) : e));
}
function Uc(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var au;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(au || (au = {}));
au.Mainnet;
const $E = 128, IE = 128, Og = 16;
var cu;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(cu || (cu = {}));
var uh;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(uh || (uh = {}));
var fh;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(fh || (fh = {}));
var Zn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Zn || (Zn = {}));
const cl = ["onChainOnly", "offChainOnly", "any"];
cl[0] + "", Zn.OnChainOnly, cl[1] + "", Zn.OffChainOnly, cl[2] + "", Zn.Any, Zn.OnChainOnly + "", Zn.OnChainOnly, Zn.OffChainOnly + "", Zn.OffChainOnly, Zn.Any + "", Zn.Any;
var lu;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(lu || (lu = {}));
lu.Mainnet;
var dh;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(dh || (dh = {}));
var Bs;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Bs || (Bs = {}));
var hh;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(hh || (hh = {}));
var ph;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(ph || (ph = {}));
var gh;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(gh || (gh = {}));
var yh;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(yh || (yh = {}));
var wh;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(wh || (wh = {}));
var bh;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(bh || (bh = {}));
var uu;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(uu || (uu = {}));
var mh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(mh || (mh = {}));
var xh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(xh || (xh = {}));
function fu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function LE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Dg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function CE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  fu(t.outputLen), fu(t.blockLen);
}
function TE(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function BE(t, e) {
  Dg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ll = {
  number: fu,
  bool: LE,
  bytes: Dg,
  hash: CE,
  exists: TE,
  output: BE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ul = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), dr = (t, e) => t << 32 - e | t >>> e, ME = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!ME)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function NE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Fg(t) {
  if (typeof t == "string" && (t = NE(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let PE = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function hi(t) {
  const e = (r) => t().update(Fg(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function _E(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Sf = class extends PE {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ul(this.buffer);
  }
  update(e) {
    ll.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Fg(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = ul(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ll.exists(this), ll.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    _E(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = ul(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, f[l], s);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: a } = this;
    return e.length = i, e.pos = a, e.finished = s, e.destroyed = o, i % n && e.buffer.set(r), e;
  }
};
const UE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), jg = Uint8Array.from({ length: 16 }, (t, e) => e), HE = jg.map((t) => (9 * t + 5) % 16);
let Ef = [jg], Af = [HE];
for (let t = 0; t < 4; t++)
  for (let e of [Ef, Af])
    e.push(e[t].map((n) => UE[n]));
const zg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), OE = Ef.map((t, e) => t.map((n) => zg[e][n])), DE = Af.map((t, e) => t.map((n) => zg[e][n])), FE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), jE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ma = (t, e) => t << e | t >>> 32 - e;
function Sh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const xa = new Uint32Array(16);
let zE = class extends Sf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: i, h4: s } = this;
    return [e, n, r, i, s];
  }
  set(e, n, r, i, s) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = i | 0, this.h4 = s | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      xa[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, w = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, S = FE[p], M = jE[p], j = Ef[p], z = Af[p], A = OE[p], _ = DE[p];
      for (let N = 0; N < 16; N++) {
        const Q = ma(r + Sh(p, s, a, u) + xa[j[N]] + S, A[N]) + l | 0;
        r = l, l = u, u = ma(a, 10) | 0, a = s, s = Q;
      }
      for (let N = 0; N < 16; N++) {
        const Q = ma(i + Sh(x, o, c, f) + xa[z[N]] + M, _[N]) + w | 0;
        i = w, w = f, f = ma(c, 10) | 0, c = o, o = Q;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + w | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    xa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
hi(() => new zE());
const RE = (t, e, n) => t & e ^ ~t & n, GE = (t, e, n) => t & e ^ t & n ^ e & n, KE = new Uint32Array([
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
]), ls = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), us = new Uint32Array(64);
let Rg = class extends Sf {
  constructor() {
    super(64, 32, 8, !1), this.A = ls[0] | 0, this.B = ls[1] | 0, this.C = ls[2] | 0, this.D = ls[3] | 0, this.E = ls[4] | 0, this.F = ls[5] | 0, this.G = ls[6] | 0, this.H = ls[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: i, E: s, F: o, G: a, H: c } = this;
    return [e, n, r, i, s, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      us[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const w = us[l - 15], p = us[l - 2], x = dr(w, 7) ^ dr(w, 18) ^ w >>> 3, S = dr(p, 17) ^ dr(p, 19) ^ p >>> 10;
      us[l] = S + us[l - 7] + x + us[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const w = dr(a, 6) ^ dr(a, 11) ^ dr(a, 25), p = f + w + RE(a, c, u) + KE[l] + us[l] | 0, S = (dr(r, 2) ^ dr(r, 13) ^ dr(r, 22)) + GE(r, i, s) | 0;
      f = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + S | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, i, s, o, a, c, u, f);
  }
  roundClean() {
    us.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, VE = class extends Rg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
hi(() => new Rg());
hi(() => new VE());
const Sa = BigInt(2 ** 32 - 1), du = BigInt(32);
function Gg(t, e = !1) {
  return e ? { h: Number(t & Sa), l: Number(t >> du & Sa) } : { h: Number(t >> du & Sa) | 0, l: Number(t & Sa) | 0 };
}
function qE(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = Gg(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const WE = (t, e) => BigInt(t >>> 0) << du | BigInt(e >>> 0), XE = (t, e, n) => t >>> n, YE = (t, e, n) => t << 32 - n | e >>> n, ZE = (t, e, n) => t >>> n | e << 32 - n, QE = (t, e, n) => t << 32 - n | e >>> n, JE = (t, e, n) => t << 64 - n | e >>> n - 32, tA = (t, e, n) => t >>> n - 32 | e << 64 - n, eA = (t, e) => e, nA = (t, e) => t, rA = (t, e, n) => t << n | e >>> 32 - n, sA = (t, e, n) => e << n | t >>> 32 - n, iA = (t, e, n) => e << n - 32 | t >>> 64 - n, oA = (t, e, n) => t << n - 32 | e >>> 64 - n;
function aA(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const cA = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), lA = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, uA = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), fA = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, dA = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), hA = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, Bt = {
  fromBig: Gg,
  split: qE,
  toBig: WE,
  shrSH: XE,
  shrSL: YE,
  rotrSH: ZE,
  rotrSL: QE,
  rotrBH: JE,
  rotrBL: tA,
  rotr32H: eA,
  rotr32L: nA,
  rotlSH: rA,
  rotlSL: sA,
  rotlBH: iA,
  rotlBL: oA,
  add: aA,
  add3L: cA,
  add3H: lA,
  add4L: uA,
  add4H: fA,
  add5H: hA,
  add5L: dA
}, [pA, gA] = Bt.split([
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
].map((t) => BigInt(t))), fs = new Uint32Array(80), ds = new Uint32Array(80);
let Hc = class extends Sf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: w, Gh: p, Gl: x, Hh: S, Hl: M } = this;
    return [e, n, r, i, s, o, a, c, u, f, l, w, p, x, S, M];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, f, l, w, p, x, S, M) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = w | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = S | 0, this.Hl = M | 0;
  }
  process(e, n) {
    for (let A = 0; A < 16; A++, n += 4)
      fs[A] = e.getUint32(n), ds[A] = e.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const _ = fs[A - 15] | 0, N = ds[A - 15] | 0, Q = Bt.rotrSH(_, N, 1) ^ Bt.rotrSH(_, N, 8) ^ Bt.shrSH(_, N, 7), tt = Bt.rotrSL(_, N, 1) ^ Bt.rotrSL(_, N, 8) ^ Bt.shrSL(_, N, 7), R = fs[A - 2] | 0, K = ds[A - 2] | 0, L = Bt.rotrSH(R, K, 19) ^ Bt.rotrBH(R, K, 61) ^ Bt.shrSH(R, K, 6), P = Bt.rotrSL(R, K, 19) ^ Bt.rotrBL(R, K, 61) ^ Bt.shrSL(R, K, 6), b = Bt.add4L(tt, P, ds[A - 7], ds[A - 16]), T = Bt.add4H(b, Q, L, fs[A - 7], fs[A - 16]);
      fs[A] = T | 0, ds[A] = b | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: w, Fh: p, Fl: x, Gh: S, Gl: M, Hh: j, Hl: z } = this;
    for (let A = 0; A < 80; A++) {
      const _ = Bt.rotrSH(l, w, 14) ^ Bt.rotrSH(l, w, 18) ^ Bt.rotrBH(l, w, 41), N = Bt.rotrSL(l, w, 14) ^ Bt.rotrSL(l, w, 18) ^ Bt.rotrBL(l, w, 41), Q = l & p ^ ~l & S, tt = w & x ^ ~w & M, R = Bt.add5L(z, N, tt, gA[A], ds[A]), K = Bt.add5H(R, j, _, Q, pA[A], fs[A]), L = R | 0, P = Bt.rotrSH(r, i, 28) ^ Bt.rotrBH(r, i, 34) ^ Bt.rotrBH(r, i, 39), b = Bt.rotrSL(r, i, 28) ^ Bt.rotrBL(r, i, 34) ^ Bt.rotrBL(r, i, 39), T = r & s ^ r & a ^ s & a, H = i & o ^ i & c ^ o & c;
      j = S | 0, z = M | 0, S = p | 0, M = x | 0, p = l | 0, x = w | 0, { h: l, l: w } = Bt.add(u | 0, f | 0, K | 0, L | 0), u = a | 0, f = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const C = Bt.add3L(L, b, H);
      r = Bt.add3H(C, K, P, T), i = C | 0;
    }
    ({ h: r, l: i } = Bt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = Bt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = Bt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Bt.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: w } = Bt.add(this.Eh | 0, this.El | 0, l | 0, w | 0), { h: p, l: x } = Bt.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: S, l: M } = Bt.add(this.Gh | 0, this.Gl | 0, S | 0, M | 0), { h: j, l: z } = Bt.add(this.Hh | 0, this.Hl | 0, j | 0, z | 0), this.set(r, i, s, o, a, c, u, f, l, w, p, x, S, M, j, z);
  }
  roundClean() {
    fs.fill(0), ds.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, yA = class extends Hc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, wA = class extends Hc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, bA = class extends Hc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
hi(() => new Hc());
hi(() => new yA());
hi(() => new wA());
hi(() => new bA());
function mA(t, e, n) {
  const i = $E;
  if (_A(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: cu.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: i
  };
}
var Ve;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Ve || (Ve = {}));
let xA = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Kg = class extends xA {
  constructor(e) {
    super(e);
  }
};
function Oc(t) {
  const e = [];
  return e.push(_o(wf(t.version, 1))), e.push(_o(t.hash160)), Rr(e);
}
function SA(t) {
  const e = [];
  return e.push(t.prefix), e.push(Oc(t.address)), t.prefix === uu.Contract && e.push(Uo(t.contractName)), Rr(e);
}
function Uo(t) {
  const e = [], n = mf(t.content), r = n.byteLength;
  return e.push(_o(wf(r, t.lengthPrefixBytes))), e.push(n), Rr(e);
}
function EA(t) {
  const e = [];
  return e.push(Oc(t.address)), e.push(Uo(t.contractName)), e.push(Uo(t.assetName)), Rr(e);
}
function Vg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(SA(t.principal)), (t.conditionType === Bs.Fungible || t.conditionType === Bs.NonFungible) && e.push(EA(t.assetInfo)), t.conditionType === Bs.NonFungible && e.push(ei(t.assetName)), e.push(t.conditionCode), t.conditionType === Bs.STX || t.conditionType === Bs.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Kg("The post-condition amount may not be larger than 8 bytes");
    e.push(xE(t.amount, !1, 8));
  }
  return Rr(e);
}
function kr(t, e) {
  return Rr([t, e]);
}
function AA(t) {
  return new Uint8Array([t.type]);
}
function vA(t) {
  return t.type === Ve.OptionalNone ? new Uint8Array([t.type]) : kr(t.type, ei(t.value));
}
function kA(t) {
  const e = new Uint8Array(4);
  return Uc(e, t.buffer.length, 0), kr(t.type, xf(e, t.buffer));
}
function $A(t) {
  const e = bf(SE(t.value, BigInt(IE)), Og);
  return kr(t.type, e);
}
function IA(t) {
  const e = bf(t.value, Og);
  return kr(t.type, e);
}
function LA(t) {
  return kr(t.type, Oc(t.address));
}
function CA(t) {
  return kr(t.type, xf(Oc(t.address), Uo(t.contractName)));
}
function TA(t) {
  return kr(t.type, ei(t.value));
}
function BA(t) {
  const e = [], n = new Uint8Array(4);
  Uc(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const i = ei(r);
    e.push(i);
  }
  return kr(t.type, Rr(e));
}
function MA(t) {
  const e = [], n = new Uint8Array(4);
  Uc(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = mA(i);
    e.push(Uo(s));
    const o = ei(t.data[i]);
    e.push(o);
  }
  return kr(t.type, Rr(e));
}
function qg(t, e) {
  const n = [], r = e == "ascii" ? vE(t.data) : mf(t.data), i = new Uint8Array(4);
  return Uc(i, r.length, 0), n.push(i), n.push(r), kr(t.type, Rr(n));
}
function NA(t) {
  return qg(t, "ascii");
}
function PA(t) {
  return qg(t, "utf8");
}
function ei(t) {
  switch (t.type) {
    case Ve.BoolTrue:
    case Ve.BoolFalse:
      return AA(t);
    case Ve.OptionalNone:
    case Ve.OptionalSome:
      return vA(t);
    case Ve.Buffer:
      return kA(t);
    case Ve.UInt:
      return IA(t);
    case Ve.Int:
      return $A(t);
    case Ve.PrincipalStandard:
      return LA(t);
    case Ve.PrincipalContract:
      return CA(t);
    case Ve.ResponseOk:
    case Ve.ResponseErr:
      return TA(t);
    case Ve.List:
      return BA(t);
    case Ve.Tuple:
      return MA(t);
    case Ve.StringASCII:
      return NA(t);
    case Ve.StringUTF8:
      return PA(t);
    default:
      throw new Kg("Unable to serialize. Invalid Clarity Value.");
  }
}
const _A = (t, e) => t ? mf(t).length > e : !1, UA = "connect-ui";
let Oa, Wg, Tn = !1, hu = !1;
const zr = (t, e = "") => () => {
}, HA = (t, e) => () => {
}, OA = "{visibility:hidden}.hydrated{visibility:inherit}", Eh = {}, DA = "http://www.w3.org/2000/svg", FA = "http://www.w3.org/1999/xhtml", jA = (t) => t != null, vf = (t) => (t = typeof t, t === "object" || t === "function");
function Xg(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const kt = (t, e, ...n) => {
  let r = null, i = !1, s = !1;
  const o = [], a = (u) => {
    for (let f = 0; f < u.length; f++)
      r = u[f], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((i = typeof t != "function" && !vf(r)) && (r = String(r)), i && s ? o[o.length - 1].$text$ += r : o.push(i ? pu(null, r) : r), s = i);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((f) => u[f]).join(" "));
  }
  const c = pu(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, pu = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, zA = {}, RA = (t) => t && t.$tag$ === zA, GA = (t, e) => t != null && !vf(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, KA = (t) => lo(t).$hostElement$, VA = (t, e, n) => {
  const r = on.ce(e, n);
  return t.dispatchEvent(r), r;
}, Ah = /* @__PURE__ */ new WeakMap(), qA = (t, e, n) => {
  let r = sc.get(t);
  h4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, sc.set(t, r);
}, WA = (t, e, n, r) => {
  var i;
  let s = Yg(e);
  const o = sc.get(s);
  if (t = t.nodeType === 11 ? t : xr, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = Ah.get(t), c;
      if (a || Ah.set(t, a = /* @__PURE__ */ new Set()), !a.has(s)) {
        {
          c = xr.createElement("style"), c.innerHTML = o;
          const u = (i = on.$nonce$) !== null && i !== void 0 ? i : Xg(xr);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(s);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return s;
}, XA = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, i = zr("attachStyles", e.$tagName$), s = WA(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = s, n.classList.add(s + "-h")), i();
}, Yg = (t, e) => "sc-" + t.$tagName$, vh = (t, e, n, r, i, s) => {
  if (n !== r) {
    let o = $h(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = kh(n), f = kh(r);
      c.remove(...u.filter((l) => l && !f.includes(l))), c.add(...f.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : $h(Dc, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && on.rel(t, e, n, !1), r && on.ael(t, e, r, !1);
    else {
      const c = vf(r);
      if ((o || c && r !== null) && !i)
        try {
          if (t.tagName.includes("-"))
            t[e] = r;
          else {
            const u = r ?? "";
            e === "list" ? o = !1 : (n == null || t[e] != u) && (t[e] = u);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || t.getAttribute(e) === "") && t.removeAttribute(e) : (!o || s & 4 || i) && !c && (r = r === !0 ? "" : r, t.setAttribute(e, r));
    }
  }
}, YA = /\s/, kh = (t) => t ? t.split(YA) : [], Zg = (t, e, n, r) => {
  const i = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, s = t && t.$attrs$ || Eh, o = e.$attrs$ || Eh;
  for (r in s)
    r in o || vh(i, r, s[r], void 0, n, e.$flags$);
  for (r in o)
    vh(i, r, s[r], o[r], n, e.$flags$);
}, kf = (t, e, n, r) => {
  const i = e.$children$[n];
  let s = 0, o, a;
  if (i.$text$ !== null)
    o = i.$elm$ = xr.createTextNode(i.$text$);
  else {
    if (Tn || (Tn = i.$tag$ === "svg"), o = i.$elm$ = xr.createElementNS(Tn ? DA : FA, i.$tag$), Tn && i.$tag$ === "foreignObject" && (Tn = !1), Zg(null, i, Tn), jA(Oa) && o["s-si"] !== Oa && o.classList.add(o["s-si"] = Oa), i.$children$)
      for (s = 0; s < i.$children$.length; ++s)
        a = kf(t, i, s), a && o.appendChild(a);
    i.$tag$ === "svg" ? Tn = !1 : o.tagName === "foreignObject" && (Tn = !0);
  }
  return o;
}, Qg = (t, e, n, r, i, s) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === Wg && (o = o.shadowRoot); i <= s; ++i)
    r[i] && (a = kf(null, n, i), a && (r[i].$elm$ = a, o.insertBefore(a, e)));
}, Jg = (t, e, n, r, i) => {
  for (; e <= n; ++e)
    (r = t[e]) && (i = r.$elm$, i.remove());
}, ZA = (t, e, n, r) => {
  let i = 0, s = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, f = r[0], l = r[u], w;
  for (; i <= o && s <= u; )
    a == null ? a = e[++i] : c == null ? c = e[--o] : f == null ? f = r[++s] : l == null ? l = r[--u] : Ea(a, f) ? (Ao(a, f), a = e[++i], f = r[++s]) : Ea(c, l) ? (Ao(c, l), c = e[--o], l = r[--u]) : Ea(a, l) ? (Ao(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++i], l = r[--u]) : Ea(c, f) ? (Ao(c, f), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], f = r[++s]) : (w = kf(e && e[s], n, s), f = r[++s], w && a.$elm$.parentNode.insertBefore(w, a.$elm$));
  i > o ? Qg(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, s, u) : s > u && Jg(e, i, o);
}, Ea = (t, e) => t.$tag$ === e.$tag$, Ao = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, i = e.$children$, s = e.$tag$, o = e.$text$;
  o === null ? (Tn = s === "svg" ? !0 : s === "foreignObject" ? !1 : Tn, Zg(t, e, Tn), r !== null && i !== null ? ZA(n, r, e, i) : i !== null ? (t.$text$ !== null && (n.textContent = ""), Qg(n, null, e, i, 0, i.length - 1)) : r !== null && Jg(r, 0, r.length - 1), Tn && s === "svg" && (Tn = !1)) : t.$text$ !== o && (n.data = o);
}, QA = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || pu(null, null), i = RA(e) ? e : kt(null, null, e);
  Wg = n.tagName, i.$tag$ = null, i.$flags$ |= 4, t.$vnode$ = i, i.$elm$ = r.$elm$ = n.shadowRoot || n, Oa = n["s-sc"], Ao(r, i);
}, ty = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, $f = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return ty(t, t.$ancestorComponent$), g4(() => JA(t, e));
}, JA = (t, e) => {
  const n = zr("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let i;
  return n(), r4(i, () => t4(t, r, e));
}, t4 = async (t, e, n) => {
  const r = t.$hostElement$, i = zr("update", t.$cmpMeta$.$tagName$), s = r["s-rc"];
  n && XA(t);
  const o = zr("render", t.$cmpMeta$.$tagName$);
  e4(t, e), s && (s.map((a) => a()), r["s-rc"] = void 0), o(), i();
  {
    const a = r["s-p"], c = () => n4(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, e4 = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, QA(t, e);
  } catch (r) {
    Ho(r, t.$hostElement$);
  }
  return null;
}, n4 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = zr("postUpdate", e), i = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, ny(n), r(), t.$onReadyResolve$(n), i || ey()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && Lf(() => $f(t, !1)), t.$flags$ &= -517;
}, ey = (t) => {
  ny(xr.documentElement), Lf(() => VA(Dc, "appload", { detail: { namespace: UA } }));
}, r4 = (t, e) => t && t.then ? t.then(e) : e(), ny = (t) => t.classList.add("hydrated"), s4 = (t, e) => lo(t).$instanceValues$.get(e), i4 = (t, e, n, r) => {
  const i = lo(t), s = i.$instanceValues$.get(e), o = i.$flags$, a = i.$lazyInstance$;
  n = GA(n, r.$members$[e][0]);
  const c = Number.isNaN(s) && Number.isNaN(n), u = n !== s && !c;
  (!(o & 8) || s === void 0) && u && (i.$instanceValues$.set(e, n), a && (o & 18) === 2 && $f(i, !1));
}, ry = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), i = t.prototype;
    if (r.map(([s, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(i, s, {
        get() {
          return s4(this, s);
        },
        set(a) {
          i4(this, s, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const s = /* @__PURE__ */ new Map();
      i.attributeChangedCallback = function(o, a, c) {
        on.jmp(() => {
          const u = s.get(o);
          if (this.hasOwnProperty(u))
            c = this[u], delete this[u];
          else if (i.hasOwnProperty(u) && typeof this[u] == "number" && this[u] == c)
            return;
          this[u] = c === null && typeof this[u] == "boolean" ? !1 : c;
        });
      }, t.observedAttributes = r.filter(
        ([o, a]) => a[0] & 15
        /* MEMBER_FLAGS.HasAttribute */
      ).map(([o, a]) => {
        const c = a[1] || o;
        return s.set(c, o), c;
      });
    }
  }
  return t;
}, o4 = async (t, e, n, r, i) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, i = d4(n), i.then) {
        const c = HA();
        i = await i, c();
      }
      i.isProxied || (ry(
        i,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), i.isProxied = !0);
      const a = zr("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new i(e);
      } catch (c) {
        Ho(c);
      }
      e.$flags$ &= -9, a();
    }
    if (i.style) {
      let a = i.style;
      const c = Yg(n);
      if (!sc.has(c)) {
        const u = zr("registerStyles", n.$tagName$);
        qA(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const s = e.$ancestorComponent$, o = () => $f(e, !0);
  s && s["s-rc"] ? s["s-rc"].push(o) : o();
}, a4 = (t) => {
  if (!(on.$flags$ & 1)) {
    const e = lo(t), n = e.$cmpMeta$, r = zr("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let i = t;
        for (; i = i.parentNode || i.host; )
          if (i["s-p"]) {
            ty(e, e.$ancestorComponent$ = i);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([i, [s]]) => {
        if (s & 31 && t.hasOwnProperty(i)) {
          const o = t[i];
          delete t[i], t[i] = o;
        }
      }), o4(t, e, n);
    }
    r();
  }
}, c4 = (t) => {
  on.$flags$ & 1 || lo(t);
}, l4 = (t, e = {}) => {
  var n;
  const r = zr(), i = [], s = e.exclude || [], o = Dc.customElements, a = xr.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ xr.createElement("style"), f = [];
  let l, w = !0;
  Object.assign(on, e), on.$resourcesUrl$ = new URL(e.resourcesUrl || "./", xr.baseURI).href, t.map((p) => {
    p[1].map((x) => {
      const S = {
        $flags$: x[0],
        $tagName$: x[1],
        $members$: x[2],
        $listeners$: x[3]
      };
      S.$members$ = x[2];
      const M = S.$tagName$, j = class extends HTMLElement {
        // StencilLazyHost
        constructor(z) {
          super(z), z = this, f4(z, S), S.$flags$ & 1 && z.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), w ? f.push(this) : on.jmp(() => a4(this));
        }
        disconnectedCallback() {
          on.jmp(() => c4(this));
        }
        componentOnReady() {
          return lo(this).$onReadyPromise$;
        }
      };
      S.$lazyBundleId$ = p[0], !s.includes(M) && !o.get(M) && (i.push(M), o.define(M, ry(
        j,
        S,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = i + OA, u.setAttribute("data-styles", "");
    const p = (n = on.$nonce$) !== null && n !== void 0 ? n : Xg(xr);
    p != null && u.setAttribute("nonce", p), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  w = !1, f.length ? f.map((p) => p.connectedCallback()) : on.jmp(() => l = setTimeout(ey, 30)), r();
}, If = /* @__PURE__ */ new WeakMap(), lo = (t) => If.get(t), u4 = (t, e) => If.set(e.$lazyInstance$ = t, e), f4 = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], If.set(t, n);
}, $h = (t, e) => e in t, Ho = (t, e) => (0, console.error)(t, e), fl = /* @__PURE__ */ new Map(), d4 = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), i = t.$lazyBundleId$, s = fl.get(i);
  if (s)
    return s[r];
  {
    const o = (a) => (fl.set(i, a), a[r]);
    switch (i) {
      case "connect-modal":
        return Promise.resolve().then(() => Kk).then(o, Ho);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${i}.entry.js`
  ).then((o) => (fl.set(i, o), o[r]), Ho);
}, sc = /* @__PURE__ */ new Map(), Dc = typeof window < "u" ? window : {}, xr = Dc.document || { head: {} }, on = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, sy = (t) => Promise.resolve(t), h4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), Ih = [], iy = [], p4 = (t, e) => (n) => {
  t.push(n), hu || (hu = !0, on.$flags$ & 4 ? Lf(gu) : on.raf(gu));
}, Lh = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      Ho(n);
    }
  t.length = 0;
}, gu = () => {
  Lh(Ih), Lh(iy), (hu = Ih.length > 0) && on.raf(gu);
}, Lf = (t) => sy().then(t), g4 = /* @__PURE__ */ p4(iy), y4 = () => sy(), w4 = (t, e) => typeof window > "u" ? Promise.resolve() : y4().then(() => l4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var b4 = Object.defineProperty, m4 = Object.defineProperties, x4 = Object.getOwnPropertyDescriptors, ic = Object.getOwnPropertySymbols, oy = Object.prototype.hasOwnProperty, ay = Object.prototype.propertyIsEnumerable, Ch = (t, e, n) => e in t ? b4(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Un = (t, e) => {
  for (var n in e || (e = {})) oy.call(e, n) && Ch(t, n, e[n]);
  if (ic) for (var n of ic(e)) ay.call(e, n) && Ch(t, n, e[n]);
  return t;
}, nr = (t, e) => m4(t, x4(e)), cy = (t, e) => {
  var n = {};
  for (var r in t) oy.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && ic) for (var r of ic(t)) e.indexOf(r) < 0 && ay.call(t, r) && (n[r] = t[r]);
  return n;
};
function ly() {
  return Mc(Xs()) || window.StacksProvider || window.BlockstackProvider;
}
function Fc(t) {
  return t ? typeof t == "string" ? Zs.fromName(t) : "version" in t ? t : "url" in t ? new Rl({ url: t.url }) : t.transactionVersion === Js.Mainnet ? new Rl({ url: t.client.baseUrl }) : new Gl({ url: t.client.baseUrl }) : new Gl();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var S4 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(S4 || {}), E4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(E4 || {}), Cf = (t) => {
  let e = t;
  if (!e) {
    let n = new F0(["store_write"], document.location.href);
    e = new zl({ appConfig: n });
  }
  return e;
};
function uy(t) {
  try {
    return Cf(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var fy = (t) => {
  let e = Cf(t).loadUserData().appPrivateKey, n = Qe.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function A4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: i } = t;
  if (n) return n;
  if (!r || !i) return;
  let s = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [Qs.Mainnet]: "mainnet", [Qs.Testnet]: "testnet" }, a = Fc(i);
  return s == null ? void 0 : s[o[a.chainId]];
}
function v4(t) {
  let e = Fc(t.network), n = Cf(t.userSession), r = nr(Un({}, t), { network: e, userSession: n });
  return Un({ stxAddress: A4(r) }, r);
}
async function k4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(Ug) : n = n.map((r) => pt(Vg(r)))), new Qe.TokenSigner("ES256k", e).signAsync(nr(Un({}, t), { postConditions: n }));
}
function $4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(Ug) : e = e.map((n) => pt(Vg(n)))), Qe.createUnsecuredToken(nr(Un({}, t), { postConditions: e }));
}
var I4 = async ({ token: t, options: e }, n) => {
  var r, i, s;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = Kt(a.replace(/^0x/, "")), u = wE(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, nr(Un({}, o), { stacksTransaction: u }));
      return;
    }
    (i = e.onFinish) == null || i.call(e, nr(Un({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (s = e.onCancel) == null || s.call(e);
  }
}, L4 = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: i } = e, s = cy(e, ["amount", "appDetails", "userSession"]);
  if (uy(i)) {
    let { privateKey: a, publicKey: c } = fy(i), u = nr(Un({}, s), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), k4(u, a);
  }
  let o = nr(Un({}, s), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), $4(o);
};
async function C4(t, e, n) {
  let r = await e(nr(Un(Un({}, v4(t)), t), { network: Fc(t.network) }));
  return I4({ token: r, options: t }, n);
}
function T4(t, e = ly()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return C4(t, L4, e);
}
function dy(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? nr(Un({}, t), { message: rh(e), domain: rh(n) }) : nr(Un({}, t), { message: pt(ei(e)), domain: pt(ei(n)) });
}
async function B4(t, e) {
  return new Qe.TokenSigner("ES256k", e).signAsync(dy(t));
}
async function M4(t) {
  let e = t, { userSession: n } = e, r = cy(e, ["userSession"]);
  if (uy(n)) {
    let { privateKey: i, publicKey: s } = fy(n), o = nr(Un({}, r), { publicKey: s });
    return B4(o, i);
  }
  return Qe.createUnsecuredToken(dy(t));
}
var N4 = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(N4 || {}), hy = "asigna-stx", Th = (t, e) => new Promise((n) => {
  function r(i) {
    i.data.source === hy && i.data[e] && (n(i.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(_4(t, e), "*");
}), P4 = { authenticationRequest: async (t) => Th(t, "authenticationRequest"), transactionRequest: async (t) => Th(t, "transactionRequest") }, _4 = (t, e) => ({ source: hy, [e]: t }), U4 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = P4);
};
U4();
var H4 = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function O4(t, e = !0) {
  return function(n, r) {
    var i;
    if (r) return t(n, r);
    let s = Xs(), o = ly();
    if (s && o) return t(n, o);
    if (typeof window > "u") return;
    w4();
    let a = (i = n == null ? void 0 : n.defaultProviders) != null ? i : H4, c = Cx(a), u = document.createElement("connect-modal");
    u.defaultProviders = a, u.installedProviders = c, u.persistSelection = e;
    let f = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let l = () => {
      u.remove(), document.body.style.overflow = f;
    };
    u.callback = (p) => {
      l(), t(n, p);
    }, u.cancelCallback = () => {
      var p;
      l(), (p = n.onCancel) == null || p.call(n);
    }, document.body.appendChild(u);
    let w = (p) => {
      p.key === "Escape" && (document.removeEventListener("keydown", w), u.remove());
    };
    document.addEventListener("keydown", w);
  };
}
var Aa = O4(T4);
function $s(t, e, n) {
  return Tf(pn(t, e), n);
}
function pn(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = ge(r);
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
      const r = j4(BigInt(`0x${Ht(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Ht(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Bh(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Yo(t, e = 8) {
  return (typeof t == "bigint" ? t : pn(t, !1)).toString(16).padStart(e * 2, "0");
}
function jc(t) {
  return parseInt(t, 16);
}
function Tf(t, e = 16) {
  const n = Yo(t, e);
  return ge(n);
}
function D4(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function F4(t, e) {
  return t & BigInt(1) << e;
}
function j4(t, e) {
  return F4(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const z4 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ht(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += z4[n];
  return e;
}
function ge(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t;
  const e = t.length % 2 ? `0${t}` : t, n = new Uint8Array(e.length / 2);
  for (let r = 0; r < n.length; r++) {
    const i = r * 2, s = e.slice(i, i + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    n[r] = o;
  }
  return n;
}
function uo(t) {
  return new TextEncoder().encode(t);
}
function Bf(t) {
  return new TextDecoder().decode(t);
}
function py(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function R4(t) {
  return String.fromCharCode.apply(null, t);
}
function G4(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Mh(t) {
  if (t.some(G4))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function zc(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, i) => r + i.length, 0), n = new Uint8Array(e);
  for (let r = 0, i = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
function He(t) {
  return zc(...t.map((e) => typeof e == "number" ? Mh([e]) : e instanceof Array ? Mh(e) : e));
}
var Nh;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Nh || (Nh = {}));
var Ph;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ph || (Ph = {}));
var _h;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(_h || (_h = {}));
const gy = 33, dl = 32;
function K4(t) {
  if (t.length < dl * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + dl * 2), r = t.slice(2 + dl * 2);
  return {
    recoveryId: jc(e),
    r: n,
    s: r
  };
}
function V4(t) {
  const e = typeof t == "string" ? ge(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function q4(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function W4(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function X4(t, e) {
  return t[e];
}
function Y4(t, e, n = 0) {
  return t[n] = e, t;
}
function Z4(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function ni(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var yu;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(yu || (yu = {}));
const Q4 = yu.Mainnet, J4 = 128, tv = 128, yy = 16, js = 32, wu = 80, Rc = 65, ev = 32, nv = 64, oc = 34;
var ft;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ft || (ft = {}));
var _t;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(_t || (_t = {}));
var bu;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(bu || (bu = {}));
var En;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(En || (En = {}));
const Da = ["onChainOnly", "offChainOnly", "any"], Uh = {
  [Da[0]]: En.OnChainOnly,
  [Da[1]]: En.OffChainOnly,
  [Da[2]]: En.Any,
  [En.OnChainOnly]: En.OnChainOnly,
  [En.OffChainOnly]: En.OffChainOnly,
  [En.Any]: En.Any
};
function rv(t) {
  if (t in Uh)
    return Uh[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${Da.join(", ")}`);
}
var ac;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ac || (ac = {}));
ac.Mainnet;
var to;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(to || (to = {}));
var An;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(An || (An = {}));
var Te;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Te || (Te = {}));
var ie;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(ie || (ie = {}));
var cc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(cc || (cc = {}));
var me;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(me || (me = {}));
var Oo;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Oo || (Oo = {}));
var mu;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(mu || (mu = {}));
var Do;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Do || (Do = {}));
var Hh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Hh || (Hh = {}));
var Oh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Oh || (Oh = {}));
function xu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function sv(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function wy(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function iv(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  xu(t.outputLen), xu(t.blockLen);
}
function ov(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function av(t, e) {
  wy(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Hs = {
  number: xu,
  bool: sv,
  bytes: wy,
  hash: iv,
  exists: ov,
  output: av
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const hl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), hr = (t, e) => t << 32 - e | t >>> e, cv = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!cv)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function lv(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Mf(t) {
  if (typeof t == "string" && (t = lv(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class by {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function pi(t) {
  const e = (r) => t().update(Mf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function uv(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class Nf extends by {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = hl(this.buffer);
  }
  update(e) {
    Hs.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Mf(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = hl(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Hs.exists(this), Hs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    uv(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = hl(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, f[l], s);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: a } = this;
    return e.length = i, e.pos = a, e.finished = s, e.destroyed = o, i % n && e.buffer.set(r), e;
  }
}
const fv = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), my = Uint8Array.from({ length: 16 }, (t, e) => e), dv = my.map((t) => (9 * t + 5) % 16);
let Pf = [my], _f = [dv];
for (let t = 0; t < 4; t++)
  for (let e of [Pf, _f])
    e.push(e[t].map((n) => fv[n]));
const xy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), hv = Pf.map((t, e) => t.map((n) => xy[e][n])), pv = _f.map((t, e) => t.map((n) => xy[e][n])), gv = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), yv = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), va = (t, e) => t << e | t >>> 32 - e;
function Dh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ka = new Uint32Array(16);
class wv extends Nf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: i, h4: s } = this;
    return [e, n, r, i, s];
  }
  set(e, n, r, i, s) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = i | 0, this.h4 = s | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      ka[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, w = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, S = gv[p], M = yv[p], j = Pf[p], z = _f[p], A = hv[p], _ = pv[p];
      for (let N = 0; N < 16; N++) {
        const Q = va(r + Dh(p, s, a, u) + ka[j[N]] + S, A[N]) + l | 0;
        r = l, l = u, u = va(a, 10) | 0, a = s, s = Q;
      }
      for (let N = 0; N < 16; N++) {
        const Q = va(i + Dh(x, o, c, f) + ka[z[N]] + M, _[N]) + w | 0;
        i = w, w = f, f = va(c, 10) | 0, c = o, o = Q;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + w | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    ka.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const bv = pi(() => new wv()), mv = (t, e, n) => t & e ^ ~t & n, xv = (t, e, n) => t & e ^ t & n ^ e & n, Sv = new Uint32Array([
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
]), hs = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ps = new Uint32Array(64);
class Sy extends Nf {
  constructor() {
    super(64, 32, 8, !1), this.A = hs[0] | 0, this.B = hs[1] | 0, this.C = hs[2] | 0, this.D = hs[3] | 0, this.E = hs[4] | 0, this.F = hs[5] | 0, this.G = hs[6] | 0, this.H = hs[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: i, E: s, F: o, G: a, H: c } = this;
    return [e, n, r, i, s, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      ps[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const w = ps[l - 15], p = ps[l - 2], x = hr(w, 7) ^ hr(w, 18) ^ w >>> 3, S = hr(p, 17) ^ hr(p, 19) ^ p >>> 10;
      ps[l] = S + ps[l - 7] + x + ps[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const w = hr(a, 6) ^ hr(a, 11) ^ hr(a, 25), p = f + w + mv(a, c, u) + Sv[l] + ps[l] | 0, S = (hr(r, 2) ^ hr(r, 13) ^ hr(r, 22)) + xv(r, i, s) | 0;
      f = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + S | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, i, s, o, a, c, u, f);
  }
  roundClean() {
    ps.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class Ev extends Sy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const Uf = pi(() => new Sy());
pi(() => new Ev());
const $a = BigInt(2 ** 32 - 1), Su = BigInt(32);
function Ey(t, e = !1) {
  return e ? { h: Number(t & $a), l: Number(t >> Su & $a) } : { h: Number(t >> Su & $a) | 0, l: Number(t & $a) | 0 };
}
function Av(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = Ey(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const vv = (t, e) => BigInt(t >>> 0) << Su | BigInt(e >>> 0), kv = (t, e, n) => t >>> n, $v = (t, e, n) => t << 32 - n | e >>> n, Iv = (t, e, n) => t >>> n | e << 32 - n, Lv = (t, e, n) => t << 32 - n | e >>> n, Cv = (t, e, n) => t << 64 - n | e >>> n - 32, Tv = (t, e, n) => t >>> n - 32 | e << 64 - n, Bv = (t, e) => e, Mv = (t, e) => t, Nv = (t, e, n) => t << n | e >>> 32 - n, Pv = (t, e, n) => e << n | t >>> 32 - n, _v = (t, e, n) => e << n - 32 | t >>> 64 - n, Uv = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Hv(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const Ov = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Dv = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Fv = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), jv = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, zv = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), Rv = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, Mt = {
  fromBig: Ey,
  split: Av,
  toBig: vv,
  shrSH: kv,
  shrSL: $v,
  rotrSH: Iv,
  rotrSL: Lv,
  rotrBH: Cv,
  rotrBL: Tv,
  rotr32H: Bv,
  rotr32L: Mv,
  rotlSH: Nv,
  rotlSL: Pv,
  rotlBH: _v,
  rotlBL: Uv,
  add: Hv,
  add3L: Ov,
  add3H: Dv,
  add4L: Fv,
  add4H: jv,
  add5H: Rv,
  add5L: zv
}, [Gv, Kv] = Mt.split([
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
].map((t) => BigInt(t))), gs = new Uint32Array(80), ys = new Uint32Array(80);
class Gc extends Nf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: w, Gh: p, Gl: x, Hh: S, Hl: M } = this;
    return [e, n, r, i, s, o, a, c, u, f, l, w, p, x, S, M];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, f, l, w, p, x, S, M) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = w | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = S | 0, this.Hl = M | 0;
  }
  process(e, n) {
    for (let A = 0; A < 16; A++, n += 4)
      gs[A] = e.getUint32(n), ys[A] = e.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const _ = gs[A - 15] | 0, N = ys[A - 15] | 0, Q = Mt.rotrSH(_, N, 1) ^ Mt.rotrSH(_, N, 8) ^ Mt.shrSH(_, N, 7), tt = Mt.rotrSL(_, N, 1) ^ Mt.rotrSL(_, N, 8) ^ Mt.shrSL(_, N, 7), R = gs[A - 2] | 0, K = ys[A - 2] | 0, L = Mt.rotrSH(R, K, 19) ^ Mt.rotrBH(R, K, 61) ^ Mt.shrSH(R, K, 6), P = Mt.rotrSL(R, K, 19) ^ Mt.rotrBL(R, K, 61) ^ Mt.shrSL(R, K, 6), b = Mt.add4L(tt, P, ys[A - 7], ys[A - 16]), T = Mt.add4H(b, Q, L, gs[A - 7], gs[A - 16]);
      gs[A] = T | 0, ys[A] = b | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: w, Fh: p, Fl: x, Gh: S, Gl: M, Hh: j, Hl: z } = this;
    for (let A = 0; A < 80; A++) {
      const _ = Mt.rotrSH(l, w, 14) ^ Mt.rotrSH(l, w, 18) ^ Mt.rotrBH(l, w, 41), N = Mt.rotrSL(l, w, 14) ^ Mt.rotrSL(l, w, 18) ^ Mt.rotrBL(l, w, 41), Q = l & p ^ ~l & S, tt = w & x ^ ~w & M, R = Mt.add5L(z, N, tt, Kv[A], ys[A]), K = Mt.add5H(R, j, _, Q, Gv[A], gs[A]), L = R | 0, P = Mt.rotrSH(r, i, 28) ^ Mt.rotrBH(r, i, 34) ^ Mt.rotrBH(r, i, 39), b = Mt.rotrSL(r, i, 28) ^ Mt.rotrBL(r, i, 34) ^ Mt.rotrBL(r, i, 39), T = r & s ^ r & a ^ s & a, H = i & o ^ i & c ^ o & c;
      j = S | 0, z = M | 0, S = p | 0, M = x | 0, p = l | 0, x = w | 0, { h: l, l: w } = Mt.add(u | 0, f | 0, K | 0, L | 0), u = a | 0, f = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const C = Mt.add3L(L, b, H);
      r = Mt.add3H(C, K, P, T), i = C | 0;
    }
    ({ h: r, l: i } = Mt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = Mt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = Mt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Mt.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: w } = Mt.add(this.Eh | 0, this.El | 0, l | 0, w | 0), { h: p, l: x } = Mt.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: S, l: M } = Mt.add(this.Gh | 0, this.Gl | 0, S | 0, M | 0), { h: j, l: z } = Mt.add(this.Hh | 0, this.Hl | 0, j | 0, z | 0), this.set(r, i, s, o, a, c, u, f, l, w, p, x, S, M, j, z);
  }
  roundClean() {
    gs.fill(0), ys.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class Vv extends Gc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class qv extends Gc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class Wv extends Gc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
pi(() => new Gc());
pi(() => new Vv());
const Xv = pi(() => new qv());
pi(() => new Wv());
function Ay(t) {
  if (ge(t).byteLength != Rc)
    throw Error("Invalid signature");
  return {
    type: ft.MessageSignature,
    data: t
  };
}
function vo(t, e) {
  return { type: ft.Address, version: t, hash160: e };
}
function _i(t) {
  return fi.c32address(t.version, t.hash160);
}
function ri(t, e, n) {
  const r = e || 1, i = n || J4;
  if (Fy(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: ft.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: i
  };
}
function Hf(t) {
  const e = fi.c32addressDecode(t);
  return {
    type: ft.Address,
    version: e[0],
    hash160: e[1]
  };
}
var Y;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Y || (Y = {}));
function Yv(t) {
  if (t.type === Y.PrincipalStandard)
    return _i(t.address);
  if (t.type === Y.PrincipalContract)
    return `${_i(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function vy(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Jv(e, n);
  } else
    return Zv(t);
}
function Zv(t) {
  const e = Hf(t);
  return { type: Y.PrincipalStandard, address: e };
}
function Qv(t) {
  return { type: Y.PrincipalStandard, address: t };
}
function Jv(t, e) {
  const n = Hf(t), r = ri(e);
  return ky(n, r);
}
function ky(t, e) {
  if (uo(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: Y.PrincipalContract, address: t, contractName: e };
}
function pl(t, e = !1) {
  switch (t.type) {
    case Y.BoolTrue:
      return !0;
    case Y.BoolFalse:
      return !1;
    case Y.Int:
    case Y.UInt:
      return e ? t.value.toString() : t.value;
    case Y.Buffer:
      return `0x${Ht(t.buffer)}`;
    case Y.OptionalNone:
      return null;
    case Y.OptionalSome:
      return wr(t.value);
    case Y.ResponseErr:
      return wr(t.value);
    case Y.ResponseOk:
      return wr(t.value);
    case Y.PrincipalStandard:
    case Y.PrincipalContract:
      return Yv(t);
    case Y.List:
      return t.list.map((r) => wr(r));
    case Y.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = wr(t.data[r]);
      }), n;
    case Y.StringASCII:
      return t.data;
    case Y.StringUTF8:
      return t.data;
  }
}
function wr(t) {
  switch (t.type) {
    case Y.ResponseErr:
      return { type: ms(t), value: pl(t, !0), success: !1 };
    case Y.ResponseOk:
      return { type: ms(t), value: pl(t, !0), success: !0 };
    default:
      return { type: ms(t), value: pl(t, !0) };
  }
}
function ms(t) {
  switch (t.type) {
    case Y.BoolTrue:
    case Y.BoolFalse:
      return "bool";
    case Y.Int:
      return "int";
    case Y.UInt:
      return "uint";
    case Y.Buffer:
      return `(buff ${t.buffer.length})`;
    case Y.OptionalNone:
      return "(optional none)";
    case Y.OptionalSome:
      return `(optional ${ms(t.value)})`;
    case Y.ResponseErr:
      return `(response UnknownType ${ms(t.value)})`;
    case Y.ResponseOk:
      return `(response ${ms(t.value)} UnknownType)`;
    case Y.PrincipalStandard:
    case Y.PrincipalContract:
      return "principal";
    case Y.List:
      return `(list ${t.list.length} ${t.list.length ? ms(t.list[0]) : "UnknownType"})`;
    case Y.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${ms(t.data[e])})`).join(" ")})`;
    case Y.StringASCII:
      return `(string-ascii ${py(t.data).length})`;
    case Y.StringUTF8:
      return `(string-utf8 ${uo(t.data).length})`;
  }
}
const $y = () => ({ type: Y.BoolTrue }), Iy = () => ({ type: Y.BoolFalse }), t8 = (t) => t ? $y() : Iy(), Fh = BigInt("0xffffffffffffffffffffffffffffffff"), e8 = BigInt(0), jh = BigInt("0x7fffffffffffffffffffffffffffffff"), zh = BigInt("-170141183460469231731687303715884105728"), n8 = (t) => {
  const e = pn(t, !0);
  if (e > jh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${jh}`);
  if (e < zh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${zh}`);
  return { type: Y.Int, value: e };
}, Sr = (t) => {
  const e = pn(t, !1);
  if (e < e8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Fh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Fh}`);
  return { type: Y.UInt, value: e };
}, Ly = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Y.Buffer, buffer: t };
};
function Cy() {
  return { type: Y.OptionalNone };
}
function Ty(t) {
  return { type: Y.OptionalSome, value: t };
}
function r8(t) {
  return { type: Y.ResponseErr, value: t };
}
function s8(t) {
  return { type: Y.ResponseOk, value: t };
}
function i8(t) {
  return { type: Y.List, list: t };
}
function si(t) {
  for (const e in t)
    if (!W8(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Y.Tuple, data: t };
}
const Ze = (t) => ({ type: Y.StringASCII, data: t }), o8 = (t) => ({ type: Y.StringUTF8, data: t });
class By extends by {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Hs.hash(e);
    const r = Mf(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const i = this.blockLen, s = new Uint8Array(i);
    s.set(r.length > i ? e.create().update(r).digest() : r);
    for (let o = 0; o < s.length; o++)
      s[o] ^= 54;
    this.iHash.update(s), this.oHash = e.create();
    for (let o = 0; o < s.length; o++)
      s[o] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(e) {
    return Hs.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Hs.exists(this), Hs.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: i, destroyed: s, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = i, e.destroyed = s, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const My = (t, e, n) => new By(t, e).update(n).digest();
My.create = (t, e) => new By(t, e);
Be.hmacSha256Sync = (t, ...e) => {
  const n = My.create(Uf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function eo(t) {
  return {
    type: ft.PublicKey,
    data: ge(t)
  };
}
function a8(t, e, n = me.Compressed) {
  const r = K4(e.data), i = new Pn(Bh(r.r), Bh(r.s)), s = Ut.fromSignature(t, i, r.recoveryId), o = n === me.Compressed;
  return s.toHex(o);
}
function c8(t) {
  return { type: ft.PublicKey, data: t };
}
function fo(t) {
  return !Ht(t.data).startsWith("04");
}
function lc(t) {
  return t.data.slice();
}
function l8(t) {
  const e = d8(t), n = Ko(e.data.slice(0, 32), e.compressed);
  return eo(Ht(n));
}
function u8(t) {
  const e = typeof t == "string" ? t : Ht(t), n = Ut.fromHex(e).toHex(!0);
  return eo(n);
}
function f8(t) {
  const e = typeof t == "string" ? t : Ht(t), n = Ut.fromHex(e).toHex(!1);
  return eo(n);
}
function Eu(t) {
  const e = t.readUInt8(), n = e === 4 ? nv : ev;
  return c8(He([e, t.readBytes(n)]));
}
function d8(t) {
  const e = V4(t), n = e.length == gy;
  return { data: e, compressed: n };
}
function h8(t, e) {
  const [n, r] = Ec(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const s = Yo(r, 1) + Pn.fromHex(n).toCompactHex();
  return Ay(s);
}
function p8(t) {
  return l8(t.data);
}
function g8(t, e, n) {
  return typeof t == "string" && (t = vy(t)), typeof n == "string" && (n = Kh(n)), {
    type: ft.Payload,
    payloadType: _t.TokenTransfer,
    recipient: t,
    amount: pn(e, !1),
    memo: n ?? Kh("")
  };
}
function y8(t, e, n, r) {
  return typeof t == "string" && (t = Hf(t)), typeof e == "string" && (e = ri(e)), typeof n == "string" && (n = ri(n)), {
    type: ft.Payload,
    payloadType: _t.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Rh(t, e, n) {
  return typeof t == "string" && (t = ri(t)), typeof e == "string" && (e = k8(e)), typeof n == "number" ? {
    type: ft.Payload,
    payloadType: _t.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: ft.Payload,
    payloadType: _t.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function w8() {
  return { type: ft.Payload, payloadType: _t.PoisonMicroblock };
}
function Gh(t, e) {
  if (t.byteLength != js)
    throw Error(`Coinbase buffer size must be ${js} bytes`);
  return e != null ? {
    type: ft.Payload,
    payloadType: _t.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: ft.Payload,
    payloadType: _t.Coinbase,
    coinbaseBytes: t
  };
}
function b8(t, e, n) {
  if (t.byteLength != js)
    throw Error(`Coinbase buffer size must be ${js} bytes`);
  if (n.byteLength != wu)
    throw Error(`VRF proof buffer size must be ${wu} bytes`);
  return {
    type: ft.Payload,
    payloadType: _t.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Y.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var Au;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(Au || (Au = {}));
function m8(t, e, n, r, i, s, o) {
  return {
    type: ft.Payload,
    payloadType: _t.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: i,
    cause: s,
    publicKeyHash: o
  };
}
function Ny(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case _t.TokenTransfer:
      e.push(_e(t.recipient)), e.push($s(t.amount, !1, 8)), e.push(Ur(t.memo));
      break;
    case _t.ContractCall:
      e.push(Ur(t.contractAddress)), e.push(Ur(t.contractName)), e.push(Ur(t.functionName));
      const n = new Uint8Array(4);
      ni(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(_e(r));
      });
      break;
    case _t.SmartContract:
      e.push(Ur(t.contractName)), e.push(Ur(t.codeBody));
      break;
    case _t.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Ur(t.contractName)), e.push(Ur(t.codeBody));
      break;
    case _t.PoisonMicroblock:
      break;
    case _t.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case _t.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(_e(t.recipient));
      break;
    case _t.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(_e(t.recipient ? Ty(t.recipient) : Cy())), e.push(t.vrfProof);
      break;
    case _t.TenureChange:
      e.push(ge(t.tenureHash)), e.push(ge(t.previousTenureHash)), e.push(ge(t.burnViewHash)), e.push(ge(t.previousTenureEnd)), e.push(ni(new Uint8Array(4), t.previousTenureBlocks)), e.push(Y4(new Uint8Array(1), t.cause)), e.push(ge(t.publicKeyHash));
      break;
  }
  return He(e);
}
function x8(t) {
  switch (t.readUInt8Enum(_t, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case _t.TokenTransfer:
      const n = Kn(t), r = pn(t.readBytes(8), !1), i = _y(t);
      return g8(n, r, i);
    case _t.ContractCall:
      const s = no(t), o = Gn(t), a = Gn(t), c = [], u = t.readUInt32BE();
      for (let A = 0; A < u; A++) {
        const _ = Kn(t);
        c.push(_);
      }
      return y8(s, o, a, c);
    case _t.SmartContract:
      const f = Gn(t), l = Gn(t, 4, 1e5);
      return Rh(f, l);
    case _t.VersionedSmartContract: {
      const A = t.readUInt8Enum(bu, (Q) => {
        throw new Error(`Cannot recognize ClarityVersion: ${Q}`);
      }), _ = Gn(t), N = Gn(t, 4, 1e5);
      return Rh(_, N, A);
    }
    case _t.PoisonMicroblock:
      return w8();
    case _t.Coinbase: {
      const A = t.readBytes(js);
      return Gh(A);
    }
    case _t.CoinbaseToAltRecipient: {
      const A = t.readBytes(js), _ = Kn(t);
      return Gh(A, _);
    }
    case _t.NakamotoCoinbase: {
      const A = t.readBytes(js), _ = Kn(t), N = t.readBytes(wu);
      return b8(A, _, N);
    }
    case _t.TenureChange:
      const w = Ht(t.readBytes(20)), p = Ht(t.readBytes(20)), x = Ht(t.readBytes(20)), S = Ht(t.readBytes(32)), M = t.readUInt32BE(), j = t.readUInt8Enum(Au, (A) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${A}`);
      }), z = Ht(t.readBytes(20));
      return m8(w, p, x, S, M, j, z);
  }
}
class Kc extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Ms extends Kc {
  constructor(e) {
    super(e);
  }
}
class Nn extends Kc {
  constructor(e) {
    super(e);
  }
}
class uc extends Kc {
  constructor(e) {
    super(e);
  }
}
class Os extends Kc {
  constructor(e) {
    super(e);
  }
}
var Jn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Jn || (Jn = {}));
function vu(t) {
  return Ay(Ht(t.readBytes(Rc)));
}
function Ui(t, e) {
  return {
    pubKeyEncoding: t,
    type: ft.TransactionAuthField,
    contents: e
  };
}
function S8(t) {
  const e = t.readUInt8Enum(Jn, (n) => {
    throw new Nn(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case Jn.PublicKeyCompressed:
      return Ui(me.Compressed, Eu(t));
    case Jn.PublicKeyUncompressed:
      return Ui(me.Uncompressed, f8(Eu(t).data));
    case Jn.SignatureCompressed:
      return Ui(me.Compressed, vu(t));
    case Jn.SignatureUncompressed:
      return Ui(me.Uncompressed, vu(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function Of(t) {
  return ge(t.data);
}
function E8(t) {
  const e = [];
  switch (t.contents.type) {
    case ft.PublicKey:
      e.push(t.pubKeyEncoding === me.Compressed ? Jn.PublicKeyCompressed : Jn.PublicKeyUncompressed), e.push(lc(u8(t.contents.data)));
      break;
    case ft.MessageSignature:
      e.push(t.pubKeyEncoding === me.Compressed ? Jn.SignatureCompressed : Jn.SignatureUncompressed), e.push(Of(t.contents));
      break;
  }
  return He(e);
}
function Ur(t) {
  switch (t.type) {
    case ft.Address:
      return Zo(t);
    case ft.Principal:
      return Py(t);
    case ft.LengthPrefixedString:
      return ro(t);
    case ft.MemoString:
      return $8(t);
    case ft.AssetInfo:
      return Uy(t);
    case ft.PostCondition:
      return I8(t);
    case ft.PublicKey:
      return lc(t);
    case ft.LengthPrefixedList:
      return jf(t);
    case ft.Payload:
      return Ny(t);
    case ft.TransactionAuthField:
      return E8(t);
    case ft.MessageSignature:
      return Of(t);
  }
}
function A8() {
  return {
    type: ft.Address,
    version: cc.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Df(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === ie.SerializeP2PKH || e === ie.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === ie.SerializeP2WPKH || e === ie.SerializeP2WSH || e === ie.SerializeP2WSHNonSequential) && !r.every(fo))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case ie.SerializeP2PKH:
      return vo(t, G8(r[0].data));
    case ie.SerializeP2WPKH:
      return vo(t, K8(r[0].data));
    case ie.SerializeP2SH:
    case ie.SerializeP2SHNonSequential:
      return vo(t, V8(n, r.map(lc)));
    case ie.SerializeP2WSH:
    case ie.SerializeP2WSHNonSequential:
      return vo(t, q8(n, r.map(lc)));
  }
}
function Zo(t) {
  const e = [];
  return e.push(ge(Yo(t.version, 1))), e.push(ge(t.hash160)), He(e);
}
function no(t) {
  const e = jc(Ht(t.readBytes(1))), n = Ht(t.readBytes(20));
  return { type: ft.Address, version: e, hash160: n };
}
function Py(t) {
  const e = [];
  return e.push(t.prefix), e.push(Zo(t.address)), t.prefix === Do.Contract && e.push(ro(t.contractName)), He(e);
}
function v8(t) {
  const e = t.readUInt8Enum(Do, (i) => {
    throw new Nn(`Unexpected Principal payload type: ${i}`);
  }), n = no(t);
  if (e === Do.Standard)
    return { type: ft.Principal, prefix: e, address: n };
  const r = Gn(t);
  return {
    type: ft.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function ro(t) {
  const e = [], n = uo(t.content), r = n.byteLength;
  return e.push(ge(Yo(r, t.lengthPrefixBytes))), e.push(n), He(e);
}
function Gn(t, e, n) {
  e = e || 1;
  const r = jc(Ht(t.readBytes(e))), i = Bf(t.readBytes(r));
  return ri(i, e, n ?? 128);
}
function k8(t) {
  return ri(t, 4, 1e5);
}
function Kh(t) {
  if (t && Fy(t, oc))
    throw new Error(`Memo exceeds maximum length of ${oc} bytes`);
  return { type: ft.MemoString, content: t };
}
function $8(t) {
  const e = [], n = uo(t.content), r = R8(Ht(n), oc * 2);
  return e.push(ge(r)), He(e);
}
function _y(t) {
  let e = Bf(t.readBytes(oc));
  return e = e.replace(/\u0000*$/, ""), { type: ft.MemoString, content: e };
}
function Uy(t) {
  const e = [];
  return e.push(Zo(t.address)), e.push(ro(t.contractName)), e.push(ro(t.assetName)), He(e);
}
function ku(t) {
  return {
    type: ft.AssetInfo,
    address: no(t),
    contractName: Gn(t),
    assetName: Gn(t)
  };
}
function Ff(t, e) {
  return {
    type: ft.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function jf(t) {
  const e = t.values, n = [];
  n.push(ge(Yo(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Ur(r));
  return He(n);
}
function Hy(t, e, n) {
  const r = jc(Ht(t.readBytes(4))), i = [];
  for (let s = 0; s < r; s++)
    switch (e) {
      case ft.Address:
        i.push(no(t));
        break;
      case ft.LengthPrefixedString:
        i.push(Gn(t));
        break;
      case ft.MemoString:
        i.push(_y(t));
        break;
      case ft.AssetInfo:
        i.push(ku(t));
        break;
      case ft.PostCondition:
        i.push(L8(t));
        break;
      case ft.PublicKey:
        i.push(Eu(t));
        break;
      case ft.TransactionAuthField:
        i.push(S8(t));
        break;
    }
  return Ff(i, n);
}
function I8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Py(t.principal)), (t.conditionType === An.Fungible || t.conditionType === An.NonFungible) && e.push(Uy(t.assetInfo)), t.conditionType === An.NonFungible && e.push(_e(t.assetName)), e.push(t.conditionCode), t.conditionType === An.STX || t.conditionType === An.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Ms("The post-condition amount may not be larger than 8 bytes");
    e.push($s(t.amount, !1, 8));
  }
  return He(e);
}
function L8(t) {
  const e = t.readUInt8Enum(An, (o) => {
    throw new Nn(`Could not read ${o} as PostConditionType`);
  }), n = v8(t);
  let r, i, s;
  switch (e) {
    case An.STX:
      return r = t.readUInt8Enum(Oo, (a) => {
        throw new Nn(`Could not read ${a} as FungibleConditionCode`);
      }), s = BigInt(`0x${Ht(t.readBytes(8))}`), {
        type: ft.PostCondition,
        conditionType: An.STX,
        principal: n,
        conditionCode: r,
        amount: s
      };
    case An.Fungible:
      return i = ku(t), r = t.readUInt8Enum(Oo, (a) => {
        throw new Nn(`Could not read ${a} as FungibleConditionCode`);
      }), s = BigInt(`0x${Ht(t.readBytes(8))}`), {
        type: ft.PostCondition,
        conditionType: An.Fungible,
        principal: n,
        conditionCode: r,
        amount: s,
        assetInfo: i
      };
    case An.NonFungible:
      i = ku(t);
      const o = Kn(t);
      return r = t.readUInt8Enum(mu, (a) => {
        throw new Nn(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: ft.PostCondition,
        conditionType: An.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: i,
        assetName: o
      };
  }
}
function $r(t, e) {
  return He([t, e]);
}
function C8(t) {
  return new Uint8Array([t.type]);
}
function T8(t) {
  return t.type === Y.OptionalNone ? new Uint8Array([t.type]) : $r(t.type, _e(t.value));
}
function B8(t) {
  const e = new Uint8Array(4);
  return ni(e, t.buffer.length, 0), $r(t.type, zc(e, t.buffer));
}
function M8(t) {
  const e = Tf(D4(t.value, BigInt(tv)), yy);
  return $r(t.type, e);
}
function N8(t) {
  const e = Tf(t.value, yy);
  return $r(t.type, e);
}
function P8(t) {
  return $r(t.type, Zo(t.address));
}
function _8(t) {
  return $r(t.type, zc(Zo(t.address), ro(t.contractName)));
}
function U8(t) {
  return $r(t.type, _e(t.value));
}
function H8(t) {
  const e = [], n = new Uint8Array(4);
  ni(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const i = _e(r);
    e.push(i);
  }
  return $r(t.type, He(e));
}
function O8(t) {
  const e = [], n = new Uint8Array(4);
  ni(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = ri(i);
    e.push(ro(s));
    const o = _e(t.data[i]);
    e.push(o);
  }
  return $r(t.type, He(e));
}
function Oy(t, e) {
  const n = [], r = e == "ascii" ? py(t.data) : uo(t.data), i = new Uint8Array(4);
  return ni(i, r.length, 0), n.push(i), n.push(r), $r(t.type, He(n));
}
function D8(t) {
  return Oy(t, "ascii");
}
function F8(t) {
  return Oy(t, "utf8");
}
function _e(t) {
  switch (t.type) {
    case Y.BoolTrue:
    case Y.BoolFalse:
      return C8(t);
    case Y.OptionalNone:
    case Y.OptionalSome:
      return T8(t);
    case Y.Buffer:
      return B8(t);
    case Y.UInt:
      return N8(t);
    case Y.Int:
      return M8(t);
    case Y.PrincipalStandard:
      return P8(t);
    case Y.PrincipalContract:
      return _8(t);
    case Y.ResponseOk:
    case Y.ResponseErr:
      return U8(t);
    case Y.List:
      return H8(t);
    case Y.Tuple:
      return O8(t);
    case Y.StringASCII:
      return D8(t);
    case Y.StringUTF8:
      return F8(t);
    default:
      throw new Ms("Unable to serialize. Invalid Clarity Value.");
  }
}
function j8(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Vh = /* @__PURE__ */ new Map();
function Dy(t, e) {
  const n = Vh.get(t);
  if (n !== void 0)
    return n(e);
  const r = j8(t);
  return Vh.set(t, r), Dy(t, e);
}
class Co {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Z4(this.readBytes(4), 0);
  }
  readUInt8() {
    return X4(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return q4(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = Ht(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = Ht(n);
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
    if (Dy(e, r))
      return r;
    throw n(r);
  }
}
function Kn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Co(ge(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Co(t) : e = t;
  switch (e.readUInt8Enum(Y, (r) => {
    throw new Nn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Y.Int:
      return n8(e.readBytes(16));
    case Y.UInt:
      return Sr(e.readBytes(16));
    case Y.Buffer:
      const r = e.readUInt32BE();
      return Ly(e.readBytes(r));
    case Y.BoolTrue:
      return $y();
    case Y.BoolFalse:
      return Iy();
    case Y.PrincipalStandard:
      const i = no(e);
      return Qv(i);
    case Y.PrincipalContract:
      const s = no(e), o = Gn(e);
      return ky(s, o);
    case Y.ResponseOk:
      return s8(Kn(e));
    case Y.ResponseErr:
      return r8(Kn(e));
    case Y.OptionalNone:
      return Cy();
    case Y.OptionalSome:
      return Ty(Kn(e));
    case Y.List:
      const a = e.readUInt32BE(), c = [];
      for (let S = 0; S < a; S++)
        c.push(Kn(e));
      return i8(c);
    case Y.Tuple:
      const u = e.readUInt32BE(), f = {};
      for (let S = 0; S < u; S++) {
        const M = Gn(e).content;
        if (M === void 0)
          throw new Nn('"content" is undefined');
        f[M] = Kn(e);
      }
      return si(f);
    case Y.StringASCII:
      const l = e.readUInt32BE(), w = R4(e.readBytes(l));
      return Ze(w);
    case Y.StringUTF8:
      const p = e.readUInt32BE(), x = Bf(e.readBytes(p));
      return o8(x);
    default:
      throw new Nn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const z8 = (t) => t.length % 2 == 0 ? t : `0${t}`, R8 = (t, e) => t.padEnd(e, "0"), Fy = (t, e) => t ? uo(t).length > e : !1;
function $u(t) {
  return ig(t);
}
const Fo = (t) => bv(Uf(t)), zf = (t) => Ht(Xv(t)), G8 = (t) => Ht(Fo(t)), K8 = (t) => {
  const e = Fo(t), n = zc(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Fo(n);
  return Ht(r);
}, V8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + e.length), n.push(174);
  const r = He(n), i = Fo(r);
  return Ht(i);
}, q8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = He(n), i = Uf(r), s = [];
  s.push(0), s.push(i.length), s.push(i);
  const o = He(s), a = Fo(o);
  return Ht(a);
};
function W8(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function jy(t) {
  const e = _e(t);
  return `0x${Ht(e)}`;
}
function X8(t) {
  return Kn(t);
}
const Di = (t) => {
  try {
    return fi.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function Rf() {
  return {
    type: ft.MessageSignature,
    data: Ht(new Uint8Array(Rc))
  };
}
function zy(t, e, n, r) {
  const i = Df(0, t, 1, [eo(e)]).hash160, s = fo(eo(e)) ? me.Compressed : me.Uncompressed;
  return {
    hashMode: t,
    signer: i,
    nonce: pn(n, !1),
    fee: pn(r, !1),
    keyEncoding: s,
    signature: Rf()
  };
}
function jo(t) {
  return "signature" in t;
}
function qh(t) {
  return t === ie.SerializeP2SH || t === ie.SerializeP2WSH;
}
function Y8(t) {
  return t === ie.SerializeP2SHNonSequential || t === ie.SerializeP2WSHNonSequential;
}
function Wh(t) {
  const e = $u(t);
  return e.nonce = 0, e.fee = 0, jo(e) ? e.signature = Rf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function Z8(t) {
  const e = [
    t.hashMode,
    ge(t.signer),
    $s(t.nonce, !1, 8),
    $s(t.fee, !1, 8),
    t.keyEncoding,
    Of(t.signature)
  ];
  return He(e);
}
function Q8(t) {
  const e = [
    t.hashMode,
    ge(t.signer),
    $s(t.nonce, !1, 8),
    $s(t.fee, !1, 8)
  ], n = Ff(t.fields);
  e.push(jf(n));
  const r = new Uint8Array(2);
  return W4(r, t.signaturesRequired, 0), e.push(r), He(e);
}
function J8(t, e) {
  const n = Ht(e.readBytes(20)), r = BigInt(`0x${Ht(e.readBytes(8))}`), i = BigInt(`0x${Ht(e.readBytes(8))}`), s = e.readUInt8Enum(me, (a) => {
    throw new Nn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === ie.SerializeP2WPKH && s != me.Compressed)
    throw new Nn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = vu(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    keyEncoding: s,
    signature: o
  };
}
function t5(t, e) {
  const n = Ht(e.readBytes(20)), r = BigInt("0x" + Ht(e.readBytes(8))), i = BigInt("0x" + Ht(e.readBytes(8))), s = Hy(e, ft.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of s)
    switch (u.contents.type) {
      case ft.PublicKey:
        fo(u.contents) || (o = !0);
        break;
      case ft.MessageSignature:
        if (u.pubKeyEncoding === me.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Os("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === ie.SerializeP2WSH || t === ie.SerializeP2WSHNonSequential))
    throw new Os("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    fields: s,
    signaturesRequired: c
  };
}
function gl(t) {
  return jo(t) ? Z8(t) : Q8(t);
}
function yl(t) {
  const e = t.readUInt8Enum(ie, (n) => {
    throw new Nn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === ie.SerializeP2PKH || e === ie.SerializeP2WPKH ? J8(e, t) : t5(e, t);
}
function Ry(t, e, n, r) {
  const s = t + Ht(new Uint8Array([e])) + Ht($s(n, !1, 8)) + Ht($s(r, !1, 8));
  if (ge(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return zf(ge(s));
}
function Gy(t, e, n) {
  const r = 33 + Rc, i = fo(e) ? me.Compressed : me.Uncompressed, s = t + z8(i.toString(16)) + n.data, o = ge(s);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return zf(o);
}
function e5(t, e, n, r, i) {
  const s = Ry(t, e, n, r), o = h8(i, s), a = p8(i), c = Gy(s, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Ky(t, e, n, r, i, s) {
  const o = Ry(t, e, n, r), a = eo(a8(o, s, i)), c = Gy(o, a, s);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function n5() {
  const t = zy(ie.SerializeP2PKH, "", 0, 0);
  return t.signer = A8().hash160, t.keyEncoding = me.Compressed, t.signature = Rf(), t;
}
function Xh(t, e, n) {
  return jo(t) ? r5(t, e, n) : s5(t, e, n);
}
function r5(t, e, n) {
  const { pubKey: r, nextSigHash: i } = Ky(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), s = Df(0, t.hashMode, 1, [r]).hash160;
  if (s !== t.signer)
    throw new Os(`Signer hash does not equal hash of public key(s): ${s} != ${t.signer}`);
  return i;
}
function s5(t, e, n) {
  const r = [];
  let i = e, s = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case ft.PublicKey:
        fo(c.contents) || (s = !0), r.push(c.contents);
        break;
      case ft.MessageSignature:
        c.pubKeyEncoding === me.Uncompressed && (s = !0);
        const { pubKey: u, nextSigHash: f } = Ky(i, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (qh(t.hashMode) && (i = f), r.push(u), o += 1, o === 65536)
          throw new Os("Too many signatures");
        break;
    }
  if (qh(t.hashMode) && o !== t.signaturesRequired || Y8(t.hashMode) && o < t.signaturesRequired)
    throw new Os("Incorrect number of signatures");
  if (s && (t.hashMode === ie.SerializeP2WSH || t.hashMode === ie.SerializeP2WSHNonSequential))
    throw new Os("Uncompressed keys are not allowed in this hash mode");
  const a = Df(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Os(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return i;
}
function Vy(t) {
  return {
    authType: Te.Standard,
    spendingCondition: t
  };
}
function qy(t, e) {
  return {
    authType: Te.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || zy(ie.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function Yh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Te.Standard:
        return Vy(Wh(t.spendingCondition));
      case Te.Sponsored:
        return qy(Wh(t.spendingCondition), n5());
      default:
        throw new uc("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function i5(t, e) {
  switch (t.authType) {
    case Te.Standard:
      return Xh(t.spendingCondition, e, Te.Standard);
    case Te.Sponsored:
      return Xh(t.spendingCondition, e, Te.Standard);
    default:
      throw new uc("Invalid origin auth type");
  }
}
function o5(t, e) {
  switch (t.authType) {
    case Te.Standard:
      const n = {
        ...t.spendingCondition,
        fee: pn(e, !1)
      };
      return { ...t, spendingCondition: n };
    case Te.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: pn(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function a5(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: pn(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function c5(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: pn(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function l5(t, e) {
  const n = {
    ...e,
    nonce: pn(e.nonce, !1),
    fee: pn(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function u5(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Te.Standard:
      e.push(gl(t.spendingCondition));
      break;
    case Te.Sponsored:
      e.push(gl(t.spendingCondition)), e.push(gl(t.sponsorSpendingCondition));
      break;
  }
  return He(e);
}
function f5(t) {
  const e = t.readUInt8Enum(Te, (r) => {
    throw new Nn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Te.Standard:
      return n = yl(t), Vy(n);
    case Te.Sponsored:
      n = yl(t);
      const r = yl(t);
      return qy(n, r);
  }
}
class d5 {
  constructor(e, n, r, i, s, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: pn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? Q4, this.postConditionMode = s ?? to.Deny, this.postConditions = i ?? Ff([]), o)
      this.anchorMode = rv(o);
    else
      switch (r.payloadType) {
        case _t.Coinbase:
        case _t.CoinbaseToAltRecipient:
        case _t.NakamotoCoinbase:
        case _t.PoisonMicroblock:
        case _t.TenureChange:
          this.anchorMode = En.OnChainOnly;
          break;
        case _t.ContractCall:
        case _t.SmartContract:
        case _t.VersionedSmartContract:
        case _t.TokenTransfer:
          this.anchorMode = En.Any;
          break;
      }
  }
  signBegin() {
    const e = $u(this);
    return e.auth = Yh(e.auth), e.txid();
  }
  verifyBegin() {
    const e = $u(this);
    return e.auth = Yh(e.auth), e.txid();
  }
  verifyOrigin() {
    return i5(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Te.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Te.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Te.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !jo(n)) {
      const r = fo(e);
      n.fields.push(Ui(r ? me.Compressed : me.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, i) {
    const { nextSig: s, nextSigHash: o } = e5(n, r, e.fee, e.nonce, i);
    return jo(e) ? e.signature = s : e.fields.push(Ui(i.data.byteLength === gy ? me.Compressed : me.Uncompressed, s)), o;
  }
  txid() {
    const e = this.serialize();
    return zf(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Te.Sponsored)
      throw new uc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = l5(this.auth, e);
  }
  setFee(e) {
    this.auth = o5(this.auth, e);
  }
  setNonce(e) {
    this.auth = a5(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Te.Sponsored)
      throw new uc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = c5(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new Ms('"version" is undefined');
    if (this.chainId === void 0)
      throw new Ms('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Ms('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Ms('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Ms('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return ni(n, this.chainId, 0), e.push(n), e.push(u5(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(jf(this.postConditions)), e.push(Ny(this.payload)), He(e);
  }
}
function fc(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new Co(ge(t.slice(2))) : e = new Co(ge(t)) : t instanceof Uint8Array ? e = new Co(t) : e = t;
  const n = e.readUInt8Enum(ac, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), i = f5(e), s = e.readUInt8Enum(En, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(to, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = Hy(e, ft.PostCondition), c = x8(e);
  return new d5(n, i, c, a, o, s, r);
}
const h5 = t8, To = Sr, p5 = Ly;
const g5 = /* @__PURE__ */ new Set([4001, -31001]), y5 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], w5 = ["result", "data", "payload", "response", "params"], Zh = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Vc = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), gi = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, Fr = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, b5 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Wy = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, i) => !!(r != null && r.id) && n.findIndex((s) => b5(s, r)) === i
  );
}, Xy = (t) => t ? Wy(gi()).some(
  (e) => {
    var n;
    return e.id === t && (Vc(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Yy = () => {
  if (typeof window > "u")
    return;
  const t = gi(), e = Wy(t).filter(
    (n) => {
      var r;
      return Vc(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Fr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of y5) {
    const r = Fr(t, n) ?? (t === window ? void 0 : Fr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, m5 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = gi(), n = Fr(e, t) ?? (e === window ? void 0 : Fr(window, t)) ?? Mc(t);
  if (n)
    return n;
  if (Vc(t) || Xy(t))
    return Yy();
}, Ia = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, x5 = ["blockstack-session", "blockstack"], S5 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of x5) {
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
S5();
const Zy = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Bn = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, E5 = (t) => {
  const e = Bn(t);
  if (!e)
    return null;
  const n = Zy(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, A5 = (t) => {
  const e = Bn(t);
  if (!e)
    return null;
  const n = Zy(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, Iu = (t, e = "mainnet") => {
  if (typeof t == "string") {
    const n = t.toLowerCase();
    if (n.includes("testnet") || n === "test")
      return "testnet";
    if (n.includes("mainnet") || n === "main")
      return "mainnet";
  }
  if (t && typeof t == "object") {
    const n = t;
    if (typeof n.network == "string")
      return Iu(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Iu(r, e);
  }
  return e;
}, zs = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, zo = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const i = t.trim();
    return Di(i) ? i : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const i of t) {
      const s = zo(i, e + 1);
      if (s)
        return s;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const n = t, r = [
    "address",
    "selectedAddress",
    "identityAddress",
    "stxAddress",
    "addresses",
    "accounts",
    "result",
    "profile",
    "authResponsePayload",
    "userData"
  ];
  for (const i of r) {
    if (!(i in n))
      continue;
    const s = zo(n[i], e + 1);
    if (s)
      return s;
  }
  return typeof n.mainnet == "string" && Di(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Di(n.testnet) ? n.testnet.trim() : null;
}, Qh = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Qy = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && g5.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, ii = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Bn(n == null ? void 0 : n.message) ?? Bn(e.message) ?? Bn(e.error) ?? Bn(t) ?? "Wallet provider request failed.", i = new Error(r);
  return i.code = (n == null ? void 0 : n.code) ?? e.code, i.data = (n == null ? void 0 : n.data) ?? e.data, i;
}, so = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw ii(e);
    if (e.status === "error")
      throw ii(e.result ?? e);
  }
  return t;
}, Jh = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return so(r);
  } catch (r) {
    throw ii(r);
  }
}, Jy = () => Yy(), Gf = () => {
  if (typeof window > "u")
    return;
  const t = gi();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Fr(t, e) ?? (t === window ? void 0 : Fr(window, e));
    if (n)
      return n;
  }
}, t0 = () => {
  if (typeof window > "u")
    return;
  const t = Gf();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = gi();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Fr(e, n) ?? (e === window ? void 0 : Fr(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Fa = (t) => {
  var r, i;
  const e = Xs();
  if (Vc(e) || Xy(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = gi() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((i = n.xverseProviders) == null ? void 0 : i.StacksProvider) || t === Jy();
}, wl = (t) => {
  const e = A5(t);
  if (!e)
    return null;
  try {
    const n = fc(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, dc = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = wl(t), r = E5(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Bn(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = dc(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const i = t;
  let s = null;
  for (const a of Zh)
    if (wl(i[a])) {
      s = Bn(i[a]);
      break;
    }
  const o = Bn(i.txId) || Bn(i.txid) || Bn(i.transactionId);
  if (o)
    return {
      ...i,
      txId: o,
      txid: o,
      txRaw: s ?? Bn(i.txRaw) ?? void 0
    };
  for (const a of Zh) {
    const c = wl(i[a]);
    if (c)
      return {
        ...i,
        txId: c,
        txid: c,
        txRaw: Bn(i[a]) ?? void 0
      };
  }
  for (const a of w5) {
    const c = i[a], u = dc(c, e + 1);
    if (u)
      return {
        ...i,
        ...c && typeof c == "object" ? c : {},
        ...u,
        txId: u.txId,
        txid: u.txid ?? u.txId
      };
  }
  return null;
}, bl = (t) => {
  const e = dc(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, v5 = (t) => {
  const e = dc(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, k5 = (t) => ({
  ...t,
  fee: zs(t.fee),
  nonce: zs(t.nonce),
  sponsored: t.sponsored === !0
}), e0 = (t) => ({
  recipient: t.recipient,
  amount: zs(t.amount) ?? "0",
  memo: t.memo,
  network: Iu(t.network),
  address: t.stxAddress,
  fee: zs(t.fee),
  nonce: zs(t.nonce),
  sponsored: t.sponsored ?? !1
}), tw = "WALLET_ADDRESS_MISMATCH", $5 = 45e3;
let Bo = null;
const Lu = (t) => {
  t && (Bo = { address: t, at: Date.now() });
}, I5 = () => {
  Bo = null;
}, L5 = () => Bo && Date.now() - Bo.at <= $5 ? Bo.address : null, C5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, T5 = async (t) => {
  I5();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = so(await t.request("wallet_connect")), n = zo(e);
  return Lu(n), n;
}, B5 = async (t, e, n, r) => {
  try {
    return so(await t.request(e, n));
  } catch (i) {
    const s = ii(i);
    if (!C5(s))
      throw s;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: s.message
    });
    let o = null;
    try {
      o = await T5(t);
    } catch (a) {
      throw console.info("[wallet:xverse-preflight]", {
        stage: "RECOVERY_RECONNECT_FAILED",
        message: a instanceof Error ? a.message : String(a)
      }), s;
    }
    if (!o || r && o !== r)
      throw Object.assign(
        new Error(
          o ? `Xverse reconnected as ${o}, not the expected ${r}. Switch back to that account and retry.` : s.message
        ),
        { code: o ? tw : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return so(await t.request(e, n));
    } catch (a) {
      throw ii(a);
    }
  }
};
let n0 = 3e4;
const M5 = (t, e) => {
  let n;
  const r = new Promise((i, s) => {
    n = setTimeout(() => {
      s(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${n0 / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, n0);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, N5 = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: tw }
      );
    return c;
  }, i = L5();
  if (i)
    return Ia(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: i }), r(i, "cached-session");
  let s = null;
  Ia(n, "account-read");
  try {
    const c = so(
      await M5(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    s = zo(c), console.info("[wallet:xverse-preflight]", {
      stage: s ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: s
    });
  } catch (c) {
    if (Qy(c))
      throw ii(c);
    Ia(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (s)
    return Lu(s), r(s, "wallet_getAccount");
  let o;
  Ia(n, "account-reconnect");
  try {
    o = so(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), ii(c);
  }
  const a = zo(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return Lu(a), r(a, "wallet_connect");
}, P5 = async (t, e) => {
  if (!Fa(t)) {
    const s = await Jh(
      t,
      "stx_transferStx",
      e0(e)
    );
    return bl(s);
  }
  const n = Gf();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const s = await Jh(
      n,
      "stx_transferStx",
      e0(e)
    );
    return bl(s);
  }
  const r = Jy();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await N5(r, e.stxAddress);
  const i = await B5(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: zs(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: zs(e.fee) } : {}
    },
    e.stxAddress
  );
  return bl(i);
}, _5 = () => Xs(), ew = () => {
  var r, i;
  if (typeof window > "u")
    return;
  const t = Xs(), e = t ? m5(t) : void 0;
  if (e)
    return e;
  const n = gi() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((i = n.xverseProviders) == null ? void 0 : i.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, r0 = (t, e) => {
  const n = ew(), r = k5({
    ...t,
    onFinish: (i) => {
      var s;
      (s = t.onFinish) == null || s.call(t, v5(i));
    }
  });
  if (!n || typeof n.request != "function")
    return Aa(r, e);
  if (Fa(n) && !Gf()) {
    const i = t0();
    if (i)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Xs(),
        route: "legacy-transaction-request"
      }), Aa(r, i);
  }
  return void P5(n, t).then((i) => {
    var s;
    (s = t.onFinish) == null || s.call(t, i);
  }).catch((i) => {
    var s, o;
    if (Qh(i) && Fa(n)) {
      const a = t0();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Xs(),
          route: "legacy-transaction-request"
        }), Aa(r, a);
        return;
      }
    }
    if (Qh(i) && !Fa(n)) {
      Aa(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", i), Qy(i)) {
      (s = t.onCancel) == null || s.call(t);
      return;
    }
    if (t.onError) {
      t.onError(i);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, U5 = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), s0 = (t) => jy(t).replace(/^0x/, ""), i0 = "This wallet cannot sign messages. Try Xverse or Leather.", o0 = (t) => typeof (t == null ? void 0 : t.request) == "function", a0 = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", H5 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, O5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function D5(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: s0(e.message),
    domain: s0(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function F5(t, e) {
  const n = await M4({
    domain: e.domain,
    message: e.message,
    network: Fc(e.network),
    stxAddress: e.stxAddress,
    appDetails: e.appDetails ?? U5()
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function c0(t) {
  var i, s;
  const e = _5() || "", n = /xverse/i.test(e);
  let r = ew();
  if (n && !a0(r)) {
    const o = window;
    r = ((i = o.XverseProviders) == null ? void 0 : i.StacksProvider) ?? ((s = o.xverseProviders) == null ? void 0 : s.StacksProvider);
  }
  if (a0(r))
    try {
      return await F5(r, t);
    } catch (o) {
      if (n || !o0(r) || !O5(o)) throw o;
    }
  if (!n && o0(r))
    try {
      return await D5(r, t);
    } catch (o) {
      throw H5(o) ? new Error(i0) : o;
    }
  throw new Error(i0);
}
const l0 = 1000000n, Ds = 1000000n, hc = 50n, je = 3000n, yi = 300n, mo = 3000n, j5 = 50000n, ml = 200n, qc = 15000n, Mn = (t) => t + hc;
function pr(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / l0}.${(n % l0).toString().padStart(6, "0")}`;
}
function u0(t, e = yi) {
  return t <= je ? 0 : Number((t - je) / Mn(e));
}
function xl(t, e = 0n) {
  const n = Ds - t - e;
  return n > 0n ? n : 0n;
}
function z5(t, e = yi) {
  return t > Ds ? "over" : t < je + Mn(e) ? "empty" : t < j5 ? "low" : "ok";
}
const R5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", G5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", K5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function V5(t) {
  var n, r, i, s;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((i = e["holder-payment"]) == null ? void 0 : i.value) !== "50" || ((s = e["receipt-bytes"]) == null ? void 0 : s.value) !== "16" || K5.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== R5 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const nw = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Sl = 3, q5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [Cu, rw] = nw.split("."), jn = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function Tu(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function W5(t) {
  return jn(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function vs(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function sw(t, e = []) {
  const n = await vs(`/v2/contracts/call-read/${Cu}/${rw}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Cu, arguments: e.map((r) => "0x" + jn(_e(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return wr(Kn(n.result));
}
async function X5() {
  const t = await vs(`/v2/contracts/source/${Cu}/${rw}?proof=0`);
  if (typeof t.source != "string" || await W5(t.source) !== G5) throw Error("Deployed source does not match the tested helper.");
  if (V5(await sw("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function iw(t) {
  return t.startsWith("SP") && Di(t) && !t.includes(".");
}
async function Y5(t) {
  var r;
  if (!iw(t)) throw Error("Invalid mainnet wallet address.");
  const e = await vs(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await vs(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function Z5(t) {
  const e = await vs(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function Q5(t, e) {
  var i, s;
  const n = await sw("get-owner", [To(t), To(e)]), r = (n == null ? void 0 : n.success) === !0 ? (s = (i = n.value) == null ? void 0 : i.value) == null ? void 0 : s.value : null;
  if (typeof r != "string" || !iw(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function J5(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: Tu(t), signal: AbortSignal.timeout(15e3) });
  } catch {
    throw Error("Submission outcome unknown. Reconcile the saved transaction before doing anything else.");
  }
  const r = await n.json();
  if (n.status === 400 && (r == null ? void 0 : r.reason) === "FeeTooLow") {
    const i = new Error("Node rejected the fee as too low. No automatic increase. Preview a new test with another fee.");
    throw Object.assign(i, { feeRejected: !0 }), i;
  }
  if (!n.ok || typeof r != "string" || r.replace(/^0x/, "") !== e.replace(/^0x/, "")) throw Error(`Submission unconfirmed (${n.status}). Reconcile or resend the same saved transaction; do not create a replacement.`);
  return r;
}
async function t6(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function e6(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = fc(Tu(t.raw)), n = e.auth, r = e.payload, i = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || i.hashMode !== 0 || _i(vo(cc.MainnetSingleSig, i.signer)) !== t.address || i.fee !== BigInt(t.fee) || i.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const s = e.postConditions.values[0];
    if (r.payloadType !== 2 || _i(r.contractAddress) + "." + r.contractName.content !== nw || r.functionName.content !== "play" || r.functionArgs.length !== 3 || jn(_e(r.functionArgs[0])) !== jn(_e(To(t.core))) || jn(_e(r.functionArgs[1])) !== jn(_e(To(t.song))) || jn(_e(r.functionArgs[2])) !== jn(_e(p5(Tu(t.id)))) || t.amount !== "50" || e.postConditionMode !== to.Deny || e.postConditions.values.length !== 1 || s.conditionType !== 0 || s.amount !== 50n || s.conditionCode !== Oo.Equal || s.principal.prefix !== 2 || _i(s.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || _i(r.contractAddress) + "." + r.contractName.content !== q5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || jn(_e(r.functionArgs[0])) !== jn(_e(To(t.song))) || typeof t.liked != "boolean" || jn(_e(r.functionArgs[1])) !== jn(_e(h5(t.liked))) || t.amount !== "0" || e.postConditionMode !== to.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || wr(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const n6 = "xtrata.xyz/radio/listening-wallet", r6 = "Link a temporary listening wallet for pay-per-play; no spending permission", Dr = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && Di(t), s6 = (t) => ({
  domain: si({ name: Ze(n6), version: Ze("1"), "chain-id": Sr(1) }),
  message: si({
    purpose: Ze(r6),
    main: Ze(t.main),
    listening: Ze(t.listening),
    issued: Sr(t.issued)
  })
}), ow = 100000n, i6 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function o6(t, e) {
  const n = t.filter((i) => !i || typeof i.sender != "string" || i.sender === e || !Dr(i.sender) || !/^\d+$/.test(i.amount) ? !1 : BigInt(i.amount) >= ow).sort(i6);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((i) => i.sender)).size };
}
const La = 50;
function pc(t) {
  const e = t;
  if (!e || typeof e.total != "number" || !Number.isSafeInteger(e.total) || e.total < 0 || !Array.isArray(e.results)) return null;
  const n = [];
  for (const r of e.results) {
    if (typeof (r == null ? void 0 : r.sender) != "string" || typeof r.amount != "string" || typeof r.tx_id != "string") return null;
    const i = Number(r.block_height), s = Number(r.tx_index ?? 0);
    if (!Number.isSafeInteger(i) || !Number.isSafeInteger(s)) return null;
    n.push({ sender: r.sender, amount: r.amount, txId: r.tx_id, blockHeight: i, txIndex: s });
  }
  return { total: e.total, transfers: n };
}
async function a6(t, e, n = 4) {
  if (!Dr(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${La}&offset=${o}`, i = pc(await e(r(0)));
    if (!i || i.total > 0 && !i.transfers.length) return { ok: !1 };
    if (i.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let s = Math.max(0, i.total - La);
    for (let o = 0; o < n; o++) {
      const a = s === 0 && i.total <= La ? i : pc(await e(r(s)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = o6(a.transfers, t);
      if (c.ok && c.funder) return s > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (s === 0) return c;
      s = Math.max(0, s - La);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const Nr = 50, c6 = 6, l6 = 20, f0 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function d0(t, e) {
  const n = t;
  if (!n || typeof n.total != "number" || !Number.isSafeInteger(n.total) || n.total < 0 || !Array.isArray(n.results)) return null;
  const r = [], i = [];
  for (const s of n.results) {
    const o = s && typeof s == "object" && s.tx && typeof s.tx == "object" ? s.tx : s;
    if (!o || typeof o.tx_id != "string" || typeof o.tx_type != "string") return null;
    if (i.push(o.tx_id), o.tx_type !== "token_transfer" || o.sender_address !== e || o.tx_status !== "success") continue;
    const a = o.token_transfer;
    if (!a || typeof a.recipient_address != "string" || typeof a.amount != "string" || !/^\d+$/.test(a.amount)) return null;
    const c = Number(o.block_height), u = Number(o.tx_index ?? 0);
    if (!Number.isSafeInteger(c) || !Number.isSafeInteger(u)) return null;
    r.push({ recipient: a.recipient_address, amount: BigInt(a.amount), txId: o.tx_id, blockHeight: c, txIndex: u });
  }
  return { total: n.total, sent: r, rows: i };
}
async function u6(t, e, n) {
  if (!Dr(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), i = pc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Nr}&offset=0`));
    if (!i || i.total > c6 * Nr) return { ok: !1 };
    for (const o of i.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = Nr; o < i.total; o += Nr) {
      const a = pc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Nr}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== i.total) return { ok: !1 };
    const s = /* @__PURE__ */ new Map();
    if (n) {
      const o = (u) => `/extended/v1/address/${t}/transactions?limit=${Nr}&offset=${u}`, a = d0(await e(o(0)), t);
      if (!a || a.total > l6 * Nr) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) s.set(u.txId, u);
      for (let u = Nr; u < a.total; u += Nr) {
        const f = d0(await e(o(u)), t);
        if (!f || !f.rows.length) return { ok: !1 };
        for (const l of f.rows) c.add(l);
        for (const l of f.sent) s.set(l.txId, l);
      }
      if (c.size !== a.total) return { ok: !1 };
    }
    return { ok: !0, inbound: [...r.values()], outgoing: [...s.values()] };
  } catch {
    return { ok: !1 };
  }
}
function f6(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const i = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(f0).map((l, w) => {
    const p = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: p, kind: "gift", to: r.payer, at: w } : Dr(l.sender) && p >= ow ? { sender: l.sender, left: p, kind: "deposit", to: l.sender, at: w } : { sender: l.sender, left: p, kind: "dust", to: null, at: w };
  }), s = i.reduce((l, w) => l + w.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && Dr(l.recipient) && l.amount > 0n).sort(f0), a = o.reduce((l, w) => l + w.amount, 0n), c = s - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const u = (l, w) => {
    let p = w;
    for (const x of l) {
      if (p <= 0n) break;
      const S = x.left < p ? x.left : p;
      x.left -= S, p -= S;
    }
    return p;
  };
  for (const l of o) {
    const w = u(i.filter((p) => p.to === l.recipient), l.amount);
    w > 0n && u(i, w);
  }
  if (u(i, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (i.reduce((l, w) => l + w.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const f = /* @__PURE__ */ new Map();
  for (const l of i) {
    if (l.left <= 0n) continue;
    const w = `${l.kind}:${l.to ?? ""}`, p = f.get(w);
    p ? (p.amount += l.left, p.newest = Math.max(p.newest, l.at)) : f.set(w, { to: l.to, kind: l.kind, amount: l.left, newest: l.at });
  }
  return {
    ok: !0,
    parts: [...f.values()].sort((l, w) => l.newest - w.newest),
    hasTopUp: i.some((l) => l.kind === "deposit")
  };
}
function d6(t, e) {
  const n = t.filter((u) => u.kind === "deposit").sort((u, f) => u.newest - f.newest), r = t.find((u) => u.kind === "gift"), i = t.filter((u) => u.kind === "dust"), s = ((r == null ? void 0 : r.amount) ?? 0n) + i.reduce((u, f) => u + f.amount, 0n), o = [], a = [], c = s > e;
  return n.forEach((u, f) => {
    if (u.amount <= e) {
      a.push(u);
      return;
    }
    const l = f === n.length - 1 && !c;
    o.push({ to: u.to, kind: "deposit", mode: l ? "all" : "amount", send: u.amount - e });
  }), c ? o.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: s - e }) : (r && a.push(r), a.push(...i)), { steps: o, tooSmall: a };
}
function h0(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const ja = [100, 250, 500], h6 = (t, e) => BigInt(t) * Mn(e), xo = ["prepared", "signed", "unknown", "pending"], p6 = 30 * 6e4, gc = 6e4, Ii = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, g6 = 3e3, yc = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", El = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function y6(t) {
  let e = null, n = -1 / 0, r, i = null, s = null, o, a = -1 / 0, c = null, u = null, f = !1, l = !1, w = !1, p = null, x = !1, S = "", M = "", j = 0, z, A = null, _, N = [], Q, tt = -1 / 0;
  const R = /* @__PURE__ */ new Set();
  let K = null, L = !1, P = 0, b = null, T = null, H = !1, C = null, ot = !1, X = null, Et = !1, k = !1, m = !1, q = !1, nt = !1, at = 0, vt = null, te = Promise.resolve();
  const $t = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? yi.toString()), Dt = (y) => !!s && !(s.features ?? []).includes(y), Nt = (y, I) => `xtrata.ppp.v1.${y}:${I}`, ee = "xtrata.ppp.v1.as-main", ct = () => {
    if (t.main()) return;
    const y = t.store.get(ee);
    return y && Dr(y) ? y : void 0;
  }, jt = () => t.main() ?? ct(), Je = (y = s == null ? void 0 : s.address) => {
    if (!y) return [];
    try {
      const I = JSON.parse(t.store.get(Nt("entries", y)) || "[]");
      return Array.isArray(I) ? I : [];
    } catch {
      return [];
    }
  }, ne = (y) => {
    const I = [y, ...Je(y.address).filter((V) => !(V.txid === y.txid && V.kind === y.kind))].slice(0, 200);
    t.store.set(Nt("entries", y.address), JSON.stringify(I));
  }, tn = (y = s == null ? void 0 : s.address) => !!y && t.store.get(Nt("on", y)) !== "0", De = (y) => {
    s != null && s.address && t.store.set(Nt("on", s.address), y ? "1" : "0");
  }, xe = () => Je().filter((y) => xo.includes(y.status)), qe = () => v() ? [...xe(), ...Je(Ee()).filter((y) => xo.includes(y.status))] : xe(), Me = () => ze(s == null ? void 0 : s.address), ze = (y) => {
    if (!y) return null;
    try {
      return JSON.parse(t.store.get(Nt("deposit", y)) || "null");
    } catch {
      return null;
    }
  }, Se = (y, I = s == null ? void 0 : s.address) => {
    I && t.store.set(Nt("deposit", I), JSON.stringify(y));
  };
  let zt = null;
  const Re = (y = gc) => {
    const I = t.now();
    zt = { since: zt && I < zt.until ? zt.since : I, until: Math.max((zt == null ? void 0 : zt.until) ?? 0, I + y) };
  }, gn = () => !!zt && t.now() < zt.until && (o === void 0 || o < je + Mn($t())), Ne = () => !!Me() || gn(), Ee = () => Dt("rootLike") ? s == null ? void 0 : s.address : (s == null ? void 0 : s.root) ?? (s == null ? void 0 : s.address), v = () => !!(s != null && s.address) && Ee() !== s.address, O = () => v() ? c && c.for === Ee() ? c.value : void 0 : o, D = (y) => y !== void 0 && y < je + ml, G = () => xe().filter((y) => t.now() - y.created > p6 && R.has(y.txid)), ht = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!jt() || r === jt() && !e.allowed), it = () => ht() && !(s != null && s.linked), Yt = () => {
    const y = jt();
    return !it() && !!y && !!(s != null && s.linked) && s.linked !== y;
  }, Zt = (y) => Nt("return-to", y), re = (y = s == null ? void 0 : s.address) => {
    if (!y) return;
    const I = t.store.get(Zt(y));
    return I && Dr(I) && I !== y ? I : void 0;
  }, ye = (y = s == null ? void 0 : s.address) => K && K.for === y ? K.res : null;
  function ue() {
    if (!(s != null && s.address)) return;
    if (s.linked) return { to: s.linked, kind: "linked" };
    const y = re();
    if (y) return { to: y, kind: "chosen" };
    const I = ye();
    if (I != null && I.ok && I.funder) return { to: I.funder, kind: "funder" };
  }
  const Ae = (y) => Nt("gift", y);
  function It() {
    const y = s == null ? void 0 : s.address;
    if (!y) return null;
    if ((C == null ? void 0 : C.for) === y) return C.info;
    try {
      const I = JSON.parse(t.store.get(Ae(y)) || "null");
      return I && typeof I.returnTo == "string" && typeof I.treasury == "string" ? I : null;
    } catch {
      return null;
    }
  }
  async function At() {
    var bt;
    const y = s == null ? void 0 : s.address;
    if (!y || !t.giftInfo || !((bt = e == null ? void 0 : e.gifts) != null && bt.enabled) || ot) return;
    const I = (C == null ? void 0 : C.for) === y ? C : null, V = I ? I.ok ? I.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (I && t.now() - I.at < V) return;
    ot = !0;
    const J = It();
    try {
      const F = await t.giftInfo(y);
      C = { for: y, info: F, ok: !0, at: t.now() }, t.store.set(Ae(y), JSON.stringify(F));
    } catch {
      C = { for: y, info: J, ok: !1, at: t.now() };
    } finally {
      ot = !1;
    }
  }
  const qt = () => Je().reduce((y, I) => xo.includes(I.status) ? y + BigInt(I.amount || "0") + BigInt(I.fee || "0") : y, 0n);
  function Qt() {
    if (o === void 0) return 0;
    const y = o - qt() - BigInt(de.length) * Mn($t());
    return y > 0n ? u0(y, $t()) : 0;
  }
  const fe = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", oe = "EMPTY — ADD STX TO PLAY";
  function Hn() {
    var V;
    const y = (s == null ? void 0 : s.state) === "known" || (s == null ? void 0 : s.state) === "unlocked";
    if (!((V = It()) != null && V.player) && !y) return null;
    const I = (J, bt) => ({ reason: J, text: bt });
    switch ($n()) {
      case "connect":
      case "wrong-wallet":
        return I("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "locked":
        return I("locked", "UNLOCK TO LISTEN");
      case "link":
        return I("link", "FINISH SETUP TO LISTEN");
      case "over":
        return I("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return Ne() ? I("arriving", "YOUR PLAYS ARE ARRIVING") : I("out", v() ? fe : oe);
      case "ready":
        return !tn() || !(s != null && s.session) || s.session.playsLeft < 1 ? I("off", "PAYING IS OFF — SWITCH ON TO LISTEN") : m ? Qt() < 1 ? I("out", v() ? fe : oe) : null : I("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const kn = () => {
    var y;
    return !!(s != null && s.address) && v() && !!((y = It()) != null && y.player);
  };
  function Gr() {
    return kn() ? { locked: !0, known: !0 } : null;
  }
  const Ls = 3 * 6e4, Kr = () => !!It() && !!t.history && !(s != null && s.linked);
  async function wi() {
    const y = s.address, I = It(), { balance: V, nonce: J } = await t.chain.account(y), bt = await t.history(y, !0);
    if (!bt.ok) return null;
    const F = f6({ self: y, balance: V, inbound: bt.inbound, outgoing: bt.outgoing, gift: { sender: I.treasury, payer: I.returnTo } });
    if (!F.ok) return null;
    const gt = d6(F.parts, mo);
    return { balance: V, nonce: J, parts: F.parts, steps: gt.steps, tooSmall: gt.tooSmall.length };
  }
  const ve = () => Et ? { state: "unavailable" } : !X || t.now() - X.at > Ls || o !== void 0 && o !== X.balance ? { state: "none" } : X.plan;
  function $n() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const y = jt();
    if (!it()) {
      if (!y) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return s ? s.state === "unsupported" ? "unsupported" : s.state === "none" ? "intro" : Yt() ? "wrong-wallet" : s.state === "known" ? "locked" : !it() && s.linked !== y ? "link" : o === void 0 ? "loading" : o > Ds ? "over" : o < je + Mn($t()) ? "fund" : "ready" : "loading";
  }
  const bi = () => {
    var y, I, V, J, bt;
    return {
      step: $n(),
      busy: u,
      message: S,
      error: M,
      notice: mi(),
      gate: e,
      main: jt(),
      mainConnected: !!t.main(),
      standIn: ct(),
      listening: s == null ? void 0 : s.address,
      linked: s == null ? void 0 : s.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : z5(o, $t()),
      playsLeft: o === void 0 ? 0 : u0(o, $t()),
      allowance: o === void 0 ? Ds : xl(o, BigInt(((y = Me()) == null ? void 0 : y.amount) ?? "0")),
      session: (s == null ? void 0 : s.session) ?? null,
      payingOn: tn(),
      entries: Je(),
      depositTxid: ((I = Me()) == null ? void 0 : I.txid) ?? z,
      depositPending: Ne(),
      arrival: Ne() ? { since: ((V = Me()) == null ? void 0 : V.at) ?? (zt == null ? void 0 : zt.since) ?? t.now(), graceMs: gc } : null,
      walletOutdated: Dt("like"),
      linkedListening: Q && Q === jt() ? N.map((F) => F.listening) : [],
      serverLinked: !!A && _ === `${jt()}:${s == null ? void 0 : s.address}`,
      stuck: G().length,
      armed: q,
      queued: de.length,
      solo: it(),
      returnTo: (J = ue()) == null ? void 0 : J.to,
      returnToKind: (bt = ue()) == null ? void 0 : bt.kind,
      funderState: (() => {
        const F = ye();
        return F ? F.ok ? F.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const F = ye();
        return !!F && F.ok && F.distinct > 1;
      })(),
      walletCannotSolo: it() && Dt("standalone"),
      walletCannotMulti: Dt("multi"),
      others: ((s == null ? void 0 : s.others) ?? []).filter((F) => F !== jt() && F !== (s == null ? void 0 : s.linked)),
      creditedTo: it() && (s != null && s.address) && (b == null ? void 0 : b.for) === s.address && b.main ? b.main : void 0,
      createdHere: !!(s != null && s.address) && t.store.get(Nt("created", s.address)) === "1",
      brandNew: !!(s != null && s.address) && o === 0n && (T == null ? void 0 : T.for) === s.address && T.unused,
      gift: (() => {
        const F = It();
        return F ? { player: F.player, from: F.from, source: F.source, amount: F.amount } : null;
      })(),
      giftPlays: It() ? Qt() : 0,
      playCost: Mn($t()),
      giftStop: Hn(),
      albumLock: Gr(),
      returnPlan: ve(),
      slot: (s == null ? void 0 : s.state) === "unlocked" ? s.slot ?? 0 : 0,
      root: (s == null ? void 0 : s.state) === "unlocked" ? s.root ?? s.address : void 0,
      walletCannotAlbums: Dt("slots"),
      likeFunds: (() => {
        var mt;
        const F = Ee();
        if (!F || (s == null ? void 0 : s.state) !== "unlocked") return null;
        const gt = O();
        return { address: F, balance: gt, low: D(gt), album: v(), pending: !!ze(F), txid: (mt = ze(F)) == null ? void 0 : mt.txid, main: jt() };
      })()
    };
  }, mi = () => j ? j < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", Vt = (y, I = "") => {
    S = y, M = I, t.changed();
  };
  async function We(y, I) {
    if (!u) {
      u = y, M = "", t.changed();
      try {
        await I();
      } catch (V) {
        const J = V instanceof Error ? V.message : String(V);
        M = /Cancelled in the listening wallet/.test(J) ? "" : J, M || (S = "Not now. Nothing was signed.", nt = !0);
      } finally {
        u = null, await Pe(!0);
      }
    }
  }
  const d = () => !!(e != null && e.enabled) && e.here && (it() || !!jt() && e.allowed), E = () => d() && !Yt(), $ = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", h = () => {
    if (Yt()) throw new Error($());
  };
  async function rt() {
    if (!d()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return i ?? (i = await t.bridge(e.walletOrigin)), i;
  }
  const dt = (y) => {
    const I = jt();
    return y.request("listening.status", I ? { main: I } : void 0);
  };
  async function yt(y = !1) {
    s != null && s.address && (!y && t.now() - a < 3e4 || (o = await t.chain.balance(s.address), a = t.now(), await ae(y)));
  }
  async function ae(y = !1) {
    const I = Ee();
    if (!(!v() || !I || (s == null ? void 0 : s.state) !== "unlocked") && !(!y && (c == null ? void 0 : c.for) === I && t.now() - c.at < 3e4))
      try {
        c = { for: I, value: await t.chain.balance(I), at: t.now() };
      } catch {
      }
  }
  async function ke(y) {
    if ((Q !== y || t.now() - tt >= 6e4) && (N = await t.links(y), Q = y, tt = t.now()), (s == null ? void 0 : s.state) !== "unlocked" || s.linked === y) return;
    const I = `${y}:${s.address}`;
    _ === I && A || (A = N.find((V) => V.listening === s.address) ?? null, _ = I);
  }
  async function yn() {
    const y = s == null ? void 0 : s.address;
    if (!it() || !y || s != null && s.linked || !t.funder || L || !o || o <= 0n) return;
    const I = ye(y);
    if (I != null && I.ok && I.funder) return;
    const V = I != null && I.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, P - 1), 30 * 6e4);
    if (!(K && K.for === y && t.now() - K.at < V)) {
      L = !0;
      try {
        K = { for: y, res: await t.funder(y), at: t.now() };
      } catch {
        K = { for: y, res: { ok: !1 }, at: t.now() };
      } finally {
        L = !1;
      }
      P = K.res.ok ? 0 : P + 1;
    }
  }
  async function wn() {
    const y = s == null ? void 0 : s.address;
    if (!(!it() || !y || s != null && s.linked || !t.mainOf || H) && !(b && b.for === y && (b.ok || t.now() - b.at < 6e4))) {
      H = !0;
      try {
        b = { for: y, main: await t.mainOf(y), ok: !0, at: t.now() };
      } catch {
        b = { for: y, main: null, ok: !1, at: t.now() };
      } finally {
        H = !1;
      }
    }
  }
  async function Rt() {
    const y = s == null ? void 0 : s.address;
    if (!(!y || (s == null ? void 0 : s.state) !== "unlocked" || o !== 0n || (T == null ? void 0 : T.for) === y) && t.store.get(Nt("created", y)) !== "1")
      try {
        T = { for: y, unused: await t.chain.confirmedNonce(y) === 0n };
      } catch {
      }
  }
  async function we() {
    var bt;
    const y = s == null ? void 0 : s.address;
    if (!y) return !1;
    let I, V = !1;
    const J = /* @__PURE__ */ new Map();
    for (const F of qe())
      try {
        const gt = await t.chain.transaction(F.txid);
        if (!gt) {
          if (R.add(F.txid), t.now() - F.created > 15 * 6e4 && !J.has(F.address) && J.set(F.address, await t.chain.confirmedNonce(F.address)), I = J.get(F.address), I !== void 0 && I > BigInt(F.nonce)) {
            ne({ ...F, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((F.status === "unknown" || F.status === "signed") && F.raw)
            try {
              await t.chain.broadcast(F.raw, F.txid), ne({ ...F, status: "pending" });
            } catch (xt) {
              Ii(xt) && ne({ ...F, status: "failed", note: xt.message, raw: void 0 });
            }
          continue;
        }
        R.delete(F.txid);
        const mt = String(gt.tx_status);
        if (mt === "success" && gt.canonical !== !1 && gt.is_unanchored === !1) {
          if (ne({ ...F, status: "confirmed", confirmedAt: t.now(), actualFee: String(gt.fee_rate ?? F.fee), raw: void 0 }), V = !0, F.kind === "like" && (x = !0, F.status !== "confirmed" && typeof F.liked == "boolean"))
            try {
              (bt = t.likeConfirmed) == null || bt.call(t, F.song, F.liked);
            } catch {
            }
        } else mt.startsWith("abort_") || mt.startsWith("dropped_") ? ne({ ...F, status: "failed", note: mt, raw: void 0 }) : F.status !== "pending" && ne({ ...F, status: "pending" });
      } catch {
      }
    for (const F of v() ? [y, Ee()] : [y]) {
      const gt = ze(F);
      if (gt)
        try {
          const mt = await t.chain.transaction(gt.txid), xt = String((mt == null ? void 0 : mt.tx_status) ?? "");
          (xt === "success" && mt.is_unanchored === !1 || xt.startsWith("abort_") || xt.startsWith("dropped_") || !mt && t.now() - gt.at > 2 * 36e5) && (Se(null, F), xt === "success" && Re(2e4), a = -1 / 0, c = null, /on its way/i.test(S) && (S = ""));
        } catch {
        }
    }
    return V;
  }
  async function Pe(y = !1) {
    var I;
    try {
      const V = jt();
      if ((y || !e || r !== V || t.now() - n > 3e5) && (e = await t.config(V), n = t.now(), r = V), !e.enabled || !e.here || !it() && (!V || !e.allowed)) {
        i && (s != null && s.session) && await i.request("listening.stop").catch(() => {
        }), q && Ir(), t.changed();
        return;
      }
      await rt(), s = await dt(i), Yt() && s.state === "unlocked" && (qn(), await i.request("listening.lock").catch(() => {
      }), o = void 0, s = await dt(i)), V && e.allowed && await ke(V), await yt(y), await yn(), await wn(), await Rt(), await At(), await we() && await yt(!0), await ae(), await ho(), j = 0;
    } catch {
      j++;
    }
    if ($n() === "locked" ? en() : q && Ir(), x) {
      x = !1;
      try {
        (I = t.likesChanged) == null || I.call(t);
      } catch {
      }
    }
    t.changed(), de.length && !ir && ar();
  }
  async function rr(y) {
    const I = s == null ? void 0 : s.root;
    if (!I || s != null && s.slot || !(s != null && s.address) || Dt("slots")) return;
    const V = Number(t.store.get(Nt("slot", I)));
    if (!(!Number.isSafeInteger(V) || V < 1))
      try {
        const { balance: J } = await t.chain.account(s.address);
        if (J >= je + Mn($t())) return;
        await y.request("listening.openSlot", { slot: V }), s = await dt(y), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function In(y, I) {
    var F;
    h();
    const V = !(s != null && s.address) || tn(s.address), J = s != null && s.linked ? (F = t.nameOf) == null ? void 0 : F.call(t, s.linked) : void 0;
    await y.request("listening.unlock", { mode: "unlock", terms: V ? Lr() : void 0, anyPasskey: I, ...jt() ? { main: jt() } : {}, ...J ? { label: J } : {} }), s = await dt(y), V && (tn(s.address) ? await Ge() : await y.request("listening.stop")), await rr(y), Vt(V ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const bt = p;
    p = null, bt && t.now() - bt.at < 12e4 && setTimeout(() => void Pe(!0).then(() => Wn(bt)), 0);
  }
  function en() {
    q || u || nt || at >= 3 || !i || !(s != null && s.address) || (q = !0, te = (async () => {
      try {
        await In(i, !1), at = 0;
      } catch (y) {
        const I = y instanceof Error ? y.message : String(y);
        /Cancelled in the listening wallet/.test(I) ? vt || (nt = !0, Vt("Not now. Nothing was signed.")) : /did not answer/.test(I) ? await (i == null ? void 0 : i.request("listening.cancel").catch(() => {
        })) : (at++, M = I);
      } finally {
        q = !1;
        const y = vt;
        vt = null, y ? await y() : await Pe(!0);
      }
    })());
  }
  async function Ir(y) {
    q && (vt = async () => {
    }, await (i == null ? void 0 : i.request("listening.cancel").catch(() => {
    })), await te), y && await y(), t.changed();
  }
  const Lr = () => ({
    fee: $t().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: Ds.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function Ge() {
    if (!(s != null && s.address)) return !1;
    if (m || (m = await t.tabLock(s.address)), !m)
      throw await (i == null ? void 0 : i.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  async function Vn(y, I) {
    const V = s.address, { balance: J, nonce: bt } = I ?? await t.chain.account(V);
    o = J;
    const F = await i.request("listening.prepareReturn", {
      mode: y.mode,
      balance: J.toString(),
      nonce: bt.toString(),
      fee: mo.toString(),
      ...y.amount !== void 0 ? { amount: y.amount.toString() } : {},
      ...y.linked ? {} : { destination: y.to }
    });
    if (F.recipient !== y.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const gt = y.mode === "amount" ? y.amount : y.mode === "all" ? J - mo : J - Ds - mo, mt = fc(F.raw);
    if (wr(mt.payload.recipient).value !== y.to || String(mt.payload.amount) !== F.amount || gt !== void 0 && F.amount !== gt.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const xt = {
      id: El(),
      address: V,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: F.recipient,
      amount: F.amount,
      fee: F.fee,
      nonce: bt.toString(),
      created: t.now(),
      status: "signed",
      raw: F.raw,
      txid: F.txid
    };
    t.validate(xt), ne(xt);
    try {
      await t.chain.broadcast(F.raw, F.txid), ne({ ...xt, status: "pending" });
    } catch (Pt) {
      throw ne({ ...xt, status: "unknown", note: Pt.message }), Pt;
    }
    return F;
  }
  const sr = qc, wt = mo;
  async function Gt(y, I, V) {
    if ((s == null ? void 0 : s.state) !== "unlocked" || !s.address) throw new Error("Unlock the listening wallet first.");
    if (Dt("slots") || Dt("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const J = s.slot ?? 0;
    if (y === I || ![y, I].includes(J) || ![y, I].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const bt = s.root ?? s.address, F = y === 0 ? bt : s.address, gt = I === 0 ? bt : s.address, { balance: mt, nonce: xt } = await t.chain.account(F);
    if (mt < V + wt + je) throw new Error(y === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const Pt = await i.request("listening.signMove", { from: y, to: I, amount: V.toString(), fee: wt.toString(), nonce: xt.toString(), balance: mt.toString() }), Oe = fc(Pt.raw);
    if (Pt.from !== F || Pt.to !== gt || Pt.amount !== V.toString() || wr(Oe.payload.recipient).value !== gt || String(Oe.payload.amount) !== V.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const nn = {
      id: El(),
      address: F,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: gt,
      amount: Pt.amount,
      fee: Pt.fee,
      nonce: xt.toString(),
      created: t.now(),
      status: "signed",
      raw: Pt.raw,
      txid: Pt.txid
    };
    t.validate(nn), ne(nn);
    try {
      await t.chain.broadcast(Pt.raw, Pt.txid), ne({ ...nn, status: "pending" });
    } catch (Ke) {
      throw ne({ ...nn, status: "unknown", note: Ke.message }), Ke;
    }
    return Se({ txid: Pt.txid, amount: Pt.amount, at: t.now() }, gt), gt === bt && bt !== s.address ? c = null : a = -1 / 0, Pt;
  }
  let le = !1;
  const bn = /* @__PURE__ */ new Map(), Vr = (y) => Nt("float", y);
  async function ho() {
    if (le || (s == null ? void 0 : s.state) !== "unlocked" || !v() || Dt("move") || Dt("rootLike") || !s.address) return;
    const y = s.address;
    if (t.store.get(Vr(y)) === "1") return;
    const I = It();
    if (!(I != null && I.player) || I.state !== "arrived") return;
    const V = O();
    if (V === void 0 || o === void 0) return;
    if (!D(V)) {
      t.store.set(Vr(y), "1");
      return;
    }
    if (ze(Ee()) || or() || qe().length || o < sr * 4n + je + wt) return;
    const J = bn.get(y);
    if (!(J && (J.n >= 3 || t.now() - J.at < 5 * 6e4))) {
      le = !0, bn.set(y, { n: ((J == null ? void 0 : J.n) ?? 0) + 1, at: t.now() });
      try {
        await Gt(s.slot ?? 0, 0, sr), t.store.set(Vr(y), "1");
      } catch (bt) {
        console.warn("[radio] likes float not sent yet", bt);
      } finally {
        le = !1;
      }
    }
  }
  async function xi(y) {
    if (xe().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Dt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const I = await wi().catch(() => null);
    if (!I)
      throw X = null, Et = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    Et = !1, o = I.balance;
    const V = { balance: I.balance, nonce: I.nonce };
    if (y === "excess") {
      const mt = h0(I.parts) ?? re();
      if (!mt) throw new Error("Choose where to send the excess first.");
      await Vn({ mode: "excess", to: mt, linked: !1 }, V), X = null, Vt("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const J = I.steps;
    if (!J.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!X && X.balance === I.balance && t.now() - X.at <= Ls && X.steps.length === J.length && X.steps.every((mt, xt) => mt.to === J[xt].to && mt.mode === J[xt].mode && mt.send === J[xt].send))) {
      X = {
        at: t.now(),
        balance: I.balance,
        steps: J,
        parts: I.parts,
        plan: { state: "ready", steps: J.map((mt) => ({ to: mt.to, kind: mt.kind, send: mt.send.toString() })), kept: I.tooSmall, excess: h0(I.parts) }
      }, Vt(J.length > 1 ? `This goes back in ${J.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const F = J[0], gt = F.to ?? re();
    if (!gt) throw new Error("Choose where to send the rest first.");
    if (F.mode === "amount" && Dt("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await Vn({ mode: F.mode, to: gt, linked: !1, ...F.mode === "amount" ? { amount: F.send } : {} }, V), X = null, J.length === 1 ? (De(!1), Vt("Returned ✓ Paying is off.")) : Vt(`Returned ✓ ${J.length - 1} more ${J.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  const On = {
    forceRefresh: () => Pe(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (y) => {
      if (!t.main() && !(y !== null && !Dr(y))) {
        if (y === ct()) return Pe(!0);
        t.store.set(ee, y ?? ""), M = "", S = "", o = void 0, a = -1 / 0, c = null, await Pe(!0);
      }
    },
    create: () => We("Waiting for your passkey…", async () => {
      const y = await rt();
      await y.request("listening.unlock", { mode: "create", terms: Lr(), ...t.main() ? { main: t.main() } : {} }), s = await dt(y), s.address && t.store.set(Nt("created", s.address), "1"), De(!0), Vt(it() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await Ge();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (y) => {
      y ? Re() : zt = null, t.changed();
    },
    giftSent: (y, I) => {
      !(s != null && s.address) || Me() || (Se({ txid: y, amount: I.toString(), at: t.now() }), a = -1 / 0, C = null, Vt("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (y) => {
      if (h(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Dt("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await rt()).request("listening.bindSlot", { slot: y, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (y, I, V, J) => {
      Se({ txid: V, amount: J.toString(), at: t.now() }, I), C = null, await On.openAlbum(y), Vt("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (y) => We("Opening…", async () => {
      if (h(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Dt("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (f || l || w) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((s.slot ?? 0) === y) return;
      qn(), await i.request("listening.openSlot", { slot: y }), s = await dt(i), o = void 0, a = -1 / 0, X = null, Et = !1;
      const I = s.root;
      I && y > 0 && t.store.set(Nt("slot", I), String(y)), Vt(y === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (y = !1) => {
      const I = () => We("Waiting for your passkey…", async () => In(await rt(), y));
      return q ? y ? Dt("cancel") ? (Vt("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Ir(async () => {
        ($n() === "locked" || $n() === "intro") && await I();
      }) : te : I();
    },
    link: () => We("Sign in your wallet…", async () => {
      h();
      const y = t.main();
      if (!y || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      const I = (await t.links(y)).find((V) => V.listening === s.address);
      if (I)
        await i.request("listening.link", { main: y, issued: I.issued, mainSignature: I.mainSignature });
      else {
        const V = { main: y, listening: s.address, issued: t.now() }, J = await t.signWithMain(y, s6(V)), bt = await i.request("listening.link", { main: y, issued: V.issued, mainSignature: J });
        await t.saveLink({ ...V, mainSignature: J, listeningSignature: bt.listeningSignature }), tt = -1 / 0;
      }
      Vt("Linked ✓");
    }),
    deposit: () => We("Approve the deposit in your wallet…", async () => {
      h();
      const y = t.main();
      if (!y || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      if (Me()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (gn()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await yt(!0);
      const I = xl(o ?? 0n);
      if (I <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      z = await t.deposit(y, s.address, I), z && Se({ txid: z, amount: I.toString(), at: t.now() }), Vt("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => We("Approve the top-up in your wallet…", async () => {
      h();
      const y = t.main(), I = Ee();
      if (!y || !I) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (ze(I)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const V = await t.chain.balance(I);
      v() ? c = { for: I, value: V, at: t.now() } : (o = V, a = t.now());
      const J = xl(V);
      if (J <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const bt = await t.deposit(y, I, J);
      bt && Se({ txid: bt, amount: J.toString(), at: t.now() }, I), Vt("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (y) => We("Adding plays…", async () => {
      if (h(), !v()) throw new Error("Open the album you want to add plays to first.");
      if (!ja.includes(y)) throw new Error("Choose one of the amounts offered.");
      const I = h6(y, $t());
      if (f || l || w) throw new Error("Still sending a payment. Try again in a moment.");
      if (qe().length || Me()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await Gt(0, s.slot ?? 0, I), Vt("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => We("Confirm in the listening wallet…", async () => {
      if (!E()) throw new Error("Connect your wallet first.");
      await Ge(), await i.request("listening.approveSession", Lr()), De(!0), Vt("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => We("Clearing…", async () => {
      for (const y of G())
        await t.chain.transaction(y.txid) || ne({ ...y, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      Vt("Cleared ✓");
    }),
    switchOff: () => We("Switching off…", async () => {
      qn(), await (i == null ? void 0 : i.request("listening.stop")), De(!1), Vt("Paying is off. Music stays free.");
    }),
    lock: () => We("Locking…", async () => {
      qn(), await (i == null ? void 0 : i.request("listening.lock")), o = void 0, Vt("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (y) => {
      const I = String(y ?? "").trim();
      if (!(s != null && s.address)) return Vt("", "Unlock the listening wallet first.");
      if (!Dr(I)) return Vt("", "Enter a standard mainnet address (it starts with SP).");
      if (I === s.address) return Vt("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(Zt(s.address), I), Vt("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      s != null && s.address && t.store.set(Zt(s.address), ""), t.changed();
    },
    returnFunds: (y) => We("Check the return in the listening wallet…", async () => {
      if (!E()) throw new Error("Connect your wallet first.");
      if (!(s != null && s.address)) throw new Error("Unlock the listening wallet first.");
      if (Kr()) return xi(y);
      const I = ue();
      if (!I) throw new Error(it() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (I.kind !== "linked" && Dt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (xe().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await Vn({ mode: y, to: I.to, linked: I.kind === "linked" }), y === "all" && De(!1), Vt(y === "all" ? I.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, de = [], Si = 10, Ei = 30 * 6e4;
  let ir = !1;
  const or = () => f || !!u || l || w, qn = () => {
    de.length && (de.length = 0, t.changed());
  };
  async function Cr(y) {
    if (!de.some((I) => I.id === y.id) && !Je().some((I) => I.id === y.id) && (de.push({ ...y, at: t.now() }), de.length > Si && de.shift()), or() || xe().length) {
      const I = de.length;
      S = `Queued ${I === 1 ? "this song" : I + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await ar();
  }
  async function ar() {
    if (!ir) {
      ir = !0;
      try {
        for (; de.length; ) {
          for (; de.length && t.now() - de[0].at > Ei; ) de.shift();
          if (!de.length || or() || await Ai(de[0]) === "wait") return;
          de.shift();
        }
      } finally {
        ir = !1, t.changed();
      }
    }
  }
  async function Ai(y) {
    var I;
    f = !0;
    try {
      await Pe();
      const V = $n();
      if (V === "loading") return "wait";
      if (V !== "ready" || !tn() || !(s != null && s.session) || s.session.playsLeft < 1 || !m) return "done";
      if (xe().length) return "wait";
      k || (await t.chain.verify(), k = !0);
      const J = s.address, { balance: bt, nonce: F } = await t.chain.account(J);
      o = bt, a = t.now();
      const gt = await t.chain.owner(Sl, y.song);
      if (gt === J || gt === jt()) return "done";
      const mt = await i.request("listening.signPlay", {
        core: Sl,
        song: y.song,
        receipt: y.id,
        fee: $t().toString(),
        nonce: F.toString(),
        balance: bt.toString()
      }), xt = {
        id: y.id,
        address: J,
        kind: "play",
        core: Sl,
        song: y.song,
        recipient: gt,
        amount: "50",
        fee: $t().toString(),
        nonce: F.toString(),
        created: t.now(),
        status: "signed",
        raw: mt.raw,
        txid: mt.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...y.title ? { title: String(y.title).slice(0, 120) } : {},
        ...y.artist ? { artist: String(y.artist).slice(0, 120) } : {}
      };
      t.validate(xt), ne(xt);
      const Pt = y.title ? `“${y.title}”${y.artist ? ` by ${y.artist}` : ""}` : `song #${y.song}`;
      try {
        await t.chain.broadcast(mt.raw, mt.txid), ne({ ...xt, status: "pending" }), S = `♪ Paid ${Pt}`, M = "";
      } catch (Oe) {
        ne({ ...xt, status: Ii(Oe) ? "failed" : "unknown", note: Oe.message, ...Ii(Oe) ? { raw: void 0 } : {} }), M = Oe.message;
      }
      return s = await dt(i), "done";
    } catch (V) {
      const J = V instanceof Error ? V.message : "payment unavailable";
      return (I = It()) != null && I.player ? (S = "Payment is taking a moment: " + J, "wait") : (S = "This song played free: " + J, "done");
    } finally {
      f = !1, t.changed();
    }
  }
  function Cs(y) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes($n()) || Dt("like") ? !1 : (Wn(y), !0);
  }
  async function Wn(y) {
    const I = y.title ? `“${y.title}”` : `song #${y.song}`, V = (cn) => {
      var qr;
      M = cn, S = "";
      try {
        (qr = t.likeFailed) == null || qr.call(t, y.song);
      } catch {
      }
      t.changed();
    }, J = v(), bt = $n(), F = jt(), gt = J && (bt === "fund" || bt === "over") ? "ready" : bt, mt = it() ? Ee() : F;
    if (gt === "locked") {
      p = { ...y, at: t.now() }, Vt(`Unlock to like ${I}. It sends straight after.`);
      return;
    }
    if (gt === "wrong-wallet") return V($());
    if (gt === "link") return V("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (it() && Dt("standalone")) return V("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (gt === "fund") return V("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (gt === "over") return V("Return the excess first: the listening wallet holds more than 1 STX.");
    if (J) {
      await ae(!0);
      const cn = O();
      if (D(cn))
        return t.changed(), V(yc);
    }
    if (gt !== "ready" || !mt) return V("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(s != null && s.session)) return V("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!m) return V("Pay-per-play is running in another tab. Like from that tab.");
    const xt = Je(Ee()).find((cn) => cn.kind === "like" && cn.song === y.song);
    if (xt && xo.includes(xt.status))
      return V(`Your last like for ${I} is still on its way. It can change again once it confirms.`);
    if (l) return V("One like at a time: your last one is still being sent.");
    if ((xt == null ? void 0 : xt.status) === "confirmed" && t.now() - (xt.confirmedAt ?? 0) < g6)
      return V(`Your like for ${I} has only just confirmed. Try again in a moment.`);
    let Pt;
    w = !0;
    try {
      Pt = t.likeState ? (await t.likeState(mt, y.song)).by : y.likedBy ?? [];
    } catch {
      Pt = y.likedBy;
    } finally {
      w = !1;
    }
    if (!Pt) return V(`Could not check ${I} right now. Try the heart again.`);
    const Oe = Ee(), Ke = ((xt == null ? void 0 : xt.status) === "confirmed" && typeof xt.liked == "boolean" && t.now() - (xt.confirmedAt ?? xt.created) < 5 * 6e4 ? xt.liked : void 0) ?? Pt.includes(Oe);
    if (!Ke && Pt.some((cn) => cn !== Oe)) return V(it() ? `${I} was liked from another wallet of yours. Unlike it there.` : `${I} was liked from your main wallet${Pt.includes(F) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await cr({ song: y.song, liked: !Ke, title: y.title, artist: y.artist });
  }
  async function cr(y) {
    var J, bt, F;
    if (l) {
      Vt("Still sending your last like. Try again in a moment.");
      return;
    }
    l = !0;
    const I = y.title ? `“${y.title}”${y.artist ? ` by ${y.artist}` : ""}` : `song #${y.song}`, V = t.wait ?? ((gt) => new Promise((mt) => setTimeout(mt, gt)));
    try {
      Vt(`${y.liked ? "Liking" : "Unliking"} ${I}…`);
      const gt = t.now() + 12e4;
      for (; f || (v() ? Je(Ee()).some((Ke) => xo.includes(Ke.status)) : xe().length); ) {
        if (t.now() > gt) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await V(5e3), await Pe(!0);
      }
      if (!v() && $n() !== "ready" || (s == null ? void 0 : s.state) !== "unlocked" || !s.session) throw new Error("Paying stopped before the like was sent.");
      const mt = Ee(), { balance: xt, nonce: Pt } = await t.chain.account(mt);
      if (v() ? c = { for: mt, value: xt, at: t.now() } : (o = xt, a = t.now()), D(xt)) throw new Error(yc);
      const Oe = await i.request("listening.signLike", {
        song: y.song,
        liked: y.liked,
        fee: ml.toString(),
        nonce: Pt.toString(),
        balance: xt.toString()
      }), nn = {
        id: El(),
        address: mt,
        kind: "like",
        core: 0,
        song: y.song,
        liked: y.liked,
        recipient: "",
        amount: "0",
        fee: ml.toString(),
        nonce: Pt.toString(),
        created: t.now(),
        status: "signed",
        raw: Oe.raw,
        txid: Oe.txid,
        ...y.title ? { title: String(y.title).slice(0, 120) } : {},
        ...y.artist ? { artist: String(y.artist).slice(0, 120) } : {}
      };
      t.validate(nn), ne(nn);
      try {
        await t.chain.broadcast(Oe.raw, Oe.txid), ne({ ...nn, status: "pending" }), S = `${y.liked ? "♥ Liked" : "Unliked"} ${I}`, M = "";
        try {
          (J = t.likeSent) == null || J.call(t, y.song, y.liked);
        } catch {
        }
      } catch (Ke) {
        if (ne({ ...nn, status: Ii(Ke) ? "failed" : "unknown", note: Ke.message, ...Ii(Ke) ? { raw: void 0 } : {} }), M = Ke.message, Ii(Ke)) try {
          (bt = t.likeFailed) == null || bt.call(t, y.song);
        } catch {
        }
      }
      s = await dt(i);
    } catch (gt) {
      M = "Like not sent: " + (gt instanceof Error ? gt.message : "the listening wallet is unavailable");
      try {
        (F = t.likeFailed) == null || F.call(t, y.song);
      } catch {
      }
    } finally {
      l = !1, t.changed(), ar();
    }
  }
  return { snapshot: bi, refresh: Pe, onListened: Cr, heart: Cs, toggleLike: Wn, ...On };
}
const aw = ["Connect", "Passkey", "Link & fund", "Listen"], cw = ["Passkey", "Add 1 STX", "Listen"], Bu = (t) => t ? cw : aw;
function w6(t) {
  if (t.solo) return b6(t);
  const e = aw.length, n = (r, i, s = !1) => ({ at: r, blocked: s, caption: r >= e ? i : `Step ${r + 1} of ${e} · ${i}` });
  switch (t.step) {
    case "off":
    case "loading":
      return null;
    case "elsewhere":
      return n(0, "open the pay-per-play radio");
    case "connect":
      return n(0, "connect your wallet above");
    case "not-invited":
      return n(0, "this wallet is not in the test yet", !0);
    case "wrong-wallet":
      return n(0, "connect the wallet this listening wallet belongs to", !0);
    case "unsupported":
      return n(1, "this browser cannot make a passkey wallet", !0);
    case "intro":
      return n(1, "create your passkey listening wallet");
    case "locked":
      return n(1, "unlock your passkey listening wallet");
    case "link":
      return n(2, "link to your main wallet");
    case "fund":
      return n(2, t.depositPending ? "funds on their way: nothing to do" : "add up to 1 STX");
    case "over":
      return n(2, "over 1 STX: return the excess", !0);
    case "ready": {
      if (!t.payingOn || !t.session || t.session.playsLeft < 1) return n(3, "switch paying on");
      const r = t.entries.filter((i) => i.kind === "play");
      return r.some((i) => i.status === "confirmed") ? n(e, "Paid plays are taking place") : r.some((i) => ["signed", "pending", "unknown"].includes(i.status)) ? n(3, "first paid play sent, confirming") : n(3, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function b6(t) {
  const e = cw.length, n = (r, i, s = !1) => ({ at: r, blocked: s, caption: r >= e ? i : `Step ${r + 1} of ${e} · ${i}` });
  switch (t.step) {
    case "off":
    case "loading":
      return null;
    case "elsewhere":
      return n(0, "open the pay-per-play radio");
    case "unsupported":
      return n(0, "this browser cannot make a passkey wallet", !0);
    case "intro":
      return n(0, "create your passkey listening wallet");
    case "locked":
      return n(0, "unlock your passkey listening wallet");
    case "fund":
      return n(1, t.depositPending ? "your funds are on their way: nothing to do" : "add 1 STX: anyone can send it to your address");
    case "over":
      return n(1, "over 1 STX: return the excess", !0);
    case "ready": {
      if (!t.payingOn || !t.session || t.session.playsLeft < 1) return n(2, "switch paying on");
      const r = t.entries.filter((i) => i.kind === "play");
      return r.some((i) => i.status === "confirmed") ? n(e, "Paid plays are taking place") : r.some((i) => ["signed", "pending", "unknown"].includes(i.status)) ? n(2, "first paid play sent, confirming") : n(2, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function m6(t, e) {
  return !e || e.at >= Bu(!!t.solo).length || t.heard || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const x6 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function S6(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !x6(r.id)));
}
const E6 = {}, A6 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, v6 = (t) => {
  const e = E6;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, k6 = (t) => `/hiro/${t}`, $6 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, I6 = (t) => {
  const e = v6(t);
  if (e)
    return [$6(e)];
  const n = A6[t];
  return typeof window < "u" ? [`${window.location.origin}${k6(t)}`, ...n.filter((i) => !i.includes("hiro.so"))] : n;
}, L6 = {}, p0 = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, C6 = "xtrata.log.enabled", T6 = "xtrata.log.level", B6 = "xtrata.log.tags", M6 = "xtrata.log.dedupe", Ca = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, N6 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, P6 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, _6 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, U6 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, H6 = () => {
  const t = L6 ?? {}, e = Ca(C6) ?? t.VITE_LOG_ENABLED, n = Ca(T6) ?? t.VITE_LOG_LEVEL, r = Ca(B6) ?? t.VITE_LOG_TAGS, i = Ca(M6) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: N6(e),
    level: P6(n) ?? "warn",
    tags: U6(r),
    dedupe: _6(i)
  };
}, O6 = (t, e, n) => !t.enabled || p0[n] < p0[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), D6 = (t, e, n, r) => {
  const i = H6();
  if (!O6(i, e, t) || j6(i.dedupe))
    return;
  const s = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(s, r) : o(s);
}, F6 = /* @__PURE__ */ new Set();
let g0 = null;
const j6 = (t, e, n, r, i) => (g0 !== t && (F6.clear(), g0 = t), !1), z6 = (t, e, n) => D6("debug", t, e, n), R6 = {}, G6 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, K6 = (t) => {
  const e = R6, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : G6[t];
}, V6 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, q6 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return V6.test(n) ? n : null;
}, W6 = (t) => t.replace(/\/+$/, ""), X6 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), y0 = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.startsWith("0x") ? t.slice(2) : t;
  if (!e || e.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(e))
    return null;
  let n = "";
  for (let r = 0; r < e.length; r += 2) {
    const i = Number.parseInt(e.slice(r, r + 2), 16);
    if (i < 32 || i > 126)
      return null;
    n += String.fromCharCode(i);
  }
  return n;
}, Li = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, Y6 = (t) => {
  var c, u;
  let e;
  try {
    e = wr(X8(t));
  } catch {
    return null;
  }
  const n = Li(e);
  if (!n || n.success === !1)
    return null;
  const r = Li(n.value), i = Li(r == null ? void 0 : r.value), s = Li(i == null ? void 0 : i.value);
  if (!s)
    return null;
  const o = y0((c = Li(s.name)) == null ? void 0 : c.value), a = y0((u = Li(s.namespace)) == null ? void 0 : u.value);
  return !o || !a ? null : q6(`${o}.${a}`);
}, Z6 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${W6(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, i = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [jy(vy(t.address))]
    }),
    signal: t.signal
  });
  if (!i.ok)
    throw new Error(`BNS primary lookup failed (${i.status})`);
  const s = await i.json();
  return !(s != null && s.okay) || typeof s.result != "string" ? null : Y6(s.result);
}, Q6 = async (t) => {
  const e = t.address.trim();
  if (!Di(e))
    return null;
  const n = K6(t.network);
  if (!n)
    return null;
  let r = null;
  for (const i of I6(t.network))
    try {
      return await Z6({
        baseUrl: i,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (s) {
      r = s;
    }
  return z6("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: X6(r)
  }), null;
};
function J6(t, e, n = {}) {
  const r = n.retryAfterMs ?? 3e4, i = n.now ?? Date.now, s = /* @__PURE__ */ new Map(), o = (a, c) => {
    c.pending = !0, c.failedAt = void 0, Promise.resolve().then(() => t(a)).then((u) => {
      c.pending = !1, u && (c.name = u, e());
    }).catch(() => {
      c.pending = !1, c.failedAt = i();
    });
  };
  return {
    get(a) {
      if (!a) return null;
      let c = s.get(a);
      return c ? !c.pending && c.name === null && c.failedAt !== void 0 && i() - c.failedAt >= r && o(a, c) : (c = { name: null, pending: !1 }, s.set(a, c), o(a, c)), c.name;
    }
  };
}
const w0 = Object.freeze({
  8: "melophonic",
  312: "Hundred Little Reasons",
  315: "melophonic",
  577: "Cicada",
  688: "Cicada",
  689: "Cicada",
  785: "Cicada",
  1050: "Cicada",
  1097: "Audionals",
  1099: "Audionals",
  1101: "Audionals",
  1105: "Audionals",
  1107: "Audionals",
  1117: "Cicada",
  1120: "Audionals",
  1122: "Hundred Little Reasons",
  2186: "Hundred Little Reasons",
  2187: "Hundred Little Reasons",
  2188: "Hundred Little Reasons",
  2189: "Hundred Little Reasons",
  2190: "Hundred Little Reasons",
  2753: "BotCupid",
  2755: "botcupid",
  2756: "botcupid",
  2830: "Xtrata Demo",
  2883: "Audionals",
  2885: "Audionals",
  2889: "Audionals",
  2892: "Audionals",
  2895: "Audionals",
  2896: "Audionals",
  2910: "Audionals",
  2964: "3ai3",
  2971: "Audionals",
  2972: "Audionals",
  2978: "Audionals",
  2981: "Audionals",
  2985: "3ai3",
  3018: "3ai3",
  3020: "3ai3",
  3031: "3ai3",
  3032: "3ai3",
  3036: "3ai3"
}), b0 = Object.freeze({ 139: "melophonic" });
function tk(t, e = "") {
  const n = String(t);
  return Object.hasOwn(w0, n) ? w0[n] : Object.hasOwn(b0, n) ? b0[n] : e;
}
const m0 = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function ek(t, e = "") {
  return Object.hasOwn(m0, String(t)) ? m0[String(t)] : e;
}
const lw = 10000n, Kf = 1000000n, wc = 3000n, nk = (t, e) => `${t}#gift=${e}`, rk = 100, Ta = (t, e = yi) => t <= je ? 0 : Number((t - je) / Mn(e)), x0 = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), uw = "xtrata.xyz/radio/gifts", Al = rk, sk = "Create a prefunded Xtrata radio gift batch", ik = (t) => ({
  domain: si({ name: Ze(uw), version: Ze("1"), "chain-id": Sr(1) }),
  message: si({
    purpose: Ze(sk),
    creator: Ze(t.creator),
    count: Sr(t.count),
    amount: Sr(BigInt(t.amount)),
    label: Ze(t.label),
    issued: Sr(t.issued),
    ...t.player ? { player: Ze(t.player) } : {}
  })
}), ok = (t, e, n = yi) => je + BigInt(t) * Mn(n) + (e ? qc : 0n), ak = (t, e = yi) => Number((Kf - je - (t ? qc : 0n)) / Mn(e)), ck = (t, e) => BigInt(t) * (e + wc);
function lk(t, e, n, r = yi) {
  const i = n ? qc : 0n, s = e > je + i ? e - je - i : 0n, o = Number(s / Mn(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * hc,
    fees: BigInt(o) * r,
    reserve: je,
    float: i,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: wc,
    perCopy: e + wc,
    total: ck(t, e)
  };
}
const uk = (t) => t >= lw && t <= Kf, S0 = 40, fk = "Create an Xtrata radio gift player", dk = /^[^\u0000-\u001f\u007f<>]+$/u;
function E0(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && dk.test(t) : !n;
}
function hk(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!E0(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!E0(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > S0) throw new Error(`A player holds 1 to ${S0} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const n of t.tracks) {
    if (!Number.isSafeInteger(n) || n < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(n)) throw new Error("A song appears twice in the list.");
    e.add(n);
  }
  if (t.cover !== null && t.cover !== void 0 && (!Number.isSafeInteger(t.cover) || t.cover < 1)) throw new Error("Cover is a catalogue token number.");
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: t.cover ?? null };
}
const pk = (t) => Ip(Np(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null })))), gk = (t) => ({
  domain: si({ name: Ze(uw), version: Ze("1"), "chain-id": Sr(1) }),
  message: si({
    purpose: Ze(fk),
    admin: Ze(t.admin),
    player: Ze(t.hash),
    issued: Sr(t.issued)
  })
}), Fi = (t) => t.tracks.filter((e) => !e.hidden), yk = (t) => t.tracks.find((e) => e.hidden) ?? null, wk = [300, 500, 1e3], A0 = 1800, vl = /* @__PURE__ */ new Map();
async function bk(t) {
  try {
    return await navigator.clipboard.writeText(t), !0;
  } catch {
  }
  try {
    const e = document.createElement("textarea");
    e.value = t, e.setAttribute("readonly", ""), e.style.position = "fixed", e.style.opacity = "0", document.body.append(e), e.select();
    const n = document.execCommand("copy");
    return e.remove(), n;
  } catch {
    return !1;
  }
}
function mk(t, e, n, r, i) {
  const s = document.createElement("button");
  return s.type = "button", s.className = r, s.dataset.feedback = t, (() => {
    const a = vl.get(t), c = !!a && a.until > Date.now();
    s.textContent = c ? a.label : e, s.classList.toggle("is-done", c && a.ok), s.classList.toggle("is-failed", c && !a.ok);
  })(), s.onclick = async () => {
    const a = await n();
    if (a) {
      vl.set(t, { ...a, until: Date.now() + A0 });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        vl.delete(t), i();
      }, A0 + 50);
    }
  }, s;
}
const Hi = (t, e, n, r, i) => mk(t, e, async () => await bk(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, i), Ts = "xtrata.radio.gift.incoming.v1", v0 = (t) => "xtrata.radio.gift.mine.v1:" + t, k0 = (t) => "xtrata.radio.gift.batches.v1:" + t, St = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Pr = (t, e, n = "") => {
  const r = St("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, Ba = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, Fn = (t) => pr(t).replace(/\.?0+$/, "");
function xk(t) {
  let e = null;
  const n = (v) => [5e3, 1e4, 2e4, 3e4][v] ?? 6e4, r = (() => {
    try {
      const v = new URL(location.href), O = new URLSearchParams(v.hash.slice(1)).get("gift") ?? v.searchParams.get("gift");
      return O !== null && (v.searchParams.delete("gift"), history.replaceState(null, "", v.pathname + (v.search || ""))), x0(O) ? O : null;
    } catch {
      return null;
    }
  })(), i = (() => {
    try {
      const v = JSON.parse(t.store.get(Ts) || "null");
      return x0(v == null ? void 0 : v.code) ? v.code : null;
    } catch {
      return null;
    }
  })(), s = r ?? i;
  if (s) {
    e = { code: s }, t.store.set(Ts, JSON.stringify({ code: s, at: t.now() }));
    let v = 0;
    const O = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: s }), signal: AbortSignal.timeout(15e3) }).then(async (D) => {
      const G = await D.json().catch(() => ({}));
      if (D.status === 404) {
        t.store.set(Ts, null), e = { ...e, error: (G == null ? void 0 : G.error) || "That gift link is not valid." }, t.changed();
        return;
      }
      if (!D.ok) throw new Error("busy");
      const ht = G;
      e = { ...e, view: ht, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(ht.status) && t.store.set(Ts, null), t.changed();
    }).catch(() => {
      !e || e.view || (e = { ...e, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, t.changed(), setTimeout(() => void O(), n(v++)));
    });
    O();
  }
  const o = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, a = () => {
    const v = e == null ? void 0 : e.view;
    return !(v != null && v.player) || !o() ? null : { player: v.player, from: u(v), plays: Ta(BigInt(v.amount)) };
  }, c = () => {
    e = null, t.store.set(Ts, null), t.changed();
  }, u = (v) => v.from ? t.who(v.from) : v.label ? `Xtrata Radio · ${v.label}` : "Xtrata Radio";
  let f = {};
  const l = (v) => {
    if (f.box) return f.box;
    const O = St("div", "", "ppp-gift-check");
    f.box = O;
    const D = () => {
      const G = window.turnstile;
      !G || f.rendered || (f.rendered = !0, G.render(O, { sitekey: v, callback: (ht) => {
        f.token = ht, t.changed();
      }, "expired-callback": () => {
        f.token = void 0;
      } }));
    };
    if (window.turnstile) D();
    else {
      const G = document.createElement("script");
      G.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", G.async = !0, G.onload = D, document.head.append(G);
    }
    return O;
  }, w = (v) => {
    queueMicrotask(() => void v());
  };
  let p;
  async function x(v) {
    var G, ht, it, Yt, Zt, re, ye, ue, Ae;
    if (!e || e.claiming || !v.listening) return;
    const O = !!((G = e.view) != null && G.player);
    if (O && !v.root) return;
    e.claiming = !0, e.error = void 0, (ht = t.claiming) == null || ht.call(t, !0), t.changed();
    const D = async (It) => {
      const At = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: f.token, ...It })
      });
      return { res: At, r: await At.json().catch(() => ({})) };
    };
    try {
      let It = 0, At = v.listening, qt;
      if (O) {
        const oe = Number((it = await t.json("/radio/gift/slots?root=" + encodeURIComponent(v.root))) == null ? void 0 : it.next);
        if (!Number.isSafeInteger(oe) || oe < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        It = oe;
        for (let Hn = 0; ; Hn++) {
          const kn = await t.album.bind(It);
          if (At = kn.address, qt = await D({ wallet: At, binding: kn }), qt.res.status === 409 && /just taken/.test(((Yt = qt.r) == null ? void 0 : Yt.error) || "") && Hn < 5) {
            It += 1;
            continue;
          }
          break;
        }
      } else qt = await D({ wallet: At });
      const { res: Qt, r: fe } = qt;
      if (Qt.status === 503 && /sending another gift/.test((fe == null ? void 0 : fe.error) || "")) {
        e.waiting = !0, (Zt = t.claiming) == null || Zt.call(t, !0), clearTimeout(p), p = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!Qt.ok) {
        const oe = String((fe == null ? void 0 : fe.error) || "");
        if (Qt.status === 404 || Qt.status === 410 || Qt.status === 409 && /already had a gift|brand-new|already have this album/.test(oe))
          throw t.store.set(Ts, null), new Error(oe || "This gift cannot be opened.");
        if (Qt.status === 429 || Qt.status === 403 || Qt.status === 400 && !/wallet number/i.test(oe)) throw new Error(oe || `Could not open the gift (${Qt.status}).`);
        const kn = /topping up/.test(oe) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(oe) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(oe) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(kn), { retry: !0, slow: /topping up|not paid for yet/.test(oe) });
      }
      e.done = !0, t.store.set(Ts, null), O ? await t.album.arrived(It, At, fe.txid, BigInt(fe.amount)) : t.giftSent(fe.txid, BigInt(fe.amount));
    } catch (It) {
      const At = It, qt = At.name === "TypeError" || At.name === "AbortError" || At.name === "TimeoutError" || /wallet number/i.test(At.message);
      if (At.retry || qt) {
        const Qt = e.tries ?? 0;
        e.tries = Qt + 1, e.retry = { text: At.retry ? At.message : "Still sending your gift… the network is slow, trying again." }, (re = t.claiming) == null || re.call(t, !0), clearTimeout(p), p = setTimeout(() => {
          e && (e.retry = void 0, t.changed());
        }, At.slow ? 6e4 : n(Qt));
      } else
        e.error = At.message, (ye = t.claiming) == null || ye.call(t, !1);
      f.token = void 0;
      try {
        (Ae = (ue = window.turnstile) == null ? void 0 : ue.reset) == null || Ae.call(ue, f.box);
      } catch {
      }
    } finally {
      e.claiming = !1, t.changed();
    }
  }
  let S = null;
  function M(v) {
    if (!v.listening || !v.depositPending || v.step !== "fund")
      return S = null, [];
    if (!S || S.wallet !== v.listening || t.now() - S.at > 3e4) {
      const D = v.listening;
      S = { ...(S == null ? void 0 : S.wallet) === D ? S : {}, wallet: D, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(D)).then((G) => {
        var ht, it;
        (S == null ? void 0 : S.wallet) === D && (S.state = (ht = G == null ? void 0 : G.gift) == null ? void 0 : ht.state, S.problem = ((it = G == null ? void 0 : G.gift) == null ? void 0 : it.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    if (!(S.state === "sending" && S.problem)) return [];
    const O = St("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return O.title = `Network reply: ${S.problem}`, [O];
  }
  function j(v, O, D = !1) {
    var re, ye;
    const G = O.player, ht = BigInt(O.amount), it = D ? [] : [St("p", `🎁 ${u(O)} sent you “${G.title}”${G.subtitle ? ` by ${G.subtitle}` : ""}: ${Fi(G).length} ${Fi(G).length === 1 ? "song" : "songs"} and ${Ta(ht).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!v.root && ["fund", "ready", "over", "link"].includes(v.step))) {
      if (D) return it;
      if (it.push(St("p", v.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : v.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), v.step === "intro") {
        const ue = document.createElement("details");
        ue.className = "ppp-how";
        const Ae = document.createElement("summary");
        Ae.textContent = "How does this work?", ue.append(Ae, St("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), it.push(ue);
      }
      return it;
    }
    if (v.walletCannotAlbums)
      return it.push(St("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), it;
    const Zt = (ye = (re = v.gate) == null ? void 0 : re.gifts) == null ? void 0 : ye.turnstileSiteKey;
    return Zt && !f.token ? it.push(St("p", "One quick check and it is yours:", "ppp-mute"), l(Zt)) : !e.claiming && !e.error && !e.waiting && !e.retry && w(() => x(v)), it.push(...z(v, "Sending your album…")), it;
  }
  function z(v, O) {
    const D = [];
    return e.claiming || e.waiting ? D.push(St("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : O, "ppp-cyan")) : e.retry && D.push(St("p", e.retry.text, "ppp-warn"), Pr("Try now", () => {
      clearTimeout(p), e.retry = void 0, x(v);
    }, "quiet")), e.error && D.push(St("p", e.error, "ppp-bad"), Pr("Try again", () => {
      e.error = void 0, x(v);
    })), D;
  }
  const A = (v) => {
    var O;
    return !!e && !e.done && !e.error && o() && !!v.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(e.claiming || e.waiting || e.retry) || !v.linked && !v.creditedTo && (v.createdHere || v.brandNew || !!((O = e.view) != null && O.player)) && (v.balance ?? 0n) === 0n && !v.entries.length);
  };
  function _(v, O = {}) {
    var Ae, It;
    const D = M(v);
    if (!e || ["off", "elsewhere"].includes(v.step)) return D;
    const G = e.view;
    if (e.error && !G) return [St("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!G) return [St("p", e.retry ? `🎁 ${e.retry.text}` : "🎁 Checking your gift…", e.retry ? "ppp-warn" : "ppp-mute")];
    if (e.done) return D;
    if (G.status === "claimed" || G.status === "claiming") return [St("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(G.status)) return [St("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (G.status === "pending-deposit") return [St("p", `🎁 ${u(G)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (G.player) return [...j(v, G, !!O.bare), ...D];
    if (!!v.listening && (!(v.createdHere || v.brandNew) || !!v.linked || !!v.creditedTo || (v.balance ?? 0n) > 0n || v.entries.length > 0))
      return [St("p", "🎁 A gift link is also waiting on this device. Gifts are for brand-new listening wallets, not this one: share the link with someone new.", "ppp-mute"), Pr("Forget this gift link here", c, "quiet")];
    const it = BigInt(G.amount), Yt = Ta(it).toLocaleString(), re = [St(
      "p",
      `🎁 ${u(G)} sent you ${Fn(it)} STX of on-chain music: about ${Yt} paid plays.`,
      "ppp-gift"
    )], ye = !!v.listening && (v.createdHere || v.brandNew) && !v.linked && !v.creditedTo && v.step === "fund" && (v.balance ?? 1n) === 0n && !v.depositPending && !v.entries.length, ue = (It = (Ae = v.gate) == null ? void 0 : Ae.gifts) == null ? void 0 : It.turnstileSiteKey;
    return ye ? (ue && !f.token ? re.push(St("p", "One quick check and it is yours:", "ppp-mute"), l(ue)) : !e.claiming && !e.error && !e.waiting && !e.retry && w(() => x(v)), re.push(...z(v, "Sending your gift…"))) : v.step === "intro" ? re.push(St("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : v.listening && v.linked ? re.push(St("p", "Gifts are for brand-new listening wallets, and this one is linked to a Stacks wallet. The link still works for someone new.", "ppp-mute"), Pr("Forget this gift link here", c, "quiet")) : v.listening && (v.balance ?? 0n) > 0n && re.push(St("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute"), Pr("Forget this gift link here", c, "quiet")), re;
  }
  async function N(v, O, D) {
    var G;
    try {
      const ht = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(v));
      if ((G = ht == null ? void 0 : ht.gift) != null && G.returnTo) return { ok: !0, funder: ht.gift.returnTo, txId: ht.gift.txid ?? void 0, amount: ht.gift.amount, distinct: 1 };
    } catch {
      if (D) return { ok: !1 };
    }
    return O();
  }
  const Q = St("div", "", "ppp-gift-fold");
  let tt = 250000n, R = "", K = "";
  const L = (v) => {
    try {
      const O = JSON.parse(t.store.get(v0(v)) || "[]");
      return Array.isArray(O) ? O : [];
    } catch {
      return [];
    }
  }, P = (v, O) => t.store.set(v0(v), JSON.stringify(O.slice(0, 50)));
  async function b(v) {
    const O = L(v);
    for (const D of O)
      if (!(D.view && ["claimed", "refunded", "expired"].includes(D.view.status)))
        try {
          D.view = !D.view || D.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: D.id, ...D.txid ? { txid: D.txid } : {} }) }) : await t.json("/radio/gift?id=" + D.id), D.error = void 0;
        } catch (G) {
          D.error = G.message;
        }
    P(v, O), t.changed();
  }
  async function T(v) {
    if (R) return;
    R = "Starting your gift…", K = "", t.changed();
    let O = null;
    try {
      O = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: v, amount: tt.toString() }) });
      const D = L(v);
      D.unshift({ id: O.id, code: O.code, amount: tt.toString(), at: t.now() }), P(v, D), R = "Approve the gift in your wallet…", t.changed();
      const G = await t.pay(v, O.depositTo, BigInt(O.deposit), O.memo), ht = L(v), it = ht.find((Yt) => Yt.id === O.id);
      it && (it.txid = G, it.view = { status: "pending-deposit", amount: tt.toString(), source: "friend", from: v, label: "", expires: 0 }), P(v, ht), K = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", b(v);
    } catch (D) {
      K = D.message || "Not sent.";
    } finally {
      R = "", t.changed();
    }
  }
  const H = (v) => "xtrata.radio.gift.players.v1:" + v, C = (v) => {
    try {
      const O = JSON.parse(t.store.get(H(v)) || "[]");
      return Array.isArray(O) ? O.filter((D) => D && /^[0-9a-f]{16}$/.test(D.id)) : [];
    } catch {
      return [];
    }
  };
  async function ot(v, O) {
    var D;
    if (!R) {
      R = "Checking the player…", K = "", t.changed();
      try {
        const G = O.tracks.split(/[\s,]+/).filter(Boolean).map((ye) => Number(ye.replace(/^#/, ""))), ht = hk({ title: O.title.trim(), subtitle: O.subtitle.trim(), tracks: G, cover: (D = O.cover) != null && D.trim() ? Number(O.cover.trim().replace(/^#/, "")) : null });
        R = "Sign in your wallet…", t.changed();
        const it = { admin: v, hash: pk(ht), issued: t.now() }, Yt = await t.sign(v, gk(it));
        R = "Making the player…", t.changed();
        const Zt = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: ht, request: it, signature: Yt }) }), re = C(v).filter((ye) => ye.id !== Zt.id);
        re.unshift({ id: Zt.id, title: Zt.title, tracks: Zt.tracks }), t.store.set(H(v), JSON.stringify(re.slice(0, 30))), K = `${Zt.existing ? "That player already exists" : "Player made"} ✓ “${Zt.title}” · ${Zt.tracks} songs. Pick it below for a batch.`;
      } catch (G) {
        K = G.message || "Not made.";
      } finally {
        R = "", t.changed();
      }
    }
  }
  const X = (v, O) => nk(v || location.origin + "/radio.html", O), Et = (v) => {
    try {
      const O = JSON.parse(t.store.get(k0(v)) || "[]");
      return Array.isArray(O) ? O.filter((D) => D && /^[0-9a-f]{16}$/.test(D.id) && Array.isArray(D.codes)) : [];
    } catch {
      return [];
    }
  }, k = (v, O) => t.store.set(k0(v), JSON.stringify(O.slice(0, 20))), m = (v) => !!v.view && v.view.status === "live" && v.view.copies.waiting + v.view.copies.claiming + v.view.copies.refunding === 0, q = (v, O) => t.json(v, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(O) });
  let nt = 0;
  async function at(v) {
    const O = Et(v);
    for (const D of O)
      if (!m(D))
        try {
          D.view = !D.view || D.view.status === "pending-deposit" ? await q("/radio/gift/batch/confirm", { id: D.id, ...D.txid ? { txid: D.txid } : {} }) : await t.json("/radio/gift/batch?id=" + D.id), D.error = void 0;
        } catch (G) {
          D.error = G.message;
        }
    try {
      const D = await t.json("/radio/gift/batches?creator=" + encodeURIComponent(v));
      for (const G of (D == null ? void 0 : D.batches) ?? []) {
        const ht = O.find((it) => it.id === G.id);
        if (ht) {
          ht.error || (ht.view = G);
          continue;
        }
        O.push({ id: G.id, codes: [], count: G.count, amount: G.amount, label: G.label, player: G.player, depositTo: "", deposit: G.deposit, memo: G.memo, at: 0, view: G });
      }
    } catch {
    }
    k(v, O), t.changed();
  }
  async function vt(v, O) {
    const D = Et(v).find((G) => G.id === O);
    if (!(!D || !D.depositTo || R)) {
      R = "Approve the payment in your wallet…", K = "", t.changed();
      try {
        const G = await t.pay(v, D.depositTo, BigInt(D.deposit), D.memo), ht = Et(v), it = ht.find((Yt) => Yt.id === O);
        it && (it.txid = G), k(v, ht), K = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", R = "", at(v);
      } catch (G) {
        K = `${/cancel/i.test(G.message) ? "Payment cancelled." : G.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        R = "", t.changed();
      }
    }
  }
  async function te(v, O, D, G) {
    if (R) return;
    if (!O.ok) {
      K = O.reason, t.changed();
      return;
    }
    R = "Sign in your wallet…", K = "", t.changed();
    let ht = null;
    try {
      const it = { creator: v, count: O.count, amount: O.amount.toString(), label: D, issued: t.now(), ...G ? { player: G } : {} }, Yt = await t.sign(v, ik(it));
      R = "Making your links…", t.changed(), ht = await q("/radio/gift/batch", { request: it, signature: Yt });
      const Zt = Et(v);
      Zt.unshift({ id: ht.id, codes: ht.codes, count: O.count, amount: ht.amount, label: D, player: G ?? null, depositTo: ht.depositTo, deposit: ht.deposit, memo: ht.memo, at: t.now() }), k(v, Zt);
    } catch (it) {
      K = it.message || "Not made.", R = "", t.changed();
      return;
    }
    R = "", t.changed(), await vt(v, ht.id);
  }
  function $t() {
    const v = !!Me.value, O = ze.value === "max" ? ak(v) : Number(ze.value), D = ok(O, v), G = Number(Se.value);
    return !Number.isInteger(G) || G < 1 || G > Al ? { ok: !1, reason: `Make 1 to ${Al} copies at a time.`, album: v, plays: O, amount: D, count: G } : uk(D) ? { ok: !0, reason: "", album: v, plays: O, amount: D, count: G, bill: lk(G, D, v) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: v, plays: O, amount: D, count: G };
  }
  const Dt = () => {
    const v = $t();
    if (!v.ok) return v.reason;
    const O = v.bill;
    return `Each copy: ${v.plays.toLocaleString()} paid plays (${Fn(O.holders)} to song holders, ${Fn(O.fees)} network fees)${v.album ? `, ${Fn(O.float)} for the album’s likes` : ""}, ${Fn(O.reserve)} kept so a listener can return what is left, + ${Fn(O.sendFee)} to send it = ${Fn(O.perCopy)} STX. ${v.count} copies = ${Fn(O.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, Nt = (v, O) => O.codes.map((D) => X(v, D)), ee = St("input");
  ee.type = "range", ee.min = String(lw), ee.max = String(Kf), ee.step = "10000", ee.value = String(tt), ee.setAttribute("aria-label", "Gift amount");
  const ct = St("p", "", "ppp-gift-amount"), jt = Pr("", () => {
    const v = t.main();
    v && T(v);
  }, "primary"), Je = () => {
    ct.textContent = ne(), jt.textContent = `Gift ${Fn(tt)} STX`;
  };
  ee.oninput = () => {
    tt = BigInt(ee.value), Je();
  };
  const ne = () => `${Fn(tt)} STX · about ${Ta(tt).toLocaleString()} paid plays · you pay ${Fn(tt + wc)} STX with the network fee`;
  Je();
  const tn = St("input");
  tn.maxLength = 60, tn.placeholder = "Title, e.g. Proof of Sound", tn.setAttribute("aria-label", "Player title");
  const De = St("input");
  De.maxLength = 80, De.placeholder = "Artist (optional)", De.setAttribute("aria-label", "Player subtitle");
  const xe = St("textarea");
  xe.rows = 3, xe.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", xe.setAttribute("aria-label", "Songs");
  const qe = St("input");
  qe.inputMode = "numeric", qe.placeholder = "Cover inscription number (optional), shown when the album loads", qe.setAttribute("aria-label", "Cover inscription");
  const Me = St("select");
  Me.setAttribute("aria-label", "Batch album");
  const ze = St("select");
  ze.setAttribute("aria-label", "Plays per copy");
  for (const v of wk) ze.append(Ba(`${v.toLocaleString()} plays`, String(v)));
  ze.append(Ba("Max (1 STX)", "max"));
  const Se = St("input");
  Se.type = "number", Se.min = "1", Se.max = String(Al), Se.value = "10", Se.setAttribute("aria-label", "Copies");
  const zt = St("input");
  zt.maxLength = 40, zt.placeholder = "Label, e.g. Opera launch", zt.setAttribute("aria-label", "Batch label");
  const Re = St("p", "", "ppp-mute"), gn = () => {
    Re.textContent = Dt();
  };
  for (const v of [Me, ze, Se])
    v.oninput = gn, v.onchange = gn;
  gn();
  function Ne(v) {
    var ht, it;
    const O = (ht = v.gate) == null ? void 0 : ht.gifts;
    if (!(O != null && O.enabled) || !O.admin || ["off", "elsewhere", "unsupported"].includes(v.step)) return null;
    const D = t.main(), G = [St("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!D)
      G.push(St("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (O.admin) {
      const Yt = St("div", "", "ppp-gift-admin"), Zt = (It, At) => {
        const qt = St("label", It);
        return qt.append(At), qt;
      }, re = C(D);
      Yt.append(
        St("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        tn,
        De,
        xe,
        qe,
        Pr("Sign and make player", () => void ot(D, { title: tn.value, subtitle: De.value, tracks: xe.value, cover: qe.value }))
      );
      const ye = Pr("Sign, pay and make links", () => {
        te(D, $t(), zt.value.trim(), Me.value || void 0);
      });
      ye.disabled = !!R;
      const ue = Me.value;
      Me.replaceChildren(Ba("No album (starter copies)", ""), ...re.map((It) => Ba(`${It.title} · ${It.tracks} songs`, It.id))), re.some((It) => It.id === ue) && (Me.value = ue), gn(), Yt.append(
        St("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
        Zt("Album ", Me),
        Zt("Plays each ", ze),
        Zt("Copies ", Se),
        zt,
        Re,
        ye
      ), t.now() - nt > 3e4 && (nt = t.now(), at(D));
      const Ae = Et(D);
      if (Ae.length) {
        const It = St("ul", "", "ppp-gift-list");
        for (const At of Ae.slice(0, 10)) {
          const qt = At.view, Qt = qt == null ? void 0 : qt.copies, fe = At.error ? At.error : !qt || qt.status === "pending-deposit" ? At.txid ? "payment confirming…" : "waiting for your payment" : `${Qt.claimed} of ${qt.count} claimed${Qt.refunding + Qt.refunded ? ` · ${Qt.refunded} refunded${Qt.refunding ? `, ${Qt.refunding} on their way` : ""}` : ""}`, oe = St("li");
          if (oe.append(St("span", `${At.label || "Batch"} · ${At.count} × ${Fn(BigInt(At.amount))} STX`, "t"), St("span", fe, "ppp-mute")), !At.txid && At.depositTo && (!qt || qt.status === "pending-deposit") && oe.append(Pr("Pay now", () => void vt(D, At.id), "tiny")), At.codes.length && (qt == null ? void 0 : qt.status) === "live") {
            const Hn = Nt(((it = v.gate) == null ? void 0 : it.radioUrl) ?? null, At);
            oe.append(
              Hi("batch-copy:" + At.id, "Copy all links", () => Hn.join(`
`), "tiny", t.changed),
              Hi("batch-csv:" + At.id, "Copy as CSV", () => ["copy,link", ...Hn.map((kn, Gr) => `${Gr + 1},${kn}`)].join(`
`), "tiny", t.changed)
            );
          } else At.codes.length || oe.append(St("span", "links were made on another device", "ppp-mute"));
          It.append(oe);
        }
        Yt.append(It);
      }
      G.push(Yt);
    }
    return R && G.push(St("p", R, "ppp-cyan")), K && G.push(St("p", K, /✓/.test(K) ? "ppp-ok" : "ppp-warn")), Q.replaceChildren(...G), Q;
  }
  return { banner: _, funder: N, renderFold: Ne, liveGift: o, incomingAlbum: a, setAside: c, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null, inProgress: A };
}
const Sk = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function Ek(t) {
  if (!Array.isArray(t)) return [];
  const e = [];
  for (const n of t) {
    if (!n || !Number.isSafeInteger(n.slot) || n.slot < 1 || typeof n.address != "string") continue;
    const r = n.player, i = r && typeof r.id == "string" && typeof r.title == "string" && Array.isArray(r.tracks) ? r : null;
    i && e.push({
      slot: n.slot,
      address: n.address,
      state: n.state === "arrived" ? "arrived" : "sending",
      amount: String(n.amount ?? "0"),
      label: typeof n.label == "string" ? n.label : "",
      from: typeof n.from == "string" ? n.from : null,
      source: String(n.source ?? ""),
      player: i
    });
  }
  return e;
}
const Ak = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).filter((i) => !i.hidden).flatMap((i) => [i.title, i.artist])].filter(Boolean).join(" ").toLowerCase();
};
function vk(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((s) => (!e.pinnedOnly || e.pins.has(s.slot)) && (() => {
    const o = Ak(s);
    return n.every((a) => o.includes(a));
  })()), i = {
    recent: (s, o) => (e.recents[o.slot] ?? 0) - (e.recents[s.slot] ?? 0) || o.slot - s.slot,
    newest: (s, o) => o.slot - s.slot,
    oldest: (s, o) => s.slot - o.slot,
    title: (s, o) => {
      var a, c;
      return (((a = s.player) == null ? void 0 : a.title) ?? "").localeCompare(((c = o.player) == null ? void 0 : c.title) ?? "") || s.slot - o.slot;
    }
  };
  return r.sort((s, o) => Number(e.pins.has(o.slot)) - Number(e.pins.has(s.slot)) || i[e.sort](s, o));
}
function kk(t, e = 100) {
  const n = Object.entries(t).sort((r, i) => i[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, i]) => [Number(r), i]));
}
const Mu = /* @__PURE__ */ new Set(), fw = (t) => (Mu.add(t), () => {
  Mu.delete(t);
}), Nu = () => {
  for (const t of [...Mu])
    try {
      t();
    } catch {
    }
}, $0 = "xtrata:al-thumb:v1:", dw = "-", So = 96, $k = 24 * 1024 * 1024, ln = /* @__PURE__ */ new Map(), I0 = /* @__PURE__ */ new Set(), Pu = [];
let kl = !1, $l;
const bc = (t, e) => {
  try {
    if (e === void 0) return window.localStorage.getItem($0 + t);
    window.localStorage.setItem($0 + t, e);
  } catch {
  }
  return null;
};
function Vf(t) {
  return new Promise((e) => {
    var n;
    try {
      const r = document.createElement("canvas"), i = (n = r.getContext) == null ? void 0 : n.call(r, "2d");
      if (!i) return e(t);
      const s = new Image(), o = setTimeout(() => e(t), 8e3);
      s.onload = () => {
        clearTimeout(o);
        try {
          const a = Math.min(s.naturalWidth, s.naturalHeight);
          if (!a) return e(t);
          r.width = r.height = So, i.fillStyle = "#143a40", i.fillRect(0, 0, So, So), i.drawImage(s, (s.naturalWidth - a) / 2, (s.naturalHeight - a) / 2, a, a, 0, 0, So, So), e(r.toDataURL("image/jpeg", 0.82));
        } catch {
          e(t);
        }
      }, s.onerror = () => {
        clearTimeout(o), e(t);
      }, s.src = t;
    } catch {
      e(t);
    }
  });
}
async function Ik(t) {
  var c, u, f, l, w;
  const e = await fetch("/inscription/" + t, { signal: AbortSignal.timeout(6e4) }), n = (e.headers.get("content-type") || "").toLowerCase();
  if (!e.ok)
    return await ((c = e.body) == null ? void 0 : c.cancel()), null;
  if (n.startsWith("image/"))
    return await ((u = e.body) == null ? void 0 : u.cancel()), "/inscription/" + t;
  if (!n.includes("text/html"))
    return await ((f = e.body) == null ? void 0 : f.cancel()), "";
  let r = "", i = 0;
  const s = (p) => {
    let x = 0;
    for (; ; ) {
      const S = r.slice(x).search(/<img\b/i);
      if (S < 0)
        return r = p ? "" : r.slice(Math.max(0, r.length - 4)), null;
      const M = x + S, j = r.indexOf(">", M);
      if (j < 0)
        return r = r.slice(M), null;
      const z = r.slice(M, j + 1), A = z.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (A) return A[1].replace(/&amp;/g, "&");
      const _ = z.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (_) return "/inscription/" + _[1];
      x = j + 1;
    }
  }, o = (w = (l = e.body) == null ? void 0 : l.getReader) == null ? void 0 : w.call(l);
  if (!o)
    return r = await e.text(), s(!0) ?? "";
  const a = new TextDecoder();
  for (; ; ) {
    const { done: p, value: x } = await o.read();
    if (p) break;
    i += x.byteLength, r += a.decode(x, { stream: !0 });
    const S = s(!1);
    if (S)
      return await o.cancel(), S;
    if (i > $k)
      return await o.cancel(), null;
  }
  return r += a.decode(), s(!0) ?? "";
}
async function Lk() {
  if (!kl) {
    kl = !0;
    try {
      for (; Pu.length; ) {
        const t = Pu.shift();
        if (!ln.has(t))
          try {
            const e = await Ik(t);
            if (e === null) continue;
            if (!e) {
              ln.set(t, ""), bc(t, dw), Nu();
              continue;
            }
            const n = await Vf(e);
            ln.set(t, n), n.startsWith("data:image/jpeg") && bc(t, n), Nu();
          } catch {
          }
      }
    } finally {
      kl = !1;
    }
  }
}
function hw(t, e) {
  if (e && !ln.get(t) ? (ln.set(t, e), Vf(e).then((r) => {
    r !== e && (ln.set(t, r), r.startsWith("data:image/jpeg") && bc(t, r), Nu());
  })) : e === "" && !ln.has(t) && ln.set(t, ""), ln.has(t)) return ln.get(t);
  const n = bc(t);
  if (n != null) {
    const r = n === dw ? "" : n;
    return ln.set(t, r), r;
  }
  return I0.has(t) || (I0.add(t), Pu.push(t), $l || ($l = setTimeout(() => {
    $l = void 0, Lk();
  }, 1200))), "";
}
const Ci = 12, Ck = 5e3, sn = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Ti = (t, e, n = "") => {
  const r = sn("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function Tk(t) {
  let e, n = [], r = 0, i = !1, s = !1, o = -1 / 0, a = "", c = "recent", u = !1, f = Ci;
  const l = sn("div", "", "ppp-shelf-box");
  fw(() => t.changed());
  const w = (b) => "xtrata.radio.shelf.pins.v1:" + b, p = (b) => "xtrata.radio.shelf.recent.v1:" + b, x = (b, T) => {
    try {
      return JSON.parse(t.store.get(b) || "null") ?? T;
    } catch {
      return T;
    }
  }, S = (b) => new Set(x(w(b), []).filter((T) => Number.isSafeInteger(T))), M = (b) => {
    const T = x(p(b), {}), H = {};
    for (const [C, ot] of Object.entries(T)) Number.isSafeInteger(Number(C)) && typeof ot == "number" && (H[Number(C)] = ot);
    return H;
  };
  async function j(b) {
    if (!i) {
      i = !0, s = !1;
      try {
        const T = [];
        let H = 0, C = 0;
        for (let ot = 0; ot < Ck / 100 + 1; ot++) {
          const X = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(b)}&after=${H}&limit=100`);
          if (T.push(...Ek(X == null ? void 0 : X.shelf)), C = Number(X == null ? void 0 : X.total) || T.length, !(X != null && X.next) || !Number.isSafeInteger(X.next)) break;
          H = X.next;
        }
        b === e && (n = T, r = C, o = t.now());
      } catch {
        s = !0;
      } finally {
        i = !1, t.changed();
      }
    }
  }
  const z = () => {
    o = -1 / 0;
  }, A = sn("input");
  A.type = "search", A.placeholder = "Search title, artist or #", A.setAttribute("aria-label", "Search your albums"), A.oninput = () => {
    a = A.value, f = Ci, t.changed();
  };
  const _ = sn("select");
  _.setAttribute("aria-label", "Sort albums");
  for (const b of Sk) {
    const T = document.createElement("option");
    T.value = b.value, T.textContent = b.label, _.append(T);
  }
  _.onchange = () => {
    c = _.value, f = Ci, t.changed();
  };
  const N = Ti("", () => {
    u = !u, f = Ci, t.changed();
  }, "tiny"), Q = sn("div", "", "ppp-shelf-tools");
  Q.append(A, _, N);
  const tt = sn("div"), R = sn("div");
  function K(b) {
    const T = b.step === "off" || b.step === "elsewhere" ? void 0 : b.root;
    if (T !== e && (e = T, n = [], r = 0, o = -1 / 0, f = Ci), !T || b.walletCannotAlbums) return null;
    if (!i && t.now() - o > 5 * 6e4 && j(T), !n.length)
      return s ? (R.replaceChildren(sn("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), Ti("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), l.replaceChildren(R), l) : null;
    const H = S(T), C = M(T), ot = vk(n, { query: a, sort: c, pinnedOnly: u, pins: H, recents: C });
    A.value !== a && (A.value = a), _.value = c, N.textContent = u ? "★ Pinned only" : "☆ Pinned only", N.setAttribute("aria-pressed", String(u));
    const X = [];
    if (b.slot > 0 && X.push(Ti("← My player", () => t.open(0), "quiet")), !ot.length) X.push(sn("p", "No album matches that.", "ppp-mute"));
    else {
      const Et = sn("ul", "", "ppp-shelf-list");
      for (const k of ot.slice(0, f)) {
        const m = sn("li", "", k.slot === b.slot ? "now" : ""), q = H.has(k.slot), nt = Ti(q ? "★" : "☆", () => {
          const jt = new Set(H);
          q ? jt.delete(k.slot) : jt.add(k.slot), t.store.set(w(T), JSON.stringify([...jt])), t.changed();
        }, "tiny");
        nt.setAttribute("aria-label", q ? `Unpin ${k.player.title}` : `Pin ${k.player.title}`);
        const at = [k.player.subtitle, `${Fi(k.player).length} ${Fi(k.player).length === 1 ? "song" : "songs"}`, k.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), vt = k.slot === b.slot, te = Ti(vt ? "Playing" : "Select", () => {
          t.store.set(p(T), JSON.stringify(kk({ ...C, [k.slot]: t.now() }))), t.open(k.slot);
        }, vt ? "tiny ppp-pick" : "tiny primary ppp-pick");
        te.disabled = vt;
        const $t = Fi(k.player)[0], Dt = k.player.cover ?? ($t == null ? void 0 : $t.id), Nt = Dt ? hw(String(Dt)) : "", ee = sn("span", "", "ppp-shelf-art");
        if (Nt) {
          const jt = document.createElement("img");
          jt.src = Nt, jt.alt = "", jt.decoding = "async", ee.append(jt);
        } else ee.textContent = "💿";
        const ct = sn("span", "", "ppp-shelf-txt");
        ct.append(sn("span", k.player.title, "t"), sn("span", at, "ppp-mute")), m.append(nt, ee, ct, te), Et.append(m);
      }
      X.push(Et), ot.length > f && X.push(Ti(`Show more (${ot.length - f} left)`, () => {
        f += Ci, t.changed();
      }, "quiet"));
    }
    return s && X.push(sn("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), tt.replaceChildren(...X), l.firstChild !== Q && l.replaceChildren(Q, tt), l;
  }
  return { render: K, invalidate: z, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const b = M(e), T = [...n].filter((H) => H.player).sort((H, C) => (b[C.slot] ?? 0) - (b[H.slot] ?? 0) || C.slot - H.slot)[0];
    return T ? { slot: T.slot, title: T.player.title } : null;
  } };
}
const Bk = 20, Ye = (t, e = 22, n = !1) => `<svg width="${e}" height="${e}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${t}</svg>`, Le = {
  grid: Ye('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: Ye('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: Ye('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: Ye('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: Ye('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: Ye('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: Ye('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: Ye('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: Ye('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: Ye('<path d="M6 9l6 6 6-6"/>', 18),
  right: Ye('<path d="M9 6l6 6-6 6"/>', 16),
  close: Ye('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: Ye('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: Ye('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: Ye('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: Ye('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: Ye('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function Z(t, e = {}, ...n) {
  const r = document.createElement(t);
  for (const [i, s] of Object.entries(e))
    s == null || s === !1 || (i === "class" ? r.className = String(s) : i === "html" ? r.innerHTML = String(s) : i.startsWith("on") && typeof s == "function" ? r[i.toLowerCase()] = s : i === "disabled" ? r.disabled = !!s : r.setAttribute(i, s === !0 ? "" : String(s)));
  for (const i of n) i != null && i !== !1 && r.append(i);
  return r;
}
const rn = (t, ...e) => Z("button", { type: "button", ...t }, ...e), Ma = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`, Eo = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`, Mk = { music: "My music", device: "This device", gifts: "Albums (admin)" }, Nk = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function L0(t, e, n = {}) {
  const r = !!n.list;
  let i = null, s = "", o = !1;
  const a = document.documentElement, c = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set();
  function f(b) {
    var H, C, ot;
    if (!b || !Number.isSafeInteger(b)) return "";
    const T = (ot = (C = (H = e.radio()) == null ? void 0 : H.getState) == null ? void 0 : C.call(H)) == null ? void 0 : ot.albumCover;
    return T != null && T.url && Number(T.tokenId) === b ? T.url : c.has(b) ? c.get(b) : (u.has(b) || (u.add(b), fetch("/inscription/" + b, { signal: AbortSignal.timeout(2e4) }).then(async (X) => {
      var k, m, q, nt;
      const Et = (X.headers.get("content-type") || "").toLowerCase();
      if (!X.ok)
        throw await ((k = X.body) == null ? void 0 : k.cancel()), new Error("no cover");
      return Et.startsWith("image/") ? (await ((m = X.body) == null ? void 0 : m.cancel()), "/inscription/" + b) : Et.includes("text/html") ? (((q = (await X.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : q[1]) ?? "").replace(/&amp;/g, "&") : (await ((nt = X.body) == null ? void 0 : nt.cancel()), "");
    }).then((X) => {
      c.set(b, X), P();
    }).catch(() => {
      u.delete(b);
    })), "");
  }
  fw(() => P());
  function l(b) {
    var H;
    s = b, b ? a.dataset.sheet = b : delete a.dataset.sheet;
    const T = document.querySelector(".side");
    if (b && b !== "more") {
      for (const X of Nk[b]) {
        const Et = T == null ? void 0 : T.querySelector(X);
        Et && (Et.open = !0);
      }
      const C = document.getElementById("sheetTitle");
      C && (C.textContent = Mk[b]);
      const ot = document.getElementById("sheetExtra");
      ot && ot.replaceChildren(...b === "music" ? [p()] : []), (H = T == null ? void 0 : T.scrollTo) == null || H.call(T, { top: 0 });
    }
    P();
  }
  const w = r ? null : document.getElementById("sheetClose");
  w && (w.onclick = () => l("")), r || document.addEventListener("keydown", (b) => {
    b.key === "Escape" && s && a.dataset.view === "album" && l("");
  });
  const p = () => rn(
    { class: "al-row", onClick: () => {
      l(""), e.openPlayer();
    } },
    Z("span", { class: "al-row-i", html: Le.radio }),
    Z("span", { class: "al-row-t" }, Z("b", {}, "Xtrata Radio"), Z("small", {}, "Every song on-chain · FM, liked, all")),
    Z("span", { class: "al-row-go", html: Le.right })
  );
  let x = null, S = !1;
  const M = () => {
    var T;
    const b = e.radio();
    S || !(b != null && b.subscribe) || (S = !0, b.subscribe((H) => {
      x = H, (i == null ? void 0 : i.mode) === "open" && P();
    }), x = ((T = b.getState) == null ? void 0 : T.call(b)) ?? null);
  };
  r || setInterval(() => {
    var C, ot;
    if ((i == null ? void 0 : i.mode) !== "open" || !(x != null && x.playing)) return;
    const b = (ot = (C = e.radio()) == null ? void 0 : C.getPosition) == null ? void 0 : ot.call(C), T = t.querySelector(".al-bar > i"), H = t.querySelectorAll(".al-times span");
    !b || !T || (T.style.width = b.duration ? `${Math.min(100, b.current / b.duration * 100)}%` : "0%", H.length === 2 && (H[0].textContent = Ma(b.current || 0), H[1].textContent = b.duration ? Ma(b.duration) : "–:––"));
  }, 500);
  let j = "", z = null;
  function A(b, T, H = {}) {
    const C = H.song || f(b.cover), X = [C ? Z("img", { src: C, alt: H.song ? "Song artwork" : `${b.title} cover` }) : Z("div", { class: "al-cover-fallback" }, Z("b", {}, b.title), b.subtitle ? Z("span", {}, b.subtitle) : null), H.paused ? Z("span", { class: "al-paused" }, Z("i", { html: Le.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], Et = "al-cover" + (T ? "" : " al-cover--small") + (H.paused ? " is-paused" : "");
    return H.flip ? (X.push(Z("span", { class: "al-flip", "aria-hidden": "true", html: Le.flip })), rn({ class: Et + " is-flippable", "aria-label": H.flipped ? "Show this song’s artwork" : `Show the ${b.title} cover`, onClick: H.flip }, ...X)) : Z("div", { class: Et }, ...X);
  }
  function _(b) {
    return b.plays === null || b.plays === void 0 ? Z("span", { class: "al-chip al-chip--quiet" }, b.playsComing ? "Plays on their way…" : "…") : b.plays === 0 ? Z("span", { class: "al-chip al-chip--out" }, b.playsComing ? "Plays on their way…" : "No plays left") : Z("span", { class: "al-chip" + (b.plays <= Bk ? " al-chip--low" : "") }, `${Eo(b.plays, "play", "plays")} left`);
  }
  function N(b) {
    const T = b.player, H = T.tracks.filter((ot) => !ot.hidden), C = [];
    return b.mode === "arrive" && b.from && C.push(Z("p", { class: "al-from" }, Z("span", { html: Le.gift }), Z("span", {}, Z("b", {}, b.from), " sent you an album"))), C.push(A(T, !0)), C.push(Z(
      "div",
      { class: "al-intro" },
      Z("h1", {}, T.title),
      T.subtitle ? Z("p", { class: "al-artist" }, T.subtitle) : null,
      H.length ? Z("p", { class: "al-songline" }, H.map((ot) => ot.title || `#${ot.id}`).join(" · ")) : null,
      Z("span", { class: "al-chip" }, [Eo(H.length, "song", "songs"), b.offered ? Eo(b.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), b.status.length && C.push(Z("div", { class: "al-status", role: "status" }, ...b.status)), C.push(Z("div", { class: "al-grow" })), b.asking ? C.push(Z("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : b.primary && C.push(rn({ class: "al-primary", onClick: b.primary.run, disabled: b.busy }, Z("span", { html: Le.playSmall }), b.primary.label)), b.hint && !b.asking && C.push(Z("p", { class: "al-hint" }, b.hint)), b.secondary && !b.asking && C.push(rn({ class: "al-link", onClick: b.secondary.run, disabled: b.busy }, b.secondary.label)), C;
  }
  function Q(b, T) {
    const { songs: H, current: C, started: ot, own: X, out: Et, waiting: k } = T, m = b.player, q = e.radio(), nt = [];
    nt.push(Z("div", { class: "al-listhead" }, Z("span", {}, Z("b", {}, m.title), ` · ${Eo(H.length, "song", "songs")}`), _(b)));
    const at = f(m.cover), vt = "album:" + m.cover;
    at && !ln.has(vt) && (ln.set(vt, at), Vf(at).then(($t) => {
      $t !== at && (ln.set(vt, $t), P());
    }));
    const te = at ? ln.get(vt) || at : "";
    return nt.push(Z("ol", { class: "al-tracks" }, ...H.map(($t, Dt) => {
      const Nt = String($t.id) === C, ee = hw(String($t.id), Nt && ot ? X : void 0);
      return Z("li", {}, rn(
        { class: "al-track" + (Nt ? " is-on" : ""), "aria-label": `Play ${$t.title || "#" + $t.id}`, "aria-current": Nt ? "true" : void 0, disabled: Et || k, onClick: () => {
          var ct;
          return (ct = q == null ? void 0 : q.playToken) == null ? void 0 : ct.call(q, $t.id);
        } },
        Z(
          "span",
          { class: "al-th" + (ee ? "" : " is-blank") },
          ee ? Z("img", { src: ee, alt: "", decoding: "async" }) : te ? Z("img", { src: te, alt: "", decoding: "async" }) : null,
          ee ? null : Z("span", { class: "al-n" }, String(Dt + 1)),
          Nt ? Z("span", { class: "al-eq", html: Le.eq }) : null
        ),
        Z("span", { class: "al-tt" }, $t.title || `#${$t.id}`)
      ));
    }))), nt;
  }
  function tt(b) {
    var ee;
    const T = b.player, H = T.tracks.filter((ct) => !ct.hidden), C = e.radio(), ot = x == null ? void 0 : x.nowPlaying, X = ot && T.tracks.some((ct) => String(ct.id) === String(ot.tokenId)) ? String(ot.tokenId) : null, Et = X ? T.tracks.find((ct) => String(ct.id) === X) : null, k = b.plays === 0 && !b.playsComing, m = !!b.playsComing && !b.plays, q = !!(x != null && x.playing) && !!X, nt = x == null ? void 0 : x.heart, at = X ? (ee = C == null ? void 0 : C.getPosition) == null ? void 0 : ee.call(C) : null;
    X && (q || ((at == null ? void 0 : at.current) ?? 0) > 0.5) && (j = T.id);
    const vt = !!X && j === T.id;
    z && z !== X && (z = null);
    const te = vt ? String((ot == null ? void 0 : ot.cover) || "") : "", $t = !!te && z === X, Nt = [A(T, !k, { song: $t ? "" : te, paused: vt && !q, flip: te ? () => {
      z = z === X ? null : X, P();
    } : void 0, flipped: $t })];
    if (Nt.push(Z(
      "div",
      { class: "al-now" },
      Z(
        "div",
        { class: "al-now-t" },
        Z("div", { class: "al-song" }, Et ? Et.title || (ot == null ? void 0 : ot.title) || `#${Et.id}` : T.title),
        Z("div", { class: "al-artist" }, Et ? Et.artist || (ot == null ? void 0 : ot.artist) || T.subtitle : T.subtitle || "Press play")
      ),
      X ? rn({ class: "al-icon" + (nt != null && nt.liked ? " is-on" : ""), "aria-label": nt != null && nt.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(nt != null && nt.liked)), disabled: !!(nt != null && nt.pending) || !!(nt != null && nt.locked) || m, onClick: () => {
        var ct;
        return (ct = C == null ? void 0 : C.toggleLike) == null ? void 0 : ct.call(C);
      }, html: nt != null && nt.liked ? Le.heartOn : Le.heart }) : null
    )), k)
      Nt.push(Z(
        "div",
        { class: "al-out" },
        Z("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        Z("p", { class: "al-out-t" }, "You've played this album out"),
        Z("p", { class: "al-out-s" }, "Add plays to keep listening."),
        R(b, !0)
      ));
    else {
      const ct = at != null && at.duration ? Math.min(100, at.current / at.duration * 100) : 0;
      Nt.push(Z(
        "div",
        { class: "al-prog" },
        Z("div", { class: "al-bar" }, Z("i", { style: `width: ${ct}%` })),
        Z("div", { class: "al-times" }, Z("span", {}, Ma((at == null ? void 0 : at.current) || 0)), Z("span", {}, at != null && at.duration ? Ma(at.duration) : "–:––"))
      ));
    }
    return Nt.push(Z(
      "div",
      { class: "al-ctl" + (k || m ? " is-off" : "") },
      rn({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: k || m, onClick: () => {
        var ct;
        return (ct = C == null ? void 0 : C.prev) == null ? void 0 : ct.call(C);
      }, html: Le.prev }),
      rn({ class: "al-play", "aria-label": q ? "Pause" : "Play", disabled: k || m, onClick: () => {
        var ct;
        return (ct = C == null ? void 0 : C.playPause) == null ? void 0 : ct.call(C);
      }, html: q ? Le.pause : Le.play }),
      rn({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: k || m, onClick: () => {
        var ct;
        return (ct = C == null ? void 0 : C.next) == null ? void 0 : ct.call(C);
      }, html: Le.next })
    )), b.status.length && Nt.push(Z("div", { class: "al-status", role: "status" }, ...b.status)), Nt.push(...Q(b, { songs: H, current: X, started: vt, own: te, out: k, waiting: m })), Nt.push(Z("div", { class: "al-grow" })), Nt.push(rn(
      { class: "al-more", "aria-expanded": String(s === "more"), onClick: () => l(s === "more" ? "" : "more") },
      Z("span", {}, "More ", Z("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      Z("span", { html: Le.down })
    )), Nt;
  }
  function R(b, T) {
    const H = Z("div", { class: "al-topups" + (T ? " al-topups--primary" : "") }), C = T ? [b.topUps[1] ?? b.topUps[0]] : [...b.topUps];
    for (const ot of C) {
      const X = b.myPlays !== void 0 && b.myPlays >= ot && !b.playsComing && !b.busy;
      H.append(rn({ class: "al-topup", disabled: !X, onClick: () => e.topUp(ot) }, T ? `Add ${ot.toLocaleString()} plays` : `+${ot.toLocaleString()}`));
    }
    return T && H.append(rn({ class: "al-link", onClick: () => l("more") }, "Other amounts")), H;
  }
  function K(b) {
    const T = b.myPlays !== void 0 && b.myPlays >= (b.topUps[0] ?? 0), H = Z(
      "div",
      { class: "al-card" },
      Z("div", { class: "al-card-h" }, Z("b", {}, `Add plays to ${b.player.title}`), Z("span", { class: "al-mono" }, b.plays === null || b.plays === void 0 ? "" : `${b.plays.toLocaleString()} left`)),
      R(b, !1),
      Z("p", { class: "al-mute al-small" }, b.playsComing ? "Plays are on their way. Add more once they arrive." : b.myPlays === void 0 ? "Checking My player…" : T ? `Moved from My player · ${Eo(b.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !T && !b.playsComing && b.myPlays !== void 0 ? rn({ class: "al-link", onClick: () => {
        l(""), e.openPlayer();
      } }, "Open My player") : null
    ), C = (X, Et, k, m) => rn(
      { class: "al-row", onClick: m },
      Z("span", { class: "al-row-i", html: X }),
      Z("span", { class: "al-row-t" }, Z("b", {}, Et), Z("small", {}, k)),
      Z("span", { class: "al-row-go", html: Le.right })
    ), ot = Z(
      "div",
      { class: "al-how" + (o ? " is-open" : "") },
      C(Le.info, "How plays work", "Every play counts for the song’s owner", () => {
        o = !o, P();
      }),
      o ? Z("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return Z(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      Z("div", { class: "al-sheet-h" }, Z("b", {}, "More"), rn({ class: "al-icon", "aria-label": "Close", onClick: () => l(""), html: Le.close })),
      b.mode === "open" ? H : null,
      Z(
        "div",
        { class: "al-rows" },
        C(Le.grid, "My music", "Your albums and the radio", () => l("music")),
        C(Le.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          l(""), e.openPlayer();
        }),
        b.canMake ? C(Le.gift, "Albums (admin)", "Make an album and fund copies", () => l("gifts")) : null,
        C(Le.device, "This device", "Backup, history, Stacks wallet, returns", () => l("device")),
        ot
      )
    );
  }
  function L(b) {
    var k, m;
    const T = b.player, H = x == null ? void 0 : x.nowPlaying, C = H && T.tracks.some((q) => String(q.id) === String(H.tokenId)) ? String(H.tokenId) : null, ot = !!(x != null && x.playing) && !!C, X = C ? (m = (k = e.radio()) == null ? void 0 : k.getPosition) == null ? void 0 : m.call(k) : null;
    C && (ot || ((X == null ? void 0 : X.current) ?? 0) > 0.5) && (j = T.id);
    const Et = !!C && j === T.id;
    return Q(b, {
      songs: T.tracks.filter((q) => !q.hidden),
      current: C,
      started: Et,
      own: Et ? String((H == null ? void 0 : H.cover) || "") : "",
      out: b.plays === 0 && !b.playsComing,
      waiting: !!b.playsComing && !b.plays
    });
  }
  function P() {
    const b = i;
    if (r) {
      if (!b || b.mode !== "open") {
        t.hidden = !0, t.replaceChildren(), delete a.dataset.albumlist;
        return;
      }
      M(), t.hidden = !1, a.dataset.albumlist = "1", t.replaceChildren(...L(b));
      return;
    }
    if (!b) {
      t.hidden = !0, t.replaceChildren();
      return;
    }
    M(), t.hidden = !1;
    const T = Z(
      "header",
      { class: "al-top" },
      Z("a", { class: "al-brand", href: "/radio" }, "Xtrata ", Z("b", {}, "Music")),
      b.mode === "open" ? rn({ class: "al-icon", "aria-label": "My music", onClick: () => l("music"), html: Le.grid }) : null
    ), H = Z("div", { class: "al-body al-body--" + b.mode }, ...b.mode === "open" ? tt(b) : N(b));
    t.replaceChildren(T, H, ...s === "more" ? [Z("div", { class: "al-scrim", onClick: () => l("") }), K(b)] : []);
  }
  return {
    render(b) {
      if (r) {
        i = b, P();
        return;
      }
      const T = !!i;
      i = b, !b && (T || s) && (s = "", delete a.dataset.sheet), b ? a.dataset.view = "album" : delete a.dataset.view, b != null && b.asking ? a.dataset.asking = "1" : delete a.dataset.asking, P();
    },
    sheet: () => s,
    setSheet: l
  };
}
const Pk = [
  ["Instagram", /Instagram/],
  ["Threads", /Barcelona/],
  ["Messenger", /Messenger|FB_IAB\/MESSENGER/i],
  ["Facebook", /FBAN|FBAV|FB_IAB|FBIOS|FB4A/],
  ["X", /Twitter/],
  ["TikTok", /BytedanceWebview|musical_ly|TikTok|aweme|Trill/],
  ["LinkedIn", /LinkedInApp/],
  ["Snapchat", /Snapchat/],
  ["Telegram", /Telegram/],
  ["WhatsApp", /WhatsApp/],
  ["LINE", /\bLine\//],
  ["WeChat", /MicroMessenger/],
  ["Discord", /Discord/],
  ["the Google app", /\bGSA\//]
];
function _k(t) {
  for (const [e, n] of Pk) if (n.test(t)) return e;
  return null;
}
const pw = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), gw = (t) => /Android/.test(t);
function Uk(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : pw(e) ? "x-safari-" + n.href : gw(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const Hk = (t) => pw(t) ? "Safari" : gw(t) ? "Chrome" : "your browser", Bi = "Xtrata Music Wallet", Ok = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function C0(t, e = (n) => n) {
  var s, o, a;
  if (t.mainConnected ?? !!t.main) return [];
  if (t.step === "off" || t.step === "elsewhere") return [];
  if (t.gate && (t.gate.enabled === !1 || t.gate.here === !1)) return [];
  if (t.step === "unsupported")
    return ((s = t.gate) == null ? void 0 : s.passkeyOnly) || t.linked || ((o = t.others) == null ? void 0 : o.length) ? [{ action: null, label: Bi, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], i = [...new Set([t.standIn, t.linked, ...t.others ?? []].filter((c) => !!c))];
  for (const c of i) {
    const u = t.standIn === c && Ok.has(t.step);
    r.push({
      action: "linked",
      main: c,
      label: `${Bi} · ${e(c)}`,
      detail: u ? "Open on this device." : `Face ID or your fingerprint. Plays and likes count for ${e(c)}.`
    });
  }
  if ((a = t.gate) != null && a.passkeyOnly && t.solo)
    switch (t.step) {
      case "intro":
        r.push({ action: "create", label: Bi, detail: "Make one with Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "locked":
        r.push({ action: "unlock", label: Bi, detail: "Open the one on this device with Face ID or your fingerprint." });
        break;
      case "loading":
        r.push({ action: "show", label: Bi, detail: "Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "connect":
      case "not-invited":
        break;
      default:
        r.push({ action: "show", label: Bi, detail: "Open on this device." });
    }
  return r;
}
const T0 = document.getElementById("ppp");
T0 && Dk(T0);
function Dk(t) {
  var We;
  const e = jw(), n = (d) => t.querySelector(d), r = n(".ppp-frame");
  let i = null;
  const s = async (d, E) => {
    const $ = await fetch(d, { cache: "no-store", ...E, signal: AbortSignal.timeout(15e3) }), h = await $.json().catch(() => ({}));
    if (!$.ok) throw new Error((h == null ? void 0 : h.error) || `Request failed (${$.status}).`);
    return h;
  }, o = y6({
    now: Date.now,
    main: () => {
      const d = e.load();
      return d.isConnected && d.network === "mainnet" ? d.address : void 0;
    },
    config: (d) => s("/radio/listening-wallet/config?main=" + encodeURIComponent(d || "")),
    links: async (d) => (await s("/radio/listening-wallet/link?main=" + encodeURIComponent(d))).links ?? [],
    mainOf: async (d) => {
      var $;
      const E = (await s("/radio/listening-wallet/link?listening=" + encodeURIComponent(d))).links;
      return (($ = E == null ? void 0 : E.find((h) => h.listening === d)) == null ? void 0 : $.main) ?? null;
    },
    saveLink: async (d) => {
      await s("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(d) });
    },
    bridge: async (d) => {
      i = document.createElement("iframe"), i.title = "Xtrata listening wallet", i.setAttribute("allow", `publickey-credentials-get ${d}; publickey-credentials-create ${d}`), i.referrerPolicy = "no-referrer";
      const E = new Promise((dt, yt) => {
        i.addEventListener("load", () => dt(), { once: !0 }), setTimeout(() => yt(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      i.src = d + "/", r.replaceChildren(i), await E;
      const $ = new Mw({ walletOrigin: d, frame: i, timeoutMs: 30 * 6e4 }), h = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), rt = (dt, yt) => h.has(dt) ? $.request(dt, yt) : Promise.race([
        $.request(dt, yt),
        new Promise((ae, ke) => setTimeout(() => ke(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await rt("listening.status"), { request: rt };
    },
    chain: {
      verify: X5,
      balance: Z5,
      account: Y5,
      owner: Q5,
      broadcast: J5,
      transaction: t6,
      confirmedNonce: async (d) => {
        const E = await vs(`/v2/accounts/${d}?proof=0`);
        if (!Number.isSafeInteger(E == null ? void 0 : E.nonce) || E.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(E.nonce);
      }
    },
    signWithMain: (d, E) => c0({ ...E, network: "mainnet", stxAddress: d }),
    deposit: (d, E, $) => new Promise((h, rt) => r0({
      recipient: E,
      amount: $.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: d,
      network: new Il(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (dt) => h(dt.txId || ""),
      onCancel: () => rt(new Error("Deposit cancelled. Nothing was sent.")),
      onError: rt
    })),
    validate: e6,
    tabLock: (d) => new Promise((E) => {
      const $ = navigator.locks;
      if (!($ != null && $.request)) {
        E(!0);
        return;
      }
      $.request("xtrata-ppp:" + d, { ifAvailable: !0 }, async (h) => {
        E(!!h), h && await new Promise(() => {
        });
      });
    }),
    store: {
      get: (d) => {
        try {
          return localStorage.getItem(d);
        } catch {
          return null;
        }
      },
      set: (d, E) => {
        try {
          localStorage.setItem(d, E);
        } catch {
        }
      }
    },
    changed: () => ve(o.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (d) => {
      var E, $;
      return a.funder(d, () => a6(d, vs), !!(($ = (E = o.snapshot().gate) == null ? void 0 : E.gifts) != null && $.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (d) => {
      const E = await s("/radio/gift/for?wallet=" + encodeURIComponent(d)), $ = E == null ? void 0 : E.gift;
      if (!$) return null;
      if (typeof $.returnTo != "string" || typeof $.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: $.returnTo, from: typeof $.from == "string" ? $.from : null, source: String($.source ?? ""), amount: String($.amount ?? "0"), treasury: $.treasury, state: $.state === "sending" ? "sending" : "arrived", player: $.player ?? null };
    },
    history: (d, E) => u6(d, ($) => vs($), E),
    likesChanged: () => {
      var d, E;
      (E = (d = window.XtrataRadio) == null ? void 0 : d.refreshLikes) == null || E.call(d);
    },
    likeState: async (d, E) => {
      const $ = await s("/radio/chain-likes?" + new URLSearchParams({ wallet: d, ids: String(E) })), h = Array.isArray($ == null ? void 0 : $.rows) ? $.rows.find((rt) => (rt == null ? void 0 : rt.id) === E) : null;
      if (!h || typeof h.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: h.liked, by: Array.isArray(h.by) ? h.by.filter((rt) => typeof rt == "string") : h.liked ? [d] : [] };
    },
    likeSent: (d, E) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: d, liked: E } })),
    nameOf: (d) => Dt(d) ?? void 0,
    likeConfirmed: (d, E) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: d, liked: E } })),
    likeFailed: (d) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: d } }))
  }), a = xk({
    json: s,
    main: () => {
      const d = e.load();
      return d.isConnected && d.network === "mainnet" ? d.address : void 0;
    },
    pay: (d, E, $, h) => new Promise((rt, dt) => r0({
      recipient: E,
      amount: $.toString(),
      memo: h,
      stxAddress: d,
      network: new Il(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (yt) => rt(yt.txId || ""),
      onCancel: () => dt(new Error("Gift cancelled. Nothing was sent.")),
      onError: dt
    })),
    sign: (d, E) => c0({ ...E, network: "mainnet", stxAddress: d }),
    giftSent: (d, E) => o.giftSent(d, E),
    claiming: (d) => o.giftClaiming(d),
    album: { bind: (d) => o.bindAlbum(d), arrived: async (d, E, $, h) => {
      c.invalidate(), await o.albumArriving(d, E, $, h);
    } },
    who: (d) => ct(d),
    changed: () => ve(o.snapshot()),
    store: {
      get: (d) => {
        try {
          return localStorage.getItem(d);
        } catch {
          return null;
        }
      },
      set: (d, E) => {
        try {
          E === null ? localStorage.removeItem(d) : localStorage.setItem(d, E);
        } catch {
        }
      }
    },
    now: Date.now
  }), c = Tk({
    json: s,
    open: (d) => {
      o.openAlbum(d);
    },
    store: {
      get: (d) => {
        try {
          return localStorage.getItem(d);
        } catch {
          return null;
        }
      },
      set: (d, E) => {
        try {
          E === null ? localStorage.removeItem(d) : localStorage.setItem(d, E);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => ve(o.snapshot())
  }), u = (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), f = u ? document.getElementById("album") : null, l = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (d) => void o.topUpAlbum(d),
    openPlayer: () => void o.openAlbum(0)
  }, w = f ? L0(f, l) : null, p = document.getElementById("albumList"), x = p ? L0(p, l, { list: !0 }) : null, S = "xtrata.radio.album.last.v1", M = () => {
    try {
      const d = JSON.parse(localStorage.getItem(S) || "null");
      return d && typeof d.root == "string" && Number.isSafeInteger(d.slot) && d.slot > 0 && d.player && Array.isArray(d.player.tracks) ? d : null;
    } catch {
      return null;
    }
  };
  let j = "";
  const z = (d) => {
    const E = JSON.stringify(d);
    if (E !== j) {
      j = E;
      try {
        localStorage.setItem(S, E);
      } catch {
      }
    }
  };
  let A = null;
  window.XtrataRadioLikeHandler = (d) => {
    var $;
    if (!d || !Number.isSafeInteger(d.song) || d.song < 0) return !1;
    ($ = o.snapshot().likeFunds) != null && $.album && (P = !0), De();
    const E = xe(d.song, { title: d.title, artist: d.artist });
    return o.heart({ song: d.song, title: E.title || void 0, artist: E.artist || void 0, likedBy: Array.isArray(d.likedBy) ? d.likedBy : void 0 });
  };
  let _;
  window.XtrataRadioListeningIdentity = () => {
    const d = o.snapshot();
    return d.solo && d.step !== "off" && d.step !== "elsewhere" ? d.listening : void 0;
  };
  const N = (d) => {
    var $, h;
    const E = window.XtrataRadioListeningIdentity();
    E !== _ && (_ = E, (h = ($ = window.XtrataRadio) == null ? void 0 : $.refreshLikes) == null || h.call($));
  };
  let Q = "", tt = null, R = !1, K = !1;
  const L = (d, E) => {
    var yn, wn, Rt, we, Pe, rr, In;
    const $ = window.XtrataRadio;
    if (!($ != null && $.setGiftPlayer) || !($ != null && $.setGiftStop)) return;
    const h = d.step === "off" || d.step === "elsewhere" ? null : ((yn = d.gift) == null ? void 0 : yn.player) ?? null, rt = h ? h.id + ":" + h.cover + ":" + h.tracks.map((en) => en.id).join(",") : "";
    rt !== Q && ($.setGiftPlayer(h ? { id: h.id, title: h.title, subtitle: h.subtitle, tracks: Fi(h).map((en) => en.id), hidden: ((wn = yk(h)) == null ? void 0 : wn.id) ?? null, cover: h.cover } : null), Q = rt);
    const dt = E.depositPending && d.step === "fund" && ((Rt = d.giftStop) == null ? void 0 : Rt.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : d.giftStop, yt = (dt == null ? void 0 : dt.text) ?? null;
    yt !== tt && ($.setGiftStop(yt), tt = yt);
    const ae = (dt == null ? void 0 : dt.reason) === "arriving";
    ae !== K && ((we = $.setGiftWait) == null || we.call($, ae), K = ae);
    const ke = !!h && !!((Pe = d.albumLock) != null && Pe.locked);
    ke !== R && ((rr = $.setGiftLock) == null || rr.call($, ke), R = ke), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(d.step) && ((In = $.forgetWallets) == null || In.call($));
  };
  let P = !1;
  const b = /* @__PURE__ */ new Map(), T = (d) => {
    if (!(d.step === "fund" && !d.depositPending && !!d.gift && !!d.listening && d.balance === 0n && !d.entries.some((h) => h.kind === "play") && (d.brandNew || d.createdHere))) return null;
    let $ = b.get(d.listening);
    return $ === void 0 && ($ = Date.now(), b.set(d.listening, $)), Date.now() - $ < gc ? $ : null;
  }, H = (d) => d.step === "fund" && !d.depositPending && !!d.gift && d.balance === 0n && !d.entries.some((E) => E.kind === "play") && !!d.listening && b.has(d.listening), C = (d) => d ? d.slice(0, 6) + "…" + d.slice(-4) : "", ot = (d) => {
    const E = o.snapshot().playCost || 350n;
    return d > je ? Number((d - je) / E) : 0;
  }, X = (d) => (Number(d) / 1e6).toFixed(d < 1000n ? 6 : 4), Et = (d) => {
    const E = Math.round((Date.now() - d) / 6e4);
    return E < 1 ? "now" : E < 60 ? `${E}m` : E < 1440 ? `${Math.round(E / 60)}h` : `${Math.round(E / 1440)}d`;
  }, k = (d) => `https://explorer.hiro.so/txid/${d}?chain=mainnet`, m = (d, E = "", $ = "") => {
    const h = document.createElement(d);
    return E && (h.textContent = E), $ && (h.className = $), h;
  }, q = (d, E, $ = "") => {
    const h = m("button", d, $);
    return h.type = "button", h.onclick = E, h;
  }, nt = (d, E) => {
    const $ = m("a", d);
    return $.href = E, $.target = "_blank", $.rel = "noopener", $;
  };
  let at = null, vt = location.hash === "#give";
  vt && history.replaceState(null, "", location.pathname + location.search);
  let te = !1;
  const $t = J6((d) => Q6({ address: d, network: "mainnet" }), () => ve(o.snapshot())), Dt = (d) => $t.get(d), Nt = _k(navigator.userAgent), ee = (d, E) => {
    const $ = navigator.userAgent, h = Hk($), rt = `${location.origin}${location.pathname}${E ? `#gift=${E}` : ""}`, dt = [m("p", `You are in ${d}'s built-in browser, where passkeys often do not work. Open this page in ${h} to make your listening wallet${E ? " and claim your gift" : ""}.`, "ppp-warn")], yt = m("div", "", "ppp-open-row"), ae = Uk(rt, $);
    if (ae) {
      const ke = m("a", `Open in ${h}`, "primary ppp-open-in");
      ke.href = ae, ke.dataset.homeAction = "radio:open-in-browser", yt.append(ke);
    }
    return yt.append(Hi("copy-page-link", "Copy link", () => rt, ae ? "" : "primary", () => ve(o.snapshot()))), dt.push(yt, m("p", `If that does not open ${h}, use ${d}'s menu (••• or ⋮) and choose "Open in ${h === "your browser" ? "browser" : h}", or paste the copied link there.`, "ppp-mute")), dt;
  }, ct = (d) => Dt(d) ?? C(d), jt = (d) => d.slice(0, 2).map(ct).join(" and ") + (d.length > 2 ? ` and ${d.length - 2} more` : ""), Je = /* @__PURE__ */ new Map();
  let ne = !1;
  const tn = (d) => !d || /^(?:Inscription )?#\d+$/.test(d.trim()), De = () => {
    ne || (ne = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((d) => d.ok ? d.json() : null).then((d) => {
      for (const E of Array.isArray(d == null ? void 0 : d.tracks) ? d.tracks : []) {
        const $ = Number(E == null ? void 0 : E.id);
        Number.isSafeInteger($) && Je.set($, { title: typeof E.title == "string" ? E.title : void 0, artist: typeof E.artist == "string" ? E.artist : void 0 });
      }
      ve(o.snapshot());
    }).catch(() => {
      ne = !1;
    }));
  }, xe = (d, E) => {
    const $ = Je.get(d), h = ek(d, [$ == null ? void 0 : $.title, E == null ? void 0 : E.title].find((dt) => !tn(dt)) || ""), rt = tk(d, ($ == null ? void 0 : $.artist) || (E == null ? void 0 : E.artist) || "");
    return { title: h, artist: rt };
  }, qe = (d) => {
    const { title: E, artist: $ } = xe(d.song, d);
    return E ? `“${E}”${$ ? ` — ${$}` : ""}` : `Song #${d.song}${$ ? ` — ${$}` : ""}`;
  }, Me = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, ze = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function Se(d) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(d.step) ? ["", ""] : d.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : d.step === "over" ? ["TOO MUCH", "bad"] : d.step === "locked" ? ["LOCKED", "mute"] : d.step === "intro" || d.step === "link" ? ["", ""] : d.step === "fund" ? d.depositPending ? ["ON ITS WAY", "warn"] : d.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : d.payingOn && d.session && d.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function zt(d, E, $ = "", h) {
    const rt = m("dt", d), dt = m("dd", E, $);
    return h && dt.append(" ", h), [rt, dt];
  }
  const Re = document.getElementById("ppp-top"), gn = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Ne = () => {
    var E;
    const d = window.XtrataRadioConnectStacks;
    d ? d() : (E = document.getElementById("radio-wallet-connect")) == null || E.click();
  }, Ee = () => {
    var E;
    const d = o.snapshot();
    if (d.step === "connect" || d.step === "wrong-wallet") {
      Ne();
      return;
    }
    if (d.step === "elsewhere" && ((E = d.gate) != null && E.radioUrl)) {
      location.href = d.gate.radioUrl;
      return;
    }
    d.step === "locked" && !d.armed && !d.busy && o.unlock(), d.step === "ready" && !d.payingOn && !d.busy && o.switchOn(), gn();
  };
  Re && (Re.onclick = Ee);
  const v = (d, E, $, h = "") => d.standIn && !d.mainConnected ? q(`Connect ${ct(d.standIn)} to add STX`, Ne, h) : q(E, $, h), O = (d) => {
    o.useLinked(d).then(() => gn());
  };
  let D = null;
  const G = () => {
    const d = C0(o.snapshot(), ct);
    return d.length ? D || (D = new Promise((E) => {
      var wn;
      const $ = m("dialog", "", "ppp-connect");
      $.setAttribute("aria-labelledby", "ppp-connect-title");
      let h = null;
      const rt = (Rt) => {
        h = Rt, $.close();
      };
      $.addEventListener("close", () => {
        $.remove(), D = null, E(h);
      }), $.addEventListener("click", (Rt) => {
        Rt.target === $ && rt(null);
      });
      const dt = (Rt, we, Pe, rr, In = !1) => {
        const en = m("button", "", "ppp-connect__opt " + Pe);
        return en.type = "button", en.disabled = In, en.onclick = rr, en.append(m("b", Rt), m("span", we)), en;
      }, yt = m("h2", "Connect", "ppp-connect__title");
      yt.id = "ppp-connect-title";
      const ae = d.map((Rt) => dt(Rt.label, Rt.detail, "is-music", () => {
        if (rt("music"), Rt.action === "linked" && Rt.main) {
          O(Rt.main);
          return;
        }
        const we = C0(o.snapshot(), ct).find((Pe) => Pe.action !== "linked");
        (we == null ? void 0 : we.action) === "create" ? o.create() : (we == null ? void 0 : we.action) === "unlock" && o.unlock(), gn();
      }, !!Rt.disabled)), ke = dt("Xverse or Leather", "A Stacks wallet you already have.", "is-stacks", () => rt("stacks")), yn = q("Cancel", () => rt(null), "quiet ppp-connect__cancel");
      $.append(yt, ...ae, ke, yn), document.body.appendChild($), $.showModal(), (wn = ae.find((Rt) => !Rt.disabled)) == null || wn.focus();
    }), D) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = G;
  function ht(d) {
    if (!Re) return;
    const E = (h, rt, dt) => {
      Re.hidden = !1, Re.className = "ppp-top" + (rt ? " is-" + rt : ""), Re.replaceChildren(m("span", "", "dot"), document.createTextNode(h)), Re.title = dt;
    }, $ = d.session ? Math.min(d.session.playsLeft, d.playsLeft) : 0;
    switch (d.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        Re.hidden = !0;
        return;
      case "elsewhere":
        return E("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        Re.hidden = !0;
        return;
      case "intro":
        return E("Start listening", "", "Make your player with your face or fingerprint: no app or account needed");
      case "wrong-wallet":
        return E(`Connect ${ct(d.linked)}`, "warn", `This device's listening wallet belongs to ${ct(d.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return E("Unlock", "", "One tap with your face or fingerprint");
      case "link":
        return E("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return d.depositPending ? E("Plays on their way", "quiet", "Plays start by themselves when they land") : E(d.entries.some((h) => h.kind === "play") ? "No plays left · add plays" : "Add plays", "warn", "Add plays to keep listening");
      case "over":
        return E("Too much in your player", "warn", "Return the extra to keep counting plays");
      case "loading":
        return E("Xtrata Music", "quiet", "Checking your player");
      case "ready":
        return d.payingOn && $ > 0 ? E(`${$.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : E("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const it = document.getElementById("pppNudge"), Yt = document.getElementById("onair");
  (We = it == null ? void 0 : it.querySelector("button")) == null || We.addEventListener("click", () => Ee());
  const Zt = {
    connect: "Plays are not counted",
    intro: "Plays are not counted",
    locked: "Locked · plays are not counted",
    "wrong-wallet": "Wrong wallet connected · plays are not counted",
    link: "Plays are not counted yet",
    fund: "No plays yet",
    over: "Paused · plays are not counted",
    ready: "Plays are off"
  }, re = {
    elsewhere: "Open",
    connect: "Connect",
    "wrong-wallet": "Switch wallet",
    intro: "Start",
    locked: "Unlock",
    link: "Finish setup",
    fund: "Add plays",
    over: "Fix it",
    ready: "Switch on"
  };
  function ye(d) {
    if (d.step === "loading") return;
    const E = d.session ? Math.min(d.session.playsLeft, d.playsLeft) : 0, $ = d.step === "ready" && d.payingOn && E > 0, h = d.step === "fund" && d.depositPending, rt = d.step === "elsewhere", dt = $ || h || rt ? "" : Zt[d.step] ?? "", yt = $ ? "on" : rt ? "free" : dt ? "off" : "";
    yt ? document.documentElement.dataset.ppp = yt : delete document.documentElement.dataset.ppp, Yt && (Yt.hidden = !yt || yt === "free", Yt.querySelector(".onair-sub").textContent = $ ? `${E.toLocaleString()} plays left` : "Plays off"), it && (it.hidden = yt !== "off" && yt !== "free", it.classList.toggle("is-free", yt === "free"), yt === "free" ? (it.querySelector(".nudge-t").textContent = "You’re on the free player", it.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", it.querySelector("button").textContent = "Get a player") : yt === "off" && (it.querySelector(".nudge-t").textContent = dt, it.querySelector(".nudge-s").textContent = "Every play you count goes to the song’s owner, on-chain.", it.querySelector("button").textContent = re[d.step] ?? "Start"));
  }
  let ue = "";
  function Ae(d) {
    const E = m("div", "", "ppp-pick");
    d.funderMultiple && d.returnToKind === "funder" && E.append(m("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), d.returnToKind === "funder" && E.append(m("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const $ = m("input");
    $.type = "text", $.placeholder = "SP… address to send returns to", $.autocomplete = "off", $.spellcheck = !1, $.setAttribute("aria-label", "Address to return funds to"), $.value = ue, $.oninput = () => {
      ue = $.value;
    };
    const h = q(d.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress($.value), ue = "";
    }, "tiny");
    return E.append($, " ", h), d.returnToKind === "chosen" && E.append(" ", q("Back to the funder", () => o.clearReturnAddress(), "tiny")), E;
  }
  const It = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function At() {
    const d = m("p", It + " ", "ppp-mute");
    return d.append(nt("Xverse", "https://www.xverse.app/download"), " · ", nt("Leather", "https://leather.io/install-extension")), d;
  }
  let qt = "";
  const Qt = (d) => {
    const E = document.documentElement, $ = d.solo && !d.main ? d.listening ? C(d.listening) : "new" : "", h = S6() ? "1" : "", rt = d.standIn && !d.mainConnected ? ct(d.standIn) : "";
    `${$}|${h}|${rt}` !== qt && (qt = `${$}|${h}|${rt}`, $ ? E.dataset.pppSolo = $ : delete E.dataset.pppSolo, rt ? E.dataset.pppAs = rt : delete E.dataset.pppAs, h ? E.dataset.pppWalletInstalled = h : delete E.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const d of [1500, 4e3, 9e3]) setTimeout(() => ve(o.snapshot()), d);
  function fe(d, E = "") {
    const $ = m("div", "", "ppp-topup"), h = oe(d);
    $.append(m("span", "Add plays from My player: ", "ppp-mute"));
    for (const rt of ja) {
      const dt = q(`+${rt.toLocaleString()}`, () => void o.topUpAlbum(rt), E);
      dt.disabled = h === void 0 || h < rt || d.depositPending || !!d.busy, $.append(dt);
    }
    return h !== void 0 && h < ja[0] && $.append(m("p", "My player needs plays first (switch to My player above).", "ppp-mute")), $;
  }
  const oe = (d) => {
    var h;
    const E = (h = d.likeFunds) == null ? void 0 : h.balance;
    if (E === void 0 || !d.playCost) return;
    const $ = E - je - 6000n;
    return $ > 0n ? Number($ / d.playCost) : 0;
  };
  function Hn(d) {
    const E = d.likeFunds;
    if (!E || !E.album || !E.low && !E.pending) return [];
    if (E.low || (P = !1), E.low && !P) return [];
    const $ = m("div", "", "ppp-pick ppp-lowbox");
    if (!E.low) {
      if (!E.txid) return [];
      const rt = m("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return E.txid && rt.append(nt("View", k(E.txid))), $.append(rt), [$];
    }
    $.append(m("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), $.append(m("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), $.append(m("p", E.address, "ppp-addr-full"));
    const h = m("div", "", "ppp-open-row");
    if (h.append(Hi("copy-likes-address", "Copy address", () => E.address, "primary", () => ve(o.snapshot()))), E.main && !d.solo) {
      const rt = Ds - (E.balance ?? 0n);
      rt > 0n && h.append(v(d, `Pay ${pr(rt)} STX from my wallet`, () => void o.topUpLikes(), "primary"));
    }
    return $.append(h), $.append(m("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [$];
  }
  const kn = (d) => {
    const E = m("div", "", "ppp-wait");
    E.dataset.since = String(d.since), E.dataset.grace = String(d.graceMs), E.setAttribute("role", "progressbar"), E.setAttribute("aria-label", "Your plays are arriving");
    const $ = m("p", "", "ppp-wait-t"), h = m("div", "", "ppp-wait-track");
    return h.append(m("div", "", "ppp-wait-fill")), E.append($, h), Gr(E), E;
  };
  function Gr(d) {
    const E = Number(d.dataset.since), $ = Number(d.dataset.grace) || 6e4, h = Math.max(0, Date.now() - E), rt = d.querySelector(".ppp-wait-fill"), dt = d.querySelector(".ppp-wait-t");
    if (h < $) {
      const yt = Math.ceil(($ - h) / 1e3);
      rt.style.width = Math.max(4, Math.min(95, h / $ * 100)).toFixed(0) + "%", dt.textContent = `Your plays are arriving… usually about a minute · ${yt}s`, d.classList.remove("is-long"), d.setAttribute("aria-valuenow", String(Math.round(h / $ * 100)));
    } else
      rt.style.width = "", dt.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", d.classList.add("is-long"), d.removeAttribute("aria-valuenow");
  }
  let Ls = 0;
  setInterval(() => {
    const d = document.querySelectorAll(".ppp-wait");
    if (!d.length) {
      Ls = 0;
      return;
    }
    d.forEach(Gr), ++Ls % 10 === 0 && ve(o.snapshot());
  }, 1e3);
  let Kr = null;
  function wi(d) {
    if (d.step === "loading" && Kr !== null) return;
    const $ = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(d.step) || !!d.busy || d.armed || !!a.pendingCode() && !["ready", "fund", "over"].includes(d.step);
    $ !== Kr && (Kr = $, $ ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function ve(d) {
    var I, V, J, bt, F, gt, mt, xt, Pt, Oe, nn, Ke, cn, qr, Qo;
    if (A && ["ready", "fund", "over"].includes(d.step) && !d.busy) {
      const W = A;
      A = null, d.root === W.root && d.slot !== W.slot && o.openAlbum(W.slot);
    }
    const E = a.inProgress(d), $ = T(d), h = E && d.step === "fund" ? { ...d, depositPending: !0 } : $ !== null ? { ...d, depositPending: !0, arrival: { since: $, graceMs: gc } } : d, rt = h.error === yc;
    if (N(), L(d, h), wi(h), Qt(h), !E && a.inProgress(d) || (ht(h), ye(h), t.hidden = h.step === "off", t.hidden)) return;
    const [dt, yt] = Se(h), ae = n(".ppp-state");
    ae.textContent = dt, ae.className = "ppp-state" + (yt ? " ppp-state--" + yt : ""), ae.hidden = !dt;
    const ke = !!h.busy || h.armed, yn = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(h.step) && (ke || !["intro", "loading"].includes(h.step));
    r.hidden = !yn, r.classList.toggle("ppp-frame--rest", !ke && !te);
    const wn = n(".ppp-frame-label");
    wn.hidden = !0;
    const Rt = w6(h) ?? at;
    at = Rt;
    const we = "xtrata.radio.ppp.heard.v1", Pe = (() => {
      try {
        return localStorage.getItem(we) === "1";
      } catch {
        return !1;
      }
    })();
    if (!Pe && h.entries.some((W) => W.kind === "play"))
      try {
        localStorage.setItem(we, "1");
      } catch {
      }
    const rr = Pe || h.slot > 0 && ((((I = h.likeFunds) == null ? void 0 : I.balance) ?? 0n) > 0n || c.count() > 1), In = m6({ ...h, heard: rr }, Rt);
    n(".ppp-badge").hidden = !In;
    const en = n(".ppp-steps"), Ir = n(".ppp-stage");
    en.hidden = Ir.hidden = !In, Rt && In && (en.replaceChildren(...Bu(h.solo).map((W, lt) => {
      const $e = m("li", "", lt < Rt.at ? "done" : lt === Rt.at ? Rt.blocked ? "now blocked" : "now" : "");
      return $e.append(m("span", lt < Rt.at ? "✓" : String(lt + 1), "n"), W), lt === Rt.at && $e.setAttribute("aria-current", "step"), $e;
    })), Ir.textContent = Rt.caption, Ir.className = "ppp-stage " + (Rt.at >= Bu(h.solo).length ? "ppp-ok" : Rt.blocked ? "ppp-bad" : "ppp-cyan"));
    const Lr = n(".ppp-facts"), Ge = [];
    h.main && ((V = h.gate) != null && V.here) && !h.solo && Ge.push(...zt("Your wallet", ct(h.main), "ppp-addr-short"));
    const Vn = () => {
      if (!h.listening) return;
      const W = Hi("copy-listening", "Copy", () => h.listening || "", "tiny", () => ve(o.snapshot()));
      Ge.push(...zt(h.slot > 0 ? "Album wallet" : h.linked ? "My player (technical)" : "My player wallet", C(h.listening), "ppp-addr-short", W));
    };
    if (h.linked || Vn(), h.listening && h.step !== "intro")
      if (h.linked)
        Ge.push(...zt("Credited to", `${ct(h.linked)} · plays, likes and returns`, h.linked === h.main || h.solo ? "ppp-ok" : "ppp-warn")), Vn();
      else if (h.solo) {
        h.creditedTo && Ge.push(...zt("Credited to", `${ct(h.creditedTo)} · plays and likes`, "ppp-ok"));
        const W = h.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : h.returnTo ? `${ct(h.returnTo)} · ${h.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : h.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Ge.push(...zt("Returns go to", h.gift ? W : h.returnTo && !Dt(h.returnTo) ? W.replace(C(h.returnTo), h.returnTo) : W, h.returnTo && !h.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Ge.push(...zt("Linked to", "not linked yet", "ppp-warn"));
    if (h.linkedListening.length && ((J = h.gate) != null && J.here)) {
      const W = h.linkedListening.map((lt) => C(lt) + (lt === h.listening ? " (this one)" : "")).join(", ");
      Ge.push(...zt(h.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", W, "ppp-addr-short"));
    }
    if (h.balance !== void 0 && ["fund", "ready", "over"].includes(h.step)) {
      const W = h.step === "fund" && h.depositPending ? "ppp-mute" : h.balanceState === "ok" ? "ppp-ok" : h.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Ge.push(...zt("Balance", `${pr(h.balance)} STX · about ${h.playsLeft.toLocaleString()} plays`, W));
    }
    const sr = h.entries.find((W) => W.kind === "play");
    sr && De(), sr && Ge.push(...zt("Last paid song", `${qe(sr)} → ${ct(sr.recipient)}`, Me[sr.status] || "")), Lr.replaceChildren(...Ge), Lr.hidden = !Ge.length;
    const wt = [], Gt = [], le = [], bn = [], Vr = Mn(BigInt(((bt = h.gate) == null ? void 0 : bt.limits.playFee) ?? "300")), ho = `Each song you listen to for 30 seconds sends ${pr(hc)} STX to whoever holds it, plus a ${pr(Vr - hc)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, xi = !!h.busy;
    switch (h.step) {
      case "elsewhere": {
        if (wt.push(m("p", "Pay artists as you listen.")), (F = h.gate) != null && F.radioUrl) {
          const lt = m("p");
          lt.append(nt("Open the pay-per-play radio →", h.gate.radioUrl)), wt.push(lt);
        }
        Gt.push(m("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (h.linked) {
          const lt = [h.linked, ...h.others];
          wt.push(m("p", lt.length > 1 ? `This device has listening wallets for ${jt(lt)}.` : `This device has a listening wallet for ${ct(h.linked)}.`)), Gt.push(m("p", "Open it with Face ID or your fingerprint: no Stacks wallet needed, and plays and likes still count for that wallet. Or connect a different wallet and it gets a listening wallet of its own. Listening is always free.")), lt.slice(0, 3).forEach(($e, Ie) => le.push(q(`Open ${ct($e)}`, () => O($e), Ie === 0 ? "primary" : "")));
        } else
          wt.push(m("p", "Connect your wallet to pay artists as you listen.")), Gt.push(m("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "wrong-wallet":
        wt.push(m("p", `This device's listening wallet belongs to ${ct(h.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), Gt.push(m("p", `You are connected as ${ct(h.main)}. Listening is still free, and nothing is paid from the listening wallet while this wallet is connected.`)), Gt.push(m("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), le.push(q("Switch wallet", Ne, "primary"));
        break;
      case "not-invited":
        wt.push(m("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        wt.push(m("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        wt.push(m("p", "Every play counts for the song’s owner, on-chain.")), Gt.push(m("p", ho)), Gt.push(m("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), Gt.push(m("p", h.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !h.solo && h.main && h.others.length ? (wt.push(m("p", `This device already has a listening wallet for ${jt(h.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), Gt.push(m("p", `Otherwise, set up a new listening wallet for ${ct(h.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !h.solo && h.main && Gt.push(m("p", `This is the listening wallet for ${ct(h.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), h.solo && Gt.push(m("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const W = a.liveGift();
        le.push(q(W ? "Claim my gift · no wallet needed" : h.solo ? "Start listening · no wallet needed" : h.others.length && h.main ? `Set up for ${ct(h.main)}` : "Start listening", () => void o.create(), "primary")), !W && !h.solo && h.main && h.others.length && le.push(q("Switch wallet", Ne)), !W && h.solo && le.push(q("I have a Stacks wallet", Ne)), le.push(q("I already have a listening wallet", () => void o.unlock(!0))), W && le.push(q("Not now", () => a.setAside(), "quiet"));
        break;
      case "locked":
        h.armed || (wt.push(m("p", "Locked.", "ppp-mute")), le.push(q("Unlock", () => void o.unlock(), "primary"))), h.standIn ? bn.push(q("Use a different listening wallet", () => void G().then((lt) => {
          lt === "stacks" && Ne();
        }), "quiet")) : bn.push(q("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        wt.push(m("p", `Link to ${ct(h.main)} · free`)), Gt.push(m("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), Gt.push(m("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), le.push(q(h.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        wt.push(m("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (h.depositPending ? h.arrival && wt.push(kn(h.arrival)) : H(h) ? wt.push(m("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (gt = h.gift) != null && gt.player ? wt.push(m("p", "Out of plays · add more to keep listening", "ppp-bad")) : h.entries.length ? wt.push(m("p", "No plays left · add plays to keep counting", "ppp-bad")) : wt.push(m("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / Vr)).toLocaleString()} plays`)), (mt = h.gift) != null && mt.player ? Gt.push(m("p", "This player has no free mode: it carries on by itself once the plays arrive.")) : h.entries.length && Gt.push(m("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), h.payingOn && !h.entries.length && Gt.push(m("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), E ? Gt.push(m("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : h.depositPending ? Gt.push(m("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : h.solo ? (Gt.push(m("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), Gt.push(m("p", h.listening || "", "ppp-addr-full")), h.listening && !h.depositPending && le.push(Hi("copy-address", "Copy my address", () => h.listening || "", "primary", () => ve(o.snapshot())))) : Gt.push(m("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), h.depositPending && h.depositTxid) {
          const lt = m("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          lt.append(nt("View", k(h.depositTxid))), wt.push(lt);
        } else h.allowance > 0n && !h.solo && !h.depositPending && le.push(v(h, `Deposit ${pr(h.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        wt.push(m("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), h.solo && !h.returnTo && (wt.push(m("p", h.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), wt.push(Ae(h))), (!h.solo || h.returnTo) && le.push(q("Return excess", () => void o.returnFunds("excess"), "primary"), q("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (h.payingOn && h.session && h.session.playsLeft > 0) {
          const lt = Math.min(h.session.playsLeft, h.playsLeft);
          wt.push(m("p", `${lt.toLocaleString()} plays left`, "ppp-ok")), Gt.push(m("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), le.push(q("Switch off", () => void o.switchOff()));
        } else
          wt.push(m("p", "Plays are off. Music stays free.", "ppp-mute")), le.push(q("Switch plays on", () => void o.switchOn(), "primary"));
        h.queued && wt.push(m("p", h.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${h.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), h.balanceState === "low" && wt.push(m("p", "Running low on plays", "ppp-warn")), h.depositPending ? wt.push(m("p", "Plays on their way…", "ppp-warn")) : h.allowance > 0n && h.balanceState !== "ok" && !h.solo && le.push(v(h, `Top up ${pr(h.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (h.solo && h.walletCannotSolo && Gt.push(m("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), h.solo && ["fund", "ready"].includes(h.step) && ((h.balance ?? 0n) > 0n && h.slot === 0 && Gt.push(Ae(h)), Gt.push(At()), h.slot === 0 && h.step === "ready" && h.entries.some((W) => W.kind === "play" && W.status === "confirmed"))) {
      const W = m("p", "New to Stacks? ", "ppp-mute");
      W.append(nt("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), wt.push(W);
    }
    if (h.walletOutdated && Gt.push(m("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), h.stuck && (wt.push(m("p", h.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${h.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), le.push(q("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(h.step) && (h.returnTo || h.gift) && (h.balance ?? 0n) > 0n && bn.push(q(h.linked ? "Return all to my wallet" : h.gift ? "Return what is left…" : `Return all to ${ct(h.returnTo)}`, () => void o.returnFunds("all"), "quiet")), h.slot > 0 && ((xt = h.gift) != null && xt.player) && ["ready", "fund"].includes(h.step) && h.giftPlays > 20 && bn.push(fe(h, "quiet")), ["ready", "fund", "link", "over"].includes(h.step) && bn.push(q("Lock", () => void o.lock(), "quiet")), yn && !ke && bn.push(q(te ? "Hide listening wallet box" : "Show listening wallet box", () => {
      te = !te, ve(o.snapshot());
    }, "quiet")), [...le, ...bn].forEach((W) => W.disabled = xi), xi && (le.length = 0), h.balance !== void 0 && ["fund", "ready", "over"].includes(h.step) && !(h.step === "fund" && h.depositPending && h.balance === 0n) && !((Pt = h.gift) != null && Pt.player)) {
      const W = h.balanceState === "ok" ? "ppp-ok" : h.balanceState === "low" ? "ppp-warn" : "ppp-bad", lt = wt.at(0);
      h.step === "ready" && lt ? lt.append(m("span", ` · ${X(h.balance)} STX`, W)) : wt.push(m("p", `Balance ${X(h.balance)} STX`, W));
    }
    if ((Oe = h.gift) != null && Oe.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(h.step)) {
      const W = m("p", "", "ppp-gift");
      W.append(`💿 Album · ${h.gift.player.title}`), h.gift.player.subtitle && W.append(" · ", h.gift.player.subtitle);
      const lt = ["ready", "fund", "over"].includes(h.step) && h.balance !== void 0 ? h.giftPlays === 0 && h.depositPending ? m("span", " · plays on their way", "ppp-warn") : m("span", h.giftPlays === 0 ? " · no plays left" : ` · ${h.giftPlays.toLocaleString()} ${h.giftPlays === 1 ? "play" : "plays"} left`, h.giftPlays === 0 ? "ppp-bad" : h.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      lt && W.append(lt);
      const $e = (nn = wt.at(0)) == null ? void 0 : nn.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (h.step === "ready" && $e && /STX/.test($e.textContent ?? "") && $e.remove(), wt.unshift(W), h.giftPlays <= 20 && ["ready", "fund"].includes(h.step) && !h.depositPending)
        if (h.slot > 0)
          wt.splice(1, 0, m("p", h.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), fe(h, "primary"));
        else {
          const Ie = m("p", h.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          Ie.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), Ie.append(nt("Xverse", "https://www.xverse.app/download"), " and ", nt("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), wt.splice(1, 0, Ie);
        }
    }
    if (h.gift && !h.linked && ["fund", "ready", "over"].includes(h.step) && h.returnPlan.state === "ready") {
      const W = h.returnPlan, lt = m("div", "", "ppp-pick");
      lt.append(m("p", W.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const $e = m("ul", "", "ppp-gift-list");
      W.steps.forEach((Ie, po) => {
        const Tr = Ie.kind === "gift" ? "the unused gift" : Ie.kind === "deposit" ? "what was added to it" : "the rest", mn = m("li");
        mn.append(m("span", `${po + 1}. ${pr(BigInt(Ie.send))} STX · ${Tr}`, "t"), m("span", Ie.to ? ` → ${ct(Ie.to)}` : " → choose an address below", Ie.to ? "ppp-mute" : "ppp-warn")), $e.append(mn);
      }), lt.append($e), W.kept && lt.append(m("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), W.steps.some((Ie) => !Ie.to) && lt.append(Ae(h)), lt.append(q(W.steps.length > 1 ? `Confirm part 1 of ${W.steps.length}` : "Confirm and return", () => void o.returnFunds("all"), "primary")), wt.push(lt);
    }
    const On = $n(h), de = u ? On : null, Si = a.banner(d, { bare: !!de }), Ei = Nt && (a.pendingCode() || ["intro", "locked", "unsupported"].includes(h.step)) ? ee(Nt, a.pendingCode()) : [];
    de || (wt.unshift(...Si), wt.push(...Hn(h)), wt.unshift(...Ei)), h.solo && h.creditedTo && h.listening && !["intro", "off", "elsewhere", "loading"].includes(h.step) && wt.unshift(m("p", `This is ${ct(h.creditedTo)}'s listening wallet. Plays and likes count for ${ct(h.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), n(".ppp-key").replaceChildren(...wt);
    const ir = document.querySelector(".ppp-switch");
    if (ir) {
      const W = c.latest(), lt = h.slot > 0, $e = ["fund", "ready", "over"].includes(h.step) && (lt || !!W);
      if (ir.hidden = !$e, $e) {
        const Ie = (mn, Jo, g, B) => {
          const U = q("", B, "ppp-tab");
          return U.setAttribute("aria-pressed", String(g)), U.append(m("span", mn, "tt"), m("span", Jo === void 0 ? "…" : `${ot(Jo).toLocaleString()} plays`, "ts")), U.disabled = !!h.busy, U;
        }, po = lt ? ((cn = (Ke = h.gift) == null ? void 0 : Ke.player) == null ? void 0 : cn.title) ?? "Album" : W.title, Tr = q("View all albums" + (c.count() > 1 ? ` (${c.count()})` : ""), () => {
          const mn = document.querySelector(".ppp-shelf");
          mn && (mn.hidden = !1, mn.open = !mn.open, Tr.setAttribute("aria-expanded", String(mn.open)), mn.open && requestAnimationFrame(() => mn.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        Tr.setAttribute("aria-expanded", String(!!((qr = document.querySelector(".ppp-shelf")) != null && qr.open))), ir.replaceChildren(
          Ie("🎧 My player", lt ? (Qo = h.likeFunds) == null ? void 0 : Qo.balance : h.balance, !lt, () => {
            lt && o.openAlbum(0);
          }),
          Ie("💿 " + po, lt ? h.balance : void 0, lt, () => {
            !lt && W && o.openAlbum(W.slot);
          }),
          Tr
        );
      }
    }
    const or = c.render(h), qn = document.querySelector(".ppp-shelf");
    if (qn) {
      qn.hidden = !or;
      const W = qn.querySelector("summary");
      W && (W.textContent = c.count() > 0 ? `♪ My albums (${c.count()})` : "♪ My albums");
      const lt = qn.querySelector(".ppp-shelf-body");
      or && lt && !lt.contains(or) && lt.replaceChildren(or);
    }
    const Cr = a.renderFold(d);
    if (n(".ppp-gifts").hidden = !Cr, Cr && !n(".ppp-gift-body").contains(Cr) && n(".ppp-gift-body").replaceChildren(Cr), Cr && vt) {
      vt = !1;
      const W = n(".ppp-gifts");
      W.open = !0, requestAnimationFrame(() => W.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    n(".ppp-body").replaceChildren(...Gt), n(".ppp-actions").replaceChildren(...le), n(".ppp-actions2").replaceChildren(...bn);
    const ar = h.busy || h.message || "", Ai = n(".ppp-msg"), Cs = ar && wt.some((W) => (W.textContent ?? "").startsWith(ar.replace(/[.✓\s]+$/, ""))) ? "" : ar, Wn = !Cs && !h.error ? h.notice : rt && !Cs ? h.error : "";
    Ai.textContent = Cs || Wn, Ai.classList.toggle("is-warn", !!Wn), n(".ppp-err").textContent = rt ? "" : h.error;
    const cr = h.entries.filter((W) => W.kind === "play");
    n(".ppp-recent").hidden = !h.entries.length, n(".ppp-recent-list").replaceChildren(...cr.slice(0, 5).map((W) => {
      const lt = m("li"), $e = W.status === "confirmed" ? "ok" : W.status === "failed" ? "bad" : "warn";
      return lt.append(m("span", "", "d " + $e), m("span", qe(W), "t"), m("span", Et(W.created), "ppp-mute")), W.txid && lt.append(nt("tx", k(W.txid))), lt;
    })), n(".ppp-wallets").hidden = !(Lr.childElementCount || bn.length), n(".ppp-more").hidden = !Gt.length;
    const y = n(".ppp-history");
    y.hidden = !h.entries.length, h.entries.length && De(), y.replaceChildren(m("summary", `All activity (${h.entries.length})`), ...h.entries.slice(0, 20).map((W) => {
      const lt = m("div", "", "ppp-row"), $e = W.kind === "play" ? [m("span", qe(W), "ppp-song"), m("span", ` · ${pr(BigInt(W.amount))} STX to ${ct(W.recipient)}`, "ppp-mute")] : W.kind === "like" ? [m("span", `${W.liked ? "♥ Liked" : "Unliked"} ${qe(W)}`, "ppp-song"), m("span", ` · for ${h.linked ? ct(h.linked) : "this listening wallet"}`, "ppp-mute")] : [m("span", `Returned ${pr(BigInt(W.amount))} STX`, "ppp-song"), m("span", ` to ${ct(W.recipient)}`, "ppp-mute")];
      return lt.append(
        m("span", ze[W.status] || W.status, "ppp-status " + (Me[W.status] || "")),
        ...$e,
        m("span", ` · ${new Date(W.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), W.txid && lt.append(nt("tx ↗", k(W.txid))), lt;
    })), w == null || w.render(de ? bi(h, de, [...Ei, ...Si]) : null), x == null || x.render((On == null ? void 0 : On.mode) === "open" ? bi(h, On, []) : null);
  }
  function $n(d) {
    var h;
    if (["off", "elsewhere", "not-invited"].includes(d.step)) return null;
    if (d.slot > 0 && ((h = d.gift) != null && h.player) && ["fund", "ready", "over", "link", "loading"].includes(d.step))
      return d.root && z({ root: d.root, slot: d.slot, player: d.gift.player }), { mode: "open", player: d.gift.player };
    const E = a.incomingAlbum();
    if (E) return { mode: "arrive", player: E.player, from: E.from, offered: E.plays };
    const $ = M();
    return $ && (d.step === "locked" || A && d.step === "loading") ? { mode: "locked", player: $.player } : null;
  }
  function bi(d, E, $) {
    var ke, yn, wn;
    const h = !!d.busy || d.armed, rt = [...$];
    d.depositPending && d.arrival && rt.push(kn(d.arrival)), d.error ? rt.push(m("p", d.error, d.error === yc ? "ppp-warn" : "ppp-bad")) : d.message && !h ? rt.push(m("p", d.message, "ppp-cyan")) : d.notice && rt.push(m("p", d.notice, "ppp-warn")), E.mode === "open" && P && ((ke = d.likeFunds) != null && ke.album) && d.likeFunds.low && !d.likeFunds.pending && rt.push(m("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    const dt = "Kept on this device with Face ID or your passkey. No app or account needed.";
    let yt = null, ae = null;
    return E.mode === "locked" ? (yt = { label: "Continue listening", run: () => {
      A = M(), o.unlock();
    } }, ae = { label: "Use a different passkey", run: () => {
      A = null, o.unlock(!0);
    } }) : E.mode === "arrive" && (d.step === "intro" ? (yt = { label: "Open album", run: () => void o.create() }, ae = { label: "I've used Xtrata Music here before", run: () => void o.unlock(!0) }) : d.step === "locked" ? (yt = { label: "Open album", run: () => void o.unlock() }, ae = { label: "Use a different passkey", run: () => void o.unlock(!0) }) : d.step === "unsupported" ? rt.push(m("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : rt.length || rt.push(m("p", "Opening your album…", "ppp-cyan"))), {
      mode: E.mode,
      player: E.player,
      from: E.from,
      offered: E.offered,
      plays: E.mode === "open" ? d.balance === void 0 ? null : d.giftPlays : void 0,
      playsComing: d.depositPending,
      status: rt,
      primary: yt,
      secondary: ae,
      hint: yt ? dt : void 0,
      asking: h,
      busy: !!d.busy,
      myPlays: oe(d),
      topUps: ja,
      canMake: !!((wn = (yn = d.gate) == null ? void 0 : yn.gifts) != null && wn.admin)
    };
  }
  const mi = /* @__PURE__ */ new Map(), Vt = () => {
    const d = window.XtrataRadio;
    return d != null && d.subscribe ? (d.subscribe((E) => {
      const $ = E == null ? void 0 : E.nowPlaying;
      $ && Number.isSafeInteger(Number($.tokenId)) && mi.set(Number($.tokenId), { title: $.title || void 0, artist: $.artist || void 0 });
    }), !0) : !1;
  };
  if (!Vt()) {
    const d = setInterval(() => {
      Vt() && clearInterval(d);
    }, 500);
    setTimeout(() => clearInterval(d), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (d) => {
    const E = d.detail;
    if (E && Number.isSafeInteger(E.song) && typeof E.id == "string" && /^[0-9a-f]{32}$/.test(E.id)) {
      De();
      const $ = xe(E.song, mi.get(E.song));
      o.onListened({ song: E.song, id: E.id, title: $.title || void 0, artist: $.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const Fk = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", jk = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", i = e.userAgent.includes("Edge"), s = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return s ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && i === !1 && o === !1;
}, zk = () => jk() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, Rk = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, Gk = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', yw = class {
  constructor(t) {
    u4(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && Tx(t), this.callback(Mc(t));
  }
  handleCloseModal() {
    this.cancelCallback();
  }
  // todo: nice to have:
  // getComment(provider: WebBTCProvider, browser: string, isMobile?: string) {
  //   if (!provider) return null;
  //   const hasExtension = this.getBrowserUrl(provider);
  //   const hasMobile = this.getMobileUrl(provider);
  //   if (isMobile && hasExtension && !hasMobile) return 'Extension Only';
  //   if (!isMobile && !hasExtension && hasMobile) return 'Mobile Only';
  //   if (!isMobile && !browser) return 'Current browser not supported';
  //   return null;
  // }
  getBrowserUrl(t) {
    var e;
    return (e = t.chromeWebStoreUrl) !== null && e !== void 0 ? e : t.mozillaAddOnsUrl;
  }
  getMobileUrl(t) {
    var e;
    return (e = t.iOSAppStoreUrl) !== null && e !== void 0 ? e : t.googlePlayStoreUrl;
  }
  getInstallUrl(t, e, n) {
    var r, i, s, o, a, c, u, f, l, w;
    return n === "IOS" ? (i = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && i !== void 0 ? i : t.webUrl : e === "Chrome" ? (o = (s = t.chromeWebStoreUrl) !== null && s !== void 0 ? s : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (f = (u = t.googlePlayStoreUrl) !== null && u !== void 0 ? u : this.getBrowserUrl(t)) !== null && f !== void 0 ? f : t.webUrl : (w = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && w !== void 0 ? w : this.getMobileUrl(t);
  }
  render() {
    const t = zk(), e = Rk(), n = this.defaultProviders.filter(
      (s) => this.installedProviders.findIndex((o) => o.id === s.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, i = n.length > 0;
    return kt("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, kt("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), kt("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, kt("div", { class: "flex flex-col space-y-[10px]" }, kt("div", { class: "flex items-center" }, kt("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), kt("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, kt("span", { class: "sr-only" }, "Close popup"), kt("img", { src: Fk }))), r ? kt("p", null, "Select the wallet you want to connect to.") : kt("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && kt("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && kt("div", { class: "mt-6" }, kt("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), kt("ul", { class: "space-y-3" }, this.installedProviders.map((s) => kt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, kt("div", { class: "aspect-square basis-9 overflow-hidden" }, kt("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), kt("div", { class: "flex-1" }, kt("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && kt("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), kt("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(s.id) }, "Connect"))))), i && kt("div", { class: "mt-6" }, r ? kt("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : kt("div", { class: "mb-5 flex justify-between" }, kt("p", { class: "text-sm font-medium" }, "Recommended wallets"), kt("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, kt("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, kt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), kt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), kt("p", null, "What is a wallet? ", kt("span", { class: "align-text-bottom text-[9px]" }, "↗")))), kt("ul", { class: "space-y-3" }, n.map((s) => kt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, kt("div", { class: "aspect-square basis-9 overflow-hidden" }, kt("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), kt("div", { class: "flex-1" }, kt("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && kt("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), this.getInstallUrl(s, t, e) && kt("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(s, t, e), rel: "noopener noreferrer", target: "_blank" }, s.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return KA(this);
  }
};
yw.style = Gk;
const Kk = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: yw
}, Symbol.toStringTag, { value: "Module" }));
