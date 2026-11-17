var Yb = Object.defineProperty;
var qb = (e, t, n) => t in e ? Yb(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var ma = (e, t, n) => qb(e, typeof t != "symbol" ? t + "" : t, n);
var Gn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ry(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function Pl(e) {
  if (e.__esModule) return e;
  var t = e.default;
  if (typeof t == "function") {
    var n = function r() {
      return this instanceof r ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    n.prototype = t.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(e).forEach(function(r) {
    var o = Object.getOwnPropertyDescriptor(e, r);
    Object.defineProperty(n, r, o.get ? o : {
      enumerable: !0,
      get: function() {
        return e[r];
      }
    });
  }), n;
}
(function() {
  (function(e) {
    (function(t) {
      var n = typeof globalThis < "u" && globalThis || typeof e < "u" && e || // eslint-disable-next-line no-undef
      typeof Gn < "u" && Gn || {}, r = {
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
      function o(b) {
        return b && DataView.prototype.isPrototypeOf(b);
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
        ], i = ArrayBuffer.isView || function(b) {
          return b && s.indexOf(Object.prototype.toString.call(b)) > -1;
        };
      function a(b) {
        if (typeof b != "string" && (b = String(b)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(b) || b === "")
          throw new TypeError('Invalid character in header field name: "' + b + '"');
        return b.toLowerCase();
      }
      function c(b) {
        return typeof b != "string" && (b = String(b)), b;
      }
      function u(b) {
        var I = {
          next: function() {
            var M = b.shift();
            return { done: M === void 0, value: M };
          }
        };
        return r.iterable && (I[Symbol.iterator] = function() {
          return I;
        }), I;
      }
      function h(b) {
        this.map = {}, b instanceof h ? b.forEach(function(I, M) {
          this.append(M, I);
        }, this) : Array.isArray(b) ? b.forEach(function(I) {
          if (I.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + I.length);
          this.append(I[0], I[1]);
        }, this) : b && Object.getOwnPropertyNames(b).forEach(function(I) {
          this.append(I, b[I]);
        }, this);
      }
      h.prototype.append = function(b, I) {
        b = a(b), I = c(I);
        var M = this.map[b];
        this.map[b] = M ? M + ", " + I : I;
      }, h.prototype.delete = function(b) {
        delete this.map[a(b)];
      }, h.prototype.get = function(b) {
        return b = a(b), this.has(b) ? this.map[b] : null;
      }, h.prototype.has = function(b) {
        return this.map.hasOwnProperty(a(b));
      }, h.prototype.set = function(b, I) {
        this.map[a(b)] = c(I);
      }, h.prototype.forEach = function(b, I) {
        for (var M in this.map)
          this.map.hasOwnProperty(M) && b.call(I, this.map[M], M, this);
      }, h.prototype.keys = function() {
        var b = [];
        return this.forEach(function(I, M) {
          b.push(M);
        }), u(b);
      }, h.prototype.values = function() {
        var b = [];
        return this.forEach(function(I) {
          b.push(I);
        }), u(b);
      }, h.prototype.entries = function() {
        var b = [];
        return this.forEach(function(I, M) {
          b.push([M, I]);
        }), u(b);
      }, r.iterable && (h.prototype[Symbol.iterator] = h.prototype.entries);
      function d(b) {
        if (!b._noBody) {
          if (b.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          b.bodyUsed = !0;
        }
      }
      function m(b) {
        return new Promise(function(I, M) {
          b.onload = function() {
            I(b.result);
          }, b.onerror = function() {
            M(b.error);
          };
        });
      }
      function w(b) {
        var I = new FileReader(), M = m(I);
        return I.readAsArrayBuffer(b), M;
      }
      function v(b) {
        var I = new FileReader(), M = m(I), P = /charset=([A-Za-z0-9_-]+)/.exec(b.type), W = P ? P[1] : "utf-8";
        return I.readAsText(b, W), M;
      }
      function x(b) {
        for (var I = new Uint8Array(b), M = new Array(I.length), P = 0; P < I.length; P++)
          M[P] = String.fromCharCode(I[P]);
        return M.join("");
      }
      function L(b) {
        if (b.slice)
          return b.slice(0);
        var I = new Uint8Array(b.byteLength);
        return I.set(new Uint8Array(b)), I.buffer;
      }
      function N() {
        return this.bodyUsed = !1, this._initBody = function(b) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = b, b ? typeof b == "string" ? this._bodyText = b : r.blob && Blob.prototype.isPrototypeOf(b) ? this._bodyBlob = b : r.formData && FormData.prototype.isPrototypeOf(b) ? this._bodyFormData = b : r.searchParams && URLSearchParams.prototype.isPrototypeOf(b) ? this._bodyText = b.toString() : r.arrayBuffer && r.blob && o(b) ? (this._bodyArrayBuffer = L(b.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(b) || i(b)) ? this._bodyArrayBuffer = L(b) : this._bodyText = b = Object.prototype.toString.call(b) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof b == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(b) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var b = d(this);
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
            var b = d(this);
            return b || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
              this._bodyArrayBuffer.buffer.slice(
                this._bodyArrayBuffer.byteOffset,
                this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
              )
            ) : Promise.resolve(this._bodyArrayBuffer));
          } else {
            if (r.blob)
              return this.blob().then(w);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var b = d(this);
          if (b)
            return b;
          if (this._bodyBlob)
            return v(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(x(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(B);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var U = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function A(b) {
        var I = b.toUpperCase();
        return U.indexOf(I) > -1 ? I : b;
      }
      function T(b, I) {
        if (!(this instanceof T))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        I = I || {};
        var M = I.body;
        if (b instanceof T) {
          if (b.bodyUsed)
            throw new TypeError("Already read");
          this.url = b.url, this.credentials = b.credentials, I.headers || (this.headers = new h(b.headers)), this.method = b.method, this.mode = b.mode, this.signal = b.signal, !M && b._bodyInit != null && (M = b._bodyInit, b.bodyUsed = !0);
        } else
          this.url = String(b);
        if (this.credentials = I.credentials || this.credentials || "same-origin", (I.headers || !this.headers) && (this.headers = new h(I.headers)), this.method = A(I.method || this.method || "GET"), this.mode = I.mode || this.mode || null, this.signal = I.signal || this.signal || function() {
          if ("AbortController" in n) {
            var R = new AbortController();
            return R.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && M)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(M), (this.method === "GET" || this.method === "HEAD") && (I.cache === "no-store" || I.cache === "no-cache")) {
          var P = /([?&])_=[^&]*/;
          if (P.test(this.url))
            this.url = this.url.replace(P, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var W = /\?/;
            this.url += (W.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      T.prototype.clone = function() {
        return new T(this, { body: this._bodyInit });
      };
      function B(b) {
        var I = new FormData();
        return b.trim().split("&").forEach(function(M) {
          if (M) {
            var P = M.split("="), W = P.shift().replace(/\+/g, " "), R = P.join("=").replace(/\+/g, " ");
            I.append(decodeURIComponent(W), decodeURIComponent(R));
          }
        }), I;
      }
      function X(b) {
        var I = new h(), M = b.replace(/\r?\n[\t ]+/g, " ");
        return M.split("\r").map(function(P) {
          return P.indexOf(`
`) === 0 ? P.substr(1, P.length) : P;
        }).forEach(function(P) {
          var W = P.split(":"), R = W.shift().trim();
          if (R) {
            var le = W.join(":").trim();
            try {
              I.append(R, le);
            } catch (ue) {
              console.warn("Response " + ue.message);
            }
          }
        }), I;
      }
      N.call(T.prototype);
      function Q(b, I) {
        if (!(this instanceof Q))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (I || (I = {}), this.type = "default", this.status = I.status === void 0 ? 200 : I.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = I.statusText === void 0 ? "" : "" + I.statusText, this.headers = new h(I.headers), this.url = I.url || "", this._initBody(b);
      }
      N.call(Q.prototype), Q.prototype.clone = function() {
        return new Q(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new h(this.headers),
          url: this.url
        });
      }, Q.error = function() {
        var b = new Q(null, { status: 200, statusText: "" });
        return b.ok = !1, b.status = 0, b.type = "error", b;
      };
      var oe = [301, 302, 303, 307, 308];
      Q.redirect = function(b, I) {
        if (oe.indexOf(I) === -1)
          throw new RangeError("Invalid status code");
        return new Q(null, { status: I, headers: { location: b } });
      }, t.DOMException = n.DOMException;
      try {
        new t.DOMException();
      } catch {
        t.DOMException = function(I, M) {
          this.message = I, this.name = M;
          var P = Error(I);
          this.stack = P.stack;
        }, t.DOMException.prototype = Object.create(Error.prototype), t.DOMException.prototype.constructor = t.DOMException;
      }
      function Y(b, I) {
        return new Promise(function(M, P) {
          var W = new T(b, I);
          if (W.signal && W.signal.aborted)
            return P(new t.DOMException("Aborted", "AbortError"));
          var R = new XMLHttpRequest();
          function le() {
            R.abort();
          }
          R.onload = function() {
            var C = {
              statusText: R.statusText,
              headers: X(R.getAllResponseHeaders() || "")
            };
            W.url.indexOf("file://") === 0 && (R.status < 200 || R.status > 599) ? C.status = 200 : C.status = R.status, C.url = "responseURL" in R ? R.responseURL : C.headers.get("X-Request-URL");
            var F = "response" in R ? R.response : R.responseText;
            setTimeout(function() {
              M(new Q(F, C));
            }, 0);
          }, R.onerror = function() {
            setTimeout(function() {
              P(new TypeError("Network request failed"));
            }, 0);
          }, R.ontimeout = function() {
            setTimeout(function() {
              P(new TypeError("Network request timed out"));
            }, 0);
          }, R.onabort = function() {
            setTimeout(function() {
              P(new t.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function ue(C) {
            try {
              return C === "" && n.location.href ? n.location.href : C;
            } catch {
              return C;
            }
          }
          if (R.open(W.method, ue(W.url), !0), W.credentials === "include" ? R.withCredentials = !0 : W.credentials === "omit" && (R.withCredentials = !1), "responseType" in R && (r.blob ? R.responseType = "blob" : r.arrayBuffer && (R.responseType = "arraybuffer")), I && typeof I.headers == "object" && !(I.headers instanceof h || n.Headers && I.headers instanceof n.Headers)) {
            var Xe = [];
            Object.getOwnPropertyNames(I.headers).forEach(function(C) {
              Xe.push(a(C)), R.setRequestHeader(C, c(I.headers[C]));
            }), W.headers.forEach(function(C, F) {
              Xe.indexOf(F) === -1 && R.setRequestHeader(F, C);
            });
          } else
            W.headers.forEach(function(C, F) {
              R.setRequestHeader(F, C);
            });
          W.signal && (W.signal.addEventListener("abort", le), R.onreadystatechange = function() {
            R.readyState === 4 && W.signal.removeEventListener("abort", le);
          }), R.send(typeof W._bodyInit > "u" ? null : W._bodyInit);
        });
      }
      return Y.polyfill = !0, n.fetch || (n.fetch = Y, n.Headers = h, n.Request = T, n.Response = Q), t.Headers = h, t.Request = T, t.Response = Q, t.fetch = Y, Object.defineProperty(t, "__esModule", { value: !0 }), t;
    })({});
  })(typeof self < "u" ? self : Gn);
})();
const Wb = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Zb(e, t) {
  const n = {};
  return Object.assign(n, Wb, t), await fetch(e, n);
}
function Jb(e) {
  let t = Zb, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function Qb(...e) {
  const { fetchLib: t, middlewares: n } = Jb(e);
  return async (o, s) => {
    let i = { url: o, init: s ?? {} };
    for (const c of n)
      typeof c.pre == "function" && (i = await Promise.resolve(c.pre({
        fetch: t,
        ...i
      })) ?? i);
    let a = await t(i.url, i.init);
    for (const c of n)
      typeof c.post == "function" && (a = await Promise.resolve(c.post({
        fetch: t,
        url: i.url,
        init: i.init,
        response: (a == null ? void 0 : a.clone()) ?? a
      })) ?? a);
    return a;
  };
}
var Gi;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Gi || (Gi = {}));
var Ko;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Ko || (Ko = {}));
var ip;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(ip || (ip = {}));
const e1 = "https://api.mainnet.hiro.so", t1 = "https://api.testnet.hiro.so", n1 = "http://localhost:3999", r1 = ["mainnet", "testnet", "devnet", "mocknet"];
let Ki = class {
  constructor(t) {
    this.version = Ko.Mainnet, this.chainId = Gi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ko.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, o) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(o)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let o = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (o = `${o}?limit=${r.limit}&offset=${r.offset}`), o;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let o = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (o = `${o}?limit=${r.limit}&offset=${r.offset}`), o;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, o) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${o}?proof=0`, this.getMapEntryUrl = (n, r, o) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${o}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? Qb();
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
};
Ki.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new sd();
    case "testnet":
      return new s1();
    case "devnet":
      return new o1();
    case "mocknet":
      return new sy();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${r1.join(", ")}`);
  }
};
Ki.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : Ki.fromName(e);
let sd = class extends Ki {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? e1,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Ko.Mainnet, this.chainId = Gi.Mainnet;
  }
}, s1 = class extends Ki {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? t1,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Ko.Testnet, this.chainId = Gi.Testnet;
  }
}, sy = class extends Ki {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? n1,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Ko.Testnet, this.chainId = Gi.Testnet;
  }
};
const o1 = sy, oy = "xtrata.wallet.bridge.v1", i1 = (e) => typeof e == "object" && e !== null && e.protocol === oy, a1 = (e) => i1(e) && e.kind === "response" && typeof e.id == "string" && e.id.length > 0 && typeof e.ok == "boolean", c1 = () => {
  const e = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
};
class ba extends Error {
  constructor(t, n) {
    super(n), this.code = t, this.name = "BridgeClientError";
  }
}
const ap = 12e4;
class l1 {
  constructor(t) {
    ma(this, "pending", /* @__PURE__ */ new Map());
    ma(this, "listenTarget");
    ma(this, "closed", !1);
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
    ma(this, "onMessage", (t) => {
      if (t.origin !== this.options.walletOrigin || t.source !== this.options.frame.contentWindow || !a1(t.data)) return;
      const n = this.pending.get(t.data.id);
      if (n)
        if (this.pending.delete(t.data.id), clearTimeout(n.timer), t.data.ok)
          n.resolve(t.data.result);
        else {
          const r = t.data.error;
          n.reject(
            new ba("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = t, this.listenTarget = t.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(t, n) {
    if (this.closed)
      return Promise.reject(new ba("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new ba("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const o = c1(), s = { protocol: oy, kind: "request", id: o, method: t, params: n };
    return new Promise((i, a) => {
      const c = setTimeout(() => {
        this.pending.delete(o), a(
          new ba(
            "TIMEOUT",
            `Wallet did not answer "${t}" within ${this.options.timeoutMs ?? ap}ms.`
          )
        );
      }, this.options.timeoutMs ?? ap);
      this.pending.set(o, { resolve: i, reject: a, timer: c }), r.postMessage(s, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, t] of this.pending)
      clearTimeout(t.timer), t.reject(new ba("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const u1 = ["SP", "SM"], d1 = ["ST", "SN"], f1 = (e) => {
  const [t] = e.split(".");
  if (!t || t.length < 2)
    return null;
  const n = t.slice(0, 2).toUpperCase();
  return u1.includes(n) ? "mainnet" : d1.includes(n) ? "testnet" : null;
}, h1 = () => {
  const e = /* @__PURE__ */ new Map();
  return {
    getItem: (t) => e.get(t) ?? null,
    setItem: (t, n) => {
      e.set(t, n);
    },
    removeItem: (t) => {
      e.delete(t);
    }
  };
}, p1 = () => typeof window > "u" || !window.localStorage ? h1() : window.localStorage, bu = "xtrata.v15.1.wallet.session", cp = "mainnet", rl = { isConnected: !1 }, g1 = (e) => e.address ? f1(e.address) ?? e.network : e.network, iy = (e) => !e.isConnected || !e.address ? { ...rl } : g1(e) !== cp ? { ...rl } : {
  isConnected: !0,
  address: e.address,
  network: cp,
  ...typeof e.publicKey == "string" && /^[0-9a-f]{66}$/i.test(e.publicKey) ? { publicKey: e.publicKey } : {}
}, y1 = (e) => {
  if (!e)
    return { ...rl };
  try {
    const t = JSON.parse(e);
    return iy(t);
  } catch {
    return { ...rl };
  }
}, w1 = (e) => {
  const t = iy(e);
  return JSON.stringify(t);
}, m1 = (e) => {
  const t = p1();
  return {
    load: () => y1(t.getItem(bu)),
    save: (n) => {
      t.setItem(bu, w1(n));
    },
    clear: () => {
      t.removeItem(bu);
    }
  };
}, b1 = "https://browser.blockstack.org/auth", x1 = {
  "@type": "Person",
  "@context": "http://schema.org"
}, ay = ["store_write"], S1 = "blockstack-session", v1 = {
  logLevel: "debug"
}, ai = {
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
Object.freeze(ai);
class ca extends Error {
  constructor(t) {
    super();
    let n = t.message, r = `Error Code: ${t.code}`, o = this.stack;
    if (o)
      r += `Stack Trace:
${o}`;
    else
      try {
        throw new Error();
      } catch (s) {
        o = s.stack;
      }
    n += `
If you believe this exception is caused by a bug in stacks.js,
      please file a bug report: https://github.com/blockstack/stacks.js/issues

${r}`, this.message = n, this.code = t.code, this.parameter = t.parameter ? t.parameter : void 0;
  }
  toString() {
    return `${super.toString()}
    code: ${this.code} param: ${this.parameter ? this.parameter : "n/a"}`;
  }
}
class A1 extends ca {
  constructor(t, n = "") {
    super({ code: ai.MISSING_PARAMETER, message: n, parameter: t }), this.name = "MissingParametersError";
  }
}
class lp extends ca {
  constructor(t = "") {
    super({ code: ai.INVALID_DID_ERROR, message: t }), this.name = "InvalidDIDError";
  }
}
class dc extends ca {
  constructor(t) {
    const n = `Failed to login: ${t}`;
    super({ code: ai.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class up extends ca {
  constructor(t = "Unable to decrypt cipher object.") {
    super({ code: ai.FAILED_DECRYPTION_ERROR, message: t }), this.message = t, this.name = "FailedDecryptionError";
  }
}
class od extends ca {
  constructor(t) {
    super({ code: ai.INVALID_STATE, message: t }), this.message = t, this.name = "InvalidStateError";
  }
}
class cy extends ca {
  constructor(t) {
    super({ code: ai.INVALID_STATE, message: t }), this.message = t, this.name = "NoSessionDataError";
  }
}
const dp = ["debug", "info", "warn", "error", "none"], id = {};
for (let e = 0; e < dp.length; e++) {
  const t = dp[e];
  id[t] = e;
}
class Pi {
  static error(t) {
    this.shouldLog("error") && console.error(this.logMessage("error", t));
  }
  static warn(t) {
    this.shouldLog("warn") && console.warn(this.logMessage("warn", t));
  }
  static info(t) {
    this.shouldLog("info") && console.log(this.logMessage("info", t));
  }
  static debug(t) {
    this.shouldLog("debug") && console.log(this.logMessage("debug", t));
  }
  static logMessage(t, n) {
    return `[${t.toUpperCase()}] ${n}`;
  }
  static shouldLog(t) {
    return id[v1.logLevel] <= id[t];
  }
}
function E1() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function k1() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function xu(e, t) {
  (e === void 0 || e === "") && (e = "0.0.0"), (t === void 0 || e === "") && (t = "0.0.0");
  const n = e.split(".").map((o) => parseInt(o, 10)), r = t.split(".").map((o) => parseInt(o, 10));
  for (let o = 0; o < t.length; o++)
    if (o >= e.length && r.push(0), n[o] < r[o])
      return !1;
  return !0;
}
function $1() {
  let e = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (e += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (t) => {
    const n = (e + Math.random() * 16) % 16 | 0;
    return e = Math.floor(e / 16), (t === "x" ? n : n & 3 | 8).toString(16);
  });
}
function I1() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function L1(e, t, n) {
  return n ? `Use of '${n}' requires \`${t}\` which is unavailable on the '${e}' object within the currently executing environment.` : `\`${t}\` is unavailable on the '${e}' object within the currently executing environment.`;
}
function pf(e, { throwIfUnavailable: t, usageDesc: n, returnEmptyObject: r } = {}) {
  let o;
  try {
    if (o = I1(), o) {
      const s = o[e];
      if (s)
        return s;
    }
  } catch (s) {
    Pi.error(`Error getting object '${e}' from global scope '${o}': ${s}`);
  }
  if (t) {
    const s = L1(o, e.toString(), n);
    throw Pi.error(s), new Error(s);
  }
  if (r)
    return {};
}
function xo(e, t) {
  return gf(Hn(e), t);
}
function Hn(e) {
  if (typeof e == "bigint")
    return e;
  if (typeof e == "string")
    return BigInt(e);
  if (typeof e == "number") {
    if (!Number.isInteger(e))
      throw new RangeError("Invalid value. Values of type 'number' must be an integer.");
    if (e > Number.MAX_SAFE_INTEGER)
      throw new RangeError(`Invalid value. Values of type 'number' must be less than or equal to ${Number.MAX_SAFE_INTEGER}. For larger values, try using a BigInt instead.`);
    return BigInt(e);
  }
  if (Qn(e, Uint8Array))
    return BigInt(`0x${Ue(e)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function C1(e) {
  return /^0x/i.test(e) ? e.slice(2) : e;
}
function fp(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function Za(e, t = 8) {
  return (typeof e == "bigint" ? e : Hn(e)).toString(16).padStart(t * 2, "0");
}
function Ul(e) {
  return parseInt(e, 16);
}
function gf(e, t = 16) {
  const n = Za(e, t);
  return mt(n);
}
function T1(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function B1(e, t) {
  return e & BigInt(1) << t;
}
function ad(e) {
  return N1(BigInt(`0x${Ue(e)}`), BigInt(e.byteLength * 8));
}
function N1(e, t) {
  return B1(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const M1 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Ue(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += M1[n];
  return t;
}
function mt(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = C1(e), e = e.length % 2 ? `0${e}` : e;
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, o = e.slice(r, r + 2), s = Number.parseInt(o, 16);
    if (Number.isNaN(s) || s < 0)
      throw new Error("Invalid byte sequence");
    t[n] = s;
  }
  return t;
}
function ci(e) {
  return new TextEncoder().encode(e);
}
function Ja(e) {
  return new TextDecoder().decode(e);
}
function _1(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function P1(e) {
  return String.fromCharCode.apply(null, e);
}
function U1(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function hp(e) {
  if (e.some(U1))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function is(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, o) => r + o.length, 0), n = new Uint8Array(t);
  for (let r = 0, o = 0; r < e.length; r++) {
    const s = e[r];
    n.set(s, o), o += s.length;
  }
  return n;
}
function an(e) {
  return is(...e.map((t) => typeof t == "number" ? hp([t]) : t instanceof Array ? hp(t) : t));
}
function Qn(e, t) {
  var n, r;
  return e instanceof t || ((r = (n = e == null ? void 0 : e.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === t.name;
}
const ly = "https://api.mainnet.hiro.so", uy = "https://api.testnet.hiro.so", dy = "http://localhost:3999", O1 = "https://hub.blockstack.org", H1 = 33, Su = 32;
function D1(e) {
  if (e.length < Su * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + Su * 2), r = e.slice(2 + Su * 2);
  return {
    recoveryId: Ul(t),
    r: n,
    s: r
  };
}
function yf(e) {
  const t = typeof e == "string" ? mt(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function F1(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function j1(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function R1(e, t) {
  return e[t];
}
function z1(e, t, n = 0) {
  return e[n] = t, e;
}
function G1(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function Vo(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
const K1 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function V1(e, t) {
  const n = {};
  return Object.assign(n, K1, t), await fetch(e, n);
}
function X1(e) {
  let t = V1, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function Y1(...e) {
  const { fetchLib: t, middlewares: n } = X1(e);
  return async (o, s) => {
    let i = { url: o, init: s ?? {} };
    for (const c of n)
      typeof c.pre == "function" && (i = await Promise.resolve(c.pre({
        fetch: t,
        ...i
      })) ?? i);
    let a = await t(i.url, i.init);
    for (const c of n)
      typeof c.post == "function" && (a = await Promise.resolve(c.post({
        fetch: t,
        url: i.url,
        init: i.init,
        response: (a == null ? void 0 : a.clone()) ?? a
      })) ?? a);
    return a;
  };
}
class fy {
  constructor(t = ay.slice(), n = ((a) => (a = pf("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", o = "/manifest.json", s = void 0, i = b1) {
    this.appDomain = n, this.scopes = t, this.redirectPath = r, this.manifestPath = o, this.coreNode = s, this.authenticatorURL = i;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function cd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function q1(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function hy(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function W1(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  cd(e.outputLen), cd(e.blockLen);
}
function Z1(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function J1(e, t) {
  hy(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Po = {
  number: cd,
  bool: q1,
  bytes: hy,
  hash: W1,
  exists: Z1,
  output: J1
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const vu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), qr = (e, t) => e << 32 - t | e >>> t, Q1 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Q1)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function e2(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function wf(e) {
  if (typeof e == "string" && (e = e2(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let py = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function li(e) {
  const t = (r) => e().update(wf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let gy = class extends py {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Po.hash(t);
    const r = wf(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const o = this.blockLen, s = new Uint8Array(o);
    s.set(r.length > o ? t.create().update(r).digest() : r);
    for (let i = 0; i < s.length; i++)
      s[i] ^= 54;
    this.iHash.update(s), this.oHash = t.create();
    for (let i = 0; i < s.length; i++)
      s[i] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(t) {
    return Po.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Po.exists(this), Po.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: o, destroyed: s, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = o, t.destroyed = s, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Ol = (e, t, n) => new gy(e, t).update(n).digest();
Ol.create = (e, t) => new gy(e, t);
function t2(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let mf = class extends py {
  constructor(t, n, r, o) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = vu(this.buffer);
  }
  update(t) {
    Po.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    t = wf(t);
    const s = t.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(o - this.pos, s - i);
      if (a === o) {
        const c = vu(t);
        for (; o <= s - i; i += o)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Po.exists(this), Po.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let d = i; d < o; d++)
      n[d] = 0;
    t2(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = vu(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: a } = this;
    return t.length = o, t.pos = a, t.finished = s, t.destroyed = i, o % n && t.buffer.set(r), t;
  }
};
const n2 = (e, t, n) => e & t ^ ~e & n, r2 = (e, t, n) => e & t ^ e & n ^ t & n, s2 = new Uint32Array([
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
]), js = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Rs = new Uint32Array(64);
let yy = class extends mf {
  constructor() {
    super(64, 32, 8, !1), this.A = js[0] | 0, this.B = js[1] | 0, this.C = js[2] | 0, this.D = js[3] | 0, this.E = js[4] | 0, this.F = js[5] | 0, this.G = js[6] | 0, this.H = js[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: s, F: i, G: a, H: c } = this;
    return [t, n, r, o, s, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      Rs[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const m = Rs[d - 15], w = Rs[d - 2], v = qr(m, 7) ^ qr(m, 18) ^ m >>> 3, x = qr(w, 17) ^ qr(w, 19) ^ w >>> 10;
      Rs[d] = x + Rs[d - 7] + v + Rs[d - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const m = qr(a, 6) ^ qr(a, 11) ^ qr(a, 25), w = h + m + n2(a, c, u) + s2[d] + Rs[d] | 0, x = (qr(r, 2) ^ qr(r, 13) ^ qr(r, 22)) + r2(r, o, s) | 0;
      h = u, u = c, c = a, a = i + w | 0, i = s, s = o, o = r, r = w + x | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, o, s, i, a, c, u, h);
  }
  roundClean() {
    Rs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, o2 = class extends yy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Vi = li(() => new yy());
li(() => new o2());
const i2 = {}, wy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: i2
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const gt = BigInt(0), Gt = BigInt(1), go = BigInt(2), Ba = BigInt(3), pp = BigInt(8), Ct = Object.freeze({
  a: gt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Gt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), gp = (e, t) => (e + t / go) / t, fc = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(e) {
    const { n: t } = Ct, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Gt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), o = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), s = n, i = BigInt("0x100000000000000000000000000000000"), a = gp(s * e, t), c = gp(-r * e, t);
    let u = ye(e - a * n - c * o, t), h = ye(-a * r - c * s, t);
    const d = u > i, m = h > i;
    if (d && (u = t - u), m && (h = t - h), u > i || h > i)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + e);
    return { k1neg: d, k1: u, k2neg: m, k2: h };
  }
}, Hr = 32, Xo = 32, my = 32, sl = Hr + 1, ol = 2 * Hr + 1;
function yp(e) {
  const { a: t, b: n } = Ct, r = ye(e * e), o = ye(r * e);
  return ye(o + t * e + n);
}
const hc = Ct.a === gt;
class bf extends Error {
  constructor(t) {
    super(t);
  }
}
function wp(e) {
  if (!(e instanceof vt))
    throw new TypeError("JacobianPoint expected");
}
class vt {
  constructor(t, n, r) {
    this.x = t, this.y = n, this.z = r;
  }
  static fromAffine(t) {
    if (!(t instanceof at))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return t.equals(at.ZERO) ? vt.ZERO : new vt(t.x, t.y, Gt);
  }
  static toAffineBatch(t) {
    const n = d2(t.map((r) => r.z));
    return t.map((r, o) => r.toAffine(n[o]));
  }
  static normalizeZ(t) {
    return vt.toAffineBatch(t).map(vt.fromAffine);
  }
  equals(t) {
    wp(t);
    const { x: n, y: r, z: o } = this, { x: s, y: i, z: a } = t, c = ye(o * o), u = ye(a * a), h = ye(n * u), d = ye(s * c), m = ye(ye(r * a) * u), w = ye(ye(i * o) * c);
    return h === d && m === w;
  }
  negate() {
    return new vt(this.x, ye(-this.y), this.z);
  }
  double() {
    const { x: t, y: n, z: r } = this, o = ye(t * t), s = ye(n * n), i = ye(s * s), a = t + s, c = ye(go * (ye(a * a) - o - i)), u = ye(Ba * o), h = ye(u * u), d = ye(h - go * c), m = ye(u * (c - d) - pp * i), w = ye(go * n * r);
    return new vt(d, m, w);
  }
  add(t) {
    wp(t);
    const { x: n, y: r, z: o } = this, { x: s, y: i, z: a } = t;
    if (s === gt || i === gt)
      return this;
    if (n === gt || r === gt)
      return t;
    const c = ye(o * o), u = ye(a * a), h = ye(n * u), d = ye(s * c), m = ye(ye(r * a) * u), w = ye(ye(i * o) * c), v = ye(d - h), x = ye(w - m);
    if (v === gt)
      return x === gt ? this.double() : vt.ZERO;
    const L = ye(v * v), N = ye(v * L), U = ye(h * L), A = ye(x * x - N - go * U), T = ye(x * (U - A) - m * N), B = ye(o * a * v);
    return new vt(A, T, B);
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiplyUnsafe(t) {
    const n = vt.ZERO;
    if (typeof t == "bigint" && t === gt)
      return n;
    let r = xp(t);
    if (r === Gt)
      return this;
    if (!hc) {
      let d = n, m = this;
      for (; r > gt; )
        r & Gt && (d = d.add(m)), m = m.double(), r >>= Gt;
      return d;
    }
    let { k1neg: o, k1: s, k2neg: i, k2: a } = fc.splitScalar(r), c = n, u = n, h = this;
    for (; s > gt || a > gt; )
      s & Gt && (c = c.add(h)), a & Gt && (u = u.add(h)), h = h.double(), s >>= Gt, a >>= Gt;
    return o && (c = c.negate()), i && (u = u.negate()), u = new vt(ye(u.x * fc.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(t) {
    const n = hc ? 128 / t + 1 : 256 / t + 1, r = [];
    let o = this, s = o;
    for (let i = 0; i < n; i++) {
      s = o, r.push(s);
      for (let a = 1; a < 2 ** (t - 1); a++)
        s = s.add(o), r.push(s);
      o = s.double();
    }
    return r;
  }
  wNAF(t, n) {
    !n && this.equals(vt.BASE) && (n = at.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let o = n && ld.get(n);
    o || (o = this.precomputeWindow(r), n && r !== 1 && (o = vt.normalizeZ(o), ld.set(n, o)));
    let s = vt.ZERO, i = vt.BASE;
    const a = 1 + (hc ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), h = 2 ** r, d = BigInt(r);
    for (let m = 0; m < a; m++) {
      const w = m * c;
      let v = Number(t & u);
      t >>= d, v > c && (v -= h, t += Gt);
      const x = w, L = w + Math.abs(v) - 1, N = m % 2 !== 0, U = v < 0;
      v === 0 ? i = i.add(pc(N, o[x])) : s = s.add(pc(U, o[L]));
    }
    return { p: s, f: i };
  }
  multiply(t, n) {
    let r = xp(t), o, s;
    if (hc) {
      const { k1neg: i, k1: a, k2neg: c, k2: u } = fc.splitScalar(r);
      let { p: h, f: d } = this.wNAF(a, n), { p: m, f: w } = this.wNAF(u, n);
      h = pc(i, h), m = pc(c, m), m = new vt(ye(m.x * fc.beta), m.y, m.z), o = h.add(m), s = d.add(w);
    } else {
      const { p: i, f: a } = this.wNAF(r, n);
      o = i, s = a;
    }
    return vt.normalizeZ([o, s])[0];
  }
  toAffine(t) {
    const { x: n, y: r, z: o } = this, s = this.equals(vt.ZERO);
    t == null && (t = s ? pp : la(o));
    const i = t, a = ye(i * i), c = ye(a * i), u = ye(n * a), h = ye(r * c), d = ye(o * i);
    if (s)
      return at.ZERO;
    if (d !== Gt)
      throw new Error("invZ was invalid");
    return new at(u, h);
  }
}
vt.BASE = new vt(Ct.Gx, Ct.Gy, Gt);
vt.ZERO = new vt(gt, Gt, gt);
function pc(e, t) {
  const n = t.negate();
  return e ? n : t;
}
const ld = /* @__PURE__ */ new WeakMap();
class at {
  constructor(t, n) {
    this.x = t, this.y = n;
  }
  _setWindowSize(t) {
    this._WINDOW_SIZE = t, ld.delete(this);
  }
  hasEvenY() {
    return this.y % go === gt;
  }
  static fromCompressedHex(t) {
    const n = t.length === 32, r = gr(n ? t : t.subarray(1));
    if (!Vc(r))
      throw new Error("Point is not on curve");
    const o = yp(r);
    let s = u2(o);
    const i = (s & Gt) === Gt;
    n ? i && (s = ye(-s)) : (t[0] & 1) === 1 !== i && (s = ye(-s));
    const a = new at(r, s);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(t) {
    const n = gr(t.subarray(1, Hr + 1)), r = gr(t.subarray(Hr + 1, Hr * 2 + 1)), o = new at(n, r);
    return o.assertValidity(), o;
  }
  static fromHex(t) {
    const n = as(t), r = n.length, o = n[0];
    if (r === Hr)
      return this.fromCompressedHex(n);
    if (r === sl && (o === 2 || o === 3))
      return this.fromCompressedHex(n);
    if (r === ol && o === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${sl} compressed bytes or ${ol} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(t) {
    return at.BASE.multiply(Yo(t));
  }
  static fromSignature(t, n, r) {
    const { r: o, s } = Sy(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const i = xf(as(t)), { n: a } = Ct, c = r === 2 || r === 3 ? o + a : o, u = la(c, a), h = ye(-i * u, a), d = ye(s * u, a), m = r & 1 ? "03" : "02", w = at.fromHex(m + yo(c)), v = at.BASE.multiplyAndAddUnsafe(w, h, d);
    if (!v)
      throw new Error("Cannot recover signature: point at infinify");
    return v.assertValidity(), v;
  }
  toRawBytes(t = !1) {
    return wo(this.toHex(t));
  }
  toHex(t = !1) {
    const n = yo(this.x);
    return t ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${yo(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const t = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Vc(n) || !Vc(r))
      throw new Error(t);
    const o = ye(r * r), s = yp(n);
    if (ye(o - s) !== gt)
      throw new Error(t);
  }
  equals(t) {
    return this.x === t.x && this.y === t.y;
  }
  negate() {
    return new at(this.x, ye(-this.y));
  }
  double() {
    return vt.fromAffine(this).double().toAffine();
  }
  add(t) {
    return vt.fromAffine(this).add(vt.fromAffine(t)).toAffine();
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiply(t) {
    return vt.fromAffine(this).multiply(t, this).toAffine();
  }
  multiplyAndAddUnsafe(t, n, r) {
    const o = vt.fromAffine(this), s = n === gt || n === Gt || this !== at.BASE ? o.multiplyUnsafe(n) : o.multiply(n), i = vt.fromAffine(t).multiplyUnsafe(r), a = s.add(i);
    return a.equals(vt.ZERO) ? void 0 : a.toAffine();
  }
}
at.BASE = new at(Ct.Gx, Ct.Gy);
at.ZERO = new at(gt, gt);
function mp(e) {
  return Number.parseInt(e[0], 16) >= 8 ? "00" + e : e;
}
function bp(e) {
  if (e.length < 2 || e[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Xi(e)}`);
  const t = e[1], n = e.subarray(2, t + 2);
  if (!t || n.length !== t)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: gr(n), left: e.subarray(t + 2) };
}
function a2(e) {
  if (e.length < 2 || e[0] != 48)
    throw new Error(`Invalid signature tag: ${Xi(e)}`);
  if (e[1] !== e.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: t, left: n } = bp(e.subarray(2)), { data: r, left: o } = bp(n);
  if (o.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Xi(o)}`);
  return { r: t, s: r };
}
class pr {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromCompact(t) {
    const n = t instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof t != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const o = n ? Xi(t) : t;
    if (o.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new pr(il(o.slice(0, 64)), il(o.slice(64, 128)));
  }
  static fromDER(t) {
    const n = t instanceof Uint8Array;
    if (typeof t != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s: o } = a2(n ? t : wo(t));
    return new pr(r, o);
  }
  static fromHex(t) {
    return this.fromDER(t);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!qi(t))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!qi(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const t = Ct.n >> Gt;
    return this.s > t;
  }
  normalizeS() {
    return this.hasHighS() ? new pr(this.r, ye(-this.s, Ct.n)) : this;
  }
  toDERRawBytes() {
    return wo(this.toDERHex());
  }
  toDERHex() {
    const t = mp(xa(this.s)), n = mp(xa(this.r)), r = t.length / 2, o = n.length / 2, s = xa(r), i = xa(o);
    return `30${xa(o + r + 4)}02${i}${n}02${s}${t}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return wo(this.toCompactHex());
  }
  toCompactHex() {
    return yo(this.r) + yo(this.s);
  }
}
function ho(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, o) => r + o.length, 0), n = new Uint8Array(t);
  for (let r = 0, o = 0; r < e.length; r++) {
    const s = e[r];
    n.set(s, o), o += s.length;
  }
  return n;
}
const c2 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Xi(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += c2[e[n]];
  return t;
}
const l2 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function yo(e) {
  if (typeof e != "bigint")
    throw new Error("Expected bigint");
  if (!(gt <= e && e < l2))
    throw new Error("Expected number 0 <= n < 2^256");
  return e.toString(16).padStart(64, "0");
}
function Yi(e) {
  const t = wo(yo(e));
  if (t.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return t;
}
function xa(e) {
  const t = e.toString(16);
  return t.length & 1 ? `0${t}` : t;
}
function il(e) {
  if (typeof e != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof e);
  return BigInt(`0x${e}`);
}
function wo(e) {
  if (typeof e != "string")
    throw new TypeError("hexToBytes: expected string, got " + typeof e);
  if (e.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + e.length);
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, o = e.slice(r, r + 2), s = Number.parseInt(o, 16);
    if (Number.isNaN(s) || s < 0)
      throw new Error("Invalid byte sequence");
    t[n] = s;
  }
  return t;
}
function gr(e) {
  return il(Xi(e));
}
function as(e) {
  return e instanceof Uint8Array ? Uint8Array.from(e) : wo(e);
}
function xp(e) {
  if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    return BigInt(e);
  if (typeof e == "bigint" && qi(e))
    return e;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function ye(e, t = Ct.P) {
  const n = e % t;
  return n >= gt ? n : t + n;
}
function xr(e, t) {
  const { P: n } = Ct;
  let r = e;
  for (; t-- > gt; )
    r *= r, r %= n;
  return r;
}
function u2(e) {
  const { P: t } = Ct, n = BigInt(6), r = BigInt(11), o = BigInt(22), s = BigInt(23), i = BigInt(44), a = BigInt(88), c = e * e * e % t, u = c * c * e % t, h = xr(u, Ba) * u % t, d = xr(h, Ba) * u % t, m = xr(d, go) * c % t, w = xr(m, r) * m % t, v = xr(w, o) * w % t, x = xr(v, i) * v % t, L = xr(x, a) * x % t, N = xr(L, i) * v % t, U = xr(N, Ba) * u % t, A = xr(U, s) * w % t, T = xr(A, n) * c % t, B = xr(T, go);
  if (B * B % t !== e)
    throw new Error("Cannot find square root");
  return B;
}
function la(e, t = Ct.P) {
  if (e === gt || t <= gt)
    throw new Error(`invert: expected positive integers, got n=${e} mod=${t}`);
  let n = ye(e, t), r = t, o = gt, s = Gt;
  for (; n !== gt; ) {
    const a = r / n, c = r % n, u = o - s * a;
    r = n, n = c, o = s, s = u;
  }
  if (r !== Gt)
    throw new Error("invert: does not exist");
  return ye(o, t);
}
function d2(e, t = Ct.P) {
  const n = new Array(e.length), r = e.reduce((s, i, a) => i === gt ? s : (n[a] = s, ye(s * i, t)), Gt), o = la(r, t);
  return e.reduceRight((s, i, a) => i === gt ? s : (n[a] = ye(s * n[a], t), ye(s * i, t)), o), n;
}
function f2(e) {
  const t = e.length * 8 - Xo * 8, n = gr(e);
  return t > 0 ? n >> BigInt(t) : n;
}
function xf(e, t = !1) {
  const n = f2(e);
  if (t)
    return n;
  const { n: r } = Ct;
  return n >= r ? n - r : n;
}
let Ri, Na;
class by {
  constructor(t, n) {
    if (this.hashLen = t, this.qByteLen = n, typeof t != "number" || t < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(t).fill(1), this.k = new Uint8Array(t).fill(0), this.counter = 0;
  }
  hmac(...t) {
    return nn.hmacSha256(this.k, ...t);
  }
  hmacSync(...t) {
    return Na(this.k, ...t);
  }
  checkSync() {
    if (typeof Na != "function")
      throw new bf("hmacSha256Sync needs to be set");
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
    return ho(...n);
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
    return ho(...n);
  }
}
function qi(e) {
  return gt < e && e < Ct.n;
}
function Vc(e) {
  return gt < e && e < Ct.P;
}
function xy(e, t, n, r = !0) {
  const { n: o } = Ct, s = xf(e, !0);
  if (!qi(s))
    return;
  const i = la(s, o), a = at.BASE.multiply(s), c = ye(a.x, o);
  if (c === gt)
    return;
  const u = ye(i * ye(t + n * c, o), o);
  if (u === gt)
    return;
  let h = new pr(c, u), d = (a.x === h.r ? 0 : 2) | Number(a.y & Gt);
  return r && h.hasHighS() && (h = h.normalizeS(), d ^= 1), { sig: h, recovery: d };
}
function Yo(e) {
  let t;
  if (typeof e == "bigint")
    t = e;
  else if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    t = BigInt(e);
  else if (typeof e == "string") {
    if (e.length !== 2 * Xo)
      throw new Error("Expected 32 bytes of private key");
    t = il(e);
  } else if (e instanceof Uint8Array) {
    if (e.length !== Xo)
      throw new Error("Expected 32 bytes of private key");
    t = gr(e);
  } else
    throw new TypeError("Expected valid private key");
  if (!qi(t))
    throw new Error("Expected private key: 0 < key < n");
  return t;
}
function Sf(e) {
  return e instanceof at ? (e.assertValidity(), e) : at.fromHex(e);
}
function Sy(e) {
  if (e instanceof pr)
    return e.assertValidity(), e;
  try {
    return pr.fromDER(e);
  } catch {
    return pr.fromCompact(e);
  }
}
function Qa(e, t = !1) {
  return at.fromPrivateKey(e).toRawBytes(t);
}
function h2(e, t, n, r = !1) {
  return at.fromSignature(e, t, n).toRawBytes(r);
}
function Sp(e) {
  const t = e instanceof Uint8Array, n = typeof e == "string", r = (t || n) && e.length;
  return t ? r === sl || r === ol : n ? r === sl * 2 || r === ol * 2 : e instanceof at;
}
function vf(e, t, n = !1) {
  if (Sp(e))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Sp(t))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Sf(t);
  return r.assertValidity(), r.multiply(Yo(e)).toRawBytes(n);
}
function vy(e) {
  const t = e.length > Hr ? e.slice(0, Hr) : e;
  return gr(t);
}
function p2(e) {
  const t = vy(e), n = ye(t, Ct.n);
  return Ay(n < gt ? t : n);
}
function Ay(e) {
  return Yi(e);
}
function Ey(e, t, n) {
  if (e == null)
    throw new Error(`sign: expected valid message hash, not "${e}"`);
  const r = as(e), o = Yo(t), s = [Ay(o), p2(r)];
  if (n != null) {
    n === !0 && (n = nn.randomBytes(Hr));
    const c = as(n);
    if (c.length !== Hr)
      throw new Error(`sign: Expected ${Hr} bytes of extra data`);
    s.push(c);
  }
  const i = ho(...s), a = vy(r);
  return { seed: i, m: a, d: o };
}
function ky(e, t) {
  const { sig: n, recovery: r } = e, { der: o, recovered: s } = Object.assign({ canonical: !0, der: !0 }, t), i = o ? n.toDERRawBytes() : n.toCompactRawBytes();
  return s ? [i, r] : i;
}
async function g2(e, t, n = {}) {
  const { seed: r, m: o, d: s } = Ey(e, t, n.extraEntropy), i = new by(my, Xo);
  await i.reseed(r);
  let a;
  for (; !(a = xy(await i.generate(), o, s, n.canonical)); )
    await i.reseed();
  return ky(a, n);
}
function Hl(e, t, n = {}) {
  const { seed: r, m: o, d: s } = Ey(e, t, n.extraEntropy), i = new by(my, Xo);
  i.reseedSync(r);
  let a;
  for (; !(a = xy(i.generateSync(), o, s, n.canonical)); )
    i.reseedSync();
  return ky(a, n);
}
const y2 = { strict: !0 };
function w2(e, t, n, r = y2) {
  let o;
  try {
    o = Sy(e), t = as(t);
  } catch {
    return !1;
  }
  const { r: s, s: i } = o;
  if (r.strict && o.hasHighS())
    return !1;
  const a = xf(t);
  let c;
  try {
    c = Sf(n);
  } catch {
    return !1;
  }
  const { n: u } = Ct, h = la(i, u), d = ye(a * h, u), m = ye(s * h, u), w = at.BASE.multiplyAndAddUnsafe(c, d, m);
  return w ? ye(w.x, u) === s : !1;
}
function al(e) {
  return ye(gr(e), Ct.n);
}
class Wi {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromHex(t) {
    const n = as(t);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = gr(n.subarray(0, 32)), o = gr(n.subarray(32, 64));
    return new Wi(r, o);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!Vc(t) || !qi(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return yo(this.r) + yo(this.s);
  }
  toRawBytes() {
    return wo(this.toHex());
  }
}
function m2(e) {
  return at.fromPrivateKey(e).toRawX();
}
class $y {
  constructor(t, n, r = nn.randomBytes()) {
    if (t == null)
      throw new TypeError(`sign: Expected valid message, not "${t}"`);
    this.m = as(t);
    const { x: o, scalar: s } = this.getScalar(Yo(n));
    if (this.px = o, this.d = s, this.rand = as(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(t) {
    const n = at.fromPrivateKey(t), r = n.hasEvenY() ? t : Ct.n - t;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(t, n) {
    return Yi(t ^ gr(n));
  }
  finalizeNonce(t) {
    const n = ye(gr(t), Ct.n);
    if (n === gt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: o, scalar: s } = this.getScalar(n);
    return { R: r, rx: o, k: s };
  }
  finalizeSig(t, n, r, o) {
    return new Wi(t.x, ye(n + r * o, Ct.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: t, d: n, px: r, rand: o } = this, s = nn.taggedHash, i = this.initNonce(n, await s(fo.aux, o)), { R: a, rx: c, k: u } = this.finalizeNonce(await s(fo.nonce, i, r, t)), h = al(await s(fo.challenge, c, r, t)), d = this.finalizeSig(a, u, h, n);
    return await Cy(d, t, r) || this.error(), d;
  }
  calcSync() {
    const { m: t, d: n, px: r, rand: o } = this, s = nn.taggedHashSync, i = this.initNonce(n, s(fo.aux, o)), { R: a, rx: c, k: u } = this.finalizeNonce(s(fo.nonce, i, r, t)), h = al(s(fo.challenge, c, r, t)), d = this.finalizeSig(a, u, h, n);
    return Ty(d, t, r) || this.error(), d;
  }
}
async function b2(e, t, n) {
  return new $y(e, t, n).calc();
}
function x2(e, t, n) {
  return new $y(e, t, n).calcSync();
}
function Iy(e, t, n) {
  const r = e instanceof Wi, o = r ? e : Wi.fromHex(e);
  return r && o.assertValidity(), {
    ...o,
    m: as(t),
    P: Sf(n)
  };
}
function Ly(e, t, n, r) {
  const o = at.BASE.multiplyAndAddUnsafe(t, Yo(n), ye(-r, Ct.n));
  return !(!o || !o.hasEvenY() || o.x !== e);
}
async function Cy(e, t, n) {
  try {
    const { r, s: o, m: s, P: i } = Iy(e, t, n), a = al(await nn.taggedHash(fo.challenge, Yi(r), i.toRawX(), s));
    return Ly(r, i, o, a);
  } catch {
    return !1;
  }
}
function Ty(e, t, n) {
  try {
    const { r, s: o, m: s, P: i } = Iy(e, t, n), a = al(nn.taggedHashSync(fo.challenge, Yi(r), i.toRawX(), s));
    return Ly(r, i, o, a);
  } catch (r) {
    if (r instanceof bf)
      throw r;
    return !1;
  }
}
const S2 = {
  Signature: Wi,
  getPublicKey: m2,
  sign: b2,
  verify: Cy,
  signSync: x2,
  verifySync: Ty
};
at.BASE._setWindowSize(8);
const ar = {
  node: wy,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, fo = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, gc = {}, nn = {
  bytesToHex: Xi,
  hexToBytes: wo,
  concatBytes: ho,
  mod: ye,
  invert: la,
  isValidPrivateKey(e) {
    try {
      return Yo(e), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Yi,
  _normalizePrivateKey: Yo,
  hashToPrivateKey: (e) => {
    e = as(e);
    const t = Xo + 8;
    if (e.length < t || e.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = ye(gr(e), Ct.n - Gt) + Gt;
    return Yi(n);
  },
  randomBytes: (e = 32) => {
    if (ar.web)
      return ar.web.getRandomValues(new Uint8Array(e));
    if (ar.node) {
      const { randomBytes: t } = ar.node;
      return Uint8Array.from(t(e));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => nn.hashToPrivateKey(nn.randomBytes(Xo + 8)),
  precompute(e = 8, t = at.BASE) {
    const n = t === at.BASE ? t : new at(t.x, t.y);
    return n._setWindowSize(e), n.multiply(Ba), n;
  },
  sha256: async (...e) => {
    if (ar.web) {
      const t = await ar.web.subtle.digest("SHA-256", ho(...e));
      return new Uint8Array(t);
    } else if (ar.node) {
      const { createHash: t } = ar.node, n = t("sha256");
      return e.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (e, ...t) => {
    if (ar.web) {
      const n = await ar.web.subtle.importKey("raw", e, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = ho(...t), o = await ar.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(o);
    } else if (ar.node) {
      const { createHmac: n } = ar.node, r = n("sha256", e);
      return t.forEach((o) => r.update(o)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (e, ...t) => {
    let n = gc[e];
    if (n === void 0) {
      const r = await nn.sha256(Uint8Array.from(e, (o) => o.charCodeAt(0)));
      n = ho(r, r), gc[e] = n;
    }
    return nn.sha256(n, ...t);
  },
  taggedHashSync: (e, ...t) => {
    if (typeof Ri != "function")
      throw new bf("sha256Sync is undefined, you need to set it");
    let n = gc[e];
    if (n === void 0) {
      const r = Ri(Uint8Array.from(e, (o) => o.charCodeAt(0)));
      n = ho(r, r), gc[e] = n;
    }
    return Ri(n, ...t);
  },
  _JacobianPoint: vt
};
Object.defineProperties(nn, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Ri;
    },
    set(e) {
      Ri || (Ri = e);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Na;
    },
    set(e) {
      Na || (Na = e);
    }
  }
});
const v2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: Ct,
  Point: at,
  Signature: pr,
  getPublicKey: Qa,
  getSharedSecret: vf,
  recoverPublicKey: h2,
  schnorr: S2,
  sign: g2,
  signSync: Hl,
  utils: nn,
  verify: w2
}, Symbol.toStringTag, { value: "Module" }));
var ec = {};
ec.byteLength = I2;
var A2 = ec.toByteArray = C2, E2 = ec.fromByteArray = N2, es = [], Ar = [], k2 = typeof Uint8Array < "u" ? Uint8Array : Array, Au = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Ii = 0, $2 = Au.length; Ii < $2; ++Ii)
  es[Ii] = Au[Ii], Ar[Au.charCodeAt(Ii)] = Ii;
Ar[45] = 62;
Ar[95] = 63;
function By(e) {
  var t = e.length;
  if (t % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = e.indexOf("=");
  n === -1 && (n = t);
  var r = n === t ? 0 : 4 - n % 4;
  return [n, r];
}
function I2(e) {
  var t = By(e), n = t[0], r = t[1];
  return (n + r) * 3 / 4 - r;
}
function L2(e, t, n) {
  return (t + n) * 3 / 4 - n;
}
function C2(e) {
  var t, n = By(e), r = n[0], o = n[1], s = new k2(L2(e, r, o)), i = 0, a = o > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    t = Ar[e.charCodeAt(c)] << 18 | Ar[e.charCodeAt(c + 1)] << 12 | Ar[e.charCodeAt(c + 2)] << 6 | Ar[e.charCodeAt(c + 3)], s[i++] = t >> 16 & 255, s[i++] = t >> 8 & 255, s[i++] = t & 255;
  return o === 2 && (t = Ar[e.charCodeAt(c)] << 2 | Ar[e.charCodeAt(c + 1)] >> 4, s[i++] = t & 255), o === 1 && (t = Ar[e.charCodeAt(c)] << 10 | Ar[e.charCodeAt(c + 1)] << 4 | Ar[e.charCodeAt(c + 2)] >> 2, s[i++] = t >> 8 & 255, s[i++] = t & 255), s;
}
function T2(e) {
  return es[e >> 18 & 63] + es[e >> 12 & 63] + es[e >> 6 & 63] + es[e & 63];
}
function B2(e, t, n) {
  for (var r, o = [], s = t; s < n; s += 3)
    r = (e[s] << 16 & 16711680) + (e[s + 1] << 8 & 65280) + (e[s + 2] & 255), o.push(T2(r));
  return o.join("");
}
function N2(e) {
  for (var t, n = e.length, r = n % 3, o = [], s = 16383, i = 0, a = n - r; i < a; i += s)
    o.push(B2(e, i, i + s > a ? a : i + s));
  return r === 1 ? (t = e[n - 1], o.push(
    es[t >> 2] + es[t << 4 & 63] + "=="
  )) : r === 2 && (t = (e[n - 2] << 8) + e[n - 1], o.push(
    es[t >> 10] + es[t >> 4 & 63] + es[t << 2 & 63] + "="
  )), o.join("");
}
function M2() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const _2 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function P2() {
  if (M2())
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
    throw new Error(_2);
  }
}
class U2 {
  constructor(t, n) {
    this.createCipher = t, this.createDecipher = n;
  }
  async encrypt(t, n, r, o) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const s = this.createCipher(t, n, r), i = new Uint8Array(is(s.update(o), s.final()));
    return Promise.resolve(i);
  }
  async decrypt(t, n, r, o) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const s = this.createDecipher(t, n, r), i = new Uint8Array(is(s.update(o), s.final()));
    return Promise.resolve(i);
  }
}
class O2 {
  constructor(t) {
    this.subtleCrypto = t;
  }
  async encrypt(t, n, r, o) {
    let s, i;
    if (t === "aes-128-cbc")
      s = "AES-CBC", i = 128;
    else if (t === "aes-256-cbc")
      s = "AES-CBC", i = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: s, length: i }, !1, ["encrypt"]), c = await this.subtleCrypto.encrypt({ name: s, iv: r }, a, o);
    return new Uint8Array(c);
  }
  async decrypt(t, n, r, o) {
    let s, i;
    if (t === "aes-128-cbc")
      s = "AES-CBC", i = 128;
    else if (t === "aes-256-cbc")
      s = "AES-CBC", i = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: s, length: i }, !1, ["decrypt"]), c = await this.subtleCrypto.decrypt({ name: s, iv: r }, a, o);
    return new Uint8Array(c);
  }
}
async function Ny() {
  const e = await P2();
  return e.name === "subtleCrypto" ? new O2(e.lib) : new U2(e.lib.createCipheriv, e.lib.createDecipheriv);
}
function H2(e) {
  if (e.length >= 255)
    throw new TypeError("Alphabet too long");
  for (var t = new Uint8Array(256), n = 0; n < t.length; n++)
    t[n] = 255;
  for (var r = 0; r < e.length; r++) {
    var o = e.charAt(r), s = o.charCodeAt(0);
    if (t[s] !== 255)
      throw new TypeError(o + " is ambiguous");
    t[s] = r;
  }
  var i = e.length, a = e.charAt(0), c = Math.log(i) / Math.log(256), u = Math.log(256) / Math.log(i);
  function h(w) {
    if (w instanceof Uint8Array || (ArrayBuffer.isView(w) ? w = new Uint8Array(w.buffer, w.byteOffset, w.byteLength) : Array.isArray(w) && (w = Uint8Array.from(w))), !(w instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (w.length === 0)
      return "";
    for (var v = 0, x = 0, L = 0, N = w.length; L !== N && w[L] === 0; )
      L++, v++;
    for (var U = (N - L) * u + 1 >>> 0, A = new Uint8Array(U); L !== N; ) {
      for (var T = w[L], B = 0, X = U - 1; (T !== 0 || B < x) && X !== -1; X--, B++)
        T += 256 * A[X] >>> 0, A[X] = T % i >>> 0, T = T / i >>> 0;
      if (T !== 0)
        throw new Error("Non-zero carry");
      x = B, L++;
    }
    for (var Q = U - x; Q !== U && A[Q] === 0; )
      Q++;
    for (var oe = a.repeat(v); Q < U; ++Q)
      oe += e.charAt(A[Q]);
    return oe;
  }
  function d(w) {
    if (typeof w != "string")
      throw new TypeError("Expected String");
    if (w.length === 0)
      return new Uint8Array();
    for (var v = 0, x = 0, L = 0; w[v] === a; )
      x++, v++;
    for (var N = (w.length - v) * c + 1 >>> 0, U = new Uint8Array(N); w[v]; ) {
      var A = w.charCodeAt(v);
      if (A > 255)
        return;
      var T = t[A];
      if (T === 255)
        return;
      for (var B = 0, X = N - 1; (T !== 0 || B < L) && X !== -1; X--, B++)
        T += i * U[X] >>> 0, U[X] = T % 256 >>> 0, T = T / 256 >>> 0;
      if (T !== 0)
        throw new Error("Non-zero carry");
      L = B, v++;
    }
    for (var Q = N - L; Q !== N && U[Q] === 0; )
      Q++;
    for (var oe = new Uint8Array(x + (N - Q)), Y = x; Q !== N; )
      oe[Y++] = U[Q++];
    return oe;
  }
  function m(w) {
    var v = d(w);
    if (v)
      return v;
    throw new Error("Non-base" + i + " character");
  }
  return {
    encode: h,
    decodeUnsafe: d,
    decode: m
  };
}
var My = H2;
const D2 = My, F2 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var j2 = D2(F2);
const R2 = /* @__PURE__ */ ry(j2), z2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), _y = Uint8Array.from({ length: 16 }, (e, t) => t), G2 = _y.map((e) => (9 * e + 5) % 16);
let Af = [_y], Ef = [G2];
for (let e = 0; e < 4; e++)
  for (let t of [Af, Ef])
    t.push(t[e].map((n) => z2[n]));
const Py = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), K2 = Af.map((e, t) => e.map((n) => Py[t][n])), V2 = Ef.map((e, t) => e.map((n) => Py[t][n])), X2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Y2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), yc = (e, t) => e << t | e >>> 32 - t;
function vp(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const wc = new Uint32Array(16);
let q2 = class extends mf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: o, h4: s } = this;
    return [t, n, r, o, s];
  }
  set(t, n, r, o, s) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = o | 0, this.h4 = s | 0;
  }
  process(t, n) {
    for (let w = 0; w < 16; w++, n += 4)
      wc[w] = t.getUint32(n, !0);
    let r = this.h0 | 0, o = r, s = this.h1 | 0, i = s, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, m = d;
    for (let w = 0; w < 5; w++) {
      const v = 4 - w, x = X2[w], L = Y2[w], N = Af[w], U = Ef[w], A = K2[w], T = V2[w];
      for (let B = 0; B < 16; B++) {
        const X = yc(r + vp(w, s, a, u) + wc[N[B]] + x, A[B]) + d | 0;
        r = d, d = u, u = yc(a, 10) | 0, a = s, s = X;
      }
      for (let B = 0; B < 16; B++) {
        const X = yc(o + vp(v, i, c, h) + wc[U[B]] + L, T[B]) + m | 0;
        o = m, m = h, h = yc(c, 10) | 0, c = i, i = X;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + m | 0, this.h3 + d + o | 0, this.h4 + r + i | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    wc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const W2 = li(() => new q2());
function Z2(e) {
  return W2(e);
}
const mc = BigInt(2 ** 32 - 1), ud = BigInt(32);
function Uy(e, t = !1) {
  return t ? { h: Number(e & mc), l: Number(e >> ud & mc) } : { h: Number(e >> ud & mc) | 0, l: Number(e & mc) | 0 };
}
function J2(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let o = 0; o < e.length; o++) {
    const { h: s, l: i } = Uy(e[o], t);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const Q2 = (e, t) => BigInt(e >>> 0) << ud | BigInt(t >>> 0), ex = (e, t, n) => e >>> n, tx = (e, t, n) => e << 32 - n | t >>> n, nx = (e, t, n) => e >>> n | t << 32 - n, rx = (e, t, n) => e << 32 - n | t >>> n, sx = (e, t, n) => e << 64 - n | t >>> n - 32, ox = (e, t, n) => e >>> n - 32 | t << 64 - n, ix = (e, t) => t, ax = (e, t) => e, cx = (e, t, n) => e << n | t >>> 32 - n, lx = (e, t, n) => t << n | e >>> 32 - n, ux = (e, t, n) => t << n - 32 | e >>> 64 - n, dx = (e, t, n) => e << n - 32 | t >>> 64 - n;
function fx(e, t, n, r) {
  const o = (t >>> 0) + (r >>> 0);
  return { h: e + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const hx = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), px = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, gx = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), yx = (e, t, n, r, o) => t + n + r + o + (e / 2 ** 32 | 0) | 0, wx = (e, t, n, r, o) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), mx = (e, t, n, r, o, s) => t + n + r + o + s + (e / 2 ** 32 | 0) | 0, Je = {
  fromBig: Uy,
  split: J2,
  toBig: Q2,
  shrSH: ex,
  shrSL: tx,
  rotrSH: nx,
  rotrSL: rx,
  rotrBH: sx,
  rotrBL: ox,
  rotr32H: ix,
  rotr32L: ax,
  rotlSH: cx,
  rotlSL: lx,
  rotlBH: ux,
  rotlBL: dx,
  add: fx,
  add3L: hx,
  add3H: px,
  add4L: gx,
  add4H: yx,
  add5H: mx,
  add5L: wx
}, [bx, xx] = Je.split([
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
].map((e) => BigInt(e))), zs = new Uint32Array(80), Gs = new Uint32Array(80);
let Dl = class extends mf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: m, Gh: w, Gl: v, Hh: x, Hl: L } = this;
    return [t, n, r, o, s, i, a, c, u, h, d, m, w, v, x, L];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c, u, h, d, m, w, v, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = m | 0, this.Gh = w | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      zs[A] = t.getUint32(n), Gs[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = zs[A - 15] | 0, B = Gs[A - 15] | 0, X = Je.rotrSH(T, B, 1) ^ Je.rotrSH(T, B, 8) ^ Je.shrSH(T, B, 7), Q = Je.rotrSL(T, B, 1) ^ Je.rotrSL(T, B, 8) ^ Je.shrSL(T, B, 7), oe = zs[A - 2] | 0, Y = Gs[A - 2] | 0, b = Je.rotrSH(oe, Y, 19) ^ Je.rotrBH(oe, Y, 61) ^ Je.shrSH(oe, Y, 6), I = Je.rotrSL(oe, Y, 19) ^ Je.rotrBL(oe, Y, 61) ^ Je.shrSL(oe, Y, 6), M = Je.add4L(Q, I, Gs[A - 7], Gs[A - 16]), P = Je.add4H(M, X, b, zs[A - 7], zs[A - 16]);
      zs[A] = P | 0, Gs[A] = M | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: m, Fh: w, Fl: v, Gh: x, Gl: L, Hh: N, Hl: U } = this;
    for (let A = 0; A < 80; A++) {
      const T = Je.rotrSH(d, m, 14) ^ Je.rotrSH(d, m, 18) ^ Je.rotrBH(d, m, 41), B = Je.rotrSL(d, m, 14) ^ Je.rotrSL(d, m, 18) ^ Je.rotrBL(d, m, 41), X = d & w ^ ~d & x, Q = m & v ^ ~m & L, oe = Je.add5L(U, B, Q, xx[A], Gs[A]), Y = Je.add5H(oe, N, T, X, bx[A], zs[A]), b = oe | 0, I = Je.rotrSH(r, o, 28) ^ Je.rotrBH(r, o, 34) ^ Je.rotrBH(r, o, 39), M = Je.rotrSL(r, o, 28) ^ Je.rotrBL(r, o, 34) ^ Je.rotrBL(r, o, 39), P = r & s ^ r & a ^ s & a, W = o & i ^ o & c ^ i & c;
      N = x | 0, U = L | 0, x = w | 0, L = v | 0, w = d | 0, v = m | 0, { h: d, l: m } = Je.add(u | 0, h | 0, Y | 0, b | 0), u = a | 0, h = c | 0, a = s | 0, c = i | 0, s = r | 0, i = o | 0;
      const R = Je.add3L(b, M, W);
      r = Je.add3H(R, Y, I, P), o = R | 0;
    }
    ({ h: r, l: o } = Je.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = Je.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: a, l: c } = Je.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Je.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: m } = Je.add(this.Eh | 0, this.El | 0, d | 0, m | 0), { h: w, l: v } = Je.add(this.Fh | 0, this.Fl | 0, w | 0, v | 0), { h: x, l: L } = Je.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: N, l: U } = Je.add(this.Hh | 0, this.Hl | 0, N | 0, U | 0), this.set(r, o, s, i, a, c, u, h, d, m, w, v, x, L, N, U);
  }
  roundClean() {
    zs.fill(0), Gs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Sx = class extends Dl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, vx = class extends Dl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Ax = class extends Dl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const Ex = li(() => new Dl());
li(() => new Sx());
li(() => new vx());
li(() => new Ax());
function Oy(e) {
  return Vi(e);
}
function kx(e) {
  return Ex(e);
}
const $x = 0;
nn.hmacSha256Sync = (e, ...t) => {
  const n = Ol.create(Vi, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Ix() {
  return Ue(nn.randomPrivateKey());
}
function Lx(e) {
  const t = Vi(Vi(e));
  return R2.encode(is(e, t).slice(0, e.length + 4));
}
function Cx(e, t) {
  return Lx(is(new Uint8Array([e]), t.slice(0, 20)));
}
function Hy(e, t = $x) {
  const n = typeof e == "string" ? mt(e) : e, r = Z2(Oy(n));
  return Cx(t, r);
}
function Dy(e) {
  const t = yf(e);
  return Ue(Qa(t.slice(0, 32), !0));
}
nn.hmacSha256Sync = (e, ...t) => {
  const n = Ol.create(Vi, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
var cl;
(function(e) {
  e.InvalidFormat = "InvalidFormat", e.IsNotPoint = "IsNotPoint";
})(cl || (cl = {}));
async function Tx(e, t, n) {
  return await (await Ny()).encrypt("aes-256-cbc", t, e, n);
}
async function Bx(e, t, n) {
  return await (await Ny()).decrypt("aes-256-cbc", t, e, n);
}
function Fy(e, t) {
  return Ol(Vi, e, t);
}
function Nx(e, t) {
  if (e.length !== t.length)
    return !1;
  let n = 0;
  for (let r = 0; r < e.length; r++)
    n |= e[r] ^ t[r];
  return n === 0;
}
function jy(e) {
  const t = kx(e);
  return {
    encryptionKey: t.slice(0, 32),
    hmacKey: t.slice(32)
  };
}
function Mx(e) {
  return e.match(/^[0-9a-f]+$/i) !== null;
}
function _x(e) {
  const t = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: cl.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: cl.IsNotPoint
  };
  if (e.length !== 66 && e.length !== 130)
    return t;
  const r = e.slice(0, 2);
  if (e.length === 130 && r !== "04" || e.length === 66 && r !== "02" && r !== "03" || !Mx(e))
    return t;
  try {
    return at.fromHex(e).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function Px(e, t, n, r) {
  const o = _x(e);
  if (!o.result)
    throw o;
  const s = nn.randomPrivateKey(), i = Qa(s, !0);
  let a = vf(s, e, !0);
  a = a.slice(1);
  const c = jy(a), u = nn.randomBytes(16), h = await Tx(u, c.encryptionKey, t), d = is(u, i, h), m = Fy(c.hmacKey, d);
  let w;
  if (!r || r === "hex")
    w = Ue(h);
  else if (r === "base64")
    w = E2(h);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const v = {
    iv: Ue(u),
    ephemeralPK: Ue(i),
    cipherText: w,
    mac: Ue(m),
    wasString: n
  };
  return r && r !== "hex" && (v.cipherTextEncoding = r), v;
}
async function Ry(e, t) {
  if (!t.ephemeralPK)
    throw new up("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = t.ephemeralPK;
  let r = vf(e, n, !0);
  r = r.slice(1);
  const o = jy(r), s = mt(t.iv);
  let i;
  if (!t.cipherTextEncoding || t.cipherTextEncoding === "hex")
    i = mt(t.cipherText);
  else if (t.cipherTextEncoding === "base64")
    i = A2(t.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${t.cipherText}"`);
  const a = is(s, mt(n), i), c = Fy(o.hmacKey, a), u = mt(t.mac);
  if (!Nx(u, c))
    throw new up("Decryption failed: failure in MAC check");
  const h = await Bx(s, o.encryptionKey, i);
  return t.wasString ? Ja(h) : h;
}
function Ux(e, t) {
  const n = typeof t == "string" ? ci(t) : t, r = Dy(e), o = Oy(n), s = Hl(o, e);
  return {
    signature: Ue(s),
    publicKey: r
  };
}
async function Ox(e, t) {
  const n = Object.assign({}, t);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = Dy(n.privateKey);
  }
  const o = typeof n.wasString == "boolean" ? n.wasString : typeof e == "string", s = typeof e == "string" ? ci(e) : e, i = await Px(n.publicKey, s, o, n.cipherTextEncoding);
  let a = JSON.stringify(i);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = Ux(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function Hx(e, t) {
  const n = Object.assign({}, t);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(e);
    return Ry(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var Bn = {}, Zi = {}, Rn = {};
Object.defineProperty(Rn, "__esModule", { value: !0 });
Rn.decode = Rn.encode = Rn.unescape = Rn.escape = Rn.pad = void 0;
const zy = ec;
function kf(e) {
  return `${e}${"=".repeat(4 - (e.length % 4 || 4))}`;
}
Rn.pad = kf;
function Gy(e) {
  return e.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Rn.escape = Gy;
function Ky(e) {
  return kf(e).replace(/-/g, "+").replace(/_/g, "/");
}
Rn.unescape = Ky;
function Dx(e) {
  return Gy((0, zy.fromByteArray)(new TextEncoder().encode(e)));
}
Rn.encode = Dx;
function Fx(e) {
  return new TextDecoder().decode((0, zy.toByteArray)(kf(Ky(e))));
}
Rn.decode = Fx;
var Fl = {}, jl = {}, Vy = {}, Xy = {}, Rl = {};
Object.defineProperty(Rl, "__esModule", { value: !0 });
Rl.crypto = void 0;
Rl.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(e) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(e, "__esModule", { value: !0 }), e.wrapXOFConstructorWithOpts = e.wrapConstructorWithOpts = e.wrapConstructor = e.Hash = e.nextTick = e.swap32IfBE = e.byteSwapIfBE = e.swap8IfBE = e.isLE = void 0, e.isBytes = n, e.anumber = r, e.abytes = o, e.ahash = s, e.aexists = i, e.aoutput = a, e.u8 = c, e.u32 = u, e.clean = h, e.createView = d, e.rotr = m, e.rotl = w, e.byteSwap = v, e.byteSwap32 = x, e.bytesToHex = U, e.hexToBytes = B, e.asyncLoop = Q, e.utf8ToBytes = oe, e.bytesToUtf8 = Y, e.toBytes = b, e.kdfInputToBytes = I, e.concatBytes = M, e.checkOpts = P, e.createHasher = R, e.createOptHasher = le, e.createXOFer = ue, e.randomBytes = Xe;
  const t = Rl;
  function n(C) {
    return C instanceof Uint8Array || ArrayBuffer.isView(C) && C.constructor.name === "Uint8Array";
  }
  function r(C) {
    if (!Number.isSafeInteger(C) || C < 0)
      throw new Error("positive integer expected, got " + C);
  }
  function o(C, ...F) {
    if (!n(C))
      throw new Error("Uint8Array expected");
    if (F.length > 0 && !F.includes(C.length))
      throw new Error("Uint8Array expected of length " + F + ", got length=" + C.length);
  }
  function s(C) {
    if (typeof C != "function" || typeof C.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(C.outputLen), r(C.blockLen);
  }
  function i(C, F = !0) {
    if (C.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (F && C.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(C, F) {
    o(C);
    const re = F.outputLen;
    if (C.length < re)
      throw new Error("digestInto() expects output buffer of length at least " + re);
  }
  function c(C) {
    return new Uint8Array(C.buffer, C.byteOffset, C.byteLength);
  }
  function u(C) {
    return new Uint32Array(C.buffer, C.byteOffset, Math.floor(C.byteLength / 4));
  }
  function h(...C) {
    for (let F = 0; F < C.length; F++)
      C[F].fill(0);
  }
  function d(C) {
    return new DataView(C.buffer, C.byteOffset, C.byteLength);
  }
  function m(C, F) {
    return C << 32 - F | C >>> F;
  }
  function w(C, F) {
    return C << F | C >>> 32 - F >>> 0;
  }
  e.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function v(C) {
    return C << 24 & 4278190080 | C << 8 & 16711680 | C >>> 8 & 65280 | C >>> 24 & 255;
  }
  e.swap8IfBE = e.isLE ? (C) => C : (C) => v(C), e.byteSwapIfBE = e.swap8IfBE;
  function x(C) {
    for (let F = 0; F < C.length; F++)
      C[F] = v(C[F]);
    return C;
  }
  e.swap32IfBE = e.isLE ? (C) => C : x;
  const L = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", N = /* @__PURE__ */ Array.from({ length: 256 }, (C, F) => F.toString(16).padStart(2, "0"));
  function U(C) {
    if (o(C), L)
      return C.toHex();
    let F = "";
    for (let re = 0; re < C.length; re++)
      F += N[C[re]];
    return F;
  }
  const A = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function T(C) {
    if (C >= A._0 && C <= A._9)
      return C - A._0;
    if (C >= A.A && C <= A.F)
      return C - (A.A - 10);
    if (C >= A.a && C <= A.f)
      return C - (A.a - 10);
  }
  function B(C) {
    if (typeof C != "string")
      throw new Error("hex string expected, got " + typeof C);
    if (L)
      return Uint8Array.fromHex(C);
    const F = C.length, re = F / 2;
    if (F % 2)
      throw new Error("hex string expected, got unpadded hex of length " + F);
    const de = new Uint8Array(re);
    for (let Be = 0, Me = 0; Be < re; Be++, Me += 2) {
      const Ot = T(C.charCodeAt(Me)), Ge = T(C.charCodeAt(Me + 1));
      if (Ot === void 0 || Ge === void 0) {
        const _e = C[Me] + C[Me + 1];
        throw new Error('hex string expected, got non-hex character "' + _e + '" at index ' + Me);
      }
      de[Be] = Ot * 16 + Ge;
    }
    return de;
  }
  const X = async () => {
  };
  e.nextTick = X;
  async function Q(C, F, re) {
    let de = Date.now();
    for (let Be = 0; Be < C; Be++) {
      re(Be);
      const Me = Date.now() - de;
      Me >= 0 && Me < F || (await (0, e.nextTick)(), de += Me);
    }
  }
  function oe(C) {
    if (typeof C != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(C));
  }
  function Y(C) {
    return new TextDecoder().decode(C);
  }
  function b(C) {
    return typeof C == "string" && (C = oe(C)), o(C), C;
  }
  function I(C) {
    return typeof C == "string" && (C = oe(C)), o(C), C;
  }
  function M(...C) {
    let F = 0;
    for (let de = 0; de < C.length; de++) {
      const Be = C[de];
      o(Be), F += Be.length;
    }
    const re = new Uint8Array(F);
    for (let de = 0, Be = 0; de < C.length; de++) {
      const Me = C[de];
      re.set(Me, Be), Be += Me.length;
    }
    return re;
  }
  function P(C, F) {
    if (F !== void 0 && {}.toString.call(F) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(C, F);
  }
  class W {
  }
  e.Hash = W;
  function R(C) {
    const F = (de) => C().update(b(de)).digest(), re = C();
    return F.outputLen = re.outputLen, F.blockLen = re.blockLen, F.create = () => C(), F;
  }
  function le(C) {
    const F = (de, Be) => C(Be).update(b(de)).digest(), re = C({});
    return F.outputLen = re.outputLen, F.blockLen = re.blockLen, F.create = (de) => C(de), F;
  }
  function ue(C) {
    const F = (de, Be) => C(Be).update(b(de)).digest(), re = C({});
    return F.outputLen = re.outputLen, F.blockLen = re.blockLen, F.create = (de) => C(de), F;
  }
  e.wrapConstructor = R, e.wrapConstructorWithOpts = le, e.wrapXOFConstructorWithOpts = ue;
  function Xe(C = 32) {
    if (t.crypto && typeof t.crypto.getRandomValues == "function")
      return t.crypto.getRandomValues(new Uint8Array(C));
    if (t.crypto && typeof t.crypto.randomBytes == "function")
      return Uint8Array.from(t.crypto.randomBytes(C));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(Xy);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.hmac = e.HMAC = void 0;
  const t = Xy;
  class n extends t.Hash {
    constructor(s, i) {
      super(), this.finished = !1, this.destroyed = !1, (0, t.ahash)(s);
      const a = (0, t.toBytes)(i);
      if (this.iHash = s.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, u = new Uint8Array(c);
      u.set(a.length > c ? s.create().update(a).digest() : a);
      for (let h = 0; h < u.length; h++)
        u[h] ^= 54;
      this.iHash.update(u), this.oHash = s.create();
      for (let h = 0; h < u.length; h++)
        u[h] ^= 106;
      this.oHash.update(u), (0, t.clean)(u);
    }
    update(s) {
      return (0, t.aexists)(this), this.iHash.update(s), this;
    }
    digestInto(s) {
      (0, t.aexists)(this), (0, t.abytes)(s, this.outputLen), this.finished = !0, this.iHash.digestInto(s), this.oHash.update(s), this.oHash.digestInto(s), this.destroy();
    }
    digest() {
      const s = new Uint8Array(this.oHash.outputLen);
      return this.digestInto(s), s;
    }
    _cloneInto(s) {
      s || (s = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash: i, iHash: a, finished: c, destroyed: u, blockLen: h, outputLen: d } = this;
      return s = s, s.finished = c, s.destroyed = u, s.blockLen = h, s.outputLen = d, s.oHash = i._cloneInto(s.oHash), s.iHash = a._cloneInto(s.iHash), s;
    }
    clone() {
      return this._cloneInto();
    }
    destroy() {
      this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
    }
  }
  e.HMAC = n;
  const r = (o, s, i) => new n(o, s).update(i).digest();
  e.hmac = r, e.hmac.create = (o, s) => new n(o, s);
})(Vy);
const Li = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Yy(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function dd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error("positive integer expected, got " + e);
}
function ui(e, ...t) {
  if (!Yy(e))
    throw new Error("Uint8Array expected");
  if (t.length > 0 && !t.includes(e.length))
    throw new Error("Uint8Array expected of length " + t + ", got length=" + e.length);
}
function jx(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  dd(e.outputLen), dd(e.blockLen);
}
function fd(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function qy(e, t) {
  ui(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function Rx(e) {
  return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
}
function zx(e) {
  return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function ll(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
function Xc(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function Tr(e, t) {
  return e << 32 - t | e >>> t;
}
function Gx(e, t) {
  return e << t | e >>> 32 - t >>> 0;
}
const $f = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function If(e) {
  return e << 24 & 4278190080 | e << 8 & 16711680 | e >>> 8 & 65280 | e >>> 24 & 255;
}
const Wy = $f ? (e) => e : (e) => If(e), Kx = Wy;
function Zy(e) {
  for (let t = 0; t < e.length; t++)
    e[t] = If(e[t]);
  return e;
}
const Vx = $f ? (e) => e : Zy, Jy = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", Xx = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Lf(e) {
  if (ui(e), Jy)
    return e.toHex();
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += Xx[e[n]];
  return t;
}
const Ss = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Ap(e) {
  if (e >= Ss._0 && e <= Ss._9)
    return e - Ss._0;
  if (e >= Ss.A && e <= Ss.F)
    return e - (Ss.A - 10);
  if (e >= Ss.a && e <= Ss.f)
    return e - (Ss.a - 10);
}
function Yx(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  if (Jy)
    return Uint8Array.fromHex(e);
  const t = e.length, n = t / 2;
  if (t % 2)
    throw new Error("hex string expected, got unpadded hex of length " + t);
  const r = new Uint8Array(n);
  for (let o = 0, s = 0; o < n; o++, s += 2) {
    const i = Ap(e.charCodeAt(s)), a = Ap(e.charCodeAt(s + 1));
    if (i === void 0 || a === void 0) {
      const c = e[s] + e[s + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + s);
    }
    r[o] = i * 16 + a;
  }
  return r;
}
const Qy = async () => {
};
async function qx(e, t, n) {
  let r = Date.now();
  for (let o = 0; o < e; o++) {
    n(o);
    const s = Date.now() - r;
    s >= 0 && s < t || (await Qy(), r += s);
  }
}
function Cf(e) {
  if (typeof e != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(e));
}
function Wx(e) {
  return new TextDecoder().decode(e);
}
function tc(e) {
  return typeof e == "string" && (e = Cf(e)), ui(e), e;
}
function Zx(e) {
  return typeof e == "string" && (e = Cf(e)), ui(e), e;
}
function Jx(...e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const o = e[r];
    ui(o), t += o.length;
  }
  const n = new Uint8Array(t);
  for (let r = 0, o = 0; r < e.length; r++) {
    const s = e[r];
    n.set(s, o), o += s.length;
  }
  return n;
}
function Qx(e, t) {
  if (t !== void 0 && {}.toString.call(t) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(e, t);
}
let ew = class {
};
function zl(e) {
  const t = (r) => e().update(tc(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function tw(e) {
  const t = (r, o) => e(o).update(tc(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
function nw(e) {
  const t = (r, o) => e(o).update(tc(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
const eS = zl, tS = tw, nS = nw;
function rS(e = 32) {
  if (Li && typeof Li.getRandomValues == "function")
    return Li.getRandomValues(new Uint8Array(e));
  if (Li && typeof Li.randomBytes == "function")
    return Uint8Array.from(Li.randomBytes(e));
  throw new Error("crypto.getRandomValues must be defined");
}
const sS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: ew,
  abytes: ui,
  aexists: fd,
  ahash: jx,
  anumber: dd,
  aoutput: qy,
  asyncLoop: qx,
  byteSwap: If,
  byteSwap32: Zy,
  byteSwapIfBE: Kx,
  bytesToHex: Lf,
  bytesToUtf8: Wx,
  checkOpts: Qx,
  clean: ll,
  concatBytes: Jx,
  createHasher: zl,
  createOptHasher: tw,
  createView: Xc,
  createXOFer: nw,
  hexToBytes: Yx,
  isBytes: Yy,
  isLE: $f,
  kdfInputToBytes: Zx,
  nextTick: Qy,
  randomBytes: rS,
  rotl: Gx,
  rotr: Tr,
  swap32IfBE: Vx,
  swap8IfBE: Wy,
  toBytes: tc,
  u32: zx,
  u8: Rx,
  utf8ToBytes: Cf,
  wrapConstructor: eS,
  wrapConstructorWithOpts: tS,
  wrapXOFConstructorWithOpts: nS
}, Symbol.toStringTag, { value: "Module" }));
function oS(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
function iS(e, t, n) {
  return e & t ^ ~e & n;
}
function aS(e, t, n) {
  return e & t ^ e & n ^ t & n;
}
class cS extends ew {
  constructor(t, n, r, o) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.buffer = new Uint8Array(t), this.view = Xc(this.buffer);
  }
  update(t) {
    fd(this), t = tc(t), ui(t);
    const { view: n, buffer: r, blockLen: o } = this, s = t.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(o - this.pos, s - i);
      if (a === o) {
        const c = Xc(t);
        for (; o <= s - i; i += o)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    fd(this), qy(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, ll(this.buffer.subarray(i)), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let d = i; d < o; d++)
      n[d] = 0;
    oS(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Xc(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: a } = this;
    return t.destroyed = i, t.finished = s, t.length = o, t.pos = a, o % n && t.buffer.set(r), t;
  }
  clone() {
    return this._cloneInto();
  }
}
const Ks = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Vs = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), lS = /* @__PURE__ */ Uint32Array.from([
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
]), Xs = /* @__PURE__ */ new Uint32Array(64);
let Tf = class extends cS {
  constructor(t = 32) {
    super(64, t, 8, !1), this.A = Ks[0] | 0, this.B = Ks[1] | 0, this.C = Ks[2] | 0, this.D = Ks[3] | 0, this.E = Ks[4] | 0, this.F = Ks[5] | 0, this.G = Ks[6] | 0, this.H = Ks[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: s, F: i, G: a, H: c } = this;
    return [t, n, r, o, s, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      Xs[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const m = Xs[d - 15], w = Xs[d - 2], v = Tr(m, 7) ^ Tr(m, 18) ^ m >>> 3, x = Tr(w, 17) ^ Tr(w, 19) ^ w >>> 10;
      Xs[d] = x + Xs[d - 7] + v + Xs[d - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const m = Tr(a, 6) ^ Tr(a, 11) ^ Tr(a, 25), w = h + m + iS(a, c, u) + lS[d] + Xs[d] | 0, x = (Tr(r, 2) ^ Tr(r, 13) ^ Tr(r, 22)) + aS(r, o, s) | 0;
      h = u, u = c, c = a, a = i + w | 0, i = s, s = o, o = r, r = w + x | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, o, s, i, a, c, u, h);
  }
  roundClean() {
    ll(Xs);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), ll(this.buffer);
  }
}, rw = class extends Tf {
  constructor() {
    super(28), this.A = Vs[0] | 0, this.B = Vs[1] | 0, this.C = Vs[2] | 0, this.D = Vs[3] | 0, this.E = Vs[4] | 0, this.F = Vs[5] | 0, this.G = Vs[6] | 0, this.H = Vs[7] | 0;
  }
};
const uS = /* @__PURE__ */ zl(() => new Tf()), dS = /* @__PURE__ */ zl(() => new rw()), fS = Tf, Bf = uS, hS = rw, pS = dS, gS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: hS,
  SHA256: fS,
  sha224: pS,
  sha256: Bf
}, Symbol.toStringTag, { value: "Module" })), Gl = /* @__PURE__ */ Pl(gS), yS = /* @__PURE__ */ Pl(v2);
var Ji = {};
Object.defineProperty(Ji, "__esModule", { value: !0 });
Ji.joseToDer = Ji.derToJose = void 0;
const sw = ec, ow = Rn;
function Eu(e) {
  return (e / 8 | 0) + (e % 8 === 0 ? 0 : 1);
}
const wS = {
  ES256: Eu(256),
  ES384: Eu(384),
  ES512: Eu(521)
};
function iw(e) {
  const t = wS[e];
  if (t)
    return t;
  throw new Error(`Unknown algorithm "${e}"`);
}
const ul = 128, aw = 0, mS = 32, bS = 16, xS = 2, cw = bS | mS | aw << 6, dl = xS | aw << 6;
function lw(e) {
  if (e instanceof Uint8Array)
    return e;
  if (typeof e == "string")
    return (0, sw.toByteArray)((0, ow.pad)(e));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function SS(e, t) {
  const n = lw(e), r = iw(t), o = r + 1, s = n.length;
  let i = 0;
  if (n[i++] !== cw)
    throw new Error('Could not find expected "seq"');
  let a = n[i++];
  if (a === (ul | 1) && (a = n[i++]), s - i < a)
    throw new Error(`"seq" specified length of "${a}", only "${s - i}" remaining`);
  if (n[i++] !== dl)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[i++];
  if (s - i - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${s - i - 2}" available`);
  if (o < c)
    throw new Error(`"r" specified length of "${c}", max of "${o}" is acceptable`);
  const u = i;
  if (i += c, n[i++] !== dl)
    throw new Error('Could not find expected "int" for "s"');
  const h = n[i++];
  if (s - i !== h)
    throw new Error(`"s" specified length of "${h}", expected "${s - i}"`);
  if (o < h)
    throw new Error(`"s" specified length of "${h}", max of "${o}" is acceptable`);
  const d = i;
  if (i += h, i !== s)
    throw new Error(`Expected to consume entire array, but "${s - i}" bytes remain`);
  const m = r - c, w = r - h, v = new Uint8Array(m + c + w + h);
  for (i = 0; i < m; ++i)
    v[i] = 0;
  v.set(n.subarray(u + Math.max(-m, 0), u + c), i), i = r;
  for (const x = i; i < x + w; ++i)
    v[i] = 0;
  return v.set(n.subarray(d + Math.max(-w, 0), d + h), i), (0, ow.escape)((0, sw.fromByteArray)(v));
}
Ji.derToJose = SS;
function Ep(e, t, n) {
  let r = 0;
  for (; t + r < n && e[t + r] === 0; )
    ++r;
  return e[t + r] >= ul && --r, r;
}
function vS(e, t) {
  e = lw(e);
  const n = iw(t), r = e.length;
  if (r !== n * 2)
    throw new TypeError(`"${t}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const o = Ep(e, 0, n), s = Ep(e, n, e.length), i = n - o, a = n - s, c = 2 + i + 1 + 1 + a, u = c < ul, h = new Uint8Array((u ? 2 : 3) + c);
  let d = 0;
  return h[d++] = cw, u ? h[d++] = c : (h[d++] = ul | 1, h[d++] = c & 255), h[d++] = dl, h[d++] = i, o < 0 ? (h[d++] = 0, h.set(e.subarray(0, n), d), d += n) : (h.set(e.subarray(o, n), d), d += n - o), h[d++] = dl, h[d++] = a, s < 0 ? (h[d++] = 0, h.set(e.subarray(n), d)) : h.set(e.subarray(n + s), d), h;
}
Ji.joseToDer = vS;
var Cs = {};
Object.defineProperty(Cs, "__esModule", { value: !0 });
Cs.InvalidTokenError = Cs.MissingParametersError = void 0;
class AS extends Error {
  constructor(t) {
    super(), this.name = "MissingParametersError", this.message = t || "";
  }
}
Cs.MissingParametersError = AS;
class ES extends Error {
  constructor(t) {
    super(), this.name = "InvalidTokenError", this.message = t || "";
  }
}
Cs.InvalidTokenError = ES;
const nc = /* @__PURE__ */ Pl(sS);
Object.defineProperty(jl, "__esModule", { value: !0 });
jl.SECP256K1Client = void 0;
const kS = Vy, $S = Gl, Yc = yS, kp = Ji, $p = Cs, Ip = nc;
Yc.utils.hmacSha256Sync = (e, ...t) => {
  const n = kS.hmac.create($S.sha256, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
class uw {
  static derivePublicKey(t, n = !0) {
    return t.length === 66 && (t = t.slice(0, 64)), t.length < 64 && (t = t.padStart(64, "0")), (0, Ip.bytesToHex)(Yc.getPublicKey(t, n));
  }
  static signHash(t, n, r = "jose") {
    if (!t || !n)
      throw new $p.MissingParametersError("a signing input hash and private key are all required");
    const o = Yc.signSync(t, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Ip.bytesToHex)(o);
    if (r === "jose")
      return (0, kp.derToJose)(o, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(t) {
    return (0, kp.joseToDer)(t, "ES256");
  }
  static verifyHash(t, n, r) {
    if (!t || !n || !r)
      throw new $p.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Yc.verify(n, t, r, { strict: !1 });
  }
}
jl.SECP256K1Client = uw;
uw.algorithmName = "ES256K";
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.cryptoClients = e.SECP256K1Client = void 0;
  const t = jl;
  Object.defineProperty(e, "SECP256K1Client", { enumerable: !0, get: function() {
    return t.SECP256K1Client;
  } });
  const n = {
    ES256K: t.SECP256K1Client
  };
  e.cryptoClients = n;
})(Fl);
var qo = {};
const IS = /* @__PURE__ */ Pl(wy);
var LS = Gn && Gn.__awaiter || function(e, t, n, r) {
  function o(s) {
    return s instanceof n ? s : new n(function(i) {
      i(s);
    });
  }
  return new (n || (n = Promise))(function(s, i) {
    function a(h) {
      try {
        u(r.next(h));
      } catch (d) {
        i(d);
      }
    }
    function c(h) {
      try {
        u(r.throw(h));
      } catch (d) {
        i(d);
      }
    }
    function u(h) {
      h.done ? s(h.value) : o(h.value).then(a, c);
    }
    u((r = r.apply(e, t || [])).next());
  });
};
Object.defineProperty(qo, "__esModule", { value: !0 });
qo.hashSha256Async = qo.hashSha256 = void 0;
const CS = Gl;
function dw(e) {
  return (0, CS.sha256)(e);
}
qo.hashSha256 = dw;
function TS(e) {
  return LS(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof e == "string" ? new TextEncoder().encode(e) : e, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = IS;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(e).digest());
      }
    } catch (t) {
      return console.log(t), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(dw(e));
    }
  });
}
qo.hashSha256Async = TS;
var BS = Gn && Gn.__awaiter || function(e, t, n, r) {
  function o(s) {
    return s instanceof n ? s : new n(function(i) {
      i(s);
    });
  }
  return new (n || (n = Promise))(function(s, i) {
    function a(h) {
      try {
        u(r.next(h));
      } catch (d) {
        i(d);
      }
    }
    function c(h) {
      try {
        u(r.throw(h));
      } catch (d) {
        i(d);
      }
    }
    function u(h) {
      h.done ? s(h.value) : o(h.value).then(a, c);
    }
    u((r = r.apply(e, t || [])).next());
  });
};
Object.defineProperty(Zi, "__esModule", { value: !0 });
Zi.TokenSigner = Zi.createUnsecuredToken = void 0;
const hd = Rn, Lp = Fl, NS = Cs, Cp = qo;
function pd(e, t) {
  const n = [], r = hd.encode(JSON.stringify(t));
  n.push(r);
  const o = hd.encode(JSON.stringify(e));
  return n.push(o), n.join(".");
}
function MS(e) {
  return pd(e, { typ: "JWT", alg: "none" }) + ".";
}
Zi.createUnsecuredToken = MS;
class _S {
  constructor(t, n) {
    if (!(t && n))
      throw new NS.MissingParametersError("a signing algorithm and private key are required");
    if (typeof t != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (t = t.toUpperCase(), !Lp.cryptoClients.hasOwnProperty(t))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Lp.cryptoClients[t], this.rawPrivateKey = n;
  }
  header(t = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, t);
  }
  sign(t, n = !1, r = {}) {
    const o = this.header(r), s = pd(t, o), i = (0, Cp.hashSha256)(s);
    return this.createWithSignedHash(t, n, o, s, i);
  }
  signAsync(t, n = !1, r = {}) {
    return BS(this, void 0, void 0, function* () {
      const o = this.header(r), s = pd(t, o), i = yield (0, Cp.hashSha256Async)(s);
      return this.createWithSignedHash(t, n, o, s, i);
    });
  }
  createWithSignedHash(t, n, r, o, s) {
    const i = this.cryptoClient.signHash(s, this.rawPrivateKey);
    return n ? {
      header: [hd.encode(JSON.stringify(r))],
      payload: JSON.stringify(t),
      signature: [i]
    } : [o, i].join(".");
  }
}
Zi.TokenSigner = _S;
var Kl = {};
Object.defineProperty(Kl, "__esModule", { value: !0 });
Kl.TokenVerifier = void 0;
const PS = Rn, Tp = Fl, US = Cs, bc = qo;
class OS {
  constructor(t, n) {
    if (!(t && n))
      throw new US.MissingParametersError("a signing algorithm and public key are required");
    if (typeof t != "string")
      throw "signing algorithm parameter must be a string";
    if (t = t.toUpperCase(), !Tp.cryptoClients.hasOwnProperty(t))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Tp.cryptoClients[t], this.rawPublicKey = n;
  }
  verify(t) {
    return typeof t == "string" ? this.verifyCompact(t, !1) : typeof t == "object" ? this.verifyExpanded(t, !1) : !1;
  }
  verifyAsync(t) {
    return typeof t == "string" ? this.verifyCompact(t, !0) : typeof t == "object" ? this.verifyExpanded(t, !0) : Promise.resolve(!1);
  }
  verifyCompact(t, n) {
    const r = t.split("."), o = r[0] + "." + r[1], s = (i) => {
      const a = this.cryptoClient.loadSignature(r[2]);
      return this.cryptoClient.verifyHash(i, a, this.rawPublicKey);
    };
    if (n)
      return (0, bc.hashSha256Async)(o).then((i) => s(i));
    {
      const i = (0, bc.hashSha256)(o);
      return s(i);
    }
  }
  verifyExpanded(t, n) {
    const r = [t.header.join("."), PS.encode(t.payload)].join(".");
    let o = !0;
    const s = (i) => (t.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(i, c, this.rawPublicKey) || (o = !1);
    }), o);
    if (n)
      return (0, bc.hashSha256Async)(r).then((i) => s(i));
    {
      const i = (0, bc.hashSha256)(r);
      return s(i);
    }
  }
}
Kl.TokenVerifier = OS;
var Vl = {};
Object.defineProperty(Vl, "__esModule", { value: !0 });
Vl.decodeToken = void 0;
const xc = Rn;
function HS(e) {
  if (typeof e == "string") {
    const t = e.split("."), n = JSON.parse(xc.decode(t[0])), r = JSON.parse(xc.decode(t[1])), o = t[2];
    return {
      header: n,
      payload: r,
      signature: o
    };
  } else if (typeof e == "object") {
    if (typeof e.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let t = e.payload;
    e.payload[0] !== "{" && (t = xc.decode(t));
    const n = [];
    return e.header.map((r) => {
      const o = JSON.parse(xc.decode(r));
      n.push(o);
    }), {
      header: n,
      payload: JSON.parse(t),
      signature: e.signature
    };
  }
}
Vl.decodeToken = HS;
(function(e) {
  var t = Gn && Gn.__createBinding || (Object.create ? function(r, o, s, i) {
    i === void 0 && (i = s);
    var a = Object.getOwnPropertyDescriptor(o, s);
    (!a || ("get" in a ? !o.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return o[s];
    } }), Object.defineProperty(r, i, a);
  } : function(r, o, s, i) {
    i === void 0 && (i = s), r[i] = o[s];
  }), n = Gn && Gn.__exportStar || function(r, o) {
    for (var s in r) s !== "default" && !Object.prototype.hasOwnProperty.call(o, s) && t(o, r, s);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), n(Zi, e), n(Kl, e), n(Vl, e), n(Cs, e), n(Fl, e);
})(Bn);
function DS(e) {
  return `did:btc-addr:${e}`;
}
function FS(e) {
  const t = e.split(":");
  if (t.length !== 3)
    throw new lp("Decentralized IDs must have 3 parts");
  if (t[0].toLowerCase() !== "did")
    throw new lp('Decentralized IDs must start with "did"');
  return t[1].toLowerCase();
}
function fw(e) {
  if (e)
    return FS(e) === "btc-addr" ? e.split(":")[2] : void 0;
}
const jS = "1.4.0";
function RS() {
  return Ix();
}
function zS(e, t, n, r = ay.slice(), o, s = E1().getTime(), i = {}) {
  const a = (w) => {
    const v = pf("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${w}=undefined])`
    });
    return v == null ? void 0 : v.origin;
  };
  t || (t = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), o || (o = a("appDomain"));
  const c = Object.assign({}, i, {
    jti: $1(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(s / 1e3),
    iss: null,
    public_keys: [],
    domain_name: o,
    manifest_uri: n,
    redirect_uri: t,
    version: jS,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = Bn.SECP256K1Client.derivePublicKey(e);
  c.public_keys = [u];
  const h = Hy(u);
  return c.iss = DS(h), new Bn.TokenSigner("ES256k", e).sign(c);
}
async function Bp(e, t) {
  const n = Ja(mt(t)), r = JSON.parse(n), o = await Ry(e, r);
  if (typeof o != "string")
    throw new Error("Unable to correctly decrypt private key");
  return o;
}
function GS(e) {
  const t = Bn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new Bn.TokenVerifier("ES256k", r).verify(e);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function KS(e) {
  const t = Bn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys, r = fw(t.iss);
  if (n.length === 1) {
    if (Hy(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function VS(e) {
  const t = Bn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  if (t.iat) {
    if (typeof t.iat != "number")
      return !1;
    const n = new Date(t.iat * 1e3);
    return !((/* @__PURE__ */ new Date()).getTime() < n.getTime());
  } else
    return !0;
}
function XS(e) {
  const t = Bn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  if (t.exp) {
    if (typeof t.exp != "number")
      return !1;
    const n = new Date(t.exp * 1e3);
    return !((/* @__PURE__ */ new Date()).getTime() > n.getTime());
  } else
    return !0;
}
function YS(e) {
  const t = [
    XS(e),
    VS(e),
    GS(e),
    KS(e)
  ];
  return Promise.resolve(t.every((n) => n));
}
const Np = "1.0.0";
class mo {
  constructor(t) {
    this.version = Np, this.userData = t.userData, this.transitKey = t.transitKey, this.etags = t.etags ? t.etags : {};
  }
  static fromJSON(t) {
    if (t.version !== Np)
      throw new od(`JSON data version ${t.version} not supported by SessionData`);
    const n = {
      coreNode: t.coreNode,
      userData: t.userData,
      transitKey: t.transitKey,
      etags: t.etags
    };
    return new mo(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class hw {
  constructor(t) {
    if (t) {
      const n = new mo(t);
      this.setSessionData(n);
    }
  }
  getSessionData() {
    throw new Error("Abstract class");
  }
  setSessionData(t) {
    throw new Error("Abstract class");
  }
  deleteSessionData() {
    throw new Error("Abstract class");
  }
}
class Mp extends hw {
  constructor(t) {
    super(t), this.sessionData || this.setSessionData(new mo({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new cy("No session data was found.");
    return this.sessionData;
  }
  setSessionData(t) {
    return this.sessionData = t, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new mo({})), !0;
  }
}
class _p extends hw {
  constructor(t) {
    if (super(t), t && t.storeOptions && t.storeOptions.localStorageKey && typeof t.storeOptions.localStorageKey == "string" ? this.key = t.storeOptions.localStorageKey : this.key = S1, !localStorage.getItem(this.key)) {
      const r = new mo({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const t = localStorage.getItem(this.key);
    if (!t)
      throw new cy("No session data was found in localStorage");
    const n = JSON.parse(t);
    return mo.fromJSON(n);
  }
  setSessionData(t) {
    return localStorage.setItem(this.key, t.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new mo({})), !0;
  }
}
var Da;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(Da || (Da = {}));
var fl;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(fl || (fl = {}));
Da.Mainnet;
var Is;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Is || (Is = {}));
var rs;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(rs || (rs = {}));
Is.Mainnet;
const pw = {
  chainId: Da.Mainnet,
  transactionVersion: Is.Mainnet,
  peerNetworkId: fl.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: rs.MainnetSingleSig,
    multiSig: rs.MainnetMultiSig
  },
  client: { baseUrl: ly }
}, gd = {
  chainId: Da.Testnet,
  transactionVersion: Is.Testnet,
  peerNetworkId: fl.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: rs.TestnetSingleSig,
    multiSig: rs.TestnetMultiSig
  },
  client: { baseUrl: uy }
}, qc = {
  ...gd,
  addressVersion: { ...gd.addressVersion },
  magicBytes: "id",
  client: { baseUrl: dy }
}, qS = {
  ...qc,
  addressVersion: { ...qc.addressVersion },
  client: { ...qc.client }
};
function WS(e) {
  switch (e) {
    case "mainnet":
      return pw;
    case "testnet":
      return gd;
    case "devnet":
      return qc;
    case "mocknet":
      return qS;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function gw(e) {
  return typeof e == "string" ? WS(e) : e;
}
var Pp;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Pp || (Pp = {}));
var Up;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(Up || (Up = {}));
var Br;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Br || (Br = {}));
const ku = ["onChainOnly", "offChainOnly", "any"];
ku[0] + "", Br.OnChainOnly, ku[1] + "", Br.OffChainOnly, ku[2] + "", Br.Any, Br.OnChainOnly + "", Br.OnChainOnly, Br.OffChainOnly + "", Br.OffChainOnly, Br.Any + "", Br.Any;
var Op;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(Op || (Op = {}));
var Hp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(Hp || (Hp = {}));
var Dp;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Dp || (Dp = {}));
var ks;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(ks || (ks = {}));
var Fp;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Fp || (Fp = {}));
var jp;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(jp || (jp = {}));
var Rp;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(Rp || (Rp = {}));
var zp;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(zp || (zp = {}));
var Gp;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Gp || (Gp = {}));
var Kp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Kp || (Kp = {}));
var Vp;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Vp || (Vp = {}));
var Xp;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Xp || (Xp = {}));
var Yp;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(Yp || (Yp = {}));
function yd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function ZS(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function yw(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function JS(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  yd(e.outputLen), yd(e.blockLen);
}
function QS(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function ev(e, t) {
  yw(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Uo = {
  number: yd,
  bool: ZS,
  bytes: yw,
  hash: JS,
  exists: QS,
  output: ev
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const $u = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Wr = (e, t) => e << 32 - t | e >>> t, tv = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!tv)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function nv(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Nf(e) {
  if (typeof e == "string" && (e = nv(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let ww = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function di(e) {
  const t = (r) => e().update(Nf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let mw = class extends ww {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Uo.hash(t);
    const r = Nf(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const o = this.blockLen, s = new Uint8Array(o);
    s.set(r.length > o ? t.create().update(r).digest() : r);
    for (let i = 0; i < s.length; i++)
      s[i] ^= 54;
    this.iHash.update(s), this.oHash = t.create();
    for (let i = 0; i < s.length; i++)
      s[i] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(t) {
    return Uo.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Uo.exists(this), Uo.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: o, destroyed: s, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = o, t.destroyed = s, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const bw = (e, t, n) => new mw(e, t).update(n).digest();
bw.create = (e, t) => new mw(e, t);
function rv(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let Mf = class extends ww {
  constructor(t, n, r, o) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = $u(this.buffer);
  }
  update(t) {
    Uo.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    t = Nf(t);
    const s = t.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(o - this.pos, s - i);
      if (a === o) {
        const c = $u(t);
        for (; o <= s - i; i += o)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Uo.exists(this), Uo.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let d = i; d < o; d++)
      n[d] = 0;
    rv(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = $u(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: a } = this;
    return t.length = o, t.pos = a, t.finished = s, t.destroyed = i, o % n && t.buffer.set(r), t;
  }
};
const sv = (e, t, n) => e & t ^ ~e & n, ov = (e, t, n) => e & t ^ e & n ^ t & n, iv = new Uint32Array([
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
]), Ys = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), qs = new Uint32Array(64);
let xw = class extends Mf {
  constructor() {
    super(64, 32, 8, !1), this.A = Ys[0] | 0, this.B = Ys[1] | 0, this.C = Ys[2] | 0, this.D = Ys[3] | 0, this.E = Ys[4] | 0, this.F = Ys[5] | 0, this.G = Ys[6] | 0, this.H = Ys[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: s, F: i, G: a, H: c } = this;
    return [t, n, r, o, s, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      qs[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const m = qs[d - 15], w = qs[d - 2], v = Wr(m, 7) ^ Wr(m, 18) ^ m >>> 3, x = Wr(w, 17) ^ Wr(w, 19) ^ w >>> 10;
      qs[d] = x + qs[d - 7] + v + qs[d - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const m = Wr(a, 6) ^ Wr(a, 11) ^ Wr(a, 25), w = h + m + sv(a, c, u) + iv[d] + qs[d] | 0, x = (Wr(r, 2) ^ Wr(r, 13) ^ Wr(r, 22)) + ov(r, o, s) | 0;
      h = u, u = c, c = a, a = i + w | 0, i = s, s = o, o = r, r = w + x | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, o, s, i, a, c, u, h);
  }
  roundClean() {
    qs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, av = class extends xw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Sw = di(() => new xw());
di(() => new av());
var fi = {}, _f = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32decode = e.c32normalize = e.c32encode = e.c32 = void 0;
  const t = nc;
  e.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(i, a) {
    if (!i.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    i.length % 2 !== 0 && (i = `0${i}`), i = i.toLowerCase();
    let c = [], u = 0;
    for (let w = i.length - 1; w >= 0; w--)
      if (u < 4) {
        const v = n.indexOf(i[w]) >> u;
        let x = 0;
        w !== 0 && (x = n.indexOf(i[w - 1]));
        const L = 1 + u, N = x % (1 << L) << 5 - L, U = e.c32[v + N];
        u = L, c.unshift(U);
      } else
        u = 0;
    let h = 0;
    for (let w = 0; w < c.length && c[w] === "0"; w++)
      h++;
    c = c.slice(h);
    const d = new TextDecoder().decode((0, t.hexToBytes)(i)).match(/^\u0000*/), m = d ? d[0].length : 0;
    for (let w = 0; w < m; w++)
      c.unshift(e.c32[0]);
    if (a) {
      const w = a - c.length;
      for (let v = 0; v < w; v++)
        c.unshift(e.c32[0]);
    }
    return c.join("");
  }
  e.c32encode = r;
  function o(i) {
    return i.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  e.c32normalize = o;
  function s(i, a) {
    if (i = o(i), !i.match(`^[${e.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const c = i.match(`^${e.c32[0]}*`), u = c ? c[0].length : 0;
    let h = [], d = 0, m = 0;
    for (let x = i.length - 1; x >= 0; x--) {
      m === 4 && (h.unshift(n[d]), m = 0, d = 0);
      const N = (e.c32.indexOf(i[x]) << m) + d, U = n[N % 16];
      if (m += 1, d = N >> 4, d > 1 << m)
        throw new Error("Panic error in decoding.");
      h.unshift(U);
    }
    h.unshift(n[d]), h.length % 2 === 1 && h.unshift("0");
    let w = 0;
    for (let x = 0; x < h.length && h[x] === "0"; x++)
      w++;
    h = h.slice(w - w % 2);
    let v = h.join("");
    for (let x = 0; x < u; x++)
      v = `00${v}`;
    if (a) {
      const x = a * 2 - v.length;
      for (let L = 0; L < x; L += 2)
        v = `00${v}`;
    }
    return v;
  }
  e.c32decode = s;
})(_f);
var Wo = {};
Object.defineProperty(Wo, "__esModule", { value: !0 });
Wo.c32checkDecode = Wo.c32checkEncode = void 0;
const qp = Gl, Wp = nc, Ma = _f;
function vw(e) {
  const t = (0, qp.sha256)((0, qp.sha256)((0, Wp.hexToBytes)(e)));
  return (0, Wp.bytesToHex)(t.slice(0, 4));
}
function cv(e, t) {
  if (e < 0 || e >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!t.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  t = t.toLowerCase(), t.length % 2 !== 0 && (t = `0${t}`);
  let n = e.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = vw(`${n}${t}`), o = (0, Ma.c32encode)(`${t}${r}`);
  return `${Ma.c32[e]}${o}`;
}
Wo.c32checkEncode = cv;
function lv(e) {
  e = (0, Ma.c32normalize)(e);
  const t = (0, Ma.c32decode)(e.slice(1)), n = e[0], r = Ma.c32.indexOf(n), o = t.slice(-8);
  let s = r.toString(16);
  if (s.length === 1 && (s = `0${s}`), vw(`${s}${t.substring(0, t.length - 8)}`) !== o)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, t.substring(0, t.length - 8)];
}
Wo.c32checkDecode = lv;
var Aw = {}, Qi = {};
Object.defineProperty(Qi, "__esModule", { value: !0 });
Qi.decode = Qi.encode = void 0;
const hl = Gl, Zp = nc, Ew = My, kw = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function uv(e, t = "00") {
  const n = typeof e == "string" ? (0, Zp.hexToBytes)(e) : e, r = typeof t == "string" ? (0, Zp.hexToBytes)(t) : e;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const o = (0, hl.sha256)((0, hl.sha256)(new Uint8Array([...r, ...n])));
  return Ew(kw).encode([...r, ...n, ...o.slice(0, 4)]);
}
Qi.encode = uv;
function dv(e) {
  const t = Ew(kw).decode(e), n = t.slice(0, 1), r = t.slice(1, -4), o = (0, hl.sha256)((0, hl.sha256)(new Uint8Array([...n, ...r])));
  return t.slice(-4).forEach((s, i) => {
    if (s !== o[i])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Qi.decode = dv;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32ToB58 = e.b58ToC32 = e.c32addressDecode = e.c32address = e.versions = void 0;
  const t = Wo, n = Qi, r = nc;
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
  const o = {};
  o[0] = e.versions.mainnet.p2pkh, o[5] = e.versions.mainnet.p2sh, o[111] = e.versions.testnet.p2pkh, o[196] = e.versions.testnet.p2sh;
  const s = {};
  s[e.versions.mainnet.p2pkh] = 0, s[e.versions.mainnet.p2sh] = 5, s[e.versions.testnet.p2pkh] = 111, s[e.versions.testnet.p2sh] = 196;
  function i(h, d) {
    if (!d.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, t.c32checkEncode)(h, d)}`;
  }
  e.c32address = i;
  function a(h) {
    if (h.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (h[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, t.c32checkDecode)(h.slice(1));
  }
  e.c32addressDecode = a;
  function c(h, d = -1) {
    const m = n.decode(h), w = (0, r.bytesToHex)(m.data), v = parseInt((0, r.bytesToHex)(m.prefix), 16);
    let x;
    return d < 0 ? (x = v, o[v] !== void 0 && (x = o[v])) : x = d, i(x, w);
  }
  e.b58ToC32 = c;
  function u(h, d = -1) {
    const m = a(h), w = m[0], v = m[1];
    let x;
    d < 0 ? (x = w, s[w] !== void 0 && (x = s[w])) : x = d;
    let L = x.toString(16);
    return L.length === 1 && (L = `0${L}`), n.encode(v, L);
  }
  e.c32ToB58 = u;
})(Aw);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.b58ToC32 = e.c32ToB58 = e.versions = e.c32normalize = e.c32addressDecode = e.c32address = e.c32checkDecode = e.c32checkEncode = e.c32decode = e.c32encode = void 0;
  const t = _f;
  Object.defineProperty(e, "c32encode", { enumerable: !0, get: function() {
    return t.c32encode;
  } }), Object.defineProperty(e, "c32decode", { enumerable: !0, get: function() {
    return t.c32decode;
  } }), Object.defineProperty(e, "c32normalize", { enumerable: !0, get: function() {
    return t.c32normalize;
  } });
  const n = Wo;
  Object.defineProperty(e, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(e, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Aw;
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
})(fi);
function fv(e, t) {
  switch (t = gw(t ?? pw), e) {
    case ks.P2PKH:
      switch (t.transactionVersion) {
        case Is.Mainnet:
          return rs.MainnetSingleSig;
        case Is.Testnet:
          return rs.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    case ks.P2SH:
    case ks.P2SHNonSequential:
    case ks.P2WPKH:
    case ks.P2WSH:
    case ks.P2WSHNonSequential:
      switch (t.transactionVersion) {
        case Is.Mainnet:
          return rs.MainnetMultiSig;
        case Is.Testnet:
          return rs.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${e}`);
  }
}
const hv = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), $w = Uint8Array.from({ length: 16 }, (e, t) => t), pv = $w.map((e) => (9 * e + 5) % 16);
let Pf = [$w], Uf = [pv];
for (let e = 0; e < 4; e++)
  for (let t of [Pf, Uf])
    t.push(t[e].map((n) => hv[n]));
const Iw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), gv = Pf.map((e, t) => e.map((n) => Iw[t][n])), yv = Uf.map((e, t) => e.map((n) => Iw[t][n])), wv = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), mv = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Sc = (e, t) => e << t | e >>> 32 - t;
function Jp(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const vc = new Uint32Array(16);
let bv = class extends Mf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: o, h4: s } = this;
    return [t, n, r, o, s];
  }
  set(t, n, r, o, s) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = o | 0, this.h4 = s | 0;
  }
  process(t, n) {
    for (let w = 0; w < 16; w++, n += 4)
      vc[w] = t.getUint32(n, !0);
    let r = this.h0 | 0, o = r, s = this.h1 | 0, i = s, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, m = d;
    for (let w = 0; w < 5; w++) {
      const v = 4 - w, x = wv[w], L = mv[w], N = Pf[w], U = Uf[w], A = gv[w], T = yv[w];
      for (let B = 0; B < 16; B++) {
        const X = Sc(r + Jp(w, s, a, u) + vc[N[B]] + x, A[B]) + d | 0;
        r = d, d = u, u = Sc(a, 10) | 0, a = s, s = X;
      }
      for (let B = 0; B < 16; B++) {
        const X = Sc(o + Jp(v, i, c, h) + vc[U[B]] + L, T[B]) + m | 0;
        o = m, m = h, h = Sc(c, 10) | 0, c = i, i = X;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + m | 0, this.h3 + d + o | 0, this.h4 + r + i | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    vc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const xv = di(() => new bv()), Ac = BigInt(2 ** 32 - 1), wd = BigInt(32);
function Lw(e, t = !1) {
  return t ? { h: Number(e & Ac), l: Number(e >> wd & Ac) } : { h: Number(e >> wd & Ac) | 0, l: Number(e & Ac) | 0 };
}
function Sv(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let o = 0; o < e.length; o++) {
    const { h: s, l: i } = Lw(e[o], t);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const vv = (e, t) => BigInt(e >>> 0) << wd | BigInt(t >>> 0), Av = (e, t, n) => e >>> n, Ev = (e, t, n) => e << 32 - n | t >>> n, kv = (e, t, n) => e >>> n | t << 32 - n, $v = (e, t, n) => e << 32 - n | t >>> n, Iv = (e, t, n) => e << 64 - n | t >>> n - 32, Lv = (e, t, n) => e >>> n - 32 | t << 64 - n, Cv = (e, t) => t, Tv = (e, t) => e, Bv = (e, t, n) => e << n | t >>> 32 - n, Nv = (e, t, n) => t << n | e >>> 32 - n, Mv = (e, t, n) => t << n - 32 | e >>> 64 - n, _v = (e, t, n) => e << n - 32 | t >>> 64 - n;
function Pv(e, t, n, r) {
  const o = (t >>> 0) + (r >>> 0);
  return { h: e + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const Uv = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), Ov = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, Hv = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), Dv = (e, t, n, r, o) => t + n + r + o + (e / 2 ** 32 | 0) | 0, Fv = (e, t, n, r, o) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), jv = (e, t, n, r, o, s) => t + n + r + o + s + (e / 2 ** 32 | 0) | 0, Qe = {
  fromBig: Lw,
  split: Sv,
  toBig: vv,
  shrSH: Av,
  shrSL: Ev,
  rotrSH: kv,
  rotrSL: $v,
  rotrBH: Iv,
  rotrBL: Lv,
  rotr32H: Cv,
  rotr32L: Tv,
  rotlSH: Bv,
  rotlSL: Nv,
  rotlBH: Mv,
  rotlBL: _v,
  add: Pv,
  add3L: Uv,
  add3H: Ov,
  add4L: Hv,
  add4H: Dv,
  add5H: jv,
  add5L: Fv
}, [Rv, zv] = Qe.split([
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
].map((e) => BigInt(e))), Ws = new Uint32Array(80), Zs = new Uint32Array(80);
let Xl = class extends Mf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: m, Gh: w, Gl: v, Hh: x, Hl: L } = this;
    return [t, n, r, o, s, i, a, c, u, h, d, m, w, v, x, L];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c, u, h, d, m, w, v, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = m | 0, this.Gh = w | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      Ws[A] = t.getUint32(n), Zs[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = Ws[A - 15] | 0, B = Zs[A - 15] | 0, X = Qe.rotrSH(T, B, 1) ^ Qe.rotrSH(T, B, 8) ^ Qe.shrSH(T, B, 7), Q = Qe.rotrSL(T, B, 1) ^ Qe.rotrSL(T, B, 8) ^ Qe.shrSL(T, B, 7), oe = Ws[A - 2] | 0, Y = Zs[A - 2] | 0, b = Qe.rotrSH(oe, Y, 19) ^ Qe.rotrBH(oe, Y, 61) ^ Qe.shrSH(oe, Y, 6), I = Qe.rotrSL(oe, Y, 19) ^ Qe.rotrBL(oe, Y, 61) ^ Qe.shrSL(oe, Y, 6), M = Qe.add4L(Q, I, Zs[A - 7], Zs[A - 16]), P = Qe.add4H(M, X, b, Ws[A - 7], Ws[A - 16]);
      Ws[A] = P | 0, Zs[A] = M | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: m, Fh: w, Fl: v, Gh: x, Gl: L, Hh: N, Hl: U } = this;
    for (let A = 0; A < 80; A++) {
      const T = Qe.rotrSH(d, m, 14) ^ Qe.rotrSH(d, m, 18) ^ Qe.rotrBH(d, m, 41), B = Qe.rotrSL(d, m, 14) ^ Qe.rotrSL(d, m, 18) ^ Qe.rotrBL(d, m, 41), X = d & w ^ ~d & x, Q = m & v ^ ~m & L, oe = Qe.add5L(U, B, Q, zv[A], Zs[A]), Y = Qe.add5H(oe, N, T, X, Rv[A], Ws[A]), b = oe | 0, I = Qe.rotrSH(r, o, 28) ^ Qe.rotrBH(r, o, 34) ^ Qe.rotrBH(r, o, 39), M = Qe.rotrSL(r, o, 28) ^ Qe.rotrBL(r, o, 34) ^ Qe.rotrBL(r, o, 39), P = r & s ^ r & a ^ s & a, W = o & i ^ o & c ^ i & c;
      N = x | 0, U = L | 0, x = w | 0, L = v | 0, w = d | 0, v = m | 0, { h: d, l: m } = Qe.add(u | 0, h | 0, Y | 0, b | 0), u = a | 0, h = c | 0, a = s | 0, c = i | 0, s = r | 0, i = o | 0;
      const R = Qe.add3L(b, M, W);
      r = Qe.add3H(R, Y, I, P), o = R | 0;
    }
    ({ h: r, l: o } = Qe.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = Qe.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: a, l: c } = Qe.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Qe.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: m } = Qe.add(this.Eh | 0, this.El | 0, d | 0, m | 0), { h: w, l: v } = Qe.add(this.Fh | 0, this.Fl | 0, w | 0, v | 0), { h: x, l: L } = Qe.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: N, l: U } = Qe.add(this.Hh | 0, this.Hl | 0, N | 0, U | 0), this.set(r, o, s, i, a, c, u, h, d, m, w, v, x, L, N, U);
  }
  roundClean() {
    Ws.fill(0), Zs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Gv = class extends Xl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Kv = class extends Xl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Vv = class extends Xl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
di(() => new Xl());
di(() => new Gv());
di(() => new Kv());
di(() => new Vv());
var pl = { exports: {} };
pl.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", o = 9007199254740991, s = "[object Arguments]", i = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", h = "[object Function]", d = "[object GeneratorFunction]", m = "[object Map]", w = "[object Number]", v = "[object Object]", x = "[object Promise]", L = "[object RegExp]", N = "[object Set]", U = "[object String]", A = "[object Symbol]", T = "[object WeakMap]", B = "[object ArrayBuffer]", X = "[object DataView]", Q = "[object Float32Array]", oe = "[object Float64Array]", Y = "[object Int8Array]", b = "[object Int16Array]", I = "[object Int32Array]", M = "[object Uint8Array]", P = "[object Uint8ClampedArray]", W = "[object Uint16Array]", R = "[object Uint32Array]", le = /[\\^$.*+?()[\]{}|]/g, ue = /\w*$/, Xe = /^\[object .+?Constructor\]$/, C = /^(?:0|[1-9]\d*)$/, F = {};
  F[s] = F[i] = F[B] = F[X] = F[a] = F[c] = F[Q] = F[oe] = F[Y] = F[b] = F[I] = F[m] = F[w] = F[v] = F[L] = F[N] = F[U] = F[A] = F[M] = F[P] = F[W] = F[R] = !0, F[u] = F[h] = F[T] = !1;
  var re = typeof Gn == "object" && Gn && Gn.Object === Object && Gn, de = typeof self == "object" && self && self.Object === Object && self, Be = re || de || Function("return this")(), Me = t && !t.nodeType && t, Ot = Me && !0 && e && !e.nodeType && e, Ge = Ot && Ot.exports === Me;
  function _e(S, _) {
    return S.set(_[0], _[1]), S;
  }
  function Pe(S, _) {
    return S.add(_), S;
  }
  function _t(S, _) {
    for (var G = -1, me = S ? S.length : 0; ++G < me && _(S[G], G, S) !== !1; )
      ;
    return S;
  }
  function En(S, _) {
    for (var G = -1, me = _.length, Rt = S.length; ++G < me; )
      S[Rt + G] = _[G];
    return S;
  }
  function lt(S, _, G, me) {
    for (var Rt = -1, kn = S ? S.length : 0; ++Rt < kn; )
      G = _(G, S[Rt], Rt, S);
    return G;
  }
  function Zt(S, _) {
    for (var G = -1, me = Array(S); ++G < S; )
      me[G] = _(G);
    return me;
  }
  function kt(S, _) {
    return S == null ? void 0 : S[_];
  }
  function z(S) {
    var _ = !1;
    if (S != null && typeof S.toString != "function")
      try {
        _ = !!(S + "");
      } catch {
      }
    return _;
  }
  function H(S) {
    var _ = -1, G = Array(S.size);
    return S.forEach(function(me, Rt) {
      G[++_] = [Rt, me];
    }), G;
  }
  function ee(S, _) {
    return function(G) {
      return S(_(G));
    };
  }
  function se(S) {
    var _ = -1, G = Array(S.size);
    return S.forEach(function(me) {
      G[++_] = me;
    }), G;
  }
  var he = Array.prototype, dt = Function.prototype, Ne = Object.prototype, He = Be["__core-js_shared__"], St = function() {
    var S = /[^.]+$/.exec(He && He.keys && He.keys.IE_PROTO || "");
    return S ? "Symbol(src)_1." + S : "";
  }(), Ke = dt.toString, Ie = Ne.hasOwnProperty, Ze = Ne.toString, Ye = RegExp(
    "^" + Ke.call(Ie).replace(le, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Ve = Ge ? Be.Buffer : void 0, Ht = Be.Symbol, pn = Be.Uint8Array, gn = ee(Object.getPrototypeOf, Object), Vn = Object.create, $t = Ne.propertyIsEnumerable, un = he.splice, Ir = Object.getOwnPropertySymbols, zr = Ve ? Ve.isBuffer : void 0, mr = ee(Object.keys, Object), bt = Lr(Be, "DataView"), yn = Lr(Be, "Map"), Dt = Lr(Be, "Promise"), wn = Lr(Be, "Set"), Et = Lr(Be, "WeakMap"), Vt = Lr(Object, "create"), Gr = Dn(bt), ds = Dn(yn), E = Dn(Dt), O = Dn(wn), K = Dn(Et), D = Ht ? Ht.prototype : void 0, J = D ? D.valueOf : void 0;
  function te(S) {
    var _ = -1, G = S ? S.length : 0;
    for (this.clear(); ++_ < G; ) {
      var me = S[_];
      this.set(me[0], me[1]);
    }
  }
  function Ce() {
    this.__data__ = Vt ? Vt(null) : {};
  }
  function Ae(S) {
    return this.has(S) && delete this.__data__[S];
  }
  function Fe(S) {
    var _ = this.__data__;
    if (Vt) {
      var G = _[S];
      return G === r ? void 0 : G;
    }
    return Ie.call(_, S) ? _[S] : void 0;
  }
  function ft(S) {
    var _ = this.__data__;
    return Vt ? _[S] !== void 0 : Ie.call(_, S);
  }
  function $(S, _) {
    var G = this.__data__;
    return G[S] = Vt && _ === void 0 ? r : _, this;
  }
  te.prototype.clear = Ce, te.prototype.delete = Ae, te.prototype.get = Fe, te.prototype.has = ft, te.prototype.set = $;
  function pe(S) {
    var _ = -1, G = S ? S.length : 0;
    for (this.clear(); ++_ < G; ) {
      var me = S[_];
      this.set(me[0], me[1]);
    }
  }
  function ze() {
    this.__data__ = [];
  }
  function ut(S) {
    var _ = this.__data__, G = Mn(_, S);
    if (G < 0)
      return !1;
    var me = _.length - 1;
    return G == me ? _.pop() : un.call(_, G, 1), !0;
  }
  function Xt(S) {
    var _ = this.__data__, G = Mn(_, S);
    return G < 0 ? void 0 : _[G][1];
  }
  function Ft(S) {
    return Mn(this.__data__, S) > -1;
  }
  function dn(S, _) {
    var G = this.__data__, me = Mn(G, S);
    return me < 0 ? G.push([S, _]) : G[me][1] = _, this;
  }
  pe.prototype.clear = ze, pe.prototype.delete = ut, pe.prototype.get = Xt, pe.prototype.has = Ft, pe.prototype.set = dn;
  function yt(S) {
    var _ = -1, G = S ? S.length : 0;
    for (this.clear(); ++_ < G; ) {
      var me = S[_];
      this.set(me[0], me[1]);
    }
  }
  function er() {
    this.__data__ = {
      hash: new te(),
      map: new (yn || pe)(),
      string: new te()
    };
  }
  function Kr(S) {
    return Xr(this, S).delete(S);
  }
  function ve(S) {
    return Xr(this, S).get(S);
  }
  function Jt(S) {
    return Xr(this, S).has(S);
  }
  function Ao(S, _) {
    return Xr(this, S).set(S, _), this;
  }
  yt.prototype.clear = er, yt.prototype.delete = Kr, yt.prototype.get = ve, yt.prototype.has = Jt, yt.prototype.set = Ao;
  function tr(S) {
    this.__data__ = new pe(S);
  }
  function Eo() {
    this.__data__ = new pe();
  }
  function Xn(S) {
    return this.__data__.delete(S);
  }
  function Nn(S) {
    return this.__data__.get(S);
  }
  function mn(S) {
    return this.__data__.has(S);
  }
  function Ns(S, _) {
    var G = this.__data__;
    if (G instanceof pe) {
      var me = G.__data__;
      if (!yn || me.length < n - 1)
        return me.push([S, _]), this;
      G = this.__data__ = new yt(me);
    }
    return G.set(S, _), this;
  }
  tr.prototype.clear = Eo, tr.prototype.delete = Xn, tr.prototype.get = Nn, tr.prototype.has = mn, tr.prototype.set = Ns;
  function ko(S, _) {
    var G = Bo(S) || ms(S) ? Zt(S.length, String) : [], me = G.length, Rt = !!me;
    for (var kn in S)
      Ie.call(S, kn) && !(Rt && (kn == "length" || ga(kn, me))) && G.push(kn);
    return G;
  }
  function wi(S, _, G) {
    var me = S[_];
    (!(Ie.call(S, _) && To(me, G)) || G === void 0 && !(_ in S)) && (S[_] = G);
  }
  function Mn(S, _) {
    for (var G = S.length; G--; )
      if (To(S[G][0], _))
        return G;
    return -1;
  }
  function nr(S, _) {
    return S && ws(_, xe(_), S);
  }
  function fs(S, _, G, me, Rt, kn, br) {
    var $n;
    if (me && ($n = kn ? me(S, Rt, kn, br) : me(S)), $n !== void 0)
      return $n;
    if (!q(S))
      return S;
    var l = Bo(S);
    if (l) {
      if ($n = xi(S), !_)
        return ys(S, $n);
    } else {
      var p = rr(S), y = p == h || p == d;
      if (V(S))
        return Ms(S, _);
      if (p == v || p == s || y && !kn) {
        if (z(S))
          return kn ? S : {};
        if ($n = Os(y ? {} : S), !_)
          return bi(S, nr($n, S));
      } else {
        if (!F[p])
          return kn ? S : {};
        $n = Co(S, p, fs, _);
      }
    }
    br || (br = new tr());
    var f = br.get(S);
    if (f)
      return f;
    if (br.set(S, $n), !l)
      var j = G ? Us(S) : xe(S);
    return _t(j || S, function(ie, Se) {
      j && (Se = ie, ie = S[Se]), wi($n, Se, fs(ie, _, G, me, Se, S, br));
    }), $n;
  }
  function Vr(S) {
    return q(S) ? Vn(S) : {};
  }
  function Yn(S, _, G) {
    var me = _(S);
    return Bo(S) ? me : En(me, G(S));
  }
  function $o(S) {
    return Ze.call(S);
  }
  function Io(S) {
    if (!q(S) || Yr(S))
      return !1;
    var _ = ne(S) || z(S) ? Ye : Xe;
    return _.test(Dn(S));
  }
  function hs(S) {
    if (!Si(S))
      return mr(S);
    var _ = [];
    for (var G in Object(S))
      Ie.call(S, G) && G != "constructor" && _.push(G);
    return _;
  }
  function Ms(S, _) {
    if (_)
      return S.slice();
    var G = new S.constructor(S.length);
    return S.copy(G), G;
  }
  function ps(S) {
    var _ = new S.constructor(S.byteLength);
    return new pn(_).set(new pn(S)), _;
  }
  function ln(S, _) {
    var G = _ ? ps(S.buffer) : S.buffer;
    return new S.constructor(G, S.byteOffset, S.byteLength);
  }
  function gs(S, _, G) {
    var me = _ ? G(H(S), !0) : H(S);
    return lt(me, _e, new S.constructor());
  }
  function mi(S) {
    var _ = new S.constructor(S.source, ue.exec(S));
    return _.lastIndex = S.lastIndex, _;
  }
  function Lo(S, _, G) {
    var me = _ ? G(se(S), !0) : se(S);
    return lt(me, Pe, new S.constructor());
  }
  function _s(S) {
    return J ? Object(J.call(S)) : {};
  }
  function Ps(S, _) {
    var G = _ ? ps(S.buffer) : S.buffer;
    return new S.constructor(G, S.byteOffset, S.length);
  }
  function ys(S, _) {
    var G = -1, me = S.length;
    for (_ || (_ = Array(me)); ++G < me; )
      _[G] = S[G];
    return _;
  }
  function ws(S, _, G, me) {
    G || (G = {});
    for (var Rt = -1, kn = _.length; ++Rt < kn; ) {
      var br = _[Rt], $n = void 0;
      wi(G, br, $n === void 0 ? S[br] : $n);
    }
    return G;
  }
  function bi(S, _) {
    return ws(S, jt(S), _);
  }
  function Us(S) {
    return Yn(S, xe, jt);
  }
  function Xr(S, _) {
    var G = S.__data__;
    return Hs(_) ? G[typeof _ == "string" ? "string" : "hash"] : G.map;
  }
  function Lr(S, _) {
    var G = kt(S, _);
    return Io(G) ? G : void 0;
  }
  var jt = Ir ? ee(Ir, Object) : $e, rr = $o;
  (bt && rr(new bt(new ArrayBuffer(1))) != X || yn && rr(new yn()) != m || Dt && rr(Dt.resolve()) != x || wn && rr(new wn()) != N || Et && rr(new Et()) != T) && (rr = function(S) {
    var _ = Ze.call(S), G = _ == v ? S.constructor : void 0, me = G ? Dn(G) : void 0;
    if (me)
      switch (me) {
        case Gr:
          return X;
        case ds:
          return m;
        case E:
          return x;
        case O:
          return N;
        case K:
          return T;
      }
    return _;
  });
  function xi(S) {
    var _ = S.length, G = S.constructor(_);
    return _ && typeof S[0] == "string" && Ie.call(S, "index") && (G.index = S.index, G.input = S.input), G;
  }
  function Os(S) {
    return typeof S.constructor == "function" && !Si(S) ? Vr(gn(S)) : {};
  }
  function Co(S, _, G, me) {
    var Rt = S.constructor;
    switch (_) {
      case B:
        return ps(S);
      case a:
      case c:
        return new Rt(+S);
      case X:
        return ln(S, me);
      case Q:
      case oe:
      case Y:
      case b:
      case I:
      case M:
      case P:
      case W:
      case R:
        return Ps(S, me);
      case m:
        return gs(S, me, G);
      case w:
      case U:
        return new Rt(S);
      case L:
        return mi(S);
      case N:
        return Lo(S, me, G);
      case A:
        return _s(S);
    }
  }
  function ga(S, _) {
    return _ = _ ?? o, !!_ && (typeof S == "number" || C.test(S)) && S > -1 && S % 1 == 0 && S < _;
  }
  function Hs(S) {
    var _ = typeof S;
    return _ == "string" || _ == "number" || _ == "symbol" || _ == "boolean" ? S !== "__proto__" : S === null;
  }
  function Yr(S) {
    return !!St && St in S;
  }
  function Si(S) {
    var _ = S && S.constructor, G = typeof _ == "function" && _.prototype || Ne;
    return S === G;
  }
  function Dn(S) {
    if (S != null) {
      try {
        return Ke.call(S);
      } catch {
      }
      try {
        return S + "";
      } catch {
      }
    }
    return "";
  }
  function vi(S) {
    return fs(S, !0, !0);
  }
  function To(S, _) {
    return S === _ || S !== S && _ !== _;
  }
  function ms(S) {
    return k(S) && Ie.call(S, "callee") && (!$t.call(S, "callee") || Ze.call(S) == s);
  }
  var Bo = Array.isArray;
  function g(S) {
    return S != null && Te(S.length) && !ne(S);
  }
  function k(S) {
    return ke(S) && g(S);
  }
  var V = zr || st;
  function ne(S) {
    var _ = q(S) ? Ze.call(S) : "";
    return _ == h || _ == d;
  }
  function Te(S) {
    return typeof S == "number" && S > -1 && S % 1 == 0 && S <= o;
  }
  function q(S) {
    var _ = typeof S;
    return !!S && (_ == "object" || _ == "function");
  }
  function ke(S) {
    return !!S && typeof S == "object";
  }
  function xe(S) {
    return g(S) ? ko(S) : hs(S);
  }
  function $e() {
    return [];
  }
  function st() {
    return !1;
  }
  e.exports = vi;
})(pl, pl.exports);
var Xv = pl.exports;
const Cw = /* @__PURE__ */ ry(Xv);
var md;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(md || (md = {}));
function Yv(e, t) {
  return { type: md.Address, version: e, hash160: t };
}
function qv(e) {
  return fi.c32address(e.version, e.hash160);
}
const Wv = (e) => xv(Sw(e)), Zv = (e) => Ue(Wv(e));
nn.hmacSha256Sync = (e, ...t) => {
  const n = bw.create(Sw, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Jv(e, t = "mainnet") {
  t = gw(t), e = typeof e == "string" ? mt(e) : e;
  const n = fv(ks.P2PKH, t), r = Yv(n, Zv(e));
  return qv(r);
}
function Qv(e, t) {
  const n = Bn.decodeToken(e), r = n.payload;
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
  const o = r.issuer.publicKey, s = Jv(o);
  if (t !== o) {
    if (t !== s) throw new Error("Token issuer public key does not match the verifying value");
  }
  const i = new Bn.TokenVerifier(n.header.alg, o);
  if (!i)
    throw new Error("Invalid token verifier");
  if (!i.verify(e))
    throw new Error("Token verification failed");
  return n;
}
function eA(e, t = null) {
  let n;
  t ? n = Qv(e, t) : n = Bn.decodeToken(e);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const o = n.payload;
    if (typeof o == "string")
      throw new Error("Unexpected token payload type of string");
    o.hasOwnProperty("claim") && (r = o.claim);
  }
  return r;
}
const Qp = "_blockstackDidCheckEchoReply", tA = "echoReply", nA = "authContinuation";
function rA(e) {
  return e ? (/^[?#]/.test(e) ? e.slice(1) : e).split("&").reduce((n, r) => {
    const [o, s] = r.split("=");
    return n[o] = s ? decodeURIComponent(s.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function sA() {
  let e;
  if (typeof self < "u")
    e = self;
  else if (typeof window < "u")
    e = window;
  else
    return !1;
  if (!e.location || !e.localStorage)
    return !1;
  const t = e[Qp];
  if (typeof t == "boolean")
    return t;
  const n = rA(e.location.search), r = n[tA];
  if (r) {
    e[Qp] = !0;
    const o = `echo-reply-${r}`;
    return e.localStorage.setItem(o, "success"), e.setTimeout(() => {
      const s = n[nA];
      e.location.href = s;
    }, 10), !0;
  }
  return !1;
}
class bd {
  constructor(t) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), t && t.appConfig)
      this.appConfig = t.appConfig;
    else if (n)
      this.appConfig = new fy();
    else
      throw new A1("You need to specify options.appConfig");
    t && t.sessionStore ? this.store = t.sessionStore : n ? t ? this.store = new _p(t.sessionOptions) : this.store = new _p() : t ? this.store = new Mp(t.sessionOptions) : this.store = new Mp();
  }
  makeAuthRequestToken(t, n, r, o, s, i = k1().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new od("Missing AppConfig");
    return t = t || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), o = o || c.scopes, s = s || c.appDomain, zS(t, n, r, o, s, i, a);
  }
  generateAndStoreTransitKey() {
    const t = this.store.getSessionData(), n = RS();
    return t.transitKey = n, this.store.setSessionData(t), n;
  }
  getAuthResponseToken() {
    var r;
    const t = (r = pf("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(t).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (sA())
        return Pi.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (t) {
      Pi.error(`Error checking for protocol echo reply isSignInPending: ${t}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(t = this.getAuthResponseToken(), n = Y1()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new dc("Existing user session found.");
    const o = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const s = Bn.decodeToken(t).payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await YS(t))
      throw new dc("Invalid authentication response.");
    let a = s.private_key, c = s.core_token;
    if (xu(s.version, "1.1.0"))
      if (o !== void 0 && o != null) {
        if (s.private_key !== void 0 && s.private_key !== null)
          try {
            a = await Bp(o, s.private_key);
          } catch {
            if (Pi.warn("Failed decryption of appPrivateKey, will try to use as given"), !nn.isValidPrivateKey(s.private_key))
              throw new dc("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Bp(o, c);
          } catch {
            Pi.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new dc("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = O1, h;
    xu(s.version, "1.2.0") && s.hubUrl !== null && s.hubUrl !== void 0 && (u = s.hubUrl), xu(s.version, "1.3.0") && s.associationToken !== null && s.associationToken !== void 0 && (h = s.associationToken);
    const d = {
      profile: s.profile,
      email: s.email,
      decentralizedID: s.iss,
      identityAddress: fw(s.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: t,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: s.appPrivateKeyFromWalletSalt,
      coreNode: s.blockstackAPIUrl,
      gaiaAssociationToken: h
    }, m = s.profile_url;
    if (!d.profile && m) {
      const w = await n(m);
      if (!w.ok)
        d.profile = Object.assign({}, x1);
      else {
        const v = await w.text(), x = JSON.parse(v);
        d.profile = eA(x[0].token);
      }
    } else
      d.profile = s.profile;
    return r.userData = d, this.store.setSessionData(r), d;
  }
  loadUserData() {
    const t = this.store.getSessionData().userData;
    if (!t)
      throw new od("No user data found. Did the user sign in?");
    return t;
  }
  encryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Ox(t, r);
  }
  decryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Hx(t, r);
  }
  signUserOut(t) {
    this.store.deleteSessionData(), t && typeof location < "u" && location.href && (location.href = t);
  }
}
bd.prototype.makeAuthRequest = bd.prototype.makeAuthRequestToken;
const oA = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], iA = (e = []) => {
  if (typeof window > "u")
    return [];
  const t = oA(), n = e.filter((r) => t.find((s) => s.id === r.id) ? !1 : !!Yl(r.id));
  return t.concat(n);
}, Yl = (e) => e == null ? void 0 : e.split(".").reduce((t, n) => t == null ? void 0 : t[n], window), Tw = "STX_PROVIDER", Zo = () => typeof window > "u" ? null : window.localStorage.getItem(Tw), aA = (e) => {
  typeof window < "u" && window.localStorage.setItem(Tw, e);
}, cA = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function lA(e, t) {
  const n = {};
  return Object.assign(n, cA, t), await fetch(e, n);
}
function uA(e) {
  let t = lA, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function dA(...e) {
  const { fetchLib: t, middlewares: n } = uA(e);
  return async (o, s) => {
    let i = { url: o, init: s ?? {} };
    for (const c of n)
      typeof c.pre == "function" && (i = await Promise.resolve(c.pre({
        fetch: t,
        ...i
      })) ?? i);
    let a = await t(i.url, i.init);
    for (const c of n)
      typeof c.post == "function" && (a = await Promise.resolve(c.post({
        fetch: t,
        url: i.url,
        init: i.init,
        response: (a == null ? void 0 : a.clone()) ?? a
      })) ?? a);
    return a;
  };
}
var ea;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(ea || (ea = {}));
var Jo;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Jo || (Jo = {}));
var e0;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(e0 || (e0 = {}));
const fA = "https://api.mainnet.hiro.so", hA = "https://api.testnet.hiro.so", pA = "http://localhost:3999", gA = ["mainnet", "testnet", "devnet", "mocknet"];
class Qo {
  constructor(t) {
    this.version = Jo.Mainnet, this.chainId = ea.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Jo.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, o) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(o)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let o = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (o = `${o}?limit=${r.limit}&offset=${r.offset}`), o;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let o = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (o = `${o}?limit=${r.limit}&offset=${r.offset}`), o;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, o) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${o}?proof=0`, this.getMapEntryUrl = (n, r, o) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${o}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? dA();
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
Qo.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new xd();
    case "testnet":
      return new Sd();
    case "devnet":
      return new yA();
    case "mocknet":
      return new Bw();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${gA.join(", ")}`);
  }
};
Qo.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : Qo.fromName(e);
class xd extends Qo {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? fA,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Jo.Mainnet, this.chainId = ea.Mainnet;
  }
}
class Sd extends Qo {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? hA,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Jo.Testnet, this.chainId = ea.Testnet;
  }
}
class Bw extends Qo {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? pA,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Jo.Testnet, this.chainId = ea.Testnet;
  }
}
const yA = Bw;
var ei;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(ei || (ei = {}));
var gl;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(gl || (gl = {}));
ei.Mainnet;
var ti;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(ti || (ti = {}));
var ni;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ni || (ni = {}));
ti.Mainnet;
const wA = {
  chainId: ei.Mainnet,
  transactionVersion: ti.Mainnet,
  peerNetworkId: gl.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: ni.MainnetSingleSig,
    multiSig: ni.MainnetMultiSig
  },
  client: { baseUrl: ly }
}, vd = {
  chainId: ei.Testnet,
  transactionVersion: ti.Testnet,
  peerNetworkId: gl.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: ni.TestnetSingleSig,
    multiSig: ni.TestnetMultiSig
  },
  client: { baseUrl: uy }
}, Wc = {
  ...vd,
  addressVersion: { ...vd.addressVersion },
  magicBytes: "id",
  client: { baseUrl: dy }
}, mA = {
  ...Wc,
  addressVersion: { ...Wc.addressVersion },
  client: { ...Wc.client }
};
function bA(e) {
  switch (e) {
    case "mainnet":
      return wA;
    case "testnet":
      return vd;
    case "devnet":
      return Wc;
    case "mocknet":
      return mA;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function xA(e) {
  return typeof e == "string" ? bA(e) : e;
}
function SA(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const t0 = /* @__PURE__ */ new Map();
function Nw(e, t) {
  const n = t0.get(e);
  if (n !== void 0)
    return n(t);
  const r = SA(e);
  return t0.set(e, r), Nw(e, t);
}
let Ut = class {
  constructor(t) {
    this.consumed = 0, this.source = typeof t == "string" ? mt(t) : t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return G1(this.readBytes(4), 0);
  }
  readUInt8() {
    return R1(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return F1(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = Ue(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = Ue(n);
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
    if (Nw(t, r))
      return r;
    throw n(r);
  }
};
const vA = 128, AA = 128, Mw = 16, Ro = 32, Ad = 80, ql = 65, EA = 32, kA = 64, yl = 34, $A = 1 + 16 * 1024 * 1024, IA = 165, LA = 16, CA = 16, TA = 20, BA = CA + 2 + TA, NA = BA + 4, MA = $A + (IA + LA * NA);
var At;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(At || (At = {}));
var Ed;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(Ed || (Ed = {}));
var lr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(lr || (lr = {}));
const Iu = ["onChainOnly", "offChainOnly", "any"];
Iu[0] + "", lr.OnChainOnly, Iu[1] + "", lr.OffChainOnly, Iu[2] + "", lr.Any, lr.OnChainOnly + "", lr.OnChainOnly, lr.OffChainOnly + "", lr.OffChainOnly, lr.Any + "", lr.Any;
var wl;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(wl || (wl = {}));
var zt;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(zt || (zt = {}));
var en;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(en || (en = {}));
var Nt;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Nt || (Nt = {}));
var qt;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(qt || (qt = {}));
var _a;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(_a || (_a = {}));
var kd;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(kd || (kd = {}));
var $d;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})($d || ($d = {}));
var zn;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(zn || (zn = {}));
var n0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(n0 || (n0 = {}));
var Id;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Id || (Id = {}));
var Pr;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Pr || (Pr = {}));
var r0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(r0 || (r0 = {}));
let Wl = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Ui = class extends Wl {
  constructor(t) {
    super(t);
  }
}, jn = class extends Wl {
  constructor(t) {
    super(t);
  }
}, ml = class extends Wl {
  constructor(t) {
    super(t);
  }
}, Oo = class extends Wl {
  constructor(t) {
    super(t);
  }
};
function Ld(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function _A(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function _w(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function PA(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ld(e.outputLen), Ld(e.blockLen);
}
function UA(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function OA(e, t) {
  _w(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ho = {
  number: Ld,
  bool: _A,
  bytes: _w,
  hash: PA,
  exists: UA,
  output: OA
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Lu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Zr = (e, t) => e << 32 - t | e >>> t, HA = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!HA)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function DA(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Of(e) {
  if (typeof e == "string" && (e = DA(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Pw = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function hi(e) {
  const t = (r) => e().update(Of(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Uw = class extends Pw {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Ho.hash(t);
    const r = Of(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const o = this.blockLen, s = new Uint8Array(o);
    s.set(r.length > o ? t.create().update(r).digest() : r);
    for (let i = 0; i < s.length; i++)
      s[i] ^= 54;
    this.iHash.update(s), this.oHash = t.create();
    for (let i = 0; i < s.length; i++)
      s[i] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(t) {
    return Ho.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Ho.exists(this), Ho.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: o, destroyed: s, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = o, t.destroyed = s, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Ow = (e, t, n) => new Uw(e, t).update(n).digest();
Ow.create = (e, t) => new Uw(e, t);
function FA(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let Hf = class extends Pw {
  constructor(t, n, r, o) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Lu(this.buffer);
  }
  update(t) {
    Ho.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    t = Of(t);
    const s = t.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(o - this.pos, s - i);
      if (a === o) {
        const c = Lu(t);
        for (; o <= s - i; i += o)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Ho.exists(this), Ho.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let d = i; d < o; d++)
      n[d] = 0;
    FA(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Lu(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: a } = this;
    return t.length = o, t.pos = a, t.finished = s, t.destroyed = i, o % n && t.buffer.set(r), t;
  }
};
const jA = (e, t, n) => e & t ^ ~e & n, RA = (e, t, n) => e & t ^ e & n ^ t & n, zA = new Uint32Array([
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
]), Js = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Qs = new Uint32Array(64);
let Hw = class extends Hf {
  constructor() {
    super(64, 32, 8, !1), this.A = Js[0] | 0, this.B = Js[1] | 0, this.C = Js[2] | 0, this.D = Js[3] | 0, this.E = Js[4] | 0, this.F = Js[5] | 0, this.G = Js[6] | 0, this.H = Js[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: s, F: i, G: a, H: c } = this;
    return [t, n, r, o, s, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      Qs[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const m = Qs[d - 15], w = Qs[d - 2], v = Zr(m, 7) ^ Zr(m, 18) ^ m >>> 3, x = Zr(w, 17) ^ Zr(w, 19) ^ w >>> 10;
      Qs[d] = x + Qs[d - 7] + v + Qs[d - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const m = Zr(a, 6) ^ Zr(a, 11) ^ Zr(a, 25), w = h + m + jA(a, c, u) + zA[d] + Qs[d] | 0, x = (Zr(r, 2) ^ Zr(r, 13) ^ Zr(r, 22)) + RA(r, o, s) | 0;
      h = u, u = c, c = a, a = i + w | 0, i = s, s = o, o = r, r = w + x | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, o, s, i, a, c, u, h);
  }
  roundClean() {
    Qs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, GA = class extends Hw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Df = hi(() => new Hw());
hi(() => new GA());
const KA = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Dw = Uint8Array.from({ length: 16 }, (e, t) => t), VA = Dw.map((e) => (9 * e + 5) % 16);
let Ff = [Dw], jf = [VA];
for (let e = 0; e < 4; e++)
  for (let t of [Ff, jf])
    t.push(t[e].map((n) => KA[n]));
const Fw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), XA = Ff.map((e, t) => e.map((n) => Fw[t][n])), YA = jf.map((e, t) => e.map((n) => Fw[t][n])), qA = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), WA = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ec = (e, t) => e << t | e >>> 32 - t;
function s0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const kc = new Uint32Array(16);
let ZA = class extends Hf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: o, h4: s } = this;
    return [t, n, r, o, s];
  }
  set(t, n, r, o, s) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = o | 0, this.h4 = s | 0;
  }
  process(t, n) {
    for (let w = 0; w < 16; w++, n += 4)
      kc[w] = t.getUint32(n, !0);
    let r = this.h0 | 0, o = r, s = this.h1 | 0, i = s, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, m = d;
    for (let w = 0; w < 5; w++) {
      const v = 4 - w, x = qA[w], L = WA[w], N = Ff[w], U = jf[w], A = XA[w], T = YA[w];
      for (let B = 0; B < 16; B++) {
        const X = Ec(r + s0(w, s, a, u) + kc[N[B]] + x, A[B]) + d | 0;
        r = d, d = u, u = Ec(a, 10) | 0, a = s, s = X;
      }
      for (let B = 0; B < 16; B++) {
        const X = Ec(o + s0(v, i, c, h) + kc[U[B]] + L, T[B]) + m | 0;
        o = m, m = h, h = Ec(c, 10) | 0, c = i, i = X;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + m | 0, this.h3 + d + o | 0, this.h4 + r + i | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    kc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const JA = hi(() => new ZA()), $c = BigInt(2 ** 32 - 1), Cd = BigInt(32);
function jw(e, t = !1) {
  return t ? { h: Number(e & $c), l: Number(e >> Cd & $c) } : { h: Number(e >> Cd & $c) | 0, l: Number(e & $c) | 0 };
}
function QA(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let o = 0; o < e.length; o++) {
    const { h: s, l: i } = jw(e[o], t);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const eE = (e, t) => BigInt(e >>> 0) << Cd | BigInt(t >>> 0), tE = (e, t, n) => e >>> n, nE = (e, t, n) => e << 32 - n | t >>> n, rE = (e, t, n) => e >>> n | t << 32 - n, sE = (e, t, n) => e << 32 - n | t >>> n, oE = (e, t, n) => e << 64 - n | t >>> n - 32, iE = (e, t, n) => e >>> n - 32 | t << 64 - n, aE = (e, t) => t, cE = (e, t) => e, lE = (e, t, n) => e << n | t >>> 32 - n, uE = (e, t, n) => t << n | e >>> 32 - n, dE = (e, t, n) => t << n - 32 | e >>> 64 - n, fE = (e, t, n) => e << n - 32 | t >>> 64 - n;
function hE(e, t, n, r) {
  const o = (t >>> 0) + (r >>> 0);
  return { h: e + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const pE = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), gE = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, yE = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), wE = (e, t, n, r, o) => t + n + r + o + (e / 2 ** 32 | 0) | 0, mE = (e, t, n, r, o) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), bE = (e, t, n, r, o, s) => t + n + r + o + s + (e / 2 ** 32 | 0) | 0, et = {
  fromBig: jw,
  split: QA,
  toBig: eE,
  shrSH: tE,
  shrSL: nE,
  rotrSH: rE,
  rotrSL: sE,
  rotrBH: oE,
  rotrBL: iE,
  rotr32H: aE,
  rotr32L: cE,
  rotlSH: lE,
  rotlSL: uE,
  rotlBH: dE,
  rotlBL: fE,
  add: hE,
  add3L: pE,
  add3H: gE,
  add4L: yE,
  add4H: wE,
  add5H: bE,
  add5L: mE
}, [xE, SE] = et.split([
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
].map((e) => BigInt(e))), eo = new Uint32Array(80), to = new Uint32Array(80);
let Zl = class extends Hf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: m, Gh: w, Gl: v, Hh: x, Hl: L } = this;
    return [t, n, r, o, s, i, a, c, u, h, d, m, w, v, x, L];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c, u, h, d, m, w, v, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = m | 0, this.Gh = w | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      eo[A] = t.getUint32(n), to[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = eo[A - 15] | 0, B = to[A - 15] | 0, X = et.rotrSH(T, B, 1) ^ et.rotrSH(T, B, 8) ^ et.shrSH(T, B, 7), Q = et.rotrSL(T, B, 1) ^ et.rotrSL(T, B, 8) ^ et.shrSL(T, B, 7), oe = eo[A - 2] | 0, Y = to[A - 2] | 0, b = et.rotrSH(oe, Y, 19) ^ et.rotrBH(oe, Y, 61) ^ et.shrSH(oe, Y, 6), I = et.rotrSL(oe, Y, 19) ^ et.rotrBL(oe, Y, 61) ^ et.shrSL(oe, Y, 6), M = et.add4L(Q, I, to[A - 7], to[A - 16]), P = et.add4H(M, X, b, eo[A - 7], eo[A - 16]);
      eo[A] = P | 0, to[A] = M | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: m, Fh: w, Fl: v, Gh: x, Gl: L, Hh: N, Hl: U } = this;
    for (let A = 0; A < 80; A++) {
      const T = et.rotrSH(d, m, 14) ^ et.rotrSH(d, m, 18) ^ et.rotrBH(d, m, 41), B = et.rotrSL(d, m, 14) ^ et.rotrSL(d, m, 18) ^ et.rotrBL(d, m, 41), X = d & w ^ ~d & x, Q = m & v ^ ~m & L, oe = et.add5L(U, B, Q, SE[A], to[A]), Y = et.add5H(oe, N, T, X, xE[A], eo[A]), b = oe | 0, I = et.rotrSH(r, o, 28) ^ et.rotrBH(r, o, 34) ^ et.rotrBH(r, o, 39), M = et.rotrSL(r, o, 28) ^ et.rotrBL(r, o, 34) ^ et.rotrBL(r, o, 39), P = r & s ^ r & a ^ s & a, W = o & i ^ o & c ^ i & c;
      N = x | 0, U = L | 0, x = w | 0, L = v | 0, w = d | 0, v = m | 0, { h: d, l: m } = et.add(u | 0, h | 0, Y | 0, b | 0), u = a | 0, h = c | 0, a = s | 0, c = i | 0, s = r | 0, i = o | 0;
      const R = et.add3L(b, M, W);
      r = et.add3H(R, Y, I, P), o = R | 0;
    }
    ({ h: r, l: o } = et.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = et.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: a, l: c } = et.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = et.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: m } = et.add(this.Eh | 0, this.El | 0, d | 0, m | 0), { h: w, l: v } = et.add(this.Fh | 0, this.Fl | 0, w | 0, v | 0), { h: x, l: L } = et.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: N, l: U } = et.add(this.Hh | 0, this.Hl | 0, N | 0, U | 0), this.set(r, o, s, i, a, c, u, h, d, m, w, v, x, L, N, U);
  }
  roundClean() {
    eo.fill(0), to.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, vE = class extends Zl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, AE = class extends Zl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, EE = class extends Zl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
hi(() => new Zl());
hi(() => new vE());
const kE = hi(() => new AE());
hi(() => new EE());
var pt;
(function(e) {
  e.Int = "int", e.UInt = "uint", e.Buffer = "buffer", e.BoolTrue = "true", e.BoolFalse = "false", e.PrincipalStandard = "address", e.PrincipalContract = "contract", e.ResponseOk = "ok", e.ResponseErr = "err", e.OptionalNone = "none", e.OptionalSome = "some", e.List = "list", e.Tuple = "tuple", e.StringASCII = "ascii", e.StringUTF8 = "utf8";
})(pt || (pt = {}));
var hn;
(function(e) {
  e[e.int = 0] = "int", e[e.uint = 1] = "uint", e[e.buffer = 2] = "buffer", e[e.true = 3] = "true", e[e.false = 4] = "false", e[e.address = 5] = "address", e[e.contract = 6] = "contract", e[e.ok = 7] = "ok", e[e.err = 8] = "err", e[e.none = 9] = "none", e[e.some = 10] = "some", e[e.list = 11] = "list", e[e.tuple = 12] = "tuple", e[e.ascii = 13] = "ascii", e[e.utf8 = 14] = "utf8";
})(hn || (hn = {}));
function Rf(e) {
  return hn[e];
}
const $E = () => ({ type: pt.BoolTrue }), IE = () => ({ type: pt.BoolFalse }), LE = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: pt.Buffer, value: Ue(e) };
}, o0 = BigInt("0xffffffffffffffffffffffffffffffff"), CE = BigInt(0), i0 = BigInt("0x7fffffffffffffffffffffffffffffff"), a0 = BigInt("-170141183460469231731687303715884105728"), TE = (e) => {
  typeof e == "string" && e.toLowerCase().startsWith("0x") && (e = ad(mt(e))), Qn(e, Uint8Array) && (e = ad(e));
  const t = Hn(e);
  if (t > i0)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${i0}`);
  if (t < a0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${a0}`);
  return { type: pt.Int, value: t };
}, BE = (e) => {
  const t = Hn(e);
  if (t < CE)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > o0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${o0}`);
  return { type: pt.UInt, value: t };
};
function NE(e) {
  return { type: pt.List, value: e };
}
function Rw() {
  return { type: pt.OptionalNone };
}
function zw(e) {
  return { type: pt.OptionalSome, value: e };
}
var we;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(we || (we = {}));
function ME() {
  return {
    type: we.Address,
    version: ni.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function c0(e) {
  if (e && Jw(e, yl))
    throw new Error(`Memo exceeds maximum length of ${yl} bytes`);
  return { type: we.MemoString, content: e };
}
function zf(e, t) {
  return {
    type: we.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function Td(e) {
  if (mt(e).byteLength != ql)
    throw Error("Invalid signature");
  return {
    type: we.MessageSignature,
    data: e
  };
}
function _E(e, t, n) {
  return typeof e == "string" && (e = WE(e)), typeof n == "string" && (n = c0(n)), {
    type: we.Payload,
    payloadType: At.TokenTransfer,
    recipient: e,
    amount: Hn(t),
    memo: n ?? c0("")
  };
}
function PE(e, t, n, r) {
  return typeof t == "string" && (t = Fr(t)), typeof n == "string" && (n = Fr(n)), {
    type: we.Payload,
    payloadType: At.ContractCall,
    contractAddress: typeof e == "string" ? vo(e) : e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function UE(e) {
  return Fr(e, 4, 1e5);
}
function l0(e, t, n) {
  return typeof e == "string" && (e = Fr(e)), typeof t == "string" && (t = UE(t)), typeof n == "number" ? {
    type: we.Payload,
    payloadType: At.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: we.Payload,
    payloadType: At.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function OE() {
  return { type: we.Payload, payloadType: At.PoisonMicroblock };
}
function u0(e, t) {
  if (e.byteLength != Ro)
    throw Error(`Coinbase buffer size must be ${Ro} bytes`);
  return t != null ? {
    type: we.Payload,
    payloadType: At.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: we.Payload,
    payloadType: At.Coinbase,
    coinbaseBytes: e
  };
}
function HE(e, t, n) {
  if (e.byteLength != Ro)
    throw Error(`Coinbase buffer size must be ${Ro} bytes`);
  if (n.byteLength != Ad)
    throw Error(`VRF proof buffer size must be ${Ad} bytes`);
  return {
    type: we.Payload,
    payloadType: At.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === pt.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
function DE(e, t, n, r, o, s, i) {
  return {
    type: we.Payload,
    payloadType: At.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: o,
    cause: s,
    publicKeyHash: i
  };
}
function Fr(e, t, n) {
  const r = t || 1, o = n || vA;
  if (Jw(e, o))
    throw new Error(`String length exceeds maximum bytes ${o}`);
  return {
    type: we.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: o
  };
}
function FE(e, t, n) {
  return {
    type: we.Asset,
    address: vo(e),
    contractName: Fr(t),
    assetName: Fr(n)
  };
}
function vo(e) {
  const t = fi.c32addressDecode(e);
  return {
    type: we.Address,
    version: t[0],
    hash160: t[1]
  };
}
function jE(e, t) {
  const n = vo(e), r = Fr(t);
  return {
    type: we.Principal,
    prefix: zn.Contract,
    address: n,
    contractName: r
  };
}
function RE(e) {
  const t = vo(e);
  return {
    type: we.Principal,
    prefix: zn.Standard,
    address: t
  };
}
function Oi(e, t) {
  return {
    pubKeyEncoding: e,
    type: we.TransactionAuthField,
    contents: t
  };
}
function As(e) {
  switch (e.type) {
    case we.Address:
      return rc(e);
    case we.Principal:
      return Gw(e);
    case we.LengthPrefixedString:
      return na(e);
    case we.MemoString:
      return GE(e);
    case we.Asset:
      return Vw(e);
    case we.PostCondition:
      return Yw(e);
    case we.PublicKey:
      return Md(e);
    case we.LengthPrefixedList:
      return Gf(e);
    case we.Payload:
      return qw(e);
    case we.TransactionAuthField:
      return qE(e);
    case we.MessageSignature:
      return Kf(e);
  }
}
function rc(e) {
  const t = [];
  return t.push(mt(Za(e.version, 1))), t.push(mt(e.hash160)), an(t);
}
function ta(e) {
  const t = Qn(e, Ut) ? e : new Ut(e), n = Ul(Ue(t.readBytes(1))), r = Ue(t.readBytes(20));
  return { type: we.Address, version: n, hash160: r };
}
function Gw(e) {
  const t = [];
  return t.push(e.prefix), (e.prefix === zn.Standard || e.prefix === zn.Contract) && t.push(rc(e.address)), e.prefix === zn.Contract && t.push(na(e.contractName)), an(t);
}
function zE(e) {
  const t = Qn(e, Ut) ? e : new Ut(e), n = t.readUInt8Enum(zn, (s) => {
    throw new jn(`Unexpected Principal payload type: ${s}`);
  });
  if (n === zn.Origin)
    return { type: we.Principal, prefix: n };
  const r = ta(t);
  if (n === zn.Standard)
    return { type: we.Principal, prefix: n, address: r };
  const o = Er(t);
  return {
    type: we.Principal,
    prefix: n,
    address: r,
    contractName: o
  };
}
function na(e) {
  const t = [], n = ci(e.content), r = n.byteLength;
  return t.push(mt(Za(r, e.lengthPrefixBytes))), t.push(n), an(t);
}
function Er(e, t, n) {
  t = t || 1;
  const r = Qn(e, Ut) ? e : new Ut(e), o = Ul(Ue(r.readBytes(t))), s = Ja(r.readBytes(o));
  return Fr(s, t, n ?? 128);
}
function GE(e) {
  const t = [], n = ci(e.content), r = mk(Ue(n), yl * 2);
  return t.push(mt(r)), an(t);
}
function Kw(e) {
  const t = Qn(e, Ut) ? e : new Ut(e);
  let n = Ja(t.readBytes(yl));
  return n = n.replace(/\u0000*$/, ""), { type: we.MemoString, content: n };
}
function Vw(e) {
  const t = [];
  return t.push(rc(e.address)), t.push(na(e.contractName)), t.push(na(e.assetName)), an(t);
}
function Bd(e) {
  const t = Qn(e, Ut) ? e : new Ut(e);
  return {
    type: we.Asset,
    address: ta(t),
    contractName: Er(t),
    assetName: Er(t)
  };
}
function Gf(e) {
  const t = e.values, n = [];
  n.push(mt(Za(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(As(r));
  return an(n);
}
function Xw(e, t, n) {
  const r = Qn(e, Ut) ? e : new Ut(e), o = Ul(Ue(r.readBytes(4))), s = [];
  for (let i = 0; i < o; i++)
    switch (t) {
      case we.Address:
        s.push(ta(r));
        break;
      case we.LengthPrefixedString:
        s.push(Er(r));
        break;
      case we.MemoString:
        s.push(Kw(r));
        break;
      case we.Asset:
        s.push(Bd(r));
        break;
      case we.PostCondition:
        s.push(VE(r));
        break;
      case we.PublicKey:
        s.push(_d(r));
        break;
      case we.TransactionAuthField:
        s.push(YE(r));
        break;
    }
  return zf(s, n);
}
function KE(e) {
  return Ue(Yw(e));
}
function Yw(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(Gw(e.principal)), (e.conditionType === zt.Fungible || e.conditionType === zt.NonFungible) && t.push(Vw(e.asset)), e.conditionType === zt.NonFungible && t.push(ss(e.assetName)), t.push(e.conditionCode), e.conditionType === zt.STX || e.conditionType === zt.Fungible || e.conditionType === zt.Staking) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new Ui("The post-condition amount may not be larger than 8 bytes");
    t.push(xo(e.amount, 8));
  }
  return an(t);
}
function VE(e) {
  const t = Qn(e, Ut) ? e : new Ut(e), n = t.readUInt8Enum(zt, (a) => {
    throw new jn(`Could not read ${a} as PostConditionType`);
  }), r = zE(t);
  let o, s, i;
  switch (n) {
    case zt.STX:
      return o = t.readUInt8Enum(_a, (c) => {
        throw new jn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ue(t.readBytes(8))}`), {
        type: we.PostCondition,
        conditionType: zt.STX,
        principal: r,
        conditionCode: o,
        amount: i
      };
    case zt.Fungible:
      return s = Bd(t), o = t.readUInt8Enum(_a, (c) => {
        throw new jn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ue(t.readBytes(8))}`), {
        type: we.PostCondition,
        conditionType: zt.Fungible,
        principal: r,
        conditionCode: o,
        amount: i,
        asset: s
      };
    case zt.NonFungible:
      s = Bd(t);
      const a = ts(t);
      return o = t.readUInt8Enum(kd, (c) => {
        throw new jn(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: we.PostCondition,
        conditionType: zt.NonFungible,
        principal: r,
        conditionCode: o,
        asset: s,
        assetName: a
      };
    case zt.Staking:
      return o = t.readUInt8Enum(_a, (c) => {
        throw new jn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ue(t.readBytes(8))}`), {
        type: we.PostCondition,
        conditionType: zt.Staking,
        principal: r,
        conditionCode: o,
        amount: i
      };
    case zt.PoX: {
      const c = t.readUInt8Enum($d, (u) => {
        throw new jn(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: we.PostCondition,
        conditionType: zt.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function qw(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case At.TokenTransfer:
      t.push(ss(e.recipient)), t.push(xo(e.amount, 8)), t.push(As(e.memo));
      break;
    case At.ContractCall:
      t.push(As(e.contractAddress)), t.push(As(e.contractName)), t.push(As(e.functionName));
      const n = new Uint8Array(4);
      Vo(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(ss(r));
      });
      break;
    case At.SmartContract:
      t.push(As(e.contractName)), t.push(As(e.codeBody));
      break;
    case At.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(As(e.contractName)), t.push(As(e.codeBody));
      break;
    case At.PoisonMicroblock:
      break;
    case At.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case At.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(ss(e.recipient));
      break;
    case At.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(ss(e.recipient ? zw(e.recipient) : Rw())), t.push(e.vrfProof);
      break;
    case At.TenureChange:
      t.push(mt(e.tenureHash)), t.push(mt(e.previousTenureHash)), t.push(mt(e.burnViewHash)), t.push(mt(e.previousTenureEnd)), t.push(Vo(new Uint8Array(4), e.previousTenureBlocks)), t.push(z1(new Uint8Array(1), e.cause)), t.push(mt(e.publicKeyHash));
      break;
  }
  return an(t);
}
function XE(e) {
  const t = Qn(e, Ut) ? e : new Ut(e);
  switch (t.readUInt8Enum(At, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case At.TokenTransfer:
      const r = ts(t), o = Hn(t.readBytes(8)), s = Kw(t);
      return _E(r, o, s);
    case At.ContractCall:
      const i = ta(t), a = Er(t), c = Er(t), u = [], h = t.readUInt32BE();
      for (let T = 0; T < h; T++) {
        const B = ts(t);
        u.push(B);
      }
      return PE(i, a, c, u);
    case At.SmartContract:
      const d = Er(t), m = Er(t, 4, 1e5);
      return l0(d, m);
    case At.VersionedSmartContract: {
      const T = t.readUInt8Enum(Ed, (Q) => {
        throw new Error(`Cannot recognize ClarityVersion: ${Q}`);
      }), B = Er(t), X = Er(t, 4, MA);
      return l0(B, X, T);
    }
    case At.PoisonMicroblock:
      return OE();
    case At.Coinbase: {
      const T = t.readBytes(Ro);
      return u0(T);
    }
    case At.CoinbaseToAltRecipient: {
      const T = t.readBytes(Ro), B = ts(t);
      return u0(T, B);
    }
    case At.NakamotoCoinbase: {
      const T = t.readBytes(Ro), B = ts(t), X = t.readBytes(Ad);
      return HE(T, B, X);
    }
    case At.TenureChange:
      const w = Ue(t.readBytes(20)), v = Ue(t.readBytes(20)), x = Ue(t.readBytes(20)), L = Ue(t.readBytes(32)), N = t.readUInt32BE(), U = t.readUInt8Enum(Id, (T) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${T}`);
      }), A = Ue(t.readBytes(20));
      return DE(w, v, x, L, N, U, A);
  }
}
function Nd(e) {
  const t = Qn(e, Ut) ? e : new Ut(e);
  return Td(Ue(t.readBytes(ql)));
}
function YE(e) {
  const t = Qn(e, Ut) ? e : new Ut(e), n = t.readUInt8Enum(Pr, (r) => {
    throw new jn(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case Pr.PublicKeyCompressed:
      return Oi(qt.Compressed, _d(t));
    case Pr.PublicKeyUncompressed:
      return Oi(qt.Uncompressed, ua(Ck(_d(t).data)));
    case Pr.SignatureCompressed:
      return Oi(qt.Compressed, Nd(t));
    case Pr.SignatureUncompressed:
      return Oi(qt.Uncompressed, Nd(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Kf(e) {
  return mt(e.data);
}
function qE(e) {
  const t = [];
  switch (e.contents.type) {
    case we.PublicKey:
      t.push(e.pubKeyEncoding === qt.Compressed ? Pr.PublicKeyCompressed : Pr.PublicKeyUncompressed), t.push(mt(Lk(e.contents.data)));
      break;
    case we.MessageSignature:
      t.push(e.pubKeyEncoding === qt.Compressed ? Pr.SignatureCompressed : Pr.SignatureUncompressed), t.push(Kf(e.contents));
      break;
  }
  return an(t);
}
function Md(e) {
  return e.data.slice();
}
function _d(e) {
  const t = Qn(e, Ut) ? e : new Ut(e), n = t.readUInt8(), r = n === 4 ? kA : EA;
  return ua(an([n, t.readBytes(r)]));
}
function Vf(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === Nt.P2PKH || t === Nt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === Nt.P2WPKH || t === Nt.P2WSH || t === Nt.P2WSHNonSequential) && !r.map((o) => o.data).every(da))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case Nt.P2PKH:
      return Ic(e, bk(r[0].data));
    case Nt.P2WPKH:
      return Ic(e, xk(r[0].data));
    case Nt.P2SH:
    case Nt.P2SHNonSequential:
      return Ic(e, Sk(n, r.map(Md)));
    case Nt.P2WSH:
    case Nt.P2WSHNonSequential:
      return Ic(e, vk(n, r.map(Md)));
  }
}
function Ic(e, t) {
  return { type: we.Address, version: e, hash160: t };
}
function Xf(e) {
  return fi.c32address(e.version, e.hash160);
}
function d0(e) {
  const [t, n, r] = e.split(/\.|::/);
  return FE(t, n, r);
}
function Sa(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return jE(t, n);
  } else
    return RE(e);
}
function WE(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return QE(t, n);
  } else
    return ZE(e);
}
function ZE(e) {
  const t = vo(e);
  return { type: pt.PrincipalStandard, value: Xf(t) };
}
function JE(e) {
  return { type: pt.PrincipalStandard, value: Xf(e) };
}
function QE(e, t) {
  const n = vo(e), r = Fr(t);
  return Ww(n, r);
}
function Ww(e, t) {
  if (ci(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: pt.PrincipalContract,
    value: `${Xf(e)}.${t.content}`
  };
}
function ek(e) {
  return { type: pt.ResponseErr, value: e };
}
function tk(e) {
  return { type: pt.ResponseOk, value: e };
}
const nk = (e) => ({ type: pt.StringASCII, value: e }), rk = (e) => ({ type: pt.StringUTF8, value: e });
function sk(e) {
  for (const t in e)
    if (!Ak(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: pt.Tuple, value: e };
}
function ts(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new Ut(mt(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new Ut(e) : t = e;
  switch (t.readUInt8Enum(hn, (r) => {
    throw new jn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case hn.int:
      return TE(ad(t.readBytes(16)));
    case hn.uint:
      return BE(t.readBytes(16));
    case hn.buffer:
      const r = t.readUInt32BE();
      return LE(t.readBytes(r));
    case hn.true:
      return $E();
    case hn.false:
      return IE();
    case hn.address:
      const o = ta(t);
      return JE(o);
    case hn.contract:
      const s = ta(t), i = Er(t);
      return Ww(s, i);
    case hn.ok:
      return tk(ts(t));
    case hn.err:
      return ek(ts(t));
    case hn.none:
      return Rw();
    case hn.some:
      return zw(ts(t));
    case hn.list:
      const a = t.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(ts(t));
      return NE(c);
    case hn.tuple:
      const u = t.readUInt32BE(), h = {};
      for (let x = 0; x < u; x++) {
        const L = Er(t).content;
        if (L === void 0)
          throw new jn('"content" is undefined');
        h[L] = ts(t);
      }
      return sk(h);
    case hn.ascii:
      const d = t.readUInt32BE(), m = P1(t.readBytes(d));
      return nk(m);
    case hn.utf8:
      const w = t.readUInt32BE(), v = Ja(t.readBytes(w));
      return rk(v);
    default:
      throw new jn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function cs(e, t) {
  return an([Rf(e), t]);
}
function ok(e) {
  return new Uint8Array([Rf(e.type)]);
}
function ik(e) {
  return e.type === pt.OptionalNone ? new Uint8Array([Rf(e.type)]) : cs(e.type, ss(e.value));
}
function ak(e) {
  const t = new Uint8Array(4);
  return Vo(t, Math.ceil(e.value.length / 2), 0), cs(e.type, is(t, mt(e.value)));
}
function ck(e) {
  const t = gf(T1(BigInt(e.value), BigInt(AA)), Mw);
  return cs(e.type, t);
}
function lk(e) {
  const t = gf(BigInt(e.value), Mw);
  return cs(e.type, t);
}
function uk(e) {
  return cs(e.type, rc(vo(e.value)));
}
function dk(e) {
  const [t, n] = Ek(e.value);
  return cs(e.type, is(rc(vo(t)), na(Fr(n))));
}
function fk(e) {
  return cs(e.type, ss(e.value));
}
function hk(e) {
  const t = [], n = new Uint8Array(4);
  Vo(n, e.value.length, 0), t.push(n);
  for (const r of e.value) {
    const o = ss(r);
    t.push(o);
  }
  return cs(e.type, an(t));
}
function pk(e) {
  const t = [], n = new Uint8Array(4);
  Vo(n, Object.keys(e.value).length, 0), t.push(n);
  const r = Object.keys(e.value).sort((o, s) => o.localeCompare(s));
  for (const o of r) {
    const s = Fr(o);
    t.push(na(s));
    const i = ss(e.value[o]);
    t.push(i);
  }
  return cs(e.type, an(t));
}
function Zw(e, t) {
  const n = [], r = t == "ascii" ? _1(e.value) : ci(e.value), o = new Uint8Array(4);
  return Vo(o, r.length, 0), n.push(o), n.push(r), cs(e.type, an(n));
}
function gk(e) {
  return Zw(e, "ascii");
}
function yk(e) {
  return Zw(e, "utf8");
}
function f0(e) {
  return Ue(ss(e));
}
function ss(e) {
  switch (e.type) {
    case pt.BoolTrue:
    case pt.BoolFalse:
      return ok(e);
    case pt.OptionalNone:
    case pt.OptionalSome:
      return ik(e);
    case pt.Buffer:
      return ak(e);
    case pt.UInt:
      return lk(e);
    case pt.Int:
      return ck(e);
    case pt.PrincipalStandard:
      return uk(e);
    case pt.PrincipalContract:
      return dk(e);
    case pt.ResponseOk:
    case pt.ResponseErr:
      return fk(e);
    case pt.List:
      return hk(e);
    case pt.Tuple:
      return pk(e);
    case pt.StringASCII:
      return gk(e);
    case pt.StringUTF8:
      return yk(e);
    default:
      throw new Ui("Unable to serialize. Invalid Clarity Value.");
  }
}
const wk = (e) => e.length % 2 ? `0${e}` : e, mk = (e, t) => e.padEnd(t, "0"), Jw = (e, t) => e ? ci(e).length > t : !1;
function Pd(e) {
  return Cw(e);
}
const Fa = (e) => JA(Df(e)), Yf = (e) => Ue(kE(e)), bk = (e) => Ue(Fa(e)), xk = (e) => {
  const t = Fa(e), n = is(new Uint8Array([0]), new Uint8Array([t.length]), t), r = Fa(n);
  return Ue(r);
}, Sk = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + t.length), n.push(174);
  const r = an(n), o = Fa(r);
  return Ue(o);
}, vk = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + t.length), n.push(174);
  const r = an(n), o = Df(r), s = [];
  s.push(0), s.push(o.length), s.push(o);
  const i = an(s), a = Fa(i);
  return Ue(a);
};
function Ak(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function Ek(e) {
  const [t, n] = e.split(".");
  if (!t || !n)
    throw new Error(`Invalid contract identifier: ${e}`);
  return [t, n];
}
nn.hmacSha256Sync = (e, ...t) => {
  const n = Ow.create(Df, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function ua(e) {
  return e = typeof e == "string" ? mt(e) : e, {
    type: we.PublicKey,
    data: e
  };
}
function kk(e, t, n = qt.Compressed) {
  const r = D1(t), o = new pr(fp(r.r), fp(r.s)), s = at.fromSignature(e, o, r.recoveryId), i = n === qt.Compressed;
  return s.toHex(i);
}
function $k(e) {
  return typeof e == "string" ? e : Ue(e);
}
const qf = $k;
function Qw(e) {
  return (typeof e == "string" ? e.length / 2 : e.byteLength) === H1;
}
function da(e) {
  return !qf(e).startsWith("04");
}
function Ik(e) {
  e = yf(e);
  const t = Qw(e);
  return Ue(Qa(e.slice(0, 32), t));
}
function Lk(e) {
  return at.fromHex(qf(e)).toHex(!0);
}
function Ck(e) {
  return at.fromHex(qf(e)).toHex(!1);
}
function Tk(e, t) {
  e = yf(e);
  const [n, r] = Hl(t, e.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Za(r, 1) + pr.fromHex(n).toCompactHex();
}
function Wf() {
  return {
    type: we.MessageSignature,
    data: Ue(new Uint8Array(ql))
  };
}
function em(e, t, n, r) {
  const o = Vf(0, e, 1, [ua(t)]).hash160, s = da(t) ? qt.Compressed : qt.Uncompressed;
  return {
    hashMode: e,
    signer: o,
    nonce: Hn(n),
    fee: Hn(r),
    keyEncoding: s,
    signature: Wf()
  };
}
function ja(e) {
  return "signature" in e;
}
function h0(e) {
  return e === Nt.P2SH || e === Nt.P2WSH;
}
function Bk(e) {
  return e === Nt.P2SHNonSequential || e === Nt.P2WSHNonSequential;
}
function p0(e) {
  const t = Pd(e);
  return t.nonce = 0, t.fee = 0, ja(t) ? t.signature = Wf() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function Nk(e) {
  const t = [
    e.hashMode,
    mt(e.signer),
    xo(e.nonce, 8),
    xo(e.fee, 8),
    e.keyEncoding,
    Kf(e.signature)
  ];
  return an(t);
}
function Mk(e) {
  const t = [
    e.hashMode,
    mt(e.signer),
    xo(e.nonce, 8),
    xo(e.fee, 8)
  ], n = zf(e.fields);
  t.push(Gf(n));
  const r = new Uint8Array(2);
  return j1(r, e.signaturesRequired, 0), t.push(r), an(t);
}
function _k(e, t) {
  const n = Ue(t.readBytes(20)), r = BigInt(`0x${Ue(t.readBytes(8))}`), o = BigInt(`0x${Ue(t.readBytes(8))}`), s = t.readUInt8Enum(qt, (a) => {
    throw new jn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (e === Nt.P2WPKH && s != qt.Compressed)
    throw new jn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const i = Nd(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: o,
    keyEncoding: s,
    signature: i
  };
}
function Pk(e, t) {
  const n = Ue(t.readBytes(20)), r = BigInt("0x" + Ue(t.readBytes(8))), o = BigInt("0x" + Ue(t.readBytes(8))), s = Xw(t, we.TransactionAuthField).values;
  let i = !1, a = 0;
  for (const u of s)
    switch (u.contents.type) {
      case we.PublicKey:
        da(u.contents.data) || (i = !0);
        break;
      case we.MessageSignature:
        if (u.pubKeyEncoding === qt.Uncompressed && (i = !0), a += 1, a === 65536)
          throw new Oo("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = t.readUInt16BE();
  if (i && (e === Nt.P2WSH || e === Nt.P2WSHNonSequential))
    throw new Oo("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: o,
    fields: s,
    signaturesRequired: c
  };
}
function Cu(e) {
  return ja(e) ? Nk(e) : Mk(e);
}
function Tu(e) {
  const t = e.readUInt8Enum(Nt, (n) => {
    throw new jn(`Could not parse ${n} as AddressHashMode`);
  });
  return t === Nt.P2PKH || t === Nt.P2WPKH ? _k(t, e) : Pk(t, e);
}
function tm(e, t, n, r) {
  const s = e + Ue(new Uint8Array([t])) + Ue(xo(n, 8)) + Ue(xo(r, 8));
  if (mt(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Yf(mt(s));
}
function nm(e, t, n) {
  const r = 33 + ql, o = da(t.data) ? qt.Compressed : qt.Uncompressed, s = e + wk(o.toString(16)) + n, i = mt(s);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return Yf(i);
}
function Uk(e, t, n, r, o) {
  const s = tm(e, t, n, r), i = Tk(o, s), a = ua(Ik(o)), c = nm(s, a, i);
  return {
    nextSig: i,
    nextSigHash: c
  };
}
function rm(e, t, n, r, o, s) {
  const i = tm(e, t, n, r), a = ua(kk(i, s, o)), c = nm(i, a, s);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function Ok() {
  const e = em(Nt.P2PKH, "", 0, 0);
  return e.signer = ME().hash160, e.keyEncoding = qt.Compressed, e.signature = Wf(), e;
}
function g0(e, t, n) {
  return ja(e) ? Hk(e, t, n) : Dk(e, t, n);
}
function Hk(e, t, n) {
  const { pubKey: r, nextSigHash: o } = rm(t, n, e.fee, e.nonce, e.keyEncoding, e.signature.data), s = Vf(0, e.hashMode, 1, [r]).hash160;
  if (s !== e.signer)
    throw new Oo(`Signer hash does not equal hash of public key(s): ${s} != ${e.signer}`);
  return o;
}
function Dk(e, t, n) {
  const r = [];
  let o = t, s = !1, i = 0;
  for (const c of e.fields)
    switch (c.contents.type) {
      case we.PublicKey:
        da(c.contents.data) || (s = !0), r.push(c.contents);
        break;
      case we.MessageSignature:
        c.pubKeyEncoding === qt.Uncompressed && (s = !0);
        const { pubKey: u, nextSigHash: h } = rm(o, n, e.fee, e.nonce, c.pubKeyEncoding, c.contents.data);
        if (h0(e.hashMode) && (o = h), r.push(u), i += 1, i === 65536)
          throw new Oo("Too many signatures");
        break;
    }
  if (h0(e.hashMode) && i !== e.signaturesRequired || Bk(e.hashMode) && i < e.signaturesRequired)
    throw new Oo("Incorrect number of signatures");
  if (s && (e.hashMode === Nt.P2WSH || e.hashMode === Nt.P2WSHNonSequential))
    throw new Oo("Uncompressed keys are not allowed in this hash mode");
  const a = Vf(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new Oo(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return o;
}
function sm(e) {
  return {
    authType: en.Standard,
    spendingCondition: e
  };
}
function om(e, t) {
  return {
    authType: en.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || em(Nt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function y0(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case en.Standard:
        return sm(p0(e.spendingCondition));
      case en.Sponsored:
        return om(p0(e.spendingCondition), Ok());
      default:
        throw new ml("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function Fk(e, t) {
  switch (e.authType) {
    case en.Standard:
      return g0(e.spendingCondition, t, en.Standard);
    case en.Sponsored:
      return g0(e.spendingCondition, t, en.Standard);
    default:
      throw new ml("Invalid origin auth type");
  }
}
function jk(e, t) {
  switch (e.authType) {
    case en.Standard:
      const n = {
        ...e.spendingCondition,
        fee: Hn(t)
      };
      return { ...e, spendingCondition: n };
    case en.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: Hn(t)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function Rk(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: Hn(t)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function zk(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: Hn(t)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function Gk(e, t) {
  const n = {
    ...t,
    nonce: Hn(t.nonce),
    fee: Hn(t.fee)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function Kk(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case en.Standard:
      t.push(Cu(e.spendingCondition));
      break;
    case en.Sponsored:
      t.push(Cu(e.spendingCondition)), t.push(Cu(e.sponsorSpendingCondition));
      break;
  }
  return an(t);
}
function Vk(e) {
  const t = e.readUInt8Enum(en, (r) => {
    throw new jn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case en.Standard:
      return n = Tu(e), sm(n);
    case en.Sponsored:
      n = Tu(e);
      const r = Tu(e);
      return om(n, r);
  }
}
class Xk {
  constructor({ auth: t, payload: n, postConditions: r = zf([]), postConditionMode: o = wl.Deny, transactionVersion: s, chainId: i, network: a = "mainnet" }) {
    a = xA(a), this.transactionVersion = s ?? a.transactionVersion, this.chainId = i ?? a.chainId, this.auth = t, "amount" in n ? this.payload = {
      ...n,
      amount: Hn(n.amount)
    } : this.payload = n, this.postConditionMode = o, this.postConditions = r, this.anchorMode = lr.Any;
  }
  signBegin() {
    const t = Pd(this);
    return t.auth = y0(t.auth), t.txid();
  }
  verifyBegin() {
    const t = Pd(this);
    return t.auth = y0(t.auth), t.txid();
  }
  verifyOrigin() {
    return Fk(this.auth, this.verifyBegin());
  }
  signNextOrigin(t, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, t, en.Standard, n);
  }
  signNextSponsor(t, n) {
    if (this.auth.authType === en.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, t, en.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(t) {
    const n = typeof t == "object" && "type" in t ? t : ua(t), r = this.auth.spendingCondition;
    if (r && !ja(r)) {
      const o = da(n.data);
      r.fields.push(Oi(o ? qt.Compressed : qt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, o) {
    const { nextSig: s, nextSigHash: i } = Uk(n, r, t.fee, t.nonce, o);
    if (ja(t))
      t.signature = Td(s);
    else {
      const a = Qw(o);
      t.fields.push(Oi(a ? qt.Compressed : qt.Uncompressed, Td(s)));
    }
    return i;
  }
  txid() {
    const t = this.serializeBytes();
    return Yf(t);
  }
  setSponsor(t) {
    if (this.auth.authType != en.Sponsored)
      throw new ml("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Gk(this.auth, t);
  }
  setFee(t) {
    this.auth = jk(this.auth, t);
  }
  setNonce(t) {
    this.auth = Rk(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != en.Sponsored)
      throw new ml("Cannot sponsor sign a non-sponsored transaction");
    this.auth = zk(this.auth, t);
  }
  serialize() {
    return Ue(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Ui('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Ui('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Ui('"auth" is undefined');
    if (this.payload === void 0)
      throw new Ui('"payload" is undefined');
    const t = [];
    t.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Vo(n, this.chainId, 0), t.push(n), t.push(Kk(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(Gf(this.postConditions)), t.push(qw(this.payload)), an(t);
  }
}
function Yk(e) {
  const t = Qn(e, Ut) ? e : new Ut(e), n = t.readUInt8Enum(ti, (h) => {
    throw new Error(`Could not parse ${h} as TransactionVersion`);
  }), r = t.readUInt32BE(), o = Vk(t), s = t.readUInt8Enum(lr, (h) => {
    throw new Error(`Could not parse ${h} as AnchorMode`);
  }), i = t.readUInt8Enum(wl, (h) => {
    throw new Error(`Could not parse ${h} as PostConditionMode`);
  }), a = Xw(t, we.PostCondition), c = XE(t), u = new Xk({
    transactionVersion: n,
    chainId: r,
    auth: o,
    payload: c,
    postConditions: a,
    postConditionMode: i
  });
  return u.anchorMode = s, u;
}
const w0 = BigInt("18446744073709551615");
function Bu(e) {
  const t = Hn(e);
  if (t < 0n || t > w0)
    throw new RangeError(`Post-condition amount must be between 0 and ${w0} (u64 max), received: ${t}`);
  return t;
}
var Ud;
(function(e) {
  e[e.eq = 1] = "eq", e[e.gt = 2] = "gt", e[e.lt = 4] = "lt", e[e.gte = 3] = "gte", e[e.lte = 5] = "lte", e[e.sent = 16] = "sent", e[e["not-sent"] = 17] = "not-sent", e[e["maybe-sent"] = 18] = "maybe-sent";
})(Ud || (Ud = {}));
var Od;
(function(e) {
  e[e["will-not-perform"] = 48] = "will-not-perform", e[e["may-perform"] = 49] = "may-perform", e[e["will-perform"] = 50] = "will-perform";
})(Od || (Od = {}));
function qk(e) {
  switch (e.type) {
    case "stx-postcondition":
      return {
        type: we.PostCondition,
        conditionType: zt.STX,
        principal: e.address === "origin" ? { type: we.Principal, prefix: zn.Origin } : Sa(e.address),
        conditionCode: Lc(e.condition),
        amount: Bu(e.amount)
      };
    case "ft-postcondition":
      return {
        type: we.PostCondition,
        conditionType: zt.Fungible,
        principal: e.address === "origin" ? { type: we.Principal, prefix: zn.Origin } : Sa(e.address),
        conditionCode: Lc(e.condition),
        amount: Bu(e.amount),
        asset: d0(e.asset)
      };
    case "nft-postcondition":
      return {
        type: we.PostCondition,
        conditionType: zt.NonFungible,
        principal: e.address === "origin" ? { type: we.Principal, prefix: zn.Origin } : Sa(e.address),
        conditionCode: Lc(e.condition),
        asset: d0(e.asset),
        assetName: e.assetId
      };
    case "staking-postcondition":
      return {
        type: we.PostCondition,
        conditionType: zt.Staking,
        principal: e.address === "origin" ? { type: we.Principal, prefix: zn.Origin } : Sa(e.address),
        conditionCode: Lc(e.condition),
        amount: Bu(e.amount)
      };
    case "pox-postcondition":
      return {
        type: we.PostCondition,
        conditionType: zt.PoX,
        principal: e.address === "origin" ? { type: we.Principal, prefix: zn.Origin } : Sa(e.address),
        conditionCode: Wk(e.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Lc(e) {
  return Ud[e];
}
function Wk(e) {
  return Od[e];
}
function im(e) {
  const t = qk(e);
  return KE(t);
}
function Zk(e, t, n) {
  return Jf(am(e), n);
}
function am(e, t) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Ra(r);
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
    return BigInt(`0x${e3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Zf(e, t = 8) {
  return (typeof e == "bigint" ? e : am(e)).toString(16).padStart(t * 2, "0");
}
function Jf(e, t = 16) {
  const n = Zf(e, t);
  return Ra(n);
}
function Jk(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
const Qk = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function e3(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += Qk[n];
  return t;
}
function Ra(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e;
  const t = e.length % 2 ? `0${e}` : e, n = new Uint8Array(t.length / 2);
  for (let r = 0; r < n.length; r++) {
    const o = r * 2, s = t.slice(o, o + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    n[r] = i;
  }
  return n;
}
function Qf(e) {
  return new TextEncoder().encode(e);
}
function t3(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function n3(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function m0(e) {
  if (e.some(n3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function eh(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, o) => r + o.length, 0), n = new Uint8Array(t);
  for (let r = 0, o = 0; r < e.length; r++) {
    const s = e[r];
    n.set(s, o), o += s.length;
  }
  return n;
}
function Bs(e) {
  return eh(...e.map((t) => typeof t == "number" ? m0([t]) : t instanceof Array ? m0(t) : t));
}
function Jl(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var Hd;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Hd || (Hd = {}));
Hd.Mainnet;
const r3 = 128, s3 = 128, cm = 16;
var Dd;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Dd || (Dd = {}));
var b0;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(b0 || (b0 = {}));
var x0;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(x0 || (x0 = {}));
var Nr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Nr || (Nr = {}));
const Nu = ["onChainOnly", "offChainOnly", "any"];
Nu[0] + "", Nr.OnChainOnly, Nu[1] + "", Nr.OffChainOnly, Nu[2] + "", Nr.Any, Nr.OnChainOnly + "", Nr.OnChainOnly, Nr.OffChainOnly + "", Nr.OffChainOnly, Nr.Any + "", Nr.Any;
var Fd;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Fd || (Fd = {}));
Fd.Mainnet;
var S0;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(S0 || (S0 = {}));
var Mo;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Mo || (Mo = {}));
var v0;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(v0 || (v0 = {}));
var A0;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(A0 || (A0 = {}));
var E0;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(E0 || (E0 = {}));
var k0;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(k0 || (k0 = {}));
var $0;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})($0 || ($0 = {}));
var I0;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(I0 || (I0 = {}));
var jd;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(jd || (jd = {}));
var L0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(L0 || (L0 = {}));
var C0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(C0 || (C0 = {}));
function Rd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function o3(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function lm(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function i3(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Rd(e.outputLen), Rd(e.blockLen);
}
function a3(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function c3(e, t) {
  lm(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Mu = {
  number: Rd,
  bool: o3,
  bytes: lm,
  hash: i3,
  exists: a3,
  output: c3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _u = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Jr = (e, t) => e << 32 - t | e >>> t, l3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!l3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function u3(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function um(e) {
  if (typeof e == "string" && (e = u3(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let d3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function pi(e) {
  const t = (r) => e().update(um(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function f3(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let th = class extends d3 {
  constructor(t, n, r, o) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = _u(this.buffer);
  }
  update(t) {
    Mu.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    t = um(t);
    const s = t.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(o - this.pos, s - i);
      if (a === o) {
        const c = _u(t);
        for (; o <= s - i; i += o)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Mu.exists(this), Mu.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let d = i; d < o; d++)
      n[d] = 0;
    f3(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = _u(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: a } = this;
    return t.length = o, t.pos = a, t.finished = s, t.destroyed = i, o % n && t.buffer.set(r), t;
  }
};
const h3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), dm = Uint8Array.from({ length: 16 }, (e, t) => t), p3 = dm.map((e) => (9 * e + 5) % 16);
let nh = [dm], rh = [p3];
for (let e = 0; e < 4; e++)
  for (let t of [nh, rh])
    t.push(t[e].map((n) => h3[n]));
const fm = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), g3 = nh.map((e, t) => e.map((n) => fm[t][n])), y3 = rh.map((e, t) => e.map((n) => fm[t][n])), w3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), m3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Cc = (e, t) => e << t | e >>> 32 - t;
function T0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Tc = new Uint32Array(16);
let b3 = class extends th {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: o, h4: s } = this;
    return [t, n, r, o, s];
  }
  set(t, n, r, o, s) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = o | 0, this.h4 = s | 0;
  }
  process(t, n) {
    for (let w = 0; w < 16; w++, n += 4)
      Tc[w] = t.getUint32(n, !0);
    let r = this.h0 | 0, o = r, s = this.h1 | 0, i = s, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, m = d;
    for (let w = 0; w < 5; w++) {
      const v = 4 - w, x = w3[w], L = m3[w], N = nh[w], U = rh[w], A = g3[w], T = y3[w];
      for (let B = 0; B < 16; B++) {
        const X = Cc(r + T0(w, s, a, u) + Tc[N[B]] + x, A[B]) + d | 0;
        r = d, d = u, u = Cc(a, 10) | 0, a = s, s = X;
      }
      for (let B = 0; B < 16; B++) {
        const X = Cc(o + T0(v, i, c, h) + Tc[U[B]] + L, T[B]) + m | 0;
        o = m, m = h, h = Cc(c, 10) | 0, c = i, i = X;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + m | 0, this.h3 + d + o | 0, this.h4 + r + i | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Tc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
pi(() => new b3());
const x3 = (e, t, n) => e & t ^ ~e & n, S3 = (e, t, n) => e & t ^ e & n ^ t & n, v3 = new Uint32Array([
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
]), no = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ro = new Uint32Array(64);
let hm = class extends th {
  constructor() {
    super(64, 32, 8, !1), this.A = no[0] | 0, this.B = no[1] | 0, this.C = no[2] | 0, this.D = no[3] | 0, this.E = no[4] | 0, this.F = no[5] | 0, this.G = no[6] | 0, this.H = no[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: s, F: i, G: a, H: c } = this;
    return [t, n, r, o, s, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      ro[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const m = ro[d - 15], w = ro[d - 2], v = Jr(m, 7) ^ Jr(m, 18) ^ m >>> 3, x = Jr(w, 17) ^ Jr(w, 19) ^ w >>> 10;
      ro[d] = x + ro[d - 7] + v + ro[d - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const m = Jr(a, 6) ^ Jr(a, 11) ^ Jr(a, 25), w = h + m + x3(a, c, u) + v3[d] + ro[d] | 0, x = (Jr(r, 2) ^ Jr(r, 13) ^ Jr(r, 22)) + S3(r, o, s) | 0;
      h = u, u = c, c = a, a = i + w | 0, i = s, s = o, o = r, r = w + x | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, o, s, i, a, c, u, h);
  }
  roundClean() {
    ro.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, A3 = class extends hm {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
pi(() => new hm());
pi(() => new A3());
const Bc = BigInt(2 ** 32 - 1), zd = BigInt(32);
function pm(e, t = !1) {
  return t ? { h: Number(e & Bc), l: Number(e >> zd & Bc) } : { h: Number(e >> zd & Bc) | 0, l: Number(e & Bc) | 0 };
}
function E3(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let o = 0; o < e.length; o++) {
    const { h: s, l: i } = pm(e[o], t);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const k3 = (e, t) => BigInt(e >>> 0) << zd | BigInt(t >>> 0), $3 = (e, t, n) => e >>> n, I3 = (e, t, n) => e << 32 - n | t >>> n, L3 = (e, t, n) => e >>> n | t << 32 - n, C3 = (e, t, n) => e << 32 - n | t >>> n, T3 = (e, t, n) => e << 64 - n | t >>> n - 32, B3 = (e, t, n) => e >>> n - 32 | t << 64 - n, N3 = (e, t) => t, M3 = (e, t) => e, _3 = (e, t, n) => e << n | t >>> 32 - n, P3 = (e, t, n) => t << n | e >>> 32 - n, U3 = (e, t, n) => t << n - 32 | e >>> 64 - n, O3 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function H3(e, t, n, r) {
  const o = (t >>> 0) + (r >>> 0);
  return { h: e + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const D3 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), F3 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, j3 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), R3 = (e, t, n, r, o) => t + n + r + o + (e / 2 ** 32 | 0) | 0, z3 = (e, t, n, r, o) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), G3 = (e, t, n, r, o, s) => t + n + r + o + s + (e / 2 ** 32 | 0) | 0, tt = {
  fromBig: pm,
  split: E3,
  toBig: k3,
  shrSH: $3,
  shrSL: I3,
  rotrSH: L3,
  rotrSL: C3,
  rotrBH: T3,
  rotrBL: B3,
  rotr32H: N3,
  rotr32L: M3,
  rotlSH: _3,
  rotlSL: P3,
  rotlBH: U3,
  rotlBL: O3,
  add: H3,
  add3L: D3,
  add3H: F3,
  add4L: j3,
  add4H: R3,
  add5H: G3,
  add5L: z3
}, [K3, V3] = tt.split([
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
].map((e) => BigInt(e))), so = new Uint32Array(80), oo = new Uint32Array(80);
let Ql = class extends th {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: m, Gh: w, Gl: v, Hh: x, Hl: L } = this;
    return [t, n, r, o, s, i, a, c, u, h, d, m, w, v, x, L];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c, u, h, d, m, w, v, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = m | 0, this.Gh = w | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      so[A] = t.getUint32(n), oo[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = so[A - 15] | 0, B = oo[A - 15] | 0, X = tt.rotrSH(T, B, 1) ^ tt.rotrSH(T, B, 8) ^ tt.shrSH(T, B, 7), Q = tt.rotrSL(T, B, 1) ^ tt.rotrSL(T, B, 8) ^ tt.shrSL(T, B, 7), oe = so[A - 2] | 0, Y = oo[A - 2] | 0, b = tt.rotrSH(oe, Y, 19) ^ tt.rotrBH(oe, Y, 61) ^ tt.shrSH(oe, Y, 6), I = tt.rotrSL(oe, Y, 19) ^ tt.rotrBL(oe, Y, 61) ^ tt.shrSL(oe, Y, 6), M = tt.add4L(Q, I, oo[A - 7], oo[A - 16]), P = tt.add4H(M, X, b, so[A - 7], so[A - 16]);
      so[A] = P | 0, oo[A] = M | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: m, Fh: w, Fl: v, Gh: x, Gl: L, Hh: N, Hl: U } = this;
    for (let A = 0; A < 80; A++) {
      const T = tt.rotrSH(d, m, 14) ^ tt.rotrSH(d, m, 18) ^ tt.rotrBH(d, m, 41), B = tt.rotrSL(d, m, 14) ^ tt.rotrSL(d, m, 18) ^ tt.rotrBL(d, m, 41), X = d & w ^ ~d & x, Q = m & v ^ ~m & L, oe = tt.add5L(U, B, Q, V3[A], oo[A]), Y = tt.add5H(oe, N, T, X, K3[A], so[A]), b = oe | 0, I = tt.rotrSH(r, o, 28) ^ tt.rotrBH(r, o, 34) ^ tt.rotrBH(r, o, 39), M = tt.rotrSL(r, o, 28) ^ tt.rotrBL(r, o, 34) ^ tt.rotrBL(r, o, 39), P = r & s ^ r & a ^ s & a, W = o & i ^ o & c ^ i & c;
      N = x | 0, U = L | 0, x = w | 0, L = v | 0, w = d | 0, v = m | 0, { h: d, l: m } = tt.add(u | 0, h | 0, Y | 0, b | 0), u = a | 0, h = c | 0, a = s | 0, c = i | 0, s = r | 0, i = o | 0;
      const R = tt.add3L(b, M, W);
      r = tt.add3H(R, Y, I, P), o = R | 0;
    }
    ({ h: r, l: o } = tt.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = tt.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: a, l: c } = tt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = tt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: m } = tt.add(this.Eh | 0, this.El | 0, d | 0, m | 0), { h: w, l: v } = tt.add(this.Fh | 0, this.Fl | 0, w | 0, v | 0), { h: x, l: L } = tt.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: N, l: U } = tt.add(this.Hh | 0, this.Hl | 0, N | 0, U | 0), this.set(r, o, s, i, a, c, u, h, d, m, w, v, x, L, N, U);
  }
  roundClean() {
    so.fill(0), oo.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, X3 = class extends Ql {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Y3 = class extends Ql {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, q3 = class extends Ql {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
pi(() => new Ql());
pi(() => new X3());
pi(() => new Y3());
pi(() => new q3());
function W3(e, t, n) {
  const o = r3;
  if (f4(e, o))
    throw new Error(`String length exceeds maximum bytes ${o}`);
  return {
    type: Dd.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: 1,
    maxLengthBytes: o
  };
}
var Sn;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(Sn || (Sn = {}));
let Z3 = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, gm = class extends Z3 {
  constructor(t) {
    super(t);
  }
};
function eu(e) {
  const t = [];
  return t.push(Ra(Zf(e.version, 1))), t.push(Ra(e.hash160)), Bs(t);
}
function J3(e) {
  const t = [];
  return t.push(e.prefix), t.push(eu(e.address)), e.prefix === jd.Contract && t.push(za(e.contractName)), Bs(t);
}
function za(e) {
  const t = [], n = Qf(e.content), r = n.byteLength;
  return t.push(Ra(Zf(r, e.lengthPrefixBytes))), t.push(n), Bs(t);
}
function Q3(e) {
  const t = [];
  return t.push(eu(e.address)), t.push(za(e.contractName)), t.push(za(e.assetName)), Bs(t);
}
function ym(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(J3(e.principal)), (e.conditionType === Mo.Fungible || e.conditionType === Mo.NonFungible) && t.push(Q3(e.assetInfo)), e.conditionType === Mo.NonFungible && t.push(ri(e.assetName)), t.push(e.conditionCode), e.conditionType === Mo.STX || e.conditionType === Mo.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new gm("The post-condition amount may not be larger than 8 bytes");
    t.push(Zk(e.amount, !1, 8));
  }
  return Bs(t);
}
function ls(e, t) {
  return Bs([e, t]);
}
function e4(e) {
  return new Uint8Array([e.type]);
}
function t4(e) {
  return e.type === Sn.OptionalNone ? new Uint8Array([e.type]) : ls(e.type, ri(e.value));
}
function n4(e) {
  const t = new Uint8Array(4);
  return Jl(t, e.buffer.length, 0), ls(e.type, eh(t, e.buffer));
}
function r4(e) {
  const t = Jf(Jk(e.value, BigInt(s3)), cm);
  return ls(e.type, t);
}
function s4(e) {
  const t = Jf(e.value, cm);
  return ls(e.type, t);
}
function o4(e) {
  return ls(e.type, eu(e.address));
}
function i4(e) {
  return ls(e.type, eh(eu(e.address), za(e.contractName)));
}
function a4(e) {
  return ls(e.type, ri(e.value));
}
function c4(e) {
  const t = [], n = new Uint8Array(4);
  Jl(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const o = ri(r);
    t.push(o);
  }
  return ls(e.type, Bs(t));
}
function l4(e) {
  const t = [], n = new Uint8Array(4);
  Jl(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((o, s) => o.localeCompare(s));
  for (const o of r) {
    const s = W3(o);
    t.push(za(s));
    const i = ri(e.data[o]);
    t.push(i);
  }
  return ls(e.type, Bs(t));
}
function wm(e, t) {
  const n = [], r = t == "ascii" ? t3(e.data) : Qf(e.data), o = new Uint8Array(4);
  return Jl(o, r.length, 0), n.push(o), n.push(r), ls(e.type, Bs(n));
}
function u4(e) {
  return wm(e, "ascii");
}
function d4(e) {
  return wm(e, "utf8");
}
function ri(e) {
  switch (e.type) {
    case Sn.BoolTrue:
    case Sn.BoolFalse:
      return e4(e);
    case Sn.OptionalNone:
    case Sn.OptionalSome:
      return t4(e);
    case Sn.Buffer:
      return n4(e);
    case Sn.UInt:
      return s4(e);
    case Sn.Int:
      return r4(e);
    case Sn.PrincipalStandard:
      return o4(e);
    case Sn.PrincipalContract:
      return i4(e);
    case Sn.ResponseOk:
    case Sn.ResponseErr:
      return a4(e);
    case Sn.List:
      return c4(e);
    case Sn.Tuple:
      return l4(e);
    case Sn.StringASCII:
      return u4(e);
    case Sn.StringUTF8:
      return d4(e);
    default:
      throw new gm("Unable to serialize. Invalid Clarity Value.");
  }
}
const f4 = (e, t) => e ? Qf(e).length > t : !1, h4 = "connect-ui";
let Zc, mm, ur = !1, Gd = !1;
const Ts = (e, t = "") => () => {
}, p4 = (e, t) => () => {
}, g4 = "{visibility:hidden}.hydrated{visibility:inherit}", B0 = {}, y4 = "http://www.w3.org/2000/svg", w4 = "http://www.w3.org/1999/xhtml", m4 = (e) => e != null, sh = (e) => (e = typeof e, e === "object" || e === "function");
function bm(e) {
  var t, n, r;
  return (r = (n = (t = e.head) === null || t === void 0 ? void 0 : t.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const We = (e, t, ...n) => {
  let r = null, o = !1, s = !1;
  const i = [], a = (u) => {
    for (let h = 0; h < u.length; h++)
      r = u[h], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((o = typeof e != "function" && !sh(r)) && (r = String(r)), o && s ? i[i.length - 1].$text$ += r : i.push(o ? Kd(null, r) : r), s = o);
  };
  if (a(n), t) {
    const u = t.className || t.class;
    u && (t.class = typeof u != "object" ? u : Object.keys(u).filter((h) => u[h]).join(" "));
  }
  const c = Kd(e, null);
  return c.$attrs$ = t, i.length > 0 && (c.$children$ = i), c;
}, Kd = (e, t) => {
  const n = {
    $flags$: 0,
    $tag$: e,
    $text$: t,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, b4 = {}, x4 = (e) => e && e.$tag$ === b4, S4 = (e, t) => e != null && !sh(e) && t & 4 ? e === "false" ? !1 : e === "" || !!e : e, v4 = (e) => fa(e).$hostElement$, A4 = (e, t, n) => {
  const r = Un.ce(t, n);
  return e.dispatchEvent(r), r;
}, N0 = /* @__PURE__ */ new WeakMap(), E4 = (e, t, n) => {
  let r = bl.get(e);
  G4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = t : r.replaceSync(t)) : r = t, bl.set(e, r);
}, k4 = (e, t, n, r) => {
  var o;
  let s = xm(t);
  const i = bl.get(s);
  if (e = e.nodeType === 11 ? e : os, i)
    if (typeof i == "string") {
      e = e.head || e;
      let a = N0.get(e), c;
      if (a || N0.set(e, a = /* @__PURE__ */ new Set()), !a.has(s)) {
        {
          c = os.createElement("style"), c.innerHTML = i;
          const u = (o = Un.$nonce$) !== null && o !== void 0 ? o : bm(os);
          u != null && c.setAttribute("nonce", u), e.insertBefore(c, e.querySelector("link"));
        }
        a && a.add(s);
      }
    } else e.adoptedStyleSheets.includes(i) || (e.adoptedStyleSheets = [...e.adoptedStyleSheets, i]);
  return s;
}, $4 = (e) => {
  const t = e.$cmpMeta$, n = e.$hostElement$, r = t.$flags$, o = Ts("attachStyles", t.$tagName$), s = k4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), t);
  r & 10 && (n["s-sc"] = s, n.classList.add(s + "-h")), o();
}, xm = (e, t) => "sc-" + e.$tagName$, M0 = (e, t, n, r, o, s) => {
  if (n !== r) {
    let i = P0(e, t), a = t.toLowerCase();
    if (t === "class") {
      const c = e.classList, u = _0(n), h = _0(r);
      c.remove(...u.filter((d) => d && !h.includes(d))), c.add(...h.filter((d) => d && !u.includes(d)));
    } else if (!i && t[0] === "o" && t[1] === "n")
      t[2] === "-" ? t = t.slice(3) : P0(tu, a) ? t = a.slice(2) : t = a[2] + t.slice(3), n && Un.rel(e, t, n, !1), r && Un.ael(e, t, r, !1);
    else {
      const c = sh(r);
      if ((i || c && r !== null) && !o)
        try {
          if (e.tagName.includes("-"))
            e[t] = r;
          else {
            const u = r ?? "";
            t === "list" ? i = !1 : (n == null || e[t] != u) && (e[t] = u);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || e.getAttribute(t) === "") && e.removeAttribute(t) : (!i || s & 4 || o) && !c && (r = r === !0 ? "" : r, e.setAttribute(t, r));
    }
  }
}, I4 = /\s/, _0 = (e) => e ? e.split(I4) : [], Sm = (e, t, n, r) => {
  const o = t.$elm$.nodeType === 11 && t.$elm$.host ? t.$elm$.host : t.$elm$, s = e && e.$attrs$ || B0, i = t.$attrs$ || B0;
  for (r in s)
    r in i || M0(o, r, s[r], void 0, n, t.$flags$);
  for (r in i)
    M0(o, r, s[r], i[r], n, t.$flags$);
}, oh = (e, t, n, r) => {
  const o = t.$children$[n];
  let s = 0, i, a;
  if (o.$text$ !== null)
    i = o.$elm$ = os.createTextNode(o.$text$);
  else {
    if (ur || (ur = o.$tag$ === "svg"), i = o.$elm$ = os.createElementNS(ur ? y4 : w4, o.$tag$), ur && o.$tag$ === "foreignObject" && (ur = !1), Sm(null, o, ur), m4(Zc) && i["s-si"] !== Zc && i.classList.add(i["s-si"] = Zc), o.$children$)
      for (s = 0; s < o.$children$.length; ++s)
        a = oh(e, o, s), a && i.appendChild(a);
    o.$tag$ === "svg" ? ur = !1 : i.tagName === "foreignObject" && (ur = !0);
  }
  return i;
}, vm = (e, t, n, r, o, s) => {
  let i = e, a;
  for (i.shadowRoot && i.tagName === mm && (i = i.shadowRoot); o <= s; ++o)
    r[o] && (a = oh(null, n, o), a && (r[o].$elm$ = a, i.insertBefore(a, t)));
}, Am = (e, t, n, r, o) => {
  for (; t <= n; ++t)
    (r = e[t]) && (o = r.$elm$, o.remove());
}, L4 = (e, t, n, r) => {
  let o = 0, s = 0, i = t.length - 1, a = t[0], c = t[i], u = r.length - 1, h = r[0], d = r[u], m;
  for (; o <= i && s <= u; )
    a == null ? a = t[++o] : c == null ? c = t[--i] : h == null ? h = r[++s] : d == null ? d = r[--u] : Nc(a, h) ? (La(a, h), a = t[++o], h = r[++s]) : Nc(c, d) ? (La(c, d), c = t[--i], d = r[--u]) : Nc(a, d) ? (La(a, d), e.insertBefore(a.$elm$, c.$elm$.nextSibling), a = t[++o], d = r[--u]) : Nc(c, h) ? (La(c, h), e.insertBefore(c.$elm$, a.$elm$), c = t[--i], h = r[++s]) : (m = oh(t && t[s], n, s), h = r[++s], m && a.$elm$.parentNode.insertBefore(m, a.$elm$));
  o > i ? vm(e, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, s, u) : s > u && Am(t, o, i);
}, Nc = (e, t) => e.$tag$ === t.$tag$, La = (e, t) => {
  const n = t.$elm$ = e.$elm$, r = e.$children$, o = t.$children$, s = t.$tag$, i = t.$text$;
  i === null ? (ur = s === "svg" ? !0 : s === "foreignObject" ? !1 : ur, Sm(e, t, ur), r !== null && o !== null ? L4(n, r, t, o) : o !== null ? (e.$text$ !== null && (n.textContent = ""), vm(n, null, t, o, 0, o.length - 1)) : r !== null && Am(r, 0, r.length - 1), ur && s === "svg" && (ur = !1)) : e.$text$ !== i && (n.data = i);
}, C4 = (e, t) => {
  const n = e.$hostElement$, r = e.$vnode$ || Kd(null, null), o = x4(t) ? t : We(null, null, t);
  mm = n.tagName, o.$tag$ = null, o.$flags$ |= 4, e.$vnode$ = o, o.$elm$ = r.$elm$ = n.shadowRoot || n, Zc = n["s-sc"], La(r, o);
}, Em = (e, t) => {
  t && !e.$onRenderResolve$ && t["s-p"] && t["s-p"].push(new Promise((n) => e.$onRenderResolve$ = n));
}, ih = (e, t) => {
  if (e.$flags$ |= 16, e.$flags$ & 4) {
    e.$flags$ |= 512;
    return;
  }
  return Em(e, e.$ancestorComponent$), V4(() => T4(e, t));
}, T4 = (e, t) => {
  const n = Ts("scheduleUpdate", e.$cmpMeta$.$tagName$), r = e.$lazyInstance$;
  let o;
  return n(), _4(o, () => B4(e, r, t));
}, B4 = async (e, t, n) => {
  const r = e.$hostElement$, o = Ts("update", e.$cmpMeta$.$tagName$), s = r["s-rc"];
  n && $4(e);
  const i = Ts("render", e.$cmpMeta$.$tagName$);
  N4(e, t), s && (s.map((a) => a()), r["s-rc"] = void 0), i(), o();
  {
    const a = r["s-p"], c = () => M4(e);
    a.length === 0 ? c() : (Promise.all(a).then(c), e.$flags$ |= 4, a.length = 0);
  }
}, N4 = (e, t, n) => {
  try {
    t = t.render(), e.$flags$ &= -17, e.$flags$ |= 2, C4(e, t);
  } catch (r) {
    Ga(r, e.$hostElement$);
  }
  return null;
}, M4 = (e) => {
  const t = e.$cmpMeta$.$tagName$, n = e.$hostElement$, r = Ts("postUpdate", t), o = e.$ancestorComponent$;
  e.$flags$ & 64 ? r() : (e.$flags$ |= 64, $m(n), r(), e.$onReadyResolve$(n), o || km()), e.$onRenderResolve$ && (e.$onRenderResolve$(), e.$onRenderResolve$ = void 0), e.$flags$ & 512 && ch(() => ih(e, !1)), e.$flags$ &= -517;
}, km = (e) => {
  $m(os.documentElement), ch(() => A4(tu, "appload", { detail: { namespace: h4 } }));
}, _4 = (e, t) => e && e.then ? e.then(t) : t(), $m = (e) => e.classList.add("hydrated"), P4 = (e, t) => fa(e).$instanceValues$.get(t), U4 = (e, t, n, r) => {
  const o = fa(e), s = o.$instanceValues$.get(t), i = o.$flags$, a = o.$lazyInstance$;
  n = S4(n, r.$members$[t][0]);
  const c = Number.isNaN(s) && Number.isNaN(n), u = n !== s && !c;
  (!(i & 8) || s === void 0) && u && (o.$instanceValues$.set(t, n), a && (i & 18) === 2 && ih(o, !1));
}, Im = (e, t, n) => {
  if (t.$members$) {
    const r = Object.entries(t.$members$), o = e.prototype;
    if (r.map(([s, [i]]) => {
      (i & 31 || n & 2 && i & 32) && Object.defineProperty(o, s, {
        get() {
          return P4(this, s);
        },
        set(a) {
          U4(this, s, a, t);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const s = /* @__PURE__ */ new Map();
      o.attributeChangedCallback = function(i, a, c) {
        Un.jmp(() => {
          const u = s.get(i);
          if (this.hasOwnProperty(u))
            c = this[u], delete this[u];
          else if (o.hasOwnProperty(u) && typeof this[u] == "number" && this[u] == c)
            return;
          this[u] = c === null && typeof this[u] == "boolean" ? !1 : c;
        });
      }, e.observedAttributes = r.filter(
        ([i, a]) => a[0] & 15
        /* MEMBER_FLAGS.HasAttribute */
      ).map(([i, a]) => {
        const c = a[1] || i;
        return s.set(c, i), c;
      });
    }
  }
  return e;
}, O4 = async (e, t, n, r, o) => {
  if (!(t.$flags$ & 32)) {
    {
      if (t.$flags$ |= 32, o = z4(n), o.then) {
        const c = p4();
        o = await o, c();
      }
      o.isProxied || (Im(
        o,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), o.isProxied = !0);
      const a = Ts("createInstance", n.$tagName$);
      t.$flags$ |= 8;
      try {
        new o(t);
      } catch (c) {
        Ga(c);
      }
      t.$flags$ &= -9, a();
    }
    if (o.style) {
      let a = o.style;
      const c = xm(n);
      if (!bl.has(c)) {
        const u = Ts("registerStyles", n.$tagName$);
        E4(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const s = t.$ancestorComponent$, i = () => ih(t, !0);
  s && s["s-rc"] ? s["s-rc"].push(i) : i();
}, H4 = (e) => {
  if (!(Un.$flags$ & 1)) {
    const t = fa(e), n = t.$cmpMeta$, r = Ts("connectedCallback", n.$tagName$);
    if (!(t.$flags$ & 1)) {
      t.$flags$ |= 1;
      {
        let o = e;
        for (; o = o.parentNode || o.host; )
          if (o["s-p"]) {
            Em(t, t.$ancestorComponent$ = o);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([o, [s]]) => {
        if (s & 31 && e.hasOwnProperty(o)) {
          const i = e[o];
          delete e[o], e[o] = i;
        }
      }), O4(e, t, n);
    }
    r();
  }
}, D4 = (e) => {
  Un.$flags$ & 1 || fa(e);
}, F4 = (e, t = {}) => {
  var n;
  const r = Ts(), o = [], s = t.exclude || [], i = tu.customElements, a = os.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ os.createElement("style"), h = [];
  let d, m = !0;
  Object.assign(Un, t), Un.$resourcesUrl$ = new URL(t.resourcesUrl || "./", os.baseURI).href, e.map((w) => {
    w[1].map((v) => {
      const x = {
        $flags$: v[0],
        $tagName$: v[1],
        $members$: v[2],
        $listeners$: v[3]
      };
      x.$members$ = v[2];
      const L = x.$tagName$, N = class extends HTMLElement {
        // StencilLazyHost
        constructor(U) {
          super(U), U = this, R4(U, x), x.$flags$ & 1 && U.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          d && (clearTimeout(d), d = null), m ? h.push(this) : Un.jmp(() => H4(this));
        }
        disconnectedCallback() {
          Un.jmp(() => D4(this));
        }
        componentOnReady() {
          return fa(this).$onReadyPromise$;
        }
      };
      x.$lazyBundleId$ = w[0], !s.includes(L) && !i.get(L) && (o.push(L), i.define(L, Im(
        N,
        x,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = o + g4, u.setAttribute("data-styles", "");
    const w = (n = Un.$nonce$) !== null && n !== void 0 ? n : bm(os);
    w != null && u.setAttribute("nonce", w), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  m = !1, h.length ? h.map((w) => w.connectedCallback()) : Un.jmp(() => d = setTimeout(km, 30)), r();
}, ah = /* @__PURE__ */ new WeakMap(), fa = (e) => ah.get(e), j4 = (e, t) => ah.set(t.$lazyInstance$ = e, t), R4 = (e, t) => {
  const n = {
    $flags$: 0,
    $hostElement$: e,
    $cmpMeta$: t,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), e["s-p"] = [], e["s-rc"] = [], ah.set(e, n);
}, P0 = (e, t) => t in e, Ga = (e, t) => (0, console.error)(e, t), Pu = /* @__PURE__ */ new Map(), z4 = (e, t, n) => {
  const r = e.$tagName$.replace(/-/g, "_"), o = e.$lazyBundleId$, s = Pu.get(o);
  if (s)
    return s[r];
  {
    const i = (a) => (Pu.set(o, a), a[r]);
    switch (o) {
      case "connect-modal":
        return Promise.resolve().then(() => HC).then(i, Ga);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${o}.entry.js`
  ).then((i) => (Pu.set(o, i), i[r]), Ga);
}, bl = /* @__PURE__ */ new Map(), tu = typeof window < "u" ? window : {}, os = tu.document || { head: {} }, Un = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (e) => e(),
  raf: (e) => requestAnimationFrame(e),
  ael: (e, t, n, r) => e.addEventListener(t, n, r),
  rel: (e, t, n, r) => e.removeEventListener(t, n, r),
  ce: (e, t) => new CustomEvent(e, t)
}, Lm = (e) => Promise.resolve(e), G4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), U0 = [], Cm = [], K4 = (e, t) => (n) => {
  e.push(n), Gd || (Gd = !0, Un.$flags$ & 4 ? ch(Vd) : Un.raf(Vd));
}, O0 = (e) => {
  for (let t = 0; t < e.length; t++)
    try {
      e[t](performance.now());
    } catch (n) {
      Ga(n);
    }
  e.length = 0;
}, Vd = () => {
  O0(U0), O0(Cm), (Gd = U0.length > 0) && Un.raf(Vd);
}, ch = (e) => Lm().then(e), V4 = /* @__PURE__ */ K4(Cm), X4 = () => Lm(), Y4 = (e, t) => typeof window > "u" ? Promise.resolve() : X4().then(() => F4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], t));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var e = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(e, [], this.constructor);
    }, HTMLElement.prototype = e.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, e);
  }
})();
var q4 = Object.defineProperty, W4 = Object.defineProperties, Z4 = Object.getOwnPropertyDescriptors, xl = Object.getOwnPropertySymbols, Tm = Object.prototype.hasOwnProperty, Bm = Object.prototype.propertyIsEnumerable, H0 = (e, t, n) => t in e ? q4(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, yr = (e, t) => {
  for (var n in t || (t = {})) Tm.call(t, n) && H0(e, n, t[n]);
  if (xl) for (var n of xl(t)) Bm.call(t, n) && H0(e, n, t[n]);
  return e;
}, jr = (e, t) => W4(e, Z4(t)), Nm = (e, t) => {
  var n = {};
  for (var r in e) Tm.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && xl) for (var r of xl(e)) t.indexOf(r) < 0 && Bm.call(e, r) && (n[r] = e[r]);
  return n;
};
function Mm() {
  return Yl(Zo()) || window.StacksProvider || window.BlockstackProvider;
}
function nu(e) {
  return e ? typeof e == "string" ? Qo.fromName(e) : "version" in e ? e : "url" in e ? new xd({ url: e.url }) : e.transactionVersion === ti.Mainnet ? new xd({ url: e.client.baseUrl }) : new Sd({ url: e.client.baseUrl }) : new Sd();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var J4 = ((e) => (e.ContractCall = "contract_call", e.ContractDeploy = "smart_contract", e.STXTransfer = "token_transfer", e))(J4 || {}), Q4 = ((e) => (e.BUFFER = "buffer", e.UINT = "uint", e.INT = "int", e.PRINCIPAL = "principal", e.BOOL = "bool", e))(Q4 || {}), lh = (e) => {
  let t = e;
  if (!t) {
    let n = new fy(["store_write"], document.location.href);
    t = new bd({ appConfig: n });
  }
  return t;
};
function _m(e) {
  try {
    return lh(e).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Pm = (e) => {
  let t = lh(e).loadUserData().appPrivateKey, n = Bn.SECP256K1Client.derivePublicKey(t);
  return { privateKey: t, publicKey: n };
};
function e$(e) {
  var t;
  let { stxAddress: n, userSession: r, network: o } = e;
  if (n) return n;
  if (!r || !o) return;
  let s = (t = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : t.stxAddress, i = { [ei.Mainnet]: "mainnet", [ei.Testnet]: "testnet" }, a = nu(o);
  return s == null ? void 0 : s[i[a.chainId]];
}
function t$(e) {
  let t = nu(e.network), n = lh(e.userSession), r = jr(yr({}, e), { network: t, userSession: n });
  return yr({ stxAddress: e$(r) }, r);
}
async function n$(e, t) {
  let { postConditions: n } = e;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(im) : n = n.map((r) => Ue(ym(r)))), new Bn.TokenSigner("ES256k", t).signAsync(jr(yr({}, e), { postConditions: n }));
}
function r$(e) {
  let { postConditions: t } = e;
  return t && t.length > 0 && typeof t[0] != "string" && (typeof t[0].type == "string" ? t = t.map(im) : t = t.map((n) => Ue(ym(n)))), Bn.createUnsecuredToken(jr(yr({}, e), { postConditions: t }));
}
var s$ = async ({ token: e, options: t }, n) => {
  var r, o, s;
  try {
    let i = await n.transactionRequest(e), { txRaw: a } = i, c = mt(a.replace(/^0x/, "")), u = Yk(c);
    if ("sponsored" in t && t.sponsored) {
      (r = t.onFinish) == null || r.call(t, jr(yr({}, i), { stacksTransaction: u }));
      return;
    }
    (o = t.onFinish) == null || o.call(t, jr(yr({}, i), { stacksTransaction: u }));
  } catch (i) {
    console.error("[Connect] Error during transaction request", i), (s = t.onCancel) == null || s.call(t);
  }
}, o$ = async (e) => {
  let t = e, { amount: n, appDetails: r, userSession: o } = t, s = Nm(t, ["amount", "appDetails", "userSession"]);
  if (_m(o)) {
    let { privateKey: a, publicKey: c } = Pm(o), u = jr(yr({}, s), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), n$(u, a);
  }
  let i = jr(yr({}, s), { amount: n.toString(10), txType: "token_transfer" });
  return r && (i.appDetails = r), r$(i);
};
async function i$(e, t, n) {
  let r = await t(jr(yr(yr({}, t$(e)), e), { network: nu(e.network) }));
  return s$({ token: r, options: e }, n);
}
function a$(e, t = Mm()) {
  if (!t) throw new Error("[Connect] No installed Stacks wallet found");
  return i$(e, o$, t);
}
function Um(e) {
  let { message: t, domain: n } = e;
  return typeof t.type == "string" && typeof n.type == "string" ? jr(yr({}, e), { message: f0(t), domain: f0(n) }) : jr(yr({}, e), { message: Ue(ri(t)), domain: Ue(ri(n)) });
}
async function c$(e, t) {
  return new Bn.TokenSigner("ES256k", t).signAsync(Um(e));
}
async function l$(e) {
  let t = e, { userSession: n } = t, r = Nm(t, ["userSession"]);
  if (_m(n)) {
    let { privateKey: o, publicKey: s } = Pm(n), i = jr(yr({}, r), { publicKey: s });
    return c$(i, o);
  }
  return Bn.createUnsecuredToken(Um(e));
}
var u$ = ((e) => (e[e.DEFAULT = 0] = "DEFAULT", e[e.ALL = 1] = "ALL", e[e.NONE = 2] = "NONE", e[e.SINGLE = 3] = "SINGLE", e[e.ANYONECANPAY = 128] = "ANYONECANPAY", e))(u$ || {}), Om = "asigna-stx", D0 = (e, t) => new Promise((n) => {
  function r(o) {
    o.data.source === Om && o.data[t] && (n(o.data[t]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(f$(e, t), "*");
}), d$ = { authenticationRequest: async (e) => D0(e, "authenticationRequest"), transactionRequest: async (e) => D0(e, "transactionRequest") }, f$ = (e, t) => ({ source: Om, [t]: e }), h$ = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = d$);
};
h$();
var p$ = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function g$(e, t = !0) {
  return function(n, r) {
    var o;
    if (r) return e(n, r);
    let s = Zo(), i = Mm();
    if (s && i) return e(n, i);
    if (typeof window > "u") return;
    Y4();
    let a = (o = n == null ? void 0 : n.defaultProviders) != null ? o : p$, c = iA(a), u = document.createElement("connect-modal");
    u.defaultProviders = a, u.installedProviders = c, u.persistSelection = t;
    let h = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let d = () => {
      u.remove(), document.body.style.overflow = h;
    };
    u.callback = (w) => {
      d(), e(n, w);
    }, u.cancelCallback = () => {
      var w;
      d(), (w = n.onCancel) == null || w.call(n);
    }, document.body.appendChild(u);
    let m = (w) => {
      w.key === "Escape" && (document.removeEventListener("keydown", m), u.remove());
    };
    document.addEventListener("keydown", m);
  };
}
var Mc = g$(a$);
function So(e, t, n) {
  return uh(Kn(e, t), n);
}
function Kn(e, t) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Kt(r);
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
      const r = m$(BigInt(`0x${ct(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${ct(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function F0(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function sc(e, t = 8) {
  return (typeof e == "bigint" ? e : Kn(e, !1)).toString(16).padStart(t * 2, "0");
}
function ru(e) {
  return parseInt(e, 16);
}
function uh(e, t = 16) {
  const n = sc(e, t);
  return Kt(n);
}
function y$(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function w$(e, t) {
  return e & BigInt(1) << t;
}
function m$(e, t) {
  return w$(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const b$ = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function ct(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += b$[n];
  return t;
}
function Kt(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e;
  const t = e.length % 2 ? `0${e}` : e, n = new Uint8Array(t.length / 2);
  for (let r = 0; r < n.length; r++) {
    const o = r * 2, s = t.slice(o, o + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    n[r] = i;
  }
  return n;
}
function ha(e) {
  return new TextEncoder().encode(e);
}
function dh(e) {
  return new TextDecoder().decode(e);
}
function Hm(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function x$(e) {
  return String.fromCharCode.apply(null, e);
}
function S$(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function j0(e) {
  if (e.some(S$))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function su(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, o) => r + o.length, 0), n = new Uint8Array(t);
  for (let r = 0, o = 0; r < e.length; r++) {
    const s = e[r];
    n.set(s, o), o += s.length;
  }
  return n;
}
function cn(e) {
  return su(...e.map((t) => typeof t == "number" ? j0([t]) : t instanceof Array ? j0(t) : t));
}
var R0;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(R0 || (R0 = {}));
var z0;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(z0 || (z0 = {}));
var G0;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(G0 || (G0 = {}));
const Dm = 33, Uu = 32;
function v$(e) {
  if (e.length < Uu * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + Uu * 2), r = e.slice(2 + Uu * 2);
  return {
    recoveryId: ru(t),
    r: n,
    s: r
  };
}
function A$(e) {
  const t = typeof e == "string" ? Kt(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function E$(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function k$(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function $$(e, t) {
  return e[t];
}
function I$(e, t, n = 0) {
  return e[n] = t, e;
}
function L$(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function si(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var Xd;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Xd || (Xd = {}));
const C$ = Xd.Mainnet, T$ = 128, B$ = 128, Fm = 16, zo = 32, Yd = 80, ou = 65, N$ = 32, M$ = 64, Sl = 34;
var Le;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Le || (Le = {}));
var it;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(it || (it = {}));
var qd;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(qd || (qd = {}));
var Zn;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Zn || (Zn = {}));
const Jc = ["onChainOnly", "offChainOnly", "any"], K0 = {
  [Jc[0]]: Zn.OnChainOnly,
  [Jc[1]]: Zn.OffChainOnly,
  [Jc[2]]: Zn.Any,
  [Zn.OnChainOnly]: Zn.OnChainOnly,
  [Zn.OffChainOnly]: Zn.OffChainOnly,
  [Zn.Any]: Zn.Any
};
function _$(e) {
  if (e in K0)
    return K0[e];
  throw new Error(`Invalid anchor mode "${e}", must be one of: ${Jc.join(", ")}`);
}
var vl;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(vl || (vl = {}));
vl.Mainnet;
var ra;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(ra || (ra = {}));
var Jn;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Jn || (Jn = {}));
var tn;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(tn || (tn = {}));
var Mt;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Mt || (Mt = {}));
var Al;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Al || (Al = {}));
var Wt;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Wt || (Wt = {}));
var Ka;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(Ka || (Ka = {}));
var Wd;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(Wd || (Wd = {}));
var Va;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Va || (Va = {}));
var V0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(V0 || (V0 = {}));
var X0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(X0 || (X0 = {}));
function Zd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function P$(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function jm(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function U$(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Zd(e.outputLen), Zd(e.blockLen);
}
function O$(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function H$(e, t) {
  jm(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Do = {
  number: Zd,
  bool: P$,
  bytes: jm,
  hash: U$,
  exists: O$,
  output: H$
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ou = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Qr = (e, t) => e << 32 - t | e >>> t, D$ = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!D$)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function F$(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function fh(e) {
  if (typeof e == "string" && (e = F$(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
class Rm {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function gi(e) {
  const t = (r) => e().update(fh(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function j$(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
class hh extends Rm {
  constructor(t, n, r, o) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Ou(this.buffer);
  }
  update(t) {
    Do.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    t = fh(t);
    const s = t.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(o - this.pos, s - i);
      if (a === o) {
        const c = Ou(t);
        for (; o <= s - i; i += o)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Do.exists(this), Do.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let d = i; d < o; d++)
      n[d] = 0;
    j$(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Ou(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: a } = this;
    return t.length = o, t.pos = a, t.finished = s, t.destroyed = i, o % n && t.buffer.set(r), t;
  }
}
const R$ = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), zm = Uint8Array.from({ length: 16 }, (e, t) => t), z$ = zm.map((e) => (9 * e + 5) % 16);
let ph = [zm], gh = [z$];
for (let e = 0; e < 4; e++)
  for (let t of [ph, gh])
    t.push(t[e].map((n) => R$[n]));
const Gm = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), G$ = ph.map((e, t) => e.map((n) => Gm[t][n])), K$ = gh.map((e, t) => e.map((n) => Gm[t][n])), V$ = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), X$ = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), _c = (e, t) => e << t | e >>> 32 - t;
function Y0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Pc = new Uint32Array(16);
class Y$ extends hh {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: o, h4: s } = this;
    return [t, n, r, o, s];
  }
  set(t, n, r, o, s) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = o | 0, this.h4 = s | 0;
  }
  process(t, n) {
    for (let w = 0; w < 16; w++, n += 4)
      Pc[w] = t.getUint32(n, !0);
    let r = this.h0 | 0, o = r, s = this.h1 | 0, i = s, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, m = d;
    for (let w = 0; w < 5; w++) {
      const v = 4 - w, x = V$[w], L = X$[w], N = ph[w], U = gh[w], A = G$[w], T = K$[w];
      for (let B = 0; B < 16; B++) {
        const X = _c(r + Y0(w, s, a, u) + Pc[N[B]] + x, A[B]) + d | 0;
        r = d, d = u, u = _c(a, 10) | 0, a = s, s = X;
      }
      for (let B = 0; B < 16; B++) {
        const X = _c(o + Y0(v, i, c, h) + Pc[U[B]] + L, T[B]) + m | 0;
        o = m, m = h, h = _c(c, 10) | 0, c = i, i = X;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + m | 0, this.h3 + d + o | 0, this.h4 + r + i | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Pc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const q$ = gi(() => new Y$()), W$ = (e, t, n) => e & t ^ ~e & n, Z$ = (e, t, n) => e & t ^ e & n ^ t & n, J$ = new Uint32Array([
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
]), io = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ao = new Uint32Array(64);
class Km extends hh {
  constructor() {
    super(64, 32, 8, !1), this.A = io[0] | 0, this.B = io[1] | 0, this.C = io[2] | 0, this.D = io[3] | 0, this.E = io[4] | 0, this.F = io[5] | 0, this.G = io[6] | 0, this.H = io[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: s, F: i, G: a, H: c } = this;
    return [t, n, r, o, s, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      ao[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const m = ao[d - 15], w = ao[d - 2], v = Qr(m, 7) ^ Qr(m, 18) ^ m >>> 3, x = Qr(w, 17) ^ Qr(w, 19) ^ w >>> 10;
      ao[d] = x + ao[d - 7] + v + ao[d - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const m = Qr(a, 6) ^ Qr(a, 11) ^ Qr(a, 25), w = h + m + W$(a, c, u) + J$[d] + ao[d] | 0, x = (Qr(r, 2) ^ Qr(r, 13) ^ Qr(r, 22)) + Z$(r, o, s) | 0;
      h = u, u = c, c = a, a = i + w | 0, i = s, s = o, o = r, r = w + x | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, o, s, i, a, c, u, h);
  }
  roundClean() {
    ao.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class Q$ extends Km {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const yh = gi(() => new Km());
gi(() => new Q$());
const Uc = BigInt(2 ** 32 - 1), Jd = BigInt(32);
function Vm(e, t = !1) {
  return t ? { h: Number(e & Uc), l: Number(e >> Jd & Uc) } : { h: Number(e >> Jd & Uc) | 0, l: Number(e & Uc) | 0 };
}
function e8(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let o = 0; o < e.length; o++) {
    const { h: s, l: i } = Vm(e[o], t);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const t8 = (e, t) => BigInt(e >>> 0) << Jd | BigInt(t >>> 0), n8 = (e, t, n) => e >>> n, r8 = (e, t, n) => e << 32 - n | t >>> n, s8 = (e, t, n) => e >>> n | t << 32 - n, o8 = (e, t, n) => e << 32 - n | t >>> n, i8 = (e, t, n) => e << 64 - n | t >>> n - 32, a8 = (e, t, n) => e >>> n - 32 | t << 64 - n, c8 = (e, t) => t, l8 = (e, t) => e, u8 = (e, t, n) => e << n | t >>> 32 - n, d8 = (e, t, n) => t << n | e >>> 32 - n, f8 = (e, t, n) => t << n - 32 | e >>> 64 - n, h8 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function p8(e, t, n, r) {
  const o = (t >>> 0) + (r >>> 0);
  return { h: e + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const g8 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), y8 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, w8 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), m8 = (e, t, n, r, o) => t + n + r + o + (e / 2 ** 32 | 0) | 0, b8 = (e, t, n, r, o) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), x8 = (e, t, n, r, o, s) => t + n + r + o + s + (e / 2 ** 32 | 0) | 0, nt = {
  fromBig: Vm,
  split: e8,
  toBig: t8,
  shrSH: n8,
  shrSL: r8,
  rotrSH: s8,
  rotrSL: o8,
  rotrBH: i8,
  rotrBL: a8,
  rotr32H: c8,
  rotr32L: l8,
  rotlSH: u8,
  rotlSL: d8,
  rotlBH: f8,
  rotlBL: h8,
  add: p8,
  add3L: g8,
  add3H: y8,
  add4L: w8,
  add4H: m8,
  add5H: x8,
  add5L: b8
}, [S8, v8] = nt.split([
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
].map((e) => BigInt(e))), co = new Uint32Array(80), lo = new Uint32Array(80);
class iu extends hh {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: m, Gh: w, Gl: v, Hh: x, Hl: L } = this;
    return [t, n, r, o, s, i, a, c, u, h, d, m, w, v, x, L];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c, u, h, d, m, w, v, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = m | 0, this.Gh = w | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      co[A] = t.getUint32(n), lo[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = co[A - 15] | 0, B = lo[A - 15] | 0, X = nt.rotrSH(T, B, 1) ^ nt.rotrSH(T, B, 8) ^ nt.shrSH(T, B, 7), Q = nt.rotrSL(T, B, 1) ^ nt.rotrSL(T, B, 8) ^ nt.shrSL(T, B, 7), oe = co[A - 2] | 0, Y = lo[A - 2] | 0, b = nt.rotrSH(oe, Y, 19) ^ nt.rotrBH(oe, Y, 61) ^ nt.shrSH(oe, Y, 6), I = nt.rotrSL(oe, Y, 19) ^ nt.rotrBL(oe, Y, 61) ^ nt.shrSL(oe, Y, 6), M = nt.add4L(Q, I, lo[A - 7], lo[A - 16]), P = nt.add4H(M, X, b, co[A - 7], co[A - 16]);
      co[A] = P | 0, lo[A] = M | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: m, Fh: w, Fl: v, Gh: x, Gl: L, Hh: N, Hl: U } = this;
    for (let A = 0; A < 80; A++) {
      const T = nt.rotrSH(d, m, 14) ^ nt.rotrSH(d, m, 18) ^ nt.rotrBH(d, m, 41), B = nt.rotrSL(d, m, 14) ^ nt.rotrSL(d, m, 18) ^ nt.rotrBL(d, m, 41), X = d & w ^ ~d & x, Q = m & v ^ ~m & L, oe = nt.add5L(U, B, Q, v8[A], lo[A]), Y = nt.add5H(oe, N, T, X, S8[A], co[A]), b = oe | 0, I = nt.rotrSH(r, o, 28) ^ nt.rotrBH(r, o, 34) ^ nt.rotrBH(r, o, 39), M = nt.rotrSL(r, o, 28) ^ nt.rotrBL(r, o, 34) ^ nt.rotrBL(r, o, 39), P = r & s ^ r & a ^ s & a, W = o & i ^ o & c ^ i & c;
      N = x | 0, U = L | 0, x = w | 0, L = v | 0, w = d | 0, v = m | 0, { h: d, l: m } = nt.add(u | 0, h | 0, Y | 0, b | 0), u = a | 0, h = c | 0, a = s | 0, c = i | 0, s = r | 0, i = o | 0;
      const R = nt.add3L(b, M, W);
      r = nt.add3H(R, Y, I, P), o = R | 0;
    }
    ({ h: r, l: o } = nt.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = nt.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: a, l: c } = nt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = nt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: m } = nt.add(this.Eh | 0, this.El | 0, d | 0, m | 0), { h: w, l: v } = nt.add(this.Fh | 0, this.Fl | 0, w | 0, v | 0), { h: x, l: L } = nt.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: N, l: U } = nt.add(this.Hh | 0, this.Hl | 0, N | 0, U | 0), this.set(r, o, s, i, a, c, u, h, d, m, w, v, x, L, N, U);
  }
  roundClean() {
    co.fill(0), lo.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class A8 extends iu {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class E8 extends iu {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class k8 extends iu {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
gi(() => new iu());
gi(() => new A8());
const $8 = gi(() => new E8());
gi(() => new k8());
function Xm(e) {
  if (Kt(e).byteLength != ou)
    throw Error("Invalid signature");
  return {
    type: Le.MessageSignature,
    data: e
  };
}
function Ca(e, t) {
  return { type: Le.Address, version: e, hash160: t };
}
function Hi(e) {
  return fi.c32address(e.version, e.hash160);
}
function oi(e, t, n) {
  const r = t || 1, o = n || T$;
  if (ub(e, o))
    throw new Error(`String length exceeds maximum bytes ${o}`);
  return {
    type: Le.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: o
  };
}
function wh(e) {
  const t = fi.c32addressDecode(e);
  return {
    type: Le.Address,
    version: t[0],
    hash160: t[1]
  };
}
var ce;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(ce || (ce = {}));
function I8(e) {
  if (e.type === ce.PrincipalStandard)
    return Hi(e.address);
  if (e.type === ce.PrincipalContract)
    return `${Hi(e.address)}.${e.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(e)}`);
}
function Ym(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return T8(t, n);
  } else
    return L8(e);
}
function L8(e) {
  const t = wh(e);
  return { type: ce.PrincipalStandard, address: t };
}
function C8(e) {
  return { type: ce.PrincipalStandard, address: e };
}
function T8(e, t) {
  const n = wh(e), r = oi(t);
  return qm(n, r);
}
function qm(e, t) {
  if (ha(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: ce.PrincipalContract, address: e, contractName: t };
}
function Hu(e, t = !1) {
  switch (e.type) {
    case ce.BoolTrue:
      return !0;
    case ce.BoolFalse:
      return !1;
    case ce.Int:
    case ce.UInt:
      return t ? e.value.toString() : e.value;
    case ce.Buffer:
      return `0x${ct(e.buffer)}`;
    case ce.OptionalNone:
      return null;
    case ce.OptionalSome:
      return Ur(e.value);
    case ce.ResponseErr:
      return Ur(e.value);
    case ce.ResponseOk:
      return Ur(e.value);
    case ce.PrincipalStandard:
    case ce.PrincipalContract:
      return I8(e);
    case ce.List:
      return e.list.map((r) => Ur(r));
    case ce.Tuple:
      const n = {};
      return Object.keys(e.data).forEach((r) => {
        n[r] = Ur(e.data[r]);
      }), n;
    case ce.StringASCII:
      return e.data;
    case ce.StringUTF8:
      return e.data;
  }
}
function Ur(e) {
  switch (e.type) {
    case ce.ResponseErr:
      return { type: po(e), value: Hu(e, !0), success: !1 };
    case ce.ResponseOk:
      return { type: po(e), value: Hu(e, !0), success: !0 };
    default:
      return { type: po(e), value: Hu(e, !0) };
  }
}
function po(e) {
  switch (e.type) {
    case ce.BoolTrue:
    case ce.BoolFalse:
      return "bool";
    case ce.Int:
      return "int";
    case ce.UInt:
      return "uint";
    case ce.Buffer:
      return `(buff ${e.buffer.length})`;
    case ce.OptionalNone:
      return "(optional none)";
    case ce.OptionalSome:
      return `(optional ${po(e.value)})`;
    case ce.ResponseErr:
      return `(response UnknownType ${po(e.value)})`;
    case ce.ResponseOk:
      return `(response ${po(e.value)} UnknownType)`;
    case ce.PrincipalStandard:
    case ce.PrincipalContract:
      return "principal";
    case ce.List:
      return `(list ${e.list.length} ${e.list.length ? po(e.list[0]) : "UnknownType"})`;
    case ce.Tuple:
      return `(tuple ${Object.keys(e.data).map((t) => `(${t} ${po(e.data[t])})`).join(" ")})`;
    case ce.StringASCII:
      return `(string-ascii ${Hm(e.data).length})`;
    case ce.StringUTF8:
      return `(string-utf8 ${ha(e.data).length})`;
  }
}
const Wm = () => ({ type: ce.BoolTrue }), Zm = () => ({ type: ce.BoolFalse }), B8 = (e) => e ? Wm() : Zm(), q0 = BigInt("0xffffffffffffffffffffffffffffffff"), N8 = BigInt(0), W0 = BigInt("0x7fffffffffffffffffffffffffffffff"), Z0 = BigInt("-170141183460469231731687303715884105728"), M8 = (e) => {
  const t = Kn(e, !0);
  if (t > W0)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${W0}`);
  if (t < Z0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Z0}`);
  return { type: ce.Int, value: t };
}, An = (e) => {
  const t = Kn(e, !1);
  if (t < N8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > q0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${q0}`);
  return { type: ce.UInt, value: t };
}, Jm = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: ce.Buffer, buffer: e };
};
function Qm() {
  return { type: ce.OptionalNone };
}
function eb(e) {
  return { type: ce.OptionalSome, value: e };
}
function _8(e) {
  return { type: ce.ResponseErr, value: e };
}
function P8(e) {
  return { type: ce.ResponseOk, value: e };
}
function U8(e) {
  return { type: ce.List, list: e };
}
function wr(e) {
  for (const t in e)
    if (!k6(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: ce.Tuple, data: e };
}
const xt = (e) => ({ type: ce.StringASCII, data: e }), O8 = (e) => ({ type: ce.StringUTF8, data: e });
class tb extends Rm {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Do.hash(t);
    const r = fh(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const o = this.blockLen, s = new Uint8Array(o);
    s.set(r.length > o ? t.create().update(r).digest() : r);
    for (let i = 0; i < s.length; i++)
      s[i] ^= 54;
    this.iHash.update(s), this.oHash = t.create();
    for (let i = 0; i < s.length; i++)
      s[i] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(t) {
    return Do.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Do.exists(this), Do.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: o, destroyed: s, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = o, t.destroyed = s, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const nb = (e, t, n) => new tb(e, t).update(n).digest();
nb.create = (e, t) => new tb(e, t);
nn.hmacSha256Sync = (e, ...t) => {
  const n = nb.create(yh, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function sa(e) {
  return {
    type: Le.PublicKey,
    data: Kt(e)
  };
}
function H8(e, t, n = Wt.Compressed) {
  const r = v$(t.data), o = new pr(F0(r.r), F0(r.s)), s = at.fromSignature(e, o, r.recoveryId), i = n === Wt.Compressed;
  return s.toHex(i);
}
function D8(e) {
  return { type: Le.PublicKey, data: e };
}
function pa(e) {
  return !ct(e.data).startsWith("04");
}
function El(e) {
  return e.data.slice();
}
function F8(e) {
  const t = z8(e), n = Qa(t.data.slice(0, 32), t.compressed);
  return sa(ct(n));
}
function j8(e) {
  const t = typeof e == "string" ? e : ct(e), n = at.fromHex(t).toHex(!0);
  return sa(n);
}
function R8(e) {
  const t = typeof e == "string" ? e : ct(e), n = at.fromHex(t).toHex(!1);
  return sa(n);
}
function Qd(e) {
  const t = e.readUInt8(), n = t === 4 ? M$ : N$;
  return D8(cn([t, e.readBytes(n)]));
}
function z8(e) {
  const t = A$(e), n = t.length == Dm;
  return { data: t, compressed: n };
}
function G8(e, t) {
  const [n, r] = Hl(t, e.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const s = sc(r, 1) + pr.fromHex(n).toCompactHex();
  return Xm(s);
}
function K8(e) {
  return F8(e.data);
}
function V8(e, t, n) {
  return typeof e == "string" && (e = Ym(e)), typeof n == "string" && (n = eg(n)), {
    type: Le.Payload,
    payloadType: it.TokenTransfer,
    recipient: e,
    amount: Kn(t, !1),
    memo: n ?? eg("")
  };
}
function X8(e, t, n, r) {
  return typeof e == "string" && (e = wh(e)), typeof t == "string" && (t = oi(t)), typeof n == "string" && (n = oi(n)), {
    type: Le.Payload,
    payloadType: it.ContractCall,
    contractAddress: e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function J0(e, t, n) {
  return typeof e == "string" && (e = oi(e)), typeof t == "string" && (t = n6(t)), typeof n == "number" ? {
    type: Le.Payload,
    payloadType: it.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: Le.Payload,
    payloadType: it.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function Y8() {
  return { type: Le.Payload, payloadType: it.PoisonMicroblock };
}
function Q0(e, t) {
  if (e.byteLength != zo)
    throw Error(`Coinbase buffer size must be ${zo} bytes`);
  return t != null ? {
    type: Le.Payload,
    payloadType: it.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: Le.Payload,
    payloadType: it.Coinbase,
    coinbaseBytes: e
  };
}
function q8(e, t, n) {
  if (e.byteLength != zo)
    throw Error(`Coinbase buffer size must be ${zo} bytes`);
  if (n.byteLength != Yd)
    throw Error(`VRF proof buffer size must be ${Yd} bytes`);
  return {
    type: Le.Payload,
    payloadType: it.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === ce.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
var ef;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended";
})(ef || (ef = {}));
function W8(e, t, n, r, o, s, i) {
  return {
    type: Le.Payload,
    payloadType: it.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: o,
    cause: s,
    publicKeyHash: i
  };
}
function rb(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case it.TokenTransfer:
      t.push(sn(e.recipient)), t.push(So(e.amount, !1, 8)), t.push(Es(e.memo));
      break;
    case it.ContractCall:
      t.push(Es(e.contractAddress)), t.push(Es(e.contractName)), t.push(Es(e.functionName));
      const n = new Uint8Array(4);
      si(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(sn(r));
      });
      break;
    case it.SmartContract:
      t.push(Es(e.contractName)), t.push(Es(e.codeBody));
      break;
    case it.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(Es(e.contractName)), t.push(Es(e.codeBody));
      break;
    case it.PoisonMicroblock:
      break;
    case it.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case it.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(sn(e.recipient));
      break;
    case it.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(sn(e.recipient ? eb(e.recipient) : Qm())), t.push(e.vrfProof);
      break;
    case it.TenureChange:
      t.push(Kt(e.tenureHash)), t.push(Kt(e.previousTenureHash)), t.push(Kt(e.burnViewHash)), t.push(Kt(e.previousTenureEnd)), t.push(si(new Uint8Array(4), e.previousTenureBlocks)), t.push(I$(new Uint8Array(1), e.cause)), t.push(Kt(e.publicKeyHash));
      break;
  }
  return cn(t);
}
function Z8(e) {
  switch (e.readUInt8Enum(it, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case it.TokenTransfer:
      const n = $r(e), r = Kn(e.readBytes(8), !1), o = ob(e);
      return V8(n, r, o);
    case it.ContractCall:
      const s = oa(e), i = kr(e), a = kr(e), c = [], u = e.readUInt32BE();
      for (let A = 0; A < u; A++) {
        const T = $r(e);
        c.push(T);
      }
      return X8(s, i, a, c);
    case it.SmartContract:
      const h = kr(e), d = kr(e, 4, 1e5);
      return J0(h, d);
    case it.VersionedSmartContract: {
      const A = e.readUInt8Enum(qd, (X) => {
        throw new Error(`Cannot recognize ClarityVersion: ${X}`);
      }), T = kr(e), B = kr(e, 4, 1e5);
      return J0(T, B, A);
    }
    case it.PoisonMicroblock:
      return Y8();
    case it.Coinbase: {
      const A = e.readBytes(zo);
      return Q0(A);
    }
    case it.CoinbaseToAltRecipient: {
      const A = e.readBytes(zo), T = $r(e);
      return Q0(A, T);
    }
    case it.NakamotoCoinbase: {
      const A = e.readBytes(zo), T = $r(e), B = e.readBytes(Yd);
      return q8(A, T, B);
    }
    case it.TenureChange:
      const m = ct(e.readBytes(20)), w = ct(e.readBytes(20)), v = ct(e.readBytes(20)), x = ct(e.readBytes(32)), L = e.readUInt32BE(), N = e.readUInt8Enum(ef, (A) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${A}`);
      }), U = ct(e.readBytes(20));
      return W8(m, w, v, x, L, N, U);
  }
}
class au extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class _o extends au {
  constructor(t) {
    super(t);
  }
}
class hr extends au {
  constructor(t) {
    super(t);
  }
}
class kl extends au {
  constructor(t) {
    super(t);
  }
}
class Fo extends au {
  constructor(t) {
    super(t);
  }
}
var Or;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Or || (Or = {}));
function tf(e) {
  return Xm(ct(e.readBytes(ou)));
}
function Di(e, t) {
  return {
    pubKeyEncoding: e,
    type: Le.TransactionAuthField,
    contents: t
  };
}
function J8(e) {
  const t = e.readUInt8Enum(Or, (n) => {
    throw new hr(`Could not read ${n} as AuthFieldType`);
  });
  switch (t) {
    case Or.PublicKeyCompressed:
      return Di(Wt.Compressed, Qd(e));
    case Or.PublicKeyUncompressed:
      return Di(Wt.Uncompressed, R8(Qd(e).data));
    case Or.SignatureCompressed:
      return Di(Wt.Compressed, tf(e));
    case Or.SignatureUncompressed:
      return Di(Wt.Uncompressed, tf(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(t)}`);
  }
}
function mh(e) {
  return Kt(e.data);
}
function Q8(e) {
  const t = [];
  switch (e.contents.type) {
    case Le.PublicKey:
      t.push(e.pubKeyEncoding === Wt.Compressed ? Or.PublicKeyCompressed : Or.PublicKeyUncompressed), t.push(El(j8(e.contents.data)));
      break;
    case Le.MessageSignature:
      t.push(e.pubKeyEncoding === Wt.Compressed ? Or.SignatureCompressed : Or.SignatureUncompressed), t.push(mh(e.contents));
      break;
  }
  return cn(t);
}
function Es(e) {
  switch (e.type) {
    case Le.Address:
      return oc(e);
    case Le.Principal:
      return sb(e);
    case Le.LengthPrefixedString:
      return ia(e);
    case Le.MemoString:
      return r6(e);
    case Le.AssetInfo:
      return ib(e);
    case Le.PostCondition:
      return s6(e);
    case Le.PublicKey:
      return El(e);
    case Le.LengthPrefixedList:
      return Sh(e);
    case Le.Payload:
      return rb(e);
    case Le.TransactionAuthField:
      return Q8(e);
    case Le.MessageSignature:
      return mh(e);
  }
}
function e6() {
  return {
    type: Le.Address,
    version: Al.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function bh(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === Mt.SerializeP2PKH || t === Mt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === Mt.SerializeP2WPKH || t === Mt.SerializeP2WSH || t === Mt.SerializeP2WSHNonSequential) && !r.every(pa))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case Mt.SerializeP2PKH:
      return Ca(e, S6(r[0].data));
    case Mt.SerializeP2WPKH:
      return Ca(e, v6(r[0].data));
    case Mt.SerializeP2SH:
    case Mt.SerializeP2SHNonSequential:
      return Ca(e, A6(n, r.map(El)));
    case Mt.SerializeP2WSH:
    case Mt.SerializeP2WSHNonSequential:
      return Ca(e, E6(n, r.map(El)));
  }
}
function oc(e) {
  const t = [];
  return t.push(Kt(sc(e.version, 1))), t.push(Kt(e.hash160)), cn(t);
}
function oa(e) {
  const t = ru(ct(e.readBytes(1))), n = ct(e.readBytes(20));
  return { type: Le.Address, version: t, hash160: n };
}
function sb(e) {
  const t = [];
  return t.push(e.prefix), t.push(oc(e.address)), e.prefix === Va.Contract && t.push(ia(e.contractName)), cn(t);
}
function t6(e) {
  const t = e.readUInt8Enum(Va, (o) => {
    throw new hr(`Unexpected Principal payload type: ${o}`);
  }), n = oa(e);
  if (t === Va.Standard)
    return { type: Le.Principal, prefix: t, address: n };
  const r = kr(e);
  return {
    type: Le.Principal,
    prefix: t,
    address: n,
    contractName: r
  };
}
function ia(e) {
  const t = [], n = ha(e.content), r = n.byteLength;
  return t.push(Kt(sc(r, e.lengthPrefixBytes))), t.push(n), cn(t);
}
function kr(e, t, n) {
  t = t || 1;
  const r = ru(ct(e.readBytes(t))), o = dh(e.readBytes(r));
  return oi(o, t, n ?? 128);
}
function n6(e) {
  return oi(e, 4, 1e5);
}
function eg(e) {
  if (e && ub(e, Sl))
    throw new Error(`Memo exceeds maximum length of ${Sl} bytes`);
  return { type: Le.MemoString, content: e };
}
function r6(e) {
  const t = [], n = ha(e.content), r = x6(ct(n), Sl * 2);
  return t.push(Kt(r)), cn(t);
}
function ob(e) {
  let t = dh(e.readBytes(Sl));
  return t = t.replace(/\u0000*$/, ""), { type: Le.MemoString, content: t };
}
function ib(e) {
  const t = [];
  return t.push(oc(e.address)), t.push(ia(e.contractName)), t.push(ia(e.assetName)), cn(t);
}
function nf(e) {
  return {
    type: Le.AssetInfo,
    address: oa(e),
    contractName: kr(e),
    assetName: kr(e)
  };
}
function xh(e, t) {
  return {
    type: Le.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function Sh(e) {
  const t = e.values, n = [];
  n.push(Kt(sc(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(Es(r));
  return cn(n);
}
function ab(e, t, n) {
  const r = ru(ct(e.readBytes(4))), o = [];
  for (let s = 0; s < r; s++)
    switch (t) {
      case Le.Address:
        o.push(oa(e));
        break;
      case Le.LengthPrefixedString:
        o.push(kr(e));
        break;
      case Le.MemoString:
        o.push(ob(e));
        break;
      case Le.AssetInfo:
        o.push(nf(e));
        break;
      case Le.PostCondition:
        o.push(o6(e));
        break;
      case Le.PublicKey:
        o.push(Qd(e));
        break;
      case Le.TransactionAuthField:
        o.push(J8(e));
        break;
    }
  return xh(o, n);
}
function s6(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(sb(e.principal)), (e.conditionType === Jn.Fungible || e.conditionType === Jn.NonFungible) && t.push(ib(e.assetInfo)), e.conditionType === Jn.NonFungible && t.push(sn(e.assetName)), t.push(e.conditionCode), e.conditionType === Jn.STX || e.conditionType === Jn.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new _o("The post-condition amount may not be larger than 8 bytes");
    t.push(So(e.amount, !1, 8));
  }
  return cn(t);
}
function o6(e) {
  const t = e.readUInt8Enum(Jn, (i) => {
    throw new hr(`Could not read ${i} as PostConditionType`);
  }), n = t6(e);
  let r, o, s;
  switch (t) {
    case Jn.STX:
      return r = e.readUInt8Enum(Ka, (a) => {
        throw new hr(`Could not read ${a} as FungibleConditionCode`);
      }), s = BigInt(`0x${ct(e.readBytes(8))}`), {
        type: Le.PostCondition,
        conditionType: Jn.STX,
        principal: n,
        conditionCode: r,
        amount: s
      };
    case Jn.Fungible:
      return o = nf(e), r = e.readUInt8Enum(Ka, (a) => {
        throw new hr(`Could not read ${a} as FungibleConditionCode`);
      }), s = BigInt(`0x${ct(e.readBytes(8))}`), {
        type: Le.PostCondition,
        conditionType: Jn.Fungible,
        principal: n,
        conditionCode: r,
        amount: s,
        assetInfo: o
      };
    case Jn.NonFungible:
      o = nf(e);
      const i = $r(e);
      return r = e.readUInt8Enum(Wd, (a) => {
        throw new hr(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: Le.PostCondition,
        conditionType: Jn.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: o,
        assetName: i
      };
  }
}
function us(e, t) {
  return cn([e, t]);
}
function i6(e) {
  return new Uint8Array([e.type]);
}
function a6(e) {
  return e.type === ce.OptionalNone ? new Uint8Array([e.type]) : us(e.type, sn(e.value));
}
function c6(e) {
  const t = new Uint8Array(4);
  return si(t, e.buffer.length, 0), us(e.type, su(t, e.buffer));
}
function l6(e) {
  const t = uh(y$(e.value, BigInt(B$)), Fm);
  return us(e.type, t);
}
function u6(e) {
  const t = uh(e.value, Fm);
  return us(e.type, t);
}
function d6(e) {
  return us(e.type, oc(e.address));
}
function f6(e) {
  return us(e.type, su(oc(e.address), ia(e.contractName)));
}
function h6(e) {
  return us(e.type, sn(e.value));
}
function p6(e) {
  const t = [], n = new Uint8Array(4);
  si(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const o = sn(r);
    t.push(o);
  }
  return us(e.type, cn(t));
}
function g6(e) {
  const t = [], n = new Uint8Array(4);
  si(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((o, s) => o.localeCompare(s));
  for (const o of r) {
    const s = oi(o);
    t.push(ia(s));
    const i = sn(e.data[o]);
    t.push(i);
  }
  return us(e.type, cn(t));
}
function cb(e, t) {
  const n = [], r = t == "ascii" ? Hm(e.data) : ha(e.data), o = new Uint8Array(4);
  return si(o, r.length, 0), n.push(o), n.push(r), us(e.type, cn(n));
}
function y6(e) {
  return cb(e, "ascii");
}
function w6(e) {
  return cb(e, "utf8");
}
function sn(e) {
  switch (e.type) {
    case ce.BoolTrue:
    case ce.BoolFalse:
      return i6(e);
    case ce.OptionalNone:
    case ce.OptionalSome:
      return a6(e);
    case ce.Buffer:
      return c6(e);
    case ce.UInt:
      return u6(e);
    case ce.Int:
      return l6(e);
    case ce.PrincipalStandard:
      return d6(e);
    case ce.PrincipalContract:
      return f6(e);
    case ce.ResponseOk:
    case ce.ResponseErr:
      return h6(e);
    case ce.List:
      return p6(e);
    case ce.Tuple:
      return g6(e);
    case ce.StringASCII:
      return y6(e);
    case ce.StringUTF8:
      return w6(e);
    default:
      throw new _o("Unable to serialize. Invalid Clarity Value.");
  }
}
function m6(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const tg = /* @__PURE__ */ new Map();
function lb(e, t) {
  const n = tg.get(e);
  if (n !== void 0)
    return n(t);
  const r = m6(e);
  return tg.set(e, r), lb(e, t);
}
class Pa {
  constructor(t) {
    this.consumed = 0, this.source = t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return L$(this.readBytes(4), 0);
  }
  readUInt8() {
    return $$(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return E$(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = ct(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = ct(n);
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
    if (lb(t, r))
      return r;
    throw n(r);
  }
}
function $r(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new Pa(Kt(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new Pa(e) : t = e;
  switch (t.readUInt8Enum(ce, (r) => {
    throw new hr(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case ce.Int:
      return M8(t.readBytes(16));
    case ce.UInt:
      return An(t.readBytes(16));
    case ce.Buffer:
      const r = t.readUInt32BE();
      return Jm(t.readBytes(r));
    case ce.BoolTrue:
      return Wm();
    case ce.BoolFalse:
      return Zm();
    case ce.PrincipalStandard:
      const o = oa(t);
      return C8(o);
    case ce.PrincipalContract:
      const s = oa(t), i = kr(t);
      return qm(s, i);
    case ce.ResponseOk:
      return P8($r(t));
    case ce.ResponseErr:
      return _8($r(t));
    case ce.OptionalNone:
      return Qm();
    case ce.OptionalSome:
      return eb($r(t));
    case ce.List:
      const a = t.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push($r(t));
      return U8(c);
    case ce.Tuple:
      const u = t.readUInt32BE(), h = {};
      for (let x = 0; x < u; x++) {
        const L = kr(t).content;
        if (L === void 0)
          throw new hr('"content" is undefined');
        h[L] = $r(t);
      }
      return wr(h);
    case ce.StringASCII:
      const d = t.readUInt32BE(), m = x$(t.readBytes(d));
      return xt(m);
    case ce.StringUTF8:
      const w = t.readUInt32BE(), v = dh(t.readBytes(w));
      return O8(v);
    default:
      throw new hr("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const b6 = (e) => e.length % 2 == 0 ? e : `0${e}`, x6 = (e, t) => e.padEnd(t, "0"), ub = (e, t) => e ? ha(e).length > t : !1;
function rf(e) {
  return Cw(e);
}
const Xa = (e) => q$(yh(e)), vh = (e) => ct($8(e)), S6 = (e) => ct(Xa(e)), v6 = (e) => {
  const t = Xa(e), n = su(new Uint8Array([0]), new Uint8Array([t.length]), t), r = Xa(n);
  return ct(r);
}, A6 = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + t.length), n.push(174);
  const r = cn(n), o = Xa(r);
  return ct(o);
}, E6 = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + t.length), n.push(174);
  const r = cn(n), o = yh(r), s = [];
  s.push(0), s.push(o.length), s.push(o);
  const i = cn(s), a = Xa(i);
  return ct(a);
};
function k6(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function db(e) {
  const t = sn(e);
  return `0x${ct(t)}`;
}
function $6(e) {
  return $r(e);
}
const zi = (e) => {
  try {
    return fi.c32addressDecode(e), !0;
  } catch {
    return !1;
  }
};
function Ah() {
  return {
    type: Le.MessageSignature,
    data: ct(new Uint8Array(ou))
  };
}
function fb(e, t, n, r) {
  const o = bh(0, e, 1, [sa(t)]).hash160, s = pa(sa(t)) ? Wt.Compressed : Wt.Uncompressed;
  return {
    hashMode: e,
    signer: o,
    nonce: Kn(n, !1),
    fee: Kn(r, !1),
    keyEncoding: s,
    signature: Ah()
  };
}
function Ya(e) {
  return "signature" in e;
}
function ng(e) {
  return e === Mt.SerializeP2SH || e === Mt.SerializeP2WSH;
}
function I6(e) {
  return e === Mt.SerializeP2SHNonSequential || e === Mt.SerializeP2WSHNonSequential;
}
function rg(e) {
  const t = rf(e);
  return t.nonce = 0, t.fee = 0, Ya(t) ? t.signature = Ah() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function L6(e) {
  const t = [
    e.hashMode,
    Kt(e.signer),
    So(e.nonce, !1, 8),
    So(e.fee, !1, 8),
    e.keyEncoding,
    mh(e.signature)
  ];
  return cn(t);
}
function C6(e) {
  const t = [
    e.hashMode,
    Kt(e.signer),
    So(e.nonce, !1, 8),
    So(e.fee, !1, 8)
  ], n = xh(e.fields);
  t.push(Sh(n));
  const r = new Uint8Array(2);
  return k$(r, e.signaturesRequired, 0), t.push(r), cn(t);
}
function T6(e, t) {
  const n = ct(t.readBytes(20)), r = BigInt(`0x${ct(t.readBytes(8))}`), o = BigInt(`0x${ct(t.readBytes(8))}`), s = t.readUInt8Enum(Wt, (a) => {
    throw new hr(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (e === Mt.SerializeP2WPKH && s != Wt.Compressed)
    throw new hr("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const i = tf(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: o,
    keyEncoding: s,
    signature: i
  };
}
function B6(e, t) {
  const n = ct(t.readBytes(20)), r = BigInt("0x" + ct(t.readBytes(8))), o = BigInt("0x" + ct(t.readBytes(8))), s = ab(t, Le.TransactionAuthField).values;
  let i = !1, a = 0;
  for (const u of s)
    switch (u.contents.type) {
      case Le.PublicKey:
        pa(u.contents) || (i = !0);
        break;
      case Le.MessageSignature:
        if (u.pubKeyEncoding === Wt.Uncompressed && (i = !0), a += 1, a === 65536)
          throw new Fo("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = t.readUInt16BE();
  if (i && (e === Mt.SerializeP2WSH || e === Mt.SerializeP2WSHNonSequential))
    throw new Fo("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: o,
    fields: s,
    signaturesRequired: c
  };
}
function Du(e) {
  return Ya(e) ? L6(e) : C6(e);
}
function Fu(e) {
  const t = e.readUInt8Enum(Mt, (n) => {
    throw new hr(`Could not parse ${n} as AddressHashMode`);
  });
  return t === Mt.SerializeP2PKH || t === Mt.SerializeP2WPKH ? T6(t, e) : B6(t, e);
}
function hb(e, t, n, r) {
  const s = e + ct(new Uint8Array([t])) + ct(So(n, !1, 8)) + ct(So(r, !1, 8));
  if (Kt(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return vh(Kt(s));
}
function pb(e, t, n) {
  const r = 33 + ou, o = pa(t) ? Wt.Compressed : Wt.Uncompressed, s = e + b6(o.toString(16)) + n.data, i = Kt(s);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return vh(i);
}
function N6(e, t, n, r, o) {
  const s = hb(e, t, n, r), i = G8(o, s), a = K8(o), c = pb(s, a, i);
  return {
    nextSig: i,
    nextSigHash: c
  };
}
function gb(e, t, n, r, o, s) {
  const i = hb(e, t, n, r), a = sa(H8(i, s, o)), c = pb(i, a, s);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function M6() {
  const e = fb(Mt.SerializeP2PKH, "", 0, 0);
  return e.signer = e6().hash160, e.keyEncoding = Wt.Compressed, e.signature = Ah(), e;
}
function sg(e, t, n) {
  return Ya(e) ? _6(e, t, n) : P6(e, t, n);
}
function _6(e, t, n) {
  const { pubKey: r, nextSigHash: o } = gb(t, n, e.fee, e.nonce, e.keyEncoding, e.signature), s = bh(0, e.hashMode, 1, [r]).hash160;
  if (s !== e.signer)
    throw new Fo(`Signer hash does not equal hash of public key(s): ${s} != ${e.signer}`);
  return o;
}
function P6(e, t, n) {
  const r = [];
  let o = t, s = !1, i = 0;
  for (const c of e.fields)
    switch (c.contents.type) {
      case Le.PublicKey:
        pa(c.contents) || (s = !0), r.push(c.contents);
        break;
      case Le.MessageSignature:
        c.pubKeyEncoding === Wt.Uncompressed && (s = !0);
        const { pubKey: u, nextSigHash: h } = gb(o, n, e.fee, e.nonce, c.pubKeyEncoding, c.contents);
        if (ng(e.hashMode) && (o = h), r.push(u), i += 1, i === 65536)
          throw new Fo("Too many signatures");
        break;
    }
  if (ng(e.hashMode) && i !== e.signaturesRequired || I6(e.hashMode) && i < e.signaturesRequired)
    throw new Fo("Incorrect number of signatures");
  if (s && (e.hashMode === Mt.SerializeP2WSH || e.hashMode === Mt.SerializeP2WSHNonSequential))
    throw new Fo("Uncompressed keys are not allowed in this hash mode");
  const a = bh(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new Fo(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return o;
}
function yb(e) {
  return {
    authType: tn.Standard,
    spendingCondition: e
  };
}
function wb(e, t) {
  return {
    authType: tn.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || fb(Mt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function og(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case tn.Standard:
        return yb(rg(e.spendingCondition));
      case tn.Sponsored:
        return wb(rg(e.spendingCondition), M6());
      default:
        throw new kl("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function U6(e, t) {
  switch (e.authType) {
    case tn.Standard:
      return sg(e.spendingCondition, t, tn.Standard);
    case tn.Sponsored:
      return sg(e.spendingCondition, t, tn.Standard);
    default:
      throw new kl("Invalid origin auth type");
  }
}
function O6(e, t) {
  switch (e.authType) {
    case tn.Standard:
      const n = {
        ...e.spendingCondition,
        fee: Kn(t, !1)
      };
      return { ...e, spendingCondition: n };
    case tn.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: Kn(t, !1)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function H6(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: Kn(t, !1)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function D6(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: Kn(t, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function F6(e, t) {
  const n = {
    ...t,
    nonce: Kn(t.nonce, !1),
    fee: Kn(t.fee, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function j6(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case tn.Standard:
      t.push(Du(e.spendingCondition));
      break;
    case tn.Sponsored:
      t.push(Du(e.spendingCondition)), t.push(Du(e.sponsorSpendingCondition));
      break;
  }
  return cn(t);
}
function R6(e) {
  const t = e.readUInt8Enum(tn, (r) => {
    throw new hr(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case tn.Standard:
      return n = Fu(e), yb(n);
    case tn.Sponsored:
      n = Fu(e);
      const r = Fu(e);
      return wb(n, r);
  }
}
class z6 {
  constructor(t, n, r, o, s, i, a) {
    if (this.version = t, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Kn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? C$, this.postConditionMode = s ?? ra.Deny, this.postConditions = o ?? xh([]), i)
      this.anchorMode = _$(i);
    else
      switch (r.payloadType) {
        case it.Coinbase:
        case it.CoinbaseToAltRecipient:
        case it.NakamotoCoinbase:
        case it.PoisonMicroblock:
        case it.TenureChange:
          this.anchorMode = Zn.OnChainOnly;
          break;
        case it.ContractCall:
        case it.SmartContract:
        case it.VersionedSmartContract:
        case it.TokenTransfer:
          this.anchorMode = Zn.Any;
          break;
      }
  }
  signBegin() {
    const t = rf(this);
    return t.auth = og(t.auth), t.txid();
  }
  verifyBegin() {
    const t = rf(this);
    return t.auth = og(t.auth), t.txid();
  }
  verifyOrigin() {
    return U6(this.auth, this.verifyBegin());
  }
  signNextOrigin(t, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, t, tn.Standard, n);
  }
  signNextSponsor(t, n) {
    if (this.auth.authType === tn.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, t, tn.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(t) {
    const n = this.auth.spendingCondition;
    if (n && !Ya(n)) {
      const r = pa(t);
      n.fields.push(Di(r ? Wt.Compressed : Wt.Uncompressed, t));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, o) {
    const { nextSig: s, nextSigHash: i } = N6(n, r, t.fee, t.nonce, o);
    return Ya(t) ? t.signature = s : t.fields.push(Di(o.data.byteLength === Dm ? Wt.Compressed : Wt.Uncompressed, s)), i;
  }
  txid() {
    const t = this.serialize();
    return vh(t);
  }
  setSponsor(t) {
    if (this.auth.authType != tn.Sponsored)
      throw new kl("Cannot sponsor sign a non-sponsored transaction");
    this.auth = F6(this.auth, t);
  }
  setFee(t) {
    this.auth = O6(this.auth, t);
  }
  setNonce(t) {
    this.auth = H6(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != tn.Sponsored)
      throw new kl("Cannot sponsor sign a non-sponsored transaction");
    this.auth = D6(this.auth, t);
  }
  serialize() {
    if (this.version === void 0)
      throw new _o('"version" is undefined');
    if (this.chainId === void 0)
      throw new _o('"chainId" is undefined');
    if (this.auth === void 0)
      throw new _o('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new _o('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new _o('"payload" is undefined');
    const t = [];
    t.push(this.version);
    const n = new Uint8Array(4);
    return si(n, this.chainId, 0), t.push(n), t.push(j6(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(Sh(this.postConditions)), t.push(rb(this.payload)), cn(t);
  }
}
function Fi(e) {
  let t;
  typeof e == "string" ? e.slice(0, 2).toLowerCase() === "0x" ? t = new Pa(Kt(e.slice(2))) : t = new Pa(Kt(e)) : e instanceof Uint8Array ? t = new Pa(e) : t = e;
  const n = t.readUInt8Enum(vl, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = t.readUInt32BE(), o = R6(t), s = t.readUInt8Enum(Zn, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), i = t.readUInt8Enum(ra, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = ab(t, Le.PostCondition), c = Z8(t);
  return new z6(n, o, c, a, i, s, r);
}
const G6 = B8, Ua = An, K6 = Jm;
const V6 = /* @__PURE__ */ new Set([4001, -31001]), X6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], Y6 = ["result", "data", "payload", "response", "params"], ig = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], cu = (e) => typeof e == "string" && e.toLowerCase().includes("xverse"), yi = () => {
  if (!(typeof window > "u")) {
    try {
      const e = window.top;
      if (e && e !== window.self && e.location.origin === window.location.origin)
        return e;
    } catch {
    }
    return window;
  }
}, Ls = (e, t) => {
  if (!(!e || !t))
    return t.split(".").reduce((n, r) => n == null ? void 0 : n[r], e);
}, q6 = (e, t) => e.id === t.id || !!(e.name && t.name && e.name.toLowerCase() === t.name.toLowerCase()), mb = (e) => {
  if (!e)
    return [];
  const t = e, n = [
    ...t.btc_providers ?? [],
    ...t.webbtc_providers ?? [],
    ...t.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, o) => !!(r != null && r.id) && n.findIndex((s) => q6(s, r)) === o
  );
}, bb = (e) => e ? mb(yi()).some(
  (t) => {
    var n;
    return t.id === e && (cu(t.id) || ((n = t.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, xb = () => {
  if (typeof window > "u")
    return;
  const e = yi(), t = mb(e).filter(
    (n) => {
      var r;
      return cu(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of t) {
    const r = Ls(e, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of X6) {
    const r = Ls(e, n) ?? (e === window ? void 0 : Ls(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, W6 = (e) => {
  if (typeof window > "u" || !e)
    return;
  const t = yi(), n = Ls(t, e) ?? (t === window ? void 0 : Ls(window, e)) ?? Yl(e);
  if (n)
    return n;
  if (cu(e) || bb(e))
    return xb();
}, Oc = (e, t) => {
  try {
    e == null || e(t);
  } catch {
  }
}, Z6 = ["blockstack-session", "blockstack"], J6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const e of Z6) {
      let t = null;
      try {
        t = window.localStorage.getItem(e);
      } catch {
        continue;
      }
      if (!t)
        continue;
      let n = !1;
      try {
        const r = JSON.parse(t);
        n = typeof (r == null ? void 0 : r.version) == "string" && r.version.length > 0;
      } catch {
        n = !1;
      }
      if (!n)
        try {
          window.localStorage.removeItem(e);
        } catch {
        }
    }
};
J6();
const Sb = (e) => e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e, dr = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}, Q6 = (e) => {
  const t = dr(e);
  if (!t)
    return null;
  const n = Sb(t);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : t.startsWith("0x") || t.startsWith("0X") ? t : `0x${n}`;
}, e5 = (e) => {
  const t = dr(e);
  if (!t)
    return null;
  const n = Sb(t);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, sf = (e, t = "mainnet") => {
  if (typeof e == "string") {
    const n = e.toLowerCase();
    if (n.includes("testnet") || n === "test")
      return "testnet";
    if (n.includes("mainnet") || n === "main")
      return "mainnet";
  }
  if (e && typeof e == "object") {
    const n = e;
    if (typeof n.network == "string")
      return sf(n.network, t);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return sf(r, t);
  }
  return t;
}, Go = (e) => {
  if (typeof e > "u" || e === null)
    return;
  if (typeof e == "bigint")
    return e.toString(10);
  if (typeof e == "number")
    return Number.isFinite(e) ? String(e) : void 0;
  const t = String(e).trim();
  return t.length > 0 ? t : void 0;
}, qa = (e, t = 0) => {
  if (t > 8)
    return null;
  if (typeof e == "string") {
    const o = e.trim();
    return zi(o) ? o : null;
  }
  if (!e)
    return null;
  if (Array.isArray(e)) {
    for (const o of e) {
      const s = qa(o, t + 1);
      if (s)
        return s;
    }
    return null;
  }
  if (typeof e != "object")
    return null;
  const n = e, r = [
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
  for (const o of r) {
    if (!(o in n))
      continue;
    const s = qa(n[o], t + 1);
    if (s)
      return s;
  }
  return typeof n.mainnet == "string" && zi(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && zi(n.testnet) ? n.testnet.trim() : null;
}, ag = (e) => {
  const t = e && typeof e == "object" && "code" in e ? e.code : void 0, r = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, vb = (e) => {
  if (e && typeof e == "object") {
    const r = "code" in e ? e.code : void 0;
    if (typeof r == "number" && V6.has(r))
      return !0;
  }
  const n = (e instanceof Error ? e.message : String(e ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, ii = (e) => {
  if (e instanceof Error)
    return e;
  const t = e && typeof e == "object" ? e : {}, n = t.error && typeof t.error == "object" ? t.error : null, r = dr(n == null ? void 0 : n.message) ?? dr(t.message) ?? dr(t.error) ?? dr(e) ?? "Wallet provider request failed.", o = new Error(r);
  return o.code = (n == null ? void 0 : n.code) ?? t.code, o.data = (n == null ? void 0 : n.data) ?? t.data, o;
}, aa = (e) => {
  if (e && typeof e == "object") {
    const t = e;
    if (t.error)
      throw ii(t);
    if (t.status === "error")
      throw ii(t.result ?? t);
  }
  return e;
}, cg = async (e, t, n) => {
  if (typeof e.request != "function")
    throw new Error(`Wallet provider does not support request("${t}").`);
  try {
    const r = await e.request(t, n);
    return aa(r);
  } catch (r) {
    throw ii(r);
  }
}, Ab = () => xb(), Eh = () => {
  if (typeof window > "u")
    return;
  const e = yi();
  for (const t of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Ls(e, t) ?? (e === window ? void 0 : Ls(window, t));
    if (n)
      return n;
  }
}, lg = () => {
  if (typeof window > "u")
    return;
  const e = Eh();
  if (typeof (e == null ? void 0 : e.transactionRequest) == "function")
    return e;
  const t = yi();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Ls(t, n) ?? (t === window ? void 0 : Ls(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Qc = (e) => {
  var r, o;
  const t = Zo();
  if (cu(t) || bb(t))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = yi() ?? window;
  return e === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || e === ((o = n.xverseProviders) == null ? void 0 : o.StacksProvider) || e === Ab();
}, ju = (e) => {
  const t = e5(e);
  if (!t)
    return null;
  try {
    const n = Fi(t).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, $l = (e, t = 0) => {
  if (t > 6 || typeof e > "u" || e === null)
    return null;
  const n = ju(e), r = Q6(e) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? dr(e) ?? void 0 : void 0
    };
  if (Array.isArray(e)) {
    for (const a of e) {
      const c = $l(a, t + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof e != "object")
    return null;
  const o = e;
  let s = null;
  for (const a of ig)
    if (ju(o[a])) {
      s = dr(o[a]);
      break;
    }
  const i = dr(o.txId) || dr(o.txid) || dr(o.transactionId);
  if (i)
    return {
      ...o,
      txId: i,
      txid: i,
      txRaw: s ?? dr(o.txRaw) ?? void 0
    };
  for (const a of ig) {
    const c = ju(o[a]);
    if (c)
      return {
        ...o,
        txId: c,
        txid: c,
        txRaw: dr(o[a]) ?? void 0
      };
  }
  for (const a of Y6) {
    const c = o[a], u = $l(c, t + 1);
    if (u)
      return {
        ...o,
        ...c && typeof c == "object" ? c : {},
        ...u,
        txId: u.txId,
        txid: u.txid ?? u.txId
      };
  }
  return null;
}, Ru = (e) => {
  const t = $l(e);
  if (t)
    return t;
  throw new Error("Wallet response did not include a transaction id.");
}, t5 = (e) => {
  const t = $l(e);
  return t || (e && typeof e == "object" ? e : { result: e });
}, n5 = (e) => ({
  ...e,
  fee: Go(e.fee),
  nonce: Go(e.nonce),
  sponsored: e.sponsored === !0
}), ug = (e) => ({
  recipient: e.recipient,
  amount: Go(e.amount) ?? "0",
  memo: e.memo,
  network: sf(e.network),
  address: e.stxAddress,
  fee: Go(e.fee),
  nonce: Go(e.nonce),
  sponsored: e.sponsored ?? !1
}), Eb = "WALLET_ADDRESS_MISMATCH", r5 = 45e3;
let Oa = null;
const of = (e) => {
  e && (Oa = { address: e, at: Date.now() });
}, s5 = () => {
  Oa = null;
}, o5 = () => Oa && Date.now() - Oa.at <= r5 ? Oa.address : null, i5 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t.includes("network mismatch") || t.includes("mismatch") && t.includes("network");
}, a5 = async (e) => {
  s5();
  try {
    await e.request("wallet_disconnect");
  } catch {
  }
  const t = aa(await e.request("wallet_connect")), n = qa(t);
  return of(n), n;
}, c5 = async (e, t, n, r) => {
  try {
    return aa(await e.request(t, n));
  } catch (o) {
    const s = ii(o);
    if (!i5(s))
      throw s;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: t,
      message: s.message
    });
    let i = null;
    try {
      i = await a5(e);
    } catch (a) {
      throw console.info("[wallet:xverse-preflight]", {
        stage: "RECOVERY_RECONNECT_FAILED",
        message: a instanceof Error ? a.message : String(a)
      }), s;
    }
    if (!i || r && i !== r)
      throw Object.assign(
        new Error(
          i ? `Xverse reconnected as ${i}, not the expected ${r}. Switch back to that account and retry.` : s.message
        ),
        { code: i ? Eb : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: t, address: i });
    try {
      return aa(await e.request(t, n));
    } catch (a) {
      throw ii(a);
    }
  }
};
let dg = 3e4;
const l5 = (e, t) => {
  let n;
  const r = new Promise((o, s) => {
    n = setTimeout(() => {
      s(
        Object.assign(
          new Error(`Xverse did not answer ${t} within ${dg / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, dg);
  });
  return Promise.race([e, r]).finally(() => {
    n && clearTimeout(n);
  });
}, u5 = async (e, t, n) => {
  const r = (c, u) => {
    if (t && c !== t)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${t}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Eb }
      );
    return c;
  }, o = o5();
  if (o)
    return Oc(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: o }), r(o, "cached-session");
  let s = null;
  Oc(n, "account-read");
  try {
    const c = aa(
      await l5(e.request("wallet_getAccount"), "wallet_getAccount")
    );
    s = qa(c), console.info("[wallet:xverse-preflight]", {
      stage: s ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: s
    });
  } catch (c) {
    if (vb(c))
      throw ii(c);
    Oc(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (s)
    return of(s), r(s, "wallet_getAccount");
  let i;
  Oc(n, "account-reconnect");
  try {
    i = aa(await e.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), ii(c);
  }
  const a = qa(i);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return of(a), r(a, "wallet_connect");
}, d5 = async (e, t) => {
  if (!Qc(e)) {
    const s = await cg(
      e,
      "stx_transferStx",
      ug(t)
    );
    return Ru(s);
  }
  const n = Eh();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const s = await cg(
      n,
      "stx_transferStx",
      ug(t)
    );
    return Ru(s);
  }
  const r = Ab();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await u5(r, t.stxAddress);
  const o = await c5(
    r,
    "stx_transferStx",
    {
      recipient: t.recipient,
      amount: Go(t.amount) ?? "0",
      ...t.memo ? { memo: t.memo } : {},
      ...t.fee !== void 0 ? { fee: Go(t.fee) } : {}
    },
    t.stxAddress
  );
  return Ru(o);
}, f5 = () => Zo(), kb = () => {
  var r, o;
  if (typeof window > "u")
    return;
  const e = Zo(), t = e ? W6(e) : void 0;
  if (t)
    return t;
  const n = yi() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((o = n.xverseProviders) == null ? void 0 : o.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, fg = (e, t) => {
  const n = kb(), r = n5({
    ...e,
    onFinish: (o) => {
      var s;
      (s = e.onFinish) == null || s.call(e, t5(o));
    }
  });
  if (!n || typeof n.request != "function")
    return Mc(r, t);
  if (Qc(n) && !Eh()) {
    const o = lg();
    if (o)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Zo(),
        route: "legacy-transaction-request"
      }), Mc(r, o);
  }
  return void d5(n, e).then((o) => {
    var s;
    (s = e.onFinish) == null || s.call(e, o);
  }).catch((o) => {
    var s, i;
    if (ag(o) && Qc(n)) {
      const a = lg();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Zo(),
          route: "legacy-transaction-request"
        }), Mc(r, a);
        return;
      }
    }
    if (ag(o) && !Qc(n)) {
      Mc(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", o), vb(o)) {
      (s = e.onCancel) == null || s.call(e);
      return;
    }
    if (e.onError) {
      e.onError(o);
      return;
    }
    (i = e.onCancel) == null || i.call(e);
  });
}, h5 = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), hg = (e) => db(e).replace(/^0x/, ""), pg = "This wallet cannot sign messages. Try Xverse or Leather.", gg = (e) => typeof (e == null ? void 0 : e.request) == "function", yg = (e) => typeof (e == null ? void 0 : e.structuredDataSignatureRequest) == "function", p5 = (e) => {
  const t = e && typeof e == "object" ? e.code : void 0, n = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, g5 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(t) || t.includes("no longer supported") || t.includes("request() rpc") || t.includes("upgrade to the");
};
async function y5(e, t) {
  const n = await e.request("stx_signStructuredMessage", {
    message: hg(t.message),
    domain: hg(t.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function w5(e, t) {
  const n = await l$({
    domain: t.domain,
    message: t.message,
    network: nu(t.network),
    stxAddress: t.stxAddress,
    appDetails: t.appDetails ?? h5()
  }), r = await e.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function zu(e) {
  var o, s;
  const t = f5() || "", n = /xverse/i.test(t);
  let r = kb();
  if (n && !yg(r)) {
    const i = window;
    r = ((o = i.XverseProviders) == null ? void 0 : o.StacksProvider) ?? ((s = i.xverseProviders) == null ? void 0 : s.StacksProvider);
  }
  if (yg(r))
    try {
      return await w5(r, e);
    } catch (i) {
      if (n || !gg(r) || !g5(i)) throw i;
    }
  if (!n && gg(r))
    try {
      return await y5(r, e);
    } catch (i) {
      throw p5(i) ? new Error(pg) : i;
    }
  throw new Error(pg);
}
const wg = 1000000n, $s = 1000000n, Il = 50n, on = 3000n, Rr = 300n, va = 3000n, m5 = 50000n, b5 = 300n, x5 = 200n, lu = 15000n, On = (e) => e + Il;
function Mr(e) {
  const t = e < 0n ? "-" : "", n = e < 0n ? -e : e;
  return `${t}${n / wg}.${(n % wg).toString().padStart(6, "0")}`;
}
function mg(e, t = Rr) {
  return e <= on ? 0 : Number((e - on) / On(t));
}
function Gu(e, t = 0n) {
  const n = $s - e - t;
  return n > 0n ? n : 0n;
}
function S5(e, t = Rr) {
  return e > $s ? "over" : e < on + On(t) ? "empty" : e < m5 ? "low" : "ok";
}
const v5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", A5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", E5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function k5(e) {
  var n, r, o, s;
  const t = (e == null ? void 0 : e.success) === !0 ? (n = e.value) == null ? void 0 : n.value : null;
  return !t || ((r = t.version) == null ? void 0 : r.value) !== "1" || ((o = t["holder-payment"]) == null ? void 0 : o.value) !== "50" || ((s = t["receipt-bytes"]) == null ? void 0 : s.value) !== "16" || E5.some((i, a) => {
    var c;
    return ((c = t["core-" + (a + 1)]) == null ? void 0 : c.value) !== v5 + "." + i;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const $b = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Ku = 3, $5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", I5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-music-awards-v1-0", bg = 1, [af, Ib] = $b.split("."), vr = (e) => Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
function cf(e) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(e)) throw Error("Invalid encoded data.");
  return Uint8Array.from(e.match(/../g), (t) => parseInt(t, 16));
}
async function L5(e) {
  return vr(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(e))));
}
async function bo(e, t = {}) {
  const n = await fetch("/hiro/mainnet" + e, { ...t, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Lb(e, t = []) {
  const n = await bo(`/v2/contracts/call-read/${af}/${Ib}/${e}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: af, arguments: t.map((r) => "0x" + vr(sn(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Ur($r(n.result));
}
async function C5() {
  const e = await bo(`/v2/contracts/source/${af}/${Ib}?proof=0`);
  if (typeof e.source != "string" || await L5(e.source) !== A5) throw Error("Deployed source does not match the tested helper.");
  if (k5(await Lb("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Cb(e) {
  return e.startsWith("SP") && zi(e) && !e.includes(".");
}
async function T5(e) {
  var r;
  if (!Cb(e)) throw Error("Invalid mainnet wallet address.");
  const t = await bo(`/v2/accounts/${e}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(t.balance) || !Number.isSafeInteger(t.nonce) || t.nonce < 0) throw Error("Malformed account data.");
  const n = await bo(`/extended/v1/address/${e}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== t.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= t.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(t.balance), nonce: BigInt(t.nonce) };
}
async function B5(e) {
  const t = await bo(`/v2/accounts/${e}?proof=0`);
  return BigInt(t.balance);
}
async function N5(e, t) {
  var o, s;
  const n = await Lb("get-owner", [Ua(e), Ua(t)]), r = (n == null ? void 0 : n.success) === !0 ? (s = (o = n.value) == null ? void 0 : o.value) == null ? void 0 : s.value : null;
  if (typeof r != "string" || !Cb(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function M5(e, t) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: cf(e), signal: AbortSignal.timeout(15e3) });
  } catch {
    throw Error("Submission outcome unknown. Reconcile the saved transaction before doing anything else.");
  }
  const r = await n.json();
  if (n.status === 400 && (r == null ? void 0 : r.reason) === "FeeTooLow") {
    const o = new Error("Node rejected the fee as too low. No automatic increase. Preview a new test with another fee.");
    throw Object.assign(o, { feeRejected: !0 }), o;
  }
  if (!n.ok || typeof r != "string" || r.replace(/^0x/, "") !== t.replace(/^0x/, "")) throw Error(`Submission unconfirmed (${n.status}). Reconcile or resend the same saved transaction; do not create a replacement.`);
  return r;
}
async function _5(e) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(e)) throw Error("Invalid transaction ID.");
  const t = await fetch(`/hiro/mainnet/extended/v1/tx/${e}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (t.status === 404) return null;
  if (!t.ok) throw Error("Transaction lookup unavailable.");
  return t.json();
}
function P5(e) {
  if (!e.raw || e.raw.length > 16384 || !e.txid) throw Error("Missing or oversized signed transaction.");
  const t = Fi(cf(e.raw)), n = t.auth, r = t.payload, o = n.spendingCondition;
  if (t.version !== 0 || t.chainId !== 1 || n.authType !== 4 || o.hashMode !== 0 || Hi(Ca(Al.MainnetSingleSig, o.signer)) !== e.address || o.fee !== BigInt(e.fee) || o.nonce !== BigInt(e.nonce) || t.txid() !== e.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (t.verifyOrigin(), e.kind === "play") {
    const s = t.postConditions.values[0];
    if (r.payloadType !== 2 || Hi(r.contractAddress) + "." + r.contractName.content !== $b || r.functionName.content !== "play" || r.functionArgs.length !== 3 || vr(sn(r.functionArgs[0])) !== vr(sn(Ua(e.core))) || vr(sn(r.functionArgs[1])) !== vr(sn(Ua(e.song))) || vr(sn(r.functionArgs[2])) !== vr(sn(K6(cf(e.id)))) || e.amount !== "50" || t.postConditionMode !== ra.Deny || t.postConditions.values.length !== 1 || s.conditionType !== 0 || s.amount !== 50n || s.conditionCode !== Ka.Equal || s.principal.prefix !== 2 || Hi(s.principal.address) !== e.address) throw Error("Saved play protection or master does not match.");
  } else if (e.kind === "like") {
    if (r.payloadType !== 2 || Hi(r.contractAddress) + "." + r.contractName.content !== $5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || vr(sn(r.functionArgs[0])) !== vr(sn(Ua(e.song))) || typeof e.liked != "boolean" || vr(sn(r.functionArgs[1])) !== vr(sn(G6(e.liked))) || e.amount !== "0" || t.postConditionMode !== ra.Deny || t.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || Ur(r.recipient).value !== e.recipient || r.amount !== BigInt(e.amount)) throw Error("Saved withdrawal does not match.");
}
const U5 = "xtrata.xyz/radio/listening-wallet", O5 = "Link a temporary listening wallet for pay-per-play; no spending permission", ns = (e) => typeof e == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(e) && zi(e), H5 = (e) => ({
  domain: wr({ name: xt(U5), version: xt("1"), "chain-id": An(1) }),
  message: wr({
    purpose: xt(O5),
    main: xt(e.main),
    listening: xt(e.listening),
    issued: An(e.issued)
  })
}), Tb = 100000n, D5 = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function F5(e, t) {
  const n = e.filter((o) => !o || typeof o.sender != "string" || o.sender === t || !ns(o.sender) || !/^\d+$/.test(o.amount) ? !1 : BigInt(o.amount) >= Tb).sort(D5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((o) => o.sender)).size };
}
const Hc = 50;
function Ll(e) {
  const t = e;
  if (!t || typeof t.total != "number" || !Number.isSafeInteger(t.total) || t.total < 0 || !Array.isArray(t.results)) return null;
  const n = [];
  for (const r of t.results) {
    if (typeof (r == null ? void 0 : r.sender) != "string" || typeof r.amount != "string" || typeof r.tx_id != "string") return null;
    const o = Number(r.block_height), s = Number(r.tx_index ?? 0);
    if (!Number.isSafeInteger(o) || !Number.isSafeInteger(s)) return null;
    n.push({ sender: r.sender, amount: r.amount, txId: r.tx_id, blockHeight: o, txIndex: s });
  }
  return { total: t.total, transfers: n };
}
async function j5(e, t, n = 4) {
  if (!ns(e)) return { ok: !1 };
  try {
    const r = (i) => `/extended/v1/address/${e}/stx_inbound?limit=${Hc}&offset=${i}`, o = Ll(await t(r(0)));
    if (!o || o.total > 0 && !o.transfers.length) return { ok: !1 };
    if (o.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let s = Math.max(0, o.total - Hc);
    for (let i = 0; i < n; i++) {
      const a = s === 0 && o.total <= Hc ? o : Ll(await t(r(s)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = F5(a.transfers, e);
      if (c.ok && c.funder) return s > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (s === 0) return c;
      s = Math.max(0, s - Hc);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const vs = 50, R5 = 6, z5 = 20, xg = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function Sg(e, t) {
  const n = e;
  if (!n || typeof n.total != "number" || !Number.isSafeInteger(n.total) || n.total < 0 || !Array.isArray(n.results)) return null;
  const r = [], o = [];
  for (const s of n.results) {
    const i = s && typeof s == "object" && s.tx && typeof s.tx == "object" ? s.tx : s;
    if (!i || typeof i.tx_id != "string" || typeof i.tx_type != "string") return null;
    if (o.push(i.tx_id), i.tx_type !== "token_transfer" || i.sender_address !== t || i.tx_status !== "success") continue;
    const a = i.token_transfer;
    if (!a || typeof a.recipient_address != "string" || typeof a.amount != "string" || !/^\d+$/.test(a.amount)) return null;
    const c = Number(i.block_height), u = Number(i.tx_index ?? 0);
    if (!Number.isSafeInteger(c) || !Number.isSafeInteger(u)) return null;
    r.push({ recipient: a.recipient_address, amount: BigInt(a.amount), txId: i.tx_id, blockHeight: c, txIndex: u });
  }
  return { total: n.total, sent: r, rows: o };
}
async function G5(e, t, n) {
  if (!ns(e)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), o = Ll(await t(`/extended/v1/address/${e}/stx_inbound?limit=${vs}&offset=0`));
    if (!o || o.total > R5 * vs) return { ok: !1 };
    for (const i of o.transfers) r.set(i.txId + ":" + i.txIndex, i);
    for (let i = vs; i < o.total; i += vs) {
      const a = Ll(await t(`/extended/v1/address/${e}/stx_inbound?limit=${vs}&offset=${i}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== o.total) return { ok: !1 };
    const s = /* @__PURE__ */ new Map();
    if (n) {
      const i = (u) => `/extended/v1/address/${e}/transactions?limit=${vs}&offset=${u}`, a = Sg(await t(i(0)), e);
      if (!a || a.total > z5 * vs) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) s.set(u.txId, u);
      for (let u = vs; u < a.total; u += vs) {
        const h = Sg(await t(i(u)), e);
        if (!h || !h.rows.length) return { ok: !1 };
        for (const d of h.rows) c.add(d);
        for (const d of h.sent) s.set(d.txId, d);
      }
      if (c.size !== a.total) return { ok: !1 };
    }
    return { ok: !0, inbound: [...r.values()], outgoing: [...s.values()] };
  } catch {
    return { ok: !1 };
  }
}
function K5(e) {
  const { self: t, balance: n, gift: r } = e;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const o = [...e.inbound].filter((d) => d && typeof d.sender == "string" && d.sender !== t && /^\d+$/.test(d.amount) && BigInt(d.amount) > 0n).sort(xg).map((d, m) => {
    const w = BigInt(d.amount);
    return r && d.sender === r.sender ? { sender: d.sender, left: w, kind: "gift", to: r.payer, at: m } : ns(d.sender) && w >= Tb ? { sender: d.sender, left: w, kind: "deposit", to: d.sender, at: m } : { sender: d.sender, left: w, kind: "dust", to: null, at: m };
  }), s = o.reduce((d, m) => d + m.left, 0n), i = [...e.outgoing].filter((d) => d && d.recipient !== t && ns(d.recipient) && d.amount > 0n).sort(xg), a = i.reduce((d, m) => d + m.amount, 0n), c = s - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const u = (d, m) => {
    let w = m;
    for (const v of d) {
      if (w <= 0n) break;
      const x = v.left < w ? v.left : w;
      v.left -= x, w -= x;
    }
    return w;
  };
  for (const d of i) {
    const m = u(o.filter((w) => w.to === d.recipient), d.amount);
    m > 0n && u(o, m);
  }
  if (u(o, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (o.reduce((d, m) => d + m.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const h = /* @__PURE__ */ new Map();
  for (const d of o) {
    if (d.left <= 0n) continue;
    const m = `${d.kind}:${d.to ?? ""}`, w = h.get(m);
    w ? (w.amount += d.left, w.newest = Math.max(w.newest, d.at)) : h.set(m, { to: d.to, kind: d.kind, amount: d.left, newest: d.at });
  }
  return {
    ok: !0,
    parts: [...h.values()].sort((d, m) => d.newest - m.newest),
    hasTopUp: o.some((d) => d.kind === "deposit")
  };
}
function V5(e, t) {
  const n = e.filter((u) => u.kind === "deposit").sort((u, h) => u.newest - h.newest), r = e.find((u) => u.kind === "gift"), o = e.filter((u) => u.kind === "dust"), s = ((r == null ? void 0 : r.amount) ?? 0n) + o.reduce((u, h) => u + h.amount, 0n), i = [], a = [], c = s > t;
  return n.forEach((u, h) => {
    if (u.amount <= t) {
      a.push(u);
      return;
    }
    const d = h === n.length - 1 && !c;
    i.push({ to: u.to, kind: "deposit", mode: d ? "all" : "amount", send: u.amount - t });
  }), c ? i.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: s - t }) : (r && a.push(r), a.push(...o)), { steps: i, tooSmall: a };
}
function vg(e) {
  const t = e.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (t == null ? void 0 : t.to) ?? null;
}
const Dc = 1500n, el = [100, 250, 500], X5 = (e, t) => BigInt(e) * On(t), Aa = ["prepared", "signed", "unknown", "pending"], Y5 = 30 * 6e4, Cl = 6e4, Ci = (e) => {
  const t = e;
  return (t == null ? void 0 : t.feeRejected) === !0 || /\(400\)/.test((t == null ? void 0 : t.message) ?? "");
}, q5 = 3e3, Tl = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", Vu = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (e) => e.toString(16).padStart(2, "0")).join("");
function W5(e) {
  let t = null, n = -1 / 0, r, o = null, s = null, i, a = -1 / 0, c = null, u = null, h = !1, d = !1, m = !1, w = null, v = !1, x = "", L = "", N = 0, U, A = null, T, B = [], X, Q = -1 / 0;
  const oe = /* @__PURE__ */ new Set();
  let Y = null, b = !1, I = 0, M = null, P = null, W = !1, R = null, le = !1, ue = null, Xe = !1, C = !1, F = !1, re = !1, de = !1, Be = 0, Me = null, Ot = Promise.resolve();
  const Ge = () => BigInt((t == null ? void 0 : t.limits.playFee) ?? Rr.toString()), _e = (g) => !!s && !(s.features ?? []).includes(g), Pe = (g, k) => `xtrata.ppp.v1.${g}:${k}`, _t = "xtrata.ppp.v1.as-main", En = () => {
    if (e.main()) return;
    const g = e.store.get(_t);
    return g && ns(g) ? g : void 0;
  }, lt = () => e.main() ?? En(), Zt = (g = s == null ? void 0 : s.address) => {
    if (!g) return [];
    try {
      const k = JSON.parse(e.store.get(Pe("entries", g)) || "[]");
      return Array.isArray(k) ? k : [];
    } catch {
      return [];
    }
  }, kt = (g) => {
    const k = [g, ...Zt(g.address).filter((V) => !(V.txid === g.txid && V.kind === g.kind))].slice(0, 200);
    e.store.set(Pe("entries", g.address), JSON.stringify(k));
  }, z = (g = s == null ? void 0 : s.address) => !!g && e.store.get(Pe("on", g)) !== "0", H = (g) => {
    s != null && s.address && e.store.set(Pe("on", s.address), g ? "1" : "0");
  }, ee = () => Zt().filter((g) => Aa.includes(g.status)), se = () => Ye() ? [...ee(), ...Zt(Ze()).filter((g) => Aa.includes(g.status))] : ee(), he = () => dt(s == null ? void 0 : s.address), dt = (g) => {
    if (!g) return null;
    try {
      return JSON.parse(e.store.get(Pe("deposit", g)) || "null");
    } catch {
      return null;
    }
  }, Ne = (g, k = s == null ? void 0 : s.address) => {
    k && e.store.set(Pe("deposit", k), JSON.stringify(g));
  };
  let He = null;
  const St = (g = Cl) => {
    const k = e.now();
    He = { since: He && k < He.until ? He.since : k, until: Math.max((He == null ? void 0 : He.until) ?? 0, k + g) };
  }, Ke = () => !!He && e.now() < He.until && (i === void 0 || i < on + On(Ge())), Ie = () => !!he() || Ke(), Ze = () => _e("rootLike") ? s == null ? void 0 : s.address : (s == null ? void 0 : s.root) ?? (s == null ? void 0 : s.address), Ye = () => !!(s != null && s.address) && Ze() !== s.address, Ve = () => Ye() ? c && c.for === Ze() ? c.value : void 0 : i, Ht = () => _e("likeFee") ? x5 : b5, pn = (g) => g !== void 0 && g < on + Ht(), gn = () => ee().filter((g) => e.now() - g.created > Y5 && oe.has(g.txid)), Vn = () => (t == null ? void 0 : t.passkeyOnly) === !0 && (!lt() || r === lt() && !t.allowed), $t = () => Vn() && !(s != null && s.linked), un = () => {
    const g = lt();
    return !$t() && !!g && !!(s != null && s.linked) && s.linked !== g;
  }, Ir = (g) => Pe("return-to", g), zr = (g = s == null ? void 0 : s.address) => {
    if (!g) return;
    const k = e.store.get(Ir(g));
    return k && ns(k) && k !== g ? k : void 0;
  }, mr = (g = s == null ? void 0 : s.address) => Y && Y.for === g ? Y.res : null;
  function bt() {
    if (!(s != null && s.address)) return;
    if (s.linked) return { to: s.linked, kind: "linked" };
    const g = zr();
    if (g) return { to: g, kind: "chosen" };
    const k = mr();
    if (k != null && k.ok && k.funder) return { to: k.funder, kind: "funder" };
  }
  const yn = (g) => Pe("gift", g);
  function Dt() {
    const g = s == null ? void 0 : s.address;
    if (!g) return null;
    if ((R == null ? void 0 : R.for) === g) return R.info;
    try {
      const k = JSON.parse(e.store.get(yn(g)) || "null");
      return k && typeof k.returnTo == "string" && typeof k.treasury == "string" ? k : null;
    } catch {
      return null;
    }
  }
  const wn = () => (s == null ? void 0 : s.state) === "unlocked" ? s.root ?? s.address : ((s == null ? void 0 : s.slot) ?? 0) === 0 ? s == null ? void 0 : s.address : void 0;
  let Et = null, Vt = null, Gr = !1;
  const ds = (g) => Pe("award-claim", g), E = (g) => Pe("award-send", g), O = (g) => {
    try {
      const k = JSON.parse(e.store.get(E(g)) || "null");
      return k && typeof k.txid == "string" && e.now() - k.at < 2 * 36e5 ? k : null;
    } catch {
      return null;
    }
  }, K = (g) => {
    try {
      const k = JSON.parse(e.store.get(ds(g)) || "null");
      return k && typeof k.txid == "string" && e.now() - k.at < 2 * 36e5 ? k : null;
    } catch {
      return null;
    }
  };
  async function D(g = !1) {
    var ke;
    const k = wn();
    if (!k || !e.awardStatus || Gr) return;
    const V = (Et == null ? void 0 : Et.for) === k ? Et : null, ne = V == null ? void 0 : V.view.state, Te = ne === "not-a-player" && ((ke = Dt()) == null ? void 0 : ke.drop) === "players", q = V ? Te ? 2e4 : ne === "off" || ne === "not-a-player" ? 30 * 6e4 : K(k) || O(k) ? 2e4 : ne === "claimed" ? 10 * 6e4 : 6e4 : 0;
    if (!(V && !g && e.now() - V.at < q)) {
      Gr = !0;
      try {
        const xe = await e.awardStatus(k);
        if (Et = { for: k, view: xe, at: e.now() }, xe.state === "claimed" && e.store.set(ds(k), ""), xe.state === "claimed" && xe.holds === !1 && e.store.set(E(k), ""), xe.state === "ready" && e.awardName && (Vt == null ? void 0 : Vt.for) !== k)
          try {
            Vt = { for: k, name: await e.awardName(k), at: e.now() };
          } catch {
            Vt = { for: k, name: void 0, at: e.now() };
          }
      } catch {
        Et = { for: k, view: V && V.view.state !== "off" && V.view.state !== "not-a-player" ? { ...V.view, state: "unavailable" } : { state: "unavailable" }, at: e.now() };
      } finally {
        Gr = !1;
      }
    }
  }
  function J() {
    const g = wn();
    if (!g || (Et == null ? void 0 : Et.for) !== g) return null;
    const k = Et.view;
    if (k.state === "off" || k.state === "not-a-player") return null;
    const V = k.state === "claimed" ? null : K(g), ne = k.state === "claimed" && k.holds !== !1 ? O(g) : null;
    return { ...k, ...(Vt == null ? void 0 : Vt.for) === g ? { name: Vt.name } : {}, ...V ? { claimTx: V.txid } : {}, ...ne ? { sendTx: ne.txid } : {} };
  }
  async function te() {
    var Te;
    const g = s == null ? void 0 : s.address;
    if (!g || !e.giftInfo || !((Te = t == null ? void 0 : t.gifts) != null && Te.enabled) || le) return;
    const k = (R == null ? void 0 : R.for) === g ? R : null, V = k ? k.ok ? k.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (k && e.now() - k.at < V) return;
    le = !0;
    const ne = Dt();
    try {
      const q = await e.giftInfo(g);
      R = { for: g, info: q, ok: !0, at: e.now() }, e.store.set(yn(g), JSON.stringify(q));
    } catch {
      R = { for: g, info: ne, ok: !1, at: e.now() };
    } finally {
      le = !1;
    }
  }
  const Ce = () => Zt().reduce((g, k) => Aa.includes(k.status) ? g + BigInt(k.amount || "0") + BigInt(k.fee || "0") : g, 0n);
  function Ae() {
    if (i === void 0) return 0;
    const g = i - Ce() - BigInt(jt.length) * On(Ge());
    return g > 0n ? mg(g, Ge()) : 0;
  }
  const Fe = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", ft = "EMPTY — ADD STX TO PLAY";
  function $() {
    if (!(t != null && t.here)) return null;
    const g = (k, V) => ({ reason: k, text: V });
    switch (yt()) {
      case "connect":
      case "wrong-wallet":
        return g("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "intro":
        return g("setup", "SET UP YOUR PLAYER TO LISTEN");
      case "loading":
        return g("checking", "CHECKING YOUR LISTENING WALLET");
      case "unsupported":
        return g("unavailable", "OPEN IN A BROWSER THAT SUPPORTS PASSKEYS");
      case "not-invited":
      case "off":
        return g("unavailable", "PAID RADIO IS UNAVAILABLE");
      case "locked":
        return g("locked", "UNLOCK TO LISTEN");
      case "link":
        return g("link", "FINISH SETUP TO LISTEN");
      case "over":
        return g("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return Ie() ? g("arriving", "YOUR PLAYS ARE ARRIVING") : g("out", Ye() ? Fe : ft);
      case "ready":
        return !z() || !(s != null && s.session) || s.session.playsLeft < 1 || s.session.expires <= e.now() ? g("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : F ? Ae() < 1 ? g("out", Ye() ? Fe : ft) : null : g("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const pe = () => {
    var g;
    return !!(s != null && s.address) && Ye() && !!((g = Dt()) != null && g.player);
  };
  function ze() {
    return pe() ? { locked: !0, known: !0 } : null;
  }
  const ut = 3 * 6e4, Xt = () => !!Dt() && !!e.history && !(s != null && s.linked);
  async function Ft() {
    const g = s.address, k = Dt(), { balance: V, nonce: ne } = await e.chain.account(g), Te = await e.history(g, !0);
    if (!Te.ok) return null;
    const q = K5({ self: g, balance: V, inbound: Te.inbound, outgoing: Te.outgoing, gift: { sender: k.treasury, payer: k.returnTo } });
    if (!q.ok) return null;
    const ke = V5(q.parts, va);
    return { balance: V, nonce: ne, parts: q.parts, steps: ke.steps, tooSmall: ke.tooSmall.length };
  }
  const dn = () => Xe ? { state: "unavailable" } : !ue || e.now() - ue.at > ut || i !== void 0 && i !== ue.balance ? { state: "none" } : ue.plan;
  function yt() {
    if (!(t != null && t.enabled)) return "off";
    if (!t.here) return "elsewhere";
    const g = lt();
    if (!$t()) {
      if (!g) return "connect";
      if (!t.allowed) return "not-invited";
    }
    return s ? s.state === "unsupported" ? "unsupported" : s.state === "none" ? "intro" : un() ? "wrong-wallet" : s.state === "known" ? "locked" : !$t() && s.linked !== g ? "link" : i === void 0 ? "loading" : i > $s && !s.backedUp ? "over" : i < on + On(Ge()) ? "fund" : "ready" : "loading";
  }
  const er = () => {
    var g, k, V, ne, Te;
    return {
      step: yt(),
      busy: u,
      message: x,
      error: L,
      notice: Kr(),
      gate: t,
      main: lt(),
      mainConnected: !!e.main(),
      standIn: En(),
      listening: s == null ? void 0 : s.address,
      linked: s == null ? void 0 : s.linked,
      award: J(),
      unproven: !!(s != null && s.unproven),
      phrase: !!(s != null && s.hasBackup),
      backedUp: !!(s != null && s.backedUp),
      balance: i,
      balanceState: i === void 0 ? void 0 : ((q) => q === "over" && (s != null && s.backedUp) ? "ok" : q)(S5(i, Ge())),
      // backed up: over 1 STX reads as a healthy balance
      aboveTarget: i !== void 0 && i > $s && !!(s != null && s.backedUp),
      playsLeft: i === void 0 ? 0 : mg(i, Ge()),
      allowance: i === void 0 ? $s : Gu(i, BigInt(((g = he()) == null ? void 0 : g.amount) ?? "0")),
      session: (s == null ? void 0 : s.session) ?? null,
      payingOn: z(),
      entries: Zt(),
      depositTxid: ((k = he()) == null ? void 0 : k.txid) ?? U,
      depositPending: Ie(),
      arrival: Ie() ? { since: ((V = he()) == null ? void 0 : V.at) ?? (He == null ? void 0 : He.since) ?? e.now(), graceMs: Cl } : null,
      walletOutdated: _e("like"),
      canAnother: !!s && !_e("another"),
      canForget: !!s && !_e("forget"),
      passkeyName: s == null ? void 0 : s.passkeyName,
      hadGift: s != null && s.address && (R == null ? void 0 : R.for) === s.address && R.ok ? !!R.info : null,
      linkedListening: X && X === lt() ? B.map((q) => q.listening) : [],
      serverLinked: !!A && T === `${lt()}:${s == null ? void 0 : s.address}`,
      stuck: gn().length,
      armed: re,
      queued: jt.length,
      solo: $t(),
      returnTo: (ne = bt()) == null ? void 0 : ne.to,
      returnToKind: (Te = bt()) == null ? void 0 : Te.kind,
      funderState: (() => {
        const q = mr();
        return q ? q.ok ? q.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const q = mr();
        return !!q && q.ok && q.distinct > 1;
      })(),
      walletCannotSolo: $t() && _e("standalone"),
      walletCannotMulti: _e("multi"),
      others: ((s == null ? void 0 : s.others) ?? []).filter((q) => q !== lt() && q !== (s == null ? void 0 : s.linked)),
      creditedTo: $t() && (s != null && s.address) && (M == null ? void 0 : M.for) === s.address && M.main ? M.main : void 0,
      createdHere: !!(s != null && s.address) && e.store.get(Pe("created", s.address)) === "1",
      brandNew: !!(s != null && s.address) && i === 0n && (P == null ? void 0 : P.for) === s.address && P.unused,
      gift: (() => {
        const q = Dt();
        return q ? { player: q.player, from: q.from, source: q.source, amount: q.amount, ...q.drop !== void 0 ? { drop: q.drop } : {} } : null;
      })(),
      giftPlays: Dt() ? Ae() : 0,
      playCost: On(Ge()),
      giftStop: $(),
      albumLock: ze(),
      returnPlan: dn(),
      slot: (s == null ? void 0 : s.state) === "unlocked" ? s.slot ?? 0 : 0,
      root: (s == null ? void 0 : s.state) === "unlocked" ? s.root ?? s.address : void 0,
      walletCannotAlbums: _e("slots"),
      likeFunds: (() => {
        var xe;
        const q = Ze();
        if (!q || (s == null ? void 0 : s.state) !== "unlocked") return null;
        const ke = Ve();
        return { address: q, balance: ke, low: pn(ke), album: Ye(), pending: !!dt(q), txid: (xe = dt(q)) == null ? void 0 : xe.txid, main: lt() };
      })()
    };
  }, Kr = () => N ? N < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", ve = (g, k = "") => {
    x = g, L = k, e.changed();
  };
  async function Jt(g, k) {
    if (!u) {
      u = g, L = "", e.changed();
      try {
        await k();
      } catch (V) {
        const ne = V instanceof Error ? V.message : String(V);
        L = /Cancelled in the listening wallet/.test(ne) ? "" : ne, L || (x = "Not now. Nothing was signed.", de = !0);
      } finally {
        u = null, await Yn(!0);
      }
    }
  }
  const Ao = () => !!(t != null && t.enabled) && t.here && ($t() || !!lt() && t.allowed), tr = () => Ao() && !un(), Eo = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", Xn = () => {
    if (un()) throw new Error(Eo());
  };
  async function Nn() {
    if (!Ao()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(t != null && t.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return o ?? (o = await e.bridge(t.walletOrigin)), o;
  }
  const mn = (g) => {
    const k = lt();
    return g.request("listening.status", k ? { main: k } : void 0);
  };
  async function Ns(g = !1) {
    s != null && s.address && (!g && e.now() - a < 3e4 || (i = await e.chain.balance(s.address), a = e.now(), await ko(g)));
  }
  async function ko(g = !1) {
    const k = Ze();
    if (!(!Ye() || !k || (s == null ? void 0 : s.state) !== "unlocked") && !(!g && (c == null ? void 0 : c.for) === k && e.now() - c.at < 3e4))
      try {
        c = { for: k, value: await e.chain.balance(k), at: e.now() };
      } catch {
      }
  }
  async function wi(g) {
    if ((X !== g || e.now() - Q >= 6e4) && (B = await e.links(g), X = g, Q = e.now()), (s == null ? void 0 : s.state) !== "unlocked" || s.linked === g) return;
    const k = `${g}:${s.address}`;
    T === k && A || (A = B.find((V) => V.listening === s.address) ?? null, T = k);
  }
  async function Mn() {
    const g = s == null ? void 0 : s.address;
    if (!$t() || !g || s != null && s.linked || !e.funder || b || !i || i <= 0n) return;
    const k = mr(g);
    if (k != null && k.ok && k.funder) return;
    const V = k != null && k.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, I - 1), 30 * 6e4);
    if (!(Y && Y.for === g && e.now() - Y.at < V)) {
      b = !0;
      try {
        Y = { for: g, res: await e.funder(g), at: e.now() };
      } catch {
        Y = { for: g, res: { ok: !1 }, at: e.now() };
      } finally {
        b = !1;
      }
      I = Y.res.ok ? 0 : I + 1;
    }
  }
  async function nr() {
    const g = s == null ? void 0 : s.address;
    if (!(!$t() || !g || s != null && s.linked || !e.mainOf || W) && !(M && M.for === g && (M.ok || e.now() - M.at < 6e4))) {
      W = !0;
      try {
        M = { for: g, main: await e.mainOf(g), ok: !0, at: e.now() };
      } catch {
        M = { for: g, main: null, ok: !1, at: e.now() };
      } finally {
        W = !1;
      }
    }
  }
  async function fs() {
    const g = s == null ? void 0 : s.address;
    if (!(!g || (s == null ? void 0 : s.state) !== "unlocked" || i !== 0n || (P == null ? void 0 : P.for) === g) && e.store.get(Pe("created", g)) !== "1")
      try {
        P = { for: g, unused: await e.chain.confirmedNonce(g) === 0n };
      } catch {
      }
  }
  async function Vr() {
    var Te;
    const g = s == null ? void 0 : s.address;
    if (!g) return !1;
    let k, V = !1;
    const ne = /* @__PURE__ */ new Map();
    for (const q of se())
      try {
        const ke = await e.chain.transaction(q.txid);
        if (!ke) {
          if (oe.add(q.txid), e.now() - q.created > 15 * 6e4 && !ne.has(q.address) && ne.set(q.address, await e.chain.confirmedNonce(q.address)), k = ne.get(q.address), k !== void 0 && k > BigInt(q.nonce)) {
            kt({ ...q, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((q.status === "unknown" || q.status === "signed") && q.raw)
            try {
              await e.chain.broadcast(q.raw, q.txid), kt({ ...q, status: "pending" });
            } catch ($e) {
              Ci($e) && kt({ ...q, status: "failed", note: $e.message, raw: void 0 });
            }
          continue;
        }
        oe.delete(q.txid);
        const xe = String(ke.tx_status);
        if (xe === "success" && ke.canonical !== !1 && ke.is_unanchored === !1) {
          if (kt({ ...q, status: "confirmed", confirmedAt: e.now(), actualFee: String(ke.fee_rate ?? q.fee), raw: void 0 }), V = !0, q.kind === "like" && (v = !0, q.status !== "confirmed" && typeof q.liked == "boolean"))
            try {
              (Te = e.likeConfirmed) == null || Te.call(e, q.song, q.liked);
            } catch {
            }
        } else xe.startsWith("abort_") || xe.startsWith("dropped_") ? kt({ ...q, status: "failed", note: xe, raw: void 0 }) : q.status !== "pending" && kt({ ...q, status: "pending" });
      } catch {
      }
    for (const q of Ye() ? [g, Ze()] : [g]) {
      const ke = dt(q);
      if (ke)
        try {
          const xe = await e.chain.transaction(ke.txid), $e = String((xe == null ? void 0 : xe.tx_status) ?? "");
          ($e === "success" && xe.is_unanchored === !1 || $e.startsWith("abort_") || $e.startsWith("dropped_") || !xe && e.now() - ke.at > 2 * 36e5) && (Ne(null, q), $e === "success" && St(2e4), a = -1 / 0, c = null, /on its way/i.test(x) && (x = ""));
        } catch {
        }
    }
    return V;
  }
  async function Yn(g = !1) {
    var k;
    try {
      const V = lt();
      if ((g || !t || r !== V || e.now() - n > 3e5) && (t = await e.config(V), n = e.now(), r = V), !t.enabled || !t.here || !$t() && (!V || !t.allowed)) {
        o && (s != null && s.session) && await o.request("listening.stop").catch(() => {
        }), re && Ms(), e.changed();
        return;
      }
      await Nn(), s = await mn(o), un() && s.state === "unlocked" && (Yr(), await o.request("listening.lock").catch(() => {
      }), i = void 0, s = await mn(o)), V && t.allowed && await wi(V), await Ns(g), await Mn(), await nr(), await fs(), await te(), await D(), await Vr() && await Ns(!0), await ko(), await bi(), N = 0;
    } catch {
      N++;
    }
    if (yt() === "locked" ? hs() : re && Ms(), v) {
      v = !1;
      try {
        (k = e.likesChanged) == null || k.call(e);
      } catch {
      }
    }
    e.changed(), jt.length && !Os && Dn();
  }
  async function $o(g) {
    const k = s == null ? void 0 : s.root;
    if (!k || s != null && s.slot || !(s != null && s.address) || _e("slots")) return;
    const V = Number(e.store.get(Pe("slot", k)));
    if (!(!Number.isSafeInteger(V) || V < 1))
      try {
        const { balance: ne } = await e.chain.account(s.address);
        if (ne >= on + On(Ge())) return;
        await g.request("listening.openSlot", { slot: V }), s = await mn(g), i = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function Io(g, k) {
    var q;
    Xn();
    const V = !(s != null && s.address) || z(s.address), ne = s != null && s.linked ? (q = e.nameOf) == null ? void 0 : q.call(e, s.linked) : void 0;
    await g.request("listening.unlock", { mode: "unlock", terms: V ? ps() : void 0, anyPasskey: k, ...lt() ? { main: lt() } : {}, ...ne ? { label: ne } : {} }), s = await mn(g), V && (z(s.address) ? await ln() : await g.request("listening.stop")), await $o(g), ve(V ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const Te = w;
    w = null, Te && e.now() - Te.at < 12e4 && setTimeout(() => void Yn(!0).then(() => ms(Te)), 0);
  }
  function hs() {
    re || u || de || Be >= 3 || !o || !(s != null && s.address) || (re = !0, Ot = (async () => {
      try {
        await Io(o, !1), Be = 0;
      } catch (g) {
        const k = g instanceof Error ? g.message : String(g);
        /Cancelled in the listening wallet/.test(k) ? Me || (de = !0, ve("Not now. Nothing was signed.")) : /did not answer/.test(k) ? await (o == null ? void 0 : o.request("listening.cancel").catch(() => {
        })) : (Be++, L = k);
      } finally {
        re = !1;
        const g = Me;
        Me = null, g ? await g() : await Yn(!0);
      }
    })());
  }
  async function Ms(g) {
    re && (Me = async () => {
    }, await (o == null ? void 0 : o.request("listening.cancel").catch(() => {
    })), await Ot), g && await g(), e.changed();
  }
  const ps = () => ({
    fee: Ge().toString(),
    maxPlays: t.limits.maxSessionPlays,
    budget: $s.toString(),
    expires: e.now() + t.limits.sessionHours * 36e5
  });
  async function ln() {
    if (!(s != null && s.address)) return !1;
    if (F || (F = await e.tabLock(s.address)), !F)
      throw await (o == null ? void 0 : o.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function gs(g, k) {
    const V = s.address, { balance: ne, nonce: Te } = k ?? await e.chain.account(V);
    i = ne;
    const q = await o.request("listening.prepareReturn", {
      mode: g.mode,
      balance: ne.toString(),
      nonce: Te.toString(),
      fee: va.toString(),
      ...g.amount !== void 0 ? { amount: g.amount.toString() } : {},
      ...g.linked ? {} : { destination: g.to }
    });
    if (q.recipient !== g.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const ke = g.mode === "amount" ? g.amount : g.mode === "all" ? ne - va : ne - $s - va, xe = Fi(q.raw);
    if (Ur(xe.payload.recipient).value !== g.to || String(xe.payload.amount) !== q.amount || ke !== void 0 && q.amount !== ke.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const $e = {
      id: Vu(),
      address: V,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: q.recipient,
      amount: q.amount,
      fee: q.fee,
      nonce: Te.toString(),
      created: e.now(),
      status: "signed",
      raw: q.raw,
      txid: q.txid
    };
    e.validate($e), kt($e);
    try {
      await e.chain.broadcast(q.raw, q.txid), kt({ ...$e, status: "pending" });
    } catch (st) {
      throw kt({ ...$e, status: "unknown", note: st.message }), st;
    }
    return q;
  }
  const mi = lu, Lo = va;
  async function _s(g, k, V) {
    if ((s == null ? void 0 : s.state) !== "unlocked" || !s.address) throw new Error("Unlock the listening wallet first.");
    if (_e("slots") || _e("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const ne = s.slot ?? 0;
    if (g === k || ![g, k].includes(ne) || ![g, k].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const Te = s.root ?? s.address, q = g === 0 ? Te : s.address, ke = k === 0 ? Te : s.address, { balance: xe, nonce: $e } = await e.chain.account(q);
    if (xe < V + Lo + on) throw new Error(g === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const st = await o.request("listening.signMove", { from: g, to: k, amount: V.toString(), fee: Lo.toString(), nonce: $e.toString(), balance: xe.toString() }), S = Fi(st.raw);
    if (st.from !== q || st.to !== ke || st.amount !== V.toString() || Ur(S.payload.recipient).value !== ke || String(S.payload.amount) !== V.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const _ = {
      id: Vu(),
      address: q,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: ke,
      amount: st.amount,
      fee: st.fee,
      nonce: $e.toString(),
      created: e.now(),
      status: "signed",
      raw: st.raw,
      txid: st.txid
    };
    e.validate(_), kt(_);
    try {
      await e.chain.broadcast(st.raw, st.txid), kt({ ..._, status: "pending" });
    } catch (G) {
      throw kt({ ..._, status: "unknown", note: G.message }), G;
    }
    return Ne({ txid: st.txid, amount: st.amount, at: e.now() }, ke), ke === Te && Te !== s.address ? c = null : a = -1 / 0, st;
  }
  let Ps = !1;
  const ys = /* @__PURE__ */ new Map(), ws = (g) => Pe("float", g);
  async function bi() {
    if (Ps || (s == null ? void 0 : s.state) !== "unlocked" || !Ye() || _e("move") || _e("rootLike") || !s.address) return;
    const g = s.address;
    if (e.store.get(ws(g)) === "1") return;
    const k = Dt();
    if (!(k != null && k.player) || k.state !== "arrived") return;
    const V = Ve();
    if (V === void 0 || i === void 0) return;
    if (!pn(V)) {
      e.store.set(ws(g), "1");
      return;
    }
    if (dt(Ze()) || Hs() || se().length || i < mi * 4n + on + Lo) return;
    const ne = ys.get(g);
    if (!(ne && (ne.n >= 3 || e.now() - ne.at < 5 * 6e4))) {
      Ps = !0, ys.set(g, { n: ((ne == null ? void 0 : ne.n) ?? 0) + 1, at: e.now() });
      try {
        await _s(s.slot ?? 0, 0, mi), e.store.set(ws(g), "1");
      } catch (Te) {
        console.warn("[radio] likes float not sent yet", Te);
      } finally {
        Ps = !1;
      }
    }
  }
  async function Us(g) {
    if (ee().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (_e("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const k = await Ft().catch(() => null);
    if (!k)
      throw ue = null, Xe = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    Xe = !1, i = k.balance;
    const V = { balance: k.balance, nonce: k.nonce };
    if (g === "excess") {
      const xe = vg(k.parts) ?? zr();
      if (!xe) throw new Error("Choose where to send the excess first.");
      await gs({ mode: "excess", to: xe, linked: !1 }, V), ue = null, ve("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const ne = k.steps;
    if (!ne.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!ue && ue.balance === k.balance && e.now() - ue.at <= ut && ue.steps.length === ne.length && ue.steps.every((xe, $e) => xe.to === ne[$e].to && xe.mode === ne[$e].mode && xe.send === ne[$e].send))) {
      ue = {
        at: e.now(),
        balance: k.balance,
        steps: ne,
        parts: k.parts,
        plan: { state: "ready", steps: ne.map((xe) => ({ to: xe.to, kind: xe.kind, send: xe.send.toString() })), kept: k.tooSmall, excess: vg(k.parts) }
      }, ve(ne.length > 1 ? `This goes back in ${ne.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const q = ne[0], ke = q.to ?? zr();
    if (!ke) throw new Error("Choose where to send the rest first.");
    if (q.mode === "amount" && _e("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await gs({ mode: q.mode, to: ke, linked: !1, ...q.mode === "amount" ? { amount: q.send } : {} }, V), ue = null, ne.length === 1 ? (H(!1), ve("Returned ✓ Paying is off.")) : ve(`Returned ✓ ${ne.length - 1} more ${ne.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  async function Xr() {
    if (!(s != null && s.unproven)) return;
    const g = await Nn();
    await g.request("listening.prove"), s = await mn(g);
  }
  const Lr = {
    forceRefresh: () => Yn(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (g) => {
      if (!e.main() && !(g !== null && !ns(g))) {
        if (g === En()) return Yn(!0);
        e.store.set(_t, g ?? ""), L = "", x = "", i = void 0, a = -1 / 0, c = null, await Yn(!0);
      }
    },
    /**
     * Remove the open player from this device (the wallet box asks in its own panel; the passkey is not touched). Only
     * the listener's own player, only when it is empty and nothing is on its way: checked here as well as on the page.
     */
    forget: () => Jt("Check the listening wallet…", async () => {
      const g = await Nn();
      if (_e("forget")) throw new Error("The listening wallet box needs an update before it can do this. Try again shortly.");
      if ((s == null ? void 0 : s.state) !== "unlocked" || (s.slot ?? 0) !== 0) throw new Error("Unlock your own player first.");
      if (i === void 0) throw new Error("Could not read what this player holds. Nothing was removed.");
      if (i > BigInt((t == null ? void 0 : t.limits.returnFee) ?? "3000")) throw new Error("Empty this player first. Nothing was removed.");
      if (ee().length) throw new Error("Wait for the pending payment to confirm. Nothing was removed.");
      Yr(), await g.request("listening.forget"), i = void 0, s = await mn(g), H(!1), ve("Removed from this device ✓");
    }),
    /** `quick`: a free starter player is being claimed, so the wallet box may put off its second passkey check. */
    create: (g) => Jt("Waiting for your passkey…", async () => {
      const k = await Nn(), V = !!(g != null && g.another) && !e.main() && !_e("another");
      V && (s == null ? void 0 : s.state) === "unlocked" && await k.request("listening.lock"), await k.request("listening.unlock", { mode: "create", terms: ps(), ...e.main() ? { main: e.main() } : {}, ...g != null && g.quick && !e.main() ? { quick: !0 } : {}, ...V ? { another: !0 } : {} }), s = await mn(k), s.address && e.store.set(Pe("created", s.address), "1"), H(!0), ve($t() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await ln();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** The intro song has started for someone claiming a new player: its play waits for the plays to land (30 minutes at most). */
    holdFirstPlay: () => {
      Co = e.now() + xi;
    },
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (g) => {
      g ? St() : He = null, e.changed();
    },
    giftSent: (g, k) => {
      !(s != null && s.address) || he() || (Ne({ txid: g, amount: k.toString(), at: e.now() }), a = -1 / 0, R = null, Et && (Et = { ...Et, at: -1 / 0 }), ve("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (g) => {
      if (Xn(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (_e("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await Nn()).request("listening.bindSlot", { slot: g, issued: e.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (g, k, V, ne) => {
      Ne({ txid: V, amount: ne.toString(), at: e.now() }, k), R = null, await Lr.openAlbum(g), ve("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (g) => Jt("Opening…", async () => {
      if (Xn(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (_e("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (h || d || m) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((s.slot ?? 0) === g) return;
      Yr(), await o.request("listening.openSlot", { slot: g }), s = await mn(o), i = void 0, a = -1 / 0, ue = null, Xe = !1;
      const k = s.root;
      k && g > 0 && e.store.set(Pe("slot", k), String(g)), ve(g === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (g = !1) => {
      const k = () => Jt("Waiting for your passkey…", async () => Io(await Nn(), g));
      return re ? g ? _e("cancel") ? (ve("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Ms(async () => {
        (yt() === "locked" || yt() === "intro") && await k();
      }) : Ot : k();
    },
    link: () => Jt("Sign in your wallet…", async () => {
      Xn();
      const g = e.main();
      if (!g || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      const k = (await e.links(g)).find((V) => V.listening === s.address);
      if (k)
        await o.request("listening.link", { main: g, issued: k.issued, mainSignature: k.mainSignature });
      else {
        const V = { main: g, listening: s.address, issued: e.now() }, ne = await e.signWithMain(g, H5(V)), Te = await o.request("listening.link", { main: g, issued: V.issued, mainSignature: ne });
        await e.saveLink({ ...V, mainSignature: ne, listeningSignature: Te.listeningSignature }), Q = -1 / 0;
      }
      ve("Linked ✓");
    }),
    /**
     * Before the listener adds anything of their own: a starter player whose passkey was checked once gets its second
     * check now. Resolves true once the wallet is proven (or always was); false if the check failed or was closed.
     */
    prove: async () => s != null && s.unproven ? (await Jt("One more passkey check…", Xr), !(s != null && s.unproven)) : !0,
    deposit: () => Jt("Approve the deposit in your wallet…", async () => {
      Xn(), await Xr();
      const g = e.main();
      if (!g || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      if (he()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (Ke()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await Ns(!0);
      const k = Gu(i ?? 0n);
      if (k <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      U = await e.deposit(g, s.address, k), U && Ne({ txid: U, amount: k.toString(), at: e.now() }), ve("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => Jt("Approve the top-up in your wallet…", async () => {
      Xn(), await Xr();
      const g = e.main(), k = Ze();
      if (!g || !k) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (dt(k)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const V = await e.chain.balance(k);
      Ye() ? c = { for: k, value: V, at: e.now() } : (i = V, a = e.now());
      const ne = Gu(V);
      if (ne <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const Te = await e.deposit(g, k, ne);
      Te && Ne({ txid: Te, amount: ne.toString(), at: e.now() }, k), ve("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (g) => Jt("Adding plays…", async () => {
      if (Xn(), !Ye()) throw new Error("Open the album you want to add plays to first.");
      if (!el.includes(g)) throw new Error("Choose one of the amounts offered.");
      const k = X5(g, Ge());
      if (h || d || m) throw new Error("Still sending a payment. Try again in a moment.");
      if (se().length || he()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await _s(0, s.slot ?? 0, k), ve("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => Jt("Confirm in the listening wallet…", async () => {
      if (!tr()) throw new Error("Connect your wallet first.");
      await ln(), await o.request("listening.approveSession", ps()), H(!0), ve("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => Jt("Clearing…", async () => {
      for (const g of gn())
        await e.chain.transaction(g.txid) || kt({ ...g, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      ve("Cleared ✓");
    }),
    switchOff: () => Jt("Switching off…", async () => {
      Yr(), await (o == null ? void 0 : o.request("listening.stop")), H(!1), ve("Music support is off. Playback is paused.");
    }),
    /**
     * Write down the backup words. The wallet box shows them and asks three back; this page never sees a word, only
     * that it was done. For a player that has a phrase, while it is open.
     */
    backup: () => Jt("Showing your backup words in the box…", async () => {
      if (!(s != null && s.hasBackup)) throw new Error("This player was made before backup words existed, so it has none.");
      const g = await Nn();
      await g.request("listening.backup"), s = await mn(g), ve("Backed up ✓ Keep those 24 words somewhere safe and private.");
    }),
    /**
     * The open player signs a request about the albums it keeps (releases.ts). No panel: it is a structured message
     * that can move nothing. Rejects when the player is locked or the wallet box is too old.
     */
    signShelf: async (g, k) => {
      if ((s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock your player first.");
      if (_e("shelf")) throw new Error("The listening wallet box needs an update before it can keep albums. Try again shortly.");
      return (await Nn()).request("listening.signShelf", { action: g, ...k ? { release: k } : {} });
    },
    /** Ask again where the player's record stands, and what name it would carry (after linking a wallet, say). */
    awardRefresh: async () => {
      Vt = null, await D(!0), e.changed();
    },
    /**
     * Claim the player's Music Hero record. The server signs the record (with the name, or the address alone); the
     * wallet box reads it, shows it and signs the claim; this page sends it. The player pays the network fee only.
     */
    claimAward: (g) => Jt("Confirm in the listening wallet…", async () => {
      var $e, st, S, _;
      const k = wn();
      if ((s == null ? void 0 : s.state) !== "unlocked" || !k) throw new Error("Unlock your player first.");
      if (!e.awardNote) throw new Error("Awards are not available here.");
      if (_e("award")) throw new Error("The listening wallet box needs an update before it can claim a record. Try again shortly.");
      if (K(k)) throw new Error("Your claim is already on its way. It usually confirms in a minute or two.");
      if (h || d || m || se().length) throw new Error("A payment is still confirming. Claim as soon as it has.");
      await ln();
      const V = await e.awardNote(k, g), { balance: ne, nonce: Te } = await e.chain.account(k);
      if (ne < Dc) throw new Error("Your player needs a little STX for the network fee to claim. Add plays first.");
      const ke = await (await Nn()).request("listening.signAward", {
        cls: V.cls,
        number: V.number,
        plays: V.plays,
        record: V.record,
        signature: V.signature,
        fee: Dc.toString(),
        nonce: Te.toString(),
        balance: ne.toString()
      }), xe = Fi(ke.raw);
      if (ke.hero !== k || ke.number !== V.number || ((st = ($e = xe.payload) == null ? void 0 : $e.functionName) == null ? void 0 : st.content) !== "claim" || ((_ = (S = xe.payload) == null ? void 0 : S.contractName) == null ? void 0 : _.content) !== I5.split(".")[1])
        throw new Error("The signed claim does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(ke.raw, ke.txid), e.store.set(ds(k), JSON.stringify({ txid: ke.txid, at: e.now() })), a = -1 / 0, Et && (Et = { ...Et, at: -1 / 0 }), ve("Record claimed ✓ It is being made now: about a minute.");
    }),
    /**
     * Send the player's claimed record to another address. The wallet box shows the inscription and the full address
     * and the listener confirms there; the transaction can move that one inscription and nothing else.
     */
    sendAward: (g) => Jt("Confirm in the listening wallet…", async () => {
      var st, S, _;
      const k = wn(), V = J();
      if ((s == null ? void 0 : s.state) !== "unlocked" || !k) throw new Error("Unlock your player first.");
      if ((V == null ? void 0 : V.state) !== "claimed" || V.inscription === void 0) throw new Error("There is no record to send yet.");
      if (V.holds === !1) throw new Error("This record has already been sent.");
      if (V.holds !== !0) throw new Error("Could not check that your player still holds the record. Try again shortly.");
      if (O(k)) throw new Error("Your record is already on its way.");
      const ne = g.trim();
      if (!ns(ne)) throw new Error("Enter a Stacks address starting SP. A .btc name will not work here.");
      if (ne === k) throw new Error("That is your player itself. Enter the address to send it to.");
      if (_e("sendRecord")) throw new Error("The listening wallet box needs an update before it can send a record. Try again shortly.");
      if (h || d || m || se().length) throw new Error("A payment is still confirming. Send as soon as it has.");
      await ln();
      const { balance: Te, nonce: q } = await e.chain.account(k);
      if (Te < Dc) throw new Error("Your player needs a little STX for the network fee. Add plays first.");
      const xe = await (await Nn()).request("listening.signSendRecord", { inscription: V.inscription, recipient: ne, fee: Dc.toString(), nonce: q.toString(), balance: Te.toString() }), $e = Fi(xe.raw);
      if (xe.from !== k || xe.recipient !== ne || xe.inscription !== V.inscription || ((S = (st = $e.payload) == null ? void 0 : st.functionName) == null ? void 0 : S.content) !== "transfer" || Ur((_ = $e.payload.functionArgs) == null ? void 0 : _[2]).value !== ne)
        throw new Error("The signed send does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(xe.raw, xe.txid), e.store.set(E(k), JSON.stringify({ txid: xe.txid, at: e.now() })), a = -1 / 0, Et && (Et = { ...Et, at: -1 / 0 }), ve("Record sent ✓ It arrives in a minute or two.");
    }),
    lock: () => Jt("Locking…", async () => {
      Yr(), await (o == null ? void 0 : o.request("listening.lock")), i = void 0, ve("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (g) => {
      const k = String(g ?? "").trim();
      if (!(s != null && s.address)) return ve("", "Unlock the listening wallet first.");
      if (!ns(k)) return ve("", "Enter a standard mainnet address (it starts with SP).");
      if (k === s.address) return ve("", "That is this listening wallet itself. Enter a different address.");
      e.store.set(Ir(s.address), k), ve("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      s != null && s.address && e.store.set(Ir(s.address), ""), e.changed();
    },
    returnFunds: (g) => Jt("Check the return in the listening wallet…", async () => {
      if (!tr()) throw new Error("Connect your wallet first.");
      if (!(s != null && s.address)) throw new Error("Unlock the listening wallet first.");
      if (Xt()) return Us(g);
      const k = bt();
      if (!k) throw new Error($t() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (k.kind !== "linked" && _e("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (ee().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await gs({ mode: g, to: k.to, linked: k.kind === "linked" }), g === "all" && H(!1), ve(g === "all" ? k.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, jt = [], rr = 10, xi = 30 * 6e4;
  let Os = !1, Co = 0;
  const ga = (g) => e.now() < Co && (g === "intro" || g === "locked" || g === "link" || g === "fund" && Ie()), Hs = () => h || !!u || d || m, Yr = () => {
    jt.length && (jt.length = 0, e.changed());
  };
  async function Si(g) {
    if (!jt.some((k) => k.id === g.id) && !Zt().some((k) => k.id === g.id) && (jt.push({ ...g, at: e.now() }), jt.length > rr && jt.shift()), Hs() || ee().length) {
      const k = jt.length;
      x = `Queued ${k === 1 ? "this song" : k + " songs"}: paid as soon as the wallet is free.`, e.changed();
    }
    await Dn();
  }
  async function Dn() {
    if (!Os) {
      Os = !0;
      try {
        for (; jt.length; ) {
          for (; jt.length && e.now() - jt[0].at > xi; ) jt.shift();
          if (!jt.length || Hs() || await vi(jt[0]) === "wait") return;
          jt.shift();
        }
      } finally {
        Os = !1, e.changed();
      }
    }
  }
  async function vi(g) {
    var k;
    h = !0;
    try {
      await Yn();
      const V = yt();
      if (V === "loading" || ga(V)) return "wait";
      if (V !== "ready" || !z() || !(s != null && s.session) || s.session.playsLeft < 1 || !F) return "done";
      if (ee().length) return "wait";
      C || (await e.chain.verify(), C = !0);
      const ne = s.address, { balance: Te, nonce: q } = await e.chain.account(ne);
      i = Te, a = e.now();
      const ke = await e.chain.owner(Ku, g.song);
      if (ke === ne || ke === lt()) return "done";
      const xe = await o.request("listening.signPlay", {
        core: Ku,
        song: g.song,
        receipt: g.id,
        fee: Ge().toString(),
        nonce: q.toString(),
        balance: Te.toString()
      }), $e = {
        id: g.id,
        address: ne,
        kind: "play",
        core: Ku,
        song: g.song,
        recipient: ke,
        amount: "50",
        fee: Ge().toString(),
        nonce: q.toString(),
        created: e.now(),
        status: "signed",
        raw: xe.raw,
        txid: xe.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...g.title ? { title: String(g.title).slice(0, 120) } : {},
        ...g.artist ? { artist: String(g.artist).slice(0, 120) } : {}
      };
      e.validate($e), kt($e);
      const st = g.title ? `“${g.title}”${g.artist ? ` by ${g.artist}` : ""}` : `song #${g.song}`;
      try {
        await e.chain.broadcast(xe.raw, xe.txid), kt({ ...$e, status: "pending" }), x = `♪ Paid ${st}`, L = "";
      } catch (S) {
        kt({ ...$e, status: Ci(S) ? "failed" : "unknown", note: S.message, ...Ci(S) ? { raw: void 0 } : {} }), L = S.message;
      }
      return s = await mn(o), "done";
    } catch (V) {
      const ne = V instanceof Error ? V.message : "payment unavailable";
      return (k = Dt()) != null && k.player ? (x = "Payment is taking a moment: " + ne, "wait") : (x = "This song played free: " + ne, "done");
    } finally {
      h = !1, e.changed();
    }
  }
  function To(g) {
    return !(t != null && t.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(yt()) || _e("like") ? !1 : (ms(g), !0);
  }
  async function ms(g) {
    const k = g.title ? `“${g.title}”` : `song #${g.song}`, V = (me) => {
      var Rt;
      L = me, x = "";
      try {
        (Rt = e.likeFailed) == null || Rt.call(e, g.song);
      } catch {
      }
      e.changed();
    }, ne = Ye(), Te = yt(), q = lt(), ke = ne && (Te === "fund" || Te === "over") ? "ready" : Te, xe = $t() ? Ze() : q;
    if (ke === "locked") {
      w = { ...g, at: e.now() }, ve(`Unlock to like ${k}. It sends straight after.`);
      return;
    }
    if (ke === "wrong-wallet") return V(Eo());
    if (ke === "link") return V("Link the listening wallet to your main wallet first, so your likes count for it.");
    if ($t() && _e("standalone")) return V("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (ke === "fund") return V("Top up the listening wallet to like: each like or unlike costs 0.0003 STX.");
    if (ke === "over") return V("Return the excess first: the listening wallet holds more than 1 STX.");
    if (ne) {
      await ko(!0);
      const me = Ve();
      if (pn(me))
        return e.changed(), V(Tl);
    }
    if (ke !== "ready" || !xe) return V("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(s != null && s.session)) return V("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!F) return V("Pay-per-play is running in another tab. Like from that tab.");
    const $e = Zt(Ze()).find((me) => me.kind === "like" && me.song === g.song);
    if ($e && Aa.includes($e.status))
      return V(`Your last like for ${k} is still on its way. It can change again once it confirms.`);
    if (d) return V("One like at a time: your last one is still being sent.");
    if (($e == null ? void 0 : $e.status) === "confirmed" && e.now() - ($e.confirmedAt ?? 0) < q5)
      return V(`Your like for ${k} has only just confirmed. Try again in a moment.`);
    let st;
    m = !0;
    try {
      st = e.likeState ? (await e.likeState(xe, g.song)).by : g.likedBy ?? [];
    } catch {
      st = g.likedBy;
    } finally {
      m = !1;
    }
    if (!st) return V(`Could not check ${k} right now. Try the heart again.`);
    const S = Ze(), G = (($e == null ? void 0 : $e.status) === "confirmed" && typeof $e.liked == "boolean" && e.now() - ($e.confirmedAt ?? $e.created) < 5 * 6e4 ? $e.liked : void 0) ?? st.includes(S);
    if (!G && st.some((me) => me !== S)) return V($t() ? `${k} was liked from another wallet of yours. Unlike it there.` : `${k} was liked from your main wallet${st.includes(q) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await Bo({ song: g.song, liked: !G, title: g.title, artist: g.artist });
  }
  async function Bo(g) {
    var ne, Te, q;
    if (d) {
      ve("Still sending your last like. Try again in a moment.");
      return;
    }
    d = !0;
    const k = g.title ? `“${g.title}”${g.artist ? ` by ${g.artist}` : ""}` : `song #${g.song}`, V = e.wait ?? ((ke) => new Promise((xe) => setTimeout(xe, ke)));
    try {
      ve(`${g.liked ? "Liking" : "Unliking"} ${k}…`);
      const ke = e.now() + 12e4;
      for (; h || (Ye() ? Zt(Ze()).some((G) => Aa.includes(G.status)) : ee().length); ) {
        if (e.now() > ke) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await V(5e3), await Yn(!0);
      }
      if (!Ye() && yt() !== "ready" || (s == null ? void 0 : s.state) !== "unlocked" || !s.session) throw new Error("Paying stopped before the like was sent.");
      const xe = Ze(), { balance: $e, nonce: st } = await e.chain.account(xe);
      if (Ye() ? c = { for: xe, value: $e, at: e.now() } : (i = $e, a = e.now()), pn($e)) throw new Error(Tl);
      const S = await o.request("listening.signLike", {
        song: g.song,
        liked: g.liked,
        fee: Ht().toString(),
        nonce: st.toString(),
        balance: $e.toString()
      }), _ = {
        id: Vu(),
        address: xe,
        kind: "like",
        core: 0,
        song: g.song,
        liked: g.liked,
        recipient: "",
        amount: "0",
        fee: Ht().toString(),
        nonce: st.toString(),
        created: e.now(),
        status: "signed",
        raw: S.raw,
        txid: S.txid,
        ...g.title ? { title: String(g.title).slice(0, 120) } : {},
        ...g.artist ? { artist: String(g.artist).slice(0, 120) } : {}
      };
      e.validate(_), kt(_);
      try {
        await e.chain.broadcast(S.raw, S.txid), kt({ ..._, status: "pending" }), x = `${g.liked ? "♥ Liked" : "Unliked"} ${k}`, L = "";
        try {
          (ne = e.likeSent) == null || ne.call(e, g.song, g.liked);
        } catch {
        }
      } catch (G) {
        if (kt({ ..._, status: Ci(G) ? "failed" : "unknown", note: G.message, ...Ci(G) ? { raw: void 0 } : {} }), L = G.message, Ci(G)) try {
          (Te = e.likeFailed) == null || Te.call(e, g.song);
        } catch {
        }
      }
      s = await mn(o);
    } catch (ke) {
      L = "Like not sent: " + (ke instanceof Error ? ke.message : "the listening wallet is unavailable");
      try {
        (q = e.likeFailed) == null || q.call(e, g.song);
      } catch {
      }
    } finally {
      d = !1, e.changed(), Dn();
    }
  }
  return { snapshot: er, refresh: Yn, onListened: Si, heart: To, toggleLike: ms, ...Lr };
}
const Bb = ["Connect", "Passkey", "Link & fund", "Listen"], Nb = ["Passkey", "Add 1 STX", "Listen"], lf = (e) => e ? Nb : Bb;
function Z5(e) {
  if (e.solo) return J5(e);
  const t = Bb.length, n = (r, o, s = !1) => ({ at: r, blocked: s, caption: r >= t ? o : `Step ${r + 1} of ${t} · ${o}` });
  switch (e.step) {
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
      return n(2, e.depositPending ? "funds on their way: nothing to do" : "add up to 1 STX");
    case "over":
      return n(2, "over 1 STX: return the excess", !0);
    case "ready": {
      if (!e.payingOn || !e.session || e.session.playsLeft < 1) return n(3, "switch paying on");
      const r = e.entries.filter((o) => o.kind === "play");
      return r.some((o) => o.status === "confirmed") ? n(t, "Paid plays are taking place") : r.some((o) => ["signed", "pending", "unknown"].includes(o.status)) ? n(3, "first paid play sent, confirming") : n(3, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function J5(e) {
  const t = Nb.length, n = (r, o, s = !1) => ({ at: r, blocked: s, caption: r >= t ? o : `Step ${r + 1} of ${t} · ${o}` });
  switch (e.step) {
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
      return n(1, e.depositPending ? "your funds are on their way: nothing to do" : "add 1 STX: anyone can send it to your address");
    case "over":
      return n(1, "over 1 STX: return the excess", !0);
    case "ready": {
      if (!e.payingOn || !e.session || e.session.playsLeft < 1) return n(2, "switch paying on");
      const r = e.entries.filter((o) => o.kind === "play");
      return r.some((o) => o.status === "confirmed") ? n(t, "Paid plays are taking place") : r.some((o) => ["signed", "pending", "unknown"].includes(o.status)) ? n(2, "first paid play sent, confirming") : n(2, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function Q5(e, t) {
  return !t || t.at >= lf(!!e.solo).length || e.heard || e.step === "wrong-wallet" || e.entries.some((n) => n.kind === "play") || e.creditedTo ? !1 : !(e.step === "locked" && e.linked);
}
const eI = (e) => typeof e == "string" && e.toLowerCase().includes("asigna");
function tI(e = typeof window > "u" ? void 0 : window) {
  if (!e) return !1;
  let t = e;
  try {
    const n = e;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (t = n.top);
  } catch {
  }
  return t.LeatherProvider || t.XverseProviders || t.HiroWalletProvider || t.StacksProvider ? !0 : [t.btc_providers, t.webbtc_providers, t.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !eI(r.id)));
}
const nI = {}, rI = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, sI = (e) => {
  const t = nI;
  return e === "mainnet" ? t.VITE_STACKS_API_MAINNET : t.VITE_STACKS_API_TESTNET;
}, oI = (e) => `/hiro/${e}`, iI = (e) => e.startsWith("/") && typeof window < "u" ? `${window.location.origin}${e}` : e, aI = (e) => {
  const t = sI(e);
  if (t)
    return [iI(t)];
  const n = rI[e];
  return typeof window < "u" ? [`${window.location.origin}${oI(e)}`, ...n.filter((o) => !o.includes("hiro.so"))] : n;
}, cI = {}, Ag = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, lI = "xtrata.log.enabled", uI = "xtrata.log.level", dI = "xtrata.log.tags", fI = "xtrata.log.dedupe", Fc = (e) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(e);
  } catch {
    return null;
  }
}, hI = (e) => {
  if (!e)
    return !0;
  const t = e.toLowerCase();
  return t !== "false" && t !== "0" && t !== "off";
}, pI = (e) => {
  if (!e)
    return null;
  const t = e.toLowerCase();
  return t === "debug" || t === "info" || t === "warn" || t === "error" ? t : null;
}, gI = (e) => {
  if (!e)
    return !1;
  const t = e.toLowerCase();
  return t === "true" || t === "1" || t === "on";
}, yI = (e) => {
  if (!e)
    return null;
  const t = e.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return t.length === 0 ? null : t.includes("*") || t.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(t);
}, wI = () => {
  const e = cI ?? {}, t = Fc(lI) ?? e.VITE_LOG_ENABLED, n = Fc(uI) ?? e.VITE_LOG_LEVEL, r = Fc(dI) ?? e.VITE_LOG_TAGS, o = Fc(fI) ?? e.VITE_LOG_DEDUPE;
  return {
    enabled: hI(t),
    level: pI(n) ?? "warn",
    tags: yI(r),
    dedupe: gI(o)
  };
}, mI = (e, t, n) => !e.enabled || Ag[n] < Ag[e.level] ? !1 : !e.tags || e.tags.has("*") ? !0 : e.tags.has(t.toLowerCase()), bI = (e, t, n, r) => {
  const o = wI();
  if (!mI(o, t, e) || SI(o.dedupe))
    return;
  const s = `[xtrata:${t}] ${n}`, i = console[e] ?? console.log;
  r !== void 0 ? i(s, r) : i(s);
}, xI = /* @__PURE__ */ new Set();
let Eg = null;
const SI = (e, t, n, r, o) => (Eg !== e && (xI.clear(), Eg = e), !1), vI = (e, t, n) => bI("debug", e, t, n), AI = {}, EI = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, kI = (e) => {
  const t = AI, n = e === "testnet" ? t.VITE_BNSV2_CONTRACT_TESTNET : t.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : EI[e];
}, $I = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, II = (e) => {
  if (!e)
    return null;
  const t = e.trim();
  if (!t)
    return null;
  const n = t.toLowerCase();
  return $I.test(n) ? n : null;
}, LI = (e) => e.replace(/\/+$/, ""), CI = (e) => e instanceof Error ? e.message || e.name || "Error" : typeof e == "string" ? e : String(e), kg = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.startsWith("0x") ? e.slice(2) : e;
  if (!t || t.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(t))
    return null;
  let n = "";
  for (let r = 0; r < t.length; r += 2) {
    const o = Number.parseInt(t.slice(r, r + 2), 16);
    if (o < 32 || o > 126)
      return null;
    n += String.fromCharCode(o);
  }
  return n;
}, Ti = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : null, TI = (e) => {
  var c, u;
  let t;
  try {
    t = Ur($6(e));
  } catch {
    return null;
  }
  const n = Ti(t);
  if (!n || n.success === !1)
    return null;
  const r = Ti(n.value), o = Ti(r == null ? void 0 : r.value), s = Ti(o == null ? void 0 : o.value);
  if (!s)
    return null;
  const i = kg((c = Ti(s.name)) == null ? void 0 : c.value), a = kg((u = Ti(s.namespace)) == null ? void 0 : u.value);
  return !i || !a ? null : II(`${i}.${a}`);
}, BI = async (e) => {
  const [t, n] = e.contractId.split("."), r = `${LI(
    e.baseUrl
  )}/v2/contracts/call-read/${t}/${n}/get-primary`, o = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: e.address,
      arguments: [db(Ym(e.address))]
    }),
    signal: e.signal
  });
  if (!o.ok)
    throw new Error(`BNS primary lookup failed (${o.status})`);
  const s = await o.json();
  return !(s != null && s.okay) || typeof s.result != "string" ? null : TI(s.result);
}, NI = async (e) => {
  const t = e.address.trim();
  if (!zi(t))
    return null;
  const n = kI(e.network);
  if (!n)
    return null;
  let r = null;
  for (const o of aI(e.network))
    try {
      return await BI({
        baseUrl: o,
        contractId: n,
        address: t,
        signal: e.signal
      });
    } catch (s) {
      r = s;
    }
  return vI("bns", "Primary BNS name lookup unavailable", {
    address: t,
    network: e.network,
    error: CI(r)
  }), null;
};
function MI(e, t, n = {}) {
  const r = n.retryAfterMs ?? 3e4, o = n.now ?? Date.now, s = /* @__PURE__ */ new Map(), i = (a, c) => {
    c.pending = !0, c.failedAt = void 0, Promise.resolve().then(() => e(a)).then((u) => {
      c.pending = !1, u && (c.name = u, t());
    }).catch(() => {
      c.pending = !1, c.failedAt = o();
    });
  };
  return {
    get(a) {
      if (!a) return null;
      let c = s.get(a);
      return c ? !c.pending && c.name === null && c.failedAt !== void 0 && o() - c.failedAt >= r && i(a, c) : (c = { name: null, pending: !1 }, s.set(a, c), i(a, c)), c.name;
    }
  };
}
const $g = Object.freeze({
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
}), Ig = Object.freeze({ 139: "melophonic" });
function Lg(e, t = "") {
  const n = String(e);
  return Object.hasOwn($g, n) ? $g[n] : Object.hasOwn(Ig, n) ? Ig[n] : t;
}
const Cg = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function Tg(e, t = "") {
  return Object.hasOwn(Cg, String(e)) ? Cg[String(e)] : t;
}
const Mb = 10000n, kh = 1000000n, Bl = 3000n, _I = (e, t) => `${e}#gift=${t}`, PI = 100, Ea = (e, t = Rr) => e <= on ? 0 : Number((e - on) / On(t)), Bg = (e) => typeof e == "string" && /^[A-Za-z0-9_-]{22}$/.test(e), $h = "xtrata.xyz/radio/gifts", Ta = PI, UI = "Create a prefunded Xtrata radio gift batch", OI = (e) => ({
  domain: wr({ name: xt($h), version: xt("1"), "chain-id": An(1) }),
  message: wr({
    purpose: xt(UI),
    creator: xt(e.creator),
    count: An(e.count),
    amount: An(BigInt(e.amount)),
    label: xt(e.label),
    issued: An(e.issued),
    ...e.player ? { player: xt(e.player) } : {}
  })
}), _b = (e, t, n = Rr) => on + BigInt(e) * On(n) + (t ? lu : 0n), HI = (e, t = Rr) => Number((kh - on - (e ? lu : 0n)) / On(t)), Pb = (e, t) => BigInt(e) * (t + Bl);
function DI(e, t, n, r = Rr) {
  const o = n ? lu : 0n, s = t > on + o ? t - on - o : 0n, i = Number(s / On(r));
  return {
    plays: i,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(i) * Il,
    fees: BigInt(i) * r,
    reserve: on,
    float: o,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: Bl,
    perCopy: t + Bl,
    total: Pb(e, t)
  };
}
const FI = (e) => e >= Mb && e <= kh, jI = 90, Ng = [30, 90], RI = "Extend my prefunded Xtrata radio gift batches; no spending permission", zI = (e) => ({
  domain: wr({ name: xt($h), version: xt("1"), "chain-id": An(1) }),
  message: wr({ purpose: xt(RI), creator: xt(e.creator), batch: xt(e.batch), days: An(e.days), issued: An(e.issued) })
}), Mg = 40, GI = "Create an Xtrata radio gift player", uf = (e) => typeof e == "string" && /^[0-9a-f]{16}$/.test(e), KI = /^[^\u0000-\u001f\u007f<>]+$/u;
function _g(e, t, n) {
  return typeof e != "string" ? !1 : e.length ? e.length <= t && e === e.trim() && KI.test(e) : !n;
}
function Ub(e) {
  if (!e || typeof e != "object") throw new Error("A player needs a definition.");
  if (!_g(e.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!_g(e.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(e.tracks) || e.tracks.length < 1 || e.tracks.length > Mg) throw new Error(`A player holds 1 to ${Mg} songs.`);
  const t = /* @__PURE__ */ new Set();
  for (const o of e.tracks) {
    if (!Number.isSafeInteger(o) || o < 1) throw new Error("Songs are catalogue token numbers.");
    if (t.has(o)) throw new Error("A song appears twice in the list.");
    t.add(o);
  }
  if (e.cover !== null && e.cover !== void 0 && (!Number.isSafeInteger(e.cover) || e.cover < 1)) throw new Error("Cover is a catalogue token number.");
  const n = e.explicit ?? [];
  if (!Array.isArray(n)) throw new Error("Explicit songs: a list of song numbers from the album.");
  for (const o of n) if (!t.has(o)) throw new Error("An explicit song must be one of the album’s songs.");
  const r = [...new Set(n)].sort((o, s) => o - s);
  return { title: e.title, subtitle: e.subtitle ?? "", tracks: [...e.tracks], cover: e.cover ?? null, ...r.length ? { explicit: r } : {} };
}
const Ob = (e) => {
  const t = [...new Set(e.explicit ?? [])].sort((n, r) => n - r);
  return Lf(Bf(new TextEncoder().encode(JSON.stringify({ title: e.title, subtitle: e.subtitle ?? "", tracks: e.tracks, cover: e.cover ?? null, ...t.length ? { explicit: t } : {} }))));
}, VI = (e) => ({
  domain: wr({ name: xt($h), version: xt("1"), "chain-id": An(1) }),
  message: wr({
    purpose: xt(GI),
    admin: xt(e.admin),
    player: xt(e.hash),
    issued: An(e.issued)
  })
}), Dr = (e) => e.tracks.filter((t) => !t.hidden), XI = (e) => e.tracks.find((t) => t.hidden) ?? null, Xu = [300, 500, 1e3], Ha = [
  { id: "diamond", name: "Diamond", min: 1e3, mark: "◆" },
  { id: "gold", name: "Gold", min: 500, mark: "★" },
  { id: "silver", name: "Silver", min: 250, mark: "✦" },
  { id: "bronze", name: "Bronze", min: 100, mark: "●" },
  { id: "classic", name: "Classic", min: 0, mark: "♪" }
], jc = (e) => typeof e == "string" && Ha.some((t) => t.id === e), jo = (e) => Ha.find((t) => t.id === e), YI = (e) => Ha.find((t) => e >= t.min) ?? Ha[Ha.length - 1];
function qI(e, t = Rr) {
  return YI(e <= on ? 0 : Number((e - on) / On(t)));
}
const Hb = [
  { tier: "diamond", plays: 1e3, count: 5 },
  { tier: "gold", plays: 500, count: 10 },
  { tier: "silver", plays: 250, count: 20 },
  { tier: "bronze", plays: 100, count: 100 },
  { tier: "classic", plays: 50, count: 865 }
], WI = "1000 Players";
function Ih(e = Ta) {
  const t = [];
  for (const n of Hb) {
    const r = _b(n.plays, !1);
    for (let o = n.count; o > 0; o -= e) {
      const s = Math.min(o, e), i = t.length + 1;
      t.push({ n: i, tier: n.tier, plays: n.plays, count: s, label: `${WI} ${String(i).padStart(2, "0")}`, amount: r, deposit: Pb(s, r) });
    }
  }
  return t;
}
const Lh = (e = Ih()) => ({
  batches: e.length,
  players: e.reduce((t, n) => t + n.count, 0),
  deposit: e.reduce((t, n) => t + n.deposit, 0n),
  tiers: Hb.map((t) => ({ id: t.tier, plays: t.plays, count: t.count }))
}), ZI = 23 * 36e5, Pg = (e) => ["todo", "unpaid", "confirming", "touched", "live"].indexOf(e);
function JI(e, t) {
  const n = e.view;
  return (n == null ? void 0 : n.status) === "live" ? n.copies.waiting === e.count ? "live" : "touched" : e.txid ? "confirming" : t - e.at < ZI ? "unpaid" : "todo";
}
function QI(e, t, n) {
  var a;
  const r = t.filter((c) => c.label === e.label && c.player === null && c.count === e.count && c.amount === e.amount.toString() && c.codes.length === e.count).map((c) => ({ b: c, state: JI(c, n) })).filter((c) => c.state !== "todo").sort((c, u) => Pg(u.state) - Pg(c.state) || u.b.at - c.b.at), o = r[0];
  if (!o) return { step: e, state: "todo", extras: 0, detail: "not made yet" };
  const s = (a = o.b.view) == null ? void 0 : a.copies, i = o.state === "live" ? `live · all ${e.count} waiting to be claimed` : o.state === "touched" ? `live, but only ${(s == null ? void 0 : s.waiting) ?? 0} of ${e.count} still waiting (${(s == null ? void 0 : s.claimed) ?? 0} claimed)` : o.state === "confirming" ? "paid · waiting for the payment to confirm" : "made · links saved · not paid yet";
  return { step: e, state: o.state, batch: o.b, extras: r.length - 1, detail: o.b.error ? `${i} (${o.b.error})` : i };
}
function Ug(e, t, n = Ih()) {
  var u;
  const r = n.map((h) => QI(h, e, t)), o = [];
  for (const h of r)
    h.extras && o.push(`Batch ${h.step.n} was made more than once. The extra ${h.extras === 1 ? "one is" : "ones are"} not part of the drop: leave ${h.extras === 1 ? "it" : "them"} unpaid, or if paid the money comes back when the copies run out.`), h.state === "touched" && o.push(`Batch ${h.step.n} has copies that are no longer waiting, so the wall would come up short.`);
  const s = r.every((h) => h.state === "live"), i = s ? r.flatMap((h) => h.batch.codes) : [], a = Lh(n).players;
  s && new Set(i).size !== a && o.push(`The links do not add up: ${new Set(i).size} different links for ${a} players.`);
  const c = s && new Set(i).size === a;
  return { steps: r, next: ((u = r.find((h) => h.state === "todo")) == null ? void 0 : u.step) ?? null, done: r.filter((h) => h.state === "live").length, ready: c, codes: c ? i : [], problems: o };
}
function eL(e, t = Ih()) {
  const n = e;
  if (!n || typeof n.total != "number") return { ok: !1, text: "The wall could not be read just now." };
  const r = Lh(t);
  if (n.total === 0) return { ok: !1, text: "The wall is empty: nothing is loaded." };
  const o = n.total - (n.free ?? 0) - (n.held ?? 0) - (n.claimed ?? 0), s = r.tiers.map((u) => {
    var d;
    const h = (d = n.tiers) == null ? void 0 : d.find((m) => m.plays === u.plays);
    return { ...u, got: (h == null ? void 0 : h.total) ?? 0 };
  }), i = s.map((u) => `${u.got} ${jo(u.id).name}`).join(", "), a = (n.tiers ?? []).filter((u) => !r.tiers.some((h) => h.plays === u.plays)), c = n.total === r.players && o === 0 && !!n.tiers && s.every((u) => u.got === u.count) && a.length === 0;
  return c ? { ok: c, text: `The wall holds ${n.total.toLocaleString("en-GB")} players: ${i}. ${n.claimed ?? 0} claimed so far${n.state === "paused" ? " · PAUSED" : ""}.` } : { ok: c, text: `The wall is not the 1,000 yet: ${n.total.toLocaleString("en-GB")} spots${n.tiers ? ` (${i}${a.length ? `, and ${a.reduce((u, h) => u + h.total, 0)} of another size` : ""})` : ""}${o ? `, ${o} no longer available` : ""}.` };
}
const Og = 1800, Yu = /* @__PURE__ */ new Map();
async function tL(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
  }
  try {
    const t = document.createElement("textarea");
    t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.append(t), t.select();
    const n = document.execCommand("copy");
    return t.remove(), n;
  } catch {
    return !1;
  }
}
function nL(e, t, n, r, o) {
  const s = document.createElement("button");
  return s.type = "button", s.className = r, s.dataset.feedback = e, (() => {
    const a = Yu.get(e), c = !!a && a.until > Date.now();
    s.textContent = c ? a.label : t, s.classList.toggle("is-done", c && a.ok), s.classList.toggle("is-failed", c && !a.ok);
  })(), s.onclick = async () => {
    const a = await n();
    if (a) {
      Yu.set(e, { ...a, until: Date.now() + Og });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === e && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        Yu.delete(e), o();
      }, Og + 50);
    }
  }, s;
}
const fr = (e, t, n, r, o) => nL(e, t, async () => await tL(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, o), No = "xtrata.radio.gift.incoming.v1", Hg = (e) => "xtrata.radio.gift.mine.v1:" + e, Dg = (e) => "xtrata.radio.gift.batches.v1:" + e, ge = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, rn = (e, t, n = "") => {
  const r = ge("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, ka = (e, t) => {
  const n = document.createElement("option");
  return n.textContent = e, n.value = t, n;
}, Wn = (e) => Mr(e).replace(/\.?0+$/, "");
function rL(e) {
  let t = null;
  const n = (E) => [5e3, 1e4, 2e4, 3e4][E] ?? 6e4, r = (() => {
    try {
      const E = new URL(location.href), O = new URLSearchParams(E.hash.slice(1)).get("gift") ?? E.searchParams.get("gift");
      return O !== null && (E.searchParams.delete("gift"), history.replaceState(null, "", E.pathname + (E.search || ""))), Bg(O) ? O : null;
    } catch {
      return null;
    }
  })(), o = (() => {
    try {
      const E = JSON.parse(e.store.get(No) || "null");
      return Bg(E == null ? void 0 : E.code) ? E.code : null;
    } catch {
      return null;
    }
  })(), s = r ?? o;
  if (s) {
    t = { code: s }, e.store.set(No, JSON.stringify({ code: s, at: e.now() }));
    let E = 0;
    const O = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: s }), signal: AbortSignal.timeout(15e3) }).then(async (K) => {
      const D = await K.json().catch(() => ({}));
      if (K.status === 404) {
        e.store.set(No, null), t = { ...t, error: (D == null ? void 0 : D.error) || "That gift link is not valid." }, e.changed();
        return;
      }
      if (!K.ok) throw new Error("busy");
      const J = D;
      t = { ...t, view: J, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(J.status) && e.store.set(No, null), e.changed();
    }).catch(() => {
      !t || t.view || (t = { ...t, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, e.changed(), setTimeout(() => void O(), n(E++)));
    });
    O();
  }
  const i = () => !!(t != null && t.view) && t.view.status === "live" && !t.done, a = () => {
    const E = t == null ? void 0 : t.view;
    return !(E != null && E.player) || !i() ? null : { player: E.player, from: d(E), plays: Ea(BigInt(E.amount)) };
  }, c = () => {
    const E = t == null ? void 0 : t.view;
    return !E || E.player || !i() ? null : { plays: Ea(BigInt(E.amount)), from: E.from ? e.who(E.from) : null };
  }, u = () => {
    const E = t == null ? void 0 : t.code;
    if (!E) return [];
    const O = `${location.origin}${location.pathname}#gift=${E}`;
    return [fr("gift-pass-on", "Copy the link to pass on", () => O, "primary", e.changed)];
  }, h = () => {
    t = null, e.store.set(No, null), e.changed();
  }, d = (E) => E.from ? e.who(E.from) : E.label ? `Xtrata Radio · ${E.label}` : "Xtrata Radio";
  let m = {};
  const w = (E) => {
    if (m.box) return m.box;
    const O = ge("div", "", "ppp-gift-check");
    m.box = O;
    const K = () => {
      const D = window.turnstile;
      !D || m.rendered || (m.rendered = !0, D.render(O, { sitekey: E, callback: (J) => {
        m.token = J, e.changed();
      }, "expired-callback": () => {
        m.token = void 0;
      } }));
    };
    if (window.turnstile) K();
    else {
      const D = document.createElement("script");
      D.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", D.async = !0, D.onload = K, document.head.append(D);
    }
    return O;
  }, v = (E) => {
    queueMicrotask(() => void E());
  };
  let x;
  async function L(E) {
    var D, J, te, Ce, Ae, Fe, ft, $, pe;
    if (!t || t.claiming || !E.listening) return;
    const O = !!((D = t.view) != null && D.player);
    if (O && !E.root) return;
    t.claiming = !0, t.error = void 0, (J = e.claiming) == null || J.call(e, !0), e.changed();
    const K = async (ze) => {
      const ut = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: t.code, turnstile: m.token, ...ze })
      });
      return { res: ut, r: await ut.json().catch(() => ({})) };
    };
    try {
      let ze = 0, ut = E.listening, Xt;
      if (O) {
        const yt = Number((te = await e.json("/radio/gift/slots?root=" + encodeURIComponent(E.root))) == null ? void 0 : te.next);
        if (!Number.isSafeInteger(yt) || yt < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        ze = yt;
        for (let er = 0; ; er++) {
          const Kr = await e.album.bind(ze);
          if (ut = Kr.address, Xt = await K({ wallet: ut, binding: Kr }), Xt.res.status === 409 && /just taken/.test(((Ce = Xt.r) == null ? void 0 : Ce.error) || "") && er < 5) {
            ze += 1;
            continue;
          }
          break;
        }
      } else Xt = await K({ wallet: ut });
      const { res: Ft, r: dn } = Xt;
      if (Ft.status === 503 && /sending another gift/.test((dn == null ? void 0 : dn.error) || "")) {
        t.waiting = !0, (Ae = e.claiming) == null || Ae.call(e, !0), clearTimeout(x), x = setTimeout(() => {
          t && (t.waiting = !1, e.changed());
        }, 12e3);
        return;
      }
      if (!Ft.ok) {
        const yt = String((dn == null ? void 0 : dn.error) || "");
        if (Ft.status === 404 || Ft.status === 410 || Ft.status === 409 && /already had a gift|brand-new|already have this album/.test(yt))
          throw e.store.set(No, null), new Error(yt || "This gift cannot be opened.");
        if (Ft.status === 429 || Ft.status === 403 || Ft.status === 400 && !/wallet number/i.test(yt)) throw new Error(yt || `Could not open the gift (${Ft.status}).`);
        const Kr = /topping up/.test(yt) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(yt) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(yt) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(Kr), { retry: !0, slow: /topping up|not paid for yet/.test(yt) });
      }
      t.done = !0, e.store.set(No, null), O ? await e.album.arrived(ze, ut, dn.txid, BigInt(dn.amount)) : e.giftSent(dn.txid, BigInt(dn.amount));
    } catch (ze) {
      const ut = ze, Xt = ut.name === "TypeError" || ut.name === "AbortError" || ut.name === "TimeoutError" || /wallet number/i.test(ut.message);
      if (ut.retry || Xt) {
        const Ft = t.tries ?? 0;
        t.tries = Ft + 1, t.retry = { text: ut.retry ? ut.message : "Still sending your gift… the network is slow, trying again." }, (Fe = e.claiming) == null || Fe.call(e, !0), clearTimeout(x), x = setTimeout(() => {
          t && (t.retry = void 0, e.changed());
        }, ut.slow ? 6e4 : n(Ft));
      } else
        t.error = ut.message, (ft = e.claiming) == null || ft.call(e, !1);
      m.token = void 0;
      try {
        (pe = ($ = window.turnstile) == null ? void 0 : $.reset) == null || pe.call($, m.box);
      } catch {
      }
    } finally {
      t.claiming = !1, e.changed();
    }
  }
  let N = null;
  function U(E) {
    if (!E.listening || !E.depositPending || E.step !== "fund")
      return N = null, [];
    if (!N || N.wallet !== E.listening || e.now() - N.at > 3e4) {
      const K = E.listening;
      N = { ...(N == null ? void 0 : N.wallet) === K ? N : {}, wallet: K, at: e.now() }, e.json("/radio/gift/for?wallet=" + encodeURIComponent(K)).then((D) => {
        var J, te;
        (N == null ? void 0 : N.wallet) === K && (N.state = (J = D == null ? void 0 : D.gift) == null ? void 0 : J.state, N.problem = ((te = D == null ? void 0 : D.gift) == null ? void 0 : te.problem) ?? null, e.changed());
      }).catch(() => {
      });
    }
    if (!(N.state === "sending" && N.problem)) return [];
    const O = ge("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return O.title = `Network reply: ${N.problem}`, [O];
  }
  function A(E, O, K = !1) {
    var Fe, ft;
    const D = O.player, J = BigInt(O.amount), te = K ? [] : [ge("p", `🎁 ${d(O)} sent you “${D.title}”${D.subtitle ? ` by ${D.subtitle}` : ""}: ${Dr(D).length} ${Dr(D).length === 1 ? "song" : "songs"} and ${Ea(J).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!E.root && ["fund", "ready", "over", "link"].includes(E.step))) {
      if (K) return te;
      if (te.push(ge("p", E.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : E.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), E.step === "intro") {
        const $ = document.createElement("details");
        $.className = "ppp-how";
        const pe = document.createElement("summary");
        pe.textContent = "How does this work?", $.append(pe, ge("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), te.push($);
      }
      return te;
    }
    if (E.walletCannotAlbums)
      return te.push(ge("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), te;
    const Ae = (ft = (Fe = E.gate) == null ? void 0 : Fe.gifts) == null ? void 0 : ft.turnstileSiteKey;
    return Ae && !m.token ? te.push(ge("p", "One quick check and it is yours:", "ppp-mute"), w(Ae)) : !t.claiming && !t.error && !t.waiting && !t.retry && v(() => L(E)), te.push(...T(E, "Sending your album…")), te;
  }
  function T(E, O) {
    const K = [];
    return t.claiming || t.waiting ? K.push(ge("p", t.waiting ? "Another gift is on its way out first. Yours is next…" : O, "ppp-cyan")) : t.retry && K.push(ge("p", t.retry.text, "ppp-warn"), rn("Try now", () => {
      clearTimeout(x), t.retry = void 0, L(E);
    }, "quiet")), t.error && /already have this album/i.test(t.error) ? K.push(ge("p", "You already have this album: it is in My albums. This copy is still free, so pass it on to a friend who would love it.", "ppp-mute"), ...u(), rn("Forget this gift link here", h, "quiet")) : t.error && K.push(ge("p", t.error, "ppp-bad"), rn("Try again", () => {
      t.error = void 0, L(E);
    })), K;
  }
  const B = (E) => {
    var O;
    return !!t && !t.done && !t.error && i() && !!E.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(t.claiming || t.waiting || t.retry) || !E.linked && !E.creditedTo && (E.createdHere || E.brandNew || !!((O = t.view) != null && O.player)) && (E.balance ?? 0n) === 0n && !E.entries.length);
  };
  function X(E, O = {}) {
    var ut, Xt, Ft, dn;
    const K = U(E);
    if (!t || ["off", "elsewhere"].includes(E.step)) return K;
    const D = t.view;
    if (t.error && !D) return [ge("p", `🎁 ${t.error}`, "ppp-warn")];
    if (!D) return [ge("p", t.retry ? `🎁 ${t.retry.text}` : "🎁 Checking your gift…", t.retry ? "ppp-warn" : "ppp-mute")];
    if (t.done) return K;
    if (D.status === "claimed" || D.status === "claiming") return [ge("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(D.status)) return [ge("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (D.status === "pending-deposit") return [ge("p", `🎁 ${d(D)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (D.player) return [...A(E, D, !!O.bare), ...K];
    const J = !!E.listening && (!(E.createdHere || E.brandNew) || !!E.linked || !!E.creditedTo || (E.balance ?? 0n) > 0n || E.entries.length > 0), te = J ? ((ut = e.claimNew) == null ? void 0 : ut.call(e, E)) ?? null : null, Ce = te ? ((Xt = e.replaceOld) == null ? void 0 : Xt.call(e, E)) ?? null : null;
    if (te && Ce)
      return [
        ge("p", "🎁 A free player is waiting, and this device already has a player you made before. Replace the old one to end up with a single player that has 24 backup words: its balance is sent back first, then it is removed from this device. Or keep both as two separate players.", "ppp-mute"),
        rn("Replace my old player", Ce, "primary"),
        rn("Keep both players", te, "quiet"),
        rn("Not now", h, "quiet")
      ];
    if (te)
      return [
        ge("p", "🎁 This device already has a player you made before. You can claim this free one as a new, separate player with its own passkey. Your existing player, and anything in it, stays exactly as it is; you can switch between them with “Use a different listening wallet”.", "ppp-mute"),
        rn("Claim it as a new player", te, "primary"),
        rn("Not now", h, "quiet")
      ];
    if (J)
      return [ge("p", "🎁 You already have a player, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), rn("Forget this gift link here", h, "quiet")];
    const Ae = BigInt(D.amount), Fe = Ea(Ae).toLocaleString(), ft = ge(
      "p",
      `🎁 ${d(D)} sent you ${Wn(Ae)} STX of on-chain music: about ${Fe} paid plays.`,
      "ppp-gift"
    ), $ = O.bare ? [] : [ft], pe = !!E.listening && (E.createdHere || E.brandNew) && !E.linked && !E.creditedTo && E.step === "fund" && (E.balance ?? 1n) === 0n && !E.depositPending && !E.entries.length, ze = (dn = (Ft = E.gate) == null ? void 0 : Ft.gifts) == null ? void 0 : dn.turnstileSiteKey;
    return pe ? (ze && !m.token ? $.push(ge("p", "One quick check and it is yours:", "ppp-mute"), w(ze)) : !t.claiming && !t.error && !t.waiting && !t.retry && v(() => L(E)), $.push(...T(E, "Sending your gift…"))) : E.step === "intro" ? O.bare || $.push(ge("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : E.listening && E.linked ? $.push(ge("p", "You already have a player linked to your Stacks wallet, so this free one is for someone new. Know a friend who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), rn("Forget this gift link here", h, "quiet")) : E.listening && (E.balance ?? 0n) > 0n && $.push(ge("p", "Your player already has plays, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), rn("Forget this gift link here", h, "quiet")), $;
  }
  async function Q(E, O, K) {
    var D;
    try {
      const J = await e.json("/radio/gift/for?wallet=" + encodeURIComponent(E));
      if ((D = J == null ? void 0 : J.gift) != null && D.returnTo) return { ok: !0, funder: J.gift.returnTo, txId: J.gift.txid ?? void 0, amount: J.gift.amount, distinct: 1 };
    } catch {
      if (K) return { ok: !1 };
    }
    return O();
  }
  const oe = ge("div", "", "ppp-gift-fold");
  let Y = 250000n, b = "", I = "";
  const M = (E) => {
    try {
      const O = JSON.parse(e.store.get(Hg(E)) || "[]");
      return Array.isArray(O) ? O : [];
    } catch {
      return [];
    }
  }, P = (E, O) => e.store.set(Hg(E), JSON.stringify(O.slice(0, 50)));
  async function W(E) {
    const O = M(E);
    for (const K of O)
      if (!(K.view && ["claimed", "refunded", "expired"].includes(K.view.status)))
        try {
          K.view = !K.view || K.view.status === "pending-deposit" ? await e.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: K.id, ...K.txid ? { txid: K.txid } : {} }) }) : await e.json("/radio/gift?id=" + K.id), K.error = void 0;
        } catch (D) {
          K.error = D.message;
        }
    P(E, O), e.changed();
  }
  async function R(E) {
    if (b) return;
    b = "Starting your gift…", I = "", e.changed();
    let O = null;
    try {
      O = await e.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: E, amount: Y.toString() }) });
      const K = M(E);
      K.unshift({ id: O.id, code: O.code, amount: Y.toString(), at: e.now() }), P(E, K), b = "Approve the gift in your wallet…", e.changed();
      const D = await e.pay(E, O.depositTo, BigInt(O.deposit), O.memo), J = M(E), te = J.find((Ce) => Ce.id === O.id);
      te && (te.txid = D, te.view = { status: "pending-deposit", amount: Y.toString(), source: "friend", from: E, label: "", expires: 0 }), P(E, J), I = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", W(E);
    } catch (K) {
      I = K.message || "Not sent.";
    } finally {
      b = "", e.changed();
    }
  }
  const le = (E) => "xtrata.radio.gift.players.v1:" + E, ue = (E) => {
    try {
      const O = JSON.parse(e.store.get(le(E)) || "[]");
      return Array.isArray(O) ? O.filter((K) => K && /^[0-9a-f]{16}$/.test(K.id)) : [];
    } catch {
      return [];
    }
  };
  async function Xe(E, O) {
    var K;
    if (!b) {
      b = "Checking the player…", I = "", e.changed();
      try {
        const D = O.tracks.split(/[\s,]+/).filter(Boolean).map(($) => Number($.replace(/^#/, ""))), J = (O.explicit ?? "").split(/[\s,]+/).map(($) => $.replace(/^#/, "")).filter(Boolean).map(Number), te = Ub({ title: O.title.trim(), subtitle: O.subtitle.trim(), tracks: D, cover: (K = O.cover) != null && K.trim() ? Number(O.cover.trim().replace(/^#/, "")) : null, ...J.length ? { explicit: J } : {} });
        b = "Sign in your wallet…", e.changed();
        const Ce = { admin: E, hash: Ob(te), issued: e.now() }, Ae = await e.sign(E, VI(Ce));
        b = "Making the player…", e.changed();
        const Fe = await e.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: te, request: Ce, signature: Ae }) }), ft = ue(E).filter(($) => $.id !== Fe.id);
        ft.unshift({ id: Fe.id, title: Fe.title, tracks: Fe.tracks }), e.store.set(le(E), JSON.stringify(ft.slice(0, 30))), I = `${Fe.existing ? "That player already exists" : "Player made"} ✓ “${Fe.title}” · ${Fe.tracks} songs. Pick it below for a batch.`;
      } catch (D) {
        I = D.message || "Not made.";
      } finally {
        b = "", e.changed();
      }
    }
  }
  const C = (E, O) => _I(E || location.origin + "/radio.html", O), F = (E) => {
    try {
      const O = JSON.parse(e.store.get(Dg(E)) || "[]");
      return Array.isArray(O) ? O.filter((K) => K && /^[0-9a-f]{16}$/.test(K.id) && Array.isArray(K.codes)) : [];
    } catch {
      return [];
    }
  }, re = (E, O) => e.store.set(Dg(E), JSON.stringify([...O.filter((K) => K.codes.length), ...O.filter((K) => !K.codes.length)].slice(0, 80))), de = (E) => !!E.view && E.view.status === "live" && E.view.copies.waiting + E.view.copies.claiming + E.view.copies.refunding === 0, Be = (E, O) => e.json(E, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(O) });
  let Me = 0;
  async function Ot(E) {
    const O = F(E);
    for (const D of O)
      if (!de(D))
        try {
          D.view = !D.view || D.view.status === "pending-deposit" ? await Be("/radio/gift/batch/confirm", { id: D.id, ...D.txid ? { txid: D.txid } : {} }) : await e.json("/radio/gift/batch?id=" + D.id), D.error = void 0;
        } catch (J) {
          D.error = J.message;
        }
    try {
      const D = await e.json("/radio/gift/batches?creator=" + encodeURIComponent(E));
      for (const J of (D == null ? void 0 : D.batches) ?? []) {
        const te = O.find((Ce) => Ce.id === J.id);
        if (te) {
          te.error || (te.view = J);
          continue;
        }
        O.push({ id: J.id, codes: [], count: J.count, amount: J.amount, label: J.label, player: J.player, depositTo: "", deposit: J.deposit, memo: J.memo, at: 0, view: J });
      }
    } catch {
    }
    const K = /* @__PURE__ */ new Map();
    for (const D of F(E)) (!K.has(D.id) || D.codes.length > K.get(D.id).codes.length) && K.set(D.id, D);
    for (const D of O) {
      const J = K.get(D.id);
      J ? K.set(D.id, { ...J, view: D.view ?? J.view, error: D.error, txid: J.txid ?? D.txid, codes: J.codes.length >= D.codes.length ? J.codes : D.codes, depositTo: J.depositTo || D.depositTo }) : K.set(D.id, D);
    }
    re(E, [...K.values()]), e.changed();
  }
  async function Ge(E, O) {
    const K = F(E).find((D) => D.id === O);
    if (!(!K || !K.depositTo || b)) {
      b = "Approve the payment in your wallet…", I = "", e.changed();
      try {
        const D = await e.pay(E, K.depositTo, BigInt(K.deposit), K.memo), J = F(E), te = J.find((Ce) => Ce.id === O);
        te && (te.txid = D), re(E, J), I = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", b = "", Ot(E);
      } catch (D) {
        I = `${/cancel/i.test(D.message) ? "Payment cancelled." : D.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        b = "", e.changed();
      }
    }
  }
  async function _e(E, O, K, D) {
    if (b) return;
    if (!O.ok) {
      I = O.reason, e.changed();
      return;
    }
    b = "Sign in your wallet…", I = "", e.changed();
    let J = null;
    try {
      const te = { creator: E, count: O.count, amount: O.amount.toString(), label: K, issued: e.now(), ...D ? { player: D } : {} }, Ce = await e.sign(E, OI(te));
      b = "Making your links…", e.changed(), J = await Be("/radio/gift/batch", { request: te, signature: Ce });
      const Ae = F(E);
      Ae.unshift({ id: J.id, codes: J.codes, count: O.count, amount: J.amount, label: K, player: D ?? null, depositTo: J.depositTo, deposit: J.deposit, memo: J.memo, at: e.now() }), re(E, Ae);
    } catch (te) {
      I = te.message || "Not made.", b = "", e.changed();
      return;
    }
    b = "", e.changed(), await Ge(E, J.id);
  }
  async function Pe(E, O, K) {
    if (!b) {
      b = "Sign in your wallet (nothing is spent)…", I = "", e.changed();
      try {
        const D = { creator: E, batch: O, days: K, issued: e.now() }, J = await e.sign(E, zI(D));
        b = "Extending…", e.changed();
        const te = await Be("/radio/gift/batch/extend", { request: D, signature: J }), Ce = F(E);
        for (const Ae of (te == null ? void 0 : te.batches) ?? []) {
          const Fe = Ce.find((ft) => ft.id === Ae.id);
          Fe && (Fe.view = Ae, Fe.error = void 0);
        }
        re(E, Ce), I = te != null && te.extended ? `Extended ✓ ${te.extended === 1 ? "That batch has" : `${te.extended} batches have`} ${K} more days.` : "There was nothing live to extend.";
      } catch (D) {
        I = /cancel/i.test(D.message || "") ? "Cancelled. Nothing changed." : D.message || "Not extended.";
      } finally {
        b = "", e.changed();
      }
    }
  }
  const _t = (E) => Math.max(0, Math.ceil((E - e.now()) / 864e5));
  function En(E, O) {
    const K = O.filter((te) => {
      var Ce;
      return ((Ce = te.view) == null ? void 0 : Ce.status) === "live" && te.view.copies.waiting > 0;
    });
    if (!K.length) return null;
    const D = Math.min(...K.map((te) => te.view.expires)), J = ge("p", "", "ppp-batch-extend");
    J.append(ge("span", `${K.length} live ${K.length === 1 ? "batch" : "batches"} · the first runs out in ${_t(D)} days. Extend ${K.length === 1 ? "it" : "them all"}: `));
    for (const te of Ng) {
      const Ce = rn(`+${te} days`, () => void Pe(E, "all", te), "tiny");
      Ce.disabled = !!b, J.append(Ce);
    }
    return J;
  }
  const lt = () => Zt(!!Ye.value, Ve.value, Ht.value);
  function Zt(E, O, K) {
    const D = O === "max" ? HI(E) : Number(O), J = _b(D, E), te = Number(K);
    return !Number.isInteger(te) || te < 1 || te > Ta ? { ok: !1, reason: `Make 1 to ${Ta} copies at a time.`, album: E, plays: D, amount: J, count: te } : FI(J) ? { ok: !0, reason: "", album: E, plays: D, amount: J, count: te, bill: DI(te, J, E) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: E, plays: D, amount: J, count: te };
  }
  const kt = () => {
    var E;
    return ((E = e.batchDays) == null ? void 0 : E.call(e)) ?? jI;
  }, z = (E = lt()) => {
    if (!E.ok) return E.reason;
    const O = E.bill;
    return `Each copy: ${E.plays.toLocaleString()} paid plays (${Wn(O.holders)} to song holders, ${Wn(O.fees)} network fees)${E.album ? `, ${Wn(O.float)} for the album’s likes` : ""}, ${Wn(O.reserve)} kept so a listener can return what is left, + ${Wn(O.sendFee)} to send it = ${Wn(O.perCopy)} STX. ${E.count} copies = ${Wn(O.total)} STX, paid now in one payment. Copies nobody claims within ${kt()} days come back to you, and you can extend that at any time.`;
  }, H = (E, O) => O.codes.map((K) => C(E, K)), ee = ge("input");
  ee.type = "range", ee.min = String(Mb), ee.max = String(kh), ee.step = "10000", ee.value = String(Y), ee.setAttribute("aria-label", "Gift amount");
  const se = ge("p", "", "ppp-gift-amount"), he = rn("", () => {
    const E = e.main();
    E && R(E);
  }, "primary"), dt = () => {
    se.textContent = Ne(), he.textContent = `Gift ${Wn(Y)} STX`;
  };
  ee.oninput = () => {
    Y = BigInt(ee.value), dt();
  };
  const Ne = () => `${Wn(Y)} STX · about ${Ea(Y).toLocaleString()} paid plays · you pay ${Wn(Y + Bl)} STX with the network fee`;
  dt();
  const He = ge("input");
  He.maxLength = 60, He.placeholder = "Title, e.g. Proof of Sound", He.setAttribute("aria-label", "Player title");
  const St = ge("input");
  St.maxLength = 80, St.placeholder = "Artist (optional)", St.setAttribute("aria-label", "Player subtitle");
  const Ke = ge("textarea");
  Ke.rows = 3, Ke.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Ke.setAttribute("aria-label", "Songs");
  const Ie = ge("input");
  Ie.placeholder = "Explicit songs (optional): their numbers, e.g. 1022. Never played unless asked for, with a warning", Ie.setAttribute("aria-label", "Explicit songs");
  const Ze = ge("input");
  Ze.inputMode = "numeric", Ze.placeholder = "Cover inscription number (optional), shown when the album loads", Ze.setAttribute("aria-label", "Cover inscription");
  const Ye = ge("select");
  Ye.setAttribute("aria-label", "Batch album");
  const Ve = ge("select");
  Ve.setAttribute("aria-label", "Plays per copy");
  for (const E of [.../* @__PURE__ */ new Set([50, 100, 250, ...Xu])].sort((O, K) => O - K)) Ve.append(ka(`${E.toLocaleString()} plays`, String(E)));
  Ve.append(ka("Max (1 STX)", "max")), Ve.value = String(Xu[0]);
  const Ht = ge("input");
  Ht.type = "number", Ht.min = "1", Ht.max = String(Ta), Ht.value = "10", Ht.setAttribute("aria-label", "Copies");
  const pn = ge("input");
  pn.maxLength = 40, pn.placeholder = "Label, e.g. Opera launch", pn.setAttribute("aria-label", "Batch label");
  const gn = ge("p", "", "ppp-mute"), Vn = () => {
    gn.textContent = z();
  };
  for (const E of [Ye, Ve, Ht])
    E.oninput = Vn, E.onchange = Vn;
  Vn();
  let $t = null, un = 0;
  async function Ir() {
    un = e.now();
    try {
      $t = eL(await e.json("/radio/giveaway/players"));
    } catch {
      $t = { ok: !1, text: "The wall could not be read just now." };
    }
    e.changed();
  }
  const zr = (E, O) => {
    var D;
    if (((D = Ug(F(E), e.now()).next) == null ? void 0 : D.n) !== O.n) {
      I = "That batch is already made. Check again.", e.changed();
      return;
    }
    _e(E, Zt(!1, String(O.plays), String(O.count)), O.label);
  };
  function mr(E) {
    var Ce;
    const O = Ug(F(E), e.now()), K = Lh(), D = ge("div", "", "ppp-drop");
    D.append(
      ge("p", `The ${K.players.toLocaleString("en-GB")} players (admin) · ${O.done} of ${K.batches} batches live`, "ppp-cyan"),
      ge("p", `${K.tiers.map((Ae) => `${Ae.count} ${jo(Ae.id).name}`).join(", ")}. ${K.batches} batches, ${Wn(K.deposit)} STX in all, paid from this wallet. One batch at a time, top to bottom: each is a signature, then a payment. The links are saved on this device the moment they are made, so make every batch in this browser.`, "ppp-mute")
    );
    const J = ge("ol", "", "ppp-gift-list ppp-drop-steps");
    for (const Ae of O.steps) {
      const Fe = ge("li"), ft = Ae.state === "live" ? "✓" : Ae.state === "touched" ? "!" : Ae.state === "todo" ? "○" : "…";
      if (Fe.append(ge("span", `${ft} ${Ae.step.n}. ${jo(Ae.step.tier).name} · ${Ae.step.count} × ${Ae.step.plays.toLocaleString("en-GB")} plays · ${Wn(Ae.step.deposit)} STX`, "t"), ge("span", Ae.detail, Ae.state === "live" ? "ppp-ok" : Ae.state === "touched" ? "ppp-warn" : "ppp-mute")), Ae.state === "todo" && ((Ce = O.next) == null ? void 0 : Ce.n) === Ae.step.n) {
        const $ = rn("Sign and pay", () => zr(E, Ae.step), "tiny");
        $.disabled = !!b, Fe.append($);
      }
      if (Ae.state === "unpaid" && Ae.batch) {
        const $ = rn("Pay now", () => void Ge(E, Ae.batch.id), "tiny");
        $.disabled = !!b, Fe.append($);
      }
      J.append(Fe);
    }
    D.append(J);
    for (const Ae of O.problems) D.append(ge("p", Ae, "ppp-warn"));
    O.ready ? D.append(
      ge("p", `All ${K.batches} batches are live: ${O.codes.length.toLocaleString("en-GB")} links, none claimed. Copy them, then in Terminal (in the xtrata-2.0 folder) run:  node scripts/load-players-wall.mjs`, "ppp-ok"),
      fr("drop-copy", `Copy the ${O.codes.length.toLocaleString("en-GB")} links`, () => O.codes.join(`
`), "tiny", e.changed)
    ) : D.append(ge("p", "The links can be copied for the wall once every batch is live.", "ppp-mute")), e.now() - un > 6e4 && Ir(), $t && D.append(ge("p", $t.text, $t.ok ? "ppp-ok" : "ppp-mute"));
    const te = rn("Check again", () => {
      Me = e.now(), Ot(E), Ir();
    }, "tiny");
    return te.disabled = !!b, D.append(te), D;
  }
  function bt(E, O, K) {
    const D = O.view, J = D == null ? void 0 : D.copies, te = O.error ? O.error : !D || D.status === "pending-deposit" ? O.txid ? "payment confirming…" : "waiting for your payment" : `${J.claimed} of ${D.count} claimed${J.refunding + J.refunded ? ` · ${J.refunded} refunded${J.refunding ? `, ${J.refunding} on their way` : ""}` : ""}`, Ce = ge("li");
    if (Ce.append(ge("span", `${O.label || "Batch"} · ${O.count} × ${Wn(BigInt(O.amount))} STX`, "t"), ge("span", te, "ppp-mute")), !O.txid && O.depositTo && (!D || D.status === "pending-deposit") && Ce.append(rn("Pay now", () => void Ge(E, O.id), "tiny")), (D == null ? void 0 : D.status) === "live" && J.waiting > 0) {
      Ce.append(ge("span", `${_t(D.expires)} days left`, "ppp-mute"));
      for (const Ae of Ng) {
        const Fe = rn(`+${Ae}`, () => void Pe(E, O.id, Ae), "tiny");
        Fe.title = `Extend this batch by ${Ae} days (a signature, no payment)`, Fe.setAttribute("aria-label", `Extend ${O.label || "this batch"} by ${Ae} days`), Fe.disabled = !!b, Ce.append(Fe);
      }
    }
    if (O.codes.length && (D == null ? void 0 : D.status) === "live") {
      const Ae = H(K, O);
      Ce.append(
        fr("batch-copy:" + O.id, "Copy all links", () => Ae.join(`
`), "tiny", e.changed),
        fr("batch-csv:" + O.id, "Copy as CSV", () => ["copy,link", ...Ae.map((Fe, ft) => `${ft + 1},${Fe}`)].join(`
`), "tiny", e.changed)
      );
    } else O.codes.length || Ce.append(ge("span", "links were made on another device", "ppp-mute"));
    return Ce;
  }
  const yn = ge("select");
  yn.setAttribute("aria-label", "Plays in each copy");
  for (const E of [.../* @__PURE__ */ new Set([50, 100, 250, ...Xu])].sort((O, K) => O - K)) yn.append(ka(`${E.toLocaleString()} plays`, String(E)));
  yn.value = "50";
  const Dt = ge("input");
  Dt.type = "number", Dt.min = "1", Dt.max = String(Ta), Dt.value = "10", Dt.setAttribute("aria-label", "How many copies");
  const wn = ge("input");
  wn.maxLength = 40, wn.placeholder = "A note recipients see, e.g. Launch week (optional)", wn.setAttribute("aria-label", "Note for recipients");
  const Et = ge("p", "", "ppp-mute");
  function Vt(E, O, K) {
    const D = () => Zt(!0, yn.value, Dt.value), J = () => {
      Et.textContent = z(D());
    };
    for (const pe of [yn, Dt])
      pe.oninput = J, pe.onchange = J;
    J();
    const te = () => (wn.value.trim() || O.title).replace(/[^ -~]/g, "").slice(0, 40), Ce = rn("Sign, pay and make links", () => {
      _e(E, D(), te(), O.id);
    }, "primary");
    Ce.disabled = !!b;
    const Ae = (pe, ze) => {
      const ut = ge("label", pe);
      return ut.append(ze), ut;
    }, Fe = [
      ge("p", "Each copy is a link. Whoever opens it gets this album with its own plays, paid for by you. You pay for every copy now, in one payment; copies nobody claims come back to you when their time runs out, and you can extend that.", "ppp-mute"),
      Ae("Plays in each ", yn),
      Ae("Copies ", Dt),
      wn,
      Et,
      Ce
    ];
    e.now() - Me > 3e4 && (Me = e.now(), Ot(E));
    const ft = F(E).filter((pe) => pe.player === O.id);
    if (ft.length) {
      const pe = ge("ul", "", "ppp-gift-list");
      for (const ze of ft.slice(0, 10)) pe.append(bt(E, ze, K));
      Fe.push(pe);
    }
    const $ = En(E, F(E));
    return $ && Fe.push($), b && Fe.push(ge("p", b, "ppp-cyan")), I && Fe.push(ge("p", I, /✓/.test(I) ? "ppp-ok" : "ppp-warn")), Fe;
  }
  function Gr(E) {
    var J, te;
    const O = (J = E.gate) == null ? void 0 : J.gifts;
    if (!(O != null && O.enabled) || !O.admin || ["off", "elsewhere", "unsupported"].includes(E.step)) return null;
    const K = e.main(), D = [ge("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!K)
      D.push(ge("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (O.admin) {
      const Ce = ge("div", "", "ppp-gift-admin"), Ae = (ze, ut) => {
        const Xt = ge("label", ze);
        return Xt.append(ut), Xt;
      }, Fe = ue(K);
      Ce.append(
        ge("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        He,
        St,
        Ke,
        Ze,
        Ie,
        rn("Sign and make player", () => void Xe(K, { title: He.value, subtitle: St.value, tracks: Ke.value, cover: Ze.value, explicit: Ie.value }))
      );
      const ft = rn("Sign, pay and make links", () => {
        _e(K, lt(), pn.value.trim(), Ye.value || void 0);
      });
      ft.disabled = !!b;
      const $ = Ye.value;
      Ye.replaceChildren(ka("No album (starter copies)", ""), ...Fe.map((ze) => ka(`${ze.title} · ${ze.tracks} songs`, ze.id))), Fe.some((ze) => ze.id === $) && (Ye.value = $), Vn(), Ce.append(
        ge("p", `Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after ${kt()} days unless you extend`, "ppp-cyan"),
        Ae("Album ", Ye),
        Ae("Plays each ", Ve),
        Ae("Copies ", Ht),
        pn,
        gn,
        ft
      ), e.now() - Me > 3e4 && (Me = e.now(), Ot(K));
      const pe = F(K);
      if (pe.length) {
        const ze = ge("ul", "", "ppp-gift-list");
        for (const Xt of pe.slice(0, 20)) ze.append(bt(K, Xt, ((te = E.gate) == null ? void 0 : te.radioUrl) ?? null));
        Ce.append(ze);
        const ut = En(K, pe);
        ut && Ce.append(ut);
      }
      Ce.append(mr(K)), D.push(Ce);
    }
    return b && D.push(ge("p", b, "ppp-cyan")), I && D.push(ge("p", I, /✓/.test(I) ? "ppp-ok" : "ppp-warn")), oe.replaceChildren(...D), oe;
  }
  return { banner: X, funder: Q, renderFold: Gr, copies: Vt, liveGift: i, incomingAlbum: a, incomingStarter: c, setAside: h, pendingCode: () => t && !t.done && (!t.view || t.view.status === "live") ? t.code : null, inProgress: B };
}
const sL = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function oL(e) {
  if (!Array.isArray(e)) return [];
  const t = [];
  for (const n of e) {
    if (!n || !Number.isSafeInteger(n.slot) || n.slot < 1 || typeof n.address != "string") continue;
    const r = n.player, o = r && typeof r.id == "string" && typeof r.title == "string" && Array.isArray(r.tracks) ? r : null;
    o && t.push({
      slot: n.slot,
      address: n.address,
      state: n.state === "arrived" ? "arrived" : "sending",
      amount: String(n.amount ?? "0"),
      label: typeof n.label == "string" ? n.label : "",
      from: typeof n.from == "string" ? n.from : null,
      source: String(n.source ?? ""),
      player: o
    });
  }
  return t;
}
const iL = (e) => {
  var t, n, r;
  return [(t = e.player) == null ? void 0 : t.title, (n = e.player) == null ? void 0 : n.subtitle, e.label, `#${e.slot}`, ...(((r = e.player) == null ? void 0 : r.tracks) ?? []).filter((o) => !o.hidden).flatMap((o) => [o.title, o.artist])].filter(Boolean).join(" ").toLowerCase();
};
function aL(e, t) {
  const n = t.query.toLowerCase().split(/\s+/).filter(Boolean), r = e.filter((s) => (!t.pinnedOnly || t.pins.has(s.slot)) && (() => {
    const i = iL(s);
    return n.every((a) => i.includes(a));
  })()), o = {
    recent: (s, i) => (t.recents[i.slot] ?? 0) - (t.recents[s.slot] ?? 0) || i.slot - s.slot,
    newest: (s, i) => i.slot - s.slot,
    oldest: (s, i) => s.slot - i.slot,
    title: (s, i) => {
      var a, c;
      return (((a = s.player) == null ? void 0 : a.title) ?? "").localeCompare(((c = i.player) == null ? void 0 : c.title) ?? "") || s.slot - i.slot;
    }
  };
  return r.sort((s, i) => Number(t.pins.has(i.slot)) - Number(t.pins.has(s.slot)) || o[t.sort](s, i));
}
function cL(e, t = 100) {
  const n = Object.entries(e).sort((r, o) => o[1] - r[1]).slice(0, t);
  return Object.fromEntries(n.map(([r, o]) => [Number(r), o]));
}
const df = /* @__PURE__ */ new Set(), Ch = (e) => (df.add(e), () => {
  df.delete(e);
}), Nl = () => {
  for (const e of [...df])
    try {
      e();
    } catch {
    }
}, Fg = "xtrata:al-thumb:v1:", Th = "-", $a = 96, lL = 24 * 1024 * 1024, vn = /* @__PURE__ */ new Map(), jg = /* @__PURE__ */ new Set(), ff = [];
let qu = !1, Wu;
const Wa = (e, t) => {
  try {
    if (t === void 0) return window.localStorage.getItem(Fg + e);
    window.localStorage.setItem(Fg + e, t);
  } catch {
  }
  return null;
};
function Bh(e) {
  return new Promise((t) => {
    var n;
    try {
      const r = document.createElement("canvas"), o = (n = r.getContext) == null ? void 0 : n.call(r, "2d");
      if (!o) return t(e);
      const s = new Image(), i = setTimeout(() => t(e), 8e3);
      s.onload = () => {
        clearTimeout(i);
        try {
          const a = Math.min(s.naturalWidth, s.naturalHeight);
          if (!a) return t(e);
          r.width = r.height = $a, o.fillStyle = "#143a40", o.fillRect(0, 0, $a, $a), o.drawImage(s, (s.naturalWidth - a) / 2, (s.naturalHeight - a) / 2, a, a, 0, 0, $a, $a), t(r.toDataURL("image/jpeg", 0.82));
        } catch {
          t(e);
        }
      }, s.onerror = () => {
        clearTimeout(i), t(e);
      }, s.src = e;
    } catch {
      t(e);
    }
  });
}
async function uL(e) {
  var c, u, h, d, m;
  const t = await fetch("/inscription/" + e, { signal: AbortSignal.timeout(6e4) }), n = (t.headers.get("content-type") || "").toLowerCase();
  if (!t.ok)
    return await ((c = t.body) == null ? void 0 : c.cancel()), null;
  if (n.startsWith("image/"))
    return await ((u = t.body) == null ? void 0 : u.cancel()), "/inscription/" + e;
  if (!n.includes("text/html"))
    return await ((h = t.body) == null ? void 0 : h.cancel()), "";
  let r = "", o = 0;
  const s = (w) => {
    let v = 0;
    for (; ; ) {
      const x = r.slice(v).search(/<img\b/i);
      if (x < 0)
        return r = w ? "" : r.slice(Math.max(0, r.length - 4)), null;
      const L = v + x, N = r.indexOf(">", L);
      if (N < 0)
        return r = r.slice(L), null;
      const U = r.slice(L, N + 1), A = U.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (A) return A[1].replace(/&amp;/g, "&");
      const T = U.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (T) return "/inscription/" + T[1];
      v = N + 1;
    }
  }, i = (m = (d = t.body) == null ? void 0 : d.getReader) == null ? void 0 : m.call(d);
  if (!i)
    return r = await t.text(), s(!0) ?? "";
  const a = new TextDecoder();
  for (; ; ) {
    const { done: w, value: v } = await i.read();
    if (w) break;
    o += v.byteLength, r += a.decode(v, { stream: !0 });
    const x = s(!1);
    if (x)
      return await i.cancel(), x;
    if (o > lL)
      return await i.cancel(), null;
  }
  return r += a.decode(), s(!0) ?? "";
}
async function dL() {
  if (!qu) {
    qu = !0;
    try {
      for (; ff.length; ) {
        const e = ff.shift();
        if (!vn.has(e))
          try {
            const t = await uL(e);
            if (t === null) continue;
            if (!t) {
              vn.set(e, ""), Wa(e, Th), Nl();
              continue;
            }
            const n = await Bh(t);
            vn.set(e, n), n.startsWith("data:image/jpeg") && Wa(e, n), Nl();
          } catch {
          }
      }
    } finally {
      qu = !1;
    }
  }
}
function Nh(e, t) {
  if (t && !vn.get(e) ? (vn.set(e, t), Bh(t).then((r) => {
    r !== t && (vn.set(e, r), r.startsWith("data:image/jpeg") && Wa(e, r), Nl());
  })) : t === "" && !vn.has(e) && vn.set(e, ""), vn.has(e)) return vn.get(e);
  const n = Wa(e);
  if (n != null) {
    const r = n === Th ? "" : n;
    return vn.set(e, r), r;
  }
  return jg.has(e) || (jg.add(e), ff.push(e), Wu || (Wu = setTimeout(() => {
    Wu = void 0, dL();
  }, 1200))), "";
}
function Rg(e) {
  if (vn.has(e)) return vn.get(e);
  const t = Wa(e);
  if (t == null) return null;
  const n = t === Th ? "" : t;
  return vn.set(e, n), n;
}
const Zu = /* @__PURE__ */ new Map(), Ju = /* @__PURE__ */ new Set();
function tl(e) {
  return !e || !Number.isSafeInteger(e) || e < 0 ? "" : Zu.has(e) ? Zu.get(e) : (Ju.has(e) || (Ju.add(e), fetch("/inscription/" + e, { signal: AbortSignal.timeout(2e4) }).then(async (t) => {
    var r, o, s, i;
    const n = (t.headers.get("content-type") || "").toLowerCase();
    if (!t.ok)
      throw await ((r = t.body) == null ? void 0 : r.cancel()), new Error("no cover");
    return n.startsWith("image/") ? (await ((o = t.body) == null ? void 0 : o.cancel()), "/inscription/" + e) : n.includes("text/html") ? (((s = (await t.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : s[1]) ?? "").replace(/&amp;/g, "&") : (await ((i = t.body) == null ? void 0 : i.cancel()), "");
  }).then((t) => {
    Zu.set(e, t), Nl();
  }).catch(() => {
    Ju.delete(e);
  })), "");
}
const Bi = 12, fL = 5e3, Pn = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, Ni = (e, t, n = "") => {
  const r = Pn("button", e, n);
  return r.type = "button", r.onclick = t, r;
};
function hL(e) {
  let t, n = [], r = 0, o = !1, s = !1, i = -1 / 0, a = "", c = "recent", u = !1, h = Bi;
  const d = Pn("div", "", "ppp-shelf-box");
  Ch(() => e.changed());
  const m = (M) => "xtrata.radio.shelf.pins.v1:" + M, w = (M) => "xtrata.radio.shelf.recent.v1:" + M, v = (M, P) => {
    try {
      return JSON.parse(e.store.get(M) || "null") ?? P;
    } catch {
      return P;
    }
  }, x = (M) => new Set(v(m(M), []).filter((P) => Number.isSafeInteger(P))), L = (M) => {
    const P = v(w(M), {}), W = {};
    for (const [R, le] of Object.entries(P)) Number.isSafeInteger(Number(R)) && typeof le == "number" && (W[Number(R)] = le);
    return W;
  };
  async function N(M) {
    if (!o) {
      o = !0, s = !1;
      try {
        const P = [];
        let W = 0, R = 0;
        for (let le = 0; le < fL / 100 + 1; le++) {
          const ue = await e.json(`/radio/gift/shelf?root=${encodeURIComponent(M)}&after=${W}&limit=100`);
          if (P.push(...oL(ue == null ? void 0 : ue.shelf)), R = Number(ue == null ? void 0 : ue.total) || P.length, !(ue != null && ue.next) || !Number.isSafeInteger(ue.next)) break;
          W = ue.next;
        }
        M === t && (n = P, r = R, i = e.now());
      } catch {
        s = !0;
      } finally {
        o = !1, e.changed();
      }
    }
  }
  const U = () => {
    i = -1 / 0;
  }, A = Pn("input");
  A.type = "search", A.placeholder = "Search title, artist or #", A.setAttribute("aria-label", "Search your albums"), A.oninput = () => {
    a = A.value, h = Bi, e.changed();
  };
  const T = Pn("select");
  T.setAttribute("aria-label", "Sort albums");
  for (const M of sL) {
    const P = document.createElement("option");
    P.value = M.value, P.textContent = M.label, T.append(P);
  }
  T.onchange = () => {
    c = T.value, h = Bi, e.changed();
  };
  const B = Ni("", () => {
    u = !u, h = Bi, e.changed();
  }, "tiny"), X = Pn("div", "", "ppp-shelf-tools");
  X.append(A, T, B);
  const Q = Pn("div"), oe = Pn("div");
  function Y(M) {
    const P = M.step === "off" || M.step === "elsewhere" ? void 0 : M.root;
    if (P !== t && (t = P, n = [], r = 0, i = -1 / 0, h = Bi), !P || M.walletCannotAlbums) return null;
    if (!o && e.now() - i > 5 * 6e4 && N(P), !n.length)
      return s ? (oe.replaceChildren(Pn("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), Ni("Try again", () => {
        i = -1 / 0, e.changed();
      }, "quiet")), d.replaceChildren(oe), d) : null;
    const W = x(P), R = L(P), le = aL(n, { query: a, sort: c, pinnedOnly: u, pins: W, recents: R });
    A.value !== a && (A.value = a), T.value = c, B.textContent = u ? "★ Pinned only" : "☆ Pinned only", B.setAttribute("aria-pressed", String(u));
    const ue = [];
    if (M.slot > 0 && ue.push(Ni("← My player", () => e.open(0), "quiet")), !le.length) ue.push(Pn("p", "No album matches that.", "ppp-mute"));
    else {
      const Xe = Pn("ul", "", "ppp-shelf-list");
      for (const C of le.slice(0, h)) {
        const F = Pn("li", "", C.slot === M.slot ? "now" : ""), re = W.has(C.slot), de = Ni(re ? "★" : "☆", () => {
          const lt = new Set(W);
          re ? lt.delete(C.slot) : lt.add(C.slot), e.store.set(m(P), JSON.stringify([...lt])), e.changed();
        }, "tiny");
        de.setAttribute("aria-label", re ? `Unpin ${C.player.title}` : `Pin ${C.player.title}`);
        const Be = [C.player.subtitle, `${Dr(C.player).length} ${Dr(C.player).length === 1 ? "song" : "songs"}`, C.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), Me = C.slot === M.slot, Ot = Ni(Me ? "Playing" : "Select", () => {
          e.store.set(w(P), JSON.stringify(cL({ ...R, [C.slot]: e.now() }))), e.open(C.slot);
        }, Me ? "tiny ppp-pick" : "tiny primary ppp-pick");
        Ot.disabled = Me;
        const Ge = Dr(C.player)[0], _e = C.player.cover ?? (Ge == null ? void 0 : Ge.id), Pe = _e ? Nh(String(_e)) : "", _t = Pn("span", "", "ppp-shelf-art");
        if (Pe) {
          const lt = document.createElement("img");
          lt.src = Pe, lt.alt = "", lt.decoding = "async", _t.append(lt);
        } else _t.textContent = "💿";
        const En = Pn("span", "", "ppp-shelf-txt");
        En.append(Pn("span", C.player.title, "t"), Pn("span", Be, "ppp-mute")), F.append(de, _t, En, Ot), Xe.append(F);
      }
      ue.push(Xe), le.length > h && ue.push(Ni(`Show more (${le.length - h} left)`, () => {
        h += Bi, e.changed();
      }, "quiet"));
    }
    return s && ue.push(Pn("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), Q.replaceChildren(...ue), d.firstChild !== X && d.replaceChildren(X, Q), d;
  }
  return { render: Y, invalidate: U, count: () => r || n.length, latest: () => {
    if (!t || !n.length) return null;
    const M = L(t), P = [...n].filter((W) => W.player).sort((W, R) => (M[R.slot] ?? 0) - (M[W.slot] ?? 0) || R.slot - W.slot)[0];
    return P ? { slot: P.slot, title: P.player.title } : null;
  } };
}
const zg = "http://www.w3.org/2000/svg", pL = [
  ["#ececec", "M17 65 18 66V191L243 192 424 391H427L609 192H729L730 191H833V66L834 65 833 64H558L426 209H424L292 64H18zM29 119 32 117 271 118 423 284H428L580 118H794L795 117 820 118 822 120V179L821 180H603L428 372 424 373 248 180H31L30 179zM29 77 31 75 287 76 425 227 447 205 564 76 816 75 822 77V105L820 107H582L574 107 426 268H424L277 107H31L29 105z"],
  ["#3a7db5", "M812 193 809 197 760 238H620L605 253 589 272 436 439 541 555 621 641H759L764 643 809 681 825 682 826 681 822 676 784 645V643L792 641H837L758 555 753 552H742L640 440V437L734 333 741 326 755 325 807 268 836 239V238H784L783 235 791 227 828 196V194L826 193zM657 326H719L720 329 667 387H664V390L625 433 621 439 674 498 704 529 721 549 720 552H657L555 441 556 437zM626 251H802L803 254 748 313H651L537 438V440L648 562 652 565H750L797 616 804 625 803 628H627L455 441V439L463 429zM23 193 34 205 69 235 68 238H15V239L19 241 94 323 101 326H110L211 436V440L113 548 109 552H99L94 554 17 638 16 641H63L67 643V645L28 678 26 681 27 682 43 681 90 641H230L309 556 354 505 384 474 399 456 406 450 414 441V439L231 238H92L41 196 40 193zM136 326H193L195 327 295 437V442L279 458 194 552H131L130 549 230 439 179 381 174 377 132 331V328zM49 251H226L344 380 395 438V442L224 628H48L47 625 101 565H199L299 457 314 439 300 422 199 313H103L48 255z"],
  ["#e98a32", "M834 687 831 684H822L817 686 812 684 811 685H606L427 490 423 491 413 501 246 685H28L27 684 18 685 17 689 18 791H288L291 790 424 644H427L562 791H831L833 790zM30 700 32 697H252L424 509H427L597 695 601 697H818L821 701V775L819 778H567L460 660 427 626 422 627 411 638 284 778H32L30 773z"]
];
function Ml(e = "", t = !1) {
  const n = document.createElementNS(zg, "svg");
  n.setAttribute("viewBox", "0 40 850 770"), n.setAttribute("aria-hidden", "true"), e && n.setAttribute("class", e);
  for (const [r, o] of pL) {
    const s = document.createElementNS(zg, "path");
    s.setAttribute("fill-rule", "evenodd"), s.setAttribute("fill", t ? "currentColor" : r), s.setAttribute("d", o), n.append(s);
  }
  return n;
}
const rt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, fn = (e, t, n, r = !1) => {
  const o = rt("button", e, t);
  return o.type = "button", o.disabled = r, o.onclick = n, o;
}, Db = (e) => e.toLocaleString(), Gg = { gift: ["Picked", "Passkey", "Listen"], fresh: ["Welcome", "Passkey", "Listen"] }, gL = (e) => e === "gift" || e === "new" ? 1 : e === "arriving" ? 2 : e === "landed" ? 3 : -1;
function _l(e, t) {
  const n = rt("ol", "al-steps");
  return n.setAttribute("aria-label", t >= e.length ? "All steps done" : `Step ${t + 1} of ${e.length}: ${e[t]}`), e.forEach((r, o) => {
    const s = rt("li", o < t ? "is-done" : o === t ? "is-now" : "");
    s.append(rt("i", "", o < t ? "✓" : String(o + 1)), rt("span", "", r)), n.append(s);
  }), n;
}
function yL() {
  const e = rt("div", "tier-disc tier-disc--mid");
  return e.dataset.tier = "mystery", e.setAttribute("role", "img"), e.setAttribute("aria-label", "A player waiting to be opened"), e.append(rt("span", "tier-disc__mark", "?")), e;
}
const xn = {
  gift: { title: "Your disc is ready", primary: "Claim my free player", play: "Play", hint: "Free. Face ID or fingerprint.", returning: "I already have a player", full: "Look around first" },
  installedNew: { title: "Open your player", body: "Use your face or fingerprint to open the player you already have.", primary: "Open my player", hint: "Face ID or fingerprint.", fresh: "I’m new: make my player" },
  new: {
    title: "Music that pays the artist",
    body: "Every play counts for whoever owns the song. Make your player once and you’re in.",
    primary: "Make my player",
    hint: "One tap with Face ID or your fingerprint. No app, no account, no password.",
    returning: "I’ve listened here before",
    full: "Look around first"
  },
  back: { title: "Welcome back", body: "Unlock your player and carry on listening.", primary: "Unlock my player", hint: "One tap with Face ID or your fingerprint.", returning: "Use a different passkey", full: "Look around first" },
  backClaim: {
    title: "A free player is waiting",
    body: "This device already has a player you made before. You can claim the free one as a new, separate player with its own passkey. Your existing player, and anything in it, stays exactly as it is.",
    primary: "Claim it as a new player",
    hint: "One tap with Face ID or your fingerprint. You can switch between your players at any time.",
    unlock: "Open my existing player instead",
    replace: "Replace my old player",
    replaceHint: "Its balance is sent back first, then it is removed from this device. You end up with one player that has 24 backup words.",
    both: "Keep both players"
  },
  arriving: { title: "Your player is made", body: "Your plays are on their way to it. This usually takes about a minute: keep this page open and it carries on by itself.", playing: "Your player is made" },
  landed: { title: "You’re in", primary: "Start listening", playing: "Keep listening" },
  empty: { title: "Your player is ready", body: "It has no plays yet. Add some and every song you hear pays its artist.", primary: "Add plays", full: "Look around the radio" },
  checking: "One moment…",
  asking: "Continue in the box below."
}, wL = (e) => e ? `Disc ${e} is yours` : xn.gift.title, mL = (e, t, n = !1) => n ? "What is inside? Play it to find out." : e ? `${Db(e)} plays inside. Every play pays the artist.` : "Every play pays the artist.", bL = (e) => e ? `${Db(e)} plays. Every one pays the artist.` : "Every play pays the artist.";
function Kg(e, t = !1) {
  const n = rt("div", "al-now" + (t ? " al-now--big" : "")), r = rt("img", "al-now__art");
  r.src = e.art, r.alt = "";
  const o = rt("div", "al-now__t");
  o.append(rt("b", "", e.title || "Playing now"), rt("span", "", e.artist));
  const s = rt("i", "al-now__eq" + (e.playing ? " is-on" : ""));
  return s.setAttribute("aria-hidden", "true"), s.append(rt("s"), rt("s"), rt("s")), n.append(r, o, s), n.setAttribute("role", "group"), n.setAttribute("aria-label", `${e.playing ? "Playing" : "Starting"}: ${e.title || "your first song"}${e.artist ? ` by ${e.artist}` : ""}`), n;
}
const xL = (e) => e ? `You got a ${e.name} player` : xn.landed.title;
function SL(e, t = !0) {
  const n = rt("div", "tier-disc" + (t ? " tier-disc--big" : ""));
  return n.dataset.tier = e.id, n.setAttribute("role", "img"), n.setAttribute("aria-label", `${e.name} player`), n.append(rt("span", "tier-disc__mark", e.mark)), n;
}
function vL(e) {
  const t = document.documentElement;
  let n = !1;
  return {
    showing: () => n,
    /** `albumActive`: the album view owns the mount right now, so this view only steps aside and touches nothing. */
    render(r, o = !1) {
      var h, d;
      if (!r) {
        n && !o && (e.hidden = !0, e.replaceChildren(), delete t.dataset.view, delete t.dataset.asking), n = !1, delete t.dataset.welcome;
        return;
      }
      n = !0, t.dataset.view = "album", t.dataset.welcome = r.mode, r.asking ? t.dataset.asking = "1" : delete t.dataset.asking;
      const s = rt("header", "al-top"), i = rt("a", "al-brand");
      i.href = "/radio", i.append(Ml("al-logo"), rt("span", "", "Xtrata "), rt("b", "", "Music")), s.append(i);
      const a = rt("div", "al-body al-body--welcome"), c = rt("div", "al-welcome"), u = r.mode;
      if (u === "checking")
        c.append(rt("p", "al-welcome-wait", xn.checking));
      else {
        const m = gL(u);
        m >= 0 && c.append(_l(u === "new" ? Gg.fresh : Gg.gift, m)), r.tier && (u === "landed" || u === "back" || u === "empty") ? c.append(SL(r.tier)) : u === "gift" || u === "arriving" ? c.append(yL()) : u === "new" && c.append(Ml("al-hero-mark"));
        const w = r.now && (u === "gift" || u === "arriving" || u === "landed") ? r.now : null, v = u === "new" && !!r.installed;
        if (c.append(rt("h1", "", u === "landed" ? xL(r.tier) : u === "back" && r.tier ? `Your ${r.tier.name} player` : u === "gift" ? wL(r.spot) : v ? xn.installedNew.title : xn[u].title)), w && u === "arriving" ? c.append(Kg(w, !0)) : c.append(rt("p", "", u === "gift" ? mL(r.plays, r.from, r.mystery) : u === "landed" ? bL(r.plays) : v ? xn.installedNew.body : xn[u].body)), w && u !== "arriving" && c.append(Kg(w)), r.status.length) {
          const x = rt("div", "al-status");
          x.setAttribute("role", "status"), x.append(...r.status), c.append(x);
        }
        if (r.asking) c.append(rt("p", "al-hint al-hint--ask", xn.asking));
        else if (u === "back" && r.claimNew) {
          const x = xn.backClaim;
          c.append(rt("p", "al-hint", x.body)), r.canStart && r.replaceOld ? c.append(fn("al-primary", x.replace, r.replaceOld, r.busy), rt("p", "al-hint", x.replaceHint), fn("al-link", x.both, r.claimNew, r.busy), fn("al-link", x.unlock, r.unlock, r.busy)) : r.canStart && c.append(fn("al-primary", x.primary, r.claimNew, r.busy), rt("p", "al-hint", x.hint), fn("al-link", x.unlock, r.unlock, r.busy)), c.append(fn("al-link", xn.back.full, r.full));
        } else if (u === "gift") {
          const x = xn.gift;
          if (r.canStart) {
            const L = fn("al-primary" + (r.intro ? " al-primary--play" : ""), r.intro ? x.play : x.primary, r.start, r.busy);
            c.append(L, rt("p", "al-hint", x.hint));
          }
          r.canStart ? c.append(fn("al-link", x.returning, r.returning, r.busy)) : c.append(fn("al-link", x.full, r.full));
        } else if (u === "new" && r.installed) {
          const x = xn.installedNew;
          r.canStart && c.append(fn("al-primary", x.primary, r.returning, r.busy), rt("p", "al-hint", x.hint), fn("al-link", x.fresh, r.start, r.busy)), c.append(fn("al-link", xn.new.full, r.full));
        } else if (u === "new" || u === "back") {
          const x = xn[u];
          r.canStart && c.append(fn("al-primary", x.primary, u === "back" ? r.unlock : r.start, r.busy), rt("p", "al-hint", x.hint)), r.canStart && c.append(fn("al-link", x.returning, r.returning, r.busy)), c.append(fn("al-link", x.full, r.full));
        } else if (u === "landed") {
          if (c.append(fn("al-primary", (h = r.now) != null && h.playing ? xn.landed.playing : xn.landed.primary, r.full)), (d = r.albums) != null && d.length && !r.now) {
            c.append(rt("p", "al-hint", "Or start with an album that comes with your player:"));
            for (const x of r.albums) {
              const L = fn("al-album", "", x.run);
              if (x.cover) {
                const U = rt("img", "al-album__art");
                U.src = x.cover, U.alt = "", L.classList.add("al-album--art"), L.append(U);
              }
              const N = rt("span", "al-album__t");
              N.append(rt("b", "", x.title), rt("span", "", x.by)), L.append(N), c.append(L);
            }
          }
        } else u === "empty" && c.append(fn("al-primary", xn.empty.primary, r.restock), fn("al-link", xn.empty.full, r.full));
      }
      a.append(c), e.hidden = !1, e.replaceChildren(s, a);
    }
  };
}
const AL = 20, EL = ["Album", "Passkey", "Listen"], Ln = (e, t = 22, n = !1) => `<svg width="${t}" height="${t}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${e}</svg>`, Qt = {
  grid: Ln('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: Ln('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: Ln('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: Ln('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: Ln('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: Ln('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: Ln('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: Ln('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: Ln('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: Ln('<path d="M6 9l6 6 6-6"/>', 18),
  right: Ln('<path d="M9 6l6 6-6 6"/>', 16),
  close: Ln('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: Ln('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: Ln('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: Ln('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: Ln('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: Ln('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function ae(e, t = {}, ...n) {
  const r = document.createElement(e);
  for (const [o, s] of Object.entries(t))
    s == null || s === !1 || (o === "class" ? r.className = String(s) : o === "html" ? r.innerHTML = String(s) : o.startsWith("on") && typeof s == "function" ? r[o.toLowerCase()] = s : o === "disabled" ? r.disabled = !!s : r.setAttribute(o, s === !0 ? "" : String(s)));
  for (const o of n) o != null && o !== !1 && r.append(o);
  return r;
}
const _n = (e, ...t) => ae("button", { type: "button", ...e }, ...t), Rc = (e) => `${Math.floor(e / 60)}:${String(Math.floor(e % 60)).padStart(2, "0")}`, Ia = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`, kL = { music: "My music", device: "This device", gifts: "Albums (admin)" }, $L = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function Vg(e, t, n = {}) {
  const r = !!n.list;
  let o = null, s = "", i = !1;
  const a = document.documentElement;
  function c(b) {
    var M, P, W;
    if (!b || !Number.isSafeInteger(b)) return "";
    const I = (W = (P = (M = t.radio()) == null ? void 0 : M.getState) == null ? void 0 : P.call(M)) == null ? void 0 : W.albumCover;
    return I != null && I.url && Number(I.tokenId) === b ? I.url : tl(b);
  }
  Ch(() => Y());
  function u(b) {
    var M;
    s = b, b ? a.dataset.sheet = b : delete a.dataset.sheet;
    const I = document.querySelector(".side");
    if (b && b !== "more") {
      for (const R of $L[b]) {
        const le = I == null ? void 0 : I.querySelector(R);
        le && (le.open = !0);
      }
      const P = document.getElementById("sheetTitle");
      P && (P.textContent = kL[b]);
      const W = document.getElementById("sheetExtra");
      W && W.replaceChildren(...b === "music" ? [d()] : []), (M = I == null ? void 0 : I.scrollTo) == null || M.call(I, { top: 0 });
    }
    Y();
  }
  const h = r ? null : document.getElementById("sheetClose");
  h && (h.onclick = () => u("")), r || document.addEventListener("keydown", (b) => {
    b.key === "Escape" && s && a.dataset.view === "album" && u("");
  });
  const d = () => _n(
    { class: "al-row", onClick: () => {
      u(""), t.openPlayer();
    } },
    ae("span", { class: "al-row-i", html: Qt.radio }),
    ae("span", { class: "al-row-t" }, ae("b", {}, "Xtrata Radio"), ae("small", {}, "Every song on-chain · FM, liked, all")),
    ae("span", { class: "al-row-go", html: Qt.right })
  );
  let m = null, w = !1;
  const v = () => {
    var I;
    const b = t.radio();
    w || !(b != null && b.subscribe) || (w = !0, b.subscribe((M) => {
      m = M, (o == null ? void 0 : o.mode) === "open" && Y();
    }), m = ((I = b.getState) == null ? void 0 : I.call(b)) ?? null);
  };
  r || setInterval(() => {
    var P, W;
    if ((o == null ? void 0 : o.mode) !== "open" || !(m != null && m.playing)) return;
    const b = (W = (P = t.radio()) == null ? void 0 : P.getPosition) == null ? void 0 : W.call(P), I = e.querySelector(".al-bar > i"), M = e.querySelectorAll(".al-times span");
    !b || !I || (I.style.width = b.duration ? `${Math.min(100, b.current / b.duration * 100)}%` : "0%", M.length === 2 && (M[0].textContent = Rc(b.current || 0), M[1].textContent = b.duration ? Rc(b.duration) : "–:––"));
  }, 500);
  let x = "", L = null;
  function N(b, I, M = {}) {
    const P = M.song || c(b.cover), R = [P ? ae("img", { src: P, alt: M.song ? "Song artwork" : `${b.title} cover` }) : ae("div", { class: "al-cover-fallback" }, ae("b", {}, b.title), b.subtitle ? ae("span", {}, b.subtitle) : null), M.paused ? ae("span", { class: "al-paused" }, ae("i", { html: Qt.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], le = "al-cover" + (I ? "" : " al-cover--small") + (M.paused ? " is-paused" : "");
    return M.flip ? (R.push(ae("span", { class: "al-flip", "aria-hidden": "true", html: Qt.flip })), _n({ class: le + " is-flippable", "aria-label": M.flipped ? "Show this song’s artwork" : `Show the ${b.title} cover`, onClick: M.flip }, ...R)) : ae("div", { class: le }, ...R);
  }
  function U(b) {
    return b.plays === null || b.plays === void 0 ? ae("span", { class: "al-chip al-chip--quiet" }, b.playsComing ? "Plays on their way…" : "…") : b.plays === 0 ? ae("span", { class: "al-chip al-chip--out" }, b.playsComing ? "Plays on their way…" : "No plays left") : ae("span", { class: "al-chip" + (b.plays <= AL ? " al-chip--low" : "") }, `${Ia(b.plays, "play", "plays")} left`);
  }
  function A(b) {
    const I = b.player, M = I.tracks.filter((W) => !W.hidden), P = [];
    return b.step !== void 0 && P.push(_l(EL, b.step)), b.mode === "arrive" && b.from && P.push(ae("p", { class: "al-from" }, ae("span", { html: Qt.gift }), ae("span", {}, ae("b", {}, b.from), " sent you an album"))), P.push(N(I, !0)), P.push(ae(
      "div",
      { class: "al-intro" },
      ae("h1", {}, I.title),
      I.subtitle ? ae("p", { class: "al-artist" }, I.subtitle) : null,
      M.length ? ae("p", { class: "al-songline" }, M.map((W) => W.title || `#${W.id}`).join(" · ")) : null,
      ae("span", { class: "al-chip" }, [Ia(M.length, "song", "songs"), b.offered ? Ia(b.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), b.status.length && P.push(ae("div", { class: "al-status", role: "status" }, ...b.status)), P.push(ae("div", { class: "al-grow" })), b.asking ? P.push(ae("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : b.primary && P.push(_n({ class: "al-primary", onClick: b.primary.run, disabled: b.busy }, ae("span", { html: Qt.playSmall }), b.primary.label)), b.hint && !b.asking && P.push(ae("p", { class: "al-hint" }, b.hint)), b.secondary && !b.asking && P.push(_n({ class: "al-link", onClick: b.secondary.run, disabled: b.busy }, b.secondary.label)), P;
  }
  function T(b, I) {
    const { songs: M, current: P, started: W, own: R, out: le, waiting: ue } = I, Xe = b.player, C = t.radio(), F = [];
    F.push(ae("div", { class: "al-listhead" }, ae("span", {}, ae("b", {}, Xe.title), ` · ${Ia(M.length, "song", "songs")}`), U(b)));
    const re = c(Xe.cover), de = "album:" + Xe.cover;
    re && !vn.has(de) && (vn.set(de, re), Bh(re).then((Me) => {
      Me !== re && (vn.set(de, Me), Y());
    }));
    const Be = re ? vn.get(de) || re : "";
    return F.push(ae("ol", { class: "al-tracks" }, ...M.map((Me, Ot) => {
      const Ge = String(Me.id) === P, _e = Nh(String(Me.id), Ge && W ? R : void 0);
      return ae("li", {}, _n(
        { class: "al-track" + (Ge ? " is-on" : ""), "aria-label": `Play ${Me.title || "#" + Me.id}`, "aria-current": Ge ? "true" : void 0, disabled: le || ue, onClick: () => {
          var Pe;
          return (Pe = C == null ? void 0 : C.playToken) == null ? void 0 : Pe.call(C, Me.id);
        } },
        ae(
          "span",
          { class: "al-th" + (_e ? "" : " is-blank") },
          _e ? ae("img", { src: _e, alt: "", decoding: "async" }) : Be ? ae("img", { src: Be, alt: "", decoding: "async" }) : null,
          _e ? null : ae("span", { class: "al-n" }, String(Ot + 1)),
          Ge ? ae("span", { class: "al-eq", html: Qt.eq }) : null
        ),
        ae("span", { class: "al-tt" }, Me.title || `#${Me.id}`, Me.explicit ? ae("span", { class: "exp", title: "Explicit lyrics: only plays when you choose it" }, "E") : null)
      ));
    }))), F;
  }
  function B(b) {
    var _e;
    const I = b.player, M = I.tracks.filter((Pe) => !Pe.hidden), P = t.radio(), W = m == null ? void 0 : m.nowPlaying, R = W && I.tracks.some((Pe) => String(Pe.id) === String(W.tokenId)) ? String(W.tokenId) : null, le = R ? I.tracks.find((Pe) => String(Pe.id) === R) : null, ue = b.plays === 0 && !b.playsComing, Xe = !!b.playsComing && !b.plays, C = !!(m != null && m.playing) && !!R, F = m == null ? void 0 : m.heart, re = R ? (_e = P == null ? void 0 : P.getPosition) == null ? void 0 : _e.call(P) : null;
    R && (C || ((re == null ? void 0 : re.current) ?? 0) > 0.5) && (x = I.id);
    const de = !!R && x === I.id;
    L && L !== R && (L = null);
    const Be = de ? String((W == null ? void 0 : W.cover) || "") : "", Me = !!Be && L === R, Ge = [N(I, !ue, { song: Me ? "" : Be, paused: de && !C, flip: Be ? () => {
      L = L === R ? null : R, Y();
    } : void 0, flipped: Me })];
    if (Ge.push(ae(
      "div",
      { class: "al-now" },
      ae(
        "div",
        { class: "al-now-t" },
        ae("div", { class: "al-song" }, le ? le.title || (W == null ? void 0 : W.title) || `#${le.id}` : I.title),
        ae("div", { class: "al-artist" }, le ? le.artist || (W == null ? void 0 : W.artist) || I.subtitle : I.subtitle || "Press play")
      ),
      R ? _n({ class: "al-icon" + (F != null && F.liked ? " is-on" : ""), "aria-label": F != null && F.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(F != null && F.liked)), disabled: !!(F != null && F.pending) || !!(F != null && F.locked) || Xe, onClick: () => {
        var Pe;
        return (Pe = P == null ? void 0 : P.toggleLike) == null ? void 0 : Pe.call(P);
      }, html: F != null && F.liked ? Qt.heartOn : Qt.heart }) : null
    )), ue)
      Ge.push(ae(
        "div",
        { class: "al-out" },
        ae("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        ae("p", { class: "al-out-t" }, "You've played this album out"),
        ae("p", { class: "al-out-s" }, "Add plays to keep listening."),
        X(b, !0)
      ));
    else {
      const Pe = re != null && re.duration ? Math.min(100, re.current / re.duration * 100) : 0;
      Ge.push(ae(
        "div",
        { class: "al-prog" },
        ae("div", { class: "al-bar" }, ae("i", { style: `width: ${Pe}%` })),
        ae("div", { class: "al-times" }, ae("span", {}, Rc((re == null ? void 0 : re.current) || 0)), ae("span", {}, re != null && re.duration ? Rc(re.duration) : "–:––"))
      ));
    }
    return Ge.push(ae(
      "div",
      { class: "al-ctl" + (ue || Xe ? " is-off" : "") },
      _n({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: ue || Xe, onClick: () => {
        var Pe;
        return (Pe = P == null ? void 0 : P.prev) == null ? void 0 : Pe.call(P);
      }, html: Qt.prev }),
      _n({ class: "al-play", "aria-label": C ? "Pause" : "Play", disabled: ue || Xe, onClick: () => {
        var Pe;
        return (Pe = P == null ? void 0 : P.playPause) == null ? void 0 : Pe.call(P);
      }, html: C ? Qt.pause : Qt.play }),
      _n({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: ue || Xe, onClick: () => {
        var Pe;
        return (Pe = P == null ? void 0 : P.next) == null ? void 0 : Pe.call(P);
      }, html: Qt.next })
    )), b.status.length && Ge.push(ae("div", { class: "al-status", role: "status" }, ...b.status)), Ge.push(...T(b, { songs: M, current: R, started: de, own: Be, out: ue, waiting: Xe })), Ge.push(ae("div", { class: "al-grow" })), Ge.push(_n(
      { class: "al-more", "aria-expanded": String(s === "more"), onClick: () => u(s === "more" ? "" : "more") },
      ae("span", {}, "More ", ae("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      ae("span", { html: Qt.down })
    )), Ge;
  }
  function X(b, I) {
    const M = ae("div", { class: "al-topups" + (I ? " al-topups--primary" : "") }), P = I ? [b.topUps[1] ?? b.topUps[0]] : [...b.topUps];
    for (const W of P) {
      const R = b.myPlays !== void 0 && b.myPlays >= W && !b.playsComing && !b.busy;
      M.append(_n({ class: "al-topup", disabled: !R, onClick: () => t.topUp(W) }, I ? `Add ${W.toLocaleString()} plays` : `+${W.toLocaleString()}`));
    }
    return I && M.append(_n({ class: "al-link", onClick: () => u("more") }, "Other amounts")), M;
  }
  function Q(b) {
    const I = b.myPlays !== void 0 && b.myPlays >= (b.topUps[0] ?? 0), M = ae(
      "div",
      { class: "al-card" },
      ae("div", { class: "al-card-h" }, ae("b", {}, `Add plays to ${b.player.title}`), ae("span", { class: "al-mono" }, b.plays === null || b.plays === void 0 ? "" : `${b.plays.toLocaleString()} left`)),
      X(b, !1),
      ae("p", { class: "al-mute al-small" }, b.playsComing ? "Plays are on their way. Add more once they arrive." : b.myPlays === void 0 ? "Checking My player…" : I ? `Moved from My player · ${Ia(b.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !I && !b.playsComing && b.myPlays !== void 0 ? _n({ class: "al-link", onClick: () => {
        u(""), t.openPlayer();
      } }, "Open My player") : null
    ), P = (R, le, ue, Xe) => _n(
      { class: "al-row", onClick: Xe },
      ae("span", { class: "al-row-i", html: R }),
      ae("span", { class: "al-row-t" }, ae("b", {}, le), ae("small", {}, ue)),
      ae("span", { class: "al-row-go", html: Qt.right })
    ), W = ae(
      "div",
      { class: "al-how" + (i ? " is-open" : "") },
      P(Qt.info, "How plays work", "Every play counts for the song’s owner", () => {
        i = !i, Y();
      }),
      i ? ae("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return ae(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      ae("div", { class: "al-sheet-h" }, ae("b", {}, "More"), _n({ class: "al-icon", "aria-label": "Close", onClick: () => u(""), html: Qt.close })),
      b.mode === "open" ? M : null,
      ae(
        "div",
        { class: "al-rows" },
        P(Qt.grid, "My music", "Your albums and the radio", () => u("music")),
        P(Qt.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          u(""), t.openPlayer();
        }),
        b.canMake ? P(Qt.gift, "Albums (admin)", "Make an album and fund copies", () => u("gifts")) : null,
        P(Qt.device, "This device", "Backup, history, Stacks wallet, returns", () => u("device")),
        W
      )
    );
  }
  function oe(b) {
    var ue, Xe;
    const I = b.player, M = m == null ? void 0 : m.nowPlaying, P = M && I.tracks.some((C) => String(C.id) === String(M.tokenId)) ? String(M.tokenId) : null, W = !!(m != null && m.playing) && !!P, R = P ? (Xe = (ue = t.radio()) == null ? void 0 : ue.getPosition) == null ? void 0 : Xe.call(ue) : null;
    P && (W || ((R == null ? void 0 : R.current) ?? 0) > 0.5) && (x = I.id);
    const le = !!P && x === I.id;
    return T(b, {
      songs: I.tracks.filter((C) => !C.hidden),
      current: P,
      started: le,
      own: le ? String((M == null ? void 0 : M.cover) || "") : "",
      out: b.plays === 0 && !b.playsComing,
      waiting: !!b.playsComing && !b.plays
    });
  }
  function Y() {
    const b = o;
    if (r) {
      if (!b || b.mode !== "open") {
        e.hidden = !0, e.replaceChildren(), delete a.dataset.albumlist;
        return;
      }
      v(), e.hidden = !1, a.dataset.albumlist = "1", e.replaceChildren(...oe(b));
      return;
    }
    if (!b) {
      e.hidden = !0, e.replaceChildren();
      return;
    }
    v(), e.hidden = !1;
    const I = ae(
      "header",
      { class: "al-top" },
      ae("a", { class: "al-brand", href: "/radio" }, Ml("al-logo"), "Xtrata ", ae("b", {}, "Music")),
      b.mode === "open" ? _n({ class: "al-icon", "aria-label": "My music", onClick: () => u("music"), html: Qt.grid }) : null
    ), M = ae("div", { class: "al-body al-body--" + b.mode }, ...b.mode === "open" ? B(b) : A(b));
    e.replaceChildren(I, M, ...s === "more" ? [ae("div", { class: "al-scrim", onClick: () => u("") }), Q(b)] : []);
  }
  return {
    render(b) {
      if (r) {
        o = b, Y();
        return;
      }
      const I = !!o;
      o = b, !b && (I || s) && (s = "", delete a.dataset.sheet), b ? a.dataset.view = "album" : delete a.dataset.view, b != null && b.asking ? a.dataset.asking = "1" : delete a.dataset.asking, Y();
    },
    sheet: () => s,
    setSheet: u
  };
}
const IL = "(?:https?:\\/\\/(?:radio\\.)?xtrata\\.xyz)?", LL = (e, t) => {
  if (typeof t != "string") return null;
  const n = t.match(new RegExp(`<(?:${e})\\b[^>]*\\bsrc=["']${IL}\\/inscription\\/(\\d{1,9})["']`, "i"));
  return n ? Number(n[1]) : null;
}, CL = (e) => LL("source|audio", e), TL = 48 * 1024 * 1024;
function BL(e) {
  const t = /^data:(audio\/[^;,]+)[^,]*?(;base64)?,(.*)$/s.exec(e);
  if (!t) throw new Error("unreadable audio");
  if (!t[2]) return e;
  const n = atob(t[3].replace(/\s+/g, "")), r = new Uint8Array(n.length);
  for (let o = 0; o < n.length; o++) r[o] = n.charCodeAt(o);
  return URL.createObjectURL(new Blob([r], { type: t[1] }));
}
function NL(e) {
  const t = e.fetch ?? ((...h) => fetch(...h));
  let n = null, r = null, o = "", s = null;
  const i = (h) => {
    n = h, e.changed();
  }, a = () => {
    var h;
    if (s == null || s.abort(), s = null, r)
      try {
        r.pause(), r.removeAttribute("src"), (h = r.load) == null || h.call(r);
      } catch {
      }
    o.startsWith("blob:") && URL.revokeObjectURL(o), o = "";
  };
  async function c(h, d, m = 0) {
    var A, T, B;
    const w = "/inscription/" + h, v = await t(w, { signal: d }), x = (v.headers.get("content-type") || "").toLowerCase();
    if (!v.ok)
      throw await ((A = v.body) == null ? void 0 : A.cancel()), new Error("not found");
    if (x.startsWith("audio/"))
      return await ((T = v.body) == null ? void 0 : T.cancel()), w;
    if (!x.includes("text/html"))
      throw await ((B = v.body) == null ? void 0 : B.cancel()), new Error("not a song");
    const L = await v.text();
    if (L.length > TL) throw new Error("too large");
    const N = L.match(/<(?:source|audio)\b[^>]*\bsrc=["'](data:audio\/[^"']+)["']/i);
    if (N) return BL(N[1].replace(/&amp;/g, "&"));
    const U = m === 0 ? CL(L) : null;
    if (U) return c(Number(U), d, 1);
    throw new Error("no audio");
  }
  async function u(h) {
    var m;
    a();
    const d = s = new AbortController();
    i({ id: h, state: "loading" });
    try {
      const w = await c(h, d.signal);
      if (d.signal.aborted) {
        w.startsWith("blob:") && URL.revokeObjectURL(w);
        return;
      }
      if (o = w, r || (r = e.audio ? e.audio() : new Audio(), r.addEventListener("ended", () => {
        (n == null ? void 0 : n.state) === "playing" && (a(), i(null));
      }), r.addEventListener("error", () => {
        if ((n == null ? void 0 : n.state) === "playing") {
          const v = n.id;
          a(), i({ id: v, state: "error" });
        }
      })), (m = e.quiet) == null || m.call(e), r.src = w, await r.play(), d.signal.aborted) return;
      i({ id: h, state: "playing" });
    } catch {
      if (d.signal.aborted) return;
      a(), i({ id: h, state: "error" });
    }
  }
  return {
    state: (h) => (n == null ? void 0 : n.id) === h ? n.state : "idle",
    toggle: (h) => {
      (n == null ? void 0 : n.id) === h && n.state !== "error" ? (a(), i(null)) : u(h);
    },
    stop: () => {
      n && (a(), i(null));
    }
  };
}
const ML = ["Earned", "Claim", "Yours"], _L = ["Connect", "Link", "Name"], Lt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, bn = (e, t, n, r = !1) => {
  const o = Lt("button", e, t);
  return o.type = "button", o.disabled = r, o.onclick = n, o;
}, Xg = (e, t, n, r = !1) => {
  const o = bn("al-album", "", n, r), s = Lt("span", "al-album__t");
  return s.append(Lt("b", "", e), Lt("span", "", t)), o.append(s), o;
}, PL = (e) => `No. ${String(e).padStart(4, "0")}`, UL = (e) => e.main ? e.linked ? 2 : 1 : 0;
function OL(e) {
  const t = document.documentElement;
  let n = !1, r = "", o = null;
  const s = (i) => {
    if (o && r === i.art) return o;
    r = i.art, o = Lt("div", "aw-art");
    const a = document.createElement("iframe");
    return a.src = i.art, a.title = `${i.tier.name} record. Drag to turn it.`, a.setAttribute("sandbox", "allow-scripts"), o.append(a), o;
  };
  return {
    showing: () => n,
    /** `otherActive`: an album or a welcome screen owns the mount right now, so this view only steps aside. */
    render(i, a = !1) {
      if (!i) {
        n && !a && (e.hidden = !0, e.replaceChildren(), delete t.dataset.view, delete t.dataset.asking), n && (delete t.dataset.award, r = "", o = null), n = !1;
        return;
      }
      n = !0, t.dataset.view = "album", t.dataset.award = i.screen, i.asking ? t.dataset.asking = "1" : delete t.dataset.asking;
      const c = Lt("header", "al-top"), u = Lt("a", "al-brand");
      u.href = "/radio", u.append(Ml("al-logo"), Lt("span", "", "Xtrata "), Lt("b", "", "Music")), c.append(u);
      const h = Lt("div", "al-welcome"), d = i.screen, m = i.tier.name, w = typeof i.name == "string" && i.name ? i.name : null;
      if (h.append(d === "have" ? _l(_L, UL(i)) : _l(ML, d === "making" ? 2 : d === "yours" ? 3 : 1)), d === "making") {
        const U = Lt("div", "tier-disc tier-disc--mid");
        U.dataset.tier = i.tier.id, U.append(Lt("span", "tier-disc__mark", i.tier.mark)), h.append(U);
      } else if (d !== "have" && d !== "get") {
        const U = s(i);
        U.classList.toggle("aw-art--small", d === "name"), h.append(U);
      }
      const v = d === "ready" ? `Your ${m} record is ready` : d === "name" ? "Put your name on it?" : d === "have" ? "Use the name in your wallet" : d === "get" ? "Get a .btc name" : d === "making" ? "Making your record" : "It’s yours";
      h.append(Lt("h1", "", v));
      const x = (U, A = "") => h.append(Lt("p", A, U)), L = [];
      if (d === "ready")
        x(`You’ve paid artists for ${i.need.toLocaleString()} plays. That makes you an Xtrata Music Hero.`), L.push(bn("al-primary", `Claim my ${m} record`, () => i.go("name"), i.busy), Lt("p", "al-hint", "Free. One tap with Face ID or your fingerprint."), bn("al-link", "Later", i.later));
      else if (d === "name")
        w ? (x(`Your record will carry ${w} beside your player’s address.`), L.push(bn("al-primary", `Claim with ${w}`, () => i.claim("auto"), i.busy), bn("al-link", "Use my address only", () => i.claim("none"), i.busy))) : i.name === null ? (x("Right now it will carry your player’s address. A .btc name makes it yours at a glance."), L.push(
          Xg("I have a name in Leather or Xverse", "Connect that wallet and link your player to it", () => i.go("have"), i.busy),
          Xg("I want to get a name", "Where to get one, and how to put it on your player", () => i.go("get"), i.busy),
          bn("al-primary", "Claim with my address", () => i.claim("none"), i.busy)
        )) : (x("Could not check for a .btc name just now.", "ppp-warn"), L.push(bn("al-primary", "Check again", i.refresh, i.busy), bn("al-link", "Claim with my address only", () => i.claim("none"), i.busy))), L.push(Lt("p", "al-hint", "What is on the plaque cannot be changed afterwards.")), L.push(bn("al-link", "Later", i.later));
      else if (d === "have")
        i.main ? !i.linked && i.canLink ? (x(`Link this player to ${i.main}. Your plays and likes are then credited to that wallet’s name. One signature in your wallet: nothing is spent.`), L.push(bn("al-primary", "Link my player", i.link, i.busy))) : i.linked ? w ? (x(`Found it: ${w}. It goes on your plaque beside your player’s address.`), L.push(bn("al-primary", `Claim with ${w}`, () => i.claim("auto"), i.busy))) : (x(i.name === null ? `${i.main} has no primary .btc name yet. Set one in your wallet, then check again.` : "Could not check for the name just now.", i.name === null ? "" : "ppp-warn"), L.push(bn("al-primary", "Check again", i.refresh, i.busy))) : (x(`Linking is not open for ${i.main} right now. You can send a name to your player instead.`, "ppp-warn"), L.push(bn("al-primary", "Show me how", () => i.go("get"), i.busy))) : (x("Connect the Leather or Xverse wallet that holds your .btc name."), L.push(bn("al-primary", "Connect my wallet", i.connect, i.busy))), L.push(bn("al-link", "Back", () => i.go("name")));
      else if (d === "get") {
        const U = Lt("ol", "aw-steps"), A = Lt("li");
        A.append("Get a name at BNS One. You need a Stacks wallet (Leather or Xverse) with a little STX. ");
        const T = Lt("a", "", "Open BNS One ↗");
        T.href = "https://bns.one", T.target = "_blank", T.rel = "noopener", A.append(T);
        const B = Lt("li");
        B.append("Then come back and choose “I have a name in Leather or Xverse”. Or send the name to your player’s own address:", Lt("span", "ppp-addr-full", i.player), i.copyAddress());
        const X = Lt("li", "", "Check again, and your name shows on the preview before you claim.");
        U.append(A, B, X), h.append(U), L.push(bn("al-primary", "I have my name: check again", () => {
          i.refresh(), i.go("name");
        }, i.busy), bn("al-link", "Back", () => i.go("name")));
      } else if (d === "making") {
        if (x("It is being written to Xtrata with your plaque on it. About a minute: keep this page open and it carries on by itself."), i.claimLink) {
          const U = Lt("p", "al-hint"), A = Lt("a", "", "See the claim on-chain ↗");
          A.href = i.claimLink, A.target = "_blank", A.rel = "noopener", U.append(A), h.append(U);
        }
      } else if (x(`${m} record ${PL(i.number)}${i.inscription !== void 0 ? ` · Xtrata inscription #${i.inscription}` : ""}. In your player now, and yours for good.`), L.push(bn("al-primary", "See it in my player", i.done)), i.inscription !== void 0) {
        const U = Lt("a", "al-link", "Open it full screen ↗");
        U.href = `/i/${i.inscription}`, U.target = "_blank", U.rel = "noopener", L.push(U);
      }
      if (i.status.length) {
        const U = Lt("div", "al-status");
        U.setAttribute("role", "status"), U.append(...i.status), h.append(U);
      }
      i.asking ? h.append(Lt("p", "al-hint al-hint--ask", "Continue in the box below.")) : h.append(...L);
      const N = Lt("div", "al-body al-body--welcome");
      N.append(h), e.hidden = !1, e.replaceChildren(c, N);
    }
  };
}
const Fb = "xtrata.xyz/music/release", HL = "Release music on Xtrata Music; no spending permission", DL = (e) => ({
  domain: wr({ name: xt(Fb), version: xt("1"), "chain-id": An(1) }),
  message: wr({ purpose: xt(HL), artist: xt(e.artist), release: xt(e.hash), issued: An(e.issued) })
}), FL = "Set the price of my release on Xtrata Music; no spending permission", jL = 100000n, RL = 1000000000n, zL = (e) => e === 0n || e >= jL && e <= RL, GL = (e) => ({
  domain: wr({ name: xt(Fb), version: xt("1"), "chain-id": An(1) }),
  message: wr({ purpose: xt(FL), artist: xt(e.artist), release: xt(e.release), price: An(BigInt(e.price)), issued: An(e.issued) })
}), Mi = (e) => {
  const t = BigInt(e), n = t / 1000000n, r = (t % 1000000n).toString().padStart(6, "0").replace(/0+$/, "");
  return r ? `${n}.${r}` : `${n}`;
}, KL = (e) => {
  const t = /^\s*(\d{1,6})(?:\.(\d{1,6}))?\s*$/.exec(e);
  return t ? BigInt(t[1]) * 1000000n + BigInt((t[2] ?? "").padEnd(6, "0") || "0") : null;
}, be = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, Cn = (e, t, n = "") => {
  const r = be("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, zc = (e) => ({ method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(e) }), Yg = (e) => {
  const t = Dr(e).length;
  return `${t} ${t === 1 ? "song" : "songs"}`;
};
function Gc(e, t, n = "", r = "") {
  const o = be("span", "", "ppp-rel-art" + (e ? "" : " is-blank") + (r ? " " + r : "")), s = e || n;
  if (s) {
    const i = document.createElement("img");
    i.src = s, i.alt = "", i.decoding = "async", o.append(i);
  }
  return e || o.append(be("span", t)), o;
}
const Qu = (e) => !!e && uf(e.id) && typeof e.title == "string" && Array.isArray(e.tracks) && e.tracks.length > 0 && typeof e.artist == "string";
function VL(e) {
  let t = null, n = { copies: !1, sales: !1 }, r = !1, o = "", s = "";
  const i = (() => {
    try {
      const z = new URLSearchParams(location.search).get("release");
      return uf(z) ? z : null;
    } catch {
      return null;
    }
  })();
  let a = i ? { id: i } : null;
  const c = (z) => "xtrata.radio.releases.shelf.v1:" + z;
  let u = null, h = !1, d = -1 / 0;
  const m = (z, H, ee) => {
    const se = Array.isArray(H) ? H.filter(Qu).map((he) => ({ ...he, hidden: !!he.hidden })) : [];
    u = { for: z, albums: se, fresh: ee }, ee && e.store.set(c(z), JSON.stringify(se));
  }, w = (z) => {
    try {
      m(z, JSON.parse(e.store.get(c(z)) || "[]"), !1);
    } catch {
      m(z, [], !1);
    }
  }, v = () => {
    const z = e.player().address;
    return z && (u == null ? void 0 : u.for) === z ? u.albums : [];
  };
  async function x(z, H = "") {
    const ee = e.player();
    if (!ee.address || !ee.unlocked)
      return s = "Unlock your player first.", e.changed(), !1;
    if (h) return !1;
    h = !0, s = "", e.changed();
    try {
      const se = await e.signShelf(z, H), he = await e.json("/radio/release/shelf", zc(se));
      return m(ee.address, he == null ? void 0 : he.albums, !0), N(he == null ? void 0 : he.pay) ? A(ee.address, he.pay) : z === "add" && A(ee.address, null, H), !0;
    } catch (se) {
      return z !== "list" && (s = se.message || "That did not work. Try again."), !1;
    } finally {
      h = !1, e.changed();
    }
  }
  const L = (z) => "xtrata.radio.releases.orders.v1:" + z, N = (z) => !!z && /^[0-9a-f]{16}$/.test(z.order) && uf(z.release) && typeof z.to == "string" && /^\d{1,12}$/.test(z.amount) && typeof z.memo == "string", U = (z) => {
    if (!z) return {};
    try {
      const H = JSON.parse(e.store.get(L(z)) || "{}");
      return H && typeof H == "object" ? Object.fromEntries(Object.entries(H).filter(([, ee]) => N(ee))) : {};
    } catch {
      return {};
    }
  };
  function A(z, H, ee = (H == null ? void 0 : H.release) ?? "") {
    var he;
    const se = U(z);
    H ? se[H.release] = { ...((he = se[H.release]) == null ? void 0 : he.order) === H.order ? se[H.release] : {}, ...H } : delete se[ee], e.store.set(L(z), Object.keys(se).length ? JSON.stringify(se) : null);
  }
  const T = /* @__PURE__ */ new Set(), B = /* @__PURE__ */ new Map();
  async function X(z, H, ee = !1) {
    var se;
    if (!T.has(H.order)) {
      T.add(H.order), B.set(H.order, e.now()), ee && (s = "", e.changed());
      try {
        const he = await e.json("/radio/release/paid", zc({ order: H.order, ...H.txid ? { txid: H.txid } : {} }));
        (he == null ? void 0 : he.status) === "paid" ? (A(z, null, H.release), ((se = a == null ? void 0 : a.view) == null ? void 0 : se.id) === H.release && (a.view = { ...a.view, added: a.view.added + 1 }), s = "", T.delete(H.order), (u == null ? void 0 : u.for) === z && (u.fresh = !1), e.player().unlocked && await x("list")) : (N(he) && A(z, { ...H, ...he }), ee && (he == null ? void 0 : he.status) === "pending" && (s = "No payment found yet. If you have just paid, give it a minute and check again."));
      } catch (he) {
        /did not go through|does not pay this order/.test(he.message || "") && A(z, { ...H, txid: void 0, status: "pending" }), (ee || H.txid) && (s = he.message || "The payment could not be checked right now. Nothing is lost.");
      } finally {
        T.delete(H.order), e.changed();
      }
    }
  }
  async function Q(z, H, ee) {
    if (!o) {
      o = "Approve the payment in your wallet…", s = "", e.changed();
      try {
        const se = await e.pay(z, ee.to, BigInt(ee.amount), ee.memo), he = { ...ee, txid: se || void 0, status: "confirming" };
        A(H, he), o = "", X(H, he);
      } catch (se) {
        s = /cancel/i.test(se.message || "") ? "Payment cancelled. Nothing was sent." : se.message || "Not paid. Nothing was sent.";
      } finally {
        o = "", e.changed();
      }
    }
  }
  async function oe(z) {
    const H = e.player();
    if (!await x("add", z.id) || !H.address) return;
    const ee = U(H.address)[z.id], se = e.main();
    ee && se && await Q(se, H.address, ee);
  }
  function Y() {
    if (r || (r = !0, e.json("/radio/release/config").then((H) => {
      t = (H == null ? void 0 : H.enabled) === !0, n = { copies: t && (H == null ? void 0 : H.copies) === !0, sales: t && (H == null ? void 0 : H.sales) === !0 };
    }, () => {
      t = !1, r = !1;
    }).finally(e.changed)), !t) return;
    if (a && !a.view && !a.error) {
      const H = a;
      H.error = "", e.json("/radio/release/view?id=" + H.id).then(
        (ee) => {
          Qu(ee) ? (H.view = ee, delete H.error) : H.error = "This release could not be read.";
        },
        (ee) => {
          H.error = ee.message || "This release could not be opened right now.";
        }
      ).finally(e.changed);
    }
    const z = e.player();
    if (z.address) {
      (u == null ? void 0 : u.for) !== z.address && w(z.address), z.unlocked && !(u != null && u.fresh) && !h && e.now() - d > 6e4 && (d = e.now(), x("list"));
      for (const H of Object.values(U(z.address)))
        if ((H.txid || H.status === "confirming") && !T.has(H.order) && e.now() - (B.get(H.order) ?? -1 / 0) > 2e4) {
          const ee = z.address;
          X(ee, H).then(() => {
            setTimeout(() => e.changed(), 20500);
          });
        }
    }
  }
  const b = () => t ? v().filter((z) => !z.hidden) : [];
  function I(z, H) {
    const ee = be("ol", "", "ppp-rel-songs");
    return z.forEach((se, he) => {
      const dt = be("li");
      dt.append(Gc(e.art.song(se.id, !0) || "", String(he + 1), H), be("span", se.title)), ee.append(dt);
    }), ee;
  }
  function M() {
    if (!t || !a || a.dismissed) return [];
    if (!a.view) return a.error ? [be("p", `♫ ${a.error}`, "ppp-warn")] : [be("p", "♫ Opening this release…", "ppp-mute")];
    const z = a.view, H = be("div", "", "ppp-release-in"), ee = be("p", "", "ppp-release-in__h"), se = BigInt(/^\d{1,12}$/.test(z.price ?? "") ? z.price : "0");
    ee.append(be("b", z.title), be("span", `${z.subtitle || e.who(z.artist)} · ${Yg(z)}${se > 0n ? ` · ${Mi(se)} STX` : ""}`));
    const he = Dr(z), dt = e.art.cover(z.cover) || (z.cover ? "" : he[0] && e.art.song(he[0].id, !0) || ""), Ne = be("div", "", "ppp-rel-top");
    Ne.append(Gc(dt, "💿", "", "is-cover"), ee), H.append(Ne, I(he.map((Ie) => ({ id: Ie.id, title: Ie.title || `#${Ie.id}` })), e.art.cover(z.cover))), H.append(be("p", `Released by ${e.who(z.artist)}. ${z.added === 1 ? "1 player has" : `${z.added.toLocaleString()} players have`} added it.`, "ppp-mute"));
    const He = e.player(), St = v().find((Ie) => Ie.id === z.id), Ke = be("div", "", "ppp-award__row");
    if (St)
      H.append(be("p", "In your player ✓ It stays there until you hide or remove it.", "ppp-ok")), Ke.append(Cn("Play it", () => e.open(z), "primary"));
    else if (!He.address) H.append(be("p", "Make your player first (above), then add this album to it. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
    else if (!He.unlocked) H.append(be("p", "Unlock your player to add this album to it.", "ppp-mute"));
    else if (se > 0n) {
      const Ie = U(He.address)[z.id], Ze = e.main(), Ye = `${Mi((Ie == null ? void 0 : Ie.amount) ?? se)} STX`;
      if (Ie != null && Ie.txid || (Ie == null ? void 0 : Ie.status) === "confirming") {
        H.append(be("p", "Payment sent ✓ Waiting for it to confirm (a few minutes). The album appears in your player by itself.", "ppp-ok"));
        const Ve = Cn("Check now", () => void X(He.address, Ie, !0));
        Ve.disabled = T.has(Ie.order), Ke.append(Ve);
      } else if (H.append(be("p", `This album costs ${Ye}. You pay ${e.who(z.artist)} directly: Xtrata takes nothing, never holds the money and cannot refund it. Once paid it is in your player for good, and it plays with your own plays.`, "ppp-mute")), !n.sales && !Ie) H.append(be("p", "Buying is paused right now.", "ppp-warn"));
      else if (Ie) {
        if (Ze) {
          const gn = Cn(`Pay ${Ye} from my wallet`, () => void Q(Ze, He.address, Ie), "primary");
          gn.disabled = !!o, Ke.append(gn);
        } else H.append(be("p", "Connect a Stacks wallet (top right) to pay here. Or pay from any wallet, exactly like this:", "ppp-mute"));
        const Ve = be("div", "", "ppp-rel-pay"), Ht = (gn, Vn, $t) => {
          const un = be("p");
          return un.append(be("span", gn), be("code", Vn), fr(`order-${$t}:${Ie.order}`, "Copy", () => Vn, "tiny", e.changed)), un;
        };
        Ve.append(Ht("Send", Mi(Ie.amount) + " STX", "amount"), Ht("To", Ie.to, "to"), Ht("Memo", Ie.memo, "memo")), H.append(Ve, be("p", "The memo is what ties the payment to your player. Without it the album cannot be added.", "ppp-mute"));
        const pn = Cn("I have paid: check", () => void X(He.address, Ie, !0));
        pn.disabled = T.has(Ie.order), Ke.append(pn);
      } else {
        const Ve = Cn(`Buy · ${Ye}`, () => void oe(z), "primary");
        Ve.disabled = h || !!o, Ke.append(Ve);
      }
    } else {
      H.append(be("p", "Add it and it stays in your player. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
      const Ie = Cn("Add to my player", () => {
        x("add", z.id).then((Ze) => {
          Ze && (a != null && a.view) && (a.view = { ...a.view, added: a.view.added + 1 });
        });
      }, "primary");
      Ie.disabled = h, Ke.append(Ie);
    }
    return Ke.append(Cn("Not now", () => {
      a && (a.dismissed = !0), e.changed();
    }, "quiet")), H.append(Ke), o && H.append(be("p", o, "ppp-cyan")), s && H.append(be("p", s, "ppp-warn")), [H];
  }
  let P = !1;
  function W() {
    const z = t ? v() : [];
    if (!z.length) return null;
    const H = be("details", "", "ppp-release-manage");
    H.open = P, H.ontoggle = () => {
      P = H.open;
    };
    const ee = z.filter((he) => he.hidden).length;
    H.append(be("summary", `Albums I added (${z.length}${ee ? `, ${ee} hidden` : ""})`));
    const se = e.player().unlocked;
    se || H.append(be("p", "Unlock your player to hide or remove an album.", "ppp-mute"));
    for (const he of z) {
      const dt = be("div", "", "ppp-release-row" + (he.hidden ? " is-hidden" : "")), Ne = be("span", "", "ppp-release-row__t");
      Ne.append(be("b", he.title), be("span", `${he.subtitle || e.who(he.artist)}${he.hidden ? " · hidden" : ""}`));
      const He = Cn(he.hidden ? "Show" : "Hide", () => void x(he.hidden ? "show" : "hide", he.id), "tiny"), St = Cn("Remove", () => void x("remove", he.id), "tiny");
      He.disabled = St.disabled = !se || h, dt.append(Ne, He, St), H.append(dt);
    }
    return H.append(be("p", "Hide keeps an album but out of sight. Remove takes it off your player; you can add it again from its link.", "ppp-mute")), s && !a && H.append(be("p", s, "ppp-warn")), H;
  }
  let R = null, le = [], ue = null;
  const Xe = be("input");
  Xe.maxLength = 60, Xe.placeholder = "Title of the single, EP or album", Xe.setAttribute("aria-label", "Release title");
  const C = be("input");
  C.maxLength = 80, C.placeholder = "Artist name shown under the title", C.setAttribute("aria-label", "Artist name");
  const F = be("input");
  F.inputMode = "numeric", F.placeholder = "Cover: an inscription number (optional; the first song’s artwork if left empty)", F.setAttribute("aria-label", "Cover inscription number");
  const re = be("input");
  re.inputMode = "decimal", re.placeholder = "Price in STX, e.g. 2 (0 makes it free)", re.setAttribute("aria-label", "Price in STX");
  let de = null;
  const Be = (z, H, ee = "") => {
    de = (de == null ? void 0 : de.id) === z && de.what === H ? null : { id: z, what: H }, (de == null ? void 0 : de.what) === "price" && (re.value = ee), s = "", e.changed();
  };
  async function Me(z, H) {
    if (o) return;
    const ee = KL(re.value);
    if (ee === null || !zL(ee)) {
      s = "A price is 0 (free), or 0.1 to 1,000 STX.", e.changed();
      return;
    }
    o = "Sign in your wallet (nothing is spent)…", s = "", e.changed();
    try {
      const se = { artist: z, release: H.id, price: ee.toString(), issued: e.now() }, he = await e.sign(z, GL(se));
      o = "Saving the price…", e.changed(), await e.json("/radio/release/price", zc({ request: se, signature: he })), s = ee > 0n ? `Price set ✓ “${H.title}” now costs ${Mi(ee)} STX, paid straight to this wallet.` : `“${H.title}” is free again ✓`, de = null, _e(z, !0);
    } catch (se) {
      s = se.message || "The price was not changed.";
    } finally {
      o = "", e.changed();
    }
  }
  const Ot = (z) => `${location.origin}${location.pathname}?release=${z}`;
  function Ge(z) {
    R = { for: z, loading: !0 }, le = [], e.changed(), e.json("/radio/release/songs?wallet=" + encodeURIComponent(z)).then(
      (H) => {
        const ee = Array.isArray(H == null ? void 0 : H.songs) ? H.songs.filter((se) => Number.isSafeInteger(se == null ? void 0 : se.id) && typeof se.title == "string") : null;
        R = ee ? { for: z, songs: ee, more: !!H.more } : { for: z, error: "Your songs could not be read right now." };
      },
      (H) => {
        R = { for: z, error: H.message || "Your songs could not be read right now." };
      }
    ).finally(e.changed);
  }
  function _e(z, H = !1) {
    !H && (ue == null ? void 0 : ue.for) === z && e.now() - ue.at < 6e4 || (ue = { for: z, list: (ue == null ? void 0 : ue.for) === z ? ue.list : [], at: e.now() }, e.json("/radio/release/by?artist=" + encodeURIComponent(z)).then((ee) => {
      Array.isArray(ee == null ? void 0 : ee.releases) && (ue = { for: z, list: ee.releases.filter(Qu), at: e.now() });
    }, () => {
    }).finally(e.changed));
  }
  async function Pe(z) {
    if (!o) {
      o = "Checking your release…", s = "", e.changed();
      try {
        const H = F.value.trim().replace(/^#/, ""), ee = Ub({ title: Xe.value.trim(), subtitle: C.value.trim(), tracks: [...le], cover: H ? Number(H) : null });
        o = "Sign in your wallet (nothing is spent)…", e.changed();
        const se = { artist: z, hash: Ob(ee), issued: e.now() }, he = await e.sign(z, DL(se));
        o = "Releasing…", e.changed();
        const dt = await e.json("/radio/release/create", zc({ definition: ee, request: se, signature: he }));
        s = `${dt.existing ? "Already released" : "Released"} ✓ “${dt.title}”. Its link is below.`, le = [], Xe.value = "", F.value = "", e.audition.stop(), _e(z, !0);
      } catch (H) {
        s = H.message || "Not released.";
      } finally {
        o = "", e.changed();
      }
    }
  }
  const _t = () => {
    queueMicrotask(() => e.audition.stop());
  }, En = /* @__PURE__ */ new Set();
  function lt(z) {
    const H = le.map((Ve) => z.find((Ht) => Ht.id === Ve)).filter((Ve) => !!Ve), ee = F.value.trim().replace(/^#/, ""), se = /^\d{1,9}$/.test(ee) ? Number(ee) : null, he = e.art.cover(se), dt = H[0] ? e.art.song(H[0].id, !0) : null, Ne = be("div", "", "ppp-release-preview");
    Ne.append(be("p", "How it will look", "ppp-featured__h"));
    const He = be("p", "", "ppp-release-in__h"), St = be("b", Xe.value.trim() || "Untitled"), Ke = be("span", `${C.value.trim() || e.who(e.main())} · ${H.length} ${H.length === 1 ? "song" : "songs"}`);
    He.append(St, Ke);
    const Ie = be("div", "", "ppp-rel-top");
    Ie.append(Gc(se ? he : dt || "", "💿", "", "is-cover"), He), Ne.append(Ie, I(H.map((Ve) => ({ id: Ve.id, title: Ve.title })), he));
    const Ze = H.filter((Ve) => e.art.song(Ve.id, !0) === null).length, Ye = [];
    se && !he && Ye.push(`Looking for an image in #${se}… If none appears, that inscription is not a picture.`), Ze && Ye.push(`Finding artwork for ${Ze} ${Ze === 1 ? "song" : "songs"}…`), !Ze && H.some((Ve) => e.art.song(Ve.id, !1) === "") && Ye.push(`A numbered square is a song with no artwork of its own${he ? ": it shows the cover, dimmed" : ""}.`);
    for (const Ve of Ye) Ne.append(be("p", Ve, "ppp-mute"));
    return Xe.oninput = () => {
      St.textContent = Xe.value.trim() || "Untitled";
    }, C.oninput = () => {
      Ke.textContent = `${C.value.trim() || e.who(e.main())} · ${H.length} ${H.length === 1 ? "song" : "songs"}`;
    }, F.onchange = () => e.changed(), Ne;
  }
  function Zt() {
    var ee;
    const z = e.main();
    if (!t || !z)
      return R && (R = null, le = [], _t()), null;
    const H = [be("p", "Put your own songs out as a single, an EP or an album. Listeners add it to their player, and every play pays you. Nothing to pay, and no money passes through Xtrata.", "ppp-mute")];
    if (R && R.for !== z && (R = null, le = [], En.clear(), _t()), !R) H.push(Cn("Show the songs in my wallet", () => Ge(z), "primary"));
    else if (R.loading) H.push(be("p", "Reading your wallet…", "ppp-cyan"));
    else if (R.error) H.push(be("p", R.error, "ppp-warn"), Cn("Try again", () => Ge(z)));
    else if (!R.songs.length) H.push(be("p", "No songs found in this wallet. A release is made by the wallet that holds its song masters.", "ppp-mute"));
    else {
      H.push(be("p", "Tap your songs in the order they should play. Tap one again to take it out.", "ppp-cyan"));
      const se = be("div", "", "ppp-release-songs");
      for (const Ne of R.songs) {
        const He = le.indexOf(Ne.id), St = be("div", "", "ppp-release-song" + (He >= 0 ? " is-on" : "")), Ke = e.audition.state(Ne.id);
        Ke !== "idle" && En.add(Ne.id);
        const Ie = Cn(Ke === "playing" ? "❚❚" : Ke === "loading" ? "…" : "▶", () => e.audition.toggle(Ne.id), "ppp-release-hear" + (Ke === "playing" ? " is-on" : ""));
        Ie.setAttribute("aria-label", Ke === "playing" ? `Stop ${Ne.title}` : `Listen to ${Ne.title}`), Ie.title = Ke === "error" ? "This song could not be played just now" : Ke === "playing" ? "Stop" : "Listen (free: it is your own song)";
        const Ze = e.art.song(Ne.id, He >= 0 || En.has(Ne.id)), Ye = Cn("", () => {
          le = He >= 0 ? le.filter((Ve) => Ve !== Ne.id) : [...le, Ne.id], e.changed();
        }, "ppp-release-pick");
        Ye.setAttribute("aria-pressed", String(He >= 0)), Ye.append(be("i", He >= 0 ? String(He + 1) : "+"), be("b", Ne.title), be("span", Ke === "error" ? "could not play" : `${Ne.artist ? Ne.artist + " · " : ""}#${Ne.id}`, Ke === "error" ? "ppp-warn" : "")), St.append(Ie, Gc(Ze || "", Ze === "" ? "♪" : "", ""), Ye), se.append(St);
      }
      H.push(se), R.more && H.push(be("p", "This wallet holds a lot: only the first few hundred inscriptions were looked through.", "ppp-mute")), !C.value && le.length && (C.value = ((ee = R.songs.find((Ne) => Ne.id === le[0])) == null ? void 0 : ee.artist) || "");
      const he = le.length === 0 ? "release" : le.length === 1 ? "single" : le.length <= 6 ? "EP" : "album", dt = Cn(le.length ? `Sign and release this ${he} · ${le.length} ${le.length === 1 ? "song" : "songs"}` : "Pick at least one song", () => void Pe(z), "primary");
      dt.disabled = !le.length || !!o, H.push(Xe, C, F), le.length && H.push(lt(R.songs)), H.push(dt);
    }
    if (o && H.push(be("p", o, "ppp-cyan")), s && !a && H.push(be("p", s, /✓/.test(s) ? "ppp-ok" : "ppp-warn")), _e(z), (ue == null ? void 0 : ue.for) === z && ue.list.length) {
      H.push(be("p", "Your releases", "ppp-featured__h"));
      for (const se of ue.list) {
        const he = be("div", "", "ppp-release-row"), dt = be("span", "", "ppp-release-row__t"), Ne = BigInt(/^\d{1,12}$/.test(se.price ?? "") ? se.price : "0"), He = Ne > 0n ? ` · ${Mi(Ne)} STX · ${(se.sold ?? 0).toLocaleString()} sold` : n.sales ? " · free" : "";
        if (dt.append(be("b", se.title), be("span", `${Yg(se)} · added by ${se.added.toLocaleString()} ${se.added === 1 ? "player" : "players"}${He}`)), he.append(dt, fr("release-link:" + se.id, "Copy link", () => Ot(se.id), "tiny", e.changed)), n.sales) {
          const Ke = Cn("Price", () => Be(se.id, "price", Ne > 0n ? Mi(Ne) : ""), "tiny");
          Ke.setAttribute("aria-expanded", String((de == null ? void 0 : de.id) === se.id && de.what === "price")), he.append(Ke);
        }
        if (n.copies && e.copies) {
          const Ke = Cn("Send copies", () => Be(se.id, "copies"), "tiny");
          Ke.setAttribute("aria-expanded", String((de == null ? void 0 : de.id) === se.id && de.what === "copies")), he.append(Ke);
        }
        if (H.push(he), (de == null ? void 0 : de.id) !== se.id) continue;
        const St = be("div", "", "ppp-release-way");
        if (de.what === "price" && n.sales) {
          const Ke = Cn("Sign this price", () => void Me(z, se), "primary");
          Ke.disabled = !!o, St.append(
            be("p", "Put a price on this release. Each listener then pays you that price once to add it, straight to this wallet. Xtrata takes nothing, never holds the money and cannot refund a sale: a refund is between you and the buyer. Players that already have it keep it.", "ppp-mute"),
            re,
            Ke
          );
        } else de.what === "copies" && n.copies && e.copies && St.append(...e.copies(z, { id: se.id, title: se.title }));
        St.childNodes.length && H.push(St);
      }
    }
    return H;
  }
  return { sync: Y, albums: b, banner: M, manage: W, fold: Zt, wantsArt: () => t === !0 && (!!(a != null && a.view) && !a.dismissed || !!(R != null && R.songs) && !!e.main()), enabled: () => t === !0 };
}
const ed = "xtrata.radio.replace.v1", Tn = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, uo = (e, t, n = "") => {
  const r = Tn("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, qg = (e) => (Number(e) / 1e6).toLocaleString("en-GB", { maximumFractionDigits: 6 });
function XL(e) {
  let n = (() => {
    try {
      const v = JSON.parse(e.store.get(ed) || "null");
      return v && typeof v.old == "string" ? v : null;
    } catch {
      return null;
    }
  })();
  const r = (v) => {
    n = v, e.store.set(ed, v ? JSON.stringify(v) : null), e.changed();
  };
  let o = null, s = !1, i = "", a = !1;
  function c(v) {
    s || (o == null ? void 0 : o.for) === v && (o.n !== null || Date.now() - o.at < 3e4) || (s = !0, e.json("/radio/gift/shelf?root=" + encodeURIComponent(v) + "&limit=1").then(
      (x) => {
        o = { for: v, n: Number.isSafeInteger(x == null ? void 0 : x.total) ? x.total : null, at: Date.now() };
      },
      () => {
        o = { for: v, n: null, at: Date.now() };
      }
    ).finally(() => {
      s = !1, e.changed();
    }));
  }
  const u = () => !!n, h = () => !!(n != null && n.removed);
  function d(v) {
    v.listening && (i = "", r({ old: v.listening }));
  }
  const m = () => {
    i = "", r(null);
  };
  function w(v) {
    var B;
    if (!n) return null;
    n.removed && v.listening === n.old && (n = { old: n.old }, e.store.set(ed, JSON.stringify(n)));
    const x = [], L = (X, Q) => x.push(Tn("p", `Replacing your old player · step ${X} of 3 · ${Q}`, "ppp-cyan")), N = () => uo("Stop · keep my old player", m, "quiet");
    if (v.listening && v.listening !== n.old) {
      if (!n.removed)
        return m(), null;
      x.push(Tn("p", "Your new player is ready ✓ Your old one is empty and no longer on this device.", "ppp-ok")), v.phrase && !v.backedUp ? x.push(Tn("p", "First, write down your new player’s 24 backup words. They are the only way back in if this passkey is ever lost."), uo("Back up my player · 24 words", e.backup, "primary")) : v.backedUp && x.push(Tn("p", "Its 24 backup words are written down ✓", "ppp-ok"));
      const X = v.passkeyName ? `the one called “${v.passkeyName}”` : "the newest one";
      return x.push(Tn("p", `Your phone still has the old player’s passkey. You can delete it in your phone’s saved passwords (search for “xtrata”) if you like: keep ${X}, which is this new player. Deleting a passkey cannot be undone, so do it only after the backup words are written down, and only if you are sure which is which. Leaving it there does no harm.`, "ppp-mute")), x.push(uo("Done", m, "quiet")), x;
    }
    if (!v.listening || n.removed)
      return n.removed ? (L(3, "claim your new player"), x.push(Tn("p", "Old player removed from this device ✓ Now claim your free player: it is made with a new passkey and comes with 24 backup words.", "ppp-ok")), x.push(uo("Hide this", m, "quiet")), x) : null;
    if (c(n.old), v.step === "locked" || v.step === "intro")
      return L(1, "empty it"), x.push(Tn("p", "Unlock your old player so it can be emptied."), uo("Unlock my old player", e.unlock, "primary"), N()), x;
    const U = e.keepBoth(v), A = (X) => (L(1, "empty it"), x.push(Tn("p", X, "ppp-warn")), U && x.push(uo("Keep both players instead", () => {
      m(), U();
    }, "primary")), x.push(N()), x);
    if (v.slot !== 0) return A("An album is open. Go back to your own player first.");
    if ((o == null ? void 0 : o.for) !== n.old)
      return L(1, "empty it"), x.push(Tn("p", "Checking what this player has…", "ppp-mute"), N()), x;
    if (o.n === null) return A("Could not check whether this player has albums of its own, so it will not be removed. Try again shortly.");
    if (o.n > 0) return A(`This player has ${o.n === 1 ? "an album" : `${o.n} albums`} of its own. Replacing it would leave ${o.n === 1 ? "it" : "them"} behind, so it stays.`);
    if (((B = v.award) == null ? void 0 : B.state) === "claimed" && v.award.holds !== !1) return A("This player holds a Music Hero record. Send the record to another address first, or keep both players.");
    if (v.depositPending || v.entries.some((X) => ["prepared", "signed", "unknown", "pending"].includes(String(X.status))))
      return L(1, "empty it"), x.push(Tn("p", "Something is still on its way in or out of this player. This carries on by itself once it has settled.", "ppp-mute"), N()), x;
    if (v.balance === void 0)
      return L(1, "empty it"), x.push(Tn("p", "Checking what it holds…", "ppp-mute"), N()), x;
    if (v.balance > e.dust(v))
      return L(1, "empty it"), x.push(Tn("p", `It holds ${qg(v.balance)} STX. Send it back${v.returnTo ? ` to ${e.who(v.returnTo)}` : ""} first: nothing may be left in a player you are about to remove.`)), v.returnTo || v.gift ? x.push(uo("Send everything back", e.returnAll, "primary")) : x.push(Tn("p", "There is nowhere set to send it. Connect a Stacks wallet (top right) and link it to this player, then come back here.", "ppp-warn")), x.push(N()), x;
    L(2, "remove it from this device"), x.push(Tn("p", v.balance > 0n ? `Empty ✓ (the ${qg(v.balance)} STX left is less than the network fee to move it).` : "Empty ✓", "ppp-ok")), x.push(Tn("p", "What stays behind with the old player: its likes, its play history and any progress toward a Music Hero award. Your new player starts fresh.", "ppp-mute"));
    const T = uo(a ? "Check the box below…" : "Remove my old player", () => {
      a || (a = !0, i = "", e.changed(), e.forget().then(() => {
        r({ old: n.old, removed: !0 });
      }, (X) => {
        i = /cancel/i.test((X == null ? void 0 : X.message) || "") ? "" : (X == null ? void 0 : X.message) || "It was not removed.";
      }).finally(() => {
        a = !1, e.changed();
      }));
    }, "primary");
    return T.disabled = a || !!v.busy, x.push(T, N()), i && x.push(Tn("p", i, "ppp-warn")), x;
  }
  return { active: u, claiming: h, start: d, stop: m, lines: w };
}
const YL = [
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
function qL(e) {
  for (const [t, n] of YL) if (n.test(e)) return t;
  return null;
}
const jb = (e) => /iP(hone|ad|od)/.test(e) || /Macintosh/.test(e) && /Mobile\//.test(e), Rb = (e) => /Android/.test(e);
function WL(e, t) {
  const n = new URL(e);
  return n.protocol !== "https:" ? null : jb(t) ? "x-safari-" + n.href : Rb(t) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const ZL = (e) => jb(e) ? "Safari" : Rb(e) ? "Chrome" : "your browser", _i = "Xtrata Music player", JL = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function Wg(e, t = (n) => n) {
  var s, i, a;
  if (e.mainConnected ?? !!e.main) return [];
  if (e.step === "off" || e.step === "elsewhere") return [];
  if (e.gate && (e.gate.enabled === !1 || e.gate.here === !1)) return [];
  if (e.step === "unsupported")
    return ((s = e.gate) == null ? void 0 : s.passkeyOnly) || e.linked || ((i = e.others) == null ? void 0 : i.length) ? [{ action: null, label: _i, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], o = [...new Set([e.standIn, e.linked, ...e.others ?? []].filter((c) => !!c))];
  for (const c of o) {
    const u = e.standIn === c && JL.has(e.step);
    r.push({
      action: "linked",
      main: c,
      label: `${_i} · ${t(c)}`,
      detail: u ? "Open on this device." : `Face ID or your fingerprint. Plays and likes count for ${t(c)}.`
    });
  }
  if ((a = e.gate) != null && a.passkeyOnly && e.solo)
    switch (e.step) {
      case "intro":
        r.push({ action: "create", label: _i, detail: "Make one with Face ID or your fingerprint. Nothing to install." });
        break;
      case "locked":
        r.push({ action: "unlock", label: _i, detail: "Open the one on this device with Face ID or your fingerprint." });
        break;
      case "loading":
        r.push({ action: "show", label: _i, detail: "Face ID or your fingerprint. Nothing to install." });
        break;
      case "connect":
      case "not-invited":
        break;
      default:
        r.push({ action: "show", label: _i, detail: "Open on this device." });
    }
  return r;
}
const td = "xtrata.radio.novice", zb = "xtrata.radio.novice.previewed.v1", Zg = 6 * 6e4;
function QL(e, t) {
  let n = null;
  try {
    const r = new URLSearchParams(e).get("novice");
    if (r === "1" || r === "preview")
      t.set(td, r), n = r;
    else {
      if (r === "0")
        return t.set(td, null), { on: !1, preview: !1 };
      n = t.get(td);
    }
  } catch {
    n = null;
  }
  return { on: n === "1" || n === "preview", preview: n === "preview" };
}
const eC = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i, Jg = (e) => eC.test(e ?? ""), tC = {
  "Start listening · no wallet needed": "Start listening",
  "Claim my gift · no wallet needed": "Open my gift",
  "I already have a listening wallet": "I’ve listened here before",
  "Use a different listening wallet": "Use a different passkey"
}, nC = {
  connect: "MAKE YOUR PLAYER TO LISTEN",
  setup: "MAKE YOUR PLAYER TO LISTEN",
  checking: "CHECKING YOUR PLAYER",
  unavailable: "XTRATA MUSIC IS UNAVAILABLE HERE",
  locked: "UNLOCK TO LISTEN",
  link: "FINISH SETUP TO LISTEN",
  over: "TOO MUCH IN YOUR PLAYER — SEE THIS DEVICE",
  arriving: "YOUR PLAYS ARE ARRIVING",
  out: "OUT OF PLAYS — ADD MORE TO KEEP LISTENING",
  off: "SWITCH PLAYS ON TO LISTEN",
  tab: "PLAYING IN ANOTHER TAB"
}, rC = (e, t) => nC[e] ?? t;
function sC(e, t) {
  switch (e) {
    case "fund":
      return t.arriving ? [] : [
        t.played ? "Out of plays." : "No plays yet.",
        "Tap “Add plays” to top up, or open an album someone shares with you."
      ];
    case "over":
      return ["Your player is holding more than it should, so plays are paused. Open “This device” below to send the extra back."];
    default:
      return [];
  }
}
const oC = "Make your player once, with Face ID or your fingerprint, and the music starts.", iC = "Checking your player…", hf = () => ({ album: null, phase: "idle", track: null, since: 0, heard: 0 });
function Gb(e) {
  try {
    const t = JSON.parse(e.get(zb) || "[]");
    return Array.isArray(t) ? t.filter((n) => typeof n == "string").slice(-50) : [];
  } catch {
    return [];
  }
}
function aC(e, t) {
  const n = Gb(e).filter((r) => r !== t);
  n.push(t), e.set(zb, JSON.stringify(n.slice(-50)));
}
function nd(e, t) {
  switch (t.kind) {
    case "offer":
      return e.album === t.album && e.phase !== "idle" ? e : { ...hf(), album: t.album, phase: t.already ? "done" : "open" };
    case "withdraw":
      return e.phase === "idle" ? e : hf();
    case "now":
      return e.phase === "open" && t.playing && t.track ? { ...e, phase: "playing", track: t.track, since: t.at } : e.phase === "playing" && t.track && t.track !== e.track ? { ...e, phase: "done" } : e.phase === "playing" && t.at - e.since > Zg ? { ...e, phase: "done" } : e;
    case "listened":
      return e.phase !== "playing" ? e : e.heard >= 1 ? { ...e, phase: "done" } : { ...e, heard: e.heard + 1 };
    case "tick":
      return e.phase === "playing" && t.at - e.since > Zg ? { ...e, phase: "done" } : e;
  }
}
const Kc = (e) => e.phase === "open" || e.phase === "playing";
function cC(e = {}) {
  return [
    { id: "stx", label: "STX", blurb: "Send STX straight to your player.", unit: "microSTX", settles: "direct", on: !0 },
    { id: "card", label: "Card", blurb: "Pay by card or Apple Pay.", unit: "pence", settles: "converted", on: e.card === !0 },
    { id: "sbtc", label: "Bitcoin", blurb: "Pay with sBTC.", unit: "sats", settles: "converted", on: e.sbtc === !0 }
  ];
}
const lC = [100, 250, 500, 1e3], uC = (e, t = Rr) => BigInt(e) * On(t);
function dC(e, t = Rr, n = 0n) {
  const r = $s - e - n;
  return r > 0n ? Number(r / On(t)) : 0;
}
function fC(e, t = Rr, n = 0n) {
  const r = e === void 0 ? 0 : dC(e, t, n);
  return lC.map((o) => ({ plays: o, stx: uC(o, t), fits: e !== void 0 && o <= r }));
}
const hC = {
  microSTX: (e) => `${e / 1000000n}.${(e % 1000000n).toString().padStart(6, "0").replace(/0+$/, "").padEnd(2, "0")} STX`,
  sats: (e) => `${e.toLocaleString("en-GB")} sats`,
  pence: (e) => `£${e / 100n}.${(e % 100n).toString().padStart(2, "0")}`
}, pC = (e) => hC[e.unit](e.amount), Yt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, nl = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`;
function gC(e) {
  if (!e || e.plays < 1) return "";
  const t = [`paid for ${nl(e.plays, "play", "plays")}${e.artists > 0 ? ` to ${nl(e.artists, "artist", "artists")}` : ""}`];
  return e.likes > 0 && t.push(`saved ${nl(e.likes, "like", "likes")}`), `So far your player has ${t.join(" and ")}, all on the public record.`;
}
function yC(e) {
  let t = null, n = 0, r = "stx";
  const o = (i) => {
    var c;
    if (i.some((u) => u.plays === n && u.fits)) return;
    const a = i.filter((u) => u.fits);
    n = ((c = a.find((u) => {
      var h;
      return u.plays === ((h = i[1]) == null ? void 0 : h.plays);
    }) ?? a.at(-1)) == null ? void 0 : c.plays) ?? 0;
  };
  function s() {
    var w;
    if (!t) return;
    const i = e.input();
    if (!i) {
      t.close();
      return;
    }
    const a = fC(i.balance, i.fee, i.incoming);
    o(a);
    const c = cC(i.switches);
    (w = c.find((v) => v.id === r)) != null && w.on || (r = "stx");
    const u = [], h = Yt("h2", "ppp-connect__title", "Add plays");
    h.id = "ppp-restock-title", u.push(h), u.push(Yt("p", "ppp-restock__left", i.playsLeft === null ? "Checking your player…" : i.playsLeft === 0 ? "Your player is out of plays." : `Your player has ${nl(i.playsLeft, "play", "plays")} left.`));
    const d = gC(i.done);
    if (d && u.push(Yt("p", "ppp-restock__done", d)), i.arriving)
      u.push(Yt("p", "ppp-restock__wait", "Plays are already on their way to your player. They start by themselves when they land, so there is nothing to add right now."));
    else if (i.balance === void 0)
      u.push(Yt("p", "ppp-restock__wait", "Your player’s balance is unavailable right now, so nothing can be worked out. Try again in a moment."));
    else if (!a.some((v) => v.fits))
      u.push(Yt("p", "ppp-restock__wait", "Your player is full: it holds as many plays as one player can. Come back when you have used some."));
    else {
      const v = Yt("div", "ppp-restock__packs");
      v.setAttribute("role", "group"), v.setAttribute("aria-label", "How many plays");
      for (const N of a) {
        const U = Yt("button", "ppp-restock__pack" + (N.plays === n ? " is-on" : ""));
        U.type = "button", U.disabled = !N.fits, U.setAttribute("aria-pressed", String(N.plays === n)), U.append(Yt("b", "", N.plays.toLocaleString()), Yt("span", "", "plays")), U.onclick = () => {
          n = N.plays, s();
        }, v.append(U);
      }
      u.push(v);
      const x = Yt("div", "ppp-restock__ways");
      x.setAttribute("role", "group"), x.setAttribute("aria-label", "How to pay");
      for (const N of c) {
        const U = Yt("button", "ppp-restock__way" + (N.id === r ? " is-on" : ""));
        U.type = "button", U.disabled = !N.on, U.setAttribute("aria-pressed", String(N.id === r)), U.append(Yt("b", "", N.label), Yt("span", "", N.on ? N.blurb : "Soon")), U.onclick = () => {
          r = N.id, s();
        }, x.append(U);
      }
      u.push(x);
      const L = a.find((N) => N.plays === n);
      if (L && r === "stx") {
        const N = Yt("div", "ppp-restock__pay"), U = pC({ unit: "microSTX", amount: L.stx }), A = Yt("p", "ppp-restock__amount");
        A.append("Send ", Yt("b", "", U), " to your player:"), N.append(A, Yt("p", "ppp-addr-full ppp-restock__addr", i.address));
        const T = Yt("div", "ppp-restock__row");
        T.append(e.copyButton("restock-address", "Copy address", () => i.address, "primary"), e.copyButton("restock-amount", "Copy amount", () => Mr(L.stx), "")), N.append(T), N.append(Yt("p", "ppp-restock__note", `From any Stacks wallet or an exchange, on the Stacks network. A different amount is fine: ${i.backedUp ? "your player is backed up, though larger amounts are safer in your main wallet" : "your player holds up to 1 STX"}. The plays appear here by themselves, usually within a few minutes, so you can close this.`)), u.push(N);
      }
    }
    u.push(Yt("p", "ppp-restock__why", "Every play pays whoever owns the song, directly. Nobody sits in between, and anyone can check it."));
    const m = Yt("button", "quiet ppp-connect__cancel", "Close");
    m.type = "button", m.onclick = () => t == null ? void 0 : t.close(), u.push(m), t.replaceChildren(...u);
  }
  return {
    isOpen: () => !!t,
    open() {
      if (t || !e.input()) return;
      t = Yt("dialog", "ppp-connect ppp-restock"), t.setAttribute("aria-labelledby", "ppp-restock-title");
      const i = t;
      i.addEventListener("close", () => {
        i.remove(), t === i && (t = null);
      }), i.addEventListener("click", (a) => {
        a.target === i && i.close();
      }), document.body.appendChild(i), s(), typeof i.showModal == "function" ? i.showModal() : i.setAttribute("open", "");
    },
    /** The page redrew (a balance changed, plays landed): keep the sheet in step. */
    refresh: s,
    close() {
      t == null || t.close();
    }
  };
}
const _r = (e) => e.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(), wC = (e) => !e || /^(?:Inscription )?#\d+$/.test(e.trim());
function mC(e, t) {
  const n = /* @__PURE__ */ new Set(), r = [];
  for (const o of Array.isArray(e) ? e : []) {
    const s = Number(o == null ? void 0 : o.id);
    if (!Number.isSafeInteger(s) || s < 0 || n.has(s)) continue;
    n.add(s);
    const i = t(s, { title: typeof o.title == "string" ? o.title : void 0, artist: typeof o.artist == "string" ? o.artist : void 0 });
    r.push({ id: s, title: wC(i.title) ? `#${s}` : i.title.trim(), artist: (i.artist || "").trim() });
  }
  return r.sort((o, s) => o.id - s.id);
}
function bC(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    if (!n.artist) continue;
    const r = _r(n.artist), o = t.get(r);
    o ? o.songs++ : t.set(r, { name: n.artist, songs: 1 });
  }
  return [...t.values()].sort((n, r) => r.songs - n.songs || n.name.localeCompare(r.name));
}
function xC(e, t, n = "", r = 60) {
  const o = _r(t).split(/\s+/).filter(Boolean), s = _r(n);
  if (!o.length && !s) return { songs: [], total: 0 };
  const i = [];
  for (const a of e) {
    const c = _r(a.artist), u = _r(a.title), h = String(a.id);
    if (s && c !== s) continue;
    let d = 0, m = !0;
    for (const w of o) {
      const v = w.replace(/^#/, "");
      if (u.includes(w)) d += u.startsWith(w) ? 0 : 1;
      else if (/^\d+$/.test(v) && h === v) d += 0;
      else if (c.includes(w)) d += 2;
      else if (/^\d+$/.test(v) && h.startsWith(v)) d += 3;
      else {
        m = !1;
        break;
      }
    }
    m && i.push({ s: a, rank: d });
  }
  return i.sort((a, c) => a.rank - c.rank || a.s.id - c.s.id), { songs: i.slice(0, r).map((a) => a.s), total: i.length };
}
const Sr = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, Qg = 12, SC = 14, ey = (e) => [...e.trim()].length <= SC;
function vC(e, t) {
  let n = null, r = "idle", o = "", s = "", i = !1;
  const a = Sr("input", "find-q");
  a.type = "search", a.placeholder = "Search songs, artists or #", a.setAttribute("aria-label", "Search all music"), a.autocomplete = "off";
  const c = Sr("div", "hint"), u = Sr("div", "find-artists" + (t.grid ? " find-artists--grid" : "")), h = Sr("ol", "likesList find-list");
  c.setAttribute("role", "status");
  const d = Sr("div", "likesTools");
  d.append(a), e.replaceChildren(d, c, u, h), a.oninput = () => {
    o = a.value, w();
  };
  function m() {
    r === "loading" || r === "ready" || (r = "loading", w(), t.load().then((v) => {
      n = v, r = "ready", w();
    }, () => {
      r = "failed", w();
    }));
  }
  function w() {
    const v = t.locked();
    if (a.disabled = v, v) {
      c.textContent = "An album is open and plays only its own songs. Go back to My player to find other music.", u.replaceChildren(), h.replaceChildren();
      return;
    }
    if (r === "idle") {
      c.textContent = "";
      return;
    }
    if (r === "loading") {
      c.textContent = "Loading the catalogue…";
      return;
    }
    if (r === "failed" || !n) {
      c.textContent = "The catalogue is unavailable right now. ";
      const T = Sr("button", "", "Try again");
      T.type = "button", T.onclick = () => {
        r = "idle", m();
      }, c.append(T), u.replaceChildren(), h.replaceChildren();
      return;
    }
    const x = bC(n), L = (T, B, X, Q = "", oe = "") => {
      const Y = Sr("button", "find-chip" + (oe ? " " + oe : "") + (B ? " is-on" : ""), T);
      return Y.type = "button", Y.setAttribute("aria-pressed", String(B)), Q && (Y.title = Q), Y.onclick = X, Y;
    }, N = (T, B, X = "") => L(B, _r(T.name) === _r(s), () => {
      s = _r(T.name) === _r(s) ? "" : T.name, w();
    }, `Show ${T.name}’s ${T.songs === 1 ? "song" : `${T.songs} songs`}`, X);
    if (t.grid) {
      const T = x.filter((Q) => ey(Q.name)), B = x.filter((Q) => !ey(Q.name)), X = i ? B : B.filter((Q) => _r(Q.name) === _r(s));
      u.replaceChildren(
        ...T.map((Q) => N(Q, Q.name)),
        ...B.length ? [L(i ? "Fewer artists" : `${B.length} more ${B.length === 1 ? "artist" : "artists"}`, !1, () => {
          i = !i, w();
        }, "", "find-more")] : [],
        ...X.map((Q) => N(Q, `${Q.name} · ${Q.songs}`, "find-chip--long"))
      );
    } else {
      const T = i ? x : x.slice(0, Qg);
      u.replaceChildren(
        ...T.map((B) => N(B, `${B.name} · ${B.songs}`)),
        ...x.length > Qg ? [L(i ? "Fewer artists" : `All ${x.length} artists`, !1, () => {
          i = !i, w();
        })] : []
      );
    }
    const U = xC(n, o, s), A = t.current();
    h.replaceChildren(...U.songs.map((T) => {
      var Q, oe;
      const B = Sr("li", "lrow" + (T.id === A ? " now" : "")), X = Sr("button", "lt", T.title);
      if (X.type = "button", X.title = `Play “${T.title}”${T.artist ? ` by ${T.artist}` : ""}`, X.onclick = () => t.play(T.id), (Q = t.explicit) != null && Q.call(t, T.id)) {
        const Y = Sr("span", "exp", "E");
        Y.title = "Explicit lyrics: only plays when you choose it", X.append(" ", Y);
      }
      if ((oe = t.liked) != null && oe.call(t, T.id)) {
        const Y = Sr("span", "find-liked", "♥");
        Y.title = "You like this song", Y.setAttribute("role", "img"), Y.setAttribute("aria-label", "Liked"), B.append(X, Y);
      } else B.append(X);
      return B.append(Sr("span", "find-by", `${T.artist ? T.artist + " · " : ""}#${T.id}`)), B;
    })), c.textContent = !o.trim() && !s ? `${n.length.toLocaleString()} songs by ${x.length.toLocaleString()} artists. Search, or pick an artist.` : U.total === 0 ? "Nothing matches. Try fewer words, or pick an artist." : U.total > U.songs.length ? `Showing ${U.songs.length} of ${U.total.toLocaleString()}. Type more to narrow it down.` : `${U.total} ${U.total === 1 ? "song" : "songs"}${s ? ` by ${s}` : ""}. Tap one to play it.`;
  }
  return { load: m, refresh: w };
}
const ty = (e, t, n) => Lf(Bf(new TextEncoder().encode(`xtrata-music-hero:${e}:${t}:${n}`))).slice(0, 8), AC = 317, EC = (e) => typeof e == "number" && Number.isSafeInteger(e) && e >= 1 && e <= 999999999, kC = 15 * 6e4, $C = (e) => /iPhone|iPad|iPod/.test(e.userAgent) || /Macintosh/.test(e.userAgent) && e.maxTouchPoints > 1;
function rd(e, t) {
  return e.standalone ? null : t ? "prompt" : $C(e) ? "ios" : null;
}
const ji = {
  label: "Add to Home Screen",
  title: "Add it to your Home Screen",
  body: "Your phone only lets you do this from its own menu. It takes a few taps:",
  close: "Got it"
};
function IC(e) {
  var n;
  return /CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/.test(e) ? "other" : Number(((n = /Version\/(\d+)/.exec(e)) == null ? void 0 : n[1]) ?? 0) >= 26 ? "safari-dots" : "safari";
}
function LC(e) {
  return e === "safari-dots" ? { steps: ["Tap ••• at the bottom right of your screen", "Tap Share", "Scroll down and tap “Add to Home Screen”", "Tap Add"], where: "bottom-right" } : e === "safari" ? { steps: ["Tap the Share button at the bottom of your screen (a square with an arrow)", "Scroll down and tap “Add to Home Screen”", "Tap Add"], where: "bottom" } : { steps: ["Tap the Share button beside the address bar (a square with an arrow)", "Tap “Add to Home Screen”", "Tap Add"], where: "top-right" };
}
const cr = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, CC = (e) => {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  t.setAttribute("viewBox", "0 0 26 26"), t.setAttribute("aria-hidden", "true");
  const n = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return n.setAttribute("d", e), t.append(n), t;
};
function TC(e, t, n = "safari") {
  const r = LC(n), o = cr("div", "a2hs-sheet a2hs-sheet--" + r.where);
  o.setAttribute("role", "dialog"), o.setAttribute("aria-modal", "true"), o.setAttribute("aria-label", ji.title);
  const s = cr("div", "a2hs-card"), i = cr("div", "a2hs-head"), a = cr("img", "a2hs-icon");
  a.src = e, a.alt = "";
  const c = cr("div");
  c.append(cr("h2", "", ji.title), cr("p", "", ji.body)), i.append(a, c);
  const u = cr("ol", "a2hs-steps");
  r.steps.forEach((m, w) => {
    const v = cr("li");
    v.append(cr("i", "", String(w + 1)), cr("span", "", m)), u.append(v);
  });
  const h = cr("div", "a2hs-arrow");
  h.setAttribute("aria-hidden", "true"), h.append(CC(r.where === "top-right" ? "M13 22V5M6 12l7-7 7 7" : "M13 4v17M6 14l7 7 7-7"));
  const d = cr("button", "a2hs-close", ji.close);
  return d.type = "button", d.onclick = t, s.append(i, u, d), o.append(s, h), o.onclick = (m) => {
    m.target === o && t();
  }, o;
}
function BC(e) {
  let t = null, n = null, r = !1;
  const o = () => {
    n == null || n.remove(), n = null, e.button.focus();
  }, s = () => {
    const i = r ? null : rd(e.env(), !!t);
    e.button.hidden = !i, e.button.dataset.kind = i ?? "";
  };
  return e.button.setAttribute("aria-label", ji.label), e.button.title = ji.label, e.button.onclick = () => {
    var a;
    const i = rd(e.env(), !!t);
    if (i === "prompt" && t) {
      const c = t;
      t = null;
      try {
        c.prompt();
      } catch {
      }
      s();
      return;
    }
    i === "ios" && !n && (n = TC(e.icon, o, IC(e.env().userAgent)), e.mount.append(n), (a = n.querySelector(".a2hs-close")) == null || a.focus());
  }, e.target.addEventListener("beforeinstallprompt", (i) => {
    i.preventDefault(), t = i, s();
  }), e.target.addEventListener("appinstalled", () => {
    r = !0, t = null, o(), s();
  }), s(), { sync: s, kind: () => r ? null : rd(e.env(), !!t) };
}
const ny = document.getElementById("ppp");
ny && NC(ny);
function NC(e) {
  var $n;
  const t = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = m1(), o = (l) => e.querySelector(l), s = o(".ppp-frame");
  let i = null;
  const a = async (l, p) => {
    const y = await fetch(l, { cache: "no-store", ...p, signal: AbortSignal.timeout(15e3) }), f = await y.json().catch(() => ({}));
    if (!y.ok) throw new Error((f == null ? void 0 : f.error) || `Request failed (${y.status}).`);
    return f;
  }, c = W5({
    now: Date.now,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    config: (l) => a("/radio/listening-wallet/config?main=" + encodeURIComponent(l || "")),
    links: async (l) => (await a("/radio/listening-wallet/link?main=" + encodeURIComponent(l))).links ?? [],
    mainOf: async (l) => {
      var y;
      const p = (await a("/radio/listening-wallet/link?listening=" + encodeURIComponent(l))).links;
      return ((y = p == null ? void 0 : p.find((f) => f.listening === l)) == null ? void 0 : y.main) ?? null;
    },
    saveLink: async (l) => {
      await a("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(l) });
    },
    bridge: async (l) => {
      i = document.createElement("iframe"), i.title = "Xtrata listening wallet", i.setAttribute("allow", `publickey-credentials-get ${l}; publickey-credentials-create ${l}`), i.referrerPolicy = "no-referrer";
      const p = new Promise((ie, Se) => {
        i.addEventListener("load", () => ie(), { once: !0 }), setTimeout(() => Se(new Error("The listening wallet did not load.")), 15e3);
      });
      i.src = l + "/", s.replaceChildren(i), await p;
      const y = new l1({ walletOrigin: l, frame: i, timeoutMs: 30 * 6e4 }), f = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.prove", "listening.backup", "listening.signAward", "listening.approveSession", "listening.prepareReturn"]), j = (ie, Se) => f.has(ie) ? y.request(ie, Se) : Promise.race([
        y.request(ie, Se),
        new Promise((Ee, Oe) => setTimeout(() => Oe(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await j("listening.status"), { request: j };
    },
    chain: {
      verify: C5,
      balance: B5,
      account: T5,
      owner: N5,
      broadcast: M5,
      transaction: _5,
      confirmedNonce: async (l) => {
        const p = await bo(`/v2/accounts/${l}?proof=0`);
        if (!Number.isSafeInteger(p == null ? void 0 : p.nonce) || p.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(p.nonce);
      }
    },
    signWithMain: (l, p) => zu({ ...p, network: "mainnet", stxAddress: l }),
    deposit: (l, p, y) => new Promise((f, j) => fg({
      recipient: p,
      amount: y.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: l,
      network: new sd(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (ie) => f(ie.txId || ""),
      onCancel: () => j(new Error("Deposit cancelled. Nothing was sent.")),
      onError: j
    })),
    validate: P5,
    tabLock: (l) => new Promise((p) => {
      const y = navigator.locks;
      if (!(y != null && y.request)) {
        p(!0);
        return;
      }
      y.request("xtrata-ppp:" + l, { ifAvailable: !0 }, async (f) => {
        p(!!f), f && await new Promise(() => {
        });
      });
    }),
    store: {
      get: (l) => {
        try {
          return localStorage.getItem(l);
        } catch {
          return null;
        }
      },
      set: (l, p) => {
        try {
          localStorage.setItem(l, p);
        } catch {
        }
      }
    },
    changed: () => g(c.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (l) => {
      var p, y;
      return v.funder(l, () => j5(l, bo), !!((y = (p = c.snapshot().gate) == null ? void 0 : p.gifts) != null && y.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (l) => {
      const p = await a("/radio/gift/for?wallet=" + encodeURIComponent(l)), y = p == null ? void 0 : p.gift;
      if (!y) return null;
      if (typeof y.returnTo != "string" || typeof y.treasury != "string") throw new Error("Unreadable gift record.");
      return {
        returnTo: y.returnTo,
        from: typeof y.from == "string" ? y.from : null,
        source: String(y.source ?? ""),
        amount: String(y.amount ?? "0"),
        treasury: y.treasury,
        state: y.state === "sending" ? "sending" : "arrived",
        player: y.player ?? null,
        ...y.drop === "players" || y.drop === null ? { drop: y.drop } : {}
      };
    },
    // Music Hero awards: a failed request throws (shown as "can't check"), it is never read as "no award" or "no plays".
    awardStatus: async (l) => {
      const p = await a("/radio/awards/status?address=" + encodeURIComponent(l));
      if (typeof (p == null ? void 0 : p.state) != "string") throw new Error("Unreadable award status.");
      return p;
    },
    awardName: async (l) => {
      const p = await a("/radio/awards/name?address=" + encodeURIComponent(l));
      if ((p == null ? void 0 : p.name) !== null && typeof (p == null ? void 0 : p.name) != "string") throw new Error("Unreadable name.");
      return p.name;
    },
    awardNote: async (l, p) => {
      const y = await a("/radio/awards/note", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ address: l, name: p }) });
      if (typeof (y == null ? void 0 : y.record) != "string" || typeof (y == null ? void 0 : y.signature) != "string" || !Number.isSafeInteger(y == null ? void 0 : y.cls) || !Number.isSafeInteger(y == null ? void 0 : y.number) || !Number.isSafeInteger(y == null ? void 0 : y.plays)) throw new Error("Unreadable award note.");
      return { cls: y.cls, number: y.number, plays: y.plays, record: y.record, signature: y.signature, name: typeof y.name == "string" ? y.name : null };
    },
    history: (l, p) => G5(l, (y) => bo(y), p),
    likesChanged: () => {
      var l, p;
      (p = (l = window.XtrataRadio) == null ? void 0 : l.refreshLikes) == null || p.call(l);
    },
    likeState: async (l, p) => {
      const y = await a("/radio/chain-likes?" + new URLSearchParams({ wallet: l, ids: String(p) })), f = Array.isArray(y == null ? void 0 : y.rows) ? y.rows.find((j) => (j == null ? void 0 : j.id) === p) : null;
      if (!f || typeof f.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: f.liked, by: Array.isArray(f.by) ? f.by.filter((j) => typeof j == "string") : f.liked ? [l] : [] };
    },
    likeSent: (l, p) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: l, liked: p } })),
    nameOf: (l) => yt(l) ?? void 0,
    likeConfirmed: (l, p) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: l, liked: p } })),
    likeFailed: (l) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: l } }))
  }), u = (l, p, y, f, j, ie) => new Promise((Se, Ee) => fg({
    recipient: f,
    amount: j.toString(),
    memo: ie,
    stxAddress: y,
    network: new sd(),
    appDetails: { name: l, icon: "/favicon.svg" },
    onFinish: (Oe) => Se(Oe.txId || ""),
    onCancel: () => Ee(new Error(p)),
    onError: Ee
  })), h = (l) => v.incomingStarter() && l.canAnother && l.hadGift === !1 && !l.main && l.listening && !l.createdHere && !l.brandNew && ["locked", "ready", "fund", "over", "link"].includes(l.step) && !l.busy ? () => void c.create({ quick: !0, another: !0 }) : null, d = (l) => h(l) && l.canForget ? () => {
    m.start(l), g(c.snapshot());
  } : null, m = XL({
    json: a,
    unlock: () => void c.unlock(),
    returnAll: () => void c.returnFunds("all"),
    forget: () => c.forget(),
    backup: () => void c.backup(),
    keepBoth: (l) => h(l),
    who: (l) => ve(l),
    changed: () => g(c.snapshot()),
    store: {
      get: (l) => {
        try {
          return localStorage.getItem(l);
        } catch {
          return null;
        }
      },
      set: (l, p) => {
        try {
          p === null ? localStorage.removeItem(l) : localStorage.setItem(l, p);
        } catch {
        }
      }
    },
    dust: (l) => {
      var p;
      return BigInt(((p = l.gate) == null ? void 0 : p.limits.returnFee) ?? "3000");
    }
  }), w = () => ({ quick: !!v.incomingStarter(), ...m.claiming() ? { another: !0 } : {} }), v = rL({
    json: a,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    pay: (l, p, y, f) => u("Xtrata Radio · gift", "Gift cancelled. Nothing was sent.", l, p, y, f),
    sign: (l, p) => zu({ ...p, network: "mainnet", stxAddress: l }),
    giftSent: (l, p) => c.giftSent(l, p),
    claiming: (l) => c.giftClaiming(l),
    batchDays: () => {
      var l, p;
      return (p = (l = c.snapshot().gate) == null ? void 0 : l.gifts) == null ? void 0 : p.batchDays;
    },
    claimNew: (l) => h(l),
    replaceOld: (l) => d(l),
    album: { bind: (l) => c.bindAlbum(l), arrived: async (l, p, y, f) => {
      x.invalidate(), await c.albumArriving(l, p, y, f);
    } },
    who: (l) => ve(l),
    changed: () => g(c.snapshot()),
    store: {
      get: (l) => {
        try {
          return localStorage.getItem(l);
        } catch {
          return null;
        }
      },
      set: (l, p) => {
        try {
          p === null ? localStorage.removeItem(l) : localStorage.setItem(l, p);
        } catch {
        }
      }
    },
    now: Date.now
  }), x = hL({
    json: a,
    open: (l) => {
      c.openAlbum(l);
    },
    store: {
      get: (l) => {
        try {
          return localStorage.getItem(l);
        } catch {
          return null;
        }
      },
      set: (l, p) => {
        try {
          p === null ? localStorage.removeItem(l) : localStorage.setItem(l, p);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => g(c.snapshot())
  }), L = {
    get: (l) => {
      try {
        return localStorage.getItem(l);
      } catch {
        return null;
      }
    },
    set: (l, p) => {
      try {
        p === null ? localStorage.removeItem(l) : localStorage.setItem(l, p);
      } catch {
      }
    }
  }, N = QL(location.search, L);
  N.on && (document.documentElement.dataset.novice = N.preview ? "preview" : "1");
  const U = (l) => N.on && l.solo, A = N.on || (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), T = A ? document.getElementById("album") : null, B = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (l) => void c.topUpAlbum(l),
    openPlayer: () => void c.openAlbum(0)
  }, X = T ? Vg(T, B) : null, Q = VL({
    json: a,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    sign: (l, p) => zu({ ...p, network: "mainnet", stxAddress: l }),
    signShelf: (l, p) => c.signShelf(l, p),
    pay: (l, p, y, f) => u("Xtrata Music · album", "Payment cancelled. Nothing was sent.", l, p, y, f),
    copies: (l, p) => {
      var y;
      return v.copies(l, p, ((y = c.snapshot().gate) == null ? void 0 : y.radioUrl) ?? null);
    },
    player: () => {
      const l = c.snapshot(), p = l.slot === 0 ? l.listening : l.root;
      return { address: p, unlocked: !!p && ["ready", "fund", "over", "link"].includes(l.step) };
    },
    open: (l) => mr(l, !0),
    who: (l) => ve(l),
    art: { song: (l, p) => p && Nh(String(l)) || Rg(String(l)), cover: (l) => tl(l) },
    audition: NL({
      changed: () => g(c.snapshot()),
      quiet: () => {
        var p;
        const l = window.XtrataRadio;
        try {
          (p = l == null ? void 0 : l.getState) != null && p.call(l).playing && l.playPause();
        } catch {
        }
      }
    }),
    changed: () => g(c.snapshot()),
    store: {
      get: (l) => {
        try {
          return localStorage.getItem(l);
        } catch {
          return null;
        }
      },
      set: (l, p) => {
        try {
          p === null ? localStorage.removeItem(l) : localStorage.setItem(l, p);
        } catch {
        }
      }
    },
    now: () => Date.now()
  }), oe = () => {
    const l = new Set(gn.map((p) => p.id));
    return [...gn, ...Q.albums().filter((p) => !l.has(p.id))];
  }, Y = T ? OL(T) : null, b = "xtrata.radio.award.later.v1";
  let I = "ready", M = !1, P = (() => {
    try {
      return Date.now() - Number(localStorage.getItem(b) || 0) < 24 * 36e5;
    } catch {
      return !1;
    }
  })(), W = !1;
  const R = "xtrata.radio.tier.v1";
  let le = (() => {
    const l = L.get(R);
    return jc(l) ? jo(l) : null;
  })();
  const ue = (() => {
    try {
      return new URLSearchParams(location.search).get("mystery") === "1" && sessionStorage.setItem("xtrata.radio.mystery", "1"), sessionStorage.getItem("xtrata.radio.mystery") === "1";
    } catch {
      return !1;
    }
  })();
  function Xe(l) {
    var j;
    if (l.listening && l.slot === 0 && ["fund", "ready", "over"].includes(l.step) && !(l.gift && l.gift.drop === void 0)) {
      let ie = null;
      try {
        ie = l.gift && !l.gift.player && l.gift.drop === "players" ? qI(BigInt(l.gift.amount)) : null;
      } catch {
        ie = null;
      }
      ((j = l.award) == null ? void 0 : j.state) === "claimed" && l.award.holds === !1 && (ie = null), ((ie == null ? void 0 : ie.id) ?? null) !== ((le == null ? void 0 : le.id) ?? null) && (le = ie, L.set(R, ie ? ie.id : null));
    }
    const p = document.documentElement;
    le ? p.dataset.tier = le.id : delete p.dataset.tier;
    const y = document.querySelector("#ppp .ppp-head h3");
    if (!y) return;
    let f = y.querySelector(".ppp-tier");
    if (!le) {
      f == null || f.remove();
      return;
    }
    f || (f = $("span", "", "ppp-tier"), y.append(f)), f.dataset.tier = le.id, f.textContent = `${le.mark} ${le.name.toUpperCase()} PLAYER`, f.title = `A ${le.name} player from the Xtrata Music giveaway`;
  }
  const C = (() => {
    var l;
    try {
      return !!((l = window.matchMedia) != null && l.call(window, "(display-mode: standalone)").matches) || navigator.standalone === !0;
    } catch {
      return !1;
    }
  })(), F = document.getElementById("a2hs");
  F && BC({
    button: F,
    icon: "/radio/icons/app-192.png",
    mount: document.body,
    target: window,
    env: () => ({ userAgent: navigator.userAgent, maxTouchPoints: navigator.maxTouchPoints || 0, standalone: C })
  });
  let re = N.on ? AC : null, de = !1, Be = 0, Me = "";
  N.on && a("/radio/giveaway/players/intro").then((l) => {
    const p = l && l.song === null ? null : EC(l == null ? void 0 : l.song) ? l.song : re;
    p !== re && !de && (re = p, g(c.snapshot()));
  }).catch(() => {
  });
  const Ot = (() => {
    try {
      const l = Number(new URLSearchParams(location.search).get("n"));
      Number.isSafeInteger(l) && l >= 1 && l <= 1e5 && sessionStorage.setItem("xtrata.radio.spot", String(l));
      const p = Number(sessionStorage.getItem("xtrata.radio.spot"));
      return Number.isSafeInteger(p) && p >= 1 ? p : null;
    } catch {
      return null;
    }
  })(), Ge = (l) => {
    var f, j, ie;
    if (!de || re === null) return !1;
    if (Date.now() - Be > kC || l.step === "ready")
      return l.step !== "ready" && (de = !1), !1;
    const p = (j = (f = window.XtrataRadio) == null ? void 0 : f.getState) == null ? void 0 : j.call(f), y = Number((ie = p == null ? void 0 : p.nowPlaying) == null ? void 0 : ie.tokenId);
    return Date.now() - Be < 2e4 && !Number.isSafeInteger(y) ? !0 : y !== re ? (de = !1, !1) : !0;
  };
  function _e() {
    const l = window.XtrataRadio;
    if (!(re === null || !(l != null && l.playToken))) {
      de = !0, Be = Date.now(), c.holdFirstPlay(), g(c.snapshot());
      try {
        l.playToken(re);
      } catch {
        de = !1;
      }
    }
  }
  const Pe = () => {
    var f, j;
    if (!de || re === null) return null;
    const l = (j = (f = window.XtrataRadio) == null ? void 0 : f.getState) == null ? void 0 : j.call(f), p = l != null && l.nowPlaying && Number(l.nowPlaying.tokenId) === re ? l.nowPlaying : null, y = Rt.get(re);
    return { title: (p == null ? void 0 : p.title) || (y == null ? void 0 : y.title) || "", artist: (p == null ? void 0 : p.artist) || (y == null ? void 0 : y.artist) || "", art: `/radio/artwork?id=${re}`, playing: !!(l != null && l.playing) };
  }, _t = N.on && T ? vL(T) : null, En = Date.now();
  let lt = !1, Zt = null, kt = (() => {
    try {
      return sessionStorage.getItem("xtrata.radio.novice.full") === "1";
    } catch {
      return !1;
    }
  })();
  const z = () => {
    kt = !0;
    try {
      sessionStorage.setItem("xtrata.radio.novice.full", "1");
    } catch {
    }
    g(c.snapshot());
  }, H = (l, p) => {
    var ie;
    if (!_t || p || kt) return null;
    if (!l.gate || l.step === "loading" || (lt = !0), !lt) return Date.now() - En < 1e4 ? "checking" : null;
    if (!U(l) || m.active() && l.step !== "intro") return null;
    if (l.step === "intro" || l.step === "unsupported") return v.incomingStarter() ? "gift" : "new";
    if (l.step === "locked") return "back";
    const f = l.slot === 0 && !((ie = l.gift) != null && ie.player), j = f && !l.entries.some((Se) => Se.kind === "play");
    return l.step === "fund" && j ? l.depositPending ? "arriving" : "empty" : l.step === "ready" && f && (Zt === "landed" || Zt === "arriving" && (j || de)) ? "landed" : l.step === "loading" && Zt !== "checking" ? Zt : null;
  };
  let ee = !1;
  function se(l, p, y = [], f) {
    if (!_t) return;
    const j = f !== void 0 ? f : H(l, p);
    if (Zt = j, delete document.documentElement.dataset.noviceBoot, !j) {
      _t.render(null, p);
      return;
    }
    const ie = [...y];
    j === "arriving" && l.arrival && ie.push(Dn(l.arrival)), l.step === "unsupported" ? ie.push($("p", "This browser cannot make a player. Open this page in Safari or Chrome.", "ppp-warn")) : l.error && ie.push($("p", l.error, "ppp-warn"));
    const Se = j === "gift" ? v.incomingStarter() : null;
    Se && re === null && !ee && l.step === "intro" && !l.busy && !l.armed && !l.error && !er && (ee = !0, c.create({ quick: !0, ...m.claiming() ? { another: !0 } : {} })), _t.render({
      mode: j,
      status: ie,
      asking: !!l.busy || l.armed,
      busy: !!l.busy,
      canStart: (l.step === "intro" || l.step === "locked") && !er,
      plays: Se ? Se.plays : j === "landed" ? l.playsLeft : null,
      from: (Se == null ? void 0 : Se.from) ?? null,
      tier: le,
      mystery: ue,
      spot: Ot,
      installed: C,
      intro: Se && re !== null && l.step === "intro" ? { ready: !0 } : null,
      now: Pe(),
      albums: j === "landed" ? gn.map((Ee) => ({ title: Ee.title, by: Ee.subtitle, cover: tl(Ee.cover), run: () => {
        z(), mr(Ee, !0);
      } })) : [],
      claimNew: j === "back" ? h(l) : null,
      replaceOld: j === "back" ? d(l) : null,
      start: () => {
        Se && re !== null && _e(), c.create(w());
      },
      unlock: () => void c.unlock(),
      returning: () => void c.unlock(!0),
      restock: () => Ne(),
      full: () => {
        var Tt, ht, ot;
        const Ee = window.XtrataRadio, Oe = j === "landed" && !((ht = (Tt = Ee == null ? void 0 : Ee.getState) == null ? void 0 : Tt.call(Ee)) != null && ht.playing);
        de = !1, z(), Oe && ((ot = Ee == null ? void 0 : Ee.playPause) == null || ot.call(Ee));
      }
    });
  }
  _t && setTimeout(() => {
    lt || g(c.snapshot());
  }, 10100), Ch(() => {
    (_t != null && _t.showing() || document.documentElement.dataset.asking || Q.wantsArt()) && g(c.snapshot());
  });
  const dt = yC({
    input: () => {
      var j, ie, Se, Ee;
      const l = c.snapshot();
      if (!["fund", "ready", "over"].includes(l.step)) return null;
      const p = l.slot === 0 ? { address: l.listening, balance: l.balance } : { address: l.root, balance: (j = l.likeFunds) == null ? void 0 : j.balance };
      if (!p.address) return null;
      const y = l.slot === 0 ? l.entries : [], f = y.filter((Oe) => Oe.kind === "play" && Oe.status === "confirmed");
      return {
        playsLeft: p.balance === void 0 ? null : Ce(p.balance),
        balance: p.balance,
        incoming: 0n,
        fee: BigInt(((ie = l.gate) == null ? void 0 : ie.limits.playFee) ?? "300"),
        address: p.address,
        switches: ((Se = l.gate) == null ? void 0 : Se.restock) ?? {},
        backedUp: l.backedUp,
        done: f.length ? { plays: f.length, artists: new Set(f.map((Oe) => Oe.recipient)).size, likes: y.filter((Oe) => Oe.kind === "like" && Oe.status === "confirmed" && Oe.liked).length } : null,
        arriving: l.slot === 0 ? l.depositPending : !!((Ee = l.likeFunds) != null && Ee.pending)
      };
    },
    copyButton: (l, p, y, f) => fr(l, p, y, f, () => {
      g(c.snapshot());
    })
  }), Ne = () => {
    if (!c.snapshot().unproven) {
      dt.open();
      return;
    }
    c.prove().then((l) => {
      l && dt.open();
    });
  }, He = document.getElementById("albumList"), St = He ? Vg(He, B, { list: !0 }) : null, Ke = "xtrata.radio.album.last.v1", Ie = () => {
    try {
      const l = JSON.parse(localStorage.getItem(Ke) || "null");
      return l && typeof l.root == "string" && Number.isSafeInteger(l.slot) && l.slot > 0 && l.player && Array.isArray(l.player.tracks) ? l : null;
    } catch {
      return null;
    }
  };
  let Ze = "";
  const Ye = (l) => {
    const p = JSON.stringify(l);
    if (p !== Ze) {
      Ze = p;
      try {
        localStorage.setItem(Ke, p);
      } catch {
      }
    }
  };
  let Ve = null;
  window.XtrataRadioLikeHandler = (l) => {
    var y;
    if (!l || !Number.isSafeInteger(l.song) || l.song < 0) return !1;
    (y = c.snapshot().likeFunds) != null && y.album && (O = !0), Xn();
    const p = Nn(l.song, { title: l.title, artist: l.artist });
    return c.heart({ song: l.song, title: p.title || void 0, artist: p.artist || void 0, likedBy: Array.isArray(l.likedBy) ? l.likedBy : void 0 });
  };
  let Ht;
  window.XtrataRadioListeningIdentity = () => {
    const l = c.snapshot();
    return l.solo && l.step !== "off" && l.step !== "elsewhere" ? l.listening : void 0;
  };
  const pn = (l) => {
    var y, f;
    const p = window.XtrataRadioListeningIdentity();
    p !== Ht && (Ht = p, (f = (y = window.XtrataRadio) == null ? void 0 : y.refreshLikes) == null || f.call(y));
  };
  let gn = [], Vn = 0, $t = !1, un = null;
  const Ir = (l) => {
    var p, y;
    $t || !((y = (p = l.gate) == null ? void 0 : p.gifts) != null && y.enabled) || Date.now() - Vn < 6e4 || (Vn = Date.now(), a("/radio/gift/featured").then((f) => {
      gn = (Array.isArray(f == null ? void 0 : f.players) ? f.players : []).filter((j) => j && typeof j.id == "string" && typeof j.title == "string" && Array.isArray(j.tracks) && j.tracks.length > 0).slice(0, 6), $t = !0, gn.length && g(c.snapshot());
    }).catch(() => {
    }));
  }, zr = (l) => {
    var p;
    return un && l.slot === 0 && !((p = l.gift) != null && p.player) && ["ready", "fund", "loading"].includes(l.step) ? un : null;
  }, mr = (l, p = !1) => {
    var f, j;
    un = l, g(c.snapshot());
    const y = l && p ? Dr(l)[0] : null;
    y && ((j = (f = window.XtrataRadio) == null ? void 0 : f.playToken) == null || j.call(f, y.id));
  };
  let bt = hf(), yn = null;
  const Dt = (l) => {
    const p = N.preview && !er && l.step === "intro" ? v.incomingAlbum() : null;
    return p ? (bt = nd(bt, { kind: "offer", album: p.player.id, already: Gb(L).includes(p.player.id) }), Kc(bt) ? p.player : null) : (bt = nd(bt, { kind: "withdraw" }), null);
  }, wn = (l) => {
    const p = bt.phase;
    bt = nd(bt, l), bt.phase !== p && (bt.album && (bt.phase === "playing" || bt.phase === "done") && aC(L, bt.album), g(c.snapshot()));
  };
  setInterval(() => {
    bt.phase === "playing" && wn({ kind: "tick", at: Date.now() });
  }, 5e3);
  let Et = "", Vt, Gr = !1, ds = !1;
  const E = (l, p) => {
    var qe, je, Bt, qn, sr, Ds, bs, Ai;
    const y = window.XtrataRadio;
    if (!(y != null && y.setGiftPlayer) || !(y != null && y.setGiftStop)) return;
    const f = p.depositPending && l.step === "fund" && ((qe = l.giftStop) == null ? void 0 : qe.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : l.giftStop, j = yn, ie = Ge(l), Se = f ? U(l) ? rC(f.reason, f.text) : f.text : null, Ee = j || ie ? null : Se ?? (t && (!((je = l.gate) != null && je.here) || l.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null);
    Ee && Ee !== Vt && (y.setGiftStop(Ee), Vt = Ee);
    const Oe = l.step === "off" || l.step === "elsewhere" ? null : ((Bt = l.gift) == null ? void 0 : Bt.player) ?? j ?? zr(l) ?? null, Tt = Oe ? Oe.id + ":" + Oe.cover + ":" + Oe.tracks.map((Fn) => Fn.id).join(",") : "";
    Tt !== Et && (y.setGiftPlayer(Oe ? { id: Oe.id, title: Oe.title, subtitle: Oe.subtitle, tracks: Dr(Oe).map((Fn) => Fn.id), hidden: ((qn = XI(Oe)) == null ? void 0 : qn.id) ?? null, cover: Oe.cover } : null), Et = Tt), Ee !== Vt && (y.setGiftStop(Ee), Vt = Ee);
    const ht = !ie && (f == null ? void 0 : f.reason) === "arriving";
    ht !== ds && ((sr = y.setGiftWait) == null || sr.call(y, ht), ds = ht);
    const ot = !!Oe && (!!j || !!((Ds = l.albumLock) != null && Ds.locked));
    ot !== Gr && ((bs = y.setGiftLock) == null || bs.call(y, ot), Gr = ot), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(l.step) && ((Ai = y.forgetWallets) == null || Ai.call(y));
  };
  let O = !1;
  const K = /* @__PURE__ */ new Map(), D = (l) => {
    if (!(l.step === "fund" && !l.depositPending && !!l.gift && !!l.listening && l.balance === 0n && !l.entries.some((f) => f.kind === "play") && (l.brandNew || l.createdHere))) return null;
    let y = K.get(l.listening);
    return y === void 0 && (y = Date.now(), K.set(l.listening, y)), Date.now() - y < Cl ? y : null;
  }, J = (l) => l.step === "fund" && !l.depositPending && !!l.gift && l.balance === 0n && !l.entries.some((p) => p.kind === "play") && !!l.listening && K.has(l.listening), te = (l) => l ? l.slice(0, 6) + "…" + l.slice(-4) : "", Ce = (l) => {
    const p = c.snapshot().playCost || 350n;
    return l > on ? Number((l - on) / p) : 0;
  }, Ae = (l) => (Number(l) / 1e6).toFixed(l < 1000n ? 6 : 4), Fe = (l) => {
    const p = Math.round((Date.now() - l) / 6e4);
    return p < 1 ? "now" : p < 60 ? `${p}m` : p < 1440 ? `${Math.round(p / 60)}h` : `${Math.round(p / 1440)}d`;
  }, ft = (l) => `https://explorer.hiro.so/txid/${l}?chain=mainnet`, $ = (l, p = "", y = "") => {
    const f = document.createElement(l);
    return p && (f.textContent = p), y && (f.className = y), f;
  }, pe = (l, p, y = "") => {
    const f = $("button", l, y);
    return f.type = "button", f.onclick = p, f;
  }, ze = (l, p) => {
    const y = $("a", l);
    return y.href = p, y.target = "_blank", y.rel = "noopener", y;
  };
  let ut = null, Xt = location.hash === "#give";
  Xt && history.replaceState(null, "", location.pathname + location.search);
  let Ft = !1;
  const dn = MI((l) => NI({ address: l, network: "mainnet" }), () => g(c.snapshot())), yt = (l) => dn.get(l), er = qL(navigator.userAgent), Kr = (l, p) => {
    const y = navigator.userAgent, f = ZL(y), j = `${location.origin}${location.pathname}${p ? `#gift=${p}` : ""}`, ie = [$("p", `You are in ${l}'s built-in browser, where passkeys often do not work. Open this page in ${f} to make your ${N.on ? "player" : "listening wallet"}${p ? N.on ? " and open your gift" : " and claim your gift" : ""}.`, "ppp-warn")], Se = $("div", "", "ppp-open-row"), Ee = WL(j, y);
    if (Ee) {
      const Oe = $("a", `Open in ${f}`, "primary ppp-open-in");
      Oe.href = Ee, Oe.dataset.homeAction = "radio:open-in-browser", Se.append(Oe);
    }
    return Se.append(fr("copy-page-link", "Copy link", () => j, Ee ? "" : "primary", () => g(c.snapshot()))), ie.push(Se, $("p", `If that does not open ${f}, use ${l}'s menu (••• or ⋮) and choose "Open in ${f === "your browser" ? "browser" : f}", or paste the copied link there.`, "ppp-mute")), ie;
  }, ve = (l) => yt(l) ?? te(l), Jt = (l) => l.slice(0, 2).map(ve).join(" and ") + (l.length > 2 ? ` and ${l.length - 2} more` : ""), Ao = /* @__PURE__ */ new Map();
  let tr = !1;
  const Eo = (l) => !l || /^(?:Inscription )?#\d+$/.test(l.trim()), Xn = () => {
    tr || (tr = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((l) => l.ok ? l.json() : null).then((l) => {
      for (const p of Array.isArray(l == null ? void 0 : l.tracks) ? l.tracks : []) {
        const y = Number(p == null ? void 0 : p.id);
        Number.isSafeInteger(y) && Ao.set(y, { title: typeof p.title == "string" ? p.title : void 0, artist: typeof p.artist == "string" ? p.artist : void 0 });
      }
      g(c.snapshot());
    }).catch(() => {
      tr = !1;
    }));
  }, Nn = (l, p) => {
    const y = Ao.get(l), f = Tg(l, [y == null ? void 0 : y.title, p == null ? void 0 : p.title].find((ie) => !Eo(ie)) || ""), j = Lg(l, (y == null ? void 0 : y.artist) || (p == null ? void 0 : p.artist) || "");
    return { title: f, artist: j };
  }, mn = (l) => {
    const { title: p, artist: y } = Nn(l.song, l);
    return p ? `“${p}”${y ? ` — ${y}` : ""}` : `Song #${l.song}${y ? ` — ${y}` : ""}`;
  }, Ns = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, ko = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function wi(l) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(l.step) ? ["", ""] : l.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : l.step === "over" ? ["TOO MUCH", "bad"] : l.step === "locked" ? ["LOCKED", "mute"] : l.step === "intro" || l.step === "link" ? ["", ""] : l.step === "fund" ? l.depositPending ? ["ON ITS WAY", "warn"] : l.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : l.payingOn && l.session && l.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function Mn(l, p, y = "", f) {
    const j = $("dt", l), ie = $("dd", p, y);
    return f && ie.append(" ", f), [j, ie];
  }
  const nr = document.getElementById("ppp-top"), fs = () => {
    window.dispatchEvent(new CustomEvent("xtrata:radio-panel")), (s.hidden || s.classList.contains("ppp-frame--rest") ? e : s).scrollIntoView({ behavior: "smooth", block: "center" }), e.classList.remove("ppp-flash"), e.offsetWidth, e.classList.add("ppp-flash");
  }, Vr = () => {
    var p;
    const l = window.XtrataRadioConnectStacks;
    l ? l() : (p = document.getElementById("radio-wallet-connect")) == null || p.click();
  }, Yn = () => {
    var p, y;
    const l = c.snapshot();
    if (l.step === "connect" || l.step === "wrong-wallet") {
      Vr();
      return;
    }
    if (l.step === "elsewhere" && ((p = l.gate) != null && p.radioUrl)) {
      location.href = l.gate.radioUrl;
      return;
    }
    if (l.step === "locked" && !l.armed && !l.busy && c.unlock(), l.step === "ready" && ((y = l.giftStop) == null ? void 0 : y.reason) === "off" && !l.busy && c.switchOn(), l.step === "fund" && l.solo && !l.depositPending && !l.busy) {
      Ne();
      return;
    }
    fs();
  };
  nr && (nr.onclick = Yn);
  const $o = (l, p, y, f = "") => l.standIn && !l.mainConnected ? pe(`Connect ${ve(l.standIn)} to add STX`, Vr, f) : pe(p, y, f), Io = (l) => {
    c.useLinked(l).then(() => fs());
  };
  let hs = null;
  const Ms = () => {
    const l = Wg(c.snapshot(), ve);
    return l.length ? hs || (hs = new Promise((p) => {
      var ht;
      const y = $("dialog", "", "ppp-connect");
      y.setAttribute("aria-labelledby", "ppp-connect-title");
      let f = null;
      const j = (ot) => {
        f = ot, y.close();
      };
      y.addEventListener("close", () => {
        y.remove(), hs = null, p(f);
      }), y.addEventListener("click", (ot) => {
        ot.target === y && j(null);
      });
      const ie = (ot, qe, je, Bt, qn = !1) => {
        const sr = $("button", "", "ppp-connect__opt " + je);
        return sr.type = "button", sr.disabled = qn, sr.onclick = Bt, sr.append($("b", ot), $("span", qe)), sr;
      }, Se = $("h2", "Connect to Xtrata Music", "ppp-connect__title");
      Se.id = "ppp-connect-title";
      const Ee = l.map((ot) => ie(ot.label, ot.detail, "is-music", () => {
        if (j("music"), ot.action === "linked" && ot.main) {
          Io(ot.main);
          return;
        }
        const qe = Wg(c.snapshot(), ve).find((je) => je.action !== "linked");
        (qe == null ? void 0 : qe.action) === "create" ? c.create() : (qe == null ? void 0 : qe.action) === "unlock" && c.unlock(), fs();
      }, !!ot.disabled)), Oe = ie("Xverse or Leather", "If you already use one.", "is-stacks", () => j("stacks")), Tt = pe("Cancel", () => j(null), "quiet ppp-connect__cancel");
      y.append(Se, ...Ee, Oe, Tt), document.body.appendChild(y), y.showModal(), (ht = Ee.find((ot) => !ot.disabled)) == null || ht.focus();
    }), hs) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = Ms;
  function ps(l) {
    if (!nr) return;
    const p = (f, j, ie) => {
      nr.hidden = !1, nr.className = "ppp-top" + (j ? " is-" + j : ""), nr.replaceChildren($("span", "", "dot"), document.createTextNode(f)), nr.title = ie;
    }, y = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0;
    switch (l.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        nr.hidden = !0;
        return;
      case "elsewhere":
        return p("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        nr.hidden = !0;
        return;
      case "intro":
        return p("Set up your player", "", "Create a passkey listening wallet");
      case "wrong-wallet":
        return p(`Connect ${ve(l.linked)}`, "warn", `This device's listening wallet belongs to ${ve(l.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return p("Unlock", "", "One tap with your face or fingerprint");
      case "link":
        return p("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return l.depositPending ? p("Plays on their way", "quiet", "Plays start by themselves when they land") : p(l.entries.some((f) => f.kind === "play") ? "No plays left · add plays" : "Add plays", "warn", "Add plays to keep listening");
      case "over":
        return p("Too much in your player", "warn", "Return the extra to keep counting plays");
      case "loading":
        return p("Xtrata Music", "quiet", "Checking your player");
      case "ready":
        return l.payingOn && y > 0 && !l.giftStop ? p(`${y.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : p("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const ln = document.getElementById("pppNudge"), gs = document.getElementById("onair");
  ($n = ln == null ? void 0 : ln.querySelector("button")) == null || $n.addEventListener("click", () => Yn());
  const mi = {
    connect: "Connect your player to listen",
    intro: "Set up your player to listen",
    locked: "Unlock your player to listen",
    "wrong-wallet": "Switch wallets to listen",
    link: "Finish setup to listen",
    fund: "No plays yet",
    over: "Return the excess to listen",
    ready: "Music support is paused"
  }, Lo = {
    elsewhere: "Open",
    connect: "Connect",
    "wrong-wallet": "Switch wallet",
    intro: "Set up",
    locked: "Unlock",
    link: "Finish setup",
    fund: "Add plays",
    over: "Fix it",
    ready: "Switch on"
  }, _s = document.getElementById("claimCard");
  let Ps = !1, ys = 0, ws = 0;
  function bi(l) {
    if (!_s) return;
    const p = (l.step === "intro" || l.step === "connect" || l.step === "elsewhere") && !l.gift;
    p && !Ps && (Ps = !0, a("/radio/giveaway/players").then((f) => {
      (f == null ? void 0 : f.state) !== "open" || typeof f.free != "number" || typeof f.total != "number" || f.free <= 0 || (ys = f.free, ws = f.total, bi(c.snapshot()));
    }).catch(() => {
    })), _s.hidden = !(p && ys > 0);
    const y = _s.querySelector(".claim-n");
    y && ys > 0 && (y.textContent = `${ys.toLocaleString()} of ${ws.toLocaleString()} left`);
  }
  const Us = document.getElementById("youStatus");
  function Xr(l) {
    if (!Us || l.step === "loading") return;
    const p = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0, y = l.step === "ready" && l.payingOn && p > 0 && !l.giftStop, f = l.step === "intro" || l.step === "connect" || l.step === "elsewhere";
    Us.dataset.on = y ? "1" : "0";
    const j = Us.querySelector("b"), ie = Us.querySelector(".you-status__t > span");
    !j || !ie || (j.textContent = y ? "Connected to Xtrata Music" : f ? "No player connected" : "Your player is not connected", ie.textContent = y ? "Every play goes to the artist, and your likes are saved." : f ? "Connect a player to play songs and pay the artists you listen to." : l.step === "locked" ? "Unlock it below to carry on listening." : "See below for what it needs.");
  }
  function Lr(l) {
    if (l.step === "loading") return;
    const p = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0, y = l.step === "ready" && l.payingOn && p > 0 && !l.giftStop, f = l.step === "fund" && l.depositPending, j = l.step === "elsewhere" && !t, ie = y || f || j ? "" : mi[l.step] ?? "", Se = y ? "on" : j ? "free" : ie ? "off" : "";
    Se ? document.documentElement.dataset.ppp = Se : delete document.documentElement.dataset.ppp, gs && (gs.hidden = !Se || Se === "free", gs.querySelector(".onair-sub").textContent = y ? `${p.toLocaleString()} plays left` : "Plays off"), ln && (ln.hidden = Se !== "off" && Se !== "free", ln.classList.toggle("is-free", Se === "free"), Se === "free" ? (ln.querySelector(".nudge-t").textContent = "You’re on the free player", ln.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", ln.querySelector("button").textContent = "Get a player") : Se === "off" && (ln.querySelector(".nudge-t").textContent = ie, ln.querySelector(".nudge-s").textContent = U(l) ? l.step === "intro" ? oC : "" : "This radio requires a funded listening wallet with music support on.", ln.querySelector("button").textContent = Lo[l.step] ?? "Start"));
  }
  let jt = "";
  function rr(l) {
    const p = $("div", "", "ppp-pick");
    l.funderMultiple && l.returnToKind === "funder" && p.append($("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), l.returnToKind === "funder" && p.append($("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const y = $("input");
    y.type = "text", y.placeholder = "SP… address to send returns to", y.autocomplete = "off", y.spellcheck = !1, y.setAttribute("aria-label", "Address to return funds to"), y.value = jt, y.oninput = () => {
      jt = y.value;
    };
    const f = pe(l.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      c.setReturnAddress(y.value), jt = "";
    }, "tiny");
    return p.append(y, " ", f), l.returnToKind === "chosen" && p.append(" ", pe("Back to the funder", () => c.clearReturnAddress(), "tiny")), p;
  }
  const xi = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function Os() {
    const l = $("p", xi + " ", "ppp-mute");
    return l.append(ze("Xverse", "https://www.xverse.app/download"), " · ", ze("Leather", "https://leather.io/install-extension")), l;
  }
  let Co = "";
  const ga = (l) => {
    const p = document.documentElement, y = l.solo && !l.main ? l.listening ? te(l.listening) : "new" : "", f = tI() ? "1" : "", j = l.standIn && !l.mainConnected ? ve(l.standIn) : "";
    `${y}|${f}|${j}` !== Co && (Co = `${y}|${f}|${j}`, y ? p.dataset.pppSolo = y : delete p.dataset.pppSolo, j ? p.dataset.pppAs = j : delete p.dataset.pppAs, f ? p.dataset.pppWalletInstalled = f : delete p.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const l of [1500, 4e3, 9e3]) setTimeout(() => g(c.snapshot()), l);
  function Hs(l, p = "") {
    const y = $("div", "", "ppp-topup"), f = Yr(l);
    y.append($("span", "Add plays from My player: ", "ppp-mute"));
    for (const j of el) {
      const ie = pe(`+${j.toLocaleString()}`, () => void c.topUpAlbum(j), p);
      ie.disabled = f === void 0 || f < j || l.depositPending || !!l.busy, y.append(ie);
    }
    return f !== void 0 && f < el[0] && y.append($("p", "My player needs plays first (switch to My player above).", "ppp-mute")), y;
  }
  const Yr = (l) => {
    var f;
    const p = (f = l.likeFunds) == null ? void 0 : f.balance;
    if (p === void 0 || !l.playCost) return;
    const y = p - on - 6000n;
    return y > 0n ? Number(y / l.playCost) : 0;
  };
  function Si(l) {
    const p = l.likeFunds;
    if (!p || !p.album || !p.low && !p.pending) return [];
    if (p.low || (O = !1), p.low && !O) return [];
    const y = $("div", "", "ppp-pick ppp-lowbox");
    if (!p.low) {
      if (!p.txid) return [];
      const j = $("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return p.txid && j.append(ze("View", ft(p.txid))), y.append(j), [y];
    }
    y.append($("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), y.append($("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), y.append($("p", p.address, "ppp-addr-full"));
    const f = $("div", "", "ppp-open-row");
    if (f.append(fr("copy-likes-address", "Copy address", () => p.address, "primary", () => g(c.snapshot()))), p.main && !l.solo) {
      const j = $s - (p.balance ?? 0n);
      j > 0n && f.append($o(l, `Pay ${Mr(j)} STX from my wallet`, () => void c.topUpLikes(), "primary"));
    }
    return y.append(f), y.append($("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [y];
  }
  const Dn = (l) => {
    const p = $("div", "", "ppp-wait");
    p.dataset.since = String(l.since), p.dataset.grace = String(l.graceMs), p.setAttribute("role", "progressbar"), p.setAttribute("aria-label", "Your plays are arriving");
    const y = $("p", "", "ppp-wait-t"), f = $("div", "", "ppp-wait-track");
    return f.append($("div", "", "ppp-wait-fill")), p.append(y, f), vi(p), p;
  };
  function vi(l) {
    const p = Number(l.dataset.since), y = Number(l.dataset.grace) || 6e4, f = Math.max(0, Date.now() - p), j = l.querySelector(".ppp-wait-fill"), ie = l.querySelector(".ppp-wait-t");
    if (f < y) {
      const Se = Math.ceil((y - f) / 1e3);
      j.style.width = Math.max(4, Math.min(95, f / y * 100)).toFixed(0) + "%", ie.textContent = `Loading your plays · ${Se}s`, l.classList.remove("is-long"), l.setAttribute("aria-valuenow", String(Math.round(f / y * 100)));
    } else
      j.style.width = "", ie.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", l.classList.add("is-long"), l.removeAttribute("aria-valuenow");
  }
  let To = 0;
  setInterval(() => {
    const l = document.querySelectorAll(".ppp-wait");
    if (!l.length) {
      To = 0;
      return;
    }
    l.forEach(vi), ++To % 10 === 0 && g(c.snapshot());
  }, 1e3);
  let ms = null;
  function Bo(l) {
    if (l.step === "loading" && ms !== null) return;
    const y = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(l.step) || !!l.busy || l.armed || !!v.pendingCode() && !["ready", "fund", "over"].includes(l.step);
    y !== ms && (ms = y, y ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function g(l) {
    var jh, Rh, zh, Gh, Kh, Vh, Xh, Yh, qh, Wh, Zh, Jh, Qh, ep, tp, np, rp, sp;
    if (Q.sync(), Ve && ["ready", "fund", "over"].includes(l.step) && !l.busy) {
      const Z = Ve;
      Ve = null, l.root === Z.root && l.slot !== Z.slot && c.openAlbum(Z.slot);
    }
    const p = v.inProgress(l), y = D(l), f = p && l.step === "fund" ? { ...l, depositPending: !0 } : y !== null ? { ...l, depositPending: !0, arrival: { since: y, graceMs: Cl } } : l, j = f.error === Tl;
    if (pn(), Ir(l), Xe(l), yn = Dt(l), E(l, f), Bo(f), ga(f), !p && v.inProgress(l)) return;
    if (ps(f), Lr(f), bi(f), Xr(f), t && n && (n.hidden = !["off", "elsewhere", "loading"].includes(f.step), n.textContent = f.step === "loading" || !f.gate ? N.on ? iC : "Checking your listening wallet…" : N.on ? "Xtrata Music is unavailable here. Reload to check again." : "Paid radio is unavailable. Reload to check again."), e.hidden = f.step === "off", e.hidden) {
      se(f, !1);
      return;
    }
    const [ie, Se] = wi(f), Ee = o(".ppp-state");
    Ee.textContent = ie, Ee.className = "ppp-state" + (Se ? " ppp-state--" + Se : ""), Ee.hidden = !ie;
    const Oe = !!f.busy || f.armed, Tt = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(f.step) && (Oe || !["intro", "loading"].includes(f.step));
    s.hidden = !Tt, s.classList.toggle("ppp-frame--rest", !Oe && !Ft);
    const ht = o(".ppp-frame-label");
    ht.hidden = !0;
    const ot = Z5(f) ?? ut;
    ut = ot;
    const qe = "xtrata.radio.ppp.heard.v1", je = (() => {
      try {
        return localStorage.getItem(qe) === "1";
      } catch {
        return !1;
      }
    })();
    if (!je && f.entries.some((Z) => Z.kind === "play"))
      try {
        localStorage.setItem(qe, "1");
      } catch {
      }
    const Bt = je || f.slot > 0 && ((((jh = f.likeFunds) == null ? void 0 : jh.balance) ?? 0n) > 0n || x.count() > 1), qn = U(f), sr = !qn && Q5({ ...f, heard: Bt }, ot);
    o(".ppp-badge").hidden = !sr;
    const Ds = o(".ppp-steps"), bs = o(".ppp-stage");
    Ds.hidden = bs.hidden = !sr, ot && sr && (Ds.replaceChildren(...lf(f.solo).map((Z, fe) => {
      const Re = $("li", "", fe < ot.at ? "done" : fe === ot.at ? ot.blocked ? "now blocked" : "now" : "");
      return Re.append($("span", fe < ot.at ? "✓" : String(fe + 1), "n"), Z), fe === ot.at && Re.setAttribute("aria-current", "step"), Re;
    })), bs.textContent = ot.caption, bs.className = "ppp-stage " + (ot.at >= lf(f.solo).length ? "ppp-ok" : ot.blocked ? "ppp-bad" : "ppp-cyan"));
    const Ai = o(".ppp-facts"), Fn = [];
    f.main && ((Rh = f.gate) != null && Rh.here) && !f.solo && Fn.push(...Mn("Your wallet", ve(f.main), "ppp-addr-short"));
    const Mh = () => {
      if (!f.listening) return;
      const Z = fr("copy-listening", "Copy", () => f.listening || "", "tiny", () => g(c.snapshot()));
      Fn.push(...Mn(f.slot > 0 ? "Album wallet" : f.linked ? "My player (technical)" : "My player wallet", te(f.listening), "ppp-addr-short", Z));
    };
    if (f.linked || Mh(), f.listening && f.step !== "intro")
      if (f.linked)
        Fn.push(...Mn("Credited to", `${ve(f.linked)} · plays, likes and returns`, f.linked === f.main || f.solo ? "ppp-ok" : "ppp-warn")), Mh();
      else if (f.solo) {
        f.creditedTo && Fn.push(...Mn("Credited to", `${ve(f.creditedTo)} · plays and likes`, "ppp-ok"));
        const Z = f.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : f.returnTo ? `${ve(f.returnTo)} · ${f.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : f.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Fn.push(...Mn("Returns go to", f.gift ? Z : f.returnTo && !yt(f.returnTo) ? Z.replace(te(f.returnTo), f.returnTo) : Z, f.returnTo && !f.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Fn.push(...Mn("Linked to", "not linked yet", "ppp-warn"));
    if (f.linkedListening.length && ((zh = f.gate) != null && zh.here)) {
      const Z = f.linkedListening.map((fe) => te(fe) + (fe === f.listening ? " (this one)" : "")).join(", ");
      Fn.push(...Mn(f.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", Z, "ppp-addr-short"));
    }
    if (f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step)) {
      const Z = f.step === "fund" && f.depositPending ? "ppp-mute" : f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Fn.push(...Mn("Balance", `${Mr(f.balance)} STX · about ${f.playsLeft.toLocaleString()} plays`, Z));
    }
    const ya = f.entries.find((Z) => Z.kind === "play");
    ya && Xn(), ya && Fn.push(...Mn("Last paid song", `${mn(ya)} → ${ve(ya.recipient)}`, Ns[ya.status] || "")), Ai.replaceChildren(...Fn), Ai.hidden = !Fn.length;
    const De = [], It = [], Pt = [], or = [], _h = On(BigInt(((Gh = f.gate) == null ? void 0 : Gh.limits.playFee) ?? "300")), Ph = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${Mr(Il)} STX to the song holder, plus a ${Mr(_h - Il)} STX network fee.`, Uh = !!f.busy;
    switch (f.step) {
      case "elsewhere": {
        if (De.push($("p", "Pay artists as you listen.")), (Kh = f.gate) != null && Kh.radioUrl) {
          const fe = $("p");
          fe.append(ze("Open the pay-per-play radio →", f.gate.radioUrl)), De.push(fe);
        }
        It.push($("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (f.linked) {
          const fe = [f.linked, ...f.others];
          De.push($("p", fe.length > 1 ? `This device has listening wallets for ${Jt(fe)}.` : `This device has a listening wallet for ${ve(f.linked)}.`)), It.push($("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), fe.slice(0, 3).forEach((Re, wt) => Pt.push(pe(`Open ${ve(Re)}`, () => Io(Re), wt === 0 ? "primary" : "")));
        } else
          De.push($("p", "Connect your wallet to pay artists as you listen.")), It.push($("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        De.push($("p", `This device's listening wallet belongs to ${ve(f.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), It.push($("p", `You are connected as ${ve(f.main)}. Switch to the linked wallet to continue listening.`)), It.push($("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), Pt.push(pe("Switch wallet", Vr, "primary"));
        break;
      case "not-invited":
        De.push($("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        De.push($("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        De.push($("p", "Every play counts for the song’s owner, on-chain.")), It.push($("p", Ph)), It.push($("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), It.push($("p", f.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !f.solo && f.main && f.others.length ? (De.push($("p", `This device already has a listening wallet for ${Jt(f.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), It.push($("p", `Otherwise, set up a new listening wallet for ${ve(f.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !f.solo && f.main && It.push($("p", `This is the listening wallet for ${ve(f.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), f.solo && It.push($("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const Z = v.liveGift();
        Pt.push(pe(Z ? "Claim my gift · no wallet needed" : f.solo ? "Start listening · no wallet needed" : f.others.length && f.main ? `Set up for ${ve(f.main)}` : "Start listening", () => void c.create(m.claiming() ? { another: !0 } : void 0), "primary")), !Z && !f.solo && f.main && f.others.length && Pt.push(pe("Switch wallet", Vr)), !Z && f.solo && Pt.push(pe("I have a Stacks wallet", Vr)), Pt.push(pe("I already have a listening wallet", () => void c.unlock(!0))), Z && Pt.push(pe("Not now", () => v.setAside(), "quiet"));
        break;
      case "locked":
        f.armed || (De.push($("p", "Locked.", "ppp-mute")), Pt.push(pe("Unlock", () => void c.unlock(), "primary"))), f.standIn ? or.push(pe("Use a different listening wallet", () => void Ms().then((fe) => {
          fe === "stacks" && Vr();
        }), "quiet")) : or.push(pe("Use a different listening wallet", () => void c.unlock(!0), "quiet"));
        break;
      case "link":
        De.push($("p", `Link to ${ve(f.main)} · free`)), It.push($("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), It.push($("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), Pt.push(pe(f.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void c.link(), "primary"));
        break;
      case "loading":
        De.push($("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (f.depositPending ? f.arrival && De.push(Dn(f.arrival)) : J(f) ? De.push($("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (Vh = f.gift) != null && Vh.player ? De.push($("p", "Out of plays · add more to keep listening", "ppp-bad")) : f.entries.length ? De.push($("p", "No plays left · add plays to keep counting", "ppp-bad")) : De.push($("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / _h)).toLocaleString()} plays`)), f.entries.length && It.push($("p", "Playback is paused until your top-up confirms.")), f.payingOn && !f.entries.length && It.push($("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), p ? It.push($("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : f.depositPending ? It.push($("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : f.solo ? (It.push($("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), It.push($("p", f.listening || "", "ppp-addr-full")), f.listening && !f.depositPending && Pt.push(fr("copy-address", "Copy my address", () => f.listening || "", "primary", () => g(c.snapshot())))) : It.push($("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), f.depositPending && f.depositTxid) {
          const fe = $("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          fe.append(ze("View", ft(f.depositTxid))), De.push(fe);
        } else f.allowance > 0n && !f.solo && !f.depositPending && Pt.push($o(f, `Deposit ${Mr(f.allowance)} STX from my wallet`, () => void c.deposit(), "primary"));
        break;
      }
      case "over":
        De.push($("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), f.phrase && (De.push($("p", "Or back up your player. With its 24 words written down it can hold more, because a lost passkey is no longer lost money.", "ppp-mute")), Pt.push(pe("Back up my player · 24 words", () => void c.backup(), ""))), f.solo && !f.returnTo && (De.push($("p", f.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), De.push(rr(f))), (!f.solo || f.returnTo) && Pt.push(pe("Return excess", () => void c.returnFunds("excess"), "primary"), pe("Return all", () => void c.returnFunds("all")));
        break;
      case "ready":
        if (f.payingOn && f.session && f.session.playsLeft > 0 && ((Xh = f.giftStop) == null ? void 0 : Xh.reason) !== "off") {
          const fe = Math.min(f.session.playsLeft, f.playsLeft);
          De.push($("p", `${fe.toLocaleString()} plays left`, "ppp-ok")), It.push($("p", Ph + " The heart likes or unlikes from this wallet for 0.0003 STX.")), Pt.push(pe("Switch off", () => void c.switchOff()));
        } else
          De.push($("p", "Switch on music support to listen.", "ppp-mute")), Pt.push(pe("Switch plays on", () => void c.switchOn(), "primary"));
        f.queued && De.push($("p", f.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${f.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), f.balanceState === "low" && De.push($("p", "Running low on plays", "ppp-warn")), f.aboveTarget && De.push($("p", "More than 1 STX here · backed up ✓ This player pays from this page as you listen, so keep larger amounts in your main wallet.", "ppp-mute")), f.depositPending ? De.push($("p", "Plays on their way…", "ppp-warn")) : f.allowance > 0n && f.balanceState !== "ok" && !f.solo && Pt.push($o(f, `Top up ${Mr(f.allowance)} STX`, () => void c.deposit()));
        break;
    }
    if (f.solo && f.listening && !f.depositPending) {
      const Z = f.step === "fund", fe = f.step === "ready" && (f.balanceState === "low" || !!f.gift && f.giftPlays <= 20);
      Z ? Pt.unshift(pe("Add plays", () => Ne(), "primary")) : fe ? Pt.push(pe("Add plays", () => Ne(), "primary")) : f.step === "ready" && or.push(pe("Add plays", () => Ne(), "quiet"));
    }
    if (f.solo && f.walletCannotSolo && It.push($("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), f.solo && ["fund", "ready"].includes(f.step) && ((f.balance ?? 0n) > 0n && f.slot === 0 && It.push(rr(f)), It.push(Os()), f.slot === 0 && f.step === "ready" && f.entries.some((Z) => Z.kind === "play" && Z.status === "confirmed"))) {
      const Z = $("p", "New to Stacks? ", "ppp-mute");
      Z.append(ze("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), De.push(Z);
    }
    if (f.walletOutdated && It.push($("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), f.stuck && (De.push($("p", f.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${f.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), Pt.push(pe("Clear stuck payments", () => void c.clearStuck()))), ["ready", "fund"].includes(f.step) && (f.returnTo || f.gift) && (f.balance ?? 0n) > 0n && or.push(pe(f.linked ? "Return all to my wallet" : f.gift ? "Return what is left…" : `Return all to ${ve(f.returnTo)}`, () => void c.returnFunds("all"), "quiet")), f.slot > 0 && ((Yh = f.gift) != null && Yh.player) && ["ready", "fund"].includes(f.step) && f.giftPlays > 20 && or.push(Hs(f, "quiet")), f.phrase && ["ready", "fund", "over"].includes(f.step) && or.push(pe(f.backedUp ? "Show my 24 backup words again" : "Back up my player · 24 words", () => void c.backup(), "quiet")), ["ready", "fund", "link", "over"].includes(f.step) && or.push(pe("Lock", () => void c.lock(), "quiet")), Tt && !Oe && or.push(pe(Ft ? "Hide listening wallet box" : "Show listening wallet box", () => {
      Ft = !Ft, g(c.snapshot());
    }, "quiet")), [...Pt, ...or].forEach((Z) => Z.disabled = Uh), Uh && (Pt.length = 0), !qn && f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step) && !(f.step === "fund" && f.depositPending && f.balance === 0n) && !((qh = f.gift) != null && qh.player)) {
      const Z = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad", fe = De.at(0);
      f.step === "ready" && fe ? fe.append($("span", ` · ${Ae(f.balance)} STX`, Z)) : De.push($("p", `Balance ${Ae(f.balance)} STX`, Z));
    }
    if (qn) {
      for (const Re of [...Pt, ...or]) {
        const wt = tC[Re.textContent ?? ""];
        wt && (Re.textContent = wt);
      }
      for (let Re = De.length - 1; Re >= 0; Re--) Jg(De[Re].textContent) && It.unshift(...De.splice(Re, 1));
      for (let Re = Pt.length - 1; Re >= 0; Re--) Jg(Pt[Re].textContent) && or.unshift(...Pt.splice(Re, 1));
      const Z = f.entries.some((Re) => Re.kind === "play"), fe = sC(f.step, { played: Z, arriving: f.depositPending });
      fe.length && De.length && fe.shift(), De.push(...fe.map((Re) => $("p", Re, "ppp-mute")));
    }
    if ((Wh = f.gift) != null && Wh.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(f.step)) {
      const Z = $("p", "", "ppp-gift");
      Z.append(`💿 Album · ${f.gift.player.title}`), f.gift.player.subtitle && Z.append(" · ", f.gift.player.subtitle);
      const fe = ["ready", "fund", "over"].includes(f.step) && f.balance !== void 0 ? f.giftPlays === 0 && f.depositPending ? $("span", " · plays on their way", "ppp-warn") : $("span", f.giftPlays === 0 ? " · no plays left" : ` · ${f.giftPlays.toLocaleString()} ${f.giftPlays === 1 ? "play" : "plays"} left`, f.giftPlays === 0 ? "ppp-bad" : f.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      fe && Z.append(fe);
      const Re = (Zh = De.at(0)) == null ? void 0 : Zh.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (f.step === "ready" && Re && /STX/.test(Re.textContent ?? "") && Re.remove(), De.unshift(Z), f.giftPlays <= 20 && ["ready", "fund"].includes(f.step) && !f.depositPending)
        if (f.slot > 0)
          De.splice(1, 0, $("p", f.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), Hs(f, "primary"));
        else {
          const wt = $("p", f.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          wt.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), wt.append(ze("Xverse", "https://www.xverse.app/download"), " and ", ze("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), De.splice(1, 0, wt);
        }
    }
    if (f.gift && !f.linked && ["fund", "ready", "over"].includes(f.step) && f.returnPlan.state === "ready") {
      const Z = f.returnPlan, fe = $("div", "", "ppp-pick");
      fe.append($("p", Z.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const Re = $("ul", "", "ppp-gift-list");
      Z.steps.forEach((wt, Cr) => {
        const ir = wt.kind === "gift" ? "the unused gift" : wt.kind === "deposit" ? "what was added to it" : "the rest", In = $("li");
        In.append($("span", `${Cr + 1}. ${Mr(BigInt(wt.send))} STX · ${ir}`, "t"), $("span", wt.to ? ` → ${ve(wt.to)}` : " → choose an address below", wt.to ? "ppp-mute" : "ppp-warn")), Re.append(In);
      }), fe.append(Re), Z.kept && fe.append($("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), Z.steps.some((wt) => !wt.to) && fe.append(rr(f)), fe.append(pe(Z.steps.length > 1 ? `Confirm part 1 of ${Z.steps.length}` : "Confirm and return", () => void c.returnFunds("all"), "primary")), De.push(fe);
    }
    const Fs = k(f), xs = A ? Fs : null, Ei = H(f, !!xs), Vb = Ei === "gift" || Ei === "arriving" || Ei === "new", uu = xs ? null : m.lines(l), du = uu && !m.claiming() ? uu : [...uu ?? [], ...v.banner(l, { bare: !!xs || Ei === "gift" || Ei === "arriving" })], ic = er && (v.pendingCode() || ["intro", "locked", "unsupported"].includes(f.step)) ? Kr(er, v.pendingCode()) : [];
    xs || (De.unshift(...du), De.push(...Si(f)), De.unshift(...ic)), f.solo && f.creditedTo && f.listening && !["intro", "off", "elsewhere", "loading"].includes(f.step) && De.unshift($("p", `This is ${ve(f.creditedTo)}'s listening wallet. Plays and likes count for ${ve(f.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), o(".ppp-key").replaceChildren(...De);
    const fu = document.querySelector(".ppp-switch");
    if (fu) {
      const Z = x.latest(), fe = f.slot > 0, Re = ["fund", "ready", "over"].includes(f.step) && (fe || !!Z);
      if (fu.hidden = !Re, Re) {
        const wt = (In, lc, uc, mu) => {
          const $i = pe("", mu, "ppp-tab");
          return $i.setAttribute("aria-pressed", String(uc)), $i.append($("span", In, "tt"), $("span", lc === void 0 ? "…" : `${Ce(lc).toLocaleString()} plays`, "ts")), $i.disabled = !!f.busy, $i;
        }, Cr = fe ? ((Qh = (Jh = f.gift) == null ? void 0 : Jh.player) == null ? void 0 : Qh.title) ?? "Album" : Z.title, ir = pe("View all albums" + (x.count() > 1 ? ` (${x.count()})` : ""), () => {
          const In = document.querySelector(".ppp-shelf");
          In && (In.hidden = !1, In.open = !In.open, ir.setAttribute("aria-expanded", String(In.open)), In.open && requestAnimationFrame(() => In.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        ir.setAttribute("aria-expanded", String(!!((ep = document.querySelector(".ppp-shelf")) != null && ep.open))), fu.replaceChildren(
          wt("🎧 My player", fe ? (tp = f.likeFunds) == null ? void 0 : tp.balance : f.balance, !fe, () => {
            fe && c.openAlbum(0);
          }),
          wt("💿 " + Cr, fe ? f.balance : void 0, fe, () => {
            !fe && Z && c.openAlbum(Z.slot);
          }),
          ir
        );
      }
    }
    const ac = x.render(f), cc = document.querySelector(".ppp-shelf");
    if (cc) {
      cc.hidden = !ac;
      const Z = cc.querySelector("summary");
      Z && (Z.textContent = x.count() > 0 ? `♪ My albums (${x.count()})` : "♪ My albums");
      const fe = cc.querySelector(".ppp-shelf-body");
      ac && fe && !fe.contains(ac) && fe.replaceChildren(ac);
    }
    const wa = v.renderFold(l);
    if (o(".ppp-gifts").hidden = !wa, wa && !o(".ppp-gift-body").contains(wa) && o(".ppp-gift-body").replaceChildren(wa), wa && Xt) {
      Xt = !1;
      const Z = o(".ppp-gifts");
      Z.open = !0, requestAnimationFrame(() => Z.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    const hu = document.querySelector("#ppp .ppp-featured");
    if (hu) {
      const Z = oe(), fe = Q.manage(), Re = (Z.length > 0 || !!fe) && f.slot === 0 && !((np = f.gift) != null && np.player) && f.step === "ready";
      hu.hidden = !Re, Re && hu.replaceChildren(...Z.length ? [$("p", "Albums in your player", "ppp-featured__h")] : [], ...Z.map((wt) => {
        const Cr = (un == null ? void 0 : un.id) === wt.id, ir = pe("", () => mr(Cr ? null : wt, !Cr), "ppp-featured__a" + (Cr ? " is-on" : "")), In = Dr(wt).length;
        return ir.append($("b", wt.title), $("span", Cr ? "Playing now · tap to go back to the radio" : `${wt.subtitle ? wt.subtitle + " · " : ""}${In} ${In === 1 ? "song" : "songs"}`)), ir.setAttribute("aria-pressed", String(Cr)), ir.disabled = !!f.busy, ir;
      }), ...fe ? [fe] : []);
    }
    const pu = document.querySelector("#ppp .ppp-release-in-slot");
    if (pu) {
      const Z = ["off", "elsewhere", "unsupported"].includes(f.step) ? [] : Q.banner();
      pu.hidden = !Z.length, pu.replaceChildren(...Z);
    }
    const ki = document.querySelector("#ppp .ppp-release");
    if (ki) {
      const Z = ["off", "elsewhere", "unsupported"].includes(f.step) ? null : Q.fold();
      if (ki.hidden = !Z, Z) {
        const fe = document.activeElement instanceof HTMLElement && ki.contains(document.activeElement) ? document.activeElement : null, Re = ((rp = ki.querySelector(".ppp-release-songs")) == null ? void 0 : rp.scrollTop) ?? 0;
        (sp = ki.querySelector(".ppp-release-body")) == null || sp.replaceChildren(...Z);
        const wt = ki.querySelector(".ppp-release-songs");
        wt && Re && (wt.scrollTop = Re), fe && fe.isConnected && document.activeElement !== fe && fe.focus({ preventScroll: !0 });
      }
    }
    q(f);
    const gu = document.querySelector("#ppp .ppp-yours");
    if (gu) {
      const Z = f.solo && !!f.listening && f.slot === 0 && ["fund", "ready"].includes(f.step);
      gu.hidden = !Z;
      const fe = gu.querySelector(".ppp-yours-body");
      if (Z && fe && fe.getAttribute("data-for") !== f.listening) {
        fe.setAttribute("data-for", f.listening);
        const Re = (mu, ...$i) => {
          const op = $("details", "", "ppp-yours-item");
          return op.append($("summary", mu), ...$i), op;
        }, wt = $("p", "Your player is a real account on Stacks, the network built on Bitcoin that Xtrata runs on. Right now it is known by a long code. A ");
        wt.append($("b", ".btc name"), " (for example yourname.btc) is a name you own on that network. Give your player one and your plays, likes and station show under that name everywhere on Xtrata.");
        const Cr = $("p", "Names are registered at BNS One. You need a little STX and a Stacks wallet to buy one; then send the name to your player using the code below.", "ppp-mute"), ir = $("p");
        ir.append(ze("Find a name at BNS One →", "https://bns.one"));
        const In = $("p", "Already have a Stacks wallet with a name (Xverse or Leather)? Connect it (top right) and link this player to it. The player stays on this device and keeps its plays; everything it does is then credited to your name, like a second device on one account."), lc = $("p", "Know someone who loves music? When there is a giveaway on, send them the page and they can claim a free player of their own."), uc = $("p");
        uc.append(ze("See the giveaway →", "https://xtrata.xyz/giveaway")), fe.replaceChildren(
          Re("Give your player a name", wt, Cr, $("p", f.listening, "ppp-addr-full"), fr("copy-yours-address", "Copy my player’s code", () => c.snapshot().listening || "", "tiny", () => g(c.snapshot())), ir),
          Re("Link it to a wallet you already have", In),
          Re("Bring a friend in", lc, uc)
        );
      }
    }
    o(".ppp-body").replaceChildren(...It), o(".ppp-actions").replaceChildren(...Pt), o(".ppp-actions2").replaceChildren(...or);
    const yu = f.busy || f.message || "", Oh = o(".ppp-msg"), wu = yu && De.some((Z) => (Z.textContent ?? "").startsWith(yu.replace(/[.✓\s]+$/, ""))) ? "" : yu, Hh = !wu && !f.error ? f.notice : j && !wu ? f.error : "";
    Oh.textContent = wu || Hh, Oh.classList.toggle("is-warn", !!Hh), o(".ppp-err").textContent = j ? "" : f.error;
    const Xb = f.entries.filter((Z) => Z.kind === "play");
    o(".ppp-recent").hidden = !f.entries.length, o(".ppp-recent-list").replaceChildren(...Xb.slice(0, 5).map((Z) => {
      const fe = $("li"), Re = Z.status === "confirmed" ? "ok" : Z.status === "failed" ? "bad" : "warn";
      return fe.append($("span", "", "d " + Re), $("span", mn(Z), "t"), $("span", Fe(Z.created), "ppp-mute")), Z.txid && fe.append(ze("tx", ft(Z.txid))), fe;
    })), o(".ppp-wallets").hidden = !(Ai.childElementCount || or.length), o(".ppp-more").hidden = !It.length;
    const Dh = o(".ppp-history");
    Dh.hidden = !f.entries.length, f.entries.length && Xn(), Dh.replaceChildren($("summary", `All activity (${f.entries.length})`), ...f.entries.slice(0, 20).map((Z) => {
      const fe = $("div", "", "ppp-row"), Re = Z.kind === "play" ? [$("span", mn(Z), "ppp-song"), $("span", ` · ${Mr(BigInt(Z.amount))} STX to ${ve(Z.recipient)}`, "ppp-mute")] : Z.kind === "like" ? [$("span", `${Z.liked ? "♥ Liked" : "Unliked"} ${mn(Z)}`, "ppp-song"), $("span", ` · for ${f.linked ? ve(f.linked) : "this listening wallet"}`, "ppp-mute")] : [$("span", `Returned ${Mr(BigInt(Z.amount))} STX`, "ppp-song"), $("span", ` to ${ve(Z.recipient)}`, "ppp-mute")];
      return fe.append(
        $("span", ko[Z.status] || Z.status, "ppp-status " + (Ns[Z.status] || "")),
        ...Re,
        $("span", ` · ${new Date(Z.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), Z.txid && fe.append(ze("tx ↗", ft(Z.txid))), fe;
    })), X == null || X.render(xs ? xe(f, xs, [...ic, ...du]) : null), se(f, !!xs, Vb ? [...ic, ...du] : ic, Ei), Te(f, !!xs || !!(_t != null && _t.showing())), ke(f, xs), dt.isOpen() && dt.refresh(), me();
    const Fh = (Fs == null ? void 0 : Fs.mode) === "open" ? null : zr(f);
    St == null || St.render((Fs == null ? void 0 : Fs.mode) === "open" ? xe(f, Fs, []) : Fh ? { ...xe(f, { mode: "open", player: Fh }, []), plays: f.balance === void 0 ? null : f.playsLeft } : null);
  }
  function k(l) {
    var f;
    if (["off", "elsewhere", "not-invited"].includes(l.step)) return null;
    if (l.slot > 0 && ((f = l.gift) != null && f.player) && ["fund", "ready", "over", "link", "loading"].includes(l.step))
      return l.root && Ye({ root: l.root, slot: l.slot, player: l.gift.player }), { mode: "open", player: l.gift.player };
    const p = v.incomingAlbum();
    if (p) return { mode: "arrive", player: p.player, from: p.from, offered: p.plays };
    const y = Ie();
    return y && (l.step === "locked" || Ve && l.step === "loading") ? { mode: "locked", player: y.player } : null;
  }
  const V = (l, p, y, f, j) => `/awards/${l.id}#${new URLSearchParams({ n: String(p), a: y, ...j ? { b: j } : {}, p: String(f), s: ty(bg, p, y) })}`;
  function ne(l) {
    const p = l.award;
    return !p || !["ready", "fund", "over", "link"].includes(l.step) ? null : p.claimTx ? M ? "making" : null : p.state === "claimed" ? M && p.inscription !== void 0 ? "yours" : null : p.state !== "ready" || P || l.step === "link" && I !== "have" ? null : I === "making" || I === "yours" ? "ready" : I;
  }
  function Te(l, p) {
    if (!Y) return;
    const y = l.award, f = y != null && y.cls && jc(y.cls) ? jo(y.cls) : null, j = l.slot === 0 ? l.listening : l.root, ie = p || !y || !f || !j || y.number === void 0 ? null : ne(l);
    if (!ie || !y || !f || !j) {
      Y.render(null, p);
      return;
    }
    ie === "have" && l.linked && !W && (W = !0, c.awardRefresh());
    const Se = typeof y.name == "string" && y.name ? y.name : null, Ee = [];
    l.error && Ee.push($("p", l.error, "ppp-warn"));
    const Oe = (Tt) => {
      I = Tt, Tt === "name" && (M = !0), g(c.snapshot());
    };
    Y.render({
      screen: ie,
      tier: f,
      number: y.number,
      need: y.need ?? 0,
      player: j,
      name: y.name,
      inscription: y.inscription,
      art: ie === "yours" && y.inscription !== void 0 ? `/i/${y.inscription}` : V(f, y.number, j, y.need ?? 0, Se),
      claimLink: y.claimTx ? ft(y.claimTx) : void 0,
      status: Ee,
      asking: !!l.busy || l.armed,
      busy: !!l.busy,
      main: l.main ? ve(l.main) : null,
      canLink: l.step === "link",
      linked: !!l.linked,
      copyAddress: () => fr("award-player-address", "Copy my player’s address", () => j, "tiny", () => g(c.snapshot())),
      go: Oe,
      claim: (Tt) => {
        M = !0, c.claimAward(Tt);
      },
      refresh: () => void c.awardRefresh(),
      connect: () => {
        var Tt;
        return (Tt = document.getElementById("radio-wallet-connect")) == null ? void 0 : Tt.click();
      },
      link: () => void c.link(),
      later: () => {
        P = !0;
        try {
          localStorage.setItem(b, String(Date.now()));
        } catch {
        }
        g(c.snapshot());
      },
      done: () => {
        M = !1, I = "ready", g(c.snapshot());
      }
    }, p);
  }
  function q(l) {
    var ot;
    const p = document.querySelector("#ppp .ppp-award");
    if (!p) return;
    const y = l.award, f = l.slot === 0 ? l.listening : l.root, j = y != null && y.cls && jc(y.cls) ? jo(y.cls) : null, ie = !!y && !!j && !!f && ["ready", "fund", "over"].includes(l.step) && !(y.state === "unavailable" && y.number === void 0);
    if (p.hidden = !ie, !ie || !y || !j || !f) {
      p.replaceChildren();
      return;
    }
    const Se = JSON.stringify([y, f, !!l.busy]);
    if (p.getAttribute("data-sig") === Se) return;
    p.setAttribute("data-sig", Se);
    const Ee = (qe) => {
      const je = $("p", "", "ppp-award__h");
      return je.append($("b", `${j.mark} Music Hero award`), $("span", qe)), je;
    }, Oe = `No. ${String(y.number ?? 0).padStart(4, "0")}`, Tt = (qe) => {
      const je = $("div", "", "ppp-award__art"), Bt = document.createElement("iframe");
      return Bt.src = qe, Bt.title = `${j.name} record`, Bt.setAttribute("sandbox", "allow-scripts"), Bt.setAttribute("loading", "lazy"), je.append(Bt), je;
    }, ht = [];
    if (y.state === "claimed") {
      if (ht.push(Ee(`${j.name} record · ${Oe}`)), y.inscription !== void 0 && ht.push(Tt(`/i/${y.inscription}`)), ht.push($("p", y.holds === !1 ? "You sent this record to another wallet, so your player has gone back to plain. Whoever holds it keeps a record that still names you." : y.holds === null || y.holds === void 0 ? `Yours: Xtrata inscription #${y.inscription}.` : `Yours for good: Xtrata inscription #${y.inscription}. It gives your player its ${j.name} colours.`, y.holds === !1 ? "ppp-mute" : "ppp-ok")), y.inscription !== void 0) {
        const qe = $("p");
        qe.append(ze("Open it full screen ↗", `/i/${y.inscription}`)), ht.push(qe);
      }
      if (y.sendTx) {
        const qe = $("p", "Your record is on its way to its new address. About a minute. ", "ppp-cyan");
        qe.append(ze("View", ft(y.sendTx))), ht.push(qe);
      } else if (y.holds === !0 && y.inscription !== void 0) {
        const qe = $("details", "", "ppp-award__send"), je = document.createElement("input");
        je.type = "text", je.placeholder = "SP… address to send it to", je.autocomplete = "off", je.spellcheck = !1, je.setAttribute("aria-label", "Address to send your record to");
        const Bt = pe("Send my record…", () => void c.sendAward(je.value), "");
        Bt.disabled = !!l.busy, qe.append(
          $("summary", "Send this record to someone"),
          $("p", "It is yours to give or sell. Whoever holds it keeps a record that still names you, and your player goes back to plain without it. This cannot be undone.", "ppp-mute"),
          je,
          Bt
        ), ht.push(qe);
      }
    } else if (y.claimTx) {
      ht.push(Ee(`${j.name} record · ${Oe}`));
      const qe = $("p", "Your record is being made: written to Xtrata with your plaque on it. About a minute. ", "ppp-cyan");
      qe.append(ze("View", ft(y.claimTx))), ht.push(qe);
    } else if (y.state === "ready") {
      ht.push(Ee(`${j.name} record · ${Oe}`));
      const qe = typeof y.name == "string" && y.name ? y.name : null, je = new URLSearchParams({ n: String(y.number), a: f, ...qe ? { b: qe } : {}, p: String(y.need), s: ty(bg, y.number, f) });
      ht.push(Tt(`/awards/${j.id}#${je}`)), ht.push($("p", `Your ${j.name} record is ready. You have paid artists for ${(ot = y.need) == null ? void 0 : ot.toLocaleString()} plays: that makes you an Xtrata Music Hero.`));
      const Bt = $("div", "", "ppp-award__row");
      qe ? (ht.push($("p", `Its plaque will carry ${qe} beside your player’s address. What is on it cannot be changed afterwards.`, "ppp-mute")), Bt.append(pe("Claim my record", () => {
        M = !0, c.claimAward("auto");
      }, "primary"), pe("Use my address only", () => {
        M = !0, c.claimAward("none");
      }, "quiet"))) : y.name === null ? (ht.push($("p", "Its plaque will carry your player’s address. Want a .btc name on it? Link a wallet that has one (see “Make it yours” below), then check again. What is on it cannot be changed afterwards.", "ppp-mute")), Bt.append(pe("Claim my record", () => {
        M = !0, c.claimAward("none");
      }, "primary"), pe("Check for a name again", () => void c.awardRefresh(), "quiet"))) : (ht.push($("p", "Could not check for a .btc name just now. Check again, or claim with your player’s address alone.", "ppp-warn")), Bt.append(pe("Check for a name again", () => void c.awardRefresh(), "primary"), pe("Claim with my address only", () => void c.claimAward("none"), "quiet"))), Bt.querySelectorAll("button").forEach((qn) => {
        qn.disabled = !!l.busy;
      }), ht.push(Bt, $("p", "Free to claim: your player pays only a tiny network fee.", "ppp-mute"));
    } else if (y.state === "earning" && y.have !== void 0 && y.need) {
      ht.push(Ee(`${y.have.toLocaleString()} of ${y.need.toLocaleString()} paid plays`));
      const qe = $("div", "", "ppp-award__bar"), je = document.createElement("i");
      je.style.width = `${Math.min(100, Math.round(y.have / y.need * 100))}%`, qe.append(je);
      const Bt = y.need - y.have;
      ht.push(qe, $("p", `${Bt.toLocaleString()} more ${Bt === 1 ? "play" : "plays"} and your ${j.name} record is yours to claim.`, "ppp-mute"));
    } else
      ht.push(Ee(`${j.name} record · ${Oe}`)), ht.push($("p", y.state === "paused" ? "Claiming is paused for a moment. Your record is safe: try again later." : y.state === "class-full" || y.state === "not-open" ? "Claiming is not open for this record right now." : "Can’t check your award right now. Your plays still count: this updates by itself.", "ppp-mute"));
    p.replaceChildren(...ht);
  }
  function ke(l, p) {
    var Ee;
    const y = document.querySelector(".ppp-skin");
    if (!y) return;
    if (!p && (Y != null && Y.showing()) && ((Ee = l.award) != null && Ee.cls) && jc(l.award.cls) && (l.busy || l.armed)) {
      const Oe = jo(l.award.cls), Tt = $("span", "", "ppp-skin__t");
      Tt.append($("b", `${Oe.name} record · No. ${String(l.award.number ?? 0).padStart(4, "0")}`), $("span", "Xtrata Music Hero")), y.hidden = !1, y.replaceChildren($("span", Oe.mark, "ppp-skin__art ppp-skin__art--none"), Tt);
      return;
    }
    const f = !!p && (!!l.busy || l.armed);
    if (y.hidden = !f, !f || !p) {
      y.replaceChildren();
      return;
    }
    const j = tl(p.player.cover), ie = j ? $("img", "", "ppp-skin__art") : $("span", "♪", "ppp-skin__art ppp-skin__art--none");
    j && (ie.src = j, ie.alt = "");
    const Se = $("span", "", "ppp-skin__t");
    Se.append($("b", p.player.title), $("span", p.mode === "arrive" && p.from ? `A gift from ${p.from}` : p.player.subtitle || "Your album")), y.replaceChildren(ie, Se);
  }
  function xe(l, p, y) {
    var Oe, Tt, ht, ot, qe;
    const f = !!l.busy || l.armed, j = [...y];
    l.depositPending && l.arrival && j.push(Dn(l.arrival)), l.error ? j.push($("p", l.error, l.error === Tl ? "ppp-warn" : "ppp-bad")) : l.message && !f ? j.push($("p", l.message, "ppp-cyan")) : l.notice && j.push($("p", l.notice, "ppp-warn")), p.mode === "open" && O && ((Oe = l.likeFunds) != null && Oe.album) && l.likeFunds.low && !l.likeFunds.pending && j.push($("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    let ie = "Kept on this device with Face ID or your passkey. No app or account needed.", Se = null, Ee = null;
    if (p.mode === "locked")
      Se = { label: "Continue listening", run: () => {
        Ve = Ie(), c.unlock();
      } }, Ee = { label: "Use a different passkey", run: () => {
        Ve = null, c.unlock(!0);
      } };
    else if (p.mode === "arrive")
      if (l.step === "intro" && Kc(bt) && bt.album === p.player.id) {
        const je = window.XtrataRadio, Bt = Dr(p.player)[0], qn = bt.phase === "playing";
        Se = { label: qn && !!((ht = (Tt = je == null ? void 0 : je.getState) == null ? void 0 : Tt.call(je)) != null && ht.playing) ? "Pause" : qn ? "Carry on" : "Play the first song", run: () => {
          var Ds, bs;
          qn ? (Ds = je == null ? void 0 : je.playPause) == null || Ds.call(je) : Bt && ((bs = je == null ? void 0 : je.playToken) == null || bs.call(je, Bt.id));
        } }, Ee = { label: "Make my player and hear it all", run: () => void c.create() }, ie = "The first song is free. Nothing to set up yet.";
      } else if (l.step === "intro") {
        const je = bt.phase === "done" && bt.album === p.player.id;
        je && !j.length && j.push($("p", "That was the first song. Make your player to hear the rest: one tap with Face ID or your fingerprint.", "ppp-cyan")), Se = { label: je ? "Keep listening" : "Open album", run: () => void c.create() }, Ee = { label: "I've used Xtrata Music here before", run: () => void c.unlock(!0) };
      } else l.step === "locked" ? (Se = { label: "Open album", run: () => void c.unlock() }, Ee = { label: "Use a different passkey", run: () => void c.unlock(!0) }) : l.step === "unsupported" ? j.push($("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : j.length || j.push($("p", "Opening your album…", "ppp-cyan"));
    return {
      mode: p.mode,
      player: p.player,
      from: p.from,
      offered: p.offered,
      // A newcomer opening a gifted album: where they are, as three lights. Not for someone who already has a player.
      step: p.mode === "arrive" && l.step === "intro" ? 1 : void 0,
      plays: p.mode === "open" ? l.balance === void 0 ? null : l.giftPlays : void 0,
      playsComing: l.depositPending,
      status: j,
      primary: Se,
      secondary: Ee,
      hint: Se ? ie : void 0,
      asking: f,
      busy: !!l.busy,
      myPlays: Yr(l),
      topUps: el,
      canMake: !!((qe = (ot = l.gate) == null ? void 0 : ot.gifts) != null && qe.admin)
    };
  }
  const $e = document.getElementById("findBox"), st = document.getElementById("findBody"), S = $e && st ? vC(st, {
    load: () => fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((l) => l.ok ? l.json() : Promise.reject(new Error("catalogue unavailable"))).then((l) => mC(l == null ? void 0 : l.tracks, (p, y) => ({ title: Tg(p, Eo(y.title) ? "" : y.title), artist: Lg(p, y.artist || "") }))),
    play: (l) => {
      var p, y;
      (y = (p = window.XtrataRadio) == null ? void 0 : p.playToken) == null || y.call(p, l);
    },
    current: () => {
      var p, y, f, j;
      const l = Number((j = (f = (y = (p = window.XtrataRadio) == null ? void 0 : p.getState) == null ? void 0 : y.call(p)) == null ? void 0 : f.nowPlaying) == null ? void 0 : j.tokenId);
      return Number.isSafeInteger(l) ? l : null;
    },
    locked: () => {
      var l;
      return !!((l = c.snapshot().albumLock) != null && l.locked);
    },
    explicit: (l) => {
      var p, y;
      return !!((y = (p = window.XtrataRadio) == null ? void 0 : p.isExplicit) != null && y.call(p, l));
    },
    liked: (l) => G().has(l),
    grid: document.documentElement.hasAttribute("data-skin")
    // the new look lists artist names three across
  }) : null;
  $e == null || $e.addEventListener("toggle", () => {
    $e.open && (S == null || S.load());
  });
  let _ = "";
  const G = () => {
    var p, y, f;
    const l = (f = (y = (p = window.XtrataRadio) == null ? void 0 : p.getState) == null ? void 0 : y.call(p)) == null ? void 0 : f.likes;
    return new Set(Array.isArray(l) ? l.map((j) => Number(j == null ? void 0 : j.tokenId)).filter(Number.isSafeInteger) : []);
  }, me = () => {
    var p, y, f, j, ie;
    if (!S || !($e != null && $e.open)) return;
    const l = `${!!((p = c.snapshot().albumLock) != null && p.locked)}|${((ie = (j = (f = (y = window.XtrataRadio) == null ? void 0 : y.getState) == null ? void 0 : f.call(y)) == null ? void 0 : j.nowPlaying) == null ? void 0 : ie.tokenId) ?? ""}|${[...G()].sort((Se, Ee) => Se - Ee).join(",")}`;
    l !== _ && (_ = l, S.refresh());
  }, Rt = /* @__PURE__ */ new Map();
  let kn = !1;
  const br = () => {
    const l = window.XtrataRadio;
    return l != null && l.subscribe ? (l.subscribe((p) => {
      const y = p == null ? void 0 : p.nowPlaying;
      if (y && Number.isSafeInteger(Number(y.tokenId)) && Rt.set(Number(y.tokenId), { title: y.title || void 0, artist: y.artist || void 0 }), me(), de) {
        const f = `${(y == null ? void 0 : y.tokenId) ?? ""}|${!!(p != null && p.playing)}`;
        f !== Me && (Me = f, g(c.snapshot()));
      }
      if (Kc(bt)) {
        const f = !!(p != null && p.playing);
        wn({ kind: "now", track: y && y.tokenId != null ? String(y.tokenId) : null, playing: f, at: Date.now() }), f !== kn && (kn = f, g(c.snapshot()));
      }
    }), !0) : !1;
  };
  if (!br()) {
    const l = setInterval(() => {
      br() && clearInterval(l);
    }, 500);
    setTimeout(() => clearInterval(l), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (l) => {
    const p = l.detail;
    if (Kc(bt) && wn({ kind: "listened", at: Date.now() }), p && Number.isSafeInteger(p.song) && typeof p.id == "string" && /^[0-9a-f]{32}$/.test(p.id)) {
      Xn();
      const y = Nn(p.song, Rt.get(p.song));
      c.onListened({ song: p.song, id: p.id, title: y.title || void 0, artist: y.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void c.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || c.refresh();
  }), setInterval(() => {
    !document.hidden && (t || c.snapshot().step !== "off") && c.refresh();
  }, 15e3), c.refresh();
}
const MC = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", _C = () => {
  const e = !!window.chrome, t = window.navigator, n = t.vendor, r = typeof window.opr < "u", o = t.userAgent.includes("Edge"), s = /CriOS/.exec(t.userAgent), i = t.userAgent.includes("Mobile");
  return s ? !1 : e !== null && typeof e < "u" && n === "Google Inc." && r === !1 && o === !1 && i === !1;
}, PC = () => _C() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, UC = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, OC = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Kb = class {
  constructor(e) {
    j4(this, e), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(e) {
    this.persistSelection && aA(e), this.callback(Yl(e));
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
  getBrowserUrl(e) {
    var t;
    return (t = e.chromeWebStoreUrl) !== null && t !== void 0 ? t : e.mozillaAddOnsUrl;
  }
  getMobileUrl(e) {
    var t;
    return (t = e.iOSAppStoreUrl) !== null && t !== void 0 ? t : e.googlePlayStoreUrl;
  }
  getInstallUrl(e, t, n) {
    var r, o, s, i, a, c, u, h, d, m;
    return n === "IOS" ? (o = (r = e.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(e)) !== null && o !== void 0 ? o : e.webUrl : t === "Chrome" ? (i = (s = e.chromeWebStoreUrl) !== null && s !== void 0 ? s : this.getMobileUrl(e)) !== null && i !== void 0 ? i : e.webUrl : t === "Firefox" ? (c = (a = e.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(e)) !== null && c !== void 0 ? c : e.webUrl : n === "Android" ? (h = (u = e.googlePlayStoreUrl) !== null && u !== void 0 ? u : this.getBrowserUrl(e)) !== null && h !== void 0 ? h : e.webUrl : (m = (d = this.getBrowserUrl(e)) !== null && d !== void 0 ? d : e.webUrl) !== null && m !== void 0 ? m : this.getMobileUrl(e);
  }
  render() {
    const e = PC(), t = UC(), n = this.defaultProviders.filter(
      (s) => this.installedProviders.findIndex((i) => i.id === s.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, o = n.length > 0;
    return We("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, We("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), We("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, We("div", { class: "flex flex-col space-y-[10px]" }, We("div", { class: "flex items-center" }, We("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), We("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, We("span", { class: "sr-only" }, "Close popup"), We("img", { src: MC }))), r ? We("p", null, "Select the wallet you want to connect to.") : We("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !t && !e && We("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && We("div", { class: "mt-6" }, We("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), We("ul", { class: "space-y-3" }, this.installedProviders.map((s) => We("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, We("div", { class: "aspect-square basis-9 overflow-hidden" }, We("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), We("div", { class: "flex-1" }, We("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && We("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), We("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(s.id) }, "Connect"))))), o && We("div", { class: "mt-6" }, r ? We("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : We("div", { class: "mb-5 flex justify-between" }, We("p", { class: "text-sm font-medium" }, "Recommended wallets"), We("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, We("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, We("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), We("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), We("p", null, "What is a wallet? ", We("span", { class: "align-text-bottom text-[9px]" }, "↗")))), We("ul", { class: "space-y-3" }, n.map((s) => We("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, We("div", { class: "aspect-square basis-9 overflow-hidden" }, We("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), We("div", { class: "flex-1" }, We("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && We("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), this.getInstallUrl(s, e, t) && We("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(s, e, t), rel: "noopener noreferrer", target: "_blank" }, s.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return v4(this);
  }
};
Kb.style = OC;
const HC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Kb
}, Symbol.toStringTag, { value: "Module" }));
