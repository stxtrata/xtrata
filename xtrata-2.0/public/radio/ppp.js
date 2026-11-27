var h1 = Object.defineProperty;
var p1 = (e, t, n) => t in e ? h1(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Ia = (e, t, n) => p1(e, typeof t != "symbol" ? t + "" : t, n);
var Xn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Sy(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function ql(e) {
  if (e.__esModule) return e;
  var t = e.default;
  if (typeof t == "function") {
    var n = function r() {
      return this instanceof r ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    n.prototype = t.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(e).forEach(function(r) {
    var s = Object.getOwnPropertyDescriptor(e, r);
    Object.defineProperty(n, r, s.get ? s : {
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
      typeof Xn < "u" && Xn || {}, r = {
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
      function s(m) {
        return m && DataView.prototype.isPrototypeOf(m);
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
        ], i = ArrayBuffer.isView || function(m) {
          return m && o.indexOf(Object.prototype.toString.call(m)) > -1;
        };
      function a(m) {
        if (typeof m != "string" && (m = String(m)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(m) || m === "")
          throw new TypeError('Invalid character in header field name: "' + m + '"');
        return m.toLowerCase();
      }
      function c(m) {
        return typeof m != "string" && (m = String(m)), m;
      }
      function u(m) {
        var L = {
          next: function() {
            var _ = m.shift();
            return { done: _ === void 0, value: _ };
          }
        };
        return r.iterable && (L[Symbol.iterator] = function() {
          return L;
        }), L;
      }
      function h(m) {
        this.map = {}, m instanceof h ? m.forEach(function(L, _) {
          this.append(_, L);
        }, this) : Array.isArray(m) ? m.forEach(function(L) {
          if (L.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + L.length);
          this.append(L[0], L[1]);
        }, this) : m && Object.getOwnPropertyNames(m).forEach(function(L) {
          this.append(L, m[L]);
        }, this);
      }
      h.prototype.append = function(m, L) {
        m = a(m), L = c(L);
        var _ = this.map[m];
        this.map[m] = _ ? _ + ", " + L : L;
      }, h.prototype.delete = function(m) {
        delete this.map[a(m)];
      }, h.prototype.get = function(m) {
        return m = a(m), this.has(m) ? this.map[m] : null;
      }, h.prototype.has = function(m) {
        return this.map.hasOwnProperty(a(m));
      }, h.prototype.set = function(m, L) {
        this.map[a(m)] = c(L);
      }, h.prototype.forEach = function(m, L) {
        for (var _ in this.map)
          this.map.hasOwnProperty(_) && m.call(L, this.map[_], _, this);
      }, h.prototype.keys = function() {
        var m = [];
        return this.forEach(function(L, _) {
          m.push(_);
        }), u(m);
      }, h.prototype.values = function() {
        var m = [];
        return this.forEach(function(L) {
          m.push(L);
        }), u(m);
      }, h.prototype.entries = function() {
        var m = [];
        return this.forEach(function(L, _) {
          m.push([_, L]);
        }), u(m);
      }, r.iterable && (h.prototype[Symbol.iterator] = h.prototype.entries);
      function d(m) {
        if (!m._noBody) {
          if (m.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          m.bodyUsed = !0;
        }
      }
      function w(m) {
        return new Promise(function(L, _) {
          m.onload = function() {
            L(m.result);
          }, m.onerror = function() {
            _(m.error);
          };
        });
      }
      function y(m) {
        var L = new FileReader(), _ = w(L);
        return L.readAsArrayBuffer(m), _;
      }
      function v(m) {
        var L = new FileReader(), _ = w(L), N = /charset=([A-Za-z0-9_-]+)/.exec(m.type), W = N ? N[1] : "utf-8";
        return L.readAsText(m, W), _;
      }
      function S(m) {
        for (var L = new Uint8Array(m), _ = new Array(L.length), N = 0; N < L.length; N++)
          _[N] = String.fromCharCode(L[N]);
        return _.join("");
      }
      function I(m) {
        if (m.slice)
          return m.slice(0);
        var L = new Uint8Array(m.byteLength);
        return L.set(new Uint8Array(m)), L.buffer;
      }
      function U() {
        return this.bodyUsed = !1, this._initBody = function(m) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = m, m ? typeof m == "string" ? this._bodyText = m : r.blob && Blob.prototype.isPrototypeOf(m) ? this._bodyBlob = m : r.formData && FormData.prototype.isPrototypeOf(m) ? this._bodyFormData = m : r.searchParams && URLSearchParams.prototype.isPrototypeOf(m) ? this._bodyText = m.toString() : r.arrayBuffer && r.blob && s(m) ? (this._bodyArrayBuffer = I(m.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(m) || i(m)) ? this._bodyArrayBuffer = I(m) : this._bodyText = m = Object.prototype.toString.call(m) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof m == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(m) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var m = d(this);
          if (m)
            return m;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var m = d(this);
            return m || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
              this._bodyArrayBuffer.buffer.slice(
                this._bodyArrayBuffer.byteOffset,
                this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
              )
            ) : Promise.resolve(this._bodyArrayBuffer));
          } else {
            if (r.blob)
              return this.blob().then(y);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var m = d(this);
          if (m)
            return m;
          if (this._bodyBlob)
            return v(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(S(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(B);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var P = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function A(m) {
        var L = m.toUpperCase();
        return P.indexOf(L) > -1 ? L : m;
      }
      function T(m, L) {
        if (!(this instanceof T))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        L = L || {};
        var _ = L.body;
        if (m instanceof T) {
          if (m.bodyUsed)
            throw new TypeError("Already read");
          this.url = m.url, this.credentials = m.credentials, L.headers || (this.headers = new h(m.headers)), this.method = m.method, this.mode = m.mode, this.signal = m.signal, !_ && m._bodyInit != null && (_ = m._bodyInit, m.bodyUsed = !0);
        } else
          this.url = String(m);
        if (this.credentials = L.credentials || this.credentials || "same-origin", (L.headers || !this.headers) && (this.headers = new h(L.headers)), this.method = A(L.method || this.method || "GET"), this.mode = L.mode || this.mode || null, this.signal = L.signal || this.signal || function() {
          if ("AbortController" in n) {
            var j = new AbortController();
            return j.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && _)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(_), (this.method === "GET" || this.method === "HEAD") && (L.cache === "no-store" || L.cache === "no-cache")) {
          var N = /([?&])_=[^&]*/;
          if (N.test(this.url))
            this.url = this.url.replace(N, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var W = /\?/;
            this.url += (W.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      T.prototype.clone = function() {
        return new T(this, { body: this._bodyInit });
      };
      function B(m) {
        var L = new FormData();
        return m.trim().split("&").forEach(function(_) {
          if (_) {
            var N = _.split("="), W = N.shift().replace(/\+/g, " "), j = N.join("=").replace(/\+/g, " ");
            L.append(decodeURIComponent(W), decodeURIComponent(j));
          }
        }), L;
      }
      function X(m) {
        var L = new h(), _ = m.replace(/\r?\n[\t ]+/g, " ");
        return _.split("\r").map(function(N) {
          return N.indexOf(`
`) === 0 ? N.substr(1, N.length) : N;
        }).forEach(function(N) {
          var W = N.split(":"), j = W.shift().trim();
          if (j) {
            var ye = W.join(":").trim();
            try {
              L.append(j, ye);
            } catch (ce) {
              console.warn("Response " + ce.message);
            }
          }
        }), L;
      }
      U.call(T.prototype);
      function Q(m, L) {
        if (!(this instanceof Q))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (L || (L = {}), this.type = "default", this.status = L.status === void 0 ? 200 : L.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = L.statusText === void 0 ? "" : "" + L.statusText, this.headers = new h(L.headers), this.url = L.url || "", this._initBody(m);
      }
      U.call(Q.prototype), Q.prototype.clone = function() {
        return new Q(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new h(this.headers),
          url: this.url
        });
      }, Q.error = function() {
        var m = new Q(null, { status: 200, statusText: "" });
        return m.ok = !1, m.status = 0, m.type = "error", m;
      };
      var oe = [301, 302, 303, 307, 308];
      Q.redirect = function(m, L) {
        if (oe.indexOf(L) === -1)
          throw new RangeError("Invalid status code");
        return new Q(null, { status: L, headers: { location: m } });
      }, t.DOMException = n.DOMException;
      try {
        new t.DOMException();
      } catch {
        t.DOMException = function(L, _) {
          this.message = L, this.name = _;
          var N = Error(L);
          this.stack = N.stack;
        }, t.DOMException.prototype = Object.create(Error.prototype), t.DOMException.prototype.constructor = t.DOMException;
      }
      function Y(m, L) {
        return new Promise(function(_, N) {
          var W = new T(m, L);
          if (W.signal && W.signal.aborted)
            return N(new t.DOMException("Aborted", "AbortError"));
          var j = new XMLHttpRequest();
          function ye() {
            j.abort();
          }
          j.onload = function() {
            var $ = {
              statusText: j.statusText,
              headers: X(j.getAllResponseHeaders() || "")
            };
            W.url.indexOf("file://") === 0 && (j.status < 200 || j.status > 599) ? $.status = 200 : $.status = j.status, $.url = "responseURL" in j ? j.responseURL : $.headers.get("X-Request-URL");
            var R = "response" in j ? j.response : j.responseText;
            setTimeout(function() {
              _(new Q(R, $));
            }, 0);
          }, j.onerror = function() {
            setTimeout(function() {
              N(new TypeError("Network request failed"));
            }, 0);
          }, j.ontimeout = function() {
            setTimeout(function() {
              N(new TypeError("Network request timed out"));
            }, 0);
          }, j.onabort = function() {
            setTimeout(function() {
              N(new t.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function ce($) {
            try {
              return $ === "" && n.location.href ? n.location.href : $;
            } catch {
              return $;
            }
          }
          if (j.open(W.method, ce(W.url), !0), W.credentials === "include" ? j.withCredentials = !0 : W.credentials === "omit" && (j.withCredentials = !1), "responseType" in j && (r.blob ? j.responseType = "blob" : r.arrayBuffer && (j.responseType = "arraybuffer")), L && typeof L.headers == "object" && !(L.headers instanceof h || n.Headers && L.headers instanceof n.Headers)) {
            var Xe = [];
            Object.getOwnPropertyNames(L.headers).forEach(function($) {
              Xe.push(a($)), j.setRequestHeader($, c(L.headers[$]));
            }), W.headers.forEach(function($, R) {
              Xe.indexOf(R) === -1 && j.setRequestHeader(R, $);
            });
          } else
            W.headers.forEach(function($, R) {
              j.setRequestHeader(R, $);
            });
          W.signal && (W.signal.addEventListener("abort", ye), j.onreadystatechange = function() {
            j.readyState === 4 && W.signal.removeEventListener("abort", ye);
          }), j.send(typeof W._bodyInit > "u" ? null : W._bodyInit);
        });
      }
      return Y.polyfill = !0, n.fetch || (n.fetch = Y, n.Headers = h, n.Request = T, n.Response = Q), t.Headers = h, t.Request = T, t.Response = Q, t.fetch = Y, Object.defineProperty(t, "__esModule", { value: !0 }), t;
    })({});
  })(typeof self < "u" ? self : Xn);
})();
const g1 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function y1(e, t) {
  const n = {};
  return Object.assign(n, g1, t), await fetch(e, n);
}
function w1(e) {
  let t = y1, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function m1(...e) {
  const { fetchLib: t, middlewares: n } = w1(e);
  return async (s, o) => {
    let i = { url: s, init: o ?? {} };
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
var Ji;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Ji || (Ji = {}));
var Ws;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Ws || (Ws = {}));
var Ep;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Ep || (Ep = {}));
const b1 = "https://api.mainnet.hiro.so", x1 = "https://api.testnet.hiro.so", S1 = "http://localhost:3999", v1 = ["mainnet", "testnet", "devnet", "mocknet"];
let Qi = class {
  constructor(t) {
    this.version = Ws.Mainnet, this.chainId = Ji.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ws.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? m1();
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
Qi.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new md();
    case "testnet":
      return new A1();
    case "devnet":
      return new E1();
    case "mocknet":
      return new vy();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${v1.join(", ")}`);
  }
};
Qi.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : Qi.fromName(e);
let md = class extends Qi {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? b1,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Ws.Mainnet, this.chainId = Ji.Mainnet;
  }
}, A1 = class extends Qi {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? x1,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Ws.Testnet, this.chainId = Ji.Testnet;
  }
}, vy = class extends Qi {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? S1,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Ws.Testnet, this.chainId = Ji.Testnet;
  }
};
const E1 = vy, Ay = "xtrata.wallet.bridge.v1", k1 = (e) => typeof e == "object" && e !== null && e.protocol === Ay, $1 = (e) => k1(e) && e.kind === "response" && typeof e.id == "string" && e.id.length > 0 && typeof e.ok == "boolean", I1 = () => {
  const e = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
};
class La extends Error {
  constructor(t, n) {
    super(n), this.code = t, this.name = "BridgeClientError";
  }
}
const kp = 12e4;
class L1 {
  constructor(t) {
    Ia(this, "pending", /* @__PURE__ */ new Map());
    Ia(this, "listenTarget");
    Ia(this, "closed", !1);
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
    Ia(this, "onMessage", (t) => {
      if (t.origin !== this.options.walletOrigin || t.source !== this.options.frame.contentWindow || !$1(t.data)) return;
      const n = this.pending.get(t.data.id);
      if (n)
        if (this.pending.delete(t.data.id), clearTimeout(n.timer), t.data.ok)
          n.resolve(t.data.result);
        else {
          const r = t.data.error;
          n.reject(
            new La("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = t, this.listenTarget = t.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(t, n) {
    if (this.closed)
      return Promise.reject(new La("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new La("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = I1(), o = { protocol: Ay, kind: "request", id: s, method: t, params: n };
    return new Promise((i, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new La(
            "TIMEOUT",
            `Wallet did not answer "${t}" within ${this.options.timeoutMs ?? kp}ms.`
          )
        );
      }, this.options.timeoutMs ?? kp);
      this.pending.set(s, { resolve: i, reject: a, timer: c }), r.postMessage(o, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, t] of this.pending)
      clearTimeout(t.timer), t.reject(new La("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const C1 = ["SP", "SM"], T1 = ["ST", "SN"], B1 = (e) => {
  const [t] = e.split(".");
  if (!t || t.length < 2)
    return null;
  const n = t.slice(0, 2).toUpperCase();
  return C1.includes(n) ? "mainnet" : T1.includes(n) ? "testnet" : null;
}, M1 = () => {
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
}, N1 = () => typeof window > "u" || !window.localStorage ? M1() : window.localStorage, Nu = "xtrata.v15.1.wallet.session", $p = "mainnet", pl = { isConnected: !1 }, _1 = (e) => e.address ? B1(e.address) ?? e.network : e.network, Ey = (e) => !e.isConnected || !e.address ? { ...pl } : _1(e) !== $p ? { ...pl } : {
  isConnected: !0,
  address: e.address,
  network: $p,
  ...typeof e.publicKey == "string" && /^[0-9a-f]{66}$/i.test(e.publicKey) ? { publicKey: e.publicKey } : {}
}, P1 = (e) => {
  if (!e)
    return { ...pl };
  try {
    const t = JSON.parse(e);
    return Ey(t);
  } catch {
    return { ...pl };
  }
}, U1 = (e) => {
  const t = Ey(e);
  return JSON.stringify(t);
}, O1 = (e) => {
  const t = N1();
  return {
    load: () => P1(t.getItem(Nu)),
    save: (n) => {
      t.setItem(Nu, U1(n));
    },
    clear: () => {
      t.removeItem(Nu);
    }
  };
}, H1 = "https://browser.blockstack.org/auth", D1 = {
  "@type": "Person",
  "@context": "http://schema.org"
}, ky = ["store_write"], F1 = "blockstack-session", j1 = {
  logLevel: "debug"
}, fi = {
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
Object.freeze(fi);
class ya extends Error {
  constructor(t) {
    super();
    let n = t.message, r = `Error Code: ${t.code}`, s = this.stack;
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

${r}`, this.message = n, this.code = t.code, this.parameter = t.parameter ? t.parameter : void 0;
  }
  toString() {
    return `${super.toString()}
    code: ${this.code} param: ${this.parameter ? this.parameter : "n/a"}`;
  }
}
class R1 extends ya {
  constructor(t, n = "") {
    super({ code: fi.MISSING_PARAMETER, message: n, parameter: t }), this.name = "MissingParametersError";
  }
}
class Ip extends ya {
  constructor(t = "") {
    super({ code: fi.INVALID_DID_ERROR, message: t }), this.name = "InvalidDIDError";
  }
}
class vc extends ya {
  constructor(t) {
    const n = `Failed to login: ${t}`;
    super({ code: fi.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Lp extends ya {
  constructor(t = "Unable to decrypt cipher object.") {
    super({ code: fi.FAILED_DECRYPTION_ERROR, message: t }), this.message = t, this.name = "FailedDecryptionError";
  }
}
class bd extends ya {
  constructor(t) {
    super({ code: fi.INVALID_STATE, message: t }), this.message = t, this.name = "InvalidStateError";
  }
}
class $y extends ya {
  constructor(t) {
    super({ code: fi.INVALID_STATE, message: t }), this.message = t, this.name = "NoSessionDataError";
  }
}
const Cp = ["debug", "info", "warn", "error", "none"], xd = {};
for (let e = 0; e < Cp.length; e++) {
  const t = Cp[e];
  xd[t] = e;
}
class zi {
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
    return xd[j1.logLevel] <= xd[t];
  }
}
function z1() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function G1() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function _u(e, t) {
  (e === void 0 || e === "") && (e = "0.0.0"), (t === void 0 || e === "") && (t = "0.0.0");
  const n = e.split(".").map((s) => parseInt(s, 10)), r = t.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < t.length; s++)
    if (s >= e.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function K1() {
  let e = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (e += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (t) => {
    const n = (e + Math.random() * 16) % 16 | 0;
    return e = Math.floor(e / 16), (t === "x" ? n : n & 3 | 8).toString(16);
  });
}
function V1() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function X1(e, t, n) {
  return n ? `Use of '${n}' requires \`${t}\` which is unavailable on the '${e}' object within the currently executing environment.` : `\`${t}\` is unavailable on the '${e}' object within the currently executing environment.`;
}
function Lf(e, { throwIfUnavailable: t, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = V1(), s) {
      const o = s[e];
      if (o)
        return o;
    }
  } catch (o) {
    zi.error(`Error getting object '${e}' from global scope '${s}': ${o}`);
  }
  if (t) {
    const o = X1(s, e.toString(), n);
    throw zi.error(o), new Error(o);
  }
  if (r)
    return {};
}
function Is(e, t) {
  return Cf(Rn(e), t);
}
function Rn(e) {
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
  if (ir(e, Uint8Array))
    return BigInt(`0x${He(e)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function q1(e) {
  return /^0x/i.test(e) ? e.slice(2) : e;
}
function Tp(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function ic(e, t = 8) {
  return (typeof e == "bigint" ? e : Rn(e)).toString(16).padStart(t * 2, "0");
}
function Yl(e) {
  return parseInt(e, 16);
}
function Cf(e, t = 16) {
  const n = ic(e, t);
  return At(n);
}
function Y1(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function W1(e, t) {
  return e & BigInt(1) << t;
}
function Sd(e) {
  return Z1(BigInt(`0x${He(e)}`), BigInt(e.byteLength * 8));
}
function Z1(e, t) {
  return W1(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const J1 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function He(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += J1[n];
  return t;
}
function At(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = q1(e), e = e.length % 2 ? `0${e}` : e;
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, s = e.slice(r, r + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    t[n] = o;
  }
  return t;
}
function hi(e) {
  return new TextEncoder().encode(e);
}
function ac(e) {
  return new TextDecoder().decode(e);
}
function Q1(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function e2(e) {
  return String.fromCharCode.apply(null, e);
}
function t2(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function Bp(e) {
  if (e.some(t2))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function ho(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, s) => r + s.length, 0), n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const o = e[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function cn(e) {
  return ho(...e.map((t) => typeof t == "number" ? Bp([t]) : t instanceof Array ? Bp(t) : t));
}
function ir(e, t) {
  var n, r;
  return e instanceof t || ((r = (n = e == null ? void 0 : e.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === t.name;
}
const Iy = "https://api.mainnet.hiro.so", Ly = "https://api.testnet.hiro.so", Cy = "http://localhost:3999", n2 = "https://hub.blockstack.org", r2 = 33, Pu = 32;
function o2(e) {
  if (e.length < Pu * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + Pu * 2), r = e.slice(2 + Pu * 2);
  return {
    recoveryId: Yl(t),
    r: n,
    s: r
  };
}
function Tf(e) {
  const t = typeof e == "string" ? At(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function s2(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function i2(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function a2(e, t) {
  return e[t];
}
function c2(e, t, n = 0) {
  return e[n] = t, e;
}
function l2(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function Zs(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
const u2 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function d2(e, t) {
  const n = {};
  return Object.assign(n, u2, t), await fetch(e, n);
}
function f2(e) {
  let t = d2, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function h2(...e) {
  const { fetchLib: t, middlewares: n } = f2(e);
  return async (s, o) => {
    let i = { url: s, init: o ?? {} };
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
class Ty {
  constructor(t = ky.slice(), n = ((a) => (a = Lf("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", o = void 0, i = H1) {
    this.appDomain = n, this.scopes = t, this.redirectPath = r, this.manifestPath = s, this.coreNode = o, this.authenticatorURL = i;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function vd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function p2(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function By(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function g2(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  vd(e.outputLen), vd(e.blockLen);
}
function y2(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function w2(e, t) {
  By(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Fs = {
  number: vd,
  bool: p2,
  bytes: By,
  hash: g2,
  exists: y2,
  output: w2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Uu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), to = (e, t) => e << 32 - t | e >>> t, m2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!m2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function b2(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Bf(e) {
  if (typeof e == "string" && (e = b2(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let My = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function pi(e) {
  const t = (r) => e().update(Bf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Ny = class extends My {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Fs.hash(t);
    const r = Bf(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, o = new Uint8Array(s);
    o.set(r.length > s ? t.create().update(r).digest() : r);
    for (let i = 0; i < o.length; i++)
      o[i] ^= 54;
    this.iHash.update(o), this.oHash = t.create();
    for (let i = 0; i < o.length; i++)
      o[i] ^= 106;
    this.oHash.update(o), o.fill(0);
  }
  update(t) {
    return Fs.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Fs.exists(this), Fs.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = s, t.destroyed = o, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Wl = (e, t, n) => new Ny(e, t).update(n).digest();
Wl.create = (e, t) => new Ny(e, t);
function x2(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let Mf = class extends My {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Uu(this.buffer);
  }
  update(t) {
    Fs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = Bf(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Uu(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Fs.exists(this), Fs.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    x2(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Uu(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], o);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return t.length = s, t.pos = a, t.finished = o, t.destroyed = i, s % n && t.buffer.set(r), t;
  }
};
const S2 = (e, t, n) => e & t ^ ~e & n, v2 = (e, t, n) => e & t ^ e & n ^ t & n, A2 = new Uint32Array([
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
]), Wo = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Zo = new Uint32Array(64);
let _y = class extends Mf {
  constructor() {
    super(64, 32, 8, !1), this.A = Wo[0] | 0, this.B = Wo[1] | 0, this.C = Wo[2] | 0, this.D = Wo[3] | 0, this.E = Wo[4] | 0, this.F = Wo[5] | 0, this.G = Wo[6] | 0, this.H = Wo[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [t, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      Zo[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = Zo[d - 15], y = Zo[d - 2], v = to(w, 7) ^ to(w, 18) ^ w >>> 3, S = to(y, 17) ^ to(y, 19) ^ y >>> 10;
      Zo[d] = S + Zo[d - 7] + v + Zo[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = to(a, 6) ^ to(a, 11) ^ to(a, 25), y = h + w + S2(a, c, u) + A2[d] + Zo[d] | 0, S = (to(r, 2) ^ to(r, 13) ^ to(r, 22)) + v2(r, s, o) | 0;
      h = u, u = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    Zo.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, E2 = class extends _y {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const ea = pi(() => new _y());
pi(() => new E2());
const k2 = {}, Py = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: k2
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const bt = BigInt(0), Vt = BigInt(1), vs = BigInt(2), Fa = BigInt(3), Mp = BigInt(8), Ot = Object.freeze({
  a: bt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Vt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Np = (e, t) => (e + t / vs) / t, Ac = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(e) {
    const { n: t } = Ot, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Vt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), o = n, i = BigInt("0x100000000000000000000000000000000"), a = Np(o * e, t), c = Np(-r * e, t);
    let u = he(e - a * n - c * s, t), h = he(-a * r - c * o, t);
    const d = u > i, w = h > i;
    if (d && (u = t - u), w && (h = t - h), u > i || h > i)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + e);
    return { k1neg: d, k1: u, k2neg: w, k2: h };
  }
}, Vr = 32, Js = 32, Uy = 32, gl = Vr + 1, yl = 2 * Vr + 1;
function _p(e) {
  const { a: t, b: n } = Ot, r = he(e * e), s = he(r * e);
  return he(s + t * e + n);
}
const Ec = Ot.a === bt;
class Nf extends Error {
  constructor(t) {
    super(t);
  }
}
function Pp(e) {
  if (!(e instanceof $t))
    throw new TypeError("JacobianPoint expected");
}
class $t {
  constructor(t, n, r) {
    this.x = t, this.y = n, this.z = r;
  }
  static fromAffine(t) {
    if (!(t instanceof lt))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return t.equals(lt.ZERO) ? $t.ZERO : new $t(t.x, t.y, Vt);
  }
  static toAffineBatch(t) {
    const n = T2(t.map((r) => r.z));
    return t.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(t) {
    return $t.toAffineBatch(t).map($t.fromAffine);
  }
  equals(t) {
    Pp(t);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = t, c = he(s * s), u = he(a * a), h = he(n * u), d = he(o * c), w = he(he(r * a) * u), y = he(he(i * s) * c);
    return h === d && w === y;
  }
  negate() {
    return new $t(this.x, he(-this.y), this.z);
  }
  double() {
    const { x: t, y: n, z: r } = this, s = he(t * t), o = he(n * n), i = he(o * o), a = t + o, c = he(vs * (he(a * a) - s - i)), u = he(Fa * s), h = he(u * u), d = he(h - vs * c), w = he(u * (c - d) - Mp * i), y = he(vs * n * r);
    return new $t(d, w, y);
  }
  add(t) {
    Pp(t);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = t;
    if (o === bt || i === bt)
      return this;
    if (n === bt || r === bt)
      return t;
    const c = he(s * s), u = he(a * a), h = he(n * u), d = he(o * c), w = he(he(r * a) * u), y = he(he(i * s) * c), v = he(d - h), S = he(y - w);
    if (v === bt)
      return S === bt ? this.double() : $t.ZERO;
    const I = he(v * v), U = he(v * I), P = he(h * I), A = he(S * S - U - vs * P), T = he(S * (P - A) - w * U), B = he(s * a * v);
    return new $t(A, T, B);
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiplyUnsafe(t) {
    const n = $t.ZERO;
    if (typeof t == "bigint" && t === bt)
      return n;
    let r = Hp(t);
    if (r === Vt)
      return this;
    if (!Ec) {
      let d = n, w = this;
      for (; r > bt; )
        r & Vt && (d = d.add(w)), w = w.double(), r >>= Vt;
      return d;
    }
    let { k1neg: s, k1: o, k2neg: i, k2: a } = Ac.splitScalar(r), c = n, u = n, h = this;
    for (; o > bt || a > bt; )
      o & Vt && (c = c.add(h)), a & Vt && (u = u.add(h)), h = h.double(), o >>= Vt, a >>= Vt;
    return s && (c = c.negate()), i && (u = u.negate()), u = new $t(he(u.x * Ac.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(t) {
    const n = Ec ? 128 / t + 1 : 256 / t + 1, r = [];
    let s = this, o = s;
    for (let i = 0; i < n; i++) {
      o = s, r.push(o);
      for (let a = 1; a < 2 ** (t - 1); a++)
        o = o.add(s), r.push(o);
      s = o.double();
    }
    return r;
  }
  wNAF(t, n) {
    !n && this.equals($t.BASE) && (n = lt.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Ad.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = $t.normalizeZ(s), Ad.set(n, s)));
    let o = $t.ZERO, i = $t.BASE;
    const a = 1 + (Ec ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), h = 2 ** r, d = BigInt(r);
    for (let w = 0; w < a; w++) {
      const y = w * c;
      let v = Number(t & u);
      t >>= d, v > c && (v -= h, t += Vt);
      const S = y, I = y + Math.abs(v) - 1, U = w % 2 !== 0, P = v < 0;
      v === 0 ? i = i.add(kc(U, s[S])) : o = o.add(kc(P, s[I]));
    }
    return { p: o, f: i };
  }
  multiply(t, n) {
    let r = Hp(t), s, o;
    if (Ec) {
      const { k1neg: i, k1: a, k2neg: c, k2: u } = Ac.splitScalar(r);
      let { p: h, f: d } = this.wNAF(a, n), { p: w, f: y } = this.wNAF(u, n);
      h = kc(i, h), w = kc(c, w), w = new $t(he(w.x * Ac.beta), w.y, w.z), s = h.add(w), o = d.add(y);
    } else {
      const { p: i, f: a } = this.wNAF(r, n);
      s = i, o = a;
    }
    return $t.normalizeZ([s, o])[0];
  }
  toAffine(t) {
    const { x: n, y: r, z: s } = this, o = this.equals($t.ZERO);
    t == null && (t = o ? Mp : wa(s));
    const i = t, a = he(i * i), c = he(a * i), u = he(n * a), h = he(r * c), d = he(s * i);
    if (o)
      return lt.ZERO;
    if (d !== Vt)
      throw new Error("invZ was invalid");
    return new lt(u, h);
  }
}
$t.BASE = new $t(Ot.Gx, Ot.Gy, Vt);
$t.ZERO = new $t(bt, Vt, bt);
function kc(e, t) {
  const n = t.negate();
  return e ? n : t;
}
const Ad = /* @__PURE__ */ new WeakMap();
class lt {
  constructor(t, n) {
    this.x = t, this.y = n;
  }
  _setWindowSize(t) {
    this._WINDOW_SIZE = t, Ad.delete(this);
  }
  hasEvenY() {
    return this.y % vs === bt;
  }
  static fromCompressedHex(t) {
    const n = t.length === 32, r = mr(n ? t : t.subarray(1));
    if (!rl(r))
      throw new Error("Point is not on curve");
    const s = _p(r);
    let o = C2(s);
    const i = (o & Vt) === Vt;
    n ? i && (o = he(-o)) : (t[0] & 1) === 1 !== i && (o = he(-o));
    const a = new lt(r, o);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(t) {
    const n = mr(t.subarray(1, Vr + 1)), r = mr(t.subarray(Vr + 1, Vr * 2 + 1)), s = new lt(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(t) {
    const n = po(t), r = n.length, s = n[0];
    if (r === Vr)
      return this.fromCompressedHex(n);
    if (r === gl && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === yl && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${gl} compressed bytes or ${yl} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(t) {
    return lt.BASE.multiply(Qs(t));
  }
  static fromSignature(t, n, r) {
    const { r: s, s: o } = Dy(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const i = _f(po(t)), { n: a } = Ot, c = r === 2 || r === 3 ? s + a : s, u = wa(c, a), h = he(-i * u, a), d = he(o * u, a), w = r & 1 ? "03" : "02", y = lt.fromHex(w + As(c)), v = lt.BASE.multiplyAndAddUnsafe(y, h, d);
    if (!v)
      throw new Error("Cannot recover signature: point at infinify");
    return v.assertValidity(), v;
  }
  toRawBytes(t = !1) {
    return Es(this.toHex(t));
  }
  toHex(t = !1) {
    const n = As(this.x);
    return t ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${As(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const t = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!rl(n) || !rl(r))
      throw new Error(t);
    const s = he(r * r), o = _p(n);
    if (he(s - o) !== bt)
      throw new Error(t);
  }
  equals(t) {
    return this.x === t.x && this.y === t.y;
  }
  negate() {
    return new lt(this.x, he(-this.y));
  }
  double() {
    return $t.fromAffine(this).double().toAffine();
  }
  add(t) {
    return $t.fromAffine(this).add($t.fromAffine(t)).toAffine();
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiply(t) {
    return $t.fromAffine(this).multiply(t, this).toAffine();
  }
  multiplyAndAddUnsafe(t, n, r) {
    const s = $t.fromAffine(this), o = n === bt || n === Vt || this !== lt.BASE ? s.multiplyUnsafe(n) : s.multiply(n), i = $t.fromAffine(t).multiplyUnsafe(r), a = o.add(i);
    return a.equals($t.ZERO) ? void 0 : a.toAffine();
  }
}
lt.BASE = new lt(Ot.Gx, Ot.Gy);
lt.ZERO = new lt(bt, bt);
function Up(e) {
  return Number.parseInt(e[0], 16) >= 8 ? "00" + e : e;
}
function Op(e) {
  if (e.length < 2 || e[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${ta(e)}`);
  const t = e[1], n = e.subarray(2, t + 2);
  if (!t || n.length !== t)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: mr(n), left: e.subarray(t + 2) };
}
function $2(e) {
  if (e.length < 2 || e[0] != 48)
    throw new Error(`Invalid signature tag: ${ta(e)}`);
  if (e[1] !== e.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: t, left: n } = Op(e.subarray(2)), { data: r, left: s } = Op(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${ta(s)}`);
  return { r: t, s: r };
}
class wr {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromCompact(t) {
    const n = t instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof t != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? ta(t) : t;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new wr(wl(s.slice(0, 64)), wl(s.slice(64, 128)));
  }
  static fromDER(t) {
    const n = t instanceof Uint8Array;
    if (typeof t != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = $2(n ? t : Es(t));
    return new wr(r, s);
  }
  static fromHex(t) {
    return this.fromDER(t);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!ra(t))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!ra(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const t = Ot.n >> Vt;
    return this.s > t;
  }
  normalizeS() {
    return this.hasHighS() ? new wr(this.r, he(-this.s, Ot.n)) : this;
  }
  toDERRawBytes() {
    return Es(this.toDERHex());
  }
  toDERHex() {
    const t = Up(Ca(this.s)), n = Up(Ca(this.r)), r = t.length / 2, s = n.length / 2, o = Ca(r), i = Ca(s);
    return `30${Ca(s + r + 4)}02${i}${n}02${o}${t}`;
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
    return As(this.r) + As(this.s);
  }
}
function xs(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, s) => r + s.length, 0), n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const o = e[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
const I2 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function ta(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += I2[e[n]];
  return t;
}
const L2 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function As(e) {
  if (typeof e != "bigint")
    throw new Error("Expected bigint");
  if (!(bt <= e && e < L2))
    throw new Error("Expected number 0 <= n < 2^256");
  return e.toString(16).padStart(64, "0");
}
function na(e) {
  const t = Es(As(e));
  if (t.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return t;
}
function Ca(e) {
  const t = e.toString(16);
  return t.length & 1 ? `0${t}` : t;
}
function wl(e) {
  if (typeof e != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof e);
  return BigInt(`0x${e}`);
}
function Es(e) {
  if (typeof e != "string")
    throw new TypeError("hexToBytes: expected string, got " + typeof e);
  if (e.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + e.length);
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, s = e.slice(r, r + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    t[n] = o;
  }
  return t;
}
function mr(e) {
  return wl(ta(e));
}
function po(e) {
  return e instanceof Uint8Array ? Uint8Array.from(e) : Es(e);
}
function Hp(e) {
  if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    return BigInt(e);
  if (typeof e == "bigint" && ra(e))
    return e;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function he(e, t = Ot.P) {
  const n = e % t;
  return n >= bt ? n : t + n;
}
function kr(e, t) {
  const { P: n } = Ot;
  let r = e;
  for (; t-- > bt; )
    r *= r, r %= n;
  return r;
}
function C2(e) {
  const { P: t } = Ot, n = BigInt(6), r = BigInt(11), s = BigInt(22), o = BigInt(23), i = BigInt(44), a = BigInt(88), c = e * e * e % t, u = c * c * e % t, h = kr(u, Fa) * u % t, d = kr(h, Fa) * u % t, w = kr(d, vs) * c % t, y = kr(w, r) * w % t, v = kr(y, s) * y % t, S = kr(v, i) * v % t, I = kr(S, a) * S % t, U = kr(I, i) * v % t, P = kr(U, Fa) * u % t, A = kr(P, o) * y % t, T = kr(A, n) * c % t, B = kr(T, vs);
  if (B * B % t !== e)
    throw new Error("Cannot find square root");
  return B;
}
function wa(e, t = Ot.P) {
  if (e === bt || t <= bt)
    throw new Error(`invert: expected positive integers, got n=${e} mod=${t}`);
  let n = he(e, t), r = t, s = bt, o = Vt;
  for (; n !== bt; ) {
    const a = r / n, c = r % n, u = s - o * a;
    r = n, n = c, s = o, o = u;
  }
  if (r !== Vt)
    throw new Error("invert: does not exist");
  return he(s, t);
}
function T2(e, t = Ot.P) {
  const n = new Array(e.length), r = e.reduce((o, i, a) => i === bt ? o : (n[a] = o, he(o * i, t)), Vt), s = wa(r, t);
  return e.reduceRight((o, i, a) => i === bt ? o : (n[a] = he(o * n[a], t), he(o * i, t)), s), n;
}
function B2(e) {
  const t = e.length * 8 - Js * 8, n = mr(e);
  return t > 0 ? n >> BigInt(t) : n;
}
function _f(e, t = !1) {
  const n = B2(e);
  if (t)
    return n;
  const { n: r } = Ot;
  return n >= r ? n - r : n;
}
let Wi, ja;
class Oy {
  constructor(t, n) {
    if (this.hashLen = t, this.qByteLen = n, typeof t != "number" || t < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(t).fill(1), this.k = new Uint8Array(t).fill(0), this.counter = 0;
  }
  hmac(...t) {
    return rn.hmacSha256(this.k, ...t);
  }
  hmacSync(...t) {
    return ja(this.k, ...t);
  }
  checkSync() {
    if (typeof ja != "function")
      throw new Nf("hmacSha256Sync needs to be set");
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
    return xs(...n);
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
    return xs(...n);
  }
}
function ra(e) {
  return bt < e && e < Ot.n;
}
function rl(e) {
  return bt < e && e < Ot.P;
}
function Hy(e, t, n, r = !0) {
  const { n: s } = Ot, o = _f(e, !0);
  if (!ra(o))
    return;
  const i = wa(o, s), a = lt.BASE.multiply(o), c = he(a.x, s);
  if (c === bt)
    return;
  const u = he(i * he(t + n * c, s), s);
  if (u === bt)
    return;
  let h = new wr(c, u), d = (a.x === h.r ? 0 : 2) | Number(a.y & Vt);
  return r && h.hasHighS() && (h = h.normalizeS(), d ^= 1), { sig: h, recovery: d };
}
function Qs(e) {
  let t;
  if (typeof e == "bigint")
    t = e;
  else if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    t = BigInt(e);
  else if (typeof e == "string") {
    if (e.length !== 2 * Js)
      throw new Error("Expected 32 bytes of private key");
    t = wl(e);
  } else if (e instanceof Uint8Array) {
    if (e.length !== Js)
      throw new Error("Expected 32 bytes of private key");
    t = mr(e);
  } else
    throw new TypeError("Expected valid private key");
  if (!ra(t))
    throw new Error("Expected private key: 0 < key < n");
  return t;
}
function Pf(e) {
  return e instanceof lt ? (e.assertValidity(), e) : lt.fromHex(e);
}
function Dy(e) {
  if (e instanceof wr)
    return e.assertValidity(), e;
  try {
    return wr.fromDER(e);
  } catch {
    return wr.fromCompact(e);
  }
}
function cc(e, t = !1) {
  return lt.fromPrivateKey(e).toRawBytes(t);
}
function M2(e, t, n, r = !1) {
  return lt.fromSignature(e, t, n).toRawBytes(r);
}
function Dp(e) {
  const t = e instanceof Uint8Array, n = typeof e == "string", r = (t || n) && e.length;
  return t ? r === gl || r === yl : n ? r === gl * 2 || r === yl * 2 : e instanceof lt;
}
function Uf(e, t, n = !1) {
  if (Dp(e))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Dp(t))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Pf(t);
  return r.assertValidity(), r.multiply(Qs(e)).toRawBytes(n);
}
function Fy(e) {
  const t = e.length > Vr ? e.slice(0, Vr) : e;
  return mr(t);
}
function N2(e) {
  const t = Fy(e), n = he(t, Ot.n);
  return jy(n < bt ? t : n);
}
function jy(e) {
  return na(e);
}
function Ry(e, t, n) {
  if (e == null)
    throw new Error(`sign: expected valid message hash, not "${e}"`);
  const r = po(e), s = Qs(t), o = [jy(s), N2(r)];
  if (n != null) {
    n === !0 && (n = rn.randomBytes(Vr));
    const c = po(n);
    if (c.length !== Vr)
      throw new Error(`sign: Expected ${Vr} bytes of extra data`);
    o.push(c);
  }
  const i = xs(...o), a = Fy(r);
  return { seed: i, m: a, d: s };
}
function zy(e, t) {
  const { sig: n, recovery: r } = e, { der: s, recovered: o } = Object.assign({ canonical: !0, der: !0 }, t), i = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return o ? [i, r] : i;
}
async function _2(e, t, n = {}) {
  const { seed: r, m: s, d: o } = Ry(e, t, n.extraEntropy), i = new Oy(Uy, Js);
  await i.reseed(r);
  let a;
  for (; !(a = Hy(await i.generate(), s, o, n.canonical)); )
    await i.reseed();
  return zy(a, n);
}
function Zl(e, t, n = {}) {
  const { seed: r, m: s, d: o } = Ry(e, t, n.extraEntropy), i = new Oy(Uy, Js);
  i.reseedSync(r);
  let a;
  for (; !(a = Hy(i.generateSync(), s, o, n.canonical)); )
    i.reseedSync();
  return zy(a, n);
}
const P2 = { strict: !0 };
function U2(e, t, n, r = P2) {
  let s;
  try {
    s = Dy(e), t = po(t);
  } catch {
    return !1;
  }
  const { r: o, s: i } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = _f(t);
  let c;
  try {
    c = Pf(n);
  } catch {
    return !1;
  }
  const { n: u } = Ot, h = wa(i, u), d = he(a * h, u), w = he(o * h, u), y = lt.BASE.multiplyAndAddUnsafe(c, d, w);
  return y ? he(y.x, u) === o : !1;
}
function ml(e) {
  return he(mr(e), Ot.n);
}
class oa {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromHex(t) {
    const n = po(t);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = mr(n.subarray(0, 32)), s = mr(n.subarray(32, 64));
    return new oa(r, s);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!rl(t) || !ra(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return As(this.r) + As(this.s);
  }
  toRawBytes() {
    return Es(this.toHex());
  }
}
function O2(e) {
  return lt.fromPrivateKey(e).toRawX();
}
class Gy {
  constructor(t, n, r = rn.randomBytes()) {
    if (t == null)
      throw new TypeError(`sign: Expected valid message, not "${t}"`);
    this.m = po(t);
    const { x: s, scalar: o } = this.getScalar(Qs(n));
    if (this.px = s, this.d = o, this.rand = po(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(t) {
    const n = lt.fromPrivateKey(t), r = n.hasEvenY() ? t : Ot.n - t;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(t, n) {
    return na(t ^ mr(n));
  }
  finalizeNonce(t) {
    const n = he(mr(t), Ot.n);
    if (n === bt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: o } = this.getScalar(n);
    return { R: r, rx: s, k: o };
  }
  finalizeSig(t, n, r, s) {
    return new oa(t.x, he(n + r * s, Ot.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: t, d: n, px: r, rand: s } = this, o = rn.taggedHash, i = this.initNonce(n, await o(bs.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await o(bs.nonce, i, r, t)), h = ml(await o(bs.challenge, c, r, t)), d = this.finalizeSig(a, u, h, n);
    return await Xy(d, t, r) || this.error(), d;
  }
  calcSync() {
    const { m: t, d: n, px: r, rand: s } = this, o = rn.taggedHashSync, i = this.initNonce(n, o(bs.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(o(bs.nonce, i, r, t)), h = ml(o(bs.challenge, c, r, t)), d = this.finalizeSig(a, u, h, n);
    return qy(d, t, r) || this.error(), d;
  }
}
async function H2(e, t, n) {
  return new Gy(e, t, n).calc();
}
function D2(e, t, n) {
  return new Gy(e, t, n).calcSync();
}
function Ky(e, t, n) {
  const r = e instanceof oa, s = r ? e : oa.fromHex(e);
  return r && s.assertValidity(), {
    ...s,
    m: po(t),
    P: Pf(n)
  };
}
function Vy(e, t, n, r) {
  const s = lt.BASE.multiplyAndAddUnsafe(t, Qs(n), he(-r, Ot.n));
  return !(!s || !s.hasEvenY() || s.x !== e);
}
async function Xy(e, t, n) {
  try {
    const { r, s, m: o, P: i } = Ky(e, t, n), a = ml(await rn.taggedHash(bs.challenge, na(r), i.toRawX(), o));
    return Vy(r, i, s, a);
  } catch {
    return !1;
  }
}
function qy(e, t, n) {
  try {
    const { r, s, m: o, P: i } = Ky(e, t, n), a = ml(rn.taggedHashSync(bs.challenge, na(r), i.toRawX(), o));
    return Vy(r, i, s, a);
  } catch (r) {
    if (r instanceof Nf)
      throw r;
    return !1;
  }
}
const F2 = {
  Signature: oa,
  getPublicKey: O2,
  sign: H2,
  verify: Xy,
  signSync: D2,
  verifySync: qy
};
lt.BASE._setWindowSize(8);
const lr = {
  node: Py,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, bs = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, $c = {}, rn = {
  bytesToHex: ta,
  hexToBytes: Es,
  concatBytes: xs,
  mod: he,
  invert: wa,
  isValidPrivateKey(e) {
    try {
      return Qs(e), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: na,
  _normalizePrivateKey: Qs,
  hashToPrivateKey: (e) => {
    e = po(e);
    const t = Js + 8;
    if (e.length < t || e.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = he(mr(e), Ot.n - Vt) + Vt;
    return na(n);
  },
  randomBytes: (e = 32) => {
    if (lr.web)
      return lr.web.getRandomValues(new Uint8Array(e));
    if (lr.node) {
      const { randomBytes: t } = lr.node;
      return Uint8Array.from(t(e));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => rn.hashToPrivateKey(rn.randomBytes(Js + 8)),
  precompute(e = 8, t = lt.BASE) {
    const n = t === lt.BASE ? t : new lt(t.x, t.y);
    return n._setWindowSize(e), n.multiply(Fa), n;
  },
  sha256: async (...e) => {
    if (lr.web) {
      const t = await lr.web.subtle.digest("SHA-256", xs(...e));
      return new Uint8Array(t);
    } else if (lr.node) {
      const { createHash: t } = lr.node, n = t("sha256");
      return e.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (e, ...t) => {
    if (lr.web) {
      const n = await lr.web.subtle.importKey("raw", e, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = xs(...t), s = await lr.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (lr.node) {
      const { createHmac: n } = lr.node, r = n("sha256", e);
      return t.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (e, ...t) => {
    let n = $c[e];
    if (n === void 0) {
      const r = await rn.sha256(Uint8Array.from(e, (s) => s.charCodeAt(0)));
      n = xs(r, r), $c[e] = n;
    }
    return rn.sha256(n, ...t);
  },
  taggedHashSync: (e, ...t) => {
    if (typeof Wi != "function")
      throw new Nf("sha256Sync is undefined, you need to set it");
    let n = $c[e];
    if (n === void 0) {
      const r = Wi(Uint8Array.from(e, (s) => s.charCodeAt(0)));
      n = xs(r, r), $c[e] = n;
    }
    return Wi(n, ...t);
  },
  _JacobianPoint: $t
};
Object.defineProperties(rn, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Wi;
    },
    set(e) {
      Wi || (Wi = e);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return ja;
    },
    set(e) {
      ja || (ja = e);
    }
  }
});
const j2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: Ot,
  Point: lt,
  Signature: wr,
  getPublicKey: cc,
  getSharedSecret: Uf,
  recoverPublicKey: M2,
  schnorr: F2,
  sign: _2,
  signSync: Zl,
  utils: rn,
  verify: U2
}, Symbol.toStringTag, { value: "Module" }));
var lc = {};
lc.byteLength = V2;
var R2 = lc.toByteArray = q2, z2 = lc.fromByteArray = Z2, io = [], Ir = [], G2 = typeof Uint8Array < "u" ? Uint8Array : Array, Ou = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Pi = 0, K2 = Ou.length; Pi < K2; ++Pi)
  io[Pi] = Ou[Pi], Ir[Ou.charCodeAt(Pi)] = Pi;
Ir[45] = 62;
Ir[95] = 63;
function Yy(e) {
  var t = e.length;
  if (t % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = e.indexOf("=");
  n === -1 && (n = t);
  var r = n === t ? 0 : 4 - n % 4;
  return [n, r];
}
function V2(e) {
  var t = Yy(e), n = t[0], r = t[1];
  return (n + r) * 3 / 4 - r;
}
function X2(e, t, n) {
  return (t + n) * 3 / 4 - n;
}
function q2(e) {
  var t, n = Yy(e), r = n[0], s = n[1], o = new G2(X2(e, r, s)), i = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    t = Ir[e.charCodeAt(c)] << 18 | Ir[e.charCodeAt(c + 1)] << 12 | Ir[e.charCodeAt(c + 2)] << 6 | Ir[e.charCodeAt(c + 3)], o[i++] = t >> 16 & 255, o[i++] = t >> 8 & 255, o[i++] = t & 255;
  return s === 2 && (t = Ir[e.charCodeAt(c)] << 2 | Ir[e.charCodeAt(c + 1)] >> 4, o[i++] = t & 255), s === 1 && (t = Ir[e.charCodeAt(c)] << 10 | Ir[e.charCodeAt(c + 1)] << 4 | Ir[e.charCodeAt(c + 2)] >> 2, o[i++] = t >> 8 & 255, o[i++] = t & 255), o;
}
function Y2(e) {
  return io[e >> 18 & 63] + io[e >> 12 & 63] + io[e >> 6 & 63] + io[e & 63];
}
function W2(e, t, n) {
  for (var r, s = [], o = t; o < n; o += 3)
    r = (e[o] << 16 & 16711680) + (e[o + 1] << 8 & 65280) + (e[o + 2] & 255), s.push(Y2(r));
  return s.join("");
}
function Z2(e) {
  for (var t, n = e.length, r = n % 3, s = [], o = 16383, i = 0, a = n - r; i < a; i += o)
    s.push(W2(e, i, i + o > a ? a : i + o));
  return r === 1 ? (t = e[n - 1], s.push(
    io[t >> 2] + io[t << 4 & 63] + "=="
  )) : r === 2 && (t = (e[n - 2] << 8) + e[n - 1], s.push(
    io[t >> 10] + io[t >> 4 & 63] + io[t << 2 & 63] + "="
  )), s.join("");
}
function J2() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const Q2 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function ex() {
  if (J2())
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
    throw new Error(Q2);
  }
}
class tx {
  constructor(t, n) {
    this.createCipher = t, this.createDecipher = n;
  }
  async encrypt(t, n, r, s) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const o = this.createCipher(t, n, r), i = new Uint8Array(ho(o.update(s), o.final()));
    return Promise.resolve(i);
  }
  async decrypt(t, n, r, s) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const o = this.createDecipher(t, n, r), i = new Uint8Array(ho(o.update(s), o.final()));
    return Promise.resolve(i);
  }
}
class nx {
  constructor(t) {
    this.subtleCrypto = t;
  }
  async encrypt(t, n, r, s) {
    let o, i;
    if (t === "aes-128-cbc")
      o = "AES-CBC", i = 128;
    else if (t === "aes-256-cbc")
      o = "AES-CBC", i = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: o, length: i }, !1, ["encrypt"]), c = await this.subtleCrypto.encrypt({ name: o, iv: r }, a, s);
    return new Uint8Array(c);
  }
  async decrypt(t, n, r, s) {
    let o, i;
    if (t === "aes-128-cbc")
      o = "AES-CBC", i = 128;
    else if (t === "aes-256-cbc")
      o = "AES-CBC", i = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: o, length: i }, !1, ["decrypt"]), c = await this.subtleCrypto.decrypt({ name: o, iv: r }, a, s);
    return new Uint8Array(c);
  }
}
async function Wy() {
  const e = await ex();
  return e.name === "subtleCrypto" ? new nx(e.lib) : new tx(e.lib.createCipheriv, e.lib.createDecipheriv);
}
function rx(e) {
  if (e.length >= 255)
    throw new TypeError("Alphabet too long");
  for (var t = new Uint8Array(256), n = 0; n < t.length; n++)
    t[n] = 255;
  for (var r = 0; r < e.length; r++) {
    var s = e.charAt(r), o = s.charCodeAt(0);
    if (t[o] !== 255)
      throw new TypeError(s + " is ambiguous");
    t[o] = r;
  }
  var i = e.length, a = e.charAt(0), c = Math.log(i) / Math.log(256), u = Math.log(256) / Math.log(i);
  function h(y) {
    if (y instanceof Uint8Array || (ArrayBuffer.isView(y) ? y = new Uint8Array(y.buffer, y.byteOffset, y.byteLength) : Array.isArray(y) && (y = Uint8Array.from(y))), !(y instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (y.length === 0)
      return "";
    for (var v = 0, S = 0, I = 0, U = y.length; I !== U && y[I] === 0; )
      I++, v++;
    for (var P = (U - I) * u + 1 >>> 0, A = new Uint8Array(P); I !== U; ) {
      for (var T = y[I], B = 0, X = P - 1; (T !== 0 || B < S) && X !== -1; X--, B++)
        T += 256 * A[X] >>> 0, A[X] = T % i >>> 0, T = T / i >>> 0;
      if (T !== 0)
        throw new Error("Non-zero carry");
      S = B, I++;
    }
    for (var Q = P - S; Q !== P && A[Q] === 0; )
      Q++;
    for (var oe = a.repeat(v); Q < P; ++Q)
      oe += e.charAt(A[Q]);
    return oe;
  }
  function d(y) {
    if (typeof y != "string")
      throw new TypeError("Expected String");
    if (y.length === 0)
      return new Uint8Array();
    for (var v = 0, S = 0, I = 0; y[v] === a; )
      S++, v++;
    for (var U = (y.length - v) * c + 1 >>> 0, P = new Uint8Array(U); y[v]; ) {
      var A = y.charCodeAt(v);
      if (A > 255)
        return;
      var T = t[A];
      if (T === 255)
        return;
      for (var B = 0, X = U - 1; (T !== 0 || B < I) && X !== -1; X--, B++)
        T += i * P[X] >>> 0, P[X] = T % 256 >>> 0, T = T / 256 >>> 0;
      if (T !== 0)
        throw new Error("Non-zero carry");
      I = B, v++;
    }
    for (var Q = U - I; Q !== U && P[Q] === 0; )
      Q++;
    for (var oe = new Uint8Array(S + (U - Q)), Y = S; Q !== U; )
      oe[Y++] = P[Q++];
    return oe;
  }
  function w(y) {
    var v = d(y);
    if (v)
      return v;
    throw new Error("Non-base" + i + " character");
  }
  return {
    encode: h,
    decodeUnsafe: d,
    decode: w
  };
}
var Zy = rx;
const ox = Zy, sx = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var ix = ox(sx);
const ax = /* @__PURE__ */ Sy(ix), cx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Jy = Uint8Array.from({ length: 16 }, (e, t) => t), lx = Jy.map((e) => (9 * e + 5) % 16);
let Of = [Jy], Hf = [lx];
for (let e = 0; e < 4; e++)
  for (let t of [Of, Hf])
    t.push(t[e].map((n) => cx[n]));
const Qy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), ux = Of.map((e, t) => e.map((n) => Qy[t][n])), dx = Hf.map((e, t) => e.map((n) => Qy[t][n])), fx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), hx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ic = (e, t) => e << t | e >>> 32 - t;
function Fp(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Lc = new Uint32Array(16);
let px = class extends Mf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: o } = this;
    return [t, n, r, s, o];
  }
  set(t, n, r, s, o) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = o | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      Lc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, w = d;
    for (let y = 0; y < 5; y++) {
      const v = 4 - y, S = fx[y], I = hx[y], U = Of[y], P = Hf[y], A = ux[y], T = dx[y];
      for (let B = 0; B < 16; B++) {
        const X = Ic(r + Fp(y, o, a, u) + Lc[U[B]] + S, A[B]) + d | 0;
        r = d, d = u, u = Ic(a, 10) | 0, a = o, o = X;
      }
      for (let B = 0; B < 16; B++) {
        const X = Ic(s + Fp(v, i, c, h) + Lc[P[B]] + I, T[B]) + w | 0;
        s = w, w = h, h = Ic(c, 10) | 0, c = i, i = X;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + w | 0, this.h3 + d + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Lc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const gx = pi(() => new px());
function yx(e) {
  return gx(e);
}
const Cc = BigInt(2 ** 32 - 1), Ed = BigInt(32);
function ew(e, t = !1) {
  return t ? { h: Number(e & Cc), l: Number(e >> Ed & Cc) } : { h: Number(e >> Ed & Cc) | 0, l: Number(e & Cc) | 0 };
}
function wx(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = ew(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const mx = (e, t) => BigInt(e >>> 0) << Ed | BigInt(t >>> 0), bx = (e, t, n) => e >>> n, xx = (e, t, n) => e << 32 - n | t >>> n, Sx = (e, t, n) => e >>> n | t << 32 - n, vx = (e, t, n) => e << 32 - n | t >>> n, Ax = (e, t, n) => e << 64 - n | t >>> n - 32, Ex = (e, t, n) => e >>> n - 32 | t << 64 - n, kx = (e, t) => t, $x = (e, t) => e, Ix = (e, t, n) => e << n | t >>> 32 - n, Lx = (e, t, n) => t << n | e >>> 32 - n, Cx = (e, t, n) => t << n - 32 | e >>> 64 - n, Tx = (e, t, n) => e << n - 32 | t >>> 64 - n;
function Bx(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Mx = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), Nx = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, _x = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), Px = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, Ux = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Ox = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, nt = {
  fromBig: ew,
  split: wx,
  toBig: mx,
  shrSH: bx,
  shrSL: xx,
  rotrSH: Sx,
  rotrSL: vx,
  rotrBH: Ax,
  rotrBL: Ex,
  rotr32H: kx,
  rotr32L: $x,
  rotlSH: Ix,
  rotlSL: Lx,
  rotlBH: Cx,
  rotlBL: Tx,
  add: Bx,
  add3L: Mx,
  add3H: Nx,
  add4L: _x,
  add4H: Px,
  add5H: Ox,
  add5L: Ux
}, [Hx, Dx] = nt.split([
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
].map((e) => BigInt(e))), Jo = new Uint32Array(80), Qo = new Uint32Array(80);
let Jl = class extends Mf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: w, Gh: y, Gl: v, Hh: S, Hl: I } = this;
    return [t, n, r, s, o, i, a, c, u, h, d, w, y, v, S, I];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, u, h, d, w, y, v, S, I) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = v | 0, this.Hh = S | 0, this.Hl = I | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      Jo[A] = t.getUint32(n), Qo[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = Jo[A - 15] | 0, B = Qo[A - 15] | 0, X = nt.rotrSH(T, B, 1) ^ nt.rotrSH(T, B, 8) ^ nt.shrSH(T, B, 7), Q = nt.rotrSL(T, B, 1) ^ nt.rotrSL(T, B, 8) ^ nt.shrSL(T, B, 7), oe = Jo[A - 2] | 0, Y = Qo[A - 2] | 0, m = nt.rotrSH(oe, Y, 19) ^ nt.rotrBH(oe, Y, 61) ^ nt.shrSH(oe, Y, 6), L = nt.rotrSL(oe, Y, 19) ^ nt.rotrBL(oe, Y, 61) ^ nt.shrSL(oe, Y, 6), _ = nt.add4L(Q, L, Qo[A - 7], Qo[A - 16]), N = nt.add4H(_, X, m, Jo[A - 7], Jo[A - 16]);
      Jo[A] = N | 0, Qo[A] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: w, Fh: y, Fl: v, Gh: S, Gl: I, Hh: U, Hl: P } = this;
    for (let A = 0; A < 80; A++) {
      const T = nt.rotrSH(d, w, 14) ^ nt.rotrSH(d, w, 18) ^ nt.rotrBH(d, w, 41), B = nt.rotrSL(d, w, 14) ^ nt.rotrSL(d, w, 18) ^ nt.rotrBL(d, w, 41), X = d & y ^ ~d & S, Q = w & v ^ ~w & I, oe = nt.add5L(P, B, Q, Dx[A], Qo[A]), Y = nt.add5H(oe, U, T, X, Hx[A], Jo[A]), m = oe | 0, L = nt.rotrSH(r, s, 28) ^ nt.rotrBH(r, s, 34) ^ nt.rotrBH(r, s, 39), _ = nt.rotrSL(r, s, 28) ^ nt.rotrBL(r, s, 34) ^ nt.rotrBL(r, s, 39), N = r & o ^ r & a ^ o & a, W = s & i ^ s & c ^ i & c;
      U = S | 0, P = I | 0, S = y | 0, I = v | 0, y = d | 0, v = w | 0, { h: d, l: w } = nt.add(u | 0, h | 0, Y | 0, m | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const j = nt.add3L(m, _, W);
      r = nt.add3H(j, Y, L, N), s = j | 0;
    }
    ({ h: r, l: s } = nt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = nt.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = nt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = nt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: w } = nt.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: y, l: v } = nt.add(this.Fh | 0, this.Fl | 0, y | 0, v | 0), { h: S, l: I } = nt.add(this.Gh | 0, this.Gl | 0, S | 0, I | 0), { h: U, l: P } = nt.add(this.Hh | 0, this.Hl | 0, U | 0, P | 0), this.set(r, s, o, i, a, c, u, h, d, w, y, v, S, I, U, P);
  }
  roundClean() {
    Jo.fill(0), Qo.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Fx = class extends Jl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, jx = class extends Jl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Rx = class extends Jl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const zx = pi(() => new Jl());
pi(() => new Fx());
pi(() => new jx());
pi(() => new Rx());
function tw(e) {
  return ea(e);
}
function Gx(e) {
  return zx(e);
}
const Kx = 0;
rn.hmacSha256Sync = (e, ...t) => {
  const n = Wl.create(ea, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Vx() {
  return He(rn.randomPrivateKey());
}
function Xx(e) {
  const t = ea(ea(e));
  return ax.encode(ho(e, t).slice(0, e.length + 4));
}
function qx(e, t) {
  return Xx(ho(new Uint8Array([e]), t.slice(0, 20)));
}
function nw(e, t = Kx) {
  const n = typeof e == "string" ? At(e) : e, r = yx(tw(n));
  return qx(t, r);
}
function rw(e) {
  const t = Tf(e);
  return He(cc(t.slice(0, 32), !0));
}
rn.hmacSha256Sync = (e, ...t) => {
  const n = Wl.create(ea, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
var bl;
(function(e) {
  e.InvalidFormat = "InvalidFormat", e.IsNotPoint = "IsNotPoint";
})(bl || (bl = {}));
async function Yx(e, t, n) {
  return await (await Wy()).encrypt("aes-256-cbc", t, e, n);
}
async function Wx(e, t, n) {
  return await (await Wy()).decrypt("aes-256-cbc", t, e, n);
}
function ow(e, t) {
  return Wl(ea, e, t);
}
function Zx(e, t) {
  if (e.length !== t.length)
    return !1;
  let n = 0;
  for (let r = 0; r < e.length; r++)
    n |= e[r] ^ t[r];
  return n === 0;
}
function sw(e) {
  const t = Gx(e);
  return {
    encryptionKey: t.slice(0, 32),
    hmacKey: t.slice(32)
  };
}
function Jx(e) {
  return e.match(/^[0-9a-f]+$/i) !== null;
}
function Qx(e) {
  const t = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: bl.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: bl.IsNotPoint
  };
  if (e.length !== 66 && e.length !== 130)
    return t;
  const r = e.slice(0, 2);
  if (e.length === 130 && r !== "04" || e.length === 66 && r !== "02" && r !== "03" || !Jx(e))
    return t;
  try {
    return lt.fromHex(e).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function eS(e, t, n, r) {
  const s = Qx(e);
  if (!s.result)
    throw s;
  const o = rn.randomPrivateKey(), i = cc(o, !0);
  let a = Uf(o, e, !0);
  a = a.slice(1);
  const c = sw(a), u = rn.randomBytes(16), h = await Yx(u, c.encryptionKey, t), d = ho(u, i, h), w = ow(c.hmacKey, d);
  let y;
  if (!r || r === "hex")
    y = He(h);
  else if (r === "base64")
    y = z2(h);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const v = {
    iv: He(u),
    ephemeralPK: He(i),
    cipherText: y,
    mac: He(w),
    wasString: n
  };
  return r && r !== "hex" && (v.cipherTextEncoding = r), v;
}
async function iw(e, t) {
  if (!t.ephemeralPK)
    throw new Lp("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = t.ephemeralPK;
  let r = Uf(e, n, !0);
  r = r.slice(1);
  const s = sw(r), o = At(t.iv);
  let i;
  if (!t.cipherTextEncoding || t.cipherTextEncoding === "hex")
    i = At(t.cipherText);
  else if (t.cipherTextEncoding === "base64")
    i = R2(t.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${t.cipherText}"`);
  const a = ho(o, At(n), i), c = ow(s.hmacKey, a), u = At(t.mac);
  if (!Zx(u, c))
    throw new Lp("Decryption failed: failure in MAC check");
  const h = await Wx(o, s.encryptionKey, i);
  return t.wasString ? ac(h) : h;
}
function tS(e, t) {
  const n = typeof t == "string" ? hi(t) : t, r = rw(e), s = tw(n), o = Zl(s, e);
  return {
    signature: He(o),
    publicKey: r
  };
}
async function nS(e, t) {
  const n = Object.assign({}, t);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = rw(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof e == "string", o = typeof e == "string" ? hi(e) : e, i = await eS(n.publicKey, o, s, n.cipherTextEncoding);
  let a = JSON.stringify(i);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = tS(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function rS(e, t) {
  const n = Object.assign({}, t);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(e);
    return iw(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var Nn = {}, sa = {}, Kn = {};
Object.defineProperty(Kn, "__esModule", { value: !0 });
Kn.decode = Kn.encode = Kn.unescape = Kn.escape = Kn.pad = void 0;
const aw = lc;
function Df(e) {
  return `${e}${"=".repeat(4 - (e.length % 4 || 4))}`;
}
Kn.pad = Df;
function cw(e) {
  return e.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Kn.escape = cw;
function lw(e) {
  return Df(e).replace(/-/g, "+").replace(/_/g, "/");
}
Kn.unescape = lw;
function oS(e) {
  return cw((0, aw.fromByteArray)(new TextEncoder().encode(e)));
}
Kn.encode = oS;
function sS(e) {
  return new TextDecoder().decode((0, aw.toByteArray)(Df(lw(e))));
}
Kn.decode = sS;
var Ql = {}, eu = {}, uw = {}, dw = {}, tu = {};
Object.defineProperty(tu, "__esModule", { value: !0 });
tu.crypto = void 0;
tu.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(e) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(e, "__esModule", { value: !0 }), e.wrapXOFConstructorWithOpts = e.wrapConstructorWithOpts = e.wrapConstructor = e.Hash = e.nextTick = e.swap32IfBE = e.byteSwapIfBE = e.swap8IfBE = e.isLE = void 0, e.isBytes = n, e.anumber = r, e.abytes = s, e.ahash = o, e.aexists = i, e.aoutput = a, e.u8 = c, e.u32 = u, e.clean = h, e.createView = d, e.rotr = w, e.rotl = y, e.byteSwap = v, e.byteSwap32 = S, e.bytesToHex = P, e.hexToBytes = B, e.asyncLoop = Q, e.utf8ToBytes = oe, e.bytesToUtf8 = Y, e.toBytes = m, e.kdfInputToBytes = L, e.concatBytes = _, e.checkOpts = N, e.createHasher = j, e.createOptHasher = ye, e.createXOFer = ce, e.randomBytes = Xe;
  const t = tu;
  function n($) {
    return $ instanceof Uint8Array || ArrayBuffer.isView($) && $.constructor.name === "Uint8Array";
  }
  function r($) {
    if (!Number.isSafeInteger($) || $ < 0)
      throw new Error("positive integer expected, got " + $);
  }
  function s($, ...R) {
    if (!n($))
      throw new Error("Uint8Array expected");
    if (R.length > 0 && !R.includes($.length))
      throw new Error("Uint8Array expected of length " + R + ", got length=" + $.length);
  }
  function o($) {
    if (typeof $ != "function" || typeof $.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r($.outputLen), r($.blockLen);
  }
  function i($, R = !0) {
    if ($.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (R && $.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a($, R) {
    s($);
    const ue = R.outputLen;
    if ($.length < ue)
      throw new Error("digestInto() expects output buffer of length at least " + ue);
  }
  function c($) {
    return new Uint8Array($.buffer, $.byteOffset, $.byteLength);
  }
  function u($) {
    return new Uint32Array($.buffer, $.byteOffset, Math.floor($.byteLength / 4));
  }
  function h(...$) {
    for (let R = 0; R < $.length; R++)
      $[R].fill(0);
  }
  function d($) {
    return new DataView($.buffer, $.byteOffset, $.byteLength);
  }
  function w($, R) {
    return $ << 32 - R | $ >>> R;
  }
  function y($, R) {
    return $ << R | $ >>> 32 - R >>> 0;
  }
  e.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function v($) {
    return $ << 24 & 4278190080 | $ << 8 & 16711680 | $ >>> 8 & 65280 | $ >>> 24 & 255;
  }
  e.swap8IfBE = e.isLE ? ($) => $ : ($) => v($), e.byteSwapIfBE = e.swap8IfBE;
  function S($) {
    for (let R = 0; R < $.length; R++)
      $[R] = v($[R]);
    return $;
  }
  e.swap32IfBE = e.isLE ? ($) => $ : S;
  const I = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", U = /* @__PURE__ */ Array.from({ length: 256 }, ($, R) => R.toString(16).padStart(2, "0"));
  function P($) {
    if (s($), I)
      return $.toHex();
    let R = "";
    for (let ue = 0; ue < $.length; ue++)
      R += U[$[ue]];
    return R;
  }
  const A = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function T($) {
    if ($ >= A._0 && $ <= A._9)
      return $ - A._0;
    if ($ >= A.A && $ <= A.F)
      return $ - (A.A - 10);
    if ($ >= A.a && $ <= A.f)
      return $ - (A.a - 10);
  }
  function B($) {
    if (typeof $ != "string")
      throw new Error("hex string expected, got " + typeof $);
    if (I)
      return Uint8Array.fromHex($);
    const R = $.length, ue = R / 2;
    if (R % 2)
      throw new Error("hex string expected, got unpadded hex of length " + R);
    const me = new Uint8Array(ue);
    for (let _e = 0, ve = 0; _e < ue; _e++, ve += 2) {
      const mt = T($.charCodeAt(ve)), ze = T($.charCodeAt(ve + 1));
      if (mt === void 0 || ze === void 0) {
        const Ne = $[ve] + $[ve + 1];
        throw new Error('hex string expected, got non-hex character "' + Ne + '" at index ' + ve);
      }
      me[_e] = mt * 16 + ze;
    }
    return me;
  }
  const X = async () => {
  };
  e.nextTick = X;
  async function Q($, R, ue) {
    let me = Date.now();
    for (let _e = 0; _e < $; _e++) {
      ue(_e);
      const ve = Date.now() - me;
      ve >= 0 && ve < R || (await (0, e.nextTick)(), me += ve);
    }
  }
  function oe($) {
    if (typeof $ != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode($));
  }
  function Y($) {
    return new TextDecoder().decode($);
  }
  function m($) {
    return typeof $ == "string" && ($ = oe($)), s($), $;
  }
  function L($) {
    return typeof $ == "string" && ($ = oe($)), s($), $;
  }
  function _(...$) {
    let R = 0;
    for (let me = 0; me < $.length; me++) {
      const _e = $[me];
      s(_e), R += _e.length;
    }
    const ue = new Uint8Array(R);
    for (let me = 0, _e = 0; me < $.length; me++) {
      const ve = $[me];
      ue.set(ve, _e), _e += ve.length;
    }
    return ue;
  }
  function N($, R) {
    if (R !== void 0 && {}.toString.call(R) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign($, R);
  }
  class W {
  }
  e.Hash = W;
  function j($) {
    const R = (me) => $().update(m(me)).digest(), ue = $();
    return R.outputLen = ue.outputLen, R.blockLen = ue.blockLen, R.create = () => $(), R;
  }
  function ye($) {
    const R = (me, _e) => $(_e).update(m(me)).digest(), ue = $({});
    return R.outputLen = ue.outputLen, R.blockLen = ue.blockLen, R.create = (me) => $(me), R;
  }
  function ce($) {
    const R = (me, _e) => $(_e).update(m(me)).digest(), ue = $({});
    return R.outputLen = ue.outputLen, R.blockLen = ue.blockLen, R.create = (me) => $(me), R;
  }
  e.wrapConstructor = j, e.wrapConstructorWithOpts = ye, e.wrapXOFConstructorWithOpts = ce;
  function Xe($ = 32) {
    if (t.crypto && typeof t.crypto.getRandomValues == "function")
      return t.crypto.getRandomValues(new Uint8Array($));
    if (t.crypto && typeof t.crypto.randomBytes == "function")
      return Uint8Array.from(t.crypto.randomBytes($));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(dw);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.hmac = e.HMAC = void 0;
  const t = dw;
  class n extends t.Hash {
    constructor(o, i) {
      super(), this.finished = !1, this.destroyed = !1, (0, t.ahash)(o);
      const a = (0, t.toBytes)(i);
      if (this.iHash = o.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, u = new Uint8Array(c);
      u.set(a.length > c ? o.create().update(a).digest() : a);
      for (let h = 0; h < u.length; h++)
        u[h] ^= 54;
      this.iHash.update(u), this.oHash = o.create();
      for (let h = 0; h < u.length; h++)
        u[h] ^= 106;
      this.oHash.update(u), (0, t.clean)(u);
    }
    update(o) {
      return (0, t.aexists)(this), this.iHash.update(o), this;
    }
    digestInto(o) {
      (0, t.aexists)(this), (0, t.abytes)(o, this.outputLen), this.finished = !0, this.iHash.digestInto(o), this.oHash.update(o), this.oHash.digestInto(o), this.destroy();
    }
    digest() {
      const o = new Uint8Array(this.oHash.outputLen);
      return this.digestInto(o), o;
    }
    _cloneInto(o) {
      o || (o = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash: i, iHash: a, finished: c, destroyed: u, blockLen: h, outputLen: d } = this;
      return o = o, o.finished = c, o.destroyed = u, o.blockLen = h, o.outputLen = d, o.oHash = i._cloneInto(o.oHash), o.iHash = a._cloneInto(o.iHash), o;
    }
    clone() {
      return this._cloneInto();
    }
    destroy() {
      this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
    }
  }
  e.HMAC = n;
  const r = (s, o, i) => new n(s, o).update(i).digest();
  e.hmac = r, e.hmac.create = (s, o) => new n(s, o);
})(uw);
const Ui = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function fw(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function kd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error("positive integer expected, got " + e);
}
function gi(e, ...t) {
  if (!fw(e))
    throw new Error("Uint8Array expected");
  if (t.length > 0 && !t.includes(e.length))
    throw new Error("Uint8Array expected of length " + t + ", got length=" + e.length);
}
function iS(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  kd(e.outputLen), kd(e.blockLen);
}
function $d(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function hw(e, t) {
  gi(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function aS(e) {
  return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
}
function cS(e) {
  return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function xl(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
function ol(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function Hr(e, t) {
  return e << 32 - t | e >>> t;
}
function lS(e, t) {
  return e << t | e >>> 32 - t >>> 0;
}
const Ff = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function jf(e) {
  return e << 24 & 4278190080 | e << 8 & 16711680 | e >>> 8 & 65280 | e >>> 24 & 255;
}
const pw = Ff ? (e) => e : (e) => jf(e), uS = pw;
function gw(e) {
  for (let t = 0; t < e.length; t++)
    e[t] = jf(e[t]);
  return e;
}
const dS = Ff ? (e) => e : gw, yw = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", fS = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Rf(e) {
  if (gi(e), yw)
    return e.toHex();
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += fS[e[n]];
  return t;
}
const Co = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function jp(e) {
  if (e >= Co._0 && e <= Co._9)
    return e - Co._0;
  if (e >= Co.A && e <= Co.F)
    return e - (Co.A - 10);
  if (e >= Co.a && e <= Co.f)
    return e - (Co.a - 10);
}
function hS(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  if (yw)
    return Uint8Array.fromHex(e);
  const t = e.length, n = t / 2;
  if (t % 2)
    throw new Error("hex string expected, got unpadded hex of length " + t);
  const r = new Uint8Array(n);
  for (let s = 0, o = 0; s < n; s++, o += 2) {
    const i = jp(e.charCodeAt(o)), a = jp(e.charCodeAt(o + 1));
    if (i === void 0 || a === void 0) {
      const c = e[o] + e[o + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + o);
    }
    r[s] = i * 16 + a;
  }
  return r;
}
const ww = async () => {
};
async function pS(e, t, n) {
  let r = Date.now();
  for (let s = 0; s < e; s++) {
    n(s);
    const o = Date.now() - r;
    o >= 0 && o < t || (await ww(), r += o);
  }
}
function zf(e) {
  if (typeof e != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(e));
}
function gS(e) {
  return new TextDecoder().decode(e);
}
function uc(e) {
  return typeof e == "string" && (e = zf(e)), gi(e), e;
}
function yS(e) {
  return typeof e == "string" && (e = zf(e)), gi(e), e;
}
function wS(...e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const s = e[r];
    gi(s), t += s.length;
  }
  const n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const o = e[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function mS(e, t) {
  if (t !== void 0 && {}.toString.call(t) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(e, t);
}
let mw = class {
};
function nu(e) {
  const t = (r) => e().update(uc(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function bw(e) {
  const t = (r, s) => e(s).update(uc(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
function xw(e) {
  const t = (r, s) => e(s).update(uc(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
const bS = nu, xS = bw, SS = xw;
function vS(e = 32) {
  if (Ui && typeof Ui.getRandomValues == "function")
    return Ui.getRandomValues(new Uint8Array(e));
  if (Ui && typeof Ui.randomBytes == "function")
    return Uint8Array.from(Ui.randomBytes(e));
  throw new Error("crypto.getRandomValues must be defined");
}
const AS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: mw,
  abytes: gi,
  aexists: $d,
  ahash: iS,
  anumber: kd,
  aoutput: hw,
  asyncLoop: pS,
  byteSwap: jf,
  byteSwap32: gw,
  byteSwapIfBE: uS,
  bytesToHex: Rf,
  bytesToUtf8: gS,
  checkOpts: mS,
  clean: xl,
  concatBytes: wS,
  createHasher: nu,
  createOptHasher: bw,
  createView: ol,
  createXOFer: xw,
  hexToBytes: hS,
  isBytes: fw,
  isLE: Ff,
  kdfInputToBytes: yS,
  nextTick: ww,
  randomBytes: vS,
  rotl: lS,
  rotr: Hr,
  swap32IfBE: dS,
  swap8IfBE: pw,
  toBytes: uc,
  u32: cS,
  u8: aS,
  utf8ToBytes: zf,
  wrapConstructor: bS,
  wrapConstructorWithOpts: xS,
  wrapXOFConstructorWithOpts: SS
}, Symbol.toStringTag, { value: "Module" }));
function ES(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
function kS(e, t, n) {
  return e & t ^ ~e & n;
}
function $S(e, t, n) {
  return e & t ^ e & n ^ t & n;
}
class IS extends mw {
  constructor(t, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(t), this.view = ol(this.buffer);
  }
  update(t) {
    $d(this), t = uc(t), gi(t);
    const { view: n, buffer: r, blockLen: s } = this, o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = ol(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    $d(this), hw(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, xl(this.buffer.subarray(i)), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    ES(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = ol(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], o);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return t.destroyed = i, t.finished = o, t.length = s, t.pos = a, s % n && t.buffer.set(r), t;
  }
  clone() {
    return this._cloneInto();
  }
}
const es = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ts = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), LS = /* @__PURE__ */ Uint32Array.from([
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
]), ns = /* @__PURE__ */ new Uint32Array(64);
let Gf = class extends IS {
  constructor(t = 32) {
    super(64, t, 8, !1), this.A = es[0] | 0, this.B = es[1] | 0, this.C = es[2] | 0, this.D = es[3] | 0, this.E = es[4] | 0, this.F = es[5] | 0, this.G = es[6] | 0, this.H = es[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [t, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      ns[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = ns[d - 15], y = ns[d - 2], v = Hr(w, 7) ^ Hr(w, 18) ^ w >>> 3, S = Hr(y, 17) ^ Hr(y, 19) ^ y >>> 10;
      ns[d] = S + ns[d - 7] + v + ns[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = Hr(a, 6) ^ Hr(a, 11) ^ Hr(a, 25), y = h + w + kS(a, c, u) + LS[d] + ns[d] | 0, S = (Hr(r, 2) ^ Hr(r, 13) ^ Hr(r, 22)) + $S(r, s, o) | 0;
      h = u, u = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    xl(ns);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), xl(this.buffer);
  }
}, Sw = class extends Gf {
  constructor() {
    super(28), this.A = ts[0] | 0, this.B = ts[1] | 0, this.C = ts[2] | 0, this.D = ts[3] | 0, this.E = ts[4] | 0, this.F = ts[5] | 0, this.G = ts[6] | 0, this.H = ts[7] | 0;
  }
};
const CS = /* @__PURE__ */ nu(() => new Gf()), TS = /* @__PURE__ */ nu(() => new Sw()), BS = Gf, Kf = CS, MS = Sw, NS = TS, _S = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: MS,
  SHA256: BS,
  sha224: NS,
  sha256: Kf
}, Symbol.toStringTag, { value: "Module" })), ru = /* @__PURE__ */ ql(_S), PS = /* @__PURE__ */ ql(j2);
var ia = {};
Object.defineProperty(ia, "__esModule", { value: !0 });
ia.joseToDer = ia.derToJose = void 0;
const vw = lc, Aw = Kn;
function Hu(e) {
  return (e / 8 | 0) + (e % 8 === 0 ? 0 : 1);
}
const US = {
  ES256: Hu(256),
  ES384: Hu(384),
  ES512: Hu(521)
};
function Ew(e) {
  const t = US[e];
  if (t)
    return t;
  throw new Error(`Unknown algorithm "${e}"`);
}
const Sl = 128, kw = 0, OS = 32, HS = 16, DS = 2, $w = HS | OS | kw << 6, vl = DS | kw << 6;
function Iw(e) {
  if (e instanceof Uint8Array)
    return e;
  if (typeof e == "string")
    return (0, vw.toByteArray)((0, Aw.pad)(e));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function FS(e, t) {
  const n = Iw(e), r = Ew(t), s = r + 1, o = n.length;
  let i = 0;
  if (n[i++] !== $w)
    throw new Error('Could not find expected "seq"');
  let a = n[i++];
  if (a === (Sl | 1) && (a = n[i++]), o - i < a)
    throw new Error(`"seq" specified length of "${a}", only "${o - i}" remaining`);
  if (n[i++] !== vl)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[i++];
  if (o - i - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${o - i - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const u = i;
  if (i += c, n[i++] !== vl)
    throw new Error('Could not find expected "int" for "s"');
  const h = n[i++];
  if (o - i !== h)
    throw new Error(`"s" specified length of "${h}", expected "${o - i}"`);
  if (s < h)
    throw new Error(`"s" specified length of "${h}", max of "${s}" is acceptable`);
  const d = i;
  if (i += h, i !== o)
    throw new Error(`Expected to consume entire array, but "${o - i}" bytes remain`);
  const w = r - c, y = r - h, v = new Uint8Array(w + c + y + h);
  for (i = 0; i < w; ++i)
    v[i] = 0;
  v.set(n.subarray(u + Math.max(-w, 0), u + c), i), i = r;
  for (const S = i; i < S + y; ++i)
    v[i] = 0;
  return v.set(n.subarray(d + Math.max(-y, 0), d + h), i), (0, Aw.escape)((0, vw.fromByteArray)(v));
}
ia.derToJose = FS;
function Rp(e, t, n) {
  let r = 0;
  for (; t + r < n && e[t + r] === 0; )
    ++r;
  return e[t + r] >= Sl && --r, r;
}
function jS(e, t) {
  e = Iw(e);
  const n = Ew(t), r = e.length;
  if (r !== n * 2)
    throw new TypeError(`"${t}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Rp(e, 0, n), o = Rp(e, n, e.length), i = n - s, a = n - o, c = 2 + i + 1 + 1 + a, u = c < Sl, h = new Uint8Array((u ? 2 : 3) + c);
  let d = 0;
  return h[d++] = $w, u ? h[d++] = c : (h[d++] = Sl | 1, h[d++] = c & 255), h[d++] = vl, h[d++] = i, s < 0 ? (h[d++] = 0, h.set(e.subarray(0, n), d), d += n) : (h.set(e.subarray(s, n), d), d += n - s), h[d++] = vl, h[d++] = a, o < 0 ? (h[d++] = 0, h.set(e.subarray(n), d)) : h.set(e.subarray(n + o), d), h;
}
ia.joseToDer = jS;
var Ho = {};
Object.defineProperty(Ho, "__esModule", { value: !0 });
Ho.InvalidTokenError = Ho.MissingParametersError = void 0;
class RS extends Error {
  constructor(t) {
    super(), this.name = "MissingParametersError", this.message = t || "";
  }
}
Ho.MissingParametersError = RS;
class zS extends Error {
  constructor(t) {
    super(), this.name = "InvalidTokenError", this.message = t || "";
  }
}
Ho.InvalidTokenError = zS;
const dc = /* @__PURE__ */ ql(AS);
Object.defineProperty(eu, "__esModule", { value: !0 });
eu.SECP256K1Client = void 0;
const GS = uw, KS = ru, sl = PS, zp = ia, Gp = Ho, Kp = dc;
sl.utils.hmacSha256Sync = (e, ...t) => {
  const n = GS.hmac.create(KS.sha256, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
class Lw {
  static derivePublicKey(t, n = !0) {
    return t.length === 66 && (t = t.slice(0, 64)), t.length < 64 && (t = t.padStart(64, "0")), (0, Kp.bytesToHex)(sl.getPublicKey(t, n));
  }
  static signHash(t, n, r = "jose") {
    if (!t || !n)
      throw new Gp.MissingParametersError("a signing input hash and private key are all required");
    const s = sl.signSync(t, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Kp.bytesToHex)(s);
    if (r === "jose")
      return (0, zp.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(t) {
    return (0, zp.joseToDer)(t, "ES256");
  }
  static verifyHash(t, n, r) {
    if (!t || !n || !r)
      throw new Gp.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return sl.verify(n, t, r, { strict: !1 });
  }
}
eu.SECP256K1Client = Lw;
Lw.algorithmName = "ES256K";
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.cryptoClients = e.SECP256K1Client = void 0;
  const t = eu;
  Object.defineProperty(e, "SECP256K1Client", { enumerable: !0, get: function() {
    return t.SECP256K1Client;
  } });
  const n = {
    ES256K: t.SECP256K1Client
  };
  e.cryptoClients = n;
})(Ql);
var ei = {};
const VS = /* @__PURE__ */ ql(Py);
var XS = Xn && Xn.__awaiter || function(e, t, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
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
      h.done ? o(h.value) : s(h.value).then(a, c);
    }
    u((r = r.apply(e, t || [])).next());
  });
};
Object.defineProperty(ei, "__esModule", { value: !0 });
ei.hashSha256Async = ei.hashSha256 = void 0;
const qS = ru;
function Cw(e) {
  return (0, qS.sha256)(e);
}
ei.hashSha256 = Cw;
function YS(e) {
  return XS(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof e == "string" ? new TextEncoder().encode(e) : e, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = VS;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(e).digest());
      }
    } catch (t) {
      return console.log(t), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Cw(e));
    }
  });
}
ei.hashSha256Async = YS;
var WS = Xn && Xn.__awaiter || function(e, t, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
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
      h.done ? o(h.value) : s(h.value).then(a, c);
    }
    u((r = r.apply(e, t || [])).next());
  });
};
Object.defineProperty(sa, "__esModule", { value: !0 });
sa.TokenSigner = sa.createUnsecuredToken = void 0;
const Id = Kn, Vp = Ql, ZS = Ho, Xp = ei;
function Ld(e, t) {
  const n = [], r = Id.encode(JSON.stringify(t));
  n.push(r);
  const s = Id.encode(JSON.stringify(e));
  return n.push(s), n.join(".");
}
function JS(e) {
  return Ld(e, { typ: "JWT", alg: "none" }) + ".";
}
sa.createUnsecuredToken = JS;
class QS {
  constructor(t, n) {
    if (!(t && n))
      throw new ZS.MissingParametersError("a signing algorithm and private key are required");
    if (typeof t != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (t = t.toUpperCase(), !Vp.cryptoClients.hasOwnProperty(t))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Vp.cryptoClients[t], this.rawPrivateKey = n;
  }
  header(t = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, t);
  }
  sign(t, n = !1, r = {}) {
    const s = this.header(r), o = Ld(t, s), i = (0, Xp.hashSha256)(o);
    return this.createWithSignedHash(t, n, s, o, i);
  }
  signAsync(t, n = !1, r = {}) {
    return WS(this, void 0, void 0, function* () {
      const s = this.header(r), o = Ld(t, s), i = yield (0, Xp.hashSha256Async)(o);
      return this.createWithSignedHash(t, n, s, o, i);
    });
  }
  createWithSignedHash(t, n, r, s, o) {
    const i = this.cryptoClient.signHash(o, this.rawPrivateKey);
    return n ? {
      header: [Id.encode(JSON.stringify(r))],
      payload: JSON.stringify(t),
      signature: [i]
    } : [s, i].join(".");
  }
}
sa.TokenSigner = QS;
var ou = {};
Object.defineProperty(ou, "__esModule", { value: !0 });
ou.TokenVerifier = void 0;
const ev = Kn, qp = Ql, tv = Ho, Tc = ei;
class nv {
  constructor(t, n) {
    if (!(t && n))
      throw new tv.MissingParametersError("a signing algorithm and public key are required");
    if (typeof t != "string")
      throw "signing algorithm parameter must be a string";
    if (t = t.toUpperCase(), !qp.cryptoClients.hasOwnProperty(t))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = qp.cryptoClients[t], this.rawPublicKey = n;
  }
  verify(t) {
    return typeof t == "string" ? this.verifyCompact(t, !1) : typeof t == "object" ? this.verifyExpanded(t, !1) : !1;
  }
  verifyAsync(t) {
    return typeof t == "string" ? this.verifyCompact(t, !0) : typeof t == "object" ? this.verifyExpanded(t, !0) : Promise.resolve(!1);
  }
  verifyCompact(t, n) {
    const r = t.split("."), s = r[0] + "." + r[1], o = (i) => {
      const a = this.cryptoClient.loadSignature(r[2]);
      return this.cryptoClient.verifyHash(i, a, this.rawPublicKey);
    };
    if (n)
      return (0, Tc.hashSha256Async)(s).then((i) => o(i));
    {
      const i = (0, Tc.hashSha256)(s);
      return o(i);
    }
  }
  verifyExpanded(t, n) {
    const r = [t.header.join("."), ev.encode(t.payload)].join(".");
    let s = !0;
    const o = (i) => (t.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(i, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Tc.hashSha256Async)(r).then((i) => o(i));
    {
      const i = (0, Tc.hashSha256)(r);
      return o(i);
    }
  }
}
ou.TokenVerifier = nv;
var su = {};
Object.defineProperty(su, "__esModule", { value: !0 });
su.decodeToken = void 0;
const Bc = Kn;
function rv(e) {
  if (typeof e == "string") {
    const t = e.split("."), n = JSON.parse(Bc.decode(t[0])), r = JSON.parse(Bc.decode(t[1])), s = t[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof e == "object") {
    if (typeof e.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let t = e.payload;
    e.payload[0] !== "{" && (t = Bc.decode(t));
    const n = [];
    return e.header.map((r) => {
      const s = JSON.parse(Bc.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(t),
      signature: e.signature
    };
  }
}
su.decodeToken = rv;
(function(e) {
  var t = Xn && Xn.__createBinding || (Object.create ? function(r, s, o, i) {
    i === void 0 && (i = o);
    var a = Object.getOwnPropertyDescriptor(s, o);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[o];
    } }), Object.defineProperty(r, i, a);
  } : function(r, s, o, i) {
    i === void 0 && (i = o), r[i] = s[o];
  }), n = Xn && Xn.__exportStar || function(r, s) {
    for (var o in r) o !== "default" && !Object.prototype.hasOwnProperty.call(s, o) && t(s, r, o);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), n(sa, e), n(ou, e), n(su, e), n(Ho, e), n(Ql, e);
})(Nn);
function ov(e) {
  return `did:btc-addr:${e}`;
}
function sv(e) {
  const t = e.split(":");
  if (t.length !== 3)
    throw new Ip("Decentralized IDs must have 3 parts");
  if (t[0].toLowerCase() !== "did")
    throw new Ip('Decentralized IDs must start with "did"');
  return t[1].toLowerCase();
}
function Tw(e) {
  if (e)
    return sv(e) === "btc-addr" ? e.split(":")[2] : void 0;
}
const iv = "1.4.0";
function av() {
  return Vx();
}
function cv(e, t, n, r = ky.slice(), s, o = z1().getTime(), i = {}) {
  const a = (y) => {
    const v = Lf("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${y}=undefined])`
    });
    return v == null ? void 0 : v.origin;
  };
  t || (t = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, i, {
    jti: K1(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(o / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: t,
    version: iv,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = Nn.SECP256K1Client.derivePublicKey(e);
  c.public_keys = [u];
  const h = nw(u);
  return c.iss = ov(h), new Nn.TokenSigner("ES256k", e).sign(c);
}
async function Yp(e, t) {
  const n = ac(At(t)), r = JSON.parse(n), s = await iw(e, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function lv(e) {
  const t = Nn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new Nn.TokenVerifier("ES256k", r).verify(e);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function uv(e) {
  const t = Nn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys, r = Tw(t.iss);
  if (n.length === 1) {
    if (nw(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function dv(e) {
  const t = Nn.decodeToken(e).payload;
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
function fv(e) {
  const t = Nn.decodeToken(e).payload;
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
function hv(e) {
  const t = [
    fv(e),
    dv(e),
    lv(e),
    uv(e)
  ];
  return Promise.resolve(t.every((n) => n));
}
const Wp = "1.0.0";
class ks {
  constructor(t) {
    this.version = Wp, this.userData = t.userData, this.transitKey = t.transitKey, this.etags = t.etags ? t.etags : {};
  }
  static fromJSON(t) {
    if (t.version !== Wp)
      throw new bd(`JSON data version ${t.version} not supported by SessionData`);
    const n = {
      coreNode: t.coreNode,
      userData: t.userData,
      transitKey: t.transitKey,
      etags: t.etags
    };
    return new ks(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Bw {
  constructor(t) {
    if (t) {
      const n = new ks(t);
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
class Zp extends Bw {
  constructor(t) {
    super(t), this.sessionData || this.setSessionData(new ks({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new $y("No session data was found.");
    return this.sessionData;
  }
  setSessionData(t) {
    return this.sessionData = t, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new ks({})), !0;
  }
}
class Jp extends Bw {
  constructor(t) {
    if (super(t), t && t.storeOptions && t.storeOptions.localStorageKey && typeof t.storeOptions.localStorageKey == "string" ? this.key = t.storeOptions.localStorageKey : this.key = F1, !localStorage.getItem(this.key)) {
      const r = new ks({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const t = localStorage.getItem(this.key);
    if (!t)
      throw new $y("No session data was found in localStorage");
    const n = JSON.parse(t);
    return ks.fromJSON(n);
  }
  setSessionData(t) {
    return localStorage.setItem(this.key, t.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new ks({})), !0;
  }
}
var qa;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(qa || (qa = {}));
var Al;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Al || (Al = {}));
qa.Mainnet;
var Uo;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Uo || (Uo = {}));
var lo;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(lo || (lo = {}));
Uo.Mainnet;
const Mw = {
  chainId: qa.Mainnet,
  transactionVersion: Uo.Mainnet,
  peerNetworkId: Al.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: lo.MainnetSingleSig,
    multiSig: lo.MainnetMultiSig
  },
  client: { baseUrl: Iy }
}, Cd = {
  chainId: qa.Testnet,
  transactionVersion: Uo.Testnet,
  peerNetworkId: Al.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: lo.TestnetSingleSig,
    multiSig: lo.TestnetMultiSig
  },
  client: { baseUrl: Ly }
}, il = {
  ...Cd,
  addressVersion: { ...Cd.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Cy }
}, pv = {
  ...il,
  addressVersion: { ...il.addressVersion },
  client: { ...il.client }
};
function gv(e) {
  switch (e) {
    case "mainnet":
      return Mw;
    case "testnet":
      return Cd;
    case "devnet":
      return il;
    case "mocknet":
      return pv;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function Nw(e) {
  return typeof e == "string" ? gv(e) : e;
}
var Qp;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Qp || (Qp = {}));
var e0;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(e0 || (e0 = {}));
var Dr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Dr || (Dr = {}));
const Du = ["onChainOnly", "offChainOnly", "any"];
Du[0] + "", Dr.OnChainOnly, Du[1] + "", Dr.OffChainOnly, Du[2] + "", Dr.Any, Dr.OnChainOnly + "", Dr.OnChainOnly, Dr.OffChainOnly + "", Dr.OffChainOnly, Dr.Any + "", Dr.Any;
var t0;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(t0 || (t0 = {}));
var n0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(n0 || (n0 = {}));
var r0;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(r0 || (r0 = {}));
var _o;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(_o || (_o = {}));
var o0;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(o0 || (o0 = {}));
var s0;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(s0 || (s0 = {}));
var i0;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(i0 || (i0 = {}));
var a0;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(a0 || (a0 = {}));
var c0;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(c0 || (c0 = {}));
var l0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(l0 || (l0 = {}));
var u0;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(u0 || (u0 = {}));
var d0;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(d0 || (d0 = {}));
var f0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(f0 || (f0 = {}));
function Td(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function yv(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function _w(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function wv(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Td(e.outputLen), Td(e.blockLen);
}
function mv(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function bv(e, t) {
  _w(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const js = {
  number: Td,
  bool: yv,
  bytes: _w,
  hash: wv,
  exists: mv,
  output: bv
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Fu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), no = (e, t) => e << 32 - t | e >>> t, xv = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!xv)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Sv(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Vf(e) {
  if (typeof e == "string" && (e = Sv(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Pw = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function yi(e) {
  const t = (r) => e().update(Vf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Uw = class extends Pw {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, js.hash(t);
    const r = Vf(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, o = new Uint8Array(s);
    o.set(r.length > s ? t.create().update(r).digest() : r);
    for (let i = 0; i < o.length; i++)
      o[i] ^= 54;
    this.iHash.update(o), this.oHash = t.create();
    for (let i = 0; i < o.length; i++)
      o[i] ^= 106;
    this.oHash.update(o), o.fill(0);
  }
  update(t) {
    return js.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    js.exists(this), js.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = s, t.destroyed = o, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Ow = (e, t, n) => new Uw(e, t).update(n).digest();
Ow.create = (e, t) => new Uw(e, t);
function vv(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let Xf = class extends Pw {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Fu(this.buffer);
  }
  update(t) {
    js.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = Vf(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Fu(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    js.exists(this), js.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    vv(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Fu(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], o);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return t.length = s, t.pos = a, t.finished = o, t.destroyed = i, s % n && t.buffer.set(r), t;
  }
};
const Av = (e, t, n) => e & t ^ ~e & n, Ev = (e, t, n) => e & t ^ e & n ^ t & n, kv = new Uint32Array([
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
]), rs = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), os = new Uint32Array(64);
let Hw = class extends Xf {
  constructor() {
    super(64, 32, 8, !1), this.A = rs[0] | 0, this.B = rs[1] | 0, this.C = rs[2] | 0, this.D = rs[3] | 0, this.E = rs[4] | 0, this.F = rs[5] | 0, this.G = rs[6] | 0, this.H = rs[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [t, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      os[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = os[d - 15], y = os[d - 2], v = no(w, 7) ^ no(w, 18) ^ w >>> 3, S = no(y, 17) ^ no(y, 19) ^ y >>> 10;
      os[d] = S + os[d - 7] + v + os[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = no(a, 6) ^ no(a, 11) ^ no(a, 25), y = h + w + Av(a, c, u) + kv[d] + os[d] | 0, S = (no(r, 2) ^ no(r, 13) ^ no(r, 22)) + Ev(r, s, o) | 0;
      h = u, u = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    os.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, $v = class extends Hw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Dw = yi(() => new Hw());
yi(() => new $v());
var wi = {}, qf = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32decode = e.c32normalize = e.c32encode = e.c32 = void 0;
  const t = dc;
  e.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(i, a) {
    if (!i.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    i.length % 2 !== 0 && (i = `0${i}`), i = i.toLowerCase();
    let c = [], u = 0;
    for (let y = i.length - 1; y >= 0; y--)
      if (u < 4) {
        const v = n.indexOf(i[y]) >> u;
        let S = 0;
        y !== 0 && (S = n.indexOf(i[y - 1]));
        const I = 1 + u, U = S % (1 << I) << 5 - I, P = e.c32[v + U];
        u = I, c.unshift(P);
      } else
        u = 0;
    let h = 0;
    for (let y = 0; y < c.length && c[y] === "0"; y++)
      h++;
    c = c.slice(h);
    const d = new TextDecoder().decode((0, t.hexToBytes)(i)).match(/^\u0000*/), w = d ? d[0].length : 0;
    for (let y = 0; y < w; y++)
      c.unshift(e.c32[0]);
    if (a) {
      const y = a - c.length;
      for (let v = 0; v < y; v++)
        c.unshift(e.c32[0]);
    }
    return c.join("");
  }
  e.c32encode = r;
  function s(i) {
    return i.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  e.c32normalize = s;
  function o(i, a) {
    if (i = s(i), !i.match(`^[${e.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const c = i.match(`^${e.c32[0]}*`), u = c ? c[0].length : 0;
    let h = [], d = 0, w = 0;
    for (let S = i.length - 1; S >= 0; S--) {
      w === 4 && (h.unshift(n[d]), w = 0, d = 0);
      const U = (e.c32.indexOf(i[S]) << w) + d, P = n[U % 16];
      if (w += 1, d = U >> 4, d > 1 << w)
        throw new Error("Panic error in decoding.");
      h.unshift(P);
    }
    h.unshift(n[d]), h.length % 2 === 1 && h.unshift("0");
    let y = 0;
    for (let S = 0; S < h.length && h[S] === "0"; S++)
      y++;
    h = h.slice(y - y % 2);
    let v = h.join("");
    for (let S = 0; S < u; S++)
      v = `00${v}`;
    if (a) {
      const S = a * 2 - v.length;
      for (let I = 0; I < S; I += 2)
        v = `00${v}`;
    }
    return v;
  }
  e.c32decode = o;
})(qf);
var ti = {};
Object.defineProperty(ti, "__esModule", { value: !0 });
ti.c32checkDecode = ti.c32checkEncode = void 0;
const h0 = ru, p0 = dc, Ra = qf;
function Fw(e) {
  const t = (0, h0.sha256)((0, h0.sha256)((0, p0.hexToBytes)(e)));
  return (0, p0.bytesToHex)(t.slice(0, 4));
}
function Iv(e, t) {
  if (e < 0 || e >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!t.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  t = t.toLowerCase(), t.length % 2 !== 0 && (t = `0${t}`);
  let n = e.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Fw(`${n}${t}`), s = (0, Ra.c32encode)(`${t}${r}`);
  return `${Ra.c32[e]}${s}`;
}
ti.c32checkEncode = Iv;
function Lv(e) {
  e = (0, Ra.c32normalize)(e);
  const t = (0, Ra.c32decode)(e.slice(1)), n = e[0], r = Ra.c32.indexOf(n), s = t.slice(-8);
  let o = r.toString(16);
  if (o.length === 1 && (o = `0${o}`), Fw(`${o}${t.substring(0, t.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, t.substring(0, t.length - 8)];
}
ti.c32checkDecode = Lv;
var jw = {}, aa = {};
Object.defineProperty(aa, "__esModule", { value: !0 });
aa.decode = aa.encode = void 0;
const El = ru, g0 = dc, Rw = Zy, zw = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function Cv(e, t = "00") {
  const n = typeof e == "string" ? (0, g0.hexToBytes)(e) : e, r = typeof t == "string" ? (0, g0.hexToBytes)(t) : e;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, El.sha256)((0, El.sha256)(new Uint8Array([...r, ...n])));
  return Rw(zw).encode([...r, ...n, ...s.slice(0, 4)]);
}
aa.encode = Cv;
function Tv(e) {
  const t = Rw(zw).decode(e), n = t.slice(0, 1), r = t.slice(1, -4), s = (0, El.sha256)((0, El.sha256)(new Uint8Array([...n, ...r])));
  return t.slice(-4).forEach((o, i) => {
    if (o !== s[i])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
aa.decode = Tv;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32ToB58 = e.b58ToC32 = e.c32addressDecode = e.c32address = e.versions = void 0;
  const t = ti, n = aa, r = dc;
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
  const s = {};
  s[0] = e.versions.mainnet.p2pkh, s[5] = e.versions.mainnet.p2sh, s[111] = e.versions.testnet.p2pkh, s[196] = e.versions.testnet.p2sh;
  const o = {};
  o[e.versions.mainnet.p2pkh] = 0, o[e.versions.mainnet.p2sh] = 5, o[e.versions.testnet.p2pkh] = 111, o[e.versions.testnet.p2sh] = 196;
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
    const w = n.decode(h), y = (0, r.bytesToHex)(w.data), v = parseInt((0, r.bytesToHex)(w.prefix), 16);
    let S;
    return d < 0 ? (S = v, s[v] !== void 0 && (S = s[v])) : S = d, i(S, y);
  }
  e.b58ToC32 = c;
  function u(h, d = -1) {
    const w = a(h), y = w[0], v = w[1];
    let S;
    d < 0 ? (S = y, o[y] !== void 0 && (S = o[y])) : S = d;
    let I = S.toString(16);
    return I.length === 1 && (I = `0${I}`), n.encode(v, I);
  }
  e.c32ToB58 = u;
})(jw);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.b58ToC32 = e.c32ToB58 = e.versions = e.c32normalize = e.c32addressDecode = e.c32address = e.c32checkDecode = e.c32checkEncode = e.c32decode = e.c32encode = void 0;
  const t = qf;
  Object.defineProperty(e, "c32encode", { enumerable: !0, get: function() {
    return t.c32encode;
  } }), Object.defineProperty(e, "c32decode", { enumerable: !0, get: function() {
    return t.c32decode;
  } }), Object.defineProperty(e, "c32normalize", { enumerable: !0, get: function() {
    return t.c32normalize;
  } });
  const n = ti;
  Object.defineProperty(e, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(e, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = jw;
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
})(wi);
function Bv(e, t) {
  switch (t = Nw(t ?? Mw), e) {
    case _o.P2PKH:
      switch (t.transactionVersion) {
        case Uo.Mainnet:
          return lo.MainnetSingleSig;
        case Uo.Testnet:
          return lo.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    case _o.P2SH:
    case _o.P2SHNonSequential:
    case _o.P2WPKH:
    case _o.P2WSH:
    case _o.P2WSHNonSequential:
      switch (t.transactionVersion) {
        case Uo.Mainnet:
          return lo.MainnetMultiSig;
        case Uo.Testnet:
          return lo.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${e}`);
  }
}
const Mv = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Gw = Uint8Array.from({ length: 16 }, (e, t) => t), Nv = Gw.map((e) => (9 * e + 5) % 16);
let Yf = [Gw], Wf = [Nv];
for (let e = 0; e < 4; e++)
  for (let t of [Yf, Wf])
    t.push(t[e].map((n) => Mv[n]));
const Kw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), _v = Yf.map((e, t) => e.map((n) => Kw[t][n])), Pv = Wf.map((e, t) => e.map((n) => Kw[t][n])), Uv = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Ov = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Mc = (e, t) => e << t | e >>> 32 - t;
function y0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Nc = new Uint32Array(16);
let Hv = class extends Xf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: o } = this;
    return [t, n, r, s, o];
  }
  set(t, n, r, s, o) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = o | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      Nc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, w = d;
    for (let y = 0; y < 5; y++) {
      const v = 4 - y, S = Uv[y], I = Ov[y], U = Yf[y], P = Wf[y], A = _v[y], T = Pv[y];
      for (let B = 0; B < 16; B++) {
        const X = Mc(r + y0(y, o, a, u) + Nc[U[B]] + S, A[B]) + d | 0;
        r = d, d = u, u = Mc(a, 10) | 0, a = o, o = X;
      }
      for (let B = 0; B < 16; B++) {
        const X = Mc(s + y0(v, i, c, h) + Nc[P[B]] + I, T[B]) + w | 0;
        s = w, w = h, h = Mc(c, 10) | 0, c = i, i = X;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + w | 0, this.h3 + d + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Nc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Dv = yi(() => new Hv()), _c = BigInt(2 ** 32 - 1), Bd = BigInt(32);
function Vw(e, t = !1) {
  return t ? { h: Number(e & _c), l: Number(e >> Bd & _c) } : { h: Number(e >> Bd & _c) | 0, l: Number(e & _c) | 0 };
}
function Fv(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = Vw(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const jv = (e, t) => BigInt(e >>> 0) << Bd | BigInt(t >>> 0), Rv = (e, t, n) => e >>> n, zv = (e, t, n) => e << 32 - n | t >>> n, Gv = (e, t, n) => e >>> n | t << 32 - n, Kv = (e, t, n) => e << 32 - n | t >>> n, Vv = (e, t, n) => e << 64 - n | t >>> n - 32, Xv = (e, t, n) => e >>> n - 32 | t << 64 - n, qv = (e, t) => t, Yv = (e, t) => e, Wv = (e, t, n) => e << n | t >>> 32 - n, Zv = (e, t, n) => t << n | e >>> 32 - n, Jv = (e, t, n) => t << n - 32 | e >>> 64 - n, Qv = (e, t, n) => e << n - 32 | t >>> 64 - n;
function eA(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const tA = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), nA = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, rA = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), oA = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, sA = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), iA = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, rt = {
  fromBig: Vw,
  split: Fv,
  toBig: jv,
  shrSH: Rv,
  shrSL: zv,
  rotrSH: Gv,
  rotrSL: Kv,
  rotrBH: Vv,
  rotrBL: Xv,
  rotr32H: qv,
  rotr32L: Yv,
  rotlSH: Wv,
  rotlSL: Zv,
  rotlBH: Jv,
  rotlBL: Qv,
  add: eA,
  add3L: tA,
  add3H: nA,
  add4L: rA,
  add4H: oA,
  add5H: iA,
  add5L: sA
}, [aA, cA] = rt.split([
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
].map((e) => BigInt(e))), ss = new Uint32Array(80), is = new Uint32Array(80);
let iu = class extends Xf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: w, Gh: y, Gl: v, Hh: S, Hl: I } = this;
    return [t, n, r, s, o, i, a, c, u, h, d, w, y, v, S, I];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, u, h, d, w, y, v, S, I) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = v | 0, this.Hh = S | 0, this.Hl = I | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      ss[A] = t.getUint32(n), is[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = ss[A - 15] | 0, B = is[A - 15] | 0, X = rt.rotrSH(T, B, 1) ^ rt.rotrSH(T, B, 8) ^ rt.shrSH(T, B, 7), Q = rt.rotrSL(T, B, 1) ^ rt.rotrSL(T, B, 8) ^ rt.shrSL(T, B, 7), oe = ss[A - 2] | 0, Y = is[A - 2] | 0, m = rt.rotrSH(oe, Y, 19) ^ rt.rotrBH(oe, Y, 61) ^ rt.shrSH(oe, Y, 6), L = rt.rotrSL(oe, Y, 19) ^ rt.rotrBL(oe, Y, 61) ^ rt.shrSL(oe, Y, 6), _ = rt.add4L(Q, L, is[A - 7], is[A - 16]), N = rt.add4H(_, X, m, ss[A - 7], ss[A - 16]);
      ss[A] = N | 0, is[A] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: w, Fh: y, Fl: v, Gh: S, Gl: I, Hh: U, Hl: P } = this;
    for (let A = 0; A < 80; A++) {
      const T = rt.rotrSH(d, w, 14) ^ rt.rotrSH(d, w, 18) ^ rt.rotrBH(d, w, 41), B = rt.rotrSL(d, w, 14) ^ rt.rotrSL(d, w, 18) ^ rt.rotrBL(d, w, 41), X = d & y ^ ~d & S, Q = w & v ^ ~w & I, oe = rt.add5L(P, B, Q, cA[A], is[A]), Y = rt.add5H(oe, U, T, X, aA[A], ss[A]), m = oe | 0, L = rt.rotrSH(r, s, 28) ^ rt.rotrBH(r, s, 34) ^ rt.rotrBH(r, s, 39), _ = rt.rotrSL(r, s, 28) ^ rt.rotrBL(r, s, 34) ^ rt.rotrBL(r, s, 39), N = r & o ^ r & a ^ o & a, W = s & i ^ s & c ^ i & c;
      U = S | 0, P = I | 0, S = y | 0, I = v | 0, y = d | 0, v = w | 0, { h: d, l: w } = rt.add(u | 0, h | 0, Y | 0, m | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const j = rt.add3L(m, _, W);
      r = rt.add3H(j, Y, L, N), s = j | 0;
    }
    ({ h: r, l: s } = rt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = rt.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = rt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = rt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: w } = rt.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: y, l: v } = rt.add(this.Fh | 0, this.Fl | 0, y | 0, v | 0), { h: S, l: I } = rt.add(this.Gh | 0, this.Gl | 0, S | 0, I | 0), { h: U, l: P } = rt.add(this.Hh | 0, this.Hl | 0, U | 0, P | 0), this.set(r, s, o, i, a, c, u, h, d, w, y, v, S, I, U, P);
  }
  roundClean() {
    ss.fill(0), is.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, lA = class extends iu {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, uA = class extends iu {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, dA = class extends iu {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
yi(() => new iu());
yi(() => new lA());
yi(() => new uA());
yi(() => new dA());
var kl = { exports: {} };
kl.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, o = "[object Arguments]", i = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", h = "[object Function]", d = "[object GeneratorFunction]", w = "[object Map]", y = "[object Number]", v = "[object Object]", S = "[object Promise]", I = "[object RegExp]", U = "[object Set]", P = "[object String]", A = "[object Symbol]", T = "[object WeakMap]", B = "[object ArrayBuffer]", X = "[object DataView]", Q = "[object Float32Array]", oe = "[object Float64Array]", Y = "[object Int8Array]", m = "[object Int16Array]", L = "[object Int32Array]", _ = "[object Uint8Array]", N = "[object Uint8ClampedArray]", W = "[object Uint16Array]", j = "[object Uint32Array]", ye = /[\\^$.*+?()[\]{}|]/g, ce = /\w*$/, Xe = /^\[object .+?Constructor\]$/, $ = /^(?:0|[1-9]\d*)$/, R = {};
  R[o] = R[i] = R[B] = R[X] = R[a] = R[c] = R[Q] = R[oe] = R[Y] = R[m] = R[L] = R[w] = R[y] = R[v] = R[I] = R[U] = R[P] = R[A] = R[_] = R[N] = R[W] = R[j] = !0, R[u] = R[h] = R[T] = !1;
  var ue = typeof Xn == "object" && Xn && Xn.Object === Object && Xn, me = typeof self == "object" && self && self.Object === Object && self, _e = ue || me || Function("return this")(), ve = t && !t.nodeType && t, mt = ve && !0 && e && !e.nodeType && e, ze = mt && mt.exports === ve;
  function Ne(x, M) {
    return x.set(M[0], M[1]), x;
  }
  function Pe(x, M) {
    return x.add(M), x;
  }
  function _n(x, M) {
    for (var G = -1, be = x ? x.length : 0; ++G < be && M(x[G], G, x) !== !1; )
      ;
    return x;
  }
  function En(x, M) {
    for (var G = -1, be = M.length, Te = x.length; ++G < be; )
      x[Te + G] = M[G];
    return x;
  }
  function gt(x, M, G, be) {
    for (var Te = -1, wn = x ? x.length : 0; ++Te < wn; )
      G = M(G, x[Te], Te, x);
    return G;
  }
  function Ct(x, M) {
    for (var G = -1, be = Array(x); ++G < x; )
      be[G] = M(G);
    return be;
  }
  function Ht(x, M) {
    return x == null ? void 0 : x[M];
  }
  function z(x) {
    var M = !1;
    if (x != null && typeof x.toString != "function")
      try {
        M = !!(x + "");
      } catch {
      }
    return M;
  }
  function O(x) {
    var M = -1, G = Array(x.size);
    return x.forEach(function(be, Te) {
      G[++M] = [Te, be];
    }), G;
  }
  function ee(x, M) {
    return function(G) {
      return x(M(G));
    };
  }
  function re(x) {
    var M = -1, G = Array(x.size);
    return x.forEach(function(be) {
      G[++M] = be;
    }), G;
  }
  var le = Array.prototype, xt = Function.prototype, De = Object.prototype, Fe = _e["__core-js_shared__"], Mt = function() {
    var x = /[^.]+$/.exec(Fe && Fe.keys && Fe.keys.IE_PROTO || "");
    return x ? "Symbol(src)_1." + x : "";
  }(), je = xt.toString, Ee = De.hasOwnProperty, et = De.toString, Ye = RegExp(
    "^" + je.call(Ee).replace(ye, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Ze = ze ? _e.Buffer : void 0, zt = _e.Symbol, un = _e.Uint8Array, Yn = ee(Object.getPrototypeOf, Object), hn = Object.create, Nt = De.propertyIsEnumerable, Wn = le.splice, zn = Object.getOwnPropertySymbols, Zr = Ze ? Ze.isBuffer : void 0, Br = ee(Object.keys, Object), kn = Qn(_e, "DataView"), $n = Qn(_e, "Map"), Rt = Qn(_e, "Promise"), pn = Qn(_e, "Set"), Re = Qn(_e, "WeakMap"), on = Qn(Object, "create"), mo = er(kn), Jr = er($n), E = er(Rt), H = er(pn), V = er(Re), D = zt ? zt.prototype : void 0, J = D ? D.valueOf : void 0;
  function se(x) {
    var M = -1, G = x ? x.length : 0;
    for (this.clear(); ++M < G; ) {
      var be = x[M];
      this.set(be[0], be[1]);
    }
  }
  function Le() {
    this.__data__ = on ? on(null) : {};
  }
  function Ae(x) {
    return this.has(x) && delete this.__data__[x];
  }
  function Ge(x) {
    var M = this.__data__;
    if (on) {
      var G = M[x];
      return G === r ? void 0 : G;
    }
    return Ee.call(M, x) ? M[x] : void 0;
  }
  function Tt(x) {
    var M = this.__data__;
    return on ? M[x] !== void 0 : Ee.call(M, x);
  }
  function We(x, M) {
    var G = this.__data__;
    return G[x] = on && M === void 0 ? r : M, this;
  }
  se.prototype.clear = Le, se.prototype.delete = Ae, se.prototype.get = Ge, se.prototype.has = Tt, se.prototype.set = We;
  function ft(x) {
    var M = -1, G = x ? x.length : 0;
    for (this.clear(); ++M < G; ) {
      var be = x[M];
      this.set(be[0], be[1]);
    }
  }
  function St() {
    this.__data__ = [];
  }
  function yt(x) {
    var M = this.__data__, G = bo(M, x);
    if (G < 0)
      return !1;
    var be = M.length - 1;
    return G == be ? M.pop() : Wn.call(M, G, 1), !0;
  }
  function _t(x) {
    var M = this.__data__, G = bo(M, x);
    return G < 0 ? void 0 : M[G][1];
  }
  function C(x) {
    return bo(this.__data__, x) > -1;
  }
  function $e(x, M) {
    var G = this.__data__, be = bo(G, x);
    return be < 0 ? G.push([x, M]) : G[be][1] = M, this;
  }
  ft.prototype.clear = St, ft.prototype.delete = yt, ft.prototype.get = _t, ft.prototype.has = C, ft.prototype.set = $e;
  function Ve(x) {
    var M = -1, G = x ? x.length : 0;
    for (this.clear(); ++M < G; ) {
      var be = x[M];
      this.set(be[0], be[1]);
    }
  }
  function Mr() {
    this.__data__ = {
      hash: new se(),
      map: new ($n || ft)(),
      string: new se()
    };
  }
  function Nr(x) {
    return Er(this, x).delete(x);
  }
  function ut(x) {
    return Er(this, x).get(x);
  }
  function Jt(x) {
    return Er(this, x).has(x);
  }
  function vi(x, M) {
    return Er(this, x).set(x, M), this;
  }
  Ve.prototype.clear = Mr, Ve.prototype.delete = Nr, Ve.prototype.get = ut, Ve.prototype.has = Jt, Ve.prototype.set = vi;
  function Sr(x) {
    this.__data__ = new ft(x);
  }
  function jo() {
    this.__data__ = new ft();
  }
  function Zn(x) {
    return this.__data__.delete(x);
  }
  function Jn(x) {
    return this.__data__.get(x);
  }
  function gn(x) {
    return this.__data__.has(x);
  }
  function _r(x, M) {
    var G = this.__data__;
    if (G instanceof ft) {
      var be = G.__data__;
      if (!$n || be.length < n - 1)
        return be.push([x, M]), this;
      G = this.__data__ = new Ve(be);
    }
    return G.set(x, M), this;
  }
  Sr.prototype.clear = jo, Sr.prototype.delete = Zn, Sr.prototype.get = Jn, Sr.prototype.has = gn, Sr.prototype.set = _r;
  function Ts(x, M) {
    var G = Ps(x) || _s(x) ? Ct(x.length, String) : [], be = G.length, Te = !!be;
    for (var wn in x)
      Ee.call(x, wn) && !(Te && (wn == "length" || Aa(wn, be))) && G.push(wn);
    return G;
  }
  function ht(x, M, G) {
    var be = x[M];
    (!(Ee.call(x, M) && $o(be, G)) || G === void 0 && !(M in x)) && (x[M] = G);
  }
  function bo(x, M) {
    for (var G = x.length; G--; )
      if ($o(x[G][0], M))
        return G;
    return -1;
  }
  function Ai(x, M) {
    return x && Ar(M, xe(M), x);
  }
  function xo(x, M, G, be, Te, wn, Ur) {
    var Un;
    if (be && (Un = wn ? be(x, Te, wn, Ur) : be(x)), Un !== void 0)
      return Un;
    if (!q(x))
      return x;
    var gc = Ps(x);
    if (gc) {
      if (Un = Cn(x), !M)
        return Ns(x, Un);
    } else {
      var Go = Pr(x), yc = Go == h || Go == d;
      if (K(x))
        return Bs(x, M);
      if (Go == v || Go == o || yc && !wn) {
        if (z(x))
          return wn ? x : {};
        if (Un = Qr(yc ? {} : x), !M)
          return $i(x, Ai(Un, x));
      } else {
        if (!R[Go])
          return wn ? x : {};
        Un = Ii(x, Go, xo, M);
      }
    }
    Ur || (Ur = new Sr());
    var wc = Ur.get(x);
    if (wc)
      return wc;
    if (Ur.set(x, Un), !gc)
      var mc = G ? yn(x) : xe(x);
    return _n(mc || x, function(Us, ar) {
      mc && (ar = Us, Us = x[ar]), ht(Un, ar, xo(Us, M, G, be, ar, x, Ur));
    }), Un;
  }
  function Ei(x) {
    return q(x) ? hn(x) : {};
  }
  function In(x, M, G) {
    var be = M(x);
    return Ps(x) ? be : En(be, G(x));
  }
  function Ro(x) {
    return et.call(x);
  }
  function So(x) {
    if (!q(x) || eo(x))
      return !1;
    var M = te(x) || z(x) ? Ye : Xe;
    return M.test(er(x));
  }
  function ki(x) {
    if (!ko(x))
      return Br(x);
    var M = [];
    for (var G in Object(x))
      Ee.call(x, G) && G != "constructor" && M.push(G);
    return M;
  }
  function Bs(x, M) {
    if (M)
      return x.slice();
    var G = new x.constructor(x.length);
    return x.copy(G), G;
  }
  function vo(x) {
    var M = new x.constructor(x.byteLength);
    return new un(M).set(new un(x)), M;
  }
  function Ln(x, M) {
    var G = M ? vo(x.buffer) : x.buffer;
    return new x.constructor(G, x.byteOffset, x.byteLength);
  }
  function Pn(x, M, G) {
    var be = M ? G(O(x), !0) : O(x);
    return gt(be, Ne, new x.constructor());
  }
  function zo(x) {
    var M = new x.constructor(x.source, ce.exec(x));
    return M.lastIndex = x.lastIndex, M;
  }
  function vr(x, M, G) {
    var be = M ? G(re(x), !0) : re(x);
    return gt(be, Pe, new x.constructor());
  }
  function Ms(x) {
    return J ? Object(J.call(x)) : {};
  }
  function Ao(x, M) {
    var G = M ? vo(x.buffer) : x.buffer;
    return new x.constructor(G, x.byteOffset, x.length);
  }
  function Ns(x, M) {
    var G = -1, be = x.length;
    for (M || (M = Array(be)); ++G < be; )
      M[G] = x[G];
    return M;
  }
  function Ar(x, M, G, be) {
    G || (G = {});
    for (var Te = -1, wn = M.length; ++Te < wn; ) {
      var Ur = M[Te], Un = void 0;
      ht(G, Ur, Un === void 0 ? x[Ur] : Un);
    }
    return G;
  }
  function $i(x, M) {
    return Ar(x, qt(x), M);
  }
  function yn(x) {
    return In(x, xe, qt);
  }
  function Er(x, M) {
    var G = x.__data__;
    return Eo(M) ? G[typeof M == "string" ? "string" : "hash"] : G.map;
  }
  function Qn(x, M) {
    var G = Ht(x, M);
    return So(G) ? G : void 0;
  }
  var qt = zn ? ee(zn, Object) : Me, Pr = Ro;
  (kn && Pr(new kn(new ArrayBuffer(1))) != X || $n && Pr(new $n()) != w || Rt && Pr(Rt.resolve()) != S || pn && Pr(new pn()) != U || Re && Pr(new Re()) != T) && (Pr = function(x) {
    var M = et.call(x), G = M == v ? x.constructor : void 0, be = G ? er(G) : void 0;
    if (be)
      switch (be) {
        case mo:
          return X;
        case Jr:
          return w;
        case E:
          return S;
        case H:
          return U;
        case V:
          return T;
      }
    return M;
  });
  function Cn(x) {
    var M = x.length, G = x.constructor(M);
    return M && typeof x[0] == "string" && Ee.call(x, "index") && (G.index = x.index, G.input = x.input), G;
  }
  function Qr(x) {
    return typeof x.constructor == "function" && !ko(x) ? Ei(Yn(x)) : {};
  }
  function Ii(x, M, G, be) {
    var Te = x.constructor;
    switch (M) {
      case B:
        return vo(x);
      case a:
      case c:
        return new Te(+x);
      case X:
        return Ln(x, be);
      case Q:
      case oe:
      case Y:
      case m:
      case L:
      case _:
      case N:
      case W:
      case j:
        return Ao(x, be);
      case w:
        return Pn(x, be, G);
      case y:
      case P:
        return new Te(x);
      case I:
        return zo(x);
      case U:
        return vr(x, be, G);
      case A:
        return Ms(x);
    }
  }
  function Aa(x, M) {
    return M = M ?? s, !!M && (typeof x == "number" || $.test(x)) && x > -1 && x % 1 == 0 && x < M;
  }
  function Eo(x) {
    var M = typeof x;
    return M == "string" || M == "number" || M == "symbol" || M == "boolean" ? x !== "__proto__" : x === null;
  }
  function eo(x) {
    return !!Mt && Mt in x;
  }
  function ko(x) {
    var M = x && x.constructor, G = typeof M == "function" && M.prototype || De;
    return x === G;
  }
  function er(x) {
    if (x != null) {
      try {
        return je.call(x);
      } catch {
      }
      try {
        return x + "";
      } catch {
      }
    }
    return "";
  }
  function Li(x) {
    return xo(x, !0, !0);
  }
  function $o(x, M) {
    return x === M || x !== x && M !== M;
  }
  function _s(x) {
    return k(x) && Ee.call(x, "callee") && (!Nt.call(x, "callee") || et.call(x) == o);
  }
  var Ps = Array.isArray;
  function b(x) {
    return x != null && Be(x.length) && !te(x);
  }
  function k(x) {
    return ke(x) && b(x);
  }
  var K = Zr || tt;
  function te(x) {
    var M = q(x) ? et.call(x) : "";
    return M == h || M == d;
  }
  function Be(x) {
    return typeof x == "number" && x > -1 && x % 1 == 0 && x <= s;
  }
  function q(x) {
    var M = typeof x;
    return !!x && (M == "object" || M == "function");
  }
  function ke(x) {
    return !!x && typeof x == "object";
  }
  function xe(x) {
    return b(x) ? Ts(x) : ki(x);
  }
  function Me() {
    return [];
  }
  function tt() {
    return !1;
  }
  e.exports = Li;
})(kl, kl.exports);
var fA = kl.exports;
const Xw = /* @__PURE__ */ Sy(fA);
var Md;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Md || (Md = {}));
function hA(e, t) {
  return { type: Md.Address, version: e, hash160: t };
}
function pA(e) {
  return wi.c32address(e.version, e.hash160);
}
const gA = (e) => Dv(Dw(e)), yA = (e) => He(gA(e));
rn.hmacSha256Sync = (e, ...t) => {
  const n = Ow.create(Dw, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function wA(e, t = "mainnet") {
  t = Nw(t), e = typeof e == "string" ? At(e) : e;
  const n = Bv(_o.P2PKH, t), r = hA(n, yA(e));
  return pA(r);
}
function mA(e, t) {
  const n = Nn.decodeToken(e), r = n.payload;
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
  const s = r.issuer.publicKey, o = wA(s);
  if (t !== s) {
    if (t !== o) throw new Error("Token issuer public key does not match the verifying value");
  }
  const i = new Nn.TokenVerifier(n.header.alg, s);
  if (!i)
    throw new Error("Invalid token verifier");
  if (!i.verify(e))
    throw new Error("Token verification failed");
  return n;
}
function bA(e, t = null) {
  let n;
  t ? n = mA(e, t) : n = Nn.decodeToken(e);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const w0 = "_blockstackDidCheckEchoReply", xA = "echoReply", SA = "authContinuation";
function vA(e) {
  return e ? (/^[?#]/.test(e) ? e.slice(1) : e).split("&").reduce((n, r) => {
    const [s, o] = r.split("=");
    return n[s] = o ? decodeURIComponent(o.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function AA() {
  let e;
  if (typeof self < "u")
    e = self;
  else if (typeof window < "u")
    e = window;
  else
    return !1;
  if (!e.location || !e.localStorage)
    return !1;
  const t = e[w0];
  if (typeof t == "boolean")
    return t;
  const n = vA(e.location.search), r = n[xA];
  if (r) {
    e[w0] = !0;
    const s = `echo-reply-${r}`;
    return e.localStorage.setItem(s, "success"), e.setTimeout(() => {
      const o = n[SA];
      e.location.href = o;
    }, 10), !0;
  }
  return !1;
}
class Nd {
  constructor(t) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), t && t.appConfig)
      this.appConfig = t.appConfig;
    else if (n)
      this.appConfig = new Ty();
    else
      throw new R1("You need to specify options.appConfig");
    t && t.sessionStore ? this.store = t.sessionStore : n ? t ? this.store = new Jp(t.sessionOptions) : this.store = new Jp() : t ? this.store = new Zp(t.sessionOptions) : this.store = new Zp();
  }
  makeAuthRequestToken(t, n, r, s, o, i = G1().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new bd("Missing AppConfig");
    return t = t || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, o = o || c.appDomain, cv(t, n, r, s, o, i, a);
  }
  generateAndStoreTransitKey() {
    const t = this.store.getSessionData(), n = av();
    return t.transitKey = n, this.store.setSessionData(t), n;
  }
  getAuthResponseToken() {
    var r;
    const t = (r = Lf("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(t).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (AA())
        return zi.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (t) {
      zi.error(`Error checking for protocol echo reply isSignInPending: ${t}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(t = this.getAuthResponseToken(), n = h2()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new vc("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const o = Nn.decodeToken(t).payload;
    if (typeof o == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await hv(t))
      throw new vc("Invalid authentication response.");
    let a = o.private_key, c = o.core_token;
    if (_u(o.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (o.private_key !== void 0 && o.private_key !== null)
          try {
            a = await Yp(s, o.private_key);
          } catch {
            if (zi.warn("Failed decryption of appPrivateKey, will try to use as given"), !rn.isValidPrivateKey(o.private_key))
              throw new vc("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Yp(s, c);
          } catch {
            zi.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new vc("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = n2, h;
    _u(o.version, "1.2.0") && o.hubUrl !== null && o.hubUrl !== void 0 && (u = o.hubUrl), _u(o.version, "1.3.0") && o.associationToken !== null && o.associationToken !== void 0 && (h = o.associationToken);
    const d = {
      profile: o.profile,
      email: o.email,
      decentralizedID: o.iss,
      identityAddress: Tw(o.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: t,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: o.appPrivateKeyFromWalletSalt,
      coreNode: o.blockstackAPIUrl,
      gaiaAssociationToken: h
    }, w = o.profile_url;
    if (!d.profile && w) {
      const y = await n(w);
      if (!y.ok)
        d.profile = Object.assign({}, D1);
      else {
        const v = await y.text(), S = JSON.parse(v);
        d.profile = bA(S[0].token);
      }
    } else
      d.profile = o.profile;
    return r.userData = d, this.store.setSessionData(r), d;
  }
  loadUserData() {
    const t = this.store.getSessionData().userData;
    if (!t)
      throw new bd("No user data found. Did the user sign in?");
    return t;
  }
  encryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), nS(t, r);
  }
  decryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), rS(t, r);
  }
  signUserOut(t) {
    this.store.deleteSessionData(), t && typeof location < "u" && location.href && (location.href = t);
  }
}
Nd.prototype.makeAuthRequest = Nd.prototype.makeAuthRequestToken;
const EA = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], kA = (e = []) => {
  if (typeof window > "u")
    return [];
  const t = EA(), n = e.filter((r) => t.find((o) => o.id === r.id) ? !1 : !!au(r.id));
  return t.concat(n);
}, au = (e) => e == null ? void 0 : e.split(".").reduce((t, n) => t == null ? void 0 : t[n], window), qw = "STX_PROVIDER", ni = () => typeof window > "u" ? null : window.localStorage.getItem(qw), $A = (e) => {
  typeof window < "u" && window.localStorage.setItem(qw, e);
}, IA = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function LA(e, t) {
  const n = {};
  return Object.assign(n, IA, t), await fetch(e, n);
}
function CA(e) {
  let t = LA, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function TA(...e) {
  const { fetchLib: t, middlewares: n } = CA(e);
  return async (s, o) => {
    let i = { url: s, init: o ?? {} };
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
var ca;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(ca || (ca = {}));
var ri;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(ri || (ri = {}));
var m0;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(m0 || (m0 = {}));
const BA = "https://api.mainnet.hiro.so", MA = "https://api.testnet.hiro.so", NA = "http://localhost:3999", _A = ["mainnet", "testnet", "devnet", "mocknet"];
class oi {
  constructor(t) {
    this.version = ri.Mainnet, this.chainId = ca.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === ri.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? TA();
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
oi.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new _d();
    case "testnet":
      return new Pd();
    case "devnet":
      return new PA();
    case "mocknet":
      return new Yw();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${_A.join(", ")}`);
  }
};
oi.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : oi.fromName(e);
class _d extends oi {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? BA,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = ri.Mainnet, this.chainId = ca.Mainnet;
  }
}
class Pd extends oi {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? MA,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = ri.Testnet, this.chainId = ca.Testnet;
  }
}
class Yw extends oi {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? NA,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = ri.Testnet, this.chainId = ca.Testnet;
  }
}
const PA = Yw;
var si;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(si || (si = {}));
var $l;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})($l || ($l = {}));
si.Mainnet;
var ii;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(ii || (ii = {}));
var ai;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ai || (ai = {}));
ii.Mainnet;
const UA = {
  chainId: si.Mainnet,
  transactionVersion: ii.Mainnet,
  peerNetworkId: $l.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: ai.MainnetSingleSig,
    multiSig: ai.MainnetMultiSig
  },
  client: { baseUrl: Iy }
}, Ud = {
  chainId: si.Testnet,
  transactionVersion: ii.Testnet,
  peerNetworkId: $l.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: ai.TestnetSingleSig,
    multiSig: ai.TestnetMultiSig
  },
  client: { baseUrl: Ly }
}, al = {
  ...Ud,
  addressVersion: { ...Ud.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Cy }
}, OA = {
  ...al,
  addressVersion: { ...al.addressVersion },
  client: { ...al.client }
};
function HA(e) {
  switch (e) {
    case "mainnet":
      return UA;
    case "testnet":
      return Ud;
    case "devnet":
      return al;
    case "mocknet":
      return OA;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function DA(e) {
  return typeof e == "string" ? HA(e) : e;
}
function FA(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const b0 = /* @__PURE__ */ new Map();
function Ww(e, t) {
  const n = b0.get(e);
  if (n !== void 0)
    return n(t);
  const r = FA(e);
  return b0.set(e, r), Ww(e, t);
}
let jt = class {
  constructor(t) {
    this.consumed = 0, this.source = typeof t == "string" ? At(t) : t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return l2(this.readBytes(4), 0);
  }
  readUInt8() {
    return a2(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return s2(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = He(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = He(n);
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
    if (Ww(t, r))
      return r;
    throw n(r);
  }
};
const jA = 128, RA = 128, Zw = 16, Xs = 32, Od = 80, cu = 65, zA = 32, GA = 64, Il = 34, KA = 1 + 16 * 1024 * 1024, VA = 165, XA = 16, qA = 16, YA = 20, WA = qA + 2 + YA, ZA = WA + 4, JA = KA + (VA + XA * ZA);
var Lt;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Lt || (Lt = {}));
var Hd;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(Hd || (Hd = {}));
var fr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(fr || (fr = {}));
const ju = ["onChainOnly", "offChainOnly", "any"];
ju[0] + "", fr.OnChainOnly, ju[1] + "", fr.OffChainOnly, ju[2] + "", fr.Any, fr.OnChainOnly + "", fr.OnChainOnly, fr.OffChainOnly + "", fr.OffChainOnly, fr.Any + "", fr.Any;
var Ll;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(Ll || (Ll = {}));
var Kt;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(Kt || (Kt = {}));
var tn;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(tn || (tn = {}));
var Dt;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Dt || (Dt = {}));
var Wt;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Wt || (Wt = {}));
var za;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(za || (za = {}));
var Dd;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(Dd || (Dd = {}));
var Fd;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(Fd || (Fd = {}));
var Vn;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Vn || (Vn = {}));
var x0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(x0 || (x0 = {}));
var jd;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(jd || (jd = {}));
var zr;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(zr || (zr = {}));
var S0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(S0 || (S0 = {}));
let lu = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Gi = class extends lu {
  constructor(t) {
    super(t);
  }
}, Gn = class extends lu {
  constructor(t) {
    super(t);
  }
}, Cl = class extends lu {
  constructor(t) {
    super(t);
  }
}, Rs = class extends lu {
  constructor(t) {
    super(t);
  }
};
function Rd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function QA(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Jw(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function eE(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Rd(e.outputLen), Rd(e.blockLen);
}
function tE(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function nE(e, t) {
  Jw(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const zs = {
  number: Rd,
  bool: QA,
  bytes: Jw,
  hash: eE,
  exists: tE,
  output: nE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ru = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), ro = (e, t) => e << 32 - t | e >>> t, rE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!rE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function oE(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Zf(e) {
  if (typeof e == "string" && (e = oE(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Qw = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function mi(e) {
  const t = (r) => e().update(Zf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let em = class extends Qw {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, zs.hash(t);
    const r = Zf(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, o = new Uint8Array(s);
    o.set(r.length > s ? t.create().update(r).digest() : r);
    for (let i = 0; i < o.length; i++)
      o[i] ^= 54;
    this.iHash.update(o), this.oHash = t.create();
    for (let i = 0; i < o.length; i++)
      o[i] ^= 106;
    this.oHash.update(o), o.fill(0);
  }
  update(t) {
    return zs.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    zs.exists(this), zs.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = s, t.destroyed = o, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const tm = (e, t, n) => new em(e, t).update(n).digest();
tm.create = (e, t) => new em(e, t);
function sE(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let Jf = class extends Qw {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Ru(this.buffer);
  }
  update(t) {
    zs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = Zf(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Ru(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    zs.exists(this), zs.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    sE(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Ru(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], o);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return t.length = s, t.pos = a, t.finished = o, t.destroyed = i, s % n && t.buffer.set(r), t;
  }
};
const iE = (e, t, n) => e & t ^ ~e & n, aE = (e, t, n) => e & t ^ e & n ^ t & n, cE = new Uint32Array([
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
]), as = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), cs = new Uint32Array(64);
let nm = class extends Jf {
  constructor() {
    super(64, 32, 8, !1), this.A = as[0] | 0, this.B = as[1] | 0, this.C = as[2] | 0, this.D = as[3] | 0, this.E = as[4] | 0, this.F = as[5] | 0, this.G = as[6] | 0, this.H = as[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [t, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      cs[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = cs[d - 15], y = cs[d - 2], v = ro(w, 7) ^ ro(w, 18) ^ w >>> 3, S = ro(y, 17) ^ ro(y, 19) ^ y >>> 10;
      cs[d] = S + cs[d - 7] + v + cs[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = ro(a, 6) ^ ro(a, 11) ^ ro(a, 25), y = h + w + iE(a, c, u) + cE[d] + cs[d] | 0, S = (ro(r, 2) ^ ro(r, 13) ^ ro(r, 22)) + aE(r, s, o) | 0;
      h = u, u = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    cs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, lE = class extends nm {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Qf = mi(() => new nm());
mi(() => new lE());
const uE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), rm = Uint8Array.from({ length: 16 }, (e, t) => t), dE = rm.map((e) => (9 * e + 5) % 16);
let eh = [rm], th = [dE];
for (let e = 0; e < 4; e++)
  for (let t of [eh, th])
    t.push(t[e].map((n) => uE[n]));
const om = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), fE = eh.map((e, t) => e.map((n) => om[t][n])), hE = th.map((e, t) => e.map((n) => om[t][n])), pE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), gE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Pc = (e, t) => e << t | e >>> 32 - t;
function v0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Uc = new Uint32Array(16);
let yE = class extends Jf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: o } = this;
    return [t, n, r, s, o];
  }
  set(t, n, r, s, o) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = o | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      Uc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, w = d;
    for (let y = 0; y < 5; y++) {
      const v = 4 - y, S = pE[y], I = gE[y], U = eh[y], P = th[y], A = fE[y], T = hE[y];
      for (let B = 0; B < 16; B++) {
        const X = Pc(r + v0(y, o, a, u) + Uc[U[B]] + S, A[B]) + d | 0;
        r = d, d = u, u = Pc(a, 10) | 0, a = o, o = X;
      }
      for (let B = 0; B < 16; B++) {
        const X = Pc(s + v0(v, i, c, h) + Uc[P[B]] + I, T[B]) + w | 0;
        s = w, w = h, h = Pc(c, 10) | 0, c = i, i = X;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + w | 0, this.h3 + d + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Uc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const wE = mi(() => new yE()), Oc = BigInt(2 ** 32 - 1), zd = BigInt(32);
function sm(e, t = !1) {
  return t ? { h: Number(e & Oc), l: Number(e >> zd & Oc) } : { h: Number(e >> zd & Oc) | 0, l: Number(e & Oc) | 0 };
}
function mE(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = sm(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const bE = (e, t) => BigInt(e >>> 0) << zd | BigInt(t >>> 0), xE = (e, t, n) => e >>> n, SE = (e, t, n) => e << 32 - n | t >>> n, vE = (e, t, n) => e >>> n | t << 32 - n, AE = (e, t, n) => e << 32 - n | t >>> n, EE = (e, t, n) => e << 64 - n | t >>> n - 32, kE = (e, t, n) => e >>> n - 32 | t << 64 - n, $E = (e, t) => t, IE = (e, t) => e, LE = (e, t, n) => e << n | t >>> 32 - n, CE = (e, t, n) => t << n | e >>> 32 - n, TE = (e, t, n) => t << n - 32 | e >>> 64 - n, BE = (e, t, n) => e << n - 32 | t >>> 64 - n;
function ME(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const NE = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), _E = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, PE = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), UE = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, OE = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), HE = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, ot = {
  fromBig: sm,
  split: mE,
  toBig: bE,
  shrSH: xE,
  shrSL: SE,
  rotrSH: vE,
  rotrSL: AE,
  rotrBH: EE,
  rotrBL: kE,
  rotr32H: $E,
  rotr32L: IE,
  rotlSH: LE,
  rotlSL: CE,
  rotlBH: TE,
  rotlBL: BE,
  add: ME,
  add3L: NE,
  add3H: _E,
  add4L: PE,
  add4H: UE,
  add5H: HE,
  add5L: OE
}, [DE, FE] = ot.split([
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
].map((e) => BigInt(e))), ls = new Uint32Array(80), us = new Uint32Array(80);
let uu = class extends Jf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: w, Gh: y, Gl: v, Hh: S, Hl: I } = this;
    return [t, n, r, s, o, i, a, c, u, h, d, w, y, v, S, I];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, u, h, d, w, y, v, S, I) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = v | 0, this.Hh = S | 0, this.Hl = I | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      ls[A] = t.getUint32(n), us[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = ls[A - 15] | 0, B = us[A - 15] | 0, X = ot.rotrSH(T, B, 1) ^ ot.rotrSH(T, B, 8) ^ ot.shrSH(T, B, 7), Q = ot.rotrSL(T, B, 1) ^ ot.rotrSL(T, B, 8) ^ ot.shrSL(T, B, 7), oe = ls[A - 2] | 0, Y = us[A - 2] | 0, m = ot.rotrSH(oe, Y, 19) ^ ot.rotrBH(oe, Y, 61) ^ ot.shrSH(oe, Y, 6), L = ot.rotrSL(oe, Y, 19) ^ ot.rotrBL(oe, Y, 61) ^ ot.shrSL(oe, Y, 6), _ = ot.add4L(Q, L, us[A - 7], us[A - 16]), N = ot.add4H(_, X, m, ls[A - 7], ls[A - 16]);
      ls[A] = N | 0, us[A] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: w, Fh: y, Fl: v, Gh: S, Gl: I, Hh: U, Hl: P } = this;
    for (let A = 0; A < 80; A++) {
      const T = ot.rotrSH(d, w, 14) ^ ot.rotrSH(d, w, 18) ^ ot.rotrBH(d, w, 41), B = ot.rotrSL(d, w, 14) ^ ot.rotrSL(d, w, 18) ^ ot.rotrBL(d, w, 41), X = d & y ^ ~d & S, Q = w & v ^ ~w & I, oe = ot.add5L(P, B, Q, FE[A], us[A]), Y = ot.add5H(oe, U, T, X, DE[A], ls[A]), m = oe | 0, L = ot.rotrSH(r, s, 28) ^ ot.rotrBH(r, s, 34) ^ ot.rotrBH(r, s, 39), _ = ot.rotrSL(r, s, 28) ^ ot.rotrBL(r, s, 34) ^ ot.rotrBL(r, s, 39), N = r & o ^ r & a ^ o & a, W = s & i ^ s & c ^ i & c;
      U = S | 0, P = I | 0, S = y | 0, I = v | 0, y = d | 0, v = w | 0, { h: d, l: w } = ot.add(u | 0, h | 0, Y | 0, m | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const j = ot.add3L(m, _, W);
      r = ot.add3H(j, Y, L, N), s = j | 0;
    }
    ({ h: r, l: s } = ot.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = ot.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = ot.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = ot.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: w } = ot.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: y, l: v } = ot.add(this.Fh | 0, this.Fl | 0, y | 0, v | 0), { h: S, l: I } = ot.add(this.Gh | 0, this.Gl | 0, S | 0, I | 0), { h: U, l: P } = ot.add(this.Hh | 0, this.Hl | 0, U | 0, P | 0), this.set(r, s, o, i, a, c, u, h, d, w, y, v, S, I, U, P);
  }
  roundClean() {
    ls.fill(0), us.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, jE = class extends uu {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, RE = class extends uu {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, zE = class extends uu {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
mi(() => new uu());
mi(() => new jE());
const GE = mi(() => new RE());
mi(() => new zE());
var wt;
(function(e) {
  e.Int = "int", e.UInt = "uint", e.Buffer = "buffer", e.BoolTrue = "true", e.BoolFalse = "false", e.PrincipalStandard = "address", e.PrincipalContract = "contract", e.ResponseOk = "ok", e.ResponseErr = "err", e.OptionalNone = "none", e.OptionalSome = "some", e.List = "list", e.Tuple = "tuple", e.StringASCII = "ascii", e.StringUTF8 = "utf8";
})(wt || (wt = {}));
var fn;
(function(e) {
  e[e.int = 0] = "int", e[e.uint = 1] = "uint", e[e.buffer = 2] = "buffer", e[e.true = 3] = "true", e[e.false = 4] = "false", e[e.address = 5] = "address", e[e.contract = 6] = "contract", e[e.ok = 7] = "ok", e[e.err = 8] = "err", e[e.none = 9] = "none", e[e.some = 10] = "some", e[e.list = 11] = "list", e[e.tuple = 12] = "tuple", e[e.ascii = 13] = "ascii", e[e.utf8 = 14] = "utf8";
})(fn || (fn = {}));
function nh(e) {
  return fn[e];
}
const KE = () => ({ type: wt.BoolTrue }), VE = () => ({ type: wt.BoolFalse }), XE = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: wt.Buffer, value: He(e) };
}, A0 = BigInt("0xffffffffffffffffffffffffffffffff"), qE = BigInt(0), E0 = BigInt("0x7fffffffffffffffffffffffffffffff"), k0 = BigInt("-170141183460469231731687303715884105728"), YE = (e) => {
  typeof e == "string" && e.toLowerCase().startsWith("0x") && (e = Sd(At(e))), ir(e, Uint8Array) && (e = Sd(e));
  const t = Rn(e);
  if (t > E0)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${E0}`);
  if (t < k0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${k0}`);
  return { type: wt.Int, value: t };
}, WE = (e) => {
  const t = Rn(e);
  if (t < qE)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > A0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${A0}`);
  return { type: wt.UInt, value: t };
};
function ZE(e) {
  return { type: wt.List, value: e };
}
function im() {
  return { type: wt.OptionalNone };
}
function am(e) {
  return { type: wt.OptionalSome, value: e };
}
var ge;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(ge || (ge = {}));
function JE() {
  return {
    type: ge.Address,
    version: ai.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function $0(e) {
  if (e && ym(e, Il))
    throw new Error(`Memo exceeds maximum length of ${Il} bytes`);
  return { type: ge.MemoString, content: e };
}
function rh(e, t) {
  return {
    type: ge.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function Gd(e) {
  if (At(e).byteLength != cu)
    throw Error("Invalid signature");
  return {
    type: ge.MessageSignature,
    data: e
  };
}
function QE(e, t, n) {
  return typeof e == "string" && (e = gk(e)), typeof n == "string" && (n = $0(n)), {
    type: ge.Payload,
    payloadType: Lt.TokenTransfer,
    recipient: e,
    amount: Rn(t),
    memo: n ?? $0("")
  };
}
function ek(e, t, n, r) {
  return typeof t == "string" && (t = qr(t)), typeof n == "string" && (n = qr(n)), {
    type: ge.Payload,
    payloadType: Lt.ContractCall,
    contractAddress: typeof e == "string" ? Cs(e) : e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function tk(e) {
  return qr(e, 4, 1e5);
}
function I0(e, t, n) {
  return typeof e == "string" && (e = qr(e)), typeof t == "string" && (t = tk(t)), typeof n == "number" ? {
    type: ge.Payload,
    payloadType: Lt.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: ge.Payload,
    payloadType: Lt.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function nk() {
  return { type: ge.Payload, payloadType: Lt.PoisonMicroblock };
}
function L0(e, t) {
  if (e.byteLength != Xs)
    throw Error(`Coinbase buffer size must be ${Xs} bytes`);
  return t != null ? {
    type: ge.Payload,
    payloadType: Lt.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: ge.Payload,
    payloadType: Lt.Coinbase,
    coinbaseBytes: e
  };
}
function rk(e, t, n) {
  if (e.byteLength != Xs)
    throw Error(`Coinbase buffer size must be ${Xs} bytes`);
  if (n.byteLength != Od)
    throw Error(`VRF proof buffer size must be ${Od} bytes`);
  return {
    type: ge.Payload,
    payloadType: Lt.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === wt.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
function ok(e, t, n, r, s, o, i) {
  return {
    type: ge.Payload,
    payloadType: Lt.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: o,
    publicKeyHash: i
  };
}
function qr(e, t, n) {
  const r = t || 1, s = n || jA;
  if (ym(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ge.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function sk(e, t, n) {
  return {
    type: ge.Asset,
    address: Cs(e),
    contractName: qr(t),
    assetName: qr(n)
  };
}
function Cs(e) {
  const t = wi.c32addressDecode(e);
  return {
    type: ge.Address,
    version: t[0],
    hash160: t[1]
  };
}
function ik(e, t) {
  const n = Cs(e), r = qr(t);
  return {
    type: ge.Principal,
    prefix: Vn.Contract,
    address: n,
    contractName: r
  };
}
function ak(e) {
  const t = Cs(e);
  return {
    type: ge.Principal,
    prefix: Vn.Standard,
    address: t
  };
}
function Ki(e, t) {
  return {
    pubKeyEncoding: e,
    type: ge.TransactionAuthField,
    contents: t
  };
}
function Mo(e) {
  switch (e.type) {
    case ge.Address:
      return fc(e);
    case ge.Principal:
      return cm(e);
    case ge.LengthPrefixedString:
      return ua(e);
    case ge.MemoString:
      return lk(e);
    case ge.Asset:
      return um(e);
    case ge.PostCondition:
      return fm(e);
    case ge.PublicKey:
      return Xd(e);
    case ge.LengthPrefixedList:
      return oh(e);
    case ge.Payload:
      return hm(e);
    case ge.TransactionAuthField:
      return pk(e);
    case ge.MessageSignature:
      return sh(e);
  }
}
function fc(e) {
  const t = [];
  return t.push(At(ic(e.version, 1))), t.push(At(e.hash160)), cn(t);
}
function la(e) {
  const t = ir(e, jt) ? e : new jt(e), n = Yl(He(t.readBytes(1))), r = He(t.readBytes(20));
  return { type: ge.Address, version: n, hash160: r };
}
function cm(e) {
  const t = [];
  return t.push(e.prefix), (e.prefix === Vn.Standard || e.prefix === Vn.Contract) && t.push(fc(e.address)), e.prefix === Vn.Contract && t.push(ua(e.contractName)), cn(t);
}
function ck(e) {
  const t = ir(e, jt) ? e : new jt(e), n = t.readUInt8Enum(Vn, (o) => {
    throw new Gn(`Unexpected Principal payload type: ${o}`);
  });
  if (n === Vn.Origin)
    return { type: ge.Principal, prefix: n };
  const r = la(t);
  if (n === Vn.Standard)
    return { type: ge.Principal, prefix: n, address: r };
  const s = Lr(t);
  return {
    type: ge.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function ua(e) {
  const t = [], n = hi(e.content), r = n.byteLength;
  return t.push(At(ic(r, e.lengthPrefixBytes))), t.push(n), cn(t);
}
function Lr(e, t, n) {
  t = t || 1;
  const r = ir(e, jt) ? e : new jt(e), s = Yl(He(r.readBytes(t))), o = ac(r.readBytes(s));
  return qr(o, t, n ?? 128);
}
function lk(e) {
  const t = [], n = hi(e.content), r = Ok(He(n), Il * 2);
  return t.push(At(r)), cn(t);
}
function lm(e) {
  const t = ir(e, jt) ? e : new jt(e);
  let n = ac(t.readBytes(Il));
  return n = n.replace(/\u0000*$/, ""), { type: ge.MemoString, content: n };
}
function um(e) {
  const t = [];
  return t.push(fc(e.address)), t.push(ua(e.contractName)), t.push(ua(e.assetName)), cn(t);
}
function Kd(e) {
  const t = ir(e, jt) ? e : new jt(e);
  return {
    type: ge.Asset,
    address: la(t),
    contractName: Lr(t),
    assetName: Lr(t)
  };
}
function oh(e) {
  const t = e.values, n = [];
  n.push(At(ic(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(Mo(r));
  return cn(n);
}
function dm(e, t, n) {
  const r = ir(e, jt) ? e : new jt(e), s = Yl(He(r.readBytes(4))), o = [];
  for (let i = 0; i < s; i++)
    switch (t) {
      case ge.Address:
        o.push(la(r));
        break;
      case ge.LengthPrefixedString:
        o.push(Lr(r));
        break;
      case ge.MemoString:
        o.push(lm(r));
        break;
      case ge.Asset:
        o.push(Kd(r));
        break;
      case ge.PostCondition:
        o.push(dk(r));
        break;
      case ge.PublicKey:
        o.push(qd(r));
        break;
      case ge.TransactionAuthField:
        o.push(hk(r));
        break;
    }
  return rh(o, n);
}
function uk(e) {
  return He(fm(e));
}
function fm(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(cm(e.principal)), (e.conditionType === Kt.Fungible || e.conditionType === Kt.NonFungible) && t.push(um(e.asset)), e.conditionType === Kt.NonFungible && t.push(uo(e.assetName)), t.push(e.conditionCode), e.conditionType === Kt.STX || e.conditionType === Kt.Fungible || e.conditionType === Kt.Staking) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new Gi("The post-condition amount may not be larger than 8 bytes");
    t.push(Is(e.amount, 8));
  }
  return cn(t);
}
function dk(e) {
  const t = ir(e, jt) ? e : new jt(e), n = t.readUInt8Enum(Kt, (a) => {
    throw new Gn(`Could not read ${a} as PostConditionType`);
  }), r = ck(t);
  let s, o, i;
  switch (n) {
    case Kt.STX:
      return s = t.readUInt8Enum(za, (c) => {
        throw new Gn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${He(t.readBytes(8))}`), {
        type: ge.PostCondition,
        conditionType: Kt.STX,
        principal: r,
        conditionCode: s,
        amount: i
      };
    case Kt.Fungible:
      return o = Kd(t), s = t.readUInt8Enum(za, (c) => {
        throw new Gn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${He(t.readBytes(8))}`), {
        type: ge.PostCondition,
        conditionType: Kt.Fungible,
        principal: r,
        conditionCode: s,
        amount: i,
        asset: o
      };
    case Kt.NonFungible:
      o = Kd(t);
      const a = ao(t);
      return s = t.readUInt8Enum(Dd, (c) => {
        throw new Gn(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: ge.PostCondition,
        conditionType: Kt.NonFungible,
        principal: r,
        conditionCode: s,
        asset: o,
        assetName: a
      };
    case Kt.Staking:
      return s = t.readUInt8Enum(za, (c) => {
        throw new Gn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${He(t.readBytes(8))}`), {
        type: ge.PostCondition,
        conditionType: Kt.Staking,
        principal: r,
        conditionCode: s,
        amount: i
      };
    case Kt.PoX: {
      const c = t.readUInt8Enum(Fd, (u) => {
        throw new Gn(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: ge.PostCondition,
        conditionType: Kt.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function hm(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case Lt.TokenTransfer:
      t.push(uo(e.recipient)), t.push(Is(e.amount, 8)), t.push(Mo(e.memo));
      break;
    case Lt.ContractCall:
      t.push(Mo(e.contractAddress)), t.push(Mo(e.contractName)), t.push(Mo(e.functionName));
      const n = new Uint8Array(4);
      Zs(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(uo(r));
      });
      break;
    case Lt.SmartContract:
      t.push(Mo(e.contractName)), t.push(Mo(e.codeBody));
      break;
    case Lt.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(Mo(e.contractName)), t.push(Mo(e.codeBody));
      break;
    case Lt.PoisonMicroblock:
      break;
    case Lt.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case Lt.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(uo(e.recipient));
      break;
    case Lt.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(uo(e.recipient ? am(e.recipient) : im())), t.push(e.vrfProof);
      break;
    case Lt.TenureChange:
      t.push(At(e.tenureHash)), t.push(At(e.previousTenureHash)), t.push(At(e.burnViewHash)), t.push(At(e.previousTenureEnd)), t.push(Zs(new Uint8Array(4), e.previousTenureBlocks)), t.push(c2(new Uint8Array(1), e.cause)), t.push(At(e.publicKeyHash));
      break;
  }
  return cn(t);
}
function fk(e) {
  const t = ir(e, jt) ? e : new jt(e);
  switch (t.readUInt8Enum(Lt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case Lt.TokenTransfer:
      const r = ao(t), s = Rn(t.readBytes(8)), o = lm(t);
      return QE(r, s, o);
    case Lt.ContractCall:
      const i = la(t), a = Lr(t), c = Lr(t), u = [], h = t.readUInt32BE();
      for (let T = 0; T < h; T++) {
        const B = ao(t);
        u.push(B);
      }
      return ek(i, a, c, u);
    case Lt.SmartContract:
      const d = Lr(t), w = Lr(t, 4, 1e5);
      return I0(d, w);
    case Lt.VersionedSmartContract: {
      const T = t.readUInt8Enum(Hd, (Q) => {
        throw new Error(`Cannot recognize ClarityVersion: ${Q}`);
      }), B = Lr(t), X = Lr(t, 4, JA);
      return I0(B, X, T);
    }
    case Lt.PoisonMicroblock:
      return nk();
    case Lt.Coinbase: {
      const T = t.readBytes(Xs);
      return L0(T);
    }
    case Lt.CoinbaseToAltRecipient: {
      const T = t.readBytes(Xs), B = ao(t);
      return L0(T, B);
    }
    case Lt.NakamotoCoinbase: {
      const T = t.readBytes(Xs), B = ao(t), X = t.readBytes(Od);
      return rk(T, B, X);
    }
    case Lt.TenureChange:
      const y = He(t.readBytes(20)), v = He(t.readBytes(20)), S = He(t.readBytes(20)), I = He(t.readBytes(32)), U = t.readUInt32BE(), P = t.readUInt8Enum(jd, (T) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${T}`);
      }), A = He(t.readBytes(20));
      return ok(y, v, S, I, U, P, A);
  }
}
function Vd(e) {
  const t = ir(e, jt) ? e : new jt(e);
  return Gd(He(t.readBytes(cu)));
}
function hk(e) {
  const t = ir(e, jt) ? e : new jt(e), n = t.readUInt8Enum(zr, (r) => {
    throw new Gn(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case zr.PublicKeyCompressed:
      return Ki(Wt.Compressed, qd(t));
    case zr.PublicKeyUncompressed:
      return Ki(Wt.Uncompressed, ma(qk(qd(t).data)));
    case zr.SignatureCompressed:
      return Ki(Wt.Compressed, Vd(t));
    case zr.SignatureUncompressed:
      return Ki(Wt.Uncompressed, Vd(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function sh(e) {
  return At(e.data);
}
function pk(e) {
  const t = [];
  switch (e.contents.type) {
    case ge.PublicKey:
      t.push(e.pubKeyEncoding === Wt.Compressed ? zr.PublicKeyCompressed : zr.PublicKeyUncompressed), t.push(At(Xk(e.contents.data)));
      break;
    case ge.MessageSignature:
      t.push(e.pubKeyEncoding === Wt.Compressed ? zr.SignatureCompressed : zr.SignatureUncompressed), t.push(sh(e.contents));
      break;
  }
  return cn(t);
}
function Xd(e) {
  return e.data.slice();
}
function qd(e) {
  const t = ir(e, jt) ? e : new jt(e), n = t.readUInt8(), r = n === 4 ? GA : zA;
  return ma(cn([n, t.readBytes(r)]));
}
function ih(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === Dt.P2PKH || t === Dt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === Dt.P2WPKH || t === Dt.P2WSH || t === Dt.P2WSHNonSequential) && !r.map((s) => s.data).every(ba))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case Dt.P2PKH:
      return Hc(e, Hk(r[0].data));
    case Dt.P2WPKH:
      return Hc(e, Dk(r[0].data));
    case Dt.P2SH:
    case Dt.P2SHNonSequential:
      return Hc(e, Fk(n, r.map(Xd)));
    case Dt.P2WSH:
    case Dt.P2WSHNonSequential:
      return Hc(e, jk(n, r.map(Xd)));
  }
}
function Hc(e, t) {
  return { type: ge.Address, version: e, hash160: t };
}
function ah(e) {
  return wi.c32address(e.version, e.hash160);
}
function C0(e) {
  const [t, n, r] = e.split(/\.|::/);
  return sk(t, n, r);
}
function Ta(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return ik(t, n);
  } else
    return ak(e);
}
function gk(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return mk(t, n);
  } else
    return yk(e);
}
function yk(e) {
  const t = Cs(e);
  return { type: wt.PrincipalStandard, value: ah(t) };
}
function wk(e) {
  return { type: wt.PrincipalStandard, value: ah(e) };
}
function mk(e, t) {
  const n = Cs(e), r = qr(t);
  return pm(n, r);
}
function pm(e, t) {
  if (hi(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: wt.PrincipalContract,
    value: `${ah(e)}.${t.content}`
  };
}
function bk(e) {
  return { type: wt.ResponseErr, value: e };
}
function xk(e) {
  return { type: wt.ResponseOk, value: e };
}
const Sk = (e) => ({ type: wt.StringASCII, value: e }), vk = (e) => ({ type: wt.StringUTF8, value: e });
function Ak(e) {
  for (const t in e)
    if (!Rk(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: wt.Tuple, value: e };
}
function ao(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new jt(At(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new jt(e) : t = e;
  switch (t.readUInt8Enum(fn, (r) => {
    throw new Gn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case fn.int:
      return YE(Sd(t.readBytes(16)));
    case fn.uint:
      return WE(t.readBytes(16));
    case fn.buffer:
      const r = t.readUInt32BE();
      return XE(t.readBytes(r));
    case fn.true:
      return KE();
    case fn.false:
      return VE();
    case fn.address:
      const s = la(t);
      return wk(s);
    case fn.contract:
      const o = la(t), i = Lr(t);
      return pm(o, i);
    case fn.ok:
      return xk(ao(t));
    case fn.err:
      return bk(ao(t));
    case fn.none:
      return im();
    case fn.some:
      return am(ao(t));
    case fn.list:
      const a = t.readUInt32BE(), c = [];
      for (let S = 0; S < a; S++)
        c.push(ao(t));
      return ZE(c);
    case fn.tuple:
      const u = t.readUInt32BE(), h = {};
      for (let S = 0; S < u; S++) {
        const I = Lr(t).content;
        if (I === void 0)
          throw new Gn('"content" is undefined');
        h[I] = ao(t);
      }
      return Ak(h);
    case fn.ascii:
      const d = t.readUInt32BE(), w = e2(t.readBytes(d));
      return Sk(w);
    case fn.utf8:
      const y = t.readUInt32BE(), v = ac(t.readBytes(y));
      return vk(v);
    default:
      throw new Gn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function go(e, t) {
  return cn([nh(e), t]);
}
function Ek(e) {
  return new Uint8Array([nh(e.type)]);
}
function kk(e) {
  return e.type === wt.OptionalNone ? new Uint8Array([nh(e.type)]) : go(e.type, uo(e.value));
}
function $k(e) {
  const t = new Uint8Array(4);
  return Zs(t, Math.ceil(e.value.length / 2), 0), go(e.type, ho(t, At(e.value)));
}
function Ik(e) {
  const t = Cf(Y1(BigInt(e.value), BigInt(RA)), Zw);
  return go(e.type, t);
}
function Lk(e) {
  const t = Cf(BigInt(e.value), Zw);
  return go(e.type, t);
}
function Ck(e) {
  return go(e.type, fc(Cs(e.value)));
}
function Tk(e) {
  const [t, n] = zk(e.value);
  return go(e.type, ho(fc(Cs(t)), ua(qr(n))));
}
function Bk(e) {
  return go(e.type, uo(e.value));
}
function Mk(e) {
  const t = [], n = new Uint8Array(4);
  Zs(n, e.value.length, 0), t.push(n);
  for (const r of e.value) {
    const s = uo(r);
    t.push(s);
  }
  return go(e.type, cn(t));
}
function Nk(e) {
  const t = [], n = new Uint8Array(4);
  Zs(n, Object.keys(e.value).length, 0), t.push(n);
  const r = Object.keys(e.value).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = qr(s);
    t.push(ua(o));
    const i = uo(e.value[s]);
    t.push(i);
  }
  return go(e.type, cn(t));
}
function gm(e, t) {
  const n = [], r = t == "ascii" ? Q1(e.value) : hi(e.value), s = new Uint8Array(4);
  return Zs(s, r.length, 0), n.push(s), n.push(r), go(e.type, cn(n));
}
function _k(e) {
  return gm(e, "ascii");
}
function Pk(e) {
  return gm(e, "utf8");
}
function T0(e) {
  return He(uo(e));
}
function uo(e) {
  switch (e.type) {
    case wt.BoolTrue:
    case wt.BoolFalse:
      return Ek(e);
    case wt.OptionalNone:
    case wt.OptionalSome:
      return kk(e);
    case wt.Buffer:
      return $k(e);
    case wt.UInt:
      return Lk(e);
    case wt.Int:
      return Ik(e);
    case wt.PrincipalStandard:
      return Ck(e);
    case wt.PrincipalContract:
      return Tk(e);
    case wt.ResponseOk:
    case wt.ResponseErr:
      return Bk(e);
    case wt.List:
      return Mk(e);
    case wt.Tuple:
      return Nk(e);
    case wt.StringASCII:
      return _k(e);
    case wt.StringUTF8:
      return Pk(e);
    default:
      throw new Gi("Unable to serialize. Invalid Clarity Value.");
  }
}
const Uk = (e) => e.length % 2 ? `0${e}` : e, Ok = (e, t) => e.padEnd(t, "0"), ym = (e, t) => e ? hi(e).length > t : !1;
function Yd(e) {
  return Xw(e);
}
const Ya = (e) => wE(Qf(e)), ch = (e) => He(GE(e)), Hk = (e) => He(Ya(e)), Dk = (e) => {
  const t = Ya(e), n = ho(new Uint8Array([0]), new Uint8Array([t.length]), t), r = Ya(n);
  return He(r);
}, Fk = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((o) => {
    n.push(o.length), n.push(o);
  }), n.push(80 + t.length), n.push(174);
  const r = cn(n), s = Ya(r);
  return He(s);
}, jk = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + t.length), n.push(174);
  const r = cn(n), s = Qf(r), o = [];
  o.push(0), o.push(s.length), o.push(s);
  const i = cn(o), a = Ya(i);
  return He(a);
};
function Rk(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function zk(e) {
  const [t, n] = e.split(".");
  if (!t || !n)
    throw new Error(`Invalid contract identifier: ${e}`);
  return [t, n];
}
rn.hmacSha256Sync = (e, ...t) => {
  const n = tm.create(Qf, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function ma(e) {
  return e = typeof e == "string" ? At(e) : e, {
    type: ge.PublicKey,
    data: e
  };
}
function Gk(e, t, n = Wt.Compressed) {
  const r = o2(t), s = new wr(Tp(r.r), Tp(r.s)), o = lt.fromSignature(e, s, r.recoveryId), i = n === Wt.Compressed;
  return o.toHex(i);
}
function Kk(e) {
  return typeof e == "string" ? e : He(e);
}
const lh = Kk;
function wm(e) {
  return (typeof e == "string" ? e.length / 2 : e.byteLength) === r2;
}
function ba(e) {
  return !lh(e).startsWith("04");
}
function Vk(e) {
  e = Tf(e);
  const t = wm(e);
  return He(cc(e.slice(0, 32), t));
}
function Xk(e) {
  return lt.fromHex(lh(e)).toHex(!0);
}
function qk(e) {
  return lt.fromHex(lh(e)).toHex(!1);
}
function Yk(e, t) {
  e = Tf(e);
  const [n, r] = Zl(t, e.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return ic(r, 1) + wr.fromHex(n).toCompactHex();
}
function uh() {
  return {
    type: ge.MessageSignature,
    data: He(new Uint8Array(cu))
  };
}
function mm(e, t, n, r) {
  const s = ih(0, e, 1, [ma(t)]).hash160, o = ba(t) ? Wt.Compressed : Wt.Uncompressed;
  return {
    hashMode: e,
    signer: s,
    nonce: Rn(n),
    fee: Rn(r),
    keyEncoding: o,
    signature: uh()
  };
}
function Wa(e) {
  return "signature" in e;
}
function B0(e) {
  return e === Dt.P2SH || e === Dt.P2WSH;
}
function Wk(e) {
  return e === Dt.P2SHNonSequential || e === Dt.P2WSHNonSequential;
}
function M0(e) {
  const t = Yd(e);
  return t.nonce = 0, t.fee = 0, Wa(t) ? t.signature = uh() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function Zk(e) {
  const t = [
    e.hashMode,
    At(e.signer),
    Is(e.nonce, 8),
    Is(e.fee, 8),
    e.keyEncoding,
    sh(e.signature)
  ];
  return cn(t);
}
function Jk(e) {
  const t = [
    e.hashMode,
    At(e.signer),
    Is(e.nonce, 8),
    Is(e.fee, 8)
  ], n = rh(e.fields);
  t.push(oh(n));
  const r = new Uint8Array(2);
  return i2(r, e.signaturesRequired, 0), t.push(r), cn(t);
}
function Qk(e, t) {
  const n = He(t.readBytes(20)), r = BigInt(`0x${He(t.readBytes(8))}`), s = BigInt(`0x${He(t.readBytes(8))}`), o = t.readUInt8Enum(Wt, (a) => {
    throw new Gn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (e === Dt.P2WPKH && o != Wt.Compressed)
    throw new Gn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const i = Vd(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: o,
    signature: i
  };
}
function e3(e, t) {
  const n = He(t.readBytes(20)), r = BigInt("0x" + He(t.readBytes(8))), s = BigInt("0x" + He(t.readBytes(8))), o = dm(t, ge.TransactionAuthField).values;
  let i = !1, a = 0;
  for (const u of o)
    switch (u.contents.type) {
      case ge.PublicKey:
        ba(u.contents.data) || (i = !0);
        break;
      case ge.MessageSignature:
        if (u.pubKeyEncoding === Wt.Uncompressed && (i = !0), a += 1, a === 65536)
          throw new Rs("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = t.readUInt16BE();
  if (i && (e === Dt.P2WSH || e === Dt.P2WSHNonSequential))
    throw new Rs("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    fields: o,
    signaturesRequired: c
  };
}
function zu(e) {
  return Wa(e) ? Zk(e) : Jk(e);
}
function Gu(e) {
  const t = e.readUInt8Enum(Dt, (n) => {
    throw new Gn(`Could not parse ${n} as AddressHashMode`);
  });
  return t === Dt.P2PKH || t === Dt.P2WPKH ? Qk(t, e) : e3(t, e);
}
function bm(e, t, n, r) {
  const o = e + He(new Uint8Array([t])) + He(Is(n, 8)) + He(Is(r, 8));
  if (At(o).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return ch(At(o));
}
function xm(e, t, n) {
  const r = 33 + cu, s = ba(t.data) ? Wt.Compressed : Wt.Uncompressed, o = e + Uk(s.toString(16)) + n, i = At(o);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return ch(i);
}
function t3(e, t, n, r, s) {
  const o = bm(e, t, n, r), i = Yk(s, o), a = ma(Vk(s)), c = xm(o, a, i);
  return {
    nextSig: i,
    nextSigHash: c
  };
}
function Sm(e, t, n, r, s, o) {
  const i = bm(e, t, n, r), a = ma(Gk(i, o, s)), c = xm(i, a, o);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function n3() {
  const e = mm(Dt.P2PKH, "", 0, 0);
  return e.signer = JE().hash160, e.keyEncoding = Wt.Compressed, e.signature = uh(), e;
}
function N0(e, t, n) {
  return Wa(e) ? r3(e, t, n) : o3(e, t, n);
}
function r3(e, t, n) {
  const { pubKey: r, nextSigHash: s } = Sm(t, n, e.fee, e.nonce, e.keyEncoding, e.signature.data), o = ih(0, e.hashMode, 1, [r]).hash160;
  if (o !== e.signer)
    throw new Rs(`Signer hash does not equal hash of public key(s): ${o} != ${e.signer}`);
  return s;
}
function o3(e, t, n) {
  const r = [];
  let s = t, o = !1, i = 0;
  for (const c of e.fields)
    switch (c.contents.type) {
      case ge.PublicKey:
        ba(c.contents.data) || (o = !0), r.push(c.contents);
        break;
      case ge.MessageSignature:
        c.pubKeyEncoding === Wt.Uncompressed && (o = !0);
        const { pubKey: u, nextSigHash: h } = Sm(s, n, e.fee, e.nonce, c.pubKeyEncoding, c.contents.data);
        if (B0(e.hashMode) && (s = h), r.push(u), i += 1, i === 65536)
          throw new Rs("Too many signatures");
        break;
    }
  if (B0(e.hashMode) && i !== e.signaturesRequired || Wk(e.hashMode) && i < e.signaturesRequired)
    throw new Rs("Incorrect number of signatures");
  if (o && (e.hashMode === Dt.P2WSH || e.hashMode === Dt.P2WSHNonSequential))
    throw new Rs("Uncompressed keys are not allowed in this hash mode");
  const a = ih(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new Rs(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return s;
}
function vm(e) {
  return {
    authType: tn.Standard,
    spendingCondition: e
  };
}
function Am(e, t) {
  return {
    authType: tn.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || mm(Dt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function _0(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case tn.Standard:
        return vm(M0(e.spendingCondition));
      case tn.Sponsored:
        return Am(M0(e.spendingCondition), n3());
      default:
        throw new Cl("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function s3(e, t) {
  switch (e.authType) {
    case tn.Standard:
      return N0(e.spendingCondition, t, tn.Standard);
    case tn.Sponsored:
      return N0(e.spendingCondition, t, tn.Standard);
    default:
      throw new Cl("Invalid origin auth type");
  }
}
function i3(e, t) {
  switch (e.authType) {
    case tn.Standard:
      const n = {
        ...e.spendingCondition,
        fee: Rn(t)
      };
      return { ...e, spendingCondition: n };
    case tn.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: Rn(t)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function a3(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: Rn(t)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function c3(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: Rn(t)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function l3(e, t) {
  const n = {
    ...t,
    nonce: Rn(t.nonce),
    fee: Rn(t.fee)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function u3(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case tn.Standard:
      t.push(zu(e.spendingCondition));
      break;
    case tn.Sponsored:
      t.push(zu(e.spendingCondition)), t.push(zu(e.sponsorSpendingCondition));
      break;
  }
  return cn(t);
}
function d3(e) {
  const t = e.readUInt8Enum(tn, (r) => {
    throw new Gn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case tn.Standard:
      return n = Gu(e), vm(n);
    case tn.Sponsored:
      n = Gu(e);
      const r = Gu(e);
      return Am(n, r);
  }
}
class f3 {
  constructor({ auth: t, payload: n, postConditions: r = rh([]), postConditionMode: s = Ll.Deny, transactionVersion: o, chainId: i, network: a = "mainnet" }) {
    a = DA(a), this.transactionVersion = o ?? a.transactionVersion, this.chainId = i ?? a.chainId, this.auth = t, "amount" in n ? this.payload = {
      ...n,
      amount: Rn(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = fr.Any;
  }
  signBegin() {
    const t = Yd(this);
    return t.auth = _0(t.auth), t.txid();
  }
  verifyBegin() {
    const t = Yd(this);
    return t.auth = _0(t.auth), t.txid();
  }
  verifyOrigin() {
    return s3(this.auth, this.verifyBegin());
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
    const n = typeof t == "object" && "type" in t ? t : ma(t), r = this.auth.spendingCondition;
    if (r && !Wa(r)) {
      const s = ba(n.data);
      r.fields.push(Ki(s ? Wt.Compressed : Wt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, s) {
    const { nextSig: o, nextSigHash: i } = t3(n, r, t.fee, t.nonce, s);
    if (Wa(t))
      t.signature = Gd(o);
    else {
      const a = wm(s);
      t.fields.push(Ki(a ? Wt.Compressed : Wt.Uncompressed, Gd(o)));
    }
    return i;
  }
  txid() {
    const t = this.serializeBytes();
    return ch(t);
  }
  setSponsor(t) {
    if (this.auth.authType != tn.Sponsored)
      throw new Cl("Cannot sponsor sign a non-sponsored transaction");
    this.auth = l3(this.auth, t);
  }
  setFee(t) {
    this.auth = i3(this.auth, t);
  }
  setNonce(t) {
    this.auth = a3(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != tn.Sponsored)
      throw new Cl("Cannot sponsor sign a non-sponsored transaction");
    this.auth = c3(this.auth, t);
  }
  serialize() {
    return He(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Gi('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Gi('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Gi('"auth" is undefined');
    if (this.payload === void 0)
      throw new Gi('"payload" is undefined');
    const t = [];
    t.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Zs(n, this.chainId, 0), t.push(n), t.push(u3(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(oh(this.postConditions)), t.push(hm(this.payload)), cn(t);
  }
}
function h3(e) {
  const t = ir(e, jt) ? e : new jt(e), n = t.readUInt8Enum(ii, (h) => {
    throw new Error(`Could not parse ${h} as TransactionVersion`);
  }), r = t.readUInt32BE(), s = d3(t), o = t.readUInt8Enum(fr, (h) => {
    throw new Error(`Could not parse ${h} as AnchorMode`);
  }), i = t.readUInt8Enum(Ll, (h) => {
    throw new Error(`Could not parse ${h} as PostConditionMode`);
  }), a = dm(t, ge.PostCondition), c = fk(t), u = new f3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: i
  });
  return u.anchorMode = o, u;
}
const P0 = BigInt("18446744073709551615");
function Ku(e) {
  const t = Rn(e);
  if (t < 0n || t > P0)
    throw new RangeError(`Post-condition amount must be between 0 and ${P0} (u64 max), received: ${t}`);
  return t;
}
var Wd;
(function(e) {
  e[e.eq = 1] = "eq", e[e.gt = 2] = "gt", e[e.lt = 4] = "lt", e[e.gte = 3] = "gte", e[e.lte = 5] = "lte", e[e.sent = 16] = "sent", e[e["not-sent"] = 17] = "not-sent", e[e["maybe-sent"] = 18] = "maybe-sent";
})(Wd || (Wd = {}));
var Zd;
(function(e) {
  e[e["will-not-perform"] = 48] = "will-not-perform", e[e["may-perform"] = 49] = "may-perform", e[e["will-perform"] = 50] = "will-perform";
})(Zd || (Zd = {}));
function p3(e) {
  switch (e.type) {
    case "stx-postcondition":
      return {
        type: ge.PostCondition,
        conditionType: Kt.STX,
        principal: e.address === "origin" ? { type: ge.Principal, prefix: Vn.Origin } : Ta(e.address),
        conditionCode: Dc(e.condition),
        amount: Ku(e.amount)
      };
    case "ft-postcondition":
      return {
        type: ge.PostCondition,
        conditionType: Kt.Fungible,
        principal: e.address === "origin" ? { type: ge.Principal, prefix: Vn.Origin } : Ta(e.address),
        conditionCode: Dc(e.condition),
        amount: Ku(e.amount),
        asset: C0(e.asset)
      };
    case "nft-postcondition":
      return {
        type: ge.PostCondition,
        conditionType: Kt.NonFungible,
        principal: e.address === "origin" ? { type: ge.Principal, prefix: Vn.Origin } : Ta(e.address),
        conditionCode: Dc(e.condition),
        asset: C0(e.asset),
        assetName: e.assetId
      };
    case "staking-postcondition":
      return {
        type: ge.PostCondition,
        conditionType: Kt.Staking,
        principal: e.address === "origin" ? { type: ge.Principal, prefix: Vn.Origin } : Ta(e.address),
        conditionCode: Dc(e.condition),
        amount: Ku(e.amount)
      };
    case "pox-postcondition":
      return {
        type: ge.PostCondition,
        conditionType: Kt.PoX,
        principal: e.address === "origin" ? { type: ge.Principal, prefix: Vn.Origin } : Ta(e.address),
        conditionCode: g3(e.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Dc(e) {
  return Wd[e];
}
function g3(e) {
  return Zd[e];
}
function Em(e) {
  const t = p3(e);
  return uk(t);
}
function y3(e, t, n) {
  return fh(km(e), n);
}
function km(e, t) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Za(r);
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
    return BigInt(`0x${b3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function dh(e, t = 8) {
  return (typeof e == "bigint" ? e : km(e)).toString(16).padStart(t * 2, "0");
}
function fh(e, t = 16) {
  const n = dh(e, t);
  return Za(n);
}
function w3(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
const m3 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function b3(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += m3[n];
  return t;
}
function Za(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e;
  const t = e.length % 2 ? `0${e}` : e, n = new Uint8Array(t.length / 2);
  for (let r = 0; r < n.length; r++) {
    const s = r * 2, o = t.slice(s, s + 2), i = Number.parseInt(o, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    n[r] = i;
  }
  return n;
}
function hh(e) {
  return new TextEncoder().encode(e);
}
function x3(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function S3(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function U0(e) {
  if (e.some(S3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function ph(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, s) => r + s.length, 0), n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const o = e[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function Fo(e) {
  return ph(...e.map((t) => typeof t == "number" ? U0([t]) : t instanceof Array ? U0(t) : t));
}
function du(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var Jd;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Jd || (Jd = {}));
Jd.Mainnet;
const v3 = 128, A3 = 128, $m = 16;
var Qd;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Qd || (Qd = {}));
var O0;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(O0 || (O0 = {}));
var H0;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(H0 || (H0 = {}));
var Fr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Fr || (Fr = {}));
const Vu = ["onChainOnly", "offChainOnly", "any"];
Vu[0] + "", Fr.OnChainOnly, Vu[1] + "", Fr.OffChainOnly, Vu[2] + "", Fr.Any, Fr.OnChainOnly + "", Fr.OnChainOnly, Fr.OffChainOnly + "", Fr.OffChainOnly, Fr.Any + "", Fr.Any;
var ef;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(ef || (ef = {}));
ef.Mainnet;
var D0;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(D0 || (D0 = {}));
var Hs;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Hs || (Hs = {}));
var F0;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(F0 || (F0 = {}));
var j0;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(j0 || (j0 = {}));
var R0;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(R0 || (R0 = {}));
var z0;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(z0 || (z0 = {}));
var G0;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(G0 || (G0 = {}));
var K0;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(K0 || (K0 = {}));
var tf;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(tf || (tf = {}));
var V0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(V0 || (V0 = {}));
var X0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(X0 || (X0 = {}));
function nf(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function E3(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Im(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function k3(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  nf(e.outputLen), nf(e.blockLen);
}
function $3(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function I3(e, t) {
  Im(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Xu = {
  number: nf,
  bool: E3,
  bytes: Im,
  hash: k3,
  exists: $3,
  output: I3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const qu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), oo = (e, t) => e << 32 - t | e >>> t, L3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!L3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function C3(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Lm(e) {
  if (typeof e == "string" && (e = C3(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let T3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function bi(e) {
  const t = (r) => e().update(Lm(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function B3(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let gh = class extends T3 {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = qu(this.buffer);
  }
  update(t) {
    Xu.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = Lm(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = qu(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Xu.exists(this), Xu.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    B3(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = qu(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], o);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return t.length = s, t.pos = a, t.finished = o, t.destroyed = i, s % n && t.buffer.set(r), t;
  }
};
const M3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Cm = Uint8Array.from({ length: 16 }, (e, t) => t), N3 = Cm.map((e) => (9 * e + 5) % 16);
let yh = [Cm], wh = [N3];
for (let e = 0; e < 4; e++)
  for (let t of [yh, wh])
    t.push(t[e].map((n) => M3[n]));
const Tm = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), _3 = yh.map((e, t) => e.map((n) => Tm[t][n])), P3 = wh.map((e, t) => e.map((n) => Tm[t][n])), U3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), O3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Fc = (e, t) => e << t | e >>> 32 - t;
function q0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const jc = new Uint32Array(16);
let H3 = class extends gh {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: o } = this;
    return [t, n, r, s, o];
  }
  set(t, n, r, s, o) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = o | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      jc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, w = d;
    for (let y = 0; y < 5; y++) {
      const v = 4 - y, S = U3[y], I = O3[y], U = yh[y], P = wh[y], A = _3[y], T = P3[y];
      for (let B = 0; B < 16; B++) {
        const X = Fc(r + q0(y, o, a, u) + jc[U[B]] + S, A[B]) + d | 0;
        r = d, d = u, u = Fc(a, 10) | 0, a = o, o = X;
      }
      for (let B = 0; B < 16; B++) {
        const X = Fc(s + q0(v, i, c, h) + jc[P[B]] + I, T[B]) + w | 0;
        s = w, w = h, h = Fc(c, 10) | 0, c = i, i = X;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + w | 0, this.h3 + d + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    jc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
bi(() => new H3());
const D3 = (e, t, n) => e & t ^ ~e & n, F3 = (e, t, n) => e & t ^ e & n ^ t & n, j3 = new Uint32Array([
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
]), ds = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), fs = new Uint32Array(64);
let Bm = class extends gh {
  constructor() {
    super(64, 32, 8, !1), this.A = ds[0] | 0, this.B = ds[1] | 0, this.C = ds[2] | 0, this.D = ds[3] | 0, this.E = ds[4] | 0, this.F = ds[5] | 0, this.G = ds[6] | 0, this.H = ds[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [t, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      fs[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = fs[d - 15], y = fs[d - 2], v = oo(w, 7) ^ oo(w, 18) ^ w >>> 3, S = oo(y, 17) ^ oo(y, 19) ^ y >>> 10;
      fs[d] = S + fs[d - 7] + v + fs[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = oo(a, 6) ^ oo(a, 11) ^ oo(a, 25), y = h + w + D3(a, c, u) + j3[d] + fs[d] | 0, S = (oo(r, 2) ^ oo(r, 13) ^ oo(r, 22)) + F3(r, s, o) | 0;
      h = u, u = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    fs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, R3 = class extends Bm {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
bi(() => new Bm());
bi(() => new R3());
const Rc = BigInt(2 ** 32 - 1), rf = BigInt(32);
function Mm(e, t = !1) {
  return t ? { h: Number(e & Rc), l: Number(e >> rf & Rc) } : { h: Number(e >> rf & Rc) | 0, l: Number(e & Rc) | 0 };
}
function z3(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = Mm(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const G3 = (e, t) => BigInt(e >>> 0) << rf | BigInt(t >>> 0), K3 = (e, t, n) => e >>> n, V3 = (e, t, n) => e << 32 - n | t >>> n, X3 = (e, t, n) => e >>> n | t << 32 - n, q3 = (e, t, n) => e << 32 - n | t >>> n, Y3 = (e, t, n) => e << 64 - n | t >>> n - 32, W3 = (e, t, n) => e >>> n - 32 | t << 64 - n, Z3 = (e, t) => t, J3 = (e, t) => e, Q3 = (e, t, n) => e << n | t >>> 32 - n, e4 = (e, t, n) => t << n | e >>> 32 - n, t4 = (e, t, n) => t << n - 32 | e >>> 64 - n, n4 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function r4(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const o4 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), s4 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, i4 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), a4 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, c4 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), l4 = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, st = {
  fromBig: Mm,
  split: z3,
  toBig: G3,
  shrSH: K3,
  shrSL: V3,
  rotrSH: X3,
  rotrSL: q3,
  rotrBH: Y3,
  rotrBL: W3,
  rotr32H: Z3,
  rotr32L: J3,
  rotlSH: Q3,
  rotlSL: e4,
  rotlBH: t4,
  rotlBL: n4,
  add: r4,
  add3L: o4,
  add3H: s4,
  add4L: i4,
  add4H: a4,
  add5H: l4,
  add5L: c4
}, [u4, d4] = st.split([
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
].map((e) => BigInt(e))), hs = new Uint32Array(80), ps = new Uint32Array(80);
let fu = class extends gh {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: w, Gh: y, Gl: v, Hh: S, Hl: I } = this;
    return [t, n, r, s, o, i, a, c, u, h, d, w, y, v, S, I];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, u, h, d, w, y, v, S, I) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = v | 0, this.Hh = S | 0, this.Hl = I | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      hs[A] = t.getUint32(n), ps[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = hs[A - 15] | 0, B = ps[A - 15] | 0, X = st.rotrSH(T, B, 1) ^ st.rotrSH(T, B, 8) ^ st.shrSH(T, B, 7), Q = st.rotrSL(T, B, 1) ^ st.rotrSL(T, B, 8) ^ st.shrSL(T, B, 7), oe = hs[A - 2] | 0, Y = ps[A - 2] | 0, m = st.rotrSH(oe, Y, 19) ^ st.rotrBH(oe, Y, 61) ^ st.shrSH(oe, Y, 6), L = st.rotrSL(oe, Y, 19) ^ st.rotrBL(oe, Y, 61) ^ st.shrSL(oe, Y, 6), _ = st.add4L(Q, L, ps[A - 7], ps[A - 16]), N = st.add4H(_, X, m, hs[A - 7], hs[A - 16]);
      hs[A] = N | 0, ps[A] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: w, Fh: y, Fl: v, Gh: S, Gl: I, Hh: U, Hl: P } = this;
    for (let A = 0; A < 80; A++) {
      const T = st.rotrSH(d, w, 14) ^ st.rotrSH(d, w, 18) ^ st.rotrBH(d, w, 41), B = st.rotrSL(d, w, 14) ^ st.rotrSL(d, w, 18) ^ st.rotrBL(d, w, 41), X = d & y ^ ~d & S, Q = w & v ^ ~w & I, oe = st.add5L(P, B, Q, d4[A], ps[A]), Y = st.add5H(oe, U, T, X, u4[A], hs[A]), m = oe | 0, L = st.rotrSH(r, s, 28) ^ st.rotrBH(r, s, 34) ^ st.rotrBH(r, s, 39), _ = st.rotrSL(r, s, 28) ^ st.rotrBL(r, s, 34) ^ st.rotrBL(r, s, 39), N = r & o ^ r & a ^ o & a, W = s & i ^ s & c ^ i & c;
      U = S | 0, P = I | 0, S = y | 0, I = v | 0, y = d | 0, v = w | 0, { h: d, l: w } = st.add(u | 0, h | 0, Y | 0, m | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const j = st.add3L(m, _, W);
      r = st.add3H(j, Y, L, N), s = j | 0;
    }
    ({ h: r, l: s } = st.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = st.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = st.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = st.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: w } = st.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: y, l: v } = st.add(this.Fh | 0, this.Fl | 0, y | 0, v | 0), { h: S, l: I } = st.add(this.Gh | 0, this.Gl | 0, S | 0, I | 0), { h: U, l: P } = st.add(this.Hh | 0, this.Hl | 0, U | 0, P | 0), this.set(r, s, o, i, a, c, u, h, d, w, y, v, S, I, U, P);
  }
  roundClean() {
    hs.fill(0), ps.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, f4 = class extends fu {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, h4 = class extends fu {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, p4 = class extends fu {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
bi(() => new fu());
bi(() => new f4());
bi(() => new h4());
bi(() => new p4());
function g4(e, t, n) {
  const s = v3;
  if (B4(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Qd.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Sn;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(Sn || (Sn = {}));
let y4 = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Nm = class extends y4 {
  constructor(t) {
    super(t);
  }
};
function hu(e) {
  const t = [];
  return t.push(Za(dh(e.version, 1))), t.push(Za(e.hash160)), Fo(t);
}
function w4(e) {
  const t = [];
  return t.push(e.prefix), t.push(hu(e.address)), e.prefix === tf.Contract && t.push(Ja(e.contractName)), Fo(t);
}
function Ja(e) {
  const t = [], n = hh(e.content), r = n.byteLength;
  return t.push(Za(dh(r, e.lengthPrefixBytes))), t.push(n), Fo(t);
}
function m4(e) {
  const t = [];
  return t.push(hu(e.address)), t.push(Ja(e.contractName)), t.push(Ja(e.assetName)), Fo(t);
}
function _m(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(w4(e.principal)), (e.conditionType === Hs.Fungible || e.conditionType === Hs.NonFungible) && t.push(m4(e.assetInfo)), e.conditionType === Hs.NonFungible && t.push(ci(e.assetName)), t.push(e.conditionCode), e.conditionType === Hs.STX || e.conditionType === Hs.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new Nm("The post-condition amount may not be larger than 8 bytes");
    t.push(y3(e.amount, !1, 8));
  }
  return Fo(t);
}
function yo(e, t) {
  return Fo([e, t]);
}
function b4(e) {
  return new Uint8Array([e.type]);
}
function x4(e) {
  return e.type === Sn.OptionalNone ? new Uint8Array([e.type]) : yo(e.type, ci(e.value));
}
function S4(e) {
  const t = new Uint8Array(4);
  return du(t, e.buffer.length, 0), yo(e.type, ph(t, e.buffer));
}
function v4(e) {
  const t = fh(w3(e.value, BigInt(A3)), $m);
  return yo(e.type, t);
}
function A4(e) {
  const t = fh(e.value, $m);
  return yo(e.type, t);
}
function E4(e) {
  return yo(e.type, hu(e.address));
}
function k4(e) {
  return yo(e.type, ph(hu(e.address), Ja(e.contractName)));
}
function $4(e) {
  return yo(e.type, ci(e.value));
}
function I4(e) {
  const t = [], n = new Uint8Array(4);
  du(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const s = ci(r);
    t.push(s);
  }
  return yo(e.type, Fo(t));
}
function L4(e) {
  const t = [], n = new Uint8Array(4);
  du(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = g4(s);
    t.push(Ja(o));
    const i = ci(e.data[s]);
    t.push(i);
  }
  return yo(e.type, Fo(t));
}
function Pm(e, t) {
  const n = [], r = t == "ascii" ? x3(e.data) : hh(e.data), s = new Uint8Array(4);
  return du(s, r.length, 0), n.push(s), n.push(r), yo(e.type, Fo(n));
}
function C4(e) {
  return Pm(e, "ascii");
}
function T4(e) {
  return Pm(e, "utf8");
}
function ci(e) {
  switch (e.type) {
    case Sn.BoolTrue:
    case Sn.BoolFalse:
      return b4(e);
    case Sn.OptionalNone:
    case Sn.OptionalSome:
      return x4(e);
    case Sn.Buffer:
      return S4(e);
    case Sn.UInt:
      return A4(e);
    case Sn.Int:
      return v4(e);
    case Sn.PrincipalStandard:
      return E4(e);
    case Sn.PrincipalContract:
      return k4(e);
    case Sn.ResponseOk:
    case Sn.ResponseErr:
      return $4(e);
    case Sn.List:
      return I4(e);
    case Sn.Tuple:
      return L4(e);
    case Sn.StringASCII:
      return C4(e);
    case Sn.StringUTF8:
      return T4(e);
    default:
      throw new Nm("Unable to serialize. Invalid Clarity Value.");
  }
}
const B4 = (e, t) => e ? hh(e).length > t : !1, M4 = "connect-ui";
let cl, Um, hr = !1, of = !1;
const Do = (e, t = "") => () => {
}, N4 = (e, t) => () => {
}, _4 = "{visibility:hidden}.hydrated{visibility:inherit}", Y0 = {}, P4 = "http://www.w3.org/2000/svg", U4 = "http://www.w3.org/1999/xhtml", O4 = (e) => e != null, mh = (e) => (e = typeof e, e === "object" || e === "function");
function Om(e) {
  var t, n, r;
  return (r = (n = (t = e.head) === null || t === void 0 ? void 0 : t.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const Qe = (e, t, ...n) => {
  let r = null, s = !1, o = !1;
  const i = [], a = (u) => {
    for (let h = 0; h < u.length; h++)
      r = u[h], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof e != "function" && !mh(r)) && (r = String(r)), s && o ? i[i.length - 1].$text$ += r : i.push(s ? sf(null, r) : r), o = s);
  };
  if (a(n), t) {
    const u = t.className || t.class;
    u && (t.class = typeof u != "object" ? u : Object.keys(u).filter((h) => u[h]).join(" "));
  }
  const c = sf(e, null);
  return c.$attrs$ = t, i.length > 0 && (c.$children$ = i), c;
}, sf = (e, t) => {
  const n = {
    $flags$: 0,
    $tag$: e,
    $text$: t,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, H4 = {}, D4 = (e) => e && e.$tag$ === H4, F4 = (e, t) => e != null && !mh(e) && t & 4 ? e === "false" ? !1 : e === "" || !!e : e, j4 = (e) => xa(e).$hostElement$, R4 = (e, t, n) => {
  const r = Fn.ce(t, n);
  return e.dispatchEvent(r), r;
}, W0 = /* @__PURE__ */ new WeakMap(), z4 = (e, t, n) => {
  let r = Tl.get(e);
  l$ && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = t : r.replaceSync(t)) : r = t, Tl.set(e, r);
}, G4 = (e, t, n, r) => {
  var s;
  let o = Hm(t);
  const i = Tl.get(o);
  if (e = e.nodeType === 11 ? e : fo, i)
    if (typeof i == "string") {
      e = e.head || e;
      let a = W0.get(e), c;
      if (a || W0.set(e, a = /* @__PURE__ */ new Set()), !a.has(o)) {
        {
          c = fo.createElement("style"), c.innerHTML = i;
          const u = (s = Fn.$nonce$) !== null && s !== void 0 ? s : Om(fo);
          u != null && c.setAttribute("nonce", u), e.insertBefore(c, e.querySelector("link"));
        }
        a && a.add(o);
      }
    } else e.adoptedStyleSheets.includes(i) || (e.adoptedStyleSheets = [...e.adoptedStyleSheets, i]);
  return o;
}, K4 = (e) => {
  const t = e.$cmpMeta$, n = e.$hostElement$, r = t.$flags$, s = Do("attachStyles", t.$tagName$), o = G4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), t);
  r & 10 && (n["s-sc"] = o, n.classList.add(o + "-h")), s();
}, Hm = (e, t) => "sc-" + e.$tagName$, Z0 = (e, t, n, r, s, o) => {
  if (n !== r) {
    let i = Q0(e, t), a = t.toLowerCase();
    if (t === "class") {
      const c = e.classList, u = J0(n), h = J0(r);
      c.remove(...u.filter((d) => d && !h.includes(d))), c.add(...h.filter((d) => d && !u.includes(d)));
    } else if (!i && t[0] === "o" && t[1] === "n")
      t[2] === "-" ? t = t.slice(3) : Q0(pu, a) ? t = a.slice(2) : t = a[2] + t.slice(3), n && Fn.rel(e, t, n, !1), r && Fn.ael(e, t, r, !1);
    else {
      const c = mh(r);
      if ((i || c && r !== null) && !s)
        try {
          if (e.tagName.includes("-"))
            e[t] = r;
          else {
            const u = r ?? "";
            t === "list" ? i = !1 : (n == null || e[t] != u) && (e[t] = u);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || e.getAttribute(t) === "") && e.removeAttribute(t) : (!i || o & 4 || s) && !c && (r = r === !0 ? "" : r, e.setAttribute(t, r));
    }
  }
}, V4 = /\s/, J0 = (e) => e ? e.split(V4) : [], Dm = (e, t, n, r) => {
  const s = t.$elm$.nodeType === 11 && t.$elm$.host ? t.$elm$.host : t.$elm$, o = e && e.$attrs$ || Y0, i = t.$attrs$ || Y0;
  for (r in o)
    r in i || Z0(s, r, o[r], void 0, n, t.$flags$);
  for (r in i)
    Z0(s, r, o[r], i[r], n, t.$flags$);
}, bh = (e, t, n, r) => {
  const s = t.$children$[n];
  let o = 0, i, a;
  if (s.$text$ !== null)
    i = s.$elm$ = fo.createTextNode(s.$text$);
  else {
    if (hr || (hr = s.$tag$ === "svg"), i = s.$elm$ = fo.createElementNS(hr ? P4 : U4, s.$tag$), hr && s.$tag$ === "foreignObject" && (hr = !1), Dm(null, s, hr), O4(cl) && i["s-si"] !== cl && i.classList.add(i["s-si"] = cl), s.$children$)
      for (o = 0; o < s.$children$.length; ++o)
        a = bh(e, s, o), a && i.appendChild(a);
    s.$tag$ === "svg" ? hr = !1 : i.tagName === "foreignObject" && (hr = !0);
  }
  return i;
}, Fm = (e, t, n, r, s, o) => {
  let i = e, a;
  for (i.shadowRoot && i.tagName === Um && (i = i.shadowRoot); s <= o; ++s)
    r[s] && (a = bh(null, n, s), a && (r[s].$elm$ = a, i.insertBefore(a, t)));
}, jm = (e, t, n, r, s) => {
  for (; t <= n; ++t)
    (r = e[t]) && (s = r.$elm$, s.remove());
}, X4 = (e, t, n, r) => {
  let s = 0, o = 0, i = t.length - 1, a = t[0], c = t[i], u = r.length - 1, h = r[0], d = r[u], w;
  for (; s <= i && o <= u; )
    a == null ? a = t[++s] : c == null ? c = t[--i] : h == null ? h = r[++o] : d == null ? d = r[--u] : zc(a, h) ? (Oa(a, h), a = t[++s], h = r[++o]) : zc(c, d) ? (Oa(c, d), c = t[--i], d = r[--u]) : zc(a, d) ? (Oa(a, d), e.insertBefore(a.$elm$, c.$elm$.nextSibling), a = t[++s], d = r[--u]) : zc(c, h) ? (Oa(c, h), e.insertBefore(c.$elm$, a.$elm$), c = t[--i], h = r[++o]) : (w = bh(t && t[o], n, o), h = r[++o], w && a.$elm$.parentNode.insertBefore(w, a.$elm$));
  s > i ? Fm(e, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, o, u) : o > u && jm(t, s, i);
}, zc = (e, t) => e.$tag$ === t.$tag$, Oa = (e, t) => {
  const n = t.$elm$ = e.$elm$, r = e.$children$, s = t.$children$, o = t.$tag$, i = t.$text$;
  i === null ? (hr = o === "svg" ? !0 : o === "foreignObject" ? !1 : hr, Dm(e, t, hr), r !== null && s !== null ? X4(n, r, t, s) : s !== null ? (e.$text$ !== null && (n.textContent = ""), Fm(n, null, t, s, 0, s.length - 1)) : r !== null && jm(r, 0, r.length - 1), hr && o === "svg" && (hr = !1)) : e.$text$ !== i && (n.data = i);
}, q4 = (e, t) => {
  const n = e.$hostElement$, r = e.$vnode$ || sf(null, null), s = D4(t) ? t : Qe(null, null, t);
  Um = n.tagName, s.$tag$ = null, s.$flags$ |= 4, e.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, cl = n["s-sc"], Oa(r, s);
}, Rm = (e, t) => {
  t && !e.$onRenderResolve$ && t["s-p"] && t["s-p"].push(new Promise((n) => e.$onRenderResolve$ = n));
}, xh = (e, t) => {
  if (e.$flags$ |= 16, e.$flags$ & 4) {
    e.$flags$ |= 512;
    return;
  }
  return Rm(e, e.$ancestorComponent$), d$(() => Y4(e, t));
}, Y4 = (e, t) => {
  const n = Do("scheduleUpdate", e.$cmpMeta$.$tagName$), r = e.$lazyInstance$;
  let s;
  return n(), Q4(s, () => W4(e, r, t));
}, W4 = async (e, t, n) => {
  const r = e.$hostElement$, s = Do("update", e.$cmpMeta$.$tagName$), o = r["s-rc"];
  n && K4(e);
  const i = Do("render", e.$cmpMeta$.$tagName$);
  Z4(e, t), o && (o.map((a) => a()), r["s-rc"] = void 0), i(), s();
  {
    const a = r["s-p"], c = () => J4(e);
    a.length === 0 ? c() : (Promise.all(a).then(c), e.$flags$ |= 4, a.length = 0);
  }
}, Z4 = (e, t, n) => {
  try {
    t = t.render(), e.$flags$ &= -17, e.$flags$ |= 2, q4(e, t);
  } catch (r) {
    Qa(r, e.$hostElement$);
  }
  return null;
}, J4 = (e) => {
  const t = e.$cmpMeta$.$tagName$, n = e.$hostElement$, r = Do("postUpdate", t), s = e.$ancestorComponent$;
  e.$flags$ & 64 ? r() : (e.$flags$ |= 64, Gm(n), r(), e.$onReadyResolve$(n), s || zm()), e.$onRenderResolve$ && (e.$onRenderResolve$(), e.$onRenderResolve$ = void 0), e.$flags$ & 512 && vh(() => xh(e, !1)), e.$flags$ &= -517;
}, zm = (e) => {
  Gm(fo.documentElement), vh(() => R4(pu, "appload", { detail: { namespace: M4 } }));
}, Q4 = (e, t) => e && e.then ? e.then(t) : t(), Gm = (e) => e.classList.add("hydrated"), e$ = (e, t) => xa(e).$instanceValues$.get(t), t$ = (e, t, n, r) => {
  const s = xa(e), o = s.$instanceValues$.get(t), i = s.$flags$, a = s.$lazyInstance$;
  n = F4(n, r.$members$[t][0]);
  const c = Number.isNaN(o) && Number.isNaN(n), u = n !== o && !c;
  (!(i & 8) || o === void 0) && u && (s.$instanceValues$.set(t, n), a && (i & 18) === 2 && xh(s, !1));
}, Km = (e, t, n) => {
  if (t.$members$) {
    const r = Object.entries(t.$members$), s = e.prototype;
    if (r.map(([o, [i]]) => {
      (i & 31 || n & 2 && i & 32) && Object.defineProperty(s, o, {
        get() {
          return e$(this, o);
        },
        set(a) {
          t$(this, o, a, t);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const o = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(i, a, c) {
        Fn.jmp(() => {
          const u = o.get(i);
          if (this.hasOwnProperty(u))
            c = this[u], delete this[u];
          else if (s.hasOwnProperty(u) && typeof this[u] == "number" && this[u] == c)
            return;
          this[u] = c === null && typeof this[u] == "boolean" ? !1 : c;
        });
      }, e.observedAttributes = r.filter(
        ([i, a]) => a[0] & 15
        /* MEMBER_FLAGS.HasAttribute */
      ).map(([i, a]) => {
        const c = a[1] || i;
        return o.set(c, i), c;
      });
    }
  }
  return e;
}, n$ = async (e, t, n, r, s) => {
  if (!(t.$flags$ & 32)) {
    {
      if (t.$flags$ |= 32, s = c$(n), s.then) {
        const c = N4();
        s = await s, c();
      }
      s.isProxied || (Km(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = Do("createInstance", n.$tagName$);
      t.$flags$ |= 8;
      try {
        new s(t);
      } catch (c) {
        Qa(c);
      }
      t.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = Hm(n);
      if (!Tl.has(c)) {
        const u = Do("registerStyles", n.$tagName$);
        z4(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const o = t.$ancestorComponent$, i = () => xh(t, !0);
  o && o["s-rc"] ? o["s-rc"].push(i) : i();
}, r$ = (e) => {
  if (!(Fn.$flags$ & 1)) {
    const t = xa(e), n = t.$cmpMeta$, r = Do("connectedCallback", n.$tagName$);
    if (!(t.$flags$ & 1)) {
      t.$flags$ |= 1;
      {
        let s = e;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            Rm(t, t.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [o]]) => {
        if (o & 31 && e.hasOwnProperty(s)) {
          const i = e[s];
          delete e[s], e[s] = i;
        }
      }), n$(e, t, n);
    }
    r();
  }
}, o$ = (e) => {
  Fn.$flags$ & 1 || xa(e);
}, s$ = (e, t = {}) => {
  var n;
  const r = Do(), s = [], o = t.exclude || [], i = pu.customElements, a = fo.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ fo.createElement("style"), h = [];
  let d, w = !0;
  Object.assign(Fn, t), Fn.$resourcesUrl$ = new URL(t.resourcesUrl || "./", fo.baseURI).href, e.map((y) => {
    y[1].map((v) => {
      const S = {
        $flags$: v[0],
        $tagName$: v[1],
        $members$: v[2],
        $listeners$: v[3]
      };
      S.$members$ = v[2];
      const I = S.$tagName$, U = class extends HTMLElement {
        // StencilLazyHost
        constructor(P) {
          super(P), P = this, a$(P, S), S.$flags$ & 1 && P.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          d && (clearTimeout(d), d = null), w ? h.push(this) : Fn.jmp(() => r$(this));
        }
        disconnectedCallback() {
          Fn.jmp(() => o$(this));
        }
        componentOnReady() {
          return xa(this).$onReadyPromise$;
        }
      };
      S.$lazyBundleId$ = y[0], !o.includes(I) && !i.get(I) && (s.push(I), i.define(I, Km(
        U,
        S,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + _4, u.setAttribute("data-styles", "");
    const y = (n = Fn.$nonce$) !== null && n !== void 0 ? n : Om(fo);
    y != null && u.setAttribute("nonce", y), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  w = !1, h.length ? h.map((y) => y.connectedCallback()) : Fn.jmp(() => d = setTimeout(zm, 30)), r();
}, Sh = /* @__PURE__ */ new WeakMap(), xa = (e) => Sh.get(e), i$ = (e, t) => Sh.set(t.$lazyInstance$ = e, t), a$ = (e, t) => {
  const n = {
    $flags$: 0,
    $hostElement$: e,
    $cmpMeta$: t,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), e["s-p"] = [], e["s-rc"] = [], Sh.set(e, n);
}, Q0 = (e, t) => t in e, Qa = (e, t) => (0, console.error)(e, t), Yu = /* @__PURE__ */ new Map(), c$ = (e, t, n) => {
  const r = e.$tagName$.replace(/-/g, "_"), s = e.$lazyBundleId$, o = Yu.get(s);
  if (o)
    return o[r];
  {
    const i = (a) => (Yu.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => iT).then(i, Qa);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((i) => (Yu.set(s, i), i[r]), Qa);
}, Tl = /* @__PURE__ */ new Map(), pu = typeof window < "u" ? window : {}, fo = pu.document || { head: {} }, Fn = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (e) => e(),
  raf: (e) => requestAnimationFrame(e),
  ael: (e, t, n, r) => e.addEventListener(t, n, r),
  rel: (e, t, n, r) => e.removeEventListener(t, n, r),
  ce: (e, t) => new CustomEvent(e, t)
}, Vm = (e) => Promise.resolve(e), l$ = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), eg = [], Xm = [], u$ = (e, t) => (n) => {
  e.push(n), of || (of = !0, Fn.$flags$ & 4 ? vh(af) : Fn.raf(af));
}, tg = (e) => {
  for (let t = 0; t < e.length; t++)
    try {
      e[t](performance.now());
    } catch (n) {
      Qa(n);
    }
  e.length = 0;
}, af = () => {
  tg(eg), tg(Xm), (of = eg.length > 0) && Fn.raf(af);
}, vh = (e) => Vm().then(e), d$ = /* @__PURE__ */ u$(Xm), f$ = () => Vm(), h$ = (e, t) => typeof window > "u" ? Promise.resolve() : f$().then(() => s$([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], t));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var e = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(e, [], this.constructor);
    }, HTMLElement.prototype = e.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, e);
  }
})();
var p$ = Object.defineProperty, g$ = Object.defineProperties, y$ = Object.getOwnPropertyDescriptors, Bl = Object.getOwnPropertySymbols, qm = Object.prototype.hasOwnProperty, Ym = Object.prototype.propertyIsEnumerable, ng = (e, t, n) => t in e ? p$(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, br = (e, t) => {
  for (var n in t || (t = {})) qm.call(t, n) && ng(e, n, t[n]);
  if (Bl) for (var n of Bl(t)) Ym.call(t, n) && ng(e, n, t[n]);
  return e;
}, Yr = (e, t) => g$(e, y$(t)), Wm = (e, t) => {
  var n = {};
  for (var r in e) qm.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && Bl) for (var r of Bl(e)) t.indexOf(r) < 0 && Ym.call(e, r) && (n[r] = e[r]);
  return n;
};
function Zm() {
  return au(ni()) || window.StacksProvider || window.BlockstackProvider;
}
function gu(e) {
  return e ? typeof e == "string" ? oi.fromName(e) : "version" in e ? e : "url" in e ? new _d({ url: e.url }) : e.transactionVersion === ii.Mainnet ? new _d({ url: e.client.baseUrl }) : new Pd({ url: e.client.baseUrl }) : new Pd();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var w$ = ((e) => (e.ContractCall = "contract_call", e.ContractDeploy = "smart_contract", e.STXTransfer = "token_transfer", e))(w$ || {}), m$ = ((e) => (e.BUFFER = "buffer", e.UINT = "uint", e.INT = "int", e.PRINCIPAL = "principal", e.BOOL = "bool", e))(m$ || {}), Ah = (e) => {
  let t = e;
  if (!t) {
    let n = new Ty(["store_write"], document.location.href);
    t = new Nd({ appConfig: n });
  }
  return t;
};
function Jm(e) {
  try {
    return Ah(e).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Qm = (e) => {
  let t = Ah(e).loadUserData().appPrivateKey, n = Nn.SECP256K1Client.derivePublicKey(t);
  return { privateKey: t, publicKey: n };
};
function b$(e) {
  var t;
  let { stxAddress: n, userSession: r, network: s } = e;
  if (n) return n;
  if (!r || !s) return;
  let o = (t = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : t.stxAddress, i = { [si.Mainnet]: "mainnet", [si.Testnet]: "testnet" }, a = gu(s);
  return o == null ? void 0 : o[i[a.chainId]];
}
function x$(e) {
  let t = gu(e.network), n = Ah(e.userSession), r = Yr(br({}, e), { network: t, userSession: n });
  return br({ stxAddress: b$(r) }, r);
}
async function S$(e, t) {
  let { postConditions: n } = e;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(Em) : n = n.map((r) => He(_m(r)))), new Nn.TokenSigner("ES256k", t).signAsync(Yr(br({}, e), { postConditions: n }));
}
function v$(e) {
  let { postConditions: t } = e;
  return t && t.length > 0 && typeof t[0] != "string" && (typeof t[0].type == "string" ? t = t.map(Em) : t = t.map((n) => He(_m(n)))), Nn.createUnsecuredToken(Yr(br({}, e), { postConditions: t }));
}
var A$ = async ({ token: e, options: t }, n) => {
  var r, s, o;
  try {
    let i = await n.transactionRequest(e), { txRaw: a } = i, c = At(a.replace(/^0x/, "")), u = h3(c);
    if ("sponsored" in t && t.sponsored) {
      (r = t.onFinish) == null || r.call(t, Yr(br({}, i), { stacksTransaction: u }));
      return;
    }
    (s = t.onFinish) == null || s.call(t, Yr(br({}, i), { stacksTransaction: u }));
  } catch (i) {
    console.error("[Connect] Error during transaction request", i), (o = t.onCancel) == null || o.call(t);
  }
}, E$ = async (e) => {
  let t = e, { amount: n, appDetails: r, userSession: s } = t, o = Wm(t, ["amount", "appDetails", "userSession"]);
  if (Jm(s)) {
    let { privateKey: a, publicKey: c } = Qm(s), u = Yr(br({}, o), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), S$(u, a);
  }
  let i = Yr(br({}, o), { amount: n.toString(10), txType: "token_transfer" });
  return r && (i.appDetails = r), v$(i);
};
async function k$(e, t, n) {
  let r = await t(Yr(br(br({}, x$(e)), e), { network: gu(e.network) }));
  return A$({ token: r, options: e }, n);
}
function $$(e, t = Zm()) {
  if (!t) throw new Error("[Connect] No installed Stacks wallet found");
  return k$(e, E$, t);
}
function eb(e) {
  let { message: t, domain: n } = e;
  return typeof t.type == "string" && typeof n.type == "string" ? Yr(br({}, e), { message: T0(t), domain: T0(n) }) : Yr(br({}, e), { message: He(ci(t)), domain: He(ci(n)) });
}
async function I$(e, t) {
  return new Nn.TokenSigner("ES256k", t).signAsync(eb(e));
}
async function L$(e) {
  let t = e, { userSession: n } = t, r = Wm(t, ["userSession"]);
  if (Jm(n)) {
    let { privateKey: s, publicKey: o } = Qm(n), i = Yr(br({}, r), { publicKey: o });
    return I$(i, s);
  }
  return Nn.createUnsecuredToken(eb(e));
}
var C$ = ((e) => (e[e.DEFAULT = 0] = "DEFAULT", e[e.ALL = 1] = "ALL", e[e.NONE = 2] = "NONE", e[e.SINGLE = 3] = "SINGLE", e[e.ANYONECANPAY = 128] = "ANYONECANPAY", e))(C$ || {}), tb = "asigna-stx", rg = (e, t) => new Promise((n) => {
  function r(s) {
    s.data.source === tb && s.data[t] && (n(s.data[t]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(B$(e, t), "*");
}), T$ = { authenticationRequest: async (e) => rg(e, "authenticationRequest"), transactionRequest: async (e) => rg(e, "transactionRequest") }, B$ = (e, t) => ({ source: tb, [t]: e }), M$ = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = T$);
};
M$();
var N$ = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function _$(e, t = !0) {
  return function(n, r) {
    var s;
    if (r) return e(n, r);
    let o = ni(), i = Zm();
    if (o && i) return e(n, i);
    if (typeof window > "u") return;
    h$();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : N$, c = kA(a), u = document.createElement("connect-modal");
    u.defaultProviders = a, u.installedProviders = c, u.persistSelection = t;
    let h = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let d = () => {
      u.remove(), document.body.style.overflow = h;
    };
    u.callback = (y) => {
      d(), e(n, y);
    }, u.cancelCallback = () => {
      var y;
      d(), (y = n.onCancel) == null || y.call(n);
    }, document.body.appendChild(u);
    let w = (y) => {
      y.key === "Escape" && (document.removeEventListener("keydown", w), u.remove());
    };
    document.addEventListener("keydown", w);
  };
}
var Gc = _$($$);
function Ls(e, t, n) {
  return Eh(qn(e, t), n);
}
function qn(e, t) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Xt(r);
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
      const r = O$(BigInt(`0x${dt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${dt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function og(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function hc(e, t = 8) {
  return (typeof e == "bigint" ? e : qn(e, !1)).toString(16).padStart(t * 2, "0");
}
function yu(e) {
  return parseInt(e, 16);
}
function Eh(e, t = 16) {
  const n = hc(e, t);
  return Xt(n);
}
function P$(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function U$(e, t) {
  return e & BigInt(1) << t;
}
function O$(e, t) {
  return U$(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const H$ = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function dt(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += H$[n];
  return t;
}
function Xt(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e;
  const t = e.length % 2 ? `0${e}` : e, n = new Uint8Array(t.length / 2);
  for (let r = 0; r < n.length; r++) {
    const s = r * 2, o = t.slice(s, s + 2), i = Number.parseInt(o, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    n[r] = i;
  }
  return n;
}
function Sa(e) {
  return new TextEncoder().encode(e);
}
function kh(e) {
  return new TextDecoder().decode(e);
}
function nb(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function D$(e) {
  return String.fromCharCode.apply(null, e);
}
function F$(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function sg(e) {
  if (e.some(F$))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function wu(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, s) => r + s.length, 0), n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const o = e[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function ln(e) {
  return wu(...e.map((t) => typeof t == "number" ? sg([t]) : t instanceof Array ? sg(t) : t));
}
var ig;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(ig || (ig = {}));
var ag;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(ag || (ag = {}));
var cg;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(cg || (cg = {}));
const rb = 33, Wu = 32;
function j$(e) {
  if (e.length < Wu * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + Wu * 2), r = e.slice(2 + Wu * 2);
  return {
    recoveryId: yu(t),
    r: n,
    s: r
  };
}
function R$(e) {
  const t = typeof e == "string" ? Xt(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function z$(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function G$(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function K$(e, t) {
  return e[t];
}
function V$(e, t, n = 0) {
  return e[n] = t, e;
}
function X$(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function li(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var cf;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(cf || (cf = {}));
const q$ = cf.Mainnet, Y$ = 128, W$ = 128, ob = 16, qs = 32, lf = 80, mu = 65, Z$ = 32, J$ = 64, Ml = 34;
var Ce;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Ce || (Ce = {}));
var ct;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ct || (ct = {}));
var uf;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(uf || (uf = {}));
var or;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(or || (or = {}));
const ll = ["onChainOnly", "offChainOnly", "any"], lg = {
  [ll[0]]: or.OnChainOnly,
  [ll[1]]: or.OffChainOnly,
  [ll[2]]: or.Any,
  [or.OnChainOnly]: or.OnChainOnly,
  [or.OffChainOnly]: or.OffChainOnly,
  [or.Any]: or.Any
};
function Q$(e) {
  if (e in lg)
    return lg[e];
  throw new Error(`Invalid anchor mode "${e}", must be one of: ${ll.join(", ")}`);
}
var Nl;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Nl || (Nl = {}));
Nl.Mainnet;
var da;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(da || (da = {}));
var sr;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(sr || (sr = {}));
var nn;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(nn || (nn = {}));
var Ft;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Ft || (Ft = {}));
var _l;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(_l || (_l = {}));
var Zt;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Zt || (Zt = {}));
var ec;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(ec || (ec = {}));
var df;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(df || (df = {}));
var tc;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(tc || (tc = {}));
var ug;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(ug || (ug = {}));
var dg;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(dg || (dg = {}));
function ff(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function e8(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function sb(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function t8(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ff(e.outputLen), ff(e.blockLen);
}
function n8(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function r8(e, t) {
  sb(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Gs = {
  number: ff,
  bool: e8,
  bytes: sb,
  hash: t8,
  exists: n8,
  output: r8
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Zu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), so = (e, t) => e << 32 - t | e >>> t, o8 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!o8)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function s8(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function $h(e) {
  if (typeof e == "string" && (e = s8(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
class ib {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function xi(e) {
  const t = (r) => e().update($h(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function i8(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
class Ih extends ib {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Zu(this.buffer);
  }
  update(t) {
    Gs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = $h(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Zu(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Gs.exists(this), Gs.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    i8(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Zu(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], o);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return t.length = s, t.pos = a, t.finished = o, t.destroyed = i, s % n && t.buffer.set(r), t;
  }
}
const a8 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ab = Uint8Array.from({ length: 16 }, (e, t) => t), c8 = ab.map((e) => (9 * e + 5) % 16);
let Lh = [ab], Ch = [c8];
for (let e = 0; e < 4; e++)
  for (let t of [Lh, Ch])
    t.push(t[e].map((n) => a8[n]));
const cb = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), l8 = Lh.map((e, t) => e.map((n) => cb[t][n])), u8 = Ch.map((e, t) => e.map((n) => cb[t][n])), d8 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), f8 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Kc = (e, t) => e << t | e >>> 32 - t;
function fg(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Vc = new Uint32Array(16);
class h8 extends Ih {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: o } = this;
    return [t, n, r, s, o];
  }
  set(t, n, r, s, o) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = o | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      Vc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, w = d;
    for (let y = 0; y < 5; y++) {
      const v = 4 - y, S = d8[y], I = f8[y], U = Lh[y], P = Ch[y], A = l8[y], T = u8[y];
      for (let B = 0; B < 16; B++) {
        const X = Kc(r + fg(y, o, a, u) + Vc[U[B]] + S, A[B]) + d | 0;
        r = d, d = u, u = Kc(a, 10) | 0, a = o, o = X;
      }
      for (let B = 0; B < 16; B++) {
        const X = Kc(s + fg(v, i, c, h) + Vc[P[B]] + I, T[B]) + w | 0;
        s = w, w = h, h = Kc(c, 10) | 0, c = i, i = X;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + w | 0, this.h3 + d + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Vc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const p8 = xi(() => new h8()), g8 = (e, t, n) => e & t ^ ~e & n, y8 = (e, t, n) => e & t ^ e & n ^ t & n, w8 = new Uint32Array([
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
]), gs = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ys = new Uint32Array(64);
class lb extends Ih {
  constructor() {
    super(64, 32, 8, !1), this.A = gs[0] | 0, this.B = gs[1] | 0, this.C = gs[2] | 0, this.D = gs[3] | 0, this.E = gs[4] | 0, this.F = gs[5] | 0, this.G = gs[6] | 0, this.H = gs[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [t, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      ys[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = ys[d - 15], y = ys[d - 2], v = so(w, 7) ^ so(w, 18) ^ w >>> 3, S = so(y, 17) ^ so(y, 19) ^ y >>> 10;
      ys[d] = S + ys[d - 7] + v + ys[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = so(a, 6) ^ so(a, 11) ^ so(a, 25), y = h + w + g8(a, c, u) + w8[d] + ys[d] | 0, S = (so(r, 2) ^ so(r, 13) ^ so(r, 22)) + y8(r, s, o) | 0;
      h = u, u = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    ys.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class m8 extends lb {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const Th = xi(() => new lb());
xi(() => new m8());
const Xc = BigInt(2 ** 32 - 1), hf = BigInt(32);
function ub(e, t = !1) {
  return t ? { h: Number(e & Xc), l: Number(e >> hf & Xc) } : { h: Number(e >> hf & Xc) | 0, l: Number(e & Xc) | 0 };
}
function b8(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = ub(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const x8 = (e, t) => BigInt(e >>> 0) << hf | BigInt(t >>> 0), S8 = (e, t, n) => e >>> n, v8 = (e, t, n) => e << 32 - n | t >>> n, A8 = (e, t, n) => e >>> n | t << 32 - n, E8 = (e, t, n) => e << 32 - n | t >>> n, k8 = (e, t, n) => e << 64 - n | t >>> n - 32, $8 = (e, t, n) => e >>> n - 32 | t << 64 - n, I8 = (e, t) => t, L8 = (e, t) => e, C8 = (e, t, n) => e << n | t >>> 32 - n, T8 = (e, t, n) => t << n | e >>> 32 - n, B8 = (e, t, n) => t << n - 32 | e >>> 64 - n, M8 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function N8(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const _8 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), P8 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, U8 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), O8 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, H8 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), D8 = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, it = {
  fromBig: ub,
  split: b8,
  toBig: x8,
  shrSH: S8,
  shrSL: v8,
  rotrSH: A8,
  rotrSL: E8,
  rotrBH: k8,
  rotrBL: $8,
  rotr32H: I8,
  rotr32L: L8,
  rotlSH: C8,
  rotlSL: T8,
  rotlBH: B8,
  rotlBL: M8,
  add: N8,
  add3L: _8,
  add3H: P8,
  add4L: U8,
  add4H: O8,
  add5H: D8,
  add5L: H8
}, [F8, j8] = it.split([
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
].map((e) => BigInt(e))), ws = new Uint32Array(80), ms = new Uint32Array(80);
class bu extends Ih {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: w, Gh: y, Gl: v, Hh: S, Hl: I } = this;
    return [t, n, r, s, o, i, a, c, u, h, d, w, y, v, S, I];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, u, h, d, w, y, v, S, I) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = v | 0, this.Hh = S | 0, this.Hl = I | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      ws[A] = t.getUint32(n), ms[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = ws[A - 15] | 0, B = ms[A - 15] | 0, X = it.rotrSH(T, B, 1) ^ it.rotrSH(T, B, 8) ^ it.shrSH(T, B, 7), Q = it.rotrSL(T, B, 1) ^ it.rotrSL(T, B, 8) ^ it.shrSL(T, B, 7), oe = ws[A - 2] | 0, Y = ms[A - 2] | 0, m = it.rotrSH(oe, Y, 19) ^ it.rotrBH(oe, Y, 61) ^ it.shrSH(oe, Y, 6), L = it.rotrSL(oe, Y, 19) ^ it.rotrBL(oe, Y, 61) ^ it.shrSL(oe, Y, 6), _ = it.add4L(Q, L, ms[A - 7], ms[A - 16]), N = it.add4H(_, X, m, ws[A - 7], ws[A - 16]);
      ws[A] = N | 0, ms[A] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: w, Fh: y, Fl: v, Gh: S, Gl: I, Hh: U, Hl: P } = this;
    for (let A = 0; A < 80; A++) {
      const T = it.rotrSH(d, w, 14) ^ it.rotrSH(d, w, 18) ^ it.rotrBH(d, w, 41), B = it.rotrSL(d, w, 14) ^ it.rotrSL(d, w, 18) ^ it.rotrBL(d, w, 41), X = d & y ^ ~d & S, Q = w & v ^ ~w & I, oe = it.add5L(P, B, Q, j8[A], ms[A]), Y = it.add5H(oe, U, T, X, F8[A], ws[A]), m = oe | 0, L = it.rotrSH(r, s, 28) ^ it.rotrBH(r, s, 34) ^ it.rotrBH(r, s, 39), _ = it.rotrSL(r, s, 28) ^ it.rotrBL(r, s, 34) ^ it.rotrBL(r, s, 39), N = r & o ^ r & a ^ o & a, W = s & i ^ s & c ^ i & c;
      U = S | 0, P = I | 0, S = y | 0, I = v | 0, y = d | 0, v = w | 0, { h: d, l: w } = it.add(u | 0, h | 0, Y | 0, m | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const j = it.add3L(m, _, W);
      r = it.add3H(j, Y, L, N), s = j | 0;
    }
    ({ h: r, l: s } = it.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = it.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = it.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = it.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: w } = it.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: y, l: v } = it.add(this.Fh | 0, this.Fl | 0, y | 0, v | 0), { h: S, l: I } = it.add(this.Gh | 0, this.Gl | 0, S | 0, I | 0), { h: U, l: P } = it.add(this.Hh | 0, this.Hl | 0, U | 0, P | 0), this.set(r, s, o, i, a, c, u, h, d, w, y, v, S, I, U, P);
  }
  roundClean() {
    ws.fill(0), ms.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class R8 extends bu {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class z8 extends bu {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class G8 extends bu {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
xi(() => new bu());
xi(() => new R8());
const K8 = xi(() => new z8());
xi(() => new G8());
function db(e) {
  if (Xt(e).byteLength != mu)
    throw Error("Invalid signature");
  return {
    type: Ce.MessageSignature,
    data: e
  };
}
function Ha(e, t) {
  return { type: Ce.Address, version: e, hash160: t };
}
function Vi(e) {
  return wi.c32address(e.version, e.hash160);
}
function ui(e, t, n) {
  const r = t || 1, s = n || Y$;
  if (Lb(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Ce.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Bh(e) {
  const t = wi.c32addressDecode(e);
  return {
    type: Ce.Address,
    version: t[0],
    hash160: t[1]
  };
}
var ae;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(ae || (ae = {}));
function V8(e) {
  if (e.type === ae.PrincipalStandard)
    return Vi(e.address);
  if (e.type === ae.PrincipalContract)
    return `${Vi(e.address)}.${e.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(e)}`);
}
function fb(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return Y8(t, n);
  } else
    return X8(e);
}
function X8(e) {
  const t = Bh(e);
  return { type: ae.PrincipalStandard, address: t };
}
function q8(e) {
  return { type: ae.PrincipalStandard, address: e };
}
function Y8(e, t) {
  const n = Bh(e), r = ui(t);
  return hb(n, r);
}
function hb(e, t) {
  if (Sa(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: ae.PrincipalContract, address: e, contractName: t };
}
function Ju(e, t = !1) {
  switch (e.type) {
    case ae.BoolTrue:
      return !0;
    case ae.BoolFalse:
      return !1;
    case ae.Int:
    case ae.UInt:
      return t ? e.value.toString() : e.value;
    case ae.Buffer:
      return `0x${dt(e.buffer)}`;
    case ae.OptionalNone:
      return null;
    case ae.OptionalSome:
      return Gr(e.value);
    case ae.ResponseErr:
      return Gr(e.value);
    case ae.ResponseOk:
      return Gr(e.value);
    case ae.PrincipalStandard:
    case ae.PrincipalContract:
      return V8(e);
    case ae.List:
      return e.list.map((r) => Gr(r));
    case ae.Tuple:
      const n = {};
      return Object.keys(e.data).forEach((r) => {
        n[r] = Gr(e.data[r]);
      }), n;
    case ae.StringASCII:
      return e.data;
    case ae.StringUTF8:
      return e.data;
  }
}
function Gr(e) {
  switch (e.type) {
    case ae.ResponseErr:
      return { type: Ss(e), value: Ju(e, !0), success: !1 };
    case ae.ResponseOk:
      return { type: Ss(e), value: Ju(e, !0), success: !0 };
    default:
      return { type: Ss(e), value: Ju(e, !0) };
  }
}
function Ss(e) {
  switch (e.type) {
    case ae.BoolTrue:
    case ae.BoolFalse:
      return "bool";
    case ae.Int:
      return "int";
    case ae.UInt:
      return "uint";
    case ae.Buffer:
      return `(buff ${e.buffer.length})`;
    case ae.OptionalNone:
      return "(optional none)";
    case ae.OptionalSome:
      return `(optional ${Ss(e.value)})`;
    case ae.ResponseErr:
      return `(response UnknownType ${Ss(e.value)})`;
    case ae.ResponseOk:
      return `(response ${Ss(e.value)} UnknownType)`;
    case ae.PrincipalStandard:
    case ae.PrincipalContract:
      return "principal";
    case ae.List:
      return `(list ${e.list.length} ${e.list.length ? Ss(e.list[0]) : "UnknownType"})`;
    case ae.Tuple:
      return `(tuple ${Object.keys(e.data).map((t) => `(${t} ${Ss(e.data[t])})`).join(" ")})`;
    case ae.StringASCII:
      return `(string-ascii ${nb(e.data).length})`;
    case ae.StringUTF8:
      return `(string-utf8 ${Sa(e.data).length})`;
  }
}
const pb = () => ({ type: ae.BoolTrue }), gb = () => ({ type: ae.BoolFalse }), W8 = (e) => e ? pb() : gb(), hg = BigInt("0xffffffffffffffffffffffffffffffff"), Z8 = BigInt(0), pg = BigInt("0x7fffffffffffffffffffffffffffffff"), gg = BigInt("-170141183460469231731687303715884105728"), J8 = (e) => {
  const t = qn(e, !0);
  if (t > pg)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${pg}`);
  if (t < gg)
    throw new RangeError(`Cannot construct clarity integer form value less than ${gg}`);
  return { type: ae.Int, value: t };
}, An = (e) => {
  const t = qn(e, !1);
  if (t < Z8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > hg)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${hg}`);
  return { type: ae.UInt, value: t };
}, yb = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: ae.Buffer, buffer: e };
};
function wb() {
  return { type: ae.OptionalNone };
}
function mb(e) {
  return { type: ae.OptionalSome, value: e };
}
function Q8(e) {
  return { type: ae.ResponseErr, value: e };
}
function e6(e) {
  return { type: ae.ResponseOk, value: e };
}
function t6(e) {
  return { type: ae.List, list: e };
}
function xr(e) {
  for (const t in e)
    if (!G6(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: ae.Tuple, data: e };
}
const Et = (e) => ({ type: ae.StringASCII, data: e }), n6 = (e) => ({ type: ae.StringUTF8, data: e });
class bb extends ib {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Gs.hash(t);
    const r = $h(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, o = new Uint8Array(s);
    o.set(r.length > s ? t.create().update(r).digest() : r);
    for (let i = 0; i < o.length; i++)
      o[i] ^= 54;
    this.iHash.update(o), this.oHash = t.create();
    for (let i = 0; i < o.length; i++)
      o[i] ^= 106;
    this.oHash.update(o), o.fill(0);
  }
  update(t) {
    return Gs.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Gs.exists(this), Gs.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = s, t.destroyed = o, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const xb = (e, t, n) => new bb(e, t).update(n).digest();
xb.create = (e, t) => new bb(e, t);
rn.hmacSha256Sync = (e, ...t) => {
  const n = xb.create(Th, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function fa(e) {
  return {
    type: Ce.PublicKey,
    data: Xt(e)
  };
}
function r6(e, t, n = Zt.Compressed) {
  const r = j$(t.data), s = new wr(og(r.r), og(r.s)), o = lt.fromSignature(e, s, r.recoveryId), i = n === Zt.Compressed;
  return o.toHex(i);
}
function o6(e) {
  return { type: Ce.PublicKey, data: e };
}
function va(e) {
  return !dt(e.data).startsWith("04");
}
function Pl(e) {
  return e.data.slice();
}
function s6(e) {
  const t = c6(e), n = cc(t.data.slice(0, 32), t.compressed);
  return fa(dt(n));
}
function i6(e) {
  const t = typeof e == "string" ? e : dt(e), n = lt.fromHex(t).toHex(!0);
  return fa(n);
}
function a6(e) {
  const t = typeof e == "string" ? e : dt(e), n = lt.fromHex(t).toHex(!1);
  return fa(n);
}
function pf(e) {
  const t = e.readUInt8(), n = t === 4 ? J$ : Z$;
  return o6(ln([t, e.readBytes(n)]));
}
function c6(e) {
  const t = R$(e), n = t.length == rb;
  return { data: t, compressed: n };
}
function l6(e, t) {
  const [n, r] = Zl(t, e.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const o = hc(r, 1) + wr.fromHex(n).toCompactHex();
  return db(o);
}
function u6(e) {
  return s6(e.data);
}
function d6(e, t, n) {
  return typeof e == "string" && (e = fb(e)), typeof n == "string" && (n = mg(n)), {
    type: Ce.Payload,
    payloadType: ct.TokenTransfer,
    recipient: e,
    amount: qn(t, !1),
    memo: n ?? mg("")
  };
}
function f6(e, t, n, r) {
  return typeof e == "string" && (e = Bh(e)), typeof t == "string" && (t = ui(t)), typeof n == "string" && (n = ui(n)), {
    type: Ce.Payload,
    payloadType: ct.ContractCall,
    contractAddress: e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function yg(e, t, n) {
  return typeof e == "string" && (e = ui(e)), typeof t == "string" && (t = S6(t)), typeof n == "number" ? {
    type: Ce.Payload,
    payloadType: ct.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: Ce.Payload,
    payloadType: ct.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function h6() {
  return { type: Ce.Payload, payloadType: ct.PoisonMicroblock };
}
function wg(e, t) {
  if (e.byteLength != qs)
    throw Error(`Coinbase buffer size must be ${qs} bytes`);
  return t != null ? {
    type: Ce.Payload,
    payloadType: ct.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: Ce.Payload,
    payloadType: ct.Coinbase,
    coinbaseBytes: e
  };
}
function p6(e, t, n) {
  if (e.byteLength != qs)
    throw Error(`Coinbase buffer size must be ${qs} bytes`);
  if (n.byteLength != lf)
    throw Error(`VRF proof buffer size must be ${lf} bytes`);
  return {
    type: Ce.Payload,
    payloadType: ct.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === ae.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
var gf;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended";
})(gf || (gf = {}));
function g6(e, t, n, r, s, o, i) {
  return {
    type: Ce.Payload,
    payloadType: ct.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: o,
    publicKeyHash: i
  };
}
function Sb(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case ct.TokenTransfer:
      t.push(sn(e.recipient)), t.push(Ls(e.amount, !1, 8)), t.push(No(e.memo));
      break;
    case ct.ContractCall:
      t.push(No(e.contractAddress)), t.push(No(e.contractName)), t.push(No(e.functionName));
      const n = new Uint8Array(4);
      li(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(sn(r));
      });
      break;
    case ct.SmartContract:
      t.push(No(e.contractName)), t.push(No(e.codeBody));
      break;
    case ct.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(No(e.contractName)), t.push(No(e.codeBody));
      break;
    case ct.PoisonMicroblock:
      break;
    case ct.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case ct.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(sn(e.recipient));
      break;
    case ct.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(sn(e.recipient ? mb(e.recipient) : wb())), t.push(e.vrfProof);
      break;
    case ct.TenureChange:
      t.push(Xt(e.tenureHash)), t.push(Xt(e.previousTenureHash)), t.push(Xt(e.burnViewHash)), t.push(Xt(e.previousTenureEnd)), t.push(li(new Uint8Array(4), e.previousTenureBlocks)), t.push(V$(new Uint8Array(1), e.cause)), t.push(Xt(e.publicKeyHash));
      break;
  }
  return ln(t);
}
function y6(e) {
  switch (e.readUInt8Enum(ct, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case ct.TokenTransfer:
      const n = Tr(e), r = qn(e.readBytes(8), !1), s = Ab(e);
      return d6(n, r, s);
    case ct.ContractCall:
      const o = ha(e), i = Cr(e), a = Cr(e), c = [], u = e.readUInt32BE();
      for (let A = 0; A < u; A++) {
        const T = Tr(e);
        c.push(T);
      }
      return f6(o, i, a, c);
    case ct.SmartContract:
      const h = Cr(e), d = Cr(e, 4, 1e5);
      return yg(h, d);
    case ct.VersionedSmartContract: {
      const A = e.readUInt8Enum(uf, (X) => {
        throw new Error(`Cannot recognize ClarityVersion: ${X}`);
      }), T = Cr(e), B = Cr(e, 4, 1e5);
      return yg(T, B, A);
    }
    case ct.PoisonMicroblock:
      return h6();
    case ct.Coinbase: {
      const A = e.readBytes(qs);
      return wg(A);
    }
    case ct.CoinbaseToAltRecipient: {
      const A = e.readBytes(qs), T = Tr(e);
      return wg(A, T);
    }
    case ct.NakamotoCoinbase: {
      const A = e.readBytes(qs), T = Tr(e), B = e.readBytes(lf);
      return p6(A, T, B);
    }
    case ct.TenureChange:
      const w = dt(e.readBytes(20)), y = dt(e.readBytes(20)), v = dt(e.readBytes(20)), S = dt(e.readBytes(32)), I = e.readUInt32BE(), U = e.readUInt8Enum(gf, (A) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${A}`);
      }), P = dt(e.readBytes(20));
      return g6(w, y, v, S, I, U, P);
  }
}
class xu extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Ds extends xu {
  constructor(t) {
    super(t);
  }
}
class yr extends xu {
  constructor(t) {
    super(t);
  }
}
class Ul extends xu {
  constructor(t) {
    super(t);
  }
}
class Ks extends xu {
  constructor(t) {
    super(t);
  }
}
var Kr;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Kr || (Kr = {}));
function yf(e) {
  return db(dt(e.readBytes(mu)));
}
function Xi(e, t) {
  return {
    pubKeyEncoding: e,
    type: Ce.TransactionAuthField,
    contents: t
  };
}
function w6(e) {
  const t = e.readUInt8Enum(Kr, (n) => {
    throw new yr(`Could not read ${n} as AuthFieldType`);
  });
  switch (t) {
    case Kr.PublicKeyCompressed:
      return Xi(Zt.Compressed, pf(e));
    case Kr.PublicKeyUncompressed:
      return Xi(Zt.Uncompressed, a6(pf(e).data));
    case Kr.SignatureCompressed:
      return Xi(Zt.Compressed, yf(e));
    case Kr.SignatureUncompressed:
      return Xi(Zt.Uncompressed, yf(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(t)}`);
  }
}
function Mh(e) {
  return Xt(e.data);
}
function m6(e) {
  const t = [];
  switch (e.contents.type) {
    case Ce.PublicKey:
      t.push(e.pubKeyEncoding === Zt.Compressed ? Kr.PublicKeyCompressed : Kr.PublicKeyUncompressed), t.push(Pl(i6(e.contents.data)));
      break;
    case Ce.MessageSignature:
      t.push(e.pubKeyEncoding === Zt.Compressed ? Kr.SignatureCompressed : Kr.SignatureUncompressed), t.push(Mh(e.contents));
      break;
  }
  return ln(t);
}
function No(e) {
  switch (e.type) {
    case Ce.Address:
      return pc(e);
    case Ce.Principal:
      return vb(e);
    case Ce.LengthPrefixedString:
      return pa(e);
    case Ce.MemoString:
      return v6(e);
    case Ce.AssetInfo:
      return Eb(e);
    case Ce.PostCondition:
      return A6(e);
    case Ce.PublicKey:
      return Pl(e);
    case Ce.LengthPrefixedList:
      return Ph(e);
    case Ce.Payload:
      return Sb(e);
    case Ce.TransactionAuthField:
      return m6(e);
    case Ce.MessageSignature:
      return Mh(e);
  }
}
function b6() {
  return {
    type: Ce.Address,
    version: _l.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Nh(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === Ft.SerializeP2PKH || t === Ft.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === Ft.SerializeP2WPKH || t === Ft.SerializeP2WSH || t === Ft.SerializeP2WSHNonSequential) && !r.every(va))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case Ft.SerializeP2PKH:
      return Ha(e, F6(r[0].data));
    case Ft.SerializeP2WPKH:
      return Ha(e, j6(r[0].data));
    case Ft.SerializeP2SH:
    case Ft.SerializeP2SHNonSequential:
      return Ha(e, R6(n, r.map(Pl)));
    case Ft.SerializeP2WSH:
    case Ft.SerializeP2WSHNonSequential:
      return Ha(e, z6(n, r.map(Pl)));
  }
}
function pc(e) {
  const t = [];
  return t.push(Xt(hc(e.version, 1))), t.push(Xt(e.hash160)), ln(t);
}
function ha(e) {
  const t = yu(dt(e.readBytes(1))), n = dt(e.readBytes(20));
  return { type: Ce.Address, version: t, hash160: n };
}
function vb(e) {
  const t = [];
  return t.push(e.prefix), t.push(pc(e.address)), e.prefix === tc.Contract && t.push(pa(e.contractName)), ln(t);
}
function x6(e) {
  const t = e.readUInt8Enum(tc, (s) => {
    throw new yr(`Unexpected Principal payload type: ${s}`);
  }), n = ha(e);
  if (t === tc.Standard)
    return { type: Ce.Principal, prefix: t, address: n };
  const r = Cr(e);
  return {
    type: Ce.Principal,
    prefix: t,
    address: n,
    contractName: r
  };
}
function pa(e) {
  const t = [], n = Sa(e.content), r = n.byteLength;
  return t.push(Xt(hc(r, e.lengthPrefixBytes))), t.push(n), ln(t);
}
function Cr(e, t, n) {
  t = t || 1;
  const r = yu(dt(e.readBytes(t))), s = kh(e.readBytes(r));
  return ui(s, t, n ?? 128);
}
function S6(e) {
  return ui(e, 4, 1e5);
}
function mg(e) {
  if (e && Lb(e, Ml))
    throw new Error(`Memo exceeds maximum length of ${Ml} bytes`);
  return { type: Ce.MemoString, content: e };
}
function v6(e) {
  const t = [], n = Sa(e.content), r = D6(dt(n), Ml * 2);
  return t.push(Xt(r)), ln(t);
}
function Ab(e) {
  let t = kh(e.readBytes(Ml));
  return t = t.replace(/\u0000*$/, ""), { type: Ce.MemoString, content: t };
}
function Eb(e) {
  const t = [];
  return t.push(pc(e.address)), t.push(pa(e.contractName)), t.push(pa(e.assetName)), ln(t);
}
function wf(e) {
  return {
    type: Ce.AssetInfo,
    address: ha(e),
    contractName: Cr(e),
    assetName: Cr(e)
  };
}
function _h(e, t) {
  return {
    type: Ce.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function Ph(e) {
  const t = e.values, n = [];
  n.push(Xt(hc(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(No(r));
  return ln(n);
}
function kb(e, t, n) {
  const r = yu(dt(e.readBytes(4))), s = [];
  for (let o = 0; o < r; o++)
    switch (t) {
      case Ce.Address:
        s.push(ha(e));
        break;
      case Ce.LengthPrefixedString:
        s.push(Cr(e));
        break;
      case Ce.MemoString:
        s.push(Ab(e));
        break;
      case Ce.AssetInfo:
        s.push(wf(e));
        break;
      case Ce.PostCondition:
        s.push(E6(e));
        break;
      case Ce.PublicKey:
        s.push(pf(e));
        break;
      case Ce.TransactionAuthField:
        s.push(w6(e));
        break;
    }
  return _h(s, n);
}
function A6(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(vb(e.principal)), (e.conditionType === sr.Fungible || e.conditionType === sr.NonFungible) && t.push(Eb(e.assetInfo)), e.conditionType === sr.NonFungible && t.push(sn(e.assetName)), t.push(e.conditionCode), e.conditionType === sr.STX || e.conditionType === sr.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new Ds("The post-condition amount may not be larger than 8 bytes");
    t.push(Ls(e.amount, !1, 8));
  }
  return ln(t);
}
function E6(e) {
  const t = e.readUInt8Enum(sr, (i) => {
    throw new yr(`Could not read ${i} as PostConditionType`);
  }), n = x6(e);
  let r, s, o;
  switch (t) {
    case sr.STX:
      return r = e.readUInt8Enum(ec, (a) => {
        throw new yr(`Could not read ${a} as FungibleConditionCode`);
      }), o = BigInt(`0x${dt(e.readBytes(8))}`), {
        type: Ce.PostCondition,
        conditionType: sr.STX,
        principal: n,
        conditionCode: r,
        amount: o
      };
    case sr.Fungible:
      return s = wf(e), r = e.readUInt8Enum(ec, (a) => {
        throw new yr(`Could not read ${a} as FungibleConditionCode`);
      }), o = BigInt(`0x${dt(e.readBytes(8))}`), {
        type: Ce.PostCondition,
        conditionType: sr.Fungible,
        principal: n,
        conditionCode: r,
        amount: o,
        assetInfo: s
      };
    case sr.NonFungible:
      s = wf(e);
      const i = Tr(e);
      return r = e.readUInt8Enum(df, (a) => {
        throw new yr(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: Ce.PostCondition,
        conditionType: sr.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: i
      };
  }
}
function wo(e, t) {
  return ln([e, t]);
}
function k6(e) {
  return new Uint8Array([e.type]);
}
function $6(e) {
  return e.type === ae.OptionalNone ? new Uint8Array([e.type]) : wo(e.type, sn(e.value));
}
function I6(e) {
  const t = new Uint8Array(4);
  return li(t, e.buffer.length, 0), wo(e.type, wu(t, e.buffer));
}
function L6(e) {
  const t = Eh(P$(e.value, BigInt(W$)), ob);
  return wo(e.type, t);
}
function C6(e) {
  const t = Eh(e.value, ob);
  return wo(e.type, t);
}
function T6(e) {
  return wo(e.type, pc(e.address));
}
function B6(e) {
  return wo(e.type, wu(pc(e.address), pa(e.contractName)));
}
function M6(e) {
  return wo(e.type, sn(e.value));
}
function N6(e) {
  const t = [], n = new Uint8Array(4);
  li(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const s = sn(r);
    t.push(s);
  }
  return wo(e.type, ln(t));
}
function _6(e) {
  const t = [], n = new Uint8Array(4);
  li(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = ui(s);
    t.push(pa(o));
    const i = sn(e.data[s]);
    t.push(i);
  }
  return wo(e.type, ln(t));
}
function $b(e, t) {
  const n = [], r = t == "ascii" ? nb(e.data) : Sa(e.data), s = new Uint8Array(4);
  return li(s, r.length, 0), n.push(s), n.push(r), wo(e.type, ln(n));
}
function P6(e) {
  return $b(e, "ascii");
}
function U6(e) {
  return $b(e, "utf8");
}
function sn(e) {
  switch (e.type) {
    case ae.BoolTrue:
    case ae.BoolFalse:
      return k6(e);
    case ae.OptionalNone:
    case ae.OptionalSome:
      return $6(e);
    case ae.Buffer:
      return I6(e);
    case ae.UInt:
      return C6(e);
    case ae.Int:
      return L6(e);
    case ae.PrincipalStandard:
      return T6(e);
    case ae.PrincipalContract:
      return B6(e);
    case ae.ResponseOk:
    case ae.ResponseErr:
      return M6(e);
    case ae.List:
      return N6(e);
    case ae.Tuple:
      return _6(e);
    case ae.StringASCII:
      return P6(e);
    case ae.StringUTF8:
      return U6(e);
    default:
      throw new Ds("Unable to serialize. Invalid Clarity Value.");
  }
}
function O6(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const bg = /* @__PURE__ */ new Map();
function Ib(e, t) {
  const n = bg.get(e);
  if (n !== void 0)
    return n(t);
  const r = O6(e);
  return bg.set(e, r), Ib(e, t);
}
class Ga {
  constructor(t) {
    this.consumed = 0, this.source = t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return X$(this.readBytes(4), 0);
  }
  readUInt8() {
    return K$(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return z$(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = dt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = dt(n);
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
    if (Ib(t, r))
      return r;
    throw n(r);
  }
}
function Tr(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new Ga(Xt(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new Ga(e) : t = e;
  switch (t.readUInt8Enum(ae, (r) => {
    throw new yr(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case ae.Int:
      return J8(t.readBytes(16));
    case ae.UInt:
      return An(t.readBytes(16));
    case ae.Buffer:
      const r = t.readUInt32BE();
      return yb(t.readBytes(r));
    case ae.BoolTrue:
      return pb();
    case ae.BoolFalse:
      return gb();
    case ae.PrincipalStandard:
      const s = ha(t);
      return q8(s);
    case ae.PrincipalContract:
      const o = ha(t), i = Cr(t);
      return hb(o, i);
    case ae.ResponseOk:
      return e6(Tr(t));
    case ae.ResponseErr:
      return Q8(Tr(t));
    case ae.OptionalNone:
      return wb();
    case ae.OptionalSome:
      return mb(Tr(t));
    case ae.List:
      const a = t.readUInt32BE(), c = [];
      for (let S = 0; S < a; S++)
        c.push(Tr(t));
      return t6(c);
    case ae.Tuple:
      const u = t.readUInt32BE(), h = {};
      for (let S = 0; S < u; S++) {
        const I = Cr(t).content;
        if (I === void 0)
          throw new yr('"content" is undefined');
        h[I] = Tr(t);
      }
      return xr(h);
    case ae.StringASCII:
      const d = t.readUInt32BE(), w = D$(t.readBytes(d));
      return Et(w);
    case ae.StringUTF8:
      const y = t.readUInt32BE(), v = kh(t.readBytes(y));
      return n6(v);
    default:
      throw new yr("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const H6 = (e) => e.length % 2 == 0 ? e : `0${e}`, D6 = (e, t) => e.padEnd(t, "0"), Lb = (e, t) => e ? Sa(e).length > t : !1;
function mf(e) {
  return Xw(e);
}
const nc = (e) => p8(Th(e)), Uh = (e) => dt(K8(e)), F6 = (e) => dt(nc(e)), j6 = (e) => {
  const t = nc(e), n = wu(new Uint8Array([0]), new Uint8Array([t.length]), t), r = nc(n);
  return dt(r);
}, R6 = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((o) => {
    n.push(o.length), n.push(o);
  }), n.push(80 + t.length), n.push(174);
  const r = ln(n), s = nc(r);
  return dt(s);
}, z6 = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + t.length), n.push(174);
  const r = ln(n), s = Th(r), o = [];
  o.push(0), o.push(s.length), o.push(s);
  const i = ln(o), a = nc(i);
  return dt(a);
};
function G6(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function Cb(e) {
  const t = sn(e);
  return `0x${dt(t)}`;
}
function K6(e) {
  return Tr(e);
}
const Zi = (e) => {
  try {
    return wi.c32addressDecode(e), !0;
  } catch {
    return !1;
  }
};
function Oh() {
  return {
    type: Ce.MessageSignature,
    data: dt(new Uint8Array(mu))
  };
}
function Tb(e, t, n, r) {
  const s = Nh(0, e, 1, [fa(t)]).hash160, o = va(fa(t)) ? Zt.Compressed : Zt.Uncompressed;
  return {
    hashMode: e,
    signer: s,
    nonce: qn(n, !1),
    fee: qn(r, !1),
    keyEncoding: o,
    signature: Oh()
  };
}
function rc(e) {
  return "signature" in e;
}
function xg(e) {
  return e === Ft.SerializeP2SH || e === Ft.SerializeP2WSH;
}
function V6(e) {
  return e === Ft.SerializeP2SHNonSequential || e === Ft.SerializeP2WSHNonSequential;
}
function Sg(e) {
  const t = mf(e);
  return t.nonce = 0, t.fee = 0, rc(t) ? t.signature = Oh() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function X6(e) {
  const t = [
    e.hashMode,
    Xt(e.signer),
    Ls(e.nonce, !1, 8),
    Ls(e.fee, !1, 8),
    e.keyEncoding,
    Mh(e.signature)
  ];
  return ln(t);
}
function q6(e) {
  const t = [
    e.hashMode,
    Xt(e.signer),
    Ls(e.nonce, !1, 8),
    Ls(e.fee, !1, 8)
  ], n = _h(e.fields);
  t.push(Ph(n));
  const r = new Uint8Array(2);
  return G$(r, e.signaturesRequired, 0), t.push(r), ln(t);
}
function Y6(e, t) {
  const n = dt(t.readBytes(20)), r = BigInt(`0x${dt(t.readBytes(8))}`), s = BigInt(`0x${dt(t.readBytes(8))}`), o = t.readUInt8Enum(Zt, (a) => {
    throw new yr(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (e === Ft.SerializeP2WPKH && o != Zt.Compressed)
    throw new yr("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const i = yf(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: o,
    signature: i
  };
}
function W6(e, t) {
  const n = dt(t.readBytes(20)), r = BigInt("0x" + dt(t.readBytes(8))), s = BigInt("0x" + dt(t.readBytes(8))), o = kb(t, Ce.TransactionAuthField).values;
  let i = !1, a = 0;
  for (const u of o)
    switch (u.contents.type) {
      case Ce.PublicKey:
        va(u.contents) || (i = !0);
        break;
      case Ce.MessageSignature:
        if (u.pubKeyEncoding === Zt.Uncompressed && (i = !0), a += 1, a === 65536)
          throw new Ks("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = t.readUInt16BE();
  if (i && (e === Ft.SerializeP2WSH || e === Ft.SerializeP2WSHNonSequential))
    throw new Ks("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    fields: o,
    signaturesRequired: c
  };
}
function Qu(e) {
  return rc(e) ? X6(e) : q6(e);
}
function ed(e) {
  const t = e.readUInt8Enum(Ft, (n) => {
    throw new yr(`Could not parse ${n} as AddressHashMode`);
  });
  return t === Ft.SerializeP2PKH || t === Ft.SerializeP2WPKH ? Y6(t, e) : W6(t, e);
}
function Bb(e, t, n, r) {
  const o = e + dt(new Uint8Array([t])) + dt(Ls(n, !1, 8)) + dt(Ls(r, !1, 8));
  if (Xt(o).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Uh(Xt(o));
}
function Mb(e, t, n) {
  const r = 33 + mu, s = va(t) ? Zt.Compressed : Zt.Uncompressed, o = e + H6(s.toString(16)) + n.data, i = Xt(o);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return Uh(i);
}
function Z6(e, t, n, r, s) {
  const o = Bb(e, t, n, r), i = l6(s, o), a = u6(s), c = Mb(o, a, i);
  return {
    nextSig: i,
    nextSigHash: c
  };
}
function Nb(e, t, n, r, s, o) {
  const i = Bb(e, t, n, r), a = fa(r6(i, o, s)), c = Mb(i, a, o);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function J6() {
  const e = Tb(Ft.SerializeP2PKH, "", 0, 0);
  return e.signer = b6().hash160, e.keyEncoding = Zt.Compressed, e.signature = Oh(), e;
}
function vg(e, t, n) {
  return rc(e) ? Q6(e, t, n) : e5(e, t, n);
}
function Q6(e, t, n) {
  const { pubKey: r, nextSigHash: s } = Nb(t, n, e.fee, e.nonce, e.keyEncoding, e.signature), o = Nh(0, e.hashMode, 1, [r]).hash160;
  if (o !== e.signer)
    throw new Ks(`Signer hash does not equal hash of public key(s): ${o} != ${e.signer}`);
  return s;
}
function e5(e, t, n) {
  const r = [];
  let s = t, o = !1, i = 0;
  for (const c of e.fields)
    switch (c.contents.type) {
      case Ce.PublicKey:
        va(c.contents) || (o = !0), r.push(c.contents);
        break;
      case Ce.MessageSignature:
        c.pubKeyEncoding === Zt.Uncompressed && (o = !0);
        const { pubKey: u, nextSigHash: h } = Nb(s, n, e.fee, e.nonce, c.pubKeyEncoding, c.contents);
        if (xg(e.hashMode) && (s = h), r.push(u), i += 1, i === 65536)
          throw new Ks("Too many signatures");
        break;
    }
  if (xg(e.hashMode) && i !== e.signaturesRequired || V6(e.hashMode) && i < e.signaturesRequired)
    throw new Ks("Incorrect number of signatures");
  if (o && (e.hashMode === Ft.SerializeP2WSH || e.hashMode === Ft.SerializeP2WSHNonSequential))
    throw new Ks("Uncompressed keys are not allowed in this hash mode");
  const a = Nh(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new Ks(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return s;
}
function _b(e) {
  return {
    authType: nn.Standard,
    spendingCondition: e
  };
}
function Pb(e, t) {
  return {
    authType: nn.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || Tb(Ft.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function Ag(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case nn.Standard:
        return _b(Sg(e.spendingCondition));
      case nn.Sponsored:
        return Pb(Sg(e.spendingCondition), J6());
      default:
        throw new Ul("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function t5(e, t) {
  switch (e.authType) {
    case nn.Standard:
      return vg(e.spendingCondition, t, nn.Standard);
    case nn.Sponsored:
      return vg(e.spendingCondition, t, nn.Standard);
    default:
      throw new Ul("Invalid origin auth type");
  }
}
function n5(e, t) {
  switch (e.authType) {
    case nn.Standard:
      const n = {
        ...e.spendingCondition,
        fee: qn(t, !1)
      };
      return { ...e, spendingCondition: n };
    case nn.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: qn(t, !1)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function r5(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: qn(t, !1)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function o5(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: qn(t, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function s5(e, t) {
  const n = {
    ...t,
    nonce: qn(t.nonce, !1),
    fee: qn(t.fee, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function i5(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case nn.Standard:
      t.push(Qu(e.spendingCondition));
      break;
    case nn.Sponsored:
      t.push(Qu(e.spendingCondition)), t.push(Qu(e.sponsorSpendingCondition));
      break;
  }
  return ln(t);
}
function a5(e) {
  const t = e.readUInt8Enum(nn, (r) => {
    throw new yr(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case nn.Standard:
      return n = ed(e), _b(n);
    case nn.Sponsored:
      n = ed(e);
      const r = ed(e);
      return Pb(n, r);
  }
}
class c5 {
  constructor(t, n, r, s, o, i, a) {
    if (this.version = t, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: qn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? q$, this.postConditionMode = o ?? da.Deny, this.postConditions = s ?? _h([]), i)
      this.anchorMode = Q$(i);
    else
      switch (r.payloadType) {
        case ct.Coinbase:
        case ct.CoinbaseToAltRecipient:
        case ct.NakamotoCoinbase:
        case ct.PoisonMicroblock:
        case ct.TenureChange:
          this.anchorMode = or.OnChainOnly;
          break;
        case ct.ContractCall:
        case ct.SmartContract:
        case ct.VersionedSmartContract:
        case ct.TokenTransfer:
          this.anchorMode = or.Any;
          break;
      }
  }
  signBegin() {
    const t = mf(this);
    return t.auth = Ag(t.auth), t.txid();
  }
  verifyBegin() {
    const t = mf(this);
    return t.auth = Ag(t.auth), t.txid();
  }
  verifyOrigin() {
    return t5(this.auth, this.verifyBegin());
  }
  signNextOrigin(t, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, t, nn.Standard, n);
  }
  signNextSponsor(t, n) {
    if (this.auth.authType === nn.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, t, nn.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(t) {
    const n = this.auth.spendingCondition;
    if (n && !rc(n)) {
      const r = va(t);
      n.fields.push(Xi(r ? Zt.Compressed : Zt.Uncompressed, t));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, s) {
    const { nextSig: o, nextSigHash: i } = Z6(n, r, t.fee, t.nonce, s);
    return rc(t) ? t.signature = o : t.fields.push(Xi(s.data.byteLength === rb ? Zt.Compressed : Zt.Uncompressed, o)), i;
  }
  txid() {
    const t = this.serialize();
    return Uh(t);
  }
  setSponsor(t) {
    if (this.auth.authType != nn.Sponsored)
      throw new Ul("Cannot sponsor sign a non-sponsored transaction");
    this.auth = s5(this.auth, t);
  }
  setFee(t) {
    this.auth = n5(this.auth, t);
  }
  setNonce(t) {
    this.auth = r5(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != nn.Sponsored)
      throw new Ul("Cannot sponsor sign a non-sponsored transaction");
    this.auth = o5(this.auth, t);
  }
  serialize() {
    if (this.version === void 0)
      throw new Ds('"version" is undefined');
    if (this.chainId === void 0)
      throw new Ds('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Ds('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Ds('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Ds('"payload" is undefined');
    const t = [];
    t.push(this.version);
    const n = new Uint8Array(4);
    return li(n, this.chainId, 0), t.push(n), t.push(i5(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(Ph(this.postConditions)), t.push(Sb(this.payload)), ln(t);
  }
}
function qi(e) {
  let t;
  typeof e == "string" ? e.slice(0, 2).toLowerCase() === "0x" ? t = new Ga(Xt(e.slice(2))) : t = new Ga(Xt(e)) : e instanceof Uint8Array ? t = new Ga(e) : t = e;
  const n = t.readUInt8Enum(Nl, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = t.readUInt32BE(), s = a5(t), o = t.readUInt8Enum(or, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), i = t.readUInt8Enum(da, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = kb(t, Ce.PostCondition), c = y6(t);
  return new c5(n, s, c, a, i, o, r);
}
const l5 = W8, Ka = An, u5 = yb;
const d5 = /* @__PURE__ */ new Set([4001, -31001]), f5 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], h5 = ["result", "data", "payload", "response", "params"], Eg = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Su = (e) => typeof e == "string" && e.toLowerCase().includes("xverse"), Si = () => {
  if (!(typeof window > "u")) {
    try {
      const e = window.top;
      if (e && e !== window.self && e.location.origin === window.location.origin)
        return e;
    } catch {
    }
    return window;
  }
}, Oo = (e, t) => {
  if (!(!e || !t))
    return t.split(".").reduce((n, r) => n == null ? void 0 : n[r], e);
}, p5 = (e, t) => e.id === t.id || !!(e.name && t.name && e.name.toLowerCase() === t.name.toLowerCase()), Ub = (e) => {
  if (!e)
    return [];
  const t = e, n = [
    ...t.btc_providers ?? [],
    ...t.webbtc_providers ?? [],
    ...t.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((o) => p5(o, r)) === s
  );
}, Ob = (e) => e ? Ub(Si()).some(
  (t) => {
    var n;
    return t.id === e && (Su(t.id) || ((n = t.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Hb = () => {
  if (typeof window > "u")
    return;
  const e = Si(), t = Ub(e).filter(
    (n) => {
      var r;
      return Su(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of t) {
    const r = Oo(e, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of f5) {
    const r = Oo(e, n) ?? (e === window ? void 0 : Oo(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, g5 = (e) => {
  if (typeof window > "u" || !e)
    return;
  const t = Si(), n = Oo(t, e) ?? (t === window ? void 0 : Oo(window, e)) ?? au(e);
  if (n)
    return n;
  if (Su(e) || Ob(e))
    return Hb();
}, qc = (e, t) => {
  try {
    e == null || e(t);
  } catch {
  }
}, y5 = ["blockstack-session", "blockstack"], w5 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const e of y5) {
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
w5();
const Db = (e) => e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e, pr = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}, m5 = (e) => {
  const t = pr(e);
  if (!t)
    return null;
  const n = Db(t);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : t.startsWith("0x") || t.startsWith("0X") ? t : `0x${n}`;
}, b5 = (e) => {
  const t = pr(e);
  if (!t)
    return null;
  const n = Db(t);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, bf = (e, t = "mainnet") => {
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
      return bf(n.network, t);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return bf(r, t);
  }
  return t;
}, Ys = (e) => {
  if (typeof e > "u" || e === null)
    return;
  if (typeof e == "bigint")
    return e.toString(10);
  if (typeof e == "number")
    return Number.isFinite(e) ? String(e) : void 0;
  const t = String(e).trim();
  return t.length > 0 ? t : void 0;
}, oc = (e, t = 0) => {
  if (t > 8)
    return null;
  if (typeof e == "string") {
    const s = e.trim();
    return Zi(s) ? s : null;
  }
  if (!e)
    return null;
  if (Array.isArray(e)) {
    for (const s of e) {
      const o = oc(s, t + 1);
      if (o)
        return o;
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
  for (const s of r) {
    if (!(s in n))
      continue;
    const o = oc(n[s], t + 1);
    if (o)
      return o;
  }
  return typeof n.mainnet == "string" && Zi(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Zi(n.testnet) ? n.testnet.trim() : null;
}, kg = (e) => {
  const t = e && typeof e == "object" && "code" in e ? e.code : void 0, r = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Fb = (e) => {
  if (e && typeof e == "object") {
    const r = "code" in e ? e.code : void 0;
    if (typeof r == "number" && d5.has(r))
      return !0;
  }
  const n = (e instanceof Error ? e.message : String(e ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, di = (e) => {
  if (e instanceof Error)
    return e;
  const t = e && typeof e == "object" ? e : {}, n = t.error && typeof t.error == "object" ? t.error : null, r = pr(n == null ? void 0 : n.message) ?? pr(t.message) ?? pr(t.error) ?? pr(e) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? t.code, s.data = (n == null ? void 0 : n.data) ?? t.data, s;
}, ga = (e) => {
  if (e && typeof e == "object") {
    const t = e;
    if (t.error)
      throw di(t);
    if (t.status === "error")
      throw di(t.result ?? t);
  }
  return e;
}, $g = async (e, t, n) => {
  if (typeof e.request != "function")
    throw new Error(`Wallet provider does not support request("${t}").`);
  try {
    const r = await e.request(t, n);
    return ga(r);
  } catch (r) {
    throw di(r);
  }
}, jb = () => Hb(), Hh = () => {
  if (typeof window > "u")
    return;
  const e = Si();
  for (const t of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Oo(e, t) ?? (e === window ? void 0 : Oo(window, t));
    if (n)
      return n;
  }
}, Ig = () => {
  if (typeof window > "u")
    return;
  const e = Hh();
  if (typeof (e == null ? void 0 : e.transactionRequest) == "function")
    return e;
  const t = Si();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Oo(t, n) ?? (t === window ? void 0 : Oo(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, ul = (e) => {
  var r, s;
  const t = ni();
  if (Su(t) || Ob(t))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Si() ?? window;
  return e === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || e === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || e === jb();
}, td = (e) => {
  const t = b5(e);
  if (!t)
    return null;
  try {
    const n = qi(t).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Ol = (e, t = 0) => {
  if (t > 6 || typeof e > "u" || e === null)
    return null;
  const n = td(e), r = m5(e) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? pr(e) ?? void 0 : void 0
    };
  if (Array.isArray(e)) {
    for (const a of e) {
      const c = Ol(a, t + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof e != "object")
    return null;
  const s = e;
  let o = null;
  for (const a of Eg)
    if (td(s[a])) {
      o = pr(s[a]);
      break;
    }
  const i = pr(s.txId) || pr(s.txid) || pr(s.transactionId);
  if (i)
    return {
      ...s,
      txId: i,
      txid: i,
      txRaw: o ?? pr(s.txRaw) ?? void 0
    };
  for (const a of Eg) {
    const c = td(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: pr(s[a]) ?? void 0
      };
  }
  for (const a of h5) {
    const c = s[a], u = Ol(c, t + 1);
    if (u)
      return {
        ...s,
        ...c && typeof c == "object" ? c : {},
        ...u,
        txId: u.txId,
        txid: u.txid ?? u.txId
      };
  }
  return null;
}, nd = (e) => {
  const t = Ol(e);
  if (t)
    return t;
  throw new Error("Wallet response did not include a transaction id.");
}, x5 = (e) => {
  const t = Ol(e);
  return t || (e && typeof e == "object" ? e : { result: e });
}, S5 = (e) => ({
  ...e,
  fee: Ys(e.fee),
  nonce: Ys(e.nonce),
  sponsored: e.sponsored === !0
}), Lg = (e) => ({
  recipient: e.recipient,
  amount: Ys(e.amount) ?? "0",
  memo: e.memo,
  network: bf(e.network),
  address: e.stxAddress,
  fee: Ys(e.fee),
  nonce: Ys(e.nonce),
  sponsored: e.sponsored ?? !1
}), Rb = "WALLET_ADDRESS_MISMATCH", v5 = 45e3;
let Va = null;
const xf = (e) => {
  e && (Va = { address: e, at: Date.now() });
}, A5 = () => {
  Va = null;
}, E5 = () => Va && Date.now() - Va.at <= v5 ? Va.address : null, k5 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t.includes("network mismatch") || t.includes("mismatch") && t.includes("network");
}, $5 = async (e) => {
  A5();
  try {
    await e.request("wallet_disconnect");
  } catch {
  }
  const t = ga(await e.request("wallet_connect")), n = oc(t);
  return xf(n), n;
}, I5 = async (e, t, n, r) => {
  try {
    return ga(await e.request(t, n));
  } catch (s) {
    const o = di(s);
    if (!k5(o))
      throw o;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: t,
      message: o.message
    });
    let i = null;
    try {
      i = await $5(e);
    } catch (a) {
      throw console.info("[wallet:xverse-preflight]", {
        stage: "RECOVERY_RECONNECT_FAILED",
        message: a instanceof Error ? a.message : String(a)
      }), o;
    }
    if (!i || r && i !== r)
      throw Object.assign(
        new Error(
          i ? `Xverse reconnected as ${i}, not the expected ${r}. Switch back to that account and retry.` : o.message
        ),
        { code: i ? Rb : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: t, address: i });
    try {
      return ga(await e.request(t, n));
    } catch (a) {
      throw di(a);
    }
  }
};
let Cg = 3e4;
const L5 = (e, t) => {
  let n;
  const r = new Promise((s, o) => {
    n = setTimeout(() => {
      o(
        Object.assign(
          new Error(`Xverse did not answer ${t} within ${Cg / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, Cg);
  });
  return Promise.race([e, r]).finally(() => {
    n && clearTimeout(n);
  });
}, C5 = async (e, t, n) => {
  const r = (c, u) => {
    if (t && c !== t)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${t}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Rb }
      );
    return c;
  }, s = E5();
  if (s)
    return qc(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let o = null;
  qc(n, "account-read");
  try {
    const c = ga(
      await L5(e.request("wallet_getAccount"), "wallet_getAccount")
    );
    o = oc(c), console.info("[wallet:xverse-preflight]", {
      stage: o ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: o
    });
  } catch (c) {
    if (Fb(c))
      throw di(c);
    qc(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (o)
    return xf(o), r(o, "wallet_getAccount");
  let i;
  qc(n, "account-reconnect");
  try {
    i = ga(await e.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), di(c);
  }
  const a = oc(i);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return xf(a), r(a, "wallet_connect");
}, T5 = async (e, t) => {
  if (!ul(e)) {
    const o = await $g(
      e,
      "stx_transferStx",
      Lg(t)
    );
    return nd(o);
  }
  const n = Hh();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const o = await $g(
      n,
      "stx_transferStx",
      Lg(t)
    );
    return nd(o);
  }
  const r = jb();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await C5(r, t.stxAddress);
  const s = await I5(
    r,
    "stx_transferStx",
    {
      recipient: t.recipient,
      amount: Ys(t.amount) ?? "0",
      ...t.memo ? { memo: t.memo } : {},
      ...t.fee !== void 0 ? { fee: Ys(t.fee) } : {}
    },
    t.stxAddress
  );
  return nd(s);
}, B5 = () => ni(), zb = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const e = ni(), t = e ? g5(e) : void 0;
  if (t)
    return t;
  const n = Si() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, Tg = (e, t) => {
  const n = zb(), r = S5({
    ...e,
    onFinish: (s) => {
      var o;
      (o = e.onFinish) == null || o.call(e, x5(s));
    }
  });
  if (!n || typeof n.request != "function")
    return Gc(r, t);
  if (ul(n) && !Hh()) {
    const s = Ig();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: ni(),
        route: "legacy-transaction-request"
      }), Gc(r, s);
  }
  return void T5(n, e).then((s) => {
    var o;
    (o = e.onFinish) == null || o.call(e, s);
  }).catch((s) => {
    var o, i;
    if (kg(s) && ul(n)) {
      const a = Ig();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: ni(),
          route: "legacy-transaction-request"
        }), Gc(r, a);
        return;
      }
    }
    if (kg(s) && !ul(n)) {
      Gc(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Fb(s)) {
      (o = e.onCancel) == null || o.call(e);
      return;
    }
    if (e.onError) {
      e.onError(s);
      return;
    }
    (i = e.onCancel) == null || i.call(e);
  });
}, M5 = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), Bg = (e) => Cb(e).replace(/^0x/, ""), Mg = "This wallet cannot sign messages. Try Xverse or Leather.", Ng = (e) => typeof (e == null ? void 0 : e.request) == "function", _g = (e) => typeof (e == null ? void 0 : e.structuredDataSignatureRequest) == "function", N5 = (e) => {
  const t = e && typeof e == "object" ? e.code : void 0, n = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, _5 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(t) || t.includes("no longer supported") || t.includes("request() rpc") || t.includes("upgrade to the");
};
async function P5(e, t) {
  const n = await e.request("stx_signStructuredMessage", {
    message: Bg(t.message),
    domain: Bg(t.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function U5(e, t) {
  const n = await L$({
    domain: t.domain,
    message: t.message,
    network: gu(t.network),
    stxAddress: t.stxAddress,
    appDetails: t.appDetails ?? M5()
  }), r = await e.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function rd(e) {
  var s, o;
  const t = B5() || "", n = /xverse/i.test(t);
  let r = zb();
  if (n && !_g(r)) {
    const i = window;
    r = ((s = i.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((o = i.xverseProviders) == null ? void 0 : o.StacksProvider);
  }
  if (_g(r))
    try {
      return await U5(r, e);
    } catch (i) {
      if (n || !Ng(r) || !_5(i)) throw i;
    }
  if (!n && Ng(r))
    try {
      return await P5(r, e);
    } catch (i) {
      throw N5(i) ? new Error(Mg) : i;
    }
  throw new Error(Mg);
}
const Pg = 1000000n, Po = 1000000n, Hl = 50n, an = 3000n, Wr = 300n, Ba = 3000n, O5 = 50000n, H5 = 300n, D5 = 200n, vu = 15000n, jn = (e) => e + Hl;
function jr(e) {
  const t = e < 0n ? "-" : "", n = e < 0n ? -e : e;
  return `${t}${n / Pg}.${(n % Pg).toString().padStart(6, "0")}`;
}
function Ug(e, t = Wr) {
  return e <= an ? 0 : Number((e - an) / jn(t));
}
function od(e, t = 0n) {
  const n = Po - e - t;
  return n > 0n ? n : 0n;
}
function F5(e, t = Wr) {
  return e > Po ? "over" : e < an + jn(t) ? "empty" : e < O5 ? "low" : "ok";
}
const j5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", R5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", z5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function G5(e) {
  var n, r, s, o;
  const t = (e == null ? void 0 : e.success) === !0 ? (n = e.value) == null ? void 0 : n.value : null;
  return !t || ((r = t.version) == null ? void 0 : r.value) !== "1" || ((s = t["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((o = t["receipt-bytes"]) == null ? void 0 : o.value) !== "16" || z5.some((i, a) => {
    var c;
    return ((c = t["core-" + (a + 1)]) == null ? void 0 : c.value) !== j5 + "." + i;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Gb = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", sd = 3, K5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", V5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-music-awards-v1-0", Og = 1, [Sf, Kb] = Gb.split("."), $r = (e) => Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
function vf(e) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(e)) throw Error("Invalid encoded data.");
  return Uint8Array.from(e.match(/../g), (t) => parseInt(t, 16));
}
async function X5(e) {
  return $r(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(e))));
}
async function $s(e, t = {}) {
  const n = await fetch("/hiro/mainnet" + e, { ...t, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Vb(e, t = []) {
  const n = await $s(`/v2/contracts/call-read/${Sf}/${Kb}/${e}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Sf, arguments: t.map((r) => "0x" + $r(sn(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Gr(Tr(n.result));
}
async function q5() {
  const e = await $s(`/v2/contracts/source/${Sf}/${Kb}?proof=0`);
  if (typeof e.source != "string" || await X5(e.source) !== R5) throw Error("Deployed source does not match the tested helper.");
  if (G5(await Vb("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Xb(e) {
  return e.startsWith("SP") && Zi(e) && !e.includes(".");
}
async function Y5(e) {
  var r;
  if (!Xb(e)) throw Error("Invalid mainnet wallet address.");
  const t = await $s(`/v2/accounts/${e}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(t.balance) || !Number.isSafeInteger(t.nonce) || t.nonce < 0) throw Error("Malformed account data.");
  const n = await $s(`/extended/v1/address/${e}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== t.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= t.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(t.balance), nonce: BigInt(t.nonce) };
}
async function W5(e) {
  const t = await $s(`/v2/accounts/${e}?proof=0`);
  return BigInt(t.balance);
}
async function Z5(e, t) {
  var s, o;
  const n = await Vb("get-owner", [Ka(e), Ka(t)]), r = (n == null ? void 0 : n.success) === !0 ? (o = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : o.value : null;
  if (typeof r != "string" || !Xb(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function J5(e, t) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: vf(e), signal: AbortSignal.timeout(15e3) });
  } catch {
    throw Error("Submission outcome unknown. Reconcile the saved transaction before doing anything else.");
  }
  const r = await n.json();
  if (n.status === 400 && (r == null ? void 0 : r.reason) === "FeeTooLow") {
    const s = new Error("Node rejected the fee as too low. No automatic increase. Preview a new test with another fee.");
    throw Object.assign(s, { feeRejected: !0 }), s;
  }
  if (!n.ok || typeof r != "string" || r.replace(/^0x/, "") !== t.replace(/^0x/, "")) throw Error(`Submission unconfirmed (${n.status}). Reconcile or resend the same saved transaction; do not create a replacement.`);
  return r;
}
async function Q5(e) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(e)) throw Error("Invalid transaction ID.");
  const t = await fetch(`/hiro/mainnet/extended/v1/tx/${e}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (t.status === 404) return null;
  if (!t.ok) throw Error("Transaction lookup unavailable.");
  return t.json();
}
function eI(e) {
  if (!e.raw || e.raw.length > 16384 || !e.txid) throw Error("Missing or oversized signed transaction.");
  const t = qi(vf(e.raw)), n = t.auth, r = t.payload, s = n.spendingCondition;
  if (t.version !== 0 || t.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || Vi(Ha(_l.MainnetSingleSig, s.signer)) !== e.address || s.fee !== BigInt(e.fee) || s.nonce !== BigInt(e.nonce) || t.txid() !== e.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (t.verifyOrigin(), e.kind === "play") {
    const o = t.postConditions.values[0];
    if (r.payloadType !== 2 || Vi(r.contractAddress) + "." + r.contractName.content !== Gb || r.functionName.content !== "play" || r.functionArgs.length !== 3 || $r(sn(r.functionArgs[0])) !== $r(sn(Ka(e.core))) || $r(sn(r.functionArgs[1])) !== $r(sn(Ka(e.song))) || $r(sn(r.functionArgs[2])) !== $r(sn(u5(vf(e.id)))) || e.amount !== "50" || t.postConditionMode !== da.Deny || t.postConditions.values.length !== 1 || o.conditionType !== 0 || o.amount !== 50n || o.conditionCode !== ec.Equal || o.principal.prefix !== 2 || Vi(o.principal.address) !== e.address) throw Error("Saved play protection or master does not match.");
  } else if (e.kind === "like") {
    if (r.payloadType !== 2 || Vi(r.contractAddress) + "." + r.contractName.content !== K5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || $r(sn(r.functionArgs[0])) !== $r(sn(Ka(e.song))) || typeof e.liked != "boolean" || $r(sn(r.functionArgs[1])) !== $r(sn(l5(e.liked))) || e.amount !== "0" || t.postConditionMode !== da.Deny || t.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || Gr(r.recipient).value !== e.recipient || r.amount !== BigInt(e.amount)) throw Error("Saved withdrawal does not match.");
}
const tI = "xtrata.xyz/radio/listening-wallet", nI = "Link a temporary listening wallet for pay-per-play; no spending permission", co = (e) => typeof e == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(e) && Zi(e), rI = (e) => ({
  domain: xr({ name: Et(tI), version: Et("1"), "chain-id": An(1) }),
  message: xr({
    purpose: Et(nI),
    main: Et(e.main),
    listening: Et(e.listening),
    issued: An(e.issued)
  })
}), qb = 100000n, oI = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function sI(e, t) {
  const n = e.filter((s) => !s || typeof s.sender != "string" || s.sender === t || !co(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= qb).sort(oI);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const Yc = 50;
function Dl(e) {
  const t = e;
  if (!t || typeof t.total != "number" || !Number.isSafeInteger(t.total) || t.total < 0 || !Array.isArray(t.results)) return null;
  const n = [];
  for (const r of t.results) {
    if (typeof (r == null ? void 0 : r.sender) != "string" || typeof r.amount != "string" || typeof r.tx_id != "string") return null;
    const s = Number(r.block_height), o = Number(r.tx_index ?? 0);
    if (!Number.isSafeInteger(s) || !Number.isSafeInteger(o)) return null;
    n.push({ sender: r.sender, amount: r.amount, txId: r.tx_id, blockHeight: s, txIndex: o });
  }
  return { total: t.total, transfers: n };
}
async function iI(e, t, n = 4) {
  if (!co(e)) return { ok: !1 };
  try {
    const r = (i) => `/extended/v1/address/${e}/stx_inbound?limit=${Yc}&offset=${i}`, s = Dl(await t(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let o = Math.max(0, s.total - Yc);
    for (let i = 0; i < n; i++) {
      const a = o === 0 && s.total <= Yc ? s : Dl(await t(r(o)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = sI(a.transfers, e);
      if (c.ok && c.funder) return o > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (o === 0) return c;
      o = Math.max(0, o - Yc);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const To = 50, aI = 6, cI = 20, Hg = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function Dg(e, t) {
  const n = e;
  if (!n || typeof n.total != "number" || !Number.isSafeInteger(n.total) || n.total < 0 || !Array.isArray(n.results)) return null;
  const r = [], s = [];
  for (const o of n.results) {
    const i = o && typeof o == "object" && o.tx && typeof o.tx == "object" ? o.tx : o;
    if (!i || typeof i.tx_id != "string" || typeof i.tx_type != "string") return null;
    if (s.push(i.tx_id), i.tx_type !== "token_transfer" || i.sender_address !== t || i.tx_status !== "success") continue;
    const a = i.token_transfer;
    if (!a || typeof a.recipient_address != "string" || typeof a.amount != "string" || !/^\d+$/.test(a.amount)) return null;
    const c = Number(i.block_height), u = Number(i.tx_index ?? 0);
    if (!Number.isSafeInteger(c) || !Number.isSafeInteger(u)) return null;
    r.push({ recipient: a.recipient_address, amount: BigInt(a.amount), txId: i.tx_id, blockHeight: c, txIndex: u });
  }
  return { total: n.total, sent: r, rows: s };
}
async function lI(e, t, n) {
  if (!co(e)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = Dl(await t(`/extended/v1/address/${e}/stx_inbound?limit=${To}&offset=0`));
    if (!s || s.total > aI * To) return { ok: !1 };
    for (const i of s.transfers) r.set(i.txId + ":" + i.txIndex, i);
    for (let i = To; i < s.total; i += To) {
      const a = Dl(await t(`/extended/v1/address/${e}/stx_inbound?limit=${To}&offset=${i}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const o = /* @__PURE__ */ new Map();
    if (n) {
      const i = (u) => `/extended/v1/address/${e}/transactions?limit=${To}&offset=${u}`, a = Dg(await t(i(0)), e);
      if (!a || a.total > cI * To) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) o.set(u.txId, u);
      for (let u = To; u < a.total; u += To) {
        const h = Dg(await t(i(u)), e);
        if (!h || !h.rows.length) return { ok: !1 };
        for (const d of h.rows) c.add(d);
        for (const d of h.sent) o.set(d.txId, d);
      }
      if (c.size !== a.total) return { ok: !1 };
    }
    return { ok: !0, inbound: [...r.values()], outgoing: [...o.values()] };
  } catch {
    return { ok: !1 };
  }
}
function uI(e) {
  const { self: t, balance: n, gift: r } = e;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...e.inbound].filter((d) => d && typeof d.sender == "string" && d.sender !== t && /^\d+$/.test(d.amount) && BigInt(d.amount) > 0n).sort(Hg).map((d, w) => {
    const y = BigInt(d.amount);
    return r && d.sender === r.sender ? { sender: d.sender, left: y, kind: "gift", to: r.payer, at: w } : co(d.sender) && y >= qb ? { sender: d.sender, left: y, kind: "deposit", to: d.sender, at: w } : { sender: d.sender, left: y, kind: "dust", to: null, at: w };
  }), o = s.reduce((d, w) => d + w.left, 0n), i = [...e.outgoing].filter((d) => d && d.recipient !== t && co(d.recipient) && d.amount > 0n).sort(Hg), a = i.reduce((d, w) => d + w.amount, 0n), c = o - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const u = (d, w) => {
    let y = w;
    for (const v of d) {
      if (y <= 0n) break;
      const S = v.left < y ? v.left : y;
      v.left -= S, y -= S;
    }
    return y;
  };
  for (const d of i) {
    const w = u(s.filter((y) => y.to === d.recipient), d.amount);
    w > 0n && u(s, w);
  }
  if (u(s, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (s.reduce((d, w) => d + w.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const h = /* @__PURE__ */ new Map();
  for (const d of s) {
    if (d.left <= 0n) continue;
    const w = `${d.kind}:${d.to ?? ""}`, y = h.get(w);
    y ? (y.amount += d.left, y.newest = Math.max(y.newest, d.at)) : h.set(w, { to: d.to, kind: d.kind, amount: d.left, newest: d.at });
  }
  return {
    ok: !0,
    parts: [...h.values()].sort((d, w) => d.newest - w.newest),
    hasTopUp: s.some((d) => d.kind === "deposit")
  };
}
function dI(e, t) {
  const n = e.filter((u) => u.kind === "deposit").sort((u, h) => u.newest - h.newest), r = e.find((u) => u.kind === "gift"), s = e.filter((u) => u.kind === "dust"), o = ((r == null ? void 0 : r.amount) ?? 0n) + s.reduce((u, h) => u + h.amount, 0n), i = [], a = [], c = o > t;
  return n.forEach((u, h) => {
    if (u.amount <= t) {
      a.push(u);
      return;
    }
    const d = h === n.length - 1 && !c;
    i.push({ to: u.to, kind: "deposit", mode: d ? "all" : "amount", send: u.amount - t });
  }), c ? i.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: o - t }) : (r && a.push(r), a.push(...s)), { steps: i, tooSmall: a };
}
function Fg(e) {
  const t = e.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (t == null ? void 0 : t.to) ?? null;
}
const Wc = 1500n, dl = [100, 250, 500], fI = (e, t) => BigInt(e) * jn(t), Ma = ["prepared", "signed", "unknown", "pending"], hI = 30 * 6e4, Fl = 6e4, Oi = (e) => {
  const t = e;
  return (t == null ? void 0 : t.feeRejected) === !0 || /\(400\)/.test((t == null ? void 0 : t.message) ?? "");
}, pI = 3e3, jl = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", id = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (e) => e.toString(16).padStart(2, "0")).join("");
function gI(e) {
  let t = null, n = -1 / 0, r, s = null, o = null, i, a = -1 / 0, c = null, u = null, h = !1, d = !1, w = !1, y = null, v = !1, S = "", I = "", U = 0, P, A = null, T, B = [], X, Q = -1 / 0;
  const oe = /* @__PURE__ */ new Set();
  let Y = null, m = !1, L = 0, _ = null, N = null, W = !1, j = null, ye = !1, ce = null, Xe = !1, $ = !1, R = !1, ue = !1, me = !1, _e = 0, ve = null, mt = Promise.resolve();
  const ze = () => BigInt((t == null ? void 0 : t.limits.playFee) ?? Wr.toString()), Ne = (b) => !!o && !(o.features ?? []).includes(b), Pe = (b, k) => `xtrata.ppp.v1.${b}:${k}`, _n = "xtrata.ppp.v1.as-main", En = () => {
    if (e.main()) return;
    const b = e.store.get(_n);
    return b && co(b) ? b : void 0;
  }, gt = () => e.main() ?? En(), Ct = (b = o == null ? void 0 : o.address) => {
    if (!b) return [];
    try {
      const k = JSON.parse(e.store.get(Pe("entries", b)) || "[]");
      return Array.isArray(k) ? k : [];
    } catch {
      return [];
    }
  }, Ht = (b) => {
    const k = [b, ...Ct(b.address).filter((K) => !(K.txid === b.txid && K.kind === b.kind))].slice(0, 200);
    e.store.set(Pe("entries", b.address), JSON.stringify(k));
  }, z = (b = o == null ? void 0 : o.address) => !!b && e.store.get(Pe("on", b)) !== "0", O = (b) => {
    o != null && o.address && e.store.set(Pe("on", o.address), b ? "1" : "0");
  }, ee = () => Ct().filter((b) => Ma.includes(b.status)), re = () => Ye() ? [...ee(), ...Ct(et()).filter((b) => Ma.includes(b.status))] : ee(), le = () => xt(o == null ? void 0 : o.address), xt = (b) => {
    if (!b) return null;
    try {
      return JSON.parse(e.store.get(Pe("deposit", b)) || "null");
    } catch {
      return null;
    }
  }, De = (b, k = o == null ? void 0 : o.address) => {
    k && e.store.set(Pe("deposit", k), JSON.stringify(b));
  };
  let Fe = null;
  const Mt = (b = Fl) => {
    const k = e.now();
    Fe = { since: Fe && k < Fe.until ? Fe.since : k, until: Math.max((Fe == null ? void 0 : Fe.until) ?? 0, k + b) };
  }, je = () => !!Fe && e.now() < Fe.until && (i === void 0 || i < an + jn(ze())), Ee = () => !!le() || je(), et = () => Ne("rootLike") ? o == null ? void 0 : o.address : (o == null ? void 0 : o.root) ?? (o == null ? void 0 : o.address), Ye = () => !!(o != null && o.address) && et() !== o.address, Ze = () => Ye() ? c && c.for === et() ? c.value : void 0 : i, zt = () => Ne("likeFee") ? D5 : H5, un = (b) => b !== void 0 && b < an + zt(), Yn = () => ee().filter((b) => e.now() - b.created > hI && oe.has(b.txid)), hn = () => (t == null ? void 0 : t.passkeyOnly) === !0 && (!gt() || r === gt() && !t.allowed), Nt = () => hn() && !(o != null && o.linked), Wn = () => {
    const b = gt();
    return !Nt() && !!b && !!(o != null && o.linked) && o.linked !== b;
  }, zn = (b) => Pe("return-to", b), Zr = (b = o == null ? void 0 : o.address) => {
    if (!b) return;
    const k = e.store.get(zn(b));
    return k && co(k) && k !== b ? k : void 0;
  }, Br = (b = o == null ? void 0 : o.address) => Y && Y.for === b ? Y.res : null;
  function kn() {
    if (!(o != null && o.address)) return;
    if (o.linked) return { to: o.linked, kind: "linked" };
    const b = Zr();
    if (b) return { to: b, kind: "chosen" };
    const k = Br();
    if (k != null && k.ok && k.funder) return { to: k.funder, kind: "funder" };
  }
  const $n = (b) => Pe("gift", b);
  function Rt() {
    const b = o == null ? void 0 : o.address;
    if (!b) return null;
    if ((j == null ? void 0 : j.for) === b) return j.info;
    try {
      const k = JSON.parse(e.store.get($n(b)) || "null");
      return k && typeof k.returnTo == "string" && typeof k.treasury == "string" ? k : null;
    } catch {
      return null;
    }
  }
  const pn = () => (o == null ? void 0 : o.state) === "unlocked" ? o.root ?? o.address : ((o == null ? void 0 : o.slot) ?? 0) === 0 ? o == null ? void 0 : o.address : void 0;
  let Re = null, on = null, mo = !1;
  const Jr = (b) => Pe("award-claim", b), E = (b) => Pe("award-send", b), H = (b) => {
    try {
      const k = JSON.parse(e.store.get(E(b)) || "null");
      return k && typeof k.txid == "string" && e.now() - k.at < 2 * 36e5 ? k : null;
    } catch {
      return null;
    }
  }, V = (b) => {
    try {
      const k = JSON.parse(e.store.get(Jr(b)) || "null");
      return k && typeof k.txid == "string" && e.now() - k.at < 2 * 36e5 ? k : null;
    } catch {
      return null;
    }
  };
  async function D(b = !1) {
    var ke;
    const k = pn();
    if (!k || !e.awardStatus || mo) return;
    const K = (Re == null ? void 0 : Re.for) === k ? Re : null, te = K == null ? void 0 : K.view.state, Be = te === "not-a-player" && ((ke = Rt()) == null ? void 0 : ke.drop) === "players", q = K ? Be ? 2e4 : te === "off" || te === "not-a-player" ? 30 * 6e4 : V(k) || H(k) ? 2e4 : te === "claimed" ? 10 * 6e4 : 6e4 : 0;
    if (!(K && !b && e.now() - K.at < q)) {
      mo = !0;
      try {
        const xe = await e.awardStatus(k);
        if (Re = { for: k, view: xe, at: e.now() }, xe.state === "claimed" && e.store.set(Jr(k), ""), xe.state === "claimed" && xe.holds === !1 && e.store.set(E(k), ""), xe.state === "ready" && e.awardName && (on == null ? void 0 : on.for) !== k)
          try {
            on = { for: k, name: await e.awardName(k), at: e.now() };
          } catch {
            on = { for: k, name: void 0, at: e.now() };
          }
      } catch {
        Re = { for: k, view: K && K.view.state !== "off" && K.view.state !== "not-a-player" ? { ...K.view, state: "unavailable" } : { state: "unavailable" }, at: e.now() };
      } finally {
        mo = !1;
      }
    }
  }
  function J() {
    const b = pn();
    if (!b || (Re == null ? void 0 : Re.for) !== b) return null;
    const k = Re.view;
    if (k.state === "off" || k.state === "not-a-player") return null;
    const K = k.state === "claimed" ? null : V(b), te = k.state === "claimed" && k.holds !== !1 ? H(b) : null;
    return { ...k, ...(on == null ? void 0 : on.for) === b ? { name: on.name } : {}, ...K ? { claimTx: K.txid } : {}, ...te ? { sendTx: te.txid } : {} };
  }
  async function se() {
    var Be;
    const b = o == null ? void 0 : o.address;
    if (!b || !e.giftInfo || !((Be = t == null ? void 0 : t.gifts) != null && Be.enabled) || ye) return;
    const k = (j == null ? void 0 : j.for) === b ? j : null, K = k ? k.ok ? k.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (k && e.now() - k.at < K) return;
    ye = !0;
    const te = Rt();
    try {
      const q = await e.giftInfo(b);
      j = { for: b, info: q, ok: !0, at: e.now() }, e.store.set($n(b), JSON.stringify(q));
    } catch {
      j = { for: b, info: te, ok: !1, at: e.now() };
    } finally {
      ye = !1;
    }
  }
  const Le = () => Ct().reduce((b, k) => Ma.includes(k.status) ? b + BigInt(k.amount || "0") + BigInt(k.fee || "0") : b, 0n);
  function Ae() {
    if (i === void 0) return 0;
    const b = i - Le() - BigInt(qt.length) * jn(ze());
    return b > 0n ? Ug(b, ze()) : 0;
  }
  const Ge = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", Tt = "EMPTY — ADD STX TO PLAY";
  function We() {
    if (!(t != null && t.here)) return null;
    const b = (k, K) => ({ reason: k, text: K });
    switch (Ve()) {
      case "connect":
      case "wrong-wallet":
        return b("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "intro":
        return b("setup", "SET UP YOUR PLAYER TO LISTEN");
      case "loading":
        return b("checking", "CHECKING YOUR LISTENING WALLET");
      case "unsupported":
        return b("unavailable", "OPEN IN A BROWSER THAT SUPPORTS PASSKEYS");
      case "not-invited":
      case "off":
        return b("unavailable", "PAID RADIO IS UNAVAILABLE");
      case "locked":
        return b("locked", "UNLOCK TO LISTEN");
      case "link":
        return b("link", "FINISH SETUP TO LISTEN");
      case "over":
        return b("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return Ee() ? b("arriving", "YOUR PLAYS ARE ARRIVING") : b("out", Ye() ? Ge : Tt);
      case "ready":
        return !z() || !(o != null && o.session) || o.session.playsLeft < 1 || o.session.expires <= e.now() ? b("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : R ? Ae() < 1 ? b("out", Ye() ? Ge : Tt) : null : b("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const ft = () => {
    var b;
    return !!(o != null && o.address) && Ye() && !!((b = Rt()) != null && b.player);
  };
  function St() {
    return ft() ? { locked: !0, known: !0 } : null;
  }
  const yt = 3 * 6e4, _t = () => !!Rt() && !!e.history && !(o != null && o.linked);
  async function C() {
    const b = o.address, k = Rt(), { balance: K, nonce: te } = await e.chain.account(b), Be = await e.history(b, !0);
    if (!Be.ok) return null;
    const q = uI({ self: b, balance: K, inbound: Be.inbound, outgoing: Be.outgoing, gift: { sender: k.treasury, payer: k.returnTo } });
    if (!q.ok) return null;
    const ke = dI(q.parts, Ba);
    return { balance: K, nonce: te, parts: q.parts, steps: ke.steps, tooSmall: ke.tooSmall.length };
  }
  const $e = () => Xe ? { state: "unavailable" } : !ce || e.now() - ce.at > yt || i !== void 0 && i !== ce.balance ? { state: "none" } : ce.plan;
  function Ve() {
    if (!(t != null && t.enabled)) return "off";
    if (!t.here) return "elsewhere";
    const b = gt();
    if (!Nt()) {
      if (!b) return "connect";
      if (!t.allowed) return "not-invited";
    }
    return o ? o.state === "unsupported" ? "unsupported" : o.state === "none" ? "intro" : Wn() ? "wrong-wallet" : o.state === "known" ? "locked" : !Nt() && o.linked !== b ? "link" : i === void 0 ? "loading" : i > Po && !o.backedUp ? "over" : i < an + jn(ze()) ? "fund" : "ready" : "loading";
  }
  const Mr = () => {
    var b, k, K, te, Be;
    return {
      step: Ve(),
      busy: u,
      message: S,
      error: I,
      notice: Nr(),
      gate: t,
      main: gt(),
      mainConnected: !!e.main(),
      standIn: En(),
      listening: o == null ? void 0 : o.address,
      linked: o == null ? void 0 : o.linked,
      award: J(),
      unproven: !!(o != null && o.unproven),
      phrase: !!(o != null && o.hasBackup),
      backedUp: !!(o != null && o.backedUp),
      balance: i,
      balanceState: i === void 0 ? void 0 : ((q) => q === "over" && (o != null && o.backedUp) ? "ok" : q)(F5(i, ze())),
      // backed up: over 1 STX reads as a healthy balance
      aboveTarget: i !== void 0 && i > Po && !!(o != null && o.backedUp),
      playsLeft: i === void 0 ? 0 : Ug(i, ze()),
      allowance: i === void 0 ? Po : od(i, BigInt(((b = le()) == null ? void 0 : b.amount) ?? "0")),
      session: (o == null ? void 0 : o.session) ?? null,
      payingOn: z(),
      entries: Ct(),
      depositTxid: ((k = le()) == null ? void 0 : k.txid) ?? P,
      depositPending: Ee(),
      arrival: Ee() ? { since: ((K = le()) == null ? void 0 : K.at) ?? (Fe == null ? void 0 : Fe.since) ?? e.now(), graceMs: Fl } : null,
      walletOutdated: Ne("like"),
      canAnother: !!o && !Ne("another"),
      canForget: !!o && !Ne("forget"),
      passkeyName: o == null ? void 0 : o.passkeyName,
      hadGift: o != null && o.address && (j == null ? void 0 : j.for) === o.address && j.ok ? !!j.info : null,
      linkedListening: X && X === gt() ? B.map((q) => q.listening) : [],
      serverLinked: !!A && T === `${gt()}:${o == null ? void 0 : o.address}`,
      stuck: Yn().length,
      armed: ue,
      queued: qt.length,
      solo: Nt(),
      returnTo: (te = kn()) == null ? void 0 : te.to,
      returnToKind: (Be = kn()) == null ? void 0 : Be.kind,
      funderState: (() => {
        const q = Br();
        return q ? q.ok ? q.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const q = Br();
        return !!q && q.ok && q.distinct > 1;
      })(),
      walletCannotSolo: Nt() && Ne("standalone"),
      walletCannotMulti: Ne("multi"),
      others: ((o == null ? void 0 : o.others) ?? []).filter((q) => q !== gt() && q !== (o == null ? void 0 : o.linked)),
      creditedTo: Nt() && (o != null && o.address) && (_ == null ? void 0 : _.for) === o.address && _.main ? _.main : void 0,
      createdHere: !!(o != null && o.address) && e.store.get(Pe("created", o.address)) === "1",
      brandNew: !!(o != null && o.address) && i === 0n && (N == null ? void 0 : N.for) === o.address && N.unused,
      gift: (() => {
        const q = Rt();
        return q ? { player: q.player, from: q.from, source: q.source, amount: q.amount, ...q.drop !== void 0 ? { drop: q.drop } : {} } : null;
      })(),
      giftPlays: Rt() ? Ae() : 0,
      playCost: jn(ze()),
      giftStop: We(),
      albumLock: St(),
      returnPlan: $e(),
      slot: (o == null ? void 0 : o.state) === "unlocked" ? o.slot ?? 0 : 0,
      root: (o == null ? void 0 : o.state) === "unlocked" ? o.root ?? o.address : void 0,
      walletCannotAlbums: Ne("slots"),
      likeFunds: (() => {
        var xe;
        const q = et();
        if (!q || (o == null ? void 0 : o.state) !== "unlocked") return null;
        const ke = Ze();
        return { address: q, balance: ke, low: un(ke), album: Ye(), pending: !!xt(q), txid: (xe = xt(q)) == null ? void 0 : xe.txid, main: gt() };
      })()
    };
  }, Nr = () => U ? U < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", ut = (b, k = "") => {
    S = b, I = k, e.changed();
  };
  async function Jt(b, k) {
    if (!u) {
      u = b, I = "", e.changed();
      try {
        await k();
      } catch (K) {
        const te = K instanceof Error ? K.message : String(K);
        I = /Cancelled in the listening wallet/.test(te) ? "" : te, I || (S = "Not now. Nothing was signed.", me = !0);
      } finally {
        u = null, await In(!0);
      }
    }
  }
  const vi = () => !!(t != null && t.enabled) && t.here && (Nt() || !!gt() && t.allowed), Sr = () => vi() && !Wn(), jo = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", Zn = () => {
    if (Wn()) throw new Error(jo());
  };
  async function Jn() {
    if (!vi()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(t != null && t.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return s ?? (s = await e.bridge(t.walletOrigin)), s;
  }
  const gn = (b) => {
    const k = gt();
    return b.request("listening.status", k ? { main: k } : void 0);
  };
  async function _r(b = !1) {
    o != null && o.address && (!b && e.now() - a < 3e4 || (i = await e.chain.balance(o.address), a = e.now(), await Ts(b)));
  }
  async function Ts(b = !1) {
    const k = et();
    if (!(!Ye() || !k || (o == null ? void 0 : o.state) !== "unlocked") && !(!b && (c == null ? void 0 : c.for) === k && e.now() - c.at < 3e4))
      try {
        c = { for: k, value: await e.chain.balance(k), at: e.now() };
      } catch {
      }
  }
  async function ht(b) {
    if ((X !== b || e.now() - Q >= 6e4) && (B = await e.links(b), X = b, Q = e.now()), (o == null ? void 0 : o.state) !== "unlocked" || o.linked === b) return;
    const k = `${b}:${o.address}`;
    T === k && A || (A = B.find((K) => K.listening === o.address) ?? null, T = k);
  }
  async function bo() {
    const b = o == null ? void 0 : o.address;
    if (!Nt() || !b || o != null && o.linked || !e.funder || m || !i || i <= 0n) return;
    const k = Br(b);
    if (k != null && k.ok && k.funder) return;
    const K = k != null && k.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, L - 1), 30 * 6e4);
    if (!(Y && Y.for === b && e.now() - Y.at < K)) {
      m = !0;
      try {
        Y = { for: b, res: await e.funder(b), at: e.now() };
      } catch {
        Y = { for: b, res: { ok: !1 }, at: e.now() };
      } finally {
        m = !1;
      }
      L = Y.res.ok ? 0 : L + 1;
    }
  }
  async function Ai() {
    const b = o == null ? void 0 : o.address;
    if (!(!Nt() || !b || o != null && o.linked || !e.mainOf || W) && !(_ && _.for === b && (_.ok || e.now() - _.at < 6e4))) {
      W = !0;
      try {
        _ = { for: b, main: await e.mainOf(b), ok: !0, at: e.now() };
      } catch {
        _ = { for: b, main: null, ok: !1, at: e.now() };
      } finally {
        W = !1;
      }
    }
  }
  async function xo() {
    const b = o == null ? void 0 : o.address;
    if (!(!b || (o == null ? void 0 : o.state) !== "unlocked" || i !== 0n || (N == null ? void 0 : N.for) === b) && e.store.get(Pe("created", b)) !== "1")
      try {
        N = { for: b, unused: await e.chain.confirmedNonce(b) === 0n };
      } catch {
      }
  }
  async function Ei() {
    var Be;
    const b = o == null ? void 0 : o.address;
    if (!b) return !1;
    let k, K = !1;
    const te = /* @__PURE__ */ new Map();
    for (const q of re())
      try {
        const ke = await e.chain.transaction(q.txid);
        if (!ke) {
          if (oe.add(q.txid), e.now() - q.created > 15 * 6e4 && !te.has(q.address) && te.set(q.address, await e.chain.confirmedNonce(q.address)), k = te.get(q.address), k !== void 0 && k > BigInt(q.nonce)) {
            Ht({ ...q, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((q.status === "unknown" || q.status === "signed") && q.raw)
            try {
              await e.chain.broadcast(q.raw, q.txid), Ht({ ...q, status: "pending" });
            } catch (Me) {
              Oi(Me) && Ht({ ...q, status: "failed", note: Me.message, raw: void 0 });
            }
          continue;
        }
        oe.delete(q.txid);
        const xe = String(ke.tx_status);
        if (xe === "success" && ke.canonical !== !1 && ke.is_unanchored === !1) {
          if (Ht({ ...q, status: "confirmed", confirmedAt: e.now(), actualFee: String(ke.fee_rate ?? q.fee), raw: void 0 }), K = !0, q.kind === "like" && (v = !0, q.status !== "confirmed" && typeof q.liked == "boolean"))
            try {
              (Be = e.likeConfirmed) == null || Be.call(e, q.song, q.liked);
            } catch {
            }
        } else xe.startsWith("abort_") || xe.startsWith("dropped_") ? Ht({ ...q, status: "failed", note: xe, raw: void 0 }) : q.status !== "pending" && Ht({ ...q, status: "pending" });
      } catch {
      }
    for (const q of Ye() ? [b, et()] : [b]) {
      const ke = xt(q);
      if (ke)
        try {
          const xe = await e.chain.transaction(ke.txid), Me = String((xe == null ? void 0 : xe.tx_status) ?? "");
          (Me === "success" && xe.is_unanchored === !1 || Me.startsWith("abort_") || Me.startsWith("dropped_") || !xe && e.now() - ke.at > 2 * 36e5) && (De(null, q), Me === "success" && Mt(2e4), a = -1 / 0, c = null, /on its way/i.test(S) && (S = ""));
        } catch {
        }
    }
    return K;
  }
  async function In(b = !1) {
    var k;
    try {
      const K = gt();
      if ((b || !t || r !== K || e.now() - n > 3e5) && (t = await e.config(K), n = e.now(), r = K), !t.enabled || !t.here || !Nt() && (!K || !t.allowed)) {
        s && (o != null && o.session) && await s.request("listening.stop").catch(() => {
        }), ue && Bs(), e.changed();
        return;
      }
      await Jn(), o = await gn(s), Wn() && o.state === "unlocked" && (eo(), await s.request("listening.lock").catch(() => {
      }), i = void 0, o = await gn(s)), K && t.allowed && await ht(K), await _r(b), await bo(), await Ai(), await xo(), await se(), await D(), await Ei() && await _r(!0), await Ts(), await $i(), U = 0;
    } catch {
      U++;
    }
    if (Ve() === "locked" ? ki() : ue && Bs(), v) {
      v = !1;
      try {
        (k = e.likesChanged) == null || k.call(e);
      } catch {
      }
    }
    e.changed(), qt.length && !Qr && er();
  }
  async function Ro(b) {
    const k = o == null ? void 0 : o.root;
    if (!k || o != null && o.slot || !(o != null && o.address) || Ne("slots")) return;
    const K = Number(e.store.get(Pe("slot", k)));
    if (!(!Number.isSafeInteger(K) || K < 1))
      try {
        const { balance: te } = await e.chain.account(o.address);
        if (te >= an + jn(ze())) return;
        await b.request("listening.openSlot", { slot: K }), o = await gn(b), i = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function So(b, k) {
    var q;
    Zn();
    const K = !(o != null && o.address) || z(o.address), te = o != null && o.linked ? (q = e.nameOf) == null ? void 0 : q.call(e, o.linked) : void 0;
    await b.request("listening.unlock", { mode: "unlock", terms: K ? vo() : void 0, anyPasskey: k, ...gt() ? { main: gt() } : {}, ...te ? { label: te } : {} }), o = await gn(b), K && (z(o.address) ? await Ln() : await b.request("listening.stop")), await Ro(b), ut(K ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const Be = y;
    y = null, Be && e.now() - Be.at < 12e4 && setTimeout(() => void In(!0).then(() => _s(Be)), 0);
  }
  function ki() {
    ue || u || me || _e >= 3 || !s || !(o != null && o.address) || (ue = !0, mt = (async () => {
      try {
        await So(s, !1), _e = 0;
      } catch (b) {
        const k = b instanceof Error ? b.message : String(b);
        /Cancelled in the listening wallet/.test(k) ? ve || (me = !0, ut("Not now. Nothing was signed.")) : /did not answer/.test(k) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (_e++, I = k);
      } finally {
        ue = !1;
        const b = ve;
        ve = null, b ? await b() : await In(!0);
      }
    })());
  }
  async function Bs(b) {
    ue && (ve = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await mt), b && await b(), e.changed();
  }
  const vo = () => ({
    fee: ze().toString(),
    maxPlays: t.limits.maxSessionPlays,
    budget: Po.toString(),
    expires: e.now() + t.limits.sessionHours * 36e5
  });
  async function Ln() {
    if (!(o != null && o.address)) return !1;
    if (R || (R = await e.tabLock(o.address)), !R)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function Pn(b, k) {
    const K = o.address, { balance: te, nonce: Be } = k ?? await e.chain.account(K);
    i = te;
    const q = await s.request("listening.prepareReturn", {
      mode: b.mode,
      balance: te.toString(),
      nonce: Be.toString(),
      fee: Ba.toString(),
      ...b.amount !== void 0 ? { amount: b.amount.toString() } : {},
      ...b.linked ? {} : { destination: b.to }
    });
    if (q.recipient !== b.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const ke = b.mode === "amount" ? b.amount : b.mode === "all" ? te - Ba : te - Po - Ba, xe = qi(q.raw);
    if (Gr(xe.payload.recipient).value !== b.to || String(xe.payload.amount) !== q.amount || ke !== void 0 && q.amount !== ke.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const Me = {
      id: id(),
      address: K,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: q.recipient,
      amount: q.amount,
      fee: q.fee,
      nonce: Be.toString(),
      created: e.now(),
      status: "signed",
      raw: q.raw,
      txid: q.txid
    };
    e.validate(Me), Ht(Me);
    try {
      await e.chain.broadcast(q.raw, q.txid), Ht({ ...Me, status: "pending" });
    } catch (tt) {
      throw Ht({ ...Me, status: "unknown", note: tt.message }), tt;
    }
    return q;
  }
  const zo = vu, vr = Ba;
  async function Ms(b, k, K) {
    if ((o == null ? void 0 : o.state) !== "unlocked" || !o.address) throw new Error("Unlock the listening wallet first.");
    if (Ne("slots") || Ne("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const te = o.slot ?? 0;
    if (b === k || ![b, k].includes(te) || ![b, k].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const Be = o.root ?? o.address, q = b === 0 ? Be : o.address, ke = k === 0 ? Be : o.address, { balance: xe, nonce: Me } = await e.chain.account(q);
    if (xe < K + vr + an) throw new Error(b === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const tt = await s.request("listening.signMove", { from: b, to: k, amount: K.toString(), fee: vr.toString(), nonce: Me.toString(), balance: xe.toString() }), x = qi(tt.raw);
    if (tt.from !== q || tt.to !== ke || tt.amount !== K.toString() || Gr(x.payload.recipient).value !== ke || String(x.payload.amount) !== K.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const M = {
      id: id(),
      address: q,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: ke,
      amount: tt.amount,
      fee: tt.fee,
      nonce: Me.toString(),
      created: e.now(),
      status: "signed",
      raw: tt.raw,
      txid: tt.txid
    };
    e.validate(M), Ht(M);
    try {
      await e.chain.broadcast(tt.raw, tt.txid), Ht({ ...M, status: "pending" });
    } catch (G) {
      throw Ht({ ...M, status: "unknown", note: G.message }), G;
    }
    return De({ txid: tt.txid, amount: tt.amount, at: e.now() }, ke), ke === Be && Be !== o.address ? c = null : a = -1 / 0, tt;
  }
  let Ao = !1;
  const Ns = /* @__PURE__ */ new Map(), Ar = (b) => Pe("float", b);
  async function $i() {
    if (Ao || (o == null ? void 0 : o.state) !== "unlocked" || !Ye() || Ne("move") || Ne("rootLike") || !o.address) return;
    const b = o.address;
    if (e.store.get(Ar(b)) === "1") return;
    const k = Rt();
    if (!(k != null && k.player) || k.state !== "arrived") return;
    const K = Ze();
    if (K === void 0 || i === void 0) return;
    if (!un(K)) {
      e.store.set(Ar(b), "1");
      return;
    }
    if (xt(et()) || Eo() || re().length || i < zo * 4n + an + vr) return;
    const te = Ns.get(b);
    if (!(te && (te.n >= 3 || e.now() - te.at < 5 * 6e4))) {
      Ao = !0, Ns.set(b, { n: ((te == null ? void 0 : te.n) ?? 0) + 1, at: e.now() });
      try {
        await Ms(o.slot ?? 0, 0, zo), e.store.set(Ar(b), "1");
      } catch (Be) {
        console.warn("[radio] likes float not sent yet", Be);
      } finally {
        Ao = !1;
      }
    }
  }
  async function yn(b) {
    if (ee().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Ne("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const k = await C().catch(() => null);
    if (!k)
      throw ce = null, Xe = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    Xe = !1, i = k.balance;
    const K = { balance: k.balance, nonce: k.nonce };
    if (b === "excess") {
      const xe = Fg(k.parts) ?? Zr();
      if (!xe) throw new Error("Choose where to send the excess first.");
      await Pn({ mode: "excess", to: xe, linked: !1 }, K), ce = null, ut("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const te = k.steps;
    if (!te.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!ce && ce.balance === k.balance && e.now() - ce.at <= yt && ce.steps.length === te.length && ce.steps.every((xe, Me) => xe.to === te[Me].to && xe.mode === te[Me].mode && xe.send === te[Me].send))) {
      ce = {
        at: e.now(),
        balance: k.balance,
        steps: te,
        parts: k.parts,
        plan: { state: "ready", steps: te.map((xe) => ({ to: xe.to, kind: xe.kind, send: xe.send.toString() })), kept: k.tooSmall, excess: Fg(k.parts) }
      }, ut(te.length > 1 ? `This goes back in ${te.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const q = te[0], ke = q.to ?? Zr();
    if (!ke) throw new Error("Choose where to send the rest first.");
    if (q.mode === "amount" && Ne("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await Pn({ mode: q.mode, to: ke, linked: !1, ...q.mode === "amount" ? { amount: q.send } : {} }, K), ce = null, te.length === 1 ? (O(!1), ut("Returned ✓ Paying is off.")) : ut(`Returned ✓ ${te.length - 1} more ${te.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  async function Er() {
    if (!(o != null && o.unproven)) return;
    const b = await Jn();
    await b.request("listening.prove"), o = await gn(b);
  }
  const Qn = {
    forceRefresh: () => In(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (b) => {
      if (!e.main() && !(b !== null && !co(b))) {
        if (b === En()) return In(!0);
        e.store.set(_n, b ?? ""), I = "", S = "", i = void 0, a = -1 / 0, c = null, await In(!0);
      }
    },
    /**
     * Remove the open player from this device (the wallet box asks in its own panel; the passkey is not touched). Only
     * the listener's own player, only when it is empty and nothing is on its way: checked here as well as on the page.
     */
    forget: () => Jt("Check the listening wallet…", async () => {
      const b = await Jn();
      if (Ne("forget")) throw new Error("The listening wallet box needs an update before it can do this. Try again shortly.");
      if ((o == null ? void 0 : o.state) !== "unlocked" || (o.slot ?? 0) !== 0) throw new Error("Unlock your own player first.");
      if (i === void 0) throw new Error("Could not read what this player holds. Nothing was removed.");
      if (i > BigInt((t == null ? void 0 : t.limits.returnFee) ?? "3000")) throw new Error("Empty this player first. Nothing was removed.");
      if (ee().length) throw new Error("Wait for the pending payment to confirm. Nothing was removed.");
      eo(), await b.request("listening.forget"), i = void 0, o = await gn(b), O(!1), ut("Removed from this device ✓");
    }),
    /** `quick`: a free starter player is being claimed, so the wallet box may put off its second passkey check. */
    create: (b) => Jt("Waiting for your passkey…", async () => {
      const k = await Jn(), K = !!(b != null && b.another) && !e.main() && !Ne("another");
      K && (o == null ? void 0 : o.state) === "unlocked" && await k.request("listening.lock"), await k.request("listening.unlock", { mode: "create", terms: vo(), ...e.main() ? { main: e.main() } : {}, ...b != null && b.quick && !e.main() ? { quick: !0 } : {}, ...K ? { another: !0 } : {} }), o = await gn(k), o.address && e.store.set(Pe("created", o.address), "1"), O(!0), ut(Nt() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await Ln();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** The intro song has started for someone claiming a new player: its play waits for the plays to land (30 minutes at most). */
    holdFirstPlay: () => {
      Ii = e.now() + Cn;
    },
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (b) => {
      b ? Mt() : Fe = null, e.changed();
    },
    giftSent: (b, k) => {
      !(o != null && o.address) || le() || (De({ txid: b, amount: k.toString(), at: e.now() }), a = -1 / 0, j = null, Re && (Re = { ...Re, at: -1 / 0 }), ut("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (b) => {
      if (Zn(), (o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Ne("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await Jn()).request("listening.bindSlot", { slot: b, issued: e.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (b, k, K, te) => {
      De({ txid: K, amount: te.toString(), at: e.now() }, k), j = null, await Qn.openAlbum(b), ut("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (b) => Jt("Opening…", async () => {
      if (Zn(), (o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Ne("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (h || d || w) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((o.slot ?? 0) === b) return;
      eo(), await s.request("listening.openSlot", { slot: b }), o = await gn(s), i = void 0, a = -1 / 0, ce = null, Xe = !1;
      const k = o.root;
      k && b > 0 && e.store.set(Pe("slot", k), String(b)), ut(b === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (b = !1) => {
      const k = () => Jt("Waiting for your passkey…", async () => So(await Jn(), b));
      return ue ? b ? Ne("cancel") ? (ut("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Bs(async () => {
        (Ve() === "locked" || Ve() === "intro") && await k();
      }) : mt : k();
    },
    link: () => Jt("Sign in your wallet…", async () => {
      Zn();
      const b = e.main();
      if (!b || !(o != null && o.address)) throw new Error("Connect your main wallet first.");
      const k = (await e.links(b)).find((K) => K.listening === o.address);
      if (k)
        await s.request("listening.link", { main: b, issued: k.issued, mainSignature: k.mainSignature });
      else {
        const K = { main: b, listening: o.address, issued: e.now() }, te = await e.signWithMain(b, rI(K)), Be = await s.request("listening.link", { main: b, issued: K.issued, mainSignature: te });
        await e.saveLink({ ...K, mainSignature: te, listeningSignature: Be.listeningSignature }), Q = -1 / 0;
      }
      ut("Linked ✓");
    }),
    /**
     * Before the listener adds anything of their own: a starter player whose passkey was checked once gets its second
     * check now. Resolves true once the wallet is proven (or always was); false if the check failed or was closed.
     */
    prove: async () => o != null && o.unproven ? (await Jt("One more passkey check…", Er), !(o != null && o.unproven)) : !0,
    deposit: () => Jt("Approve the deposit in your wallet…", async () => {
      Zn(), await Er();
      const b = e.main();
      if (!b || !(o != null && o.address)) throw new Error("Connect your main wallet first.");
      if (le()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (je()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await _r(!0);
      const k = od(i ?? 0n);
      if (k <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      P = await e.deposit(b, o.address, k), P && De({ txid: P, amount: k.toString(), at: e.now() }), ut("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => Jt("Approve the top-up in your wallet…", async () => {
      Zn(), await Er();
      const b = e.main(), k = et();
      if (!b || !k) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (xt(k)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const K = await e.chain.balance(k);
      Ye() ? c = { for: k, value: K, at: e.now() } : (i = K, a = e.now());
      const te = od(K);
      if (te <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const Be = await e.deposit(b, k, te);
      Be && De({ txid: Be, amount: te.toString(), at: e.now() }, k), ut("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (b) => Jt("Adding plays…", async () => {
      if (Zn(), !Ye()) throw new Error("Open the album you want to add plays to first.");
      if (!dl.includes(b)) throw new Error("Choose one of the amounts offered.");
      const k = fI(b, ze());
      if (h || d || w) throw new Error("Still sending a payment. Try again in a moment.");
      if (re().length || le()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await Ms(0, o.slot ?? 0, k), ut("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => Jt("Confirm in the listening wallet…", async () => {
      if (!Sr()) throw new Error("Connect your wallet first.");
      await Ln(), await s.request("listening.approveSession", vo()), O(!0), ut("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => Jt("Clearing…", async () => {
      for (const b of Yn())
        await e.chain.transaction(b.txid) || Ht({ ...b, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      ut("Cleared ✓");
    }),
    switchOff: () => Jt("Switching off…", async () => {
      eo(), await (s == null ? void 0 : s.request("listening.stop")), O(!1), ut("Music support is off. Playback is paused.");
    }),
    /**
     * Write down the backup words. The wallet box shows them and asks three back; this page never sees a word, only
     * that it was done. For a player that has a phrase, while it is open.
     */
    backup: () => Jt("Showing your backup words in the box…", async () => {
      if (!(o != null && o.hasBackup)) throw new Error("This player was made before backup words existed, so it has none.");
      const b = await Jn();
      await b.request("listening.backup"), o = await gn(b), ut("Backed up ✓ Keep those 24 words somewhere safe and private.");
    }),
    /**
     * The open player signs a request about the albums it keeps (releases.ts). No panel: it is a structured message
     * that can move nothing. Rejects when the player is locked or the wallet box is too old.
     */
    signShelf: async (b, k) => {
      if ((o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock your player first.");
      if (Ne("shelf")) throw new Error("The listening wallet box needs an update before it can keep albums. Try again shortly.");
      return (await Jn()).request("listening.signShelf", { action: b, ...k ? { release: k } : {} });
    },
    /** Ask again where the player's record stands, and what name it would carry (after linking a wallet, say). */
    awardRefresh: async () => {
      on = null, await D(!0), e.changed();
    },
    /**
     * Claim the player's Music Hero record. The server signs the record (with the name, or the address alone); the
     * wallet box reads it, shows it and signs the claim; this page sends it. The player pays the network fee only.
     */
    claimAward: (b) => Jt("Confirm in the listening wallet…", async () => {
      var Me, tt, x, M;
      const k = pn();
      if ((o == null ? void 0 : o.state) !== "unlocked" || !k) throw new Error("Unlock your player first.");
      if (!e.awardNote) throw new Error("Awards are not available here.");
      if (Ne("award")) throw new Error("The listening wallet box needs an update before it can claim a record. Try again shortly.");
      if (V(k)) throw new Error("Your claim is already on its way. It usually confirms in a minute or two.");
      if (h || d || w || re().length) throw new Error("A payment is still confirming. Claim as soon as it has.");
      await Ln();
      const K = await e.awardNote(k, b), { balance: te, nonce: Be } = await e.chain.account(k);
      if (te < Wc) throw new Error("Your player needs a little STX for the network fee to claim. Add plays first.");
      const ke = await (await Jn()).request("listening.signAward", {
        cls: K.cls,
        number: K.number,
        plays: K.plays,
        record: K.record,
        signature: K.signature,
        fee: Wc.toString(),
        nonce: Be.toString(),
        balance: te.toString()
      }), xe = qi(ke.raw);
      if (ke.hero !== k || ke.number !== K.number || ((tt = (Me = xe.payload) == null ? void 0 : Me.functionName) == null ? void 0 : tt.content) !== "claim" || ((M = (x = xe.payload) == null ? void 0 : x.contractName) == null ? void 0 : M.content) !== V5.split(".")[1])
        throw new Error("The signed claim does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(ke.raw, ke.txid), e.store.set(Jr(k), JSON.stringify({ txid: ke.txid, at: e.now() })), a = -1 / 0, Re && (Re = { ...Re, at: -1 / 0 }), ut("Record claimed ✓ It is being made now: about a minute.");
    }),
    /**
     * Send the player's claimed record to another address. The wallet box shows the inscription and the full address
     * and the listener confirms there; the transaction can move that one inscription and nothing else.
     */
    sendAward: (b) => Jt("Confirm in the listening wallet…", async () => {
      var tt, x, M;
      const k = pn(), K = J();
      if ((o == null ? void 0 : o.state) !== "unlocked" || !k) throw new Error("Unlock your player first.");
      if ((K == null ? void 0 : K.state) !== "claimed" || K.inscription === void 0) throw new Error("There is no record to send yet.");
      if (K.holds === !1) throw new Error("This record has already been sent.");
      if (K.holds !== !0) throw new Error("Could not check that your player still holds the record. Try again shortly.");
      if (H(k)) throw new Error("Your record is already on its way.");
      const te = b.trim();
      if (!co(te)) throw new Error("Enter a Stacks address starting SP. A .btc name will not work here.");
      if (te === k) throw new Error("That is your player itself. Enter the address to send it to.");
      if (Ne("sendRecord")) throw new Error("The listening wallet box needs an update before it can send a record. Try again shortly.");
      if (h || d || w || re().length) throw new Error("A payment is still confirming. Send as soon as it has.");
      await Ln();
      const { balance: Be, nonce: q } = await e.chain.account(k);
      if (Be < Wc) throw new Error("Your player needs a little STX for the network fee. Add plays first.");
      const xe = await (await Jn()).request("listening.signSendRecord", { inscription: K.inscription, recipient: te, fee: Wc.toString(), nonce: q.toString(), balance: Be.toString() }), Me = qi(xe.raw);
      if (xe.from !== k || xe.recipient !== te || xe.inscription !== K.inscription || ((x = (tt = Me.payload) == null ? void 0 : tt.functionName) == null ? void 0 : x.content) !== "transfer" || Gr((M = Me.payload.functionArgs) == null ? void 0 : M[2]).value !== te)
        throw new Error("The signed send does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(xe.raw, xe.txid), e.store.set(E(k), JSON.stringify({ txid: xe.txid, at: e.now() })), a = -1 / 0, Re && (Re = { ...Re, at: -1 / 0 }), ut("Record sent ✓ It arrives in a minute or two.");
    }),
    lock: () => Jt("Locking…", async () => {
      eo(), await (s == null ? void 0 : s.request("listening.lock")), i = void 0, ut("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (b) => {
      const k = String(b ?? "").trim();
      if (!(o != null && o.address)) return ut("", "Unlock the listening wallet first.");
      if (!co(k)) return ut("", "Enter a standard mainnet address (it starts with SP).");
      if (k === o.address) return ut("", "That is this listening wallet itself. Enter a different address.");
      e.store.set(zn(o.address), k), ut("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      o != null && o.address && e.store.set(zn(o.address), ""), e.changed();
    },
    returnFunds: (b) => Jt("Check the return in the listening wallet…", async () => {
      if (!Sr()) throw new Error("Connect your wallet first.");
      if (!(o != null && o.address)) throw new Error("Unlock the listening wallet first.");
      if (_t()) return yn(b);
      const k = kn();
      if (!k) throw new Error(Nt() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (k.kind !== "linked" && Ne("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (ee().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await Pn({ mode: b, to: k.to, linked: k.kind === "linked" }), b === "all" && O(!1), ut(b === "all" ? k.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, qt = [], Pr = 10, Cn = 30 * 6e4;
  let Qr = !1, Ii = 0;
  const Aa = (b) => e.now() < Ii && (b === "intro" || b === "locked" || b === "link" || b === "fund" && Ee()), Eo = () => h || !!u || d || w, eo = () => {
    qt.length && (qt.length = 0, e.changed());
  };
  async function ko(b) {
    if (!qt.some((k) => k.id === b.id) && !Ct().some((k) => k.id === b.id) && (qt.push({ ...b, at: e.now() }), qt.length > Pr && qt.shift()), Eo() || ee().length) {
      const k = qt.length;
      S = `Queued ${k === 1 ? "this song" : k + " songs"}: paid as soon as the wallet is free.`, e.changed();
    }
    await er();
  }
  async function er() {
    if (!Qr) {
      Qr = !0;
      try {
        for (; qt.length; ) {
          for (; qt.length && e.now() - qt[0].at > Cn; ) qt.shift();
          if (!qt.length || Eo() || await Li(qt[0]) === "wait") return;
          qt.shift();
        }
      } finally {
        Qr = !1, e.changed();
      }
    }
  }
  async function Li(b) {
    var k;
    h = !0;
    try {
      await In();
      const K = Ve();
      if (K === "loading" || Aa(K)) return "wait";
      if (K !== "ready" || !z() || !(o != null && o.session) || o.session.playsLeft < 1 || !R) return "done";
      if (ee().length) return "wait";
      $ || (await e.chain.verify(), $ = !0);
      const te = o.address, { balance: Be, nonce: q } = await e.chain.account(te);
      i = Be, a = e.now();
      const ke = await e.chain.owner(sd, b.song);
      if (ke === te || ke === gt()) return "done";
      const xe = await s.request("listening.signPlay", {
        core: sd,
        song: b.song,
        receipt: b.id,
        fee: ze().toString(),
        nonce: q.toString(),
        balance: Be.toString()
      }), Me = {
        id: b.id,
        address: te,
        kind: "play",
        core: sd,
        song: b.song,
        recipient: ke,
        amount: "50",
        fee: ze().toString(),
        nonce: q.toString(),
        created: e.now(),
        status: "signed",
        raw: xe.raw,
        txid: xe.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...b.title ? { title: String(b.title).slice(0, 120) } : {},
        ...b.artist ? { artist: String(b.artist).slice(0, 120) } : {}
      };
      e.validate(Me), Ht(Me);
      const tt = b.title ? `“${b.title}”${b.artist ? ` by ${b.artist}` : ""}` : `song #${b.song}`;
      try {
        await e.chain.broadcast(xe.raw, xe.txid), Ht({ ...Me, status: "pending" }), S = `♪ Paid ${tt}`, I = "";
      } catch (x) {
        Ht({ ...Me, status: Oi(x) ? "failed" : "unknown", note: x.message, ...Oi(x) ? { raw: void 0 } : {} }), I = x.message;
      }
      return o = await gn(s), "done";
    } catch (K) {
      const te = K instanceof Error ? K.message : "payment unavailable";
      return (k = Rt()) != null && k.player ? (S = "Payment is taking a moment: " + te, "wait") : (S = "This song played free: " + te, "done");
    } finally {
      h = !1, e.changed();
    }
  }
  function $o(b) {
    return !(t != null && t.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(Ve()) || Ne("like") ? !1 : (_s(b), !0);
  }
  async function _s(b) {
    const k = b.title ? `“${b.title}”` : `song #${b.song}`, K = (be) => {
      var Te;
      I = be, S = "";
      try {
        (Te = e.likeFailed) == null || Te.call(e, b.song);
      } catch {
      }
      e.changed();
    }, te = Ye(), Be = Ve(), q = gt(), ke = te && (Be === "fund" || Be === "over") ? "ready" : Be, xe = Nt() ? et() : q;
    if (ke === "locked") {
      y = { ...b, at: e.now() }, ut(`Unlock to like ${k}. It sends straight after.`);
      return;
    }
    if (ke === "wrong-wallet") return K(jo());
    if (ke === "link") return K("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (Nt() && Ne("standalone")) return K("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (ke === "fund") return K("Top up the listening wallet to like: each like or unlike costs 0.0003 STX.");
    if (ke === "over") return K("Return the excess first: the listening wallet holds more than 1 STX.");
    if (te) {
      await Ts(!0);
      const be = Ze();
      if (un(be))
        return e.changed(), K(jl);
    }
    if (ke !== "ready" || !xe) return K("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(o != null && o.session)) return K("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!R) return K("Pay-per-play is running in another tab. Like from that tab.");
    const Me = Ct(et()).find((be) => be.kind === "like" && be.song === b.song);
    if (Me && Ma.includes(Me.status))
      return K(`Your last like for ${k} is still on its way. It can change again once it confirms.`);
    if (d) return K("One like at a time: your last one is still being sent.");
    if ((Me == null ? void 0 : Me.status) === "confirmed" && e.now() - (Me.confirmedAt ?? 0) < pI)
      return K(`Your like for ${k} has only just confirmed. Try again in a moment.`);
    let tt;
    w = !0;
    try {
      tt = e.likeState ? (await e.likeState(xe, b.song)).by : b.likedBy ?? [];
    } catch {
      tt = b.likedBy;
    } finally {
      w = !1;
    }
    if (!tt) return K(`Could not check ${k} right now. Try the heart again.`);
    const x = et(), G = ((Me == null ? void 0 : Me.status) === "confirmed" && typeof Me.liked == "boolean" && e.now() - (Me.confirmedAt ?? Me.created) < 5 * 6e4 ? Me.liked : void 0) ?? tt.includes(x);
    if (!G && tt.some((be) => be !== x)) return K(Nt() ? `${k} was liked from another wallet of yours. Unlike it there.` : `${k} was liked from your main wallet${tt.includes(q) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await Ps({ song: b.song, liked: !G, title: b.title, artist: b.artist });
  }
  async function Ps(b) {
    var te, Be, q;
    if (d) {
      ut("Still sending your last like. Try again in a moment.");
      return;
    }
    d = !0;
    const k = b.title ? `“${b.title}”${b.artist ? ` by ${b.artist}` : ""}` : `song #${b.song}`, K = e.wait ?? ((ke) => new Promise((xe) => setTimeout(xe, ke)));
    try {
      ut(`${b.liked ? "Liking" : "Unliking"} ${k}…`);
      const ke = e.now() + 12e4;
      for (; h || (Ye() ? Ct(et()).some((G) => Ma.includes(G.status)) : ee().length); ) {
        if (e.now() > ke) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await K(5e3), await In(!0);
      }
      if (!Ye() && Ve() !== "ready" || (o == null ? void 0 : o.state) !== "unlocked" || !o.session) throw new Error("Paying stopped before the like was sent.");
      const xe = et(), { balance: Me, nonce: tt } = await e.chain.account(xe);
      if (Ye() ? c = { for: xe, value: Me, at: e.now() } : (i = Me, a = e.now()), un(Me)) throw new Error(jl);
      const x = await s.request("listening.signLike", {
        song: b.song,
        liked: b.liked,
        fee: zt().toString(),
        nonce: tt.toString(),
        balance: Me.toString()
      }), M = {
        id: id(),
        address: xe,
        kind: "like",
        core: 0,
        song: b.song,
        liked: b.liked,
        recipient: "",
        amount: "0",
        fee: zt().toString(),
        nonce: tt.toString(),
        created: e.now(),
        status: "signed",
        raw: x.raw,
        txid: x.txid,
        ...b.title ? { title: String(b.title).slice(0, 120) } : {},
        ...b.artist ? { artist: String(b.artist).slice(0, 120) } : {}
      };
      e.validate(M), Ht(M);
      try {
        await e.chain.broadcast(x.raw, x.txid), Ht({ ...M, status: "pending" }), S = `${b.liked ? "♥ Liked" : "Unliked"} ${k}`, I = "";
        try {
          (te = e.likeSent) == null || te.call(e, b.song, b.liked);
        } catch {
        }
      } catch (G) {
        if (Ht({ ...M, status: Oi(G) ? "failed" : "unknown", note: G.message, ...Oi(G) ? { raw: void 0 } : {} }), I = G.message, Oi(G)) try {
          (Be = e.likeFailed) == null || Be.call(e, b.song);
        } catch {
        }
      }
      o = await gn(s);
    } catch (ke) {
      I = "Like not sent: " + (ke instanceof Error ? ke.message : "the listening wallet is unavailable");
      try {
        (q = e.likeFailed) == null || q.call(e, b.song);
      } catch {
      }
    } finally {
      d = !1, e.changed(), er();
    }
  }
  return { snapshot: Mr, refresh: In, onListened: ko, heart: $o, toggleLike: _s, ...Qn };
}
const Yb = ["Connect", "Passkey", "Link & fund", "Listen"], Wb = ["Passkey", "Add 1 STX", "Listen"], Af = (e) => e ? Wb : Yb;
function yI(e) {
  if (e.solo) return wI(e);
  const t = Yb.length, n = (r, s, o = !1) => ({ at: r, blocked: o, caption: r >= t ? s : `Step ${r + 1} of ${t} · ${s}` });
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
      const r = e.entries.filter((s) => s.kind === "play");
      return r.some((s) => s.status === "confirmed") ? n(t, "Paid plays are taking place") : r.some((s) => ["signed", "pending", "unknown"].includes(s.status)) ? n(3, "first paid play sent, confirming") : n(3, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function wI(e) {
  const t = Wb.length, n = (r, s, o = !1) => ({ at: r, blocked: o, caption: r >= t ? s : `Step ${r + 1} of ${t} · ${s}` });
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
      const r = e.entries.filter((s) => s.kind === "play");
      return r.some((s) => s.status === "confirmed") ? n(t, "Paid plays are taking place") : r.some((s) => ["signed", "pending", "unknown"].includes(s.status)) ? n(2, "first paid play sent, confirming") : n(2, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function mI(e, t) {
  return !t || t.at >= Af(!!e.solo).length || e.heard || e.step === "wrong-wallet" || e.entries.some((n) => n.kind === "play") || e.creditedTo ? !1 : !(e.step === "locked" && e.linked);
}
const bI = (e) => typeof e == "string" && e.toLowerCase().includes("asigna");
function xI(e = typeof window > "u" ? void 0 : window) {
  if (!e) return !1;
  let t = e;
  try {
    const n = e;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (t = n.top);
  } catch {
  }
  return t.LeatherProvider || t.XverseProviders || t.HiroWalletProvider || t.StacksProvider ? !0 : [t.btc_providers, t.webbtc_providers, t.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !bI(r.id)));
}
const SI = {}, vI = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, AI = (e) => {
  const t = SI;
  return e === "mainnet" ? t.VITE_STACKS_API_MAINNET : t.VITE_STACKS_API_TESTNET;
}, EI = (e) => `/hiro/${e}`, kI = (e) => e.startsWith("/") && typeof window < "u" ? `${window.location.origin}${e}` : e, $I = (e) => {
  const t = AI(e);
  if (t)
    return [kI(t)];
  const n = vI[e];
  return typeof window < "u" ? [`${window.location.origin}${EI(e)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, II = {}, jg = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, LI = "xtrata.log.enabled", CI = "xtrata.log.level", TI = "xtrata.log.tags", BI = "xtrata.log.dedupe", Zc = (e) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(e);
  } catch {
    return null;
  }
}, MI = (e) => {
  if (!e)
    return !0;
  const t = e.toLowerCase();
  return t !== "false" && t !== "0" && t !== "off";
}, NI = (e) => {
  if (!e)
    return null;
  const t = e.toLowerCase();
  return t === "debug" || t === "info" || t === "warn" || t === "error" ? t : null;
}, _I = (e) => {
  if (!e)
    return !1;
  const t = e.toLowerCase();
  return t === "true" || t === "1" || t === "on";
}, PI = (e) => {
  if (!e)
    return null;
  const t = e.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return t.length === 0 ? null : t.includes("*") || t.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(t);
}, UI = () => {
  const e = II ?? {}, t = Zc(LI) ?? e.VITE_LOG_ENABLED, n = Zc(CI) ?? e.VITE_LOG_LEVEL, r = Zc(TI) ?? e.VITE_LOG_TAGS, s = Zc(BI) ?? e.VITE_LOG_DEDUPE;
  return {
    enabled: MI(t),
    level: NI(n) ?? "warn",
    tags: PI(r),
    dedupe: _I(s)
  };
}, OI = (e, t, n) => !e.enabled || jg[n] < jg[e.level] ? !1 : !e.tags || e.tags.has("*") ? !0 : e.tags.has(t.toLowerCase()), HI = (e, t, n, r) => {
  const s = UI();
  if (!OI(s, t, e) || FI(s.dedupe))
    return;
  const o = `[xtrata:${t}] ${n}`, i = console[e] ?? console.log;
  r !== void 0 ? i(o, r) : i(o);
}, DI = /* @__PURE__ */ new Set();
let Rg = null;
const FI = (e, t, n, r, s) => (Rg !== e && (DI.clear(), Rg = e), !1), jI = (e, t, n) => HI("debug", e, t, n), RI = {}, zI = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, GI = (e) => {
  const t = RI, n = e === "testnet" ? t.VITE_BNSV2_CONTRACT_TESTNET : t.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : zI[e];
}, KI = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, VI = (e) => {
  if (!e)
    return null;
  const t = e.trim();
  if (!t)
    return null;
  const n = t.toLowerCase();
  return KI.test(n) ? n : null;
}, XI = (e) => e.replace(/\/+$/, ""), qI = (e) => e instanceof Error ? e.message || e.name || "Error" : typeof e == "string" ? e : String(e), zg = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.startsWith("0x") ? e.slice(2) : e;
  if (!t || t.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(t))
    return null;
  let n = "";
  for (let r = 0; r < t.length; r += 2) {
    const s = Number.parseInt(t.slice(r, r + 2), 16);
    if (s < 32 || s > 126)
      return null;
    n += String.fromCharCode(s);
  }
  return n;
}, Hi = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : null, YI = (e) => {
  var c, u;
  let t;
  try {
    t = Gr(K6(e));
  } catch {
    return null;
  }
  const n = Hi(t);
  if (!n || n.success === !1)
    return null;
  const r = Hi(n.value), s = Hi(r == null ? void 0 : r.value), o = Hi(s == null ? void 0 : s.value);
  if (!o)
    return null;
  const i = zg((c = Hi(o.name)) == null ? void 0 : c.value), a = zg((u = Hi(o.namespace)) == null ? void 0 : u.value);
  return !i || !a ? null : VI(`${i}.${a}`);
}, WI = async (e) => {
  const [t, n] = e.contractId.split("."), r = `${XI(
    e.baseUrl
  )}/v2/contracts/call-read/${t}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: e.address,
      arguments: [Cb(fb(e.address))]
    }),
    signal: e.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const o = await s.json();
  return !(o != null && o.okay) || typeof o.result != "string" ? null : YI(o.result);
}, ZI = async (e) => {
  const t = e.address.trim();
  if (!Zi(t))
    return null;
  const n = GI(e.network);
  if (!n)
    return null;
  let r = null;
  for (const s of $I(e.network))
    try {
      return await WI({
        baseUrl: s,
        contractId: n,
        address: t,
        signal: e.signal
      });
    } catch (o) {
      r = o;
    }
  return jI("bns", "Primary BNS name lookup unavailable", {
    address: t,
    network: e.network,
    error: qI(r)
  }), null;
};
function JI(e, t, n = {}) {
  const r = n.retryAfterMs ?? 3e4, s = n.now ?? Date.now, o = /* @__PURE__ */ new Map(), i = (a, c) => {
    c.pending = !0, c.failedAt = void 0, Promise.resolve().then(() => e(a)).then((u) => {
      c.pending = !1, u && (c.name = u, t());
    }).catch(() => {
      c.pending = !1, c.failedAt = s();
    });
  };
  return {
    get(a) {
      if (!a) return null;
      let c = o.get(a);
      return c ? !c.pending && c.name === null && c.failedAt !== void 0 && s() - c.failedAt >= r && i(a, c) : (c = { name: null, pending: !1 }, o.set(a, c), i(a, c)), c.name;
    }
  };
}
const Gg = Object.freeze({
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
  2883: "Audionals - The Opera",
  2885: "Audionals - The Opera",
  2889: "Audionals - The Opera",
  2892: "Audionals - The Opera",
  2895: "Audionals - The Opera",
  2896: "Audionals - The Opera",
  2910: "Audionals - The Opera",
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
}), Kg = Object.freeze({ 139: "melophonic" });
function Vg(e, t = "") {
  const n = String(e);
  return Object.hasOwn(Gg, n) ? Gg[n] : Object.hasOwn(Kg, n) ? Kg[n] : t;
}
const Xg = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function qg(e, t = "") {
  return Object.hasOwn(Xg, String(e)) ? Xg[String(e)] : t;
}
const Zb = 10000n, Dh = 1000000n, Rl = 3000n, QI = (e, t) => `${e}#gift=${t}`, eL = 100, Na = (e, t = Wr) => e <= an ? 0 : Number((e - an) / jn(t)), Yg = (e) => typeof e == "string" && /^[A-Za-z0-9_-]{22}$/.test(e), Fh = "xtrata.xyz/radio/gifts", Da = eL, tL = "Create a prefunded Xtrata radio gift batch", nL = (e) => ({
  domain: xr({ name: Et(Fh), version: Et("1"), "chain-id": An(1) }),
  message: xr({
    purpose: Et(tL),
    creator: Et(e.creator),
    count: An(e.count),
    amount: An(BigInt(e.amount)),
    label: Et(e.label),
    issued: An(e.issued),
    ...e.player ? { player: Et(e.player) } : {}
  })
}), Jb = (e, t, n = Wr) => an + BigInt(e) * jn(n) + (t ? vu : 0n), rL = (e, t = Wr) => Number((Dh - an - (e ? vu : 0n)) / jn(t)), Qb = (e, t) => BigInt(e) * (t + Rl);
function oL(e, t, n, r = Wr) {
  const s = n ? vu : 0n, o = t > an + s ? t - an - s : 0n, i = Number(o / jn(r));
  return {
    plays: i,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(i) * Hl,
    fees: BigInt(i) * r,
    reserve: an,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: Rl,
    perCopy: t + Rl,
    total: Qb(e, t)
  };
}
const sL = (e) => e >= Zb && e <= Dh, iL = 90, Wg = [30, 90], aL = "Extend my prefunded Xtrata radio gift batches; no spending permission", cL = (e) => ({
  domain: xr({ name: Et(Fh), version: Et("1"), "chain-id": An(1) }),
  message: xr({ purpose: Et(aL), creator: Et(e.creator), batch: Et(e.batch), days: An(e.days), issued: An(e.issued) })
}), Zg = 40, lL = "Create an Xtrata radio gift player", Ef = (e) => typeof e == "string" && /^[0-9a-f]{16}$/.test(e), uL = /^[^\u0000-\u001f\u007f<>]+$/u;
function Jg(e, t, n) {
  return typeof e != "string" ? !1 : e.length ? e.length <= t && e === e.trim() && uL.test(e) : !n;
}
function e1(e) {
  if (!e || typeof e != "object") throw new Error("A player needs a definition.");
  if (!Jg(e.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!Jg(e.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(e.tracks) || e.tracks.length < 1 || e.tracks.length > Zg) throw new Error(`A player holds 1 to ${Zg} songs.`);
  const t = /* @__PURE__ */ new Set();
  for (const s of e.tracks) {
    if (!Number.isSafeInteger(s) || s < 1) throw new Error("Songs are catalogue token numbers.");
    if (t.has(s)) throw new Error("A song appears twice in the list.");
    t.add(s);
  }
  if (e.cover !== null && e.cover !== void 0 && (!Number.isSafeInteger(e.cover) || e.cover < 1)) throw new Error("Cover is a catalogue token number.");
  const n = e.explicit ?? [];
  if (!Array.isArray(n)) throw new Error("Explicit songs: a list of song numbers from the album.");
  for (const s of n) if (!t.has(s)) throw new Error("An explicit song must be one of the album’s songs.");
  const r = [...new Set(n)].sort((s, o) => s - o);
  return { title: e.title, subtitle: e.subtitle ?? "", tracks: [...e.tracks], cover: e.cover ?? null, ...r.length ? { explicit: r } : {} };
}
const t1 = (e) => {
  const t = [...new Set(e.explicit ?? [])].sort((n, r) => n - r);
  return Rf(Kf(new TextEncoder().encode(JSON.stringify({ title: e.title, subtitle: e.subtitle ?? "", tracks: e.tracks, cover: e.cover ?? null, ...t.length ? { explicit: t } : {} }))));
}, dL = (e) => ({
  domain: xr({ name: Et(Fh), version: Et("1"), "chain-id": An(1) }),
  message: xr({
    purpose: Et(lL),
    admin: Et(e.admin),
    player: Et(e.hash),
    issued: An(e.issued)
  })
}), Xr = (e) => e.tracks.filter((t) => !t.hidden), fL = (e) => e.tracks.find((t) => t.hidden) ?? null, ad = [300, 500, 1e3], Xa = [
  { id: "diamond", name: "Diamond", min: 1e3, mark: "◆" },
  { id: "gold", name: "Gold", min: 500, mark: "★" },
  { id: "silver", name: "Silver", min: 250, mark: "✦" },
  { id: "bronze", name: "Bronze", min: 100, mark: "●" },
  { id: "classic", name: "Classic", min: 0, mark: "♪" }
], Jc = (e) => typeof e == "string" && Xa.some((t) => t.id === e), Vs = (e) => Xa.find((t) => t.id === e), hL = (e) => Xa.find((t) => e >= t.min) ?? Xa[Xa.length - 1];
function pL(e, t = Wr) {
  return hL(e <= an ? 0 : Number((e - an) / jn(t)));
}
const n1 = [
  { tier: "diamond", plays: 1e3, count: 5 },
  { tier: "gold", plays: 500, count: 10 },
  { tier: "silver", plays: 250, count: 20 },
  { tier: "bronze", plays: 100, count: 100 },
  { tier: "classic", plays: 50, count: 865 }
], gL = "1000 Players";
function jh(e = Da) {
  const t = [];
  for (const n of n1) {
    const r = Jb(n.plays, !1);
    for (let s = n.count; s > 0; s -= e) {
      const o = Math.min(s, e), i = t.length + 1;
      t.push({ n: i, tier: n.tier, plays: n.plays, count: o, label: `${gL} ${String(i).padStart(2, "0")}`, amount: r, deposit: Qb(o, r) });
    }
  }
  return t;
}
const Rh = (e = jh()) => ({
  batches: e.length,
  players: e.reduce((t, n) => t + n.count, 0),
  deposit: e.reduce((t, n) => t + n.deposit, 0n),
  tiers: n1.map((t) => ({ id: t.tier, plays: t.plays, count: t.count }))
}), yL = 23 * 36e5, Qg = (e) => ["todo", "unpaid", "confirming", "touched", "live"].indexOf(e);
function wL(e, t) {
  const n = e.view;
  return (n == null ? void 0 : n.status) === "live" ? n.copies.waiting === e.count ? "live" : "touched" : e.txid ? "confirming" : t - e.at < yL ? "unpaid" : "todo";
}
function mL(e, t, n) {
  var a;
  const r = t.filter((c) => c.label === e.label && c.player === null && c.count === e.count && c.amount === e.amount.toString() && c.codes.length === e.count).map((c) => ({ b: c, state: wL(c, n) })).filter((c) => c.state !== "todo").sort((c, u) => Qg(u.state) - Qg(c.state) || u.b.at - c.b.at), s = r[0];
  if (!s) return { step: e, state: "todo", extras: 0, detail: "not made yet" };
  const o = (a = s.b.view) == null ? void 0 : a.copies, i = s.state === "live" ? `live · all ${e.count} waiting to be claimed` : s.state === "touched" ? `live, but only ${(o == null ? void 0 : o.waiting) ?? 0} of ${e.count} still waiting (${(o == null ? void 0 : o.claimed) ?? 0} claimed)` : s.state === "confirming" ? "paid · waiting for the payment to confirm" : "made · links saved · not paid yet";
  return { step: e, state: s.state, batch: s.b, extras: r.length - 1, detail: s.b.error ? `${i} (${s.b.error})` : i };
}
function ey(e, t, n = jh()) {
  var u;
  const r = n.map((h) => mL(h, e, t)), s = [];
  for (const h of r)
    h.extras && s.push(`Batch ${h.step.n} was made more than once. The extra ${h.extras === 1 ? "one is" : "ones are"} not part of the drop: leave ${h.extras === 1 ? "it" : "them"} unpaid, or if paid the money comes back when the copies run out.`), h.state === "touched" && s.push(`Batch ${h.step.n} has copies that are no longer waiting, so the wall would come up short.`);
  const o = r.every((h) => h.state === "live"), i = o ? r.flatMap((h) => h.batch.codes) : [], a = Rh(n).players;
  o && new Set(i).size !== a && s.push(`The links do not add up: ${new Set(i).size} different links for ${a} players.`);
  const c = o && new Set(i).size === a;
  return { steps: r, next: ((u = r.find((h) => h.state === "todo")) == null ? void 0 : u.step) ?? null, done: r.filter((h) => h.state === "live").length, ready: c, codes: c ? i : [], problems: s };
}
function bL(e, t = jh()) {
  const n = e;
  if (!n || typeof n.total != "number") return { ok: !1, text: "The wall could not be read just now." };
  const r = Rh(t);
  if (n.total === 0) return { ok: !1, text: "The wall is empty: nothing is loaded." };
  const s = n.total - (n.free ?? 0) - (n.held ?? 0) - (n.claimed ?? 0), o = r.tiers.map((u) => {
    var d;
    const h = (d = n.tiers) == null ? void 0 : d.find((w) => w.plays === u.plays);
    return { ...u, got: (h == null ? void 0 : h.total) ?? 0 };
  }), i = o.map((u) => `${u.got} ${Vs(u.id).name}`).join(", "), a = (n.tiers ?? []).filter((u) => !r.tiers.some((h) => h.plays === u.plays)), c = n.total === r.players && s === 0 && !!n.tiers && o.every((u) => u.got === u.count) && a.length === 0;
  return c ? { ok: c, text: `The wall holds ${n.total.toLocaleString("en-GB")} players: ${i}. ${n.claimed ?? 0} claimed so far${n.state === "paused" ? " · PAUSED" : ""}.` } : { ok: c, text: `The wall is not the 1,000 yet: ${n.total.toLocaleString("en-GB")} spots${n.tiers ? ` (${i}${a.length ? `, and ${a.reduce((u, h) => u + h.total, 0)} of another size` : ""})` : ""}${s ? `, ${s} no longer available` : ""}.` };
}
const ty = 1800, cd = /* @__PURE__ */ new Map();
async function r1(e) {
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
function xL(e, t, n, r, s) {
  const o = document.createElement("button");
  return o.type = "button", o.className = r, o.dataset.feedback = e, (() => {
    const a = cd.get(e), c = !!a && a.until > Date.now();
    o.textContent = c ? a.label : t, o.classList.toggle("is-done", c && a.ok), o.classList.toggle("is-failed", c && !a.ok);
  })(), o.onclick = async () => {
    const a = await n();
    if (a) {
      cd.set(e, { ...a, until: Date.now() + ty });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === e && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        cd.delete(e), s();
      }, ty + 50);
    }
  }, o;
}
const gr = (e, t, n, r, s) => xL(e, t, async () => await r1(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s);
function zh() {
  var t;
  const e = window.XtrataRadioConnectStacks;
  e ? e() : (t = document.getElementById("radio-wallet-connect")) == null || t.click();
}
const Os = "xtrata.radio.gift.incoming.v1", ny = (e) => "xtrata.radio.gift.mine.v1:" + e, ry = (e) => "xtrata.radio.gift.batches.v1:" + e, fe = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, Qt = (e, t, n = "") => {
  const r = fe("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, _a = (e, t) => {
  const n = document.createElement("option");
  return n.textContent = e, n.value = t, n;
}, rr = (e) => jr(e).replace(/\.?0+$/, "");
function SL(e) {
  let t = null;
  const n = (E) => [5e3, 1e4, 2e4, 3e4][E] ?? 6e4, r = (() => {
    try {
      const E = new URL(location.href), H = new URLSearchParams(E.hash.slice(1)).get("gift") ?? E.searchParams.get("gift");
      return H !== null && (E.searchParams.delete("gift"), history.replaceState(null, "", E.pathname + (E.search || ""))), Yg(H) ? H : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const E = JSON.parse(e.store.get(Os) || "null");
      return Yg(E == null ? void 0 : E.code) ? E.code : null;
    } catch {
      return null;
    }
  })(), o = r ?? s;
  if (o) {
    t = { code: o }, e.store.set(Os, JSON.stringify({ code: o, at: e.now() }));
    let E = 0;
    const H = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: o }), signal: AbortSignal.timeout(15e3) }).then(async (V) => {
      const D = await V.json().catch(() => ({}));
      if (V.status === 404) {
        e.store.set(Os, null), t = { ...t, error: (D == null ? void 0 : D.error) || "That gift link is not valid." }, e.changed();
        return;
      }
      if (!V.ok) throw new Error("busy");
      const J = D;
      t = { ...t, view: J, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(J.status) && e.store.set(Os, null), e.changed();
    }).catch(() => {
      !t || t.view || (t = { ...t, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, e.changed(), setTimeout(() => void H(), n(E++)));
    });
    H();
  }
  const i = () => !!(t != null && t.view) && t.view.status === "live" && !t.done, a = () => {
    const E = t == null ? void 0 : t.view;
    return !(E != null && E.player) || !i() ? null : { player: E.player, from: d(E), plays: Na(BigInt(E.amount)) };
  }, c = () => {
    const E = t == null ? void 0 : t.view;
    return !E || E.player || !i() ? null : { plays: Na(BigInt(E.amount)), from: E.from ? e.who(E.from) : null };
  }, u = () => {
    const E = t == null ? void 0 : t.code;
    if (!E) return [];
    const H = `${location.origin}${location.pathname}#gift=${E}`;
    return [gr("gift-pass-on", "Copy the link to pass on", () => H, "primary", e.changed)];
  }, h = () => {
    t = null, e.store.set(Os, null), e.changed();
  }, d = (E) => E.from ? e.who(E.from) : E.label ? `Xtrata Radio · ${E.label}` : "Xtrata Radio";
  let w = {};
  const y = (E) => {
    if (w.box) return w.box;
    const H = fe("div", "", "ppp-gift-check");
    w.box = H;
    const V = () => {
      const D = window.turnstile;
      !D || w.rendered || (w.rendered = !0, D.render(H, { sitekey: E, callback: (J) => {
        w.token = J, e.changed();
      }, "expired-callback": () => {
        w.token = void 0;
      } }));
    };
    if (window.turnstile) V();
    else {
      const D = document.createElement("script");
      D.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", D.async = !0, D.onload = V, document.head.append(D);
    }
    return H;
  }, v = (E) => {
    queueMicrotask(() => void E());
  };
  let S;
  async function I(E) {
    var D, J, se, Le, Ae, Ge, Tt, We, ft;
    if (!t || t.claiming || !E.listening) return;
    const H = !!((D = t.view) != null && D.player);
    if (H && !E.root) return;
    t.claiming = !0, t.error = void 0, (J = e.claiming) == null || J.call(e, !0), e.changed();
    const V = async (St) => {
      const yt = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: t.code, turnstile: w.token, ...St })
      });
      return { res: yt, r: await yt.json().catch(() => ({})) };
    };
    try {
      let St = 0, yt = E.listening, _t;
      if (H) {
        const Ve = Number((se = await e.json("/radio/gift/slots?root=" + encodeURIComponent(E.root))) == null ? void 0 : se.next);
        if (!Number.isSafeInteger(Ve) || Ve < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        St = Ve;
        for (let Mr = 0; ; Mr++) {
          const Nr = await e.album.bind(St);
          if (yt = Nr.address, _t = await V({ wallet: yt, binding: Nr }), _t.res.status === 409 && /just taken/.test(((Le = _t.r) == null ? void 0 : Le.error) || "") && Mr < 5) {
            St += 1;
            continue;
          }
          break;
        }
      } else _t = await V({ wallet: yt });
      const { res: C, r: $e } = _t;
      if (C.status === 503 && /sending another gift/.test(($e == null ? void 0 : $e.error) || "")) {
        t.waiting = !0, (Ae = e.claiming) == null || Ae.call(e, !0), clearTimeout(S), S = setTimeout(() => {
          t && (t.waiting = !1, e.changed());
        }, 12e3);
        return;
      }
      if (!C.ok) {
        const Ve = String(($e == null ? void 0 : $e.error) || "");
        if (C.status === 404 || C.status === 410 || C.status === 409 && /already had a gift|brand-new|already have this album/.test(Ve))
          throw e.store.set(Os, null), new Error(Ve || "This gift cannot be opened.");
        if (C.status === 429 || C.status === 403 || C.status === 400 && !/wallet number/i.test(Ve)) throw new Error(Ve || `Could not open the gift (${C.status}).`);
        const Nr = /topping up/.test(Ve) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(Ve) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(Ve) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(Nr), { retry: !0, slow: /topping up|not paid for yet/.test(Ve) });
      }
      t.done = !0, e.store.set(Os, null), H ? await e.album.arrived(St, yt, $e.txid, BigInt($e.amount)) : e.giftSent($e.txid, BigInt($e.amount));
    } catch (St) {
      const yt = St, _t = yt.name === "TypeError" || yt.name === "AbortError" || yt.name === "TimeoutError" || /wallet number/i.test(yt.message);
      if (yt.retry || _t) {
        const C = t.tries ?? 0;
        t.tries = C + 1, t.retry = { text: yt.retry ? yt.message : "Still sending your gift… the network is slow, trying again." }, (Ge = e.claiming) == null || Ge.call(e, !0), clearTimeout(S), S = setTimeout(() => {
          t && (t.retry = void 0, e.changed());
        }, yt.slow ? 6e4 : n(C));
      } else
        t.error = yt.message, (Tt = e.claiming) == null || Tt.call(e, !1);
      w.token = void 0;
      try {
        (ft = (We = window.turnstile) == null ? void 0 : We.reset) == null || ft.call(We, w.box);
      } catch {
      }
    } finally {
      t.claiming = !1, e.changed();
    }
  }
  let U = null;
  function P(E) {
    if (!E.listening || !E.depositPending || E.step !== "fund")
      return U = null, [];
    if (!U || U.wallet !== E.listening || e.now() - U.at > 3e4) {
      const V = E.listening;
      U = { ...(U == null ? void 0 : U.wallet) === V ? U : {}, wallet: V, at: e.now() }, e.json("/radio/gift/for?wallet=" + encodeURIComponent(V)).then((D) => {
        var J, se;
        (U == null ? void 0 : U.wallet) === V && (U.state = (J = D == null ? void 0 : D.gift) == null ? void 0 : J.state, U.problem = ((se = D == null ? void 0 : D.gift) == null ? void 0 : se.problem) ?? null, e.changed());
      }).catch(() => {
      });
    }
    if (!(U.state === "sending" && U.problem)) return [];
    const H = fe("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return H.title = `Network reply: ${U.problem}`, [H];
  }
  function A(E, H, V = !1) {
    var Ge, Tt;
    const D = H.player, J = BigInt(H.amount), se = V ? [] : [fe("p", `🎁 ${d(H)} sent you “${D.title}”${D.subtitle ? ` by ${D.subtitle}` : ""}: ${Xr(D).length} ${Xr(D).length === 1 ? "song" : "songs"} and ${Na(J).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!E.root && ["fund", "ready", "over", "link"].includes(E.step))) {
      if (V) return se;
      if (se.push(fe("p", E.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : E.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), E.step === "intro") {
        const We = document.createElement("details");
        We.className = "ppp-how";
        const ft = document.createElement("summary");
        ft.textContent = "How does this work?", We.append(ft, fe("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), se.push(We);
      }
      return se;
    }
    if (E.walletCannotAlbums)
      return se.push(fe("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), se;
    const Ae = (Tt = (Ge = E.gate) == null ? void 0 : Ge.gifts) == null ? void 0 : Tt.turnstileSiteKey;
    return Ae && !w.token ? se.push(fe("p", "One quick check and it is yours:", "ppp-mute"), y(Ae)) : !t.claiming && !t.error && !t.waiting && !t.retry && v(() => I(E)), se.push(...T(E, "Sending your album…")), se;
  }
  function T(E, H) {
    const V = [];
    return t.claiming || t.waiting ? V.push(fe("p", t.waiting ? "Another gift is on its way out first. Yours is next…" : H, "ppp-cyan")) : t.retry && V.push(fe("p", t.retry.text, "ppp-warn"), Qt("Try now", () => {
      clearTimeout(S), t.retry = void 0, I(E);
    }, "quiet")), t.error && /already have this album/i.test(t.error) ? V.push(fe("p", "You already have this album: it is in My albums. This copy is still free, so pass it on to a friend who would love it.", "ppp-mute"), ...u(), Qt("Forget this gift link here", h, "quiet")) : t.error && V.push(fe("p", t.error, "ppp-bad"), Qt("Try again", () => {
      t.error = void 0, I(E);
    })), V;
  }
  const B = (E) => {
    var H;
    return !!t && !t.done && !t.error && i() && !!E.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(t.claiming || t.waiting || t.retry) || !E.linked && !E.creditedTo && (E.createdHere || E.brandNew || !!((H = t.view) != null && H.player)) && (E.balance ?? 0n) === 0n && !E.entries.length);
  };
  function X(E, H = {}) {
    var yt, _t, C, $e;
    const V = P(E);
    if (!t || ["off", "elsewhere"].includes(E.step)) return V;
    const D = t.view;
    if (t.error && !D) return [fe("p", `🎁 ${t.error}`, "ppp-warn")];
    if (!D) return [fe("p", t.retry ? `🎁 ${t.retry.text}` : "🎁 Checking your gift…", t.retry ? "ppp-warn" : "ppp-mute")];
    if (t.done) return V;
    if (D.status === "claimed" || D.status === "claiming") return [fe("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(D.status)) return [fe("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (D.status === "pending-deposit") return [fe("p", `🎁 ${d(D)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (D.player) return [...A(E, D, !!H.bare), ...V];
    const J = !!E.listening && (!(E.createdHere || E.brandNew) || !!E.linked || !!E.creditedTo || (E.balance ?? 0n) > 0n || E.entries.length > 0), se = J ? ((yt = e.claimNew) == null ? void 0 : yt.call(e, E)) ?? null : null, Le = se ? ((_t = e.replaceOld) == null ? void 0 : _t.call(e, E)) ?? null : null;
    if (se && Le)
      return [
        fe("p", "🎁 A free player is waiting, and this device already has a player you made before. Replace the old one to end up with a single player that has 24 backup words: its balance is sent back first, then it is removed from this device. Or keep both as two separate players.", "ppp-mute"),
        Qt("Replace my old player", Le, "primary"),
        Qt("Keep both players", se, "quiet"),
        Qt("Not now", h, "quiet")
      ];
    if (se)
      return [
        fe("p", "🎁 This device already has a player you made before. You can claim this free one as a new, separate player with its own passkey. Your existing player, and anything in it, stays exactly as it is; you can switch between them with “Use a different listening wallet”.", "ppp-mute"),
        Qt("Claim it as a new player", se, "primary"),
        Qt("Not now", h, "quiet")
      ];
    if (J)
      return [fe("p", "🎁 You already have a player, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), Qt("Forget this gift link here", h, "quiet")];
    const Ae = BigInt(D.amount), Ge = Na(Ae).toLocaleString(), Tt = fe(
      "p",
      `🎁 ${d(D)} sent you ${rr(Ae)} STX of on-chain music: about ${Ge} paid plays.`,
      "ppp-gift"
    ), We = H.bare ? [] : [Tt], ft = !!E.listening && (E.createdHere || E.brandNew) && !E.linked && !E.creditedTo && E.step === "fund" && (E.balance ?? 1n) === 0n && !E.depositPending && !E.entries.length, St = ($e = (C = E.gate) == null ? void 0 : C.gifts) == null ? void 0 : $e.turnstileSiteKey;
    return ft ? (St && !w.token ? We.push(fe("p", "One quick check and it is yours:", "ppp-mute"), y(St)) : !t.claiming && !t.error && !t.waiting && !t.retry && v(() => I(E)), We.push(...T(E, "Sending your gift…"))) : E.step === "intro" ? H.bare || We.push(fe("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : E.listening && E.linked ? We.push(fe("p", "You already have a player linked to your Stacks wallet, so this free one is for someone new. Know a friend who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), Qt("Forget this gift link here", h, "quiet")) : E.listening && (E.balance ?? 0n) > 0n && We.push(fe("p", "Your player already has plays, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), Qt("Forget this gift link here", h, "quiet")), We;
  }
  async function Q(E, H, V) {
    var D;
    try {
      const J = await e.json("/radio/gift/for?wallet=" + encodeURIComponent(E));
      if ((D = J == null ? void 0 : J.gift) != null && D.returnTo) return { ok: !0, funder: J.gift.returnTo, txId: J.gift.txid ?? void 0, amount: J.gift.amount, distinct: 1 };
    } catch {
      if (V) return { ok: !1 };
    }
    return H();
  }
  const oe = fe("div", "", "ppp-gift-fold");
  let Y = 250000n, m = "", L = "";
  const _ = (E) => {
    try {
      const H = JSON.parse(e.store.get(ny(E)) || "[]");
      return Array.isArray(H) ? H : [];
    } catch {
      return [];
    }
  }, N = (E, H) => e.store.set(ny(E), JSON.stringify(H.slice(0, 50)));
  async function W(E) {
    const H = _(E);
    for (const V of H)
      if (!(V.view && ["claimed", "refunded", "expired"].includes(V.view.status)))
        try {
          V.view = !V.view || V.view.status === "pending-deposit" ? await e.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: V.id, ...V.txid ? { txid: V.txid } : {} }) }) : await e.json("/radio/gift?id=" + V.id), V.error = void 0;
        } catch (D) {
          V.error = D.message;
        }
    N(E, H), e.changed();
  }
  async function j(E) {
    if (m) return;
    m = "Starting your gift…", L = "", e.changed();
    let H = null;
    try {
      H = await e.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: E, amount: Y.toString() }) });
      const V = _(E);
      V.unshift({ id: H.id, code: H.code, amount: Y.toString(), at: e.now() }), N(E, V), m = "Approve the gift in your wallet…", e.changed();
      const D = await e.pay(E, H.depositTo, BigInt(H.deposit), H.memo), J = _(E), se = J.find((Le) => Le.id === H.id);
      se && (se.txid = D, se.view = { status: "pending-deposit", amount: Y.toString(), source: "friend", from: E, label: "", expires: 0 }), N(E, J), L = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", W(E);
    } catch (V) {
      L = V.message || "Not sent.";
    } finally {
      m = "", e.changed();
    }
  }
  const ye = (E) => "xtrata.radio.gift.players.v1:" + E, ce = (E) => {
    try {
      const H = JSON.parse(e.store.get(ye(E)) || "[]");
      return Array.isArray(H) ? H.filter((V) => V && /^[0-9a-f]{16}$/.test(V.id)) : [];
    } catch {
      return [];
    }
  };
  async function Xe(E, H) {
    var V;
    if (!m) {
      m = "Checking the player…", L = "", e.changed();
      try {
        const D = H.tracks.split(/[\s,]+/).filter(Boolean).map((We) => Number(We.replace(/^#/, ""))), J = (H.explicit ?? "").split(/[\s,]+/).map((We) => We.replace(/^#/, "")).filter(Boolean).map(Number), se = e1({ title: H.title.trim(), subtitle: H.subtitle.trim(), tracks: D, cover: (V = H.cover) != null && V.trim() ? Number(H.cover.trim().replace(/^#/, "")) : null, ...J.length ? { explicit: J } : {} });
        m = "Sign in your wallet…", e.changed();
        const Le = { admin: E, hash: t1(se), issued: e.now() }, Ae = await e.sign(E, dL(Le));
        m = "Making the player…", e.changed();
        const Ge = await e.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: se, request: Le, signature: Ae }) }), Tt = ce(E).filter((We) => We.id !== Ge.id);
        Tt.unshift({ id: Ge.id, title: Ge.title, tracks: Ge.tracks }), e.store.set(ye(E), JSON.stringify(Tt.slice(0, 30))), L = `${Ge.existing ? "That player already exists" : "Player made"} ✓ “${Ge.title}” · ${Ge.tracks} songs. Pick it below for a batch.`;
      } catch (D) {
        L = D.message || "Not made.";
      } finally {
        m = "", e.changed();
      }
    }
  }
  const $ = (E, H) => QI(E || location.origin + "/radio.html", H), R = (E) => {
    try {
      const H = JSON.parse(e.store.get(ry(E)) || "[]");
      return Array.isArray(H) ? H.filter((V) => V && /^[0-9a-f]{16}$/.test(V.id) && Array.isArray(V.codes)) : [];
    } catch {
      return [];
    }
  }, ue = (E, H) => e.store.set(ry(E), JSON.stringify([...H.filter((V) => V.codes.length), ...H.filter((V) => !V.codes.length)].slice(0, 80))), me = (E) => !!E.view && E.view.status === "live" && E.view.copies.waiting + E.view.copies.claiming + E.view.copies.refunding === 0, _e = (E, H) => e.json(E, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(H) });
  let ve = 0;
  async function mt(E) {
    const H = R(E);
    for (const D of H)
      if (!me(D))
        try {
          D.view = !D.view || D.view.status === "pending-deposit" ? await _e("/radio/gift/batch/confirm", { id: D.id, ...D.txid ? { txid: D.txid } : {} }) : await e.json("/radio/gift/batch?id=" + D.id), D.error = void 0;
        } catch (J) {
          D.error = J.message;
        }
    try {
      const D = await e.json("/radio/gift/batches?creator=" + encodeURIComponent(E));
      for (const J of (D == null ? void 0 : D.batches) ?? []) {
        const se = H.find((Le) => Le.id === J.id);
        if (se) {
          se.error || (se.view = J);
          continue;
        }
        H.push({ id: J.id, codes: [], count: J.count, amount: J.amount, label: J.label, player: J.player, depositTo: "", deposit: J.deposit, memo: J.memo, at: 0, view: J });
      }
    } catch {
    }
    const V = /* @__PURE__ */ new Map();
    for (const D of R(E)) (!V.has(D.id) || D.codes.length > V.get(D.id).codes.length) && V.set(D.id, D);
    for (const D of H) {
      const J = V.get(D.id);
      J ? V.set(D.id, { ...J, view: D.view ?? J.view, error: D.error, txid: J.txid ?? D.txid, codes: J.codes.length >= D.codes.length ? J.codes : D.codes, depositTo: J.depositTo || D.depositTo }) : V.set(D.id, D);
    }
    ue(E, [...V.values()]), e.changed();
  }
  async function ze(E, H) {
    const V = R(E).find((D) => D.id === H);
    if (!(!V || !V.depositTo || m)) {
      m = "Approve the payment in your wallet…", L = "", e.changed();
      try {
        const D = await e.pay(E, V.depositTo, BigInt(V.deposit), V.memo), J = R(E), se = J.find((Le) => Le.id === H);
        se && (se.txid = D), ue(E, J), L = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", m = "", mt(E);
      } catch (D) {
        L = `${/cancel/i.test(D.message) ? "Payment cancelled." : D.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        m = "", e.changed();
      }
    }
  }
  async function Ne(E, H, V, D) {
    if (m) return;
    if (!H.ok) {
      L = H.reason, e.changed();
      return;
    }
    m = "Sign in your wallet…", L = "", e.changed();
    let J = null;
    try {
      const se = { creator: E, count: H.count, amount: H.amount.toString(), label: V, issued: e.now(), ...D ? { player: D } : {} }, Le = await e.sign(E, nL(se));
      m = "Making your links…", e.changed(), J = await _e("/radio/gift/batch", { request: se, signature: Le });
      const Ae = R(E);
      Ae.unshift({ id: J.id, codes: J.codes, count: H.count, amount: J.amount, label: V, player: D ?? null, depositTo: J.depositTo, deposit: J.deposit, memo: J.memo, at: e.now() }), ue(E, Ae);
    } catch (se) {
      L = se.message || "Not made.", m = "", e.changed();
      return;
    }
    m = "", e.changed(), await ze(E, J.id);
  }
  async function Pe(E, H, V) {
    if (!m) {
      m = "Sign in your wallet (nothing is spent)…", L = "", e.changed();
      try {
        const D = { creator: E, batch: H, days: V, issued: e.now() }, J = await e.sign(E, cL(D));
        m = "Extending…", e.changed();
        const se = await _e("/radio/gift/batch/extend", { request: D, signature: J }), Le = R(E);
        for (const Ae of (se == null ? void 0 : se.batches) ?? []) {
          const Ge = Le.find((Tt) => Tt.id === Ae.id);
          Ge && (Ge.view = Ae, Ge.error = void 0);
        }
        ue(E, Le), L = se != null && se.extended ? `Extended ✓ ${se.extended === 1 ? "That batch has" : `${se.extended} batches have`} ${V} more days.` : "There was nothing live to extend.";
      } catch (D) {
        L = /cancel/i.test(D.message || "") ? "Cancelled. Nothing changed." : D.message || "Not extended.";
      } finally {
        m = "", e.changed();
      }
    }
  }
  const _n = (E) => Math.max(0, Math.ceil((E - e.now()) / 864e5));
  function En(E, H) {
    const V = H.filter((se) => {
      var Le;
      return ((Le = se.view) == null ? void 0 : Le.status) === "live" && se.view.copies.waiting > 0;
    });
    if (!V.length) return null;
    const D = Math.min(...V.map((se) => se.view.expires)), J = fe("p", "", "ppp-batch-extend");
    J.append(fe("span", `${V.length} live ${V.length === 1 ? "batch" : "batches"} · the first runs out in ${_n(D)} days. Extend ${V.length === 1 ? "it" : "them all"}: `));
    for (const se of Wg) {
      const Le = Qt(`+${se} days`, () => void Pe(E, "all", se), "tiny");
      Le.disabled = !!m, J.append(Le);
    }
    return J;
  }
  const gt = () => Ct(!!Ye.value, Ze.value, zt.value);
  function Ct(E, H, V) {
    const D = H === "max" ? rL(E) : Number(H), J = Jb(D, E), se = Number(V);
    return !Number.isInteger(se) || se < 1 || se > Da ? { ok: !1, reason: `Make 1 to ${Da} copies at a time.`, album: E, plays: D, amount: J, count: se } : sL(J) ? { ok: !0, reason: "", album: E, plays: D, amount: J, count: se, bill: oL(se, J, E) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: E, plays: D, amount: J, count: se };
  }
  const Ht = () => {
    var E;
    return ((E = e.batchDays) == null ? void 0 : E.call(e)) ?? iL;
  }, z = (E = gt()) => {
    if (!E.ok) return E.reason;
    const H = E.bill;
    return `Each copy: ${E.plays.toLocaleString()} paid plays (${rr(H.holders)} to song holders, ${rr(H.fees)} network fees)${E.album ? `, ${rr(H.float)} for the album’s likes` : ""}, ${rr(H.reserve)} kept so a listener can return what is left, + ${rr(H.sendFee)} to send it = ${rr(H.perCopy)} STX. ${E.count} copies = ${rr(H.total)} STX, paid now in one payment. Copies nobody claims within ${Ht()} days come back to you, and you can extend that at any time.`;
  }, O = (E, H) => H.codes.map((V) => $(E, V)), ee = fe("input");
  ee.type = "range", ee.min = String(Zb), ee.max = String(Dh), ee.step = "10000", ee.value = String(Y), ee.setAttribute("aria-label", "Gift amount");
  const re = fe("p", "", "ppp-gift-amount"), le = Qt("", () => {
    const E = e.main();
    E && j(E);
  }, "primary"), xt = () => {
    re.textContent = De(), le.textContent = `Gift ${rr(Y)} STX`;
  };
  ee.oninput = () => {
    Y = BigInt(ee.value), xt();
  };
  const De = () => `${rr(Y)} STX · about ${Na(Y).toLocaleString()} paid plays · you pay ${rr(Y + Rl)} STX with the network fee`;
  xt();
  const Fe = fe("input");
  Fe.maxLength = 60, Fe.placeholder = "Title, e.g. Proof of Sound", Fe.setAttribute("aria-label", "Player title");
  const Mt = fe("input");
  Mt.maxLength = 80, Mt.placeholder = "Artist (optional)", Mt.setAttribute("aria-label", "Player subtitle");
  const je = fe("textarea");
  je.rows = 3, je.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", je.setAttribute("aria-label", "Songs");
  const Ee = fe("input");
  Ee.placeholder = "Explicit songs (optional): their numbers, e.g. 1022. Never played unless asked for, with a warning", Ee.setAttribute("aria-label", "Explicit songs");
  const et = fe("input");
  et.inputMode = "numeric", et.placeholder = "Cover inscription number (optional), shown when the album loads", et.setAttribute("aria-label", "Cover inscription");
  const Ye = fe("select");
  Ye.setAttribute("aria-label", "Batch album");
  const Ze = fe("select");
  Ze.setAttribute("aria-label", "Plays per copy");
  for (const E of [.../* @__PURE__ */ new Set([50, 100, 250, ...ad])].sort((H, V) => H - V)) Ze.append(_a(`${E.toLocaleString()} plays`, String(E)));
  Ze.append(_a("Max (1 STX)", "max")), Ze.value = String(ad[0]);
  const zt = fe("input");
  zt.type = "number", zt.min = "1", zt.max = String(Da), zt.value = "10", zt.setAttribute("aria-label", "Copies");
  const un = fe("input");
  un.maxLength = 40, un.placeholder = "Label, e.g. Opera launch", un.setAttribute("aria-label", "Batch label");
  const Yn = fe("p", "", "ppp-mute"), hn = () => {
    Yn.textContent = z();
  };
  for (const E of [Ye, Ze, zt])
    E.oninput = hn, E.onchange = hn;
  hn();
  let Nt = null, Wn = 0;
  async function zn() {
    Wn = e.now();
    try {
      Nt = bL(await e.json("/radio/giveaway/players"));
    } catch {
      Nt = { ok: !1, text: "The wall could not be read just now." };
    }
    e.changed();
  }
  const Zr = (E, H) => {
    var D;
    if (((D = ey(R(E), e.now()).next) == null ? void 0 : D.n) !== H.n) {
      L = "That batch is already made. Check again.", e.changed();
      return;
    }
    Ne(E, Ct(!1, String(H.plays), String(H.count)), H.label);
  };
  function Br(E) {
    var Le;
    const H = ey(R(E), e.now()), V = Rh(), D = fe("div", "", "ppp-drop");
    D.append(
      fe("p", `The ${V.players.toLocaleString("en-GB")} players (admin) · ${H.done} of ${V.batches} batches live`, "ppp-cyan"),
      fe("p", `${V.tiers.map((Ae) => `${Ae.count} ${Vs(Ae.id).name}`).join(", ")}. ${V.batches} batches, ${rr(V.deposit)} STX in all, paid from this wallet. One batch at a time, top to bottom: each is a signature, then a payment. The links are saved on this device the moment they are made, so make every batch in this browser.`, "ppp-mute")
    );
    const J = fe("ol", "", "ppp-gift-list ppp-drop-steps");
    for (const Ae of H.steps) {
      const Ge = fe("li"), Tt = Ae.state === "live" ? "✓" : Ae.state === "touched" ? "!" : Ae.state === "todo" ? "○" : "…";
      if (Ge.append(fe("span", `${Tt} ${Ae.step.n}. ${Vs(Ae.step.tier).name} · ${Ae.step.count} × ${Ae.step.plays.toLocaleString("en-GB")} plays · ${rr(Ae.step.deposit)} STX`, "t"), fe("span", Ae.detail, Ae.state === "live" ? "ppp-ok" : Ae.state === "touched" ? "ppp-warn" : "ppp-mute")), Ae.state === "todo" && ((Le = H.next) == null ? void 0 : Le.n) === Ae.step.n) {
        const We = Qt("Sign and pay", () => Zr(E, Ae.step), "tiny");
        We.disabled = !!m, Ge.append(We);
      }
      if (Ae.state === "unpaid" && Ae.batch) {
        const We = Qt("Pay now", () => void ze(E, Ae.batch.id), "tiny");
        We.disabled = !!m, Ge.append(We);
      }
      J.append(Ge);
    }
    D.append(J);
    for (const Ae of H.problems) D.append(fe("p", Ae, "ppp-warn"));
    H.ready ? D.append(
      fe("p", `All ${V.batches} batches are live: ${H.codes.length.toLocaleString("en-GB")} links, none claimed. Copy them, then in Terminal (in the xtrata-2.0 folder) run:  node scripts/load-players-wall.mjs`, "ppp-ok"),
      gr("drop-copy", `Copy the ${H.codes.length.toLocaleString("en-GB")} links`, () => H.codes.join(`
`), "tiny", e.changed)
    ) : D.append(fe("p", "The links can be copied for the wall once every batch is live.", "ppp-mute")), e.now() - Wn > 6e4 && zn(), Nt && D.append(fe("p", Nt.text, Nt.ok ? "ppp-ok" : "ppp-mute"));
    const se = Qt("Check again", () => {
      ve = e.now(), mt(E), zn();
    }, "tiny");
    return se.disabled = !!m, D.append(se), D;
  }
  function kn(E, H, V) {
    const D = H.view, J = D == null ? void 0 : D.copies, se = H.error ? H.error : !D || D.status === "pending-deposit" ? H.txid ? "payment confirming…" : "waiting for your payment" : `${J.claimed} of ${D.count} claimed${J.refunding + J.refunded ? ` · ${J.refunded} refunded${J.refunding ? `, ${J.refunding} on their way` : ""}` : ""}`, Le = fe("li");
    if (Le.append(fe("span", `${H.label || "Batch"} · ${H.count} × ${rr(BigInt(H.amount))} STX`, "t"), fe("span", se, "ppp-mute")), !H.txid && H.depositTo && (!D || D.status === "pending-deposit") && Le.append(Qt("Pay now", () => void ze(E, H.id), "tiny")), (D == null ? void 0 : D.status) === "live" && J.waiting > 0) {
      Le.append(fe("span", `${_n(D.expires)} days left`, "ppp-mute"));
      for (const Ae of Wg) {
        const Ge = Qt(`+${Ae}`, () => void Pe(E, H.id, Ae), "tiny");
        Ge.title = `Extend this batch by ${Ae} days (a signature, no payment)`, Ge.setAttribute("aria-label", `Extend ${H.label || "this batch"} by ${Ae} days`), Ge.disabled = !!m, Le.append(Ge);
      }
    }
    if (H.codes.length && (D == null ? void 0 : D.status) === "live") {
      const Ae = O(V, H);
      Le.append(
        gr("batch-copy:" + H.id, "Copy all links", () => Ae.join(`
`), "tiny", e.changed),
        gr("batch-csv:" + H.id, "Copy as CSV", () => ["copy,link", ...Ae.map((Ge, Tt) => `${Tt + 1},${Ge}`)].join(`
`), "tiny", e.changed)
      );
    } else H.codes.length || Le.append(fe("span", "links were made on another device", "ppp-mute"));
    return Le;
  }
  const $n = fe("select");
  $n.setAttribute("aria-label", "Plays in each copy");
  for (const E of [.../* @__PURE__ */ new Set([50, 100, 250, ...ad])].sort((H, V) => H - V)) $n.append(_a(`${E.toLocaleString()} plays`, String(E)));
  $n.value = "50";
  const Rt = fe("input");
  Rt.type = "number", Rt.min = "1", Rt.max = String(Da), Rt.value = "10", Rt.setAttribute("aria-label", "How many copies");
  const pn = fe("input");
  pn.maxLength = 40, pn.placeholder = "A note recipients see, e.g. Launch week (optional)", pn.setAttribute("aria-label", "Note for recipients");
  const Re = fe("p", "", "ppp-mute");
  function on(E, H, V) {
    const D = () => Ct(!0, $n.value, Rt.value), J = () => {
      Re.textContent = z(D());
    };
    for (const ft of [$n, Rt])
      ft.oninput = J, ft.onchange = J;
    J();
    const se = () => (pn.value.trim() || H.title).replace(/[^ -~]/g, "").slice(0, 40), Le = Qt("Sign, pay and make links", () => {
      Ne(E, D(), se(), H.id);
    }, "primary");
    Le.disabled = !!m;
    const Ae = (ft, St) => {
      const yt = fe("label", ft);
      return yt.append(St), yt;
    }, Ge = [
      fe("p", "Each copy is a link. Whoever opens it gets this album with its own plays, paid for by you. You pay for every copy now, in one payment; copies nobody claims come back to you when their time runs out, and you can extend that.", "ppp-mute"),
      Ae("Plays in each ", $n),
      Ae("Copies ", Rt),
      pn,
      Re,
      Le
    ];
    e.now() - ve > 3e4 && (ve = e.now(), mt(E));
    const Tt = R(E).filter((ft) => ft.player === H.id);
    if (Tt.length) {
      const ft = fe("ul", "", "ppp-gift-list");
      for (const St of Tt.slice(0, 10)) ft.append(kn(E, St, V));
      Ge.push(ft);
    }
    const We = En(E, R(E));
    return We && Ge.push(We), m && Ge.push(fe("p", m, "ppp-cyan")), L && Ge.push(fe("p", L, /✓/.test(L) ? "ppp-ok" : "ppp-warn")), Ge;
  }
  function mo(E) {
    var J, se;
    const H = (J = E.gate) == null ? void 0 : J.gifts;
    if (!(H != null && H.enabled) || !H.admin || ["off", "elsewhere", "unsupported"].includes(E.step)) return null;
    const V = e.main(), D = [fe("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!V)
      D.push(fe("p", "Connect a Stacks wallet (Xverse or Leather) to make albums."), Qt("Connect Stacks wallet", zh, "primary"));
    else if (H.admin) {
      const Le = fe("div", "", "ppp-gift-admin"), Ae = (St, yt) => {
        const _t = fe("label", St);
        return _t.append(yt), _t;
      }, Ge = ce(V);
      Le.append(
        fe("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        Fe,
        Mt,
        je,
        et,
        Ee,
        Qt("Sign and make player", () => void Xe(V, { title: Fe.value, subtitle: Mt.value, tracks: je.value, cover: et.value, explicit: Ee.value }))
      );
      const Tt = Qt("Sign, pay and make links", () => {
        Ne(V, gt(), un.value.trim(), Ye.value || void 0);
      });
      Tt.disabled = !!m;
      const We = Ye.value;
      Ye.replaceChildren(_a("No album (starter copies)", ""), ...Ge.map((St) => _a(`${St.title} · ${St.tracks} songs`, St.id))), Ge.some((St) => St.id === We) && (Ye.value = We), hn(), Le.append(
        fe("p", `Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after ${Ht()} days unless you extend`, "ppp-cyan"),
        Ae("Album ", Ye),
        Ae("Plays each ", Ze),
        Ae("Copies ", zt),
        un,
        Yn,
        Tt
      ), e.now() - ve > 3e4 && (ve = e.now(), mt(V));
      const ft = R(V);
      if (ft.length) {
        const St = fe("ul", "", "ppp-gift-list");
        for (const _t of ft.slice(0, 20)) St.append(kn(V, _t, ((se = E.gate) == null ? void 0 : se.radioUrl) ?? null));
        Le.append(St);
        const yt = En(V, ft);
        yt && Le.append(yt);
      }
      Le.append(Br(V)), D.push(Le);
    }
    return m && D.push(fe("p", m, "ppp-cyan")), L && D.push(fe("p", L, /✓/.test(L) ? "ppp-ok" : "ppp-warn")), oe.replaceChildren(...D), oe;
  }
  return { banner: X, funder: Q, renderFold: mo, copies: on, liveGift: i, incomingAlbum: a, incomingStarter: c, setAside: h, pendingCode: () => t && !t.done && (!t.view || t.view.status === "live") ? t.code : null, inProgress: B };
}
const vL = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function AL(e) {
  if (!Array.isArray(e)) return [];
  const t = [];
  for (const n of e) {
    if (!n || !Number.isSafeInteger(n.slot) || n.slot < 1 || typeof n.address != "string") continue;
    const r = n.player, s = r && typeof r.id == "string" && typeof r.title == "string" && Array.isArray(r.tracks) ? r : null;
    s && t.push({
      slot: n.slot,
      address: n.address,
      state: n.state === "arrived" ? "arrived" : "sending",
      amount: String(n.amount ?? "0"),
      label: typeof n.label == "string" ? n.label : "",
      from: typeof n.from == "string" ? n.from : null,
      source: String(n.source ?? ""),
      player: s
    });
  }
  return t;
}
const EL = (e) => {
  var t, n, r;
  return [(t = e.player) == null ? void 0 : t.title, (n = e.player) == null ? void 0 : n.subtitle, e.label, `#${e.slot}`, ...(((r = e.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function kL(e, t) {
  const n = t.query.toLowerCase().split(/\s+/).filter(Boolean), r = e.filter((o) => (!t.pinnedOnly || t.pins.has(o.slot)) && (() => {
    const i = EL(o);
    return n.every((a) => i.includes(a));
  })()), s = {
    recent: (o, i) => (t.recents[i.slot] ?? 0) - (t.recents[o.slot] ?? 0) || i.slot - o.slot,
    newest: (o, i) => i.slot - o.slot,
    oldest: (o, i) => o.slot - i.slot,
    title: (o, i) => {
      var a, c;
      return (((a = o.player) == null ? void 0 : a.title) ?? "").localeCompare(((c = i.player) == null ? void 0 : c.title) ?? "") || o.slot - i.slot;
    }
  };
  return r.sort((o, i) => Number(t.pins.has(i.slot)) - Number(t.pins.has(o.slot)) || s[t.sort](o, i));
}
function $L(e, t = 100) {
  const n = Object.entries(e).sort((r, s) => s[1] - r[1]).slice(0, t);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const kf = /* @__PURE__ */ new Set(), zl = (e) => (kf.add(e), () => {
  kf.delete(e);
}), Gl = () => {
  for (const e of [...kf])
    try {
      e();
    } catch {
    }
}, oy = "xtrata:al-thumb:v1:", Gh = "-", Pa = 96, IL = 24 * 1024 * 1024, vn = /* @__PURE__ */ new Map(), sy = /* @__PURE__ */ new Set(), $f = [];
let ld = !1, ud;
const sc = (e, t) => {
  try {
    if (t === void 0) return window.localStorage.getItem(oy + e);
    window.localStorage.setItem(oy + e, t);
  } catch {
  }
  return null;
};
function Kh(e) {
  return new Promise((t) => {
    var n;
    try {
      const r = document.createElement("canvas"), s = (n = r.getContext) == null ? void 0 : n.call(r, "2d");
      if (!s) return t(e);
      const o = new Image(), i = setTimeout(() => t(e), 8e3);
      o.onload = () => {
        clearTimeout(i);
        try {
          const a = Math.min(o.naturalWidth, o.naturalHeight);
          if (!a) return t(e);
          r.width = r.height = Pa, s.fillStyle = "#143a40", s.fillRect(0, 0, Pa, Pa), s.drawImage(o, (o.naturalWidth - a) / 2, (o.naturalHeight - a) / 2, a, a, 0, 0, Pa, Pa), t(r.toDataURL("image/jpeg", 0.82));
        } catch {
          t(e);
        }
      }, o.onerror = () => {
        clearTimeout(i), t(e);
      }, o.src = e;
    } catch {
      t(e);
    }
  });
}
async function LL(e) {
  var c, u, h, d, w;
  const t = await fetch("/inscription/" + e, { signal: AbortSignal.timeout(6e4) }), n = (t.headers.get("content-type") || "").toLowerCase();
  if (!t.ok)
    return await ((c = t.body) == null ? void 0 : c.cancel()), null;
  if (n.startsWith("image/"))
    return await ((u = t.body) == null ? void 0 : u.cancel()), "/inscription/" + e;
  if (!n.includes("text/html"))
    return await ((h = t.body) == null ? void 0 : h.cancel()), "";
  let r = "", s = 0;
  const o = (y) => {
    let v = 0;
    for (; ; ) {
      const S = r.slice(v).search(/<img\b/i);
      if (S < 0)
        return r = y ? "" : r.slice(Math.max(0, r.length - 4)), null;
      const I = v + S, U = r.indexOf(">", I);
      if (U < 0)
        return r = r.slice(I), null;
      const P = r.slice(I, U + 1), A = P.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (A) return A[1].replace(/&amp;/g, "&");
      const T = P.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (T) return "/inscription/" + T[1];
      v = U + 1;
    }
  }, i = (w = (d = t.body) == null ? void 0 : d.getReader) == null ? void 0 : w.call(d);
  if (!i)
    return r = await t.text(), o(!0) ?? "";
  const a = new TextDecoder();
  for (; ; ) {
    const { done: y, value: v } = await i.read();
    if (y) break;
    s += v.byteLength, r += a.decode(v, { stream: !0 });
    const S = o(!1);
    if (S)
      return await i.cancel(), S;
    if (s > IL)
      return await i.cancel(), null;
  }
  return r += a.decode(), o(!0) ?? "";
}
async function CL() {
  if (!ld) {
    ld = !0;
    try {
      for (; $f.length; ) {
        const e = $f.shift();
        if (!vn.has(e))
          try {
            const t = await LL(e);
            if (t === null) continue;
            if (!t) {
              vn.set(e, ""), sc(e, Gh), Gl();
              continue;
            }
            const n = await Kh(t);
            vn.set(e, n), n.startsWith("data:image/jpeg") && sc(e, n), Gl();
          } catch {
          }
      }
    } finally {
      ld = !1;
    }
  }
}
function Kl(e, t) {
  if (t && !vn.get(e) ? (vn.set(e, t), Kh(t).then((r) => {
    r !== t && (vn.set(e, r), r.startsWith("data:image/jpeg") && sc(e, r), Gl());
  })) : t === "" && !vn.has(e) && vn.set(e, ""), vn.has(e)) return vn.get(e);
  const n = sc(e);
  if (n != null) {
    const r = n === Gh ? "" : n;
    return vn.set(e, r), r;
  }
  return sy.has(e) || (sy.add(e), $f.push(e), ud || (ud = setTimeout(() => {
    ud = void 0, CL();
  }, 1200))), "";
}
function iy(e) {
  if (vn.has(e)) return vn.get(e);
  const t = sc(e);
  if (t == null) return null;
  const n = t === Gh ? "" : t;
  return vn.set(e, n), n;
}
const dd = /* @__PURE__ */ new Map(), fd = /* @__PURE__ */ new Set();
function fl(e) {
  return !e || !Number.isSafeInteger(e) || e < 0 ? "" : dd.has(e) ? dd.get(e) : (fd.has(e) || (fd.add(e), fetch("/inscription/" + e, { signal: AbortSignal.timeout(2e4) }).then(async (t) => {
    var r, s, o, i;
    const n = (t.headers.get("content-type") || "").toLowerCase();
    if (!t.ok)
      throw await ((r = t.body) == null ? void 0 : r.cancel()), new Error("no cover");
    return n.startsWith("image/") ? (await ((s = t.body) == null ? void 0 : s.cancel()), "/inscription/" + e) : n.includes("text/html") ? (((o = (await t.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : o[1]) ?? "").replace(/&amp;/g, "&") : (await ((i = t.body) == null ? void 0 : i.cancel()), "");
  }).then((t) => {
    dd.set(e, t), Gl();
  }).catch(() => {
    fd.delete(e);
  })), "");
}
const Di = 12, TL = 5e3, Dn = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, Fi = (e, t, n = "") => {
  const r = Dn("button", e, n);
  return r.type = "button", r.onclick = t, r;
};
function BL(e) {
  let t, n = [], r = 0, s = !1, o = !1, i = -1 / 0, a = "", c = "recent", u = !1, h = Di;
  const d = Dn("div", "", "ppp-shelf-box");
  zl(() => e.changed());
  const w = (_) => "xtrata.radio.shelf.pins.v1:" + _, y = (_) => "xtrata.radio.shelf.recent.v1:" + _, v = (_, N) => {
    try {
      return JSON.parse(e.store.get(_) || "null") ?? N;
    } catch {
      return N;
    }
  }, S = (_) => new Set(v(w(_), []).filter((N) => Number.isSafeInteger(N))), I = (_) => {
    const N = v(y(_), {}), W = {};
    for (const [j, ye] of Object.entries(N)) Number.isSafeInteger(Number(j)) && typeof ye == "number" && (W[Number(j)] = ye);
    return W;
  };
  async function U(_) {
    if (!s) {
      s = !0, o = !1;
      try {
        const N = [];
        let W = 0, j = 0;
        for (let ye = 0; ye < TL / 100 + 1; ye++) {
          const ce = await e.json(`/radio/gift/shelf?root=${encodeURIComponent(_)}&after=${W}&limit=100`);
          if (N.push(...AL(ce == null ? void 0 : ce.shelf)), j = Number(ce == null ? void 0 : ce.total) || N.length, !(ce != null && ce.next) || !Number.isSafeInteger(ce.next)) break;
          W = ce.next;
        }
        _ === t && (n = N, r = j, i = e.now());
      } catch {
        o = !0;
      } finally {
        s = !1, e.changed();
      }
    }
  }
  const P = () => {
    i = -1 / 0;
  }, A = Dn("input");
  A.type = "search", A.placeholder = "Search title, artist or #", A.setAttribute("aria-label", "Search your albums"), A.oninput = () => {
    a = A.value, h = Di, e.changed();
  };
  const T = Dn("select");
  T.setAttribute("aria-label", "Sort albums");
  for (const _ of vL) {
    const N = document.createElement("option");
    N.value = _.value, N.textContent = _.label, T.append(N);
  }
  T.onchange = () => {
    c = T.value, h = Di, e.changed();
  };
  const B = Fi("", () => {
    u = !u, h = Di, e.changed();
  }, "tiny"), X = Dn("div", "", "ppp-shelf-tools");
  X.append(A, T, B);
  const Q = Dn("div"), oe = Dn("div");
  function Y(_) {
    const N = _.step === "off" || _.step === "elsewhere" ? void 0 : _.root;
    if (N !== t && (t = N, n = [], r = 0, i = -1 / 0, h = Di), !N || _.walletCannotAlbums) return null;
    if (!s && e.now() - i > 5 * 6e4 && U(N), !n.length)
      return o ? (oe.replaceChildren(Dn("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), Fi("Try again", () => {
        i = -1 / 0, e.changed();
      }, "quiet")), d.replaceChildren(oe), d) : null;
    const W = S(N), j = I(N), ye = kL(n, { query: a, sort: c, pinnedOnly: u, pins: W, recents: j });
    A.value !== a && (A.value = a), T.value = c, B.textContent = u ? "★ Pinned only" : "☆ Pinned only", B.setAttribute("aria-pressed", String(u));
    const ce = [];
    if (_.slot > 0 && ce.push(Fi("← My player", () => e.open(0), "quiet")), !ye.length) ce.push(Dn("p", "No album matches that.", "ppp-mute"));
    else {
      const Xe = Dn("ul", "", "ppp-shelf-list");
      for (const $ of ye.slice(0, h)) {
        const R = Dn("li", "", $.slot === _.slot ? "now" : ""), ue = W.has($.slot), me = Fi(ue ? "★" : "☆", () => {
          const gt = new Set(W);
          ue ? gt.delete($.slot) : gt.add($.slot), e.store.set(w(N), JSON.stringify([...gt])), e.changed();
        }, "tiny");
        me.setAttribute("aria-label", ue ? `Unpin ${$.player.title}` : `Pin ${$.player.title}`);
        const _e = [$.player.subtitle, `${Xr($.player).length} ${Xr($.player).length === 1 ? "song" : "songs"}`, $.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), ve = $.slot === _.slot, mt = Fi(ve ? "Playing" : "Select", () => {
          e.store.set(y(N), JSON.stringify($L({ ...j, [$.slot]: e.now() }))), e.open($.slot);
        }, ve ? "tiny ppp-pick" : "tiny primary ppp-pick");
        mt.disabled = ve, mt.setAttribute("aria-label", ve ? `${$.player.title}, playing now` : `Open ${$.player.title}`);
        const ze = Xr($.player)[0], Ne = $.player.cover ?? (ze == null ? void 0 : ze.id), Pe = Ne ? Kl(String(Ne)) : "", _n = Dn("span", "", "ppp-shelf-art");
        if (Pe) {
          const gt = document.createElement("img");
          gt.src = Pe, gt.alt = "", gt.decoding = "async", _n.append(gt);
        } else _n.textContent = "💿";
        const En = Dn("span", "", "ppp-shelf-txt");
        En.append(Dn("span", $.player.title, "t"), Dn("span", _e, "ppp-mute")), R.append(me, _n, En, mt), Xe.append(R);
      }
      ce.push(Xe), ye.length > h && ce.push(Fi(`Show more (${ye.length - h} left)`, () => {
        h += Di, e.changed();
      }, "quiet"));
    }
    return o && ce.push(Dn("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), Q.replaceChildren(...ce), d.firstChild !== X && d.replaceChildren(X, Q), d;
  }
  return { render: Y, invalidate: P, count: () => r || n.length, latest: () => {
    if (!t || !n.length) return null;
    const _ = I(t), N = [...n].filter((W) => W.player).sort((W, j) => (_[j.slot] ?? 0) - (_[W.slot] ?? 0) || j.slot - W.slot)[0];
    return N ? { slot: N.slot, title: N.player.title } : null;
  } };
}
const ay = "http://www.w3.org/2000/svg", ML = [
  ["#ececec", "M17 65 18 66V191L243 192 424 391H427L609 192H729L730 191H833V66L834 65 833 64H558L426 209H424L292 64H18zM29 119 32 117 271 118 423 284H428L580 118H794L795 117 820 118 822 120V179L821 180H603L428 372 424 373 248 180H31L30 179zM29 77 31 75 287 76 425 227 447 205 564 76 816 75 822 77V105L820 107H582L574 107 426 268H424L277 107H31L29 105z"],
  ["#3a7db5", "M812 193 809 197 760 238H620L605 253 589 272 436 439 541 555 621 641H759L764 643 809 681 825 682 826 681 822 676 784 645V643L792 641H837L758 555 753 552H742L640 440V437L734 333 741 326 755 325 807 268 836 239V238H784L783 235 791 227 828 196V194L826 193zM657 326H719L720 329 667 387H664V390L625 433 621 439 674 498 704 529 721 549 720 552H657L555 441 556 437zM626 251H802L803 254 748 313H651L537 438V440L648 562 652 565H750L797 616 804 625 803 628H627L455 441V439L463 429zM23 193 34 205 69 235 68 238H15V239L19 241 94 323 101 326H110L211 436V440L113 548 109 552H99L94 554 17 638 16 641H63L67 643V645L28 678 26 681 27 682 43 681 90 641H230L309 556 354 505 384 474 399 456 406 450 414 441V439L231 238H92L41 196 40 193zM136 326H193L195 327 295 437V442L279 458 194 552H131L130 549 230 439 179 381 174 377 132 331V328zM49 251H226L344 380 395 438V442L224 628H48L47 625 101 565H199L299 457 314 439 300 422 199 313H103L48 255z"],
  ["#e98a32", "M834 687 831 684H822L817 686 812 684 811 685H606L427 490 423 491 413 501 246 685H28L27 684 18 685 17 689 18 791H288L291 790 424 644H427L562 791H831L833 790zM30 700 32 697H252L424 509H427L597 695 601 697H818L821 701V775L819 778H567L460 660 427 626 422 627 411 638 284 778H32L30 773z"]
];
function Vl(e = "", t = !1) {
  const n = document.createElementNS(ay, "svg");
  n.setAttribute("viewBox", "0 40 850 770"), n.setAttribute("aria-hidden", "true"), e && n.setAttribute("class", e);
  for (const [r, s] of ML) {
    const o = document.createElementNS(ay, "path");
    o.setAttribute("fill-rule", "evenodd"), o.setAttribute("fill", t ? "currentColor" : r), o.setAttribute("d", s), n.append(o);
  }
  return n;
}
const at = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, dn = (e, t, n, r = !1) => {
  const s = at("button", e, t);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, o1 = (e) => e.toLocaleString(), cy = { gift: ["Picked", "Passkey", "Listen"], fresh: ["Welcome", "Passkey", "Listen"] }, NL = (e) => e === "gift" || e === "new" ? 1 : e === "arriving" ? 2 : e === "landed" ? 3 : -1;
function Xl(e, t) {
  const n = at("ol", "al-steps");
  return n.setAttribute("aria-label", t >= e.length ? "All steps done" : `Step ${t + 1} of ${e.length}: ${e[t]}`), e.forEach((r, s) => {
    const o = at("li", s < t ? "is-done" : s === t ? "is-now" : "");
    o.append(at("i", "", s < t ? "✓" : String(s + 1)), at("span", "", r)), n.append(o);
  }), n;
}
function _L() {
  const e = at("div", "tier-disc tier-disc--mid");
  return e.dataset.tier = "mystery", e.setAttribute("role", "img"), e.setAttribute("aria-label", "A player waiting to be opened"), e.append(at("span", "tier-disc__mark", "?")), e;
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
}, PL = (e) => e ? `Disc ${e} is yours` : xn.gift.title, UL = (e, t, n = !1) => n ? "What is inside? Play it to find out." : e ? `${o1(e)} plays inside. Every play pays the artist.` : "Every play pays the artist.", OL = (e) => e ? `${o1(e)} plays. Every one pays the artist.` : "Every play pays the artist.";
function ly(e, t = !1) {
  const n = at("div", "al-now" + (t ? " al-now--big" : "")), r = at("img", "al-now__art");
  r.src = e.art, r.alt = "";
  const s = at("div", "al-now__t");
  s.append(at("b", "", e.title || "Playing now"), at("span", "", e.artist));
  const o = at("i", "al-now__eq" + (e.playing ? " is-on" : ""));
  return o.setAttribute("aria-hidden", "true"), o.append(at("s"), at("s"), at("s")), n.append(r, s, o), n.setAttribute("role", "group"), n.setAttribute("aria-label", `${e.playing ? "Playing" : "Starting"}: ${e.title || "your first song"}${e.artist ? ` by ${e.artist}` : ""}`), n;
}
const HL = (e) => e ? `You got a ${e.name} player` : xn.landed.title;
function DL(e, t = !0) {
  const n = at("div", "tier-disc" + (t ? " tier-disc--big" : ""));
  return n.dataset.tier = e.id, n.setAttribute("role", "img"), n.setAttribute("aria-label", `${e.name} player`), n.append(at("span", "tier-disc__mark", e.mark)), n;
}
function FL(e) {
  const t = document.documentElement;
  let n = !1;
  return {
    showing: () => n,
    /** `albumActive`: the album view owns the mount right now, so this view only steps aside and touches nothing. */
    render(r, s = !1) {
      var h, d;
      if (!r) {
        n && !s && (e.hidden = !0, e.replaceChildren(), delete t.dataset.view, delete t.dataset.asking), n = !1, delete t.dataset.welcome;
        return;
      }
      n = !0, t.dataset.view = "album", t.dataset.welcome = r.mode, r.asking ? t.dataset.asking = "1" : delete t.dataset.asking;
      const o = at("header", "al-top"), i = at("a", "al-brand");
      i.href = "/radio", i.append(Vl("al-logo"), at("span", "", "Xtrata "), at("b", "", "Music")), o.append(i);
      const a = at("div", "al-body al-body--welcome"), c = at("div", "al-welcome"), u = r.mode;
      if (u === "checking")
        c.append(at("p", "al-welcome-wait", xn.checking));
      else {
        const w = NL(u);
        w >= 0 && c.append(Xl(u === "new" ? cy.fresh : cy.gift, w)), r.tier && (u === "landed" || u === "back" || u === "empty") ? c.append(DL(r.tier)) : u === "gift" || u === "arriving" ? c.append(_L()) : u === "new" && c.append(Vl("al-hero-mark"));
        const y = r.now && (u === "gift" || u === "arriving" || u === "landed") ? r.now : null, v = u === "new" && !!r.installed;
        if (c.append(at("h1", "", u === "landed" ? HL(r.tier) : u === "back" && r.tier ? `Your ${r.tier.name} player` : u === "gift" ? PL(r.spot) : v ? xn.installedNew.title : xn[u].title)), y && u === "arriving" ? c.append(ly(y, !0)) : c.append(at("p", "", u === "gift" ? UL(r.plays, r.from, r.mystery) : u === "landed" ? OL(r.plays) : v ? xn.installedNew.body : xn[u].body)), y && u !== "arriving" && c.append(ly(y)), r.status.length) {
          const S = at("div", "al-status");
          S.setAttribute("role", "status"), S.append(...r.status), c.append(S);
        }
        if (r.asking) c.append(at("p", "al-hint al-hint--ask", xn.asking));
        else if (u === "back" && r.claimNew) {
          const S = xn.backClaim;
          c.append(at("p", "al-hint", S.body)), r.canStart && r.replaceOld ? c.append(dn("al-primary", S.replace, r.replaceOld, r.busy), at("p", "al-hint", S.replaceHint), dn("al-link", S.both, r.claimNew, r.busy), dn("al-link", S.unlock, r.unlock, r.busy)) : r.canStart && c.append(dn("al-primary", S.primary, r.claimNew, r.busy), at("p", "al-hint", S.hint), dn("al-link", S.unlock, r.unlock, r.busy)), c.append(dn("al-link", xn.back.full, r.full));
        } else if (u === "gift") {
          const S = xn.gift;
          if (r.canStart) {
            const I = dn("al-primary" + (r.intro ? " al-primary--play" : ""), r.intro ? S.play : S.primary, r.start, r.busy);
            c.append(I, at("p", "al-hint", S.hint));
          }
          r.canStart ? c.append(dn("al-link", S.returning, r.returning, r.busy)) : c.append(dn("al-link", S.full, r.full));
        } else if (u === "new" && r.installed) {
          const S = xn.installedNew;
          r.canStart && c.append(dn("al-primary", S.primary, r.returning, r.busy), at("p", "al-hint", S.hint), dn("al-link", S.fresh, r.start, r.busy)), c.append(dn("al-link", xn.new.full, r.full));
        } else if (u === "new" || u === "back") {
          const S = xn[u];
          r.canStart && c.append(dn("al-primary", S.primary, u === "back" ? r.unlock : r.start, r.busy), at("p", "al-hint", S.hint)), r.canStart && c.append(dn("al-link", S.returning, r.returning, r.busy)), c.append(dn("al-link", S.full, r.full));
        } else if (u === "landed") {
          if (c.append(dn("al-primary", (h = r.now) != null && h.playing ? xn.landed.playing : xn.landed.primary, r.full)), (d = r.albums) != null && d.length && !r.now) {
            c.append(at("p", "al-hint", "Or start with an album that comes with your player:"));
            for (const S of r.albums) {
              const I = dn("al-album", "", S.run);
              if (S.cover) {
                const P = at("img", "al-album__art");
                P.src = S.cover, P.alt = "", I.classList.add("al-album--art"), I.append(P);
              }
              const U = at("span", "al-album__t");
              U.append(at("b", "", S.title), at("span", "", S.by)), I.append(U), c.append(I);
            }
          }
        } else u === "empty" && c.append(dn("al-primary", xn.empty.primary, r.restock), dn("al-link", xn.empty.full, r.full));
      }
      a.append(c), e.hidden = !1, e.replaceChildren(o, a);
    }
  };
}
const jL = 20, RL = ["Album", "Passkey", "Listen"], Bn = (e, t = 22, n = !1) => `<svg width="${t}" height="${t}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${e}</svg>`, en = {
  grid: Bn('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: Bn('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: Bn('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: Bn('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: Bn('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: Bn('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: Bn('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: Bn('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: Bn('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: Bn('<path d="M6 9l6 6 6-6"/>', 18),
  right: Bn('<path d="M9 6l6 6-6 6"/>', 16),
  close: Bn('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: Bn('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: Bn('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: Bn('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: Bn('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: Bn('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function ie(e, t = {}, ...n) {
  const r = document.createElement(e);
  for (const [s, o] of Object.entries(t))
    o == null || o === !1 || (s === "class" ? r.className = String(o) : s === "html" ? r.innerHTML = String(o) : s.startsWith("on") && typeof o == "function" ? r[s.toLowerCase()] = o : s === "disabled" ? r.disabled = !!o : r.setAttribute(s, o === !0 ? "" : String(o)));
  for (const s of n) s != null && s !== !1 && r.append(s);
  return r;
}
const Hn = (e, ...t) => ie("button", { type: "button", ...e }, ...t), Qc = (e) => `${Math.floor(e / 60)}:${String(Math.floor(e % 60)).padStart(2, "0")}`, Ua = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`, zL = { music: "My music", device: "This device", gifts: "Albums (admin)" }, GL = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function uy(e, t, n = {}) {
  const r = !!n.list;
  let s = null, o = "", i = !1;
  const a = document.documentElement;
  function c(m) {
    var _, N, W;
    if (!m || !Number.isSafeInteger(m)) return "";
    const L = (W = (N = (_ = t.radio()) == null ? void 0 : _.getState) == null ? void 0 : N.call(_)) == null ? void 0 : W.albumCover;
    return L != null && L.url && Number(L.tokenId) === m ? L.url : fl(m);
  }
  zl(() => Y());
  function u(m) {
    var _;
    o = m, m ? a.dataset.sheet = m : delete a.dataset.sheet;
    const L = document.querySelector(".side");
    if (m && m !== "more") {
      for (const j of GL[m]) {
        const ye = L == null ? void 0 : L.querySelector(j);
        ye && (ye.open = !0);
      }
      const N = document.getElementById("sheetTitle");
      N && (N.textContent = zL[m]);
      const W = document.getElementById("sheetExtra");
      W && W.replaceChildren(...m === "music" ? [d()] : []), (_ = L == null ? void 0 : L.scrollTo) == null || _.call(L, { top: 0 });
    }
    Y();
  }
  const h = r ? null : document.getElementById("sheetClose");
  h && (h.onclick = () => u("")), r || document.addEventListener("keydown", (m) => {
    m.key === "Escape" && o && a.dataset.view === "album" && u("");
  });
  const d = () => Hn(
    { class: "al-row", onClick: () => {
      u(""), t.openPlayer();
    } },
    ie("span", { class: "al-row-i", html: en.radio }),
    ie("span", { class: "al-row-t" }, ie("b", {}, "Xtrata Radio"), ie("small", {}, "Every song on-chain · FM, liked, all")),
    ie("span", { class: "al-row-go", html: en.right })
  );
  let w = null, y = !1;
  const v = () => {
    var L;
    const m = t.radio();
    y || !(m != null && m.subscribe) || (y = !0, m.subscribe((_) => {
      w = _, (s == null ? void 0 : s.mode) === "open" && Y();
    }), w = ((L = m.getState) == null ? void 0 : L.call(m)) ?? null);
  };
  r || setInterval(() => {
    var N, W;
    if ((s == null ? void 0 : s.mode) !== "open" || !(w != null && w.playing)) return;
    const m = (W = (N = t.radio()) == null ? void 0 : N.getPosition) == null ? void 0 : W.call(N), L = e.querySelector(".al-bar > i"), _ = e.querySelectorAll(".al-times span");
    !m || !L || (L.style.width = m.duration ? `${Math.min(100, m.current / m.duration * 100)}%` : "0%", _.length === 2 && (_[0].textContent = Qc(m.current || 0), _[1].textContent = m.duration ? Qc(m.duration) : "–:––"));
  }, 500);
  let S = "", I = null;
  function U(m, L, _ = {}) {
    const N = _.song || c(m.cover), j = [N ? ie("img", { src: N, alt: _.song ? "Song artwork" : `${m.title} cover` }) : ie("div", { class: "al-cover-fallback" }, ie("b", {}, m.title), m.subtitle ? ie("span", {}, m.subtitle) : null), _.paused ? ie("span", { class: "al-paused" }, ie("i", { html: en.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], ye = "al-cover" + (L ? "" : " al-cover--small") + (_.paused ? " is-paused" : "");
    return _.flip ? (j.push(ie("span", { class: "al-flip", "aria-hidden": "true", html: en.flip })), Hn({ class: ye + " is-flippable", "aria-label": _.flipped ? "Show this song’s artwork" : `Show the ${m.title} cover`, onClick: _.flip }, ...j)) : ie("div", { class: ye }, ...j);
  }
  function P(m) {
    return m.plays === null || m.plays === void 0 ? ie("span", { class: "al-chip al-chip--quiet" }, m.playsComing ? "Plays on their way…" : "…") : m.plays === 0 ? ie("span", { class: "al-chip al-chip--out" }, m.playsComing ? "Plays on their way…" : "No plays left") : ie("span", { class: "al-chip" + (m.plays <= jL ? " al-chip--low" : "") }, `${Ua(m.plays, "play", "plays")} left`);
  }
  function A(m) {
    const L = m.player, _ = L.tracks.filter((W) => !W.hidden), N = [];
    return m.step !== void 0 && N.push(Xl(RL, m.step)), m.mode === "arrive" && m.from && N.push(ie("p", { class: "al-from" }, ie("span", { html: en.gift }), ie("span", {}, ie("b", {}, m.from), " sent you an album"))), N.push(U(L, !0)), N.push(ie(
      "div",
      { class: "al-intro" },
      ie("h1", {}, L.title),
      L.subtitle ? ie("p", { class: "al-artist" }, L.subtitle) : null,
      _.length ? ie("p", { class: "al-songline" }, _.map((W) => W.title || `#${W.id}`).join(" · ")) : null,
      ie("span", { class: "al-chip" }, [Ua(_.length, "song", "songs"), m.offered ? Ua(m.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), m.status.length && N.push(ie("div", { class: "al-status", role: "status" }, ...m.status)), N.push(ie("div", { class: "al-grow" })), m.asking ? N.push(ie("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : m.primary && N.push(Hn({ class: "al-primary", onClick: m.primary.run, disabled: m.busy }, ie("span", { html: en.playSmall }), m.primary.label)), m.hint && !m.asking && N.push(ie("p", { class: "al-hint" }, m.hint)), m.secondary && !m.asking && N.push(Hn({ class: "al-link", onClick: m.secondary.run, disabled: m.busy }, m.secondary.label)), N;
  }
  function T(m, L) {
    const { songs: _, current: N, started: W, own: j, out: ye, waiting: ce } = L, Xe = m.player, $ = t.radio(), R = [];
    R.push(ie("div", { class: "al-listhead" }, ie("span", {}, ie("b", {}, Xe.title), ` · ${Ua(_.length, "song", "songs")}`), P(m)));
    const ue = c(Xe.cover), me = "album:" + Xe.cover;
    ue && !vn.has(me) && (vn.set(me, ue), Kh(ue).then((ve) => {
      ve !== ue && (vn.set(me, ve), Y());
    }));
    const _e = ue ? vn.get(me) || ue : "";
    return R.push(ie("ol", { class: "al-tracks" }, ..._.map((ve, mt) => {
      const ze = String(ve.id) === N, Ne = Kl(String(ve.id), ze && W ? j : void 0);
      return ie("li", {}, Hn(
        { class: "al-track" + (ze ? " is-on" : ""), "aria-label": `Play ${ve.title || "#" + ve.id}`, "aria-current": ze ? "true" : void 0, disabled: ye || ce, onClick: () => {
          var Pe;
          return (Pe = $ == null ? void 0 : $.playToken) == null ? void 0 : Pe.call($, ve.id);
        } },
        ie(
          "span",
          { class: "al-th" + (Ne ? "" : " is-blank") },
          Ne ? ie("img", { src: Ne, alt: "", decoding: "async" }) : _e ? ie("img", { src: _e, alt: "", decoding: "async" }) : null,
          Ne ? null : ie("span", { class: "al-n" }, String(mt + 1)),
          ze ? ie("span", { class: "al-eq", html: en.eq }) : null
        ),
        ie("span", { class: "al-tt" }, ve.title || `#${ve.id}`, ve.explicit ? ie("span", { class: "exp", title: "Explicit lyrics: only plays when you choose it" }, "E") : null)
      ));
    }))), R;
  }
  function B(m) {
    var Ne;
    const L = m.player, _ = L.tracks.filter((Pe) => !Pe.hidden), N = t.radio(), W = w == null ? void 0 : w.nowPlaying, j = W && L.tracks.some((Pe) => String(Pe.id) === String(W.tokenId)) ? String(W.tokenId) : null, ye = j ? L.tracks.find((Pe) => String(Pe.id) === j) : null, ce = m.plays === 0 && !m.playsComing, Xe = !!m.playsComing && !m.plays, $ = !!(w != null && w.playing) && !!j, R = w == null ? void 0 : w.heart, ue = j ? (Ne = N == null ? void 0 : N.getPosition) == null ? void 0 : Ne.call(N) : null;
    j && ($ || ((ue == null ? void 0 : ue.current) ?? 0) > 0.5) && (S = L.id);
    const me = !!j && S === L.id;
    I && I !== j && (I = null);
    const _e = me ? String((W == null ? void 0 : W.cover) || "") : "", ve = !!_e && I === j, ze = [U(L, !ce, { song: ve ? "" : _e, paused: me && !$, flip: _e ? () => {
      I = I === j ? null : j, Y();
    } : void 0, flipped: ve })];
    if (ze.push(ie(
      "div",
      { class: "al-now" },
      ie(
        "div",
        { class: "al-now-t" },
        ie("div", { class: "al-song" }, ye ? ye.title || (W == null ? void 0 : W.title) || `#${ye.id}` : L.title),
        ie("div", { class: "al-artist" }, ye ? ye.artist || (W == null ? void 0 : W.artist) || L.subtitle : L.subtitle || "Press play")
      ),
      j ? Hn({ class: "al-icon" + (R != null && R.liked ? " is-on" : ""), "aria-label": R != null && R.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(R != null && R.liked)), disabled: !!(R != null && R.pending) || !!(R != null && R.locked) || Xe, onClick: () => {
        var Pe;
        return (Pe = N == null ? void 0 : N.toggleLike) == null ? void 0 : Pe.call(N);
      }, html: R != null && R.liked ? en.heartOn : en.heart }) : null
    )), ce)
      ze.push(ie(
        "div",
        { class: "al-out" },
        ie("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        ie("p", { class: "al-out-t" }, "You've played this album out"),
        ie("p", { class: "al-out-s" }, "Add plays to keep listening."),
        X(m, !0)
      ));
    else {
      const Pe = ue != null && ue.duration ? Math.min(100, ue.current / ue.duration * 100) : 0;
      ze.push(ie(
        "div",
        { class: "al-prog" },
        ie("div", { class: "al-bar" }, ie("i", { style: `width: ${Pe}%` })),
        ie("div", { class: "al-times" }, ie("span", {}, Qc((ue == null ? void 0 : ue.current) || 0)), ie("span", {}, ue != null && ue.duration ? Qc(ue.duration) : "–:––"))
      ));
    }
    return ze.push(ie(
      "div",
      { class: "al-ctl" + (ce || Xe ? " is-off" : "") },
      Hn({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: ce || Xe, onClick: () => {
        var Pe;
        return (Pe = N == null ? void 0 : N.prev) == null ? void 0 : Pe.call(N);
      }, html: en.prev }),
      Hn({ class: "al-play", "aria-label": $ ? "Pause" : "Play", disabled: ce || Xe, onClick: () => {
        var Pe;
        return (Pe = N == null ? void 0 : N.playPause) == null ? void 0 : Pe.call(N);
      }, html: $ ? en.pause : en.play }),
      Hn({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: ce || Xe, onClick: () => {
        var Pe;
        return (Pe = N == null ? void 0 : N.next) == null ? void 0 : Pe.call(N);
      }, html: en.next })
    )), m.status.length && ze.push(ie("div", { class: "al-status", role: "status" }, ...m.status)), ze.push(...T(m, { songs: _, current: j, started: me, own: _e, out: ce, waiting: Xe })), ze.push(ie("div", { class: "al-grow" })), ze.push(Hn(
      { class: "al-more", "aria-expanded": String(o === "more"), onClick: () => u(o === "more" ? "" : "more") },
      ie("span", {}, "More ", ie("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      ie("span", { html: en.down })
    )), ze;
  }
  function X(m, L) {
    const _ = ie("div", { class: "al-topups" + (L ? " al-topups--primary" : "") }), N = L ? [m.topUps[1] ?? m.topUps[0]] : [...m.topUps];
    for (const W of N) {
      const j = m.myPlays !== void 0 && m.myPlays >= W && !m.playsComing && !m.busy;
      _.append(Hn({ class: "al-topup", disabled: !j, onClick: () => t.topUp(W) }, L ? `Add ${W.toLocaleString()} plays` : `+${W.toLocaleString()}`));
    }
    return L && _.append(Hn({ class: "al-link", onClick: () => u("more") }, "Other amounts")), _;
  }
  function Q(m) {
    const L = m.myPlays !== void 0 && m.myPlays >= (m.topUps[0] ?? 0), _ = ie(
      "div",
      { class: "al-card" },
      ie("div", { class: "al-card-h" }, ie("b", {}, `Add plays to ${m.player.title}`), ie("span", { class: "al-mono" }, m.plays === null || m.plays === void 0 ? "" : `${m.plays.toLocaleString()} left`)),
      X(m, !1),
      ie("p", { class: "al-mute al-small" }, m.playsComing ? "Plays are on their way. Add more once they arrive." : m.myPlays === void 0 ? "Checking My player…" : L ? `Moved from My player · ${Ua(m.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !L && !m.playsComing && m.myPlays !== void 0 ? Hn({ class: "al-link", onClick: () => {
        u(""), t.openPlayer();
      } }, "Open My player") : null
    ), N = (j, ye, ce, Xe) => Hn(
      { class: "al-row", onClick: Xe },
      ie("span", { class: "al-row-i", html: j }),
      ie("span", { class: "al-row-t" }, ie("b", {}, ye), ie("small", {}, ce)),
      ie("span", { class: "al-row-go", html: en.right })
    ), W = ie(
      "div",
      { class: "al-how" + (i ? " is-open" : "") },
      N(en.info, "How plays work", "Every play counts for the song’s owner", () => {
        i = !i, Y();
      }),
      i ? ie("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return ie(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      ie("div", { class: "al-sheet-h" }, ie("b", {}, "More"), Hn({ class: "al-icon", "aria-label": "Close", onClick: () => u(""), html: en.close })),
      m.mode === "open" ? _ : null,
      ie(
        "div",
        { class: "al-rows" },
        N(en.grid, "My music", "Your albums and the radio", () => u("music")),
        N(en.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          u(""), t.openPlayer();
        }),
        m.canMake ? N(en.gift, "Albums (admin)", "Make an album and fund copies", () => u("gifts")) : null,
        N(en.device, "This device", "Backup, history, Stacks wallet, returns", () => u("device")),
        W
      )
    );
  }
  function oe(m) {
    var ce, Xe;
    const L = m.player, _ = w == null ? void 0 : w.nowPlaying, N = _ && L.tracks.some(($) => String($.id) === String(_.tokenId)) ? String(_.tokenId) : null, W = !!(w != null && w.playing) && !!N, j = N ? (Xe = (ce = t.radio()) == null ? void 0 : ce.getPosition) == null ? void 0 : Xe.call(ce) : null;
    N && (W || ((j == null ? void 0 : j.current) ?? 0) > 0.5) && (S = L.id);
    const ye = !!N && S === L.id;
    return T(m, {
      songs: L.tracks.filter(($) => !$.hidden),
      current: N,
      started: ye,
      own: ye ? String((_ == null ? void 0 : _.cover) || "") : "",
      out: m.plays === 0 && !m.playsComing,
      waiting: !!m.playsComing && !m.plays
    });
  }
  function Y() {
    const m = s;
    if (r) {
      if (!m || m.mode !== "open") {
        e.hidden = !0, e.replaceChildren(), delete a.dataset.albumlist;
        return;
      }
      v(), e.hidden = !1, a.dataset.albumlist = "1", e.replaceChildren(...oe(m));
      return;
    }
    if (!m) {
      e.hidden = !0, e.replaceChildren();
      return;
    }
    v(), e.hidden = !1;
    const L = ie(
      "header",
      { class: "al-top" },
      ie("a", { class: "al-brand", href: "/radio" }, Vl("al-logo"), "Xtrata ", ie("b", {}, "Music")),
      m.mode === "open" ? Hn({ class: "al-icon", "aria-label": "My music", onClick: () => u("music"), html: en.grid }) : null
    ), _ = ie("div", { class: "al-body al-body--" + m.mode }, ...m.mode === "open" ? B(m) : A(m));
    e.replaceChildren(L, _, ...o === "more" ? [ie("div", { class: "al-scrim", onClick: () => u("") }), Q(m)] : []);
  }
  return {
    render(m) {
      if (r) {
        s = m, Y();
        return;
      }
      const L = !!s;
      s = m, !m && (L || o) && (o = "", delete a.dataset.sheet), m ? a.dataset.view = "album" : delete a.dataset.view, m != null && m.asking ? a.dataset.asking = "1" : delete a.dataset.asking, Y();
    },
    sheet: () => o,
    setSheet: u
  };
}
const KL = "(?:https?:\\/\\/(?:radio\\.)?xtrata\\.xyz)?", VL = (e, t) => {
  if (typeof t != "string") return null;
  const n = t.match(new RegExp(`<(?:${e})\\b[^>]*\\bsrc=["']${KL}\\/inscription\\/(\\d{1,9})["']`, "i"));
  return n ? Number(n[1]) : null;
}, XL = (e) => VL("source|audio", e), qL = 48 * 1024 * 1024;
function YL(e) {
  const t = /^data:(audio\/[^;,]+)[^,]*?(;base64)?,(.*)$/s.exec(e);
  if (!t) throw new Error("unreadable audio");
  if (!t[2]) return e;
  const n = atob(t[3].replace(/\s+/g, "")), r = new Uint8Array(n.length);
  for (let s = 0; s < n.length; s++) r[s] = n.charCodeAt(s);
  return URL.createObjectURL(new Blob([r], { type: t[1] }));
}
function WL(e) {
  const t = e.fetch ?? ((...h) => fetch(...h));
  let n = null, r = null, s = "", o = null;
  const i = (h) => {
    n = h, e.changed();
  }, a = () => {
    var h;
    if (o == null || o.abort(), o = null, r)
      try {
        r.pause(), r.removeAttribute("src"), (h = r.load) == null || h.call(r);
      } catch {
      }
    s.startsWith("blob:") && URL.revokeObjectURL(s), s = "";
  };
  async function c(h, d, w = 0) {
    var A, T, B;
    const y = "/inscription/" + h, v = await t(y, { signal: d }), S = (v.headers.get("content-type") || "").toLowerCase();
    if (!v.ok)
      throw await ((A = v.body) == null ? void 0 : A.cancel()), new Error("not found");
    if (S.startsWith("audio/"))
      return await ((T = v.body) == null ? void 0 : T.cancel()), y;
    if (!S.includes("text/html"))
      throw await ((B = v.body) == null ? void 0 : B.cancel()), new Error("not a song");
    const I = await v.text();
    if (I.length > qL) throw new Error("too large");
    const U = I.match(/<(?:source|audio)\b[^>]*\bsrc=["'](data:audio\/[^"']+)["']/i);
    if (U) return YL(U[1].replace(/&amp;/g, "&"));
    const P = w === 0 ? XL(I) : null;
    if (P) return c(Number(P), d, 1);
    throw new Error("no audio");
  }
  async function u(h) {
    var w;
    a();
    const d = o = new AbortController();
    i({ id: h, state: "loading" });
    try {
      const y = await c(h, d.signal);
      if (d.signal.aborted) {
        y.startsWith("blob:") && URL.revokeObjectURL(y);
        return;
      }
      if (s = y, r || (r = e.audio ? e.audio() : new Audio(), r.addEventListener("ended", () => {
        (n == null ? void 0 : n.state) === "playing" && (a(), i(null));
      }), r.addEventListener("error", () => {
        if ((n == null ? void 0 : n.state) === "playing") {
          const v = n.id;
          a(), i({ id: v, state: "error" });
        }
      })), (w = e.quiet) == null || w.call(e), r.src = y, await r.play(), d.signal.aborted) return;
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
const ZL = ["Earned", "Claim", "Yours"], JL = ["Connect", "Link", "Name"], Ut = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, bn = (e, t, n, r = !1) => {
  const s = Ut("button", e, t);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, dy = (e, t, n, r = !1) => {
  const s = bn("al-album", "", n, r), o = Ut("span", "al-album__t");
  return o.append(Ut("b", "", e), Ut("span", "", t)), s.append(o), s;
}, QL = (e) => `No. ${String(e).padStart(4, "0")}`, eC = (e) => e.main ? e.linked ? 2 : 1 : 0;
function tC(e) {
  const t = document.documentElement;
  let n = !1, r = "", s = null;
  const o = (i) => {
    if (s && r === i.art) return s;
    r = i.art, s = Ut("div", "aw-art");
    const a = document.createElement("iframe");
    return a.src = i.art, a.title = `${i.tier.name} record. Drag to turn it.`, a.setAttribute("sandbox", "allow-scripts"), s.append(a), s;
  };
  return {
    showing: () => n,
    /** `otherActive`: an album or a welcome screen owns the mount right now, so this view only steps aside. */
    render(i, a = !1) {
      if (!i) {
        n && !a && (e.hidden = !0, e.replaceChildren(), delete t.dataset.view, delete t.dataset.asking), n && (delete t.dataset.award, r = "", s = null), n = !1;
        return;
      }
      n = !0, t.dataset.view = "album", t.dataset.award = i.screen, i.asking ? t.dataset.asking = "1" : delete t.dataset.asking;
      const c = Ut("header", "al-top"), u = Ut("a", "al-brand");
      u.href = "/radio", u.append(Vl("al-logo"), Ut("span", "", "Xtrata "), Ut("b", "", "Music")), c.append(u);
      const h = Ut("div", "al-welcome"), d = i.screen, w = i.tier.name, y = typeof i.name == "string" && i.name ? i.name : null;
      if (h.append(d === "have" ? Xl(JL, eC(i)) : Xl(ZL, d === "making" ? 2 : d === "yours" ? 3 : 1)), d === "making") {
        const P = Ut("div", "tier-disc tier-disc--mid");
        P.dataset.tier = i.tier.id, P.append(Ut("span", "tier-disc__mark", i.tier.mark)), h.append(P);
      } else if (d !== "have" && d !== "get") {
        const P = o(i);
        P.classList.toggle("aw-art--small", d === "name"), h.append(P);
      }
      const v = d === "ready" ? `Your ${w} record is ready` : d === "name" ? "Put your name on it?" : d === "have" ? "Use the name in your wallet" : d === "get" ? "Get a .btc name" : d === "making" ? "Making your record" : "It’s yours";
      h.append(Ut("h1", "", v));
      const S = (P, A = "") => h.append(Ut("p", A, P)), I = [];
      if (d === "ready")
        S(`You’ve paid artists for ${i.need.toLocaleString()} plays. That makes you an Xtrata Music Hero.`), I.push(bn("al-primary", `Claim my ${w} record`, () => i.go("name"), i.busy), Ut("p", "al-hint", "Free. One tap with Face ID or your fingerprint."), bn("al-link", "Later", i.later));
      else if (d === "name")
        y ? (S(`Your record will carry ${y} beside your player’s address.`), I.push(bn("al-primary", `Claim with ${y}`, () => i.claim("auto"), i.busy), bn("al-link", "Use my address only", () => i.claim("none"), i.busy))) : i.name === null ? (S("Right now it will carry your player’s address. A .btc name makes it yours at a glance."), I.push(
          dy("I have a name in Leather or Xverse", "Connect that wallet and link your player to it", () => i.go("have"), i.busy),
          dy("I want to get a name", "Where to get one, and how to put it on your player", () => i.go("get"), i.busy),
          bn("al-primary", "Claim with my address", () => i.claim("none"), i.busy)
        )) : (S("Could not check for a .btc name just now.", "ppp-warn"), I.push(bn("al-primary", "Check again", i.refresh, i.busy), bn("al-link", "Claim with my address only", () => i.claim("none"), i.busy))), I.push(Ut("p", "al-hint", "What is on the plaque cannot be changed afterwards.")), I.push(bn("al-link", "Later", i.later));
      else if (d === "have")
        i.main ? !i.linked && i.canLink ? (S(`Link this player to ${i.main}. Your plays and likes are then credited to that wallet’s name. One signature in your wallet: nothing is spent.`), I.push(bn("al-primary", "Link my player", i.link, i.busy))) : i.linked ? y ? (S(`Found it: ${y}. It goes on your plaque beside your player’s address.`), I.push(bn("al-primary", `Claim with ${y}`, () => i.claim("auto"), i.busy))) : (S(i.name === null ? `${i.main} has no primary .btc name yet. Set one in your wallet, then check again.` : "Could not check for the name just now.", i.name === null ? "" : "ppp-warn"), I.push(bn("al-primary", "Check again", i.refresh, i.busy))) : (S(`Linking is not open for ${i.main} right now. You can send a name to your player instead.`, "ppp-warn"), I.push(bn("al-primary", "Show me how", () => i.go("get"), i.busy))) : (S("Connect the Leather or Xverse wallet that holds your .btc name."), I.push(bn("al-primary", "Connect my wallet", i.connect, i.busy))), I.push(bn("al-link", "Back", () => i.go("name")));
      else if (d === "get") {
        const P = Ut("ol", "aw-steps"), A = Ut("li");
        A.append("Get a name at BNS One. You need a Stacks wallet (Leather or Xverse) with a little STX. ");
        const T = Ut("a", "", "Open BNS One ↗");
        T.href = "https://bns.one", T.target = "_blank", T.rel = "noopener", A.append(T);
        const B = Ut("li");
        B.append("Then come back and choose “I have a name in Leather or Xverse”. Or send the name to your player’s own address:", Ut("span", "ppp-addr-full", i.player), i.copyAddress());
        const X = Ut("li", "", "Check again, and your name shows on the preview before you claim.");
        P.append(A, B, X), h.append(P), I.push(bn("al-primary", "I have my name: check again", () => {
          i.refresh(), i.go("name");
        }, i.busy), bn("al-link", "Back", () => i.go("name")));
      } else if (d === "making") {
        if (S("It is being written to Xtrata with your plaque on it. About a minute: keep this page open and it carries on by itself."), i.claimLink) {
          const P = Ut("p", "al-hint"), A = Ut("a", "", "See the claim on-chain ↗");
          A.href = i.claimLink, A.target = "_blank", A.rel = "noopener", P.append(A), h.append(P);
        }
      } else if (S(`${w} record ${QL(i.number)}${i.inscription !== void 0 ? ` · Xtrata inscription #${i.inscription}` : ""}. In your player now, and yours for good.`), I.push(bn("al-primary", "See it in my player", i.done)), i.inscription !== void 0) {
        const P = Ut("a", "al-link", "Open it full screen ↗");
        P.href = `/i/${i.inscription}`, P.target = "_blank", P.rel = "noopener", I.push(P);
      }
      if (i.status.length) {
        const P = Ut("div", "al-status");
        P.setAttribute("role", "status"), P.append(...i.status), h.append(P);
      }
      i.asking ? h.append(Ut("p", "al-hint al-hint--ask", "Continue in the box below.")) : h.append(...I);
      const U = Ut("div", "al-body al-body--welcome");
      U.append(h), e.hidden = !1, e.replaceChildren(c, U);
    }
  };
}
const s1 = "xtrata.xyz/music/release", nC = "Release music on Xtrata Music; no spending permission", rC = (e) => ({
  domain: xr({ name: Et(s1), version: Et("1"), "chain-id": An(1) }),
  message: xr({ purpose: Et(nC), artist: Et(e.artist), release: Et(e.hash), issued: An(e.issued) })
}), oC = "Set the price of my release on Xtrata Music; no spending permission", sC = 100000n, iC = 1000000000n, aC = (e) => e === 0n || e >= sC && e <= iC, cC = (e) => ({
  domain: xr({ name: Et(s1), version: Et("1"), "chain-id": An(1) }),
  message: xr({ purpose: Et(oC), artist: Et(e.artist), release: Et(e.release), price: An(BigInt(e.price)), issued: An(e.issued) })
}), ji = (e) => {
  const t = BigInt(e), n = t / 1000000n, r = (t % 1000000n).toString().padStart(6, "0").replace(/0+$/, "");
  return r ? `${n}.${r}` : `${n}`;
}, lC = (e) => {
  const t = /^\s*(\d{1,6})(?:\.(\d{1,6}))?\s*$/.exec(e);
  return t ? BigInt(t[1]) * 1000000n + BigInt((t[2] ?? "").padEnd(6, "0") || "0") : null;
}, we = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, mn = (e, t, n = "") => {
  const r = we("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, el = (e) => ({ method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(e) }), fy = (e) => {
  const t = Xr(e).length;
  return `${t} ${t === 1 ? "song" : "songs"}`;
};
function tl(e, t, n = "", r = "") {
  const s = we("span", "", "ppp-rel-art" + (e ? "" : " is-blank") + (r ? " " + r : "")), o = e || n;
  if (o) {
    const i = document.createElement("img");
    i.src = o, i.alt = "", i.decoding = "async", s.append(i);
  }
  return e || s.append(we("span", t)), s;
}
const hd = (e) => !!e && Ef(e.id) && typeof e.title == "string" && Array.isArray(e.tracks) && e.tracks.length > 0 && typeof e.artist == "string";
function uC(e) {
  let t = null, n = { copies: !1, sales: !1 }, r = !1, s = "", o = "";
  const i = (() => {
    try {
      const z = new URLSearchParams(location.search).get("release");
      return Ef(z) ? z : null;
    } catch {
      return null;
    }
  })();
  let a = i ? { id: i } : null;
  const c = (z) => "xtrata.radio.releases.shelf.v1:" + z;
  let u = null, h = !1, d = -1 / 0;
  const w = (z, O, ee) => {
    const re = Array.isArray(O) ? O.filter(hd).map((le) => ({ ...le, hidden: !!le.hidden })) : [];
    u = { for: z, albums: re, fresh: ee }, ee && e.store.set(c(z), JSON.stringify(re));
  }, y = (z) => {
    try {
      w(z, JSON.parse(e.store.get(c(z)) || "[]"), !1);
    } catch {
      w(z, [], !1);
    }
  }, v = () => {
    const z = e.player().address;
    return z && (u == null ? void 0 : u.for) === z ? u.albums : [];
  };
  async function S(z, O = "") {
    const ee = e.player();
    if (!ee.address || !ee.unlocked)
      return o = "Unlock your player first.", e.changed(), !1;
    if (h) return !1;
    h = !0, o = "", e.changed();
    try {
      const re = await e.signShelf(z, O), le = await e.json("/radio/release/shelf", el(re));
      return w(ee.address, le == null ? void 0 : le.albums, !0), U(le == null ? void 0 : le.pay) ? A(ee.address, le.pay) : z === "add" && A(ee.address, null, O), !0;
    } catch (re) {
      return z !== "list" && (o = re.message || "That did not work. Try again."), !1;
    } finally {
      h = !1, e.changed();
    }
  }
  const I = (z) => "xtrata.radio.releases.orders.v1:" + z, U = (z) => !!z && /^[0-9a-f]{16}$/.test(z.order) && Ef(z.release) && typeof z.to == "string" && /^\d{1,12}$/.test(z.amount) && typeof z.memo == "string", P = (z) => {
    if (!z) return {};
    try {
      const O = JSON.parse(e.store.get(I(z)) || "{}");
      return O && typeof O == "object" ? Object.fromEntries(Object.entries(O).filter(([, ee]) => U(ee))) : {};
    } catch {
      return {};
    }
  };
  function A(z, O, ee = (O == null ? void 0 : O.release) ?? "") {
    var le;
    const re = P(z);
    O ? re[O.release] = { ...((le = re[O.release]) == null ? void 0 : le.order) === O.order ? re[O.release] : {}, ...O } : delete re[ee], e.store.set(I(z), Object.keys(re).length ? JSON.stringify(re) : null);
  }
  const T = /* @__PURE__ */ new Set(), B = /* @__PURE__ */ new Map();
  async function X(z, O, ee = !1) {
    var re;
    if (!T.has(O.order)) {
      T.add(O.order), B.set(O.order, e.now()), ee && (o = "", e.changed());
      try {
        const le = await e.json("/radio/release/paid", el({ order: O.order, ...O.txid ? { txid: O.txid } : {} }));
        (le == null ? void 0 : le.status) === "paid" ? (A(z, null, O.release), ((re = a == null ? void 0 : a.view) == null ? void 0 : re.id) === O.release && (a.view = { ...a.view, added: a.view.added + 1 }), o = "", T.delete(O.order), (u == null ? void 0 : u.for) === z && (u.fresh = !1), e.player().unlocked && await S("list")) : (U(le) && A(z, { ...O, ...le }), ee && (le == null ? void 0 : le.status) === "pending" && (o = "No payment found yet. If you have just paid, give it a minute and check again."));
      } catch (le) {
        /did not go through|does not pay this order/.test(le.message || "") && A(z, { ...O, txid: void 0, status: "pending" }), (ee || O.txid) && (o = le.message || "The payment could not be checked right now. Nothing is lost.");
      } finally {
        T.delete(O.order), e.changed();
      }
    }
  }
  async function Q(z, O, ee) {
    if (!s) {
      s = "Approve the payment in your wallet…", o = "", e.changed();
      try {
        const re = await e.pay(z, ee.to, BigInt(ee.amount), ee.memo), le = { ...ee, txid: re || void 0, status: "confirming" };
        A(O, le), s = "", X(O, le);
      } catch (re) {
        o = /cancel/i.test(re.message || "") ? "Payment cancelled. Nothing was sent." : re.message || "Not paid. Nothing was sent.";
      } finally {
        s = "", e.changed();
      }
    }
  }
  async function oe(z) {
    const O = e.player();
    if (!await S("add", z.id) || !O.address) return;
    const ee = P(O.address)[z.id], re = e.main();
    ee && re && await Q(re, O.address, ee);
  }
  function Y() {
    if (r || (r = !0, e.json("/radio/release/config").then((O) => {
      t = (O == null ? void 0 : O.enabled) === !0, n = { copies: t && (O == null ? void 0 : O.copies) === !0, sales: t && (O == null ? void 0 : O.sales) === !0 };
    }, () => {
      t = !1, r = !1;
    }).finally(e.changed)), !t) return;
    if (a && !a.view && !a.error) {
      const O = a;
      O.error = "", e.json("/radio/release/view?id=" + O.id).then(
        (ee) => {
          hd(ee) ? (O.view = ee, delete O.error) : O.error = "This release could not be read.";
        },
        (ee) => {
          O.error = ee.message || "This release could not be opened right now.";
        }
      ).finally(e.changed);
    }
    const z = e.player();
    if (z.address) {
      (u == null ? void 0 : u.for) !== z.address && y(z.address), z.unlocked && !(u != null && u.fresh) && !h && e.now() - d > 6e4 && (d = e.now(), S("list"));
      for (const O of Object.values(P(z.address)))
        if ((O.txid || O.status === "confirming") && !T.has(O.order) && e.now() - (B.get(O.order) ?? -1 / 0) > 2e4) {
          const ee = z.address;
          X(ee, O).then(() => {
            setTimeout(() => e.changed(), 20500);
          });
        }
    }
  }
  const m = () => t ? v().filter((z) => !z.hidden) : [];
  function L(z, O) {
    const ee = we("ol", "", "ppp-rel-songs");
    return z.forEach((re, le) => {
      const xt = we("li");
      xt.append(tl(e.art.song(re.id, !0) || "", String(le + 1), O), we("span", re.title)), ee.append(xt);
    }), ee;
  }
  function _() {
    if (!t || !a || a.dismissed) return [];
    if (!a.view) return a.error ? [we("p", `♫ ${a.error}`, "ppp-warn")] : [we("p", "♫ Opening this release…", "ppp-mute")];
    const z = a.view, O = we("div", "", "ppp-release-in"), ee = we("p", "", "ppp-release-in__h"), re = BigInt(/^\d{1,12}$/.test(z.price ?? "") ? z.price : "0");
    ee.append(we("b", z.title), we("span", `${z.subtitle || e.who(z.artist)} · ${fy(z)}${re > 0n ? ` · ${ji(re)} STX` : ""}`));
    const le = Xr(z), xt = e.art.cover(z.cover) || (z.cover ? "" : le[0] && e.art.song(le[0].id, !0) || ""), De = we("div", "", "ppp-rel-top");
    De.append(tl(xt, "💿", "", "is-cover"), ee), O.append(De, L(le.map((Ee) => ({ id: Ee.id, title: Ee.title || `#${Ee.id}` })), e.art.cover(z.cover))), O.append(we("p", `Released by ${e.who(z.artist)}. ${z.added === 1 ? "1 player has" : `${z.added.toLocaleString()} players have`} added it.`, "ppp-mute"));
    const Fe = e.player(), Mt = v().find((Ee) => Ee.id === z.id), je = we("div", "", "ppp-award__row");
    if (Mt)
      O.append(we("p", "In your player ✓ It stays there until you hide or remove it.", "ppp-ok")), je.append(mn("Play it", () => e.open(z), "primary"));
    else if (!Fe.address) O.append(we("p", "Make your player first (above), then add this album to it. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
    else if (!Fe.unlocked) O.append(we("p", "Unlock your player to add this album to it.", "ppp-mute"));
    else if (re > 0n) {
      const Ee = P(Fe.address)[z.id], et = e.main(), Ye = `${ji((Ee == null ? void 0 : Ee.amount) ?? re)} STX`;
      if (Ee != null && Ee.txid || (Ee == null ? void 0 : Ee.status) === "confirming") {
        O.append(we("p", "Payment sent ✓ Waiting for it to confirm (a few minutes). The album appears in your player by itself.", "ppp-ok"));
        const Ze = mn("Check now", () => void X(Fe.address, Ee, !0));
        Ze.disabled = T.has(Ee.order), je.append(Ze);
      } else if (O.append(we("p", `This album costs ${Ye}. You pay ${e.who(z.artist)} directly: Xtrata takes nothing, never holds the money and cannot refund it. Once paid it is in your player for good, and it plays with your own plays.`, "ppp-mute")), !n.sales && !Ee) O.append(we("p", "Buying is paused right now.", "ppp-warn"));
      else if (Ee) {
        if (et) {
          const Yn = mn(`Pay ${Ye} from my wallet`, () => void Q(et, Fe.address, Ee), "primary");
          Yn.disabled = !!s, je.append(Yn);
        } else
          O.append(we("p", "Connect a Stacks wallet to pay here. Or pay from any wallet, exactly like this:", "ppp-mute")), je.append(mn("Connect Stacks wallet", zh, "primary"));
        const Ze = we("div", "", "ppp-rel-pay"), zt = (Yn, hn, Nt) => {
          const Wn = we("p");
          return Wn.append(we("span", Yn), we("code", hn), gr(`order-${Nt}:${Ee.order}`, "Copy", () => hn, "tiny", e.changed)), Wn;
        };
        Ze.append(zt("Send", ji(Ee.amount) + " STX", "amount"), zt("To", Ee.to, "to"), zt("Memo", Ee.memo, "memo")), O.append(Ze, we("p", "The memo is what ties the payment to your player. Without it the album cannot be added.", "ppp-mute"));
        const un = mn("I have paid: check", () => void X(Fe.address, Ee, !0));
        un.disabled = T.has(Ee.order), je.append(un);
      } else {
        const Ze = mn(`Buy · ${Ye}`, () => void oe(z), "primary");
        Ze.disabled = h || !!s, je.append(Ze);
      }
    } else {
      O.append(we("p", "Add it and it stays in your player. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
      const Ee = mn("Add to my player", () => {
        S("add", z.id).then((et) => {
          et && (a != null && a.view) && (a.view = { ...a.view, added: a.view.added + 1 });
        });
      }, "primary");
      Ee.disabled = h, je.append(Ee);
    }
    return je.append(mn("Not now", () => {
      a && (a.dismissed = !0), e.changed();
    }, "quiet")), O.append(je), s && O.append(we("p", s, "ppp-cyan")), o && O.append(we("p", o, "ppp-warn")), [O];
  }
  let N = !1;
  function W() {
    const z = t ? v() : [];
    if (!z.length) return null;
    const O = we("details", "", "ppp-release-manage");
    O.open = N, O.ontoggle = () => {
      N = O.open;
    };
    const ee = z.filter((le) => le.hidden).length;
    O.append(we("summary", `Albums I added (${z.length}${ee ? `, ${ee} hidden` : ""})`));
    const re = e.player().unlocked;
    re || O.append(we("p", "Unlock your player to hide or remove an album.", "ppp-mute"));
    for (const le of z) {
      const xt = we("div", "", "ppp-release-row" + (le.hidden ? " is-hidden" : "")), De = we("span", "", "ppp-release-row__t");
      De.append(we("b", le.title), we("span", `${le.subtitle || e.who(le.artist)}${le.hidden ? " · hidden" : ""}`));
      const Fe = mn(le.hidden ? "Show" : "Hide", () => void S(le.hidden ? "show" : "hide", le.id), "tiny"), Mt = mn("Remove", () => void S("remove", le.id), "tiny");
      Fe.disabled = Mt.disabled = !re || h, xt.append(De, Fe, Mt), O.append(xt);
    }
    return O.append(we("p", "Hide keeps an album but out of sight. Remove takes it off your player; you can add it again from its link.", "ppp-mute")), o && !a && O.append(we("p", o, "ppp-warn")), O;
  }
  let j = null, ye = [], ce = null;
  const Xe = we("input");
  Xe.maxLength = 60, Xe.placeholder = "Title of the single, EP or album", Xe.setAttribute("aria-label", "Release title");
  const $ = we("input");
  $.maxLength = 80, $.placeholder = "Artist name shown under the title", $.setAttribute("aria-label", "Artist name");
  const R = we("input");
  R.inputMode = "numeric", R.placeholder = "Cover: an inscription number (optional; the first song’s artwork if left empty)", R.setAttribute("aria-label", "Cover inscription number");
  const ue = we("input");
  ue.inputMode = "decimal", ue.placeholder = "Price in STX, e.g. 2 (0 makes it free)", ue.setAttribute("aria-label", "Price in STX");
  let me = null;
  const _e = (z, O, ee = "") => {
    me = (me == null ? void 0 : me.id) === z && me.what === O ? null : { id: z, what: O }, (me == null ? void 0 : me.what) === "price" && (ue.value = ee), o = "", e.changed();
  };
  async function ve(z, O) {
    if (s) return;
    const ee = lC(ue.value);
    if (ee === null || !aC(ee)) {
      o = "A price is 0 (free), or 0.1 to 1,000 STX.", e.changed();
      return;
    }
    s = "Sign in your wallet (nothing is spent)…", o = "", e.changed();
    try {
      const re = { artist: z, release: O.id, price: ee.toString(), issued: e.now() }, le = await e.sign(z, cC(re));
      s = "Saving the price…", e.changed(), await e.json("/radio/release/price", el({ request: re, signature: le })), o = ee > 0n ? `Price set ✓ “${O.title}” now costs ${ji(ee)} STX, paid straight to this wallet.` : `“${O.title}” is free again ✓`, me = null, Ne(z, !0);
    } catch (re) {
      o = re.message || "The price was not changed.";
    } finally {
      s = "", e.changed();
    }
  }
  const mt = (z) => `${location.origin}${location.pathname}?release=${z}`;
  function ze(z) {
    j = { for: z, loading: !0 }, ye = [], e.changed(), e.json("/radio/release/songs?wallet=" + encodeURIComponent(z)).then(
      (O) => {
        const ee = Array.isArray(O == null ? void 0 : O.songs) ? O.songs.filter((re) => Number.isSafeInteger(re == null ? void 0 : re.id) && typeof re.title == "string") : null;
        j = ee ? { for: z, songs: ee, more: !!O.more } : { for: z, error: "Your songs could not be read right now." };
      },
      (O) => {
        j = { for: z, error: O.message || "Your songs could not be read right now." };
      }
    ).finally(e.changed);
  }
  function Ne(z, O = !1) {
    !O && (ce == null ? void 0 : ce.for) === z && e.now() - ce.at < 6e4 || (ce = { for: z, list: (ce == null ? void 0 : ce.for) === z ? ce.list : [], at: e.now() }, e.json("/radio/release/by?artist=" + encodeURIComponent(z)).then((ee) => {
      Array.isArray(ee == null ? void 0 : ee.releases) && (ce = { for: z, list: ee.releases.filter(hd), at: e.now() });
    }, () => {
    }).finally(e.changed));
  }
  async function Pe(z) {
    if (!s) {
      s = "Checking your release…", o = "", e.changed();
      try {
        const O = R.value.trim().replace(/^#/, ""), ee = e1({ title: Xe.value.trim(), subtitle: $.value.trim(), tracks: [...ye], cover: O ? Number(O) : null });
        s = "Sign in your wallet (nothing is spent)…", e.changed();
        const re = { artist: z, hash: t1(ee), issued: e.now() }, le = await e.sign(z, rC(re));
        s = "Releasing…", e.changed();
        const xt = await e.json("/radio/release/create", el({ definition: ee, request: re, signature: le }));
        o = `${xt.existing ? "Already released" : "Released"} ✓ “${xt.title}”. Its link is below.`, ye = [], Xe.value = "", R.value = "", e.audition.stop(), Ne(z, !0);
      } catch (O) {
        o = O.message || "Not released.";
      } finally {
        s = "", e.changed();
      }
    }
  }
  const _n = () => {
    queueMicrotask(() => e.audition.stop());
  }, En = /* @__PURE__ */ new Set();
  function gt(z) {
    const O = ye.map((Ze) => z.find((zt) => zt.id === Ze)).filter((Ze) => !!Ze), ee = R.value.trim().replace(/^#/, ""), re = /^\d{1,9}$/.test(ee) ? Number(ee) : null, le = e.art.cover(re), xt = O[0] ? e.art.song(O[0].id, !0) : null, De = we("div", "", "ppp-release-preview");
    De.append(we("p", "How it will look", "ppp-featured__h"));
    const Fe = we("p", "", "ppp-release-in__h"), Mt = we("b", Xe.value.trim() || "Untitled"), je = we("span", `${$.value.trim() || e.who(e.main())} · ${O.length} ${O.length === 1 ? "song" : "songs"}`);
    Fe.append(Mt, je);
    const Ee = we("div", "", "ppp-rel-top");
    Ee.append(tl(re ? le : xt || "", "💿", "", "is-cover"), Fe), De.append(Ee, L(O.map((Ze) => ({ id: Ze.id, title: Ze.title })), le));
    const et = O.filter((Ze) => e.art.song(Ze.id, !0) === null).length, Ye = [];
    re && !le && Ye.push(`Looking for an image in #${re}… If none appears, that inscription is not a picture.`), et && Ye.push(`Finding artwork for ${et} ${et === 1 ? "song" : "songs"}…`), !et && O.some((Ze) => e.art.song(Ze.id, !1) === "") && Ye.push(`A numbered square is a song with no artwork of its own${le ? ": it shows the cover, dimmed" : ""}.`);
    for (const Ze of Ye) De.append(we("p", Ze, "ppp-mute"));
    return Xe.oninput = () => {
      Mt.textContent = Xe.value.trim() || "Untitled";
    }, $.oninput = () => {
      je.textContent = `${$.value.trim() || e.who(e.main())} · ${O.length} ${O.length === 1 ? "song" : "songs"}`;
    }, R.onchange = () => e.changed(), De;
  }
  function Ct() {
    var ee;
    const z = e.main();
    if (!t || !z)
      return j && (j = null, ye = [], _n()), null;
    const O = [we("p", "Put your own songs out as a single, an EP or an album. Listeners add it to their player, and every play pays you. Nothing to pay, and no money passes through Xtrata.", "ppp-mute")];
    if (j && j.for !== z && (j = null, ye = [], En.clear(), _n()), !j) O.push(mn("Show the songs in my wallet", () => ze(z), "primary"));
    else if (j.loading) O.push(we("p", "Reading your wallet…", "ppp-cyan"));
    else if (j.error) O.push(we("p", j.error, "ppp-warn"), mn("Try again", () => ze(z)));
    else if (!j.songs.length) O.push(we("p", "No songs found in this wallet. A release is made by the wallet that holds its song masters.", "ppp-mute"));
    else {
      O.push(we("p", "Tap your songs in the order they should play. Tap one again to take it out.", "ppp-cyan"));
      const re = we("div", "", "ppp-release-songs");
      for (const De of j.songs) {
        const Fe = ye.indexOf(De.id), Mt = we("div", "", "ppp-release-song" + (Fe >= 0 ? " is-on" : "")), je = e.audition.state(De.id);
        je !== "idle" && En.add(De.id);
        const Ee = mn(je === "playing" ? "❚❚" : je === "loading" ? "…" : "▶", () => e.audition.toggle(De.id), "ppp-release-hear" + (je === "playing" ? " is-on" : ""));
        Ee.setAttribute("aria-label", je === "playing" ? `Stop ${De.title}` : `Listen to ${De.title}`), Ee.title = je === "error" ? "This song could not be played just now" : je === "playing" ? "Stop" : "Listen (free: it is your own song)";
        const et = e.art.song(De.id, Fe >= 0 || En.has(De.id)), Ye = mn("", () => {
          ye = Fe >= 0 ? ye.filter((Ze) => Ze !== De.id) : [...ye, De.id], e.changed();
        }, "ppp-release-pick");
        Ye.setAttribute("aria-pressed", String(Fe >= 0)), Ye.append(we("i", Fe >= 0 ? String(Fe + 1) : "+"), we("b", De.title), we("span", je === "error" ? "could not play" : `${De.artist ? De.artist + " · " : ""}#${De.id}`, je === "error" ? "ppp-warn" : "")), Mt.append(Ee, tl(et || "", et === "" ? "♪" : "", ""), Ye), re.append(Mt);
      }
      O.push(re), j.more && O.push(we("p", "This wallet holds a lot: only the first few hundred inscriptions were looked through.", "ppp-mute")), !$.value && ye.length && ($.value = ((ee = j.songs.find((De) => De.id === ye[0])) == null ? void 0 : ee.artist) || "");
      const le = ye.length === 0 ? "release" : ye.length === 1 ? "single" : ye.length <= 6 ? "EP" : "album", xt = mn(ye.length ? `Sign and release this ${le} · ${ye.length} ${ye.length === 1 ? "song" : "songs"}` : "Pick at least one song", () => void Pe(z), "primary");
      xt.disabled = !ye.length || !!s, O.push(Xe, $, R), ye.length && O.push(gt(j.songs)), O.push(xt);
    }
    if (s && O.push(we("p", s, "ppp-cyan")), o && !a && O.push(we("p", o, /✓/.test(o) ? "ppp-ok" : "ppp-warn")), Ne(z), (ce == null ? void 0 : ce.for) === z && ce.list.length) {
      O.push(we("p", "Your releases", "ppp-featured__h"));
      for (const re of ce.list) {
        const le = we("div", "", "ppp-release-row"), xt = we("span", "", "ppp-release-row__t"), De = BigInt(/^\d{1,12}$/.test(re.price ?? "") ? re.price : "0"), Fe = De > 0n ? ` · ${ji(De)} STX · ${(re.sold ?? 0).toLocaleString()} sold` : n.sales ? " · free" : "";
        if (xt.append(we("b", re.title), we("span", `${fy(re)} · added by ${re.added.toLocaleString()} ${re.added === 1 ? "player" : "players"}${Fe}`)), le.append(xt, gr("release-link:" + re.id, "Copy link", () => mt(re.id), "tiny", e.changed)), n.sales) {
          const je = mn("Price", () => _e(re.id, "price", De > 0n ? ji(De) : ""), "tiny");
          je.setAttribute("aria-expanded", String((me == null ? void 0 : me.id) === re.id && me.what === "price")), le.append(je);
        }
        if (n.copies && e.copies) {
          const je = mn("Send copies", () => _e(re.id, "copies"), "tiny");
          je.setAttribute("aria-expanded", String((me == null ? void 0 : me.id) === re.id && me.what === "copies")), le.append(je);
        }
        if (O.push(le), (me == null ? void 0 : me.id) !== re.id) continue;
        const Mt = we("div", "", "ppp-release-way");
        if (me.what === "price" && n.sales) {
          const je = mn("Sign this price", () => void ve(z, re), "primary");
          je.disabled = !!s, Mt.append(
            we("p", "Put a price on this release. Each listener then pays you that price once to add it, straight to this wallet. Xtrata takes nothing, never holds the money and cannot refund a sale: a refund is between you and the buyer. Players that already have it keep it.", "ppp-mute"),
            ue,
            je
          );
        } else me.what === "copies" && n.copies && e.copies && Mt.append(...e.copies(z, { id: re.id, title: re.title }));
        Mt.childNodes.length && O.push(Mt);
      }
    }
    return O;
  }
  return { sync: Y, albums: m, banner: _, manage: W, fold: Ct, wantsArt: () => t === !0 && (!!(a != null && a.view) && !a.dismissed || !!(j != null && j.songs) && !!e.main()), enabled: () => t === !0 };
}
const pd = "xtrata.radio.replace.v1", Mn = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, Bo = (e, t, n = "") => {
  const r = Mn("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, hy = (e) => (Number(e) / 1e6).toLocaleString("en-GB", { maximumFractionDigits: 6 });
function dC(e) {
  let n = (() => {
    try {
      const v = JSON.parse(e.store.get(pd) || "null");
      return v && typeof v.old == "string" ? v : null;
    } catch {
      return null;
    }
  })();
  const r = (v) => {
    n = v, e.store.set(pd, v ? JSON.stringify(v) : null), e.changed();
  };
  let s = null, o = !1, i = "", a = !1;
  function c(v) {
    o || (s == null ? void 0 : s.for) === v && (s.n !== null || Date.now() - s.at < 3e4) || (o = !0, e.json("/radio/gift/shelf?root=" + encodeURIComponent(v) + "&limit=1").then(
      (S) => {
        s = { for: v, n: Number.isSafeInteger(S == null ? void 0 : S.total) ? S.total : null, at: Date.now() };
      },
      () => {
        s = { for: v, n: null, at: Date.now() };
      }
    ).finally(() => {
      o = !1, e.changed();
    }));
  }
  const u = () => !!n, h = () => !!(n != null && n.removed);
  function d(v) {
    v.listening && (i = "", r({ old: v.listening }));
  }
  const w = () => {
    i = "", r(null);
  };
  function y(v) {
    var B;
    if (!n) return null;
    n.removed && v.listening === n.old && (n = { old: n.old }, e.store.set(pd, JSON.stringify(n)));
    const S = [], I = (X, Q) => S.push(Mn("p", `Replacing your old player · step ${X} of 3 · ${Q}`, "ppp-cyan")), U = () => Bo("Stop · keep my old player", w, "quiet");
    if (v.listening && v.listening !== n.old) {
      if (!n.removed)
        return w(), null;
      S.push(Mn("p", "Your new player is ready ✓ Your old one is empty and no longer on this device.", "ppp-ok")), v.phrase && !v.backedUp ? S.push(Mn("p", "First, write down your new player’s 24 backup words. They are the only way back in if this passkey is ever lost."), Bo("Back up my player · 24 words", e.backup, "primary")) : v.backedUp && S.push(Mn("p", "Its 24 backup words are written down ✓", "ppp-ok"));
      const X = v.passkeyName ? `the one called “${v.passkeyName}”` : "the newest one";
      return S.push(Mn("p", `Your phone still has the old player’s passkey. You can delete it in your phone’s saved passwords (search for “xtrata”) if you like: keep ${X}, which is this new player. Deleting a passkey cannot be undone, so do it only after the backup words are written down, and only if you are sure which is which. Leaving it there does no harm.`, "ppp-mute")), S.push(Bo("Done", w, "quiet")), S;
    }
    if (!v.listening || n.removed)
      return n.removed ? (I(3, "claim your new player"), S.push(Mn("p", "Old player removed from this device ✓ Now claim your free player: it is made with a new passkey and comes with 24 backup words.", "ppp-ok")), S.push(Bo("Hide this", w, "quiet")), S) : null;
    if (c(n.old), v.step === "locked" || v.step === "intro")
      return I(1, "empty it"), S.push(Mn("p", "Unlock your old player so it can be emptied."), Bo("Unlock my old player", e.unlock, "primary"), U()), S;
    const P = e.keepBoth(v), A = (X) => (I(1, "empty it"), S.push(Mn("p", X, "ppp-warn")), P && S.push(Bo("Keep both players instead", () => {
      w(), P();
    }, "primary")), S.push(U()), S);
    if (v.slot !== 0) return A("An album is open. Go back to your own player first.");
    if ((s == null ? void 0 : s.for) !== n.old)
      return I(1, "empty it"), S.push(Mn("p", "Checking what this player has…", "ppp-mute"), U()), S;
    if (s.n === null) return A("Could not check whether this player has albums of its own, so it will not be removed. Try again shortly.");
    if (s.n > 0) return A(`This player has ${s.n === 1 ? "an album" : `${s.n} albums`} of its own. Replacing it would leave ${s.n === 1 ? "it" : "them"} behind, so it stays.`);
    if (((B = v.award) == null ? void 0 : B.state) === "claimed" && v.award.holds !== !1) return A("This player holds a Music Hero record. Send the record to another address first, or keep both players.");
    if (v.depositPending || v.entries.some((X) => ["prepared", "signed", "unknown", "pending"].includes(String(X.status))))
      return I(1, "empty it"), S.push(Mn("p", "Something is still on its way in or out of this player. This carries on by itself once it has settled.", "ppp-mute"), U()), S;
    if (v.balance === void 0)
      return I(1, "empty it"), S.push(Mn("p", "Checking what it holds…", "ppp-mute"), U()), S;
    if (v.balance > e.dust(v))
      return I(1, "empty it"), S.push(Mn("p", `It holds ${hy(v.balance)} STX. Send it back${v.returnTo ? ` to ${e.who(v.returnTo)}` : ""} first: nothing may be left in a player you are about to remove.`)), v.returnTo || v.gift ? S.push(Bo("Send everything back", e.returnAll, "primary")) : S.push(Mn("p", "There is nowhere set to send it. Connect a Stacks wallet and link it to this player, then come back here.", "ppp-warn"), Bo("Connect Stacks wallet", zh, "primary")), S.push(U()), S;
    I(2, "remove it from this device"), S.push(Mn("p", v.balance > 0n ? `Empty ✓ (the ${hy(v.balance)} STX left is less than the network fee to move it).` : "Empty ✓", "ppp-ok")), S.push(Mn("p", "What stays behind with the old player: its likes, its play history and any progress toward a Music Hero award. Your new player starts fresh.", "ppp-mute"));
    const T = Bo(a ? "Check the box below…" : "Remove my old player", () => {
      a || (a = !0, i = "", e.changed(), e.forget().then(() => {
        r({ old: n.old, removed: !0 });
      }, (X) => {
        i = /cancel/i.test((X == null ? void 0 : X.message) || "") ? "" : (X == null ? void 0 : X.message) || "It was not removed.";
      }).finally(() => {
        a = !1, e.changed();
      }));
    }, "primary");
    return T.disabled = a || !!v.busy, S.push(T, U()), i && S.push(Mn("p", i, "ppp-warn")), S;
  }
  return { active: u, claiming: h, start: d, stop: w, lines: y };
}
const fC = (e) => {
  if (e.step === "off" || e.step === "elsewhere" || e.step === "not-invited" || e.step === "unsupported") return;
  const t = e.root ?? e.listening;
  return t && /^S[PM][0-9A-Z]{20,60}$/.test(t) ? t : void 0;
}, hC = (e) => e.length > 12 ? `${e.slice(0, 6)}…${e.slice(-4)}` : e, pC = (e, t = 16) => {
  const n = [...e];
  if (n.length <= t) return e;
  const r = Math.min(7, Math.max(4, Math.floor((t - 1) / 2)));
  return n.slice(0, t - 1 - r).join("") + "…" + n.slice(-r).join("");
}, gC = [
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
function yC(e) {
  for (const [t, n] of gC) if (n.test(e)) return t;
  return null;
}
const i1 = (e) => /iP(hone|ad|od)/.test(e) || /Macintosh/.test(e) && /Mobile\//.test(e), a1 = (e) => /Android/.test(e);
function wC(e, t) {
  const n = new URL(e);
  return n.protocol !== "https:" ? null : i1(t) ? "x-safari-" + n.href : a1(t) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const mC = (e) => i1(e) ? "Safari" : a1(e) ? "Chrome" : "your browser", Ri = "Xtrata Music player", bC = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function py(e, t = (n) => n) {
  var o, i, a;
  if (e.mainConnected ?? !!e.main) return [];
  if (e.step === "off" || e.step === "elsewhere") return [];
  if (e.gate && (e.gate.enabled === !1 || e.gate.here === !1)) return [];
  if (e.step === "unsupported")
    return ((o = e.gate) == null ? void 0 : o.passkeyOnly) || e.linked || ((i = e.others) == null ? void 0 : i.length) ? [{ action: null, label: Ri, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], s = [...new Set([e.standIn, e.linked, ...e.others ?? []].filter((c) => !!c))];
  for (const c of s) {
    const u = e.standIn === c && bC.has(e.step);
    r.push({
      action: "linked",
      main: c,
      label: `${Ri} · ${t(c)}`,
      detail: u ? "Open on this device." : `Face ID or your fingerprint. Plays and likes count for ${t(c)}.`
    });
  }
  if ((a = e.gate) != null && a.passkeyOnly && e.solo)
    switch (e.step) {
      case "intro":
        r.push({ action: "create", label: Ri, detail: "Make one with Face ID or your fingerprint. Nothing to install." });
        break;
      case "locked":
        r.push({ action: "unlock", label: Ri, detail: "Open the one on this device with Face ID or your fingerprint." });
        break;
      case "loading":
        r.push({ action: "show", label: Ri, detail: "Face ID or your fingerprint. Nothing to install." });
        break;
      case "connect":
      case "not-invited":
        break;
      default:
        r.push({ action: "show", label: Ri, detail: "Open on this device." });
    }
  return r;
}
const gd = "xtrata.radio.novice", c1 = "xtrata.radio.novice.previewed.v1", gy = 6 * 6e4;
function xC(e, t) {
  let n = null;
  try {
    const r = new URLSearchParams(e).get("novice");
    if (r === "1" || r === "preview")
      t.set(gd, r), n = r;
    else {
      if (r === "0")
        return t.set(gd, null), { on: !1, preview: !1 };
      n = t.get(gd);
    }
  } catch {
    n = null;
  }
  return { on: n === "1" || n === "preview", preview: n === "preview" };
}
const SC = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i, yy = (e) => SC.test(e ?? ""), vC = {
  "Start listening · no wallet needed": "Start listening",
  "Claim my gift · no wallet needed": "Open my gift",
  "I already have a listening wallet": "I’ve listened here before",
  "Use a different listening wallet": "Use a different passkey"
}, AC = {
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
}, EC = (e, t) => AC[e] ?? t;
function kC(e, t) {
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
const $C = "Make your player once, with Face ID or your fingerprint, and the music starts.", IC = "Checking your player…", If = () => ({ album: null, phase: "idle", track: null, since: 0, heard: 0 });
function l1(e) {
  try {
    const t = JSON.parse(e.get(c1) || "[]");
    return Array.isArray(t) ? t.filter((n) => typeof n == "string").slice(-50) : [];
  } catch {
    return [];
  }
}
function LC(e, t) {
  const n = l1(e).filter((r) => r !== t);
  n.push(t), e.set(c1, JSON.stringify(n.slice(-50)));
}
function yd(e, t) {
  switch (t.kind) {
    case "offer":
      return e.album === t.album && e.phase !== "idle" ? e : { ...If(), album: t.album, phase: t.already ? "done" : "open" };
    case "withdraw":
      return e.phase === "idle" ? e : If();
    case "now":
      return e.phase === "open" && t.playing && t.track ? { ...e, phase: "playing", track: t.track, since: t.at } : e.phase === "playing" && t.track && t.track !== e.track ? { ...e, phase: "done" } : e.phase === "playing" && t.at - e.since > gy ? { ...e, phase: "done" } : e;
    case "listened":
      return e.phase !== "playing" ? e : e.heard >= 1 ? { ...e, phase: "done" } : { ...e, heard: e.heard + 1 };
    case "tick":
      return e.phase === "playing" && t.at - e.since > gy ? { ...e, phase: "done" } : e;
  }
}
const nl = (e) => e.phase === "open" || e.phase === "playing";
function CC(e = {}) {
  return [
    { id: "stx", label: "STX", blurb: "Send STX straight to your player.", unit: "microSTX", settles: "direct", on: !0 },
    { id: "card", label: "Card", blurb: "Pay by card or Apple Pay.", unit: "pence", settles: "converted", on: e.card === !0 },
    { id: "sbtc", label: "Bitcoin", blurb: "Pay with sBTC.", unit: "sats", settles: "converted", on: e.sbtc === !0 }
  ];
}
const TC = [100, 250, 500, 1e3], BC = (e, t = Wr) => BigInt(e) * jn(t);
function MC(e, t = Wr, n = 0n) {
  const r = Po - e - n;
  return r > 0n ? Number(r / jn(t)) : 0;
}
function NC(e, t = Wr, n = 0n) {
  const r = e === void 0 ? 0 : MC(e, t, n);
  return TC.map((s) => ({ plays: s, stx: BC(s, t), fits: e !== void 0 && s <= r }));
}
const _C = {
  microSTX: (e) => `${e / 1000000n}.${(e % 1000000n).toString().padStart(6, "0").replace(/0+$/, "").padEnd(2, "0")} STX`,
  sats: (e) => `${e.toLocaleString("en-GB")} sats`,
  pence: (e) => `£${e / 100n}.${(e % 100n).toString().padStart(2, "0")}`
}, PC = (e) => _C[e.unit](e.amount), Yt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, hl = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`;
function UC(e) {
  if (!e || e.plays < 1) return "";
  const t = [`paid for ${hl(e.plays, "play", "plays")}${e.artists > 0 ? ` to ${hl(e.artists, "artist", "artists")}` : ""}`];
  return e.likes > 0 && t.push(`saved ${hl(e.likes, "like", "likes")}`), `So far your player has ${t.join(" and ")}, all on the public record.`;
}
function OC(e) {
  let t = null, n = 0, r = "stx";
  const s = (i) => {
    var c;
    if (i.some((u) => u.plays === n && u.fits)) return;
    const a = i.filter((u) => u.fits);
    n = ((c = a.find((u) => {
      var h;
      return u.plays === ((h = i[1]) == null ? void 0 : h.plays);
    }) ?? a.at(-1)) == null ? void 0 : c.plays) ?? 0;
  };
  function o() {
    var y;
    if (!t) return;
    const i = e.input();
    if (!i) {
      t.close();
      return;
    }
    const a = NC(i.balance, i.fee, i.incoming);
    s(a);
    const c = CC(i.switches);
    (y = c.find((v) => v.id === r)) != null && y.on || (r = "stx");
    const u = [], h = Yt("h2", "ppp-connect__title", "Add plays");
    h.id = "ppp-restock-title", u.push(h), u.push(Yt("p", "ppp-restock__left", i.playsLeft === null ? "Checking your player…" : i.playsLeft === 0 ? "Your player is out of plays." : `Your player has ${hl(i.playsLeft, "play", "plays")} left.`));
    const d = UC(i.done);
    if (d && u.push(Yt("p", "ppp-restock__done", d)), i.arriving)
      u.push(Yt("p", "ppp-restock__wait", "Plays are already on their way to your player. They start by themselves when they land, so there is nothing to add right now."));
    else if (i.balance === void 0)
      u.push(Yt("p", "ppp-restock__wait", "Your player’s balance is unavailable right now, so nothing can be worked out. Try again in a moment."));
    else if (!a.some((v) => v.fits))
      u.push(Yt("p", "ppp-restock__wait", "Your player is full: it holds as many plays as one player can. Come back when you have used some."));
    else {
      const v = Yt("div", "ppp-restock__packs");
      v.setAttribute("role", "group"), v.setAttribute("aria-label", "How many plays");
      for (const U of a) {
        const P = Yt("button", "ppp-restock__pack" + (U.plays === n ? " is-on" : ""));
        P.type = "button", P.disabled = !U.fits, P.setAttribute("aria-pressed", String(U.plays === n)), P.append(Yt("b", "", U.plays.toLocaleString()), Yt("span", "", "plays")), P.onclick = () => {
          n = U.plays, o();
        }, v.append(P);
      }
      u.push(v);
      const S = Yt("div", "ppp-restock__ways");
      S.setAttribute("role", "group"), S.setAttribute("aria-label", "How to pay");
      for (const U of c) {
        const P = Yt("button", "ppp-restock__way" + (U.id === r ? " is-on" : ""));
        P.type = "button", P.disabled = !U.on, P.setAttribute("aria-pressed", String(U.id === r)), P.append(Yt("b", "", U.label), Yt("span", "", U.on ? U.blurb : "Soon")), P.onclick = () => {
          r = U.id, o();
        }, S.append(P);
      }
      u.push(S);
      const I = a.find((U) => U.plays === n);
      if (I && r === "stx") {
        const U = Yt("div", "ppp-restock__pay"), P = PC({ unit: "microSTX", amount: I.stx }), A = Yt("p", "ppp-restock__amount");
        A.append("Send ", Yt("b", "", P), " to your player:"), U.append(A, Yt("p", "ppp-addr-full ppp-restock__addr", i.address));
        const T = Yt("div", "ppp-restock__row");
        T.append(e.copyButton("restock-address", "Copy address", () => i.address, "primary"), e.copyButton("restock-amount", "Copy amount", () => jr(I.stx), "")), U.append(T), U.append(Yt("p", "ppp-restock__note", `From any Stacks wallet or an exchange, on the Stacks network. A different amount is fine: ${i.backedUp ? "your player is backed up, though larger amounts are safer in your main wallet" : "your player holds up to 1 STX"}. The plays appear here by themselves, usually within a few minutes, so you can close this.`)), u.push(U);
      }
    }
    u.push(Yt("p", "ppp-restock__why", "Every play pays whoever owns the song, directly. Nobody sits in between, and anyone can check it."));
    const w = Yt("button", "quiet ppp-connect__cancel", "Close");
    w.type = "button", w.onclick = () => t == null ? void 0 : t.close(), u.push(w), t.replaceChildren(...u);
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
      }), document.body.appendChild(i), o(), typeof i.showModal == "function" ? i.showModal() : i.setAttribute("open", "");
    },
    /** The page redrew (a balance changed, plays landed): keep the sheet in step. */
    refresh: o,
    close() {
      t == null || t.close();
    }
  };
}
const Rr = (e) => e.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(), HC = (e) => !e || /^(?:Inscription )?#\d+$/.test(e.trim());
function DC(e, t) {
  const n = /* @__PURE__ */ new Set(), r = [];
  for (const s of Array.isArray(e) ? e : []) {
    const o = Number(s == null ? void 0 : s.id);
    if (!Number.isSafeInteger(o) || o < 0 || n.has(o)) continue;
    n.add(o);
    const i = t(o, { title: typeof s.title == "string" ? s.title : void 0, artist: typeof s.artist == "string" ? s.artist : void 0 });
    r.push({ id: o, title: HC(i.title) ? `#${o}` : i.title.trim(), artist: (i.artist || "").trim() });
  }
  return r.sort((s, o) => s.id - o.id);
}
function FC(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    if (!n.artist) continue;
    const r = Rr(n.artist), s = t.get(r);
    s ? s.songs++ : t.set(r, { name: n.artist, songs: 1 });
  }
  return [...t.values()].sort((n, r) => r.songs - n.songs || n.name.localeCompare(r.name));
}
function jC(e, t, n = "", r = 60) {
  const s = Rr(t).split(/\s+/).filter(Boolean), o = Rr(n);
  if (!s.length && !o) return { songs: [], total: 0 };
  const i = [];
  for (const a of e) {
    const c = Rr(a.artist), u = Rr(a.title), h = String(a.id);
    if (o && c !== o) continue;
    let d = 0, w = !0;
    for (const y of s) {
      const v = y.replace(/^#/, "");
      if (u.includes(y)) d += u.startsWith(y) ? 0 : 1;
      else if (/^\d+$/.test(v) && h === v) d += 0;
      else if (c.includes(y)) d += 2;
      else if (/^\d+$/.test(v) && h.startsWith(v)) d += 3;
      else {
        w = !1;
        break;
      }
    }
    w && i.push({ s: a, rank: d });
  }
  return i.sort((a, c) => a.rank - c.rank || a.s.id - c.s.id), { songs: i.slice(0, r).map((a) => a.s), total: i.length };
}
const ur = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, wy = 12, RC = 14, my = (e) => [...e.trim()].length <= RC;
function zC(e, t) {
  let n = null, r = "idle", s = "", o = "", i = !1;
  const a = ur("input", "find-q");
  a.type = "search", a.placeholder = "Search songs, artists or #", a.setAttribute("aria-label", "Search all music"), a.autocomplete = "off";
  const c = ur("div", "hint"), u = ur("div", "find-artists" + (t.grid ? " find-artists--grid" : "")), h = ur("ol", "likesList find-list");
  c.setAttribute("role", "status");
  const d = ur("div", "likesTools");
  d.append(a), t.artistsMount ? (e.replaceChildren(d, c, h), t.artistsMount.replaceChildren(u)) : e.replaceChildren(d, c, u, h), a.oninput = () => {
    s = a.value, y();
  };
  function w() {
    r === "loading" || r === "ready" || (r = "loading", y(), t.load().then((v) => {
      n = v, r = "ready", y();
    }, () => {
      r = "failed", y();
    }));
  }
  function y() {
    const v = t.locked();
    if (a.disabled = v, v) {
      if (c.textContent = "An album is open and plays only its own songs. Go back to My player to find other music.", t.leaveAlbum) {
        const T = ur("button", "find-back", "Back to My player");
        T.type = "button", T.onclick = () => t.leaveAlbum(), c.append(" ", T);
      }
      u.replaceChildren(), h.replaceChildren();
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
      const T = ur("button", "", "Try again");
      T.type = "button", T.onclick = () => {
        r = "idle", w();
      }, c.append(T), u.replaceChildren(), h.replaceChildren();
      return;
    }
    const S = FC(n), I = (T, B, X, Q = "", oe = "") => {
      const Y = ur("button", "find-chip" + (oe ? " " + oe : "") + (B ? " is-on" : ""), T);
      return Y.type = "button", Y.setAttribute("aria-pressed", String(B)), Q && (Y.title = Q), Y.onclick = X, Y;
    }, U = (T, B, X = "") => I(B, Rr(T.name) === Rr(o), () => {
      var Q;
      o = Rr(T.name) === Rr(o) ? "" : T.name, y(), o && t.artistsMount && ((Q = e.scrollIntoView) == null || Q.call(e, { block: "start", behavior: "smooth" }));
    }, `Show ${T.name}’s ${T.songs === 1 ? "song" : `${T.songs} songs`}`, X);
    if (t.grid) {
      const T = S.filter((Q) => my(Q.name)), B = S.filter((Q) => !my(Q.name)), X = i ? B : B.filter((Q) => Rr(Q.name) === Rr(o));
      u.replaceChildren(
        ...T.map((Q) => U(Q, Q.name)),
        ...B.length ? [I(i ? "Fewer artists" : `${B.length} more ${B.length === 1 ? "artist" : "artists"}`, !1, () => {
          i = !i, y();
        }, "", "find-more")] : [],
        ...X.map((Q) => U(Q, `${Q.name} · ${Q.songs}`, "find-chip--long"))
      );
    } else {
      const T = i ? S : S.slice(0, wy);
      u.replaceChildren(
        ...T.map((B) => U(B, `${B.name} · ${B.songs}`)),
        ...S.length > wy ? [I(i ? "Fewer artists" : `All ${S.length} artists`, !1, () => {
          i = !i, y();
        })] : []
      );
    }
    const P = jC(n, s, o), A = t.current();
    h.replaceChildren(...P.songs.map((T) => {
      var Q, oe;
      const B = ur("li", "lrow" + (T.id === A ? " now" : "")), X = ur("button", "lt", T.title);
      if (X.type = "button", X.title = `Play “${T.title}”${T.artist ? ` by ${T.artist}` : ""}`, X.onclick = () => t.play(T.id), (Q = t.explicit) != null && Q.call(t, T.id)) {
        const Y = ur("span", "exp", "E");
        Y.title = "Explicit lyrics: only plays when you choose it", X.append(" ", Y);
      }
      if ((oe = t.liked) != null && oe.call(t, T.id)) {
        const Y = ur("span", "find-liked", "♥");
        Y.title = "You like this song", Y.setAttribute("role", "img"), Y.setAttribute("aria-label", "Liked"), B.append(X, Y);
      } else B.append(X);
      return B.append(ur("span", "find-by", `${T.artist ? T.artist + " · " : ""}#${T.id}`)), B;
    })), c.textContent = !s.trim() && !o ? `${n.length.toLocaleString()} songs by ${S.length.toLocaleString()} artists. Search, or pick an artist.` : P.total === 0 ? "Nothing matches. Try fewer words, or pick an artist." : P.total > P.songs.length ? `Showing ${P.songs.length} of ${P.total.toLocaleString()}. Type more to narrow it down.` : `${P.total} ${P.total === 1 ? "song" : "songs"}${o ? ` by ${o}` : ""}. Tap one to play it.`;
  }
  return { load: w, refresh: y };
}
function GC(e) {
  return /(CriOS|FxiOS|EdgiOS|OPiOS)\//.test(e) || /iP(hone|ad|od)/.test(e) ? !0 : /AppleWebKit\//.test(e) && /Safari\//.test(e) && !/(Chrome|Chromium|Edg|OPR|Firefox)\//.test(e);
}
const by = (e, t, n) => Rf(Kf(new TextEncoder().encode(`xtrata-music-hero:${e}:${t}:${n}`))).slice(0, 8), KC = 317, VC = (e) => typeof e == "number" && Number.isSafeInteger(e) && e >= 1 && e <= 999999999, XC = 15 * 6e4, qC = (e) => /iPhone|iPad|iPod/.test(e.userAgent) || /Macintosh/.test(e.userAgent) && e.maxTouchPoints > 1;
function wd(e, t) {
  return e.standalone ? null : t ? "prompt" : qC(e) ? "ios" : null;
}
const Yi = {
  label: "Add to Home Screen",
  title: "Add it to your Home Screen",
  body: "Your phone only lets you do this from its own menu. It takes a few taps:",
  close: "Got it"
};
function YC(e) {
  var n;
  return /CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/.test(e) ? "other" : Number(((n = /Version\/(\d+)/.exec(e)) == null ? void 0 : n[1]) ?? 0) >= 26 ? "safari-dots" : "safari";
}
function WC(e) {
  return e === "safari-dots" ? { steps: ["Tap ••• at the bottom right of your screen", "Tap Share", "Scroll down and tap “Add to Home Screen”", "Tap Add"], where: "bottom-right" } : e === "safari" ? { steps: ["Tap the Share button at the bottom of your screen (a square with an arrow)", "Scroll down and tap “Add to Home Screen”", "Tap Add"], where: "bottom" } : { steps: ["Tap the Share button beside the address bar (a square with an arrow)", "Tap “Add to Home Screen”", "Tap Add"], where: "top-right" };
}
const dr = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, ZC = (e) => {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  t.setAttribute("viewBox", "0 0 26 26"), t.setAttribute("aria-hidden", "true");
  const n = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return n.setAttribute("d", e), t.append(n), t;
};
function JC(e, t, n = "safari") {
  const r = WC(n), s = dr("div", "a2hs-sheet a2hs-sheet--" + r.where);
  s.setAttribute("role", "dialog"), s.setAttribute("aria-modal", "true"), s.setAttribute("aria-label", Yi.title);
  const o = dr("div", "a2hs-card"), i = dr("div", "a2hs-head"), a = dr("img", "a2hs-icon");
  a.src = e, a.alt = "";
  const c = dr("div");
  c.append(dr("h2", "", Yi.title), dr("p", "", Yi.body)), i.append(a, c);
  const u = dr("ol", "a2hs-steps");
  r.steps.forEach((w, y) => {
    const v = dr("li");
    v.append(dr("i", "", String(y + 1)), dr("span", "", w)), u.append(v);
  });
  const h = dr("div", "a2hs-arrow");
  h.setAttribute("aria-hidden", "true"), h.append(ZC(r.where === "top-right" ? "M13 22V5M6 12l7-7 7 7" : "M13 4v17M6 14l7 7 7-7"));
  const d = dr("button", "a2hs-close", Yi.close);
  return d.type = "button", d.onclick = t, o.append(i, u, d), s.append(o, h), s.onclick = (w) => {
    w.target === s && t();
  }, s;
}
function QC(e) {
  let t = null, n = null, r = !1;
  const s = () => {
    n == null || n.remove(), n = null, e.button.focus();
  }, o = () => {
    const i = r ? null : wd(e.env(), !!t);
    e.button.hidden = !i, e.button.dataset.kind = i ?? "";
  };
  return e.button.setAttribute("aria-label", Yi.label), e.button.title = Yi.label, e.button.onclick = () => {
    var a;
    const i = wd(e.env(), !!t);
    if (i === "prompt" && t) {
      const c = t;
      t = null;
      try {
        c.prompt();
      } catch {
      }
      o();
      return;
    }
    i === "ios" && !n && (n = JC(e.icon, s, YC(e.env().userAgent)), e.mount.append(n), (a = n.querySelector(".a2hs-close")) == null || a.focus());
  }, e.target.addEventListener("beforeinstallprompt", (i) => {
    i.preventDefault(), t = i, o();
  }), e.target.addEventListener("appinstalled", () => {
    r = !0, t = null, s(), o();
  }), o(), { sync: o, kind: () => r ? null : wd(e.env(), !!t) };
}
const xy = document.getElementById("ppp");
xy && eT(xy);
function eT(e) {
  var Jh;
  const t = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = O1(), s = (l) => e.querySelector(l), o = s(".ppp-frame");
  let i = null;
  const a = async (l, p) => {
    const g = await fetch(l, { cache: "no-store", ...p, signal: AbortSignal.timeout(15e3) }), f = await g.json().catch(() => ({}));
    if (!g.ok) throw new Error((f == null ? void 0 : f.error) || `Request failed (${g.status}).`);
    return f;
  }, c = gI({
    now: Date.now,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    config: (l) => a("/radio/listening-wallet/config?main=" + encodeURIComponent(l || "")),
    links: async (l) => (await a("/radio/listening-wallet/link?main=" + encodeURIComponent(l))).links ?? [],
    mainOf: async (l) => {
      var g;
      const p = (await a("/radio/listening-wallet/link?listening=" + encodeURIComponent(l))).links;
      return ((g = p == null ? void 0 : p.find((f) => f.listening === l)) == null ? void 0 : g.main) ?? null;
    },
    saveLink: async (l) => {
      await a("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(l) });
    },
    bridge: async (l) => {
      i = document.createElement("iframe"), i.title = "Xtrata listening wallet", i.setAttribute("allow", `publickey-credentials-get ${l}; publickey-credentials-create ${l}`), i.referrerPolicy = "no-referrer";
      const p = new Promise((ne, Se) => {
        i.addEventListener("load", () => ne(), { once: !0 }), setTimeout(() => Se(new Error("The listening wallet did not load.")), 15e3);
      });
      i.src = l + "/", o.replaceChildren(i), await p;
      const g = new L1({ walletOrigin: l, frame: i, timeoutMs: 30 * 6e4 }), f = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.prove", "listening.backup", "listening.signAward", "listening.approveSession", "listening.prepareReturn"]), F = (ne, Se) => f.has(ne) ? g.request(ne, Se) : Promise.race([
        g.request(ne, Se),
        new Promise((pe, Je) => setTimeout(() => Je(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await F("listening.status"), { request: F };
    },
    chain: {
      verify: q5,
      balance: W5,
      account: Y5,
      owner: Z5,
      broadcast: J5,
      transaction: Q5,
      confirmedNonce: async (l) => {
        const p = await $s(`/v2/accounts/${l}?proof=0`);
        if (!Number.isSafeInteger(p == null ? void 0 : p.nonce) || p.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(p.nonce);
      }
    },
    signWithMain: (l, p) => rd({ ...p, network: "mainnet", stxAddress: l }),
    deposit: (l, p, g) => new Promise((f, F) => Tg({
      recipient: p,
      amount: g.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: l,
      network: new md(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (ne) => f(ne.txId || ""),
      onCancel: () => F(new Error("Deposit cancelled. Nothing was sent.")),
      onError: F
    })),
    validate: eI,
    tabLock: (l) => new Promise((p) => {
      const g = navigator.locks;
      if (!(g != null && g.request)) {
        p(!0);
        return;
      }
      g.request("xtrata-ppp:" + l, { ifAvailable: !0 }, async (f) => {
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
    changed: () => Te(c.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (l) => {
      var p, g;
      return v.funder(l, () => iI(l, $s), !!((g = (p = c.snapshot().gate) == null ? void 0 : p.gifts) != null && g.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (l) => {
      const p = await a("/radio/gift/for?wallet=" + encodeURIComponent(l)), g = p == null ? void 0 : p.gift;
      if (!g) return null;
      if (typeof g.returnTo != "string" || typeof g.treasury != "string") throw new Error("Unreadable gift record.");
      return {
        returnTo: g.returnTo,
        from: typeof g.from == "string" ? g.from : null,
        source: String(g.source ?? ""),
        amount: String(g.amount ?? "0"),
        treasury: g.treasury,
        state: g.state === "sending" ? "sending" : "arrived",
        player: g.player ?? null,
        ...g.drop === "players" || g.drop === null ? { drop: g.drop } : {}
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
      const g = await a("/radio/awards/note", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ address: l, name: p }) });
      if (typeof (g == null ? void 0 : g.record) != "string" || typeof (g == null ? void 0 : g.signature) != "string" || !Number.isSafeInteger(g == null ? void 0 : g.cls) || !Number.isSafeInteger(g == null ? void 0 : g.number) || !Number.isSafeInteger(g == null ? void 0 : g.plays)) throw new Error("Unreadable award note.");
      return { cls: g.cls, number: g.number, plays: g.plays, record: g.record, signature: g.signature, name: typeof g.name == "string" ? g.name : null };
    },
    history: (l, p) => lI(l, (g) => $s(g), p),
    likesChanged: () => {
      var l, p;
      (p = (l = window.XtrataRadio) == null ? void 0 : l.refreshLikes) == null || p.call(l);
    },
    likeState: async (l, p) => {
      const g = await a("/radio/chain-likes?" + new URLSearchParams({ wallet: l, ids: String(p) })), f = Array.isArray(g == null ? void 0 : g.rows) ? g.rows.find((F) => (F == null ? void 0 : F.id) === p) : null;
      if (!f || typeof f.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: f.liked, by: Array.isArray(f.by) ? f.by.filter((F) => typeof F == "string") : f.liked ? [l] : [] };
    },
    likeSent: (l, p) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: l, liked: p } })),
    nameOf: (l) => gn(l) ?? void 0,
    likeConfirmed: (l, p) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: l, liked: p } })),
    likeFailed: (l) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: l } }))
  }), u = (l, p, g, f, F, ne) => new Promise((Se, pe) => Tg({
    recipient: f,
    amount: F.toString(),
    memo: ne,
    stxAddress: g,
    network: new md(),
    appDetails: { name: l, icon: "/favicon.svg" },
    onFinish: (Je) => Se(Je.txId || ""),
    onCancel: () => pe(new Error(p)),
    onError: pe
  })), h = (l) => v.incomingStarter() && l.canAnother && l.hadGift === !1 && !l.main && l.listening && !l.createdHere && !l.brandNew && ["locked", "ready", "fund", "over", "link"].includes(l.step) && !l.busy ? () => void c.create({ quick: !0, another: !0 }) : null, d = (l) => h(l) && l.canForget ? () => {
    w.start(l), Te(c.snapshot());
  } : null, w = dC({
    json: a,
    unlock: () => void c.unlock(),
    returnAll: () => void c.returnFunds("all"),
    forget: () => c.forget(),
    backup: () => void c.backup(),
    keepBoth: (l) => h(l),
    who: (l) => ht(l),
    changed: () => Te(c.snapshot()),
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
  }), y = () => ({ quick: !!v.incomingStarter(), ...w.claiming() ? { another: !0 } : {} }), v = SL({
    json: a,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    pay: (l, p, g, f) => u("Xtrata Radio · gift", "Gift cancelled. Nothing was sent.", l, p, g, f),
    sign: (l, p) => rd({ ...p, network: "mainnet", stxAddress: l }),
    giftSent: (l, p) => c.giftSent(l, p),
    claiming: (l) => c.giftClaiming(l),
    batchDays: () => {
      var l, p;
      return (p = (l = c.snapshot().gate) == null ? void 0 : l.gifts) == null ? void 0 : p.batchDays;
    },
    claimNew: (l) => h(l),
    replaceOld: (l) => d(l),
    album: { bind: (l) => c.bindAlbum(l), arrived: async (l, p, g, f) => {
      P.invalidate(), await c.albumArriving(l, p, g, f);
    } },
    who: (l) => ht(l),
    changed: () => Te(c.snapshot()),
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
  }), S = (l) => {
    Promise.resolve(c.openAlbum(l)).then(() => {
      if (!wn()) return;
      const p = c.snapshot();
      window.dispatchEvent(new CustomEvent(p.slot === l && !p.error ? "xtrata:radio-listen" : "xtrata:radio-panel"));
    });
  };
  let I;
  const U = (l) => {
    l !== I && (I = l, window.dispatchEvent(new CustomEvent("xtrata:radio-albums", { detail: { has: l } })));
  }, P = BL({
    json: a,
    open: S,
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
    changed: () => Te(c.snapshot())
  }), A = {
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
  }, T = xC(location.search, A);
  T.on && (document.documentElement.dataset.novice = T.preview ? "preview" : "1");
  const B = (l) => T.on && l.solo, X = T.on || (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), Q = X ? document.getElementById("album") : null, oe = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (l) => void c.topUpAlbum(l),
    openPlayer: () => void c.openAlbum(0)
  }, Y = Q ? uy(Q, oe) : null, m = uC({
    json: a,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    sign: (l, p) => rd({ ...p, network: "mainnet", stxAddress: l }),
    signShelf: (l, p) => c.signShelf(l, p),
    pay: (l, p, g, f) => u("Xtrata Music · album", "Payment cancelled. Nothing was sent.", l, p, g, f),
    copies: (l, p) => {
      var g;
      return v.copies(l, p, ((g = c.snapshot().gate) == null ? void 0 : g.radioUrl) ?? null);
    },
    player: () => {
      const l = c.snapshot(), p = l.slot === 0 ? l.listening : l.root;
      return { address: p, unlocked: !!p && ["ready", "fund", "over", "link"].includes(l.step) };
    },
    open: (l) => pn(l, !0),
    who: (l) => ht(l),
    art: { song: (l, p) => p && Kl(String(l)) || iy(String(l)), cover: (l) => fl(l) },
    audition: WL({
      changed: () => Te(c.snapshot()),
      quiet: () => {
        var p;
        const l = window.XtrataRadio;
        try {
          (p = l == null ? void 0 : l.getState) != null && p.call(l).playing && l.playPause();
        } catch {
        }
      }
    }),
    changed: () => Te(c.snapshot()),
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
  }), L = () => {
    const l = new Set(zn.map((p) => p.id));
    return [...zn, ...m.albums().filter((p) => !l.has(p.id))];
  }, _ = Q ? tC(Q) : null, N = "xtrata.radio.award.later.v1";
  let W = "ready", j = !1, ye = (() => {
    try {
      return Date.now() - Number(localStorage.getItem(N) || 0) < 24 * 36e5;
    } catch {
      return !1;
    }
  })(), ce = !1;
  const Xe = "xtrata.radio.tier.v1";
  let $ = (() => {
    const l = A.get(Xe);
    return Jc(l) ? Vs(l) : null;
  })();
  const R = (() => {
    try {
      return new URLSearchParams(location.search).get("mystery") === "1" && sessionStorage.setItem("xtrata.radio.mystery", "1"), sessionStorage.getItem("xtrata.radio.mystery") === "1";
    } catch {
      return !1;
    }
  })();
  function ue(l) {
    var F;
    if (l.listening && l.slot === 0 && ["fund", "ready", "over"].includes(l.step) && !(l.gift && l.gift.drop === void 0)) {
      let ne = null;
      try {
        ne = l.gift && !l.gift.player && l.gift.drop === "players" ? pL(BigInt(l.gift.amount)) : null;
      } catch {
        ne = null;
      }
      ((F = l.award) == null ? void 0 : F.state) === "claimed" && l.award.holds === !1 && (ne = null), ((ne == null ? void 0 : ne.id) ?? null) !== (($ == null ? void 0 : $.id) ?? null) && ($ = ne, A.set(Xe, ne ? ne.id : null));
    }
    const p = document.documentElement;
    $ ? p.dataset.tier = $.id : delete p.dataset.tier;
    const g = document.querySelector("#ppp .ppp-head h3");
    if (!g) return;
    let f = g.querySelector(".ppp-tier");
    if (!$) {
      f == null || f.remove();
      return;
    }
    f || (f = C("span", "", "ppp-tier"), g.append(f)), f.dataset.tier = $.id, f.textContent = `${$.mark} ${$.name.toUpperCase()} PLAYER`, f.title = `A ${$.name} player from the Xtrata Music giveaway`;
  }
  const me = (() => {
    var l;
    try {
      return !!((l = window.matchMedia) != null && l.call(window, "(display-mode: standalone)").matches) || navigator.standalone === !0;
    } catch {
      return !1;
    }
  })(), _e = document.getElementById("a2hs");
  _e && QC({
    button: _e,
    icon: "/radio/icons/app-192.png",
    mount: document.body,
    target: window,
    env: () => ({ userAgent: navigator.userAgent, maxTouchPoints: navigator.maxTouchPoints || 0, standalone: me })
  });
  let ve = T.on ? KC : null, mt = !1, ze = 0, Ne = "";
  T.on && a("/radio/giveaway/players/intro").then((l) => {
    const p = l && l.song === null ? null : VC(l == null ? void 0 : l.song) ? l.song : ve;
    p !== ve && !mt && (ve = p, Te(c.snapshot()));
  }).catch(() => {
  });
  const Pe = (() => {
    try {
      const l = Number(new URLSearchParams(location.search).get("n"));
      Number.isSafeInteger(l) && l >= 1 && l <= 1e5 && sessionStorage.setItem("xtrata.radio.spot", String(l));
      const p = Number(sessionStorage.getItem("xtrata.radio.spot"));
      return Number.isSafeInteger(p) && p >= 1 ? p : null;
    } catch {
      return null;
    }
  })(), _n = (l) => {
    var f, F, ne;
    if (!mt || ve === null) return !1;
    if (Date.now() - ze > XC || l.step === "ready")
      return l.step !== "ready" && (mt = !1), !1;
    const p = (F = (f = window.XtrataRadio) == null ? void 0 : f.getState) == null ? void 0 : F.call(f), g = Number((ne = p == null ? void 0 : p.nowPlaying) == null ? void 0 : ne.tokenId);
    return Date.now() - ze < 2e4 && !Number.isSafeInteger(g) ? !0 : g !== ve ? (mt = !1, !1) : !0;
  };
  function En() {
    const l = window.XtrataRadio;
    if (!(ve === null || !(l != null && l.playToken))) {
      mt = !0, ze = Date.now(), c.holdFirstPlay(), Te(c.snapshot());
      try {
        l.playToken(ve);
      } catch {
        mt = !1;
      }
    }
  }
  const gt = () => {
    var f, F;
    if (!mt || ve === null) return null;
    const l = (F = (f = window.XtrataRadio) == null ? void 0 : f.getState) == null ? void 0 : F.call(f), p = l != null && l.nowPlaying && Number(l.nowPlaying.tokenId) === ve ? l.nowPlaying : null, g = Au.get(ve);
    return { title: (p == null ? void 0 : p.title) || (g == null ? void 0 : g.title) || "", artist: (p == null ? void 0 : p.artist) || (g == null ? void 0 : g.artist) || "", art: `/radio/artwork?id=${ve}`, playing: !!(l != null && l.playing) };
  }, Ct = T.on && Q ? FL(Q) : null, Ht = Date.now();
  let z = !1, O = null, ee = (() => {
    try {
      return sessionStorage.getItem("xtrata.radio.novice.full") === "1";
    } catch {
      return !1;
    }
  })();
  const re = () => {
    ee = !0;
    try {
      sessionStorage.setItem("xtrata.radio.novice.full", "1");
    } catch {
    }
    Te(c.snapshot());
  }, le = (l, p) => {
    var ne;
    if (!Ct || p || ee) return null;
    if (!l.gate || l.step === "loading" || (z = !0), !z) return Date.now() - Ht < 1e4 ? "checking" : null;
    if (!B(l) || w.active() && l.step !== "intro") return null;
    if (l.step === "intro" || l.step === "unsupported") return v.incomingStarter() ? "gift" : "new";
    if (l.step === "locked") return "back";
    const f = l.slot === 0 && !((ne = l.gift) != null && ne.player), F = f && !l.entries.some((Se) => Se.kind === "play");
    return l.step === "fund" && F ? l.depositPending ? "arriving" : "empty" : l.step === "ready" && f && (O === "landed" || O === "arriving" && (F || mt)) ? "landed" : l.step === "loading" && O !== "checking" ? O : null;
  };
  let xt = !1;
  const De = (() => {
    try {
      return GC(navigator.userAgent);
    } catch {
      return !1;
    }
  })();
  function Fe(l, p, g = [], f) {
    if (!Ct) return;
    const F = f !== void 0 ? f : le(l, p);
    if (O = F, delete document.documentElement.dataset.noviceBoot, !F) {
      Ct.render(null, p);
      return;
    }
    const ne = [...g];
    F === "arriving" && l.arrival && ne.push(tt(l.arrival)), l.step === "unsupported" ? ne.push(C("p", "This browser cannot make a player. Open this page in Safari or Chrome.", "ppp-warn")) : l.error && ne.push(C("p", l.error, "ppp-warn"));
    const Se = F === "gift" ? v.incomingStarter() : null;
    Se && (ve === null || De) && !xt && l.step === "intro" && !l.busy && !l.armed && !l.error && !_r && (xt = !0, c.create({ quick: !0, ...w.claiming() ? { another: !0 } : {} })), Ct.render({
      mode: F,
      status: ne,
      asking: !!l.busy || l.armed,
      busy: !!l.busy,
      canStart: (l.step === "intro" || l.step === "locked") && !_r,
      plays: Se ? Se.plays : F === "landed" ? l.playsLeft : null,
      from: (Se == null ? void 0 : Se.from) ?? null,
      tier: $,
      mystery: R,
      spot: Pe,
      installed: me,
      intro: Se && ve !== null && !De && l.step === "intro" ? { ready: !0 } : null,
      now: gt(),
      albums: F === "landed" ? zn.map((pe) => ({ title: pe.title, by: pe.subtitle, cover: fl(pe.cover), run: () => {
        re(), pn(pe, !0);
      } })) : [],
      claimNew: F === "back" ? h(l) : null,
      replaceOld: F === "back" ? d(l) : null,
      start: () => {
        Se && ve !== null && !De && En(), c.create(y());
      },
      unlock: () => void c.unlock(),
      returning: () => void c.unlock(!0),
      restock: () => Ee(),
      full: () => {
        var Pt, pt, qe;
        const pe = window.XtrataRadio, Je = F === "landed" && !((pt = (Pt = pe == null ? void 0 : pe.getState) == null ? void 0 : Pt.call(pe)) != null && pt.playing);
        mt = !1, re(), Je && ((qe = pe == null ? void 0 : pe.playPause) == null || qe.call(pe));
      }
    });
  }
  Ct && setTimeout(() => {
    z || Te(c.snapshot());
  }, 10100), zl(() => {
    (Ct != null && Ct.showing() || document.documentElement.dataset.asking || m.wantsArt()) && Te(c.snapshot());
  });
  const je = OC({
    input: () => {
      var F, ne, Se, pe;
      const l = c.snapshot();
      if (!["fund", "ready", "over"].includes(l.step)) return null;
      const p = l.slot === 0 ? { address: l.listening, balance: l.balance } : { address: l.root, balance: (F = l.likeFunds) == null ? void 0 : F.balance };
      if (!p.address) return null;
      const g = l.slot === 0 ? l.entries : [], f = g.filter((Je) => Je.kind === "play" && Je.status === "confirmed");
      return {
        playsLeft: p.balance === void 0 ? null : ft(p.balance),
        balance: p.balance,
        incoming: 0n,
        fee: BigInt(((ne = l.gate) == null ? void 0 : ne.limits.playFee) ?? "300"),
        address: p.address,
        switches: ((Se = l.gate) == null ? void 0 : Se.restock) ?? {},
        backedUp: l.backedUp,
        done: f.length ? { plays: f.length, artists: new Set(f.map((Je) => Je.recipient)).size, likes: g.filter((Je) => Je.kind === "like" && Je.status === "confirmed" && Je.liked).length } : null,
        arriving: l.slot === 0 ? l.depositPending : !!((pe = l.likeFunds) != null && pe.pending)
      };
    },
    copyButton: (l, p, g, f) => gr(l, p, g, f, () => {
      Te(c.snapshot());
    })
  }), Ee = () => {
    if (!c.snapshot().unproven) {
      je.open();
      return;
    }
    c.prove().then((l) => {
      l && je.open();
    });
  }, et = document.getElementById("albumList"), Ye = et ? uy(et, oe, { list: !0 }) : null, Ze = "xtrata.radio.album.last.v1", zt = () => {
    try {
      const l = JSON.parse(localStorage.getItem(Ze) || "null");
      return l && typeof l.root == "string" && Number.isSafeInteger(l.slot) && l.slot > 0 && l.player && Array.isArray(l.player.tracks) ? l : null;
    } catch {
      return null;
    }
  };
  let un = "";
  const Yn = (l) => {
    const p = JSON.stringify(l);
    if (p !== un) {
      un = p;
      try {
        localStorage.setItem(Ze, p);
      } catch {
      }
    }
  };
  let hn = null;
  window.XtrataRadioLikeHandler = (l) => {
    var g;
    if (!l || !Number.isSafeInteger(l.song) || l.song < 0) return !1;
    (g = c.snapshot().likeFunds) != null && g.album && (Le = !0), In();
    const p = Ro(l.song, { title: l.title, artist: l.artist });
    return c.heart({ song: l.song, title: p.title || void 0, artist: p.artist || void 0, likedBy: Array.isArray(l.likedBy) ? l.likedBy : void 0 });
  };
  let Nt;
  window.XtrataRadioListeningIdentity = () => {
    const l = c.snapshot();
    return l.solo && l.step !== "off" && l.step !== "elsewhere" ? l.listening : void 0;
  };
  const Wn = (l) => {
    var g, f;
    const p = window.XtrataRadioListeningIdentity();
    p !== Nt && (Nt = p, (f = (g = window.XtrataRadio) == null ? void 0 : g.refreshLikes) == null || f.call(g));
  };
  let zn = [], Zr = 0, Br = !1, kn = null;
  const $n = (l) => {
    var p, g;
    Br || !((g = (p = l.gate) == null ? void 0 : p.gifts) != null && g.enabled) || Date.now() - Zr < 6e4 || (Zr = Date.now(), a("/radio/gift/featured").then((f) => {
      zn = (Array.isArray(f == null ? void 0 : f.players) ? f.players : []).filter((F) => F && typeof F.id == "string" && typeof F.title == "string" && Array.isArray(F.tracks) && F.tracks.length > 0).slice(0, 6), Br = !0, zn.length && Te(c.snapshot());
    }).catch(() => {
    }));
  }, Rt = (l) => {
    var p;
    return kn && l.slot === 0 && !((p = l.gift) != null && p.player) && ["ready", "fund", "loading"].includes(l.step) ? kn : null;
  }, pn = (l, p = !1) => {
    var f, F;
    kn = l, Te(c.snapshot());
    const g = l && p ? Xr(l)[0] : null;
    g && ((F = (f = window.XtrataRadio) == null ? void 0 : f.playToken) == null || F.call(f, g.id));
  };
  let Re = If(), on = null;
  const mo = (l) => {
    const p = T.preview && !_r && l.step === "intro" ? v.incomingAlbum() : null;
    return p ? (Re = yd(Re, { kind: "offer", album: p.player.id, already: l1(A).includes(p.player.id) }), nl(Re) ? p.player : null) : (Re = yd(Re, { kind: "withdraw" }), null);
  }, Jr = (l) => {
    const p = Re.phase;
    Re = yd(Re, l), Re.phase !== p && (Re.album && (Re.phase === "playing" || Re.phase === "done") && LC(A, Re.album), Te(c.snapshot()));
  };
  setInterval(() => {
    Re.phase === "playing" && Jr({ kind: "tick", at: Date.now() });
  }, 5e3);
  let E = "", H, V = !1, D = !1, J;
  const se = (l, p) => {
    var Ko, Io, Ci, nr, ka, Vo, Oe, kt, Bt, On;
    const g = window.XtrataRadio;
    if (!(g != null && g.setGiftPlayer) || !(g != null && g.setGiftStop)) return;
    const f = p.depositPending && l.step === "fund" && ((Ko = l.giftStop) == null ? void 0 : Ko.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : l.giftStop, F = on, ne = _n(l), Se = f ? B(l) ? EC(f.reason, f.text) : f.text : null, pe = F || ne ? null : Se ?? (t && (!((Io = l.gate) != null && Io.here) || l.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null), Je = l.slot === 0 && !((Ci = l.gift) != null && Ci.player) && !l.entries.some((Xo) => Xo.kind === "play"), Pt = !!Ct && !ee && B(l) && (l.step === "intro" || l.step === "unsupported" || l.step === "locked" || l.step === "fund" && Je), pt = (f == null ? void 0 : f.reason) === "arriving" || (f == null ? void 0 : f.reason) === "tab" || Pt, qe = !!pe && !pt, Ue = qe ? null : pe;
    qe !== J && ((nr = g.setSample) == null || nr.call(g, qe), J = qe), Ue && Ue !== H && (g.setGiftStop(Ue), H = Ue);
    const Ie = l.step === "off" || l.step === "elsewhere" ? null : ((ka = l.gift) == null ? void 0 : ka.player) ?? F ?? Rt(l) ?? null, It = Ie ? Ie.id + ":" + Ie.cover + ":" + Ie.tracks.map((Xo) => Xo.id).join(",") : "";
    It !== E && (g.setGiftPlayer(Ie ? { id: Ie.id, title: Ie.title, subtitle: Ie.subtitle, tracks: Xr(Ie).map((Xo) => Xo.id), hidden: ((Vo = fL(Ie)) == null ? void 0 : Vo.id) ?? null, cover: Ie.cover } : null), E = It), Ue !== H && (g.setGiftStop(Ue), H = Ue);
    const Gt = !ne && (f == null ? void 0 : f.reason) === "arriving";
    Gt !== D && ((Oe = g.setGiftWait) == null || Oe.call(g, Gt), D = Gt);
    const tr = !!Ie && (!!F || !!((kt = l.albumLock) != null && kt.locked));
    tr !== V && ((Bt = g.setGiftLock) == null || Bt.call(g, tr), V = tr), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(l.step) && ((On = g.forgetWallets) == null || On.call(g));
  };
  let Le = !1;
  const Ae = /* @__PURE__ */ new Map(), Ge = (l) => {
    if (!(l.step === "fund" && !l.depositPending && !!l.gift && !!l.listening && l.balance === 0n && !l.entries.some((f) => f.kind === "play") && (l.brandNew || l.createdHere))) return null;
    let g = Ae.get(l.listening);
    return g === void 0 && (g = Date.now(), Ae.set(l.listening, g)), Date.now() - g < Fl ? g : null;
  }, Tt = (l) => l.step === "fund" && !l.depositPending && !!l.gift && l.balance === 0n && !l.entries.some((p) => p.kind === "play") && !!l.listening && Ae.has(l.listening), We = (l) => l ? l.slice(0, 6) + "…" + l.slice(-4) : "", ft = (l) => {
    const p = c.snapshot().playCost || 350n;
    return l > an ? Number((l - an) / p) : 0;
  }, St = (l) => (Number(l) / 1e6).toFixed(l < 1000n ? 6 : 4), yt = (l) => {
    const p = Math.round((Date.now() - l) / 6e4);
    return p < 1 ? "now" : p < 60 ? `${p}m` : p < 1440 ? `${Math.round(p / 60)}h` : `${Math.round(p / 1440)}d`;
  }, _t = (l) => `https://explorer.hiro.so/txid/${l}?chain=mainnet`, C = (l, p = "", g = "") => {
    const f = document.createElement(l);
    return p && (f.textContent = p), g && (f.className = g), f;
  }, $e = (l, p, g = "") => {
    const f = C("button", l, g);
    return f.type = "button", f.onclick = p, f;
  }, Ve = (l, p) => {
    const g = C("a", l);
    return g.href = p, g.target = "_blank", g.rel = "noopener", g;
  }, Mr = 6, Nr = 20;
  let ut = !1, Jt = !1;
  const vi = (l) => {
    const p = Math.round((Date.now() - l) / 6e4);
    return p < 1 ? "just now" : p < 60 ? `${p} min ago` : p < 1440 ? `${Math.round(p / 60)} h ago` : `${Math.round(p / 1440)} ${Math.round(p / 1440) === 1 ? "day" : "days"} ago`;
  };
  zl(() => {
    Jt && Te(c.snapshot());
  });
  let Sr = null, jo = location.hash === "#give";
  jo && history.replaceState(null, "", location.pathname + location.search);
  let Zn = !1;
  const Jn = JI((l) => ZI({ address: l, network: "mainnet" }), () => Te(c.snapshot())), gn = (l) => Jn.get(l), _r = yC(navigator.userAgent), Ts = (l, p) => {
    const g = navigator.userAgent, f = mC(g), F = `${location.origin}${location.pathname}${p ? `#gift=${p}` : ""}`, ne = [C("p", `You are in ${l}'s built-in browser, where passkeys often do not work. Open this page in ${f} to make your ${T.on ? "player" : "listening wallet"}${p ? T.on ? " and open your gift" : " and claim your gift" : ""}.`, "ppp-warn")], Se = C("div", "", "ppp-open-row"), pe = wC(F, g);
    if (pe) {
      const Je = C("a", `Open in ${f}`, "primary ppp-open-in");
      Je.href = pe, Je.dataset.homeAction = "radio:open-in-browser", Se.append(Je);
    }
    return Se.append(gr("copy-page-link", "Copy link", () => F, pe ? "" : "primary", () => Te(c.snapshot()))), ne.push(Se, C("p", `If that does not open ${f}, use ${l}'s menu (••• or ⋮) and choose "Open in ${f === "your browser" ? "browser" : f}", or paste the copied link there.`, "ppp-mute")), ne;
  }, ht = (l) => gn(l) ?? We(l), bo = (l) => l.slice(0, 2).map(ht).join(" and ") + (l.length > 2 ? ` and ${l.length - 2} more` : ""), Ai = /* @__PURE__ */ new Map();
  let xo = !1;
  const Ei = (l) => !l || /^(?:Inscription )?#\d+$/.test(l.trim()), In = () => {
    xo || (xo = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((l) => l.ok ? l.json() : null).then((l) => {
      for (const p of Array.isArray(l == null ? void 0 : l.tracks) ? l.tracks : []) {
        const g = Number(p == null ? void 0 : p.id);
        Number.isSafeInteger(g) && Ai.set(g, { title: typeof p.title == "string" ? p.title : void 0, artist: typeof p.artist == "string" ? p.artist : void 0 });
      }
      Te(c.snapshot());
    }).catch(() => {
      xo = !1;
    }));
  }, Ro = (l, p) => {
    const g = Ai.get(l), f = qg(l, [g == null ? void 0 : g.title, p == null ? void 0 : p.title].find((ne) => !Ei(ne)) || ""), F = Vg(l, (g == null ? void 0 : g.artist) || (p == null ? void 0 : p.artist) || "");
    return { title: f, artist: F };
  }, So = (l) => {
    const { title: p, artist: g } = Ro(l.song, l);
    return p ? `“${p}”${g ? ` — ${g}` : ""}` : `Song #${l.song}${g ? ` — ${g}` : ""}`;
  }, ki = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, Bs = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function vo(l) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(l.step) ? ["", ""] : l.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : l.step === "over" ? ["TOO MUCH", "bad"] : l.step === "locked" ? ["LOCKED", "mute"] : l.step === "intro" || l.step === "link" ? ["", ""] : l.step === "fund" ? l.depositPending ? ["ON ITS WAY", "warn"] : l.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : l.payingOn && l.session && l.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function Ln(l, p, g = "", f) {
    const F = C("dt", l), ne = C("dd", p, g);
    return f && ne.append(" ", f), [F, ne];
  }
  const Pn = document.getElementById("ppp-top"), zo = () => {
    window.dispatchEvent(new CustomEvent("xtrata:radio-panel")), (o.hidden || o.classList.contains("ppp-frame--rest") ? e : o).scrollIntoView({ behavior: "smooth", block: "center" }), e.classList.remove("ppp-flash"), e.offsetWidth, e.classList.add("ppp-flash");
  }, vr = () => {
    var p;
    const l = window.XtrataRadioConnectStacks;
    l ? l() : (p = document.getElementById("radio-wallet-connect")) == null || p.click();
  }, Ms = () => {
    var p, g;
    const l = c.snapshot();
    if (l.step === "connect" || l.step === "wrong-wallet") {
      vr();
      return;
    }
    if (l.step === "elsewhere" && ((p = l.gate) != null && p.radioUrl)) {
      location.href = l.gate.radioUrl;
      return;
    }
    if (l.step === "locked" && !l.armed && !l.busy && c.unlock(), l.step === "ready" && ((g = l.giftStop) == null ? void 0 : g.reason) === "off" && !l.busy && c.switchOn(), l.step === "fund" && l.solo && !l.depositPending && !l.busy) {
      Ee();
      return;
    }
    zo();
  };
  Pn && (Pn.onclick = Ms);
  const Ao = (l, p, g, f = "") => l.standIn && !l.mainConnected ? $e(`Connect ${ht(l.standIn)} to add STX`, vr, f) : $e(p, g, f), Ns = (l) => {
    c.useLinked(l).then(() => zo());
  };
  let Ar = null;
  const $i = () => {
    const l = py(c.snapshot(), ht);
    return l.length ? Ar || (Ar = new Promise((p) => {
      var pt;
      const g = C("dialog", "", "ppp-connect");
      g.setAttribute("aria-labelledby", "ppp-connect-title");
      let f = null;
      const F = (qe) => {
        f = qe, g.close();
      };
      g.addEventListener("close", () => {
        g.remove(), Ar = null, p(f);
      }), g.addEventListener("click", (qe) => {
        qe.target === g && F(null);
      });
      const ne = (qe, Ue, Ie, It, Gt = !1) => {
        const tr = C("button", "", "ppp-connect__opt " + Ie);
        return tr.type = "button", tr.disabled = Gt, tr.onclick = It, tr.append(C("b", qe), C("span", Ue)), tr;
      }, Se = C("h2", "Connect to Xtrata Music", "ppp-connect__title");
      Se.id = "ppp-connect-title";
      const pe = l.map((qe) => ne(qe.label, qe.detail, "is-music", () => {
        if (F("music"), qe.action === "linked" && qe.main) {
          Ns(qe.main);
          return;
        }
        const Ue = py(c.snapshot(), ht).find((Ie) => Ie.action !== "linked");
        (Ue == null ? void 0 : Ue.action) === "create" ? c.create() : (Ue == null ? void 0 : Ue.action) === "unlock" && c.unlock(), zo();
      }, !!qe.disabled)), Je = ne("Xverse or Leather", "If you already use one.", "is-stacks", () => F("stacks")), Pt = $e("Cancel", () => F(null), "quiet ppp-connect__cancel");
      g.append(Se, ...pe, Je, Pt), document.body.appendChild(g), g.showModal(), (pt = pe.find((qe) => !qe.disabled)) == null || pt.focus();
    }), Ar) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = $i;
  const yn = document.getElementById("playerId");
  let Er = 0, Qn = "";
  yn && (yn.onclick = async () => {
    const l = yn.dataset.address;
    if (!l) return;
    const p = await r1(l);
    Er = Date.now(), yn.classList.toggle("is-copied", p), yn.querySelector(".who-t").textContent = p ? "Copied ✓" : "Copy failed", setTimeout(() => {
      Date.now() - Er >= 1400 && (yn.classList.remove("is-copied"), Qn = "", qt(c.snapshot()));
    }, 1500);
  });
  function qt(l) {
    if (!yn) return;
    const p = fC(l);
    if (yn.hidden = !p, !p) {
      delete yn.dataset.address, Qn = "";
      return;
    }
    if (Date.now() - Er < 1400) return;
    const g = gn(p), f = g ? pC(g) : hC(p);
    if (f + p === Qn) return;
    Qn = f + p, yn.dataset.address = p, yn.classList.toggle("is-name", !!g), yn.querySelector(".who-t").textContent = f;
    const F = `Your player${g ? ` · ${g}` : ""} · ${p}. Tap to copy the address.`;
    yn.title = F, yn.setAttribute("aria-label", F);
  }
  function Pr(l) {
    if (qt(l), !Pn) return;
    const p = (F, ne, Se) => {
      Pn.hidden = !1, Pn.className = "ppp-top" + (ne ? " is-" + ne : ""), Pn.replaceChildren(C("span", "", "dot"), document.createTextNode(F)), Pn.title = Se;
    }, g = (F) => {
      p("", "on", "Every play counts for the song’s owner");
      const ne = C("span");
      ne.append(`${F.toLocaleString()} plays`, C("span", " left", "ppp-top-left")), Pn.append(ne);
    }, f = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0;
    switch (l.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        Pn.hidden = !0;
        return;
      case "elsewhere":
        return p("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        Pn.hidden = !0;
        return;
      case "intro":
        return p("Set up your player", "", "Create a passkey listening wallet");
      case "wrong-wallet":
        return p(`Connect ${ht(l.linked)}`, "warn", `This device's listening wallet belongs to ${ht(l.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return p("Unlock", "", "One tap with your face or fingerprint");
      case "link":
        return p("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return l.depositPending ? p("Plays on their way", "quiet", "Plays start by themselves when they land") : p(l.entries.some((F) => F.kind === "play") ? "No plays left · add plays" : "Add plays", "warn", "Add plays to keep listening");
      case "over":
        return p("Too much in your player", "warn", "Return the extra to keep counting plays");
      case "loading":
        return p("Xtrata Music", "quiet", "Checking your player");
      case "ready":
        return l.payingOn && f > 0 && !l.giftStop ? g(f) : p("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const Cn = document.getElementById("pppNudge"), Qr = document.getElementById("onair");
  (Jh = Cn == null ? void 0 : Cn.querySelector("button")) == null || Jh.addEventListener("click", () => Ms());
  const Ii = {
    connect: "Connect your player to hear whole songs",
    intro: "Set up your player to hear whole songs",
    locked: "Unlock your player to hear whole songs",
    "wrong-wallet": "Switch wallets to hear whole songs",
    link: "Finish setup to hear whole songs",
    fund: "Previews only: no plays left",
    over: "Return the excess to hear whole songs",
    ready: "Music support is paused"
  }, Aa = {
    elsewhere: "Open",
    connect: "Connect",
    "wrong-wallet": "Switch wallet",
    intro: "Set up",
    locked: "Unlock",
    link: "Finish setup",
    fund: "Add plays",
    over: "Fix it",
    ready: "Switch on"
  }, Eo = document.getElementById("claimCard");
  let eo = !1, ko = 0, er = 0;
  function Li(l) {
    if (!Eo) return;
    const p = (l.step === "intro" || l.step === "connect" || l.step === "elsewhere") && !l.gift;
    p && !eo && (eo = !0, a("/radio/giveaway/players").then((f) => {
      (f == null ? void 0 : f.state) !== "open" || typeof f.free != "number" || typeof f.total != "number" || f.free <= 0 || (ko = f.free, er = f.total, Li(c.snapshot()));
    }).catch(() => {
    })), Eo.hidden = !(p && ko > 0);
    const g = Eo.querySelector(".claim-n");
    g && ko > 0 && (g.textContent = `${ko.toLocaleString()} of ${er.toLocaleString()} left`);
  }
  const $o = document.getElementById("youStatus");
  function _s(l) {
    if (!$o || l.step === "loading") return;
    const p = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0, g = l.step === "ready" && l.payingOn && p > 0 && !l.giftStop, f = l.step === "intro" || l.step === "connect" || l.step === "elsewhere";
    $o.dataset.on = g ? "1" : "0";
    const F = $o.querySelector("b"), ne = $o.querySelector(".you-status__t > span");
    !F || !ne || (F.textContent = g ? "Connected to Xtrata Music" : f ? "No player connected" : "Your player is not connected", ne.textContent = g ? "Every play goes to the artist, and your likes are saved." : f ? "Connect a player to play songs and pay the artists you listen to." : l.step === "locked" ? "Unlock it below to carry on listening." : "See below for what it needs.");
  }
  function Ps(l) {
    if (l.step === "loading") return;
    const p = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0, g = l.step === "ready" && l.payingOn && p > 0 && !l.giftStop, f = l.step === "fund" && l.depositPending, F = l.step === "elsewhere" && !t, ne = g || f || F ? "" : Ii[l.step] ?? "", Se = g ? "on" : F ? "free" : ne ? "off" : "";
    Se ? document.documentElement.dataset.ppp = Se : delete document.documentElement.dataset.ppp, Qr && (Qr.hidden = !Se || Se === "free", Qr.querySelector(".onair-sub").textContent = g ? `${p.toLocaleString()} plays left` : "Plays off"), Cn && (Cn.hidden = Se !== "off" && Se !== "free", Cn.classList.toggle("is-free", Se === "free"), Se === "free" ? (Cn.querySelector(".nudge-t").textContent = "You’re on the free player", Cn.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", Cn.querySelector("button").textContent = "Get a player") : Se === "off" && (Cn.querySelector(".nudge-t").textContent = ne, Cn.querySelector(".nudge-s").textContent = B(l) && l.step === "intro" ? $C : "Until then you hear the first 30 seconds of each song.", Cn.querySelector("button").textContent = Aa[l.step] ?? "Start"));
  }
  let b = "";
  function k(l) {
    const p = C("div", "", "ppp-pick");
    l.funderMultiple && l.returnToKind === "funder" && p.append(C("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), l.returnToKind === "funder" && p.append(C("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const g = C("input");
    g.type = "text", g.placeholder = "SP… address to send returns to", g.autocomplete = "off", g.spellcheck = !1, g.setAttribute("aria-label", "Address to return funds to"), g.value = b, g.oninput = () => {
      b = g.value;
    };
    const f = $e(l.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      c.setReturnAddress(g.value), b = "";
    }, "tiny");
    return p.append(g, " ", f), l.returnToKind === "chosen" && p.append(" ", $e("Back to the funder", () => c.clearReturnAddress(), "tiny")), p;
  }
  const K = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function te() {
    const l = C("p", K + " ", "ppp-mute");
    return l.append(Ve("Xverse", "https://www.xverse.app/download"), " · ", Ve("Leather", "https://leather.io/install-extension")), l;
  }
  let Be = "";
  const q = (l) => {
    const p = document.documentElement, g = l.solo && !l.main ? l.listening ? We(l.listening) : "new" : "", f = xI() ? "1" : "", F = l.standIn && !l.mainConnected ? ht(l.standIn) : "";
    `${g}|${f}|${F}` !== Be && (Be = `${g}|${f}|${F}`, g ? p.dataset.pppSolo = g : delete p.dataset.pppSolo, F ? p.dataset.pppAs = F : delete p.dataset.pppAs, f ? p.dataset.pppWalletInstalled = f : delete p.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const l of [1500, 4e3, 9e3]) setTimeout(() => Te(c.snapshot()), l);
  function ke(l, p = "") {
    const g = C("div", "", "ppp-topup"), f = xe(l);
    g.append(C("span", "Add plays from My player: ", "ppp-mute"));
    for (const F of dl) {
      const ne = $e(`+${F.toLocaleString()}`, () => void c.topUpAlbum(F), p);
      ne.disabled = f === void 0 || f < F || l.depositPending || !!l.busy, g.append(ne);
    }
    return f !== void 0 && f < dl[0] && g.append(C("p", "My player needs plays first (switch to My player above).", "ppp-mute")), g;
  }
  const xe = (l) => {
    var f;
    const p = (f = l.likeFunds) == null ? void 0 : f.balance;
    if (p === void 0 || !l.playCost) return;
    const g = p - an - 6000n;
    return g > 0n ? Number(g / l.playCost) : 0;
  };
  function Me(l) {
    const p = l.likeFunds;
    if (!p || !p.album || !p.low && !p.pending) return [];
    if (p.low || (Le = !1), p.low && !Le) return [];
    const g = C("div", "", "ppp-pick ppp-lowbox");
    if (!p.low) {
      if (!p.txid) return [];
      const F = C("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return p.txid && F.append(Ve("View", _t(p.txid))), g.append(F), [g];
    }
    g.append(C("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), g.append(C("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), g.append(C("p", p.address, "ppp-addr-full"));
    const f = C("div", "", "ppp-open-row");
    if (f.append(gr("copy-likes-address", "Copy address", () => p.address, "primary", () => Te(c.snapshot()))), p.main && !l.solo) {
      const F = Po - (p.balance ?? 0n);
      F > 0n && f.append(Ao(l, `Pay ${jr(F)} STX from my wallet`, () => void c.topUpLikes(), "primary"));
    }
    return g.append(f), g.append(C("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [g];
  }
  const tt = (l) => {
    const p = C("div", "", "ppp-wait");
    p.dataset.since = String(l.since), p.dataset.grace = String(l.graceMs), p.setAttribute("role", "progressbar"), p.setAttribute("aria-label", "Your plays are arriving");
    const g = C("p", "", "ppp-wait-t"), f = C("div", "", "ppp-wait-track");
    return f.append(C("div", "", "ppp-wait-fill")), p.append(g, f), x(p), p;
  };
  function x(l) {
    const p = Number(l.dataset.since), g = Number(l.dataset.grace) || 6e4, f = Math.max(0, Date.now() - p), F = l.querySelector(".ppp-wait-fill"), ne = l.querySelector(".ppp-wait-t");
    if (f < g) {
      const Se = Math.ceil((g - f) / 1e3);
      F.style.width = Math.max(4, Math.min(95, f / g * 100)).toFixed(0) + "%", ne.textContent = `Loading your plays · ${Se}s`, l.classList.remove("is-long"), l.setAttribute("aria-valuenow", String(Math.round(f / g * 100)));
    } else
      F.style.width = "", ne.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", l.classList.add("is-long"), l.removeAttribute("aria-valuenow");
  }
  let M = 0;
  setInterval(() => {
    const l = document.querySelectorAll(".ppp-wait");
    if (!l.length) {
      M = 0;
      return;
    }
    l.forEach(x), ++M % 10 === 0 && Te(c.snapshot());
  }, 1e3);
  let G = null;
  function be(l) {
    if (l.step === "loading" && G !== null) return;
    const g = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(l.step) || !!l.busy || l.armed || !!v.pendingCode() && !["ready", "fund", "over"].includes(l.step);
    g !== G && (G = g, g ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function Te(l) {
    var sp, ip, ap, cp, lp, up, dp, fp, hp, pp, gp, yp, wp, mp, bp, xp, Sp, vp;
    if (m.sync(), hn && ["ready", "fund", "over"].includes(l.step) && !l.busy) {
      const Z = hn;
      hn = null, l.root === Z.root && l.slot !== Z.slot && c.openAlbum(Z.slot);
    }
    const p = v.inProgress(l), g = Ge(l), f = p && l.step === "fund" ? { ...l, depositPending: !0 } : g !== null ? { ...l, depositPending: !0, arrival: { since: g, graceMs: Fl } } : l, F = f.error === jl;
    if (Wn(), $n(l), ue(l), on = mo(l), se(l, f), be(f), q(f), !p && v.inProgress(l)) return;
    if (Pr(f), Ps(f), Li(f), _s(f), t && n && (n.hidden = !["off", "elsewhere", "loading"].includes(f.step), n.textContent = f.step === "loading" || !f.gate ? T.on ? IC : "Checking your listening wallet…" : T.on ? "Xtrata Music is unavailable here. Reload to check again." : "Paid radio is unavailable. Reload to check again."), e.hidden = f.step === "off", e.hidden) {
      Fe(f, !1);
      return;
    }
    const [ne, Se] = vo(f), pe = s(".ppp-state");
    pe.textContent = ne, pe.className = "ppp-state" + (Se ? " ppp-state--" + Se : ""), pe.hidden = !ne;
    const Je = !!f.busy || f.armed, Pt = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(f.step) && (Je || !["intro", "loading"].includes(f.step));
    o.hidden = !Pt, o.classList.toggle("ppp-frame--rest", !Je && !Zn);
    const pt = s(".ppp-frame-label");
    pt.hidden = !0;
    const qe = yI(f) ?? Sr;
    Sr = qe;
    const Ue = "xtrata.radio.ppp.heard.v1", Ie = (() => {
      try {
        return localStorage.getItem(Ue) === "1";
      } catch {
        return !1;
      }
    })();
    if (!Ie && f.entries.some((Z) => Z.kind === "play"))
      try {
        localStorage.setItem(Ue, "1");
      } catch {
      }
    const It = Ie || f.slot > 0 && ((((sp = f.likeFunds) == null ? void 0 : sp.balance) ?? 0n) > 0n || P.count() > 1), Gt = B(f), tr = !Gt && mI({ ...f, heard: It }, qe);
    s(".ppp-badge").hidden = !tr;
    const Ko = s(".ppp-steps"), Io = s(".ppp-stage");
    Ko.hidden = Io.hidden = !tr, qe && tr && (Ko.replaceChildren(...Af(f.solo).map((Z, de) => {
      const Ke = C("li", "", de < qe.at ? "done" : de === qe.at ? qe.blocked ? "now blocked" : "now" : "");
      return Ke.append(C("span", de < qe.at ? "✓" : String(de + 1), "n"), Z), de === qe.at && Ke.setAttribute("aria-current", "step"), Ke;
    })), Io.textContent = qe.caption, Io.className = "ppp-stage " + (qe.at >= Af(f.solo).length ? "ppp-ok" : qe.blocked ? "ppp-bad" : "ppp-cyan"));
    const Ci = s(".ppp-facts"), nr = [];
    f.main && ((ip = f.gate) != null && ip.here) && !f.solo && nr.push(...Ln("Your wallet", ht(f.main), "ppp-addr-short"));
    const ka = () => {
      if (!f.listening) return;
      const Z = gr("copy-listening", "Copy", () => f.listening || "", "tiny", () => Te(c.snapshot()));
      nr.push(...Ln(f.slot > 0 ? "Album wallet" : f.linked ? "My player (technical)" : "My player wallet", We(f.listening), "ppp-addr-short", Z));
    };
    if (f.linked || ka(), f.listening && f.step !== "intro")
      if (f.linked)
        nr.push(...Ln("Credited to", `${ht(f.linked)} · plays, likes and returns`, f.linked === f.main || f.solo ? "ppp-ok" : "ppp-warn")), ka();
      else if (f.solo) {
        f.creditedTo && nr.push(...Ln("Credited to", `${ht(f.creditedTo)} · plays and likes`, "ppp-ok"));
        const Z = f.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : f.returnTo ? `${ht(f.returnTo)} · ${f.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : f.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        nr.push(...Ln("Returns go to", f.gift ? Z : f.returnTo && !gn(f.returnTo) ? Z.replace(We(f.returnTo), f.returnTo) : Z, f.returnTo && !f.gift ? "ppp-addr-full" : "ppp-mute"));
      } else nr.push(...Ln("Linked to", "not linked yet", "ppp-warn"));
    if (f.linkedListening.length && ((ap = f.gate) != null && ap.here)) {
      const Z = f.linkedListening.map((de) => We(de) + (de === f.listening ? " (this one)" : "")).join(", ");
      nr.push(...Ln(f.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", Z, "ppp-addr-short"));
    }
    if (f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step)) {
      const Z = f.step === "fund" && f.depositPending ? "ppp-mute" : f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      nr.push(...Ln("Balance", `${jr(f.balance)} STX · about ${f.playsLeft.toLocaleString()} plays`, Z));
    }
    const Vo = f.entries.find((Z) => Z.kind === "play");
    Vo && In(), Vo && nr.push(...Ln("Last paid song", `${So(Vo)} → ${ht(Vo.recipient)}`, ki[Vo.status] || "")), Ci.replaceChildren(...nr), Ci.hidden = !nr.length;
    const Oe = [], kt = [], Bt = [], On = [], Xo = jn(BigInt(((cp = f.gate) == null ? void 0 : cp.limits.playFee) ?? "300")), Qh = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${jr(Hl)} STX to the song holder, plus a ${jr(Xo - Hl)} STX network fee.`, ep = !!f.busy;
    switch (f.step) {
      case "elsewhere": {
        if (Oe.push(C("p", "Pay artists as you listen.")), (lp = f.gate) != null && lp.radioUrl) {
          const de = C("p");
          de.append(Ve("Open the pay-per-play radio →", f.gate.radioUrl)), Oe.push(de);
        }
        kt.push(C("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (f.linked) {
          const de = [f.linked, ...f.others];
          Oe.push(C("p", de.length > 1 ? `This device has listening wallets for ${bo(de)}.` : `This device has a listening wallet for ${ht(f.linked)}.`)), kt.push(C("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), de.slice(0, 3).forEach((Ke, vt) => Bt.push($e(`Open ${ht(Ke)}`, () => Ns(Ke), vt === 0 ? "primary" : "")));
        } else
          Oe.push(C("p", "Connect your wallet to pay artists as you listen.")), kt.push(C("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        Oe.push(C("p", `This device's listening wallet belongs to ${ht(f.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), kt.push(C("p", `You are connected as ${ht(f.main)}. Switch to the linked wallet to continue listening.`)), kt.push(C("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), Bt.push($e("Switch wallet", vr, "primary"));
        break;
      case "not-invited":
        Oe.push(C("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        Oe.push(C("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        Oe.push(C("p", "Every play counts for the song’s owner, on-chain.")), kt.push(C("p", Qh)), kt.push(C("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), kt.push(C("p", f.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !f.solo && f.main && f.others.length ? (Oe.push(C("p", `This device already has a listening wallet for ${bo(f.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), kt.push(C("p", `Otherwise, set up a new listening wallet for ${ht(f.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !f.solo && f.main && kt.push(C("p", `This is the listening wallet for ${ht(f.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), f.solo && kt.push(C("p", "Already have a Stacks wallet? Connect it first (the Connect button at the bottom of this page) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const Z = v.liveGift();
        Bt.push($e(Z ? "Claim my gift · no wallet needed" : f.solo ? "Start listening · no wallet needed" : f.others.length && f.main ? `Set up for ${ht(f.main)}` : "Start listening", () => void c.create(w.claiming() ? { another: !0 } : void 0), "primary")), !Z && !f.solo && f.main && f.others.length && Bt.push($e("Switch wallet", vr)), !Z && f.solo && Bt.push($e("I have a Stacks wallet", vr)), Bt.push($e("I already have a listening wallet", () => void c.unlock(!0))), Z && Bt.push($e("Not now", () => v.setAside(), "quiet"));
        break;
      case "locked":
        f.armed || (Oe.push(C("p", "Locked.", "ppp-mute")), Bt.push($e("Unlock", () => void c.unlock(), "primary"))), f.standIn ? On.push($e("Use a different listening wallet", () => void $i().then((de) => {
          de === "stacks" && vr();
        }), "quiet")) : On.push($e("Use a different listening wallet", () => void c.unlock(!0), "quiet"));
        break;
      case "link":
        Oe.push(C("p", `Link to ${ht(f.main)} · free`)), kt.push(C("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), kt.push(C("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), Bt.push($e(f.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void c.link(), "primary"));
        break;
      case "loading":
        Oe.push(C("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (f.depositPending ? f.arrival && Oe.push(tt(f.arrival)) : Tt(f) ? Oe.push(C("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (up = f.gift) != null && up.player ? Oe.push(C("p", "Out of plays · add more to keep listening", "ppp-bad")) : f.entries.length ? Oe.push(C("p", "No plays left · add plays to keep counting", "ppp-bad")) : Oe.push(C("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / Xo)).toLocaleString()} plays`)), f.entries.length && kt.push(C("p", "Playback is paused until your top-up confirms.")), f.payingOn && !f.entries.length && kt.push(C("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), p ? kt.push(C("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : f.depositPending ? kt.push(C("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : f.solo ? (kt.push(C("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), kt.push(C("p", f.listening || "", "ppp-addr-full")), f.listening && !f.depositPending && Bt.push(gr("copy-address", "Copy my address", () => f.listening || "", "primary", () => Te(c.snapshot())))) : kt.push(C("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), f.depositPending && f.depositTxid) {
          const de = C("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          de.append(Ve("View", _t(f.depositTxid))), Oe.push(de);
        } else f.allowance > 0n && !f.solo && !f.depositPending && Bt.push(Ao(f, `Deposit ${jr(f.allowance)} STX from my wallet`, () => void c.deposit(), "primary"));
        break;
      }
      case "over":
        Oe.push(C("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), f.phrase && (Oe.push(C("p", "Or back up your player. With its 24 words written down it can hold more, because a lost passkey is no longer lost money.", "ppp-mute")), Bt.push($e("Back up my player · 24 words", () => void c.backup(), ""))), f.solo && !f.returnTo && (Oe.push(C("p", f.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), Oe.push(k(f))), (!f.solo || f.returnTo) && Bt.push($e("Return excess", () => void c.returnFunds("excess"), "primary"), $e("Return all", () => void c.returnFunds("all")));
        break;
      case "ready":
        if (f.payingOn && f.session && f.session.playsLeft > 0 && ((dp = f.giftStop) == null ? void 0 : dp.reason) !== "off") {
          const de = Math.min(f.session.playsLeft, f.playsLeft);
          Oe.push(C("p", `${de.toLocaleString()} plays left`, "ppp-ok")), kt.push(C("p", Qh + " The heart likes or unlikes from this wallet for 0.0003 STX.")), Bt.push($e("Switch off", () => void c.switchOff()));
        } else
          Oe.push(C("p", "Switch on music support to listen.", "ppp-mute")), Bt.push($e("Switch plays on", () => void c.switchOn(), "primary"));
        f.queued && Oe.push(C("p", f.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${f.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), f.balanceState === "low" && Oe.push(C("p", "Running low on plays", "ppp-warn")), f.aboveTarget && Oe.push(C("p", "More than 1 STX here · backed up ✓ This player pays from this page as you listen, so keep larger amounts in your main wallet.", "ppp-mute")), f.depositPending ? Oe.push(C("p", "Plays on their way…", "ppp-warn")) : f.allowance > 0n && f.balanceState !== "ok" && !f.solo && Bt.push(Ao(f, `Top up ${jr(f.allowance)} STX`, () => void c.deposit()));
        break;
    }
    if (f.solo && f.listening && !f.depositPending) {
      const Z = f.step === "fund", de = f.step === "ready" && (f.balanceState === "low" || !!f.gift && f.giftPlays <= 20);
      Z ? Bt.unshift($e("Add plays", () => Ee(), "primary")) : de ? Bt.push($e("Add plays", () => Ee(), "primary")) : f.step === "ready" && On.push($e("Add plays", () => Ee(), "quiet"));
    }
    if (f.solo && f.walletCannotSolo && kt.push(C("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), f.solo && ["fund", "ready"].includes(f.step) && ((f.balance ?? 0n) > 0n && f.slot === 0 && kt.push(k(f)), kt.push(te()), f.slot === 0 && f.step === "ready" && f.entries.some((Z) => Z.kind === "play" && Z.status === "confirmed"))) {
      const Z = C("p", "New to Stacks? ", "ppp-mute");
      Z.append(Ve("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), Oe.push(Z);
    }
    if (f.walletOutdated && kt.push(C("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), f.stuck && (Oe.push(C("p", f.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${f.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), Bt.push($e("Clear stuck payments", () => void c.clearStuck()))), ["ready", "fund"].includes(f.step) && (f.returnTo || f.gift) && (f.balance ?? 0n) > 0n && On.push($e(f.linked ? "Return all to my wallet" : f.gift ? "Return what is left…" : `Return all to ${ht(f.returnTo)}`, () => void c.returnFunds("all"), "quiet")), f.slot > 0 && ((fp = f.gift) != null && fp.player) && ["ready", "fund"].includes(f.step) && f.giftPlays > 20 && On.push(ke(f, "quiet")), f.phrase && ["ready", "fund", "over"].includes(f.step) && On.push($e(f.backedUp ? "Show my 24 backup words again" : "Back up my player · 24 words", () => void c.backup(), "quiet")), ["ready", "fund", "link", "over"].includes(f.step) && On.push($e("Lock", () => void c.lock(), "quiet")), Pt && !Je && On.push($e(Zn ? "Hide listening wallet box" : "Show listening wallet box", () => {
      Zn = !Zn, Te(c.snapshot());
    }, "quiet")), [...Bt, ...On].forEach((Z) => Z.disabled = ep), ep && (Bt.length = 0), !Gt && f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step) && !(f.step === "fund" && f.depositPending && f.balance === 0n) && !((hp = f.gift) != null && hp.player)) {
      const Z = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad", de = Oe.at(0);
      f.step === "ready" && de ? de.append(C("span", ` · ${St(f.balance)} STX`, Z)) : Oe.push(C("p", `Balance ${St(f.balance)} STX`, Z));
    }
    if (Gt) {
      for (const Ke of [...Bt, ...On]) {
        const vt = vC[Ke.textContent ?? ""];
        vt && (Ke.textContent = vt);
      }
      for (let Ke = Oe.length - 1; Ke >= 0; Ke--) yy(Oe[Ke].textContent) && kt.unshift(...Oe.splice(Ke, 1));
      for (let Ke = Bt.length - 1; Ke >= 0; Ke--) yy(Bt[Ke].textContent) && On.unshift(...Bt.splice(Ke, 1));
      const Z = f.entries.some((Ke) => Ke.kind === "play"), de = kC(f.step, { played: Z, arriving: f.depositPending });
      de.length && Oe.length && de.shift(), Oe.push(...de.map((Ke) => C("p", Ke, "ppp-mute")));
    }
    if ((pp = f.gift) != null && pp.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(f.step)) {
      const Z = C("p", "", "ppp-gift");
      Z.append(`💿 Album · ${f.gift.player.title}`), f.gift.player.subtitle && Z.append(" · ", f.gift.player.subtitle);
      const de = ["ready", "fund", "over"].includes(f.step) && f.balance !== void 0 ? f.giftPlays === 0 && f.depositPending ? C("span", " · plays on their way", "ppp-warn") : C("span", f.giftPlays === 0 ? " · no plays left" : ` · ${f.giftPlays.toLocaleString()} ${f.giftPlays === 1 ? "play" : "plays"} left`, f.giftPlays === 0 ? "ppp-bad" : f.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      de && Z.append(de);
      const Ke = (gp = Oe.at(0)) == null ? void 0 : gp.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (f.step === "ready" && Ke && /STX/.test(Ke.textContent ?? "") && Ke.remove(), Oe.unshift(Z), f.giftPlays <= 20 && ["ready", "fund"].includes(f.step) && !f.depositPending)
        if (f.slot > 0)
          Oe.splice(1, 0, C("p", f.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), ke(f, "primary"));
        else {
          const vt = C("p", f.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          vt.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), vt.append(Ve("Xverse", "https://www.xverse.app/download"), " and ", Ve("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), Oe.splice(1, 0, vt);
        }
    }
    if (f.gift && !f.linked && ["fund", "ready", "over"].includes(f.step) && f.returnPlan.state === "ready") {
      const Z = f.returnPlan, de = C("div", "", "ppp-pick");
      de.append(C("p", Z.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const Ke = C("ul", "", "ppp-gift-list");
      Z.steps.forEach((vt, Or) => {
        const cr = vt.kind === "gift" ? "the unused gift" : vt.kind === "deposit" ? "what was added to it" : "the rest", Tn = C("li");
        Tn.append(C("span", `${Or + 1}. ${jr(BigInt(vt.send))} STX · ${cr}`, "t"), C("span", vt.to ? ` → ${ht(vt.to)}` : " → choose an address below", vt.to ? "ppp-mute" : "ppp-warn")), Ke.append(Tn);
      }), de.append(Ke), Z.kept && de.append(C("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), Z.steps.some((vt) => !vt.to) && de.append(k(f)), de.append($e(Z.steps.length > 1 ? `Confirm part 1 of ${Z.steps.length}` : "Confirm and return", () => void c.returnFunds("all"), "primary")), Oe.push(de);
    }
    const qo = Ur(f), Lo = X ? qo : null, Ti = le(f, !!Lo), d1 = Ti === "gift" || Ti === "arriving" || Ti === "new", Eu = Lo ? null : w.lines(l), ku = Eu && !w.claiming() ? Eu : [...Eu ?? [], ...v.banner(l, { bare: !!Lo || Ti === "gift" || Ti === "arriving" })], bc = _r && (v.pendingCode() || ["intro", "locked", "unsupported"].includes(f.step)) ? Ts(_r, v.pendingCode()) : [];
    Lo || (Oe.unshift(...ku), Oe.push(...Me(f)), Oe.unshift(...bc)), f.solo && f.creditedTo && f.listening && !["intro", "off", "elsewhere", "loading"].includes(f.step) && Oe.unshift(C("p", `This is ${ht(f.creditedTo)}'s listening wallet. Plays and likes count for ${ht(f.creditedTo)}. Connect its Stacks wallet (the button at the bottom of this page) to see its likes here too.`, "ppp-ok")), s(".ppp-key").replaceChildren(...Oe);
    const $u = document.querySelector(".ppp-switch");
    if ($u) {
      const Z = P.latest(), de = f.slot > 0, Ke = ["fund", "ready", "over"].includes(f.step) && (de || !!Z);
      if ($u.hidden = !Ke, Ke) {
        const vt = (Tn, xc, Sc, Mu) => {
          const _i = $e("", Mu, "ppp-tab");
          return _i.setAttribute("aria-pressed", String(Sc)), _i.append(C("span", Tn, "tt"), C("span", xc === void 0 ? "…" : `${ft(xc).toLocaleString()} plays`, "ts")), _i.disabled = !!f.busy, _i;
        }, Or = de ? ((wp = (yp = f.gift) == null ? void 0 : yp.player) == null ? void 0 : wp.title) ?? "Album" : Z.title, cr = $e("View all albums" + (P.count() > 1 ? ` (${P.count()})` : ""), () => {
          if (wn()) {
            window.dispatchEvent(new CustomEvent("xtrata:radio-browse", { detail: { tab: "albums" } }));
            return;
          }
          const Tn = document.querySelector(".ppp-shelf");
          Tn && (Tn.hidden = !1, Tn.open = !Tn.open, cr.setAttribute("aria-expanded", String(Tn.open)), Tn.open && requestAnimationFrame(() => Tn.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        cr.setAttribute("aria-expanded", String(!!((mp = document.querySelector(".ppp-shelf")) != null && mp.open))), $u.replaceChildren(
          vt("🎧 My player", de ? (bp = f.likeFunds) == null ? void 0 : bp.balance : f.balance, !de, () => {
            de && c.openAlbum(0);
          }),
          vt("💿 " + Or, de ? f.balance : void 0, de, () => {
            !de && Z && c.openAlbum(Z.slot);
          }),
          cr
        );
      }
    }
    const Yo = P.render(f), Bi = document.querySelector(".ppp-shelf"), Mi = wn() ? document.getElementById("shelfBox") : null;
    if (Mi)
      P.count() > 6 ? Mi.dataset.many = "1" : delete Mi.dataset.many, Yo ? Mi.firstChild !== Yo && Mi.replaceChildren(Yo) : Mi.replaceChildren(), Bi && (Bi.hidden = !0), U(!!Yo);
    else if (Bi) {
      Bi.hidden = !Yo;
      const Z = Bi.querySelector("summary");
      Z && (Z.textContent = P.count() > 0 ? `♪ My albums (${P.count()})` : "♪ My albums");
      const de = Bi.querySelector(".ppp-shelf-body");
      Yo && de && !de.contains(Yo) && de.replaceChildren(Yo);
    }
    const $a = v.renderFold(l);
    if (s(".ppp-gifts").hidden = !$a, $a && !s(".ppp-gift-body").contains($a) && s(".ppp-gift-body").replaceChildren($a), $a && jo) {
      jo = !1;
      const Z = s(".ppp-gifts");
      Z.open = !0, requestAnimationFrame(() => Z.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    const Iu = document.querySelector("#ppp .ppp-featured");
    if (Iu) {
      const Z = L(), de = m.manage(), Ke = (Z.length > 0 || !!de) && f.slot === 0 && !((xp = f.gift) != null && xp.player) && f.step === "ready";
      Iu.hidden = !Ke, Ke && Iu.replaceChildren(...Z.length ? [C("p", "Albums in your player", "ppp-featured__h")] : [], ...Z.map((vt) => {
        const Or = (kn == null ? void 0 : kn.id) === vt.id, cr = $e("", () => pn(Or ? null : vt, !Or), "ppp-featured__a" + (Or ? " is-on" : "")), Tn = Xr(vt).length;
        return cr.append(C("b", vt.title), C("span", Or ? "Playing now · tap to go back to the radio" : `${vt.subtitle ? vt.subtitle + " · " : ""}${Tn} ${Tn === 1 ? "song" : "songs"}`)), cr.setAttribute("aria-pressed", String(Or)), cr.disabled = !!f.busy, cr;
      }), ...de ? [de] : []);
    }
    const Lu = document.querySelector("#ppp .ppp-release-in-slot");
    if (Lu) {
      const Z = ["off", "elsewhere", "unsupported"].includes(f.step) ? [] : m.banner();
      Lu.hidden = !Z.length, Lu.replaceChildren(...Z);
    }
    const Ni = document.querySelector("#ppp .ppp-release");
    if (Ni) {
      const Z = ["off", "elsewhere", "unsupported"].includes(f.step) ? null : m.fold();
      if (Ni.hidden = !Z, Z) {
        const de = document.activeElement instanceof HTMLElement && Ni.contains(document.activeElement) ? document.activeElement : null, Ke = ((Sp = Ni.querySelector(".ppp-release-songs")) == null ? void 0 : Sp.scrollTop) ?? 0;
        (vp = Ni.querySelector(".ppp-release-body")) == null || vp.replaceChildren(...Z);
        const vt = Ni.querySelector(".ppp-release-songs");
        vt && Ke && (vt.scrollTop = Ke), de && de.isConnected && document.activeElement !== de && de.focus({ preventScroll: !0 });
      }
    }
    wc(f);
    const Cu = document.querySelector("#ppp .ppp-yours");
    if (Cu) {
      const Z = f.solo && !!f.listening && f.slot === 0 && ["fund", "ready"].includes(f.step);
      Cu.hidden = !Z;
      const de = Cu.querySelector(".ppp-yours-body");
      if (Z && de && de.getAttribute("data-for") !== f.listening) {
        de.setAttribute("data-for", f.listening);
        const Ke = (Mu, ..._i) => {
          const Ap = C("details", "", "ppp-yours-item");
          return Ap.append(C("summary", Mu), ..._i), Ap;
        }, vt = C("p", "Your player is a real account on Stacks, the network built on Bitcoin that Xtrata runs on. Right now it is known by a long code. A ");
        vt.append(C("b", ".btc name"), " (for example yourname.btc) is a name you own on that network. Give your player one and your plays, likes and station show under that name everywhere on Xtrata.");
        const Or = C("p", "Names are registered at BNS One. You need a little STX and a Stacks wallet to buy one; then send the name to your player using the code below.", "ppp-mute"), cr = C("p");
        cr.append(Ve("Find a name at BNS One →", "https://bns.one"));
        const Tn = C("p", "Already have a Stacks wallet with a name (Xverse or Leather)? Connect it (the button at the bottom of this page) and link this player to it. The player stays on this device and keeps its plays; everything it does is then credited to your name, like a second device on one account."), xc = C("p", "Know someone who loves music? When there is a giveaway on, send them the page and they can claim a free player of their own."), Sc = C("p");
        Sc.append(Ve("See the giveaway →", "https://xtrata.xyz/giveaway")), de.replaceChildren(
          Ke("Give your player a name", vt, Or, C("p", f.listening, "ppp-addr-full"), gr("copy-yours-address", "Copy my player’s code", () => c.snapshot().listening || "", "tiny", () => Te(c.snapshot())), cr),
          Ke("Link it to a wallet you already have", Tn),
          Ke("Bring a friend in", xc, Sc)
        );
      }
    }
    s(".ppp-body").replaceChildren(...kt), s(".ppp-actions").replaceChildren(...Bt), s(".ppp-actions2").replaceChildren(...On);
    const Tu = f.busy || f.message || "", tp = s(".ppp-msg"), Bu = Tu && Oe.some((Z) => (Z.textContent ?? "").startsWith(Tu.replace(/[.✓\s]+$/, ""))) ? "" : Tu, np = !Bu && !f.error ? f.notice : F && !Bu ? f.error : "";
    tp.textContent = Bu || np, tp.classList.toggle("is-warn", !!np), s(".ppp-err").textContent = F ? "" : f.error;
    const f1 = f.entries.filter((Z) => Z.kind === "play");
    s(".ppp-recent").hidden = !f.entries.length, s(".ppp-recent-list").replaceChildren(...f1.slice(0, 5).map((Z) => {
      const de = C("li"), Ke = Z.status === "confirmed" ? "ok" : Z.status === "failed" ? "bad" : "warn";
      return de.append(C("span", "", "d " + Ke), C("span", So(Z), "t"), C("span", yt(Z.created), "ppp-mute")), Z.txid && de.append(Ve("tx", _t(Z.txid))), de;
    })), yc(f), s(".ppp-wallets").hidden = !(Ci.childElementCount || On.length), s(".ppp-more").hidden = !kt.length;
    const rp = s(".ppp-history");
    rp.hidden = !f.entries.length, f.entries.length && In(), rp.replaceChildren(C("summary", `All activity (${f.entries.length})`), ...f.entries.slice(0, 20).map((Z) => {
      const de = C("div", "", "ppp-row"), Ke = Z.kind === "play" ? [C("span", So(Z), "ppp-song"), C("span", ` · ${jr(BigInt(Z.amount))} STX to ${ht(Z.recipient)}`, "ppp-mute")] : Z.kind === "like" ? [C("span", `${Z.liked ? "♥ Liked" : "Unliked"} ${So(Z)}`, "ppp-song"), C("span", ` · for ${f.linked ? ht(f.linked) : "this listening wallet"}`, "ppp-mute")] : [C("span", `Returned ${jr(BigInt(Z.amount))} STX`, "ppp-song"), C("span", ` to ${ht(Z.recipient)}`, "ppp-mute")];
      return de.append(
        C("span", Bs[Z.status] || Z.status, "ppp-status " + (ki[Z.status] || "")),
        ...Ke,
        C("span", ` · ${new Date(Z.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), Z.txid && de.append(Ve("tx ↗", _t(Z.txid))), de;
    })), Y == null || Y.render(Lo ? Us(f, Lo, [...bc, ...ku]) : null), Fe(f, !!Lo, d1 ? [...bc, ...ku] : bc, Ti), Go(f, !!Lo || !!(Ct != null && Ct.showing())), mc(f, Lo), je.isOpen() && je.refresh(), Yh();
    const op = (qo == null ? void 0 : qo.mode) === "open" ? null : Rt(f);
    Ye == null || Ye.render((qo == null ? void 0 : qo.mode) === "open" ? Us(f, qo, []) : op ? { ...Us(f, { mode: "open", player: op }, []), plays: f.balance === void 0 ? null : f.playsLeft } : null);
  }
  function wn() {
    const l = document.documentElement;
    return l.hasAttribute("data-skin") && !l.hasAttribute("data-view") && !!document.getElementById("shelfBox");
  }
  function Ur(l) {
    var f;
    if (["off", "elsewhere", "not-invited"].includes(l.step)) return null;
    if (l.slot > 0 && ((f = l.gift) != null && f.player) && ["fund", "ready", "over", "link", "loading"].includes(l.step))
      return l.root && Yn({ root: l.root, slot: l.slot, player: l.gift.player }), { mode: "open", player: l.gift.player };
    const p = v.incomingAlbum();
    if (p) return { mode: "arrive", player: p.player, from: p.from, offered: p.plays };
    const g = zt();
    return g && (l.step === "locked" || hn && l.step === "loading") ? { mode: "locked", player: g.player } : null;
  }
  const Un = (l, p, g, f, F) => `/awards/${l.id}#${new URLSearchParams({ n: String(p), a: g, ...F ? { b: F } : {}, p: String(f), s: by(Og, p, g) })}`;
  function gc(l) {
    const p = l.award;
    return !p || !["ready", "fund", "over", "link"].includes(l.step) ? null : p.claimTx ? j ? "making" : null : p.state === "claimed" ? j && p.inscription !== void 0 ? "yours" : null : p.state !== "ready" || ye || l.step === "link" && W !== "have" ? null : W === "making" || W === "yours" ? "ready" : W;
  }
  function Go(l, p) {
    if (!_) return;
    const g = l.award, f = g != null && g.cls && Jc(g.cls) ? Vs(g.cls) : null, F = l.slot === 0 ? l.listening : l.root, ne = p || !g || !f || !F || g.number === void 0 ? null : gc(l);
    if (!ne || !g || !f || !F) {
      _.render(null, p);
      return;
    }
    ne === "have" && l.linked && !ce && (ce = !0, c.awardRefresh());
    const Se = typeof g.name == "string" && g.name ? g.name : null, pe = [];
    l.error && pe.push(C("p", l.error, "ppp-warn"));
    const Je = (Pt) => {
      W = Pt, Pt === "name" && (j = !0), Te(c.snapshot());
    };
    _.render({
      screen: ne,
      tier: f,
      number: g.number,
      need: g.need ?? 0,
      player: F,
      name: g.name,
      inscription: g.inscription,
      art: ne === "yours" && g.inscription !== void 0 ? `/i/${g.inscription}` : Un(f, g.number, F, g.need ?? 0, Se),
      claimLink: g.claimTx ? _t(g.claimTx) : void 0,
      status: pe,
      asking: !!l.busy || l.armed,
      busy: !!l.busy,
      main: l.main ? ht(l.main) : null,
      canLink: l.step === "link",
      linked: !!l.linked,
      copyAddress: () => gr("award-player-address", "Copy my player’s address", () => F, "tiny", () => Te(c.snapshot())),
      go: Je,
      claim: (Pt) => {
        j = !0, c.claimAward(Pt);
      },
      refresh: () => void c.awardRefresh(),
      connect: () => {
        var Pt;
        return (Pt = document.getElementById("radio-wallet-connect")) == null ? void 0 : Pt.click();
      },
      link: () => void c.link(),
      later: () => {
        ye = !0;
        try {
          localStorage.setItem(N, String(Date.now()));
        } catch {
        }
        Te(c.snapshot());
      },
      done: () => {
        j = !1, W = "ready", Te(c.snapshot());
      }
    }, p);
  }
  function yc(l) {
    const p = document.querySelector("#ppp .ppp-paid");
    if (!p) return;
    const g = document.documentElement, f = l.entries.filter((pe) => pe.kind === "play" && !["failed", "cancelled"].includes(pe.status)), F = g.hasAttribute("data-skin") && !g.hasAttribute("data-view") && f.length > 0;
    if (Jt = F, p.hidden = !F, !F) {
      p.replaceChildren();
      return;
    }
    In();
    const ne = C("ol");
    for (const pe of f.slice(0, ut ? Nr : Mr)) {
      const { title: Je, artist: Pt } = Ro(pe.song, pe), pt = Je || `Song #${pe.song}`, qe = C("li", "", "ppp-paid__row"), Ue = C("span", "", "ppp-paid__art"), Ie = Kl(String(pe.song));
      if (Ie) {
        const Gt = document.createElement("img");
        Gt.src = Ie, Gt.alt = "", Gt.decoding = "async", Ue.append(Gt);
      } else
        Ue.textContent = "♪", Ue.setAttribute("aria-hidden", "true");
      const It = C("span", "", "ppp-paid__t");
      if (It.append(C("b", pt), C("span", [Pt, vi(pe.created)].filter(Boolean).join(" · "))), qe.append(Ue, It), pe.status === "confirmed" && pe.txid) {
        const Gt = Ve("Receipt", _t(pe.txid));
        Gt.className = "ppp-paid__r", Gt.setAttribute("aria-label", `Receipt for ${pt}`), qe.append(Gt);
      } else qe.append(C("span", pe.status === "unknown" ? "Checking…" : "Paying…", "ppp-paid__r ppp-mute"));
      ne.append(qe);
    }
    const Se = [C("h4", "Who you have paid"), ne];
    if (f.length > Mr) {
      const pe = $e(ut ? "Show fewer" : `Show more (${Math.min(f.length, Nr) - Mr})`, () => {
        ut = !ut, Te(c.snapshot());
      }, "ppp-paid__more");
      Se.push(pe);
    }
    Se.push(C("p", "Every play pays the artist, and anyone can check it.", "ppp-paid__note")), p.replaceChildren(...Se);
  }
  function wc(l) {
    var qe;
    const p = document.querySelector("#ppp .ppp-award");
    if (!p) return;
    const g = l.award, f = l.slot === 0 ? l.listening : l.root, F = g != null && g.cls && Jc(g.cls) ? Vs(g.cls) : null, ne = !!g && !!F && !!f && ["ready", "fund", "over"].includes(l.step) && !(g.state === "unavailable" && g.number === void 0);
    if (p.hidden = !ne, !ne || !g || !F || !f) {
      p.replaceChildren();
      return;
    }
    const Se = JSON.stringify([g, f, !!l.busy]);
    if (p.getAttribute("data-sig") === Se) return;
    p.setAttribute("data-sig", Se);
    const pe = (Ue) => {
      const Ie = C("p", "", "ppp-award__h");
      return Ie.append(C("b", `${F.mark} Music Hero award`), C("span", Ue)), Ie;
    }, Je = `No. ${String(g.number ?? 0).padStart(4, "0")}`, Pt = (Ue) => {
      const Ie = C("div", "", "ppp-award__art"), It = document.createElement("iframe");
      return It.src = Ue, It.title = `${F.name} record`, It.setAttribute("sandbox", "allow-scripts"), It.setAttribute("loading", "lazy"), Ie.append(It), Ie;
    }, pt = [];
    if (g.state === "claimed") {
      if (pt.push(pe(`${F.name} record · ${Je}`)), g.inscription !== void 0 && pt.push(Pt(`/i/${g.inscription}`)), pt.push(C("p", g.holds === !1 ? "You sent this record to another wallet, so your player has gone back to plain. Whoever holds it keeps a record that still names you." : g.holds === null || g.holds === void 0 ? `Yours: Xtrata inscription #${g.inscription}.` : `Yours for good: Xtrata inscription #${g.inscription}. It gives your player its ${F.name} colours.`, g.holds === !1 ? "ppp-mute" : "ppp-ok")), g.inscription !== void 0) {
        const Ue = C("p");
        Ue.append(Ve("Open it full screen ↗", `/i/${g.inscription}`)), pt.push(Ue);
      }
      if (g.sendTx) {
        const Ue = C("p", "Your record is on its way to its new address. About a minute. ", "ppp-cyan");
        Ue.append(Ve("View", _t(g.sendTx))), pt.push(Ue);
      } else if (g.holds === !0 && g.inscription !== void 0) {
        const Ue = C("details", "", "ppp-award__send"), Ie = document.createElement("input");
        Ie.type = "text", Ie.placeholder = "SP… address to send it to", Ie.autocomplete = "off", Ie.spellcheck = !1, Ie.setAttribute("aria-label", "Address to send your record to");
        const It = $e("Send my record…", () => void c.sendAward(Ie.value), "");
        It.disabled = !!l.busy, Ue.append(
          C("summary", "Send this record to someone"),
          C("p", "It is yours to give or sell. Whoever holds it keeps a record that still names you, and your player goes back to plain without it. This cannot be undone.", "ppp-mute"),
          Ie,
          It
        ), pt.push(Ue);
      }
    } else if (g.claimTx) {
      pt.push(pe(`${F.name} record · ${Je}`));
      const Ue = C("p", "Your record is being made: written to Xtrata with your plaque on it. About a minute. ", "ppp-cyan");
      Ue.append(Ve("View", _t(g.claimTx))), pt.push(Ue);
    } else if (g.state === "ready") {
      pt.push(pe(`${F.name} record · ${Je}`));
      const Ue = typeof g.name == "string" && g.name ? g.name : null, Ie = new URLSearchParams({ n: String(g.number), a: f, ...Ue ? { b: Ue } : {}, p: String(g.need), s: by(Og, g.number, f) });
      pt.push(Pt(`/awards/${F.id}#${Ie}`)), pt.push(C("p", `Your ${F.name} record is ready. You have paid artists for ${(qe = g.need) == null ? void 0 : qe.toLocaleString()} plays: that makes you an Xtrata Music Hero.`));
      const It = C("div", "", "ppp-award__row");
      Ue ? (pt.push(C("p", `Its plaque will carry ${Ue} beside your player’s address. What is on it cannot be changed afterwards.`, "ppp-mute")), It.append($e("Claim my record", () => {
        j = !0, c.claimAward("auto");
      }, "primary"), $e("Use my address only", () => {
        j = !0, c.claimAward("none");
      }, "quiet"))) : g.name === null ? (pt.push(C("p", "Its plaque will carry your player’s address. Want a .btc name on it? Link a wallet that has one (see “Make it yours” below), then check again. What is on it cannot be changed afterwards.", "ppp-mute")), It.append($e("Claim my record", () => {
        j = !0, c.claimAward("none");
      }, "primary"), $e("Check for a name again", () => void c.awardRefresh(), "quiet"))) : (pt.push(C("p", "Could not check for a .btc name just now. Check again, or claim with your player’s address alone.", "ppp-warn")), It.append($e("Check for a name again", () => void c.awardRefresh(), "primary"), $e("Claim with my address only", () => void c.claimAward("none"), "quiet"))), It.querySelectorAll("button").forEach((Gt) => {
        Gt.disabled = !!l.busy;
      }), pt.push(It, C("p", "Free to claim: your player pays only a tiny network fee.", "ppp-mute"));
    } else if (g.state === "earning" && g.have !== void 0 && g.need) {
      pt.push(pe(`${g.have.toLocaleString()} of ${g.need.toLocaleString()} paid plays`));
      const Ue = C("div", "", "ppp-award__bar"), Ie = document.createElement("i");
      Ie.style.width = `${Math.min(100, Math.round(g.have / g.need * 100))}%`, Ue.append(Ie);
      const It = g.need - g.have;
      pt.push(Ue, C("p", `${It.toLocaleString()} more ${It === 1 ? "play" : "plays"} and your ${F.name} record is yours to claim.`, "ppp-mute"));
    } else
      pt.push(pe(`${F.name} record · ${Je}`)), pt.push(C("p", g.state === "paused" ? "Claiming is paused for a moment. Your record is safe: try again later." : g.state === "class-full" || g.state === "not-open" ? "Claiming is not open for this record right now." : "Can’t check your award right now. Your plays still count: this updates by itself.", "ppp-mute"));
    p.replaceChildren(...pt);
  }
  function mc(l, p) {
    var pe;
    const g = document.querySelector(".ppp-skin");
    if (!g) return;
    if (!p && (_ != null && _.showing()) && ((pe = l.award) != null && pe.cls) && Jc(l.award.cls) && (l.busy || l.armed)) {
      const Je = Vs(l.award.cls), Pt = C("span", "", "ppp-skin__t");
      Pt.append(C("b", `${Je.name} record · No. ${String(l.award.number ?? 0).padStart(4, "0")}`), C("span", "Xtrata Music Hero")), g.hidden = !1, g.replaceChildren(C("span", Je.mark, "ppp-skin__art ppp-skin__art--none"), Pt);
      return;
    }
    const f = !!p && (!!l.busy || l.armed);
    if (g.hidden = !f, !f || !p) {
      g.replaceChildren();
      return;
    }
    const F = fl(p.player.cover), ne = F ? C("img", "", "ppp-skin__art") : C("span", "♪", "ppp-skin__art ppp-skin__art--none");
    F && (ne.src = F, ne.alt = "");
    const Se = C("span", "", "ppp-skin__t");
    Se.append(C("b", p.player.title), C("span", p.mode === "arrive" && p.from ? `A gift from ${p.from}` : p.player.subtitle || "Your album")), g.replaceChildren(ne, Se);
  }
  function Us(l, p, g) {
    var Je, Pt, pt, qe, Ue;
    const f = !!l.busy || l.armed, F = [...g];
    l.depositPending && l.arrival && F.push(tt(l.arrival)), l.error ? F.push(C("p", l.error, l.error === jl ? "ppp-warn" : "ppp-bad")) : l.message && !f ? F.push(C("p", l.message, "ppp-cyan")) : l.notice && F.push(C("p", l.notice, "ppp-warn")), p.mode === "open" && Le && ((Je = l.likeFunds) != null && Je.album) && l.likeFunds.low && !l.likeFunds.pending && F.push(C("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    let ne = "Kept on this device with Face ID or your passkey. No app or account needed.", Se = null, pe = null;
    if (p.mode === "locked")
      Se = { label: "Continue listening", run: () => {
        hn = zt(), c.unlock();
      } }, pe = { label: "Use a different passkey", run: () => {
        hn = null, c.unlock(!0);
      } };
    else if (p.mode === "arrive")
      if (l.step === "intro" && nl(Re) && Re.album === p.player.id) {
        const Ie = window.XtrataRadio, It = Xr(p.player)[0], Gt = Re.phase === "playing";
        Se = { label: Gt && !!((pt = (Pt = Ie == null ? void 0 : Ie.getState) == null ? void 0 : Pt.call(Ie)) != null && pt.playing) ? "Pause" : Gt ? "Carry on" : "Play the first song", run: () => {
          var Ko, Io;
          Gt ? (Ko = Ie == null ? void 0 : Ie.playPause) == null || Ko.call(Ie) : It && ((Io = Ie == null ? void 0 : Ie.playToken) == null || Io.call(Ie, It.id));
        } }, pe = { label: "Make my player and hear it all", run: () => void c.create() }, ne = "The first song is free. Nothing to set up yet.";
      } else if (l.step === "intro") {
        const Ie = Re.phase === "done" && Re.album === p.player.id;
        Ie && !F.length && F.push(C("p", "That was the first song. Make your player to hear the rest: one tap with Face ID or your fingerprint.", "ppp-cyan")), Se = { label: Ie ? "Keep listening" : "Open album", run: () => void c.create() }, pe = { label: "I've used Xtrata Music here before", run: () => void c.unlock(!0) };
      } else l.step === "locked" ? (Se = { label: "Open album", run: () => void c.unlock() }, pe = { label: "Use a different passkey", run: () => void c.unlock(!0) }) : l.step === "unsupported" ? F.push(C("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : F.length || F.push(C("p", "Opening your album…", "ppp-cyan"));
    return {
      mode: p.mode,
      player: p.player,
      from: p.from,
      offered: p.offered,
      // A newcomer opening a gifted album: where they are, as three lights. Not for someone who already has a player.
      step: p.mode === "arrive" && l.step === "intro" ? 1 : void 0,
      plays: p.mode === "open" ? l.balance === void 0 ? null : l.giftPlays : void 0,
      playsComing: l.depositPending,
      status: F,
      primary: Se,
      secondary: pe,
      hint: Se ? ne : void 0,
      asking: f,
      busy: !!l.busy,
      myPlays: xe(l),
      topUps: dl,
      canMake: !!((Ue = (qe = l.gate) == null ? void 0 : qe.gifts) != null && Ue.admin)
    };
  }
  const ar = document.getElementById("findBox"), Vh = document.getElementById("findBody"), Ea = ar && Vh ? zC(Vh, {
    load: () => fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((l) => l.ok ? l.json() : Promise.reject(new Error("catalogue unavailable"))).then((l) => DC(l == null ? void 0 : l.tracks, (p, g) => ({ title: qg(p, Ei(g.title) ? "" : g.title), artist: Vg(p, g.artist || "") }))),
    play: (l) => {
      var p, g;
      (g = (p = window.XtrataRadio) == null ? void 0 : p.playToken) == null || g.call(p, l);
    },
    current: () => {
      var p, g, f, F;
      const l = Number((F = (f = (g = (p = window.XtrataRadio) == null ? void 0 : p.getState) == null ? void 0 : g.call(p)) == null ? void 0 : f.nowPlaying) == null ? void 0 : F.tokenId);
      return Number.isSafeInteger(l) ? l : null;
    },
    locked: () => {
      var l;
      return !!((l = c.snapshot().albumLock) != null && l.locked);
    },
    explicit: (l) => {
      var p, g;
      return !!((g = (p = window.XtrataRadio) == null ? void 0 : p.isExplicit) != null && g.call(p, l));
    },
    liked: (l) => qh().has(l),
    grid: document.documentElement.hasAttribute("data-skin"),
    // the new look lists artist names three across
    // ...and draws them in their own section of Browse, under the listener's albums
    artistsMount: document.documentElement.hasAttribute("data-skin") && document.getElementById("artistBox") || void 0,
    leaveAlbum: () => S(0)
  }) : null;
  ar == null || ar.addEventListener("toggle", () => {
    ar.open && (Ea == null || Ea.load());
  });
  let Xh = "";
  const qh = () => {
    var p, g, f;
    const l = (f = (g = (p = window.XtrataRadio) == null ? void 0 : p.getState) == null ? void 0 : g.call(p)) == null ? void 0 : f.likes;
    return new Set(Array.isArray(l) ? l.map((F) => Number(F == null ? void 0 : F.tokenId)).filter(Number.isSafeInteger) : []);
  }, Yh = () => {
    var p, g, f, F, ne;
    if (!Ea || !(ar != null && ar.open)) return;
    const l = `${!!((p = c.snapshot().albumLock) != null && p.locked)}|${((ne = (F = (f = (g = window.XtrataRadio) == null ? void 0 : g.getState) == null ? void 0 : f.call(g)) == null ? void 0 : F.nowPlaying) == null ? void 0 : ne.tokenId) ?? ""}|${[...qh()].sort((Se, pe) => Se - pe).join(",")}`;
    l !== Xh && (Xh = l, Ea.refresh());
  }, Au = /* @__PURE__ */ new Map();
  let Wh = !1;
  const Zh = () => {
    const l = window.XtrataRadio;
    return l != null && l.subscribe ? (l.subscribe((p) => {
      const g = p == null ? void 0 : p.nowPlaying;
      if (g && Number.isSafeInteger(Number(g.tokenId)) && Au.set(Number(g.tokenId), { title: g.title || void 0, artist: g.artist || void 0 }), Yh(), mt) {
        const f = `${(g == null ? void 0 : g.tokenId) ?? ""}|${!!(p != null && p.playing)}`;
        f !== Ne && (Ne = f, Te(c.snapshot()));
      }
      if (nl(Re)) {
        const f = !!(p != null && p.playing);
        Jr({ kind: "now", track: g && g.tokenId != null ? String(g.tokenId) : null, playing: f, at: Date.now() }), f !== Wh && (Wh = f, Te(c.snapshot()));
      }
    }), !0) : !1;
  };
  if (!Zh()) {
    const l = setInterval(() => {
      Zh() && clearInterval(l);
    }, 500);
    setTimeout(() => clearInterval(l), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (l) => {
    const p = l.detail;
    if (nl(Re) && Jr({ kind: "listened", at: Date.now() }), p && Number.isSafeInteger(p.song) && typeof p.id == "string" && /^[0-9a-f]{32}$/.test(p.id)) {
      In();
      const g = Ro(p.song, Au.get(p.song));
      c.onListened({ song: p.song, id: p.id, title: g.title || void 0, artist: g.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void c.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || c.refresh();
  }), setInterval(() => {
    !document.hidden && (t || c.snapshot().step !== "off") && c.refresh();
  }, 15e3), c.refresh();
}
const tT = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", nT = () => {
  const e = !!window.chrome, t = window.navigator, n = t.vendor, r = typeof window.opr < "u", s = t.userAgent.includes("Edge"), o = /CriOS/.exec(t.userAgent), i = t.userAgent.includes("Mobile");
  return o ? !1 : e !== null && typeof e < "u" && n === "Google Inc." && r === !1 && s === !1 && i === !1;
}, rT = () => nT() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, oT = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, sT = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', u1 = class {
  constructor(e) {
    i$(this, e), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(e) {
    this.persistSelection && $A(e), this.callback(au(e));
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
    var r, s, o, i, a, c, u, h, d, w;
    return n === "IOS" ? (s = (r = e.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(e)) !== null && s !== void 0 ? s : e.webUrl : t === "Chrome" ? (i = (o = e.chromeWebStoreUrl) !== null && o !== void 0 ? o : this.getMobileUrl(e)) !== null && i !== void 0 ? i : e.webUrl : t === "Firefox" ? (c = (a = e.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(e)) !== null && c !== void 0 ? c : e.webUrl : n === "Android" ? (h = (u = e.googlePlayStoreUrl) !== null && u !== void 0 ? u : this.getBrowserUrl(e)) !== null && h !== void 0 ? h : e.webUrl : (w = (d = this.getBrowserUrl(e)) !== null && d !== void 0 ? d : e.webUrl) !== null && w !== void 0 ? w : this.getMobileUrl(e);
  }
  render() {
    const e = rT(), t = oT(), n = this.defaultProviders.filter(
      (o) => this.installedProviders.findIndex((i) => i.id === o.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return Qe("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, Qe("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), Qe("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, Qe("div", { class: "flex flex-col space-y-[10px]" }, Qe("div", { class: "flex items-center" }, Qe("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), Qe("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, Qe("span", { class: "sr-only" }, "Close popup"), Qe("img", { src: tT }))), r ? Qe("p", null, "Select the wallet you want to connect to.") : Qe("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !t && !e && Qe("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && Qe("div", { class: "mt-6" }, Qe("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), Qe("ul", { class: "space-y-3" }, this.installedProviders.map((o) => Qe("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Qe("div", { class: "aspect-square basis-9 overflow-hidden" }, Qe("img", { src: o.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Qe("div", { class: "flex-1" }, Qe("div", { class: "text-sm font-medium text-[#242629]" }, o.name), o.webUrl && Qe("a", { href: o.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(o.webUrl).hostname)), Qe("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(o.id) }, "Connect"))))), s && Qe("div", { class: "mt-6" }, r ? Qe("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : Qe("div", { class: "mb-5 flex justify-between" }, Qe("p", { class: "text-sm font-medium" }, "Recommended wallets"), Qe("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, Qe("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, Qe("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), Qe("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), Qe("p", null, "What is a wallet? ", Qe("span", { class: "align-text-bottom text-[9px]" }, "↗")))), Qe("ul", { class: "space-y-3" }, n.map((o) => Qe("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Qe("div", { class: "aspect-square basis-9 overflow-hidden" }, Qe("img", { src: o.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Qe("div", { class: "flex-1" }, Qe("div", { class: "text-sm font-medium text-[#242629]" }, o.name), o.webUrl && Qe("a", { href: o.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(o.webUrl).hostname)), this.getInstallUrl(o, e, t) && Qe("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(o, e, t), rel: "noopener noreferrer", target: "_blank" }, o.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return j4(this);
  }
};
u1.style = sT;
const iT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: u1
}, Symbol.toStringTag, { value: "Module" }));
